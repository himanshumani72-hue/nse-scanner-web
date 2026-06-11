import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PortfolioAlertsCross } from "@/lib/types";

// ══════════════════════════════════════════════════════════════════════════
// GET /api/portfolio/alerts — cross-reference holdings with today's scanner alerts
// ══════════════════════════════════════════════════════════════════════════

const SCAN_LABELS: Record<string, { label: string; tab: string }> = {
  CHART_PATTERN:       { label: "V-Recovery Pattern",       tab: "patterns" },
  BIG_MOVERS:          { label: "Big Mover (Vol+News)",     tab: "movers" },
  BREAKOUT_52W:        { label: "52-Week Breakout",         tab: "breakout" },
  BB_SQUEEZE:          { label: "BB Squeeze",               tab: "bbsqueeze" },
  FLAT_BASE_UP:        { label: "Flat Base Breakout ▲",     tab: "flatup" },
  FLAT_BASE_DOWN:      { label: "Flat Base Breakdown ▼",    tab: "flatdown" },
  BULK_DEALS:          { label: "Bulk Deal Detected",       tab: "bulkdeals" },
  BROKER_UPGRADES:     { label: "Broker Upgrade",           tab: "broker" },
  W_PATTERN_15M:       { label: "W-Pattern",               tab: "wpattern" },
  W_PATTERN_5M:        { label: "W-Pattern (5M)",           tab: "wpattern" },
  CANNON_MOMENTUM:     { label: "Momentum Breakout",        tab: "momentum" },
  BOOMERANG_REVERSAL:  { label: "Oversold Reversal",        tab: "falling" },
  TURNAROUND:          { label: "Long-term Turnaround",     tab: "turnaround" },
  TWITTER_SPIKE:       { label: "Twitter/X Trending",       tab: "twitter" },
  SECTOR_ROTATION:     { label: "Sector Rotation Signal",   tab: "sectors" },
};

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's portfolio symbols
    const { data: holdings } = await supabase
      .from("user_portfolios")
      .select("symbol")
      .eq("user_id", user.id);

    if (!holdings || holdings.length === 0) {
      return NextResponse.json({ alerts: [], flagged_count: 0, total_holdings: 0 });
    }

    const symbols = holdings.map((h: { symbol: string }) => h.symbol);

    // Get today's alerts for these symbols (last 2 days for midnight safety)
    const istNow = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const today = istNow.toISOString().split("T")[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0];

    const { data: alerts } = await supabase
      .from("alerts")
      .select("symbol, scan_type, scanned_at")
      .in("symbol", symbols)
      .gte("scan_date", twoDaysAgo)
      .order("scanned_at", { ascending: false });

    if (!alerts || alerts.length === 0) {
      return NextResponse.json({
        alerts: [],
        flagged_count: 0,
        total_holdings: holdings.length,
      });
    }

    // Deduplicate: latest alert per (symbol, scan_type)
    const seen = new Set<string>();
    const crossAlerts: PortfolioAlertsCross[] = [];

    for (const a of alerts) {
      const key = `${a.symbol}::${a.scan_type}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const meta = SCAN_LABELS[a.scan_type] || { label: a.scan_type, tab: "" };
      crossAlerts.push({
        symbol: a.symbol,
        scan_type: a.scan_type,
        scan_label: meta.label,
        tab_id: meta.tab,
        scanned_at: a.scanned_at,
      });
    }

    return NextResponse.json({
      alerts: crossAlerts,
      flagged_count: new Set(crossAlerts.map(a => a.symbol)).size,
      total_holdings: holdings.length,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}
