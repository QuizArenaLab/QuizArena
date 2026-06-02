import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES, type Role } from "./roles";
import { hasRole, hasMinimumRole, getRoleLevel } from "./hierarchy";
import { getRolePermissionsWithInheritance, type Permission } from "./permission-map";
import { redirect } from "next/navigation";

export class RBACKernelError extends Error {
  constructor(
    message: string,
    public readonly code: RBACKernelErrorCode
  ) {
    super(message);
    this.name = "RBACKernelError";
  }
}

export type RBACKernelErrorCode =
  | "KERNEL_NO_SESSION"
  | "KERNEL_NO_USER"
  | "KERNEL_ROLE_MISMATCH"
  | "KERNEL_PRIVILEGE_REVOKED"
  | "KERNEL_INVALID_ROLE"
  | "KERNEL_DB_ERROR"
  | "KERNEL_ESCALATION_DETECTED"
  | "KERNEL_SELF_FORBIDDEN";

export interface KernelUserContext {
  userId: string;
  role: Role;
  permissions: Permission[];
  dbVerified: boolean;
}

export const getKernelContext = async (
  allowFallback: boolean = false
): Promise<KernelUserContext | null> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      if (allowFallback) {
        return null;
      }
      throw new RBACKernelError("No session found", "KERNEL_NO_SESSION");
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true },
    });

    if (!dbUser) {
      throw new RBACKernelError("User not found in database", "KERNEL_NO_USER");
    }

    const sessionRole = (session.user.role as Role) ?? ROLES.USER;
    const dbRole = dbUser.role as Role;

    if (sessionRole !== dbRole) {
      throw new RBACKernelError(
        `Role mismatch: session=${sessionRole}, db=${dbRole}`,
        "KERNEL_ROLE_MISMATCH"
      );
    }

    const roleLevel = getRoleLevel(dbRole);
    if (roleLevel < 0 || roleLevel > 3) {
      throw new RBACKernelError("Invalid role in database", "KERNEL_INVALID_ROLE");
    }

    return {
      userId: session.user.id,
      role: dbRole,
      permissions: await getRolePermissionsWithInheritance(dbRole),
      dbVerified: true,
    };
  } catch (error) {
    if (error instanceof RBACKernelError) {
      throw error;
    }
    console.error("Kernel context error:", error);
    throw new RBACKernelError("Database error", "KERNEL_DB_ERROR");
  }
};

export const assertKernelContext = async (
  allowFallback: boolean = false
): Promise<KernelUserContext> => {
  const context = await getKernelContext(allowFallback);
  if (!context) {
    redirect("/login");
  }
  return context;
};

export const validateKernelRole = async (
  requiredRole: Role,
  requireExactMatch: boolean = true
): Promise<{ valid: boolean; context: KernelUserContext }> => {
  const context = await getKernelContext();

  if (!context) {
    return {
      valid: false,
      context: { userId: "", role: ROLES.USER, permissions: [], dbVerified: false },
    };
  }

  const isValid = requireExactMatch
    ? hasRole(context.role, requiredRole)
    : hasMinimumRole(context.role, requiredRole);

  return { valid: isValid, context };
};

export const requireKernelRole = async (
  requiredRole: Role,
  redirectTo: string = "/",
  requireExactMatch: boolean = true
): Promise<KernelUserContext> => {
  const { valid, context } = await validateKernelRole(requiredRole, requireExactMatch);

  if (!valid) {
    redirect(redirectTo);
  }

  return context;
};

export const validateKernelPermission = async (
  requiredPermission: Permission
): Promise<{ valid: boolean; context: KernelUserContext }> => {
  const context = await getKernelContext();

  if (!context) {
    return {
      valid: false,
      context: { userId: "", role: ROLES.USER, permissions: [], dbVerified: false },
    };
  }

  const hasPermission = context.permissions.includes(requiredPermission);

  return { valid: hasPermission, context };
};

export const requireKernelPermission = async (
  requiredPermission: Permission,
  redirectTo: string = "/"
): Promise<KernelUserContext> => {
  const { valid, context } = await validateKernelPermission(requiredPermission);

  if (!valid) {
    redirect(redirectTo);
  }

  return context;
};

export const checkKernelAccess = async (): Promise<{
  authorized: boolean;
  context: KernelUserContext | null;
}> => {
  try {
    const context = await getKernelContext(true);
    return { authorized: !!context, context };
  } catch {
    return { authorized: false, context: null };
  }
};

export const kernelCanAccessRoute = async (
  pathname: string
): Promise<{
  allowed: boolean;
  reason?: string;
}> => {
  try {
    const context = await getKernelContext();

    if (!context) {
      return { allowed: false, reason: "Not authenticated" };
    }

    const protectedPaths = [
      { path: "/dashboard/super-admin", required: ROLES.SUPER_ADMIN },
      { path: "/super-admin", required: ROLES.SUPER_ADMIN },
      { path: "/dashboard/platform", required: ROLES.SUPER_ADMIN },
      { path: "/dashboard/financials", required: ROLES.SUPER_ADMIN },
      { path: "/dashboard/roles", required: ROLES.SUPER_ADMIN },
      { path: "/dashboard/admin", required: ROLES.ADMIN },
      { path: "/admin", required: ROLES.ADMIN },
      { path: "/dashboard/moderator", required: ROLES.MODERATOR },
      { path: "/moderator", required: ROLES.MODERATOR },
    ];

    for (const { path, required } of protectedPaths) {
      if (pathname.startsWith(path)) {
        if (!hasMinimumRole(context.role, required)) {
          return { allowed: false, reason: `Requires ${required} role` };
        }
      }
    }

    return { allowed: true };
  } catch (error) {
    console.error("Kernel route access check error:", error);
    return { allowed: false, reason: "Access check failed" };
  }
};

export const sanitizeKernelRole = (payloadRole: unknown, fallbackRole: Role = ROLES.USER): Role => {
  if (!payloadRole || typeof payloadRole !== "string") {
    return fallbackRole;
  }

  const validRoles = Object.values(ROLES) as readonly string[];

  if (!validRoles.includes(payloadRole)) {
    console.warn(
      `[KERNEL] Invalid role in payload: ${payloadRole}, falling back to ${fallbackRole}`
    );
    return fallbackRole;
  }

  return payloadRole as Role;
};

export const preventKernelEscalation = (actorRole: Role, targetRole: Role): boolean => {
  const actorLevel = getRoleLevel(actorRole);
  const targetLevel = getRoleLevel(targetRole);

  if (targetLevel > actorLevel) {
    console.warn(`[KERNEL] Escalation blocked: ${actorRole} -> ${targetRole}`);
    return true;
  }

  return false;
};

export const preventKernelSelfChange = (actorId: string, targetId: string): boolean => {
  if (actorId === targetId) {
    console.warn(`[KERNEL] Self-change blocked: ${actorId}`);
    return true;
  }

  return false;
};

export const KERNEL_PRIVILEGED_OPERATIONS = [
  "ROLE_ASSIGN",
  "ROLE_REVOKE",
  "PERMISSION_GRANT",
  "USER_BAN",
  "USER_DELETE",
  "FINANCIAL_ACCESS",
  "PLATFORM_CONFIG",
  "ADMIN_CREATE",
] as const;

export type KernelPrivilegedOperation = (typeof KERNEL_PRIVILEGED_OPERATIONS)[number];

export const validateKernelPrivilegedOperation = async (
  operation: KernelPrivilegedOperation,
  targetUserId?: string
): Promise<{ allowed: boolean; reason?: string }> => {
  const context = await getKernelContext();

  if (!context) {
    return { allowed: false, reason: "Not authenticated" };
  }

  if (!hasRole(context.role, ROLES.SUPER_ADMIN)) {
    return { allowed: false, reason: "Super Admin required" };
  }

  if (targetUserId && context.userId === targetUserId) {
    return { allowed: false, reason: "Self-operation not allowed" };
  }

  return { allowed: true };
};
