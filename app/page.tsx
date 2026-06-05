"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ArrowRight, Star, TrendingUp, TrendingDown } from "lucide-react";

/* ─────────────────── DESIGN TOKENS ────────────────────── */
const C = {
  bg:        "#EEF2FF",   // light lavender page bg (matches your screenshot)
  bgWhite:   "#FFFFFF",
  bgCard:    "#FFFFFF",
  navy:      "#0A0F1E",   // deep dark text
  blue:      "#3D7EFF",   // primary blue (Groww-style)
  blueDark:  "#2563EB",
  text2:     "#4B5563",
  text3:     "#6B7280",
  green:     "#16A34A",
  greenBg:   "#F0FDF4",
  red:       "#DC2626",
  redBg:     "#FEF2F2",
  border:    "#E5E7EB",
  borderL:   "#F3F4F6",
};

const FONT = "'DM Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

/* ─────────────────── TICKER ────────────────────────────── */
const TICKERS = [
  { sym:"HDFCBANK",  price:"1,678", chg:"+0.91%", up:true  },
  { sym:"ICICIBANK", price:"1,234", chg:"+1.45%", up:true  },
  { sym:"WIPRO",     price:"456.75",chg:"-0.67%", up:false },
  { sym:"TATAMOTORS",price:"1,023", chg:"+2.18%", up:true  },
  { sym:"BAJFINANCE",price:"7,234", chg:"+0.88%", up:true  },
  { sym:"SUNPHARMA", price:"1,678", chg:"-0.42%", up:false },
  { sym:"LT",        price:"3,789", chg:"+1.12%", up:true  },
  { sym:"RELIANCE",  price:"2,847", chg:"+1.23%", up:true  },
  { sym:"TCS",       price:"3,456", chg:"+0.45%", up:true  },
  { sym:"INFY",      price:"1,567", chg:"-0.28%", up:false },
  { sym:"SBIN",      price:"785",   chg:"+0.76%", up:true  },
  { sym:"AXISBANK",  price:"1,089", chg:"+0.32%", up:true  },
];

/* ─────────────────── NAV DROPDOWN ─────────────────────── */
const CHART_ITEMS = [
  { label:"Cup & Handle",         desc:"EMA-51 recovery base pattern",        emoji:"📈" },
  { label:"W Pattern",            desc:"Double bottom reversal",               emoji:"Ｗ" },
  { label:"Turnaround Plays",     desc:"Higher-low recovery setups",           emoji:"↺" },
  { label:"Flat Base Breakout ↑", desc:"Consolidation breakout — bullish",    emoji:"📦" },
  { label:"Flat Base Breakdown ↓",desc:"Consolidation breakdown — bearish",   emoji:"📉" },
  { label:"Double Top Pattern",   desc:"Two peaks — high-prob reversal",       emoji:"⛰" },
];
const ANALYSIS_ITEMS = [
  { label:"Big Movers",           desc:"Volume surge + catalyst stocks",       emoji:"⚡" },
  { label:"Momentum Strategy",    desc:"RSI cross-70 + delivery",              emoji:"🚀" },
  { label:"Stocks About to Fall", desc:"Death cross + RSI exhaustion",         emoji:"🔻" },
  { label:"Next Day Potential",   desc:"EOD setups for tomorrow's open",       emoji:"🎯" },
  { label:"Multibagger Picks",    desc:"Long-term high-conviction",            emoji:"💎" },
  { label:"52W Breakouts",        desc:"Fresh 52-week highs with volume",      emoji:"🏔" },
];

function Dropdown({ label, items }: { label:string; items:typeof CHART_ITEMS }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e:MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        display:"flex", alignItems:"center", gap:5, background:"none", border:"none",
        fontFamily:FONT, fontSize:18, fontWeight:600, color:C.navy, cursor:"pointer", padding:"10px 6px",
      }}>
        {label}
        <ChevronDown size={14} style={{ color:C.text3, transform:open?"rotate(180deg)":"none", transition:"transform .2s" }}/>
      </button>
      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 8px)", left:"50%", transform:"translateX(-50%)",
          background:C.bgWhite, border:`1px solid ${C.border}`, borderRadius:14,
          boxShadow:"0 12px 40px rgba(0,0,0,0.12)", width:290, zIndex:200, overflow:"hidden",
        }}>
          {items.map((item,i) => (
            <Link key={i} href="/register" style={{ textDecoration:"none" }}>
              <div style={{
                display:"flex", alignItems:"flex-start", gap:12, padding:"13px 18px",
                borderBottom: i<items.length-1 ? `1px solid ${C.borderL}` : "none",
              }}
                onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background="#F9FAFB"}
                onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background="transparent"}>
                <span style={{ fontSize:20, lineHeight:"1.2", marginTop:2 }}>{item.emoji}</span>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.navy }}>{item.label}</div>
                  <div style={{ fontSize:12, color:C.text3, marginTop:2 }}>{item.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────── SPARKLINE ─────────────────────────── */
function Spark({ up, w=64, h=32 }: { up:boolean; w?:number; h?:number }) {
  const color = up ? C.green : C.red;
  const d = up
    ? `M0,${h} L${w*.15},${h*.7} L${w*.3},${h*.55} L${w*.45},${h*.65} L${w*.6},${h*.35} L${w*.75},${h*.2} L${w},${h*.05}`
    : `M0,${h*.05} L${w*.15},${h*.2} L${w*.3},${h*.35} L${w*.45},${h*.25} L${w*.6},${h*.55} L${w*.75},${h*.7} L${w},${h}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <path d={d} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─────────────────── INDEX CARDS ───────────────────────── */
const INDICES = [
  { name:"NIFTY 50",   price:"24,597.97", chg:"+0.87%", pts:"+213.07", up:true  },
  { name:"SENSEX",     price:"80,937.31", chg:"+0.79%", pts:"+633.46", up:true  },
  { name:"BANK NIFTY", price:"52,388.59", chg:"+1.21%", pts:"+628.69", up:true  },
  { name:"NIFTY IT",   price:"38,525.30", chg:"-0.15%", pts:"-56.1",   up:false },
  { name:"NIFTY MIDCAP",price:"56,021.82",chg:"+0.18%", pts:"+103.42", up:true  },
];

/* ─────────────────── STOCK PICK CARDS ──────────────────── */
const PICKS = [
  { sym:"RELIANCE",   action:"BUY",  price:"₹2,847.5",  chg:"+1.23%", sector:"Energy",  tags:["Cup & Handle","Bulk Deals"],     up:true  },
  { sym:"HDFCBANK",   action:"BUY",  price:"₹1,678.9",  chg:"+0.91%", sector:"Banking", tags:["52W Breakout","Broker Upgrades"], up:true  },
  { sym:"TATAMOTORS", action:"BUY",  price:"₹1,023.8",  chg:"+2.18%", sector:"Auto",    tags:["W-Pattern 15M","Buzz Spike"],     up:true  },
  { sym:"WIPRO",      action:"SELL", price:"₹456.75",   chg:"-0.67%", sector:"IT",      tags:["Stocks to Short","RSI Exhaust"],  up:false },
];

/* ─────────────────── FEATURES ──────────────────────────── */
const FEATURES = [
  { emoji:"📈", title:"Cup & Handle",    desc:"EMA-51 recovery bases on 2H timeframe. Classic institutional accumulation pattern." },
  { emoji:"⚡", title:"Big Movers",      desc:"2001 NSE stocks filtered by volume surge, price move and news catalyst." },
  { emoji:"🏔", title:"52W Breakouts",   desc:"Stocks crossing prior 52W high on 1.3×+ volume — fresh territory momentum." },
  { emoji:"🏦", title:"Bulk Deals",      desc:"NSE-published institutional buying. 3+ days accumulation = high conviction." },
  { emoji:"🔻", title:"Stocks to Fall",  desc:"RSI ≤45 + Death Cross OR RSI >81 + price falling + volume declining." },
  { emoji:"🎯", title:"Next Day Picks",  desc:"EOD analysis for tomorrow morning. EMA-51 proximity + news catalyst + volume." },
  { emoji:"⛰",  title:"Double Top",     desc:"Two peaks at similar price level — high-probability reversal signal." },
  { emoji:"🏆", title:"Probability Rank",desc:"9-dimension composite score. Only 2+ scanner confirmation shown — no noise." },
];

/* ─────────────────── TESTIMONIALS ──────────────────────── */
const TESTIMONIALS = [
  { name:"Vikram S.", role:"Swing Trader, Mumbai",      stars:5, text:"The cross-scanner confirmation is the best feature. When 3 scanners agree on a stock, it's almost always a winner." },
  { name:"Priya R.",  role:"Positional Trader, Delhi",  stars:5, text:"Caught HLEGLAS at ₹340 after the Big Movers signal. It went to ₹420 in 2 weeks. This platform pays for itself." },
  { name:"Arjun M.",  role:"Investor, Bangalore",       stars:5, text:"The Sector Rotation tab alone is worth the subscription. I know which sectors are leading before most traders do." },
];

/* ─────────────────── MAIN ───────────────────────────────── */
export default function Landing() {
  return (
    <div style={{ fontFamily:FONT, background:C.bg, color:C.navy, minHeight:"100vh", overflowX:"hidden" }}>

      {/* TICKER */}
      <div style={{ background:"#0F172A", height:34, display:"flex", alignItems:"center", overflow:"hidden" }}>
        <div style={{
          display:"flex", gap:40, whiteSpace:"nowrap",
          animation:"ticker 35s linear infinite", fontSize:12.5, fontWeight:500,
        }}>
          {[...TICKERS,...TICKERS,...TICKERS].map((t,i) => (
            <span key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ color:"#94A3B8" }}>{t.sym}</span>
              <span style={{ color:"#F1F5F9", fontWeight:600 }}>{t.price}</span>
              <span style={{ color: t.up ? "#4ADE80" : "#F87171", fontWeight:600 }}>{t.chg}</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}`}</style>
      </div>

      {/* NAVBAR */}
      <header style={{
        background:"rgba(255,255,255,0.92)", backdropFilter:"blur(16px)",
        borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:50,
        height:68, display:"flex", alignItems:"center", padding:"0 48px",
        justifyContent:"space-between",
      }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{
            width:38, height:38, borderRadius:10, background:C.blue,
            display:"grid", placeItems:"center",
            boxShadow:`0 4px 12px ${C.blue}40`,
          }}>
            <span style={{ color:"#fff", fontWeight:800, fontSize:18, fontFamily:FONT }}>N</span>
          </div>
          <span style={{ fontSize:20, fontWeight:700, color:C.navy, letterSpacing:"-0.02em" }}>NSE Scanner</span>
          <span style={{
            fontSize:11, fontWeight:700, color:C.blue,
            background:`${C.blue}15`, padding:"2px 8px", borderRadius:6,
            border:`1px solid ${C.blue}30`, letterSpacing:"0.06em",
          }}>PRO</span>
        </Link>

        <nav style={{ display:"flex", alignItems:"center", gap:12 }}>
          <Dropdown label="Chart Patterns" items={CHART_ITEMS} />
          <Dropdown label="Stock Analysis"  items={ANALYSIS_ITEMS} />
          <Link href="/dashboard" style={{ fontSize:18, fontWeight:600, color:C.navy, textDecoration:"none", padding:"10px 8px" }}>Sector Rotation</Link>
          <Link href="/billing"   style={{ fontSize:18, fontWeight:600, color:C.navy, textDecoration:"none", padding:"10px 8px" }}>Pricing</Link>
        </nav>

        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <Link href="/login" style={{ fontSize:18, fontWeight:600, color:C.navy, textDecoration:"none" }}>Sign in</Link>
          <Link href="/register" style={{
            background:C.blue, color:"#fff", fontSize:15, fontWeight:600,
            textDecoration:"none", padding:"11px 26px", borderRadius:10,
            boxShadow:`0 4px 14px ${C.blue}40`,
          }}>Free Trial</Link>
        </div>
      </header>

      {/* HERO */}
      <section style={{
        padding:"80px 48px 72px",
        maxWidth:1320, margin:"0 auto",
        display:"grid", gridTemplateColumns:"1fr 420px", gap:80, alignItems:"center",
      }}>
        <div>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"#fff", border:`1px solid ${C.border}`, borderRadius:999,
            padding:"7px 16px", marginBottom:32,
            boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
          }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:C.green, display:"inline-block" }}/>
            <span style={{ fontSize:14, color:C.text2, fontWeight:500 }}>12 scanners active · Scanned 9:20 AM IST</span>
          </div>

          <h1 style={{
            fontSize:76, fontWeight:800, lineHeight:1.0,
            letterSpacing:"-0.035em", margin:"0 0 8px", color:C.navy,
          }}>
            See the market.
          </h1>
          <h1 style={{
            fontSize:76, fontWeight:800, lineHeight:1.0,
            letterSpacing:"-0.035em", margin:"0 0 32px", color:C.blue,
          }}>
            Clearly.
          </h1>

          <p style={{ fontSize:19, color:C.text2, lineHeight:1.75, maxWidth:540, margin:"0 0 44px" }}>
            12 independent scanners cross-validate 2001 NSE stocks twice daily.
            Only high-conviction setups with calculated stop loss and target reach your dashboard.
          </p>

          <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
            <Link href="/register" style={{
              background:C.blue, color:"#fff", fontSize:17, fontWeight:700,
              textDecoration:"none", padding:"16px 36px", borderRadius:12,
              boxShadow:`0 6px 20px ${C.blue}45`,
            }}>
              Start 30-Day Free Trial
            </Link>
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior:"smooth" })}
              style={{
                background:"#fff", color:C.navy, fontSize:16, fontWeight:500,
                border:`1.5px solid ${C.border}`, padding:"16px 28px", borderRadius:12,
                cursor:"pointer", fontFamily:FONT,
                display:"flex", alignItems:"center", gap:8,
              }}>
              See how it works ↓
            </button>
          </div>

          <div style={{ display:"flex", gap:24, marginTop:28 }}>
            {["✓ No credit card","✓ Free 30 days","✓ Cancel anytime"].map(t => (
              <span key={t} style={{ fontSize:14, color:C.text3, fontWeight:500 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Market Overview Widget */}
        <div style={{
          background:C.bgWhite, borderRadius:20, border:`1px solid ${C.border}`,
          boxShadow:"0 24px 64px rgba(0,0,0,0.10)", overflow:"hidden",
        }}>
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.borderL}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:C.green, display:"inline-block" }}/>
              <span style={{ fontSize:15, fontWeight:700, color:C.navy }}>Market Overview</span>
            </div>
            <span style={{ fontSize:12, color:C.text3 }}>NSE · Live</span>
          </div>
          {[
            { name:"NIFTY 50",   price:"24,561", chg:"+0.72%", up:true  },
            { name:"SENSEX",     price:"80,938", chg:"+0.79%", up:true  },
            { name:"BANK NIFTY", price:"52,427", chg:"+1.30%", up:true  },
          ].map(idx => (
            <div key={idx.name} style={{ padding:"15px 20px", borderBottom:`1px solid ${C.borderL}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:17, fontWeight:600, color:C.navy }}>{idx.name}</span>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <Spark up={idx.up} />
                <div style={{ textAlign:"right", minWidth:90 }}>
                  <div style={{ fontSize:16, fontWeight:700, color:C.navy }}>{idx.price}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:idx.up ? C.green : C.red }}>{idx.chg}</div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ padding:"14px 20px 8px", borderBottom:`1px solid ${C.borderL}` }}>
            <span style={{ fontSize:11, fontWeight:700, color:C.text3, letterSpacing:"0.10em", textTransform:"uppercase" }}>Today's Scanner Picks</span>
          </div>
          {[
            { sym:"RELIANCE",   n:3, chg:"+1.23%" },
            { sym:"HDFCBANK",   n:3, chg:"+0.91%" },
            { sym:"TATAMOTORS", n:3, chg:"+2.18%" },
          ].map(s => (
            <div key={s.sym} style={{ padding:"12px 20px", borderBottom:`1px solid ${C.borderL}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:C.green, display:"inline-block" }}/>
                <span style={{ fontSize:15, fontWeight:700, color:C.navy }}>{s.sym}</span>
                <span style={{ fontSize:12, color:C.text3 }}>{s.n} scanners</span>
              </div>
              <span style={{ fontSize:14, fontWeight:700, color:C.green }}>{s.chg}</span>
            </div>
          ))}
          <div style={{ padding:"14px 20px" }}>
            <Link href="/register" style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:6,
              background:C.blue, color:"#fff", fontSize:14, fontWeight:600,
              textDecoration:"none", padding:"11px", borderRadius:10,
            }}>
              View all picks <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* INDEX CARDS */}
      <section style={{ background:"#fff", padding:"40px 48px 48px", borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1320, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:16 }}>
          {INDICES.map(idx => (
            <div key={idx.name} style={{
              background:C.bg, borderRadius:16, padding:"20px 20px",
              border:`1px solid ${C.border}`,
            }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:13, fontWeight:600, color:C.text2 }}>{idx.name}</span>
                <span style={{
                  fontSize:12, fontWeight:700, padding:"2px 8px", borderRadius:999,
                  background: idx.up ? C.greenBg : C.redBg,
                  color: idx.up ? C.green : C.red,
                }}>
                  {idx.up ? "▲" : "▼"} {idx.chg}
                </span>
              </div>
              <div style={{ fontSize:24, fontWeight:800, color:C.navy, letterSpacing:"-0.02em", marginBottom:4 }}>{idx.price}</div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontSize:13, color: idx.up ? C.green : C.red, fontWeight:500 }}>{idx.pts}</span>
                <Spark up={idx.up} w={80} h={36} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TODAY'S PICKS */}
      <section style={{ background:C.bg, padding:"72px 48px" }}>
        <div style={{ maxWidth:1320, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:36 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.blue, letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:10 }}>TODAY'S PICKS</div>
              <h2 style={{ fontSize:44, fontWeight:800, color:C.navy, letterSpacing:"-0.025em", margin:0, lineHeight:1.1 }}>High-conviction scanner picks</h2>
              <p style={{ fontSize:16, color:C.text3, margin:"12px 0 0", fontWeight:400 }}>
                Updated 9:20 AM IST · ATR-calibrated stops · Passed 2+ independent scanners
              </p>
            </div>
            <Link href="/register" style={{ fontSize:15, fontWeight:600, color:C.blue, textDecoration:"none", display:"flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }}>
              View all signals <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {PICKS.map((p,i) => (
              <div key={i} style={{
                background:C.bgWhite, borderRadius:16, padding:"22px",
                border:`1px solid ${C.border}`,
                boxShadow:"0 2px 12px rgba(0,0,0,0.05)",
                transition:"all .2s",
              }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLDivElement).style.boxShadow=`0 8px 28px rgba(61,126,255,0.12)`; (e.currentTarget as HTMLDivElement).style.transform="translateY(-2px)"; }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLDivElement).style.boxShadow="0 2px 12px rgba(0,0,0,0.05)"; (e.currentTarget as HTMLDivElement).style.transform="none"; }}
              >
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <span style={{ fontSize:16, fontWeight:800, color:C.navy, letterSpacing:"-0.01em" }}>{p.sym}</span>
                  <span style={{
                    fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:999,
                    background: p.action==="BUY" ? C.greenBg : C.redBg,
                    color: p.action==="BUY" ? C.green : C.red,
                    border:`1px solid ${p.action==="BUY" ? C.green+"30" : C.red+"30"}`,
                  }}>{p.action}</span>
                </div>
                <div style={{ fontSize:22, fontWeight:800, color:C.navy, letterSpacing:"-0.02em" }}>{p.price}</div>
                <div style={{ fontSize:14, fontWeight:600, color: p.up ? C.green : C.red, marginTop:2 }}>{p.chg}</div>
                <div style={{ fontSize:13, color:C.text3, marginTop:10, marginBottom:12 }}>{p.sector}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {p.tags.map(t => (
                    <span key={t} style={{
                      fontSize:11, fontWeight:500, color:C.text2,
                      background:C.bg, border:`1px solid ${C.border}`,
                      padding:"3px 9px", borderRadius:999,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background:"#fff", padding:"88px 48px" }}>
        <div style={{ maxWidth:1320, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:60 }}>
            <h2 style={{ fontSize:48, fontWeight:800, color:C.navy, letterSpacing:"-0.025em", margin:"0 0 16px" }}>Every pattern. Every opportunity.</h2>
            <p style={{ fontSize:18, color:C.text2, margin:0 }}>12 specialized scanners. Cross-validated. Ready every morning.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {FEATURES.map((f,i) => (
              <div key={i} style={{
                background:C.bg, borderRadius:16, padding:"24px",
                border:`1px solid ${C.border}`, transition:"all .2s",
              }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLDivElement).style.background="#fff"; (e.currentTarget as HTMLDivElement).style.boxShadow=`0 8px 28px ${C.blue}18`; (e.currentTarget as HTMLDivElement).style.borderColor=`${C.blue}40`; }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLDivElement).style.background=C.bg; (e.currentTarget as HTMLDivElement).style.boxShadow="none"; (e.currentTarget as HTMLDivElement).style.borderColor=C.border; }}
              >
                <div style={{ fontSize:32, marginBottom:14 }}>{f.emoji}</div>
                <div style={{ fontSize:16, fontWeight:700, color:C.navy, marginBottom:8 }}>{f.title}</div>
                <div style={{ fontSize:14, color:C.text2, lineHeight:1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background:C.bg, padding:"88px 48px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontSize:48, fontWeight:800, color:C.navy, letterSpacing:"-0.025em", margin:"0 0 16px" }}>How it works</h2>
          <p style={{ fontSize:18, color:C.text2, margin:"0 0 64px" }}>Three steps from scanner to trade.</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:48 }}>
            {[
              { n:"01", title:"Scans run at 9:20 AM & 3:45 PM", desc:"Every trading day. 2001 NSE stocks across 12 pattern types. Pre-filtered from a universe by liquidity and price." },
              { n:"02", title:"Cross-scanner validation",         desc:"Only stocks confirmed by 2+ independent scanners appear in your dashboard. No single-indicator noise." },
              { n:"03", title:"High-conviction picks delivered",  desc:"With entry zone, stop loss, target, sector context, and exact reason — ready for you to research and decide." },
            ].map(s => (
              <div key={s.n} style={{ textAlign:"left" }}>
                <div style={{ fontSize:52, fontWeight:900, color:C.blue, opacity:0.18, lineHeight:1, marginBottom:16 }}>{s.n}</div>
                <div style={{ fontSize:18, fontWeight:700, color:C.navy, marginBottom:10 }}>{s.title}</div>
                <div style={{ fontSize:15, color:C.text2, lineHeight:1.75 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background:"#fff", padding:"88px 48px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <h2 style={{ fontSize:48, fontWeight:800, color:C.navy, letterSpacing:"-0.025em", textAlign:"center", margin:"0 0 60px" }}>Trusted by Indian traders</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {TESTIMONIALS.map((t,i) => (
              <div key={i} style={{ background:C.bg, borderRadius:18, padding:30, border:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", gap:3, marginBottom:18 }}>
                  {Array(t.stars).fill(0).map((_,j) => <Star key={j} size={16} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <p style={{ fontSize:15, color:"#374151", lineHeight:1.75, margin:"0 0 22px" }}>"{t.text}"</p>
                <div style={{ fontSize:15, fontWeight:700, color:C.navy }}>{t.name}</div>
                <div style={{ fontSize:13, color:C.text3, marginTop:2 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:"#0F172A", padding:"96px 48px" }}>
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8, marginBottom:28,
            background:"rgba(61,126,255,0.18)", color:"#93C5FD", fontSize:13, fontWeight:600,
            padding:"7px 18px", borderRadius:999,
          }}>
            🎉 Launch Offer — ₹49/month for first 3 months
          </div>
          <h2 style={{ fontSize:52, fontWeight:800, color:"#F1F5F9", letterSpacing:"-0.025em", margin:"0 0 20px", lineHeight:1.1 }}>
            Start seeing clearly today.
          </h2>
          <p style={{ fontSize:18, color:"#94A3B8", margin:"0 0 44px", lineHeight:1.7 }}>
            30-day free trial. No credit card required.<br/>Full access to all 12 scanners from day one.
          </p>
          <div style={{ display:"flex", gap:16, justifyContent:"center" }}>
            <Link href="/register" style={{
              background:C.blue, color:"#fff", fontSize:17, fontWeight:700,
              textDecoration:"none", padding:"17px 44px", borderRadius:12,
              boxShadow:`0 6px 24px ${C.blue}50`,
            }}>Start Free Trial</Link>
            <Link href="/billing" style={{
              background:"rgba(255,255,255,0.08)", color:"#E2E8F0", fontSize:16, fontWeight:500,
              textDecoration:"none", padding:"17px 30px", borderRadius:12,
              border:"1.5px solid rgba(255,255,255,0.15)",
            }}>View Pricing</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:"#0A0F1C", padding:"44px 48px", borderTop:"1px solid #1E293B" }}>
        <div style={{ maxWidth:1320, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:C.blue, display:"grid", placeItems:"center" }}>
              <span style={{ color:"#fff", fontWeight:800, fontSize:15, fontFamily:FONT }}>N</span>
            </div>
            <span style={{ color:"#94A3B8", fontSize:15, fontWeight:500 }}>NSE Scanner Pro</span>
          </div>
          <div style={{ display:"flex", gap:24, fontSize:14, flexWrap:"wrap" }}>
            {[["Terms","/terms"],["Privacy","/privacy"],["Refund","/refund"],["Sign in","/login"],["Register","/register"],["Pricing","/billing"]].map(([l,h]) => (
              <Link key={l} href={h} style={{ color:"#64748B", textDecoration:"none" }}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{ maxWidth:1320, margin:"20px auto 0", paddingTop:20, borderTop:"1px solid #1E293B" }}>
          <p style={{ fontSize:12, color:"#475569", lineHeight:1.7, margin:0 }}>
            <strong style={{ color:"#64748B" }}>Disclaimer:</strong> NSE Scanner Pro is a data analytics and research tool only. It is NOT a SEBI-registered investment advisor and does NOT provide investment advice. All signals are for informational purposes only. Always consult a SEBI-registered advisor before making investment decisions.
          </p>
        </div>
      </footer>

    </div>
  );
}
