"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateSatyaJataka } from "../engine/satyaJataka";
import { SatyaJatakaAnalysis } from "../engine/types";

export default function SatyaJatakaDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"starlords" | "dignities" | "taras">("starlords");

  const report: SatyaJatakaAnalysis = useMemo(() => {
    return evaluateSatyaJataka(ephemeris);
  }, [ephemeris]);

  const favTarasCount = report.janmaTaraMatrix.filter((t) => t.isFavorable).length;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <h2 className="text-lg font-bold text-slate-100">
              Satya Jataka (सत्यजातकम् — Dhruva Nadi Foundation) by Sage Satyacharya
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Revered Foundation of Dhruva Nadi: Nakshatra Starlord Principle, Functional Dignities & 9 Janma Taras.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Favorable Janma Taras</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🌟</span>
              <span>{favTarasCount} of 9 Grahas</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/40 text-center">
            <div className="text-[9px] text-cyan-400 uppercase tracking-wider font-bold">Starlord Rule</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>📜</span>
              <span>Active Dispositors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              Maharshi Satyacharya Master Synthesis (सत्याचार्य महा निर्णय)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Dhruva Nadi Starlord & Tara Mechanics
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterSatyaJatakaSynthesis}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Top Trikonadhipatis:</span>
            <span className="text-xs font-black text-slate-100 block mt-0.5">
              {report.functionalDignities.filter((f) => f.dignityType.includes("Subha")).map((f) => f.planetName).join(", ") || "Balanced"}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Parama Mitra Tara Planet:</span>
            <span className="text-xs font-bold text-emerald-300 block mt-0.5">
              {report.janmaTaraMatrix.find((t) => t.taraName.includes("Parama Mitra"))?.planetName || "None"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("starlords")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "starlords"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⭐ Nakshatra Starlord Deliverers
        </button>
        <button
          onClick={() => setActiveTab("dignities")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "dignities"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⚖️ Satyacharya Dignities
        </button>
        <button
          onClick={() => setActiveTab("taras")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "taras"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌟 9 Janma Tara Matrix
        </button>
      </div>

      {/* TAB 1: STARLORD DELIVERERS */}
      {activeTab === "starlords" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Satyacharya's Starlord Principle (नक्षत्र स्वामी सिद्धान्त)</h4>
            <p className="text-xs text-slate-400">
              "A planet produces the results of the houses owned and occupied by its Nakshatra dispositor."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.planetaryStarLords.map((s, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-sm font-black text-slate-100">{s.planetName}</span>
                    <span className="text-xs font-bold text-amber-300">Star Lord: {s.starLord}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Posited in: <span className="text-slate-200 font-semibold">{s.nakshatraName}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">
                    {s.effectSummary}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 font-bold">
                  Manifested Houses: {s.manifestedBhavas.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FUNCTIONAL DIGNITIES */}
      {activeTab === "dignities" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Satyacharya Functional Dignities (सत्याचार्य शुभाशुभ नियम)</h4>
            <p className="text-xs text-slate-400">
              Maharshi Satyacharya's fundamental rules for Trikonadhipatis and Trishadayadhipatis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.functionalDignities.map((f, idx) => {
              const isSubha = f.dignityType.includes("Subha");
              const isAsubha = f.dignityType.includes("Asubha");
              return (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <h4 className="text-sm font-black text-slate-100">{f.planetName}</h4>
                        <span className="text-[11px] text-slate-400 font-medium">{f.role}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isSubha
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                            : isAsubha
                            ? "bg-rose-950 text-rose-300 border-rose-800"
                            : "bg-slate-900 text-slate-400 border-slate-800"
                        }`}
                      >
                        {f.dignityType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mt-3">
                      {f.satyaRule}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: JANMA TARAS */}
      {activeTab === "taras" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">9 Janma Tara Matrix (नवतारा चक्र)</h4>
            <p className="text-xs text-slate-400">
              The classical 9-Tara relationship evaluated from the natal Moon Nakshatra.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.janmaTaraMatrix.map((t, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all space-y-2 flex flex-col justify-between ${
                  t.isFavorable
                    ? "bg-slate-950 border-emerald-500/40 shadow-lg"
                    : "bg-slate-950/60 border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-sm font-black text-slate-100">{t.planetName}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        t.isFavorable
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : "bg-rose-950 text-rose-300 border-rose-800"
                      }`}
                    >
                      {t.taraName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">
                    {t.description}
                  </p>
                </div>

                <div className="text-[10px] font-mono text-amber-300">
                  Posited in: {t.nakshatraName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
