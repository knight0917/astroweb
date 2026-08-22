"use client";

import React, { useState } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { RASHIS } from "../engine/constants";

export default function KundliChart() {
  const [chartType, setChartType] = useState<"north" | "south">("north");
  const { ephemeris, showModernPlanets, showUpagrahas, selectedEntityId, setSelectedEntityId } =
    useAstroStore();

  const ascLon = ephemeris.ascendant.siderealLongitude;
  const ascRashiIndex = Math.floor(ascLon / 30); // 0 = Mesha, ..., 11 = Meena

  // Map each house (1..12) to the list of planets in it
  const houseOccupants: Record<number, { id: string; symbol: string; name: string; isRetro?: boolean; isUpagraha?: boolean; deg: number }[]> = {};
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

  // Helper to render planet badges inside house
  const renderPlanetList = (houseNum: number) => {
    const list = houseOccupants[houseNum] || [];
    if (list.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 justify-center items-center max-w-[90%]">
        {list.map((p) => {
          const isSelected = selectedEntityId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedEntityId(p.id)}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-0.5 transition-transform hover:scale-110 shadow-sm ${
                isSelected
                  ? "bg-amber-400 text-slate-950 ring-1 ring-white"
                  : p.isUpagraha
                  ? "bg-purple-950/80 text-purple-300 border border-purple-700/50"
                  : "bg-slate-800/90 text-amber-200 border border-slate-700"
              }`}
            >
              <span>{p.name}</span>
              {p.isRetro && <span className="text-[9px] text-red-400 font-extrabold">R</span>}
              <span className="text-[9px] opacity-70">{Math.floor(p.deg)}°</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center">
      {/* Header controls */}
      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-100 flex items-center gap-2">
            <span>☸</span> Traditional Kundli Chart
          </h3>
          <p className="text-xs text-slate-400">
            Lagna: <span className="text-emerald-400 font-semibold">{ephemeris.ascendant.rashi.sanskritName}</span> (
            {Math.floor(ephemeris.ascendant.rashi.degreesInSign)}°) | {ephemeris.ascendant.nakshatra.sanskritName} Pada{" "}
            {ephemeris.ascendant.nakshatra.pada}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setChartType("north")}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              chartType === "north" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            North Indian (Diamond)
          </button>
          <button
            onClick={() => setChartType("south")}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              chartType === "south" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            South Indian (Box)
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center bg-slate-950/60 rounded-xl border border-slate-800/80 p-2 shadow-inner">
        {chartType === "north" ? (
          // North Indian Diamond Chart SVG
          <svg viewBox="0 0 400 400" className="w-full h-full text-slate-200">
            {/* Outer Box */}
            <rect x="5" y="5" width="390" height="390" fill="none" stroke="#334155" strokeWidth="2.5" />

            {/* Main Diagonal lines */}
            <line x1="5" y1="5" x2="395" y2="395" stroke="#475569" strokeWidth="1.8" />
            <line x1="395" y1="5" x2="5" y2="395" stroke="#475569" strokeWidth="1.8" />

            {/* Diamond inner lines */}
            <line x1="200" y1="5" x2="5" y2="200" stroke="#f59e0b" strokeWidth="2" />
            <line x1="5" y1="200" x2="200" y2="395" stroke="#f59e0b" strokeWidth="2" />
            <line x1="200" y1="395" x2="395" y2="200" stroke="#f59e0b" strokeWidth="2" />
            <line x1="395" y1="200" x2="200" y2="5" stroke="#f59e0b" strokeWidth="2" />

            {/* House Numbers & Sign numbers & Planet Overlays */}
            {/* House 1 (Top Center Diamond) */}
            <text x="200" y="35" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">
              {getNorthRashiNum(1)} (Lagna)
            </text>
            <foreignObject x="130" y="45" width="140" height="80">
              <div className="h-full flex items-center justify-center">{renderPlanetList(1)}</div>
            </foreignObject>

            {/* House 2 (Top Left Triangle) */}
            <text x="120" y="30" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
              {getNorthRashiNum(2)}
            </text>
            <foreignObject x="30" y="30" width="100" height="60">
              <div className="h-full flex items-center justify-center">{renderPlanetList(2)}</div>
            </foreignObject>

            {/* House 3 (Left Top Triangle) */}
            <text x="30" y="120" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
              {getNorthRashiNum(3)}
            </text>
            <foreignObject x="15" y="110" width="80" height="60">
              <div className="h-full flex items-center justify-center">{renderPlanetList(3)}</div>
            </foreignObject>

            {/* House 4 (Left Center Diamond) */}
            <text x="70" y="200" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
              {getNorthRashiNum(4)}
            </text>
            <foreignObject x="25" y="170" width="110" height="60">
              <div className="h-full flex items-center justify-center">{renderPlanetList(4)}</div>
            </foreignObject>

            {/* House 5 (Left Bottom Triangle) */}
            <text x="30" y="280" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
              {getNorthRashiNum(5)}
            </text>
            <foreignObject x="15" y="260" width="80" height="60">
              <div className="h-full flex items-center justify-center">{renderPlanetList(5)}</div>
            </foreignObject>

            {/* House 6 (Bottom Left Triangle) */}
            <text x="120" y="375" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
              {getNorthRashiNum(6)}
            </text>
            <foreignObject x="30" y="310" width="100" height="60">
              <div className="h-full flex items-center justify-center">{renderPlanetList(6)}</div>
            </foreignObject>

            {/* House 7 (Bottom Center Diamond) */}
            <text x="200" y="375" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
              {getNorthRashiNum(7)}
            </text>
            <foreignObject x="130" y="275" width="140" height="80">
              <div className="h-full flex items-center justify-center">{renderPlanetList(7)}</div>
            </foreignObject>

            {/* House 8 (Bottom Right Triangle) */}
            <text x="280" y="375" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
              {getNorthRashiNum(8)}
            </text>
            <foreignObject x="270" y="310" width="100" height="60">
              <div className="h-full flex items-center justify-center">{renderPlanetList(8)}</div>
            </foreignObject>

            {/* House 9 (Right Bottom Triangle) */}
            <text x="370" y="280" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
              {getNorthRashiNum(9)}
            </text>
            <foreignObject x="305" y="260" width="80" height="60">
              <div className="h-full flex items-center justify-center">{renderPlanetList(9)}</div>
            </foreignObject>

            {/* House 10 (Right Center Diamond) */}
            <text x="330" y="200" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
              {getNorthRashiNum(10)}
            </text>
            <foreignObject x="265" y="170" width="110" height="60">
              <div className="h-full flex items-center justify-center">{renderPlanetList(10)}</div>
            </foreignObject>

            {/* House 11 (Right Top Triangle) */}
            <text x="370" y="120" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
              {getNorthRashiNum(11)}
            </text>
            <foreignObject x="305" y="110" width="80" height="60">
              <div className="h-full flex items-center justify-center">{renderPlanetList(11)}</div>
            </foreignObject>

            {/* House 12 (Top Right Triangle) */}
            <text x="280" y="30" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
              {getNorthRashiNum(12)}
            </text>
            <foreignObject x="270" y="30" width="100" height="60">
              <div className="h-full flex items-center justify-center">{renderPlanetList(12)}</div>
            </foreignObject>
          </svg>
        ) : (
          // South Indian Box Chart (4x4 Grid with hollow center)
          <div className="grid grid-cols-4 grid-rows-4 w-full h-full border-2 border-amber-500/80 text-xs">
            {/* South Indian layout maps:
                Row 1: Pisces(11), Aries(0), Taurus(1), Gemini(2)
                Row 2: Aquarius(10), [CENTER], [CENTER], Cancer(3)
                Row 3: Capricorn(9), [CENTER], [CENTER], Leo(4)
                Row 4: Sagittarius(8), Scorpio(7), Libra(6), Virgo(5)
            */}
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
                  className={`border border-slate-700/80 p-1 flex flex-col justify-between ${
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
                  <div className="flex-1 flex items-center justify-center my-0.5">{renderPlanetList(houseNum)}</div>
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
    </div>
  );
}
