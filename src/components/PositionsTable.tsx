"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { formatDMS } from "../engine/rashiNakshatra";
import { evaluatePanchadaMaitri } from "../engine/panchadaMaitri";
import { calculateIshtaKashta } from "../engine/ishtaKashta";

export default function PositionsTable() {
  const [activeTab, setActiveTab] = useState<"planets" | "upagrahas" | "panchanga">("planets");
  const {
    ephemeris,
    showModernPlanets,
    selectedEntityId,
    setSelectedEntityId,
  } = useAstroStore();

  const planetList = Object.values(ephemeris.planets).filter((p) => {
    if (!showModernPlanets && p.isModernPlanet) return false;
    return true;
  });

  const upagrahaList = Object.values(ephemeris.upagrahas);

  // Classical B.V. Raman Calculations
  const panchadaReport = useMemo(() => evaluatePanchadaMaitri(ephemeris), [ephemeris]);
  const ishtaKashtaReport = useMemo(() => calculateIshtaKashta(ephemeris), [ephemeris]);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-2xl flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("planets")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "planets"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-slate-200 bg-slate-900/50"
            }`}
          >
            Navagrahas & Planets ({planetList.length})
          </button>
          <button
            onClick={() => setActiveTab("upagrahas")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "upagrahas"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200 bg-slate-900/50"
            }`}
          >
            Upagrahas & Special Points ({upagrahaList.length})
          </button>
          <button
            onClick={() => setActiveTab("panchanga")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "panchanga"
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200 bg-slate-900/50"
            }`}
          >
            Daily Panchanga
          </button>
        </div>

        <div className="text-xs text-slate-400">
          Ayanamsha: <span className="text-amber-400 font-semibold">{ephemeris.ayanamshaType}</span> (
          {formatDMS(ephemeris.ayanamshaValue)})
        </div>
      </div>

      {/* Tab 1: Planets Table */}
      {activeTab === "planets" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Graha</th>
                <th className="py-2.5 px-3">Sanskrit</th>
                <th className="py-2.5 px-3">Sidereal Longitude</th>
                <th className="py-2.5 px-3">Rashi</th>
                <th className="py-2.5 px-3">Nakshatra (Pada)</th>
                <th className="py-2.5 px-3">House</th>
                <th className="py-2.5 px-3">Pancha-da Maitri</th>
                <th className="py-2.5 px-3">Ishta / Kashta (Res %)</th>
                <th className="py-2.5 px-3">Motion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {/* Ascendant Row */}
              <tr
                onClick={() => setSelectedEntityId("Ascendant")}
                className={`cursor-pointer transition-colors ${
                  selectedEntityId === "Ascendant" ? "bg-emerald-950/40" : "hover:bg-slate-900/40"
                }`}
              >
                <td className="py-2 px-3 font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>ASC</span> Ascendant
                </td>
                <td className="py-2 px-3 text-slate-400 font-medium">Lagna</td>
                <td className="py-2 px-3 font-mono text-emerald-300">
                  {formatDMS(ephemeris.ascendant.siderealLongitude)}
                </td>
                <td className="py-2 px-3">
                  <span className="font-semibold text-slate-200">{ephemeris.ascendant.rashi.sanskritName}</span>{" "}
                  <span className="text-slate-400">({formatDMS(ephemeris.ascendant.rashi.degreesInSign)})</span>
                </td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1.5">
                    <span>{ephemeris.ascendant.nakshatra.animalSymbol}</span>
                    <span className="font-semibold text-slate-200">{ephemeris.ascendant.nakshatra.sanskritName}</span>
                    <span className="text-emerald-400 font-bold text-[11px]">P{ephemeris.ascendant.nakshatra.pada}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{ephemeris.ascendant.nakshatra.animal}</div>
                </td>
                <td className="py-2 px-3 font-bold text-emerald-400">H1</td>
                <td className="py-2 px-3 text-slate-500">—</td>
                <td className="py-2 px-3 text-slate-500">—</td>
                <td className="py-2 px-3 text-slate-400">—</td>
              </tr>

              {/* Planets */}
              {planetList.map((p) => {
                const isSelected = selectedEntityId === p.id;
                const pm = panchadaReport.planets[p.id];
                const ik = ishtaKashtaReport.planets[p.id];

                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedEntityId(p.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-amber-950/30" : "hover:bg-slate-900/40"
                    }`}
                  >
                    <td className="py-2 px-3 font-bold flex items-center gap-1.5">
                      <span style={{ color: p.color }} className="text-base">
                        {p.symbol}
                      </span>
                      <span>{p.name}</span>
                    </td>
                    <td className="py-2 px-3 text-slate-400">{p.sanskritName}</td>
                    <td className="py-2 px-3 font-mono text-amber-300">
                      {formatDMS(p.siderealLongitude)}
                    </td>
                    <td className="py-2 px-3">
                      <span className="font-semibold">{p.rashi.sanskritName}</span>{" "}
                      <span className="text-slate-400">({formatDMS(p.rashi.degreesInSign)})</span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <span>{p.nakshatra.animalSymbol}</span>
                        <span className="font-semibold text-slate-200">{p.nakshatra.sanskritName}</span>
                        <span className="text-amber-400 font-bold text-[11px]">P{p.nakshatra.pada}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.nakshatra.animal}</div>
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-300">H{p.house}</td>
                    
                    {/* Pancha-da Maitri Badge */}
                    <td className="py-2 px-3">
                      {pm ? (
                        <div className="flex flex-col gap-0.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block w-max ${pm.badgeColor}`}>
                            {pm.compoundRelation} ({pm.sanskritName})
                          </span>
                          <span className="text-[9px] text-slate-400">w/ {pm.dispositor}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    {/* Ishta / Kashta & Res % */}
                    <td className="py-2 px-3">
                      {ik ? (
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="text-emerald-400 font-semibold">I:{ik.ishtaPhala}</span>
                            <span className="text-slate-600">/</span>
                            <span className="text-rose-400 font-semibold">K:{ik.kashtaPhala}</span>
                          </div>
                          <div className="text-[9px] text-slate-400 font-mono">
                            Res: <span className="text-amber-300">{ik.residentialPercent}%</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="py-2 px-3">
                      {p.isRetrograde ? (
                        <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold">
                          RETRO (R)
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono text-[11px]">
                          {p.speed > 0 ? `+${p.speed.toFixed(2)}°/d` : `${p.speed.toFixed(2)}°/d`}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Upagrahas Table */}
      {activeTab === "upagrahas" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-purple-950/40 text-purple-300 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Upagraha</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Sidereal Longitude</th>
                <th className="py-2.5 px-3">Rashi</th>
                <th className="py-2.5 px-3">Nakshatra</th>
                <th className="py-2.5 px-3">House</th>
                <th className="py-2.5 px-3">Classical Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {upagrahaList.map((u) => {
                const isSelected = selectedEntityId === u.id;
                return (
                  <tr
                    key={u.id}
                    onClick={() => setSelectedEntityId(u.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-purple-950/40" : "hover:bg-slate-900/40"
                    }`}
                  >
                    <td className="py-2 px-3 font-bold text-purple-300">{u.name}</td>
                    <td className="py-2 px-3 text-slate-400 text-[11px]">{u.category}</td>
                    <td className="py-2 px-3 font-mono text-purple-200">
                      {formatDMS(u.siderealLongitude)}
                    </td>
                    <td className="py-2 px-3">
                      <span className="font-semibold">{u.rashi.sanskritName}</span>{" "}
                      <span className="text-slate-400">({formatDMS(u.rashi.degreesInSign)})</span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1">
                        <span>{u.nakshatra.animalSymbol}</span>
                        <span>{u.nakshatra.sanskritName}</span>
                        <span className="text-purple-400 font-bold">P{u.nakshatra.pada}</span>
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono">{u.nakshatra.animal}</div>
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-300">H{u.house}</td>
                    <td className="py-2 px-3 text-slate-400 text-[11px] max-w-xs truncate">
                      {u.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Panchanga View */}
      {activeTab === "panchanga" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
          {/* Tithi */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">1. TITHI (Lunar Day)</span>
            <div className="text-lg font-bold text-amber-300 mt-1">
              {ephemeris.panchanga.tithi.name} ({ephemeris.panchanga.tithi.paksha} Paksha)
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
              <div
                className="bg-amber-400 h-1.5 rounded-full"
                style={{ width: `${ephemeris.panchanga.tithi.progressPercent}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {ephemeris.panchanga.tithi.progressPercent.toFixed(1)}% completed
            </div>
          </div>

          {/* Vara */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">2. VARA (Solar Weekday)</span>
            <div className="text-lg font-bold text-emerald-300 mt-1">
              {ephemeris.panchanga.vara.name}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Lord: <span className="text-slate-200 font-semibold">{ephemeris.panchanga.vara.lord}</span>
            </div>
          </div>

          {/* Nakshatra */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">3. NAKSHATRA (Moon Constellation)</span>
            <div className="text-lg font-bold text-sky-300 mt-1">
              {ephemeris.panchanga.nakshatra.sanskritName} (Pada {ephemeris.panchanga.nakshatra.pada})
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Lord: {ephemeris.panchanga.nakshatra.lord} | Deity: {ephemeris.panchanga.nakshatra.deity}
            </div>
          </div>

          {/* Yoga */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">4. YOGA (Sun + Moon)</span>
            <div className="text-lg font-bold text-indigo-300 mt-1">
              {ephemeris.panchanga.yoga.name} (#{ephemeris.panchanga.yoga.index})
            </div>
          </div>

          {/* Karana */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">5. KARANA (Half Tithi)</span>
            <div className="text-lg font-bold text-pink-300 mt-1">
              {ephemeris.panchanga.karana.name} (#{ephemeris.panchanga.karana.index})
            </div>
          </div>

          {/* Location & Time */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">OBSERVATION PLACE & TIME</span>
            <div className="text-sm font-bold text-slate-200 mt-1">
              {ephemeris.location.cityName}, {ephemeris.location.country}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              {ephemeris.location.latitude.toFixed(4)}° N, {ephemeris.location.longitude.toFixed(4)}° E
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
