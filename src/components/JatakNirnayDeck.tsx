"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateJatakNirnay } from "../engine/jatakNirnay";
import { JatakNirnayAnalysis } from "../engine/types";

export default function JatakNirnayDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"tripartite" | "vriddhi" | "kartari" | "remedies">("tripartite");
  const [partFilter, setPartFilter] = useState<"All" | "Part1" | "Part2">("All");
  const [selectedBhavaNum, setSelectedBhavaNum] = useState<number>(1);

  const report: JatakNirnayAnalysis = useMemo(() => {
    return evaluateJatakNirnay(ephemeris);
  }, [ephemeris]);

  const activeBhava = report.bhavaJudgements.find((b) => b.bhavaNum === selectedBhavaNum) || report.bhavaJudgements[0];

  const filteredBhavas = report.bhavaJudgements.filter((b) => {
    if (partFilter === "Part1") return b.part === "Part 1 (Bhavas 1-6)";
    if (partFilter === "Part2") return b.part === "Part 2 (Bhavas 7-12)";
    return true;
  });

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h2 className="text-lg font-bold text-slate-100">
              Dr. B.V. Raman's Jatak Nirnay (जातक निर्णय, Parts 1 & 2)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Definitive Tripartite House Judgement (भाव, भावेश, भावकारक), Bhava Vriddhi vs Nasha & Kartari Yogas.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Supreme Raman House</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🏆</span>
              <span>House {report.strongestBhava.bhavaNum} ({report.strongestBhava.compositeRamanScore}%)</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Flourishing Bhavas</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>📈</span>
              <span>{report.vriddhiNashaSummaries.filter((v) => v.status.includes("Vriddhi")).length} / 12 Houses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Raman Card */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950/20 to-slate-950 p-5 rounded-2xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
              Tripartite Synthesis (भाव 30% + भावेश 40% + भावकारक 30%)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Top Potency: House {report.strongestBhava.bhavaNum} ({report.strongestBhava.sanskritTitle})
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterNirnaySynthesis}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-indigo-400 uppercase font-bold block">Strongest Lord:</span>
            <span className="text-xs font-black text-slate-100 block mt-0.5">
              {report.strongestBhava.lordName} in House {report.strongestBhava.lordPlacementHouse} ({report.strongestBhava.lordScore}%)
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Strongest Karaka:</span>
            <span className="text-xs font-bold text-emerald-300 block mt-0.5">
              {report.strongestBhava.primaryKaraka} ({report.strongestBhava.karakaScore}%)
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("tripartite")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "tripartite"
              ? "bg-indigo-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🏛️ 12 Bhava Tripartite Judgement
        </button>
        <button
          onClick={() => setActiveTab("vriddhi")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "vriddhi"
              ? "bg-indigo-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          📈 Bhava Vriddhi & Nasha Engine
        </button>
        <button
          onClick={() => setActiveTab("kartari")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "kartari"
              ? "bg-indigo-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ✂️ Kartari Yogas Inspector
        </button>
        <button
          onClick={() => setActiveTab("remedies")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "remedies"
              ? "bg-indigo-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🕊️ Raman Remedial Navigator
        </button>
      </div>

      {/* TAB 1: 12 BHAVA TRIPARTITE JUDGEMENT */}
      {activeTab === "tripartite" && (
        <div className="space-y-4">
          {/* Part Filter Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setPartFilter("All")}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  partFilter === "All" ? "bg-indigo-700 text-white" : "bg-slate-900 text-slate-400"
                }`}
              >
                All 12 Bhavas
              </button>
              <button
                onClick={() => setPartFilter("Part1")}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  partFilter === "Part1" ? "bg-indigo-700 text-white" : "bg-slate-900 text-slate-400"
                }`}
              >
                Part 1: Houses 1 to 6 (तनु से अरि)
              </button>
              <button
                onClick={() => setPartFilter("Part2")}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  partFilter === "Part2" ? "bg-indigo-700 text-white" : "bg-slate-900 text-slate-400"
                }`}
              >
                Part 2: Houses 7 to 12 (कलत्र से व्यय)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bhava Selector List */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                {filteredBhavas.map((b) => {
                  const isSelected = selectedBhavaNum === b.bhavaNum;
                  const isUttama = b.potencyGrade.includes("Uttama");
                  return (
                    <div
                      key={b.bhavaNum}
                      onClick={() => setSelectedBhavaNum(b.bhavaNum)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-indigo-600/20 border-indigo-400 shadow-lg ring-1 ring-indigo-400"
                          : "bg-slate-950/60 border-slate-800 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-100">House {b.bhavaNum}</span>
                        <span
                          className={`text-[9px] font-bold px-1 rounded ${
                            isUttama ? "bg-indigo-950 text-indigo-300 border border-indigo-800" : "text-slate-400"
                          }`}
                        >
                          {b.compositeRamanScore}%
                        </span>
                      </div>
                      <div className="text-[10px] text-indigo-300 font-semibold truncate mt-1">
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
                  <span className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold">
                    {activeBhava.part}
                  </span>
                  <h4 className="text-base font-black text-slate-100 mt-0.5">
                    House {activeBhava.bhavaNum}: {activeBhava.sanskritTitle}
                  </h4>
                  <div className="text-xs text-indigo-300 font-medium mt-0.5">
                    Sign: {activeBhava.signName} • Lord: {activeBhava.lordName} in House {activeBhava.lordPlacementHouse} • Karaka: {activeBhava.primaryKaraka}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Composite Raman Potency</span>
                  <span className="text-xs font-black text-indigo-300">{activeBhava.potencyGrade} ({activeBhava.compositeRamanScore}%)</span>
                </div>
              </div>

              {/* Tripartite Breakdown (Bhava 30%, Lord 40%, Karaka 30%) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">1. भाव (Bhava - 30%):</span>
                  <span className="font-mono font-bold text-indigo-300 text-sm block">{activeBhava.bhavaScore}%</span>
                  <span className="text-[10px] text-slate-400 block">Occupants: {activeBhava.occupants.join(", ") || "None"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">2. भावेश (Lord - 40%):</span>
                  <span className="font-mono font-bold text-indigo-300 text-sm block">{activeBhava.lordScore}%</span>
                  <span className="text-[10px] text-slate-400 block">Lord {activeBhava.lordName} in H{activeBhava.lordPlacementHouse}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">3. भावकारक (Karaka - 30%):</span>
                  <span className="font-mono font-bold text-indigo-300 text-sm block">{activeBhava.karakaScore}%</span>
                  <span className="text-[10px] text-slate-400 block">Significator: {activeBhava.primaryKaraka}</span>
                </div>
              </div>

              {/* Life Predictions Box */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-1 text-xs">
                <span className="text-indigo-300 font-bold block">📖 Dr. B.V. Raman's House Judgement (फल विचार):</span>
                <p className="text-slate-200 leading-relaxed">{activeBhava.lifePredictions}</p>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Status: <strong className="text-indigo-300">{activeBhava.vriddhiNashaStatus}</strong>
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Kartari: <strong className="text-indigo-300">{activeBhava.kartariStatus}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BHAVA VRIDDHI & NASHA ENGINE */}
      {activeTab === "vriddhi" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Bhava Vriddhi & Bhava Nasha Analysis (भाव वृद्धि एवं भाव नाश)</h4>
            <p className="text-xs text-slate-400">
              Identification of houses experiencing auspicious expansion versus houses requiring conscious protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.vriddhiNashaSummaries.map((vn, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                  vn.status.includes("Vriddhi")
                    ? "bg-slate-950 border-emerald-500/40 shadow-xl"
                    : "bg-slate-950 border-rose-500/40 shadow-xl"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-black text-slate-100">
                      House {vn.bhavaNum}: {vn.sanskritTitle}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        vn.status.includes("Vriddhi")
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : "bg-rose-950 text-rose-300 border-rose-800"
                      }`}
                    >
                      {vn.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block mb-0.5">Astrological Basis (रमण सूत्र):</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                        {vn.astrologicalBasis}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-200">
                  <strong className="text-indigo-300 block mb-0.5">Manifestation & Guidance:</strong>
                  {vn.realWorldImpact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: KARTARI YOGAS INSPECTOR */}
      {activeTab === "kartari" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Shubha & Papa Kartari Yogas Inspector (शुभ-पाप कर्तरी योग)</h4>
            <p className="text-xs text-slate-400">
              Analysis of planetary scissors hemming houses between benefics (auspicious shield) or malefics (impediments).
            </p>
          </div>

          {report.kartariYogas.length === 0 ? (
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
              No strong Kartari (hemming) scissors formed across the 12 houses; planetary rays are distributed independently.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.kartariYogas.map((k, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                    k.kartariType === "Shubha Kartari"
                      ? "bg-slate-950 border-emerald-500/40 shadow-xl"
                      : "bg-slate-950 border-rose-500/40 shadow-xl"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-black text-slate-100">{k.targetName}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        k.kartariType === "Shubha Kartari"
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : "bg-rose-950 text-rose-300 border-rose-800"
                      }`}
                    >
                      {k.kartariType}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">12th to House:</span>
                      <span className="font-bold text-slate-200">{k.planets12th.join(", ") || "None"}</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">2nd to House:</span>
                      <span className="font-bold text-slate-200">{k.planets2nd.join(", ") || "None"}</span>
                    </div>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    {k.effect}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: RAMAN REMEDIAL NAVIGATOR */}
      {activeTab === "remedies" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Dr. B.V. Raman Classical Remedial Navigator (शास्त्रीय परिहार)</h4>
            <p className="text-xs text-slate-400">
              Targeted gemstone, mantra, and lifestyle remedial guidance for balancing and fortifying each Bhava.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.bhavaJudgements.map((b) => (
              <div key={b.bhavaNum} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-black text-slate-100">
                      House {b.bhavaNum}: {b.sanskritTitle.split(" ")[0]}
                    </h4>
                    <span className="text-xs font-mono font-bold text-indigo-300">
                      Score: {b.compositeRamanScore}%
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs">
                    <div className="text-slate-400">
                      Governing Lord: <strong className="text-slate-200">{b.lordName}</strong> • Karaka: <strong className="text-slate-200">{b.primaryKaraka}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs space-y-0.5">
                  <strong className="text-indigo-300 block">🕊️ Raman Shanti Prescription:</strong>
                  <span className="text-[11px] leading-relaxed">{b.ramanRemedy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
