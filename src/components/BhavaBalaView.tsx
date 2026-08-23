"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { calculateBhavaBala, HouseBala } from "../engine/bhavabala";

export default function BhavaBalaView() {
  const { ephemeris, selectedEntityId, setSelectedEntityId } = useAstroStore();

  const bhavaBalaResult = useMemo(() => {
    return calculateBhavaBala(ephemeris);
  }, [ephemeris]);

  const [activeHouseNum, setActiveHouseNum] = useState<number>(
    bhavaBalaResult.strongestHouse.houseNum
  );

  const activeHouse: HouseBala =
    bhavaBalaResult.houses[activeHouseNum] || bhavaBalaResult.strongestHouse;

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: "🥇", label: "1st (Strongest)", color: "bg-amber-500 text-slate-950 font-black" };
    if (rank === 2) return { icon: "🥈", label: "2nd", color: "bg-slate-300 text-slate-950 font-black" };
    if (rank === 3) return { icon: "🥉", label: "3rd", color: "bg-amber-700 text-slate-100 font-bold" };
    return { icon: `#${rank}`, label: `${rank}th`, color: "bg-slate-800 text-slate-300" };
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl text-amber-400">🏛️</span>
            <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Classical Parashari Bhava Bala (भावबल — 12 House Strengths System)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Brihat Parashara Hora Shastra (BPHS Ch. 28) • House Lord, Directional, Aspectual, and Day/Night Potencies
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-900/90 p-2 rounded-xl border border-slate-800 font-mono">
          <div className="text-right">
            <span className="text-slate-500 block text-[9px] uppercase font-bold">Chart Avg House Strength</span>
            <span className="font-extrabold text-amber-400 text-sm">
              {(bhavaBalaResult.averageStrengthRatio * 100).toFixed(0)}% (Ratio: {bhavaBalaResult.averageStrengthRatio})
            </span>
          </div>
        </div>
      </div>

      {/* Hero House Leaderboard (1st to 12th Rank Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>🏆</span>
            <span>12 House Potency Hierarchy (भाव क्रम Ranking)</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Click any house to inspect complete mathematical sub-factors</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {bhavaBalaResult.rankedHouses.map((h) => {
            const isSelected = activeHouseNum === h.houseNum;
            const rankBadge = getRankBadge(h.rank);
            const isStrong = h.isBalavan;

            return (
              <button
                key={h.houseNum}
                onClick={() => setActiveHouseNum(h.houseNum)}
                className={`glass-panel p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900/90 border-amber-400 shadow-lg shadow-amber-500/20 scale-105"
                    : "bg-slate-950/70 hover:bg-slate-900/60 border-slate-800"
                }`}
              >
                {/* Header: Rank + House Number */}
                <div className="flex items-center justify-between w-full">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${rankBadge.color}`}>
                    {rankBadge.icon}
                  </span>
                  <span className="font-mono text-xs font-black text-amber-400">
                    House {h.houseNum}
                  </span>
                </div>

                {/* House Title & Cusp Sign */}
                <div>
                  <span className="font-extrabold text-xs text-slate-100 block truncate">
                    {h.sanskritName.split(" ")[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {h.rashi.symbol} {h.rashi.englishName} ({h.lordName})
                  </span>
                </div>

                {/* Rupas vs Required */}
                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  <div className="flex justify-between text-[10.5px] font-mono font-bold">
                    <span className={isStrong ? "text-emerald-400" : "text-rose-400"}>
                      {h.totalRupas.toFixed(2)} R
                    </span>
                    <span className="text-slate-500 font-normal">/ {h.requiredRupas.toFixed(1)} R</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        h.strengthRatio >= 1.4
                          ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                          : h.isBalavan
                          ? "bg-emerald-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.min(100, h.percentageEfficiency)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-[9px] font-bold font-mono text-amber-300">
                      {h.percentageEfficiency}%
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

      {/* Main Grid: Master Comparison Matrix (7 cols) + Selected House Deep Dive (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Master 12-House Matrix Table (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span>📊</span>
              <span>Master Bhava Bala Matrix (Values in Rupas & Virupas)</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">1 Rupa = 60 Virupas</span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                  <th className="p-2.5 font-bold">Bhava</th>
                  <th className="p-2.5">Sign & Lord</th>
                  <th className="p-2.5 text-center">Lord (R)</th>
                  <th className="p-2.5 text-center">Dig</th>
                  <th className="p-2.5 text-center">Drishti</th>
                  <th className="p-2.5 text-center">Day/Nt</th>
                  <th className="p-2.5 text-right font-bold text-amber-300">Total (R)</th>
                  <th className="p-2.5 text-right">Req.</th>
                  <th className="p-2.5 text-right">Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bhavaBalaResult.rankedHouses.map((h) => {
                  const isSelected = activeHouseNum === h.houseNum;
                  return (
                    <tr
                      key={h.houseNum}
                      onClick={() => setActiveHouseNum(h.houseNum)}
                      className={`hover:bg-slate-900/60 cursor-pointer transition-colors ${
                        isSelected ? "bg-amber-500/15 font-bold" : ""
                      }`}
                    >
                      <td className="p-2.5 font-bold text-slate-200">
                        <span className="text-amber-400 mr-1">H{h.houseNum}</span>
                        <span className="text-slate-300 font-normal">{h.sanskritName.split(" ")[0]}</span>
                      </td>
                      <td className="p-2.5 text-slate-400">
                        {h.rashi.symbol} {h.rashi.englishName.substring(0, 3)} ({h.lordName.substring(0, 2)})
                      </td>
                      <td className="p-2.5 text-center text-slate-300">
                        {(h.bhavaadhipatiBala / 60).toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center text-slate-300">
                        {(h.bhavaDigBala / 60).toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center text-slate-300">
                        {h.bhavaDrishtiBala >= 0
                          ? `+${(h.bhavaDrishtiBala / 60).toFixed(2)}`
                          : (h.bhavaDrishtiBala / 60).toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center text-slate-300">
                        {(h.bhavaDinaRatriBala / 60).toFixed(2)}
                      </td>
                      <td className="p-2.5 text-right font-extrabold text-amber-300">
                        {h.totalRupas.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-right text-slate-400">
                        {h.requiredRupas.toFixed(1)}
                      </td>
                      <td className="p-2.5 text-right font-bold">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            h.isBalavan
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/50"
                              : "bg-rose-950 text-rose-300 border border-rose-500/50"
                          }`}
                        >
                          {h.strengthRatio.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Selected House Deep Dive Breakdown (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl text-amber-400 font-bold">H{activeHouse.houseNum}</span>
                  <h3 className="font-extrabold text-base text-slate-100">
                    {activeHouse.name}
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-amber-400 font-mono block mt-0.5">
                  {activeHouse.sanskritName} • Rank #{activeHouse.rank} of 12 Houses
                </span>
              </div>

              <div className="text-right font-mono">
                <span className="text-base font-black text-amber-300 block">{activeHouse.totalRupas.toFixed(2)} R</span>
                <span className="text-[9px] text-slate-400 font-bold">{activeHouse.totalVirupas.toFixed(1)} Virupas</span>
              </div>
            </div>

            {/* Life Significations Card */}
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[9px] font-extrabold text-amber-400 uppercase tracking-wider block">
                📜 Life Department & Portfolios:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {activeHouse.significations}
              </p>
            </div>

            {/* Sub-factor Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-200 block">1. Bhavaadhipati Bala (House Lord)</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Lord {activeHouse.lordName} ({activeHouse.rashi.englishName} Sign Lord)
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-300">
                  {activeHouse.bhavaadhipatiBala.toFixed(1)} V ({(activeHouse.bhavaadhipatiBala / 60).toFixed(2)} R)
                </span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-200 block">2. Bhava Dig Bala (Directional)</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Sign biological orientation on house cusp
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-300">
                  {activeHouse.bhavaDigBala.toFixed(1)} V ({(activeHouse.bhavaDigBala / 60).toFixed(2)} R)
                </span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-200 block">3. Bhava Drishti Bala (Aspects)</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Net Vedic Drishti aspects received on house
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-300">
                  {activeHouse.bhavaDrishtiBala >= 0 ? `+${activeHouse.bhavaDrishtiBala}` : activeHouse.bhavaDrishtiBala} V ({(activeHouse.bhavaDrishtiBala / 60).toFixed(2)} R)
                </span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-200 block">4. Bhava Dina-Ratri Bala</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Shirshodaya/Prishtodaya diurnal rising
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-300">
                  {activeHouse.bhavaDinaRatriBala.toFixed(1)} V ({(activeHouse.bhavaDinaRatriBala / 60).toFixed(2)} R)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}