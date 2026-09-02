"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import {
  calculateShodashavargaChart,
  VARGA_DEFINITIONS,
  VargaId,
} from "../engine/shodashavarga";
import { evaluateRashiTulyaNavamsha } from "../engine/rashiTulyaNavamsha";
import { calculateVedicEphemeris } from "../engine/ephemeris";
import { RASHIS } from "../engine/constants";

export type VargaViewId = VargaId | "RTN";

export default function ShodashavargaView() {
  const [selectedVarga, setSelectedVarga] = useState<VargaViewId>("D9");
  const [chartType, setChartType] = useState<"north" | "south">("north");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "Shadvarga" | "Saptavarga" | "Dashavarga" | "RTN">("ALL");

  const {
    ephemeris,
    location,
    ayanamsha,
    houseSystem,
    nodeType,
    showModernPlanets,
    showUpagrahas,
    selectedEntityId,
    setSelectedEntityId,
  } = useAstroStore();

  const isRtnMode = selectedVarga === "RTN";

  const transitEphemeris = useMemo(() => {
    return calculateVedicEphemeris(new Date(), location, ayanamsha, houseSystem, nodeType);
  }, [location, ayanamsha, houseSystem, nodeType]);

  const rtnResult = useMemo(() => {
    return evaluateRashiTulyaNavamsha(ephemeris, transitEphemeris);
  }, [ephemeris, transitEphemeris]);

  const vargaChart = useMemo(() => {
    const vId: VargaId = isRtnMode ? "D9" : (selectedVarga as VargaId);
    return calculateShodashavargaChart(ephemeris, vId, showUpagrahas, showModernPlanets);
  }, [ephemeris, selectedVarga, isRtnMode, showUpagrahas, showModernPlanets]);

  const allVargas = Object.values(VARGA_DEFINITIONS);

  const filteredVargas = useMemo(() => {
    if (categoryFilter === "ALL" || categoryFilter === "RTN") return allVargas;
    return allVargas.filter((v) => {
      if (categoryFilter === "Shadvarga") return v.category === "Shadvarga";
      if (categoryFilter === "Saptavarga") return v.category === "Shadvarga" || v.category === "Saptavarga";
      if (categoryFilter === "Dashavarga")
        return v.category === "Shadvarga" || v.category === "Saptavarga" || v.category === "Dashavarga";
      return true;
    });
  }, [categoryFilter, allVargas]);

  const ascRashiIndex = isRtnMode
    ? Math.floor(ephemeris.ascendant.siderealLongitude / 30)
    : vargaChart.ascendant.vargaSignIndex;

  const getNorthRashiNum = (houseNum: number) => {
    return ((ascRashiIndex + (houseNum - 1)) % 12) + 1;
  };

  // Map RTN occupants
  const rtnHouseOccupants = useMemo(() => {
    if (!isRtnMode) return {};
    const map: Record<number, typeof rtnResult.planets[string][]> = {};
    for (let i = 1; i <= 12; i++) map[i] = [];
    Object.values(rtnResult.planets).forEach((p) => {
      map[p.rtnHouseFromD1Lagna].push(p);
    });
    return map;
  }, [isRtnMode, rtnResult]);

  const renderPlanetList = (houseNum: number) => {
    if (isRtnMode) {
      const list = rtnHouseOccupants[houseNum] || [];
      if (list.length === 0) return null;

      const count = list.length;
      const badgeStyle =
        count >= 5
          ? "text-[8.5px] px-1 py-0.5"
          : count >= 3
          ? "text-[9.5px] px-1.5 py-0.5"
          : "text-[11px] px-2 py-0.5";

      return (
        <div className="flex flex-wrap gap-1 justify-center items-center w-full max-w-full p-1 overflow-visible">
          {list.map((p) => {
            const isSelected = selectedEntityId === p.planetId;
            return (
              <button
                key={p.planetId}
                onClick={() => setSelectedEntityId(p.planetId)}
                className={`${badgeStyle} rounded-md font-extrabold flex items-center gap-1 transition-all hover:scale-110 shadow-sm cursor-pointer ${
                  isSelected
                    ? "bg-amber-400 text-slate-950 ring-2 ring-white scale-105"
                    : p.isVargottama
                    ? "bg-gradient-to-r from-cyan-900/90 to-teal-900/90 text-cyan-200 border border-cyan-400 shadow-cyan-500/20 font-black"
                    : "bg-slate-900/90 text-amber-300 border border-amber-500/60 hover:border-amber-400"
                }`}
                title={p.rtnHouseSignificance}
              >
                <span>{p.planetName.substring(0, 2)}</span>
                <span className="text-[7.5px] px-1 py-0.2 rounded bg-slate-950/80 text-slate-300 font-mono">
                  {p.d9Rashi.englishName.substring(0, 2)}
                </span>
                {p.isVargottama && (
                  <span className="text-[8px] text-cyan-300 font-black" title="Vargottama (वर्गोत्तम)">
                    ★
                  </span>
                )}
                <span className="text-[8px] opacity-75 font-mono">
                  {Math.floor(p.d1Longitude % 30)}°
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    const list = vargaChart.houseOccupants[houseNum] || [];
    if (list.length === 0) return null;

    const count = list.length;
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
                  : p.dignity === "Exalted"
                  ? "bg-emerald-950/90 text-emerald-300 border-2 border-emerald-400 shadow-emerald-500/20"
                  : p.dignity === "Debilitated"
                  ? "bg-rose-950/90 text-rose-300 border-2 border-rose-500/80 shadow-rose-500/20"
                  : p.dignity === "Own Sign" || p.dignity === "Moolatrikona"
                  ? "bg-amber-950/90 text-amber-300 border border-amber-400/80"
                  : p.isVargottama
                  ? "bg-cyan-950/90 text-cyan-300 border border-cyan-400 shadow-cyan-500/20"
                  : p.isUpagraha
                  ? "bg-purple-950/90 text-purple-200 border border-purple-600/60 hover:border-purple-400"
                  : "bg-slate-800/95 text-amber-200 border border-slate-700 hover:border-amber-400/60"
              }`}
            >
              <span>{p.name.substring(0, 2)}</span>
              {p.dignity === "Exalted" && <span className="text-[8px] text-emerald-400 font-black" title="Exalted (उच्च)">▲</span>}
              {p.dignity === "Debilitated" && <span className="text-[8px] text-rose-400 font-black" title="Debilitated (नीच)">▼</span>}
              {p.isVargottama && <span className="text-[8px] text-cyan-400 font-black" title="Vargottama (वर्गोत्तम)">★</span>}
              {p.isRetro && <span className="text-[8px] text-purple-400 font-extrabold" title="Retrograde (वक्री)">R</span>}
              {p.isCombust && <span className="text-[8px] text-orange-400 font-bold" title="Combust (अस्त)">🔥</span>}
              <span className="text-[8px] opacity-75 font-mono">{Math.floor(p.natalDegrees)}°</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl text-amber-400">✨</span>
            <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Classical Parashari Shodashavarga (षोडशवर्ग / 16 Divisional Charts)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Brihat Parashara Hora Shastra (BPHS Ch. 6) • Precision Micro-Divisional Charts for Complete Karmic Verification
          </p>
        </div>

        {/* Category Filter Pills including Rashi Tulya Navamsha */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          {(["ALL", "Shadvarga", "Saptavarga", "Dashavarga", "RTN"] as const).map((cat) => {
            const isActive = categoryFilter === cat || (cat === "RTN" && isRtnMode);
            return (
              <button
                key={cat}
                onClick={() => {
                  setCategoryFilter(cat);
                  if (cat === "RTN") setSelectedVarga("RTN");
                  else if (isRtnMode) setSelectedVarga("D9");
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat === "RTN" && <span>🌸</span>}
                <span>
                  {cat === "ALL"
                    ? "All 16 Vargas"
                    : cat === "RTN"
                    ? "Rashi Tulya Navamsha (RTN)"
                    : `${cat}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 16-Varga Quick Selector Horizontal Carousel with Snap Scrolling */}
      <div className="glass-panel p-2.5 sm:p-3 rounded-2xl border border-slate-800 shadow-xl bg-slate-950/90 overflow-x-auto snap-scroll-x no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {/* Dedicated RTN Button in Carousel */}
          <button
            onClick={() => {
              setSelectedVarga("RTN");
              setCategoryFilter("RTN");
            }}
            className={`snap-item px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-start gap-0.5 border cursor-pointer ${
              isRtnMode
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/25 scale-105"
                : "bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 border-amber-600/40"
            }`}
          >
            <div className="flex items-center gap-1.5 w-full justify-between">
              <span className="font-extrabold text-sm flex items-center gap-1">
                <span>🌸</span>
                <span>RTN</span>
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                  isRtnMode ? "bg-slate-950 text-amber-300" : "bg-amber-900/80 text-amber-200"
                }`}
              >
                D1 ⮂ D9
              </span>
            </div>
            <span className="text-[10px] opacity-90 truncate max-w-[120px]">Rashi Tulya Nav.</span>
          </button>

          {filteredVargas.map((v) => {
            const isSelected = selectedVarga === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVarga(v.id)}
                className={`snap-item px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-start gap-0.5 border cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/25 scale-105"
                    : "bg-slate-900/70 hover:bg-slate-800/80 text-slate-300 border-slate-800"
                }`}
              >
                <div className="flex items-center gap-1.5 w-full justify-between">
                  <span className="font-extrabold text-sm">{v.id}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                      isSelected ? "bg-slate-950 text-amber-300" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    1/{v.divisionNumber}
                  </span>
                </div>
                <span className="text-[10px] opacity-90 truncate max-w-[120px]">{v.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Chart Canvas (Left) + Varga Deep Analysis & Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Varga Chart Canvas (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-3.5 sm:p-5 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 flex flex-col items-center">
          {/* Chart Header */}
          <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg text-amber-400">☸</span>
                <h3 className="font-extrabold text-slate-100 text-sm sm:text-base">
                  {isRtnMode
                    ? "🌸 Rashi Tulya Navamsha (RTN) — Cross-Varga Projection"
                    : `${vargaChart.varga.id} — ${vargaChart.varga.name} (${vargaChart.varga.sanskritName})`}
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                {isRtnMode ? (
                  <span>
                    D-1 Earthly Lagna:{" "}
                    <span className="text-emerald-400 font-bold font-mono">
                      {rtnResult.d1LagnaRashi.englishName} ({rtnResult.d1LagnaRashi.sanskritName})
                    </span>{" "}
                    • D-9 Soul Core:{" "}
                    <span className="text-amber-300 font-bold font-mono">
                      {rtnResult.d9LagnaRashi.englishName}
                    </span>
                  </span>
                ) : (
                  <span>
                    Varga Lagna:{" "}
                    <span className="text-emerald-400 font-bold font-mono">
                      {vargaChart.ascendant.vargaRashi.englishName} ({vargaChart.ascendant.vargaRashi.sanskritName})
                    </span>{" "}
                    • Division: {vargaChart.varga.spanDegrees.toFixed(2)}°
                  </span>
                )}
              </p>
            </div>

            {/* North/South Indian Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setChartType("north")}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  chartType === "north" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                North (Diamond)
              </button>
              <button
                onClick={() => setChartType("south")}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  chartType === "south" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                South (Box)
              </button>
            </div>
          </div>

          {/* RTN Special Banner */}
          {isRtnMode && (
            <div className="w-full mb-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-950/50 via-slate-900/80 to-purple-950/50 border border-amber-500/40 flex flex-wrap items-center justify-between gap-2 text-xs shadow-inner">
              <div className="flex items-center gap-2 text-amber-200">
                <span className="text-base">🌸</span>
                <span className="font-bold">Deva Keralam & C.S. Patel Cross-Varga Overlay:</span>
                <span className="text-slate-300">
                  D-9 Navamsha signs mapped directly onto D-1 Lagna houses.
                </span>
              </div>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-900/60 px-2 py-0.5 rounded-md border border-amber-500/40">
                Soul Fruit in Manifest Life
              </span>
            </div>
          )}

          {/* Vargottama Banner for D2..D60 */}
          {!isRtnMode && vargaChart.varga.id !== "D1" && vargaChart.vargottamaPlanets.length > 0 && (
            <div className="w-full mb-3 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span className="font-bold">Vargottama Grahas in {vargaChart.varga.id}:</span>
                <span className="font-mono font-extrabold text-emerald-200">
                  {vargaChart.vargottamaPlanets.join(", ")}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-500/40">
                Parashari Strength (वर्गोत्तम)
              </span>
            </div>
          )}

          {/* D1 Key Planetary Dignities Banner */}
          {!isRtnMode && vargaChart.varga.id === "D1" && (
            <div className="w-full mb-3 p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/40 flex flex-wrap items-center justify-between gap-2 text-xs shadow-inner">
              <div className="flex flex-wrap items-center gap-2 text-slate-200">
                <span className="text-amber-400 font-extrabold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                  <span>D1 Dignities & Avasthas:</span>
                </span>
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10.5px]">
                  {vargaChart.entities
                    .filter((e) => !e.isUpagraha && (e.dignity === "Exalted" || e.dignity === "Debilitated" || e.dignity === "Own Sign" || e.dignity === "Moolatrikona" || e.isRetro || e.isCombust))
                    .map((e) => (
                      <span
                        key={e.id}
                        className={`px-2 py-0.5 rounded-md font-bold border text-[10px] flex items-center gap-1 ${
                          e.dignity === "Exalted"
                            ? "bg-emerald-950/90 text-emerald-300 border-emerald-500"
                            : e.dignity === "Debilitated"
                            ? "bg-rose-950/90 text-rose-300 border-rose-500"
                            : e.dignity === "Own Sign" || e.dignity === "Moolatrikona"
                            ? "bg-amber-950/90 text-amber-300 border-amber-500/80"
                            : "bg-slate-800 text-slate-300 border-slate-700"
                        }`}
                      >
                        <span>{e.name}:</span>
                        <span>{e.dignity}</span>
                        {e.isRetro && <span className="text-purple-400 font-black">[R]</span>}
                        {e.isCombust && <span className="text-orange-400 font-bold text-[9px]">[C]</span>}
                      </span>
                    ))}
                </div>
              </div>
              <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30">
                Rashi Chakra (D1)
              </span>
            </div>
          )}

          {/* SVG Chart Renderer */}
          <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center bg-slate-950/80 rounded-2xl border border-slate-800/80 p-2 shadow-inner">
            {chartType === "north" ? (
              <svg viewBox="0 0 400 400" className="w-full h-full text-slate-200">
                <rect x="5" y="5" width="390" height="390" fill="none" stroke="#334155" strokeWidth="2.5" />
                <line x1="5" y1="5" x2="395" y2="395" stroke="#475569" strokeWidth="1.8" />
                <line x1="395" y1="5" x2="5" y2="395" stroke="#475569" strokeWidth="1.8" />
                <polygon points="200,5 395,200 200,395 5,200" fill="none" stroke="#f59e0b" strokeWidth="2" />

                {/* House 1 (Lagna) */}
                <text x="200" y="28" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold" className="font-mono">
                  {getNorthRashiNum(1)} (Lagna)
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

                <div className="col-start-2 col-span-2 row-start-2 row-span-2 border border-slate-800 bg-slate-950/80 flex flex-col items-center justify-center text-center p-2">
                  <span className="text-xl text-amber-400">☸</span>
                  <span className="text-xs font-bold text-slate-200 mt-1">
                    {isRtnMode ? "RTN Chart" : `${vargaChart.varga.id} Chart`}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isRtnMode ? "Rashi Tulya Navamsha" : vargaChart.varga.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Varga Planetary Details Table & Commentary (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* RTN Mode Right Dashboard */}
          {isRtnMode ? (
            <>
              {/* RTN Classical Framework Card */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🌸</span>
                    <span>Rashi Tulya Navamsha Classical Law</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-[10px] font-mono text-amber-300">
                    Deva Keralam & C.S. Patel
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  <strong>Rashi Tulya Navamsha (RTN)</strong> projects each planet's inner soul reality (D-9 Navamsha sign) directly onto your earthly D-1 houses. While D-1 represents your physical setup, RTN reveals where the true karma matures and produces real-world fruition.
                </p>

                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Earthly Anchor</span>
                    <span className="font-mono font-bold text-emerald-300">
                      D1 Lagna: {rtnResult.d1LagnaRashi.englishName}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Soul Anchor</span>
                    <span className="font-mono font-bold text-amber-300">
                      D9 Lagna: {rtnResult.d9LagnaRashi.englishName}
                    </span>
                  </div>
                </div>
              </div>

              {/* RTN Planetary Positions Table */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-3">
                <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span>🪐</span>
                  <span>RTN Manifestation Placements</span>
                </h4>

                <div className="overflow-x-auto custom-scrollbar max-h-[340px]">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80 sticky top-0">
                        <th className="p-2 font-bold">Graha</th>
                        <th className="p-2">D1 Sign</th>
                        <th className="p-2">D9 Nav.</th>
                        <th className="p-2 text-center">RTN House</th>
                        <th className="p-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {Object.values(rtnResult.planets).map((p) => {
                        const isSelected = selectedEntityId === p.planetId;
                        return (
                          <tr
                            key={p.planetId}
                            onClick={() => setSelectedEntityId(p.planetId)}
                            className={`hover:bg-slate-900/60 cursor-pointer transition-colors ${
                              isSelected ? "bg-amber-500/15 font-bold" : ""
                            }`}
                          >
                            <td className="p-2 font-bold text-slate-200">
                              {p.planetName}
                            </td>
                            <td className="p-2 text-slate-400">
                              {p.d1Rashi.englishName} (H{p.d1HouseFromLagna})
                            </td>
                            <td className="p-2 font-bold text-amber-300">
                              {p.d9Rashi.englishName}
                            </td>
                            <td className="p-2 text-center text-emerald-300 font-extrabold">
                              House {p.rtnHouseFromD1Lagna}
                            </td>
                            <td className="p-2 text-right">
                              {p.isVargottama ? (
                                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500 text-[9px] font-bold">
                                  ★ Vargottama
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-500">
                                  H{p.d9HouseFromD9Lagna} in D9
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RTN Conjunctions & Hidden Soul Bonds Card */}
              {rtnResult.rtnConjunctions.length > 0 && (
                <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 bg-slate-950/90 space-y-2">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🪢</span>
                    <span>RTN Conjunctions & Soul Synergy</span>
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    {rtnResult.rtnConjunctions.map((c) => (
                      <div key={c.houseNumber} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="font-bold text-amber-300">
                          House {c.houseNumber} ({c.rashi.englishName}): {c.planets.join(" + ")}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{c.interpretation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 64th Navamsha (Khara) Alert Card */}
              <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/90 space-y-2">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>64th Navamsha (Khara Navamsha) Integrity</span>
                </span>
                <div className="text-xs space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">From Moon (Khara Moon):</span>
                    <span className="font-mono font-bold text-amber-300">
                      {rtnResult.kharaNavamsha.moon64thNavamshaRashi.englishName} (RTN H{rtnResult.kharaNavamsha.moon64thRtnHouse})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">From Lagna (Khara Lagna):</span>
                    <span className="font-mono font-bold text-amber-300">
                      {rtnResult.kharaNavamsha.lagna64thNavamshaRashi.englishName} (RTN H{rtnResult.kharaNavamsha.lagna64thRtnHouse})
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-400 mt-1 font-medium bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                    {rtnResult.kharaNavamsha.kharaWarningSummary}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Standard Varga Significance Card */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">
                    📜 Classical Significance
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                    {vargaChart.varga.category}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {vargaChart.varga.significance}
                </p>

                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Division Arc</span>
                    <span className="font-mono font-bold text-amber-300">
                      {vargaChart.varga.spanDegrees.toFixed(3)}° (1/{vargaChart.varga.divisionNumber})
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Ruling Deities</span>
                    <span className="font-medium text-slate-200 truncate block" title={vargaChart.varga.deityGroup}>
                      {vargaChart.varga.deityGroup}
                    </span>
                  </div>
                </div>
              </div>

              {/* Standard Planetary Varga Positions Table */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-3">
                <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span>🪐</span>
                  <span>{vargaChart.varga.id} Planetary Placements</span>
                </h4>

                <div className="overflow-x-auto custom-scrollbar max-h-[380px]">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80 sticky top-0">
                        <th className="p-2 font-bold">Graha</th>
                        <th className="p-2">D1 Rashi</th>
                        <th className="p-2">{vargaChart.varga.id} Sign</th>
                        <th className="p-2 text-center">House</th>
                        <th className="p-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {vargaChart.entities.map((e) => {
                        const isSelected = selectedEntityId === e.id;
                        return (
                          <tr
                            key={e.id}
                            onClick={() => setSelectedEntityId(e.id)}
                            className={`hover:bg-slate-900/60 cursor-pointer transition-colors ${
                              isSelected ? "bg-amber-500/15 font-bold" : ""
                            }`}
                          >
                            <td className="p-2 font-bold text-slate-200 flex items-center gap-1">
                              <span className="text-amber-400">{e.symbol}</span>
                              <span>{e.name}</span>
                            </td>
                            <td className="p-2 text-slate-400">
                              {RASHIS[e.natalSignIndex].symbol} {RASHIS[e.natalSignIndex].englishName}
                            </td>
                            <td className="p-2 font-bold text-amber-300">
                              {e.vargaRashi.symbol} {e.vargaRashi.englishName}
                            </td>
                            <td className="p-2 text-center text-slate-300 font-bold">H{e.house}</td>
                            <td className="p-2 text-right">
                              <div className="flex flex-wrap items-center justify-end gap-1">
                                {e.statusBadges.map((badge, bIdx) => {
                                  let badgeColor = "bg-slate-800 text-slate-400 border-slate-700";
                                  if (badge.type === "exalted") {
                                    badgeColor = "bg-emerald-950/90 text-emerald-300 border-emerald-500 shadow-sm";
                                  } else if (badge.type === "debilitated") {
                                    badgeColor = "bg-rose-950/90 text-rose-300 border-rose-500 shadow-sm";
                                  } else if (badge.type === "own" || badge.type === "moolatrikona") {
                                    badgeColor = "bg-amber-950/90 text-amber-300 border-amber-500/80 shadow-sm";
                                  } else if (badge.type === "vargottama") {
                                    badgeColor = "bg-cyan-950/90 text-cyan-300 border-cyan-400 shadow-sm font-black";
                                  } else if (badge.type === "combust") {
                                    badgeColor = "bg-orange-950/90 text-orange-300 border-orange-500/80";
                                  } else if (badge.type === "retro") {
                                    badgeColor = "bg-purple-950/90 text-purple-300 border-purple-500/80 font-black";
                                  } else if (badge.type === "friend") {
                                    badgeColor = "bg-teal-950/60 text-teal-300 border-teal-600/40";
                                  } else if (badge.type === "enemy") {
                                    badgeColor = "bg-red-950/50 text-red-300 border-red-700/40";
                                  } else if (badge.type === "neutral") {
                                    badgeColor = "bg-slate-900/60 text-slate-400 border-slate-800";
                                  }

                                  return (
                                    <span
                                      key={bIdx}
                                      className={`px-1.5 py-0.5 rounded border text-[9px] font-bold tracking-tight ${badgeColor}`}
                                      title={badge.hindiLabel}
                                    >
                                      {badge.label}
                                    </span>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}