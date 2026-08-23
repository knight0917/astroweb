"use client";

import React, { useState } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { RASHIS } from "../engine/constants";

export default function KundliChart() {
  const [chartType, setChartType] = useState<"north" | "south">("north");
  const {
    ephemeris,
    showModernPlanets,
    showUpagrahas,
    selectedEntityId,
    setSelectedEntityId,
    setViewMode,
  } = useAstroStore();

  const ascLon = ephemeris.ascendant.siderealLongitude;
  const ascRashiIndex = Math.floor(ascLon / 30); // 0 = Mesha, ..., 11 = Meena

  // Map each house (1..12) to the list of planets in it
  const houseOccupants: Record<
    number,
    { id: string; symbol: string; name: string; isRetro?: boolean; isUpagraha?: boolean; deg: number }[]
  > = {};
  for (let i = 1; i <= 12; i++) houseOccupants[i] = [];

  // Add planets
  Object.values(ephemeris.planets).forEach((p) => {
    if (!showModernPlanets && p.isModernPlanet) return;
    houseOccupants[p.house].push({
      id: p.id,
      symbol: p.symbol,
      name: p.name.substring(0, 2),
      isRetro: p.isRetrograde,
      deg: p.siderealLongitude % 30,
    });
  });

  // Add Upagrahas if enabled
  if (showUpagrahas) {
    Object.values(ephemeris.upagrahas).forEach((u) => {
      houseOccupants[u.house].push({
        id: u.id,
        symbol: "✦",
        name: u.name.substring(0, 2),
        isUpagraha: true,
        deg: u.siderealLongitude % 30,
      });
    });
  }

  // Helper to get Rashi number (1 to 12) for a given House in North Indian chart
  const getNorthRashiNum = (houseNum: number) => {
    return ((ascRashiIndex + (houseNum - 1)) % 12) + 1;
  };

  // Helper to render planet badges inside house with adaptive layout
  const renderPlanetList = (houseNum: number) => {
    const list = houseOccupants[houseNum] || [];
    if (list.length === 0) return null;

    const count = list.length;
    // Adaptive sizing for high occupant density
    const badgeStyle =
      count >= 5
        ? "text-[8.5px] px-1 py-0.5"
        : count >= 3
        ? "text-[9.5px] px-1.5 py-0.5"
        : "text-[11px] px-2 py-0.5";

    return (
      <div className="flex flex-wrap gap-1 justify-center items-center w-full max-w-full p-1 overflow-visible">
        {list.map((p) => {
          const isSelected = selectedEntityId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedEntityId(p.id)}
              className={`${badgeStyle} rounded-md font-extrabold flex items-center gap-0.5 transition-all hover:scale-110 shadow-sm cursor-pointer ${
                isSelected
                  ? "bg-amber-400 text-slate-950 ring-2 ring-white scale-105"
                  : p.isUpagraha
                  ? "bg-purple-950/90 text-purple-200 border border-purple-600/60 hover:border-purple-400"
                  : "bg-slate-800/95 text-amber-200 border border-slate-700 hover:border-amber-400/60"
              }`}
            >
              <span>{p.name}</span>
              {p.isRetro && <span className="text-[8px] text-red-400 font-extrabold">R</span>}
              <span className="text-[8px] opacity-75 font-mono">{Math.floor(p.deg)}°</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="glass-panel p-3.5 sm:p-5 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center">
      {/* Header controls */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2.5 mb-3 sm:mb-4">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-100 flex items-center gap-2">
            <span>☸</span> Traditional Kundli Chart
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Lagna: <span className="text-emerald-400 font-semibold">{ephemeris.ascendant.rashi.sanskritName}</span> (
            {Math.floor(ephemeris.ascendant.rashi.degreesInSign)}°) | {ephemeris.ascendant.nakshatra.sanskritName} Pada{" "}
            {ephemeris.ascendant.nakshatra.pada}
          </p>
        </div>

        {/* Chart Style Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setChartType("north")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              chartType === "north" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            North (Diamond)
          </button>
          <button
            onClick={() => setChartType("south")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              chartType === "south" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            South (Box)
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center bg-slate-950/70 rounded-2xl border border-slate-800/80 p-2 shadow-inner">
        {chartType === "north" ? (
          // North Indian Diamond Chart SVG with generous occupant boundaries
          <svg viewBox="0 0 400 400" className="w-full h-full text-slate-200">
            {/* Outer Box */}
            <rect x="5" y="5" width="390" height="390" fill="none" stroke="#334155" strokeWidth="2.5" />

            {/* Main Diagonal lines */}
            <line x1="5" y1="5" x2="395" y2="395" stroke="#475569" strokeWidth="1.8" />
            <line x1="395" y1="5" x2="5" y2="395" stroke="#475569" strokeWidth="1.8" />

            {/* Diamond inner lines */}
            <polygon points="200,5 395,200 200,395 5,200" fill="none" stroke="#f59e0b" strokeWidth="2" />

            {/* House Numbers, Sign numbers & Planet Overlays */}

            {/* House 1 (Top Center Diamond - Lagna) */}
            <text x="200" y="28" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(1)} (Lagna)
            </text>
            <foreignObject x="110" y="38" width="180" height="120" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(1)}</div>
            </foreignObject>

            {/* House 2 (Top Left Upper Triangle) */}
            <text x="120" y="24" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(2)}
            </text>
            <foreignObject x="15" y="25" width="170" height="85" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(2)}</div>
            </foreignObject>

            {/* House 3 (Left Top Outer Triangle) */}
            <text x="28" y="110" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(3)}
            </text>
            <foreignObject x="10" y="45" width="105" height="140" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(3)}</div>
            </foreignObject>

            {/* House 4 (Left Center Diamond - Sukha Bhava) */}
            <text x="75" y="165" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(4)}
            </text>
            <foreignObject x="25" y="130" width="150" height="140" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(4)}</div>
            </foreignObject>

            {/* House 5 (Left Bottom Outer Triangle) */}
            <text x="28" y="300" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(5)}
            </text>
            <foreignObject x="10" y="215" width="105" height="140" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(5)}</div>
            </foreignObject>

            {/* House 6 (Bottom Left Lower Triangle) */}
            <text x="120" y="386" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(6)}
            </text>
            <foreignObject x="15" y="290" width="170" height="85" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(6)}</div>
            </foreignObject>

            {/* House 7 (Bottom Center Diamond - Kalatra Bhava) */}
            <text x="200" y="386" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(7)}
            </text>
            <foreignObject x="110" y="242" width="180" height="120" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(7)}</div>
            </foreignObject>

            {/* House 8 (Bottom Right Lower Triangle) */}
            <text x="280" y="386" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(8)}
            </text>
            <foreignObject x="215" y="290" width="170" height="85" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(8)}</div>
            </foreignObject>

            {/* House 9 (Right Bottom Outer Triangle) */}
            <text x="372" y="300" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(9)}
            </text>
            <foreignObject x="285" y="215" width="105" height="140" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(9)}</div>
            </foreignObject>

            {/* House 10 (Right Center Diamond - Karma Bhava) */}
            <text x="325" y="165" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(10)}
            </text>
            <foreignObject x="225" y="130" width="150" height="140" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(10)}</div>
            </foreignObject>

            {/* House 11 (Right Top Outer Triangle) */}
            <text x="372" y="110" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(11)}
            </text>
            <foreignObject x="285" y="45" width="105" height="140" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(11)}</div>
            </foreignObject>

            {/* House 12 (Top Right Upper Triangle) */}
            <text x="280" y="24" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(12)}
            </text>
            <foreignObject x="215" y="25" width="170" height="85" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(12)}</div>
            </foreignObject>
          </svg>
        ) : (
          // South Indian Box Chart (4x4 Grid with hollow center)
          <div className="grid grid-cols-4 grid-rows-4 w-full h-full border-2 border-amber-500/80 text-xs">
            {[
              { rashiIdx: 11, col: "1", row: "1" },
              { rashiIdx: 0, col: "2", row: "1" },
              { rashiIdx: 1, col: "3", row: "1" },
              { rashiIdx: 2, col: "4", row: "1" },
              { rashiIdx: 10, col: "1", row: "2" },
              { rashiIdx: 3, col: "4", row: "2" },
              { rashiIdx: 9, col: "1", row: "3" },
              { rashiIdx: 4, col: "4", row: "3" },
              { rashiIdx: 8, col: "1", row: "4" },
              { rashiIdx: 7, col: "2", row: "4" },
              { rashiIdx: 6, col: "3", row: "4" },
              { rashiIdx: 5, col: "4", row: "4" },
            ].map(({ rashiIdx, col, row }) => {
              const rashi = RASHIS[rashiIdx];
              const houseNum = ((rashiIdx - ascRashiIndex + 12) % 12) + 1;
              const isLagna = rashiIdx === ascRashiIndex;

              return (
                <div
                  key={rashiIdx}
                  style={{ gridColumn: col, gridRow: row }}
                  className={`border border-slate-700/80 p-1 flex flex-col justify-between overflow-hidden ${
                    isLagna ? "bg-emerald-950/30 ring-1 ring-inset ring-emerald-500/50" : "bg-slate-900/40"
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-semibold">{rashi.sanskritName}</span>
                    {isLagna && (
                      <span className="text-[9px] font-extrabold px-1 bg-emerald-500 text-slate-950 rounded">
                        LAGNA
                      </span>
                    )}
                    <span className="text-slate-500">H{houseNum}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center my-0.5 overflow-visible">
                    {renderPlanetList(houseNum)}
                  </div>
                </div>
              );
            })}

            {/* Hollow Center */}
            <div className="col-start-2 col-span-2 row-start-2 row-span-2 border border-slate-800 bg-slate-950/80 flex flex-col items-center justify-center text-center p-2">
              <span className="text-xl text-amber-400">☸</span>
              <span className="text-xs font-bold text-slate-200 mt-1">Rashi Kundli</span>
              <span className="text-[10px] text-slate-400">{ephemeris.ayanamshaType} Ayanamsha</span>
            </div>
          </div>
        )}
      </div>

      {/* Classical Strength & Divisional Launchers */}
      <div className="mt-4 w-full max-w-[460px] grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          onClick={() => setViewMode("shodashavarga")}
          className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-[11px] transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.02] flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>✨</span>
          <span>16 Vargas (D1-D60)</span>
        </button>

        <button
          onClick={() => setViewMode("shadbala")}
          className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-[11px] transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 hover:scale-[1.02] flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>⚖️</span>
          <span>Shadbala (Planets)</span>
        </button>

        <button
          onClick={() => setViewMode("bhavabala")}
          className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-[11px] transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.02] flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>🏛️</span>
          <span>Bhava Bala (Houses)</span>
        </button>
      </div>
    </div>
  );
}