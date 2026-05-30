import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Razorpay subscription webhook handler.
 * Configure at: Razorpay Dashboard → Settings → Webhooks
 *   URL:    https://<your-domain>/api/razorpay/webhook
 *   Secret: same value as RAZORPAY_WEBHOOK_SECRET env var
 *   Events: subscription.activated, subscription.charged, subscription.cancelled,
 *           subscription.completed, subscription.halted, subscription.paused,
 *           subscription.authenticated
 */
export async function POST(request: NextRequest) {
  const body      = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const secret    = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    console.error("[Razorpay webhook] RAZORPAY_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  // Timing-safe signature comparison (prevents timing attacks)
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  const sigBuf   = Buffer.from(signature, "hex");
  const expBuf   = Buffer.from(expected, "hex");
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    console.warn("[Razorpay webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = String(event.event ?? "");
  const sub  = event.payload?.subscription?.entity;
  if (!sub?.id) {
    // Some events (e.g. payment.captured outside subscription) — just ack
    return NextResponse.json({ ok: true, ignored: "no subscription entity" });
  }

  const supabase = createServiceClient();
  const now      = new Date().toISOString();
  const periodEnd = sub.current_end ? new Date(sub.current_end * 1000).toISOString() : null;

  let update: Record<string, any> | null = null;

  switch (type) {
    case "subscription.activated":
    case "subscription.authenticated":
    case "subscription.charged":
      update = {
        status:             "active",
        current_period_end: periodEnd,
        updated_at:         now,
      };
      break;

    case "subscription.cancelled":
    case "subscription.completed":
    case "subscription.expired":
      update = { status: "cancelled", updated_at: now };
      break;

    case "subscription.halted":
      // Payment failed too many times — Razorpay halted the recurring charge
      update = { status: "halted", updated_at: now };
      break;

    case "subscription.paused":
      update = { status: "paused", updated_at: now };
      break;

    case "subscription.resumed":
      update = { status: "active", current_period_end: periodEnd, updated_at: now };
      break;

    default:
      // Unknown / unhandled event — log but ack so Razorpay doesn't retry forever
      console.log(`[Razorpay webhook] Unhandled event: ${type}`);
      return NextResponse.json({ ok: true, unhandled: type });
  }

  const { error } = await supabase.from("subscriptions")
    .update(update)
    .eq("razorpay_subscription_id", sub.id);

  if (error) {
    console.error("[Razorpay webhook] DB update failed:", error);
    return NextResponse.json({ error: "DB update failed" }, { status: 500 });
  }

  console.log(`[Razorpay webhook] ${type} → status=${update.status} for sub ${sub.id}`);
  return NextResponse.json({ ok: true, applied: update });
}
