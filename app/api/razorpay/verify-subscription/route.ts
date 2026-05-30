export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * Called from the client right after Razorpay checkout closes successfully.
 * Verifies the actual subscription status with Razorpay (don't trust client
 * redirect alone) and pre-emptively updates Supabase so the user sees
 * "Active" immediately, even before the webhook fires.
 *
 * The webhook is still the source of truth, but this provides instant feedback.
 */
export async function POST() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const svc = createServiceClient();
    const { data: row } = await svc.from("subscriptions")
      .select("razorpay_subscription_id, status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!row?.razorpay_subscription_id)
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });

    const keyId     = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret)
      return NextResponse.json({ error: "Razorpay not configured" }, { status: 503 });

    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const sub: any = await (razorpay.subscriptions as any).fetch(row.razorpay_subscription_id);

    // Map Razorpay status → our internal status
    // active / authenticated = paid and running
    // halted / cancelled / completed / expired = done
    let newStatus = row.status;
    if (sub.status === "active" || sub.status === "authenticated") {
      newStatus = "active";
    } else if (["cancelled", "completed", "expired"].includes(sub.status)) {
      newStatus = "cancelled";
    } else if (sub.status === "halted") {
      newStatus = "halted";
    }

    if (newStatus !== row.status) {
      await svc.from("subscriptions").update({
        status:             newStatus,
        current_period_end: sub.current_end ? new Date(sub.current_end * 1000).toISOString() : null,
        updated_at:         new Date().toISOString(),
      }).eq("razorpay_subscription_id", row.razorpay_subscription_id);
    }

    return NextResponse.json({
      status:           newStatus,
      razorpay_status:  sub.status,
      paid_count:       sub.paid_count ?? 0,
      current_end:      sub.current_end,
    });
  } catch (err: any) {
    console.error("Razorpay verify-subscription error:", err);
    return NextResponse.json({
      error: err?.error?.description ?? err?.message ?? "Verification failed",
    }, { status: 500 });
  }
}
