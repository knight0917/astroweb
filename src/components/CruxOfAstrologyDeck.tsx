"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateCruxOfAstrology } from "../engine/cruxOfVedicAstrology";
import { CruxOfAstrologyAnalysis } from "../engine/types";

export default function CruxOfAstrologyDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"narayana" | "conditional" | "bhavas" | "tithi">("narayana");
  const [selectedBhavaNum, setSelectedBhavaNum] = useState<number>(1);

  const report: CruxOfAstrologyAnalysis = useMemo(() => {
    return evaluateCruxOfAstrology(ephemeris);
  }, [ephemeris]);

  const activeBhava = report.bhavaCruxReadings.find((b) => b.bhava === selectedBhavaNum) || report.bhavaCruxReadings[0];
  const eligibleDashasCount = report.conditionalDashas.filter((d) => d.isEligible).length;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            <h2 className="text-lg font-bold text-slate-100">
              Crux of Vedic Astrology (Pt. Sanjay Rath) & Conditional Dashas
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Narayana Dasha, 12 Bhavas Crux, Tithi Pravesha Solar Return & 5 Parashari Conditional Nakshatra Dashas (BPHS Ch. 46).
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-blue-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-blue-500/40 text-center">
            <div className="text-[9px] text-blue-400 uppercase tracking-wider font-bold">Active Narayana Dasha</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🧭</span>
              <span>{report.activeNarayanaSign} Sign</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-purple-500/40 text-center">
            <div className="text-[9px] text-purple-400 uppercase tracking-wider font-bold">Conditional Dashas</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>⚡</span>
              <span>{eligibleDashasCount} Active System{eligibleDashasCount !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950/20 to-slate-950 p-5 rounded-2xl border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
              Pt. Sanjay Rath Master Synthesis (वैदिक ज्योतिष सार)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Narayana Rashi Progression & Parashari Conditional Framework
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterCruxSynthesis}
          </p>
        </div>

        {/* Quick Box */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-blue-400 uppercase font-bold block">Active Narayana Rashi:</span>
            <span className="text-xs font-black text-blue-300 block mt-0.5">
              {report.activeNarayanaSign} (BPHS Rashi Fruition)
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("narayana")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "narayana"
              ? "bg-blue-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌐 Narayana Dasha Timeline ({report.narayanaDashaPeriods.length})
        </button>
        <button
          onClick={() => setActiveTab("conditional")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "conditional"
              ? "bg-blue-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⏳ Parashari Conditional Dashas ({eligibleDashasCount} Active)
        </button>
        <button
          onClick={() => setActiveTab("bhavas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "bhavas"
              ? "bg-blue-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          📖 12 Bhavas Crux & Arudha Manifestation
        </button>
        <button
          onClick={() => setActiveTab("tithi")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "tithi"
              ? "bg-blue-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ☀️ Tithi Pravesha Solar Return
        </button>
      </div>

      {/* TAB 1: NARAYANA DASHA TIMELINE */}
      {activeTab === "narayana" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold">
              BPHS & Pt. Sanjay Rath Universal Rashi Dasha
            </span>
            <span className="text-xs text-blue-400 font-bold">
              Active: {report.activeNarayanaSign}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {report.narayanaDashaPeriods.map((p, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all ${
                  p.isActive
                    ? "bg-blue-950/50 border-blue-500/80 text-white shadow-lg ring-1 ring-blue-500"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                <div className="flex justify-between items-center border-b border-slate-800/80 pb-1.5">
                  <span className="text-xs font-black text-slate-100">{p.signName}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-300">
                    {p.durationYears} Years
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 font-mono">
                  {p.startYear} - {p.endYear}
                </div>
                <div className="text-[10px] text-slate-300 mt-1 line-clamp-2">
                  {p.narayanaIndication}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PARASHARI CONDITIONAL DASHAS */}
      {activeTab === "conditional" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.conditionalDashas.map((cd, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border space-y-3 flex flex-col justify-between shadow-xl ${
                cd.isEligible
                  ? "bg-slate-950 border-purple-500/50"
                  : "bg-slate-950/60 border-slate-800/80 opacity-75"
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] text-purple-400 font-bold block">BPHS Ch. 46</span>
                    <h4 className="text-sm font-black text-slate-100">{cd.dashaName}</h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      cd.isEligible
                        ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                        : "bg-slate-900 text-slate-500 border-slate-800"
                    }`}
                  >
                    {cd.isEligible ? "ELIGIBLE / ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                <div className="text-xs text-slate-300 mt-2 space-y-1">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Classical Condition Rule:</span>
                    <p className="text-slate-200">{cd.conditionRule}</p>
                  </div>
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Chart Diagnostics:</span>
                    <p className="text-slate-300">{cd.eligibilityReason}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                <span className="text-slate-400">Sequence:</span>
                <span className="font-mono text-purple-300 font-bold">{cd.activePeriodRange}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: 12 BHAVAS CRUX & ARUDHA MANIFESTATION */}
      {activeTab === "bhavas" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bhava Selector */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Select House (Crux Vols 1 & 2)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {report.bhavaCruxReadings.map((b) => {
                const isSel = b.bhava === selectedBhavaNum;
                return (
                  <button
                    key={b.bhava}
                    onClick={() => setSelectedBhavaNum(b.bhava)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSel
                        ? "bg-blue-950/60 border-blue-500/80 text-white shadow"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-blue-400">House {b.bhava}</span>
                      <span className="text-[10px] text-slate-500">{b.arudhaSign.slice(0, 3)}</span>
                    </div>
                    <div className="text-xs font-black text-slate-100 truncate mt-0.5">{b.bhavaName.split(" - ")[0]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Bhava Details */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">
                  Pt. Sanjay Rath Crux Judgement
                </span>
                <h3 className="text-base font-black text-slate-100 mt-0.5">
                  {activeBhava.bhavaName}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Arudha Projection</span>
                <span className="text-xs font-black text-blue-300">{activeBhava.arudhaSign}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 uppercase font-bold">Bhava Karaka (Significator):</span>
                <p className="text-xs text-slate-200">{activeBhava.karaka}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase font-bold">Varga Deity Governance:</span>
                <p className="text-xs text-slate-200">{activeBhava.vargaDeity}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-blue-400 uppercase font-bold">Sanjay Rath Crux Dictum:</span>
              <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
                "{activeBhava.sanjayRathDictum}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TITHI PRAVESHA ANNUAL PRINCIPLES */}
      {activeTab === "tithi" && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] text-amber-400 uppercase font-bold">Vedic Annual Solar Return (तिथि प्रवेश चक्र)</span>
            <h4 className="text-base font-black text-slate-100 mt-0.5">
              How Tithi Pravesha Governs Annual Milestones
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold block">1. The Varsha Lord (Year Ruler):</span>
              <p className="text-slate-300">
                The planet ruling the weekday (*Vara*) of the exact Tithi return moment becomes the supreme Year Lord, governing financial vitality and institutional achievements during that 365-day cycle.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold block">2. The Hora & Lagna Lord:</span>
              <p className="text-slate-300">
                The rising sign of the Tithi Pravesha chart and the planetary hour (*Hora*) lord determine physical health resilience, major travel windows, and domestic harmony.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
