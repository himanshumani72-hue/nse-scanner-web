import { ImageResponse } from "next/og";
import { OFFER, REGULAR_PRICE_INR } from "@/lib/pricing";

export const runtime  = "edge";
export const alt      = "NSE Scanner Pro — 12 NSE pattern scanners in one dashboard";
export const size     = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Auto-generated Open Graph image for the landing page.
 *
 * Used when the URL is shared on Twitter/X, WhatsApp, LinkedIn, Slack, Discord, etc.
 * Next.js renders this on first request, then Vercel CDN-caches it indefinitely.
 *
 * Spec: 1200×630 px (Twitter `summary_large_image` + Facebook OG)
 *
 * To preview locally:
 *   visit  http://localhost:3000/opengraph-image
 * Or on production:
 *   visit  https://nse-scanner-web.vercel.app/opengraph-image
 */
export default async function OG() {
  // Brand palette
  const C = {
    bg:     "#06090d",
    bg2:    "#0b1018",
    line:   "#1c242f",
    ink:    "#f3f5f8",
    ink2:   "#8590a0",
    ink3:   "#535e6e",
    green:  "#2bd07a",
    blue:   "#5b8cff",
    blue2:  "#93acff",
    warn:   "#f3b54a",
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          background: `radial-gradient(ellipse at top left, ${C.bg2} 0%, ${C.bg} 65%)`,
          display: "flex", flexDirection: "column",
          padding: "60px 72px",
          fontFamily: "system-ui, sans-serif",
          color: C.ink,
          position: "relative",
        }}
      >
        {/* Soft gradient orb (top-right accent) */}
        <div
          style={{
            position: "absolute", top: -180, right: -180,
            width: 480, height: 480, borderRadius: 9999,
            background: `radial-gradient(circle, ${C.blue}30 0%, transparent 70%)`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: -200, left: -100,
            width: 420, height: 420, borderRadius: 9999,
            background: `radial-gradient(circle, ${C.green}20 0%, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* ─── HEADER ─── */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 60 }}>
          {/* Logo mark */}
          <div
            style={{
              width: 56, height: 56, borderRadius: 14,
              background: `linear-gradient(135deg, ${C.green} 0%, ${C.blue} 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 10px 30px -8px ${C.blue}80`,
            }}
          >
            {/* Up-trend SVG */}
            <svg width="30" height="30" viewBox="0 0 14 14" fill="none">
              <path d="M2 10 L5 6 L7 8 L12 3" stroke="#06090c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="3" r="1.6" fill="#06090c"/>
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.01em" }}>NSE Scanner Pro</span>
            <span style={{ fontSize: 13, color: C.ink3, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 4 }}>
              Pattern detection · Indian markets
            </span>
          </div>
          <div style={{ flex: 1, display: "flex" }} />
          {/* Live indicator badge */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 999,
              background: `${C.green}15`,
              border: `1px solid ${C.green}50`,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 999, background: C.green, display: "flex" }} />
            <span style={{ fontSize: 14, color: C.green, fontWeight: 600 }}>Live · 9:20 AM IST daily</span>
          </div>
        </div>

        {/* ─── HERO TEXT ─── */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 40 }}>
          <div style={{
            fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.025em",
            display: "flex", flexDirection: "column",
          }}>
            <span>12 NSE pattern scanners.</span>
            <span>
              <span style={{ color: C.blue }}>One </span>
              <span>dashboard.</span>
            </span>
          </div>
          <p style={{
            fontSize: 26, color: C.ink2, lineHeight: 1.4,
            margin: "26px 0 0", maxWidth: 920,
          }}>
            Cross-validated swing-trade setups with calculated stop loss & target.
            <span style={{ color: C.ink }}> Built for Indian markets.</span>
          </p>
        </div>

        <div style={{ flex: 1, display: "flex" }} />

        {/* ─── SCANNER CHIPS ─── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
          {[
            "Big Movers",
            "Cup & Handle",
            "52W Breakouts",
            "Bulk Deals",
            "Buzz Spike",
            "Broker Upgrades",
            "Momentum",
            "Turnaround",
            "Sector Rotation",
            "Probability Ranking",
          ].map((label, i) => (
            <div
              key={label}
              style={{
                padding: "8px 16px", borderRadius: 999,
                background: i % 3 === 0
                  ? `${C.blue}15`
                  : i % 3 === 1 ? `${C.green}10` : `${C.warn}10`,
                border: `1px solid ${
                  i % 3 === 0 ? `${C.blue}40` : i % 3 === 1 ? `${C.green}40` : `${C.warn}30`
                }`,
                color: i % 3 === 0 ? C.blue2 : i % 3 === 1 ? C.green : C.warn,
                fontSize: 16, fontWeight: 500,
                display: "flex",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* ─── FOOTER STRIP ─── */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingTop: 24,
            borderTop: `1px solid ${C.line}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 24, fontSize: 18, color: C.ink2 }}>
            {OFFER.enabled ? (
              <>
                {/* Strikethrough ₹99 + bright ₹49 */}
                <span style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span style={{
                    color: C.ink3, fontWeight: 500, fontSize: 22,
                    textDecoration: "line-through",
                  }}>₹{REGULAR_PRICE_INR}</span>
                  <span style={{ color: C.green, fontWeight: 800, fontSize: 30 }}>
                    ₹{OFFER.price_inr}
                  </span>
                  <span>/ month</span>
                </span>
                <span style={{ color: C.ink3 }}>·</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    color: C.green, fontWeight: 600, fontSize: 16,
                    padding: "4px 10px", borderRadius: 999,
                    background: `${C.green}15`,
                    border: `1px solid ${C.green}40`,
                  }}>
                    50% OFF · first {OFFER.duration_months} mo
                  </span>
                </span>
              </>
            ) : (
              <>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: C.ink, fontWeight: 700, fontSize: 22 }}>
                    ₹{REGULAR_PRICE_INR}
                  </span>
                  <span>/ month</span>
                </span>
                <span style={{ color: C.ink3 }}>·</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: C.green, fontWeight: 600 }}>30-day</span>
                  <span>free trial · no card</span>
                </span>
              </>
            )}
          </div>

          <div
            style={{
              display: "flex", alignItems: "center",
              padding: "14px 28px", borderRadius: 12,
              background: C.blue, color: "#fff",
              fontSize: 20, fontWeight: 600,
              boxShadow: `0 10px 25px -10px ${C.blue}`,
            }}
          >
            nse-scanner-web.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
