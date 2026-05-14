import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/DashboardClient";

export const revalidate = 0;  // always fresh

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: sub }       = await supabase.from("subscriptions").select("*").eq("user_id", user!.id).single();

  // Fetch today's alerts for all scan types
  // Use IST date (UTC+5:30) — scanner runs on IST machine and writes IST scan_date
  const today = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().split("T")[0];
  const { data: alerts = [] } = await supabase
    .from("alerts")
    .select("*")
    .eq("scan_date", today)
    .order("scanned_at", { ascending: false });

  const bigMovers    = alerts?.filter(a => a.scan_type === "BIG_MOVERS")       ?? [];
  const chartPat     = alerts?.filter(a => a.scan_type === "CHART_PATTERN")    ?? [];
  const wPattern     = alerts?.filter(a => a.scan_type === "W_PATTERN_15M" || a.scan_type === "W_PATTERN_5M") ?? [];
  const cannon       = alerts?.filter(a => a.scan_type === "CANNON_MOMENTUM")  ?? [];
  const boomerang    = alerts?.filter(a => a.scan_type === "BOOMERANG_REVERSAL") ?? [];
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

  // Last scan: use panel scan_time (updates every run even with 0 alerts)
  // panel_updater.py writes scan_time in DD/MM/YYYY HH:MM format
  // Fall back to last alert scanned_at if panels haven't run yet
  const panelScanTime = panelsRow?.data?.scan_time ?? null;
  const lastScan = panelScanTime
    ? new Date(
        panelScanTime.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2})/, '$3-$2-$1T$4:00+05:30')
      ).toISOString()
    : alertsLast;

  // Days left in trial
  let daysLeft: number | null = null;
  if (sub?.status === "trial" && sub.trial_end) {
    const diff = new Date(sub.trial_end).getTime() - Date.now();
    daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

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
      marketData={marketData}
      panelsData={panelsData}
    />
  );
}
