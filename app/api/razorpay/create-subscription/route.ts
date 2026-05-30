export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized — please log in" }, { status: 401 });

    const keyId     = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const planId    = process.env.RAZORPAY_PLAN_ID;

    // Specific error per missing var so it's clear what's wrong
    const missing: string[] = [];
    if (!keyId)     missing.push("RAZORPAY_KEY_ID");
    if (!keySecret) missing.push("RAZORPAY_KEY_SECRET");
    if (!planId)    missing.push("RAZORPAY_PLAN_ID");
    if (missing.length) {
      return NextResponse.json({
        error: `Razorpay not configured: ${missing.join(", ")} missing in Vercel env vars`,
        hint:  "Set in Vercel → Project Settings → Environment Variables, then redeploy.",
      }, { status: 503 });
    }

    // ── Idempotency: if user already has an active OR pending subscription, return that ──
    const svc = createServiceClient();
    const { data: existing } = await svc.from("subscriptions")
      .select("razorpay_subscription_id, status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing?.razorpay_subscription_id && existing.status === "active") {
      return NextResponse.json({
        error: "You already have an active subscription",
        already_active: true,
      }, { status: 400 });
    }

    // If a pending/created subscription already exists, reuse it instead of
    // creating a duplicate (Razorpay charges nothing yet, just opens checkout)
    if (existing?.razorpay_subscription_id && existing.status === "trial") {
      try {
        const Razorpay = (await import("razorpay")).default;
        const razorpay = new Razorpay({ key_id: keyId!, key_secret: keySecret! });
        const existingSub: any = await (razorpay.subscriptions as any).fetch(existing.razorpay_subscription_id);
        // Only reuse if still in a checkout-able state
        if (existingSub.status && ["created", "authenticated", "pending"].includes(existingSub.status)) {
          return NextResponse.json({
            subscription_id: existingSub.id,
            email: user.email,
            reused: true,
          });
        }
      } catch {
        // If fetch fails (deleted on Razorpay side), fall through and create new
      }
    }

    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({ key_id: keyId!, key_secret: keySecret! });

    const sub: any = await (razorpay.subscriptions as any).create({
      plan_id:         planId!,
      total_count:     12,           // 12 months
      quantity:        1,
      customer_notify: 1,            // let Razorpay email/SMS the customer
      notify_info: {
        notify_email: user.email,
      },
      notes: {
        user_id:    user.id,
        user_email: user.email ?? "",
      },
    });

    // Store the sub_id BEFORE first charge so the webhook can find this user later
    await svc.from("subscriptions").upsert({
      user_id:                  user.id,
      razorpay_subscription_id: sub.id,
      status:                   existing?.status ?? "trial",   // don't downgrade an active sub
      updated_at:               new Date().toISOString(),
    }, { onConflict: "user_id" });

    return NextResponse.json({
      subscription_id: sub.id,
      email:           user.email,
    });
  } catch (err: any) {
    console.error("Razorpay create-subscription error:", JSON.stringify(err, null, 2));
    const code = err?.error?.code ?? err?.code ?? null;
    const desc = err?.error?.description ?? err?.message ?? "Failed to create subscription";

    let hint = "";
    if (String(desc).match(/Authentication/i))  hint = "Wrong RAZORPAY_KEY_ID / KEY_SECRET. Live keys start with rzp_live_, test with rzp_test_.";
    else if (String(desc).match(/plan/i))       hint = "RAZORPAY_PLAN_ID is wrong or from a different mode (test vs live).";
    else if (String(desc).match(/live mode/i))  hint = "Live mode not activated yet in Razorpay dashboard. Use test keys for now.";

    return NextResponse.json({
      error:       desc,
      error_code:  code,
      error_field: err?.error?.field ?? null,
      hint:        hint || undefined,
    }, { status: 500 });
  }
}
