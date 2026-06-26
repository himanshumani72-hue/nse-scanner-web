"use client";
import type { Alert } from "@/lib/types";
import Tag from "@/components/ui/Tag";
import { SectionHdr, Empty } from "./BigMoversView";
import { ExternalLink } from "lucide-react";
import CandleHoverCard from "@/components/ui/CandleHoverCard";

function tv(symbol: string) {
  return `https://www.tradingview.com/chart/?symbol=NSE:${symbol}`;
}

export default function WPatternView({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) return <Empty msg="No W-patterns on 15m chart today. Scanner looks for double-bottom reversal patterns." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHdr icon="〰️" title="W-Pattern (15-min chart)" count={alerts.length} hint="1-3 day swing trades · neckline breakout setups" />

      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(110px,1.2fr) 70px 70px 60px 80px 80px 80px 70px 70px 80px 80px 90px 150px",
                       gap: 10, padding: "10px 14px", color: "var(--ink-3)", fontSize: 10.5,
                       textTransform: "uppercase", letterSpacing: "0.10em",
                       borderBottom: "1px solid var(--line)", background: "var(--bg-2)" }}>
          <span>Symbol</span>
          <span style={{ textAlign: "right" }}>LTP</span>
          <span>Quality</span>
          <span style={{ textAlign: "right" }}>Score</span>
          <span style={{ textAlign: "right" }}>B1 (Low)</span>
          <span style={{ textAlign: "right" }}>B2 (Low)</span>
          <span style={{ textAlign: "right" }}>Neckline</span>
          <span style={{ textAlign: "right" }}>Recovery</span>
          <span style={{ textAlign: "right" }}>Stop</span>
          <span style={{ textAlign: "right" }}>Target</span>
          <span>MACD</span>
          <span>Setup</span>
          <span>Signals</span>
        </div>

        {alerts.map((a, i) => {
          const d = a.data;
          const q = String(d["Pattern Quality"] ?? "");
          const qColor = q === "A" ? "var(--up)" : q === "B" ? "var(--warn)" : "var(--orange)";
          const setup = String(d["Setup"] ?? "");
          const isEven = i % 2 === 0;

          return (
            <div key={a.id} style={{ display: "grid",
              gridTemplateColumns: "minmax(110px,1.2fr) 70px 70px 60px 80px 80px 80px 70px 70px 80px 80px 90px 150px",
              gap: 10, padding: "10px 14px", alignItems: "center",
              borderBottom: i < alerts.length - 1 ? "1px solid var(--line)" : "none",
              background: isEven ? "var(--bg-2)" : "transparent",
              cursor: "pointer", transition: "background .12s ease" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={e => (e.currentTarget.style.background = isEven ? "var(--bg-2)" : "transparent")}>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                              background: "linear-gradient(135deg,#1a2332,#0f1622)", border: "1px solid var(--line)",
                              display: "grid", placeItems: "center", fontSize: 9, fontWeight: 600,
                              color: "var(--ink-2)", fontFamily: "var(--mono)" }}>
                  {a.symbol.slice(0, 2)}
                </div>
                <CandleHoverCard symbol={a.symbol}>
                  <a href={tv(a.symbol)} target="_blank" rel="noreferrer"
                     style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--ink-0)",
                              textDecoration: "none", fontWeight: 600, fontSize: 13, fontFamily: "var(--mono)" }}>
                    {a.symbol} <ExternalLink size={10} style={{ color: "var(--ink-4)" }}/>
                  </a>
                </CandleHoverCard>
              </div>

              <span className="num" style={{ textAlign: "right", fontSize: 12.5, color: "var(--ink-0)" }}>₹{d["LTP"]}</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: qColor }}>{q}</span>
              <span className="num" style={{ textAlign: "right", fontSize: 12, fontWeight: 600, color: "var(--ink-0)" }}>{d["W Score"]}</span>
              <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--ink-3)" }}>₹{d["B1 (Left Low)"]}</span>
              <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--ink-3)" }}>₹{d["B2 (Right Low)"]}</span>
              <span className="num" style={{ textAlign: "right", fontSize: 12, color: "var(--accent-2)" }}>₹{d["Neckline (Peak)"]}</span>
              <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--accent-2)" }}>{d["Recovery %"]}%</span>
              <span className="num" style={{ textAlign: "right", fontSize: 12, color: "var(--down)" }}>₹{d["Stop Loss"]}</span>
              <span className="num" style={{ textAlign: "right", fontSize: 12, fontWeight: 700, color: "var(--up)" }}>₹{d["Target"]}</span>
              <Tag tone={d["MACD"] === "Bullish" ? "up" : "neutral"}>{d["MACD"]}</Tag>
              <span style={{ fontSize: 11, color: setup.includes("broken") ? "var(--up)" : "var(--ink-2)" }}>
                {setup.slice(0, 18)}
              </span>
              <span style={{ fontSize: 10, color: "var(--ink-3)" }}>
                {String(d["Signals"] ?? "").slice(0, 35)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
