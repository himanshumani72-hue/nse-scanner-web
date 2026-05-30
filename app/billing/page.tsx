"use client";
import { useState, useMemo } from "react";
import { TrendingUp, CheckCircle, Copy, Check } from "lucide-react";
import Link from "next/link";

// Set these in Vercel env. If env vars are missing, hard-coded fallbacks apply.
const UPI_ID    = process.env.NEXT_PUBLIC_UPI_ID    || "himanshumani72@oksbi";
const PAYEE     = process.env.NEXT_PUBLIC_UPI_NAME  || "NSE Scanner Pro";
const AMOUNT    = 99;

export default function BillingPage() {
  const [stage,   setStage]   = useState<"qr" | "utr">("qr");
  const [utr,     setUtr]     = useState("");
  const [app,     setApp]     = useState("GPay");
  const [notes,   setNotes]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [copied,  setCopied]  = useState(false);

  // Build UPI deep-link + QR (encodes the link)
  const upiLink = useMemo(() => {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: PAYEE,
      am: String(AMOUNT),
      cu: "INR",
      tn: "NSE Scanner Pro - 30 days access",
    });
    return `upi://pay?${params.toString()}`;
  }, []);

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
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/upi/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ utr: clean, upi_app: app, notes }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Submission failed");
        setLoading(false);
        return;
      }
      setSuccess(data.message || "Submitted! We'll verify within 24 hours.");
      setUtr(""); setNotes("");
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

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
          <h1 className="text-2xl font-bold text-white">Activate subscription</h1>
          <p className="text-slate-400 mt-1">Pay ₹99 via UPI · Activated within 24 hours</p>
        </div>

        <div className="card p-7">
          {/* Plan summary */}
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-white">₹{AMOUNT}</div>
            <div className="text-slate-400 text-sm mt-1">for 30 days • renew anytime</div>
          </div>

          <ul className="space-y-2.5 mb-6">
            {[
              "500+ NSE stocks scanned daily",
              "Big Movers + Chart Pattern + W-Pattern",
              "52W Breakouts + Bulk Deals + Buzz Spike",
              "Probability ranking with cross-scanner stacking",
              "Real-time Supabase alerts",
              "9:20 AM & 3:00 PM IST scans",
            ].map(f => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                <CheckCircle size={15} className="text-green-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          {/* Tab switcher */}
          <div className="flex gap-1 mb-5 p-1 bg-[#0f172a] rounded-lg">
            <button
              onClick={() => setStage("qr")}
              className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                stage === "qr" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              1. Pay ₹99 via UPI
            </button>
            <button
              onClick={() => setStage("utr")}
              className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                stage === "utr" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              2. Confirm Payment
            </button>
          </div>

          {/* ── STAGE 1: QR + UPI ID ─────────────────────────────────── */}
          {stage === "qr" && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl flex flex-col items-center">
                <img
                  src={qrSrc}
                  alt="Scan with GPay / PhonePe / Paytm"
                  width={240} height={240}
                  className="rounded-lg"
                />
                <p className="text-xs text-slate-700 mt-2 font-medium">
                  Scan with GPay / PhonePe / Paytm / BHIM
                </p>
              </div>

              {/* UPI ID copy button */}
              <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">UPI ID</div>
                  <div className="text-sm font-mono text-white truncate">{UPI_ID}</div>
                </div>
                <button
                  onClick={copyUpi}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex-shrink-0"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {/* Mobile: deep-link button to open UPI app directly */}
              <a
                href={upiLink}
                className="block w-full bg-green-600 hover:bg-green-500 text-white text-center py-3 rounded-xl font-semibold transition-colors md:hidden"
              >
                Open UPI App to Pay ₹{AMOUNT}
              </a>

              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
                <p className="font-medium text-blue-300 mb-1">After payment:</p>
                <p>Click <b>"2. Confirm Payment"</b> above and paste the <b>UTR / transaction reference</b> from your UPI app (look for it on the success screen or transaction history).</p>
              </div>

              <button
                onClick={() => setStage("utr")}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-semibold transition-colors"
              >
                I've Paid — Confirm Now →
              </button>
            </div>
          )}

          {/* ── STAGE 2: UTR submission ──────────────────────────────── */}
          {stage === "utr" && (
            <div className="space-y-4">
              {success && (
                <div className="bg-green-900/20 border border-green-700/40 rounded-lg p-4 text-sm text-green-300">
                  <p className="font-medium mb-1">✓ Payment Submitted</p>
                  <p className="text-green-400/80">{success}</p>
                  <Link href="/dashboard" className="inline-block mt-3 text-blue-400 hover:text-blue-300 underline">
                    ← Back to Dashboard
                  </Link>
                </div>
              )}

              {!success && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                      UPI App used
                    </label>
                    <select
                      value={app}
                      onChange={e => setApp(e.target.value)}
                      className="w-full bg-[#0f172a] border border-[#1e293b] rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 outline-none"
                    >
                      <option>GPay</option>
                      <option>PhonePe</option>
                      <option>Paytm</option>
                      <option>BHIM</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Transaction Reference (UTR) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={utr}
                      onChange={e => setUtr(e.target.value)}
                      placeholder="e.g. 414328765432"
                      className="w-full bg-[#0f172a] border border-[#1e293b] rounded-lg px-3 py-2.5 text-white font-mono text-sm focus:border-blue-500 outline-none"
                      maxLength={22}
                    />
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                      Look for "UTR" / "Transaction ID" / "Reference number" in your UPI app's transaction screen.
                      Usually 12 digits. We'll verify within 24 hours.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Anything we should know? (e.g. payment from spouse's account)"
                      className="w-full bg-[#0f172a] border border-[#1e293b] rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 outline-none resize-none"
                      rows={2}
                      maxLength={500}
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm bg-red-900/20 px-3 py-2 rounded-lg whitespace-pre-wrap">
                      {error}
                    </p>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={loading || !utr.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-colors"
                  >
                    {loading ? "Submitting…" : "Submit for Verification"}
                  </button>
                </>
              )}
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-[#1e293b] flex items-center justify-between text-xs text-slate-500">
            <Link href="/dashboard" className="hover:text-slate-300">← Dashboard</Link>
            <span>Verified within 24 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}
