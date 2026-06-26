"use client";
import type { Alert } from "@/lib/types";
import { SectionHdr, Empty } from "./BigMoversView";
import { ExternalLink } from "lucide-react";
import CandleHoverCard from "@/components/ui/CandleHoverCard";

function tv(symbol: string) {
  return `https://www.tradingview.com/chart/?symbol=NSE:${symbol}`;
}

export default function BrokerageView({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) return (
    <Empty msg="No broker upgrades detected today. Scanner sweeps ET, MC, BS, LiveMint, Google News every EOD." />
  );

  const strongBuy = alerts.filter(a => String(a.data["Signal"]) === "STRONG BUY");
  const buy       = alerts.filter(a => String(a.data["Signal"]) === "BUY");
  const sells     = alerts.filter(a => String(a.data["Signal"]).includes("SELL"));
  const neutral   = alerts.filter(a => {
    const s = String(a.data["Signal"] ?? "");
    // anything not already bucketed (NEUTRAL, empty, or unrecognised values)
    return s !== "STRONG BUY" && s !== "BUY" && !s.includes("SELL");
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px 18px" }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "var(--ink-0)" }}>
          🏛️ Brokerage Upgrades — Institutional Sentiment
        </h3>
        <p style={{ margin: 0, fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.6 }}>
          Aggregates upgrades/downgrades from <b>Morgan Stanley, Goldman, JPMorgan, CLSA, Jefferies, Motilal, Kotak, ICICI Securities</b> etc.
          Stocks with 2+ Buy upgrades in 5 days often run 3–7% over next week.
          <b style={{ color: "var(--accent-2)" }}> Tier-1 (global) brokers</b> carry highest signal weight.
        </p>
      </div>

      {strongBuy.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHdr icon="🚀" title="STRONG BUY — Multiple Broker Upgrades" count={strongBuy.length}
            hint="2+ broker upgrades or Tier-1 broker endorsement · Highest conviction" />
          <BrokerTable alerts={strongBuy} tone="up" />
        </div>
      )}

      {buy.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHdr icon="🟢" title="BUY — Recent Broker Upgrade" count={buy.length}
            hint="Single broker upgrade · Worth watching" />
          <BrokerTable alerts={buy} tone="warn" />
        </div>
      )}

      {sells.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHdr icon="🔴" title="SELL / DOWNGRADE Warnings" count={sells.length}
            hint="Brokers cutting targets or downgrading · Be cautious if you hold these" />
          <BrokerTable alerts={sells} tone="down" />
        </div>
      )}

      {neutral.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHdr icon="⚪" title="NEUTRAL / Mixed Coverage" count={neutral.length}
            hint="Mixed broker views — upgrades & downgrades cancel out · No clear directional bias" />
          <BrokerTable alerts={neutral} tone="warn" />
        </div>
      )}

      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>
        ⚠️ Broker upgrades are SUGGESTIVE not predictive. Always check chart + fundamentals before buying. Targets shown are broker estimates, not promises.
      </p>
    </div>
  );
}

function BrokerTable({ alerts, tone }: { alerts: Alert[]; tone: "up" | "warn" | "down" }) {
  const accent = tone === "up" ? "var(--up)" : tone === "warn" ? "var(--warn)" : "var(--down)";
  const accentBg = tone === "up" ? "rgba(43,208,122,.06)" : tone === "warn" ? "rgba(243,181,74,.06)" : "rgba(255,93,108,.06)";

  return (
    <div style={{ background: "var(--bg-1)", border: `1px solid ${accent}30`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(110px,1fr) 90px 60px 60px 70px 70px 90px minmax(220px,2fr)",
        gap: 8, padding: "10px 14px",
        color: "var(--ink-3)", fontSize: 10.5,
        textTransform: "uppercase", letterSpacing: "0.10em",
        borderBottom: "1px solid var(--line)", background: accentBg,
      }}>
        <span>Symbol</span>
        <span style={{ textAlign: "right" }}>Signal</span>
        <span style={{ textAlign: "right" }}>Score</span>
        <span style={{ textAlign: "right" }}>Up/Down</span>
        <span style={{ textAlign: "right" }}>Tier1</span>
        <span style={{ textAlign: "right" }}>Tier2</span>
        <span style={{ textAlign: "right" }}>Target</span>
        <span>Top Headline</span>
      </div>

      {alerts.map((a, i) => {
        const d = a.data;
        const isEven = i % 2 === 0;
        const score = parseInt(String(d["Conviction Score"] ?? 0));
        const signal = String(d["Signal"] ?? "");
        const sigColor = signal.includes("STRONG BUY") ? "var(--up)" :
                         signal.includes("BUY") ? "var(--up)" :
                         signal.includes("STRONG SELL") ? "var(--down)" :
                         signal.includes("SELL") ? "var(--down)" : "var(--ink-2)";

        return (
          <div key={a.id} style={{
            display: "grid",
            gridTemplateColumns: "minmax(110px,1fr) 90px 60px 60px 70px 70px 90px minmax(220px,2fr)",
            gap: 8, padding: "10px 14px", alignItems: "center",
            borderBottom: i < alerts.length - 1 ? "1px solid var(--line)" : "none",
            background: isEven ? accentBg : "transparent",
          }}>
            <CandleHoverCard symbol={a.symbol}>
              <a href={tv(a.symbol)} target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--ink-0)", textDecoration: "none", fontWeight: 700, fontSize: 13, fontFamily: "var(--mono)" }}>
                {a.symbol} <ExternalLink size={10} style={{ opacity: 0.5 }} />
              </a>
            </CandleHoverCard>
            <span style={{ textAlign: "right" }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999, color: sigColor, border: `1px solid ${sigColor}40`, background: `${sigColor}15` }}>
                {signal.replace("STRONG ", "S.")}
              </span>
            </span>
            <span className="num" style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: accent }}>{score}</span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--ink-2)" }}>
              <span style={{ color: "var(--up)" }}>{d["Upgrades (5d)"]}</span>/<span style={{ color: "var(--down)" }}>{d["Downgrades (5d)"]}</span>
            </span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, color: parseInt(String(d["Tier 1 Brokers"] ?? 0)) >= 1 ? accent : "var(--ink-3)" }}>{d["Tier 1 Brokers"]}</span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--ink-3)" }}>{d["Tier 2 Brokers"]}</span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--up)", fontWeight: 600 }}>
              {d["Max Target"] ? `₹${d["Max Target"]}` : "—"}
            </span>
            <span style={{ fontSize: 10.5, color: "var(--ink-3)", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {String(d["Top Headline"] ?? "").slice(0, 80)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
