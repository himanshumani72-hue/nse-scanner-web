"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, TrendingUp, TrendingDown, BarChart2, Activity,
         Zap, Target, Layers, Crosshair, Newspaper, Search,
         Sparkles, Rocket, ArrowRight, CheckCircle, Star,
         Shield, Clock, Users } from "lucide-react";

/* ── Ticker data ─────────────────────────────────────── */
const TICKER_STOCKS = [
  { sym: "RELIANCE",  price: "2,847", chg: "+1.23%" },
  { sym: "TCS",       price: "3,456", chg: "+0.45%" },
  { sym: "INFY",      price: "1,567", chg: "-0.28%" },
  { sym: "HDFCBANK",  price: "1,678", chg: "+0.91%" },
  { sym: "ICICIBANK", price: "1,234", chg: "+1.45%" },
  { sym: "WIPRO",     price: "456.75",chg: "-0.67%" },
  { sym: "TATAMOTORS",price: "1,023", chg: "+2.18%" },
  { sym: "BAJFINANCE",price: "6,812", chg: "+0.55%" },
  { sym: "AXISBANK",  price: "1,089", chg: "+0.32%" },
  { sym: "KOTAKBANK", price: "1,745", chg: "-0.14%" },
  { sym: "LT",        price: "3,210", chg: "+1.08%" },
  { sym: "SBIN",      price: "785",   chg: "+0.76%" },
];

/* ── Nav dropdown data ───────────────────────────────── */
const CHART_PATTERNS = [
  { icon: "📈", label: "Cup & Handle",           desc: "EMA-51 recovery base pattern" },
  { icon: "Ｗ",  label: "W Pattern",              desc: "Double bottom reversal setup" },
  { icon: "↺",  label: "Turnaround Plays",       desc: "Higher-low recovery setups" },
  { icon: "📦", label: "Flat Base Breakout ↑",   desc: "Consolidation breakout (bullish)" },
  { icon: "📉", label: "Flat Base Breakdown ↓",  desc: "Consolidation breakdown (bearish)" },
  { icon: "⛰",  label: "Double Top Pattern",     desc: "Two peaks — reversal signal" },
];

const STOCK_ANALYSIS = [
  { icon: "⚡", label: "Big Movers",             desc: "Volume surge + catalyst stocks" },
  { icon: "🚀", label: "Momentum Strategy",      desc: "RSI cross-70 + delivery" },
  { icon: "🔻", label: "Stocks About to Fall",   desc: "Death cross + RSI exhaustion" },
  { icon: "🎯", label: "Next Day Potential",     desc: "EOD setups for tomorrow's open" },
  { icon: "💎", label: "Multibagger Picks",      desc: "Long-term high-conviction setups" },
  { icon: "🏔", label: "52W Breakouts",          desc: "Fresh 52-week highs with volume" },
];

/* ── Mini sparkline SVG ──────────────────────────────── */
function Sparkline({ up }: { up: boolean }) {
  const color = up ? "#0d9968" : "#dc2626";
  const path  = up
    ? "M0,20 L10,17 L20,14 L30,16 L40,11 L50,8 L60,5"
    : "M0,5  L10,8  L20,11 L30,9  L40,14 L50,17 L60,20";
  return (
    <svg width={60} height={24} viewBox="0 0 60 24" fill="none">
      <path d={path} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Dropdown component ──────────────────────────────── */
function NavDropdown({ label, items }: { label: string; items: typeof CHART_PATTERNS }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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
          display: "flex", alignItems: "center", gap: 4,
          background: "none", border: "none", cursor: "pointer",
          fontSize: 15, fontWeight: 500, color: "#1f2937",
          padding: "8px 4px",
        }}
      >
        {label}
        <ChevronDown size={14} style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "none", color: "#6b7280" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
          background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)", width: 280, zIndex: 100,
          overflow: "hidden",
        }}>
          {items.map((item, i) => (
            <Link key={i} href="/register" style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "12px 16px", borderBottom: i < items.length-1 ? "1px solid #f3f4f6" : "none",
                transition: "background .12s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontSize: 18, lineHeight: 1.2, marginTop: 1 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{item.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Feature card ────────────────────────────────────── */
const FEATURES = [
  { icon: Zap,         title: "Big Movers",      desc: "2001 NSE stocks pre-filtered by volume surge, news catalyst and momentum." },
  { icon: BarChart2,   title: "Cup & Handle",    desc: "EMA-51 recovery bases on 2H timeframe — classic institutional accumulation." },
  { icon: Activity,    title: "W-Pattern 15M",   desc: "Double-bottom reversals on 15-min charts for precision entries." },
  { icon: TrendingUp,  title: "Flat Base ↑",     desc: "Quiet 90-day consolidation breaking out with volume confirmation." },
  { icon: TrendingDown,title: "Double Top",      desc: "Two-peak reversal pattern for high-probability short setups." },
  { icon: Target,      title: "52W Breakouts",   desc: "Stocks crossing prior 52W high on 1.3×+ volume — fresh momentum." },
  { icon: Layers,      title: "Bulk Deals",      desc: "NSE-published institutional buying — 3+ days accumulation = conviction." },
  { icon: Sparkles,    title: "Probability Rank",desc: "9-dimension composite score. Only 2+ scanner confirmation = shown." },
];

const STATS = [
  { value: "2,001", label: "NSE Stocks Scanned" },
  { value: "12",    label: "Independent Scanners" },
  { value: "2×",    label: "Daily Scans" },
  { value: "30",    label: "Day Free Trial" },
];

const TESTIMONIALS = [
  { name: "Vikram S.", role: "Swing Trader, Mumbai", stars: 5, text: "The cross-scanner confirmation is the best feature. When 3 scanners agree on a stock, it's almost always a winner." },
  { name: "Priya R.", role: "Positional Trader, Delhi", stars: 5, text: "Caught HLEGLAS at ₹340 after the Phoenix Recovery signal. It went to ₹420 in 2 weeks. This platform pays for itself." },
  { name: "Arjun M.", role: "Investor, Bangalore", stars: 5, text: "The Sector Rotation tab alone is worth the subscription. I know which sectors are leading before most traders do." },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif", background: "#fff", color: "#111827", minHeight: "100vh" }}>

      {/* ── TICKER BAR ─────────────────────────────────────── */}
      <div style={{
        background: "#0f172a", color: "#e2e8f0", height: 32,
        display: "flex", alignItems: "center", overflow: "hidden",
        fontSize: 12, fontWeight: 500,
      }}>
        <div style={{
          display: "flex", gap: 40, whiteSpace: "nowrap",
          animation: "tickerScroll 30s linear infinite",
          paddingLeft: "100%",
        }}>
          {[...TICKER_STOCKS, ...TICKER_STOCKS].map((s, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#94a3b8", letterSpacing: "0.06em" }}>{s.sym}</span>
              <span style={{ color: "#f1f5f9" }}>{s.price}</span>
              <span style={{ color: s.chg.startsWith("+") ? "#4ade80" : "#f87171" }}>{s.chg}</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes tickerScroll { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`}</style>
      </div>

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #f3f4f6",
        padding: "0 40px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            display: "grid", placeItems: "center",
            boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
          }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}>N</span>
          </div>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>NSE Scanner</span>
            <span style={{
              marginLeft: 8, fontSize: 11, fontWeight: 700, color: "#2563eb",
              background: "#eff6ff", padding: "1px 7px", borderRadius: 6,
              border: "1px solid #bfdbfe", letterSpacing: "0.06em",
            }}>PRO</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <NavDropdown label="Chart Patterns" items={CHART_PATTERNS} />
          <NavDropdown label="Stock Analysis" items={STOCK_ANALYSIS} />
          <Link href="/dashboard" style={{
            fontSize: 15, fontWeight: 500, color: "#1f2937",
            textDecoration: "none", padding: "8px 4px",
          }}>Sector Rotation</Link>
          <Link href="/billing" style={{
            fontSize: 15, fontWeight: 500, color: "#1f2937",
            textDecoration: "none", padding: "8px 4px",
          }}>Pricing</Link>
        </nav>

        {/* Auth buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/login" style={{
            fontSize: 15, fontWeight: 500, color: "#374151",
            textDecoration: "none", padding: "8px 16px",
          }}>Sign in</Link>
          <Link href="/register" style={{
            background: "#2563eb", color: "#fff", fontSize: 14, fontWeight: 600,
            textDecoration: "none", padding: "10px 22px", borderRadius: 10,
            boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
            transition: "all .15s",
          }}>Free Trial</Link>
        </div>
      </header>

      {/* ── HERO SECTION ───────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #f8faff 0%, #eff6ff 50%, #f0fdf4 100%)",
        padding: "80px 40px 100px",
        display: "grid", gridTemplateColumns: "1fr 420px", gap: 80,
        maxWidth: 1280, margin: "0 auto", alignItems: "center",
      }}>
        {/* Left */}
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#fff", border: "1px solid #e5e7eb", borderRadius: 999,
            padding: "6px 14px", marginBottom: 28,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#0d9968", display: "inline-block" }} />
            <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>12 scanners active · Scanned 9:20 AM IST</span>
          </div>

          <h1 style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 16px", color: "#0f172a" }}>
            See the market.<br />
            <span style={{ color: "#2563eb" }}>Clearly.</span>
          </h1>

          <p style={{ fontSize: 18, color: "#4b5563", lineHeight: 1.7, maxWidth: 520, margin: "0 0 40px" }}>
            12 independent scanners cross-validate 2001 NSE stocks twice daily.
            Only high-conviction setups with calculated stop loss and target reach your dashboard.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/register" style={{
              background: "#2563eb", color: "#fff", fontSize: 16, fontWeight: 600,
              textDecoration: "none", padding: "14px 32px", borderRadius: 12,
              boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              Start 30-Day Free Trial
            </Link>
            <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} style={{
              background: "#fff", color: "#374151", fontSize: 15, fontWeight: 500,
              border: "1.5px solid #e5e7eb", padding: "14px 28px", borderRadius: 12,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            }}>
              See how it works ↓
            </button>
          </div>

          <div style={{ display: "flex", gap: 24, marginTop: 36 }}>
            {[["No credit card", "✓"], ["Free 30 days", "✓"], ["Cancel anytime", "✓"]].map(([t, icon]) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280" }}>
                <span style={{ color: "#0d9968", fontWeight: 700 }}>{icon}</span> {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Market Overview Widget */}
        <div style={{
          background: "#fff", borderRadius: 20, border: "1px solid #e5e7eb",
          boxShadow: "0 20px 60px rgba(0,0,0,0.10)", overflow: "hidden",
        }}>
          {/* Widget header */}
          <div style={{
            padding: "16px 20px", borderBottom: "1px solid #f3f4f6",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0d9968", display: "inline-block" }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Market Overview</span>
            </div>
            <span style={{ fontSize: 12, color: "#6b7280" }}>NSE · Live</span>
          </div>

          {/* Index rows */}
          {[
            { name: "NIFTY 50",    price: "24,572", chg: "+0.77%", up: true  },
            { name: "SENSEX",      price: "80,957", chg: "+0.81%", up: true  },
            { name: "BANK NIFTY",  price: "52,427", chg: "+1.29%", up: true  },
          ].map(idx => (
            <div key={idx.name} style={{
              padding: "14px 20px", borderBottom: "1px solid #f9fafb",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>{idx.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Sparkline up={idx.up} />
                <div style={{ textAlign: "right", minWidth: 80 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{idx.price}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: idx.up ? "#0d9968" : "#dc2626" }}>{idx.chg}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Today's Scanner Picks */}
          <div style={{ padding: "14px 20px 8px", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase" }}>Today's Scanner Picks</span>
          </div>
          {[
            { sym: "RELIANCE",   scanners: 3, chg: "+1.23%", up: true },
            { sym: "HDFCBANK",   scanners: 3, chg: "+0.91%", up: true },
            { sym: "TATAMOTORS", scanners: 2, chg: "+2.18%", up: true },
          ].map(s => (
            <div key={s.sym} style={{
              padding: "12px 20px", borderBottom: "1px solid #f9fafb",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#0d9968", display: "inline-block" }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{s.sym}</span>
                <span style={{ fontSize: 11, color: "#6b7280" }}>{s.scanners} scanners</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0d9968" }}>{s.chg}</span>
            </div>
          ))}
          <div style={{ padding: "12px 20px" }}>
            <Link href="/register" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600,
              textDecoration: "none", padding: "10px", borderRadius: 10,
            }}>
              View all picks <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────── */}
      <section style={{
        background: "#0f172a", padding: "48px 40px",
      }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40,
          textAlign: "center",
        }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 44, fontWeight: 800, color: "#2563eb", lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ──────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: "100px 40px", background: "#fafafa" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#eff6ff", color: "#2563eb", fontSize: 13, fontWeight: 600,
              padding: "6px 16px", borderRadius: 999, marginBottom: 20,
            }}>
              <Sparkles size={13} /> 12 Specialized Scanners
            </div>
            <h2 style={{ fontSize: 44, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: "0 0 16px" }}>
              Every pattern. Every opportunity.
            </h2>
            <p style={{ fontSize: 18, color: "#6b7280", maxWidth: 560, margin: "0 auto" }}>
              From chart patterns to fundamental catalysts — all cross-validated before reaching you.
            </p>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20,
          }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 16, padding: "24px",
                border: "1px solid #e5e7eb",
                transition: "all .2s",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(37,99,235,0.12)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#bfdbfe";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb";
                  (e.currentTarget as HTMLDivElement).style.transform = "none";
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "#eff6ff", display: "grid", placeItems: "center", marginBottom: 16,
                }}>
                  <f.icon size={20} color="#2563eb" />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section style={{ padding: "100px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 44, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: "0 0 16px" }}>
            How it works
          </h2>
          <p style={{ fontSize: 18, color: "#6b7280", margin: "0 0 64px" }}>Three simple steps from scanner to trade.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40 }}>
            {[
              { step: "01", title: "Scans run at 9:20 AM & 3:45 PM", desc: "Every trading day — 2001 NSE stocks scanned across 12 pattern types." },
              { step: "02", title: "Cross-scanner validation", desc: "Only stocks confirmed by 2+ independent scanners appear. No noise." },
              { step: "03", title: "You get high-conviction picks", desc: "With entry zone, stop loss, target and reason — ready to research." },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "left" }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: "#2563eb", opacity: 0.2, lineHeight: 1, marginBottom: 16 }}>{s.step}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────── */}
      <section style={{ padding: "100px 40px", background: "#f8faff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 44, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", textAlign: "center", margin: "0 0 64px" }}>
            Trusted by Indian traders
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 16, padding: 28,
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {Array(t.stars).fill(0).map((_, j) => (
                    <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 20px" }}>"{t.text}"</p>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING CTA ────────────────────────────────────── */}
      <section style={{ padding: "100px 40px", background: "#0f172a" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(37,99,235,0.2)", color: "#93c5fd",
            fontSize: 13, fontWeight: 600, padding: "6px 16px", borderRadius: 999, marginBottom: 28,
          }}>
            🎉 Launch Offer — ₹49/month for first 3 months
          </div>
          <h2 style={{ fontSize: 48, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", margin: "0 0 20px" }}>
            Start seeing clearly today.
          </h2>
          <p style={{ fontSize: 18, color: "#94a3b8", margin: "0 0 44px", lineHeight: 1.7 }}>
            30-day free trial. No credit card required. Full access to all 12 scanners.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <Link href="/register" style={{
              background: "#2563eb", color: "#fff", fontSize: 16, fontWeight: 700,
              textDecoration: "none", padding: "16px 40px", borderRadius: 12,
              boxShadow: "0 4px 20px rgba(37,99,235,0.4)",
            }}>
              Start Free Trial
            </Link>
            <Link href="/billing" style={{
              background: "rgba(255,255,255,0.08)", color: "#e2e8f0", fontSize: 15, fontWeight: 500,
              textDecoration: "none", padding: "16px 28px", borderRadius: 12,
              border: "1.5px solid rgba(255,255,255,0.15)",
            }}>
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer style={{ background: "#0a0f1c", padding: "48px 40px", borderTop: "1px solid #1e293b" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#2563eb", display: "grid", placeItems: "center" }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>N</span>
            </div>
            <span style={{ color: "#94a3b8", fontSize: 14, fontWeight: 500 }}>NSE Scanner Pro</span>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 13, flexWrap: "wrap" }}>
            {[
              ["Terms", "/terms"], ["Privacy", "/privacy"], ["Refund", "/refund"],
              ["Sign in", "/login"], ["Register", "/register"], ["Pricing", "/billing"],
            ].map(([label, href]) => (
              <Link key={label} href={href} style={{ color: "#64748b", textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: "24px auto 0", paddingTop: 24, borderTop: "1px solid #1e293b" }}>
          <p style={{ fontSize: 11, color: "#475569", lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: "#64748b" }}>Disclaimer:</strong> NSE Scanner Pro is a data analytics and research tool only.
            It is NOT a SEBI-registered investment advisor and does NOT provide investment advice.
            All scanner signals are for informational purposes only. Past performance does not guarantee future results.
            Always consult a SEBI-registered advisor before making investment decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}
