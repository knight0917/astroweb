"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import {
  evaluatePrashna,
  PRASHNA_TOPICS,
  PrashnaTopic,
  PrashnaAnalysisResult,
} from "../engine/prashna";

export default function PrashnaView() {
  const { ephemeris } = useAstroStore();
  const [selectedTopic, setSelectedTopic] = useState<PrashnaTopic>("career");
  const [seedNumber, setSeedNumber] = useState<string>("");

  const prashnaResult: PrashnaAnalysisResult = useMemo(() => {
    const seed = seedNumber ? parseInt(seedNumber, 10) : undefined;
    return evaluatePrashna(selectedTopic, ephemeris, isNaN(seed || NaN) ? undefined : seed);
  }, [selectedTopic, ephemeris, seedNumber]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 bg-clip-text text-transparent">
              Instant Tajik Prashna (Horary / प्रश्न तन्त्र)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Prasna Tantra & Tajika Neelakanthi • 16 Tajika Yogas (Ithasala, Ishrafa, Nakta, Kamboola), Deeptamsha Orbs & Horary Yes/No
          </p>
        </div>

        {/* Quick Confidence Pill */}
        <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800 shadow-inner">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Manifestation Probability</span>
            <span className="text-xl font-black text-purple-300">{prashnaResult.confidenceScore}%</span>
          </div>
          <span
            className={`px-2.5 py-1 rounded-xl text-xs font-black border ${
              prashnaResult.confidenceScore >= 75
                ? "bg-emerald-950 text-emerald-300 border-emerald-500"
                : prashnaResult.confidenceScore >= 50
                ? "bg-amber-950 text-amber-300 border-amber-500"
                : "bg-rose-950 text-rose-300 border-rose-500"
            }`}
          >
            {prashnaResult.confidenceScore >= 75 ? "HIGH" : prashnaResult.confidenceScore >= 50 ? "MEDIUM" : "LOW"}
          </span>
        </div>
      </div>

      {/* Topic Selection Grid */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider">
            Select Query / Question Intent (प्रश्न विषय)
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <label className="text-slate-400 font-bold hidden sm:inline">Seed (1-108):</label>
            <input
              type="number"
              min="1"
              max="108"
              placeholder="1-108"
              value={seedNumber}
              onChange={(e) => setSeedNumber(e.target.value)}
              className="w-20 bg-slate-900 border border-slate-700 text-purple-300 text-xs rounded-xl px-2 py-1 font-mono font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {Object.values(PRASHNA_TOPICS).map((t) => {
            const isSelected = selectedTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-purple-900/40 border-purple-400 shadow-md scale-[1.02]"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs text-slate-200 line-clamp-1">{t.title}</div>
                <div className="text-[10px] text-purple-300 font-mono mt-0.5">{t.sanskritTitle}</div>
                <span className="inline-block text-[9px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400 mt-1 font-mono">
                  House #{t.karyaHouse}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Planetary Aspect & Core Significators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lagnesha (Querent) Card */}
        <div className="glass-panel p-5 rounded-2xl border border-sky-500/30 bg-slate-950/80 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              1st House (पृच्छक / Querent)
            </span>
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-100">{prashnaResult.lagnesha}</h4>
            <p className="text-xs text-slate-400 font-mono">
              Lagna: {prashnaResult.lagnaSign} ({prashnaResult.lagnaDegree})
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
            Represents your mindset, intent, and personal energy investment in this matter.
          </div>
        </div>

        {/* Karyesha (Target Matter) Card */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-slate-950/80 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {prashnaResult.karyaHouse}th House (कार्येश / Objective)
            </span>
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-100">{prashnaResult.karyesha}</h4>
            <p className="text-xs text-slate-400 font-mono">
              Target Matter: {prashnaResult.topic.title}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
            Represents the fruit, fulfillment, and counter-parties of the question.
          </div>
        </div>

        {/* Aspect & Applying Relation Card */}
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 bg-slate-950/80 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Tajik Aspect & Orb (दृष्टि एवं दीप्तांश)
            </span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-purple-300">{prashnaResult.applyingAspect.aspectType}</h4>
            <p className="text-xs text-slate-400 font-mono">
              Orb: {prashnaResult.applyingAspect.orbDegrees}° (Max Allowed: {prashnaResult.applyingAspect.maxAllowedOrb}°)
            </p>
          </div>
          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <span className="text-slate-400">Application Status:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded ${
                prashnaResult.applyingAspect.isApplying
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-500"
                  : "bg-rose-950 text-rose-300 border border-rose-500"
              }`}
            >
              {prashnaResult.applyingAspect.isApplying ? "Applying (इत्थशाल)" : "Separating (ईशराफ)"}
            </span>
          </div>
        </div>
      </div>

      {/* Detected Tajika Yogas */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          16 Classical Tajika Yogas Formation (ताजिक योग विश्लेषण)
        </h3>

        {prashnaResult.detectedYogas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prashnaResult.detectedYogas.map((y, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-purple-300">{y.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{y.sanskritName}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-black border ${
                      y.impactOnOutcome.includes("Positive")
                        ? "bg-emerald-950 text-emerald-300 border-emerald-500"
                        : "bg-rose-950 text-rose-300 border-rose-500"
                    }`}
                  >
                    {y.impactOnOutcome}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{y.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            No dominant Tajika planetary conjunction detected within current orb. General transit indicators applied.
          </div>
        )}
      </div>

      {/* Final Astrological Verdict Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl border border-purple-500/50 bg-gradient-to-br from-purple-950/40 via-slate-950 to-slate-950 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block">
              FINAL TAJIK PRASHNA VERDICT (प्रश्न निर्णय)
            </span>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">
              {prashnaResult.verdict}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-mono">Timing Prediction:</span>
            <span className="text-sm font-bold text-emerald-300 font-mono">
              {prashnaResult.timingPrediction}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed border-t border-slate-800 pt-4">
          {prashnaResult.verdictSummary}
        </p>

        <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-400 font-mono">
          <span>Moon: {prashnaResult.moonSign} ({prashnaResult.moonNakshatra})</span>
          {prashnaResult.isMoonVoidOfCourse && (
            <span className="text-amber-400 font-semibold">Moon Void of Course (&gt;28° in sign)</span>
          )}
        </div>
      </div>
    </div>
  );
}
