import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from '@/constants/routes';
import { cache } from "react";

/**
 * QuizArena — Session Retrieval & Redirect Utilities
 *
 * Provides reusable, type-safe session management for:
 * - Server components
 * - Server actions
 * - Route handlers
 * - Middleware
 *
 * All functions are memoized where appropriate to prevent
 * redundant database queries per request.
 */

// ─── Server-Side Session Retrieval ────────────────────────────

/**
 * Get the current authenticated session on the server.
 * Returns null if unauthenticated.
 * Safe to use in Server Components, Route Handlers, and Middleware.
 */
export const getServerSession = cache(async () => {
  return await auth();
});

/**
 * Get the current user from session.
 * Returns null if unauthenticated.
 */
export const getServerCurrentUser = cache(async () => {
  const session = await getServerSession();
  return session?.user ?? null;
});

/**
 * Require authentication — throws redirect if unauthenticated.
 * Use in Server Components, Server Actions, Route Handlers.
 *
 * @param redirectTo - Where to redirect if unauthenticated (default: /login)
 * @returns The authenticated user object
 */
export const requireAuth = cache(async (redirectTo: string = ROUTES.AUTH.SIGN_IN) => {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(redirectTo);
  }
  return session.user;
});

/**
 * Require admin role — throws redirect if not admin.
 * Use in admin-only Server Components and Actions.
 */
export const requireAdmin = cache(async () => {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    redirect(ROUTES.PROTECTED.DASHBOARD);
  }
  return user;
});

// ─── Onboarding Gate ──────────────────────────────────────

/**
 * Check if user has completed onboarding.
 * Returns true if onboarding is complete, false otherwise.
 * Safe to use in Server Components.
 */
export const isOnboardingComplete = cache(async (): Promise<boolean> => {
  const session = await getServerSession();
  if (!session?.user) return false;

  return session.user.onboardingCompleted ?? false;
});

/**
 * Redirect to onboarding if not complete.
 * Use in protected Server Components that require onboarding.
 */
export const requireOnboarding = cache(async () => {
  const isComplete = await isOnboardingComplete();
  if (!isComplete) {
    redirect(ROUTES.ONBOARDING.ROOT);
  }
});

// ─── Safe Redirect Helpers ──────────────────────────────────

/**
 * Validate redirect URL to prevent open redirect attacks.
 * Only allows same-origin URLs.
 */
export function validateRedirectUrl(
  url: string | null | undefined,
  fallback: string = ROUTES.PROTECTED.DASHBOARD
): string {
  if (!url) return fallback;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3004";
    const baseOrigin = new URL(baseUrl).origin;
    const parsed = new URL(url, baseOrigin);
    // Allow only same-origin paths (no external domains)
    if (parsed.origin === baseOrigin) {
      return parsed.pathname + parsed.search;
    }
  } catch {
    // Invalid URL — use fallback
  }

  return fallback;
}

/**
 * Build a safe login URL with callback URL preservation.
 */
export function buildLoginUrl(callbackUrl?: string): string {
  const loginUrl = ROUTES.AUTH.SIGN_IN;
  if (!callbackUrl) return loginUrl;

  const safeCallback = validateRedirectUrl(callbackUrl);
  const separator = loginUrl.includes("?") ? "&" : "?";
  return `${loginUrl}${separator}callbackUrl=${encodeURIComponent(safeCallback)}`;
}

// ─── Client-Side Auth State ────────────────────────────────

/**
 * Get client session hook (for use in "use client" components).
 * Wraps next-auth/react's useSession with type safety.
 */
export type { Session } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";
export { useSession, signIn, signOut };

import type { User as AuthUser } from "next-auth";
// Re-export types for convenience
export type { AuthUser };

/**
 * Auth state enumeration for client components
 */
export enum AuthStatus {
  LOADING = "loading",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
}

/**
 * Get the current auth status (for use in client components).
 */
export function useAuthStatus(): {
  status: AuthStatus;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
} {
  const { data: session, status } = useSession();

  return {
    status:
      status === "loading"
        ? AuthStatus.LOADING
        : status === "authenticated"
          ? AuthStatus.AUTHENTICATED
          : AuthStatus.UNAUTHENTICATED,
    user: session?.user ?? null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
