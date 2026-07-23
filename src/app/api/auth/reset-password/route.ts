import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validatePasswordResetToken, consumePasswordResetToken } from "@/lib/auth/tokens";
import bcrypt from "bcryptjs";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password cannot exceed 64 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = resetPasswordSchema.parse(body);

    // Validate the token using the shared service
    const validation = await validatePasswordResetToken(token);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: validation.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password, consume token, and delete their sessions to force a re-login
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      // Mark token as used
      prisma.passwordResetToken.update({
        where: { id: validation.tokenId },
        data: { used: true },
      }),
      // Invalidate all existing sessions
      prisma.session.deleteMany({
        where: { userId: user.id },
      }),
    ]);

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
