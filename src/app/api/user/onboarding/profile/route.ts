import { NextRequest, NextResponse } from "next/server";
import { validateApiRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { normalizeUsername, validateUsername } from "@/lib/onboarding";
import type { User } from "@/generated/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const user = await validateApiRequest(request);
    if (user instanceof Response) return user;

    const typedUser = user as User;
    const { name, username } = await request.json();

    if (username) {
      const normalized = normalizeUsername(username);
      const validation = validateUsername(normalized);

      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      const existingUser = await prisma.user.findFirst({
        where: { username: normalized, NOT: { id: typedUser.id } },
      });
      if (existingUser) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
      }
    }

    const userEmail = typedUser.email;
    if (!userEmail) {
      return NextResponse.json({ error: "User email not found in session" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: {
        name: name ?? typedUser.name,
        username: username ? normalizeUsername(username) : typedUser.username,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
      },
    });
  } catch (error) {
    console.error("Onboarding profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
