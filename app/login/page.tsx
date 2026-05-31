"use client";
import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const C = {
  bg0:  "var(--bg-0)", bg1: "var(--bg-1)", bg2: "var(--bg-2)",
  line: "var(--line)", line2: "var(--line-2)",
  ink0: "var(--ink-0)", ink1: "var(--ink-1)", ink2: "var(--ink-2)",
  ink3: "var(--ink-3)", ink4: "var(--ink-4)",
  up: "var(--up)", down: "var(--down)",
  accent: "var(--accent)", accent2: "var(--accent-2)",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  background: "var(--bg-2)", border: "1px solid var(--line)",
  borderRadius: 9, color: "var(--ink-0)",
  fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail]     = useState("");
  const [pass,  setPass]      = useState("");
  const [show,  setShow]      = useState(false);
  const [error, setError]     = useState("");
  const [info,  setInfo]      = useState("");
  const [loading, setLoading] = useState(false);

  async function handleForgot() {
    if (!email || !email.includes("@")) {
      setError("Enter your email above first, then click 'Forgot password?'");
      return;
    }
    setError(""); setInfo("");
    try {
      const redirectTo = `${window.location.origin}/auth/reset-password`;
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (err) { setError(err.message); return; }
      setInfo(`Password reset link sent to ${email}. Check your inbox (and spam folder).`);
    } catch (e: any) {
      setError(e?.message ?? "Could not send reset email");
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (err) { setError(err.message); setLoading(false); return; }
      if (data?.session) window.location.replace("/dashboard");
      else { setError("No session returned — check Supabase env vars in Vercel."); setLoading(false); }
    } catch (e: any) {
      setError(e?.message ?? "Network error — check console"); setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: C.bg0, color: C.ink0,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 16px", fontFamily: "inherit",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 9,
            textDecoration: "none", marginBottom: 18,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: "linear-gradient(135deg, #2bd07a 0%, #5b8cff 100%)",
              display: "grid", placeItems: "center",
              boxShadow: "0 4px 14px -4px rgba(91,140,255,.45)",
            }}>
              <TrendingUp size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 18, color: C.ink0 }}>NSE Scanner Pro</span>
          </Link>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: C.ink0 }}>Welcome back</h1>
          <p style={{ margin: "6px 0 0", color: C.ink2, fontSize: 13 }}>Sign in to your account</p>
        </div>

        <div style={{
          background: C.bg1, border: `1px solid ${C.line}`,
          borderRadius: 14, padding: 26,
        }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, color: C.ink2, marginBottom: 6 }}>Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                autoComplete="email" placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ display: "block", fontSize: 12, color: C.ink2, marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={show ? "text" : "password"} required value={pass}
                  onChange={e => setPass(e.target.value)}
                  autoComplete="current-password" placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  style={{
                    position: "absolute", right: 8, top: 0, bottom: 0,
                    background: "transparent", border: "none", padding: 8,
                    color: C.ink3, cursor: "pointer", display: "grid", placeItems: "center",
                  }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right", marginBottom: 14 }}>
              <button type="button" onClick={handleForgot}
                style={{
                  background: "transparent", border: "none", padding: 0,
                  color: C.accent, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                }}>
                Forgot password?
              </button>
            </div>

            {error && (
              <p style={{
                margin: "0 0 12px", padding: "8px 12px", borderRadius: 8,
                background: "color-mix(in oklab, var(--down) 12%, transparent)",
                border: `1px solid color-mix(in oklab, var(--down) 30%, transparent)`,
                color: C.down, fontSize: 13,
              }}>{error}</p>
            )}
            {info && (
              <p style={{
                margin: "0 0 12px", padding: "8px 12px", borderRadius: 8,
                background: "color-mix(in oklab, var(--up) 12%, transparent)",
                border: `1px solid color-mix(in oklab, var(--up) 30%, transparent)`,
                color: C.up, fontSize: 13,
              }}>{info}</p>
            )}

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "12px 0", border: "none", borderRadius: 10,
              background: C.accent, color: "#fff",
              fontSize: 14.5, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              fontFamily: "inherit", transition: "filter .15s ease",
            }}
              onMouseEnter={e => !loading && (e.currentTarget.style.filter = "brightness(1.1)")}
              onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p style={{ margin: "16px 0 0", textAlign: "center", fontSize: 13, color: C.ink2 }}>
            No account?{" "}
            <Link href="/register" style={{ color: C.accent, textDecoration: "none" }}>Start free trial →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
