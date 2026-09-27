"use client";

import React, { useState, useMemo } from "react";
import { useAstroStore } from "../store/useAstroStore";
import { calculateVimshottariDasha, MahadashaNode, AntardashaNode } from "../engine/dasha";
import {
  generateAnnualActivationMasterSummary,
  calculateAnnualHouseProgression,
  AnnualActivationMasterReport
} from "../engine/annualHouseProgression";
import { calculateVedicEphemeris } from "../engine/ephemeris";
import { generateMedhajGocharaMasterReport } from "../engine/medhajGochara";
import { generateMedhajActivationMasterReport } from "../engine/medhajActivation";
import { generateMedhajArudhaMasterReport } from "../engine/medhajArudha";
import { generateMedhajBaadhakMasterReport } from "../engine/medhajBaadhak";
import { generateMedhajInduLagnaMasterReport, SIGN_LORDS } from "../engine/medhajInduLagna";
import { generateMedhajMksPastLifeMasterReport } from "../engine/medhajMksPastLife";
import { generateMedhajRahuKetuTransitMasterReport } from "../engine/medhajRahuKetuTransit";
import { generateAgniTransitLineageReport } from "../engine/agniTransitLineage";
import { generateBhagyaBinduSecretCodeReport } from "../engine/bhagyaBinduSecretCode";
import { generateLifestyleRemediesReport } from "../engine/lifestyleRemediesWayOfLife";
import { evaluateNatalPanchangaDeep } from "../engine/natalPanchangaDeep";
import { generateMakaraKurmaMasterReport } from "../engine/makaraKurmaSaturn";
import { generateKumbhaAquariusMasterReport } from "../engine/kumbhaAquariusRahu";
import { generateMeenaKalapurushaDrishtiMasterReport } from "../engine/meenaKalapurushaDrishti";
import { generateUchhaNeechaAwarenessMasterReport } from "../engine/uchhaNeechaAwareness";
import { generateRishiDrekkanaMasterReport } from "../engine/rishiDrekkanaAwareness";

export default function DashaView() {
  const { ephemeris, currentDate, location, ayanamsha, houseSystem, nodeType } = useAstroStore();

  const [activeTab, setActiveTab] = useState<"vimshottari" | "annual_progression" | "medhaj_gochara" | "medhaj_activation" | "medhaj_arudha" | "medhaj_baadhak" | "medhaj_indu" | "medhaj_mks" | "medhaj_nodal" | "agni_lineage" | "bhagya_secret_code" | "lifestyle_remedies" | "natal_panchanga_deep" | "makara_kurma" | "kumbha_aquarius" | "meena_kalapurusha" | "uchha_neecha" | "rishi_drekkana">("vimshottari");
  const [sambandhaFilter, setSambandhaFilter] = useState<string>("all");
  const [expandedMD, setExpandedMD] = useState<string | null>(null);
  const [expandedAD, setExpandedAD] = useState<string | null>(null);

  const moonLon = ephemeris.planets.Moon.siderealLongitude;
  const birthDate = currentDate;

  const dashaData = useMemo(() => {
    return calculateVimshottariDasha(birthDate, moonLon, new Date());
  }, [birthDate, moonLon]);

  const active = dashaData.activeDasha;

  // Auto-expand current active MD on initial render
  React.useEffect(() => {
    if (active && !expandedMD) {
      setExpandedMD(active.mahadasha.id);
      setExpandedAD(`${active.mahadasha.id}-${active.antardasha.id}`);
    }
  }, [active, expandedMD]);

  // Annual Progression state: user can simulate any age/life year
  const naturalAge = useMemo(() => {
    const diff = new Date().getTime() - birthDate.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 365.2425)));
  }, [birthDate]);

  const [simulatedAge, setSimulatedAge] = useState<number>(naturalAge);

  // Sync simulatedAge if birthDate changes
  React.useEffect(() => {
    setSimulatedAge(naturalAge);
  }, [naturalAge]);

  // Bi-Directional Deep Linking Event Listener (from Chatbot or Quick Pills)
  React.useEffect(() => {
    const handleSwitchTab = (e: any) => {
      const tabId = e.detail?.tabId;
      if (tabId) {
        setActiveTab(tabId);
        const el = document.getElementById("dasha-deck-container");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    window.addEventListener("astro-switch-tab" as any, handleSwitchTab);
    return () => window.removeEventListener("astro-switch-tab" as any, handleSwitchTab);
  }, []);

  const annualReport: AnnualActivationMasterReport = useMemo(() => {
    return generateAnnualActivationMasterSummary(ephemeris, birthDate, simulatedAge);
  }, [ephemeris, birthDate, simulatedAge]);

  const transitEphemeris = useMemo(() => {
    return calculateVedicEphemeris(new Date(), location, ayanamsha, houseSystem, nodeType);
  }, [location, ayanamsha, houseSystem, nodeType]);

  const medhajReport = useMemo(() => {
    return generateMedhajGocharaMasterReport(ephemeris, transitEphemeris, birthDate, new Date());
  }, [ephemeris, transitEphemeris, birthDate]);

  const medhajActivationReport = useMemo(() => {
    return generateMedhajActivationMasterReport(ephemeris, birthDate, new Date());
  }, [ephemeris, birthDate]);

  const medhajArudhaReport = useMemo(() => {
    return generateMedhajArudhaMasterReport(ephemeris, transitEphemeris, birthDate, new Date());
  }, [ephemeris, transitEphemeris, birthDate]);

  const medhajBaadhakReport = useMemo(() => {
    return generateMedhajBaadhakMasterReport(ephemeris, transitEphemeris, birthDate, new Date());
  }, [ephemeris, transitEphemeris, birthDate]);

  const medhajInduReport = useMemo(() => {
    return generateMedhajInduLagnaMasterReport(ephemeris, transitEphemeris, birthDate, new Date());
  }, [ephemeris, transitEphemeris, birthDate]);

  const medhajMksReport = useMemo(() => {
    return generateMedhajMksPastLifeMasterReport(ephemeris, birthDate, new Date());
  }, [ephemeris, birthDate]);

  const medhajNodalReport = useMemo(() => {
    return generateMedhajRahuKetuTransitMasterReport(ephemeris, transitEphemeris, birthDate, new Date());
  }, [ephemeris, transitEphemeris, birthDate]);

  const agniReport = useMemo(() => {
    return generateAgniTransitLineageReport(ephemeris, transitEphemeris);
  }, [ephemeris, transitEphemeris]);

  const bhagyaSecretCodeReport = useMemo(() => {
    return generateBhagyaBinduSecretCodeReport(ephemeris, transitEphemeris);
  }, [ephemeris, transitEphemeris]);

  const deepPanchangaReport = useMemo(() => {
    return evaluateNatalPanchangaDeep(ephemeris);
  }, [ephemeris]);

  const lifestyleRemediesReport = useMemo(() => {
    const currentLord = active?.mahadasha?.name || "Sun";
    return generateLifestyleRemediesReport(ephemeris, currentLord);
  }, [ephemeris, active]);

  const makaraKurmaReport = useMemo(() => {
    return generateMakaraKurmaMasterReport(ephemeris, birthDate.toISOString());
  }, [ephemeris, birthDate]);

  const kumbhaAquariusReport = useMemo(() => {
    return generateKumbhaAquariusMasterReport(ephemeris);
  }, [ephemeris]);

  const meenaKalapurushaReport = useMemo(() => {
    return generateMeenaKalapurushaDrishtiMasterReport(ephemeris);
  }, [ephemeris]);

  const uchhaNeechaReport = useMemo(() => {
    return generateUchhaNeechaAwarenessMasterReport(ephemeris, transitEphemeris);
  }, [ephemeris, transitEphemeris]);

  const rishiDrekkanaReport = useMemo(() => {
    return generateRishiDrekkanaMasterReport(ephemeris, currentDate);
  }, [ephemeris, currentDate]);

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const paka = annualReport.pakaLagna;
  const ann = annualReport.annualProgression;
  const bomb = annualReport.nuclearBomb;
  const tri = annualReport.trikonaResonance;
  const bhagya = annualReport.bhagyodaya;

  return (
    <div id="dasha-deck-container" className="space-y-6">
      {/* 1. Header Banner & View Switcher */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Vedic Temporal Timing & Activation Architecture
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Classical Parashari & Lunar Astro
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Vimshottari Dasha Hierarchy • Annual House Progression (Varsha Chakra) • Paka Lagna Operating Demeanor • 9th House Bhagyodaya
            </p>
          </div>

          {/* Birth Balance Pill */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3.5 py-2 rounded-2xl">
            <span className="text-amber-400 text-xs">☽</span>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold">
                Birth Moon Balance:
              </span>
              <span className="text-xs font-black text-amber-300 font-mono">
                {dashaData.balanceFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800/80 relative z-10">
          <button
            onClick={() => setActiveTab("vimshottari")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "vimshottari"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>⏳</span>
            <span>Vimshottari Dasha Timeline (120 Years BPHS)</span>
          </button>
          <button
            onClick={() => setActiveTab("annual_progression")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "annual_progression"
                ? "bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-purple-200 border border-purple-500/40 shadow-lg shadow-purple-500/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>⚡</span>
            <span>Annual House & Paka Lagna (वर्ष चक्र, पाक लग्न व भाग्योदय)</span>
          </button>
          <button
            onClick={() => setActiveTab("medhaj_gochara")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "medhaj_gochara"
                ? "bg-gradient-to-r from-emerald-500/25 to-teal-500/25 text-emerald-200 border border-emerald-500/40 shadow-lg shadow-emerald-500/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>🪐</span>
            <span>Classical Gochara & Transits (गोचर सिद्धान्त)</span>
          </button>
          <button
            onClick={() => setActiveTab("medhaj_activation")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "medhaj_activation"
                ? "bg-gradient-to-r from-amber-500/25 to-rose-500/25 text-amber-200 border border-amber-500/40 shadow-lg shadow-amber-500/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>⚡</span>
            <span>Planetary Activations & Sambandhas (सक्रियता व संबंध)</span>
          </button>
          <button
            onClick={() => setActiveTab("medhaj_arudha")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "medhaj_arudha"
                ? "bg-gradient-to-r from-indigo-500/25 to-violet-500/25 text-indigo-200 border border-indigo-500/40 shadow-lg shadow-indigo-500/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>🕉️</span>
            <span>Arudha Lagna & Jyotirlinga (आरूढ़ व ज्योतिर्लिंग)</span>
          </button>
          <button
            onClick={() => setActiveTab("medhaj_baadhak")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "medhaj_baadhak"
                ? "bg-gradient-to-r from-red-500/25 to-orange-500/25 text-red-200 border border-red-500/40 shadow-lg shadow-red-500/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>🛡️</span>
            <span>Baadhaka & Obstruction Dynamics (बाधक व राहु-केतु)</span>
          </button>
          <button
            onClick={() => setActiveTab("medhaj_indu")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "medhaj_indu"
                ? "bg-gradient-to-r from-yellow-500/25 to-amber-500/25 text-yellow-200 border border-yellow-500/40 shadow-lg shadow-yellow-500/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>💰</span>
            <span>Indu Lagna Wealth Shastra (इन्दु लग्न एवं धन योग)</span>
          </button>
          <button
            onClick={() => setActiveTab("medhaj_mks")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "medhaj_mks"
                ? "bg-gradient-to-r from-rose-500/25 to-purple-500/25 text-rose-200 border border-rose-500/40 shadow-lg shadow-rose-500/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>💀</span>
            <span>MKS & Past Life Roots (मरण कारक व पूर्वजन्म)</span>
          </button>
          <button
            onClick={() => setActiveTab("medhaj_nodal")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "medhaj_nodal"
                ? "bg-gradient-to-r from-orange-500/25 to-amber-500/25 text-orange-200 border border-orange-500/40 shadow-lg shadow-orange-500/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>🌪️</span>
            <span>Nodal Destiny & Rohini Bhedana (राहु-केतु गोचर)</span>
          </button>
          <button
            onClick={() => setActiveTab("agni_lineage")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "agni_lineage"
                ? "bg-gradient-to-r from-red-500/25 via-amber-500/25 to-yellow-500/25 text-amber-200 border border-amber-500/40 shadow-lg shadow-amber-500/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>🔥</span>
            <span>Agni Transits, Divine Lineage & Temperament (अग्नि गोचर व देव कुल)</span>
          </button>

          <button
            onClick={() => setActiveTab("bhagya_secret_code")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "bhagya_secret_code"
                ? "bg-gradient-to-r from-amber-500/25 via-yellow-500/25 to-orange-500/25 text-amber-200 border border-amber-500/40 shadow-lg shadow-amber-500/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>🎯</span>
            <span>Bhagya Bindu & Secret Code (भाग्य बिन्दु व ग्रह रहस्य)</span>
          </button>

          <button
            onClick={() => setActiveTab("natal_panchanga_deep")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "natal_panchanga_deep"
                ? "bg-gradient-to-r from-cyan-500/25 via-blue-500/25 to-indigo-500/25 text-cyan-200 border border-cyan-500/40 shadow-lg shadow-cyan-500/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>🌌</span>
            <span>Panchanga Blueprint & Dagdha Yoga (पञ्चाङ्ग तत्व व दग्ध राशि)</span>
          </button>

          <button
            onClick={() => setActiveTab("lifestyle_remedies")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "lifestyle_remedies"
                ? "bg-gradient-to-r from-emerald-500/25 via-teal-500/25 to-green-500/25 text-emerald-200 border border-emerald-500/40 shadow-lg shadow-emerald-500/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>🌿</span>
            <span>Lifestyle Remedies (जीवन शैली उपाय - 40-Day Rule)</span>
          </button>

          <button
            onClick={() => setActiveTab("makara_kurma")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "makara_kurma"
                ? "bg-gradient-to-r from-stone-500/25 via-amber-600/25 to-slate-500/25 text-amber-200 border border-amber-500/40 shadow-lg shadow-amber-600/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>🐢</span>
            <span>Makara & Kurma Avatara (मकर राशि, कूर्म व शनि छाया)</span>
          </button>

          <button
            onClick={() => setActiveTab("kumbha_aquarius")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "kumbha_aquarius"
                ? "bg-gradient-to-r from-cyan-600/25 via-blue-600/25 to-teal-500/25 text-cyan-200 border border-cyan-500/40 shadow-lg shadow-cyan-600/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>🏺</span>
            <span>Kumbha & Bhrigu Bindu (कुम्भ राशि, भृगु बिंदु व राहु कवच)</span>
          </button>

          <button
            onClick={() => setActiveTab("meena_kalapurusha")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "meena_kalapurusha"
                ? "bg-gradient-to-r from-blue-600/25 via-indigo-600/25 to-purple-600/25 text-blue-200 border border-blue-500/40 shadow-lg shadow-blue-500/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>🐟</span>
            <span>Meena & Kalapurusha Script (मीन राशि, कालपुरुष लिपि व दृष्टि रहस्य)</span>
          </button>

          <button
            onClick={() => setActiveTab("uchha_neecha")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "uchha_neecha"
                ? "bg-gradient-to-r from-amber-600/25 via-rose-600/25 to-purple-600/25 text-amber-200 border border-amber-500/40 shadow-lg shadow-amber-500/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>⚖️</span>
            <span>Uchha, Neecha &amp; Transit Dynamics (उच्च-नीच चेतना, अंध-बिंदु व गोचर दृष्टि)</span>
          </button>

          <button
            onClick={() => setActiveTab("rishi_drekkana")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "rishi_drekkana"
                ? "bg-gradient-to-r from-emerald-600/25 via-teal-600/25 to-cyan-600/25 text-emerald-200 border border-emerald-500/40 shadow-lg shadow-emerald-500/15"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>🧘</span>
            <span>Three Rishis &amp; Sacred Lineage (त्रि-ऋषि द्रेष्काण, कुलदेवता व 12 राशि अंध-बिंदु)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: VIMSHOTTARI DASHA */}
      {activeTab === "vimshottari" && (
        <div className="space-y-6">
          {/* Active Dasha Hero Card */}
          {active && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-900 border border-amber-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Currently Active Dasha Period (वर्तमान सक्रिय दशा):
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Today: {formatDate(new Date())}
                </span>
              </div>

              {/* MD - AD - PD Flow Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Mahadasha */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-400/50 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Mahadasha (महादशा)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{active.mahadasha.symbol}</span>
                    <span className="text-sm font-black text-slate-100">{active.mahadasha.name}</span>
                    <span className="text-xs text-amber-400 font-semibold">({active.mahadasha.hindiName})</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {formatDate(active.mdStart)} – {formatDate(active.mdEnd)}
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all"
                      style={{ width: `${active.percentageCompleteMD}%` }}
                    ></div>
                  </div>
                  <span className="text-[9px] text-amber-300 font-mono block text-right">
                    {active.percentageCompleteMD}% Elapsed
                  </span>
                </div>

                {/* Antardasha */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-400/50 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Antardasha (अन्तर्दशा)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{active.antardasha.symbol}</span>
                    <span className="text-sm font-black text-slate-100">{active.antardasha.name}</span>
                    <span className="text-xs text-purple-300 font-semibold">({active.antardasha.hindiName})</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {formatDate(active.adStart)} – {formatDate(active.adEnd)}
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-purple-400 h-full rounded-full transition-all"
                      style={{ width: `${active.percentageCompleteAD}%` }}
                    ></div>
                  </div>
                  <span className="text-[9px] text-purple-300 font-mono block text-right">
                    {active.percentageCompleteAD}% Elapsed
                  </span>
                </div>

                {/* Pratyantardasha */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-400/50 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Pratyantardasha (प्रत्यन्तर्दशा)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{active.pratyantardasha.symbol}</span>
                    <span className="text-sm font-black text-slate-100">{active.pratyantardasha.name}</span>
                    <span className="text-xs text-cyan-300 font-semibold">({active.pratyantardasha.hindiName})</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {formatDate(active.pdStart)} – {formatDate(active.pdEnd)}
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-cyan-400 h-full rounded-full transition-all"
                      style={{ width: `${active.percentageCompletePD}%` }}
                    ></div>
                  </div>
                  <span className="text-[9px] text-cyan-300 font-mono block text-right">
                    {active.percentageCompletePD}% Elapsed
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 120-Year Lifetime Visual Bar */}
          <div className="glass-panel p-4 rounded-3xl border border-slate-800 bg-slate-950/60 shadow-lg space-y-2">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
              120-Year Mahadasha Overview Ribbon:
            </span>
            <div className="w-full h-8 rounded-xl bg-slate-900 border border-slate-800 flex overflow-hidden">
              {dashaData.mahadashas.map((md) => {
                const isCurrent = active?.mahadasha.id === md.lord.id;
                const flexWeight = md.durationYears;
                return (
                  <div
                    key={md.lord.id}
                    onClick={() => setExpandedMD(md.lord.id)}
                    style={{ flex: flexWeight }}
                    className={`h-full cursor-pointer relative group flex items-center justify-center transition-all ${
                      isCurrent
                        ? "bg-amber-500 text-slate-950 font-black shadow-inner"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-r border-slate-900"
                    }`}
                    title={`${md.lord.name} (${md.durationYears} yrs): ${formatDate(md.startDate)} to ${formatDate(md.endDate)}`}
                  >
                    <span className="text-[10px] truncate px-1">
                      {md.lord.name.substring(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expandable Dasha Hierarchy Accordion */}
          <div className="space-y-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Full 120-Year Planetary Cycles (Expandable):
            </span>
            <div className="space-y-2">
              {dashaData.mahadashas.map((md) => {
                const isMDExpanded = expandedMD === md.lord.id;
                const isCurrentMD = active?.mahadasha.id === md.lord.id;

                return (
                  <div
                    key={md.lord.id}
                    className={`rounded-2xl border transition-all ${
                      isCurrentMD
                        ? "bg-slate-950/90 border-amber-500/50 shadow-md"
                        : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div
                      onClick={() => setExpandedMD(isMDExpanded ? null : md.lord.id)}
                      className="p-3.5 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{md.lord.symbol}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-100">
                              {md.lord.name} Mahadasha
                            </span>
                            <span className="text-xs text-amber-400">({md.lord.hindiName})</span>
                            {isCurrentMD && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                ACTIVE NOW
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            {formatDate(md.startDate)} → {formatDate(md.endDate)} ({md.durationYears} Years)
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{isMDExpanded ? "▲" : "▼"}</span>
                    </div>

                    {isMDExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-800/60 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {md.antardashas.map((ad) => {
                            const adKey = `${md.lord.id}-${ad.lord.id}`;
                            const isADExpanded = expandedAD === adKey;
                            const isCurrentAD = isCurrentMD && active?.antardasha.id === ad.lord.id;

                            return (
                              <div
                                key={ad.lord.id}
                                className={`p-2.5 rounded-xl border transition-all ${
                                  isCurrentAD
                                    ? "bg-purple-950/40 border-purple-400/60"
                                    : "bg-slate-900/50 border-slate-800"
                                }`}
                              >
                                <div
                                  onClick={() => setExpandedAD(isADExpanded ? null : adKey)}
                                  className="flex items-center justify-between cursor-pointer"
                                >
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs">{ad.lord.symbol}</span>
                                      <span className="text-xs font-semibold text-slate-200">
                                        {md.lord.name.substring(0, 3)}-{ad.lord.name}
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400 block">
                                      {formatDate(ad.startDate)} → {formatDate(ad.endDate)}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-400">{isADExpanded ? "▲" : "▼"}</span>
                                </div>

                                {isADExpanded && (
                                  <div className="mt-2 pt-2 border-t border-slate-800 space-y-1">
                                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">
                                      Pratyantardashas (प्रत्यन्तर्दशा):
                                    </span>
                                    <div className="space-y-1">
                                      {ad.pratyantardashas.map((pd) => {
                                        const isCurrentPD = isCurrentAD && active?.pratyantardasha.id === pd.lord.id;
                                        return (
                                          <div
                                            key={pd.lord.id}
                                            className={`flex items-center justify-between text-[10px] px-2 py-1 rounded ${
                                              isCurrentPD
                                                ? "bg-cyan-950/50 border border-cyan-400 text-cyan-200 font-bold"
                                                : "bg-slate-900/60 text-slate-300"
                                            }`}
                                          >
                                            <span>
                                              {pd.lord.symbol} {md.lord.name.substring(0, 2)}-{ad.lord.name.substring(0, 2)}-{pd.lord.name}
                                            </span>
                                            <span className="font-mono text-[9px] text-slate-400">
                                              {formatDate(pd.startDate)} → {formatDate(pd.endDate)}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANNUAL PROGRESSION & PAKA LAGNA */}
      {activeTab === "annual_progression" && (
        <div className="space-y-6">
          {/* Age Simulator Control Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 bg-slate-950/90 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-2">
                  <span>🎯</span>
                  <span>Active Annual Year Simulator (वर्ष चक्र चक्रवर्ती):</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Select or simulate any age to observe exact Varsha Chakra house activation, Trikona resonance, and Nuclear Bomb alerts.
                </p>
              </div>

              {/* Age Display Badge */}
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 border border-purple-500/40 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Completed Age</span>
                  <span className="text-sm font-black text-purple-300 font-mono">{simulatedAge} Yrs</span>
                </div>
                <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-pink-500/40 px-3.5 py-1.5 rounded-xl text-center">
                  <span className="text-[10px] text-pink-300 block font-semibold uppercase">Life Year (Annual)</span>
                  <span className="text-sm font-black text-pink-200 font-mono">{simulatedAge + 1}th Year</span>
                </div>
              </div>
            </div>

            {/* Range Slider */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-mono text-slate-400">Age 0</span>
              <input
                type="range"
                min="0"
                max="84"
                value={simulatedAge}
                onChange={(e) => setSimulatedAge(parseInt(e.target.value, 10))}
                className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <span className="text-xs font-mono text-slate-400">Age 84</span>
            </div>

            {/* Quick Lecture Preset Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Lecture Presets:
              </span>
              <button
                onClick={() => setSimulatedAge(naturalAge)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-all ${
                  simulatedAge === naturalAge
                    ? "bg-purple-600 text-white border-purple-400"
                    : "bg-slate-900 text-slate-300 border-slate-700 hover:border-purple-400"
                }`}
              >
                Today (Age {naturalAge})
              </button>
              <button
                onClick={() => setSimulatedAge(15)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-all ${
                  simulatedAge === 15
                    ? "bg-purple-600 text-white border-purple-400"
                    : "bg-slate-900 text-slate-300 border-slate-700 hover:border-purple-400"
                }`}
              >
                16th Yr (Guru Udaya)
              </button>
              <button
                onClick={() => setSimulatedAge(26)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-all ${
                  simulatedAge === 26
                    ? "bg-purple-600 text-white border-purple-400"
                    : "bg-slate-900 text-slate-300 border-slate-700 hover:border-purple-400"
                }`}
              >
                27th Yr (House 3 Active)
              </button>
              <button
                onClick={() => setSimulatedAge(33)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-all ${
                  simulatedAge === 33
                    ? "bg-purple-600 text-white border-purple-400"
                    : "bg-slate-900 text-slate-300 border-slate-700 hover:border-purple-400"
                }`}
              >
                34th Yr (House 10 Active)
              </button>
              <button
                onClick={() => setSimulatedAge(35)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-all ${
                  simulatedAge === 35
                    ? "bg-purple-600 text-white border-purple-400"
                    : "bg-slate-900 text-slate-300 border-slate-700 hover:border-purple-400"
                }`}
              >
                36th Yr (Saturn Age 36 / H12)
              </button>
              <button
                onClick={() => setSimulatedAge(41)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-all ${
                  simulatedAge === 41
                    ? "bg-purple-600 text-white border-purple-400"
                    : "bg-slate-900 text-slate-300 border-slate-700 hover:border-purple-400"
                }`}
              >
                42nd Yr (Rahu Udaya)
              </button>
            </div>
          </div>

          {/* CARD 1: Paka Lagna (Operating Demeanor vs Core Identity) */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">👤</span>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Operating Self vs. Core Identity: Paka Lagna (पाक लग्न)
                </h3>
                <p className="text-xs text-slate-400">
                  Lecture 1 Principle: 1st house is who you fundamentally are; where Lagna Lord sits is how you actively execute life and career.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Core Identity */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Core Identity (Lagna • House 1)
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Innate Constitution
                  </span>
                </div>
                <div className="text-lg font-black text-slate-100">
                  {paka.lagnaRashiName} Ascendant
                </div>
                <p className="text-xs text-slate-300">
                  Ruled by <strong className="text-amber-300">{paka.lagnesha}</strong>. Governs your natural disposition, core temperament, soul purpose, and physical constitution.
                </p>
              </div>

              {/* Operating Self */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                    Operating Self (Paka Lagna • House {paka.pakaLagnaHouse})
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-200">
                    {paka.pakaLagnaDignity}
                  </span>
                </div>
                <div className="text-lg font-black text-slate-100">
                  {paka.lagnesha} in House {paka.pakaLagnaHouse} ({paka.pakaLagnaRashiName})
                </div>
                <p className="text-xs text-slate-300">
                  Maps to <strong className="text-purple-300">Kalapurusha House {paka.kalapurushaHouseNumber}</strong> ({paka.kalapurushaSignification}).
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  "{paka.operatingSelfBehavior}"
                </p>
              </div>
            </div>

            {/* Philosophical Dignity Note */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-amber-400 block uppercase tracking-wider text-[10px]">
                Classical Sign Dignity & Metaphysics:
              </span>
              <p>{paka.dignityPhilosophicalRationale}</p>
            </div>
          </div>

          {/* CARD 2: Current Annual House Activation Hero */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/40 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-300">
                    Annual House Activation Progression (वर्ष चक्र):
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-3">
                  <span>House {ann.activeHouse} ({ann.rashiName})</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                    Cycle {ann.cycleNumber} • {ann.lifeYear}th Year of Life
                  </span>
                </h3>
              </div>

              {/* Delivery Mode Badge */}
              <div
                className={`px-3.5 py-2 rounded-2xl border text-center ${
                  ann.deliveryMode === "Cruel / Forceful (Kroora)"
                    ? "bg-rose-950/50 border-rose-500/50 text-rose-200"
                    : ann.deliveryMode === "Benefic (Shubha)"
                    ? "bg-emerald-950/50 border-emerald-500/50 text-emerald-200"
                    : "bg-amber-950/50 border-amber-500/50 text-amber-200"
                }`}
              >
                <span className="text-[10px] block uppercase font-bold tracking-wider opacity-80">Delivery Mode</span>
                <span className="text-xs font-black">{ann.deliveryMode}</span>
              </div>
            </div>

            {/* Assessment Hierarchy: 1. Residents -> 2. Lord -> 3. Aspects */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  1. Resident Grahas (Direct Drivers)
                </span>
                <span className="text-sm font-black text-slate-100">
                  {ann.residentPlanets.length > 0 ? ann.residentPlanets.join(", ") : "None (Empty House)"}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {ann.residentPlanets.length > 0 ? "Delivers visceral, immediate events" : "Operates purely through dispositor"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  2. House Lord & Dignity
                </span>
                <span className="text-sm font-black text-slate-100">
                  {ann.houseLord} in H{ann.lordHouse}
                </span>
                <span className="text-[10px] text-amber-300 block">
                  {ann.lordDignity}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  3. Incoming Drishti (Aspects)
                </span>
                <span className="text-sm font-black text-slate-100 truncate block">
                  {ann.incomingAspectingPlanets.length > 0
                    ? ann.incomingAspectingPlanets.map((a) => a.planet).join(", ")
                    : "None"}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  External modifying rays
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              {ann.deliveryExplanation}
            </p>
          </div>

          {/* CARD 3: Nuclear Bomb Nodal Alert Banner */}
          {bomb.isNuclearBombYear ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/70 via-red-950/60 to-slate-950 border border-red-500/60 shadow-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">💥</span>
                <span className="text-xs font-black uppercase tracking-wider text-rose-300">
                  {bomb.warningTitle} ({bomb.triggerType})
                </span>
              </div>
              <p className="text-xs text-rose-100 leading-relaxed">
                {bomb.warningDescription}
              </p>
              <div className="pt-1 text-[11px] text-rose-300 font-medium">
                <strong>Karmic Direction:</strong> {bomb.karmicActionAdvice}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span>🛡️</span>
                <span>Nodal Geometry Status: Operating outside volatile Rahu-Ketu square sectors.</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">STABLE FLOW</span>
            </div>
          )}

          {/* CARD 4: Simultaneous Trikona Resonance */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔺</span>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    Simultaneous Trine Activation (Trikona Resonance)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Lecture 2 Principle: Whenever ANY house activates, all 3 houses of its corresponding Trikona energize concurrently!
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {tri.karmicProtectionLevel}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-cyan-300 uppercase tracking-wider">
                  Active Circuit: {tri.trikonaCategory}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {tri.trikonaHouses.map((hNum) => {
                  const isActive = hNum === ann.activeHouse;
                  return (
                    <div
                      key={hNum}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                        isActive
                          ? "bg-cyan-500/20 text-cyan-200 border-cyan-400"
                          : "bg-slate-950 text-slate-400 border-slate-800"
                      }`}
                    >
                      House {hNum} {isActive ? "(Primary)" : "(Resonant)"}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-300">{tri.activeTrineHousesDescription}</p>
              <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                {tri.protectionExplanation}
              </p>
            </div>
          </div>

          {/* CARD 5: 9th House Bhagyodaya & 12-Year Graha Udaya Grid */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌟</span>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  9th House Bhagyodaya & 12-Year Planetary Awakening Waves (Graha Udaya)
                </h3>
                <p className="text-xs text-slate-400">
                  Audits 9th house fortune rise timing and tracks recurring activation cycles ($Base + 12k$).
                </p>
              </div>
            </div>

            {/* 4-Pillar Bhagyodaya Summary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                    9th House Fortune Awakening (भाग्योदय):
                  </span>
                  <div className="text-base font-black text-slate-100">
                    House 9 in {bhagya.ninthHouseSignName} • Ruled by {bhagya.ninthHouseLord} in H{bhagya.ninthLordHouse} ({bhagya.ninthLordDignity})
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Primary Fortune Rise</span>
                  <span className="text-lg font-black text-amber-300 font-mono">Age {bhagya.primaryBhagyodayaAge}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="text-slate-400">Recurring 12-Year Fortune Waves:</span>
                {bhagya.secondaryBhagyodayaAges.map((ageVal) => (
                  <span
                    key={ageVal}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                      simulatedAge === ageVal || simulatedAge + 1 === ageVal
                        ? "bg-amber-500 text-slate-950 font-black"
                        : "bg-slate-900 text-amber-300 border border-slate-700"
                    }`}
                  >
                    Age {ageVal}
                  </span>
                ))}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                {bhagya.synthesisSummary}
              </p>
            </div>

            {/* All 9 Grahas Udaya Waves */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                The 9 Grahas Awakening Waves (+12-Year Addition Rule):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {annualReport.grahaUdaya.map((m) => {
                  const isActiveNow = m.isCurrentlyActiveWave;
                  return (
                    <div
                      key={m.planet}
                      className={`p-3 rounded-xl border transition-all ${
                        isActiveNow
                          ? "bg-gradient-to-r from-amber-950/40 to-purple-950/40 border-amber-400/60 shadow-md"
                          : "bg-slate-900/50 border-slate-800/80"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-100">{m.planet}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            isActiveNow
                              ? "bg-amber-500 text-slate-950 font-black animate-pulse"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          Base: Age {m.baseAwakeningAge}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate" title={m.signification}>
                        {m.signification}
                      </span>
                      <div className="text-[9px] font-mono text-purple-300 mt-1 truncate">
                        Waves: {m.recurringCycles.slice(0, 5).join(", ")}...
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CARD 6: Cyclic Planetary Returns */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🪐</span>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Cyclic Planetary Returns (Gochara Returns)
                </h3>
                <p className="text-xs text-slate-400">
                  Lecture 2 Principle: Returns to natal zodiac signs reset major biological and karmic loops.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Solar Return */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Solar Return (Varshaphala)
                </span>
                <span className="text-sm font-black text-slate-100">Every 1 Year (~365d)</span>
                <span className="text-[10px] text-slate-400 block">
                  Currently in Solar Year {annualReport.planetaryReturns.solarReturnCurrentYear}
                </span>
              </div>

              {/* Jupiter Return */}
              <div
                className={`p-3 rounded-xl border space-y-1 ${
                  annualReport.planetaryReturns.isJupiterReturnActive
                    ? "bg-yellow-950/40 border-yellow-400/60"
                    : "bg-slate-900/80 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-yellow-300 uppercase tracking-wider block">
                    Jupiter Return (Guru)
                  </span>
                  {annualReport.planetaryReturns.isJupiterReturnActive && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300">
                      ACTIVE
                    </span>
                  )}
                </div>
                <span className="text-sm font-black text-slate-100">Every 12 Years</span>
                <span className="text-[10px] text-slate-400 block">
                  Ages: 12, 24, 36, 48, 60, 72
                </span>
              </div>

              {/* Saturn Return */}
              <div
                className={`p-3 rounded-xl border space-y-1 ${
                  annualReport.planetaryReturns.isSaturnReturnActive
                    ? "bg-blue-950/40 border-blue-400/60"
                    : "bg-slate-900/80 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">
                    Saturn Return (Shani)
                  </span>
                  {annualReport.planetaryReturns.isSaturnReturnActive && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      ACTIVE
                    </span>
                  )}
                </div>
                <span className="text-sm font-black text-slate-100">Every ~30 Years</span>
                <span className="text-[10px] text-slate-400 block">
                  Ages: ~30, ~60, ~90 (Karmic structural maturity)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-purple-300 block uppercase tracking-wider text-[10px]">
                Nodal Return (Rahu-Ketu):
              </span>
              <p>
                Transiting nodes complete a full zodiacal cycle every ~18.5 years (Ages ~18.5, ~37, ~55.5). When active, the soul encounters profound karmic course-corrections.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLASSICAL GOCHARA & PLANETARY TRANSITS */}
      {activeTab === "medhaj_gochara" && (
        <div className="space-y-6">
          {/* Executive Overview Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/40 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪐</span>
                <div>
                  <h3 className="text-base font-bold text-emerald-200">
                    Classical Planetary Transits & House Activation Engine
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Gochara Shastra: Surya Torchlight • Chandra Mental Matrix • Shukra Sanjeevani • Mangala Desire Drishti • Guru 20-Year Era • Somatic Sade Sati • Inverted Nodes • Outer Planets
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300">
                Live Transit Ephemeris
              </span>
            </div>

            {/* Quick Status Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-amber-400 block font-bold">☀️ Sun Torchlight</span>
                <span className="text-slate-200 font-medium">H{medhajReport.sun.occupiedHouseFromLagna} ➔ H{medhajReport.sun.torchlightHouseFromLagna}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-sky-400 block font-bold">🌙 Moon Mind State</span>
                <span className="text-slate-200 font-medium">H{medhajReport.moon.transitHouseFromLagna} ({medhajReport.moon.transitSignName})</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-pink-400 block font-bold">🌸 Venus Star Phase</span>
                <span className="text-slate-200 font-medium">{medhajReport.venus.starPhase.split(" ")[0]} Star</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-blue-400 block font-bold">⚖️ Sade Sati Status</span>
                <span className="text-slate-200 font-medium">
                  {medhajReport.saturn.sadeSatiSomaticPhase.isSadeSatiActive ? `Phase ${medhajReport.saturn.sadeSatiSomaticPhase.phaseNumber}` : "Dormant"}
                </span>
              </div>
            </div>
          </div>

          {/* Grid of Session Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Surya Torchlight */}
            <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 bg-slate-950/90 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>☀️</span>
                  <span>Surya Torchlight & Retrogression</span>
                </span>
                {medhajReport.sun.isSankrantiActive && (
                  <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    SANKRANTI ACTIVE
                  </span>
                )}
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-slate-300">
                    <span className="text-slate-400">Occupied (Theater):</span>{" "}
                    <span className="font-bold text-amber-300">House {medhajReport.sun.occupiedHouseFromLagna}</span> ({medhajReport.sun.occupiedSignName})
                  </div>
                  <div className="text-slate-300">
                    <span className="text-amber-400 font-bold">Torchlight (Focus):</span>{" "}
                    <span className="font-bold text-yellow-300">House {medhajReport.sun.torchlightHouseFromLagna}</span> ({medhajReport.sun.torchlightSignName})
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{medhajReport.sun.torchlightOutcomeDirective}</p>
                </div>
                {medhajReport.sun.retrogressionChestabalaTrigger.retrogradesTriggered.length > 0 && (
                  <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200">
                    <span className="font-bold">6/7/8 Chesthabala Retrogression:</span>{" "}
                    {medhajReport.sun.retrogressionChestabalaTrigger.retrogradesTriggered.join(", ")}
                  </div>
                )}
                <p className="text-[10px] text-slate-500 italic">{medhajReport.sun.ramicDharmaArchetype}</p>
              </div>
            </div>

            {/* 2. Moon Daily Mental Matrix */}
            <div className="glass-panel p-4 rounded-2xl border border-sky-500/30 bg-slate-950/90 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>🌙</span>
                  <span>Chandra Daily Mental State</span>
                </span>
                {medhajReport.moon.isPeakDayKuladeepak ? (
                  <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    KULADEEPAK PEAK DAY
                  </span>
                ) : medhajReport.moon.karmicAnxietyAlert ? (
                  <span className="text-[9px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                    H8 SCORPIO CAUTION
                  </span>
                ) : null}
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-sky-300">{medhajReport.moon.mentalStateTheme}</div>
                  <div className="text-[11px] text-slate-300">
                    <span className="text-slate-400">Focus:</span> {medhajReport.moon.dailyFocusDomain}
                  </div>
                  <p className="text-[11px] text-sky-200/90 mt-1 bg-sky-950/30 p-2 rounded-lg border border-sky-800/40">
                    {medhajReport.moon.transitAdvice}
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Sign: <span className="text-sky-300 font-semibold">{medhajReport.moon.transitSignName}</span></span>
                  <span>Nakshatra: <span className="text-amber-300 font-semibold">{medhajReport.moon.transitNakshatra}</span></span>
                </div>
              </div>
            </div>

            {/* 3. Venus Shukra Sanjeevani & Ancestral Star */}
            <div className="glass-panel p-4 rounded-2xl border border-pink-500/30 bg-slate-950/90 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>🌸</span>
                  <span>Shukra Sanjeevani & Star Phase</span>
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold">
                  {medhajReport.venus.starPhase}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <p className="text-[11px] text-pink-200">{medhajReport.venus.ancestralOversight}</p>
                  <p className="text-[11px] text-slate-300">{medhajReport.venus.houseTransitScript}</p>
                </div>
                {medhajReport.venus.activeOverlays.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">Contact Overlays:</span>
                    {medhajReport.venus.activeOverlays.map((o, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-pink-950/30 border border-pink-500/30 text-[11px]">
                        <span className="font-bold text-pink-300">Venus over Natal {o.natalPlanet}:</span>{" "}
                        <span className="text-slate-300">{o.transitEffect}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Mars Mangala Special Desire Aspects */}
            <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 bg-slate-950/90 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>🔥</span>
                  <span>Mangala Special Desire Drishti</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  Occupies H{medhajReport.mars.transitHouseFromLagna} ({medhajReport.mars.transitSignName})
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <p className="text-[11px] text-slate-300">{medhajReport.mars.houseTransitBehavior}</p>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Desire & Urgency Aspects (4th, 7th, 8th):</span>
                  {medhajReport.mars.specialDesireAspects.map((a, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] space-y-0.5">
                      <div className="font-bold text-amber-300">{a.aspect}th Aspect onto House {a.targetHouse} ({a.targetSignName})</div>
                      <p className="text-slate-400 text-[10px]">{a.desireTheme}</p>
                    </div>
                  ))}
                </div>
                {medhajReport.mars.activeOverlays.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Natal Contact Overlays:</span>
                    {medhajReport.mars.activeOverlays.map((o, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-rose-950/30 border border-rose-500/30 text-[11px]">
                        <span className="font-bold text-rose-300">Mars over Natal {o.natalPlanet}:</span>{" "}
                        <span className="text-slate-300">{o.transitEffect}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 5. Jupiter Guru Hemispheres & Great Cycle */}
            <div className="glass-panel p-4 rounded-2xl border border-yellow-500/30 bg-slate-950/90 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-yellow-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>⭐</span>
                  <span>Guru Hemispheres & 20-Year Era</span>
                </span>
                {medhajReport.jupiter.isKharmasActive && (
                  <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold animate-pulse">
                    KHARMAS ACTIVE
                  </span>
                )}
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-yellow-300">{medhajReport.jupiter.hemisphere}</div>
                  <p className="text-[11px] text-slate-300">{medhajReport.jupiter.hemisphereDirective}</p>
                </div>
                {medhajReport.jupiter.isKharmasActive && (
                  <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200">
                    {medhajReport.jupiter.kharmasGuidance}
                  </div>
                )}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
                  <span className="font-bold text-amber-300 block mb-0.5">20-Year Great Cycle ("Abode of God"):</span>
                  {medhajReport.jupiter.guruShani20YearCycle.eraKarmicTheme}
                </div>
              </div>
            </div>

            {/* 6. Saturn Shani Somatic Sade Sati & Arudha Lagna */}
            <div className="glass-panel p-4 rounded-2xl border border-blue-500/30 bg-slate-950/90 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>⚖️</span>
                  <span>Shani Somatics & Arudha Lagna</span>
                </span>
                {medhajReport.saturn.transitOverArudhaLagna.isSaturnOnAL && (
                  <span className="text-[9px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold animate-pulse">
                    TRANSIT ON AL
                  </span>
                )}
              </div>
              <div className="space-y-2 text-xs">
                {medhajReport.saturn.transitOverArudhaLagna.isSaturnOnAL && (
                  <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-[11px] text-rose-200 font-medium">
                    {medhajReport.saturn.transitOverArudhaLagna.prestigeResetWarning}
                  </div>
                )}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-300">Somatic Sade Sati Anatomy:</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {medhajReport.saturn.sadeSatiSomaticPhase.isSadeSatiActive ? `Phase ${medhajReport.saturn.sadeSatiSomaticPhase.phaseNumber}` : "Dormant"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">{medhajReport.saturn.sadeSatiSomaticPhase.somaticManifestation}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
                  <span className="text-blue-300 font-semibold">{medhajReport.saturn.kantakaShani.relationshipTestWarning}</span>
                </div>
                <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1.5 flex justify-between">
                  <span>{medhajReport.saturn.humanFoundation90YearCycle.currentCycle}</span>
                  <span className="text-blue-300 font-bold">{medhajReport.saturn.humanFoundation90YearCycle.completedAge} Yrs</span>
                </div>
              </div>
            </div>

            {/* 7. Rahu-Ketu Karmic Helix & Inverted Returns */}
            <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 bg-slate-950/90 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>🌀</span>
                  <span>Nodal Helix & Inverted Returns</span>
                </span>
                {medhajReport.nodes.invertedNodalReturn.is27thYearPivot && (
                  <span className="text-[9px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold animate-pulse">
                    AGE 27 NODAL PIVOT
                  </span>
                )}
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <p className="text-[11px] text-purple-200">{medhajReport.nodes.invertedNodalReturn.pivotDescription}</p>
                  <p className="text-[11px] text-slate-400">{medhajReport.nodes.activeAgeSpan.spanAdvice}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 rounded bg-purple-950/20 border border-purple-800/30">
                    <span className="font-bold text-purple-300 block">Ketu Tail:</span>
                    <span className="text-slate-400">Contracts, reduces to zero. Clinging forces loss.</span>
                  </div>
                  <div className="p-2 rounded bg-purple-950/20 border border-purple-800/30">
                    <span className="font-bold text-purple-300 block">Rahu Head:</span>
                    <span className="text-slate-400">Amplifies, insatiable worldly desires & Maya.</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 italic">{medhajReport.nodes.kalaSarpaShivaRemedy}</p>
              </div>
            </div>

            {/* 8. Generational Outer Planets Transits */}
            <div className="glass-panel p-4 rounded-2xl border border-indigo-500/30 bg-slate-950/90 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>🌌</span>
                  <span>Generational Outer Planets</span>
                </span>
                <span className="text-[10px] text-slate-400">Civilizational Telemetry</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                  <span className="font-bold text-cyan-300 text-[11px]">Uranus (Harshal) in H{medhajReport.outerPlanets.uranusHarshal.transitHouseFromLagna} ({medhajReport.outerPlanets.uranusHarshal.transitSignName}):</span>
                  <p className="text-[10px] text-slate-400">{medhajReport.outerPlanets.uranusHarshal.lightningDisruptionAdvice}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                  <span className="font-bold text-blue-300 text-[11px]">Neptune (Varuna) in H{medhajReport.outerPlanets.neptuneVaruna.transitHouseFromLagna} ({medhajReport.outerPlanets.neptuneVaruna.transitSignName}):</span>
                  <p className="text-[10px] text-slate-400">{medhajReport.outerPlanets.neptuneVaruna.spiritualTruthVsIllusion}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                  <span className="font-bold text-purple-300 text-[11px]">Pluto (Yama) in H{medhajReport.outerPlanets.plutoYama.transitHouseFromLagna} ({medhajReport.outerPlanets.plutoYama.transitSignName}):</span>
                  <p className="text-[10px] text-slate-400">{medhajReport.outerPlanets.plutoYama.institutionalDemolitionFocus}</p>
                </div>
                {medhajReport.outerPlanets.majorNatalAspects.length > 0 && (
                  <div className="p-2 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-[10px] text-indigo-200">
                    <span className="font-bold">Contact Aspects:</span> {medhajReport.outerPlanets.majorNatalAspects.join(" • ")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PLANETARY ACTIVATIONS & SAMBANDHAS (SESSIONS 68–70) */}
      {activeTab === "medhaj_activation" && (() => {
        const act = medhajActivationReport;
        const sunSaturn = act.sunSaturn;
        const jupKetu = act.jupiterKetuTwelfth;
        const marsAct = act.marsActivation;
        const manglik = marsAct.manglikYogaAnalysis;

        const filteredSambandhas = marsAct.geometricSambandhas.filter((s) => {
          if (sambandhaFilter === "all") return true;
          if (sambandhaFilter === "kendra") return s.category.startsWith("Kendra");
          if (sambandhaFilter === "trikona") return s.category.startsWith("Trikona");
          if (sambandhaFilter === "feeder") return s.category.startsWith("2/12");
          if (sambandhaFilter === "growth") return s.category.startsWith("3/11");
          if (sambandhaFilter === "friction") return s.category.startsWith("6/8/12");
          return true;
        });

        return (
          <div className="space-y-6">
            {/* Master Activation Hero Banner */}
            <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-950/80 to-purple-950/30 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">⚡</span>
                    <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                      Classical Planetary Activations & Sambandha Architecture
                    </h2>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                      Planetary Sambandhas
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Sun-Saturn Conjunction & Age 33 • 12th from Jupiter & Ketu at Age 25 • Mars Age 28 & 33 • 8/12 Manglik Yoga Paradigm • 5 Geometric Relational Sambandhas
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">Native Current Age</span>
                    <span className="text-xs font-black text-amber-300 font-mono">{act.marsActivation.nativeAge.toFixed(1)} Yrs</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">Manglik Status</span>
                    <span className={`text-xs font-black ${
                      manglik.classification.startsWith("Auspicious")
                        ? "text-emerald-300"
                        : manglik.classification.startsWith("Kuja")
                        ? "text-rose-300"
                        : "text-slate-300"
                    }`}>
                      {manglik.is8of12ConditionMet ? "Auspicious Yoga" : manglik.isManglikPlacement ? "Dosha" : "Non-Manglik"}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">Age 33 Karma Surge</span>
                    <span className={`text-xs font-black ${marsAct.tenthFromMars.isAge33Active ? "text-amber-300 animate-pulse" : "text-slate-300"}`}>
                      {marsAct.tenthFromMars.isAge33Active ? "ACTIVE NOW" : "H" + marsAct.tenthFromMars.houseFromLagna}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 1: SESSION 68 - SUN-SATURN CONJUNCTION */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👑</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <span>Session 68: Activation of Sun-Saturn Conjunction (Surya-Shani Yoga)</span>
                      {sunSaturn.isConjoined && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                          H{sunSaturn.house} • {sunSaturn.signName}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Modality • Gunas • Lower Degree Dominance • Age 33 Sovereign Trigger • Father-Son Divergence • Good vs Bad Fame
                    </p>
                  </div>
                </div>
                {sunSaturn.isConjoined && sunSaturn.isAge33Active && (
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black animate-pulse">
                    AGE 33 TRIGGER ACTIVE
                  </span>
                )}
              </div>

              {sunSaturn.isConjoined ? (
                <div className="space-y-4 text-xs">
                  {/* Top Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Degrees in Sign</span>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-amber-400 font-mono">Sun: {sunSaturn.sunDegreeInSign.toFixed(2)}°</span>
                        <span className="text-blue-400 font-mono">Saturn: {sunSaturn.saturnDegreeInSign.toFixed(2)}°</span>
                      </div>
                      <span className="text-[11px] text-slate-300 font-semibold block">
                        Separation: {sunSaturn.degreeSeparation.toFixed(2)}°
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Lower Degree Dominance</span>
                      <span className="text-xs font-black text-amber-300 block">
                        {sunSaturn.lowerDegreePlanet} Leads the Yoga
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {sunSaturn.dominantTone}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fame & Dignity Classification</span>
                      <span className={`text-xs font-black block ${
                        sunSaturn.fameClassification.startsWith("Good")
                          ? "text-emerald-300"
                          : sunSaturn.fameClassification.startsWith("Bad")
                          ? "text-rose-300"
                          : "text-amber-300"
                      }`}>
                        {sunSaturn.fameClassification}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate" title={sunSaturn.fameAnalysis}>
                        {sunSaturn.saturnDignity}
                      </span>
                    </div>
                  </div>

                  {/* Core Interpretative Panes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/30 space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-300 block flex items-center gap-1.5">
                        <span>⏳</span>
                        <span>Age 33 (32–33rd Year) Conjunction Activation</span>
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {sunSaturn.age33ActivationEvent}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-800/30 space-y-1.5">
                      <span className="text-[11px] font-bold text-blue-300 block flex items-center gap-1.5">
                        <span>👥</span>
                        <span>Father-Son Divergence & Career Trajectory</span>
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {sunSaturn.fatherSonDivergence}
                      </p>
                    </div>
                  </div>

                  {/* Raj Yoga & Shatru Hanta Cards */}
                  <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-800/30 space-y-1.5">
                    <span className="text-[11px] font-bold text-purple-300 block flex items-center gap-1.5">
                      <span>🏛️</span>
                      <span>Paradoxical Sovereign Raj Yoga</span>
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {sunSaturn.rajYogaVerdict}
                    </p>
                  </div>

                  {sunSaturn.isSixthHouseShatruHanta && (
                    <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-600/40 space-y-1.5">
                      <span className="text-[11px] font-bold text-rose-300 block flex items-center gap-1.5">
                        <span>⚔️</span>
                        <span>6th House Shatru Hanta Yoga with Aspect Modifiers</span>
                      </span>
                      <p className="text-[11px] text-rose-100 leading-relaxed">
                        {sunSaturn.shatruHantaDetails.aspectModification}
                      </p>
                      {sunSaturn.shatruHantaDetails.incomingAspects.length > 0 && (
                        <div className="text-[10px] text-slate-400 pt-1">
                          Aspects received: {sunSaturn.shatruHantaDetails.incomingAspects.join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300 font-semibold">
                    <span>ℹ️</span>
                    <span>No Natal Sun-Saturn Conjunction in the Same Sign</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    In your natal chart, the Sun is in House {ephemeris.planets.Sun?.house} and Saturn is in House {ephemeris.planets.Saturn?.house}. While Surya-Shani yoga is not conjoined in a single rashi, classical shastric canons establish that:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-400">
                    <li><strong className="text-slate-300">Lower Degree Dominance:</strong> When Sun and Saturn conjoin, whichever planet has the lower degree sets the primary tone of the life journey.</li>
                    <li><strong className="text-slate-300">Age 33 Decisive Activation:</strong> Sun-Saturn conjunction awakens in the 32nd–33rd year, provoking fateful realignments in the occupied house.</li>
                    <li><strong className="text-slate-300">Fame Canon:</strong> Saturn in Libra, Capricorn, or Aquarius grants lasting honorable fame; Saturn in Aries or Leo induces risk of public controversy or defame.</li>
                    <li><strong className="text-slate-300">6th House Shatru Hanta:</strong> Conjunction in House 6 annihilates adversaries, modified by Jupiter (peaceful surrender), Rahu (intrigue), or Ketu (relentless labor).</li>
                  </ul>
                </div>
              )}
            </div>

            {/* SECTION 2: ACTIVATION OF JUPITER & KETU AT AGE 25 */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🕊️</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <span>Activation of Jupiter & Ketu (12th House Gateways at Age 25)</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Jnana Guarded by Shiva • Karma Phala Tyaga • Fixed Deposit Rule • Disputed Neighbor Rule
                    </p>
                  </div>
                </div>
                {jupKetu.isAge25Active && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black animate-pulse">
                    AGE 25 GATEWAY ACTIVE
                  </span>
                )}
              </div>

              {/* Status Banner */}
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                <span className="font-bold text-amber-300 block mb-1">
                  Age 25 (24–25th Year) Executive Telemetry:
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {jupKetu.age25ExecutiveGuidance}
                </p>
              </div>

              {/* 12th from Jupiter & 12th from Ketu Two-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* 12th from Jupiter */}
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/30 space-y-2">
                  <div className="flex items-center justify-between border-b border-amber-900/40 pb-1.5">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <span>📚</span>
                      <span>12th House from Jupiter (Jnana Gateway)</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      House {jupKetu.twelfthFromJupiter.houseFromLagna} ({jupKetu.twelfthFromJupiter.signName})
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Ruler: <strong className="text-slate-200">{jupKetu.twelfthFromJupiter.lord}</strong> (in House {jupKetu.twelfthFromJupiter.lordPlacementHouse})</span>
                      <span className={jupKetu.twelfthFromJupiter.isConstructive ? "text-emerald-300 font-bold" : "text-amber-400 font-bold"}>
                        {jupKetu.twelfthFromJupiter.lordDignity}
                      </span>
                    </div>
                    <p className="text-slate-300 pt-1 leading-relaxed">
                      {jupKetu.twelfthFromJupiter.manifestationTheme}
                    </p>
                  </div>
                </div>

                {/* 12th from Ketu */}
                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-800/30 space-y-2">
                  <div className="flex items-center justify-between border-b border-purple-900/40 pb-1.5">
                    <span className="font-bold text-purple-300 flex items-center gap-1.5">
                      <span>🔱</span>
                      <span>12th House from Ketu (Moksha & Tyaga)</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      House {jupKetu.twelfthFromKetu.houseFromLagna} ({jupKetu.twelfthFromKetu.signName})
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Ruler: <strong className="text-slate-200">{jupKetu.twelfthFromKetu.lord}</strong> (in House {jupKetu.twelfthFromKetu.lordPlacementHouse})</span>
                      <span className={jupKetu.twelfthFromKetu.isConstructive ? "text-emerald-300 font-bold" : "text-amber-400 font-bold"}>
                        {jupKetu.twelfthFromKetu.lordDignity}
                      </span>
                    </div>
                    <p className="text-slate-300 pt-1 leading-relaxed">
                      {jupKetu.twelfthFromKetu.manifestationTheme}
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Rules: Fixed Deposit & Disputed Neighbor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Fixed Deposit Rule Card */}
                <div className={`p-3.5 rounded-2xl border ${
                  jupKetu.fixedDepositRule.isMatched
                    ? "bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                    : "bg-slate-900/60 border-slate-800"
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-[11px]">
                      <span>💰</span>
                      <span>Fixed Deposit Law (2nd Lord in 12th Sthira Fire Sign)</span>
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                      jupKetu.fixedDepositRule.isMatched
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {jupKetu.fixedDepositRule.isMatched ? "CONFIRMED MATCH" : "CONDITIONS NOT MET"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {jupKetu.fixedDepositRule.explanation}
                  </p>
                </div>

                {/* Disputed Neighbor Rule Card */}
                <div className={`p-3.5 rounded-2xl border ${
                  jupKetu.disputedNeighborRule.isMatched
                    ? "bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-500/10"
                    : "bg-slate-900/60 border-slate-800"
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-rose-300 flex items-center gap-1.5 text-[11px]">
                      <span>🏘️</span>
                      <span>Disputed Neighbor Law (Mars in Gemini in 3rd)</span>
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                      jupKetu.disputedNeighborRule.isMatched
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {jupKetu.disputedNeighborRule.isMatched ? "AFFLICTED / DISPUTED" : "PEACEFUL NEIGHBORHOOD"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {jupKetu.disputedNeighborRule.explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: SESSION 70 - MARS ACTIVATION & 8/12 MANGLIK YOGA */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚔️</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <span>Mars Activation & The 8/12 Manglik Yoga Paradigm</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                        H{manglik.marsHouseFromLagna} • {manglik.marsSignName} ({manglik.element})
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Core Mangal Archetype • Age 27–28 Activation • 10th from Mars Age 33 Karma Surge • 8/12 Auspicious Yoga
                    </p>
                  </div>
                </div>
                {marsAct.isMarsAge28Active && (
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black animate-pulse">
                    MARS AGE 28 ACTIVE
                  </span>
                )}
              </div>

              {/* Mars Timing: Direct Age 28 & 10th House Age 33 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/30 space-y-2">
                  <div className="flex items-center justify-between border-b border-rose-900/40 pb-1.5">
                    <span className="font-bold text-rose-300 flex items-center gap-1.5">
                      <span>⚡</span>
                      <span>Mars Direct Awakening (Ages 27–28)</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Native Mars</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {marsAct.marsAge28Theme}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/30 space-y-2">
                  <div className="flex items-center justify-between border-b border-amber-900/40 pb-1.5">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <span>🎯</span>
                      <span>10th House from Mars: Professional Karma Surge (Age 33)</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      House {marsAct.tenthFromMars.houseFromLagna} ({marsAct.tenthFromMars.signName})
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Kalapurusha Archetype: <strong className="text-amber-200">{marsAct.tenthFromMars.kalapurushaSignification}</strong></span>
                      <span className="text-slate-300">Lord: {marsAct.tenthFromMars.lord}</span>
                    </div>
                    <p className="text-slate-300 pt-1 leading-relaxed">
                      {marsAct.tenthFromMars.careerKarmaSurge}
                    </p>
                  </div>
                </div>
              </div>

              {/* 8/12 Manglik Yoga vs Kuja Dosha Card */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-xs font-bold text-slate-100 block">
                      The 8/12 Manglik Yoga Paradigm (Nadi & Parashari Shastra)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Mars in Houses 1, 2, 4, 7, 8, 12 is beneficial in 8 out of 12 situations!
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                      manglik.classification.startsWith("Auspicious")
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : manglik.classification.startsWith("Kuja")
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                        : "bg-slate-800 text-slate-300 border-slate-700"
                    }`}>
                      {manglik.classification}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                  <div className={`p-2.5 rounded-xl border ${
                    manglik.element === "Fire" ? "bg-amber-950/30 border-amber-500/40 text-amber-200" : "bg-slate-900/60 border-slate-800 text-slate-400"
                  }`}>
                    <span className="font-bold block text-slate-200">1. Fire Signs</span>
                    <span>Aries, Leo, Sag: Mars operates in natural comfort. Auspicious Yoga!</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${
                    manglik.element === "Earth" ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200" : "bg-slate-900/60 border-slate-800 text-slate-400"
                  }`}>
                    <span className="font-bold block text-slate-200">2. Earth Signs</span>
                    <span>Taurus, Virgo, Cap (Bhumi Putra): Exalted energy builds wealth & property.</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${
                    [0, 7].includes(manglik.marsSignIndex) ? "bg-blue-950/30 border-blue-500/40 text-blue-200" : "bg-slate-900/60 border-slate-800 text-slate-400"
                  }`}>
                    <span className="font-bold block text-slate-200">3. Swa-Rashi</span>
                    <span>Aries/Scorpio: Own signs bestow resolute moral courage, cancelling Dosha.</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${
                    manglik.beneficAspectCancellation.isCancelledByAspect ? "bg-purple-950/30 border-purple-500/40 text-purple-200" : "bg-slate-900/60 border-slate-800 text-slate-400"
                  }`}>
                    <span className="font-bold block text-slate-200">4. Benefic Aspects</span>
                    <span>Jupiter, Venus, or Moon aspect instantly pacifies fiery Martian aggression.</span>
                  </div>
                </div>

                {manglik.yogaConditionReasons.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-[11px] text-emerald-300">
                    <span className="font-bold">Active Chart Verifications:</span> {manglik.yogaConditionReasons.join(" • ")}
                  </div>
                )}

                {/* Scorpio Health Alert Card */}
                {manglik.scorpioReproductiveHealthAlert.isScorpioMars && (
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-[11px] text-rose-200 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-rose-300">
                      <span>🩺</span>
                      <span>Scorpio Mars Male Reproductive Health Clinical Guidance</span>
                    </span>
                    <p className="text-slate-300">
                      {manglik.scorpioReproductiveHealthAlert.medicalAdvice}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 4: SESSION 70 - 5 CLASSICAL GEOMETRIC SAMBANDHAS */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📐</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <span>Session 70: 5 Classical Geometric Sambandhas (पंच संबंध मैट्रिक्स)</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Kendra (1/4/7/10) • Trikona (1/5/9) • Feeder (2/12) • Growth (3/11) • Karmic Friction (6/8/12)
                    </p>
                  </div>
                </div>

                {/* Sambandha Filter Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: "all", label: "All Pairs", icon: "🌐" },
                    { id: "kendra", label: "Kendra (1/4/7/10)", icon: "🎯" },
                    { id: "trikona", label: "Trikona (1/5/9)", icon: "🔺" },
                    { id: "feeder", label: "2/12 Feeder", icon: "🌊" },
                    { id: "growth", label: "3/11 Growth", icon: "🌱" },
                    { id: "friction", label: "6/8 Friction", icon: "⚡" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSambandhaFilter(f.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                        sambandhaFilter === f.id
                          ? "bg-amber-500/25 text-amber-200 border border-amber-500/50 shadow-md shadow-amber-500/10"
                          : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                      }`}
                    >
                      <span>{f.icon}</span>
                      <span>{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sambandhas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[480px] overflow-y-auto pr-1">
                {filteredSambandhas.map((pair, idx) => {
                  let badgeStyle = "bg-slate-800 text-slate-300 border-slate-700";
                  if (pair.category.startsWith("Kendra")) {
                    badgeStyle = "bg-rose-500/20 text-rose-300 border-rose-500/30";
                  } else if (pair.category.startsWith("Trikona")) {
                    badgeStyle = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
                  } else if (pair.category.startsWith("2/12")) {
                    badgeStyle = "bg-amber-500/20 text-amber-300 border-amber-500/30";
                  } else if (pair.category.startsWith("3/11")) {
                    badgeStyle = "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
                  } else if (pair.category.startsWith("6/8/12")) {
                    badgeStyle = "bg-purple-500/20 text-purple-300 border-purple-500/30";
                  }

                  return (
                    <div
                      key={`${pair.planet1}-${pair.planet2}-${idx}`}
                      className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span className="text-amber-400">{pair.planet1}</span>
                          <span className="text-slate-500">↔</span>
                          <span className="text-cyan-400">{pair.planet2}</span>
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border font-mono ${badgeStyle}`}>
                          {pair.mutualAxis}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        {pair.category}
                      </span>
                      <p className="text-[10px] text-slate-300 leading-snug">
                        {pair.dynamicPhala}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 5: MEDHAJ ASTRO ARUDHA LAGNA & JYOTIRLINGA (SESSIONS 75–79) */}
      {activeTab === "medhaj_arudha" && (() => {
        const p = medhajArudhaReport.perceptionVsReality;
        const j = medhajArudhaReport.presidingJyotirlinga;
        const s = medhajArudhaReport.supportAndOpposition;
        const t = medhajArudhaReport.tideTheory;
        const w = medhajArudhaReport.wealthAndRajYogas;
        const m = medhajArudhaReport.mokshaDwar;
        const transits = medhajArudhaReport.houseArudhaTransits;

        return (
          <div className="space-y-6">
            {/* Header Hero Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-slate-950 border border-indigo-500/40 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      Classical Jaimini & Vedic Shastra
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      आरूढ़ लग्न, ज्योतिर्लिंग व ज्वार-भाटा सिद्धांत
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-200 via-violet-300 to-purple-200 bg-clip-text text-transparent">
                    Arudha Lagna (AL), Connecting Jyotirlinga & Tide Theory
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    Perception vs. Reality Maya • Coprime Amavasya Jyotirlinga Intersection • 2nd Support & 7th Opposition • High/Low Tide Spiritual Doors • Grand Wealth & Moksha Dwar Dignity
                  </p>
                </div>

                {/* Arudha Lagna Coordinates Pill */}
                <div className="bg-slate-900/90 border border-indigo-500/40 px-4 py-3 rounded-2xl space-y-1 shadow-lg">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] text-slate-400 font-semibold">Physical D1 Lagna:</span>
                    <span className="text-xs font-bold text-amber-300">{p.physicalLagnaSign}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] text-slate-400 font-semibold">Arudha Lagna (AL):</span>
                    <span className="text-xs font-black text-indigo-300">{p.arudhaLagnaSign} (H#{p.arudhaLagnaHouseFromD1})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid 1: Presiding Jyotirlinga Card (Full Width Hero) */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-amber-500/30 shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner shadow-amber-500/20">
                    🔱
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        Session 76: Presiding Jyotirlinga (Cosmic Origin)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
                        Coprime Invariant
                      </span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
                      Lord {j.jyotirlinga.name}
                      <span className="text-sm font-normal text-slate-400">
                        ({j.jyotirlinga.location}, {j.jyotirlinga.state})
                      </span>
                    </h4>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">Connecting Sign:</span>
                  <span className="text-xs font-black text-amber-300 font-mono">
                    {j.commonSignName} ({j.jyotirlinga.sanskritSign})
                  </span>
                </div>
              </div>

              {/* Mathematical Intersection Formula */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-slate-400 font-semibold">
                    📐 Coprime Intersection Formula: <span className="text-indigo-300 font-mono">Trines(AL) ∩ Kendras(Moon)</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Always Unique (1 Intersection in ℤ₁₂)
                  </span>
                </div>
                <div className="text-slate-300 font-mono text-[11px] flex flex-wrap items-center gap-2">
                  <span className="text-indigo-400">AL Trines: [{j.alTrinesSignNames.join(", ")}]</span>
                  <span className="text-slate-500">∩</span>
                  <span className="text-cyan-400">Moon Kendras: [{j.moonKendrasSignNames.join(", ")}]</span>
                  <span className="text-amber-400 font-bold">➔ {j.commonSignName}</span>
                </div>
              </div>

              {/* Shastric Archetype & Sadhana */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                    Deity Archetype
                  </span>
                  <p className="text-slate-200 leading-relaxed text-[11px]">
                    {j.jyotirlinga.deityArchetype}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                    Karmic Dissolution Power
                  </span>
                  <p className="text-slate-200 leading-relaxed text-[11px]">
                    {j.jyotirlinga.dissolutionPower}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                    Ketu Karmic Sadhana
                  </span>
                  <p className="text-slate-200 leading-relaxed text-[11px]">
                    {j.ketuKarmaDissolutionGuidance}
                  </p>
                </div>
              </div>
            </div>

            {/* Grid 2: Perception vs Reality & Support / Opposition */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Perception vs Reality Card */}
              <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🎭</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">
                        Perception vs. Reality (Maya of Image)
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        Session 75: D1 Lagna vs Arudha Lagna (AL)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {p.contrastTheme}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold uppercase block">
                      True Inner Reality (D1 Lagna: {p.physicalLagnaSign})
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {p.internalReality}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase block">
                      Worldly Perception (AL: {p.arudhaLagnaSign}, House #{p.arudhaLagnaHouseFromD1})
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {p.societalPerception}
                    </p>
                  </div>

                  {/* Saturn on AL or Benefics status */}
                  {p.saturnOnALStatus.hasSaturnOnAL && (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                      <span className="text-[10px] text-amber-300 font-bold uppercase flex items-center gap-1.5">
                        <span>🪐</span> Saturn on Arudha Lagna (Session 75 Shani Phala)
                      </span>
                      <p className="text-amber-200/90 leading-relaxed text-[11px]">
                        {p.saturnOnALStatus.perceptionEffect}
                      </p>
                    </div>
                  )}

                  {(p.beneficsOnALStatus.hasJupiterOnAL || p.beneficsOnALStatus.hasVenusOnAL) && (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                      <span className="text-[10px] text-emerald-300 font-bold uppercase flex items-center gap-1.5">
                        <span>✨</span> Benefics on Arudha Lagna (Jupiter / Venus)
                      </span>
                      <p className="text-emerald-200/90 leading-relaxed text-[11px]">
                        {p.beneficsOnALStatus.perceptionEffect}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Support & Opposition Card */}
              <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🛡️</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">
                        Worldly Support & Opposition Matrix
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        Session 75: 2nd from AL (Support) vs 7th from AL (Opposition)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {/* 2nd from AL Support */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-emerald-500/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                        <span>🌱</span> 2nd from AL (Unconditional Sustenance)
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        House #{s.support2ndFromAL.houseFromLagna} ({s.support2ndFromAL.signName}) • Lord: {s.support2ndFromAL.lord}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {s.support2ndFromAL.practicalGuidance}
                    </p>
                    {s.support2ndFromAL.occupyingPlanets.length > 0 && (
                      <span className="text-[10px] text-emerald-300 font-mono block">
                        Occupants: {s.support2ndFromAL.occupyingPlanets.join(", ")}
                      </span>
                    )}
                  </div>

                  {/* 7th from AL Opposition */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-rose-500/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-rose-400 font-bold uppercase flex items-center gap-1.5">
                        <span>⚔️</span> 7th from AL (Worldly Opposition / Friction)
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        House #{s.opposition7thFromAL.houseFromLagna} ({s.opposition7thFromAL.signName}) • Lord: {s.opposition7thFromAL.lord}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {s.opposition7thFromAL.adversaryWarning}
                    </p>
                    {s.opposition7thFromAL.occupyingPlanets.length > 0 && (
                      <span className="text-[10px] text-rose-300 font-mono block">
                        Occupants: {s.opposition7thFromAL.occupyingPlanets.join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Grid 3: Tide Theory Quadrants (Session 77) */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🌊</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      The Tide Theory of Arudha Lagna (Session 77)
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      High Tide (1st & 4th from AL) vs. Low Tide (7th & 10th from AL)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  4 Archetypal Quadrants
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* High Tide 1: AL 1st */}
                <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-cyan-300 font-bold uppercase">
                      🌊 AL (1st House): High Tide
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      House #{t.highTideQuadrant1.houseFromLagna} ({t.highTideQuadrant1.signName})
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-200/80 font-semibold block">
                    Peak External Visibility & Societal Projection
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {t.highTideQuadrant1.psychologicalManifestation}
                  </p>
                </div>

                {/* High Tide 2: 4th from AL */}
                <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-cyan-300 font-bold uppercase">
                      🌊 4th from AL: High Tide
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      House #{t.highTideQuadrant4.houseFromLagna} ({t.highTideQuadrant4.signName})
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-200/80 font-semibold block">
                    Inner Domestic Anchoring & Emotional Sanctuary
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {t.highTideQuadrant4.psychologicalManifestation}
                  </p>
                </div>

                {/* Low Tide 1: 7th from AL (Moksha Dwar) */}
                <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-purple-300 font-bold uppercase">
                      🌙 7th from AL: Low Tide (Moksha Dwar)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      House #{t.lowTideQuadrant7.houseFromLagna} ({t.lowTideQuadrant7.signName})
                    </span>
                  </div>
                  <span className="text-[10px] text-purple-200/80 font-semibold block">
                    Doorway to Liberation & Exit from Public Illusion
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {t.lowTideQuadrant7.psychologicalManifestation}
                  </p>
                </div>

                {/* Low Tide 2: 10th from AL */}
                <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-purple-300 font-bold uppercase">
                      🌙 10th from AL: Low Tide
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      House #{t.lowTideQuadrant10.houseFromLagna} ({t.lowTideQuadrant10.signName})
                    </span>
                  </div>
                  <span className="text-[10px] text-purple-200/80 font-semibold block">
                    Professional Duty Without Ego Attachment
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {t.lowTideQuadrant10.psychologicalManifestation}
                  </p>
                </div>
              </div>
            </div>

            {/* Grid 4: Real Estate, Grand Raj Yogas & Moksha Dwar Dignity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Wealth & Grand Raj Yogas Card */}
              <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">👑</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">
                        Wealth, Real Estate & Grand Raj Yogas
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        Sessions 78 & 79: Properties from AL & Supreme Societal Status
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {/* 4th from AL Property */}
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-amber-400 font-bold uppercase">
                        Tangible Property & Vehicles (4th from AL)
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        H#{w.fourthFromAL.houseFromLagna} ({w.fourthFromAL.signName})
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {w.fourthFromAL.realEstateVerdict}
                    </p>
                  </div>

                  {/* 4th from A9 Father's Land */}
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase">
                        Father's Land & Inheritance (4th from A9)
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        H#{w.fourthFromA9FatherProperty.fourthFromA9HouseFromLagna} ({w.fourthFromA9FatherProperty.fourthFromA9SignName})
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {w.fourthFromA9FatherProperty.fatherPropertyVerdict}
                    </p>
                  </div>

                  {/* 7th from AL Raj Yoga */}
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                      Supreme Status Raj Yoga (7th from AL)
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {w.seventhFromALRajYoga.rajYogaStatus}
                    </p>
                  </div>

                  {/* Maha Raj Yoga in AL Trines */}
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase block">
                      Maha Raj Yoga (Benefics in Trines from AL)
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {w.mahaRajYogaTrines.mahaRajYogaPhala}
                    </p>
                  </div>
                </div>
              </div>

              {/* Moksha Dwar Dignity & Transits Card */}
              <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🚪</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">
                        Moksha Dwar Dignity & Active Pada Transits
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        Sessions 75 & 79: Exit from Maya & House Arudha Transits
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Moksha Dwar Planet Dignities */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-purple-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-purple-300 font-bold uppercase">
                        🚪 7th from AL (Moksha Exit Portal)
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        House #{m.seventhFromALHouseFromLagna} ({m.seventhFromALSignName})
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {m.overallMokshaExitDemeanor}
                    </p>
                    {m.occupyingPlanets.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-slate-800/80">
                        {m.occupyingPlanets.map((op, idx) => (
                          <div key={idx} className="text-[10px] text-slate-300">
                            <span className="font-bold text-amber-300">{op.planet}</span> ({op.dignity}): {op.detachmentPhala}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Transits over House Arudhas */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase block">
                      🪐 Active Transits over Sensitive Arudha Padas (Session 75)
                    </span>
                    {transits.length > 0 ? (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {transits.map((tr, idx) => (
                          <div key={idx} className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-[10px] space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-300">{tr.padaCode} ({tr.padaName})</span>
                              <span className="text-slate-400 font-mono">{tr.transitingPlanets.join(", ")} in {tr.houseSignName}</span>
                            </div>
                            <p className="text-slate-300 leading-tight">{tr.manifestationImpact}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-[11px]">
                        No major planetary transits over sensitive Arudha Padas currently.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 6: BAADHAK THEORY & NODAL TRANSITS (SESSIONS 82, 84, 85) */}
      {activeTab === "medhaj_baadhak" && (() => {
        const b = medhajBaadhakReport;
        const p = b.baadhakaPrimary;
        const ml = b.multiLagnaAudit;
        const rh = b.relativeHouseBaadhakas;
        const aq = b.ariesAquariusProfile;
        const vy = b.viparitaYoga;
        const nt = b.nodalTransits;

        return (
          <div className="space-y-6">
            {/* 1. Hero Header Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-orange-950/30 to-slate-900 border border-red-500/40 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-2xl">🛡️</span>
                    <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">
                      Classical Baadhaka Shastra & Nodal Dynamics (बाधक भाव एवं राहु-केतु)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                    The Sacred Science of Karmic Friction: Multi-Lagna Audits (Physical, Moon, Sun, Paka) • 12-House Relative Baadhaka Matrix • Aquarius 11th Profiles • Viparita Raja Yoga Transformation • 18.5-Year Nodal Returns & Rahu F.E.A.R. Dissolution
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-mono font-bold">
                    Primary: H#{p.houseNumber} ({p.signName}) • {p.lord}
                  </span>
                  <span className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                    vy.viparitaPotentialLevel === "Supreme"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}>
                    Viparita: {vy.viparitaPotentialLevel}
                  </span>
                </div>
              </div>

              {/* 4 Summary Telemetry Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">D1 Ascendant & Modality</span>
                  <div className="text-sm font-bold text-slate-100 flex items-center justify-between">
                    <span>{b.ascendant.signName} ({b.ascendant.sanskritName})</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300">{b.ascendant.modality.split(" ")[0]}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Baadhaka House: #{p.houseNumber} ({p.signName})
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Baadhakesh Lord</span>
                  <div className="text-sm font-bold text-amber-300 flex items-center justify-between">
                    <span>{p.lord}{p.coLord ? ` & ${p.coLord}` : ""}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">Ruler</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Karmic testing & transformation agent
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">18.5-Yr Nodal Cycle</span>
                  <div className="text-sm font-bold text-purple-300 truncate">
                    {nt.nodalCyclePhase.replace(/^[^\s]+\s*/, "")}
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Native Age: {nt.nativeAgeYears} yrs • Axis: {nt.transitRahuSign}-{nt.transitKetuSign}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">F.E.A.R. Metric</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-rose-300">{nt.fearMetricScore}/100</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      nt.fearMetricScore >= 70 ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}>
                      {nt.fearMetricScore >= 70 ? "High Mirage" : "Grounded"}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {nt.fearDiagnostics.slice(0, 38)}...
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Multi-Lagna Baadhaka Audit (Session 84) */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🔍</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      Multi-Lagna Baadhaka Audit Matrix (Session 84)
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Physical ($D_1$), Mental/Emotional (Moon), Soul/Willpower (Sun) & Execution (Paka) Frames
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                  4 Reference Dimensions
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
                {ml.allFrames.map((frame, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">{frame.frame}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {frame.modality.split(" ")[0]}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-300 flex justify-between">
                        <span className="text-slate-400">Reference:</span>
                        <span className="font-semibold text-slate-200">{frame.referenceSignName}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 flex justify-between">
                        <span className="text-slate-400">Baadhaka House:</span>
                        <span className="font-bold text-red-300">H#{frame.baadhakaHouse} ({frame.baadhakaSignName})</span>
                      </div>
                      <div className="text-[11px] text-slate-300 flex justify-between">
                        <span className="text-slate-400">Lord:</span>
                        <span className="font-mono text-amber-200">{frame.primaryLord}{frame.coLord ? ` & ${frame.coLord}` : ""}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 flex justify-between">
                        <span className="text-slate-400">Lord Placement:</span>
                        <span className="font-mono text-cyan-300">H#{frame.baadhakeshPlacement.houseFromLagna} ({frame.baadhakeshPlacement.signName})</span>
                      </div>
                      {frame.occupantsInBaadhaka.length > 0 && (
                        <div className="text-[11px] text-slate-300 flex justify-between">
                          <span className="text-slate-400">Occupants:</span>
                          <span className="font-bold text-rose-300">{frame.occupantsInBaadhaka.join(", ")}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Friction Focus:</span>
                      <p className="text-[11px] text-slate-300 leading-snug">{frame.manifestationFriction}</p>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block pt-1">Resolution:</span>
                      <p className="text-[11px] text-slate-400 leading-snug">{frame.resolutionPathway}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Synthesis Box */}
              <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 flex items-center gap-2.5">
                <span className="text-base">✨</span>
                <span>{ml.synthesis}</span>
              </div>
            </div>

            {/* 3. Viparita Raja Yoga & 1st/5th House Release Telemetry (Sessions 82 & 84) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left: 1st & 5th House Liberation */}
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-amber-500/30 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    <h4 className="text-sm font-bold text-slate-100">
                      Baadhaka Energy Release Telemetry (Sessions 82 & 84)
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                    Vitality & Purva Punya
                  </span>
                </div>

                <div className="space-y-4">
                  {/* 1st House Vitality */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 uppercase">
                        👑 1st House (Lagna Vitality & Charisma)
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {vy.firstHouseAmplificationScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all" style={{ width: `${vy.firstHouseAmplificationScore}%` }}></div>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {vy.firstHouseReleaseManifestation}
                    </p>
                  </div>

                  {/* 5th House Purva Punya */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300 uppercase">
                        🪷 5th House (Creative Genius & Purva Punya)
                      </span>
                      <span className="text-xs font-mono font-bold text-purple-300">
                        {vy.fifthHouseAmplificationScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-full rounded-full transition-all" style={{ width: `${vy.fifthHouseAmplificationScore}%` }}></div>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {vy.fifthHouseReleaseManifestation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Viparita Rationale, Totka Warning & Core Aphorism */}
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-red-500/30 shadow-xl space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🔄</span>
                      <h4 className="text-sm font-bold text-slate-100">
                        Viparita Raja Yoga Mechanics & Karma Law
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-mono">
                      Level: {vy.viparitaPotentialLevel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {vy.viparitaRationale}
                  </p>

                  <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-200 text-xs space-y-1 mb-3">
                    <span className="font-bold flex items-center gap-1.5">
                      <span>⚠️</span> Shastric Invariant (No Superficial Totkas):
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {vy.totkaWarning}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Classical Shastric Aphorism</span>
                  <p className="text-xs italic font-medium text-slate-200">
                    "{vy.coreAphorism}"
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Rahu-Ketu Nodal Transits & F.E.A.R. Radar */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-indigo-500/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🌌</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      Rahu-Ketu Nodal Transits & F.E.A.R. Radar (Session 85)
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      18.5-Year Returns, Inversions, Taurus-Scorpio Axis & Shiva Parihara
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  Nodal Cycle Engine
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Cycle Diagnostics & Baadhaka Crossing */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">Active Nodal Phase:</span>
                    <span className="text-xs font-mono font-bold text-amber-300">{nt.nodalCyclePhase}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Natal Rahu/Ketu:</span>
                      <span className="font-mono text-slate-200">{nt.natalRahuSign} ({nt.natalRahuLongitude}°) / {nt.natalKetuSign}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Transit Rahu/Ketu:</span>
                      <span className="font-mono text-indigo-300">{nt.transitRahuSign} ({nt.transitRahuLongitude}°) / {nt.transitKetuSign}</span>
                    </div>
                  </div>

                  {/* Baadhaka Crossing Alerts */}
                  <div className="space-y-1.5">
                    {nt.isTransitRahuInBaadhaka && (
                      <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-[11px] text-rose-200">
                        ⚡ <strong>Rahu in Baadhaka Bhava:</strong> Massive karmic testing and amplification of desires/anxiety in House #{p.houseNumber}.
                      </div>
                    )}
                    {nt.isTransitKetuInBaadhaka && (
                      <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-[11px] text-purple-200">
                        🚪 <strong>Ketu in Baadhaka Bhava:</strong> Sudden detachment and unburdening of past karmic knots in House #{p.houseNumber}.
                      </div>
                    )}
                    {!nt.isTransitRahuInBaadhaka && !nt.isTransitKetuInBaadhaka && (
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                        Neither node is currently in the primary Baadhaka Bhava. Nodal transit operates peacefully.
                      </div>
                    )}
                  </div>

                  {/* Taurus-Scorpio Axis Interpretation */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                    <span className="font-bold text-amber-300 block">Kalapurusha Axis Alignment:</span>
                    <p className="leading-relaxed">{nt.taurusScorpioInterpretation}</p>
                  </div>
                </div>

                {/* Right: F.E.A.R. Metric & Lord Shiva Sadhana */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-rose-300 block">F.E.A.R. Diagnostic Gauge</span>
                        <span className="text-[10px] text-slate-400">"False Evidence Appearing Real"</span>
                      </div>
                      <span className="text-base font-bold font-mono text-rose-400">{nt.fearMetricScore}/100</span>
                    </div>

                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${
                        nt.fearMetricScore >= 70 ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-emerald-500 to-cyan-500"
                      }`} style={{ width: `${nt.fearMetricScore}%` }}></div>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      {nt.fearDiagnostics}
                    </p>
                  </div>

                  {/* Lord Shiva Sadhana */}
                  <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                      <span>🔱</span> Lord Shiva Parihara Protocol (Session 85 Remedy):
                    </div>
                    <p className="text-[11px] text-slate-200 leading-relaxed">
                      {nt.shivaPariharaProtocol}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Aries-Aquarius 11th Baadhaka Deep Dive & 9 Planetary Modification Profiles */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-amber-500/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🪐</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      Planetary Occupant Archetypes in Baadhaka Bhava
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {aq.airFixedDynamics}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  9 Graha Behavioral Profiles
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {aq.occupantProfiles.map((prof, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border transition-all space-y-2 ${
                    prof.isOccupant
                      ? "bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-500/10"
                      : prof.isLord
                      ? "bg-slate-900/90 border-cyan-500/40"
                      : "bg-slate-900/50 border-slate-800/80"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-100 text-xs">{prof.planet}</span>
                        {prof.isOccupant && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-500/40">
                            Occupant
                          </span>
                        )}
                        {prof.isLord && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/30 text-cyan-300 border border-cyan-500/40">
                            Baadhakesh
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 italic truncate max-w-[120px]">{prof.archetypePattern}</span>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div>
                        <span className="text-rose-400 font-semibold text-[10px] block">Psychological Friction:</span>
                        <p className="text-slate-300 leading-snug">{prof.psychologicalFriction}</p>
                      </div>
                      <div>
                        <span className="text-amber-400 font-semibold text-[10px] block">Karmic Trap:</span>
                        <p className="text-slate-400 leading-snug">{prof.karmaTrap}</p>
                      </div>
                      <div>
                        <span className="text-emerald-400 font-semibold text-[10px] block">Resolution Sadhana:</span>
                        <p className="text-slate-300 leading-snug">{prof.resolutionSadhana}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Relative House Baadhaka 12-House Matrix (Session 82) */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🏛️</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      Relative House Baadhaka 12-House Matrix (Session 82)
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Every House Evaluated as an Independent Reference Frame based on Modality
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  House-to-House Karma Grid
                </span>
              </div>

              {/* Special Intersections Callout */}
              {rh.pivotalIntersections.length > 0 && (
                <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <span>💡</span> Pivotal Astrological Intersections:
                  </span>
                  {rh.pivotalIntersections.map((pi, idx) => (
                    <div key={idx} className="text-[11px] text-slate-300">• {pi}</div>
                  ))}
                </div>
              )}

              {/* 12 House Responsive Table / Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {rh.houses.map((hEntry) => (
                  <div key={hEntry.houseNumber} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-300">
                          H#{hEntry.houseNumber} {hEntry.houseSignName}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {hEntry.modality.split(" ")[0]}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-300">
                        Baadhaka: H#{hEntry.absoluteChartHouseNum} ({hEntry.relativeBaadhakaSignName})
                      </span>
                    </div>

                    <div className="text-[11px] space-y-1">
                      <div className="text-slate-400 flex justify-between">
                        <span>Signification:</span>
                        <span className="font-semibold text-slate-200">{hEntry.livingSignification}</span>
                      </div>
                      <div className="text-slate-400 flex justify-between">
                        <span>Baadhakesh:</span>
                        <span className="font-mono text-amber-300">{hEntry.relativeBaadhakesh}</span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-snug pt-1">
                        {hEntry.obstructionVector}
                      </p>
                      <p className="text-[10px] text-emerald-400/90 leading-snug">
                        <strong>Remedy:</strong> {hEntry.viparitaRemedy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 7: INDU LAGNA WEALTH SHASTRA (इन्दु लग्न) */}
      {activeTab === "medhaj_indu" && (() => {
        const core = medhajInduReport.core;
        const dy = medhajInduReport.dhanaYogas;
        const ss = medhajInduReport.sustainedSupport;
        const ages = medhajInduReport.ageActivations;
        const ar = medhajInduReport.arudhaAlignment;
        const tp = medhajInduReport.transitPortals;

        return (
          <div className="space-y-6">
            {/* 1. Indu Lagna Executive Scorecard & Kala Math Derivation Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-slate-900 border border-amber-500/40 shadow-2xl relative overflow-hidden space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 shadow-inner">💰</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-amber-200">
                        Indu Lagna (इन्दु लग्न) Wealth & Prosperity Shastra
                      </h3>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                        Classical Wealth Shastra
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Classical Moon-Ray (Kala) Planetary Ray Summation • Modulo 12 Moon Offset • Environmental Ease vs Toil
                    </p>
                  </div>
                </div>

                {/* Indu Lagna Status Badge */}
                <div className="flex items-center gap-2 bg-slate-950/80 border border-amber-500/40 px-4 py-2 rounded-2xl">
                  <div className="text-right">
                    <span className="text-[10px] text-amber-400 block font-semibold">
                      Indu Lagna Sign:
                    </span>
                    <span className="text-sm font-black text-amber-200 font-mono">
                      {core.induLagnaSignName} ({core.induLagnaSanskritName}) {core.induLagnaLongitude % 30}°
                    </span>
                  </div>
                  <span className="text-xl">🌙</span>
                </div>
              </div>

              {/* Kala Ray Derivation Flow */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/30 space-y-3">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  ⚙️ Mathematical Kala Ray Derivation (गणना विधि):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block">9th Lord from Lagna</span>
                    <span className="text-xs font-bold text-amber-200">{core.lagnaNinthLord}</span>
                    <span className="text-[11px] font-mono text-cyan-300 block">{core.lagnaNinthKala} Kalas (किरण)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block">9th Lord from Moon</span>
                    <span className="text-xs font-bold text-amber-200">{core.moonNinthLord}</span>
                    <span className="text-[11px] font-mono text-cyan-300 block">{core.moonNinthKala} Kalas (किरण)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block">Total Kalas & Modulo 12</span>
                    <span className="text-xs font-bold text-amber-200">{core.totalKalas} ÷ 12</span>
                    <span className="text-[11px] font-mono text-yellow-300 block">Remainder: {core.remainderKala}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-1">
                    <span className="text-[10px] text-amber-400 block">Count from Natal Moon</span>
                    <span className="text-xs font-black text-amber-100">{core.remainderKala} Signs Forward</span>
                    <span className="text-[11px] font-mono text-amber-300 block">➔ {core.induLagnaSignName}</span>
                  </div>
                </div>
              </div>

              {/* Environmental Dignity & Placement Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">House from D1 Lagna:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-100">House #{core.induLagnaHouseFromD1}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      core.isKendraFromLagna || core.isTrikonaFromLagna
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : core.isDusthanaFromLagna
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}>
                      {core.environmentalDignity.split(" ")[0]}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed pt-1">
                    {core.environmentalDignityExplanation}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Dhana Yoga Grade:</span>
                  <span className="text-sm font-bold text-amber-300 block">{dy.dhanaYogaGrade}</span>
                  <p className="text-[10px] text-slate-300 leading-relaxed pt-1">
                    {dy.dhanaYogaVerdict}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Arudha Lagna (AL) Alignment:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-indigo-300">
                      AL: {ar.arudhaLagnaSignName}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      ar.isInduAlignedWithAL
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-300"
                    }`}>
                      {ar.isInduAlignedWithAL ? "Maya = Satya (100%)" : `${ar.distanceFromAL} Houses Apart`}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed pt-1">
                    {ar.convergenceInterpretation}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Trine & Kendra Dhana Yoga Matrix (Session 87) */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">💎</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      Indu Lagna Dhana Yoga Matrix (Session 87)
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Benefics in Trines (1, 5, 9) & Kendras (1, 4, 7, 10) • 11th House Entrepreneurial Empire Rule
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  Geometric Wealth Portals
                </span>
              </div>

              {/* 11th House Special Entrepreneurial Banner if Applicable */}
              {dy.isInduLagnaIn11thHouse && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-xs text-amber-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <span>🚀</span>
                    <span>SESSION 87 ENTREPRENEURIAL EMPIRE SIGNATURE ACTIVE!</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {dy.entrepreneurial11thVerdict}
                  </p>
                </div>
              )}

              {/* 3 Columns: Indu Occupants, Trine Benefics, Kendra Benefics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Indu Lagna Seated Planets */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-amber-300">Seated in Indu Lagna (1st)</span>
                    <span className="text-[10px] font-mono text-slate-400">{dy.planetsInInduLagna.length} Planets</span>
                  </div>
                  {dy.planetsInInduLagna.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">No planets seated directly in Indu Lagna. Wealth is governed by sign lord {SIGN_LORDS[core.induLagnaRashiIndex]}.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {dy.beneficsInInduLagna.map(b => (
                        <div key={b} className="flex items-center justify-between text-xs p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                          <span className="font-bold text-emerald-300">{b} (Natural Benefic)</span>
                          <span className="text-[10px] font-mono text-emerald-400">Direct Golden Flow</span>
                        </div>
                      ))}
                      {dy.maleficsInInduLagna.map(m => (
                        <div key={m} className="flex items-center justify-between text-xs p-2 rounded-xl bg-amber-950/30 border border-amber-500/30">
                          <span className="font-bold text-amber-300">{m} (Dynamic Energy)</span>
                          <span className="text-[10px] font-mono text-amber-400">Warrior Wealth</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trine Benefics (1, 5, 9) */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-cyan-300">Benefics in Trines (1, 5, 9)</span>
                    <span className="text-[10px] font-mono text-cyan-400">{dy.trineBenefics.length} Benefics</span>
                  </div>
                  {dy.trineBenefics.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">No natural benefics in 5th or 9th from Indu Lagna.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {dy.trineBenefics.map((b, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                          <div>
                            <span className="font-bold text-cyan-200">{b.planet}</span>
                            <span className="text-[10px] text-slate-400 block">in {b.signName} (House #{b.houseFromIndu})</span>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-300">Lakshmi Yoga</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Kendra Benefics (1, 4, 7, 10) */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-purple-300">Benefics in Kendras (1, 4, 7, 10)</span>
                    <span className="text-[10px] font-mono text-purple-400">{dy.kendraBenefics.length} Benefics</span>
                  </div>
                  {dy.kendraBenefics.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">No natural benefics in Kendra angles from Indu Lagna.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {dy.kendraBenefics.map((b, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-purple-950/30 border border-purple-500/30">
                          <div>
                            <span className="font-bold text-purple-200">{b.planet}</span>
                            <span className="text-[10px] text-slate-400 block">in {b.signName} (House #{b.houseFromIndu})</span>
                          </div>
                          <span className="text-[10px] font-mono text-purple-300">Vishnu Pillar</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Rule of Thumb: 2-4-8 Sustained Financial Support Shield (Session 86) */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🛡️</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      Sustained Financial Support Shield (2, 4, 8 Rule of Thumb)
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Session 86 Rule: Occupation of Houses 2, 4, and 8 guarantees timely emergency rescue and unshakeable liquidity
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">Coverage:</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-black ${
                    ss.isSustainedSupportActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : ss.supportCoveragePercentage >= 66
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-slate-800 text-slate-300"
                  }`}>
                    {ss.supportCoveragePercentage}%
                  </span>
                </div>
              </div>

              {/* 3 Lifeline Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* House 2 */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  ss.hasHouse2Occupants
                    ? "bg-emerald-950/20 border-emerald-500/30"
                    : "bg-slate-900/60 border-slate-800"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300">House #2 (Accumulated Assets)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {ss.hasHouse2Occupants ? "Fortified" : "Open"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    <span className="text-slate-400">Occupants: </span>
                    <span className="font-semibold text-slate-100">
                      {ss.house2Occupants.join(", ") || "None"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Governs stored liquid capital, gold, treasury, and immediate sustenance.
                  </p>
                </div>

                {/* House 4 */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  ss.hasHouse4Occupants
                    ? "bg-emerald-950/20 border-emerald-500/30"
                    : "bg-slate-900/60 border-slate-800"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">House #4 (Real Estate & Safety Net)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {ss.hasHouse4Occupants ? "Fortified" : "Open"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    <span className="text-slate-400">Occupants: </span>
                    <span className="font-semibold text-slate-100">
                      {ss.house4Occupants.join(", ") || "None"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Governs physical fixed properties, vehicles, maternal support, and underlying security.
                  </p>
                </div>

                {/* House 8 */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  ss.hasHouse8Occupants
                    ? "bg-emerald-950/20 border-emerald-500/30"
                    : "bg-slate-900/60 border-slate-800"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">House #8 (Emergency Rescue & Liquidity)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {ss.hasHouse8Occupants ? "Fortified" : "Open"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    <span className="text-slate-400">Occupants: </span>
                    <span className="font-semibold text-slate-100">
                      {ss.house8Occupants.join(", ") || "None"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Governs sudden financial windfalls, unearned inheritance, and crisis rescue lifelines.
                  </p>
                </div>
              </div>

              {/* Sustained Support Rule Verdict */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">
                <p className="leading-relaxed">{ss.verdict}</p>
              </div>
            </div>

            {/* 4. Chronological Planetary Activation Age Radar (Session 87) */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">⏱️</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      Chronological Planetary Activation Ages on Indu Lagna (Session 87)
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Ages: Jupiter 16 (+12), Sun 22, Moon 24, Venus 26, Mars 28, Mercury 32, Saturn 36+, Rahu 42, Ketu 48
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
                  <span className="text-[10px] text-slate-400 font-semibold">Current Age:</span>
                  <span className="text-xs font-black text-amber-300 font-mono">
                    {ages.currentAgeYears} Years Old
                  </span>
                </div>
              </div>

              {/* Executive Activation Guidance Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200">
                <p className="leading-relaxed">{ages.executiveGuidance}</p>
              </div>

              {/* 9 Planetary Activation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                {ages.allMilestones.map((ms) => (
                  <div
                    key={ms.planet}
                    className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                      ms.activationStatus === "Currently Active Milestone"
                        ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10"
                        : "bg-slate-900/60 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-300">{ms.planet}</span>
                        {ms.isOccupant && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Occupant
                          </span>
                        )}
                        {ms.isAspecting && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Aspecting
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        ms.activationStatus === "Currently Active Milestone"
                          ? "bg-amber-400 text-slate-950 font-black animate-pulse"
                          : ms.activationStatus === "Upcoming Milestone"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        Age {ms.primaryActivationAge}{ms.recurringCycleYears ? ` (+${ms.recurringCycleYears}y)` : ""}
                      </span>
                    </div>

                    <div className="text-[11px] space-y-1">
                      <div className="text-slate-400 flex justify-between">
                        <span>Domain:</span>
                        <span className="font-semibold text-slate-200 text-right truncate max-w-[180px]">{ms.significance}</span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-snug pt-1">
                        {ms.detailedPhala}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Real-Time Transit Portals Watcher over Indu Lagna (Session 86) */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🪐</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      Real-Time Transit Portals over Indu Lagna (Gochara Activation)
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Transits in Conjunction (1st), Kendras (4, 7, 10), or Trines (5, 9) relative to {core.induLagnaSignName}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                  tp.hasMajorBeneficPortal
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-300"
                }`}>
                  {tp.hasMajorBeneficPortal ? "Major Benefic Window Open" : "Standard Transit Motion"}
                </span>
              </div>

              {/* Transit Portals Grid */}
              {tp.activePortals.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 italic">
                  No major transit planets are currently aspecting or occupying the Indu Lagna Kendra/Trikona axes.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {tp.activePortals.map((portal, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border space-y-2 ${
                        portal.isBenefic
                          ? "bg-emerald-950/20 border-emerald-500/30"
                          : "bg-slate-900/60 border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                        <span className="text-xs font-bold text-amber-300">
                          Transit {portal.planet} in {portal.transitSignName}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                          {portal.relationToIndu}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {portal.impactVerdict}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB 8: MKS & PAST LIFE ROOTS (मरण कारक व पूर्वजन्म) */}
      {activeTab === "medhaj_mks" && (() => {
        const mks = medhajMksReport.mks;
        const auto = medhajMksReport.automobileCockpit;
        const ketu = medhajMksReport.ketuPastLife;
        const sat = medhajMksReport.saturnBoundary;

        return (
          <div className="space-y-6">
            {/* 1. Executive Hero Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900 border border-rose-500/40 shadow-2xl relative overflow-hidden space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-rose-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 shadow-inner">💀</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-rose-200">
                        Marana Karaka Sthana (MKS), Past Life Roots & Cosmic Law
                      </h3>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                        Classical Karmic Shastra
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Planetary Suffocation & Double-Effort Sadhana • The Automobile Metaphor • Inverted Ketu Past-Life Archetype • Saturn's Cosmic Law
                    </p>
                  </div>
                </div>

                {/* MKS Status Pill */}
                <div className="flex items-center gap-2 bg-slate-950/80 border border-rose-500/40 px-4 py-2 rounded-2xl">
                  <div className="text-right">
                    <span className="text-[10px] text-rose-400 block font-semibold">
                      MKS Suffocation Status:
                    </span>
                    <span className="text-sm font-black text-rose-200 font-mono">
                      {mks.hasMksPlanets ? `${mks.totalMksCount} Planet(s) in MKS` : "0 Afflictions (Pure)"}
                    </span>
                  </div>
                  <span className="text-xl">{mks.hasMksPlanets ? "⚠️" : "🛡️"}</span>
                </div>
              </div>

              {/* High-Level Overview Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">MKS Severity Score:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-rose-300 font-mono">{mks.mksSeverityScore}/100</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      mks.hasMksPlanets ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}>
                      {mks.hasMksPlanets ? "Double Labor Active" : "Uninhibited"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug pt-1">
                    {mks.executiveMksVerdict}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Rahu (Google Maps):</span>
                  <span className="text-xs font-bold text-amber-300 block">
                    House #{auto.rahuDestination.house} in {auto.rahuDestination.signName}
                  </span>
                  <p className="text-[10px] text-slate-400 leading-snug pt-1">
                    Current life evolutionary desire and worldly attention frontier.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Ketu (Past Life Root):</span>
                  <span className="text-xs font-bold text-cyan-300 block">
                    House #{auto.ketuPastRoot.house} in {auto.ketuPastRoot.signName}
                  </span>
                  <p className="text-[10px] text-slate-400 leading-snug pt-1">
                    Past life ingrained mastery, subconscious habits, and spiritual detachment.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Saturn (Cosmic Law):</span>
                  <span className="text-xs font-bold text-purple-300 block">
                    House #{auto.saturnCosmicLaw.house} in {auto.saturnCosmicLaw.signName}
                  </span>
                  <p className="text-[10px] text-slate-400 leading-snug pt-1">
                    Unbending speed limits and boundaries you cannot breach.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Marana Karaka Sthana (MKS) Suffocation & Remedial Sadhana Matrix (Session 71) */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      Marana Karaka Sthana (MKS) Suffocation Audit & Remedies (Session 71)
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Planetary portfolios in a "death-like" state requiring double conscious labor due to Purva Janma Dosha
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                  Suffocation Diagnostics
                </span>
              </div>

              {!mks.hasMksPlanets ? (
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1 text-xs text-emerald-200">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <span>🛡️</span>
                    <span>NO PLANETS IN MARANA KARAKA STHANA (MKS)</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    None of your classical planets occupy their respective MKS houses (Saturn in 1st, Jupiter in 3rd, Mercury in 4th/7th, Venus in 6th, Mars in 7th, Moon in 8th, Rahu in 9th, or Sun in 12th). Your planetary portfolios enjoy natural vitality without past-life suffocation locks.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mks.mksPlanets.map((p, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-3">
                      <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-rose-300">{p.planet} in House #{p.house}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900/40 text-rose-200 border border-rose-700/50">
                            {p.signName} ({p.sanskritSign})
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-rose-400 font-mono uppercase">
                          MKS Suffocated
                        </span>
                      </div>

                      <div className="space-y-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 font-semibold block">Suffocation Mechanism:</span>
                          <p className="text-slate-300 leading-snug">{p.suffocationMechanism}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Past-Life Karmic Root:</span>
                          <p className="text-slate-300 leading-snug">{p.karmicRootCause}</p>
                        </div>
                        <div>
                          <span className="text-amber-400 font-semibold block">Double Effort Requirement:</span>
                          <p className="text-slate-200 leading-snug">{p.effortMultiplier}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-rose-500/30 text-rose-200">
                          <span className="font-bold flex items-center gap-1.5 text-xs text-rose-300">
                            <span>🙏</span> Prescribed Remedial Sadhana (प्रायश्चित्त):
                          </span>
                          <p className="text-[10px] text-slate-200 pt-1 leading-relaxed">
                            {p.prescribedParihara}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. The Automobile Metaphor Cockpit (Session 72) */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🚗</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      The Automobile Karmic Cockpit (Session 72)
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Rahu (Destination / Google Maps) • Ketu (Past Root) • Saturn (Road Rules & Cosmic Law) • Dispositors (Steering Wheel)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  Karmic Telemetry
                </span>
              </div>

              {/* 4 Pillars of the Automobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Rahu */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">Rahu: The Destination</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      H#{auto.rahuDestination.house}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 block">{auto.rahuDestination.signName}</span>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    {auto.rahuDestination.metaphor}
                  </p>
                </div>

                {/* Ketu */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">Ketu: Past Life Root</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      H#{auto.ketuPastRoot.house}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 block">{auto.ketuPastRoot.signName}</span>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    {auto.ketuPastRoot.metaphor}
                  </p>
                </div>

                {/* Saturn */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300">Saturn: The Cosmic Law</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      H#{auto.saturnCosmicLaw.house}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 block">{auto.saturnCosmicLaw.signName}</span>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    {auto.saturnCosmicLaw.metaphor}
                  </p>
                </div>

                {/* Steering Wheels */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300">The Steering Wheel</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Dispositors
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 block">
                    {auto.steeringWheels.rahuDispositor} & {auto.steeringWheels.ketuDispositor}
                  </span>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Rahu in H#{auto.steeringWheels.rahuDispositorHouse} ({auto.steeringWheels.rahuDispositorSign}) & Ketu in H#{auto.steeringWheels.ketuDispositorHouse} ({auto.steeringWheels.ketuDispositorSign}).
                  </p>
                </div>
              </div>

              {/* Cockpit Synthesis Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">
                <p className="leading-relaxed">{auto.cockpitSynthesis}</p>
                <p className="text-[11px] text-emerald-400/90 pt-1.5">{auto.steeringWheels.steeringDynamics}</p>
              </div>
            </div>

            {/* 4. Ketu 12-Sign Past Life Origins & Rahu Destiny Mandate (Sessions 72 & 74) */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🧬</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      Ketu Past-Life Archetype & Current Rahu Mandate (Sessions 72 & 74)
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Inverting the Ketu sign axis to discover your previous birth's identity, excesses, and evolutionary leap
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
                  <span className="text-[10px] text-slate-400 font-semibold">Ketu in:</span>
                  <span className="text-xs font-black text-cyan-300 font-mono">
                    {ketu.ketuSignName} ({ketu.ketuSanskritSign}) H#{ketu.ketuHouse}
                  </span>
                </div>
              </div>

              {/* Special Matsya Water Warning Banner if Applicable */}
              {ketu.profile.hasSpecialMatsyaWaterWarning && (
                <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/40 text-xs text-blue-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-blue-300">
                    <span>🐟</span>
                    <span>SACRED MATSYA AVATAR WATER SAFETY CALLOUT</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {ketu.profile.specialWarning}
                  </p>
                </div>
              )}

              {/* 3 Columns: Past Identity, Karmic Baggage, Rahu Mandate */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-cyan-300">Past Life Identity</span>
                    <span className="text-[10px] font-mono text-slate-400">Subconscious Origin</span>
                  </div>
                  <span className="text-xs font-bold text-slate-100 block">{ketu.profile.pastLifeArchetype}</span>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    In your previous birth, your soul identity was crystallized as a {ketu.profile.pastLifeArchetype}. You carry effortless, innate reflexes in these areas.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-rose-300">Past Karmic Excess / Baggage</span>
                    <span className="text-[10px] font-mono text-slate-400">Habits to Shed</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {ketu.profile.pastLifeKarmicBaggage}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-amber-300">Current Life Rahu Mandate</span>
                    <span className="text-[10px] font-mono text-amber-400">{ketu.profile.currentLifeRahuSign}</span>
                  </div>
                  <span className="text-xs font-bold text-amber-200 block">{ketu.profile.currentLifeRahuMandate}</span>
                  <p className="text-[11px] text-slate-300 leading-snug pt-1">
                    {ketu.profile.evolutionaryAdvice}
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Saturn Supreme Cosmic Boundary Law (Session 74) */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">⚖️</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      Saturn's Supreme Cosmic Boundary Law (Session 74)
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      The absolute unbreachable road rules set by Lord Shani in your chart
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
                  <span className="text-[10px] text-slate-400 font-semibold">Saturn in:</span>
                  <span className="text-xs font-black text-purple-300 font-mono">
                    {sat.saturnSignName} ({sat.saturnSanskritSign}) H#{sat.saturnHouse}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-1.5">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                    📜 Non-Negotiable Law:
                  </span>
                  <p className="text-xs font-semibold text-slate-100 leading-snug">
                    "{sat.rule.nonNegotiableLaw}"
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                  <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block">
                    ⚡ Violation Consequence:
                  </span>
                  <p className="text-xs text-slate-200 leading-snug">
                    {sat.rule.violationConsequence}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                    🔑 Key to Cosmic Mastery:
                  </span>
                  <p className="text-xs text-slate-200 leading-snug">
                    {sat.rule.masteryKey}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 9: RAHU-KETU TRANSIT, ROHINI BHEDANA & REMEDIES */}
      {activeTab === "medhaj_nodal" && (() => {
        const dAxis = medhajNodalReport.destinyAxis;
        const gConj = medhajNodalReport.greatConjunction;
        const nasal = medhajNodalReport.nasalProtocol;
        const rohini = medhajNodalReport.rohiniBhedana;

        return (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Hero Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-slate-900 border border-orange-500/40 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌪️</span>
                    <h3 className="text-lg font-black text-orange-200 uppercase tracking-wide">
                      Rahu-Ketu Transit, Rohini Bhedana & Sacred Remedies Suite
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Classical Nadi Destiny Breakers (Taurus/Scorpio Axis) • 20-Year Great Conjunction (6° Capricorn) • Rohini Shakata Bhedana (King Dasharatha Boon) • Ayurvedic Mustard Oil Nasal Shield & Anna Tyaga Upavasa.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-orange-950/60 border border-orange-500/40 text-orange-300 text-xs font-mono font-bold">
                    Transit Rahu: {dAxis.transitRahuSign} H#{dAxis.transitRahuHouse}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
                    Transit Ketu: {dAxis.transitKetuSign} H#{dAxis.transitKetuHouse}
                  </span>
                </div>
              </div>
            </div>

            {/* 1. Nadi Destiny Breakers & Taurus-Scorpio Axis Radar */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">⚡</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      Nadi "Destiny Breakers" & Taurus-Scorpio Axis
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Rahu (Worldly Amplification / Bhoga) vs Ketu (Contraction to Zero / Moksha)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 font-mono">
                  {dAxis.axisKarmicTheme}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rahu in Taurus */}
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                    <span className="text-xs font-bold text-amber-300">Rahu in {dAxis.transitRahuSign} (House #{dAxis.transitRahuHouse})</span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                      Amplification: {dAxis.rahuResourceAmplificationScore}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Kalapurusha 2nd house domain (wealth treasury, food security, agriculture, banking systems). Rahu amplifies hunger for material accumulation and creates intense anxiety over financial and bodily preservation.
                  </p>
                </div>

                {/* Ketu in Scorpio */}
                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                    <span className="text-xs font-bold text-purple-300">Ketu in {dAxis.transitKetuSign} (House #{dAxis.transitKetuHouse})</span>
                    <span className="text-[10px] font-mono text-purple-400 font-bold">
                      Severance: {dAxis.ketuUnearnedWealthSeveranceScore}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Kalapurusha 8th house domain (subterranean rot, hidden terror, unearned wealth). Ketu destroys deceptive gains (*Asatya Dhana*) and forces direct confrontation with subconscious fears to shatter illusions.
                  </p>
                </div>
              </div>

              {/* F.E.A.R. Diagnostics Banner */}
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">👁️</span>
                    <span className="text-xs font-bold text-rose-300">
                      The Anatomy of Fear: F.E.A.R. = "False Evidence Appearing Real"
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-900/40 text-rose-200 border border-rose-700/50">
                    Intensity: {dAxis.fearDiagnostics.fearMetricScore}/100
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {dAxis.fearDiagnostics.fearMechanism}
                </p>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-emerald-300 font-medium">
                  <strong>Confrontation Directive:</strong> {dAxis.fearDiagnostics.confrontationPath}
                </div>
              </div>
            </div>

            {/* 2. The 20-Year Great Conjunction & Cosmic Reset Timeline (Session 88) */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🪐</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      The 20-Year Great Conjunction & Cosmic Reset Shastra
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Jupiter (Prana Vayu / Expansion) & Saturn (Apana Vayu / Contraction) at 6° Capricorn
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                  {gConj.resetTimelinePhase}
                </span>
              </div>

              {/* 3 Pillars of Conjunction */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-cyan-300 block">🌬️ Prana Vayu (Jupiter)</span>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {gConj.pranaVayuStatus}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-purple-300 block">🍂 Apana Vayu (Saturn)</span>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {gConj.apanaVayuStatus}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-300 block">⛰️ 6° Capricorn (Uttara Ashadha)</span>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Arduous mountain forest climbing. Status: <strong>{gConj.geopoliticalTensionRating}</strong>. Separation: <strong>{gConj.separationDegrees}°</strong>.
                  </p>
                </div>
              </div>

              {/* Medical / Bodily Immunity Alert */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <span>🛡️</span>
                  <span>Natural Bodily Immunity (Jiva) vs Pharmaceutical Quick-Fixes:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {gConj.pharmaceuticalWarning}
                </p>
                <p className="text-[11px] text-emerald-300 font-semibold pt-1">
                  👉 {gConj.bodilyImmunityGuidance}
                </p>
              </div>
            </div>

            {/* 3. Rohini Shakata Bhedana & King Dasharatha Boon (Session 89) */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🏹</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      Rohini Shakata Bhedana & King Dasharatha Legend (Session 89)
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      The piercing of Moon's cart • Durbhiksha (famine) • Dasharatha Shani Stuti
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono border ${
                  rohini.isRohiniBhedanaActive
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }`}>
                  {rohini.isRohiniBhedanaActive ? "🚨 Rohini Bhedana Active" : "✅ Cart of Rohini Shielded"}
                </span>
              </div>

              {/* Legend Card */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-300 block">
                  📜 The Shastric Encounter: {rohini.legendOfDasharatha.king}
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {rohini.legendOfDasharatha.crisis}
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {rohini.legendOfDasharatha.saturnEncounter}
                </p>
                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200">
                  <strong>The Boon of Mitigation:</strong> {rohini.legendOfDasharatha.dasharathaBoon}
                </div>
              </div>

              {/* Supply Chain & Weather Anomalies */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-xs font-bold text-slate-200">Rahu in Rohini Projected Weather & Supply Anomalies:</span>
                  <span className="text-[10px] font-mono text-rose-400 font-bold">{rohini.supplyChainAndWeatherAlert.severity}</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                  {rohini.supplyChainAndWeatherAlert.projectedDisruptions.map((d, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4. Sacred Collective Remedies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Remedy A: Ayurvedic 6-Drop Mustard Oil Nasal Shield */}
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                  <span className="text-xl">🫁</span>
                  <div>
                    <h4 className="text-sm font-bold text-amber-300">
                      Ayurvedic 6-Drop Mustard Oil Nasal Shield
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Classical Respiratory Barrier & Cellular Protection
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-[11px]">
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 font-medium">
                    <strong>⏰ Application Window:</strong> {nasal.applicationWindow}
                  </div>

                  <div className="space-y-1.5 text-slate-300">
                    <span className="text-slate-400 font-semibold block">Cosmic Derivation:</span>
                    <ul className="space-y-1 pl-1">
                      <li>• <strong>Mars & Jupiter:</strong> {nasal.astrologicalDerivation.nostrilsAndBreath}</li>
                      <li>• <strong>4:00 PM – 6:00 PM:</strong> {nasal.astrologicalDerivation.timeHour}</li>
                      <li>• <strong>Mustard Oil (Sarson Tel):</strong> {nasal.astrologicalDerivation.substanceRuler}</li>
                      <li>• <strong>6 Drops (Venus):</strong> {nasal.astrologicalDerivation.dropCountRuler}</li>
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                    <strong>Instructions:</strong> {nasal.instructions}
                  </div>
                </div>
              </div>

              {/* Remedy B: Sacred Anna Tyaga & Moon Primacy */}
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                  <span className="text-xl">🌙</span>
                  <div>
                    <h4 className="text-sm font-bold text-cyan-300">
                      Anna Tyaga (Sunset-to-Sunrise Fasting)
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Classical Dietary Discipline & Moon Primacy
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-[11px]">
                  <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-200 font-medium">
                    <strong>🌅 Sunset Invariant:</strong> {rohini.annaTyagaFastingRemedy.sunsetRule}
                  </div>

                  <div className="space-y-1 text-slate-300">
                    <span className="text-slate-400 font-semibold block">Meal Sacrifice Rule:</span>
                    <p className="leading-snug">{rohini.annaTyagaFastingRemedy.mealSacrificeRule}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200 space-y-1">
                    <span className="font-bold block">The Primacy of the Moon (Chandra):</span>
                    <p className="leading-snug">{rohini.annaTyagaFastingRemedy.moonPrimacyNote}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 10: AGNI TRANSITS, DIVINE LINEAGE & TEMPERAMENT (SYLLABUS UNITS 90–92) */}
      {activeTab === "agni_lineage" && (() => {
        const a = agniReport.agniTrines;
        const g = agniReport.zodiacGunas;
        const w = agniReport.waterSignTears;
        const d = agniReport.divineLineage;
        const l = agniReport.lagnaTemperament;
        const s = agniReport.sambandhas;

        return (
          <div className="space-y-6">
            {/* Hero Banner Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-slate-900 border border-amber-500/40 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🔥</span>
                    <h3 className="text-lg font-bold text-amber-200">
                      Classical Agni Trines, Divine Lineage & Temperament Suite
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Syllabus Units 90–92 • Sovereign Fire Domiciles • Ganga Jal Drishti • 4th/9th/12th Deity Triad • Lagna Modality & 15° Degree Split
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono">
                  <span>Alignment Score: {a.alignmentScorePercent}%</span>
                  {a.tripleFireAlignmentActive && <span>🌟 SOVEREIGN CONCURRENCE</span>}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {a.macroSynthesis}
              </div>
            </div>

            {/* 1. The Three Dimensions of Fire & Domiciles (Unit 90) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mars in Aries */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-red-500/30 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                    🔴 Mars (Mangal)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/60 text-red-300 font-mono">
                    {a.marsStatus.currentSign} ({a.marsStatus.degreeInSign}°)
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-200 block">{a.marsStatus.dimension}</span>
                  <span className="text-[11px] text-amber-400/90 block font-medium">{a.marsStatus.archetype}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {a.marsStatus.consciousnessLevel}
                </p>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 font-medium">
                  {a.marsStatus.operativeVerdict}
                </div>
              </div>

              {/* Sun in Leo */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-yellow-500/30 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                    ☀️ Sun (Surya)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-950/60 text-yellow-300 font-mono">
                    {a.sunStatus.currentSign} ({a.sunStatus.degreeInSign}°)
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-200 block">{a.sunStatus.dimension}</span>
                  <span className="text-[11px] text-amber-400/90 block font-medium">{a.sunStatus.archetype}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {a.sunStatus.consciousnessLevel}
                </p>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 font-medium">
                  {a.sunStatus.operativeVerdict}
                </div>
              </div>

              {/* Jupiter in Sagittarius */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-amber-500/30 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    ♃ Jupiter (Guru)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 font-mono">
                    {a.jupiterStatus.currentSign} ({a.jupiterStatus.degreeInSign}°)
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-200 block">{a.jupiterStatus.dimension}</span>
                  <span className="text-[11px] text-amber-400/90 block font-medium">{a.jupiterStatus.archetype}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {a.jupiterStatus.consciousnessLevel}
                </p>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 font-medium">
                  {a.jupiterStatus.operativeVerdict}
                </div>
              </div>
            </div>

            {/* 2. Ganga Jal Drishti & Mars-Uranus Crucible (Unit 90) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-teal-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-teal-300 flex items-center gap-2">
                    <span>🌊</span>
                    <span>Jupiter's Ganga Jal Drishti (गंगा जल दृष्टि)</span>
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold">
                    {a.gangaJalDrishti.drishtiQualityBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {a.gangaJalDrishti.sanctificationDescription}
                </p>
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-300/90">
                  {a.gangaJalDrishti.retrogradeWarning}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <span>⚡</span>
                    <span>Mars-Uranus (Harshal) Aries Crucible</span>
                  </h4>
                  {a.marsUranusCycle.isConjoinedInAries && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                      CONJUNCTION ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {a.marsUranusCycle.cycleDescription}
                </p>
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-[11px] text-purple-200">
                  <strong>Breakthrough Potential:</strong> {a.marsUranusCycle.breakthroughPotential}
                </div>
              </div>
            </div>

            {/* 3. Macro Zodiac Guna Quadrants & Water Sign Tears (Unit 91) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Zodiac Guna Quadrants */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <span>☸️</span>
                    <span>Zodiac Guna & Perspective Matrix</span>
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                    {g.dominantGunaPerspective}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/20">
                    <span className="text-[10px] text-slate-400 block font-semibold">Signs 1–4 (Rajasic)</span>
                    <span className="text-xs font-bold text-red-300">'I to I' Self</span>
                    <span className="text-base font-black text-red-200 block mt-1">{g.rajasicCount}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20">
                    <span className="text-[10px] text-slate-400 block font-semibold">Signs 5–8 (Tamasic)</span>
                    <span className="text-xs font-bold text-amber-300">'I to You' Relational</span>
                    <span className="text-base font-black text-amber-200 block mt-1">{g.tamasicCount}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                    <span className="text-[10px] text-slate-400 block font-semibold">Signs 9–12 (Sattvic)</span>
                    <span className="text-xs font-bold text-emerald-300">'I to All' Universal</span>
                    <span className="text-base font-black text-emerald-200 block mt-1">{g.sattvicCount}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {g.psychologicalProfile}
                </p>
              </div>

              {/* Water Sign Tears Psychology */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                    <span>💧</span>
                    <span>Water Sign Emotional Tears Psychology</span>
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-200 font-bold">
                    {w.dominantTearsMode}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {w.emotionalProcessingStyle}
                </p>

                <div className="space-y-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                    <strong className="text-cyan-400">♋ Cancer:</strong> {w.detailedSignPhala.cancerPhala}
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                    <strong className="text-red-400">♏ Scorpio:</strong> {w.detailedSignPhala.scorpioPhala}
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                    <strong className="text-purple-400">♓ Pisces:</strong> {w.detailedSignPhala.piscesPhala}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. The Divine Lineage Triad (House 4, 9, 12 Deity Blueprint — Unit 92) */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-amber-500/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <span>🕉️</span>
                    <span>The Divine Lineage Triad (House 4, 9 & 12 Deity Blueprint)</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Family Ancestral Roots (Kula) • Guiding Dharma (Dharma Devata) • Moksha Sanctuary (Ishta Devata)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 4th House Kula Devata */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 uppercase">
                      House 4 • Kula Devata
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {d.kulaDevata.signName} (Lord: {d.kulaDevata.houseLord})
                    </span>
                  </div>
                  <div className="text-sm font-black text-slate-100">
                    {d.kulaDevata.recommendedDeityForm}
                  </div>
                  <div className="p-2 rounded bg-slate-900 text-[11px] font-mono text-amber-300 border border-slate-800">
                    {d.kulaDevata.sanskritMantra}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {d.kulaDevata.esotericGuidance}
                  </p>
                </div>

                {/* 9th House Dharma Devata */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-300 uppercase">
                      House 9 • Dharma Devata
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {d.dharmaDevata.signName} (Lord: {d.dharmaDevata.houseLord})
                    </span>
                  </div>
                  <div className="text-sm font-black text-slate-100">
                    {d.dharmaDevata.recommendedDeityForm}
                  </div>
                  <div className="p-2 rounded bg-slate-900 text-[11px] font-mono text-yellow-300 border border-slate-800">
                    {d.dharmaDevata.sanskritMantra}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {d.dharmaDevata.esotericGuidance}
                  </p>
                </div>

                {/* 12th House Ishta Devata */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 uppercase">
                      House 12 • Ishta Devata
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {d.ishtaDevata.signName} (Lord: {d.ishtaDevata.houseLord})
                    </span>
                  </div>
                  <div className="text-sm font-black text-slate-100">
                    {d.ishtaDevata.recommendedDeityForm}
                  </div>
                  <div className="p-2 rounded bg-slate-900 text-[11px] font-mono text-purple-300 border border-slate-800">
                    {d.ishtaDevata.sanskritMantra}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {d.ishtaDevata.esotericGuidance}
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Lagna Temperament & Dual Sign 15° Degree Split (Unit 92) */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <span>🧭</span>
                    <span>Lagna & Lagna Lord Behavioral Temperament</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Vehicle Modality ({l.lagnaSignName} • {l.lagnaModality}) vs. Pilot Modality ({l.lagnaLordName} in {l.lagnaLordSignName} • {l.lagnaLordModality})
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                  {l.temperamentPattern}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                <p className="leading-relaxed">{l.temperamentDescription}</p>
                <p className="text-amber-400/90 font-medium"><strong>Leadership Disposition:</strong> {l.leadershipStyle}</p>
              </div>

              {/* Dual Sign 15° Split Breakdown */}
              {l.dualSignBifurcations.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-300 block">
                    📐 Dual Signs (Gemini, Virgo, Sagittarius, Pisces) 15° Degree Bifurcations:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {l.dualSignBifurcations.map((b, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{b.planetOrLagna} in {b.signName} ({b.degreeInSign}°)</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono">
                            {b.subModality}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">{b.behavioralManifestation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 6. Geometric Sambandhas Breakdown (Unit 92) */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span>📐</span>
                <span>The Five Geometric Sambandhas of Classical Shastra</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="font-bold text-amber-400 block">{s.kendras.description}</span>
                  <p className="text-[11px] text-slate-400">{s.kendras.impact}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="font-bold text-emerald-400 block">{s.trikonas.description}</span>
                  <p className="text-[11px] text-slate-400">{s.trikonas.impact}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="font-bold text-cyan-400 block">{s.upachayaGrowthAxis.description}</span>
                  <p className="text-[11px] text-slate-400">{s.upachayaGrowthAxis.impact}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="font-bold text-purple-400 block">{s.feederResourceAxis.description}</span>
                  <p className="text-[11px] text-slate-400">{s.feederResourceAxis.impact}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="font-bold text-red-400 block">{s.shadashtakaFrictionAxis.description}</span>
                  <p className="text-[11px] text-slate-400">{s.shadashtakaFrictionAxis.impact}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 11: BHAGYA BINDU & SECRET CODE OF PLANETS (SYLLABUS UNITS 97 & 99) */}
      {activeTab === "bhagya_secret_code" && (() => {
        const bb = bhagyaSecretCodeReport.bhagyaBindu;
        const sc = bhagyaSecretCodeReport.secretCodeManifestations;
        const ms = bhagyaSecretCodeReport.mercurySpeech;

        return (
          <div className="space-y-6">
            {/* Header Hero */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900/80 to-slate-950 border border-amber-500/30 shadow-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    <h3 className="text-lg font-black text-amber-200 tracking-wide">
                      Bhagya Bindu (Pars Fortuna) & Secret Code of Planets
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    Syllabus Units 97 & 99 • Concentrated Purva Punya, 12-Year Cycle Peaks, Real-Time Transit Triggers & Relative Planetary Manifestations
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {bb.isDayBirth ? "☀️ Day Birth Formula" : "🌙 Night Birth Formula"}
                  </span>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-mono">
                    {bb.degreesInSign}° {bb.rashi.englishName}
                  </span>
                </div>
              </div>
            </div>

            {/* 1. Bhagya Bindu Coordinates & Karmic Lifecycle Profile */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <span>🌟</span>
                  <span>1. Bhagya Bindu Coordinates & Karmic House Profile (Unit 97)</span>
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">
                    House {bb.house} in D1
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {bb.nakshatra} (Pada {bb.pada}, Lord: {bb.nakshatraLord})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-4 rounded-xl bg-slate-950/80 border border-amber-500/20 space-y-2.5">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    {bb.housePlacementProfile.title}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {bb.housePlacementProfile.description}
                  </p>
                  {bb.housePlacementProfile.recurringPeakAges && (
                    <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 flex items-center gap-3">
                      <span className="text-lg">⏳</span>
                      <div className="text-xs text-amber-200">
                        <span className="font-bold">Special 12-Year Fortune Cycle: </span>
                        Fortunes peak during the 4th year of life and systematically reactivate every 12 years:{" "}
                        <span className="font-mono font-bold text-amber-300">
                          Ages {bb.housePlacementProfile.recurringPeakAges.join(", ")}
                        </span>.
                      </div>
                    </div>
                  )}
                  {bb.housePlacementProfile.cashFlowMultiplier && (
                    <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span>💰</span>
                      <span>{bb.housePlacementProfile.cashFlowMultiplier}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                  <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5">
                    Geometric Fortune Points
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-bold text-emerald-400 block text-[11px]">Trines (1/5/9 Axis)</span>
                    <span className="text-[11px] text-slate-300 block font-mono">
                      Houses {bb.geometricPoints.trines.houses.join(", ")} ({bb.geometricPoints.trines.rashis.join(", ")})
                    </span>
                    <p className="text-[10px] text-slate-400">{bb.geometricPoints.trines.description}</p>
                  </div>
                  <div className="space-y-1.5 pt-1.5 border-t border-slate-800/60">
                    <span className="font-bold text-cyan-400 block text-[11px]">Quadrants (1/4/7/10 Axis)</span>
                    <span className="text-[11px] text-slate-300 block font-mono">
                      Houses {bb.geometricPoints.quadrants.houses.join(", ")} ({bb.geometricPoints.quadrants.rashis.join(", ")})
                    </span>
                    <p className="text-[10px] text-slate-400">{bb.geometricPoints.quadrants.description}</p>
                  </div>
                  <div className="space-y-1.5 pt-1.5 border-t border-slate-800/60">
                    <span className="font-bold text-amber-400 block text-[11px]">Upachayas (3/11 Axis)</span>
                    <span className="text-[11px] text-slate-300 block font-mono">
                      Houses {bb.geometricPoints.upachayas.houses.join(", ")} ({bb.geometricPoints.upachayas.rashis.join(", ")})
                    </span>
                    <p className="text-[10px] text-slate-400">{bb.geometricPoints.upachayas.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Real-Time Transit Activations */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span>⚡</span>
                <span>2. Active Real-Time Transit Triggers on Bhagya Bindu</span>
              </h4>
              {bb.activeTransitTriggers.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 italic">
                  No major transit planets are currently forming acute conjunctions or trines over your natal Bhagya Bindu.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {bb.activeTransitTriggers.map((t, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300">{t.planet}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                          {t.geometricRelation}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        House {t.transitHouseFromLagna} ({t.transitRashi}) • Orb: {t.exactOrbDegrees}°
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {t.activationEffect}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Secret Code of Planets Matrix (Unit 99) */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <span>🗝️</span>
                    <span>3. Secret Code of Planets (Relative High vs. Low Manifestations - Unit 99)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Moolatrikona to Exaltation distance = Highest Manifestation • Moolatrikona to Debilitation distance = Lowest Manifestation (Blind Spot)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sc.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-amber-300 text-sm">{m.planet}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          House {m.physicalHouse} ({m.physicalRashi})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        MT: {m.moolatrikonaRashi} • Ex: {m.exaltationRashi} • Deb: {m.debilitationRashi}
                      </span>
                    </div>

                    {/* Highest Manifestation */}
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-400">
                          Highest Manifestation: House {m.highestHouse} ({m.highestRashi})
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">
                          {m.highestDistance}th from {m.planet}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {m.highestEffect}
                      </p>
                    </div>

                    {/* Lowest Manifestation */}
                    <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-rose-400">
                          Lowest Manifestation (Blind Spot): House {m.lowestHouse} ({m.lowestRashi})
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 font-mono">
                          {m.lowestDistance}th from {m.planet}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {m.lowestPitfall}
                      </p>
                    </div>

                    {/* Remedy */}
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-1.5">
                      <span className="text-amber-400">🛡️</span>
                      <span><strong className="text-slate-300">Remedy:</strong> {m.remedy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Mercury Speech & Dialogue Dynamics (Unit 99) */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span>🗣️</span>
                <span>4. Mercury Speech & Dialogue Dynamics (Unit 99)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* How you speak */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 uppercase">
                      1st House • Manner of Speech
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Mercury in H{ms.mercuryHouse} ({ms.mercuryRashi})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {ms.speechManner}
                  </p>
                </div>

                {/* What you continuously talk about */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 uppercase">
                      2nd from Mercury • Conversational Focus
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      House {ms.secondHouseFromMercury} ({ms.secondRashiFromMercury})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <strong className="text-cyan-200">Continuous Topics:</strong> {ms.continuousConversationFocus}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Frequent Dialogue Partners:</strong> {ms.frequentInterlocutors}
                  </p>
                </div>

                {/* Where speech degrades */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 uppercase">
                      7th from Mercury • Breakdown Zone
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      House {ms.seventhHouseFromMercury} ({ms.seventhRashiFromMercury})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {ms.communicationFrictionZone}
                  </p>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-rose-300">
                    <strong className="text-slate-200">Preservation Rule:</strong> {ms.speechPreservationRemedy}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 12: LIFESTYLE REMEDIES AS A WAY OF LIFE (SYLLABUS UNIT 41) */}
      {activeTab === "lifestyle_remedies" && (() => {
        const lr = lifestyleRemediesReport;
        const cp = lr.corePhilosophy;
        const prio = lr.personalizedPriorityHabits;
        const allProtocols = Object.values(lr.allGrahaProtocols);

        return (
          <div className="space-y-6">
            {/* Header Hero */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-950 border border-emerald-500/30 shadow-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌿</span>
                    <h3 className="text-lg font-black text-emerald-200 tracking-wide">
                      Lifestyle Remedies as a Way of Life & The 40-Day Rule
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    Syllabus Unit 41 • Moving Beyond Rituals into Non-Negotiable Daily Conduct (Aachara Jyotish)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✨ The 40-Day Rule (Day 41 Shift)
                  </span>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    🔄 Non-Negotiable Daily Reflex
                  </span>
                </div>
              </div>
            </div>

            {/* 1. Core Philosophy & The 40-Day Rule */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span>🕊️</span>
                <span>1. Core Philosophy: Remedies as Daily Conduct (Aachara Jyotish)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20 space-y-2">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                    <span>🪔</span>
                    <span>Beyond Formal Rituals</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    While formal pujas, homas, and donations (Daan) have their sacred place, the most transformative astrological remedies are simple, practical habits integrated directly into daily conduct.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-teal-500/20 space-y-2">
                  <div className="font-bold text-teal-300 flex items-center gap-1.5 text-xs">
                    <span>⏳</span>
                    <span>The 40-Day Shastric Rule</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    If these lifestyle habits are practiced with unwavering discipline consistently for <strong>40 consecutive days</strong>, noticeable psychological unburdening and tangible planetary favor manifest starting from the <strong>41st day</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 space-y-2">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                    <span>🪥</span>
                    <span>The Habit Reflex</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Remedies must become as non-negotiable as brushing your teeth, eating breakfast, or getting dressed before stepping outside. Consistency over dogma is the secret.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Personalized Chart-Targeted Priority Habits */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <span>🎯</span>
                    <span>2. Your Chart-Specific Priority Lifestyle Remedies</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Automatically mapped to your active Mahadasha lord, combust/debilitated grahas, and Dusthana placements
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                  {prio.length} Priority Planets Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prio.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/25 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-amber-300 text-sm">{p.planet}</span>
                        <span className="text-[11px] text-slate-400 font-mono">({p.sanskritName})</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {p.priorityLevel.split(" (")[0]}
                      </span>
                    </div>

                    <div className="text-[11px] text-amber-200 font-medium">
                      ⚡ <em>{p.personalizationReason}</em>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                      <span className="font-bold text-emerald-400 text-[11px] block">Daily Non-Negotiable Habit:</span>
                      <p className="text-slate-300 text-[11px] leading-snug">{p.coreDailyHabits[0]}</p>
                      {p.coreDailyHabits[1] && (
                        <p className="text-slate-400 text-[10px] leading-snug pt-1 border-t border-emerald-900/30">
                          {p.coreDailyHabits[1]}
                        </p>
                      )}
                    </div>

                    <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 space-y-1">
                      <span className="font-bold text-rose-400 text-[11px] block">Strict Shastric Prohibition:</span>
                      <p className="text-slate-300 text-[11px] leading-snug">{p.strictProhibitions[0]}</p>
                    </div>

                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 flex items-start gap-1.5">
                      <span className="text-teal-400">⏳</span>
                      <span><strong className="text-slate-200">Day 41 Fruition:</strong> {p.fortyDayExpectedShift}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. The Complete 9-Graha Daily Conduct Matrix */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span>🪐</span>
                <span>3. Complete 9-Graha Daily Conduct Protocols (Universal Lifestyle Matrix)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {allProtocols.map((g, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-slate-100 text-xs">{g.planet} ({g.sanskritName})</span>
                      <span className="text-[10px] text-slate-400 font-mono">Unit 41</span>
                    </div>

                    <p className="text-[10px] text-slate-400 italic leading-tight">
                      {g.significations}
                    </p>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">Daily Habit:</span>
                      <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                        {g.coreDailyHabits.map((h, hIdx) => (
                          <li key={hIdx} className="leading-snug">{h}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1 pt-1.5 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold text-rose-400 block uppercase tracking-wider">Prohibition:</span>
                      <p className="text-[11px] text-rose-200/90 leading-snug">
                        {g.strictProhibitions[0]}
                      </p>
                    </div>

                    <div className="p-2 rounded bg-slate-900/90 text-[10px] text-slate-400 leading-snug border border-slate-800/60">
                      <strong className="text-slate-300">Metaphysics:</strong> {g.shastricMechanism}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. 40-Day Habit Tracker Simulator */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <span>📅</span>
                  <span>4. 40-Day Habit Transformation Milestone Roadmap</span>
                </h4>
                <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold">
                  Day 1 ➔ Day 40 ➔ Day 41 (Fruit)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Phase 1 (Days 1–10)</span>
                  <div className="font-bold text-amber-300 text-xs">Conscious Resistance</div>
                  <p className="text-[11px] text-slate-400">
                    Breaking automatic neurological grooves. Eliminating water wastage, untangling cords, and enforcing pre-dawn wake-ups.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Phase 2 (Days 11–20)</span>
                  <div className="font-bold text-cyan-300 text-xs">Cellular Adaptation</div>
                  <p className="text-[11px] text-slate-400">
                    Biological clock synchronizes. Digital self-control stabilizes dopamine levels; night curd curfew clears respiratory channels.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Phase 3 (Days 21–30)</span>
                  <div className="font-bold text-teal-300 text-xs">Habit Reflex Anchoring</div>
                  <p className="text-[11px] text-slate-400">
                    Conduct becomes instinctual. Domestic environment stays orderly; bathroom cleanliness and shoe hygiene become effortless reflexes.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 bg-emerald-950/10 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Phase 4 (Days 31–41+)</span>
                  <div className="font-bold text-emerald-300 text-xs">Planetary Shift (Day 41)</div>
                  <p className="text-[11px] text-slate-300">
                    The 40-day threshold is achieved. On Day 41, accumulated karmic momentum crystallizes into palpable serenity, authority, and luck.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 13: CLASSICAL NATAL PANCHANGA DEEP BLUEPRINT, DAGDHA RASHIS & YOGI/AVAYOGI */}
      {activeTab === "natal_panchanga_deep" && (() => {
        const dp = deepPanchangaReport;
        const dagdha = dp.dagdhaAnalysis;
        const ya = dp.yogiAvayogi;
        const wd = dp.weekdayDesire;
        const ke = dp.karanExecution;
        const va = dp.vishnuArmor;
        const pa = dp.panchakAbhijit;

        return (
          <div className="space-y-6">
            {/* Hero Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-950 to-indigo-950/40 border border-cyan-500/40 shadow-2xl relative overflow-hidden space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌌</span>
                    <h3 className="text-lg font-black text-cyan-200 tracking-wide">
                      Natal Panchanga Deep Blueprint & Dagdha Yoga (पञ्चाङ्ग तत्व एवं दग्ध विश्लेषण)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    Classical Five Elemental Limbs, Lifelong Core Desires, Dagdha Viparita Raja Yoga, and Yogi/Avayogi Points (Sessions 46, 47, 48, 49, 96, 98).
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dagdha.viparitaYogaActive && (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-lg shadow-emerald-500/10 animate-pulse">
                      🌟 Viparita Raja Yoga Active
                    </span>
                  )}
                  {pa.isPanchakBirth && (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-400/40">
                      ⚡ Panchak (5x Multiplier)
                    </span>
                  )}
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-cyan-300 border border-cyan-500/30">
                    {wd.weekday}: House {wd.lordHouse} Desire
                  </span>
                </div>
              </div>

              {/* 5 Limbs Mini Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-[10px] text-emerald-400 font-bold block">1. VARA (Agni)</span>
                  <span className="font-bold text-slate-200">{wd.weekday}</span>
                  <span className="text-[10px] text-slate-400 block">{wd.weekdayLord}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-[10px] text-amber-400 font-bold block">2. TITHI (Jala)</span>
                  <span className="font-bold text-slate-200">{dp.tithiDeity.tithiName}</span>
                  <span className="text-[10px] text-slate-400 block">{dp.tithiDeity.category}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-[10px] text-sky-400 font-bold block">3. NAKSHATRA (Vayu)</span>
                  <span className="font-bold text-slate-200">{pa.moonNakshatra}</span>
                  <span className="text-[10px] text-slate-400 block">Pada {pa.moonPada}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-[10px] text-indigo-400 font-bold block">4. YOGA (Akasha)</span>
                  <span className="font-bold text-slate-200">{ephemeris.panchanga.yoga.name}</span>
                  <span className="text-[10px] text-slate-400 block">Jupiter Lord</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-pink-400 font-bold block">5. KARANA (Prithvi)</span>
                  <span className="font-bold text-slate-200">{ke.karanName}</span>
                  <span className="text-[10px] text-slate-400 block">{ke.karanLord}</span>
                </div>
              </div>
            </div>

            {/* Section 1: Five Elemental Limbs Grid & Lifelong Desires */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/70 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔱</span>
                <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                  1. The Five Elemental Limbs & Body Organs (Session 46)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dp.elementalLimbs.map((limb) => (
                  <div key={limb.limb} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-slate-200">{limb.limbHindi}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-300">
                          {limb.element}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-cyan-300 mt-1">{limb.name}</div>
                      <p className="text-[11px] text-slate-400 mt-1">{limb.dimension}</p>
                      <div className="text-[11px] text-slate-300 space-y-0.5 pt-2 border-t border-slate-800/60 mt-2">
                        <div>👁️ <span className="text-slate-400">Sensory Organ:</span> <span className="font-semibold text-slate-200">{limb.sensoryOrgan}</span></div>
                        <div>🦶 <span className="text-slate-400">Working Organ:</span> <span className="font-semibold text-slate-200">{limb.workingOrgan}</span></div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                      {limb.shastricGuidance}
                    </div>
                  </div>
                ))}

                {/* Core Lifelong Desire Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 to-slate-900/80 border border-amber-500/40 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-amber-300">🌟 Lifelong Core Desire</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-200 border border-amber-500/30">
                        Vara Lord in House {wd.lordHouse}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-100 mt-1">{wd.desireTheme}</div>
                    <p className="text-[11px] text-slate-300 mt-1">{wd.coreLifelongDesire}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span className="text-amber-300 font-semibold">Fulfillment Pathway: </span>
                    <span>{wd.fulfillmentPathway}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Dagdha Rashis & Viparita Raja Yoga */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/70 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                    2. Dagdha Rashis (Burnt Signs) & Master Predictive Rules (Session 48)
                  </h4>
                </div>
                <div className="text-xs text-slate-400">
                  Birth Tithi: <span className="font-bold text-amber-300">{dp.tithiDeity.tithiName}</span> ({dp.tithiDeity.paksha} Paksha)
                </div>
              </div>

              {dagdha.hasDagdhaSigns ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dagdha.dagdhaSigns.map((d) => (
                    <div
                      key={d.signIndex}
                      className={`p-4 rounded-2xl border ${
                        d.isViparitaRajaYoga
                          ? "bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                          : "bg-slate-900/60 border-slate-800"
                      } space-y-2`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{d.signHindi}</span>
                          <span className="font-bold text-xs text-slate-200">{d.signName}</span>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          House {d.houseFromLagna}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{d.houseSignifications}</p>

                      {d.isViparitaRajaYoga && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 font-semibold space-y-0.5">
                          <div>🌟 Exceptional Viparita Raja Yoga Active!</div>
                          <p className="text-[11px] text-slate-300 font-normal">
                            As taught in Session 48, when a Dagdha sign lands in a Dusthana (House {d.houseFromLagna}), debts, illnesses, litigations, and hidden adversaries get consumed and burnt away!
                          </p>
                        </div>
                      )}

                      {d.occupyingPlanets.length > 0 && (
                        <div className="space-y-1 pt-1 border-t border-slate-800/60">
                          <span className="text-[11px] font-bold text-slate-400 block">Occupying Planets:</span>
                          {d.occupyingPlanets.map((p) => (
                            <div key={p.name} className="text-xs text-amber-300 flex items-center justify-between">
                              <span>• Planet {p.name}{p.isRetrograde ? " [Retrograde]" : ""}</span>
                              <span className="text-[10px] text-cyan-300 font-mono">{p.remediationStatus}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                        <span className="text-amber-300 font-semibold">Remedy: </span>
                        <span>{d.remedialAction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  Native is born on Purnima or Amavasya where the Sun and Moon are completely aligned. Zero signs are rendered Dagdha (Burnt).
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-amber-300">Presiding Tithi Deity & Healing:</span>
                <p>{dagdha.spiritualHealingPrescription}</p>
                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  Mantra: <span className="text-emerald-300">{dp.tithiDeity.healingMantra}</span> | Invocation: {dp.tithiDeity.healingInvocation}
                </div>
              </div>
            </div>

            {/* Section 3: Yogi, Sahayogi & Avayogi Points */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/70 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                    3. Yogi & Avayogi Mathematical Points (Session 49)
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Yogi Planet (Catalyst)</span>
                    <div className="text-lg font-black text-emerald-200">{ya.yogiPlanet}</div>
                    <span className="text-xs text-slate-300 block">{ya.yogiNakshatra}</span>
                    <p className="text-[11px] text-slate-400 mt-1">{ya.yogiRole}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/40 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Sahayogi (Sign Lord)</span>
                    <div className="text-lg font-black text-indigo-200">{ya.sahayogiPlanet}</div>
                    <span className="text-xs text-slate-300 block">{ya.yogiSign}</span>
                    <p className="text-[11px] text-slate-400 mt-1">{ya.sahayogiRole}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">Avayogi Planet (+6 Constellations forward)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      House {ya.avayogiHouse}
                    </span>
                  </div>
                  <div className="text-base font-black text-red-200">{ya.avayogiPlanet} ({ya.avayogiNakshatra})</div>
                  <p className="text-xs text-slate-300">{ya.avayogiRole}</p>
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 mt-1">
                    {ya.consciousRefinementAdvice}
                  </p>
                </div>
              </div>

              {/* Section 4: Karan & Mars Work Execution Dynamics */}
              <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/70 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚙️</span>
                  <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                    4. Karan & Mars Work Execution Dynamics (Sessions 49 & 98)
                  </h4>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{ke.karanName} ({ke.karanType})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-pink-300">
                      Ruler: {ke.karanLord} in House {ke.karanLordHouse}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Mars (Karan Karta): <span className="font-semibold text-amber-300">House {ke.marsHouse}</span> in {ke.marsSign} ({ke.marsDignity})
                  </div>
                  {ke.isFixedDeStigmatized && ke.fixedArchetypeSummary && (
                    <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-[11px] text-purple-200">
                      {ke.fixedArchetypeSummary}
                    </div>
                  )}
                  <div className="text-xs text-slate-300 pt-1">
                    <span className="font-bold text-slate-200 block">Work Execution Style:</span>
                    <p className="text-slate-400 mt-0.5">{ke.workExecutionStyle}</p>
                  </div>
                  <div className="text-xs text-slate-300 pt-1 border-t border-slate-800/60">
                    <span className="font-bold text-slate-200 block">Optimal Execution Environment:</span>
                    <p className="text-slate-400 mt-0.5">{ke.optimalExecutionEnvironment}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Three-Tier Vishnu Armor (Session 49) */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/70 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                  5. Three-Tier Vishnu Armor & Mantra Science (Session 49)
                </h4>
              </div>
              <p className="text-xs text-slate-300">
                {va.mantraPhoneticsRule}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Tier 1: Physical Protection</span>
                  <div className="text-base font-bold font-mono text-amber-200">{va.tier1Physical.mantraDevanagari}</div>
                  <div className="text-xs text-slate-400 italic">"{va.tier1Physical.mantra}"</div>
                  <div className="text-xs font-semibold text-slate-200 pt-1">{va.tier1Physical.target}</div>
                  <p className="text-[11px] text-slate-400">{va.tier1Physical.guidance}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Tier 2: Mental / Emotional Equilibrium</span>
                  <div className="text-base font-bold font-mono text-cyan-200">{va.tier2Mental.mantraDevanagari}</div>
                  <div className="text-xs text-slate-400 italic">"{va.tier2Mental.mantra}"</div>
                  <div className="text-xs font-semibold text-slate-200 pt-1">{va.tier2Mental.target}</div>
                  <p className="text-[11px] text-slate-400">{va.tier2Mental.guidance}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Tier 3: Spiritual Armor & Grace</span>
                  <div className="text-base font-bold font-mono text-emerald-200">{va.tier3Spiritual.mantraDevanagari}</div>
                  <div className="text-xs text-slate-400 italic">"{va.tier3Spiritual.mantra}"</div>
                  <div className="text-xs font-semibold text-slate-200 pt-1">{va.tier3Spiritual.target}</div>
                  <p className="text-[11px] text-slate-400">{va.tier3Spiritual.guidance}</p>
                </div>
              </div>
            </div>

            {/* Section 6: Panchak 5x Multiplier & Abhijit Constellation */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/70 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                  6. Panchak Constellations & Abhijit Victory Star (Session 47)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Panchak Status (The Final 5 Nakshatras)</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${pa.isPanchakBirth ? "bg-purple-500/20 text-purple-300 border border-purple-400/30" : "bg-slate-800 text-slate-400"}`}>
                      {pa.isPanchakBirth ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-slate-300">{pa.panchakMultiplier}</p>
                  <p className="text-[11px] text-slate-400">
                    The final 5 constellations (Dhanishta latter half, Shatabhisha, Purva Bhadra, Uttara Bhadra, Revati) are intensely Sattvic; actions and energetic potential multiply fivefold.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">The 28th Lost Nakshatra (Abhijit)</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${pa.isAbhijitZone ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" : "bg-slate-800 text-slate-400"}`}>
                      {pa.isAbhijitZone ? "Active" : "Standard Zodiac"}
                    </span>
                  </div>
                  <p className="text-slate-300">{pa.abhijitSignificance}</p>
                  <p className="text-[11px] text-slate-400">
                    Located on the cusp of Uttarashadha and Shravana, mythologically removed by Lord Krishna from ordinary calculation to prevent weaponization for injustice. Distinct from daily midday Abhijit Muhurta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 14: MAKARA RASHI (CAPRICORN), KURMA AVATARA & SATURN'S 5-FOLD REACH (SESSIONS 36, 37, 38) */}
      {activeTab === "makara_kurma" && (() => {
        const mk = makaraKurmaReport;
        const ka = mk.kurmaArchetype;
        const sr = mk.saturnReach;
        const ml = mk.multiLagna;
        const gs = mk.gunaStructural;
        const sm = mk.saturnMaturation;
        const ps = mk.purushaStri;
        const ky = mk.kaliYugaRedemption;

        return (
          <div className="space-y-6">
            {/* Hero Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-950 via-slate-950 to-amber-950/40 border border-amber-600/40 shadow-2xl relative overflow-hidden space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🐢</span>
                    <h3 className="text-lg font-black text-amber-200 tracking-wide">
                      Makara Rashi (Capricorn) & Sri Kurma Avatara (मकर राशि, कूर्म अवतार व शनि पञ्च-प्रभाव)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    Syllabus Units 36, 37, 38 • The Kurma Archetype (Samudra Manthan), Saturn's 5-Fold Influence Matrix (Chhaya & Manda), 7-Center Multi-Lagna Framework & Kali Yuga Redemption.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10">
                    🐢 Kurma Duty: House {ka.capricornHouse}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-slate-300 border border-slate-700">
                    🪐 Saturn in {sr.occupiedSignName} (House {sr.occupiedHouse})
                  </span>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                    🕸️ {sr.allInfluencedHouses.length}/12 Houses Influenced
                  </span>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                    ⚖️ {ps.dominantPolarity.split(" ")[0]} Polarity
                  </span>
                </div>
              </div>

              {/* Master Executive Banner */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 text-xs text-slate-300 leading-relaxed">
                <strong className="text-amber-300 font-bold">Shastric Synthesis: </strong>
                {mk.masterExecutiveSummary}
              </div>
            </div>

            {/* Section 1: Sri Kurma Avatara Archetype & Capricorn House Law */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/70 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌊</span>
                <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                  1. Sri Kurma Avatara Archetype & Samudra Manthan Law (Unit 37)
                </h4>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/15 border border-amber-500/25 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <span>📜</span>
                  <span>The Samudra Manthan Mythological Blueprint</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {ka.samudraManthanDuty}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* House Prescription */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-200">Selfless Labor Mandate (House {ka.capricornHouse})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      Capricorn Field
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {ka.housePrescription}
                  </p>
                </div>

                {/* Chirasthayi Yash */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300">Enduring Historical Legacy (Chirasthayi Yash)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      Saturn's Blessing
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {ka.chirasthayiYashGuidance}
                  </p>
                </div>
              </div>

              {/* Planets in Capricorn Grid */}
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                <span className="font-bold text-xs text-slate-200">Planetary Occupants in Capricorn (House {ka.capricornHouse}):</span>
                {ka.planetsInCapricorn.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ka.planetsInCapricorn.map((p, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300">{p.planet}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {p.dignity}
                          </span>
                        </div>
                        <div className="text-[11px] font-medium text-slate-400">{p.archetypeRole}</div>
                        <p className="text-[11px] text-slate-300 leading-snug">{p.hairOrWorkExpression}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No planetary occupants reside in Capricorn; the house acts as an unadulterated, pure Saturnian field of duty.</p>
                )}
              </div>
            </div>

            {/* Section 2: Saturn's 5-Fold Influence Matrix & Shadow Mechanics */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/70 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪐</span>
                  <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                    2. Saturn's 5-Fold Influence Matrix & Shadow Mechanics (Unit 37)
                  </h4>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {sr.allInfluencedHouses.length} Houses Covered
                </span>
              </div>

              {/* Heen Bhavna Banner */}
              <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-xs space-y-1">
                <div className="font-bold text-rose-300 flex items-center gap-2">
                  <span>🌑</span>
                  <span>Primary Locus & Heen Bhavna (Inferiority Complex Locus): House {sr.occupiedHouse} ({sr.occupiedSignName})</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {sr.heenBhavnaDomain}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {/* 1. Chhaya Flanking Behind */}
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">1. Past Shadow (12th from Shani)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      House {sr.chhayaFlankingBehind.house} ({sr.chhayaFlankingBehind.signName})
                    </span>
                  </div>
                  <p className="text-slate-300 leading-snug">{sr.chhayaFlankingBehind.mechanism}</p>
                </div>

                {/* 2. Chhaya Flanking Ahead */}
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">2. Future Projection (2nd from Shani)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      House {sr.chhayaFlankingAhead.house} ({sr.chhayaFlankingAhead.signName})
                    </span>
                  </div>
                  <p className="text-slate-300 leading-snug">{sr.chhayaFlankingAhead.mechanism}</p>
                </div>

                {/* 3. 4th House Karmic Fruition */}
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300">3. 4th House Fruition</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      House {sr.fourthHouseFruition.house} ({sr.fourthHouseFruition.signName})
                    </span>
                  </div>
                  <p className="text-slate-300 leading-snug">{sr.fourthHouseFruition.fruitionPrinciple}</p>
                </div>

                {/* 4. Manda Limping Trigger */}
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">4. Manda Limper (5th from Shani)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      House {sr.manda5thHurdle.house} ({sr.manda5thHurdle.signName})
                    </span>
                  </div>
                  <p className="text-slate-300 leading-snug">{sr.manda5thHurdle.limperMechanism}</p>
                </div>

                {/* 5. Special Aspects Summary */}
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5 md:col-span-2">
                  <span className="font-bold text-slate-200">5. Special Drishtis (3rd, 7th & 10th Aspects):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                    {sr.specialDrishtis.map((d, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-[11px]">
                        <div className="font-bold text-amber-300">{d.aspectLabel}</div>
                        <div className="text-slate-400">House {d.targetHouse} ({d.targetSignName})</div>
                        <p className="text-slate-300 leading-tight">{d.karmicImpact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fear as Teacher Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong className="text-cyan-300 font-bold">Fear as a Teacher (Nyayadhikari): </strong>
                {sr.fearAsTeacherSynthesis}
              </div>
            </div>

            {/* Section 3: Multi-Lagna 7-Center Framework of Existence */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/70 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">☸️</span>
                <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                  3. Multi-Lagna 7-Center Framework of Existence (Unit 36)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {Object.values(ml.centers).map((c, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-200">{c.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          H{c.houseFromLagna}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-cyan-300">{c.signName} (Lord: {c.signLord})</div>
                      <p className="text-[11px] text-slate-300 leading-snug">{c.spiritualSignificance}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 italic">
                      {c.operationalSphere}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong className="text-amber-300 font-bold">Unified Existential Audit: </strong>
                {ml.synthesis}
              </div>
            </div>

            {/* Section 4: Artha Trikona Triad & Saturn House Maturation */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/70 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚖️</span>
                <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                  4. Artha Trikona Triad & Saturn House Maturation / Aging (Units 36 & 38)
                </h4>
              </div>

              {/* 3 Earth Signs Triad */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Taurus */}
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{gs.arthaTrikona.taurusH2.signName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300">
                      House {gs.arthaTrikona.taurusH2.houseFromLagna}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-amber-400">{gs.arthaTrikona.taurusH2.guna}</div>
                  <p className="text-slate-300 leading-snug">{gs.arthaTrikona.taurusH2.karmicPrinciple}</p>
                </div>

                {/* Virgo */}
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{gs.arthaTrikona.virgoH6.signName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-300">
                      House {gs.arthaTrikona.virgoH6.houseFromLagna}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-rose-400">{gs.arthaTrikona.virgoH6.guna}</div>
                  <p className="text-slate-300 leading-snug">{gs.arthaTrikona.virgoH6.karmicPrinciple}</p>
                </div>

                {/* Capricorn */}
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{gs.arthaTrikona.capricornH10.signName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                      House {gs.arthaTrikona.capricornH10.houseFromLagna}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-emerald-400">{gs.arthaTrikona.capricornH10.guna}</div>
                  <p className="text-slate-300 leading-snug">{gs.arthaTrikona.capricornH10.karmicPrinciple}</p>
                </div>
              </div>

              {/* Saturn Sign & Aging Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Saturn in {sm.saturnSign} Psychology</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Lord: {sm.saturnSignLord}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{sm.signPsychologicalTheme}</p>
                  <p className="text-[11px] text-amber-300 font-medium">✨ {sm.rajYogaPotential}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">House Aging & Gravity Imprint (House {sm.houseAgingImpact.occupiedHouse})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Target: {sm.houseAgingImpact.agingEntity}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Saturn adds solemnity, delays, and premature gravity to <strong>{sm.houseAgingImpact.agingEntity}</strong> ({sm.houseAgingImpact.maturationSphere}).
                  </p>
                  <p className="text-[11px] text-cyan-300">🛡️ {sm.houseAgingImpact.shastricPrescription}</p>
                </div>
              </div>
            </div>

            {/* Section 5: King Parikshit Kali Yuga Redemption & Master Respiratory Remedy */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/70 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                  5. King Parikshit Kali Yuga Redemption & Master Respiratory Shield (Unit 38)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Parikshit & Singular Redemption */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="font-bold text-amber-200">The Srimad Bhagavata Kali Yuga Redemption</div>
                  <p className="text-slate-300 leading-relaxed">
                    {ky.singularRedemptionPrinciple}
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 text-amber-300 font-medium leading-snug">
                    🛡️ {ky.dailyChantingShield}
                  </div>
                </div>

                {/* Master Respiratory Remedy */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-300">🫁 Master 6-Drop Mustard Oil Respiratory Shield</div>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    <li>• <strong>Outer Nostrils:</strong> {ky.respiratoryRemedyAnatomy.outerNostrilsRuler}</li>
                    <li>• <strong>Inbound Prana Vayu:</strong> {ky.respiratoryRemedyAnatomy.pranaVayuInboundRuler}</li>
                    <li>• <strong>Outbound Apana Vayu & Oil:</strong> {ky.respiratoryRemedyAnatomy.apanaVayuOutboundRuler}</li>
                    <li>• <strong>Dosage (6 Drops):</strong> {ky.respiratoryRemedyAnatomy.sanjeevaniDosageRuler}</li>
                  </ul>
                  <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-200 font-medium">
                    {ky.respiratoryRemedyAnatomy.protocol}
                  </div>
                </div>
              </div>

              {/* Grooming & Ethics Footer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-200">💈 Hair Hygiene Code (Saturn):</span>
                  <p className="text-slate-300 text-[11px] leading-snug">{ka.groomingIndicators.hairHygieneRule}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-200">👞 Footwear Hygiene Code (Capricorn):</span>
                  <p className="text-slate-300 text-[11px] leading-snug">{ka.groomingIndicators.footwearHygieneRule}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 italic">
                ⚖️ <strong>Astrological Ethics Guardrail:</strong> {ky.ethicalAstrologyGuardrail}
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 15: KUMBHA RASHI (AQUARIUS), BHRIGU BINDU & RAHU-SATURN TRIAD (SESSIONS 39 & 40) */}
      {activeTab === "kumbha_aquarius" && (() => {
        const kb = kumbhaAquariusReport;
        const bb = kb.bhriguBinduAxis;
        const kw = kb.kumbhaWaterBearer;
        const rn = kb.rahuNonExploitation;
        const tr = kb.triadRulership;
        const fa = kb.friendshipAlliances;
        const ss = kb.spiritualShieldAndRemedies;

        return (
          <div className="space-y-6">
            {/* Header Hero Banner */}
            <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl shadow-inner">
                    🏺
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
                      Classical Vedic Shastra • Sessions 39 & 40
                    </span>
                    <h3 className="text-lg font-black text-cyan-200 tracking-wide">
                      Kumbha Rashi (Aquarius), Bhrigu Bindu & Rahu-Saturn Triad (कुम्भ राशि, भृगु बिंदु व राहु कवच)
                    </h3>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-cyan-900/40 border border-cyan-500/30 text-cyan-300">
                    House {kw.houseNumber} ({kw.signName})
                  </span>
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-blue-900/40 border border-blue-500/30 text-blue-300">
                    Bhrigu Bindu: {bb.bhriguBindu.formattedPosition}
                  </span>
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-900/40 border border-indigo-500/30 text-indigo-300">
                    Destiny: {bb.destinyPoint.formattedPosition}
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 1: The Water-Bearer Archetype & Teeth Physical Indicator */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">💧</span>
                  <h4 className="font-bold text-slate-200 text-sm tracking-wide">
                    1. The Water-Bearer (Pitcher) Archetype & Teeth Physical Indicator (Session 39)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-0.5 rounded-lg">
                  House {kw.houseNumber} • {kw.archetypeTitle}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                {/* Left: Water-Bearer Archetype */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                    The Pitcher Symbolism (Unconditional Giving)
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    <strong>Water-Bearer Mandate:</strong> {kw.waterBearerDuty}
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    <strong>Selfless Service Law:</strong> {kw.selflessGivingMandate}
                  </p>
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-[11px] space-y-1">
                    <div><strong>⚠️ Karmic Trap:</strong> {kw.karmicTrap}</div>
                    <div><strong>✨ Enduring Blessing:</strong> {kw.enduringBlessing}</div>
                  </div>
                </div>

                {/* Right: Secret Physical Indicator: Teeth (Danta) */}
                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">
                      🦷 Secret Physical Indicator: Teeth (दन्त लक्षण)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 font-bold">
                      {kw.teethPhysicalIndicator.relativeOrDomain}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    While Capricorn reflects through hair grooming, <strong>Aquarius reflects primarily through the teeth</strong>. Whichever relative or body domain corresponds to Aquarius shows distinct dental architecture:
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-cyan-300 text-[11px] space-y-1">
                    <div><strong>Dental Signature:</strong> {kw.teethPhysicalIndicator.dentalSignature}</div>
                    <div className="text-slate-400 italic"><strong>Clinical Observation:</strong> {kw.teethPhysicalIndicator.clinicalObservation}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: Bhrigu Bindu & Destiny Point Mathematical Axis */}
            <div className="glass-panel p-6 rounded-3xl border border-blue-500/30 bg-slate-950/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🎯</span>
                  <h4 className="font-bold text-blue-200 text-sm tracking-wide">
                    2. The Bhrigu Bindu & Destiny Point Mathematical Axis (Session 40)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-blue-400 bg-blue-950/60 border border-blue-500/30 px-3 py-0.5 rounded-lg">
                  Arc Span: {bb.shorterArcSpanDegrees}° (Moon to Rahu)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Bhrigu Bindu Card */}
                <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-300 text-sm">🌌 Bhrigu Bindu (भृगु बिंदु)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 font-bold">
                      House {bb.bhriguBindu.houseFromLagna} from Lagna
                    </span>
                  </div>
                  <div className="text-base font-black text-white">{bb.bhriguBindu.formattedPosition}</div>
                  <div className="text-slate-300 text-[11px] space-y-1">
                    <div>• <strong>Nakshatra:</strong> {bb.bhriguBindu.nakshatraName} Pada {bb.bhriguBindu.pada} (Lord: {bb.bhriguBindu.nakshatraLord})</div>
                    <div>• <strong>Sign Lord:</strong> {bb.bhriguBindu.signLord} • House from Moon: {bb.bhriguBindu.houseFromMoon}</div>
                    <div className="text-slate-400 pt-1 leading-snug">{bb.bhriguBindu.astrologicalSignificance}</div>
                  </div>
                </div>

                {/* Destiny Point Card */}
                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-300 text-sm">⚡ Destiny Point (180° Bhagya Trigger)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-200 font-bold">
                      House {bb.destinyPoint.houseFromLagna} from Lagna
                    </span>
                  </div>
                  <div className="text-base font-black text-white">{bb.destinyPoint.formattedPosition}</div>
                  <div className="text-slate-300 text-[11px] space-y-1">
                    <div>• <strong>Nakshatra:</strong> {bb.destinyPoint.nakshatraName} Pada {bb.destinyPoint.pada} (Lord: {bb.destinyPoint.nakshatraLord})</div>
                    <div>• <strong>Sign Lord:</strong> {bb.destinyPoint.signLord} • House from Moon: {bb.destinyPoint.houseFromMoon}</div>
                    <div className="text-slate-400 pt-1 leading-snug">{bb.destinyPoint.astrologicalSignificance}</div>
                  </div>
                </div>
              </div>

              {/* Conjunctions & Aspects */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-200 block">🪐 Natal Graha Planetary Aspects & Conjunctions on Axis:</span>
                {bb.conjunctPlanets.length > 0 ? (
                  <div className="space-y-1">
                    {bb.conjunctPlanets.map((c, i) => (
                      <div key={i} className="text-amber-300 text-[11px]">
                        • <strong>{c.planet}</strong> conjunct {c.targetPoint} (Orb: {c.orbDegrees}°): {c.karmicMeaning}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-[11px]">No natal grahas conjunct within 3°20' (primarily awakened through major transits).</p>
                )}
                {bb.aspectingPlanets.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-slate-800">
                    {bb.aspectingPlanets.map((a, i) => (
                      <div key={i} className="text-slate-300 text-[11px]">
                        • <strong>{a.planet}</strong> ({a.aspectType} &rarr; {a.targetPoint}): {a.karmicMeaning}
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/20 text-[11px] text-blue-200 font-medium">
                  🧭 <strong>Transiting Activation Rule:</strong> {bb.transitingActivationGuidance}
                </div>
              </div>
            </div>

            {/* CARD 3: Universal Law: Never Exploit the Domain of Rahu */}
            <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 bg-slate-950/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">⚠️</span>
                  <h4 className="font-bold text-rose-300 text-sm tracking-wide">
                    3. Critical Universal Law: Never Exploit the Domain of Rahu (Session 40)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-rose-400 bg-rose-950/60 border border-rose-500/30 px-3 py-0.5 rounded-lg">
                  Rahu in House {rn.rahuHouse}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-200 text-sm">
                    Rahu's Occupied Domain: House {rn.rahuHouse} ({rn.activeRahuRule.houseSignification})
                  </span>
                </div>
                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <div><strong className="text-rose-400">Strict Prohibition:</strong> {rn.activeRahuRule.dangerZoneExploitation}</div>
                  <div><strong className="text-amber-400">Karmic Retribution if Violated:</strong> {rn.activeRahuRule.karmicBacklash}</div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
                    <strong>🌿 Active Selfless Service Pathway:</strong> {rn.activeRahuRule.selflessServicePathway}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
                ⚖️ <strong>Universal Shastric Principle:</strong> {rn.universalWarning}
              </div>
            </div>

            {/* CARD 4: 11th House True Friendships & Name Initial Matrix */}
            <div className="glass-panel p-6 rounded-3xl border border-teal-500/30 bg-slate-950/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🤝</span>
                  <h4 className="font-bold text-teal-200 text-sm tracking-wide">
                    4. Identifying True Friends: 11th House Non-Betrayal Rule & Name Initials (Session 39)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-teal-400 bg-teal-950/60 border border-teal-500/30 px-3 py-0.5 rounded-lg">
                  Fixed Air Fidelity
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-2">
                  <span className="font-bold text-teal-300">11th from Lagna Ally: {fa.eleventhFromLagna.signName}</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Because the 11th house is a Fixed Air sign, friends born with this rising sign or name initials will never betray you during adversity.
                  </p>
                  <div className="text-[11px] text-teal-200 bg-slate-950/60 p-2 rounded-lg border border-teal-500/20">
                    <strong>Favorable Name Sounds:</strong> {fa.eleventhFromLagna.friendlySounds.join(", ")}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
                  <span className="font-bold text-cyan-300">11th from Moon Ally: {fa.eleventhFromMoon.signName}</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Emotional support anchor. Individuals with these name sounds provide unshakeable psychological comfort and loyalty.
                  </p>
                  <div className="text-[11px] text-cyan-200 bg-slate-950/60 p-2 rounded-lg border border-cyan-500/20">
                    <strong>Favorable Name Sounds:</strong> {fa.eleventhFromMoon.friendlySounds.join(", ")}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
                ✨ <strong>Trinal Allies:</strong> 9th House ({fa.trinalAllies.ninthSign.name}) provides Dharmic wisdom; 5th House ({fa.trinalAllies.fifthSign.name}) brings past-life intellectual and emotional affection.
              </div>
            </div>

            {/* CARD 5: Mythological Archetypes & Triad Rulership */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🐗</span>
                  <h4 className="font-bold text-slate-200 text-sm tracking-wide">
                    5. Mythological Archetypes: Varaha Avatara & Rahu Jalandhara Diplomacy (Session 40)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-0.5 rounded-lg">
                  Saturn • Rahu • Uranus
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-300">🐗 Sri Varaha Avatara Analogy</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{tr.varahaAvataraSynthesis}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="font-bold text-cyan-300">🗣️ Rahu the Bold Diplomat (The Jalandhara Legend)</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{tr.jalandharaDiplomacySynthesis}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                  <strong className="text-slate-200 block mb-1">🪐 Saturn:</strong> {tr.saturnRole}
                </div>
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                  <strong className="text-slate-200 block mb-1">🐉 Rahu:</strong> {tr.rahuRole}
                </div>
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                  <strong className="text-slate-200 block mb-1">⚡ Uranus / Harshal:</strong> {tr.uranusRole}
                </div>
              </div>
            </div>

            {/* CARD 6: Batuk Bhairava Spiritual Shield, Animal Remedies & Bodily Correspondences */}
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-slate-950/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🛡️</span>
                  <h4 className="font-bold text-emerald-200 text-sm tracking-wide">
                    6. Batuk Bhairava Spiritual Shield, Animal Remedies & 9 Bodily Correspondences
                  </h4>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-0.5 rounded-lg">
                  Lord Shiva • Tripurari
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Spiritual Shield */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <span className="font-bold text-emerald-300">🔱 Batuk Bhairava Spiritual Shield</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {ss.batukBhairavShield.spiritualFunction}
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-emerald-200 text-[11px]">
                    <strong>Daily Protocol:</strong> {ss.batukBhairavShield.dailyProtocol}
                  </div>
                </div>

                {/* Practical Animals */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-300">🐕 Practical Animal Remedial Service</span>
                  <div className="space-y-1.5 text-slate-300 text-[11px]">
                    <div>• <strong>Street Dogs:</strong> {ss.animalRemedies.streetDogs}</div>
                    <div>• <strong>Elephants & Silver:</strong> {ss.animalRemedies.elephantsAndSilver}</div>
                  </div>
                </div>
              </div>

              {/* 9 Bodily Correspondences Table */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-200 block">🌿 9-Point Bodily Correspondences in Human Anatomy (Session 39):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                  {ss.bodilyCorrespondences.map((b, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] space-y-0.5">
                      <div className="font-bold text-cyan-300">{b.bodyPart}</div>
                      <div className="text-slate-400">Ruler: <span className="text-slate-200">{b.governingFactor}</span></div>
                      <div className="text-slate-300 text-[10px] leading-snug">{b.dailyLifestyleRemedy}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 16: MEENA RASHI & KALAPURUSHA SCRIPT OVERLAY (SESSIONS 42-45) */}
      {activeTab === "meena_kalapurusha" && (() => {
        const mr = meenaKalapurushaReport;
        const pa = mr.piscesArchetype;
        const ko = mr.kalapurushaScriptOverlay;
        const ei = mr.elementalImmunity;
        const dm = mr.specialDrishtiMatrix;

        return (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="glass-panel p-6 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-slate-950/80 to-purple-950/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🐟</span>
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300">
                      Meena Rashi (Pisces) & Kalapurusha Script Overlay
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Blind Faith Law (अंध विश्वास), Kalapurusha 12-House Energy Script, Elemental Immunity Hierarchy & Special Drishti Matrix (Sessions 42–45)
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-blue-950/60 border border-blue-500/30 px-3 py-1.5 rounded-2xl">
                  <span className="text-xs text-blue-300 font-bold">Pisces in House {pa.piscesHouse.houseNumber}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-300 font-semibold">{pa.piscesHouse.archetypeTitle}</span>
                </div>
              </div>
            </div>

            {/* CARD 1: Pisces Archetype, Blind Faith & 12th House Expenditure */}
            <div className="glass-panel p-6 rounded-3xl border border-blue-500/30 bg-slate-950/80 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🌊</span>
                  <h4 className="font-bold text-blue-200 text-sm tracking-wide">
                    1. Meena Rashi (Pisces) Archetype &amp; The Blind Faith Law (Session 42)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-blue-400 bg-blue-950/60 border border-blue-500/30 px-3 py-0.5 rounded-lg">
                  House {pa.piscesHouse.houseNumber} • Lord: Jupiter
                </span>
              </div>

              {/* Blind Faith & Divine Rescue */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-2">
                  <span className="font-bold text-blue-300">🙏 The Blind Faith Law (Andha Vishwas)</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{pa.piscesHouse.blindFaithSphere}</p>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-blue-500/20 text-rose-300 text-[11px]">
                    <strong>Where Calculation Fails:</strong> {pa.piscesHouse.calculationTrap}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="font-bold text-emerald-300">✨ Divine Grace Rescue Pathway (Daiva Kripa)</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{pa.piscesHouse.daivaKripaMechanism}</p>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-emerald-200 text-[11px]">
                    <strong>Oceanic Surrender:</strong> When ego calculation is surrendered in House {pa.piscesHouse.houseNumber}, unexpected divine help enters to resolve insoluble crises.
                  </div>
                </div>
              </div>

              {/* Tears Hierarchy & 12th House Expenditure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="font-bold text-cyan-300">💧 Water Sign Tears Hierarchy</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{pa.universalCompassionTearsSynthesis}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-300">🛏️ 12th House Expenditure &amp; Sanctuary Mechanics</span>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div>• <strong>Expenditure Mode:</strong> {pa.twelfthHouseExpenditure.expenditureMode}</div>
                    <div>• <strong>Sleep Sanctuary:</strong> {pa.twelfthHouseExpenditure.sleepSanctuaryStatus}</div>
                    <div>• <strong>Remedial Outflow:</strong> {pa.twelfthHouseExpenditure.expenditureGuidance}</div>
                    <div>• <strong>Sanctuary Codes:</strong> {pa.twelfthHouseExpenditure.sanctuaryRecommendations.join("; ")}</div>
                  </div>
                </div>
              </div>

              {/* Planetary Occupants in Pisces */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-200 block">🪐 Planetary Dignities in Pisces (House {pa.piscesHouse.houseNumber}):</span>
                {pa.planetaryOccupantsInPisces.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {pa.planetaryOccupantsInPisces.map((p, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-blue-300">{p.planet} ({p.dignity})</strong>
                          <span className="text-[10px] text-slate-400">{p.psychologicalExpression}</span>
                        </div>
                        <p className="text-slate-300 text-[10px] leading-relaxed">{p.shastricGuidance}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-[11px]">No natal grahas occupy Pisces; this house operates through unadulterated Jovian oceanic grace.</p>
                )}
              </div>
            </div>

            {/* CARD 2: Kalapurusha 12-House Energy Script Overlay */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">📜</span>
                  <h4 className="font-bold text-slate-200 text-sm tracking-wide">
                    2. Kalapurusha 12-House Energy Script Overlay (Session 43)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-0.5 rounded-lg">
                  Lagna: {ko.ascendantSignName}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                💡 <strong>Core Architectural Principle:</strong> Houses 1 through 12 are fixed static domains of human life. However, whichever sign occupies a house imports the cosmic nature of that sign&apos;s natural Kalapurusha house position as its active behavioral energy script.
              </div>

              {/* 12-House Overlays Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                {ko.houseOverlays.map((o) => (
                  <div key={o.houseNumber} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between space-y-2 hover:border-blue-500/30 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-300">House {o.houseNumber}</span>
                        <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-500/20">
                          {o.occupyingSignName} (K-{o.kalapurushaHouseNumber})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">{o.houseSignification}</div>
                      <p className="text-[11px] text-slate-300 pt-1 leading-snug">{o.behavioralManifestation}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[10px] text-emerald-300/90 leading-snug">
                      <strong>Guidance:</strong> {o.actionableGuidance}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 3: Elemental Immunity Hierarchy & Pathogen Vulnerability */}
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-slate-950/80 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🛡️</span>
                  <h4 className="font-bold text-emerald-200 text-sm tracking-wide">
                    3. Elemental Immunity Hierarchy &amp; Pathogen Vulnerability (Session 44)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-0.5 rounded-lg">
                  {ei.dominantElement} Dominant
                </span>
              </div>

              {/* Resistance Score Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-center items-center text-center space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Cellular Resistance Score</span>
                  <div className="text-3xl font-extrabold text-emerald-300">
                    {ei.cellularResistanceScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400">{ei.immunityClassification}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 md:col-span-2 space-y-2 text-xs">
                  <span className="font-bold text-slate-200">Tattva Balance Breakdown:</span>
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center text-[11px]">
                    <div className="p-2 rounded-xl bg-red-950/30 border border-red-500/20">
                      <div className="font-bold text-red-300">🔥 Fire</div>
                      <div className="text-slate-300 font-extrabold">{ei.agniPercentage}%</div>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-500/20">
                      <div className="font-bold text-amber-300">⛰️ Earth</div>
                      <div className="text-slate-300 font-extrabold">{ei.prithviPercentage}%</div>
                    </div>
                    <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
                      <div className="font-bold text-cyan-300">💨 Air</div>
                      <div className="text-slate-300 font-extrabold">{ei.vayuPercentage}%</div>
                    </div>
                    <div className="p-2 rounded-xl bg-blue-950/30 border border-blue-500/20">
                      <div className="font-bold text-blue-300">💧 Water</div>
                      <div className="text-slate-300 font-extrabold">{ei.jalaPercentage}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profiles & Preventive Shield */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-300">🦠 Pathogen Resistance &amp; Vulnerability Profile</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{ei.pathogenVulnerabilitySummary}</p>
                  <div className="text-[10px] text-slate-400"><strong>Hierarchy:</strong> Fire (Superior Heat) &gt; Earth (Structural Endurance) &gt; Air (Respiratory) &gt; Water (Fluid Contagion)</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="font-bold text-emerald-300">🌿 Prescribed Immunity Shield &amp; Lifestyle Protocol</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{ei.lifestyleImmunityPrescriptions.join("; ")}</p>
                  {ei.waterAscendantFireLordException.isApplicable && (
                    <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-[11px]">
                      <strong>⚡ Agni Fortification Exception:</strong> ✅ {ei.waterAscendantFireLordException.agniFortificationBonus} (Water Ascendant: {ei.waterAscendantFireLordException.waterAscendantSign}, Lagna Lord: {ei.waterAscendantFireLordException.lagnaLord} in Fire Sign {ei.waterAscendantFireLordException.lordFireSign})
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CARD 4: Special Drishti as Kalapurusha Intention Matrix */}
            <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-slate-950/80 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">👁️</span>
                  <h4 className="font-bold text-indigo-200 text-sm tracking-wide">
                    4. Special Drishti as Kalapurusha Intention Matrix (Session 45)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-3 py-0.5 rounded-lg">
                  {dm.aspectVectors.length} Active Intention Vectors
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                💡 <strong>The Kalapurusha Aspect Doctrine:</strong> Planets work physically where they sit, but project desire, gaze, and psychological intentions through their Drishti. Each special aspect carries the specific imprint of a Kalapurusha sign: Saturn 3rd (Gemini manual toil) &amp; 10th (Capricorn duty); Mars 4th (Cancer boundary intrusion) &amp; 8th (Scorpio transformation); Jupiter 5th (Leo parental love) &amp; 9th (Sagittarius divine fortune); Rahu (magnification) &amp; Ketu (detachment).
              </div>

              {/* Aspect Vectors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                {dm.aspectVectors.map((v, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2 hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                      <span className="font-bold text-indigo-300">
                        {v.aspectingPlanet} &bull; {v.aspectType}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md">
                        &rarr; House {v.targetHouse} ({v.targetSignName})
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-300/90 font-medium">{v.kalapurushaArchetypeResonance}</div>
                    <p className="text-[11px] text-slate-300 leading-snug">{v.karmicPsychology}</p>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[10px] text-emerald-300/90 leading-snug">
                      <strong>Remedial Action:</strong> {v.practicalActionDirective}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 17: UCHHA, NEECHA & TRANSIT DYNAMICS (SESSIONS 80 & 81) */}
      {activeTab === "uchha_neecha" && (() => {
        const un = uchhaNeechaReport;
        const na = un.natalDignityAwareness;
        const ls = un.lagneshaShield;
        const fsi = un.fatherSonInversion;
        const tg = un.transitGeometricDynamics;
        const mvt = tg.moonVenusTaurusConjunction;

        const exaltedCount = na.filter(p => p.isExalted).length;
        const debilitatedCount = na.filter(p => p.isDebilitated).length;

        return (
          <div className="space-y-6">
            {/* Header Hero Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-900 border border-amber-500/40 shadow-2xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚖️</span>
                    <h3 className="text-xl font-black text-amber-200 tracking-wide">
                      Uchha &amp; Neecha Graha Awareness, Sovereign Lagnesha &amp; Transit Axes
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 font-medium pt-1">
                    उच्च-नीच ग्रह चेतना, अंध-बिंदु, लग्नेश संप्रभुता व गोचर दृष्टि ज्यामिति (Masterclass Sessions 80 &amp; 81)
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-xl">
                    🌟 {exaltedCount} Exalted (High Awareness)
                  </span>
                  <span className="text-xs font-bold text-rose-300 bg-rose-950/60 border border-rose-500/40 px-3 py-1 rounded-xl">
                    ⚠️ {debilitatedCount} Debilitated (Blind Spots)
                  </span>
                </div>
              </div>

              {/* Shastric Core Doctrine Box */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/30 text-xs text-slate-200 leading-relaxed space-y-2">
                <div className="font-bold text-amber-300 flex items-center gap-2">
                  <span>💡</span>
                  <span>The Conscious Awareness vs. Blind Spot Paradigm:</span>
                </div>
                <p>
                  <strong>Exaltation (Uchha) &ne; Automatic Raja Yoga:</strong> Exaltation signifies <strong>High Conscious Awareness (Chetana / Jagruti)</strong> and acute perceptual mastery carried from past lives (Purva Janma Karma). The danger is ego pride and entitlement.
                </p>
                <p>
                  <strong>Debilitation (Neecha) &ne; Inherent Curse or Ruin:</strong> Debilitation indicates an <strong>Inexperience Area / Subconscious Blind Spot</strong>. The native lacks innate instinct in this domain and must cultivate competence through humble, conscious, deliberate effort. With conscious practice, the native transforms the blind spot into profound, grounded mastery without false ego.
                </p>
                <p className="text-[11px] text-amber-200/90 pt-1">
                  <em>Panchanga Tattva Key:</em> {un.panchangaTattvaReminder}
                </p>
              </div>
            </div>

            {/* CARD 1: Conscious Awareness vs. Blind Spot Matrix */}
            <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-slate-950/80 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🌟</span>
                  <h4 className="font-bold text-amber-200 text-sm tracking-wide">
                    1. Natal Conscious Awareness vs. Blind Spot Diagnostics (Session 81)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-0.5 rounded-lg">
                  {na.length} Classical Grahas Evaluated
                </span>
              </div>

              {/* Planetary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {na.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border space-y-3 transition-all ${
                      item.isExalted
                        ? "bg-amber-950/20 border-amber-500/40 shadow-md shadow-amber-500/5 hover:border-amber-400"
                        : item.isDebilitated
                        ? "bg-rose-950/20 border-rose-500/40 shadow-md shadow-rose-500/5 hover:border-rose-400"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-sm">{item.planet}</span>
                        <span className="text-[10px] text-slate-400 font-medium">H{item.houseNumber} &bull; {item.signName}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.isExalted
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : item.isDebilitated
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {item.dignity}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div
                        className={`text-[11px] font-bold ${
                          item.isExalted
                            ? "text-amber-300"
                            : item.isDebilitated
                            ? "text-rose-300"
                            : "text-slate-300"
                        }`}
                      >
                        {item.awarenessOrBlindSpotCategory}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">{item.detailedInterpretation}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[10px] text-emerald-300/90 leading-snug">
                      <strong>Mindfulness Protocol:</strong> {item.actionableMindfulness}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 2: Archetypal Dignity Logic & Father-Son Inversion Axis */}
            <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-slate-950/80 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">☀️</span>
                  <h4 className="font-bold text-purple-200 text-sm tracking-wide">
                    2. Archetypal Dignity Logic &amp; Father-Son Inversion Axis (Session 80)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-purple-300 bg-purple-950/60 border border-purple-500/30 px-3 py-0.5 rounded-lg">
                  Surya-Shani Polarity
                </span>
              </div>

              {/* Father-Son Inversion Banner */}
              <div
                className={`p-4 rounded-2xl border space-y-2 text-xs ${
                  fsi.inversionActive
                    ? "bg-purple-950/30 border-purple-500/50 text-purple-100"
                    : "bg-slate-900/60 border-slate-800 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-purple-200 text-sm flex items-center gap-2">
                    <span>⚡</span>
                    <span>The Cosmic Dialogue: Sun (Father/King) &amp; Saturn (Son/Democrat)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-900/80 text-purple-200 border border-purple-700">
                    {fsi.inversionActive ? fsi.inversionType : "Equilibrium Axis"}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">{fsi.karmicSignificance}</p>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-500/30 text-[11px] text-purple-200">
                  <strong>Reconciliation Guidance:</strong> {fsi.reconciliationGuidance}
                </div>
              </div>

              {/* 7 Classical Dignity Rationales Table */}
              <div className="space-y-2">
                <h5 className="font-bold text-xs text-slate-200">
                  Classical Logic: Why Each Graha Exalts (Dawn) or Debilitates (Dusk):
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                    <div className="font-bold text-amber-300">☀️ Sun (Surya)</div>
                    <div className="text-[10px] text-slate-400">MT Leo (Throne) &bull; Exalts Aries &bull; Debilitates Libra</div>
                    <p className="text-[11px] text-slate-300">
                      Rejoices at dawn in Aries with raw vital leadership; struggles in Libra market where executive authority is compromised by bargaining.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                    <div className="font-bold text-cyan-300">🌙 Moon (Chandra)</div>
                    <div className="text-[10px] text-slate-400">MT Cancer (Home) &bull; Exalts Taurus &bull; Debilitates Scorpio</div>
                    <p className="text-[11px] text-slate-300">
                      Rejoices in Taurus with nourishing food, tangible security, and peaceful comfort; drowns in Scorpio 8th-house subterranean crises.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                    <div className="font-bold text-yellow-300">✨ Jupiter (Guru)</div>
                    <div className="text-[10px] text-slate-400">MT Sagittarius (Dharma) &bull; Exalts Cancer &bull; Debilitates Capricorn</div>
                    <p className="text-[11px] text-slate-300">
                      Rejoices in Cancer ashram bonding emotionally with seekers; constrained in Capricorn corporate grind and manual labor.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                    <div className="font-bold text-rose-300">🔥 Mars (Mangal)</div>
                    <div className="text-[10px] text-slate-400">MT Aries (Courage) &bull; Exalts Capricorn &bull; Debilitates Cancer</div>
                    <p className="text-[11px] text-slate-300">
                      Rejoices in Capricorn as tactical disciplined soldier; struggles in Cancer emotional tears where martial focus melts.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                    <div className="font-bold text-pink-300">🌸 Venus (Shukra)</div>
                    <div className="text-[10px] text-slate-400">MT Libra (Harmony) &bull; Exalts Pisces &bull; Debilitates Virgo</div>
                    <p className="text-[11px] text-slate-300">
                      Rejoices in Pisces selfless spiritual surrender transcending contracts; suffers in Virgo analytical audit and flaw-finding.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                    <div className="font-bold text-emerald-300">📚 Mercury (Budha)</div>
                    <div className="text-[10px] text-slate-400">MT &amp; Exalts Virgo &bull; Debilitates Pisces</div>
                    <p className="text-[11px] text-slate-300">
                      Rejoices in Virgo analytical precision and data bookkeeping; speech and calculation drown in Pisces boundless ocean of faith.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                    <div className="font-bold text-blue-300">🪐 Saturn (Shani)</div>
                    <div className="text-[10px] text-slate-400">MT Aquarius (Masses) &bull; Exalts Libra &bull; Debilitates Aries</div>
                    <p className="text-[11px] text-slate-300">
                      Rejoices on Libra balanced scales as impartial judge (Nyayadhikari); ruins patient measured justice in rash Aries speed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: Primacy of Lagnesha Sovereign Shield */}
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-slate-950/80 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🛡️</span>
                  <h4 className="font-bold text-emerald-200 text-sm tracking-wide">
                    3. The Absolute Primacy of Lagnesha Sovereign Shield (Session 80)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-0.5 rounded-lg">
                  {ls.lagnaLord} &bull; House {ls.occupiedHouse} ({ls.occupiedSign})
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-emerald-300 text-sm">
                    Lagna Anchor: {ls.lagnaSign} Lagna &rarr; Lord {ls.lagnaLord} in {ls.dignity}
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-700">
                    {ls.isDebilitated ? "Debilitated Sovereign Shield" : "Active Protection Shield"}
                  </span>
                </div>

                <p className="text-slate-200 leading-relaxed text-[11px]">
                  <strong>The Sovereign Shield Law:</strong> {ls.protectionShieldStatement}
                </p>

                <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-500/20 space-y-1">
                  <div className="font-bold text-amber-300 text-[11px]">Vitalized House Signification:</div>
                  <p className="text-slate-300 text-[11px]">{ls.vitalizedHouseSignification}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-emerald-200">
                  <strong>Shastric Counsel:</strong> {ls.shastricCounsel}
                </div>
              </div>
            </div>

            {/* CARD 4: Real-Time Transit Geometric Dynamics */}
            <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-slate-950/80 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">⚡</span>
                  <h4 className="font-bold text-cyan-200 text-sm tracking-wide">
                    4. Real-Time Transit Geometric Dynamics: Oppositions, 3/11 &amp; 6/8 Axes (Session 81)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-0.5 rounded-lg">
                  {tg.transitOppositions.length} Oppositions &bull; {tg.upachayaInspirations.length} Upachayas
                </span>
              </div>

              {/* Transit Macro Synthesis */}
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                💡 <strong>Transit Geometric Mechanics:</strong> When planets align across 180&deg; direct oppositions, relative strength is determined by dignity and retrogression (Chesta Bala). The stronger planet commands the psychological dialogue. Meanwhile, 3/11 Upachaya relationships inspire constructive action, and 6/8 Shadashtaka alignments trigger moral and ideological friction.
              </div>

              {/* 180° Oppositions Grid */}
              <div className="space-y-2">
                <h5 className="font-bold text-xs text-amber-300">180&deg; Direct Oppositions (Dominance &amp; Chesta Bala):</h5>
                {tg.transitOppositions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                    {tg.transitOppositions.map((op, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-all">
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                          <span className="font-bold text-cyan-300">{op.axisName}</span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                            ⚡ {op.dominantPlanet} Dominates
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300 font-medium">
                          {op.planet1} ({op.planet1Sign} {op.planet1IsRetrograde ? "[Vakri]" : ""}, {op.planet1Dignity}) vs. {op.planet2} ({op.planet2Sign} {op.planet2IsRetrograde ? "[Vakri]" : ""}, {op.planet2Dignity})
                        </div>
                        <p className="text-[10px] text-slate-400"><strong>Dominance Rationale:</strong> {op.dominanceRationale}</p>
                        <p className="text-[11px] text-slate-300 leading-snug">{op.realWorldManifestation}</p>
                        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-[10px] text-emerald-300 leading-snug">
                          <strong>Strategic Leadership Solution:</strong> {op.strategicLeadershipSolution}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No major 180&deg; planetary oppositions active in current transits.</p>
                )}
              </div>

              {/* 3/11 & 6/8 Axes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 3/11 Upachaya */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="font-bold text-emerald-300">🌱 3/11 Upachaya Inspiration Vectors</span>
                  <div className="space-y-2 pt-1">
                    {tg.upachayaInspirations.length > 0 ? (
                      tg.upachayaInspirations.map((up, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] space-y-1">
                          <div className="font-bold text-emerald-200">{up.pair} (3/11 Axis)</div>
                          <p className="text-slate-300">{up.catalyticEffect}</p>
                          <div className="text-[10px] text-slate-400">{up.guidance}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-slate-400">No prominent 3/11 transit alignments.</p>
                    )}
                  </div>
                </div>

                {/* 6/8 Shadashtaka */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="font-bold text-rose-300">⚔️ 6/8 Shadashtaka Friction Vectors</span>
                  <div className="space-y-2 pt-1">
                    {tg.shadashtakaFrictions.length > 0 ? (
                      tg.shadashtakaFrictions.map((sf, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] space-y-1">
                          <div className="font-bold text-rose-200">{sf.pair} (6/8 Axis)</div>
                          <p className="text-slate-300">{sf.catalyticEffect}</p>
                          <div className="text-[10px] text-amber-300/90">{sf.guidance}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-slate-400">No severe 6/8 friction alignments.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Moon-Venus Conjunction & Relational Ethics */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-pink-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-pink-300 text-sm">
                    💎 Transit Moon-Venus Conjunction &amp; Relational Ethics (Session 81)
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${
                      mvt.isConjunctionInTaurus
                        ? "bg-pink-900/80 text-pink-200 border border-pink-700"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {mvt.isConjunctionInTaurus
                      ? "Active in Taurus (Exalted Moon + Swarashi Venus)"
                      : mvt.isConjunctionAnywhere
                      ? `Active in ${mvt.conjunctionSign}`
                      : "Separated Motion"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  <strong>Sensory Intensity:</strong> {mvt.sensoryDesireIntensity}
                </div>
                <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-[11px] text-rose-200">
                  <strong>⚠️ Karmic Warning:</strong> {mvt.karmicWarning}
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-200">
                  <strong>✨ Blessing of Virtuous Conduct:</strong> {mvt.virtuousConductBlessing}
                </div>
                <p className="text-[11px] text-slate-300 pt-1">
                  <strong>Practical Directive:</strong> {mvt.practicalDirective}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 18: THREE RISHIS, SACRED LINEAGE DEITIES & SIGN LORD BLIND SPOTS (SESSIONS 93, 94 & 95) */}
      {activeTab === "rishi_drekkana" && (() => {
        const rd = rishiDrekkanaReport;
        const rishiAlloc = rd.drekkanaRishiAllocations;
        const lineage = rd.sacredLineageDeities;
        const lifeAxis = rd.lifeAxisEntryExit;
        const deepDignity = rd.deepDignityDegrees;
        const blindSpots = rd.nativeSignLordDiagnostics;
        const lagnaDiag = blindSpots.lagnaSignDiagnostic;
        const moonDiag = blindSpots.moonSignDiagnostic;
        const kula = lineage.kulaDevata;

        return (
          <div className="space-y-6">
            {/* Header Hero Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/40 shadow-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                    The Three Sages (Rishi) Modality, Sacred Lineage Deities &amp; 12-Sign Blind Spots (Units 93, 94 &amp; 95)
                  </span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-200 border border-emerald-500/30">
                  Dominant Sage: {rishiAlloc.dominantRishi}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {rd.holisticDossierSummary}
              </p>
            </div>

            {/* CARD 1: Parashari D-3 Drekkana Presiding Sages Allocation */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧘</span>
                  <h3 className="text-sm font-bold text-slate-100">
                    1. Parashari 10&deg; Drekkana (D-3) Presiding Sage Allocation (त्रि-ऋषि द्रेष्काण आवंटन)
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-600/30 text-sky-300">
                    Narada: {rishiAlloc.naradaCount}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-600/30 text-emerald-300">
                    Agastya: {rishiAlloc.agastyaCount}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-600/30 text-amber-300">
                    Durvasa: {rishiAlloc.durvasaCount}
                  </span>
                </div>
              </div>

              {/* Three Rishis Concept Triad */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-200">Devarshi Narada (देवर्षि नारद)</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-sky-900/50 text-sky-300">Movable (Chara)</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Mind, continuous motion, adaptability, traveling across realms chanting <em>Narayana Narayana</em>. Non-attachment and flexible intellect.
                  </p>
                  <p className="text-[10px] text-sky-400 font-mono">
                    Mantra: Om Devarshaye Naradaya Namah
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-200">Brahmarshi Agastya (ब्रह्मर्षि अगस्त्य)</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-900/50 text-emerald-300">Fixed (Sthira)</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Grounded steadfastness, balancing Earth during cosmic imbalance, ocean-drinker, protective anchor of stability and preservation.
                  </p>
                  <p className="text-[10px] text-emerald-400 font-mono">
                    Mantra: Om Brahmarshaye Agastyaya Namah
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-200">Maharshi Durvasa (महर्षि दुर्वासा)</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-amber-900/50 text-amber-300">Dual (Dwiswabhava)</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Fierce penance (Tapasya), boundary tester, burning karmic baggage, demanding uncompromised truth and readiness to release rigid attachments.
                  </p>
                  <p className="text-[10px] text-amber-400 font-mono">
                    Mantra: Om Maharshaye Durvasaya Namah
                  </p>
                </div>
              </div>

              {/* Table of Planets and Rishis */}
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2 px-2.5">Point / Graha</th>
                      <th className="py-2 px-2.5">Sign &amp; Modality</th>
                      <th className="py-2 px-2.5">Degree</th>
                      <th className="py-2 px-2.5">Drekkana (D-3)</th>
                      <th className="py-2 px-2.5">Presiding Sage</th>
                      <th className="py-2 px-2.5">Psychological Expression</th>
                      <th className="py-2 px-2.5">Sage Salutation Mantra</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {rishiAlloc.planets.map((p) => {
                      const badgeColor =
                        p.governingRishi === "Devarshi Narada"
                          ? "bg-sky-950/60 text-sky-300 border-sky-700/50"
                          : p.governingRishi === "Brahmarshi Agastya"
                          ? "bg-emerald-950/60 text-emerald-300 border-emerald-700/50"
                          : "bg-amber-950/60 text-amber-300 border-amber-700/50";

                      return (
                        <tr key={p.planet} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-2 px-2.5 font-bold text-slate-200">{p.planet}</td>
                          <td className="py-2 px-2.5 text-slate-300">
                            {p.signName} <span className="text-[10px] text-slate-400">({p.modality})</span>
                          </td>
                          <td className="py-2 px-2.5 text-slate-400 font-mono">{p.degreeInSign.toFixed(2)}&deg;</td>
                          <td className="py-2 px-2.5 text-slate-300">Drekkana {p.drekkanaNumber}</td>
                          <td className="py-2 px-2.5">
                            <span className={`px-2 py-0.5 rounded font-bold border ${badgeColor}`}>
                              {p.governingRishi}
                            </span>
                          </td>
                          <td className="py-2 px-2.5 text-slate-300 max-w-xs">{p.behavioralExpression}</td>
                          <td className="py-2 px-2.5 font-mono text-[10px] text-emerald-300">{p.salutationMantra}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CARD 2: Sacred Lineage of Houses (Divine Deity Triad & Elemental Propitiation) */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <span className="text-lg">🪷</span>
                <h3 className="text-sm font-bold text-slate-100">
                  2. Sacred Lineage of Houses: Deity Triad &amp; Elemental Propitiation (कुलदेवता, धर्मदेवता व इष्टदेवता)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 4th House Kula Devata */}
                <div className="p-4 rounded-xl bg-gradient-to-b from-blue-950/30 to-slate-900 border border-blue-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                      4th House &rarr; Kula Devata
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-600/40">
                      {kula.element}
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 font-semibold">
                    Sign: {kula.signName} (House {kula.houseNumber}) &bull; Lord: {kula.signLord}
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/20 text-[11px] text-blue-200">
                    <strong>Panchatattva Propitiation Protocol:</strong>
                    <p className="mt-1 text-slate-200">{kula.elementalPropitiationProtocol}</p>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong>Ancestral Guidance:</strong> {kula.ancestralGuidance}
                  </p>
                </div>

                {/* 9th House Dharma Devata */}
                <div className="p-4 rounded-xl bg-gradient-to-b from-purple-950/30 to-slate-900 border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                      9th House &rarr; Dharma Devata
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-600/40">
                      Spiritual Preceptor
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 font-semibold">
                    Sign: {lineage.dharmaDevata.signName} (House {lineage.dharmaDevata.houseNumber}) &bull; Lord: {lineage.dharmaDevata.signLord}
                  </div>
                  <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/20 text-[11px] text-purple-200">
                    <strong>Dharma Guidance:</strong>
                    <p className="mt-1 text-slate-200">{lineage.dharmaDevata.philosophicalGuidance}</p>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong>Spiritual Direction:</strong> Governs preceptors, moral conscience, ancestral blessings, and protective fortune.
                  </p>
                </div>

                {/* 12th House Ishta Devata */}
                <div className="p-4 rounded-xl bg-gradient-to-b from-amber-950/30 to-slate-900 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      12th House &rarr; Ishta Devata
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-600/40">
                      Moksha Guide
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 font-semibold">
                    Sign: {lineage.ishtaDevata.signName} (House {lineage.ishtaDevata.houseNumber}) &bull; Lord: {lineage.ishtaDevata.signLord}
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/20 text-[11px] text-amber-200">
                    <strong>Moksha &amp; Dissolution Guidance:</strong>
                    <p className="mt-1 text-slate-200">{lineage.ishtaDevata.mokshaGuidance}</p>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong>Soul Liberation:</strong> Personal divine archetype guiding subconscious release, meditation, and ultimate soul freedom.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 3: Life Axis of Entry and Exit & 12-Year Change Wave */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <span className="text-lg">⏳</span>
                <h3 className="text-sm font-bold text-slate-100">
                  3. Life Axis of Entry and Exit, 12-Year Change Wave &amp; Deep Dignity Degrees (आयु चक्र व परमोच्च अंश)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: 12-Year Change Wave Tracker */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      3rd House 12-Year Change Wave (Age = 3 + 12k)
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Current Age: {lifeAxis.thirdHouseChangeWave.nativeCurrentAge.toFixed(1)} yrs
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200">
                    <strong>Cycle Telemetry:</strong> {lifeAxis.thirdHouseChangeWave.waveStatusDescription}
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div>
                      <strong>Milestone Change Ages:</strong>{" "}
                      <span className="font-mono text-emerald-400">
                        {lifeAxis.thirdHouseChangeWave.milestoneAges.join(", ")} years
                      </span>
                    </div>
                    <div>
                      <strong>Closest Milestone Wave:</strong> Age {lifeAxis.thirdHouseChangeWave.closestMilestoneAge}
                    </div>
                    <div>
                      <strong>Action Directive:</strong> {lifeAxis.thirdHouseChangeWave.changeInitiativeDirective}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                    <strong>3rd-to-9th House Spiritual Vector:</strong> {lifeAxis.entryExitPhysicalReality.spiritualEvolutionAxis}
                  </div>
                </div>

                {/* Right: Birth (4th) vs Exit (8th) & Deep Exaltation Proximity */}
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1.5 text-[11px]">
                    <div className="font-bold text-slate-200">
                      4th House (Birth Circumstances) vs. 8th House (Transition Environment)
                    </div>
                    <div className="text-slate-300">
                      <strong className="text-sky-300">Birth (4th House):</strong> {lifeAxis.entryExitPhysicalReality.fourthHouseBirthCondition}
                    </div>
                    <div className="text-slate-300">
                      <strong className="text-rose-300">Transition (8th House):</strong> {lifeAxis.entryExitPhysicalReality.eighthHouseExitRelease}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Deep Dignity Proximity (Paramochha &amp; Paramaneecha Orbs)
                    </span>
                    <div className="space-y-1 text-[11px]">
                      {deepDignity.map((d) => (
                        <div key={d.planet} className="flex items-center justify-between text-slate-300">
                          <span className="font-semibold text-slate-200">{d.planet} ({d.currentSign}):</span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {d.isDeeplyExalted || d.isDeeplyDebilitated ? (
                              <span className="text-amber-300 font-bold">{d.dignityPotencyNote}</span>
                            ) : (
                              `Orb to Peak: ${d.distanceFromParamochhaDeg.toFixed(1)}&deg;`
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4: 12-Sign Lord Innate Awareness vs. Subconscious Blind Spot Matrix */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚖️</span>
                  <h3 className="text-sm font-bold text-slate-100">
                    4. 12-Sign Lord Innate Awareness vs. Subconscious Blind Spot Matrix (Session 95)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  Where each sign's ruler exalts (natural mastery) vs. debilitates (inherent blind spot)
                </span>
              </div>

              {/* Native Key Anchor Cards (Lagna & Moon Signs) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lagna Sign */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">
                      Ascendant Sign: {lagnaDiag.signName} (Lord: {lagnaDiag.rulingLord})
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-200">
                      Lagna Anchor
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-200">
                    <strong>Innate Intuitive Competence (House {lagnaDiag.lordExaltationHouseRelative} in {lagnaDiag.lordExaltationSign}):</strong>
                    <p className="mt-0.5 text-slate-200">{lagnaDiag.innateAwarenessCompetence}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-[11px] text-rose-200">
                    <strong>Subconscious Blind Spot (House {lagnaDiag.lordDebilitationHouseRelative} in {lagnaDiag.lordDebilitationSign}):</strong>
                    <p className="mt-0.5 text-slate-200">{lagnaDiag.subconsciousBlindSpot}</p>
                  </div>
                </div>

                {/* Moon Sign */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-sky-950/30 border border-sky-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-300">
                      Moon Sign: {moonDiag.signName} (Lord: {moonDiag.rulingLord})
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-900/60 text-sky-200">
                      Emotional Mind Anchor
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-200">
                    <strong>Emotional Intuitive Competence (House {moonDiag.lordExaltationHouseRelative} in {moonDiag.lordExaltationSign}):</strong>
                    <p className="mt-0.5 text-slate-200">{moonDiag.innateAwarenessCompetence}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-[11px] text-rose-200">
                    <strong>Emotional Blind Spot (House {moonDiag.lordDebilitationHouseRelative} in {moonDiag.lordDebilitationSign}):</strong>
                    <p className="mt-0.5 text-slate-200">{moonDiag.subconsciousBlindSpot}</p>
                  </div>
                </div>
              </div>

              {/* Comprehensive 12 Signs Matrix Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2 px-2.5">Sign</th>
                      <th className="py-2 px-2.5">Ruling Lord</th>
                      <th className="py-2 px-2.5">Lord Exalts In</th>
                      <th className="py-2 px-2.5">Innate Competence Domain</th>
                      <th className="py-2 px-2.5">Lord Debilitates In</th>
                      <th className="py-2 px-2.5">Subconscious Blind Spot &amp; Caution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {blindSpots.all12SignDiagnostics.map((s) => {
                      const isLagna = s.signName === lagnaDiag.signName;
                      const isMoon = s.signName === moonDiag.signName;
                      return (
                        <tr
                          key={s.signName}
                          className={`hover:bg-slate-800/30 transition-colors ${
                            isLagna ? "bg-indigo-950/20 font-semibold" : isMoon ? "bg-sky-950/20" : ""
                          }`}
                        >
                          <td className="py-2 px-2.5 font-bold text-slate-200">
                            {s.signName}
                            {isLagna && <span className="ml-1.5 text-[9px] text-indigo-400 font-bold">(Lagna)</span>}
                            {isMoon && !isLagna && <span className="ml-1.5 text-[9px] text-sky-400 font-bold">(Moon)</span>}
                          </td>
                          <td className="py-2 px-2.5 text-slate-300">{s.rulingLord}</td>
                          <td className="py-2 px-2.5 text-emerald-300">
                            H{s.lordExaltationHouseRelative} ({s.lordExaltationSign})
                          </td>
                          <td className="py-2 px-2.5 text-slate-300 max-w-xs">{s.innateAwarenessCompetence}</td>
                          <td className="py-2 px-2.5 text-rose-300">
                            H{s.lordDebilitationHouseRelative} ({s.lordDebilitationSign})
                          </td>
                          <td className="py-2 px-2.5 text-slate-400 max-w-xs">{s.subconsciousBlindSpot}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}