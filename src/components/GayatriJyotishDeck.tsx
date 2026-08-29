"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateGayatriJyotish } from "../engine/gayatriJyotish";
import { GayatriJyotishAnalysis } from "../engine/types";

export default function GayatriJyotishDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"gayatris" | "matrix" | "koshas" | "anushthana">("gayatris");
  const [selectedAksharaIdx, setSelectedAksharaIdx] = useState<number>(1);
  const [selectedGraha, setSelectedGraha] = useState<string>("Sun");

  const report: GayatriJyotishAnalysis = useMemo(() => {
    return evaluateGayatriJyotish(ephemeris);
  }, [ephemeris]);

  const activeAkshara = report.aksharaMatrix.find((a) => a.index === selectedAksharaIdx) || report.aksharaMatrix[0];
  const activeGraha = report.grahaGayatris.find((g) => g.planetName === selectedGraha) || report.grahaGayatris[0];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">☀️</span>
            <h2 className="text-lg font-bold text-slate-100">
              Gayatri Jyotish (गायत्री ज्योतिष — Savita Solar Resonance)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Rigvedic Astro-Spiritual Science of 24 Syllables, 9 Graha Gayatris, 5 Koshas & Personalized Anushthana.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Personal Gayatri Akshara</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🕉️</span>
              <span>{report.personalAkshara.syllable} (Pada {report.personalAkshara.padaNumber})</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-orange-500/40 text-center">
            <div className="text-[9px] text-orange-400 uppercase tracking-wider font-bold">Savita Solar Prana</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>☀️</span>
              <span>Resonance: {report.savitaSolarResonanceScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Savita Synthesis Card */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/25 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              Savita Solar Resonance & Akshara Shakti
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Root Deity: {report.personalAkshara.presidingDeity} (Rishi: {report.personalAkshara.presidingRishi})
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterGayatriSynthesis}
          </p>
        </div>

        {/* Recommended Anushthana Quick Badge */}
        <div className="flex flex-col gap-2 min-w-[270px]">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Recommended Anushthana:</span>
            <span className="text-xs font-black text-amber-200 block mt-0.5">
              {report.anushthanaPlan.recommendedAnushthana}
            </span>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Target: {report.anushthanaPlan.targetJapaCount.toLocaleString()} Japa ({report.anushthanaPlan.dailyMalaCount} Malas/day)
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("gayatris")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "gayatris"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ☀️ 9 Graha Gayatri Mantras
        </button>
        <button
          onClick={() => setActiveTab("matrix")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "matrix"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🕉️ 24 Akshara Zodiac Matrix
        </button>
        <button
          onClick={() => setActiveTab("koshas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "koshas"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🧘 5 Kosha Spiritual Health
        </button>
        <button
          onClick={() => setActiveTab("anushthana")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "anushthana"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          📿 Gayatri Anushthana Guide
        </button>
      </div>

      {/* TAB 1: 9 GRAHA GAYATRI MANTRAS */}
      {activeTab === "gayatris" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graha Selector */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Select Graha for Gayatri Remedy
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
              {report.grahaGayatris.map((g) => {
                const isSelected = selectedGraha === g.planetName;
                const isHighAffliction = g.afflictionScore >= 50;
                return (
                  <div
                    key={g.planetName}
                    onClick={() => setSelectedGraha(g.planetName)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-amber-600/20 border-amber-400 shadow-lg ring-1 ring-amber-400"
                        : "bg-slate-950/60 border-slate-800 hover:bg-slate-900"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                        <span>{g.planetName}</span>
                        {isHighAffliction && (
                          <span className="text-[9px] bg-rose-950 text-rose-300 font-bold px-1 rounded border border-rose-800">
                            Afflicted
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-amber-400 font-semibold mt-0.5">
                        {g.presidingDevata}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {g.recommendedDailyMalas}M
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Graha Gayatri Inspector */}
          <div className="lg:col-span-2 bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">
                  Graha Gayatri Sacred Chanting Protocol
                </span>
                <h4 className="text-base font-black text-slate-100 mt-0.5">
                  {activeGraha.planetName} Gayatri Mantram
                </h4>
                <div className="text-xs text-amber-300 font-medium mt-0.5">
                  Presiding Divine Consciousness: {activeGraha.presidingDevata}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Daily Target</span>
                <span className="text-xs font-black text-amber-300">
                  {activeGraha.recommendedDailyMalas} Mala ({activeGraha.recommendedDailyMalas * 108} Japa)
                </span>
              </div>
            </div>

            {/* Sacred Mantra Display Box */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-center space-y-2">
              <div className="text-sm font-black text-amber-200 tracking-wide font-serif">
                {activeGraha.sanskritMantra}
              </div>
              <div className="text-xs text-slate-300 font-mono italic">
                {activeGraha.englishTransliteration}
              </div>
            </div>

            {/* Diagnostics & Remedial Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block">Astrological Vibration & Status:</span>
                <p className="text-slate-300 leading-relaxed">{activeGraha.afflictionReason}</p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Affliction Index:</span>
                  <span className="font-mono font-bold text-amber-300">{activeGraha.afflictionScore}%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                <span className="text-emerald-300 font-bold block">🕊️ Pranic & Therapeutic Healing:</span>
                <p className="text-slate-200 leading-relaxed">{activeGraha.therapeuticEffect}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 24 AKSHARA ZODIAC MATRIX */}
      {activeTab === "matrix" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h4 className="text-sm font-black text-slate-100">24 Syllables of Rigvedic Gayatri (चतुर्विंशति अक्षर मण्डल)</h4>
              <p className="text-xs text-slate-400">
                3 Padas $\times$ 8 Syllables mapped to the 12 Zodiac signs, 24 Tattwas & Vedic Rishis.
              </p>
            </div>
            <span className="text-[10px] bg-amber-950 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-800 font-bold">
              24 Cosmic Rays
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {report.aksharaMatrix.map((ak) => {
              const isSelected = selectedAksharaIdx === ak.index;
              const hasPlanets = ak.planetsPresent.length > 0;
              return (
                <div
                  key={ak.index}
                  onClick={() => setSelectedAksharaIdx(ak.index)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-amber-600/20 border-amber-400 shadow-lg ring-1 ring-amber-400"
                      : "bg-slate-950/60 border-slate-800 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">#{ak.index}</span>
                    <span className="text-[9px] bg-slate-900 px-1 py-0.5 rounded text-amber-300 font-bold">
                      P{ak.padaNumber}
                    </span>
                  </div>
                  <div className="text-xs font-black text-slate-100 my-1">{ak.syllable}</div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {ak.associatedRashiName.slice(0, 3)} • {ak.tattwa.split(" ")[0]}
                  </div>
                  {hasPlanets && (
                    <div className="text-[9px] text-emerald-400 font-bold mt-1 truncate">
                      {ak.planetsPresent.join(", ")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Akshara Box */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/30 space-y-3 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                  Syllable #{activeAkshara.index} — Pada {activeAkshara.padaNumber}
                </span>
                <h4 className="text-base font-black text-slate-100 mt-0.5">
                  {activeAkshara.syllable} — {activeAkshara.presidingDeity}
                </h4>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Zodiac Resonance</span>
                <span className="text-xs font-black text-amber-300">
                  {activeAkshara.associatedRashiName} ({activeAkshara.tattwa})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-bold block">Presiding Vedic Rishi:</span>
                <span className="text-slate-100 font-semibold mt-0.5 block">{activeAkshara.presidingRishi}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-bold block">Resident Natal Planets:</span>
                <span className="text-emerald-300 font-semibold mt-0.5 block">
                  {activeAkshara.planetsPresent.length ? activeAkshara.planetsPresent.join(", ") : "None (Quiescent)"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-bold block">Cosmic Element (Tattwa):</span>
                <span className="text-amber-200 font-semibold mt-0.5 block">{activeAkshara.tattwa}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              {activeAkshara.spiritualSignification}
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: 5 KOSHA SPIRITUAL HEALTH */}
      {activeTab === "koshas" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">5 Kosha Spiritual Vitality Diagnostics (पञ्चकोश विश्लेषण)</h4>
            <p className="text-xs text-slate-400">
              Assessment of the 5 sheaths of human consciousness powered by planetary Shadbala and house dynamics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.koshaDiagnostics.map((k, idx) => (
              <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                        {k.koshaName} Kosha
                      </span>
                      <h4 className="text-sm font-black text-slate-100 mt-0.5">{k.sanskritTitle}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        k.pranicStatus === "Fortified"
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : k.pranicStatus === "Balanced"
                          ? "bg-amber-950 text-amber-300 border-amber-800"
                          : "bg-rose-950 text-rose-300 border-rose-800"
                      }`}
                    >
                      {k.pranicStatus}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold">Governing Grahas:</span>
                      <span className="text-slate-200 font-semibold ml-1.5">{k.governingPlanets.join(", ")}</span>
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed pt-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      {k.harmonizationGuidance}
                    </p>
                  </div>
                </div>

                {/* Vitality Progress Bar */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-400">Vitality Index:</span>
                    <span className="text-amber-400">{k.vitalityScore}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-emerald-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${k.vitalityScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GAYATRI ANUSHTHANA GUIDE */}
      {activeTab === "anushthana" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Personalized Gayatri Anushthana Sadhana Protocol</h4>
            <p className="text-xs text-slate-400">
              Prescribed Vedic ritual sequence for solar illumination, karmic purification, and planetary arishta shanti.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target & Schedule Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-slate-100">Anushthana Parameters</span>
                <span className="text-xs font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  {report.anushthanaPlan.durationDays} Days Duration
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Recommended Program:</span>
                  <span className="font-bold text-amber-300">{report.anushthanaPlan.recommendedAnushthana}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Total Japa Count Target:</span>
                  <span className="font-bold text-slate-100">{report.anushthanaPlan.targetJapaCount.toLocaleString()} Japa</span>
                </div>
                <div className="flex justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Daily Recitation Target:</span>
                  <span className="font-bold text-emerald-300">{report.anushthanaPlan.dailyMalaCount} Malas ({report.anushthanaPlan.dailyMalaCount * 108} Japa/day)</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                  <strong className="text-slate-400 block">Optimal Sandhya Timing:</strong>
                  <span className="text-slate-200 leading-tight block">{report.anushthanaPlan.optimalSandhyaTiming}</span>
                </div>
              </div>
            </div>

            {/* Surya Arghya & Meditation Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/40 space-y-3 shadow-xl">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-slate-100">Sacred Ritual & Meditation Guidance</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <strong className="text-amber-300 block">☀️ Surya Arghya (Solar Libation):</strong>
                  <p className="text-slate-200 leading-relaxed text-[11px]">
                    {report.anushthanaPlan.suryaArghyaGuidance}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                  <strong className="text-amber-200 block">🧘 Savita Dhyana (Inner Solar Visualization):</strong>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {report.anushthanaPlan.savitaMeditationVisualization}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <strong className="text-slate-400 block text-[10px]">🛡️ Auric Protection:</strong>
                  <p className="text-slate-300 text-[11px]">{report.anushthanaPlan.recommendedKavacham}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
