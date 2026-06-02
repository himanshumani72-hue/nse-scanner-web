import Link from "next/link";
import {
  TrendingUp, Zap, BarChart2, Target, Activity, Clock,
  CheckCircle, ChevronRight, Sparkles, Layers,
  TrendingDown, Crosshair, Newspaper, Search, Rocket,
} from "lucide-react";
import { OFFER, REGULAR_PRICE_INR } from "@/lib/pricing";

/* ────────────────────────────────────────────────────────────
   Content data — kept above the JSX for easy editing later
   ──────────────────────────────────────────────────────────── */

const SCANNERS = [
  { icon: Zap,         title: "Big Movers",        desc: "Stocks moving on volume + news catalyst. Pre-filtered from 2000 NSE symbols." },
  { icon: BarChart2,   title: "Cup & Handle",      desc: "EMA-51 recovery patterns on 2H timeframe — classic continuation base." },
  { icon: Activity,    title: "W-Pattern 15M",     desc: "Double-bottom pattern on 15-minute charts for short-term reversals." },
  { icon: Rocket,      title: "Momentum",          desc: "Strong directional moves with volume + EMA alignment + MACD confirmation." },
  { icon: TrendingDown,title: "Turnaround",        desc: "Higher-low double-bottom recovery setups — catching trend changes early." },
  { icon: Layers,      title: "Bulk Deals",        desc: "NSE-published institutional accumulation. 3+ days of inst. buying = high conviction." },
  { icon: Target,      title: "52-Week Breakouts", desc: "Stocks crossing prior 52W high on 1.3×+ volume — fresh territory rallies." },
  { icon: Newspaper,   title: "Sector Rotation",   desc: "Live sector momentum vs Nifty over 5/10/20 days — which sectors lead today." },
  { icon: Crosshair,   title: "Broker Upgrades",   desc: "Aggregated upgrade/downgrade signals from Tier-1 brokers (Morgan, GS, JPM, etc.)." },
  { icon: Search,      title: "Buzz Spike",        desc: "Google Trends search interest spikes — catches retail buzz BEFORE mainstream news." },
  { icon: TrendingDown,title: "Stocks About to Fall", desc: "Bearish setups: RSI exhaustion, death cross, distribution. Helps you exit on time." },
  { icon: Sparkles,    title: "Probability Ranking", desc: "Composite score across 9 dimensions. Cross-scanner stacking = highest conviction picks." },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Scans run at 9:20 AM + 3:00 PM IST",
    desc: "Every trading day. 500+ NSE stocks across 12 scanner types. Pre-filtered from a 2000-stock universe by liquidity." },
  { step: "2", title: "Cross-scanner confirmation",
    desc: "When the SAME stock is flagged by 3+ independent scanners — Breakout + Bulk Deals + Buzz Spike — that's a far stronger signal than any single screener." },
  { step: "3", title: "ATR-based stops & targets",
    desc: "Every pick comes with a calculated stop loss and target derived from the stock's own volatility (ATR). No more guesswork on position sizing." },
  { step: "4", title: "Live dashboard updates",
    desc: "Real-time Supabase alerts. Open the dashboard on any device — desktop, phone, tablet. Everything syncs instantly." },
];

const FAQS = [
  { q: "Is this investment advice?",
    a: "No. This is a research and data analytics tool. We surface patterns from publicly available NSE data. We don't make buy/sell recommendations or promise returns. Always do your own analysis and use stop losses." },
  { q: "Do I need a broker integration?",
    a: "No. The scanner shows you what to research; you place trades yourself in your existing broker app (Zerodha, Upstox, Dhan, Groww — any broker works)." },
  { q: "What does 'cross-scanner stacking' mean?",
    a: "Most screeners give you 1 signal at a time. We run 12 in parallel and show you which stocks pass through multiple independent checks. A stock flagged by 5 scanners simultaneously is much more likely to move than one flagged by just 1." },
  { q: "Can I cancel anytime?",
    a: "Yes. You pay ₹99 per month via UPI. There's no auto-charge, no card stored. To continue past 30 days, you simply pay again. Stop paying = subscription ends." },
  { q: "How is this different from TradingView screeners?",
    a: "TradingView gives you the tools to build screeners. We've already built 12 production-ready scanners with hand-tuned filters, cross-validation logic, and live news/sentiment overlays. It's the difference between buying lumber and buying a house." },
  { q: "Do you offer intraday signals?",
    a: "Some — like the W-Pattern 15-minute scanner. But the system is primarily optimised for swing trading (1–10 day holds). Day traders may find the morning scan useful for setup ideas." },
];

/* ────────────────────────────────────────────────────────────
   Theme tokens — pulled from globals.css variables
   ──────────────────────────────────────────────────────────── */
const C = {
  bg0:  "var(--bg-0)", bg1: "var(--bg-1)", bg2: "var(--bg-2)",
  line: "var(--line)", line2: "var(--line-2)",
  ink0: "var(--ink-0)", ink1: "var(--ink-1)", ink2: "var(--ink-2)", ink3: "var(--ink-3)", ink4: "var(--ink-4)",
  up:   "var(--up)", down: "var(--down)", warn: "var(--warn)",
  accent: "var(--accent)", accent2: "var(--accent-2)",
};

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg0, color: C.ink0, fontFamily: "inherit" }}>

      {/* ═══════════════════════════════════════════════════════════
          NAVBAR
          ═══════════════════════════════════════════════════════════ */}
      <nav style={{
        borderBottom: `1px solid ${C.line}`,
        padding: "14px 24px", position: "sticky", top: 0, zIndex: 50,
        background: `color-mix(in oklab, ${C.bg0} 90%, transparent)`,
        backdropFilter: "blur(8px)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, #2bd07a 0%, #5b8cff 100%)",
              display: "grid", placeItems: "center",
              boxShadow: "0 4px 14px -4px rgba(91,140,255,.45)",
            }}>
              <TrendingUp size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: C.ink0 }}>NSE Scanner Pro</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link href="/login" style={{ color: C.ink2, fontSize: 14, textDecoration: "none" }}>Sign in</Link>
            <Link href="/register" style={{
              background: C.accent, color: "#fff",
              fontSize: 13.5, fontWeight: 500,
              padding: "8px 16px", borderRadius: 8, textDecoration: "none",
            }}>Start free trial</Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "color-mix(in oklab, var(--accent) 10%, transparent)",
          border: `1px solid color-mix(in oklab, var(--accent) 30%, transparent)`,
          color: C.accent, fontSize: 12.5,
          padding: "6px 14px", borderRadius: 999, marginBottom: 26,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: C.up,
            boxShadow: `0 0 8px ${C.up}`,
          }} />
          12 scanners running daily · 9:20 AM &amp; 3:00 PM IST
        </div>

        <h1 style={{
          fontSize: "clamp(34px, 5.5vw, 56px)",
          lineHeight: 1.08, letterSpacing: "-0.02em",
          fontWeight: 700, color: C.ink0, margin: "0 0 22px",
        }}>
          NSE pattern scanner that<br />
          actually <span style={{ color: C.accent }}>filters the noise</span>
        </h1>

        <p style={{
          color: C.ink2, fontSize: 18, lineHeight: 1.55,
          maxWidth: 640, margin: "0 auto 36px",
        }}>
          12 independent scanners run every trading day on 500+ NSE stocks.
          Cross-validation surfaces only the highest-conviction setups — with calculated stop loss, target, and risk-reward.
          <strong style={{ color: C.ink1 }}> Built for swing traders.</strong>
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
          <Link href="/register" style={{
            background: C.accent, color: "#fff",
            fontSize: 16, fontWeight: 600,
            padding: "14px 28px", borderRadius: 12, textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 6,
            boxShadow: "0 8px 24px -8px rgba(91,140,255,.5)",
          }}>
            Start 30-day free trial <ChevronRight size={18} />
          </Link>
          <Link href="/login" style={{
            color: C.ink2, fontSize: 14, textDecoration: "none",
            padding: "14px 18px", borderRadius: 12,
            border: `1px solid ${C.line}`, background: C.bg1,
          }}>I already have an account</Link>
        </div>

        <p style={{ color: C.ink3, fontSize: 12.5, margin: 0 }}>
          No credit card required · ₹99/month after trial · Cancel anytime
        </p>

        {/* Stats strip */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 24, maxWidth: 720, margin: "60px auto 0",
        }}>
          {[
            ["500+", "NSE stocks scanned"],
            ["12",   "Independent scanners"],
            ["2×",   "Scans per day"],
            [OFFER.enabled ? `₹${OFFER.price_inr}` : `₹${REGULAR_PRICE_INR}`,
             OFFER.enabled ? "Launch offer" : "Per month"],
          ].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.ink0, lineHeight: 1.1 }}>{val}</div>
              <div style={{ fontSize: 12, color: C.ink3, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PROBLEM / SOLUTION
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ borderTop: `1px solid ${C.line}`, background: C.bg1 }}>
        <div style={{
          maxWidth: 1000, margin: "0 auto", padding: "60px 24px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36,
        }}>
          <div>
            <p style={{ color: C.down, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.10em", fontWeight: 600, margin: "0 0 10px" }}>
              The problem
            </p>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: C.ink0, margin: "0 0 14px", lineHeight: 1.3 }}>
              Most screeners flood you with 200 false signals a day
            </h3>
            <p style={{ color: C.ink2, fontSize: 14, lineHeight: 1.65, margin: 0 }}>
              Single-indicator triggers don't know context. They flag every RSI {">"} 70, every volume spike, every MA crossover.
              You scroll through endless lists and start ignoring the alerts entirely — which is exactly when the real ones fire.
            </p>
          </div>
          <div>
            <p style={{ color: C.up, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.10em", fontWeight: 600, margin: "0 0 10px" }}>
              Our approach
            </p>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: C.ink0, margin: "0 0 14px", lineHeight: 1.3 }}>
              12 scanners run independently — we surface only what passes 3+ of them
            </h3>
            <p style={{ color: C.ink2, fontSize: 14, lineHeight: 1.65, margin: 0 }}>
              A breakout that ALSO has institutional buying AND surging Google searches AND broker upgrades?
              That stacking is the signal. Each scanner is a different lens on the same market — agreement matters.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          12 SCANNERS GRID
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 40px" }}>
        <h2 style={{ fontSize: 30, fontWeight: 700, textAlign: "center", margin: "0 0 8px", color: C.ink0 }}>
          12 scanners. One dashboard.
        </h2>
        <p style={{ color: C.ink2, fontSize: 15, textAlign: "center", margin: "0 0 44px" }}>
          Each one looks for a different pattern. Together, they find the strongest setups.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 14,
        }}>
          {SCANNERS.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{
              background: C.bg1, border: `1px solid ${C.line}`,
              borderRadius: 12, padding: 20,
              transition: "border-color .15s ease, transform .15s ease",
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: "color-mix(in oklab, var(--accent) 14%, transparent)",
                border: `1px solid color-mix(in oklab, var(--accent) 28%, transparent)`,
                color: C.accent,
                display: "grid", placeItems: "center", marginBottom: 14,
              }}>
                <Icon size={16} />
              </div>
              <h3 style={{ margin: "0 0 6px", fontSize: 14.5, fontWeight: 600, color: C.ink0 }}>{title}</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: C.ink2, lineHeight: 1.55 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ borderTop: `1px solid ${C.line}`, background: C.bg1, padding: "70px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", margin: "0 0 36px", color: C.ink0 }}>
            How it works
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} style={{
                display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, alignItems: "start",
                padding: 22, background: C.bg0, border: `1px solid ${C.line}`, borderRadius: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: C.accent, color: "#fff",
                  display: "grid", placeItems: "center",
                  fontWeight: 700, fontSize: 14,
                }}>{step}</div>
                <div>
                  <h3 style={{ margin: "2px 0 6px", fontSize: 15, fontWeight: 600, color: C.ink0 }}>{title}</h3>
                  <p style={{ margin: 0, fontSize: 13.5, color: C.ink2, lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PRICING
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ maxWidth: 480, margin: "0 auto", padding: "70px 24px 40px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", margin: "0 0 8px", color: C.ink0 }}>
          Simple pricing
        </h2>
        <p style={{ color: C.ink2, fontSize: 15, textAlign: "center", margin: "0 0 30px" }}>
          One plan. Everything included. Pay only if you find it useful.
        </p>

        <div style={{
          position: "relative",
          background: C.bg1,
          border: `2px solid ${OFFER.enabled ? C.up : C.accent}`,
          borderRadius: 16, padding: 30,
          boxShadow: OFFER.enabled
            ? "0 20px 40px -20px rgba(43,208,122,.30)"
            : "0 20px 40px -20px rgba(91,140,255,.25)",
        }}>
          <div style={{
            position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
            background: OFFER.enabled ? C.up : C.accent, color: "#fff",
            fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 999,
            letterSpacing: "0.05em", textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}>
            {OFFER.enabled ? OFFER.label : "Single plan"}
          </div>

          <div style={{ textAlign: "center", marginBottom: 22 }}>
            {OFFER.enabled ? (
              <>
                {/* Strikethrough original + bright discounted price */}
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 12, marginTop: 8 }}>
                  <div style={{
                    fontSize: 28, fontWeight: 500, color: C.ink3, lineHeight: 1,
                    textDecoration: "line-through", textDecorationThickness: 2,
                  }}>
                    ₹{REGULAR_PRICE_INR}
                  </div>
                  <div style={{ fontSize: 58, fontWeight: 800, color: C.up, lineHeight: 1, letterSpacing: "-0.02em" }}>
                    ₹{OFFER.price_inr}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 400, color: C.ink3 }}>/ month</div>
                </div>
                {/* Promo tagline */}
                <div style={{
                  marginTop: 10, fontSize: 13, color: C.ink2, fontWeight: 500,
                }}>
                  {OFFER.tagline}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 50, fontWeight: 700, color: C.ink0, lineHeight: 1.1, marginTop: 4 }}>
                ₹{REGULAR_PRICE_INR}
                <span style={{ fontSize: 16, fontWeight: 400, color: C.ink3 }}> / month</span>
              </div>
            )}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              marginTop: 14, padding: "5px 12px", borderRadius: 999,
              background: "color-mix(in oklab, var(--up) 12%, transparent)",
              border: `1px solid color-mix(in oklab, var(--up) 30%, transparent)`,
              color: C.up, fontSize: 12.5,
            }}>
              <CheckCircle size={13} /> 30-day free trial — no card needed
            </div>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 26px", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "500+ NSE stocks scanned daily",
              "All 12 scanner types unlocked",
              "Cross-scanner probability ranking",
              "ATR-based stop loss & targets",
              "Real-time dashboard updates",
              "9:20 AM + 3:00 PM IST scan schedule",
              "Light & dark theme",
              "Mobile responsive — use anywhere",
            ].map(f => (
              <li key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: C.ink1 }}>
                <CheckCircle size={14} color={C.up} style={{ flexShrink: 0 }} />
                {f}
              </li>
            ))}
          </ul>

          <Link href="/register" style={{
            display: "block", width: "100%", padding: "13px 0",
            background: C.accent, color: "#fff",
            textAlign: "center", borderRadius: 11,
            fontSize: 14.5, fontWeight: 600, textDecoration: "none",
            boxSizing: "border-box",
          }}>
            Start Free Trial →
          </Link>

          <p style={{ margin: "14px 0 0", fontSize: 11.5, color: C.ink3, textAlign: "center" }}>
            UPI · GPay · PhonePe · Paytm · No card stored
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px" }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, textAlign: "center", margin: "0 0 30px", color: C.ink0 }}>
          Common questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {FAQS.map(({ q, a }) => (
            <details key={q} style={{
              background: C.bg1, border: `1px solid ${C.line}`,
              borderRadius: 11, padding: "16px 20px",
              fontSize: 14,
            }}>
              <summary style={{
                cursor: "pointer", fontWeight: 600, color: C.ink0,
                listStyle: "none",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
              }}>
                {q}
                <span style={{ color: C.ink3, fontSize: 18, lineHeight: 1, flexShrink: 0 }}>+</span>
              </summary>
              <p style={{ margin: "12px 0 0", color: C.ink2, lineHeight: 1.65, fontSize: 13.5 }}>{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════════════════ */}
      <section style={{
        borderTop: `1px solid ${C.line}`,
        padding: "70px 24px", textAlign: "center",
        background: `linear-gradient(180deg, ${C.bg0} 0%, color-mix(in oklab, var(--accent) 6%, var(--bg-0)) 100%)`,
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 14px", color: C.ink0, letterSpacing: "-0.01em" }}>
          Try it free for 30 days
        </h2>
        <p style={{ color: C.ink2, fontSize: 15, margin: "0 0 28px" }}>
          No card required. Cancel anytime. Built by a trader for Indian markets.
        </p>
        <Link href="/register" style={{
          background: C.accent, color: "#fff",
          fontSize: 16, fontWeight: 600,
          padding: "14px 32px", borderRadius: 12, textDecoration: "none",
          display: "inline-block",
          boxShadow: "0 8px 24px -8px rgba(91,140,255,.5)",
        }}>
          Create free account →
        </Link>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER (with required SEBI-style disclaimer)
          ═══════════════════════════════════════════════════════════ */}
      <footer style={{
        borderTop: `1px solid ${C.line}`,
        padding: "32px 24px", background: C.bg1,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 18,
            justifyContent: "space-between", alignItems: "center",
            marginBottom: 22,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 7,
                background: "linear-gradient(135deg, #2bd07a 0%, #5b8cff 100%)",
                display: "grid", placeItems: "center",
              }}>
                <TrendingUp size={13} color="#fff" />
              </div>
              <span style={{ fontWeight: 600, fontSize: 14, color: C.ink1 }}>NSE Scanner Pro</span>
            </div>
            <div style={{ display: "flex", gap: 18, fontSize: 12.5, flexWrap: "wrap" }}>
              <Link href="/login"    style={{ color: C.ink2, textDecoration: "none" }}>Sign in</Link>
              <Link href="/register" style={{ color: C.ink2, textDecoration: "none" }}>Sign up</Link>
              <Link href="/billing"  style={{ color: C.ink2, textDecoration: "none" }}>Pricing</Link>
              <Link href="/terms"    style={{ color: C.ink2, textDecoration: "none" }}>Terms</Link>
              <Link href="/privacy"  style={{ color: C.ink2, textDecoration: "none" }}>Privacy</Link>
              <Link href="/refund"   style={{ color: C.ink2, textDecoration: "none" }}>Refund</Link>
            </div>
          </div>

          <div style={{
            padding: "16px 18px", background: C.bg2,
            border: `1px solid ${C.line}`, borderRadius: 10,
            fontSize: 11.5, color: C.ink3, lineHeight: 1.6,
          }}>
            <strong style={{ color: C.ink2 }}>Disclaimer:</strong> NSE Scanner Pro is a software product that surfaces
            patterns from publicly available NSE market data. It is <strong style={{ color: C.ink2 }}>not registered as an
            investment advisor with SEBI</strong> and does not provide investment, financial, or trading advice.
            All output is for informational and research purposes only. Markets carry inherent risk;
            past patterns do not guarantee future performance. You are solely responsible for any decisions you make
            using this information. Always consult a SEBI-registered advisor for personalised guidance.
          </div>

          <p style={{
            margin: "16px 0 0", textAlign: "center",
            fontSize: 11, color: C.ink4,
          }}>
            © {new Date().getFullYear()} NSE Scanner Pro · Data: NSE India · For research use only
          </p>
        </div>
      </footer>
    </div>
  );
}
