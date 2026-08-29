"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateJatakaParijata } from "../engine/jatakaParijata";
import { JatakaParijataAnalysis } from "../engine/types";

export default function JatakaParijataDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"yogas" | "kharesh" | "kalachakra" | "bhavas">("yogas");
  const [selectedBhavaNum, setSelectedBhavaNum] = useState<number>(1);

  const report: JatakaParijataAnalysis = useMemo(() => {
    return evaluateJatakaParijata(ephemeris);
  }, [ephemeris]);

  const activeBhava = report.bhavaMastery.find((b) => b.bhavaNum === selectedBhavaNum) || report.bhavaMastery[0];
  const activeYogasCount = report.shodashaYogas.filter((y) => y.isFormed).length;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌺</span>
            <h2 className="text-lg font-bold text-slate-100">
              Vaidyanatha Dikshita's Jataka Parijata (जातक पारिजात, Vols 1–3)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monumental 18-Adhyaya Sanskrit Encyclopedia: 16 Shodasha Yogas, 64th Navamsha, 22nd Drekkana (Kharesh) & Kalachakra Diagnostics.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-rose-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-rose-500/40 text-center">
            <div className="text-[9px] text-rose-400 uppercase tracking-wider font-bold">Active Parijata Yogas</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>👑</span>
              <span>{activeYogasCount} / {report.shodashaYogas.length} Formed</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">64th Navamsha (Moon)</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>⚡</span>
              <span>{report.khareshAndNavamsha.navamsha64Moon.signName} ({report.khareshAndNavamsha.navamsha64Moon.lord})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Parijata Card */}
      <div className="bg-gradient-to-r from-slate-950 via-rose-950/20 to-slate-950 p-5 rounded-2xl border border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
              18 Adhyayas Classical Synthesis (जातक पारिजात महासार)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Apex Yoga: {report.shodashaYogas.find((y) => y.isFormed)?.yogaName || "Parijata Yoga"}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterParijataSynthesis}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-rose-400 uppercase font-bold block">22nd Drekkana Kharesh:</span>
            <span className="text-xs font-black text-slate-100 block mt-0.5">
              Lord: {report.khareshAndNavamsha.drekkana22Kharesh.khareshLord} ({report.khareshAndNavamsha.drekkana22Kharesh.signName})
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Kalachakra Pair:</span>
            <span className="text-xs font-bold text-amber-300 block mt-0.5">
              Deha: {report.kalachakraDiagnostics.dehaRashi} • Jeeva: {report.kalachakraDiagnostics.jeevaRashi}
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
              ? "bg-rose-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          👑 16 Shodasha Parijata Yogas
        </button>
        <button
          onClick={() => setActiveTab("kharesh")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "kharesh"
              ? "bg-rose-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⚡ 64th Navamsha & 22nd Drekkana
        </button>
        <button
          onClick={() => setActiveTab("kalachakra")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "kalachakra"
              ? "bg-rose-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ☸️ Kalachakra Deha & Jeeva
        </button>
        <button
          onClick={() => setActiveTab("bhavas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "bhavas"
              ? "bg-rose-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🏛️ 12 Bhavas Parijata Mastery
        </button>
      </div>

      {/* TAB 1: 16 SHODASHA PARIJATA YOGAS */}
      {activeTab === "yogas" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">16 Shodasha Parijata Yogas (Adhyayas 6 & 18)</h4>
            <p className="text-xs text-slate-400">
              Celebrated combinations from Vaidyanatha Dikshita granting sovereign authority, wealth, wisdom, and renown.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.shodashaYogas.map((yoga, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                  yoga.isFormed
                    ? "bg-slate-950 border-rose-500/40 shadow-xl ring-1 ring-rose-500/30"
                    : "bg-slate-950/50 border-slate-800 opacity-70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
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
                      <span className="text-rose-300 font-semibold ml-1.5">
                        {yoga.participatingPlanets.join(", ")}
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {yoga.description}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-200 italic">
                  <strong className="text-rose-300 not-italic block mb-0.5">Classical Effect:</strong>
                  {yoga.classicalShlokaEffect}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: 64TH NAVAMSHA & 22ND DREKKANA SHIELD */}
      {activeTab === "kharesh" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">64th Navamsha & 22nd Drekkana Kharesh Engine (Adhyayas 5 & 17)</h4>
            <p className="text-xs text-slate-400">
              Subtle karmic vulnerability diagnostics from Vaidyanatha Dikshita for timing sensitive planetary transits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 64th Navamsha Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider">
                  Chandra & Lagna 64th Navamsha
                </span>
                <h4 className="text-sm font-black text-slate-100 mt-0.5">
                  64th Navamsha (चन्द्र एवं लग्न से ६४वाँ नवांश)
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">64th Navamsha from Moon (चन्द्र नवांश):</span>
                  <div className="flex justify-between items-center text-sm font-bold text-rose-300">
                    <span>{report.khareshAndNavamsha.navamsha64Moon.signName} ({report.khareshAndNavamsha.navamsha64Moon.degreeRange})</span>
                    <span className="text-xs font-mono text-slate-400">Lord: {report.khareshAndNavamsha.navamsha64Moon.lord}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">64th Navamsha from Ascendant (लग्न नवांश):</span>
                  <div className="flex justify-between items-center text-sm font-bold text-amber-300">
                    <span>{report.khareshAndNavamsha.navamsha64Lagna.signName} ({report.khareshAndNavamsha.navamsha64Lagna.degreeRange})</span>
                    <span className="text-xs font-mono text-slate-400">Lord: {report.khareshAndNavamsha.navamsha64Lagna.lord}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 22nd Drekkana & Gulika Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                  22nd Drekkana & Gulika Coordinates
                </span>
                <h4 className="text-sm font-black text-slate-100 mt-0.5">
                  Kharesh Lord & Mandi (२२वाँ द्रेष्काण एवं गुलिक)
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">22nd Drekkana (Kharesh Lord / ख्रेश):</span>
                  <div className="flex justify-between items-center text-sm font-bold text-rose-300">
                    <span>Lord {report.khareshAndNavamsha.drekkana22Kharesh.khareshLord}</span>
                    <span className="text-xs font-mono text-slate-400">Sign: {report.khareshAndNavamsha.drekkana22Kharesh.signName}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">Gulika / Mandi Position:</span>
                  <div className="flex justify-between items-center text-sm font-bold text-amber-200">
                    <span>House {report.khareshAndNavamsha.gulika.house} ({report.khareshAndNavamsha.gulika.signName})</span>
                    <span className="text-xs font-mono text-slate-400">{report.khareshAndNavamsha.gulika.longitude}°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Protection Box */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-200 space-y-1">
            <strong className="text-rose-300 block font-bold">🛡️ Vaidyanatha Dikshita Protection Guidelines:</strong>
            <p className="text-slate-200 leading-relaxed text-[11px]">{report.khareshAndNavamsha.protectionGuidelines}</p>
          </div>
        </div>
      )}

      {/* TAB 3: KALACHAKRA DEHA & JEEVA DIAGNOSTICS */}
      {activeTab === "kalachakra" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Kalachakra Dasha Deha & Jeeva Diagnostics (कालचक्र दशा - Adhyaya 15)</h4>
            <p className="text-xs text-slate-400">
              Classical evaluation of the Body (Deha) and Soul/Life-force (Jeeva) signs in the Kalachakra wheel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deha & Jeeva Signs Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-sm font-black text-slate-100">Kalachakra Sign Coordinates</h4>
                <span className="text-xs font-bold text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                  {report.kalachakraDiagnostics.group}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold">देह राशि (Deha / Physical Body Sign):</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      report.kalachakraDiagnostics.dehaAfflicted ? "bg-rose-950 text-rose-300 border-rose-800" : "bg-emerald-950 text-emerald-300 border-emerald-800"
                    }`}>
                      {report.kalachakraDiagnostics.dehaAfflicted ? "Afflicted" : "Fortified"}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-100">
                    {report.kalachakraDiagnostics.dehaRashi} (Lord: {report.kalachakraDiagnostics.dehaLord})
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold">जीव राशि (Jeeva / Life-Force Sign):</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      report.kalachakraDiagnostics.jeevaAfflicted ? "bg-rose-950 text-rose-300 border-rose-800" : "bg-emerald-950 text-emerald-300 border-emerald-800"
                    }`}>
                      {report.kalachakraDiagnostics.jeevaAfflicted ? "Afflicted" : "Fortified"}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-100">
                    {report.kalachakraDiagnostics.jeevaRashi} (Lord: {report.kalachakraDiagnostics.jeevaLord})
                  </div>
                </div>
              </div>
            </div>

            {/* Vitality Guidance Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-rose-500/40 space-y-3 shadow-xl flex flex-col justify-between">
              <div>
                <div className="border-b border-slate-800 pb-2">
                  <span className="text-xs font-black text-slate-100">Pranic Vitality Health Alert</span>
                </div>

                <p className="text-slate-200 text-xs leading-relaxed mt-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {report.kalachakraDiagnostics.vitalityAlert}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs">
                <strong className="text-rose-300 block mb-0.5">🕊️ Kalachakra Shanti Prescription:</strong>
                <span className="text-[11px] leading-relaxed">
                  Regular recitation of the Vishnu Sahasranama Stotram and observing Ekadashi Vrata preserves the sanctity of the Deha and Jeeva channels.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 12 BHAVAS PARIJATA MASTERY */}
      {activeTab === "bhavas" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bhava Selector */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Select House (भाव) for Parijata Phala
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {report.bhavaMastery.map((b) => {
                const isSelected = selectedBhavaNum === b.bhavaNum;
                const isUttama = b.masteryGrade.includes("Uttama");
                return (
                  <div
                    key={b.bhavaNum}
                    onClick={() => setSelectedBhavaNum(b.bhavaNum)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-rose-600/20 border-rose-400 shadow-lg ring-1 ring-rose-400"
                        : "bg-slate-950/60 border-slate-800 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-100">House {b.bhavaNum}</span>
                      <span
                        className={`text-[9px] font-bold px-1 rounded ${
                          isUttama ? "bg-rose-950 text-rose-300 border border-rose-800" : "text-slate-400"
                        }`}
                      >
                        {b.parijataScore}%
                      </span>
                    </div>
                    <div className="text-[10px] text-rose-300 font-semibold truncate mt-1">
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
                <span className="text-[10px] text-rose-400 uppercase tracking-wider font-bold">
                  {activeBhava.adhyayaCitation}
                </span>
                <h4 className="text-base font-black text-slate-100 mt-0.5">
                  House {activeBhava.bhavaNum}: {activeBhava.sanskritTitle}
                </h4>
                <div className="text-xs text-rose-300 font-medium mt-0.5">
                  Sign: {activeBhava.signName} • Lord: {activeBhava.lordName} in House {activeBhava.lordPlacementHouse}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Parijata Mastery Grade</span>
                <span className="text-xs font-black text-rose-300">{activeBhava.masteryGrade} ({activeBhava.parijataScore}%)</span>
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
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1 text-xs">
              <span className="text-rose-300 font-bold block">📜 Vaidyanatha Dikshita's Bhava Phala:</span>
              <p className="text-slate-200 leading-relaxed">{activeBhava.classicalPhala}</p>
            </div>

            {/* Score Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Parijata Mastery Strength:</span>
                <span className="text-rose-400">{activeBhava.parijataScore}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-rose-500 to-amber-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${activeBhava.parijataScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
