"use client";

// Each candle as stored in candle_cache: [ts, open, high, low, close, volume, oi]
export type RawCandle = [string, number, number, number, number, number, number];

interface Props {
  candles: RawCandle[];
  w?: number;
  h?: number;
}

export default function MiniCandlestick({ candles, w = 90, h = 50 }: Props) {
  if (!candles || candles.length === 0) return null;

  const highs = candles.map(c => c[2]);
  const lows = candles.map(c => c[3]);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const range = max - min || 1;

  const pad = 3;
  const innerH = h - pad * 2;
  const slot = w / candles.length;
  const bodyW = Math.max(2, slot * 0.55);

  const y = (price: number) => pad + (1 - (price - min) / range) * innerH;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      {candles.map((c, i) => {
        const [, open, high, low, close] = c;
        const up = close >= open;
        const color = up ? "var(--up)" : "var(--down)";
        const cx = i * slot + slot / 2;
        const bodyTop = y(Math.max(open, close));
        const bodyBottom = y(Math.min(open, close));
        const bodyH = Math.max(1, bodyBottom - bodyTop);
        return (
          <g key={i}>
            <line x1={cx} x2={cx} y1={y(high)} y2={y(low)} stroke={color} strokeWidth={1} />
            <rect x={cx - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} fill={color} />
          </g>
        );
      })}
    </svg>
  );
}
