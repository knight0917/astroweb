"use client";

import React, { useState } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { formatDMS } from "../engine/rashiNakshatra";

export default function PlanetIndexDeck() {
  const {
    ephemeris,
    selectedEntityId,
    setSelectedEntityId,
    showUpagrahas,
    showModernPlanets,
  } = useAstroStore();

  const [isOpen, setIsOpen] = useState(true);
  const [filterTab, setFilterTab] = useState<"all" | "navagraha" | "upagraha">("all");

  if (!ephemeris) return null;

  const planets = Object.values(ephemeris.planets).filter((p) => {
    if (p.isModernPlanet && !showModernPlanets) return false;
    return true;
  });

  const upagrahas = Object.values(ephemeris.upagrahas);

  const lagnaItems = [
    {
      id: "Ascendant",
      name: "Lagna",
      sanskritName: "Rising Sign",
      symbol: "ASC",
      color: "#10b981",
      siderealLongitude: ephemeris.ascendant.siderealLongitude,
      rashi: ephemeris.ascendant.rashi,
      nakshatra: ephemeris.ascendant.nakshatra,
      house: 1,
      isRetrograde: false,
      aspects: "7th",
    },
    {
      id: "Midheaven",
      name: "MC",
      sanskritName: "Madhya Lagna",
      symbol: "MC",
      color: "#f59e0b",
      siderealLongitude: ephemeris.midheaven.siderealLongitude,
      rashi: ephemeris.midheaven.rashi,
      nakshatra: ephemeris.midheaven.nakshatra,
      house: 10,
      isRetrograde: false,
      aspects: "7th",
    },
  ];

  return (
    <div className="flex items-start pointer-events-auto">
      {/* Collapsed Toggle Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Open Planet Index (Click any planet to turn 3D sky dome)"
          className="glass-panel p-2.5 rounded-xl border border-amber-500/50 text-amber-300 font-extrabold text-xs shadow-2xl flex items-center gap-1.5 hover:scale-105 transition-all cursor-pointer bg-slate-950/95"
        >
          <span className="text-base">🪐</span>
          <span className="hidden sm:inline">Planets Index</span>
          <span className="text-[10px] bg-amber-500/20 px-1 rounded text-amber-300 font-bold">
            {planets.length + 2 + (showUpagrahas ? upagrahas.length : 0)}
          </span>
        </button>
      )}

      {/* Expanded Vertical Sidebar */}
      {isOpen && (
        <div
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="side-dock deck-scrollable w-64 xl:w-72 max-w-[85vw] max-h-[calc(100vh-140px)] min-h-[340px] glass-panel rounded-2xl border border-slate-700/80 bg-slate-950/98 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200 relative z-50 backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <span className="text-base">🪐</span>
              <div>
                <h3 className="font-extrabold text-xs text-slate-100 uppercase tracking-wider">
                  Celestial Index
                </h3>
                <p className="text-[9px] text-amber-400 font-medium">Click planet to rotate 3D view</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              title="Minimize Index"
            >
              ✕
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-slate-800/80 bg-slate-950/50 p-1 gap-1 text-[10px]">
            <button
              onClick={() => setFilterTab("all")}
              className={`flex-1 py-1 rounded font-bold transition-colors cursor-pointer ${
                filterTab === "all"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterTab("navagraha")}
              className={`flex-1 py-1 rounded font-bold transition-colors cursor-pointer ${
                filterTab === "navagraha"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Navagrahas
            </button>
            {showUpagrahas && (
              <button
                onClick={() => setFilterTab("upagraha")}
                className={`flex-1 py-1 rounded font-bold transition-colors cursor-pointer ${
                  filterTab === "upagraha"
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Upagrahas
              </button>
            )}
          </div>

          {/* Scrollable Entity List */}
          <div
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar deck-scrollable divide-y divide-slate-800/40"
          >
            {/* 1. Lagna & MC */}
            {(filterTab === "all" || filterTab === "navagraha") && (
              <div className="space-y-1 pt-1 first:pt-0">
                <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider px-1">
                  Cardinal Points
                </span>
                {lagnaItems.map((item) => {
                  const isSelected = selectedEntityId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedEntityId(item.id)}
                      style={{
                        borderColor: isSelected ? item.color : "transparent",
                        backgroundColor: isSelected ? `${item.color}20` : undefined,
                      }}
                      className={`p-2 rounded-xl border transition-all cursor-pointer select-none group flex items-center justify-between hover:bg-slate-900/80 ${
                        !isSelected ? "border-slate-800/60 bg-slate-900/30" : "shadow-lg"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          style={{
                            color: item.color,
                            backgroundColor: `${item.color}20`,
                            borderColor: `${item.color}40`,
                          }}
                          className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs shadow-inner"
                        >
                          {item.symbol}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs text-slate-100">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({item.sanskritName})
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-300 flex items-center gap-1 font-mono">
                            <span>{item.rashi.symbol} {item.rashi.sanskritName}</span>
                            <span className="text-amber-300 font-bold">
                              {formatDMS(item.rashi.degreesInSign)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold font-mono block">
                          H{item.house}
                        </span>
                        <span className="text-[8px] text-slate-400 mt-0.5 block">
                          {item.nakshatra.animalSymbol} P{item.nakshatra.pada}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. Navagrahas & Modern Planets */}
            {(filterTab === "all" || filterTab === "navagraha") && (
              <div className="space-y-1 pt-2">
                <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider px-1">
                  Navagrahas & Planets
                </span>
                {planets.map((p) => {
                  const isSelected = selectedEntityId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedEntityId(p.id)}
                      style={{
                        borderColor: isSelected ? p.color : "transparent",
                        backgroundColor: isSelected ? `${p.color}20` : undefined,
                      }}
                      className={`p-2 rounded-xl border transition-all cursor-pointer select-none group flex items-center justify-between hover:bg-slate-900/80 ${
                        !isSelected ? "border-slate-800/60 bg-slate-900/30" : "shadow-lg"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          style={{
                            color: p.color,
                            backgroundColor: `${p.color}20`,
                            borderColor: `${p.color}40`,
                          }}
                          className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-sm shadow-inner group-hover:scale-105 transition-transform"
                        >
                          {p.symbol}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs text-slate-100">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ({p.sanskritName})
                            </span>
                            {p.isRetrograde && (
                              <span className="px-1 py-0.2 rounded bg-red-950 text-red-300 border border-red-800 text-[8px] font-bold">
                                R
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-300 flex items-center gap-1 font-mono">
                            <span>{p.rashi.symbol} {p.rashi.sanskritName}</span>
                            <span className="text-amber-300 font-bold">
                              {formatDMS(p.rashi.degreesInSign)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 font-bold font-mono border border-slate-800">
                          H{p.house}
                        </span>
                        <div className="flex items-center gap-1 text-[8.5px] text-purple-300 mt-0.5">
                          <span>{p.nakshatra.animalSymbol}</span>
                          <span className="truncate max-w-[70px]">{p.nakshatra.sanskritName}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. Upagrahas (Sub-planets) */}
            {showUpagrahas && (filterTab === "all" || filterTab === "upagraha") && (
              <div className="space-y-1 pt-2">
                <span className="text-[9px] font-extrabold text-purple-400 uppercase tracking-wider px-1">
                  Upagrahas (Sub-Planets)
                </span>
                {upagrahas.map((u) => {
                  const isSelected = selectedEntityId === u.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => setSelectedEntityId(u.id)}
                      style={{
                        borderColor: isSelected ? "#c084fc" : "transparent",
                        backgroundColor: isSelected ? "#c084fc20" : undefined,
                      }}
                      className={`p-2 rounded-xl border transition-all cursor-pointer select-none group flex items-center justify-between hover:bg-slate-900/80 ${
                        !isSelected ? "border-slate-800/60 bg-slate-900/30" : "shadow-lg"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-950/60 border border-purple-800/60 text-purple-300 flex items-center justify-center font-bold text-xs">
                          ✦
                        </div>
                        <div>
                          <div className="font-bold text-xs text-purple-200">
                            {u.name}
                          </div>
                          <div className="text-[9.5px] text-slate-400 font-mono">
                            {u.rashi.symbol} {u.rashi.sanskritName} ({formatDMS(u.rashi.degreesInSign)})
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] px-1 rounded bg-purple-950 text-purple-300 font-bold font-mono">
                          H{u.house}
                        </span>
                        <div className="text-[8px] text-slate-400 mt-0.5">
                          {u.nakshatra.animalSymbol} P{u.nakshatra.pada}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="p-2 border-t border-slate-800 bg-slate-950 text-center">
            <span className="text-[9px] text-slate-500">
              🎯 Click any planet above to rotate 3D camera
            </span>
          </div>
        </div>
      )}
    </div>
  );
}