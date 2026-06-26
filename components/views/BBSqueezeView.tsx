"use client";
import { ExternalLink } from "lucide-react";
import CandleHoverCard from "@/components/ui/CandleHoverCard";
const tv = (sym: string) => `https://in.tradingview.com/chart/?symbol=NSE:${sym}`;

export default function BBSqueezeView({ alerts }: { alerts: any[] }) {
  if (!alerts || alerts.length === 0) return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: 48, textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
      <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 14 }}>No BB Squeeze breakouts today.</p>
      <p style={{ color: "var(--ink-4)", margin: "8px 0 0", fontSize: 12 }}>
        Criteria: Close &gt; EMA-5 &amp; BB Middle · Narrow band (≤12%) · RSI 40-75 · ADX &gt; 15
      </p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: "16px 20px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--ink-0)" }}>
          🎯 BB Squeeze Breakout — Coiled Spring Setups
        </h2>
        <p style={{ margin: 0, fontSize: 12, color: "var(--ink-3)" }}>
          Price above Bollinger Band middle + EMA-5 with narrow band — bullish breakout zone
        </p>
      </div>

      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(120px,1.4fr) 80px 70px 60px 60px 80px 90px 60px minmax(80px,1fr)",
          gap: 10, padding: "12px 16px",
          fontSize: 11, fontWeight: 600, color: "var(--ink-3)",
          textTransform: "uppercase", letterSpacing: "0.08em",
          borderBottom: "1px solid var(--line)", background: "var(--bg-2)",
        }}>
          <span>Symbol</span>
          <span style={{ textAlign: "right" }}>LTP</span>
          <span style={{ textAlign: "right" }}>Today</span>
          <span style={{ textAlign: "right" }}>RSI</span>
          <span style={{ textAlign: "right" }}>ADX</span>
          <span style={{ textAlign: "right" }}>BB Width</span>
          <span style={{ textAlign: "right" }}>BB %b</span>
          <span style={{ textAlign: "right" }}>Score</span>
          <span style={{ textAlign: "right" }}>EMA-5 / Mid</span>
        </div>

        {alerts.map((a: any, i: number) => {
          const sym     = a.symbol || a.data?.Symbol;
          const ltp     = a.data?.["LTP"] ?? "—";
          const chg     = parseFloat(String(a.data?.["% Change"] ?? 0));
          const rsi     = a.data?.["RSI"] ?? "—";
          const adx     = a.data?.["ADX"] ?? "—";
          const width   = a.data?.["BB Width %"] ?? "—";
          const pctb    = a.data?.["BB %b"] ?? "—";
          const score   = a.data?.["Score"] ?? "—";
          const ema5    = a.data?.["EMA-5"] ?? "—";
          const mid     = a.data?.["BB Middle"] ?? "—";

          return (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "minmax(120px,1.4fr) 80px 70px 60px 60px 80px 90px 60px minmax(80px,1fr)",
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
              <span style={{ textAlign: "right", fontWeight: 600, color: chg > 0 ? "var(--up)" : "var(--down)" }}>
                {chg > 0 ? "+" : ""}{chg}%
              </span>
              <span style={{ textAlign: "right", color: "var(--accent)", fontWeight: 600 }}>{rsi}</span>
              <span style={{ textAlign: "right", color: "var(--ink-1)" }}>{adx}</span>
              <span style={{ textAlign: "right", color: parseFloat(String(width)) < 6 ? "var(--up)" : "var(--ink-1)", fontWeight: 600 }}>
                {width}%
              </span>
              <span style={{ textAlign: "right", color: "var(--ink-1)" }}>{pctb}</span>
              <span style={{ textAlign: "right", color: "var(--up)", fontWeight: 700 }}>{score}</span>
              <span style={{ textAlign: "right", fontSize: 11, color: "var(--ink-3)" }}>
                ₹{ema5} / ₹{mid}
              </span>
            </div>
          );
        })}
      </div>

      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>
        BB Width &lt; 6% = very tight squeeze (high probability breakout). %b 0.5-0.85 = sweet entry zone.
      </p>
    </div>
  );
}
