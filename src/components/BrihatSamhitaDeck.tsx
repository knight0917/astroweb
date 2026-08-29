"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateBrihatSamhita } from "../engine/brihatSamhita";
import { BrihatSamhitaAnalysis, KurmaChakraDirection, GrahaYuddhaEvent, RatnaParikshaGem } from "../engine/types";

export default function BrihatSamhitaDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"kurma" | "yuddha" | "gems" | "dakargala">("kurma");
  const [selectedSector, setSelectedSector] = useState<KurmaChakraDirection | null>(null);
  const [selectedGem, setSelectedGem] = useState<RatnaParikshaGem | null>(null);

  const report: BrihatSamhitaAnalysis = useMemo(() => {
    return evaluateBrihatSamhita(ephemeris);
  }, [ephemeris]);

  // Set default selected items
  const activeSector = selectedSector || report.kurmaChakra.sectors["Central"];
  const activeGem = selectedGem || report.ratnaPariksha.primaryGem;

  // Ordered 3x3 compass layout for Kurma Chakra (North on top)
  const compassGrid: (keyof typeof report.kurmaChakra.sectors)[][] = [
    ["North-West", "North", "North-East"],
    ["West", "Central", "East"],
    ["South-West", "South", "South-East"],
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐢</span>
            <h2 className="text-lg font-bold text-slate-100">
              Acharya Varahamihira: Brihat Samhita Master Suite (बृहत्संहिता)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monumental 106-Chapter Classical Encyclopedia — Kurma Chakra (9 Directions), Graha Yuddha (Planetary Warfare), Ratna Pariksha (9 Gems) & Dakargala Hydrology.
          </p>
        </div>

        {/* Primary Gemstone Badge */}
        <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-4 py-2 rounded-xl border border-amber-500/40 text-center sm:text-right">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">Primary Life Stone (Jeeva Ratna)</div>
          <div className="text-sm font-black text-slate-100 flex items-center gap-1.5 justify-center sm:justify-end">
            <span>{report.ratnaPariksha.primaryGem.icon}</span>
            <span>{report.ratnaPariksha.primaryGem.gemstoneName} ({report.ratnaPariksha.primaryGem.planet})</span>
          </div>
        </div>
      </div>

      {/* Synthesis Hero Card */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              Dominant Element: {report.environmentalMundane.elementalDominance}
            </span>
            <h3 className="text-lg font-black text-slate-100">
              Spatial Fortification: {report.kurmaChakra.sectors[report.kurmaChakra.mostFortifiedDirection].sanskritDirection}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterBrihatSamhitaSynthesis}
          </p>
        </div>

        {/* Quick Diagnostic Metrics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-amber-400 uppercase font-bold">Planetary War (Graha Yuddha):</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${report.hasActiveGrahaYuddha ? "bg-rose-950 text-rose-300 border border-rose-700" : "bg-emerald-950 text-emerald-300 border border-emerald-700"}`}>
              {report.hasActiveGrahaYuddha ? `⚠️ ${report.grahaYuddhas.length} Active Wars` : "Peaceful Rays"}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-cyan-400 uppercase font-bold">Ground Water Index:</span>
            <span className="text-xs font-mono font-bold text-cyan-300">
              {report.environmentalMundane.dakargalaGroundWaterIndex}% (Dakargala)
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("kurma")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "kurma"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🐢 Kurma Chakra (9 Directions)
        </button>
        <button
          onClick={() => setActiveTab("yuddha")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "yuddha"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⚔️ Graha Yuddha (Planetary Warfare)
        </button>
        <button
          onClick={() => setActiveTab("gems")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "gems"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          💎 Ratna Pariksha (9 Gems Science)
        </button>
        <button
          onClick={() => setActiveTab("dakargala")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "dakargala"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌿 Dakargala Hydrology & Vastu
        </button>
      </div>

      {/* TAB 1: KURMA CHAKRA (9-DIRECTIONAL COSMIC COMPASS) */}
      {activeTab === "kurma" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3x3 Compass Diagram */}
          <div className="lg:col-span-2 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                9-Directional Cosmic Tortoise Matrix (कूर्म विभाग - B.S. Ch. 14)
              </span>
              <span className="text-[10px] text-slate-400">Click any sector to inspect</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {compassGrid.map((row, rIdx) =>
                row.map((dirName) => {
                  const sec = report.kurmaChakra.sectors[dirName];
                  const isSelected = activeSector.direction === dirName;
                  const isFortified = sec.status === "Fortified";
                  const isAfflicted = sec.status === "Afflicted" || sec.status === "Severely Vulnerable";

                  return (
                    <div
                      key={dirName}
                      onClick={() => setSelectedSector(sec)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[120px] ${
                        isSelected
                          ? "bg-amber-500/20 border-amber-400 shadow-lg ring-1 ring-amber-400"
                          : isFortified
                          ? "bg-emerald-950/30 border-emerald-800/60 hover:bg-emerald-950/50"
                          : isAfflicted
                          ? "bg-rose-950/30 border-rose-800/60 hover:bg-rose-950/50"
                          : "bg-slate-900/60 border-slate-800 hover:bg-slate-900"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">{sec.direction}</span>
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                              isFortified
                                ? "bg-emerald-500/20 text-emerald-300"
                                : isAfflicted
                                ? "bg-rose-500/20 text-rose-300"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {sec.status}
                          </span>
                        </div>
                        <div className="font-bold text-xs text-slate-100 mt-1">{sec.sanskritDirection}</div>
                        <div className="text-[10px] text-amber-300/80 mt-0.5">Deity: {sec.rulingDeity.split(" ")[0]}</div>
                      </div>

                      <div className="mt-2 pt-1 border-t border-slate-800/60 text-[10px]">
                        <span className="text-slate-400 font-semibold">Planets: </span>
                        <span className="text-slate-200 font-mono">
                          {sec.planetsPresent.length ? sec.planetsPresent.join(", ") : "None"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Detailed Sector Inspector */}
          <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">Selected Quadrant Dossier</span>
                <h4 className="text-base font-black text-slate-100 mt-0.5">{activeSector.sanskritDirection}</h4>
                <div className="text-xs text-emerald-400 font-semibold mt-0.5">Presiding Deity: {activeSector.rulingDeity}</div>
              </div>

              <div className="space-y-3 mt-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block mb-1">Assigned Nakshatras (3 Stars):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSector.nakshatras.map((n) => (
                      <span key={n} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-200 font-mono text-[11px]">
                        ⭐ {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Planets Currently Situated:</span>
                  <span className="text-slate-200 font-semibold">
                    {activeSector.planetsPresent.length ? activeSector.planetsPresent.join(", ") : "None (Peaceful tranquility)"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Bio-Field & Anatomic Affinity:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{activeSector.bioFieldAffinity}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Classical Geographical Domains:</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed italic">{activeSector.classicalRegions}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300">
              <span className="text-amber-400 font-bold block mb-0.5">🐢 Varahamihira Spatial Verdict:</span>
              <span>{activeSector.status === "Fortified" ? "Auspicious directional ray promoting expansion and victory in endeavors aligned with this sector." : activeSector.status === "Severely Vulnerable" ? "Requires directional remedies (Vastu yantras or peaceful lighting) to neutralize planetary friction." : "Balanced cosmic equilibrium."}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GRAHA YUDDHA (PLANETARY WARFARE) */}
      {activeTab === "yuddha" && (
        <div className="space-y-6">
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-black text-slate-100">4 Classical Warfare States (B.S. Ch. 17: ग्रहयुद्ध लक्षण)</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculated strictly between Mars, Mercury, Jupiter, Venus, and Saturn when separation is ≤ 1.0° (60 arcminutes).
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[10.5px]">
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                1. <strong>Bhedana:</strong> &lt; 0.15° (Cleaving)
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                2. <strong>Ullekha:</strong> 0.15°–0.35° (Grazing)
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                3. <strong>Anshumardana:</strong> 0.35°–0.70° (Ray Collision)
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                4. <strong>Apasavya:</strong> Retrograde strike
              </span>
            </div>
          </div>

          {report.grahaYuddhas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.grahaYuddhas.map((y, idx) => (
                <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-rose-500/40 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black text-rose-400 flex items-center gap-1.5">
                      <span>⚔️</span>
                      <span>{y.planet1} vs {y.planet2}</span>
                    </span>
                    <span className="text-[10px] font-mono bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded border border-rose-800">
                      Separation: {y.separationDegrees}°
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-amber-300 block">{y.warfareTypeSanskrit}</span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{y.description}</p>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>🏆 Victor Planet (Jayi Graha):</span>
                      <span>{y.victorPlanet}</span>
                    </div>
                    <div className="flex items-center justify-between text-rose-400 font-bold">
                      <span>🔻 Defeated Planet (Parajita):</span>
                      <span>{y.defeatedPlanet}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{y.victorReason}</div>
                  </div>

                  <div className="text-[11px] text-slate-400 pt-1">
                    <strong className="text-slate-300">Natal Effect:</strong> {y.natalImpact}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-950/60 border border-emerald-500/30 text-center space-y-2">
              <span className="text-3xl">🕊️</span>
              <h4 className="text-base font-bold text-emerald-300">No Active Graha Yuddha (Planetary Warfare)</h4>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                All 5 Taragrahas (Mars, Mercury, Jupiter, Venus, Saturn) maintain healthy longitudinal angular separation (&gt; 1.0°). No planetary combat friction is present.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RATNA PARIKSHA (9 GEMS SCIENCE & PRESCRIPTION) */}
      {activeTab === "gems" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gemstone Matrix / Cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="text-amber-400 font-bold block mb-1">💎 Acharya Varahamihira's Master Prescription:</span>
              <span>{report.ratnaPariksha.masterGemGuidance}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {report.ratnaPariksha.allGems.map((g) => {
                const isSelected = activeGem.gemstoneName === g.gemstoneName;
                const isPrimary = report.ratnaPariksha.primaryGem.gemstoneName === g.gemstoneName;
                const isProhibited = g.suitability === "Strictly Prohibited";

                return (
                  <div
                    key={g.gemstoneName}
                    onClick={() => setSelectedGem(g)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-amber-500/20 border-amber-400 shadow-xl ring-1 ring-amber-400"
                        : isPrimary
                        ? "bg-amber-950/30 border-amber-500/50"
                        : isProhibited
                        ? "bg-rose-950/20 border-rose-800/40 opacity-75"
                        : "bg-slate-950/60 border-slate-800 hover:bg-slate-900"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{g.icon}</span>
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                            g.suitability === "Highly Recommended"
                              ? "bg-emerald-500 text-slate-950"
                              : g.suitability === "Benefic Secondary"
                              ? "bg-cyan-500/20 text-cyan-300"
                              : isProhibited
                              ? "bg-rose-950 text-rose-300 border border-rose-700"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {g.suitability}
                        </span>
                      </div>
                      <div className="font-black text-sm text-slate-100 mt-2">{g.gemstoneName}</div>
                      <div className="text-[11px] text-amber-400 font-semibold">{g.sanskritName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Ruler: {g.planet}</div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Metal: <strong className="text-slate-200">{g.metal.split(" ")[0]}</strong></span>
                      <span>Weight: <strong className="text-slate-200">{g.weightRecommendationRatti.split(" ")[0]} R</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Gemstone Dossier */}
          <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center gap-3">
              <span className="text-3xl">{activeGem.icon}</span>
              <div>
                <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">Gemology Shastra Dossier</span>
                <h4 className="text-base font-black text-slate-100">{activeGem.gemstoneName} ({activeGem.sanskritName})</h4>
                <span className="text-xs text-slate-400 font-mono">{activeGem.mineralFamily} • {activeGem.primaryColor}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Suitable Metal:</span>
                  <span className="font-bold text-slate-100">{activeGem.metal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Wearing Finger:</span>
                  <span className="font-bold text-slate-100">{activeGem.wearingFinger}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Auspicious Day:</span>
                  <span className="font-bold text-amber-300">{activeGem.auspiciousDay}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Recommended Weight:</span>
                  <span className="font-bold text-cyan-300">{activeGem.weightRecommendationRatti}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">Vedic Consecration Mantra:</span>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-500/30 text-amber-300 font-mono text-[11px] leading-relaxed">
                  {activeGem.classicalVedicMantra}
                </div>
              </div>

              <div>
                <span className="text-emerald-400 font-bold block mb-1">4 Required Virtues (चार गुण - Gunas):</span>
                <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                  {activeGem.virtuesRequired.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-rose-400 font-bold block mb-1">4 Fatal Flaws to AVOID (चार दोष - Doshas):</span>
                <ul className="list-disc list-inside text-[11px] text-rose-300 space-y-0.5">
                  {activeGem.flawsToAvoid.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                <strong className="text-amber-400">Astrological Verdict:</strong> {activeGem.justification}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DAKARGALA & VASTU HYDROLOGY */}
      {activeTab === "dakargala" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Dakargala Shastra (दकार्गल - B.S. Ch. 54)</span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">Subterranean Hydrology & Ground Water Discovery</h4>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300">Subterranean Water Capacity:</span>
                <span className="text-sm font-black font-mono text-cyan-200">{report.environmentalMundane.dakargalaGroundWaterIndex}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2">
                <div
                  className="bg-cyan-400 h-2 rounded-full transition-all"
                  style={{ width: `${report.environmentalMundane.dakargalaGroundWaterIndex}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {report.environmentalMundane.dakargalaWaterVerdict}
              </p>
            </div>

            <div className="text-xs text-slate-400 space-y-1.5">
              <strong className="text-slate-300 block">Varahamihira Hydrology Sutras:</strong>
              <p className="italic">"Where the ground displays moist vegetation, anthills adjacent to Jambu (rose apple) trees, or North-flowing subterranean streams, sweet water lies at shallow Purusha depths." (B.S. Ch. 54)</p>
            </div>
          </div>

          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Maha-Nimitta & Shakuna Shastra (निमित्त)</span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">Environmental Portents & Vayu Mandala Signatures</h4>
            </div>

            <div className="space-y-2.5 text-xs">
              {report.environmentalMundane.nimittaSignatures.map((sig, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 flex items-start gap-2">
                  <span className="text-amber-400">✨</span>
                  <span>{sig}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
              <strong className="text-amber-300 block mb-0.5">Directional Vastu Guidance:</strong>
              Align main entryways, study desks, and meditation sanctuaries towards <strong>{report.kurmaChakra.sectors[report.kurmaChakra.mostFortifiedDirection].sanskritDirection}</strong> to harness maximum planetary buoyancy and spiritual clarity.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
