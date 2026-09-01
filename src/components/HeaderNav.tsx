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
  const [showCoordinatesDropdown, setShowCoordinatesDropdown] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);

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

  const ALL_MODULES: {
    category: string;
    items: { mode: ViewMode; label: string; hindiLabel: string; desc: string; badge?: string }[];
  }[] = [
    {
      category: "Charts & Divisionals (कुण्डली एवं वर्ग)",
      items: [
        {
          mode: "kundli-north",
          label: "Traditional Kundli Chart",
          hindiLabel: "जन्म कुण्डली (उत्तर व दक्षिण)",
          desc: "North/South Indian charts with Jaimini Chara Karakas (AK to DK)",
          badge: "Core",
        },
        {
          mode: "shodashavarga",
          label: "16 Vargas (Shodashavarga)",
          hindiLabel: "षोडशवर्ग (D1 - D60)",
          desc: "Complete Parashari 16 divisional charts with interactive inspect",
          badge: "D1–D60",
        },
        {
          mode: "dual",
          label: "Dual 3D + Kundli Split View",
          hindiLabel: "युगल दृश्य (3D + कुण्डली)",
          desc: "Side-by-side interactive 3D SkyDome and Kundli chart",
        },
        {
          mode: "jaimini",
          label: "Jaimini Astrology Suite",
          hindiLabel: "जैमिनी ज्योतिष (कारकांश व आरूढ़)",
          desc: "7 Chara Karakas, 12 Arudha Padas (AL/UL), Karakamsha & Chara Dasha",
          badge: "Jaimini",
        },
        {
          mode: "matchmaking",
          label: "Kundli Milan (36 Gunas)",
          hindiLabel: "अष्टकूट ३६ गुण मिलान",
          desc: "Ashtakoota compatibility, Nadi/Bhakoot cancellation & Manglik check",
          badge: "36 Gunas",
        },
        {
          mode: "adhana",
          label: "Adhana Kundali (Conception Chart)",
          hindiLabel: "आधान कुण्डली (गर्भाधान एवं १० मास)",
          desc: "Epoch conception chart, 10-month foetal development timeline, & Garbha Raksha shield",
          badge: "Epoch",
        },
      ],
    },
    {
      category: "Predictive Timing & Transits (दशा एवं गोचर)",
      items: [
        {
          mode: "dasha",
          label: "Vimshottari Dasha (120 Yrs)",
          hindiLabel: "विम्शोत्तरी दशा चक्र",
          desc: "Complete Mahadasha, Antardasha & Pratyantardasha hierarchy with live active tracker",
          badge: "120 Yrs",
        },
        {
          mode: "gochar",
          label: "Planetary Transits & Sade Sati",
          hindiLabel: "ग्रह गोचर एवं साढ़े साती",
          desc: "Live transits over Natal Moon & Lagna, 5-phase Sade Sati & Dual Transit Chart",
          badge: "Live",
        },
        {
          mode: "prashna",
          label: "Tajik Prashna (Horary)",
          hindiLabel: "ताजिक प्रश्न तन्त्र",
          desc: "16 Tajika Yogas (Ithasala/Ishrafa), query orbs & instant yes/no verdict",
          badge: "Tajika",
        },
      ],
    },
    {
      category: "Classical Strengths & Analysis (बल साधन)",
      items: [
        {
          mode: "shadbala",
          label: "Parashari Shadbala (6-Fold)",
          hindiLabel: "षड्बल (6-अंग ग्रह बल)",
          desc: "Sthan, Dig, Kaal, Cheshta, Naisargika, Drik & Ishta/Kashta Phala",
          badge: "BPHS",
        },
        {
          mode: "bhavabala",
          label: "Bhava Bala (12 House Strengths)",
          hindiLabel: "भाव बल (12 भाव शक्ति)",
          desc: "House Lords, Dig, Drishti & Kendra required Rupas analysis",
        },
        {
          mode: "ashtakavarga",
          label: "Ashtakavarga Matrix Suite",
          hindiLabel: "अष्टकवर्ग चक्र",
          desc: "Sarvashtakavarga 337 bindus & 7 Bhinnashtakavarga score matrices",
        },
      ],
    },
    {
      category: "Panchanga, Calendar & Muhurta (पञ्चाङ्ग एवं मुहूर्त)",
      items: [
        {
          mode: "muhurta",
          label: "Auspicious Muhurta Finder",
          hindiLabel: "शुभ मुहूर्त एवं पञ्चाङ्ग शुद्धि",
          desc: "Abhijit, Brahma, Amrit Kaal, Rahu Kaal, & Event Muhurta Suitability",
          badge: "Muhurta",
        },
        {
          mode: "choghadiya",
          label: "Real-Time Choghadiya & Horas",
          hindiLabel: "चौघड़िया एवं ग्रह होरा",
          desc: "Live Day & Night Choghadiyas, countdown timer, and 24 Planetary Horas",
          badge: "Live",
        },
        {
          mode: "tithi-calendar",
          label: "Vedic Tithi Calendar",
          hindiLabel: "तिथि पञ्चाङ्ग कैलेण्डर",
          desc: "Daily Sunrise Tithi, Moon phases & 50+ festival Shubh Muhurtas",
          badge: "New",
        },
        {
          mode: "tithi-birthday",
          label: "Vedic Tithi Birthday",
          hindiLabel: "तिथि जन्मदिन (तिथि प्रवेश)",
          desc: "Tithi Pravesha exact recurrence and prescribed birthday rituals",
        },
        {
          mode: "numerology",
          label: "Vedic & Chaldean Numerology",
          hindiLabel: "वैदिक अंकशास्त्र",
          desc: "Mulank, Bhagyank, Name Number & Chinese Lo Shu 3x3 Grid",
        },
      ],
    },
    {
      category: "Observatory & Ephemeris (खगोलीय वेधशाला)",
      items: [
        {
          mode: "3d",
          label: "3D Celestial WebGL Dome",
          hindiLabel: "3D खगोलीय आकाश मण्डल",
          desc: "Real-time 3D planetary orbits, Nakshatras & sky coordinates",
        },
        {
          mode: "table",
          label: "Complete Ephemeris Table",
          hindiLabel: "ग्रह स्थिति सारणी",
          desc: "Sidereal degrees, Nakshatras, Padas, Speed & Retrograde status",
        },
        {
          mode: "reviews",
          label: "Client Reviews & Feedback",
          hindiLabel: "समीक्षा एवं प्रतिक्रिया",
          desc: "Community feedback, consultation reviews & feature suggestions stored in DB",
          badge: "DB",
        },
      ],
    },
  ];

  // Find currently active module metadata
  const currentModule = useMemo(() => {
    for (const group of ALL_MODULES) {
      const match = group.items.find((i) => i.mode === viewMode);
      if (match) return match;
    }
    return {
      mode: "kundli-north" as ViewMode,
      label: "Traditional Kundli",
      hindiLabel: "जन्म कुण्डली",
      desc: "",
    };
  }, [viewMode]);

  return (
    <header className="glass-panel sticky top-0 z-40 px-2 sm:px-4 md:px-6 py-2.5 border-b border-slate-800 shadow-xl bg-slate-950/90 backdrop-blur-xl">
      <div className="w-full flex items-center justify-between gap-2 md:gap-4">
        {/* Left: Top Hamburger Menu Button + Logo & Active Module */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Top-Left Hamburger Button */}
          <button
            onClick={() => setShowMenuDrawer(true)}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-amber-400 transition-all flex items-center justify-center cursor-pointer shadow-sm group"
            title="Open Jyotish Modules Menu"
            aria-label="Open Navigation Menu"
          >
            <svg
              className="w-5 h-5 text-slate-300 group-hover:text-amber-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo & Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowMenuDrawer(true)}>
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0 text-slate-950">
              <svg className="w-5 h-5 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            </div>
            <div>
              <h1 className="font-black text-sm md:text-base bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent tracking-tight leading-none">
                VEDIC SKY AI
              </h1>
              <p className="text-[8.5px] md:text-[9.5px] text-slate-400 font-medium hidden sm:block mt-0.5">
                Precision Jyotish Ephemeris
              </p>
            </div>
          </div>

          {/* Active Module Indicator Chip */}
          <button
            onClick={() => setShowMenuDrawer(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-slate-200 transition-all cursor-pointer text-xs"
            title="Click to Switch Module"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/80" />
            <span className="font-bold text-slate-100 text-[11px] md:text-xs">
              {currentModule.label}
            </span>
            <span className="text-[9px] text-slate-500 font-bold ml-0.5">▼</span>
          </button>
        </div>

        {/* Right: Location Chip & Settings */}
        <div className="flex items-center gap-1.5 md:gap-2 text-xs">
          {/* Location Trigger Chip */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 font-semibold transition-all shadow-sm cursor-pointer"
            title="Edit Observer Location & GPS"
          >
            <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div className="text-left">
              <span className="font-bold text-[11px] md:text-xs block max-w-[90px] sm:max-w-[120px] truncate text-slate-100">
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
            aria-label="Settings"
          >
            <svg className="w-4 h-4 text-slate-300 hover:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* SLIDE-OVER LEFT NAVIGATION DRAWER (via Portal) */}
      {mounted && showMenuDrawer && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-stretch bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          {/* Backdrop Click */}
          <div
            className="fixed inset-0"
            onClick={() => setShowMenuDrawer(false)}
          ></div>

          {/* Left Drawer Panel */}
          <div className="relative z-10 glass-panel bg-slate-950/98 border-r border-slate-800 w-full max-w-md h-full p-5 overflow-y-auto space-y-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-250 custom-scrollbar">
            <div className="space-y-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
                    <svg className="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 tracking-wide uppercase">
                      Vedic Sky AI Jyotish Modules
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Select astrological tool or calculation suite
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowMenuDrawer(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer"
                  title="Close Menu"
                >
                  ✕
                </button>
              </div>

              {/* Categorized Module List */}
              <div className="space-y-4">
                {ALL_MODULES.map((group) => (
                  <div key={group.category} className="space-y-1.5">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block px-1">
                      {group.category}
                    </span>

                    <div className="grid grid-cols-1 gap-1.5">
                      {group.items.map((item) => {
                        const isActive = viewMode === item.mode;
                        return (
                          <button
                            key={item.mode}
                            onClick={() => {
                              setViewMode(item.mode);
                              setShowMenuDrawer(false);
                            }}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 group ${
                              isActive
                                ? "bg-amber-500/10 border-amber-400/80 ring-1 ring-amber-400/50 shadow-md"
                                : "bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700"
                            }`}
                          >
                            <div className="pt-1">
                              <span className={`w-1.5 h-1.5 rounded-full block transition-colors ${
                                isActive ? "bg-amber-400 shadow-sm shadow-amber-400" : "bg-slate-600 group-hover:bg-slate-400"
                              }`} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span className={`font-bold text-xs truncate ${isActive ? "text-amber-300" : "text-slate-100"}`}>
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {isActive && (
                                  <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-amber-400/80 font-medium">
                                {item.hindiLabel}
                              </div>
                              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Drawer Footer Settings */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Current Ayanamsha:</span>
                <span className="text-amber-300 font-bold">{ayanamsha}</span>
              </div>
              <button
                onClick={() => {
                  setShowMenuDrawer(false);
                  setShowSettingsDrawer(true);
                }}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Open Full Jyotish Settings</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

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
                  <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
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
                <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <h3 className="font-bold text-base text-slate-100">
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
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="22" y1="12" x2="18" y2="12" />
                <line x1="6" y1="12" x2="2" y2="12" />
                <line x1="12" y1="6" x2="12" y2="2" />
                <line x1="12" y1="22" x2="12" y2="18" />
              </svg>
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
              {/* Collapsible Dropdown Header */}
              <button
                type="button"
                onClick={() => setShowCoordinatesDropdown(!showCoordinatesDropdown)}
                className="w-full text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">📍</span>
                  <span className="group-hover:text-amber-300 transition-colors">
                    Selected Coordinates {cityName ? `(${cityName}${countryName ? `, ${countryName}` : ""})` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-400 font-mono font-normal">
                    {latitude && longitude ? `${parseFloat(latitude).toFixed(2)}°N, ${parseFloat(longitude).toFixed(2)}°E` : "● Auto-Calculated"}
                  </span>
                  <span className="text-xs text-amber-400 font-bold px-1.5 py-0.5 rounded bg-slate-800">
                    {showCoordinatesDropdown ? "▲ Hide" : "▼ Expand / Edit"}
                  </span>
                </div>
              </button>

              {/* Collapsible Inputs Body */}
              {showCoordinatesDropdown && (
                <div className="space-y-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 animate-in fade-in duration-150">
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
                </div>
              )}

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