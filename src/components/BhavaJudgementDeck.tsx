"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluate12BhavasJudgement, BhavaJudgement } from "../engine/bhavaJudgement";

export default function BhavaJudgementDeck() {
  const { ephemeris } = useAstroStore();
  const [selectedHouse, setSelectedHouse] = useState<number>(1);
  const [filter, setFilter] = useState<"ALL" | "KENDRA" | "TRIKONA" | "FLOURISHING" | "CHALLENGED">("ALL");

  const report = useMemo(() => evaluate12BhavasJudgement(ephemeris), [ephemeris]);
  const activeBhava: BhavaJudgement = report.bhavas[selectedHouse] || report.bhavas[1];

  const filteredHouses = useMemo(() => {
    const list = Object.values(report.bhavas);
    if (filter === "KENDRA") return list.filter((b) => [1, 4, 7, 10].includes(b.houseNumber));
    if (filter === "TRIKONA") return list.filter((b) => [1, 5, 9].includes(b.houseNumber));
    if (filter === "FLOURISHING") return list.filter((b) => b.compositeScore >= 70);
    if (filter === "CHALLENGED") return list.filter((b) => b.compositeScore < 55);
    return list;
  }, [report, filter]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header & Meta Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <h2 className="text-lg font-bold text-slate-100">
              12 Bhavas Tripartite Judgement Suite (त्रि-सूत्र भाव निर्णय)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grounded in Dr. B.V. Raman's <em>How to Judge a Horoscope (Vols 1 & 2)</em> — Tripartite evaluation: Bhava (30%) + Lord (40%) + Karaka (30%).
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Strongest Bhava</div>
            <div className="text-xs font-bold text-emerald-400">H{report.strongestHouse.houseNumber} ({report.strongestHouse.compositeScore}%)</div>
          </div>
          <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Average Index</div>
            <div className="text-xs font-bold text-amber-300">{report.averageScore}%</div>
          </div>
          <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sensitive Bhava</div>
            <div className="text-xs font-bold text-rose-400">H{report.weakestHouse.houseNumber} ({report.weakestHouse.compositeScore}%)</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "ALL", label: "All 12 Houses" },
            { id: "KENDRA", label: "Kendras (1, 4, 7, 10)" },
            { id: "TRIKONA", label: "Trikonas (1, 5, 9)" },
            { id: "FLOURISHING", label: "Flourishing (>=70%)" },
            { id: "CHALLENGED", label: "Sensitive (<55%)" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === tab.id
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 12 Houses Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredHouses.map((b) => {
            const isSelected = selectedHouse === b.houseNumber;
            return (
              <div
                key={b.houseNumber}
                onClick={() => setSelectedHouse(b.houseNumber)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                  isSelected
                    ? "bg-amber-950/20 border-amber-500/60 shadow-lg ring-1 ring-amber-500/30"
                    : "bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">House {b.houseNumber}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${b.badgeColor}`}>
                      {b.compositeScore}%
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-1 truncate">{b.sanskritName}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{b.domain}</div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      b.compositeScore >= 75 ? "bg-emerald-500" : b.compositeScore >= 55 ? "bg-teal-400" : "bg-amber-500"
                    }`}
                    style={{ width: `${b.compositeScore}%` }}
                  />
                </div>

                {/* Meta details */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 pt-2">
                  <span>Lord: <strong className="text-slate-300">{b.signLord} (H{b.lordHouse})</strong></span>
                  <span>SAV: <strong className="text-amber-300">{b.savPoints}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected House Deep Raman Inspection Panel */}
        <div className="lg:col-span-1 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 flex flex-col gap-4">
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Bhava {activeBhava.houseNumber} Deep Diagnostics
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${activeBhava.badgeColor}`}>
                {activeBhava.qualityBadge}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-100 mt-1">{activeBhava.name}</h3>
            <p className="text-xs text-slate-400">{activeBhava.domain}</p>
          </div>

          {/* Tripartite Breakdown Scores */}
          <div>
            <div className="text-[11px] font-bold text-slate-300 mb-2 uppercase tracking-wider">
              Tripartite Weighted Breakdown (त्रि-सूत्र)
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Bhava (30%)</div>
                <div className="text-sm font-bold text-cyan-300">{activeBhava.bhavaScore}%</div>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Lord (40%)</div>
                <div className="text-sm font-bold text-amber-300">{activeBhava.lordScore}%</div>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Karaka (30%)</div>
                <div className="text-sm font-bold text-purple-300">{activeBhava.karakaScore}%</div>
              </div>
            </div>
          </div>

          {/* Occupants & Karakas */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
              <span className="text-slate-400">Sign & Lord:</span>
              <span className="font-semibold text-slate-200">{activeBhava.signName} (Lord: {activeBhava.signLord} in H{activeBhava.lordHouse})</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
              <span className="text-slate-400">Occupants:</span>
              <span className="font-semibold text-slate-200">{activeBhava.occupants.length > 0 ? activeBhava.occupants.join(", ") : "None (Vacant)"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
              <span className="text-slate-400">Natural Karakas:</span>
              <span className="font-semibold text-slate-200">{activeBhava.primaryKaraka}{activeBhava.secondaryKaraka ? `, ${activeBhava.secondaryKaraka}` : ""}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
              <span className="text-slate-400">SAV Benefic Bindus:</span>
              <span className="font-semibold text-amber-300">{activeBhava.savPoints} points</span>
            </div>
          </div>

          {/* Raman Classical Effect & Verdict */}
          <div className="space-y-3 mt-1">
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                Lord Placement Dictum (B.V. Raman)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{activeBhava.lordPlacementEffect}</p>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                Actionable Remedial Guidance
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{activeBhava.remedialAdvice}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
