"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { calculateDoubleTransit, DoubleTransitReport } from "../engine/doubleTransit";
import { calculateVedicEphemeris } from "../engine/ephemeris";

export default function DoubleTransitDeck() {
  const { ephemeris, currentDate, location, ayanamsha, houseSystem, nodeType } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"milestones" | "radar" | "pacdares">("milestones");

  const transitEphemeris = useMemo(() => {
    return calculateVedicEphemeris(currentDate, location, ayanamsha, houseSystem, nodeType);
  }, [currentDate, location, ayanamsha, houseSystem, nodeType]);

  const report: DoubleTransitReport = useMemo(() => {
    return calculateDoubleTransit(ephemeris, transitEphemeris);
  }, [ephemeris, transitEphemeris]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h2 className="text-lg font-bold text-slate-100">
              K.N. Rao: Double Transit (DTP) & PAC-DARES Predictive Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Bharatiya Vidya Bhavan (BVB) Method — Real-Time Saturn (Karma) + Jupiter (Grace) Transit Synchronization & PAC Diagnostics.
          </p>
        </div>

        {/* Active Milestones Counter Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Saturn Gochar</div>
            <div className="text-sm font-black text-purple-400">{report.transitAspects.transitSaturnSignName} (H{report.transitAspects.transitSaturnHouseFromLagna})</div>
          </div>
          <div className="bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Jupiter Gochar</div>
            <div className="text-sm font-black text-amber-400">{report.transitAspects.transitJupiterSignName} (H{report.transitAspects.transitJupiterHouseFromLagna})</div>
          </div>
          <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 px-3.5 py-1.5 rounded-xl border border-emerald-500/50 text-center">
            <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">Active DTP Events</div>
            <div className="text-sm font-black text-emerald-300">{report.activeMilestoneCount} / 4 Active</div>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("milestones")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "milestones"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🎯 4 Major Life Milestones (DTP Check)
        </button>
        <button
          onClick={() => setActiveTab("radar")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "radar"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🪐 Saturn & Jupiter Gochar Aspect Radar
        </button>
        <button
          onClick={() => setActiveTab("pacdares")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "pacdares"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          📋 PAC-DARES Diagnostic Matrix
        </button>
      </div>

      {/* Tab 1: 4 Major Life Milestones */}
      {activeTab === "milestones" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(report.milestones).map((m) => (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                  m.isDtpFulfilled
                    ? "bg-emerald-950/20 border-emerald-500/50 shadow-lg shadow-emerald-950/20"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{m.icon}</span>
                      <div>
                        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                          {m.sanskritName}
                        </span>
                        <h3 className="text-base font-black text-slate-100">{m.name}</h3>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                        m.isDtpFulfilled
                          ? "bg-emerald-950 text-emerald-300 border-emerald-500 animate-pulse"
                          : "bg-slate-900 text-slate-400 border-slate-700"
                      }`}
                    >
                      {m.isDtpFulfilled ? "⚡ DTP FULFILLED" : "INACTIVE"}
                    </span>
                  </div>

                  {/* Readiness Progress Bar */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>Event Manifestation Window:</span>
                      <span className={m.isDtpFulfilled ? "text-emerald-400 font-bold" : "text-slate-400"}>
                        {m.readinessScorePercent}% Readiness
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full ${
                          m.isDtpFulfilled ? "bg-gradient-to-r from-amber-500 to-emerald-400" : "bg-slate-700"
                        }`}
                        style={{ width: `${m.readinessScorePercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Detailed Saturn & Jupiter Trigger breakdown */}
                  <div className="space-y-2 text-xs text-slate-300 mt-3">
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <strong className="text-purple-300">Saturn (Karmic Field):</strong>
                      <p className="mt-0.5 leading-relaxed text-slate-300">{m.saturnTriggerDetails}</p>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <strong className="text-amber-300">Jupiter (Divine Grace):</strong>
                      <p className="mt-0.5 leading-relaxed text-slate-300">{m.jupiterTriggerDetails}</p>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 font-medium bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                  {m.classicalVerdict}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-400">K.N. Rao Master Dictum:</strong> "Dasha indicates the promise and probability of an event; the simultaneous Double Transit (DTP) of Saturn and Jupiter fixes the exact time of manifestation."
          </div>
        </div>
      )}

      {/* Tab 2: Gochar Aspect Radar */}
      {activeTab === "radar" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Saturn Gochar Aspects */}
          <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-950/15 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Karmic Sanction</span>
                <h3 className="text-base font-black text-slate-100">Saturn Gochar in {report.transitAspects.transitSaturnSignName}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                House #{report.transitAspects.transitSaturnHouseFromLagna}
              </span>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed">
              Saturn casts full karmic aspect on 4 specific zodiac sectors:
            </div>

            <div className="space-y-2">
              {report.transitAspects.transitSaturnAspectedSigns.map((s, idx) => (
                <div key={idx} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-300">{s.signName}</span>
                  <span className="text-slate-400 font-mono">{s.aspectType}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Jupiter Gochar Aspects */}
          <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/15 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Divine Grace</span>
                <h3 className="text-base font-black text-slate-100">Jupiter Gochar in {report.transitAspects.transitJupiterSignName}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                House #{report.transitAspects.transitJupiterHouseFromLagna}
              </span>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed">
              Jupiter casts divine vitalizing aspect on 4 specific zodiac sectors:
            </div>

            <div className="space-y-2">
              {report.transitAspects.transitJupiterAspectedSigns.map((s, idx) => (
                <div key={idx} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300">{s.signName}</span>
                  <span className="text-slate-400 font-mono">{s.aspectType}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: PAC-DARES Diagnostic Matrix */}
      {activeTab === "pacdares" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.pacDares.map((v, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] text-amber-400 uppercase font-bold">{v.sanskritTitle}</span>
                      <h4 className="text-sm font-bold text-slate-100">{v.category}</h4>
                    </div>
                    <span className="text-xs font-black text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                      {v.scorePercent}%
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-1.5 text-xs text-slate-300">
                    <p className="leading-relaxed">{v.pacSynthesis}</p>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
                  <strong className="text-amber-300">Verdict:</strong> {v.verdict}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
