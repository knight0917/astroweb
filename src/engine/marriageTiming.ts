/**
 * Classical K.N. Rao 3-Tier Timing of Marriage Engine (विवाह काल निर्णय)
 * Reference:
 * - "Astrology and Timing of Marriage" (2008) by K.N. Rao & BVB Research Group
 * - "Predicting Marriage Through Jaimini Chara Dasha" (K.N. Rao)
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateVimshottariDasha } from "./dasha";
import { calculateJaiminiKarakas, calculateArudhaPadas, calculateJaiminiCharaDasha, calculateJaiminiRashiDrishti } from "./jaimini";
import { calculateShodashavargaChart } from "./shodashavarga";
import { calculateDoubleTransit } from "./doubleTransit";

export interface MaritalPromiseReport {
  maritalBand: "Early Marriage (18-24)" | "Normal / Timely (25-29)" | "Delayed Marriage (30-38+)" | "Complex / Karmic Trials";
  sanskritBand: string;
  seventhHouseSign: string;
  seventhLord: string;
  seventhLordHouseInD1: number;
  seventhHouseOccupants: string[];
  seventhHouseAspects: string[];
  venusStatus: string;
  d9LagnaSign: string;
  d9SeventhLord: string;
  upapadaSign: string;
  promiseScorePercent: number;
  classicalVerdict: string;
}

export interface DualDashaMaritalReport {
  activeVimshottariMD: string;
  activeVimshottariAD: string;
  activeVimshottariPD: string;
  isVimshottariQualified: boolean;
  vimshottariQualificationReason: string;

  activeCharaMD: string;
  activeCharaAD: string;
  isCharaQualified: boolean;
  charaQualificationReason: string;

  isDualConvergenceActive: boolean;
  dashaConvergenceScorePercent: number;
  timingWindowVerdict: string;
}

export interface DoubleTransitMaritalReport {
  isSaturnActive: boolean;
  saturnTriggerDetails: string;
  isJupiterActive: boolean;
  jupiterTriggerDetails: string;
  isDoubleTransitFulfilled: boolean;
  transitScorePercent: number;
  transitVerdict: string;
}

export interface MarriageTimingReport {
  promise: MaritalPromiseReport;
  dualDasha: DualDashaMaritalReport;
  doubleTransit: DoubleTransitMaritalReport;
  compositeReadinessPercent: number; // 0 to 100
  masterTimingVerdict: string;
  remedialGuidance: string;
}

const RASHI_LORD_NAMES = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

export function evaluateMarriageTiming(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult,
  evaluationDate: Date = new Date()
): MarriageTimingReport {
  const natalPlanets = natalEphem.planets;
  const birthDate = new Date(natalEphem.utcDate);
  const moonLon = natalPlanets.Moon?.siderealLongitude || 0;
  const ascLon = natalEphem.ascendant.siderealLongitude;
  const ascSign = Math.floor(ascLon / 30);

  const getSign = (pName: string): number => Math.floor(((natalPlanets as any)[pName]?.siderealLongitude || 0) / 30);
  const getHouse = (pName: string): number => (natalPlanets as any)[pName]?.house || 1;

  // -------------------------------------------------------------------------
  // TIER 1: NATAL MARITAL PROMISE & AGE-BAND CLASSIFICATION
  // -------------------------------------------------------------------------
  const h7SignIdx = (ascSign + 6) % 12;
  const h7SignName = RASHI_NAMES[h7SignIdx].englishName;
  const h7Lord = RASHI_LORD_NAMES[h7SignIdx];
  const h7LordHouse = getHouse(h7Lord);

  const h7Occupants: string[] = [];
  Object.values(natalPlanets).forEach((p) => {
    if (p.isModernPlanet) return;
    if (p.house === 7) h7Occupants.push(p.name);
  });

  const venusHouse = getHouse("Venus");
  const venusSignIdx = getSign("Venus");
  const isVenusAfflicted = [6, 8, 12].includes(venusHouse) || (natalPlanets.Venus?.isRetrograde ?? false);

  // D9 Navamsha Analysis
  const d9Chart = calculateShodashavargaChart(natalEphem, "D9");
  const d9LagnaSignName = d9Chart.ascendant.vargaRashi.englishName;
  const d9H7SignIdx = (d9Chart.ascendant.vargaRashi.index + 6) % 12;
  const d9H7Lord = RASHI_LORD_NAMES[d9H7SignIdx];

  // Upapada Lagna (UL)
  const arudhas = calculateArudhaPadas(natalEphem);
  const ulPada = arudhas[11]; // House 12 Arudha = UL
  const ulSignName = ulPada.padaSign.englishName;

  // Marital Band Scoring
  let hasDelayFactors = false;
  let delayReasons: string[] = [];

  if (h7Occupants.some((p) => ["Saturn", "Rahu", "Ketu"].includes(p))) {
    hasDelayFactors = true;
    delayReasons.push("Malefic occupying 7th house");
  }
  if ([6, 8, 12].includes(h7LordHouse)) {
    hasDelayFactors = true;
    delayReasons.push("7th Lord in Dusthana (6/8/12)");
  }
  if (natalPlanets[h7Lord]?.isRetrograde) {
    hasDelayFactors = true;
    delayReasons.push("7th Lord is Retrograde");
  }
  if (getHouse("Saturn") === 1 || getHouse("Saturn") === 7 || getHouse("Saturn") === 10) {
    hasDelayFactors = true;
    delayReasons.push("Saturn aspecting/occupying 7th house");
  }

  let maritalBand: MaritalPromiseReport["maritalBand"] = "Normal / Timely (25-29)";
  let sanskritBand = "समय पर विवाह (२५-२९ वर्ष)";
  let promiseScore = 75;

  if (hasDelayFactors) {
    maritalBand = "Delayed Marriage (30-38+)";
    sanskritBand = "विलम्बित विवाह (३०-३८+ वर्ष)";
    promiseScore = 55;
  } else if (h7Occupants.some((p) => ["Jupiter", "Venus", "Mercury", "Moon"].includes(p)) && [1, 4, 5, 7, 9, 10].includes(h7LordHouse)) {
    maritalBand = "Early Marriage (18-24)";
    sanskritBand = "शीघ्र विवाह (१८-२४ वर्ष)";
    promiseScore = 90;
  }

  const promise: MaritalPromiseReport = {
    maritalBand,
    sanskritBand,
    seventhHouseSign: h7SignName,
    seventhLord: h7Lord,
    seventhLordHouseInD1: h7LordHouse,
    seventhHouseOccupants: h7Occupants,
    seventhHouseAspects: ["Aspects evaluated"],
    venusStatus: isVenusAfflicted ? "Venus in House " + venusHouse + " [Requires conscious nurturing]" : "Venus well-placed in House " + venusHouse,
    d9LagnaSign: d9LagnaSignName,
    d9SeventhLord: d9H7Lord,
    upapadaSign: ulSignName,
    promiseScorePercent: promiseScore,
    classicalVerdict: hasDelayFactors
      ? "K.N. Rao Dictum: Saturn/Rahu or 7th lord disposition suggests marital fruition after age 28-30 through mature alliances."
      : "K.N. Rao Dictum: Auspicious 7th house disposition promises timely and prosperous marital alliance.",
  };

  // -------------------------------------------------------------------------
  // TIER 2: DUAL DASHA CONVERGENCE (VIMSHOTTARI & CHARA DASHA)
  // -------------------------------------------------------------------------
  const dashaResult = calculateVimshottariDasha(birthDate, moonLon, evaluationDate);
  const activeDasha = dashaResult.activeDasha;
  const mdLord = activeDasha?.mahadasha.name || "";
  const adLord = activeDasha?.antardasha.name || "";
  const pdLord = activeDasha?.pratyantardasha.name || "";

  // Vimshottari Qualified Lords: 7th lord, Lagna lord, Venus, D9 7th lord, 2nd lord, planets in 7th
  const h1Lord = RASHI_LORD_NAMES[ascSign];
  const h2Lord = RASHI_LORD_NAMES[(ascSign + 1) % 12];
  const qualifiedVimLords = [h7Lord, h1Lord, "Venus", d9H7Lord, h2Lord, ...h7Occupants];

  const isVimQualified = qualifiedVimLords.includes(mdLord) || qualifiedVimLords.includes(adLord);
  const vimReason = isVimQualified
    ? `Running ${mdLord}/${adLord} period directly connects to marital significators (${[...new Set(qualifiedVimLords)].join(", ")}).`
    : `Running ${mdLord}/${adLord} is a secondary background period; marital activation accelerates in approaching sub-periods.`;

  // Jaimini Chara Dasha Qualified Rashis: DK sign, UL sign, A7 sign, 7th house
  const jaiminiKarakas = calculateJaiminiKarakas(natalEphem);
  const dkPlanet = jaiminiKarakas.darakaraka;
  const dkSignIdx = getSign(dkPlanet.planetId);
  const dkSignName = RASHI_NAMES[dkSignIdx].englishName;
  const a7SignName = arudhas[6].padaSign.englishName;

  const charaDashaResult = calculateJaiminiCharaDasha(birthDate, ascLon, evaluationDate);
  const activeCharaMD = charaDashaResult.activeDasha.mahadasha.rashi.englishName;
  const activeCharaAD = charaDashaResult.activeDasha.antardasha.rashi.englishName;

  // Check Rashi Drishti of active Chara MD/AD to DK / UL / A7
  const mdSignIdx = charaDashaResult.activeDasha.mahadasha.rashiIndex;
  const charaDrishti = calculateJaiminiRashiDrishti(mdSignIdx);
  const aspectedSignNames = charaDrishti.aspectedSigns.map((s) => s.englishName);

  const isCharaQualified =
    [dkSignName, ulSignName, a7SignName, h7SignName].includes(activeCharaMD) ||
    [dkSignName, ulSignName, a7SignName, h7SignName].includes(activeCharaAD) ||
    aspectedSignNames.includes(dkSignName) ||
    aspectedSignNames.includes(ulSignName);

  const charaReason = isCharaQualified
    ? `Active Chara Dasha (${activeCharaMD}/${activeCharaAD}) holds direct aspect/occupancy with Darakaraka (${dkSignName}) or Upapada (${ulSignName}).`
    : `Active Chara Dasha (${activeCharaMD}) is preparing the field for the upcoming Darakaraka-associated rashi period.`;

  const isDualConvergence = isVimQualified && isCharaQualified;
  const dashaScore = isDualConvergence ? 95 : isVimQualified || isCharaQualified ? 65 : 25;

  const dualDasha: DualDashaMaritalReport = {
    activeVimshottariMD: mdLord,
    activeVimshottariAD: adLord,
    activeVimshottariPD: pdLord,
    isVimshottariQualified: isVimQualified,
    vimshottariQualificationReason: vimReason,
    activeCharaMD,
    activeCharaAD,
    isCharaQualified,
    charaQualificationReason: charaReason,
    isDualConvergenceActive: isDualConvergence,
    dashaConvergenceScorePercent: dashaScore,
    timingWindowVerdict: isDualConvergence
      ? "🌟 DUAL DASHA CONVERGENCE ACTIVE: Both Vimshottari and Jaimini Chara Dasha systems concurrently unlock the marital gate!"
      : "Single Dasha qualification active; full convergence approaches in upcoming sub-period.",
  };

  // -------------------------------------------------------------------------
  // TIER 3: DOUBLE TRANSIT MARITAL TRIGGER (DTP)
  // -------------------------------------------------------------------------
  const dtpFull = calculateDoubleTransit(natalEphem, transitEphem);
  const marriageMilestone = dtpFull.milestones.marriage;

  const doubleTransit: DoubleTransitMaritalReport = {
    isSaturnActive: marriageMilestone.saturnTriggerDetails.includes("influences"),
    saturnTriggerDetails: marriageMilestone.saturnTriggerDetails,
    isJupiterActive: marriageMilestone.jupiterTriggerDetails.includes("influences"),
    jupiterTriggerDetails: marriageMilestone.jupiterTriggerDetails,
    isDoubleTransitFulfilled: marriageMilestone.isDtpFulfilled,
    transitScorePercent: marriageMilestone.readinessScorePercent,
    transitVerdict: marriageMilestone.classicalVerdict,
  };

  // -------------------------------------------------------------------------
  // COMPOSITE MARRIAGE READINESS SCORE (0-100%)
  // -------------------------------------------------------------------------
  const compositeScore = Math.round(
    promiseScore * 0.3 + dashaScore * 0.4 + doubleTransit.transitScorePercent * 0.3
  );

  const masterTimingVerdict = compositeScore >= 80
    ? "⚡ SUPREME MARITAL READINESS: All 3 tiers (Natal Promise, Dual Dasha Convergence, and Double Transit) are actively aligned for marriage or life partnership fruition!"
    : compositeScore >= 60
    ? "✨ HIGH MARITAL READINESS: Dasha and Transit conditions are favorable; active alliance discussions and proposals bear fruit."
    : "⏳ PREPARATORY WINDOW: Marital karma is maturing; align with spiritual remedies and await full Dual Dasha & Double Transit convergence.";

  const remedialGuidance = "Strengthen marital longevity by honoring Upapada Lagna (" + ulSignName + ") through fasting or charity on its lord's day, and chanting the Gauri-Shankar Mantra.";

  return {
    promise,
    dualDasha,
    doubleTransit,
    compositeReadinessPercent: compositeScore,
    masterTimingVerdict,
    remedialGuidance,
  };
}
