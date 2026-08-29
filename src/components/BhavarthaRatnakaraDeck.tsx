"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateBhavarthaRatnakara } from "../engine/bhavarthaRatnakara";
import { BhavarthaRatnakaraAnalysis } from "../engine/types";

export default function BhavarthaRatnakaraDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"lagna" | "dhana" | "dasha" | "commentary">("lagna");

  const report: BhavarthaRatnakaraAnalysis = useMemo(() => {
    return evaluateBhavarthaRatnakara(ephemeris);
  }, [ephemeris]);

  const totalYogas = report.activeYogas.length + report.dhanaYogas.length + report.dashaExceptions.length;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h2 className="text-lg font-bold text-slate-100">
              Bhavartha Ratnakara (भावार्थ रत्नाकर)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sri Ramanujacharya & Dr. B.V. Raman — 14 Adhyayas of Lagnawise Secret Yogas, Special Dhana Yogas & Parashari Exceptions.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Ascendant Context</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>👑</span>
              <span>{report.ascendantSign} Lagna</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Active Ratnakara Yogas</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>⭐</span>
              <span>{totalYogas} Yogas & Exceptions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              Sri Ramanujacharya & Dr. B.V. Raman Synthesis (भावार्थ रत्नाकर निर्णय)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Secret Lagnawise Planetary Disposition
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterRatnakaraSynthesis}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Premier Ratnakara Yogakaraka:</span>
            <span className="text-xs font-black text-amber-300 block mt-0.5">
              {report.premierRatnakaraYogakaraka}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("lagna")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "lagna"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          👑 Lagnawise Ratnakara Yogas ({report.activeYogas.length})
        </button>
        <button
          onClick={() => setActiveTab("dhana")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "dhana"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          💰 Special Dhana Yogas ({report.dhanaYogas.length})
        </button>
        <button
          onClick={() => setActiveTab("dasha")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "dasha"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⚡ Dasha Exceptions & Overrides ({report.dashaExceptions.length})
        </button>
        <button
          onClick={() => setActiveTab("commentary")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "commentary"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          📖 Dr. B.V. Raman Critical Commentary
        </button>
      </div>

      {/* TAB 1: LAGNAWISE RATNAKARA YOGAS */}
      {activeTab === "lagna" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.activeYogas.map((y, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold block">Adhyaya {y.adhyayaNumber}</span>
                    <h4 className="text-sm font-black text-slate-100">{y.yogaName}</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-amber-950 text-amber-300 border-amber-800">
                    {y.fruitionStrength}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-2.5">{y.classicalSlokaSummary}</p>
              </div>

              <div className="pt-2 border-t border-slate-900 text-xs">
                <span className="text-[10px] text-amber-300 font-bold block">Dr. B.V. Raman Note:</span>
                <p className="text-slate-200 mt-0.5">{y.drBvRamanCommentary}</p>
              </div>
            </div>
          ))}
          {report.activeYogas.length === 0 && (
            <p className="text-xs text-slate-500 italic">No specific Lagnawise secret yogas active in standard placements.</p>
          )}
        </div>
      )}

      {/* TAB 2: SPECIAL DHANA YOGAS */}
      {activeTab === "dhana" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.dhanaYogas.map((y, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold block">Adhyaya {y.adhyayaNumber} • Wealth Yoga</span>
                    <h4 className="text-sm font-black text-slate-100">{y.yogaName}</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-emerald-950 text-emerald-300 border-emerald-800">
                    {y.fruitionStrength}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-2.5">{y.classicalSlokaSummary}</p>
              </div>

              <div className="pt-2 border-t border-slate-900 text-xs">
                <span className="text-[10px] text-emerald-300 font-bold block">Dr. B.V. Raman Note:</span>
                <p className="text-slate-200 mt-0.5">{y.drBvRamanCommentary}</p>
              </div>
            </div>
          ))}
          {report.dhanaYogas.length === 0 && (
            <p className="text-xs text-slate-500 italic">Standard 2nd/11th house Parashari wealth rules apply.</p>
          )}
        </div>
      )}

      {/* TAB 3: DASHA EXCEPTIONS */}
      {activeTab === "dasha" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.dashaExceptions.map((y, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-3 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] text-purple-400 font-bold block">Adhyaya {y.adhyayaNumber} • Dasha Override</span>
                    <h4 className="text-sm font-black text-slate-100">{y.yogaName}</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-purple-950 text-purple-300 border-purple-800">
                    {y.fruitionStrength}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-2.5">{y.classicalSlokaSummary}</p>
              </div>

              <div className="pt-2 border-t border-slate-900 text-xs">
                <span className="text-[10px] text-purple-300 font-bold block">Dr. B.V. Raman Note:</span>
                <p className="text-slate-200 mt-0.5">{y.drBvRamanCommentary}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: DR. B.V. RAMAN COMMENTARY */}
      {activeTab === "commentary" && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] text-amber-400 uppercase font-bold">Adhyayas 1 to 14 Exegesis</span>
            <h4 className="text-base font-black text-slate-100 mt-0.5">
              Why Bhavartha Ratnakara Overrides Standard Parashari Principles
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold block">1. Lagnawise Functional Dominance:</span>
              <p className="text-slate-300">
                Sri Ramanujacharya demonstrates that certain planets act as supreme Yogakarakas (like Saturn for Taurus and Libra, or Mars for Cancer and Leo) even when standard Parashari rules might assign them partial maleficence due to second house lordship.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold block">2. Dusthana Dasha Exceptions:</span>
              <p className="text-slate-300">
                Planets in 6th, 8th, or 12th houses possessing strength or conjoined with benefic lords produce sudden windfalls and rapid career ascents during their Dasha-Bhukti periods rather than standard adversity.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
