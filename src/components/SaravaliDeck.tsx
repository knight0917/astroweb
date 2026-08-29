"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateSaravali } from "../engine/saravali";
import { SaravaliAnalysis } from "../engine/types";

export default function SaravaliDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"yogas" | "conjunctions" | "stri" | "bhavas">("yogas");
  const [selectedBhavaNum, setSelectedBhavaNum] = useState<number>(1);

  const report: SaravaliAnalysis = useMemo(() => {
    return evaluateSaravali(ephemeris);
  }, [ephemeris]);

  const activeBhava = report.bhavaPotency.find((b) => b.bhavaNum === selectedBhavaNum) || report.bhavaPotency[0];
  const activeYogasCount = report.royalYogas.filter((y) => y.isFormed).length;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <h2 className="text-lg font-bold text-slate-100">
              Maharaja Kalyana Varma's Saravali (सारावली - 800 CE)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            45-Adhyaya Classical Authority: Vasumati & Adhi Yogas, Multi-Planet Conjunctions, Trimsamsha & 12 Bhavas Royal Matrix.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Active Royal Yogas</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>👑</span>
              <span>{activeYogasCount} / {report.royalYogas.length} Formed</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Conjunctions</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🪐</span>
              <span>{report.conjunctions.length} Active Yutis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Saravali Card */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              45 Adhyayas Master Synthesis (कल्याण वर्मा सारावली महाफल)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Apex Yoga: {report.royalYogas.find((y) => y.isFormed)?.yogaName || "Vasumati Yoga"}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterSaravaliSynthesis}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Trimsamsha Lord:</span>
            <span className="text-xs font-black text-slate-100 block mt-0.5">
              Lord {report.striJataka.trimsamshaLord} ({report.striJataka.trimsamshaSign})
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Visha Kanya Status:</span>
            <span className="text-xs font-bold text-emerald-300 block mt-0.5">
              {report.striJataka.vishaKanyaDetected
                ? (report.striJataka.vishaKanyaBhanga ? "Neutralized by Kendra Benefics" : "Active (Shiva Shanti Required)")
                : "None Formed (Shielded)"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("yogas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "yogas"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          👑 Royal & Wealth Yogas
        </button>
        <button
          onClick={() => setActiveTab("conjunctions")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "conjunctions"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🪐 Multi-Graha Conjunctions
        </button>
        <button
          onClick={() => setActiveTab("stri")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "stri"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌸 Stri Jataka & Trimsamsha
        </button>
        <button
          onClick={() => setActiveTab("bhavas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "bhavas"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🏛️ 12 Bhavas Saravali Matrix
        </button>
      </div>

      {/* TAB 1: ROYAL & WEALTH YOGAS */}
      {activeTab === "yogas" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Saravali Royal & Prosperity Yogas (Adhyayas 35–38)</h4>
            <p className="text-xs text-slate-400">
              Supreme combinations from King Kalyana Varma granting Kubera-level wealth, executive authority, and renown.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.royalYogas.map((yoga, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                  yoga.isFormed
                    ? "bg-slate-950 border-amber-500/40 shadow-xl ring-1 ring-amber-500/30"
                    : "bg-slate-950/50 border-slate-800 opacity-70"
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

      {/* TAB 2: MULTI-GRAHA CONJUNCTIONS */}
      {activeTab === "conjunctions" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Multi-Graha Conjunction Matrix (Adhyayas 15–21)</h4>
            <p className="text-xs text-slate-400">
              Combinatorial destiny results of multi-planet alignments in natal houses from Kalyana Varma.
            </p>
          </div>

          {report.conjunctions.length === 0 ? (
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
              No multi-planet conjunctions formed; all planets occupy independent houses.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.conjunctions.map((conj, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                          {conj.conjunctionType}
                        </span>
                        <h4 className="text-sm font-black text-slate-100 mt-0.5">{conj.yogaTitle}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        House {conj.house} ({conj.signName})
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-xs">
                      <div className="text-slate-400 font-bold">
                        Planets: <span className="text-slate-200 font-normal">{conj.planets.join(", ")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-200">
                    <strong className="text-amber-300 block mb-0.5">📜 Kalyana Varma Phala:</strong>
                    {conj.saravaliPhala}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: STRI JATAKA & TRIMSAMSHA */}
      {activeTab === "stri" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Stri Jataka & Trimsamsha Diagnostics (Adhyaya 43)</h4>
            <p className="text-xs text-slate-400">
              Classical Trimsamsha character analysis, marital fortune, and Visha Kanya cancellation diagnostics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Trimsamsha Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                  Lagna Trimsamsha (D-30 Analysis)
                </span>
                <h4 className="text-sm font-black text-slate-100 mt-0.5">
                  Trimsamsha Lord & Temperament
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">Governing Trimsamsha Lord:</span>
                  <div className="text-sm font-bold text-amber-300">
                    Lord {report.striJataka.trimsamshaLord} ({report.striJataka.trimsamshaSign})
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">Moral & Psychological Disposition:</span>
                  <p className="text-slate-200 leading-relaxed text-[11px]">{report.striJataka.trimsamshaNature}</p>
                </div>
              </div>
            </div>

            {/* Visha Kanya & Shield Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
              <div>
                <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-100">Visha Kanya Shield & Marital Harmony</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    report.striJataka.vishaKanyaDetected && !report.striJataka.vishaKanyaBhanga
                      ? "bg-rose-950 text-rose-300 border-rose-800"
                      : "bg-emerald-950 text-emerald-300 border-emerald-800"
                  }`}>
                    {report.striJataka.vishaKanyaDetected && !report.striJataka.vishaKanyaBhanga ? "Active" : "Neutralized / Shielded"}
                  </span>
                </div>

                <p className="text-slate-200 text-xs leading-relaxed mt-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {report.striJataka.maritalAndMoralDisposition}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                <strong className="text-amber-300 block mb-0.5">🕊️ Saravali Shanti Prescription:</strong>
                <span className="text-[11px] leading-relaxed">
                  Benefics occupying Kendras or Trikonas act as an impenetrable Kavacha, ensuring auspicious marital longevity and familial bliss.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 12 BHAVAS SARAVALI MATRIX */}
      {activeTab === "bhavas" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bhava Selector */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Select House (भाव) for Saravali Phala
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {report.bhavaPotency.map((b) => {
                const isSelected = selectedBhavaNum === b.bhavaNum;
                const isUttama = b.royalGrade.includes("Uttama");
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
                        {b.saravaliScore}%
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-300 font-semibold truncate mt-1">
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
                  {activeBhava.adhyayaCitation}
                </span>
                <h4 className="text-base font-black text-slate-100 mt-0.5">
                  House {activeBhava.bhavaNum}: {activeBhava.sanskritTitle}
                </h4>
                <div className="text-xs text-amber-300 font-medium mt-0.5">
                  Sign: {activeBhava.signName} • Lord: {activeBhava.lordName} in House {activeBhava.lordPlacementHouse}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Saravali Royal Grade</span>
                <span className="text-xs font-black text-amber-300">{activeBhava.royalGrade} ({activeBhava.saravaliScore}%)</span>
              </div>
            </div>

            {/* Occupants */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400 font-bold block">Resident Natal Planets:</span>
              <span className="text-slate-100 font-semibold mt-0.5 block">
                {activeBhava.occupants.length ? activeBhava.occupants.join(", ") : "None (Unoccupied)"}
              </span>
            </div>

            {/* Classical Phala Box */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1 text-xs">
              <span className="text-amber-300 font-bold block">📜 Maharaja Kalyana Varma's Bhava Phala:</span>
              <p className="text-slate-200 leading-relaxed">{activeBhava.classicalPhala}</p>
            </div>

            {/* Score Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Saravali Potency Strength:</span>
                <span className="text-amber-400">{activeBhava.saravaliScore}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${activeBhava.saravaliScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
