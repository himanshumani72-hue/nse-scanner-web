"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router   = useRouter();
  const supabase = createClient();
  const [pass,    setPass]    = useState("");
  const [pass2,   setPass2]   = useState("");
  const [show,    setShow]    = useState(false);
  const [error,   setError]   = useState("");
  const [info,    setInfo]    = useState("");
  const [loading, setLoading] = useState(false);
  const [ready,   setReady]   = useState(false);

  // Supabase reset links land with a session — wait for it before allowing submit
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) setReady(true);
      else setError("Reset link expired or invalid. Please request a new one from /login.");
    })();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setInfo("");
    if (pass.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }
    if (pass !== pass2) {
      setError("Passwords don't match."); return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password: pass });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setInfo("Password updated! Redirecting to dashboard…");
    setTimeout(() => router.replace("/dashboard"), 1200);
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
          <h1 className="text-2xl font-bold text-white">Set a new password</h1>
          <p className="text-slate-400 mt-1">Enter and confirm your new password.</p>
        </div>

        <div className="card p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">New password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"} required
                  value={pass} onChange={e => setPass(e.target.value)}
                  className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 pr-10"
                  placeholder="At least 8 characters"
                />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-3 text-slate-500 hover:text-slate-300">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Confirm password</label>
              <input
                type={show ? "text" : "password"} required
                value={pass2} onChange={e => setPass2(e.target.value)}
                className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                placeholder="Type it again"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {info  && <p className="text-green-400 text-sm bg-green-900/20 px-3 py-2 rounded">{info}</p>}

            <button
              type="submit" disabled={loading || !ready}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-5">
            <Link href="/login" className="text-blue-400 hover:text-blue-300">← Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
