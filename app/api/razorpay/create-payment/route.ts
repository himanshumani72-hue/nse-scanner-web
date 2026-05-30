export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const AMOUNT_INR  = 99;
const AMOUNT_PAISE = AMOUNT_INR * 100;
const DAYS        = 30;

/**
 * Creates a Razorpay Order for a one-time ₹99 payment.
 * No subscription, no plan_id, no mandate complexity.
 * Webhook handles auto-activation on `payment.captured`.
 */
export async function POST() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized — please log in" }, { status: 401 });

    const keyId     = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({
        error: "Razorpay not configured: RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET missing in Vercel env vars",
      }, { status: 503 });
    }

    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    // Short receipt ID — Razorpay caps at 40 chars
    const receipt = `nse_${user.id.slice(0, 8)}_${Date.now().toString(36)}`.slice(0, 40);

    const order: any = await (razorpay.orders as any).create({
      amount:   AMOUNT_PAISE,
      currency: "INR",
      receipt,
      notes: {
        user_id:    user.id,
        user_email: user.email ?? "",
        plan:       "monthly-30days",
      },
    });

    // Store the order so the webhook can map it back to this user
    const svc = createServiceClient();
    await svc.from("razorpay_orders").upsert({
      order_id:   order.id,
      user_id:    user.id,
      user_email: user.email,
      amount:     AMOUNT_INR,
      status:     "created",
      created_at: new Date().toISOString(),
    }, { onConflict: "order_id" });

    return NextResponse.json({
      order_id: order.id,
      amount:   AMOUNT_PAISE,
      currency: "INR",
      email:    user.email,
      name:     user.user_metadata?.full_name ?? "",
    });
  } catch (err: any) {
    console.error("Razorpay create-payment error:", JSON.stringify(err, null, 2));
    const desc = err?.error?.description ?? err?.message ?? "Failed to create payment";
    let hint = "";
    if (/Authentication/i.test(String(desc)))      hint = "Wrong KEY_ID/KEY_SECRET. Live keys start rzp_live_, test rzp_test_.";
    else if (/live mode/i.test(String(desc)))      hint = "Live mode not activated yet. Use test keys until activation completes.";

    return NextResponse.json({
      error:      desc,
      error_code: err?.error?.code ?? null,
      hint:       hint || undefined,
    }, { status: 500 });
  }
}
