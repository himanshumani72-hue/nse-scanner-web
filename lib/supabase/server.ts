import { createServerClient } from "@supabase/ssr";
import { createClient as createPlainClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()       { return cookieStore.getAll(); },
        setAll(list)   { list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); },
      },
    }
  );
}

export function createServiceClient() {
  // IMPORTANT: use @supabase/supabase-js (NOT @supabase/ssr) for the
  // service-role client. createServerClient from @supabase/ssr is cookie-aware
  // and applies the logged-in user's JWT on top of the service key, which
  // re-enables RLS and hides other users' rows — the exact bug we just hit.
  //
  // The plain client honours the service-role key cleanly and bypasses RLS.
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    "";

  if (!serviceKey) {
    console.error("[supabase] No service-role key found. Admin/webhook ops will fail.");
  }

  return createPlainClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession:   false,
      },
    }
  );
}
