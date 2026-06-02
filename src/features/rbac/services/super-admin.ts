import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES, type Role } from "./roles";
import { hasRole, isSuperAdmin as checkIsSuperAdmin } from "./hierarchy";
import { redirect } from "next/navigation";
import { ROUTES } from '@/constants/routes';

export class SuperAdminSecurityError extends Error {
  constructor(
    message: string,
    public readonly code: SuperAdminErrorCode
  ) {
    super(message);
    this.name = "SuperAdminSecurityError";
  }
}

export type SuperAdminErrorCode =
  | "NOT_AUTHENTICATED"
  | "NOT_SUPER_ADMIN"
  | "SESSION_INVALIDATED"
  | "ROLE_REVOKED"
  | "ACCESS_DENIED"
  | "DATABASE_ERROR";

export interface SuperAdminValidationResult {
  authorized: boolean;
  userId?: string;
  role?: Role;
  reason?: string;
}

export const SUPER_ADMIN_ROUTES = [
  "/dashboard/super-admin",
  "/super-admin",
  "/dashboard/platform",
  "/platform",
] as const;

export const FINANCIAL_ROUTES = [
  "/dashboard/financials",
  "/financials",
  "/dashboard/payouts",
  "/payouts",
  "/dashboard/revenue",
  "/revenue",
  "/dashboard/subscriptions",
  "/subscription-management",
] as const;

export const INFRASTRUCTURE_ROUTES = [
  "/dashboard/infrastructure",
  "/infrastructure",
  "/dashboard/feature-flags",
  "/feature-flags",
  "/dashboard/environment",
  "/environment",
  "/dashboard/maintenance",
  "/maintenance",
  "/dashboard/platform-settings",
  "/platform-settings",
] as const;

export const ROLE_MANAGEMENT_ROUTES = [
  "/dashboard/roles",
  "/roles",
  "/dashboard/user-roles",
  "/user-roles",
  "/dashboard/admin-management",
  "/admin-management",
] as const;

export const isSuperAdminRoute = (pathname: string): boolean => {
  return SUPER_ADMIN_ROUTES.some((route) => pathname.startsWith(route));
};

export const isFinancialRoute = (pathname: string): boolean => {
  return FINANCIAL_ROUTES.some((route) => pathname.startsWith(route));
};

export const isInfrastructureRoute = (pathname: string): boolean => {
  return INFRASTRUCTURE_ROUTES.some((route) => pathname.startsWith(route));
};

export const isRoleManagementRoute = (pathname: string): boolean => {
  return ROLE_MANAGEMENT_ROUTES.some((route) => pathname.startsWith(route));
};

export const validateSuperAdminAccess = async (): Promise<SuperAdminValidationResult> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { authorized: false, reason: "NOT_AUTHENTICATED" };
    }

    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    if (!superAdminEmail || session.user.email !== superAdminEmail) {
      return {
        authorized: false,
        reason: "NOT_SUPER_ADMIN",
        role: (session.user.role as Role) ?? ROLES.USER,
      };
    }

    const sessionRole = (session.user.role as Role) ?? ROLES.USER;

    if (!hasRole(sessionRole, ROLES.SUPER_ADMIN)) {
      return { authorized: false, reason: "NOT_SUPER_ADMIN", role: sessionRole };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true },
    });

    if (!dbUser) {
      return { authorized: false, reason: "SESSION_INVALIDATED" };
    }

    const dbRole = dbUser.role as Role;

    if (!hasRole(dbRole, ROLES.SUPER_ADMIN)) {
      return { authorized: false, reason: "ROLE_REVOKED", role: dbRole };
    }

    return {
      authorized: true,
      userId: session.user.id,
      role: dbRole,
    };
  } catch (error) {
    console.error("SuperAdmin validation error:", error);
    return { authorized: false, reason: "DATABASE_ERROR" };
  }
};

export const requireSuperAdmin = async (
  redirectTo: string = ROUTES.PROTECTED.DASHBOARD
): Promise<{ userId: string; role: Role }> => {
  const validation = await validateSuperAdminAccess();

  if (!validation.authorized) {
    redirect(redirectTo);
  }

  return { userId: validation.userId!, role: validation.role! };
};

export const isSuperAdmin = async (): Promise<boolean> => {
  const validation = await validateSuperAdminAccess();
  return validation.authorized;
};

export const assertSuperAdmin = async (): Promise<{ userId: string; role: Role }> => {
  const validation = await validateSuperAdminAccess();

  if (!validation.authorized) {
    throw new SuperAdminSecurityError(
      validation.reason ?? "Access denied",
      (validation.reason as SuperAdminErrorCode) ?? "ACCESS_DENIED"
    );
  }

  return { userId: validation.userId!, role: validation.role! };
};

export const checkSuperAdminAccess = async (): Promise<{
  authorized: boolean;
  user: { id: string; role: Role } | null;
}> => {
  const validation = await validateSuperAdminAccess();

  if (!validation.authorized) {
    return { authorized: false, user: null };
  }

  return {
    authorized: true,
    user: { id: validation.userId!, role: validation.role! },
  };
};

export const isSuperAdminUser = (role: Role | string | undefined): boolean => {
  if (!role) return false;
  return checkIsSuperAdmin(role);
};

export const validateFinancialAccess = async (): Promise<SuperAdminValidationResult> => {
  const validation = await validateSuperAdminAccess();

  if (!validation.authorized) {
    return { authorized: false, reason: "ACCESS_DENIED" };
  }

  return validation;
};

export const requireFinancialAccess = async (
  redirectTo: string = ROUTES.PROTECTED.DASHBOARD
): Promise<{ userId: string; role: Role }> => {
  const validation = await validateFinancialAccess();

  if (!validation.authorized) {
    redirect(redirectTo);
  }

  return { userId: validation.userId!, role: validation.role! };
};

export const validateInfrastructureAccess = async (): Promise<SuperAdminValidationResult> => {
  const validation = await validateSuperAdminAccess();

  if (!validation.authorized) {
    return { authorized: false, reason: "ACCESS_DENIED" };
  }

  return validation;
};

export const requireInfrastructureAccess = async (
  redirectTo: string = ROUTES.PROTECTED.DASHBOARD
): Promise<{ userId: string; role: Role }> => {
  const validation = await validateInfrastructureAccess();

  if (!validation.authorized) {
    redirect(redirectTo);
  }

  return { userId: validation.userId!, role: validation.role! };
};

export const validateRoleManagementAccess = async (): Promise<SuperAdminValidationResult> => {
  const validation = await validateSuperAdminAccess();

  if (!validation.authorized) {
    return { authorized: false, reason: "ACCESS_DENIED" };
  }

  return validation;
};

export const requireRoleManagementAccess = async (
  redirectTo: string = ROUTES.PROTECTED.DASHBOARD
): Promise<{ userId: string; role: Role }> => {
  const validation = await validateRoleManagementAccess();

  if (!validation.authorized) {
    redirect(redirectTo);
  }

  return { userId: validation.userId!, role: validation.role! };
};

export const protectSuperAdminRoute = async (pathname: string): Promise<boolean> => {
  if (!isSuperAdminRoute(pathname)) {
    return true;
  }

  const validation = await validateSuperAdminAccess();
  return validation.authorized;
};

export const createSuperAdminGuard = (redirectTo: string = ROUTES.PROTECTED.DASHBOARD) => {
  return async (): Promise<Role> => {
    const validation = await validateSuperAdminAccess();

    if (!validation.authorized) {
      redirect(redirectTo);
    }

    return validation.role!;
  };
};

export const superAdminOnlyGuard = createSuperAdminGuard();

export const createFinancialGuard = (redirectTo: string = ROUTES.PROTECTED.DASHBOARD) => {
  return async (): Promise<Role> => {
    const validation = await validateFinancialAccess();

    if (!validation.authorized) {
      redirect(redirectTo);
    }

    return validation.role!;
  };
};

export const createInfrastructureGuard = (redirectTo: string = ROUTES.PROTECTED.DASHBOARD) => {
  return async (): Promise<Role> => {
    const validation = await validateInfrastructureAccess();

    if (!validation.authorized) {
      redirect(redirectTo);
    }

    return validation.role!;
  };
};

export const createRoleManagementGuard = (redirectTo: string = ROUTES.PROTECTED.DASHBOARD) => {
  return async (): Promise<Role> => {
    const validation = await validateRoleManagementAccess();

    if (!validation.authorized) {
      redirect(redirectTo);
    }

    return validation.role!;
  };
};
