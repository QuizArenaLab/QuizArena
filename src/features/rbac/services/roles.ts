export const ROLES = {
  USER: "USER",
  MODERATOR: "MODERATOR",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_VALUES = [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN] as const;

export const ROLE_DEFAULT = ROLES.USER;

export const isValidRole = (role: string): role is Role => {
  return ROLE_VALUES.includes(role as Role);
};

export const toRole = (role: string): Role => {
  if (isValidRole(role)) {
    return role;
  }
  return ROLE_DEFAULT;
};

export const ROLE_LABELS: Record<Role, string> = {
  USER: "User",
  MODERATOR: "Moderator",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
} as const;

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  USER: "Platform users / aspirants",
  MODERATOR: "Subject Matter Experts / Quiz Managers",
  ADMIN: "Platform operations management",
  SUPER_ADMIN: "Full platform authority",
} as const;
