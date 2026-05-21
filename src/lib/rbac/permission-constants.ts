import { ROLES, type Role } from "./roles";

export const PERMISSIONS = {
  CHALLENGE: {
    CREATE: "challenge:create",
    READ: "challenge:read",
    UPDATE: "challenge:update",
    DELETE: "challenge:delete",
    PUBLISH: "challenge:publish",
    ARCHIVE: "challenge:archive",
  },
  QUESTION: {
    CREATE: "question:create",
    READ: "question:read",
    UPDATE: "question:update",
    DELETE: "question:delete",
    APPROVE: "question:approve",
  },
  USER: {
    READ: "user:read",
    UPDATE: "user:update",
    DELETE: "user:delete",
    BAN: "user:ban",
    SUSPEND: "user:suspend",
  },
  MODERATOR: {
    ASSIGN: "moderator:assign",
    REVOKE: "moderator:revoke",
    OVERSEE: "moderator:oversee",
  },
  ADMIN: {
    ASSIGN: "admin:assign",
    REVOKE: "admin:revoke",
    OVERSEE: "admin:oversee",
  },
  CONTENT: {
    PUBLISH: "content:publish",
    APPROVE: "content:approve",
    REJECT: "content:reject",
    FLAG: "content:flag",
  },
  ANALYTICS: {
    VIEW: "analytics:view",
    EXPORT: "analytics:export",
  },
  FINANCIAL: {
    VIEW: "financial:view",
    MANAGE: "financial:manage",
    PROCESS_PAYOUT: "financial:process_payout",
    VIEW_REPORTS: "financial:view_reports",
  },
  ROLE: {
    ASSIGN: "role:assign",
    REVOKE: "role:revoke",
    VIEW: "role:view",
    MANAGE: "role:manage",
  },
  PLATFORM: {
    CONFIGURE: "platform:configure",
    VIEW_SETTINGS: "platform:view_settings",
    MANAGE_INTEGRATIONS: "platform:manage_integrations",
    INTELLIGENCE: "platform:intelligence",
  },
  SUBSCRIPTION: {
    VIEW: "subscription:view",
    MANAGE: "subscription:manage",
  },
  REPORT: {
    VIEW: "report:view",
    CREATE: "report:create",
    RESOLVE: "report:resolve",
  },
} as const;

export type PermissionKey =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS][keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]];

export const PERMISSION_GROUPS = {
  CHALLENGE_MANAGEMENT: [
    PERMISSIONS.CHALLENGE.CREATE,
    PERMISSIONS.CHALLENGE.READ,
    PERMISSIONS.CHALLENGE.UPDATE,
    PERMISSIONS.CHALLENGE.DELETE,
    PERMISSIONS.CHALLENGE.PUBLISH,
  ],
  QUESTION_MANAGEMENT: [
    PERMISSIONS.QUESTION.CREATE,
    PERMISSIONS.QUESTION.READ,
    PERMISSIONS.QUESTION.UPDATE,
    PERMISSIONS.QUESTION.DELETE,
  ],
  USER_MANAGEMENT: [
    PERMISSIONS.USER.READ,
    PERMISSIONS.USER.UPDATE,
    PERMISSIONS.USER.BAN,
    PERMISSIONS.USER.SUSPEND,
  ],
  MODERATION: [
    PERMISSIONS.CONTENT.APPROVE,
    PERMISSIONS.CONTENT.REJECT,
    PERMISSIONS.CONTENT.FLAG,
    PERMISSIONS.REPORT.VIEW,
    PERMISSIONS.REPORT.RESOLVE,
  ],
  FINANCIAL: [
    PERMISSIONS.FINANCIAL.VIEW,
    PERMISSIONS.FINANCIAL.MANAGE,
    PERMISSIONS.FINANCIAL.PROCESS_PAYOUT,
    PERMISSIONS.FINANCIAL.VIEW_REPORTS,
  ],
  ROLE_MANAGEMENT: [
    PERMISSIONS.ROLE.ASSIGN,
    PERMISSIONS.ROLE.REVOKE,
    PERMISSIONS.ROLE.VIEW,
    PERMISSIONS.ROLE.MANAGE,
  ],
  PLATFORM: [
    PERMISSIONS.PLATFORM.CONFIGURE,
    PERMISSIONS.PLATFORM.VIEW_SETTINGS,
    PERMISSIONS.PLATFORM.MANAGE_INTEGRATIONS,
    PERMISSIONS.PLATFORM.INTELLIGENCE,
  ],
} as const;

export type PermissionGroup = keyof typeof PERMISSION_GROUPS;

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  [PERMISSIONS.CHALLENGE.CREATE]: "Create Challenge",
  [PERMISSIONS.CHALLENGE.READ]: "View Challenge",
  [PERMISSIONS.CHALLENGE.UPDATE]: "Edit Challenge",
  [PERMISSIONS.CHALLENGE.DELETE]: "Delete Challenge",
  [PERMISSIONS.CHALLENGE.PUBLISH]: "Publish Challenge",
  [PERMISSIONS.CHALLENGE.ARCHIVE]: "Archive Challenge",
  [PERMISSIONS.QUESTION.CREATE]: "Create Question",
  [PERMISSIONS.QUESTION.READ]: "View Question",
  [PERMISSIONS.QUESTION.UPDATE]: "Edit Question",
  [PERMISSIONS.QUESTION.DELETE]: "Delete Question",
  [PERMISSIONS.QUESTION.APPROVE]: "Approve Question",
  [PERMISSIONS.USER.READ]: "View User",
  [PERMISSIONS.USER.UPDATE]: "Edit User",
  [PERMISSIONS.USER.DELETE]: "Delete User",
  [PERMISSIONS.USER.BAN]: "Ban User",
  [PERMISSIONS.USER.SUSPEND]: "Suspend User",
  [PERMISSIONS.MODERATOR.ASSIGN]: "Assign Moderator",
  [PERMISSIONS.MODERATOR.REVOKE]: "Revoke Moderator",
  [PERMISSIONS.MODERATOR.OVERSEE]: "Oversee Moderators",
  [PERMISSIONS.ADMIN.ASSIGN]: "Assign Admin",
  [PERMISSIONS.ADMIN.REVOKE]: "Revoke Admin",
  [PERMISSIONS.ADMIN.OVERSEE]: "Oversee Admins",
  [PERMISSIONS.CONTENT.PUBLISH]: "Publish Content",
  [PERMISSIONS.CONTENT.APPROVE]: "Approve Content",
  [PERMISSIONS.CONTENT.REJECT]: "Reject Content",
  [PERMISSIONS.CONTENT.FLAG]: "Flag Content",
  [PERMISSIONS.ANALYTICS.VIEW]: "View Analytics",
  [PERMISSIONS.ANALYTICS.EXPORT]: "Export Analytics",
  [PERMISSIONS.FINANCIAL.VIEW]: "View Financials",
  [PERMISSIONS.FINANCIAL.MANAGE]: "Manage Financials",
  [PERMISSIONS.FINANCIAL.PROCESS_PAYOUT]: "Process Payouts",
  [PERMISSIONS.FINANCIAL.VIEW_REPORTS]: "View Financial Reports",
  [PERMISSIONS.ROLE.ASSIGN]: "Assign Role",
  [PERMISSIONS.ROLE.REVOKE]: "Revoke Role",
  [PERMISSIONS.ROLE.VIEW]: "View Roles",
  [PERMISSIONS.ROLE.MANAGE]: "Manage Roles",
  [PERMISSIONS.PLATFORM.CONFIGURE]: "Configure Platform",
  [PERMISSIONS.PLATFORM.VIEW_SETTINGS]: "View Settings",
  [PERMISSIONS.PLATFORM.MANAGE_INTEGRATIONS]: "Manage Integrations",
  [PERMISSIONS.PLATFORM.INTELLIGENCE]: "View Operational Intelligence",
  [PERMISSIONS.SUBSCRIPTION.VIEW]: "View Subscription",
  [PERMISSIONS.SUBSCRIPTION.MANAGE]: "Manage Subscription",
  [PERMISSIONS.REPORT.VIEW]: "View Reports",
  [PERMISSIONS.REPORT.CREATE]: "Create Report",
  [PERMISSIONS.REPORT.RESOLVE]: "Resolve Report",
};

export const PERMISSION_CATEGORIES = {
  challenges: [
    PERMISSIONS.CHALLENGE.CREATE,
    PERMISSIONS.CHALLENGE.READ,
    PERMISSIONS.CHALLENGE.UPDATE,
    PERMISSIONS.CHALLENGE.DELETE,
    PERMISSIONS.CHALLENGE.PUBLISH,
    PERMISSIONS.CHALLENGE.ARCHIVE,
  ],
  questions: [
    PERMISSIONS.QUESTION.CREATE,
    PERMISSIONS.QUESTION.READ,
    PERMISSIONS.QUESTION.UPDATE,
    PERMISSIONS.QUESTION.DELETE,
    PERMISSIONS.QUESTION.APPROVE,
  ],
  users: [
    PERMISSIONS.USER.READ,
    PERMISSIONS.USER.UPDATE,
    PERMISSIONS.USER.DELETE,
    PERMISSIONS.USER.BAN,
    PERMISSIONS.USER.SUSPEND,
  ],
  moderation: [
    PERMISSIONS.CONTENT.PUBLISH,
    PERMISSIONS.CONTENT.APPROVE,
    PERMISSIONS.CONTENT.REJECT,
    PERMISSIONS.CONTENT.FLAG,
    PERMISSIONS.REPORT.VIEW,
    PERMISSIONS.REPORT.CREATE,
    PERMISSIONS.REPORT.RESOLVE,
  ],
  financials: [
    PERMISSIONS.FINANCIAL.VIEW,
    PERMISSIONS.FINANCIAL.MANAGE,
    PERMISSIONS.FINANCIAL.PROCESS_PAYOUT,
    PERMISSIONS.FINANCIAL.VIEW_REPORTS,
  ],
  roles: [
    PERMISSIONS.ROLE.ASSIGN,
    PERMISSIONS.ROLE.REVOKE,
    PERMISSIONS.ROLE.VIEW,
    PERMISSIONS.ROLE.MANAGE,
  ],
  platform: [
    PERMISSIONS.PLATFORM.CONFIGURE,
    PERMISSIONS.PLATFORM.VIEW_SETTINGS,
    PERMISSIONS.PLATFORM.MANAGE_INTEGRATIONS,
    PERMISSIONS.PLATFORM.INTELLIGENCE,
  ],
  analytics: [PERMISSIONS.ANALYTICS.VIEW, PERMISSIONS.ANALYTICS.EXPORT],
} as const;

export const isValidPermission = (permission: string): permission is PermissionKey => {
  return Object.values(PERMISSIONS).some((group) =>
    Object.values(group).includes(permission as PermissionKey)
  );
};

export const getPermissionLabel = (permission: PermissionKey): string => {
  return PERMISSION_LABELS[permission] ?? permission;
};

export const getPermissionsByCategory = (category: string): readonly string[] => {
  return PERMISSION_CATEGORIES[category as keyof typeof PERMISSION_CATEGORIES] ?? [];
};
