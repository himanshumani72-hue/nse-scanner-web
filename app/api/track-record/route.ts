import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ══════════════════════════════════════════════════════════════════════════
// GET /api/track-record — win-rate / avg-return stats per scanner
// ══════════════════════════════════════════════════════════════════════════

type Horizon = "1d" | "3d" | "7d" | "30d";
const HORIZONS: Horizon[] = ["1d", "3d", "7d", "30d"];

interface ScanSignalRow {
  scan_type: string;
  return_1d: number | null;
  return_3d: number | null;
  return_7d: number | null;
  return_30d: number | null;
  scanned_at: string;
}

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Supabase caps a single query at 1000 rows — paginate to get all signals.
    const PAGE_SIZE = 1000;
    const allRows: ScanSignalRow[] = [];
    let page = 0;
    while (true) {
      const { data, error } = await supabase
        .from("scan_signals")
        .select("scan_type, return_1d, return_3d, return_7d, return_30d, scanned_at")
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      if (!data || data.length === 0) break;
      allRows.push(...(data as ScanSignalRow[]));
      if (data.length < PAGE_SIZE) break;
      page++;
    }

    const rows = allRows;

    type Agg = {
      scan_type: string;
      total_signals: number;
      last_signal_at: string | null;
      horizons: Record<Horizon, { wins: number; count: number; sumReturn: number }>;
    };

    const byType: Record<string, Agg> = {};

    for (const row of rows) {
      const agg = byType[row.scan_type] ?? (byType[row.scan_type] = {
        scan_type: row.scan_type,
        total_signals: 0,
        last_signal_at: null,
        horizons: {
          "1d":  { wins: 0, count: 0, sumReturn: 0 },
          "3d":  { wins: 0, count: 0, sumReturn: 0 },
          "7d":  { wins: 0, count: 0, sumReturn: 0 },
          "30d": { wins: 0, count: 0, sumReturn: 0 },
        },
      });

      agg.total_signals += 1;
      if (!agg.last_signal_at || row.scanned_at > agg.last_signal_at) {
        agg.last_signal_at = row.scanned_at;
      }

      for (const h of HORIZONS) {
        const ret = row[`return_${h}` as const];
        if (ret === null || ret === undefined) continue;
        const bucket = agg.horizons[h];
        bucket.count += 1;
        bucket.sumReturn += ret;
        if (ret > 0) bucket.wins += 1;
      }
    }

    const stats = Object.values(byType)
      .map(agg => {
        const horizons: Record<Horizon, { count: number; win_rate: number | null; avg_return: number | null }> =
          {} as any;
        for (const h of HORIZONS) {
          const b = agg.horizons[h];
          horizons[h] = {
            count: b.count,
            win_rate: b.count > 0 ? Math.round((b.wins / b.count) * 1000) / 10 : null,
            avg_return: b.count > 0 ? Math.round((b.sumReturn / b.count) * 100) / 100 : null,
          };
        }
        return {
          scan_type: agg.scan_type,
          total_signals: agg.total_signals,
          last_signal_at: agg.last_signal_at,
          horizons,
        };
      })
      .sort((a, b) => b.total_signals - a.total_signals);

    return NextResponse.json({ stats });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}
