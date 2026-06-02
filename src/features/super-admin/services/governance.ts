/**
 * QuizArena — Super Admin Governance Utilities
 *
 * Centralized sovereignty layer for all SUPER_ADMIN authority validation.
 * ALL super-admin operations MUST flow through this module.
 *
 * Architecture: Server-authoritative. Frontend restrictions are UX only.
 * Security: Fail-closed by default. Deny unless explicitly authorized.
 */

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES, type Role } from "@/features/rbac/services/roles";
import { hasRole } from "@/features/rbac/services/hierarchy";
import { redirect } from "next/navigation";
import { logSuperAdminAudit, type SuperAdminAuditCategory } from "./audit";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SuperAdminErrorCode =
  | "NOT_AUTHENTICATED"
  | "NOT_SUPER_ADMIN"
  | "SESSION_INVALIDATED"
  | "ROLE_REVOKED"
  | "STALE_SESSION"
  | "ACCESS_DENIED"
  | "DATABASE_ERROR"
  | "EMAIL_MISMATCH";

export interface SuperAdminContext {
  userId: string;
  role: Role;
  email: string;
  sessionVerified: boolean;
  dbVerified: boolean;
}

export interface SuperAdminValidationResult {
  authorized: boolean;
  context?: SuperAdminContext;
  reason?: SuperAdminErrorCode;
}

// ─── Core Validation ─────────────────────────────────────────────────────────

/**
 * Primary sovereignty validation.
 * DB-authoritative: session role MUST match database role.
 * Email-authoritative: user MUST match ADMIN_EMAIL environment variable.
 */
export const validateSuperAdmin = async (): Promise<SuperAdminValidationResult> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { authorized: false, reason: "NOT_AUTHENTICATED" };
    }

    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;

    // Email-level sovereignty check
    if (!superAdminEmail || session.user.email !== superAdminEmail) {
      return {
        authorized: false,
        reason: "EMAIL_MISMATCH",
      };
    }

    const sessionRole = (session.user.role as Role) ?? ROLES.USER;

    // Session-level role check
    if (!hasRole(sessionRole, ROLES.SUPER_ADMIN)) {
      return { authorized: false, reason: "NOT_SUPER_ADMIN" };
    }

    // DB-authoritative validation — source of truth
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, email: true },
    });

    if (!dbUser) {
      return { authorized: false, reason: "SESSION_INVALIDATED" };
    }

    const dbRole = dbUser.role as Role;

    // Stale session detection: session role must match DB role
    if (sessionRole !== dbRole) {
      return {
        authorized: false,
        reason: "STALE_SESSION",
      };
    }

    // DB role sovereignty check
    if (!hasRole(dbRole, ROLES.SUPER_ADMIN)) {
      return { authorized: false, reason: "ROLE_REVOKED" };
    }

    return {
      authorized: true,
      context: {
        userId: session.user.id,
        role: dbRole,
        email: dbUser.email ?? session.user.email ?? superAdminEmail,
        sessionVerified: true,
        dbVerified: true,
      },
    };
  } catch (error) {
    console.error("[SUPER_ADMIN GOVERNANCE] Validation error:", error);
    return { authorized: false, reason: "DATABASE_ERROR" };
  }
};

/**
 * Require super admin access — throws redirect on failure.
 * Use in Server Components and Server Actions.
 */
export const requireSuperAdmin = async (
  redirectTo: string = "/dashboard"
): Promise<SuperAdminContext> => {
  const result = await validateSuperAdmin();

  if (!result.authorized || !result.context) {
    redirect(redirectTo);
  }

  return result.context;
};

/**
 * Assert super admin access — throws error on failure.
 * Use in Server Actions where redirect is not appropriate.
 */
export const assertSuperAdmin = async (): Promise<SuperAdminContext> => {
  const result = await validateSuperAdmin();

  if (!result.authorized || !result.context) {
    throw new SuperAdminGovernanceError(
      result.reason ?? "ACCESS_DENIED",
      result.reason ?? "ACCESS_DENIED"
    );
  }

  return result.context;
};

/**
 * Log a super admin action with automatic context resolution.
 * All SUPER_ADMIN operations MUST call this.
 */
export const logSuperAdminAction = async (
  action: string,
  category: SuperAdminAuditCategory,
  details?: Record<string, unknown>,
  riskSeverity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" = "HIGH"
): Promise<void> => {
  try {
    const result = await validateSuperAdmin();

    if (!result.authorized || !result.context) {
      console.warn("[SUPER_ADMIN AUDIT] Cannot log action: unauthorized actor");
      return;
    }

    await logSuperAdminAudit({
      actorId: result.context.userId,
      actorRole: result.context.role,
      actorEmail: result.context.email,
      action,
      category,
      details,
      riskSeverity,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("[SUPER_ADMIN AUDIT] Failed to log action:", error);
  }
};

/**
 * Route-level protection helper.
 * Returns true if the route is protected by super-admin authority.
 */
export const protectSuperAdminRoute = async (pathname: string): Promise<boolean> => {
  if (!isSuperAdminPath(pathname)) return true;
  const result = await validateSuperAdmin();
  return result.authorized;
};

/**
 * Check if a given pathname falls under super-admin authority.
 */
export const isSuperAdminPath = (pathname: string): boolean => {
  return pathname.startsWith("/dashboard/super-admin");
};

// ─── Error Class ─────────────────────────────────────────────────────────────

export class SuperAdminGovernanceError extends Error {
  constructor(
    message: string,
    public readonly code: SuperAdminErrorCode
  ) {
    super(message);
    this.name = "SuperAdminGovernanceError";
  }
}
