"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import {
  evaluateBhriguNadi,
  evaluateBhriguPrashna,
  calculateNadiAgeProgressions,
  detectNadiSangrahaYogas,
  BhriguNadiReport,
} from "../engine/bhriguNadi";

export default function BhriguNadiDeck() {
  const { ephemeris, currentDate } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"quadrants" | "jiva-karma" | "bsp-timeline" | "prashna" | "progressions" | "sangraha">("quadrants");
  const [previewAge, setPreviewAge] = useState<number | null>(null);
  const [prashnaDomain, setPrashnaDomain] = useState<"Career" | "Finance" | "Marriage" | "Health" | "Travel" | "Property">("Career");

  const report: BhriguNadiReport = useMemo(() => {
    return evaluateBhriguNadi(ephemeris, currentDate);
  }, [ephemeris, currentDate]);

  const prashnaReport = useMemo(() => {
    return evaluateBhriguPrashna(ephemeris, prashnaDomain);
  }, [ephemeris, prashnaDomain]);

  const ageProgressions = useMemo(() => {
    return calculateNadiAgeProgressions(ephemeris);
  }, [ephemeris]);

  const sangrahaYogas = useMemo(() => {
    return detectNadiSangrahaYogas(ephemeris);
  }, [ephemeris]);

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
              Bhrigu Nandi Nadi (BNN) & R.G. Rao Nadi Master Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sri R.G. Rao Tradition — Directional 1-5-9 Trines, Jiva/Karma Linkages, Bhrigu Prashna, Age Progressions & BSP Triggers.
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
          🧭 4 Directional Quadrants (1-5-9)
        </button>
        <button
          onClick={() => setActiveTab("jiva-karma")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "jiva-karma"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          👑 Jiva (Guru) & Karma (Shani)
        </button>
        <button
          onClick={() => setActiveTab("prashna")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "prashna"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🔮 Bhrigu Prashna Nadi Oracle
        </button>
        <button
          onClick={() => setActiveTab("progressions")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "progressions"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⏳ Nadi Age Progressions (12-Yr)
        </button>
        <button
          onClick={() => setActiveTab("sangraha")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "sangraha"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⭐ Nadi Sangraha Yogas
        </button>
        <button
          onClick={() => setActiveTab("bsp-timeline")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "bsp-timeline"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🎯 BSP Karmic Triggers (Year-by-Year)
        </button>
      </div>

      {/* TAB 1: 4 DIRECTIONAL QUADRANTS */}
      {activeTab === "quadrants" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(report.directionalClusters).map(([dirKey, cluster]) => {
            const isAgni = cluster.element === "Agni";
            const isPrithvi = cluster.element === "Prithvi";
            const isVayu = cluster.element === "Vayu";
            const isJala = cluster.element === "Jala";

            const borderCol = isAgni
              ? "border-rose-500/30 bg-rose-950/10"
              : isPrithvi
              ? "border-amber-500/30 bg-amber-950/10"
              : isVayu
              ? "border-sky-500/30 bg-sky-950/10"
              : "border-emerald-500/30 bg-emerald-950/10";

            const tagCol = isAgni
              ? "text-rose-400 bg-rose-950/60 border-rose-800/60"
              : isPrithvi
              ? "text-amber-400 bg-amber-950/60 border-amber-800/60"
              : isVayu
              ? "text-sky-400 bg-sky-950/60 border-sky-800/60"
              : "text-emerald-400 bg-emerald-950/60 border-emerald-800/60";

            return (
              <div key={dirKey} className={`p-4 rounded-2xl border ${borderCol} flex flex-col justify-between gap-3 shadow-lg`}>
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="font-black text-sm text-slate-100">{cluster.direction}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${tagCol}`}>
                      {cluster.element} Element
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 mt-2">
                    <strong>Signs:</strong> {cluster.signs.join(", ")}
                  </div>

                  <div className="mt-2">
                    <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">
                      Conjoined Planets in this Trinal Arc:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cluster.planets.length > 0 ? (
                        cluster.planets.map((p) => (
                          <span key={p} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200">
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">No Grahas (Empty Arc)</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 leading-relaxed">
                  {cluster.description}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: JIVA & KARMA */}
      {activeTab === "jiva-karma" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Jiva Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/20 to-slate-950 border border-amber-500/30 flex flex-col gap-4">
            <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Self & Soul Vector</span>
                <h3 className="text-base font-black text-slate-100">Jiva Karaka (Jupiter / गुरु)</h3>
              </div>
              <span className="text-xs font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800">
                {report.jivaProfile.occupiedSign} (H{report.jivaProfile.occupiedHouse})
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-bold">Directional Trine Allies (1-5-9):</span>
                <p className="text-slate-200 mt-0.5">{report.jivaProfile.directionalCompanions.join(", ") || "Solo Transit"}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold">Next House Ahead (2nd - Food/Future):</span>
                <p className="text-slate-200 mt-0.5">{report.jivaProfile.secondHousePlanets.join(", ") || "Empty"}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold">Behind House (12th - Past Karma/Baggage):</span>
                <p className="text-slate-200 mt-0.5">{report.jivaProfile.twelfthHousePlanets.join(", ") || "Clear"}</p>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mt-auto">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">Jiva Manifestation (R.G. Rao)</div>
              <p className="text-xs text-slate-300 leading-relaxed">{report.jivaProfile.synthesisVerdict}</p>
            </div>
          </div>

          {/* Karma Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/20 to-slate-950 border border-purple-500/30 flex flex-col gap-4">
            <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Profession & Duty Vector</span>
                <h3 className="text-base font-black text-slate-100">Karma Karaka (Saturn / शनि)</h3>
              </div>
              <span className="text-xs font-bold text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-800">
                {report.karmaProfile.occupiedSign} (H{report.karmaProfile.occupiedHouse})
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-bold">Directional Trine Allies (1-5-9):</span>
                <p className="text-slate-200 mt-0.5">{report.karmaProfile.directionalCompanions.join(", ") || "Solo Transit"}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold">Next House Ahead (2nd - Work Product):</span>
                <p className="text-slate-200 mt-0.5">{report.karmaProfile.secondHousePlanets.join(", ") || "Empty"}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold">Behind House (12th - Karmic Debt):</span>
                <p className="text-slate-200 mt-0.5">{report.karmaProfile.twelfthHousePlanets.join(", ") || "Clear"}</p>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mt-auto">
              <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-1">Professional Vocation (R.G. Rao)</div>
              <p className="text-xs text-slate-300 leading-relaxed">{report.karmaProfile.synthesisVerdict}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BHRIGU PRASHNA NADI ORACLE */}
      {activeTab === "prashna" && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-bold">Sri R.G. Rao Classical Horary</span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                Bhrigu Prashna Nadi (Directional Karaka Oracle)
              </h4>
            </div>

            {/* Domain Selector */}
            <div className="flex flex-wrap gap-1.5">
              {(["Career", "Finance", "Marriage", "Health", "Travel", "Property"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setPrashnaDomain(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    prashnaDomain === d
                      ? "bg-amber-600 text-white shadow"
                      : "bg-slate-900 text-slate-400 border border-slate-800"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase">Query Disposition:</span>
              <div className="text-sm font-bold text-slate-100">
                Primary Karaka: <span className="text-amber-300">{prashnaReport.queryKaraka}</span>
              </div>
              <div className="text-slate-300">
                Directional Axis: <strong>{prashnaReport.directionalDisposition}</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] text-emerald-400 font-bold uppercase">Oracle Verdict:</span>
              <div className="text-sm font-black text-emerald-300">
                {prashnaReport.outcome} ({prashnaReport.probabilityScore}%)
              </div>
              <div className="text-slate-300">
                Instant horary resolution via trinal linkages.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
            <span className="text-amber-300 font-bold block mb-1">📜 Bhrigu Prashna Synthesis:</span>
            <p className="text-slate-200 leading-relaxed">{prashnaReport.bhriguPrashnaVerdict}</p>
          </div>
        </div>
      )}

      {/* TAB 4: NADI AGE PROGRESSIONS */}
      {activeTab === "progressions" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">12-Year Jupiter (Jeeva) Age Progression Cycles</h4>
            <p className="text-xs text-slate-400">
              Per Essence of Nadi Astrology (R.G. Rao), Jupiter advances through 12-year developmental rounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ageProgressions.map((cyc) => (
              <div key={cyc.cycleRound} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-amber-400 font-bold">Round {cyc.cycleRound}</span>
                  <span className="text-slate-200 font-bold">{cyc.progressedSign}</span>
                </div>
                <div className="text-slate-200 font-semibold">{cyc.ageRange}</div>
                <p className="text-slate-300 leading-relaxed">{cyc.lifeFocus}</p>
                <div className="pt-2 border-t border-slate-900 text-[11px] text-amber-300">
                  ★ {cyc.keyMilestones}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: NADI SANGRAHA YOGAS */}
      {activeTab === "sangraha" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Bhrigu Nadi Sangraha: Rare Planetary Yogas</h4>
            <p className="text-xs text-slate-400">
              High-potency trinal and directional yoga linkages from Bhrigu Nadi Sangraha.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sangrahaYogas.map((y, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h5 className="font-bold text-slate-100">{y.yogaName}</h5>
                  <span className="text-[10px] text-amber-300 font-mono">{y.participatingPlanets.join(" + ")}</span>
                </div>
                <p className="text-slate-300">{y.description}</p>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                  <strong>Manifestation:</strong> {y.effect}
                </div>
              </div>
            ))}
            {sangrahaYogas.length === 0 && (
              <p className="text-xs text-slate-500 italic">No rare Nadi Sangraha trinal yogas active.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: BSP TIMELINE */}
      {activeTab === "bsp-timeline" && (
        <div className="space-y-6">
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
