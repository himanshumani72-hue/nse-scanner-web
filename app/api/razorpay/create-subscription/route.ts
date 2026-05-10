import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const keyId     = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const planId    = process.env.RAZORPAY_PLAN_ID;

    if (!keyId || !keySecret)
      return NextResponse.json({ error: "Razorpay not configured yet" }, { status: 503 });
    if (!planId)
      return NextResponse.json({ error: "RAZORPAY_PLAN_ID not configured" }, { status: 503 });

    // Dynamic import so Razorpay is never instantiated at build time
    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const sub = await (razorpay.subscriptions as any).create({
      plan_id:     planId,
      total_count: 12,
      quantity:    1,
      notify_info: { notify_email: user.email! },
    });

    await supabase.from("subscriptions").upsert({
      user_id:                  user.id,
      razorpay_subscription_id: sub.id,
      status:                   "trial",
    }, { onConflict: "user_id" });

    return NextResponse.json({ subscription_id: sub.id, email: user.email });
  } catch (err: any) {
    console.error("Razorpay error:", err);
    return NextResponse.json({ error: err?.error?.description ?? err.message ?? "Failed" }, { status: 500 });
  }
}
