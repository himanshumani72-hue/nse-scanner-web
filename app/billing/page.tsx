"use client";
import { useState } from "react";
import { TrendingUp, CheckCircle, Smartphone } from "lucide-react";
import Link from "next/link";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleSubscribe() {
    setLoading(true); setError("");

    const pubKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!pubKey) {
      setError("Payment system not configured. NEXT_PUBLIC_RAZORPAY_KEY_ID missing on Vercel.");
      setLoading(false);
      return;
    }

    try {
      const res  = await fetch("/api/razorpay/create-payment", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.hint ? `${data.error}\n\nHint: ${data.hint}` : (data.error || "Failed to create order");
        setError(msg);
        setLoading(false);
        return;
      }

      // Load Razorpay checkout script (idempotent)
      const ensureScript = () => new Promise<void>((resolve, reject) => {
        if ((window as any).Razorpay) return resolve();
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
        document.body.appendChild(s);
      });
      try { await ensureScript(); }
      catch (e: any) {
        setError(e.message || "Failed to load Razorpay. Check your internet.");
        setLoading(false);
        return;
      }

      const rzp = new (window as any).Razorpay({
        key:         pubKey,
        order_id:    data.order_id,
        amount:      data.amount,
        currency:    data.currency,
        name:        "NSE Scanner Pro",
        description: "₹99 — 30 days access · All scanners + alerts",
        image:       "/logo.png",
        prefill:     { email: data.email, name: data.name ?? "" },
        theme:       { color: "#3b82f6" },

        // ⭐ Show UPI tab FIRST + as default — Indian users overwhelmingly pay via UPI
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI",
                instruments: [{ method: "upi" }],
              },
              other: {
                name: "Cards / Netbanking / Wallets",
                instruments: [
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet" },
                ],
              },
            },
            sequence: ["block.upi", "block.other"],
            preferences: { show_default_blocks: false },
          },
        },

        modal: {
          ondismiss:     () => setLoading(false),
          escape:        true,
          confirm_close: true,
        },

        // Razorpay calls this when payment succeeds.
        // Webhook is the source of truth — handler just redirects.
        handler: () => {
          window.location.href = "/dashboard?subscribed=1";
        },
      });

      rzp.on?.("payment.failed", (resp: any) => {
        const reason = resp?.error?.description ?? "Payment was not completed";
        setError(`Payment failed: ${reason}`);
        setLoading(false);
      });

      rzp.open();
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
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
          <p className="text-slate-400 mt-1">Pay ₹99 once · Instant 30-day access</p>
        </div>

        <div className="card p-7">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-white">₹99</div>
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

          {/* UPI highlight */}
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 mb-4 flex items-center gap-3">
            <Smartphone size={22} className="text-blue-400 flex-shrink-0" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <b className="text-blue-300">Pay via UPI in 2 taps</b> — GPay, PhonePe, Paytm, BHIM all supported.
              Cards & netbanking also available.
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4 bg-red-900/20 px-3 py-2 rounded-lg whitespace-pre-wrap">
              {error}
            </p>
          )}

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? "Opening payment…" : "Pay ₹99 — Activate Now"}
          </button>

          <p className="text-center text-slate-600 text-xs mt-4">
            Secured by Razorpay · 256-bit SSL · No card stored
          </p>

          <div className="mt-4 pt-4 border-t border-[#1e293b] text-center">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-400 text-sm">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
