"use client";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

type Horizon = "1d" | "3d" | "7d" | "30d";
const HORIZONS: Horizon[] = ["1d", "3d", "7d", "30d"];

interface HorizonStat {
  count: number;
  win_rate: number | null;
  avg_return: number | null;
}

interface ScanTypeStat {
  scan_type: string;
  total_signals: number;
  last_signal_at: string | null;
  horizons: Record<Horizon, HorizonStat>;
}

function scanLabel(scanType: string): string {
  return scanType
    .split("_")
    .map(w => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

function ReturnCell({ stat }: { stat: HorizonStat }) {
  if (stat.count === 0 || stat.avg_return === null) {
    return <span style={{ color: "var(--ink-4)", fontSize: 11 }}>—</span>;
  }
  const positive = stat.avg_return >= 0;
  const color = positive ? "var(--up)" : "var(--down)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontWeight: 700, fontSize: 13, color }}>
        {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {positive ? "+" : ""}{stat.avg_return.toFixed(2)}%
      </span>
      <span style={{ fontSize: 11, color: "var(--ink-3)" }}>
        {stat.win_rate}% win · n={stat.count}
      </span>
    </div>
  );
}

export default function TrackRecordView() {
  const [stats, setStats] = useState<ScanTypeStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/track-record");
        const data = await res.json();
        if (data.error) { setError(data.error); return; }
        setStats(data.stats || []);
      } catch (e: any) {
        setError(e.message || "Failed to load track record");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--ink-3)" }}>Loading track record…</div>;
  }
  if (error) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--down)" }}>{error}</div>;
  }
  if (stats.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--ink-3)" }}>
        No signals logged yet. Track record builds up as scanners run — check back after a few trading days.
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "var(--ink-0)" }}>
          📈 Scanner Track Record
        </h2>
        <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.5 }}>
          Average forward return and win-rate (% of signals with a positive return) for each scanner,
          measured 1/3/7/30 trading days after the signal was generated. Past performance does not
          guarantee future results — for informational purposes only.
        </p>
      </div>

      <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--line)", background: "var(--bg-2)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--line)", background: "var(--bg-1)" }}>
              {["Scanner", "Signals", "1 Day", "3 Days", "7 Days", "30 Days"].map(label => (
                <th key={label} style={{
                  padding: "10px 12px", textAlign: "left", fontWeight: 600, fontSize: 11,
                  color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                }}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => (
              <tr key={s.scan_type} style={{ borderBottom: i < stats.length - 1 ? "1px solid var(--line)" : "none" }}>
                <td style={{ padding: "10px 12px", fontWeight: 600, color: "var(--ink-0)", whiteSpace: "nowrap" }}>
                  {scanLabel(s.scan_type)}
                </td>
                <td style={{ padding: "10px 12px", color: "var(--ink-2)" }}>{s.total_signals}</td>
                {HORIZONS.map(h => (
                  <td key={h} style={{ padding: "10px 12px" }}>
                    <ReturnCell stat={s.horizons[h]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
