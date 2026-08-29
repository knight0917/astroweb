"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { evaluatePrasnaMarga } from "../engine/prasnaMarga";
import { PrasnaMargaAnalysis } from "../engine/types";
import { RASHI_NAMES } from "../engine/constants";

export default function PrasnaMargaDeck() {
  const { ephemeris } = useAstroStore();
  const [selectedArudhaIdx, setSelectedArudhaIdx] = useState<number>(
    Math.floor(ephemeris.ascendant.siderealLongitude / 30)
  );
  const [activeTab, setActiveTab] = useState<"sutras" | "ashtamangala" | "bhavas" | "trilagna">("sutras");
  const [selectedBhavaNum, setSelectedBhavaNum] = useState<number>(1);

  const report: PrasnaMargaAnalysis = useMemo(() => {
    return evaluatePrasnaMarga(ephemeris, selectedArudhaIdx);
  }, [ephemeris, selectedArudhaIdx]);

  const activeBhava = report.bhavaVerdicts.find((b) => b.bhavaNum === selectedBhavaNum) || report.bhavaVerdicts[0];
  const jeevaActive = report.panchaSutras.find((s) => s.sutraName === "Jeeva Sutra")?.status.includes("Active");

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <h2 className="text-lg font-bold text-slate-100">
              Prasna Marga (प्रश्न मार्ग - 32 Adhyayas) & Prasna Arudha Phala
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Kerala Horary Oracle: 8-Directional Arudha Lagna, Chatra Lagna, Pancha Sutras & Ashtamangala Deva Prashna.
          </p>
        </div>

        {/* Hero Badges */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold">Ashtamangala Score</div>
            <div className="text-xs font-black text-slate-100 flex items-center gap-1 justify-center">
              <span>🪔</span>
              <span>{report.ashtamangala.auspiciousScore}% (No. {report.ashtamangala.ashtamangalaNumber})</span>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-xl border text-center ${
            jeevaActive ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-300" : "bg-slate-900 border-slate-800 text-slate-400"
          }`}>
            <div className="text-[9px] uppercase tracking-wider font-bold">Jeeva Sutra</div>
            <div className="text-xs font-black flex items-center gap-1 justify-center">
              <span>⚡</span>
              <span>{jeevaActive ? "Active (Fulfillment)" : "Inactive"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Arudha Sign Cast Selector */}
      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              🎲 Select Cast Arudha Sign (आरूढ़ लग्न चयन / Cowrie Seed 1–12)
            </span>
            <p className="text-xs text-slate-400">
              Select the direction or sign cast during the Horary consultation to recalculate Pancha Sutras & 12 Arudha Bhavas in real time:
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/50">
            Arudha: {report.triLagnas.arudhaSign}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 pt-1">
          {RASHI_NAMES.map((r, idx) => {
            const isSelected = selectedArudhaIdx === idx;
            const isUdaya = report.triLagnas.udayaSignIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedArudhaIdx(idx)}
                className={`p-2 rounded-xl text-center text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-between border ${
                  isSelected
                    ? "bg-amber-600 text-white border-amber-400 shadow-lg ring-1 ring-amber-400"
                    : isUdaya
                    ? "bg-slate-900 text-cyan-300 border-cyan-500/40 hover:bg-slate-800"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <span className="text-[10px] font-mono opacity-80">{idx + 1}</span>
                <span className="text-[11px] truncate w-full">{r.englishName.slice(0, 4)}</span>
                {isUdaya && <span className="text-[8px] text-cyan-400 font-black">UDAYA</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Horary Outcome Card */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              Prasna Marga Master Horary Verdict (प्रश्न मार्ग महा निर्णय)
            </span>
            <h3 className="text-lg font-black text-slate-100 mt-0.5">
              Udaya ({report.triLagnas.udayaSign}) ⟷ Arudha ({report.triLagnas.arudhaSign}) • {report.triLagnas.relationship}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {report.masterPrasnaVerdict}
          </p>
        </div>

        {/* Quick Diagnostics */}
        <div className="flex flex-col gap-2 min-w-[260px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Chatra Lagna:</span>
            <span className="text-xs font-black text-slate-100 block mt-0.5">
              {report.triLagnas.chatraSign} (Veedhi: {report.triLagnas.veedhiRashi})
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Deva Prashna Status:</span>
            <span className="text-xs font-bold text-emerald-300 block mt-0.5">
              {report.ashtamangala.devaDoshaDetected ? "Deva Dosha Present (Parihara Advised)" : "Daiva Anugraha (Divine Grace Active)"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("sutras")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "sutras"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          ⚡ Pancha Sutras (पञ्च सूत्र)
        </button>
        <button
          onClick={() => setActiveTab("ashtamangala")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "ashtamangala"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🪔 Ashtamangala & Deva Prashna
        </button>
        <button
          onClick={() => setActiveTab("bhavas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "bhavas"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🏛️ 12 Bhavas Arudha Phala
        </button>
        <button
          onClick={() => setActiveTab("trilagna")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "trilagna"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          🔮 Tri-Lagna & Veedhi Path
        </button>
      </div>

      {/* TAB 1: PANCHA SUTRAS */}
      {activeTab === "sutras" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Pancha Sutras Diagnostics (Prasna Marga Adhyaya 8)</h4>
            <p className="text-xs text-slate-400">
              The 5 supreme mathematical sutras determining query fruition, vitality, friction, and root cause.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.panchaSutras.map((sutra, idx) => {
              const isActive = sutra.status.includes("Active");
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                    isActive
                      ? sutra.isFavorable
                        ? "bg-slate-950 border-emerald-500/40 shadow-xl ring-1 ring-emerald-500/30"
                        : "bg-slate-950 border-rose-500/40 shadow-xl ring-1 ring-rose-500/30"
                      : "bg-slate-950/50 border-slate-800 opacity-60"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                          Sutra #{idx + 1}
                        </span>
                        <h4 className="text-sm font-black text-slate-100 mt-0.5">{sutra.sanskritName}</h4>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                          isActive
                            ? sutra.isFavorable
                              ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                              : "bg-rose-950 text-rose-300 border-rose-800"
                            : "bg-slate-900 text-slate-400 border-slate-800"
                        }`}
                      >
                        {sutra.status}
                      </span>
                    </div>

                    <div className="mt-3 text-xs text-slate-300 leading-relaxed">
                      {sutra.diagnosticVerdict}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-amber-300/90 font-mono">
                    📜 {sutra.classicalShloka}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ASHTAMANGALA & DEVA PRASHNA */}
      {activeTab === "ashtamangala" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Ashtamangala Sanctuary */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Kerala Ashtamangala Prasna (अष्टमंगल विधान)
              </span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                Ashtamangala Number: {report.ashtamangala.ashtamangalaNumber} • Sanctity: {report.ashtamangala.auspiciousScore}%
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">🪔 Deepa Lakshana (Flame Diagnostic):</span>
                <p className="text-slate-200">{report.ashtamangala.deepaLakshana}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">🌿 Prescribed Kerala Parihara:</span>
                <p className="text-slate-200">{report.ashtamangala.keralaParihara}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Query Sanctity & Divine Favor:</span>
                <span className="text-amber-400">{report.ashtamangala.auspiciousScore}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${report.ashtamangala.auspiciousScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Deva Dosha & Abhichara Shield */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Deva Prashna & Shatru Dosha (दैव एवं शत्रु बाधा विचार)
              </span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                Spiritual & Karmic Diagnostic
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className={`p-3.5 rounded-xl border ${
                report.ashtamangala.devaDoshaDetected ? "bg-amber-950/30 border-amber-800/50 text-amber-200" : "bg-emerald-950/20 border-emerald-800/40 text-emerald-200"
              }`}>
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <span>🏛️</span>
                  <span>Deva Dosha (Kula Devata Status):</span>
                </div>
                <p className="text-[11px] leading-relaxed">{report.ashtamangala.devaDoshaDetails}</p>
              </div>

              <div className={`p-3.5 rounded-xl border ${
                report.ashtamangala.abhicharaDetected ? "bg-rose-950/30 border-rose-800/50 text-rose-200" : "bg-emerald-950/20 border-emerald-800/40 text-emerald-200"
              }`}>
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <span>🛡️</span>
                  <span>Abhichara / Shatru Dosha (Psychic Shield):</span>
                </div>
                <p className="text-[11px] leading-relaxed">{report.ashtamangala.abhicharaDetails}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 12 BHAVAS ARUDHA PHALA */}
      {activeTab === "bhavas" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bhava Selector */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Select Query Topic (आरूढ़ भाव)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {report.bhavaVerdicts.map((b) => {
                const isSelected = selectedBhavaNum === b.bhavaNum;
                const isImmediate = b.verdict.includes("Immediate");
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
                          isImmediate ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "text-slate-400"
                        }`}
                      >
                        {b.successProbability}%
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-300 font-semibold truncate mt-1">
                      {b.sanskritTitle}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">
                      Lord: {b.arudhaLordName} in H{b.arudhaLordHouse}
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
                  Prasna Arudha Phala (House {activeBhava.bhavaNum})
                </span>
                <h4 className="text-base font-black text-slate-100 mt-0.5">
                  {activeBhava.queryTopic}
                </h4>
                <div className="text-xs text-amber-300 font-medium mt-0.5">
                  Arudha Lord: {activeBhava.arudhaLordName} placed in House {activeBhava.arudhaLordHouse} from Arudha
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Verdict & Probability</span>
                <span className="text-xs font-black text-amber-300">{activeBhava.verdict} ({activeBhava.successProbability}%)</span>
              </div>
            </div>

            {/* Timing Box */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400 font-bold">⏳ Manifestation Timing Window:</span>
              <span className="text-amber-300 font-mono font-bold">{activeBhava.timingWindow}</span>
            </div>

            {/* Classical Phala Box */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1 text-xs">
              <span className="text-amber-300 font-bold block">📜 Kerala Horary Shloka Verdict:</span>
              <p className="text-slate-200 leading-relaxed">{activeBhava.classicalShlokaPhala}</p>
            </div>

            {/* Probability Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Success Probability:</span>
                <span className="text-amber-400">{activeBhava.successProbability}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${activeBhava.successProbability}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRI-LAGNA & VEEDHI PATH */}
      {activeTab === "trilagna" && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-100">Tri-Lagna Horary Trinity (आरूढ़, उदय, छत्र एवं वीथी विचार)</h4>
            <p className="text-xs text-slate-400">
              The fundamental triangulation of the rising sign (Udaya), cast sign (Arudha), and solar umbrella (Chatra).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-center">
              <span className="text-[10px] text-cyan-400 uppercase font-bold">1. Udaya Lagna (उदय)</span>
              <h5 className="text-base font-black text-slate-100">{report.triLagnas.udayaSign}</h5>
              <p className="text-[10px] text-slate-400">Rising sign at query moment</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-center">
              <span className="text-[10px] text-amber-400 uppercase font-bold">2. Arudha Lagna (आरूढ़)</span>
              <h5 className="text-base font-black text-slate-100">{report.triLagnas.arudhaSign}</h5>
              <p className="text-[10px] text-slate-400">Querist's directional orientation / cowrie seed</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-center">
              <span className="text-[10px] text-purple-400 uppercase font-bold">3. Chatra Lagna (छत्र)</span>
              <h5 className="text-base font-black text-slate-100">{report.triLagnas.chatraSign}</h5>
              <p className="text-[10px] text-slate-400">Solar protective umbrella sign</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-center">
              <span className="text-[10px] text-emerald-400 uppercase font-bold">4. Veedhi Rashi (वीथी)</span>
              <h5 className="text-base font-black text-slate-100">{report.triLagnas.veedhiRashi}</h5>
              <p className="text-[10px] text-slate-400">Sun's seasonal road pathway</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
