"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateBhriguNadi, BhriguNadiReport } from "../engine/bhriguNadi";

export default function BhriguNadiDeck() {
  const { ephemeris, currentDate } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"quadrants" | "jiva-karma" | "bsp-timeline">("quadrants");
  const [previewAge, setPreviewAge] = useState<number | null>(null);

  const report: BhriguNadiReport = useMemo(() => {
    return evaluateBhriguNadi(ephemeris, currentDate);
  }, [ephemeris, currentDate]);

  const selectedAge = previewAge !== null ? previewAge : report.runningAge;
  const currentBspItem = report.activeBspActivations.find((b) => b.ageYear === selectedAge) || report.currentYearBsp;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h2 className="text-lg font-bold text-slate-100">
              Bhrigu Nandi Nadi (BNN) & Bhrigu Saral Paddhati (BSP) Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sri R.G. Rao Tradition & Saptarishis Astrology — Directional 1-5-9 Trines, Jiva/Karma Nadi Linkages, and Age-Based Karmic Triggers.
          </p>
        </div>

        {/* Running Age Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Current Running Age</div>
            <div className="text-sm font-black text-amber-400">Year {report.runningAge}</div>
          </div>
          <div className="bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">12-Yr Cycle House</div>
            <div className="text-sm font-black text-emerald-400">House {report.currentYearBsp.cycleHouseNumber}</div>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("quadrants")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "quadrants"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🧭 4 Directional Quadrants (1-5-9 Trines)
        </button>
        <button
          onClick={() => setActiveTab("jiva-karma")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "jiva-karma"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          👑 Jiva (Self) & Karma (Saturn) Profiles
        </button>
        <button
          onClick={() => setActiveTab("bsp-timeline")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "bsp-timeline"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⏳ BSP Age Karmic Timeline
        </button>
      </div>

      {/* Tab 1: 4 Directional Quadrants */}
      {activeTab === "quadrants" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(report.directionalClusters).map(([key, cluster]) => {
            const isEast = key === "East";
            const isSouth = key === "South";
            const isWest = key === "West";
            const colorBorder = isEast ? "border-red-500/40 bg-red-950/20" : isSouth ? "border-amber-500/40 bg-amber-950/20" : isWest ? "border-blue-500/40 bg-blue-950/20" : "border-cyan-500/40 bg-cyan-950/20";
            const colorTitle = isEast ? "text-red-400" : isSouth ? "text-amber-400" : isWest ? "text-blue-400" : "text-cyan-400";

            return (
              <div key={key} className={`p-4 rounded-2xl border ${colorBorder} flex flex-col justify-between gap-3`}>
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                    <span className={`text-sm font-bold ${colorTitle}`}>{cluster.direction}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                      {cluster.element}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 font-medium">
                    Signs: <strong className="text-slate-300">{cluster.signs.join(", ")}</strong>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{cluster.description}</p>
                </div>

                {/* Planets posited */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mt-1">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                    Conjunct Planets (1-5-9):
                  </div>
                  {cluster.planets.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {cluster.planets.map((p) => (
                        <span key={p} className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-slate-200 border border-slate-700">
                          {p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 italic">No planets in this quadrant</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Jiva & Karma Profiles */}
      {activeTab === "jiva-karma" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Jiva Karaka (Jupiter) */}
          <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/15 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{report.jivaProfile.sanskritRole}</span>
                <h3 className="text-base font-bold text-slate-100">{report.jivaProfile.karakaName}</h3>
              </div>
              <span className="px-2 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {report.jivaProfile.occupiedSign} (H{report.jivaProfile.occupiedHouse})
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Directional Trines (1-5-9):</span>
                <span className="font-semibold text-slate-200">{report.jivaProfile.directionalCompanions.join(", ") || "None (Independent)"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">2nd House (Forward Momentum):</span>
                <span className="font-semibold text-emerald-400">{report.jivaProfile.secondHousePlanets.join(", ") || "Open space"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">12th House (Past Baggage / Support):</span>
                <span className="font-semibold text-slate-300">{report.jivaProfile.twelfthHousePlanets.join(", ") || "None"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">7th House (Direct Dialogue):</span>
                <span className="font-semibold text-purple-300">{report.jivaProfile.seventhHousePlanets.join(", ") || "None"}</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mt-auto">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">Jiva Nadi Synthesis</div>
              <p className="text-xs text-slate-300 leading-relaxed">{report.jivaProfile.synthesisVerdict}</p>
            </div>
          </div>

          {/* Karma Karaka (Saturn) */}
          <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-950/15 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">{report.karmaProfile.sanskritRole}</span>
                <h3 className="text-base font-bold text-slate-100">{report.karmaProfile.karakaName}</h3>
              </div>
              <span className="px-2 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                {report.karmaProfile.occupiedSign} (H{report.karmaProfile.occupiedHouse})
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Directional Trines (1-5-9):</span>
                <span className="font-semibold text-slate-200">{report.karmaProfile.directionalCompanions.join(", ") || "None (Independent)"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">2nd House (Vocation Sustenance):</span>
                <span className="font-semibold text-emerald-400">{report.karmaProfile.secondHousePlanets.join(", ") || "Open space"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">12th House (Past Professional Debt):</span>
                <span className="font-semibold text-slate-300">{report.karmaProfile.twelfthHousePlanets.join(", ") || "None"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">7th House (Direct Aspect):</span>
                <span className="font-semibold text-purple-300">{report.karmaProfile.seventhHousePlanets.join(", ") || "None"}</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mt-auto">
              <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-1">Professional Vocation (R.G. Rao)</div>
              <p className="text-xs text-slate-300 leading-relaxed">{report.karmaProfile.synthesisVerdict}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: BSP Age Timeline */}
      {activeTab === "bsp-timeline" && (
        <div className="space-y-6">
          {/* Active Years Carousel / Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2">
            {report.activeBspActivations.map((b) => {
              const isSelected = selectedAge === b.ageYear;
              const hasSpecific = b.specificBspTriggers.length > 0;
              return (
                <button
                  key={b.ageYear}
                  onClick={() => setPreviewAge(b.ageYear)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-lg ring-1 ring-amber-400"
                      : b.isCurrentRunningYear
                      ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-300"
                      : "bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="text-xs font-black">Age {b.ageYear}</div>
                  <div className="text-[10px] truncate opacity-90">House {b.cycleHouseNumber}</div>
                  {hasSpecific && (
                    <span className="text-[8px] px-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase font-bold">
                      ★ Trigger
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Age Deep Dive Box */}
          {currentBspItem && (
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Bhrigu Saral Paddhati (BSP) Forecast for Age {currentBspItem.ageYear}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-0.5">
                    12-Year Wheel Activation: House {currentBspItem.cycleHouseNumber}
                  </h3>
                </div>
                {currentBspItem.isCurrentRunningYear && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 w-max">
                    ● Active Current Running Year
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-300 leading-relaxed">
                <strong>Core Cyclical House Domain:</strong> {currentBspItem.cycleHouseTheme}
              </div>

              {/* Specific BSP Rule Triggers */}
              {currentBspItem.specificBspTriggers.length > 0 ? (
                <div className="space-y-2 mt-2">
                  <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                    Specific Bhrigu Karmic Triggers (BSP Rules):
                  </div>
                  {currentBspItem.specificBspTriggers.map((t, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
                        <span className="text-amber-400">[{t.ruleName}]</span>
                        <span>{t.activatedPlanet} $\rightarrow$ House {t.activatedHouse}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t.karmicOutcome}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                  Standard 12-Year wheel progression; events unfold primarily through House {currentBspItem.cycleHouseNumber} significations and running Vimshottari Dasha lords.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
