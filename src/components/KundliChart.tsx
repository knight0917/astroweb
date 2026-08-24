"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { RASHIS } from "../engine/constants";
import { calculateJaiminiKarakas, KarakaCode } from "../engine/jaimini";

export default function KundliChart() {
  const [chartType, setChartType] = useState<"north" | "south">("north");
  const [showKarakaTable, setShowKarakaTable] = useState(true);
  const {
    ephemeris,
    showModernPlanets,
    showUpagrahas,
    selectedEntityId,
    setSelectedEntityId,
    setViewMode,
  } = useAstroStore();

  const jaimini = useMemo(() => calculateJaiminiKarakas(ephemeris), [ephemeris]);

  const ascLon = ephemeris.ascendant.siderealLongitude;
  const ascRashiIndex = Math.floor(ascLon / 30); // 0 = Mesha, ..., 11 = Meena

  // Map each house (1..12) to the list of planets in it (memoized)
  const houseOccupants = useMemo(() => {
    const map: Record<
      number,
      { id: string; symbol: string; name: string; isRetro?: boolean; isUpagraha?: boolean; deg: number; karakaCode?: KarakaCode }[]
    > = {};
    for (let i = 1; i <= 12; i++) map[i] = [];

    // Add planets
    Object.values(ephemeris.planets).forEach((p) => {
      if (!showModernPlanets && p.isModernPlanet) return;
      const karaka = jaimini.planetToKaraka[p.id];
      map[p.house].push({
        id: p.id,
        symbol: p.symbol,
        name: p.name.substring(0, 2),
        isRetro: p.isRetrograde,
        deg: p.siderealLongitude % 30,
        karakaCode: karaka?.code,
      });
    });

    // Add Upagrahas if enabled
    if (showUpagrahas) {
      Object.values(ephemeris.upagrahas).forEach((u) => {
        map[u.house].push({
          id: u.id,
          symbol: "✦",
          name: u.name.substring(0, 2),
          isUpagraha: true,
          deg: u.siderealLongitude % 30,
        });
      });
    }

    return map;
  }, [ephemeris, showModernPlanets, showUpagrahas, jaimini]);

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
        ? "text-[8px] px-1 py-0.5"
        : count >= 3
        ? "text-[9px] px-1.5 py-0.5"
        : "text-[10.5px] px-2 py-0.5";

    return (
      <div className="flex flex-wrap gap-1 justify-center items-center w-full max-w-full p-0.5 overflow-visible">
        {list.map((p) => {
          const isSelected = selectedEntityId === p.id;
          const isAK = p.karakaCode === "AK";
          const isDK = p.karakaCode === "DK";

          return (
            <button
              key={p.id}
              onClick={() => setSelectedEntityId(p.id)}
              className={`${badgeStyle} rounded-md font-extrabold flex items-center gap-1 transition-all hover:scale-110 shadow-sm cursor-pointer ${
                isSelected
                  ? "bg-amber-400 text-slate-950 ring-2 ring-white scale-105"
                  : isAK
                  ? "bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-200 border border-amber-400/80 shadow-amber-500/20"
                  : isDK
                  ? "bg-gradient-to-r from-pink-500/30 to-rose-500/30 text-pink-200 border border-pink-400/80"
                  : p.isUpagraha
                  ? "bg-purple-950/90 text-purple-200 border border-purple-600/60 hover:border-purple-400"
                  : "bg-slate-800/95 text-amber-200 border border-slate-700 hover:border-amber-400/60"
              }`}
              title={p.karakaCode ? `${p.name}: ${jaimini.planetToKaraka[p.id]?.name} (${p.karakaCode})` : p.name}
            >
              <span>{p.name}</span>
              {p.isRetro && <span className="text-[7.5px] text-red-400 font-extrabold">R</span>}
              <span className="text-[7.5px] opacity-75 font-mono">{Math.floor(p.deg)}°</span>
              {p.karakaCode && (
                <span
                  className={`text-[7px] px-1 py-0.2 rounded font-mono font-black ${
                    isAK
                      ? "bg-amber-400 text-slate-950"
                      : isDK
                      ? "bg-pink-400 text-slate-950"
                      : "bg-slate-700 text-slate-200"
                  }`}
                >
                  {p.karakaCode}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="glass-panel p-3.5 sm:p-5 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center max-w-full">
      {/* Header controls */}
      <div className="w-full flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-base text-amber-400">☸</span>
          <span className="font-extrabold text-slate-200 text-sm">Traditional Kundli Chart</span>
        </div>

        {/* Chart Style Switcher */}
        <div className="flex bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-[11px] font-bold">
          <button
            onClick={() => setChartType("north")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              chartType === "north"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            North Indian (Diamond)
          </button>
          <button
            onClick={() => setChartType("south")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              chartType === "south"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            South Indian (Box)
          </button>
        </div>
      </div>

      {/* Lagna Banner */}
      <div className="w-full max-w-[460px] mb-3 flex items-center justify-between px-3 py-1.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-amber-400 font-bold">Lagna:</span>
          <span className="font-extrabold text-slate-100">{ephemeris.ascendant.rashi.englishName} ({ephemeris.ascendant.rashi.sanskritName})</span>
          <span className="font-mono text-amber-300 text-[11px]">{(ephemeris.ascendant.siderealLongitude % 30).toFixed(2)}°</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Nakshatra: <span className="text-slate-200 font-semibold">{ephemeris.ascendant.nakshatra.sanskritName}</span>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full max-w-[460px] aspect-square bg-slate-950 rounded-2xl border-2 border-slate-800/80 shadow-2xl p-2 flex items-center justify-center overflow-visible">
        {chartType === "north" ? (
          // North Indian Diamond Kundli (SVG)
          <svg viewBox="0 0 400 400" className="w-full h-full text-slate-200 select-none overflow-visible">
            {/* Outer Box */}
            <rect x="5" y="5" width="390" height="390" fill="none" stroke="#b45309" strokeWidth="2.5" />

            {/* Diagonal Cross (X) */}
            <line x1="5" y1="5" x2="395" y2="395" stroke="#78350f" strokeWidth="1.5" />
            <line x1="395" y1="5" x2="5" y2="395" stroke="#78350f" strokeWidth="1.5" />

            {/* Inner Diamond (Rhombus) */}
            <polygon points="200,5 395,200 200,395 5,200" fill="none" stroke="#d97706" strokeWidth="2" />

            {/* Central Diamond Inner Accent (Lagna / 1st House & 7th House) */}
            <polygon points="200,5 297.5,102.5 200,200 102.5,102.5" fill="#022c22" fillOpacity="0.3" />
            <polygon points="200,395 297.5,297.5 200,200 102.5,297.5" fill="#1e1b4b" fillOpacity="0.2" />

            {/* --- House 1 (Top Center Diamond - TANU / LAGNA) --- */}
            <text x="200" y="24" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(1)}
            </text>
            <text x="200" y="38" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="900" letterSpacing="1">
              LAGNA
            </text>
            <foreignObject x="110" y="42" width="180" height="120" className="overflow-visible">
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

            {/* House 7 (Bottom Center Diamond - Jaya / Kalatra Bhava) */}
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

      {/* JAIMINI CHARA KARAKAS (AK to DK) SECTION */}
      <div className="w-full max-w-[640px] mt-4 pt-3 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-sm">👑</span>
            <span className="font-extrabold text-xs text-slate-200 tracking-wide uppercase">
              Jaimini Chara Karakas (चर कारक • AK to DK)
            </span>
          </div>
          <button
            onClick={() => setShowKarakaTable(!showKarakaTable)}
            className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            {showKarakaTable ? "Hide Details" : "Show Details"}
          </button>
        </div>

        {showKarakaTable && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
            {jaimini.karakas.map((k) => {
              const isSelected = selectedEntityId === k.planetId;
              const isAK = k.code === "AK";
              const isDK = k.code === "DK";

              return (
                <button
                  key={k.code}
                  onClick={() => setSelectedEntityId(k.planetId)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-lg scale-105"
                      : isAK
                      ? "bg-amber-950/30 border-amber-500/60 hover:border-amber-400"
                      : isDK
                      ? "bg-pink-950/30 border-pink-500/60 hover:border-pink-400"
                      : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded font-mono ${
                        isAK
                          ? "bg-amber-400 text-slate-950"
                          : isDK
                          ? "bg-pink-400 text-slate-950"
                          : "bg-slate-800 text-slate-200 border border-slate-700"
                      }`}
                    >
                      {k.code}
                    </span>
                    <span className="text-xs" style={{ color: k.color }}>
                      {k.symbol}
                    </span>
                  </div>

                  <div className="font-bold text-xs text-slate-100 truncate">
                    {k.planetName}
                  </div>

                  <div className="text-[10px] text-amber-300/90 font-mono font-semibold">
                    {k.degreesInSign.toFixed(2)}°
                  </div>

                  <div className="text-[9px] text-slate-400 truncate mt-0.5">
                    {k.rashi.sanskritName} (H{k.house})
                  </div>

                  <div className="text-[8px] text-slate-500 line-clamp-1 mt-1 border-t border-slate-800/80 pt-0.5">
                    {k.lifeDomain}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Classical Strength & Divisional Launchers */}
      <div className="mt-3 w-full max-w-[460px] grid grid-cols-1 sm:grid-cols-3 gap-2">
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