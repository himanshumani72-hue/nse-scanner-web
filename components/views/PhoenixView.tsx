"use client";
import { ExternalLink } from "lucide-react";
import CandleHoverCard from "@/components/ui/CandleHoverCard";
const tv = (sym: string) => `https://in.tradingview.com/chart/?symbol=NSE:${sym}`;

export default function PhoenixView({ alerts }: { alerts: any[] }) {
  if (!alerts || alerts.length === 0) return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: 48, textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>🔥</div>
      <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 14 }}>No Phoenix Recovery stocks today.</p>
      <p style={{ color: "var(--ink-4)", margin: "8px 0 0", fontSize: 12 }}>Criteria: Was below EMA-51 for 30+ days → Big catalyst spike (5x vol + 6% up) → Now back above EMA-51</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: "16px 20px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--ink-0)" }}>
          🔥 Phoenix Recovery — Crashed → Catalyst → Rising
        </h2>
        <p style={{ margin: 0, fontSize: 12, color: "var(--ink-3)" }}>
          Stocks that had a BIG catalyst (5x+ vol, 6%+ move) after a downtrend — now back above EMA-51. Like HLEGLAS +8% on Nifty -1.12% day.
        </p>
      </div>

      {alerts.map((a: any, i: number) => {
        const score   = parseInt(String(a.data?.["Score"] ?? a.metadata?.score ?? 0));
        const sym     = a.symbol || a.data?.Symbol;
        const ltp     = a.data?.["LTP"] ?? "—";
        const rsi     = a.data?.["RSI"] ?? "—";
        const aboveEma = a.data?.["% Above EMA51"] ?? "—";
        const catalyst = a.data?.["Catalyst Spike"] ?? "—";
        const daysAgo  = a.data?.["Days Ago"] ?? "—";
        const todayChg = parseFloat(String(a.data?.["Today Chg %"] ?? 0));
        const sl       = a.data?.["Stop Loss"] ?? "—";
        const t1       = a.data?.["Target 1"] ?? "—";
        const t2       = a.data?.["Target 2"] ?? "—";

        return (
          <div key={i} style={{
            background: "var(--bg-1)", border: "1px solid var(--line)",
            borderRadius: 14, padding: "16px 20px",
            borderLeft: `3px solid ${todayChg > 2 ? "var(--up)" : "var(--accent-2)"}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <CandleHoverCard symbol={sym}>
                <a href={tv(sym)} target="_blank" rel="noreferrer" style={{
                  fontWeight: 700, fontSize: 16, color: "var(--ink-0)",
                  textDecoration: "none", display: "flex", alignItems: "center", gap: 6
                }}>
                  {sym} <ExternalLink size={12} style={{ opacity: 0.5 }} />
                </a>
              </CandleHoverCard>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: todayChg >= 0 ? "var(--up)" : "var(--down)"
                }}>
                  {todayChg > 0 ? "+" : ""}{todayChg}% today
                </span>
                <span style={{
                  background: "rgba(43,208,122,.15)", color: "var(--up)",
                  border: "1px solid rgba(43,208,122,.3)", borderRadius: 999,
                  padding: "2px 10px", fontSize: 12, fontWeight: 600
                }}>Score {score}</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 10 }}>
              {[
                { label: "LTP", value: `₹${ltp}` },
                { label: "RSI", value: rsi },
                { label: "Above EMA-51", value: `+${aboveEma}%` },
                { label: "Catalyst", value: catalyst },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "var(--bg-2)", borderRadius: 8, padding: "8px 12px" }}>
                  <div style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)" }}>{String(value)}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--ink-3)" }}>
              <span>⏱ {daysAgo} days ago</span>
              <span style={{ color: "var(--down)" }}>🛑 SL: ₹{sl}</span>
              <span style={{ color: "var(--up)" }}>🎯 T1: ₹{t1}</span>
              <span style={{ color: "var(--up)" }}>🎯 T2: ₹{t2}</span>
            </div>
          </div>
        );
      })}

      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>
        Stop loss = 2% below EMA-51. These stocks have catalyst-driven momentum — hold until Target 1 or stop triggers.
      </p>
    </div>
  );
}
