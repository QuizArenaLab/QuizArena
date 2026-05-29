import type { NextAuthConfig } from "next-auth";
import type { ExamCategory, PreparationLevel } from "@/types/next-auth";
import type { UserRole } from "@/auth/roles/role-types";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "USER",
          onboardingCompleted: false,
          examCategory: null,
          preparationLevel: null,
          username: null,
        };
      },
    }),
  ],
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

      if (isAuthPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      if (isOnboardingRoute) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/login", nextUrl));
        }
        const userOnboardingCompleted = auth.user?.onboardingCompleted ?? false;
        if (userOnboardingCompleted) {
          return Response.redirect(new URL("/dashboard", nextUrl));
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
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.onboardingCompleted = user.onboardingCompleted;
        token.examCategory = user.examCategory;
        token.preparationLevel = user.preparationLevel;
        token.username = user.username;
      }

      // Handle session update
      if (trigger === "update" && session?.user) {
        token.onboardingCompleted = session.user.onboardingCompleted ?? token.onboardingCompleted;
        token.examCategory = session.user.examCategory ?? token.examCategory;
        token.preparationLevel = session.user.preparationLevel ?? token.preparationLevel;
        token.username = session.user.username ?? token.username;
      }

      return token;
    },
  },
} satisfies NextAuthConfig;
