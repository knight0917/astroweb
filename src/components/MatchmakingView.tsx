"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { calculateVedicEphemeris } from "../engine/ephemeris";
import { calculateMatchmaking, CompatibilityResult, KootaScore } from "../engine/matchmaking";
import { POPULAR_CITIES } from "../engine/constants";
import { EXTENDED_LOCAL_PLACES } from "../engine/geocoding";
import { GeoLocation } from "../engine/types";
import MatchmakingChartsDeck from "./MatchmakingChartsDeck";
import LappingMatrixView from "./LappingMatrixView";

function formatUtcToLocalIso(utcDate: Date, tzOffsetHours: number = 5.5): string {
  const localMs = utcDate.getTime() + tzOffsetHours * 3600 * 1000;
  const d = new Date(localMs);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:${min}`;
}

function parseLocalTimeToUtc(isoString: string, tzOffsetHours: number = 5.5): Date {
  if (!isoString) return new Date();
  const [datePart, timePart] = isoString.split("T");
  if (!datePart || !timePart) return new Date(isoString);
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return new Date(isoString);
  const utcMs = Date.UTC(year, month - 1, day, hour || 0, minute || 0, 0) - tzOffsetHours * 3600 * 1000;
  return new Date(utcMs);
}

export default function MatchmakingView() {
  const {
    currentDate,
    location: activeLocation,
    ayanamsha,
    houseSystem,
    nodeType,
    savedProfiles,
    gender,
    activeProfileName,
    matchmaking,
    setMatchmakingBoy,
    setMatchmakingGirl,
  } = useAstroStore();

  const activeIso = useMemo(() => {
    return formatUtcToLocalIso(currentDate, activeLocation.timezoneOffsetHours || 5.5);
  }, [currentDate, activeLocation]);

  const [boyName, setBoyName] = useState(
    matchmaking?.boy?.name || (gender === "male" ? activeProfileName || "My Chart (वर ♂)" : "Groom (वर)")
  );
  const [boyDate, setBoyDate] = useState(
    matchmaking?.boy?.dateIso || (gender === "male" ? activeIso : "1998-09-05T21:29")
  );
  const [boyCity, setBoyCity] = useState<GeoLocation>(
    matchmaking?.boy?.location || (
      gender === "male"
        ? activeLocation
        : {
            cityName: "Bhuj",
            country: "India",
            latitude: 23.254,
            longitude: 69.6693,
            elevation: 106,
            timezoneOffsetHours: 5.5,
          }
    )
  );
  const [boyCitySearch, setBoyCitySearch] = useState(
    matchmaking?.boy?.location?.cityName || (gender === "male" ? activeLocation.cityName : "Bhuj")
  );
  const [showBoyCityDropdown, setShowBoyCityDropdown] = useState(false);

  const [girlName, setGirlName] = useState(
    matchmaking?.girl?.name || (gender === "female" ? activeProfileName || "My Chart (कन्या ♀)" : "Bride (कन्या)")
  );
  const [girlDate, setGirlDate] = useState(
    matchmaking?.girl?.dateIso || (gender === "female" ? activeIso : "2000-07-04T19:07")
  );
  const [girlCity, setGirlCity] = useState<GeoLocation>(
    matchmaking?.girl?.location || (
      gender === "female"
        ? activeLocation
        : {
            cityName: "Vasai (Mumbai)",
            country: "India",
            latitude: 19.3919,
            longitude: 72.8397,
            elevation: 11,
            timezoneOffsetHours: 5.5,
          }
    )
  );
  const [girlCitySearch, setGirlCitySearch] = useState(
    matchmaking?.girl?.location?.cityName || (gender === "female" ? activeLocation.cityName : "Vasai (Mumbai)")
  );
  const [showGirlCityDropdown, setShowGirlCityDropdown] = useState(false);

  // Auto-sync active chart whenever gender or active profile changes
  useEffect(() => {
    if (gender === "male") {
      setBoyName(activeProfileName || "My Chart (वर ♂)");
      setBoyDate(activeIso);
      setBoyCity(activeLocation);
      setBoyCitySearch(activeLocation.cityName);
    } else {
      setGirlName(activeProfileName || "My Chart (कन्या ♀)");
      setGirlDate(activeIso);
      setGirlCity(activeLocation);
      setGirlCitySearch(activeLocation.cityName);
    }
  }, [gender, activeProfileName, activeIso, activeLocation]);

  // Synchronize state changes directly to the global store for Chatbot awareness
  useEffect(() => {
    setMatchmakingBoy({
      name: boyName,
      dateIso: boyDate,
      location: boyCity,
    });
  }, [boyName, boyDate, boyCity, setMatchmakingBoy]);

  useEffect(() => {
    setMatchmakingGirl({
      name: girlName,
      dateIso: girlDate,
      location: girlCity,
    });
  }, [girlName, girlDate, girlCity, setMatchmakingGirl]);

  const allPlaces = useMemo(() => {
    const list = [...EXTENDED_LOCAL_PLACES];
    if (!list.some((p) => p.cityName.toLowerCase() === "vasai")) {
      list.unshift({
        cityName: "Vasai (Mumbai)",
        country: "India",
        state: "Maharashtra",
        latitude: 19.3919,
        longitude: 72.8397,
        elevation: 11,
        timezoneOffsetHours: 5.5,
        displayName: "Vasai (Mumbai), Maharashtra, India",
      });
    }
    if (!list.some((p) => p.cityName.toLowerCase() === "bhuj")) {
      list.unshift({
        cityName: "Bhuj",
        country: "India",
        state: "Gujarat",
        latitude: 23.254,
        longitude: 69.6693,
        elevation: 106,
        timezoneOffsetHours: 5.5,
        displayName: "Bhuj, Gujarat, India",
      });
    }
    return list;
  }, []);

  const filteredBoyCities = useMemo(() => {
    if (!boyCitySearch.trim()) return allPlaces.slice(0, 10);
    const q = boyCitySearch.toLowerCase();
    return allPlaces.filter(
      (c) =>
        c.cityName.toLowerCase().includes(q) ||
        (c.displayName && c.displayName.toLowerCase().includes(q)) ||
        (c.country && c.country.toLowerCase().includes(q))
    ).slice(0, 15);
  }, [boyCitySearch, allPlaces]);

  const filteredGirlCities = useMemo(() => {
    if (!girlCitySearch.trim()) return allPlaces.slice(0, 10);
    const q = girlCitySearch.toLowerCase();
    return allPlaces.filter(
      (c) =>
        c.cityName.toLowerCase().includes(q) ||
        (c.displayName && c.displayName.toLowerCase().includes(q)) ||
        (c.country && c.country.toLowerCase().includes(q))
    ).slice(0, 15);
  }, [girlCitySearch, allPlaces]);

  // Robust calculation using timezone-independent local-to-UTC resolution
  const boyEphem = useMemo(() => {
    const d = parseLocalTimeToUtc(boyDate, boyCity.timezoneOffsetHours || 5.5);
    return calculateVedicEphemeris(d, boyCity, ayanamsha, houseSystem, nodeType);
  }, [boyDate, boyCity, ayanamsha, houseSystem, nodeType]);

  const girlEphem = useMemo(() => {
    const d = parseLocalTimeToUtc(girlDate, girlCity.timezoneOffsetHours || 5.5);
    return calculateVedicEphemeris(d, girlCity, ayanamsha, houseSystem, nodeType);
  }, [girlDate, girlCity, ayanamsha, houseSystem, nodeType]);

  const matchResult: CompatibilityResult = useMemo(() => {
    return calculateMatchmaking(boyEphem, girlEphem);
  }, [boyEphem, girlEphem]);

  const handleLoadProfile = (profileId: string, target: "boy" | "girl") => {
    const p = savedProfiles.find((x) => x.id === profileId);
    if (!p) return;
    const pDate = new Date(p.dateIso);
    const pTz = p.location.timezoneOffsetHours || 5.5;
    const isoString = formatUtcToLocalIso(pDate, pTz);
    if (target === "boy") {
      setBoyName(p.name);
      setBoyDate(isoString);
      setBoyCity(p.location);
      setBoyCitySearch(p.location.cityName);
    } else {
      setGirlName(p.name);
      setGirlDate(isoString);
      setGirlCity(p.location);
      setGirlCitySearch(p.location.cityName);
    }
  };

  const handleSyncActiveTo = (target: "boy" | "girl") => {
    if (target === "boy") {
      setBoyName(activeProfileName || "My Active Chart (वर ♂)");
      setBoyDate(activeIso);
      setBoyCity(activeLocation);
      setBoyCitySearch(activeLocation.cityName);
    } else {
      setGirlName(activeProfileName || "My Active Chart (कन्या ♀)");
      setGirlDate(activeIso);
      setGirlCity(activeLocation);
      setGirlCitySearch(activeLocation.cityName);
    }
  };

  const kootaList: KootaScore[] = useMemo(() => {
    return Object.values(matchResult.kootas);
  }, [matchResult]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-rose-300 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              Kundli Milan & Compatibility (अष्टकूट ३६ गुण मिलान)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Muhurta Chintamani & Jataka Parijata • Ashtakoota 36-Guna Scoring, Dual Birthplace Geocoding & Gender-Aware Auto-Sync
          </p>
        </div>

        {/* Quick Guna Score Pill */}
        <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800 shadow-inner">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Compatibility Score</span>
            <span className="text-xl font-black text-amber-400">{matchResult.totalScore} / 36 Gunas</span>
          </div>
          <span
            className={`px-2.5 py-1 rounded-xl text-xs font-black border ${
              matchResult.totalScore >= 18
                ? "bg-emerald-950 text-emerald-300 border-emerald-500"
                : "bg-rose-950 text-rose-300 border-rose-500"
            }`}
          >
            {matchResult.verdict}
          </span>
        </div>
      </div>

      {/* Dual Profile Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Groom Profile */}
        <div className="glass-panel p-5 rounded-2xl border border-sky-500/30 bg-slate-950/70 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-sky-400 uppercase tracking-wider flex items-center gap-1">
                <span>♂</span>
                <span>Groom Profile (वर विवरण)</span>
              </h3>
              {gender === "male" && (
                <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-600/50 px-1.5 py-0.5 rounded-full font-bold">
                  Primary Native
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSyncActiveTo("boy")}
                className="px-2 py-1 bg-sky-950/60 hover:bg-sky-900/80 text-sky-300 text-[11px] font-bold rounded-lg border border-sky-700/60 transition-colors cursor-pointer"
                title="Sync current active chart from top bar into Groom profile"
              >
                📥 Sync My Chart
              </button>

              {savedProfiles.length > 0 && (
                <select
                  onChange={(e) => handleLoadProfile(e.target.value, "boy")}
                  className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1 cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>Saved Profiles</option>
                  {savedProfiles.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-bold">Name</label>
              <input
                type="text"
                value={boyName}
                onChange={(e) => setBoyName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-slate-100 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-bold">Date & Time (Local)</label>
              <input
                type="datetime-local"
                value={boyDate}
                onChange={(e) => setBoyDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-slate-100 font-mono font-bold"
              />
            </div>
          </div>

          {/* Groom Birthplace Geocoding Selector */}
          <div className="relative text-xs">
            <label className="text-slate-400 block mb-1 font-bold flex justify-between">
              <span>Birth Place (जन्म स्थान)</span>
              <span className="text-sky-400 font-mono text-[10px]">
                {boyCity.cityName} ({boyCity.latitude.toFixed(2)}°N, {boyCity.longitude.toFixed(2)}°E, TZ: +{boyCity.timezoneOffsetHours}h)
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search city (e.g. Bhuj, Mumbai, Varanasi)..."
                value={boyCitySearch}
                onChange={(e) => {
                  setBoyCitySearch(e.target.value);
                  setShowBoyCityDropdown(true);
                }}
                onFocus={() => setShowBoyCityDropdown(true)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-slate-100 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowBoyCityDropdown(!showBoyCityDropdown)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 cursor-pointer"
              >
                {showBoyCityDropdown ? "Close" : "Select"}
              </button>
            </div>

            {/* City Dropdown */}
            {showBoyCityDropdown && (
              <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl bg-slate-900 border border-sky-500/40 shadow-2xl p-1.5 space-y-1 divide-y divide-slate-800/60">
                {filteredBoyCities.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setBoyCity(c);
                      setBoyCitySearch(c.cityName);
                      setShowBoyCityDropdown(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-sky-950/40 transition-colors flex items-center justify-between text-xs text-slate-200 cursor-pointer"
                  >
                    <span className="font-bold">{c.displayName || c.cityName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {c.latitude.toFixed(2)}°N, {c.longitude.toFixed(2)}°E
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Groom Planetary Diagnostic */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Ascendant (लग्न)</span>
              <span className="font-bold text-sky-300">
                {boyEphem.ascendant.rashi.englishName} ({boyEphem.ascendant.rashi.sanskritName})
              </span>
              <span className="block text-[10px] text-slate-400">
                {(boyEphem.ascendant.siderealLongitude % 30).toFixed(2)}° • {boyEphem.ascendant.nakshatra.sanskritName}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Moon (चन्द्र)</span>
              <span className="font-bold text-amber-300">
                {boyEphem.planets.Moon.rashi.englishName} ({boyEphem.planets.Moon.rashi.sanskritName})
              </span>
              <span className="block text-[10px] text-slate-400">
                {boyEphem.planets.Moon.nakshatra.sanskritName} (Pada {boyEphem.planets.Moon.nakshatra.pada})
              </span>
            </div>
          </div>
        </div>

        {/* Bride Profile */}
        <div className="glass-panel p-5 rounded-2xl border border-pink-500/30 bg-slate-950/70 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-pink-400 uppercase tracking-wider flex items-center gap-1">
                <span>♀</span>
                <span>Bride Profile (कन्या विवरण)</span>
              </h3>
              {gender === "female" && (
                <span className="text-[10px] bg-pink-950 text-pink-300 border border-pink-600/50 px-1.5 py-0.5 rounded-full font-bold">
                  Primary Native
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSyncActiveTo("girl")}
                className="px-2 py-1 bg-pink-950/60 hover:bg-pink-900/80 text-pink-300 text-[11px] font-bold rounded-lg border border-pink-700/60 transition-colors cursor-pointer"
                title="Sync current active chart from top bar into Bride profile"
              >
                📥 Sync My Chart
              </button>

              {savedProfiles.length > 0 && (
                <select
                  onChange={(e) => handleLoadProfile(e.target.value, "girl")}
                  className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1 cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>Saved Profiles</option>
                  {savedProfiles.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-bold">Name</label>
              <input
                type="text"
                value={girlName}
                onChange={(e) => setGirlName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-slate-100 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-bold">Date & Time (Local)</label>
              <input
                type="datetime-local"
                value={girlDate}
                onChange={(e) => setGirlDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-slate-100 font-mono font-bold"
              />
            </div>
          </div>

          {/* Bride Birthplace Geocoding Selector */}
          <div className="relative text-xs">
            <label className="text-slate-400 block mb-1 font-bold flex justify-between">
              <span>Birth Place (जन्म स्थान)</span>
              <span className="text-pink-400 font-mono text-[10px]">
                {girlCity.cityName} ({girlCity.latitude.toFixed(2)}°N, {girlCity.longitude.toFixed(2)}°E, TZ: +{girlCity.timezoneOffsetHours}h)
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search city (e.g. Vasai, Mumbai, Pune, Delhi)..."
                value={girlCitySearch}
                onChange={(e) => {
                  setGirlCitySearch(e.target.value);
                  setShowGirlCityDropdown(true);
                }}
                onFocus={() => setShowGirlCityDropdown(true)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-slate-100 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowGirlCityDropdown(!showGirlCityDropdown)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 cursor-pointer"
              >
                {showGirlCityDropdown ? "Close" : "Select"}
              </button>
            </div>

            {/* City Dropdown */}
            {showGirlCityDropdown && (
              <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl bg-slate-900 border border-pink-500/40 shadow-2xl p-1.5 space-y-1 divide-y divide-slate-800/60">
                {filteredGirlCities.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setGirlCity(c);
                      setGirlCitySearch(c.cityName);
                      setShowGirlCityDropdown(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-pink-950/40 transition-colors flex items-center justify-between text-xs text-slate-200 cursor-pointer"
                  >
                    <span className="font-bold">{c.displayName || c.cityName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {c.latitude.toFixed(2)}°N, {c.longitude.toFixed(2)}°E
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bride Planetary Diagnostic */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Ascendant (लग्न)</span>
              <span className="font-bold text-pink-300">
                {girlEphem.ascendant.rashi.englishName} ({girlEphem.ascendant.rashi.sanskritName})
              </span>
              <span className="block text-[10px] text-slate-400">
                {(girlEphem.ascendant.siderealLongitude % 30).toFixed(2)}° • {girlEphem.ascendant.nakshatra.sanskritName}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Moon (चन्द्र)</span>
              <span className="font-bold text-amber-300">
                {girlEphem.planets.Moon.rashi.englishName} ({girlEphem.planets.Moon.rashi.sanskritName})
              </span>
              <span className="block text-[10px] text-slate-400">
                {girlEphem.planets.Moon.nakshatra.sanskritName} (Pada {girlEphem.planets.Moon.nakshatra.pada})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual D1 & D9 Charts for Groom & Bride */}
      <MatchmakingChartsDeck
        boyEphem={boyEphem}
        girlEphem={girlEphem}
        boyName={boyName}
        girlName={girlName}
      />

      {/* 8 Kootas Detailed Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Ashtakoota 36-Guna Breakdown Table (अष्टकूट सारणी)
        </h3>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                <th className="p-3 font-bold">Koota</th>
                <th className="p-3">Max Gunas</th>
                <th className="p-3">Obtained</th>
                <th className="p-3">Groom Value</th>
                <th className="p-3">Bride Value</th>
                <th className="p-3">Classical Rule & Cancellation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {kootaList.map((k) => (
                <tr key={k.name} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3 font-bold text-slate-200">
                    <div>{k.name}</div>
                    <div className="text-[10px] text-slate-500 font-sans">{k.sanskritName}</div>
                  </td>
                  <td className="p-3 text-slate-400">{k.maxScore}</td>
                  <td className="p-3 font-bold">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        k.obtainedScore === k.maxScore
                          ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50"
                          : k.obtainedScore === 0
                          ? "bg-rose-950/60 text-rose-300 border border-rose-800/50"
                          : "bg-amber-950/60 text-amber-300 border border-amber-800/50"
                      }`}
                    >
                      {k.obtainedScore}
                    </span>
                  </td>
                  <td className="p-3 text-sky-300">{k.boyAttribute}</td>
                  <td className="p-3 text-pink-300">{k.girlAttribute}</td>
                  <td className="p-3 text-slate-300 font-sans text-[11px] leading-relaxed">
                    {k.description}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-700 bg-slate-900/90 text-sm font-bold">
                <td className="p-3 text-slate-200">Total Compatibility Points</td>
                <td className="p-3 text-slate-400">36</td>
                <td className="p-3 text-amber-400 text-base">{matchResult.totalScore}</td>
                <td colSpan={3} className="p-3 text-right">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs uppercase font-black ${
                      matchResult.totalScore >= 18
                        ? "bg-emerald-950 text-emerald-300 border-emerald-500"
                        : "bg-rose-950 text-rose-300 border-rose-500"
                    }`}
                  >
                    {matchResult.verdict}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* D-1 & D-9 Multi-Varga Cross-Synastry (Handwritten Notes & Stri Jataka) */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-slate-950/80 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌸</span>
            <div>
              <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
                D-1 & D-9 Multi-Varga Cross-Synastry (नवांश एवं राशि युगल मिलान)
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Deep soul compatibility, subconscious harmony, and desire fulfillment across Rashi (D-1) and Navamsha (D-9)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Score:</span>
            <span
              className={`px-3 py-1 rounded-xl text-xs uppercase font-black ${
                matchResult.d1d9Synastry.crossSynastryScorePercent >= 70
                  ? "bg-indigo-950 text-indigo-300 border border-indigo-500/50"
                  : matchResult.d1d9Synastry.crossSynastryScorePercent >= 50
                  ? "bg-sky-950 text-sky-300 border border-sky-500/50"
                  : "bg-rose-950 text-rose-300 border border-rose-500/50"
              }`}
            >
              {matchResult.d1d9Synastry.crossSynastryScorePercent}% • {matchResult.d1d9Synastry.verdict}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 1. D-9 Lagna Axis */}
          <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <span>🏛️</span> D-9 Navamsha Lagna Axis
            </span>
            <span className="font-bold text-indigo-300 block text-xs">
              {matchResult.d1d9Synastry.d9LagnaRelationship}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">
              Groom: {matchResult.d1d9Synastry.boyD9LagnaRashi} ⇄ Bride: {matchResult.d1d9Synastry.girlD9LagnaRashi}
            </span>
          </div>

          {/* 2. D-9 Lagna Lord Cross-Placement */}
          <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <span>👑</span> D-9 Lagna Lord Placement
            </span>
            <span className={`font-bold block text-xs ${matchResult.d1d9Synastry.isD9LagnaLordInTrik ? "text-amber-400" : "text-emerald-300"}`}>
              {matchResult.d1d9Synastry.isD9LagnaLordInTrik ? "⚠️ Trik House Caution" : "✓ Fortified Houses"}
            </span>
            <span className="text-[10px] text-slate-400 block font-sans leading-tight">
              Groom Lord in H{matchResult.d1d9Synastry.boyD9LagnaLordInGirlD9House} • Bride Lord in H{matchResult.d1d9Synastry.girlD9LagnaLordInBoyD9House}
            </span>
          </div>

          {/* 3. D-1 to D-9 Moon Resonance */}
          <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <span>🌙</span> D1 to D9 Moon Resonance
            </span>
            <span className="font-bold text-sky-300 block text-xs">
              {matchResult.d1d9Synastry.isMoonD1ToD9Resonance ? "✓ Soul Resonance Active" : "Standard Interface"}
            </span>
            <span className="text-[10px] text-slate-400 block font-sans leading-tight">
              {matchResult.d1d9Synastry.moonResonanceDescription}
            </span>
          </div>

          {/* 4. D-9 4th House & Birth Dasha */}
          <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <span>🏡</span> Domestic Joy & Soul Bond
            </span>
            <span className="font-bold text-purple-300 block text-xs">
              {matchResult.d1d9Synastry.isBirthDashaConnectedToBride ? "✓ Dasha Bond Linked" : "Independent Dasha"}
            </span>
            <span className="text-[10px] text-slate-400 block font-sans leading-tight">
              {matchResult.d1d9Synastry.d9FourthHouseHarmony}
            </span>
          </div>
        </div>
      </div>

            {/* Dr. Samir Tripathi Marriage Masterclass 2 (Sexual Compatibility & Lapping Systems) */}
      <LappingMatrixView
        boyEphem={boyEphem}
        girlEphem={girlEphem}
        boyName={boyName}
        girlName={girlName}
      />

      {/* Classical Ashtakavarga Synastry (C.S. Patel & Parashara) */}
      <div className="glass-panel p-6 rounded-2xl border border-teal-500/30 bg-slate-950/80 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📐</span>
            <div>
              <h3 className="text-sm font-bold text-teal-300 uppercase tracking-wider">
                Classical Ashtakavarga Synastry (अष्टकवर्ग रेखा मिलान — C.S. Patel Standard)
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Energy distribution across Sarvashtakavarga (SAV) and Bhinnashtakavarga (BAV) bindus
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Score:</span>
            <span
              className={`px-3 py-1 rounded-xl text-xs uppercase font-black ${
                matchResult.ashtakavargaCompatibility.ashtakavargaScore >= 75
                  ? "bg-teal-950 text-teal-300 border border-teal-500/50"
                  : matchResult.ashtakavargaCompatibility.ashtakavargaScore >= 50
                  ? "bg-sky-950 text-sky-300 border border-sky-500/50"
                  : "bg-amber-950 text-amber-300 border border-amber-500/50"
              }`}
            >
              {matchResult.ashtakavargaCompatibility.ashtakavargaScore}% • {matchResult.ashtakavargaCompatibility.verdict}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px] font-bold">Lagna SAV Cross-Points</span>
            <span className="text-slate-200 block text-xs">
              Groom in Bride SAV: <strong className="text-teal-300">{matchResult.ashtakavargaCompatibility.boyLagnaSAVInGirlChart} pts</strong>
            </span>
            <span className="text-slate-200 block text-xs">
              Bride in Groom SAV: <strong className="text-teal-300">{matchResult.ashtakavargaCompatibility.girlLagnaSAVInBoyChart} pts</strong>
            </span>
            <span className="text-[10px] text-slate-400 block font-sans">Standard benchmark is ≥ 28 bindus</span>
          </div>

          <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px] font-bold">Moon & Venus BAV Resonance</span>
            <span className="text-slate-200 block text-xs">
              Groom Moon BAV: <strong className="text-amber-300">{matchResult.ashtakavargaCompatibility.boyMoonBAVInGirl}/8</strong>
            </span>
            <span className="text-slate-200 block text-xs">
              Bride Moon BAV: <strong className="text-amber-300">{matchResult.ashtakavargaCompatibility.girlMoonBAVInBoy}/8</strong>
            </span>
            <span className="text-[10px] text-slate-400 block font-sans">Higher BAV indicates emotional peace</span>
          </div>

          <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px] font-bold">7th House SAV Strength</span>
            <span className="text-slate-200 block text-xs">
              Groom 7th House: <strong className="text-sky-300">{matchResult.ashtakavargaCompatibility.boy7thHouseSAV} pts</strong>
            </span>
            <span className="text-slate-200 block text-xs">
              Bride 7th House: <strong className="text-pink-300">{matchResult.ashtakavargaCompatibility.girl7thHouseSAV} pts</strong>
            </span>
            <span className="text-[10px] text-slate-400 block font-sans">Stable marital vessel capacity</span>
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          {matchResult.ashtakavargaCompatibility.principles.map((p, idx) => (
            <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
              <span className="text-teal-400 font-bold">•</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Manglik & Special Dosha Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manglik Assessment */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Manglik Dosha & Bhanga Analysis (माङ्गलिक विचार)
            </h4>
            <span
              className={`text-xs px-2 py-0.5 rounded font-bold border ${
                matchResult.manglikCompatibility.isCompatible
                  ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                  : "bg-rose-950 text-rose-300 border-rose-700"
              }`}
            >
              {matchResult.manglikCompatibility.isCompatible ? "✓ Harmonious Match" : "⚠️ Dosha Caution"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[10px]">Groom Manglik Status</span>
              <span className="font-bold text-slate-200 block mt-0.5">
                {matchResult.boyManglik.isManglik ? "Manglik (माङ्गलिक)" : "Non-Manglik (अमाङ्गलिक)"}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                Mars in House #{matchResult.boyManglik.marsHouseFromLagna} (Severity: {matchResult.boyManglik.severity})
              </span>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[10px]">Bride Manglik Status</span>
              <span className="font-bold text-slate-200 block mt-0.5">
                {matchResult.girlManglik.isManglik ? "Manglik (माङ्गलिक)" : "Non-Manglik (अमाङ्गलिक)"}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                Mars in House #{matchResult.girlManglik.marsHouseFromLagna} (Severity: {matchResult.girlManglik.severity})
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 font-sans">
            {matchResult.manglikCompatibility.description}
          </p>
        </div>

        {/* Final Synthesized Verdict */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Classical Shastric Recommendation (शास्त्रसम्मत निष्कर्ष)
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mt-2.5 font-sans">
              {matchResult.verdictDescription}
            </p>
          </div>

          <div className="bg-purple-950/30 p-3 rounded-xl border border-purple-500/30 text-xs text-purple-200 font-sans">
            <strong>Authentic Vedic Rule:</strong> When both charts have verified coordinates, the Moon Nakshatras, Lagna axes, D-9 Navamsha cross-placements, and Ashtakavarga bindus establish the complete energetic harmony required for lifelong matrimonial bliss.
          </div>
        </div>
      </div>
    </div>
  );
}
