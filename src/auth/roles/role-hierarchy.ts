import { ROLE, ROLE_HIERARCHY, type Role } from "./role-types";

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

export const hasPermission = {
  canManageChallenges: (role: Role | string): boolean => {
    return (
      hasMinimumRole(role, ROLE.MODERATOR) ||
      hasRole(role, ROLE.ADMIN) ||
      hasRole(role, ROLE.SUPER_ADMIN)
    );
  },

  canManageQuestions: (role: Role | string): boolean => {
    return (
      hasMinimumRole(role, ROLE.MODERATOR) ||
      hasRole(role, ROLE.ADMIN) ||
      hasRole(role, ROLE.SUPER_ADMIN)
    );
  },

  canModerateUsers: (role: Role | string): boolean => {
    return (
      hasMinimumRole(role, ROLE.ADMIN) || hasRole(role, ROLE.SUPER_ADMIN)
    );
  },

  canManageModerators: (role: Role | string): boolean => {
    return hasRole(role, ROLE.ADMIN) || hasRole(role, ROLE.SUPER_ADMIN);
  },

  canManageAdmins: (role: Role | string): boolean => {
    return hasRole(role, ROLE.SUPER_ADMIN);
  },

  canManagePlatform: (role: Role | string): boolean => {
    return hasRole(role, ROLE.SUPER_ADMIN);
  },

  canManageFinancials: (role: Role | string): boolean => {
    return hasRole(role, ROLE.SUPER_ADMIN);
  },

  canApproveContent: (role: Role | string): boolean => {
    return (
      hasRole(role, ROLE.ADMIN) || hasRole(role, ROLE.SUPER_ADMIN)
    );
  },

  canReviewPerformance: (role: Role | string): boolean => {
    return (
      hasRole(role, ROLE.ADMIN) || hasRole(role, ROLE.SUPER_ADMIN)
    );
  },

  canManageSettings: (role: Role | string): boolean => {
    return hasRole(role, ROLE.SUPER_ADMIN);
  },

  canCreateAdmin: (role: Role | string): boolean => {
    return hasRole(role, ROLE.SUPER_ADMIN);
  },
};

export const PERMISSION_GROUPS = {
  USER: {
    canAttemptQuizzes: true,
    canAccessDashboard: true,
    canManageProfile: true,
    canAccessAnalytics: true,
  },
  MODERATOR: {
    canAttemptQuizzes: true,
    canAccessDashboard: true,
    canManageProfile: true,
    canAccessAnalytics: true,
    canCreateChallenges: true,
    canManageQuestions: true,
    canEditExplanations: true,
    canPublishContent: true,
    canModerateUsers: false,
    canManageFinancials: false,
    canManagePlatform: false,
  },
  ADMIN: {
    canAttemptQuizzes: true,
    canAccessDashboard: true,
    canManageProfile: true,
    canAccessAnalytics: true,
    canCreateChallenges: true,
    canManageQuestions: true,
    canEditExplanations: true,
    canPublishContent: true,
    canModerateUsers: true,
    canManageModerators: true,
    canReviewPerformance: true,
    canApproveContent: true,
    canManageFinancials: false,
    canManagePlatform: false,
  },
  SUPER_ADMIN: {
    canAttemptQuizzes: true,
    canAccessDashboard: true,
    canManageProfile: true,
    canAccessAnalytics: true,
    canCreateChallenges: true,
    canManageQuestions: true,
    canEditExplanations: true,
    canPublishContent: true,
    canModerateUsers: true,
    canManageModerators: true,
    canReviewPerformance: true,
    canApproveContent: true,
    canManageFinancials: true,
    canManagePlatform: true,
    canManageAdmins: true,
    canCreateAdmin: true,
  },
} as const;

export type PermissionKey = keyof typeof PERMISSION_GROUPS.USER;

export const checkPermission = (
  role: Role,
  permission: PermissionKey
): boolean => {
  const permissions = PERMISSION_GROUPS[role];
  if (!permissions) return false;
  return (permissions as Record<string, boolean>)[permission] ?? false;
};