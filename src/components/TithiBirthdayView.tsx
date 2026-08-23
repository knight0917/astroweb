"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { calculateTithiBirthday, TithiBirthdayResult } from "../engine/tithiBirthday";
import { POPULAR_CITIES } from "../engine/constants";
import { GeoLocation } from "../engine/types";

export default function TithiBirthdayView() {
  const { currentDate, location, ayanamsha, setDate } = useAstroStore();

  // Local Birth Input States (Default: 25 May 1998 12:00 PM)
  const [birthYear, setBirthYear] = useState("1998");
  const [birthMonth, setBirthMonth] = useState("5");
  const [birthDay, setBirthDay] = useState("25");
  const [birthHour, setBirthHour] = useState("12");
  const [birthMinute, setBirthMinute] = useState("00");

  const [selectedCityName, setSelectedCityName] = useState(location.cityName);
  const [activeLocation, setActiveLocation] = useState<GeoLocation>(location);

  // Live countdown ticker
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCityChange = (cityName: string) => {
    setSelectedCityName(cityName);
    const found = POPULAR_CITIES.find((c) => c.cityName === cityName);
    if (found) {
      setActiveLocation(found);
    }
  };

  const parsedBirthDate = useMemo(() => {
    const y = parseInt(birthYear, 10) || 1998;
    const m = (parseInt(birthMonth, 10) || 1) - 1;
    const d = parseInt(birthDay, 10) || 25;
    const h = parseInt(birthHour, 10) || 12;
    const min = parseInt(birthMinute, 10) || 0;

    const tzMs = activeLocation.timezoneOffsetHours * 3600 * 1000;
    const utcMs = Date.UTC(y, m, d, h, min, 0);
    return new Date(utcMs - tzMs);
  }, [birthYear, birthMonth, birthDay, birthHour, birthMinute, activeLocation]);

  const result: TithiBirthdayResult = useMemo(() => {
    return calculateTithiBirthday(parsedBirthDate, activeLocation, ayanamsha, now);
  }, [parsedBirthDate, activeLocation, ayanamsha, now]);

  const MONTH_NAMES = [
    "Jan (1)", "Feb (2)", "Mar (3)", "Apr (4)", "May (5)", "Jun (6)",
    "Jul (7)", "Aug (8)", "Sep (9)", "Oct (10)", "Nov (11)", "Dec (12)"
  ];

  const handleUseCurrentTrackerDate = () => {
    const tzDate = new Date(currentDate.getTime() + location.timezoneOffsetHours * 3600 * 1000);
    setBirthYear(tzDate.getUTCFullYear().toString());
    setBirthMonth((tzDate.getUTCMonth() + 1).toString());
    setBirthDay(tzDate.getUTCDate().toString());
    setBirthHour(tzDate.getUTCHours().toString().padStart(2, "0"));
    setBirthMinute(tzDate.getUTCMinutes().toString().padStart(2, "0"));
    setActiveLocation(location);
    setSelectedCityName(location.cityName);
  };

  // Countdown calculations
  const nextTargetMs = result.nextBirthday.exactMoment.getTime();
  const msDiff = Math.max(0, nextTargetMs - now.getTime());
  const countdownDays = Math.floor(msDiff / (1000 * 60 * 60 * 24));
  const countdownHours = Math.floor((msDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const countdownMinutes = Math.floor((msDiff % (1000 * 60 * 60)) / (1000 * 60));
  const countdownSeconds = Math.floor((msDiff % (1000 * 60)) / 1000);

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
            Calculate your authentic Vedic Birthday based on recurring Lunar Month (Masa), Paksha, and Tithi
          </p>
        </div>

        <button
          onClick={handleUseCurrentTrackerDate}
          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow"
        >
          <span>⏳ Use Active Tracker Date</span>
        </button>
      </div>

      {/* Main Grid: Left Birth Input Form, Right Hero Countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Birth Details Input Form (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>📅</span>
              <span>Enter Birth Details</span>
            </h3>
            <span className="text-[10px] text-amber-400 font-mono font-bold">Vedic Epoch</span>
          </div>

          {/* Date Picker Grid */}
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-1">DATE OF BIRTH</span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[8px] text-slate-500 font-bold block mb-0.5">DAY</span>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-2 text-sm text-center text-slate-100 font-mono font-bold"
                  />
                </div>
                <div>
                  <span className="text-[8px] text-slate-500 font-bold block mb-0.5">MONTH</span>
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-2 text-xs text-slate-100 font-bold"
                  >
                    {MONTH_NAMES.map((name, i) => (
                      <option key={name} value={(i + 1).toString()}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-[8px] text-slate-500 font-bold block mb-0.5">YEAR</span>
                  <input
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-2 text-sm text-center text-amber-300 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Time Picker */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-1">TIME OF BIRTH (24-HOUR)</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[8px] text-slate-500 font-bold block mb-0.5">HOURS (00-23)</span>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-2 text-sm text-center text-slate-100 font-mono font-bold"
                  />
                </div>
                <div>
                  <span className="text-[8px] text-slate-500 font-bold block mb-0.5">MINUTES (00-59)</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={birthMinute}
                    onChange={(e) => setBirthMinute(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-2 text-sm text-center text-slate-100 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Place Selector */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-1">BIRTH PLACE / CITY</span>
              <select
                value={selectedCityName}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-2 text-xs text-slate-100 font-bold"
              >
                {POPULAR_CITIES.map((c) => (
                  <option key={c.cityName} value={c.cityName}>
                    📍 {c.cityName} ({c.country}) • UTC{c.timezoneOffsetHours >= 0 ? `+${c.timezoneOffsetHours}` : c.timezoneOffsetHours}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Calculated Birth Tithi Details Card */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
            <span className="text-[9px] font-extrabold text-amber-400 uppercase tracking-wider block">
              🌙 Your Vedic Birth Tithi Details
            </span>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Vedic Lunar Month:</span>
                <span className="font-bold text-amber-300">
                  {result.birthDetails.masaName} ({result.birthDetails.masaHindi})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Paksha (Fortnight):</span>
                <span className="font-bold text-slate-100">
                  {result.birthDetails.paksha} Paksha ({result.birthDetails.paksha === "Shukla" ? "शुक्ल पक्ष / Waxing" : "कृष्ण पक्ष / Waning"})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Birth Tithi:</span>
                <span className="font-bold text-emerald-400 font-mono">
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
        </div>

        {/* Right Column: Next Birthday Hero & Countdown (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Hero Card: Next Tithi Birthday */}
          <div className="glass-panel p-6 rounded-2xl border-2 border-amber-500/60 shadow-2xl bg-gradient-to-b from-amber-950/40 via-slate-950/90 to-slate-950/95 space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl pointer-events-none select-none">
              🎂
            </div>

            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                  Upcoming Vedic Janmadin (आगामी तिथि जन्मदिन)
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-100 mt-0.5">
                  {result.nextBirthday.formattedDate}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs shadow-lg">
                Year {result.nextBirthday.year}
              </span>
            </div>

            {/* Countdown Clock Grid */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                ⏳ Time Remaining to Next Tithi Birthday:
              </span>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-500/40 shadow">
                  <span className="text-2xl md:text-3xl font-extrabold text-amber-300 font-mono block">
                    {countdownDays}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Days</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-500/40 shadow">
                  <span className="text-2xl md:text-3xl font-extrabold text-amber-300 font-mono block">
                    {countdownHours}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Hours</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-500/40 shadow">
                  <span className="text-2xl md:text-3xl font-extrabold text-amber-300 font-mono block">
                    {countdownMinutes}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Mins</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-500/40 shadow">
                  <span className="text-2xl md:text-3xl font-extrabold text-amber-300 font-mono block">
                    {countdownSeconds}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Secs</span>
                </div>
              </div>
            </div>

            {/* Astronomical Tithi Window Details */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Observance Tithi:</span>
                <span className="font-extrabold text-amber-300 font-mono">
                  {result.nextBirthday.masaName} {result.nextBirthday.paksha} {result.nextBirthday.tithiName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tithi Starts:</span>
                <span className="font-mono text-slate-200">
                  {new Date(result.nextBirthday.tithiStart.getTime() + activeLocation.timezoneOffsetHours * 3600 * 1000).toLocaleString("en-US", { timeZone: "UTC" })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tithi Ends:</span>
                <span className="font-mono text-slate-200">
                  {new Date(result.nextBirthday.tithiEnd.getTime() + activeLocation.timezoneOffsetHours * 3600 * 1000).toLocaleString("en-US", { timeZone: "UTC" })}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">Exact Solar-Lunar Return Epoch:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {new Date(result.nextBirthday.exactMoment.getTime() + activeLocation.timezoneOffsetHours * 3600 * 1000).toLocaleString("en-US", { timeZone: "UTC" })}
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming 5-Year Vedic Birthday Table */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-3">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span>📅</span>
              <span>Upcoming 5-Year Vedic Birthday Calendar</span>
            </h4>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                    <th className="p-2.5 font-bold">Year</th>
                    <th className="p-2.5">Gregorian Date & Day</th>
                    <th className="p-2.5">Vedic Lunar Tithi</th>
                    <th className="p-2.5 text-right">Time Remaining</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {result.upcomingBirthdays.map((b, idx) => (
                    <tr key={b.year} className={`hover:bg-slate-900/50 ${idx === 0 ? "bg-amber-500/10 font-bold" : ""}`}>
                      <td className="p-2.5 text-amber-400 font-extrabold">{b.year}</td>
                      <td className="p-2.5 text-slate-100">{b.formattedDate}</td>
                      <td className="p-2.5 text-slate-300">
                        {b.masaName} {b.paksha} {b.tithiName}
                      </td>
                      <td className="p-2.5 text-right text-amber-300">
                        {b.daysRemaining} days ({b.hoursRemaining}h)
                      </td>
                    </tr>
                  ))}
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