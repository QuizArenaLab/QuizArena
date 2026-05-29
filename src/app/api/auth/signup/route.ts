import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { signupRateLimiter } from "@/lib/rate-limiter";

/**
 * Validate email format
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * POST /api/auth/signup
 *
 * Secure user registration with:
 * - IP-based rate limiting
 * - Strong password enforcement (min 8 chars)
 * - Atomic check-and-create (no TOCTOU)
 * - Conflict detection (OAuth vs Credentials)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Resolve client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    // 2. Check rate limit (relax in development)
    const isDev = process.env.NODE_ENV === "development";
    const { isLimited } = signupRateLimiter.checkAndRegister(ip);
    if (isLimited && !isDev) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }

    // 3. Parse and validate input
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 4. Secure Password Hashing
    const hashedPassword = await hashPassword(password);

    // 5. Atomic User Creation
    // We attempt to create directly. Prisma's P2002 error will catch duplicates.
    // This prevents race conditions (TOCTOU) between checking and creating.
    try {
      const user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: name || null,
          password: hashedPassword,
          role: "USER",
          onboardingCompleted: false,
        },
      });

      return NextResponse.json(
        {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
        { status: 201 }
      );
    } catch (createError) {
      if (createError instanceof Error && "code" in createError && createError.code === "P2002") {
        // Handle duplicate email
        const existingUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (existingUser?.password) {
          return NextResponse.json(
            { error: "An account with this email already exists" },
            { status: 409 }
          );
        } else {
          return NextResponse.json(
            {
              error: "This email is already registered via Google. Please use Google sign-in",
              code: "OAUTH_ACCOUNT_EXISTS",
            },
            { status: 409 }
          );
        }
      }
      throw createError;
    }
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error during signup" }, { status: 500 });
  }
}
