import { createServerClient } from "@supabase/ssr";
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
  // Accept either env-var name — Python scanners use SUPABASE_SERVICE_KEY,
  // Next.js convention is SUPABASE_SERVICE_ROLE_KEY. Whichever is set, use it.
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    "";

  if (!serviceKey && process.env.NODE_ENV !== "production") {
    console.error(
      "[supabase] No service-role key found. Set SUPABASE_SERVICE_ROLE_KEY " +
      "or SUPABASE_SERVICE_KEY in env vars. Admin reads, webhook writes, and " +
      "RLS-bypassing operations will fall back to anonymous access."
    );
  }

  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      cookies: {
        getAll()       { return cookieStore.getAll(); },
        setAll(list)   { list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); },
      },
    }
  );
}
