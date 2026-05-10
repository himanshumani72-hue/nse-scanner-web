"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TrendingUp, Eye, EyeOff, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router   = useRouter();
  const supabase = createClient();
  const [email,   setEmail]   = useState("");
  const [pass,    setPass]    = useState("");
  const [show,    setShow]    = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error: err } = await supabase.auth.signUp({
      email, password: pass,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    if (err) { setError(err.message); setLoading(false); return; }
    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
        <div className="card p-10 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-green-900/40 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Check your email!</h2>
          <p className="text-slate-400">We sent a confirmation link to <strong className="text-white">{email}</strong>. Click it to activate your 30-day free trial.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
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
          {/* Benefits list */}
          <div className="bg-[#0d1b2e] rounded-lg p-4 mb-6 space-y-2">
            {["500+ NSE stocks scanned twice daily","Big Movers + Chart Patterns + W-Pattern alerts","Position sizing: Stop, Target, Qty auto-calculated","Real-time dashboard — updates the moment scan runs"].map(b => (
              <div key={b} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                {b}
              </div>
            ))}
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Password (min 8 characters)</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"} required minLength={8} value={pass} onChange={e => setPass(e.target.value)}
                  className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors pr-10"
                  placeholder="Choose a strong password"
                />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-3 text-slate-500 hover:text-slate-300">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? "Creating account…" : "Create Free Account →"}
            </button>
          </form>

          <p className="text-center text-slate-600 text-xs mt-4">
            By signing up you agree to our terms. After 30 days, ₹99/month.
          </p>
          <p className="text-center text-slate-500 text-sm mt-3">
            Have account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
