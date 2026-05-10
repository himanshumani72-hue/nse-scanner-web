"use client";

export function makeSparkline(n: number, seed: number, trend = 0, vol = 1): number[] {
  let s = seed;
  const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const arr: number[] = []; let v = 50;
  for (let i = 0; i < n; i++) { v += (rng() - 0.5) * 6 * vol + trend; arr.push(v); }
  return arr;
}

export function seedFromSymbol(sym: string): number {
  return sym.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

interface Props {
  data: number[];
  w?: number; h?: number;
  color?: string;
  fill?: boolean;
  stroke?: number;
}

export default function Sparkline({ data, w = 120, h = 32, color = "#8590a0", fill = true, stroke = 1.5 }: Props) {
  if (!data || !data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const stepX = w / (data.length - 1);
  const pts = data.map((v, i): [number, number] => [i * stepX, h - ((v - min) / range) * (h - 4) - 2]);
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const dFill = `${d} L${w},${h} L0,${h} Z`;
  const gid = `sg-${data[0]?.toFixed(0)}-${data.length}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={dFill} fill={`url(#${gid})`} />}
      <path d={d} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
