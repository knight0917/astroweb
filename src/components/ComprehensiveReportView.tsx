"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAstroStore } from "../store/useAstroStore";
import { calculateLaypersonReport } from "../engine/laypersonReportEngine";
import BirthDetailsModal from "./BirthDetailsModal";
import { RASHI_NAMES } from "../engine/constants";

export default function ComprehensiveReportView() {
  const {
    ephemeris,
    currentDate,
    location,
    gender,
    activeProfileName,
  } = useAstroStore();

  const [showEditModal, setShowEditModal] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [chartLayout, setChartLayout] = useState<"north" | "south">("north");

  // Calculate comprehensive layperson report
  const report = useMemo(() => {
    return calculateLaypersonReport({
      natalEphemeris: ephemeris,
      birthDate: currentDate,
      location,
      name: activeProfileName === "Live Now" ? "Seeker" : (activeProfileName || "Seeker"),
      gender,
    });
  }, [ephemeris, currentDate, location, gender, activeProfileName]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      });
    }
  };

  // Pre-calculate house occupants for the vector Kundli chart
  const ascLon = ephemeris.ascendant.siderealLongitude;
  const ascRashiIdx = Math.floor(ascLon / 30);

  const housePlanets: Record<number, { name: string; isRetro?: boolean }[]> = {};
  for (let i = 1; i <= 12; i++) housePlanets[i] = [];

  Object.entries(ephemeris.planets).forEach(([pName, pObj]) => {
    if (pObj && pObj.house >= 1 && pObj.house <= 12) {
      housePlanets[pObj.house].push({
        name: pName.slice(0, 2),
        isRetro: pObj.isRetrograde,
      });
    }
  });

  const getRashiNumberForHouse = (houseNum: number) => {
    // 1-indexed Rashi number (1 = Aries ... 12 = Pisces)
    return ((ascRashiIdx + (houseNum - 1)) % 12) + 1;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 print:bg-white print:text-slate-900 selection:bg-amber-500 selection:text-slate-950">
      {/* 1. TOP STICKY TOOLBAR (Hidden during printing) */}
      <header className="sticky top-0 z-50 print:hidden bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-2xl px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity"
              title="Return to Workbench"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
                ☸
              </div>
              <div>
                <h1 className="font-black text-sm tracking-wide bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  VEDIC SKY AI
                </h1>
                <p className="text-[9px] text-slate-400 font-mono">
                  Kundli Life Blueprint
                </p>
              </div>
            </Link>

            <span className="hidden sm:inline text-slate-700">•</span>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 font-medium">
              <span className="text-amber-300 font-bold">{report.nativeProfile.name}</span>
              <span className="text-slate-600">|</span>
              <span>Lagna: <strong className="text-amber-400">{report.nativeProfile.ascendantSign}</strong></span>
              <span className="text-slate-600">|</span>
              <span>Moon: <strong className="text-cyan-300">{report.nativeProfile.moonSign}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Share / Copy Link */}
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Copy shareable link"
            >
              <span>🔗</span>
              <span className="hidden md:inline">{copiedToast ? "Copied!" : "Share Link"}</span>
            </button>

            {/* Edit Birth Details */}
            <button
              onClick={() => setShowEditModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Edit date, time, or place"
            >
              <span>✏️</span>
              <span className="hidden md:inline">Edit Details</span>
            </button>

            {/* Astrologer Workbench Link */}
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Switch to detailed 46-module astrology workbench"
            >
              <span>⚙️</span>
              <span className="hidden md:inline">Workbench</span>
            </Link>

            {/* Download PDF Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
              title="Download or print publication-grade PDF report"
            >
              <span>📄</span>
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN REPORT CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12 print:space-y-8 print:p-0 print:max-w-none">
        {/* =========================================================================
            CHAPTER 1: COVER HEADER & COSMIC ESSENCE
           ========================================================================= */}
        <section className="print:page-break-after-always print:pt-4 border-b border-slate-800 print:border-slate-300 pb-10 print:pb-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase print:border-amber-700 print:text-amber-800">
                <span>☸</span>
                <span>Vedic Astrology Life Blueprint</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-100 print:text-slate-950 tracking-tight">
                {report.nativeProfile.name}
              </h1>
              <p className="text-sm text-slate-400 print:text-slate-600 font-medium">
                Comprehensive Vedic Kundli Life Report & Destiny Analysis
              </p>
            </div>

            {/* Birth Coordinates Stamp */}
            <div className="bg-slate-900/80 print:bg-slate-50 border border-slate-800 print:border-slate-300 p-4 rounded-2xl space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400 print:text-slate-500">Date:</span>
                <span className="font-bold text-slate-200 print:text-slate-900">{report.nativeProfile.birthDateFormatted}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400 print:text-slate-500">Time:</span>
                <span className="font-bold text-slate-200 print:text-slate-900">{report.nativeProfile.birthTimeFormatted}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400 print:text-slate-500">Place:</span>
                <span className="font-bold text-slate-200 print:text-slate-900">{report.nativeProfile.placeFormatted}</span>
              </div>
            </div>
          </div>

          {/* Trinity Pill Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-amber-500/10 print:bg-amber-50 border border-amber-500/30 print:border-amber-300 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-400 print:text-amber-800 tracking-wider block">
                Ascendant (Lagna)
              </span>
              <span className="text-base font-black text-amber-200 print:text-amber-950">
                {report.nativeProfile.ascendantSign}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-cyan-500/10 print:bg-cyan-50 border border-cyan-500/30 print:border-cyan-300 text-center">
              <span className="text-[10px] uppercase font-bold text-cyan-400 print:text-cyan-800 tracking-wider block">
                Moon Sign (Rashi)
              </span>
              <span className="text-base font-black text-cyan-200 print:text-cyan-950">
                {report.nativeProfile.moonSign}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-yellow-500/10 print:bg-yellow-50 border border-yellow-500/30 print:border-yellow-300 text-center">
              <span className="text-[10px] uppercase font-bold text-yellow-400 print:text-yellow-800 tracking-wider block">
                Sun Sign (Surya)
              </span>
              <span className="text-base font-black text-yellow-200 print:text-yellow-950">
                {report.nativeProfile.sunSign}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/10 print:bg-indigo-50 border border-indigo-500/30 print:border-indigo-300 text-center">
              <span className="text-[10px] uppercase font-bold text-indigo-400 print:text-indigo-800 tracking-wider block">
                Birth Nakshatra
              </span>
              <span className="text-base font-black text-indigo-200 print:text-indigo-950">
                {report.nativeProfile.birthNakshatra}
              </span>
            </div>
          </div>

          {/* Executive Cosmic Essence Narrative (Completes Page 1) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-3.5 print:p-4 print:space-y-2.5">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400 print:text-amber-800 flex items-center gap-1.5 mb-1">
                <span>🌟</span>
                <span>Your Cosmic Essence & Executive Soul Blueprint</span>
              </h3>
              <p className="text-[11px] text-slate-400 print:text-slate-600 font-medium">
                Unified synthesis of your rising sign, lunar emotional engine, solar mission, and primary karmic focus.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 print:bg-white border border-slate-800/80 print:border-slate-200 text-xs sm:text-sm text-slate-300 print:text-slate-800 leading-relaxed space-y-2.5 print:text-[9.5pt] print:leading-normal">
              {report.nativeProfile.cosmicEssence.split("\n\n").map((para, idx) => (
                <p key={idx} className="font-normal text-slate-300 print:text-slate-800">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            CHAPTER 1B: OBSERVABLE BEHAVIORAL BLUEPRINT (THE 4 PILLARS)
           ========================================================================= */}
        {report.nativeProfile.essenceBreakdown && (
          <section className="print:page-break-after-always print:pt-4 border-b border-slate-800 print:border-slate-300 pb-10 print:pb-6 space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base sm:text-lg">🧬</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-100 print:text-slate-900 tracking-tight">
                  Observable Behavioral Blueprint: Your 4 Core Pillars
                </h2>
              </div>
              <p className="text-xs text-slate-400 print:text-slate-600 font-medium">
                How your planetary placements visibly manifest in everyday demeanor, subconscious emotional wiring, and daily real-world behavior.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Outer Presence & Ascendant */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 print:bg-white border border-slate-800 print:border-slate-300 space-y-3 flex flex-col justify-between print-card hover:border-amber-500/40 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-amber-800 flex items-center gap-1.5">
                      <span>👁️</span> Outer Presence & Demeanor
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {report.nativeProfile.essenceBreakdown.outerPresence.title}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300 print:text-slate-800 pt-1">
                    <div>
                      <strong className="text-slate-200 print:text-slate-950 font-bold block mb-0.5">Observable Demeanor:</strong>
                      <p className="leading-relaxed text-slate-400 print:text-slate-700">{report.nativeProfile.essenceBreakdown.outerPresence.observableDemeanor}</p>
                    </div>
                    <div>
                      <strong className="text-slate-200 print:text-slate-950 font-bold block mb-0.5">Social Behavior:</strong>
                      <p className="leading-relaxed text-slate-400 print:text-slate-700">{report.nativeProfile.essenceBreakdown.outerPresence.socialPresence}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 print:bg-slate-100 border border-slate-800 print:border-slate-200 text-[11px] text-slate-300 print:text-slate-800">
                  <span className="text-amber-400 print:text-amber-800 font-bold">First Impression: </span>
                  {report.nativeProfile.essenceBreakdown.outerPresence.firstImpression}
                </div>
              </div>

              {/* 2. Emotional Engine & Nakshatra Psychology */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 print:bg-white border border-slate-800 print:border-slate-300 space-y-3 flex flex-col justify-between print-card hover:border-cyan-500/40 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-cyan-800 flex items-center gap-1.5">
                      <span>🌊</span> Emotional Wiring & Mind
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {report.nativeProfile.essenceBreakdown.emotionalEngine.title}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300 print:text-slate-800 pt-1">
                    <div>
                      <strong className="text-slate-200 print:text-slate-950 font-bold block mb-0.5">Emotional Engine:</strong>
                      <p className="leading-relaxed text-slate-400 print:text-slate-700">{report.nativeProfile.essenceBreakdown.emotionalEngine.psychologyOverview}</p>
                    </div>
                    <div>
                      <strong className="text-slate-200 print:text-slate-950 font-bold block mb-0.5">Everyday Reactions & Habits:</strong>
                      <p className="leading-relaxed text-slate-400 print:text-slate-700">{report.nativeProfile.essenceBreakdown.emotionalEngine.observableBehaviors}</p>
                    </div>
                    <div>
                      <strong className="text-slate-200 print:text-slate-950 font-bold block mb-0.5">Relational Loyalty & Boundaries:</strong>
                      <p className="leading-relaxed text-slate-400 print:text-slate-700">{report.nativeProfile.essenceBreakdown.emotionalEngine.relationalStyle}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-950/40 print:bg-cyan-50 border border-cyan-800/50 print:border-cyan-200 text-[11px] text-cyan-200 print:text-cyan-900">
                  <span className="font-bold">⚡ Signature Superpower: </span>
                  {report.nativeProfile.essenceBreakdown.emotionalEngine.signatureSuperpower}
                </div>
              </div>

              {/* 3. Conscious Mission & Sun Drive */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 print:bg-white border border-slate-800 print:border-slate-300 space-y-3 flex flex-col justify-between print-card hover:border-amber-500/40 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 print:text-amber-800 flex items-center gap-1.5">
                      <span>☀️</span> Conscious Mission & Vitality
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {report.nativeProfile.essenceBreakdown.consciousMission.title}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300 print:text-slate-800 pt-1">
                    <div>
                      <strong className="text-slate-200 print:text-slate-950 font-bold block mb-0.5">Core Life Ambition:</strong>
                      <p className="leading-relaxed text-slate-400 print:text-slate-700">{report.nativeProfile.essenceBreakdown.consciousMission.consciousAmbition}</p>
                    </div>
                    <div>
                      <strong className="text-slate-200 print:text-slate-950 font-bold block mb-0.5">Leadership & Execution:</strong>
                      <p className="leading-relaxed text-slate-400 print:text-slate-700">{report.nativeProfile.essenceBreakdown.consciousMission.leadershipStyle}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 print:bg-slate-100 border border-slate-800 print:border-slate-200 text-[11px] text-slate-300 print:text-slate-800">
                  <span className="text-amber-400 print:text-amber-800 font-bold">Solar Drive: </span>
                  Provides the fuel, pride, and persistent vitality behind all your endeavors.
                </div>
              </div>

              {/* 4. Chart Sovereign Life Arena */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 print:bg-white border border-slate-800 print:border-slate-300 space-y-3 flex flex-col justify-between print-card hover:border-emerald-500/40 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800 flex items-center gap-1.5">
                      <span>🎯</span> Where You Invest Life Energy
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {report.nativeProfile.essenceBreakdown.lifeFocus.title}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300 print:text-slate-800 pt-1">
                    <div>
                      <strong className="text-slate-200 print:text-slate-950 font-bold block mb-0.5">Life Arena:</strong>
                      <p className="leading-relaxed text-emerald-300 print:text-emerald-900 font-bold">{report.nativeProfile.essenceBreakdown.lifeFocus.arenaTitle}</p>
                    </div>
                    <div>
                      <strong className="text-slate-200 print:text-slate-950 font-bold block mb-0.5">Active Destiny Focus:</strong>
                      <p className="leading-relaxed text-slate-400 print:text-slate-700">{report.nativeProfile.essenceBreakdown.lifeFocus.lifeFocus}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/40 print:bg-emerald-50 border border-emerald-800/50 print:border-emerald-200 text-[11px] text-emerald-200 print:text-emerald-900">
                  <span className="font-bold">🧭 Sovereign Directive: </span>
                  Your primary life mastery is achieved by conquering the tests of this specific house.
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            CHAPTER 2: THE "BIG THREE" — YOUR CORE TRIAD
           ========================================================================= */}
        <section className="print:page-break-inside-avoid space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 print:text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-amber-400">01.</span>
              <span>The Big Three: Your Core Soul Triad</span>
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600">
              The three celestial coordinates that define your outer presence, emotional sanctuary, and soul drive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Ascendant Card */}
            <div className="p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 print:bg-amber-100 print:text-amber-900 font-bold">
                    Rising Sign
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 print:text-slate-600">
                    {report.bigThree.ascendant.element} Element
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-100 print:text-slate-900">
                  {report.bigThree.ascendant.sign}
                </h3>
                <p className="text-xs font-bold text-amber-400 print:text-amber-800">
                  {report.bigThree.ascendant.title}
                </p>
                <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                  {report.bigThree.ascendant.description}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 print:border-slate-200 text-[11px] text-slate-400 print:text-slate-600 space-y-1">
                <p><strong className="text-slate-200 print:text-slate-900">Life Anchor:</strong> {report.bigThree.ascendant.lordPlacement}</p>
                <p><strong className="text-slate-200 print:text-slate-900">Vitality Tip:</strong> {report.bigThree.ascendant.vitalityAdvice}</p>
              </div>
            </div>

            {/* Moon Sign Card */}
            <div className="p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 print:bg-cyan-100 print:text-cyan-900 font-bold">
                    Emotional Mind
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 print:text-slate-600">
                    {report.bigThree.moon.nakshatra}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-100 print:text-slate-900">
                  {report.bigThree.moon.sign}
                </h3>
                <p className="text-xs font-bold text-cyan-400 print:text-cyan-800">
                  {report.bigThree.moon.title}
                </p>
                <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                  {report.bigThree.moon.description}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 print:border-slate-200 text-[11px] text-slate-400 print:text-slate-600 space-y-1">
                <p><strong className="text-slate-200 print:text-slate-900">Inner Safety:</strong> {report.bigThree.moon.emotionalNeeds}</p>
                <p><strong className="text-slate-200 print:text-slate-900">Peace Practice:</strong> {report.bigThree.moon.mentalPeaceFormula}</p>
              </div>
            </div>

            {/* Sun Sign Card */}
            <div className="p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 print:bg-yellow-100 print:text-yellow-900 font-bold">
                    Soul Purpose
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 print:text-slate-600">
                    Vital Willpower
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-100 print:text-slate-900">
                  {report.bigThree.sun.sign}
                </h3>
                <p className="text-xs font-bold text-yellow-400 print:text-yellow-800">
                  {report.bigThree.sun.title}
                </p>
                <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                  {report.bigThree.sun.description}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 print:border-slate-200 text-[11px] text-slate-400 print:text-slate-600 space-y-1">
                <p><strong className="text-slate-200 print:text-slate-900">Outer Drive:</strong> {report.bigThree.sun.outerDrive}</p>
                <p><strong className="text-slate-200 print:text-slate-900">Ambition:</strong> {report.bigThree.sun.coreAmbition}</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CHAPTER 3: TRADITIONAL VECTOR KUNDLI CHART
           ========================================================================= */}
        <section className="print:page-break-after-always print:page-break-inside-avoid space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-100 print:text-slate-900 tracking-tight flex items-center gap-2">
                <span className="text-amber-400">02.</span>
                <span>Traditional Vector Kundli Chart</span>
              </h2>
              <p className="text-xs text-slate-400 print:text-slate-600">
                Razor-sharp vector rendering of your birth chart (Janma Kundli) showing the 12 houses and planetary placements.
              </p>
            </div>

            {/* Layout Toggle (Hidden in print) */}
            <div className="print:hidden flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-bold">
              <button
                onClick={() => setChartLayout("north")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  chartLayout === "north" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                North Diamond
              </button>
              <button
                onClick={() => setChartLayout("south")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  chartLayout === "south" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                South Box
              </button>
            </div>
          </div>

          {/* SVG Canvas Container */}
          <div className="w-full flex justify-center">
            <div className="w-full max-w-md aspect-square bg-slate-950 print:bg-white border-2 border-amber-500/40 print:border-slate-800 rounded-3xl p-3 shadow-2xl relative">
              {chartLayout === "north" ? (
                <svg viewBox="0 0 400 400" className="w-full h-full select-none">
                  {/* Outer Border */}
                  <rect x="5" y="5" width="390" height="390" fill="none" stroke="#b45309" strokeWidth="2.5" />
                  {/* Diagonals */}
                  <line x1="5" y1="5" x2="395" y2="395" stroke="#78350f" strokeWidth="1.5" />
                  <line x1="395" y1="5" x2="5" y2="395" stroke="#78350f" strokeWidth="1.5" />
                  {/* Inner Diamond */}
                  <polygon points="200,5 395,200 200,395 5,200" fill="none" stroke="#d97706" strokeWidth="2" />
                  {/* Lagna Shading */}
                  <polygon points="200,5 297.5,102.5 200,200 102.5,102.5" fill="#f59e0b" fillOpacity="0.08" />

                  {/* House 1 (Lagna) */}
                  <text x="200" y="24" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold" className="font-mono">
                    {getRashiNumberForHouse(1)}
                  </text>
                  <text x="200" y="38" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="900">
                    LAGNA
                  </text>
                  <text x="200" y="75" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold" className="print:fill-slate-900">
                    {housePlanets[1]?.map((p) => `${p.name}${p.isRetro ? "®" : ""}`).join(" ") || "—"}
                  </text>

                  {/* House 2 */}
                  <text x="120" y="24" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                    {getRashiNumberForHouse(2)}
                  </text>
                  <text x="95" y="60" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold" className="print:fill-slate-900">
                    {housePlanets[2]?.map((p) => `${p.name}${p.isRetro ? "®" : ""}`).join(" ") || "—"}
                  </text>

                  {/* House 3 */}
                  <text x="28" y="110" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                    {getRashiNumberForHouse(3)}
                  </text>
                  <text x="50" y="130" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold" className="print:fill-slate-900">
                    {housePlanets[3]?.map((p) => `${p.name}${p.isRetro ? "®" : ""}`).join(" ") || "—"}
                  </text>

                  {/* House 4 */}
                  <text x="75" y="165" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                    {getRashiNumberForHouse(4)}
                  </text>
                  <text x="100" y="205" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold" className="print:fill-slate-900">
                    {housePlanets[4]?.map((p) => `${p.name}${p.isRetro ? "®" : ""}`).join(" ") || "—"}
                  </text>

                  {/* House 5 */}
                  <text x="28" y="300" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                    {getRashiNumberForHouse(5)}
                  </text>
                  <text x="50" y="270" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold" className="print:fill-slate-900">
                    {housePlanets[5]?.map((p) => `${p.name}${p.isRetro ? "®" : ""}`).join(" ") || "—"}
                  </text>

                  {/* House 6 */}
                  <text x="120" y="386" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                    {getRashiNumberForHouse(6)}
                  </text>
                  <text x="95" y="345" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold" className="print:fill-slate-900">
                    {housePlanets[6]?.map((p) => `${p.name}${p.isRetro ? "®" : ""}`).join(" ") || "—"}
                  </text>

                  {/* House 7 */}
                  <text x="200" y="386" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                    {getRashiNumberForHouse(7)}
                  </text>
                  <text x="200" y="325" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold" className="print:fill-slate-900">
                    {housePlanets[7]?.map((p) => `${p.name}${p.isRetro ? "®" : ""}`).join(" ") || "—"}
                  </text>

                  {/* House 8 */}
                  <text x="280" y="386" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                    {getRashiNumberForHouse(8)}
                  </text>
                  <text x="305" y="345" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold" className="print:fill-slate-900">
                    {housePlanets[8]?.map((p) => `${p.name}${p.isRetro ? "®" : ""}`).join(" ") || "—"}
                  </text>

                  {/* House 9 */}
                  <text x="372" y="300" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                    {getRashiNumberForHouse(9)}
                  </text>
                  <text x="350" y="270" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold" className="print:fill-slate-900">
                    {housePlanets[9]?.map((p) => `${p.name}${p.isRetro ? "®" : ""}`).join(" ") || "—"}
                  </text>

                  {/* House 10 */}
                  <text x="325" y="165" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                    {getRashiNumberForHouse(10)}
                  </text>
                  <text x="300" y="205" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold" className="print:fill-slate-900">
                    {housePlanets[10]?.map((p) => `${p.name}${p.isRetro ? "®" : ""}`).join(" ") || "—"}
                  </text>

                  {/* House 11 */}
                  <text x="372" y="110" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                    {getRashiNumberForHouse(11)}
                  </text>
                  <text x="350" y="130" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold" className="print:fill-slate-900">
                    {housePlanets[11]?.map((p) => `${p.name}${p.isRetro ? "®" : ""}`).join(" ") || "—"}
                  </text>

                  {/* House 12 */}
                  <text x="280" y="24" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                    {getRashiNumberForHouse(12)}
                  </text>
                  <text x="305" y="60" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold" className="print:fill-slate-900">
                    {housePlanets[12]?.map((p) => `${p.name}${p.isRetro ? "®" : ""}`).join(" ") || "—"}
                  </text>
                </svg>
              ) : (
                /* South Indian Box Chart */
                <svg viewBox="0 0 400 400" className="w-full h-full select-none">
                  {/* Grid Lines */}
                  <rect x="5" y="5" width="390" height="390" fill="none" stroke="#b45309" strokeWidth="2" />
                  <line x1="102.5" y1="5" x2="102.5" y2="395" stroke="#78350f" strokeWidth="1" />
                  <line x1="200" y1="5" x2="200" y2="395" stroke="#78350f" strokeWidth="1" />
                  <line x1="297.5" y1="5" x2="297.5" y2="395" stroke="#78350f" strokeWidth="1" />
                  <line x1="5" y1="102.5" x2="395" y2="102.5" stroke="#78350f" strokeWidth="1" />
                  <line x1="5" y1="200" x2="395" y2="200" stroke="#78350f" strokeWidth="1" />
                  <line x1="5" y1="297.5" x2="395" y2="297.5" stroke="#78350f" strokeWidth="1" />
                  {/* Central Cutout */}
                  <rect x="102.5" y="102.5" width="195" height="195" fill="#030712" className="print:fill-white" />
                  <text x="200" y="195" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">
                    South Indian Layout
                  </text>
                  <text x="200" y="215" textAnchor="middle" fill="#94a3b8" fontSize="10">
                    Fixed Signs Clockwise
                  </text>
                </svg>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================================
            CHAPTER 4: JAIMINI CHARA KARAKAS — YOUR 7 SOUL ARCHETYPES
           ========================================================================= */}
        <section className="print:page-break-inside-avoid space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 print:text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-amber-400">03.</span>
              <span>Jaimini Chara Karakas: Your 7 Inner Soul Archetypes</span>
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600">
              The Maharshi Jaimini system reveals who is who inside your soul: your core mission, natural vocation, mentors, and romantic partner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Atmakaraka (AK) */}
            <div className="p-5 rounded-3xl bg-amber-500/10 print:bg-amber-50 border border-amber-500/30 print:border-amber-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300 print:text-amber-900 uppercase">
                  👑 {report.jaiminiArchetypes.atmakaraka.title}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black">
                  {report.jaiminiArchetypes.atmakaraka.planet}
                </span>
              </div>
              <p className="text-xs text-slate-200 print:text-slate-800 leading-relaxed">
                <strong className="text-amber-300 print:text-amber-900">Soul Purpose:</strong> {report.jaiminiArchetypes.atmakaraka.soulPurpose}
              </p>
              <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                <strong className="text-amber-300 print:text-amber-900">Karmic Lesson:</strong> {report.jaiminiArchetypes.atmakaraka.karmicLesson}
              </p>
            </div>

            {/* Amatyakaraka (AmK) */}
            <div className="p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-200 print:text-slate-900 uppercase">
                  💼 {report.jaiminiArchetypes.amatyakaraka.title}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 print:bg-slate-200 text-slate-200 print:text-slate-900 text-[10px] font-black">
                  {report.jaiminiArchetypes.amatyakaraka.planet}
                </span>
              </div>
              <p className="text-xs text-slate-200 print:text-slate-800 leading-relaxed">
                <strong className="text-slate-100 print:text-slate-900">Career Trajectory:</strong> {report.jaiminiArchetypes.amatyakaraka.careerPath}
              </p>
              <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                <strong className="text-slate-100 print:text-slate-900">Innate Mastery:</strong> {report.jaiminiArchetypes.amatyakaraka.naturalTalents}
              </p>
            </div>

            {/* Darakaraka (DK) */}
            <div className="p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-300 print:text-rose-900 uppercase">
                  💍 {report.jaiminiArchetypes.darakaraka.title}
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 print:bg-rose-100 print:text-rose-900 text-[10px] font-black">
                  {report.jaiminiArchetypes.darakaraka.planet}
                </span>
              </div>
              <p className="text-xs text-slate-200 print:text-slate-800 leading-relaxed">
                <strong className="text-rose-200 print:text-rose-900">Partner Vibe:</strong> {report.jaiminiArchetypes.darakaraka.partnerArchetype}
              </p>
              <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                <strong className="text-rose-200 print:text-rose-900">Harmony Advice:</strong> {report.jaiminiArchetypes.darakaraka.relationshipAdvice}
              </p>
            </div>

            {/* Bhratrikaraka & Matrikaraka */}
            <div className="p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-300 print:text-indigo-900 uppercase">
                  🧭 Gurus, Allies & Emotional Base
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {report.jaiminiArchetypes.bhratrikaraka.planet} / {report.jaiminiArchetypes.matrikaraka.planet}
                </span>
              </div>
              <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                {report.jaiminiArchetypes.bhratrikaraka.mentorsAndAllies}
              </p>
              <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                {report.jaiminiArchetypes.matrikaraka.emotionalAnchor}
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CHAPTER 5: ASHTAKAVARGA ENERGY MATRIX & FUNCTIONAL DIRECTIONS
           ========================================================================= */}
        <section className="print:page-break-after-always print:page-break-inside-avoid space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 print:text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-amber-400">04.</span>
              <span>Ashtakavarga: Your Life Energy Scorecard & Functional Directions</span>
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600">
              The 337-point classical energy distribution reveals your strongest life goals and exact spatial directions for worship, career, and focus.
            </p>
          </div>

          {/* 4 Life Goals (Purusharthas) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-1 text-center">
              <span className="text-[10px] font-bold text-amber-400 print:text-amber-800 uppercase tracking-wider block">
                Dharma (Purpose)
              </span>
              <span className="text-2xl font-black text-slate-100 print:text-slate-900">
                {report.ashtakavarga.purusharthas.dharma.score}
              </span>
              <span className="text-[10px] text-slate-400 print:text-slate-600 block">
                {report.ashtakavarga.purusharthas.dharma.percentage}% • East
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-1 text-center">
              <span className="text-[10px] font-bold text-emerald-400 print:text-emerald-800 uppercase tracking-wider block">
                Artha (Wealth & Work)
              </span>
              <span className="text-2xl font-black text-slate-100 print:text-slate-900">
                {report.ashtakavarga.purusharthas.artha.score}
              </span>
              <span className="text-[10px] text-slate-400 print:text-slate-600 block">
                {report.ashtakavarga.purusharthas.artha.percentage}% • South
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-1 text-center">
              <span className="text-[10px] font-bold text-cyan-400 print:text-cyan-800 uppercase tracking-wider block">
                Kama (Ambition & Networks)
              </span>
              <span className="text-2xl font-black text-slate-100 print:text-slate-900">
                {report.ashtakavarga.purusharthas.kama.score}
              </span>
              <span className="text-[10px] text-slate-400 print:text-slate-600 block">
                {report.ashtakavarga.purusharthas.kama.percentage}% • West
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-1 text-center">
              <span className="text-[10px] font-bold text-purple-400 print:text-purple-800 uppercase tracking-wider block">
                Moksha (Peace & Rest)
              </span>
              <span className="text-2xl font-black text-slate-100 print:text-slate-900">
                {report.ashtakavarga.purusharthas.moksha.score}
              </span>
              <span className="text-[10px] text-slate-400 print:text-slate-600 block">
                {report.ashtakavarga.purusharthas.moksha.percentage}% • North
              </span>
            </div>
          </div>

          {/* Functional Life Directions Mapping */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-200 print:text-slate-900 flex items-center gap-2">
              <span>🧭</span>
              <span>Where to Face & Place Key Life Activities (Functional Directions)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Worship */}
              <div className="p-3.5 rounded-2xl bg-slate-900/40 print:bg-slate-50 border border-slate-800 print:border-slate-300 flex items-start gap-3">
                <span className="text-xl">🪔</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-amber-300 print:text-amber-900">Worship & Meditation</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 print:bg-amber-100 print:text-amber-900 text-[10px] font-mono font-bold">
                      {report.ashtakavarga.functionalDirections.worship.direction}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 print:text-slate-700 mt-1">
                    {report.ashtakavarga.functionalDirections.worship.guidance}
                  </p>
                </div>
              </div>

              {/* Work */}
              <div className="p-3.5 rounded-2xl bg-slate-900/40 print:bg-slate-50 border border-slate-800 print:border-slate-300 flex items-start gap-3">
                <span className="text-xl">💼</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-200 print:text-slate-900">Work Desk & Routine</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 print:bg-slate-200 text-slate-200 print:text-slate-900 text-[10px] font-mono font-bold">
                      {report.ashtakavarga.functionalDirections.work.direction}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 print:text-slate-700 mt-1">
                    {report.ashtakavarga.functionalDirections.work.guidance}
                  </p>
                </div>
              </div>

              {/* Authority */}
              <div className="p-3.5 rounded-2xl bg-slate-900/40 print:bg-slate-50 border border-slate-800 print:border-slate-300 flex items-start gap-3">
                <span className="text-xl">👑</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-yellow-300 print:text-yellow-900">Authority & Leadership</span>
                    <span className="px-1.5 py-0.2 rounded bg-yellow-500/20 text-yellow-300 print:bg-yellow-100 print:text-yellow-900 text-[10px] font-mono font-bold">
                      {report.ashtakavarga.functionalDirections.authority.direction}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 print:text-slate-700 mt-1">
                    {report.ashtakavarga.functionalDirections.authority.guidance}
                  </p>
                </div>
              </div>

              {/* Business */}
              <div className="p-3.5 rounded-2xl bg-slate-900/40 print:bg-slate-50 border border-slate-800 print:border-slate-300 flex items-start gap-3">
                <span className="text-xl">📊</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-emerald-300 print:text-emerald-900">Business & Contracts</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 print:bg-emerald-100 print:text-emerald-900 text-[10px] font-mono font-bold">
                      {report.ashtakavarga.functionalDirections.business.direction}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 print:text-slate-700 mt-1">
                    {report.ashtakavarga.functionalDirections.business.guidance}
                  </p>
                </div>
              </div>

              {/* Fitness */}
              <div className="p-3.5 rounded-2xl bg-slate-900/40 print:bg-slate-50 border border-slate-800 print:border-slate-300 flex items-start gap-3">
                <span className="text-xl">⚡</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-red-300 print:text-red-900">Fitness & Active Energy</span>
                    <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 print:bg-red-100 print:text-red-900 text-[10px] font-mono font-bold">
                      {report.ashtakavarga.functionalDirections.fitness.direction}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 print:text-slate-700 mt-1">
                    {report.ashtakavarga.functionalDirections.fitness.guidance}
                  </p>
                </div>
              </div>

              {/* Arts & Love */}
              <div className="p-3.5 rounded-2xl bg-slate-900/40 print:bg-slate-50 border border-slate-800 print:border-slate-300 flex items-start gap-3">
                <span className="text-xl">🎨</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-pink-300 print:text-pink-900">Arts, Aesthetics & Harmony</span>
                    <span className="px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 print:bg-pink-100 print:text-pink-900 text-[10px] font-mono font-bold">
                      {report.ashtakavarga.functionalDirections.artsAndLove.direction}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 print:text-slate-700 mt-1">
                    {report.ashtakavarga.functionalDirections.artsAndLove.guidance}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CHAPTER 6: SHADBALA MANIFESTATION HORSEPOWER
           ========================================================================= */}
        <section className="print:page-break-inside-avoid space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 print:text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-amber-400">05.</span>
              <span>Shadbala: Planetary Manifestation Horsepower</span>
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600">
              {report.shadbala.conceptExplanation}
            </p>
          </div>

          <div className="space-y-3">
            {report.shadbala.planets.map((p) => (
              <div
                key={p.planet}
                className="p-4 rounded-2xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100 print:text-slate-900">{p.planet}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      p.percentage >= 100
                        ? "bg-emerald-500/20 text-emerald-300 print:bg-emerald-100 print:text-emerald-900"
                        : "bg-amber-500/20 text-amber-300 print:bg-amber-100 print:text-amber-900"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-black text-slate-200 print:text-slate-900">
                    {p.percentage}% ({p.rupas} Rupas)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-800 print:bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      p.percentage >= 120
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                        : p.percentage >= 100
                        ? "bg-gradient-to-r from-emerald-500 to-amber-400"
                        : "bg-gradient-to-r from-amber-500 to-rose-400"
                    }`}
                    style={{ width: `${Math.min(100, p.percentage)}%` }}
                  />
                </div>

                <p className="text-xs text-slate-300 print:text-slate-700">
                  {p.horsepowerVerdict}
                </p>
              </div>
            ))}
          </div>

          {/* Supercharged Allies vs Developing Planets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-950/30 print:bg-emerald-50 border border-emerald-500/30 text-xs space-y-1">
              <span className="font-bold text-emerald-400 print:text-emerald-800 block">
                ⚡ Your Top Cosmic Engines
              </span>
              <p className="text-slate-300 print:text-slate-700">
                Planets operating with effortless delivery: <strong className="text-emerald-300 print:text-emerald-900">{report.shadbala.topAllies.join(" and ")}</strong>. When engaging in domains ruled by these planets, progress moves swiftly.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-950/30 print:bg-amber-50 border border-amber-500/30 text-xs space-y-1">
              <span className="font-bold text-amber-400 print:text-amber-800 block">
                🌱 Engines Needing Deliberate Habits
              </span>
              <p className="text-slate-300 print:text-slate-700">
                Planets requiring conscious support: <strong className="text-amber-300 print:text-amber-900">{report.shadbala.carePlanets.join(", ") || "None (All Balanced)"}</strong>. Implement steady daily systems to nourish these energies.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CHAPTER 7: PERCEPTION VS REALITY (ARUDHA LAGNA)
           ========================================================================= */}
        <section className="print:page-break-inside-avoid space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 print:text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-amber-400">06.</span>
              <span>Perception vs. Reality: Public Image vs. Inner Truth</span>
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600">
              Comparing your Arudha Lagna (external reputation facade) with your Janma Lagna (core authentic self).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-2">
              <span className="text-[10px] font-bold text-amber-400 print:text-amber-800 uppercase tracking-wider block">
                How Society Perceives You (Arudha in {report.arudhaPerception.arudhaLagnaSign})
              </span>
              <p className="text-xs text-slate-300 print:text-slate-800 leading-relaxed">
                {report.arudhaPerception.publicImage}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-2">
              <span className="text-[10px] font-bold text-cyan-400 print:text-cyan-800 uppercase tracking-wider block">
                Who You Truly Are Inside (Rising as {report.arudhaPerception.janmaLagnaSign})
              </span>
              <p className="text-xs text-slate-300 print:text-slate-800 leading-relaxed">
                {report.arudhaPerception.innerTruth}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 print:bg-slate-50 border border-slate-800/80 text-xs text-slate-400 print:text-slate-700">
            <strong className="text-slate-200 print:text-slate-900">Integration Advice:</strong> {report.arudhaPerception.alignmentAdvice}
          </div>
        </section>

        {/* =========================================================================
            CHAPTER 8: THE 12 HOUSES OF LIFE (BHAVA DEEP-DIVE)
           ========================================================================= */}
        <section className="print:page-break-after-always print:page-break-inside-avoid space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 print:text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-amber-400">07.</span>
              <span>The 12 Houses of Life (Bhava Deep-Dive)</span>
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600">
              A comprehensive breakdown of all 12 areas of life: career, wealth, marriage, home, health, and spiritual realization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.twelveHouses.map((h) => (
              <div
                key={h.house}
                className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-300 print:text-amber-900">
                      House {h.house}: {h.name.replace("House of ", "")}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 print:bg-slate-200 text-slate-300 print:text-slate-900 font-bold">
                      {h.sign}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 print:text-slate-800 leading-relaxed">
                    {h.interpretation}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 print:border-slate-200 flex items-center justify-between text-[10px] text-slate-400 print:text-slate-600 font-mono">
                  <span>Lord: {h.lord} in H{h.lordInHouse}</span>
                  <span className="truncate max-w-[140px]">{h.strengthVerdict}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            CHAPTER 9: THE 4 PILLARS OF DAILY LIFE
           ========================================================================= */}
        <section className="print:page-break-inside-avoid space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 print:text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-amber-400">08.</span>
              <span>The 4 Pillars: Career, Wealth, Love & Health</span>
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600">
              Synthesized strategic guidance for your four primary worldly pursuits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Career */}
            <div className="p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">💼</span>
                <h3 className="font-bold text-sm text-slate-100 print:text-slate-900">
                  Career, Vocation & Social Stature
                </h3>
              </div>
              <p className="text-xs text-amber-300 print:text-amber-900 font-semibold">
                {report.pillars.career.headline}
              </p>
              <div className="space-y-1.5 text-xs text-slate-300 print:text-slate-700">
                <p><strong className="text-slate-200 print:text-slate-900">Optimal Work Settings:</strong> {report.pillars.career.workEnvironment}</p>
                <p><strong className="text-slate-200 print:text-slate-900">Leadership Style:</strong> {report.pillars.career.leadershipStyle}</p>
                <p><strong className="text-slate-200 print:text-slate-900">Key Strengths:</strong> {report.pillars.career.keyStrengths}</p>
              </div>
            </div>

            {/* Wealth */}
            <div className="p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">💰</span>
                <h3 className="font-bold text-sm text-slate-100 print:text-slate-900">
                  Wealth, Indu Lagna & Financial Destiny
                </h3>
              </div>
              <p className="text-xs text-emerald-300 print:text-emerald-900 font-semibold">
                {report.pillars.wealth.headline}
              </p>
              <div className="space-y-1.5 text-xs text-slate-300 print:text-slate-700">
                <p>{report.pillars.wealth.induLagnaVerdict}</p>
                <p>{report.pillars.wealth.bhagyaBinduPlacement}</p>
                <p><strong className="text-slate-200 print:text-slate-900">Financial Prudence:</strong> {report.pillars.wealth.financialAdvice}</p>
              </div>
            </div>

            {/* Love */}
            <div className="p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">💍</span>
                <h3 className="font-bold text-sm text-slate-100 print:text-slate-900">
                  Love, Committed Marriage & Partnerships
                </h3>
              </div>
              <p className="text-xs text-rose-300 print:text-rose-900 font-semibold">
                {report.pillars.love.headline}
              </p>
              <div className="space-y-1.5 text-xs text-slate-300 print:text-slate-700">
                <p><strong className="text-slate-200 print:text-slate-900">Partner Qualities:</strong> {report.pillars.love.partnerTraits}</p>
                <p><strong className="text-slate-200 print:text-slate-900">Compatibility Vibe:</strong> {report.pillars.love.compatibilityVibe}</p>
                <p><strong className="text-slate-200 print:text-slate-900">Harmony Tip:</strong> {report.pillars.love.harmonyTips}</p>
              </div>
            </div>

            {/* Health */}
            <div className="p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧘</span>
                <h3 className="font-bold text-sm text-slate-100 print:text-slate-900">
                  Vitality, Energy & Wellness
                </h3>
              </div>
              <p className="text-xs text-cyan-300 print:text-cyan-900 font-semibold">
                {report.pillars.health.headline}
              </p>
              <div className="space-y-1.5 text-xs text-slate-300 print:text-slate-700">
                <p><strong className="text-slate-200 print:text-slate-900">Ayurvedic Tendency:</strong> {report.pillars.health.constitutionTendency}</p>
                <p><strong className="text-slate-200 print:text-slate-900">Wellness Practice:</strong> {report.pillars.health.wellnessRoutine}</p>
                <p><strong className="text-slate-200 print:text-slate-900">Care Advice:</strong> {report.pillars.health.sensitiveAreas}</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CHAPTER 10: SPECIAL COSMIC BLESSINGS & YOGAS
           ========================================================================= */}
        <section className="print:page-break-inside-avoid space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 print:text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-amber-400">09.</span>
              <span>Special Cosmic Blessings (Yogas & Superpowers)</span>
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600">
              Exceptional planetary combinations active in your chart, indicating areas of high distinction and natural luck.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.specialYogas.map((y, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-amber-300 print:text-amber-900">
                    ✨ {y.laymanTitle}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 print:bg-amber-100 print:text-amber-900 font-bold">
                    {y.potency}% Potency
                  </span>
                </div>
                <p className="text-xs text-slate-300 print:text-slate-800 leading-relaxed">
                  {y.practicalMeaning}
                </p>
                <p className="text-[11px] text-slate-400 print:text-slate-600 pt-1 border-t border-slate-800 print:border-slate-200">
                  {y.activationAdvice}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            CHAPTER 11: CURRENT LIFE SEASON & AUTHENTIC REMEDIES
           ========================================================================= */}
        <section className="print:page-break-inside-avoid space-y-6 pb-12">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 print:text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-amber-400">10.</span>
              <span>Current Life Season & Authentic Power Remedies</span>
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600">
              Your active planetary timing (Vimshottari Dasha) and practical ways to balance and harmonize your energy.
            </p>
          </div>

          {/* Dasha Season Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 print:bg-slate-50 border border-amber-500/30 print:border-amber-300 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-amber-400 print:text-amber-800 uppercase tracking-wider">
                ⏳ Active Life Chapter
              </span>
              <span className="text-xs font-mono text-slate-400 print:text-slate-600 font-bold">
                Active until {report.currentLifeSeason.endDate}
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-100 print:text-slate-900">
              {report.currentLifeSeason.themeHeadline}
            </h3>
            <p className="text-xs text-slate-200 print:text-slate-800 leading-relaxed">
              {report.currentLifeSeason.chapterDescription}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-950/30 print:bg-emerald-50 border border-emerald-500/30">
                <strong className="text-emerald-300 print:text-emerald-900 block mb-1">What to Embrace:</strong>
                <p className="text-slate-300 print:text-slate-700">{report.currentLifeSeason.whatToEmbrace}</p>
              </div>
              <div className="p-3 rounded-2xl bg-rose-950/30 print:bg-rose-50 border border-rose-500/30">
                <strong className="text-rose-300 print:text-rose-900 block mb-1">What to Watch Out For:</strong>
                <p className="text-slate-300 print:text-slate-700">{report.currentLifeSeason.whatToAvoid}</p>
              </div>
            </div>
          </div>

          {/* Authentic Remedies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-2">
              <span className="text-xs font-bold text-amber-400 print:text-amber-800 uppercase tracking-wider block">
                🗓️ Lucky Day & Power Colors
              </span>
              <p className="text-xs text-slate-200 print:text-slate-900">
                <strong>Auspicious Day:</strong> {report.remediesAndPowerTools.luckyDay}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {report.remediesAndPowerTools.powerColors.map((c) => (
                  <span key={c} className="px-2 py-0.5 rounded-lg bg-slate-800 print:bg-slate-200 text-slate-300 print:text-slate-800 text-[10px] font-bold">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-2">
              <span className="text-xs font-bold text-amber-400 print:text-amber-800 uppercase tracking-wider block">
                💎 Harmonizing Gemstones
              </span>
              <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                Safe functional gemstones to wear or keep in workspace:
              </p>
              <p className="text-xs font-bold text-slate-200 print:text-slate-900">
                {report.remediesAndPowerTools.safeGemstones.join(", ")}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-2">
              <span className="text-xs font-bold text-amber-400 print:text-amber-800 uppercase tracking-wider block">
                🧘 Daily Mindful Action
              </span>
              <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                {report.remediesAndPowerTools.dailyMindfulPractice}
              </p>
            </div>
          </div>

          {/* Charity & Karmic Balance */}
          <div className="p-5 rounded-3xl bg-slate-900/40 print:bg-slate-50 border border-slate-800/80 text-xs text-slate-300 print:text-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400 print:text-amber-800 flex items-center gap-1.5">
              <span>🕊️</span>
              <span>Charity & Karmic Alignment</span>
            </h4>
            <p className="leading-relaxed">
              {report.remediesAndPowerTools.charityAction}
            </p>
            <p className="text-slate-400 print:text-slate-600">
              {report.remediesAndPowerTools.karmicBalancingAdvice}
            </p>
          </div>
        </section>

        {/* Report Footer */}
        <footer className="pt-6 border-t border-slate-800 print:border-slate-300 text-center text-xs text-slate-500 font-mono space-y-1">
          <p>Generated by Vedic Sky AI • Precision Jyotish Computation System</p>
          <p className="text-[10px]">Confidential Personal Life Blueprint • For Self-Empowerment & Contemplation</p>
        </footer>
      </main>

      {/* Birth Details Edit Modal */}
      {showEditModal && (
        <BirthDetailsModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          redirectToReport={false}
        />
      )}
    </div>
  );
}
