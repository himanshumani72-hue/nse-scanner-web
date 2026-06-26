"use client";
import type { Alert } from "@/lib/types";
import { SectionHdr, Empty } from "./BigMoversView";
import { ExternalLink } from "lucide-react";
import CandleHoverCard from "@/components/ui/CandleHoverCard";

function tv(symbol: string) {
  return `https://www.tradingview.com/chart/?symbol=NSE:${symbol}`;
}

export default function AboutToFallView({
  boomerangAlerts,
  panelsData,
}: {
  boomerangAlerts: Alert[];
  panelsData?: any;
}) {
  const falling = panelsData?.falling_stocks || [];
  const hasBoomerang = boomerangAlerts.length > 0;
  const hasFalling = falling.length > 0;

  if (!hasBoomerang && !hasFalling) {
    return <Empty msg="No stocks showing reversal or distribution signals today." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── BOOMERANG REVERSAL ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionHdr
          icon="🔴"
          title="Boomerang (Reversal) — Overbought + MACD Turning Down"
          count={boomerangAlerts.length}
          hint="High delivery + 1M gain >8% + Williams %R overbought + MACD bearish crossover · Avoid buying these"
        />

        {hasBoomerang ? (
          <div style={{ background: "var(--bg-1)", border: "1px solid rgba(255,93,108,.3)", borderRadius: 14, overflow: "hidden" }}>
            {/* Header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "minmax(130px,1.5fr) 80px 70px 65px 55px 70px 65px 60px minmax(180px,2fr)",
              gap: 8, padding: "10px 14px",
              color: "var(--ink-3)", fontSize: 10.5,
              textTransform: "uppercase", letterSpacing: "0.10em",
              borderBottom: "1px solid var(--line)", background: "rgba(255,93,108,.06)"
            }}>
              <span>Symbol</span>
              <span style={{ textAlign: "right" }}>LTP</span>
              <span style={{ textAlign: "right" }}>Today %</span>
              <span style={{ textAlign: "right" }}>1M %</span>
              <span style={{ textAlign: "right" }}>RSI</span>
              <span style={{ textAlign: "right" }}>Williams %R</span>
              <span style={{ textAlign: "right" }}>Delivery</span>
              <span style={{ textAlign: "right" }}>Risk</span>
              <span>Why Bearish</span>
            </div>

            {boomerangAlerts.map((a, i) => {
              const d = a.data;
              const todayChg = parseFloat(String(d["Today Chg %"] ?? 0));
              const rsi      = parseFloat(String(d["RSI"] ?? 0));
              const wr       = parseFloat(String(d["Williams %R"] ?? 0));
              const score    = parseInt(String(d["Bear Score"] ?? 0));
              const deliv    = parseFloat(String(d["Delivery %"] ?? 0));
              const isEven   = i % 2 === 0;
              const risk     = score >= 9 ? "EXTREME" : score >= 7 ? "HIGH" : "MODERATE";
              const riskColor = risk === "EXTREME" ? "var(--down)" : risk === "HIGH" ? "var(--warn)" : "var(--ink-3)";

              return (
                <div key={a.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(130px,1.5fr) 80px 70px 65px 55px 70px 65px 60px minmax(180px,2fr)",
                    gap: 8, padding: "10px 14px", alignItems: "center",
                    borderBottom: i < boomerangAlerts.length - 1 ? "1px solid var(--line)" : "none",
                    background: isEven ? "rgba(255,93,108,.04)" : "transparent",
                    cursor: "pointer", transition: "background .12s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,93,108,.08)")}
                  onMouseLeave={e => (e.currentTarget.style.background = isEven ? "rgba(255,93,108,.04)" : "transparent")}>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                      background: "rgba(255,93,108,.12)", border: "1px solid rgba(255,93,108,.3)",
                      display: "grid", placeItems: "center",
                      fontSize: 9, fontWeight: 700, color: "var(--down)", fontFamily: "var(--mono)"
                    }}>
                      {a.symbol.slice(0, 2)}
                    </div>
                    <CandleHoverCard symbol={a.symbol}>
                      <a href={tv(a.symbol)} target="_blank" rel="noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--down)", textDecoration: "none", fontWeight: 700, fontSize: 13, fontFamily: "var(--mono)" }}>
                        {a.symbol} <ExternalLink size={10} style={{ opacity: 0.5 }} />
                      </a>
                    </CandleHoverCard>
                  </div>

                  <span className="num" style={{ textAlign: "right", fontSize: 12, color: "var(--ink-0)" }}>₹{d["LTP"]}</span>
                  <span className="num" style={{ textAlign: "right", fontSize: 12, fontWeight: 600, color: todayChg >= 0 ? "var(--up)" : "var(--down)" }}>
                    {todayChg >= 0 ? "+" : ""}{todayChg.toFixed(1)}%
                  </span>
                  <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--warn)" }}>+{d["1M Chg %"]}%</span>
                  <span className="num" style={{ textAlign: "right", fontSize: 12, fontWeight: 600, color: rsi >= 70 ? "var(--down)" : "var(--warn)" }}>{rsi.toFixed(0)}</span>
                  <span className="num" style={{ textAlign: "right", fontSize: 11, color: wr > -10 ? "var(--down)" : "var(--warn)" }}>{wr.toFixed(1)}</span>
                  <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--ink-3)" }}>{deliv.toFixed(1)}%</span>
                  <span style={{ textAlign: "right" }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999,
                      background: risk === "EXTREME" ? "rgba(255,93,108,.15)" : risk === "HIGH" ? "rgba(243,181,74,.15)" : "transparent",
                      color: riskColor, border: `1px solid ${riskColor}40`
                    }}>{risk}</span>
                  </span>
                  <div style={{ fontSize: 10.5, color: "var(--ink-3)", lineHeight: 1.4 }}>
                    {String(d["Why Bearish"] ?? "Overbought reversal signal")}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "24px", textAlign: "center", color: "var(--ink-3)", fontSize: 13 }}>
            No Boomerang reversal signals today ✅
          </div>
        )}
      </div>

      {/* ── 5 STOCKS ABOUT TO FALL (from panel_updater) ── */}
      {hasFalling && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHdr
            icon="🔻"
            title="Distribution Signals — Bearish Setups"
            count={falling.length}
            hint="Condition A: RSI ≤ 45 + Death Cross (20DMA < 50DMA) | Condition B: RSI > 81 + price falling + volume declining"
          />

          <div style={{ background: "var(--bg-1)", border: "1px solid rgba(255,93,108,.2)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "minmax(120px,1.5fr) 80px 55px 80px 130px 70px minmax(200px,2fr)",
              gap: 8, padding: "10px 14px",
              color: "var(--ink-3)", fontSize: 10.5,
              textTransform: "uppercase", letterSpacing: "0.10em",
              borderBottom: "1px solid var(--line)", background: "rgba(255,93,108,.05)"
            }}>
              <span>Symbol</span>
              <span style={{ textAlign: "right" }}>Close</span>
              <span style={{ textAlign: "right" }}>RSI</span>
              <span style={{ textAlign: "right" }}>Today %</span>
              <span>Signal Type</span>
              <span style={{ textAlign: "right" }}>Score</span>
              <span>Reason</span>
            </div>

            {falling.map((f: any, i: number) => {
              const isExhaustion = f["Signal"] === "EXHAUSTION TOP";
              return (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(120px,1.5fr) 80px 55px 80px 130px 70px minmax(200px,2fr)",
                  gap: 8, padding: "10px 14px", alignItems: "center",
                  borderBottom: i < falling.length - 1 ? "1px solid var(--line)" : "none",
                  background: i % 2 === 0 ? "rgba(255,93,108,.04)" : "transparent",
                  cursor: "pointer", transition: "background .12s ease",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,93,108,.08)")}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "rgba(255,93,108,.04)" : "transparent")}>

                  <CandleHoverCard symbol={f.Symbol}>
                  <a href={tv(f.Symbol)} target="_blank" rel="noreferrer"
                    style={{ fontWeight: 700, color: "var(--down)", textDecoration: "none", fontFamily: "var(--mono)", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
                    {f.Symbol} <ExternalLink size={10} style={{ opacity: 0.5 }} />
                  </a>
                  </CandleHoverCard>
                  <span className="num" style={{ textAlign: "right", fontSize: 12, color: "var(--ink-0)" }}>₹{f.Close}</span>
                  <span className="num" style={{
                    textAlign: "right", fontWeight: 700, fontSize: 13,
                    color: f.RSI > 81 ? "var(--down)" : "var(--warn)"
                  }}>{f.RSI}</span>
                  <span className="num" style={{
                    textAlign: "right", fontSize: 12,
                    color: f["Today Chg %"] < 0 ? "var(--down)" : "var(--up)"
                  }}>{f["Today Chg %"] > 0 ? "+" : ""}{f["Today Chg %"]}%</span>
                  <span>
                    <span style={{
                      padding: "2px 8px", borderRadius: 999, fontSize: 10.5, fontWeight: 600,
                      background: isExhaustion ? "rgba(255,93,108,.18)" : "rgba(243,181,74,.15)",
                      color: isExhaustion ? "var(--down)" : "var(--warn)",
                      border: `1px solid ${isExhaustion ? "rgba(255,93,108,.4)" : "rgba(243,181,74,.4)"}`,
                    }}>
                      {isExhaustion ? "🔥 Exhaustion Top" : "☠️ Death Cross"}
                    </span>
                  </span>
                  <span className="num" style={{ textAlign: "right", fontWeight: 700, color: "var(--down)", fontSize: 16 }}>{f["Bear Score"]}</span>
                  <span style={{ fontSize: 11, color: "var(--ink-3)", lineHeight: 1.4 }}>{f.Reason}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)", paddingLeft: 2 }}>
        ⚠️ These are risk signals only — not short-sell recommendations. If you hold any of these stocks, consider tightening your stop loss.
      </p>
    </div>
  );
}
