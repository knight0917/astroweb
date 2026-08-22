"use client";

import React from "react";
import dynamic from "next/dynamic";
import HeaderNav from "../components/HeaderNav";
import KundliChart from "../components/KundliChart";
import PositionsTable from "../components/PositionsTable";
import AshtakavargaView from "../components/AshtakavargaView";
import NumerologyView from "../components/NumerologyView";
import TimeTravelSlider from "../components/TimeTravelSlider";
import EntityDetailModal from "../components/EntityDetailModal";
import { useAstroStore } from "../store/useAstroStore";

// Dynamically import 3D WebGL SkyDome with SSR disabled to prevent webpack-runtime canvas errors
const SkyDome = dynamic(() => import("../components/SkyDome"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[480px] rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-3 text-amber-400">
      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-bold font-mono tracking-wider text-slate-300">
        INITIALIZING CELESTIAL WEBGL DOME...
      </span>
    </div>
  ),
});

export default function HomePage() {
  const { viewMode } = useAstroStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100">
      {/* Top Header & Navigation */}
      <HeaderNav />

      {/* Main Content Workspace */}
      <main className={`flex-1 w-full mx-auto p-2 md:p-4 flex flex-col gap-4 ${viewMode === "3d" ? "max-w-[1800px]" : "max-w-7xl"}`}>
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

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        Vedic Sky Tracker & Planetary Ephemeris Engine • Powered by High-Precision Celestial Mechanics
      </footer>
    </div>
  );
}