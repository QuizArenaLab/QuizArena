import { NextRequest, NextResponse } from "next/server";
import { validateApiRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { isValidExamCategory, isValidPreparationLevel } from "@/lib/onboarding";
import type { User } from "@/generated/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const user = await validateApiRequest(request);
    if (user instanceof Response) return user;

    const typedUser = user as User;
    const { category, preparationLevel } = await request.json();

    const errors: Record<string, string> = {};

    if (category && !isValidExamCategory(category)) {
      errors.category = "Invalid exam category";
    }

    if (preparationLevel && !isValidPreparationLevel(preparationLevel)) {
      errors.preparationLevel = "Invalid preparation level";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const userEmail = typedUser.email;
    if (!userEmail) {
      return NextResponse.json({ error: "User email not found in session" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: {
        examCategory: category || typedUser.examCategory,
        preparationLevel: preparationLevel || typedUser.preparationLevel,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        category: updatedUser.examCategory,
        preparationLevel: updatedUser.preparationLevel,
      },
    });
  } catch (error) {
    console.error("Onboarding preferences update error:", error);
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}
