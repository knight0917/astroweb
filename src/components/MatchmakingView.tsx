"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { calculateVedicEphemeris } from "../engine/ephemeris";
import { calculateMatchmaking, CompatibilityResult, KootaScore } from "../engine/matchmaking";
import { POPULAR_CITIES } from "../engine/constants";
import { GeoLocation } from "../engine/types";

export default function MatchmakingView() {
  const { ayanamsha, houseSystem, nodeType, savedProfiles } = useAstroStore();

  const [boyName, setBoyName] = useState("Groom (वर)");
  const [boyDate, setBoyDate] = useState("1998-05-25T00:16");
  const [boyCity, setBoyCity] = useState<GeoLocation>(POPULAR_CITIES[0]);

  const [girlName, setGirlName] = useState("Bride (कन्या)");
  const [girlDate, setGirlDate] = useState("2000-09-14T14:30");
  const [girlCity, setGirlCity] = useState<GeoLocation>(POPULAR_CITIES[1]);

  const boyEphem = useMemo(() => {
    const d = new Date(boyDate);
    return calculateVedicEphemeris(d, boyCity, ayanamsha, houseSystem, nodeType);
  }, [boyDate, boyCity, ayanamsha, houseSystem, nodeType]);

  const girlEphem = useMemo(() => {
    const d = new Date(girlDate);
    return calculateVedicEphemeris(d, girlCity, ayanamsha, houseSystem, nodeType);
  }, [girlDate, girlCity, ayanamsha, houseSystem, nodeType]);

  const matchResult: CompatibilityResult = useMemo(() => {
    return calculateMatchmaking(boyEphem, girlEphem);
  }, [boyEphem, girlEphem]);

  const handleLoadProfile = (profileId: string, target: "boy" | "girl") => {
    const p = savedProfiles.find((x) => x.id === profileId);
    if (!p) return;
    const isoString = new Date(p.dateIso).toISOString().slice(0, 16);
    if (target === "boy") {
      setBoyName(p.name);
      setBoyDate(isoString);
      setBoyCity(p.location);
    } else {
      setGirlName(p.name);
      setGirlDate(isoString);
      setGirlCity(p.location);
    }
  };

  const kootaList: KootaScore[] = useMemo(() => {
    return Object.values(matchResult.kootas);
  }, [matchResult]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-rose-300 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              Kundli Milan & Compatibility (अष्टकूट ३६ गुण मिलान)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Muhurta Chintamani & Jataka Parijata • Ashtakoota 36-Guna Scoring, Nadi/Bhakoot Cancellations & Manglik Dosha
          </p>
        </div>

        {/* Quick Guna Score Pill */}
        <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800 shadow-inner">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Compatibility Score</span>
            <span className="text-xl font-black text-amber-400">{matchResult.totalScore} / 36 Gunas</span>
          </div>
          <span
            className={`px-2.5 py-1 rounded-xl text-xs font-black border ${
              matchResult.totalScore >= 18
                ? "bg-emerald-950 text-emerald-300 border-emerald-500"
                : "bg-rose-950 text-rose-300 border-rose-500"
            }`}
          >
            {matchResult.verdict}
          </span>
        </div>
      </div>

      {/* Dual Profile Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Groom Profile */}
        <div className="glass-panel p-5 rounded-2xl border border-sky-500/30 bg-slate-950/70 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="font-bold text-sm text-sky-400 uppercase tracking-wider">
              Groom Profile (वर विवरण)
            </h3>
            {savedProfiles.length > 0 && (
              <select
                onChange={(e) => handleLoadProfile(e.target.value, "boy")}
                className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1"
                defaultValue=""
              >
                <option value="" disabled>Load Saved Profile</option>
                {savedProfiles.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-bold">Name</label>
              <input
                type="text"
                value={boyName}
                onChange={(e) => setBoyName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-slate-100 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-bold">Date & Time</label>
              <input
                type="datetime-local"
                value={boyDate}
                onChange={(e) => setBoyDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-slate-100 font-mono font-bold"
              />
            </div>
          </div>

          {/* Groom Moon & Nakshatra Summary */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Moon Sign (चन्द्र राशि)</span>
              <span className="font-bold text-slate-200">{boyEphem.planets.Moon.rashi.englishName} ({boyEphem.planets.Moon.rashi.sanskritName})</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">Nakshatra (नक्षत्र व पद)</span>
              <span className="font-bold text-amber-400">{boyEphem.planets.Moon.nakshatra.sanskritName} (Pada {boyEphem.planets.Moon.nakshatra.pada})</span>
            </div>
          </div>
        </div>

        {/* Bride Profile */}
        <div className="glass-panel p-5 rounded-2xl border border-pink-500/30 bg-slate-950/70 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="font-bold text-sm text-pink-400 uppercase tracking-wider">
              Bride Profile (कन्या विवरण)
            </h3>
            {savedProfiles.length > 0 && (
              <select
                onChange={(e) => handleLoadProfile(e.target.value, "girl")}
                className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1"
                defaultValue=""
              >
                <option value="" disabled>Load Saved Profile</option>
                {savedProfiles.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-bold">Name</label>
              <input
                type="text"
                value={girlName}
                onChange={(e) => setGirlName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-slate-100 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-bold">Date & Time</label>
              <input
                type="datetime-local"
                value={girlDate}
                onChange={(e) => setGirlDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-slate-100 font-mono font-bold"
              />
            </div>
          </div>

          {/* Bride Moon & Nakshatra Summary */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Moon Sign (चन्द्र राशि)</span>
              <span className="font-bold text-slate-200">{girlEphem.planets.Moon.rashi.englishName} ({girlEphem.planets.Moon.rashi.sanskritName})</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">Nakshatra (नक्षत्र व पद)</span>
              <span className="font-bold text-amber-400">{girlEphem.planets.Moon.nakshatra.sanskritName} (Pada {girlEphem.planets.Moon.nakshatra.pada})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 8 Kootas Detailed Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Ashtakoota 36-Guna Breakdown Table (अष्टकूट सारणी)
        </h3>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                <th className="p-3 font-bold">Koota</th>
                <th className="p-3">Max Gunas</th>
                <th className="p-3">Obtained</th>
                <th className="p-3">Groom Value</th>
                <th className="p-3">Bride Value</th>
                <th className="p-3">Classical Rule & Cancellation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {kootaList.map((k) => (
                <tr key={k.name} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3 font-bold text-slate-200">
                    <div>{k.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{k.sanskritName}</div>
                  </td>
                  <td className="p-3 text-slate-400">{k.maxScore}</td>
                  <td className="p-3 font-bold text-amber-400">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      k.obtainedScore === k.maxScore
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-500/50"
                        : k.obtainedScore > 0
                        ? "bg-amber-950 text-amber-300 border border-amber-500/50"
                        : "bg-rose-950 text-rose-300 border border-rose-500/50"
                    }`}>
                      {k.obtainedScore}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{k.boyAttribute}</td>
                  <td className="p-3 text-slate-300">{k.girlAttribute}</td>
                  <td className="p-3 text-[11px] text-slate-300 max-w-sm">
                    {k.description}
                    {k.isCancelled && (
                      <span className="block text-[10px] text-emerald-400 font-bold mt-0.5">
                        {k.cancellationReason || "Classical Cancellation Applied"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manglik / Kuja Dosha Evaluation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Groom Manglik */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-sky-400 uppercase tracking-wider">
              Groom Kuja / Manglik Check
            </h4>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                matchResult.boyManglik.isManglik
                  ? "bg-rose-950 text-rose-300 border border-rose-500"
                  : "bg-emerald-950 text-emerald-300 border border-emerald-500"
              }`}
            >
              {matchResult.boyManglik.isManglik ? `Manglik (${matchResult.boyManglik.severity})` : "Non-Manglik"}
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              Mars in House #{matchResult.boyManglik.marsHouseFromLagna} from Lagna, #{matchResult.boyManglik.marsHouseFromMoon} from Moon, #{matchResult.boyManglik.marsHouseFromVenus} from Venus.
            </div>
            {matchResult.boyManglik.isCancelled && (
              <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 font-medium">
                Cancellation: {matchResult.boyManglik.cancellationReasons.join(", ")}
              </div>
            )}
          </div>
        </div>

        {/* Bride Manglik */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-pink-400 uppercase tracking-wider">
              Bride Kuja / Manglik Check
            </h4>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                matchResult.girlManglik.isManglik
                  ? "bg-rose-950 text-rose-300 border border-rose-500"
                  : "bg-emerald-950 text-emerald-300 border border-emerald-500"
              }`}
            >
              {matchResult.girlManglik.isManglik ? `Manglik (${matchResult.girlManglik.severity})` : "Non-Manglik"}
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              Mars in House #{matchResult.girlManglik.marsHouseFromLagna} from Lagna, #{matchResult.girlManglik.marsHouseFromMoon} from Moon, #{matchResult.girlManglik.marsHouseFromVenus} from Venus.
            </div>
            {matchResult.girlManglik.isCancelled && (
              <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 font-medium">
                Cancellation: {matchResult.girlManglik.cancellationReasons.join(", ")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Final Compatibility Verdict Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-950 to-slate-950 shadow-2xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              FINAL ASTROLOGICAL VERDICT (मिलान निर्णय)
            </span>
            <h3 className="text-2xl font-black text-slate-100 mt-1">
              {matchResult.verdict}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-mono">Total Compatibility:</span>
            <span className="text-xl font-black text-amber-300 font-mono">
              {matchResult.totalScore} / 36 ({Math.round(matchResult.percentage)}%)
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
          {matchResult.verdictDescription} • {matchResult.manglikCompatibility.description}
        </p>
      </div>
    </div>
  );
}
