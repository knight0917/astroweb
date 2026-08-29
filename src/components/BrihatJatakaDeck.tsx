"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateBrihatJataka, BrihatJatakaReport } from "../engine/brihatJataka";

export default function BrihatJatakaDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"karma" | "chandra" | "pravrajya" | "drekkanas" | "nabhasa" | "gateways">("karma");

  const report: BrihatJatakaReport = useMemo(() => {
    return evaluateBrihatJataka(ephemeris);
  }, [ephemeris]);

  const activeChandraYoga = report.chandraYogas[0];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <h2 className="text-lg font-bold text-slate-100">
              The Brihat Jataka of Acharya Varahamihira (वराहमिहिर बृहज्जातक — 28 Chapters)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Classical Crest-Jewel (6th Century CE) — Tri-Lagna Karma Jeeva, Chandra Yogas, Pravrajya Sannyasa, 36 Drekkanas & 32 Nabhasa Yogas.
          </p>
        </div>

        {/* Primary Karma Dispositor Badge */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Karma Dispositor</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>💼</span>
              <span>{report.karmaJeeva.navamshaDispositor} (D9 Lord)</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/40 text-center">
            <div className="text-[9px] text-cyan-400 uppercase tracking-wider font-bold">Chandra Yoga</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🌙</span>
              <span>{activeChandraYoga?.yogaName || "Lunar Yoga"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Karma Jeeva Hero Card */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              {report.karmaJeeva.sanskritTradeTitle}
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Primary Artha Source: {report.karmaJeeva.navamshaDispositor} Dispositorship
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            <strong className="text-amber-300">Classical Wealth Source:</strong> {report.karmaJeeva.classicalSourceOfWealth}
          </p>
        </div>

        {/* Modern Industries & Careers */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">High-Yield Career Alignments:</span>
            <span className="text-xs font-semibold text-slate-200 block mt-0.5">
              {report.karmaJeeva.modernCareerAlignments.slice(0, 2).join(" • ")}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Recommended Sectors:</span>
            <span className="text-xs font-semibold text-slate-200 block mt-0.5">
              {report.karmaJeeva.recommendedIndustries.slice(0, 2).join(" • ")}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("karma")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "karma"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          💼 Tri-Lagna Karma Jeeva
        </button>
        <button
          onClick={() => setActiveTab("chandra")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "chandra"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌙 Chandra Yogas (Ch. 13)
        </button>
        <button
          onClick={() => setActiveTab("pravrajya")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "pravrajya"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🧘 Pravrajya / Sannyasa (Ch. 15)
        </button>
        <button
          onClick={() => setActiveTab("drekkanas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "drekkanas"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🛡️ 36 Drekkanas (Ch. 27)
        </button>
        <button
          onClick={() => setActiveTab("nabhasa")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "nabhasa"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌌 32 Nabhasa Yogas (Ch. 12)
        </button>
        <button
          onClick={() => setActiveTab("gateways")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "gateways"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ✨ Nisheka & Niryana
        </button>
      </div>

      {/* TAB 1: TRI-LAGNA KARMA JEEVA */}
      {activeTab === "karma" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Tri-Lagna Livelihood Synthesis</span>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">{report.triLagnaKarma.synthesis}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* From Lagna */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] text-amber-400 uppercase font-bold">From Ascendant (Lagna)</span>
                <h4 className="text-sm font-black text-slate-100 mt-0.5">Dispositor: {report.triLagnaKarma.fromLagna.navamshaDispositor}</h4>
                <div className="text-[10px] text-slate-400 mt-0.5">{report.triLagnaKarma.fromLagna.sanskritTradeTitle}</div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{report.triLagnaKarma.fromLagna.varahamihiraDictum}</p>
            </div>

            {/* From Moon */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] text-cyan-400 uppercase font-bold">From Chandra (Mind Career)</span>
                <h4 className="text-sm font-black text-slate-100 mt-0.5">Dispositor: {report.triLagnaKarma.fromMoon.navamshaDispositor}</h4>
                <div className="text-[10px] text-slate-400 mt-0.5">{report.triLagnaKarma.fromMoon.sanskritTradeTitle}</div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{report.triLagnaKarma.fromMoon.varahamihiraDictum}</p>
            </div>

            {/* From Sun */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/40 space-y-3">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] text-rose-400 uppercase font-bold">From Surya (Status Career)</span>
                <h4 className="text-sm font-black text-slate-100 mt-0.5">Dispositor: {report.triLagnaKarma.fromSun.navamshaDispositor}</h4>
                <div className="text-[10px] text-slate-400 mt-0.5">{report.triLagnaKarma.fromSun.sanskritTradeTitle}</div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{report.triLagnaKarma.fromSun.varahamihiraDictum}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHANDRA YOGAS */}
      {activeTab === "chandra" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Chandra Yogas (चन्द्र योगाध्याय — Brihat Jataka Ch. 13)</h4>
            <p className="text-xs text-slate-400">
              Varahamihira's primary lunar formations: Sunapha, Anapha, Duradhara, Kemadruma, and Chandradhi Yoga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.chandraYogas.map((cy, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border space-y-3 ${
                  cy.isAuspicious
                    ? "bg-slate-950 border-emerald-500/40 shadow-lg"
                    : "bg-slate-950/70 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h4 className="text-sm font-black text-slate-100">{cy.yogaName}</h4>
                    <span className="text-[10px] text-amber-300 font-semibold">{cy.sanskritName}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      cy.isAuspicious
                        ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                        : "bg-slate-900 text-slate-400 border-slate-800"
                    }`}
                  >
                    {cy.isAuspicious ? "Auspicious (शुभ)" : "Neutralized (भंग)"}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{cy.description}</p>

                {cy.planetsInvolved.length > 0 && (
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 font-bold">
                    Participating Planets: {cy.planetsInvolved.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRAVRAJYA / SANNYASA YOGA */}
      {activeTab === "pravrajya" && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-bold">Brihat Jataka Chapter 15</span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                Pravrajya Yoga & Sannyasa Orders (प्रव्रज्यायोगाध्याय)
              </h4>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-950/60 text-amber-300 border border-amber-800/60">
              Initiator: {report.pravrajyaYoga.initiatorPlanet}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-amber-300 font-bold text-xs block">
              Spiritual Lineage: {report.pravrajyaYoga.sanskritLineage}
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              <strong className="text-slate-400">Order Description: </strong>
              {report.pravrajyaYoga.spiritualOrder}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-slate-400">Philosophical Drive: </strong>
              {report.pravrajyaYoga.philosophicalDrive}
            </p>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            {report.pravrajyaYoga.varahaSutra}
          </p>
        </div>
      )}

      {/* TAB 4: 36 DREKKANAS */}
      {activeTab === "drekkanas" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">36 Drekkanas Decanate Inspector (Brihat Jataka Ch. 27)</h4>
            <p className="text-xs text-slate-400">
              Varahamihira's 36 visual decanate forms and psychosomatic archetypes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[report.drekkanas.lagnaDrekkana, report.drekkanas.moonDrekkana, report.drekkanas.sunDrekkana].map((d, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-xs font-black text-slate-100">{d.pointName}</span>
                    <div className="text-[10px] text-slate-400">{d.signName} ({d.decanateDegrees})</div>
                  </div>
                  <span className="text-xl">{d.icon}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-amber-400 uppercase font-bold block">Archetype: {d.archetype}</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{d.psychologicalTrait}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-rose-300">
                  <span className="font-bold">Constitutional Vigilance: </span>{d.somaticVulnerability}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: 32 NABHASA YOGAS */}
      {activeTab === "nabhasa" && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] text-amber-400 uppercase font-bold">Brihat Jataka Chapter 12</span>
            <h4 className="text-base font-black text-slate-100 mt-0.5">
              {report.nabhasaYoga.activeYogaName} ({report.nabhasaYoga.sanskritName})
            </h4>
            <div className="text-xs text-slate-400 mt-0.5">
              Category: {report.nabhasaYoga.yogaCategory} • Occupied Signs: {report.nabhasaYoga.occupiedSignsCount}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
            <span className="text-amber-400 font-bold block">Definition:</span>
            <p className="text-slate-200">{report.nabhasaYoga.classicalDefinition}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
            <span className="text-emerald-400 font-bold block">Lifelong Fruits (Phala):</span>
            <p className="text-slate-200 leading-relaxed">{report.nabhasaYoga.lifelongPhala}</p>
          </div>
        </div>
      )}

      {/* TAB 6: NISHEKA & NIRYANA */}
      {activeTab === "gateways" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] text-amber-400 uppercase font-bold">Ch. 4: Nisheka (Prenatal Epoch)</span>
            <h4 className="text-sm font-black text-slate-100">Cosmic Conception Alignment</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{report.nishekaInsight}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] text-rose-400 uppercase font-bold">Ch. 21: Niryana (Longevity Gateway)</span>
            <h4 className="text-sm font-black text-slate-100">8th House Transition</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{report.niryanaInsight}</p>
          </div>
        </div>
      )}
    </div>
  );
}
