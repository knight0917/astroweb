"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAstroStore } from "../store/useAstroStore";
import {
  calculateTithiBirthday,
  findTithiOccurrenceInYear,
  TithiBirthdayResult,
  NextTithiOccurrence,
} from "../engine/tithiBirthday";

export default function TithiBirthdayView() {
  const { currentDate, location, ayanamsha } = useAstroStore();

  // Live countdown ticker
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate Vedic Tithi Birthday directly from the global active Birth Details
  const result: TithiBirthdayResult = useMemo(() => {
    return calculateTithiBirthday(currentDate, location, ayanamsha, now);
  }, [currentDate, location, ayanamsha, now]);

  // Selected year for viewing (defaults to next upcoming birthday year)
  const [selectedYear, setSelectedYear] = useState<number>(result.nextBirthday.year);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  // Keep selectedYear synced if active birth date changes
  useEffect(() => {
    setSelectedYear(result.nextBirthday.year);
  }, [result.nextBirthday.year]);

  // Calculate the specific occurrence for the selected year
  const activeOccurrence: NextTithiOccurrence = useMemo(() => {
    const occ = findTithiOccurrenceInYear(currentDate, selectedYear, location, ayanamsha, now);
    return occ || result.nextBirthday;
  }, [currentDate, selectedYear, location, ayanamsha, now, result.nextBirthday]);

  // Formatted local date & time for the active birth profile
  const tzMs = location.timezoneOffsetHours * 3600 * 1000;
  const localBirthDate = new Date(currentDate.getTime() + tzMs);
  const formattedBirthDate = localBirthDate.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  const formattedBirthTime = localBirthDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

  // Countdown / Elapsed calculations for the active occurrence
  const targetMs = activeOccurrence.exactMoment.getTime();
  const isPast = targetMs < now.getTime();
  const msDiff = Math.abs(targetMs - now.getTime());
  const countdownDays = Math.floor(msDiff / (1000 * 60 * 60 * 24));
  const countdownHours = Math.floor((msDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const countdownMinutes = Math.floor((msDiff % (1000 * 60 * 60)) / (1000 * 60));
  const countdownSeconds = Math.floor((msDiff % (1000 * 60)) / 1000);

  const birthYear = localBirthDate.getUTCFullYear();
  const availableYears = useMemo(() => {
    const years: number[] = [];
    for (let y = Math.max(1900, birthYear); y <= now.getFullYear() + 15; y++) {
      years.push(y);
    }
    return years;
  }, [birthYear, now]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl text-amber-400">🎂</span>
            <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Vedic Tithi Birthday & Tithi Pravesha (तिथि जन्मदिन)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Authentic Vedic Birthday calculated on recurring Lunar Month (Masa), Paksha, and exact Solar-Lunar Tithi angle
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300">
          <span>✨</span>
          <span>Synced with Active Birth Profile</span>
        </div>
      </div>

      {/* Main Grid: Left Birth Profile Summary, Right Hero Countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Birth Profile & Vedic Tithi Details (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">👤</span>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
                  Active Birth Profile
                </h3>
                <p className="text-[10px] text-slate-400">
                  Entered in the top control bar
                </p>
              </div>
            </div>
            <span className="text-[10.5px] text-amber-400 font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              Vedic Epoch
            </span>
          </div>

          {/* Quick Active Birth Coordinates & Time Box */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2.5 text-xs">
            <div className="flex items-start justify-between gap-2">
              <span className="text-slate-400 flex items-center gap-1">
                <span>📍</span>
                <span>Birth Place:</span>
              </span>
              <div className="text-right">
                <span className="font-extrabold text-slate-100 block">
                  {location.cityName}{location.country ? `, ${location.country}` : ""}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {Math.abs(location.latitude).toFixed(2)}° {location.latitude >= 0 ? "N" : "S"},{" "}
                  {Math.abs(location.longitude).toFixed(2)}° {location.longitude >= 0 ? "E" : "W"} (UTC
                  {location.timezoneOffsetHours >= 0
                    ? `+${location.timezoneOffsetHours}`
                    : location.timezoneOffsetHours}
                  )
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-slate-400">
                Birth Date:
              </span>
              <span className="font-extrabold text-amber-300 font-mono">
                {formattedBirthDate}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">
                Birth Time:
              </span>
              <span className="font-extrabold text-slate-200 font-mono">
                {formattedBirthTime}
              </span>
            </div>
          </div>

          {/* Calculated Vedic Birth Tithi Card */}
          <div className="pt-2 space-y-2.5">
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
              <span>🌙</span>
              <span>Your Vedic Janma Tithi Details</span>
            </span>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Vedic Lunar Month:</span>
                <span className="font-bold text-amber-300">
                  {result.birthDetails.masaName} ({result.birthDetails.masaHindi})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Paksha (Fortnight):</span>
                <span className="font-bold text-slate-100">
                  {result.birthDetails.paksha} Paksha (
                  {result.birthDetails.paksha === "Shukla" ? "शुक्ल पक्ष / Waxing" : "कृष्ण पक्ष / Waning"})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Birth Tithi:</span>
                <span className="font-extrabold text-emerald-400 font-mono">
                  {result.birthDetails.tithiName} (Tithi #{result.birthDetails.tithiIndex})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tithi Deity (तिथि देवता):</span>
                <span className="font-bold text-purple-300">
                  {result.birthDetails.tithiDeity}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Moon-Sun Angle:</span>
                <span className="font-mono text-slate-300">
                  {result.birthDetails.moonSunAngleAtBirth}°
                </span>
              </div>
            </div>
          </div>

          <p className="text-[10.5px] text-slate-500 leading-relaxed italic text-center pt-1">
            💡 To evaluate another person's Vedic Birthday, simply change the Date, Time, or Place in the top bar.
          </p>
        </div>

        {/* Right Column: Dynamic Year Birthday Hero & Countdown (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Hero Card with Year Switcher & Dynamic Tithi Birthday */}
          <div
            className={`glass-panel p-6 rounded-2xl border-2 shadow-2xl space-y-5 relative overflow-hidden transition-all duration-300 ${
              isPast
                ? "border-indigo-500/60 bg-gradient-to-b from-indigo-950/40 via-slate-950/90 to-slate-950/95"
                : "border-amber-500/60 bg-gradient-to-b from-amber-950/40 via-slate-950/90 to-slate-950/95"
            }`}
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl pointer-events-none select-none">
              {isPast ? "🕰️" : "🎂"}
            </div>

            {/* Header: Title + Year Stepper */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider block ${
                    isPast ? "text-indigo-400" : "text-amber-400"
                  }`}
                >
                  {isPast
                    ? "Past Vedic Janmadin (गत वर्ष तिथि जन्मदिन)"
                    : "Upcoming Vedic Janmadin (आगामी तिथि जन्मदिन)"}
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-100 mt-0.5">
                  {activeOccurrence.formattedDate}
                </h3>
              </div>

              {/* Year Navigation Bar */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80">
                <button
                  onClick={() => setSelectedYear((y) => Math.max(birthYear, y - 1))}
                  title="Previous Year Birthday"
                  className="px-2.5 py-1 text-xs font-bold text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition"
                >
                  ◀ Prev
                </button>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-slate-950 text-amber-300 text-xs font-extrabold font-mono px-2.5 py-1 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
                >
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      Year {y} {y === result.nextBirthday.year ? "(Upcoming)" : y === result.lastBirthday.year ? "(Last Year)" : ""}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setSelectedYear((y) => y + 1)}
                  title="Next Year Birthday"
                  className="px-2.5 py-1 text-xs font-bold text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition"
                >
                  Next ▶
                </button>
              </div>
            </div>

            {/* Quick Year Jump Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Quick Jump:</span>
              <button
                onClick={() => setSelectedYear(result.lastBirthday.year)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                  selectedYear === result.lastBirthday.year
                    ? "bg-indigo-600 text-white border-indigo-400"
                    : "bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800"
                }`}
              >
                ⏪ Last Year ({result.lastBirthday.year})
              </button>
              <button
                onClick={() => setSelectedYear(result.nextBirthday.year)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                  selectedYear === result.nextBirthday.year
                    ? "bg-amber-500 text-slate-950 font-extrabold border-amber-400 shadow-md"
                    : "bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800"
                }`}
              >
                🎂 Next Upcoming ({result.nextBirthday.year})
              </button>
              {birthYear !== selectedYear && (
                <button
                  onClick={() => setSelectedYear(birthYear)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900/80 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-slate-200 transition"
                >
                  🌟 Birth Year ({birthYear})
                </button>
              )}
            </div>

            {/* Countdown / Elapsed Clock Grid */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                {isPast ? "⏳ Elapsed Since Tithi Birthday:" : "⏳ Time Remaining to Tithi Birthday:"}
              </span>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div
                  className={`p-3 rounded-xl border shadow ${
                    isPast
                      ? "bg-slate-900/90 border-indigo-500/40"
                      : "bg-slate-900/90 border-amber-500/40"
                  }`}
                >
                  <span
                    className={`text-2xl md:text-3xl font-extrabold font-mono block ${
                      isPast ? "text-indigo-300" : "text-amber-300"
                    }`}
                  >
                    {countdownDays}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">
                    {isPast ? "Days Ago" : "Days"}
                  </span>
                </div>
                <div
                  className={`p-3 rounded-xl border shadow ${
                    isPast
                      ? "bg-slate-900/90 border-indigo-500/40"
                      : "bg-slate-900/90 border-amber-500/40"
                  }`}
                >
                  <span
                    className={`text-2xl md:text-3xl font-extrabold font-mono block ${
                      isPast ? "text-indigo-300" : "text-amber-300"
                    }`}
                  >
                    {countdownHours}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Hours</span>
                </div>
                <div
                  className={`p-3 rounded-xl border shadow ${
                    isPast
                      ? "bg-slate-900/90 border-indigo-500/40"
                      : "bg-slate-900/90 border-amber-500/40"
                  }`}
                >
                  <span
                    className={`text-2xl md:text-3xl font-extrabold font-mono block ${
                      isPast ? "text-indigo-300" : "text-amber-300"
                    }`}
                  >
                    {countdownMinutes}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Mins</span>
                </div>
                <div
                  className={`p-3 rounded-xl border shadow ${
                    isPast
                      ? "bg-slate-900/90 border-indigo-500/40"
                      : "bg-slate-900/90 border-amber-500/40"
                  }`}
                >
                  <span
                    className={`text-2xl md:text-3xl font-extrabold font-mono block ${
                      isPast ? "text-indigo-300" : "text-amber-300"
                    }`}
                  >
                    {countdownSeconds}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Secs</span>
                </div>
              </div>
            </div>

            {/* Astronomical Tithi Window Details for this year */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Observance Tithi:</span>
                <span className="font-extrabold text-amber-300 font-mono">
                  {activeOccurrence.masaName} {activeOccurrence.paksha} {activeOccurrence.tithiName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tithi Starts:</span>
                <span className="font-mono text-slate-200">
                  {new Date(
                    activeOccurrence.tithiStart.getTime() + location.timezoneOffsetHours * 3600 * 1000
                  ).toLocaleString("en-US", { timeZone: "UTC" })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tithi Ends:</span>
                <span className="font-mono text-slate-200">
                  {new Date(
                    activeOccurrence.tithiEnd.getTime() + location.timezoneOffsetHours * 3600 * 1000
                  ).toLocaleString("en-US", { timeZone: "UTC" })}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">Exact Solar-Lunar Return Epoch:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {new Date(
                    activeOccurrence.exactMoment.getTime() + location.timezoneOffsetHours * 3600 * 1000
                  ).toLocaleString("en-US", { timeZone: "UTC" })}
                </span>
              </div>
            </div>
          </div>

          {/* Multi-Year Vedic Birthday Table with Upcoming / Past Tabs */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">
                Vedic Birthday Calendar Archive
              </h4>

              {/* Tabs: Upcoming vs Past */}
              <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                    activeTab === "upcoming"
                      ? "bg-amber-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Upcoming (5 Yrs)
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                    activeTab === "past"
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Past Archive (5 Yrs)
                </button>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                    <th className="p-2.5 font-bold">Year</th>
                    <th className="p-2.5">Gregorian Date & Day</th>
                    <th className="p-2.5">Vedic Lunar Tithi</th>
                    <th className="p-2.5 text-right">
                      {activeTab === "upcoming" ? "Time Remaining" : "Time Elapsed"}
                    </th>
                    <th className="p-2.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {(activeTab === "upcoming" ? result.upcomingBirthdays : result.pastBirthdays).map(
                    (b) => {
                      const isSelected = selectedYear === b.year;
                      return (
                        <tr
                          key={b.year}
                          onClick={() => setSelectedYear(b.year)}
                          className={`cursor-pointer transition hover:bg-slate-900/70 ${
                            isSelected
                              ? activeTab === "upcoming"
                                ? "bg-amber-500/15 font-bold border-l-4 border-amber-400"
                                : "bg-indigo-500/15 font-bold border-l-4 border-indigo-400"
                              : ""
                          }`}
                        >
                          <td className="p-2.5 text-amber-400 font-extrabold">{b.year}</td>
                          <td className="p-2.5 text-slate-100">{b.formattedDate}</td>
                          <td className="p-2.5 text-slate-300">
                            {b.masaName} {b.paksha} {b.tithiName}
                          </td>
                          <td
                            className={`p-2.5 text-right font-bold ${
                              activeTab === "upcoming" ? "text-amber-300" : "text-indigo-300"
                            }`}
                          >
                            {b.daysRemaining} days {activeTab === "past" ? "ago" : `(${b.hoursRemaining}h)`}
                          </td>
                          <td className="p-2.5 text-center">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                isSelected
                                  ? "bg-amber-500 text-slate-950 font-extrabold"
                                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                              }`}
                            >
                              {isSelected ? "Active" : "View"}
                            </span>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Vedic Birthday Sankalpa, Puja & Rituals Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <span className="text-xl text-amber-400">🕉️</span>
          <h3 className="font-extrabold text-sm md:text-base text-slate-100 uppercase tracking-wider">
            Vedic Birthday Vidhi & Sacred Remedies (जन्मदिन वैदिक संकल्प एवं पूजा विधान)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>🙏</span>
              <span>1. Tithi Devata Puja</span>
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.vedicRituals.deityWorship}
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>📿</span>
              <span>2. Sacred Japa & Chanting</span>
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.vedicRituals.recommendedMantra}
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>🪔</span>
              <span>3. Deepa Daan & Annadana</span>
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.vedicRituals.charityDana}
            </p>
          </div>
        </div>

        <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20 text-xs text-slate-300 space-y-1">
          <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block mb-1">
            📜 Classical Vedic Guidelines for Janmadin:
          </span>
          {result.vedicRituals.lifestyleRules.map((rule, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-amber-500">•</span>
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}