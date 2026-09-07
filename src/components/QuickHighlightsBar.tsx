"use client";

import React from "react";
import { useAstroStore, ViewMode } from "../store/useAstroStore";

interface SuperpowerChip {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  mode?: ViewMode;
  vargaId?: string;
  isChat?: boolean;
}

const SUPERPOWERS: SuperpowerChip[] = [
  {
    id: "d10-secret",
    icon: "⚡",
    title: "D-10 Career Secret",
    subtitle: "D-1 Lagna Lord in Karma Field",
    badge: "Parashari Secret",
    badgeColor: "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950",
    mode: "shodashavarga",
    vargaId: "D10",
  },
  {
    id: "3d-skydome",
    icon: "🪐",
    title: "3D SkyDome",
    subtitle: "Real-Time Celestial WebGL",
    badge: "Interactive",
    badgeColor: "bg-cyan-950 text-cyan-300 border border-cyan-500/40",
    mode: "3d",
  },
  {
    id: "vastu-studio",
    icon: "🏰",
    title: "Vāstu Studio 81",
    subtitle: "81-Grid Purusha Mandala & Deities",
    badge: "Shastra",
    badgeColor: "bg-emerald-950 text-emerald-300 border border-emerald-500/40",
    mode: "vastu",
  },
  {
    id: "kundli-milan",
    icon: "💍",
    title: "36 Guna Milan",
    subtitle: "Ashtakoota & Manglik Dosha",
    mode: "matchmaking",
  },
  {
    id: "vimshottari-dasha",
    icon: "⏳",
    title: "Vimshottari 120Y",
    subtitle: "Mahadasha & Antardasha Tree",
    mode: "dasha",
  },
  {
    id: "tajik-prashna",
    icon: "🔮",
    title: "Tajik Prashna",
    subtitle: "16 Tajika Yogas & Query Orbs",
    badge: "Horary",
    badgeColor: "bg-purple-950 text-purple-300 border border-purple-500/40",
    mode: "prashna",
  },
  {
    id: "rtn-cross-varga",
    icon: "🌸",
    title: "Rashi Tulya Navamsha",
    subtitle: "D1 ⮂ D9 Cross-Varga Overlay",
    badge: "Deva Keralam",
    badgeColor: "bg-pink-950 text-pink-300 border border-pink-500/40",
    mode: "shodashavarga",
    vargaId: "RTN",
  },
  {
    id: "adhana-epoch",
    icon: "👶",
    title: "Adhana Kundali",
    subtitle: "10-Month Foetal Gestation Timeline",
    mode: "adhana",
  },
  {
    id: "parashari-shadbala",
    icon: "🌟",
    title: "Shadbala 6-Fold",
    subtitle: "Planetary Strengths & Ishta Phala",
    mode: "shadbala",
  },
  {
    id: "astro-ai-chat",
    icon: "💬",
    title: "Ask Astro AI",
    subtitle: "65-Section Deep AI Consultation",
    badge: "AI Consultant",
    badgeColor: "bg-amber-500 text-slate-950 shadow-amber-500/30",
    isChat: true,
  },
];

export default function QuickHighlightsBar() {
  const { viewMode, setViewMode, activeVargaId, setActiveVargaId } = useAstroStore();

  const handleChipClick = (chip: SuperpowerChip) => {
    if (chip.isChat) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("open-astro-chat"));
      }
      return;
    }

    if (chip.mode) {
      setViewMode(chip.mode);
      if (chip.vargaId) {
        setActiveVargaId(chip.vargaId);
      }
    }
  };

  return (
    <div className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950/90 via-purple-950/20 to-slate-950/90 border border-slate-800/80 p-2.5 sm:p-3 shadow-xl backdrop-blur-md">
      {/* Header title strip */}
      <div className="flex items-center justify-between gap-2 px-1 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-sm animate-pulse">✨</span>
          <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase bg-gradient-to-r from-amber-300 via-purple-200 to-cyan-300 bg-clip-text text-transparent">
            Featured Superpowers & Classical Engines
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium hidden sm:inline-block">
          Click any flagship tool for instant 1-click launch
        </span>
      </div>

      {/* Horizontal scrolling chips */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar snap-scroll-x pb-0.5">
        {SUPERPOWERS.map((chip) => {
          const isSelected =
            (chip.mode &&
              viewMode === chip.mode &&
              (!chip.vargaId || activeVargaId === chip.vargaId)) ||
            false;

          const isD10 = chip.id === "d10-secret";

          return (
            <button
              key={chip.id}
              onClick={() => handleChipClick(chip)}
              className={`snap-item flex-shrink-0 group relative text-left rounded-xl px-3 py-2 transition-all cursor-pointer border flex flex-col justify-between min-w-[170px] sm:min-w-[190px] ${
                isSelected
                  ? "bg-gradient-to-br from-amber-500/20 via-purple-900/30 to-slate-900/80 border-amber-400/80 shadow-md shadow-amber-500/10 scale-[1.02]"
                  : isD10
                  ? "bg-gradient-to-br from-purple-950/60 via-slate-900/90 to-amber-950/40 border-amber-500/60 hover:border-amber-400 shadow-sm"
                  : "bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between w-full gap-1.5 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm group-hover:scale-125 transition-transform">
                    {chip.icon}
                  </span>
                  <span
                    className={`text-xs font-black tracking-tight ${
                      isSelected ? "text-amber-300" : "text-slate-200 group-hover:text-amber-200"
                    }`}
                  >
                    {chip.title}
                  </span>
                </div>
                {chip.badge && (
                  <span
                    className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-tight ${
                      chip.badgeColor || "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {chip.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 truncate w-full group-hover:text-slate-300 font-medium">
                {chip.subtitle}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
