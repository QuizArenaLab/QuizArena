import { NextRequest, NextResponse } from "next/server";
import { validateApiRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import {
  normalizeUsername,
  validateUsername,
  isValidExamCategory,
  isValidPreparationLevel,
} from "@/lib/onboarding";

export async function PATCH(request: NextRequest) {
  try {
    const sessionUser = await validateApiRequest(request);
    if (sessionUser instanceof Response) return sessionUser;

    const body = await request.json();
    const { username, examCategory, preparationLevel } = body;

    console.log(`[Onboarding] Completing for user ${sessionUser.id}:`, {
      username,
      examCategory,
      preparationLevel,
    });

    const errors: Record<string, string> = {};

    // 1. Validate Username
    if (!username) {
      errors.username = "Username is required";
    } else {
      const normalized = normalizeUsername(username);
      const validation = validateUsername(normalized);
      if (!validation.valid) {
        errors.username = validation.error || "Invalid username";
      } else {
        const existing = await prisma.user.findFirst({
          where: {
            username: normalized,
            NOT: { id: sessionUser.id },
          },
          select: { id: true },
        });
        if (existing) {
          errors.username = "Username already taken";
        }
      }
    }

    // 2. Validate Exam Category
    if (!examCategory || !isValidExamCategory(examCategory)) {
      errors.examCategory = "Valid exam category is required";
    }

    // 3. Validate Preparation Level
    if (!preparationLevel || !isValidPreparationLevel(preparationLevel)) {
      errors.preparationLevel = "Valid preparation level is required";
    }

    if (Object.keys(errors).length > 0) {
      console.warn(`[Onboarding] Validation failed for user ${sessionUser.id}:`, errors);
      return NextResponse.json(
        {
          error: "Validation failed",
          details: errors,
        },
        { status: 400 }
      );
    }

    // 4. Atomic Update by unique email
    const userEmail = sessionUser.email;
    if (!userEmail) {
      return NextResponse.json({ error: "User email not found in session" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: {
        username: normalizeUsername(username),
        examCategory: examCategory,
        preparationLevel: preparationLevel,
        onboardingCompleted: true,
      },
    });

    console.log(`[Onboarding] Success for user ${updatedUser.id} (${userEmail})`);

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        onboardingCompleted: updatedUser.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("Onboarding completion error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to complete onboarding",
      },
      { status: 500 }
    );
  }
}
