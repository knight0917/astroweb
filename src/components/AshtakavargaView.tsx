"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { calculateAshtakavarga, GrahaBAVDetail } from "../engine/ashtakavarga";
import { RASHIS } from "../engine/constants";

export default function AshtakavargaView() {
  const { ephemeris } = useAstroStore();
  const [selectedGraha, setSelectedGraha] = useState<string>("SAV");
  const [viewModeTab, setViewModeTab] = useState<"signs" | "houses">("signs");

  const avResult = useMemo(() => {
    if (!ephemeris) return null;
    return calculateAshtakavarga(ephemeris);
  }, [ephemeris]);

  if (!ephemeris || !avResult) return null;

  const lagnaRashi = ephemeris.ascendant.rashi.index;

  const grahaOptions = [
    { id: "SAV", name: "Sarvashtakavarga (SAV)", symbol: "☸", color: "#f59e0b", total: 337 },
    { id: "Sun", name: "Surya (Sun)", symbol: "☉", color: "#FFB300", total: 48 },
    { id: "Moon", name: "Chandra (Moon)", symbol: "☽", color: "#E0E0E0", total: 49 },
    { id: "Mars", name: "Mangala (Mars)", symbol: "♂", color: "#E53935", total: 39 },
    { id: "Mercury", name: "Budha (Mercury)", symbol: "☿", color: "#43A047", total: 54 },
    { id: "Jupiter", name: "Guru (Jupiter)", symbol: "♃", color: "#FFD54F", total: 56 },
    { id: "Venus", name: "Shukra (Venus)", symbol: "♀", color: "#F06292", total: 52 },
    { id: "Saturn", name: "Shani (Saturn)", symbol: "♄", color: "#5C6BC0", total: 39 },
  ];

  // Active dataset
  const activeDetail: GrahaBAVDetail | null =
    selectedGraha === "SAV" ? null : avResult.bav[selectedGraha];

  // Points for 12 houses or 12 signs
  const currentPoints =
    selectedGraha === "SAV"
      ? viewModeTab === "signs"
        ? avResult.sarvaRashiBindus
        : avResult.sarvaHouseBindus
      : activeDetail
      ? viewModeTab === "signs"
        ? activeDetail.rashiBindus
        : activeDetail.houseBindus
      : [];

  const getStrengthColor = (pts: number, isSAV: boolean) => {
    if (isSAV) {
      if (pts >= 30) return "text-emerald-400 bg-emerald-950/80 border-emerald-600";
      if (pts >= 28) return "text-amber-300 bg-amber-950/80 border-amber-600";
      if (pts >= 25) return "text-yellow-400 bg-yellow-950/80 border-yellow-700";
      return "text-rose-400 bg-rose-950/80 border-rose-700";
    } else {
      if (pts >= 5) return "text-emerald-400 bg-emerald-950/80 border-emerald-600";
      if (pts === 4) return "text-amber-300 bg-amber-950/80 border-amber-600";
      return "text-rose-400 bg-rose-950/80 border-rose-700";
    }
  };

  // North Indian Chart House Coordinates & Points Mapping
  // Diamond polygon vertices for 12 houses
  const HOUSE_POINTS: Record<number, string> = {
    1: "150,0 225,75 150,150 75,75", // Center Top Diamond (H1)
    2: "75,0 150,0 75,75", // Top Left Triangle (H2)
    3: "0,0 75,0 0,75", // Far Top-Left Corner (H3)
    4: "0,75 75,75 150,150 75,225 0,150", // Left Diamond (H4)
    5: "0,225 0,300 75,300", // Far Bottom-Left Corner (H5)
    6: "75,225 75,300 150,300", // Bottom Left Triangle (H6)
    7: "150,150 225,225 150,300 75,225", // Center Bottom Diamond (H7)
    8: "150,300 225,300 225,225", // Bottom Right Triangle (H8)
    9: "225,300 300,300 300,225", // Far Bottom-Right Corner (H9)
    10: "150,150 225,75 300,75 300,150 225,225", // Right Diamond (H10)
    11: "225,0 300,0 300,75", // Far Top-Right Corner (H11)
    12: "150,0 225,0 225,75", // Top Right Triangle (H12)
  };

  const HOUSE_TEXT_CENTERS: Record<number, { x: number; y: number }> = {
    1: { x: 150, y: 75 },
    2: { x: 100, y: 35 },
    3: { x: 35, y: 25 },
    4: { x: 70, y: 150 },
    5: { x: 35, y: 275 },
    6: { x: 100, y: 265 },
    7: { x: 150, y: 225 },
    8: { x: 200, y: 265 },
    9: { x: 265, y: 275 },
    10: { x: 230, y: 150 },
    11: { x: 265, y: 25 },
    12: { x: 200, y: 35 },
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl text-amber-400">☸</span>
            <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Vedic Ashtakavarga & Bhinnaashtakavarga (BAV / SAV)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Classical Brihat Parashara Hora Shastra 337-Bindu Matrix • Strength analysis across 12 Rashis & Houses
          </p>
        </div>

        {/* Total Score Badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-right">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
              Total Sarva Bindus
            </span>
            <span className="text-2xl font-extrabold text-amber-300 font-mono">
              {avResult.totalSAV} <span className="text-xs font-normal text-slate-400">/ 337</span>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for 8 Grahas + SAV */}
      <div className="flex flex-wrap items-center gap-2">
        {grahaOptions.map((opt) => {
          const isSelected = selectedGraha === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelectedGraha(opt.id)}
              style={{
                borderColor: isSelected ? opt.color : undefined,
                color: isSelected ? "#030712" : undefined,
                backgroundColor: isSelected ? opt.color : undefined,
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? "shadow-lg scale-105"
                  : "bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-600 hover:text-white"
              }`}
            >
              <span>{opt.symbol}</span>
              <span>{opt.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected ? "bg-slate-950/30 text-slate-950" : "bg-slate-950 text-amber-400"
                }`}
              >
                {opt.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Dual Grid: Kundli Matrix Visualizer + Score Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: North Indian Ashtakavarga Chart (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-4 bg-slate-950/80">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>☸</span>
              <span>{selectedGraha === "SAV" ? "Sarvashtakavarga Chart" : `${activeDetail?.sanskritName} BAV Chart`}</span>
            </h3>

            {/* Toggle Sign vs House Mapping */}
            <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px]">
              <button
                onClick={() => setViewModeTab("signs")}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  viewModeTab === "signs" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                By Sign (Rashi)
              </button>
              <button
                onClick={() => setViewModeTab("houses")}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  viewModeTab === "houses" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                By House (Bhava)
              </button>
            </div>
          </div>

          {/* SVG North Indian Kundli Chart with Ashtakavarga Bindus */}
          <div className="w-full aspect-square max-w-[420px] mx-auto relative bg-[#060a14] rounded-2xl p-2 border border-slate-800/80 shadow-inner flex items-center justify-center">
            <svg viewBox="0 0 300 300" className="w-full h-full stroke-amber-500/60 stroke-[1.5]">
              {/* Outer Boundary Box */}
              <rect x="0" y="0" width="300" height="300" fill="none" className="stroke-amber-500/80 stroke-[2]" />

              {/* Diagonal X Lines */}
              <line x1="0" y1="0" x2="300" y2="300" />
              <line x1="300" y1="0" x2="0" y2="300" />

              {/* Inner Diamond Lines */}
              <polygon points="150,0 300,150 150,300 0,150" fill="none" className="stroke-amber-500/70" />

              {/* House Polygons & Bindu Numbers */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
                const center = HOUSE_TEXT_CENTERS[houseNum];
                const rashiIdx = (lagnaRashi + houseNum - 1) % 12;
                const rashi = RASHIS[rashiIdx];

                const binduVal =
                  selectedGraha === "SAV"
                    ? avResult.sarvaRashiBindus[rashiIdx]
                    : activeDetail
                    ? activeDetail.rashiBindus[rashiIdx]
                    : 0;

                const isSAV = selectedGraha === "SAV";
                const isStrong = isSAV ? binduVal >= 28 : binduVal >= 4;

                return (
                  <g key={houseNum}>
                    {/* Rashi Number in House Corner */}
                    <text
                      x={center.x}
                      y={center.y - 12}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-500 text-[10px] font-mono font-bold select-none"
                    >
                      {rashi.symbol} {rashiIdx + 1}
                    </text>

                    {/* Bindu Score in House Center */}
                    <text
                      x={center.x}
                      y={center.y + 6}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-base font-extrabold font-mono select-none ${
                        isStrong ? "fill-amber-300 font-bold" : "fill-slate-300"
                      }`}
                    >
                      {binduVal}
                    </text>

                    {/* House Label */}
                    <text
                      x={center.x}
                      y={center.y + 20}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-500 text-[8px] font-mono select-none"
                    >
                      H{houseNum}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-center text-[10px] text-slate-500 font-mono">
            Ascendant Sign: <span className="text-amber-400 font-bold">{RASHIS[lagnaRashi].englishName} ({RASHIS[lagnaRashi].sanskritName})</span>
          </div>
        </div>

        {/* Right: 12-Rashi Score Breakdown & Contributor Matrix (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 12-Rashi Score Cards */}
          <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
                {selectedGraha === "SAV" ? "Sarvashtakavarga Points per Sign" : `${activeDetail?.sanskritName} Bhinnaashtakavarga Points`}
              </h3>
              <span className="text-xs text-amber-400 font-mono font-bold">
                Total: {selectedGraha === "SAV" ? avResult.totalSAV : activeDetail?.totalBindus} Bindus
              </span>
            </div>

            {/* 12 Rashi Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {RASHIS.map((r, i) => {
                const binduCount =
                  selectedGraha === "SAV"
                    ? avResult.sarvaRashiBindus[i]
                    : activeDetail
                    ? activeDetail.rashiBindus[i]
                    : 0;

                const houseNum = ((i - lagnaRashi + 12) % 12) + 1;
                const isSAV = selectedGraha === "SAV";
                const badgeStyle = getStrengthColor(binduCount, isSAV);

                return (
                  <div
                    key={r.index}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 flex flex-col justify-between transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">
                        {r.symbol} {r.sanskritName}
                      </span>
                      <span className="text-[9px] px-1 py-0.5 rounded bg-slate-950 text-slate-400 font-mono">
                        H{houseNum}
                      </span>
                    </div>

                    <div className="flex items-end justify-between mt-2">
                      <span className="text-[9px] text-slate-500 uppercase font-medium">
                        {r.englishName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-lg border font-mono font-extrabold text-xs ${badgeStyle}`}>
                        {binduCount} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🧭 DIRECTIONAL STRENGTH (DIK-SHUDDHI / DIG-BALA) IN ASHTAKAVARGA */}
          <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/85 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧭</span>
                  <h3 className="font-extrabold text-base md:text-lg text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    {activeDetail ? (
                      <span style={{ color: activeDetail.color }}>
                        {activeDetail.symbol} {activeDetail.sanskritName} ({activeDetail.planetName}) Directional Strength (दिशा बल)
                      </span>
                    ) : (
                      <span>Sarvashtakavarga (SAV) Directional Strength (दिशा बल)</span>
                    )}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculated by summing Trikona houses: <strong>East (1, 5, 9)</strong>, <strong>South (2, 6, 10)</strong>, <strong>West (3, 7, 11)</strong>, and <strong>North (4, 8, 12)</strong>
                </p>
              </div>

              {/* Best Direction Trophy Badge */}
              <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/50 shadow-lg text-right">
                <span className="text-[9px] uppercase font-bold text-amber-400 block tracking-wider">
                  {activeDetail ? `🏆 ${activeDetail.sanskritName}'s Best Direction` : "🏆 Overall Best Direction (सर्वश्रेष्ठ दिशा)"}
                </span>
                <span className="text-base font-extrabold text-amber-300 font-mono flex items-center justify-end gap-1.5">
                  <span>{activeDetail ? activeDetail.directional.bestDirection : avResult.directionalAnalysis.overall.bestDirection.direction}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold ml-1">
                    {activeDetail ? activeDetail.directional.bestBindus : avResult.directionalAnalysis.overall.bestDirection.bindus} Bindus
                  </span>
                </span>
              </div>
            </div>

            {/* 4 Cardinal Direction Cards (East, South, West, North) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(activeDetail
                ? [
                    {
                      dir: "East" as const,
                      name: "East",
                      sanskrit: "Purva (पूर्व)",
                      houses: [1, 5, 9] as [number, number, number],
                      trikona: "Dharma Trikona",
                      element: "Fire (Agni)",
                      bindus: activeDetail.directional.east,
                      total: activeDetail.totalBindus,
                      icon: "🌅",
                    },
                    {
                      dir: "South" as const,
                      name: "South",
                      sanskrit: "Dakshina (दक्षिण)",
                      houses: [2, 6, 10] as [number, number, number],
                      trikona: "Artha Trikona",
                      element: "Earth (Prithvi)",
                      bindus: activeDetail.directional.south,
                      total: activeDetail.totalBindus,
                      icon: "☀️",
                    },
                    {
                      dir: "West" as const,
                      name: "West",
                      sanskrit: "Pashchima (पश्चिम)",
                      houses: [3, 7, 11] as [number, number, number],
                      trikona: "Kama Trikona",
                      element: "Air (Vayu)",
                      bindus: activeDetail.directional.west,
                      total: activeDetail.totalBindus,
                      icon: "🌇",
                    },
                    {
                      dir: "North" as const,
                      name: "North",
                      sanskrit: "Uttara (उत्तर)",
                      houses: [4, 8, 12] as [number, number, number],
                      trikona: "Moksha Trikona",
                      element: "Water (Jala)",
                      bindus: activeDetail.directional.north,
                      total: activeDetail.totalBindus,
                      icon: "🌌",
                    },
                  ]
                : avResult.directionalAnalysis.overall.directions.map((d) => ({
                    dir: d.direction,
                    name: d.direction,
                    sanskrit: d.sanskritName,
                    houses: d.houses,
                    trikona: d.trikonaName,
                    element: d.element,
                    bindus: d.bindus,
                    total: 337,
                    icon: d.direction === "East" ? "🌅" : d.direction === "South" ? "☀️" : d.direction === "West" ? "🌇" : "🌌",
                  }))
              ).map((dirItem) => {
                const isWinner = activeDetail
                  ? dirItem.dir === activeDetail.directional.bestDirection
                  : dirItem.dir === avResult.directionalAnalysis.overall.bestDirection.direction;
                const percentage = Math.round((dirItem.bindus / dirItem.total) * 100);

                return (
                  <div
                    key={dirItem.name}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isWinner
                        ? "bg-gradient-to-b from-amber-950/40 to-slate-950/90 border-amber-500/70 shadow-2xl ring-1 ring-amber-500/30 scale-[1.02]"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg">{dirItem.icon}</span>
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-100">
                              {dirItem.name} • {dirItem.sanskrit.split(" ")[0]}
                            </h4>
                            <span className="text-[10px] text-amber-400 font-medium">{dirItem.trikona.split(" ")[0]}</span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                            isWinner
                              ? "bg-amber-500 text-slate-950"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {isWinner ? "🏆 Best" : "Direction"}
                        </span>
                      </div>

                      {/* Bindu Count & Houses */}
                      <div className="mt-3.5 flex items-baseline justify-between border-b border-slate-800/80 pb-2">
                        <div>
                          <span className="text-2xl font-extrabold text-slate-100 font-mono">{dirItem.bindus}</span>
                          <span className="text-xs text-slate-400 ml-1">/ {dirItem.total} Bindus</span>
                        </div>
                        <span className="text-xs font-bold font-mono text-amber-300">
                          {percentage}%
                        </span>
                      </div>

                      <div className="mt-2 text-[10.5px] text-slate-400 font-mono">
                        <span className="text-slate-500">Houses: </span>
                        <strong className="text-slate-300">{dirItem.houses.map((h) => `H${h}`).join(" + ")}</strong>
                        <span className="text-slate-500"> • {dirItem.element.split(" ")[0]}</span>
                      </div>
                    </div>

                    {/* Specific Planet Recommendation Banner */}
                    {activeDetail && isWinner && (
                      <div className="mt-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-200">
                        <span className="font-bold text-amber-400 block mb-0.5">🌟 Auspicious Focus for {activeDetail.sanskritName}:</span>
                        <span>{activeDetail.directional.purpose}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed 8-Contributor Benefic Matrix (For Selected Graha or Full SAV Table) */}
          <div className="glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">
                {selectedGraha === "SAV"
                  ? "7-Graha Sarvashtakavarga Master Matrix"
                  : `Contributor Matrix for ${activeDetail?.sanskritName} (${activeDetail?.totalBindus} Bindus)`}
              </h3>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              {selectedGraha === "SAV" ? (
                /* Master SAV Matrix: 7 Grahas x 12 Rashis */
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                      <th className="p-2 font-bold">Graha</th>
                      {RASHIS.map((r) => (
                        <th key={r.index} className="p-2 text-center">
                          {r.symbol} {r.sanskritName.slice(0, 3)}
                        </th>
                      ))}
                      <th className="p-2 text-right text-amber-400 font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {Object.values(avResult.bav).map((bav) => (
                      <tr key={bav.planetId} className="hover:bg-slate-900/50">
                        <td className="p-2 font-bold flex items-center gap-1.5" style={{ color: bav.color }}>
                          <span>{bav.symbol}</span>
                          <span>{bav.sanskritName}</span>
                        </td>
                        {bav.rashiBindus.map((pts, idx) => (
                          <td key={idx} className="p-2 text-center text-slate-200">
                            {pts}
                          </td>
                        ))}
                        <td className="p-2 text-right font-bold text-amber-300">
                          {bav.totalBindus}
                        </td>
                      </tr>
                    ))}
                    {/* Grand Total SAV Row */}
                    <tr className="border-t-2 border-amber-500/50 bg-amber-500/10 font-extrabold">
                      <td className="p-2 text-amber-400">SAV Total</td>
                      {avResult.sarvaRashiBindus.map((pts, idx) => (
                        <td
                          key={idx}
                          className={`p-2 text-center ${
                            pts >= 28 ? "text-emerald-400 font-bold" : "text-rose-400"
                          }`}
                        >
                          {pts}
                        </td>
                      ))}
                      <td className="p-2 text-right text-amber-400 text-sm font-extrabold">
                        337
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : activeDetail ? (
                /* Single Graha Contributor Breakdown: 8 Contributors x 12 Rashis */
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                      <th className="p-2 font-bold">Contributor</th>
                      {RASHIS.map((r) => (
                        <th key={r.index} className="p-2 text-center">
                          {r.symbol} {r.sanskritName.slice(0, 3)}
                        </th>
                      ))}
                      <th className="p-2 text-right text-amber-400 font-bold">Sum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {[
                      { key: "sun", label: "Sun (Surya)", color: "#FFB300" },
                      { key: "moon", label: "Moon (Chandra)", color: "#E0E0E0" },
                      { key: "mars", label: "Mars (Mangala)", color: "#E53935" },
                      { key: "mercury", label: "Mercury (Budha)", color: "#43A047" },
                      { key: "jupiter", label: "Jupiter (Guru)", color: "#FFD54F" },
                      { key: "venus", label: "Venus (Shukra)", color: "#F06292" },
                      { key: "saturn", label: "Saturn (Shani)", color: "#5C6BC0" },
                      { key: "lagna", label: "Lagna (Ascendant)", color: "#10B981" },
                    ].map((contrib) => {
                      const row = activeDetail.matrix[contrib.key] || [];
                      const rowSum = row.reduce((a, b) => a + b, 0);
                      return (
                        <tr key={contrib.key} className="hover:bg-slate-900/50">
                          <td className="p-2 font-bold" style={{ color: contrib.color }}>
                            {contrib.label}
                          </td>
                          {row.map((val, idx) => (
                            <td
                              key={idx}
                              className={`p-2 text-center ${
                                val === 1 ? "text-emerald-400 font-bold" : "text-slate-600"
                              }`}
                            >
                              {val === 1 ? "1" : "0"}
                            </td>
                          ))}
                          <td className="p-2 text-right text-amber-300 font-bold">
                            {rowSum}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Target Graha Total Row */}
                    <tr className="border-t-2 border-amber-500/50 bg-amber-500/10 font-extrabold">
                      <td className="p-2 text-amber-400">{activeDetail.sanskritName} Total</td>
                      {activeDetail.rashiBindus.map((pts, idx) => (
                        <td
                          key={idx}
                          className={`p-2 text-center ${
                            pts >= 4 ? "text-emerald-400 font-bold" : "text-rose-400"
                          }`}
                        >
                          {pts}
                        </td>
                      ))}
                      <td className="p-2 text-right text-amber-400 text-sm font-extrabold">
                        {activeDetail.totalBindus}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}