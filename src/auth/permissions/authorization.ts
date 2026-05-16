import { redirect } from "next/navigation";
import { getCurrentUser, getSession } from "../session";
import { ROLE, type Role, toRole } from "../roles/role-types";
import {
  hasMinimumRole,
  hasRole,
  hasPermission,
} from "../roles/role-hierarchy";

export type AuthorizationResult =
  | { success: true; user: Awaited<ReturnType<typeof getCurrentUser>> }
  | { success: false; error: string };

export const getUserRole = (): Role | null => {
  return null;
};

export const requireUser = async (redirectTo: string = "/login") => {
  const user = await getCurrentUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
};

export const requireAuthenticatedUser = async (redirectTo: string = "/login") => {
  const session = await getSession();
  if (!session?.user) {
    redirect(redirectTo);
  }
  return session.user;
};

export const requireRole = async (
  requiredRole: Role,
  redirectTo: string = "/"
): Promise<Awaited<ReturnType<typeof getCurrentUser>>> => {
  const user = await getCurrentUser();
  if (!user || !hasRole(user.role ?? ROLE.USER, requiredRole)) {
    redirect(redirectTo);
  }
  return user;
};

export const requireMinimumRole = async (
  minimumRole: Role,
  redirectTo: string = "/"
): Promise<Awaited<ReturnType<typeof getCurrentUser>>> => {
  const user = await getCurrentUser();
  if (!user || !hasMinimumRole(user.role ?? ROLE.USER, minimumRole)) {
    redirect(redirectTo);
  }
  return user;
};

export const requireModerator = async (redirectTo: string = "/") => {
  return requireMinimumRole(ROLE.MODERATOR, redirectTo);
};

export const requireAdmin = async (redirectTo: string = "/") => {
  return requireMinimumRole(ROLE.ADMIN, redirectTo);
};

export const requireSuperAdmin = async (redirectTo: string = "/") => {
  return requireMinimumRole(ROLE.SUPER_ADMIN, redirectTo);
};

export const requireChallengeManager = async (redirectTo: string = "/") => {
  const user = await getCurrentUser();
  if (!user || !hasPermission.canManageChallenges(user.role ?? ROLE.USER)) {
    redirect(redirectTo);
  }
  return user;
};

export const requireUserModerator = async (redirectTo: string = "/") => {
  const user = await getCurrentUser();
  if (!user || !hasPermission.canModerateUsers(user.role ?? ROLE.USER)) {
    redirect(redirectTo);
  }
  return user;
};

export const requirePlatformManager = async (redirectTo: string = "/") => {
  const user = await getCurrentUser();
  if (!user || !hasPermission.canManagePlatform(user.role ?? ROLE.USER)) {
    redirect(redirectTo);
  }
  return user;
};

export const authorizeAction = async (
  action: () => Promise<AuthorizationResult>
): Promise<AuthorizationResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }
    return await action();
  } catch (error) {
    return { success: false, error: "Authorization error" };
  }
};

export const checkAuthorization = async (requiredRole: Role): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;
  return hasMinimumRole(user.role ?? ROLE.USER, requiredRole);
};

export const getSafeUserRole = (role: string | undefined): Role => {
  if (!role) return ROLE.USER;
  return toRole(role);
};

export const isAuthorizedForAction = (
  userRole: string | undefined,
  checkFn: (role: string) => boolean
): boolean => {
  const role = getSafeUserRole(userRole);
  return checkFn(role);
};

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export const throwIfUnauthorized = (
  userRole: string | undefined,
  requiredRole: Role
): void => {
  const role = getSafeUserRole(userRole);
  if (!hasMinimumRole(role, requiredRole)) {
    throw new AuthorizationError("Insufficient permissions");
  }
};

export const assertPermission = (
  userRole: string | undefined,
  permissionCheck: (role: string) => boolean
): void => {
  if (!permissionCheck(getSafeUserRole(userRole))) {
    throw new AuthorizationError("Permission denied");
  }
};