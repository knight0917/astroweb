"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { calculateGochar } from "../engine/gochar";
import { calculateVedicEphemeris } from "../engine/ephemeris";

export default function GocharView() {
  const { ephemeris: natalEphemeris, location, ayanamsha, houseSystem, nodeType } = useAstroStore();

  const [chartType, setChartType] = useState<"north" | "south">("north");
  const [transitDate, setTransitDate] = useState<Date>(new Date());

  // Compute live real-time transit ephemeris
  const transitEphemeris = useMemo(() => {
    return calculateVedicEphemeris(transitDate, location, ayanamsha, houseSystem, nodeType);
  }, [transitDate, location, ayanamsha, houseSystem, nodeType]);

  // Compute Gochar analysis
  const gochar = useMemo(() => {
    return calculateGochar(natalEphemeris, transitEphemeris);
  }, [natalEphemeris, transitEphemeris]);

  const ascLon = natalEphemeris.ascendant.siderealLongitude;
  const ascRashiIndex = Math.floor(ascLon / 30);

  // Map natal vs transit planets to houses for chart overlay
  const houseOccupants = useMemo(() => {
    const map: Record<
      number,
      {
        natal: { id: string; name: string; symbol: string; deg: number }[];
        transit: { id: string; name: string; symbol: string; deg: number; isRetro: boolean }[];
      }
    > = {};
    for (let i = 1; i <= 12; i++) map[i] = { natal: [], transit: [] };

    // Natal planets (in natal houses)
    Object.values(natalEphemeris.planets).forEach((p) => {
      if (p.isModernPlanet) return;
      map[p.house]?.natal.push({
        id: p.id,
        name: p.name.substring(0, 2),
        symbol: p.symbol,
        deg: p.siderealLongitude % 30,
      });
    });

    // Transit planets (placed in houses relative to natal Lagna)
    Object.values(transitEphemeris.planets).forEach((tp) => {
      if (tp.isModernPlanet) return;
      const transitRashi = Math.floor(tp.siderealLongitude / 30);
      const houseFromNatalLagna = ((transitRashi - ascRashiIndex + 12) % 12) + 1;
      map[houseFromNatalLagna]?.transit.push({
        id: tp.id,
        name: tp.name.substring(0, 2),
        symbol: tp.symbol,
        deg: tp.siderealLongitude % 30,
        isRetro: tp.isRetrograde || false,
      });
    });

    return map;
  }, [natalEphemeris, transitEphemeris, ascRashiIndex]);

  const getNorthRashiNum = (houseNum: number) => {
    return ((ascRashiIndex + (houseNum - 1)) % 12) + 1;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🪐</span>
              <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-cyan-200 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                Planetary Transits (गोचर) & Sade Sati
              </h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Live Sky Overlay
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live celestial transits evaluated against Natal Moon ({gochar.natalMoonRashiName}) and Natal Lagna ({gochar.natalAscRashiName})
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-2xl">
            <span className="text-cyan-400 text-xs">🕒</span>
            <span className="text-xs font-mono font-bold text-slate-300">
              Transit Date: {transitDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* 2. Saturn Sade Sati & Dhaiya Status Dashboard */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-500/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">♄</span>
              <h3 className="font-extrabold text-sm text-slate-100">
                {gochar.sadeSati.statusTitle}
              </h3>
            </div>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase ${
                gochar.sadeSati.hasSadeSati || gochar.sadeSati.hasDhaiya
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              }`}
            >
              {gochar.sadeSati.phaseName}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {gochar.sadeSati.description}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Natal Moon:</span>
              <span className="font-bold text-slate-200">{gochar.sadeSati.moonNatalRashi}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Saturn Transit:</span>
              <span className="font-bold text-cyan-300">{gochar.sadeSati.saturnTransitRashi}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">House from Moon:</span>
              <span className="font-bold text-amber-300">House {gochar.sadeSati.houseFromMoon}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Severity Level:</span>
              <span className="font-bold text-slate-200">{gochar.sadeSati.severity}</span>
            </div>
          </div>

          {/* Timing & End Dates Banner (कब तक रहेगी साढ़े साती / ढैय्या) */}
          <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-500/40 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-xs">⏳</span>
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  {gochar.sadeSati.hasSadeSati
                    ? "Sade Sati Duration & End Date (साढ़े साती कब तक रहेगी):"
                    : gochar.sadeSati.hasDhaiya
                    ? "Dhaiya Duration & End Date (ढैय्या कब तक रहेगी):"
                    : "Next Saturn Cycle Forecast (शनि प्रभाव स्थिति):"}
                </span>
              </div>
              {gochar.sadeSati.remainingDurationFormatted && (
                <span className="text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {gochar.sadeSati.remainingDurationFormatted}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {gochar.sadeSati.currentPhaseEndFormatted && (
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Current Phase Ends (वर्तमान चरण):</span>
                  <span className="font-mono font-bold text-slate-100">{gochar.sadeSati.currentPhaseEndFormatted}</span>
                </div>
              )}

              {gochar.sadeSati.totalCompletionFormatted && (
                <div className="p-2 rounded-lg bg-slate-900/80 border border-amber-500/40 flex items-center justify-between">
                  <span className="text-amber-300 font-bold">Total Sade Sati Ends (पूर्ण मुक्ति):</span>
                  <span className="font-mono font-black text-amber-300">{gochar.sadeSati.totalCompletionFormatted}</span>
                </div>
              )}

              {gochar.sadeSati.nextCycleStartFormatted && (
                <div className="p-2 rounded-lg bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between col-span-1 sm:col-span-2">
                  <span className="text-emerald-300 font-bold">Next Sade Sati Cycle Begins (आगामी आरंभ):</span>
                  <span className="font-mono font-black text-emerald-300">{gochar.sadeSati.nextCycleStartFormatted}</span>
                </div>
              )}
            </div>
          </div>

          {/* Remedies Box */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-blue-500/30 text-xs space-y-1">
            <span className="font-bold text-blue-300 block text-[11px]">
              📿 Prescribed Shani Shanti Remedies (शनि शांति उपाय):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-300">
              {gochar.sadeSati.remedies.map((rem, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-blue-400">•</span>
                  <span>{rem}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Dual Transit Chart (North & South Indian) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Interactive Kundli Chart with Dual Overlay */}
        <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-lg">☸</span>
              <h3 className="font-black text-sm text-slate-100 uppercase tracking-wider">
                Transit Kundli Overlay (गोचर चक्र)
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setChartType("north")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  chartType === "north" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                North
              </button>
              <button
                onClick={() => setChartType("south")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  chartType === "south" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                South
              </button>
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex items-center justify-center gap-6 text-xs bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500/80 border border-amber-400"></span>
              <span className="text-amber-200 font-bold">Natal Planets (जन्म ग्रह)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cyan-500/80 border border-cyan-400"></span>
              <span className="text-cyan-200 font-bold">Transit Planets (गोचर ग्रह)</span>
            </div>
          </div>

          {/* North Indian Dual Chart SVG */}
          {chartType === "north" ? (
            <div className="relative w-full max-w-[440px] aspect-square mx-auto p-1">
              <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
                {/* Background Outer Square */}
                <rect x="10" y="10" width="380" height="380" fill="#030712" stroke="#334155" strokeWidth="2.5" rx="8" />

                {/* Classical North Indian House Diagonals */}
                <line x1="10" y1="10" x2="390" y2="390" stroke="#475569" strokeWidth="1.5" />
                <line x1="390" y1="10" x2="10" y2="390" stroke="#475569" strokeWidth="1.5" />
                <polygon points="200,10 390,200 200,390 10,200" fill="none" stroke="#64748b" strokeWidth="2" />

                {/* 12 House Centers Render */}
                {[
                  { h: 1, x: 200, y: 100 },
                  { h: 2, x: 100, y: 55 },
                  { h: 3, x: 55, y: 100 },
                  { h: 4, x: 100, y: 200 },
                  { h: 5, x: 55, y: 300 },
                  { h: 6, x: 100, y: 345 },
                  { h: 7, x: 200, y: 300 },
                  { h: 8, x: 300, y: 345 },
                  { h: 9, x: 345, y: 300 },
                  { h: 10, x: 300, y: 200 },
                  { h: 11, x: 345, y: 100 },
                  { h: 12, x: 300, y: 55 },
                ].map(({ h, x, y }) => {
                  const occupants = houseOccupants[h];
                  const rashiNum = getNorthRashiNum(h);

                  return (
                    <g key={`h-${h}`}>
                      {/* Rashi Number in House Corner */}
                      <text x={x} y={y - 20} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                        {rashiNum}
                      </text>

                      {/* Natal Planets (Amber) */}
                      <g transform={`translate(${x}, ${y - 6})`}>
                        {occupants.natal.slice(0, 3).map((p, idx) => (
                          <text
                            key={`nat-${p.id}`}
                            x={(idx - (occupants.natal.length - 1) / 2) * 24}
                            y={0}
                            textAnchor="middle"
                            fill="#f59e0b"
                            fontSize="9.5"
                            fontWeight="900"
                          >
                            {p.name}
                          </text>
                        ))}
                      </g>

                      {/* Transit Planets (Cyan) */}
                      <g transform={`translate(${x}, ${y + 12})`}>
                        {occupants.transit.slice(0, 3).map((tp, idx) => (
                          <text
                            key={`tr-${tp.id}`}
                            x={(idx - (occupants.transit.length - 1) / 2) * 24}
                            y={0}
                            textAnchor="middle"
                            fill="#38bdf8"
                            fontSize="9"
                            fontWeight="bold"
                          >
                            {tp.name}(T)
                          </text>
                        ))}
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            /* South Indian 4x4 Grid */
            <div className="grid grid-cols-4 gap-1.5 w-full max-w-[440px] aspect-square mx-auto p-1 text-xs">
              {[
                { rashi: 11, name: "Pisces" },
                { rashi: 0, name: "Aries" },
                { rashi: 1, name: "Taurus" },
                { rashi: 2, name: "Gemini" },
                { rashi: 10, name: "Aquarius" },
                { rashi: -1, name: "" },
                { rashi: -1, name: "" },
                { rashi: 3, name: "Cancer" },
                { rashi: 9, name: "Capricorn" },
                { rashi: -1, name: "" },
                { rashi: -1, name: "" },
                { rashi: 4, name: "Leo" },
                { rashi: 8, name: "Sagittarius" },
                { rashi: 7, name: "Scorpio" },
                { rashi: 6, name: "Libra" },
                { rashi: 5, name: "Virgo" },
              ].map((cell, idx) => {
                if (cell.rashi === -1) {
                  return idx === 5 ? (
                    <div
                      key={idx}
                      className="col-span-2 row-span-2 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-2 text-center"
                    >
                      <span className="font-extrabold text-slate-300 text-xs">SOUTH TRANSIT</span>
                      <span className="text-[10px] text-cyan-400 font-bold mt-1">Cyan = Transit (T)</span>
                      <span className="text-[10px] text-amber-400 font-bold">Amber = Natal</span>
                    </div>
                  ) : null;
                }

                // Find planets in this Rashi
                const natalInRashi = Object.values(natalEphemeris.planets).filter(
                  (p) => !p.isModernPlanet && Math.floor(p.siderealLongitude / 30) === cell.rashi
                );
                const transitInRashi = Object.values(transitEphemeris.planets).filter(
                  (tp) => !tp.isModernPlanet && Math.floor(tp.siderealLongitude / 30) === cell.rashi
                );
                const isLagna = ascRashiIndex === cell.rashi;

                return (
                  <div
                    key={idx}
                    className={`p-1.5 rounded-xl border flex flex-col justify-between ${
                      isLagna ? "bg-amber-950/30 border-amber-400" : "bg-slate-900/70 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] font-bold">
                      <span className="text-slate-400">{cell.name.substring(0, 3)}</span>
                      {isLagna && <span className="text-amber-400 font-extrabold">LAG</span>}
                    </div>

                    <div className="space-y-0.5 my-1">
                      {/* Natal */}
                      <div className="flex flex-wrap gap-1">
                        {natalInRashi.map((np) => (
                          <span key={np.id} className="text-[8.5px] font-black text-amber-300">
                            {np.name.substring(0, 2)}
                          </span>
                        ))}
                      </div>
                      {/* Transit */}
                      <div className="flex flex-wrap gap-1">
                        {transitInRashi.map((tp) => (
                          <span key={tp.id} className="text-[8px] font-bold text-cyan-300">
                            {tp.name.substring(0, 2)}(T)
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: 9 Planetary Transit Analysis Cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
            Current Planetary Transit Positions (गोचर फल)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {gochar.transits.map((t) => (
              <div
                key={t.id}
                className={`p-3 rounded-2xl border transition-all shadow-md space-y-1.5 ${
                  t.score === "Auspicious"
                    ? "bg-emerald-950/20 border-emerald-500/40"
                    : t.score === "Inauspicious"
                    ? "bg-rose-950/20 border-rose-500/40"
                    : "bg-slate-950/70 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{t.symbol}</span>
                    <span className="font-black text-xs text-slate-100">{t.name}</span>
                    <span className="text-[10px] text-amber-400 font-medium">({t.hindiName})</span>
                    {t.isRetrograde && (
                      <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-rose-500/20 text-rose-300">
                        (R)
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      t.score === "Auspicious"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : t.score === "Inauspicious"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {t.score}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                  <span>Transit: {t.transitRashiName} ({t.transitDegree.toFixed(1)}°)</span>
                  <span className="text-amber-300 font-bold">House {t.transitHouseFromMoon} from Moon</span>
                </div>

                <p className="text-[10.5px] text-slate-400 leading-relaxed">
                  {t.effectsSummary}
                </p>

                <div className="text-[9px] text-slate-500 font-mono">
                  {t.classicalRules}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}