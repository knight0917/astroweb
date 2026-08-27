"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { calculateChoghadiyaAndHoras } from "../engine/choghadiyaHora";

export default function ChoghadiyaHoraView() {
  const { location } = useAstroStore();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<"day_choghadiya" | "night_choghadiya" | "horas">("day_choghadiya");

  // Ticking live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const result = useMemo(() => {
    return calculateChoghadiyaAndHoras(currentTime, location);
  }, [currentTime, location]);

  const activeC = result.activeChoghadiya;
  const activeH = result.activeHora;

  // Compute countdown in seconds to active Choghadiya end
  const remainingSec = Math.max(0, Math.floor((activeC.endTime.getTime() - currentTime.getTime()) / 1000));
  const remMins = Math.floor(remainingSec / 60);
  const remSecs = remainingSec % 60;

  return (
    <div className="space-y-6">
      {/* 1. Real-Time Live Muhurta Watch Hero Banner */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">⏱️</span>
              <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Real-Time Choghadiya & Planetary Horas
              </h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Live Watch
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Precise solar day divisions based on local Sunrise ({result.sunriseFormatted}) & Sunset ({result.sunsetFormatted}) in {result.cityName}
            </p>
          </div>

          {/* Live Clock Display */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 px-4 py-2 rounded-2xl shadow-inner">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold">
                {result.dayOfWeekName} • Live Time
              </span>
              <span className="text-sm font-mono font-black text-slate-100">
                {currentTime.toLocaleTimeString("en-US", { hour12: true })}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Active Choghadiya & Active Hora Status Deck */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Active Choghadiya Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/50 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider">
                Current Active Choghadiya (वर्तमान चौघड़िया):
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${activeC.badgeColor}`}>
                {activeC.nature}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                  <span>{activeC.name} ({activeC.hindiName})</span>
                </h3>
                <div className="text-xs text-slate-400 font-medium">
                  Ruler: <span className="text-amber-300 font-bold">{activeC.rulingPlanet}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-slate-200">
                  {activeC.startFormatted} → {activeC.endFormatted}
                </div>
                <div className="text-[10px] text-amber-400 font-mono font-semibold">
                  ⏳ {remMins}m {remSecs}s remaining
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 leading-relaxed">
              <span className="font-bold text-amber-400">Suitable For: </span>
              <span>{activeC.prescribedActivities}</span>
            </p>
          </div>

          {/* Active Planetary Hora Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/50 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-purple-300 uppercase tracking-wider">
                Current Planetary Hora (वर्तमान ग्रह होरा):
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                {activeH.nature}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                  <span>{activeH.symbol}</span>
                  <span>{activeH.lord} Hora ({activeH.hindiLord} होरा)</span>
                </h3>
                <div className="text-xs text-slate-400">
                  Solar Hour #{activeH.hourOfSolarDay} of 24
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-slate-200">
                  {activeH.startFormatted} → {activeH.endFormatted}
                </div>
                <div className="text-[10px] text-purple-300 font-mono">
                  Continuous 1-Hour Phase
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 leading-relaxed">
              <span className="font-bold text-purple-300">Auspicious Activities: </span>
              <span>{activeH.favorableFor}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab("day_choghadiya")}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === "day_choghadiya"
              ? "bg-amber-500 text-slate-950 shadow-md font-black"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          ☀️ Day Choghadiya (दिन का चौघड़िया)
        </button>
        <button
          onClick={() => setActiveTab("night_choghadiya")}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === "night_choghadiya"
              ? "bg-purple-600 text-white shadow-md font-black"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          🌙 Night Choghadiya (रात्रि का चौघड़िया)
        </button>
        <button
          onClick={() => setActiveTab("horas")}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === "horas"
              ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          24 Planetary Horas (ग्रह होरा सारणी)
        </button>
      </div>

      {/* 4. Day & Night Choghadiya List */}
      {(activeTab === "day_choghadiya" || activeTab === "night_choghadiya") && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {(activeTab === "day_choghadiya" ? result.dayChoghadiyas : result.nightChoghadiyas).map((c) => (
            <div
              key={c.index}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between shadow-lg ${
                c.isActiveNow
                  ? "bg-amber-950/40 border-amber-400 ring-2 ring-amber-400 scale-[1.02] shadow-2xl"
                  : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                    Slot #{c.index}
                  </span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${c.badgeColor}`}>
                    {c.nature}
                  </span>
                </div>

                <h4 className="font-black text-sm text-slate-100 flex items-center gap-1.5">
                  <span>{c.name}</span>
                  <span className="text-amber-400 text-xs font-semibold">({c.hindiName})</span>
                  {c.isActiveNow && (
                    <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      LIVE
                    </span>
                  )}
                </h4>

                <div className="text-[11px] text-slate-400 mt-0.5">
                  Ruler: <span className="text-slate-200 font-semibold">{c.rulingPlanet}</span>
                </div>

                <div className="text-xs font-mono font-bold text-amber-300 mt-2 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800">
                  ⏰ {c.startFormatted} – {c.endFormatted}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 text-[10.5px] text-slate-300 leading-relaxed">
                {c.prescribedActivities}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. 24 Planetary Horas Grid */}
      {activeTab === "horas" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
              24-Hour Planetary Hora Sequence (24 होरा चक्र)
            </h3>
            <span className="text-[11px] text-slate-400">12 Day Horas + 12 Night Horas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {result.planetaryHoras.map((h) => (
              <div
                key={h.index}
                className={`p-3 rounded-2xl border transition-all ${
                  h.isActiveNow
                    ? "bg-purple-950/40 border-purple-400 ring-2 ring-purple-400 shadow-xl"
                    : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9.5px] font-mono font-bold text-slate-400">
                    Hora #{h.hourOfSolarDay} ({h.hourOfSolarDay <= 12 ? "☀️ Day" : "🌙 Night"})
                  </span>
                  <span
                    className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded ${
                      h.nature === "Auspicious"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : h.nature === "Challenging"
                        ? "bg-rose-500/20 text-rose-300"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {h.nature}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 my-1">
                  <span className="text-base">{h.symbol}</span>
                  <span className="font-black text-xs text-slate-100">{h.lord} Hora</span>
                  <span className="text-[10px] text-purple-300 font-medium">({h.hindiLord})</span>
                </div>

                <div className="text-[10.5px] font-mono font-bold text-cyan-300">
                  {h.startFormatted} → {h.endFormatted}
                </div>

                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {h.favorableFor}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}