"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import {
  synthesizeBphsKarmicShanti,
  BphsKarmicShantiReport,
  BphsKarmicCurse,
  BphsBirthShanti,
} from "../engine/bphsKarmicShanti";

export default function BphsKarmicShantiDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"curses" | "birth" | "checklist">("curses");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const report: BphsKarmicShantiReport = useMemo(() => {
    return synthesizeBphsKarmicShanti(ephemeris);
  }, [ephemeris]);

  const copyMantra = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getSeverityBadge = (severity: string, isActive: boolean) => {
    if (!isActive) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
          ✓ Spotless / Clear
        </span>
      );
    }
    if (severity === "Severe / Veto") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-950/80 border border-rose-500/60 text-rose-300 animate-pulse">
          ⚠️ Severe / Karmic Veto
        </span>
      );
    }
    if (severity === "Moderate") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 border border-amber-500/60 text-amber-300">
          ⚡ Moderate Impendence
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-950/70 border border-sky-500/40 text-sky-300">
        ℹ️ Mild Affliction
      </span>
    );
  };

  const getShantiSeverityBadge = (severity: string, isAfflicted: boolean) => {
    if (!isAfflicted) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
          ✓ Normal Birth Moment
        </span>
      );
    }
    if (severity === "Critical") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-950/80 border border-red-500/60 text-red-300 animate-pulse">
          🚨 Critical Shānti Required
        </span>
      );
    }
    if (severity === "Moderate") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 border border-amber-500/60 text-amber-300">
          ⚡ Shānti Recommended
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/70 border border-blue-500/40 text-blue-300">
        ℹ️ Minor Pacification
      </span>
    );
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6 bg-slate-950/90 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔱</span>
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              BPHS: Pūrva Janma Shāpas & Arishta Janma Shānti Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Brihat Parashara Hora Shastra (Chapters 83 & 85–96) • 8 Past-Life Progeny Curses (*Putra Doshas*) & Inauspicious Birth Moment Vedic Shāntis
          </p>
        </div>

        {/* Global Shastra Status Card */}
        <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Shastric Afflictions</div>
            <div className="text-sm font-black text-slate-200 flex items-center justify-end gap-2">
              <span className={report.activeCursesCount > 0 ? "text-rose-400" : "text-emerald-400"}>
                {report.activeCursesCount} Curses
              </span>
              <span className="text-slate-600">•</span>
              <span className={report.activeBirthAfflictionsCount > 0 ? "text-amber-400" : "text-emerald-400"}>
                {report.activeBirthAfflictionsCount} Birth Shāntis
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          report.highestCurseSeverity === "Severe / Veto"
            ? "bg-rose-950/30 border-rose-500/50 text-rose-200"
            : report.hasAnyCurse || report.hasAnyBirthAffliction
            ? "bg-amber-950/30 border-amber-500/50 text-amber-200"
            : "bg-emerald-950/30 border-emerald-500/50 text-emerald-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {report.highestCurseSeverity === "Severe / Veto" ? "🛑" : report.hasAnyCurse || report.hasAnyBirthAffliction ? "⚠️" : "🕊️"}
          </span>
          <div>
            <div className="text-xs font-black uppercase tracking-wider">
              Parashari Verdict: {report.karmicDestinyVerdict}
            </div>
            <div className="text-[11px] opacity-80 mt-0.5">
              {report.acharyaGuidanceSummary}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setActiveTab("curses")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "curses"
              ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <span>🧬</span>
          <span>8 Pūrva Janma Shāpas (Ch. 83)</span>
          {report.activeCursesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-950 text-rose-300 border border-rose-500/40">
              {report.activeCursesCount} Active
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("birth")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "birth"
              ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <span>⚡</span>
          <span>Arishta Janma & Shāntis (Ch. 85–96)</span>
          {report.activeBirthAfflictionsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-950 text-amber-300 border border-amber-500/40">
              {report.activeBirthAfflictionsCount} Active
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("checklist")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "checklist"
              ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <span>📿</span>
          <span>Master Vedic Shānti Checklist</span>
        </button>
      </div>

      {/* TAB 1: 8 Pūrva Janma Shāpas */}
      {activeTab === "curses" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.curses.map((curse: BphsKarmicCurse) => (
            <div
              key={curse.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                curse.isActive
                  ? curse.severity === "Severe / Veto"
                    ? "bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/20"
                    : "bg-amber-950/20 border-amber-500/40"
                  : "bg-slate-900/50 border-slate-800/80 opacity-75 hover:opacity-100"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                      <span>{curse.name}</span>
                      <span className="text-xs text-amber-400/90 font-serif font-normal">
                        ({curse.sanskritName})
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {curse.curseSource}
                    </p>
                  </div>
                  {getSeverityBadge(curse.severity, curse.isActive)}
                </div>

                {/* Evidence & Trigger */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 my-3 text-xs">
                  <div className="font-semibold text-slate-300 text-[11px] mb-1">
                    🎯 Shastric Yoga:{" "}
                    <span className={curse.isActive ? "text-amber-300 font-bold" : "text-slate-400"}>
                      {curse.specificYogaTriggered}
                    </span>
                  </div>
                  {curse.astrologicalEvidence.length > 0 && (
                    <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                      {curse.astrologicalEvidence.map((ev, idx) => (
                        <li key={idx}>{ev}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Authentic Parashara Remedy */}
                <div className="border-t border-slate-800/80 pt-3">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <span>🕉️</span>
                    <span>{curse.classicalRemedy.sanskritTitle}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    {curse.classicalRemedy.prescription}
                  </p>

                  {/* Mantra Box with Copy */}
                  <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-2.5 flex items-center justify-between gap-2 text-xs font-mono text-amber-200">
                    <span className="truncate">{curse.classicalRemedy.mantra}</span>
                    <button
                      onClick={() => copyMantra(curse.id, curse.classicalRemedy.mantra)}
                      className="px-2 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[10px] hover:bg-amber-400 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {copiedId === curse.id ? "✓ Copied!" : "Copy"}
                    </button>
                  </div>

                  {/* Dāna Items Pills */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {curse.classicalRemedy.danaItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-medium border border-slate-700"
                      >
                        🎁 {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Arishta Janma & Birth Shāntis (Ch. 85-96) */}
      {activeTab === "birth" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.birthShantis.map((shanti: BphsBirthShanti) => (
            <div
              key={shanti.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                shanti.isAfflicted
                  ? shanti.severity === "Critical"
                    ? "bg-red-950/20 border-red-500/50 shadow-lg shadow-red-950/20"
                    : "bg-amber-950/20 border-amber-500/40"
                  : "bg-slate-900/50 border-slate-800/80 opacity-75 hover:opacity-100"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-amber-400 font-bold">
                        BPHS Ch. {shanti.bphsChapter}
                      </span>
                      <h3 className="font-bold text-sm text-slate-100">
                        {shanti.name}
                      </h3>
                    </div>
                    <div className="text-xs text-amber-400/90 font-serif mt-0.5">
                      {shanti.sanskritName}
                    </div>
                  </div>
                  {getShantiSeverityBadge(shanti.severity, shanti.isAfflicted)}
                </div>

                {/* Diagnostic Details */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 my-3 text-xs">
                  <div className="font-semibold text-slate-300 text-[11px] mb-1">
                    🔍 Diagnostic:{" "}
                    <span className={shanti.isAfflicted ? "text-amber-300 font-bold" : "text-slate-400"}>
                      {shanti.diagnosticDetails}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <span className="text-slate-300 font-semibold">Kinship / Sector Vulnerability:</span> {shanti.kinshipAffected}
                  </div>
                </div>

                {/* Classical Vedic Shānti Protocol */}
                <div className="border-t border-slate-800/80 pt-3 text-xs space-y-2">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🔱</span>
                    <span>{shanti.classicalVedicShanti.ritualName}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <span className="font-semibold text-amber-300/90">🏺 Kalasha Sthāpanā:</span> {shanti.classicalVedicShanti.kalashaWorship}
                  </p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <span className="font-semibold text-amber-300/90">📿 Japa & Homa:</span> {shanti.classicalVedicShanti.mantraRecitation}
                  </p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <span className="font-semibold text-amber-300/90">🎁 Dāna & Bhojana:</span> {shanti.classicalVedicShanti.danaAndBhojana}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Master Vedic Shānti Checklist */}
      {activeTab === "checklist" && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col gap-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>📋</span>
              <span>Parashari Unified Remedial Action Protocol</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Consolidated, sequential Vedic remediation guidelines according to Maharshi Parashara for active karmic vetoes and birth moment anomalies.
            </p>
          </div>

          {report.activeCursesCount === 0 && report.activeBirthAfflictionsCount === 0 ? (
            <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-center flex flex-col items-center gap-2">
              <span className="text-3xl">🕊️</span>
              <h4 className="font-bold text-sm text-emerald-300">No Classical Shastric Shāntis Required</h4>
              <p className="text-xs text-slate-300 max-w-md">
                The chart is free from major past-life curses on progeny and critical birth moment afflictions (Gandanta, Amavasya, Eclipse, etc.). Continue regular devotional Dharma and charity.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active Curses List */}
              {report.activeCursesCount > 0 && (
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-2">
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>Priority 1: Neutralize Active Pūrva Janma Shāpas ({report.activeCursesCount})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {report.curses.filter((c) => c.isActive).map((c) => (
                      <div key={c.id} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs">
                        <div className="font-bold text-slate-200">{c.name}</div>
                        <div className="text-[11px] text-amber-300 mt-1">{c.classicalRemedy.sanskritTitle}</div>
                        <div className="text-[11px] text-slate-400 mt-1">{c.classicalRemedy.charityOrRitual}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Birth Shāntis List */}
              {report.activeBirthAfflictionsCount > 0 && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>Priority 2: Conduct Birth Moment Vedic Pacifications ({report.activeBirthAfflictionsCount})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {report.birthShantis.filter((s) => s.isAfflicted).map((s) => (
                      <div key={s.id} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs">
                        <div className="font-bold text-slate-200">{s.name} (BPHS Ch. {s.bphsChapter})</div>
                        <div className="text-[11px] text-amber-300 mt-1">{s.classicalVedicShanti.ritualName}</div>
                        <div className="text-[11px] text-slate-400 mt-1">{s.classicalVedicShanti.danaAndBhojana}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Universal Sanatana Principles */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🌿</span>
                  <span>Universal Parashari Shānti Baseline</span>
                </h4>
                <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                  <li>Daily morning recitation of the <strong>Mahamrityunjaya Mantra</strong> (108 times) with fresh water offering to Lord Shiva.</li>
                  <li>Perform <strong>Surya Arghya</strong> (water oblations to the rising Sun) using a clean copper vessel with red sandalwood and whole rice grains.</li>
                  <li>Support animal welfare by feeding cows (Go-Seva) on Fridays/Wednesdays and crows/dogs on Saturdays.</li>
                  <li>For progeny and family blessings, sponsor the recitation of <strong>Santana Gopala Stotra</strong> or <strong>Harivamsa Purana</strong>.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
