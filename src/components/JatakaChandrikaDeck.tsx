"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateJatakaChandrika } from "../engine/jatakaChandrika";
import { JatakaChandrikaAnalysis } from "../engine/types";

export default function JatakaChandrikaDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"roles" | "sambandhas" | "dosha" | "marakas">("roles");

  const report: JatakaChandrikaAnalysis = useMemo(() => {
    return evaluateJatakaChandrika(ephemeris);
  }, [ephemeris]);

  const ykCount = report.yogakarakas.length;
  const ryCount = report.sambandhas.filter((s) => s.isRajaYoga).length;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌙</span>
            <h2 className="text-lg font-bold text-slate-100">
              Jataka Chandrika (जातक चन्द्रिका / Laghu Parashari)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Definitive 41-Sloka Functional Matrix: Yogakarakas, Kendradhipati Dosha & 4-Fold Sambandha Raja Yogas (Tr. Prof. B. Suryanarain Rao).
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Lagna Disposition</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>👑</span>
              <span>{report.ascendantSign} Lagna</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Raja Yogas Active</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>⭐</span>
              <span>{ryCount} Sambandha Yogas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              Prof. B. Suryanarain Rao Classical Synthesis (लघु पाराशरी महा निर्णय)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Functional Benefic & Malefic Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterChandrikaSynthesis}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Premier Yogakaraka:</span>
            <span className="text-xs font-black text-amber-300 block mt-0.5">
              {report.yogakarakas.join(", ") || "Standard Kendra/Trikona Sambandha"}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-red-400 uppercase font-bold block">Trishadaya Malefics:</span>
            <span className="text-xs font-bold text-red-300 block mt-0.5">
              {report.malefics.join(", ")}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("roles")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "roles"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          👑 7 Graha Functional Roles
        </button>
        <button
          onClick={() => setActiveTab("sambandhas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "sambandhas"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🔗 4-Fold Sambandha Raja Yogas
        </button>
        <button
          onClick={() => setActiveTab("dosha")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "dosha"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⚖️ Kendradhipati Dosha & 8th Lord
        </button>
        <button
          onClick={() => setActiveTab("marakas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "marakas"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ☠️ Maraka Determinators (2nd & 7th)
        </button>
      </div>

      {/* TAB 1: 7 GRAHA FUNCTIONAL ROLES */}
      {activeTab === "roles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.grahaRoles.map((g) => {
            const isYk = g.functionalNature.includes("Yogakaraka");
            const isSubha = g.functionalNature.includes("Benefic");
            const isMal = g.functionalNature.includes("Malefic");
            return (
              <div
                key={g.grahaName}
                className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                  isYk
                    ? "bg-slate-950 border-amber-500/50 shadow-xl ring-1 ring-amber-500/30"
                    : isSubha
                    ? "bg-slate-950 border-emerald-500/40"
                    : isMal
                    ? "bg-slate-950 border-red-500/30"
                    : "bg-slate-950/60 border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="text-sm font-black text-slate-100">{g.grahaName}</h4>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        Lord of House(s): {g.housesOwned.join(", ")}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isYk
                          ? "bg-amber-950 text-amber-300 border-amber-800"
                          : isSubha
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : isMal
                          ? "bg-red-950 text-red-300 border-red-800"
                          : "bg-slate-900 text-slate-400 border-slate-800"
                      }`}
                    >
                      {g.functionalNature.split(" (")[0]}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mt-3">{g.classicalReasoning}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[9px] font-bold pt-2 border-t border-slate-900">
                  {g.kendradhipatiDosha && (
                    <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                      ⚠️ Kendradhipati Dosha
                    </span>
                  )}
                  {g.isMaraka && (
                    <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800">
                      ☠️ Maraka Planet
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: 4-FOLD SAMBANDHA RAJA YOGAS */}
      {activeTab === "sambandhas" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">4-Fold Sambandha Raja Yogas (चतुर्विध सम्बन्ध राजयोग)</h4>
            <p className="text-xs text-slate-400">
              Per Jataka Chandrika, Parivartana (Exchange), Mutual Drishti, Single Aspect, and Conjunction form supreme Raja Yogas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.sambandhas.map((s, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border space-y-3 flex flex-col justify-between ${
                  s.isRajaYoga
                    ? "bg-slate-950 border-amber-500/50 shadow-xl ring-1 ring-amber-500/30"
                    : "bg-slate-950/60 border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="text-sm font-black text-slate-100">{s.planetA} + {s.planetB}</h4>
                      <span className="text-[10px] text-amber-400 font-semibold">{s.sambandhaType}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        s.isRajaYoga
                          ? "bg-amber-950 text-amber-300 border-amber-800"
                          : "bg-slate-900 text-slate-400 border-slate-800"
                      }`}
                    >
                      {s.isRajaYoga ? "Active Raja Yoga" : "Standard Sambandha"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mt-3">{s.fruitionDescription}</p>
                </div>
              </div>
            ))}
            {report.sambandhas.length === 0 && (
              <p className="text-xs text-slate-500 italic">No major planetary conjunctions or mutual 7th aspects active.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: KENDRADHIPATI DOSHA */}
      {activeTab === "dosha" && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] text-amber-400 uppercase font-bold">Slokas 10 - 13</span>
            <h4 className="text-base font-black text-slate-100 mt-0.5">
              Kendradhipati Dosha & 8th Lord Neutrality (केन्द्राधिपति दोष एवं अष्टमेश विचार)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold block">1. Natural Benefics Owning Kendras:</span>
              <p className="text-slate-300">
                Jupiter, Venus, Mercury, and Moon owning Kendras (1, 4, 7, 10) lose their innate beneficence and become neutral or mild malefics unless they also own a Trikona (5 or 9).
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold block">2. Natural Malefics Owning Kendras:</span>
              <p className="text-slate-300">
                Sun, Mars, and Saturn owning Kendras shed their innate cruel disposition and become functional neutrals, capable of conferring prosperity when joined with Trikona lords.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30">
            <span className="text-amber-300 font-bold block mb-1">Active Chart Status:</span>
            <p className="text-slate-200">
              Grahas with Kendradhipati Dosha: <strong>{report.kendradhipatiDoshaGrahas.join(", ") || "None"}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: MARAKA DETERMINATORS */}
      {activeTab === "marakas" && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] text-red-400 uppercase font-bold">Slokas 28 - 35</span>
            <h4 className="text-base font-black text-slate-100 mt-0.5">
              Maraka Determinators & Dasha Vulnerabilities (मारक निर्णय)
            </h4>
          </div>

          <p className="text-slate-300 leading-relaxed">
            Per Jataka Chandrika, the 2nd and 7th houses are primary Maraka Sthanas (death-inflicting or crisis-producing houses). Their lords, planets conjoined with them, and planets aspected by them become secondary Marakas.
          </p>

          <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 space-y-1">
            <span className="text-red-300 font-bold block">Primary Maraka Lords for {report.ascendantSign} Lagna:</span>
            <p className="text-slate-200 font-bold">{report.marakas.join(", ") || "None Active"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
