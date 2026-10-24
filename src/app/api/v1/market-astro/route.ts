import { NextRequest, NextResponse } from "next/server";
import { calculateAstroMarketSignal, MarketSymbol } from "@/engine/financialAstro";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/v1/market-astro
 * 
 * Query Parameters:
 * - symbol: "XAUUSD" | "EURUSD" | "GBPUSD" | "USDJPY" | "US30" | "USOIL" | "BTCUSD" (Default: "XAUUSD")
 * - date: ISO string or YYYY-MM-DD (Default: current live UTC time)
 * 
 * Returns: Complete machine-readable quantitative Astro signal payload for MT5 EAs.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawSymbol = (searchParams.get("symbol") || "XAUUSD").toUpperCase();
    const dateParam = searchParams.get("date");

    const validSymbols: MarketSymbol[] = ["XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "US30", "USOIL", "BTCUSD"];
    const symbol: MarketSymbol = validSymbols.includes(rawSymbol as MarketSymbol)
      ? (rawSymbol as MarketSymbol)
      : "XAUUSD";

    let targetDate = new Date();
    if (dateParam) {
      const parsed = new Date(dateParam);
      if (!isNaN(parsed.getTime())) {
        targetDate = parsed;
      }
    }

    const signal = calculateAstroMarketSignal(symbol, targetDate);

    return NextResponse.json(signal, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Access-Control-Allow-Origin": "*", // Allow MT5 WebRequest & external clients
      },
    });
  } catch (err: any) {
    console.error("[market-astro] Error generating signal:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: err?.message },
      { status: 500 }
    );
  }
}
