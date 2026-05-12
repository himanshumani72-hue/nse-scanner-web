"use client";

export default function RankingTable({ panelsData }: { panelsData?: any }) {
  const ranking   = panelsData?.ranking   || [];
  const watchlist = panelsData?.watchlist || [];

  if (!panelsData) return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: 64, textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🏆</div>
      <p style={{ color: "var(--ink-3)", margin: 0 }}>Probability ranking updates daily at 9:20 AM IST.</p>
    </div>
  );

  const COL = "minmax(40px,auto) minmax(130px,1.2fr) 60px 60px 60px 70px 80px 70px 90px minmax(200px,2fr)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Final Probability Ranking ── */}
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: 20 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--ink-0)" }}>🏆 Final Probability Ranking — Composite Score</h2>
        <p style={{ margin: "0 0 16px", fontSize: 11, color: "var(--ink-3)" }}>Weighted: Macro 15% · Sector 15% · Seasonal 10% · Technical 30% · Statistical 15% · Event 15%</p>

        <div style={{ overflowX: "auto" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: COL, gap: 12, padding: "8px 12px", color: "var(--ink-3)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.10em", background: "var(--bg-2)", borderRadius: 8, marginBottom: 4 }}>
            {["Rank","Stock","Macro","Sector","Event","Seasonal","Statistical","Technical","Final Score","Reason / Catalyst"].map(h => (
              <span key={h}>{h}</span>
            ))}
          </div>

          {/* Rows — no borders */}
          {ranking.map((r: any, i: number) => {
            const fs = parseFloat(r["Final Score"]);
            const fsBg    = fs >= 7 ? "rgba(43,208,122,.15)" : fs >= 5 ? "rgba(243,181,74,.15)" : "transparent";
            const fsColor = fs >= 7 ? "var(--up)" : fs >= 5 ? "var(--warn)" : "var(--down)";
            const medal   = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: COL, gap: 12, padding: "10px 12px", borderRadius: 8, background: i % 2 === 0 ? "var(--bg-2)" : "transparent", cursor: "pointer", transition: "background .12s ease" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "var(--bg-2)" : "transparent")}>
                <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{medal}</span>
                <span className="num" style={{ fontWeight: 700, color: "var(--ink-0)", fontSize: 13 }}>{r["Stock Name"]}</span>
                <span className="num" style={{ color: "var(--accent-2)", fontSize: 13 }}>{r.Macro}</span>
                <span className="num" style={{ color: "var(--ink-2)", fontSize: 13 }}>{r.Sector}</span>
                <span className="num" style={{ color: "var(--ink-2)", fontSize: 13 }}>{r.Event}</span>
                <span className="num" style={{ color: "var(--ink-2)", fontSize: 13 }}>{r.Seasonal}</span>
                <span className="num" style={{ color: "var(--ink-2)", fontSize: 13 }}>{r.Statistical}</span>
                <span className="num" style={{ color: "var(--up)", fontWeight: 600, fontSize: 13 }}>{r.Technical}</span>
                    <span className="num" style={{ fontWeight: 700, fontSize: 16, color: fsColor, background: fsBg, padding: "2px 10px", borderRadius: 8, display: "inline-block" }}>{fs}</span>
                    {/* Reason / Catalyst */}
                    <div style={{ fontSize: 11, lineHeight: 1.4 }}>
                      {r["Reason"] && r["Reason"] !== "Technical momentum" ? (
                        <span style={{ color: "var(--ink-1)" }}>{String(r["Reason"]).slice(0, 100)}</span>
                      ) : r["Top News"] ? (
                        <span style={{ color: "var(--ink-3)" }}>{String(r["Top News"]).slice(0, 70)}</span>
                      ) : (
                        <span style={{ color: "var(--ink-4)" }}>Technical momentum</span>
                      )}
                      {r["Fundamental"] && (
                        <span style={{ marginLeft: 6, padding: "1px 6px", borderRadius: 4, fontSize: 10,
                          background: r["Fundamental"] === "Strong" ? "rgba(43,208,122,.15)" : r["Fundamental"] === "Moderate" ? "rgba(243,181,74,.15)" : "transparent",
                          color: r["Fundamental"] === "Strong" ? "var(--up)" : r["Fundamental"] === "Moderate" ? "var(--warn)" : "var(--ink-4)" }}>
                          {r["Fundamental"]}
                        </span>
                      )}
                    </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Trade Watchlist ── */}
      {watchlist.length > 0 && (
        <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: 20 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--ink-0)" }}>📋 Trade Watchlist — ATR-Based Entry / Target / Stop Loss</h2>
          <p style={{ margin: "0 0 16px", fontSize: 11, color: "var(--ink-3)" }}>Top ranked stocks with calculated entry zone, target and stop loss</p>

          <div style={{ overflowX: "auto" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "40px minmax(100px,1fr) 90px 100px 100px 100px 80px 90px 80px", gap: 12, padding: "8px 12px", color: "var(--ink-3)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.10em", background: "var(--bg-2)", borderRadius: 8, marginBottom: 4 }}>
              {["Rank","Symbol","LTP","Entry Zone","Target","Stop Loss","Upside","R:R","Score"].map(h => (
                <span key={h}>{h}</span>
              ))}
            </div>

            {watchlist.map((w: any, i: number) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "40px minmax(100px,1fr) 90px 100px 100px 100px 80px 90px 80px", gap: 12, padding: "10px 12px", borderRadius: 8, background: i % 2 === 0 ? "var(--bg-2)" : "transparent", cursor: "pointer", transition: "background .12s ease" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "var(--bg-2)" : "transparent")}>
                <span className="num" style={{ color: "var(--ink-3)", fontSize: 12 }}>{w.Rank}</span>
                <span className="num" style={{ fontWeight: 700, color: "var(--ink-0)", fontSize: 13 }}>{w.Symbol}</span>
                <span className="num" style={{ color: "var(--ink-1)", fontSize: 12 }}>₹{w.LTP}</span>
                <span className="num" style={{ color: "var(--warn)", fontWeight: 500, fontSize: 12 }}>₹{w["Entry Zone"]}</span>
                <span className="num" style={{ color: "var(--up)", fontWeight: 700, fontSize: 12 }}>₹{w.Target}</span>
                <span className="num" style={{ color: "var(--down)", fontWeight: 600, fontSize: 12 }}>₹{w["Stop Loss"]}</span>
                <span className="num" style={{ color: parseFloat(w["Upside %"]) >= 15 ? "var(--up)" : "var(--warn)", fontWeight: 600, fontSize: 12 }}>{w["Upside %"]}%</span>
                <span className="num" style={{ color: "var(--accent-2)", fontSize: 12 }}>{w["Risk:Reward"]}</span>
                <span className="num" style={{ color: "var(--ink-0)", fontWeight: 700, fontSize: 13 }}>{w["Final Score"]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
