"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateSarvarthaChintamani } from "../engine/sarvarthaChintamani";
import { SarvarthaChintamaniAnalysis } from "../engine/types";

export default function SarvarthaChintamaniDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"bhavas" | "yogas" | "bhagyodaya" | "tribhaga">("bhavas");
  const [selectedBhavaNum, setSelectedBhavaNum] = useState<number>(1);

  const report: SarvarthaChintamaniAnalysis = useMemo(() => {
    return evaluateSarvarthaChintamani(ephemeris);
  }, [ephemeris]);

  const activeBhava = report.bhavaPredictions.find((b) => b.bhavaNum === selectedBhavaNum) || report.bhavaPredictions[0];
  const activeYogasCount = report.specialYogas.filter((y) => y.isFormed).length;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💎</span>
            <h2 className="text-lg font-bold text-slate-100">
              Sarvartha Chintamani (सर्वार्थ चिन्तामणि - 13 Adhyayas)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Venkatesha Sharma's Crown Jewel: 12-Bhava Wish-Fulfillment, Special Classical Yogas & Bhagyodaya Timeline.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Active Special Yogas</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>👑</span>
              <span>{activeYogasCount} of 8 Yogas Active</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/40 text-center">
            <div className="text-[9px] text-cyan-400 uppercase tracking-wider font-bold">Top Bhagyodaya Age</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>⏳</span>
              <span>Age 28 & 32</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              Sarvartha Chintamani Master Synthesis (सर्वार्थ चिन्तामणि महा निर्णय)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              12 Bhavas Wish-Fulfilling Potency
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterChintamaniSynthesis}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Top Active Classical Yoga:</span>
            <span className="text-xs font-black text-slate-100 block mt-0.5">
              {report.specialYogas.find((y) => y.isFormed)?.yogaName || "Kendra-Trikona Alignment"}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">House 10 Rajya Prapti:</span>
            <span className="text-xs font-bold text-emerald-300 block mt-0.5">
              {report.bhavaPredictions[9]?.fulfillmentGrade.split(" (")[0] || "Uttama"} ({report.bhavaPredictions[9]?.chintamaniScore}%)
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
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🏛️ 12 Bhavas Chintamani
        </button>
        <button
          onClick={() => setActiveTab("yogas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "yogas"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          👑 Special Classical Yogas (8)
        </button>
        <button
          onClick={() => setActiveTab("bhagyodaya")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "bhagyodaya"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⏳ Bhagyodaya Age Timeline
        </button>
        <button
          onClick={() => setActiveTab("tribhaga")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "tribhaga"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          📐 Tri-Bhaga Potency (त्रिभाग)
        </button>
      </div>

      {/* TAB 1: 12 BHAVAS CHINTAMANI */}
      {activeTab === "bhavas" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bhava Selector */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Select House (द्वादश भाव)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {report.bhavaPredictions.map((b) => {
                const isSelected = selectedBhavaNum === b.bhavaNum;
                const isUttama = b.fulfillmentGrade.includes("Uttama");
                return (
                  <div
                    key={b.bhavaNum}
                    onClick={() => setSelectedBhavaNum(b.bhavaNum)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-amber-600/20 border-amber-400 shadow-lg ring-1 ring-amber-400"
                        : "bg-slate-950/60 border-slate-800 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-100">House {b.bhavaNum}</span>
                      <span
                        className={`text-[9px] font-bold px-1 rounded ${
                          isUttama ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "text-slate-400"
                        }`}
                      >
                        {b.chintamaniScore}%
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-300 font-semibold truncate mt-1">
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
                <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">
                  Sarvartha Chintamani Analysis (House {activeBhava.bhavaNum})
                </span>
                <h4 className="text-base font-black text-slate-100 mt-0.5">
                  {activeBhava.sanskritTitle}
                </h4>
                <div className="text-xs text-amber-300 font-medium mt-0.5">
                  Sign: {activeBhava.signName} • Lord: {activeBhava.lordName}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Fulfillment Grade</span>
                <span className="text-xs font-black text-amber-300">{activeBhava.fulfillmentGrade} ({activeBhava.chintamaniScore}%)</span>
              </div>
            </div>

            {/* Primary Prediction */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <span className="text-emerald-400 font-bold block">✨ Venkatesha Sharma Prediction:</span>
              <p className="text-slate-200 leading-relaxed">{activeBhava.primaryPrediction}</p>
            </div>

            {/* Classical Citation Box */}
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs flex items-center justify-between">
              <span className="text-slate-400 font-bold">📜 Classical Citation:</span>
              <span className="text-amber-300 font-mono font-bold">{activeBhava.classicalShloka}</span>
            </div>

            {/* Score Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Wish-Fulfillment Potency:</span>
                <span className="text-amber-400">{activeBhava.chintamaniScore}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${activeBhava.chintamaniScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SPECIAL CLASSICAL YOGAS */}
      {activeTab === "yogas" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Special Classical Yogas of Sarvartha Chintamani (विशिष्ट राजयोग)</h4>
            <p className="text-xs text-slate-400">
              The 8 rare, monumental planetary yogas granting sovereign command, Lakshmi's grace, and universal renown.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.specialYogas.map((yoga, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                  yoga.isFormed
                    ? "bg-slate-950 border-amber-500/40 shadow-xl ring-1 ring-amber-500/30"
                    : "bg-slate-950/50 border-slate-800 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                        Yoga #{idx + 1}
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
                      {yoga.isFormed ? "Active Yoga" : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                    {yoga.classicalEffect}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                  <span className="font-bold text-slate-300">Rule: </span>
                  {yoga.formationRule}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BHAGYODAYA AGE TIMELINE */}
      {activeTab === "bhagyodaya" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Bhagyodaya Fortune Rise Age Timeline (भाग्योदय वर्ष - Adhyaya 9)</h4>
            <p className="text-xs text-slate-400">
              Venkatesha Sharma's precise age triggers when planetary potential unlocks quantum leaps in fortune and authority.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {report.bhagyodayaAges.map((age, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all space-y-2 flex flex-col justify-between ${
                  age.isActive
                    ? "bg-slate-950 border-amber-500/40 shadow-xl ring-1 ring-amber-500/30"
                    : "bg-slate-950/60 border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-lg font-black text-amber-300">Age {age.ageYear}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{age.triggerPlanet}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">
                    {age.fortuneManifestation}
                  </p>
                </div>

                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  {age.isActive ? "⚡ Prime Elevation Year" : "Steady Maturation"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TRI-BHAGA HOUSE SPHUTAS */}
      {activeTab === "tribhaga" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Tri-Bhaga House Sphuta Potency (भाव त्रिभाग फल)</h4>
            <p className="text-xs text-slate-400">
              Venkatesha Sharma's tripartite division of houses into Early (0°-10°), Middle (10°-20°), and Late (20°-30°) life stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.triBhagaAnalysis.map((t, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="border-b border-slate-800 pb-2">
                  <span className="text-[10px] text-amber-400 uppercase font-bold">House {t.bhavaNum} Tri-Bhaga</span>
                  <h4 className="text-sm font-black text-slate-100 mt-0.5">{report.bhavaPredictions[t.bhavaNum - 1]?.sanskritTitle}</h4>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-cyan-400 font-bold block mb-0.5">1. Prathama Bhaga (Early Life Span):</span>
                    <p className="text-slate-300">{t.prathamaThirdEffect}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-amber-400 font-bold block mb-0.5">2. Madhyama Bhaga (Peak Maturity):</span>
                    <p className="text-slate-300">{t.madhyamaThirdEffect}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-emerald-400 font-bold block mb-0.5">3. Uttama Bhaga (Elder / Legacy Span):</span>
                    <p className="text-slate-300">{t.uttamaThirdEffect}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
