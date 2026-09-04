"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useAstroStore, ViewMode } from "../store/useAstroStore";

export default function MobileBottomNav() {
  const { viewMode, setViewMode } = useAstroStore();
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);
  const [mobileSearch, setMobileSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const PRIMARY_TABS: {
    mode: ViewMode;
    label: string;
    iconSvg: React.ReactNode;
  }[] = [
    {
      mode: "kundli-north",
      label: "Kundli",
      iconSvg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="m3 3 18 18M21 3 3 21" />
        </svg>
      ),
    },
    {
      mode: "shodashavarga",
      label: "16 Vargas",
      iconSvg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      mode: "shadbala",
      label: "Shadbala",
      iconSvg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="M7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </svg>
      ),
    },
    {
      mode: "bhavabala",
      label: "Bhavas",
      iconSvg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 22h16M2 7l10-4 10 4M6 18v-7M10 18v-7M14 18v-7M18 18v-7" />
        </svg>
      ),
    },
  ];

  const MORE_MODULES: { mode: ViewMode; label: string; hindiLabel: string; desc: string }[] = [
    { mode: "prashna", label: "Tajik Prashna", hindiLabel: "ताजिक प्रश्न तन्त्र", desc: "16 Tajika Yogas & Horary Yes/No" },
    { mode: "adhana", label: "Adhana Kundali", hindiLabel: "आधान कुण्डली (गर्भाधान)", desc: "Conception Epoch, 10-Month Timeline & Garbha Raksha" },
    { mode: "muhurta", label: "Muhurta Finder", hindiLabel: "शुभ मुहूर्त शोधन", desc: "Abhijit, Brahma & Event Muhurtas" },
    { mode: "matchmaking", label: "Kundli Milan", hindiLabel: "अष्टकूट ३६ गुण मिलान", desc: "Ashtakoota 36 Gunas & Manglik Check" },
    { mode: "jaimini", label: "Jaimini Suite", hindiLabel: "जैमिनी ज्योतिष", desc: "Arudha Padas, Karakamsha & Chara Dasha" },
    { mode: "dasha", label: "Vimshottari Dasha", hindiLabel: "विम्शोत्तरी दशा चक्र", desc: "120 Yrs MD/AD/PD Hierarchy" },
    { mode: "gochar", label: "Transits & Sade Sati", hindiLabel: "ग्रह गोचर एवं साढ़े साती", desc: "Live Transits & Sade Sati" },
    { mode: "3d", label: "3D Celestial Dome", hindiLabel: "3D खगोलीय आकाश", desc: "Interactive WebGL Sky & Star Dome" },
    { mode: "ashtakavarga", label: "Ashtakavarga Suite", hindiLabel: "अष्टकवर्ग चक्र", desc: "Sarva & Bhinna 8-Grid Charts" },
    { mode: "vastu", label: "Classical Vāstu Studio", hindiLabel: "वास्तु शास्त्र (81 पद)", desc: "81-Grid Mandala, Ayadi & Dhana-Disha" },
    { mode: "choghadiya", label: "Choghadiya & Horas", hindiLabel: "चौघड़िया एवं होरा", desc: "Real-Time Muhurtas & Horas" },
    { mode: "numerology", label: "Vedic Numerology", hindiLabel: "वैदिक अंकशास्त्र", desc: "Mulank, Bhagyank & Lo Shu Grid" },
    { mode: "tithi-calendar", label: "Tithi Calendar", hindiLabel: "तिथि पञ्चाङ्ग कैलेण्डर", desc: "Daily Tithi, Moon Phases & Festivals" },
    { mode: "tithi-birthday", label: "Tithi Birthday", hindiLabel: "तिथि जन्मदिन", desc: "Tithi Pravesha & Janmadin Vidhi" },
    { mode: "table", label: "Full Ephemeris Table", hindiLabel: "ग्रह स्थिति सारणी", desc: "Sidereal Degrees & Nakshatras" },
    { mode: "dual", label: "Dual 3D + Chart", hindiLabel: "युगल दृश्य (3D + कुण्डली)", desc: "Split-Screen Dome and Kundli" },
  ];

  const isMoreActive = MORE_MODULES.some((m) => m.mode === viewMode);

  const filteredMoreModules = useMemo(() => {
    if (!mobileSearch.trim()) return MORE_MODULES;
    const q = mobileSearch.trim().toLowerCase();
    return MORE_MODULES.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.hindiLabel.toLowerCase().includes(q) ||
        m.desc.toLowerCase().includes(q) ||
        m.mode.toLowerCase().includes(q)
    );
  }, [mobileSearch]);

  return (
    <>
      {/* Mobile More Modules Sheet Drawer Modal via Portal */}
      {mounted && showMoreDrawer && createPortal(
        <div className="fixed inset-0 z-[99999] md:hidden flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setShowMoreDrawer(false)}
          ></div>

          <div className="relative z-10 glass-panel bg-slate-950/98 border-t border-slate-800 rounded-t-3xl p-5 safe-bottom max-h-[80vh] overflow-y-auto space-y-3.5 shadow-2xl animate-in slide-in-from-bottom duration-250">
            {/* Header Handle */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-1 bg-slate-700 rounded-full mb-3"></div>
              <div className="flex items-center justify-between w-full pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-slate-200">
                    All Jyotish Modules
                  </h3>
                  <span className="text-[10px] text-amber-400 font-mono">
                    ({filteredMoreModules.length})
                  </span>
                </div>
                <button
                  onClick={() => setShowMoreDrawer(false)}
                  className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Live Search Input */}
            <div className="relative">
              <input
                type="text"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                placeholder="Search modules (e.g. Vastu, Dasha, Match)..."
                className="w-full bg-slate-900/90 border border-slate-700 text-slate-100 text-xs rounded-xl pl-8 pr-7 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-slate-500"
              />
              <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              {mobileSearch && (
                <button
                  onClick={() => setMobileSearch("")}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Grid of Modules */}
            {filteredMoreModules.length === 0 ? (
              <div className="py-8 text-center space-y-1.5">
                <p className="text-xs text-slate-400">No modules match &ldquo;{mobileSearch}&rdquo;</p>
                <button
                  onClick={() => setMobileSearch("")}
                  className="text-[11px] text-amber-400 hover:underline font-bold"
                >
                  Reset search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredMoreModules.map((m) => {
                  const isActive = viewMode === m.mode;
                  return (
                    <button
                      key={m.mode}
                      onClick={() => {
                        setViewMode(m.mode);
                        setShowMoreDrawer(false);
                      }}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        isActive
                          ? "bg-amber-500/10 border-amber-400 text-amber-300 shadow-md"
                          : "bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-850"
                      }`}
                    >
                      <div className="pt-1">
                        <span className={`w-1.5 h-1.5 rounded-full block ${isActive ? "bg-amber-400" : "bg-slate-600"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-100 truncate">{m.label}</span>
                          {isActive && (
                            <span className="text-[8px] font-bold text-amber-400 uppercase tracking-widest">Active</span>
                          )}
                        </div>
                        <span className="text-[10px] text-amber-400/80 block font-medium">{m.hindiLabel}</span>
                        <span className="text-[9.5px] text-slate-400 block line-clamp-1 mt-0.5">{m.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Persistent Bottom Nav Dock (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel bg-slate-950/95 border-t border-slate-800 safe-bottom px-2 py-1.5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-around">
          {PRIMARY_TABS.map((tab) => {
            const isActive = viewMode === tab.mode;
            return (
              <button
                key={tab.mode}
                onClick={() => setViewMode(tab.mode)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 relative cursor-pointer ${
                  isActive ? "text-amber-400 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1.5 w-5 h-0.5 bg-amber-400 rounded-full shadow-sm shadow-amber-500/80"></span>
                )}
                <div className="mb-0.5">{tab.iconSvg}</div>
                <span className="text-[10px] font-semibold tracking-tight">{tab.label}</span>
              </button>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setShowMoreDrawer(true)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 relative cursor-pointer ${
              isMoreActive ? "text-amber-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {isMoreActive && (
              <span className="absolute -top-1.5 w-5 h-0.5 bg-amber-400 rounded-full shadow-sm shadow-amber-500/80"></span>
            )}
            <svg className="w-4 h-4 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
            <span className="text-[10px] font-semibold tracking-tight">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}