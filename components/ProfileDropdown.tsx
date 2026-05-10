"use client";
import { useState, useRef, useEffect } from "react";
import { User, CreditCard, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Props {
  email: string;
  subStatus: string;
  daysLeft: number | null;
}

export default function ProfileDropdown({ email, subStatus, daysLeft }: Props) {
  const [open, setOpen] = useState(false);
  const ref  = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const name = email.split("@")[0];
  const initial = name[0]?.toUpperCase() ?? "U";

  const subLabel = subStatus === "active" ? "Active ✓"
    : subStatus === "trial" ? `Trial — ${daysLeft}d left`
    : "Expired";
  const subColor = subStatus === "active" ? "text-green-400"
    : subStatus === "trial" && (daysLeft ?? 30) > 5 ? "text-yellow-400"
    : "text-red-400";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
          {initial}
        </div>
        <span className="text-slate-300 text-sm hidden md:inline max-w-[140px] truncate">{name}</span>
        <ChevronDown size={14} className="text-slate-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-64 rounded-xl shadow-2xl z-50 overflow-hidden"
             style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          {/* Profile header */}
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {initial}
              </div>
              <div>
                <div className="font-semibold text-white text-sm capitalize">{name}</div>
                <div className="text-slate-500 text-xs">{email}</div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="py-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 transition-colors text-left">
              <User size={15} className="text-slate-500" />
              <div>
                <div>Profile & Details</div>
                <div className={`text-xs ${subColor}`}>Subscription: {subLabel}</div>
              </div>
            </button>

            <Link href="/billing" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 transition-colors">
              <CreditCard size={15} className="text-slate-500" />
              <div>
                <div>Subscription & Billing</div>
                <div className="text-xs text-slate-500">₹99/month</div>
              </div>
            </Link>

            <div className="border-t my-1" style={{ borderColor: "var(--border)" }} />

            <button onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition-colors">
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
