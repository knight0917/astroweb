"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluateEducationStream, EducationStreamReport } from "../engine/educationStream";

export default function EducationStreamDeck() {
  const { ephemeris } = useAstroStore();
  const [activeTab, setActiveTab] = useState<"streams" | "tripartite" | "d24">("streams");

  const report: EducationStreamReport = useMemo(() => {
    return evaluateEducationStream(ephemeris);
  }, [ephemeris]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <h2 className="text-lg font-bold text-slate-100">
              K.N. Rao & Naval Singh: Planets & Education Counselling Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Bharatiya Vidya Bhavan Method — 6-Stream Aptitude Analysis, Tripartite Houses (4/5/9) & D24 Siddhamsa.
          </p>
        </div>

        {/* Primary Stream Badge */}
        <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-4 py-2 rounded-xl border border-amber-500/40 text-center sm:text-right">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">Primary Academic Alignment</div>
          <div className="text-sm font-black text-slate-100 flex items-center gap-1.5 justify-center sm:justify-end">
            <span>{report.topRecommendedStream.icon}</span>
            <span>{report.topRecommendedStream.streamName.split(",")[0]}</span>
          </div>
        </div>
      </div>

      {/* Top Stream Hero Card */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{report.topRecommendedStream.icon}</span>
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Top Astrological Recommendation ({report.topRecommendedStream.aptitudeScorePercent}% Match)
              </span>
              <h3 className="text-lg font-black text-slate-100">
                {report.topRecommendedStream.streamName}
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.topRecommendedStream.classicalReasoning}
          </p>
        </div>

        {/* Recommended Degrees & Careers Pills */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Optimal College Degrees:</span>
            <span className="text-xs font-semibold text-slate-200 block mt-0.5">
              {report.topRecommendedStream.recommendedDegrees.slice(0, 2).join(" • ")}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">High-Yield Career Pathways:</span>
            <span className="text-xs font-semibold text-slate-200 block mt-0.5">
              {report.topRecommendedStream.careerPathways.slice(0, 2).join(" • ")}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("streams")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "streams"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🔬 6 Educational Streams Aptitude
        </button>
        <button
          onClick={() => setActiveTab("tripartite")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "tripartite"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🏛️ Tripartite Academic Houses (H4, H5, H9)
        </button>
        <button
          onClick={() => setActiveTab("d24")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "d24"
              ? "bg-amber-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          📜 D24 Siddhamsa (Higher Learning)
        </button>
      </div>

      {/* Tab 1: 6 Streams */}
      {activeTab === "streams" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.streamAptitudes.map((s, idx) => (
            <div
              key={s.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                idx === 0
                  ? "bg-amber-950/20 border-amber-500/50 shadow-lg"
                  : "bg-slate-900/80 border-slate-800"
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        {s.sanskritTitle}
                      </span>
                      <h4 className="text-sm font-black text-slate-100">{s.streamName}</h4>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded border ${
                      s.aptitudeScorePercent >= 75
                        ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                        : "bg-slate-900 text-slate-400 border-slate-800"
                    }`}
                  >
                    {s.aptitudeScorePercent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 mt-2.5">
                  <div
                    className={`h-full rounded-full ${
                      s.aptitudeScorePercent >= 75
                        ? "bg-gradient-to-r from-amber-500 to-emerald-400"
                        : "bg-slate-600"
                    }`}
                    style={{ width: `${s.aptitudeScorePercent}%` }}
                  />
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 mt-3">
                  <div>
                    <strong className="text-purple-300 text-[11px]">Karakas:</strong>{" "}
                    <span className="text-slate-300">{s.keyKarakaPlanets.join(", ")}</span>
                  </div>
                  <div>
                    <strong className="text-amber-300 text-[11px]">Degrees:</strong>{" "}
                    <span className="text-slate-300">{s.recommendedDegrees.join(", ")}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                {s.classicalReasoning}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Tripartite Houses */}
      {activeTab === "tripartite" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            report.tripartiteHouses.fourthHouse,
            report.tripartiteHouses.fifthHouse,
            report.tripartiteHouses.ninthHouse,
          ].map((h) => (
            <div key={h.houseNum} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      {h.sanskritName}
                    </span>
                    <h4 className="text-sm font-black text-slate-100">{h.name}</h4>
                  </div>
                  <span className="text-xs font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-950 border border-purple-800">
                    House #{h.houseNum}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  <strong>Role:</strong> {h.role}
                </p>

                <div className="space-y-1.5 text-xs text-slate-300 mt-3 border-t border-slate-800/60 pt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sign:</span>
                    <span className="font-bold text-slate-200">{h.signName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lord:</span>
                    <span className="font-bold text-slate-200">{h.lord} (in H{h.lordHouseInD1})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Occupants:</span>
                    <span className="font-semibold text-slate-200">{h.occupants.join(", ") || "Vacant (Pure)"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
                {h.synthesis}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: D24 Siddhamsa */}
      {activeTab === "d24" && (
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📜</span>
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Chaturvimshamsha (D24)</span>
                <h3 className="text-base font-black text-slate-100">Higher Learning & Academic Distinction</h3>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
              Distinction Score: {report.d24Siddhamsa.academicDistinctionScore}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">D24 Lagna Sign:</span>
              <span className="text-base font-black text-amber-300">{report.d24Siddhamsa.d24LagnaSign}</span>
              <p className="text-slate-300 mt-1 leading-relaxed">
                Governs innate intellectual retention and capacity to grasp advanced conceptual frameworks.
              </p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">D24 5th House Sign:</span>
              <span className="text-base font-black text-emerald-300">{report.d24Siddhamsa.d24FifthHouseSign}</span>
              <p className="text-slate-300 mt-1 leading-relaxed">
                Research potential: <strong>{report.d24Siddhamsa.researchPotential}</strong>.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-300">K.N. Rao D24 Dictum:</strong> {report.d24Siddhamsa.classicalInterpretation}
          </div>
        </div>
      )}
    </div>
  );
}
