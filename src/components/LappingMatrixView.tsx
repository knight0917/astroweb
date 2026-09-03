"use client";

import React from "react";
import { EphemerisResult } from "../engine/types";
import {
  calculateLappingCompatibility,
  LappingCompatibilityResult,
  LappingSingleOverlay,
} from "../engine/lappingCompatibility";

interface LappingMatrixViewProps {
  boyEphem: EphemerisResult;
  girlEphem: EphemerisResult;
  boyName: string;
  girlName: string;
}

export default function LappingMatrixView({
  boyEphem,
  girlEphem,
  boyName,
  girlName,
}: LappingMatrixViewProps) {
  const result: LappingCompatibilityResult = React.useMemo(() => {
    return calculateLappingCompatibility(boyEphem, girlEphem);
  }, [boyEphem, girlEphem]);

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "Exceptional (Top-Tier)":
        return "bg-rose-950/80 text-rose-300 border-rose-500/70";
      case "High Endurance & Devotion":
        return "bg-indigo-950/80 text-indigo-300 border-indigo-500/70";
      case "High Material Joy & Honeymoon":
        return "bg-amber-950/80 text-amber-300 border-amber-500/70";
      case "Romantic Harmony":
        return "bg-pink-950/80 text-pink-300 border-pink-500/70";
      case "Emotional / Artistic Life":
        return "bg-cyan-950/80 text-cyan-300 border-cyan-500/70";
      case "Friendly & Banter-Driven":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-500/70";
      case "Preacher / Teacher Conflict":
        return "bg-yellow-950/80 text-yellow-300 border-yellow-500/70";
      case "Ego Combustion":
        return "bg-orange-950/80 text-orange-300 border-orange-500/70";
      case "Soul Pain & Detachment":
        return "bg-red-950 text-red-300 border-red-600 animate-pulse";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const renderOverlayList = (overlays: LappingSingleOverlay[], title: string, subtitle: string) => {
    return (
      <div className="space-y-3">
        <div className="border-b border-slate-800 pb-2">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{title}</h4>
          <p className="text-[11px] text-slate-400 font-sans">{subtitle}</p>
        </div>

        {overlays.length === 0 ? (
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs text-center font-sans">
            No direct or trine planetary superposition falling on Venus in this direction.
          </div>
        ) : (
          <div className="space-y-2.5">
            {overlays.map((o, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md font-mono font-black text-xs bg-slate-800 text-amber-300 border border-slate-700">
                      {o.superimposedPlanet}
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      in {o.rashiName} ({o.relationship})
                    </span>
                  </div>
                  <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-bold border ${getGradeBadge(o.grade)}`}>
                    {o.grade}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  <strong className="text-slate-100">Effect:</strong> {o.summary}
                </p>

                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  <strong className="text-slate-300">Astrological Mechanism:</strong> {o.mechanism}
                </p>

                {o.riskWarning && (
                  <div className="p-2 rounded-lg bg-yellow-950/40 border border-yellow-800/50 text-[10.5px] text-yellow-300 font-sans flex items-start gap-1.5">
                    <span>⚠️</span>
                    <span>{o.riskWarning}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-pink-500/30 bg-slate-950/80 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl text-pink-400 animate-pulse">🔥</span>
            <h3 className="text-base font-extrabold text-pink-300 uppercase tracking-wider">
              Marriage Masterclass: Sexual Compatibility & Lapping Systems
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Planetary Superimposition (रोपण पद्धति) • Natural Romantic Chemistry, 10-Year Honeymoon Longevity & 8th-House Solitude Prescriptions
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span
            className={`px-3.5 py-1.5 rounded-xl text-xs uppercase font-black tracking-wide border shadow-lg ${
              result.overallLappingScore >= 80
                ? "bg-rose-950 text-rose-300 border-rose-500/80 shadow-rose-950/50"
                : result.overallLappingScore >= 65
                ? "bg-emerald-950 text-emerald-300 border-emerald-500/80 shadow-emerald-950/50"
                : result.overallLappingScore >= 50
                ? "bg-amber-950 text-amber-300 border-amber-500/80 shadow-amber-950/50"
                : "bg-red-950 text-red-300 border-red-600 shadow-red-950/50"
            }`}
          >
            {result.overallLappingScore}% • {result.overallVerdict}
          </span>
        </div>
      </div>

      {/* 3 Core Compatibility Pillars Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Sexual Attraction */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <span>⚡</span> Physical & Sexual Drive
            </span>
            <span className="font-mono font-bold text-rose-400">{result.sexualAttractionScore}/100</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-rose-500 to-pink-400 h-2 rounded-full"
              style={{ width: `${result.sexualAttractionScore}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 block font-sans">
            Mars, Rahu & Venus superposition harmony
          </span>
        </div>

        {/* Longevity & Devotion */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <span>💎</span> Longevity & Sacrificial Loyalty
            </span>
            <span className="font-mono font-bold text-indigo-400">{result.longevityDevotionScore}/100</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-blue-400 h-2 rounded-full"
              style={{ width: `${result.longevityDevotionScore}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 block font-sans">
            Saturn & Venus enduring endurance anchor
          </span>
        </div>

        {/* Material Joy & Honeymoon */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <span>✈️</span> Material Joy & Extended Honeymoon
            </span>
            <span className="font-mono font-bold text-amber-400">{result.materialJoyScore}/100</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-2 rounded-full"
              style={{ width: `${result.materialJoyScore}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 block font-sans">
            Rahu & Venus travel, romance & optimism
          </span>
        </div>
      </div>

      {/* Dual Direction Overlay Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Groom's Planets on Bride's Venus */}
        {renderOverlayList(
          result.partnerA_on_B_Venus,
          `${boyName}'s Planets on ${girlName}'s Venus`,
          `How ${boyName}'s planetary energies impact ${girlName}'s romance and romantic expectations`
        )}

        {/* Column 2: Bride's Planets on Groom's Venus */}
        {renderOverlayList(
          result.partnerB_on_A_Venus,
          `${girlName}'s Planets on ${boyName}'s Venus`,
          `How ${girlName}'s planetary energies impact ${boyName}'s romance and romantic expectations`
        )}
      </div>

      {/* Compound Yuti Overlaps (Multi-Planet Clusters) */}
      {result.compoundOverlaps.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span>✨</span> Compound Multi-Planet Superimposition (युति रोपण)
          </h4>
          <div className="space-y-2">
            {result.compoundOverlaps.map((c, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border text-xs font-sans space-y-1 ${
                  c.score < 40
                    ? "bg-rose-950/30 border-rose-800/60 text-rose-200"
                    : "bg-emerald-950/30 border-emerald-800/60 text-emerald-200"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>
                    {c.targetVenusPerson}'s Venus in {c.rashiName} overlapped by {c.superimposedPlanets.join(" + ")}
                  </span>
                  <span className="font-mono text-[11px]">{c.verdict} ({c.score}/100)</span>
                </div>
                <p className="text-[11px] opacity-90">{c.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dr. Samir Tripathi 8th-House Solitude & Fasting Remedy Engine */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-800/50 space-y-2 text-xs font-sans">
        <div className="flex items-center gap-2 font-bold text-purple-300">
          <span className="text-base">🏔️</span>
          <span>8th-House Solitary Reset & Karmic Remedy:</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          {result.eighthHouseAnalysis.details}
        </p>
        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-purple-500/30 text-purple-200 text-[11px] leading-relaxed">
          <strong className="text-purple-300">Prescription:</strong> {result.eighthHouseAnalysis.solitudeRemedy}
        </div>
      </div>

      {/* Masterclass Synthesis Verdict */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-sans space-y-1.5">
        <span className="font-bold text-amber-400 block">🕉️ Masterclass Synthesis:</span>
        <p className="text-slate-300 leading-relaxed font-serif text-[12.5px]">
          {result.samirTripathiVerdict}
        </p>
      </div>
    </div>
  );
}
