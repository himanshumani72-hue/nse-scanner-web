"use client";
import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Eye, EyeOff, CheckCircle, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [mobile,  setMobile]  = useState("");
  const [pass,    setPass]    = useState("");
  const [show,    setShow]    = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // ── Client-side validation ─────────────────────────────────
    const cleanName = name.trim();
    const cleanMobile = mobile.trim().replace(/\D/g, "");   // strip non-digits

    if (cleanName.length < 2) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setError("Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8 or 9).");
      return;
    }
    if (pass.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    // Supabase signup — name/mobile stored in user_metadata for the auth.users row.
    // The /auth/callback handler will copy these into the profiles table once
    // the email is verified.
    const { error: err } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          full_name: cleanName,
          mobile:    cleanMobile,
        },
      },
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    // Fire-and-forget admin alert (server-side route handles the email)
    try {
      fetch("/api/notify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event:      "signup",
          full_name:  cleanName,
          email,
          mobile:     cleanMobile,
        }),
        keepalive: true,   // sends even if the user navigates away
      });
    } catch {}

    setDone(true);
    setLoading(false);
  }

  /* ── Success screen ─────────────────────────────────────── */
  if (done) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
        <div className="card p-10 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-green-900/40 flex items-center justify-center mx-auto mb-4">
            <Mail size={32} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verify your email to continue</h2>
          <p className="text-slate-400 mb-1">
            We sent a confirmation link to <strong className="text-white">{email}</strong>.
          </p>
          <p className="text-slate-500 text-sm mb-6">
            Click the link in your inbox to activate your 30-day free trial and access the dashboard.
          </p>
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 text-xs text-slate-300 text-left">
            <strong className="text-blue-300">Can't find the email?</strong>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Check your <b>Spam / Promotions</b> folder</li>
              <li>The sender will be your Supabase project name</li>
              <li>The link expires in 24 hours — re-register if it expires</li>
            </ul>
          </div>
          <Link href="/login" className="inline-block mt-6 text-blue-400 hover:text-blue-300 text-sm">
            ← Back to sign-in
          </Link>
        </div>
      </div>
    );
  }

  /* ── Register form ──────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white">NSE Scanner Pro</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Start free trial</h1>
          <p className="text-slate-400 mt-1">30 days free — no credit card required</p>
        </div>

        <div className="card p-7">
          <div className="bg-[#0d1b2e] rounded-lg p-4 mb-6 space-y-2">
            {[
              "500+ NSE stocks scanned twice daily",
              "12 scanners + Probability ranking",
              "ATR-based Stop Loss & Target on every alert",
              "Real-time dashboard updates",
            ].map(b => (
              <div key={b} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                {b}
              </div>
            ))}
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Full name</label>
              <input
                type="text" required value={name} onChange={e => setName(e.target.value)}
                autoComplete="name" maxLength={80}
                className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                placeholder="e.g. Himanshu Mani"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Mobile number</label>
              <div className="relative flex">
                <span className="bg-[#0a0f1e] border border-[#1e293b] border-r-0 rounded-l-lg px-3 py-2.5 text-slate-400 text-sm select-none">
                  +91
                </span>
                <input
                  type="tel" required value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ""))}
                  autoComplete="tel" maxLength={10} inputMode="numeric"
                  className="flex-1 bg-[#0a0f1e] border border-[#1e293b] rounded-r-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="9876543210"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">10-digit Indian mobile. Used for payment verification & account recovery.</p>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Password (min 8 characters)</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"} required minLength={8} value={pass} onChange={e => setPass(e.target.value)}
                  className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 pr-10"
                  placeholder="Choose a strong password"
                />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-3 text-slate-500 hover:text-slate-300">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? "Creating account…" : "Create account → Verify email"}
            </button>
          </form>

          <p className="text-center text-slate-600 text-xs mt-4 leading-relaxed">
            We'll email you a verification link. You can access the dashboard only after clicking it.
            <br />
            After 30-day trial, ₹49/month for first 3 months (then ₹99/month).
          </p>
          <p className="text-center text-slate-500 text-sm mt-3">
            Have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
