"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { calculateBhavaBala, HouseBala } from "../engine/bhavabala";
import BhavaJudgementDeck from "./BhavaJudgementDeck";
import BhriguNadiDeck from "./BhriguNadiDeck";
import KarmaRebirthDeck from "./KarmaRebirthDeck";
import DoubleTransitDeck from "./DoubleTransitDeck";
import MarriageTimingDeck from "./MarriageTimingDeck";
import KnRaoTechniquesDeck from "./KnRaoTechniquesDeck";
import EducationStreamDeck from "./EducationStreamDeck";
import DashaSystemsDeck from "./DashaSystemsDeck";
import BphsCoreDeck from "./BphsCoreDeck";
import BrihatJatakaDeck from "./BrihatJatakaDeck";
import BrihatSamhitaDeck from "./BrihatSamhitaDeck";
import DevaKeralamDeck from "./DevaKeralamDeck";
import SukaNadiDeck from "./SukaNadiDeck";
import JaiminiSutrasDeck from "./JaiminiSutrasDeck";
import GayatriJyotishDeck from "./GayatriJyotishDeck";
import JatakaAlankaraDeck from "./JatakaAlankaraDeck";
import JatakNirnayDeck from "./JatakNirnayDeck";
import JatakaParijataDeck from "./JatakaParijataDeck";
import SaravaliDeck from "./SaravaliDeck";

export default function BhavaBalaView() {
  const { ephemeris } = useAstroStore();
  const [displayMode, setDisplayMode] = useState<"bars" | "stacked" | "table" | "judgement" | "bhrigu" | "karma" | "dtp" | "marriage" | "techniques" | "education" | "dashas" | "bphs" | "jataka" | "samhita" | "keralam" | "suka" | "jaimini" | "gayatri" | "alankara" | "nirnay" | "parijata" | "saravali">("bars");

  const bhavaBalaResult = useMemo(() => {
    return calculateBhavaBala(ephemeris);
  }, [ephemeris]);

  const [activeHouseNum, setActiveHouseNum] = useState<number>(
    bhavaBalaResult.strongestHouse.houseNum
  );

  const activeHouse: HouseBala =
    bhavaBalaResult.houses[activeHouseNum] || bhavaBalaResult.strongestHouse;

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: "🥇", label: "1st (Strongest)", color: "bg-amber-500 text-slate-950 font-black" };
    if (rank === 2) return { icon: "🥈", label: "2nd", color: "bg-slate-300 text-slate-950 font-black" };
    if (rank === 3) return { icon: "🥉", label: "3rd", color: "bg-amber-700 text-slate-100 font-bold" };
    return { icon: `#${rank}`, label: `${rank}th`, color: "bg-slate-800 text-slate-300" };
  };

  // Max Rupas for Bar Chart scaling
  const maxRupas = useMemo(() => {
    const maxVal = Math.max(...bhavaBalaResult.rankedHouses.map((h) => h.totalRupas));
    return Math.max(12, Math.ceil(maxVal + 1));
  }, [bhavaBalaResult]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Classical Parashari Bhava Bala (भावबल — 12 House Strengths System)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Brihat Parashara Hora Shastra (BPHS Ch. 28) • House Lord, Directional, Aspectual, and Day/Night Potencies
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setDisplayMode("bars")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              displayMode === "bars"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Potency Bars</span>
          </button>
          <button
            onClick={() => setDisplayMode("stacked")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              displayMode === "stacked"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Component Breakdown</span>
          </button>
          <button
            onClick={() => setDisplayMode("table")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              displayMode === "table"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Detailed Table</span>
          </button>
          <button
            onClick={() => setDisplayMode("judgement")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "judgement"
                ? "bg-purple-600 text-white shadow"
                : "text-purple-300 hover:text-white bg-purple-950/30 border border-purple-800/40"
            }`}
          >
            <span>🏛️ Raman 12 Bhavas Judgement</span>
          </button>
          <button
            onClick={() => setDisplayMode("bhrigu")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "bhrigu"
                ? "bg-amber-600 text-slate-950 shadow"
                : "text-amber-300 hover:text-white bg-amber-950/30 border border-amber-800/40"
            }`}
          >
            <span>📜 Bhrigu Nadi & BSP</span>
          </button>
          <button
            onClick={() => setDisplayMode("karma")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "karma"
                ? "bg-emerald-600 text-slate-950 shadow"
                : "text-emerald-300 hover:text-white bg-emerald-950/30 border border-emerald-800/40"
            }`}
          >
            <span>☸️ Karma & Rebirth (K.N. Rao)</span>
          </button>
          <button
            onClick={() => setDisplayMode("dtp")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "dtp"
                ? "bg-purple-600 text-white shadow"
                : "text-purple-300 hover:text-white bg-purple-950/30 border border-purple-800/40"
            }`}
          >
            <span>⚡ Double Transit & PAC-DARES</span>
          </button>
          <button
            onClick={() => setDisplayMode("marriage")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "marriage"
                ? "bg-rose-600 text-white shadow"
                : "text-rose-300 hover:text-white bg-rose-950/30 border border-rose-800/40"
            }`}
          >
            <span>💍 Timing of Marriage (K.N. Rao)</span>
          </button>
          <button
            onClick={() => setDisplayMode("techniques")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "techniques"
                ? "bg-amber-600 text-slate-950 shadow"
                : "text-amber-300 hover:text-white bg-amber-950/30 border border-amber-800/40"
            }`}
          >
            <span>🌟 Advanced Rao Techniques</span>
          </button>
          <button
            onClick={() => setDisplayMode("education")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "education"
                ? "bg-cyan-600 text-white shadow"
                : "text-cyan-300 hover:text-white bg-cyan-950/30 border border-cyan-800/40"
            }`}
          >
            <span>🎓 Planets & Education (K.N. Rao)</span>
          </button>
          <button
            onClick={() => setDisplayMode("dashas")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "dashas"
                ? "bg-purple-600 text-white shadow"
                : "text-purple-300 hover:text-white bg-purple-950/30 border border-purple-800/40"
            }`}
          >
            <span>⏳ Multi-Dasha & Yogini (Classical)</span>
          </button>
          <button
            onClick={() => setDisplayMode("bphs")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "bphs"
                ? "bg-amber-600 text-slate-950 shadow"
                : "text-amber-300 hover:text-white bg-amber-950/30 border border-amber-800/40"
            }`}
          >
            <span>📜 BPHS Classical Core (Parashara)</span>
          </button>
          <button
            onClick={() => setDisplayMode("jataka")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "jataka"
                ? "bg-rose-600 text-white shadow"
                : "text-rose-300 hover:text-white bg-rose-950/30 border border-rose-800/40"
            }`}
          >
            <span>👑 Brihat Jataka (Varahamihira)</span>
          </button>
          <button
            onClick={() => setDisplayMode("samhita")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "samhita"
                ? "bg-teal-600 text-white shadow"
                : "text-teal-300 hover:text-white bg-teal-950/30 border border-teal-800/40"
            }`}
          >
            <span>🐢 Brihat Samhita (Varahamihira)</span>
          </button>
          <button
            onClick={() => setDisplayMode("keralam")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "keralam"
                ? "bg-purple-600 text-white shadow"
                : "text-purple-300 hover:text-white bg-purple-950/30 border border-purple-800/40"
            }`}
          >
            <span>📜 Deva Keralam (150 Nadi Amshas)</span>
          </button>
          <button
            onClick={() => setDisplayMode("suka")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "suka"
                ? "bg-emerald-600 text-white shadow"
                : "text-emerald-300 hover:text-white bg-emerald-950/30 border border-emerald-800/40"
            }`}
          >
            <span>🦜 Suka Nadi (Shukacharya)</span>
          </button>
          <button
            onClick={() => setDisplayMode("jaimini")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "jaimini"
                ? "bg-amber-600 text-white shadow"
                : "text-amber-300 hover:text-white bg-amber-950/30 border border-amber-800/40"
            }`}
          >
            <span>📜 Jaimini Sutras (Complete)</span>
          </button>
          <button
            onClick={() => setDisplayMode("gayatri")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "gayatri"
                ? "bg-amber-500 text-white shadow"
                : "text-amber-300 hover:text-white bg-amber-950/30 border border-amber-800/40"
            }`}
          >
            <span>☀️ Gayatri Jyotish (गायत्री)</span>
          </button>
          <button
            onClick={() => setDisplayMode("alankara")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "alankara"
                ? "bg-amber-600 text-white shadow"
                : "text-amber-300 hover:text-white bg-amber-950/30 border border-amber-800/40"
            }`}
          >
            <span>🏛️ Jataka Alankara (Ganesh Kavi)</span>
          </button>
          <button
            onClick={() => setDisplayMode("nirnay")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "nirnay"
                ? "bg-indigo-600 text-white shadow"
                : "text-indigo-300 hover:text-white bg-indigo-950/30 border border-indigo-800/40"
            }`}
          >
            <span>📖 Jatak Nirnay (B.V. Raman 1 & 2)</span>
          </button>
          <button
            onClick={() => setDisplayMode("parijata")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "parijata"
                ? "bg-rose-600 text-white shadow"
                : "text-rose-300 hover:text-white bg-rose-950/30 border border-rose-800/40"
            }`}
          >
            <span>🌺 Jataka Parijata (Vaidyanatha 1–3)</span>
          </button>
          <button
            onClick={() => setDisplayMode("saravali")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === "saravali"
                ? "bg-amber-600 text-white shadow"
                : "text-amber-300 hover:text-white bg-amber-950/30 border border-amber-800/40"
            }`}
          >
            <span>📜 Saravali (Kalyana Varma)</span>
          </button>
        </div>
      </div>

      {/* Raman 12 Bhavas Judgement Deck View */}
      {displayMode === "judgement" && (
        <BhavaJudgementDeck />
      )}

      {/* Bhrigu Nandi Nadi & BSP Suite View */}
      {displayMode === "bhrigu" && (
        <BhriguNadiDeck />
      )}

      {/* K.N. Rao Karma, Rebirth & Purva Punya View */}
      {displayMode === "karma" && (
        <KarmaRebirthDeck />
      )}

      {/* K.N. Rao Double Transit (DTP) & PAC-DARES View */}
      {displayMode === "dtp" && (
        <DoubleTransitDeck />
      )}

      {/* K.N. Rao Timing of Marriage (Vivaha Kala) View */}
      {displayMode === "marriage" && (
        <MarriageTimingDeck />
      )}

      {/* K.N. Rao Advanced Predictive Techniques View */}
      {displayMode === "techniques" && (
        <KnRaoTechniquesDeck />
      )}

      {/* K.N. Rao & Naval Singh Planets & Education View */}
      {displayMode === "education" && (
        <EducationStreamDeck />
      )}

      {/* Parashari Multi-Dasha & Yogini Dasha View */}
      {displayMode === "dashas" && (
        <DashaSystemsDeck />
      )}

      {/* Primordial BPHS Classical Core View */}
      {displayMode === "bphs" && (
        <BphsCoreDeck />
      )}

      {/* Acharya Varahamihira Brihat Jataka View */}
      {displayMode === "jataka" && (
        <BrihatJatakaDeck />
      )}

      {/* Acharya Varahamihira Brihat Samhita View */}
      {displayMode === "samhita" && (
        <BrihatSamhitaDeck />
      )}

      {/* Deva Keralam / Chandra Kala Nadi View */}
      {displayMode === "keralam" && (
        <DevaKeralamDeck />
      )}

      {/* Doctrines of Suka Nadi View */}
      {displayMode === "suka" && (
        <SukaNadiDeck />
      )}

      {/* Maharshi Jaimini Upadesha Sutras View */}
      {displayMode === "jaimini" && (
        <JaiminiSutrasDeck />
      )}

      {/* Gayatri Jyotish View */}
      {displayMode === "gayatri" && (
        <GayatriJyotishDeck />
      )}

      {/* Jataka Alankara View */}
      {displayMode === "alankara" && (
        <JatakaAlankaraDeck />
      )}

      {/* Jatak Nirnay View */}
      {displayMode === "nirnay" && (
        <JatakNirnayDeck />
      )}

      {/* Jataka Parijata View */}
      {displayMode === "parijata" && (
        <JatakaParijataDeck />
      )}

      {/* Saravali View */}
      {displayMode === "saravali" && (
        <SaravaliDeck />
      )}

      {/* Hero House Leaderboard (1st to 12th Rank Cards) */}
      {displayMode !== "judgement" && displayMode !== "bhrigu" && displayMode !== "karma" && displayMode !== "dtp" && displayMode !== "marriage" && displayMode !== "techniques" && displayMode !== "education" && displayMode !== "dashas" && displayMode !== "bphs" && displayMode !== "jataka" && displayMode !== "samhita" && displayMode !== "keralam" && displayMode !== "suka" && displayMode !== "jaimini" && displayMode !== "gayatri" && displayMode !== "alankara" && displayMode !== "nirnay" && displayMode !== "parijata" && displayMode !== "saravali" && (
        <>
        <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>🏆</span>
            <span>12 House Potency Hierarchy (भाव क्रम Ranking)</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">
            Click any house to highlight on bar chart and view mathematical sub-factors
          </span>
        </div>

        <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 overflow-x-auto snap-scroll-x no-scrollbar gap-2.5 pb-1.5">
          {bhavaBalaResult.rankedHouses.map((h) => {
            const isSelected = activeHouseNum === h.houseNum;
            const rankBadge = getRankBadge(h.rank);
            const isStrong = h.isBalavan;

            return (
              <button
                key={h.houseNum}
                onClick={() => setActiveHouseNum(h.houseNum)}
                className={`snap-item min-w-[130px] sm:min-w-0 glass-panel p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900/90 border-amber-400 shadow-lg shadow-amber-500/20 scale-105"
                    : "bg-slate-950/70 hover:bg-slate-900/60 border-slate-800"
                }`}
              >
                {/* Header: Rank + House Number */}
                <div className="flex items-center justify-between w-full">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${rankBadge.color}`}>
                    {rankBadge.icon}
                  </span>
                  <span className="font-mono text-xs font-black text-amber-400">
                    House {h.houseNum}
                  </span>
                </div>

                {/* House Title & Cusp Sign */}
                <div>
                  <span className="font-extrabold text-xs text-slate-100 block truncate">
                    {h.sanskritName.split(" ")[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {h.rashi.symbol} {h.rashi.englishName} ({h.lordName})
                  </span>
                </div>

                {/* Rupas vs Required */}
                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  <div className="flex justify-between text-[10.5px] font-mono font-bold">
                    <span className={isStrong ? "text-emerald-400" : "text-rose-400"}>
                      {h.totalRupas.toFixed(2)} R
                    </span>
                    <span className="text-slate-500 font-normal">/ {h.requiredRupas.toFixed(1)} R</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        h.strengthRatio >= 1.4
                          ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                          : h.isBalavan
                          ? "bg-emerald-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.min(100, h.percentageEfficiency)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-[9px] font-bold font-mono text-amber-300">
                      {h.percentageEfficiency}%
                    </span>
                    <span
                      className={`text-[8px] font-black uppercase px-1 rounded ${
                        isStrong ? "bg-emerald-950 text-emerald-400" : "bg-rose-950 text-rose-400"
                      }`}
                    >
                      {isStrong ? "BALAVAN" : "WEAK"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Visual Bar Graph or Matrix Table (7 cols) + Selected House Deep Dive (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Bar Graph / Table View (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span>{displayMode === "table" ? "📋" : "📊"}</span>
              <span>
                {displayMode === "bars"
                  ? "Bhava Potency vs Required Kendra/Panapara/Apoklima Threshold (Bar Graph)"
                  : displayMode === "stacked"
                  ? "Stacked 4-Bala Composition Chart (All 12 Houses)"
                  : "Master Bhava Bala Matrix (Values in Rupas)"}
              </span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">1 Rupa = 60 Virupas</span>
          </div>

          {/* BAR GRAPH VIEW 1: Direct Comparative Bars for all 12 Houses */}
          {displayMode === "bars" && (
            <div className="space-y-4 pt-2">
              {/* Legend */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
                    <span>Balavan (Meets Required)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-rose-500 inline-block"></span>
                    <span>Deficient (Below Required)</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <span className="w-3 h-0.5 bg-amber-400 inline-block border-t border-dashed border-amber-400"></span>
                  <span>Required Threshold</span>
                </div>
              </div>

              {/* Bar Chart Canvas for 12 Houses */}
              <div className="h-64 flex items-end justify-between gap-1.5 sm:gap-2 px-2 pt-6 pb-2 bg-slate-900/60 rounded-xl border border-slate-800 relative">
                {/* Horizontal Grid lines */}
                {[0.25, 0.5, 0.75, 1.0].map((fraction) => {
                  const rVal = (maxRupas * fraction).toFixed(1);
                  return (
                    <div
                      key={fraction}
                      className="absolute left-0 right-0 border-b border-slate-800/60 flex items-center justify-end pr-2 text-[9px] font-mono text-slate-600 pointer-events-none"
                      style={{ bottom: `${fraction * 82}%` }}
                    >
                      <span>{rVal} R</span>
                    </div>
                  );
                })}

                {/* Display 12 houses in chronological H1..H12 order */}
                {Array.from({ length: 12 }, (_, i) => i + 1).map((hNum) => {
                  const h = bhavaBalaResult.houses[hNum];
                  const isSelected = activeHouseNum === h.houseNum;
                  const barHeightPercent = Math.min(100, (h.totalRupas / maxRupas) * 100);
                  const reqHeightPercent = Math.min(100, (h.requiredRupas / maxRupas) * 100);

                  return (
                    <button
                      key={h.houseNum}
                      onClick={() => setActiveHouseNum(h.houseNum)}
                      className={`flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer focus:outline-none ${
                        isSelected ? "scale-105" : "opacity-85 hover:opacity-100"
                      }`}
                    >
                      {/* Floating Rupa value */}
                      <span className="text-[9px] font-mono font-extrabold text-slate-200 mb-1 truncate">
                        {h.totalRupas.toFixed(1)}
                      </span>

                      {/* Bar Container */}
                      <div className="w-full max-w-[28px] h-[82%] flex items-end relative bg-slate-800/40 rounded-t-lg">
                        {/* Required Threshold Line Marker */}
                        <div
                          className="absolute left-0 right-0 border-t-2 border-dashed border-amber-400 z-10 pointer-events-none"
                          style={{ bottom: `${reqHeightPercent}%` }}
                          title={`Required: ${h.requiredRupas} Rupas`}
                        ></div>

                        {/* Actual Value Bar */}
                        <div
                          className={`w-full rounded-t-lg transition-all duration-300 ${
                            isSelected
                              ? "ring-2 ring-white shadow-lg shadow-amber-500/30"
                              : ""
                          } ${
                            h.isBalavan
                              ? "bg-gradient-to-t from-emerald-600 to-teal-400"
                              : "bg-gradient-to-t from-rose-600 to-amber-500"
                          }`}
                          style={{ height: `${barHeightPercent}%` }}
                        ></div>
                      </div>

                      {/* X-Axis Label: H1..H12 */}
                      <div className="mt-2 text-center">
                        <span className="font-extrabold text-[10px] text-amber-400 block leading-none">
                          H{h.houseNum}
                        </span>
                        <span className="text-[8px] text-slate-400 block mt-0.5 truncate">
                          {h.rashi.symbol}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* BAR GRAPH VIEW 2: Stacked 4-Bala Composition Chart */}
          {displayMode === "stacked" && (
            <div className="space-y-4 pt-2">
              {/* Stacked Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px] font-medium text-slate-300 p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-400"></span>
                  <span>Lord (Bhavaadhipati)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-sky-500"></span>
                  <span>Directional (Dig)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-purple-500"></span>
                  <span>Aspectual (Drishti)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500"></span>
                  <span>Day/Night Rising</span>
                </div>
              </div>

              {/* Stacked Bars Canvas */}
              <div className="h-64 flex items-end justify-between gap-1.5 sm:gap-2 px-2 pt-6 pb-2 bg-slate-900/60 rounded-xl border border-slate-800 relative">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((hNum) => {
                  const h = bhavaBalaResult.houses[hNum];
                  const isSelected = activeHouseNum === h.houseNum;
                  const lordR = h.bhavaadhipatiBala / 60;
                  const digR = h.bhavaDigBala / 60;
                  const drishtiR = Math.max(0, h.bhavaDrishtiBala / 60);
                  const dinaRatriR = h.bhavaDinaRatriBala / 60;

                  return (
                    <button
                      key={h.houseNum}
                      onClick={() => setActiveHouseNum(h.houseNum)}
                      className={`flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer focus:outline-none ${
                        isSelected ? "scale-105" : "opacity-85 hover:opacity-100"
                      }`}
                    >
                      <span className="text-[9px] font-mono font-extrabold text-amber-300 mb-1 truncate">
                        {h.totalRupas.toFixed(1)}
                      </span>

                      {/* Stacked Bar */}
                      <div
                        className={`w-full max-w-[28px] h-[82%] flex flex-col justify-end rounded-t-lg overflow-hidden ${
                          isSelected ? "ring-2 ring-white shadow-lg shadow-amber-500/30" : ""
                        }`}
                      >
                        <div
                          style={{ height: `${(dinaRatriR / maxRupas) * 100}%` }}
                          className="bg-emerald-500 w-full"
                          title={`Day/Night: ${dinaRatriR.toFixed(2)} R`}
                        ></div>
                        <div
                          style={{ height: `${(drishtiR / maxRupas) * 100}%` }}
                          className="bg-purple-500 w-full"
                          title={`Drishti: ${drishtiR.toFixed(2)} R`}
                        ></div>
                        <div
                          style={{ height: `${(digR / maxRupas) * 100}%` }}
                          className="bg-sky-500 w-full"
                          title={`Dig: ${digR.toFixed(2)} R`}
                        ></div>
                        <div
                          style={{ height: `${(lordR / maxRupas) * 100}%` }}
                          className="bg-amber-400 w-full rounded-t-sm"
                          title={`Lord: ${lordR.toFixed(2)} R`}
                        ></div>
                      </div>

                      <div className="mt-2 text-center">
                        <span className="font-extrabold text-[10px] text-amber-400 block leading-none">
                          H{h.houseNum}
                        </span>
                        <span className="text-[8px] text-slate-400 block mt-0.5 truncate">
                          {h.rashi.symbol}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* BAR GRAPH VIEW 3: Detailed Matrix Table */}
          {displayMode === "table" && (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                    <th className="p-2.5 font-bold sticky left-0 bg-slate-900/95 z-10">Bhava</th>
                    <th className="p-2.5">Sign & Lord</th>
                    <th className="p-2.5 text-center">Lord (R)</th>
                    <th className="p-2.5 text-center">Dig</th>
                    <th className="p-2.5 text-center">Drishti</th>
                    <th className="p-2.5 text-center">Day/Nt</th>
                    <th className="p-2.5 text-right font-bold text-amber-300">Total (R)</th>
                    <th className="p-2.5 text-right">Req.</th>
                    <th className="p-2.5 text-right">Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {bhavaBalaResult.rankedHouses.map((h) => {
                    const isSelected = activeHouseNum === h.houseNum;
                    return (
                      <tr
                        key={h.houseNum}
                        onClick={() => setActiveHouseNum(h.houseNum)}
                        className={`hover:bg-slate-900/60 cursor-pointer transition-colors ${
                          isSelected ? "bg-amber-500/15 font-bold" : ""
                        }`}
                      >
                        <td className="p-2.5 font-bold text-slate-200 sticky left-0 bg-slate-950/95 z-10 border-r border-slate-800/80">
                          <span className="text-amber-400 mr-1">H{h.houseNum}</span>
                          <span className="text-slate-300 font-normal">{h.sanskritName.split(" ")[0]}</span>
                        </td>
                        <td className="p-2.5 text-slate-400">
                          {h.rashi.symbol} {h.rashi.englishName.substring(0, 3)} ({h.lordName.substring(0, 2)})
                        </td>
                        <td className="p-2.5 text-center text-slate-300">
                          {(h.bhavaadhipatiBala / 60).toFixed(2)}
                        </td>
                        <td className="p-2.5 text-center text-slate-300">
                          {(h.bhavaDigBala / 60).toFixed(2)}
                        </td>
                        <td className="p-2.5 text-center text-slate-300">
                          {h.bhavaDrishtiBala >= 0
                            ? `+${(h.bhavaDrishtiBala / 60).toFixed(2)}`
                            : (h.bhavaDrishtiBala / 60).toFixed(2)}
                        </td>
                        <td className="p-2.5 text-center text-slate-300">
                          {(h.bhavaDinaRatriBala / 60).toFixed(2)}
                        </td>
                        <td className="p-2.5 text-right font-extrabold text-amber-300">
                          {h.totalRupas.toFixed(2)}
                        </td>
                        <td className="p-2.5 text-right text-slate-400">
                          {h.requiredRupas.toFixed(1)}
                        </td>
                        <td className="p-2.5 text-right font-bold">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              h.isBalavan
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-500/50"
                                : "bg-rose-950 text-rose-300 border border-rose-500/50"
                            }`}
                          >
                            {h.strengthRatio.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Selected House Deep Dive Breakdown (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl text-amber-400 font-bold">H{activeHouse.houseNum}</span>
                  <h3 className="font-extrabold text-base text-slate-100">
                    {activeHouse.name}
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-amber-400 font-mono block mt-0.5">
                  {activeHouse.sanskritName} • Rank #{activeHouse.rank} of 12 Houses
                </span>
              </div>

              <div className="text-right font-mono">
                <span className="text-base font-black text-amber-300 block">{activeHouse.totalRupas.toFixed(2)} R</span>
                <span className="text-[9px] text-slate-400 font-bold">{activeHouse.totalVirupas.toFixed(1)} Virupas</span>
              </div>
            </div>

            {/* Life Significations Card */}
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[9px] font-extrabold text-amber-400 uppercase tracking-wider block">
                📜 Life Department & Portfolios:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {activeHouse.significations}
              </p>
            </div>

            {/* Sub-factor Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-200 block">1. Bhavaadhipati Bala (House Lord)</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Lord {activeHouse.lordName} ({activeHouse.rashi.englishName} Sign Lord)
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-300">
                  {activeHouse.bhavaadhipatiBala.toFixed(1)} V ({(activeHouse.bhavaadhipatiBala / 60).toFixed(2)} R)
                </span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-200 block">2. Bhava Dig Bala (Directional)</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Sign biological orientation on house cusp
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-300">
                  {activeHouse.bhavaDigBala.toFixed(1)} V ({(activeHouse.bhavaDigBala / 60).toFixed(2)} R)
                </span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-200 block">3. Bhava Drishti Bala (Aspects)</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Net Vedic Drishti aspects received on house
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-300">
                  {activeHouse.bhavaDrishtiBala >= 0 ? `+${activeHouse.bhavaDrishtiBala}` : activeHouse.bhavaDrishtiBala} V ({(activeHouse.bhavaDrishtiBala / 60).toFixed(2)} R)
                </span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-200 block">4. Bhava Dina-Ratri Bala</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Shirshodaya/Prishtodaya diurnal rising
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-300">
                  {activeHouse.bhavaDinaRatriBala.toFixed(1)} V ({(activeHouse.bhavaDinaRatriBala / 60).toFixed(2)} R)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}