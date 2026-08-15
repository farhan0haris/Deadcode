import { env } from "./env";
import { securityLogger } from "./logger";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // Unix timestamp in ms
  retryAfter: number; // Seconds
}

interface RateLimitRecord {
  timestamps: number[];
  consecutiveFailures: number;
  blockedUntil?: number;
}

// In-memory sliding window cache with automatic periodic sweep
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 300_000);
      if (record.timestamps.length === 0 && (!record.blockedUntil || record.blockedUntil < now)) {
        rateLimitStore.delete(key);
      }
    }
  }, 300_000);
}

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
  isAuthAttempt?: boolean;
}

/**
 * Checks and updates rate limit for a given key using sliding-window algorithm.
 */
export async function checkRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const { key, limit, windowMs, isAuthAttempt } = options;
  const now = Date.now();

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [], consecutiveFailures: 0 };
    rateLimitStore.set(key, record);
  }

  // Check exponential backoff lock if applicable
  if (record.blockedUntil && record.blockedUntil > now) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    securityLogger.warn("AUTH_RATE_LIMIT", "Blocked by exponential backoff", { key, retryAfter });
    return {
      success: false,
      limit,
      remaining: 0,
      resetTime: record.blockedUntil,
      retryAfter,
    };
  }

  // Filter timestamps within the current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    // If auth failure limit hit, apply exponential backoff
    if (isAuthAttempt) {
      record.consecutiveFailures += 1;
      const backoffMultiplier = Math.min(Math.pow(2, record.consecutiveFailures - 1), 32); // Max 32x
      const backoffDuration = Math.min(windowMs * backoffMultiplier, 3_600_000); // Max 1 hour
      record.blockedUntil = now + backoffDuration;

      const retryAfter = Math.ceil(backoffDuration / 1000);
      securityLogger.warn("AUTH_RATE_LIMIT", "Auth rate limit exceeded with backoff", {
        key,
        failures: record.consecutiveFailures,
        retryAfter,
      });

      return {
        success: false,
        limit,
        remaining: 0,
        resetTime: record.blockedUntil,
        retryAfter,
      };
    }

    const oldestTimestamp = record.timestamps[0] || now;
    const resetTime = oldestTimestamp + windowMs;
    const retryAfter = Math.ceil((resetTime - now) / 1000);

    securityLogger.warn("API_RATE_LIMIT", "API rate limit exceeded", { key, retryAfter });

    return {
      success: false,
      limit,
      remaining: 0,
      resetTime,
      retryAfter: Math.max(retryAfter, 1),
    };
  }

  // Record this request timestamp
  record.timestamps.push(now);

  const remaining = Math.max(0, limit - record.timestamps.length);
  const resetTime = now + windowMs;

  return {
    success: true,
    limit,
    remaining,
    resetTime,
    retryAfter: 0,
  };
}

/**
 * Resets failure counters on successful authentication
 */
export function recordAuthSuccess(key: string) {
  const record = rateLimitStore.get(key);
  if (record) {
    record.consecutiveFailures = 0;
    delete record.blockedUntil;
  }
}

/**
 * Generates standard rate limit headers
 */
export function getRateLimitHeaders(result: RateLimitResult): HeadersInit {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetTime / 1000)),
  };

  if (!result.success && result.retryAfter > 0) {
    headers["Retry-After"] = String(result.retryAfter);
  }

  return headers;
}
