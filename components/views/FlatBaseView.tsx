"use client";
import { ExternalLink } from "lucide-react";
import CandleHoverCard from "@/components/ui/CandleHoverCard";
const tv = (sym: string) => `https://in.tradingview.com/chart/?symbol=NSE:${sym}`;

export default function FlatBaseView({ alerts, direction }: { alerts: any[]; direction: "up" | "down" }) {
  const isUp = direction === "up";
  const title = isUp ? "Flat Base Breakout ↑" : "Flat Base Breakdown ↓";
  const emoji = isUp ? "📦" : "📉";
  const accent = isUp ? "var(--up)" : "var(--down)";
  const description = isUp
    ? "Stock in tight 60-120 day range, EMA-51 flat, NOW breaking ABOVE range top with volume. Price ≤5% above EMA-51 (fresh entry, not extended)."
    : "Stock in tight 60-120 day range, EMA-51 flat, NOW breaking BELOW range bottom with volume. Price ≥-5% below EMA-51 (fresh short, not crashed yet).";

  if (!alerts || alerts.length === 0) return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: 48, textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{emoji}</div>
      <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 14 }}>No {title} setups today.</p>
      <p style={{ color: "var(--ink-4)", margin: "8px 0 0", fontSize: 12, maxWidth: 540, marginInline: "auto" }}>{description}</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: "16px 20px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--ink-0)" }}>
          {emoji} {title} — Fresh Breakout (At Entry Point)
        </h2>
        <p style={{ margin: 0, fontSize: 12, color: "var(--ink-3)" }}>{description}</p>
      </div>

      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(110px,1.2fr) 70px 60px 70px 70px 70px 90px 60px 60px",
          gap: 10, padding: "12px 16px",
          fontSize: 11, fontWeight: 600, color: "var(--ink-3)",
          textTransform: "uppercase", letterSpacing: "0.08em",
          borderBottom: "1px solid var(--line)", background: "var(--bg-2)",
        }}>
          <span>Symbol</span>
          <span style={{ textAlign: "right" }}>LTP</span>
          <span style={{ textAlign: "right" }}>Today</span>
          <span style={{ textAlign: "right" }}>Base Hi</span>
          <span style={{ textAlign: "right" }}>Base Lo</span>
          <span style={{ textAlign: "right" }}>Range</span>
          <span style={{ textAlign: "right" }}>{isUp ? "Breakout" : "Breakdown"}</span>
          <span style={{ textAlign: "right" }}>EMA-51</span>
          <span style={{ textAlign: "right" }}>Score</span>
        </div>

        {alerts.map((a: any, i: number) => {
          const sym = a.symbol || a.data?.Symbol;
          const ltp = a.data?.["LTP"] ?? "—";
          const chg = parseFloat(String(a.data?.["Today %"] ?? 0));
          const baseHi = a.data?.["Base High"] ?? "—";
          const baseLo = a.data?.["Base Low"] ?? "—";
          const range = a.data?.["Range %"] ?? "—";
          const brk   = a.data?.[isUp ? "Breakout %" : "Breakdown %"] ?? "—";
          const pctEma = a.data?.["% vs EMA-51"] ?? "—";
          const score = a.data?.["Score"] ?? "—";

          return (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "minmax(110px,1.2fr) 70px 60px 70px 70px 70px 90px 60px 60px",
              gap: 10, padding: "12px 16px", alignItems: "center",
              borderBottom: i < alerts.length - 1 ? "1px solid var(--line)" : "none",
              background: i % 2 === 0 ? "var(--bg-2)" : "transparent",
              fontSize: 13,
            }}>
              <CandleHoverCard symbol={sym}>
                <a href={tv(sym)} target="_blank" rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 700, color: "var(--ink-0)", textDecoration: "none" }}>
                  {sym} <ExternalLink size={11} style={{ opacity: 0.5 }} />
                </a>
              </CandleHoverCard>
              <span style={{ textAlign: "right", fontWeight: 600, color: "var(--ink-0)" }}>₹{ltp}</span>
              <span style={{ textAlign: "right", fontWeight: 600, color: chg >= 0 ? "var(--up)" : "var(--down)" }}>
                {chg > 0 ? "+" : ""}{chg}%
              </span>
              <span style={{ textAlign: "right", color: "var(--ink-2)" }}>₹{baseHi}</span>
              <span style={{ textAlign: "right", color: "var(--ink-2)" }}>₹{baseLo}</span>
              <span style={{ textAlign: "right", color: "var(--accent)" }}>{range}%</span>
              <span style={{ textAlign: "right", color: accent, fontWeight: 600 }}>{isUp ? "+" : ""}{brk}%</span>
              <span style={{ textAlign: "right", color: parseFloat(String(pctEma)) > 0 ? "var(--up)" : "var(--down)" }}>
                {parseFloat(String(pctEma)) > 0 ? "+" : ""}{pctEma}%
              </span>
              <span style={{ textAlign: "right", color: accent, fontWeight: 700 }}>{score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
