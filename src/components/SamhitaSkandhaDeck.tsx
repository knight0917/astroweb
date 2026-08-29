"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateSamhitaSkandha } from "../engine/samhitaSkandha";
import { SamhitaSkandhaAnalysis } from "../engine/types";

export default function SamhitaSkandhaDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"cabinet" | "varsha" | "seismic" | "commodities">("cabinet");

  const report: SamhitaSkandhaAnalysis = useMemo(() => {
    return evaluateSamhitaSkandha(ephemeris);
  }, [ephemeris]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌧️</span>
            <h2 className="text-lg font-bold text-slate-100">
              Samhita Skandha (संहिता स्कन्ध) by Acharya Sadananda
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Primordial Astrometeorology, Planetary Cabinet of the Year, Seismic Mandalas & Commodity Argha Krama.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">King of the Year</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>👑</span>
              <span>{report.planetaryCabinet.kingPlanet} (Raja)</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/40 text-center">
            <div className="text-[9px] text-cyan-400 uppercase tracking-wider font-bold">Varsha Monsoon Index</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🌧️</span>
              <span>{report.varshaAstrology.rainfallScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Mundane Overview Card */}
      <div className="bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 p-5 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              Samhita Skandha Master Synthesis (संहिता स्कन्ध महा निर्णय)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Planetary Cabinet: {report.planetaryCabinet.governingYearRuler}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterSamhitaSynthesis}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Prime Minister (Mantri):</span>
            <span className="text-xs font-black text-slate-100 block mt-0.5">
              {report.planetaryCabinet.ministerPlanet}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Monsoon Grade:</span>
            <span className="text-xs font-bold text-emerald-300 block mt-0.5">
              {report.varshaAstrology.precipitationGrade}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("cabinet")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "cabinet"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          👑 Planetary Cabinet (मन्त्रीमण्डल)
        </button>
        <button
          onClick={() => setActiveTab("varsha")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "varsha"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌧️ Megha Garbha & Rainfall
        </button>
        <button
          onClick={() => setActiveTab("seismic")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "seismic"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌋 4 Seismic Mandalas
        </button>
        <button
          onClick={() => setActiveTab("commodities")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "commodities"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          📈 Argha Krama Commodities
        </button>
      </div>

      {/* TAB 1: PLANETARY CABINET */}
      {activeTab === "cabinet" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Annual Planetary Cabinet (संवत्सराधिपति एवं मन्त्रीमण्डल)</h4>
            <p className="text-xs text-slate-400">
              The four celestial rulers determining global leadership, financial health, defense, and agricultural harvest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* King */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2 shadow-xl ring-1 ring-amber-500/30">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[10px] text-amber-400 uppercase font-bold">1. King of the Year (राजा)</span>
                  <h4 className="text-base font-black text-slate-100 mt-0.5">Raja {report.planetaryCabinet.kingPlanet}</h4>
                </div>
                <span className="text-xl">👑</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {report.planetaryCabinet.kingEffect}
              </p>
            </div>

            {/* Minister */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-2 shadow-xl ring-1 ring-cyan-500/30">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[10px] text-cyan-400 uppercase font-bold">2. Prime Minister (मन्त्री)</span>
                  <h4 className="text-base font-black text-slate-100 mt-0.5">Mantri {report.planetaryCabinet.ministerPlanet}</h4>
                </div>
                <span className="text-xl">📜</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {report.planetaryCabinet.ministerEffect}
              </p>
            </div>

            {/* Commander */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-rose-500/40 space-y-2 shadow-xl ring-1 ring-rose-500/30">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[10px] text-rose-400 uppercase font-bold">3. Commander (सेनाधिपति)</span>
                  <h4 className="text-base font-black text-slate-100 mt-0.5">Senadhipati {report.planetaryCabinet.commanderPlanet}</h4>
                </div>
                <span className="text-xl">⚔️</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {report.planetaryCabinet.commanderEffect}
              </p>
            </div>

            {/* Sasyesha */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-2 shadow-xl ring-1 ring-emerald-500/30">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold">4. Lord of Agriculture (सस्येश)</span>
                  <h4 className="text-base font-black text-slate-100 mt-0.5">Sasyesha {report.planetaryCabinet.sasyeshaPlanet}</h4>
                </div>
                <span className="text-xl">🌾</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {report.planetaryCabinet.sasyeshaEffect}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEGHA GARBHA & RAINFALL */}
      {activeTab === "varsha" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Varsha Sanctuary */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                Astrometeorology (मेघ गर्भाधान एवं वर्षा विचार)
              </span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                Rainfall Score: {report.varshaAstrology.rainfallScore}% • {report.varshaAstrology.precipitationGrade}
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">☁️ Megha Garbha (Cloud Gestation Status):</span>
                <p className="text-slate-200">{report.varshaAstrology.meghaGarbhaStatus}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">🌾 Solar Ingress Effects:</span>
                <p className="text-slate-200 mb-1">{report.varshaAstrology.rohiniIngressEffect}</p>
                <p className="text-slate-200">{report.varshaAstrology.ardraIngressEffect}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Precipitation Capacity:</span>
                <span className="text-cyan-400">{report.varshaAstrology.rainfallScore}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${report.varshaAstrology.rainfallScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Classical Shloka Card */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Sadananda Shloka Authority (संहिता प्रमाण)
                </span>
                <h4 className="text-base font-black text-slate-100 mt-0.5">
                  Classical Astrometeorological Doctrine
                </h4>
              </div>

              <div className="mt-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                "When watery planets (Moon, Venus, Jupiter) occupy Jala Rashis and aspect the 4th/10th houses during the Sun's transit in Ardra and Rohini, clouds attain full embryonic gestation (*Megha Garbhadhana*), yielding bountiful rain and quenching the earth."
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[10px] text-amber-300 font-mono">
              📜 {report.varshaAstrology.classicalShloka}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 4 SEISMIC MANDALAS */}
      {activeTab === "seismic" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">4 Seismic Wind Mandalas (भूकमक एवं उत्पात लक्षण)</h4>
            <p className="text-xs text-slate-400">
              Classical atmospheric, thermal, hydrological, and tectonic zones governing earthly balance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.seismicMandalas.map((m, idx) => {
              const isAlert = m.riskLevel === "Elevated Risk" || m.riskLevel === "High Alert";
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                    isAlert
                      ? "bg-slate-950 border-amber-500/40 shadow-xl ring-1 ring-amber-500/30"
                      : "bg-slate-950 border-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Mandala #{idx + 1}
                        </span>
                        <h4 className="text-sm font-black text-slate-100 mt-0.5">{m.sanskritTitle}</h4>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                          isAlert
                            ? "bg-amber-950 text-amber-300 border-amber-800"
                            : "bg-emerald-950 text-emerald-300 border-emerald-800"
                        }`}
                      >
                        {m.riskLevel}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs">
                      <div className="text-slate-300 leading-relaxed">
                        {m.phenomenonDescription}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        <span className="font-bold text-slate-300">Vulnerable Regions: </span>
                        {m.geographicVulnerability}
                      </div>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                    Governing Planets: <span className="font-bold text-slate-200">{m.governingPlanets.join(", ")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: ARGHA KRAMA COMMODITY MARKETS */}
      {activeTab === "commodities" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Argha Krama & Commodity Economic Index (अर्घ्य क्रम एवं धातु/धान्य भाव)</h4>
            <p className="text-xs text-slate-400">
              Macroeconomic price trend projections for precious metals, food grains, energy, and tech assets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.arghaCommodities.map((c, idx) => {
              const isBullish = c.trend.includes("Bullish");
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                    isBullish
                      ? "bg-slate-950 border-emerald-500/40 shadow-xl ring-1 ring-emerald-500/30"
                      : "bg-slate-950 border-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <h4 className="text-sm font-black text-slate-100">{c.commodityName}</h4>
                        <span className="text-[10px] text-slate-400">Ruler: {c.governingPlanet}</span>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                          isBullish
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                            : "bg-slate-900 text-slate-300 border-slate-800"
                        }`}
                      >
                        {c.trend.split(" (")[0]}
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                      {c.classicalArghaReasoning}
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] flex items-center justify-between">
                    <span className="text-slate-400">Projected Index Factor:</span>
                    <span className="font-mono font-bold text-amber-300">+{((c.projectedPriceFactor - 1) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
