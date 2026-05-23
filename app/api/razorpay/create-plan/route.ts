export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

/**
 * One-time endpoint to create the ₹99/month subscription plan.
 * After running this, copy the returned plan_id into RAZORPAY_PLAN_ID env var.
 *
 * Usage:
 *   curl -X POST https://nse-scanner-web.vercel.app/api/razorpay/create-plan
 *   OR open in browser (POST via tool like Postman)
 */
export async function POST() {
  try {
    const keyId     = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({
        error: "RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not configured in Vercel env vars"
      }, { status: 503 });
    }

    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const plan = await (razorpay.plans as any).create({
      period:   "monthly",
      interval: 1,
      item: {
        name:        "NSE Scanner Pro",
        amount:      9900,  // ₹99 in paise
        currency:    "INR",
        description: "Monthly subscription — NSE stock scanner with EOD signals, momentum, turnaround alerts",
      },
      notes: {
        product: "nse-scanner-pro",
      },
    });

    return NextResponse.json({
      success: true,
      plan_id: plan.id,
      message: `✅ Plan created! Copy this plan_id and set RAZORPAY_PLAN_ID=${plan.id} in Vercel env vars.`,
      plan,
    });
  } catch (err: any) {
    console.error("Razorpay create-plan error:", err);
    return NextResponse.json({
      error: err?.error?.description ?? err.message ?? "Failed to create plan"
    }, { status: 500 });
  }
}
