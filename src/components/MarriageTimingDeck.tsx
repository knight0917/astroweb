"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateMarriageTiming, MarriageTimingReport } from "../engine/marriageTiming";
import { calculateVedicEphemeris } from "../engine/ephemeris";

export default function MarriageTimingDeck() {
  const { ephemeris, currentDate, location, ayanamsha, houseSystem, nodeType } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"filter3" | "d9ul" | "remedies">("filter3");

  const transitEphemeris = useMemo(() => {
    return calculateVedicEphemeris(currentDate, location, ayanamsha, houseSystem, nodeType);
  }, [currentDate, location, ayanamsha, houseSystem, nodeType]);

  const report: MarriageTimingReport = useMemo(() => {
    return evaluateMarriageTiming(ephemeris, transitEphemeris, currentDate);
  }, [ephemeris, transitEphemeris, currentDate]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💍</span>
            <h2 className="text-lg font-bold text-slate-100">
              K.N. Rao: Timing of Marriage (Vivaha Kala) Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Bharatiya Vidya Bhavan Method — 3-Tier Composite Predictive Filter (Natal Promise + Dual Dasha + Double Transit).
          </p>
        </div>

        {/* Marital Band Badge */}
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 px-4 py-2 rounded-xl border border-amber-500/40 text-center sm:text-right">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">Natal Marital Band</div>
          <div className="text-sm font-black text-slate-100">{report.promise.maritalBand}</div>
        </div>
      </div>

      {/* Composite Readiness Master Gauge */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            Real-Time Composite Marital Timing Readiness
          </span>
          <h3 className="text-xl font-black text-slate-100">
            Marriage Activation Index: {report.compositeReadinessPercent}%
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mt-1">
            {report.masterTimingVerdict}
          </p>
        </div>

        <div className="w-full sm:w-56 flex flex-col items-center gap-2">
          <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                report.compositeReadinessPercent >= 80
                  ? "bg-gradient-to-r from-amber-500 to-emerald-400"
                  : report.compositeReadinessPercent >= 60
                  ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                  : "bg-slate-700"
              }`}
              style={{ width: `${report.compositeReadinessPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-mono font-bold">
            Promise (30%) + Dual Dasha (40%) + DTP (30%)
          </span>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("filter3")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "filter3"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🔍 K.N. Rao 3-Tier Predictive Filter
        </button>
        <button
          onClick={() => setActiveTab("d9ul")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "d9ul"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🏛️ D9 Navamsha & Upapada Lagna (UL)
        </button>
        <button
          onClick={() => setActiveTab("remedies")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "remedies"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🕉️ Classical Marital Remedies
        </button>
      </div>

      {/* Tab 1: 3-Tier Predictive Filter */}
      {activeTab === "filter3" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Tier 1: Natal Promise */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Tier 1</span>
                  <h4 className="text-sm font-black text-slate-100">Natal Marital Promise</h4>
                </div>
                <span className="text-xs font-black text-amber-300 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800">
                  {report.promise.promiseScorePercent}%
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 mt-3">
                <div className="flex justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-400">7th House Sign:</span>
                  <span className="font-bold text-slate-200">{report.promise.seventhHouseSign}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-400">7th Lord:</span>
                  <span className="font-bold text-slate-200">{report.promise.seventhLord} (in H{report.promise.seventhLordHouseInD1})</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-400">Venus Disposition:</span>
                  <span className="font-semibold text-emerald-400">{report.promise.venusStatus}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-400">7th Occupants:</span>
                  <span className="font-semibold text-slate-200">{report.promise.seventhHouseOccupants.join(", ") || "Vacant (Pure)"}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
              {report.promise.classicalVerdict}
            </div>
          </div>

          {/* Tier 2: Dual Dasha Convergence */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Tier 2</span>
                  <h4 className="text-sm font-black text-slate-100">Dual Dasha Window</h4>
                </div>
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded border ${
                    report.dualDasha.isDualConvergenceActive
                      ? "bg-emerald-950 text-emerald-300 border-emerald-700 animate-pulse"
                      : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}
                >
                  {report.dualDasha.dashaConvergenceScorePercent}%
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 mt-3">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <strong className="text-purple-300">Vimshottari ({report.dualDasha.activeVimshottariMD}/{report.dualDasha.activeVimshottariAD}):</strong>
                  <p className="mt-0.5 text-slate-300 leading-relaxed">{report.dualDasha.vimshottariQualificationReason}</p>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <strong className="text-amber-300">Jaimini Chara ({report.dualDasha.activeCharaMD}/{report.dualDasha.activeCharaAD}):</strong>
                  <p className="mt-0.5 text-slate-300 leading-relaxed">{report.dualDasha.charaQualificationReason}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
              {report.dualDasha.timingWindowVerdict}
            </div>
          </div>

          {/* Tier 3: Double Transit Trigger */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Tier 3</span>
                  <h4 className="text-sm font-black text-slate-100">Double Transit Trigger</h4>
                </div>
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded border ${
                    report.doubleTransit.isDoubleTransitFulfilled
                      ? "bg-emerald-950 text-emerald-300 border-emerald-700 animate-pulse"
                      : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}
                >
                  {report.doubleTransit.transitScorePercent}%
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 mt-3">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <strong className="text-purple-300">Saturn (Karmic Field):</strong>
                  <p className="mt-0.5 text-slate-300 leading-relaxed">{report.doubleTransit.saturnTriggerDetails}</p>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <strong className="text-amber-300">Jupiter (Divine Sanction):</strong>
                  <p className="mt-0.5 text-slate-300 leading-relaxed">{report.doubleTransit.jupiterTriggerDetails}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
              {report.doubleTransit.transitVerdict}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: D9 Navamsha & Upapada Lagna */}
      {activeTab === "d9ul" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* D9 Navamsha Marital Confirmation */}
          <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/15 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">D9 Navamsha (Dharma & Spouse)</span>
                <h3 className="text-base font-black text-slate-100">Navamsha Lagna: {report.promise.d9LagnaSign}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                D9 7th Lord: {report.promise.d9SeventhLord}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              K.N. Rao emphasizes that while D1 promises the physical marriage, the D9 Navamsha determines the internal harmony, dharma, and lasting durability of the union.
            </p>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
              <strong className="text-amber-300">Spouse Personality Archetype:</strong>
              <p className="text-slate-300 leading-relaxed">
                Spouse nature is guided by D9 7th Lord ({report.promise.d9SeventhLord}) and D9 Lagna ({report.promise.d9LagnaSign}) vibrations.
              </p>
            </div>
          </div>

          {/* Upapada Lagna (UL) Card */}
          <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-950/15 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Jaimini Upapada Lagna (UL)</span>
                <h3 className="text-base font-black text-slate-100">Upapada Sign: {report.promise.upapadaSign}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Gauna Pada (A12)
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Upapada Lagna (UL) reflects the status, lineage wealth, and marital longevity bestowed through the spouse\'s family.
            </p>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
              <strong className="text-purple-300">Upapada Sanctification:</strong>
              <p className="text-slate-300 leading-relaxed">
                Auspicious planets in or aspecting {report.promise.upapadaSign} ensure mutual devotion, enduring loyalty, and financial stability after marriage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Remedies */}
      {activeTab === "remedies" && (
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs text-slate-300">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="text-xl">🕉️</span>
            <h3 className="text-base font-bold text-slate-100">
              Classical Marital Harmonization Guidance (K.N. Rao Tradition)
            </h3>
          </div>

          <div className="space-y-3 leading-relaxed">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <strong className="text-amber-300">1. Upapada Lagna Vrata (Fasting):</strong>
              <p className="mt-1">Fasting on the weekday of the lord of Upapada Lagna ({report.promise.upapadaSign}) neutralizes past marital debts and accelerates timely marriage.</p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <strong className="text-emerald-300">2. Sacred Mantra Sadhana:</strong>
              <p className="mt-1">Recitation of the <em>Gauri-Shankar Mantra</em> or <em>Katyayani Mantra</em> during the running Dual Dasha window invokes divine grace and removes delay bottlenecks.</p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <strong className="text-purple-300">3. General Directive:</strong>
              <p className="mt-1">{report.remedialGuidance}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
