"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateMeenaNadi } from "../engine/meenaNadi";
import { evaluateJatakaTattvam } from "../engine/jatakaTattvam";
import { evaluatePadmaChakra } from "../engine/padmaChakra";
import { MeenaNadiAnalysis, JatakaTattvamAnalysis, PadmaChakraAnalysis } from "../engine/types";

export default function NadiMasterDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"meena" | "tattvam" | "padma">("meena");

  const meenaReport: MeenaNadiAnalysis = useMemo(() => evaluateMeenaNadi(ephemeris), [ephemeris]);
  const tattvamReport: JatakaTattvamAnalysis = useMemo(() => evaluateJatakaTattvam(ephemeris), [ephemeris]);
  const padmaReport: PadmaChakraAnalysis = useMemo(() => evaluatePadmaChakra(ephemeris), [ephemeris]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <h2 className="text-lg font-bold text-slate-100">
              Classical Nadi Jyotish Master Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Meena Nadi Jeeva-Sareera Stellar Engine, Mahadeva's Jataka Tattvam (5 Vivekas), & D12 Padma Chakra Ancestral Mandala.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Meena Alignment</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🌿</span>
              <span>{Object.values(meenaReport.planets).filter((p) => p.vitalityGrade.includes("100%")).length} Purna Lords</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Active Tattvam Sutras</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>📖</span>
              <span>{tattvamReport.activeSutras.filter((s) => s.isActivated).length} Sutras</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-purple-500/40 text-center">
            <div className="text-[9px] text-purple-400 uppercase tracking-wider font-bold">D12 Ancestral Grace</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🪷</span>
              <span>{padmaReport.ancestralBlessingScore}% Grace</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("meena")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "meena"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>🌿</span>
          <span>Meena Nadi (Jeeva & Sareera)</span>
        </button>

        <button
          onClick={() => setActiveTab("tattvam")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "tattvam"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>📜</span>
          <span>Jataka Tattvam (5 Vivekas)</span>
        </button>

        <button
          onClick={() => setActiveTab("padma")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "padma"
              ? "bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>🪷</span>
          <span>D-12 Padma Chakra (Adityas)</span>
        </button>
      </div>

      {/* TAB 1: MEENA NADI */}
      {activeTab === "meena" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">💡</span>
            <div>
              <span className="font-bold text-amber-400">Meena Nadi Stellar Principle:</span> Every planet's fruit manifests through its <strong>Jeeva (Soul - Nakshatra Lord)</strong> and its physical container <strong>Sareera (Body - Sub-Lord)</strong>. When both are fortified, results occur effortlessly.
            </div>
          </div>

          {/* Planets Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="p-3">Graha & Pos</th>
                  <th className="p-3">Nakshatra</th>
                  <th className="p-3">Jeeva (Soul Lord)</th>
                  <th className="p-3">Sareera (Body Lord)</th>
                  <th className="p-3">Vitality Grade</th>
                  <th className="p-3">Fruit Manifestation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {Object.values(meenaReport.planets).map((p) => (
                  <tr key={p.planetName} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-100">
                      {p.planetName} <span className="text-[10px] text-slate-400 font-mono">({p.signName} {p.degree}°)</span>
                    </td>
                    <td className="p-3 text-slate-300">
                      {p.nakshatraName} <span className="text-[10px] text-amber-400">({p.nakshatraLord})</span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-emerald-300">{p.jeevaPlanet}</div>
                      <div className="text-[10px] text-slate-400">H{p.jeevaHouse} in {p.jeevaSign} • {p.jeevaDignity}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-cyan-300">{p.sareeraPlanet}</div>
                      <div className="text-[10px] text-slate-400">H{p.sareeraHouse} in {p.sareeraSign} • {p.sareeraDignity}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.vitalityGrade.includes("100%")
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                          : p.vitalityGrade.includes("60%")
                          ? "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                          : p.vitalityGrade.includes("20%")
                          ? "bg-orange-950/80 text-orange-300 border border-orange-500/40"
                          : "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                      }`}>
                        {p.vitalityGrade}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 text-[11px] max-w-xs">
                      {p.fruitOutcome}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 6 Domain Promises Cards */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <span>🎯</span>
              <span>6 Fundamental Life Domain Promises</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {meenaReport.domainPromises.map((d) => (
                <div key={d.domain} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-xs">{d.domain}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 border border-slate-700">
                      {d.promiseGrade}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <strong>Jeeva:</strong> <span className="text-emerald-300">{d.jeevaLord}</span> | <strong>Sareera:</strong> <span className="text-cyan-300">{d.sareeraLord}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{d.nadiGuidance}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vipat, Pratyak, Vadha Afflictions */}
          {meenaReport.vipatPratyakVadhaAfflictions.length > 0 && (
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4">
              <h4 className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-1.5">
                <span>⚠️</span>
                <span>Special Tara Affliction Cautions (Vipat / Pratyak / Vadha)</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {meenaReport.vipatPratyakVadhaAfflictions.map((aff, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-400">•</span>
                    <span>{aff}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: JATAKA TATTVAM */}
      {activeTab === "tattvam" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">📜</span>
            <div>
              <span className="font-bold text-emerald-400">Mahadeva's Jataka Tattvam:</span> Classical Sanskrit aphorisms spanning 5 Vivekas (Samjna, Sutika, Prakirna Raja/Dhana Yogas, Stri Jataka, and 12 Bhavas Sutras).
            </div>
          </div>

          {/* 12 Bhavas Health Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <span>🏛️</span>
              <span>12 Bhavas Classical Sutra Health Scores</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {tattvamReport.bhavaScores.map((b) => (
                <div key={b.bhavaNumber} className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100">House {b.bhavaNumber}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      b.compositeHealth >= 80 ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40" : "bg-amber-950 text-amber-300 border border-amber-500/40"
                    }`}>
                      {b.compositeHealth}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium">{b.bhavaName}</div>
                  <div className="text-[10px] text-slate-400">Lord: <strong className="text-slate-200">{b.bhavaLord}</strong> • {b.verdict}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Classical Sutras Feed */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <span>🪶</span>
              <span>Activated Classical Aphorisms (Sutras)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tattvamReport.activeSutras.map((s) => (
                <div key={s.id} className={`p-4 rounded-xl border flex flex-col gap-2 ${
                  s.isActivated ? "bg-slate-900/80 border-emerald-500/40" : "bg-slate-950/40 border-slate-800 opacity-60"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                      {s.viveka} Viveka
                    </span>
                    <span className={`text-[10px] font-bold ${s.isActivated ? "text-emerald-400" : "text-slate-500"}`}>
                      {s.isActivated ? "✨ Active" : "Dormant"}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-amber-200/90 font-serif">
                    {s.sanskritSutra}
                  </div>
                  <div className="text-xs text-slate-300">
                    {s.englishTranslation}
                  </div>
                  <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5 mt-1">
                    🎯 {s.lifeSignification}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: D12 PADMA CHAKRA */}
      {activeTab === "padma" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">🪷</span>
            <div>
              <span className="font-bold text-purple-400">D-12 Padma Chakra (Dwadasamsa Nadi):</span> 12-Petal Lotus governed by the 12 Solar Sovereigns (Adityas). Reveals Paternal (Pitru) lineage, Maternal (Matru) grace, and ancestral karmic debts.
            </div>
          </div>

          {/* Lineage Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/40 p-4 rounded-xl flex flex-col gap-1">
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Paternal Lineage (Sun D12)</span>
              <span className="text-sm font-bold text-slate-100">{padmaReport.sunFatherLineagePetal}</span>
              <span className="text-[11px] text-slate-300 mt-1">Inherited strength, executive presence, and paternal ancestral honor.</span>
            </div>

            <div className="bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/40 p-4 rounded-xl flex flex-col gap-1">
              <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">Maternal Lineage (Moon D12)</span>
              <span className="text-sm font-bold text-slate-100">{padmaReport.moonMotherLineagePetal}</span>
              <span className="text-[11px] text-slate-300 mt-1">Maternal intuition, emotional grace, and domestic prosperity.</span>
            </div>

            <div className="bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/40 p-4 rounded-xl flex flex-col gap-1">
              <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">Ascendant Lotus Anchor</span>
              <span className="text-sm font-bold text-slate-100">{padmaReport.lagnaPetalAditya}</span>
              <span className="text-[11px] text-slate-300 mt-1">Core ancestral mission and foundational spiritual archetype.</span>
            </div>
          </div>

          {/* 12 Petals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {padmaReport.petals.map((petal) => (
              <div key={petal.petalNumber} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">
                    Petal {petal.petalNumber} • {petal.solarAditya}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {petal.rashiName}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">{petal.adityaSignification}</div>
                {petal.occupyingPlanets.length > 0 && (
                  <div className="text-xs font-semibold text-amber-300">
                    Occupants: {petal.occupyingPlanets.join(", ")}
                  </div>
                )}
                <div className="text-xs text-slate-300 border-t border-slate-800/80 pt-2 mt-1">
                  {petal.lifeBlessing}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
