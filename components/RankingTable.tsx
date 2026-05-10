"use client";

export default function RankingTable({ panelsData }: { panelsData?: any }) {
  const ranking  = panelsData?.ranking  || [];
  const watchlist = panelsData?.watchlist || [];

  if (!panelsData) return (
    <div className="card p-16 text-center">
      <div className="text-4xl mb-4">🏆</div>
      <p className="text-slate-400">Probability ranking updates daily at 9:20 AM IST.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ── Final Probability Ranking ── */}
      <div className="card p-5">
        <h2 className="font-bold text-white text-base mb-1">🏆 Final Probability Ranking — Composite Score (All Dimensions)</h2>
        <p className="text-slate-500 text-xs mb-4">Weighted score across Macro (15%) + Sector (15%) + Seasonal (10%) + Technical (30%) + Statistical (15%) + Event (15%)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                {["Rank","Stock","Macro","Sector","Event","Seasonal","Statistical","Technical","Final Score"].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-xs text-slate-500 font-semibold uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ranking.map((r: any, i: number) => {
                const fs = parseFloat(r["Final Score"]);
                const fsBg    = fs >= 7 ? "rgba(20,83,45,0.3)" : fs >= 5 ? "rgba(120,53,15,0.3)" : "transparent";
                const fsColor = fs >= 7 ? "text-green-400" : fs >= 5 ? "text-yellow-400" : "text-red-400";
                const medal   = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i+1}.`;
                return (
                  <tr key={i} className="border-b hover:bg-white/[0.02] transition-colors"
                      style={{ borderColor: "var(--border)" }}>
                    <td className="px-3 py-2.5 text-slate-400 font-medium">{medal}</td>
                    <td className="px-3 py-2.5 font-bold text-white">{r["Stock Name"]}</td>
                    <td className="px-3 py-2.5 text-blue-400">{r.Macro}</td>
                    <td className="px-3 py-2.5 text-slate-300">{r.Sector}</td>
                    <td className="px-3 py-2.5 text-slate-300">{r.Event}</td>
                    <td className="px-3 py-2.5 text-slate-300">{r.Seasonal}</td>
                    <td className="px-3 py-2.5 text-slate-300">{r.Statistical}</td>
                    <td className="px-3 py-2.5 text-green-400 font-semibold">{r.Technical}</td>
                    <td className="px-3 py-2.5">
                      <span className="font-bold text-lg px-2 py-0.5 rounded-lg" style={{ backgroundColor: fsBg }}>
                        <span className={fsColor}>{fs}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Trade Watchlist ── */}
      {watchlist.length > 0 && (
        <div className="card p-5">
          <h2 className="font-bold text-white text-base mb-1">📋 Trade Watchlist — ATR-Based Entry / Target / Stop Loss</h2>
          <p className="text-slate-500 text-xs mb-4">Top ranked stocks with calculated entry zone, target and stop loss</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                  {["Rank","Symbol","LTP","Entry Zone","Target","Stop Loss","Upside %","Risk:Reward","Score"].map(h => (
                    <th key={h} className="px-3 py-3 text-left text-xs text-slate-500 font-semibold uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {watchlist.map((w: any, i: number) => (
                  <tr key={i} className="border-b hover:bg-white/[0.02] transition-colors"
                      style={{ borderColor: "var(--border)" }}>
                    <td className="px-3 py-2.5 text-slate-400">{w.Rank}</td>
                    <td className="px-3 py-2.5 font-bold text-white">{w.Symbol}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-200">₹{w.LTP}</td>
                    <td className="px-3 py-2.5 text-yellow-400 font-mono font-medium">₹{w["Entry Zone"]}</td>
                    <td className="px-3 py-2.5 text-green-400 font-bold font-mono">₹{w.Target}</td>
                    <td className="px-3 py-2.5 text-red-400 font-mono font-medium">₹{w["Stop Loss"]}</td>
                    <td className="px-3 py-2.5">
                      <span className={`font-semibold ${parseFloat(w["Upside %"]) >= 15 ? "text-green-400" : "text-yellow-400"}`}>
                        {w["Upside %"]}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-blue-400">{w["Risk:Reward"]}</td>
                    <td className="px-3 py-2.5 text-white font-bold">{w["Final Score"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
