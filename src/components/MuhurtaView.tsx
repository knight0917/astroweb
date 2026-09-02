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

export default function MuhurtaView() {
  const { currentDate, location, ayanamsha } = useAstroStore();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(currentDate).toISOString().slice(0, 10)
  );
  const [activeTab, setActiveTab] = useState<"panchang" | "muhurta" | "events" | "chandrabala">("panchang");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all");

  const targetDate = useMemo(() => new Date(selectedDate), [selectedDate]);

  // Muhurta Shuddhi Data
  const dayData: DayPanchangaShuddhi = useMemo(() => {
    return calculateDayMuhurta(targetDate, location);
  }, [targetDate, location]);

  // Complete Dr. Samir Tripathi Vedic Panchanga Data
  const panchangData: DailySamirTripathiPanchang = useMemo(() => {
    return calculateSamirTripathiPanchang(targetDate, location, ayanamsha);
  }, [targetDate, location, ayanamsha]);

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
              Dr. Samir Tripathi Shastra
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            5 Core Angas, Disha Shool & Exit Remedies, Lucky Colors, Day Mantra, Rahu Kaal, Abhijit & 12-Rashi Chandra Bala
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
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Moon Rashi (चन्द्र राशि)</span>
                <span className="text-sm font-bold font-mono text-emerald-300">
                  {panchangData.chandraRashi} ({panchangData.chandraRashiHindi})
                </span>
              </div>
              <span className="text-xl">☽</span>
            </div>
          </div>

          {/* 5 Core Limbs Cards Grid (पञ्चाङ्ग) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* 1. Tithi Card */}
            <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 bg-slate-950/80 shadow-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1.5">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">1. Tithi (तिथि)</span>
                  <span className="text-base">{panchangData.tithi.moonPhaseEmoji}</span>
                </div>
                <div className="mt-2">
                  <h4 className="text-base font-black text-slate-100">{panchangData.tithi.name}</h4>
                  <p className="text-[11px] text-amber-300 font-semibold">{panchangData.tithi.pakshaHindi}</p>
                </div>
                <div className="mt-2 space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-bold text-slate-200">{panchangData.tithi.categoryHindi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deity:</span>
                    <span className="text-slate-300">{panchangData.tithi.deity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Element:</span>
                    <span className="text-slate-300">{panchangData.tithi.tatvaHindi}</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono">
                <span className="text-slate-400 block">Ends at:</span>
                <span className="font-bold text-emerald-400">{panchangData.tithi.endTimeFormatted}</span>
                <span className="text-[10px] text-slate-500 block">{panchangData.tithi.remainingHoursFormatted}</span>
              </div>
            </div>

            {/* 2. Vara Card */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1.5">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">2. Vara (वार)</span>
                  <span className="text-base">📅</span>
                </div>
                <div className="mt-2">
                  <h4 className="text-base font-black text-slate-100">{panchangData.vara.hindiName}</h4>
                  <p className="text-[11px] text-slate-400">{panchangData.vara.dayName}</p>
                </div>
                <div className="mt-2 space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Lord:</span>
                    <span className="font-bold text-amber-300">{panchangData.vara.rulingPlanet}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deity:</span>
                    <span className="text-slate-300 truncate max-w-[120px]" title={panchangData.vara.deity}>
                      {panchangData.vara.deity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tatva:</span>
                    <span className="text-slate-300">{panchangData.vara.tatva}</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px]">
                <span className="text-slate-400 block font-semibold">Auspicious Activities:</span>
                <span className="text-slate-300 text-[10px] line-clamp-2">
                  {panchangData.vara.activitiesFavorable.slice(0, 2).join(", ")}
                </span>
              </div>
            </div>

            {/* 3. Nakshatra Card */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1.5">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">3. Nakshatra (नक्षत्र)</span>
                  <span className="text-base">⭐</span>
                </div>
                <div className="mt-2">
                  <h4 className="text-base font-black text-slate-100">{panchangData.nakshatra.name}</h4>
                  <p className="text-[11px] text-slate-400">Pada {panchangData.nakshatra.pada} • {panchangData.nakshatra.sanskritName}</p>
                </div>
                <div className="mt-2 space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Lord / Devata:</span>
                    <span className="font-bold text-slate-200">{panchangData.nakshatra.lord}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gana / Yoni:</span>
                    <span className="text-slate-300">{panchangData.nakshatra.gana} • {panchangData.nakshatra.yoni.split(" ")[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nature:</span>
                    <span className="text-amber-300 font-semibold">{panchangData.nakshatra.natureHindi}</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono">
                <span className="text-slate-400 block">Ends at:</span>
                <span className="font-bold text-emerald-400">{panchangData.nakshatra.endTimeFormatted}</span>
                <span className="text-[10px] text-slate-500 block">{panchangData.nakshatra.remainingHoursFormatted}</span>
              </div>
            </div>

            {/* 4. Yoga Card */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1.5">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">4. Yoga (योग)</span>
                  <span className="text-base">✨</span>
                </div>
                <div className="mt-2">
                  <h4 className="text-base font-black text-slate-100">{panchangData.yoga.name}</h4>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-block mt-1 ${
                      panchangData.yoga.nature.includes("Ashubha")
                        ? "bg-rose-950 text-rose-300 border border-rose-500"
                        : "bg-emerald-950 text-emerald-300 border border-emerald-500"
                    }`}
                  >
                    {panchangData.yoga.nature.split(" ")[0]}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 line-clamp-3">
                  {panchangData.yoga.description}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono">
                <span className="text-slate-400 block">Ends at:</span>
                <span className="font-bold text-emerald-400">{panchangData.yoga.endTimeFormatted}</span>
              </div>
            </div>

            {/* 5. Karana Card */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1.5">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">5. Karana (करण)</span>
                  <span className="text-base">🛡️</span>
                </div>
                <div className="mt-2">
                  <h4 className="text-base font-black text-slate-100">{panchangData.karana.name}</h4>
                  <p className="text-[11px] text-slate-400">{panchangData.karana.type}</p>
                </div>
                <div className="mt-2 space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Bhadra Status:</span>
                    <span className={`font-bold ${panchangData.karana.isBhadra ? "text-rose-400" : "text-emerald-400"}`}>
                      {panchangData.karana.isBhadra ? "⚠️ Bhadra Active" : "No Bhadra"}
                    </span>
                  </div>
                  {panchangData.karana.isBhadra && panchangData.karana.bhadraVaasHindi && (
                    <div className="text-[10px] text-amber-300 font-bold bg-slate-900 p-1 rounded">
                      {panchangData.karana.bhadraVaasHindi}
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono">
                <span className="text-slate-400 block">Ends at:</span>
                <span className="font-bold text-emerald-400">{panchangData.karana.endTimeFormatted}</span>
              </div>
            </div>
          </div>

          {/* Dr. Samir Tripathi Astrological Advice Grid (दैनिक परामर्श एवं उपाय) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* A. Lucky Color of the Day & Clothing Advice */}
            <div className="glass-panel p-5 rounded-3xl border border-amber-500/40 bg-slate-950/90 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">👕</span>
                  <h3 className="font-black text-xs uppercase tracking-wider text-amber-300">
                    Auspicious Colors & Clothing (आज का शुभ रंग)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Dr. Samir Tripathi Tip</span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-black block mb-1">
                    ✓ Recommended Auspicious Colors (धारण करने योग्य शुभ रंग):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {panchangData.auspiciousColors.map((color, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-rose-400 uppercase font-black block mb-1">
                    ✕ Inauspicious Colors to Avoid Today (वर्जित रंग):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {panchangData.inauspiciousColors.map((color, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-bold"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  Wearing the ruling planet's harmonious color attunes your personal aura with today's planetary vibrations, enhancing confidence and goodwill in negotiations.
                </p>
              </div>
            </div>

            {/* B. Disha Shool & Exit Remedy (घर से निकलने से पूर्व उपाय) */}
            <div className="glass-panel p-5 rounded-3xl border border-amber-500/40 bg-slate-950/90 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧭</span>
                  <h3 className="font-black text-xs uppercase tracking-wider text-amber-300">
                    Disha Shool & Exit Remedy (दिशाशूल एवं उपाय)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-rose-400 font-black">
                  Prohibited: {panchangData.dishaShool.prohibitedDirection.split(" ")[0]}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-start gap-2">
                  <span className="text-rose-400 font-bold text-sm">⚠️</span>
                  <div>
                    <span className="font-bold text-rose-200 block">
                      दिशाशूल: {panchangData.dishaShool.prohibitedDirection}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      {panchangData.dishaShool.reason}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-1">
                  <span className="text-[10px] text-amber-400 uppercase font-black block">
                    🍯 Parihara / Exit Remedy (घर से निकलने से पूर्व अवश्य करें):
                  </span>
                  <p className="text-xs text-amber-200 font-semibold leading-relaxed">
                    {panchangData.exitRemedy}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span>Chandra Vaas (यात्रा में चन्द्र मुख):</span>
                  <span className="text-emerald-400 font-bold">{panchangData.dishaShool.chandraVaas}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mantra of the Day & Charity Card */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/90 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🕉️</span>
                <h3 className="font-black text-xs uppercase tracking-wider text-slate-200">
                  Daily Mantra Sadhana & Recommended Charity (दैनिक मंत्र व दान)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400">Presiding Lord: {panchangData.vara.planetHindi}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-amber-400 uppercase font-black block">
                  📿 Prescribed Beej Mantra of the Day (आज का विशेष मंत्र):
                </span>
                <p className="text-sm font-bold text-slate-100 font-mono leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-amber-500/30">
                  {panchangData.dayMantra}
                </p>
                <span className="text-[10px] text-slate-400 block">
                  Chant at least 11, 21, or 108 times before starting your work to remove malefic influences.
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-emerald-400 uppercase font-black block">
                  🎁 Recommended Charity (आज का शुभ दान):
                </span>
                <p className="text-xs font-semibold text-slate-200 leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30">
                  {panchangData.recommendedCharity}
                </p>
                <span className="text-[10px] text-slate-400 block">
                  Donating these items on this weekday pacifies planetary debilities and invokes divine grace.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUSPICIOUS & INAUSPICIOUS MUHURTAS */}
      {activeTab === "muhurta" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auspicious Muhurtas (शुभ काल) */}
          <div className="glass-panel p-5 rounded-3xl border border-emerald-500/30 bg-slate-950/85 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-black text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>✨</span>
                <span>Auspicious Windows (शुभ मुहूर्त काल)</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Sunrise: {formatTime(dayData.sunrise)}</span>
            </div>

            <div className="space-y-2.5">
              {panchangData.auspiciousMuhurtas.map((m, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 transition-colors ${
                    m.isActiveNow
                      ? "bg-emerald-950/50 border-emerald-400 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400"
                      : "bg-slate-900/90 border-emerald-900/40 hover:border-emerald-500/50"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-xs text-slate-100 flex items-center gap-2">
                      <span>{m.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono">({m.sanskritName})</span>
                      {m.isActiveNow && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 animate-pulse">
                          ACTIVE NOW
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">{m.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0 font-mono">
                    <span className="text-xs font-bold text-emerald-400 block">
                      {m.startFormatted} – {m.endFormatted}
                    </span>
                    <span className="text-[9px] text-slate-400">{m.quality}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inauspicious Periods (वर्ज्य काल / त्याज्य) */}
          <div className="glass-panel p-5 rounded-3xl border border-rose-500/30 bg-slate-950/85 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-black text-xs text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>⚠️</span>
                <span>Inauspicious Windows (राहु काल व त्याज्य समय)</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Sunset: {formatTime(dayData.sunset)}</span>
            </div>

            <div className="space-y-2.5">
              {panchangData.inauspiciousMuhurtas.map((m, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 transition-colors ${
                    m.isActiveNow
                      ? "bg-rose-950/50 border-rose-400 shadow-lg shadow-rose-500/20 ring-1 ring-rose-400"
                      : "bg-slate-900/90 border-rose-900/40 hover:border-rose-500/50"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-xs text-slate-100 flex items-center gap-2">
                      <span>{m.name}</span>
                      <span className="text-[10px] text-rose-400 font-mono">({m.sanskritName})</span>
                      {m.isActiveNow && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-rose-500 text-slate-950 animate-pulse">
                          ACTIVE NOW
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">{m.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0 font-mono">
                    <span className="text-xs font-bold text-rose-400 block">
                      {m.startFormatted} – {m.endFormatted}
                    </span>
                    <span className="text-[9px] text-slate-400">{m.quality}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVENT SUITABILITY */}
      {activeTab === "events" && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/85 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Event Suitability & Muhurta Verdict (कार्य सिद्धि मुहूर्त)
            </h3>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200"
                }`}
              >
                All Events
              </button>
              {eventCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === c.id
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations
              .filter((r) => selectedCategory === "all" || r.category === selectedCategory)
              .map((rec) => {
                const catMeta = eventCategories.find((c) => c.id === rec.category);
                return (
                  <div
                    key={rec.category}
                    className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                      rec.isRecommended
                        ? "bg-slate-900/90 border-emerald-800/60 hover:border-emerald-500"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-sm text-slate-100">
                          {catMeta?.label}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                            rec.isRecommended
                              ? "bg-emerald-950 text-emerald-300 border-emerald-500"
                              : "bg-rose-950 text-rose-300 border-rose-500"
                          }`}
                        >
                          {rec.isRecommended ? "RECOMMENDED" : "AVOID TODAY"}
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono mt-0.5">{catMeta?.hindiLabel}</div>

                      <div className="space-y-1 mt-2 text-xs text-slate-300">
                        {rec.favorableFactors.slice(0, 2).map((f, idx) => (
                          <div key={idx} className="leading-relaxed text-[11px] text-slate-300">
                            • {f}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>Suitability Score:</span>
                        <span className="font-bold text-amber-300">{rec.suitabilityScore}%</span>
                      </div>
                      {rec.bestTimeSlots.length > 0 && (
                        <div className="text-[11px] text-emerald-400 font-semibold truncate">
                          Best: {rec.bestTimeSlots.map((s) => s.name).join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 4: CHANDRA BALA MATRIX FOR ALL 12 RASHIS */}
      {activeTab === "chandrabala" && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/85 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <span>🌙</span>
                <span>Chandra Bala for all 12 Rashis (द्वादश राशि चन्द्र बल)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Transit Moon is currently placed in{" "}
                <span className="text-emerald-400 font-bold font-mono">
                  {panchangData.chandraRashi} ({panchangData.chandraRashiHindi})
                </span>
                . Auspicious houses from Moon: 1st, 3rd, 6th, 7th, 10th, 11th.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
              Classical Muhurta Shastra
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {panchangData.chandraBalaList.map((cb) => (
              <div
                key={cb.rashiIndex}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base text-amber-400">{cb.symbol}</span>
                    <span className="font-bold text-sm text-slate-100">{cb.rashiName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({cb.hindiName})</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${cb.badgeColor}`}>
                    H{cb.houseFromMoon} • {cb.strength.split(" ")[0]}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {cb.guidance}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
