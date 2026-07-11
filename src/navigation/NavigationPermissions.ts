export type NavigationPermission = string;

export const DefaultPermissions = {
  GUEST: "guest",
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
  SUPER_ADMIN: "super-admin",
} as const;
