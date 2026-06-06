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
    ARENA: "/arena",
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
    REPORTS: "/dashboard/admin/moderation",
    INTELLIGENCE: "/dashboard/admin/intelligence",
    QUESTION_BANK: "/dashboard/admin/question-bank",
    QUESTION_BANK_CREATE: "/dashboard/admin/question-bank/create",
    QUESTION_BANK_REVIEW: "/dashboard/admin/question-bank/review",
    QUESTION_BANK_DETAIL: (id: string) => `/dashboard/admin/question-bank/${id}`,
    QUESTIONS: "/dashboard/admin/questions",
    QUESTIONS_CREATE: "/dashboard/admin/questions/create",
    QUESTIONS_IMPORT: "/dashboard/admin/questions/import",
    QUESTIONS_REVIEW: "/dashboard/admin/questions/review",
    QUESTIONS_DRAFTS: "/dashboard/admin/questions/drafts",
    QUESTIONS_PUBLISHED: "/dashboard/admin/questions/published",
    QUESTIONS_ARCHIVE: "/dashboard/admin/questions/archive",
    QUESTIONS_IMPORT_JOBS: "/dashboard/admin/questions/import-jobs",
  },

  // ─── SUPER ADMIN ROUTES ─────────────────────────────────────────
  // ALL super-admin routes MUST live under /dashboard/super-admin/*
  // Route isolation is SECURITY-CRITICAL.
  SUPER_ADMIN: {
    ROOT: "/dashboard/super-admin",
    HOME: "/dashboard/super-admin/home",
    COMMAND_CENTER: "/dashboard/super-admin/home",
    // Financial Control
    FINANCIAL: "/dashboard/super-admin/financial",
    // Infrastructure
    INFRASTRUCTURE: "/dashboard/super-admin/infrastructure",
    // Security Center
    SECURITY: "/dashboard/super-admin/security",
    MONITORING: "/dashboard/super-admin/monitoring",
    // Governance
    GOVERNANCE: "/dashboard/super-admin/governance",
    ROLES: "/dashboard/super-admin/roles",
    INTELLIGENCE: "/dashboard/super-admin/intelligence",
    // Compliance
    COMPLIANCE: "/dashboard/super-admin/compliance",
    // Platform Controls
    PLATFORM_CONTROLS: "/dashboard/super-admin/platform-controls",
    // Settings
    SETTINGS: "/dashboard/super-admin/settings",
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
  [ROUTES.PROTECTED.ARENA]: ["USER", "ADMIN"],
  [ROUTES.PROTECTED.LEADERBOARD]: ["USER", "ADMIN"],
  [ROUTES.PROTECTED.ANALYTICS]: ["USER", "ADMIN"],
  [ROUTES.PROTECTED.SUBSCRIPTION]: ["USER", "ADMIN"],
  [ROUTES.PROTECTED.ADMIN]: ["ADMIN"],
  [ROUTES.ONBOARDING.ROOT]: ["USER", "ADMIN"],
};
