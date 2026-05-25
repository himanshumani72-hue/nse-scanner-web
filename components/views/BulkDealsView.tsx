"use client";
import type { Alert } from "@/lib/types";
import { SectionHdr, Empty } from "./BigMoversView";
import { ExternalLink } from "lucide-react";

function tv(symbol: string) {
  return `https://www.tradingview.com/chart/?symbol=NSE:${symbol}`;
}

export default function BulkDealsView({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) return (
    <Empty msg="No bulk deal data today. NSE publishes bulk deals around 5–6 PM IST after market close." />
  );

  // Split BUYS and SELLS
  const buys  = alerts.filter(a => String(a.data["Signal"]) === "BUY")
                     .sort((a, b) => parseFloat(String(b.data["Conviction Score"] ?? 0)) - parseFloat(String(a.data["Conviction Score"] ?? 0)));
  const sells = alerts.filter(a => String(a.data["Signal"]) === "SELL")
                     .sort((a, b) => parseFloat(String(b.data["Conviction Score"] ?? 0)) - parseFloat(String(a.data["Conviction Score"] ?? 0)));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Explanation */}
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px 18px" }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "var(--ink-0)" }}>
          🏦 Institutional Bulk Deals — Smart Money Tracking
        </h3>
        <p style={{ margin: 0, fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.6 }}>
          NSE publishes large trades (≥5L shares) daily after market close. When <b style={{ color: "var(--up)" }}>multiple institutions buy</b> the same stock,
          it often runs 5–10% over next 3–5 days. <b style={{ color: "var(--accent-2)" }}>3+ consecutive days of buying = highest conviction.</b>
        </p>
      </div>

      {/* BUY signals */}
      {buys.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHdr icon="🟢" title="Institutional BUYING — Accumulation Signals" count={buys.length}
            hint="Sorted by conviction · STRONG = 2+ institutions buying · 3+ days = multi-day accumulation" />
          <DealsTable alerts={buys} signal="BUY" />
        </div>
      )}

      {/* SELL signals */}
      {sells.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHdr icon="🔴" title="Institutional SELLING — Distribution Signals" count={sells.length}
            hint="Watch out if you hold these — institutions exiting positions" />
          <DealsTable alerts={sells} signal="SELL" />
        </div>
      )}

      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>
        ⚠️ Bulk deals are reported AFTER market close. Use this as early signal for next 3-5 trading days. Always confirm with chart + news.
      </p>
    </div>
  );
}

function DealsTable({ alerts, signal }: { alerts: Alert[]; signal: "BUY" | "SELL" }) {
  const accent = signal === "BUY" ? "var(--up)" : "var(--down)";
  const accentBg = signal === "BUY" ? "rgba(43,208,122,.06)" : "rgba(255,93,108,.06)";

  return (
    <div style={{ background: "var(--bg-1)", border: `1px solid ${accent}30`, borderRadius: 14, overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(120px,1.3fr) 75px 60px 75px 80px 75px 70px minmax(200px,2fr)",
        gap: 8, padding: "10px 14px",
        color: "var(--ink-3)", fontSize: 10.5,
        textTransform: "uppercase", letterSpacing: "0.10em",
        borderBottom: "1px solid var(--line)", background: accentBg
      }}>
        <span>Symbol</span>
        <span style={{ textAlign: "right" }}>Strength</span>
        <span style={{ textAlign: "right" }}>Score</span>
        <span style={{ textAlign: "right" }}>Net Qty</span>
        <span style={{ textAlign: "right" }}>Value (Cr)</span>
        <span style={{ textAlign: "right" }}>Inst Buy</span>
        <span style={{ textAlign: "right" }}>Days/5</span>
        <span>Top Buyer</span>
      </div>

      {alerts.map((a, i) => {
        const d = a.data;
        const score = parseInt(String(d["Conviction Score"] ?? 0));
        const strength = String(d["Strength"] ?? "WEAK");
        const days = parseInt(String(d["Days in Bulk (5d)"] ?? 1));
        const value = parseFloat(String(d["Net Value (Cr)"] ?? 0));
        const isEven = i % 2 === 0;

        const strengthColor = strength === "STRONG" ? accent : strength === "MODERATE" ? "var(--warn)" : "var(--ink-3)";
        const scoreColor = Math.abs(score) >= 10 ? accent : Math.abs(score) >= 6 ? "var(--warn)" : "var(--ink-2)";

        return (
          <div key={a.id} style={{
            display: "grid",
            gridTemplateColumns: "minmax(120px,1.3fr) 75px 60px 75px 80px 75px 70px minmax(200px,2fr)",
            gap: 8, padding: "10px 14px", alignItems: "center",
            borderBottom: i < alerts.length - 1 ? "1px solid var(--line)" : "none",
            background: isEven ? accentBg : "transparent",
          }}>
            <a href={tv(a.symbol)} target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--ink-0)", textDecoration: "none", fontWeight: 700, fontSize: 13, fontFamily: "var(--mono)" }}>
              {a.symbol} <ExternalLink size={10} style={{ opacity: 0.5 }} />
            </a>
            <span style={{ textAlign: "right" }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999, color: strengthColor, border: `1px solid ${strengthColor}40`, background: `${strengthColor}15` }}>
                {strength}
              </span>
            </span>
            <span className="num" style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: scoreColor }}>
              {score >= 0 ? "+" : ""}{score}
            </span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, color: accent }}>
              {Math.abs(parseInt(String(d["Net Qty"] ?? 0))).toLocaleString("en-IN")}
            </span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--ink-2)" }}>
              ₹{value.toFixed(1)}
            </span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, color: parseInt(String(d["Inst Buyers"] ?? 0)) >= 2 ? accent : "var(--ink-3)" }}>
              {d["Inst Buyers"]}
            </span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, fontWeight: days >= 3 ? 700 : 400, color: days >= 3 ? accent : "var(--ink-3)" }}>
              {days}/5 {days >= 3 ? "⭐" : ""}
            </span>
            <span style={{ fontSize: 10.5, color: "var(--ink-3)", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {String(d["Top Buyer"] ?? "").slice(0, 50)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
