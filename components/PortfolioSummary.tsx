"use client";
import { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { PortfolioEnriched, PortfolioAlertsCross, SectorAllocation } from "@/lib/types";
import { TrendingUp, TrendingDown, AlertTriangle, Bell, ChevronRight } from "lucide-react";

const PIE_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#06b6d4", "#f97316", "#84cc16", "#ec4899", "#6366f1",
  "#14b8a6", "#e11d48", "#a855f7", "#0ea5e9", "#d946ef",
];

// ── Custom tooltip for pie chart ───────────────────────────────────────
function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: "var(--bg-2)", border: "1px solid var(--line)",
      borderRadius: 8, padding: "8px 12px", fontSize: 12,
    }}>
      <div style={{ fontWeight: 600, color: "var(--ink-0)" }}>{d.sector}</div>
      <div style={{ color: "var(--ink-2)" }}>{d.pct}% · {d.count} stock{d.count !== 1 ? "s" : ""}</div>
      <div style={{ color: "var(--ink-3)" }}>₹{d.value.toLocaleString("en-IN")}</div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────
export default function PortfolioSummary() {
  const [holdings, setHoldings] = useState<PortfolioEnriched[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [alertsCross, setAlertsCross] = useState<PortfolioAlertsCross[]>([]);
  const [sectors, setSectors] = useState<SectorAllocation[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [holdRes, alertRes, sectRes] = await Promise.all([
        fetch("/api/portfolio"),
        fetch("/api/portfolio/alerts"),
        fetch("/api/portfolio/sectors"),
      ]);
      const holdData = await holdRes.json();
      const alertData = await alertRes.json();
      const sectData = await sectRes.json();

      setHoldings(holdData.holdings || []);
      setSummary(holdData.summary || null);
      setAlertsCross(alertData.alerts || []);
      setSectors(sectData.sectors || []);
      setTotalValue(sectData.total_value || 0);
    } catch (e) {
      console.error("Failed to load portfolio summary:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <div style={{ height: 300, background: "var(--bg-2)", borderRadius: 12, opacity: 0.5 }} />
      </div>
    );
  }

  if (!holdings.length) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink-3)" }}>
        Add stocks to see your portfolio summary.
      </div>
    );
  }

  const s = summary;
  const flaggedCount = alertsCross.filter((a, i, arr) => arr.findIndex(x => x.symbol === a.symbol) === i).length;

  return (
    <div style={{ padding: "4px 0", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Summary Cards ───────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <SummaryCard
          label="Total Invested"
          value={`₹${(s?.total_invested ?? 0).toLocaleString("en-IN")}`}
          icon="💰"
        />
        <SummaryCard
          label="Current Value"
          value={`₹${(s?.total_current ?? 0).toLocaleString("en-IN")}`}
          icon="📈"
        />
        <SummaryCard
          label="Total P&L"
          value={`${(s?.total_pnl ?? 0) >= 0 ? "+" : ""}₹${Math.abs(s?.total_pnl ?? 0).toLocaleString("en-IN")}`}
          sub={`${(s?.total_pnl_pct ?? 0) >= 0 ? "+" : ""}${s?.total_pnl_pct?.toFixed(1) ?? "0"}%`}
          tone={(s?.total_pnl ?? 0) >= 0 ? "up" : "down"}
          icon={(s?.total_pnl ?? 0) >= 0 ? "🟢" : "🔴"}
        />
        <SummaryCard
          label="Holdings"
          value={`${s?.holding_count ?? 0} stocks`}
          icon="📊"
        />
      </div>

      {/* ── Best / Worst performers ──────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{
          background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: 12, padding: 16,
        }}>
          <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            🏆 Best Performer
          </div>
          {s?.best_performer ? (
            <div>
              <span style={{ fontWeight: 700, color: "var(--up)", fontSize: 16 }}>{s.best_performer.symbol}</span>
              <span style={{ marginLeft: 10, fontWeight: 600, color: "var(--up)", fontSize: 14 }}>
                +{s.best_performer.pnl_pct.toFixed(1)}%
              </span>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>
                +₹{s.best_performer.pnl.toLocaleString("en-IN")}
              </div>
            </div>
          ) : (
            <span style={{ color: "var(--ink-4)" }}>—</span>
          )}
        </div>
        <div style={{
          background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 12, padding: 16,
        }}>
          <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            🔻 Worst Performer
          </div>
          {s?.worst_performer ? (
            <div>
              <span style={{ fontWeight: 700, color: "var(--down)", fontSize: 16 }}>{s.worst_performer.symbol}</span>
              <span style={{ marginLeft: 10, fontWeight: 600, color: "var(--down)", fontSize: 14 }}>
                {s.worst_performer.pnl_pct.toFixed(1)}%
              </span>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>
                {s.worst_performer.pnl >= 0 ? "+" : ""}₹{s.worst_performer.pnl.toLocaleString("en-IN")}
              </div>
            </div>
          ) : (
            <span style={{ color: "var(--ink-4)" }}>—</span>
          )}
        </div>
      </div>

      {/* ── Sector Pie Chart + Scanner Alerts ────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Sector Pie */}
        <div style={{
          background: "var(--bg-2)", border: "1px solid var(--line)",
          borderRadius: 12, padding: 20,
        }}>
          <h4 style={{ margin: "0 0 16px", color: "var(--ink-0)", fontSize: 14 }}>
            🟠 Sector Allocation
          </h4>
          {sectors.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={sectors}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="var(--bg-2)"
                    strokeWidth={2}
                  >
                    {sectors.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 8 }}>
                {sectors.slice(0, 10).map((sec, i) => (
                  <div key={sec.sector} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: PIE_COLORS[i % PIE_COLORS.length],
                      flexShrink: 0,
                    }} />
                    <span style={{ color: "var(--ink-2)" }}>{sec.sector}</span>
                    <span style={{ color: "var(--ink-3)", fontWeight: 600 }}>{sec.pct}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", color: "var(--ink-4)", padding: 40 }}>No sector data yet</div>
          )}
        </div>

        {/* Scanner Cross-Reference */}
        <div style={{
          background: "var(--bg-2)", border: "1px solid var(--line)",
          borderRadius: 12, padding: 20,
        }}>
          <h4 style={{ margin: "0 0 16px", color: "var(--ink-0)", fontSize: 14 }}>
            🔔 Scanner Cross-Reference
          </h4>
          {alertsCross.length > 0 ? (
            <>
              <div style={{
                marginBottom: 14, padding: "8px 14px", borderRadius: 8,
                background: flaggedCount > 0 ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.08)",
                border: `1px solid ${flaggedCount > 0 ? "rgba(245,158,11,0.25)" : "rgba(34,197,94,0.2)"}`,
                fontSize: 12, color: "var(--ink-1)", fontWeight: 500,
              }}>
                {flaggedCount > 0
                  ? `⚠️ ${flaggedCount} of ${holdings.length} holdings flagged in today's scans`
                  : `✅ None of your ${holdings.length} holdings triggered scanner alerts today`
                }
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 240, overflowY: "auto" }}>
                {alertsCross.map((a, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.hash = a.tab_id;
                      window.location.href = url.toString();
                    }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "8px 12px", borderRadius: 8,
                      background: "var(--bg-1)", border: "1px solid var(--line)",
                      cursor: "pointer", transition: "border-color .15s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--line)")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, color: "var(--accent)", fontSize: 13 }}>
                        {a.symbol}
                      </span>
                      <span style={{ color: "var(--ink-3)", fontSize: 11 }}>
                        {a.scan_label}
                      </span>
                    </div>
                    <ChevronRight size={14} style={{ color: "var(--ink-4)" }} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", color: "var(--ink-4)", padding: 40 }}>
              <Bell size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
              <div>No scanner alerts for your holdings today.</div>
              <div style={{ fontSize: 11, marginTop: 4 }}>Alerts appear when scanners detect activity.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ── Summary Card sub-component ───────────────────────────────────────────
function SummaryCard({ label, value, sub, tone, icon }: {
  label: string;
  value: string;
  sub?: string;
  tone?: "up" | "down";
  icon?: string;
}) {
  return (
    <div style={{
      background: "var(--bg-2)", border: "1px solid var(--line)",
      borderRadius: 12, padding: 16,
    }}>
      <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
        {icon && <span style={{ marginRight: 4 }}>{icon}</span>}
        {label}
      </div>
      <div style={{
        fontSize: 20, fontWeight: 700,
        color: tone === "up" ? "var(--up)" : tone === "down" ? "var(--down)" : "var(--ink-0)",
      }}>
        {value}
      </div>
      {sub && (
        <div style={{
          fontSize: 13, fontWeight: 600, marginTop: 2,
          color: tone === "up" ? "var(--up)" : tone === "down" ? "var(--down)" : "var(--ink-2)",
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}
