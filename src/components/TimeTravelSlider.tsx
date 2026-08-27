"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useAstroStore } from "../store/useAstroStore";
import { GeoLocation } from "../engine/types";
import { POPULAR_CITIES } from "../engine/constants";
import { PlaceAutocompleteInput } from "./PlaceAutocompleteInput";

export default function TimeTravelSlider() {
  const {
    currentDate,
    isPlaying,
    playSpeed,
    location,
    setLocation,
    setDate,
    stepTime,
    togglePlay,
    setPlaySpeed,
    savedProfiles,
    activeProfileName,
    saveProfile,
    loadProfile,
    deleteProfile,
    resetToLiveTransit,
  } = useAstroStore();

  const [mounted, setMounted] = useState(false);
  const animRef = useRef<number | null>(null);
  const [timeMode, setTimeMode] = useState<"local" | "utc">("local");
  const [isEditing, setIsEditing] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showProfilesDropdown, setShowProfilesDropdown] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [saveToast, setSaveToast] = useState("");

  // Location Modal form state
  const [cityName, setCityName] = useState(location.cityName || "");
  const [countryName, setCountryName] = useState(location.country || "");
  const [latitude, setLatitude] = useState(location.latitude.toString());
  const [longitude, setLongitude] = useState(location.longitude.toString());
  const [elevation, setElevation] = useState((location.elevation || 0).toString());
  const [timezoneOffset, setTimezoneOffset] = useState((location.timezoneOffsetHours || 5.5).toString());
  const [citySearch, setCitySearch] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Local place date vs UTC date
  const tzOffsetMs = location.timezoneOffsetHours * 3600 * 1000;
  const displayDate = timeMode === "local" ? new Date(currentDate.getTime() + tzOffsetMs) : currentDate;

  // Form input states
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

  // Sync location form state when location modal opens
  useEffect(() => {
    if (showLocationModal) {
      setCityName(location.cityName || "");
      setCountryName(location.country || "");
      setLatitude(location.latitude.toString());
      setLongitude(location.longitude.toString());
      setElevation((location.elevation || 0).toString());
      setTimezoneOffset((location.timezoneOffsetHours || 5.5).toString());
      setCitySearch("");
      setGeoError("");
    }
  }, [showLocationModal, location]);

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return POPULAR_CITIES;
    const query = citySearch.toLowerCase();
    return POPULAR_CITIES.filter(
      (c) =>
        c.cityName.toLowerCase().includes(query) ||
        (c.country && c.country.toLowerCase().includes(query))
    );
  }, [citySearch]);

  const handleSelectCity = (c: GeoLocation) => {
    setCityName(c.cityName);
    setCountryName(c.country || "");
    setLatitude(c.latitude.toString());
    setLongitude(c.longitude.toString());
    setElevation((c.elevation || 0).toString());
    setTimezoneOffset((c.timezoneOffsetHours || 5.5).toString());
    setGeoError("");
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const elev = parseFloat(elevation) || 0;
    const tz = parseFloat(timezoneOffset);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setGeoError("Latitude must be between -90° and +90°");
      return;
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      setGeoError("Longitude must be between -180° and +180°");
      return;
    }

    setLocation({
      cityName: cityName.trim() || "Custom Place",
      country: countryName.trim() || undefined,
      latitude: lat,
      longitude: lon,
      elevation: elev,
      timezoneOffsetHours: isNaN(tz) ? lon / 15 : tz,
    });

    setShowLocationModal(false);
  };

  // Browser Geolocation GPS
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser");
      return;
    }

    setGeoLoading(true);
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const elev = pos.coords.altitude || 0;
        const tz = -new Date().getTimezoneOffset() / 60;

        setLatitude(lat.toFixed(4));
        setLongitude(lon.toFixed(4));
        setElevation(elev.toFixed(0));
        setTimezoneOffset(tz.toString());
        setCityName("My Current GPS Location");
        setCountryName("Local Device");
        setGeoLoading(false);
      },
      (err) => {
        setGeoError(`GPS error: ${err.message}`);
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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
      if (deltaSec >= 0.08) {
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

  const formatLat = (lat: number) => `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? "N" : "S"}`;
  const formatLon = (lon: number) => `${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? "E" : "W"}`;

  return (
    <div className="glass-panel p-3 md:p-4 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-2.5 md:gap-3 bg-slate-950/85">
      {/* Top Bar: Reversed Layout - Date/Time/Place Inputs on LEFT, Live Display on RIGHT */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* LEFT SECTION: Place Selector + Date & Time Inputs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Location / Place Enter Button */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 hover:border-amber-400 text-slate-200 font-semibold transition-all shadow-sm cursor-pointer group flex-shrink-0"
            title="Edit Place & Observer Location (GPS)"
          >
            <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div className="text-left">
              <span className="font-bold text-[11px] md:text-xs block max-w-[110px] sm:max-w-[140px] truncate text-slate-100 group-hover:text-amber-300 transition-colors">
                {location.cityName}
              </span>
              <span className="text-[8.5px] text-slate-400 font-mono hidden sm:block">
                {formatLat(location.latitude)}, {formatLon(location.longitude)}
              </span>
            </div>
            <span className="text-[9px] text-slate-500 font-bold ml-0.5">▼</span>
          </button>

          {/* 2. Saved Charts & Profiles Switcher Button */}
          <button
            onClick={() => setShowProfilesDropdown(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400 text-slate-200 font-semibold transition-all shadow-sm cursor-pointer group flex-shrink-0"
            title="Saved Birth Charts & Profiles"
          >
            <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <div className="text-left hidden sm:block">
              <span className="font-bold text-[11px] block max-w-[100px] truncate text-slate-100 group-hover:text-amber-300">
                {activeProfileName || (savedProfiles.length > 0 ? `Saved (${savedProfiles.length})` : "Saved Charts")}
              </span>
            </div>
            <span className="text-[9px] text-slate-500 font-bold ml-0.5">▼</span>
          </button>

          {/* 3. Direct 1-Click "Save Chart" Button (Visible on Mobile & Desktop) */}
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs shadow-sm transition-all cursor-pointer flex-shrink-0"
            title="Save Current Birth Details as a Profile"
          >
            <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span className="font-bold hidden xs:inline sm:inline">Save Chart</span>
          </button>

          {/* 4. Mobile Direct Date & Place Picker Trigger */}
          <button
            onClick={() => setShowPickerModal(true)}
            className="md:hidden px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Set Date & Time</span>
          </button>

          {/* 5. Desktop Inline Date & Time Inputs (Hidden on Mobile) */}
          <div className="hidden md:flex flex-wrap items-center gap-1.5 bg-slate-950/90 p-1.5 rounded-xl border border-slate-700/80 shadow-inner">
            {/* Day */}
            <div className="flex flex-col items-center">
              <span className="text-[8.5px] text-slate-500 font-bold">DAY</span>
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
              <span className="text-[8.5px] text-slate-500 font-bold">MONTH</span>
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
              <span className="text-[8.5px] text-slate-500 font-bold">YEAR</span>
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

            <span className="text-slate-600 font-mono pt-2.5">@</span>

            {/* Hour */}
            <div className="flex flex-col items-center">
              <span className="text-[8.5px] text-slate-500 font-bold">HH</span>
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

            <span className="text-slate-600 font-mono pt-2.5">:</span>

            {/* Minute */}
            <div className="flex flex-col items-center">
              <span className="text-[8.5px] text-slate-500 font-bold">MIN</span>
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
              className="mt-2.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-lg shadow transition-transform active:scale-95 cursor-pointer"
              title="Apply Date & Time"
            >
              Apply
            </button>
          </div>
        </div>

        {/* RIGHT SECTION: Live Display + Live Now + Time Format Toggles */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Quick "LIVE NOW" button */}
          <button
            onClick={() => {
              setIsEditing(false);
              setDate(new Date());
            }}
            className="px-2.5 md:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
            title="Snap to current live moment"
          >
            <span className="w-2 h-2 rounded-full bg-slate-950 inline-block animate-pulse" />
            <span className="hidden sm:inline">LIVE NOW</span>
            <span className="sm:hidden">NOW</span>
          </button>

          {/* Formatted Date/Time Banner with Hourglass */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-2 rounded-xl">
            <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400 text-sm">
              <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  {timeMode === "local" ? `LOCAL` : "UTC"}
                </span>
                <div className="flex gap-0.5 bg-slate-950 p-0.5 rounded border border-slate-800 text-[8.5px]">
                  <button
                    onClick={() => setTimeMode("local")}
                    className={`px-1 py-0.2 rounded font-bold transition-all cursor-pointer ${
                      timeMode === "local" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Local
                  </button>
                  <button
                    onClick={() => setTimeMode("utc")}
                    className={`px-1 py-0.2 rounded font-bold transition-all cursor-pointer ${
                      timeMode === "utc" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    UTC
                  </button>
                </div>
              </div>

              <div className="text-xs md:text-sm font-bold text-slate-100 font-mono flex items-center gap-1.5 mt-0.5">
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
              </div>
            </div>
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
                ? "bg-rose-600 hover:bg-rose-500 text-white"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950"
            }`}
          >
            <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
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

      {/* Mobile Date & Time Picker Modal via Portal */}
      {mounted && showPickerModal && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setShowPickerModal(false)}
          ></div>

          <div className="relative z-10 glass-panel bg-slate-950 border border-slate-800 w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] my-auto overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
                  Set Date, Time & Place
                </h3>
              </div>
              <button
                onClick={() => setShowPickerModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Location Trigger in Modal */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Observer Location:</span>
                <span className="font-extrabold text-xs text-amber-300">{location.cityName}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPickerModal(false);
                  setShowLocationModal(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Change Place
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
                      {name} ({i + 1})
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

            {/* Quick Save as Default Profile */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  handleApplyDateTime();
                  const prof = saveProfile("My Birth Chart", true);
                  setSaveToast(`✅ Saved "${prof.name}" as Default on this device!`);
                  setTimeout(() => setSaveToast(""), 3500);
                }}
                className="w-full py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow"
              >
                <span>💾</span>
                <span>Save as Default Birth Chart</span>
              </button>
              {saveToast && (
                <div className="text-center text-[11px] font-bold text-emerald-400 animate-in fade-in">
                  {saveToast}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
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
        </div>,
        document.body
      )}

      {/* Place / Location Selector Modal via Portal */}
      {mounted && showLocationModal && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setShowLocationModal(false)}
          ></div>

          <div className="relative z-10 glass-panel bg-slate-950 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] my-auto overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-base">
                  📍
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-100">
                    Observer & Birth Place
                  </h3>
                  <p className="text-xs text-slate-400">
                    Search city name, choose from popular cities, or use GPS
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Autocomplete Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Type City, Town or District:
              </label>
              <PlaceAutocompleteInput
                value={cityName}
                onChange={(val) => setCityName(val)}
                onSelectLocation={(loc) => {
                  handleSelectCity(loc);
                }}
                placeholder="Type place name (e.g. Mau, Ballia, Varanasi, Delhi)..."
              />
            </div>

            {/* GPS Detect Button */}
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={geoLoading}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>🧭</span>
              <span>{geoLoading ? "Detecting GPS..." : "Detect Current Device GPS Coordinates"}</span>
            </button>

            {geoError && (
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-600/40 text-rose-300 text-xs">
                {geoError}
              </div>
            )}

            {/* Form Coordinates */}
            <form onSubmit={handleSaveLocation} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Latitude (° N/S)</label>
                  <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Longitude (° E/W)</label>
                  <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Elevation (meters)</label>
                  <input
                    type="text"
                    value={elevation}
                    onChange={(e) => setElevation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Timezone Offset (Hours)</label>
                  <input
                    type="text"
                    value={timezoneOffset}
                    onChange={(e) => setTimezoneOffset(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              {/* Popular Cities Pills */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Select Major Cities:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-900/60 rounded-xl border border-slate-800">
                  {filteredCities.slice(0, 12).map((c) => (
                    <button
                      key={c.cityName}
                      type="button"
                      onClick={() => handleSelectCity(c)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        cityName === c.cityName
                          ? "bg-amber-500 text-slate-950 border-amber-400"
                          : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      {c.cityName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Set Location
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Save Profile Name Dialog Modal via Portal */}
      {mounted && showSaveModal && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setShowSaveModal(false)}></div>
          <div className="relative z-10 glass-panel bg-slate-950 border border-slate-800 w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-3.5 my-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                <span>💾</span>
                <span>Save Birth Chart Profile</span>
              </h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Profile / Person Name:
              </label>
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="e.g. My Birth Chart, Ravi, Spouse, Child..."
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl p-2.5 text-xs text-slate-100 font-bold focus:outline-none"
              />
              <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800 text-[10.5px] text-slate-400 space-y-0.5">
                <div>Date: <span className="text-amber-300 font-bold">{displayDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })} @ {hour}:{minute}</span></div>
                <div>City: <span className="text-amber-300 font-bold">{location.cityName} ({location.country || "India"})</span></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  saveProfile(newProfileName || "My Birth Chart", true);
                  setShowSaveModal(false);
                  setNewProfileName("");
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 cursor-pointer"
              >
                Save Chart
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Saved Profiles Manager Modal via Portal (Zero Clipping on Mobile & Desktop) */}
      {mounted && showProfilesDropdown && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setShowProfilesDropdown(false)}></div>
          <div className="relative z-10 glass-panel bg-slate-950 border border-slate-700 w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 my-auto animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 text-base">
                  👤
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-100 uppercase tracking-wider">
                    Saved Birth Charts (सुरक्षित कुण्डली)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Switch between saved profiles on this device
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProfilesDropdown(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Primary Action: Save Current Details as Chart */}
            <button
              onClick={() => {
                setShowSaveModal(true);
                setShowProfilesDropdown(false);
              }}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span className="text-base">💾</span>
              <span>Save Current Chart as New Profile</span>
            </button>

            {/* Saved Profiles List */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Your Saved Charts on this Device:
              </span>

              <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                {savedProfiles.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs space-y-1">
                    <p className="font-bold text-slate-300">No saved charts yet.</p>
                    <p className="text-[11px]">Click the gold button above to save your birth chart for instant 1-click loading!</p>
                  </div>
                ) : (
                  savedProfiles.map((p) => {
                    const pDate = new Date(p.dateIso);
                    const isCurrent = activeProfileName === p.name;
                    return (
                      <div
                        key={p.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                          isCurrent
                            ? "bg-amber-500/15 border-amber-400/60 shadow-md"
                            : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div
                          onClick={() => {
                            loadProfile(p);
                            setShowProfilesDropdown(false);
                          }}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-black text-sm text-slate-100 flex items-center gap-2">
                            <span>{p.name}</span>
                            {p.isDefault && (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40">
                                Default
                              </span>
                            )}
                            {isCurrent && (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40">
                                Active Now
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-1.5 font-medium">
                            <span className="text-slate-200">
                              🗓️ {pDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                            <span>•</span>
                            <span className="text-slate-300">
                              📍 {p.location.cityName} ({p.location.country || "India"})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              loadProfile(p);
                              setShowProfilesDropdown(false);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow cursor-pointer"
                          >
                            Load
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteProfile(p.id);
                            }}
                            className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 text-xs transition-colors cursor-pointer"
                            title="Delete Profile"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Bottom Reset to Live Transit */}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  resetToLiveTransit();
                  setShowProfilesDropdown(false);
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>🔴</span>
                <span>Reset to Live Transit (Current Sky Now)</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}