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

export default function MuhurtaView() {
  const { currentDate, location } = useAstroStore();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(currentDate).toISOString().slice(0, 10)
  );
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all");

  const targetDate = useMemo(() => new Date(selectedDate), [selectedDate]);

  const dayData: DayPanchangaShuddhi = useMemo(() => {
    return calculateDayMuhurta(targetDate, location);
  }, [targetDate, location]);

  const eventCategories: { id: EventCategory; label: string; icon: string }[] = [
    { id: "grihaPravesh", label: "Griha Pravesh", icon: "🏡" },
    { id: "vivaha", label: "Vivaha (Marriage)", icon: "💍" },
    { id: "businessOpening", label: "Business Opening", icon: "🏢" },
    { id: "vehiclePurchase", label: "Vehicle Purchase", icon: "🚗" },
    { id: "propertyRegistration", label: "Property / Land", icon: "📜" },
    { id: "generalAuspicious", label: "General Auspicious", icon: "✨" },
  ];

  const recommendations: EventMuhurtaRecommendation[] = useMemo(() => {
    return eventCategories.map((c) => evaluateEventMuhurta(c.id, dayData));
  }, [dayData]);

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl text-yellow-400">⏳</span>
            <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-yellow-300 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              Auspicious Muhurta Finder (शुभ मुहूर्त एवं पञ्चाङ्ग शुद्धि)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Muhurta Chintamani & Brihat Samhita • Abhijit, Brahma, Amrit Kaal, Rahu Kaal, & Event Muhurta Suitability
          </p>
        </div>

        {/* Date Selector & Shuddhi Score */}
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 font-mono font-bold"
          />

          <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-bold">Panchanga Shuddhi:</span>
            <span
              className={`px-2 py-0.5 rounded-lg text-xs font-black border ${
                dayData.shuddhiScore >= 75
                  ? "bg-emerald-950 text-emerald-300 border-emerald-500/60"
                  : dayData.shuddhiScore >= 50
                  ? "bg-amber-950 text-amber-300 border-amber-500/60"
                  : "bg-rose-950 text-rose-300 border-rose-500/60"
              }`}
            >
              {dayData.shuddhiScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Daily Sun & Moon Astronomy Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between">
          <span className="text-slate-400 text-[11px]">Sunrise / Sunset</span>
          <div className="font-extrabold text-amber-300 text-sm mt-1">
            {formatTime(dayData.sunrise)} / {formatTime(dayData.sunset)}
          </div>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between">
          <span className="text-slate-400 text-[11px]">Day / Night Duration</span>
          <div className="font-extrabold text-slate-200 text-sm mt-1">
            {dayData.dayDurationHours}h / {dayData.nightDurationHours}h
          </div>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between">
          <span className="text-slate-400 text-[11px]">Nakshatra</span>
          <div className="font-extrabold text-emerald-300 text-sm mt-1">
            {dayData.nakshatraName}
          </div>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between">
          <span className="text-slate-400 text-[11px]">Active Doshas</span>
          <div className="font-extrabold text-sm mt-1">
            {dayData.doshasPresent.length > 0 ? (
              <span className="text-rose-400">{dayData.doshasPresent.length} Doshas</span>
            ) : (
              <span className="text-emerald-400">Pure (शुद्ध)</span>
            )}
          </div>
        </div>
      </div>

      {/* Time Slots Timeline (Auspicious vs Inauspicious) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auspicious Time Windows (शुभ काल) */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-slate-950/80 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-emerald-300 uppercase tracking-wider flex items-center gap-2">
              <span>✨</span>
              <span>Auspicious Time Windows (शुभ काल)</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {dayData.auspiciousSlots.length} Slots
            </span>
          </div>

          <div className="space-y-2.5">
            {dayData.auspiciousSlots.map((slot, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-100">{slot.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({slot.sanskritName})</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                      slot.quality.includes("Amrit")
                        ? "bg-emerald-950 text-emerald-300 border-emerald-500"
                        : "bg-amber-950 text-amber-300 border-amber-500"
                    }`}
                  >
                    {slot.quality}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                  <span>{formatTime(slot.startTime)} ➔ {formatTime(slot.endTime)}</span>
                </div>

                <p className="text-[11px] text-slate-300">{slot.description}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {slot.suitableFor.map((act, aIdx) => (
                    <span key={aIdx} className="text-[9.5px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inauspicious Prohibited Windows (अशुभ / वर्ज्य काल) */}
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-slate-950/80 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-rose-300 uppercase tracking-wider flex items-center gap-2">
              <span>⚠️</span>
              <span>Inauspicious / Prohibited Periods (वर्ज्य काल)</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Avoid New Ventures
            </span>
          </div>

          <div className="space-y-2.5">
            {dayData.inauspiciousSlots.map((slot, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-100">{slot.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({slot.sanskritName})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black border bg-rose-950 text-rose-300 border-rose-500">
                    {slot.quality}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-rose-400 font-bold">
                  <span>{formatTime(slot.startTime)} ➔ {formatTime(slot.endTime)}</span>
                </div>

                <p className="text-[11px] text-slate-300">{slot.description}</p>
              </div>
            ))}

            {dayData.doshasPresent.length > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/40 text-xs text-rose-200 space-y-1">
                <span className="font-bold block">Panchanga Doshas Active Today:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
                  {dayData.doshasPresent.map((d, dIdx) => (
                    <li key={dIdx}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event-Specific Muhurta Suitability Cards */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>🎯</span>
            <span>Event-Specific Muhurta Suitability (कार्य विशेष मुहूर्त)</span>
          </h3>

          <div className="flex flex-wrap items-center gap-1 text-xs">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedCategory === "all" ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400"
              }`}
            >
              All Events
            </button>
            {eventCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedCategory === c.id ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400"
                }`}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations
            .filter((r) => selectedCategory === "all" || selectedCategory === r.category)
            .map((rec) => (
              <div
                key={rec.category}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  rec.isRecommended
                    ? "bg-emerald-950/20 border-emerald-500/50"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-200">{rec.categoryName}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                        rec.isRecommended
                          ? "bg-emerald-950 text-emerald-300 border-emerald-500"
                          : "bg-amber-950 text-amber-300 border-amber-500"
                      }`}
                    >
                      {rec.suitabilityScore}% Suitability
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{rec.sanskritName}</div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    {rec.favorableFactors.map((f, fIdx) => (
                      <div key={fIdx} className="text-emerald-400 flex items-start gap-1 text-[11px]">
                        <span>✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                    {rec.unfavorableFactors.map((uf, uIdx) => (
                      <div key={uIdx} className="text-amber-400 flex items-start gap-1 text-[11px]">
                        <span>✗</span>
                        <span>{uf}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Recommended Time:</span>
                  <div className="flex flex-wrap gap-1">
                    {rec.bestTimeSlots.map((ts, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-mono bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-bold">
                        {ts.name} ({formatTime(ts.startTime)})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
