export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const FALLBACK_ADMIN = "himanshumani72@gmail.com";

/**
 * Diagnostic-only endpoint. Returns:
 *   - whether the current user matches the admin email
 *   - whether service-role env var is set, how long the value is, prefix
 *   - whether the service client can read upi_payments
 *   - any error from Supabase
 * Visit /api/admin/diag while logged in. Should return JSON.
 */
export async function GET() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? FALLBACK_ADMIN).toLowerCase();

  // 1. Auth check
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Service key inspection (don't leak the value!)
  const keyRaw =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    "";
  const keyTrimmed = keyRaw.trim();
  const keyInfo = {
    SUPABASE_SERVICE_ROLE_KEY_set: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_SERVICE_KEY_set:      !!process.env.SUPABASE_SERVICE_KEY,
    has_trailing_whitespace:       keyRaw !== keyTrimmed,
    length:                        keyTrimmed.length,
    prefix:                        keyTrimmed.slice(0, 10) + "…",
    suffix:                        "…" + keyTrimmed.slice(-6),
    looks_like_jwt:                keyTrimmed.startsWith("eyJ") && keyTrimmed.split(".").length === 3,
  };

  // 3. Try a service-client read
  let rowCount = -1;
  let readError: string | null = null;
  try {
    const svc = createServiceClient();
    const { data, error } = await svc.from("upi_payments").select("id", { count: "exact" });
    if (error) readError = `${error.code ?? ""} ${error.message}`;
    else       rowCount  = data?.length ?? 0;
  } catch (e: any) {
    readError = e?.message ?? "Unknown error";
  }

  return NextResponse.json({
    you: {
      email:        user?.email ?? null,
      logged_in:    !!user,
      matches_admin: (user?.email ?? "").toLowerCase() === adminEmail,
      admin_email:  adminEmail,
    },
    service_key: keyInfo,
    upi_payments_read: {
      row_count_seen: rowCount,
      error:          readError,
    },
    hint: rowCount === 0 && !readError
      ? "Read succeeded but returned 0 rows — service-role check passed but data is missing OR RLS is being applied (key actually anon)."
      : readError
        ? "Read failed — service-role key likely wrong/expired."
        : "Read OK.",
  });
}
