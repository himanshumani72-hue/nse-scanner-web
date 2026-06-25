"use client";
import type { Alert } from "@/lib/types";
import { SectionHdr, Empty } from "./BigMoversView";
import { ExternalLink } from "lucide-react";

function tv(symbol: string) {
  return `https://www.tradingview.com/chart/?symbol=NSE:${symbol}`;
}

export default function BreakoutView({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) return (
    <Empty msg="No 52-week high breakouts or near-breakouts today. The scanner finished — the market simply produced no qualifying stocks (close > prior 52W high on 1.3×+ volume + 1.5%+ gain). This is a real 'no signal' day, not a failure." />
  );

  // Split true breakouts from near-breakouts
  const breakouts = alerts.filter(a => String(a.data["Type"] ?? "BREAKOUT") === "BREAKOUT");
  const nears     = alerts.filter(a => String(a.data["Type"] ?? "") === "NEAR");

  const high   = breakouts.filter(a => String(a.data["Conviction"]) === "HIGH");
  const medium = breakouts.filter(a => String(a.data["Conviction"]) === "MEDIUM");
  const low    = breakouts.filter(a => String(a.data["Conviction"]) === "LOW");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Explanation */}
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px 18px" }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "var(--ink-0)" }}>
          🚀 52-Week High Breakout — Fresh Territory Rally
        </h3>
        <p style={{ margin: 0, fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.6 }}>
          Stocks crossing ABOVE their prior 52W high on 1.5x+ volume. <b style={{ color: "var(--up)" }}>No overhead supply</b> means
          no seller resistance — these often run <b>5–15% over the next 5–10 days</b> as momentum traders pile in.
          This is how stocks like CRIZAC, AJMERA go parabolic.
        </p>
      </div>

      {high.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHdr icon="🟢" title="HIGH Conviction Breakouts" count={high.length}
            hint="Score ≥ 16 · Strong volume + clean breakout + momentum healthy" />
          <BreakoutTable alerts={high} tone="up" />
        </div>
      )}
      {medium.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHdr icon="🟡" title="MEDIUM Conviction" count={medium.length}
            hint="Valid breakout but smaller margin or volume" />
          <BreakoutTable alerts={medium} tone="warn" />
        </div>
      )}
      {low.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHdr icon="🔵" title="LOW Conviction" count={low.length}
            hint="Reason varies per stock — see note under each symbol below" />
          <BreakoutTable alerts={low} tone="info" />
        </div>
      )}

      {nears.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHdr icon="👀" title="Near-Breakout Watchlist" count={nears.length}
            hint="Within 0.5% of 52W high on strong volume — likely breaks out tomorrow" />
          <BreakoutTable alerts={nears} tone="info" />
        </div>
      )}

      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>
        ⚠️ Buy on volume confirmation only. Stop Loss at prior 52W high (false breakout invalidator). R:R ≥ 2:1 minimum.
      </p>
    </div>
  );
}

function BreakoutTable({ alerts, tone }: { alerts: Alert[]; tone: "up" | "warn" | "info" }) {
  const accent = tone === "up" ? "var(--up)" : tone === "warn" ? "var(--warn)" : "var(--accent-2)";
  const accentBg = tone === "up" ? "rgba(43,208,122,.06)" : tone === "warn" ? "rgba(243,181,74,.06)" : "rgba(91,140,255,.06)";

  return (
    <div style={{ background: "var(--bg-1)", border: `1px solid ${accent}30`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(120px,1.3fr) 75px 80px 75px 70px 60px 75px 80px 80px 60px",
        gap: 8, padding: "10px 14px",
        color: "var(--ink-3)", fontSize: 10.5,
        textTransform: "uppercase", letterSpacing: "0.10em",
        borderBottom: "1px solid var(--line)", background: accentBg
      }}>
        <span>Symbol</span>
        <span style={{ textAlign: "right" }}>LTP</span>
        <span style={{ textAlign: "right" }}>Prior 52W</span>
        <span style={{ textAlign: "right" }}>Above %</span>
        <span style={{ textAlign: "right" }}>Today%</span>
        <span style={{ textAlign: "right" }}>RSI</span>
        <span style={{ textAlign: "right" }}>Vol</span>
        <span style={{ textAlign: "right" }}>Stop Loss</span>
        <span style={{ textAlign: "right" }}>Target 1</span>
        <span style={{ textAlign: "right" }}>R:R</span>
      </div>

      {alerts.map((a, i) => {
        const d = a.data;
        const isEven = i % 2 === 0;
        const breakout = parseFloat(String(d["Breakout %"] ?? 0));
        const todayChg = parseFloat(String(d["Today Chg %"] ?? 0));
        const rsi = parseFloat(String(d["RSI"] ?? 0));
        const vol = parseFloat(String(d["Vol/Avg"] ?? 0));

        return (
          <div key={a.id} style={{
            display: "grid",
            gridTemplateColumns: "minmax(120px,1.3fr) 75px 80px 75px 70px 60px 75px 80px 80px 60px",
            gap: 8, padding: "10px 14px", alignItems: "center",
            borderBottom: i < alerts.length - 1 ? "1px solid var(--line)" : "none",
            background: isEven ? accentBg : "transparent",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
              <a href={tv(a.symbol)} target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--ink-0)", textDecoration: "none", fontWeight: 700, fontSize: 13, fontFamily: "var(--mono)" }}>
                {a.symbol} <ExternalLink size={10} style={{ opacity: 0.5 }} />
              </a>
              {d["Conviction Reason"] && (
                <span style={{ fontSize: 10, color: "var(--ink-3)", lineHeight: 1.3, whiteSpace: "normal" }}>
                  {String(d["Conviction Reason"])}
                </span>
              )}
            </div>
            <span className="num" style={{ textAlign: "right", fontSize: 12, color: "var(--ink-0)" }}>₹{d["LTP"]}</span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--ink-3)" }}>₹{d["Prior 52W High"]}</span>
            <span className="num" style={{ textAlign: "right", fontSize: 12, fontWeight: 700, color: accent }}>+{breakout.toFixed(1)}%</span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--up)" }}>+{todayChg.toFixed(1)}%</span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, color: rsi > 70 ? "var(--warn)" : "var(--ink-1)" }}>{rsi.toFixed(0)}</span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, color: vol >= 3 ? accent : "var(--ink-2)" }}>{vol.toFixed(1)}x</span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--down)" }}>₹{d["Stop Loss"]}</span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--up)" }}>₹{d["Target 1"]}</span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--ink-2)" }}>{d["R:R"]}:1</span>
          </div>
        );
      })}
    </div>
  );
}
