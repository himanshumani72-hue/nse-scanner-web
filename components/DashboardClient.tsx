"use client";
import { useState, useEffect } from "react";
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
import MarketOverview from "./MarketOverview";
import RankingTable from "./RankingTable";
import ScannerHealthRail from "./ScannerHealthRail";
import Link from "next/link";
import { Sun, Moon, CreditCard } from "lucide-react";

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
  sectorAlerts?:     Alert[];
  brokerAlerts?:     Alert[];
  twitterAlerts?:    Alert[];
  marketData?:     any;
  panelsData?:     any;
  healthData?:     any;
}

type Tab = "overview" | "movers" | "patterns" | "wpattern" | "ranking" | "momentum" | "falling" | "turnaround" | "bulkdeals" | "breakout" | "sectors" | "broker" | "twitter";

const ICONS = {
  Globe:   () => <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="6" cy="6" r="4.5"/><path d="M1.5 6 H10.5"/><path d="M6 1.5 a6 5 0 0 1 0 9 a6 5 0 0 1 0 -9"/></svg>,
  Bolt:    () => <svg width={12} height={12} viewBox="0 0 12 12" fill="currentColor"><path d="M6.8 1 L2.5 6.6 H5.6 L4.4 11 L9.2 5.2 H6.4 L7.5 1 Z"/></svg>,
  Pattern: () => <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1.5 6 Q3 9 5 9 Q7 9 8.5 6 L8.5 4 L11 6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  W:       () => <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1.5 3 L3.5 9 L5 5 L7 9 L9 5 L10.5 9" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Trophy:  () => <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 2 H9 V5 a3 3 0 0 1 -6 0 Z" strokeLinejoin="round"/><path d="M3 3 H1.5 V4.2 a1.5 1.5 0 0 0 1.5 1.5"/><path d="M9 3 H10.5 V4.2 a1.5 1.5 0 0 1 -1.5 1.5"/><path d="M4.5 8 H7.5 L8 10.5 H4 Z" strokeLinejoin="round"/></svg>,
  Down:    () => <svg width={10} height={10} viewBox="0 0 10 10"><path d="M5 9 L9 2 L1 2 Z" fill="currentColor"/></svg>,
  Rocket:  () => <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M6 1.5 C6 1.5 9.5 2.5 9.5 6.5 L7 9 L5 7 L2.5 9.5 C2.5 9.5 1 9 1 7.5 L3.5 5 L2 2.5 C2 2.5 5 1.5 6 1.5Z" strokeLinejoin="round"/><circle cx="7.5" cy="4.5" r="0.8" fill="currentColor"/></svg>,
  Danger:  () => <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M6 1.5 L10.5 9.5 H1.5 Z" strokeLinejoin="round"/><line x1="6" y1="5" x2="6" y2="7.5" strokeLinecap="round"/><circle cx="6" cy="8.8" r="0.4" fill="currentColor" stroke="none"/></svg>,
  Search:  () => <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="6" r="4.25"/><path d="M9.5 9.5 L12.5 12.5" strokeLinecap="round"/></svg>,
};

export default function DashboardClient({ userEmail, subStatus, daysLeft, lastScan, bigMovers, chartPatterns, wPatterns, cannonAlerts = [], boomerangAlerts = [], turnaroundAlerts = [], bulkDealsAlerts = [], breakoutAlerts = [], sectorAlerts = [], brokerAlerts = [], twitterAlerts = [], marketData, panelsData, healthData }: Props) {
  const [tab,         setTab]        = useState<Tab>("overview");
  const [movers,      setMovers]     = useState<Alert[]>(bigMovers);
  const [patterns,    setPatterns]   = useState<Alert[]>(chartPatterns);
  const [wPats,       setWPats]      = useState<Alert[]>(wPatterns);
  const [momentum,    setMomentum]   = useState<Alert[]>(cannonAlerts);
  const [boomerang,   setBoomerang]  = useState<Alert[]>(boomerangAlerts);
  const [turnaround,  setTurnaround] = useState<Alert[]>(turnaroundAlerts);
  const [bulkDeals,   setBulkDeals]  = useState<Alert[]>(bulkDealsAlerts);
  const [breakout,    setBreakout]   = useState<Alert[]>(breakoutAlerts);
  const [sectors,     setSectors]    = useState<Alert[]>(sectorAlerts);
  const [broker,      setBroker]     = useState<Alert[]>(brokerAlerts);
  const [twitter,     setTwitter]    = useState<Alert[]>(twitterAlerts);
  const [lastUpdated, setLastUpdated]= useState<string | null>(lastScan);
  const [isLive,      setIsLive]     = useState(false);
  const [clock,       setClock]      = useState("");
  const supabase = createClient();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const ist = new Date(d.getTime() + 5.5 * 3600000);
      setClock(ist.toISOString().slice(11, 19) + " IST");
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
        if (a.scan_type === "SECTOR_ROTATION")  setSectors(prev    => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "BROKER_UPGRADES")  setBroker(prev     => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
        if (a.scan_type === "TWITTER_SPIKE")    setTwitter(prev    => [a, ...prev.filter(x => x.symbol !== a.symbol)]);
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

  const TABS: { id: Tab; label: string; icon: () => JSX.Element; count: number | null }[] = [
    { id: "overview",  label: "Market Overview",      icon: ICONS.Globe,   count: null },
    { id: "movers",    label: "Big Movers",            icon: ICONS.Bolt,    count: movers.length },
    { id: "patterns",  label: "Cup & Handle",          icon: ICONS.Pattern, count: patterns.length },
    { id: "wpattern",  label: "W-Pattern 15m",         icon: ICONS.W,       count: wPats.length },
    { id: "momentum",   label: "Momentum Strategy",     icon: ICONS.Rocket,  count: momentum.length },
    { id: "turnaround", label: "Turnaround Plays",     icon: ICONS.Pattern, count: turnaround.length || null },
    { id: "bulkdeals", label: "Bulk Deals",            icon: ICONS.Trophy,  count: bulkDeals.length || null },
    { id: "breakout",  label: "52W Breakouts",         icon: ICONS.Rocket,  count: breakout.length || null },
    { id: "sectors",   label: "Sector Rotation",       icon: ICONS.Globe,   count: sectors.length || null },
    { id: "broker",    label: "Broker Upgrades",       icon: ICONS.Trophy,  count: broker.length || null },
    { id: "twitter",   label: "Twitter Spike",         icon: ICONS.Bolt,    count: twitter.length || null },
    { id: "falling",   label: "Stocks About to Fall",  icon: ICONS.Danger,  count: (boomerang.length + (panelsData?.falling_stocks?.length ?? 0)) || null },
    { id: "ranking",   label: "Probability",           icon: ICONS.Trophy,  count: panelsData?.ranking?.length ?? null },
  ];

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
              const isOpen = t >= 9*60+15 && t <= 15*60+30;
              const dotColor = isLive ? "var(--up)" : isOpen ? "var(--up)" : "var(--ink-3)";
              const label = isLive ? "Live update!" : isOpen ? "Market open" : "Markets closed";
              return (<><PulseDot color={dotColor} /><span style={{ fontSize: 12, color: isOpen ? "var(--up)" : "var(--ink-1)" }}>{label}</span></>);
            }
            return <><PulseDot color="var(--accent)"/><span style={{ fontSize: 12, color: "var(--ink-1)" }}>Loading…</span></>;
          })()}
          <span className="num" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{clock}</span>
        </div>

        {/* Search bar */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", maxWidth: 460, padding: "0 12px", height: 34, background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 9, color: "var(--ink-3)" }}>
            <ICONS.Search/>
            <span style={{ fontSize: 12.5 }}>Search ticker, pattern, sector…</span>
            <div style={{ flex: 1 }}/>
            <kbd style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "2px 6px", border: "1px solid var(--line-2)", borderRadius: 4, color: "var(--ink-2)", background: "var(--bg-3)" }}>⌘ K</kbd>
          </div>
        </div>

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
              {daysLeft <= 5 ? `⚠️ ${daysLeft}d left — Upgrade ₹99/mo` : `Upgrade ₹99/mo · ${daysLeft}d trial left`}
            </Link>
          )}
          {subStatus !== "trial" && subStatus !== "active" && (
            <Link href="/billing" style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#2bd07a,#3b82f6)", color: "white", fontSize: 11.5, fontWeight: 700, padding: "6px 14px", borderRadius: 8, textDecoration: "none" }}>
              <CreditCard size={13}/> Subscribe ₹99/mo
            </Link>
          )}
          <button onClick={toggle} style={{ background: "var(--bg-2)", border: "1px solid var(--line)", color: "var(--ink-2)", width: 32, height: 32, borderRadius: 8, display: "grid", placeItems: "center", cursor: "pointer" }}>
            {theme === "dark" ? <Sun size={14}/> : <Moon size={14}/>}
          </button>
          <ProfileDropdown email={userEmail} subStatus={subStatus} daysLeft={daysLeft}/>
        </div>
      </header>

      {/* ── Status Strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr) auto", gap: 0, borderBottom: "1px solid var(--line)", background: "var(--bg-1)" }}>
        {stats.map(s => (
          <div key={s.label} style={{ padding: "16px 22px", borderRight: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `color-mix(in oklab, var(${s.tone}) 12%, transparent)`, border: `1px solid color-mix(in oklab, var(${s.tone}) 28%, transparent)`, color: `var(${s.tone})`, display: "grid", placeItems: "center" }}>
              <s.icon/>
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
              <span style={{ fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.10em", fontWeight: 500 }}>{s.label}</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 2 }}>
                <span className="num" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink-0)" }}>{s.value}</span>
                <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{s.hint}</span>
              </div>
            </div>
          </div>
        ))}
        <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 200 }}>
          <span style={{ fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.10em", fontWeight: 500 }}>Last Scan</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <PulseDot color="var(--accent)"/>
            <span className="num" style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--ink-0)" }}>{fmtTime(lastUpdated)}</span>
          </div>
          <span style={{ fontSize: 10.5, color: "var(--ink-3)", marginTop: 2 }}>Auto-updates on scan</span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 28px", borderBottom: "1px solid var(--line)", background: "var(--bg-0)", position: "sticky", top: 61, zIndex: 40 }}>
        {TABS.map(t => {
          const isActive = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 14px 13px", margin: "0 2px", background: "transparent", border: "none", borderBottom: `2px solid ${isActive ? "var(--accent)" : "transparent"}`, color: isActive ? "var(--ink-0)" : "var(--ink-2)", fontSize: 13, fontWeight: 500, fontFamily: "inherit", cursor: "pointer", transition: "color .12s ease, border-color .12s ease", marginBottom: -1 }}>
              <span style={{ color: isActive ? "var(--accent)" : "var(--ink-3)" }}><t.icon/></span>
              <span>{t.label}</span>
              {t.count !== null && (
                <span className="num" style={{ fontSize: 10.5, padding: "2px 7px", borderRadius: 999, background: isActive ? "rgba(91,140,255,.14)" : "var(--bg-3)", color: isActive ? "var(--accent-2)" : "var(--ink-3)", border: `1px solid ${isActive ? "rgba(91,140,255,.30)" : "var(--line)"}` }}>{t.count}</span>
              )}
            </button>
          );
        })}
        <div style={{ flex: 1 }}/>
        {isLive && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 8 }}>
            <PulseDot color="var(--up)"/>
            <span style={{ fontSize: 11.5, color: "var(--up)", fontWeight: 500 }}>Updating live…</span>
          </div>
        )}
      </div>

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
          {tab === "sectors"    && <SectorRotationView alerts={sectors} />}
          {tab === "broker"     && <BrokerageView    alerts={broker} />}
          {tab === "twitter"    && <TwitterSpikeView alerts={twitter} />}
          {tab === "falling"    && <AboutToFallView  boomerangAlerts={boomerang} panelsData={panelsData} />}
          {tab === "ranking"    && <RankingTable     panelsData={panelsData} />}
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
                Upgrade to Pro · ₹99/mo
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
