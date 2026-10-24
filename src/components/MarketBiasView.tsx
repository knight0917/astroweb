"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  calculateAstroMarketSignal,
  MarketSymbol,
  AstroMarketSignal,
  ASSET_SIGNIFICATIONS,
  IntradayHourSlice,
} from "../engine/financialAstro";

interface MarketBiasViewProps {
  initialSymbol?: MarketSymbol;
}

const SYMBOLS: Array<{
  id: MarketSymbol;
  name: string;
  icon: string;
  category: "Bullion" | "Forex" | "Commodity" | "Index" | "Crypto";
}> = [
  { id: "XAUUSD", name: "Gold / USD", icon: "🪙", category: "Bullion" },
  { id: "EURUSD", name: "EUR / USD", icon: "💶", category: "Forex" },
  { id: "GBPUSD", name: "GBP / USD", icon: "💷", category: "Forex" },
  { id: "USDJPY", name: "USD / JPY", icon: "💴", category: "Forex" },
  { id: "USOIL", name: "WTI Crude Oil", icon: "🛢️", category: "Commodity" },
  { id: "US30", name: "Dow Jones 30", icon: "📈", category: "Index" },
  { id: "BTCUSD", name: "Bitcoin / USD", icon: "₿", category: "Crypto" },
];

export default function MarketBiasView({ initialSymbol = "XAUUSD" }: MarketBiasViewProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<MarketSymbol>(initialSymbol);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [selectedHour, setSelectedHour] = useState<number>(13); // Default to NY Open (13:00 UTC)
  const [sessionFilter, setSessionFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Parse current target date object
  const targetDate = useMemo(() => {
    const parts = selectedDate.split("-").map(Number);
    if (parts.length === 3) {
      // Set to noon UTC to represent the full trading day
      return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12, 0, 0));
    }
    return new Date();
  }, [selectedDate]);

  // Compute signal directly client-side using the same deterministic engine
  const signal: AstroMarketSignal = useMemo(() => {
    return calculateAstroMarketSignal(selectedSymbol, targetDate);
  }, [selectedSymbol, targetDate]);

  // Filter 24-hour intraday timeline by selected session tab
  const filteredIntradayTimeline = useMemo(() => {
    if (!signal.intradayTimeline) return [];
    if (sessionFilter === "ALL") return signal.intradayTimeline;
    return signal.intradayTimeline.filter((s) => s.sessionName === sessionFilter);
  }, [signal.intradayTimeline, sessionFilter]);

  // Currently inspected hour slice
  const activeHourDetail = useMemo(() => {
    if (!signal.intradayTimeline) return null;
    return (
      signal.intradayTimeline.find((s) => s.hourUtc === selectedHour) ||
      signal.intradayTimeline[13] ||
      signal.intradayTimeline[0]
    );
  }, [signal.intradayTimeline, selectedHour]);

  // Calculate 7-day historical backtest strip around targetDate
  const historicalStrip = useMemo(() => {
    const days: Array<{
      dateStr: string;
      dayOfWeek: string;
      bias: number;
      action: string;
      allowLongs: boolean;
      allowShorts: boolean;
      isTarget: boolean;
    }> = [];

    for (let offset = -4; offset <= 2; offset++) {
      const d = new Date(targetDate);
      d.setUTCDate(d.getUTCDate() + offset);
      const iso = d.toISOString().split("T")[0];
      const s = calculateAstroMarketSignal(selectedSymbol, d);
      days.push({
        dateStr: iso,
        dayOfWeek: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
        bias: s.signals.directionalBias,
        action: s.dikshitLiquidityCycle.action,
        allowLongs: s.quantAdvice.allowLongs,
        allowShorts: s.quantAdvice.allowShorts,
        isTarget: offset === 0,
      });
    }
    return days;
  }, [selectedSymbol, targetDate]);

  const handlePrevDay = () => {
    const d = new Date(targetDate);
    d.setUTCDate(d.getUTCDate() - 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const d = new Date(targetDate);
    d.setUTCDate(d.getUTCDate() + 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleSetToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  const handleQuickPreset = (daysAgo: number) => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - daysAgo);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const copyApiUrl = () => {
    const url = `https://astroweb-pi.vercel.app/api/v1/market-astro?symbol=${selectedSymbol}&date=${selectedDate}`;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const isToday = useMemo(() => {
    return selectedDate === new Date().toISOString().split("T")[0];
  }, [selectedDate]);

  // Determine EA Directional Verdict Badge
  const eaActionVerdict = useMemo(() => {
    const { allowLongs, allowShorts } = signal.quantAdvice;
    const bias = signal.signals.directionalBias;

    if (allowLongs && !allowShorts) {
      return {
        badge: "🟢 STRICTLY LONGS ONLY",
        sub: "Sell orders blocked by Shastric filters. Institutional accumulation active.",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        advice: "Tell your EA to take BUY trades only (Buy Dips / Support tests).",
        glow: "shadow-emerald-500/20",
      };
    }
    if (allowShorts && !allowLongs) {
      return {
        badge: "🔴 STRICTLY SHORTS ONLY",
        sub: "Buy orders blocked by Shastric filters. Institutional distribution active.",
        color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
        advice: "Tell your EA to take SELL trades only (Short Rallies / Resistance tests).",
        glow: "shadow-rose-500/20",
      };
    }
    if (bias > 0.25) {
      return {
        badge: "🟢 STRONGLY BULLISH BIAS",
        sub: "Bullish expansion favored. Long setups have high statistical edge.",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        advice: "Prioritize LONG trades; avoid aggressive counter-trend shorting.",
        glow: "shadow-emerald-500/20",
      };
    }
    if (bias < -0.25) {
      return {
        badge: "🔴 STRONGLY BEARISH BIAS",
        sub: "Bearish pressure favored. Short setups have high statistical edge.",
        color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
        advice: "Prioritize SHORT trades; avoid aggressive knife-catching longs.",
        glow: "shadow-rose-500/20",
      };
    }
    return {
      badge: "⚪ TWO-WAY CHOP / NEUTRAL",
      sub: "Opposing planetary forces balanced. Range-bound oscillations expected.",
      color: "text-amber-300 bg-amber-500/10 border-amber-500/30",
      advice: "Take BOTH sides with tight profit targets, or pause EA if trend-following.",
      glow: "shadow-amber-500/20",
    };
  }, [signal]);

  return (
    <div className="w-full flex flex-col gap-6 text-slate-100 max-w-7xl mx-auto py-2">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              व्यापार ज्योतिष • Financial Astrology Engine v2.0
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
              MT5 Bridge Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Market Opening Daily Bias & Backtest Studio</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Synthesized from Varahamihira's <em>Brihat Samhita</em>, Pandit Hira Lal Dikshit's{" "}
            <em>Vyapar Bhavishya</em>, Narapati's <em>Narapatijayacharya</em>, and C.S. Patel's Kakshya
            transits. Determine your EA&apos;s directional gate before session open.
          </p>
        </div>

        {/* Quick Date Travel Navigation */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 shadow-inner">
          <div className="flex items-center gap-1 w-full sm:w-auto justify-between">
            <button
              onClick={handlePrevDay}
              title="Previous Day"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-bold"
            >
              ◀
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-mono text-amber-300 focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={handleNextDay}
              title="Next Day"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-bold"
            >
              ▶
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={handleSetToday}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                isToday
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handleQuickPreset(1)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
            >
              -1D
            </button>
            <button
              onClick={() => handleQuickPreset(7)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
            >
              -7D
            </button>
            <button
              onClick={() => handleQuickPreset(30)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
            >
              -30D
            </button>
          </div>
        </div>
      </div>

      {/* Asset Symbols Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
        {SYMBOLS.map((s) => {
          const isActive = selectedSymbol === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedSymbol(s.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 scale-105"
                  : "bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800/80"
              }`}
            >
              <span className="text-lg">{s.icon}</span>
              <span>{s.id}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                isActive ? "bg-slate-950/20 text-slate-900" : "bg-slate-800 text-slate-400"
              }`}>
                {s.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hero Box: Primary Daily Bias Verdict */}
      <div
        className={`bg-slate-950/90 border rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden ${eaActionVerdict.color} ${eaActionVerdict.glow}`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="text-xs uppercase tracking-widest font-mono text-slate-400">
              Pre-Market Directive for {selectedSymbol} • {targetDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}
            </div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
              {eaActionVerdict.badge}
            </div>
            <div className="text-sm font-medium text-slate-300 mt-1 max-w-2xl">
              {eaActionVerdict.advice}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-5 py-3 text-center">
              <div className="text-[11px] font-mono uppercase text-slate-400">Directional Bias</div>
              <div
                className={`text-2xl font-black font-mono ${
                  signal.signals.directionalBias > 0
                    ? "text-emerald-400"
                    : signal.signals.directionalBias < 0
                    ? "text-rose-400"
                    : "text-slate-200"
                }`}
              >
                {signal.signals.directionalBias > 0 ? "+" : ""}
                {signal.signals.directionalBias.toFixed(2)}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-5 py-3 text-center">
              <div className="text-[11px] font-mono uppercase text-slate-400">Vol Multiplier</div>
              <div className="text-2xl font-black font-mono text-amber-400">
                {signal.signals.volatilityMultiplier.toFixed(2)}×
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-5 py-3 text-center">
              <div className="text-[11px] font-mono uppercase text-slate-400">MT5 Confluence</div>
              <div className="text-2xl font-black font-mono text-cyan-400">
                {signal.signals.confluencePoints > 0 ? "+" : ""}
                {signal.signals.confluencePoints} pts
              </div>
            </div>
          </div>
        </div>

        {/* Visual Bias Gauge Meter */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono font-bold text-slate-400">
            <span className="text-rose-400">-1.00 Bearish Exhaustion</span>
            <span className="text-slate-400">0.00 Neutral Equilibrium</span>
            <span className="text-emerald-400">+1.00 Bullish Expansion</span>
          </div>
          <div className="w-full h-3.5 bg-slate-900 rounded-full border border-slate-800 overflow-hidden relative">
            {/* Center zero line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-600 z-10"></div>
            {/* Dynamic gauge fill */}
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                signal.signals.directionalBias >= 0
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
                  : "bg-gradient-to-l from-rose-600 to-rose-400"
              }`}
              style={{
                width: `${Math.abs(signal.signals.directionalBias) * 50}%`,
                marginLeft: signal.signals.directionalBias >= 0 ? "50%" : `${50 - Math.abs(signal.signals.directionalBias) * 50}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Actionable Rules Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between">
            <span className="text-slate-400 font-mono">Market Regime</span>
            <span className="text-base font-bold text-amber-300 mt-1">
              {signal.signals.marketRegime.replace("_", " ")}
            </span>
            <span className="text-[10px] text-slate-500 mt-1">
              Confidence: {signal.signals.confidenceScore}%
            </span>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between">
            <span className="text-slate-400 font-mono">Dikshit Order Flow</span>
            <span
              className={`text-base font-bold mt-1 ${
                signal.dikshitLiquidityCycle.action === "BUY_DIP"
                  ? "text-emerald-400"
                  : signal.dikshitLiquidityCycle.action === "SELL_RALLY"
                  ? "text-rose-400"
                  : "text-slate-300"
              }`}
            >
              {signal.dikshitLiquidityCycle.action.replace("_", " ")}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 truncate">
              Moon in {signal.dikshitLiquidityCycle.moonNakshatraName}
            </span>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between">
            <span className="text-slate-400 font-mono">EA Lot Size Scaling</span>
            <span className="text-base font-bold text-cyan-300 mt-1">
              {(signal.quantAdvice.lotSizeScale * 100).toFixed(0)}% of Normal Risk
            </span>
            <span className="text-[10px] text-slate-500 mt-1">
              ATR SL Mult: {signal.quantAdvice.suggestedAtrSlMultiplier}×
            </span>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between">
            <span className="text-slate-400 font-mono">API / WebRequest</span>
            <button
              onClick={copyApiUrl}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl px-2.5 py-1 mt-1 text-left flex items-center justify-between transition cursor-pointer"
            >
              <span>{copiedUrl ? "Copied to Clipboard! ✓" : "Copy Live JSON URL"}</span>
              <span>📋</span>
            </button>
            <span className="text-[10px] text-slate-500 mt-1 truncate">
              {signal.timestampIso.split("T")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Historical 7-Day Backtesting Timeline Strip */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-sm">🗓️ 7-Day Backtest Strip ({selectedSymbol})</span>
            <span className="text-xs text-slate-500">Click any date to inspect historical astro alignment</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Backtesting Mode Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {historicalStrip.map((item) => {
            const isBullish = item.bias > 0.25;
            const isBearish = item.bias < -0.25;
            return (
              <button
                key={item.dateStr}
                onClick={() => setSelectedDate(item.dateStr)}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-between gap-1 transition-all cursor-pointer text-center ${
                  item.isTarget
                    ? "bg-amber-500/15 border-amber-500/60 ring-2 ring-amber-500/30 scale-102"
                    : "bg-slate-900/80 hover:bg-slate-800 border-slate-800"
                }`}
              >
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  {item.dayOfWeek}
                </div>
                <div className="text-xs font-bold text-white font-mono">
                  {item.dateStr.slice(5)}
                </div>
                <div
                  className={`text-sm font-black font-mono my-0.5 ${
                    isBullish ? "text-emerald-400" : isBearish ? "text-rose-400" : "text-slate-300"
                  }`}
                >
                  {item.bias > 0 ? "+" : ""}
                  {item.bias.toFixed(2)}
                </div>
                <div
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isBullish
                      ? "bg-emerald-500/20 text-emerald-300"
                      : isBearish
                      ? "bg-rose-500/20 text-rose-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isBullish ? "Buy Only" : isBearish ? "Sell Only" : "Two-Way"}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {/* 1-Day Intraday Timing & Session Decomposition (24-Hour Hourly Matrix) */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                ⏰ 1-Day Intraday Timing Analysis ({selectedSymbol})
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                24-Hour Hora &amp; Kakshya Timeline
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Exact hour-by-hour alignment of Chaldean/Vedic Planetary Horas, C.S. Patel&apos;s 3°45&apos; Kakshyas, and global Forex/Bullion liquidity sessions. Click any hour to inspect its celestial mechanics.
            </p>
          </div>

          {/* Session filter tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: "ALL", label: "All 24 Hrs" },
              { id: "London Open & Core", label: "London (07-12)" },
              { id: "London / NY Overlap", label: "NY Overlap (12-17)" },
              { id: "Tokyo / Asian", label: "Tokyo (00-07)" },
              { id: "NY Afternoon / Close", label: "NY Close (17-24)" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSessionFilter(f.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  sessionFilter === f.id
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* 24-Hour Timeline Grid Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {filteredIntradayTimeline.map((slice) => {
            const isBullish = slice.hourlyBias >= 0.25;
            const isBearish = slice.hourlyBias <= -0.25;
            const isSelected = selectedHour === slice.hourUtc;
            const isPrimary = slice.isPrimaryLordHora;
            const isOpposing = slice.isOpposingLordHora;

            return (
              <button
                key={slice.hourUtc}
                onClick={() => setSelectedHour(slice.hourUtc)}
                className={`p-2.5 rounded-2xl border flex flex-col justify-between items-center gap-1.5 transition-all cursor-pointer text-center relative ${
                  isSelected
                    ? "bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/50 scale-102 z-10 shadow-lg shadow-amber-500/20"
                    : isPrimary
                    ? "bg-slate-900/90 border-emerald-500/40 hover:bg-slate-800 hover:border-emerald-500"
                    : isOpposing
                    ? "bg-slate-900/90 border-rose-500/40 hover:bg-slate-800 hover:border-rose-500"
                    : "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800/80"
                }`}
              >
                {isPrimary && (
                  <span className="absolute -top-1.5 right-1.5 text-[8px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-1 rounded-full">
                    Ruler
                  </span>
                )}
                {isOpposing && (
                  <span className="absolute -top-1.5 right-1.5 text-[8px] font-black uppercase tracking-wider bg-rose-500 text-white px-1 rounded-full">
                    Enemy
                  </span>
                )}
                <div className="text-[10px] font-mono text-slate-400">
                  {slice.hourUtc.toString().padStart(2, "0")}:00 UTC
                </div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{slice.horaLord}</span>
                </div>
                <div
                  className={`text-xs font-black font-mono ${
                    isBullish ? "text-emerald-400" : isBearish ? "text-rose-400" : "text-slate-300"
                  }`}
                >
                  {slice.hourlyBias > 0 ? "+" : ""}
                  {slice.hourlyBias.toFixed(2)}
                </div>
                <div
                  className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isBullish
                      ? "bg-emerald-500/20 text-emerald-300"
                      : isBearish
                      ? "bg-rose-500/20 text-rose-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isBullish ? "Buy Only" : isBearish ? "Sell Only" : "Two-Way"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Hour Shastric Deep-Dive Box */}
        {activeHourDetail && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {activeHourDetail.timeUtcLabel}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {activeHourDetail.sessionName} Session
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    activeHourDetail.hourlyBias >= 0.25
                      ? "bg-emerald-500/20 text-emerald-300"
                      : activeHourDetail.hourlyBias <= -0.25
                      ? "bg-rose-500/20 text-rose-300"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {activeHourDetail.hourlyBias >= 0.25
                    ? "🟢 LONGS ONLY"
                    : activeHourDetail.hourlyBias <= -0.25
                    ? "🔴 SHORTS ONLY"
                    : "⚪ TWO-WAY CHOP"}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {activeHourDetail.shastricReason}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono flex-shrink-0">
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-center">
                <div className="text-[10px] text-slate-500">Hora Lord</div>
                <div className="font-bold text-amber-300">{activeHourDetail.horaLord}</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-center">
                <div className="text-[10px] text-slate-500">Moon Kakshya</div>
                <div className="font-bold text-cyan-300">{activeHourDetail.moonKakshyaLord}</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-center">
                <div className="text-[10px] text-slate-500">Hourly Bias</div>
                <div
                  className={`font-black ${
                    activeHourDetail.hourlyBias > 0
                      ? "text-emerald-400"
                      : activeHourDetail.hourlyBias < 0
                      ? "text-rose-400"
                      : "text-slate-300"
                  }`}
                >
                  {activeHourDetail.hourlyBias > 0 ? "+" : ""}
                  {activeHourDetail.hourlyBias.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Classical Telemetry Breakdown (4 Deep Architectural Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Pandit Hira Lal Dikshit's Liquidity Cycle */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <span>📖 Pandit Hira Lal Dikshit Liquidity</span>
            </h3>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Vyapar Bhavishya
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Moon Nakshatra</span>
              <span className="font-bold text-slate-200">
                {signal.dikshitLiquidityCycle.moonNakshatraName} (#{signal.dikshitLiquidityCycle.moonNakshatraIndex})
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Dikshit Star Class</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  signal.dikshitLiquidityCycle.action === "BUY_DIP"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : signal.dikshitLiquidityCycle.action === "SELL_RALLY"
                    ? "bg-rose-500/20 text-rose-300"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                {signal.dikshitLiquidityCycle.action === "BUY_DIP"
                  ? "6 Buying Stars (Institutional Dip-Buying)"
                  : signal.dikshitLiquidityCycle.action === "SELL_RALLY"
                  ? "8 Selling Stars (Institutional Resistance Dump)"
                  : "Neutral Expansion Star"}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Panchaka 5× Multiplier</span>
              <span
                className={`font-bold font-mono ${
                  signal.dikshitLiquidityCycle.isPanchaka5xActive
                    ? "text-rose-400"
                    : "text-slate-400"
                }`}
              >
                {signal.dikshitLiquidityCycle.isPanchaka5xActive
                  ? "ACTIVE (Aquarius/Pisces 300°-360°)"
                  : "INACTIVE"}
              </span>
            </div>

            <div className="py-1 border-b border-slate-800/50">
              <span className="text-slate-400 block mb-1">Weekday Timing Regime:</span>
              <p className="text-slate-300 font-medium">
                {signal.dikshitLiquidityCycle.weeklySessionRegime}
              </p>
            </div>

            {signal.dikshitLiquidityCycle.intradayLunarConjunctions.length > 0 && (
              <div className="py-1 border-b border-slate-800/50">
                <span className="text-slate-400 block mb-1">Intraday Chandra Yuti (&lt;6.5°):</span>
                <div className="space-y-1">
                  {signal.dikshitLiquidityCycle.intradayLunarConjunctions.map((conj, idx) => (
                    <div key={idx} className="text-cyan-300 font-mono text-[11px]">
                      • {conj}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {signal.dikshitLiquidityCycle.solarChestabalaStations.length > 0 && (
              <div className="py-1">
                <span className="text-slate-400 block mb-1">Solar Chestabala Retrogression Zone:</span>
                <div className="space-y-1">
                  {signal.dikshitLiquidityCycle.solarChestabalaStations.map((station, idx) => (
                    <div key={idx} className="text-amber-300 font-mono text-[11px]">
                      • {station}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Varahamihira Scarcity & Graha Yuddha */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <span>🏛️ Varahamihira Scarcity & War</span>
            </h3>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Brihat Samhita Ch. 17 &amp; 41
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Asset Ruling Rashi</span>
              <span className="font-bold text-slate-200">
                {signal.varahamihiraScarcity.primarySignName} (Sign #{signal.varahamihiraScarcity.primarySignIndex})
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Scarcity Inflation Score</span>
              <span
                className={`font-black font-mono text-sm ${
                  signal.varahamihiraScarcity.scarcityInflationScore > 0
                    ? "text-emerald-400"
                    : "text-slate-300"
                }`}
              >
                +{signal.varahamihiraScarcity.scarcityInflationScore.toFixed(2)} (Mahargha Spike)
              </span>
            </div>

            <div className="py-1 border-b border-slate-800/50">
              <span className="text-slate-400 block mb-1">
                Malefics in Afflicting Houses (1, 2, 4, 5, 7, 8, 9, 12):
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {signal.varahamihiraScarcity.maleficsInAfflictingHouses.length > 0 ? (
                  signal.varahamihiraScarcity.maleficsInAfflictingHouses.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[11px]"
                    >
                      {m}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic">None (Supply stable)</span>
                )}
              </div>
            </div>

            <div className="py-1 border-b border-slate-800/50">
              <span className="text-slate-400 block mb-1">
                Benefics in Supporting Houses (2, 4, 5, 7, 9, 10, 11):
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {signal.varahamihiraScarcity.beneficsInSupportingHouses.length > 0 ? (
                  signal.varahamihiraScarcity.beneficsInSupportingHouses.map((b, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px]"
                    >
                      {b}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic">None</span>
                )}
              </div>
            </div>

            <div className="py-1">
              <span className="text-slate-400 block mb-1">
                Planetary Wars (&lt;1.0° Graha Yuddha):
              </span>
              {signal.varahamihiraScarcity.activeGrahaYuddha.length > 0 ? (
                <div className="space-y-1">
                  {signal.varahamihiraScarcity.activeGrahaYuddha.map((war, idx) => (
                    <div key={idx} className="text-rose-400 font-bold font-mono text-[11px]">
                      ⚠️ {war} — Violent whipsaws active
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-slate-500 italic">No active planetary wars</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Narapati Swarodaya Vedha Matrix */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <span>☸ Narapati Swarodaya Matrix</span>
            </h3>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Narapatijayacharya
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Panchanga Rahu Hemisphere</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  signal.narapatiSwarodaya.rahuKalanalaHemisphere === "JIVA_PAKSHA_BULLISH"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-rose-500/20 text-rose-300"
                }`}
              >
                {signal.narapatiSwarodaya.rahuKalanalaHemisphere === "JIVA_PAKSHA_BULLISH"
                  ? "JIVA PAKSHA (Amritopamam / Bullish)"
                  : "MRITA PAKSHA (Hani / Bearish)"}
              </span>
            </div>

            <div className="py-1 border-b border-slate-800/50">
              <span className="text-slate-400 block mb-1">Nodal Regime (Slokas 18–21):</span>
              <p className="text-slate-300 font-medium">
                {signal.narapatiSwarodaya.sunMoonNodalRegime}
              </p>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Primary Lord Vedha Multiplier</span>
              <span className="font-bold font-mono text-amber-300">
                {signal.narapatiSwarodaya.primaryLordVedhaMultiplier}× (Sloka 38: 3x Uchcha, 2x Vakri, 0x Neecha)
              </span>
            </div>

            <div className="py-1">
              <span className="text-slate-400 block mb-1">
                Solar Upagraha Shock Points (Slokas 59–61):
              </span>
              {signal.narapatiSwarodaya.activeSolarUpagrahaShocks.length > 0 ? (
                <div className="space-y-1">
                  {signal.narapatiSwarodaya.activeSolarUpagrahaShocks.map((shock, idx) => (
                    <div key={idx} className="text-rose-400 font-mono text-[11px]">
                      ⚡ {shock}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-slate-500 italic">None on key asset stars</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Advanced Transit & C.S. Patel Kakshyas */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <span>🎯 Advanced Transit &amp; Kakshyas</span>
            </h3>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              C.S. Patel 3°45&apos;
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Moon 3°45&apos; Kakshya Lord</span>
              <span className="font-bold text-cyan-300">
                {signal.advancedTransitConfluence.moonKakshyaLord}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Asset Primary Lord Kakshya</span>
              <span className="font-bold text-cyan-300">
                {signal.advancedTransitConfluence.primaryLordKakshyaLord}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Daily Yogi Star (Tailwind)</span>
              <span className="font-bold text-emerald-400">
                {signal.advancedTransitConfluence.yogiNakshatraName} ({signal.advancedTransitConfluence.yogiLord})
                {signal.advancedTransitConfluence.isYogiTailwindActive ? " — ACTIVE ✓" : ""}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Daily Avayogi Star (Headwind)</span>
              <span className="font-bold text-rose-400">
                {signal.advancedTransitConfluence.avayogiNakshatraName} ({signal.advancedTransitConfluence.avayogiLord})
                {signal.advancedTransitConfluence.isAvayogiHeadwindActive ? " — ACTIVE ⚠️" : ""}
              </span>
            </div>

            {signal.advancedTransitConfluence.dagdhaRashiAlert && (
              <div className="py-1 border-b border-slate-800/50">
                <span className="text-amber-400 font-bold block mb-0.5">⚠️ Dagdha Rashi Warning:</span>
                <p className="text-slate-300">{signal.advancedTransitConfluence.dagdhaRashiAlert}</p>
              </div>
            )}

            {signal.advancedTransitConfluence.dualSign15DegZone && (
              <div className="py-1">
                <span className="text-slate-400 block mb-0.5">Dual Sign 15° Zone:</span>
                <p className="text-cyan-300">{signal.advancedTransitConfluence.dualSign15DegZone}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
