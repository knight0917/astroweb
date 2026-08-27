"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateBphsCore, BphsCoreReport } from "../engine/bphsCore";

export default function BphsCoreDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"lagnas" | "sudarshana" | "avasthas" | "shodhana" | "avataras">("lagnas");

  const report: BphsCoreReport = useMemo(() => {
    return evaluateBphsCore(ephemeris);
  }, [ephemeris]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <h2 className="text-lg font-bold text-slate-100">
              Brihat Parashara Hora Shastra (BPHS): Primordial Classical Core
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Reference: <em>BPHS (Vols. 1 & 2)</em> translated by R. Santhanam — Special Lagnas, Sudarshana Chakra, Sayanadi Avasthas, Shodhana Pindas & Vishnu Avataras.
          </p>
        </div>

        {/* Leading Avatara Badge */}
        <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-4 py-2 rounded-xl border border-amber-500/40 text-center sm:text-right">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">Vishnu Avatara Archetype</div>
          <div className="text-sm font-black text-slate-100 flex items-center gap-1.5 justify-center sm:justify-end">
            <span>🔱</span>
            <span>{report.leadingAvatara.avataraName} ({report.leadingAvatara.planetName})</span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("lagnas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "lagnas"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌟 5 Special Lagnas (HL, GL, SL)
        </button>
        <button
          onClick={() => setActiveTab("sudarshana")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "sudarshana"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🎡 Sudarshana Chakra (3 Horizons)
        </button>
        <button
          onClick={() => setActiveTab("avasthas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "avasthas"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🧘 12 Sayanadi Planetary Avasthas
        </button>
        <button
          onClick={() => setActiveTab("shodhana")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "shodhana"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          📊 Ashtakavarga Shodhana & Pindas
        </button>
        <button
          onClick={() => setActiveTab("avataras")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "avataras"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🔱 9 Vishnu Avatara Archetypes
        </button>
      </div>

      {/* Tab 1: Special Lagnas */}
      {activeTab === "lagnas" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(report.specialLagnas).map((lagna) => (
              <div key={lagna.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        {lagna.sanskritName}
                      </span>
                      <h4 className="text-sm font-black text-slate-100">{lagna.name}</h4>
                    </div>
                    <span className="text-xs font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
                      H#{lagna.houseFromLagna}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 mt-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sign:</span>
                      <span className="font-bold text-slate-200">{lagna.signName} ({lagna.degreesInSign}°)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Absolute Lon:</span>
                      <span className="font-mono text-amber-300">{lagna.longitude}°</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                  {lagna.significance}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Sudarshana Chakra */}
      {activeTab === "sudarshana" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-bold">Top Triple-Concurrence Axis</span>
              <h3 className="text-base font-black text-slate-100">
                House #{report.sudarshanaChakra.highestFortifiedHouse} — {report.sudarshanaChakra.highestFortifiedHouseTheme}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
              Concentric Triple Horizon Focus
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">House</th>
                  <th className="p-3">Governed Life Theme</th>
                  <th className="p-3">Lagna Horizon (Body)</th>
                  <th className="p-3">Moon Horizon (Mind)</th>
                  <th className="p-3">Sun Horizon (Soul)</th>
                  <th className="p-3">Fortification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                {report.sudarshanaChakra.bhavas.map((b) => (
                  <tr key={b.houseNum} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-amber-400 font-mono">H#{b.houseNum}</td>
                    <td className="p-3 font-semibold text-slate-100">{b.theme}</td>
                    <td className="p-3 text-purple-300 font-semibold">{b.lagnaPerspectiveSign}</td>
                    <td className="p-3 text-cyan-300 font-semibold">{b.moonPerspectiveSign}</td>
                    <td className="p-3 text-amber-300 font-semibold">{b.sunPerspectiveSign}</td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">{b.overallFortificationPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Sayanadi Avasthas */}
      {activeTab === "avasthas" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {report.sayanadiAvasthas.map((a) => (
            <div key={a.planetId} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">{a.icon}</span>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {a.planetName}
                      </span>
                      <h4 className="text-sm font-black text-slate-100">
                        {a.avasthaName} ({a.sanskritName})
                      </h4>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      a.effectType.includes("Highly Auspicious")
                        ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                        : a.effectType.includes("Auspicious")
                        ? "bg-cyan-950 text-cyan-300 border-cyan-700"
                        : a.effectType.includes("Inauspicious")
                        ? "bg-rose-950 text-rose-300 border-rose-700"
                        : "bg-slate-900 text-slate-400 border-slate-800"
                    }`}
                  >
                    {a.effectType}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  {a.classicalInterpretation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Ashtakavarga Shodhana & Pindas */}
      {activeTab === "shodhana" && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-bold">Total Sarvashtakavarga Yoga Pinda</span>
              <h3 className="text-xl font-black text-emerald-400">{report.sarvaYogaPinda} Units</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-md text-right">
              Calculated after Trikona Shodhana (Trinal Reduction) and Ekadhipatya Shodhana (Dual-Lord Balance).
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Planet</th>
                  <th className="p-3">Original Sum</th>
                  <th className="p-3">Trikona Reduced Sum</th>
                  <th className="p-3">Ekadhipatya Reduced Sum</th>
                  <th className="p-3">Rashi Pinda</th>
                  <th className="p-3">Graha Pinda</th>
                  <th className="p-3">Yoga Pinda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                {report.ashtakavargaPindas.map((p) => (
                  <tr key={p.planetName} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-slate-100">{p.planetName}</td>
                    <td className="p-3 font-mono text-slate-300">
                      {p.originalBindus.reduce((a, b) => a + b, 0)}
                    </td>
                    <td className="p-3 font-mono text-purple-300">
                      {p.trikonaReducedBindus.reduce((a, b) => a + b, 0)}
                    </td>
                    <td className="p-3 font-mono text-cyan-300 font-semibold">
                      {p.ekadhipatyaReducedBindus.reduce((a, b) => a + b, 0)}
                    </td>
                    <td className="p-3 font-mono text-amber-300 font-bold">{p.rashiPinda}</td>
                    <td className="p-3 font-mono text-amber-300 font-bold">{p.grahaPinda}</td>
                    <td className="p-3 font-mono text-emerald-400 font-black text-sm">{p.yogaPinda}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Vishnu Avataras */}
      {activeTab === "avataras" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {report.vishnuAvataras.map((v) => (
            <div
              key={v.planetName}
              className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                v.isNativeLeadingArchetype
                  ? "bg-amber-950/25 border-amber-500/60 shadow-xl"
                  : "bg-slate-900/80 border-slate-800"
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      {v.sanskritName}
                    </span>
                    <h4 className="text-sm font-black text-slate-100">{v.avataraName}</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-200 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {v.planetName}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 mt-2.5">
                  <p><strong className="text-amber-300">Archetype:</strong> {v.divineArchetype}</p>
                  <p><strong className="text-emerald-300">Virtue:</strong> {v.embodiedVirtue}</p>
                </div>
              </div>

              {v.isNativeLeadingArchetype && (
                <div className="bg-amber-500/15 p-2 rounded-xl border border-amber-500/40 text-[10px] font-bold text-amber-300 text-center uppercase tracking-wider">
                  ★ Primary Natal Deity Archetype
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
