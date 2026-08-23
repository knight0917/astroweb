"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAstroStore, ViewMode } from "../store/useAstroStore";
import { POPULAR_CITIES } from "../engine/constants";
import { AyanamshaType, HouseSystem, NodeType, GeoLocation } from "../engine/types";

export default function HeaderNav() {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [cityName, setCityName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [elevation, setElevation] = useState("0");
  const [timezoneOffset, setTimezoneOffset] = useState("5.5");
  const [citySearch, setCitySearch] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  const {
    location,
    setLocation,
    ayanamsha,
    setAyanamsha,
    houseSystem,
    setHouseSystem,
    nodeType,
    setNodeType,
    showModernPlanets,
    setShowModernPlanets,
    showUpagrahas,
    setShowUpagrahas,
    viewMode,
    setViewMode,
  } = useAstroStore();

  // Sync state when modal opens
  useEffect(() => {
    if (showLocationModal) {
      setCityName(location.cityName || "");
      setCountryName(location.country || "");
      setLatitude(location.latitude.toString());
      setLongitude(location.longitude.toString());
      setElevation((location.elevation || 0).toString());
      setTimezoneOffset(location.timezoneOffsetHours.toString());
      setCitySearch("");
      setGeoError("");
    }
  }, [showLocationModal, location]);

  // Filtered cities based on search
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
    setTimezoneOffset(c.timezoneOffsetHours.toString());
    setGeoError("");
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const elev = parseFloat(elevation) || 0;
    const tz = parseFloat(timezoneOffset);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setGeoError("Latitude must be a valid number between -90° and +90°");
      return;
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      setGeoError("Longitude must be a valid number between -180° and +180°");
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

  // Browser Geolocation GPS auto-detection
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

  const formatLat = (lat: number) => {
    return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;
  };

  const formatLon = (lon: number) => {
    return `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`;
  };

  return (
    <header className="glass-panel sticky top-0 z-50 px-4 py-3 border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-yellow-300 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
            ☸
          </div>
          <div>
            <h1 className="font-extrabold text-base md:text-lg bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent tracking-tight">
              VEDIC SKY TRACKER
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">
              Precision Jyotish Ephemeris & 3D Celestial Dome
            </p>
          </div>
        </div>

        {/* Center: View Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto max-w-full">
          {[
            { mode: "3d" as ViewMode, label: "🪐 3D Dome" },
            { mode: "kundli-north" as ViewMode, label: "☸ Kundli" },
            { mode: "shodashavarga" as ViewMode, label: "✨ Shodashavarga" },
            { mode: "shadbala" as ViewMode, label: "⚖️ Shadbala" },
            { mode: "ashtakavarga" as ViewMode, label: "📊 Ashtakavarga" },
            { mode: "numerology" as ViewMode, label: "🔢 Numerology" },
            { mode: "tithi-birthday" as ViewMode, label: "🎂 Tithi Birthday" },
            { mode: "table" as ViewMode, label: "📋 Ephemeris" },
            { mode: "dual" as ViewMode, label: "🔲 Dual 3D + Chart" },
          ].map((item) => (
            <button
              key={item.mode}
              onClick={() => setViewMode(item.mode)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                viewMode === item.mode
                  ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Settings & Coordinates Controls */}
        <div className="flex items-center gap-2 text-xs">
          {/* Prominent Location & Coordinate Button with Direct Edit Trigger */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 font-semibold transition-all shadow-sm group"
            title="Click to edit City, Latitude, Longitude, and Observer Location"
          >
            <span className="text-amber-400">📍</span>
            <div className="text-left">
              <div className="font-bold flex items-center gap-1">
                <span>{location.cityName}</span>
                <span className="text-[10px] text-amber-400 opacity-80 group-hover:opacity-100 font-mono">
                  [Edit]
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {formatLat(location.latitude)}, {formatLon(location.longitude)}
              </div>
            </div>
          </button>

          {/* Ayanamsha Dropdown */}
          <select
            value={ayanamsha}
            onChange={(e) => setAyanamsha(e.target.value as AyanamshaType)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
          >
            <option value="Lahiri">Lahiri (Chitrapaksha)</option>
            <option value="KP">KP (Krishnamurti)</option>
            <option value="Raman">B.V. Raman</option>
            <option value="Tropical">Tropical (Sayana)</option>
          </select>

          {/* Node Type Selector */}
          <select
            value={nodeType}
            onChange={(e) => setNodeType(e.target.value as NodeType)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
          >
            <option value="Mean">Mean Node</option>
            <option value="True">True Node</option>
          </select>

          {/* Upagrahas Toggle Button */}
          <button
            onClick={() => setShowUpagrahas(!showUpagrahas)}
            className={`px-3 py-1.5 rounded-lg font-bold border transition-all ${
              showUpagrahas
                ? "bg-purple-900/60 border-purple-500 text-purple-200 shadow"
                : "bg-slate-900/80 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
          >
            Upagrahas
          </button>

          {/* Modern Planets Toggle */}
          <button
            onClick={() => setShowModernPlanets(!showModernPlanets)}
            className={`px-3 py-1.5 rounded-lg font-bold border transition-all ${
              showModernPlanets
                ? "bg-cyan-900/60 border-cyan-500 text-cyan-200 shadow"
                : "bg-slate-900/80 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
          >
            Outer
          </button>

          {/* Prasna Tantra Direct Portal Link */}
          <a
            href="https://prasna-tantra-2-eqcdmsstvnm6buvdjcjfad.streamlit.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-900 border border-purple-500/60 hover:border-purple-400 text-purple-200 hover:text-white font-extrabold flex items-center gap-1.5 transition-all shadow-md hover:shadow-purple-500/20 hover:scale-105 active:scale-95 group ml-1"
            title="Open Vedic Horary Prasna Tantra Oracle in a new window"
          >
            <span className="text-sm animate-pulse">🔮</span>
            <span>Prasna Tantra</span>
            <span className="text-[10px] text-purple-400 group-hover:text-purple-200">↗</span>
          </a>
        </div>
      </div>

      {/* Interactive Location & Coordinate Manager Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-100">
                    Observer Place & Coordinate Editor
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Type any city or enter exact Latitude, Longitude, and Timezone
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {/* Live Search or Fast Filter */}
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700/80">
                <label className="text-[11px] font-bold text-amber-400 block mb-1.5">
                  🔍 SEARCH SACRED & GLOBAL CITY DATABASE
                </label>
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Type city name (e.g. Allahabad, Prayagraj, Varanasi, Tokyo, London)..."
                  className="w-full bg-slate-950 border border-slate-600 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 font-medium"
                />

                {/* Filtered Dropdown Results */}
                {citySearch.trim().length > 0 && (
                  <div className="mt-2 max-h-32 overflow-y-auto space-y-1 pr-1 border-t border-slate-800 pt-2">
                    {filteredCities.length === 0 ? (
                      <div className="text-xs text-slate-500 py-1">No preset matched. You can write custom coordinates below!</div>
                    ) : (
                      filteredCities.map((c) => (
                        <button
                          key={c.cityName}
                          type="button"
                          onClick={() => {
                            handleSelectCity(c);
                            setCitySearch("");
                          }}
                          className="w-full text-left p-1.5 rounded-lg bg-slate-950 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between text-xs transition-colors"
                        >
                          <span className="font-bold text-slate-200">{c.cityName} ({c.country})</span>
                          <span className="text-[10px] text-amber-400 font-mono">
                            {c.latitude.toFixed(2)}° N, {c.longitude.toFixed(2)}° E
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* GPS Auto Detect Button */}
              <div>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={geoLoading}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
                >
                  <span>🛰️</span>
                  <span>{geoLoading ? "Acquiring GPS Position..." : "Use My Current Device Location (GPS)"}</span>
                </button>

                {geoError && (
                  <div className="mt-2 p-2 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold">
                    {geoError}
                  </div>
                )}
              </div>

              {/* Manual Direct Input Form */}
              <form onSubmit={handleSaveLocation} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* City Name (Freely Editable Text) */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      CITY / PLACE NAME <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                      placeholder="e.g. Allahabad (Prayagraj)"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg p-2.5 text-xs text-slate-100 font-bold focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Country Name */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      COUNTRY / STATE
                    </label>
                    <input
                      type="text"
                      value={countryName}
                      onChange={(e) => setCountryName(e.target.value)}
                      placeholder="e.g. India"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg p-2.5 text-xs text-slate-100 font-medium focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Latitude & Longitude */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-amber-300 block mb-1">
                      LATITUDE (Degrees: -90 to +90) <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="e.g. 25.4358"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg p-2.5 text-xs text-amber-200 font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Positive for North (+), Negative for South (-)
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-amber-300 block mb-1">
                      LONGITUDE (Degrees: -180 to +180) <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="e.g. 81.8463"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg p-2.5 text-xs text-amber-200 font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Positive for East (+), Negative for West (-)
                    </span>
                  </div>
                </div>

                {/* Elevation & Timezone Offset */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      ELEVATION (Meters above sea level)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={elevation}
                      onChange={(e) => setElevation(e.target.value)}
                      placeholder="e.g. 98"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg p-2.5 text-xs text-slate-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      TIMEZONE OFFSET (Hours from UTC)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      value={timezoneOffset}
                      onChange={(e) => setTimezoneOffset(e.target.value)}
                      placeholder="e.g. +5.5 for IST"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg p-2.5 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>

                {/* Quick Selection Chip Presets */}
                <div className="border-t border-slate-800/80 pt-3">
                  <label className="text-[11px] font-bold text-slate-400 mb-2 block">
                    QUICK CITY PRESETS:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {POPULAR_CITIES.map((c) => (
                      <button
                        key={c.cityName}
                        type="button"
                        onClick={() => handleSelectCity(c)}
                        className={`text-left p-2 rounded-lg text-xs transition-all border ${
                          cityName === c.cityName
                            ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="font-bold truncate">{c.cityName}</div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          {c.latitude.toFixed(2)}°, {c.longitude.toFixed(2)}°
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowLocationModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
                  >
                    Apply Coordinates & Recalculate
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}