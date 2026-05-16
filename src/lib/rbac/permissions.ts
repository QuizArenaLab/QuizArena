import { ROLES, type Role } from "./roles";
import { hasMinimumRole, hasRole } from "./hierarchy";

export type Permission =
  | "quizzes.attempt"
  | "dashboard.access"
  | "profile.manage"
  | "analytics.access"
  | "challenges.create"
  | "questions.manage"
  | "explanations.edit"
  | "content.publish"
  | "users.moderate"
  | "moderators.manage"
  | "admins.manage"
  | "performance.review"
  | "content.approve"
  | "financials.manage"
  | "platform.settings"
  | "admin.create";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  USER: [
    "quizzes.attempt",
    "dashboard.access",
    "profile.manage",
    "analytics.access",
  ],
  MODERATOR: [
    "quizzes.attempt",
    "dashboard.access",
    "profile.manage",
    "analytics.access",
    "challenges.create",
    "questions.manage",
    "explanations.edit",
    "content.publish",
  ],
  ADMIN: [
    "quizzes.attempt",
    "dashboard.access",
    "profile.manage",
    "analytics.access",
    "challenges.create",
    "questions.manage",
    "explanations.edit",
    "content.publish",
    "users.moderate",
    "moderators.manage",
    "performance.review",
    "content.approve",
  ],
  SUPER_ADMIN: [
    "quizzes.attempt",
    "dashboard.access",
    "profile.manage",
    "analytics.access",
    "challenges.create",
    "questions.manage",
    "explanations.edit",
    "content.publish",
    "users.moderate",
    "moderators.manage",
    "admins.manage",
    "performance.review",
    "content.approve",
    "financials.manage",
    "platform.settings",
    "admin.create",
  ],
};

export const hasPermission = (role: Role | string, permission: Permission): boolean => {
  const safeRole = typeof role === "string" ? (role as Role) : role;
  const permissions = ROLE_PERMISSIONS[safeRole];
  if (!permissions) return false;
  return permissions.includes(permission);
};

export const canManageChallenges = (role: Role | string): boolean => {
  return (
    hasMinimumRole(role, ROLES.MODERATOR) ||
    hasRole(role, ROLES.ADMIN) ||
    hasRole(role, ROLES.SUPER_ADMIN)
  );
};

export const canManageQuestions = (role: Role | string): boolean => {
  return (
    hasMinimumRole(role, ROLES.MODERATOR) ||
    hasRole(role, ROLES.ADMIN) ||
    hasRole(role, ROLES.SUPER_ADMIN)
  );
};

export const canModerateUsers = (role: Role | string): boolean => {
  return hasMinimumRole(role, ROLES.ADMIN) || hasRole(role, ROLES.SUPER_ADMIN);
};

export const canManageModerators = (role: Role | string): boolean => {
  return hasRole(role, ROLES.ADMIN) || hasRole(role, ROLES.SUPER_ADMIN);
};

export const canManageAdmins = (role: Role | string): boolean => {
  return hasRole(role, ROLES.SUPER_ADMIN);
};

export const canManagePlatform = (role: Role | string): boolean => {
  return hasRole(role, ROLES.SUPER_ADMIN);
};

export const canManageFinancials = (role: Role | string): boolean => {
  return hasRole(role, ROLES.SUPER_ADMIN);
};

export const canApproveContent = (role: Role | string): boolean => {
  return hasRole(role, ROLES.ADMIN) || hasRole(role, ROLES.SUPER_ADMIN);
};

export const canReviewPerformance = (role: Role | string): boolean => {
  return hasRole(role, ROLES.ADMIN) || hasRole(role, ROLES.SUPER_ADMIN);
};

export const canManageSettings = (role: Role | string): boolean => {
  return hasRole(role, ROLES.SUPER_ADMIN);
};

export const canCreateAdmin = (role: Role | string): boolean => {
  return hasRole(role, ROLES.SUPER_ADMIN);
};