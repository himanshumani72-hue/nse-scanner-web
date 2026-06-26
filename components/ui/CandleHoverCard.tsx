"use client";
import { useState, useRef, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import MiniCandlestick, { RawCandle } from "./MiniCandlestick";

const CARD_HEIGHT_ESTIMATE = 160; // approx rendered height, used for viewport-edge flip

const TIMEFRAME_LABELS: { key: string; label: string }[] = [
  { key: "5m", label: "5 Min" },
  { key: "15m", label: "15 Min" },
  { key: "2h", label: "2 Hour" },
  { key: "1d", label: "1 Day" },
];

// Module-level cache shared across all hover cards on the page — avoids
// refetching candle_cache every time the same symbol is re-hovered during
// a session. Cleared on full page reload only.
const candleCacheBySymbol = new Map<string, Record<string, RawCandle[]>>();

interface Props {
  symbol: string;
  children: ReactNode;
}

export default function CandleHoverCard({ symbol, children }: Props) {
  const [visible, setVisible] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [data, setData] = useState<Record<string, RawCandle[]> | null>(candleCacheBySymbol.get(symbol) ?? null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Flip the card above the trigger when there isn't enough room below
  // (e.g. the last row in a list near the bottom of the viewport) —
  // otherwise it renders partially off-screen / clipped.
  useEffect(() => {
    if (!visible || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setOpenUpward(spaceBelow < CARD_HEIGHT_ESTIMATE && rect.top > spaceBelow);
  }, [visible]);

  const fetchIfNeeded = async () => {
    if (candleCacheBySymbol.has(symbol)) {
      setData(candleCacheBySymbol.get(symbol)!);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data: rows, error } = await supabase
      .from("candle_cache")
      .select("timeframe, candles")
      .eq("symbol", symbol);
    setLoading(false);
    if (error || !rows) return;
    const byTf: Record<string, RawCandle[]> = {};
    for (const row of rows) byTf[row.timeframe] = row.candles as RawCandle[];
    candleCacheBySymbol.set(symbol, byTf);
    setData(byTf);
  };

  const onEnter = () => {
    timerRef.current = setTimeout(() => {
      setVisible(true);
      fetchIfNeeded();
    }, 200);
  };

  const onLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", display: "inline-block" }} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {children}
      {visible && (
        <div style={{
          position: "absolute", left: 0, zIndex: 50,
          ...(openUpward ? { bottom: "100%", marginBottom: 6 } : { top: "100%", marginTop: 6 }),
          background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12,
          padding: 16, boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
          display: "flex", gap: 18, whiteSpace: "nowrap",
        }}>
          {loading && !data && (
            <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Loading…</span>
          )}
          {TIMEFRAME_LABELS.map(({ key, label }) => {
            const candles = data?.[key];
            return (
              <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                  {label}
                </span>
                {candles && candles.length > 0 ? (
                  <MiniCandlestick candles={candles} w={150} h={90} />
                ) : (
                  <span style={{ fontSize: 11, color: "var(--ink-4)", width: 150, height: 90, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                    {data ? "No data yet" : "—"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
