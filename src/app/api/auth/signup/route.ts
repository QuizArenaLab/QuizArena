import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { signupRateLimiter } from "@/lib/rate-limiter";

/**
 * Type guard to check if error is a Prisma known request error
 */
function isPrismaKnownRequestError(error: unknown): error is Error & { code?: string } {
  return error instanceof Error && (error as any).code !== undefined;
}

/**
 * Validation errors
 */
class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Authentication error
 */
class AuthError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Validate email format
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // No need to reveal specific requirements for security
  // Just enforce minimum length

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Normalize email (lowercase, trim)
 */
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const clientIp = request.headers.get("x-forwarded-for") ?? "unknown";
    const limiterResult = signupRateLimiter.check(clientIp);
    if (limiterResult.isLimited) {
      return NextResponse.json(
        {
          error: "Too many signup attempts. Please try again later.",
          code: "RATE_LIMIT_EXCEEDED",
          resetAt: limiterResult.resetAt,
        },
        { status: 429 }
      );
    }

    // Register this attempt
    signupRateLimiter.register(clientIp);

    const body = await request.json();
    const { email, password, name } = body;

    // Input validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);

    // Email format validation
    if (!validateEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: "Password does not meet security requirements" },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      // User exists with this email
      if (existingUser.password) {
        // Account already has password (registered via credentials)
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      } else {
        // OAuth user exists without password
        // Prevent credential signup for OAuth accounts (security)
        return NextResponse.json(
          {
            error:
              "This email is already registered via Google. Please use Google sign-in or link your account",
            code: "OAUTH_ACCOUNT_EXISTS",
          },
          { status: 409 }
        );
      }
    }

    // Create new user with credentials
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name || null,
        password: hashedPassword,
        // Default values from schema
        role: "USER",
        onboardingCompleted: false,
      },
    });

    // Return success (no sensitive data)
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
  } catch (error) {
    console.error("Signup error:", error);

    // Database error (unique constraint, etc.)
    if (isPrismaKnownRequestError(error)) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json({ error: "Internal server error during signup" }, { status: 500 });
  }
}
