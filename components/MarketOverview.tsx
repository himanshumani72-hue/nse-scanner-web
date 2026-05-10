"use client";

export default function MarketOverview({ data }: { data?: any }) {
  if (!data) return (
    <div className="card p-16 text-center">
      <div className="text-4xl mb-4">📊</div>
      <p className="text-slate-400">Market data updates daily at 9:20 AM IST.</p>
    </div>
  );

  const indicators = data.indicators || [];
  const usNews     = data.us_news    || [];
  const inNews     = data.india_news || [];
  const seasonal   = data.seasonal   || [];
  const results    = data.results    || [];
  const contracts  = data.contracts  || [];
  const events     = data.events     || [];

  return (
    <div className="space-y-4">
      {/* ── Market Indicators ── */}
      <div className="card p-4">
        <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wide">📈 Market Indicators</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {indicators.map((ind: any) => (
            <div key={ind.name} className="p-3 rounded-lg" style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)" }}>
              <div className="text-xs text-slate-500 mb-1">{ind.name}</div>
              <div className="font-bold text-white text-sm">{ind.value}</div>
              <div className={`text-xs font-medium mt-1 ${ind.status === "Rising" ? "text-green-400" : "text-red-400"}`}>
                {ind.status === "Rising" ? "▲" : "▼"} {ind.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ── Seasonal Top 10 ── */}
        <div className="card p-4">
          <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wide">📅 Top Stocks This Month</h3>
          <div className="space-y-1.5">
            {seasonal.length === 0 && <p className="text-slate-500 text-sm">No data yet</p>}
            {seasonal.map((s: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm py-1 border-b" style={{ borderColor: "var(--border)" }}>
                <span className="font-bold text-white">{i + 1}. {s.Symbol}</span>
                <span className="text-green-400 text-xs">{s["Win Rate"]}% wins | {s["Avg Ret %"]}% avg</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Upcoming Results ── */}
        <div className="card p-4">
          <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wide">📢 Upcoming Results</h3>
          <div className="space-y-1.5">
            {results.length === 0 && <p className="text-slate-500 text-sm">No results in next 10 days</p>}
            {results.map((r: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm py-1 border-b" style={{ borderColor: "var(--border)" }}>
                <span className="font-bold text-white">{r.Symbol}</span>
                <span className="text-yellow-400 text-xs">{r["Result Date"]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ── US News ── */}
        <div className="card p-4">
          <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wide">🇺🇸 US Govt / Fed News</h3>
          <div className="space-y-2">
            {usNews.length === 0 && <p className="text-slate-500 text-sm">No recent news</p>}
            {usNews.map((n: any, i: number) => (
              <div key={i} className="text-sm py-1.5 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="text-slate-200 leading-snug">{n.title}</div>
                <div className="flex gap-3 mt-1">
                  <span className="text-slate-500 text-xs">{n.date}</span>
                  {n.impacted && <span className="text-blue-400 text-xs">{n.impacted}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── India News ── */}
        <div className="card p-4">
          <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wide">🇮🇳 India Govt / RBI / SEBI</h3>
          <div className="space-y-2">
            {inNews.length === 0 && <p className="text-slate-500 text-sm">No recent news</p>}
            {inNews.map((n: any, i: number) => (
              <div key={i} className="text-sm py-1.5 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="text-slate-200 leading-snug">{n.title}</div>
                <div className="flex gap-3 mt-1">
                  <span className="text-slate-500 text-xs">{n.date}</span>
                  {n.impacted && <span className="text-green-400 text-xs">{n.impacted}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ── Contract Stocks ── */}
        <div className="card p-4">
          <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wide">🏆 Contract / Order Wins</h3>
          <div className="space-y-2">
            {contracts.length === 0 && <p className="text-slate-500 text-sm">No contract news this week</p>}
            {contracts.map((c: any, i: number) => (
              <div key={i} className="text-sm py-1.5 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="text-slate-200 leading-snug">{c.Headline}</div>
                <span className="text-slate-500 text-xs">{c.Date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Event Stocks ── */}
        <div className="card p-4">
          <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wide">⭐ Events (Div / Bonus / Split)</h3>
          <div className="space-y-2">
            {events.length === 0 && <p className="text-slate-500 text-sm">No event news this week</p>}
            {events.map((e: any, i: number) => (
              <div key={i} className="text-sm py-1.5 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="text-slate-200 leading-snug">{e.Headline}</div>
                <span className="text-slate-500 text-xs">{e.Date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-slate-600 text-xs text-center pb-2">Updated: {data.scan_time || "—"}</p>
    </div>
  );
}
