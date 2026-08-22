"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { POPULAR_CITIES } from "../engine/constants";
import { GeoLocation } from "../engine/types";

export default function VerticalTimeTravel() {
  const {
    currentDate,
    isPlaying,
    playSpeed,
    location,
    setDate,
    setLocation,
    stepTime,
    togglePlay,
    setPlaySpeed,
  } = useAstroStore();

  const [isOpen, setIsOpen] = useState(true);
  const animRef = useRef<number | null>(null);
  const [timeMode, setTimeMode] = useState<"local" | "utc">("local");
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [showCustomPlace, setShowCustomPlace] = useState(false);

  // Time States
  const tzOffsetMs = location.timezoneOffsetHours * 3600 * 1000;
  const displayDate = timeMode === "local" ? new Date(currentDate.getTime() + tzOffsetMs) : currentDate;

  const [year, setYear] = useState(displayDate.getUTCFullYear().toString());
  const [month, setMonth] = useState((displayDate.getUTCMonth() + 1).toString());
  const [day, setDay] = useState(displayDate.getUTCDate().toString());
  const [hour, setHour] = useState(displayDate.getUTCHours().toString().padStart(2, "0"));
  const [minute, setMinute] = useState(displayDate.getUTCMinutes().toString().padStart(2, "0"));

  // Location States
  const [placeName, setPlaceName] = useState(location.cityName);
  const [placeCountry, setPlaceCountry] = useState(location.country || "India");
  const [placeLat, setPlaceLat] = useState(location.latitude.toString());
  const [placeLon, setPlaceLon] = useState(location.longitude.toString());
  const [placeTz, setPlaceTz] = useState(location.timezoneOffsetHours.toString());

  // Sync time when not explicitly editing
  useEffect(() => {
    if (!isEditingTime) {
      const d = timeMode === "local" ? new Date(currentDate.getTime() + tzOffsetMs) : currentDate;
      setYear(d.getUTCFullYear().toString());
      setMonth((d.getUTCMonth() + 1).toString());
      setDay(d.getUTCDate().toString());
      setHour(d.getUTCHours().toString().padStart(2, "0"));
      setMinute(d.getUTCMinutes().toString().padStart(2, "0"));
    }
  }, [currentDate, timeMode, tzOffsetMs, isEditingTime]);

  // Sync place when store location changes
  useEffect(() => {
    setPlaceName(location.cityName);
    setPlaceCountry(location.country || "India");
    setPlaceLat(location.latitude.toString());
    setPlaceLon(location.longitude.toString());
    setPlaceTz(location.timezoneOffsetHours.toString());
  }, [location]);

  const handleApplyDateTime = () => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10) - 1;
    const d = parseInt(day, 10);
    const h = parseInt(hour, 10) || 0;
    const min = parseInt(minute, 10) || 0;

    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      const parsedUtcMs = Date.UTC(y, m, d, h, min, 0);
      const finalDate =
        timeMode === "local"
          ? new Date(parsedUtcMs - tzOffsetMs)
          : new Date(parsedUtcMs);

      setDate(finalDate);
      setIsEditingTime(false);
    }
  };

  const handleCitySelect = (cityName: string) => {
    const found = POPULAR_CITIES.find((c) => c.cityName === cityName);
    if (found) {
      setLocation(found);
      setShowCustomPlace(false);
    }
  };

  const handleApplyCustomPlace = () => {
    const lat = parseFloat(placeLat);
    const lon = parseFloat(placeLon);
    const tz = parseFloat(placeTz);

    if (!isNaN(lat) && !isNaN(lon) && !isNaN(tz)) {
      const newLoc: GeoLocation = {
        cityName: placeName.trim() || "Custom Place",
        country: placeCountry.trim() || "World",
        latitude: Math.max(-90, Math.min(90, lat)),
        longitude: Math.max(-180, Math.min(180, lon)),
        elevation: location.elevation || 10,
        timezoneOffsetHours: tz,
      };
      setLocation(newLoc);
      setShowCustomPlace(false);
    }
  };

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
    <div className="flex items-start pointer-events-auto">
      {/* Collapsed Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Open Date, Time & Place Controller"
          className="glass-panel p-2.5 rounded-xl border border-amber-500/50 text-amber-300 font-extrabold text-xs shadow-2xl flex items-center gap-1.5 hover:scale-105 transition-all cursor-pointer bg-slate-950/95"
        >
          <span className="text-base">⏳</span>
          <span className="hidden sm:inline">Time & Place</span>
        </button>
      )}

      {/* Expanded Vertical Left Dock */}
      {isOpen && (
        <div className="w-64 xl:w-72 max-w-[85vw] max-h-[calc(100vh-140px)] min-h-[340px] glass-panel rounded-2xl border border-slate-700/80 bg-slate-950/98 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-200 relative z-50 backdrop-blur-2xl">
          {/* Header */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <span className="text-base text-amber-400">⏳</span>
              <div>
                <h3 className="font-extrabold text-xs text-slate-100 uppercase tracking-wider">
                  Time & Place Deck
                </h3>
                <p className="text-[9px] text-amber-300 font-medium truncate max-w-[150px]">
                  📍 {location.cityName}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              title="Minimize Controller"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {/* 1. Place / Location Selector Card */}
            <div className="space-y-2 bg-slate-900/60 p-2.5 rounded-xl border border-amber-500/30">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <span>📍</span>
                  <span>Observer Place</span>
                </span>
                <button
                  onClick={() => setShowCustomPlace(!showCustomPlace)}
                  className="text-[9px] text-amber-300 hover:underline font-bold"
                >
                  {showCustomPlace ? "Select Preset" : "+ Custom Place"}
                </button>
              </div>

              {!showCustomPlace ? (
                /* Preset City Dropdown */
                <select
                  value={location.cityName}
                  onChange={(e) => handleCitySelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-1.5 text-xs text-slate-100 font-bold"
                >
                  {POPULAR_CITIES.map((c) => (
                    <option key={c.cityName} value={c.cityName}>
                      {c.cityName} ({c.country}) • UTC{c.timezoneOffsetHours >= 0 ? `+${c.timezoneOffsetHours}` : c.timezoneOffsetHours}
                    </option>
                  ))}
                </select>
              ) : (
                /* Custom Place Input Form */
                <div className="space-y-1.5 pt-0.5 text-xs">
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold block mb-0.5">CITY / PLACE NAME</span>
                    <input
                      type="text"
                      value={placeName}
                      onChange={(e) => setPlaceName(e.target.value)}
                      placeholder="e.g. Ayodhya, Varanasi..."
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-1 text-xs text-slate-100 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    <div>
                      <span className="text-[8px] text-slate-400 font-bold block mb-0.5">LAT (° N/S)</span>
                      <input
                        type="number"
                        step="0.0001"
                        value={placeLat}
                        onChange={(e) => setPlaceLat(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-1 text-xs font-mono font-bold text-slate-200"
                      />
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 font-bold block mb-0.5">LON (° E/W)</span>
                      <input
                        type="number"
                        step="0.0001"
                        value={placeLon}
                        onChange={(e) => setPlaceLon(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-1 text-xs font-mono font-bold text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1 items-end">
                    <div>
                      <span className="text-[8px] text-slate-400 font-bold block mb-0.5">TIMEZONE (UTC)</span>
                      <input
                        type="number"
                        step="0.5"
                        value={placeTz}
                        onChange={(e) => setPlaceTz(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-1 text-xs font-mono font-bold text-slate-200"
                      />
                    </div>
                    <button
                      onClick={handleApplyCustomPlace}
                      className="py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] rounded-lg transition-all shadow active:scale-95"
                    >
                      Save Place
                    </button>
                  </div>
                </div>
              )}

              <div className="text-[8.5px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-800/80 pt-1">
                <span>{location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E</span>
                <span className="text-amber-300">UTC{location.timezoneOffsetHours >= 0 ? `+${location.timezoneOffsetHours}` : location.timezoneOffsetHours}</span>
              </div>
            </div>

            {/* Time Mode Switch */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px]">
              <button
                onClick={() => setTimeMode("local")}
                className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  timeMode === "local" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Local Time
              </button>
              <button
                onClick={() => setTimeMode("utc")}
                className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  timeMode === "utc" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                UTC / GMT
              </button>
            </div>

            {/* Current Epoch Banner */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
              <div className="text-xs font-extrabold text-slate-100 font-mono">
                {displayDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  timeZone: "UTC",
                })}
              </div>
              <div className="text-base font-extrabold text-amber-400 font-mono tracking-wider">
                {displayDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                  timeZone: "UTC",
                })}
              </div>
              <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                UTC{location.timezoneOffsetHours >= 0 ? `+${location.timezoneOffsetHours}` : location.timezoneOffsetHours} (Timezone Offset)
              </div>
            </div>

            {/* Date Edit Inputs */}
            <div className="space-y-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Edit Date & Time
              </span>

              {/* Day / Month / Year */}
              <div className="grid grid-cols-3 gap-1.5">
                <div>
                  <span className="text-[8px] text-slate-500 font-bold block mb-0.5">DAY</span>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={day}
                    onFocus={() => setIsEditingTime(true)}
                    onChange={(e) => {
                      setIsEditingTime(true);
                      setDay(e.target.value);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyDateTime()}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-1.5 text-xs text-center text-slate-100 font-mono font-bold"
                  />
                </div>

                <div>
                  <span className="text-[8px] text-slate-500 font-bold block mb-0.5">MONTH</span>
                  <select
                    value={month}
                    onFocus={() => setIsEditingTime(true)}
                    onChange={(e) => {
                      setIsEditingTime(true);
                      setMonth(e.target.value);
                    }}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-1.5 text-xs text-slate-100 font-mono font-bold"
                  >
                    {MONTH_NAMES.map((name, i) => (
                      <option key={name} value={(i + 1).toString()}>
                        {name} ({i + 1})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[8px] text-slate-500 font-bold block mb-0.5">YEAR</span>
                  <input
                    type="number"
                    value={year}
                    onFocus={() => setIsEditingTime(true)}
                    onChange={(e) => {
                      setIsEditingTime(true);
                      setYear(e.target.value);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyDateTime()}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-1.5 text-xs text-center text-amber-300 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Hour / Minute */}
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <span className="text-[8px] text-slate-500 font-bold block mb-0.5">HH (24h)</span>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={hour}
                    onFocus={() => setIsEditingTime(true)}
                    onChange={(e) => {
                      setIsEditingTime(true);
                      setHour(e.target.value);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyDateTime()}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-1.5 text-xs text-center text-slate-100 font-mono font-bold"
                  />
                </div>

                <div>
                  <span className="text-[8px] text-slate-500 font-bold block mb-0.5">MIN</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minute}
                    onFocus={() => setIsEditingTime(true)}
                    onChange={(e) => {
                      setIsEditingTime(true);
                      setMinute(e.target.value);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyDateTime()}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-1.5 text-xs text-center text-slate-100 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1.5 pt-1">
                <button
                  onClick={handleApplyDateTime}
                  className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-lg transition-all shadow cursor-pointer active:scale-95"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setDate(new Date());
                    setIsEditingTime(false);
                  }}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all shadow cursor-pointer active:scale-95"
                  title="Reset to Real-Time Now"
                >
                  Live
                </button>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="space-y-1.5 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
              <button
                onClick={togglePlay}
                className={`w-full py-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow cursor-pointer active:scale-95 ${
                  isPlaying
                    ? "bg-rose-500 hover:bg-rose-600 text-white animate-pulse"
                    : "bg-amber-500 hover:bg-amber-400 text-slate-950"
                }`}
              >
                <span>{isPlaying ? "⏸ PAUSE" : "▶ PLAY TIME"}</span>
              </button>

              {/* Speed Buttons */}
              <div className="grid grid-cols-5 gap-1 pt-1">
                {[
                  { label: "1h/s", speed: 1 / 24 },
                  { label: "1d/s", speed: 1 },
                  { label: "1w/s", speed: 7 },
                  { label: "1m/s", speed: 30 },
                  { label: "1y/s", speed: 365 },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setPlaySpeed(s.speed)}
                    className={`py-1 rounded text-[9.5px] font-bold transition-all cursor-pointer ${
                      Math.abs(playSpeed - s.speed) < 0.001
                        ? "bg-amber-500 text-slate-950 shadow"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Step Buttons */}
            <div className="space-y-1 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                Quick Time Steps
              </span>
              <div className="grid grid-cols-4 gap-1 text-[10px]">
                <button
                  onClick={() => stepTime(-1, "century")}
                  className="py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded font-mono text-slate-300 font-bold cursor-pointer"
                >
                  -100y
                </button>
                <button
                  onClick={() => stepTime(-1, "year")}
                  className="py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded font-mono text-slate-300 font-bold cursor-pointer"
                >
                  -1y
                </button>
                <button
                  onClick={() => stepTime(-1, "month")}
                  className="py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded font-mono text-slate-300 font-bold cursor-pointer"
                >
                  -1m
                </button>
                <button
                  onClick={() => stepTime(-1, "day")}
                  className="py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded font-mono text-slate-300 font-bold cursor-pointer"
                >
                  -1d
                </button>
                <button
                  onClick={() => stepTime(1, "day")}
                  className="py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded font-mono text-slate-300 font-bold cursor-pointer"
                >
                  +1d
                </button>
                <button
                  onClick={() => stepTime(1, "month")}
                  className="py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded font-mono text-slate-300 font-bold cursor-pointer"
                >
                  +1m
                </button>
                <button
                  onClick={() => stepTime(1, "year")}
                  className="py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded font-mono text-slate-300 font-bold cursor-pointer"
                >
                  +1y
                </button>
                <button
                  onClick={() => stepTime(1, "century")}
                  className="py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded font-mono text-slate-300 font-bold cursor-pointer"
                >
                  +100y
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}