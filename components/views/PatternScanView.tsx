"use client";
import { ExternalLink } from "lucide-react";
import CandleHoverCard from "@/components/ui/CandleHoverCard";
const tv = (sym: string) => `https://in.tradingview.com/chart/?symbol=NSE:${sym}`;

export interface PatternColumn {
  key: string;
  label: string;
  format?: (v: unknown) => string;
  color?: (v: unknown) => string;
}

export default function PatternScanView({
  alerts, emoji, title, description, columns,
}: {
  alerts: any[];
  emoji: string;
  title: string;
  description: string;
  columns: PatternColumn[];
}) {
  if (!alerts || alerts.length === 0) return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: 48, textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{emoji}</div>
      <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 14 }}>No {title} setups today.</p>
      <p style={{ color: "var(--ink-4)", margin: "8px 0 0", fontSize: 12, maxWidth: 560, marginInline: "auto" }}>{description}</p>
    </div>
  );

  const gridCols = `minmax(110px,1.2fr) ${columns.map(() => "minmax(80px,1fr)").join(" ")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: "16px 20px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--ink-0)" }}>{emoji} {title}</h2>
        <p style={{ margin: 0, fontSize: 12, color: "var(--ink-3)" }}>{description}</p>
        <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--ink-4)" }}>
          ⚠️ Rule-based pattern matching, not true chart-image recognition — strict thresholds keep false
          positives rare, but no algorithm catches every real-world variant of a chart pattern. Verify visually before acting.
        </p>
      </div>

      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, overflowX: "auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: gridCols, gap: 10, padding: "12px 16px", minWidth: 760,
          fontSize: 11, fontWeight: 600, color: "var(--ink-3)",
          textTransform: "uppercase", letterSpacing: "0.06em",
          borderBottom: "1px solid var(--line)", background: "var(--bg-2)",
        }}>
          <span>Symbol</span>
          {columns.map(col => <span key={col.key} style={{ textAlign: "right" }}>{col.label}</span>)}
        </div>

        {alerts.map((a: any, i: number) => {
          const sym = a.symbol || a.data?.Symbol;
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: gridCols, gap: 10, padding: "12px 16px",
              alignItems: "center", minWidth: 760,
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
              {columns.map(col => {
                const raw = a.data?.[col.key];
                const text = col.format ? col.format(raw) : (raw ?? "—");
                const color = col.color ? col.color(raw) : "var(--ink-2)";
                return <span key={col.key} style={{ textAlign: "right", color, fontWeight: 500 }}>{text}</span>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
