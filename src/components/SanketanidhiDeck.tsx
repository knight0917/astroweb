"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateSanketanidhi } from "../engine/sanketanidhi";
import { SanketanidhiAnalysis } from "../engine/types";

export default function SanketanidhiDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"bhavas" | "tridosha" | "ayurdaya" | "arishta">("bhavas");
  const [selectedBhavaNum, setSelectedBhavaNum] = useState<number>(1);

  const report: SanketanidhiAnalysis = useMemo(() => {
    return evaluateSanketanidhi(ephemeris);
  }, [ephemeris]);

  const activeBhava = report.bhavaVitality.find((b) => b.bhavaNum === selectedBhavaNum) || report.bhavaVitality[0];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <h2 className="text-lg font-bold text-slate-100">
              Sanketanidhi (सङ्केतनिधि - 9 Sanketas) by Acharya Ramadayalu
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Classical Predictive Precision: 12-Bhava Vridhi vs Nashana, Medical Tridosha Diagnostics & Ayurdaya Longevity.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Ayurvedic Dosha</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🌿</span>
              <span>{report.medicalDiagnostics.dominantDosha.split(" (")[0]}</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">Longevity Tier</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>⏳</span>
              <span>{report.ayurdayaLongevity.longevityTier.split(" (")[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              Sanketanidhi Master Predictive Synthesis (सङ्केतनिधि महा निर्णय)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Vitality Index: {report.ayurdayaLongevity.vitalityIndex}% • {report.ayurdayaLongevity.longevityTier.split(" (")[0]}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterSanketanidhiSynthesis}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Tridosha Breakdown:</span>
            <span className="text-xs font-black text-slate-100 block mt-0.5">
              Vata: {report.medicalDiagnostics.vataPercentage}% • Pitta: {report.medicalDiagnostics.pittaPercentage}% • Kapha: {report.medicalDiagnostics.kaphaPercentage}%
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Active Arishta Shields:</span>
            <span className="text-xs font-bold text-emerald-300 block mt-0.5">
              {report.arishtaBhangaShields.filter((s) => s.isActive).length} of 4 Shields Active
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("bhavas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "bhavas"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🏛️ 12 Bhavas Vridhi/Nashana
        </button>
        <button
          onClick={() => setActiveTab("tridosha")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "tridosha"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🩺 Medical Tridosha (रोग निदान)
        </button>
        <button
          onClick={() => setActiveTab("ayurdaya")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "ayurdaya"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⏳ Ayurdaya Longevity (आयुर्दाय)
        </button>
        <button
          onClick={() => setActiveTab("arishta")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "arishta"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🛡️ Arishta Bhanga Shields
        </button>
      </div>

      {/* TAB 1: 12 BHAVAS VRIDHI VS NASHANA */}
      {activeTab === "bhavas" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bhava Selector */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Select House (द्वादश भाव चयन)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {report.bhavaVitality.map((b) => {
                const isSelected = selectedBhavaNum === b.bhavaNum;
                const isBrimming = b.status.includes("Brimming");
                return (
                  <div
                    key={b.bhavaNum}
                    onClick={() => setSelectedBhavaNum(b.bhavaNum)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-amber-600/20 border-amber-400 shadow-lg ring-1 ring-amber-400"
                        : "bg-slate-950/60 border-slate-800 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-100">House {b.bhavaNum}</span>
                      <span
                        className={`text-[9px] font-bold px-1 rounded ${
                          isBrimming ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "text-slate-400"
                        }`}
                      >
                        {b.vridhiScore}%
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-300 font-semibold truncate mt-1">
                      {b.sanskritTitle.split(". ")[1]?.split(" (")[0]}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">
                      {b.signName} ({b.lordName})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Bhava Inspector */}
          <div className="lg:col-span-2 bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">
                  Sanketanidhi Bhava Analysis (House {activeBhava.bhavaNum})
                </span>
                <h4 className="text-base font-black text-slate-100 mt-0.5">
                  {activeBhava.sanskritTitle}
                </h4>
                <div className="text-xs text-amber-300 font-medium mt-0.5">
                  Sign: {activeBhava.signName} • Lord: {activeBhava.lordName}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Vitality Status</span>
                <span className="text-xs font-black text-amber-300">{activeBhava.status}</span>
              </div>
            </div>

            {/* Anatomical Zone */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-400 font-bold">🩺 Governed Anatomical Zone:</span>
              <span className="text-amber-300 font-semibold">{activeBhava.anatomicalZone}</span>
            </div>

            {/* Classical Shloka Box */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1 text-xs">
              <span className="text-amber-300 font-bold block">📜 Ramadayalu Sanketa Shloka:</span>
              <p className="text-slate-200 leading-relaxed">{activeBhava.classicalSanketaShloka}</p>
            </div>

            {/* Vridhi vs Nashana Double Bars */}
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-emerald-400">Bhava-Vridhi (Expansion & Fruitfulness):</span>
                  <span className="text-emerald-300">{activeBhava.vridhiScore}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${activeBhava.vridhiScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-rose-400">Bhava-Nashana (Impediment & Friction):</span>
                  <span className="text-rose-300">{activeBhava.nashanaScore}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-rose-600 to-rose-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${activeBhava.nashanaScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEDICAL TRIDOSHA */}
      {activeTab === "tridosha" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tridosha Constitution */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Ayurvedic Tridosha Diagnosis (Sanketa 8)
              </span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                Dominant Constitution: {report.medicalDiagnostics.dominantDosha}
              </h4>
            </div>

            {/* Dosha Progress Bars */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-cyan-400">Vata Dosha (वात — Air/Ether):</span>
                  <span className="text-cyan-300">{report.medicalDiagnostics.vataPercentage}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-2 rounded-full transition-all"
                    style={{ width: `${report.medicalDiagnostics.vataPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-amber-400">Pitta Dosha (पित्त — Fire/Metabolism):</span>
                  <span className="text-amber-300">{report.medicalDiagnostics.pittaPercentage}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full transition-all"
                    style={{ width: `${report.medicalDiagnostics.pittaPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-emerald-400">Kapha Dosha (कफ — Water/Earth):</span>
                  <span className="text-emerald-300">{report.medicalDiagnostics.kaphaPercentage}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full transition-all"
                    style={{ width: `${report.medicalDiagnostics.kaphaPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Ayurvedic Parihara */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-emerald-400 font-bold block mb-1">🌿 Classical Lifestyle & Diet:</span>
              <p className="text-slate-200 leading-relaxed">{report.medicalDiagnostics.ayurvedicParihara}</p>
            </div>
          </div>

          {/* Vulnerable Organ Checklist */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Organ System Vulnerability Checklist
              </span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                Biological Focus Areas
              </h4>
            </div>

            <div className="space-y-2">
              {report.medicalDiagnostics.vulnerableOrgans.map((organ, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                  <span className="text-amber-400">⚡</span>
                  <span>{organ}</span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-300 leading-relaxed">
              💡 **Classical Medical Rule:** Ramadayalu states that when Dasha lords aspect afflicted 6th/8th house lords, balancing the dominant Dosha through Ayurvedic herbs and seasonal diet neutralizes physical friction before manifestation.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AYURDAYA & LONGEVITY */}
      {activeTab === "ayurdaya" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Ayurdaya Determination (Sanketa 6)
              </span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                {report.ayurdayaLongevity.longevityTier}
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {report.ayurdayaLongevity.longevityAnalysis}
            </p>

            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Vitality Reserve Capacity:</span>
                <span className="text-emerald-400">{report.ayurdayaLongevity.vitalityIndex}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${report.ayurdayaLongevity.vitalityIndex}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Maraka Lords */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
                Maraka Sthana Analysis (2nd & 7th Houses)
              </span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                Maraka Lords: {report.ayurdayaLongevity.marakaLords.join(" & ")}
              </h4>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              "The 2nd and 7th lords are the classical Maraka lords. During their major or sub-periods, native should practice disciplined health moderation and chant Mahamrityunjaya Mantra for enhanced vital stamina (Sanketa 6)."
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ARISHTA BHANGA SHIELDS */}
      {activeTab === "arishta" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Arishta Bhanga Sanctuary (Sanketanidhi Sanketa 9)</h4>
            <p className="text-xs text-slate-400">
              Supreme classical cancellation shields that neutralize planetary blemishes and afflictions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.arishtaBhangaShields.map((shield, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                  shield.isActive
                    ? "bg-slate-950 border-emerald-500/40 shadow-xl ring-1 ring-emerald-500/30"
                    : "bg-slate-950/50 border-slate-800 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                        Shield #{idx + 1}
                      </span>
                      <h4 className="text-sm font-black text-slate-100 mt-0.5">{shield.sanskritName}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                        shield.isActive
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : "bg-slate-900 text-slate-400 border-slate-800"
                      }`}
                    >
                      {shield.isActive ? "Active Shield" : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                    {shield.protectiveEffect}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-amber-300 font-mono">
                  📜 {shield.sanketaCitation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
