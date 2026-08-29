"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateVedicPredictions } from "../engine/vedicPredictions";
import { VedicPredictiveAnalysis } from "../engine/types";

export default function VedicPredictionsDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"milestones" | "tiers" | "roadmap" | "remedies">("milestones");
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("career");

  const report: VedicPredictiveAnalysis = useMemo(() => {
    return evaluateVedicPredictions(ephemeris);
  }, [ephemeris]);

  const activeMilestone = report.milestonePredictions.find((m) => m.milestoneId === selectedMilestoneId) || report.milestonePredictions[0];
  const topMilestone = report.milestonePredictions.slice().sort((a, b) => b.probabilityScore - a.probabilityScore)[0];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h2 className="text-lg font-bold text-slate-100">
              Vedic Astrology and Predictions (वैदिक ज्योतिष एवं भविष्यकथन)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Advanced Multi-Tiered Event Forecasting: Natal Promise (Tier 1) + Dasha Gateway (Tier 2) + Double Transit (Tier 3).
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Predictive Potency</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>⚡</span>
              <span>{report.overallPredictivePotency}% Average</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/40 text-center">
            <div className="text-[9px] text-cyan-400 uppercase tracking-wider font-bold">Top Milestone</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🏆</span>
              <span>{topMilestone.sanskritTitle.split(" एवं")[0]} ({topMilestone.probabilityScore}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 p-5 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              Comprehensive Predictive Synthesis (समग्र भविष्यकथन निर्णय)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              3-Tier Life Event Forecasting Roadmap
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterPredictionsSynthesis}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Immediate Horizons (0-6m):</span>
            <span className="text-xs font-black text-slate-100 block mt-0.5">
              {report.activeTimeHorizons.immediateCount} Milestone(s) in active fruition
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Near-Term Horizons (6-18m):</span>
            <span className="text-xs font-bold text-amber-300 block mt-0.5">
              {report.activeTimeHorizons.nearTermCount} Milestone(s) developing momentum
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("milestones")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "milestones"
              ? "bg-cyan-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🎯 6 Life Milestones Probability
        </button>
        <button
          onClick={() => setActiveTab("tiers")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "tiers"
              ? "bg-cyan-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🔍 Multi-Tier Filter Inspector
        </button>
        <button
          onClick={() => setActiveTab("roadmap")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "roadmap"
              ? "bg-cyan-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⏳ Timing Window Roadmap
        </button>
        <button
          onClick={() => setActiveTab("remedies")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "remedies"
              ? "bg-cyan-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌿 Holistic Remedial Protocol
        </button>
      </div>

      {/* TAB 1: 6 LIFE MILESTONES PROBABILITY */}
      {activeTab === "milestones" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.milestonePredictions.map((m) => {
            const isHigh = m.probabilityTier.includes("High");
            const isMod = m.probabilityTier.includes("Moderate");
            return (
              <div
                key={m.milestoneId}
                className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                  isHigh
                    ? "bg-slate-950 border-emerald-500/40 shadow-xl ring-1 ring-emerald-500/30"
                    : isMod
                    ? "bg-slate-950 border-cyan-500/30"
                    : "bg-slate-950/60 border-slate-800"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="text-sm font-black text-slate-100">{m.title}</h4>
                      <span className="text-[10px] text-cyan-300 font-semibold">{m.sanskritTitle}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isHigh
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : isMod
                          ? "bg-cyan-950 text-cyan-300 border-cyan-800"
                          : "bg-slate-900 text-slate-400 border-slate-800"
                      }`}
                    >
                      {m.probabilityScore}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{m.predictiveVerdict}</p>

                  <div className="flex flex-wrap gap-1.5 text-[9px] font-semibold pt-1">
                    <span className={`px-2 py-0.5 rounded ${m.tiers.tier1NatalPromise ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800" : "bg-slate-900 text-slate-500"}`}>
                      ✓ Tier 1 Natal
                    </span>
                    <span className={`px-2 py-0.5 rounded ${m.tiers.tier2DashaGateway ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800" : "bg-slate-900 text-slate-500"}`}>
                      ✓ Tier 2 Dasha
                    </span>
                    <span className={`px-2 py-0.5 rounded ${m.tiers.tier3DoubleTransit ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800" : "bg-slate-900 text-slate-500"}`}>
                      ✓ Tier 3 Transit
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400 font-semibold">Time Horizon:</span>
                    <span className="text-amber-300 font-bold">{m.timeHorizon}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${m.probabilityScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: MULTI-TIER FILTER INSPECTOR */}
      {activeTab === "tiers" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Milestone Selector */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Select Milestone (जीवन लक्ष्य)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {report.milestonePredictions.map((m) => {
                const isSelected = selectedMilestoneId === m.milestoneId;
                return (
                  <div
                    key={m.milestoneId}
                    onClick={() => setSelectedMilestoneId(m.milestoneId)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-cyan-600/20 border-cyan-400 shadow-lg ring-1 ring-cyan-400"
                        : "bg-slate-950/60 border-slate-800 hover:bg-slate-900"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-black text-slate-100">{m.title}</h4>
                      <span className="text-[10px] text-cyan-300">{m.sanskritTitle}</span>
                    </div>
                    <span className="text-xs font-black text-emerald-400">{m.probabilityScore}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3-Tier Inspector Card */}
          <div className="lg:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
                  3-Tier Filter Diagnostics ({activeMilestone.title})
                </span>
                <h4 className="text-base font-black text-slate-100 mt-0.5">{activeMilestone.sanskritTitle}</h4>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Probability Rating</span>
                <span className="text-sm font-black text-emerald-300">{activeMilestone.probabilityScore}% — {activeMilestone.probabilityTier.split(" (")[0]}</span>
              </div>
            </div>

            {/* Tier 1 */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <span>🏛️</span>
                  <span>Tier 1: Natal Promise (D1 & Varga Foundation)</span>
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeMilestone.tiers.tier1NatalPromise ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-slate-950 text-slate-400"}`}>
                  {activeMilestone.tiers.tier1NatalPromise ? "Validated" : "Pending"}
                </span>
              </div>
              <p className="text-slate-300 mt-1">{activeMilestone.tiers.tier1Details}</p>
            </div>

            {/* Tier 2 */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <span>⏳</span>
                  <span>Tier 2: Dasha Gateway (Vimshottari Activation)</span>
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeMilestone.tiers.tier2DashaGateway ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-slate-950 text-slate-400"}`}>
                  {activeMilestone.tiers.tier2DashaGateway ? "Active" : "Incubating"}
                </span>
              </div>
              <p className="text-slate-300 mt-1">{activeMilestone.tiers.tier2Details}</p>
            </div>

            {/* Tier 3 */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-bold flex items-center gap-1.5">
                  <span>🪐</span>
                  <span>Tier 3: Double Transit Sanction (Jupiter-Saturn Catalyst)</span>
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeMilestone.tiers.tier3DoubleTransit ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-slate-950 text-slate-400"}`}>
                  {activeMilestone.tiers.tier3DoubleTransit ? "Sanctioned" : "Upcoming"}
                </span>
              </div>
              <p className="text-slate-300 mt-1">{activeMilestone.tiers.tier3Details}</p>
            </div>

            {/* Action Guidance */}
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
              <span className="text-emerald-300 font-bold block mb-0.5">💡 Actionable Strategy:</span>
              <p className="text-slate-200 leading-relaxed">{activeMilestone.actionGuidance}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TIMING ROADMAP */}
      {activeTab === "roadmap" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Chronological Event Horizon Roadmap (कालक्रम भविष्य)</h4>
            <p className="text-xs text-slate-400">
              Life milestones sorted by dynamic manifestation urgency and probability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Immediate */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] text-emerald-400 uppercase font-bold">Immediate Window (0 - 6 Months)</span>
                <h4 className="text-sm font-black text-slate-100 mt-0.5">Active Breakthroughs</h4>
              </div>
              <div className="space-y-2">
                {report.milestonePredictions.filter((m) => m.timeHorizon.includes("Immediate")).map((m) => (
                  <div key={m.milestoneId} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-100">{m.title}</span>
                      <span className="text-emerald-400">{m.probabilityScore}%</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{m.predictiveVerdict}</p>
                  </div>
                ))}
                {report.milestonePredictions.filter((m) => m.timeHorizon.includes("Immediate")).length === 0 && (
                  <p className="text-xs text-slate-500 italic">No immediate high-urgency transitions active.</p>
                )}
              </div>
            </div>

            {/* Near-Term */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] text-cyan-400 uppercase font-bold">Near-Term Window (6 - 18 Months)</span>
                <h4 className="text-sm font-black text-slate-100 mt-0.5">Developing Momentum</h4>
              </div>
              <div className="space-y-2">
                {report.milestonePredictions.filter((m) => m.timeHorizon.includes("Near-Term")).map((m) => (
                  <div key={m.milestoneId} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-100">{m.title}</span>
                      <span className="text-cyan-400">{m.probabilityScore}%</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{m.predictiveVerdict}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Long-Term */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Long-Term Window (2 - 5 Years)</span>
                <h4 className="text-sm font-black text-slate-100 mt-0.5">Foundational Incubation</h4>
              </div>
              <div className="space-y-2">
                {report.milestonePredictions.filter((m) => m.timeHorizon.includes("Long-Term")).map((m) => (
                  <div key={m.milestoneId} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-100">{m.title}</span>
                      <span className="text-slate-400">{m.probabilityScore}%</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{m.predictiveVerdict}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HOLISTIC REMEDIAL PROTOCOL */}
      {activeTab === "remedies" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Holistic Triad Remedial Protocol (समग्र निवारण एवं ग्रह शुद्धि)</h4>
            <p className="text-xs text-slate-400">
              Synchronized Vedic remedial strategy uniting Gemstones (Mani), Vibrational Japa (Mantra), and Selfless Charity (Dana).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.holisticRemedies.map((r, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="border-b border-slate-800 pb-2">
                    <span className="text-[10px] text-cyan-400 uppercase font-bold block">Pillar #{idx + 1}</span>
                    <h4 className="text-sm font-black text-slate-100 mt-0.5">{r.category}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-3">{r.remedy}</p>
                </div>

                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 font-bold">
                  Focus Target: {r.targetGraha}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
