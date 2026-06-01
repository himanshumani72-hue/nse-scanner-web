/* Twitter-optimised 1200×1500 (4:5) infographic.
 *
 * Visit: https://nse-scanner-web.vercel.app/twitter-card
 *   → right-click → "Save Image As" → attach to your tweet.
 *
 * Why 1200×1500: 4:5 vertical is the highest-impact ratio on Twitter.
 * Mobile users (80%+ of Twitter) see the whole image without tapping.
 * Wider ratios get auto-cropped to 1200×500 in feed; square 1200×1200
 * also gets cropped on landscape clients.
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";

const C = {
  bg:    "#06090d",
  bg2:   "#0b1018",
  card:  "#131a25",
  line:  "#1c242f",
  ink:   "#f3f5f8",
  ink2:  "#c8d0db",
  ink3:  "#8590a0",
  ink4:  "#535e6e",
  green: "#2bd07a",
  blue:  "#5b8cff",
  blue2: "#93acff",
  warn:  "#f3b54a",
  red:   "#ff5d6c",
  violet:"#a87bff",
};

const SCANNERS = [
  { n: "Big Movers",      c: C.green  },
  { n: "Cup & Handle",    c: C.blue   },
  { n: "W-Pattern 15m",   c: C.violet },
  { n: "Cannon Momentum", c: C.green  },
  { n: "Boomerang",       c: C.red    },
  { n: "Turnaround",      c: C.warn   },
  { n: "Bulk Deals",      c: C.green  },
  { n: "52W Breakouts",   c: C.blue   },
  { n: "Sector Rotation", c: C.violet },
  { n: "Broker Upgrades", c: C.warn   },
  { n: "Buzz Spike",      c: C.green  },
  { n: "Probability AI",  c: C.blue   },
];

export async function GET() {
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%",
        background: `radial-gradient(ellipse at top right, ${C.bg2} 0%, ${C.bg} 70%)`,
        display: "flex", flexDirection: "column",
        padding: "56px 56px 50px",
        fontFamily: "system-ui, sans-serif",
        color: C.ink,
        position: "relative",
      }}>

        {/* Decorative orbs */}
        <div style={{
          position: "absolute", top: -160, right: -160,
          width: 480, height: 480, borderRadius: 9999,
          background: `radial-gradient(circle, ${C.blue}30 0%, transparent 70%)`,
          display: "flex",
        }} />
        <div style={{
          position: "absolute", bottom: 240, left: -200,
          width: 460, height: 460, borderRadius: 9999,
          background: `radial-gradient(circle, ${C.green}25 0%, transparent 70%)`,
          display: "flex",
        }} />

        {/* ───── HEADER ───── */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <div style={{
            width: 58, height: 58, borderRadius: 14,
            background: `linear-gradient(135deg, ${C.green} 0%, ${C.blue} 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 10px 24px -8px ${C.blue}80`,
          }}>
            <svg width="32" height="32" viewBox="0 0 14 14" fill="none">
              <path d="M2 10 L5 6 L7 8 L12 3" stroke="#06090c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="3" r="1.6" fill="#06090c" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.01em" }}>
              NSE Scanner Pro
            </span>
            <span style={{ fontSize: 13, color: C.ink4, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 4 }}>
              For Indian retail traders
            </span>
          </div>
          <div style={{ flex: 1, display: "flex" }} />
          {/* LIVE pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 16px", borderRadius: 9999,
            background: `${C.green}15`,
            border: `1px solid ${C.green}50`,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: 9999, background: C.green, display: "flex" }} />
            <span style={{ fontSize: 14, color: C.green, fontWeight: 600 }}>9:20 AM IST · DAILY</span>
          </div>
        </div>

        {/* ───── HERO ───── */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 36 }}>
          <div style={{
            fontSize: 88, fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.03em",
            display: "flex", flexDirection: "column",
          }}>
            <span>12 scanners.</span>
            <span>
              <span style={{ color: C.blue }}>One </span>
              <span>dashboard.</span>
            </span>
          </div>
          <p style={{
            fontSize: 26, color: C.ink2, lineHeight: 1.4,
            margin: "22px 0 0", maxWidth: 950,
          }}>
            Cross-validated NSE setups with calculated stop loss & target.
            <span style={{ color: C.ink, fontWeight: 600 }}> No noise. No 5-tab juggling.</span>
          </p>
        </div>

        {/* ───── SCANNER GRID (3 columns x 4 rows) ───── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10, marginBottom: 32,
        }}>
          {SCANNERS.map(s => (
            <div key={s.n} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "14px 16px",
              background: `${C.card}`,
              border: `1px solid ${C.line}`,
              borderLeft: `4px solid ${s.c}`,
              borderRadius: 10,
              fontSize: 19,
              fontWeight: 600,
              color: C.ink,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: 9999, background: s.c, display: "flex",
              }} />
              {s.n}
            </div>
          ))}
        </div>

        {/* ───── COMPARISON STRIP ───── */}
        <div style={{
          display: "flex", flexDirection: "column", marginBottom: 30,
          background: C.bg2, border: `1px solid ${C.line}`,
          borderRadius: 14, padding: 22,
        }}>
          <span style={{
            fontSize: 14, color: C.warn, fontWeight: 600,
            letterSpacing: "0.10em", textTransform: "uppercase",
            marginBottom: 14,
          }}>
            vs Competitors (per year)
          </span>
          <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
            {[
              { name: "StockEdge",   price: "₹3,000" },
              { name: "Tickertape",  price: "₹3,500" },
              { name: "MoneyControl", price: "₹2,400" },
              { name: "Trendlyne",   price: "₹1,800" },
            ].map(c => (
              <div key={c.name} style={{
                flex: 1, display: "flex", flexDirection: "column",
                padding: "12px 14px", background: `${C.bg}`,
                border: `1px solid ${C.line}`, borderRadius: 10,
              }}>
                <span style={{ fontSize: 14, color: C.ink3 }}>{c.name}</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: C.ink4, textDecoration: "line-through", marginTop: 4 }}>
                  {c.price}
                </span>
              </div>
            ))}
            <div style={{
              flex: 1.2, display: "flex", flexDirection: "column", justifyContent: "center",
              padding: "12px 16px",
              background: `linear-gradient(135deg, ${C.green}20 0%, ${C.blue}15 100%)`,
              border: `2px solid ${C.green}`, borderRadius: 10,
            }}>
              <span style={{ fontSize: 14, color: C.green, fontWeight: 700 }}>NSE Scanner Pro</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 4 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: C.green, letterSpacing: "-0.02em" }}>₹49</span>
                <span style={{ fontSize: 14, color: C.ink2 }}>/ month</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex" }} />

        {/* ───── BOTTOM CTA STRIP ───── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: 24,
          borderTop: `1px solid ${C.line}`,
        }}>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: C.ink }}>
              30-day free trial
            </span>
            <span style={{ fontSize: 18, color: C.ink3, marginTop: 6 }}>
              No card · ₹49/month for first 3 months · Cancel anytime
            </span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", padding: "16px 30px",
            borderRadius: 14,
            background: C.blue, color: "#fff",
            fontSize: 22, fontWeight: 700,
            boxShadow: `0 12px 28px -10px ${C.blue}`,
          }}>
            nse-scanner-web.vercel.app
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 1500 }
  );
}
