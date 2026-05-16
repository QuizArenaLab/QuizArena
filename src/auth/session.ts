import { auth } from "./auth";
import { cache } from "react";
import { redirect } from "next/navigation";
import { ROLE, toRole, type Role } from "./roles/role-types";
import { hasMinimumRole, hasRole } from "./roles/role-hierarchy";
import type { User } from "next-auth";

export const getSession = cache(async () => {
  return await auth();
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  return session?.user ?? null;
});

export const getUserRole = cache(async (): Promise<Role | null> => {
  const user = await getCurrentUser();
  if (!user?.role) return null;
  return toRole(user.role as string);
});

export const isAuthenticated = cache(async (): Promise<boolean> => {
  const session = await getSession();
  return !!session?.user;
});

export const requireUser = cache(async (redirectTo: string = "/login") => {
  const user = await getCurrentUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
});

export const requireRole = cache(async (requiredRole: Role, redirectTo: string = "/") => {
  const user = await getCurrentUser();
  const userRole = toRole(user?.role ?? "USER");
  if (!user || !hasRole(userRole, requiredRole)) {
    redirect(redirectTo);
  }
  return user;
});

export const requireMinimumRole = cache(async (minimumRole: Role, redirectTo: string = "/") => {
  const user = await getCurrentUser();
  const userRole = toRole(user?.role ?? "USER");
  if (!user || !hasMinimumRole(userRole, minimumRole)) {
    redirect(redirectTo);
  }
  return user;
});

export const requireModerator = cache(async (redirectTo: string = "/") => {
  return requireMinimumRole(ROLE.MODERATOR, redirectTo);
});

export const requireAdmin = cache(async (redirectTo: string = "/") => {
  return requireMinimumRole(ROLE.ADMIN, redirectTo);
});

export const requireSuperAdmin = cache(async (redirectTo: string = "/") => {
  return requireMinimumRole(ROLE.SUPER_ADMIN, redirectTo);
});

export const isUser = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return hasRole(toRole(user?.role ?? "USER"), ROLE.USER);
});

export const isModerator = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return hasRole(toRole(user?.role ?? "USER"), ROLE.MODERATOR);
});

export const isAdmin = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return hasRole(toRole(user?.role ?? "USER"), ROLE.ADMIN);
});

export const isSuperAdmin = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return hasRole(toRole(user?.role ?? "USER"), ROLE.SUPER_ADMIN);
});

export const isAtLeastModerator = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return hasMinimumRole(toRole(user?.role ?? "USER"), ROLE.MODERATOR);
});

export const isAtLeastAdmin = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return hasMinimumRole(toRole(user?.role ?? "USER"), ROLE.ADMIN);
});

export const isAtLeastSuperAdmin = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return hasMinimumRole(toRole(user?.role ?? "USER"), ROLE.SUPER_ADMIN);
});

export const hasMinimumRoleCheck = cache(async (minimumRole: Role): Promise<boolean> => {
  const user = await getCurrentUser();
  return hasMinimumRole(toRole(user?.role ?? "USER"), minimumRole);
});

export const checkRoleAccess = cache(async (requiredRole: Role): Promise<{
  allowed: boolean;
  user: User | null;
}> => {
  const user = await getCurrentUser();
  if (!user) {
    return { allowed: false, user: null };
  }
  const allowed = hasMinimumRole(toRole(user?.role ?? "USER"), requiredRole);
  return { allowed, user };
});

export const getSafeUserRole = (role: string | undefined | null): Role => {
  if (!role) return ROLE.USER;
  return toRole(role);
};