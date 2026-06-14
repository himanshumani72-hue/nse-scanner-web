export type ScanType = "BIG_MOVERS" | "CHART_PATTERN" | "W_PATTERN_5M";

export interface Alert {
  id: string;
  scan_type: ScanType;
  symbol: string;
  data: Record<string, string | number | boolean>;
  scan_date: string;
  scanned_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: "trial" | "active" | "cancelled" | "expired" | "halted";
  trial_end: string;
  current_period_end: string | null;
  razorpay_subscription_id: string | null;
  created_at: string;
}

export interface ScanSummary {
  last_scan: string | null;
  big_movers_count: number;
  pattern_count: number;
  w_pattern_count: number;
}

// ── Portfolio types ──────────────────────────────────────────────────

export interface PortfolioHolding {
  id: string;
  user_id: string;
  symbol: string;
  exchange: "NSE" | "BSE";
  quantity: number;
  buy_price: number;
  buy_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioIndicator {
  symbol: string;
  exchange: string;
  ltp: number | null;
  prev_close: number | null;
  change_pct: number | null;
  volume: number | null;
  prev_day_volume: number | null;
  prev_2d_volume: number | null;
  prev_3d_volume: number | null;
  vol_3d_trend: string | null;
  vol_ratio: number | null;
  rsi_14: number | null;
  ema_21: number | null;
  ema_51: number | null;
  sma_20: number | null;
  sma_50: number | null;
  sector: string | null;
  news_score: number | null;
  news_headlines: string[] | null;
  recommendation: "GOOD_NEWS" | "WARNING" | "RED_FLAG" | "NEUTRAL" | null;
  recommendation_reasons: string[] | null;
  composite_score: number | null;
  composite_label: string | null;
  updated_at: string | null;
}

export interface PortfolioEnriched extends PortfolioHolding {
  indicator: PortfolioIndicator | null;
  invested: number;          // buy_price × quantity
  current_value: number;     // ltp × quantity
  pnl: number;               // current_value − invested
  pnl_pct: number;           // pnl / invested × 100
}

export interface PortfolioAlertsCross {
  symbol: string;
  scan_type: string;
  scan_label: string;
  tab_id: string;
  scanned_at: string;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  pct: number;
  count: number;  // number of stocks in this sector
}
