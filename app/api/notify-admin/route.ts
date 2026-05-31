export const dynamic = "force-dynamic";

import { NextResponse, type NextRequest } from "next/server";

/**
 * Admin-notification webhook. Called fire-and-forget from /register when a
 * user signs up, and any other server flow that wants to ping the admin.
 *
 * Uses Resend (https://resend.com) — free 100 emails/day, no credit card needed.
 *
 * Required env vars on Vercel:
 *   RESEND_API_KEY       — get from https://resend.com/api-keys
 *   ADMIN_NOTIFY_EMAIL   — where to send notifications (e.g. himanshumani72@gmail.com)
 *   RESEND_FROM_EMAIL    — verified sender on Resend (default: onboarding@resend.dev)
 *
 * Falls back to a no-op (returns 200 ok) if env vars are missing — so signup
 * never breaks just because the email service isn't configured yet.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const event     = String(body.event ?? "event");
    const fullName  = String(body.full_name ?? body.name ?? "").trim();
    const email     = String(body.email ?? "").trim();
    const mobile    = String(body.mobile ?? "").trim();
    const extra     = body.note ? String(body.note).slice(0, 500) : "";

    const RESEND_KEY = process.env.RESEND_API_KEY;
    const TO         = process.env.ADMIN_NOTIFY_EMAIL || "himanshumani72@gmail.com";
    const FROM       = process.env.RESEND_FROM_EMAIL || "NSE Scanner Pro <onboarding@resend.dev>";

    if (!RESEND_KEY) {
      console.warn("[notify-admin] RESEND_API_KEY missing — skipping email. Event:", event, email);
      return NextResponse.json({ ok: true, skipped: "no-resend-key" });
    }

    // Build subject + HTML body based on event type
    let subject = "";
    let html    = "";

    if (event === "signup") {
      subject = `🎉 New signup · ${fullName || email}`;
      html = `
        <!doctype html>
        <html><body style="font-family: -apple-system, system-ui, sans-serif; background: #f7f9fc; padding: 24px; margin: 0;">
          <table cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,.06);">
            <tr><td style="background: linear-gradient(135deg, #2bd07a 0%, #5b8cff 100%); padding: 22px 28px; color: #fff;">
              <div style="font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.85;">NSE Scanner Pro</div>
              <div style="font-size: 22px; font-weight: 700; margin-top: 4px;">🎉 New user signed up</div>
            </td></tr>
            <tr><td style="padding: 26px 28px;">
              <p style="margin: 0 0 14px; color: #475569; font-size: 14px;">
                Someone just created a free-trial account. Email verification pending.
              </p>
              <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin: 10px 0 20px;">
                ${rowHtml("Name",   fullName || "(not provided)")}
                ${rowHtml("Email",  email   || "(not provided)")}
                ${rowHtml("Mobile", mobile  ? "+91 " + mobile : "(not provided)")}
                ${rowHtml("Signed up", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST")}
              </table>
              <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.55;">
                The user can't access the dashboard until they click the verification link in the
                Supabase email. Once verified, a 30-day trial subscription is auto-created.
              </p>
              <a href="https://supabase.com/dashboard"
                 style="display: inline-block; margin-top: 18px; padding: 10px 18px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 600;">
                Open Supabase → Users
              </a>
            </td></tr>
            <tr><td style="background: #f7f9fc; padding: 14px 28px; color: #94a3b8; font-size: 11px; text-align: center;">
              You're receiving this because you're the admin of NSE Scanner Pro.
            </td></tr>
          </table>
        </body></html>
      `;
    } else {
      // Generic event passthrough
      subject = `[NSE Scanner Pro] ${event}`;
      html = `<pre style="font: 13px monospace; padding: 16px;">${escapeHtml(JSON.stringify(body, null, 2))}</pre>`;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_KEY}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to:   [TO],
        subject,
        html,
        ...(extra ? { text: extra } : {}),
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[notify-admin] Resend error", res.status, errText.slice(0, 200));
      return NextResponse.json({ ok: false, error: `Resend ${res.status}` }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[notify-admin] error:", err);
    return NextResponse.json({ ok: false, error: err?.message ?? "unknown" }, { status: 500 });
  }
}

function rowHtml(label: string, value: string): string {
  return `
    <tr>
      <td style="padding: 8px 0; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; width: 100px;">${escapeHtml(label)}</td>
      <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${escapeHtml(value)}</td>
    </tr>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" } as any)[c]);
}
