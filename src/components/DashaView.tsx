"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { calculateVimshottariDasha, MahadashaNode, AntardashaNode } from "../engine/dasha";

export default function DashaView() {
  const { ephemeris, currentDate } = useAstroStore();

  const [expandedMD, setExpandedMD] = useState<string | null>(null);
  const [expandedAD, setExpandedAD] = useState<string | null>(null);

  const moonLon = ephemeris.planets.Moon.siderealLongitude;
  const birthDate = currentDate;

  const dashaData = useMemo(() => {
    return calculateVimshottariDasha(birthDate, moonLon, new Date());
  }, [birthDate, moonLon]);

  const active = dashaData.activeDasha;

  // Auto-expand current active MD on initial render
  React.useEffect(() => {
    if (active && !expandedMD) {
      setExpandedMD(active.mahadasha.id);
      setExpandedAD(`${active.mahadasha.id}-${active.antardasha.id}`);
    }
  }, [active, expandedMD]);

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">👑</span>
              <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Vimshottari Dasha Timeline
              </h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                120 Years BPHS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Complete Parashari planetary period hierarchy • Mahadasha (MD) → Antardasha (AD) → Pratyantardasha (PD)
            </p>
          </div>

          {/* Birth Balance Pill */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3.5 py-2 rounded-2xl">
            <span className="text-amber-400 text-xs">☽</span>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold">
                Starting Balance at Birth:
              </span>
              <span className="text-xs font-black text-amber-300 font-mono">
                {dashaData.balanceFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Active Dasha Hero Card */}
        {active && (
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-900 border border-amber-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Currently Active Dasha Period (वर्तमान सक्रिय दशा):
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Today: {formatDate(new Date())}
              </span>
            </div>

            {/* MD - AD - PD Flow Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Mahadasha */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-400/50 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Mahadasha (महादशा)
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{active.mahadasha.symbol}</span>
                  <span className="text-sm font-black text-slate-100">{active.mahadasha.name}</span>
                  <span className="text-xs text-amber-400 font-semibold">({active.mahadasha.hindiName})</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {formatDate(active.mdStart)} – {formatDate(active.mdEnd)}
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all"
                    style={{ width: `${active.percentageCompleteMD}%` }}
                  ></div>
                </div>
                <span className="text-[9px] text-amber-300 font-mono block text-right">
                  {active.percentageCompleteMD}% Elapsed
                </span>
              </div>

              {/* Antardasha */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-400/50 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Antardasha (अन्तर्दशा)
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{active.antardasha.symbol}</span>
                  <span className="text-sm font-black text-slate-100">{active.antardasha.name}</span>
                  <span className="text-xs text-purple-300 font-semibold">({active.antardasha.hindiName})</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {formatDate(active.adStart)} – {formatDate(active.adEnd)}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-purple-400 h-full rounded-full transition-all"
                    style={{ width: `${active.percentageCompleteAD}%` }}
                  ></div>
                </div>
                <span className="text-[9px] text-purple-300 font-mono block text-right">
                  {active.percentageCompleteAD}% Elapsed
                </span>
              </div>

              {/* Pratyantardasha */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-400/50 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Pratyantardasha (प्रत्यन्तर्दशा)
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{active.pratyantardasha.symbol}</span>
                  <span className="text-sm font-black text-slate-100">{active.pratyantardasha.name}</span>
                  <span className="text-xs text-cyan-300 font-semibold">({active.pratyantardasha.hindiName})</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {formatDate(active.pdStart)} – {formatDate(active.pdEnd)}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all"
                    style={{ width: `${active.percentageCompletePD}%` }}
                  ></div>
                </div>
                <span className="text-[9px] text-cyan-300 font-mono block text-right">
                  {active.percentageCompletePD}% Elapsed
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. 120-Year Lifetime Visual Bar */}
      <div className="glass-panel p-4 rounded-3xl border border-slate-800 bg-slate-950/60 shadow-lg space-y-2">
        <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
          120-Year Mahadasha Overview Ribbon:
        </span>
        <div className="w-full h-8 rounded-xl bg-slate-900 border border-slate-800 flex overflow-hidden">
          {dashaData.mahadashas.map((md) => {
            const isCurrent = active?.mahadasha.id === md.lord.id;
            const flexWeight = md.durationYears;
            return (
              <div
                key={md.lord.id}
                onClick={() => setExpandedMD(md.lord.id)}
                style={{ flex: flexWeight }}
                className={`h-full flex items-center justify-center text-[10px] font-extrabold cursor-pointer transition-all border-r border-slate-950/40 relative group ${
                  isCurrent
                    ? "bg-amber-500 text-slate-950 shadow-inner ring-2 ring-white z-10"
                    : "bg-slate-850 hover:bg-slate-800 text-slate-300"
                }`}
                title={`${md.lord.name} MD: ${formatDate(md.startDate)} to ${formatDate(md.endDate)} (${md.durationYears} yrs)`}
              >
                <span className="truncate px-1">{md.lord.name.substring(0, 3)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Complete Expandable Accordion Tree */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
            Full Vimshottari Dasha Hierarchy (विम्शोत्तरी दशा सारणी)
          </h3>
          <span className="text-[11px] text-slate-400">Click any Mahadasha to expand Antardashas</span>
        </div>

        <div className="space-y-2.5">
          {dashaData.mahadashas.map((md) => {
            const isMDExpanded = expandedMD === md.lord.id;
            const isCurrentMD = active?.mahadasha.id === md.lord.id;

            return (
              <div
                key={md.lord.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isCurrentMD
                    ? "border-amber-500/60 bg-slate-950 shadow-xl"
                    : "border-slate-800/80 bg-slate-950/40 hover:border-slate-700"
                }`}
              >
                {/* Mahadasha Header Row */}
                <div
                  onClick={() => setExpandedMD(isMDExpanded ? null : md.lord.id)}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isCurrentMD ? "bg-amber-500/10 hover:bg-amber-500/15" : "hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{md.lord.symbol}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm text-slate-100">
                          {md.lord.name} Mahadasha
                        </h4>
                        <span className="text-xs text-amber-400 font-semibold">({md.lord.hindiName})</span>
                        {isCurrentMD && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                            Active MD
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {formatDate(md.startDate)} → {formatDate(md.endDate)} • {md.durationYears} Years
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-400 hidden sm:inline">
                      9 Antardashas
                    </span>
                    <span className="text-sm text-slate-400 font-bold">
                      {isMDExpanded ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* Sub-Level: Antardashas */}
                {isMDExpanded && (
                  <div className="p-3 bg-slate-900/40 border-t border-slate-800/80 space-y-2 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {md.antardashas.map((ad) => {
                        const adKey = `${md.lord.id}-${ad.lord.id}`;
                        const isADExpanded = expandedAD === adKey;
                        const isCurrentAD = isCurrentMD && active?.antardasha.id === ad.lord.id;

                        return (
                          <div
                            key={ad.lord.id}
                            className={`p-2.5 rounded-xl border text-xs transition-all ${
                              isCurrentAD
                                ? "bg-purple-950/30 border-purple-400 ring-1 ring-purple-400"
                                : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                            }`}
                          >
                            <div
                              onClick={() => setExpandedAD(isADExpanded ? null : adKey)}
                              className="flex items-center justify-between cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5">
                                <span>{ad.lord.symbol}</span>
                                <span className="font-extrabold text-slate-200">
                                  {md.lord.name.substring(0, 2)}-{ad.lord.name}
                                </span>
                                <span className="text-[10px] text-slate-400">({ad.lord.hindiName})</span>
                                {isCurrentAD && (
                                  <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                                    CURRENT
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {isADExpanded ? "▲" : "▼"}
                              </span>
                            </div>

                            <div className="text-[10px] font-mono text-slate-400 mt-1">
                              {formatDate(ad.startDate)} → {formatDate(ad.endDate)} ({Math.round(ad.durationDays)}d)
                            </div>

                            {/* Pratyantardashas Tree */}
                            {isADExpanded && (
                              <div className="mt-2 pt-2 border-t border-slate-800 space-y-1">
                                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">
                                  Pratyantardashas (प्रत्यन्तर्दशा):
                                </span>
                                <div className="space-y-1">
                                  {ad.pratyantardashas.map((pd) => {
                                    const isCurrentPD = isCurrentAD && active?.pratyantardasha.id === pd.lord.id;
                                    return (
                                      <div
                                        key={pd.lord.id}
                                        className={`flex items-center justify-between text-[10px] px-2 py-1 rounded ${
                                          isCurrentPD
                                            ? "bg-cyan-950/50 border border-cyan-400 text-cyan-200 font-bold"
                                            : "bg-slate-900/60 text-slate-300"
                                        }`}
                                      >
                                        <span>
                                          {pd.lord.symbol} {md.lord.name.substring(0, 2)}-{ad.lord.name.substring(0, 2)}-{pd.lord.name}
                                        </span>
                                        <span className="font-mono text-[9px] text-slate-400">
                                          {formatDate(pd.startDate)} → {formatDate(pd.endDate)}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}