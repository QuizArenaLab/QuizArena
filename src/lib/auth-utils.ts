/**
 * QuizArena — Authorization Utilities
 *
 * Reusable server-side authorization patterns for:
 * - Server Actions
 * - Route Handlers
 * - Protected API endpoints
 */

import { getServerSession, requireAuth, requireAdmin, AuthUser } from "./session-utils";
import { EnvironmentService } from "@/platform/env/EnvironmentService";

// ─── Authorization Result Patterns ───────────────────────────

/**
 * Standardized API response for authorization failures.
 * Use this in all protected API routes.
 */
export function unauthorizedResponse(message: string = "Unauthorized") {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Standardized API response for forbidden access.
 */
export function forbiddenResponse(message: string = "Forbidden") {
  return new Response(JSON.stringify({ error: message }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Standardized API response for session expiry / not found.
 */
export function notFoundResponse(message: string = "Not found") {
  return new Response(JSON.stringify({ error: message }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}

// ─── Server Action Auth ──────────────────────────────────────

/**
 * Get the authenticated user in a Server Action context.
 * Throws a redirect if unauthenticated.
 */
export async function getUserInAction() {
  return await requireAuth();
}

/**
 * Safe pattern: validate session, then execute action.
 *
 * @example
 * ```ts
 * const result = await withAuth(async (user) => {
 *   return await prisma.quiz.create({ data: { userId: user.id } });
 * });
 * ```
 */
export async function withAuth<T>(action: (user: AuthUser) => Promise<T>): Promise<T> {
  const user = await requireAuth();
  return await action(user);
}

/**
 * Admin-only action wrapper.
 */
export async function withAdmin<T>(action: (user: AuthUser) => Promise<T>): Promise<T> {
  const user = await requireAdmin();
  return await action(user);
}

// ─── Protected API Route Pattern ─────────────────────────────

/**
 * Validate an API request and return the authenticated user.
 * Use this at the top of every protected API route handler.
 *
 * @example
 * ```ts
 * export async function GET(request: Request) {
 *   const auth = await validateApiRequest(request);
 *   if (auth instanceof Response) return auth; // unauthorized
 *   // auth is now the User object
 *   return Response.json({ data: ... });
 * }
 * ```
 */
export async function validateApiRequest(
  request: Request,
  options?: { requireRole?: "USER" | "ADMIN" }
): Promise<AuthUser | Response> {
  const session = await getServerSession();

  if (!session?.user) {
    return unauthorizedResponse();
  }

  if (options?.requireRole && session.user.role !== options.requireRole) {
    return forbiddenResponse();
  }

  return session.user as AuthUser;
}

// ─── Middleware Auth Check (for edge-compatible use) ──────────

/**
 * Extract and validate auth token from request headers.
 * For API routes that need token-based auth in addition to cookies.
 */
export function getAuthTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}

// ─── Request Context Helpers ──────────────────────────────────

/**
 * Get the client IP address from request headers.
 * Useful for rate limiting and logging.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * Validate that the request originates from same origin.
 * Prevents CSRF in state-changing operations.
 */
export function isValidOrigin(request: Request): boolean {
  const origin = request.headers.get("Origin");
  const host = EnvironmentService.getOrigin();

  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(host).origin;
  } catch {
    return false;
  }
}
