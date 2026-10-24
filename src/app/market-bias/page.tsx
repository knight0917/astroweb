import React from "react";
import MarketBiasView from "@/components/MarketBiasView";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Market Bias & Backtest Studio | Financial Astrology Engine",
  description:
    "Pre-market opening daily directional bias and historical backtesting for Gold, EURUSD, GBPUSD, Oil, US30, and Bitcoin using classical Samhita & Swarodaya rules.",
};

export default function MarketBiasPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-200 hover:text-amber-400 transition"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black">
            ☸
          </div>
          <span className="font-extrabold text-base tracking-tight text-white">
            Vedic Sky <span className="text-amber-400">Tracker</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            ← Return to Kundli
          </Link>
          <a
            href="https://astroweb-pi.vercel.app/api/v1/market-astro?symbol=XAUUSD"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center gap-1 shadow-md shadow-amber-500/20"
          >
            <span>Live MT5 JSON API</span>
            <span>↗</span>
          </a>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <main className="flex-1 w-full px-3 sm:px-6 py-4">
        <MarketBiasView initialSymbol="XAUUSD" />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 px-4 text-center text-xs text-slate-500">
        <span>
          Financial Astrology Engine v2.0 • Classical Vyapar Jyotish for MT5 Algorithmic Trading • Powered by Sidereal Planetary Mechanics
        </span>
      </footer>
    </div>
  );
}
