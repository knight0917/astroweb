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
      {/* Header Banner */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-300 via-amber-300 to-amber-500 bg-clip-text text-transparent">
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
              className={`font-black text-xs px-2 py-0.5 rounded ${
                dayData.shuddhiScore >= 70
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-500"
                  : dayData.shuddhiScore >= 50
                  ? "bg-amber-950 text-amber-300 border border-amber-500"
                  : "bg-rose-950 text-rose-300 border border-rose-500"
              }`}
            >
              {dayData.shuddhiScore}% ({dayData.shuddhiScore >= 70 ? "SHUBHA" : "ASHUBHA"})
            </span>
          </div>
        </div>
      </div>

      {/* Sun Schedule & Auspicious / Inauspicious Slots Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Auspicious Muhurtas (शुभ काल) */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-slate-950/80 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-xs text-emerald-400 uppercase tracking-wider">
              Auspicious Windows (शुभ मुहूर्त काल)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Sunrise: {formatTime(dayData.sunrise)}</span>
          </div>

          <div className="space-y-2">
            {dayData.auspiciousSlots.map((m, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-900/90 border border-emerald-900/40 flex items-start justify-between gap-3 hover:border-emerald-500/50 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-slate-100 flex items-center gap-2">
                    <span>{m.name}</span>
                    <span className="text-[10px] text-amber-400 font-mono">({m.sanskritName})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{m.description}</p>
                </div>
                <div className="text-right flex-shrink-0 font-mono">
                  <span className="text-xs font-bold text-emerald-400 block">
                    {formatTime(m.startTime)} – {formatTime(m.endTime)}
                  </span>
                  <span className="text-[9px] text-slate-400">{m.quality}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inauspicious Periods (वर्ज्य काल / त्याज्य) */}
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-slate-950/80 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-xs text-rose-400 uppercase tracking-wider">
              Inauspicious Windows (राहु काल व त्याज्य समय)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Sunset: {formatTime(dayData.sunset)}</span>
          </div>

          <div className="space-y-2">
            {dayData.inauspiciousSlots.map((m, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-900/90 border border-rose-900/40 flex items-start justify-between gap-3 hover:border-rose-500/50 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-slate-100 flex items-center gap-2">
                    <span>{m.name}</span>
                    <span className="text-[10px] text-rose-400 font-mono">({m.sanskritName})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{m.description}</p>
                </div>
                <div className="text-right flex-shrink-0 font-mono">
                  <span className="text-xs font-bold text-rose-400 block">
                    {formatTime(m.startTime)} – {formatTime(m.endTime)}
                  </span>
                  <span className="text-[9px] text-slate-400">{m.quality}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event-Specific Muhurta Recommendations Grid */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-4">
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
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
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
    </div>
  );
}
