"use client";

import React, { useState, useMemo } from "react";
import { generateMorningTradingBriefing, MorningBriefingPayload } from "../engine/morningTradingBriefing";

export default function PreMarketTradingView() {
  // Default to today or Oct 30, 2026
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const [selectedDate, setSelectedDate] = useState<string>("2026-10-30");
  const [sessionFilter, setSessionFilter] = useState<"ALL" | "ASIAN" | "EUROPEAN" | "NY">("ALL");

  const briefing: MorningBriefingPayload = useMemo(() => {
    try {
      const [y, m, d] = selectedDate.split("-").map(n => parseInt(n, 10));
      return generateMorningTradingBriefing(y, m, d);
    } catch {
      return generateMorningTradingBriefing(2026, 10, 30);
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
    { label: "Oct 27 (+1.28%)", date: "2026-10-27" },
    { label: "Oct 28 (Rohini High)", date: "2026-10-28" },
    { label: "Oct 29 (Saturn Low)", date: "2026-10-29" },
    { label: "Oct 30 (Crash -3.63%)", date: "2026-10-30" },
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
                🏛️ Topocentric Ephemeris Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50">
                Rome ({briefing.romeTimezone} / UTC+{briefing.timezoneOffsetHours})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>Italian Pre-Market Trading Terminal</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Calibrated to Rome topocentric coordinates (<span className="text-amber-400 font-mono">41.9028° N, 12.4964° E</span>). Multi-timeframe astro-quant ephemeris across Daily (D1), Hourly (H1 Dina/Ratri Horas), and M15 Quarters.
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

        {/* Astronomical Sun Split Micro-Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">🌅 Rome Sunrise</span>
            <span className="text-amber-300 font-bold font-mono text-sm">{briefing.astronomical.sunriseRome}</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">🌇 Rome Sunset</span>
            <span className="text-amber-400 font-bold font-mono text-sm">{briefing.astronomical.sunsetRome}</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">☀️ Dina Hora (Day)</span>
            <span className="text-slate-200 font-bold font-mono text-sm">{briefing.astronomical.dinaHoraDurationMins} min</span>
            <span className="text-[10px] text-slate-500 ml-1">({briefing.astronomical.dayDurationHours}h total)</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">🌙 Ratri Hora (Night)</span>
            <span className="text-slate-200 font-bold font-mono text-sm">{briefing.astronomical.ratriHoraDurationMins} min</span>
            <span className="text-[10px] text-slate-500 ml-1">({briefing.astronomical.nightDurationHours}h total)</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: D1 MACRO SCORECARD & RISK GATES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Regime & Forecast */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>🎯 D1 Macro Regime & Directional Matrix</span>
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

          {/* Regime Title Banner */}
          <div className={`p-4 rounded-xl border ${
            isBearish
              ? "bg-gradient-to-r from-rose-950/40 via-red-950/30 to-slate-950 border-rose-800/60"
              : isBullish
              ? "bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-950 border-emerald-800/60"
              : "bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border-amber-800/60"
          }`}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Active Macro Regime</span>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">{briefing.macroForecastD1.regime}</h3>
            <p className="text-xs text-slate-300 mt-1">{briefing.macroForecastD1.institutionalTheme}</p>
          </div>

          {/* Expected Return & Projected Range Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Expected Return (%)</span>
              <span className={`text-xl font-mono font-extrabold ${isBearish ? "text-rose-400" : isBullish ? "text-emerald-400" : "text-amber-400"}`}>
                {briefing.macroForecastD1.expectedReturnPct}
              </span>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Projected True Range (USD)</span>
              <span className="text-xl font-mono font-extrabold text-white">
                {briefing.macroForecastD1.projectedRangeUsd}
              </span>
            </div>
          </div>

          {/* Core Trade Setup */}
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 text-xs">
            <span className="text-amber-400 font-bold block mb-1">⚡ Core Institutional Trade Setup:</span>
            <p className="text-slate-300 leading-relaxed">{briefing.macroForecastD1.coreTradeSetup}</p>
          </div>

          {/* Active Risk Alerts */}
          <div className="space-y-2 pt-1">
            {briefing.alerts.gandantaAlert && (
              <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-600/70 text-xs text-rose-200 flex items-start gap-2">
                <span className="text-base leading-none">🚨</span>
                <div>
                  <strong className="text-white block font-bold">SYSTEM OVERRIDE: GANDANTA ALERT</strong>
                  <span>{briefing.alerts.gandantaDescription} Capital defense protocol active. Avoid dip-buying.</span>
                </div>
              </div>
            )}
            {briefing.alerts.combustionAlert && (
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-600/60 text-xs text-amber-200 flex items-start gap-2">
                <span className="text-base leading-none">⚠️</span>
                <div>
                  <strong className="text-white block font-bold">COMBUSTION GATE</strong>
                  <span>{briefing.alerts.combustionDescription}</span>
                </div>
              </div>
            )}
            {briefing.alerts.dwiNeechaAlert && (
              <div className="p-2.5 rounded-xl bg-orange-950/40 border border-orange-600/60 text-xs text-orange-200 flex items-start gap-2">
                <span className="text-base leading-none">⚔️</span>
                <div>
                  <strong className="text-white block font-bold">DWI-NEECHA MUTUAL KENDRA</strong>
                  <span>Sun in Libra forms a 90° square to Mars in Cancer. Heightened institutional vulnerability.</span>
                </div>
              </div>
            )}
            {briefing.alerts.rahuAsterismAlert && (
              <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-600/60 text-xs text-indigo-200 flex items-start gap-2">
                <span className="text-base leading-none">🌪️</span>
                <div>
                  <strong className="text-white block font-bold">RAHU ASTERISM ACTIVATION</strong>
                  <span>Sun or Moon transits Rahu-ruled asterism (Ardra / Swati / Shatabhisha). False breakouts frequent.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Panchanga & Ephemeris Breakdown */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800/80 pb-3 flex items-center gap-2">
            <span>📜 Topocentric Panchanga</span>
          </h2>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Vaar (Weekday)</span>
              <span className="text-white font-bold">{briefing.panchanga.vara}</span>
              <span className="text-[10px] text-amber-400 block">Lord: {briefing.panchanga.varaLord}</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Tithi</span>
              <span className="text-white font-bold">{briefing.panchanga.tithi}</span>
              <span className="text-[10px] text-slate-400 block">{briefing.panchanga.paksha} Paksha</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Nakshatra</span>
              <span className="text-white font-bold">{briefing.panchanga.nakshatra}</span>
              <span className="text-[10px] text-slate-400 block">Pada {briefing.panchanga.nakshatraPada} ({briefing.panchanga.nakshatraLord})</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Yoga & Karana</span>
              <span className="text-white font-bold">{briefing.panchanga.yoga}</span>
              <span className="text-[10px] text-slate-400 block">{briefing.panchanga.karana}</span>
            </div>
          </div>

          {/* Planetary Table */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Lahiri Positions (Rome)</span>
            <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar text-xs">
              {Object.entries(briefing.planetaryPositions).map(([name, p]) => (
                <div key={name} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 border border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white w-14">{name}</span>
                    <span className="text-slate-300 font-mono text-[11px]">{p.rashi} {p.degreesInSign.toFixed(2)}°</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">{p.nakshatra}</span>
                    {p.isRetrograde && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800">R</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: 24-HOUR H1 ROADMAP */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>⏱️ 24-Hour H1 Roadmap ({briefing.romeTimezone} Italian Time)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous topocentric Chaldean Horas derived from exact Rome Sunrise & Sunset. Starred (⭐) rows indicate primary volatility and liquidity inflection points.
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

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-bold">
              <tr>
                <th className="py-2.5 px-3">Italian Time ({briefing.romeTimezone})</th>
                <th className="py-2.5 px-3">UTC</th>
                <th className="py-2.5 px-3">Vedic Hora (Sunrise)</th>
                <th className="py-2.5 px-3">Clock Hora</th>
                <th className="py-2.5 px-3">Rome Lagna</th>
                <th className="py-2.5 px-3">Kakshya Lord</th>
                <th className="py-2.5 px-3">Session Phase</th>
                <th className="py-2.5 px-3">Market Action / Regime</th>
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
                    {h.isKeyTurningPoint && <span className="text-amber-400 mr-1">⭐</span>}
                    {h.romeTime}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{h.utcTime}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800/90 text-amber-300 border border-slate-700">
                      {h.vedicHora}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{h.clockHora}</td>
                  <td className="py-2.5 px-3 text-slate-300">{h.lagna}</td>
                  <td className="py-2.5 px-3 text-slate-400">{h.kakshyaLord}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px] whitespace-nowrap">{h.sessionPhase}</td>
                  <td className="py-2.5 px-3 font-sans text-white text-[11px]">
                    <span className={h.isKeyTurningPoint ? "text-amber-300 font-bold" : "text-slate-300"}>
                      {h.actionBias}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: M15 MICROSTRUCTURE PLAYBOOK */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-4">
        <div className="border-b border-slate-800/80 pb-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>📊 15-Minute (M15) Microstructure Playbook</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical quarterly decomposition of every trading hour in Rome. Invariant systematic edge derived from 70,431 bars.
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
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-400" />
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
              Q3 (:30 - :45 CET)
            </span>
            <h4 className="font-bold text-white text-sm mb-1">Secondary Expansion</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {briefing.microstructureM15.q3ExpansionTarget}
            </p>
          </div>

          {/* Q4 */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-red-400" />
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">
              Q4 (:45 - :00 CET)
            </span>
            <h4 className="font-bold text-white text-sm mb-1">Pre-Close Absorption</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {briefing.microstructureM15.q4DragDefense}
            </p>
          </div>
        </div>

        {/* Prime Execution Windows */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-amber-400 font-bold whitespace-nowrap">⭐ Prime Execution Windows:</span>
          <div className="flex flex-wrap gap-2">
            {briefing.microstructureM15.primeExecutionWindows.map((w, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[11px]">
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
