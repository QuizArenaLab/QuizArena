import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AuthConfig } from "@/features/identity/config/AuthConfig";
import { signIn } from "@/auth/auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? AuthConfig.routes.dashboard;

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.session?.access_token) {
      // Server-side handoff to NextAuth
      await signIn("supabase_broker", {
        access_token: data.session.access_token,
        redirectTo: next,
      });
      // signIn throws a redirect, so execution won't reach here normally
    }
  }
  return NextResponse.redirect(`${origin}${AuthConfig.routes.login}?error=AuthCallbackError`);
}
