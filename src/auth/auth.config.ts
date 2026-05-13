import type { NextAuthConfig } from "next-auth";
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
          response_type: "code"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "USER", // Default role
          onboardingCompleted: false, // Default onboarding state
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    // error: "/login",
    // verifyRequest: "/login",
    // newUser: "/onboarding"
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
      const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

      const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard");

      if (isApiAuthRoute) {
        return true;
      }

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirects to signIn page
      }

      // Default to true for now, can be restricted later based on middleware matcher
      return true;
    },
    async session({ session, token, user }) {
      if (session.user) {
        // If using database strategy, 'user' is available. If using JWT, 'token' is available.
        // We will use database strategy for auth.js with Prisma.
        if (user) {
          session.user.id = user.id;
          session.user.role = user.role;
          session.user.onboardingCompleted = user.onboardingCompleted;
        } else if (token) {
          session.user.id = token.sub as string;
        }
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      // For future JWT-based strategy or token enhancements
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
