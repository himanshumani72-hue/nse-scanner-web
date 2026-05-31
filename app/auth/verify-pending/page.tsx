"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, RefreshCw, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * Gate page shown to users whose account exists but email isn't verified yet.
 * Middleware redirects all protected routes here until email_confirmed_at is set.
 */
export default function VerifyPendingPage() {
  const supabase = createClient();
  const [resending, setResending] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function resend() {
    setResending(true); setMsg(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setMsg({ type: "err", text: "Couldn't find your account. Please sign in again." });
      setResending(false);
      return;
    }
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.resend({
      type:    "signup",
      email:   user.email,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    if (error) {
      setMsg({ type: "err", text: error.message });
    } else {
      setMsg({ type: "ok", text: "Verification email re-sent. Check your inbox (and spam folder)." });
    }
    setResending(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.replace("/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-900/40 flex items-center justify-center mx-auto mb-5">
            <Mail size={32} className="text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Please verify your email</h1>
          <p className="text-slate-400 mb-2">
            We sent a verification link to your email address.
          </p>
          <p className="text-slate-500 text-sm mb-7">
            Click the link in your inbox to activate your account and start your 30-day free trial.
          </p>

          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 text-xs text-slate-300 text-left mb-6">
            <strong className="text-blue-300">Can&apos;t find the email?</strong>
            <ul className="list-disc list-inside mt-1.5 space-y-0.5">
              <li>Check your <b>Spam / Promotions</b> folder</li>
              <li>The link expires in 24 hours</li>
              <li>The sender shows as <code className="text-slate-400">noreply@mail.app.supabase.io</code></li>
            </ul>
          </div>

          {msg && (
            <p className={`text-sm rounded-lg px-3 py-2 mb-4 ${
              msg.type === "ok"
                ? "bg-green-900/20 text-green-300 border border-green-700/30"
                : "bg-red-900/20 text-red-300 border border-red-700/30"
            }`}>
              {msg.text}
            </p>
          )}

          <button
            onClick={resend}
            disabled={resending}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium text-sm mb-3"
          >
            <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
            {resending ? "Sending…" : "Re-send verification email"}
          </button>

          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 bg-[#0a0f1e] hover:bg-[#1a2235] border border-[#1e293b] text-slate-300 py-2.5 rounded-lg font-medium text-sm"
          >
            <LogOut size={14} />
            Sign out and use a different email
          </button>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Wrong email? <Link href="/register" className="text-blue-400 hover:text-blue-300">Sign up again</Link>
        </p>
      </div>
    </div>
  );
}
