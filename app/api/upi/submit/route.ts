export const dynamic = "force-dynamic";

import { NextResponse, type NextRequest } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const AMOUNT_INR = 99;

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized — please log in" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const utr   = String(body.utr ?? "").trim().replace(/\s+/g, "");
    const app   = String(body.upi_app ?? "Other").slice(0, 20);
    const notes = String(body.notes ?? "").slice(0, 500);

    // UTR validation — typically 12 digits, but tolerate 10-22 alphanumeric
    if (!/^[A-Za-z0-9]{10,22}$/.test(utr)) {
      return NextResponse.json({
        error: "Invalid UTR. It should be 10-22 letters/digits — check your UPI app for the transaction reference.",
      }, { status: 400 });
    }

    const svc = createServiceClient();

    // Check for duplicate UTR — prevents accidental double-submission AND
    // someone reusing another user's UTR
    const { data: dup } = await svc.from("upi_payments")
      .select("id, user_id, status")
      .eq("utr", utr)
      .maybeSingle();

    if (dup) {
      if (dup.user_id === user.id) {
        return NextResponse.json({
          error: "This UTR is already submitted. We'll verify it within 24 hours.",
          duplicate: true,
        }, { status: 409 });
      }
      return NextResponse.json({
        error: "This UTR is already linked to another account. If this is a mistake, contact support.",
      }, { status: 409 });
    }

    const { data: inserted, error: insErr } = await svc.from("upi_payments").insert({
      user_id:    user.id,
      user_email: user.email,
      amount:     AMOUNT_INR,
      utr:        utr.toUpperCase(),
      upi_app:    app,
      notes:      notes || null,
      status:     "pending",
    }).select().single();

    if (insErr) {
      console.error("[UPI submit] DB insert error:", insErr);
      return NextResponse.json({ error: "Failed to save payment record" }, { status: 500 });
    }

    // Also create a placeholder subscription row in 'trial' so user has a row
    // that admin can flip to 'active' on verification
    await svc.from("subscriptions").upsert({
      user_id:    user.id,
      status:     "trial",        // becomes "active" only after admin verifies UTR
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    // OPTIONAL: send Telegram/email alert to admin here
    // await fetch(process.env.ADMIN_TELEGRAM_WEBHOOK ?? "", { ... })

    return NextResponse.json({
      ok: true,
      payment_id: inserted.id,
      message:    "Payment submitted! We'll verify it within 24 hours. Refresh the dashboard to see when it's active.",
    });
  } catch (err: any) {
    console.error("[UPI submit] error:", err);
    return NextResponse.json({ error: err?.message ?? "Submission failed" }, { status: 500 });
  }
}
