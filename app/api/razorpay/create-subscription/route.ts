import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const planId = process.env.RAZORPAY_PLAN_ID!;
    if (!planId) return NextResponse.json({ error: "RAZORPAY_PLAN_ID not configured" }, { status: 500 });

    // Create subscription — starts immediately (trial already done at signup)
    const sub = await razorpay.subscriptions.create({
      plan_id:     planId,
      total_count: 12,
      quantity:    1,
      notify_info: { notify_email: user.email! },
    } as any);

    // Save pending subscription to DB
    await supabase.from("subscriptions").upsert({
      user_id:                  user.id,
      razorpay_subscription_id: sub.id,
      status:                   "trial",   // webhook will flip to "active" on first charge
    }, { onConflict: "user_id" });

    return NextResponse.json({ subscription_id: sub.id, email: user.email });
  } catch (err: any) {
    console.error("Razorpay subscription error:", err);
    return NextResponse.json({ error: err?.error?.description ?? err.message ?? "Failed" }, { status: 500 });
  }
}
