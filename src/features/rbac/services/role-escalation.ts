import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES, type Role } from "./roles";
import { hasRole, hasMinimumRole } from "./hierarchy";

export interface RoleChangeAuthorization {
  authorized: boolean;
  reason?: string;
}

export const validateRoleChangeAuthorization = async (
  actorUserId: string,
  targetUserId: string,
  newRole: Role
): Promise<RoleChangeAuthorization> => {
  try {
    const session = await auth();
    if (!session?.user) {
      return { authorized: false, reason: "Not authenticated" };
    }

    if (session.user.id !== actorUserId) {
      return { authorized: false, reason: "Session user mismatch" };
    }

    const actor = await prisma.user.findUnique({
      where: { id: actorUserId },
      select: { role: true },
    });

    if (!actor) {
      return { authorized: false, reason: "Actor not found" };
    }

    const actorRole = actor.role as Role;

    if (!hasRole(actorRole, ROLES.SUPER_ADMIN)) {
      return { authorized: false, reason: "Only SUPER_ADMIN can change roles" };
    }

    if (newRole === ROLES.SUPER_ADMIN && !hasRole(actorRole, ROLES.SUPER_ADMIN)) {
      return { authorized: false, reason: "Cannot assign SUPER_ADMIN role" };
    }

    if (actorUserId === targetUserId && newRole !== actorRole) {
      return { authorized: false, reason: "Cannot change own role" };
    }

    return { authorized: true };
  } catch (error) {
    console.error("Role change authorization error:", error);
    return { authorized: false, reason: "Authorization check failed" };
  }
};

export const preventRoleEscalation = (requestedRole: string, userRole: Role): boolean => {
  const requestedRoleValue = requestedRole as Role;

  if (hasRole(userRole, ROLES.SUPER_ADMIN)) {
    return false;
  }

  if (requestedRoleValue === ROLES.SUPER_ADMIN && !hasRole(userRole, ROLES.SUPER_ADMIN)) {
    return true;
  }

  if (!hasMinimumRole(userRole, ROLES.ADMIN) && requestedRoleValue !== ROLES.USER) {
    return true;
  }

  return false;
};

export const sanitizeRolePayload = (payloadRole: string | undefined, userRole: Role): Role => {
  if (!payloadRole) {
    return ROLES.USER;
  }

  const requestedRole = payloadRole as Role;

  if (preventRoleEscalation(requestedRole, userRole)) {
    return ROLES.USER;
  }

  if (!Object.values(ROLES).includes(requestedRole)) {
    return ROLES.USER;
  }

  return requestedRole;
};

export const executeRoleChange = async (
  targetUserId: string,
  newRole: Role,
  actorUserId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const authorization = await validateRoleChangeAuthorization(actorUserId, targetUserId, newRole);
    if (!authorization.authorized) {
      return { success: false, error: authorization.reason };
    }

    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    return { success: true };
  } catch (error) {
    console.error("Role change execution error:", error);
    return { success: false, error: "Role change failed" };
  }
};

export const createRoleChangeGuard = () => {
  return async (targetUserId: string, newRole: Role): Promise<boolean> => {
    const session = await auth();
    if (!session?.user) return false;

    const authorization = await validateRoleChangeAuthorization(
      session.user.id,
      targetUserId,
      newRole
    );

    return authorization.authorized;
  };
};

export const canManageUserRole = async (
  actorId: string,
  targetUserId: string
): Promise<boolean> => {
  try {
    const session = await auth();
    if (!session?.user || session.user.id !== actorId) {
      return false;
    }

    const actor = await prisma.user.findUnique({
      where: { id: actorId },
      select: { role: true },
    });

    if (!actor) return false;

    const actorRole = actor.role as Role;
    if (!hasRole(actorRole, ROLES.SUPER_ADMIN)) {
      return false;
    }

    if (actorId === targetUserId) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Can manage user role error:", error);
    return false;
  }
};

export const BLOCKED_ROLE_OPERATIONS = [
  "USER_SELF_PROMOTE",
  "MODERATOR_ESCALATE_TO_ADMIN",
  "ADMIN_ESCALATE_TO_SUPER",
  "BYPASS_RBAC",
] as const;

export const isBlockedRoleOperation = (operation: string): boolean => {
  return BLOCKED_ROLE_OPERATIONS.includes(operation as (typeof BLOCKED_ROLE_OPERATIONS)[number]);
};
