"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateKotaChakra, evaluateDashaLordTransit } from "../engine/kotaChakra";
import { KotaChakraAnalysis, DashaLordTransitAnalysis } from "../engine/types";

export default function KotaChakraDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"mandala" | "command" | "dashatransit">("mandala");

  const kotaReport: KotaChakraAnalysis = useMemo(() => evaluateKotaChakra(ephemeris), [ephemeris]);
  const dashaTransitReport: DashaLordTransitAnalysis = useMemo(() => evaluateDashaLordTransit(ephemeris), [ephemeris]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏰</span>
            <h2 className="text-lg font-bold text-slate-100">
              Classical Kota Chakra & Dasha-Lord Transit Defense Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            28-Nakshatra Fort Defense Mandala (Stambha, Madhya, Prakara, Bahya), Kota Swami/Pala Command & Dasha Transit Radar.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Fort Integrity</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🏰</span>
              <span>{kotaReport.fortDefenseScore}% Strength</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Kota Swami</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>👑</span>
              <span>{kotaReport.kotaSwamiPlanet}</span>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-xl border text-center ${
            kotaReport.isKotaBhangaActive
              ? "bg-rose-950/50 border-rose-500/40 text-rose-300"
              : "bg-emerald-950/50 border-emerald-500/40 text-emerald-300"
          }`}>
            <div className="text-[9px] uppercase tracking-wider font-bold">Kota Status</div>
            <div className="text-xs font-black flex items-center gap-1 justify-center">
              <span>{kotaReport.isKotaBhangaActive ? "⚠️ Siege Alert" : "🛡️ Fortified"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("mandala")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "mandala"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>🏰</span>
          <span>4-Zone Citadel Mandala</span>
        </button>

        <button
          onClick={() => setActiveTab("command")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "command"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>🛡️</span>
          <span>Command Roles & Siege Audit</span>
        </button>

        <button
          onClick={() => setActiveTab("dashatransit")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "dashatransit"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <span>⏳</span>
          <span>Dasha-Lord Transit Radar</span>
        </button>
      </div>

      {/* TAB 1: 4-ZONE CITADEL MANDALA */}
      {activeTab === "mandala" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">🏰</span>
            <div>
              <span className="font-bold text-emerald-400">Classical Kota Chakra:</span> The 28-Nakshatra cosmic fortress mapping vulnerabilities and defense across 4 concentric walls: <strong>Stambha (Center Pillar)</strong>, <strong>Madhya (Citadel Court)</strong>, <strong>Prakara (Fort Wall)</strong>, and <strong>Bahya (Outer Gates)</strong>.
            </div>
          </div>

          {/* 4 Concentric Zones Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-900/60 border border-emerald-500/30 p-3.5 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">1. Stambha (Center)</span>
              <h4 className="text-xs font-bold text-slate-100 mt-0.5">Vital Core Pillar</h4>
              <p className="text-[11px] text-slate-400 mt-1">4 Nakshatras. Seat of sovereign rank, life force, and core stability.</p>
            </div>
            <div className="bg-slate-900/60 border border-amber-500/30 p-3.5 rounded-xl">
              <span className="text-[10px] font-bold text-amber-400 uppercase">2. Madhya (Citadel)</span>
              <h4 className="text-xs font-bold text-slate-100 mt-0.5">Inner Palace Court</h4>
              <p className="text-[11px] text-slate-400 mt-1">6 Nakshatras. Close advisors, key assets, and executive support.</p>
            </div>
            <div className="bg-slate-900/60 border border-cyan-500/30 p-3.5 rounded-xl">
              <span className="text-[10px] font-bold text-cyan-400 uppercase">3. Prakara (Wall)</span>
              <h4 className="text-xs font-bold text-slate-100 mt-0.5">Fortification Ramparts</h4>
              <p className="text-[11px] text-slate-400 mt-1">8 Nakshatras. Operational defense boundary and professional frontline.</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700 p-3.5 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">4. Bahya (Gates)</span>
              <h4 className="text-xs font-bold text-slate-100 mt-0.5">Outer Gateway</h4>
              <p className="text-[11px] text-slate-400 mt-1">10 Nakshatras. External alliances, public sphere, and external contacts.</p>
            </div>
          </div>

          {/* 28 Nakshatras Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="p-3"># & 28-Nakshatra</th>
                  <th className="p-3">Concentric Zone</th>
                  <th className="p-3">Direction</th>
                  <th className="p-3">Occupying Planets</th>
                  <th className="p-3">Fort Defense Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {kotaReport.segments.map((seg) => (
                  <tr key={seg.nakshatraNumber28} className={`hover:bg-slate-900/40 transition-colors ${seg.isJanmaNakshatra ? "bg-amber-950/20" : ""}`}>
                    <td className="p-3 font-semibold">
                      <span className="text-amber-400 font-mono">#{seg.nakshatraNumber28}</span> {seg.nakshatraName}
                      {seg.isJanmaNakshatra && (
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                          Janma Nakshatra
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-medium text-slate-300">{seg.zone}</td>
                    <td className="p-3 font-mono text-slate-400">{seg.direction}</td>
                    <td className="p-3">
                      {seg.occupyingPlanets.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {seg.occupyingPlanets.map((p) => (
                            <span key={p} className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold text-[10px]">
                              {p}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        seg.segmentVulnerabilityGrade.includes("Impregnable")
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                          : seg.segmentVulnerabilityGrade.includes("Vulnerable")
                          ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                          : "bg-slate-800 text-slate-300"
                      }`}>
                        {seg.segmentVulnerabilityGrade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: COMMAND ROLES & SIEGE AUDIT */}
      {activeTab === "command" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">🛡️</span>
            <div>
              <span className="font-bold text-amber-400">Kota Swami & Kota Pala Roles:</span> <strong>Kota Swami</strong> (Lord of the Fort) anchors sovereign authority, while <strong>Kota Pala</strong> (Guardian of Gates) repels external adversity.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 border border-amber-500/40 p-4 rounded-xl flex flex-col gap-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">👑 Kota Swami (Lord of the Fort)</span>
              <h3 className="text-base font-bold text-slate-100">{kotaReport.kotaSwamiPlanet}</h3>
              <p className="text-xs text-slate-300 mt-1">{kotaReport.kotaSwamiStatus}</p>
            </div>

            <div className="bg-slate-900/60 border border-cyan-500/40 p-4 rounded-xl flex flex-col gap-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">🛡️ Kota Pala (Guardian of the Gates)</span>
              <h3 className="text-base font-bold text-slate-100">{kotaReport.kotaPalaPlanet}</h3>
              <p className="text-xs text-slate-300 mt-1">{kotaReport.kotaPalaStatus}</p>
            </div>
          </div>

          {/* Vulnerability Warnings */}
          {kotaReport.vulnerabilityWarnings.length > 0 && (
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4">
              <h4 className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-1.5">
                <span>⚠️</span>
                <span>Kota Chakra Defense Alerts</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {kotaReport.vulnerabilityWarnings.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-400">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DASHA-LORD TRANSIT RADAR */}
      {activeTab === "dashatransit" && (
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <span className="text-xl">⏳</span>
            <div>
              <span className="font-bold text-cyan-400">Dasha-Lord Transit Radar:</span> Gauges major transits (Jupiter, Saturn, Rahu, Mars) calculated directly from the natal house of the active <strong>Mahadasha ({dashaTransitReport.activeMahadashaLord})</strong> and <strong>Antardasha ({dashaTransitReport.activeAntardashaLord})</strong> lords.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From Mahadasha */}
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                Transits From Mahadasha Lord ({dashaTransitReport.activeMahadashaLord})
              </h3>
              <div className="space-y-2">
                {dashaTransitReport.transitsFromMahaDasha.map((t) => (
                  <div key={t.planetName} className="bg-slate-950/60 p-3 rounded-lg text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span>{t.planetName}</span>
                      <span className="text-amber-400">{t.houseFromDasha}th House</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{t.transitImpact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* From Antardasha */}
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
              <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                Transits From Antardasha Lord ({dashaTransitReport.activeAntardashaLord})
              </h3>
              <div className="space-y-2">
                {dashaTransitReport.transitsFromAntarDasha.map((t) => (
                  <div key={t.planetName} className="bg-slate-950/60 p-3 rounded-lg text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span>{t.planetName}</span>
                      <span className="text-cyan-400">{t.houseFromDasha}th House</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{t.transitImpact}</p>
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
