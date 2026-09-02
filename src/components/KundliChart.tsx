"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { RASHIS } from "../engine/constants";
import { calculateJaiminiKarakas, KarakaCode } from "../engine/jaimini";
import { calculateInduLagna, calculateBhagyaBindu } from "../engine/samirTripathiSuite";
import {
  AspectRay,
  calculateGrahaDrishtis,
  calculateRashiDrishtis,
  NORTH_HOUSE_CENTERS,
  NORTH_HOUSE_POLYGONS,
  SOUTH_RASHI_CENTERS,
} from "../engine/aspectRays";

export interface ActiveHoverEntity {
  id: string;
  name: string;
  fullName: string;
  house: number;
  rashiIndex: number;
  deg: number;
  isPlanet: boolean;
  pointType?: "IL" | "BB";
  color?: string;
}

function KundliChart() {
  const [chartType, setChartType] = useState<"north" | "south">("north");
  const [aspectMode, setAspectMode] = useState<"all" | "graha" | "rashi" | "off">("all");
  const [hoveredEntity, setHoveredEntity] = useState<ActiveHoverEntity | null>(null);
  const [lockedEntityId, setLockedEntityId] = useState<string | null>(null);
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
  const induLagna = useMemo(() => calculateInduLagna(ephemeris), [ephemeris]);
  const bhagyaBindu = useMemo(() => calculateBhagyaBindu(ephemeris), [ephemeris]);

  const ascLon = ephemeris.ascendant.siderealLongitude;
  const ascRashiIndex = Math.floor(ascLon / 30); // 0 = Mesha, ..., 11 = Meena

  // Map of all entities for quick ID lookup
  const allEntitiesMap = useMemo(() => {
    const map: Record<string, ActiveHoverEntity> = {};

    Object.values(ephemeris.planets).forEach((p) => {
      if (!showModernPlanets && p.isModernPlanet) return;
      const rIdx = Math.floor(p.siderealLongitude / 30);
      map[p.id] = {
        id: p.id,
        name: p.name.substring(0, 2),
        fullName: p.name,
        house: p.house,
        rashiIndex: rIdx,
        deg: p.siderealLongitude % 30,
        isPlanet: true,
      };
    });

    if (induLagna?.induLagnaHouseFromD1) {
      const rIdx = Math.floor(induLagna.induLagnaLongitude / 30);
      map["indu_lagna"] = {
        id: "indu_lagna",
        name: "IL",
        fullName: `Indu Lagna (${induLagna.induLagnaRashi.englishName})`,
        house: induLagna.induLagnaHouseFromD1,
        rashiIndex: rIdx,
        deg: induLagna.induLagnaLongitude % 30,
        isPlanet: false,
        pointType: "IL",
        color: "#f59e0b",
      };
    }

    if (bhagyaBindu?.house) {
      const rIdx = Math.floor(bhagyaBindu.longitude / 30);
      map["bhagya_bindu"] = {
        id: "bhagya_bindu",
        name: "BB",
        fullName: `Bhagya Bindu (${bhagyaBindu.rashi.englishName})`,
        house: bhagyaBindu.house,
        rashiIndex: rIdx,
        deg: bhagyaBindu.longitude % 30,
        isPlanet: false,
        pointType: "BB",
        color: "#10b981",
      };
    }

    if (showUpagrahas) {
      Object.values(ephemeris.upagrahas).forEach((u) => {
        const rIdx = Math.floor(u.siderealLongitude / 30);
        map[u.id] = {
          id: u.id,
          name: u.name.substring(0, 2),
          fullName: u.name,
          house: u.house,
          rashiIndex: rIdx,
          deg: u.siderealLongitude % 30,
          isPlanet: false,
          color: "#c084fc",
        };
      });
    }

    return map;
  }, [ephemeris, showModernPlanets, showUpagrahas, induLagna, bhagyaBindu]);

  // Determine the active entity for aspect projection
  const activeEntity: ActiveHoverEntity | null = useMemo(() => {
    if (hoveredEntity) return hoveredEntity;
    if (lockedEntityId && allEntitiesMap[lockedEntityId]) return allEntitiesMap[lockedEntityId];
    if (selectedEntityId && allEntitiesMap[selectedEntityId]) return allEntitiesMap[selectedEntityId];
    return null;
  }, [hoveredEntity, lockedEntityId, selectedEntityId, allEntitiesMap]);

  // Compute active aspect rays from active entity
  const activeAspectRays: AspectRay[] = useMemo(() => {
    if (!activeEntity || aspectMode === "off") return [];

    let rays: AspectRay[] = [];

    // 1. Graha Drishti (Planetary Aspects)
    if ((aspectMode === "all" || aspectMode === "graha") && activeEntity.isPlanet) {
      const grahaRays = calculateGrahaDrishtis(
        activeEntity.id,
        activeEntity.fullName,
        activeEntity.house,
        activeEntity.rashiIndex,
        ascRashiIndex
      );
      rays = rays.concat(grahaRays);
    }

    // 2. Rashi Drishti (Jaimini Sign Aspects)
    if (aspectMode === "all" || aspectMode === "rashi") {
      const rashiRays = calculateRashiDrishtis(
        activeEntity.fullName,
        activeEntity.rashiIndex,
        ascRashiIndex
      );
      rays = rays.concat(rashiRays);
    }

    return rays;
  }, [activeEntity, aspectMode, ascRashiIndex]);

  // Map of targeted houses to rays hitting them
  const aspectedHousesMap = useMemo(() => {
    const map: Record<number, AspectRay[]> = {};
    activeAspectRays.forEach((r) => {
      if (!map[r.toHouse]) map[r.toHouse] = [];
      map[r.toHouse].push(r);
    });
    return map;
  }, [activeAspectRays]);

  // Map each house (1..12) to the list of planets in it (memoized)
  const houseOccupants = useMemo(() => {
    const map: Record<
      number,
      {
        id: string;
        symbol: string;
        name: string;
        fullName: string;
        isRetro?: boolean;
        isUpagraha?: boolean;
        isSpecialPoint?: boolean;
        pointType?: "IL" | "BB";
        tooltip?: string;
        deg: number;
        rashiIndex: number;
        karakaCode?: KarakaCode;
      }[]
    > = {};
    for (let i = 1; i <= 12; i++) map[i] = [];

    // Add planets
    Object.values(ephemeris.planets).forEach((p) => {
      if (!showModernPlanets && p.isModernPlanet) return;
      const karaka = jaimini.planetToKaraka[p.id];
      const rIdx = Math.floor(p.siderealLongitude / 30);
      map[p.house].push({
        id: p.id,
        symbol: p.symbol,
        name: p.name.substring(0, 2),
        fullName: p.name,
        isRetro: p.isRetrograde,
        deg: p.siderealLongitude % 30,
        rashiIndex: rIdx,
        karakaCode: karaka?.code,
      });
    });

    // Add Indu Lagna (IL)
    if (induLagna && induLagna.induLagnaHouseFromD1) {
      const rIdx = Math.floor(induLagna.induLagnaLongitude / 30);
      map[induLagna.induLagnaHouseFromD1].push({
        id: "indu_lagna",
        symbol: "💰",
        name: "IL",
        fullName: `Indu Lagna (${induLagna.induLagnaRashi.englishName})`,
        isSpecialPoint: true,
        pointType: "IL",
        deg: induLagna.induLagnaLongitude % 30,
        rashiIndex: rIdx,
        tooltip: `Indu Lagna (IL - Moon-Ray Wealth): ${induLagna.induLagnaRashi.englishName} ${(induLagna.induLagnaLongitude % 30).toFixed(1)}° (${induLagna.wealthGrade})`,
      });
    }

    // Add Bhagya Bindu (BB)
    if (bhagyaBindu && bhagyaBindu.house) {
      const rIdx = Math.floor(bhagyaBindu.longitude / 30);
      map[bhagyaBindu.house].push({
        id: "bhagya_bindu",
        symbol: "🎯",
        name: "BB",
        fullName: `Bhagya Bindu (${bhagyaBindu.rashi.englishName})`,
        isSpecialPoint: true,
        pointType: "BB",
        deg: bhagyaBindu.longitude % 30,
        rashiIndex: rIdx,
        tooltip: `Bhagya Bindu (BB - Fortune Point): ${bhagyaBindu.rashi.englishName} ${(bhagyaBindu.longitude % 30).toFixed(1)}° in House ${bhagyaBindu.house} (${bhagyaBindu.nakshatra})`,
      });
    }

    // Add Upagrahas if enabled
    if (showUpagrahas) {
      Object.values(ephemeris.upagrahas).forEach((u) => {
        const rIdx = Math.floor(u.siderealLongitude / 30);
        map[u.house].push({
          id: u.id,
          symbol: "✦",
          name: u.name.substring(0, 2),
          fullName: u.name,
          isUpagraha: true,
          deg: u.siderealLongitude % 30,
          rashiIndex: rIdx,
        });
      });
    }

    return map;
  }, [ephemeris, showModernPlanets, showUpagrahas, jaimini, induLagna, bhagyaBindu]);

  // Helper to get Rashi number (1 to 12) for a given House in North Indian chart
  const getNorthRashiNum = (houseNum: number) => {
    return ((ascRashiIndex + (houseNum - 1)) % 12) + 1;
  };

  // Helper to render planet badges inside house with adaptive layout and hover beam triggers
  const renderPlanetList = (houseNum: number) => {
    const list = houseOccupants[houseNum] || [];
    if (list.length === 0) return null;

    const count = list.length;
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
          const isLocked = lockedEntityId === p.id;
          const isHovered = hoveredEntity?.id === p.id;
          const isSourceActive = isSelected || isLocked || isHovered;
          const isAK = p.karakaCode === "AK";
          const isDK = p.karakaCode === "DK";
          const isIL = p.pointType === "IL";
          const isBB = p.pointType === "BB";

          return (
            <button
              key={p.id}
              onMouseEnter={() =>
                setHoveredEntity({
                  id: p.id,
                  name: p.name,
                  fullName: p.fullName,
                  house: houseNum,
                  rashiIndex: p.rashiIndex,
                  deg: p.deg,
                  isPlanet: !p.isSpecialPoint && !p.isUpagraha,
                  pointType: p.pointType,
                })
              }
              onMouseLeave={() => setHoveredEntity(null)}
              onClick={() => {
                setSelectedEntityId(p.id);
                setLockedEntityId((prev) => (prev === p.id ? null : p.id));
              }}
              className={`${badgeStyle} rounded-md font-extrabold flex items-center gap-1 transition-all hover:scale-110 shadow-sm cursor-pointer ${
                isSourceActive
                  ? "bg-amber-400 text-slate-950 ring-2 ring-white scale-105 shadow-lg shadow-amber-500/50"
                  : isIL
                  ? "bg-gradient-to-r from-amber-600/50 to-yellow-500/50 text-amber-200 border border-amber-400 shadow-amber-500/20 font-black"
                  : isBB
                  ? "bg-gradient-to-r from-emerald-600/50 to-teal-500/50 text-emerald-200 border border-emerald-400 shadow-emerald-500/20 font-black"
                  : isAK
                  ? "bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-200 border border-amber-400/80 shadow-amber-500/20"
                  : isDK
                  ? "bg-gradient-to-r from-pink-500/30 to-rose-500/30 text-pink-200 border border-pink-400/80"
                  : p.isUpagraha
                  ? "bg-purple-950/90 text-purple-200 border border-purple-600/60 hover:border-purple-400"
                  : "bg-slate-800/95 text-amber-200 border border-slate-700 hover:border-amber-400/60"
              }`}
              title={p.tooltip || (p.karakaCode ? `${p.fullName}: ${jaimini.planetToKaraka[p.id]?.name} (${p.karakaCode})` : p.fullName)}
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
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-base text-amber-400 animate-spin-slow">☸</span>
          <div>
            <span className="font-extrabold text-slate-200 text-sm block leading-none">
              Interactive Kundli Chart
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">
              Live Graha & Rashi Aspect Beam Projection
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Aspect Mode Selector */}
          <div className="flex bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 text-[10.5px] font-bold">
            <button
              onClick={() => setAspectMode("all")}
              title="Visualize both Graha & Rashi Drishtis"
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                aspectMode === "all"
                  ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ✨ All Rays
            </button>
            <button
              onClick={() => setAspectMode("graha")}
              title="Planetary aspects (7th, 4th/8th Mars, 5th/9th Jupiter/Rahu/Ketu, 3rd/10th Saturn)"
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                aspectMode === "graha"
                  ? "bg-amber-500 text-slate-950 font-black shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ⚡ Graha
            </button>
            <button
              onClick={() => setAspectMode("rashi")}
              title="Jaimini sign aspects (Chara/Sthira/Dual)"
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                aspectMode === "rashi"
                  ? "bg-cyan-500 text-slate-950 font-black shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🌀 Rashi
            </button>
            <button
              onClick={() => setAspectMode("off")}
              title="Turn off aspect rays"
              className={`px-1.5 py-1 rounded-lg transition-all cursor-pointer ${
                aspectMode === "off"
                  ? "bg-slate-700 text-slate-200 font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              ✕
            </button>
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
              North (Diamond)
            </button>
            <button
              onClick={() => setChartType("south")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                chartType === "south"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              South (Box)
            </button>
          </div>
        </div>
      </div>

      {/* Lagna & Special Points Banner */}
      <div className="w-full max-w-[460px] mb-3 flex flex-col gap-1.5 px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800 text-xs shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">Lagna:</span>
            <span className="font-extrabold text-slate-100">
              {ephemeris.ascendant.rashi.englishName} ({ephemeris.ascendant.rashi.sanskritName})
            </span>
            <span className="font-mono text-amber-300 text-[11px]">
              {(ephemeris.ascendant.siderealLongitude % 30).toFixed(2)}°
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Nakshatra:{" "}
            <span className="text-slate-200 font-semibold">
              {ephemeris.ascendant.nakshatra.sanskritName}
            </span>
          </div>
        </div>

        {/* Indu Lagna (IL) & Bhagya Bindu (BB) Quick Indicators */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px] flex-wrap gap-1">
          <div className="flex items-center gap-1.5" title={induLagna?.wealthVerdict}>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/50 font-black text-[9.5px]">
              IL
            </span>
            <span className="text-slate-300 font-semibold">Indu Lagna:</span>
            <span className="text-amber-200 font-bold font-mono">
              {induLagna?.induLagnaRashi.englishName} (H{induLagna?.induLagnaHouseFromD1})
            </span>
          </div>
          <div className="flex items-center gap-1.5" title={bhagyaBindu?.significance}>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-black text-[9.5px]">
              BB
            </span>
            <span className="text-slate-300 font-semibold">Bhagya Bindu:</span>
            <span className="text-emerald-200 font-bold font-mono">
              {bhagyaBindu?.rashi.englishName} (H{bhagyaBindu?.house})
            </span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full max-w-[460px] aspect-square bg-slate-950 rounded-2xl border-2 border-slate-800/80 shadow-2xl p-2 flex items-center justify-center overflow-visible transform-gpu will-change-transform">
        {chartType === "north" ? (
          // North Indian Diamond Kundli (SVG)
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full text-slate-200 select-none overflow-visible transform-gpu"
          >
            <defs>
              {/* Laser Glow Filter */}
              <filter id="laserGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Aspected House Highlight Background Auras */}
            {Object.keys(aspectedHousesMap).map((hStr) => {
              const hNum = parseInt(hStr, 10);
              const raysOnHouse = aspectedHousesMap[hNum];
              const primaryColor = raysOnHouse[0]?.color || "#f59e0b";
              const polyPoints = NORTH_HOUSE_POLYGONS[hNum];
              if (!polyPoints) return null;

              return (
                <polygon
                  key={`highlight-${hNum}`}
                  points={polyPoints}
                  fill={primaryColor}
                  fillOpacity="0.16"
                  stroke={primaryColor}
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  className="transition-all duration-300 animate-pulse"
                />
              );
            })}

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

            {/* --- ACTIVE DRISHTI LASER RAYS (North Indian SVG Overlay) --- */}
            {activeAspectRays.map((ray, idx) => {
              const pFrom = NORTH_HOUSE_CENTERS[ray.fromHouse];
              const pTo = NORTH_HOUSE_CENTERS[ray.toHouse];
              if (!pFrom || !pTo) return null;

              const isGraha = ray.type === "graha";

              return (
                <g key={`ray-${ray.fromHouse}-${ray.toHouse}-${idx}`} className="pointer-events-none">
                  {/* Glowing Laser Beam */}
                  <line
                    x1={pFrom.x}
                    y1={pFrom.y}
                    x2={pTo.x}
                    y2={pTo.y}
                    stroke={ray.color}
                    strokeWidth={isGraha ? "2.8" : "2"}
                    strokeDasharray={isGraha ? "6 3" : "3 3"}
                    strokeLinecap="round"
                    filter="url(#laserGlow)"
                    className="animate-pulse"
                  />

                  {/* Impact Pulse Ring at Target Center */}
                  <circle
                    cx={pTo.x}
                    cy={pTo.y}
                    r="14"
                    fill={ray.color}
                    fillOpacity="0.25"
                    stroke={ray.color}
                    strokeWidth="1.5"
                    className="animate-ping"
                  />
                  <circle cx={pTo.x} cy={pTo.y} r="4.5" fill={ray.color} />

                  {/* Floating Aspect Badge on Target House */}
                  <g
                    transform={`translate(${pTo.x}, ${
                      pTo.y + (ray.toHouse === 1 || ray.toHouse === 2 || ray.toHouse === 12 ? 26 : -26)
                    })`}
                  >
                    <rect
                      x="-34"
                      y="-9"
                      width="68"
                      height="18"
                      rx="6"
                      fill="#020617"
                      fillOpacity="0.95"
                      stroke={ray.color}
                      strokeWidth="1.2"
                      className="shadow-lg"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill={ray.color}
                      fontSize="8"
                      fontWeight="900"
                      className="font-mono font-bold tracking-tight select-none"
                    >
                      {ray.aspectLabel.split(" ")[0]}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        ) : (
          // South Indian Box Chart (4x4 Grid with SVG Aspect Ray Overlay)
          <div className="relative w-full h-full border-2 border-amber-500/80 text-xs">
            <div className="grid grid-cols-4 grid-rows-4 w-full h-full">
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
                const isTargeted = !!aspectedHousesMap[houseNum];

                return (
                  <div
                    key={rashiIdx}
                    style={{ gridColumn: col, gridRow: row }}
                    className={`border border-slate-700/80 p-1 flex flex-col justify-between overflow-hidden transition-colors ${
                      isTargeted
                        ? "bg-amber-500/20 ring-2 ring-inset ring-amber-400"
                        : isLagna
                        ? "bg-emerald-950/30 ring-1 ring-inset ring-emerald-500/50"
                        : "bg-slate-900/40"
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
                <span className="text-xs font-bold text-slate-200">Rashi Kundli</span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {ephemeris.ayanamshaType} Ayanamsha
                </span>
              </div>
            </div>

            {/* South Indian SVG Laser Beams Overlay */}
            {activeAspectRays.length > 0 && (
              <svg
                viewBox="0 0 400 400"
                className="absolute inset-0 w-full h-full pointer-events-none overflow-visible select-none"
              >
                <defs>
                  <filter id="southLaserGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {activeAspectRays.map((ray, idx) => {
                  const pFrom = SOUTH_RASHI_CENTERS[ray.fromRashiIndex];
                  const pTo = SOUTH_RASHI_CENTERS[ray.toRashiIndex];
                  if (!pFrom || !pTo) return null;

                  const isGraha = ray.type === "graha";

                  return (
                    <g key={`south-ray-${idx}`}>
                      <line
                        x1={pFrom.x}
                        y1={pFrom.y}
                        x2={pTo.x}
                        y2={pTo.y}
                        stroke={ray.color}
                        strokeWidth={isGraha ? "2.8" : "2"}
                        strokeDasharray={isGraha ? "6 3" : "3 3"}
                        strokeLinecap="round"
                        filter="url(#southLaserGlow)"
                        className="animate-pulse"
                      />
                      <circle
                        cx={pTo.x}
                        cy={pTo.y}
                        r="14"
                        fill={ray.color}
                        fillOpacity="0.25"
                        stroke={ray.color}
                        strokeWidth="1.5"
                        className="animate-ping"
                      />
                      <circle cx={pTo.x} cy={pTo.y} r="4.5" fill={ray.color} />
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
        )}
      </div>

      {/* --- REAL-TIME ASPECT RAY HUD BANNER --- */}
      <div className="w-full max-w-[460px] mt-2.5 p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs shadow-md">
        {activeEntity && activeAspectRays.length > 0 ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="text-amber-400">⚡ Aspect Source:</span>
                <span className="text-slate-100 font-extrabold">{activeEntity.fullName}</span>
                <span className="text-[10px] text-slate-400">
                  in House {activeEntity.house} ({RASHIS[activeEntity.rashiIndex].englishName}) • {activeEntity.deg.toFixed(1)}°
                </span>
              </div>
              {lockedEntityId && (
                <button
                  onClick={() => setLockedEntityId(null)}
                  className="text-[9.5px] px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-700/60 hover:bg-rose-900 cursor-pointer"
                >
                  Unlock Ray
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {activeAspectRays.map((ray, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1"
                  style={{
                    backgroundColor: `${ray.color}18`,
                    borderColor: `${ray.color}60`,
                    color: ray.color,
                  }}
                >
                  <span>{ray.type === "graha" ? "⚡" : "🌀"}</span>
                  <span>{ray.aspectLabel}</span>
                  <span className="opacity-75">→ {ray.targetHouseName}</span>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span className="text-amber-400">💡</span>
            <span>
              <strong>Hover or tap</strong> on any of the <strong>9 Grahas</strong> (or Indu Lagna / Bhagya Bindu) to see live{" "}
              <strong className="text-amber-300">Graha</strong> &{" "}
              <strong className="text-cyan-300">Rashi</strong> aspect rays!
            </span>
          </div>
        )}
      </div>

      {/* JAIMINI CHARA KARAKAS (AK to DK) SECTION */}
      <div className="w-full max-w-[640px] mt-4 pt-3 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="font-bold text-xs text-slate-200 tracking-wide uppercase">
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
                  onMouseEnter={() => {
                    setHoveredEntity({
                      id: k.planetId,
                      name: k.planetName.substring(0, 2),
                      fullName: k.planetName,
                      house: k.house,
                      rashiIndex: k.rashi.index,
                      deg: k.degreesInSign,
                      isPlanet: true,
                    });
                  }}
                  onMouseLeave={() => setHoveredEntity(null)}
                  onClick={() => {
                    setSelectedEntityId(k.planetId);
                    setLockedEntityId((prev) => (prev === k.planetId ? null : k.planetId));
                  }}
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
          className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-amber-400 text-slate-100 font-bold text-[11px] transition-all shadow-sm cursor-pointer text-center"
        >
          16 Vargas (D1-D60)
        </button>

        <button
          onClick={() => setViewMode("shadbala")}
          className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-amber-400 text-slate-100 font-bold text-[11px] transition-all shadow-sm cursor-pointer text-center"
        >
          Shadbala (Planets)
        </button>

        <button
          onClick={() => setViewMode("bhavabala")}
          className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-amber-400 text-slate-100 font-bold text-[11px] transition-all shadow-sm cursor-pointer text-center"
        >
          Bhava Bala (Houses)
        </button>
      </div>
    </div>
  );
}

export default React.memo(KundliChart);
