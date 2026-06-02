import { auth } from "@/auth";
import { ROLES, type Role } from "./roles";
import {
  getRolePermissionsWithInheritance,
  getRolePermissions,
  hasPermissionInMatrix,
  type Permission,
} from "./permission-map";
import { PERMISSIONS } from "./permission-constants";
import { redirect } from "next/navigation";

export const hasPermission = (role: Role | string, permission: Permission): boolean => {
  const safeRole = typeof role === "string" ? (role as Role) : role;
  return hasPermissionInMatrix(safeRole, permission);
};

export const hasAnyPermission = async (
  role: Role | string,
  permissions: Permission[]
): Promise<boolean> => {
  const safeRole = typeof role === "string" ? (role as Role) : role;
  const userPermissions = await getRolePermissionsWithInheritance(safeRole);
  return permissions.some((p) => userPermissions.includes(p));
};

export const hasAllPermissions = async (
  role: Role | string,
  permissions: Permission[]
): Promise<boolean> => {
  const safeRole = typeof role === "string" ? (role as Role) : role;
  const userPermissions = await getRolePermissionsWithInheritance(safeRole);
  return permissions.every((p) => userPermissions.includes(p));
};

export const requirePermission = async (
  permission: Permission,
  redirectTo: string = "/"
): Promise<Role> => {
  const session = await auth();

  if (!session?.user) {
    redirect(redirectTo);
  }

  const userRole = (session.user.role as Role) ?? ROLES.USER;

  if (!hasPermission(userRole, permission)) {
    redirect(redirectTo);
  }

  return userRole;
};

export const requireAnyPermission = async (
  permissions: Permission[],
  redirectTo: string = "/"
): Promise<Role> => {
  const session = await auth();

  if (!session?.user) {
    redirect(redirectTo);
  }

  const userRole = (session.user.role as Role) ?? ROLES.USER;

  if (!(await hasAnyPermission(userRole, permissions))) {
    redirect(redirectTo);
  }

  return userRole;
};

export const requireAllPermissions = async (
  permissions: Permission[],
  redirectTo: string = "/"
): Promise<Role> => {
  const session = await auth();

  if (!session?.user) {
    redirect(redirectTo);
  }

  const userRole = (session.user.role as Role) ?? ROLES.USER;

  if (!(await hasAllPermissions(userRole, permissions))) {
    redirect(redirectTo);
  }

  return userRole;
};

export const checkPermission = async (permission: Permission): Promise<boolean> => {
  const session = await auth();

  if (!session?.user) {
    return false;
  }

  const userRole = (session.user.role as Role) ?? ROLES.USER;
  return hasPermission(userRole, permission);
};

export const checkAnyPermission = async (permissions: Permission[]): Promise<boolean> => {
  const session = await auth();

  if (!session?.user) {
    return false;
  }

  const userRole = (session.user.role as Role) ?? ROLES.USER;
  return await hasAnyPermission(userRole, permissions);
};

export const checkAllPermissions = async (permissions: Permission[]): Promise<boolean> => {
  const session = await auth();

  if (!session?.user) {
    return false;
  }

  const userRole = (session.user.role as Role) ?? ROLES.USER;
  return await hasAllPermissions(userRole, permissions);
};

export const assertPermission = (role: Role, permission: Permission): void => {
  if (!hasPermission(role, permission)) {
    throw new PermissionDeniedError(permission);
  }
};

export const assertAnyPermission = async (role: Role, permissions: Permission[]): Promise<void> => {
  if (!(await hasAnyPermission(role, permissions))) {
    throw new PermissionDeniedError(permissions.join(" or "));
  }
};

export const assertAllPermissions = async (
  role: Role,
  permissions: Permission[]
): Promise<void> => {
  if (!(await hasAllPermissions(role, permissions))) {
    throw new PermissionDeniedError(permissions.join(", "));
  }
};

export class PermissionDeniedError extends Error {
  constructor(permission: string) {
    super(`Permission denied: ${permission}`);
    this.name = "PermissionDeniedError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export const getUserPermissions = async (): Promise<Permission[]> => {
  const session = await auth();

  if (!session?.user) {
    return [];
  }

  const userRole = (session.user.role as Role) ?? ROLES.USER;
  return await getRolePermissionsWithInheritance(userRole);
};

export const getUserDirectPermissions = async (): Promise<Permission[]> => {
  const session = await auth();

  if (!session?.user) {
    return [];
  }

  const userRole = (session.user.role as Role) ?? ROLES.USER;
  return [...getRolePermissions(userRole)];
};

export const canAccessResource = async (
  resourceType: string,
  action: Permission,
  ownerId?: string
): Promise<{ allowed: boolean; reason?: string }> => {
  const session = await auth();

  if (!session?.user) {
    return { allowed: false, reason: "Not authenticated" };
  }

  const userRole = (session.user.role as Role) ?? ROLES.USER;
  const userId = session.user.id;

  if (!hasPermission(userRole, action)) {
    return { allowed: false, reason: "Insufficient permissions" };
  }

  if (ownerId && ownerId !== userId) {
    const isAdmin = await hasAnyPermission(userRole, [
      PERMISSIONS.USER.UPDATE,
      PERMISSIONS.USER.BAN,
      PERMISSIONS.USER.DELETE,
    ]);

    if (!isAdmin) {
      return { allowed: false, reason: "Not resource owner" };
    }
  }

  return { allowed: true };
};

export const validatePermissionChain = async (
  role: Role,
  requiredPermissions: Permission[]
): Promise<{ valid: boolean; missingPermissions: Permission[] }> => {
  const userPermissions = await getRolePermissionsWithInheritance(role);
  const missing = requiredPermissions.filter((p) => !userPermissions.includes(p));

  return {
    valid: missing.length === 0,
    missingPermissions: missing,
  };
};

export const getPermissionGaps = async (
  role: Role,
  desiredPermissions: Permission[]
): Promise<Permission[]> => {
  const userPermissions = await getRolePermissionsWithInheritance(role);
  return desiredPermissions.filter((p) => !userPermissions.includes(p));
};

export const isPermissionAvailable = (permission: Permission): boolean => {
  return Object.values(ROLES).some((role) => hasPermission(role, permission));
};

export const getLowestRoleWithPermission = (permission: Permission): Role | null => {
  const roleOrder: Role[] = [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN];

  for (const role of roleOrder) {
    if (hasPermission(role, permission)) {
      return role;
    }
  }

  return null;
};
