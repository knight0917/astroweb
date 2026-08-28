"use client";

import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useAstroStore } from "../store/useAstroStore";
import {
  getMonthlyTithiCalendar,
  DailyTithiPanchanga,
  FestivalEvent,
} from "../engine/tithiCalendar";

export default function TithiCalendarView() {
  const { location, ayanamsha, setDate } = useAstroStore();

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1); // 1-12
  const [viewTab, setViewTab] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<"all" | "festivals" | "vrats" | "purnima_amavasya">("all");
  const [selectedDay, setSelectedDay] = useState<DailyTithiPanchanga | null>(null);

  // Compute monthly calendar data
  const calendarData = useMemo(() => {
    return getMonthlyTithiCalendar(selectedYear, selectedMonth, location, ayanamsha);
  }, [selectedYear, selectedMonth, location, ayanamsha]);

  // Navigation helpers
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedYear((prev) => prev - 1);
      setSelectedMonth(12);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedYear((prev) => prev + 1);
      setSelectedMonth(1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const handleGoToday = () => {
    setSelectedYear(today.getFullYear());
    setSelectedMonth(today.getMonth() + 1);
  };

  // Filter days for list view or grid highlight
  const filteredDays = useMemo(() => {
    return calendarData.days.filter((d) => {
      if (filterType === "festivals") return d.festivals.length > 0;
      if (filterType === "vrats") return d.isEkadashi || d.isPradosh || d.isShivaratri || d.festivals.some((f) => f.category === "vrat");
      if (filterType === "purnima_amavasya") return d.isPurnima || d.isAmavasya;
      return true;
    });
  }, [calendarData, filterType]);

  const weekDayHeaders = [
    { short: "Sun", hindi: "रवि", lord: "☉ Sun" },
    { short: "Mon", hindi: "सोम", lord: "☽ Moon" },
    { short: "Tue", hindi: "मंगल", lord: "♂ Mars" },
    { short: "Wed", hindi: "बुध", lord: "☿ Merc" },
    { short: "Thu", hindi: "गुरु", lord: "♃ Jup" },
    { short: "Fri", hindi: "शुक्र", lord: "♀ Ven" },
    { short: "Sat", hindi: "शनि", lord: "♄ Sat" },
  ];

  return (
    <div className="glass-panel p-3.5 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4 max-w-full">
      {/* 1. Header & Navigation Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider">
                Vedic Tithi & Panchanga Calendar (तिथि पञ्चाङ्ग कैलेण्डर)
              </h2>
              <p className="text-[11px] text-slate-400">
                Daily Sunrise Tithi (*Udaya Tithi*), Moon Phases & Auspicious Festivals / Vrats
              </p>
            </div>
          </div>
        </div>

        {/* Month / Year Navigator Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Previous Month */}
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-amber-400 text-xs font-bold transition-all cursor-pointer"
            title="Previous Month"
          >
            ◀
          </button>

          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            className="bg-slate-900 border border-slate-700 text-slate-100 font-extrabold text-xs rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            {[
              "January (पौष/माघ)", "February (माघ/फाल्गुन)", "March (फाल्गुन/चैत्र)",
              "April (चैत्र/वैशाख)", "May (वैशाख/ज्येष्ठ)", "June (ज्येष्ठ/आषाढ)",
              "July (आषाढ/श्रावण)", "August (श्रावण/भाद्रपद)", "September (भाद्रपद/अश्विन)",
              "October (अश्विन/कार्तिक)", "November (कार्तिक/मार्गशीर्ष)", "December (मार्गशीर्ष/पौष)"
            ].map((mName, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {mName}
              </option>
            ))}
          </select>

          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="bg-slate-900 border border-slate-700 text-slate-100 font-mono font-extrabold text-xs rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            {Array.from({ length: 41 }, (_, i) => 1990 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Next Month */}
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-amber-400 text-xs font-bold transition-all cursor-pointer"
            title="Next Month"
          >
            ▶
          </button>

          {/* Today Button */}
          <button
            onClick={handleGoToday}
            className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
          >
            Today
          </button>
        </div>
      </div>

      {/* 2. Monthly Summary Highlights Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xl">🌕</span>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Full Moon (पूर्णिमा)</span>
            <span className="font-extrabold text-amber-300">
              {calendarData.purnimaDate ? calendarData.purnimaDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xl">🌑</span>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">New Moon (अमावस्या)</span>
            <span className="font-extrabold text-slate-200">
              {calendarData.amavasyaDate ? calendarData.amavasyaDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Ekadashi Fasts (एकादशी)</span>
            <span className="font-extrabold text-amber-400">
              {calendarData.ekadashiDates.map((d) => d.getDate()).join(", ") || "—"} {calendarData.monthName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Pradosh Vrats (प्रदोष)</span>
            <span className="font-extrabold text-cyan-300">
              {calendarData.pradoshDates.map((d) => d.getDate()).join(", ") || "—"} {calendarData.monthName}
            </span>
          </div>
        </div>
      </div>

      {/* 3. View Switcher & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">Filter:</span>
          {[
            { id: "all", label: `All Days (${calendarData.totalDays})` },
            { id: "festivals", label: `Festivals (${calendarData.majorFestivals.length})` },
            { id: "vrats", label: `Vrats & Fasts` },
            { id: "purnima_amavasya", label: `Moon Phases` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                filterType === f.id
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* View Mode Switcher (Grid / List) */}
        <div className="flex bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setViewTab("grid")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewTab === "grid" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Grid View</span>
          </button>
          <button
            onClick={() => setViewTab("list")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewTab === "list" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Festivals List</span>
          </button>
        </div>
      </div>

      {/* 4. CALENDAR GRID VIEW */}
      {viewTab === "grid" && (
        <div className="overflow-x-auto custom-scrollbar">
          <div className="min-w-[680px] w-full border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/80 shadow-2xl">
            {/* Weekday Header Row */}
            <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-900/90 text-center text-xs font-bold divide-x divide-slate-800/80">
              {weekDayHeaders.map((w, idx) => (
                <div key={w.short} className="py-2 px-1">
                  <div className={`font-black ${idx === 0 ? "text-amber-400" : "text-slate-200"}`}>
                    {w.short} ({w.hindi})
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono font-normal">
                    {w.lord}
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar Day Cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-800/60 bg-slate-950/50">
              {/* Padding empty days before day 1 */}
              {Array.from({ length: calendarData.paddingBefore }).map((_, idx) => (
                <div key={`pad-before-${idx}`} className="h-28 p-1.5 bg-slate-950/20 opacity-30" />
              ))}

              {/* Month Days */}
              {calendarData.days.map((day) => {
                const isSelected = selectedDay?.dayOfMonth === day.dayOfMonth;
                const isMatchingFilter =
                  filterType === "all" ||
                  (filterType === "festivals" && day.festivals.length > 0) ||
                  (filterType === "vrats" && (day.isEkadashi || day.isPradosh || day.isShivaratri || day.festivals.some((f) => f.category === "vrat"))) ||
                  (filterType === "purnima_amavasya" && (day.isPurnima || day.isAmavasya));

                return (
                  <div
                    key={day.dayOfMonth}
                    onClick={() => setSelectedDay(day)}
                    title={`${day.dateString}: ${day.lunarMonth.hindiName} (${day.lunarMonth.name} Masa) - ${day.tithi.paksha} ${day.tithi.name} • Nakshatra: ${day.nakshatra.name}`}
                    className={`min-h-[112px] p-1.5 flex flex-col justify-between transition-all cursor-pointer relative group ${
                      isSelected
                        ? "bg-amber-500/20 ring-2 ring-inset ring-amber-400 z-10"
                        : day.isToday
                        ? "bg-amber-950/30 ring-1 ring-inset ring-amber-500/50"
                        : day.isPurnima
                        ? "bg-amber-500/10"
                        : day.isAmavasya
                        ? "bg-slate-900/80"
                        : "hover:bg-slate-900/60"
                    } ${!isMatchingFilter ? "opacity-35" : "opacity-100"}`}
                  >
                    {/* Top Date & Moon Phase Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-xs font-black font-mono w-5 h-5 rounded-full flex items-center justify-center ${
                            day.isToday
                              ? "bg-amber-500 text-slate-950"
                              : day.isPurnima
                              ? "bg-amber-300 text-slate-950"
                              : "text-slate-200"
                          }`}
                        >
                          {day.dayOfMonth}
                        </span>
                        {day.isToday && (
                          <span className="text-[8px] font-bold text-amber-400 uppercase tracking-tighter">
                            TODAY
                          </span>
                        )}
                      </div>

                      {/* Moon Phase Icon with Tooltip */}
                      <span className="text-sm" title={`Moon Illumination: ${day.tithi.illuminationPercent}%`}>
                        {day.tithi.moonPhaseEmoji}
                      </span>
                    </div>

                    {/* Middle: Tithi Name Badge */}
                    <div className="my-1 space-y-0.5">
                      <div
                        className={`text-[9.5px] font-extrabold truncate px-1 py-0.5 rounded ${
                          day.tithi.paksha === "Shukla"
                            ? "bg-slate-800/80 text-amber-200"
                            : "bg-slate-900/90 text-slate-300"
                        }`}
                        title={`Tithi: ${day.tithi.name} (${day.tithi.paksha})\nEnds: ${day.tithi.endTimeFormatted}${day.tithi.remainingHoursFormatted ? ` (${day.tithi.remainingHoursFormatted})` : ""}`}
                      >
                        <span className="opacity-75 text-[8px]">{day.tithi.paksha === "Shukla" ? "⚪ S." : "⚫ K."}</span>{" "}
                        <span>{day.tithi.name}</span>
                      </div>

                      <div
                        className="text-[8.5px] text-slate-400 font-mono truncate px-0.5"
                        title={`Nakshatra: ${day.nakshatra.name}\nEnds: ${day.nakshatra.endTimeFormatted}`}
                      >
                        ✨ {day.nakshatra.name}
                      </div>
                    </div>

                    {/* Bottom: Festival / Vrat Badges */}
                    <div className="space-y-0.5">
                      {day.festivals.slice(0, 2).map((fest) => (
                        <div
                          key={fest.id}
                          className={`text-[8.5px] font-bold truncate px-1 py-0.5 rounded border shadow-sm ${fest.badgeColor}`}
                          title={fest.name}
                        >
                          {fest.name}
                        </div>
                      ))}
                      {day.festivals.length > 2 && (
                        <div className="text-[7.5px] text-amber-400 font-bold px-0.5">
                          +{day.festivals.length - 2} more celebrations
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Padding empty days after last day */}
              {Array.from({ length: calendarData.paddingAfter }).map((_, idx) => (
                <div key={`pad-after-${idx}`} className="h-28 p-1.5 bg-slate-950/20 opacity-30" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. FESTIVALS & VRATS LIST VIEW */}
      {viewTab === "list" && (
        <div className="space-y-2">
          {calendarData.majorFestivals.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No specific major festivals flagged for this selected month.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {calendarData.majorFestivals.map(({ date, dateFormatted, festival }) => (
                <div
                  key={festival.id}
                  onClick={() => {
                    const dayObj = calendarData.days.find((d) => d.dayOfMonth === date.getDate());
                    if (dayObj) setSelectedDay(dayObj);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:scale-[1.01] shadow-lg ${
                    festival.badgeColor.includes("bg-amber") || festival.badgeColor.includes("from-amber")
                      ? "bg-amber-950/25 border-amber-500/40 hover:border-amber-400"
                      : festival.badgeColor.includes("bg-purple")
                      ? "bg-purple-950/25 border-purple-500/40 hover:border-purple-400"
                      : festival.badgeColor.includes("bg-red")
                      ? "bg-red-950/25 border-red-500/40 hover:border-red-400"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-slate-950/90 text-amber-300 border border-slate-800">
                        🗓️ {dateFormatted}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        {festival.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5 mt-1">
                      <span>{festival.name}</span>
                    </h3>
                    <div className="text-xs text-amber-400 font-medium">{festival.hindiName}</div>

                    {festival.deity && (
                      <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-1">
                        <span className="text-amber-400 font-bold">Deity:</span>
                        <span>{festival.deity}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {festival.significance}
                    </p>

                    {festival.muhurta && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-amber-300 flex items-center gap-1">
                            <span>⏰</span>
                            <span>{festival.muhurta.hindiTitle || festival.muhurta.title}:</span>
                          </span>
                          <span className="font-black text-amber-200 font-mono bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/40">
                            {festival.muhurta.timeRange}
                          </span>
                        </div>

                        {festival.muhurta.isAvoidBhadra && (
                          <div className="text-[11px] text-rose-300 font-bold flex items-center gap-1">
                            <span>⚠️</span>
                            <span>भद्रा काल निषेध: {festival.muhurta.bhadraEndTime}</span>
                          </div>
                        )}

                        {festival.muhurta.specialAuspiciousPeriod && (
                          <div className="text-[10.5px] text-slate-300">
                            <span className="text-amber-400 font-semibold">सर्वश्रेष्ठ समय: </span>
                            <span>{festival.muhurta.specialAuspiciousPeriod}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {festival.ritual && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 bg-slate-950/50 p-2 rounded-xl">
                      <span className="font-bold text-amber-400 block mb-0.5">🌟 Prescribed Vidhi & Ritual:</span>
                      <span>{festival.ritual}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. DAY PANCHANGA & FESTIVAL INSPECTOR MODAL (via Portal) */}
      {selectedDay &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
            <div className="fixed inset-0" onClick={() => setSelectedDay(null)}></div>

            <div className="relative z-10 glass-panel bg-slate-950 border border-slate-800 w-full max-w-xl rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] my-auto overflow-y-auto custom-scrollbar">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{selectedDay.tithi.moonPhaseEmoji}</span>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-slate-100">
                      {selectedDay.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </h3>
                    <div className="text-xs text-amber-400 font-semibold flex items-center gap-2 mt-0.5">
                      <span>{selectedDay.sanskritVara}</span>
                      <span>•</span>
                      <span className="text-slate-300">
                        {selectedDay.tithi.paksha} Paksha ({selectedDay.tithi.pakshaHindi})
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDay(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Prominent Vedic Lunar Month Highlight Banner */}
              <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/5 p-3.5 rounded-2xl border border-amber-500/30 flex items-center justify-between flex-wrap gap-2 shadow-inner">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block flex items-center gap-1.5">
                    <span>🌙</span>
                    <span>Vedic Lunar Month (वैदिक चन्द्र मास):</span>
                  </span>
                  <div className="text-base font-black text-amber-200 mt-0.5 flex items-center gap-2">
                    <span>{selectedDay.lunarMonth.hindiName} मास ({selectedDay.lunarMonth.name} Masa)</span>
                    <span className="text-[10.5px] px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold shadow">
                      {selectedDay.tithi.paksha === "Shukla" ? "शुक्ल पक्ष / Waxing" : "कृष्ण पक्ष / Waning"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                    ☀️ Solar Transit:
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {selectedDay.lunarMonth.solarMasa}
                  </span>
                </div>
              </div>

              {/* Day Panchanga 5 Limbs (पञ्चाङ्ग) Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                {/* 1. Tithi */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                      1. Tithi (तिथि)
                    </span>
                    <div className="font-black text-amber-300 text-sm mt-0.5">
                      {selectedDay.tithi.name}
                    </div>
                    <div className="text-[11px] text-slate-300">{selectedDay.tithi.pakshaHindi}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Moon Illumination: <span className="text-slate-200 font-bold">{selectedDay.tithi.illuminationPercent}%</span>
                    </div>
                  </div>
                  {selectedDay.tithi.endTimeFormatted && (
                    <div className="mt-2 pt-1.5 border-t border-slate-800/80">
                      <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                        <span className="text-amber-300">⌛ Ends:</span>
                        <span className="text-amber-200 font-mono">{selectedDay.tithi.endTimeFormatted}</span>
                      </div>
                      {selectedDay.tithi.remainingHoursFormatted && (
                        <div className="text-[9.5px] text-amber-300/80 font-mono mt-0.5 text-right">
                          {selectedDay.tithi.remainingHoursFormatted}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Nakshatra */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                      2. Nakshatra (नक्षत्र)
                    </span>
                    <div className="font-black text-slate-100 text-sm mt-0.5">
                      {selectedDay.nakshatra.name}
                    </div>
                    <div className="text-[11px] text-slate-400">Pada {selectedDay.nakshatra.pada} • Lord: {selectedDay.nakshatra.lord}</div>
                    <div className="text-[10px] text-amber-400 mt-1">Deity: {selectedDay.nakshatra.deity}</div>
                  </div>
                  {selectedDay.nakshatra.endTimeFormatted && (
                    <div className="mt-2 pt-1.5 border-t border-slate-800/80">
                      <div className="text-[10.5px] text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                        <span className="text-cyan-400">⌛ Ends:</span>
                        <span className="font-mono font-bold text-cyan-200">{selectedDay.nakshatra.endTimeFormatted}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Vara */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                      3. Vara (वार)
                    </span>
                    <div className="font-black text-slate-100 text-sm mt-0.5">
                      {selectedDay.dayName}
                    </div>
                    <div className="text-[11px] text-slate-400">{selectedDay.sanskritVara}</div>
                    <div className="text-[10px] text-amber-400 mt-1">Lord: {selectedDay.varaLord}</div>
                  </div>
                </div>

                {/* 4. Yoga */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                      4. Yoga (योग)
                    </span>
                    <div className="font-black text-slate-100 text-sm mt-0.5">
                      {selectedDay.yoga.name}
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-1">Auspicious Angle</div>
                  </div>
                  {selectedDay.yoga.endTimeFormatted && (
                    <div className="mt-1.5 text-[10px] text-slate-400">
                      Ends: <span className="text-slate-200 font-mono font-bold">{selectedDay.yoga.endTimeFormatted}</span>
                    </div>
                  )}
                </div>

                {/* 5. Karana */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                      5. Karana (करण)
                    </span>
                    <div className="font-black text-slate-100 text-sm mt-0.5">
                      {selectedDay.karana.name}
                    </div>
                    <div className={`text-[10px] mt-1 ${selectedDay.karana.isBhadra ? "text-rose-400 font-bold" : "text-slate-400"}`}>
                      {selectedDay.karana.isBhadra ? "⚠️ Vishti (Bhadra)" : "Favorable"}
                    </div>
                  </div>
                  {selectedDay.karana.endTimeFormatted && (
                    <div className="mt-1.5 text-[10px] text-slate-400">
                      Ends: <span className="text-slate-200 font-mono font-bold">{selectedDay.karana.endTimeFormatted}</span>
                    </div>
                  )}
                </div>

                {/* 6. Lunar & Solar Masa Card */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                    Lunar Masa (चन्द्र मास)
                  </span>
                  <div className="font-black text-amber-300 text-sm mt-0.5">
                    {selectedDay.lunarMonth.hindiName} ({selectedDay.lunarMonth.name})
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 truncate">
                    ☀️ {selectedDay.lunarMonth.solarMasa}
                  </div>
                </div>
              </div>

              {/* Shubh & Ashubh Timings */}
              <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Auspicious & Inauspicious Muhurtas:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Sunrise:</span>
                    <span className="text-slate-200 font-mono font-bold">{selectedDay.timings.sunrise}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Sunset:</span>
                    <span className="text-slate-200 font-mono font-bold">{selectedDay.timings.sunset}</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-bold block">Abhijit Muhurta:</span>
                    <span className="text-emerald-300 font-mono font-bold">{selectedDay.timings.abhijitMuhurta}</span>
                  </div>
                  <div>
                    <span className="text-rose-400 font-bold block">Rahu Kaal:</span>
                    <span className="text-rose-300 font-mono font-bold">{selectedDay.timings.rahuKaal}</span>
                  </div>
                </div>
              </div>

              {/* Day Festivals & Auspicious Observances */}
              {selectedDay.festivals.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
                    🎉 Festivals, Vrats & Observances Today:
                  </span>
                  <div className="space-y-2">
                    {selectedDay.festivals.map((f) => (
                      <div
                        key={f.id}
                        className={`p-3 rounded-2xl border shadow-md space-y-1 ${f.badgeColor}`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-sm">{f.name}</h4>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-950/80">
                            {f.category}
                          </span>
                        </div>
                        <div className="text-xs opacity-90">{f.hindiName}</div>
                        {f.deity && <div className="text-xs font-bold">Presiding Deity: {f.deity}</div>}
                        <p className="text-xs opacity-85 leading-relaxed">{f.significance}</p>

                        {/* Exact Auspicious Muhurta Timing Card */}
                        {f.muhurta && (
                          <div className="mt-2 p-2.5 rounded-xl bg-slate-950/80 border border-amber-400/50 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                                <span>⏰</span>
                                <span>{f.muhurta.hindiTitle || f.muhurta.title}:</span>
                              </span>
                              <span className="font-black text-amber-200 font-mono bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/40">
                                {f.muhurta.timeRange}
                              </span>
                            </div>

                            {f.muhurta.duration && (
                              <div className="text-[11px] text-slate-300">
                                <span className="text-slate-400">कुल अवधि (Duration): </span>
                                <span className="font-bold text-slate-100">{f.muhurta.duration}</span>
                              </div>
                            )}

                            {f.muhurta.isAvoidBhadra && (
                              <div className="text-[11px] text-rose-300 font-bold bg-rose-950/40 p-1.5 rounded-lg border border-rose-600/40 flex items-center gap-1">
                                <span>⚠️</span>
                                <span>भद्रा काल निषेध: {f.muhurta.bhadraEndTime}</span>
                              </div>
                            )}

                            {f.muhurta.specialAuspiciousPeriod && (
                              <div className="text-[11px] text-slate-300">
                                <span className="text-amber-400 font-bold">सर्वश्रेष्ठ मुहूर्त (Best Windows): </span>
                                <span>{f.muhurta.specialAuspiciousPeriod}</span>
                              </div>
                            )}

                            {f.muhurta.mantra && (
                              <div className="text-[11px] text-amber-200 bg-amber-950/30 p-2 rounded-lg border border-amber-500/30">
                                <span className="font-bold text-amber-400 block mb-0.5">📿 रक्षा / पूजन मंत्र (Sacred Mantra):</span>
                                <span className="font-serif italic font-semibold">{f.muhurta.mantra}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {f.ritual && (
                          <div className="text-[11px] pt-1.5 border-t border-current/20 font-medium">
                            <span className="font-bold">Vidhi / Ritual: </span>
                            <span>{f.ritual}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setDate(selectedDay.date);
                    setSelectedDay(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
                >
                  Set as Current Chart Date
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

