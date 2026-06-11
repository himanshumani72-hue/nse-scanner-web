import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { SectorAllocation } from "@/lib/types";

// ══════════════════════════════════════════════════════════════════════════
// GET /api/portfolio/sectors — sector-wise allocation for pie chart
// ══════════════════════════════════════════════════════════════════════════

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's holdings
    const { data: holdings } = await supabase
      .from("user_portfolios")
      .select("symbol, quantity, buy_price")
      .eq("user_id", user.id);

    if (!holdings || holdings.length === 0) {
      return NextResponse.json({ sectors: [], total_value: 0 });
    }

    const symbols = holdings.map((h: { symbol: string }) => h.symbol);

    // Get sector + ltp from indicators
    const { data: indicators } = await supabase
      .from("portfolio_indicators")
      .select("symbol, ltp, sector")
      .in("symbol", symbols);

    const indicatorMap: Record<string, { ltp: number; sector: string }> = {};
    if (indicators) {
      for (const ind of indicators) {
        indicatorMap[ind.symbol] = {
          ltp: ind.ltp || 0,
          sector: ind.sector || "Other",
        };
      }
    }

    // Compute sector allocation using current value (ltp × qty)
    const sectorMap: Record<string, { value: number; count: number }> = {};
    let totalValue = 0;

    for (const h of holdings) {
      const ind = indicatorMap[h.symbol];
      const ltp = ind?.ltp ?? h.buy_price;  // fallback to buy price if no LTP
      const sector = ind?.sector ?? "Other";
      const currentValue = ltp * h.quantity;

      if (!sectorMap[sector]) {
        sectorMap[sector] = { value: 0, count: 0 };
      }
      sectorMap[sector].value += currentValue;
      sectorMap[sector].count += 1;
      totalValue += currentValue;
    }

    // Build sorted result
    const sectors: SectorAllocation[] = Object.entries(sectorMap)
      .map(([sector, data]) => ({
        sector,
        value: Math.round(data.value * 100) / 100,
        pct: totalValue > 0 ? Math.round((data.value / totalValue) * 1000) / 10 : 0,
        count: data.count,
      }))
      .sort((a, b) => b.pct - a.pct);

    return NextResponse.json({
      sectors,
      total_value: Math.round(totalValue * 100) / 100,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}
