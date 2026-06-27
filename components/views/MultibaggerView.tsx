"use client";
import { useState, useEffect } from "react";
import type { Alert } from "@/lib/types";
import { Empty } from "./BigMoversView";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Sparkline from "@/components/ui/Sparkline";
import CandleHoverCard from "@/components/ui/CandleHoverCard";

function tv(symbol: string) {
  return `https://www.tradingview.com/chart/?symbol=NSE:${symbol}`;
}

const TIMING_COLOR: Record<string, string> = {
  "Long Base Breakout": "#caa400",
  "Starting Momentum": "var(--up)",
  "Trending, Room Left": "var(--accent-2)",
  "Already Extended": "var(--warn)",
};

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{
      padding: "8px 10px", textAlign: "left", whiteSpace: "nowrap",
      color: "var(--ink-3)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.06em",
      borderBottom: "1px solid var(--line)", background: "rgba(91,140,255,.06)",
    }}>
      {children}
    </th>
  );
}

function Td({ children, mono = false }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td className={mono ? "num" : undefined} style={{
      padding: "8px 10px", fontSize: 12, color: "var(--ink-1)", whiteSpace: "nowrap",
      borderBottom: "1px solid var(--line)",
    }}>
      {children}
    </td>
  );
}

export default function MultibaggerView({ alerts }: { alerts: Alert[] }) {
  const [dailyCloses, setDailyCloses] = useState<Record<string, number[]>>({});

  useEffect(() => {
    const symbols = alerts.map(a => a.symbol);
    if (symbols.length === 0) return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("candle_cache")
        .select("symbol, candles")
        .eq("timeframe", "1d")
        .in("symbol", symbols);
      if (cancelled || error || !data) return;
      const map: Record<string, number[]> = {};
      for (const row of data) {
        const candles = row.candles as [string, number, number, number, number, number, number][];
        map[row.symbol] = candles.map(c => c[4]); // close price
      }
      setDailyCloses(map);
    })();
    return () => { cancelled = true; };
  }, [alerts]);

  if (!alerts.length) return (
    <Empty msg="No multibagger candidates surfaced yet. This scanner needs at least a catalyst or fundamentals signal to show a stock — a quiet day across all 9 priority sectors is a real 'no signal', not a failure." />
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--ink-0)" }}>💎 Multibagger Stocks</h2>
      <p style={{ margin: 0, fontSize: 11.5, color: "var(--ink-3)" }}>
        Top {alerts.length} candidates after deep analysis (sector + catalyst + fundamentals + technical timing).
        Only stocks above their daily EMA-51 with real upward momentum qualify.
      </p>

      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 1700 }}>
          <thead>
            <tr>
              <Th>Stock</Th><Th>LTP</Th><Th>LTP%</Th><Th>Line Chart</Th>
              <Th>Vol Chg%</Th><Th>Vol Chg 3D%</Th>
              <Th>Industry Reason</Th><Th>Business Reason (Moat)</Th>
              <Th>Timing</Th><Th>RSI</Th><Th>ATR</Th><Th>BB Width%</Th><Th>Consolidation</Th><Th>EMA51</Th><Th>EMA21</Th>
              <Th>Sector</Th><Th>EPS</Th><Th>ROE%</Th><Th>ROCE%*</Th><Th>PE</Th><Th>PEG</Th><Th>Sales Gr%</Th>
              <Th>Promoter%</Th><Th>Promoter Prior%</Th><Th>Recent News</Th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a, i) => <Row key={a.id} alert={a} isEven={i % 2 === 0} closes={dailyCloses[a.symbol]} />)}
          </tbody>
        </table>
      </div>

      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>
        ⚠️ ROCE* uses Return on Assets as a proxy (no true ROCE field). Promoter % &quot;prior&quot; is our last
        scan snapshot at least ~25 days back, not a genuine monthly disclosure — Indian promoter holding is
        disclosed quarterly under SEBI Reg 31, not monthly.
      </p>
      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>
        🕐 This tab updates last, after every other panel has refreshed for the day, and can take 5-10+ extra
        minutes past market close before it reflects today&apos;s data.
      </p>
    </div>
  );
}

function Row({ alert: a, isEven, closes }: { alert: Alert; isEven: boolean; closes?: number[] }) {
  const d = a.data;
  const timing = String(d["Technical Timing"] ?? "Unknown");
  const timingColor = TIMING_COLOR[timing] ?? "var(--ink-3)";
  const ltpChg = num(d["LTP %"]);
  const consolidation = num(d["Consolidation Days"]);

  return (
    <tr style={{ background: isEven ? "rgba(91,140,255,.03)" : "transparent" }}>
      <Td>
        <CandleHoverCard symbol={a.symbol}>
          <a href={tv(a.symbol)} target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--ink-0)", textDecoration: "none", fontWeight: 700, fontFamily: "var(--mono)" }}>
            {a.symbol} <ExternalLink size={10} style={{ opacity: 0.5 }} />
          </a>
        </CandleHoverCard>
      </Td>
      <Td mono>{d["LTP"] != null ? `₹${d["LTP"]}` : "—"}</Td>
      <Td mono>
        {ltpChg != null ? <span style={{ color: ltpChg >= 0 ? "var(--up)" : "var(--down)" }}>{ltpChg >= 0 ? "+" : ""}{ltpChg}%</span> : "—"}
      </Td>
      <Td>{closes && closes.length > 1 ? <Sparkline data={closes} w={90} h={28} color="var(--accent-2)" /> : "—"}</Td>
      <Td mono>{d["Volume Change %"] != null ? `${d["Volume Change %"]}%` : "—"}</Td>
      <Td mono>{d["Volume Change 3D %"] != null ? `${d["Volume Change 3D %"]}%` : "—"}</Td>
      <Td>{String(d["Industry Reason"] ?? "—")}</Td>
      <Td>{String(d["Business Reason (Moat)"] ?? "—")}</Td>
      <Td><span style={{ fontWeight: 600, color: timingColor }}>{timing}</span></Td>
      <Td mono>{d["RSI"] ?? "—"}</Td>
      <Td mono>{d["ATR"] ?? "—"}</Td>
      <Td mono>{d["BB Width %"] != null ? `${d["BB Width %"]}%` : "—"}</Td>
      <Td mono>{consolidation != null ? `${consolidation}d (${(consolidation / 21).toFixed(1)}mo)` : "—"}</Td>
      <Td mono>{d["EMA51"] != null ? `₹${d["EMA51"]}` : "—"}</Td>
      <Td mono>{d["EMA21"] != null ? `₹${d["EMA21"]}` : "—"}</Td>
      <Td>{String(d["Sector"] ?? "—")}</Td>
      <Td mono>{d["EPS"] != null ? `₹${d["EPS"]}` : "—"}</Td>
      <Td mono>{d["ROE %"] != null ? `${d["ROE %"]}%` : "—"}</Td>
      <Td mono>{d["ROCE % (approx.)"] != null ? `${d["ROCE % (approx.)"]}%` : "—"}</Td>
      <Td mono>{d["PE Ratio"] ?? "—"}</Td>
      <Td mono>{d["PEG"] ?? "—"}</Td>
      <Td mono>{d["Sales Growth %"] != null ? `${d["Sales Growth %"]}%` : "—"}</Td>
      <Td mono>{d["Promoter Holding %"] != null ? `${d["Promoter Holding %"]}%` : "—"}</Td>
      <Td mono>{d["Promoter Holding Prior %"] != null ? `${d["Promoter Holding Prior %"]}%` : "n/a yet"}</Td>
      <Td>{String(d["Recent News"] ?? "—")}</Td>
    </tr>
  );
}
