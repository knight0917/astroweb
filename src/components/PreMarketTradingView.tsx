"use client";

import React, { useState, useMemo } from "react";
import { generateMorningTradingBriefing, MorningBriefingPayload } from "../engine/morningTradingBriefing";

export default function PreMarketTradingView() {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [sessionFilter, setSessionFilter] = useState<"ALL" | "ASIAN" | "EUROPEAN" | "NY">("ALL");

  const briefing: MorningBriefingPayload = useMemo(() => {
    try {
      const [y, m, d] = selectedDate.split("-").map(n => parseInt(n, 10));
      return generateMorningTradingBriefing(y, m, d);
    } catch {
      return generateMorningTradingBriefing(2026, 11, 3);
    }
  }, [selectedDate]);

  const filteredHours = useMemo(() => {
    return briefing.hourlyRoadmapH1.filter(h => {
      if (sessionFilter === "ALL") return true;
      if (sessionFilter === "ASIAN") return h.sessionPhase.includes("ASIAN");
      if (sessionFilter === "EUROPEAN") return h.sessionPhase.includes("EUROPEAN");
      if (sessionFilter === "NY") return h.sessionPhase.includes("NY");
      return true;
    });
  }, [briefing, sessionFilter]);

  const PRESETS = [
    { label: "Today (Live)", date: todayStr },
    { label: "Oct 30 (Crash -$140)", date: "2026-10-30" },
    { label: "Oct 29 (Saturn Low)", date: "2026-10-29" },
    { label: "Oct 28 (Rohini High)", date: "2026-10-28" },
    { label: "Oct 27 (+1.28%)", date: "2026-10-27" },
    { label: "Oct 22 (-$118 Drop)", date: "2026-10-22" },
  ];

  const isBearish = briefing.macroForecastD1.directionalBias.includes("BEARISH") || briefing.macroForecastD1.directionalBias.includes("LIQUIDATION");
  const isBullish = briefing.macroForecastD1.directionalBias.includes("BULLISH");

  return (
    <div className="w-full space-y-6 max-w-7xl mx-auto pb-16 px-2 sm:px-4">
      {/* Top Banner / Hero Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                🏛️ Institutional Trading Terminal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50">
                Rome ({briefing.romeTimezone} / UTC+{briefing.timezoneOffsetHours})
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono text-amber-300 bg-amber-950/40 border border-amber-700/50">
                Gold (XAU/USD)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>Italian Pre-Market Trading & Prediction Terminal</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Multi-timeframe price action forecast, volatility roadmaps, and execution playbooks calibrated strictly to Rome, Italy business hours (CET/CEST).
            </p>
          </div>

          {/* Date Selector & Presets */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-900/90 text-white font-mono text-sm px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 shadow-inner"
            />
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.date}
                  onClick={() => setSelectedDate(p.date)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    selectedDate === p.date
                      ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Market Session Clocks */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">🌅 European Session Open</span>
            <span className="text-amber-300 font-bold font-mono text-sm">{briefing.astronomical.sunriseRome} CET</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">🌇 European Session Close</span>
            <span className="text-amber-400 font-bold font-mono text-sm">{briefing.astronomical.sunsetRome} CET</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">☀️ Day Cash Duration</span>
            <span className="text-slate-200 font-bold font-mono text-sm">{briefing.astronomical.dayDurationHours}h</span>
            <span className="text-[10px] text-slate-500 ml-1">({briefing.astronomical.dinaHoraDurationMins}m cycle)</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">🌙 Overnight / Global</span>
            <span className="text-slate-200 font-bold font-mono text-sm">{briefing.astronomical.nightDurationHours}h</span>
            <span className="text-[10px] text-slate-500 ml-1">({briefing.astronomical.ratriHoraDurationMins}m cycle)</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: D1 DAILY MACRO REGIME & PRICE PREDICTION */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>🎯 Daily (D1) Macro Regime & Price Prediction</span>
          </h2>
          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
            isBearish
              ? "bg-rose-950/60 text-rose-300 border border-rose-700/60"
              : isBullish
              ? "bg-emerald-950/60 text-emerald-300 border border-emerald-700/60"
              : "bg-amber-950/60 text-amber-300 border border-amber-700/60"
          }`}>
            {briefing.macroForecastD1.directionalBias.replace(/_/g, " ")}
          </span>
        </div>

        {/* Regime Banner */}
        <div className={`p-4 rounded-xl border ${
          isBearish
            ? "bg-gradient-to-r from-rose-950/40 via-red-950/30 to-slate-950 border-rose-800/60"
            : isBullish
            ? "bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-950 border-emerald-800/60"
            : "bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border-amber-800/60"
        }`}>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Active Macro Regime</span>
          <h3 className="text-lg sm:text-xl font-extrabold text-white">{briefing.macroForecastD1.regime}</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">{briefing.macroForecastD1.institutionalTheme}</p>
        </div>

        {/* 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Expected Return (%)</span>
            <span className={`text-xl font-mono font-extrabold ${isBearish ? "text-rose-400" : isBullish ? "text-emerald-400" : "text-amber-400"}`}>
              {briefing.macroForecastD1.expectedReturnPct}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Directional baseline</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Projected True Range (USD)</span>
            <span className="text-xl font-mono font-extrabold text-white">
              {briefing.macroForecastD1.projectedRangeUsd}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Gold volatility band</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Market Session Bias</span>
            <span className="text-base font-mono font-extrabold text-amber-300">
              {isBearish ? "FADE RELIEF RALLIES" : isBullish ? "BUY LOW VWAP DIPS" : "MEAN REVERSION"}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Primary order flow</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Daily Target Phase</span>
            <span className="text-base font-mono font-extrabold text-slate-200">
              {briefing.astronomical.dayDurationHours > 12 ? "EXPANDED CASH" : "COMPRESSED CASH"}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Rome daylight cycle</span>
          </div>
        </div>

        {/* Core Trade Setup */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm">
          <span className="text-amber-400 font-bold block mb-1">⚡ Core Institutional Trade Execution Setup:</span>
          <p className="text-slate-200 leading-relaxed">{briefing.macroForecastD1.coreTradeSetup}</p>
        </div>

        {/* Quantitative Risk Alerts */}
        <div className="space-y-2 pt-1">
          {briefing.alerts.gandantaAlert && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-600/70 text-xs text-rose-200 flex items-start gap-2.5">
              <span className="text-lg leading-none">🚨</span>
              <div>
                <strong className="text-white block font-bold text-xs uppercase tracking-wide">CRITICAL TAIL-RISK ALERT: Extreme Downside Liquidity Flush Active</strong>
                <span>Systemic boundary condition detected. Strict capital preservation protocol. Strictly avoid buying dips; momentum liquidations can cascade $50–$100 beyond standard technical support.</span>
              </div>
            </div>
          )}
          {briefing.alerts.combustionAlert && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/60 text-xs text-amber-200 flex items-start gap-2.5">
              <span className="text-lg leading-none">⚠️</span>
              <div>
                <strong className="text-white block font-bold text-xs uppercase tracking-wide">MOMENTUM EXHAUSTION WARNING</strong>
                <span>Velocity indicators heavily compressed. High probability of false continuation moves and sudden volume dry-ups.</span>
              </div>
            </div>
          )}
          {briefing.alerts.dwiNeechaAlert && (
            <div className="p-3 rounded-xl bg-orange-950/40 border border-orange-600/60 text-xs text-orange-200 flex items-start gap-2.5">
              <span className="text-lg leading-none">⚔️</span>
              <div>
                <strong className="text-white block font-bold text-xs uppercase tracking-wide">INTER-MARKET CONFLICT / TRAP WARNING</strong>
                <span>Contradictory cross-asset pressures active. Whipsaws and aggressive stop-runs expected around major market opens.</span>
              </div>
            </div>
          )}
          {briefing.alerts.rahuAsterismAlert && (
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-600/60 text-xs text-indigo-200 flex items-start gap-2.5">
              <span className="text-lg leading-none">🌪️</span>
              <div>
                <strong className="text-white block font-bold text-xs uppercase tracking-wide">FALSE BREAKOUT / VOLATILITY FILTER</strong>
                <span>Elevated noise and liquidity-sweep frequency. Strictly require a 15-minute bar close confirmation before entering breakout positions.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: 24-HOUR HOURLY (H1) ROADMAP */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>⏱️ 24-Hour Hourly (H1) Roadmap & Key Inflection Points</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Calibrated strictly to Italian Time (CET/CEST). Starred (⭐) rows indicate primary volatility spikes, liquidity sweeps, and trend reversal zones.
            </p>
          </div>

          {/* Session Filters */}
          <div className="flex flex-wrap gap-1">
            {(["ALL", "ASIAN", "EUROPEAN", "NY"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSessionFilter(s)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  sessionFilter === s
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Pure Time & Prediction Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-bold">
              <tr>
                <th className="py-2.5 px-3">Italian Time ({briefing.romeTimezone})</th>
                <th className="py-2.5 px-3">UTC Time</th>
                <th className="py-2.5 px-3">Trading Session Phase</th>
                <th className="py-2.5 px-3">Market Prediction & Action Regime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-mono text-[11px]">
              {filteredHours.map((h, i) => (
                <tr
                  key={i}
                  className={`transition-colors ${
                    h.isKeyTurningPoint
                      ? "bg-amber-950/20 hover:bg-amber-950/30"
                      : "hover:bg-slate-900/50"
                  }`}
                >
                  <td className="py-2.5 px-3 font-bold text-white whitespace-nowrap">
                    {h.isKeyTurningPoint && <span className="text-amber-400 mr-1.5 font-bold">⭐</span>}
                    {h.romeTime}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{h.utcTime}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px] whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {h.sessionPhase}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-white text-[11px]">
                    <span className={h.isKeyTurningPoint ? "text-amber-300 font-bold flex items-center gap-1.5" : "text-slate-300"}>
                      {h.actionBias}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: 15-MINUTE (M15) MICROSTRUCTURE PLAYBOOK */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-4">
        <div className="border-b border-slate-800/80 pb-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>📊 15-Minute (M15) Microstructure Execution Playbook</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical quarterly decomposition inside every trading hour. Invariant systematic edge for order entry, VWAP tests, and profit harvesting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Q1 */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-emerald-900/60 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Q1 (:00 - :15 CET)
            </span>
            <h4 className="font-bold text-white text-sm mb-1">Dominant Impulse Engine</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {briefing.microstructureM15.q1ImpulseStrategy}
            </p>
          </div>

          {/* Q2 */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Q2 (:15 - :30 CET)
            </span>
            <h4 className="font-bold text-white text-sm mb-1">Liquidity Retracement</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {briefing.microstructureM15.q2RetracementRule}
            </p>
          </div>

          {/* Q3 */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              Q3 (:30 - :45 CET)
            </span>
            <h4 className="font-bold text-white text-sm mb-1">Secondary Expansion</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {briefing.microstructureM15.q3ExpansionTarget}
            </p>
          </div>

          {/* Q4 */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-rose-900/50 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-red-400" />
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">
              Q4 (:45 - :00 CET)
            </span>
            <h4 className="font-bold text-white text-sm mb-1">Pre-Hourly Close Drag</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {briefing.microstructureM15.q4DragDefense}
            </p>
          </div>
        </div>

        {/* Prime Execution Windows */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>🎯 Prime Execution Windows:</span>
          </span>
          <div className="flex flex-wrap gap-2 text-slate-200 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">08:00 - 08:30 CET (London Open)</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">13:00 - 13:30 CET (Pre-NY Bid)</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">14:00 - 14:30 CET (NY Cash Open)</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">19:00 - 19:30 CET (Absorption Low)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
