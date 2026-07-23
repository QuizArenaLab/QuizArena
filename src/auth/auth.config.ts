import type { NextAuthConfig } from "next-auth";
import type { ExamCategory, PreparationLevel } from "@/types/next-auth";
import type { UserRole } from "@/features/rbac/constants/role-types";

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
    error: "/register", // Redirect auth errors (like Google OAuth cancel/config errors) to register instead of the default /api/auth/error page
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
      const isLoginPage = nextUrl.pathname === "/login";
      const isRegisterPage = nextUrl.pathname === "/register";
      const isAuthPage = isLoginPage || isRegisterPage;
      const isOnboardingRoute = nextUrl.pathname.startsWith("/onboarding");
      const isLandingPage = nextUrl.pathname === "/";

      const protectedRoutes = [
        "/dashboard",
        "/profile",
        "/settings",
        "/challenges",
        "/leaderboard",
        "/analytics",
        "/subscription",
      ];
      const isProtectedRoute = protectedRoutes.some(
        (route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
      );

      if (isApiAuthRoute || nextUrl.pathname.startsWith("/api/me")) {
        return true;
      }

      const getDashboardUrl = (role?: string) => {
        if (role === "SUPER_ADMIN") return "/super-admin";
        if (role === "ADMIN") return "/admin";
        return "/dashboard";
      };

      if (isLandingPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL(getDashboardUrl(auth.user?.role), nextUrl));
        }
        return true;
      }

      if (isAuthPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL(getDashboardUrl(auth.user?.role), nextUrl));
        }
        return true;
      }

      if (isOnboardingRoute) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/login", nextUrl));
        }
        const userOnboardingCompleted = auth.user?.onboardingCompleted ?? false;
        if (userOnboardingCompleted) {
          return Response.redirect(new URL(getDashboardUrl(auth.user?.role), nextUrl));
        }
        return true;
      }

      if (isProtectedRoute) {
        if (isLoggedIn) {
          const userOnboardingCompleted = auth.user?.onboardingCompleted ?? false;
          if (!userOnboardingCompleted) {
            return Response.redirect(new URL("/onboarding", nextUrl));
          }
          return true;
        }
        return false;
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.id || token.sub || "") as string;
        session.user.role = token.role as UserRole | undefined;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean | undefined;
        session.user.examCategory = token.examCategory as ExamCategory | null | undefined;
        session.user.preparationLevel = token.preparationLevel as
          | PreparationLevel
          | null
          | undefined;
        session.user.username = token.username as string | null | undefined;
        session.user.emailVerified = (token.emailVerified as Date | null) ?? null;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.onboardingCompleted = user.onboardingCompleted ?? false;
        token.examCategory = user.examCategory;
        token.preparationLevel = user.preparationLevel;
        token.username = user.username;
        token.emailVerified = user.emailVerified;
      }

      // Handle session update
      if (trigger === "update" && session) {
        // The payload from update(data) might be passed directly as session or wrapped in session.user
        const data = session.user || session;
        if (data.onboardingCompleted !== undefined)
          token.onboardingCompleted = data.onboardingCompleted;
        if (data.examCategory !== undefined) token.examCategory = data.examCategory;
        if (data.preparationLevel !== undefined) token.preparationLevel = data.preparationLevel;
        if (data.username !== undefined) token.username = data.username;
        if (data.name !== undefined) token.name = data.name;
        if (data.image !== undefined) token.picture = data.image; // NextAuth JWT uses token.picture
      }

      return token;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
