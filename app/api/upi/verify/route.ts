export const dynamic = "force-dynamic";

import { NextResponse, type NextRequest } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

// Only this admin email can verify payments. Set in Vercel env as ADMIN_EMAIL.
const FALLBACK_ADMIN = "himanshumani72@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminEmail = (process.env.ADMIN_EMAIL ?? FALLBACK_ADMIN).toLowerCase();
    if ((user.email ?? "").toLowerCase() !== adminEmail) {
      return NextResponse.json({ error: "Forbidden — admin only" }, { status: 403 });
    }

    const body   = await req.json().catch(() => ({}));
    const id     = Number(body.payment_id);
    const action = String(body.action ?? "verify");   // verify | reject
    const reason = String(body.reason ?? "").slice(0, 300);

    if (!id) return NextResponse.json({ error: "payment_id required" }, { status: 400 });
    if (!["verify","reject"].includes(action))
      return NextResponse.json({ error: "action must be 'verify' or 'reject'" }, { status: 400 });

    const svc = createServiceClient();

    const { data: pay, error: fetchErr } = await svc.from("upi_payments")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (fetchErr || !pay)
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    if (pay.status !== "pending")
      return NextResponse.json({ error: `Already ${pay.status}` }, { status: 400 });

    const now = new Date().toISOString();

    if (action === "verify") {
      // 1) Mark payment verified
      await svc.from("upi_payments").update({
        status:      "verified",
        verified_at: now,
        verified_by: user.email,
      }).eq("id", id);

      // 2) Activate user's subscription for 30 days
      const periodEnd = new Date(Date.now() + 30 * 86400000).toISOString();
      await svc.from("subscriptions").upsert({
        user_id:            pay.user_id,
        status:             "active",
        current_period_end: periodEnd,
        updated_at:         now,
      }, { onConflict: "user_id" });

      return NextResponse.json({
        ok: true,
        message: `Verified! ${pay.user_email} is active until ${periodEnd.slice(0,10)}.`,
      });
    }

    // reject path
    await svc.from("upi_payments").update({
      status:           "rejected",
      verified_at:      now,
      verified_by:      user.email,
      rejection_reason: reason || "No reason provided",
    }).eq("id", id);

    return NextResponse.json({ ok: true, message: "Rejected." });
  } catch (err: any) {
    console.error("[UPI verify] error:", err);
    return NextResponse.json({ error: err?.message ?? "Verify failed" }, { status: 500 });
  }
}
