import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Email-verification landing route. The link in the Supabase verification
 * email points here with a one-time `code`. We:
 *   1. Exchange the code for a session (logs the user in)
 *   2. Copy name + mobile from user_metadata into the profiles table
 *   3. Create the 30-day trial subscription
 *   4. Redirect to /dashboard
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get("code");
  const next  = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Use service-role client so we can insert into profiles bypassing RLS
      const svc = createServiceClient();

      // Pull name/mobile from user_metadata (set during /register signup)
      const fullName = String((data.user.user_metadata as any)?.full_name ?? "").trim();
      const mobile   = String((data.user.user_metadata as any)?.mobile    ?? "").trim();

      await svc.from("profiles").upsert({
        user_id:    data.user.id,
        full_name:  fullName || null,
        mobile:     mobile   || null,
        email:      data.user.email,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

      // 30-day trial subscription
      await svc.from("subscriptions").upsert({
        user_id:   data.user.id,
        status:    "trial",
        trial_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: "user_id" });

      // Fire-and-forget "verified" notification to admin (so we know they actually completed)
      try {
        fetch(`${origin}/api/notify-admin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event:     "verified",
            full_name: fullName,
            email:     data.user.email,
            mobile,
            note:      "Email verified · trial started · dashboard access granted",
          }),
          keepalive: true,
        }).catch(() => {});
      } catch {}

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
