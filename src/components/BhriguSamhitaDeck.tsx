"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateBhriguSamhita } from "../engine/bhriguSamhita";
import { BhriguSamhitaAnalysis } from "../engine/types";

export default function BhriguSamhitaDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"rinas" | "bhavas" | "pariharas">("rinas");
  const [selectedBhava, setSelectedBhava] = useState<number>(1);

  const report: BhriguSamhitaAnalysis = useMemo(() => {
    return evaluateBhriguSamhita(ephemeris);
  }, [ephemeris]);

  const activeRinasCount = report.karmicDebts.filter((d) => d.isAfflicted).length;
  const currentBhavaReading = report.bhavaReadings.find((b) => b.bhava === selectedBhava) || report.bhavaReadings[0];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <h2 className="text-lg font-bold text-slate-100">
              Maharshi Bhrigu Samhita (महर्षि भृगु संहिता)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            12 Bhavas Karmic Planetary Readings, 6 Past-Life Sins & Scriptural Pariharas (Dr. T.M. Rao).
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Karmic Debts Active</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>⚖️</span>
              <span>{activeRinasCount} of 6 Rinas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              Maharshi Bhrigu Karmic Synthesis (पूर्व जन्म कर्म रहस्य)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Past-Life Karmic Imprint
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterSamhitaSynthesis}
          </p>
        </div>

        {/* Quick Status */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Dominant Past-Life Theme:</span>
            <span className="text-xs font-bold text-slate-200 block mt-0.5">
              {report.dominantPastLifeTheme}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("rinas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "rinas"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⚖️ 6 Past-Life Karmic Debts (Rinas)
        </button>
        <button
          onClick={() => setActiveTab("bhavas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "bhavas"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🏛️ 12 Bhavas Karmic Readings
        </button>
        <button
          onClick={() => setActiveTab("pariharas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "pariharas"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🌿 Scriptural Bhrigu Pariharas
        </button>
      </div>

      {/* TAB 1: 6 PAST-LIFE KARMIC DEBTS */}
      {activeTab === "rinas" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.karmicDebts.map((d, idx) => {
            const isSevere = d.severity.includes("Severe");
            const isMod = d.severity.includes("Moderate");
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                  isSevere
                    ? "bg-slate-950 border-red-500/50 shadow-xl ring-1 ring-red-500/30"
                    : isMod
                    ? "bg-slate-950 border-amber-500/40"
                    : "bg-slate-950/60 border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-black text-slate-100">{d.debtName.split(" (")[0]}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isSevere
                          ? "bg-red-950 text-red-300 border-red-800"
                          : isMod
                          ? "bg-amber-950 text-amber-300 border-amber-800"
                          : "bg-emerald-950 text-emerald-300 border-emerald-800"
                      }`}
                    >
                      {d.severity.split(" (")[0]}
                    </span>
                  </div>

                  <div className="space-y-2 mt-3 text-xs">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold block">Past-Life Cause:</span>
                      <p className="text-slate-300 leading-relaxed">{d.karmicReason}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Current Manifestation:</span>
                      <p className="text-slate-300 leading-relaxed">{d.symptomsInCurrentLife}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900 text-xs">
                  <span className="text-[10px] text-emerald-400 font-bold block">Bhrigu Remedy:</span>
                  <p className="text-slate-200 mt-0.5">{d.bhriguSamhitaRemedy}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: 12 BHAVAS KARMIC READINGS */}
      {activeTab === "bhavas" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {report.bhavaReadings.map((b) => (
              <button
                key={b.bhava}
                onClick={() => setSelectedBhava(b.bhava)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedBhava === b.bhava
                    ? "bg-amber-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800"
                }`}
              >
                House {b.bhava}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-[10px] text-amber-400 font-bold">House #{currentBhavaReading.bhava}</span>
                <h4 className="text-base font-black text-slate-100">{currentBhavaReading.bhavaName}</h4>
              </div>
              <div className="text-[10px] text-slate-400">
                Occupying: <strong>{currentBhavaReading.occupyingPlanets.join(", ") || "None (Vacant)"}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-amber-300 font-bold block">Karmic Imprint in Current Life:</span>
              <p className="text-slate-200 leading-relaxed">{currentBhavaReading.karmicImprint}</p>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
              <span className="text-amber-300 font-bold block mb-0.5">📜 Maharshi Bhrigu Classical Dictum:</span>
              <p className="text-slate-200">{currentBhavaReading.bhriguDictum}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCRIPTURAL PARIHARAS */}
      {activeTab === "pariharas" && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] text-amber-400 uppercase font-bold">Bhrigu Samhita Shanti Vidhi</span>
            <h4 className="text-base font-black text-slate-100 mt-0.5">
              Scriptural Remedies for Karmic Neutralization (भृगु संहिता शान्ति उपाय)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold block">1. Annadaanam & Gau-Seva:</span>
              <p className="text-slate-300">
                Feeding hungry souls and tending to indigenous cows neutralizes Pitru and Matru Rinas, invoking direct ancestral blessings.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold block">2. Kanya Seva & Lakshmi Aradhana:</span>
              <p className="text-slate-300">
                Serving 9 young girls on Fridays and offering white sweets eliminates Stri Rina and enhances marital bliss and wealth.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold block">3. Tarpan & Sacred Tree Seva:</span>
              <p className="text-slate-300">
                Offering water with black sesame at sunrise and watering Peepal / Banyan trees cleanses Brahma Hatya and Guru afflictions.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-purple-400 font-bold block">4. Maha Mrityunjaya Japa:</span>
              <p className="text-slate-300">
                Chanting Shiva mantras and performing Rudrabhishekam dissolves venomous fears, Sarpa curses, and bodily distress.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
