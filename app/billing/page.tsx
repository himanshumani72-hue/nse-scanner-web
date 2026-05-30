"use client";
import { useState } from "react";
import { TrendingUp, CheckCircle, CreditCard } from "lucide-react";
import Link from "next/link";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleSubscribe() {
    setLoading(true); setError("");

    // Validate client-side env var exists BEFORE making API call
    const pubKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!pubKey) {
      setError("Payment system not fully configured (NEXT_PUBLIC_RAZORPAY_KEY_ID missing). Contact support.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/razorpay/create-subscription", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.hint
          ? `${data.error}\n\nHint: ${data.hint}`
          : data.error || "Failed to create subscription";
        setError(msg);
        setLoading(false);
        return;
      }

      // Load Razorpay checkout (idempotent — re-add only if not already loaded)
      const ensureScript = () => new Promise<void>((resolve, reject) => {
        if ((window as any).Razorpay) { resolve(); return; }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
        document.body.appendChild(script);
      });

      try { await ensureScript(); }
      catch (e: any) {
        setError(e.message || "Failed to load Razorpay. Check your network connection.");
        setLoading(false);
        return;
      }

      const rzp = new (window as any).Razorpay({
        key:             pubKey,
        subscription_id: data.subscription_id,
        name:            "NSE Scanner Pro",
        description:     "₹99/month — NSE stock alerts subscription",
        image:           "/logo.png",
        prefill:         { email: data.email },
        theme:           { color: "#3b82f6" },
        modal: {
          // Reset loading state if user closes checkout without paying
          ondismiss: () => setLoading(false),
          escape:    true,
          confirm_close: true,
        },
        handler: async () => {
          // Don't trust client redirect — verify the payment status with our backend.
          // The webhook is the source of truth, but this gives instant UI feedback.
          setError("Verifying payment …");
          try {
            const vres  = await fetch("/api/razorpay/verify-subscription", { method: "POST" });
            const vdata = await vres.json();
            if (vres.ok && (vdata.status === "active")) {
              window.location.href = "/dashboard?subscribed=1";
            } else {
              // Payment may still be processing — webhook will update soon
              window.location.href = "/dashboard?subscribed=pending";
            }
          } catch {
            window.location.href = "/dashboard?subscribed=pending";
          }
        },
      });

      rzp.on?.("payment.failed", (resp: any) => {
        setError(`Payment failed: ${resp?.error?.description ?? "unknown error"}`);
        setLoading(false);
      });

      rzp.open();
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-white">Activate subscription</h1>
          <p className="text-slate-400 mt-1">Your free trial has ended</p>
        </div>

        <div className="card p-7">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-white">₹99</div>
            <div className="text-slate-400 text-sm mt-1">per month • cancel anytime</div>
          </div>

          <ul className="space-y-2.5 mb-7">
            {[
              "500+ NSE stocks scanned daily",
              "Big Movers pre-move detection",
              "Chart Pattern + W-Pattern alerts",
              "ATR position sizing per alert",
              "Real-time Supabase updates",
              "9:20 AM & 3:00 PM IST scans",
            ].map(f => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                <CheckCircle size={15} className="text-green-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          {error && (
            <p className="text-red-400 text-sm mb-4 bg-red-900/20 px-3 py-2 rounded-lg whitespace-pre-wrap">
              {error}
            </p>
          )}

          <button
            onClick={handleSubscribe} disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard size={18} />
            {loading ? "Loading payment…" : "Subscribe — ₹99/month"}
          </button>

          <p className="text-center text-slate-600 text-xs mt-4">
            Secured by Razorpay • UPI / Cards / Net Banking supported
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
