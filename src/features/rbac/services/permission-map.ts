import { ROLES, type Role } from "./roles";
import { PERMISSIONS } from "./permission-constants";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export type Permission = string;

export interface RolePermissionMap {
  role: Role;
  permissions: readonly Permission[];
  inheritedFrom?: Role;
}

const USER_PERMISSIONS: readonly Permission[] = [
  PERMISSIONS.CHALLENGE.READ,
  PERMISSIONS.QUESTION.READ,
  PERMISSIONS.USER.READ,
  PERMISSIONS.ANALYTICS.VIEW,
  PERMISSIONS.REPORT.CREATE,
];

const MODERATOR_PERMISSIONS: readonly Permission[] = [
  ...USER_PERMISSIONS,
  PERMISSIONS.CHALLENGE.CREATE,
  PERMISSIONS.CHALLENGE.UPDATE,
  PERMISSIONS.CHALLENGE.PUBLISH,
  PERMISSIONS.QUESTION.CREATE,
  PERMISSIONS.QUESTION.UPDATE,
  PERMISSIONS.QUESTION.DELETE,
  PERMISSIONS.CONTENT.PUBLISH,
  PERMISSIONS.CONTENT.FLAG,
];

const ADMIN_PERMISSIONS: readonly Permission[] = [
  ...MODERATOR_PERMISSIONS,
  PERMISSIONS.CHALLENGE.DELETE,
  PERMISSIONS.CHALLENGE.ARCHIVE,
  PERMISSIONS.QUESTION.APPROVE,
  PERMISSIONS.USER.UPDATE,
  PERMISSIONS.USER.BAN,
  PERMISSIONS.USER.SUSPEND,
  PERMISSIONS.MODERATOR.ASSIGN,
  PERMISSIONS.MODERATOR.REVOKE,
  PERMISSIONS.MODERATOR.OVERSEE,
  PERMISSIONS.CONTENT.APPROVE,
  PERMISSIONS.CONTENT.REJECT,
  PERMISSIONS.REPORT.VIEW,
  PERMISSIONS.REPORT.RESOLVE,
  PERMISSIONS.ANALYTICS.EXPORT,
  PERMISSIONS.PLATFORM.INTELLIGENCE,
];

const SUPER_ADMIN_PERMISSIONS: readonly Permission[] = [
  ...ADMIN_PERMISSIONS,
  PERMISSIONS.USER.DELETE,
  PERMISSIONS.ADMIN.ASSIGN,
  PERMISSIONS.ADMIN.REVOKE,
  PERMISSIONS.ADMIN.OVERSEE,
  PERMISSIONS.FINANCIAL.VIEW,
  PERMISSIONS.FINANCIAL.MANAGE,
  PERMISSIONS.FINANCIAL.PROCESS_PAYOUT,
  PERMISSIONS.FINANCIAL.VIEW_REPORTS,
  PERMISSIONS.ROLE.ASSIGN,
  PERMISSIONS.ROLE.REVOKE,
  PERMISSIONS.ROLE.VIEW,
  PERMISSIONS.ROLE.MANAGE,
  PERMISSIONS.PLATFORM.CONFIGURE,
  PERMISSIONS.PLATFORM.VIEW_SETTINGS,
  PERMISSIONS.PLATFORM.MANAGE_INTEGRATIONS,
  PERMISSIONS.SUBSCRIPTION.VIEW,
  PERMISSIONS.SUBSCRIPTION.MANAGE,
];

export const ROLE_PERMISSION_MAP: Record<Role, RolePermissionMap> = {
  [ROLES.USER]: {
    role: ROLES.USER,
    permissions: USER_PERMISSIONS,
  },
  [ROLES.MODERATOR]: {
    role: ROLES.MODERATOR,
    permissions: MODERATOR_PERMISSIONS,
    inheritedFrom: ROLES.USER,
  },
  [ROLES.ADMIN]: {
    role: ROLES.ADMIN,
    permissions: ADMIN_PERMISSIONS,
    inheritedFrom: ROLES.MODERATOR,
  },
  [ROLES.SUPER_ADMIN]: {
    role: ROLES.SUPER_ADMIN,
    permissions: SUPER_ADMIN_PERMISSIONS,
    inheritedFrom: ROLES.ADMIN,
  },
};

export const getRolePermissions = (role: Role): readonly Permission[] => {
  const map = ROLE_PERMISSION_MAP[role];
  return map?.permissions ?? [];
};

export const getRolePermissionsWithInheritance = unstable_cache(
  async (role: Role): Promise<Permission[]> => {
    try {
      const records = await prisma.rolePermission.findMany({
        where: { role },
        select: { permission: { select: { key: true } } },
      });
      if (records.length > 0) {
        return records.map((r) => r.permission.key);
      }
    } catch (e) {
      console.error("[RBAC] DB fetch error, falling back to static map", e);
    }

    const result: Permission[] = [];
    const collectPermissions = (r: Role) => {
      const map = ROLE_PERMISSION_MAP[r];
      if (map) {
        result.push(...map.permissions);
        if (map.inheritedFrom) {
          collectPermissions(map.inheritedFrom);
        }
      }
    };
    collectPermissions(role);
    return [...new Set(result)];
  },
  ["role-permissions-db"],
  { tags: ["rbac"], revalidate: 60 }
);

export const getPermissionHierarchy = (): Record<Role, Role[]> => {
  return {
    [ROLES.USER]: [],
    [ROLES.MODERATOR]: [ROLES.USER],
    [ROLES.ADMIN]: [ROLES.MODERATOR, ROLES.USER],
    [ROLES.SUPER_ADMIN]: [ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER],
  };
};

export const getInheritedRoles = (role: Role): Role[] => {
  return getPermissionHierarchy()[role] ?? [];
};

export const canInheritFromRole = (role: Role, potentialParent: Role): boolean => {
  const inheritance = getPermissionHierarchy();
  return inheritance[role]?.includes(potentialParent) ?? false;
};

export const compareRolePermissionLevel = (roleA: Role, roleB: Role): number => {
  const roleLevel: Record<Role, number> = {
    [ROLES.USER]: 0,
    [ROLES.MODERATOR]: 1,
    [ROLES.ADMIN]: 2,
    [ROLES.SUPER_ADMIN]: 3,
  };
  return (roleLevel[roleA] ?? 0) - (roleLevel[roleB] ?? 0);
};

export const getHighestRoleWithPermission = async (
  permission: Permission
): Promise<Role | null> => {
  const roles = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER];

  for (const role of roles) {
    const permissions = await getRolePermissionsWithInheritance(role);
    if (permissions.includes(permission)) {
      return role;
    }
  }

  return null;
};

export const getRolesWithPermission = async (permission: Permission): Promise<Role[]> => {
  const roles: Role[] = [];

  for (const role of Object.values(ROLES)) {
    const permissions = await getRolePermissionsWithInheritance(role);
    if (permissions.includes(permission)) {
      roles.push(role);
    }
  }

  return roles;
};

export const PERMISSION_MATRIX = Object.freeze({
  [ROLES.USER]: USER_PERMISSIONS,
  [ROLES.MODERATOR]: MODERATOR_PERMISSIONS,
  [ROLES.ADMIN]: ADMIN_PERMISSIONS,
  [ROLES.SUPER_ADMIN]: SUPER_ADMIN_PERMISSIONS,
});

export const hasPermissionInMatrix = (role: Role, permission: Permission): boolean => {
  const permissions = PERMISSION_MATRIX[role];
  if (!permissions) return false;
  return permissions.includes(permission as (typeof permissions)[number]);
};

export const hasPermission = async (role: Role, permission: Permission): Promise<boolean> => {
  const perms = await getRolePermissionsWithInheritance(role);
  return perms.includes(permission);
};

export const hasAnyPermission = async (role: Role, permissions: Permission[]): Promise<boolean> => {
  const userPermissions = await getRolePermissionsWithInheritance(role);
  return permissions.some((p) => userPermissions.includes(p));
};

export const hasAllPermissions = async (
  role: Role,
  permissions: Permission[]
): Promise<boolean> => {
  const userPermissions = await getRolePermissionsWithInheritance(role);
  return permissions.every((p) => userPermissions.includes(p));
};
