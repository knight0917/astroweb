"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateBrihatJataka, BrihatJatakaReport } from "../engine/brihatJataka";

export default function BrihatJatakaDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"karma" | "drekkanas" | "nabhasa" | "gateways">("karma");

  const report: BrihatJatakaReport = useMemo(() => {
    return evaluateBrihatJataka(ephemeris);
  }, [ephemeris]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <h2 className="text-lg font-bold text-slate-100">
              Acharya Varahamihira: Brihat Jataka Master Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Classical Crest-Jewel (6th Century CE) — Karma Jeeva (10th Lord D9 Dispositor), 36 Drekkanas & 32 Nabhasa Yogas.
          </p>
        </div>

        {/* Primary Karma Dispositor Badge */}
        <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-4 py-2 rounded-xl border border-amber-500/40 text-center sm:text-right">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">Karma Jeeva Dispositor</div>
          <div className="text-sm font-black text-slate-100 flex items-center gap-1.5 justify-center sm:justify-end">
            <span>💼</span>
            <span>{report.karmaJeeva.navamshaDispositor} (D9 Lord of H10)</span>
          </div>
        </div>
      </div>

      {/* Karma Jeeva Hero Card */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              {report.karmaJeeva.sanskritTradeTitle}
            </span>
            <h3 className="text-lg font-black text-slate-100">
              Primary Artha Source: {report.karmaJeeva.navamshaDispositor} Dispositorship
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            <strong className="text-amber-300">Classical Wealth Source:</strong> {report.karmaJeeva.classicalSourceOfWealth}
          </p>
        </div>

        {/* Modern Industries & Careers */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">High-Yield Career Alignments:</span>
            <span className="text-xs font-semibold text-slate-200 block mt-0.5">
              {report.karmaJeeva.modernCareerAlignments.slice(0, 2).join(" • ")}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Recommended Sectors:</span>
            <span className="text-xs font-semibold text-slate-200 block mt-0.5">
              {report.karmaJeeva.recommendedIndustries.slice(0, 2).join(" • ")}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("karma")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "karma"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          💼 Karma Jeeva (Vocational Sutra)
        </button>
        <button
          onClick={() => setActiveTab("drekkanas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "drekkanas"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🛡️ 36 Drekkanas Decanate Inspector
        </button>
        <button
          onClick={() => setActiveTab("nabhasa")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "nabhasa"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌌 32 Nabhasa Yogas
        </button>
        <button
          onClick={() => setActiveTab("gateways")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "gateways"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🚪 Nisheka & Niryana Gateways
        </button>
      </div>

      {/* Tab 1: Karma Jeeva */}
      {activeTab === "karma" && (
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">10th House from Lagna:</span>
              <span className="text-base font-black text-amber-300">
                {report.karmaJeeva.tenthHouseFromLagnaSign} (Lord: {report.karmaJeeva.tenthLordFromLagna})
              </span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">10th Lord's D9 Navamsha Sign:</span>
              <span className="text-base font-black text-purple-300">
                {report.karmaJeeva.tenthLordNavamshaSign}
              </span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">Navamshadhipati (Prime Ruler):</span>
              <span className="text-base font-black text-emerald-300">
                {report.karmaJeeva.navamshaDispositor}
              </span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-300 block mb-1">Varahamihira Sloka 10.1 Dictum:</strong>
            {report.karmaJeeva.varahamihiraDictum}
          </div>
        </div>
      )}

      {/* Tab 2: 36 Drekkanas */}
      {activeTab === "drekkanas" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            report.drekkanas.lagnaDrekkana,
            report.drekkanas.moonDrekkana,
            report.drekkanas.sunDrekkana,
          ].map((d) => (
            <div key={d.pointName} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{d.icon}</span>
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        Decanate #{d.decanateNumber} ({d.decanateDegrees})
                      </span>
                      <h4 className="text-sm font-black text-slate-100">{d.pointName}</h4>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-200 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {d.signName}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 mt-3">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                    <strong className="text-amber-300 block text-[10px] uppercase">Archetype:</strong>
                    <span className="font-bold text-slate-100">{d.archetype}</span>
                  </div>
                  <p className="leading-relaxed">
                    <strong className="text-purple-300">Psychological Trait:</strong> {d.psychologicalTrait}
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <strong className="text-rose-400">Somatic Sensitivity:</strong> {d.somaticVulnerability}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: 32 Nabhasa Yogas */}
      {activeTab === "nabhasa" && (
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌌</span>
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {report.nabhasaYoga.yogaCategory} ({report.nabhasaYoga.sanskritName})
                </span>
                <h3 className="text-base font-black text-slate-100">
                  {report.nabhasaYoga.activeYogaName}
                </h3>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800">
              {report.nabhasaYoga.occupiedSignsCount} Signs Distribution
            </span>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1 text-xs text-slate-300 leading-relaxed">
            <strong className="text-slate-400 block text-[10px] uppercase">Classical Definition:</strong>
            <p>{report.nabhasaYoga.classicalDefinition}</p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-emerald-400 block mb-1">Lifelong Phala (Unconditional Operating Fruit):</strong>
            {report.nabhasaYoga.lifelongPhala}
          </div>
        </div>
      )}

      {/* Tab 4: Gateways */}
      {activeTab === "gateways" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-2.5">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="text-xl">🌱</span>
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-bold">Chapter 4</span>
                <h4 className="text-sm font-bold text-slate-100">Nisheka (Cosmic Conception Time)</h4>
              </div>
            </div>
            <p className="leading-relaxed text-slate-300">
              {report.nishekaInsight}
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-2.5">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="text-xl">🕊️</span>
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-bold">Chapter 23</span>
                <h4 className="text-sm font-bold text-slate-100">Niryana (Death Gateway & Elemental Shift)</h4>
              </div>
            </div>
            <p className="leading-relaxed text-slate-300">
              {report.niryanaInsight}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
