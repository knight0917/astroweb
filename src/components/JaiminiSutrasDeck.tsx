"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateJaiminiSutrasComplete } from "../engine/jaiminiSutras";
import { evaluateJaiminiRangacharya } from "../engine/jaiminiRangacharya";
import { JaiminiSutrasCompleteAnalysis, JaiminiRangacharyaAnalysis } from "../engine/types";

export default function JaiminiSutrasDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"karakamsha" | "charadasha" | "varnada" | "shoola" | "arudha" | "upapada" | "longevity">("karakamsha");
  const [selectedBhavaNum, setSelectedBhavaNum] = useState<number>(1);

  const report: JaiminiSutrasCompleteAnalysis = useMemo(() => {
    return evaluateJaiminiSutrasComplete(ephemeris);
  }, [ephemeris]);

  const rangacharyaReport: JaiminiRangacharyaAnalysis = useMemo(() => {
    return evaluateJaiminiRangacharya(ephemeris);
  }, [ephemeris]);

  const activeBhava = report.karakamshaBhavas.find((b) => b.bhavaNum === selectedBhavaNum) || report.karakamshaBhavas[0];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <h2 className="text-lg font-bold text-slate-100">
              Maharshi Jaimini Upadesha Sutras & Master Suite (जैमिनि सर्वस्वम्)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete 4 Adhyayas, Iranganti Rangacharya Manual, Shoola Dasha, Varnada Lagna & 12 Arudha Padas with Exception Rules.
          </p>
        </div>

        {/* Karaka Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Atmakaraka (AK)</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>👑</span>
              <span>{report.atmakarakaPlanet} in {report.karakamshaSign} (D9)</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Varnada Lagna (VL)</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🌿</span>
              <span>{rangacharyaReport.varnadaLagnaSign}</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-purple-500/40 text-center">
            <div className="text-[9px] text-purple-400 uppercase tracking-wider font-bold">Active Chara Dasha</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>⏳</span>
              <span>{report.charaDasha.activeMahadasha.signName} ({report.charaDasha.activeMahadasha.durationYears}y)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Ishta Devata & Synthesis Card */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              12th House from Karakamsha (मोक्ष एवं इष्ट देवता स्थान)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Ishta Devata: {report.ishtaDevata.ishtaDevataName}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterJaiminiSynthesis}
          </p>
        </div>

        {/* Sacred Mantra & Path Quick Box */}
        <div className="flex flex-col gap-2 min-w-[270px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Sacred Bija Mantra:</span>
            <span className="text-xs font-mono font-bold text-amber-200 block mt-0.5">
              {report.ishtaDevata.mantraRecommendation}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Spiritual Pathway:</span>
            <span className="text-xs font-bold text-slate-200 block mt-0.5">
              {report.ishtaDevata.spiritualPath}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("karakamsha")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "karakamsha"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          👑 Karakamsha & Ishta Devata
        </button>
        <button
          onClick={() => setActiveTab("charadasha")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "charadasha"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⏳ Chara Dasha Timeline
        </button>
        <button
          onClick={() => setActiveTab("varnada")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "varnada"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌿 Varnada Lagna & 12 Padas
        </button>
        <button
          onClick={() => setActiveTab("shoola")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "shoola"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⚡ Shoola Dasha (Ayurdaya)
        </button>
        <button
          onClick={() => setActiveTab("arudha")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "arudha"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🔮 12 Arudha Padas & Exceptions
        </button>
        <button
          onClick={() => setActiveTab("upapada")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "upapada"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          💍 Upapada Lagna & Marriage
        </button>
        <button
          onClick={() => setActiveTab("longevity")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "longevity"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🛡️ Brahma, Rudra & Longevity
        </button>
      </div>

      {/* TAB 1: KARAKAMSHA & ISHTA DEVATA */}
      {activeTab === "karakamsha" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 12 Bhava Selector */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Select House from Karakamsha (D9)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {report.karakamshaBhavas.map((b) => {
                const isSel = b.bhavaNum === selectedBhavaNum;
                return (
                  <button
                    key={b.bhavaNum}
                    onClick={() => setSelectedBhavaNum(b.bhavaNum)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSel
                        ? "bg-amber-950/60 border-amber-500/80 text-white shadow"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-amber-400">Bhava {b.bhavaNum}</span>
                      <span className="text-[10px] text-slate-500">{b.signName.slice(0, 3)}</span>
                    </div>
                    <div className="text-xs font-black text-slate-100 truncate mt-0.5">{b.signification}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Karakamsha Bhava Details */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  House {activeBhava.bhavaNum} from Karakamsha ({report.karakamshaSign})
                </span>
                <h3 className="text-base font-black text-slate-100 mt-0.5">
                  {activeBhava.signification} ({activeBhava.signName})
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Occupying Grahas</span>
                <span className="text-xs font-black text-amber-300">
                  {activeBhava.planetsPresent.length > 0 ? activeBhava.planetsPresent.join(", ") : "None (Vacant)"}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Rashi Drishti Aspecting Grahas:</span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeBhava.aspectingPlanets.length > 0 ? activeBhava.aspectingPlanets.join(", ") : "None"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-emerald-400 uppercase font-bold">Classical Jaimini Sutra Phala:</span>
              <p className="text-xs text-slate-300 leading-relaxed font-serif">
                {activeBhava.sutraPhala}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHARA DASHA TIMELINE */}
      {activeTab === "charadasha" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold">
              Progression Mode: <strong className="text-slate-100">{report.charaDasha.progressionDirection}</strong>
            </span>
            <span className="text-xs text-purple-400 font-bold">
              Active: {report.charaDasha.activeMahadasha.signName} (until {new Date(report.charaDasha.activeMahadasha.endDate).getFullYear()})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {report.charaDasha.periods.map((p, idx) => {
              const isActive = p.signName === report.charaDasha.activeMahadasha.signName;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isActive
                      ? "bg-purple-950/40 border-purple-500/80 text-white shadow-lg ring-1 ring-purple-500"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="flex justify-between items-center border-b border-slate-800/80 pb-1.5">
                    <span className="text-xs font-black text-slate-100">{p.signName}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300">
                      {p.durationYears} Years
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2">
                    {new Date(p.startDate).getFullYear()} - {new Date(p.endDate).getFullYear()}
                  </div>
                  <div className="text-[10px] text-slate-300 mt-1 line-clamp-2">
                    {p.keySignifications}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: VARNADA LAGNA & 12 PADAS (PANDIT IRANGANTI RANGACHARYA) */}
      {activeTab === "varnada" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-400 uppercase font-bold">Iranganti Rangacharya System</span>
              <h4 className="text-sm font-bold text-slate-100 mt-0.5">
                Varnada Lagna (VL): {rangacharyaReport.varnadaLagnaSign}
              </h4>
            </div>
            <span className="text-xs text-slate-400 max-w-md text-right">
              Varnada Padas diagnose societal eminence, vitality, and vulnerability cycles across the 12 houses.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {rangacharyaReport.varnadaPadas.map((vp, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-xs font-black text-slate-100 truncate">{vp.name.split(" - ")[0]}</span>
                  <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800">
                    {vp.signName}
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 font-medium">{vp.name.split(" - ")[1]}</div>
                <div className="text-[9px] text-slate-400">{vp.vitalityImpact}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SHOOLA DASHA (AYURDAYA CYCLES) */}
      {activeTab === "shoola" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-purple-400 uppercase font-bold">Jaimini Ayurdaya Health Clock</span>
              <h4 className="text-sm font-bold text-slate-100 mt-0.5">
                Shoola Dasha (9-Year Sign Health Cycles)
              </h4>
            </div>
            <span className="text-xs text-slate-400 max-w-md text-right">
              Evaluates physical resilience, immunity windows, and Maraka/Rudra vulnerability phases.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {rangacharyaReport.shoolaDashaPeriods.map((sp, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border space-y-1.5 ${
                  sp.isMarakaOrRudra
                    ? "bg-rose-950/20 border-rose-500/40 text-slate-100"
                    : "bg-slate-950 border-slate-800 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-xs font-black text-slate-100">{sp.signName}</span>
                  <span className="text-[10px] font-bold text-purple-400">{sp.ageRange}</span>
                </div>
                <div className="text-[10px] text-slate-400">{sp.startYear} - {sp.endYear}</div>
                <div className="text-[9px] text-slate-300">{sp.healthCrisisVulnerability}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: 12 ARUDHA PADAS & EXCEPTION RULES */}
      {activeTab === "arudha" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-bold">BPHS & Jaimini Canon Exception Protocol</span>
              <h4 className="text-sm font-bold text-slate-100 mt-0.5">
                12 Arudha Padas (A1/AL to UL/A12)
              </h4>
            </div>
            <div className="text-xs text-amber-300">
              {rangacharyaReport.arudhaRajaYogas.join(" • ") || "Standard Arudha alignments active."}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {rangacharyaReport.arudhaPadasWithExceptions.map((ap, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border space-y-1.5 ${
                  ap.isExceptionApplied
                    ? "bg-amber-950/20 border-amber-500/50"
                    : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-xs font-black text-slate-100">{ap.code}</span>
                  <span className="text-[10px] font-bold text-amber-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {ap.signName}
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 font-medium">{ap.houseName}</div>
                <div className="text-[9px] text-slate-400">{ap.exceptionRuleNote}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: UPAPADA LAGNA (UL) */}
      {activeTab === "upapada" && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] text-pink-400 font-bold uppercase">Upapada Lagna (UL - 12th House Arudha)</span>
              <h3 className="text-base font-black text-slate-100 mt-0.5">
                UL Sign: {report.upapada.upapadaSign} (Second from UL: {report.upapada.secondFromUpapadaSign})
              </h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800">
              Harmony: {report.upapada.maritalHarmonyScore}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Spouse Disposition & Profile:</span>
              <p className="text-xs text-slate-200 leading-relaxed">{report.upapada.spouseProfile}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-pink-400 uppercase font-bold">Jaimini Marital Remedy:</span>
              <p className="text-xs text-pink-200 leading-relaxed">{report.upapada.jaiminiRemedies}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: BRAHMA, RUDRA & LONGEVITY */}
      {activeTab === "longevity" && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] text-amber-400 uppercase font-bold">Jaimini 3-Pairs & Vital Determinators</span>
            <h3 className="text-base font-black text-slate-100 mt-0.5">
              Ayurdaya Composite: {report.longevity.compositeLongevity}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-amber-400 uppercase font-bold block">Brahma (Prana Sustainer)</span>
              <span className="text-xs font-black text-slate-100 block mt-1">
                {rangacharyaReport.brahmaRudra.brahmaPlanet} in {rangacharyaReport.brahmaRudra.brahmaSign}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-rose-400 uppercase font-bold block">Rudra (Karmic Destroyer)</span>
              <span className="text-xs font-black text-slate-100 block mt-1">
                {rangacharyaReport.brahmaRudra.rudraPlanet} in {rangacharyaReport.brahmaRudra.rudraSign}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-purple-400 uppercase font-bold block">Maheshwara (AK 8th Lord)</span>
              <span className="text-xs font-black text-slate-100 block mt-1">
                {rangacharyaReport.brahmaRudra.maheshwaraPlanet} in {rangacharyaReport.brahmaRudra.maheshwaraSign}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            {report.longevity.longevitySummary}
          </div>
        </div>
      )}
    </div>
  );
}
