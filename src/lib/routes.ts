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
    ADMIN_MONITORING: "/dashboard/admin/monitoring",
    SUPER_ADMIN: "/dashboard/super-admin",
    CHALLENGE_ATTEMPT: (slug: string) => `/dashboard/challenges/${slug}`,
    CHALLENGE_RESULT: (attemptId: string) => `/dashboard/results/${attemptId}`,
  },

  // ─── MODERATOR ROUTES ────────────────────────────────────
  MODERATOR: {
    ROOT: "/dashboard/moderator",
    CHALLENGES: "/dashboard/moderator/challenges",
    CHALLENGE_CREATE: "/dashboard/moderator/challenges/create",
    CHALLENGE_EDIT: (id: string) => `/dashboard/moderator/challenges/${id}/edit`,
    QUESTIONS: "/dashboard/moderator/questions",
    QUESTION_CREATE: "/dashboard/moderator/questions/create",
    QUESTION_EDIT: (id: string) => `/dashboard/moderator/questions/${id}/edit`,
  },

  // ─── ADMIN ROUTES ─────────────────────────────────────────
  ADMIN: {
    ROOT: "/dashboard/admin",
    SETTINGS: "/dashboard/admin/settings",
    USERS: "/dashboard/admin/users",
    MODERATORS: "/dashboard/admin/moderators",
    MONITORING: "/dashboard/admin/monitoring",
    REPORTS: "/dashboard/admin/reports",
    INTELLIGENCE: "/dashboard/admin/intelligence",
  },

  // ─── SUPER ADMIN ROUTES ─────────────────────────────────────
  SUPER_ADMIN: {
    ROOT: "/dashboard/super-admin",
    HOME: "/dashboard/super-admin/home",
    SETTINGS: "/dashboard/super-admin/settings",
    FINANCIAL: "/dashboard/financials",
    PAYOUTS: "/dashboard/payouts",
    REVENUE: "/dashboard/revenue",
    SUBSCRIPTIONS: "/dashboard/subscriptions",
    ROLES: "/dashboard/roles",
    ADMIN_MANAGEMENT: "/dashboard/admin-management",
    USER_ROLES: "/dashboard/user-roles",
    INFRASTRUCTURE: "/dashboard/infrastructure",
    PLATFORM_SETTINGS: "/dashboard/platform-settings",
    FEATURE_FLAGS: "/dashboard/feature-flags",
    PLATFORM_ANALYTICS: "/dashboard/platform/analytics",
    PLATFORM_REPORTS: "/dashboard/platform/reports",
    MONITORING: "/dashboard/super-admin/monitoring",
  },

  // ─── ONBOARDING ──────────────────────────────────────────
  ONBOARDING: {
    ROOT: "/onboarding",
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
