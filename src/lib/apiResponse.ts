import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { securityLogger } from "./logger";

export interface ApiResponseOptions {
  headers?: HeadersInit;
}

/**
 * Creates a standardized success JSON response.
 */
export function successResponse<T>(data: T, status = 200, options?: ApiResponseOptions): NextResponse {
  return NextResponse.json(
    {
      success: true,
      ...data,
    },
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
        ...options?.headers,
      },
    }
  );
}

/**
 * Creates a safe, standardized error JSON response masking internal details in production.
 */
export function errorResponse(
  error: unknown,
  fallbackMessage = "An unexpected error occurred. Please try again.",
  status = 500,
  options?: ApiResponseOptions
): NextResponse {
  // Handle Zod Validation Errors
  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    securityLogger.warn("INVALID_INPUT", "Schema validation failed", { errors: formattedErrors });

    return NextResponse.json(
      {
        success: false,
        error: "Validation failed: Please check the supplied input parameters.",
        details: formattedErrors,
      },
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      }
    );
  }

  // Log full error internally
  securityLogger.error("DATABASE_ERROR", error);

  // Return safe generic message in production or when status is 500
  const message =
    status >= 500 && process.env.NODE_ENV === "production"
      ? fallbackMessage
      : error instanceof Error
      ? error.message
      : fallbackMessage;

  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    {
      status,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    }
  );
}
