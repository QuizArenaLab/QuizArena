import { NextRequest, NextResponse } from "next/server";
import { validateApiRequest } from "@/lib/auth-utils";

/**
 * Protected API Route — /api/user/me
 *
 * Example protected API endpoint that returns
 * the authenticated user's data.
 *
 * This serves as the foundation for all future
 * protected API endpoints.
 */
export async function GET(request: NextRequest) {
  const authResult = await validateApiRequest(request);

  // Handle unauthorized
  if (authResult instanceof Response) {
    return authResult;
  }

  const user = authResult;

  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      onboardingCompleted: user.onboardingCompleted,
      image: user.image,
    },
  });
}
