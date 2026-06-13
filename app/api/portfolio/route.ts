import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { PortfolioHolding, PortfolioIndicator, PortfolioEnriched } from "@/lib/types";
import { exec } from "child_process";

// ══════════════════════════════════════════════════════════════════════════
// GET  /api/portfolio — fetch user's holdings enriched with live indicators
// ══════════════════════════════════════════════════════════════════════════
export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's holdings
    const { data: holdings, error: holdErr } = await supabase
      .from("user_portfolios")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (holdErr) {
      return NextResponse.json({ error: holdErr.message }, { status: 500 });
    }

    if (!holdings || holdings.length === 0) {
      return NextResponse.json({ holdings: [], summary: null });
    }

    // Fetch indicators for all portfolio symbols
    const symbols = holdings.map((h: PortfolioHolding) => h.symbol);
    const { data: indicators } = await supabase
      .from("portfolio_indicators")
      .select("*")
      .in("symbol", symbols);

    const indicatorMap: Record<string, PortfolioIndicator> = {};
    if (indicators) {
      for (const ind of indicators) {
        // Parse JSONB fields if they are strings
        indicatorMap[ind.symbol] = {
          ...ind,
          news_headlines: typeof ind.news_headlines === "string"
            ? JSON.parse(ind.news_headlines)
            : ind.news_headlines,
          recommendation_reasons: typeof ind.recommendation_reasons === "string"
            ? JSON.parse(ind.recommendation_reasons)
            : ind.recommendation_reasons,
        };
      }
    }

    // Enrich holdings with indicator data
    let totalInvested = 0;
    let totalCurrent = 0;

    const enriched: PortfolioEnriched[] = holdings.map((h: PortfolioHolding) => {
      const ind = indicatorMap[h.symbol] || null;
      const invested = h.buy_price * h.quantity;
      const ltp = ind?.ltp ?? h.buy_price;
      const currentValue = ltp * h.quantity;
      const pnl = currentValue - invested;
      const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;

      totalInvested += invested;
      totalCurrent += currentValue;

      return {
        ...h,
        indicator: ind,
        invested: Math.round(invested * 100) / 100,
        current_value: Math.round(currentValue * 100) / 100,
        pnl: Math.round(pnl * 100) / 100,
        pnl_pct: Math.round(pnlPct * 100) / 100,
      };
    });

    const totalPnl = totalCurrent - totalInvested;
    const totalPnlPct = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

    const summary = {
      total_invested: Math.round(totalInvested * 100) / 100,
      total_current: Math.round(totalCurrent * 100) / 100,
      total_pnl: Math.round(totalPnl * 100) / 100,
      total_pnl_pct: Math.round(totalPnlPct * 100) / 100,
      holding_count: holdings.length,
      best_performer: enriched.length > 0
        ? enriched.reduce((best, cur) => cur.pnl_pct > best.pnl_pct ? cur : best, enriched[0])
        : null,
      worst_performer: enriched.length > 0
        ? enriched.reduce((worst, cur) => cur.pnl_pct < worst.pnl_pct ? cur : worst, enriched[0])
        : null,
    };

    return NextResponse.json({ holdings: enriched, summary });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}


// ══════════════════════════════════════════════════════════════════════════
// POST /api/portfolio — add a new stock to portfolio
// ══════════════════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { symbol, exchange = "NSE", quantity, buy_price, buy_date, notes } = body;

    // Validate
    if (!symbol || !quantity || !buy_price || !buy_date) {
      return NextResponse.json({ error: "Missing required fields: symbol, quantity, buy_price, buy_date" }, { status: 400 });
    }
    if (quantity <= 0 || buy_price <= 0) {
      return NextResponse.json({ error: "Quantity and buy_price must be positive" }, { status: 400 });
    }
    if (exchange !== "NSE" && exchange !== "BSE") {
      return NextResponse.json({ error: "Exchange must be 'NSE' or 'BSE'" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_portfolios")
      .upsert({
        user_id: user.id,
        symbol: symbol.toUpperCase().trim(),
        exchange,
        quantity: Math.floor(quantity),
        buy_price,
        buy_date,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,symbol" })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Stock already in portfolio. Use PUT to update." }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Trigger background indicator fetch so the new stock shows all parameters immediately
    const sym = symbol.toUpperCase().trim();
    const pythonCmd = `python -X utf8 -c "from portfolio_refresh_indicators import refresh_single_symbol; import json; r = refresh_single_symbol('${sym}', '${exchange}'); print(json.dumps({'ok': r is not None}))"`;
    exec(pythonCmd, { cwd: "d:\\Share Market" }, (err, stdout, stderr) => {
      if (err) console.error(`[portfolio] Indicator fetch failed for ${sym}:`, stderr?.slice(0, 200));
      else console.log(`[portfolio] Indicator fetched for ${sym}:`, stdout?.trim());
    });

    return NextResponse.json({ holding: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}


// ══════════════════════════════════════════════════════════════════════════
// PUT /api/portfolio — update an existing holding
// ══════════════════════════════════════════════════════════════════════════
export async function PUT(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, quantity, buy_price, buy_date, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing holding id" }, { status: 400 });
    }

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (quantity !== undefined) updates.quantity = Math.floor(quantity);
    if (buy_price !== undefined) updates.buy_price = buy_price;
    if (buy_date !== undefined) updates.buy_date = buy_date;
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabase
      .from("user_portfolios")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Holding not found" }, { status: 404 });
    }

    return NextResponse.json({ holding: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}


// ══════════════════════════════════════════════════════════════════════════
// DELETE /api/portfolio — remove a stock from portfolio
// ══════════════════════════════════════════════════════════════════════════
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing holding id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("user_portfolios")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}
