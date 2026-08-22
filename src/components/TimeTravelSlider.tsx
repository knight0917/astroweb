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
      // Create date in UTC
      const parsedUtcMs = Date.UTC(y, m, d, h, min, s);
      const finalDate =
        timeMode === "local"
          ? new Date(parsedUtcMs - tzOffsetMs)
          : new Date(parsedUtcMs);

      setDate(finalDate);
      setIsEditing(false);
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
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-3">
      {/* Top Bar: Live Display + Free Form Numeric Inputs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Icon & Current Epoch Banner */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xl shadow-inner">
            ⏳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                {timeMode === "local" ? `LOCAL PLACE TIME (${location.cityName})` : "UTC / GMT TIME"}
              </span>
              <div className="flex gap-1 bg-slate-900 p-0.5 rounded-md border border-slate-800 text-[10px]">
                <button
                  onClick={() => setTimeMode("local")}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${
                    timeMode === "local" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Local Time
                </button>
                <button
                  onClick={() => setTimeMode("utc")}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${
                    timeMode === "utc" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  UTC / GMT
                </button>
              </div>
            </div>

            <div className="text-sm md:text-base font-extrabold text-slate-100 font-mono flex items-center gap-2 mt-0.5">
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
                <span className="text-xs text-slate-400 font-normal">
                  (UTC{location.timezoneOffsetHours >= 0 ? `+${location.timezoneOffsetHours}` : location.timezoneOffsetHours})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Free Form Inputs for Year, Month, Day, Hour, Minute */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/90 p-2 rounded-xl border border-slate-700/80 shadow-inner">
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
            <span className="text-[9px] text-slate-500 font-bold">HH (24h)</span>
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
            className="mt-3 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded shadow transition-transform active:scale-95"
            title="Set exact Date and Time"
          >
            Apply
          </button>

          {/* Live Now Button */}
          <button
            onClick={() => {
              setIsEditing(false);
              setDate(new Date());
            }}
            className="mt-3 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs rounded shadow transition-transform active:scale-95"
            title="Snap to current live moment"
          >
            LIVE NOW
          </button>
        </div>
      </div>

      {/* Play Controls & Multi-Speed Scrubbing Deck */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        {/* Play / Pause button */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
              isPlaying
                ? "bg-red-500 hover:bg-red-400 text-white"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950"
            }`}
          >
            <span>{isPlaying ? "⏸ PAUSE" : "▶ PLAY TIME"}</span>
          </button>

          {/* Speed selector */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-[11px]">
            <span className="text-slate-500 px-1 font-medium">Speed:</span>
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
                className={`px-2 py-0.5 rounded transition-colors ${
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
        <div className="flex flex-wrap items-center gap-1 text-[11px] font-mono">
          <button
            onClick={() => stepTime(-100, "year")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Step Back 100 Years"
          >
            -100y
          </button>
          <button
            onClick={() => stepTime(-1, "year")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Step Back 1 Year"
          >
            -1y
          </button>
          <button
            onClick={() => stepTime(-1, "month")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Step Back 1 Month"
          >
            -1m
          </button>
          <button
            onClick={() => stepTime(-1, "day")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Step Back 1 Day"
          >
            -1d
          </button>
          <button
            onClick={() => stepTime(-1, "hour")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Step Back 1 Hour"
          >
            -1h
          </button>

          <span className="text-slate-600 px-0.5">|</span>

          <button
            onClick={() => stepTime(1, "hour")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Step Forward 1 Hour"
          >
            +1h
          </button>
          <button
            onClick={() => stepTime(1, "day")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Step Forward 1 Day"
          >
            +1d
          </button>
          <button
            onClick={() => stepTime(1, "month")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Step Forward 1 Month"
          >
            +1m
          </button>
          <button
            onClick={() => stepTime(1, "year")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Step Forward 1 Year"
          >
            +1y
          </button>
          <button
            onClick={() => stepTime(100, "year")}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Step Forward 100 Years"
          >
            +100y
          </button>
        </div>
      </div>
    </div>
  );
}