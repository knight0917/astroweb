"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { calculateShadbala, ShadbalaPlanetId, PlanetShadbala } from "../engine/shadbala";

export default function ShadbalaView() {
  const { ephemeris, selectedEntityId, setSelectedEntityId } = useAstroStore();

  const shadbalaResult = useMemo(() => {
    return calculateShadbala(ephemeris);
  }, [ephemeris]);

  const [activePlanetId, setActivePlanetId] = useState<ShadbalaPlanetId>(
    (selectedEntityId as ShadbalaPlanetId) && shadbalaResult.planets[selectedEntityId as ShadbalaPlanetId]
      ? (selectedEntityId as ShadbalaPlanetId)
      : shadbalaResult.strongestPlanet.planetId
  );

  const activePlanet: PlanetShadbala = shadbalaResult.planets[activePlanetId] || shadbalaResult.strongestPlanet;

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: "🥇", label: "1st (Strongest)", color: "bg-amber-500 text-slate-950" };
    if (rank === 2) return { icon: "🥈", label: "2nd", color: "bg-slate-300 text-slate-950" };
    if (rank === 3) return { icon: "🥉", label: "3rd", color: "bg-amber-700 text-slate-100" };
    return { icon: `#${rank}`, label: `${rank}th`, color: "bg-slate-800 text-slate-300" };
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl text-amber-400">⚖️</span>
            <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Classical Parashari Shadbala (षड्बल — 6-Fold Planetary Strength System)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Brihat Parashara Hora Shastra (BPHS Ch. 27–29) • Sthana, Dig, Kala, Cheshta, Naisargika & Drik Balas
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-900/90 p-2 rounded-xl border border-slate-800 font-mono">
          <div className="text-right">
            <span className="text-slate-500 block text-[9px] uppercase font-bold">Chart Average Strength</span>
            <span className="font-extrabold text-amber-400 text-sm">
              {(shadbalaResult.averageStrengthRatio * 100).toFixed(0)}% (Ratio: {shadbalaResult.averageStrengthRatio})
            </span>
          </div>
        </div>
      </div>

      {/* Hero Rank Leaderboard Cards (7 Classical Grahas) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>🏆</span>
            <span>Planetary Strength Hierarchy (बल क्रम Ranking)</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Click any Graha to view full mathematical sub-factor breakdown</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {shadbalaResult.rankedPlanets.map((p) => {
            const isSelected = activePlanetId === p.planetId;
            const rankBadge = getRankBadge(p.rank);
            const isStrong = p.isBalavan;

            return (
              <button
                key={p.planetId}
                onClick={() => {
                  setActivePlanetId(p.planetId);
                  setSelectedEntityId(p.planetId);
                }}
                className={`glass-panel p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900/90 border-amber-400 shadow-lg shadow-amber-500/20 scale-105"
                    : "bg-slate-950/70 hover:bg-slate-900/60 border-slate-800"
                }`}
              >
                {/* Header: Rank + Symbol */}
                <div className="flex items-center justify-between w-full">
                  <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${rankBadge.color}`}>
                    {rankBadge.icon}
                  </span>
                  <span className="text-lg font-bold" style={{ color: p.color }}>
                    {p.symbol}
                  </span>
                </div>

                {/* Planet Names */}
                <div>
                  <div className="font-extrabold text-sm text-slate-100 flex items-center gap-1">
                    <span>{p.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{p.sanskritName}</span>
                </div>

                {/* Rupas vs Required */}
                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  <div className="flex justify-between text-[11px] font-mono font-bold">
                    <span className={isStrong ? "text-emerald-400" : "text-rose-400"}>
                      {p.totalRupas.toFixed(2)} R
                    </span>
                    <span className="text-slate-500 font-normal">/ {p.requiredRupas.toFixed(1)} R</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        p.strengthRatio >= 1.35
                          ? "bg-gradient-to-r from-emerald-400 to-amber-300 shadow-sm"
                          : p.isBalavan
                          ? "bg-emerald-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.min(100, p.percentageEfficiency)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-[9px] font-bold font-mono text-amber-300">
                      {p.percentageEfficiency}%
                    </span>
                    <span
                      className={`text-[8px] font-black uppercase px-1 rounded ${
                        isStrong ? "bg-emerald-950 text-emerald-400" : "bg-rose-950 text-rose-400"
                      }`}
                    >
                      {isStrong ? "BALAVAN" : "WEAK"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Master Comparison Matrix Table (7 cols) + Selected Planet Deep Dive (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Master 6-Bala Matrix Table (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span>📊</span>
              <span>Master Shadbala Matrix (Values in Rupas & Virupas)</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">1 Rupa = 60 Virupas</span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                  <th className="p-2.5 font-bold">Graha</th>
                  <th className="p-2.5 text-center">Sthana</th>
                  <th className="p-2.5 text-center">Dig</th>
                  <th className="p-2.5 text-center">Kala</th>
                  <th className="p-2.5 text-center">Cheshta</th>
                  <th className="p-2.5 text-center">Naisarg</th>
                  <th className="p-2.5 text-center">Drik</th>
                  <th className="p-2.5 text-right font-bold text-amber-300">Total (R)</th>
                  <th className="p-2.5 text-right">Req. (R)</th>
                  <th className="p-2.5 text-right">Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {shadbalaResult.rankedPlanets.map((p) => {
                  const isSelected = activePlanetId === p.planetId;
                  return (
                    <tr
                      key={p.planetId}
                      onClick={() => {
                        setActivePlanetId(p.planetId);
                        setSelectedEntityId(p.planetId);
                      }}
                      className={`hover:bg-slate-900/60 cursor-pointer transition-colors ${
                        isSelected ? "bg-amber-500/15 font-bold" : ""
                      }`}
                    >
                      <td className="p-2.5 font-bold text-slate-200 flex items-center gap-1.5">
                        <span style={{ color: p.color }}>{p.symbol}</span>
                        <span>{p.name}</span>
                      </td>
                      <td className="p-2.5 text-center text-slate-300">
                        {(p.sthanaBala.total / 60).toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center text-slate-300">
                        {(p.digBala / 60).toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center text-slate-300">
                        {(p.kalaBala.total / 60).toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center text-slate-300">
                        {(p.cheshtaBala / 60).toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center text-slate-400">
                        {(p.naisargikaBala / 60).toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center text-slate-300">
                        {p.drikBala >= 0 ? `+${(p.drikBala / 60).toFixed(2)}` : (p.drikBala / 60).toFixed(2)}
                      </td>
                      <td className="p-2.5 text-right font-extrabold text-amber-300">
                        {p.totalRupas.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-right text-slate-400">
                        {p.requiredRupas.toFixed(1)}
                      </td>
                      <td className="p-2.5 text-right font-bold">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            p.isBalavan
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/50"
                              : "bg-rose-950 text-rose-300 border border-rose-500/50"
                          }`}
                        >
                          {p.strengthRatio.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Selected Graha Deep Dive Breakdown (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-4">
            {/* Header: Selected Planet Info */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl font-bold border border-slate-700 bg-slate-900 shadow-inner"
                  style={{ color: activePlanet.color }}
                >
                  {activePlanet.symbol}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                    <span>{activePlanet.name}</span>
                    <span className="text-xs text-slate-400 font-normal">({activePlanet.sanskritName})</span>
                  </h3>
                  <span className="text-[10px] font-bold text-amber-400 font-mono">
                    Rank #{activePlanet.rank} of 7 Grahas • {activePlanet.statusText}
                  </span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-base font-black text-amber-300 block">{activePlanet.totalRupas.toFixed(2)} R</span>
                <span className="text-[9px] text-slate-400 font-bold">{activePlanet.totalVirupas.toFixed(1)} Virupas</span>
              </div>
            </div>

            {/* 6-Bala Detailed Sub-Factor Breakdown */}
            <div className="space-y-2.5 text-xs">
              {/* 1. Sthana Bala Card */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-200">1. Sthana Bala (स्थान बल / Positional)</span>
                  <span className="font-mono font-bold text-amber-300">
                    {activePlanet.sthanaBala.total.toFixed(1)} V ({(activePlanet.sthanaBala.total / 60).toFixed(2)} R)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 font-mono">
                  <div>• Uchcha (Exaltation): <span className="text-slate-200 font-bold">{activePlanet.sthanaBala.uchchaBala} V</span></div>
                  <div>• Saptavargaja (7 Vargas): <span className="text-slate-200 font-bold">{activePlanet.sthanaBala.saptavargajaBala} V</span></div>
                  <div>• Ojayugma (Odd/Even): <span className="text-slate-200 font-bold">{activePlanet.sthanaBala.ojayugmaBala} V</span></div>
                  <div>• Kendra (Angle): <span className="text-slate-200 font-bold">{activePlanet.sthanaBala.kendraBala} V</span></div>
                  <div>• Drekkana: <span className="text-slate-200 font-bold">{activePlanet.sthanaBala.drekkanaBala} V</span></div>
                </div>
              </div>

              {/* 2. Dig Bala Card */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-200 block">2. Dig Bala (दिग्बल / Directional)</span>
                  <span className="text-[10px] text-slate-400 font-medium">Angular proximity to cardinal cardinal apex</span>
                </div>
                <span className="font-mono font-bold text-amber-300">
                  {activePlanet.digBala.toFixed(1)} V ({(activePlanet.digBala / 60).toFixed(2)} R)
                </span>
              </div>

              {/* 3. Kala Bala Card */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-200">3. Kala Bala (काल बल / Temporal)</span>
                  <span className="font-mono font-bold text-amber-300">
                    {activePlanet.kalaBala.total.toFixed(1)} V ({(activePlanet.kalaBala.total / 60).toFixed(2)} R)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 font-mono">
                  <div>• Nathonnatha (Day/Night): <span className="text-slate-200 font-bold">{activePlanet.kalaBala.nathonnathaBala} V</span></div>
                  <div>• Paksha (Fortnight): <span className="text-slate-200 font-bold">{activePlanet.kalaBala.pakshaBala} V</span></div>
                  <div>• Tribhaga (3-Part): <span className="text-slate-200 font-bold">{activePlanet.kalaBala.tribhagaBala} V</span></div>
                  <div>• Period Lords (Vara/Hora): <span className="text-slate-200 font-bold">{activePlanet.kalaBala.varshaMasaDinaHoraBala} V</span></div>
                </div>
              </div>

              {/* 4. Cheshta Bala Card */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-200 block">4. Cheshta Bala (चेष्टा बल / Motional)</span>
                  <span className="text-[10px] text-slate-400 font-medium">Planetary speed & retrograde motion</span>
                </div>
                <span className="font-mono font-bold text-amber-300">
                  {activePlanet.cheshtaBala.toFixed(1)} V ({(activePlanet.cheshtaBala / 60).toFixed(2)} R)
                </span>
              </div>

              {/* 5. Naisargika Bala Card */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-200 block">5. Naisargika Bala (नैसर्गिक बल / Inherent)</span>
                  <span className="text-[10px] text-slate-400 font-medium">Natural solar luminosity hierarchy</span>
                </div>
                <span className="font-mono font-bold text-amber-300">
                  {activePlanet.naisargikaBala.toFixed(2)} V ({(activePlanet.naisargikaBala / 60).toFixed(2)} R)
                </span>
              </div>

              {/* 6. Drik Bala Card */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-200 block">6. Drik Bala (दृग्बल / Aspectual)</span>
                  <span className="text-[10px] text-slate-400 font-medium">Net benefic/malefic Vedic Drishti aspects</span>
                </div>
                <span className="font-mono font-bold text-amber-300">
                  {activePlanet.drikBala >= 0 ? `+${activePlanet.drikBala}` : activePlanet.drikBala} V ({(activePlanet.drikBala / 60).toFixed(2)} R)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}