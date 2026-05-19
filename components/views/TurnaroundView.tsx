"use client";
import type { Alert } from "@/lib/types";
import { SectionHdr, Empty } from "./BigMoversView";
import { ExternalLink } from "lucide-react";

function tv(symbol: string) {
  return `https://www.tradingview.com/chart/?symbol=NSE:${symbol}`;
}

const SECTOR_COLORS: Record<string, string> = {
  "AI/Tech":     "var(--accent-2)",
  "Energy":      "#4ade80",
  "Oil & Gas":   "#fb923c",
  "High Growth": "#a78bfa",
  "General":     "var(--ink-3)",
};

const SECTOR_BG: Record<string, string> = {
  "AI/Tech":     "rgba(91,140,255,.12)",
  "Energy":      "rgba(74,222,128,.10)",
  "Oil & Gas":   "rgba(251,146,60,.10)",
  "High Growth": "rgba(167,139,250,.10)",
  "General":     "var(--bg-2)",
};

export default function TurnaroundView({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) return (
    <Empty msg="No Higher-Low Double Bottom patterns found. Scanner runs after market close." />
  );

  // Split: priority sectors first
  const priority = alerts.filter(a => a.data["Sector Priority"] !== "General");
  const general  = alerts.filter(a => a.data["Sector Priority"] === "General");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Pattern explanation ── */}
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px 18px" }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h3 style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "var(--ink-0)" }}>
              📐 Higher-Low Double Bottom — Turnaround Pattern
            </h3>
            <p style={{ margin: 0, fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.6 }}>
              Stock was in downtrend → made <b style={{ color: "var(--ink-1)" }}>Bottom 1</b> (panic low) →
              partial recovery → made <b style={{ color: "var(--up)" }}>Bottom 2 (higher than B1)</b> = buyers came in earlier →
              now recovering. Break above EMA-51 confirms the reversal.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 11, alignItems: "center" }}>
            {Object.entries(SECTOR_COLORS).filter(([k]) => k !== "General").map(([label, color]) => (
              <span key={label} style={{ padding: "3px 10px", borderRadius: 999, background: SECTOR_BG[label], color, border: `1px solid ${color}40`, fontWeight: 600 }}>
                {label === "AI/Tech" ? "🤖" : label === "Energy" ? "⚡" : label === "Oil & Gas" ? "🛢️" : "🚀"} {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Priority sectors ── */}
      {priority.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHdr icon="⭐" title="Priority Sectors — AI · Energy · Oil & Gas · High Growth" count={priority.length}
            hint="These sectors get first preference — AI, Energy, Oil & Gas, High Growth capex themes" />
          <StockGrid alerts={priority} />
        </div>
      )}

      {/* ── General ── */}
      {general.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHdr icon="📐" title={priority.length > 0 ? "Other Sectors" : "Higher-Low Double Bottom Patterns"} count={general.length}
            hint="Turnaround patterns in other sectors" />
          <StockGrid alerts={general} />
        </div>
      )}

      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)", paddingLeft: 2 }}>
        ⚠️ Confirm on TradingView Daily chart before buying. Wait for price to break above EMA-51 with volume. Use Stop Loss shown.
      </p>
    </div>
  );
}

function StockGrid({ alerts }: { alerts: Alert[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 12 }}>
      {alerts.map((a) => <StockCard key={a.id} a={a} />)}
    </div>
  );
}

function StockCard({ a }: { a: Alert }) {
  const d = a.data;
  const sector   = String(d["Sector Priority"] ?? "General");
  const sColor   = SECTOR_COLORS[sector] || "var(--ink-3)";
  const sBg      = SECTOR_BG[sector] || "var(--bg-2)";
  const pctEma   = parseFloat(String(d["% from EMA51"] ?? 0));
  const hiLo     = parseFloat(String(d["Higher Low %"] ?? 0));
  const rec      = parseFloat(String(d["Recovery %"] ?? 0));
  const rsi      = parseFloat(String(d["RSI"] ?? 50));
  const todayChg = parseFloat(String(d["Today Chg %"] ?? 0));
  const score    = parseInt(String(d["Score"] ?? 0));
  const isPrime  = sector !== "General";

  return (
    <div style={{
      background: "var(--bg-1)",
      border: `1px solid ${isPrime ? `${sColor}40` : "var(--line)"}`,
      borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 12,
      boxShadow: isPrime ? `0 0 0 1px ${sColor}15 inset` : "none",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: sBg, border: `1px solid ${sColor}40`, display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, color: sColor, fontFamily: "var(--mono)" }}>
            {a.symbol.slice(0, 2)}
          </div>
          <div>
            <a href={tv(a.symbol)} target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--ink-0)", textDecoration: "none", fontWeight: 700, fontSize: 14, fontFamily: "var(--mono)" }}>
              {a.symbol} <ExternalLink size={10} style={{ color: "var(--ink-4)" }} />
            </a>
            <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 999, background: sBg, color: sColor, border: `1px solid ${sColor}40`, fontWeight: 600 }}>
              {sector === "AI/Tech" ? "🤖" : sector === "Energy" ? "⚡" : sector === "Oil & Gas" ? "🛢️" : sector === "High Growth" ? "🚀" : ""} {sector}
            </span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="num" style={{ fontSize: 17, fontWeight: 700, color: "var(--ink-0)" }}>₹{d["LTP"]}</div>
          <div className="num" style={{ fontSize: 12, color: todayChg >= 0 ? "var(--up)" : "var(--down)", fontWeight: 600 }}>
            {todayChg >= 0 ? "▲ +" : "▼ "}{todayChg.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Pattern visualization */}
      <div style={{ background: "var(--bg-2)", borderRadius: 10, padding: "10px 12px" }}>
        <div style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Pattern</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
          <span style={{ color: "var(--down)", fontWeight: 600 }}>B1 ₹{d["Bottom 1"]}</span>
          <span style={{ color: "var(--ink-4)" }}>→</span>
          <span style={{ color: "var(--up)", fontWeight: 700 }}>B2 ₹{d["Bottom 2"]}</span>
          <span style={{ padding: "1px 7px", borderRadius: 999, background: "rgba(43,208,122,.12)", color: "var(--up)", fontSize: 10.5, fontWeight: 700 }}>
            +{hiLo.toFixed(0)}% higher ⭐
          </span>
          <span style={{ color: "var(--ink-4)" }}>→</span>
          <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>Now +{rec.toFixed(0)}% recovery</span>
        </div>
      </div>

      {/* EMA-51 bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 8, background: "var(--bg-2)", border: "1px solid var(--line)" }}>
        <span style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>EMA-51</span>
        <div style={{ flex: 1, height: 4, background: "var(--bg-0)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2,
            width: `${Math.min(100, Math.max(0, (pctEma + 20) * 2.5))}%`,
            background: pctEma >= 0 && pctEma <= 5 ? "var(--up)" : pctEma > 5 ? "var(--accent-2)" : "var(--warn)",
          }} />
        </div>
        <span className="num" style={{ fontSize: 11, fontWeight: 700, flexShrink: 0, color: pctEma >= 0 && pctEma <= 5 ? "var(--up)" : pctEma > 0 ? "var(--accent-2)" : "var(--warn)" }}>
          {pctEma >= 0 ? "+" : ""}{pctEma.toFixed(1)}%
        </span>
        <span style={{ fontSize: 9.5, color: "var(--ink-4)", flexShrink: 0 }}>₹{d["EMA51"]}</span>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, paddingTop: 4, borderTop: "1px solid var(--line)" }}>
        {[
          { label: "RSI", value: rsi.toFixed(0), color: rsi > 70 ? "var(--warn)" : rsi > 50 ? "var(--up)" : "var(--ink-2)" },
          { label: "Stop Loss", value: `₹${d["Stop Loss"]}`, color: "var(--down)" },
          { label: "Target 1", value: `₹${d["Target 1"]}`, color: "var(--up)" },
          { label: "Score", value: String(score), color: score >= 12 ? "var(--up)" : score >= 9 ? "var(--warn)" : "var(--ink-2)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 9.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
            <span className="num" style={{ fontSize: 12, fontWeight: 600, color }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
