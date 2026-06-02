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
  // next_day intentionally not consumed here — shown in the Probability tab only

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
          <SHdr emoji="📢" title="Upcoming Results" />
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

      {/* Tomorrow's Top Buys moved to the Probability tab — single source of truth */}
    </div>
  );
}
