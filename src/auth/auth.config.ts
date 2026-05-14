import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { loginRateLimiter } from "@/lib/rate-limiter";

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
<<<<<<< HEAD
          role: "USER",
          onboardingCompleted: false,
        };
      },
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Rate limiting for login attempts
        const clientIp = req?.headers.get("x-forwarded-for") ?? "unknown";
        const redactedIp = clientIp === "unknown" ? "unknown" : clientIp.replace(/\d+$/, "***");
        const limiterResult = loginRateLimiter.checkAndRegister(clientIp);
        if (limiterResult.isLimited) {
          console.warn(`Rate limit exceeded for IP: ${redactedIp}`);
          return null;
        }

        // Type assertion: credentials are defined (non-null) after guard
        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          // No user found with this email
          if (!user) {
            return null;
          }

          // Check if user has a password set (credentials auth)
          if (!user.password) {
            // User exists but no password - this is likely an OAuth user
            // Prevent credential login to OAuth accounts for security
            return null;
          }

          // Verify password
          const isValid = await verifyPassword(password, user.password);
          if (!isValid) {
            return null;
          }

          // Return user object for successful authentication
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            onboardingCompleted: user.onboardingCompleted,
          };
        } catch (error) {
          console.error("Credentials authorization error:", error);
          return null;
        }
      },
=======
          role: "USER", // Default role
          onboardingCompleted: false, // Default onboarding state
        };
      },
>>>>>>> wholesale-school
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
      const isLoginPage = nextUrl.pathname === "/login";
      const isRegisterPage = nextUrl.pathname === "/register";
      const isAuthPage = isLoginPage || isRegisterPage;

      // Check if this is a protected route
      const protectedRoutes = [
        "/dashboard",
        "/profile",
        "/settings",
        "/challenges",
        "/leaderboard",
        "/analytics",
        "/subscription",
        "/onboarding",
      ];
      const isProtectedRoute = protectedRoutes.some(
        (route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
      );

      // API auth routes always allowed (including our /api/user/me and /api/me)
      if (isApiAuthRoute || nextUrl.pathname.startsWith("/api/me")) {
        return true;
      }

      // Auth pages: if logged in, redirect to dashboard; otherwise allow
      if (isAuthPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // Protected routes: require authentication
      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        // Return false to trigger NextAuth's built-in redirect to signIn page
        return false;
      }

      // All other routes are publicly accessible
      return true;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.onboardingCompleted = user.onboardingCompleted;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
