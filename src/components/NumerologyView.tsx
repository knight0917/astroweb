"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import {
  generateNumerologyReport,
  calculateNamank,
  NUMBER_PROFILES,
} from "../engine/numerology";
import {
  analyzeNameVibrationalEnergy,
  evaluateChartNameCongruence,
  SIGNATURE_NAME_RULES,
} from "../engine/lunarAstroNameEnergy";
import { calculatePlanetaryMaturationTimeline } from "../engine/planetaryAgeActivation";

export default function NumerologyView() {
  const { currentDate, location, ephemeris } = useAstroStore();
  const [userName, setUserName] = useState("Vedic Seeker");
  const [selectedProfileNumber, setSelectedProfileNumber] = useState<number | null>(null);
  const [activeSuiteTab, setActiveSuiteTab] = useState<"chaldean" | "lunar_astro">("chaldean");
  const [lunarName, setLunarName] = useState("Aniket");

  // Generate date report from current active date using observer timezone offset
  const report = useMemo(() => {
    return generateNumerologyReport(currentDate, location.timezoneOffsetHours);
  }, [currentDate, location.timezoneOffsetHours]);

  // Name calculation
  const nameData = useMemo(() => {
    return calculateNamank(userName);
  }, [userName]);

  // Lunar Astro Name Calculations
  const lunarProfile = useMemo(() => {
    return analyzeNameVibrationalEnergy(lunarName);
  }, [lunarName]);

  const lunarCongruence = useMemo(() => {
    return evaluateChartNameCongruence(lunarName, ephemeris);
  }, [lunarName, ephemeris]);

  const maturationReport = useMemo(() => {
    return calculatePlanetaryMaturationTimeline(ephemeris, currentDate);
  }, [ephemeris, currentDate]);

  // Check name compatibility with Mulank
  const mulankProfile = report.mulank.profile;
  const isNameFriendly = mulankProfile.friendlyNumbers.includes(nameData.chaldean.number);
  const isNameEnemy = mulankProfile.enemyNumbers.includes(nameData.chaldean.number);

  const activeProfile = selectedProfileNumber ? NUMBER_PROFILES[selectedProfileNumber] : mulankProfile;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Vedic Sankhya Shastra & Lunar Astro Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mulank & Chaldean Namank, Loshu Grid, plus Lunar Astro Name Vibrational Energy & Parashara Age Activation
          </p>
        </div>

        {/* Date Indicator */}
        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Calculated for Epoch
          </span>
          <span className="text-sm font-extrabold text-amber-300 font-mono">
            {report.day} / {report.month} / {report.year}
          </span>
        </div>
      </div>

      {/* Suite Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSuiteTab("chaldean")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSuiteTab === "chaldean"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10"
              : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <span>🔢 Chaldean & Vedic Sankhya</span>
        </button>
        <button
          onClick={() => setActiveSuiteTab("lunar_astro")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSuiteTab === "lunar_astro"
              ? "bg-gradient-to-r from-amber-500/25 to-yellow-500/25 text-amber-200 border border-amber-400/50 shadow-lg shadow-amber-500/10"
              : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <span>🪷 Lunar Astro Name Vibration & Age Activation</span>
          <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-amber-500/30 text-amber-300 font-mono font-bold">
            NEW
          </span>
        </button>
      </div>

      {activeSuiteTab === "chaldean" && (
        <>
          {/* Top 4 Core Numbers Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Mulank (Driver / Psychic) */}
        <div
          onClick={() => setSelectedProfileNumber(report.mulank.singleDigit)}
          className="glass-panel p-4 rounded-2xl border border-amber-500/40 bg-slate-950/85 shadow-xl hover:border-amber-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                मूलांक • Mulank (Driver)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold">
                Day {report.day}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div
                style={{ backgroundColor: `${report.mulank.profile.color}25`, borderColor: report.mulank.profile.color, color: report.mulank.profile.color }}
                className="w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-extrabold text-2xl font-mono shadow-inner group-hover:scale-105 transition-transform"
              >
                {report.mulank.singleDigit}
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-100 flex items-center gap-1">
                  <span>{report.mulank.profile.symbol}</span>
                  <span>{report.mulank.profile.sanskritPlanet}</span>
                </h4>
                <p className="text-xs text-amber-400 font-semibold">{report.mulank.profile.planet}</p>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                  Deity: {report.mulank.profile.deity.split("/")[0]}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Gem: {report.mulank.profile.gemstone.split("(")[0]}</span>
            <span className="text-amber-400 font-bold">View Profile →</span>
          </div>
        </div>

        {/* 2. Bhagyank (Conductor / Destiny) */}
        <div
          onClick={() => setSelectedProfileNumber(report.bhagyank.singleDigit)}
          className="glass-panel p-4 rounded-2xl border border-emerald-500/40 bg-slate-950/85 shadow-xl hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                भाग्यांक • Bhagyank (Destiny)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                Sum {report.bhagyank.totalSum}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div
                style={{ backgroundColor: `${report.bhagyank.profile.color}25`, borderColor: report.bhagyank.profile.color, color: report.bhagyank.profile.color }}
                className="w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-extrabold text-2xl font-mono shadow-inner group-hover:scale-105 transition-transform"
              >
                {report.bhagyank.singleDigit}
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-100 flex items-center gap-1">
                  <span>{report.bhagyank.profile.symbol}</span>
                  <span>{report.bhagyank.profile.sanskritPlanet}</span>
                </h4>
                <p className="text-xs text-emerald-400 font-semibold">{report.bhagyank.profile.planet}</p>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                  Element: {report.bhagyank.profile.element}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Lucky Day: {report.bhagyank.profile.luckyDays[0]}</span>
            <span className="text-emerald-400 font-bold">View Profile →</span>
          </div>
        </div>

        {/* 3. Chaldean Namank (Name Number) */}
        <div
          onClick={() => setSelectedProfileNumber(nameData.chaldean.number)}
          className="glass-panel p-4 rounded-2xl border border-purple-500/40 bg-slate-950/85 shadow-xl hover:border-purple-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                नामांक • Chaldean Namank
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                  isNameFriendly
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : isNameEnemy
                    ? "bg-rose-950 text-rose-300 border border-rose-800"
                    : "bg-slate-900 text-slate-400"
                }`}
              >
                {isNameFriendly ? "✦ Friendly" : isNameEnemy ? "⚠ Enemy" : "• Neutral"}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div className="w-14 h-14 rounded-2xl border-2 border-purple-500/80 bg-purple-500/20 text-purple-300 flex items-center justify-center font-extrabold text-2xl font-mono shadow-inner group-hover:scale-105 transition-transform">
                {nameData.chaldean.number}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-100 truncate max-w-[120px]">
                  {nameData.cleanName || "NAME"}
                </h4>
                <p className="text-xs text-purple-300 font-mono font-bold">
                  Raw Sum: {nameData.chaldean.rawTotal}
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Pythagorean: {nameData.pythagorean.number}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Soul Urge: {nameData.soulUrge.number}</span>
            <span className="text-purple-300 font-bold">Inspect Name →</span>
          </div>
        </div>

        {/* 4. Kua & Personal Year */}
        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/40 bg-slate-950/85 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Kua & Personal Year
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                Yr {report.year}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                <span className="text-[9px] text-slate-500 font-bold block uppercase">Kua (Male / Fem)</span>
                <span className="text-lg font-extrabold text-cyan-300 font-mono">
                  {report.kuaNumberMale} <span className="text-xs text-slate-500 font-normal">/</span> {report.kuaNumberFemale}
                </span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                <span className="text-[9px] text-slate-500 font-bold block uppercase">Personal Year</span>
                <span className="text-lg font-extrabold text-amber-300 font-mono">
                  {report.personalYear}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400 text-center">
            Harmonic Year Transit Cycle
          </div>
        </div>
      </div>

      {/* Main Grid: 3x3 Loshu Grid + Interactive Name & Profile Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3x3 Loshu Grid & 8 Planes of Fortune (6 cols) */}
        <div className="lg:col-span-6 glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <span>🀄</span>
                <span>3x3 Loshu Grid (लोशू चक्र)</span>
              </h3>
              <p className="text-[10px] text-slate-400">Classical magic square populated from DOB & destiny digits</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold font-mono">
              3x3 Matrix
            </span>
          </div>

          {/* 3x3 Visual Loshu Grid Box */}
          <div className="max-w-[340px] w-full mx-auto grid grid-cols-3 gap-2.5 bg-slate-900/90 p-3 rounded-2xl border-2 border-amber-500/40 shadow-2xl">
            {[
              { num: 4, pos: "Mental • Wood" },
              { num: 9, pos: "Fame • Fire" },
              { num: 2, pos: "Marriage • Earth" },
              { num: 3, pos: "Family • Wood" },
              { num: 5, pos: "Center • Earth" },
              { num: 7, pos: "Children • Metal" },
              { num: 8, pos: "Knowledge • Earth" },
              { num: 1, pos: "Career • Water" },
              { num: 6, pos: "Helpers • Metal" },
            ].map((cell) => {
              const count = report.loshu.grid[cell.num] || 0;
              const isPresent = count > 0;
              const profile = NUMBER_PROFILES[cell.num];

              return (
                <div
                  key={cell.num}
                  onClick={() => setSelectedProfileNumber(cell.num)}
                  style={{
                    borderColor: isPresent ? profile.color : undefined,
                    backgroundColor: isPresent ? `${profile.color}15` : undefined,
                  }}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-2 transition-all cursor-pointer group hover:scale-105 ${
                    isPresent
                      ? "border-amber-500/60 shadow-lg"
                      : "border-slate-800/80 bg-slate-950/60 opacity-40 hover:opacity-80"
                  }`}
                >
                  <span className="text-[9px] text-slate-400 font-mono">{cell.num}</span>
                  <div className="flex items-center gap-1 my-0.5">
                    {isPresent ? (
                      Array.from({ length: count }).map((_, idx) => (
                        <span
                          key={idx}
                          style={{ color: profile.color }}
                          className="font-extrabold text-lg sm:text-xl font-mono leading-none"
                        >
                          {cell.num}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-600 font-mono text-base">-</span>
                    )}
                  </div>
                  <span className="text-[8px] text-slate-400 truncate max-w-full text-center">
                    {cell.pos.split("•")[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 8 Planes of Fortune Analysis */}
          <div className="space-y-3 pt-2">
            <h4 className="font-extrabold text-xs text-amber-400 uppercase tracking-wider">
              8 Arrows & Planes of Fortune (योग एवं स्तर)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {report.loshu.planes.map((plane) => {
                const isComplete = plane.status === "complete";
                const isPartial = plane.status === "partial";

                return (
                  <div
                    key={plane.name}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isComplete
                        ? "bg-emerald-950/40 border-emerald-500/60 shadow"
                        : isPartial
                        ? "bg-slate-900/60 border-slate-800"
                        : "bg-slate-950/40 border-slate-900 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-200">{plane.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                          isComplete
                            ? "bg-emerald-500 text-slate-950"
                            : isPartial
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-slate-900 text-slate-500"
                        }`}
                      >
                        {plane.numbers.join("-")} • {plane.percentage}%
                      </span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 mt-1 line-clamp-2">{plane.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Missing Numbers Remedies */}
          {report.loshu.missingNumbers.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <h4 className="font-extrabold text-xs text-amber-400 flex items-center gap-1.5">
                <span>🛡️</span>
                <span>Missing Numbers & Vedic Remedies</span>
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300">
                {report.loshu.remedies
                  .filter((r) => r.missing)
                  .map((r) => (
                    <div key={r.number} className="flex items-start gap-2 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                      <span className="w-5 h-5 rounded bg-amber-500 text-slate-950 font-mono font-extrabold flex items-center justify-center text-xs flex-shrink-0">
                        {r.number}
                      </span>
                      <div className="text-[11px]">
                        <span className="font-bold text-slate-200">Missing {r.element}: </span>
                        <span className="text-slate-400">{r.remedy}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Interactive Name Numerology & Active Number Profile (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Interactive Name Numerology Card */}
          <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <span>✍️</span>
                  <span>Interactive Name Numerology (नामांक)</span>
                </h3>
                <p className="text-[10px] text-slate-400">Type any name to compute Chaldean & Pythagorean vibrations</p>
              </div>
            </div>

            {/* Name Input Field */}
            <div className="flex gap-2">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter Full Name (e.g. Narendra Modi, Steve Jobs)..."
                className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 font-bold placeholder-slate-500"
              />
              <button
                onClick={() => setUserName("Vedic Seeker")}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Letter Breakdown Table */}
            {nameData.letterBreakdown.length > 0 && (
              <div className="overflow-x-auto custom-scrollbar border border-slate-800 rounded-xl bg-slate-900/50 p-2">
                <div className="flex gap-1.5 min-w-max pb-1">
                  {nameData.letterBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col items-center justify-center p-1.5 rounded-lg border w-9 text-center font-mono ${
                        item.isVowel
                          ? "bg-purple-950/60 border-purple-700/80 text-purple-200"
                          : "bg-slate-950 border-slate-800 text-slate-300"
                      }`}
                    >
                      <span className="text-xs font-extrabold">{item.letter}</span>
                      <span className="text-[9px] text-amber-400 mt-0.5">{item.chaldean}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Name Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
              <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/60 text-center">
                <span className="text-[9px] text-purple-300 uppercase font-bold block">Chaldean</span>
                <span className="text-xl font-extrabold text-purple-200">{nameData.chaldean.number}</span>
                <span className="text-[8px] text-slate-400 block">Sum {nameData.chaldean.rawTotal}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Pythagorean</span>
                <span className="text-xl font-extrabold text-slate-100">{nameData.pythagorean.number}</span>
                <span className="text-[8px] text-slate-500 block">Sum {nameData.pythagorean.rawTotal}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Soul Urge</span>
                <span className="text-xl font-extrabold text-amber-300">{nameData.soulUrge.number}</span>
                <span className="text-[8px] text-slate-500 block">Vowels</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Personality</span>
                <span className="text-xl font-extrabold text-cyan-300">{nameData.personality.number}</span>
                <span className="text-[8px] text-slate-500 block">Consonants</span>
              </div>
            </div>
          </div>

          {/* Active Number Detailed Profile Card */}
          <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: `${activeProfile.color}25`, borderColor: activeProfile.color, color: activeProfile.color }}
                  className="w-12 h-12 rounded-xl border-2 flex items-center justify-center font-extrabold text-2xl font-mono shadow-inner"
                >
                  {activeProfile.number}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-1.5">
                    <span>{activeProfile.symbol}</span>
                    <span>Number {activeProfile.number} • {activeProfile.sanskritPlanet} ({activeProfile.planet})</span>
                  </h3>
                  <span className="text-xs text-amber-400 font-medium">
                    Deity: {activeProfile.deity} • Element: {activeProfile.element}
                  </span>
                </div>
              </div>

              {/* Fast Number Selector */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSelectedProfileNumber(n)}
                    className={`w-6 h-6 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeProfile.number === n
                        ? "bg-amber-500 text-slate-950 font-extrabold shadow"
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Insights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  ✨ Core Strengths & Traits
                </span>
                <p className="text-slate-300">{activeProfile.traits.join(" • ")}</p>
                <div className="pt-1.5 space-y-0.5 text-slate-400 text-[11px]">
                  {activeProfile.strengths.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                  ⚠️ Potential Challenges
                </span>
                <div className="pt-1 space-y-0.5 text-slate-400 text-[11px]">
                  {activeProfile.challenges.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="text-rose-400">✗</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Compatibility & Lucky Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono pt-1">
              <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/60">
                <span className="text-[9px] text-emerald-400 font-bold uppercase block">Friendly Numbers</span>
                <span className="text-sm font-bold text-emerald-200">{activeProfile.friendlyNumbers.join(", ")}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/60">
                <span className="text-[9px] text-rose-400 font-bold uppercase block">Enemy Numbers</span>
                <span className="text-sm font-bold text-rose-200">
                  {activeProfile.enemyNumbers.length > 0 ? activeProfile.enemyNumbers.join(", ") : "None (Friend to All)"}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-amber-400 font-bold uppercase block">Lucky Gemstone</span>
                <span className="text-xs font-bold text-slate-200 truncate block">{activeProfile.gemstone}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Lucky Days: <strong className="text-slate-200">{activeProfile.luckyDays.join(", ")}</strong></span>
              <span>Lucky Colors: <strong className="text-slate-200">{activeProfile.luckyColors.join(", ")}</strong></span>
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      {/* LUNAR ASTRO & PARASHARA MATURATION AGE SUITE */}
      {activeSuiteTab === "lunar_astro" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Interactive Name Profiler Input Card */}
          <div className="glass-panel p-5 md:p-6 rounded-2xl border border-amber-500/30 bg-slate-950/90 shadow-2xl flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
                  Acoustic Astro-Phonetics Engine
                </span>
                <h3 className="text-lg md:text-xl font-bold text-slate-100">
                  Lunar Astro Name Vibrational Profiler (Deepanshu Giri)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Test any name to decode its planetary frequency, psychological temperament, relationship patterns, and predicted chart placements.
                </p>
              </div>

              {/* Input Control */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={lunarName}
                  onChange={(e) => setLunarName(e.target.value)}
                  placeholder="Enter any name..."
                  className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-400 w-48 sm:w-56"
                />
              </div>
            </div>

            {/* Quick Preset Buttons from Lecture */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-500 font-medium">Lecture Presets:</span>
              {["Aniket", "Ravi", "Priyanka", "Sonal", "Alok", "Sachin", "Kulwinder", "Manpreet"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setLunarName(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    lunarName.toLowerCase() === preset.toLowerCase()
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Primary Graha */}
            <div className="glass-panel p-4 rounded-2xl border border-amber-500/40 bg-slate-950/85 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  Primary Planetary Frequency
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-amber-200">
                    {lunarProfile.primaryPlanets.join(" + ")}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Secondary: <strong className="text-slate-200">{lunarProfile.secondaryPlanets.join(", ")}</strong>
                </p>
              </div>
              <span className="text-[10px] text-slate-500 mt-2 font-mono">
                Akshara Seed: {lunarName.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Acoustic Archetype */}
            <div className="glass-panel p-4 rounded-2xl border border-cyan-500/40 bg-slate-950/85 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400 block tracking-wider">
                  Acoustic Archetype
                </span>
                <span className="text-sm font-bold text-cyan-200 line-clamp-2 mt-1 block">
                  {lunarProfile.archetypeName}
                </span>
                <div className="mt-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      lunarProfile.ancestralShieldStatus
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {lunarProfile.ancestralShieldStatus ? "🛡️ Lineage Shield Active" : "Individual Karma"}
                  </span>
                </div>
              </div>
            </div>

            {/* Chart-to-Name Congruence */}
            <div className="glass-panel p-4 rounded-2xl border border-purple-500/40 bg-slate-950/85 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-400 block tracking-wider">
                  Natal Chart Congruence
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-purple-200 font-mono">
                    {lunarCongruence.congruenceScore}%
                  </span>
                  <span className="text-xs font-bold text-purple-300">
                    {lunarCongruence.harmonyStatus}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${lunarCongruence.congruenceScore}%` }}
                  />
                </div>
              </div>
              <span className="text-[10px] text-slate-400 mt-2 truncate block">
                {lunarCongruence.resonanceWithLagnaLord}
              </span>
            </div>

            {/* Parashara Age Milestone */}
            <div className="glass-panel p-4 rounded-2xl border border-emerald-500/40 bg-slate-950/85 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                  Parashari Maturation (Age {maturationReport.currentAge})
                </span>
                <span className="text-xl font-black text-emerald-200 mt-1 block">
                  {maturationReport.activeMilestone.planet} (Age {maturationReport.activeMilestone.startAge}–{maturationReport.activeMilestone.endAge})
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  Status: <strong className={maturationReport.activeMilestone.isRetrograde ? "text-rose-400" : "text-emerald-300"}>
                    {maturationReport.activeMilestone.isRetrograde ? "VAKRI (RETROGRADE)" : "Direct"}
                  </strong>
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-2">
                BPHS Ch. 45 Naisargika Vayas
              </span>
            </div>
          </div>

          {/* CRITICAL RETROGRADE SATURN AGE 36 ALERT BANNER */}
          {maturationReport.isRetrogradeSaturnActive && (
            <div className="p-4 md:p-5 rounded-2xl bg-rose-950/40 border border-rose-500/50 shadow-2xl flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h4 className="text-sm md:text-base font-bold text-rose-200">
                  Critical Lunar Astro Alert: Retrograde Saturn Maturation Window Active (Age 36–42)
                </h4>
                <p className="text-xs text-rose-300/90 mt-1 leading-relaxed">
                  Per Deepanshu Giri, when natal Saturn is retrograde, reaching age 36 triggers the <strong>Great Karmic Inversion</strong>. Unlike direct Saturn which brings steady structural promotion, Retrograde Saturn triggers sudden disruptions, career overhauls, bold rejections of institutional orthodoxy, and an unavoidable settlement of unfulfilled past-life obligations. Reassure yourself that unexpected disruptions are not failures; they are cosmic realignments freeing you from stale obligations.
                </p>
                <div className="mt-2 text-xs text-rose-400 font-semibold flex items-center gap-2">
                  <span>🕊️ Prescribed Upaya:</span>
                  <span className="text-slate-200">Mahamrityunjaya Mantra & selfless service to laborers / disabled elders.</span>
                </div>
              </div>
            </div>
          )}

          {/* Detailed 3-Column Diagnostic & Predicted Chart Placements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 1. Psychological Blueprint */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🧠</span>
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Psychological Blueprint
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lunarProfile.psychologicalBlueprint}
              </p>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-amber-400 block uppercase text-[10px]">
                  Karmic Growth Challenge
                </span>
                <p>{lunarProfile.karmicChallenge}</p>
              </div>
            </div>

            {/* 2. Relationship Dynamics */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-base">💍</span>
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Relationship Dynamics & Karmic Bonds
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lunarProfile.relationshipTendency}
              </p>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-cyan-400 block uppercase text-[10px]">
                  Moon & 7th House Acoustic Audit
                </span>
                <p>{lunarCongruence.resonanceWithMoon}</p>
                <p>{lunarCongruence.resonanceWith7thHouse}</p>
              </div>
            </div>

            {/* 3. Career & Predicted Chart Placements */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-base">💼</span>
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Career Vector & Predicted Chart Placements
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lunarProfile.careerAndServiceVector}
              </p>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-300 space-y-1.5">
                <span className="font-bold text-amber-300 block uppercase text-[10px]">
                  Predicted Natal Placements (Horoscope-Free)
                </span>
                {lunarProfile.predictedChartPlacements.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 text-xs">✦</span>
                    <span className="text-slate-300">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chronological Planetary Maturation Age Grid (BPHS Ch. 45) */}
          <div className="glass-panel p-5 md:p-6 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
                  Parashari Timeline
                </span>
                <h4 className="text-base font-bold text-slate-100">
                  9 Planetary Maturation Ages & Natural Activation Lifecycles
                </h4>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Current Age: <strong className="text-amber-300 font-bold">{maturationReport.currentAge} Years</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {maturationReport.allMilestones.map((m) => {
                const isCurrent = m.isActiveNow;
                return (
                  <div
                    key={m.planet}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isCurrent
                        ? "bg-amber-500/10 border-amber-400/60 shadow-lg shadow-amber-500/5 ring-1 ring-amber-400/30"
                        : m.isPast
                        ? "bg-slate-900/40 border-slate-800/60 opacity-70"
                        : "bg-slate-900/70 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{m.planet}</span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                          isCurrent
                            ? "bg-amber-500 text-slate-950"
                            : m.isPast
                            ? "bg-slate-800 text-slate-500"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {isCurrent ? "ACTIVE NOW" : m.isPast ? "PAST" : "UPCOMING"}
                      </span>
                    </div>

                    <div className="text-xs text-amber-300/90 font-mono mt-1">
                      Age {m.startAge} to {m.endAge} Yrs (Peak: Age {m.peakAge})
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                      {m.isRetrograde ? m.retrogradeInversionManifestation : m.standardManifestation}
                    </p>

                    <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/80 mt-2">
                      Remedy: <span className="text-slate-400">{m.shastricRemedy.split(";")[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vak Siddhi & Botanical Living Remedy Protocol */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vak Siddhi / Intuition Card */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                Vak Siddhi & Astrological Intuition (Deepanshu Giri)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Astrological rules operate at 50% capacity; the remaining 50% requires speech intuition (<em>Vak Siddhi</em>). Reciting the Gayatri Mantra at Brahma Muhurta (4:30 AM) awakens the solar Pingala Nadi and grants clear sight into chart root karmas.
              </p>
            </div>

            {/* Botanical Tree Remedy */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                Living Botanical Parihara (Kadali Vriksha / Banana Tree)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                For Jupiterian afflictions, progeny delays, or 5th house blockages: plant and personally water a sacred Banana Tree (<em>Kadali Vriksha</em>) every Thursday. Nurturing a living entity dissolves hard karmic knots far more reliably than commercial stones.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}