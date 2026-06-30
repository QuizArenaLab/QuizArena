import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url().optional(), // Optional since Vercel automatically sets NEXT_PUBLIC_VERCEL_URL

  // Providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),

  // Super Admin Configuration
  SUPER_ADMIN_EMAIL: z.string().email().optional(),

  // Environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  
  // Feature Flags
  FEATURE_COMPETITION_STUDIO: z.string().optional().default("true"),
});

// Cache the parsed environment variables
let envParsed: z.infer<typeof envSchema> | null = null;

export function validateEnv() {
  if (envParsed) return envParsed;

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  envParsed = parsed.data;
  return envParsed;
}

// Automatically validate on import in development or build
if (process.env.NODE_ENV !== "production") {
  validateEnv();
}
