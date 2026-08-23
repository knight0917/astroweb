"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAstroStore } from "../store/useAstroStore";

export default function TimeTravelSlider() {
  const {
    currentDate,
    isPlaying,
    playSpeed,
    location,
    setDate,
    stepTime,
    togglePlay,
    setPlaySpeed,
  } = useAstroStore();

  const animRef = useRef<number | null>(null);
  const [timeMode, setTimeMode] = useState<"local" | "utc">("local");
  const [isEditing, setIsEditing] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);

  // Local place date vs UTC date
  const tzOffsetMs = location.timezoneOffsetHours * 3600 * 1000;
  const displayDate = timeMode === "local" ? new Date(currentDate.getTime() + tzOffsetMs) : currentDate;

  // Form input states
  const [year, setYear] = useState(displayDate.getUTCFullYear().toString());
  const [month, setMonth] = useState((displayDate.getUTCMonth() + 1).toString());
  const [day, setDay] = useState(displayDate.getUTCDate().toString());
  const [hour, setHour] = useState(displayDate.getUTCHours().toString().padStart(2, "0"));
  const [minute, setMinute] = useState(displayDate.getUTCMinutes().toString().padStart(2, "0"));
  const [second, setSecond] = useState(displayDate.getUTCSeconds().toString().padStart(2, "0"));

  // Sync inputs when currentDate or timeMode changes (only if not actively typing)
  useEffect(() => {
    if (!isEditing) {
      const d = timeMode === "local" ? new Date(currentDate.getTime() + tzOffsetMs) : currentDate;
      setYear(d.getUTCFullYear().toString());
      setMonth((d.getUTCMonth() + 1).toString());
      setDay(d.getUTCDate().toString());
      setHour(d.getUTCHours().toString().padStart(2, "0"));
      setMinute(d.getUTCMinutes().toString().padStart(2, "0"));
      setSecond(d.getUTCSeconds().toString().padStart(2, "0"));
    }
  }, [currentDate, timeMode, tzOffsetMs, isEditing]);

  // Apply user edited inputs to state
  const handleApplyDateTime = () => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10) - 1;
    const d = parseInt(day, 10);
    const h = parseInt(hour, 10) || 0;
    const min = parseInt(minute, 10) || 0;
    const s = parseInt(second, 10) || 0;

    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      const parsedUtcMs = Date.UTC(y, m, d, h, min, s);
      const finalDate =
        timeMode === "local"
          ? new Date(parsedUtcMs - tzOffsetMs)
          : new Date(parsedUtcMs);

      setDate(finalDate);
      setIsEditing(false);
      setShowPickerModal(false);
    }
  };

  // Continuous animation loop when playing
  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    let lastTime = performance.now();

    const loop = (now: number) => {
      const deltaSec = (now - lastTime) / 1000;
      if (deltaSec >= 0.05) {
        const advanceHours = deltaSec * playSpeed * 24;
        const nextDate = new Date(useAstroStore.getState().currentDate.getTime() + advanceHours * 3600 * 1000);
        setDate(nextDate);
        lastTime = now;
      }
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, playSpeed, setDate]);

  const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <div className="glass-panel p-3 md:p-4 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-2.5 md:gap-3 bg-slate-950/85">
      {/* Top Bar: Live Display + Form Inputs */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Icon & Current Epoch Banner */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 md:p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-lg md:text-xl shadow-inner flex-shrink-0">
            ⏳
          </div>
          <div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="text-[10px] md:text-[11px] font-bold text-slate-400 tracking-wider uppercase truncate max-w-[140px] sm:max-w-none">
                {timeMode === "local" ? `LOCAL TIME (${location.cityName})` : "UTC / GMT TIME"}
              </span>
              <div className="flex gap-0.5 bg-slate-900 p-0.5 rounded-md border border-slate-800 text-[9px] md:text-[10px]">
                <button
                  onClick={() => setTimeMode("local")}
                  className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                    timeMode === "local" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Local
                </button>
                <button
                  onClick={() => setTimeMode("utc")}
                  className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                    timeMode === "utc" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  UTC
                </button>
              </div>
            </div>

            <div className="text-xs md:text-base font-extrabold text-slate-100 font-mono flex flex-wrap items-center gap-1.5 md:gap-2 mt-0.5">
              <span>
                {displayDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  timeZone: "UTC",
                })}
              </span>
              <span className="text-amber-400">
                {displayDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                  timeZone: "UTC",
                })}
              </span>
              {timeMode === "local" && (
                <span className="text-[10px] text-slate-500 font-normal hidden sm:inline">
                  (UTC{location.timezoneOffsetHours >= 0 ? `+${location.timezoneOffsetHours}` : location.timezoneOffsetHours})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls: Mobile "Pick Date" button & Desktop Form Inputs */}
        <div className="flex items-center gap-1.5">
          {/* Mobile Direct Date Picker Sheet Trigger */}
          <button
            onClick={() => setShowPickerModal(true)}
            className="md:hidden px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1 cursor-pointer"
          >
            <span>📅</span>
            <span>Set Date & Time</span>
          </button>

          {/* Quick "LIVE NOW" button */}
          <button
            onClick={() => {
              setIsEditing(false);
              setDate(new Date());
            }}
            className="px-2.5 md:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
            title="Snap to current live moment"
          >
            <span>🔴</span>
            <span className="hidden sm:inline">LIVE NOW</span>
            <span className="sm:hidden">NOW</span>
          </button>

          {/* Desktop Inline Date Inputs (Hidden on Mobile) */}
          <div className="hidden md:flex flex-wrap items-center gap-1.5 bg-slate-950/90 p-2 rounded-xl border border-slate-700/80 shadow-inner">
            {/* Day */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-500 font-bold">DAY</span>
              <input
                type="number"
                min="1"
                max="31"
                value={day}
                onFocus={() => setIsEditing(true)}
                onChange={(e) => {
                  setIsEditing(true);
                  setDay(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleApplyDateTime()}
                className="w-11 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded p-1 text-xs text-center text-slate-100 font-mono font-bold"
              />
            </div>

            {/* Month */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-500 font-bold">MONTH</span>
              <select
                value={month}
                onFocus={() => setIsEditing(true)}
                onChange={(e) => {
                  setIsEditing(true);
                  setMonth(e.target.value);
                }}
                className="bg-slate-900 border border-slate-700 focus:border-amber-500 rounded p-1 text-xs text-slate-100 font-mono font-bold"
              >
                {MONTH_NAMES.map((name, i) => (
                  <option key={name} value={(i + 1).toString()}>
                    {name} ({i + 1})
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-500 font-bold">YEAR</span>
              <input
                type="number"
                value={year}
                onFocus={() => setIsEditing(true)}
                onChange={(e) => {
                  setIsEditing(true);
                  setYear(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleApplyDateTime()}
                placeholder="Year"
                className="w-16 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded p-1 text-xs text-center text-amber-300 font-mono font-bold"
              />
            </div>

            <span className="text-slate-600 font-mono pt-3">@</span>

            {/* Hour */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-500 font-bold">HH</span>
              <input
                type="number"
                min="0"
                max="23"
                value={hour}
                onFocus={() => setIsEditing(true)}
                onChange={(e) => {
                  setIsEditing(true);
                  setHour(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleApplyDateTime()}
                className="w-11 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded p-1 text-xs text-center text-slate-100 font-mono font-bold"
              />
            </div>

            <span className="text-slate-600 font-mono pt-3">:</span>

            {/* Minute */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-500 font-bold">MIN</span>
              <input
                type="number"
                min="0"
                max="59"
                value={minute}
                onFocus={() => setIsEditing(true)}
                onChange={(e) => {
                  setIsEditing(true);
                  setMinute(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleApplyDateTime()}
                className="w-11 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded p-1 text-xs text-center text-slate-100 font-mono font-bold"
              />
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApplyDateTime}
              className="mt-3 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded shadow transition-transform active:scale-95 cursor-pointer"
              title="Set exact Date and Time"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Play Controls & Multi-Speed Scrubbing Deck */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
        {/* Play / Pause button */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          <button
            onClick={togglePlay}
            className={`px-3 md:px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer flex-shrink-0 ${
              isPlaying
                ? "bg-red-500 hover:bg-red-400 text-white"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950"
            }`}
          >
            <span>{isPlaying ? "⏸ PAUSE" : "▶ PLAY"}</span>
          </button>

          {/* Speed selector */}
          <div className="flex items-center gap-0.5 md:gap-1 bg-slate-900/80 p-0.5 md:p-1 rounded-lg border border-slate-800 text-[10px] md:text-[11px] flex-shrink-0">
            {[
              { label: "1h/s", val: 1 / 24 },
              { label: "1d/s", val: 1 },
              { label: "1w/s", val: 7 },
              { label: "1m/s", val: 30 },
              { label: "1y/s", val: 365 },
            ].map((sp) => (
              <button
                key={sp.label}
                onClick={() => setPlaySpeed(sp.val)}
                className={`px-1.5 md:px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  playSpeed === sp.val
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step Buttons */}
        <div className="flex items-center gap-1 text-[10px] md:text-[11px] font-mono flex-shrink-0">
          <button
            onClick={() => stepTime(-1, "year")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Step Back 1 Year"
          >
            -1y
          </button>
          <button
            onClick={() => stepTime(-1, "month")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Step Back 1 Month"
          >
            -1m
          </button>
          <button
            onClick={() => stepTime(-1, "day")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Step Back 1 Day"
          >
            -1d
          </button>
          <button
            onClick={() => stepTime(-1, "hour")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Step Back 1 Hour"
          >
            -1h
          </button>
          <button
            onClick={() => stepTime(1, "hour")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Step Forward 1 Hour"
          >
            +1h
          </button>
          <button
            onClick={() => stepTime(1, "day")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Step Forward 1 Day"
          >
            +1d
          </button>
          <button
            onClick={() => stepTime(1, "month")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Step Forward 1 Month"
          >
            +1m
          </button>
          <button
            onClick={() => stepTime(1, "year")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Step Forward 1 Year"
          >
            +1y
          </button>
        </div>
      </div>

      {/* Mobile Date & Time Picker Modal */}
      {showPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setShowPickerModal(false)}
          ></div>

          <div className="relative z-10 glass-panel bg-slate-950 border border-slate-800 w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl text-amber-400">📅</span>
                <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
                  Set Date & Time
                </h3>
              </div>
              <button
                onClick={() => setShowPickerModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Date Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">DAY</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={day}
                  onChange={(e) => {
                    setIsEditing(true);
                    setDay(e.target.value);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-2.5 text-center font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">MONTH</label>
                <select
                  value={month}
                  onChange={(e) => {
                    setIsEditing(true);
                    setMonth(e.target.value);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-2.5 font-bold"
                >
                  {MONTH_NAMES.map((name, i) => (
                    <option key={name} value={(i + 1).toString()}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">YEAR</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => {
                    setIsEditing(true);
                    setYear(e.target.value);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 text-amber-300 text-sm rounded-xl p-2.5 text-center font-mono font-bold"
                />
              </div>
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">HOUR (24h)</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hour}
                  onChange={(e) => {
                    setIsEditing(true);
                    setHour(e.target.value);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-2.5 text-center font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">MINUTE</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minute}
                  onChange={(e) => {
                    setIsEditing(true);
                    setMinute(e.target.value);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-2.5 text-center font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPickerModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyDateTime}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
              >
                Apply Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}