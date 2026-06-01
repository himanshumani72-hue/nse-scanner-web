"use client";
import { useState, useMemo } from "react";
import { TrendingUp, CheckCircle, Copy, Check, Smartphone, Sparkles } from "lucide-react";
import Link from "next/link";

const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID   || "himanshumani72@oksbi";
const PAYEE  = process.env.NEXT_PUBLIC_UPI_NAME || "NSE Scanner Pro";

const C = {
  bg0: "var(--bg-0)", bg1: "var(--bg-1)", bg2: "var(--bg-2)",
  line: "var(--line)", line2: "var(--line-2)",
  ink0: "var(--ink-0)", ink1: "var(--ink-1)", ink2: "var(--ink-2)",
  ink3: "var(--ink-3)", ink4: "var(--ink-4)",
  up: "var(--up)", down: "var(--down)",
  accent: "var(--accent)", accent2: "var(--accent-2)",
};

interface Props {
  amount:        number;     // what user pays this time (49 or 99)
  isPromo:       boolean;    // is this a discounted payment?
  promoLeft:     number;     // how many more discounted payments available
  originalPrice: number;     // 99 — the un-discounted price
}

export default function BillingForm({ amount, isPromo, promoLeft, originalPrice }: Props) {
  const [stage,   setStage]   = useState<"qr" | "utr">("qr");
  const [utr,     setUtr]     = useState("");
  const [app,     setApp]     = useState("GPay");
  const [notes,   setNotes]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [copied,  setCopied]  = useState(false);

  // UPI deep-link / QR — amount baked in
  const upiLink = useMemo(() => {
    const params = new URLSearchParams({
      pa: UPI_ID, pn: PAYEE, am: String(amount), cu: "INR",
      tn: `NSE Scanner Pro - 30 days${isPromo ? " (promo)" : ""}`,
    });
    return `upi://pay?${params.toString()}`;
  }, [amount, isPromo]);

  const qrSrc = useMemo(
    () => `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(upiLink)}`,
    [upiLink]
  );

  function copyUpi() {
    navigator.clipboard?.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleSubmit() {
    setLoading(true); setError(""); setSuccess("");
    const clean = utr.trim().replace(/\s+/g, "");
    if (!/^[A-Za-z0-9]{10,22}$/.test(clean)) {
      setError("UTR must be 10–22 letters/digits. Copy it exactly from your UPI app's transaction history.");
      setLoading(false); return;
    }
    try {
      const res = await fetch("/api/upi/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ utr: clean, upi_app: app, notes, expected_amount: amount }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Submission failed"); setLoading(false); return; }
      setSuccess(data.message || "Submitted! We'll verify within 24 hours.");
      setUtr(""); setNotes("");
    } catch { setError("Network error. Please try again."); }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh", background: C.bg0, color: C.ink0,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 16px", fontFamily: "inherit",
    }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 18 }}>
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
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.ink0 }}>Activate subscription</h1>
          <p style={{ margin: "6px 0 0", color: C.ink2, fontSize: 13 }}>
            Pay ₹{amount} via UPI · Activated within 24 hours
          </p>
        </div>

        {/* Promo banner — only if user qualifies */}
        {isPromo && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px", marginBottom: 14,
            background: `linear-gradient(135deg, ${C.up}15, ${C.accent}10)`,
            border: `1px solid ${C.up}40`,
            borderRadius: 10,
            fontSize: 12.5, color: C.ink1, lineHeight: 1.45,
          }}>
            <Sparkles size={16} color={C.up} style={{ flexShrink: 0 }} />
            <span>
              <b style={{ color: C.up }}>Launch offer active</b> — {promoLeft} discounted month{promoLeft === 1 ? "" : "s"} left at ₹{amount}. After that, ₹{originalPrice}/month.
            </span>
          </div>
        )}

        {/* Card */}
        <div style={{
          background: C.bg1, border: `1px solid ${C.line}`,
          borderRadius: 16, padding: 26,
        }}>
          {/* Price block */}
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            {isPromo ? (
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 10 }}>
                <span style={{
                  fontSize: 24, fontWeight: 500, color: C.ink3,
                  textDecoration: "line-through", textDecorationThickness: 2,
                }}>₹{originalPrice}</span>
                <span style={{ fontSize: 44, fontWeight: 800, color: C.up, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  ₹{amount}
                </span>
              </div>
            ) : (
              <div style={{ fontSize: 44, fontWeight: 700, color: C.ink0, lineHeight: 1.1 }}>₹{amount}</div>
            )}
            <div style={{ color: C.ink2, fontSize: 13, marginTop: 6 }}>
              for 30 days · renew anytime
            </div>
          </div>

          {/* Features */}
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px", display: "flex", flexDirection: "column", gap: 9 }}>
            {[
              "500+ NSE stocks scanned daily",
              "Big Movers + Chart Pattern + W-Pattern",
              "52W Breakouts + Bulk Deals + Buzz Spike",
              "Probability ranking with cross-scanner stacking",
              "Real-time Supabase alerts",
              "9:20 AM & 3:00 PM IST scans",
            ].map(f => (
              <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: C.ink1 }}>
                <CheckCircle size={15} color={C.up} style={{ flexShrink: 0 }} />
                {f}
              </li>
            ))}
          </ul>

          {/* Stage switcher */}
          <div style={{
            display: "flex", gap: 4, marginBottom: 18, padding: 4,
            background: C.bg2, borderRadius: 9, border: `1px solid ${C.line}`,
          }}>
            {(["qr", "utr"] as const).map((s, idx) => (
              <button
                key={s}
                onClick={() => setStage(s)}
                style={{
                  flex: 1, padding: "9px 0", border: "none", borderRadius: 6,
                  background: stage === s ? C.accent : "transparent",
                  color:      stage === s ? "#fff"    : C.ink2,
                  fontSize: 13, fontWeight: 500, cursor: "pointer",
                  transition: "background .15s ease, color .15s ease",
                  fontFamily: "inherit",
                }}>
                {idx === 0 ? `1. Pay ₹${amount} via UPI` : "2. Confirm Payment"}
              </button>
            ))}
          </div>

          {/* ──── STAGE 1: QR ──────────────────────────────────────── */}
          {stage === "qr" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{
                background: "#ffffff", padding: 16, borderRadius: 12,
                display: "flex", flexDirection: "column", alignItems: "center",
                border: `1px solid ${C.line}`,
              }}>
                <img src={qrSrc} alt={`Scan to pay ₹${amount}`} width={240} height={240} style={{ borderRadius: 8 }} />
                <p style={{ margin: "8px 0 0", fontSize: 11.5, color: "#334155", fontWeight: 500 }}>
                  Scan with GPay · PhonePe · Paytm · BHIM
                </p>
              </div>

              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                padding: "10px 14px", background: C.bg2, border: `1px solid ${C.line}`, borderRadius: 10,
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.10em", color: C.ink3 }}>UPI ID</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: C.ink0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {UPI_ID}
                  </div>
                </div>
                <button onClick={copyUpi} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "8px 12px", border: "none", borderRadius: 6,
                  background: C.accent, color: "#fff",
                  fontSize: 12, fontWeight: 500, cursor: "pointer", flexShrink: 0,
                  fontFamily: "inherit",
                }}>
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <a
                href={upiLink}
                className="upi-mobile-link"
                style={{
                  display: "none", width: "100%", padding: 12, textAlign: "center",
                  background: C.up, color: "#fff", borderRadius: 10,
                  fontSize: 14, fontWeight: 600, textDecoration: "none",
                }}
              >
                Open UPI App to Pay ₹{amount}
              </a>
              <style>{`@media (max-width: 768px) { .upi-mobile-link { display: block !important; } }`}</style>

              <div style={{
                padding: 12, borderRadius: 9,
                background: "color-mix(in oklab, var(--accent) 8%, transparent)",
                border: `1px solid color-mix(in oklab, var(--accent) 25%, transparent)`,
                fontSize: 11.5, lineHeight: 1.55, color: C.ink1,
              }}>
                <div style={{ fontWeight: 600, color: C.accent2, marginBottom: 3 }}>After payment:</div>
                Click <b>"2. Confirm Payment"</b> above and paste your <b>UTR / transaction reference</b> (12-digit ID from your UPI app's success screen).
              </div>

              <button onClick={() => setStage("utr")} style={{
                width: "100%", padding: "13px", border: "none", borderRadius: 11,
                background: C.accent, color: "#fff",
                fontSize: 14.5, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit", transition: "filter .15s ease",
              }}
                onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                I've Paid — Confirm Now →
              </button>
            </div>
          )}

          {/* ──── STAGE 2: UTR ─────────────────────────────────────── */}
          {stage === "utr" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {success && (
                <div style={{
                  padding: 14, borderRadius: 10,
                  background: "color-mix(in oklab, var(--up) 12%, transparent)",
                  border: `1px solid color-mix(in oklab, var(--up) 35%, transparent)`,
                  color: C.up, fontSize: 13,
                }}>
                  <p style={{ margin: "0 0 4px", fontWeight: 600 }}>✓ Payment Submitted</p>
                  <p style={{ margin: 0, opacity: 0.85 }}>{success}</p>
                  <Link href="/dashboard" style={{
                    display: "inline-block", marginTop: 12, color: C.accent,
                    textDecoration: "underline", fontSize: 13,
                  }}>← Back to Dashboard</Link>
                </div>
              )}

              {!success && (
                <>
                  <Field label="UPI App used">
                    <select value={app} onChange={e => setApp(e.target.value)} style={inputStyle()}>
                      <option>GPay</option><option>PhonePe</option><option>Paytm</option>
                      <option>BHIM</option><option>Other</option>
                    </select>
                  </Field>

                  <Field
                    label="Transaction Reference (UTR)" required
                    hint='Look for "UTR" / "Transaction ID" / "Reference number" in your UPI app. Usually 12 digits.'
                  >
                    <input
                      type="text" value={utr} onChange={e => setUtr(e.target.value)}
                      placeholder="e.g. 414328765432" maxLength={22}
                      style={{ ...inputStyle(), fontFamily: "var(--mono)" }}
                    />
                  </Field>

                  <Field label="Notes (optional)">
                    <textarea
                      value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder="Anything we should know? (e.g. paid from spouse's account)"
                      rows={2} maxLength={500}
                      style={{ ...inputStyle(), resize: "none" }}
                    />
                  </Field>

                  {error && (
                    <p style={{
                      margin: 0, padding: "8px 12px", borderRadius: 8,
                      background: "color-mix(in oklab, var(--down) 12%, transparent)",
                      border: `1px solid color-mix(in oklab, var(--down) 30%, transparent)`,
                      color: C.down, fontSize: 13, whiteSpace: "pre-wrap",
                    }}>{error}</p>
                  )}

                  <button
                    onClick={handleSubmit} disabled={loading || !utr.trim()}
                    style={{
                      width: "100%", padding: "13px", border: "none", borderRadius: 11,
                      background: C.accent, color: "#fff",
                      fontSize: 14.5, fontWeight: 600,
                      cursor: (loading || !utr.trim()) ? "not-allowed" : "pointer",
                      opacity: (loading || !utr.trim()) ? 0.5 : 1,
                      fontFamily: "inherit",
                    }}>
                    {loading ? "Submitting…" : `Submit ₹${amount} for Verification`}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Footer */}
          <div style={{
            marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.line}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            fontSize: 11.5, color: C.ink3,
          }}>
            <Link href="/dashboard" style={{ color: C.ink3, textDecoration: "none" }}>← Dashboard</Link>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Smartphone size={12} /> Direct UPI · verified within 24 hours
            </span>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 14, fontSize: 10.5, color: C.ink4 }}>
          Payments go directly to our UPI account · No card data stored anywhere
        </p>
      </div>
    </div>
  );
}

function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label style={{
        display: "block", fontSize: 10.5, fontWeight: 500,
        textTransform: "uppercase", letterSpacing: "0.10em",
        color: "var(--ink-2)", marginBottom: 6,
      }}>
        {label} {required && <span style={{ color: "var(--down)" }}>*</span>}
      </label>
      {children}
      {hint && (
        <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--ink-3)", lineHeight: 1.5 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function inputStyle(): React.CSSProperties {
  return {
    width: "100%", padding: "10px 12px",
    background: "var(--bg-2)", border: "1px solid var(--line)",
    borderRadius: 8, color: "var(--ink-0)",
    fontSize: 13, outline: "none", fontFamily: "inherit",
  };
}
