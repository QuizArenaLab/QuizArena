import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES, type Role } from "./roles";
import { hasMinimumRole } from "./hierarchy";

export interface SessionValidationResult {
  valid: boolean;
  reason?: string;
  userRole?: Role;
}

export const validateSessionAgainstDatabase = async (): Promise<SessionValidationResult> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { valid: false, reason: "No session found" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true },
    });

    if (!user) {
      return { valid: false, reason: "User not found in database" };
    }

    const sessionRole = (session.user.role as Role) ?? ROLES.USER;
    const dbRole = user.role as Role;

    if (sessionRole !== dbRole) {
      return {
        valid: false,
        reason: "Role mismatch - session invalidated",
        userRole: dbRole,
      };
    }

    return { valid: true, userRole: dbRole };
  } catch (error) {
    console.error("Session validation error:", error);
    return { valid: false, reason: "Session validation failed" };
  }
};

export const invalidateElevatedSession = async (userId: string): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) return;

    const role = user.role as Role;
    if (hasMinimumRole(role, ROLES.MODERATOR)) {
      console.log(`[SESSION_INVALIDATION] Elevated session invalidated for user: ${userId}`);
    }
  } catch (error) {
    console.error("Failed to invalidate session:", error);
  }
};

export const checkAndRevokeElevatedAccess = async (
  userId: string,
  requiredMinimumRole?: Role
): Promise<boolean> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) return false;

    const userRole = user.role as Role;

    if (requiredMinimumRole && !hasMinimumRole(userRole, requiredMinimumRole)) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to check elevated access:", error);
    return false;
  }
};

export const ensureValidSession = async (): Promise<boolean> => {
  const validation = await validateSessionAgainstDatabase();
  return validation.valid;
};

export const getSessionRoleFromDatabase = async (): Promise<Role | null> => {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    return (user?.role as Role) ?? null;
  } catch (error) {
    console.error("Failed to get session role from database:", error);
    return null;
  }
};

export const createRevalidationGuard = (minimumRole: Role) => {
  return async (): Promise<boolean> => {
    const session = await auth();
    if (!session?.user?.id) return false;

    const dbRole = await getSessionRoleFromDatabase();
    if (!dbRole) return false;

    if (!hasMinimumRole(dbRole, minimumRole)) {
      return false;
    }

    return true;
  };
};

export const ensureElevatedAccess = createRevalidationGuard(ROLES.MODERATOR);
