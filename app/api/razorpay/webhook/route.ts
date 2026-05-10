import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body      = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const secret    = process.env.RAZORPAY_WEBHOOK_SECRET!;

  // Verify signature
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const type  = event.event as string;
  const sub   = event.payload?.subscription?.entity;

  if (!sub?.id) return NextResponse.json({ ok: true });

  const supabase = createServiceClient();

  if (type === "subscription.charged") {
    // Subscription paid → activate
    await supabase.from("subscriptions")
      .update({ status: "active", current_period_end: new Date((sub.current_end ?? 0) * 1000).toISOString(), updated_at: new Date().toISOString() })
      .eq("razorpay_subscription_id", sub.id);
  }

  if (type === "subscription.cancelled" || type === "subscription.completed") {
    await supabase.from("subscriptions")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("razorpay_subscription_id", sub.id);
  }

  if (type === "subscription.halted") {
    // Payment failed repeatedly
    await supabase.from("subscriptions")
      .update({ status: "halted", updated_at: new Date().toISOString() })
      .eq("razorpay_subscription_id", sub.id);
  }

  return NextResponse.json({ ok: true });
}
