"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateBenchmarkResonance, BENCHMARK_TITANS } from "../engine/benchmarkHoroscopes";
import { BenchmarkAnalysis, BenchmarkHoroscopeItem } from "../engine/types";

export default function BenchmarkHoroscopesDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"radar" | "titans" | "comparator">("radar");
  const [selectedTitanId, setSelectedTitanId] = useState<string>("vivekananda");

  const benchmarkReport: BenchmarkAnalysis = useMemo(() => evaluateBenchmarkResonance(ephemeris), [ephemeris]);

  const selectedTitan: BenchmarkHoroscopeItem = useMemo(() => {
    return BENCHMARK_TITANS.find((t) => t.id === selectedTitanId) || BENCHMARK_TITANS[0];
  }, [selectedTitanId]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <h2 className="text-lg font-bold text-slate-100">
              Empirical Benchmark Horoscopes & Archetypal Resonance Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Kala Empirical Research Database Mapping 21 Historical Titan Blueprints to Your Natal Chart.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Top Archetype</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🌟</span>
              <span>{benchmarkReport.topArchetype.category}</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Resonance Affinity</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>⚡</span>
              <span>{benchmarkReport.topArchetype.resonancePercentage}% Match</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/40 text-center">
            <div className="text-[9px] text-cyan-400 uppercase tracking-wider font-bold">Closest Titan</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>👑</span>
              <span>{benchmarkReport.topTitanMatch.name.split(" ")[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("radar")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "radar"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>🏛️</span>
          <span>Archetypal Resonance Radar</span>
        </button>

        <button
          onClick={() => setActiveTab("titans")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "titans"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>🌟</span>
          <span>Historical Titan Case Studies</span>
        </button>

        <button
          onClick={() => setActiveTab("comparator")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "comparator"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>🔬</span>
          <span>Side-by-Side Blueprint Comparator</span>
        </button>
      </div>

      {/* TAB 1: ARCHETYPAL RESONANCE RADAR */}
      {activeTab === "radar" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">🏛️</span>
            <div>
              <span className="font-bold text-amber-400">Karmic Archetype Resonance:</span> Evaluates how your planetary house configurations, kendras, and yogas align with historical archetypes to reveal your dominant societal purpose.
            </div>
          </div>

          {/* Archetypes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benchmarkReport.archetypes.map((arc) => (
              <div
                key={arc.category}
                className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100">{arc.category}</h3>
                  <span className="text-xs font-mono font-black text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    {arc.resonancePercentage}% Affinity
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${arc.resonancePercentage}%` }}
                  />
                </div>

                <div className="text-xs text-slate-300">
                  <strong className="text-amber-300">Closest Historical Titans:</strong> {arc.closestTitanMatch}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {arc.sharedAstrologicalBlueprint}
                </p>

                <p className="text-[11px] text-emerald-300/90 leading-relaxed">
                  ✨ <strong className="text-slate-200">Karmic Destiny:</strong> {arc.karmicTakeaway}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: HISTORICAL TITAN CASE STUDIES */}
      {activeTab === "titans" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">🌟</span>
            <div>
              <span className="font-bold text-emerald-400">Benchmark Titan Horoscopes:</span> Classical charts verified with exact birth data, planetary clusters, and major life achievements.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BENCHMARK_TITANS.map((titan) => (
              <div
                key={titan.id}
                className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{titan.name}</h3>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">{titan.category}</span>
                  </div>
                  <div className="text-right text-[10px] text-slate-400 font-mono">
                    <div>{titan.birthData.date}</div>
                    <div>{titan.birthData.place}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Lagna Sign:</span>
                    <span className="font-bold text-slate-200">{titan.lagnaSign}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Moon Sign:</span>
                    <span className="font-bold text-slate-200">{titan.moonSign}</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <span className="text-[10px] text-amber-300 font-bold uppercase block mb-1">Key Signature:</span>
                  {titan.keyPlanetarySignature}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {titan.paramountYogas.map((y) => (
                    <span key={y} className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      {y}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed italic">
                  🏆 "{titan.destinyMilestone}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SIDE-BY-SIDE BLUEPRINT COMPARATOR */}
      {activeTab === "comparator" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">🔬</span>
            <div>
              <span className="font-bold text-cyan-400">Blueprint Comparator:</span> Select any historical titan from the library to compare their structural chart foundation directly against your own.
            </div>
          </div>

          {/* Titan Selector */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {BENCHMARK_TITANS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTitanId(t.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedTitanId === t.id
                    ? "bg-cyan-500 text-slate-950 font-black shadow"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Comparative Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Chart */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Your Natal Blueprint</span>
              <h3 className="text-sm font-bold text-slate-100">Active User Horoscope</h3>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Key Placements:</span>
                Sun in H{ephemeris.planets.Sun?.house || 1}, Moon in H{ephemeris.planets.Moon?.house || 1}, Jupiter in H{ephemeris.planets.Jupiter?.house || 1}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Matches {benchmarkReport.topArchetype.resonancePercentage}% with {selectedTitan.category} archetype dynamics.
              </p>
            </div>

            {/* Selected Titan Chart */}
            <div className="bg-slate-900/60 border border-cyan-500/30 p-5 rounded-2xl flex flex-col gap-3">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Historical Titan Blueprint</span>
              <h3 className="text-sm font-bold text-slate-100">{selectedTitan.name} ({selectedTitan.category})</h3>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                <span className="text-[10px] text-cyan-300 font-bold uppercase block mb-1">Key Placements:</span>
                {selectedTitan.keyPlanetarySignature}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                🏆 {selectedTitan.destinyMilestone}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
