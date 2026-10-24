"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import AstroDatePicker from "./AstroDatePicker";
import {
  calculateAstroMarketSignal,
  MarketSymbol,
  AstroMarketSignal,
  EMPIRICAL_GOLD_EDGES,
  EMPIRICAL_HORA_ALPHA,
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
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [timezoneMode, setTimezoneMode] = useState<"ROME" | "UTC">("ROME");
  const [romeTimeDisplay, setRomeTimeDisplay] = useState<string>("");

  // Target Date Memoization
  const targetDate = useMemo(() => {
    const parts = selectedDate.split("-").map(Number);
    if (parts.length === 3) {
      return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12, 0, 0));
    }
    return new Date();
  }, [selectedDate]);

  // Live Rome / Italy clock ticker
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-GB", {
        timeZone: "Europe/Rome",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/Rome",
        timeZoneName: "short",
      }).formatToParts(now);
      const tz = parts.find((p) => p.type === "timeZoneName")?.value || "CEST";
      setRomeTimeDisplay(`${formatted} ${tz}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute Rome local time representation for any UTC hour slice
  const getRomeTimeForUtc = useCallback(
    (utcHour: number) => {
      const d = new Date(targetDate);
      d.setUTCHours(utcHour, 0, 0, 0);
      return d.toLocaleTimeString("en-GB", {
        timeZone: "Europe/Rome",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
    [targetDate]
  );

  // Compute signal directly client-side using deterministic ephemeris engine
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

  // Empirical Astro-Quant Discovery Lookups (Phase 54.3)
  const empiricalNakshatraEdge = useMemo(() => {
    const name = signal.dikshitLiquidityCycle.moonNakshatraName;
    return EMPIRICAL_GOLD_EDGES[name] || null;
  }, [signal.dikshitLiquidityCycle.moonNakshatraName]);

  const empiricalTithiEdge = useMemo(() => {
    const name = signal.lunarPhase.tithiName;
    return EMPIRICAL_GOLD_EDGES[name] || null;
  }, [signal.lunarPhase.tithiName]);

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

    for (let offset = -3; offset <= 3; offset++) {
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
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              व्यापार ज्योतिष • Financial Astrology Studio
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
              MT5 EA Directive Active
            </span>
            {romeTimeDisplay && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>🇮🇹 Rome Time: {romeTimeDisplay}</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Market Opening Daily Bias &amp; Predictive Forecaster</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-2xl">
            Empirically verified from 6-month MT5 tick execution against Varahamihira's <em>Brihat Samhita</em> and Pandit Hira Lal Dikshit's <em>Vyapar Bhavishya</em>.
          </p>
        </div>

        {/* Quick Date Travel & Timezone Navigation */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 shadow-inner">
          {/* Timezone Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold w-full sm:w-auto justify-center">
            <button
              type="button"
              onClick={() => setTimezoneMode("ROME")}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                timezoneMode === "ROME"
                  ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Switch to Italian / European Local Time (Rome)"
            >
              <span>🇮🇹</span>
              <span>Rome (Italy)</span>
            </button>
            <button
              type="button"
              onClick={() => setTimezoneMode("UTC")}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                timezoneMode === "UTC"
                  ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Switch to Universal Coordinated Time (Exchange UTC)"
            >
              <span>🌐</span>
              <span>UTC</span>
            </button>
          </div>

          {/* Interactive Date Picker with Step Buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              onClick={handlePrevDay}
              title="Previous Day"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-bold cursor-pointer"
            >
              ◀
            </button>
            <AstroDatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              timezoneLabel={timezoneMode === "ROME" ? "🇮🇹 Rome (CET/CEST)" : "🌐 UTC (Exchange)"}
            />
            <button
              type="button"
              onClick={handleNextDay}
              title="Next Day"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-bold cursor-pointer"
            >
              ▶
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={handleSetToday}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                isToday
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(1)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              -1D
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(7)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              -7D
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
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 scale-102"
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

      {/* Hero Box: Primary Daily Bias Verdict & Gauge */}
      <div
        className={`bg-slate-950/90 border rounded-3xl p-6 sm:p-7 flex flex-col gap-5 shadow-2xl relative overflow-hidden ${eaActionVerdict.color} ${eaActionVerdict.glow}`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
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

          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-400">Directional Bias</div>
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

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-400">Vol Multiplier</div>
              <div className="text-2xl font-black font-mono text-amber-400">
                {signal.signals.volatilityMultiplier.toFixed(2)}×
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-400">Confidence</div>
              <div className="text-2xl font-black font-mono text-cyan-400">
                {signal.signals.confidenceScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Visual Bias Gauge Meter */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono font-bold text-slate-400">
            <span className="text-rose-400">-1.00 Bearish Exhaustion</span>
            <span className="text-slate-400">0.00 Neutral Equilibrium</span>
            <span className="text-emerald-400">+1.00 Bullish Expansion</span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full border border-slate-800 overflow-hidden relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-600 z-10"></div>
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

        {/* Empirical 6-Month Backtest Discovery Banner (Phase 54.3) */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                Empirical MT5 Backtest Edge (GOLD.pro)
              </span>
              {empiricalNakshatraEdge && (
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                  empiricalNakshatraEdge.bias === "BULLISH"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                }`}>
                  ⭐ {empiricalNakshatraEdge.name}: {empiricalNakshatraEdge.winRatePct}% {empiricalNakshatraEdge.bias} ({empiricalNakshatraEdge.historicalNetPts > 0 ? "+" : ""}{empiricalNakshatraEdge.historicalNetPts} pts)
                </span>
              )}
              {empiricalTithiEdge && (
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                  empiricalTithiEdge.bias === "BULLISH"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                }`}>
                  {empiricalTithiEdge.name} Tithi: {empiricalTithiEdge.winRatePct}% {empiricalTithiEdge.bias}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {empiricalNakshatraEdge
                ? empiricalNakshatraEdge.tradeGuidance
                : "Standard classical alignment active. Observe session open price action."}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-center">
              <div className="text-[9px] text-slate-500 uppercase font-mono">Reversal Window</div>
              <div className="text-xs font-bold text-amber-300 font-mono">17:00 - 18:00 Rome</div>
              <div className="text-[9px] text-slate-400">40% Daily Tops/Bottoms</div>
            </div>
            <button
              onClick={copyApiUrl}
              className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl px-3 py-2 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Copy live JSON URL for MT5 EA WebRequest"
            >
              <span>{copiedUrl ? "Copied! ✓" : "EA JSON URL"}</span>
              <span>📋</span>
            </button>
          </div>
        </div>
      </div>

      {/* Historical 7-Day Backtesting Timeline Strip */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-sm">🗓️ Multi-Day Astro Alignment Strip</span>
            <span className="text-xs text-slate-500 hidden sm:inline">Click any date to inspect historical or forward bias</span>
          </div>
          <span className="text-xs font-mono text-slate-400">{selectedSymbol}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {historicalStrip.map((item) => {
            const isBullish = item.bias > 0.25;
            const isBearish = item.bias < -0.25;
            return (
              <button
                key={item.dateStr}
                onClick={() => setSelectedDate(item.dateStr)}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between gap-1 transition-all cursor-pointer text-center ${
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

      {/* 24-Hour Intraday Timing Roadmap Section */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                ⏰ 24-Hour Intraday Timing Roadmap ({selectedSymbol})
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Hora &amp; Session Alignment
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirically verified: <strong>Sun Hora (+213.9 pts)</strong> produces peak buying momentum; <strong>Venus Hora (-494.7 pts)</strong> produces institutional liquidation.
            </p>
          </div>

          {/* Session filter tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: "ALL", label: "All 24 Hrs" },
              {
                id: "London Open & Core",
                label: timezoneMode === "ROME" ? "🏛️ Milan & London (09-14)" : "London (07-12 UTC)",
              },
              {
                id: "London / NY Overlap",
                label: timezoneMode === "ROME" ? "🔥 NY & EU Overlap (14-19)" : "NY Overlap (12-17 UTC)",
              },
              {
                id: "Tokyo / Asian",
                label: timezoneMode === "ROME" ? "⛩️ Tokyo/Asian (02-09)" : "Tokyo (00-07 UTC)",
              },
              {
                id: "NY Afternoon / Close",
                label: timezoneMode === "ROME" ? "🗽 NY Close (19-02)" : "NY Close (17-24 UTC)",
              },
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
            const romeTime = getRomeTimeForUtc(slice.hourUtc);
            const isRomeMode = timezoneMode === "ROME";

            // Empirical Hora Alpha badges
            const isSunHora = slice.horaLord === "Sun";
            const isVenusHora = slice.horaLord === "Venus";
            const isMoonHora = slice.horaLord === "Moon";

            // Peak Reversal window (17:00 - 18:00 Rome / 15:00 - 16:00 UTC)
            const isPeakReversalWindow = slice.hourUtc === 15 || slice.hourUtc === 16;
            const isEuOpen = slice.hourUtc === 7 || slice.hourUtc === 8; // 08:00 - 09:00 Rome

            return (
              <button
                key={slice.hourUtc}
                type="button"
                onClick={() => setSelectedHour(slice.hourUtc)}
                className={`p-2.5 rounded-2xl border flex flex-col justify-between items-center gap-1.5 transition-all cursor-pointer text-center relative ${
                  isSelected
                    ? "bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/50 scale-102 z-10 shadow-lg shadow-amber-500/20"
                    : isSunHora
                    ? "bg-amber-950/30 border-amber-500/50 hover:bg-amber-900/40"
                    : isVenusHora
                    ? "bg-rose-950/30 border-rose-500/50 hover:bg-rose-900/40"
                    : isMoonHora
                    ? "bg-cyan-950/30 border-cyan-500/40 hover:bg-cyan-900/40"
                    : "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800/80"
                }`}
              >
                {/* Badges */}
                {isSunHora && (
                  <span className="absolute -top-1.5 right-1.5 text-[8px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-1 rounded-full shadow-sm">
                    +213 pts
                  </span>
                )}
                {isVenusHora && (
                  <span className="absolute -top-1.5 right-1.5 text-[8px] font-black uppercase tracking-wider bg-rose-500 text-white px-1 rounded-full shadow-sm">
                    -494 pts
                  </span>
                )}
                {isPeakReversalWindow && (
                  <span className="absolute -top-1.5 left-1.5 text-[8px] font-bold uppercase tracking-wider bg-purple-500/40 text-purple-200 border border-purple-500/50 px-1 rounded-full">
                    Top Window
                  </span>
                )}
                {isEuOpen && !isPeakReversalWindow && (
                  <span className="absolute -top-1.5 left-1.5 text-[8px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-300 border border-blue-500/40 px-1 rounded-full">
                    EU Open
                  </span>
                )}

                <div className="flex flex-col items-center">
                  <div className="text-[11px] font-mono font-bold text-slate-200">
                    {isRomeMode ? `${romeTime} Rome` : `${slice.hourUtc.toString().padStart(2, "0")}:00 UTC`}
                  </div>
                  <div className="text-[9px] font-mono text-slate-500">
                    {isRomeMode ? `${slice.hourUtc.toString().padStart(2, "0")}:00 UTC` : `${romeTime} Rome`}
                  </div>
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

        {/* Selected Hour Deep-Dive Box */}
        {activeHourDetail && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-lg border border-amber-500/30 flex items-center gap-1">
                  <span>🇮🇹 Rome:</span>
                  <span>{getRomeTimeForUtc(activeHourDetail.hourUtc)} - {getRomeTimeForUtc((activeHourDetail.hourUtc + 1) % 24)}</span>
                </span>
                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                  Exchange: {activeHourDetail.timeUtcLabel}
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

      {/* Streamlined Shastric Telemetry Grid (Distilled & Cleaned Up) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pandit Hira Lal Dikshit's Liquidity */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>📖 Dikshit Liquidity</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              Vyapar Bhavishya
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Moon Nakshatra:</span>
              <span className="font-bold text-amber-300">
                {signal.dikshitLiquidityCycle.moonNakshatraName} (#{signal.dikshitLiquidityCycle.moonNakshatraIndex})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Dikshit Class:</span>
              <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                signal.dikshitLiquidityCycle.action === "BUY_DIP"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : signal.dikshitLiquidityCycle.action === "SELL_RALLY"
                  ? "bg-rose-500/20 text-rose-300"
                  : "bg-slate-800 text-slate-300"
              }`}>
                {signal.dikshitLiquidityCycle.action.replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Panchaka Status:</span>
              <span className={`font-mono font-bold text-[11px] ${
                signal.dikshitLiquidityCycle.isPanchaka5xActive ? "text-rose-400" : "text-slate-500"
              }`}>
                {signal.dikshitLiquidityCycle.isPanchaka5xActive ? "ACTIVE (5x Chop)" : "NORMAL"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Varahamihira Scarcity */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>🏛️ Brihat Samhita Scarcity</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              Varahamihira Ch. 41
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Scarcity Score:</span>
              <span className={`font-bold font-mono text-sm ${
                signal.varahamihiraScarcity.scarcityInflationScore > 0 ? "text-emerald-400" : "text-slate-300"
              }`}>
                +{signal.varahamihiraScarcity.scarcityInflationScore.toFixed(2)} (Mahargha)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Afflicting Malefics:</span>
              <span className="font-mono text-slate-300">
                {signal.varahamihiraScarcity.maleficsInAfflictingHouses.length > 0
                  ? signal.varahamihiraScarcity.maleficsInAfflictingHouses.join(", ")
                  : "None (Supply Stable)"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Graha Yuddha:</span>
              <span className="font-mono text-[11px] text-slate-400">
                {signal.varahamihiraScarcity.activeGrahaYuddha.length > 0 ? "⚠️ Active War" : "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Narapati Rahu Chakra */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>☸ Narapati Swarodaya</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              Rahu Chakra
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Rahu Hemisphere:</span>
              <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                signal.narapatiSwarodaya.rahuKalanalaHemisphere === "JIVA_PAKSHA_BULLISH"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-rose-500/20 text-rose-300"
              }`}>
                {signal.narapatiSwarodaya.rahuKalanalaHemisphere === "JIVA_PAKSHA_BULLISH"
                  ? "JIVA (Bullish Flow)"
                  : "MRITA (Drain / Bearish)"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Vedha Multiplier:</span>
              <span className="font-bold font-mono text-amber-300">
                {signal.narapatiSwarodaya.primaryLordVedhaMultiplier}× (Sloka 38)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Upagraha Shocks:</span>
              <span className="font-mono text-[11px] text-slate-400">
                {signal.narapatiSwarodaya.activeSolarUpagrahaShocks.length > 0 ? "⚠️ Active Shock" : "Clear"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: C.S. Patel Kakshyas */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>🎯 C.S. Patel Kakshyas</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              3°45&apos; Sub-Arc
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Moon Sub-Lord:</span>
              <span className="font-bold text-cyan-300">
                {signal.advancedTransitConfluence.moonKakshyaLord}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Yogi Tailwind:</span>
              <span className={`font-mono text-[11px] ${
                signal.advancedTransitConfluence.isYogiTailwindActive ? "text-emerald-400 font-bold" : "text-slate-500"
              }`}>
                {signal.advancedTransitConfluence.yogiLord} ({signal.advancedTransitConfluence.isYogiTailwindActive ? "ACTIVE" : "Quiet"})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Dagdha Warning:</span>
              <span className="font-mono text-[11px] text-slate-400 truncate max-w-[120px]">
                {signal.advancedTransitConfluence.dagdhaRashiAlert ? "⚠️ Burnt Sign" : "Clear"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
