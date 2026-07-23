import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/emails/mailer";
import { createPasswordResetToken } from "@/lib/auth/tokens";
import { EnvironmentService } from "@/platform/env/EnvironmentService";
import crypto from "crypto";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // We ALWAYS return a success response to prevent email enumeration
    const successResponse = NextResponse.json(
      { message: "If an account exists, we've sent recovery instructions." },
      { status: 200 }
    );

    if (!user || !user.email) {
      return successResponse;
    }

    const token = await createPasswordResetToken(user.email);

    // Send email
    const appUrl = EnvironmentService.getOrigin();
    const resetLink = `${appUrl}/reset-password?token=${token}`;

    // In development, log the link to the console so you can test without SMTP working
    if (EnvironmentService.isDevelopment()) {
      console.log("----------------------------------------");
      console.log("PASSWORD RESET LINK (Dev Mode):");
      console.log(resetLink);
      console.log("----------------------------------------");
    }

    const emailResult = await sendPasswordResetEmail(user.email, resetLink);

    if (!emailResult.success) {
      console.warn("Email failed to send. If you are in development, use the link printed above.");
    }

    return successResponse;
  } catch (error) {
    console.error("[FORGOT_PASSWORD_ERROR]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
