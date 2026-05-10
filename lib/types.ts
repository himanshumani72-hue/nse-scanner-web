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
