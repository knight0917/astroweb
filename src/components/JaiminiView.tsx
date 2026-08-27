"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import {
  calculateJaiminiKarakas,
  calculateArudhaPadas,
  analyzeKarakamsha,
  calculateJaiminiCharaDasha,
  calculateJaiminiRashiDrishti,
  ArudhaPada,
  calculateArgala,
  ArgalaReport,
} from "../engine/jaimini";
import { RASHI_NAMES } from "../engine/constants";

export default function JaiminiView() {
  const { ephemeris, currentDate } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"karakas" | "arudha" | "karakamsha" | "charaDasha" | "rashiDrishti" | "argala">("karakas");
  const [argalaTargetMode, setArgalaTargetMode] = useState<"lagna" | "al" | "ul" | "custom">("lagna");
  const [customArgalaSignIdx, setCustomArgalaSignIdx] = useState<number>(0);
  const [selectedPada, setSelectedPada] = useState<ArudhaPada | null>(null);
  const [inspectedSignIdx, setInspectedSignIdx] = useState<number>(0);

  const karakasResult = useMemo(() => calculateJaiminiKarakas(ephemeris), [ephemeris]);
  const arudhaPadas = useMemo(() => calculateArudhaPadas(ephemeris), [ephemeris]);
  const karakamshaAnalysis = useMemo(() => analyzeKarakamsha(ephemeris), [ephemeris]);
  const charaDashaResult = useMemo(
    () => calculateJaiminiCharaDasha(currentDate, ephemeris.ascendant.siderealLongitude, new Date()),
    [currentDate, ephemeris]
  );
  const rashiDrishti = useMemo(() => calculateJaiminiRashiDrishti(inspectedSignIdx), [inspectedSignIdx]);
  const argalaTargetSignIdx = useMemo(() => {
    if (argalaTargetMode === "lagna") return Math.floor(ephemeris.ascendant.siderealLongitude / 30);
    if (argalaTargetMode === "al") return arudhaPadas[0]?.padaSignIndex || 0;
    if (argalaTargetMode === "ul") return arudhaPadas[11]?.padaSignIndex || 0;
    return customArgalaSignIdx;
  }, [argalaTargetMode, ephemeris, arudhaPadas, customArgalaSignIdx]);

  const argalaTargetLabel = useMemo(() => {
    if (argalaTargetMode === "lagna") return "Lagna (Ascendant)";
    if (argalaTargetMode === "al") return "Arudha Lagna (AL - Public Status)";
    if (argalaTargetMode === "ul") return "Upapada Lagna (UL - Marriage)";
    return `Sign #${customArgalaSignIdx + 1}`;
  }, [argalaTargetMode, customArgalaSignIdx]);

  const argalaReport: ArgalaReport = useMemo(() => {
    return calculateArgala(ephemeris, argalaTargetSignIdx, argalaTargetLabel);
  }, [ephemeris, argalaTargetSignIdx, argalaTargetLabel]);


  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Classical Jaimini Astrology Suite (महर्षि जैमिनी ज्योतिष)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Jaimini Upadesha Sutras & BPHS Ch. 30–33 • 7 Chara Karakas, 12 Arudha Padas, Karakamsha & Chara Dasha
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: "karakas", label: "7 Chara Karakas" },
            { id: "arudha", label: "12 Arudha Padas" },
            { id: "karakamsha", label: "Karakamsha & Ishta" },
            { id: "charaDasha", label: "Chara Dasha" },
            { id: "rashiDrishti", label: "Rashi Drishti" },
            { id: "argala", label: "Argala & Virodha" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. CHARA KARAKAS TAB */}
      {activeTab === "karakas" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AK Spotlight Card */}
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-slate-950 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/40">
                  KING OF THE CHART
                </span>
                <span className="text-3xl">👑</span>
              </div>
              <h3 className="text-2xl font-black text-amber-300 mt-4">
                {karakasResult.atmakaraka.name} ({karakasResult.atmakaraka.sanskritName})
              </h3>
              <p className="text-sm text-slate-300 font-bold mt-1">
                Graha: <span className="text-amber-400 font-extrabold">{karakasResult.atmakaraka.planetName} {karakasResult.atmakaraka.symbol}</span> in {karakasResult.atmakaraka.rashi.englishName} ({karakasResult.atmakaraka.formattedDegrees})
              </p>
              <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p>
                  <strong className="text-amber-200">Soul Significance:</strong> {karakasResult.atmakaraka.signification}
                </p>
                <p>
                  <strong className="text-teal-200">Life Domain:</strong> {karakasResult.atmakaraka.lifeDomain}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>House #{karakasResult.atmakaraka.house}</span>
              <span className="text-emerald-400 font-bold">Highest Degree Graha ({karakasResult.atmakaraka.formattedDegrees})</span>
            </div>
          </div>

          {/* 7 Karakas Full Table */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span>🌟</span>
              <span>The 7 Classical Chara Karakas (AK to DK)</span>
            </h3>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                    <th className="p-2.5 font-bold">Karaka</th>
                    <th className="p-2.5">Graha</th>
                    <th className="p-2.5">Sign & Degrees</th>
                    <th className="p-2.5">House</th>
                    <th className="p-2.5">Life Signification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {karakasResult.karakas.map((k) => {
                    const isAK = k.code === "AK";
                    return (
                      <tr
                        key={k.code}
                        className={`hover:bg-slate-900/60 transition-colors ${
                          isAK ? "bg-amber-500/10 font-bold" : ""
                        }`}
                      >
                        <td className="p-2.5 flex items-center gap-2">
                          <span
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                              isAK
                                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                                : "bg-slate-800 text-amber-300 border border-slate-700"
                            }`}
                          >
                            {k.code}
                          </span>
                          <div>
                            <div className="font-bold text-slate-200">{k.name}</div>
                            <div className="text-[10px] text-slate-400">{k.sanskritName}</div>
                          </div>
                        </td>
                        <td className="p-2.5 font-bold text-amber-300">
                          {k.symbol} {k.planetName}
                        </td>
                        <td className="p-2.5 text-slate-300">
                          {k.rashi.symbol} {k.rashi.englishName} ({k.formattedDegrees})
                        </td>
                        <td className="p-2.5 font-bold text-slate-300">H{k.house}</td>
                        <td className="p-2.5 text-[11px] text-slate-300 max-w-xs">
                          <span className="text-slate-200 font-semibold">{k.lifeDomain}:</span> {k.signification}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. ARUDHA PADAS TAB */}
      {activeTab === "arudha" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Arudha Grid */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span>🌀</span>
                <span>The 12 Arudha Padas (A1 to A12)</span>
              </h3>
              <span className="text-[11px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                Jaimini Sutras 1.1.30–31 Exceptions Applied
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {arudhaPadas.map((pada) => {
                const isSelected = selectedPada?.code === pada.code;
                const isAL = pada.code === "AL";
                const isUL = pada.code === "UL";
                return (
                  <button
                    key={pada.code}
                    onClick={() => setSelectedPada(pada)}
                    className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer relative ${
                      isSelected
                        ? "bg-amber-500/20 border-amber-400 shadow-lg scale-[1.02]"
                        : isAL
                        ? "bg-amber-950/40 border-amber-500/60 hover:border-amber-400"
                        : isUL
                        ? "bg-rose-950/40 border-rose-500/60 hover:border-rose-400"
                        : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded-md font-black text-xs ${
                          isAL
                            ? "bg-amber-500 text-slate-950"
                            : isUL
                            ? "bg-rose-500 text-white"
                            : "bg-slate-800 text-amber-300"
                        }`}
                      >
                        {pada.code}
                      </span>
                      <span className="text-xs font-bold font-mono text-slate-300">
                        H{pada.padaHouse} ({pada.padaSign.englishName})
                      </span>
                    </div>
                    <div className="mt-2 font-bold text-slate-200 text-xs">{pada.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{pada.sanskritName}</div>
                    {pada.isExceptionApplied && (
                      <div className="mt-1 text-[9px] text-emerald-400 font-semibold">
                        ✨ Jaimini 10th Exception
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Pada Detail Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl flex flex-col justify-between">
            {selectedPada ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Arudha Pada Analysis
                  </span>
                  <span className="text-xl font-mono font-black text-amber-300">{selectedPada.code}</span>
                </div>

                <div>
                  <h4 className="text-xl font-black text-slate-100">{selectedPada.name}</h4>
                  <p className="text-xs text-slate-400 font-mono">{selectedPada.sanskritName}</p>
                </div>

                <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Source House:</span>
                    <span className="font-bold text-slate-200">House #{selectedPada.houseNumber} ({selectedPada.houseSignName})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">House Lord:</span>
                    <span className="font-bold text-amber-300">{selectedPada.lordName} in {selectedPada.lordSignName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pada Location:</span>
                    <span className="font-bold text-emerald-300">House #{selectedPada.padaHouse} ({selectedPada.padaSign.englishName})</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                  <p className="font-bold">Worldly Signification:</p>
                  <p className="text-slate-300 text-[11px]">{selectedPada.signification}</p>
                </div>

                {selectedPada.isExceptionApplied && (
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-[11px] text-emerald-300">
                    <strong>Sutra Rule Applied:</strong> {selectedPada.exceptionReason}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-12">
                <span className="text-3xl mb-2">👆</span>
                <p className="text-xs">Select any of the 12 Arudha Padas on the left to view in-depth classical Jaimini significations.</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              💡 <strong>Arudha Lagna (AL)</strong> governs public image and wealth; <strong>Upapada Lagna (UL)</strong> governs marital longevity.
            </div>
          </div>
        </div>
      )}

      {/* 3. KARAKAMSHA & ISHTA DEVATA TAB */}
      {activeTab === "karakamsha" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Karakamsha Card */}
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/40 bg-slate-950/80 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/40">
                SOUL PURSUIT
              </span>
              <span className="text-2xl">☸️</span>
            </div>
            <h3 className="text-xl font-black text-slate-100">Karakamsha (कारकांश)</h3>
            <p className="text-xs text-slate-400">
              The sign occupied by the Atmakaraka ({karakamshaAnalysis.atmakaraka.planetName}) in the D9 Navamsha Chart.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Karakamsha Rashi:</span>
                <span className="font-bold text-amber-300 text-sm">
                  {karakamshaAnalysis.karakamshaRashi.symbol} {karakamshaAnalysis.karakamshaRashi.englishName} ({karakamshaAnalysis.karakamshaRashi.sanskritName})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">D1 House Position:</span>
                <span className="font-bold text-slate-200">House #{karakamshaAnalysis.karakamshaHouseInD1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Swamsha (D9 Lagna):</span>
                <span className="font-bold text-emerald-300">
                  {karakamshaAnalysis.swamshaRashi.symbol} {karakamshaAnalysis.swamshaRashi.englishName}
                </span>
              </div>
            </div>
          </div>

          {/* 12th from Karakamsha (Moksha & Liberation) */}
          <div className="glass-panel p-6 rounded-2xl border border-purple-500/40 bg-slate-950/80 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-extrabold text-xs border border-purple-500/40">
                MOKSHA DISPOSITION
              </span>
              <span className="text-2xl">🕉️</span>
            </div>
            <h3 className="text-xl font-black text-slate-100">12th from Karakamsha</h3>
            <p className="text-xs text-slate-400">
              Classical Jaimini indicator for spiritual liberation (Moksha) and higher consciousness.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">12th Sign from KL:</span>
                <span className="font-bold text-purple-300">
                  {karakamshaAnalysis.twelfthFromKarakamsha.rashi.symbol} {karakamshaAnalysis.twelfthFromKarakamsha.rashi.englishName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Navamsha Occupants:</span>
                <span className="font-bold text-slate-200">
                  {karakamshaAnalysis.twelfthFromKarakamsha.occupants.length > 0
                    ? karakamshaAnalysis.twelfthFromKarakamsha.occupants.join(", ")
                    : "None (Lord based)"}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200">
              {karakamshaAnalysis.twelfthFromKarakamsha.spiritualSignification}
            </div>
          </div>

          {/* Ishta & Dharma Devata Card */}
          <div className="glass-panel p-6 rounded-2xl border border-teal-500/40 bg-slate-950/80 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 font-extrabold text-xs border border-teal-500/40">
                DIVINE PATRONS
              </span>
              <span className="text-2xl">🪔</span>
            </div>
            <h3 className="text-xl font-black text-slate-100">Ishta & Dharma Devata</h3>
            <p className="text-xs text-slate-400">
              Divine archetypes guiding your spiritual evolution and righteous action in this life.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
              <div>
                <div className="text-slate-400">Ishta Devata (इष्ट देवता):</div>
                <div className="font-black text-amber-300 text-sm mt-0.5">
                  {karakamshaAnalysis.ishtaDevata.deity} ({karakamshaAnalysis.ishtaDevata.graha})
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  {karakamshaAnalysis.ishtaDevata.description}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="text-slate-400">Dharma Devata (धर्म देवता):</div>
                <div className="font-black text-teal-300 text-sm mt-0.5">
                  {karakamshaAnalysis.dharmaDevata.deity}
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  {karakamshaAnalysis.dharmaDevata.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. CHARA DASHA TAB */}
      {activeTab === "charaDasha" && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-6">
          {/* Active Dasha Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/50 border border-amber-500/50 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest">
                CURRENT ACTIVE CHARA DASHA
              </span>
              <h3 className="text-2xl font-black text-amber-300 mt-1 flex items-center gap-2">
                <span>{charaDashaResult.activeDasha.mahadasha.rashi.symbol}</span>
                <span>{charaDashaResult.activeDasha.mahadasha.rashi.englishName} Mahadasha</span>
                <span className="text-slate-400 text-base font-normal">➔</span>
                <span className="text-emerald-300">{charaDashaResult.activeDasha.antardasha.rashi.englishName} Antar</span>
              </h3>
              <p className="text-xs text-slate-300 font-mono mt-1">
                Window: {charaDashaResult.activeDasha.mahadasha.startDate.toLocaleDateString()} to {charaDashaResult.activeDasha.mahadasha.endDate.toLocaleDateString()}
              </p>
            </div>

            <div className="w-44 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">MD Progress</span>
                <span className="text-amber-400 font-mono">{charaDashaResult.activeDasha.percentageCompleteMD}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${charaDashaResult.activeDasha.percentageCompleteMD}%` }}
                />
              </div>
            </div>
          </div>

          {/* All 12 Chara Dashas Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
              Complete 12-Rashi Chara Dasha Progression
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {charaDashaResult.dashas.map((md, idx) => {
                const isActive = md.rashiIndex === charaDashaResult.activeDasha.mahadasha.rashiIndex;
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isActive
                        ? "bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10"
                        : "bg-slate-900/60 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-200 flex items-center gap-1.5">
                        <span className="text-amber-400">{md.rashi.symbol}</span>
                        <span>{md.rashi.englishName} ({md.rashi.sanskritName})</span>
                      </span>
                      {isActive ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-extrabold text-[10px] border border-emerald-500/60 animate-pulse">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-slate-400 font-bold">
                          {md.durationYears} Years
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-xs font-mono text-slate-400 flex justify-between">
                      <span>{md.startDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
                      <span>➔</span>
                      <span>{md.endDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. RASHI DRISHTI (SIGN ASPECTS) TAB */}
      {activeTab === "rashiDrishti" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sign Selector */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span>👁️</span>
              <span>Inspect Rashi Drishti (Sign Aspect)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select any zodiac sign to see which signs and planetary occupants it aspects in Jaimini astrology.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {RASHI_NAMES.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => setInspectedSignIdx(idx)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold transition-all border flex items-center justify-between ${
                    inspectedSignIdx === idx
                      ? "bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md"
                      : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{r.symbol}</span>
                    <span>{r.englishName}</span>
                  </span>
                  <span className="text-[10px] opacity-75">#{idx + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Results */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-extrabold uppercase tracking-wider">
                  {rashiDrishti.signType} Sign
                </span>
                <h3 className="text-2xl font-black text-slate-100 mt-0.5">
                  {rashiDrishti.sign.symbol} {rashiDrishti.sign.englishName} ({rashiDrishti.sign.sanskritName}) Aspects
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold">
                {rashiDrishti.aspectedSigns.length} Signs Aspected
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
              <strong>Classical Jaimini Sutra Rule:</strong>{" "}
              {rashiDrishti.signType.includes("Movable")
                ? "Movable (Chara) signs aspect all Fixed (Sthira) signs except the adjacent one."
                : rashiDrishti.signType.includes("Fixed")
                ? "Fixed (Sthira) signs aspect all Movable (Chara) signs except the adjacent one."
                : "Dual (Dvisvabhava) signs aspect all other Dual signs."}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {rashiDrishti.aspectedSigns.map((aspected, aIdx) => (
                <div
                  key={aIdx}
                  className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/40 text-center space-y-1"
                >
                  <span className="text-3xl">{aspected.symbol}</span>
                  <div className="font-black text-sm text-amber-300 mt-1">
                    {aspected.englishName}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {aspected.sanskritName} (#{aspected.index + 1})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. ARGALA & VIRODHARGALA TAB */}
      {activeTab === "argala" && (
        <div className="flex flex-col gap-6">
          {/* Top Target Selector Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🚪</span>
                <h3 className="text-base font-bold text-slate-100">
                  Jaimini Argala & Virodhargala (अर्गला एवं विरोधाsub-system)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Cosmic intervention (2nd, 4th, 11th, 5th) and obstruction mechanics on your chosen reference point.
              </p>
            </div>

            {/* Target Mode Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setArgalaTargetMode("lagna")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  argalaTargetMode === "lagna"
                    ? "bg-amber-500 text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Lagna
              </button>
              <button
                onClick={() => setArgalaTargetMode("al")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  argalaTargetMode === "al"
                    ? "bg-amber-500 text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Arudha Lagna (AL)
              </button>
              <button
                onClick={() => setArgalaTargetMode("ul")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  argalaTargetMode === "ul"
                    ? "bg-amber-500 text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Upapada (UL)
              </button>
              <button
                onClick={() => setArgalaTargetMode("custom")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  argalaTargetMode === "custom"
                    ? "bg-amber-500 text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Custom Rashi
              </button>
            </div>
          </div>

          {/* Custom Rashi Selector if mode is custom */}
          {argalaTargetMode === "custom" && (
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              {RASHI_NAMES.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => setCustomArgalaSignIdx(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    customArgalaSignIdx === idx
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200"
                  }`}
                >
                  {r.symbol} {r.englishName}
                </button>
              ))}
            </div>
          )}

          {/* Target Summary Banner */}
          <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 p-4 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Target Reference: {argalaReport.targetType}
              </span>
              <h4 className="text-lg font-black text-slate-100">
                Sign: {argalaReport.targetSignName} (#{argalaReport.targetSignIndex + 1})
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                ● {argalaReport.unobstructedShubhaCount} Shubha Argala
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-950 text-rose-300 border border-rose-700">
                ▲ {argalaReport.unobstructedPapaCount} Papa Argala
              </span>
            </div>
          </div>

          {/* 4 Argala Pair Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {argalaReport.argalas.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                  item.isUnobstructed
                    ? item.isShubhaArgala
                      ? "bg-emerald-950/20 border-emerald-500/40"
                      : "bg-rose-950/20 border-rose-500/40"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                    <span className="text-xs font-bold text-amber-400">{item.type}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        item.isUnobstructed
                          ? item.isShubhaArgala
                            ? "bg-emerald-950 text-emerald-300 border-emerald-600"
                            : "bg-rose-950 text-rose-300 border-rose-600"
                          : "bg-slate-900 text-slate-400 border-slate-700"
                      }`}
                    >
                      {item.isUnobstructed ? "UNOBSTRUCTED" : "OBSTRUCTED / VACANT"}
                    </span>
                  </div>

                  {/* Argala vs Virodha details */}
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        Intervention ({item.argalaHouse}th House)
                      </div>
                      <div className="text-xs font-semibold text-slate-200 mt-0.5">{item.argalaSignName}</div>
                      <div className="text-xs font-bold text-amber-300 mt-1">
                        {item.argalaPlanets.length > 0 ? item.argalaPlanets.join(", ") : "Vacant"}
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        Obstruction ({item.virodhaHouse}th House)
                      </div>
                      <div className="text-xs font-semibold text-slate-200 mt-0.5">{item.virodhaSignName}</div>
                      <div className="text-xs font-bold text-rose-300 mt-1">
                        {item.virodhaPlanets.length > 0 ? item.virodhaPlanets.join(", ") : "None"}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                  {item.statusSummary}
                </p>
              </div>
            ))}
          </div>

          {/* Verdict Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <strong className="text-amber-400">Classical Jaimini Synthesis:</strong> {argalaReport.overallVerdict}
          </div>
        </div>
      )}
    </div>
  );
}
