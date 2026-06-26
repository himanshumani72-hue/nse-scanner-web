"use client";
import type { Alert } from "@/lib/types";
import { SectionHdr, Empty } from "./BigMoversView";
import { ExternalLink } from "lucide-react";
import CandleHoverCard from "@/components/ui/CandleHoverCard";

function tv(symbol: string) {
  return `https://www.tradingview.com/chart/?symbol=NSE:${symbol}`;
}

const TIMING_COLOR: Record<string, string> = {
  "Starting Momentum": "var(--up)",
  "Trending, Room Left": "var(--accent-2)",
  "Already Extended": "var(--warn)",
};

export default function MultibaggerView({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) return (
    <Empty msg="No multibagger candidates surfaced yet. This scanner needs at least a catalyst or fundamentals signal to show a stock — a quiet day across all 9 priority sectors is a real 'no signal', not a failure." />
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <MultibaggerTable alerts={alerts} />

      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>
        ⚠️ Fundamentals use approximations where exact data isn&apos;t available: ROCE uses Return on Assets as
        a proxy (no true ROCE field), promoter holding uses insider-holding % (doesn&apos;t separate promoter
        from other insiders, and has no pledge-share data). Treat as a research starting point, not a final number.
      </p>
    </div>
  );
}

function MultibaggerTable({ alerts }: { alerts: Alert[] }) {
  return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)30", borderRadius: 14, overflowX: "auto" }}>
      <div style={{
        display: "grid",
        minWidth: 900,
        gridTemplateColumns: "minmax(110px,1fr) 160px 80px 70px 80px 150px minmax(280px,3fr)",
        gap: 8, padding: "10px 14px",
        color: "var(--ink-3)", fontSize: 10.5,
        textTransform: "uppercase", letterSpacing: "0.10em",
        borderBottom: "1px solid var(--line)", background: "rgba(91,140,255,.06)"
      }}>
        <span>Symbol</span>
        <span>Sector</span>
        <span style={{ textAlign: "right" }}>LTP</span>
        <span style={{ textAlign: "right" }}>Score</span>
        <span style={{ textAlign: "right" }}>Catalyst</span>
        <span>Timing</span>
        <span>Why</span>
      </div>

      {alerts.map((a, i) => {
        const d = a.data;
        const isEven = i % 2 === 0;
        const score = parseFloat(String(d["Final Score"] ?? 0));
        const catalyst = parseFloat(String(d["Catalyst Score"] ?? 0));
        const timing = String(d["Technical Timing"] ?? "Unknown");
        const timingColor = TIMING_COLOR[timing] ?? "var(--ink-3)";
        const scoreColor = score >= 6 ? "var(--up)" : score >= 4 ? "var(--accent-2)" : "var(--ink-3)";

        return (
          <div key={a.id} style={{
            display: "grid",
            minWidth: 900,
            gridTemplateColumns: "minmax(110px,1fr) 160px 80px 70px 80px 150px minmax(280px,3fr)",
            gap: 8, padding: "10px 14px", alignItems: "start",
            borderBottom: i < alerts.length - 1 ? "1px solid var(--line)" : "none",
            background: isEven ? "rgba(91,140,255,.04)" : "transparent",
          }}>
            <CandleHoverCard symbol={a.symbol}>
              <a href={tv(a.symbol)} target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--ink-0)", textDecoration: "none", fontWeight: 700, fontSize: 13, fontFamily: "var(--mono)" }}>
                {a.symbol} <ExternalLink size={10} style={{ opacity: 0.5 }} />
              </a>
            </CandleHoverCard>
            <span style={{ fontSize: 11.5, color: "var(--ink-2)" }}>{String(d["Sector"] ?? "—")}</span>
            <span className="num" style={{ textAlign: "right", fontSize: 12, color: "var(--ink-0)" }}>
              {d["LTP"] != null ? `₹${d["LTP"]}` : "—"}
            </span>
            <span className="num" style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: scoreColor }}>
              {score.toFixed(1)}
            </span>
            <span className="num" style={{ textAlign: "right", fontSize: 11.5, color: "var(--ink-2)" }}>
              {catalyst.toFixed(0)}
            </span>
            <span style={{ fontSize: 10.5, fontWeight: 600, color: timingColor }}>{timing}</span>
            <span style={{ fontSize: 11, color: "var(--ink-2)", lineHeight: 1.4 }}>{String(d["Reason"] ?? "")}</span>
          </div>
        );
      })}
    </div>
  );
}
