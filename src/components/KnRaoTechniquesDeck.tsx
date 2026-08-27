"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateKnRaoTechniques, KnRaoTechniquesReport } from "../engine/knRaoTechniques";

export default function KnRaoTechniquesDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"paradox" | "sphutas" | "vargas">("paradox");

  const report: KnRaoTechniquesReport = useMemo(() => {
    return evaluateKnRaoTechniques(ephemeris);
  }, [ephemeris]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            <h2 className="text-lg font-bold text-slate-100">
              K.N. Rao: Advanced Predictive Techniques Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            From <em>Learn Successful Predictive Techniques of Hindu Astrology</em> — Saturn-Venus Paradox, Beeja/Kshetra Sphutas & Cross-Vargas.
          </p>
        </div>

        {/* Master Vector Badge */}
        <div className="bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 text-center sm:text-right">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">Saturn-Venus Mutual Vector</div>
          <div className="text-sm font-black text-slate-200">{report.saturnVenusParadox.mutualRelationshipD1}</div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("paradox")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "paradox"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🪐 Saturn-Venus Dasha Paradox
        </button>
        <button
          onClick={() => setActiveTab("sphutas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "sphutas"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🧬 Beeja & Kshetra Sphutas (Progeny)
        </button>
        <button
          onClick={() => setActiveTab("vargas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "vargas"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          📊 D7 (Progeny) & D10 (Career) Cross-Varga
        </button>
      </div>

      {/* Tab 1: Saturn-Venus Paradox */}
      {activeTab === "paradox" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Saturn Dignity & D1 Vector */}
            <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-950/15 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Saturn (Karmic Judge)</span>
                  <h3 className="text-base font-black text-slate-100">{report.saturnVenusParadox.saturnDignity}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  D1: {report.saturnVenusParadox.mutualRelationshipD1}
                </span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed">
                <strong>D10 Dashamsha Disposition:</strong> {report.saturnVenusParadox.mutualRelationshipD10}
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                <strong className="text-purple-300">Dasha Operating Effect:</strong>
                <p className="mt-1 text-slate-300 leading-relaxed">{report.saturnVenusParadox.dashaPeriodEffect}</p>
              </div>
            </div>

            {/* Venus Dignity & Reversal Law */}
            <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/15 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Venus (Luxury & Bhoga)</span>
                  <h3 className="text-base font-black text-slate-100">{report.saturnVenusParadox.venusDignity}</h3>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    report.saturnVenusParadox.isParadoxicalReversalActive
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}
                >
                  {report.saturnVenusParadox.isParadoxicalReversalActive ? "⚡ PARADOX ACTIVE" : "STANDARD"}
                </span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed">
                <strong>The Reversal Law:</strong> When Saturn & Venus are both strong, their dasha produces spiritual austerity; when in mutual 6/8 or 3/11, they generate sudden worldly breakthroughs.
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                <strong className="text-amber-300">K.N. Rao Research Verdict:</strong>
                <p className="mt-1 text-slate-300 leading-relaxed">{report.saturnVenusParadox.classicalVerdict}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Beeja & Kshetra Sphutas */}
      {activeTab === "sphutas" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Beeja Sphuta (Male) */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {report.beejaSphuta.sanskritName}
                  </span>
                  <h3 className="text-base font-black text-slate-100">{report.beejaSphuta.sphutaName}</h3>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    report.beejaSphuta.scorePercent >= 80
                      ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                      : "bg-amber-950/60 text-amber-300 border-amber-800"
                  }`}
                >
                  {report.beejaSphuta.fertilityRating}
                </span>
              </div>

              {/* Sphuta Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mt-3">
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Rashi Sign:</span>
                  <span className="font-bold text-slate-200">{report.beejaSphuta.signName} ({report.beejaSphuta.degreeInSign})</span>
                  <span className={`text-[10px] block mt-0.5 font-semibold ${report.beejaSphuta.isSignOdd ? "text-emerald-400" : "text-amber-400"}`}>
                    {report.beejaSphuta.isSignOdd ? "✓ Odd Sign (Auspicious)" : "⚠ Even Sign"}
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Navamsha:</span>
                  <span className="font-bold text-slate-200">{report.beejaSphuta.navamshaSignName}</span>
                  <span className={`text-[10px] block mt-0.5 font-semibold ${report.beejaSphuta.isNavamshaOdd ? "text-emerald-400" : "text-amber-400"}`}>
                    {report.beejaSphuta.isNavamshaOdd ? "✓ Odd Navamsha (Auspicious)" : "⚠ Even Navamsha"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
              {report.beejaSphuta.classicalInterpretation}
            </div>
          </div>

          {/* Kshetra Sphuta (Female) */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                    {report.kshetraSphuta.sanskritName}
                  </span>
                  <h3 className="text-base font-black text-slate-100">{report.kshetraSphuta.sphutaName}</h3>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    report.kshetraSphuta.scorePercent >= 80
                      ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                      : "bg-amber-950/60 text-amber-300 border-amber-800"
                  }`}
                >
                  {report.kshetraSphuta.fertilityRating}
                </span>
              </div>

              {/* Sphuta Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mt-3">
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Rashi Sign:</span>
                  <span className="font-bold text-slate-200">{report.kshetraSphuta.signName} ({report.kshetraSphuta.degreeInSign})</span>
                  <span className={`text-[10px] block mt-0.5 font-semibold ${!report.kshetraSphuta.isSignOdd ? "text-emerald-400" : "text-amber-400"}`}>
                    {!report.kshetraSphuta.isSignOdd ? "✓ Even Sign (Auspicious)" : "⚠ Odd Sign"}
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Navamsha:</span>
                  <span className="font-bold text-slate-200">{report.kshetraSphuta.navamshaSignName}</span>
                  <span className={`text-[10px] block mt-0.5 font-semibold ${!report.kshetraSphuta.isNavamshaOdd ? "text-emerald-400" : "text-amber-400"}`}>
                    {!report.kshetraSphuta.isNavamshaOdd ? "✓ Even Navamsha (Auspicious)" : "⚠ Odd Navamsha"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
              {report.kshetraSphuta.classicalInterpretation}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cross-Vargas */}
      {activeTab === "vargas" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* D7 Saptamsha */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">D7 Saptamsha (Progeny)</span>
                <h3 className="text-base font-black text-slate-100">Lagna: {report.crossVarga.d7SaptamshaLagna}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                5th House: {report.crossVarga.d7FifthHouseSign}
              </span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
              {report.crossVarga.d7Synthesis}
            </div>
          </div>

          {/* D10 Dashamsha */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">D10 Dashamsha (Career & Authority)</span>
                <h3 className="text-base font-black text-slate-100">Lagna: {report.crossVarga.d10DashamshaLagna}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                10th House: {report.crossVarga.d10TenthHouseSign}
              </span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
              {report.crossVarga.d10Synthesis}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
