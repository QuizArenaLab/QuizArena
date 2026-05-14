import { NextRequest, NextResponse } from "next/server";
import { validateApiRequest } from "@/lib/auth-utils";

/**
 * Protected API Route — /api/me
 *
 * Lightweight user presence endpoint.
 * Used by client to check auth state without full profile fetch.
 */
export async function GET(request: NextRequest) {
  const authResult = await validateApiRequest(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: authResult.id,
      name: authResult.name,
      email: authResult.email,
    },
  });
}
