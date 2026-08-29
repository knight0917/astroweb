"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateSugamJyotish } from "../engine/sugamJyotish";
import { SugamJyotishAnalysis } from "../engine/types";

export default function SugamJyotishDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"bhavas" | "avasthas" | "kartari" | "remedies">("bhavas");
  const [selectedBhavaNum, setSelectedBhavaNum] = useState<number>(1);

  const report: SugamJyotishAnalysis = useMemo(() => {
    return evaluateSugamJyotish(ephemeris);
  }, [ephemeris]);

  const activeBhava = report.bhavaDiagnostics.find((b) => b.bhavaNum === selectedBhavaNum) || report.bhavaDiagnostics[0];
  const yuvaCount = report.baladiAvasthas.filter((a) => a.avasthaName.includes("Yuva")).length;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <h2 className="text-lg font-bold text-slate-100">
              Sugam Jyotish (सुगम ज्योतिष — Practical Predictive Manual)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Accessible, Real-World Astrology: 12-Bhava Practical Scores, Baladi Avastha Potency & Everyday Remedies.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Yuva (100% Potency)</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>⚡</span>
              <span>{yuvaCount} of 9 Grahas</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/40 text-center">
            <div className="text-[9px] text-cyan-400 uppercase tracking-wider font-bold">Kartari Shield</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🛡️</span>
              <span>{report.kartariAnalysis[0]?.kartariType.split(" (")[0] || "Open"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950/20 to-slate-950 p-5 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              Sugam Practical Synthesis (सुगम ज्योतिषीय महा निष्कर्ष)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Everyday Practical Astrology & Fruition
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterSugamSynthesis}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Top Practical House:</span>
            <span className="text-xs font-black text-slate-100 block mt-0.5">
              House {report.bhavaDiagnostics.slice().sort((a, b) => b.practicalScore - a.practicalScore)[0]?.bhavaNum} ({report.bhavaDiagnostics.slice().sort((a, b) => b.practicalScore - a.practicalScore)[0]?.practicalScore}%)
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Accessible Remedies:</span>
            <span className="text-xs font-bold text-emerald-300 block mt-0.5">
              9 Tailored Daily Pariharas Available
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("bhavas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "bhavas"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🏛️ 12 Bhavas Practical Diagnostics
        </button>
        <button
          onClick={() => setActiveTab("avasthas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "avasthas"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⚡ Baladi Avastha Potency Meter
        </button>
        <button
          onClick={() => setActiveTab("kartari")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "kartari"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🛡️ Subha/Papa Kartari Shield
        </button>
        <button
          onClick={() => setActiveTab("remedies")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "remedies"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌿 Sugam Everyday Remedies
        </button>
      </div>

      {/* TAB 1: 12 BHAVAS PRACTICAL DIAGNOSTICS */}
      {activeTab === "bhavas" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bhava Selector */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Select House (द्वादश भाव)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {report.bhavaDiagnostics.map((b) => {
                const isSelected = selectedBhavaNum === b.bhavaNum;
                const isAtiUttama = b.practicalGrade.includes("Ati-Uttama");
                return (
                  <div
                    key={b.bhavaNum}
                    onClick={() => setSelectedBhavaNum(b.bhavaNum)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-emerald-600/20 border-emerald-400 shadow-lg ring-1 ring-emerald-400"
                        : "bg-slate-950/60 border-slate-800 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-100">House {b.bhavaNum}</span>
                      <span
                        className={`text-[9px] font-bold px-1 rounded ${
                          isAtiUttama ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "text-slate-400"
                        }`}
                      >
                        {b.practicalScore}%
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-300 font-semibold truncate mt-1">
                      {b.sanskritTitle.split(". ")[1]?.split(" (")[0]}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">
                      {b.signName} ({b.lordName})
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
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                  Sugam Practical Analysis (House {activeBhava.bhavaNum})
                </span>
                <h4 className="text-base font-black text-slate-100 mt-0.5">
                  {activeBhava.sanskritTitle}
                </h4>
                <div className="text-xs text-emerald-300 font-medium mt-0.5">
                  Sign: {activeBhava.signName} • Lord: {activeBhava.lordName} • Karaka: {activeBhava.karakaPlanet}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Practical Grade</span>
                <span className="text-xs font-black text-emerald-300">{activeBhava.practicalGrade} ({activeBhava.practicalScore}%)</span>
              </div>
            </div>

            {/* Practical Outcome */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <span className="text-emerald-400 font-bold block">📈 Real-World Outcome:</span>
              <p className="text-slate-200 leading-relaxed">{activeBhava.practicalOutcome}</p>
            </div>

            {/* Actionable Advice */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1">
              <span className="text-emerald-300 font-bold block">💡 Actionable Everyday Advice:</span>
              <p className="text-slate-300 leading-relaxed">{activeBhava.actionableAdvice}</p>
            </div>

            {/* Score Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Practical Manifestation Capacity:</span>
                <span className="text-emerald-400">{activeBhava.practicalScore}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${activeBhava.practicalScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BALADI AVASTHA POTENCY METER */}
      {activeTab === "avasthas" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Baladi Avastha Potency Meter (ग्रह बाल्यादि अवस्था)</h4>
            <p className="text-xs text-slate-400">
              Mathematical capacity percentage: Yuva (100%), Kumara (75%), Bala (25%), Vriddha (10%), Mrita (0%).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.baladiAvasthas.map((a, idx) => {
              const isYuva = a.avasthaName.includes("Yuva");
              const isKumara = a.avasthaName.includes("Kumara");
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                    isYuva
                      ? "bg-slate-950 border-emerald-500/40 shadow-xl ring-1 ring-emerald-500/30"
                      : isKumara
                      ? "bg-slate-950 border-cyan-500/30"
                      : "bg-slate-950/60 border-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <h4 className="text-sm font-black text-slate-100">{a.planetName}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{a.degreesInSign}° in sign</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isYuva
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                            : isKumara
                            ? "bg-cyan-950 text-cyan-300 border-cyan-800"
                            : "bg-slate-900 text-slate-400 border-slate-800"
                        }`}
                      >
                        {a.avasthaName}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                      {a.manifestationSpeed}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-400">Potency Capacity:</span>
                      <span className="text-emerald-400">{a.potencyPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-emerald-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${a.potencyPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: KARTARI SHIELD */}
      {activeTab === "kartari" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Subha & Papa Kartari Flanking Analysis (शुभ/पाप कर्तरी)</h4>
            <p className="text-xs text-slate-400">
              Evaluates whether key pillars are protected by flanking benefics or pressured by flanking malefics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.kartariAnalysis.map((k, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-black text-slate-100">{k.focusBhava}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-300">
                    {k.kartariType}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {k.effectSummary}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">12th House Flank:</span>
                    <span className="text-slate-200 font-medium">{k.flankingPlanets12th.join(", ") || "Empty"}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">2nd House Flank:</span>
                    <span className="text-slate-200 font-medium">{k.flankingPlanets2nd.join(", ") || "Empty"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUGAM EVERYDAY REMEDIES */}
      {activeTab === "remedies" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Sugam Everyday Remedies (सुगम ज्योतिषीय दैनिक एवं सरल उपाय)</h4>
            <p className="text-xs text-slate-400">
              Pragmatic, zero-cost / low-cost daily pariharas tailored for lasting planetary harmony.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.practicalRemedies.map((r, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-black text-emerald-300">{r.grahaName}</h4>
                  </div>

                  <div className="text-xs text-slate-200">
                    <span className="text-emerald-400 font-bold block mb-0.5">🌿 Daily Easy Ritual:</span>
                    <p className="leading-relaxed">{r.easyRemedy}</p>
                  </div>

                  <div className="text-xs text-slate-300">
                    <span className="text-amber-400 font-bold block mb-0.5">🕉️ Simple Mantra:</span>
                    <p className="font-mono text-[11px] text-amber-200">{r.mantra}</p>
                  </div>

                  <div className="text-xs text-slate-300">
                    <span className="text-cyan-400 font-bold block mb-0.5">🕊️ Donation / Seva:</span>
                    <p>{r.donationItem}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  <span className="font-bold text-emerald-400">Conduct: </span>
                  {r.behavioralParihara}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
