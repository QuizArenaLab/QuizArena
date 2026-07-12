import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";
import { AuthConfig } from "./features/identity/config/AuthConfig";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isProtected = AuthConfig.protectedGroups.some((g) => path.startsWith(g));
  const isPublic = AuthConfig.publicGroups.some((g) => path.startsWith(g));

  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = AuthConfig.routes.login;
    return NextResponse.redirect(redirectUrl);
  }

  if (isPublic && user && path !== AuthConfig.routes.callback && path !== "/") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = AuthConfig.routes.dashboard;
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
