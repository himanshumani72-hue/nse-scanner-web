"use client";
import Link from "next/link";

function SectionHeader({ emoji, title }: { emoji: string; title: string }) {
  return (
    <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wide">
      {emoji} {title}
    </h3>
  );
}

export default function MarketOverview({ data, panelsData, hideRanking }: { data?: any; panelsData?: any; hideRanking?: boolean }) {
  if (!data && !panelsData) return (
    <div className="card p-16 text-center">
      <div className="text-4xl mb-4">📊</div>
      <p className="text-slate-400">Market data updates daily at 9:20 AM IST.</p>
    </div>
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
  const ranking     = panelsData?.ranking        || [];
  const watchlist   = panelsData?.watchlist      || [];

  return (
    <div className="space-y-4">

      {/* ── Market Indicators ── */}
      {indicators.length > 0 && (
        <div className="card p-4">
          <SectionHeader emoji="📈" title="Market Indicators" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {indicators.map((ind: any) => (
              <div key={ind.name} className="p-3 rounded-lg" style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)" }}>
                <div className="text-xs text-slate-500 mb-1">{ind.name}</div>
                <div className="font-bold text-white text-sm">{ind.value}</div>
                <div className={`text-xs font-medium mt-1 ${ind.status === "Rising" ? "text-green-400" : "text-red-400"}`}>
                  {ind.status === "Rising" ? "▲ +" : "▼ -"}{ind.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Probability Ranking (hidden here — shown in its own tab) ── */}
      {ranking.length > 0 && !hideRanking && (
        <div className="card p-4">
          <SectionHeader emoji="🏆" title="Final Probability Ranking — Composite Score" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  {["Rank","Stock","Macro","Sector","Event","Seasonal","Statistical","Technical","Final Score"].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs text-slate-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ranking.map((r: any, i: number) => {
                  const fs = parseFloat(r["Final Score"]);
                  const fsColor = fs >= 7 ? "text-green-400" : fs >= 5 ? "text-yellow-400" : "text-red-400";
                  const medal = i === 0 ? "🥇 " : i === 1 ? "🥈 " : i === 2 ? "🥉 " : "";
                  return (
                    <tr key={i} className="border-b hover:bg-white/[0.02]" style={{ borderColor: "var(--border)" }}>
                      <td className="px-3 py-2 text-slate-400">{r.Rank}</td>
                      <td className="px-3 py-2 font-bold text-white">{medal}{r["Stock Name"]}</td>
                      <td className="px-3 py-2 text-blue-400">{r.Macro}</td>
                      <td className="px-3 py-2 text-slate-300">{r.Sector}</td>
                      <td className="px-3 py-2 text-slate-300">{r.Event}</td>
                      <td className="px-3 py-2 text-slate-300">{r.Seasonal}</td>
                      <td className="px-3 py-2 text-slate-300">{r.Statistical}</td>
                      <td className="px-3 py-2 text-green-400">{r.Technical}</td>
                      <td className={`px-3 py-2 font-bold text-lg ${fsColor}`}>{fs}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Trade Watchlist (hidden here — shown in its own tab) ── */}
      {watchlist.length > 0 && !hideRanking && (
        <div className="card p-4">
          <SectionHeader emoji="📋" title="Trade Watchlist — ATR-Based Entry / Target / Stop Loss" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  {["Rank","Symbol","LTP","Entry Zone","Target","Stop Loss","Upside %","Risk:Reward","Score"].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs text-slate-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {watchlist.map((w: any, i: number) => (
                  <tr key={i} className="border-b hover:bg-white/[0.02]" style={{ borderColor: "var(--border)" }}>
                    <td className="px-3 py-2 text-slate-400">{w.Rank}</td>
                    <td className="px-3 py-2 font-bold text-white">{w.Symbol}</td>
                    <td className="px-3 py-2 font-mono text-slate-200">₹{w.LTP}</td>
                    <td className="px-3 py-2 text-yellow-400 font-mono">₹{w["Entry Zone"]}</td>
                    <td className="px-3 py-2 text-green-400 font-bold font-mono">₹{w.Target}</td>
                    <td className="px-3 py-2 text-red-400 font-mono">₹{w["Stop Loss"]}</td>
                    <td className="px-3 py-2 text-green-400 font-semibold">{w["Upside %"]}%</td>
                    <td className="px-3 py-2 text-blue-400">{w["Risk:Reward"]}</td>
                    <td className="px-3 py-2 text-white font-bold">{w["Final Score"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 5 Stocks About to Fall ── */}
      {falling.length > 0 && (
        <div className="card p-4" style={{ borderColor: "#7f1d1d" }}>
          <SectionHeader emoji="🔻" title="5 Stocks About to Fall — Overbought / Distribution Signals" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  {["Symbol","Close","RSI","% vs 20DMA","Death Cross","Bear Score","Reason"].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs text-slate-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {falling.map((f: any, i: number) => (
                  <tr key={i} className="border-b" style={{ borderColor: "var(--border)", backgroundColor: "rgba(127,29,29,0.1)" }}>
                    <td className="px-3 py-2 font-bold text-red-400">{f.Symbol}</td>
                    <td className="px-3 py-2 font-mono text-slate-200">₹{f.Close}</td>
                    <td className="px-3 py-2 font-bold text-red-400">{f.RSI}</td>
                    <td className="px-3 py-2 text-orange-400">{f["% vs 20DMA"]}%</td>
                    <td className="px-3 py-2">
                      <span className={f["Death Cross"] === "YES" ? "badge-bear" : "badge-blue"}>{f["Death Cross"]}</span>
                    </td>
                    <td className="px-3 py-2 font-bold text-red-400 text-lg">{f["Bear Score"]}</td>
                    <td className="px-3 py-2 text-slate-400 text-xs">{f.Reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Correlation Panel ── */}
      {correlation.length > 0 && (
        <div className="card p-4">
          <SectionHeader emoji="🔗" title="Correlation Impact — Macro → Sector Links" />
          <div className="space-y-3">
            {correlation.map((c: any, i: number) => (
              <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)" }}>
                <div className="font-bold text-white mb-1">{c.Condition}</div>
                <div className="flex gap-4 flex-wrap text-sm">
                  <span className="text-green-400">✅ BUY: {c["Stocks to BUY"]}</span>
                  {c["Stocks to AVOID"] && <span className="text-red-400">❌ AVOID: {c["Stocks to AVOID"]}</span>}
                </div>
                <div className="text-slate-500 text-xs mt-1">{c.Reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ── Seasonal Top 10 ── */}
        <div className="card p-4">
          <SectionHeader emoji="📅" title="Top Stocks This Month (Seasonal)" />
          <div className="space-y-1.5">
            {seasonal.length === 0 && <p className="text-slate-500 text-sm">No data</p>}
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
          <SectionHeader emoji="📢" title="Upcoming Results (Next 10 Days)" />
          <div className="space-y-1.5">
            {results.length === 0 && <p className="text-slate-500 text-sm">No upcoming results</p>}
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
        <div className="card p-4">
          <SectionHeader emoji="🇺🇸" title="US Govt / Fed News" />
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

        <div className="card p-4">
          <SectionHeader emoji="🇮🇳" title="India Govt / RBI / SEBI" />
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
        <div className="card p-4">
          <SectionHeader emoji="🏆" title="Contract / Order Wins (Last 7 Days)" />
          <div className="space-y-2">
            {contracts.length === 0 && <p className="text-slate-500 text-sm">No contract news</p>}
            {contracts.map((c: any, i: number) => (
              <div key={i} className="text-sm py-1.5 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="text-slate-200 leading-snug">{c.Headline}</div>
                <span className="text-slate-500 text-xs">{c.Date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <SectionHeader emoji="⭐" title="Events — Dividend / Bonus / Split" />
          <div className="space-y-2">
            {events.length === 0 && <p className="text-slate-500 text-sm">No event news</p>}
            {events.map((e: any, i: number) => (
              <div key={i} className="text-sm py-1.5 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="text-slate-200 leading-snug">{e.Headline}</div>
                <span className="text-slate-500 text-xs">{e.Date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-slate-600 text-xs text-center pb-2">Updated: {data?.scan_time || panelsData?.scan_time || "—"}</p>
    </div>
  );
}
