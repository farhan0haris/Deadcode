export type SecurityEventType =
  | "AUTH_SUCCESS"
  | "AUTH_FAILURE"
  | "AUTH_RATE_LIMIT"
  | "API_RATE_LIMIT"
  | "INVALID_INPUT"
  | "CSRF_FAILURE"
  | "UNAUTHORIZED_ACCESS"
  | "DATABASE_ERROR"
  | "SYNC_EVENT"
  | "SECURITY_HEADER_VIOLATION";

interface SecurityLogPayload {
  event: SecurityEventType;
  ip?: string;
  user?: string;
  path?: string;
  method?: string;
  details?: Record<string, any>;
  error?: string;
}

const SENSITIVE_KEYS = new Set([
  "password",
  "confirmPassword",
  "token",
  "secret",
  "pat",
  "githubPat",
  "authorization",
  "cookie",
  "sessionToken",
  "apiKey",
  "accessToken",
  "idToken",
]);

/**
 * Recursively redacts sensitive keys from log objects.
 */
export function sanitizeLogData(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeLogData);
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase()) || key.toLowerCase().includes("pass") || key.toLowerCase().includes("secret") || key.toLowerCase().includes("token")) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object") {
      sanitized[key] = sanitizeLogData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Centralized security event logger.
 */
export const securityLogger = {
  log(payload: SecurityLogPayload) {
    const entry = {
      timestamp: new Date().toISOString(),
      type: "SECURITY_EVENT",
      event: payload.event,
      ip: payload.ip || "unknown",
      user: payload.user || "anonymous",
      path: payload.path,
      method: payload.method,
      details: sanitizeLogData(payload.details),
      error: payload.error,
    };

    if (process.env.NODE_ENV !== "test") {
      console.log(JSON.stringify(entry));
    }
  },

  info(message: string, details?: Record<string, any>) {
    if (process.env.NODE_ENV !== "test") {
      console.log(`[INFO] ${message}`, details ? sanitizeLogData(details) : "");
    }
  },

  warn(event: SecurityEventType, message: string, details?: Record<string, any>) {
    this.log({
      event,
      details: { message, ...details },
    });
  },

  error(event: SecurityEventType, error: unknown, details?: Record<string, any>) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.log({
      event,
      error: errorMessage,
      details: sanitizeLogData(details),
    });
  },
};
