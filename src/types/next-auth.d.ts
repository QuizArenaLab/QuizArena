import { type DefaultSession } from "next-auth";
import type { UserRole } from "@/features/rbac/constants/role-types";

export type ExamCategory = "SSC" | "BANKING" | "RAILWAYS" | "STATE_PSC";
export type PreparationLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: UserRole;
      onboardingCompleted?: boolean;
      examCategory?: ExamCategory | null;
      preparationLevel?: PreparationLevel | null;
      username?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    onboardingCompleted?: boolean;
    examCategory?: ExamCategory | null;
    preparationLevel?: PreparationLevel | null;
    username?: string | null;
  }

  interface JWT {
    id?: string;
    role?: UserRole;
    onboardingCompleted?: boolean;
    examCategory?: ExamCategory | null;
    preparationLevel?: PreparationLevel | null;
    username?: string | null;
  }
}
