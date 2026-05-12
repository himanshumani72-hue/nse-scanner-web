"use client";
import type { Alert } from "@/lib/types";
import Sparkline, { makeSparkline, seedFromSymbol } from "@/components/ui/Sparkline";
import ConfBar from "@/components/ui/ConfBar";
import Tag from "@/components/ui/Tag";

function MoverCard({ a }: { a: Alert }) {
  const d = a.data;
  const chg = parseFloat(String(d["Today Chg %"] ?? 0));
  const conf = parseFloat(String(d["Confidence %"] ?? 50));
  const up = chg >= 0;
  const seed = seedFromSymbol(a.symbol);
  const spark = makeSparkline(36, seed, up ? 0.7 : -0.7, 1.0);
  const color = up ? "var(--up)" : "var(--down)";
  const cat = String(d["Catalyst Type"] ?? "");

  return (
    <div style={{ background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 14, cursor: "pointer", transition: "border-color .15s ease" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--line-2)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--line)")}>
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <SymCell sym={a.symbol} name={String(d["Sector"] ?? "")} />
        <div style={{ textAlign: "right" }}>
          <div className="num" style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-0)", letterSpacing: "-0.01em" }}>
            ₹{Number(d["LTP"] ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <Pct v={chg} />
        </div>
      </div>
      {/* Sparkline */}
      <div style={{ width: "100%" }}>
        <Sparkline data={spark} w={320} h={48} color={color} stroke={1.5} />
      </div>
      {/* Bottom row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Tag tone={cat === "High" ? "up" : cat === "Medium" ? "warn" : "info"}>{cat || "Soft"}</Tag>
          <Tag>{String(d["Est. Move"] ?? "5-10%")}</Tag>
          {d["Vol/Avg"] && <Tag>Vol {d["Vol/Avg"]}x</Tag>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Conf</span>
          <ConfBar value={conf} color={conf >= 80 ? "var(--up)" : conf >= 65 ? "var(--warn)" : "var(--accent)"} w={56} />
        </div>
      </div>
      {/* Position sizing */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, paddingTop: 8, borderTop: "1px solid var(--line)" }}>
        <Stat label="Stop Loss"  value={`₹${d["Stop Loss"] ?? "—"}`}  color="var(--down)" />
        <Stat label="Target"     value={`₹${d["Target"] ?? "—"}`}     color="var(--up)" />
        <Stat label="Qty"        value={String(d["Qty"] ?? "—")} />
        <Stat label="Risk ₹"     value={`₹${d["Risk ₹"] ?? "—"}`}    color="var(--warn)" />
      </div>
      {/* Why this stock — full reason breakdown */}
      <div style={{ borderTop: "1px solid var(--line)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
        {String(d["Trigger Reason"] ?? "").split("|").filter(Boolean).map((part, i) => {
          const s = part.trim();
          const isWarning = s.startsWith("⚠️");
          const isPrimary = i === 0;
          return (
            <p key={i} style={{ margin: 0, fontSize: isPrimary ? 11.5 : 10.5,
              color: isWarning ? "var(--warn)" : isPrimary ? "var(--ink-1)" : "var(--ink-3)",
              lineHeight: 1.4, fontWeight: isPrimary ? 500 : 400 }}>
              {s}
            </p>
          );
        })}
        {d["Top Catalyst"] && !String(d["Trigger Reason"] ?? "").includes("📰") && (
          <p style={{ margin: 0, fontSize: 10.5, color: "var(--ink-4)", lineHeight: 1.4, fontStyle: "italic" }}>
            {String(d["Top Catalyst"]).slice(0, 100)}
          </p>
        )}
      </div>
    </div>
  );
}

export default function BigMoversView({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) return (
    <Empty msg="No Big Mover alerts today. Scanner runs at 9:20 AM & 3:00 PM IST." />
  );
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <SectionHdr icon="⚡" title="Big Mover Alerts" count={alerts.length} hint="Volume surge + catalyst • intraday & swing" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 12 }}>
        {alerts.map(a => <MoverCard key={a.id} a={a} />)}
      </div>
    </div>
  );
}

// ── Shared helpers ────────────────────────────────────────────
export function SymCell({ sym, name }: { sym: string; name?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 30, height: 30, borderRadius: 7, flexShrink: 0, background: "linear-gradient(135deg, #1a2332 0%, #0f1622 100%)", border: "1px solid var(--line)", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 600, color: "var(--ink-1)", letterSpacing: "0.02em", fontFamily: "var(--mono)" }}>
        {sym.slice(0, 2)}
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="num" style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)", letterSpacing: "-0.01em" }}>{sym}</div>
        {name && <div style={{ fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>{name}</div>}
      </div>
    </div>
  );
}

export function Pct({ v }: { v: number }) {
  const up = v >= 0;
  const c = up ? "var(--up)" : "var(--down)";
  return (
    <span className="num" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: c, fontSize: 12, fontWeight: 500 }}>
      {up ? "▲" : "▼"} {up ? "+" : ""}{v.toFixed(2)}%
    </span>
  );
}

export function Stat({ label, value, color = "var(--ink-1)" }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 6 }}>
      <span style={{ fontSize: 9.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
      <span className="num" style={{ fontSize: 12, fontWeight: 500, color, letterSpacing: "-0.01em" }}>{value}</span>
    </div>
  );
}

export function SectionHdr({ icon, title, count, hint }: { icon: string; title: string; count?: number; hint?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <h3 style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-1)" }}>
        {icon} {title}
      </h3>
      {count !== undefined && <span className="num" style={{ fontSize: 11, color: "var(--ink-3)", padding: "2px 7px", border: "1px solid var(--line)", borderRadius: 999 }}>{count}</span>}
      {hint && <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{hint}</span>}
    </div>
  );
}

export function Empty({ msg }: { msg: string }) {
  return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: "64px 32px", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>📭</div>
      <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 13 }}>{msg}</p>
    </div>
  );
}
