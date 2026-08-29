"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateJaiminiSutrasComplete } from "../engine/jaiminiSutras";
import { JaiminiSutrasCompleteAnalysis } from "../engine/types";

export default function JaiminiSutrasDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"karakamsha" | "charadasha" | "upapada" | "longevity">("karakamsha");
  const [selectedBhavaNum, setSelectedBhavaNum] = useState<number>(1);

  const report: JaiminiSutrasCompleteAnalysis = useMemo(() => {
    return evaluateJaiminiSutrasComplete(ephemeris);
  }, [ephemeris]);

  const activeBhava = report.karakamshaBhavas.find((b) => b.bhavaNum === selectedBhavaNum) || report.karakamshaBhavas[0];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <h2 className="text-lg font-bold text-slate-100">
              Maharshi Jaimini Upadesha Sutras (जैमिनि उपदेश सूत्राणि)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete 4 Adhyayas — Rashi Drishti, Karakamsha 12 Bhavas, Ishta Devata, Chara Dasha System, 3-Pair Longevity (Ayurdaya) & Upapada Lagna.
          </p>
        </div>

        {/* Karaka Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Atmakaraka (AK)</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>👑</span>
              <span>{report.atmakarakaPlanet} in {report.karakamshaSign} (D9)</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-purple-500/40 text-center">
            <div className="text-[9px] text-purple-400 uppercase tracking-wider font-bold">Active Chara Dasha</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>⏳</span>
              <span>{report.charaDasha.activeMahadasha.signName} ({report.charaDasha.activeMahadasha.durationYears}y)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Ishta Devata & Synthesis Card */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              12th House from Karakamsha (मोक्ष एवं इष्ट देवता स्थान)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Ishta Devata: {report.ishtaDevata.ishtaDevataName}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterJaiminiSynthesis}
          </p>
        </div>

        {/* Sacred Mantra & Path Quick Box */}
        <div className="flex flex-col gap-2 min-w-[270px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Sacred Bija Mantra:</span>
            <span className="text-xs font-mono font-bold text-amber-200 block mt-0.5">
              {report.ishtaDevata.mantraRecommendation}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Spiritual Pathway:</span>
            <span className="text-xs font-bold text-slate-200 block mt-0.5">
              {report.ishtaDevata.spiritualPath}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("karakamsha")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "karakamsha"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          👑 Karakamsha & Ishta Devata
        </button>
        <button
          onClick={() => setActiveTab("charadasha")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "charadasha"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⏳ Chara Dasha Timeline
        </button>
        <button
          onClick={() => setActiveTab("upapada")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "upapada"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          💍 Upapada Lagna & Marriage
        </button>
        <button
          onClick={() => setActiveTab("longevity")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "longevity"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🛡️ 3-Pairs Longevity & Raja Yogas
        </button>
      </div>

      {/* TAB 1: KARAKAMSHA & ISHTA DEVATA */}
      {activeTab === "karakamsha" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 12 Bhava Selector */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Select House from Karakamsha (D9)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {report.karakamshaBhavas.map((b) => {
                const isSelected = selectedBhavaNum === b.bhavaNum;
                return (
                  <div
                    key={b.bhavaNum}
                    onClick={() => setSelectedBhavaNum(b.bhavaNum)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-amber-600/20 border-amber-400 shadow-lg ring-1 ring-amber-400"
                        : "bg-slate-950/60 border-slate-800 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-100">House {b.bhavaNum}</span>
                      <span className="text-[10px] text-amber-400 font-bold">{b.signName.slice(0, 3)}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-1">
                      {b.planetsPresent.length ? b.planetsPresent.join(", ") : "Empty"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Bhava Inspector */}
          <div className="lg:col-span-2 bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">
                  Karakamsha Bhava Analysis (Sage Jaimini Sutras)
                </span>
                <h4 className="text-base font-black text-slate-100 mt-0.5">
                  House {activeBhava.bhavaNum} from KL: {activeBhava.signName}
                </h4>
                <div className="text-xs text-amber-300 font-medium mt-0.5">
                  {activeBhava.signification}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Karakamsha Base</span>
                <span className="text-xs font-black text-amber-300">{report.atmakarakaPlanet} in {report.karakamshaSign}</span>
              </div>
            </div>

            {/* Occupants & Rashi Drishti Aspects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">Planets Occupying (Navamsha D9):</span>
                <span className="text-xs font-bold text-slate-100 mt-0.5 block">
                  {activeBhava.planetsPresent.length ? activeBhava.planetsPresent.join(", ") : "None (Empty)"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">Aspecting Planets (Rashi Drishti):</span>
                <span className="text-xs font-bold text-amber-300 mt-0.5 block">
                  {activeBhava.aspectingPlanets.length ? activeBhava.aspectingPlanets.join(", ") : "None"}
                </span>
              </div>
            </div>

            {/* Sutra Phala */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1 text-xs">
              <span className="text-amber-300 font-bold block">📜 Classical Jaimini Sutra Phala:</span>
              <p className="text-slate-200 leading-relaxed">{activeBhava.sutraPhala}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHARA DASHA TIMELINE */}
      {activeTab === "charadasha" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h4 className="text-sm font-black text-slate-100">Jaimini Chara Dasha Master Cycle</h4>
              <p className="text-xs text-slate-400">
                Progression Direction: <strong className="text-amber-300">{report.charaDasha.progressionDirection}</strong>
              </p>
            </div>
            <span className="text-[10px] bg-amber-950 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-800 font-bold">
              Sign-Based Timing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {report.charaDasha.periods.map((p, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  p.isActive
                    ? "bg-amber-950/40 border-amber-400 shadow-xl ring-1 ring-amber-400"
                    : "bg-slate-950 border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-100">{p.signName}</span>
                      {p.isActive && (
                        <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-amber-300 font-mono font-bold">
                      {p.durationYears} Years
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-xs">
                    <div className="text-[11px] text-slate-400 font-mono">
                      {p.startDate} ➔ {p.endDate}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      <strong>Sign Lord:</strong> {p.lord}
                    </div>
                    <p className="text-slate-300 text-[11px] leading-tight pt-1">
                      {p.keySignifications}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: UPAPADA LAGNA & MARRIAGE */}
      {activeTab === "upapada" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Upapada Lagna (UL) & Marital Longevity Engine</h4>
            <p className="text-xs text-slate-400">
              Sage Jaimini's definitive sutras on spouse characteristics, marital stability, and remedy prescriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* UL Overview Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                      12th Arudha (A12)
                    </span>
                    <h4 className="text-base font-black text-slate-100 mt-0.5">
                      Upapada: {report.upapada.upapadaSign}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                    2nd from UL: {report.upapada.secondFromUpapadaSign}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Benefic Rays to UL (Rashi Drishti):</span>
                    <span className="text-emerald-300 font-bold">
                      {report.upapada.beneficAspectsToUL.length ? report.upapada.beneficAspectsToUL.join(", ") : "None"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Malefic Rays to UL:</span>
                    <span className="text-rose-300 font-bold">
                      {report.upapada.maleficAspectsToUL.length ? report.upapada.maleficAspectsToUL.join(", ") : "None"}
                    </span>
                  </div>

                  <p className="text-slate-200 text-[11px] leading-relaxed pt-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    {report.upapada.spouseProfile}
                  </p>
                </div>
              </div>

              {/* Harmony Score Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Marital Harmony Index:</span>
                  <span className="text-amber-400">{report.upapada.maritalHarmonyScore}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${report.upapada.maritalHarmonyScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Verdict & Remedies */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/40 space-y-3 shadow-xl flex flex-col justify-between">
              <div className="space-y-2 text-xs">
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">
                  Marital Longevity Verdict (Jaimini Adhyaya 4)
                </span>
                <p className="text-slate-200 text-xs leading-relaxed font-semibold">
                  {report.upapada.maritalLongevityVerdict}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs space-y-1">
                <strong className="text-amber-300 block mb-0.5">🕊️ Classical Jaimini Upapada Remedy:</strong>
                <p className="leading-relaxed">{report.upapada.jaiminiRemedies}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 3-PAIRS LONGEVITY & RAJA YOGAS */}
      {activeTab === "longevity" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Jaimini 3-Pair Longevity (Ayurdaya) & Raja Yogas</h4>
            <p className="text-xs text-slate-400">
              Sage Jaimini's mathematical longevity modality pairings and executive leadership Raja Yogas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 3-Pair Ayurdaya Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-slate-100">3-Pairs Modality Calculator</span>
                <span className="text-xs font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  {report.longevity.compositeLongevity}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Pair 1 (Lagna Lord & 8th Lord):</span>
                  <span className="font-bold text-slate-200">{report.longevity.pair1Verdict}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Pair 2 (Lagna & Moon):</span>
                  <span className="font-bold text-slate-200">{report.longevity.pair2Verdict}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Pair 3 (Lagna & Hora Lagna):</span>
                  <span className="font-bold text-slate-200">{report.longevity.pair3Verdict}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <strong className="text-slate-400 block">Rudra Graha:</strong>
                    <span className="text-rose-400 font-bold">{report.longevity.rudraGraha}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <strong className="text-slate-400 block">Brahma Graha:</strong>
                    <span className="text-emerald-400 font-bold">{report.longevity.brahmaGraha}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Raja Yogas Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-slate-100">Classical Jaimini Raja Yogas</span>
              </div>

              <div className="space-y-2 text-xs">
                {report.jaiminiRajaYogas.map((yoga, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 leading-relaxed">
                    {yoga}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
