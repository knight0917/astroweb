"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateShashtiamsha, evaluateBcpWheel, evaluateSuryaRemedies } from "../engine/shashtiamsha";
import { ShashtiamshaAnalysis, BcpAnalysis, SuryaRemedialAnalysis } from "../engine/types";

export default function ShashtiamshaBcpDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"d60" | "bcp" | "surya">("d60");
  const [selectedAge, setSelectedAge] = useState<number>(28);

  const d60Report: ShashtiamshaAnalysis = useMemo(() => evaluateShashtiamsha(ephemeris), [ephemeris]);
  const bcpReport: BcpAnalysis = useMemo(() => evaluateBcpWheel(ephemeris, selectedAge), [ephemeris, selectedAge]);
  const suryaReport: SuryaRemedialAnalysis = useMemo(() => evaluateSuryaRemedies(ephemeris), [ephemeris]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💎</span>
            <h2 className="text-lg font-bold text-slate-100">
              D-60 Shashtiamsha & Bhrigu Chakra Paddhati (BCP) Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            60 Shashtiamsha Deities (Sanchita Karma Root), BCP 12-Year Progressive Age Wheel & 108 Surya Remedies.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">D60 Sanchita Karma</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>💎</span>
              <span>{d60Report.sanchitaKarmaScore}% Merit</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">BCP Active House</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🎡</span>
              <span>House {bcpReport.currentActiveCycle.activeHouseNum} (Age {selectedAge})</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-orange-500/40 text-center">
            <div className="text-[9px] text-orange-400 uppercase tracking-wider font-bold">Surya Vitality</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>☀️</span>
              <span>{suryaReport.solarVitalityScore}% Power</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("d60")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "d60"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>💎</span>
          <span>D-60 Shashtiamsha (60 Deities)</span>
        </button>

        <button
          onClick={() => setActiveTab("bcp")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "bcp"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>🎡</span>
          <span>Bhrigu Chakra Paddhati (Age Wheel)</span>
        </button>

        <button
          onClick={() => setActiveTab("surya")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "surya"
              ? "bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>☀️</span>
          <span>108 Surya Names & Stotras</span>
        </button>
      </div>

      {/* TAB 1: D-60 SHASHTIAMSHA */}
      {activeTab === "d60" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">📜</span>
            <div>
              <span className="font-bold text-emerald-400">BPHS Shashtiamsha Doctrine:</span> In Parashari Vimsopaka Bala, D-60 carries the highest weight (4 full points out of 20). It reveals the pure <strong>Sanchita Karma (accumulated past-life causes)</strong> governing your current physical incarnation.
            </div>
          </div>

          {/* Lagna Shashtiamsha Card */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Ascendant (Lagna) Shashtiamsha Anchor</span>
              <h3 className="text-sm font-bold text-slate-100 mt-0.5">
                {d60Report.lagnaResult.deityName} • Shashtiamsha #{d60Report.lagnaResult.shashtiamshaNumber}
              </h3>
              <p className="text-xs text-slate-300 mt-1">{d60Report.lagnaResult.sanchitaKarmaSignification}</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 w-fit">
              {d60Report.lagnaResult.deityCategory}
            </span>
          </div>

          {/* Planets Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="p-3">Planet</th>
                  <th className="p-3">D-60 Sign & Deg</th>
                  <th className="p-3"># & Deity</th>
                  <th className="p-3">Nature / Vibe</th>
                  <th className="p-3">Past-Life Sanchita Manifestation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {Object.values(d60Report.planets).map((p) => (
                  <tr key={p.planetName} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-100">{p.planetName}</td>
                    <td className="p-3 font-mono text-slate-300">
                      {p.d60SignName} <span className="text-[10px] text-slate-400">({p.d60Degree}°)</span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-amber-300">#{p.shashtiamshaNumber} {p.deityName}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.deityCategory.includes("100%")
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                          : p.deityCategory.includes("60%")
                          ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                          : "bg-rose-950 text-rose-300 border border-rose-500/40"
                      }`}>
                        {p.deityCategory}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 text-[11px] max-w-sm">
                      {p.sanchitaKarmaSignification}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ghora Deity Warnings */}
          {d60Report.ghoraDeityRemedialWarnings.length > 0 && (
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4">
              <h4 className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-1.5">
                <span>⚠️</span>
                <span>Ghora (Ferocious) Shashtiamsha Karmic Clearing Protocols</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {d60Report.ghoraDeityRemedialWarnings.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-400">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BHRIGU CHAKRA PADDHATI (BCP) */}
      {activeTab === "bcp" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">🎡</span>
            <div>
              <span className="font-bold text-amber-400">Bhrigu Chakra Paddhati (BCP):</span> The 12-year progressive karmic wheel where each year of your life rotates through one house of the horoscope (Age 1=H1, Age 2=H2, Age 13=H1, Age 25=H1, etc.).
            </div>
          </div>

          {/* Age Slider Controller */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Select Age to Inspect:</span>
              <span className="text-base font-black text-amber-400 font-mono bg-slate-950 px-3 py-1 rounded-lg border border-amber-500/40">
                Year {selectedAge} (Cycle {bcpReport.currentActiveCycle.cycleNumber})
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="90"
              value={selectedAge}
              onChange={(e) => setSelectedAge(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Age 1 (1st Cycle)</span>
              <span>Age 25 (3rd Cycle)</span>
              <span>Age 49 (5th Cycle)</span>
              <span>Age 73 (7th Cycle)</span>
              <span>Age 90</span>
            </div>
          </div>

          {/* Active Age Card */}
          <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 p-5 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Activated BCP House</div>
                  <h3 className="text-base font-bold text-slate-100">
                    House {bcpReport.currentActiveCycle.activeHouseNum} in {bcpReport.currentActiveCycle.houseSignName} (Ruled by {bcpReport.currentActiveCycle.houseLord})
                  </h3>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
                {bcpReport.currentActiveCycle.activationGrade}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Primary Life Trigger:</span>
                <p className="text-xs text-slate-200 font-medium mt-0.5">{bcpReport.currentActiveCycle.primaryKarmicTrigger}</p>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Activated Planets:</span>
                <p className="text-xs text-amber-300 font-medium mt-0.5">
                  {bcpReport.currentActiveCycle.occupyingPlanets.length > 0 ? bcpReport.currentActiveCycle.occupyingPlanets.join(", ") : "None posited (Triggers via Lord & Aspects)"}
                </p>
              </div>
            </div>
          </div>

          {/* 10-Year Upcoming Forecast Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <span>📅</span>
              <span>10-Year BCP Progressive Forecast Sequence</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {bcpReport.tenYearUpcomingCycles.map((cycle) => (
                <div key={cycle.age} className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">Age {cycle.age}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      House {cycle.activeHouseNum}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium">{cycle.houseSignName} ({cycle.houseLord})</div>
                  <p className="text-[11px] text-slate-400 mt-1">{cycle.primaryKarmicTrigger}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 108 SURYA NAMES & REMEDIES */}
      {activeTab === "surya" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">☀️</span>
            <div>
              <span className="font-bold text-orange-400">Surya Ashtottara Shatanamavali:</span> The sacred 108 names of Lord Surya for awakening soul vitality, executive authority, and dissolving lethargy and past-life obstacles.
            </div>
          </div>

          {/* Targeted Solar Remedies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suryaReport.targetedSolarRemedies.map((rem, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 leading-relaxed">
                {rem}
              </div>
            ))}
          </div>

          {/* 108 Surya Names Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <span>📿</span>
              <span>Sacred Solar Names & Spiritual Significations</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {suryaReport.names.map((n) => (
                <div key={n.number} className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-orange-400 font-bold">#{n.number}</span>
                  </div>
                  <div className="text-xs font-bold text-amber-200">{n.sanskritName}</div>
                  <div className="text-[11px] text-slate-300">{n.englishTranslation}</div>
                  <div className="text-[10px] text-slate-400 mt-1 border-t border-slate-800/80 pt-1">
                    ✨ {n.spiritualSignification}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
