"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { calculateSukaNadi } from "../engine/sukaNadi";
import { SukaNadiAnalysis, SukaNadiKarakaBlend, SukaDirectionalTrine } from "../engine/types";

export default function SukaNadiDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"karakas" | "trines" | "karma" | "cycles">("karakas");
  const [selectedKarakaKey, setSelectedKarakaKey] = useState<string>("Jeeva");

  const report: SukaNadiAnalysis = useMemo(() => {
    return calculateSukaNadi(ephemeris);
  }, [ephemeris]);

  const allKarakas: Record<string, SukaNadiKarakaBlend> = {
    Jeeva: report.jeevaKaraka,
    Karma: report.karmaKaraka,
    Bhoga: report.bhogaKaraka,
    ...report.otherKarakas,
  };

  const activeKaraka = allKarakas[selectedKarakaKey] || report.jeevaKaraka;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦜</span>
            <h2 className="text-lg font-bold text-slate-100">
              Doctrines of Suka Nadi (शुक नाडी सिद्धान्त)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Classical Treatise by Sage Maharshi Shukacharya — Planetary Karakatwa Interlocking, 4-Directional Trines, Past-Life Karma & 12/30-Year Age Cycles.
          </p>
        </div>

        {/* Jeeva & Karma Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Jeeva Karaka (Soul)</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🌟</span>
              <span>{report.jeevaKaraka.planet} in {report.jeevaKaraka.signName}</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-blue-500/40 text-center">
            <div className="text-[9px] text-blue-400 uppercase tracking-wider font-bold">Karma Karaka (Vocation)</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>💼</span>
              <span>{report.karmaKaraka.planet} in {report.karmaKaraka.signName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Synthesis Hero Card */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950/20 to-slate-950 p-5 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              {report.specialYogas[0]}
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Jeeva Archetype: {report.jeevaKaraka.primaryArchetype}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterSukaSynthesis}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Karma Archetype:</span>
            <span className="text-xs font-bold text-slate-100 block mt-0.5">
              {report.karmaKaraka.primaryArchetype}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Past-Life Karma Pattern:</span>
            <span className="text-xs font-bold text-amber-300 block mt-0.5">
              {report.pastLifeKarma[0]?.sanskritTitle || "Deva Punya"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("karakas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "karakas"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🦜 Core Karakatwa Synergy
        </button>
        <button
          onClick={() => setActiveTab("trines")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "trines"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🧭 4-Directional Trine Matrix
        </button>
        <button
          onClick={() => setActiveTab("karma")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "karma"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ☸️ Past Life Karma & Pariharas
        </button>
        <button
          onClick={() => setActiveTab("cycles")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "cycles"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⏳ 12 & 30-Year Age Progression
        </button>
      </div>

      {/* TAB 1: CORE KARAKATWA SYNERGY */}
      {activeTab === "karakas" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Karaka Buttons */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Select Planetary Karaka to Inspect
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {Object.entries(allKarakas).map(([key, k]) => {
                const isSelected = selectedKarakaKey === key;
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedKarakaKey(key)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-600/20 border-emerald-400 shadow-lg ring-1 ring-emerald-400"
                        : "bg-slate-950/60 border-slate-800 hover:bg-slate-900"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black text-slate-100">{k.karakaName}</div>
                      <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                        {k.planet} in {k.signName} ({k.degrees}°)
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">➔</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Karaka Inspector */}
          <div className="lg:col-span-2 bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                  Suka Nadi Karaka Blend Dossier
                </span>
                <h4 className="text-base font-black text-slate-100 mt-0.5">{activeKaraka.karakaName}</h4>
                <div className="text-xs text-emerald-300 font-mono mt-0.5">
                  Placed in {activeKaraka.signName} at {activeKaraka.degrees}°
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Archetype</span>
                <span className="text-xs font-black text-amber-300">{activeKaraka.primaryArchetype}</span>
              </div>
            </div>

            {/* Interlocking Matrix Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">Conjoined (Same Sign):</span>
                <span className="text-xs font-bold text-slate-100 mt-0.5 block">
                  {activeKaraka.conjoinedPlanets.length ? activeKaraka.conjoinedPlanets.join(", ") : "Solitary"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">Trines (1-5-9 Energy):</span>
                <span className="text-xs font-bold text-emerald-300 mt-0.5 block">
                  {activeKaraka.trinePlanets.length ? activeKaraka.trinePlanets.join(", ") : "None"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">2nd House (Feeder):</span>
                <span className="text-xs font-bold text-cyan-300 mt-0.5 block">
                  {activeKaraka.secondHousePlanets.length ? activeKaraka.secondHousePlanets.join(", ") : "None"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">7th House (Mirror):</span>
                <span className="text-xs font-bold text-amber-300 mt-0.5 block">
                  {activeKaraka.seventhHousePlanets.length ? activeKaraka.seventhHousePlanets.join(", ") : "None"}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                <span className="text-emerald-300 font-bold block">🦜 Sage Shukacharya's Classical Synthesis:</span>
                <p className="text-slate-200 leading-relaxed">{activeKaraka.synthesis}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold block">💼 Career & Life Destiny Expression:</span>
                <p className="text-slate-300 leading-relaxed">{activeKaraka.careerAndDestinyImpact}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 4-DIRECTIONAL TRINE MATRIX */}
      {activeTab === "trines" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.directionalTrines.map((dt, idx) => (
            <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      {dt.direction}
                    </span>
                    <h4 className="text-base font-black text-slate-100 mt-0.5">{dt.sanskritName}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                    Power: {dt.strengthScore}%
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">Enclosed Zodiac Signs:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {dt.signs.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[11px]">
                          ♈ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Planets Situated in Triad:</span>
                    <span className="text-emerald-300 font-bold">
                      {dt.planetsPresent.length ? dt.planetsPresent.join(", ") : "None (Peaceful tranquility)"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Leading Luminary:</span>
                    <span className="text-amber-300 font-semibold">{dt.dominantPlanet}</span>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed pt-1">
                    {dt.lifeSignification}
                  </p>
                </div>
              </div>

              <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min(100, dt.strengthScore)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PAST LIFE KARMA & PARIHARAS */}
      {activeTab === "karma" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Past Life Karma Diagnosis & Classical Suka Pariharas</h4>
            <p className="text-xs text-slate-400">
              Sage Shukacharya's profound revelations on ancestral karmic debts (Rina) and merits (Punya).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.pastLifeKarma.map((k, idx) => (
              <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/40 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                    <span>☸️</span>
                    <span>{k.sanskritTitle}</span>
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                    Karmic Pattern
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block">Astrological Planetary Cause:</span>
                    <p className="text-slate-300 text-[11px] mt-0.5">{k.primaryPlanetaryCause}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block">Present Life Manifestation:</span>
                    <p className="text-slate-200 text-[11px] mt-0.5 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      {k.manifestationInPresentLife}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                    <strong className="text-amber-300 block mb-0.5">🕊️ Suka Nadi Classical Parihara (Remedy):</strong>
                    <span>{k.classicalSukaParihara}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: 12 & 30-YEAR NADI AGE PROGRESSION */}
      {activeTab === "cycles" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Nadi Age Progression Cycles (नाडी वयस् चक्र)</h4>
            <p className="text-xs text-slate-400">
              Jupiter 12-year developmental rounds and Saturn 30-year karmic rounds from Suka Nadi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {report.ageCycles.map((cyc, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-xs font-black text-slate-100">{cyc.ageWindow}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        cyc.cycleType.includes("Jupiter")
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : "bg-blue-950 text-blue-300 border border-blue-800"
                      }`}
                    >
                      {cyc.cycleType.split(" ")[0]}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-xs">
                    <div className="text-[10.5px] text-slate-400">
                      <strong className="text-slate-300">Activated Axis:</strong> {cyc.activatedHouses}
                    </div>
                    <p className="text-slate-200 text-[11px] leading-tight font-semibold mt-1">
                      {cyc.karmicMilestone}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-emerald-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80 mt-2 italic">
                  Guidance: {cyc.guidance}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
