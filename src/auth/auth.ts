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
            emailVerified: typedUser.emailVerified,
          };
        } catch (error) {
          console.error("Credentials authorization error:", error);
          return null;
        }
      },
    }),
    Credentials({
      id: "supabase_broker",
      name: "Supabase Broker",
      credentials: {
        access_token: { label: "Access Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.access_token) return null;
        const access_token = credentials.access_token as string;

        try {
          const { createClient } = await import("@/lib/supabase/server");
          const supabase = await createClient();

          const {
            data: { user },
            error,
          } = await supabase.auth.getUser(access_token);

          if (error || !user || !user.email) {
            console.error("Supabase token verification failed:", error);
            return null;
          }

          const email = user.email.toLowerCase().trim();

          let dbUser = await prisma.user.findUnique({
            where: { email },
          });

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email,
                name: user.user_metadata?.full_name || user.user_metadata?.name || null,
                image: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
                emailVerified: new Date(),
                role: "USER",
                accountState: "ACTIVE",
                onboardingCompleted: false,
              },
            });
          } else {
            const updateData: any = {};
            if (!dbUser.name && (user.user_metadata?.full_name || user.user_metadata?.name)) {
              updateData.name = user.user_metadata?.full_name || user.user_metadata?.name;
            }
            if (!dbUser.image && (user.user_metadata?.avatar_url || user.user_metadata?.picture)) {
              updateData.image = user.user_metadata?.avatar_url || user.user_metadata?.picture;
            }
            if (!dbUser.emailVerified) {
              updateData.emailVerified = new Date();
            }

            if (Object.keys(updateData).length > 0) {
              dbUser = await prisma.user.update({
                where: { id: dbUser.id },
                data: updateData,
              });
            }
          }

          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: user.id,
              },
            },
          });

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: "oauth",
                provider: "google",
                providerAccountId: user.id,
              },
            });
          }

          const typedUser = dbUser as PrismaUser;
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
            emailVerified: typedUser.emailVerified,
          };
        } catch (dbError) {
          console.error("Database error in supabase_broker:", dbError);
          return null;
        }
      },
    }),
  ],
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
  debug: process.env.NODE_ENV === "development",
});
