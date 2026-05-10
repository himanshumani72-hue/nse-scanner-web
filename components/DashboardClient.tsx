"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { TrendingUp, Zap, BarChart2, Clock, CreditCard, RefreshCw, Sun, Moon, Globe, Trophy } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import type { Alert } from "@/lib/types";
import AlertsTable from "./AlertsTable";
import MarketOverview from "./MarketOverview";
import ProfileDropdown from "./ProfileDropdown";
import RankingTable from "./RankingTable";

interface Props {
  userEmail:     string;
  subStatus:     string;
  daysLeft:      number | null;
  lastScan:      string | null;
  bigMovers:     Alert[];
  chartPatterns: Alert[];
  wPatterns:     Alert[];
  marketData?:   any;
  panelsData?:   any;
}

type Tab = "movers" | "patterns" | "market" | "ranking";

export default function DashboardClient({ userEmail, subStatus, daysLeft, lastScan, bigMovers, chartPatterns, wPatterns, marketData, panelsData }: Props) {
  const [tab,         setTab]        = useState<Tab>("movers");
  const [movers,      setMovers]     = useState<Alert[]>(bigMovers);
  const [patterns,    setPatterns]   = useState<Alert[]>(chartPatterns);
  const [lastUpdated, setLastUpdated]= useState<string | null>(lastScan);
  const [isLive,      setIsLive]     = useState(false);
  const supabase = createClient();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const channel = supabase
      .channel("alerts-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "alerts" }, (payload) => {
        const a = payload.new as Alert;
        setLastUpdated(a.scanned_at);
        setIsLive(true);
        setTimeout(() => setIsLive(false), 5000);
        if (a.scan_type === "BIG_MOVERS")    setMovers(prev  => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "CHART_PATTERN") setPatterns(prev => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  const fmtTime = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }) + " IST";
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType; count: number; color: string }[] = [
    { key: "movers",   label: "Big Movers",          icon: Zap,      count: movers.length,   color: "text-orange-400" },
    { key: "patterns", label: "Cup & Handle Pattern", icon: BarChart2,count: patterns.length, color: "text-blue-400" },
    { key: "ranking",  label: "Probability Ranking",  icon: Trophy,   count: 0,               color: "text-yellow-400" },
    { key: "market",   label: "Market Overview",      icon: Globe,    count: 0,               color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      {/* ── Header ── */}
      <header className="border-b px-6 py-3" style={{ backgroundColor: "var(--header-bg)", borderColor: "var(--border)" }}>
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <TrendingUp size={17} className="text-white" />
            </div>
            <span className="font-bold text-white">NSE Scanner Pro</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${isLive ? "bg-green-400 live-dot" : "bg-slate-600"}`}></span>
              <span className="text-slate-500 hidden md:inline text-xs">
                {isLive ? "Live update!" : `Last scan: ${fmtTime(lastUpdated)}`}
              </span>
            </div>

            {/* Trial/Subscribe badge */}
            {subStatus === "trial" && daysLeft !== null && daysLeft > 5 && (
              <Link href="/billing" className="hidden md:flex items-center gap-1.5 bg-yellow-900/30 border border-yellow-700/30 text-yellow-400 text-xs px-3 py-1.5 rounded-lg hover:border-yellow-500/50 transition-colors">
                <CreditCard size={13} /> {daysLeft}d trial left
              </Link>
            )}
            {subStatus === "trial" && daysLeft !== null && daysLeft <= 5 && (
              <Link href="/billing" className="hidden md:flex items-center gap-1.5 bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold animate-pulse">
                <CreditCard size={13} /> {daysLeft}d left — Subscribe ₹99
              </Link>
            )}
            {(subStatus === "expired" || subStatus === "cancelled" || subStatus === "halted") && (
              <Link href="/billing" className="hidden md:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors">
                <CreditCard size={13} /> Subscribe — ₹99/month
              </Link>
            )}

            {/* Theme toggle */}
            <button onClick={toggle} className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors" title="Toggle theme">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Profile dropdown */}
            <ProfileDropdown email={userEmail} subStatus={subStatus} daysLeft={daysLeft} />
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 py-6">
        {/* ── Stats cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Big Mover Alerts",      value: movers.length,        icon: Zap,      color: "text-orange-400", bg: "bg-orange-900/20" },
            { label: "Cup & Handle Patterns", value: patterns.length,      icon: BarChart2,color: "text-blue-400",   bg: "bg-blue-900/20" },
            { label: "Top Ranked Stocks",     value: panelsData?.ranking?.length ?? 0, icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-900/20" },
            { label: "Last Scan (IST)",        value: fmtTime(lastUpdated), icon: Clock,    color: "text-green-400",  bg: "bg-green-900/20" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <div className="font-bold text-lg text-white leading-none">{value}</div>
                <div className="text-slate-500 text-xs mt-1">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {tabs.map(({ key, label, icon: Icon, count, color }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? "tab-active" : "tab-idle"}`}
            >
              <Icon size={15} className={tab === key ? "text-white" : color} />
              {label}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? "bg-white/20" : "bg-slate-700"}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
          {isLive && (
            <div className="ml-auto flex items-center gap-1.5 text-green-400 text-sm animate-pulse">
              <RefreshCw size={13} />
              <span>Updating live…</span>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        {tab === "market"   && <MarketOverview data={marketData} panelsData={panelsData} hideRanking />}
        {tab === "ranking"  && <RankingTable panelsData={panelsData} />}
        {tab === "movers"   && <AlertsTable alerts={movers}   scanType="movers" />}
        {tab === "patterns" && <AlertsTable alerts={patterns} scanType="patterns" />}
      </main>
    </div>
  );
}
