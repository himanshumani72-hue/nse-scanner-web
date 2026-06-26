"use client";
import { useState, useEffect } from "react";
import type { Alert } from "@/lib/types";
import { Empty } from "./BigMoversView";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import MiniCandlestick, { RawCandle } from "@/components/ui/MiniCandlestick";
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

export default function MultibaggerView({ alerts }: { alerts: Alert[] }) {
  const [dailyCandles, setDailyCandles] = useState<Record<string, RawCandle[]>>({});

  // Batch-fetch all visible symbols' daily candles in one query instead
  // of N separate hover-triggered fetches — these charts are always
  // visible in the table, not hover-revealed.
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
      const map: Record<string, RawCandle[]> = {};
      for (const row of data) map[row.symbol] = row.candles as RawCandle[];
      setDailyCandles(map);
    })();
    return () => { cancelled = true; };
  }, [alerts]);

  if (!alerts.length) return (
    <Empty msg="No multibagger candidates surfaced yet. This scanner needs at least a catalyst or fundamentals signal to show a stock — a quiet day across all 9 priority sectors is a real 'no signal', not a failure." />
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--ink-0)" }}>
        💎 Multibagger Stocks
      </h2>
      <p style={{ margin: 0, fontSize: 11.5, color: "var(--ink-3)" }}>
        Top {alerts.length} candidates after deep analysis (sector + catalyst + fundamentals + technical timing).
        Only stocks above their daily EMA-51 with real upward momentum qualify — nothing below trend is shown.
      </p>

      <MultibaggerTable alerts={alerts} dailyCandles={dailyCandles} />

      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>
        ⚠️ ROCE uses Return on Assets as a proxy (no true ROCE field). Promoter holding uses insider-holding %
        (doesn&apos;t separate promoter from other insiders, no pledge-share data) — &quot;prior&quot; is our last
        scan snapshot at least ~25 days back, not a genuine monthly disclosure (Indian promoter holding is
        disclosed quarterly, not monthly). Treat as a research starting point, not a final number.
      </p>
      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>
        🕐 This tab updates last, after every other panel has refreshed for the day, and can take 5-10+ extra
        minutes past market close before it reflects today&apos;s data.
      </p>
    </div>
  );
}

function MultibaggerTable({ alerts, dailyCandles }: { alerts: Alert[]; dailyCandles: Record<string, RawCandle[]> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {alerts.map((a, i) => (
        <MultibaggerCard key={a.id} alert={a} rank={i + 1} dailyCandles={dailyCandles[a.symbol]} />
      ))}
    </div>
  );
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 64 }}>
      <span style={{ fontSize: 9.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      <span className="num" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-1)" }}>{value}</span>
    </div>
  );
}

function MultibaggerCard({ alert: a, rank, dailyCandles }: { alert: Alert; rank: number; dailyCandles?: RawCandle[] }) {
  const [expanded, setExpanded] = useState(false);
  const d = a.data;
  const score = parseFloat(String(d["Final Score"] ?? 0));
  const timing = String(d["Technical Timing"] ?? "Unknown");
  const timingColor = TIMING_COLOR[timing] ?? "var(--ink-3)";
  const scoreColor = score >= 6 ? "var(--up)" : score >= 4 ? "var(--accent-2)" : "var(--ink-3)";
  const fullWriteup = String(d["Full Writeup"] ?? "").trim();

  const peg = d["PEG"];
  const rsi = d["RSI"];
  const pctEma51 = d["% Above EMA51"];
  const bbWidth = d["BB Width %"];
  const promoterNow = d["Promoter Holding %"];
  const promoterPrior = d["Promoter Holding Prior %"];
  const promoterChange = d["Promoter Holding Change (pp)"];

  return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: 16 }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Symbol + sector + score */}
        <div style={{ minWidth: 130 }}>
          <span style={{ fontSize: 10, color: "var(--ink-4)" }}>#{rank}</span>
          <CandleHoverCard symbol={a.symbol}>
            <a href={tv(a.symbol)} target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--ink-0)", textDecoration: "none", fontWeight: 700, fontSize: 15, fontFamily: "var(--mono)" }}>
              {a.symbol} <ExternalLink size={11} style={{ opacity: 0.5 }} />
            </a>
          </CandleHoverCard>
          <div style={{ fontSize: 11, color: "var(--ink-2)", marginTop: 2 }}>{String(d["Sector"] ?? "—")}</div>
          <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", gap: 6 }}>
            <span className="num" style={{ fontSize: 18, fontWeight: 700, color: scoreColor }}>{score.toFixed(1)}</span>
            <span style={{ fontSize: 10, color: "var(--ink-4)" }}>/10</span>
          </div>
          <span style={{ fontSize: 10.5, fontWeight: 600, color: timingColor }}>{timing}</span>
          {d["LTP"] != null && (
            <div className="num" style={{ fontSize: 12, color: "var(--ink-1)", marginTop: 4 }}>₹{d["LTP"]}</div>
          )}
        </div>

        {/* Daily chart, inline (not hover) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Daily</span>
          {dailyCandles && dailyCandles.length > 0 ? (
            <MiniCandlestick candles={dailyCandles} w={150} h={90} />
          ) : (
            <span style={{ fontSize: 10, color: "var(--ink-4)", width: 150, height: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
              No chart data yet
            </span>
          )}
        </div>

        {/* Fundamentals table */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <MetricCell label="PEG" value={peg != null ? String(peg) : "—"} />
          <MetricCell label="Promoter Now" value={promoterNow != null ? `${promoterNow}%` : "—"} />
          <MetricCell label="Promoter Prior" value={promoterPrior != null ? `${promoterPrior}%` : "n/a yet"} />
          <MetricCell label="Promoter Δ" value={promoterChange != null ? `${Number(promoterChange) > 0 ? "+" : ""}${promoterChange}pp` : "—"} />
        </div>

        {/* Technical table */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <MetricCell label="RSI" value={rsi != null ? String(rsi) : "—"} />
          <MetricCell label="vs EMA-51" value={pctEma51 != null ? `+${pctEma51}%` : "—"} />
          <MetricCell label="BB Width" value={bbWidth != null ? `${bbWidth}%` : "—"} />
        </div>
      </div>

      {/* Bolded reason */}
      <p style={{ margin: "12px 0 0", fontSize: 12, fontWeight: 700, color: "var(--ink-0)", lineHeight: 1.5 }}>
        {String(d["Reason"] ?? "")}
      </p>

      {fullWriteup && (
        <>
          <button onClick={() => setExpanded(v => !v)} style={{
            display: "flex", alignItems: "center", gap: 3, marginTop: 8,
            background: "none", border: "none", padding: 0, cursor: "pointer",
            fontSize: 11.5, fontWeight: 600, color: "var(--accent-2)",
          }}>
            {expanded ? <>Show less <ChevronUp size={12} /></> : <>See full thesis <ChevronDown size={12} /></>}
          </button>
          {expanded && (
            <div style={{ marginTop: 8, fontSize: 12.5, color: "var(--ink-1)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {fullWriteup}
            </div>
          )}
        </>
      )}
    </div>
  );
}
