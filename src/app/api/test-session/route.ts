import { signIn } from "@/auth/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Attempt a dummy login (using a mock provider or credentials that will definitely fail or return early just to see the cookie behavior).
    // Actually, I can use signIn with a fake provider just to see if it sets a cookie if it throws a redirect.
    // Let's just return a response to see if Auth.js does anything.
    await signIn("credentials", { email: "test@example.com", password: "wrong", redirect: false });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      (err.digest as string).startsWith("NEXT_REDIRECT")
    ) {
      return NextResponse.json({ error: "NEXT_REDIRECT", digest: err.digest });
    }
    return NextResponse.json({ error: err.message });
  }
}
