"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { formatDMS } from "../engine/rashiNakshatra";
import { evaluatePanchadaMaitri } from "../engine/panchadaMaitri";
import { calculateIshtaKashta } from "../engine/ishtaKashta";
import { calculateBadhakaAvasthas } from "../engine/badhakaAvasthas";
import { evaluateNatalPanchangaDeep } from "../engine/natalPanchangaDeep";

export default function PositionsTable() {
  const [activeTab, setActiveTab] = useState<"planets" | "upagrahas" | "panchanga">("planets");
  const {
    ephemeris,
    showModernPlanets,
    selectedEntityId,
    setSelectedEntityId,
    setInspectorEntityId,
  } = useAstroStore();

  const planetList = Object.values(ephemeris.planets).filter((p) => {
    if (!showModernPlanets && p.isModernPlanet) return false;
    return true;
  });

  const upagrahaList = Object.values(ephemeris.upagrahas);

  // Classical B.V. Raman Calculations
  const panchadaReport = useMemo(() => evaluatePanchadaMaitri(ephemeris), [ephemeris]);
  const ishtaKashtaReport = useMemo(() => calculateIshtaKashta(ephemeris), [ephemeris]);
  const badhakaAvasthas = useMemo(() => calculateBadhakaAvasthas(ephemeris), [ephemeris]);
  const deepPanchang = useMemo(() => evaluateNatalPanchangaDeep(ephemeris), [ephemeris]);

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
                <th className="py-2.5 px-3">Avastha & Badhaka</th>
                <th className="py-2.5 px-3">Motion</th>
                <th className="py-2.5 px-3 text-right">Inspect</th>
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
                <td className="py-2 px-3 text-slate-500">—</td>
                <td className="py-2 px-3 text-slate-400">—</td>
                <td className="py-2 px-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectorEntityId("Ascendant");
                    }}
                    title="Open Ascendant Dossier"
                    className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 font-bold text-[10px] transition-all border border-slate-700 hover:border-emerald-400 cursor-pointer"
                  >
                    🔍 Info
                  </button>
                </td>
              </tr>

              {/* Planets */}
              {planetList.map((p) => {
                const isSelected = selectedEntityId === p.id;
                const pm = panchadaReport.planets[p.id];
                const ik = ishtaKashtaReport.planets[p.id];
                const av = badhakaAvasthas.avasthas[p.id];

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

                    {/* Avastha & Badhaka */}
                    <td className="py-2 px-3">
                      {av ? (
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${av.badgeColor}`}>
                              {av.baladiAvastha.split(" ")[0]} ({av.baladiPotencyPercent}%)
                            </span>
                            {av.isBadhakesh && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-950 text-rose-300 border border-rose-700">
                                BADHAK
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {av.jagradadiAvastha.split(" ")[0]} ({av.effectivePotencyPercent}% pot)
                          </span>
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

                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectorEntityId(p.id);
                        }}
                        title={`Open ${p.name} Dossier`}
                        className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-bold text-[10px] transition-all border border-slate-700 hover:border-amber-400 cursor-pointer"
                      >
                        🔍 Info
                      </button>
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
                <th className="py-2.5 px-3 text-right">Inspect</th>
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
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectorEntityId(u.id);
                        }}
                        title={`Open ${u.name} Dossier`}
                        className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-300 font-bold text-[10px] transition-all border border-slate-700 hover:border-purple-400 cursor-pointer"
                      >
                        🔍 Info
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Classical Panchanga & Dagdha Suite View */}
      {activeTab === "panchanga" && (
        <div className="space-y-4 py-2">
          {/* Top 5 Elemental Limbs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Tithi */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>1. TITHI (जल तत्व - Jala)</span>
                  <span className="font-bold text-amber-400 px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                    {deepPanchang.tithiDeity.category} ({deepPanchang.tithiDeity.element})
                  </span>
                </div>
                <div className="text-base font-bold text-amber-300 mt-1">
                  {ephemeris.panchanga.tithi.name} ({ephemeris.panchanga.tithi.paksha} Paksha)
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Deity: <span className="font-semibold text-amber-200">{deepPanchang.tithiDeity.presidingDeity}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-amber-400 h-1.5 rounded-full"
                    style={{ width: `${ephemeris.panchanga.tithi.progressPercent}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>{ephemeris.panchanga.tithi.progressPercent.toFixed(1)}% completed</span>
                  {ephemeris.panchanga.tithi.remainingFormatted && (
                    <span className="text-amber-400/90 font-mono">{ephemeris.panchanga.tithi.remainingFormatted}</span>
                  )}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="text-amber-300 font-semibold">Mantra: </span>
                <span className="font-mono text-slate-200">{deepPanchang.tithiDeity.healingMantra}</span>
              </div>
            </div>

            {/* Vara & Core Lifelong Desire */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>2. VARA (अग्नि तत्व - Agni)</span>
                  <span className="font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/30">
                    Eyes & Feet
                  </span>
                </div>
                <div className="text-base font-bold text-emerald-300 mt-1">
                  {ephemeris.panchanga.vara.name} ({ephemeris.panchanga.vara.sanskritName})
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Lord: <span className="text-emerald-200 font-bold">{deepPanchang.weekdayDesire.weekdayLord}</span> (House {deepPanchang.weekdayDesire.lordHouse}, {deepPanchang.weekdayDesire.lordSign})
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[11px]">
                <span className="text-amber-300 font-bold block">🌟 Lifelong Core Desire:</span>
                <span className="text-slate-200 font-semibold">{deepPanchang.weekdayDesire.desireTheme}</span>
                <p className="text-[10px] text-slate-400 mt-0.5">{deepPanchang.weekdayDesire.coreLifelongDesire}</p>
              </div>
            </div>

            {/* Nakshatra & Panchak / Abhijit */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>3. NAKSHATRA (वायु तत्व - Vayu)</span>
                  {deepPanchang.panchakAbhijit.isPanchakBirth ? (
                    <span className="font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-400/40">
                      ⚡ Panchak (5x Multiplier)
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[10px]">Relationships</span>
                  )}
                </div>
                <div className="text-base font-bold text-sky-300 mt-1">
                  {ephemeris.panchanga.nakshatra.sanskritName} (Pada {ephemeris.panchanga.nakshatra.pada})
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Lord: {ephemeris.panchanga.nakshatra.lord} | Deity: {ephemeris.panchanga.nakshatra.deity}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                {deepPanchang.panchakAbhijit.isAbhijitZone ? (
                  <span className="text-emerald-300 font-semibold">👑 Infallible Abhijit Victory Star Cusp</span>
                ) : (
                  <span>Air limb governing social network connections & relational ties</span>
                )}
              </div>
            </div>

            {/* Yoga */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>4. YOGA (आकाश तत्व - Akasha)</span>
                  <span className="font-bold text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-400/10 border border-indigo-400/30">
                    Divine Grace
                  </span>
                </div>
                <div className="text-base font-bold text-indigo-300 mt-1">
                  {ephemeris.panchanga.yoga.name} (#{ephemeris.panchanga.yoga.index})
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Governed by <span className="text-amber-300 font-semibold">Jupiter (Guru)</span> • Speech & Hearing
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                <span>Yogi Point: </span>
                <span className="font-bold text-amber-300">{deepPanchang.yogiAvayogi.yogiDegreeFormatted}</span>
              </div>
            </div>

            {/* Karana & Mars Execution */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>5. KARANA (पृथ्वी तत्व - Prithvi)</span>
                  <span className="font-bold text-pink-400 px-1.5 py-0.5 rounded bg-pink-400/10 border border-pink-400/30">
                    {deepPanchang.karanExecution.karanType}
                  </span>
                </div>
                <div className="text-base font-bold text-pink-300 mt-1">
                  {ephemeris.panchanga.karana.name} (#{ephemeris.panchanga.karana.index})
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Lord: <span className="font-semibold text-pink-200">{deepPanchang.karanExecution.karanLord}</span> | Mars (Action): House {deepPanchang.karanExecution.marsHouse}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="text-slate-300 font-semibold">Execution: </span>
                <span>{deepPanchang.karanExecution.workExecutionStyle}</span>
              </div>
            </div>

            {/* Location & Time */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-xs text-slate-400">OBSERVATION PLACE & TIME</span>
                <div className="text-sm font-bold text-slate-200 mt-1">
                  {ephemeris.location.cityName}, {ephemeris.location.country}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  {ephemeris.location.latitude.toFixed(4)}° N, {ephemeris.location.longitude.toFixed(4)}° E
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                Ayanamsha: {ephemeris.ayanamshaType} ({ephemeris.ayanamshaValue.toFixed(2)}°)
              </div>
            </div>
          </div>

          {/* Dagdha Rashis & Viparita Raja Yoga Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/30 via-slate-900 to-amber-950/20 border border-red-500/30 shadow-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-black text-amber-300 uppercase tracking-wide">
                  Dagdha Rashis (Burnt Signs) & Viparita Raja Yoga
                </span>
              </div>
              {deepPanchang.dagdhaAnalysis.viparitaYogaActive ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 animate-pulse">
                  🌟 Viparita Raja Yoga Active
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400">
                  Session 48 Standard
                </span>
              )}
            </div>

            {deepPanchang.dagdhaAnalysis.hasDagdhaSigns ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {deepPanchang.dagdhaAnalysis.dagdhaSigns.map((d) => (
                  <div
                    key={d.signIndex}
                    className={`p-3 rounded-lg border ${
                      d.isViparitaRajaYoga
                        ? "bg-emerald-950/20 border-emerald-500/40"
                        : "bg-slate-950/60 border-slate-800"
                    } space-y-1.5`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-200">{d.signName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        House {d.houseFromLagna}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{d.houseSignifications}</p>
                    {d.isViparitaRajaYoga && (
                      <div className="text-[11px] text-emerald-300 font-semibold">
                        ⚡ Viparita Raja Yoga: Burnt condition consumes debts, sickness & hidden adversaries!
                      </div>
                    )}
                    {d.occupyingPlanets.map((p) => (
                      <div key={p.name} className="text-[10px] text-amber-300 font-mono">
                        • Planet {p.name}{p.isRetrograde ? " (Retrograde)" : ""}: {p.remediationStatus}
                      </div>
                    ))}
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                      Remedy: {d.remedialAction}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-300">
                Native born on Purnima or Amavasya; Sun and Moon in equilibrium. Zero Dagdha signs present.
              </p>
            )}
            <p className="text-[11px] text-slate-400 italic">
              {deepPanchang.dagdhaAnalysis.spiritualHealingPrescription}
            </p>
          </div>

          {/* Yogi / Avayogi & Three-Tier Vishnu Armor Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Yogi & Avayogi Points */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <span>🎯</span>
                <span>Yogi, Sahayogi & Avayogi Points (Session 49)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 font-bold block">YOGI PLANET (Catalyst)</span>
                  <span className="text-sm font-bold text-slate-100">{deepPanchang.yogiAvayogi.yogiPlanet}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{deepPanchang.yogiAvayogi.yogiNakshatra}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/30">
                  <span className="text-[10px] text-red-400 font-bold block">AVAYOGI PLANET (+6 Refinement)</span>
                  <span className="text-sm font-bold text-slate-100">{deepPanchang.yogiAvayogi.avayogiPlanet}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">House {deepPanchang.yogiAvayogi.avayogiHouse} ({deepPanchang.yogiAvayogi.avayogiNakshatra})</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                {deepPanchang.yogiAvayogi.consciousRefinementAdvice}
              </p>
            </div>

            {/* Three-Tier Vishnu Armor */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <span>🛡️</span>
                <span>Three-Tier Vishnu Armor (त्रिविध विष्णु कवच - Session 49)</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-amber-400 font-bold">1. Physical: </span>
                  <span className="font-mono text-slate-200">{deepPanchang.vishnuArmor.tier1Physical.mantraDevanagari}</span>
                  <span className="text-slate-400 text-[10px] block">Immunity, structural body & vitality (Annamaya Kosha)</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-cyan-400 font-bold">2. Mental: </span>
                  <span className="font-mono text-slate-200">{deepPanchang.vishnuArmor.tier2Mental.mantraDevanagari}</span>
                  <span className="text-slate-400 text-[10px] block">Emotional calm, anxiety relief at dusk (Manomaya Kosha)</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-emerald-400 font-bold">3. Spiritual: </span>
                  <span className="font-mono text-slate-200">{deepPanchang.vishnuArmor.tier3Spiritual.mantraDevanagari}</span>
                  <span className="text-slate-400 text-[10px] block">Divine grace & karmic knot release (Vijnanamaya Kosha)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


