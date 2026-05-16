import { auth } from "@/auth";
import { ROLES, type Role } from "./roles";
import { hasMinimumRole, hasRole, isAtLeastAdmin, isAtLeastModerator, isAtLeastSuperAdmin } from "./hierarchy";
import { hasPermission, type Permission, ROLE_PERMISSIONS } from "./permissions";
import { redirect } from "next/navigation";

export type AuthUser = {
  id: string;
  role?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  onboardingCompleted?: boolean;
} | null;

export const getCurrentUserFromSession = async (): Promise<AuthUser> => {
  const session = await auth();
  return session?.user ?? null;
};

export const getCurrentRoleFromSession = async (): Promise<Role> => {
  const user = await getCurrentUserFromSession();
  const role = user?.role ?? "USER";
  return (role as Role) ?? ROLES.USER;
};

export const getPermissionsFromSession = async (): Promise<Permission[]> => {
  const role = await getCurrentRoleFromSession();
  return ROLE_PERMISSIONS[role] ?? [];
};

export const requireAuth = async (redirectTo: string = "/login"): Promise<AuthUser> => {
  const user = await getCurrentUserFromSession();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
};

export const requireRole = async (
  requiredRole: Role,
  redirectTo: string = "/"
): Promise<AuthUser> => {
  const user = await requireAuth(redirectTo);
  const userRole = (user?.role as Role) ?? ROLES.USER;
  
  if (!hasRole(userRole, requiredRole)) {
    redirect(redirectTo);
  }
  return user;
};

export const requireMinimumRole = async (
  minimumRole: Role,
  redirectTo: string = "/"
): Promise<AuthUser> => {
  const user = await requireAuth(redirectTo);
  const userRole = (user?.role as Role) ?? ROLES.USER;
  
  if (!hasMinimumRole(userRole, minimumRole)) {
    redirect(redirectTo);
  }
  return user;
};

export const requireModerator = async (redirectTo: string = "/") => {
  return requireMinimumRole(ROLES.MODERATOR, redirectTo);
};

export const requireAdmin = async (redirectTo: string = "/") => {
  return requireMinimumRole(ROLES.ADMIN, redirectTo);
};

export const requireSuperAdmin = async (redirectTo: string = "/") => {
  return requireMinimumRole(ROLES.SUPER_ADMIN, redirectTo);
};

export const requirePermission = async (
  permission: Permission,
  redirectTo: string = "/"
): Promise<AuthUser> => {
  const user = await requireAuth(redirectTo);
  const userRole = (user?.role as Role) ?? ROLES.USER;
  
  if (!hasPermission(userRole, permission)) {
    redirect(redirectTo);
  }
  return user;
};

export const assertAuth = async (): Promise<AuthUser> => {
  const user = await getCurrentUserFromSession();
  if (!user) {
    throw new AuthorizationError("Authentication required");
  }
  return user;
};

export const assertRole = (userRole: Role | string, requiredRole: Role): void => {
  if (!hasRole(userRole, requiredRole)) {
    throw new AuthorizationError(`Role '${requiredRole}' required`);
  }
};

export const assertMinimumRole = (userRole: Role | string, minimumRole: Role): void => {
  if (!hasMinimumRole(userRole, minimumRole)) {
    throw new AuthorizationError(`Minimum role '${minimumRole}' required`);
  }
};

export const assertPermission = (userRole: Role | string, permission: Permission): void => {
  if (!hasPermission(userRole, permission)) {
    throw new AuthorizationError(`Permission '${permission}' required`);
  }
};

export const checkAuth = async (): Promise<{ authenticated: boolean; user: AuthUser }> => {
  const user = await getCurrentUserFromSession();
  return {
    authenticated: !!user,
    user,
  };
};

export const checkRole = async (requiredRole: Role): Promise<{ authorized: boolean; user: AuthUser }> => {
  const user = await getCurrentUserFromSession();
  if (!user) {
    return { authorized: false, user: null };
  }
  const userRole = (user?.role as Role) ?? ROLES.USER;
  return {
    authorized: hasRole(userRole, requiredRole),
    user,
  };
};

export const checkMinimumRole = async (
  minimumRole: Role
): Promise<{ authorized: boolean; user: AuthUser }> => {
  const user = await getCurrentUserFromSession();
  if (!user) {
    return { authorized: false, user: null };
  }
  const userRole = (user?.role as Role) ?? ROLES.USER;
  return {
    authorized: hasMinimumRole(userRole, minimumRole),
    user,
  };
};

export const checkPermission = async (
  permission: Permission
): Promise<{ authorized: boolean; user: AuthUser }> => {
  const user = await getCurrentUserFromSession();
  if (!user) {
    return { authorized: false, user: null };
  }
  const userRole = (user?.role as Role) ?? ROLES.USER;
  return {
    authorized: hasPermission(userRole, permission),
    user,
  };
};

export const canAccessRoute = async (pathname: string): Promise<boolean> => {
  const user = await getCurrentUserFromSession();
  if (!user) return false;

  const userRole = (user?.role as Role) ?? ROLES.USER;
  const requiredRole = getRequiredRoleForRoute(pathname);
  
  if (!requiredRole) return true;
  return hasMinimumRole(userRole, requiredRole);
};

export const getRequiredRoleForRoute = (pathname: string): Role | null => {
  if (pathname.startsWith("/super-admin") || pathname.startsWith("/dashboard/platform")) {
    return ROLES.SUPER_ADMIN;
  }
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard/admin")) {
    return ROLES.ADMIN;
  }
  if (pathname.startsWith("/moderator") || pathname.startsWith("/dashboard/manage")) {
    return ROLES.MODERATOR;
  }
  return null;
};

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class PermissionDeniedError extends AuthorizationError {
  constructor(permission?: string) {
    super(permission ? `Permission denied: ${permission}` : "Permission denied");
    this.name = "PermissionDeniedError";
  }
}

export class RoleDeniedError extends AuthorizationError {
  constructor(role?: string) {
    super(role ? `Role '${role}' required` : "Insufficient role");
    this.name = "RoleDeniedError";
  }
}

export class AuthenticationError extends AuthorizationError {
  constructor(message: string = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export const throwIfNotAuthenticated = async (): Promise<AuthUser> => {
  const user = await getCurrentUserFromSession();
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
};

export const throwIfRoleDenied = (userRole: Role | string, requiredRole: Role): void => {
  if (!hasRole(userRole, requiredRole)) {
    throw new RoleDeniedError(requiredRole);
  }
};

export const throwIfMinimumRoleDenied = (userRole: Role | string, minimumRole: Role): void => {
  if (!hasMinimumRole(userRole, minimumRole)) {
    throw new RoleDeniedError(`Minimum: ${minimumRole}`);
  }
};

export const throwIfPermissionDenied = (userRole: Role | string, permission: Permission): void => {
  if (!hasPermission(userRole, permission)) {
    throw new PermissionDeniedError(permission);
  }
};

export const safeGetCurrentUser = async (): Promise<{ success: true; user: AuthUser } | { success: false; error: string }> => {
  try {
    const user = await getCurrentUserFromSession();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }
    return { success: true, user };
  } catch (error) {
    return { success: false, error: "Session error" };
  }
};

export const safeCheckPermission = async (permission: Permission): Promise<boolean> => {
  try {
    const user = await getCurrentUserFromSession();
    if (!user) return false;
    const userRole = (user?.role as Role) ?? ROLES.USER;
    return hasPermission(userRole, permission);
  } catch {
    return false;
  }
};

export const getAllPermissions = (role: Role | string): Permission[] => {
  const safeRole = typeof role === "string" ? (role as Role) : role;
  return ROLE_PERMISSIONS[safeRole] ?? [];
};

export const hasAnyPermission = (role: Role | string, permissions: Permission[]): boolean => {
  const userPermissions = getAllPermissions(role);
  return permissions.some((p) => userPermissions.includes(p));
};

export const hasAllPermissions = (role: Role | string, permissions: Permission[]): boolean => {
  const userPermissions = getAllPermissions(role);
  return permissions.every((p) => userPermissions.includes(p));
};