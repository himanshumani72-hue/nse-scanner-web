"use client";

function SHdr({ emoji, title }: { emoji: string; title: string }) {
  return (
    <h3 style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-1)" }}>
      {emoji} {title}
    </h3>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: 18, ...style }}>
      {children}
    </div>
  );
}

function Row({ left, right, sub }: { left: React.ReactNode; right?: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
      <div>
        <div style={{ fontSize: 13, color: "var(--ink-0)", fontWeight: 500 }}>{left}</div>
        {sub && <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{sub}</div>}
      </div>
      {right && <div style={{ fontSize: 12, color: "var(--ink-2)", textAlign: "right", flexShrink: 0 }}>{right}</div>}
    </div>
  );
}

export default function MarketOverview({ data, panelsData, hideRanking }: { data?: any; panelsData?: any; hideRanking?: boolean }) {
  if (!data && !panelsData) return (
    <Card style={{ textAlign: "center", padding: 64 }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
      <p style={{ color: "var(--ink-3)", margin: 0 }}>Market data updates daily at 9:20 AM IST.</p>
    </Card>
  );

  const indicators = data?.indicators  || [];
  const usNews     = data?.us_news     || [];
  const inNews     = data?.india_news  || [];
  const seasonal   = data?.seasonal    || [];
  const results    = data?.results     || [];
  const contracts  = data?.contracts   || [];
  const events     = data?.events      || [];

  const correlation = panelsData?.correlation    || [];
  const falling     = panelsData?.falling_stocks || [];
  const nextDay     = panelsData?.next_day       || [];
  const macroState  = panelsData?.macro_state    || [];
  const marketBearish = macroState.some((c: string) => c.includes("Bearish") || c.includes("Nifty"));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Market Indicators ── */}
      {indicators.length > 0 && (
        <Card>
          <SHdr emoji="📈" title="Market Indicators" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {indicators.map((ind: any) => (
              <div key={ind.name} style={{ background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: "var(--ink-2)", marginBottom: 6 }}>{ind.name}</div>
                <div className="num" style={{ fontSize: 20, fontWeight: 600, color: "var(--ink-0)", letterSpacing: "-0.02em", lineHeight: 1 }}>{ind.value}</div>
                <div className="num" style={{ fontSize: 11, marginTop: 4, color: ind.status === "Rising" ? "var(--up)" : "var(--down)", fontWeight: 500 }}>
                  {ind.status === "Rising" ? "▲ +" : "▼ -"}{ind.change}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 5 Stocks About to Fall moved to dedicated "Stocks About to Fall" tab */}

      {/* ── Correlation Panel ── */}
      {correlation.length > 0 && (
        <Card>
          <SHdr emoji="🔗" title="Correlation Impact — Macro → Sector Links" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {correlation.map((c: any, i: number) => (
              <div key={i} style={{ background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontWeight: 600, color: "var(--ink-0)", marginBottom: 6, fontSize: 14 }}>{c.Condition}</div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12 }}>
                  <span style={{ color: "var(--up)" }}>📈 {c["Stocks to BUY"]}</span>
                  {c["Stocks to AVOID"] && <span style={{ color: "var(--down)" }}>📉 {c["Stocks to AVOID"]}</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--warn)", marginTop: 4 }}>⚠️ Macro observations — verify individual charts before trading</div>
                <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 2 }}>{c.Reason}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Seasonal + Results ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SHdr emoji="📅" title="Top Stocks This Month (Seasonal)" />
          {seasonal.length === 0 && <p style={{ color: "var(--ink-3)", fontSize: 12, margin: 0 }}>No data</p>}
          {seasonal.map((s: any, i: number) => (
            <Row key={i}
              left={<span style={{ fontFamily: "var(--mono)", fontWeight: 600 }}>{i + 1}. {s.Symbol}</span>}
              right={<span style={{ color: "var(--up)", fontSize: 11 }}>{s["Win Rate"]}% wins | {s["Avg Ret %"]}% avg</span>}
            />
          ))}
        </Card>

        <Card>
          <SHdr emoji="📢" title="Upcoming Results (Next 10 Days)" />
          {results.length === 0 && <p style={{ color: "var(--ink-3)", fontSize: 12, margin: 0 }}>No upcoming results</p>}
          {results.map((r: any, i: number) => (
            <Row key={i}
              left={<span style={{ fontFamily: "var(--mono)", fontWeight: 600 }}>{r.Symbol}</span>}
              right={<span style={{ color: "var(--warn)", fontSize: 11 }}>{r["Result Date"]}</span>}
            />
          ))}
        </Card>
      </div>

      {/* ── US + India News ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SHdr emoji="🇺🇸" title="US Govt / Fed News" />
          {usNews.length === 0 && <p style={{ color: "var(--ink-3)", fontSize: 12, margin: 0 }}>No recent news</p>}
          {usNews.map((n: any, i: number) => (
            <div key={i} style={{ padding: "6px 0" }}>
              <div style={{ fontSize: 12, color: "var(--ink-1)", lineHeight: 1.45 }}>{n.title}</div>
              <div style={{ fontSize: 10.5, color: "var(--ink-3)", marginTop: 2 }}>
                {n.date}{n.impacted ? <span style={{ color: "var(--accent-2)", marginLeft: 8 }}>{n.impacted}</span> : null}
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <SHdr emoji="🇮🇳" title="India Govt / RBI / SEBI" />
          {inNews.length === 0 && <p style={{ color: "var(--ink-3)", fontSize: 12, margin: 0 }}>No recent news</p>}
          {inNews.map((n: any, i: number) => (
            <div key={i} style={{ padding: "6px 0" }}>
              <div style={{ fontSize: 12, color: "var(--ink-1)", lineHeight: 1.45 }}>{n.title}</div>
              <div style={{ fontSize: 10.5, color: "var(--ink-3)", marginTop: 2 }}>
                {n.date}{n.impacted ? <span style={{ color: "var(--up)", marginLeft: 8 }}>{n.impacted}</span> : null}
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* ── Contracts + Events ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SHdr emoji="🏆" title="Contract / Order Wins (Last 7 Days)" />
          {contracts.length === 0 && <p style={{ color: "var(--ink-3)", fontSize: 12, margin: 0 }}>No contract news</p>}
          {contracts.map((c: any, i: number) => (
            <div key={i} style={{ padding: "6px 0" }}>
              <div style={{ fontSize: 12, color: "var(--ink-1)", lineHeight: 1.45 }}>{c.Headline}</div>
              <div style={{ fontSize: 10.5, color: "var(--ink-3)", marginTop: 2 }}>{c.Date}</div>
            </div>
          ))}
        </Card>

        <Card>
          <SHdr emoji="⭐" title="Events — Dividend / Bonus / Split" />
          {events.length === 0 && <p style={{ color: "var(--ink-3)", fontSize: 12, margin: 0 }}>No event news</p>}
          {events.map((e: any, i: number) => (
            <div key={i} style={{ padding: "6px 0" }}>
              <div style={{ fontSize: 12, color: "var(--ink-1)", lineHeight: 1.45 }}>{e.Headline}</div>
              <div style={{ fontSize: 10.5, color: "var(--ink-3)", marginTop: 2 }}>{e.Date}</div>
            </div>
          ))}
        </Card>
      </div>

      <p style={{ fontSize: 10.5, color: "var(--ink-4)", textAlign: "center", paddingBottom: 4, margin: 0 }}>
        Updated: {data?.scan_time || panelsData?.scan_time || "—"}
      </p>

      {/* ══ TOMORROW'S TOP BUYS — below all market data ══ */}
      <div style={{
        background: "linear-gradient(135deg, rgba(43,208,122,.06) 0%, rgba(91,140,255,.04) 100%)",
        border: "1px solid rgba(43,208,122,.25)", borderRadius: 16, padding: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🎯</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--up)", letterSpacing: "0.05em" }}>TOMORROW'S TOP BUYS</h3>
              <p style={{ margin: 0, fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>
                Catalyst-first · EMA-51 zone · RSI rising · R:R ≥ 1.5 · no boomerang conflict
              </p>
            </div>
          </div>
          {marketBearish && (
            <span style={{ fontSize: 11, color: "var(--warn)", padding: "4px 10px", background: "rgba(243,181,74,.1)", border: "1px solid rgba(243,181,74,.3)", borderRadius: 999 }}>
              ⚠️ Market bearish — reduce position size
            </span>
          )}
        </div>

        {nextDay.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--ink-3)", fontSize: 13 }}>
            📭 No high-conviction setups today. Scanner runs EOD at 3:30 PM IST.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {nextDay.slice(0, 5).map((s: any, i: number) => {
              const conv = s["Conviction"] || "MEDIUM";
              const convColor = conv === "HIGH" ? "var(--up)" : conv === "MEDIUM" ? "var(--warn)" : "var(--ink-3)";
              const pctEma = parseFloat(String(s["% from EMA51"] ?? 99));
              const isGoodEma = isFinite(pctEma) && pctEma < 50;
              const emaColor = pctEma <= 3 ? "var(--up)" : pctEma <= 7 ? "var(--accent-2)" : "var(--ink-3)";
              const mcLink = `https://www.moneycontrol.com/news/tags/${s.Symbol?.toLowerCase()}/`;
              const catalyst = String(s["Catalyst"] || s["Why Buy"] || "");
              return (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: "44px minmax(140px,1.2fr) 90px 90px 90px 90px minmax(200px,2fr)",
                  gap: 8, alignItems: "center",
                  padding: "12px 14px", borderRadius: 10,
                  background: i === 0 ? "rgba(43,208,122,.07)" : "var(--bg-1)",
                  border: `1px solid ${i === 0 ? "rgba(43,208,122,.2)" : "var(--line)"}`,
                }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: i === 0 ? "rgba(43,208,122,.15)" : "var(--bg-2)", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700, color: i === 0 ? "var(--up)" : "var(--ink-2)" }}>
                    #{i + 1}
                  </div>
                  {/* Symbol + links */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <a href={`https://www.tradingview.com/chart/?symbol=NSE:${s.Symbol}`} target="_blank" rel="noreferrer"
                        style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: 14, color: "var(--ink-0)", textDecoration: "none" }}>
                        {s.Symbol}
                      </a>
                      <a href={mcLink} target="_blank" rel="noreferrer"
                        style={{ fontSize: 9.5, color: "var(--accent-2)", padding: "1px 5px", border: "1px solid rgba(91,140,255,.3)", borderRadius: 4, textDecoration: "none", background: "rgba(91,140,255,.08)" }}>
                        MC News
                      </a>
                    </div>
                    <div style={{ display: "flex", gap: 5, marginTop: 3, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 9.5, fontWeight: 700, padding: "1px 6px", borderRadius: 999, background: `${convColor}20`, color: convColor, border: `1px solid ${convColor}40` }}>{conv}</span>
                      {isGoodEma && <span style={{ fontSize: 9.5, color: emaColor, padding: "1px 6px", border: `1px solid ${emaColor}40`, borderRadius: 999, background: `${emaColor}15` }}>EMA {pctEma >= 0 ? "+" : ""}{pctEma}%</span>}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>LTP</div>
                    <div className="num" style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)" }}>₹{s["LTP"]}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Entry</div>
                    <div className="num" style={{ fontSize: 11, color: "var(--up)" }}>{s["Entry Zone"] || "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Stop Loss</div>
                    <div className="num" style={{ fontSize: 13, fontWeight: 600, color: "var(--down)" }}>₹{s["Stop Loss"] || "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Target</div>
                    <div className="num" style={{ fontSize: 11, color: "var(--up)" }}>₹{s["Target 1"] || "—"}</div>
                    <div className="num" style={{ fontSize: 10, color: "var(--ink-3)" }}>₹{s["Target 2"] || ""}</div>
                  </div>
                  <div style={{ fontSize: 10.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
                    {catalyst ? (
                      <div style={{ color: "var(--ink-1)", fontWeight: 500 }}>{catalyst.split("|")[0]?.trim()}</div>
                    ) : null}
                    <div style={{ fontSize: 10, color: "var(--ink-4)", marginTop: 2 }}>
                      RSI {s["RSI"]} · Vol {s["Vol/Avg"]}x · R:R {s["R:R"] || "—"}:1
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <p style={{ margin: "12px 0 0", fontSize: 10.5, color: "var(--ink-4)" }}>
          ⚠️ Always verify on TradingView + check Moneycontrol news before buying. Use Stop Loss. Never risk more than 1-2% of capital per trade.
        </p>
      </div>
    </div>
  );
}
