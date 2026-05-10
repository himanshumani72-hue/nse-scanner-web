"use client";
import type { Alert } from "@/lib/types";
import { ExternalLink } from "lucide-react";

interface Props {
  alerts:   Alert[];
  scanType: "movers" | "patterns" | "wpattern";
}

function tv(symbol: string) {
  return `https://www.tradingview.com/chart/?symbol=NSE:${symbol}`;
}

function pct(v: string | number | undefined) {
  if (v === undefined || v === "") return null;
  const n = parseFloat(String(v));
  return isNaN(n) ? null : n;
}

function ColorNum({ v, prefix = "₹", suffix = "" }: { v?: string|number; prefix?: string; suffix?: string }) {
  const n = pct(v);
  if (n === null) return <span className="text-slate-500">—</span>;
  const color = n > 0 ? "text-green-400" : n < 0 ? "text-red-400" : "text-slate-300";
  return <span className={color}>{prefix}{String(v)}{suffix}</span>;
}

// ── Big Movers table ──────────────────────────────────────────
function MoversTable({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) return <Empty msg="No Big Mover alerts for today. Check back at 9:20 AM IST." />;
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e293b] bg-[#0d1b2e]">
              {["Symbol","LTP","Chg%","Confidence","Catalyst","Est.Move","Stop Loss","Target","Qty","Risk ₹","Reward ₹","Vol/Avg","News","Top Catalyst"].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs text-slate-500 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alerts.map((a, i) => {
              const d  = a.data;
              const conf = parseFloat(String(d["Confidence %"] ?? 0));
              const confColor = conf >= 80 ? "text-green-400" : conf >= 65 ? "text-yellow-400" : "text-orange-400";
              const cat = String(d["Catalyst Type"] ?? "");
              return (
                <tr key={a.id} className={`border-b border-[#1e293b] hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? "bg-slate-900/20" : ""}`}>
                  <td className="px-3 py-3 font-bold">
                    <a href={tv(a.symbol)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-white hover:text-blue-400 transition-colors">
                      {a.symbol} <ExternalLink size={11} className="text-slate-600" />
                    </a>
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-200">₹{d["LTP"]}</td>
                  <td className="px-3 py-3">
                    <span className={pct(d["Today Chg %"])! >= 0 ? "badge-bull" : "badge-bear"}>
                      {String(d["Today Chg %"] ?? "—")}%
                    </span>
                  </td>
                  <td className="px-3 py-3 font-bold text-base">
                    <span className={confColor}>{conf}%</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={cat === "High" ? "badge-bull" : cat === "Medium" ? "badge-gold" : "badge-blue"}>{cat}</span>
                  </td>
                  <td className="px-3 py-3 text-orange-400 font-medium">{String(d["Est. Move"] ?? "—")}</td>
                  <td className="px-3 py-3 font-mono text-red-400 font-medium">₹{d["Stop Loss"]}</td>
                  <td className="px-3 py-3 font-mono text-green-400 font-bold">₹{d["Target"]}</td>
                  <td className="px-3 py-3 text-slate-300">{d["Qty"]}</td>
                  <td className="px-3 py-3 text-red-400">₹{d["Risk ₹"]}</td>
                  <td className="px-3 py-3 text-green-400 font-semibold">₹{d["Reward ₹"]}</td>
                  <td className="px-3 py-3 text-slate-300">{d["Vol/Avg"]}x</td>
                  <td className="px-3 py-3">
                    <span className={String(d["News Score"] ?? 0) >= "3" ? "badge-bull" : "badge-blue"}>+{d["News Score"]}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-500 max-w-xs">
                    <span className="truncate block max-w-[180px]" title={String(d["Top Catalyst"] ?? "")}>{String(d["Top Catalyst"] ?? "").slice(0, 60)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Chart Patterns table ──────────────────────────────────────
function PatternsTable({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) return <Empty msg="No chart patterns found today. Scanner looks for EMA-51 recovery setups on 2H timeframe." />;
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e293b] bg-[#0d1b2e]">
              {["Symbol","LTP","EMA 51 (2h)","Above EMA%","RSI","Recovery%","News","Fundamental","Sector","Scan Time"].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs text-slate-500 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alerts.map((a, i) => {
              const d = a.data;
              const fund = String(d["Fundamental"] ?? "");
              const fundColor = fund === "Strong" ? "text-green-400" : fund === "Moderate" ? "text-yellow-400" : "text-red-400";
              return (
                <tr key={a.id} className={`border-b border-[#1e293b] hover:bg-white/[0.02] ${i % 2 === 0 ? "bg-slate-900/20" : ""}`}>
                  <td className="px-3 py-3 font-bold">
                    <a href={tv(a.symbol)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-white hover:text-blue-400">
                      {a.symbol} <ExternalLink size={11} className="text-slate-600" />
                    </a>
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-200">₹{d["Close"]}</td>
                  <td className="px-3 py-3 font-mono text-slate-400">₹{d["EMA_51 (2h)"]}</td>
                  <td className="px-3 py-3"><span className="badge-bull">+{d["% Above EMA"]}%</span></td>
                  <td className="px-3 py-3 text-slate-300">{d["RSI_14"]}</td>
                  <td className="px-3 py-3 text-blue-400">{d["Recovery %"]}%</td>
                  <td className="px-3 py-3"><span className="badge-bull">+{d["News Score"]}</span></td>
                  <td className={`px-3 py-3 font-medium ${fundColor}`}>{fund}</td>
                  <td className="px-3 py-3 text-slate-500 text-xs">{d["Sector"]}</td>
                  <td className="px-3 py-3 text-slate-600 text-xs whitespace-nowrap">{String(d["Scan Time"] ?? "")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── W-Pattern table ───────────────────────────────────────────
function WPatternTable({ alerts }: { alerts: Alert[] }) {
  if (!alerts.length) return <Empty msg="No W-patterns detected today. Scanner runs at 9:20 AM IST on 5-minute bars." />;
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e293b] bg-[#0d1b2e]">
              {["Symbol","LTP","Quality","Score","B1","B2","Neckline","Higher Low","Recovery%","Stop Loss","Target","Qty","Risk ₹","Reward ₹","MACD","Signals"].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs text-slate-500 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alerts.map((a, i) => {
              const d = a.data;
              const q = String(d["Pattern Quality"] ?? "");
              const qColor = q === "A" ? "text-green-400" : q === "B" ? "text-yellow-400" : "text-orange-400";
              const hl = String(d["Higher Low"] ?? "") === "Yes";
              return (
                <tr key={a.id} className={`border-b border-[#1e293b] hover:bg-white/[0.02] ${i % 2 === 0 ? "bg-slate-900/20" : ""}`}>
                  <td className="px-3 py-3 font-bold">
                    <a href={tv(a.symbol)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-white hover:text-blue-400">
                      {a.symbol} <ExternalLink size={11} className="text-slate-600" />
                    </a>
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-200">₹{d["LTP"]}</td>
                  <td className={`px-3 py-3 font-bold text-lg ${qColor}`}>{q}</td>
                  <td className="px-3 py-3 text-white font-semibold">{d["W Score"]}</td>
                  <td className="px-3 py-3 font-mono text-slate-400">₹{d["B1 (Left Low)"]}</td>
                  <td className="px-3 py-3 font-mono text-slate-400">₹{d["B2 (Right Low)"]}</td>
                  <td className="px-3 py-3 font-mono text-blue-400">₹{d["Neckline (Peak)"]}</td>
                  <td className="px-3 py-3">{hl ? <span className="badge-bull">Yes ✓</span> : <span className="text-slate-600">No</span>}</td>
                  <td className="px-3 py-3 text-blue-400">{d["Recovery %"]}%</td>
                  <td className="px-3 py-3 font-mono text-red-400 font-medium">₹{d["Stop Loss"]}</td>
                  <td className="px-3 py-3 font-mono text-green-400 font-bold">₹{d["Target"]}</td>
                  <td className="px-3 py-3 text-slate-300">{d["Qty"]}</td>
                  <td className="px-3 py-3 text-red-400">₹{d["Risk ₹"]}</td>
                  <td className="px-3 py-3 text-green-400 font-semibold">₹{d["Reward ₹"]}</td>
                  <td className="px-3 py-3"><span className={d["MACD"] === "Bullish" ? "badge-bull" : "badge-gold"}>{d["MACD"]}</span></td>
                  <td className="px-3 py-3 text-slate-500 text-xs max-w-[200px]">
                    <span className="truncate block" title={String(d["Signals"] ?? "")}>{String(d["Signals"] ?? "").slice(0, 60)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="card p-16 text-center">
      <div className="text-4xl mb-4">📭</div>
      <p className="text-slate-400">{msg}</p>
    </div>
  );
}

export default function AlertsTable({ alerts, scanType }: Props) {
  if (scanType === "movers")   return <MoversTable   alerts={alerts} />;
  if (scanType === "patterns") return <PatternsTable alerts={alerts} />;
  return                              <WPatternTable alerts={alerts} />;
}
