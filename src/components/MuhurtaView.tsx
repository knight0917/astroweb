"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import {
  calculateDayMuhurta,
  evaluateEventMuhurta,
  EventCategory,
  DayPanchangaShuddhi,
  EventMuhurtaRecommendation,
} from "../engine/muhurta";
import {
  calculateSamirTripathiPanchang,
  DailySamirTripathiPanchang,
} from "../engine/samirTripathiPanchang";
import {
  evaluateNakshatraActivation,
  NAKSHATRA_ACTIVATION_TABLE,
} from "../engine/nakshatraActivation";

export default function MuhurtaView() {
  const { currentDate, ephemeris: natalEphemeris, location, ayanamsha } = useAstroStore();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [activeTab, setActiveTab] = useState<"panchang" | "muhurta" | "events" | "chandrabala" | "nakshatra_activation">("panchang");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all");
  const [nakshatraSearch, setNakshatraSearch] = useState("");

  const targetDate = useMemo(() => new Date(selectedDate), [selectedDate]);

  // Muhurta Shuddhi Data
  const dayData: DayPanchangaShuddhi = useMemo(() => {
    return calculateDayMuhurta(targetDate, location);
  }, [targetDate, location]);

  // Complete Dr. Samir Tripathi Vedic Panchanga Data
  const panchangData: DailySamirTripathiPanchang = useMemo(() => {
    return calculateSamirTripathiPanchang(targetDate, location, ayanamsha);
  }, [targetDate, location, ayanamsha]);

  // 27 Nakshatras Activation Milestones for Native
  const nakshatraActivationData = useMemo(() => {
    return evaluateNakshatraActivation(natalEphemeris, new Date(currentDate), targetDate);
  }, [natalEphemeris, currentDate, targetDate]);

  const eventCategories: { id: EventCategory; label: string; hindiLabel: string }[] = [
    { id: "grihaPravesh", label: "Griha Pravesh", hindiLabel: "गृह प्रवेश" },
    { id: "vivaha", label: "Vivaha (Marriage)", hindiLabel: "विवाह मुहूर्त" },
    { id: "businessOpening", label: "Business Opening", hindiLabel: "व्यापार शुभारम्भ" },
    { id: "vehiclePurchase", label: "Vehicle Purchase", hindiLabel: "वाहन क्रय" },
    { id: "propertyRegistration", label: "Property / Land", hindiLabel: "भूमि / भवन क्रय" },
    { id: "generalAuspicious", label: "General Auspicious", hindiLabel: "सामान्य शुभ कार्य" },
  ];

  const recommendations: EventMuhurtaRecommendation[] = useMemo(() => {
    return eventCategories.map((c) => evaluateEventMuhurta(c.id, dayData));
  }, [dayData]);

  const filteredNakshatras = useMemo(() => {
    if (!nakshatraSearch.trim()) return NAKSHATRA_ACTIVATION_TABLE;
    const q = nakshatraSearch.toLowerCase();
    return NAKSHATRA_ACTIVATION_TABLE.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.hindiName.includes(q) ||
        n.rulingPlanet.toLowerCase().includes(q) ||
        n.primaryThemes.toLowerCase().includes(q)
    );
  }, [nakshatraSearch]);

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* 1. Header Hero Banner */}
      <div className="glass-panel p-4 md:p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-950/85 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕉️</span>
            <h2 className="text-xl md:text-2xl font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Vedic Daily Panchanga & Shastric Guidance
            </h2>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
              Dr. Samir Tripathi Suite
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            5 Angas, Disha Shool & Exit Remedies, Lucky Colors, 27 Nakshatra Activation Years, Rahu Kaal & 12-Rashi Chandra Bala
          </p>
        </div>

        {/* Date Selector & Shuddhi Score */}
        <div className="flex items-center gap-3 relative z-10">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 font-mono font-bold cursor-pointer"
          />

          <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 shadow-inner">
            <span className="text-xs text-slate-400 font-bold">Panchanga Shuddhi:</span>
            <span
              className={`font-black text-xs px-2 py-0.5 rounded ${
                panchangData.shuddhiScore >= 70
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-500"
                  : panchangData.shuddhiScore >= 50
                  ? "bg-amber-950 text-amber-300 border border-amber-500"
                  : "bg-rose-950 text-rose-300 border border-rose-500"
              }`}
            >
              {panchangData.shuddhiScore}% ({panchangData.shuddhiScore >= 70 ? "SHUBHA" : "ASHUBHA"})
            </span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("panchang")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "panchang"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black"
              : "bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <span>🌸</span>
          <span>Daily Vedic Panchanga (दैनिक पञ्चाङ्ग)</span>
        </button>

        <button
          onClick={() => setActiveTab("nakshatra_activation")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "nakshatra_activation"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black"
              : "bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <span>⭐</span>
          <span>Nakshatra Activation Timeline (नक्षत्र जागरण वर्ष)</span>
        </button>

        <button
          onClick={() => setActiveTab("muhurta")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "muhurta"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black"
              : "bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <span>⏱️</span>
          <span>Auspicious & Inauspicious Muhurtas (शुभ-अशुभ मुहूर्त)</span>
        </button>

        <button
          onClick={() => setActiveTab("events")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "events"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black"
              : "bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <span>🎯</span>
          <span>Event Suitability (कार्य सिद्धि मुहूर्त)</span>
        </button>

        <button
          onClick={() => setActiveTab("chandrabala")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "chandrabala"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black"
              : "bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <span>🌙</span>
          <span>Chandra Bala (12 राशि चन्द्र बल)</span>
        </button>
      </div>

      {/* TAB 1: DAILY VEDIC PANCHANGA & ASTRO GUIDANCE */}
      {activeTab === "panchang" && (
        <div className="space-y-6">
          {/* Vedic Calendar Context Bar (Amanta/Purnimanta, Samvat, Ayanam, Ritu) */}
          <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">📅</span>
              <div>
                <span className="text-slate-400 font-bold block">Vedic Lunar Month (मास):</span>
                <span className="font-extrabold text-amber-300">
                  {panchangData.lunarMonth.purnimantaMonth} (पूर्णिमांत) / {panchangData.lunarMonth.amantaMonth} (अमांत)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base">☸️</span>
              <div>
                <span className="text-slate-400 font-bold block">Samvat (संवत्):</span>
                <span className="font-extrabold text-slate-200">
                  विक्रम {panchangData.lunarMonth.vikramSamvat} | शक {panchangData.lunarMonth.shakaSamvat}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base">☀️</span>
              <div>
                <span className="text-slate-400 font-bold block">Ayanam & Ritu (अयन एवं ऋतु):</span>
                <span className="font-extrabold text-orange-300">
                  {panchangData.lunarMonth.ayanam} • {panchangData.lunarMonth.ritu}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base">🌘</span>
              <div>
                <span className="text-slate-400 font-bold block">Tithi Span Status:</span>
                <span className="font-bold text-slate-300">
                  {panchangData.tithi.spanStatus.statusText}
                </span>
              </div>
            </div>
          </div>

          {/* Solar & Lunar Ephemeris Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-panel p-3 rounded-2xl border border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Sunrise (सूर्योदय)</span>
                <span className="text-sm font-bold font-mono text-amber-300">{panchangData.sunriseFormatted}</span>
              </div>
              <span className="text-xl">🌅</span>
            </div>

            <div className="glass-panel p-3 rounded-2xl border border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Sunset (सूर्यास्त)</span>
                <span className="text-sm font-bold font-mono text-orange-400">{panchangData.sunsetFormatted}</span>
              </div>
              <span className="text-xl">🌇</span>
            </div>

            <div className="glass-panel p-3 rounded-2xl border border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Day Duration (दिनमान)</span>
                <span className="text-sm font-bold font-mono text-slate-200">{panchangData.dayDurationFormatted}</span>
              </div>
              <span className="text-xl">☀️</span>
            </div>

            <div className="glass-panel p-3 rounded-2xl border border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Moon Phase</span>
                <span className="text-sm font-bold font-mono text-slate-200">
                  {panchangData.tithi.moonPhaseEmoji} {panchangData.tithi.illuminationPercent}%
                </span>
              </div>
              <span className="text-xl">🌙</span>
            </div>
          </div>

          {/* 5 Core Limbs Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. TITHI */}
            <div className="glass-panel p-4 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <span>🌘</span> 1. TITHI (तिथि)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {panchangData.tithi.categoryHindi}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-100">{panchangData.tithi.hindiName}</h3>
                <p className="text-xs text-slate-400">
                  {panchangData.tithi.pakshaHindi} (Paksha) • {panchangData.tithi.tatvaHindi}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Ends At:</span>
                  <span className="font-mono font-bold text-amber-300">{panchangData.tithi.endTimeFormatted}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Countdown:</span>
                  <span className="font-mono">{panchangData.tithi.remainingHoursFormatted}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Deity (देवता):</span>
                  <span className="font-bold text-slate-300">{panchangData.tithi.deity}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                {panchangData.tithi.significance}
              </p>
            </div>

            {/* 2. VARA (WEEKDAY) */}
            <div className="glass-panel p-4 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                  <span>🌅</span> 2. VARA (वार)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30">
                  {panchangData.vara.rulingPlanet}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-100">{panchangData.vara.hindiName}</h3>
                <p className="text-xs text-slate-400">{panchangData.vara.planetHindi}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Presiding Deity:</span>
                  <span className="font-bold text-amber-300">{panchangData.vara.deity}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Element (तत्व):</span>
                  <span>{panchangData.vara.tatva}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300">
                <span className="font-bold text-amber-300 block">Favorable Deeds:</span>
                {panchangData.vara.activitiesFavorable.slice(0, 2).join(", ")}
              </div>
            </div>

            {/* 3. NAKSHATRA */}
            <div className="glass-panel p-4 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                  <span>⭐</span> 3. NAKSHATRA (नक्षत्र)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 font-bold border border-yellow-500/30">
                  {panchangData.nakshatra.natureHindi}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-100">
                  {panchangData.nakshatra.hindiName} (पद {panchangData.nakshatra.pada})
                </h3>
                <p className="text-xs text-slate-400">
                  Lord: <span className="font-bold text-amber-300">{panchangData.nakshatra.lord}</span> • Deity: {panchangData.nakshatra.deity}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Ends At:</span>
                  <span className="font-mono font-bold text-yellow-300">{panchangData.nakshatra.endTimeFormatted}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Gana / Yoni:</span>
                  <span>{panchangData.nakshatra.gana} • {panchangData.nakshatra.yoni}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Nature (प्रकृति):</span>
                  <span>{panchangData.nakshatra.nature}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                {panchangData.nakshatra.favorableActivities}
              </p>
            </div>

            {/* 4. YOGA */}
            <div className="glass-panel p-4 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>🧘</span> 4. YOGA (योग)
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    panchangData.yoga.nature.includes("Ashubha")
                      ? "bg-rose-950 text-rose-300 border-rose-500"
                      : "bg-emerald-950 text-emerald-300 border-emerald-500"
                  }`}
                >
                  {panchangData.yoga.nature.split(" ")[0]}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-100">{panchangData.yoga.hindiName}</h3>
                <p className="text-xs text-slate-400">Deity: {panchangData.yoga.deity}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Ends At:</span>
                  <span className="font-mono font-bold text-emerald-300">{panchangData.yoga.endTimeFormatted}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {panchangData.yoga.description}
                </div>
              </div>

              <div className="text-[11px] space-y-1">
                <div className="text-emerald-300 font-semibold">
                  <span>✓ Favorable: </span>
                  <span className="text-slate-300 font-normal">{panchangData.yoga.favorableActs}</span>
                </div>
                <div className="text-rose-300 font-semibold">
                  <span>✕ Avoid: </span>
                  <span className="text-slate-400 font-normal">{panchangData.yoga.prohibitedActs}</span>
                </div>
              </div>
            </div>

            {/* 5. KARANA */}
            <div className="glass-panel p-4 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                  <span>⚖️</span> 5. KARANA (करण)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  {panchangData.karana.type}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-100">{panchangData.karana.hindiName}</h3>
                <p className="text-xs text-slate-400">Deity: {panchangData.karana.rulingDeity}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Ends At:</span>
                  <span className="font-mono font-bold text-purple-300">{panchangData.karana.endTimeFormatted}</span>
                </div>
                {panchangData.karana.isBhadra && (
                  <div className="mt-1 pt-1 border-t border-slate-800">
                    <span className="text-rose-400 font-bold block">
                      ⚠️ Bhadra Vaas: {panchangData.karana.bhadraVaasHindi}
                    </span>
                    <p className="text-[11px] text-slate-300 mt-0.5">{panchangData.karana.bhadraImpact}</p>
                  </div>
                )}
              </div>

              {!panchangData.karana.isBhadra && (
                <p className="text-[11px] text-emerald-400 font-semibold">
                  ✅ Non-Bhadra Karana: Smooth flow for routine and auspicious activities.
                </p>
              )}
            </div>

            {/* 6. DISHA SHOOL & TRAVEL REMEDY */}
            <div className="glass-panel p-4 rounded-3xl border border-rose-900/40 bg-slate-950/90 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <span>🧭</span> DISHA SHOOL (दिशाशूल)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 font-bold border border-rose-500">
                  PROHIBITED: {panchangData.dishaShool.prohibitedDirection.split(" ")[0]}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-rose-200">
                  {panchangData.dishaShool.prohibitedDirection}
                </h3>
                <p className="text-xs text-slate-400">
                  Chandra Vaas (यात्रा में चन्द्र): <span className="text-amber-300 font-bold">{panchangData.dishaShool.chandraVaas}</span>
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                <span className="text-amber-300 font-bold block">🍯 Exit Remedy (घर से निकलने से पूर्व उपाय):</span>
                <p className="text-slate-300 text-[11px] leading-relaxed font-serif">
                  {panchangData.exitRemedy}
                </p>
              </div>
            </div>
          </div>

          {/* ASTRO GUIDANCE BANNER: LUCKY CLOTHING COLORS, MANTRA & CHARITY */}
          <div className="glass-panel p-5 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-950 to-slate-950 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌟</span>
              <h3 className="text-base font-black text-amber-300">
                Dr. Samir Tripathi Daily Shastric Astro Guidance (दैनिक ज्योतिषीय परामर्श)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Lucky Colors */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <span>👕</span> Lucky Clothing Colors (आज का शुभ रंग)
                </span>
                <div className="space-y-1">
                  <div className="text-xs text-slate-200 font-semibold">
                    <span className="text-emerald-400">✓ Wear: </span>
                    {panchangData.auspiciousColors.join(", ")}
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="text-rose-400">✕ Avoid: </span>
                    {panchangData.inauspiciousColors.join(", ")}
                  </div>
                </div>
              </div>

              {/* Prescribed Day Mantra */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                  <span>🕉️</span> Prescribed Day Mantra (दैनिक मंत्र)
                </span>
                <p className="text-xs font-mono text-yellow-200 bg-slate-950 p-2 rounded-xl border border-yellow-500/20 leading-relaxed font-bold">
                  {panchangData.dayMantra}
                </p>
              </div>

              {/* Recommended Charity */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                  <span>🎁</span> Recommended Charity (आज का दान)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {panchangData.recommendedCharity}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NAKSHATRA ACTIVATION TIMELINE */}
      {activeTab === "nakshatra_activation" && (
        <div className="space-y-6">
          {/* Hero Awakening Summary */}
          <div className="glass-panel p-5 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <div>
                  <h3 className="text-base md:text-lg font-black text-amber-300">
                    27 Nakshatras Cosmic Activation Timeline (नक्षत्र जागरण वर्ष)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Dr. Samir Tripathi & Nadi Shastra Matrix: When your natal Nakshatras awaken to trigger career, fortune, and spiritual turning points
                  </p>
                </div>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-sm">
                Current Age: {nakshatraActivationData.completedAge} Yrs (Running {nakshatraActivationData.runningYear}th Yr)
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed">
              {nakshatraActivationData.executiveSynthesis}
            </div>
          </div>

          {/* 5 Vital Points Awakening Grid */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-200 flex items-center gap-2">
              <span>🪐</span> Your 5 Vital Natal Nakshatras & Activation Milestones
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nakshatraActivationData.vitalPoints.map((vp, idx) => (
                <div
                  key={idx}
                  className={`glass-panel p-4 rounded-3xl border transition-all space-y-3 ${
                    vp.isActiveNow
                      ? "border-amber-500 bg-amber-950/20 shadow-lg shadow-amber-500/10"
                      : vp.activationStatus.includes("Upcoming")
                      ? "border-slate-700 bg-slate-950/80"
                      : "border-slate-800 bg-slate-950/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">{vp.pointType}</span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-black border ${
                        vp.isActiveNow
                          ? "bg-amber-500 text-slate-950 border-amber-400 animate-pulse"
                          : vp.activationStatus.includes("Upcoming")
                          ? "bg-blue-950 text-blue-300 border-blue-500"
                          : "bg-slate-900 text-slate-400 border-slate-700"
                      }`}
                    >
                      {vp.isActiveNow
                        ? "🌟 ACTIVE NOW"
                        : vp.activationStatus.includes("Upcoming")
                        ? `⏳ AT AGE ${vp.closestActivationAge}`
                        : "✓ ACTIVATED"}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-lg font-black text-slate-100">
                      {vp.nakshatraName} ({vp.hindiName}) <span className="text-xs text-slate-400 font-normal">Pada {vp.pada}</span>
                    </h5>
                    <p className="text-xs text-amber-300 font-semibold">
                      Seated: {vp.planetOccupant}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Activation Ages:</span>
                      <span className="font-mono font-bold text-amber-300">{vp.activationAges.join(", ")} Years</span>
                    </div>
                    {vp.activationStatus.includes("Upcoming") && (
                      <div className="flex justify-between text-blue-300 text-[11px]">
                        <span>Time Remaining:</span>
                        <span className="font-bold font-mono">~{vp.yearsUntilActivation} years away</span>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {vp.phalaDescription}
                  </p>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300/90">
                    <span className="font-bold block">🕉️ Parihara / Remedy:</span>
                    <span className="text-slate-300">{vp.remedy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complete 27 Nakshatras Reference Table */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-slate-200">
                  📜 Complete 27 Nakshatras Activation Master Directory
                </h4>
                <p className="text-xs text-slate-400">
                  Search by Nakshatra name, deity, or themes
                </p>
              </div>

              <input
                type="text"
                placeholder="Search Nakshatra (e.g. Rohini, Ashwini)..."
                value={nakshatraSearch}
                onChange={(e) => setNakshatraSearch(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 w-64"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] uppercase bg-slate-900/90 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Nakshatra</th>
                    <th className="py-2.5 px-3">Lord & Deity</th>
                    <th className="py-2.5 px-3">Activation Ages</th>
                    <th className="py-2.5 px-3">Primary Manifestation</th>
                    <th className="py-2.5 px-3">Prescribed Remedy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredNakshatras.map((n) => (
                    <tr key={n.index} className="hover:bg-slate-900/40">
                      <td className="py-2 px-3 font-mono text-slate-400">{n.index + 1}</td>
                      <td className="py-2 px-3 font-bold text-slate-200">
                        {n.name} ({n.hindiName})
                        <span className="block text-[10px] text-slate-400 font-normal">{n.symbol}</span>
                      </td>
                      <td className="py-2 px-3 text-slate-300">
                        <span className="font-bold text-amber-300">{n.rulingPlanet}</span>
                        <span className="block text-[10px] text-slate-400">{n.rulingDeity}</span>
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-amber-400">
                        {n.activationAges.join(", ")} Yrs
                      </td>
                      <td className="py-2 px-3 text-slate-300 max-w-xs">{n.materialManifestation}</td>
                      <td className="py-2 px-3 text-slate-400 text-[11px] max-w-xs">{n.remedyUpaya}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUSPICIOUS & INAUSPICIOUS MUHURTAS */}
      {activeTab === "muhurta" && (
        <div className="space-y-6">
          {/* Auspicious Muhurtas */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-emerald-400 flex items-center gap-2">
              <span>✨</span> Auspicious Muhurtas (शुभ मुहूर्त काल)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {panchangData.auspiciousMuhurtas.map((m, idx) => (
                <div
                  key={idx}
                  className={`glass-panel p-4 rounded-2xl border transition-all space-y-2 ${
                    m.isActiveNow
                      ? "border-emerald-500 bg-emerald-950/30 shadow-lg shadow-emerald-500/20"
                      : "border-slate-800 bg-slate-950/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">{m.hindiName}</span>
                    {m.isActiveNow && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 animate-pulse">
                        ACTIVE NOW
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-emerald-300 font-bold bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <span>{m.startFormatted} – {m.endFormatted}</span>
                    <span className="text-slate-400 text-[10px]">{m.durationFormatted}</span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">{m.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Inauspicious Muhurtas */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-rose-400 flex items-center gap-2">
              <span>⚠️</span> Inauspicious Kaalas (अशुभ एवं त्याज्य काल)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {panchangData.inauspiciousMuhurtas.map((m, idx) => (
                <div
                  key={idx}
                  className={`glass-panel p-4 rounded-2xl border transition-all space-y-2 ${
                    m.isActiveNow
                      ? "border-rose-500 bg-rose-950/40 shadow-lg shadow-rose-500/20"
                      : "border-slate-800 bg-slate-950/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300 text-sm">{m.hindiName}</span>
                    {m.isActiveNow && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500 text-slate-950 animate-pulse">
                        AVOID NOW
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-rose-300 font-bold bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <span>{m.startFormatted} – {m.endFormatted}</span>
                    <span className="text-slate-400 text-[10px]">{m.durationFormatted}</span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EVENT SUITABILITY */}
      {activeTab === "events" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-amber-500 text-slate-950 font-black"
                  : "bg-slate-900 text-slate-400 border border-slate-800"
              }`}
            >
              All Events (समस्त कार्य)
            </button>
            {eventCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? "bg-amber-500 text-slate-950 font-black"
                    : "bg-slate-900 text-slate-400 border border-slate-800"
                }`}
              >
                {c.hindiLabel}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations
              .filter((r) => selectedCategory === "all" || r.category === selectedCategory)
              .map((rec, idx) => (
                <div
                  key={idx}
                  className={`glass-panel p-5 rounded-3xl border transition-all space-y-3 ${
                    rec.isRecommended
                      ? "border-emerald-500/40 bg-emerald-950/10"
                      : "border-slate-800 bg-slate-950/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-black text-slate-100">
                        {eventCategories.find((c) => c.id === rec.category)?.hindiLabel}
                      </h4>
                      <span className="text-xs text-slate-400">
                        {eventCategories.find((c) => c.id === rec.category)?.label}
                      </span>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-xl font-bold border ${
                        rec.isRecommended
                          ? "bg-emerald-950 text-emerald-300 border-emerald-500"
                          : "bg-slate-900 text-slate-400 border-slate-700"
                      }`}
                    >
                      {rec.suitabilityScore}% ({rec.isRecommended ? "RECOMMENDED" : "CAUTION"})
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-serif">
                    {rec.isRecommended
                      ? "This date aligns with favorable Tithi, Vara, and Nakshatra configurations for this event."
                      : "Certain planetary limbs or doshas are present; exercise caution or select an auspicious slot."}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
                    {rec.favorableFactors.length > 0 && (
                      <div className="text-emerald-300">
                        <span className="font-bold">✓ Favorable: </span>
                        <span className="text-slate-300">{rec.favorableFactors.join(", ")}</span>
                      </div>
                    )}
                    {rec.unfavorableFactors.length > 0 && (
                      <div className="text-rose-300">
                        <span className="font-bold">✕ Unfavorable: </span>
                        <span className="text-slate-400">{rec.unfavorableFactors.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 5: 12-RASHI CHANDRA BALA */}
      {activeTab === "chandrabala" && (
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-amber-300">
                12-Rashi Chandra Bala Matrix (चन्द्र बल निर्णय)
              </h3>
              <p className="text-xs text-slate-400">
                Current Moon Transit: <span className="text-amber-300 font-bold">{panchangData.chandraRashi} ({panchangData.chandraRashiHindi})</span>
              </p>
            </div>
            <span className="text-xs text-slate-400">
              Classical Law: 1, 3, 6, 7, 10, 11 from Moon are Shubha; 4, 8, 12 require Caution
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {panchangData.chandraBalaList.map((cb) => (
              <div
                key={cb.rashiIndex}
                className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cb.symbol}</span>
                    <h4 className="font-black text-slate-100 text-sm">
                      {cb.rashiName} ({cb.hindiName})
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">H{cb.houseFromMoon}</span>
                </div>

                <div className={`text-[10px] px-2 py-0.5 rounded-full border text-center ${cb.badgeColor}`}>
                  {cb.strength}
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{cb.guidance}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
