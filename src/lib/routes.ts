/**
 * QuizArena — Centralized Route Configuration
 *
 * All application routes are defined here for:
 * - Single source of truth for path management
 * - Scalable route organization
 * - Future RBAC compatibility
 * - Type-safe route references
 */

export const ROUTES = {
  // ─── AUTH ROUTES ─────────────────────────────────────────
  AUTH: {
    SIGN_IN: "/login",
    SIGN_UP: "/register",
    CALLBACK: "/api/auth/callback",
    SIGN_OUT: "/api/auth/signout",
  },

  // ─── PROTECTED ROUTES ────────────────────────────────────
  PROTECTED: {
    DASHBOARD: "/dashboard",
    PROFILE: "/profile",
    SETTINGS: "/settings",
    CHALLENGES: "/challenges",
    LEADERBOARD: "/leaderboard",
    ANALYTICS: "/analytics",
    SUBSCRIPTION: "/subscription",
    ADMIN: "/admin",
  },

  // ─── ONBOARDING ──────────────────────────────────────────
  ONBOARDING: {
    ROOT: "/onboarding",
    PROFILE_SETUP: "/onboarding/profile",
    PREFERENCES: "/onboarding/preferences",
    COMPLETE: "/onboarding/complete",
  },

  // ─── PUBLIC ROUTES ───────────────────────────────────────
  PUBLIC: {
    HOME: "/",
    PRICING: "/pricing",
    FAQ: "/faq",
    TERMS: "/terms",
    PRIVACY: "/privacy",
    CONTACT: "/contact",
  },
} as const;

/**
 * Helper type for route keys
 */
export type RouteKey = keyof typeof ROUTES;
export type AuthRouteKey = keyof typeof ROUTES.AUTH;
export type ProtectedRouteKey = keyof typeof ROUTES.PROTECTED;
export type PublicRouteKey = keyof typeof ROUTES.PUBLIC;
export type OnboardingRouteKey = keyof typeof ROUTES.ONBOARDING;

/**
 * Route access levels for future RBAC
 */
export const ROUTE_ACCESS: Record<string, string[]> = {
  [ROUTES.PROTECTED.DASHBOARD]: ["USER", "ADMIN"],
  [ROUTES.PROTECTED.PROFILE]: ["USER", "ADMIN"],
  [ROUTES.PROTECTED.SETTINGS]: ["USER", "ADMIN"],
  [ROUTES.PROTECTED.CHALLENGES]: ["USER", "ADMIN"],
  [ROUTES.PROTECTED.LEADERBOARD]: ["USER", "ADMIN"],
  [ROUTES.PROTECTED.ANALYTICS]: ["USER", "ADMIN"],
  [ROUTES.PROTECTED.SUBSCRIPTION]: ["USER", "ADMIN"],
  [ROUTES.PROTECTED.ADMIN]: ["ADMIN"],
  [ROUTES.ONBOARDING.ROOT]: ["USER", "ADMIN"],
};
