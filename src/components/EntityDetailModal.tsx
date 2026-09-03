"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAstroStore } from "../store/useAstroStore";
import { formatDMS } from "../engine/rashiNakshatra";

export default function EntityDetailModal() {
  const { inspectorEntityId, setInspectorEntityId, ephemeris } = useAstroStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!inspectorEntityId || !mounted) return null;

  // Check if it's Ascendant, Midheaven, a Planet, or an Upagraha
  let data: any = null;
  let isLagna = false;
  let isUpagraha = false;

  if (inspectorEntityId === "Ascendant") {
    data = ephemeris.ascendant;
    isLagna = true;
  } else if (inspectorEntityId === "Midheaven") {
    data = ephemeris.midheaven;
    isLagna = true;
  } else if (ephemeris.planets[inspectorEntityId]) {
    data = ephemeris.planets[inspectorEntityId];
  } else if (ephemeris.upagrahas[inspectorEntityId]) {
    data = ephemeris.upagrahas[inspectorEntityId];
    isUpagraha = true;
  }

  if (!data) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="glass-panel-gold max-w-lg w-full p-5 sm:p-6 rounded-2xl border border-amber-500/40 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[90vh] overflow-y-auto">
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
            onClick={() => setInspectorEntityId(null)}
            className="w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
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

        {/* Vedic Panchanga & Current Tithi Live Card */}
        <div className="bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-amber-950/40 p-3.5 rounded-xl border border-amber-500/30 mb-4 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-1 border-b border-amber-500/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🌕</span>
              <div>
                <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider block">
                  Current Tithi & Vedic Panchanga
                </span>
                <span className="text-[10px] text-amber-400/90 font-medium">
                  Month: <strong className="text-white">{ephemeris.panchanga.masa?.name} Masa ({ephemeris.panchanga.masa?.sanskritName})</strong> • {ephemeris.panchanga.gregorianMonth}
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              {ephemeris.panchanga.tithi.paksha} Paksha
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="bg-slate-950/75 p-2 rounded-lg border border-amber-500/40 shadow-inner">
              <span className="text-[9px] text-amber-400 uppercase font-bold block">Current Tithi</span>
              <span className="font-extrabold text-amber-300 text-xs truncate block">
                {ephemeris.panchanga.tithi.name}
              </span>
              <span className="text-[8.5px] text-slate-400 block mt-0.5">
                {ephemeris.panchanga.tithi.progressPercent.toFixed(1)}% elapsed
              </span>
            </div>

            <div className="bg-slate-950/75 p-2 rounded-lg border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Vara (Day)</span>
              <span className="font-bold text-slate-200 text-xs truncate block">
                {ephemeris.panchanga.vara.sanskritName}
              </span>
              <span className="text-[8.5px] text-slate-400 block mt-0.5">
                Lord: {ephemeris.panchanga.vara.lord}
              </span>
            </div>

            <div className="bg-slate-950/75 p-2 rounded-lg border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Yoga</span>
              <span className="font-bold text-slate-200 text-xs truncate block">
                {ephemeris.panchanga.yoga.name}
              </span>
              <span className="text-[8.5px] text-slate-400 block mt-0.5">
                #{ephemeris.panchanga.yoga.index}
              </span>
            </div>

            <div className="bg-slate-950/75 p-2 rounded-lg border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Karana</span>
              <span className="font-bold text-slate-200 text-xs truncate block">
                {ephemeris.panchanga.karana.name}
              </span>
              <span className="text-[8.5px] text-slate-400 block mt-0.5">
                #{ephemeris.panchanga.karana.index}
              </span>
            </div>
          </div>
        </div>

        {/* Description / Significance */}
        {data.description && (
          <div className="bg-amber-950/20 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-200/90 leading-relaxed mb-4">
            {data.description}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={() => setInspectorEntityId(null)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
