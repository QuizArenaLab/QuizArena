/**
 * QuizArena — Super Admin Session Hardening
 *
 * Hardened session validation for sovereign authority operations.
 * Architecture: DB-authoritative, fail-closed, extensible for MFA / device trust.
 *
 * Future-ready for:
 * - MFA verification
 * - Device fingerprinting
 * - IP validation
 * - Session fingerprinting
 * - Reauth enforcement for sensitive operations
 */

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES, type Role } from "@/features/rbac/services/roles";
import { hasRole } from "@/features/rbac/services/hierarchy";

// ─── Configuration ───────────────────────────────────────────────────────────

export interface SuperAdminSessionConfig {
  /** Validate role against database (always true in production) */
  enableDBValidation: boolean;
  /** Check for stale session (session role ≠ DB role) */
  enableStaleSessionDetection: boolean;
  /** Maximum session age in seconds */
  maxSessionAgeSeconds: number;
  /** Require re-authentication for sensitive actions */
  requireReauthForSensitive: boolean;
  /**
   * Future: Enable IP validation
   * @default false — not yet implemented
   */
  enableIPValidation: boolean;
  /**
   * Future: Enable device fingerprint verification
   * @default false — not yet implemented
   */
  enableDeviceVerification: boolean;
  /**
   * Future: Enable MFA requirement
   * @default false — not yet implemented
   */
  requireMFA: boolean;
}

export const DEFAULT_SESSION_CONFIG: SuperAdminSessionConfig = {
  enableDBValidation: true,
  enableStaleSessionDetection: true,
  maxSessionAgeSeconds: 86400, // 24 hours
  requireReauthForSensitive: false, // Future
  enableIPValidation: false, // Future
  enableDeviceVerification: false, // Future
  requireMFA: false, // Future
} as const;

export const HARDENED_SESSION_CONFIG: SuperAdminSessionConfig = {
  ...DEFAULT_SESSION_CONFIG,
  maxSessionAgeSeconds: 3600, // 1 hour for hardened contexts
  requireReauthForSensitive: true,
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export type SessionValidationReason =
  | "NO_SESSION"
  | "NO_USER_ID"
  | "EMAIL_MISMATCH"
  | "ROLE_NOT_SUPER_ADMIN"
  | "USER_NOT_IN_DB"
  | "STALE_SESSION_ROLE_MISMATCH"
  | "DB_ROLE_REVOKED"
  | "VALIDATION_ERROR";

export interface SuperAdminSessionValidation {
  valid: boolean;
  reason?: SessionValidationReason;
  userId?: string;
  role?: Role;
  email?: string;
  /** True when DB verification was performed */
  dbVerified: boolean;
  /** True when stale session check passed */
  sessionFresh: boolean;
}

// ─── Core Session Validation ─────────────────────────────────────────────────

/**
 * Validate super admin session with configurable hardening.
 * This is the primary session authority check.
 */
export const validateSuperAdminSession = async (
  config: SuperAdminSessionConfig = DEFAULT_SESSION_CONFIG
): Promise<SuperAdminSessionValidation> => {
  try {
    const session = await auth();

    if (!session) {
      return { valid: false, reason: "NO_SESSION", dbVerified: false, sessionFresh: false };
    }

    if (!session.user?.id) {
      return { valid: false, reason: "NO_USER_ID", dbVerified: false, sessionFresh: false };
    }

    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;

    if (!superAdminEmail || session.user.email !== superAdminEmail) {
      return { valid: false, reason: "EMAIL_MISMATCH", dbVerified: false, sessionFresh: false };
    }

    const sessionRole = (session.user.role as Role) ?? ROLES.USER;

    if (!hasRole(sessionRole, ROLES.SUPER_ADMIN)) {
      return {
        valid: false,
        reason: "ROLE_NOT_SUPER_ADMIN",
        dbVerified: false,
        sessionFresh: false,
      };
    }

    if (!config.enableDBValidation) {
      return {
        valid: true,
        userId: session.user.id,
        role: sessionRole,
        email: session.user.email ?? superAdminEmail,
        dbVerified: false,
        sessionFresh: true,
      };
    }

    // DB-authoritative validation
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, email: true },
    });

    if (!dbUser) {
      return {
        valid: false,
        reason: "USER_NOT_IN_DB",
        dbVerified: false,
        sessionFresh: false,
      };
    }

    const dbRole = dbUser.role as Role;

    // Stale session detection
    if (config.enableStaleSessionDetection && sessionRole !== dbRole) {
      return {
        valid: false,
        reason: "STALE_SESSION_ROLE_MISMATCH",
        userId: session.user.id,
        role: dbRole,
        dbVerified: true,
        sessionFresh: false,
      };
    }

    if (!hasRole(dbRole, ROLES.SUPER_ADMIN)) {
      return {
        valid: false,
        reason: "DB_ROLE_REVOKED",
        userId: session.user.id,
        role: dbRole,
        dbVerified: true,
        sessionFresh: false,
      };
    }

    return {
      valid: true,
      userId: session.user.id,
      role: dbRole,
      email: dbUser.email ?? superAdminEmail,
      dbVerified: true,
      sessionFresh: true,
    };
  } catch (error) {
    console.error("[SUPER_ADMIN SESSION] Validation error:", error);
    return { valid: false, reason: "VALIDATION_ERROR", dbVerified: false, sessionFresh: false };
  }
};

/**
 * Get full session context for super admin.
 * Returns null if session is invalid.
 */
export const getSuperAdminSessionContext = async (
  config: SuperAdminSessionConfig = DEFAULT_SESSION_CONFIG
): Promise<{
  userId: string;
  role: Role;
  email: string;
  dbVerified: boolean;
  sessionFresh: boolean;
} | null> => {
  const validation = await validateSuperAdminSession(config);

  if (!validation.valid || !validation.userId || !validation.role) {
    return null;
  }

  return {
    userId: validation.userId,
    role: validation.role,
    email: validation.email ?? "",
    dbVerified: validation.dbVerified,
    sessionFresh: validation.sessionFresh,
  };
};

/**
 * Quick session check — returns boolean.
 * Use for lightweight checks; prefer validateSuperAdminSession for full context.
 */
export const isSuperAdminSessionValid = async (): Promise<boolean> => {
  const validation = await validateSuperAdminSession();
  return validation.valid;
};
