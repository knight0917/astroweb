"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluatePatelAshtakavarga } from "../engine/patelAshtakavarga";
import { PatelAshtakavargaAnalysis } from "../engine/types";

export default function PatelAshtakavargaDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"pindas" | "shodhana" | "kakshyas">("pindas");
  const [selectedPlanet, setSelectedPlanet] = useState<string>("Sun");

  const patelReport: PatelAshtakavargaAnalysis = useMemo(() => evaluatePatelAshtakavarga(ephemeris), [ephemeris]);

  const selectedReport = useMemo(() => {
    return patelReport.shodhyaPindas.find((p) => p.planetName === selectedPlanet) || patelReport.shodhyaPindas[0];
  }, [patelReport.shodhyaPindas, selectedPlanet]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📐</span>
            <h2 className="text-lg font-bold text-slate-100">
              C.S. Patel & Aiyar Ashtakavarga Shodhana Suite (1957)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete Trikona & Ekadhipatya Reductions, Precision Shodhya Pinda (Rashi/Graha Gunakaras) & 8 Kakshyas Radar.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Total Shodhya Pinda</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>💎</span>
              <span>{patelReport.sarvashtakaShodhyaPindaTotal} Points</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Top Karmic Planet</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>👑</span>
              <span>{patelReport.vitalPlanetaryPindas[0]?.planet}</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/40 text-center">
            <div className="text-[9px] text-cyan-400 uppercase tracking-wider font-bold">Active Kakshya</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🎯</span>
              <span>{patelReport.kakshyas.find((k) => k.currentTransitingPlanets.length > 0)?.governingLord || "Moon"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("pindas")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "pindas"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>💎</span>
          <span>Shodhya Pinda Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveTab("shodhana")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "shodhana"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>📐</span>
          <span>Trikona & Ekadhipatya Shodhana</span>
        </button>

        <button
          onClick={() => setActiveTab("kakshyas")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "kakshyas"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>🎯</span>
          <span>8 Kakshyas Micro-Transit Radar</span>
        </button>
      </div>

      {/* TAB 1: SHODHYA PINDA LEADERBOARD */}
      {activeTab === "pindas" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">💎</span>
            <div>
              <span className="font-bold text-emerald-400">Classical Shodhya Pinda (Rashi Pinda + Graha Pinda):</span> The concentrated essence of karmic yield remaining after complete Trikona and Ekadhipatya reductions.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {patelReport.shodhyaPindas.map((p) => (
              <div
                key={p.planetName}
                className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-slate-100">{p.planetName}</h3>
                  <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                    {p.shodhyaPinda} Pinda
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase block">Rashi Pinda</span>
                    <span className="font-bold text-slate-200">{p.rashiPinda}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase block">Graha Pinda</span>
                    <span className="font-bold text-slate-200">{p.grahaPinda}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-1">
                  ⏳ <strong>Ayurdaya Yield:</strong> ~{p.longevityAyurContributionYears} Longevity Units
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TRIKONA & EKADHIPATYA SHODHANA */}
      {activeTab === "shodhana" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">📐</span>
            <div>
              <span className="font-bold text-amber-400">Step-by-Step Reduction Matrix:</span> Select any planet to inspect its raw BAV bindus, post-Trikona Shodhana values, and final post-Ekadhipatya Shodhana bindus.
            </div>
          </div>

          {/* Planet Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {patelReport.shodhyaPindas.map((p) => (
              <button
                key={p.planetName}
                onClick={() => setSelectedPlanet(p.planetName)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedPlanet === p.planetName
                    ? "bg-amber-500 text-slate-950 font-black shadow"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {p.planetName}
              </button>
            ))}
          </div>

          {/* Shodhana Comparison Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="p-3">Reduction Stage</th>
                  {["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"].map((s) => (
                    <th key={s} className="p-3 text-center">{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-mono">
                <tr>
                  <td className="p-3 font-semibold text-slate-400 font-sans">1. Raw BAV Bindus</td>
                  {selectedReport.rawBindus.map((b, i) => (
                    <td key={i} className="p-3 text-center text-slate-300">{b}</td>
                  ))}
                </tr>
                <tr className="bg-amber-950/10">
                  <td className="p-3 font-semibold text-amber-400 font-sans">2. Trikona Reduced</td>
                  {selectedReport.trikonaReducedBindus.map((b, i) => (
                    <td key={i} className="p-3 text-center text-amber-300 font-bold">{b}</td>
                  ))}
                </tr>
                <tr className="bg-emerald-950/20">
                  <td className="p-3 font-semibold text-emerald-400 font-sans">3. Ekadhipatya Final</td>
                  {selectedReport.ekadhipatyaReducedBindus.map((b, i) => (
                    <td key={i} className="p-3 text-center text-emerald-300 font-black">{b}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: 8 KAKSHYAS MICRO-TRANSIT RADAR */}
      {activeTab === "kakshyas" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">🎯</span>
            <div>
              <span className="font-bold text-cyan-400">The 8 Kakshyas (3°45' Sub-Zones):</span> Every Rashi is divided into 8 equal $3^\circ 45'$ corridors. Transits through a Kakshya with an active bindu deliver immediate tangible manifestations.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {patelReport.kakshyas.map((k) => (
              <div
                key={k.kakshyaNumber}
                className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${
                  k.currentTransitingPlanets.length > 0
                    ? "bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/30"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">Kakshya #{k.kakshyaNumber}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{k.degreeSpan}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-100">{k.governingLord}</h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {k.transitActivationStatus}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
