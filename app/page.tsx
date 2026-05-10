import Link from "next/link";
import {
  TrendingUp, Zap, BarChart2, Target, Shield, Clock,
  CheckCircle, ChevronRight, Star
} from "lucide-react";

const features = [
  { icon: Zap, title: "Big Movers", desc: "Stocks about to move 8–15% — detected BEFORE the move using news catalyst + volume analysis." },
  { icon: BarChart2, title: "Chart Patterns", desc: "EMA-51 recovery patterns on 2H timeframe with RSI filter. Only high-probability setups." },
  { icon: TrendingUp, title: "W-Pattern 5M", desc: "Double-bottom W-patterns on 5-minute charts for intraday entries with MACD confirmation." },
  { icon: Target, title: "Position Sizing", desc: "ATR-based Stop Loss, Target & Qty auto-calculated for ₹2L capital. Know your exact risk before you trade." },
  { icon: Shield, title: "News Intelligence", desc: "Each alert scored against 40+ high-impact catalysts: FDA approvals, order wins, earnings beats." },
  { icon: Clock, title: "Real-Time Updates", desc: "Scans run at 9:20 AM & 3:00 PM IST. Dashboard updates instantly via live Supabase connection." },
];

const sampleAlerts = [
  { symbol: "TITAN", ltp: "3,420", chg: "+2.1%", conf: "76%", cat: "High", move: "10–15%", sl: "3,360", tgt: "3,580", news: "Mega order win from govt" },
  { symbol: "BIOCON", ltp: "312", chg: "+0.8%", conf: "70%", cat: "High", move: "8–12%", sl: "306", tgt: "328", news: "USFDA approval for generic" },
  { symbol: "BANKBARODA", ltp: "243", chg: "-0.3%", conf: "69%", cat: "Medium", move: "5–10%", sl: "238", tgt: "256", news: "Record Q4 profit beat" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
      {/* ── Navbar ── */}
      <nav className="border-b border-[#1e293b] px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg">NSE Scanner Pro</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors">Sign In</Link>
          <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors">
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-700/40 rounded-full px-4 py-1.5 text-blue-400 text-sm mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full live-dot inline-block"></span>
          Live NSE alerts — 9:20 AM &amp; 3:00 PM IST daily
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Find the next<br />
          <span className="text-blue-400">8–15% mover</span>{" "}
          <span className="text-slate-400">before</span><br />
          the market does
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-8">
          Real-time NSE scanner that combines news catalysts, volume analysis, and chart patterns
          to identify high-probability trades — with exact stop loss, target, and position size.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2">
            Start 30-Day Free Trial <ChevronRight size={20} />
          </Link>
          <p className="text-slate-500 text-sm">No card required • ₹99/month after trial</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto mt-14">
          {[["500+", "NSE stocks scanned"], ["2x/day", "Scan schedule"], ["₹99", "Per month"]].map(([val, label]) => (
            <div key={label}>
              <div className="text-3xl font-bold text-white">{val}</div>
              <div className="text-slate-500 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Live sample ── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="card p-1 overflow-hidden">
          <div className="bg-[#0d1b2e] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full live-dot"></span>
              <span className="text-sm text-slate-400 font-medium">BIG MOVERS — Today 9:22 AM IST</span>
            </div>
            <span className="text-xs text-slate-600">Sample preview</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e293b] text-slate-500 text-xs">
                  {["Symbol","LTP","Change","Confidence","Catalyst","Est. Move","Stop Loss","Target","Top News"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleAlerts.map((a, i) => (
                  <tr key={a.symbol} className={`border-b border-[#1e293b] ${i % 2 === 0 ? "bg-blue-950/10" : ""}`}>
                    <td className="px-4 py-3 font-bold text-white">{a.symbol}</td>
                    <td className="px-4 py-3 font-mono">₹{a.ltp}</td>
                    <td className="px-4 py-3"><span className="badge-bull">{a.chg}</span></td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${parseInt(a.conf) >= 75 ? "text-green-400" : "text-yellow-400"}`}>{a.conf}</span>
                    </td>
                    <td className="px-4 py-3"><span className="badge-bull">{a.cat}</span></td>
                    <td className="px-4 py-3 font-medium text-orange-400">{a.move}</td>
                    <td className="px-4 py-3 text-red-400 font-mono">₹{a.sl}</td>
                    <td className="px-4 py-3 text-green-400 font-mono font-bold">₹{a.tgt}</td>
                    <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{a.news}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 text-center bg-gradient-to-t from-[#0a0f1e] to-transparent">
            <Link href="/register" className="text-blue-400 text-sm hover:text-blue-300 font-medium">
              Sign up free to see live alerts →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-2">Everything you need to trade better</h2>
        <p className="text-slate-400 text-center mb-12">Built by a trader, for traders</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5 hover:border-blue-700/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-900/40 flex items-center justify-center mb-4">
                <Icon size={20} className="text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-2">Simple pricing</h2>
        <p className="text-slate-400 text-center mb-12">One plan, everything included</p>
        <div className="max-w-sm mx-auto card p-8 border-blue-600/50 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">Most Popular</span>
          </div>
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-white mt-2">₹99</div>
            <div className="text-slate-400 mt-1">per month</div>
            <div className="mt-3 inline-flex items-center gap-1 bg-green-900/30 text-green-400 text-sm px-3 py-1 rounded-full">
              <CheckCircle size={14} /> 30 days free trial — no card required
            </div>
          </div>
          <ul className="space-y-3 mb-8">
            {[
              "500+ NSE stocks scanned daily",
              "Big Movers pre-move alerts",
              "2H Chart Pattern signals",
              "5M W-Pattern intraday setups",
              "ATR-based position sizing",
              "News catalyst scoring",
              "Real-time dashboard updates",
              "9:20 AM + 3:00 PM scan schedule",
            ].map(f => (
              <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Link href="/register" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-semibold transition-colors block text-center">
            Start Free Trial →
          </Link>
        </div>
      </section>

      {/* ── Testimonial placeholder ── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="card p-8 text-center max-w-2xl mx-auto">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />)}
          </div>
          <p className="text-slate-300 text-lg italic mb-4">
            "Caught BIOCON's FDA approval move 2 hours before it ran 11%. The news scoring and position sizing saves me hours of manual analysis."
          </p>
          <div className="text-slate-500 text-sm">— Swing trader, Mumbai</div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center border-t border-[#1e293b] mt-8">
        <h2 className="text-3xl font-bold mb-4">Start trading smarter today</h2>
        <p className="text-slate-400 mb-8">30 days free. Cancel anytime. No credit card needed to start.</p>
        <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 inline-block">
          Create Free Account
        </Link>
        <p className="text-slate-600 text-sm mt-4">For Indian traders only • NSE/BSE markets</p>
      </section>
    </div>
  );
}
