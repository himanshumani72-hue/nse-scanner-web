import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Razorpay webhook handler — covers both one-time orders AND subscriptions.
 *
 * Configure at: Razorpay Dashboard → Settings → Webhooks
 *   URL:    https://<your-domain>/api/razorpay/webhook
 *   Secret: must equal RAZORPAY_WEBHOOK_SECRET env var
 *   Events to subscribe:
 *     • payment.captured           ← primary: activates 30-day subscription
 *     • payment.failed             ← logging
 *     • subscription.activated     ← legacy support
 *     • subscription.charged       ← legacy support
 *     • subscription.cancelled     ← legacy support
 */
export async function POST(request: NextRequest) {
  const body      = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const secret    = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    console.error("[Razorpay webhook] RAZORPAY_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  // Timing-safe signature comparison
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  const sigBuf = Buffer.from(signature, "hex");
  const expBuf = Buffer.from(expected, "hex");
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    console.warn("[Razorpay webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: any;
  try { event = JSON.parse(body); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const type     = String(event.event ?? "");
  const supabase = createServiceClient();
  const now      = new Date().toISOString();

  // ── One-time payment (Order) flow ─────────────────────────────────
  if (type === "payment.captured") {
    const payment = event.payload?.payment?.entity;
    if (!payment?.order_id) {
      return NextResponse.json({ ok: true, ignored: "no order_id" });
    }

    // Look up which user owns this order
    const { data: order } = await supabase.from("razorpay_orders")
      .select("user_id, user_email")
      .eq("order_id", payment.order_id)
      .maybeSingle();

    if (!order?.user_id) {
      // Fall back to notes on the payment
      const userId = payment.notes?.user_id;
      if (!userId) {
        console.warn(`[webhook] payment.captured: no user mapping for order ${payment.order_id}`);
        return NextResponse.json({ ok: true, warning: "user not found" });
      }
    }

    const userId = order?.user_id ?? payment.notes?.user_id;
    const periodEnd = new Date(Date.now() + 30 * 86400000).toISOString();

    // Activate subscription for 30 days
    await supabase.from("subscriptions").upsert({
      user_id:            userId,
      status:             "active",
      current_period_end: periodEnd,
      razorpay_payment_id: payment.id,
      updated_at:         now,
    }, { onConflict: "user_id" });

    // Mark order paid
    await supabase.from("razorpay_orders").update({
      status:     "paid",
      payment_id: payment.id,
      paid_at:    now,
    }).eq("order_id", payment.order_id);

    console.log(`[webhook] ✓ payment.captured for ${order?.user_email ?? userId} — active until ${periodEnd}`);
    return NextResponse.json({ ok: true, activated: userId, until: periodEnd });
  }

  if (type === "payment.failed") {
    const payment = event.payload?.payment?.entity;
    if (payment?.order_id) {
      await supabase.from("razorpay_orders").update({
        status:     "failed",
        failed_at:  now,
        error_code: payment.error_code ?? null,
        error_desc: payment.error_description ?? null,
      }).eq("order_id", payment.order_id);
    }
    console.log(`[webhook] payment.failed: ${payment?.error_description ?? "unknown"}`);
    return NextResponse.json({ ok: true });
  }

  // ── Legacy: subscription events (keep working for any existing subs) ──
  const sub = event.payload?.subscription?.entity;
  if (sub?.id) {
    const periodEnd = sub.current_end ? new Date(sub.current_end * 1000).toISOString() : null;
    let update: any = null;
    switch (type) {
      case "subscription.activated":
      case "subscription.authenticated":
      case "subscription.charged":
      case "subscription.resumed":
        update = { status: "active", current_period_end: periodEnd, updated_at: now };
        break;
      case "subscription.cancelled":
      case "subscription.completed":
      case "subscription.expired":
        update = { status: "cancelled", updated_at: now };
        break;
      case "subscription.halted":
        update = { status: "halted", updated_at: now };
        break;
      case "subscription.paused":
        update = { status: "paused", updated_at: now };
        break;
    }
    if (update) {
      await supabase.from("subscriptions")
        .update(update)
        .eq("razorpay_subscription_id", sub.id);
      return NextResponse.json({ ok: true, applied: update });
    }
  }

  console.log(`[webhook] Unhandled event: ${type}`);
  return NextResponse.json({ ok: true, unhandled: type });
}
