"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateJatakaAlankara } from "../engine/jatakaAlankara";
import { JatakaAlankaraAnalysis } from "../engine/types";

export default function JatakaAlankaraDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"bhavas" | "yogas" | "disease" | "marital">("bhavas");
  const [selectedBhavaNum, setSelectedBhavaNum] = useState<number>(1);

  const report: JatakaAlankaraAnalysis = useMemo(() => {
    return evaluateJatakaAlankara(ephemeris);
  }, [ephemeris]);

  const activeBhava = report.bhavaAlankaras.find((b) => b.bhavaNum === selectedBhavaNum) || report.bhavaAlankaras[0];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <h2 className="text-lg font-bold text-slate-100">
              Acharya Ganesh Kavi's Jataka Alankara (जातकालंकार, 1613 CE)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Classical 12 Bhavas Ornamentation Matrix, Special Raja & Dhana Yogas, Disease / Arishta Diagnostics & Stri Jataka.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Supreme House Alankara</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🏆</span>
              <span>House {report.strongestBhava.bhavaNum} ({report.strongestBhava.alankaraScore}%)</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Marital Saubhagya</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>💍</span>
              <span>{report.maritalFortune.saubhagyaScore}% Index</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Alankara Card */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              {report.strongestBhava.shlokaReference}
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Apex Ornamentation: {report.strongestBhava.sanskritTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterAlankaraSynthesis}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Top Active Raja Yoga:</span>
            <span className="text-xs font-black text-slate-100 block mt-0.5">
              {report.specialYogas.find((y) => y.isFormed)?.yogaName || "Dhiman Yoga"}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Ornamentation Grade:</span>
            <span className="text-xs font-bold text-emerald-300 block mt-0.5">
              {report.strongestBhava.ornamentationGrade}
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
          🏛️ 12 Bhava Alankara Matrix
        </button>
        <button
          onClick={() => setActiveTab("yogas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "yogas"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          👑 Special Raja & Dhana Yogas
        </button>
        <button
          onClick={() => setActiveTab("disease")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "disease"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🛡️ Arishta & Disease Shield
        </button>
        <button
          onClick={() => setActiveTab("marital")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "marital"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          💍 Stri Jataka & Marital Fortune
        </button>
      </div>

      {/* TAB 1: 12 BHAVA ALANKARA MATRIX */}
      {activeTab === "bhavas" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bhava Selector */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Select House (भाव) to Inspect
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {report.bhavaAlankaras.map((b) => {
                const isSelected = selectedBhavaNum === b.bhavaNum;
                const isUttama = b.ornamentationGrade.includes("Uttama");
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
                          isUttama ? "bg-amber-950 text-amber-300 border border-amber-800" : "text-slate-400"
                        }`}
                      >
                        {b.alankaraScore}%
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-400 font-semibold truncate mt-1">
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
                <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">
                  {activeBhava.shlokaReference}
                </span>
                <h4 className="text-base font-black text-slate-100 mt-0.5">
                  House {activeBhava.bhavaNum}: {activeBhava.sanskritTitle}
                </h4>
                <div className="text-xs text-amber-300 font-medium mt-0.5">
                  Sign: {activeBhava.signName} • Lord: {activeBhava.lordName} in House {activeBhava.lordPlacementHouse}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Ornamentation Grade</span>
                <span className="text-xs font-black text-amber-300">{activeBhava.ornamentationGrade} ({activeBhava.alankaraScore}%)</span>
              </div>
            </div>

            {/* Occupants & Parashari Aspects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-bold block">Resident Natal Planets:</span>
                <span className="text-slate-100 font-semibold mt-0.5 block">
                  {activeBhava.occupants.length ? activeBhava.occupants.join(", ") : "None (Unoccupied)"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-bold block">Aspecting Planets (Drishti):</span>
                <span className="text-amber-300 font-semibold mt-0.5 block">
                  {activeBhava.aspectingPlanets.length ? activeBhava.aspectingPlanets.join(", ") : "None"}
                </span>
              </div>
            </div>

            {/* Classical Phala Box */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1 text-xs">
              <span className="text-amber-300 font-bold block">📜 Ganesh Kavi's Classical Bhava Phala:</span>
              <p className="text-slate-200 leading-relaxed">{activeBhava.classicalPhala}</p>
            </div>

            {/* Alankara Score Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">House Alankara Strength:</span>
                <span className="text-amber-400">{activeBhava.alankaraScore}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${activeBhava.alankaraScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SPECIAL RAJA & DHANA YOGAS */}
      {activeTab === "yogas" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Jataka Alankara Special Raja, Dhana & Jnana Yogas</h4>
            <p className="text-xs text-slate-400">
              Celebrated combinations from Chapter 3 of Jataka Alankara granting sovereignty, wisdom, and victory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.specialYogas.map((yoga, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                  yoga.isFormed
                    ? "bg-slate-950 border-amber-500/40 shadow-xl ring-1 ring-amber-500/30"
                    : "bg-slate-950/50 border-slate-800 opacity-75"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                        {yoga.category}
                      </span>
                      <h4 className="text-sm font-black text-slate-100 mt-0.5">{yoga.yogaName}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                        yoga.isFormed
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : "bg-slate-900 text-slate-400 border-slate-800"
                      }`}
                    >
                      {yoga.isFormed ? "FORMED" : "DORMANT"}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold">Participating Planets:</span>
                      <span className="text-amber-300 font-semibold ml-1.5">
                        {yoga.participatingPlanets.join(", ")}
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {yoga.description}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-200 italic">
                  <strong className="text-amber-300 not-italic block mb-0.5">Classical Effect:</strong>
                  {yoga.classicalShlokaEffect}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ARISHTA & DISEASE SHIELD */}
      {activeTab === "disease" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Arishta & Disease Diagnostics (रोग एवं अरिष्ट निर्णय)</h4>
            <p className="text-xs text-slate-400">
              Ganesh Kavi's medical astrological vulnerability analysis from Chapter 4 of Jataka Alankara.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.diseaseDiagnostics.map((d, idx) => (
              <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-black text-slate-100">{d.diseaseCategory}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        d.vulnerabilityLevel === "Low"
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : d.vulnerabilityLevel === "Moderate"
                          ? "bg-amber-950 text-amber-300 border-amber-800"
                          : "bg-rose-950 text-rose-300 border-rose-800"
                      }`}
                    >
                      {d.vulnerabilityLevel} Vulnerability
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block mb-0.5">Astrological Shloka Diagnostic:</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                        {d.astrologicalCause}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs space-y-0.5">
                  <strong className="text-amber-300 block">🕊️ Ganesh Kavi Shanti Remedy:</strong>
                  <span className="text-[11px] leading-relaxed">{d.classicalRemedy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STRI JATAKA & MARITAL FORTUNE */}
      {activeTab === "marital" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Stri Jataka & Marital Fortune (स्त्री जातक एवं दाम्पत्य सौख्य)</h4>
            <p className="text-xs text-slate-400">
              Ganesh Kavi's 7th & 8th house principles on marital harmony, spouse's character, and post-marriage prosperity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Overview Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black text-slate-100">Marital Saubhagya Matrix</span>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    Index: {report.maritalFortune.saubhagyaScore}%
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Spouse Persona & Virtues:</span>
                    <p className="text-slate-200 text-[11px] leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      {report.maritalFortune.spouseCharacter}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Prosperity Trajectory Post-Marriage:</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {report.maritalFortune.maritalProsperityVerdict}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Progeny & Lineage Prospects:</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {report.maritalFortune.progenyProspects}
                    </p>
                  </div>
                </div>
              </div>

              {/* Saubhagya Progress Bar */}
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400">Saubhagya Vriddhi:</span>
                  <span className="text-amber-400">{report.maritalFortune.saubhagyaScore}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${report.maritalFortune.saubhagyaScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Remedy Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/40 space-y-3 shadow-xl flex flex-col justify-between">
              <div className="space-y-2 text-xs">
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">
                  Classical Marital Longevity & Peace
                </span>
                <p className="text-slate-200 text-xs leading-relaxed font-semibold">
                  Consistent observance of dharmic rituals and planetary shantis eliminates discord and ensures lifelong marital prosperity.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs space-y-1">
                <strong className="text-amber-300 block mb-0.5">🕊️ Ganesh Kavi's Classical Marital Remedy:</strong>
                <p className="leading-relaxed text-[11px]">{report.maritalFortune.ganeshKaviRemedy}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
