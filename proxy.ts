import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth/auth.config";
import { ROUTES } from "@/lib/routes";
import { ROLE, toRole, type Role } from "@/auth/roles/role-types";
import { hasMinimumRole, hasRole } from "@/auth/roles/role-hierarchy";

const { auth } = NextAuth(authConfig);

/**
 * QuizArena — Production-Grade RBAC Middleware
 *
 * Handles:
 * - Route protection (authenticated vs public)
 * - Role-based access control
 * - Redirect management (no loops)
 * - Auth callback pass-through
 * - Static asset bypass
 * - Onboarding flow gating
 * - Hierarchical role enforcement
 * - Deny-by-default security
 */

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/login",
  "/register",
  "/forgot-password",
];

const AUTH_ONLY_ROUTES = ["/login", "/register"];

const PUBLIC_API_PREFIXES = ["/api/auth", "/api/webhooks", "/api/me", "/api/user"];

const MODERATOR_ROUTES = [
  "/moderator",
  "/dashboard/manage-challenges",
  "/dashboard/manage-questions",
  "/dashboard/create-challenge",
  "/dashboard/content",
  "/dashboard/questions",
];

const ADMIN_ROUTES = [
  "/admin",
  "/dashboard/admin",
  "/dashboard/users",
  "/dashboard/moderators",
  "/dashboard/performance",
  "/dashboard/approve",
  "/dashboard/reports",
];

const SUPER_ADMIN_ROUTES = [
  "/super-admin",
  "/dashboard/platform",
  "/dashboard/settings",
  "/dashboard/financials",
  "/dashboard/payouts",
  "/dashboard/system",
];

const PROTECTED_ROUTES = [
  ROUTES.PROTECTED.DASHBOARD,
  ROUTES.PROTECTED.PROFILE,
  ROUTES.PROTECTED.SETTINGS,
  ROUTES.PROTECTED.CHALLENGES,
  ROUTES.PROTECTED.LEADERBOARD,
  ROUTES.PROTECTED.ANALYTICS,
  ROUTES.PROTECTED.SUBSCRIPTION,
  ROUTES.ONBOARDING.ROOT,
  ...MODERATOR_ROUTES,
  ...ADMIN_ROUTES,
  ...SUPER_ADMIN_ROUTES,
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

function isAuthOnlyRoute(pathname: string): boolean {
  return AUTH_ONLY_ROUTES.includes(pathname);
}

function isPublicApiRoute(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes("/_next/image") ||
    /\.(ico|png|jpg|jpeg|gif|svg|css|js|woff2?)$/.test(pathname)
  );
}

function isModeratorRoute(pathname: string): boolean {
  return MODERATOR_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function isSuperAdminRoute(pathname: string): boolean {
  return SUPER_ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function getRequiredRoleForRoute(pathname: string): Role | null {
  if (isSuperAdminRoute(pathname)) return ROLE.SUPER_ADMIN;
  if (isAdminRoute(pathname)) return ROLE.ADMIN;
  if (isModeratorRoute(pathname)) return ROLE.MODERATOR;
  return null;
}

function canAccessRoute(userRole: Role, requiredRole: Role | null): boolean {
  if (!requiredRole) return true;
  return hasMinimumRole(userRole, requiredRole);
}

function getSafeRedirectUrl(request: NextRequest, defaultRoute: string): string {
  const url = request.nextUrl;
  const callbackUrl = url.searchParams.get("callbackUrl");

  if (callbackUrl) {
    try {
      const parsed = new URL(callbackUrl, url.origin);
      if (parsed.origin === url.origin && !isAuthOnlyRoute(parsed.pathname)) {
        return callbackUrl;
      }
    } catch {
      // fall through to default
    }
  }
  return defaultRoute;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  if (isPublicApiRoute(pathname)) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const session = await auth();
  const isAuthenticated = !!session?.user;
  const isOnboardingCompleted = session?.user?.onboardingCompleted ?? false;
  const userRole = toRole(session?.user?.role ?? "USER");

  if (!isAuthenticated) {
    if (isProtectedRoute(pathname)) {
      const loginUrl = new URL(ROUTES.AUTH.SIGN_IN, request.url);
      const intendedDestination = pathname + request.nextUrl.search;
      loginUrl.searchParams.set("callbackUrl", getSafeRedirectUrl(request, intendedDestination));
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (isAuthOnlyRoute(pathname)) {
    const redirectUrl = getSafeRedirectUrl(request, ROUTES.PROTECTED.DASHBOARD);
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  const isOnboardingRoute = pathname.startsWith(ROUTES.ONBOARDING.ROOT);
  if (isOnboardingRoute) {
    if (isOnboardingCompleted) {
      const redirectUrl = getSafeRedirectUrl(request, ROUTES.PROTECTED.DASHBOARD);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  if (!isOnboardingCompleted && isProtectedRoute(pathname)) {
    const onboardingUrl = new URL(ROUTES.ONBOARDING.ROOT, request.url);
    const intendedDestination = pathname + request.nextUrl.search;
    onboardingUrl.searchParams.set("callbackUrl", getSafeRedirectUrl(request, intendedDestination));
    return NextResponse.redirect(onboardingUrl);
  }

  const requiredRole = getRequiredRoleForRoute(pathname);
  if (requiredRole && !canAccessRoute(userRole, requiredRole)) {
    const dashboardUrl = new URL(ROUTES.PROTECTED.DASHBOARD, request.url);
    dashboardUrl.searchParams.set("unauthorized", "true");
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

export default proxy;