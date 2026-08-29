"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateCuspalInterlinks } from "../engine/cuspalInterlinks";
import { CuspalInterlinksAnalysis } from "../engine/types";

export default function CuspalInterlinksDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"cusps" | "domains" | "btr" | "horary">("cusps");
  const [selectedCuspNum, setSelectedCuspNum] = useState<number>(1);
  const [horarySeed, setHorarySeed] = useState<number>(108);

  const report: CuspalInterlinksAnalysis = useMemo(() => {
    return evaluateCuspalInterlinks(ephemeris);
  }, [ephemeris]);

  const activeCusp = report.cuspalData.find((c) => c.cuspNum === selectedCuspNum) || report.cuspalData[0];
  const psPlanets = report.cuspalData.filter((c) => c.positionalStatus).map((c) => c.subSubLord);
  const uniquePsPlanets = Array.from(new Set(psPlanets));

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📐</span>
            <h2 className="text-lg font-bold text-slate-100">
              Kalamsa & Cuspal Interlinks Theory (KCIL — S.P. Khullar)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            2193 Sub-Sub Lords (SSL / Kalamsa), Positional Status (PS), 12 Cuspal Interlinks, BTR & Horary Oracle.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Lagna SSL (Kalamsa)</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>💎</span>
              <span>{report.btrDiagnostic.lagnaSsl}</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/40 text-center">
            <div className="text-[9px] text-cyan-400 uppercase tracking-wider font-bold">10th Cusp SSL (Career)</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>👔</span>
              <span>{report.cuspalData[9].subSubLord}</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-pink-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-pink-500/40 text-center">
            <div className="text-[9px] text-pink-400 uppercase tracking-wider font-bold">7th Cusp SSL (Marriage)</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>💍</span>
              <span>{report.cuspalData[6].subSubLord}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950/20 to-slate-950 p-5 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              S.P. Khullar Cuspal Sub-Sub Canon (कलामश एवं भाव सन्धि)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              5-Tier Precision Cuspal Interlinks Synthesis
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterKcilSynthesis}
          </p>
        </div>

        {/* Quick Box */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">BTR Alignment Status:</span>
            <span className="text-xs font-black text-emerald-300 block mt-0.5">
              {report.btrDiagnostic.isBtrAligned ? "✅ High Precision Aligned" : "⚠️ Fine-Tuning Advised"}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-cyan-400 uppercase font-bold block">Positional Status Grahas:</span>
            <span className="text-xs font-mono font-bold text-cyan-200 block mt-0.5">
              {uniquePsPlanets.length > 0 ? uniquePsPlanets.join(", ") : "Standard Star Signification"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("cusps")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "cusps"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          📐 12 Cusps Hierarchy (RL / NL / SL / SSL)
        </button>
        <button
          onClick={() => setActiveTab("domains")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "domains"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🎯 Life Domain Promises ({report.domainPromises.length})
        </button>
        <button
          onClick={() => setActiveTab("btr")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "btr"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⏱️ Birth Time Rectification (BTR)
        </button>
        <button
          onClick={() => setActiveTab("horary")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "horary"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🔮 Cuspal Horary Oracle (1–249 / 1–2193)
        </button>
      </div>

      {/* TAB 1: 12 CUSPS HIERARCHY */}
      {activeTab === "cusps" && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider bg-slate-950/80">
                  <th className="py-2.5 px-3">Cusp</th>
                  <th className="py-2.5 px-3">Degree</th>
                  <th className="py-2.5 px-3">Sign (RL)</th>
                  <th className="py-2.5 px-3">Star Lord (NL)</th>
                  <th className="py-2.5 px-3">Sub Lord (SL)</th>
                  <th className="py-2.5 px-3 text-emerald-400 font-bold">Sub-Sub Lord (SSL)</th>
                  <th className="py-2.5 px-3">PS</th>
                  <th className="py-2.5 px-3">Interlinks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {report.cuspalData.map((c) => (
                  <tr
                    key={c.cuspNum}
                    onClick={() => setSelectedCuspNum(c.cuspNum)}
                    className={`transition-colors cursor-pointer ${
                      c.cuspNum === selectedCuspNum
                        ? "bg-emerald-950/30 text-white"
                        : "hover:bg-slate-900/40 text-slate-300"
                    }`}
                  >
                    <td className="py-2 px-3 font-bold text-slate-100">Cusp {c.cuspNum}</td>
                    <td className="py-2 px-3 font-mono text-slate-400">{c.degree.toFixed(2)}°</td>
                    <td className="py-2 px-3">{c.signName} ({c.signLord})</td>
                    <td className="py-2 px-3">{c.starLord}</td>
                    <td className="py-2 px-3">{c.subLord}</td>
                    <td className="py-2 px-3 font-black text-emerald-300">{c.subSubLord}</td>
                    <td className="py-2 px-3 font-mono">
                      {c.positionalStatus ? (
                        <span className="text-[10px] px-1 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          YES (PS)
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-mono text-emerald-400">[{c.linkedHouses.join(", ")}]</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Active Cusp Detail Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] text-emerald-400 uppercase font-bold">
              Cusp {activeCusp.cuspNum} Detailed Significance:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {activeCusp.primaryInterlinkSignification}
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: LIFE DOMAIN PROMISES */}
      {activeTab === "domains" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.domainPromises.map((dp, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-sm font-black text-slate-100">{dp.domain}</h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    dp.promiseVerdict.startsWith("Guaranteed")
                      ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                      : dp.promiseVerdict.startsWith("Moderate")
                      ? "bg-amber-950 text-amber-300 border-amber-800"
                      : "bg-rose-950 text-rose-300 border-rose-800"
                  }`}
                >
                  {dp.promiseVerdict.split(" (")[0]}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Primary Cusp:</span>
                  <span className="font-bold text-slate-100">Cusp {dp.primaryCusp}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-emerald-400">Supporting Houses:</span>
                  <span className="font-mono text-emerald-300">[{dp.supportingCusps.join(", ")}]</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-rose-400">Detrimental Houses:</span>
                  <span className="font-mono text-rose-300">[{dp.detrimentalCusps.join(", ")}]</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-serif">
                {dp.kcilAnalysis}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: BIRTH TIME RECTIFICATION (BTR) */}
      {activeTab === "btr" && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] text-emerald-400 uppercase font-bold">
              Khullar's True Horoscope Rectification (जन्म समय शुद्धि)
            </span>
            <h4 className="text-base font-black text-slate-100 mt-0.5">
              Cuspal Sub-Sub & Ruling Planets Alignment
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Lagna SSL (Kalamsa):</span>
              <span className="text-xs font-black text-emerald-300 block mt-1">{report.btrDiagnostic.lagnaSsl}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Moon Star Lord (NL):</span>
              <span className="text-xs font-black text-cyan-300 block mt-1">{report.btrDiagnostic.moonNl}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Lagna Star Lord:</span>
              <span className="text-xs font-black text-purple-300 block mt-1">{report.rulingPlanets.lagnaStarLord}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Gender Parity:</span>
              <span className="text-xs font-black text-pink-300 block mt-1">{report.btrDiagnostic.genderParity}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">S.P. Khullar BTR Recommendation:</span>
            <p className="text-xs text-slate-200 leading-relaxed font-serif">
              {report.btrDiagnostic.btrRecommendation}
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: CUSPAL HORARY ORACLE */}
      {activeTab === "horary" && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] text-cyan-400 uppercase font-bold">
              KCIL Cuspal Horary Oracle (1–249 KP / 1–2193 KCIL)
            </span>
            <h4 className="text-base font-black text-slate-100 mt-0.5">
              Instantaneous Query Resolution & Cuspal Arcs
            </h4>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-300 font-bold">Enter Horary Seed (1 to 249):</label>
            <input
              type="number"
              min={1}
              max={249}
              value={horarySeed}
              onChange={(e) => setHorarySeed(Math.max(1, Math.min(249, Number(e.target.value) || 1)))}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs w-24 text-center focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 leading-relaxed font-serif">
            Horary Seed <strong>#{horarySeed}</strong> maps to Cusp Sub-Lord arc. In KCIL Horary, examine the Sub-Sub Lord of the query's primary house (e.g. 7th for Marriage, 10th for Career, 6th for Litigation). If the primary cusp SSL links to favorable houses without involving 8th/12th, the question is fulfilled rapidly with divine timing.
          </div>
        </div>
      )}
    </div>
  );
}
