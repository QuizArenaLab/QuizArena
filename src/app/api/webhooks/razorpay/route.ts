import { NextRequest, NextResponse } from "next/server";
import { webhookService } from "@/features/revenue/services/webhook.service";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const body = await req.json();

    // Process webhook
    await webhookService.handleRazorpayWebhook(body, signature);

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error: any) {
    console.error("Webhook error:", error);
    // Even if validation fails, returning 200 is often recommended so Razorpay stops retrying
    // unless it's a transient error. But for security, a 400 makes sense on invalid signature.
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
