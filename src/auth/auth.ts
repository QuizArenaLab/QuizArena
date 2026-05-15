import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { verifyPassword } from "@/lib/password";
import { loginRateLimiter } from "@/lib/rate-limiter";
import type { ExamCategory, PreparationLevel } from "@/types/next-auth";
import type { User as PrismaUser } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: {
    ...PrismaAdapter(prisma),
    async getUser(id) {
      try {
        return await PrismaAdapter(prisma).getUser!(id);
      } catch (error) {
        console.error("Database connectivity error in Auth.js:", error);
        throw new Error("Database offline. Please check your connection.");
      }
    },
    // We could wrap more methods if needed, but the primary failure point is usually during user lookup
  },
  providers: [
    ...authConfig.providers,
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
        const clientIp = req?.headers?.get("x-forwarded-for") ?? "unknown";
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

          const typedUser = user as PrismaUser;
          return {
            id: typedUser.id,
            email: typedUser.email,
            name: typedUser.name,
            image: typedUser.image,
            role: typedUser.role,
            onboardingCompleted: typedUser.onboardingCompleted,
            examCategory: typedUser.examCategory as ExamCategory | null,
            preparationLevel: typedUser.preparationLevel as PreparationLevel | null,
            username: typedUser.username,
          };
        } catch (error) {
          console.error("Credentials authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    ...authConfig.callbacks,
  },
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
});
