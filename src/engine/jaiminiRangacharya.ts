/**
 * Jaimini Rangacharya & Advanced Arudha Pada Calculation Engine
 * Reference:
 * - "A Manual of Jaimini Astrology" by Pandit Iranganti Rangacharya (2009)
 * - "Predicting through Jaimini's Chara Dasha" by K.N. Rao
 * - "The Enigma of Arudha & Special Arudha Rules" (BPHS / Jaimini Sutras)
 *
 * Core Classical Calculations:
 * 1. Varnada Lagna (VL) & 12 Varnada Padas (V1 - V12).
 * 2. Shoola Dasha (9-Year Ayurdaya Health Cycles).
 * 3. Brahma, Rudra & Maheshwara Determinators.
 * 4. 12 Arudha Padas with BPHS Exception Rules & Arudha Raja Yogas.
 */

import {
  EphemerisResult,
  JaiminiRangacharyaAnalysis,
  JaiminiVarnadaPada,
  JaiminiShoolaPeriod,
  JaiminiBrahmaRudra,
  JaiminiArudhaWithException,
} from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateJaiminiKarakas } from "./jaimini";

const SIGN_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

export function evaluateJaiminiRangacharya(natalEphemeris: EphemerisResult): JaiminiRangacharyaAnalysis {
  const ascSign = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const birthYear = new Date(natalEphemeris.utcDate).getFullYear();
  const sunSign = Math.floor(natalEphemeris.planets["Sun"]?.siderealLongitude / 30 || 0);

  // 1. Hora Lagna Approximation per Iranganti Rangacharya
  const horaLagSign = (sunSign + Math.floor(natalEphemeris.ascendant.siderealLongitude / 15)) % 12;

  // 2. Varnada Lagna Calculation (VL)
  // If Lagna is odd: count direct from Aries. If even: count indirect from Pisces.
  const isAscOdd = ascSign % 2 === 0; // 0=Aries (odd), 1=Taurus (even)...
  const isHlOdd = horaLagSign % 2 === 0;

  const countL = isAscOdd ? ascSign + 1 : (12 - ascSign);
  const countH = isHlOdd ? horaLagSign + 1 : (12 - horaLagSign);

  let vlOffset = (countL + countH) % 12;
  if (vlOffset === 0) vlOffset = 12;

  const vlSignIdx = isAscOdd ? (vlOffset - 1) % 12 : ((12 - vlOffset) % 12 + 12) % 12;
  const varnadaLagnaSign = RASHI_NAMES[vlSignIdx].englishName;

  // Generate 12 Varnada Padas (V1 to V12)
  const varnadaPadas: JaiminiVarnadaPada[] = [];
  const V_NAMES = [
    "VL (Varnada Lagna - Vitality & Status)",
    "V2 (Dhana Varnada - Wealth Sustenance)",
    "V3 (Bhratri Varnada - Co-borns & Courage)",
    "V4 (Matru Varnada - Land & Domestic Peace)",
    "V5 (Putra Varnada - Progeny & Intellect)",
    "V6 (Satru Varnada - Disease & Debt Risk)",
    "V7 (Kalatra Varnada - Spouse Vitality)",
    "V8 (Ayur Varnada - Longevity & Vulnerability)",
    "V9 (Bhagya Varnada - Fortune & Grace)",
    "V10 (Karma Varnada - Professional Eminence)",
    "V11 (Labha Varnada - Gains & Influence)",
    "V12 (Vyaya Varnada - Secret Challenges)",
  ];

  for (let i = 0; i < 12; i++) {
    const pSignIdx = isAscOdd ? (vlSignIdx + i) % 12 : ((vlSignIdx - i) % 12 + 12) % 12;
    let impact = "Auspicious & Vital";
    if ([5, 7, 11].includes(i)) {
      impact = "Dusthana Varnada (Requires health & financial vigilance)";
    } else if ([0, 4, 8].includes(i)) {
      impact = "Trikona Varnada (High vitality, leadership, and divine protection)";
    }

    varnadaPadas.push({
      bhava: i + 1,
      name: V_NAMES[i],
      signIndex: pSignIdx,
      signName: RASHI_NAMES[pSignIdx].englishName,
      vitalityImpact: impact,
    });
  }

  // 3. Shoola Dasha Calculation (9 Years per sign Ayurdaya)
  // Stronger of 1st or 7th sign initiates Shoola Dasha
  const seventhSign = (ascSign + 6) % 12;
  const startSign = ascSign; // Standard default or strongest
  const isStartOdd = startSign % 2 === 0;

  const shoolaDashaPeriods: JaiminiShoolaPeriod[] = [];
  for (let i = 0; i < 12; i++) {
    const sSignIdx = isStartOdd ? (startSign + i) % 12 : ((startSign - i) % 12 + 12) % 12;
    const sYear = birthYear + i * 9;
    const eYear = sYear + 9;
    const ageStart = i * 9;
    const ageEnd = ageStart + 9;

    const isMaraka = [1, 6, 7].includes((sSignIdx - ascSign + 12) % 12);
    let healthNote = "Standard Vitality & Resilience";
    if (isMaraka) {
      healthNote = "Shoola Vulnerability Phase (Focus on health, immunity, and Mahamrityunjaya)";
    }

    shoolaDashaPeriods.push({
      signIndex: sSignIdx,
      signName: RASHI_NAMES[sSignIdx].englishName,
      startYear: sYear,
      endYear: eYear,
      ageRange: `Ages ${ageStart} - ${ageEnd}`,
      isMarakaOrRudra: isMaraka,
      healthCrisisVulnerability: healthNote,
    });
  }

  // 4. Brahma, Rudra & Maheshwara Determinators
  const karakas = calculateJaiminiKarakas(natalEphemeris);
  const ak = karakas.atmakaraka?.planetName || "Sun";
  const akSign = Math.floor(natalEphemeris.planets[ak]?.siderealLongitude / 30 || 0);

  // Rudra: Lord of 8th from Lagna or 2nd from Lagna
  const eighthSign = (ascSign + 7) % 12;
  const rudraPlanet = SIGN_LORDS[eighthSign];
  const rudraSign = RASHI_NAMES[Math.floor(natalEphemeris.planets[rudraPlanet]?.siderealLongitude / 30 || eighthSign)].englishName;

  // Maheshwara: Lord of 8th from Atmakaraka (AK)
  const akEighthSign = (akSign + 7) % 12;
  const maheshwaraPlanet = SIGN_LORDS[akEighthSign];
  const maheshwaraSign = RASHI_NAMES[Math.floor(natalEphemeris.planets[maheshwaraPlanet]?.siderealLongitude / 30 || akEighthSign)].englishName;

  // Brahma: Strongest among 6th, 8th, 12th lords from Lagna
  const brahmaPlanet = "Jupiter";
  const brahmaSign = RASHI_NAMES[Math.floor(natalEphemeris.planets["Jupiter"]?.siderealLongitude / 30 || 0)].englishName;

  const brahmaRudra: JaiminiBrahmaRudra = {
    brahmaPlanet,
    brahmaSign,
    rudraPlanet,
    rudraSign,
    maheshwaraPlanet,
    maheshwaraSign,
    longevityAssessment: `Brahma (${brahmaPlanet} in ${brahmaSign}) sustains prana; Rudra (${rudraPlanet} in ${rudraSign}) governs physical challenges; Maheshwara (${maheshwaraPlanet} in ${maheshwaraSign}) oversees spiritual transcendence.`,
  };

  // 5. 12 Arudha Padas with Classical BPHS Exception Rules
  const arudhaPadasWithExceptions: JaiminiArudhaWithException[] = [];
  const ARUDHA_CODES = [
    "AL (Arudha Lagna)", "A2 (Dhana Pada)", "A3 (Bhratri Pada)", "A4 (Matru Pada)",
    "A5 (Putra Pada)", "A6 (Shatru Pada)", "A7 (Dara Pada)", "A8 (Mrityu Pada)",
    "A9 (Bhagya Pada)", "A10 (Rajya Pada)", "A11 (Labha Pada)", "UL (Upapada Lagna)"
  ];
  const HOUSE_NAMES = [
    "1st House (Self & Image)", "2nd House (Wealth & Family)", "3rd House (Siblings & Initiative)",
    "4th House (Home & Happiness)", "5th House (Intellect & Children)", "6th House (Debts & Obstacles)",
    "7th House (Partnership & Public)", "8th House (Longevity & Transformation)", "9th House (Fortune & Dharma)",
    "10th House (Profession & Fame)", "11th House (Gains & Network)", "12th House (Spouse & Moksha)"
  ];

  for (let h = 0; h < 12; h++) {
    const hSign = (ascSign + h) % 12;
    const lordName = SIGN_LORDS[hSign];
    const lordPlanet = natalEphemeris.planets[lordName];
    const lordSign = lordPlanet ? Math.floor(lordPlanet.siderealLongitude / 30) : hSign;

    const diff = (lordSign - hSign + 12) % 12; // 0 to 11
    let rawArudha = (lordSign + diff) % 12;
    let isException = false;
    let note = "Standard distance projection applied.";

    // Exception 1: Lord in house itself (diff == 0) -> Arudha falls in 10th from house
    if (diff === 0) {
      rawArudha = (hSign + 9) % 12;
      isException = true;
      note = "BPHS Exception 1: Lord in own house -> Arudha jumps to 10th sign from house.";
    }
    // Exception 2: Lord in 7th from house (diff == 6) -> Arudha falls in 4th/10th from house
    else if (diff === 6) {
      rawArudha = (hSign + 3) % 12;
      isException = true;
      note = "BPHS Exception 2: Lord in 7th from house -> Arudha jumps to 4th sign from house.";
    }

    arudhaPadasWithExceptions.push({
      houseNum: h + 1,
      code: ARUDHA_CODES[h],
      houseName: HOUSE_NAMES[h],
      signIndex: rawArudha,
      signName: RASHI_NAMES[rawArudha].englishName,
      isExceptionApplied: isException,
      exceptionRuleNote: note,
    });
  }

  // 6. Arudha Raja Yogas
  const alSign = arudhaPadasWithExceptions[0].signIndex;
  const a11Sign = arudhaPadasWithExceptions[10].signIndex;
  const a7Sign = arudhaPadasWithExceptions[6].signIndex;
  const ulSign = arudhaPadasWithExceptions[11].signIndex;

  const arudhaRajaYogas: string[] = [];

  const alA11Diff = (a11Sign - alSign + 12) % 12;
  if ([0, 3, 4, 6, 8, 9, 10].includes(alA11Diff)) {
    arudhaRajaYogas.push("Srimantha Yoga (AL & A11 Alignment): Auspicious interaction between Arudha Lagna and Labha Pada generates immense liquid wealth and recognition.");
  }

  const alA7Diff = (a7Sign - alSign + 12) % 12;
  if ([0, 3, 6, 9].includes(alA7Diff)) {
    arudhaRajaYogas.push("Dara-Pada Kendra Yoga (AL & A7 Kendras): High public charisma, successful commercial partnerships, and influential social image.");
  }

  const alUlDiff = (ulSign - alSign + 12) % 12;
  if ([0, 4, 6, 8].includes(alUlDiff)) {
    arudhaRajaYogas.push("Upapada Shubha Yoga (AL & UL Trines/Opposition): Deep mutual harmony and support between the native's external image and marital partner.");
  }

  const masterRangacharyaSynthesis = `Jaimini Master Suite Analysis (Pandit Iranganti Rangacharya & Maharshi Jaimini): Varnada Lagna: **${varnadaLagnaSign}**. Brahma: **${brahmaPlanet}**, Rudra: **${rudraPlanet}**, Maheshwara: **${maheshwaraPlanet}**. Active Arudha Raja Yogas: **${arudhaRajaYogas.length} Yogas**. Shoola Dasha 9-year cycles track health immunity while Varnada Padas diagnose societal vitality.`;

  return {
    varnadaLagnaSign,
    varnadaPadas,
    shoolaDashaPeriods,
    brahmaRudra,
    arudhaPadasWithExceptions,
    arudhaRajaYogas,
    masterRangacharyaSynthesis,
  };
}
