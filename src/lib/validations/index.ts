import { z } from "zod";

/**
 * Strict GitHub Username validation:
 * - 1 to 39 characters
 * - Alphanumeric with single hyphens (cannot start/end with hyphen)
 */
export const githubUsernameSchema = z
  .string()
  .trim()
  .min(1, "GitHub username cannot be empty")
  .max(39, "GitHub username cannot exceed 39 characters")
  .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/, "Invalid GitHub username format");

/**
 * GitHub Token (PAT) format validation:
 * - Classical: ghp_... (40 chars)
 * - Fine-grained: github_pat_...
 * - Max 255 chars, alphanumeric with underscores
 */
export const githubTokenSchema = z
  .string()
  .trim()
  .max(255, "Token exceeds maximum length")
  .regex(/^[a-zA-Z0-9_.-]+$/, "Token contains invalid characters")
  .optional()
  .or(z.literal(""));

/**
 * Sync Payload Validation Schema
 */
export const syncPayloadSchema = z.object({
  username: githubUsernameSchema.optional(),
  token: githubTokenSchema.optional(),
});

export type SyncPayload = z.infer<typeof syncPayloadSchema>;

/**
 * Export Format Query Validation Schema
 */
export const exportQuerySchema = z.object({
  format: z.enum(["json", "csv", "md"]).default("json"),
});

export type ExportQuery = z.infer<typeof exportQuerySchema>;

/**
 * User Credentials Sign In Validation Schema
 */
export const loginCredentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address format")
    .max(254, "Email exceeds maximum length"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password cannot exceed 128 characters"),
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

/**
 * User Registration Validation Schema
 */
export const registerCredentialsSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters")
      .regex(/^[\p{L}\p{N}\s._'-]+$/u, "Name contains invalid characters"),
    username: githubUsernameSchema,
    email: z
      .string()
      .trim()
      .email("Invalid email address format")
      .max(254, "Email exceeds maximum length"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password cannot exceed 128 characters")
      .regex(/[A-Za-z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterCredentials = z.infer<typeof registerCredentialsSchema>;

/**
 * Profile Settings Schema
 */
export const userProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name cannot be empty")
    .max(100, "Name cannot exceed 100 characters"),
  username: githubUsernameSchema,
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(254),
  bio: z
    .string()
    .max(500, "Bio cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .max(100, "Location cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .trim()
    .url("Website must be a valid URL starting with http:// or https://")
    .max(255)
    .optional()
    .or(z.literal("")),
  github: githubUsernameSchema.optional().or(z.literal("")),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
