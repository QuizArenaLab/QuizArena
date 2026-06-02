import type { UserRole as PrismaUserRole } from "@prisma/client";

export const ROLE = {
  USER: "USER",
  MODERATOR: "MODERATOR",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];

export const ROLE_HIERARCHY: Record<Role, number> = {
  USER: 0,
  MODERATOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
} as const;

export const ROLE_LABELS: Record<Role, string> = {
  USER: "User",
  MODERATOR: "Moderator",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
} as const;

export const isValidRole = (role: string): role is Role => {
  return role in ROLE;
};

export const toRole = (role: string): Role => {
  if (isValidRole(role)) {
    return role;
  }
  return ROLE.USER;
};

export const isPrismaUserRole = (role: string): role is PrismaUserRole => {
  return role === "USER" || role === "MODERATOR" || role === "ADMIN" || role === "SUPER_ADMIN";
};

export type UserRole = PrismaUserRole;
