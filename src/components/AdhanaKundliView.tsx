"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { calculateAdhanaKundali, GestationalMonthEvaluation } from "../engine/adhanaKundali";
import { RASHI_NAMES } from "../engine/constants";

export default function AdhanaKundliView() {
  const {
    currentDate,
    location,
    ephemeris: natalEphemeris,
    gender,
    activeProfileName,
  } = useAstroStore();

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [chartStyle, setChartStyle] = useState<"north" | "south">("north");

  // Calculate Adhana Kundali & 10-Month Gestation
  const adhanaResult = useMemo(() => {
    return calculateAdhanaKundali(natalEphemeris, currentDate, location);
  }, [natalEphemeris, currentDate, location]);

  const {
    estimatedConceptionDate,
    gestationDurationDays,
    gestationDurationWeeks,
    adhanaEphemeris,
    adhanaLagnaSign,
    adhanaLagnaLord,
    adhanaLagnaDegreeStr,
    adhanaMoonSign,
    adhanaMoonNakshatra,
    adhanaMoonDegreeStr,
    gestationalMonths,
    garbhaRaksha,
    btrHarmonicRelationship,
    btrConfidenceScore,
    btrSummary,
    executiveSummary,
  } = adhanaResult;

  // Active selected gestational month (defaults to Month 1 or clicked)
  const activeMonthData: GestationalMonthEvaluation = useMemo(() => {
    if (selectedMonth !== null) {
      const found = gestationalMonths.find((m) => m.monthNumber === selectedMonth);
      if (found) return found;
    }
    return gestationalMonths[0];
  }, [selectedMonth, gestationalMonths]);

  // North Indian Chart House Array
  const adhanaAscSignIdx = Math.floor(adhanaEphemeris.ascendant.siderealLongitude / 30);
  const houseOccupants = useMemo(() => {
    const map: Record<number, string[]> = {};
    for (let i = 1; i <= 12; i++) map[i] = [];

    const planetSymbols: Record<string, string> = {
      Sun: "Su (सूर्य)",
      Moon: "Mo (चन्द्र)",
      Mars: "Ma (मंगल)",
      Mercury: "Me (बुध)",
      Jupiter: "Ju (गुरु)",
      Venus: "Ve (शुक्र)",
      Saturn: "Sa (शनि)",
      Rahu: "Ra (राहु)",
      Ketu: "Ke (केतु)",
    };

    Object.entries(adhanaEphemeris.planets).forEach(([name, p]) => {
      if (!p) return;
      const sIdx = Math.floor(p.siderealLongitude / 30);
      const hNum = ((sIdx - adhanaAscSignIdx + 12) % 12) + 1;
      map[hNum].push(planetSymbols[name] || name);
    });

    return map;
  }, [adhanaEphemeris, adhanaAscSignIdx]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-amber-500/30 bg-slate-950/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤰</span>
              <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent tracking-tight">
                Adhana Kundali & Foetal Gestation Engine
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans">
              Epoch Conception Chart (*Nisheka Lagna*) & 10-Month Foetal Organogenesis Timeline
            </p>
            <p className="text-[11px] text-amber-400/80 font-mono">
              Authority: Maharshi Parashara (BPHS) • Acharya Varahamihira (Brihat Jataka Ch. 4) • Saravali Ch. 8
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl text-center min-w-[120px]">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Gestation Span</span>
              <span className="font-black text-amber-400 text-sm">{gestationDurationDays} Days</span>
              <span className="text-[9.5px] text-slate-500 block">({gestationDurationWeeks} Weeks)</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl text-center min-w-[130px]">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Garbha Raksha</span>
              <span
                className={`text-xs font-black px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                  garbhaRaksha.protectionScore >= 75
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-700/50"
                    : "bg-amber-950 text-amber-300 border border-amber-700/50"
                }`}
              >
                {garbhaRaksha.protectionScore}% Vitality
              </span>
              <span className="text-[9.5px] text-slate-400 block truncate max-w-[120px]">{garbhaRaksha.verdict.split(" ")[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Epoch Conception Diagnostic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
            <span>🗓️</span> Estimated Conception Epoch
          </span>
          <span className="font-black text-slate-100 text-sm block">
            {estimatedConceptionDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </span>
          <span className="text-[10px] text-slate-400 font-mono block">
            {estimatedConceptionDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} Local Civil
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
            <span>🏛️</span> Adhana Ascendant (Lagna)
          </span>
          <span className="font-bold text-amber-300 text-sm block">
            {adhanaLagnaDegreeStr}
          </span>
          <span className="text-[10px] text-slate-400 block">
            Ruler: <strong className="text-slate-200">{adhanaLagnaLord}</strong> (Soul Blueprint)
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
            <span>🌙</span> Adhana Moon & Nakshatra
          </span>
          <span className="font-bold text-sky-300 text-sm block">
            {adhanaMoonDegreeStr}
          </span>
          <span className="text-[10px] text-slate-400 block truncate">
            {adhanaMoonNakshatra}
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
            <span>📐</span> BTR Verification Harmony
          </span>
          <span className="font-bold text-emerald-300 text-sm block">
            {btrConfidenceScore}% Confidence
          </span>
          <span className="text-[10px] text-slate-400 block truncate">
            {btrHarmonicRelationship}
          </span>
        </div>
      </div>

      {/* Chart & Adhana Planetary Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Adhana Kundali Chart View */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <span>☸</span> Adhana Kundali Chart (आधान चक्र)
            </h3>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setChartStyle("north")}
                className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                  chartStyle === "north" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                North
              </button>
              <button
                type="button"
                onClick={() => setChartStyle("south")}
                className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                  chartStyle === "south" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                South
              </button>
            </div>
          </div>

          {/* North Indian Diamond Representation */}
          <div className="relative w-full aspect-square max-w-[380px] mx-auto bg-slate-900/90 border-2 border-amber-500/40 rounded-2xl p-2 shadow-inner">
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-amber-500/30 fill-none stroke-[0.7]">
              {/* Diamond grid lines */}
              <line x1="0" y1="0" x2="100" y2="100" />
              <line x1="0" y1="100" x2="100" y2="0" />
              <polygon points="50,0 100,50 50,100 0,50" />
              <line x1="0" y1="0" x2="100" y2="0" />
              <line x1="100" y1="0" x2="100" y2="100" />
              <line x1="100" y1="100" x2="0" y2="100" />
              <line x1="0" y1="100" x2="0" y2="0" />
            </svg>

            {/* House Numbers and Occupants Overlay */}
            {[
              { h: 1, x: "50%", y: "22%", sign: (adhanaAscSignIdx % 12) + 1 },
              { h: 2, x: "28%", y: "12%", sign: ((adhanaAscSignIdx + 1) % 12) + 1 },
              { h: 3, x: "12%", y: "28%", sign: ((adhanaAscSignIdx + 2) % 12) + 1 },
              { h: 4, x: "24%", y: "50%", sign: ((adhanaAscSignIdx + 3) % 12) + 1 },
              { h: 5, x: "12%", y: "72%", sign: ((adhanaAscSignIdx + 4) % 12) + 1 },
              { h: 6, x: "28%", y: "88%", sign: ((adhanaAscSignIdx + 5) % 12) + 1 },
              { h: 7, x: "50%", y: "78%", sign: ((adhanaAscSignIdx + 6) % 12) + 1 },
              { h: 8, x: "72%", y: "88%", sign: ((adhanaAscSignIdx + 7) % 12) + 1 },
              { h: 9, x: "88%", y: "72%", sign: ((adhanaAscSignIdx + 8) % 12) + 1 },
              { h: 10, x: "76%", y: "50%", sign: ((adhanaAscSignIdx + 9) % 12) + 1 },
              { h: 11, x: "88%", y: "28%", sign: ((adhanaAscSignIdx + 10) % 12) + 1 },
              { h: 12, x: "72%", y: "12%", sign: ((adhanaAscSignIdx + 11) % 12) + 1 },
            ].map(({ h, x, y, sign }) => (
              <div
                key={h}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                style={{ left: x, top: y }}
              >
                <span className="text-[9px] font-mono text-slate-500 font-bold leading-none">{sign}</span>
                <div className="flex flex-wrap justify-center gap-0.5 mt-0.5 max-w-[60px]">
                  {houseOccupants[h]?.map((p, idx) => (
                    <span
                      key={idx}
                      className="text-[8.5px] font-mono font-black text-amber-300 bg-slate-950/80 px-1 py-0.2 rounded border border-amber-500/30"
                    >
                      {p.split(" ")[0]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 font-sans text-center bg-slate-900/50 p-2 rounded-xl border border-slate-800">
            <strong>Adhana Epoch Coordinates:</strong> Calculated at the exact moment of fertilization ({adhanaResult.gestationDurationDays} days prior to physical delivery).
          </div>
        </div>

        {/* Right: Adhana Planetary Table & BTR Symphony */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center justify-between">
              <span>Adhana Planetary Coordinates (आधान ग्रह स्थिति)</span>
              <span className="text-[10px] text-slate-400 font-mono">Epoch: {adhanaResult.adhanaEphemeris.ayanamshaType}</span>
            </h3>

            <div className="overflow-x-auto custom-scrollbar max-h-56">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                    <th className="p-2 font-bold">Planet</th>
                    <th className="p-2">Sign & Degree</th>
                    <th className="p-2">House</th>
                    <th className="p-2">Motion / गति</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-2 font-bold text-amber-400">Ascendant (Lagna)</td>
                    <td className="p-2 text-slate-200">{adhanaLagnaDegreeStr}</td>
                    <td className="p-2 text-slate-400">H1</td>
                    <td className="p-2 text-slate-400">—</td>
                  </tr>
                  {Object.entries(adhanaEphemeris.planets).map(([name, p]) => {
                    if (!p) return null;
                    const sIdx = Math.floor(p.siderealLongitude / 30);
                    const h = ((sIdx - adhanaAscSignIdx + 12) % 12) + 1;
                    return (
                      <tr key={name} className="hover:bg-slate-900/40">
                        <td className="p-2 font-bold text-slate-200">{name}</td>
                        <td className="p-2 text-slate-300 font-sans">
                          {p.rashi.englishName} {(p.siderealLongitude % 30).toFixed(2)}°
                        </td>
                        <td className="p-2 font-bold text-indigo-300">H{h}</td>
                        <td className="p-2 text-xs">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              p.isRetrograde
                                ? "bg-amber-950 text-amber-300 border border-amber-800"
                                : "bg-slate-900 text-slate-300 border border-slate-800"
                            }`}
                          >
                            {p.isRetrograde ? "Retrograde (वक्र)" : "Direct (मार्गी)"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* BTR Mathematical Symphony Card */}
          <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 bg-slate-950/80 shadow-2xl space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>✨</span> Adhana-to-Janma BTR Resonance (Varahamihira Rule)
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60 font-bold">
                {btrConfidenceScore}% Match
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {btrSummary}
            </p>
            <div className="text-[10.5px] text-slate-400 font-sans bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
              <strong>Classical Axiom:</strong> The Moon's position at the time of Adhana determines the Lagna or Moon of the physical birth chart, verifying the exact cosmic clock down to the minute.
            </div>
          </div>
        </div>
      </div>

      {/* 10-Month Foetal Gestation Development Matrix (Organogenesis) */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <span>🧬</span> 10-Month Foetal Development Timeline (*Garbha Masa Patis*)
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              According to Maharshi Parashara & Acharya Varahamihira's *Brihat Jataka* (Nishekadhyaya)
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Click any month to inspect detailed organogenesis & ruling Graha
          </span>
        </div>

        {/* 10 Months Horizontal Timeline Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {gestationalMonths.map((m) => {
            const isSelected = activeMonthData.monthNumber === m.monthNumber;
            return (
              <button
                key={m.monthNumber}
                type="button"
                onClick={() => setSelectedMonth(m.monthNumber)}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1 ${
                  isSelected
                    ? "bg-amber-500/15 border-amber-400 text-amber-300 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/10"
                    : "bg-slate-900/80 hover:bg-slate-900 border-slate-800 text-slate-300"
                }`}
              >
                <span className="text-[10px] text-slate-400 font-mono font-bold">M{m.monthNumber}</span>
                <span className="font-bold text-xs block leading-tight">{m.rulingPlanet}</span>
                <span className="text-[9px] text-slate-400 font-sans block truncate max-w-[70px]">
                  {m.sanskritStage.split(" ")[0]}
                </span>
                <span
                  className={`w-2 h-2 rounded-full mt-1 ${
                    m.vitalityScore >= 85
                      ? "bg-emerald-400 shadow-sm shadow-emerald-400"
                      : m.vitalityScore >= 65
                      ? "bg-sky-400 shadow-sm shadow-sky-400"
                      : "bg-amber-400 shadow-sm shadow-amber-400"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Active Selected Month Detailed Inspector Card */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-slate-900/90 shadow-2xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌟</span>
              <div>
                <h4 className="font-black text-sm text-slate-100 uppercase tracking-wide">
                  {activeMonthData.monthName}: {activeMonthData.sanskritStage} ({activeMonthData.stageTranslation})
                </h4>
                <p className="text-[11px] text-amber-400 font-mono">
                  Gestation Window: {activeMonthData.startDateIso} to {activeMonthData.endDateIso}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Vitality Score:</span>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-black ${
                  activeMonthData.vitalityScore >= 80
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                    : activeMonthData.vitalityScore >= 60
                    ? "bg-sky-950 text-sky-300 border border-sky-700"
                    : "bg-amber-950 text-amber-300 border border-amber-700"
                }`}
              >
                {activeMonthData.vitalityScore}% • {activeMonthData.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Ruling Graha (*Masa Pati*)</span>
              <span className="font-bold text-amber-300 text-sm block">{activeMonthData.rulingPlanet}</span>
              <span className="text-[10px] text-slate-400 block font-mono">
                Placed in {activeMonthData.planetRashi} (House #{activeMonthData.planetHouseFromAdhana}) • {activeMonthData.dignity}
              </span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1 md:col-span-2">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Physiological Development (*Sharira Nirmana*)</span>
              <span className="font-medium text-slate-200 text-xs block leading-relaxed font-sans">
                {activeMonthData.organDevelopment}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <strong>Classical Diagnostic:</strong> {activeMonthData.classicalDiagnostic}
          </p>
        </div>
      </div>

      {/* Garbha Raksha (Divine Protection Shield) */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-slate-950/80 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <div>
              <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
                Garbha Raksha & Astrological Protection Shield (गर्भ रक्षा कवच)
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Parashari protection factors and maternal sanctuary resonance
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-950 text-emerald-300 border border-emerald-600/50">
            {garbhaRaksha.verdict}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1 text-xs uppercase">
              <span>✓</span> Fortified Kendra & Trikona Benefics
            </h4>
            <ul className="space-y-1 text-slate-300 text-[11.5px]">
              {garbhaRaksha.garbhaKavachamFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400 flex items-center gap-1 text-xs uppercase">
              <span>🧘</span> Garbha Samskara & Sacred Maternal Harmony
            </h4>
            <p className="text-slate-300 text-[11.5px] leading-relaxed">
              Classical Vedic treatises emphasize that the mother's mental state, Sattvic diet, listening to sacred chants (*Vishnu Sahasranama*, *Garbha Raksha Stotram*), and serene environment nurture the *Jeevatma* through the 10 developmental thresholds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
