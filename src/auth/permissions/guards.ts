import { getCurrentUser } from "../session";
import { ROLE, type Role, toRole } from "../roles/role-types";
import { hasMinimumRole, hasRole } from "../roles/role-hierarchy";

export const MODERATOR_ROUTES = [
  "/moderator",
  "/dashboard/manage-challenges",
  "/dashboard/manage-questions",
  "/dashboard/create-challenge",
  "/dashboard/content",
];

export const ADMIN_ROUTES = [
  "/admin",
  "/dashboard/admin",
  "/dashboard/users",
  "/dashboard/moderators",
  "/dashboard/performance",
  "/dashboard/approve",
];

export const SUPER_ADMIN_ROUTES = [
  "/super-admin",
  "/dashboard/platform",
  "/dashboard/settings",
  "/dashboard/financials",
  "/dashboard/payouts",
];

export const isModeratorRoute = (pathname: string): boolean => {
  return MODERATOR_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
};

export const isAdminRoute = (pathname: string): boolean => {
  return ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
};

export const isSuperAdminRoute = (pathname: string): boolean => {
  return SUPER_ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
};

export const isPrivilegedRoute = (pathname: string): boolean => {
  return (
    isModeratorRoute(pathname) ||
    isAdminRoute(pathname) ||
    isSuperAdminRoute(pathname)
  );
};

export const getRequiredRoleForRoute = (pathname: string): Role | null => {
  if (isSuperAdminRoute(pathname)) return ROLE.SUPER_ADMIN;
  if (isAdminRoute(pathname)) return ROLE.ADMIN;
  if (isModeratorRoute(pathname)) return ROLE.MODERATOR;
  return null;
};

export const canAccessRoute = async (pathname: string): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;

  const userRole = toRole(user.role ?? "USER");

  const requiredRole = getRequiredRoleForRoute(pathname);
  if (!requiredRole) return true;

  return hasMinimumRole(userRole, requiredRole);
};

export const authorizeRouteAccess = async (
  pathname: string,
  redirectTo: string = "/"
): Promise<boolean> => {
  const canAccess = await canAccessRoute(pathname);
  if (!canAccess) {
    return false;
  }
  return true;
};

export const getRouteAccessLevel = (pathname: string): Role | null => {
  if (isSuperAdminRoute(pathname)) return ROLE.SUPER_ADMIN;
  if (isAdminRoute(pathname)) return ROLE.ADMIN;
  if (isModeratorRoute(pathname)) return ROLE.MODERATOR;
  return null;
};

export const validateRouteAccess = async (
  pathname: string
): Promise<{ allowed: boolean; role: Role }> => {
  const user = await getCurrentUser();
  
  if (!user) {
    return { allowed: false, role: ROLE.USER };
  }

  const userRole = toRole(user.role ?? "USER");
  const accessLevel = getRouteAccessLevel(pathname);

  if (!accessLevel) {
    return { allowed: true, role: userRole };
  }

  const hasAccess = hasMinimumRole(userRole, accessLevel);
  return { allowed: hasAccess, role: userRole };
};