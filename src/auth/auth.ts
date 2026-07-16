import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { verifyPassword } from "@/lib/password";
import { loginRateLimiter } from "@/lib/rate-limiter";
import type { ExamCategory, PreparationLevel } from "@/types/next-auth";
import type { User as PrismaUser } from "@/generated/prisma";

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
    maxAge: 100 * 365 * 24 * 60 * 60,
  },
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      // Manually handle account linking to bypass OAuthAccountNotLinked
      // when the existing user was created via Credentials and has emailVerified: null
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            const existingAccount = await prisma.account.findUnique({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
            });

            if (!existingAccount) {
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token as string | undefined,
                  refresh_token: account.refresh_token as string | undefined,
                  expires_at: account.expires_at as number | undefined,
                  token_type: account.token_type as string | undefined,
                  scope: account.scope as string | undefined,
                  id_token: account.id_token as string | undefined,
                },
              });

              if (!existingUser.emailVerified) {
                await prisma.user.update({
                  where: { id: existingUser.id },
                  data: { emailVerified: new Date() },
                });
              }
            }
          }
        } catch (error) {
          console.error("Error during manual account linking:", error);
        }
      }

      return true;
    },
  },
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
});
