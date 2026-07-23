import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AuthConfig } from "@/features/identity/config/AuthConfig";
import { signIn } from "@/auth/auth";

export async function GET(request: Request) {
  console.log("Callback entered");
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? AuthConfig.routes.dashboard;

  if (code) {
    console.log("Received code", code);
    const supabase = await createClient();
    console.log("exchangeCodeForSession starting");
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.log("exchangeCodeForSession error", error);
    }

    if (!error && data?.session?.access_token) {
      console.log("exchangeCodeForSession success");
      console.log("access_token exists");
      console.log('Calling signIn("supabase_broker")');
      try {
        await signIn("supabase_broker", {
          access_token: data.session.access_token,
          redirectTo: next,
        });
        console.log("signIn completed");
      } catch (err: any) {
        if (
          err &&
          typeof err === "object" &&
          "digest" in err &&
          (err.digest as string).startsWith("NEXT_REDIRECT")
        ) {
          console.log("Redirect thrown");
          throw err;
        }
        console.log("Caught error from signIn:", err);
      }
    }
  } else {
    console.log("No code found in searchParams");
  }
  return NextResponse.redirect(`${origin}${AuthConfig.routes.login}?error=AuthCallbackError`);
}
