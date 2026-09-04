"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "@/store/useAstroStore";
import {
  VastuRoomType,
  VastuRoomPlacement,
  VastuDirection,
} from "@/engine/types";
import {
  VASTU_81_GRID_MAP,
  getVastuPada,
  getDirectionFromCoords,
  evaluateRoomPlacement,
  calculateAyadiShadvarga,
  calculateAshtakavargaVastuStrength,
  calculateVastuSynthesis,
  ROOM_COMPATIBILITY_RULES,
} from "@/engine/vastuEngine";

const ROOM_OPTIONS: { type: VastuRoomType; label: string; icon: string; defaultDir: string }[] = [
  { type: "pooja_room", label: "Pooja Mandir (पूजा घर)", icon: "🛕", defaultDir: "North-East" },
  { type: "kitchen", label: "Kitchen / Cooktop (रसोईघर)", icon: "🍳", defaultDir: "South-East" },
  { type: "master_bedroom", label: "Master Bedroom (मुख्य शयनकक्ष)", icon: "👑", defaultDir: "South-West" },
  { type: "living_room", label: "Living / Drawing Room (बैठक)", icon: "🛋️", defaultDir: "North / East" },
  { type: "dining_room", label: "Dining Room (भोजन कक्ष)", icon: "🍽️", defaultDir: "West" },
  { type: "study_room", label: "Study Room / Office (अध्ययन)", icon: "📚", defaultDir: "North-East / North" },
  { type: "kids_bedroom", label: "Children's Bedroom (बाल कक्ष)", icon: "🧸", defaultDir: "North-West / West" },
  { type: "guest_room", label: "Guest Room (अतिथि कक्ष)", icon: "🧳", defaultDir: "North-West" },
  { type: "main_door", label: "Main Entrance Door (सिंह द्वार)", icon: "🚪", defaultDir: "East / North" },
  { type: "toilet", label: "Toilet / Commode (शौचालय)", icon: "🚽", defaultDir: "West / South" },
  { type: "water_tank_underground", label: "Underground Water / Borewell (भूमिगत जल)", icon: "💧", defaultDir: "North-East" },
  { type: "water_tank_overhead", label: "Overhead Water Tank (ऊपरी टंकी)", icon: "🚰", defaultDir: "South-West" },
  { type: "septic_tank", label: "Septic Tank (मलकुंड)", icon: "🕳️", defaultDir: "North-West" },
  { type: "staircase", label: "Staircase (सीढ़ियां)", icon: "🪜", defaultDir: "South / West" },
  { type: "open_balcony", label: "Open Balcony (बालकनी)", icon: "🌿", defaultDir: "North / East" },
];

export default function VastuStudio() {
  const { ephemeris: natalEphem, location } = useAstroStore();

  const [activeTab, setActiveTab] = useState<"mandala" | "ayadi" | "ashtakavarga" | "remedies">("mandala");
  const [selectedRoomType, setSelectedRoomType] = useState<VastuRoomType>("pooja_room");
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>({ row: 0, col: 8 });

  // Default Sample House Placements
  const [placements, setPlacements] = useState<VastuRoomPlacement[]>([
    { roomType: "pooja_room", customLabel: "Pooja Mandir", row: 0, col: 8, direction: "Northeast (Ishanya)", padaName: "Shikhi", complianceScore: 100, grade: "Ideal (सर्वोत्तम)", feedback: "✨ Supreme placement!" },
    { roomType: "kitchen", customLabel: "Kitchen", row: 8, col: 8, direction: "Southeast (Agneya)", padaName: "Agni", complianceScore: 100, grade: "Ideal (सर्वोत्तम)", feedback: "✨ Excellent Agni-sthana!" },
    { roomType: "master_bedroom", customLabel: "Master Bed", row: 8, col: 0, direction: "Southwest (Nairritya)", padaName: "Pitru", complianceScore: 100, grade: "Ideal (सर्वोत्तम)", feedback: "✨ Supreme Earth Stability!" },
    { roomType: "living_room", customLabel: "Living Room", row: 4, col: 8, direction: "East (Purva)", padaName: "Surya", complianceScore: 100, grade: "Ideal (सर्वोत्तम)", feedback: "✨ Vibrant welcoming prana!" },
    { roomType: "main_door", customLabel: "Main Door (Jayanta E3)", row: 2, col: 8, direction: "East (Purva)", padaName: "Jayanta", complianceScore: 100, grade: "Ideal (सर्वोत्तम)", feedback: "✨ Auspicious Door Pada: Victory & Royal Stature!" },
    { roomType: "toilet", customLabel: "Toilet", row: 4, col: 0, direction: "West (Paschima)", padaName: "Varuna", complianceScore: 100, grade: "Ideal (सर्वोत्तम)", feedback: "✨ Proper waste elimination zone." },
  ]);

  // Ayadi Calculator State
  const [plotLength, setPlotLength] = useState<number>(40);
  const [plotBreadth, setPlotBreadth] = useState<number>(30);

  const nativeMoonNak = natalEphem?.planets?.Moon?.nakshatra?.sanskritName || "Ashwini";
  const ascSign = natalEphem?.ascendant?.rashi?.englishName || "Aries";
  const savList = (natalEphem as any)?.sarvashtakavarga || [28, 30, 32, 29, 31, 33, 27, 34, 30, 29, 32, 28];

  // Master Vastu Synthesis
  const vastuReport = useMemo(() => {
    return calculateVastuSynthesis(placements, plotLength, plotBreadth, nativeMoonNak, savList, natalEphem);
  }, [placements, plotLength, plotBreadth, nativeMoonNak, savList, natalEphem]);

  // Handle cell click on 81-grid
  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
    const existingIndex = placements.findIndex((p) => p.row === row && p.col === col);
    if (existingIndex !== -1) {
      return;
    }

    const roomMeta = ROOM_OPTIONS.find((r) => r.type === selectedRoomType);
    const newPlacement = evaluateRoomPlacement(selectedRoomType, row, col, roomMeta?.label.split(" (")[0]);
    setPlacements((prev) => [...prev, newPlacement]);
  };

  const removePlacement = (index: number) => {
    setPlacements((prev) => prev.filter((_, i) => i !== index));
  };

  const activeCellPada = selectedCell ? getVastuPada(selectedCell.row, selectedCell.col) : null;
  const activeCellPlacement = selectedCell ? placements.find((p) => p.row === selectedCell.row && p.col === selectedCell.col) : null;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                King Bhoja's Samarāṅgaṇa-Sūtradhāra & Dr. D.N. Shukla
              </span>
              <span className="text-xs text-slate-400 font-mono">81-Pada Paramashāyika Maṇḍala</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
              🏛️ Classical & Astrological Vāstu Studio
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Synthesizes classical architectural geometry with your personalized birth chart — featuring the <strong>81-Grid Vastu Purusha Mandala (45 Deities)</strong>, <strong>32 Door Entrance Gates</strong>, <strong>Āyādi-Ṣaḍvarga Dimension Resonance</strong>, and <strong>Ashtakavarga Directional Power (SAV Dik-Bala)</strong>.
            </p>
          </div>

          {/* Quick Score Capsule */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-2xl border border-amber-500/40 shadow-inner">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Vastu Score</span>
              <span className="text-2xl font-black text-amber-400 font-mono">{vastuReport.overallScore}%</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Grade</span>
              <span className="text-xs font-black text-emerald-400">{vastuReport.grade}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-5 border-t border-slate-800/80 overflow-x-auto custom-scrollbar">
          {[
            { id: "mandala", label: "81-Pada Mandala Studio", icon: "🏛️" },
            { id: "ayadi", label: "Āyādi Dimension Tester", icon: "📐" },
            { id: "ashtakavarga", label: "Ashtakavarga Directional Radar", icon: "🧭" },
            { id: "remedies", label: "Color & Metal Remedies", icon: "🎨" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20"
                  : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. TAB CONTENT: MANDALA STUDIO */}
      {activeTab === "mandala" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 81-Grid Canvas */}
          <div className="lg:col-span-8 glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/90 space-y-4 shadow-xl">
            {/* Canvas Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-black text-slate-200 tracking-wide uppercase">
                  81-Pada Purusha Mandala (45 Deities)
                </span>
              </div>
              <span className="text-[10.5px] font-mono text-amber-400/90 hidden sm:inline">
                Directional Energy Alignment
              </span>
            </div>

            {/* Grid Container with 4-Side Directional Borders */}
            <div className="w-full max-w-[660px] mx-auto flex flex-col items-center gap-1">
              {/* TOP: NORTH (UTTARA) & CORNER LABELS */}
              <div className="w-full flex items-center justify-between px-1 text-[10px] sm:text-[11px] font-mono select-none">
                <div className="flex items-center gap-1 text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800">
                  <span className="text-slate-500 font-bold">NW</span>
                  <span className="text-indigo-300 font-bold hidden sm:inline">Vāyavya (Air)</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-300 font-black bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-500/50 shadow-sm text-xs sm:text-sm">
                  <span>▲</span>
                  <span>NORTH (Uttara / उत्तर) • Water 💧</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800">
                  <span className="text-cyan-300 font-bold hidden sm:inline">Īśānya (Water)</span>
                  <span className="text-slate-500 font-bold">NE</span>
                </div>
              </div>

              {/* MIDDLE ROW: WEST + 9x9 GRID CANVAS + EAST */}
              <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2">
                {/* WEST SIDEBAR */}
                <div className="flex items-center justify-center py-4 px-1.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-indigo-300 font-bold text-[9px] sm:text-xs [writing-mode:vertical-lr] rotate-180 select-none shadow-md flex-shrink-0">
                  <span className="tracking-widest font-black uppercase flex items-center gap-1">
                    <span>◄</span>
                    <span>WEST (Paschima / पश्चिम) • Air 💨</span>
                  </span>
                </div>

                {/* The 9x9 Grid */}
                <div className="flex-1 aspect-square max-w-[560px] grid grid-cols-9 gap-1 bg-slate-900/90 p-1.5 sm:p-2 rounded-2xl border-2 border-amber-500/40 relative shadow-2xl">
                  {Array.from({ length: 9 }).map((_, r) =>
                    Array.from({ length: 9 }).map((_, c) => {
                      const pada = getVastuPada(r, c);
                      const isSelected = selectedCell?.row === r && selectedCell?.col === c;
                      const placement = placements.find((p) => p.row === r && p.col === c);
                      const isBrahma = pada.category === "Brahma";
                      const isOuter = pada.category === "OuterPerimeter";

                      let bgClass = "bg-slate-950 hover:bg-slate-850 border-slate-800";
                      if (isBrahma) bgClass = "bg-amber-500/15 border-amber-500/40 hover:bg-amber-500/25";
                      if (pada.isAuspiciousDoorPada) bgClass = "bg-emerald-950/60 border-emerald-500/50 hover:bg-emerald-900/70";
                      if (isSelected) bgClass = "ring-2 ring-amber-400 bg-amber-500/30 border-amber-300";

                      const roomMeta = placement ? ROOM_OPTIONS.find((ro) => ro.type === placement.roomType) : null;

                      return (
                        <button
                          key={`${r}_${c}`}
                          type="button"
                          onClick={() => handleCellClick(r, c)}
                          className={`relative flex flex-col items-center justify-center p-0.5 rounded-lg border text-[9px] transition-all cursor-pointer overflow-hidden ${bgClass}`}
                          title={`${pada.deitySanskrit} (${pada.deityEnglish}) • ${pada.direction}`}
                        >
                          {/* Auspicious Door Badge */}
                          {pada.isAuspiciousDoorPada && (
                            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm" />
                          )}

                          {/* Placed Room Icon */}
                          {placement ? (
                            <div className="flex flex-col items-center justify-center animate-in zoom-in-75 duration-150">
                              <span className="text-base sm:text-lg leading-none">{roomMeta?.icon || "🏠"}</span>
                              <span className="text-[7.5px] sm:text-[8.5px] font-black text-amber-200 truncate max-w-[45px] leading-tight">
                                {placement.customLabel}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center opacity-80 group-hover:opacity-100">
                              <span className={`text-[8px] sm:text-[9px] font-bold truncate max-w-[48px] ${isBrahma ? "text-amber-300 font-black" : "text-slate-300"}`}>
                                {pada.deitySanskrit.split(" ")[0]}
                              </span>
                              <span className="text-[6.5px] sm:text-[7.5px] text-slate-500 truncate max-w-[45px]">
                                {isOuter ? pada.id.split("_")[0] : ""}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* EAST SIDEBAR */}
                <div className="flex items-center justify-center py-4 px-1.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 font-bold text-[9px] sm:text-xs [writing-mode:vertical-lr] select-none shadow-md flex-shrink-0">
                  <span className="tracking-widest font-black uppercase flex items-center gap-1">
                    <span>EAST (Purva / पूर्व) • Light 🔥</span>
                    <span>►</span>
                  </span>
                </div>
              </div>

              {/* BOTTOM: SOUTH (DAKSHINA) & CORNER LABELS */}
              <div className="w-full flex items-center justify-between px-1 text-[10px] sm:text-[11px] font-mono select-none">
                <div className="flex items-center gap-1 text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800">
                  <span className="text-slate-500 font-bold">SW</span>
                  <span className="text-rose-300 font-bold hidden sm:inline">Nairṛtya (Earth)</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-400 font-black bg-rose-950/60 px-3 py-1 rounded-lg border border-rose-500/50 shadow-sm text-xs sm:text-sm">
                  <span>▼</span>
                  <span>SOUTH (Dakshina / दक्षिण) • Earth ⛰️</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800">
                  <span className="text-amber-300 font-bold hidden sm:inline">Āgneya (Fire)</span>
                  <span className="text-slate-500 font-bold">SE</span>
                </div>
              </div>
            </div>

            {/* Grid Footnote / Legend */}
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500/30 border border-amber-500/60" />
                  <span>Brahmasthāna Core</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-500/60" />
                  <span>Auspicious Door Gate</span>
                </span>
              </div>
              <span className="text-slate-500 italic">Tap any cell to place or inspect room</span>
            </div>
          </div>

          {/* Right Column: Room Selector & Active Cell Inspector */}
          <div className="lg:col-span-4 space-y-4">
            {/* Active Cell Inspector */}
            {activeCellPada && (
              <div className="glass-panel p-4 rounded-2xl border border-amber-500/40 bg-slate-900/90 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400">Selected Grid Pada</span>
                    <h3 className="text-sm font-black text-slate-100">
                      {activeCellPada.deitySanskrit} ({activeCellPada.deityEnglish})
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-slate-950 text-slate-300 border border-slate-800 font-mono">
                    Row {activeCellPada.row}, Col {activeCellPada.col}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Direction:</span>
                    <span className="font-bold text-amber-300">{activeCellPada.direction}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Element (Tattva):</span>
                    <span className="font-bold text-cyan-300">{activeCellPada.element}</span>
                  </div>
                </div>

                {activeCellPlacement ? (
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-200">
                        {activeCellPlacement.customLabel}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        activeCellPlacement.grade.includes("Ideal")
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : activeCellPlacement.grade.includes("Acceptable")
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      }`}>
                        {activeCellPlacement.grade} ({activeCellPlacement.complianceScore}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {activeCellPlacement.feedback}
                    </p>
                    {activeCellPlacement.pariharaRemedy && (
                      <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[10.5px] text-amber-200">
                        <strong>🌿 Parihara:</strong> {activeCellPlacement.pariharaRemedy}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const idx = placements.findIndex((p) => p.row === activeCellPada.row && p.col === activeCellPada.col);
                        if (idx !== -1) removePlacement(idx);
                      }}
                      className="w-full py-1 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-[10.5px] font-bold transition-all cursor-pointer"
                    >
                      🗑️ Remove Room from this Pada
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                    <p className="text-[11px] text-slate-400">
                      Empty pada. Select a room below and tap here to assign it.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCellClick(activeCellPada.row, activeCellPada.col)}
                      className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer"
                    >
                      + Place {ROOM_OPTIONS.find((r) => r.type === selectedRoomType)?.label.split(" (")[0]}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Room Palette Selector */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/90 space-y-2.5">
              <span className="text-xs font-black uppercase text-amber-400 block tracking-wide">
                1. Select Room Type to Place:
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                {ROOM_OPTIONS.map((ro) => (
                  <button
                    key={ro.type}
                    type="button"
                    onClick={() => setSelectedRoomType(ro.type)}
                    className={`p-2 text-left rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedRoomType === ro.type
                        ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                        : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span>{ro.icon}</span>
                    <span className="truncate">{ro.label.split(" (")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5 Elemental Balance Gauges */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/90 space-y-2">
              <span className="text-xs font-black uppercase text-amber-400 block tracking-wide">
                2. Elemental Balance (पञ्चमहाभूत संतुलन):
              </span>
              <div className="space-y-1.5 text-[11px]">
                {[
                  { label: "💧 Water (Jala - NE / North)", score: vastuReport.elementalBalance.waterScore, color: "bg-cyan-500" },
                  { label: "🔥 Fire (Agni - SE / East)", score: vastuReport.elementalBalance.fireScore, color: "bg-rose-500" },
                  { label: "⛰️ Earth (Prithvi - SW / South)", score: vastuReport.elementalBalance.earthScore, color: "bg-amber-500" },
                  { label: "💨 Air (Vayu - NW / West)", score: vastuReport.elementalBalance.airScore, color: "bg-indigo-500" },
                  { label: "🌌 Space (Akasha - Center)", score: vastuReport.elementalBalance.spaceScore, color: "bg-purple-500" },
                ].map((elem) => (
                  <div key={elem.label} className="space-y-0.5">
                    <div className="flex justify-between text-slate-300">
                      <span>{elem.label}</span>
                      <span className="font-mono font-bold">{elem.score}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full ${elem.color}`} style={{ width: `${elem.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: AYADI DIMENSION TESTER */}
      {activeTab === "ayadi" && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/90 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10.5px] font-bold text-amber-400 uppercase tracking-wider block">
                Samarāṅgaṇa-Sūtradhāra Mathematical Formulas
              </span>
              <h2 className="text-xl font-black text-slate-100">
                📐 Āyādi-Ṣaḍvarga Building Dimension Calculator
              </h2>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400">Native Janma Nakshatra: </span>
              <strong className="text-amber-300">{nativeMoonNak}</strong>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-200">Building Length (Feet):</label>
                <span className="font-mono text-sm font-black text-amber-400">{plotLength} ft ({vastuReport.ayadiAnalysis.lengthHasta} Hastas)</span>
              </div>
              <input
                type="range"
                min={10}
                max={150}
                value={plotLength}
                onChange={(e) => setPlotLength(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-200">Building Breadth / Width (Feet):</label>
                <span className="font-mono text-sm font-black text-amber-400">{plotBreadth} ft ({vastuReport.ayadiAnalysis.breadthHasta} Hastas)</span>
              </div>
              <input
                type="range"
                min={10}
                max={150}
                value={plotBreadth}
                onChange={(e) => setPlotBreadth(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          {/* 6 Sacred Formula Results */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* 1. Aya vs Vyaya */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">1. Āya vs. Vyaya (Income vs Expense)</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-emerald-400">Āya: {vastuReport.ayadiAnalysis.ayaNumber} ({vastuReport.ayadiAnalysis.ayaGrade})</span>
                <span className="text-sm font-black text-rose-400">Vyaya: {vastuReport.ayadiAnalysis.vyayaNumber}</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {vastuReport.ayadiAnalysis.isAyaGreaterThanVyaya ? "✅ Āya exceeds Vyaya (Income > Expenses) — Wealth multiplies continuously." : "⚠️ Vyaya exceeds Āya — Adjust length/width by +1 foot."}
              </p>
            </div>

            {/* 2. Yoni */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">2. Yoni (Directional Energy)</span>
              <span className="text-sm font-black text-amber-300 block">{vastuReport.ayadiAnalysis.yoniName}</span>
              <p className="text-[11px] text-slate-300">
                Grade: <strong>{vastuReport.ayadiAnalysis.yoniGrade}</strong>. Facing <strong>{vastuReport.ayadiAnalysis.yoniDirection}</strong> direction.
              </p>
            </div>

            {/* 3. Vastu Nakshatra & Tara */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">3. Vastu Nakshatra & Janma Tara</span>
              <span className="text-sm font-black text-cyan-300 block">
                {vastuReport.ayadiAnalysis.vastuNakshatraName} (#{vastuReport.ayadiAnalysis.vastuNakshatraNumber})
              </span>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10.5px] text-slate-200">
                <strong>Tara:</strong> {vastuReport.ayadiAnalysis.janmaTaraCompatibility.taraType}
                <p className="text-slate-400 mt-0.5">{vastuReport.ayadiAnalysis.janmaTaraCompatibility.verdict}</p>
              </div>
            </div>

            {/* 4. Longevity (Ayus) */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">4. Building Longevity (Āyus)</span>
              <span className="text-sm font-black text-purple-300 block">{vastuReport.ayadiAnalysis.ayusLongevityYears} Years</span>
              <p className="text-[11px] text-slate-300">
                Indicates enduring structural lifespan and multigenerational stability.
              </p>
            </div>

            {/* 5. Vara (Day Lord) */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">5. Vāra (Planetary Day Vibration)</span>
              <span className="text-sm font-black text-amber-300 block">{vastuReport.ayadiAnalysis.varaName}</span>
              <p className="text-[11px] text-slate-300">
                Harmonizes planetary daytime current with building residents.
              </p>
            </div>

            {/* 6. Tithi */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">6. Tithi (Lunar Energy Channel)</span>
              <span className="text-sm font-black text-cyan-300 block">{vastuReport.ayadiAnalysis.tithiName}</span>
              <p className="text-[11px] text-slate-300">
                Channels smooth lunar prana and emotional peace for the family.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: ASHTAKAVARGA DIRECTIONAL RADAR */}
      {activeTab === "ashtakavarga" && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/90 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10.5px] font-bold text-amber-400 uppercase tracking-wider block">
              C.S. Patel & Parashara Ashtakavarga Vastu Standard
            </span>
            <h2 className="text-xl font-black text-slate-100">
              🧭 Sarvashtakavarga Directional Power Matrix (SAV Dik-Bala)
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Your personalized birth chart determines your highest wealth and fortune directions by aggregating 12 Rashi SAV bindus into the 4 Cardinal directions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* East */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-300">EAST (Pūrva)</span>
                <span className="text-lg font-black font-mono text-amber-400">{vastuReport.ashtakavargaDirectionalPower.eastSAV} pts</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Aries + Leo + Sagittarius (Agni/Dharma)</span>
              <p className="text-[11px] text-slate-300">
                Governs government favors, vitality, social honor, and public reputation.
              </p>
            </div>

            {/* South */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-rose-300">SOUTH (Dakṣiṇa)</span>
                <span className="text-lg font-black font-mono text-rose-400">{vastuReport.ashtakavargaDirectionalPower.southSAV} pts</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Taurus + Virgo + Capricorn (Prithvi/Artha)</span>
              <p className="text-[11px] text-slate-300">
                Governs tangible real estate, material accumulation, and executive strength.
              </p>
            </div>

            {/* West */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-indigo-300">WEST (Paścima)</span>
                <span className="text-lg font-black font-mono text-indigo-400">{vastuReport.ashtakavargaDirectionalPower.westSAV} pts</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Gemini + Libra + Aquarius (Vayu/Kama)</span>
              <p className="text-[11px] text-slate-300">
                Governs commercial profits, client partnerships, and wish-fulfillment.
              </p>
            </div>

            {/* North */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-cyan-300">NORTH (Uttara)</span>
                <span className="text-lg font-black font-mono text-cyan-400">{vastuReport.ashtakavargaDirectionalPower.northSAV} pts</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Cancer + Scorpio + Pisces (Jala/Moksha)</span>
              <p className="text-[11px] text-slate-300">
                Governs liquid cash inflow, academic intellect, and Kubera treasury treasures.
              </p>
            </div>
          </div>

          {/* Peak Direction Highlight Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div>
              <span className="text-[10.5px] uppercase font-bold text-amber-300 block">👑 Your Personal Dhana-Disha (Supreme Wealth Portal)</span>
              <h3 className="text-base font-black text-slate-100">{vastuReport.ashtakavargaDirectionalPower.peakDirection}</h3>
              <p className="text-xs text-slate-300 mt-0.5">{vastuReport.ashtakavargaDirectionalPower.peakDirectionTheme}</p>
            </div>
          </div>

          {/* Jaimini Arudha & Upapada Lagna Directional Portals */}
          {vastuReport.jaiminiVastu && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10.5px] font-bold text-amber-400 uppercase tracking-wider block">
                    Maharshi Jaimini Upadesha Sutras (BPHS Ch. 30–33)
                  </span>
                  <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                    <span>🕉️ Jaimini Arudha (AL) & Upapada (UL) Directional Portals</span>
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 1. Arudha Lagna (AL) */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/30 to-slate-900/90 border border-amber-500/40 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs">
                        AL
                      </span>
                      <span className="font-bold text-amber-200">{vastuReport.jaiminiVastu.arudhaLagna.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px] border border-amber-500/30">
                      {vastuReport.jaiminiVastu.arudhaLagna.direction}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Rashi & House:</span>
                      <strong className="text-amber-300">{vastuReport.jaiminiVastu.arudhaLagna.signName} (House #{vastuReport.jaiminiVastu.arudhaLagna.houseNumberInD1})</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Ruling Lord:</span>
                      <strong className="text-slate-200">{vastuReport.jaiminiVastu.arudhaLagna.signLord}</strong>
                    </div>
                  </div>

                  <p className="text-[11.5px] text-slate-200 leading-relaxed">
                    {vastuReport.jaiminiVastu.arudhaLagna.spatialRecommendation}
                  </p>

                  {vastuReport.jaiminiVastu.arudhaLagna.gainZone11th && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300">
                      <strong>💰 11th from AL (Gain Portal):</strong> {vastuReport.jaiminiVastu.arudhaLagna.gainZone11th.description}
                    </div>
                  )}

                  {vastuReport.jaiminiVastu.arudhaLagna.lossZone12th && (
                    <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-[11px] text-rose-300">
                      <strong>⚠️ 12th from AL (Loss/Leakage Zone):</strong> {vastuReport.jaiminiVastu.arudhaLagna.lossZone12th.description}
                    </div>
                  )}
                </div>

                {/* 2. Upapada Lagna (UL) */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-950/30 to-slate-900/90 border border-rose-500/40 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-rose-500 text-white font-black text-xs">
                        UL
                      </span>
                      <span className="font-bold text-rose-200">{vastuReport.jaiminiVastu.upapadaLagna.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-mono font-bold text-[11px] border border-rose-500/30">
                      {vastuReport.jaiminiVastu.upapadaLagna.direction}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Rashi & House:</span>
                      <strong className="text-rose-300">{vastuReport.jaiminiVastu.upapadaLagna.signName} (House #{vastuReport.jaiminiVastu.upapadaLagna.houseNumberInD1})</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Ruling Lord:</span>
                      <strong className="text-slate-200">{vastuReport.jaiminiVastu.upapadaLagna.signLord}</strong>
                    </div>
                  </div>

                  <p className="text-[11.5px] text-slate-200 leading-relaxed">
                    {vastuReport.jaiminiVastu.upapadaLagna.spatialRecommendation}
                  </p>

                  {vastuReport.jaiminiVastu.upapadaLagna.gainZone11th && (
                    <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-300">
                      <strong>💍 2nd from UL (Marital Sustenance):</strong> {vastuReport.jaiminiVastu.upapadaLagna.gainZone11th.description}
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10.5px] text-slate-400">
                    🛡️ <strong>Sanctity Rule:</strong> Strictly preserve this zone from clutter, dirt, or sharp edges to protect long-term domestic peace.
                  </div>
                </div>

                {/* 3. Rajya Pada (A10) */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">💼 A10 - Rajya Pada (Career Command)</span>
                    <span className="font-mono text-xs font-bold text-amber-400">{vastuReport.jaiminiVastu.rajyaPada.direction}</span>
                  </div>
                  <span className="text-[10.5px] text-slate-400 block">Sign: {vastuReport.jaiminiVastu.rajyaPada.signName} (Lord: {vastuReport.jaiminiVastu.rajyaPada.signLord})</span>
                  <p className="text-[11px] text-slate-300">{vastuReport.jaiminiVastu.rajyaPada.spatialRecommendation}</p>
                </div>

                {/* 4. Dara Pada (A7) */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-300">🤝 A7 - Dara Pada (Partnerships & Alliances)</span>
                    <span className="font-mono text-xs font-bold text-indigo-400">{vastuReport.jaiminiVastu.daraPada.direction}</span>
                  </div>
                  <span className="text-[10.5px] text-slate-400 block">Sign: {vastuReport.jaiminiVastu.daraPada.signName} (Lord: {vastuReport.jaiminiVastu.daraPada.signLord})</span>
                  <p className="text-[11px] text-slate-300">{vastuReport.jaiminiVastu.daraPada.spatialRecommendation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB CONTENT: REMEDIES */}
      {activeTab === "remedies" && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/90 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10.5px] font-bold text-amber-400 uppercase tracking-wider block">
              Dr. D.N. Shukla Vol. II (Citra-Lakṣaṇa & Dhātu-Vidyā)
            </span>
            <h2 className="text-xl font-black text-slate-100">
              🎨 Non-Destructive Vāstu Remedies (बिना तोड़-फोड़ के वास्तु सुधार)
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Heal energy flaws using classical metal wire conduits, directional elemental color therapy, and consecrated sacred Yantras.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {vastuReport.topNonDestructiveRemedies.map((rem, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <p className="text-xs text-slate-200 font-bold leading-relaxed">{rem}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
