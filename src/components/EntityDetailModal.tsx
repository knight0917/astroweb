"use client";

import React from "react";
import { useAstroStore } from "../store/useAstroStore";
import { formatDMS } from "../engine/rashiNakshatra";

export default function EntityDetailModal() {
  const { selectedEntityId, setSelectedEntityId, ephemeris } = useAstroStore();

  if (!selectedEntityId) return null;

  // Check if it's Ascendant, Midheaven, a Planet, or an Upagraha
  let data: any = null;
  let isLagna = false;
  let isUpagraha = false;

  if (selectedEntityId === "Ascendant") {
    data = ephemeris.ascendant;
    isLagna = true;
  } else if (selectedEntityId === "Midheaven") {
    data = ephemeris.midheaven;
    isLagna = true;
  } else if (ephemeris.planets[selectedEntityId]) {
    data = ephemeris.planets[selectedEntityId];
  } else if (ephemeris.upagrahas[selectedEntityId]) {
    data = ephemeris.upagrahas[selectedEntityId];
    isUpagraha = true;
  }

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel-gold max-w-lg w-full p-6 rounded-2xl border border-amber-500/40 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex justify-between items-start mb-4 border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold border border-amber-500/30"
              style={{ backgroundColor: data.color ? `${data.color}25` : "#f59e0b25" }}
            >
              <span style={{ color: data.color || "#f59e0b" }}>{data.symbol || "✦"}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-100">{data.name}</h2>
                {data.isRetrograde && (
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-xs font-bold">
                    Retrograde (Vakri)
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-400/90 font-medium">{data.sanskritName}</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedEntityId(null)}
            className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Core Astronomical & Vedic Coordinates */}
        <div className="grid grid-cols-2 gap-3 text-xs mb-4">
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">SIDEREAL LONGITUDE</span>
            <span className="font-mono text-base font-bold text-amber-300">
              {formatDMS(data.siderealLongitude)}
            </span>
          </div>

          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">RASHI (ZODIAC SIGN)</span>
            <span className="text-base font-bold text-slate-100 flex items-center gap-1.5">
              <span>{data.rashi.symbol}</span>
              <span>{data.rashi.sanskritName}</span>
              <span className="text-xs text-slate-400">({data.rashi.degreesInSign.toFixed(2)}°)</span>
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Lord: {data.rashi.lord} | Element: {data.rashi.element}
            </span>
          </div>

          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">NAKSHATRA & SACRED ANIMAL</span>
            <span className="text-sm font-bold text-sky-300 flex items-center gap-1.5">
              <span>{data.nakshatra.animalSymbol}</span>
              <span>{data.nakshatra.sanskritName} — Pada {data.nakshatra.pada}</span>
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Animal: <strong className="text-amber-300">{data.nakshatra.animal}</strong> | Lord: {data.nakshatra.lord} | Deity: {data.nakshatra.deity}
            </span>
          </div>

          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">BHAVA (HOUSE PLACEMENT)</span>
            <span className="text-base font-bold text-emerald-400">House {data.house}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              from Lagna ({ephemeris.ascendant.rashi.sanskritName})
            </span>
          </div>
        </div>

        {/* Additional Astronomical Data */}
        {!isLagna && !isUpagraha && (
          <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] mb-4">
            <div>
              <span className="text-slate-500 block">Daily Speed</span>
              <span className="font-mono text-slate-200 font-semibold">{data.speed?.toFixed(3)}°/day</span>
            </div>
            <div>
              <span className="text-slate-500 block">Distance (AU)</span>
              <span className="font-mono text-slate-200 font-semibold">{data.distanceAU?.toFixed(4)} AU</span>
            </div>
            <div>
              <span className="text-slate-500 block">Alt / Azimuth</span>
              <span className="font-mono text-slate-200 font-semibold">
                {data.altitude?.toFixed(1)}° / {data.azimuth?.toFixed(1)}°
              </span>
            </div>
          </div>
        )}

        {/* Description / Significance */}
        {data.description && (
          <div className="bg-amber-950/20 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-200/90 leading-relaxed mb-4">
            {data.description}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={() => setSelectedEntityId(null)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
