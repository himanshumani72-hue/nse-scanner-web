"use client";
import type { Alert } from "@/lib/types";
import Sparkline, { makeSparkline, seedFromSymbol } from "@/components/ui/Sparkline";
import ConfBar from "@/components/ui/ConfBar";
import Tag from "@/components/ui/Tag";

function MoverCard({ a, prime }: { a: Alert; prime?: boolean }) {
  const d = a.data;
  const chg = parseFloat(String(d["Today Chg %"] ?? 0));
  const conf = parseFloat(String(d["Confidence %"] ?? 50));
  const up = chg >= 0;
  const seed = seedFromSymbol(a.symbol);
  const spark = makeSparkline(36, seed, up ? 0.7 : -0.7, 1.0);
  const color = up ? "var(--up)" : "var(--down)";
  const cat = String(d["Catalyst Type"] ?? "");
  const pctEma = parseFloat(String(d["% from EMA51"] ?? 999));
  const hasEmaData = isFinite(pctEma) && Math.abs(pctEma) < 100;

  return (
    <div style={{
        background: "var(--bg-2)",
        border: `1px solid ${prime ? "rgba(43,208,122,.35)" : "var(--line)"}`,
        borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 14,
        cursor: "pointer", transition: "border-color .15s ease",
        boxShadow: prime ? "0 0 0 1px rgba(43,208,122,.10) inset" : "none",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = prime ? "rgba(43,208,122,.6)" : "var(--line-2)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = prime ? "rgba(43,208,122,.35)" : "var(--line)")}>
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <SymCell sym={a.symbol} name={String(d["Sector"] ?? "")} />
        <div style={{ textAlign: "right" }}>
          <div className="num" style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-0)", letterSpacing: "-0.01em" }}>
            ₹{Number(d["LTP"] ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <Pct v={chg} />
        </div>
      </div>
      {/* EMA-51 proximity bar — the key entry signal */}
      {hasEmaData && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 8, background: prime ? "rgba(43,208,122,.06)" : "var(--bg-1)", border: `1px solid ${prime ? "rgba(43,208,122,.2)" : "var(--line)"}` }}>
          <span style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>EMA-51</span>
          <div style={{ flex: 1, height: 4, background: "var(--bg-0)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 2,
              width: `${Math.min(100, Math.abs(pctEma) * 5)}%`,
              background: pctEma >= 0 && pctEma <= 5 ? "var(--up)" : pctEma > 5 ? "var(--accent-2)" : "var(--down)",
              transition: "width .3s ease"
            }} />
          </div>
          <span className="num" style={{ fontSize: 11, fontWeight: 600, flexShrink: 0, color: pctEma >= 0 && pctEma <= 5 ? "var(--up)" : pctEma > 0 ? "var(--ink-2)" : "var(--down)" }}>
            {pctEma >= 0 ? "+" : ""}{pctEma.toFixed(1)}% {pctEma >= 0 && pctEma <= 5 ? "⭐" : ""}
          </span>
          <span style={{ fontSize: 9.5, color: "var(--ink-4)", flexShrink: 0 }}>
            ₹{String(d["EMA51"] ?? "—")}
          </span>
        </div>
      )}
      {/* Sparkline */}
      <div style={{ width: "100%" }}>
        <Sparkline data={spark} w={320} h={48} color={color} stroke={1.5} />
      </div>
      {/* Bottom row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Tag tone={cat === "High" ? "up" : cat === "Medium" ? "warn" : "info"}>{cat || "Soft"}</Tag>
          <Tag>{String(d["Est. Move"] ?? "5-10%")}</Tag>
          {d["Vol/Avg"] && <Tag>Vol {d["Vol/Avg"]}x</Tag>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Conf</span>
          <ConfBar value={conf} color={conf >= 80 ? "var(--up)" : conf >= 65 ? "var(--warn)" : "var(--accent)"} w={56} />
        </div>
      </div>
      {/* Position sizing */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, paddingTop: 8, borderTop: "1px solid var(--line)" }}>
        <Stat label="Stop Loss"  value={`₹${d["Stop Loss"] ?? "—"}`}  color="var(--down)" />
        <Stat label="Target"     value={`₹${d["Target"] ?? "—"}`}     color="var(--up)" />
        <Stat label="Qty"        value={String(d["Qty"] ?? "—")} />
        <Stat label="Risk ₹"     value={`₹${d["Risk ₹"] ?? "—"}`}    color="var(--warn)" />
      </div>
      {/* News headline — only show real news, not technical descriptions */}
      <div style={{ borderTop: "1px solid var(--line)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
        {(() => {
          const cat = String(d["Top Catalyst"] ?? "");
          const newsScore = parseInt(String(d["News Score"] ?? "0"));
          // "Technical breakout" is NOT news — it's a technical description generated when no news found
          const isRealNews = newsScore > 0 && cat.length > 5 && !cat.startsWith("Technical breakout");
          const bigMove = chg >= 8;
          return isRealNews ? (
            <div style={{ padding: "7px 10px", borderRadius: 7, background: "rgba(91,140,255,.07)", border: "1px solid rgba(91,140,255,.18)" }}>
              <span style={{ fontSize: 9.5, color: "var(--accent-2)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>News · </span>
              <span style={{ fontSize: 11.5, color: "var(--ink-1)", lineHeight: 1.4 }}>{cat.slice(0, 130)}</span>
            </div>
          ) : bigMove ? (
            <div style={{ padding: "7px 10px", borderRadius: 7, background: "rgba(255,93,108,.06)", border: "1px solid rgba(255,93,108,.2)" }}>
              <span style={{ fontSize: 11, color: "var(--down)", fontWeight: 600 }}>🔍 +{chg.toFixed(1)}% with no visible news — </span>
              <a href={`https://www.bseindia.com/corporates/ann.aspx?scrip=${a.symbol}&dur=D`} target="_blank" rel="noreferrer"
                style={{ fontSize: 11, color: "var(--accent-2)", textDecoration: "underline" }}>
                Check BSE announcements
              </a>
              <span style={{ fontSize: 10.5, color: "var(--ink-3)" }}> · Could be bulk deal / promoter buy / hidden event</span>
            </div>
          ) : (
            <div style={{ padding: "6px 10px", borderRadius: 7, background: "rgba(243,181,74,.06)", border: "1px solid rgba(243,181,74,.18)" }}>
              <span style={{ fontSize: 11, color: "var(--warn)" }}>⚠️ No news found — technical move only. </span>
              <a href={`https://www.bseindia.com/corporates/ann.aspx?scrip=${a.symbol}&dur=D`} target="_blank" rel="noreferrer"
                style={{ fontSize: 10.5, color: "var(--accent-2)" }}>Check BSE</a>
              <span style={{ fontSize: 10.5, color: "var(--warn)" }}> before buying.</span>
            </div>
          );
        })()}
        {/* Supporting reasons */}
        {String(d["Trigger Reason"] ?? "").split("|").filter(Boolean).map((part, i) => {
          const s = part.trim();
          const isWarning = s.startsWith("⚠️");
          return (
            <p key={i} style={{ margin: 0, fontSize: 10.5,
              color: isWarning ? "var(--warn)" : i === 0 ? "var(--ink-2)" : "var(--ink-3)",
              lineHeight: 1.4 }}>
              {s}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default function BigMoversView({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) return (
    <Empty msg="No Big Mover alerts today. Scanner runs at 9:20 AM & 3:00 PM IST." />
  );

  // Split: near-EMA-51 setups (0–5% above EMA with catalyst) vs rest
  const primeSetups = alerts.filter(a => {
    const pct = parseFloat(String(a.data["% from EMA51"] ?? 999));
    const news = parseFloat(String(a.data["News Score"] ?? 0));
    return pct >= 0 && pct <= 5 && (news > 0 || String(a.data["Near EMA51"]) === "YES");
  });
  const others = alerts.filter(a => !primeSetups.includes(a));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* ── Prime section: Near EMA-51 + Catalyst ── */}
      {primeSetups.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--up)" }}>
              ⭐ Near EMA-51 + Catalyst — Highest Conviction Entries
            </h3>
            <span className="num" style={{ fontSize: 11, color: "var(--up)", padding: "2px 7px", border: "1px solid rgba(43,208,122,.4)", borderRadius: 999, background: "rgba(43,208,122,.08)" }}>{primeSetups.length}</span>
            <span style={{ fontSize: 11, color: "var(--ink-3)" }}>Price 0–5% above EMA-51 · momentum just starting · catalyst confirmed</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 12 }}>
            {primeSetups.map(a => <MoverCard key={a.id} a={a} prime />)}
          </div>
        </div>
      )}

      {/* ── Regular movers ── */}
      {others.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionHdr
            icon="⚡"
            title={primeSetups.length > 0 ? "Other Big Mover Alerts" : "Big Mover Alerts"}
            count={others.length}
            hint="Volume surge + catalyst • intraday & swing"
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 12 }}>
            {others.map(a => <MoverCard key={a.id} a={a} />)}
          </div>
        </div>
      )}

      {primeSetups.length === 0 && (
        <div style={{ padding: "10px 14px", background: "rgba(43,208,122,.04)", border: "1px dashed rgba(43,208,122,.2)", borderRadius: 10, fontSize: 12, color: "var(--ink-3)" }}>
          ⭐ No stocks in the EMA-51 prime zone today (0–5% above EMA-51 with catalyst). Check tomorrow's morning scan.
        </div>
      )}
    </div>
  );
}

// ── Shared helpers ────────────────────────────────────────────
export function SymCell({ sym, name }: { sym: string; name?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 30, height: 30, borderRadius: 7, flexShrink: 0, background: "linear-gradient(135deg, #1a2332 0%, #0f1622 100%)", border: "1px solid var(--line)", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 600, color: "var(--ink-1)", letterSpacing: "0.02em", fontFamily: "var(--mono)" }}>
        {sym.slice(0, 2)}
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="num" style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)", letterSpacing: "-0.01em" }}>{sym}</div>
        {name && <div style={{ fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>{name}</div>}
      </div>
    </div>
  );
}

export function Pct({ v }: { v: number }) {
  const up = v >= 0;
  const c = up ? "var(--up)" : "var(--down)";
  return (
    <span className="num" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: c, fontSize: 12, fontWeight: 500 }}>
      {up ? "▲" : "▼"} {up ? "+" : ""}{v.toFixed(2)}%
    </span>
  );
}

export function Stat({ label, value, color = "var(--ink-1)" }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 6 }}>
      <span style={{ fontSize: 9.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
      <span className="num" style={{ fontSize: 12, fontWeight: 500, color, letterSpacing: "-0.01em" }}>{value}</span>
    </div>
  );
}

export function SectionHdr({ icon, title, count, hint }: { icon: string; title: string; count?: number; hint?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <h3 style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-1)" }}>
        {icon} {title}
      </h3>
      {count !== undefined && <span className="num" style={{ fontSize: 11, color: "var(--ink-3)", padding: "2px 7px", border: "1px solid var(--line)", borderRadius: 999 }}>{count}</span>}
      {hint && <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{hint}</span>}
    </div>
  );
}

export function Empty({ msg }: { msg: string }) {
  return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: "64px 32px", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>📭</div>
      <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 13 }}>{msg}</p>
    </div>
  );
}
