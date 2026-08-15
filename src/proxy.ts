import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit, getRateLimitHeaders } from "./lib/rateLimit";
import { env } from "./lib/env";
import { securityLogger } from "./lib/logger";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // 1. CORS Origin Verification for API routes
  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
          securityLogger.warn("SECURITY_HEADER_VIOLATION", "Cross-origin request blocked", {
            origin,
            host,
            pathname,
          });
          return new NextResponse(
            JSON.stringify({ success: false, error: "Cross-Origin Request Blocked" }),
            {
              status: 403,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      } catch {
        return new NextResponse(
          JSON.stringify({ success: false, error: "Invalid Origin header" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
  }

  // 2. Global Rate Limiting for API routes
  if (pathname.startsWith("/api/")) {
    let limit = env.API_RATE_LIMIT_MAX;
    let windowMs = env.API_RATE_LIMIT_WINDOW_MS;
    let isAuthAttempt = false;

    if (pathname.startsWith("/api/auth/")) {
      limit = env.AUTH_RATE_LIMIT_MAX;
      windowMs = env.AUTH_RATE_LIMIT_WINDOW_MS;
      isAuthAttempt = true;
    } else if (pathname.startsWith("/api/sync")) {
      limit = env.SYNC_RATE_LIMIT_MAX;
      windowMs = env.SYNC_RATE_LIMIT_WINDOW_MS;
    }

    const rateLimitKey = `${pathname}:${ip}`;
    const rateLimitResult = await checkRateLimit({
      key: rateLimitKey,
      limit,
      windowMs,
      isAuthAttempt,
    });

    if (!rateLimitResult.success) {
      const responseHeaders = getRateLimitHeaders(rateLimitResult);
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Too many requests. Please slow down and try again later.",
          retryAfter: rateLimitResult.retryAfter,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            ...responseHeaders,
          },
        }
      );
    }

    const response = NextResponse.next();
    const rateHeaders = getRateLimitHeaders(rateLimitResult);
    for (const [k, v] of Object.entries(rateHeaders)) {
      response.headers.set(k, v as string);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
