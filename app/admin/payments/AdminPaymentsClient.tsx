"use client";
import { useState } from "react";
import { Check, X, ExternalLink } from "lucide-react";

interface Payment {
  id: number;
  user_id: string;
  user_email: string | null;
  amount: number;
  utr: string;
  upi_app: string | null;
  notes: string | null;
  status: "pending" | "verified" | "rejected";
  submitted_at: string;
  verified_at: string | null;
  verified_by: string | null;
  rejection_reason: string | null;
}

export default function AdminPaymentsClient({ initial, adminEmail }: { initial: Payment[]; adminEmail: string }) {
  const [payments, setPayments] = useState<Payment[]>(initial);
  const [filter,   setFilter]   = useState<"pending" | "verified" | "rejected" | "all">("pending");
  const [busy,     setBusy]     = useState<number | null>(null);
  const [toast,    setToast]    = useState<string>("");

  const filtered = filter === "all" ? payments : payments.filter(p => p.status === filter);
  const counts = {
    pending:  payments.filter(p => p.status === "pending").length,
    verified: payments.filter(p => p.status === "verified").length,
    rejected: payments.filter(p => p.status === "rejected").length,
  };

  async function act(id: number, action: "verify" | "reject", reason?: string) {
    setBusy(id);
    try {
      const res = await fetch("/api/upi/verify", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ payment_id: id, action, reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast(`Error: ${data.error}`);
        setTimeout(() => setToast(""), 3000);
      } else {
        // Update local state
        setPayments(prev => prev.map(p => p.id === id ? {
          ...p,
          status:           action === "verify" ? "verified" : "rejected",
          verified_at:      new Date().toISOString(),
          verified_by:      adminEmail,
          rejection_reason: reason ?? null,
        } : p));
        setToast(data.message);
        setTimeout(() => setToast(""), 3000);
      }
    } catch (e: any) {
      setToast(`Error: ${e.message}`);
      setTimeout(() => setToast(""), 3000);
    }
    setBusy(null);
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-200 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">UPI Payment Verification</h1>
          <span className="text-xs text-slate-500">Admin: {adminEmail}</span>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["pending","verified","rejected","all"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? "bg-blue-600 text-white" : "bg-[#0f172a] text-slate-400 hover:text-white"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "all" && (
                <span className="ml-2 text-xs opacity-70">
                  {(counts as any)[f]}
                </span>
              )}
            </button>
          ))}
        </div>

        {toast && (
          <div className="mb-4 px-4 py-2 bg-blue-900/30 border border-blue-700/30 rounded-lg text-sm">
            {toast}
          </div>
        )}

        {/* Table */}
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_180px_120px_100px_90px_180px] gap-3 px-4 py-3 text-[10px] uppercase tracking-wider text-slate-500 border-b border-[#1e293b] bg-[#0a0f1e]">
            <div>User Email</div>
            <div>UTR</div>
            <div>App</div>
            <div className="text-right">Amount</div>
            <div>Status</div>
            <div className="text-right">Action / Submitted</div>
          </div>

          {filtered.length === 0 && (
            <div className="px-4 py-10 text-center text-slate-500 text-sm">No payments in this view.</div>
          )}

          {filtered.map(p => (
            <div key={p.id}
              className="grid grid-cols-[1fr_180px_120px_100px_90px_180px] gap-3 px-4 py-3 items-center border-b border-[#1e293b] text-sm last:border-0">
              <div className="truncate">
                <div className="text-white">{p.user_email || "—"}</div>
                {p.notes && <div className="text-xs text-slate-500 truncate">📝 {p.notes}</div>}
              </div>
              <div className="font-mono text-xs text-slate-300 truncate">{p.utr}</div>
              <div className="text-xs text-slate-400">{p.upi_app}</div>
              <div className="text-right text-white font-medium">₹{p.amount}</div>
              <div>
                {p.status === "pending"  && <span className="px-2 py-1 rounded text-xs bg-yellow-900/30 text-yellow-300 border border-yellow-700/30">Pending</span>}
                {p.status === "verified" && <span className="px-2 py-1 rounded text-xs bg-green-900/30 text-green-300 border border-green-700/30">Verified</span>}
                {p.status === "rejected" && <span className="px-2 py-1 rounded text-xs bg-red-900/30 text-red-300 border border-red-700/30">Rejected</span>}
              </div>
              <div className="flex items-center justify-end gap-2">
                {p.status === "pending" ? (
                  <>
                    <button
                      onClick={() => act(p.id, "verify")}
                      disabled={busy === p.id}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-xs font-medium"
                    >
                      <Check size={12} /> Verify
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt("Reason for rejection:") || "";
                        if (reason) act(p.id, "reject", reason);
                      }}
                      disabled={busy === p.id}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-medium"
                    >
                      <X size={12} /> Reject
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] text-slate-500">
                    {new Date(p.submitted_at).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Helper card */}
        <div className="mt-6 bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 text-sm text-slate-400 leading-relaxed">
          <h3 className="font-medium text-white mb-2">How to verify a payment</h3>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>Open your bank app (or UPI app inbox) and find the ₹99 incoming transaction</li>
            <li>Match the <span className="font-mono text-white">UTR</span> column above with the transaction reference in your bank</li>
            <li>If match: click <b className="text-green-400">Verify</b> — user becomes Active for 30 days instantly</li>
            <li>If no match or wrong amount: click <b className="text-red-400">Reject</b> with a reason</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
