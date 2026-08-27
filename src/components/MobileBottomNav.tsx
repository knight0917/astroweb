"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAstroStore, ViewMode } from "../store/useAstroStore";

export default function MobileBottomNav() {
  const { viewMode, setViewMode } = useAstroStore();
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const PRIMARY_TABS: { mode: ViewMode; label: string; icon: string }[] = [
    { mode: "kundli-north", label: "Kundli", icon: "☸" },
    { mode: "shodashavarga", label: "16 Vargas", icon: "✨" },
    { mode: "shadbala", label: "Shadbala", icon: "⚖️" },
    { mode: "bhavabala", label: "Bhavas", icon: "🏛️" },
  ];

  const MORE_MODULES: { mode: ViewMode; label: string; icon: string; desc: string }[] = [
    { mode: "prashna", label: "Tajik Prashna", icon: "🔮", desc: "16 Tajika Yogas & Horary Yes/No" },
    { mode: "muhurta", label: "Muhurta Finder", icon: "⏳", desc: "Abhijit, Brahma & Event Muhurtas" },
    { mode: "matchmaking", label: "Kundli Milan", icon: "💑", desc: "Ashtakoota 36 Gunas & Manglik Check" },
    { mode: "jaimini", label: "Jaimini Suite", icon: "🏛️", desc: "Arudha Padas, Karakamsha & Chara Dasha" },
    { mode: "3d", label: "3D Celestial Dome", icon: "🪐", desc: "Interactive WebGL Sky & Star Dome" },
    { mode: "ashtakavarga", label: "Ashtakavarga Suite", icon: "📊", desc: "Sarva & Bhinna 8-Grid Charts" },
    { mode: "numerology", label: "Vedic Numerology", icon: "🔢", desc: "Mulank, Bhagyank & Lo Shu Grid" },
    { mode: "tithi-calendar", label: "Tithi Calendar", icon: "📅", desc: "Daily Tithi, Moon Phases & Festivals" },
    { mode: "tithi-birthday", label: "Tithi Birthday", icon: "🎂", desc: "Tithi Pravesha & Janmadin Vidhi" },
    { mode: "table", label: "Full Ephemeris Table", icon: "📋", desc: "Sidereal Degrees & Nakshatras" },
    { mode: "dual", label: "Dual 3D + Chart", icon: "🔲", desc: "Split-Screen Dome and Kundli" },
  ];

  const isMoreActive = MORE_MODULES.some((m) => m.mode === viewMode);

  return (
    <>
      {/* Mobile More Modules Sheet Drawer Modal via Portal */}
      {mounted && showMoreDrawer && createPortal(
        <div className="fixed inset-0 z-[99999] md:hidden flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setShowMoreDrawer(false)}
          ></div>

          <div className="relative z-10 glass-panel bg-slate-950/98 border-t border-slate-800 rounded-t-3xl p-5 safe-bottom max-h-[80vh] overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-250">
            {/* Header Handle */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-1.5 bg-slate-700 rounded-full mb-3"></div>
              <div className="flex items-center justify-between w-full">
                <h3 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
                  <span>🌌</span>
                  <span>Explore More Jyotish Modules</span>
                </h3>
                <button
                  onClick={() => setShowMoreDrawer(false)}
                  className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Grid of Modules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MORE_MODULES.map((m) => {
                const isActive = viewMode === m.mode;
                return (
                  <button
                    key={m.mode}
                    onClick={() => {
                      setViewMode(m.mode);
                      setShowMoreDrawer(false);
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isActive
                        ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/20"
                        : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/80"
                    }`}
                  >
                    <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800">
                      {m.icon}
                    </span>
                    <div className="flex-1">
                      <span className="font-bold text-xs block text-slate-100">{m.label}</span>
                      <span className="text-[10px] text-slate-400 block">{m.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Persistent Bottom Nav Dock (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel bg-slate-950/95 border-t border-slate-800 safe-bottom px-2 py-1 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-around">
          {PRIMARY_TABS.map((tab) => {
            const isActive = viewMode === tab.mode;
            return (
              <button
                key={tab.mode}
                onClick={() => setViewMode(tab.mode)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 relative cursor-pointer ${
                  isActive ? "text-amber-400 scale-105 font-black" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1 w-6 h-0.5 bg-amber-400 rounded-full shadow-sm shadow-amber-500/80"></span>
                )}
                <span className="text-lg leading-none mb-0.5">{tab.icon}</span>
                <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
              </button>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setShowMoreDrawer(true)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 relative cursor-pointer ${
              isMoreActive ? "text-amber-400 scale-105 font-black" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {isMoreActive && (
              <span className="absolute -top-1 w-6 h-0.5 bg-amber-400 rounded-full shadow-sm shadow-amber-500/80"></span>
            )}
            <span className="text-lg leading-none mb-0.5">☰</span>
            <span className="text-[10px] font-bold tracking-tight">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}