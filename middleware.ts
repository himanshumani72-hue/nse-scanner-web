import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()     { return request.cookies.getAll(); },
        setAll(list) {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublic = path === "/" || path.startsWith("/login") || path.startsWith("/register") || path.startsWith("/auth") || path.startsWith("/api") || path.startsWith("/opengraph-image") || path.startsWith("/twitter-image") || path.startsWith("/twitter-card");
  const isVerifyPending = path === "/auth/verify-pending";

  // Redirect unauthenticated users away from protected pages
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── Email-verification gate ────────────────────────────────────────────
  // If user is logged in but hasn't confirmed their email yet, they can
  // only see the "verify your email" page — no dashboard, no billing,
  // no admin panel. Their account exists in Supabase but is gated.
  if (user && !user.email_confirmed_at && !isVerifyPending && !isPublic) {
    return NextResponse.redirect(new URL("/auth/verify-pending", request.url));
  }

  // Redirect authenticated AND VERIFIED users away from login/register
  if (user && user.email_confirmed_at && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Once verified, don't keep them on the pending page
  if (user && user.email_confirmed_at && isVerifyPending) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
