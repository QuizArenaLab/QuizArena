import { auth } from "@/auth";
import { ROLES, type Role } from "./roles";
import { hasMinimumRole, hasRole } from "./hierarchy";
import { getRolePermissionsWithInheritance, type Permission } from "./permission-map";
import { PERMISSIONS } from "./permission-constants";
import { redirect } from "next/navigation";

export interface AccessContext {
  userId: string;
  userRole: Role;
  permissions: Permission[];
  resourceOwnerId?: string;
  resourceType?: string;
  resourceId?: string;
}

export interface AccessDecision {
  allowed: boolean;
  reason?: string;
  requiresOwnership?: boolean;
}

export class AccessController {
  private context: AccessContext;

  constructor(context: AccessContext) {
    this.context = context;
  }

  can(permission: Permission): AccessDecision {
    const hasAccess = this.context.permissions.includes(permission);

    if (!hasAccess) {
      return {
        allowed: false,
        reason: `Missing permission: ${permission}`,
      };
    }

    return { allowed: true };
  }

  canAny(permissions: Permission[]): AccessDecision {
    const hasAccess = permissions.some((p) => this.context.permissions.includes(p));

    if (!hasAccess) {
      return {
        allowed: false,
        reason: `Missing any permission: ${permissions.join(", ")}`,
      };
    }

    return { allowed: true };
  }

  canAll(permissions: Permission[]): AccessDecision {
    const hasAccess = permissions.every((p) => this.context.permissions.includes(p));

    if (!hasAccess) {
      return {
        allowed: false,
        reason: `Missing all permissions: ${permissions.join(", ")}`,
      };
    }

    return { allowed: true };
  }

  canWithOwnership(permission: Permission): AccessDecision {
    const hasAccess = this.context.permissions.includes(permission);

    if (!hasAccess) {
      return { allowed: false, reason: `Missing permission: ${permission}` };
    }

    if (this.context.resourceOwnerId && this.context.resourceOwnerId !== this.context.userId) {
      const isAdmin = [
        PERMISSIONS.USER.UPDATE,
        PERMISSIONS.USER.BAN,
        PERMISSIONS.ADMIN.OVERSEE,
        PERMISSIONS.MODERATOR.OVERSEE,
      ].some((p) => this.context.permissions.includes(p));

      if (!isAdmin) {
        return {
          allowed: false,
          reason: "Resource ownership required",
          requiresOwnership: true,
        };
      }
    }

    return { allowed: true };
  }

  canRole(requiredRole: Role): AccessDecision {
    const hasAccess = hasRole(this.context.userRole, requiredRole);

    if (!hasAccess) {
      return {
        allowed: false,
        reason: `Required role: ${requiredRole}`,
      };
    }

    return { allowed: true };
  }

  canMinRole(minimumRole: Role): AccessDecision {
    const hasAccess = hasMinimumRole(this.context.userRole, minimumRole);

    if (!hasAccess) {
      return {
        allowed: false,
        reason: `Minimum role required: ${minimumRole}`,
      };
    }

    return { allowed: true };
  }
}

export const createAccessController = async (): Promise<AccessController> => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("No session found");
  }

  const userRole = (session.user.role as Role) ?? ROLES.USER;
  const permissions = await getRolePermissionsWithInheritance(userRole);

  return new AccessController({
    userId: session.user.id,
    userRole,
    permissions,
  });
};

export const requireAccess = async (
  permission: Permission,
  redirectTo: string = "/"
): Promise<AccessController> => {
  const controller = await createAccessController();
  const decision = controller.can(permission);

  if (!decision.allowed) {
    redirect(redirectTo);
  }

  return controller;
};

export const requireAnyAccess = async (
  permissions: Permission[],
  redirectTo: string = "/"
): Promise<AccessController> => {
  const controller = await createAccessController();
  const decision = controller.canAny(permissions);

  if (!decision.allowed) {
    redirect(redirectTo);
  }

  return controller;
};

export const requireAllAccess = async (
  permissions: Permission[],
  redirectTo: string = "/"
): Promise<AccessController> => {
  const controller = await createAccessController();
  const decision = controller.canAll(permissions);

  if (!decision.allowed) {
    redirect(redirectTo);
  }

  return controller;
};

export const requireRoleAccess = async (
  requiredRole: Role,
  redirectTo: string = "/"
): Promise<AccessController> => {
  const controller = await createAccessController();
  const decision = controller.canRole(requiredRole);

  if (!decision.allowed) {
    redirect(redirectTo);
  }

  return controller;
};

export const requireMinRoleAccess = async (
  minimumRole: Role,
  redirectTo: string = "/"
): Promise<AccessController> => {
  const controller = await createAccessController();
  const decision = controller.canMinRole(minimumRole);

  if (!decision.allowed) {
    redirect(redirectTo);
  }

  return controller;
};

export const checkAccess = async (permission: Permission): Promise<AccessDecision> => {
  try {
    const controller = await createAccessController();
    return controller.can(permission);
  } catch {
    return { allowed: false, reason: "Not authenticated" };
  }
};

export const checkAnyAccess = async (permissions: Permission[]): Promise<AccessDecision> => {
  try {
    const controller = await createAccessController();
    return controller.canAny(permissions);
  } catch {
    return { allowed: false, reason: "Not authenticated" };
  }
};

export const checkAllAccess = async (permissions: Permission[]): Promise<AccessDecision> => {
  try {
    const controller = await createAccessController();
    return controller.canAll(permissions);
  } catch {
    return { allowed: false, reason: "Not authenticated" };
  }
};

export const checkRoleAccess = async (requiredRole: Role): Promise<AccessDecision> => {
  try {
    const controller = await createAccessController();
    return controller.canRole(requiredRole);
  } catch {
    return { allowed: false, reason: "Not authenticated" };
  }
};

export const checkMinRoleAccess = async (minimumRole: Role): Promise<AccessDecision> => {
  try {
    const controller = await createAccessController();
    return controller.canMinRole(minimumRole);
  } catch {
    return { allowed: false, reason: "Not authenticated" };
  }
};

export const ACCESS_CONTROL_ACTIONS = {
  CHALLENGE: {
    CREATE: PERMISSIONS.CHALLENGE.CREATE,
    READ: PERMISSIONS.CHALLENGE.READ,
    UPDATE: PERMISSIONS.CHALLENGE.UPDATE,
    DELETE: PERMISSIONS.CHALLENGE.DELETE,
    PUBLISH: PERMISSIONS.CHALLENGE.PUBLISH,
  },
  QUESTION: {
    CREATE: PERMISSIONS.QUESTION.CREATE,
    READ: PERMISSIONS.QUESTION.READ,
    UPDATE: PERMISSIONS.QUESTION.UPDATE,
    DELETE: PERMISSIONS.QUESTION.DELETE,
    APPROVE: PERMISSIONS.QUESTION.APPROVE,
  },
  USER: {
    READ: PERMISSIONS.USER.READ,
    UPDATE: PERMISSIONS.USER.UPDATE,
    DELETE: PERMISSIONS.USER.DELETE,
    BAN: PERMISSIONS.USER.BAN,
    SUSPEND: PERMISSIONS.USER.SUSPEND,
  },
  FINANCIAL: {
    VIEW: PERMISSIONS.FINANCIAL.VIEW,
    MANAGE: PERMISSIONS.FINANCIAL.MANAGE,
    PROCESS_PAYOUT: PERMISSIONS.FINANCIAL.PROCESS_PAYOUT,
  },
  ROLE: {
    ASSIGN: PERMISSIONS.ROLE.ASSIGN,
    REVOKE: PERMISSIONS.ROLE.REVOKE,
    VIEW: PERMISSIONS.ROLE.VIEW,
    MANAGE: PERMISSIONS.ROLE.MANAGE,
  },
  PLATFORM: {
    CONFIGURE: PERMISSIONS.PLATFORM.CONFIGURE,
    VIEW_SETTINGS: PERMISSIONS.PLATFORM.VIEW_SETTINGS,
  },
} as const;
