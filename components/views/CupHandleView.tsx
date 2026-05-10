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
      <SectionHdr icon="📈" title="Cup & Handle Patterns" count={alerts.length} hint="Multi-week EMA-51 recovery bases · NSE universe" />

      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(120px,1.5fr) 90px 90px 80px 70px 80px 60px 100px 80px 120px", gap: 12, padding: "10px 14px", color: "var(--ink-3)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.10em", borderBottom: "1px solid var(--line)", background: "var(--bg-2)" }}>
          <span>Symbol</span>
          <span style={{ textAlign: "right" }}>LTP</span>
          <span style={{ textAlign: "right" }}>EMA 51</span>
          <span style={{ textAlign: "right" }}>Above EMA</span>
          <span style={{ textAlign: "right" }}>RSI</span>
          <span style={{ textAlign: "right" }}>Recovery</span>
          <span style={{ textAlign: "right" }}>News</span>
          <span>Fundamental</span>
          <span>Sector</span>
          <span>Stage</span>
        </div>

        {/* Rows */}
        {alerts.map((a, i) => {
          const d = a.data;
          const above = parseFloat(String(d["% Above EMA"] ?? 0));
          const rec   = parseFloat(String(d["Recovery %"] ?? 0));
          const news  = parseInt(String(d["News Score"] ?? 0));
          const fund  = String(d["Fundamental"] ?? "");
          const fundColor = fund === "Strong" ? "var(--up)" : fund === "Moderate" ? "var(--warn)" : "var(--down)";
          const stage = rec >= 80 ? "Breakout pending" : rec >= 50 ? "Handle forming" : "Cup forming";
          const stageColor = stage.includes("Breakout") ? "violet" : stage.includes("Handle") ? "info" : "neutral";
          const isEven = i % 2 === 0;

          return (
            <div key={a.id}
              style={{ display: "grid", gridTemplateColumns: "minmax(120px,1.5fr) 90px 90px 80px 70px 80px 60px 100px 80px 120px", gap: 12, padding: "10px 14px", alignItems: "center", borderBottom: i < alerts.length - 1 ? "1px solid var(--line)" : "none", background: isEven ? "var(--bg-2)" : "transparent", cursor: "pointer", transition: "background .12s ease" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={e => (e.currentTarget.style.background = isEven ? "var(--bg-2)" : "transparent")}>

              {/* Symbol */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0, background: "linear-gradient(135deg, #1a2332, #0f1622)", border: "1px solid var(--line)", display: "grid", placeItems: "center", fontSize: 9, fontWeight: 600, color: "var(--ink-2)", fontFamily: "var(--mono)" }}>
                  {a.symbol.slice(0, 2)}
                </div>
                <a href={tv(a.symbol)} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--ink-0)", textDecoration: "none", fontWeight: 600, fontSize: 13, fontFamily: "var(--mono)" }}>
                  {a.symbol} <ExternalLink size={10} style={{ color: "var(--ink-4)" }}/>
                </a>
              </div>

              <span className="num" style={{ textAlign: "right", fontSize: 12.5, color: "var(--ink-0)" }}>₹{d["Close"]}</span>
              <span className="num" style={{ textAlign: "right", fontSize: 12, color: "var(--ink-3)" }}>₹{d["EMA_51 (2h)"]}</span>
              <span className="num" style={{ textAlign: "right", fontSize: 12, color: "var(--up)" }}>+{above.toFixed(1)}%</span>
              <span className="num" style={{ textAlign: "right", fontSize: 12, color: "var(--ink-1)" }}>{d["RSI_14"]}</span>
              <span className="num" style={{ textAlign: "right", fontSize: 12, color: "var(--accent-2)" }}>{rec.toFixed(0)}%</span>
              <span style={{ textAlign: "right" }}>
                {news > 0 ? <Tag tone="up">+{news}</Tag> : <span style={{ color: "var(--ink-4)", fontSize: 11 }}>—</span>}
              </span>
              <span style={{ fontSize: 12, fontWeight: 500, color: fundColor }}>{fund || "—"}</span>
              <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{String(d["Sector"] ?? "").slice(0, 14)}</span>
              <Tag tone={stageColor}>{stage}</Tag>
            </div>
          );
        })}
      </div>
    </div>
  );
}
