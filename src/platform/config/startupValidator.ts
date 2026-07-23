import { EnvironmentService } from "@/platform/env/EnvironmentService";

export function validateStartupConfig() {
  const isProd = EnvironmentService.isProduction();
  
  const requiredEnvVars = ["DATABASE_URL", "NEXTAUTH_SECRET"];
  
  if (isProd) {
    requiredEnvVars.push("NEXT_PUBLIC_APP_URL");
  }

  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingVars.length > 0) {
    console.error("===========================================================");
    console.error("🔥 FATAL ERROR: Missing Required Environment Variables 🔥");
    console.error("===========================================================");
    console.error("The following environment variables must be set:");
    missingVars.forEach((v) => console.error(` - ${v}`));
    console.error("===========================================================");

    // In production, we actually exit to prevent booting in a broken state
    if (isProd) {
      process.exit(1);
    } else {
      console.warn(
        "⚠️  Running in non-production mode without required vars. Some features will crash."
      );
    }
  }
}
