import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AuthConfig } from "@/features/identity/config/AuthConfig";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? AuthConfig.routes.dashboard;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}${AuthConfig.routes.login}?error=AuthCallbackError`);
}
