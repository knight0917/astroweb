"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useAstroStore, ViewMode } from "../store/useAstroStore";
import { POPULAR_CITIES } from "../engine/constants";
import { AyanamshaType, HouseSystem, NodeType, GeoLocation } from "../engine/types";
import { PlaceAutocompleteInput } from "./PlaceAutocompleteInput";

export default function HeaderNav() {
  const [mounted, setMounted] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Sync state when location modal opens
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
    return `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? "N" : "S"}`;
  };

  const formatLon = (lon: number) => {
    return `${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? "E" : "W"}`;
  };

  return (
    <header className="glass-panel sticky top-0 z-40 px-3 md:px-4 py-2.5 border-b border-slate-800 shadow-xl bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-yellow-300 flex items-center justify-center text-base md:text-lg shadow-lg shadow-amber-500/20 flex-shrink-0">
            ☸
          </div>
          <div>
            <h1 className="font-extrabold text-sm md:text-base bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent tracking-tight">
              VEDIC SKY
            </h1>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-medium hidden sm:block">
              Precision Jyotish Ephemeris
            </p>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto max-w-full">
          {[
            { mode: "kundli-north" as ViewMode, label: "☸ Kundli" },
            { mode: "shodashavarga" as ViewMode, label: "✨ Shodashavarga" },
            { mode: "shadbala" as ViewMode, label: "⚖️ Shadbala" },
            { mode: "bhavabala" as ViewMode, label: "🏛️ Bhava Bala" },
            { mode: "ashtakavarga" as ViewMode, label: "📊 Ashtakavarga" },
            { mode: "numerology" as ViewMode, label: "🔢 Numerology" },
            { mode: "tithi-birthday" as ViewMode, label: "🎂 Tithi Birthday" },
            { mode: "3d" as ViewMode, label: "🪐 3D Dome" },
            { mode: "table" as ViewMode, label: "📋 Ephemeris" },
          ].map((item) => (
            <button
              key={item.mode}
              onClick={() => setViewMode(item.mode)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                viewMode === item.mode
                  ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right: Location Chip & Settings */}
        <div className="flex items-center gap-1.5 md:gap-2 text-xs">
          {/* Location Trigger Chip */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 font-semibold transition-all shadow-sm cursor-pointer"
            title="Edit Observer Location & GPS"
          >
            <span className="text-amber-400 text-xs">📍</span>
            <div className="text-left">
              <span className="font-bold text-[11px] md:text-xs block max-w-[90px] sm:max-w-[120px] truncate">
                {location.cityName}
              </span>
              <span className="text-[8.5px] text-slate-400 font-mono hidden sm:block">
                {formatLat(location.latitude)}, {formatLon(location.longitude)}
              </span>
            </div>
          </button>

          {/* Desktop Direct Settings Dropdowns */}
          <div className="hidden lg:flex items-center gap-1.5">
            <select
              value={ayanamsha}
              onChange={(e) => setAyanamsha(e.target.value as AyanamshaType)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="Lahiri">Lahiri</option>
              <option value="KP">KP</option>
              <option value="Raman">Raman</option>
              <option value="Tropical">Tropical</option>
            </select>

            <select
              value={nodeType}
              onChange={(e) => setNodeType(e.target.value as NodeType)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="Mean">Mean Node</option>
              <option value="True">True Node</option>
            </select>

            <button
              onClick={() => setShowUpagrahas(!showUpagrahas)}
              className={`px-2.5 py-1.5 rounded-lg font-bold border transition-all text-xs cursor-pointer ${
                showUpagrahas
                  ? "bg-purple-900/60 border-purple-500 text-purple-200 shadow"
                  : "bg-slate-900/80 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              Upagrahas
            </button>
          </div>

          {/* Mobile Settings Gear Drawer Trigger */}
          <button
            onClick={() => setShowSettingsDrawer(true)}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-400 transition-all flex items-center justify-center cursor-pointer shadow-sm"
            title="Jyotish Configuration & Settings"
          >
            <span className="text-base leading-none">⚙️</span>
          </button>
        </div>
      </div>

      {/* Slide-out Mobile Settings Drawer Modal via Portal */}
      {mounted && showSettingsDrawer && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setShowSettingsDrawer(false)}
          ></div>

          <div className="relative z-10 glass-panel bg-slate-950/98 border-l border-slate-800 w-full max-w-sm h-full p-5 overflow-y-auto space-y-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250">
            <div className="space-y-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl text-amber-400">⚙️</span>
                  <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
                    Jyotish Settings & Tools
                  </h3>
                </div>
                <button
                  onClick={() => setShowSettingsDrawer(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Ayanamsha Setting */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Ayanamsha System (अयनांश)
                </label>
                <select
                  value={ayanamsha}
                  onChange={(e) => setAyanamsha(e.target.value as AyanamshaType)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                >
                  <option value="Lahiri">Lahiri (Chitrapaksha — Standard Indian Govt)</option>
                  <option value="KP">KP (Krishnamurti Padhdhati)</option>
                  <option value="Raman">B.V. Raman</option>
                  <option value="Tropical">Tropical (Sayana / Western)</option>
                </select>
              </div>

              {/* Node Calculation Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Rahu / Ketu Calculation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNodeType("Mean")}
                    className={`py-2 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      nodeType === "Mean"
                        ? "bg-amber-500 text-slate-950 border-amber-500 shadow"
                        : "bg-slate-900 border-slate-700 text-slate-300"
                    }`}
                  >
                    Mean Node
                  </button>
                  <button
                    onClick={() => setNodeType("True")}
                    className={`py-2 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      nodeType === "True"
                        ? "bg-amber-500 text-slate-950 border-amber-500 shadow"
                        : "bg-slate-900 border-slate-700 text-slate-300"
                    }`}
                  >
                    True Node
                  </button>
                </div>
              </div>

              {/* House System Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  House / Bhava System
                </label>
                <select
                  value={houseSystem}
                  onChange={(e) => setHouseSystem(e.target.value as HouseSystem)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                >
                  <option value="Equal">Equal House (Equal 30° from Lagna)</option>
                  <option value="Placidus">Placidus (KP Semi-Arc)</option>
                  <option value="WholeSign">Whole Sign (Rashi = House)</option>
                  <option value="Sripati">Sripati (Porphyry/Bhava Chalita)</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div>
                    <span className="font-bold text-xs text-slate-200 block">Upagrahas & Mandi</span>
                    <span className="text-[10px] text-slate-400">Dhuma, Vyatipata, Gulika, etc.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showUpagrahas}
                    onChange={(e) => setShowUpagrahas(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div>
                    <span className="font-bold text-xs text-slate-200 block">Modern Outer Planets</span>
                    <span className="text-[10px] text-slate-400">Uranus, Neptune, Pluto</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showModernPlanets}
                    onChange={(e) => setShowModernPlanets(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Done & Apply Settings
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Location Modal via Portal */}
      {mounted && showLocationModal && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setShowLocationModal(false)}
          ></div>

          <div className="relative z-10 glass-panel bg-slate-950 border border-slate-800 w-full max-w-lg rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] my-auto overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl text-amber-400">📍</span>
                <h3 className="font-extrabold text-base text-slate-100">
                  Set Observer Location & Coordinates
                </h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* GPS Auto Detect Button */}
            <button
              onClick={handleDetectLocation}
              disabled={geoLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <span>🛰️</span>
              <span>{geoLoading ? "Acquiring GPS Fix..." : "Auto-Detect My Exact Device GPS Location"}</span>
            </button>

            {geoError && (
              <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono">
                {geoError}
              </div>
            )}

            {/* Live Global Place Search & Autocomplete */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block flex items-center justify-between">
                <span>Search Any City / Town / Village</span>
                <span className="text-[10px] text-slate-400 font-normal">Live Global & Local Recommendations</span>
              </label>
              <PlaceAutocompleteInput
                value={citySearch}
                onChange={setCitySearch}
                onSelectLocation={(loc) => {
                  handleSelectCity(loc);
                  setCitySearch("");
                }}
                placeholder="Start typing place name (e.g. Mau, Ballia, Varanasi, London, New York)..."
                autoFocus
              />
            </div>

            {/* Quick Popular Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Popular Vedic & Global Locations:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto custom-scrollbar p-1 bg-slate-900/60 rounded-xl border border-slate-800">
                {POPULAR_CITIES.slice(0, 14).map((c) => (
                  <button
                    key={c.cityName}
                    type="button"
                    onClick={() => handleSelectCity(c)}
                    className="px-2 py-0.5 rounded-lg bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[10px] font-medium transition-colors cursor-pointer"
                  >
                    {c.cityName}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Coordinates Form */}
            <form onSubmit={handleSaveLocation} className="space-y-3 pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Selected Coordinates</span>
                <span className="text-[10px] text-emerald-400 font-normal">● Auto-Calculated</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    City / Place Name
                  </label>
                  <input
                    type="text"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Latitude (-90° to +90°)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Longitude (-180° to +180°)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Timezone Offset (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={timezoneOffset}
                    onChange={(e) => setTimezoneOffset(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Elevation (Meters)
                  </label>
                  <input
                    type="number"
                    value={elevation}
                    onChange={(e) => setElevation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}