"use client";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Props {
  email: string;
  subStatus: string;
  daysLeft: number | null;
}

export default function ProfileDropdown({ email, subStatus, daysLeft }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const name    = email.split("@")[0];
  const initial = name[0]?.toUpperCase() ?? "U";
  const subLabel = subStatus === "active" ? "Active ✓"
    : subStatus === "trial" ? `Trial — ${daysLeft}d left`
    : "Expired";
  const subColor = subStatus === "active" ? "#2bd07a"
    : subStatus === "trial" && (daysLeft ?? 30) > 5 ? "#f3b54a"
    : "#ff5d6c";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger button */}
      <button onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 10px 4px 4px", border: "1px solid var(--line)", borderRadius: 999, background: open ? "var(--bg-2)" : "transparent", cursor: "pointer", transition: "background .12s ease" }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-2)")}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = "transparent"; }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#5b8cff,#a87bff)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, color: "white" }}>
          {initial}
        </div>
        <span style={{ fontSize: 12, color: "var(--ink-1)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {name}
        </span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="var(--ink-3)">
          <path d={open ? "M2 7 L5 3 L8 7" : "M2 3 L5 7 L8 3"} stroke="var(--ink-3)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 260, borderRadius: 12, zIndex: 999, overflow: "hidden", background: "#111820", border: "1px solid var(--line-2)", boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)" }}>

          {/* Profile header */}
          <div style={{ padding: "14px 16px", background: "linear-gradient(135deg, #0d1420 0%, #111820 100%)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#5b8cff,#a87bff)", display: "grid", placeItems: "center", fontSize: 15, fontWeight: 700, color: "white", flexShrink: 0 }}>
                {initial}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#f3f5f8", textTransform: "capitalize" }}>{name}</div>
                <div style={{ fontSize: 11, color: "#535e6e", marginTop: 1 }}>{email}</div>
              </div>
            </div>
            {/* Subscription badge */}
            <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: subColor, display: "inline-block" }}/>
              <span style={{ fontSize: 11, fontWeight: 500, color: subColor }}>{subLabel}</span>
            </div>
          </div>

          {/* Menu items */}
          <div style={{ padding: "6px 0" }}>
            <MenuItem icon="👤" label="Profile & Details" sub="Manage your account" onClick={() => setOpen(false)} />
            <Link href="/billing" onClick={() => setOpen(false)} style={{ textDecoration: "none" }}>
              <MenuItem icon="💳" label="Subscription & Billing" sub="₹99/month · Cancel anytime" onClick={() => {}} />
            </Link>
          </div>

          {/* Sign out */}
          <div style={{ padding: "6px 0 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button onClick={signOut}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "9px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", transition: "background .12s ease" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,93,108,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <span style={{ fontSize: 16 }}>↩</span>
              <span style={{ fontSize: 13, color: "#ff5d6c", fontWeight: 500 }}>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, sub, onClick }: { icon: string; label: string; sub: string; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "9px 16px", background: hover ? "rgba(255,255,255,0.04)" : "transparent", border: "none", cursor: "pointer", textAlign: "left", transition: "background .12s ease" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 13, color: "#c8d0db", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color: "#535e6e", marginTop: 1 }}>{sub}</div>
      </div>
    </button>
  );
}
