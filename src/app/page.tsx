"use client";

import React from "react";
import dynamic from "next/dynamic";
import HeaderNav from "../components/HeaderNav";
import KundliChart from "../components/KundliChart";
import PositionsTable from "../components/PositionsTable";
import TimeTravelSlider from "../components/TimeTravelSlider";
import MobileBottomNav from "../components/MobileBottomNav";
import { useAstroStore } from "../store/useAstroStore";

// Reusable Loading Skeleton for Secondary Modules
function ModuleLoadingSkeleton({ title }: { title: string }) {
  return (
    <div className="w-full min-h-[420px] rounded-3xl bg-slate-950/80 border border-slate-800/80 p-8 flex flex-col items-center justify-center gap-4 animate-pulse shadow-xl">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-xl text-amber-400">
        ☸
      </div>
      <div className="space-y-1.5 text-center">
        <h4 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider">
          Loading {title}...
        </h4>
        <p className="text-xs text-slate-500 font-mono">
          Streaming high-precision computational module
        </p>
      </div>
      <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-amber-500 to-yellow-300 animate-indeterminate"></div>
      </div>
    </div>
  );
}

// Dynamically import all secondary modules with priority splitting (loads only when user switches to them)
const SkyDome = dynamic(() => import("../components/SkyDome"), {
  ssr: false,
  loading: () => <ModuleLoadingSkeleton title="3D Celestial WebGL Dome" />,
});

const TithiCalendarView = dynamic(() => import("../components/TithiCalendarView"), {
  ssr: false,
  loading: () => <ModuleLoadingSkeleton title="Vedic Tithi Calendar & Festival Panchanga" />,
});

const ShodashavargaView = dynamic(() => import("../components/ShodashavargaView"), {
  ssr: false,
  loading: () => <ModuleLoadingSkeleton title="Shodashavarga (16 Divisional Charts)" />,
});

const ShadbalaView = dynamic(() => import("../components/ShadbalaView"), {
  ssr: false,
  loading: () => <ModuleLoadingSkeleton title="Parashari Shadbala (6-Fold Planetary Strength)" />,
});

const BhavaBalaView = dynamic(() => import("../components/BhavaBalaView"), {
  ssr: false,
  loading: () => <ModuleLoadingSkeleton title="Bhava Bala (12 House Strengths)" />,
});

const AshtakavargaView = dynamic(() => import("../components/AshtakavargaView"), {
  ssr: false,
  loading: () => <ModuleLoadingSkeleton title="Ashtakavarga Matrix Suite" />,
});

const DashaView = dynamic(() => import("../components/DashaView"), {
  ssr: false,
  loading: () => <ModuleLoadingSkeleton title="Vimshottari Dasha Timeline (120 Yrs)" />,
});

const GocharView = dynamic(() => import("../components/GocharView"), {
  ssr: false,
  loading: () => <ModuleLoadingSkeleton title="Planetary Transits & Sade Sati (Gochar)" />,
});

const ChoghadiyaHoraView = dynamic(() => import("../components/ChoghadiyaHoraView"), {
  ssr: false,
  loading: () => <ModuleLoadingSkeleton title="Real-Time Choghadiya & Planetary Horas" />,
});

const NumerologyView = dynamic(() => import("../components/NumerologyView"), {
  ssr: false,
  loading: () => <ModuleLoadingSkeleton title="Vedic & Chaldean Numerology Suite" />,
});

const TithiBirthdayView = dynamic(() => import("../components/TithiBirthdayView"), {
  ssr: false,
  loading: () => <ModuleLoadingSkeleton title="Vedic Tithi Birthday & Pravesha" />,
});

const JaiminiView = dynamic(() => import("../components/JaiminiView"), {
  ssr: false,
  loading: () => <ModuleLoadingSkeleton title="Classical Jaimini Astrology Suite" />,
});

const MatchmakingView = dynamic(() => import("../components/MatchmakingView"), {
  ssr: false,
  loading: () => <ModuleLoadingSkeleton title="Kundli Milan & 36 Guna Compatibility" />,
});

const MuhurtaView = dynamic(() => import("../components/MuhurtaView"), {
  ssr: false,
  loading: () => <ModuleLoadingSkeleton title="Auspicious Muhurta Finder & Panchanga Shuddhi" />,
});

const PrashnaView = dynamic(() => import("../components/PrashnaView"), {
  ssr: false,
  loading: () => <ModuleLoadingSkeleton title="Instant Tajik Prashna Horary Engine" />,
});

const AdhanaKundliView = dynamic(() => import("../components/AdhanaKundliView"), {
  ssr: false,
  loading: () => <ModuleLoadingSkeleton title="Adhana Kundali & Foetal Gestation Engine" />,
});

const EntityDetailModal = dynamic(() => import("../components/EntityDetailModal"), {
  ssr: false,
});

const AstroChatbot = dynamic(() => import("../components/AstroChatbot"), {
  ssr: false,
});

export default function HomePage() {
  const { viewMode, initFromStorage } = useAstroStore();

  React.useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 pb-16 md:pb-0">
      {/* Top Header & Navigation */}
      <HeaderNav />

      {/* Main Content Workspace - Full Width Layout */}
      <main className="flex-1 w-full px-2 sm:px-4 md:px-6 py-2 md:py-3 flex flex-col gap-3 md:gap-4">
        {/* Time Travel Control Deck (Shown for 2D charts/tables; 3D view has its own Left Dock) */}
        {viewMode !== "3d" && <TimeTravelSlider />}

        {/* View Mode Router */}
        {viewMode === "3d" && (
          <div className="w-full h-[calc(100vh-130px)] min-h-[700px]">
            <SkyDome />
          </div>
        )}

        {viewMode === "kundli-north" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <KundliChart />
            <PositionsTable />
          </div>
        )}

        {viewMode === "dasha" && (
          <div className="w-full">
            <DashaView />
          </div>
        )}

        {viewMode === "gochar" && (
          <div className="w-full">
            <GocharView />
          </div>
        )}

        {viewMode === "choghadiya" && (
          <div className="w-full">
            <ChoghadiyaHoraView />
          </div>
        )}

        {viewMode === "shodashavarga" && (
          <div className="w-full">
            <ShodashavargaView />
          </div>
        )}

        {viewMode === "shadbala" && (
          <div className="w-full">
            <ShadbalaView />
          </div>
        )}

        {viewMode === "bhavabala" && (
          <div className="w-full">
            <BhavaBalaView />
          </div>
        )}

        {viewMode === "ashtakavarga" && (
          <div className="w-full">
            <AshtakavargaView />
          </div>
        )}

        {viewMode === "numerology" && (
          <div className="w-full">
            <NumerologyView />
          </div>
        )}

        {viewMode === "tithi-birthday" && (
          <div className="w-full">
            <TithiBirthdayView />
          </div>
        )}

        {viewMode === "tithi-calendar" && (
          <div className="w-full">
            <TithiCalendarView />
          </div>
        )}

        {viewMode === "jaimini" && (
          <div className="w-full">
            <JaiminiView />
          </div>
        )}

        {viewMode === "matchmaking" && (
          <div className="w-full">
            <MatchmakingView />
          </div>
        )}

        {viewMode === "muhurta" && (
          <div className="w-full">
            <MuhurtaView />
          </div>
        )}

        {viewMode === "prashna" && (
          <div className="w-full">
            <PrashnaView />
          </div>
        )}

        {viewMode === "adhana" && (
          <div className="w-full">
            <AdhanaKundliView />
          </div>
        )}

        {viewMode === "table" && (
          <div className="w-full">
            <PositionsTable />
          </div>
        )}

        {viewMode === "dual" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[560px]">
              <div className="h-full">
                <SkyDome />
              </div>
              <div className="h-full overflow-y-auto">
                <KundliChart />
              </div>
            </div>
            <div className="w-full">
              <PositionsTable />
            </div>
          </div>
        )}
      </main>

      {/* Detail Inspector Modal on Click */}
      <EntityDetailModal />

      {/* Floating Vedic AI Astrologer Chatbot */}
      <AstroChatbot />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 px-4 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-4">
        <span>Vedic Sky AI Tracker & Planetary Ephemeris Engine • Powered by High-Precision Celestial Mechanics</span>
        <span className="text-slate-700">•</span>
        <a
          href="https://prasna-tantra-2-eqcdmsstvnm6buvdjcjfad.streamlit.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 font-bold underline decoration-purple-500/40 hover:decoration-purple-300 transition-colors flex items-center gap-1"
        >
          <span>🔮 Prasna Tantra (Horary Astrology) Portal</span>
          <span>↗</span>
        </a>
      </footer>

      {/* Persistent Mobile Bottom Navigation Dock */}
      <MobileBottomNav />
    </div>
  );
}