"use client";
import { ExternalLink } from "lucide-react";
import CandleHoverCard from "@/components/ui/CandleHoverCard";
const tv = (sym: string) => `https://in.tradingview.com/chart/?symbol=NSE:${sym}`;

export default function Breakout1DView({ alerts }: { alerts: any[] }) {
  if (!alerts || alerts.length === 0) return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: 48, textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📈</div>
      <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 14 }}>No 1-Day Breakouts today.</p>
      <p style={{ color: "var(--ink-4)", margin: "8px 0 0", fontSize: 12 }}>
        Criteria: % Change&gt;0 · Vol expansion · RSI 45-80 · BB %b&gt;0.6 · ADX&gt;18 · MACD Bullish
      </p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: "16px 20px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--ink-0)" }}>
          📈 1-Day Stock Breakouts — Daily Momentum Surge
        </h2>
        <p style={{ margin: 0, fontSize: 12, color: "var(--ink-3)" }}>
          Stocks breaking out on strong volume with RSI, BB %b, ADX &amp; MACD confirmation
        </p>
      </div>

      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(110px,1.2fr) 70px 65px 55px 55px 65px 55px 70px 50px",
          gap: 8, padding: "12px 14px",
          fontSize: 11, fontWeight: 600, color: "var(--ink-3)",
          textTransform: "uppercase", letterSpacing: "0.08em",
          borderBottom: "1px solid var(--line)", background: "var(--bg-2)",
        }}>
          <span>Symbol</span>
          <span style={{ textAlign: "right" }}>LTP</span>
          <span style={{ textAlign: "right" }}>Chg%</span>
          <span style={{ textAlign: "right" }}>Vol×</span>
          <span style={{ textAlign: "right" }}>RSI</span>
          <span style={{ textAlign: "right" }}>BB %b</span>
          <span style={{ textAlign: "right" }}>ADX</span>
          <span style={{ textAlign: "right" }}>MACD</span>
          <span style={{ textAlign: "right" }}>Score</span>
        </div>

        {alerts.map((a: any, i: number) => {
          const sym     = a.symbol || a.data?.Symbol;
          const ltp     = a.data?.["LTP"] ?? "—";
          const chg     = parseFloat(String(a.data?.["% Change"] ?? 0));
          const volRatio = parseFloat(String(a.data?.["Vol Ratio"] ?? 1));
          const rsi     = a.data?.["RSI"] ?? "—";
          const pctb    = a.data?.["BB %b"] ?? "—";
          const adx     = a.data?.["ADX"] ?? "—";
          const macd    = parseFloat(String(a.data?.["MACD"] ?? 0));
          const score   = a.data?.["Score"] ?? "—";

          return (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "minmax(110px,1.2fr) 70px 65px 55px 55px 65px 55px 70px 50px",
              gap: 8, padding: "12px 14px", alignItems: "center",
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
              <span style={{ textAlign: "right", fontWeight: 600, color: volRatio >= 2 ? "var(--up)" : "var(--ink-1)" }}>
                {volRatio}x
              </span>
              <span style={{ textAlign: "right", color: parseFloat(String(rsi)) > 70 ? "var(--warn)" : "var(--accent)", fontWeight: 600 }}>{rsi}</span>
              <span style={{ textAlign: "right", fontWeight: 600, color: parseFloat(String(pctb)) >= 1 ? "var(--up)" : "var(--ink-1)" }}>
                {pctb}
              </span>
              <span style={{ textAlign: "right", color: "var(--ink-1)" }}>{adx}</span>
              <span style={{ textAlign: "right", fontWeight: 500, color: macd > 0 ? "var(--up)" : "var(--down)", fontSize: 11 }}>
                {macd > 0 ? "▲" : "▼"} {Math.abs(macd).toFixed(3)}
              </span>
              <span style={{ textAlign: "right", color: "var(--up)", fontWeight: 700 }}>{score}</span>
            </div>
          );
        })}
      </div>

      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>
        Score: % Change (1-6) + Volume (1-7) + RSI (1-3) + BB %b (1-3) + ADX (1-3) + MACD expanding (2). {">"}15 = strong.
      </p>
    </div>
  );
}
