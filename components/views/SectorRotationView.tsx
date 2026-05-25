"use client";
import type { Alert } from "@/lib/types";
import { SectionHdr, Empty } from "./BigMoversView";

export default function SectorRotationView({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) return (
    <Empty msg="No sector rotation data yet. Runs daily after market close." />
  );

  const hot = alerts.filter(a => String(a.data["Strength"]).includes("HOT") || String(a.data["Strength"]) === "STRONG");
  const cold = alerts.filter(a => ["VERY WEAK","WEAK"].includes(String(a.data["Strength"])));
  const neutral = alerts.filter(a => !hot.includes(a) && !cold.includes(a));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px 18px" }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "var(--ink-0)" }}>
          🔄 Sector Rotation — Which Sectors Are Leading
        </h3>
        <p style={{ margin: 0, fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.6 }}>
          When a sector outperforms Nifty by 2%+ over 5 days, it usually continues for another 3–7 days.
          <b style={{ color: "var(--up)" }}>HOT 🔥 sectors</b> = entire sector is moving (e.g., AJMERA's +9% was real estate rotation).
        </p>
      </div>

      {hot.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHdr icon="🔥" title="HOT Sectors — Leading the Market" count={hot.length}
            hint="Outperforming Nifty by 2%+ in 5 days · Look for stocks in these sectors first" />
          <SectorTable alerts={hot} accent="var(--up)" />
        </div>
      )}

      {neutral.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHdr icon="⚪" title="Neutral Sectors" count={neutral.length} hint="Performing in line with Nifty" />
          <SectorTable alerts={neutral} accent="var(--ink-3)" />
        </div>
      )}

      {cold.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHdr icon="🥶" title="WEAK Sectors — Underperforming" count={cold.length}
            hint="Avoid stocks here — sector-wide selling pressure" />
          <SectorTable alerts={cold} accent="var(--down)" />
        </div>
      )}
    </div>
  );
}

function SectorTable({ alerts, accent }: { alerts: Alert[]; accent: string }) {
  return (
    <div style={{ background: "var(--bg-1)", border: `1px solid ${accent}30`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(140px,1.2fr) 75px 60px 80px 80px 80px minmax(220px,2fr)",
        gap: 8, padding: "10px 14px",
        color: "var(--ink-3)", fontSize: 10.5,
        textTransform: "uppercase", letterSpacing: "0.10em",
        borderBottom: "1px solid var(--line)",
      }}>
        <span>Sector</span>
        <span style={{ textAlign: "right" }}>Strength</span>
        <span style={{ textAlign: "right" }}>Dir</span>
        <span style={{ textAlign: "right" }}>5D Ret</span>
        <span style={{ textAlign: "right" }}>5D vs Nifty</span>
        <span style={{ textAlign: "right" }}>20D vs Nifty</span>
        <span>Top Stocks (TradingView links)</span>
      </div>

      {alerts.map((a, i) => {
        const d = a.data;
        const isEven = i % 2 === 0;
        const out5d = parseFloat(String(d["5D vs Nifty"] ?? 0));
        const ret5d = parseFloat(String(d["5D Return %"] ?? 0));
        const outColor = out5d >= 2 ? "var(--up)" : out5d <= -2 ? "var(--down)" : "var(--ink-2)";
        const stocks = String(d["Top Stocks"] ?? "").split(",").map(s => s.trim()).filter(Boolean);

        return (
          <div key={a.id} style={{
            display: "grid",
            gridTemplateColumns: "minmax(140px,1.2fr) 75px 60px 80px 80px 80px minmax(220px,2fr)",
            gap: 8, padding: "10px 14px", alignItems: "center",
            borderBottom: i < alerts.length - 1 ? "1px solid var(--line)" : "none",
            background: isEven ? "var(--bg-2)" : "transparent",
          }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: "var(--ink-0)" }}>{d["Sector"]}</span>
            <span style={{ textAlign: "right" }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999, color: accent, border: `1px solid ${accent}40`, background: `${accent}15` }}>
                {String(d["Strength"]).replace(" 🔥", "")}
              </span>
            </span>
            <span style={{ textAlign: "right", fontSize: 13 }}>{d["Direction"] === "UP" ? "▲" : d["Direction"] === "DOWN" ? "▼" : "▬"}</span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, color: ret5d >= 0 ? "var(--up)" : "var(--down)" }}>
              {ret5d >= 0 ? "+" : ""}{ret5d.toFixed(2)}%
            </span>
            <span className="num" style={{ textAlign: "right", fontSize: 12, fontWeight: 700, color: outColor }}>
              {out5d >= 0 ? "+" : ""}{out5d.toFixed(2)}%
            </span>
            <span className="num" style={{ textAlign: "right", fontSize: 11, color: "var(--ink-2)" }}>
              {parseFloat(String(d["20D vs Nifty"] ?? 0)) >= 0 ? "+" : ""}{parseFloat(String(d["20D vs Nifty"] ?? 0)).toFixed(1)}%
            </span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {stocks.slice(0, 5).map(s => (
                <a key={s} href={`https://www.tradingview.com/chart/?symbol=NSE:${s}`} target="_blank" rel="noreferrer"
                  style={{ fontSize: 10, padding: "2px 7px", border: "1px solid var(--line)", borderRadius: 4, color: "var(--ink-2)", textDecoration: "none", fontFamily: "var(--mono)" }}>
                  {s}
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
