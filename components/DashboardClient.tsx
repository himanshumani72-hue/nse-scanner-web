"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/components/ThemeProvider";
import type { Alert } from "@/lib/types";
import PulseDot from "./ui/PulseDot";
import ProfileDropdown from "./ProfileDropdown";
import BigMoversView from "./views/BigMoversView";
import CupHandleView from "./views/CupHandleView";
import WPatternView from "./views/WPatternView";
import MomentumView from "./views/MomentumView";
import AboutToFallView from "./views/AboutToFallView";
import TurnaroundView from "./views/TurnaroundView";
import BulkDealsView from "./views/BulkDealsView";
import BreakoutView from "./views/BreakoutView";
import SectorRotationView from "./views/SectorRotationView";
import BrokerageView from "./views/BrokerageView";
import TwitterSpikeView from "./views/TwitterSpikeView";
import BBSqueezeView from "./views/BBSqueezeView";
import FlatBaseView from "./views/FlatBaseView";
import Breakout1DView from "./views/Breakout1DView";
import MarketOverview from "./MarketOverview";
import RankingTable from "./RankingTable";
import ScannerHealthRail from "./ScannerHealthRail";
import PortfolioView from "./PortfolioView";
import PortfolioSummary from "./PortfolioSummary";
import Link from "next/link";
import { Sun, Moon, CreditCard, Sparkles, ChevronDown } from "lucide-react";

interface Props {
  userEmail:       string;
  subStatus:       string;
  daysLeft:        number | null;
  lastScan:        string | null;
  bigMovers:       Alert[];
  chartPatterns:   Alert[];
  wPatterns:       Alert[];
  cannonAlerts?:    Alert[];
  boomerangAlerts?: Alert[];
  turnaroundAlerts?: Alert[];
  bulkDealsAlerts?:  Alert[];
  breakoutAlerts?:   Alert[];
  breakout1dAlerts?: Alert[];
  sectorAlerts?:     Alert[];
  brokerAlerts?:     Alert[];
  twitterAlerts?:    Alert[];
  bbSqueezeAlerts?:  Alert[];
  flatUpAlerts?:     Alert[];
  flatDownAlerts?:   Alert[];
  marketData?:     any;
  panelsData?:     any;
  healthData?:     any;
  // Promo state (computed server-side from upi_payments count)
  promoLeft?:      number;   // remaining discounted months for this user (0-3)
  nextPrice?:      number;   // ₹49 during promo, ₹99 after
  promoEnabled?:   boolean;  // is the launch offer currently active site-wide?
}

type Tab = "overview" | "movers" | "twitter" | "patterns" | "wpattern" | "turnaround" | "bbsqueeze" | "flatup" | "flatdown" | "momentum" | "falling" | "nextday" | "multibagger" | "breakout" | "breakout1d" | "bulkdeals" | "sectors" | "broker" | "ranking" | "portfolio";

/* ── Nav dropdown for dashboard ─────────────────────── */
function DashDropdown({
  label, items, activeTab, onSelect, counts
}: {
  label: string;
  items: { id: Tab; label: string; emoji: string; desc: string }[];
  activeTab: Tab;
  onSelect: (t: Tab) => void;
  counts: Partial<Record<Tab, number>>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = items.some(i => i.id === activeTab);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          background: "none", border: "none", cursor: "pointer",
          fontSize: 16, fontWeight: 600,
          color: isActive ? "var(--accent)" : "var(--ink-0)",
          padding: "16px 14px 14px",
          borderBottom: `2px solid ${isActive ? "var(--accent)" : "transparent"}`,
          marginBottom: -1, transition: "all .12s",
          fontFamily: "inherit",
        }}
      >
        {label}
        <ChevronDown size={12} style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "none", color: "var(--ink-3)" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 1px)", left: 0,
          background: "var(--bg-1)", border: "1px solid var(--line)",
          borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
          width: 260, zIndex: 200, overflow: "hidden",
        }}>
          {items.map((item, i) => {
            const isItemActive = activeTab === item.id;
            const count = counts[item.id];
            return (
              <button key={item.id} onClick={() => { onSelect(item.id); setOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 16px",
                  borderBottom: i < items.length - 1 ? "1px solid var(--line)" : "none",
                  background: isItemActive ? "color-mix(in oklab, var(--accent) 8%, transparent)" : "transparent",
                  border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  transition: "background .1s",
                }}
                onMouseEnter={e => { if (!isItemActive) (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-2)"; }}
                onMouseLeave={e => { if (!isItemActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isItemActive ? "var(--accent)" : "var(--ink-0)" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 1 }}>{item.desc}</div>
                </div>
                {count != null && count > 0 && (
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, padding: "1px 7px", borderRadius: 999,
                    background: isItemActive ? "rgba(91,140,255,.2)" : "var(--bg-3)",
                    color: isItemActive ? "var(--accent)" : "var(--ink-3)",
                  }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const ICONS = {
  Globe:   () => <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="6" cy="6" r="4.5"/><path d="M1.5 6 H10.5"/><path d="M6 1.5 a6 5 0 0 1 0 9 a6 5 0 0 1 0 -9"/></svg>,
  Bolt:    () => <svg width={12} height={12} viewBox="0 0 12 12" fill="currentColor"><path d="M6.8 1 L2.5 6.6 H5.6 L4.4 11 L9.2 5.2 H6.4 L7.5 1 Z"/></svg>,
  Trophy:  () => <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 2 H9 V5 a3 3 0 0 1 -6 0 Z" strokeLinejoin="round"/><path d="M3 3 H1.5 V4.2 a1.5 1.5 0 0 0 1.5 1.5"/><path d="M9 3 H10.5 V4.2 a1.5 1.5 0 0 1 -1.5 1.5"/><path d="M4.5 8 H7.5 L8 10.5 H4 Z" strokeLinejoin="round"/></svg>,
  Down:    () => <svg width={10} height={10} viewBox="0 0 10 10"><path d="M5 9 L9 2 L1 2 Z" fill="currentColor"/></svg>,
  Pattern: () => <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1.5 6 Q3 9 5 9 Q7 9 8.5 6 L8.5 4 L11 6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Rocket:  () => <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M6 1.5 C6 1.5 9.5 2.5 9.5 6.5 L7 9 L5 7 L2.5 9.5 C2.5 9.5 1 9 1 7.5 L3.5 5 L2 2.5 C2 2.5 5 1.5 6 1.5Z" strokeLinejoin="round"/><circle cx="7.5" cy="4.5" r="0.8" fill="currentColor"/></svg>,
  Danger:  () => <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M6 1.5 L10.5 9.5 H1.5 Z" strokeLinejoin="round"/><line x1="6" y1="5" x2="6" y2="7.5" strokeLinecap="round"/><circle cx="6" cy="8.8" r="0.4" fill="currentColor" stroke="none"/></svg>,
  W:       () => <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1.5 3 L3.5 9 L5 5 L7 9 L9 5 L10.5 9" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

export default function DashboardClient({ userEmail, subStatus, daysLeft, lastScan, bigMovers, chartPatterns, wPatterns, cannonAlerts = [], boomerangAlerts = [], turnaroundAlerts = [], bulkDealsAlerts = [], breakoutAlerts = [], breakout1dAlerts = [], sectorAlerts = [], brokerAlerts = [], twitterAlerts = [], bbSqueezeAlerts = [], flatUpAlerts = [], flatDownAlerts = [], marketData, panelsData, healthData, promoLeft = 0, nextPrice = 99, promoEnabled = false }: Props) {
  const [tab,         setTab]        = useState<Tab>("overview");
  const [movers,      setMovers]     = useState<Alert[]>(bigMovers);
  const [patterns,    setPatterns]   = useState<Alert[]>(chartPatterns);
  const [wPats,       setWPats]      = useState<Alert[]>(wPatterns);
  const [momentum,    setMomentum]   = useState<Alert[]>(cannonAlerts);
  const [boomerang,   setBoomerang]  = useState<Alert[]>(boomerangAlerts);
  const [turnaround,  setTurnaround] = useState<Alert[]>(turnaroundAlerts);
  const [bulkDeals,   setBulkDeals]  = useState<Alert[]>(bulkDealsAlerts);
  const [breakout,    setBreakout]   = useState<Alert[]>(breakoutAlerts);
  const [breakout1d,  setBreakout1d] = useState<Alert[]>(breakout1dAlerts);
  const [sectors,     setSectors]    = useState<Alert[]>(sectorAlerts);
  const [broker,      setBroker]     = useState<Alert[]>(brokerAlerts);
  const [twitter,     setTwitter]    = useState<Alert[]>(twitterAlerts);
  const [bbSqueeze,   setBBSqueeze]  = useState<Alert[]>(bbSqueezeAlerts);
  const [flatUp,      setFlatUp]     = useState<Alert[]>(flatUpAlerts);
  const [flatDown,    setFlatDown]   = useState<Alert[]>(flatDownAlerts);
  const [lastUpdated, setLastUpdated]= useState<string | null>(lastScan);
  const [isLive,      setIsLive]     = useState(false);
  const [clock,       setClock]      = useState("");
  // 0=Sun, 1=Mon, … 6=Sat (in IST, not browser-local)
  const [istWeekday,  setIstWeekday] = useState<number>(-1);
  const supabase = createClient();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const ist = new Date(d.getTime() + 5.5 * 3600000);
      setClock(ist.toISOString().slice(11, 19) + " IST");
      setIstWeekday(ist.getUTCDay());   // UTC because `ist` is offset-adjusted
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const channel = supabase.channel("alerts-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "alerts" }, (payload) => {
        const a = payload.new as Alert;
        setLastUpdated(a.scanned_at);
        setIsLive(true);
        setTimeout(() => setIsLive(false), 5000);
        if (a.scan_type === "BIG_MOVERS")       setMovers(prev    => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "CHART_PATTERN")    setPatterns(prev  => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "W_PATTERN_15M" || a.scan_type === "W_PATTERN_5M")
          setWPats(prev => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "CANNON_MOMENTUM")  setMomentum(prev   => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "BOOMERANG_REVERSAL") setBoomerang(prev => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "TURNAROUND")       setTurnaround(prev => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "BULK_DEALS")       setBulkDeals(prev  => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "BREAKOUT_52W")     setBreakout(prev   => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "BREAKOUT_1D")      setBreakout1d(prev => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "SECTOR_ROTATION")  setSectors(prev    => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "BROKER_UPGRADES")  setBroker(prev     => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "TWITTER_SPIKE")    setTwitter(prev    => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "BB_SQUEEZE")        setBBSqueeze(prev  => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "FLAT_BASE_UP")      setFlatUp(prev     => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "FLAT_BASE_DOWN")    setFlatDown(prev   => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  const fmtTime = (iso: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    // Add 5.5h offset for IST, then read UTC hours/minutes (which ARE the IST time)
    const ist = new Date(d.getTime() + 5.5 * 3600000);
    const hh = String(ist.getUTCHours()).padStart(2, "0");
    const mm = String(ist.getUTCMinutes()).padStart(2, "0");
    return `${hh}:${mm} IST`;
  };

  // ── Direct tabs (always visible) ──────────────────
  const DIRECT_TABS: { id: Tab; label: string; icon: () => JSX.Element; count: number | null }[] = [
    { id: "overview", label: "Market Overview", icon: ICONS.Globe, count: null },
    { id: "movers",   label: "Big Movers",      icon: ICONS.Bolt,  count: movers.length || null },
    { id: "twitter",  label: "Buzz Spike",      icon: ICONS.Rocket,count: twitter.length || null },
    { id: "sectors",  label: "Sector Rotation", icon: ICONS.Globe, count: sectors.length || null },
  ];

  // ── Chart Patterns dropdown ─────────────────────
  const CHART_PATTERN_ITEMS: { id: Tab; label: string; emoji: string; desc: string }[] = [
    { id: "patterns",  label: "Cup & Handle",          emoji: "📈", desc: "EMA-51 recovery base pattern" },
    { id: "wpattern",  label: "W Pattern",              emoji: "Ｗ",  desc: "Double bottom reversal" },
    { id: "turnaround",label: "Turnaround Plays",       emoji: "↺",  desc: "Higher-low recovery setups" },
    { id: "bbsqueeze", label: "BB Squeeze Breakout",    emoji: "🎯", desc: "Narrow band + above midline" },
    { id: "flatup",    label: "Flat Base Breakout ↑",   emoji: "📦", desc: "Consolidation breakout bullish" },
    { id: "flatdown",  label: "Flat Base Breakdown ↓",  emoji: "📉", desc: "Consolidation breakdown bearish" },
  ];

  // ── Stock Analysis dropdown ─────────────────────
  const STOCK_ANALYSIS_ITEMS: { id: Tab; label: string; emoji: string; desc: string }[] = [
    { id: "ranking",    label: "Probability Ranking",  emoji: "🏆", desc: "Top stocks across all scanners" },
    { id: "momentum",   label: "Momentum Strategy",    emoji: "🚀", desc: "RSI cross-70 + delivery" },
    { id: "falling",    label: "Stocks About to Fall", emoji: "🔻", desc: "Death cross + RSI exhaustion" },
    { id: "nextday",    label: "Next Day Potential",   emoji: "🎯", desc: "EOD picks for tomorrow" },
    { id: "multibagger",label: "Multibagger Picks",    emoji: "💎", desc: "Long-term high-conviction" },
    { id: "breakout",   label: "52W Breakouts",        emoji: "🏔", desc: "Fresh 52-week highs" },
    { id: "breakout1d", label: "1D Breakouts",         emoji: "📈", desc: "Daily momentum + vol surge" },
    { id: "bulkdeals",  label: "Bulk Deals",           emoji: "🏦", desc: "Institutional accumulation" },
  ];

  // Count map for dropdown badges
  const tabCounts: Partial<Record<Tab, number>> = {
    patterns:   patterns.length,
    wpattern:   wPats.length,
    turnaround: turnaround.length,
    bbsqueeze:  bbSqueeze.length,
    flatup:     flatUp.length,
    flatdown:   flatDown.length,
    ranking:    panelsData?.ranking?.length ?? 0,
    momentum:   momentum.length,
    falling:    (boomerang.length + (panelsData?.falling_stocks?.length ?? 0)),
    nextday:    panelsData?.next_day?.length ?? 0,
    breakout:   breakout.length,
    breakout1d: breakout1d.length,
    bulkdeals:  bulkDeals.length,
  };

  const stats = [
    { label: "Big Mover Alerts",  value: movers.length,                       hint: "Triggered today",       icon: ICONS.Bolt,    tone: "--up" },
    { label: "Cup & Handle",      value: patterns.length,                     hint: "Bases in formation",    icon: ICONS.Pattern, tone: "--accent-2" },
    { label: "Top Ranked",        value: panelsData?.ranking?.length ?? 0,    hint: "Probability ≥ 75%",     icon: ICONS.Trophy,  tone: "--violet" },
    { label: "Distribution",      value: panelsData?.falling_stocks?.length ?? 0, hint: "Risk flagged · 1D-5D", icon: ICONS.Down, tone: "--down" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>

      {/* ── Header ── */}
      <header style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 28px", borderBottom: "1px solid var(--line)", background: "linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%)", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(8px)" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #2bd07a 0%, #5b8cff 100%)", display: "grid", placeItems: "center", boxShadow: "0 0 0 1px rgba(255,255,255,.06), 0 6px 18px -8px rgba(43,208,122,.5)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 10 L5 6 L7 8 L12 3" stroke="#06090c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="3" r="1.4" fill="#06090c"/>
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--ink-0)" }}>NSE Scanner</span>
            <span style={{ fontSize: 9.5, color: "var(--ink-3)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500 }}>Pro · v1.0</span>
          </div>
        </div>

        <div style={{ width: 1, height: 22, background: "var(--line)", margin: "0 6px" }}/>

        {/* Live status */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {(() => {
            // Compute real market status from IST clock
            const parts = clock.split(":");
            if (parts.length >= 2) {
              const h = parseInt(parts[0]), m = parseInt(parts[1]);
              const t = h * 60 + m;
              const isWeekend = istWeekday === 0 || istWeekday === 6;   // Sun=0, Sat=6
              const inMarketHours = t >= 9*60+15 && t <= 15*60+30;
              const isOpen   = !isWeekend && inMarketHours;
              const dotColor = isLive ? "var(--up)" : isOpen ? "var(--up)" : "var(--ink-3)";
              const label    = isLive
                ? "Live update!"
                : isOpen
                  ? "Market open"
                  : isWeekend
                    ? "Markets closed · weekend"
                    : "Markets closed";
              return (<><PulseDot color={dotColor} /><span style={{ fontSize: 12, color: isOpen ? "var(--up)" : "var(--ink-1)" }}>{label}</span></>);
            }
            return <><PulseDot color="var(--accent)"/><span style={{ fontSize: 12, color: "var(--ink-1)" }}>Loading…</span></>;
          })()}
          <span className="num" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{clock}</span>
        </div>

        {/* Flexible spacer — pushes the right-side controls to the edge */}
        <div style={{ flex: 1 }} />

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {subStatus === "trial" && daysLeft !== null && (
            <Link href="/billing" style={{
              display: "flex", alignItems: "center", gap: 6,
              background: daysLeft <= 5 ? "var(--down)" : "linear-gradient(135deg,#2bd07a,#3b82f6)",
              color: "white", fontSize: 11.5, fontWeight: 700,
              padding: "6px 14px", borderRadius: 8, textDecoration: "none",
              boxShadow: "0 2px 8px rgba(43,208,122,.3)"
            }}>
              <CreditCard size={13}/>
              {daysLeft <= 5
                ? `⚠️ ${daysLeft}d left — Upgrade ₹${nextPrice}/month`
                : `Upgrade ₹${nextPrice}/month · ${daysLeft}d trial left`}
            </Link>
          )}
          {subStatus !== "trial" && subStatus !== "active" && (
            <Link href="/billing" style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#2bd07a,#3b82f6)", color: "white", fontSize: 11.5, fontWeight: 700, padding: "6px 14px", borderRadius: 8, textDecoration: "none" }}>
              <CreditCard size={13}/> Subscribe ₹{nextPrice}/month
            </Link>
          )}

          {/* Promo · N months left — only when user is active AND still has discounted months */}
          {promoEnabled && subStatus === "active" && promoLeft > 0 && (
            <Link href="/billing"
              title={`Your next ${promoLeft} month${promoLeft === 1 ? "" : "s"} will be at ₹${nextPrice} instead of ₹99`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "color-mix(in oklab, var(--up) 12%, transparent)",
                border: "1px solid color-mix(in oklab, var(--up) 35%, transparent)",
                color: "var(--up)",
                fontSize: 11.5, fontWeight: 600,
                padding: "5px 11px", borderRadius: 999,
                textDecoration: "none",
              }}>
              <Sparkles size={12}/>
              Promo · {promoLeft} month{promoLeft === 1 ? "" : "s"} left at ₹{nextPrice}
            </Link>
          )}
          {/* Signals captured time */}
          {lastUpdated && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 8 }}>
              <PulseDot color="var(--accent)"/>
              <span style={{ fontSize: 11.5, color: "var(--ink-2)", fontWeight: 500 }}>
                {fmtTime(lastUpdated)}
              </span>
            </div>
          )}
          <button onClick={toggle} style={{ background: "var(--bg-2)", border: "1px solid var(--line)", color: "var(--ink-2)", width: 32, height: 32, borderRadius: 8, display: "grid", placeItems: "center", cursor: "pointer" }}>
            {theme === "dark" ? <Sun size={14}/> : <Moon size={14}/>}
          </button>
          <ProfileDropdown email={userEmail} subStatus={subStatus} daysLeft={daysLeft}/>
        </div>
      </header>

      {/* ── Navigation Bar with Dropdowns ── */}
      <nav style={{
        display: "flex", alignItems: "center", gap: 0,
        padding: "0 28px", borderBottom: "1px solid var(--line)",
        background: "var(--bg-1)", position: "sticky", top: 66, zIndex: 40,
      }}>
        {/* Direct tabs */}
        {DIRECT_TABS.map(t => {
          const isActive = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "16px 14px 14px", margin: "0 2px",
                background: "transparent", border: "none",
                borderBottom: `2px solid ${isActive ? "var(--accent)" : "transparent"}`,
                color: isActive ? "var(--accent)" : "var(--ink-0)",
                fontSize: 16, fontWeight: 600,
                fontFamily: "inherit", cursor: "pointer",
                transition: "color .12s ease, border-color .12s ease",
                marginBottom: -1, whiteSpace: "nowrap",
              }}>
              <t.icon/>
              <span>{t.label}</span>
              {t.count != null && t.count > 0 && (
                <span style={{
                  fontSize: 10.5, padding: "1px 6px", borderRadius: 999,
                  background: isActive ? "rgba(91,140,255,.14)" : "var(--bg-3)",
                  color: isActive ? "var(--accent)" : "var(--ink-3)",
                  border: `1px solid ${isActive ? "rgba(91,140,255,.30)" : "var(--line)"}`,
                }}>{t.count}</span>
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div style={{ width: 1, height: 22, background: "var(--line)", margin: "0 6px" }}/>

        {/* Chart Patterns dropdown */}
        <DashDropdown
          label="Chart Patterns"
          items={CHART_PATTERN_ITEMS}
          activeTab={tab}
          onSelect={setTab}
          counts={tabCounts}
        />

        {/* Stock Analysis dropdown */}
        <DashDropdown
          label="Stock Analysis"
          items={STOCK_ANALYSIS_ITEMS}
          activeTab={tab}
          onSelect={setTab}
          counts={tabCounts}
        />

        {/* Broker Upgrades direct link */}
        <button onClick={() => setTab("broker")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "16px 14px 14px",
            background: "transparent", border: "none",
            borderBottom: `2px solid ${tab === "broker" ? "var(--accent)" : "transparent"}`,
            color: tab === "broker" ? "var(--accent)" : "var(--ink-0)",
            fontSize: 16, fontWeight: 600,
            fontFamily: "inherit", cursor: "pointer", marginBottom: -1,
            whiteSpace: "nowrap",
          }}>
          🎯 Broker Upgrades
          {(broker.length ?? 0) > 0 && (
            <span style={{ fontSize: 10.5, padding: "1px 6px", borderRadius: 999, background: "var(--bg-3)", color: "var(--ink-3)", border: "1px solid var(--line)" }}>{broker.length}</span>
          )}
        </button>

        {/* My Portfolio */}
        <button onClick={() => setTab("portfolio")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "16px 14px 14px",
            background: "transparent", border: "none",
            borderBottom: `2px solid ${tab === "portfolio" ? "var(--accent)" : "transparent"}`,
            color: tab === "portfolio" ? "var(--accent)" : "var(--ink-0)",
            fontSize: 16, fontWeight: 600,
            fontFamily: "inherit", cursor: "pointer", marginBottom: -1,
            whiteSpace: "nowrap",
          }}>
          📊 My Portfolio
        </button>

        <div style={{ flex: 1 }} />

        {isLive && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px" }}>
            <PulseDot color="var(--up)"/>
            <span style={{ fontSize: 11.5, color: "var(--up)", fontWeight: 500 }}>Live update!</span>
          </div>
        )}
      </nav>

      {/* ── Main Content ── */}
      <div style={{ display: "flex", flex: 1 }}>
        <main style={{ flex: 1, padding: "24px 28px", minWidth: 0 }}>
          {tab === "overview"  && <MarketOverview    data={marketData} panelsData={panelsData} hideRanking />}
          {tab === "movers"    && <BigMoversView    alerts={movers} />}
          {tab === "patterns"  && <CupHandleView    alerts={patterns} />}
          {tab === "wpattern"   && <WPatternView     alerts={wPats} />}
          {tab === "momentum"   && <MomentumView     alerts={momentum} />}
          {tab === "turnaround" && <TurnaroundView   alerts={turnaround} />}
          {tab === "bulkdeals"  && <BulkDealsView    alerts={bulkDeals} />}
          {tab === "breakout"   && <BreakoutView     alerts={breakout} />}
          {tab === "breakout1d" && <Breakout1DView  alerts={breakout1d} />}
          {tab === "sectors"    && <SectorRotationView alerts={sectors} />}
          {tab === "broker"     && <BrokerageView    alerts={broker} />}
          {tab === "twitter"    && <TwitterSpikeView alerts={twitter} />}
          {tab === "bbsqueeze"  && <BBSqueezeView    alerts={bbSqueeze} />}
          {tab === "flatup"     && <FlatBaseView     alerts={flatUp}   direction="up"   />}
          {tab === "flatdown"   && <FlatBaseView     alerts={flatDown} direction="down" />}
          {tab === "falling"    && <AboutToFallView  boomerangAlerts={boomerang} panelsData={panelsData} />}
          {tab === "ranking"    && <RankingTable     panelsData={panelsData} />}
          {tab === "portfolio" && <PortfolioTab />}
          {tab === "nextday"    && <NextDayView      panelsData={panelsData} />}
          {tab === "multibagger"&& <ComingSoonView   title="Multibagger Picks" emoji="💎" desc="Long-term high-conviction setups. Criteria coming soon." />}
        </main>

        {/* ── Scanner Health Rail ── */}
        <aside style={{ width: 300, flexShrink: 0, borderLeft: "1px solid var(--line)", background: "var(--bg-1)", padding: "20px 18px", position: "sticky", top: 130, alignSelf: "flex-start", maxHeight: "calc(100vh - 130px)", overflowY: "auto" }}>
          <ScannerHealthRail health={healthData} />

          {/* Trial / subscribe box */}
          <div style={{ marginTop: 22, padding: 14, background: "var(--bg-2)", border: "1px dashed var(--line-2)", borderRadius: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width={11} height={11} viewBox="0 0 12 12" fill="var(--warn)"><path d="M6.8 1 L2.5 6.6 H5.6 L4.4 11 L9.2 5.2 H6.4 Z"/></svg>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-1)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {subStatus === "active" ? "Pro · Active ✓" : `Trial · ${daysLeft ?? 30} days left`}
              </span>
            </div>
            <p style={{ margin: "0 0 10px", fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.5 }}>
              {subStatus === "active" ? "Enjoying NSE Scanner Pro." : "Unlock unlimited scans, real-time alerts and pattern history."}
            </p>
            {subStatus !== "active" && (
              <Link href="/billing" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "white", fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: 8, textDecoration: "none" }}>
                Upgrade to Pro · ₹99/month
              </Link>
            )}
          </div>
        </aside>
      </div>

      {/* ── Footer ── */}
      <footer style={{ padding: "12px 28px", borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 18, fontSize: 11, color: "var(--ink-3)", background: "var(--bg-1)" }}>
        <span>© 2026 NSE Scanner Pro</span>
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--ink-4)", display: "inline-block" }}/>
        <span>Data: NSE · 15min delayed for Free tier</span>
        <div style={{ flex: 1 }}/>
        <span className="num">v1.0.0</span>
      </footer>
    </div>
  );
}

/* ── Portfolio Tab (with Holdings / Summary sub-tabs) ──── */
function PortfolioTab() {
  const [subTab, setSubTab] = useState<"holdings" | "summary">("holdings");
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {([
          { id: "holdings" as const, label: "📋 Holdings", desc: "11-column live table" },
          { id: "summary" as const, label: "📊 Summary", desc: "P&L, sector pie, scanner cross-ref" },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            style={{
              padding: "10px 20px", borderRadius: 10, border: "none",
              background: subTab === t.id ? "var(--accent)" : "var(--bg-2)",
              color: subTab === t.id ? "#fff" : "var(--ink-2)",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              transition: "all .15s ease",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {subTab === "holdings" ? <PortfolioView /> : <PortfolioSummary />}
    </div>
  );
}

/* ── Next Day Potential Movers inline view ─────────────── */
function NextDayView({ panelsData }: { panelsData?: any }) {
  const picks = panelsData?.next_day || [];
  if (!picks.length) return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: 64, textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🎯</div>
      <p style={{ color: "var(--ink-3)", margin: 0 }}>Next Day picks update after 3:45 PM IST using today's closing data.</p>
    </div>
  );

  const tv = (sym: string) => `https://in.tradingview.com/chart/?symbol=NSE:${sym}`;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: "16px 20px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "var(--ink-0)" }}>🎯 Next Day Potential Movers</h2>
        <p style={{ margin: 0, fontSize: 12, color: "var(--ink-3)" }}>EOD signals · EMA-51 entry zone + Vol surge + MACD building + News catalyst + Cross-scanner confirmation</p>
      </div>
      {picks.map((r: any, i: number) => (
        <div key={i} style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 14, padding: "16px 20px", borderLeft: "3px solid var(--accent)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <a href={tv(r.Symbol)} target="_blank" rel="noreferrer"
              style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-0)", textDecoration: "none" }}>
              {r.Symbol} ↗
            </a>
            <span style={{ background: r.Conviction === "HIGH" ? "rgba(43,208,122,.15)" : "rgba(243,181,74,.15)", color: r.Conviction === "HIGH" ? "var(--up)" : "var(--warn)", border: `1px solid ${r.Conviction === "HIGH" ? "rgba(43,208,122,.35)" : "rgba(243,181,74,.35)"}`, fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 999 }}>{r.Conviction || "MEDIUM"}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 10 }}>
            {[["LTP", `₹${r.LTP}`], ["RSI", r.RSI], ["Vol", r["Today Vol"]], ["EMA51", `+${r["% from EMA51"]}%`], ["SL", `₹${r["Stop Loss"]}`], ["T1", `₹${r["Target 1"]}`]].map(([l, v]) => (
              <div key={l as string} style={{ background: "var(--bg-2)", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{l as string}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)", marginTop: 2 }}>{String(v)}</div>
              </div>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5 }}>{r["Why Tomorrow"] || r["Why Buy"] || "Technical setup"}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Coming Soon placeholder ───────────────────────────── */
function ComingSoonView({ title, emoji, desc }: { title: string; emoji: string; desc: string }) {
  return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 16, padding: 64, textAlign: "center", maxWidth: 560, margin: "40px auto" }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>{emoji}</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink-0)", margin: "0 0 12px" }}>{title}</h2>
      <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7, margin: "0 0 24px" }}>{desc}</p>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "rgba(91,140,255,.1)", border: "1px solid rgba(91,140,255,.25)",
        color: "var(--accent)", fontSize: 13, fontWeight: 600,
        padding: "8px 20px", borderRadius: 999,
      }}>
        🔨 Scanner coming soon
      </div>
    </div>
  );
}
