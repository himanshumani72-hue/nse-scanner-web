"use client";
import type { Alert } from "@/lib/types";
import { SectionHdr, Empty, Pct } from "./BigMoversView";
import { ExternalLink } from "lucide-react";

function tv(symbol: string) {
  return `https://www.tradingview.com/chart/?symbol=NSE:${symbol}`;
}

export default function MomentumView({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) return (
    <Empty msg="No Momentum (Cannon) signals today. Scanner runs after market close with NSE delivery data." />
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHdr
        icon="🚀"
        title="Momentum Strategy — Cannon Scan"
        count={alerts.length}
        hint="Higher Delivery + Above Prev High + Above Week High + RSI crossed 70 · Institutional momentum breakouts"
      />

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 11, color: "var(--ink-3)", padding: "0 2px" }}>
        <span>✅ <b style={{ color: "var(--up)" }}>All 5 conditions met</b> — institutional buying + RSI momentum + price breakout</span>
        <span>🚫 <b style={{ color: "var(--warn)" }}>Avoid if also in Boomerang scan</b> — conflicting signals</span>
      </div>

      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(130px,1.5fr) 80px 70px 65px 55px 65px 65px 80px 80px 80px minmax(160px,2fr)",
          gap: 8, padding: "10px 14px",
          color: "var(--ink-3)", fontSize: 10.5,
          textTransform: "uppercase", letterSpacing: "0.10em",
          borderBottom: "1px solid var(--line)", background: "var(--bg-2)"
        }}>
          <span>Symbol</span>
          <span style={{ textAlign: "right" }}>LTP</span>
          <span style={{ textAlign: "right" }}>Today %</span>
          <span style={{ textAlign: "right" }}>1M %</span>
          <span style={{ textAlign: "right" }}>RSI</span>
          <span style={{ textAlign: "right" }}>Delivery</span>
          <span style={{ textAlign: "right" }}>Volume</span>
          <span style={{ textAlign: "right" }}>Stop Loss</span>
          <span style={{ textAlign: "right" }}>Target 1</span>
          <span style={{ textAlign: "right" }}>Target 2</span>
          <span>Why Bullish</span>
        </div>

        {alerts.map((a, i) => {
          const d = a.data;
          const todayChg = parseFloat(String(d["Today Chg %"] ?? 0));
          const rsi      = parseFloat(String(d["RSI"] ?? 0));
          const score    = parseInt(String(d["Score"] ?? 0));
          const deliv    = parseFloat(String(d["Delivery %"] ?? 0));
          const vol      = parseFloat(String(d["Vol/Avg"] ?? 0));
          const isEven   = i % 2 === 0;
          const why      = String(d["Why Bullish"] ?? "");
          const hasConflict = why.includes("Conflict");

          const scoreBg    = score >= 12 ? "rgba(43,208,122,.15)" : score >= 9 ? "rgba(243,181,74,.12)" : "transparent";
          const scoreColor = score >= 12 ? "var(--up)" : score >= 9 ? "var(--warn)" : "var(--ink-2)";

          return (
            <div key={a.id}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(130px,1.5fr) 80px 70px 65px 55px 65px 65px 80px 80px 80px minmax(160px,2fr)",
                gap: 8, padding: "10px 14px", alignItems: "center",
                borderBottom: i < alerts.length - 1 ? "1px solid var(--line)" : "none",
                background: isEven ? "var(--bg-2)" : "transparent",
                cursor: "pointer", transition: "background .12s ease",
                borderLeft: hasConflict ? "3px solid var(--warn)" : "none",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={e => (e.currentTarget.style.background = isEven ? "var(--bg-2)" : "transparent")}>

              {/* Symbol */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                  background: "linear-gradient(135deg,#1a2332,#0f1622)",
                  border: "1px solid var(--line)", display: "grid", placeItems: "center",
                  fontSize: 9, fontWeight: 600, color: "var(--ink-2)", fontFamily: "var(--mono)"
                }}>
                  {a.symbol.slice(0, 2)}
                </div>
                <a href={tv(a.symbol)} target="_blank" rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--ink-0)", textDecoration: "none", fontWeight: 600, fontSize: 13, fontFamily: "var(--mono)" }}>
                  {a.symbol} <ExternalLink size={10} style={{ color: "var(--ink-4)" }} />
                </a>
              </div>

              <span className="num" style={{ textAlign: "right", fontSize: 12.5, color: "var(--ink-0)" }}>
                ₹{Number(d["LTP"] ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>

              <span className="num" style={{ textAlign: "right", fontSize: 12, fontWeight: 600, color: todayChg >= 0 ? "var(--up)" : "var(--down)" }}>
                {todayChg >= 0 ? "+" : ""}{todayChg.toFixed(2)}%
              </span>

              <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--ink-2)" }}>
                {parseFloat(String(d["1M Chg %"] ?? 0)).toFixed(1)}%
              </span>

              <span className="num" style={{
                textAlign: "right", fontSize: 12, fontWeight: 600,
                color: rsi >= 75 ? "var(--warn)" : rsi >= 68 ? "var(--up)" : "var(--ink-3)"
              }}>
                {rsi.toFixed(0)}
              </span>

              <span className="num" style={{ textAlign: "right", fontSize: 11, color: deliv >= 40 ? "var(--up)" : "var(--ink-3)" }}>
                {deliv.toFixed(1)}%
              </span>

              <span className="num" style={{ textAlign: "right", fontSize: 11, color: vol >= 3 ? "var(--up)" : "var(--ink-2)" }}>
                {vol.toFixed(1)}x
              </span>

              <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--down)" }}>
                ₹{d["Stop Loss"]}
              </span>

              <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--up)" }}>
                ₹{d["Target 1"]}
              </span>

              <span className="num" style={{ textAlign: "right", fontSize: 12, fontWeight: 700, color: "var(--up)" }}>
                ₹{d["Target 2"]}
              </span>

              {/* Why Bullish */}
              <div style={{ fontSize: 10.5, lineHeight: 1.4 }}>
                {why.split("|").filter(Boolean).map((part, j) => {
                  const s = part.trim();
                  const isWarn = s.startsWith("⚠️");
                  return (
                    <p key={j} style={{ margin: 0, color: isWarn ? "var(--warn)" : j === 0 ? "var(--ink-1)" : "var(--ink-3)" }}>
                      {s}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)", paddingLeft: 2 }}>
        ⚠️ Always confirm on TradingView chart before entering. Use Stop Loss shown above. R:R should be ≥ 2:1 before entering.
      </p>
    </div>
  );
}
