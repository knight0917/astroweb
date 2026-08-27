"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateKarmaRebirth, KarmaRebirthReport } from "../engine/karmaRebirth";

export default function KarmaRebirthDeck() {
  const { ephemeris } = useAstroStore();
  const [activeSubTab, setActiveSubTab] = useState<"spectrum" | "loka" | "punya" | "rahuKetu" | "retrograde">("loka");

  const report: KarmaRebirthReport = useMemo(() => {
    return evaluateKarmaRebirth(ephemeris);
  }, [ephemeris]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">☸️</span>
            <h2 className="text-lg font-bold text-slate-100">
              K.N. Rao: Karma, Rebirth & Purva Punya Intelligence
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grounded in K.N. Rao\'s \'Karma & Rebirth in Hindu Astrology\' — Loka of Origin, 22nd Dreshkona, Purva Punya & Karmic Highway.
          </p>
        </div>

        {/* Loka Descent Quick Badge */}
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 px-4 py-2 rounded-xl border border-amber-500/40 text-center sm:text-right">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">Loka of Origin (Soul Descent)</div>
          <div className="text-sm font-black text-slate-100">{report.lokaOfDescent.lokaName}</div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSubTab("loka")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "loka"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌌 Loka of Descent & 22nd Dreshkona
        </button>
        <button
          onClick={() => setActiveSubTab("punya")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "punya"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          📿 Purva Punya & Bhagya (5th/9th)
        </button>
        <button
          onClick={() => setActiveSubTab("rahuKetu")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "rahuKetu"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🐍 Rahu-Ketu Karmic Axis
        </button>
        <button
          onClick={() => setActiveSubTab("retrograde")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "retrograde"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⏳ Retrograde Soul Contracts ({report.retrogradeContracts.length})
        </button>
        <button
          onClick={() => setActiveSubTab("spectrum")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "spectrum"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⚖️ Quad-Karma Spectrum
        </button>
      </div>

      {/* Tab 1: Loka of Descent & 22nd Dreshkona */}
      {activeSubTab === "loka" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Loka of Descent Card */}
          <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/15 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {report.lokaOfDescent.sanskritLoka}
                  </span>
                  <h3 className="text-lg font-black text-slate-100 mt-0.5">
                    {report.lokaOfDescent.lokaName}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Via {report.lokaOfDescent.strongerLuminary} ({report.lokaOfDescent.d3Lord}\'s D3 Ray)
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 mt-3">
                <p className="leading-relaxed">{report.lokaOfDescent.realmDescription}</p>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <strong className="text-amber-300">Soul Heritage Carried Forward:</strong>
                  <p className="mt-1 text-slate-300 leading-relaxed">{report.lokaOfDescent.spiritualHeritage}</p>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800/60">
              Determined by {report.lokaOfDescent.strongerLuminary} in D3 ({report.lokaOfDescent.d3SignName} ruled by {report.lokaOfDescent.d3Lord}).
            </div>
          </div>

          {/* 22nd Dreshkona (Kharesh) Card */}
          <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-950/15 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                    22nd Dreshkona (Kharesh / द्रेष्काण 22)
                  </span>
                  <h3 className="text-lg font-black text-slate-100 mt-0.5">
                    Kharesh Lord: {report.kharesh.khareshLord}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  8th in D3: {report.kharesh.twentySecondDreshkonaSignName}
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 mt-3">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <strong className="text-rose-300">Past Karmic Vulnerability:</strong>
                  <p className="mt-1 text-slate-300 leading-relaxed">{report.kharesh.vulnerabilityTheme}</p>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <strong className="text-emerald-300">Remedial Guidance (K.N. Rao):</strong>
                  <p className="mt-1 text-slate-300 leading-relaxed">{report.kharesh.remedialAdvice}</p>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800/60">
              Kharesh situated in House #{report.kharesh.khareshHouseInD1} in Natal D1 Kundli.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Purva Punya & Bhagya */}
      {activeSubTab === "punya" && (
        <div className="space-y-6">
          {/* Score Header */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Past Life Spiritual Credit Index
              </span>
              <h3 className="text-xl font-black text-slate-100 mt-0.5">
                Purva Punya Capacity: {report.purvaPunya.purvaPunyaScore}%
              </h3>
            </div>
            <div className="w-full sm:w-48 bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full"
                style={{ width: `${report.purvaPunya.purvaPunyaScore}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 5th House Purva Punya */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-400 uppercase">
                  5th House (पूर्व पुण्य स्थान)
                </span>
                <span className="text-xs text-slate-400 font-mono font-bold">
                  {report.purvaPunya.fifthHouseSign} (Lord: {report.purvaPunya.fifthLord})
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {report.purvaPunya.pastSadhanaMerits}
              </p>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                <strong className="text-amber-300">Rinanubandhana (Past Debts & Children):</strong>
                <p className="mt-1 leading-relaxed">{report.purvaPunya.rinanubandhanaChildrenDebts}</p>
              </div>
            </div>

            {/* 9th House Bhagya & Dharma */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase">
                  9th House (भाग्य एवं धर्म कवच)
                </span>
                <span className="text-xs text-slate-400 font-mono font-bold">
                  {report.purvaPunya.ninthHouseSign} (Lord: {report.purvaPunya.ninthLord})
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {report.purvaPunya.guruDharmaArmor}
              </p>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                <strong className="text-emerald-300">Divine Protection Shield:</strong>
                <p className="mt-1 leading-relaxed">
                  Carried spiritual merit acts as invisible armor during difficult Mahadashas and Sade Sati.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Rahu-Ketu Axis */}
      {activeSubTab === "rahuKetu" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ketu (Past Mastery) */}
          <div className="p-5 rounded-2xl border border-teal-500/30 bg-teal-950/15 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                    Ketu (The Past / Tail)
                  </span>
                  <h3 className="text-lg font-black text-slate-100 mt-0.5">
                    In {report.rahuKetuAxis.ketuSign} (House #{report.rahuKetuAxis.ketuHouse})
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  Past Life Mastery
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 mt-3">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <strong className="text-teal-300">Instinctive Past Gifts:</strong>
                  <p className="mt-1 text-slate-300 leading-relaxed">{report.rahuKetuAxis.ketuPastMastery}</p>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <strong className="text-amber-300">Karmic Detachment Task:</strong>
                  <p className="mt-1 text-slate-300 leading-relaxed">{report.rahuKetuAxis.ketuPastDebts}</p>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800/60">
              Area of natural instinct that must not become a trap of complacency.
            </div>
          </div>

          {/* Rahu (Future Frontier) */}
          <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-950/15 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    Rahu (The Future / Head)
                  </span>
                  <h3 className="text-lg font-black text-slate-100 mt-0.5">
                    In {report.rahuKetuAxis.rahuSign} (House #{report.rahuKetuAxis.rahuHouse})
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Current Evolution
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 mt-3">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <strong className="text-purple-300">Growth Frontier:</strong>
                  <p className="mt-1 text-slate-300 leading-relaxed">{report.rahuKetuAxis.rahuFutureFrontier}</p>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <strong className="text-emerald-300">Incarnational Mission:</strong>
                  <p className="mt-1 text-slate-300 leading-relaxed">{report.rahuKetuAxis.rahuKarmicGrowthTask}</p>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800/60">
              Unfamiliar territory requiring courage and conscious expansion.
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Retrograde Soul Contracts */}
      {activeSubTab === "retrograde" && (
        <div className="space-y-4">
          {report.retrogradeContracts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.retrogradeContracts.map((c, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-amber-500/30 bg-slate-900/80 flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-amber-300">{c.planet}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                        वक्री [Retrograde]
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {c.sign} (H#{c.house})
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <strong className="text-rose-300">Unfinished Soul Contract:</strong>
                      <p className="mt-0.5 leading-relaxed">{c.unfinishedLesson}</p>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <strong className="text-emerald-300">Karmic Resolution Pathway:</strong>
                      <p className="mt-0.5 leading-relaxed">{c.karmicResolution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-xs text-slate-400">
              ✨ No primary physical planets are retrograde in this chart. Karmic energy flows directly in forward momentum.
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Quad-Karma Spectrum */}
      {activeSubTab === "spectrum" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(report.quadKarma).map((k, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-amber-400">{k.sanskritName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{k.astrologicalLocus}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100 mt-2">{k.name}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{k.description}</p>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                <strong className="text-emerald-300">Current Manifestation Status:</strong>
                <p className="mt-0.5 leading-relaxed">{k.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
