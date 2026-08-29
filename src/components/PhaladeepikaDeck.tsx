"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluatePhaladeepika } from "../engine/phaladeepika";
import { PhaladeepikaAnalysis } from "../engine/types";

export default function PhaladeepikaDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"viparita" | "neechabhanga" | "avasthas" | "bhavas">("viparita");
  const [selectedBhavaNum, setSelectedBhavaNum] = useState<number>(1);

  const report: PhaladeepikaAnalysis = useMemo(() => {
    return evaluatePhaladeepika(ephemeris);
  }, [ephemeris]);

  const activeBhava = report.bhavaMastery.find((b) => b.bhavaNum === selectedBhavaNum) || report.bhavaMastery[0];
  const activeViparitaCount = report.viparitaRajaYogas.filter((v) => v.isFormed).length;
  const topAvasthasCount = report.planetaryAvasthas.filter((a) => a.potencyPercentage >= 80).length;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h2 className="text-lg font-bold text-slate-100">
              Acharya Mantreswara's Phaladeepika (फलदीपिका - 28 Adhyayas)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Definitive Classical Authority: Viparita Raja Yogas (Harsha, Sarala, Vimala), 5-Fold Neecha Bhanga & 9 Planetary Avasthas.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-cyan-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/40 text-center">
            <div className="text-[9px] text-cyan-400 uppercase tracking-wider font-bold">Viparita Raja Yogas</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>⚡</span>
              <span>{activeViparitaCount} / 3 Formed</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-purple-500/40 text-center">
            <div className="text-[9px] text-purple-400 uppercase tracking-wider font-bold">High Potency Avasthas</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🪐</span>
              <span>{topAvasthasCount} / 9 Grahas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Phaladeepika Card */}
      <div className="bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 p-5 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              28 Adhyayas Master Synthesis (मन्त्रेश्वर फलदीपिका महाफल)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Apex Diagnostic: {report.viparitaRajaYogas.find((v) => v.isFormed)?.sanskritName || "Mantreswara Phaladeepika"}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterPhaladeepikaSynthesis}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-cyan-400 uppercase font-bold block">Top Planetary Avastha:</span>
            <span className="text-xs font-black text-slate-100 block mt-0.5">
              {report.planetaryAvasthas.sort((a, b) => b.potencyPercentage - a.potencyPercentage)[0].planetName}: {report.planetaryAvasthas.sort((a, b) => b.potencyPercentage - a.potencyPercentage)[0].avasthaName}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Neecha Bhanga Status:</span>
            <span className="text-xs font-bold text-emerald-300 block mt-0.5">
              {report.neechaBhangaYogas.length > 0 ? report.neechaBhangaYogas[0].rajaYogaGrade : "No Debilitated Grahas (Purna Bala)"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("viparita")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "viparita"
              ? "bg-cyan-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⚡ Viparita Raja Yogas
        </button>
        <button
          onClick={() => setActiveTab("neechabhanga")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "neechabhanga"
              ? "bg-cyan-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          👑 5-Fold Neecha Bhanga
        </button>
        <button
          onClick={() => setActiveTab("avasthas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "avasthas"
              ? "bg-cyan-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🪐 9 Planetary Avasthas
        </button>
        <button
          onClick={() => setActiveTab("bhavas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "bhavas"
              ? "bg-cyan-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🏛️ 12 Bhavas Phaladeepika Matrix
        </button>
      </div>

      {/* TAB 1: VIPARITA RAJA YOGAS */}
      {activeTab === "viparita" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Mantreswara Viparita Raja Yogas (Adhyaya 6, Shloka 63)</h4>
            <p className="text-xs text-slate-400">
              Dusthana lords stationed in other Dusthanas (6, 8, 12) destroy afflictions and unlock immense sudden wealth and power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.viparitaRajaYogas.map((yoga, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                  yoga.isFormed
                    ? "bg-slate-950 border-cyan-500/40 shadow-xl ring-1 ring-cyan-500/30"
                    : "bg-slate-950/50 border-slate-800 opacity-70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                        House {yoga.houseLord} Lord in House {yoga.placementHouse}
                      </span>
                      <h4 className="text-sm font-black text-slate-100 mt-0.5">{yoga.sanskritName}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                        yoga.isFormed
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : "bg-slate-900 text-slate-400 border-slate-800"
                      }`}
                    >
                      {yoga.isFormed ? "FORMED" : "DORMANT"}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold">Lord Planet:</span>
                      <span className="text-cyan-300 font-semibold ml-1.5">{yoga.planetName}</span>
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {yoga.description}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-200 italic">
                  <strong className="text-cyan-300 not-italic block mb-0.5">📜 Mantreswara Shloka Phala:</strong>
                  {yoga.classicalShlokaEffect}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: 5-FOLD NEECHA BHANGA */}
      {activeTab === "neechabhanga" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">5-Fold Neecha Bhanga Raja Yoga Engine (Adhyaya 6, Shlokas 26–30)</h4>
            <p className="text-xs text-slate-400">
              Classical cancellation formulas transmuting planetary debility into imperial prominence.
            </p>
          </div>

          {report.neechaBhangaYogas.length === 0 ? (
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
              No planets are debilitated in the natal chart; all Grahas retain natural or dignified strength.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.neechaBhangaYogas.map((nb, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">
                          {nb.debilitatedPlanet} in {nb.debilitatedSign}
                        </span>
                        <h4 className="text-sm font-black text-slate-100 mt-0.5">{nb.rajaYogaGrade}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        nb.isCancelled ? "bg-emerald-950 text-emerald-300 border-emerald-800" : "bg-rose-950 text-rose-300 border-rose-800"
                      }`}>
                        {nb.isCancelled ? "Neecha Bhanga Active" : "Uncancelled"}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <strong className="text-slate-400 block">Cancellation Conditions Fulfilled:</strong>
                      {nb.cancellationConditionsMet.map((c, cIdx) => (
                        <div key={cIdx} className="text-emerald-300 text-[11px] flex items-center gap-1.5">
                          <span>✓</span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-200">
                    <strong className="text-cyan-300 block mb-0.5">📜 Mantreswara Phala:</strong>
                    {nb.classicalPhala}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: 9 PLANETARY AVASTHAS */}
      {activeTab === "avasthas" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">9 Classical Planetary Avasthas (Adhyaya 3)</h4>
            <p className="text-xs text-slate-400">
              Mantreswara's 9-fold planetary dignity diagnostics: Deepta (Exalted), Svastha (Own sign), Shakta (Retrograde), etc.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.planetaryAvasthas.map((avastha, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-black text-slate-100">{avastha.planetName}</h4>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {avastha.potencyPercentage}%
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-xs">
                    <div className="text-cyan-300 font-bold">{avastha.sanskritName}</div>
                    <div className="text-[10px] text-slate-400">{avastha.avasthaName}</div>
                  </div>
                </div>

                <div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-200">
                    {avastha.functionalEffect}
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-1 mt-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1 rounded-full transition-all"
                      style={{ width: `${avastha.potencyPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: 12 BHAVAS PHALADEEPIKA MATRIX */}
      {activeTab === "bhavas" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bhava Selector */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Select House (भाव) for Phaladeepika Phala
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {report.bhavaMastery.map((b) => {
                const isSelected = selectedBhavaNum === b.bhavaNum;
                const isUttama = b.masteryGrade.includes("Uttama");
                return (
                  <div
                    key={b.bhavaNum}
                    onClick={() => setSelectedBhavaNum(b.bhavaNum)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-cyan-600/20 border-cyan-400 shadow-lg ring-1 ring-cyan-400"
                        : "bg-slate-950/60 border-slate-800 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-100">House {b.bhavaNum}</span>
                      <span
                        className={`text-[9px] font-bold px-1 rounded ${
                          isUttama ? "bg-cyan-950 text-cyan-300 border border-cyan-800" : "text-slate-400"
                        }`}
                      >
                        {b.phaladeepikaScore}%
                      </span>
                    </div>
                    <div className="text-[10px] text-cyan-300 font-semibold truncate mt-1">
                      {b.sanskritTitle.split(" ")[0]}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">
                      Lord: {b.lordName} in H{b.lordPlacementHouse}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Bhava Inspector */}
          <div className="lg:col-span-2 bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
                  {activeBhava.adhyayaCitation}
                </span>
                <h4 className="text-base font-black text-slate-100 mt-0.5">
                  House {activeBhava.bhavaNum}: {activeBhava.sanskritTitle}
                </h4>
                <div className="text-xs text-cyan-300 font-medium mt-0.5">
                  Sign: {activeBhava.signName} • Lord: {activeBhava.lordName} in House {activeBhava.lordPlacementHouse}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Mastery Grade</span>
                <span className="text-xs font-black text-cyan-300">{activeBhava.masteryGrade} ({activeBhava.phaladeepikaScore}%)</span>
              </div>
            </div>

            {/* Occupants */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400 font-bold block">Resident Natal Planets:</span>
              <span className="text-slate-100 font-semibold mt-0.5 block">
                {activeBhava.occupants.length ? activeBhava.occupants.join(", ") : "None (Unoccupied)"}
              </span>
            </div>

            {/* Classical Phala Box */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1 text-xs">
              <span className="text-cyan-300 font-bold block">📜 Acharya Mantreswara's Bhava Phala:</span>
              <p className="text-slate-200 leading-relaxed">{activeBhava.classicalPhala}</p>
            </div>

            {/* Score Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Phaladeepika Mastery Strength:</span>
                <span className="text-cyan-400">{activeBhava.phaladeepikaScore}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${activeBhava.phaladeepikaScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
