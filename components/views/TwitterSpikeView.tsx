"use client";
import type { Alert } from "@/lib/types";
import { ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";

function tv(symbol: string) {
  return `https://www.tradingview.com/chart/?symbol=NSE:${symbol}`;
}

export default function TwitterSpikeView({ alerts }: { alerts: Alert[] }) {
  if (!alerts?.length) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--ink-3)" }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 14, color: "var(--ink-1)" }}>No Twitter spikes detected</h3>
        <p style={{ margin: 0, fontSize: 12 }}>
          Scanner watches Twitter/X for unusual mention spikes. A spike = ≥3× normal mention rate. Refreshes on each scan.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px 18px" }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "var(--ink-0)" }}>
          🐦 Twitter/X Mention Spike — Retail Buzz Leading Indicator
        </h3>
        <p style={{ margin: 0, fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.6 }}>
          Detects stocks where Twitter mentions surged ≥3× normal rate in last 4 hours. Retail chatter often leads news cycles
          by 30–120 minutes for small/mid caps. <b style={{ color: "var(--up)" }}>Bullish sentiment + high multiplier</b> = strongest signal.
        </p>
      </div>

      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(110px,1.1fr) 70px 80px 70px 80px 70px minmax(280px,3fr)",
          gap: 8, padding: "10px 14px",
          color: "var(--ink-3)", fontSize: 10.5,
          textTransform: "uppercase", letterSpacing: "0.10em",
          borderBottom: "1px solid var(--line)", background: "var(--bg-2)",
        }}>
          <span>Symbol</span>
          <span style={{ textAlign: "right" }}>Multi×</span>
          <span style={{ textAlign: "right" }}>Mentions 4h</span>
          <span style={{ textAlign: "right" }}>Bullish %</span>
          <span style={{ textAlign: "center" }}>Direction</span>
          <span style={{ textAlign: "right" }}>ML Score</span>
          <span>Top Tweet</span>
        </div>

        {alerts.map((a, i) => {
          const d = a.data;
          const mult = parseFloat(String(d["Multiplier"] ?? 0));
          const mentions = parseInt(String(d["Mentions (4h)"] ?? 0));
          const bullish = parseFloat(String(d["Bullish %"] ?? 0));
          const direction = String(d["Direction"] ?? "Mixed");
          const tweet = String(d["Top Tweet"] ?? "");
          const mlScore = d["ML Score"];

          const dirColor = direction === "Bullish" ? "var(--up)" :
                           direction === "Bearish" ? "var(--down)" : "var(--ink-3)";
          const DirIcon  = direction === "Bullish" ? TrendingUp :
                           direction === "Bearish" ? TrendingDown : Minus;
          const multColor = mult >= 5 ? "var(--up)" : mult >= 3.5 ? "var(--warn)" : "var(--ink-2)";

          return (
            <div key={a.id} style={{
              display: "grid",
              gridTemplateColumns: "minmax(110px,1.1fr) 70px 80px 70px 80px 70px minmax(280px,3fr)",
              gap: 8, padding: "11px 14px", alignItems: "center",
              borderBottom: i < alerts.length - 1 ? "1px solid var(--line)" : "none",
              background: i % 2 === 0 ? "transparent" : "var(--bg-2)",
            }}>
              <a href={tv(a.symbol)} target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--ink-0)", textDecoration: "none", fontWeight: 700, fontSize: 13, fontFamily: "var(--mono)" }}>
                {a.symbol} <ExternalLink size={10} style={{ opacity: 0.5 }} />
              </a>
              <span className="num" style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: multColor }}>
                {mult.toFixed(1)}×
              </span>
              <span className="num" style={{ textAlign: "right", fontSize: 12, color: "var(--ink-1)" }}>
                {mentions}
              </span>
              <span className="num" style={{ textAlign: "right", fontSize: 12, color: bullish >= 60 ? "var(--up)" : bullish <= 30 ? "var(--down)" : "var(--ink-2)" }}>
                {bullish.toFixed(0)}%
              </span>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, color: dirColor, fontSize: 11, fontWeight: 600 }}>
                <DirIcon size={12} /> {direction}
              </span>
              <span className="num" style={{ textAlign: "right", fontSize: 12, fontWeight: 600, color: mlScore == null ? "var(--ink-4)" : (parseFloat(String(mlScore)) >= 0 ? "var(--up)" : "var(--down)") }}>
                {mlScore == null || mlScore === "" ? "—" : `${parseFloat(String(mlScore)) >= 0 ? "+" : ""}${parseFloat(String(mlScore)).toFixed(1)}%`}
              </span>
              <span style={{ fontSize: 11, color: "var(--ink-2)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                title={tweet}>
                {tweet.slice(0, 110)}{tweet.length > 110 ? "…" : ""}
              </span>
            </div>
          );
        })}
      </div>

      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>
        ℹ️ Data via Nitter (public Twitter/X mirror). Spikes are a signal — always confirm with chart + news before acting. ML Score = reranker's predicted 3-day return.
      </p>
    </div>
  );
}
