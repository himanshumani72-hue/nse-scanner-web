"use client";
import { ExternalLink } from "lucide-react";

function tv(symbol: string) {
  return `https://www.tradingview.com/chart/?symbol=NSE:${symbol}`;
}

function ScoreCell({ v, highlight }: { v: any; highlight?: boolean }) {
  const n = parseFloat(String(v ?? 0));
  if (!isFinite(n)) return <span className="num" style={{ color: "var(--ink-4)" }}>—</span>;
  const color = n >= 8 ? "var(--up)" : n >= 6 ? "var(--accent-2)" : n >= 4 ? "var(--ink-2)" : "var(--down)";
  return (
    <span className="num" style={{
      color, fontSize: 13,
      fontWeight: highlight ? 700 : 500,
    }}>
      {n.toFixed(1)}
    </span>
  );
}

/** Beta cell — colour-codes risk level so users see at a glance.
 *  β > 1.3 = red (high-risk amplifier); 0.7 - 1.3 = neutral; < 0.7 = green (defensive).
 *  Missing data renders as "—" (not 1.00) so users can tell the difference
 *  between "this stock is market-like" and "we don't have beta data yet". */
function BetaCell({ v }: { v: any }) {
  if (v === null || v === undefined || v === "") {
    return <span className="num" style={{ color: "var(--ink-4)" }}>—</span>;
  }
  const n = parseFloat(String(v));
  if (!isFinite(n) || n === 0) {
    return <span className="num" style={{ color: "var(--ink-4)" }}>—</span>;
  }
  const color = n >= 1.5 ? "var(--down)"
              : n >= 1.2 ? "var(--warn)"
              : n >= 0.8 ? "var(--ink-1)"
              : "var(--up)";
  return (
    <span className="num" style={{ color, fontSize: 13, fontWeight: 600 }}
      title={
        n >= 1.5 ? "Very high beta — amplifies market moves ~1.5×+. Risky in choppy markets."
        : n >= 1.2 ? "High beta — moves more than Nifty. Good in trending bull markets."
        : n >= 0.8 ? "Market-like beta — moves roughly with Nifty."
        : "Low beta / defensive — moves less than market. Steady but slow."
      }>
      {n.toFixed(2)}
    </span>
  );
}

/** Header cell with optional tooltip describing the column. */
function HeaderCell({ label, tip }: { label: string; tip?: string }) {
  return (
    <span title={tip} style={{ cursor: tip ? "help" : "default" }}>
      {label}{tip ? " ⓘ" : ""}
    </span>
  );
}

export default function RankingTable({ panelsData }: { panelsData?: any }) {
  const ranking  = panelsData?.ranking   || [];
  const watchlist = panelsData?.watchlist || [];
  const nextDay  = panelsData?.next_day  || [];

  if (!panelsData) return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: 64, textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🏆</div>
      <p style={{ color: "var(--ink-3)", margin: 0 }}>Probability ranking updates daily at 9:20 AM IST.</p>
    </div>
  );

  // Rank · Stock · Macro · Sector · Event · Stat · Tech · Cross · Persist · Momentum · Beta · Final · Reason
  const COL = "minmax(40px,auto) minmax(130px,1fr) 50px 50px 50px 50px 50px 50px 55px 65px 55px 80px minmax(200px,2fr)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Final Probability Ranking ── */}
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: 20 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--ink-0)" }}>🏆 Final Probability Ranking — High Conviction Only</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 999,
            background: "rgba(43,208,122,.12)", border: "1px solid rgba(43,208,122,.35)",
            color: "var(--up)",
          }}>
            ✓ Minimum 3 scanners must confirm
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 999,
            background: "rgba(91,140,255,.12)", border: "1px solid rgba(91,140,255,.35)",
            color: "var(--accent-2)",
          }}>
            🔥 News catalyst gets priority ranking
          </span>
        </div>
        <p style={{ margin: "0 0 6px", fontSize: 11, color: "var(--ink-3)" }}>
          Weighted: News/Event 15% · Tech 15% · Cross-scanner 10% · Macro 10% · Sector 10% · Stat 10% · Momentum 10% · Persistence 10% · Seasonal 5%
        </p>
        <p style={{ margin: "0 0 16px", fontSize: 11, color: "var(--ink-4)" }}>
          💡 Hover any column header for an explanation. Click stock name to open TradingView.
          <span style={{ marginLeft: 8, color: "var(--ink-3)" }}>
            <b>Cross</b> = number of other scanners that flagged this stock today (signals stacking).
            <b style={{ marginLeft: 8 }}>Persist</b> = consecutive-day streak in scans (durability).
            <b style={{ marginLeft: 8 }}>Beta</b> = 90-day volatility vs Nifty.
          </span>
        </p>

        <div style={{ overflowX: "auto" }}>
          {/* Header — with tooltips on metric columns */}
          <div style={{ display: "grid", gridTemplateColumns: COL, gap: 12, padding: "8px 12px", color: "var(--ink-3)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.10em", background: "var(--bg-2)", borderRadius: 8, marginBottom: 4 }}>
            <HeaderCell label="Rank" />
            <HeaderCell label="Stock" />
            <HeaderCell label="Macro"     tip="How well the stock aligns with today's macro conditions (crude / INR / Nifty trend). 0-10." />
            <HeaderCell label="Sector"    tip="Live sector strength from the Sector Rotation scanner (return + breadth blend). 0-10." />
            <HeaderCell label="Event"     tip="News sentiment + upcoming results catalysts. 0-10." />
            <HeaderCell label="Stat"      tip="Statistical position — RSI in healthy zone, price above SMA20/50, alignment. 0-10." />
            <HeaderCell label="Tech"      tip="Technical setup quality — MACD momentum, EMA alignment, price action. 0-10." />
            <HeaderCell label="Cross"     tip="Cross-scanner stacking. How many OTHER scanners flagged this stock today. 5+ scanners agreeing = high conviction. 0-10." />
            <HeaderCell label="Persist"   tip="Persistence streak. How many consecutive days this stock has appeared in scans. Multi-day signals are 3× more reliable than 1-day blips. 0-10." />
            <HeaderCell label="Momentum"  tip="Today's % + 5-day % + volume ratio. 0-10." />
            <HeaderCell label="Beta"      tip="90-day beta vs Nifty. >1.5 = high amplifier (risky in chop). 0.8-1.2 = market-like. <0.8 = defensive." />
            <HeaderCell label="Final" />
            <HeaderCell label="Reason / Confirmed by" />
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
                {/* Rank medal */}
                <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{medal}</span>

                {/* Stock name + TradingView link + News Catalyst badge */}
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <a
                    href={tv(r["Ticker"] || r["Stock Name"])}
                    target="_blank"
                    rel="noreferrer"
                    className="num"
                    title={`Open ${r["Stock Name"]} on TradingView`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      fontWeight: 700, color: "var(--ink-0)", fontSize: 13,
                      textDecoration: "none",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-0)")}>
                    {r["Stock Name"]}
                    <ExternalLink size={11} style={{ opacity: 0.5 }} />
                  </a>
                  {/* News catalyst badge — only shown when present */}
                  {r["News Catalyst"] && r["News Catalyst"] !== "—" && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      fontSize: 9.5, fontWeight: 600, padding: "1px 6px",
                      borderRadius: 999,
                      background: r["News Catalyst"]?.includes("Strong")
                        ? "rgba(43,208,122,.15)"
                        : r["News Catalyst"]?.includes("Confirmed")
                          ? "rgba(91,140,255,.15)"
                          : "rgba(243,181,74,.12)",
                      color: r["News Catalyst"]?.includes("Strong")
                        ? "var(--up)"
                        : r["News Catalyst"]?.includes("Confirmed")
                          ? "var(--accent-2)"
                          : "var(--warn)",
                      border: `1px solid ${r["News Catalyst"]?.includes("Strong") ? "rgba(43,208,122,.35)" : r["News Catalyst"]?.includes("Confirmed") ? "rgba(91,140,255,.35)" : "rgba(243,181,74,.30)"}`,
                    }}>
                      {r["News Catalyst"]}
                    </span>
                  )}
                </div>
                <ScoreCell v={r.Macro} />
                <ScoreCell v={r.Sector} />
                <ScoreCell v={r.Event} />
                <ScoreCell v={r.Statistical} />
                <ScoreCell v={r.Technical} highlight />
                <ScoreCell v={r.Cross} highlight />
                <ScoreCell v={r.Persistence} />
                <ScoreCell v={r.Momentum} />
                <BetaCell v={r.Beta} />
                <span className="num" style={{ fontWeight: 700, fontSize: 16, color: fsColor, background: fsBg, padding: "2px 10px", borderRadius: 8, display: "inline-block" }}>{fs}</span>
                {/* Reason + which scanners confirmed */}
                <div style={{ fontSize: 11, lineHeight: 1.4 }}>
                  {r["Confirmed by"] && r["Confirmed by"] !== "—" && (
                    <div style={{ marginBottom: 3 }}>
                      <span style={{ fontSize: 9.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Confirmed by: </span>
                      <span style={{ color: "var(--accent-2)", fontWeight: 500 }}>{r["Confirmed by"]}</span>
                    </div>
                  )}
                  {r["Reason"] && r["Reason"] !== "Technical momentum" ? (
                    <span style={{ color: "var(--ink-1)" }}>{String(r["Reason"]).slice(0, 90)}</span>
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

      {/* ── Next Day Big Movers Prediction ── */}
      {nextDay.length > 0 && (
        <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: 20 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--ink-0)" }}>
            🔮 Next Day Potential Movers
          </h2>
          <p style={{ margin: "0 0 16px", fontSize: 11, color: "var(--ink-3)" }}>
            EOD signals · EMA-51 entry zone + Vol surge + MACD building + News catalyst + <b style={{color:"var(--accent-2)"}}>Cross-scanner confirmation</b> + <b style={{color:"var(--accent-2)"}}>Multi-day streak</b> + Live sector strength
          </p>

          <div style={{ overflowX: "auto" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(120px,1.3fr) 80px 70px 70px 60px 80px 80px 70px minmax(200px,2fr)", gap: 12, padding: "8px 12px", color: "var(--ink-3)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.10em", background: "var(--bg-2)", borderRadius: 8, marginBottom: 4 }}>
              {["Symbol","LTP","Today Vol","5D Chg","RSI","52W High","MACD","Score","Why Tomorrow"].map(h => (
                <span key={h}>{h}</span>
              ))}
            </div>

            {nextDay.map((n: any, i: number) => {
              const score = parseInt(n.Score) || 0;
              const scoreBg    = score >= 70 ? "rgba(43,208,122,.15)" : score >= 55 ? "rgba(243,181,74,.12)" : "transparent";
              const scoreColor = score >= 70 ? "var(--up)" : score >= 55 ? "var(--warn)" : "var(--ink-2)";
              const rsi = parseFloat(n.RSI) || 50;
              const hi  = parseFloat(n["% from 52W High"]) || -50;
              const isPreResult = String(n["Why Tomorrow"]).includes("Results");

              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(120px,1.3fr) 80px 70px 70px 60px 80px 80px 70px minmax(200px,2fr)", gap: 12, padding: "10px 12px", borderRadius: 8, background: i % 2 === 0 ? "var(--bg-2)" : "transparent", cursor: "pointer", transition: "background .12s ease", border: isPreResult ? "1px solid rgba(43,208,122,.2)" : "none" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "var(--bg-2)" : "transparent")}>

                  {/* Symbol */}
                  <a href={tv(n.Symbol)} target="_blank" rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
                    <div style={{ width: 26, height: 26, borderRadius: 5, flexShrink: 0,
                      background: isPreResult ? "rgba(43,208,122,.15)" : "linear-gradient(135deg,#1a2332,#0f1622)",
                      border: "1px solid var(--line)", display: "grid", placeItems: "center",
                      fontSize: 9, fontWeight: 700, color: isPreResult ? "var(--up)" : "var(--ink-2)", fontFamily: "var(--mono)" }}>
                      {n.Symbol.slice(0,2)}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "var(--ink-0)", fontFamily: "var(--mono)" }}>
                      {n.Symbol}
                    </span>
                  </a>

                  <span className="num" style={{ fontSize: 12.5, color: "var(--ink-0)" }}>₹{n.LTP}</span>
                  <span className="num" style={{ fontSize: 12, fontWeight: 600, color: "var(--up)" }}>{n["Today Vol"]}</span>
                  <span className="num" style={{ fontSize: 12, color: String(n["5D Change"]).startsWith("+") ? "var(--up)" : "var(--down)" }}>{n["5D Change"]}</span>
                  <span className="num" style={{ fontSize: 12, color: rsi > 70 ? "var(--warn)" : rsi < 50 ? "var(--ink-3)" : "var(--ink-1)" }}>{n.RSI}</span>
                  <span className="num" style={{ fontSize: 12, color: hi > -3 ? "var(--up)" : hi > -8 ? "var(--warn)" : "var(--ink-3)" }}>{n["% from 52W High"]}%</span>
                  <span style={{ fontSize: 11, color: n.MACD === "Building" ? "var(--up)" : "var(--ink-3)" }}>{n.MACD}</span>
                  <span className="num" style={{ fontWeight: 700, fontSize: 15, color: scoreColor, background: scoreBg, padding: "2px 8px", borderRadius: 6, display: "inline-block" }}>{score}</span>
                  <span style={{ fontSize: 11, color: "var(--ink-2)", lineHeight: 1.4 }}>{n["Why Tomorrow"]}</span>
                </div>
              );
            })}
          </div>

          <p style={{ margin: "12px 0 0", fontSize: 11, color: "var(--ink-4)", borderTop: "1px solid var(--line)", paddingTop: 10 }}>
            ⚠️ EOD predictions only. Confirm with 9:15 AM opening momentum before entering. Green border = results announcement tomorrow.
          </p>
        </div>
      )}
    </div>
  );
}
