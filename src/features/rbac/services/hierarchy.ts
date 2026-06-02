import { ROLES, type Role } from "./roles";

export const ROLE_HIERARCHY: Record<Role, number> = {
  USER: 0,
  MODERATOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
} as const;

export const hasMinimumRole = (userRole: Role | string, minimumRole: Role): boolean => {
  const role = typeof userRole === "string" ? (userRole as Role) : userRole;
  const userHierarchy = ROLE_HIERARCHY[role] ?? 0;
  const minimumHierarchy = ROLE_HIERARCHY[minimumRole] ?? 0;
  return userHierarchy >= minimumHierarchy;
};

export const hasRole = (userRole: Role | string, targetRole: Role): boolean => {
  const role = typeof userRole === "string" ? (userRole as Role) : userRole;
  return role === targetRole;
};

export const isAboveRole = (userRole: Role | string, targetRole: Role): boolean => {
  const role = typeof userRole === "string" ? (userRole as Role) : userRole;
  const userHierarchy = ROLE_HIERARCHY[role] ?? 0;
  const targetHierarchy = ROLE_HIERARCHY[targetRole] ?? 0;
  return userHierarchy > targetHierarchy;
};

export const canAccessRole = (userRole: Role | string, allowedRoles: Role[]): boolean => {
  return allowedRoles.some((role) => hasRole(userRole, role));
};

export const getRoleLevel = (role: Role | string): number => {
  const safeRole = typeof role === "string" ? (role as Role) : role;
  return ROLE_HIERARCHY[safeRole] ?? 0;
};

export const compareRoles = (roleA: Role, roleB: Role): number => {
  return ROLE_HIERARCHY[roleA] - ROLE_HIERARCHY[roleB];
};

export const isUser = (role: Role | string): boolean => hasRole(role, ROLES.USER);
export const isModerator = (role: Role | string): boolean => hasRole(role, ROLES.MODERATOR);
export const isAdmin = (role: Role | string): boolean => hasRole(role, ROLES.ADMIN);
export const isSuperAdmin = (role: Role | string): boolean => hasRole(role, ROLES.SUPER_ADMIN);

export const isAtLeastModerator = (role: Role | string): boolean =>
  hasMinimumRole(role, ROLES.MODERATOR);
export const isAtLeastAdmin = (role: Role | string): boolean => hasMinimumRole(role, ROLES.ADMIN);
export const isAtLeastSuperAdmin = (role: Role | string): boolean =>
  hasMinimumRole(role, ROLES.SUPER_ADMIN);
