"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import {
  generateNumerologyReport,
  calculateNamank,
  NUMBER_PROFILES,
} from "../engine/numerology";

export default function NumerologyView() {
  const { currentDate, location } = useAstroStore();
  const [userName, setUserName] = useState("Vedic Seeker");
  const [selectedProfileNumber, setSelectedProfileNumber] = useState<number | null>(null);

  // Generate date report from current active date
  const report = useMemo(() => {
    return generateNumerologyReport(currentDate);
  }, [currentDate]);

  // Name calculation
  const nameData = useMemo(() => {
    return calculateNamank(userName);
  }, [userName]);

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
            <span className="text-2xl text-amber-400">🔢</span>
            <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Vedic Sankhya Shastra & Chaldean Numerology
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mulank (Driver), Bhagyank (Destiny), Chaldean Namank, 3x3 Loshu Grid & 8 Planes of Fortune
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

      {/* Top 4 Core Numbers Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
    </div>
  );
}