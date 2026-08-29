"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateStriJataka } from "../engine/striJataka";
import { StriJatakaAnalysis } from "../engine/types";

export default function StriJatakaDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"disposition" | "trimsamsha" | "mangalya" | "vishakanya">("disposition");

  const report: StriJatakaAnalysis = useMemo(() => {
    return evaluateStriJataka(ephemeris);
  }, [ephemeris]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌺</span>
            <h2 className="text-lg font-bold text-slate-100">
              Stri Jataka (स्त्रीजातकम् — Female Horoscopy Classical Matrix)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Classical Foundations: Even/Odd Dispositions, Trimsamsha D-30, Mangalya Sthana & Visha Kanya Shields.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-rose-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-rose-500/40 text-center">
            <div className="text-[9px] text-rose-400 uppercase tracking-wider font-bold">Mangalya Sthana (8th)</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>💍</span>
              <span>{report.mangalyaSoubhagya.mangalyaScore}%</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Soubhagya Score (9th)</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>✨</span>
              <span>{report.mangalyaSoubhagya.soubhagyaScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-gradient-to-r from-slate-950 via-rose-950/20 to-slate-950 p-5 rounded-2xl border border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
              Stri Jataka Master Predictive Synthesis (स्त्रीजातक महा निर्णय)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              {report.mangalyaSoubhagya.maritalBlissGrade}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterStriJatakaSynthesis}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-rose-400 uppercase font-bold block">Ascendant Trimsamsha Lord:</span>
            <span className="text-xs font-black text-slate-100 block mt-0.5">
              {report.trimsamshaAnalysis.ascendantTrimsamshaLord} Trimsamsha
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Visha Kanya Shield:</span>
            <span className="text-xs font-bold text-emerald-300 block mt-0.5">
              {report.vishaKanya.isCancelled ? "Shield Active (Neutralized)" : "Unafflicted"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("disposition")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "disposition"
              ? "bg-rose-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌸 Lagna & Moon Disposition
        </button>
        <button
          onClick={() => setActiveTab("trimsamsha")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "trimsamsha"
              ? "bg-rose-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🔮 Trimsamsha D-30 Archetypes
        </button>
        <button
          onClick={() => setActiveTab("mangalya")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "mangalya"
              ? "bg-rose-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          💍 Mangalya & Soubhagya Sthanas
        </button>
        <button
          onClick={() => setActiveTab("vishakanya")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "vishakanya"
              ? "bg-rose-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🛡️ Visha Kanya & Arishta Bhanga
        </button>
      </div>

      {/* TAB 1: DISPOSITION */}
      {activeTab === "disposition" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
                Lagna Sign Classification (लग्न राशि प्रकार)
              </span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                {report.disposition.ascendantSignType}
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {report.disposition.summary}
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Chandra Sign Classification (चन्द्र राशि प्रकार)
              </span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                {report.disposition.moonSignType}
              </h4>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              💡 **Classical Stri Jataka Principle:** In female charts, the Moon governs physical beauty, emotional tranquility, and domestic concord.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRIMSAMSHA D-30 */}
      {activeTab === "trimsamsha" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
                Ascendant Trimsamsha (लग्न त्रिंशांश - Moral Archetype)
              </span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                Ruler: {report.trimsamshaAnalysis.ascendantTrimsamshaLord}
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {report.trimsamshaAnalysis.moralDisposition}
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                Moon Trimsamsha (चन्द्र त्रिंशांश - Spiritual Devotion)
              </span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                Ruler: {report.trimsamshaAnalysis.moonTrimsamshaLord}
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {report.trimsamshaAnalysis.spiritualInclination}
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: MANGALYA & SOUBHAGYA */}
      {activeTab === "mangalya" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
                8th House Mangalya Sthana (माङ्गल्य स्थान)
              </span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                Partner Longevity & Marital Concord ({report.mangalyaSoubhagya.mangalyaScore}%)
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {report.mangalyaSoubhagya.partnerLongevityOutlook}
            </p>

            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Mangalya Vitality Index:</span>
                <span className="text-rose-400">{report.mangalyaSoubhagya.mangalyaScore}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-rose-500 to-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${report.mangalyaSoubhagya.mangalyaScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                9th House Soubhagya Sthana (सौभाग्य स्थान)
              </span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                Auspicious Family Prosperity & Santana ({report.mangalyaSoubhagya.soubhagyaScore}%)
              </h4>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              "The 9th house represents virtuous children, dharma, and general prosperity for the entire family lineage."
            </div>

            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Soubhagya Index:</span>
                <span className="text-amber-400">{report.mangalyaSoubhagya.soubhagyaScore}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${report.mangalyaSoubhagya.soubhagyaScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VISHA KANYA */}
      {activeTab === "vishakanya" && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-2">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              Visha Kanya Sanctuary & Cancellation (विष कन्या विचार एवं भङ्ग)
            </span>
            <h4 className="text-base font-black text-slate-100 mt-0.5">
              {report.vishaKanya.isCancelled ? "Supreme Shield Active" : "Chart Unafflicted"}
            </h4>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {report.vishaKanya.analysis}
          </p>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
            <span className="text-amber-300 font-bold block">🛡️ Active Cancellation Shield:</span>
            <p className="text-slate-200">{report.vishaKanya.cancellationFactor}</p>
          </div>
        </div>
      )}
    </div>
  );
}
