"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateRaman300Combinations, evaluateLalKitabTeva, evaluateNarayanaKavacham } from "../engine/raman300Combinations";
import { Raman300Analysis, LalKitabAnalysis, NarayanaKavachamAnalysis } from "../engine/types";

export default function Raman300CombinationsDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"yogas" | "lalkitab" | "kavacham">("yogas");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const ramanReport: Raman300Analysis = useMemo(() => evaluateRaman300Combinations(ephemeris), [ephemeris]);
  const lalKitabReport: LalKitabAnalysis = useMemo(() => evaluateLalKitabTeva(ephemeris), [ephemeris]);
  const kavachamReport: NarayanaKavachamAnalysis = useMemo(() => evaluateNarayanaKavacham(ephemeris), [ephemeris]);

  const filteredYogas = useMemo(() => {
    if (filterCategory === "ALL") return ramanReport.activeYogas;
    return ramanReport.activeYogas.filter((y) => y.category === filterCategory);
  }, [ramanReport.activeYogas, filterCategory]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            <h2 className="text-lg font-bold text-slate-100">
              Dr. B.V. Raman 300 Important Combinations & Lal Kitab Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Encyclopedia of 300 Classical Sanskrit Yogas, Lal Kitab Teva Archetypes & Sri Narayana Kavacham 9-Graha Armor.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Active Raman Yogas</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🌟</span>
              <span>{ramanReport.totalActiveCount} Combinations</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Raja Yoga Score</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>👑</span>
              <span>{ramanReport.rajaYogaScore}% Power</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/40 text-center">
            <div className="text-[9px] text-cyan-400 uppercase tracking-wider font-bold">Lal Kitab Teva</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>📜</span>
              <span>{lalKitabReport.tevaType.split(" ")[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("yogas")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "yogas"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>🌟</span>
          <span>300 Important Combinations</span>
        </button>

        <button
          onClick={() => setActiveTab("lalkitab")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "lalkitab"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>📜</span>
          <span>Lal Kitab Teva Archetypes</span>
        </button>

        <button
          onClick={() => setActiveTab("kavacham")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "kavacham"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>🛡️</span>
          <span>Sri Narayana Kavacham Armor</span>
        </button>
      </div>

      {/* TAB 1: 300 IMPORTANT COMBINATIONS */}
      {activeTab === "yogas" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">🌟</span>
            <div>
              <span className="font-bold text-amber-400">Dr. B.V. Raman 300 Yogas Mastery:</span> Evaluates classical configurations including Parijata, Parvata, Kahala, Srikanta, Srinatha, Viranchi, and Saraswati Yogas to determine life promises.
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {["ALL", "Raja Yoga", "Dhana Yoga", "Spiritual / Wisdom"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterCategory === cat
                    ? "bg-amber-500 text-slate-950 font-black"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Yogas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredYogas.map((yoga) => (
              <div
                key={yoga.combinationNumber}
                className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">Yoga #{yoga.combinationNumber}</span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                    yoga.category === "Raja Yoga"
                      ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                      : yoga.category === "Dhana Yoga"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                      : "bg-cyan-950 text-cyan-300 border border-cyan-500/40"
                  }`}>
                    {yoga.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-100">{yoga.yogaName}</h3>
                  <div className="text-xs text-amber-300/80 font-serif italic mt-0.5">{yoga.sanskritTitle}</div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Classical Formula:</span>
                  {yoga.classicalFormula}
                </div>

                <p className="text-xs text-emerald-300/90 leading-relaxed">
                  ✨ <strong className="text-slate-200">Life Manifestation:</strong> {yoga.lifeFruition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LAL KITAB TEVA ARCHETYPES */}
      {activeTab === "lalkitab" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">📜</span>
            <div>
              <span className="font-bold text-cyan-400">Lal Kitab Teva Diagnostics:</span> Analyzes unique planetary configurations classifying the chart into Dharmi Teva (Divine Shield), Andhi Kundli (Blind Chart), or Kayam Teva.
            </div>
          </div>

          {/* Active Teva Card */}
          <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/40 p-5 rounded-2xl flex flex-col gap-3">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Identified Chart Archetype</span>
            <h3 className="text-base font-bold text-slate-100">{lalKitabReport.tevaType}</h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              {lalKitabReport.tevaSignification}
            </p>
          </div>

          {/* Karmic Debts (Rina) */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              Karmic Debts (Purva Janma Rina Clearance)
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {lalKitabReport.karmicRinaDebts.map((r, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-400">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Targeted Remedies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lalKitabReport.targetedLalKitabRemedies.map((rem, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 leading-relaxed">
                {rem}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SRI NARAYANA KAVACHAM ARMOR */}
      {activeTab === "kavacham" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">🛡️</span>
            <div>
              <span className="font-bold text-emerald-400">Sri Narayana Kavacham:</span> The sacred armor of Lord Narayana from Srimad Bhagavatam (Canto 6, Ch. 8). Protects all 9 planetary domains through specialized divine forms.
            </div>
          </div>

          {/* Shields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {kavachamReport.shields.map((s) => (
              <div
                key={s.planetName}
                className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-2"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-200">{s.planetName}</span>
                  <span className="text-[10px] text-amber-300 font-bold">{s.narayanaForm}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-serif italic">"{s.sanskritArmorVerse}"</div>
                <p className="text-xs text-emerald-300 mt-1">{s.protectiveShieldBenefit}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
