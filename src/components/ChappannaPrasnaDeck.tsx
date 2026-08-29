"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateChappannaPrasna } from "../engine/chappannaPrasna";
import { ChappannaPrasnaAnalysis, ChappannaPrasnaQuestion } from "../engine/types";

const CATEGORIES: ChappannaPrasnaQuestion["category"][] = [
  "Health & Longevity",
  "Litigation & Disputes",
  "Travel & Missing",
  "Stolen & Lost",
  "Trade & Finance",
  "Career & Honours",
  "Marriage & Children",
  "Agriculture & Property",
];

export default function ChappannaPrasnaDeck() {
  const { ephemeris } = useAstroStore();
  const [selectedCategory, setSelectedCategory] = useState<ChappannaPrasnaQuestion["category"]>("Health & Longevity");
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(1);

  const report: ChappannaPrasnaAnalysis = useMemo(() => {
    return evaluateChappannaPrasna(ephemeris, selectedQuestionId);
  }, [ephemeris, selectedQuestionId]);

  const filteredQuestions = report.allQuestions.filter((q) => q.category === selectedCategory);
  const activeQuestion = report.selectedQuestion;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <h2 className="text-lg font-bold text-slate-100">
              Chappanna or Prasna Sastra (छप्पन प्रश्न शास्त्र)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            56 Exhaustive Horary Question Archetypes & Real-time Oracle by Prof. B. Suryanarain Rao (1946).
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-purple-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-purple-500/40 text-center">
            <div className="text-[9px] text-purple-400 uppercase tracking-wider font-bold">Prasna Lagna</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🏛️</span>
              <span>{report.lagnaSign} ({report.lagnaLord})</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/40 text-center">
            <div className="text-[9px] text-cyan-400 uppercase tracking-wider font-bold">Prasna Moon</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🌙</span>
              <span>{report.moonSign} ({report.moonLord})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Active Question Card */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950/20 to-slate-950 p-5 rounded-2xl border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
              Selected Horary Oracle Question #{activeQuestion.id} • {activeQuestion.category}
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              {activeQuestion.questionTitle} ({activeQuestion.sanskritName})
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {activeQuestion.oracleVerdict}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-purple-400 uppercase font-bold block">Outcome Status:</span>
            <span className="text-xs font-black text-slate-100 block mt-0.5">
              {activeQuestion.outcomeStatus.split(" (")[0]} ({activeQuestion.successProbability}%)
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Kala Pramana (Fruition Time):</span>
            <span className="text-xs font-bold text-amber-300 block mt-0.5">
              {activeQuestion.timingOfFruition}
            </span>
          </div>
        </div>
      </div>

      {/* 8 Spheres Navigation */}
      <div className="space-y-2">
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
          Select Life Domain (प्रश्न वर्ग)
        </span>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                const firstInCat = report.allQuestions.find((q) => q.category === cat);
                if (firstInCat) setSelectedQuestionId(firstInCat.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 7 Questions in Selected Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuestions.map((q) => {
          const isSelected = selectedQuestionId === q.id;
          const isHigh = q.outcomeStatus.includes("Highly Favorable");
          const isMod = q.outcomeStatus.includes("Moderate");
          return (
            <div
              key={q.id}
              onClick={() => setSelectedQuestionId(q.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? "bg-purple-950/30 border-purple-400 shadow-xl ring-2 ring-purple-400"
                  : isHigh
                  ? "bg-slate-950 border-emerald-500/40 hover:bg-slate-900"
                  : isMod
                  ? "bg-slate-950 border-purple-500/30 hover:bg-slate-900"
                  : "bg-slate-950/60 border-slate-800 hover:bg-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] text-purple-400 font-bold block">Question #{q.id}</span>
                    <h4 className="text-sm font-black text-slate-100">{q.sanskritName}</h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isHigh
                        ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                        : isMod
                        ? "bg-purple-950 text-purple-300 border-purple-800"
                        : "bg-red-950 text-red-300 border-red-800"
                    }`}
                  >
                    {q.successProbability}%
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-2.5">{q.questionTitle}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-900 text-[10px]">
                <div className="flex justify-between text-slate-400">
                  <span>Karya Bhava: <strong>House {q.karyaBhava}</strong></span>
                  <span>Karyesh: <strong>{q.karyeshPlanet}</strong></span>
                </div>
                <div className="text-amber-300 font-bold">
                  Timing: {q.timingOfFruition}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Question Deep Detail Card */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h4 className="text-sm font-black text-purple-400">
            Prof. B. Suryanarain Rao Classical Oracle Commentary for #{activeQuestion.id}:
          </h4>
          <span className="text-[10px] font-mono text-slate-400">
            Chappanna Sastra 1946
          </span>
        </div>

        <p className="text-slate-200 leading-relaxed">
          {activeQuestion.oracleVerdict}
        </p>

        <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30">
          <span className="text-purple-300 font-bold block mb-0.5">🔮 Classical Horary Guidance:</span>
          <p className="text-slate-200">{activeQuestion.classicalGuidance}</p>
        </div>
      </div>
    </div>
  );
}
