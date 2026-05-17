"use client";
import type { Alert } from "@/lib/types";
import Tag from "@/components/ui/Tag";
import { SectionHdr, Empty } from "./BigMoversView";
import { ExternalLink } from "lucide-react";

function tv(symbol: string) {
  return `https://www.tradingview.com/chart/?symbol=NSE:${symbol}`;
}

export default function CupHandleView({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) return <Empty msg="No Cup & Handle patterns today. Scanner looks for EMA-51 recovery setups on 2H timeframe." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHdr icon="📈" title="Cup & Handle Patterns" count={alerts.length}
        hint="Multi-week EMA-51 recovery bases · Only actionable setups · Already-run stocks filtered out" />

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 11, color: "var(--ink-3)", padding: "0 2px" }}>
        <span>🟢 <b style={{ color: "var(--up)" }}>Breaking Out</b> — buy now, momentum confirmed</span>
        <span>🟡 <b style={{ color: "var(--warn)" }}>Building Momentum</b> — watch for breakout</span>
        <span>⏸️ <b style={{ color: "var(--ink-3)" }}>Consolidating</b> — wait, no trigger yet</span>
      </div>

      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(130px,1.5fr) 80px 80px 70px 70px 70px 80px minmax(120px,1.5fr) 70px 100px 140px",
          gap: 10, padding: "10px 14px", color: "var(--ink-3)", fontSize: 10.5,
          textTransform: "uppercase", letterSpacing: "0.10em",
          borderBottom: "1px solid var(--line)", background: "var(--bg-2)" }}>
          <span>Symbol</span>
          <span style={{ textAlign: "right" }}>LTP</span>
          <span style={{ textAlign: "right" }}>Today %</span>
          <span style={{ textAlign: "right" }}>30D %</span>
          <span style={{ textAlign: "right" }}>EMA 51</span>
          <span style={{ textAlign: "right" }}>RSI</span>
          <span style={{ textAlign: "right" }}>Recovery</span>
          <span style={{ textAlign: "right" }}>News</span>
          <span>Fundament.</span>
          <span>Sector</span>
          <span>Setup Status</span>
        </div>

        {alerts.map((a, i) => {
          const d = a.data;
          const above    = parseFloat(String(d["% Above EMA"] ?? 0));
          const rec      = parseFloat(String(d["Recovery %"] ?? 0));
          const news     = parseInt(String(d["News Score"] ?? 0));
          const fund     = String(d["Fundamental"] ?? "");
          const todayChg = parseFloat(String(d["Today Chg %"] ?? 0));
          const chg30d   = parseFloat(String(d["30D Chg %"] ?? 0));
          const setup    = String(d["Setup"] ?? "");
          const isEven   = i % 2 === 0;

          const fundColor   = fund === "Strong" ? "var(--up)" : fund === "Moderate" ? "var(--warn)" : fund === "Unknown" ? "var(--ink-3)" : "var(--down)";
          const todayColor  = todayChg > 1.5 ? "var(--up)" : todayChg > 0 ? "var(--ink-1)" : "var(--warn)";

          // Setup tag
          let setupTone: "up" | "warn" | "neutral" | "info" = "neutral";
          let setupLabel = setup || (rec >= 80 ? "Breakout pending" : rec >= 50 ? "Handle forming" : "Cup forming");
          if (setup.includes("Breaking")) setupTone = "up";
          else if (setup.includes("Building")) setupTone = "warn";
          else if (setup.includes("Consolidat")) setupTone = "info";

          return (
            <div key={a.id}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(130px,1.5fr) 80px 80px 70px 70px 70px 80px minmax(120px,1.5fr) 70px 100px 140px",
                gap: 10, padding: "10px 14px", alignItems: "center",
                borderBottom: i < alerts.length - 1 ? "1px solid var(--line)" : "none",
                background: isEven ? "var(--bg-2)" : "transparent",
                cursor: "pointer", transition: "background .12s ease",
                opacity: setup.includes("Consolidat") ? 0.75 : 1,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={e => (e.currentTarget.style.background = isEven ? "var(--bg-2)" : "transparent")}>

              {/* Symbol */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                  background: "linear-gradient(135deg, #1a2332, #0f1622)", border: "1px solid var(--line)",
                  display: "grid", placeItems: "center", fontSize: 9, fontWeight: 600,
                  color: "var(--ink-2)", fontFamily: "var(--mono)" }}>
                  {a.symbol.slice(0, 2)}
                </div>
                <a href={tv(a.symbol)} target="_blank" rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--ink-0)",
                    textDecoration: "none", fontWeight: 600, fontSize: 13, fontFamily: "var(--mono)" }}>
                  {a.symbol} <ExternalLink size={10} style={{ color: "var(--ink-4)" }}/>
                </a>
              </div>

              {/* LTP */}
              <span className="num" style={{ textAlign: "right", fontSize: 12.5, color: "var(--ink-0)" }}>
                ₹{d["Close"]}
              </span>

              {/* Today Chg */}
              <span className="num" style={{ textAlign: "right", fontSize: 12, fontWeight: 600, color: todayColor }}>
                {todayChg >= 0 ? "+" : ""}{todayChg.toFixed(2)}%
              </span>

              {/* 30D Chg */}
              <span className="num" style={{ textAlign: "right", fontSize: 11,
                color: chg30d > 20 ? "var(--warn)" : chg30d > 8 ? "var(--up)" : "var(--ink-3)" }}>
                {chg30d >= 0 ? "+" : ""}{chg30d.toFixed(1)}%
              </span>

              {/* EMA */}
              <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--ink-3)" }}>
                ₹{d["EMA_51 (2h)"]}
              </span>

              {/* RSI */}
              <span className="num" style={{ textAlign: "right", fontSize: 12,
                color: parseFloat(String(d["RSI_14"]??50)) > 70 ? "var(--warn)" : "var(--ink-1)" }}>
                {d["RSI_14"]}
              </span>

              {/* Recovery */}
              <span className="num" style={{ textAlign: "right", fontSize: 12, color: "var(--accent-2)" }}>
                {rec.toFixed(0)}%
              </span>

              {/* News — show actual headline, not just a score number */}
              <span style={{ fontSize: 10.5, color: news > 0 ? "var(--accent-2)" : "var(--ink-4)", lineHeight: 1.35 }}>
                {news > 0
                  ? String(d["Top Headline"] ?? d["Top Catalyst"] ?? d["Top News"] ?? "News signal").slice(0, 50)
                  : "—"}
              </span>

              {/* Fundamental */}
              <span style={{ fontSize: 11, fontWeight: 500, color: fundColor }}>
                {fund === "Unknown" ? "—" : fund || "—"}
              </span>

              {/* Sector */}
              <span style={{ fontSize: 11, color: "var(--ink-3)" }}>
                {String(d["Sector"] ?? "").slice(0, 14)}
              </span>

              {/* Setup Status */}
              <Tag tone={setupTone}>{setupLabel}</Tag>
            </div>
          );
        })}
      </div>

      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)", paddingLeft: 2 }}>
        ⚠️ Stocks up &gt;25% in 30 days are filtered out (move already done). Only buy <b style={{ color: "var(--up)" }}>Breaking Out</b> setups with volume confirmation.
      </p>
    </div>
  );
}
