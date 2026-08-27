"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { calculateVedicEphemeris } from "../engine/ephemeris";
import { calculateMatchmaking, CompatibilityResult } from "../engine/matchmaking";
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

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl text-rose-400">💑</span>
            <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-rose-300 via-amber-300 to-amber-500 bg-clip-text text-transparent">
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
              matchResult.totalScore >= 28
                ? "bg-emerald-950 text-emerald-300 border-emerald-500"
                : matchResult.totalScore >= 18
                ? "bg-amber-950 text-amber-300 border-amber-500"
                : "bg-rose-950 text-rose-300 border-rose-500"
            }`}
          >
            {matchResult.percentage}%
          </span>
        </div>
      </div>

      {/* Partner Input Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Partner A (Groom / Boy) */}
        <div className="glass-panel p-5 rounded-2xl border border-sky-500/30 bg-slate-950/80 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤵</span>
              <h3 className="font-extrabold text-sm text-sky-300 uppercase tracking-wider">
                Groom (वर विवरण)
              </h3>
            </div>
            {savedProfiles.length > 0 && (
              <select
                onChange={(e) => handleLoadProfile(e.target.value, "boy")}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-[10px] rounded-lg px-2 py-1 cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Load Profile...</option>
                {savedProfiles.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Name</label>
              <input
                type="text"
                value={boyName}
                onChange={(e) => setBoyName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl p-2 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-400 font-bold block mb-1">Birth Date & Time</label>
              <input
                type="datetime-local"
                value={boyDate}
                onChange={(e) => setBoyDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl p-2 font-mono"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-400">Moon Rashi:</span>{" "}
              <strong className="text-amber-300">{boyEphem.planets.Moon.rashi.englishName} ({boyEphem.planets.Moon.rashi.symbol})</strong>
            </div>
            <div>
              <span className="text-slate-400">Nakshatra:</span>{" "}
              <strong className="text-emerald-300">{boyEphem.planets.Moon.nakshatra.sanskritName} (Pada {boyEphem.planets.Moon.nakshatra.pada})</strong>
            </div>
          </div>
        </div>

        {/* Partner B (Bride / Girl) */}
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-slate-950/80 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">👰</span>
              <h3 className="font-extrabold text-sm text-rose-300 uppercase tracking-wider">
                Bride (कन्या विवरण)
              </h3>
            </div>
            {savedProfiles.length > 0 && (
              <select
                onChange={(e) => handleLoadProfile(e.target.value, "girl")}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-[10px] rounded-lg px-2 py-1 cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Load Profile...</option>
                {savedProfiles.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Name</label>
              <input
                type="text"
                value={girlName}
                onChange={(e) => setGirlName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl p-2 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-400 font-bold block mb-1">Birth Date & Time</label>
              <input
                type="datetime-local"
                value={girlDate}
                onChange={(e) => setGirlDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl p-2 font-mono"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-400">Moon Rashi:</span>{" "}
              <strong className="text-amber-300">{girlEphem.planets.Moon.rashi.englishName} ({girlEphem.planets.Moon.rashi.symbol})</strong>
            </div>
            <div>
              <span className="text-slate-400">Nakshatra:</span>{" "}
              <strong className="text-emerald-300">{girlEphem.planets.Moon.nakshatra.sanskritName} (Pada {girlEphem.planets.Moon.nakshatra.pada})</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Ashtakoota 36-Guna Detailed Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>📊</span>
            <span>Ashtakoota 8-Pillar Scoring Breakdown (अष्टकूट विवरण)</span>
          </h3>
          <span className="text-xs font-mono font-bold text-amber-400">
            Total Obtained: {matchResult.totalScore} / 36
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                <th className="p-3 font-bold">Koota</th>
                <th className="p-3">Groom Attribute</th>
                <th className="p-3">Bride Attribute</th>
                <th className="p-3 text-center">Score</th>
                <th className="p-3">Astrological Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {Object.values(matchResult.kootas).map((k) => {
                const isFull = k.obtainedScore === k.maxScore;
                const isZero = k.obtainedScore === 0;
                return (
                  <tr
                    key={k.name}
                    className={`hover:bg-slate-900/60 transition-colors ${
                      isZero ? "bg-rose-950/10" : isFull ? "bg-emerald-950/10" : ""
                    }`}
                  >
                    <td className="p-3">
                      <div className="font-extrabold text-slate-200">{k.name}</div>
                      <div className="text-[10px] text-slate-400">{k.sanskritName}</div>
                    </td>
                    <td className="p-3 text-sky-300 font-medium">{k.boyAttribute}</td>
                    <td className="p-3 text-rose-300 font-medium">{k.girlAttribute}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-md font-black text-xs border ${
                          isFull
                            ? "bg-emerald-950 text-emerald-300 border-emerald-500/60"
                            : isZero
                            ? "bg-rose-950 text-rose-300 border-rose-500/60"
                            : "bg-amber-950 text-amber-300 border-amber-500/60"
                        }`}
                      >
                        {k.obtainedScore} / {k.maxScore}
                      </span>
                      {k.isCancelled && (
                        <div className="text-[9px] text-emerald-400 font-bold mt-1">Cancelled ✨</div>
                      )}
                    </td>
                    <td className="p-3 text-slate-300 max-w-sm text-[11px]">{k.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manglik & Verdict Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manglik Dosha Comparison */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span>🔥</span>
              <span>Kuja / Manglik Dosha Analysis</span>
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                matchResult.manglikCompatibility.isCompatible
                  ? "bg-emerald-950 text-emerald-300 border-emerald-500"
                  : "bg-rose-950 text-rose-300 border-rose-500"
              }`}
            >
              {matchResult.manglikCompatibility.statusText}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-sky-300 font-bold block">{boyName}</span>
              <div className="font-black text-sm text-slate-200">
                {matchResult.boyManglik.isManglik ? `Manglik (${matchResult.boyManglik.severity})` : "Non-Manglik"}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Mars in House #{matchResult.boyManglik.marsHouseFromLagna} from Lagna
              </div>
              {matchResult.boyManglik.isCancelled && (
                <div className="text-[9px] text-emerald-400 font-bold">Exempt: {matchResult.boyManglik.cancellationReasons[0]}</div>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-rose-300 font-bold block">{girlName}</span>
              <div className="font-black text-sm text-slate-200">
                {matchResult.girlManglik.isManglik ? `Manglik (${matchResult.girlManglik.severity})` : "Non-Manglik"}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Mars in House #{matchResult.girlManglik.marsHouseFromLagna} from Lagna
              </div>
              {matchResult.girlManglik.isCancelled && (
                <div className="text-[9px] text-emerald-400 font-bold">Exempt: {matchResult.girlManglik.cancellationReasons[0]}</div>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            {matchResult.manglikCompatibility.description}
          </p>
        </div>

        {/* Final Astrologer Verdict Card */}
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-slate-950 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Vedic Marriage Compatibility Verdict
              </span>
              <span className="text-2xl">💍</span>
            </div>
            <h3 className="text-2xl font-black text-amber-300 mt-2">
              {matchResult.verdict}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {matchResult.verdictDescription}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p>💡 <strong>Classical Standard:</strong> Minimum 18 Gunas required; 28+ Gunas indicates premier alignment.</p>
            <p>✨ Nadi & Bhakoot carry 15 points combined and represent biological & emotional longevity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
