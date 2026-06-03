"use client";
import { ExternalLink } from "lucide-react";
const tv = (sym: string) => `https://in.tradingview.com/chart/?symbol=NSE:${sym}`;

const STAGE_COLOR: Record<string, string> = {
  "Breaking Out": "var(--up)",
  "Above Base"  : "var(--accent-2)",
  "Watch"       : "var(--warn)",
};

export default function FlatBaseView({ alerts }: { alerts: any[] }) {
  if (!alerts || alerts.length === 0) return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: 48, textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>📦</div>
      <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 14 }}>No Flat Base Breakout stocks today.</p>
      <p style={{ color: "var(--ink-4)", margin: "8px 0 0", fontSize: 12 }}>Criteria: Tight range (&lt;25%) for 60-90 days → EMA-51 flat → Now breaking above base top</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: "16px 20px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--ink-0)" }}>
          📦 Flat Base Breakout — Long Consolidation → Breakout
        </h2>
        <p style={{ margin: 0, fontSize: 12, color: "var(--ink-3)" }}>
          Stocks in tight consolidation for 60-90 days, hugging EMA-51, now breaking above the range. Like CPPLUS. Safest setups — no FOMO, quiet accumulation.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
          {[["🟢 Breaking Out", "Act now — volume confirmed breakout"], ["🔵 Above Base", "Breakout in progress — watch closely"], ["🟡 Watch", "Still in base — wait for breakout"]].map(([label, hint]) => (
            <div key={label as string} style={{ fontSize: 11, color: "var(--ink-3)" }}>
              <strong style={{ color: "var(--ink-1)" }}>{label as string}</strong> — {hint as string}
            </div>
          ))}
        </div>
      </div>

      {alerts.map((a: any, i: number) => {
        const sym       = a.symbol || a.data?.Symbol;
        const stage     = a.data?.["Stage"] ?? "Watch";
        const ltp       = a.data?.["LTP"] ?? "—";
        const rsi       = a.data?.["RSI"] ?? "—";
        const baseRange = a.data?.["Base Range %"] ?? "—";
        const breakout  = parseFloat(String(a.data?.["Breakout %"] ?? 0));
        const volSurge  = a.data?.["Vol Surge"] ?? "—";
        const todayChg  = parseFloat(String(a.data?.["Today Chg %"] ?? 0));
        const support   = a.data?.["Base Support"] ?? "—";
        const t1        = a.data?.["Target 1"] ?? "—";
        const t2        = a.data?.["Target 2"] ?? "—";
        const score     = parseInt(String(a.data?.["Score"] ?? 0));
        const stageColor = STAGE_COLOR[stage] ?? "var(--warn)";

        return (
          <div key={i} style={{
            background: "var(--bg-1)", border: "1px solid var(--line)",
            borderRadius: 14, padding: "16px 20px",
            borderLeft: `3px solid ${stageColor}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <a href={tv(sym)} target="_blank" rel="noreferrer" style={{
                  fontWeight: 700, fontSize: 16, color: "var(--ink-0)",
                  textDecoration: "none", display: "flex", alignItems: "center", gap: 6
                }}>
                  {sym} <ExternalLink size={12} style={{ opacity: 0.5 }} />
                </a>
                <span style={{
                  padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                  background: `color-mix(in oklab, ${stageColor} 15%, transparent)`,
                  color: stageColor,
                  border: `1px solid color-mix(in oklab, ${stageColor} 35%, transparent)`,
                }}>{stage}</span>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: todayChg >= 0 ? "var(--up)" : "var(--down)" }}>
                  {todayChg > 0 ? "+" : ""}{todayChg}% today
                </span>
                <span style={{
                  background: "rgba(91,140,255,.15)", color: "var(--accent-2)",
                  border: "1px solid rgba(91,140,255,.3)", borderRadius: 999,
                  padding: "2px 10px", fontSize: 12, fontWeight: 600
                }}>Score {score}</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 10 }}>
              {[
                { label: "LTP",         value: `₹${ltp}` },
                { label: "RSI",         value: rsi },
                { label: "Base Range",  value: `${baseRange}%` },
                { label: "Breakout",    value: `${breakout > 0 ? "+" : ""}${breakout}%` },
                { label: "Vol Surge",   value: `${volSurge}x` },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "var(--bg-2)", borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)" }}>{String(value)}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--ink-3)" }}>
              <span style={{ color: "var(--down)" }}>🛑 Support: ₹{support}</span>
              <span style={{ color: "var(--up)" }}>🎯 T1: ₹{t1}</span>
              <span style={{ color: "var(--up)" }}>🎯 T2: ₹{t2}</span>
            </div>
          </div>
        );
      })}

      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>
        Stop loss = base low - 1%. Entry on breakout day with volume. These are multi-week setups, not intraday.
      </p>
    </div>
  );
}
