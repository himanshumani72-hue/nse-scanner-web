"use client";
import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Eye, EyeOff, CheckCircle, Mail } from "lucide-react";
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
  width: "100%",
  padding: "11px 14px",
  background: C.bg2,
  border: `1px solid ${C.line}`,
  borderRadius: 9,
  color: C.ink0,
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

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

    const cleanName   = name.trim();
    const cleanMobile = mobile.trim().replace(/\D/g, "");

    if (cleanName.length < 2) {
      setError("Please enter your full name (at least 2 characters)."); return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setError("Please enter a valid 10-digit Indian mobile (starts with 6, 7, 8 or 9)."); return;
    }
    if (pass.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }

    setLoading(true);
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const { error: err } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: { full_name: cleanName, mobile: cleanMobile },
      },
    });
    if (err) { setError(err.message); setLoading(false); return; }

    // Fire-and-forget admin notification
    try {
      fetch("/api/notify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "signup", full_name: cleanName, email, mobile: cleanMobile }),
        keepalive: true,
      });
    } catch {}

    setDone(true);
    setLoading(false);
  }

  /* ── Success screen ─────────────────────────────────────── */
  if (done) {
    return (
      <div style={{
        minHeight: "100vh", background: C.bg0, color: C.ink0,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 16px", fontFamily: "inherit",
      }}>
        <div style={{
          width: "100%", maxWidth: 460,
          background: C.bg1, border: `1px solid ${C.line}`,
          borderRadius: 14, padding: 36, textAlign: "center",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 9999,
            background: "color-mix(in oklab, var(--up) 16%, transparent)",
            border: `1px solid color-mix(in oklab, var(--up) 30%, transparent)`,
            display: "grid", placeItems: "center", margin: "0 auto 18px",
          }}>
            <Mail size={28} color={C.up} />
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, color: C.ink0 }}>
            Verify your email to continue
          </h2>
          <p style={{ margin: 0, color: C.ink2, fontSize: 14 }}>
            We sent a confirmation link to <strong style={{ color: C.ink0 }}>{email}</strong>.
          </p>
          <p style={{ margin: "6px 0 24px", color: C.ink3, fontSize: 13 }}>
            Click the link in your inbox to activate your 30-day free trial and access the dashboard.
          </p>
          <div style={{
            padding: 12, borderRadius: 9,
            background: "color-mix(in oklab, var(--accent) 8%, transparent)",
            border: `1px solid color-mix(in oklab, var(--accent) 25%, transparent)`,
            color: C.ink1, fontSize: 12, lineHeight: 1.55, textAlign: "left",
          }}>
            <strong style={{ color: C.accent2 }}>Can&apos;t find the email?</strong>
            <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
              <li>Check your Spam / Promotions folder</li>
              <li>The sender shows as <code style={{ color: C.ink2 }}>noreply@mail.app.supabase.io</code></li>
              <li>The link expires in 24 hours</li>
            </ul>
          </div>
          <Link href="/login" style={{
            display: "inline-block", marginTop: 22,
            color: C.accent, textDecoration: "none", fontSize: 14,
          }}>← Back to sign-in</Link>
        </div>
      </div>
    );
  }

  /* ── Register form ──────────────────────────────────────── */
  return (
    <div style={{
      minHeight: "100vh", background: C.bg0, color: C.ink0,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 16px", fontFamily: "inherit",
    }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
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
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: C.ink0 }}>Start free trial</h1>
          <p style={{ margin: "6px 0 0", color: C.ink2, fontSize: 13 }}>
            30 days free · no credit card · ₹49/mo for first 3 months
          </p>
        </div>

        <div style={{
          background: C.bg1, border: `1px solid ${C.line}`,
          borderRadius: 14, padding: 26,
        }}>
          {/* Benefits strip */}
          <div style={{
            background: C.bg2, border: `1px solid ${C.line}`,
            borderRadius: 10, padding: "12px 14px", marginBottom: 22,
            display: "flex", flexDirection: "column", gap: 7,
          }}>
            {[
              "500+ NSE stocks scanned twice daily",
              "12 scanners + Probability ranking",
              "ATR-based Stop Loss & Target on every alert",
              "Real-time dashboard updates",
            ].map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: C.ink1 }}>
                <CheckCircle size={13} color={C.up} style={{ flexShrink: 0 }} />
                {b}
              </div>
            ))}
          </div>

          <form onSubmit={handleRegister}>
            <Field label="Full name">
              <input
                type="text" required value={name} onChange={e => setName(e.target.value)}
                autoComplete="name" maxLength={80} placeholder="e.g. Himanshu Mani"
                style={inputStyle}
              />
            </Field>

            <Field label="Email">
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                autoComplete="email" placeholder="you@example.com"
                style={inputStyle}
              />
            </Field>

            <Field label="Mobile number" hint="10-digit Indian mobile. Used for payment verification & account recovery.">
              <div style={{ display: "flex" }}>
                <span style={{
                  padding: "11px 14px",
                  background: C.bg2,
                  border: `1px solid ${C.line}`,
                  borderRight: "none",
                  borderTopLeftRadius: 9, borderBottomLeftRadius: 9,
                  color: C.ink2, fontSize: 14, userSelect: "none",
                }}>+91</span>
                <input
                  type="tel" required inputMode="numeric" maxLength={10}
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g, ""))}
                  autoComplete="tel-national" placeholder="9876543210"
                  style={{
                    ...inputStyle,
                    borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
                    fontFamily: "var(--mono)",
                  }}
                />
              </div>
            </Field>

            <Field label="Password (min 8 characters)">
              <div style={{ position: "relative" }}>
                <input
                  type={show ? "text" : "password"} required minLength={8}
                  value={pass} onChange={e => setPass(e.target.value)}
                  placeholder="Choose a strong password"
                  style={{ ...inputStyle, paddingRight: 40 }}
                />
                <button
                  type="button" onClick={() => setShow(s => !s)}
                  style={{
                    position: "absolute", right: 8, top: 0, bottom: 0,
                    background: "transparent", border: "none", padding: 8,
                    color: C.ink3, cursor: "pointer", display: "grid", placeItems: "center",
                  }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

            {error && (
              <p style={{
                margin: "0 0 14px", padding: "8px 12px", borderRadius: 8,
                background: "color-mix(in oklab, var(--down) 12%, transparent)",
                border: `1px solid color-mix(in oklab, var(--down) 30%, transparent)`,
                color: C.down, fontSize: 13,
              }}>{error}</p>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: "12px 0", border: "none", borderRadius: 10,
                background: C.accent, color: "#fff",
                fontSize: 14.5, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                fontFamily: "inherit", transition: "filter .15s ease",
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.filter = "brightness(1.1)")}
              onMouseLeave={e => (e.currentTarget.style.filter = "none")}
            >
              {loading ? "Creating account…" : "Create account → Verify email"}
            </button>
          </form>

          <p style={{
            margin: "16px 0 0", textAlign: "center",
            fontSize: 11.5, color: C.ink3, lineHeight: 1.55,
          }}>
            We&apos;ll email you a verification link. You can access the dashboard only after clicking it.
          </p>
          <p style={{ margin: "10px 0 0", textAlign: "center", fontSize: 13, color: C.ink2 }}>
            Have an account?{" "}
            <Link href="/login" style={{ color: C.accent, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Reusable field block ────────────────────────────────── */
function Field({ label, hint, children }: {
  label: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: "block", fontSize: 12, fontWeight: 500,
        color: "var(--ink-2)", marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
      {hint && (
        <p style={{
          margin: "5px 0 0", fontSize: 11, color: "var(--ink-3)", lineHeight: 1.4,
        }}>{hint}</p>
      )}
    </div>
  );
}
