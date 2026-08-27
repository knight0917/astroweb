"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateMultiDashaSystems, MultiDashaReport, YoginiMahadasha } from "../engine/dashaSystems";

export default function DashaSystemsDeck() {
  const { ephemeris, currentDate } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"active" | "timeline" | "conditional" | "triangulation">("active");
  const [selectedMdIdx, setSelectedMdIdx] = useState<number | null>(null);

  const report: MultiDashaReport = useMemo(() => {
    return evaluateMultiDashaSystems(ephemeris, currentDate);
  }, [ephemeris, currentDate]);

  const formatDate = (d: Date) => {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⏳</span>
            <h2 className="text-lg font-bold text-slate-100">
              Parashari Multi-Dasha & Yogini Dasha Suite (36-Year Cycle)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Reference: <em>Encyclopedia of Vedic Astrology: Dasha Systems</em> — 8 Yoginis, Conditional Dashas & Multi-Clock Triangulation.
          </p>
        </div>

        {/* Active Yogini Badge */}
        <div className="bg-gradient-to-r from-purple-950/50 to-slate-900 px-4 py-2 rounded-xl border border-purple-500/40 text-center sm:text-right">
          <div className="text-[10px] text-purple-400 uppercase tracking-wider font-bold">Active Yogini Dasha</div>
          <div className="text-sm font-black text-slate-100 flex items-center gap-1.5 justify-center sm:justify-end">
            <span>{report.activeYogini.mahadasha.icon}</span>
            <span>{report.activeYogini.mahadasha.name} / {report.activeYogini.antardasha.name}</span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "active"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌺 Active Yogini Dasha
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "timeline"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          📜 Full 36-Year Yogini Timeline
        </button>
        <button
          onClick={() => setActiveTab("conditional")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "conditional"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🔍 Conditional Dasha Eligibility ({report.activeConditionalCount})
        </button>
        <button
          onClick={() => setActiveTab("triangulation")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "triangulation"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⚖️ Multi-Dasha Triangulation
        </button>
      </div>

      {/* Tab 1: Active Yogini Dasha */}
      {activeTab === "active" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mahadasha Card */}
            <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-950/15 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{report.activeYogini.mahadasha.icon}</span>
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                      Current Yogini Mahadasha ({report.activeYogini.mahadasha.sanskritName})
                    </span>
                    <h3 className="text-base font-black text-slate-100">
                      {report.activeYogini.mahadasha.name} ({report.activeYogini.mahadasha.durationYears} Years)
                    </h3>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Lord: {report.activeYogini.mahadasha.lord}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-400">Period Start:</span>
                  <span className="font-bold text-slate-200">{formatDate(report.activeYogini.mdStartDate)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-400">Period End:</span>
                  <span className="font-bold text-slate-200">{formatDate(report.activeYogini.mdEndDate)}</span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                {report.activeYogini.mahadasha.generalSignificance}
              </div>
            </div>

            {/* Antardasha Card */}
            <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/15 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{report.activeYogini.antardasha.icon}</span>
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Current Yogini Sub-Period ({report.activeYogini.antardasha.sanskritName})
                    </span>
                    <h3 className="text-base font-black text-slate-100">
                      {report.activeYogini.antardasha.name} Sub-Period
                    </h3>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Lord: {report.activeYogini.antardasha.lord}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-400">Sub-Period Start:</span>
                  <span className="font-bold text-slate-200">{formatDate(report.activeYogini.adStartDate)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-400">Sub-Period End:</span>
                  <span className="font-bold text-slate-200">{formatDate(report.activeYogini.adEndDate)}</span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                {report.activeYogini.interpretation}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Full 36-Year Timeline */}
      {activeTab === "timeline" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Yogini Mahadasha</th>
                  <th className="p-3">Planetary Ruler</th>
                  <th className="p-3">Span</th>
                  <th className="p-3">Start Date</th>
                  <th className="p-3">End Date</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                {report.yoginiTimeline.slice(0, 16).map((md, idx) => (
                  <React.Fragment key={idx}>
                    <tr className={`hover:bg-slate-800/40 transition-colors ${selectedMdIdx === idx ? "bg-amber-950/20" : ""}`}>
                      <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-100 flex items-center gap-2">
                        <span>{md.yogini.icon}</span>
                        <span>{md.yogini.name} ({md.yogini.sanskritName})</span>
                      </td>
                      <td className="p-3 font-semibold text-amber-400">{md.yogini.lord}</td>
                      <td className="p-3 font-mono text-slate-300">{md.durationYears} yrs</td>
                      <td className="p-3 font-mono text-slate-300">{formatDate(md.startDate)}</td>
                      <td className="p-3 font-mono text-slate-300">{formatDate(md.endDate)}</td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedMdIdx(selectedMdIdx === idx ? null : idx)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-200 cursor-pointer"
                        >
                          {selectedMdIdx === idx ? "Hide ADs" : "View 8 ADs"}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Antardashas row */}
                    {selectedMdIdx === idx && (
                      <tr className="bg-slate-950/80">
                        <td colSpan={7} className="p-4">
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                              Antardashas (Sub-Periods) within {md.yogini.name} Mahadasha
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                              {md.antardashas.map((ad, aIdx) => (
                                <div key={aIdx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-100 flex items-center gap-1">
                                      <span>{ad.yogini.icon}</span>
                                      <span>{ad.yogini.name}</span>
                                    </span>
                                    <span className="text-[10px] text-amber-400 font-mono">{ad.durationMonths} mo</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                                    {formatDate(ad.startDate)} → {formatDate(ad.endDate)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Conditional Dasha Eligibility */}
      {activeTab === "conditional" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.conditionalEligibilities.map((c) => (
              <div
                key={c.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                  c.isEligible
                    ? "bg-emerald-950/20 border-emerald-500/50 shadow-lg"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] text-amber-400 uppercase font-bold">{c.sanskritName}</span>
                      <h4 className="text-sm font-bold text-slate-100">{c.name}</h4>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded border ${
                        c.isEligible
                          ? "bg-emerald-950 text-emerald-300 border-emerald-700 animate-pulse"
                          : "bg-slate-900 text-slate-500 border-slate-800"
                      }`}
                    >
                      {c.isEligible ? "✓ ACTIVELY ELIGIBLE" : "INELIGIBLE"}
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-1 text-xs text-slate-300">
                    <p><strong className="text-slate-400">Condition:</strong> {c.conditionText}</p>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
                  {c.evaluationReason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Multi-Dasha Triangulation */}
      {activeTab === "triangulation" && (
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Multi-Clock Convergence</span>
              <h3 className="text-base font-black text-slate-100">Vimshottari (120y) vs Yogini (36y) Triangulation</h3>
            </div>
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
              Concurrence Score: {report.multiDashaTriangulation.concurrenceScorePercent}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">Active Vimshottari Period (120y):</span>
              <span className="text-base font-black text-purple-400">
                {report.multiDashaTriangulation.vimshottariMD} / {report.multiDashaTriangulation.vimshottariAD}
              </span>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Governs the macro psychological and karmic life chapter.
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">Active Yogini Period (36y):</span>
              <span className="text-base font-black text-amber-400">
                {report.multiDashaTriangulation.yoginiMD} / {report.multiDashaTriangulation.yoginiAD}
              </span>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Catalyzes fast real-world environmental triggers and vitality.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-emerald-400">Triangulation Verdict:</strong> {report.multiDashaTriangulation.triangulationVerdict}
          </div>
        </div>
      )}
    </div>
  );
}
