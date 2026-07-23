/**
 * QuizArena — Environment Resolution Service
 * 
 * The single source of truth for all environment detection and origin resolution.
 * Strictly enforces environment isolation to prevent cross-environment leakage.
 */
export class EnvironmentService {
  /**
   * Returns the exact, dynamic origin bound to the active request.
   * This is mathematically safe from .env shadowing because it relies on the incoming request headers.
   * 
   * @note Calling this in a React Server Component opts the route into dynamic rendering.
   */
  static getOrigin(): string {
    // 1. Client-Side fallback
    if (typeof window !== "undefined") {
      return window.location.origin;
    }

    // 2. Dynamic Server Context (Absolute fidelity to current request)
    try {
      // Dynamic require to prevent client-side bundling errors
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { headers } = require("next/headers");
      const headersList = headers();
      const host = headersList.get("x-forwarded-host") || headersList.get("host");
      const protocol = headersList.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");

      if (host) {
        return `${protocol}://${host}`;
      }
    } catch (error) {
      // headers() throws if called outside request context (e.g., static generation)
      // We catch and gracefully fallback to the canonical origin.
    }

    return this.getCanonicalOrigin();
  }

  /**
   * Returns the canonical static origin based on build-time environment variables.
   * Used for static contexts like sitemaps or background jobs where `headers()` is unavailable.
   */
  static getCanonicalOrigin(): string {
    if (this.isProduction() && process.env.VERCEL_ENV === "production") {
      return process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    if (this.isPreview()) {
      return `https://${process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL}`;
    }

    // Local Development or Local Production (npm start)
    return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3004";
  }

  /**
   * Determines the active environment using Vercel primitives and NODE_ENV.
   */
  static getEnvironment(): "development" | "preview" | "production" {
    if (process.env.VERCEL_ENV === "production") return "production";
    if (process.env.VERCEL_ENV === "preview") return "preview";

    if (process.env.NODE_ENV === "production") return "production"; // e.g. local npm start

    return "development";
  }

  static isDevelopment(): boolean {
    return this.getEnvironment() === "development";
  }

  static isPreview(): boolean {
    return this.getEnvironment() === "preview";
  }

  static isProduction(): boolean {
    return this.getEnvironment() === "production";
  }
}
