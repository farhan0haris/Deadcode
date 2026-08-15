import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().optional(),
  AUTH_SECRET: z
    .string()
    .min(16, "AUTH_SECRET must be at least 16 characters (32+ recommended)")
    .optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  AUTH_URL: z.string().url().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  AUTH_TRUST_HOST: z.string().optional().default("true"),
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  
  // Rate Limiting Configuration
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  AUTH_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000), // 60s
  API_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(60),
  API_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000), // 60s
  SYNC_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  SYNC_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000), // 60s

  // Distributed Rate Limiting (Optional Upstash Redis)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function getValidatedEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Invalid environment variables configuration:", parsed.error.format());
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid production environment variables configuration.");
    }
  }
  return parsed.success ? parsed.data : (process.env as unknown as Env);
}

export const env = getValidatedEnv();

/**
 * Returns the effective auth secret with production safety check.
 */
export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET is required in production environment. Please configure it securely.");
    }
    return "deadcode_dev_fallback_secret_32_characters_min";
  }
  return secret;
}
