import { handlers } from "@/auth/auth";

/**
 * Auth API Route — Catch-all handler for NextAuth v5
 *
 * Handles all /api/auth/* routes including:
 * - GET  /api/auth/signin           → Login page
 * - POST /api/auth/callback        → OAuth callback
 * - GET  /api/auth/signout         → Signout
 * - POST /api/auth/signout         → Signout (CSRF)
 *
 * This exports the standardized handlers from the central auth configuration.
 */
export const { GET, POST } = handlers;
