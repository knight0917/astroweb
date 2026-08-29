"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluatePatanjaliYoga } from "../engine/patanjaliYoga";
import { PatanjaliYogaAnalysis } from "../engine/types";

export default function PatanjaliYogaDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"chakras" | "ashtanga" | "sutras">("chakras");

  const yogaReport: PatanjaliYogaAnalysis = useMemo(() => evaluatePatanjaliYoga(ephemeris), [ephemeris]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧘</span>
            <h2 className="text-lg font-bold text-slate-100">
              Maharshi Patanjali Yoga Sutras & Chakra Sadhana Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            7 Chakra-Graha Energetic Matrix, 8 Limbs of Ashtanga Yoga & Classical Sanskrit Sutras for Mental Stillness.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-violet-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-violet-500/40 text-center">
            <div className="text-[9px] text-violet-400 uppercase tracking-wider font-bold">Chakra Harmony</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🌈</span>
              <span>{yogaReport.overallChakraHarmonyScore}% Balance</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/40 text-center">
            <div className="text-[9px] text-cyan-400 uppercase tracking-wider font-bold">Chitta Vritti State</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🧠</span>
              <span>{yogaReport.chittaVrittiState.split(" ")[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("chakras")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "chakras"
              ? "bg-violet-500 text-slate-950 shadow-lg shadow-violet-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>🌈</span>
          <span>7 Chakra-Graha Alignment</span>
        </button>

        <button
          onClick={() => setActiveTab("ashtanga")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "ashtanga"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>🧘</span>
          <span>8-Limb Ashtanga Sadhana</span>
        </button>

        <button
          onClick={() => setActiveTab("sutras")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "sutras"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>📜</span>
          <span>Patanjali Yoga Sutras</span>
        </button>
      </div>

      {/* TAB 1: 7 CHAKRA-GRAHA MATRIX */}
      {activeTab === "chakras" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">🌈</span>
            <div>
              <span className="font-bold text-violet-400">Kundalini Chakra-Graha Axis:</span> Each of the 7 vital energy vortexes is governed by cosmic Grahas. Fortifying weak chakras with targeted asanas and pranayama balances the nervous system and dissolves karmic friction.
            </div>
          </div>

          {/* Chakras Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {yogaReport.chakras.map((chk) => (
              <div
                key={chk.chakraNumber}
                className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold font-mono text-violet-400">#{chk.chakraNumber}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{chk.sanskritName}</h4>
                      <span className="text-[10px] text-slate-400">{chk.englishName} • {chk.element}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-300">{chk.balanceScore}%</span>
                    <div className="text-[9px] text-slate-400">{chk.status.split(" ")[0]}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Ruling Grahas:</span>
                    <span className="text-slate-200 font-medium">{chk.rulingGrahas.join(", ")}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Bija Mantra:</span>
                    <span className="text-amber-300 font-mono font-bold">{chk.bijaMantra}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                  <div>
                    <span className="text-violet-400 font-semibold">🧘 Asana: </span>
                    <span>{chk.recommendedAsana}</span>
                  </div>
                  <div>
                    <span className="text-cyan-400 font-semibold">💨 Pranayama: </span>
                    <span>{chk.recommendedPranayama}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: 8-LIMB ASHTANGA SADHANA */}
      {activeTab === "ashtanga" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">🧘</span>
            <div>
              <span className="font-bold text-cyan-400">Ashtanga Yoga (8 Limbs of Transformation):</span> Maharshi Patanjali's sequential ladder from ethical discipline (Yama/Niyama) to seated posture (Asana), breath expansion (Pranayama), sensory mastery (Pratyahara), and divine absorption (Samyama).
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {yogaReport.ashtangaLimbs.map((limb) => (
              <div
                key={limb.limbNumber}
                className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-cyan-400">Limb {limb.limbNumber}</span>
                    <h4 className="text-sm font-bold text-slate-100">{limb.limbName.split(" ")[0]}</h4>
                  </div>
                  <span className="text-[10px] text-amber-300 bg-slate-950 px-2 py-0.5 rounded font-medium">
                    {limb.planetaryAlignment}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 italic">{limb.sanskritTitle}</div>

                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-200">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">Daily Practice Protocol:</span>
                  {limb.dailyPracticeProtocol}
                </div>

                <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                  <span className="text-amber-400">✨</span>
                  <span>{limb.spiritualObjective}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PATANJALI YOGA SUTRAS */}
      {activeTab === "sutras" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">📜</span>
            <div>
              <span className="font-bold text-amber-400">Core Patanjali Sutras:</span> Ancient Sanskrit aphorisms providing the timeless science of transcending mental turbulence and realizing your sovereign Divine Self (Kaivalya).
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {yogaReport.keySutras.map((sutra, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded border border-amber-500/30">
                    {sutra.sutraRef} • {sutra.padaName}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 font-serif leading-relaxed">
                  "{sutra.sanskritText}"
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <strong className="text-amber-200 block mb-1">English Translation:</strong>
                  {sutra.englishTranslation}
                </p>

                <div className="text-xs text-emerald-400 font-medium flex items-center gap-2 pt-1">
                  <span>🌌 Astrological Sadhana Link:</span>
                  <span>{sutra.astrologicalApplication}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
