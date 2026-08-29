"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluatePrasnaTantra, evaluateMargabandhuStotram } from "../engine/prasnaTantra";
import { PrasnaTantraAnalysis, MargabandhuAnalysis } from "../engine/types";

export default function PrasnaTantraDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"yogas" | "sahams" | "margabandhu">("yogas");

  const prasnaReport: PrasnaTantraAnalysis = useMemo(() => evaluatePrasnaTantra(ephemeris), [ephemeris]);
  const margabandhuReport: MargabandhuAnalysis = useMemo(() => evaluateMargabandhuStotram(ephemeris), [ephemeris]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <h2 className="text-lg font-bold text-slate-100">
              Sri Neelakanta Prasna Tantra & Tajik Sahams Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            16 Classical Tajik Yogas (Ithasala, Ishrafa, Nakta, Yamaya), 12 Sensitive Sahams & Sri Margabandhu Stotram Shield.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-violet-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-violet-500/40 text-center">
            <div className="text-[9px] text-violet-400 uppercase tracking-wider font-bold">Query Success Score</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🎯</span>
              <span>{prasnaReport.querySuccessScore}% Potency</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Punya Saham</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🌟</span>
              <span>{prasnaReport.sahams[0]?.signName} {prasnaReport.sahams[0]?.degreesInSign}°</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Active Tajik Yogas</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>⚡</span>
              <span>{prasnaReport.activeYogas.length} Yogas Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("yogas")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "yogas"
              ? "bg-violet-500 text-slate-950 shadow-lg shadow-violet-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>🔮</span>
          <span>16 Tajik Yogas Horary Radar</span>
        </button>

        <button
          onClick={() => setActiveTab("sahams")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "sahams"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>📐</span>
          <span>12 Tajik Sahams Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab("margabandhu")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "margabandhu"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>🛡️</span>
          <span>Sri Margabandhu Journey Shield</span>
        </button>
      </div>

      {/* TAB 1: 16 TAJIK YOGAS HORARY RADAR */}
      {activeTab === "yogas" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">🔮</span>
            <div>
              <span className="font-bold text-violet-400">Sri Neelakanta Horary Mechanics:</span> Evaluates exact applying and separating aspects, planetary speeds, and Deeptamsha orbs to determine if a question or venture culminates in victory.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prasnaReport.tajikYogas.map((yoga) => (
              <div
                key={yoga.yogaNumber}
                className={`p-5 rounded-2xl border transition-all flex flex-col gap-3 ${
                  yoga.isActive
                    ? "bg-violet-950/20 border-violet-500/50 shadow-lg shadow-violet-950/20"
                    : "bg-slate-900/50 border-slate-800/80 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-violet-400">Tajik Yoga #{yoga.yogaNumber}</span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                    yoga.isActive
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-400"
                  }`}>
                    {yoga.isActive ? "⚡ ACTIVE" : "Inactive"}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-100">{yoga.yogaName}</h3>
                  <div className="text-xs text-violet-300/80 font-serif italic mt-0.5">{yoga.sanskritTitle}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Aspect:</span>
                    <span className="text-slate-200 font-medium">{yoga.aspectType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Verdict:</span>
                    <span className="text-amber-300 font-bold">{yoga.horaryFruitionVerdict}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {yoga.classicalFormula}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: 12 TAJIK SAHAMS CALCULATOR */}
      {activeTab === "sahams" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">📐</span>
            <div>
              <span className="font-bold text-amber-400">12 Classical Tajik Sahams:</span> Mathematical sensitive points derived from planetary longitudinal distances and Ascendant, identifying focal points of destiny.
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="p-3"># & Saham Name</th>
                  <th className="p-3">Sign & Longitude</th>
                  <th className="p-3">House</th>
                  <th className="p-3">Significance & Life Focal Point</th>
                  <th className="p-3">Calculation Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {prasnaReport.sahams.map((s) => (
                  <tr key={s.sahamNumber} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-semibold">
                      <span className="text-amber-400 font-mono">#{s.sahamNumber}</span> {s.sahamName}
                      <div className="text-[10px] text-amber-300/70 font-serif">{s.sanskritTitle}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      {s.signName} {s.degreesInSign}°
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold text-[10px]">
                        H{s.houseNumber}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 max-w-xs">{s.significance}</td>
                    <td className="p-3 font-mono text-[10px] text-slate-400">{s.calculationRule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SRI MARGABANDHU JOURNEY SHIELD */}
      {activeTab === "margabandhu" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">🛡️</span>
            <div>
              <span className="font-bold text-emerald-400">Sri Margabandhu Stotram:</span> Divine travel and transition armor composed by Sri Appayya Dikshitar for invoking Lord Shiva to clear all roadblocks and travel hazards.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {margabandhuReport.verses.map((v) => (
              <div
                key={v.verseNumber}
                className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-amber-300 font-mono">Verse #{v.verseNumber}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">{v.deityInvoked}</span>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 font-serif italic leading-relaxed">
                  "{v.sanskritShloka}"
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  📖 {v.englishMeaning}
                </p>

                <p className="text-[11px] text-emerald-300/90 mt-auto bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/30">
                  🛡️ <strong>Protection Focus:</strong> {v.travelProtectionDomain}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
