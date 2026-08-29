"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateDevaKeralam, NADI_AMSHA_METAS } from "../engine/devaKeralam";
import { DevaKeralamAnalysis, DevaKeralamPlanetNadi, NadiAmshaInfo } from "../engine/types";

export default function DevaKeralamDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"lagna" | "planets" | "matrix" | "transits">("lagna");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlanetNadi, setSelectedPlanetNadi] = useState<DevaKeralamPlanetNadi | null>(null);

  const report: DevaKeralamAnalysis = useMemo(() => {
    return evaluateDevaKeralam(ephemeris, ephemeris);
  }, [ephemeris]);

  // Filter 150 Nadi Amshas
  const filteredNadis = useMemo(() => {
    if (!searchQuery.trim()) return NADI_AMSHA_METAS;
    const q = searchQuery.toLowerCase();
    return NADI_AMSHA_METAS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.sanskritName.includes(q) ||
        m.rulingDeity.toLowerCase().includes(q) ||
        m.archetype.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activePlanet = selectedPlanetNadi || report.planetsNadi["Jupiter"] || Object.values(report.planetsNadi)[0];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <h2 className="text-lg font-bold text-slate-100">
              Deva Keralam (देव केरलम्) / Chandra Kala Nadi (चन्द्रकला नाडी)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Classical Nadi Scripture by Sage Achyuta (Vols 1 & 2) — 150 Nadi Amshas (12' arc), Purva/Uttara Bhaga (6' arc), and Planetary Nadi Transits.
          </p>
        </div>

        {/* Primary Lagna Nadi Badge */}
        <div className="bg-gradient-to-r from-purple-950/50 to-slate-900 px-4 py-2 rounded-xl border border-purple-500/40 text-center sm:text-right">
          <div className="text-[10px] text-purple-400 uppercase tracking-wider font-bold">Ascendant Nadi Amsha</div>
          <div className="text-sm font-black text-slate-100 flex items-center gap-1.5 justify-center sm:justify-end">
            <span>✨</span>
            <span>{report.lagnaNadi.name} ({report.lagnaNadi.sanskritName} — #{report.lagnaNadi.index})</span>
          </div>
        </div>
      </div>

      {/* Hero Destiny Card */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950/20 to-slate-950 p-5 rounded-2xl border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                {report.lagnaNadi.halfBhagaSanskrit} • {report.lagnaNadi.nature}
              </span>
              <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800 font-mono">
                {report.lagnaNadi.degreeStart}° – {report.lagnaNadi.degreeEnd}° in Sign
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-100 mt-1">
              Soul Archetype: {report.lagnaNadi.archetype}
            </h3>
            <div className="text-xs text-purple-300 font-semibold mt-0.5">
              Presiding Deity: {report.lagnaNadi.rulingDeity}
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl font-serif italic">
            "{report.lagnaNadi.classicalSutra}"
          </p>
        </div>

        {/* Quick Diagnostic Metrics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-purple-400 uppercase font-bold block">Moon (Chandra) Nadi:</span>
            <span className="text-xs font-bold text-slate-100 block mt-0.5">
              {report.moonNadi.name} ({report.moonNadi.sanskritName} — #{report.moonNadi.index})
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Sun (Surya) Nadi:</span>
            <span className="text-xs font-bold text-slate-100 block mt-0.5">
              {report.sunNadi.name} ({report.sunNadi.sanskritName} — #{report.sunNadi.index})
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("lagna")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "lagna"
              ? "bg-purple-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌟 Lagna & Core Nadi Destiny
        </button>
        <button
          onClick={() => setActiveTab("planets")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "planets"
              ? "bg-purple-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🪐 9 Planetary Nadi Placements
        </button>
        <button
          onClick={() => setActiveTab("matrix")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "matrix"
              ? "bg-purple-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          📜 150 Nadi Amshas Explorer
        </button>
        <button
          onClick={() => setActiveTab("transits")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "transits"
              ? "bg-purple-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⚡ Nadi Gochar Transit Triggers
        </button>
      </div>

      {/* TAB 1: LAGNA & CORE NADI DESTINY */}
      {activeTab === "lagna" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wealth & Raja Yogas */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Deva Keralam Destiny Sutras</span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">Dhana, Raja & Kula Yogas</h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1">
                <span className="text-purple-300 font-bold block">💰 Classical Dhana Yogas:</span>
                <ul className="list-disc list-inside text-slate-200 space-y-1">
                  {report.dhanaYogas.map((y, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: y.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}></li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold block">👑 Classical Raja Yogas:</span>
                <ul className="list-disc list-inside text-slate-200 space-y-1">
                  {report.rajaYogas.map((r, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: r.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}></li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                <strong className="text-emerald-400 block mb-0.5">🌱 Kula & Vamsha Phala:</strong>
                <span>{report.kulaAndVamshaPhala}</span>
              </div>
            </div>
          </div>

          {/* Career & Karmic Blueprint */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Professional & Spiritual Blueprint</span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">Career Phala & Karmic Purpose</h4>

              <div className="space-y-3 mt-4 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-purple-300 font-bold block mb-1">💼 Wealth & Career Trajectory:</span>
                  <p className="text-slate-200 leading-relaxed">{report.lagnaNadi.careerAndWealthPhala}</p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-cyan-300 font-bold block mb-1">☸️ Soul's Core Karmic Lesson:</span>
                  <p className="text-slate-200 leading-relaxed">{report.lagnaNadi.karmicLesson}</p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-amber-300 font-bold block mb-1">⏳ Ayurdaya & Longevity Horizon:</span>
                  <p className="text-slate-200 leading-relaxed">{report.ayurdayaInsight}</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 leading-relaxed">
              <strong className="text-purple-300 block mb-0.5">Deva Keralam Master Synthesis:</strong>
              <span>{report.masterDevaKeralamSynthesis}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 9 PLANETARY NADI PLACEMENTS */}
      {activeTab === "planets" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Planet List */}
          <div className="lg:col-span-2 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.values(report.planetsNadi).map((pn) => {
                const isSelected = activePlanet.planet === pn.planet;
                return (
                  <div
                    key={pn.planet}
                    onClick={() => setSelectedPlanetNadi(pn)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-purple-600/20 border-purple-400 shadow-xl ring-1 ring-purple-400"
                        : "bg-slate-950/60 border-slate-800 hover:bg-slate-900"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-100">{pn.planet}</span>
                        <span className="text-[9px] font-bold bg-slate-900 text-purple-300 px-1.5 py-0.5 rounded border border-slate-700">
                          #{pn.nadiAmsha.index}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-purple-300 mt-1">
                        {pn.nadiAmsha.name} ({pn.nadiAmsha.sanskritName})
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {pn.signName} • {pn.degreeInSign.toFixed(2)}°
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] flex items-center justify-between">
                      <span className="text-slate-400">{pn.nadiAmsha.halfBhaga}</span>
                      <span className="text-purple-400 font-semibold">{pn.nadiAmsha.nature.split(" ")[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Planet Nadi Detail Inspector */}
          <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] text-purple-400 uppercase tracking-wider font-bold">Planetary Nadi Dossier</span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">{activePlanet.planet} in {activePlanet.nadiAmsha.name} ({activePlanet.nadiAmsha.sanskritName})</h4>
              <div className="text-xs text-purple-300 font-mono mt-0.5">Nadi Amsha #{activePlanet.nadiAmsha.index} • {activePlanet.nadiAmsha.halfBhagaSanskrit}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Presiding Deity:</span>
                  <span className="font-bold text-slate-100">{activePlanet.nadiAmsha.rulingDeity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Nature:</span>
                  <span className="font-bold text-purple-300">{activePlanet.nadiAmsha.nature}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Degree Span:</span>
                  <span className="font-mono text-slate-200">{activePlanet.nadiAmsha.degreeStart}° – {activePlanet.nadiAmsha.degreeEnd}°</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">Archetypal Expression:</span>
                <p className="text-slate-200 leading-relaxed font-semibold">{activePlanet.nadiAmsha.archetype}</p>
              </div>

              <div>
                <span className="text-purple-400 font-bold block mb-1">Deva Keralam Sloka:</span>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-purple-500/30 text-purple-200 font-serif text-[11px] leading-relaxed italic">
                  "{activePlanet.nadiAmsha.classicalSutra}"
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">Career & Wealth Impact:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{activePlanet.nadiAmsha.careerAndWealthPhala}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 150 NADI AMSHAS MATRIX EXPLORER */}
      {activeTab === "matrix" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-black text-slate-100">The 150 Classical Nadi Amshas (12' Arc Micro-Divisions)</h4>
              <p className="text-xs text-slate-400">Sage Achyuta's complete catalogue of 150 micro-destiny rays from Deva Keralam.</p>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Nadi, deity, archetype..."
                className="w-full bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredNadis.map((m) => (
              <div key={m.index} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-100">
                    {m.name} ({m.sanskritName})
                  </span>
                  <span className="text-[9px] font-mono text-purple-400 font-bold bg-purple-950 px-1.5 py-0.5 rounded border border-purple-900">
                    #{m.index}
                  </span>
                </div>
                <div className="text-[10px] text-purple-300 font-semibold">Deity: {m.rulingDeity}</div>
                <p className="text-[11px] text-slate-300 leading-tight">{m.archetype}</p>
                <div className="text-[9.5px] text-slate-500 italic pt-1 border-t border-slate-800/60 truncate">
                  {m.classicalSutra}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: NADI GOCHAR TRANSIT TRIGGERS */}
      {activeTab === "transits" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Deva Keralam Nadi Gochar Triggers (गोचर नाडी सूत्र)</h4>
            <p className="text-xs text-slate-400">
              Real-time monitoring of major planets (Saturn & Jupiter) crossing natal Lagna/Moon Nadi degrees.
            </p>
          </div>

          {report.activeTransitTriggers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.activeTransitTriggers.map((t, idx) => (
                <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-purple-500/40 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                      <span>🪐</span>
                      <span>{t.transitPlanet} Crossing</span>
                    </span>
                    <span className="text-[10px] font-bold bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800">
                      {t.status}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Natal Target Point:</span>
                    <strong className="text-sm text-slate-100">{t.natalPoint}</strong>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {t.karmicEffect}
                  </p>

                  <div className="text-xs text-amber-300 pt-1">
                    <strong>Classical Shanti Remedy:</strong> {t.shantiRemedy}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-950/60 border border-purple-500/30 text-center space-y-2">
              <span className="text-3xl">🛡️</span>
              <h4 className="text-base font-bold text-purple-300">No Critical Adverse Nadi Transit Crossings</h4>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Neither Saturn nor other malefic rays are currently making close degree conjunctions with your sensitive natal Lagna or Moon Nadi Amshas. Cosmic stability prevails.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
