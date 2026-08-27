"use client";

import React, { useState, useMemo } from "react";
import { calculateShodashavargaChart, VargaChartResult } from "../engine/shodashavarga";
import { EphemerisResult } from "../engine/types";
import { RASHIS } from "../engine/constants";

interface MatchmakingChartsDeckProps {
  boyEphem: EphemerisResult;
  girlEphem: EphemerisResult;
  boyName: string;
  girlName: string;
}

type ChartViewMode = "d1" | "d9" | "all";

function SingleKundliSvg({
  vargaChart,
  chartStyle,
  themeColor = "sky",
  title,
  subtitle,
}: {
  vargaChart: VargaChartResult;
  chartStyle: "north" | "south";
  themeColor?: "sky" | "pink" | "amber";
  title: string;
  subtitle: string;
}) {
  const ascRashiIndex = vargaChart.ascendant.vargaSignIndex;

  const getNorthRashiNum = (houseNum: number) => {
    return ((ascRashiIndex + (houseNum - 1)) % 12) + 1;
  };

  const renderPlanetList = (houseNum: number) => {
    const list = vargaChart.houseOccupants[houseNum] || [];
    if (list.length === 0) return null;

    const count = list.length;
    const badgeStyle =
      count >= 5
        ? "text-[7.5px] px-1 py-0.2"
        : count >= 3
        ? "text-[8.5px] px-1 py-0.5"
        : "text-[10px] px-1.5 py-0.5";

    return (
      <div className="flex flex-wrap gap-0.5 justify-center items-center w-full max-w-full p-0.5 overflow-visible">
        {list.map((p) => (
          <span
            key={p.id}
            className={`${badgeStyle} rounded font-black flex items-center gap-0.5 shadow-sm ${
              p.dignity === "Exalted"
                ? "bg-emerald-950/90 text-emerald-300 border border-emerald-500"
                : p.dignity === "Debilitated"
                ? "bg-rose-950/90 text-rose-300 border border-rose-500"
                : p.dignity === "Own Sign" || p.dignity === "Moolatrikona"
                ? "bg-amber-950/90 text-amber-300 border border-amber-500"
                : p.isVargottama
                ? "bg-cyan-950/90 text-cyan-300 border border-cyan-400"
                : themeColor === "pink"
                ? "bg-pink-950/80 text-pink-200 border border-pink-700/60"
                : themeColor === "sky"
                ? "bg-sky-950/80 text-sky-200 border border-sky-700/60"
                : "bg-slate-800 text-slate-200 border border-slate-700"
            }`}
            title={`${p.name} in ${p.vargaRashi.englishName} (${p.natalDegrees.toFixed(1)}°)`}
          >
            <span>{p.name.substring(0, 2)}</span>
            {p.dignity === "Exalted" && <span className="text-[7px] text-emerald-400 font-bold">▲</span>}
            {p.dignity === "Debilitated" && <span className="text-[7px] text-rose-400 font-bold">▼</span>}
            {p.isRetro && <span className="text-[7px] text-purple-400 font-bold">R</span>}
          </span>
        ))}
      </div>
    );
  };

  const borderColor =
    themeColor === "pink"
      ? "border-pink-500/40 shadow-pink-950/20"
      : themeColor === "sky"
      ? "border-sky-500/40 shadow-sky-950/20"
      : "border-amber-500/40 shadow-amber-950/20";

  const strokeColor =
    themeColor === "pink" ? "#ec4899" : themeColor === "sky" ? "#38bdf8" : "#f59e0b";

  return (
    <div className={`p-3 rounded-2xl bg-slate-950/90 border ${borderColor} shadow-xl flex flex-col items-center gap-2`}>
      {/* Title Header */}
      <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-1.5 px-1">
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-bold ${themeColor === "pink" ? "text-pink-400" : themeColor === "sky" ? "text-sky-400" : "text-amber-400"}`}>
            {title}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 font-bold">{subtitle}</span>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center p-1">
        {chartStyle === "north" ? (
          <svg viewBox="0 0 400 400" className="w-full h-full text-slate-200 select-none">
            <rect x="5" y="5" width="390" height="390" fill="none" stroke="#334155" strokeWidth="2" />
            <line x1="5" y1="5" x2="395" y2="395" stroke="#475569" strokeWidth="1.5" />
            <line x1="395" y1="5" x2="5" y2="395" stroke="#475569" strokeWidth="1.5" />
            <polygon points="200,5 395,200 200,395 5,200" fill="none" stroke={strokeColor} strokeWidth="2" />

            {/* House 1 (Lagna) */}
            <text x="200" y="28" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(1)} (Lag)
            </text>
            <foreignObject x="110" y="38" width="180" height="120" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(1)}</div>
            </foreignObject>

            {/* House 2 */}
            <text x="120" y="24" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(2)}
            </text>
            <foreignObject x="15" y="25" width="170" height="85" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(2)}</div>
            </foreignObject>

            {/* House 3 */}
            <text x="28" y="110" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(3)}
            </text>
            <foreignObject x="10" y="45" width="105" height="140" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(3)}</div>
            </foreignObject>

            {/* House 4 */}
            <text x="75" y="165" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(4)}
            </text>
            <foreignObject x="25" y="130" width="150" height="140" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(4)}</div>
            </foreignObject>

            {/* House 5 */}
            <text x="28" y="300" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(5)}
            </text>
            <foreignObject x="10" y="215" width="105" height="140" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(5)}</div>
            </foreignObject>

            {/* House 6 */}
            <text x="120" y="386" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(6)}
            </text>
            <foreignObject x="15" y="290" width="170" height="85" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(6)}</div>
            </foreignObject>

            {/* House 7 */}
            <text x="200" y="386" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(7)}
            </text>
            <foreignObject x="110" y="242" width="180" height="120" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(7)}</div>
            </foreignObject>

            {/* House 8 */}
            <text x="280" y="386" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(8)}
            </text>
            <foreignObject x="215" y="290" width="170" height="85" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(8)}</div>
            </foreignObject>

            {/* House 9 */}
            <text x="372" y="300" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(9)}
            </text>
            <foreignObject x="285" y="215" width="105" height="140" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(9)}</div>
            </foreignObject>

            {/* House 10 */}
            <text x="325" y="165" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(10)}
            </text>
            <foreignObject x="225" y="130" width="150" height="140" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(10)}</div>
            </foreignObject>

            {/* House 11 */}
            <text x="372" y="110" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(11)}
            </text>
            <foreignObject x="285" y="45" width="105" height="140" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(11)}</div>
            </foreignObject>

            {/* House 12 */}
            <text x="280" y="24" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" className="font-mono">
              {getNorthRashiNum(12)}
            </text>
            <foreignObject x="215" y="25" width="170" height="85" className="overflow-visible">
              <div className="h-full flex items-center justify-center">{renderPlanetList(12)}</div>
            </foreignObject>
          </svg>
        ) : (
          <div className="grid grid-cols-4 grid-rows-4 w-full h-full border-2 border-slate-700 text-xs">
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
                  className={`border border-slate-700/80 p-0.5 flex flex-col justify-between overflow-hidden ${
                    isLagna ? "bg-emerald-950/40 ring-1 ring-inset ring-emerald-500/50" : "bg-slate-900/40"
                  }`}
                >
                  <div className="flex justify-between items-center text-[8.5px]">
                    <span className="text-slate-400 font-semibold">{rashi.sanskritName}</span>
                    {isLagna && <span className="text-[7.5px] font-extrabold px-0.5 bg-emerald-500 text-slate-950 rounded">LAG</span>}
                    <span className="text-slate-500">H{houseNum}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center my-0.5 overflow-visible">
                    {renderPlanetList(houseNum)}
                  </div>
                </div>
              );
            })}

            <div className="col-start-2 col-span-2 row-start-2 row-span-2 border border-slate-800 bg-slate-950/90 flex flex-col items-center justify-center text-center p-1">
              <span className="text-xs font-bold text-slate-200">{title}</span>
              <span className="text-[9px] text-slate-400">{subtitle}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MatchmakingChartsDeck({
  boyEphem,
  girlEphem,
  boyName,
  girlName,
}: MatchmakingChartsDeckProps) {
  const [chartView, setChartView] = useState<ChartViewMode>("all");
  const [chartStyle, setChartStyle] = useState<"north" | "south">("north");

  const boyD1 = useMemo(() => calculateShodashavargaChart(boyEphem, "D1"), [boyEphem]);
  const boyD9 = useMemo(() => calculateShodashavargaChart(boyEphem, "D9"), [boyEphem]);
  const girlD1 = useMemo(() => calculateShodashavargaChart(girlEphem, "D1"), [girlEphem]);
  const girlD9 = useMemo(() => calculateShodashavargaChart(girlEphem, "D9"), [girlEphem]);

  return (
    <div className="glass-panel p-5 md:p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl text-amber-400">☸</span>
            <h3 className="text-sm md:text-base font-bold bg-gradient-to-r from-sky-300 via-pink-300 to-amber-300 bg-clip-text text-transparent uppercase tracking-wider">
              Groom & Bride Kundli Charts (वर-कन्या कुण्डली)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Visual Side-by-Side D1 Rashi & D9 Navamsha Comparative Astrological Deck
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Chart View Mode Tabs */}
          <div className="flex p-1 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-bold">
            <button
              onClick={() => setChartView("all")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                chartView === "all" ? "bg-amber-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All 4 Charts (Grid)
            </button>
            <button
              onClick={() => setChartView("d1")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                chartView === "d1" ? "bg-amber-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              D1 Rashi
            </button>
            <button
              onClick={() => setChartView("d9")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                chartView === "d9" ? "bg-amber-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              D9 Navamsha
            </button>
          </div>

          {/* North / South Style Toggle */}
          <div className="flex p-1 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-bold">
            <button
              onClick={() => setChartStyle("north")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                chartStyle === "north" ? "bg-sky-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              North Indian (Diamond)
            </button>
            <button
              onClick={() => setChartStyle("south")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                chartStyle === "south" ? "bg-sky-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              South Indian (Box)
            </button>
          </div>
        </div>
      </div>

      {/* Chart Render Deck */}
      {chartView === "all" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SingleKundliSvg
            vargaChart={boyD1}
            chartStyle={chartStyle}
            themeColor="sky"
            title={`♂ ${boyName} (D1 Rashi)`}
            subtitle={`Lagna: ${boyD1.ascendant.vargaRashi.englishName} (${(boyEphem.ascendant.siderealLongitude % 30).toFixed(1)}°)`}
          />
          <SingleKundliSvg
            vargaChart={boyD9}
            chartStyle={chartStyle}
            themeColor="sky"
            title={`♂ ${boyName} (D9 Navamsha)`}
            subtitle={`D9 Lagna: ${boyD9.ascendant.vargaRashi.englishName}`}
          />
          <SingleKundliSvg
            vargaChart={girlD1}
            chartStyle={chartStyle}
            themeColor="pink"
            title={`♀ ${girlName} (D1 Rashi)`}
            subtitle={`Lagna: ${girlD1.ascendant.vargaRashi.englishName} (${(girlEphem.ascendant.siderealLongitude % 30).toFixed(1)}°)`}
          />
          <SingleKundliSvg
            vargaChart={girlD9}
            chartStyle={chartStyle}
            themeColor="pink"
            title={`♀ ${girlName} (D9 Navamsha)`}
            subtitle={`D9 Lagna: ${girlD9.ascendant.vargaRashi.englishName}`}
          />
        </div>
      )}

      {chartView === "d1" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SingleKundliSvg
            vargaChart={boyD1}
            chartStyle={chartStyle}
            themeColor="sky"
            title={`♂ Groom: ${boyName} (D1 Rashi Chart)`}
            subtitle={`Ascendant: ${boyD1.ascendant.vargaRashi.englishName} (${(boyEphem.ascendant.siderealLongitude % 30).toFixed(2)}°) • Moon: ${boyEphem.planets.Moon.rashi.englishName}`}
          />
          <SingleKundliSvg
            vargaChart={girlD1}
            chartStyle={chartStyle}
            themeColor="pink"
            title={`♀ Bride: ${girlName} (D1 Rashi Chart)`}
            subtitle={`Ascendant: ${girlD1.ascendant.vargaRashi.englishName} (${(girlEphem.ascendant.siderealLongitude % 30).toFixed(2)}°) • Moon: ${girlEphem.planets.Moon.rashi.englishName}`}
          />
        </div>
      )}

      {chartView === "d9" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SingleKundliSvg
            vargaChart={boyD9}
            chartStyle={chartStyle}
            themeColor="sky"
            title={`♂ Groom: ${boyName} (D9 Navamsha Chart)`}
            subtitle={`D9 Lagna: ${boyD9.ascendant.vargaRashi.englishName} • Navamsha Spouse Factor`}
          />
          <SingleKundliSvg
            vargaChart={girlD9}
            chartStyle={chartStyle}
            themeColor="pink"
            title={`♀ Bride: ${girlName} (D9 Navamsha Chart)`}
            subtitle={`D9 Lagna: ${girlD9.ascendant.vargaRashi.englishName} • Navamsha Spouse Factor`}
          />
        </div>
      )}
    </div>
  );
}
