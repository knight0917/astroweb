"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateUttaraKalamrita } from "../engine/uttaraKalamrita";
import { UttaraKalamritaAnalysis } from "../engine/types";

export default function UttaraKalamritaDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"vry" | "paradox" | "nodes" | "vakra" | "karakatvas">("vry");
  const [selectedGraha, setSelectedGraha] = useState<string>("Sun");

  const report: UttaraKalamritaAnalysis = useMemo(() => {
    return evaluateUttaraKalamrita(ephemeris);
  }, [ephemeris]);

  const activeVrysCount = report.viparitaRajaYogas.filter((v) => v.isActive).length;
  const activeRetroCount = report.vakraPotencies.filter((v) => v.isRetrograde).length;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <h2 className="text-lg font-bold text-slate-100">
              Uttara Kalamrita (उत्तर कालामृतम्) by Mahakavi Kalidasa
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quintessential Classical Masterpiece: Pure Viparita Raja Yoga, Shukra-Shani Dasha Paradox & Node Yogakaraka Mechanics.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Viparita Raja Yoga</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>👑</span>
              <span>{activeVrysCount} of 3 Formations</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-purple-500/40 text-center">
            <div className="text-[9px] text-purple-400 uppercase tracking-wider font-bold">Vakra Uchcha-Sama</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🌀</span>
              <span>{activeRetroCount} Retrograde Grahas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              Mahakavi Kalidasa Classical Synthesis (कालिदास महा निर्णय)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Viparita Raja Yoga & Dasha Paradox Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterUttaraKalamritaSynthesis}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Shukra-Shani Dasha:</span>
            <span className="text-xs font-black text-slate-100 block mt-0.5">
              {report.shukraShaniParadox.paradoxType.split(" (")[0]}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Rahu Dispositorship:</span>
            <span className="text-xs font-bold text-emerald-300 block mt-0.5">
              {report.nodeMechanics.find((n) => n.nodeName === "Rahu")?.dispositor || "Active"} Lord Dispositor
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("vry")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "vry"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          👑 Viparita Raja Yoga (Harsha, Sarala, Vimala)
        </button>
        <button
          onClick={() => setActiveTab("paradox")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "paradox"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⚖️ Shukra-Shani Dasha Paradox
        </button>
        <button
          onClick={() => setActiveTab("nodes")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "nodes"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🐉 Rahu & Ketu Node Mechanics
        </button>
        <button
          onClick={() => setActiveTab("vakra")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "vakra"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌀 Vakra (Retrograde Strength)
        </button>
        <button
          onClick={() => setActiveTab("karakatvas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "karakatvas"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          📜 Kalidasa Karakatvas
        </button>
      </div>

      {/* TAB 1: VIPARITA RAJA YOGA */}
      {activeTab === "vry" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Viparita Raja Yoga (विपरीत राजयोग — Khanda 4, Sloka 22)</h4>
            <p className="text-xs text-slate-400">
              "When the 6th, 8th, and 12th lords are posited in 6th, 8th, or 12th, the native triumphs over all adversities and attains sudden supreme renown."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.viparitaRajaYogas.map((v, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                  v.isActive
                    ? "bg-slate-950 border-amber-500/50 shadow-xl ring-1 ring-amber-500/30"
                    : "bg-slate-950/60 border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="text-sm font-black text-slate-100">{v.yogaName}</h4>
                      <span className="text-[10px] text-amber-300 font-semibold">{v.dusthanaLord}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        v.isActive
                          ? "bg-amber-950 text-amber-300 border-amber-800"
                          : "bg-slate-900 text-slate-400 border-slate-800"
                      }`}
                    >
                      {v.potency}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mt-3">{v.effects}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
                  {v.kalidasaDictum}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SHUKRA-SHANI PARADOX */}
      {activeTab === "paradox" && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-bold">Khanda 4 Slokas 28-29</span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                Shukra-Shani Mutual Dasha Paradox (शनि-शुक्र परस्पर दशा विचार)
              </h4>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-950/60 text-amber-300 border border-amber-800/60">
              {report.shukraShaniParadox.paradoxType}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-amber-400 font-bold block mb-0.5">Venus Positional Dignity:</span>
              <p className="text-slate-200">{report.shukraShaniParadox.venusDignity}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-amber-400 font-bold block mb-0.5">Saturn Positional Dignity:</span>
              <p className="text-slate-200">{report.shukraShaniParadox.saturnDignity}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1.5">
            <span className="text-amber-300 font-bold block">⚖️ Mutual Dasha-Bhukti Fruition:</span>
            <p className="text-slate-200 leading-relaxed">{report.shukraShaniParadox.mutualDashaEffect}</p>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            {report.shukraShaniParadox.kalidasaRule}
          </p>
        </div>
      )}

      {/* TAB 3: RAHU & KETU NODES */}
      {activeTab === "nodes" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Rahu & Ketu Node Mechanics (राहु-केतु कारकत्व — Khanda 4, Slokas 25-26)</h4>
            <p className="text-xs text-slate-400">
              Shadow dispositor amplification and Kendra-Trikona Yogakaraka transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.nodeMechanics.map((n, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="text-sm font-black text-slate-100">{n.nodeName}</h4>
                      <span className="text-xs text-slate-400">Posited in House {n.house}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        n.isYogakaraka
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : "bg-slate-900 text-slate-400 border-slate-800"
                      }`}
                    >
                      {n.isYogakaraka ? "Exalted Yogakaraka" : "Shadow Dispositor"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mt-3">{n.fruitionPattern}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-amber-300 font-bold">
                  Ruling Dispositor: {n.dispositor} • Conjoined: {n.conjoinedPlanets.join(", ") || "None"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VAKRA GRAHA */}
      {activeTab === "vakra" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Vakra Graha Potency (वक्र ग्रह बल — Retrograde Exaltation Equivalence)</h4>
            <p className="text-xs text-slate-400">
              Mahakavi Kalidasa dictates that a retrograde planet behaves with the full force of an exalted (Uchcha) Graha.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.vakraPotencies.map((vp, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all space-y-2 flex flex-col justify-between ${
                  vp.isRetrograde
                    ? "bg-slate-950 border-purple-500/50 shadow-lg ring-1 ring-purple-500/30"
                    : "bg-slate-950/60 border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-sm font-black text-slate-100">{vp.planetName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        vp.isRetrograde
                          ? "bg-purple-950 text-purple-300 border-purple-800"
                          : "bg-slate-900 text-slate-400 border-slate-800"
                      }`}
                    >
                      {vp.isRetrograde ? "Vakra (Uchcha-Sama)" : "Direct Motion"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mt-2">{vp.effectDescription}</p>
                </div>

                <div className="text-[10px] font-bold text-amber-300">
                  Potency Score: {vp.potencyScore}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: KALIDASA KARAKATVA REPOSITORY */}
      {activeTab === "karakatvas" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Kalidasa Karakatva Repository (विशद ग्रह कारकत्व)</h4>
            <p className="text-xs text-slate-400">
              Select a planet to explore its exhaustive classical significations codified by Mahakavi Kalidasa.
            </p>
          </div>

          {/* Graha Switcher */}
          <div className="flex flex-wrap gap-1.5">
            {report.karakatvaHighlights.map((k) => (
              <button
                key={k.graha}
                onClick={() => setSelectedGraha(k.graha)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedGraha === k.graha
                    ? "bg-amber-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800"
                }`}
              >
                {k.graha}
              </button>
            ))}
          </div>

          {/* Significations Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-sm font-black text-amber-400">{selectedGraha} Classical Karakatvas:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {report.karakatvaHighlights
                .find((k) => k.graha === selectedGraha)
                ?.significations.map((sig, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{sig}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
