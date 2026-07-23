import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth/auth.config";
import { ROUTES } from "@/constants/routes";
import { ROLE, toRole, type Role } from "@/features/rbac/constants/role-types";
import { hasMinimumRole } from "@/features/rbac/constants/role-hierarchy";

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
  "/verify-email",
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
  "/api/moderator",
];

const ADMIN_ROUTES = [
  "/admin",
  "/dashboard/admin",
  "/dashboard/users",
  "/dashboard/moderators",
  "/dashboard/performance",
  "/dashboard/approve",
  "/dashboard/reports",
  "/api/admin",
];

const SUPER_ADMIN_ROUTES = [
  "/super-admin",
  "/dashboard/super-admin",
  "/dashboard/platform",
  "/dashboard/settings",
  "/dashboard/financials",
  "/dashboard/payouts",
  "/dashboard/system",
  "/api/super-admin",
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
  "/api/competitions",
  "/api/questions",
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
  return MODERATOR_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

function isSuperAdminRoute(pathname: string): boolean {
  return SUPER_ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
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
  const isEmailVerified = !!session?.user?.emailVerified;
  const isOnboardingCompleted = session?.user?.onboardingCompleted ?? false;
  const userRole = toRole(session?.user?.role ?? "USER");

  if (!isAuthenticated) {
    if (isProtectedRoute(pathname)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL(ROUTES.AUTH.SIGN_IN, request.url);
      const intendedDestination = pathname + request.nextUrl.search;
      loginUrl.searchParams.set("callbackUrl", getSafeRedirectUrl(request, intendedDestination));
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (isAuthOnlyRoute(pathname)) {
    if (!isEmailVerified) {
      return NextResponse.redirect(new URL("/verify-email", request.url));
    }
    const redirectUrl = getSafeRedirectUrl(request, ROUTES.PROTECTED.DASHBOARD);
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (!isEmailVerified && isProtectedRoute(pathname)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Email verification required" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/verify-email", request.url));
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
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden: Insufficient Permissions" }, { status: 403 });
    }
    const dashboardUrl = new URL(ROUTES.PROTECTED.DASHBOARD, request.url);
    dashboardUrl.searchParams.set("unauthorized", "true");
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export default proxy;
