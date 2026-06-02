import { auth } from "@/auth";
import { ROLES, type Role } from "./roles";
import { hasMinimumRole, hasRole } from "./hierarchy";
import { hasPermission } from "./permissions";
import { NextResponse } from "next/server";

export type ApiProtectionLevel = "public" | "authenticated" | "moderator" | "admin" | "super_admin";

export interface ApiRouteConfig {
  path: string;
  method: string;
  protectionLevel: ApiProtectionLevel;
  requiredPermissions?: string[];
}

export const API_PROTECTION_MAP: ApiRouteConfig[] = [
  { path: "/api/admin", method: "GET", protectionLevel: "admin" },
  { path: "/api/admin", method: "POST", protectionLevel: "admin" },
  { path: "/api/admin", method: "PUT", protectionLevel: "admin" },
  { path: "/api/admin", method: "DELETE", protectionLevel: "admin" },
  { path: "/api/moderator", method: "GET", protectionLevel: "moderator" },
  { path: "/api/moderator", method: "POST", protectionLevel: "moderator" },
  { path: "/api/moderator", method: "PUT", protectionLevel: "moderator" },
  { path: "/api/moderator", method: "DELETE", protectionLevel: "moderator" },
  { path: "/api/super-admin", method: "GET", protectionLevel: "super_admin" },
  { path: "/api/super-admin", method: "POST", protectionLevel: "super_admin" },
  { path: "/api/super-admin", method: "PUT", protectionLevel: "super_admin" },
  { path: "/api/super-admin", method: "DELETE", protectionLevel: "super_admin" },
  { path: "/api/financials", method: "GET", protectionLevel: "super_admin" },
  { path: "/api/financials", method: "POST", protectionLevel: "super_admin" },
  { path: "/api/financials", method: "PUT", protectionLevel: "super_admin" },
  { path: "/api/roles", method: "POST", protectionLevel: "super_admin" },
  { path: "/api/roles", method: "PUT", protectionLevel: "super_admin" },
  { path: "/api/roles", method: "DELETE", protectionLevel: "super_admin" },
];

export const getProtectionLevel = (pathname: string): ApiProtectionLevel => {
  for (const route of API_PROTECTION_MAP) {
    if (pathname.startsWith(route.path)) {
      return route.protectionLevel;
    }
  }
  return "public";
};

export const validateApiAccess = async (
  pathname: string
): Promise<{ authorized: boolean; userRole: Role }> => {
  const session = await auth();
  if (!session?.user) {
    return { authorized: false, userRole: ROLES.USER };
  }

  const userRole = (session.user.role as Role) ?? ROLES.USER;
  const protectionLevel = getProtectionLevel(pathname);

  switch (protectionLevel) {
    case "public":
      return { authorized: true, userRole };
    case "authenticated":
      return { authorized: !!session.user, userRole };
    case "moderator":
      return { authorized: hasMinimumRole(userRole, ROLES.MODERATOR), userRole };
    case "admin":
      return { authorized: hasMinimumRole(userRole, ROLES.ADMIN), userRole };
    case "super_admin":
      return { authorized: hasRole(userRole, ROLES.SUPER_ADMIN), userRole };
    default:
      return { authorized: false, userRole };
  }
};

export const createApiAuthGuard = (protectionLevel: ApiProtectionLevel) => {
  return async (): Promise<NextResponse | null> => {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user.role as Role) ?? ROLES.USER;
    let authorized = false;

    switch (protectionLevel) {
      case "public":
        authorized = true;
        break;
      case "authenticated":
        authorized = !!session.user;
        break;
      case "moderator":
        authorized = hasMinimumRole(userRole, ROLES.MODERATOR);
        break;
      case "admin":
        authorized = hasMinimumRole(userRole, ROLES.ADMIN);
        break;
      case "super_admin":
        authorized = hasRole(userRole, ROLES.SUPER_ADMIN);
        break;
    }

    if (!authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return null;
  };
};

export const withApiAuth = (
  protectionLevel: ApiProtectionLevel,
  handler: (userRole: Role) => Promise<NextResponse>
) => {
  return async (): Promise<NextResponse> => {
    const guard = createApiAuthGuard(protectionLevel);
    const errorResponse = await guard();
    if (errorResponse) {
      return errorResponse;
    }

    const session = await auth();
    const userRole = (session?.user?.role as Role) ?? ROLES.USER;
    return handler(userRole);
  };
};

export const validateApiPermission = (userRole: Role, requiredPermission: string): boolean => {
  return hasPermission(userRole, requiredPermission as never);
};

export const createPermissionGuard = (requiredPermission: string) => {
  return async (): Promise<NextResponse | null> => {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user.role as Role) ?? ROLES.USER;
    if (!hasPermission(userRole, requiredPermission as never)) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    return null;
  };
};
