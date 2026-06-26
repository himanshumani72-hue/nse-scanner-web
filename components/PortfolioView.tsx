"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PortfolioEnriched, PortfolioAlertsCross } from "@/lib/types";
import { TrendingUp, TrendingDown, ExternalLink, Plus, Trash2, Edit3 } from "lucide-react";
import CandleHoverCard from "@/components/ui/CandleHoverCard";

// ── TradingView link ─────────────────────────────────────────────────────
function tvLink(symbol: string, exchange: string = "NSE") {
  const ex = exchange === "BSE" ? "BSE" : "NSE";
  return `https://www.tradingview.com/chart/?symbol=${ex}:${symbol}`;
}

// ── Recommendation badge ──────────────────────────────────────────────────
function RecBadge({ rec, reasons }: { rec: string | null; reasons: string[] | null }) {
  if (!rec || rec === "NEUTRAL") return <span style={{ color: "var(--ink-3)", fontSize: 12 }}>—</span>;
  const colors: Record<string, { bg: string; fg: string; emoji: string }> = {
    RED_FLAG:  { bg: "rgba(239,68,68,0.12)", fg: "#ef4444", emoji: "🚩" },
    WARNING:   { bg: "rgba(245,158,11,0.12)", fg: "#f59e0b", emoji: "⚠️" },
    GOOD_NEWS: { bg: "rgba(34,197,94,0.12)",  fg: "#22c55e", emoji: "✅" },
  };
  const c = colors[rec] || colors.GOOD_NEWS;
  return (
    <span
      title={reasons?.join(" • ") || ""}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "2px 10px", borderRadius: 20,
        background: c.bg, color: c.fg, fontSize: 11, fontWeight: 600,
        cursor: "help",
      }}
    >
      {c.emoji} {rec.replace(/_/g, " ")}
    </span>
  );
}

// ── Relative time formatting ─────────────────────────────────────────────
function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diffSec < 0) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}

// ── Composite conviction score badge ────────────────────────────────────
function ScoreBadge({ score, label }: { score: number | null; label: string | null }) {
  if (score === null || score === undefined) return <span style={{ color: "var(--ink-3)", fontSize: 12 }}>—</span>;
  let color = "var(--ink-3)";
  if (score >= 70) color = "#22c55e";
  else if (score >= 55) color = "#84cc16";
  else if (score > 45) color = "var(--ink-3)";
  else if (score > 30) color = "#f59e0b";
  else color = "#ef4444";
  return (
    <span
      title={label || ""}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontWeight: 700, fontSize: 12, color,
        padding: "2px 8px", borderRadius: 6, background: `${color}15`,
        cursor: "help",
      }}
    >
      {score}
      <span style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-3)" }}>{label}</span>
    </span>
  );
}

// ── RSI color scale ───────────────────────────────────────────────────────
function rsiColor(rsi: number | null): string {
  if (rsi === null) return "var(--ink-3)";
  if (rsi >= 75) return "#ef4444";
  if (rsi >= 65) return "#f59e0b";
  if (rsi >= 40) return "#22c55e";
  if (rsi >= 30) return "#f59e0b";
  return "#ef4444";
}

// ── Main Component ────────────────────────────────────────────────────────
type FilterMode = "ALL" | "RISING" | "FALLING";

export default function PortfolioView() {
  const [holdings, setHoldings] = useState<PortfolioEnriched[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("ALL");
  const [sortKey, setSortKey] = useState<string>("pnl_pct");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [alertsCross, setAlertsCross] = useState<PortfolioAlertsCross[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);

  // Lazy-init Supabase client on client-side only (avoids SSR crash)
  useEffect(() => {
    setSupabase(createClient());
  }, []);

  // ── Fetch holdings ────────────────────────────────────────────────────
  const fetchHoldings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      if (data.error) { console.error(data.error); return; }
      setHoldings(data.holdings || []);
      setSummary(data.summary || null);
    } catch (e) {
      console.error("Failed to fetch portfolio:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch alerts cross-reference ─────────────────────────────────────
  const fetchAlertsCross = useCallback(async () => {
    try {
      const res = await fetch("/api/portfolio/alerts");
      const data = await res.json();
      setAlertsCross(data.alerts || []);
    } catch (e) { /* silent */ }
  }, []);

  useEffect(() => { fetchHoldings(); fetchAlertsCross(); }, [fetchHoldings, fetchAlertsCross]);

  // ── Realtime subscription on portfolio_indicators ────────────────────
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel("portfolio-indicators-live")
      .on("postgres_changes",
        { event: "UPDATE", schema: "public", table: "portfolio_indicators" },
        () => { fetchHoldings(); fetchAlertsCross(); }
      )
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "portfolio_indicators" },
        () => { fetchHoldings(); fetchAlertsCross(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, fetchHoldings, fetchAlertsCross]);

  // ── Filtering ────────────────────────────────────────────────────────
  const filtered = holdings.filter(h => {
    if (filter === "RISING") return h.pnl_pct > 0;
    if (filter === "FALLING") return h.pnl_pct < 0;
    return true;
  });

  // ── Sorting ──────────────────────────────────────────────────────────
  const sorted = [...filtered].sort((a, b) => {
    let va: any, vb: any;
    switch (sortKey) {
      case "symbol":    va = a.symbol; vb = b.symbol; break;
      case "quantity":  va = a.quantity; vb = b.quantity; break;
      case "buy_price": va = a.buy_price; vb = b.buy_price; break;
      case "ltp":       va = a.indicator?.ltp ?? 0; vb = b.indicator?.ltp ?? 0; break;
      case "change_pct":va = a.indicator?.change_pct ?? 0; vb = b.indicator?.change_pct ?? 0; break;
      case "rsi":       va = a.indicator?.rsi_14 ?? 0; vb = b.indicator?.rsi_14 ?? 0; break;
      case "composite_score": va = a.indicator?.composite_score ?? 0; vb = b.indicator?.composite_score ?? 0; break;
      case "volume":    va = a.indicator?.volume ?? 0; vb = b.indicator?.volume ?? 0; break;
      case "pnl_pct":   va = a.pnl_pct; vb = b.pnl_pct; break;
      case "pnl":       va = a.pnl; vb = b.pnl; break;
      default:          va = a.pnl_pct; vb = b.pnl_pct;
    }
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortDir === "asc" ? (va - vb) : (vb - va);
  });

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sortArrow = (key: string) => sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  // ── Delete holding ──────────────────────────────────────────────────
  const deleteHolding = async (id: string) => {
    if (!confirm("Remove this stock from your portfolio?")) return;
    await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
    fetchHoldings();
  };

  // ── Alerts per symbol lookup ────────────────────────────────────────
  const alertMap: Record<string, PortfolioAlertsCross[]> = {};
  for (const a of alertsCross) {
    if (!alertMap[a.symbol]) alertMap[a.symbol] = [];
    alertMap[a.symbol].push(a);
  }

  // ── Empty state ─────────────────────────────────────────────────────
  if (!loading && holdings.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
        <h2 style={{ color: "var(--ink-0)", marginBottom: 8 }}>No stocks in your portfolio yet</h2>
        <p style={{ color: "var(--ink-3)", marginBottom: 24 }}>
          Add your first stock to start tracking live prices, RSI, news, and scanner alerts.
        </p>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: "10px 24px", borderRadius: 10, border: "none",
            background: "var(--accent)", color: "#fff", fontSize: 14, fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
          Add Stock
        </button>
        {showAddModal && (
          <AddStockModal
            onClose={() => setShowAddModal(false)}
            onAdded={() => { setShowAddModal(false); fetchHoldings(); }}
          />
        )}
      </div>
    );
  }

  // ── Loading skeleton ───────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <div style={{ height: 400, background: "var(--bg-2)", borderRadius: 12, opacity: 0.5 }} />
      </div>
    );
  }

  // Most recent indicator refresh across all holdings
  const latestUpdate = holdings.reduce<string | null>((latest, h) => {
    const u = h.indicator?.updated_at ?? null;
    if (!u) return latest;
    if (!latest || new Date(u) > new Date(latest)) return u;
    return latest;
  }, null);

  return (
    <div style={{ padding: "4px 0" }}>
      {/* ── Filter + Add button bar ─────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {(["ALL", "RISING", "FALLING"] as FilterMode[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 16px", borderRadius: 20, border: `1px solid ${filter === f ? "var(--accent)" : "var(--line)"}`,
                background: filter === f ? "var(--accent)" : "transparent",
                color: filter === f ? "#fff" : "var(--ink-2)", fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "all .15s ease",
              }}
            >
              {f === "ALL" ? "📋 All" : f === "RISING" ? "🟢 Rising" : "🔴 Falling"}
              {f === "ALL" ? ` (${holdings.length})` : f === "RISING" ? ` (${holdings.filter(h => h.pnl_pct > 0).length})` : ` (${holdings.filter(h => h.pnl_pct < 0).length})`}
            </button>
          ))}
          <span style={{ fontSize: 11, color: "var(--ink-4)", marginLeft: 6 }} title={latestUpdate ? new Date(latestUpdate).toLocaleString("en-IN") : ""}>
            🔄 Data updated {timeAgo(latestUpdate)}
          </span>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: "8px 18px", borderRadius: 10, border: "none",
            background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <Plus size={14} /> Add Stock
        </button>
      </div>

      {/* ── Holdings Table ──────────────────────────────────────────── */}
      <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--line)", background: "var(--bg-2)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--line)", background: "var(--bg-1)" }}>
              {[
                ["#", null],
                ["Symbol", "symbol"],
                ["Qty", "quantity"],
                ["Buy Price", "buy_price"],
                ["LTP", "ltp"],
                ["Chg%", "change_pct"],
                ["Total P&L", "pnl"],
                ["P&L%", "pnl_pct"],
                ["Volume", "volume"],
                ["Vol Trend", null],
                ["RSI", "rsi"],
                ["EMA21", null],
                ["EMA51", null],
                ["News", null],
                ["Score", "composite_score"],
                ["Rec", null],
                ["Buy Date", null],
                ["Scans", null],
                ["", null],
              ].map(([label, sortCol]) => (
                <th
                  key={label}
                  onClick={() => sortCol && handleSort(sortCol)}
                  style={{
                    padding: "10px 12px", textAlign: "left", fontWeight: 600, fontSize: 11,
                    color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.05em",
                    whiteSpace: "nowrap", cursor: sortCol ? "pointer" : "default",
                  }}
                >
                  {label}{sortCol ? sortArrow(sortCol) : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((h, i) => {
              const ind = h.indicator;
              const alerts = alertMap[h.symbol] || [];
              return (
                <tr
                  key={h.id}
                  style={{
                    borderBottom: "1px solid var(--line)",
                    background: i % 2 === 0 ? "var(--bg-2)" : "var(--bg-1)",
                  }}
                >
                  <td style={{ padding: "10px 12px", color: "var(--ink-3)", fontSize: 12 }}>{i + 1}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <CandleHoverCard symbol={h.symbol}>
                      <a
                        href={tvLink(h.symbol, h.exchange)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--accent)", fontWeight: 700, textDecoration: "none",
                          display: "inline-flex", alignItems: "center", gap: 4,
                        }}
                      >
                        {h.symbol}
                        <ExternalLink size={10} style={{ opacity: 0.5 }} />
                      </a>
                    </CandleHoverCard>
                    <div style={{ fontSize: 10, color: "var(--ink-4)" }}>{h.exchange}</div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "var(--ink-0)", fontWeight: 500 }}>{h.quantity}</td>
                  <td style={{ padding: "10px 12px", color: "var(--ink-0)" }}>₹{h.buy_price.toLocaleString("en-IN")}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{
                      fontWeight: 600,
                      color: (ind?.change_pct ?? 0) >= 0 ? "var(--up)" : "var(--down)",
                    }}>
                      ₹{(ind?.ltp ?? h.buy_price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{
                      fontWeight: 600, fontSize: 12,
                      color: (ind?.change_pct ?? 0) >= 0 ? "var(--up)" : "var(--down)",
                      display: "inline-flex", alignItems: "center", gap: 3,
                    }}>
                      {(ind?.change_pct ?? 0) >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {(ind?.change_pct ?? 0) >= 0 ? "+" : ""}{ind?.change_pct?.toFixed(2) ?? "—"}%
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{
                      fontWeight: 700, fontSize: 13,
                      color: h.pnl >= 0 ? "var(--up)" : "var(--down)",
                    }}>
                      {h.pnl >= 0 ? "+" : ""}₹{h.pnl.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{
                      fontWeight: 600, fontSize: 12,
                      color: h.pnl_pct >= 0 ? "var(--up)" : "var(--down)",
                      display: "inline-flex", alignItems: "center", gap: 3,
                    }}>
                      {h.pnl_pct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {h.pnl_pct >= 0 ? "+" : ""}{h.pnl_pct.toFixed(2)}%
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", color: "var(--ink-2)", fontSize: 12 }}>
                    {ind?.volume ? (ind.volume / 1000).toFixed(0) + "K" : "—"}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    {ind?.vol_3d_trend ? (
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        color: ind.vol_3d_trend.includes("▲") ? "var(--up)"
                             : ind.vol_3d_trend.includes("▼") ? "var(--down)"
                             : "var(--ink-2)",
                        whiteSpace: "nowrap",
                      }}>
                        {ind.vol_3d_trend}
                      </span>
                    ) : (
                      <span style={{ color: "var(--ink-4)", fontSize: 11 }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{
                      fontWeight: 700, color: rsiColor(ind?.rsi_14 ?? null),
                      padding: "2px 8px", borderRadius: 6,
                      background: `${rsiColor(ind?.rsi_14 ?? null)}15`,
                    }}>
                      {ind?.rsi_14?.toFixed(1) ?? "—"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", color: "var(--ink-2)", fontSize: 12 }}>
                    {ind?.ema_21 ? "₹" + ind.ema_21.toFixed(1) : "—"}
                  </td>
                  <td style={{ padding: "10px 12px", color: "var(--ink-2)", fontSize: 12 }}>
                    {ind?.ema_51 ? "₹" + ind.ema_51.toFixed(1) : "—"}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    {ind?.news_score !== null && ind?.news_score !== undefined ? (
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        color: (ind.news_score ?? 0) > 0 ? "var(--up)" : (ind.news_score ?? 0) < 0 ? "var(--down)" : "var(--ink-3)",
                      }}>
                        {(ind.news_score ?? 0) > 0 ? "+" : ""}{ind.news_score}
                      </span>
                    ) : (
                      <span style={{ color: "var(--ink-4)", fontSize: 11 }}>—</span>
                    )}
                    {ind?.news_headlines && ind.news_headlines.length > 0 && (
                      <div style={{ fontSize: 10, color: "var(--ink-4)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        title={ind.news_headlines.join(" • ")}>
                        {ind.news_headlines[0] || ""}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <ScoreBadge score={ind?.composite_score ?? null} label={ind?.composite_label ?? null} />
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <RecBadge rec={ind?.recommendation ?? null} reasons={ind?.recommendation_reasons ?? null} />
                  </td>
                  <td style={{ padding: "10px 12px", color: "var(--ink-3)", fontSize: 12, whiteSpace: "nowrap" }}>
                    {new Date(h.buy_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    {alerts.length > 0 ? (
                      <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        {alerts.map((a, j) => (
                          <span
                            key={j}
                            title={`${a.scan_label} — ${new Date(a.scanned_at).toLocaleTimeString("en-IN")}`}
                            style={{
                              padding: "1px 6px", borderRadius: 10, fontSize: 10, fontWeight: 600,
                              background: "var(--accent-2)", color: "#fff", cursor: "pointer",
                            }}
                            onClick={() => {
                              // Navigate to the scanner tab
                              const url = new URL(window.location.href);
                              url.hash = a.tab_id;
                              window.location.href = url.toString();
                            }}
                          >
                            {a.scan_label.split(" ")[0]}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: "var(--ink-4)", fontSize: 11 }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <button
                      onClick={() => deleteHolding(h.id)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "var(--ink-4)", padding: 4, borderRadius: 6,
                      }}
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Add Stock Modal (inline placeholder) ─────────────────────── */}
      {showAddModal && (
        <AddStockModal
          onClose={() => setShowAddModal(false)}
          onAdded={() => { setShowAddModal(false); fetchHoldings(); }}
        />
      )}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════
// Add Stock Modal
// ══════════════════════════════════════════════════════════════════════════
function AddStockModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [symbol, setSymbol] = useState("");
  const [exchange, setExchange] = useState("NSE");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [buyDate, setBuyDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!symbol.trim() || !quantity || !buyPrice || !buyDate) {
      setError("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: symbol.trim().toUpperCase(),
          exchange,
          quantity: parseInt(quantity),
          buy_price: parseFloat(buyPrice),
          buy_date: buyDate,
          notes: notes || null,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        onAdded();
      }
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.5)", display: "flex",
        alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-2)", borderRadius: 16, padding: 28,
          width: "90%", maxWidth: 440, border: "1px solid var(--line)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ margin: "0 0 20px", color: "var(--ink-0)", fontSize: 18 }}>
          ➕ Add Stock to Portfolio
        </h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--bg-1)", color: "var(--ink-0)", fontSize: 14 }}
              placeholder="Symbol (e.g. RELIANCE)"
              value={symbol}
              onChange={e => setSymbol(e.target.value.toUpperCase())}
              autoFocus
            />
            <select
              value={exchange}
              onChange={e => setExchange(e.target.value)}
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--bg-1)", color: "var(--ink-0)", fontSize: 14, cursor: "pointer" }}
            >
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <input
              style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--bg-1)", color: "var(--ink-0)", fontSize: 14 }}
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              min="1"
            />
            <input
              style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--bg-1)", color: "var(--ink-0)", fontSize: 14 }}
              type="number"
              step="0.01"
              placeholder="Buy Price (₹)"
              value={buyPrice}
              onChange={e => setBuyPrice(e.target.value)}
            />
          </div>

          <input
            style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--bg-1)", color: "var(--ink-0)", fontSize: 14 }}
            type="date"
            value={buyDate}
            onChange={e => setBuyDate(e.target.value)}
          />

          <input
            style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--bg-1)", color: "var(--ink-0)", fontSize: 14 }}
            placeholder="Notes (optional)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />

          {error && (
            <div style={{ color: "var(--down)", fontSize: 12, padding: "8px 12px", background: "rgba(239,68,68,0.08)", borderRadius: 8 }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px", borderRadius: 8, border: "1px solid var(--line)",
                background: "transparent", color: "var(--ink-2)", fontSize: 13, fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "10px 24px", borderRadius: 8, border: "none",
                background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Adding..." : "Add Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
