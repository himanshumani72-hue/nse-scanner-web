import { createClient, createServiceClient } from "@/lib/supabase/server";
import { priceForUser, OFFER } from "@/lib/pricing";
import DashboardClient from "@/components/DashboardClient";

export const revalidate = 0;  // always fresh

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: sub }       = await supabase.from("subscriptions").select("*").eq("user_id", user!.id).single();

  // Fetch alerts — use IST date. On weekends/holidays fall back to last 4 days
  // so Momentum Strategy and other EOD tabs still show Friday's data on Saturday/Sunday.
  const istNow = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const today  = istNow.toISOString().split("T")[0];

  // Fetch alerts from the last 2 days then dedupe per (scan_type, symbol)
  // — this is midnight-safe: if a scan runs 23:55 → 00:30, rows split across
  // two dates but the latest one wins. Also robust if Friday's data is the
  // most recent (over weekend).
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0];
  const { data: rawAlerts = [] } = await supabase
    .from("alerts")
    .select("*")
    .gte("scan_date", twoDaysAgo)
    .order("scanned_at", { ascending: false });

  // Keep only the latest row per (scan_type, symbol)
  const seen = new Set<string>();
  const alerts: typeof rawAlerts = [];
  for (const a of rawAlerts ?? []) {
    const key = `${a.scan_type}::${a.symbol}`;
    if (seen.has(key)) continue;
    seen.add(key);
    alerts.push(a);
  }

  const bigMovers    = alerts?.filter(a => a.scan_type === "BIG_MOVERS")       ?? [];
  const chartPat     = alerts?.filter(a => a.scan_type === "CHART_PATTERN")    ?? [];
  const wPattern     = alerts?.filter(a => a.scan_type === "W_PATTERN_15M" || a.scan_type === "W_PATTERN_5M") ?? [];
  const cannon       = alerts?.filter(a => a.scan_type === "CANNON_MOMENTUM")   ?? [];
  const boomerang    = alerts?.filter(a => a.scan_type === "BOOMERANG_REVERSAL") ?? [];
  const turnaround   = alerts?.filter(a => a.scan_type === "TURNAROUND")         ?? [];
  const bulkDeals    = alerts?.filter(a => a.scan_type === "BULK_DEALS")          ?? [];
  const breakout52w  = alerts?.filter(a => a.scan_type === "BREAKOUT_52W")         ?? [];
  const breakout1d   = alerts?.filter(a => a.scan_type === "BREAKOUT_1D")          ?? [];
  const sectors      = alerts?.filter(a => a.scan_type === "SECTOR_ROTATION")      ?? [];
  const broker       = alerts?.filter(a => a.scan_type === "BROKER_UPGRADES")      ?? [];
  const twitter      = alerts?.filter(a => a.scan_type === "TWITTER_SPIKE")        ?? [];
  const bbSqueeze    = alerts?.filter(a => a.scan_type === "BB_SQUEEZE")            ?? [];
  const flatUp       = alerts?.filter(a => a.scan_type === "FLAT_BASE_UP")          ?? [];
  const flatDown     = alerts?.filter(a => a.scan_type === "FLAT_BASE_DOWN")        ?? [];
  const alertsLast   = alerts?.[0]?.scanned_at ?? null;

  // Fetch market overview data
  const { data: metaRow } = await supabase
    .from("dashboard_meta")
    .select("data")
    .eq("id", 1)
    .single();
  const marketData = metaRow?.data ?? null;

  // Fetch panels data (probability ranking, falling stocks, watchlist)
  const { data: panelsRow } = await supabase
    .from("dashboard_meta")
    .select("data")
    .eq("id", 2)
    .single();
  const panelsData = panelsRow?.data ?? null;

  // Fetch latest scanner health run (today)
  const { data: healthRow } = await supabase
    .from("scanner_health")
    .select("*")
    .order("run_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const healthData = healthRow ?? null;

  // Last scan = when the SCANNERS actually ran (from alerts table).
  // We intentionally do NOT use panelsRow.data.scan_time because the Panel
  // Updater finishes 60-80 minutes after the actual scanners ran, so using
  // its timestamp makes "Last Scan" jump from e.g. 09:22 → 15:22 even though
  // the market data was captured at 09:22. The alerts scanned_at is the true
  // "when did we capture today's signals" time.
  const lastScan = alertsLast ?? null;

  // Days left in trial
  let daysLeft: number | null = null;
  if (sub?.status === "trial" && sub.trial_end) {
    const diff = new Date(sub.trial_end).getTime() - Date.now();
    daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  // Promo state: how many discounted months does this user still have?
  // (service-role to bypass RLS — paid_count is the user's verified-payment count)
  let promoLeft = 0;
  let nextPrice = 99;
  try {
    const svc = createServiceClient();
    const { count } = await svc.from("upi_payments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id)
      .eq("status", "verified");
    const pricing = priceForUser(count ?? 0);
    promoLeft = pricing.promoLeft;
    nextPrice = pricing.amount;
  } catch {}

  return (
    <DashboardClient
      userEmail={user!.email!}
      subStatus={sub?.status ?? "trial"}
      daysLeft={daysLeft}
      lastScan={lastScan}
      bigMovers={bigMovers}
      chartPatterns={chartPat}
      wPatterns={wPattern}
      cannonAlerts={cannon}
      boomerangAlerts={boomerang}
      turnaroundAlerts={turnaround}
      bulkDealsAlerts={bulkDeals}
      breakoutAlerts={breakout52w}
      breakout1dAlerts={breakout1d}
      sectorAlerts={sectors}
      brokerAlerts={broker}
      twitterAlerts={twitter}
      bbSqueezeAlerts={bbSqueeze}
      flatUpAlerts={flatUp}
      flatDownAlerts={flatDown}
      marketData={marketData}
      panelsData={panelsData}
      healthData={healthData}
      promoLeft={promoLeft}
      nextPrice={nextPrice}
      promoEnabled={OFFER.enabled}
    />
  );
}
