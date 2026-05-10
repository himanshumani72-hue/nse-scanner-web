"use client";
import type { Alert } from "@/lib/types";
import Sparkline, { makeSparkline, seedFromSymbol } from "@/components/ui/Sparkline";
import ConfBar from "@/components/ui/ConfBar";
import Tag from "@/components/ui/Tag";
import { SymCell, SectionHdr, Stat, Empty } from "./BigMoversView";

function CupCard({ a }: { a: Alert }) {
  const d = a.data;
  const seed   = seedFromSymbol(a.symbol);
  const spark  = makeSparkline(60, seed, 0.05, 0.6);
  const above  = parseFloat(String(d["% Above EMA"] ?? 0));
  const rec    = parseFloat(String(d["Recovery %"] ?? 0));
  const news   = parseInt(String(d["News Score"] ?? 0));
  const fund   = String(d["Fundamental"] ?? "");
  const fundColor = fund === "Strong" ? "up" : fund === "Moderate" ? "warn" : "down";

  // Determine stage based on recovery %
  const stage = rec >= 80 ? "Breakout pending" : rec >= 50 ? "Handle forming" : "Cup forming";
  const stageColor = stage.includes("Breakout") ? "violet" : stage.includes("Handle") ? "info" : "neutral";

  return (
    <div style={{ background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12, cursor: "pointer", transition: "border-color .15s ease" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--line-2)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--line)")}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <SymCell sym={a.symbol} name={String(d["Sector"] ?? "")} />
        <Tag tone={stageColor}>{stage}</Tag>
      </div>
      {/* Sparkline with target line */}
      <div style={{ position: "relative", padding: "4px 0" }}>
        <Sparkline data={spark} w={304} h={56} color="var(--accent-2)" stroke={1.5} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 6, borderTop: "1px dashed rgba(168,123,255,.35)" }} />
        <span style={{ position: "absolute", right: 0, top: -4, fontSize: 9.5, color: "var(--violet)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Target</span>
      </div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, paddingTop: 4, borderTop: "1px solid var(--line)" }}>
        <Stat label="LTP"       value={`₹${d["Close"] ?? "—"}`} />
        <Stat label="EMA 51"    value={`₹${d["EMA_51 (2h)"] ?? "—"}`} />
        <Stat label="Above EMA" value={`+${above.toFixed(1)}%`} color="var(--up)" />
        <Stat label="Recovery"  value={`${rec.toFixed(0)}%`} color="var(--accent-2)" />
      </div>
      {/* Confidence + fundamentals */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <Tag tone={fundColor}>{fund || "—"}</Tag>
          {news > 0 && <Tag tone="up">News +{news}</Tag>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Conf</span>
          <ConfBar value={Math.min(95, 50 + rec / 2)} color="var(--violet)" w={100} />
        </div>
      </div>
    </div>
  );
}

export default function CupHandleView({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) return <Empty msg="No Cup & Handle patterns today. Scanner looks for EMA-51 recovery setups on 2H timeframe." />;
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <SectionHdr icon="📈" title="Cup & Handle Patterns" count={alerts.length} hint="Multi-week EMA-51 recovery bases · NSE universe" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 12 }}>
        {alerts.map(a => <CupCard key={a.id} a={a} />)}
      </div>
    </div>
  );
}
