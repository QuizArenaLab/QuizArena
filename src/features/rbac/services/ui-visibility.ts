import { ROLES, type Role } from "./roles";
import { hasMinimumRole, hasRole } from "./hierarchy";
import { hasPermission, type Permission } from "./permissions";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  requiredRole?: Role;
  requiredPermission?: Permission;
}

export const NAV_VISIBILITY = {
  USER: {
    dashboard: true,
    challenges: true,
    analytics: true,
    leaderboard: true,
    profile: true,
    settings: true,
    manageChallenges: false,
    questionBank: false,
    contentQueue: false,
    userModeration: false,
    moderatorOversight: false,
    reports: false,
    performance: false,
    revenue: false,
    platform: false,
    roleManagement: false,
  },
  MODERATOR: {
    dashboard: true,
    challenges: true,
    analytics: true,
    leaderboard: true,
    profile: true,
    settings: true,
    manageChallenges: true,
    questionBank: true,
    contentQueue: true,
    userModeration: false,
    moderatorOversight: false,
    reports: false,
    performance: false,
    revenue: false,
    platform: false,
    roleManagement: false,
  },
  ADMIN: {
    dashboard: true,
    challenges: true,
    analytics: true,
    leaderboard: true,
    profile: true,
    settings: true,
    manageChallenges: true,
    questionBank: true,
    contentQueue: true,
    userModeration: true,
    moderatorOversight: true,
    reports: true,
    performance: true,
    revenue: false,
    platform: false,
    roleManagement: false,
  },
  SUPER_ADMIN: {
    dashboard: true,
    challenges: true,
    analytics: true,
    leaderboard: true,
    profile: true,
    settings: true,
    manageChallenges: true,
    questionBank: true,
    contentQueue: true,
    userModeration: true,
    moderatorOversight: true,
    reports: true,
    performance: true,
    revenue: true,
    platform: true,
    roleManagement: true,
  },
} as const;

export type NavSection = keyof typeof NAV_VISIBILITY.USER;

export const canViewNavSection = (userRole: Role, section: NavSection): boolean => {
  const visibilityMap = NAV_VISIBILITY[userRole];
  if (!visibilityMap) return false;
  return visibilityMap[section] ?? false;
};

export const getVisibleNavSections = (userRole: Role): NavSection[] => {
  const visibilityMap = NAV_VISIBILITY[userRole];
  if (!visibilityMap) return [];

  return (Object.keys(visibilityMap) as NavSection[]).filter((section) => visibilityMap[section]);
};

export const COMPONENT_VISIBILITY: Record<Permission, Role[]> = {
  "quizzes.attempt": [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "dashboard.access": [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "profile.manage": [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "analytics.access": [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "challenges.create": [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "questions.manage": [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "explanations.edit": [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "content.publish": [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "users.moderate": [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "moderators.manage": [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "admins.manage": [ROLES.SUPER_ADMIN],
  "performance.review": [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "content.approve": [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "financials.manage": [ROLES.SUPER_ADMIN],
  "platform.settings": [ROLES.SUPER_ADMIN],
  "platform.operational_settings": [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "platform.intelligence": [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "admin.create": [ROLES.SUPER_ADMIN],
};

export const canViewComponent = (userRole: Role, requiredPermission: Permission): boolean => {
  const allowedRoles = COMPONENT_VISIBILITY[requiredPermission];
  if (!allowedRoles) return false;
  return allowedRoles.includes(userRole);
};

export const ACTION_VISIBILITY = {
  CREATE_CHALLENGE: [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  EDIT_CHALLENGE: [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  DELETE_CHALLENGE: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  PUBLISH_CHALLENGE: [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  MANAGE_QUESTIONS: [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  CREATE_QUESTION: [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  DELETE_QUESTION: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  EDIT_EXPLANATION: [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  MANAGE_USERS: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  BAN_USER: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  SUSPEND_USER: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  MANAGE_MODERATORS: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  VIEW_REPORTS: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  VIEW_PERFORMANCE: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  APPROVE_CONTENT: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  VIEW_REVENUE: [ROLES.SUPER_ADMIN],
  MANAGE_ROLES: [ROLES.SUPER_ADMIN],
  PLATFORM_SETTINGS: [ROLES.SUPER_ADMIN],
} as const;

export type ActionKey = keyof typeof ACTION_VISIBILITY;

export const canPerformAction = (userRole: Role, action: ActionKey): boolean => {
  const allowedRoles = ACTION_VISIBILITY[action] as readonly Role[];
  if (!allowedRoles) return false;
  return allowedRoles.includes(userRole);
};

export const EMPTY_STATE_MESSAGES = {
  CHALLENGES: {
    [ROLES.USER]: {
      title: "No challenges yet",
      description: "Complete your first challenge to unlock analytics and track your progress.",
      action: "Browse Challenges",
    },
    [ROLES.MODERATOR]: {
      title: "No published challenges",
      description: "Create your first challenge to start building your content portfolio.",
      action: "Create Challenge",
    },
    [ROLES.ADMIN]: {
      title: "No active challenges",
      description: "Review moderation queue or create new challenges for the platform.",
      action: "View Queue",
    },
    [ROLES.SUPER_ADMIN]: {
      title: "No platform challenges",
      description: "Platform challenges will appear here for monitoring and analytics.",
      action: "View Overview",
    },
  },
  QUESTIONS: {
    [ROLES.USER]: {
      title: "No questions available",
      description: "Questions will appear when you start a challenge.",
      action: "",
    },
    [ROLES.MODERATOR]: {
      title: "No questions in bank",
      description: "Add questions to build your challenge content.",
      action: "Add Question",
    },
    [ROLES.ADMIN]: {
      title: "No pending questions",
      description: "All questions have been reviewed. Great work!",
      action: "",
    },
    [ROLES.SUPER_ADMIN]: {
      title: "Question analytics",
      description: "Detailed question analytics will appear here.",
      action: "",
    },
  },
  REPORTS: {
    [ROLES.USER]: {
      title: "No reports",
      description: "Reports will appear here when you participate in challenges.",
      action: "",
    },
    [ROLES.MODERATOR]: {
      title: "No content reports",
      description: "Content reports will appear here for review.",
      action: "",
    },
    [ROLES.ADMIN]: {
      title: "No moderation reports",
      description: "All moderation reports have been addressed. Great job!",
      action: "",
    },
    [ROLES.SUPER_ADMIN]: {
      title: "No system reports",
      description: "System reports will appear here for review.",
      action: "",
    },
  },
  REVENUE: {
    [ROLES.USER]: {
      title: "Revenue not available",
      description: "This section is not available for your role.",
      action: "",
    },
    [ROLES.MODERATOR]: {
      title: "Revenue not available",
      description: "This section is not available for your role.",
      action: "",
    },
    [ROLES.ADMIN]: {
      title: "Revenue not available",
      description: "This section is restricted. Contact super admin for access.",
      action: "",
    },
    [ROLES.SUPER_ADMIN]: {
      title: "Revenue diagnostics",
      description: "Revenue analytics and payouts will appear here.",
      action: "View Reports",
    },
  },
} as const;

export type EmptyStateCategory = keyof typeof EMPTY_STATE_MESSAGES;

export const getEmptyStateMessage = (
  category: EmptyStateCategory,
  userRole: Role
): { title: string; description: string; action: string } => {
  const categoryMessages = EMPTY_STATE_MESSAGES[category] as Record<
    Role,
    { title: string; description: string; action: string }
  >;
  if (!categoryMessages) {
    return { title: "No data", description: "No data available.", action: "" };
  }
  return categoryMessages[userRole] ?? categoryMessages[ROLES.USER];
};

export const DASHBOARD_FOCUS = {
  [ROLES.USER]: {
    primary: "Preparation",
    secondary: "Challenges & Analytics",
    quickActions: ["Browse Challenges", "View Analytics", "Check Rankings"],
  },
  [ROLES.MODERATOR]: {
    primary: "Content Operations",
    secondary: "Challenge Workflow",
    quickActions: ["Create Challenge", "Manage Questions", "Review Queue"],
  },
  [ROLES.ADMIN]: {
    primary: "Platform Operations",
    secondary: "Moderation Systems",
    quickActions: ["User Moderation", "View Reports", "Moderator Oversight"],
  },
  [ROLES.SUPER_ADMIN]: {
    primary: "Platform Authority",
    secondary: "Financial Overview",
    quickActions: ["Revenue Dashboard", "Role Management", "Platform Settings"],
  },
} as const;

export type DashboardFocusKey = keyof typeof DASHBOARD_FOCUS;

export const getDashboardFocus = (userRole: Role) => {
  return DASHBOARD_FOCUS[userRole] ?? DASHBOARD_FOCUS[ROLES.USER];
};

export const canViewAdminPanel = (userRole: Role): boolean => {
  return hasMinimumRole(userRole, ROLES.ADMIN);
};

export const canManageChallenges = (userRole: Role): boolean => {
  return hasMinimumRole(userRole, ROLES.MODERATOR);
};

export const canAccessRevenue = (userRole: Role): boolean => {
  return hasRole(userRole, ROLES.SUPER_ADMIN);
};

export const canManageRoles = (userRole: Role): boolean => {
  return hasRole(userRole, ROLES.SUPER_ADMIN);
};

export const canModerateUsers = (userRole: Role): boolean => {
  return hasMinimumRole(userRole, ROLES.ADMIN);
};

export const canViewReports = (userRole: Role): boolean => {
  return hasMinimumRole(userRole, ROLES.ADMIN);
};

export const canApproveContent = (userRole: Role): boolean => {
  return hasMinimumRole(userRole, ROLES.ADMIN);
};

export const createVisibilityGuard = (allowedRoles: Role[]) => {
  return (userRole: Role): boolean => {
    return allowedRoles.includes(userRole);
  };
};

export const createPermissionGuard = (requiredPermission: Permission) => {
  return (userRole: Role): boolean => {
    return hasPermission(userRole, requiredPermission);
  };
};

export const getRoleSpecificFeatures = (userRole: Role): string[] => {
  const features: Record<Role, string[]> = {
    [ROLES.USER]: ["challenges", "analytics", "leaderboard", "profile"],
    [ROLES.MODERATOR]: ["challenge_management", "question_bank", "content_queue", "analytics"],
    [ROLES.ADMIN]: [
      "user_moderation",
      "moderator_oversight",
      "reports",
      "performance",
      "analytics",
    ],
    [ROLES.SUPER_ADMIN]: [
      "revenue",
      "role_management",
      "platform_settings",
      "user_moderation",
      "reports",
    ],
  };
  return features[userRole] ?? features[ROLES.USER];
};

export const isFeatureEnabled = (userRole: Role, feature: string): boolean => {
  const features = getRoleSpecificFeatures(userRole);
  return features.includes(feature);
};

export const ROLE_ICONS = {
  [ROLES.USER]: "User",
  [ROLES.MODERATOR]: "FolderCog",
  [ROLES.ADMIN]: "Shield",
  [ROLES.SUPER_ADMIN]: "Crown",
} as const;

export const getRoleIcon = (userRole: Role): string => {
  return ROLE_ICONS[userRole] ?? "User";
};

export const ROLE_COLORS = {
  [ROLES.USER]: "gray",
  [ROLES.MODERATOR]: "amber",
  [ROLES.ADMIN]: "blue",
  [ROLES.SUPER_ADMIN]: "purple",
} as const;

export const getRoleColor = (userRole: Role): string => {
  return ROLE_COLORS[userRole] ?? "gray";
};

export const DEBUG_RBAC = process.env.NODE_ENV === "development";

export const isDebugMode = (): boolean => DEBUG_RBAC;

export const simulateRole = DEBUG_RBAC
  ? (role: Role) => {
      console.log(`[RBAC DEBUG] Simulating role: ${role}`);
      return role;
    }
  : () => {
      throw new Error("Role simulation only available in development");
    };

export const getRoleBasedHref = (userRole: Role, basePath: string): string => {
  const rolePathMap: Record<Role, string> = {
    [ROLES.USER]: basePath,
    [ROLES.MODERATOR]: "/dashboard/home",
    [ROLES.ADMIN]: "/dashboard/home",
    [ROLES.SUPER_ADMIN]: "/dashboard/home",
  };
  return rolePathMap[userRole] ?? basePath;
};

export const filterAccessibleRoutes = (
  userRole: Role,
  routes: { href: string; label: string; requiredRole?: Role }[]
): { href: string; label: string }[] => {
  return routes.filter((route) => {
    if (!route.requiredRole) return true;
    return hasMinimumRole(userRole, route.requiredRole);
  });
};

export const getBreadcrumbConfig = (
  userRole: Role,
  currentPath: string
): { items: { label: string; href?: string }[] } => {
  const baseItems = [{ label: "Dashboard", href: "/dashboard/home" }];

  if (currentPath.includes("manage-challenges")) {
    return {
      items: [...baseItems, { label: "Manage Challenges", href: "/dashboard/manage-challenges" }],
    };
  }
  if (currentPath.includes("questions")) {
    return {
      items: [...baseItems, { label: "Question Bank", href: "/dashboard/questions" }],
    };
  }
  if (currentPath.includes("users")) {
    return {
      items: [...baseItems, { label: "Users", href: "/dashboard/users" }],
    };
  }
  if (currentPath.includes("financials")) {
    return {
      items: [...baseItems, { label: "Revenue", href: "/dashboard/financials" }],
    };
  }
  if (currentPath.includes("roles")) {
    return {
      items: [...baseItems, { label: "Role Management", href: "/dashboard/roles" }],
    };
  }

  return { items: baseItems };
};
