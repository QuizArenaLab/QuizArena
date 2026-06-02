import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ROLES, type Role } from "./roles";
import { hasMinimumRole, hasRole, getRoleLevel } from "./hierarchy";
import { ROUTES } from '@/constants/routes';
import {
  SUPER_ADMIN_ROUTES,
  FINANCIAL_ROUTES,
  INFRASTRUCTURE_ROUTES,
  ROLE_MANAGEMENT_ROUTES,
} from "./super-admin";

export interface RouteGuardConfig {
  requiredRole?: Role;
  minimumRole?: Role;
  requiredPermissions?: string[];
  redirectTo?: string;
  enableDBValidation?: boolean;
}

export const DENY_BY_DEFAULT = true;

export const PRIVILEGED_ROUTES = {
  MODERATOR: ["/dashboard/moderator", "/dashboard/manage", "/moderator"],
  ADMIN: ["/dashboard/admin", "/admin"],
  SUPER_ADMIN: [...SUPER_ADMIN_ROUTES],
  FINANCIAL: [...FINANCIAL_ROUTES],
  ROLE_MANAGEMENT: [...ROLE_MANAGEMENT_ROUTES],
  INFRASTRUCTURE: [...INFRASTRUCTURE_ROUTES],
} as const;

export const isPrivilegedRoute = (pathname: string): boolean => {
  const allPrivilegedRoutes = [
    ...PRIVILEGED_ROUTES.MODERATOR,
    ...PRIVILEGED_ROUTES.ADMIN,
    ...PRIVILEGED_ROUTES.SUPER_ADMIN,
    ...PRIVILEGED_ROUTES.FINANCIAL,
    ...PRIVILEGED_ROUTES.ROLE_MANAGEMENT,
    ...PRIVILEGED_ROUTES.INFRASTRUCTURE,
  ];
  return allPrivilegedRoutes.some((route) => pathname.startsWith(route));
};

export const getRoutePrivilegeLevel = (pathname: string): Role | null => {
  if (PRIVILEGED_ROUTES.INFRASTRUCTURE.some((route) => pathname.startsWith(route))) {
    return ROLES.SUPER_ADMIN;
  }
  if (PRIVILEGED_ROUTES.SUPER_ADMIN.some((route) => pathname.startsWith(route))) {
    return ROLES.SUPER_ADMIN;
  }
  if (PRIVILEGED_ROUTES.FINANCIAL.some((route) => pathname.startsWith(route))) {
    return ROLES.SUPER_ADMIN;
  }
  if (PRIVILEGED_ROUTES.ROLE_MANAGEMENT.some((route) => pathname.startsWith(route))) {
    return ROLES.SUPER_ADMIN;
  }
  if (PRIVILEGED_ROUTES.ADMIN.some((route) => pathname.startsWith(route))) {
    return ROLES.ADMIN;
  }
  if (PRIVILEGED_ROUTES.MODERATOR.some((route) => pathname.startsWith(route))) {
    return ROLES.MODERATOR;
  }
  return null;
};

export const validateRouteAccess = async (
  pathname: string,
  config: RouteGuardConfig
): Promise<{ authorized: boolean; userRole: Role; dbVerified: boolean }> => {
  const session = await auth();
  if (!session?.user) {
    return { authorized: false, userRole: ROLES.USER, dbVerified: false };
  }

  const userRole = (session.user.role as Role) ?? ROLES.USER;
  const dbVerified = true;

  if (config.enableDBValidation !== false) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!dbUser) {
      console.warn("[ROUTE_GUARD] User not found in database");
      return { authorized: false, userRole: ROLES.USER, dbVerified: false };
    }

    const dbRole = dbUser.role as Role;

    if (dbRole !== userRole) {
      console.warn("[ROUTE_GUARD] Session role mismatch with database");
      return { authorized: false, userRole: dbRole, dbVerified: false };
    }

    const sessionPrivilege = getRoleLevel(userRole);
    const dbPrivilege = getRoleLevel(dbRole);

    if (dbPrivilege < sessionPrivilege) {
      console.warn("[ROUTE_GUARD] Privilege revoked detected");
      return { authorized: false, userRole: dbRole, dbVerified: false };
    }
  }

  const requiredLevel = config.minimumRole ?? config.requiredRole;

  if (requiredLevel && !hasMinimumRole(userRole, requiredLevel)) {
    return { authorized: DENY_BY_DEFAULT, userRole, dbVerified };
  }

  if (config.requiredRole && !hasRole(userRole, config.requiredRole)) {
    return { authorized: DENY_BY_DEFAULT, userRole, dbVerified };
  }

  return { authorized: true, userRole, dbVerified };
};

export const guardRoute = async (pathname: string, config: RouteGuardConfig): Promise<void> => {
  const redirectTo = config.redirectTo ?? ROUTES.PROTECTED.DASHBOARD;
  const { authorized } = await validateRouteAccess(pathname, config);

  if (!authorized) {
    redirect(redirectTo);
  }
};

export const createServerGuard = (
  minimumRole: Role,
  redirectTo: string = ROUTES.PROTECTED.DASHBOARD,
  enableDBValidation: boolean = true
) => {
  return async (): Promise<Role> => {
    const session = await auth();
    if (!session?.user) {
      redirect(ROUTES.AUTH.SIGN_IN);
    }

    let userRole = (session.user.role as Role) ?? ROLES.USER;

    if (enableDBValidation) {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });

      if (!dbUser) {
        redirect(ROUTES.AUTH.SIGN_IN);
      }

      const dbRole = dbUser.role as Role;

      if (dbRole !== userRole) {
        console.warn("[SERVER_GUARD] Role mismatch - using DB role");
        userRole = dbRole;
      }

      const sessionPrivilege = getRoleLevel(userRole);
      const dbPrivilege = getRoleLevel(dbRole);

      if (dbPrivilege < sessionPrivilege) {
        console.warn("[SERVER_GUARD] Privilege revoked");
        redirect(redirectTo);
      }
    }

    if (!hasMinimumRole(userRole, minimumRole)) {
      redirect(redirectTo);
    }

    return userRole;
  };
};

export const createExactRoleGuard = (
  requiredRole: Role,
  redirectTo: string = ROUTES.PROTECTED.DASHBOARD,
  enableDBValidation: boolean = true
) => {
  return async (): Promise<Role> => {
    const session = await auth();
    if (!session?.user) {
      redirect(ROUTES.AUTH.SIGN_IN);
    }

    let userRole = (session.user.role as Role) ?? ROLES.USER;

    if (enableDBValidation) {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });

      if (!dbUser) {
        redirect(ROUTES.AUTH.SIGN_IN);
      }

      const dbRole = dbUser.role as Role;

      if (dbRole !== userRole) {
        console.warn("[EXACT_ROLE_GUARD] Role mismatch - using DB role");
        userRole = dbRole;
      }
    }

    if (!hasRole(userRole, requiredRole)) {
      redirect(redirectTo);
    }

    return userRole;
  };
};

export const moderatorGuard = createServerGuard(ROLES.MODERATOR);
export const adminGuard = createServerGuard(ROLES.ADMIN);
export const superAdminGuard = createServerGuard(ROLES.SUPER_ADMIN);

export const superAdminOnlyGuard = createExactRoleGuard(ROLES.SUPER_ADMIN);

export const verifyRouteSecurity = async (
  pathname: string
): Promise<{
  secure: boolean;
  requiredRole: Role | null;
  reason?: string;
}> => {
  const requiredRole = getRoutePrivilegeLevel(pathname);

  if (!requiredRole) {
    return { secure: true, requiredRole: null };
  }

  const { authorized, dbVerified } = await validateRouteAccess(pathname, {
    minimumRole: requiredRole,
    enableDBValidation: true,
  });

  if (!dbVerified) {
    return { secure: false, requiredRole, reason: "Database verification failed" };
  }

  if (!authorized) {
    return { secure: false, requiredRole, reason: `Requires ${requiredRole} role` };
  }

  return { secure: true, requiredRole };
};
