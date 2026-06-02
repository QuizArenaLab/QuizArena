import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES, type Role } from "./roles";
import { hasRole, hasMinimumRole, getRoleLevel } from "./hierarchy";
import { getRolePermissionsWithInheritance, type Permission } from "./permission-map";
import { redirect } from "next/navigation";

export type ProtectionContext = "route" | "api" | "server-action" | "mutation" | "query";

export interface ProductionSecurityConfig {
  enableDBValidation: boolean;
  enablePrivilegeRevocationCheck: boolean;
  enableAuditLogging: boolean;
  denyByDefault: boolean;
}

export const DEFAULT_SECURITY_CONFIG: ProductionSecurityConfig = {
  enableDBValidation: true,
  enablePrivilegeRevocationCheck: true,
  enableAuditLogging: true,
  denyByDefault: true,
};

export class RBACProductionError extends Error {
  constructor(
    message: string,
    public readonly code: RBACErrorCode,
    public readonly context?: ProtectionContext
  ) {
    super(message);
    this.name = "RBACProductionError";
  }
}

export type RBACErrorCode =
  | "NOT_AUTHENTICATED"
  | "INVALID_ROLE"
  | "INSUFFICIENT_PRIVILEGE"
  | "PRIVILEGE_REVOKED"
  | "STALE_SESSION"
  | "FORBIDDEN"
  | "DB_VALIDATION_FAILED"
  | "ESCALATION_BLOCKED"
  | "SELF_ACTION_FORBIDDEN";

export interface SecurityValidationResult {
  authorized: boolean;
  userId?: string;
  role?: Role;
  permissions?: Permission[];
  reason?: RBACErrorCode;
  context?: ProtectionContext;
}

export const logSecurityEvent = (
  event: SecurityEventType,
  details: Record<string, unknown>
): void => {
  const timestamp = new Date().toISOString();
  console.log(`[SECURITY:${event}] ${timestamp}`, details);
};

export type SecurityEventType =
  | "UNAUTHORIZED_ACCESS_ATTEMPT"
  | "PRIVILEGE_ESCALATION_BLOCKED"
  | "ROLE_REVOCATION_DETECTED"
  | "STALE_SESSION_DETECTED"
  | "FORBIDDEN_ACTION"
  | "SELF_MODIFICATION_BLOCKED";

export const validateServerAuth = async (
  context: ProtectionContext = "route",
  config: ProductionSecurityConfig = DEFAULT_SECURITY_CONFIG
): Promise<SecurityValidationResult> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      logSecurityEvent("UNAUTHORIZED_ACCESS_ATTEMPT", {
        context,
        reason: "No session",
      });
      return {
        authorized: false,
        reason: "NOT_AUTHENTICATED",
        context,
      };
    }

    const sessionRole = (session.user.role as Role) ?? ROLES.USER;

    if (config.enableDBValidation) {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, role: true },
      });

      if (!dbUser) {
        logSecurityEvent("UNAUTHORIZED_ACCESS_ATTEMPT", {
          context,
          userId: session.user.id,
          reason: "User not found in DB",
        });
        return {
          authorized: false,
          reason: "NOT_AUTHENTICATED",
          context,
        };
      }

      const dbRole = dbUser.role as Role;

      if (dbRole !== sessionRole) {
        logSecurityEvent("STALE_SESSION_DETECTED", {
          context,
          userId: session.user.id,
          sessionRole,
          dbRole,
        });
        return {
          authorized: false,
          userId: session.user.id,
          role: dbRole,
          reason: "STALE_SESSION",
          context,
        };
      }

      if (config.enablePrivilegeRevocationCheck) {
        const sessionPrivilege = getRoleLevel(sessionRole);
        const dbPrivilege = getRoleLevel(dbRole);

        if (dbPrivilege < sessionPrivilege) {
          logSecurityEvent("ROLE_REVOCATION_DETECTED", {
            context,
            userId: session.user.id,
            sessionPrivilege,
            dbPrivilege,
          });
          return {
            authorized: false,
            userId: session.user.id,
            role: dbRole,
            reason: "PRIVILEGE_REVOKED",
            context,
          };
        }
      }

      return {
        authorized: true,
        userId: session.user.id,
        role: dbRole,
        permissions: await getRolePermissionsWithInheritance(dbRole),
        context,
      };
    }

    return {
      authorized: true,
      userId: session.user.id,
      role: sessionRole,
      permissions: await getRolePermissionsWithInheritance(sessionRole),
      context,
    };
  } catch (error) {
    console.error("Server auth validation error:", error);
    return {
      authorized: config.denyByDefault,
      reason: config.denyByDefault ? "DB_VALIDATION_FAILED" : undefined,
      context,
    };
  }
};

export const requireServerAuth = async (
  context: ProtectionContext = "route",
  redirectTo: string = "/login",
  config: ProductionSecurityConfig = DEFAULT_SECURITY_CONFIG
): Promise<SecurityValidationResult> => {
  const result = await validateServerAuth(context, config);

  if (!result.authorized) {
    redirect(redirectTo);
  }

  return result;
};

export const validateRoleAccess = async (
  requiredRole: Role,
  context: ProtectionContext = "route",
  config: ProductionSecurityConfig = DEFAULT_SECURITY_CONFIG
): Promise<SecurityValidationResult> => {
  const authResult = await validateServerAuth(context, config);

  if (!authResult.authorized) {
    return authResult;
  }

  const userRole = authResult.role ?? ROLES.USER;

  if (!hasRole(userRole, requiredRole)) {
    logSecurityEvent("PRIVILEGE_ESCALATION_BLOCKED", {
      context,
      userId: authResult.userId,
      userRole,
      requiredRole,
    });
    return {
      authorized: false,
      userId: authResult.userId,
      role: userRole,
      reason: "INSUFFICIENT_PRIVILEGE",
      context,
    };
  }

  return authResult;
};

export const requireRoleAccess = async (
  requiredRole: Role,
  redirectTo: string = "/",
  context: ProtectionContext = "route",
  config: ProductionSecurityConfig = DEFAULT_SECURITY_CONFIG
): Promise<SecurityValidationResult> => {
  const result = await validateRoleAccess(requiredRole, context, config);

  if (!result.authorized) {
    redirect(redirectTo);
  }

  return result;
};

export const validateMinimumRoleAccess = async (
  minimumRole: Role,
  context: ProtectionContext = "route",
  config: ProductionSecurityConfig = DEFAULT_SECURITY_CONFIG
): Promise<SecurityValidationResult> => {
  const authResult = await validateServerAuth(context, config);

  if (!authResult.authorized) {
    return authResult;
  }

  const userRole = authResult.role ?? ROLES.USER;

  if (!hasMinimumRole(userRole, minimumRole)) {
    logSecurityEvent("PRIVILEGE_ESCALATION_BLOCKED", {
      context,
      userId: authResult.userId,
      userRole,
      minimumRole,
    });
    return {
      authorized: false,
      userId: authResult.userId,
      role: userRole,
      reason: "INSUFFICIENT_PRIVILEGE",
      context,
    };
  }

  return authResult;
};

export const requireMinimumRoleAccess = async (
  minimumRole: Role,
  redirectTo: string = "/",
  context: ProtectionContext = "route",
  config: ProductionSecurityConfig = DEFAULT_SECURITY_CONFIG
): Promise<SecurityValidationResult> => {
  const result = await validateMinimumRoleAccess(minimumRole, context, config);

  if (!result.authorized) {
    redirect(redirectTo);
  }

  return result;
};

export const validatePermissionAccess = async (
  requiredPermission: Permission,
  context: ProtectionContext = "route",
  config: ProductionSecurityConfig = DEFAULT_SECURITY_CONFIG
): Promise<SecurityValidationResult> => {
  const authResult = await validateServerAuth(context, config);

  if (!authResult.authorized) {
    return authResult;
  }

  const permissions = authResult.permissions ?? [];
  const hasPermission = permissions.includes(requiredPermission);

  if (!hasPermission) {
    logSecurityEvent("FORBIDDEN_ACTION", {
      context,
      userId: authResult.userId,
      role: authResult.role,
      requiredPermission,
    });
    return {
      authorized: false,
      userId: authResult.userId,
      role: authResult.role,
      permissions,
      reason: "FORBIDDEN",
      context,
    };
  }

  return authResult;
};

export const requirePermissionAccess = async (
  requiredPermission: Permission,
  redirectTo: string = "/",
  context: ProtectionContext = "route",
  config: ProductionSecurityConfig = DEFAULT_SECURITY_CONFIG
): Promise<SecurityValidationResult> => {
  const result = await validatePermissionAccess(requiredPermission, context, config);

  if (!result.authorized) {
    redirect(redirectTo);
  }

  return result;
};

export const validateSelfProtection = (
  actorId: string,
  targetId: string,
  action: string
): boolean => {
  if (actorId === targetId) {
    logSecurityEvent("SELF_MODIFICATION_BLOCKED", {
      action,
      actorId,
      targetId,
    });
    return false;
  }
  return true;
};

export const validateNoRoleEscalation = (currentRole: Role, requestedRole: Role): boolean => {
  const currentLevel = getRoleLevel(currentRole);
  const requestedLevel = getRoleLevel(requestedRole);

  if (requestedLevel > currentLevel) {
    logSecurityEvent("PRIVILEGE_ESCALATION_BLOCKED", {
      currentRole,
      requestedRole,
      currentLevel,
      requestedLevel,
    });
    return false;
  }

  return true;
};

export const validateNoSelfRoleChange = (
  actorId: string,
  targetId: string,
  newRole: Role
): boolean => {
  if (actorId === targetId) {
    logSecurityEvent("SELF_MODIFICATION_BLOCKED", {
      action: "ROLE_CHANGE",
      actorId,
      targetId,
      newRole,
    });
    return false;
  }
  return true;
};

export const createProductionGuard = (
  protectionType: "role" | "minimum-role" | "permission",
  value: Role | Permission,
  config: ProductionSecurityConfig = DEFAULT_SECURITY_CONFIG
) => {
  return async (
    redirectTo: string = "/",
    context: ProtectionContext = "route"
  ): Promise<SecurityValidationResult> => {
    switch (protectionType) {
      case "role":
        return requireRoleAccess(value as Role, redirectTo, context, config);
      case "minimum-role":
        return requireMinimumRoleAccess(value as Role, redirectTo, context, config);
      case "permission":
        return requirePermissionAccess(value as Permission, redirectTo, context, config);
      default:
        return { authorized: false, reason: "INVALID_ROLE", context };
    }
  };
};

export const PRODUCTION_ROUTE_PATTERNS = {
  PUBLIC: ["/", "/login", "/register", "/forgot-password", "/api/auth"],
  AUTHENTICATED: ["/dashboard", "/profile", "/settings", "/challenges"],
  MODERATOR: ["/dashboard/moderator", "/dashboard/manage", "/moderator"],
  ADMIN: ["/dashboard/admin", "/admin"],
  SUPER_ADMIN: [
    "/dashboard/super-admin",
    "/super-admin",
    "/dashboard/platform",
    "/dashboard/financials",
    "/dashboard/payouts",
    "/dashboard/revenue",
    "/dashboard/roles",
    "/dashboard/infrastructure",
  ],
} as const;

export const getProductionProtectionLevel = (pathname: string): Role | null => {
  if (PRODUCTION_ROUTE_PATTERNS.SUPER_ADMIN.some((p) => pathname.startsWith(p))) {
    return ROLES.SUPER_ADMIN;
  }
  if (PRODUCTION_ROUTE_PATTERNS.ADMIN.some((p) => pathname.startsWith(p))) {
    return ROLES.ADMIN;
  }
  if (PRODUCTION_ROUTE_PATTERNS.MODERATOR.some((p) => pathname.startsWith(p))) {
    return ROLES.MODERATOR;
  }
  if (PRODUCTION_ROUTE_PATTERNS.AUTHENTICATED.some((p) => pathname.startsWith(p))) {
    return ROLES.USER;
  }
  return null;
};

export const isProductionRouteProtected = (pathname: string): boolean => {
  return getProductionProtectionLevel(pathname) !== null;
};
