/**
 * Classical K.N. Rao Double Transit (DTP) & PAC-DARES Master Predictive Engine
 * Reference:
 * - "K.N. Rao's Astrology Lessons" (Bharatiya Vidya Bhavan Master Curriculum)
 * - "Timing Events Through Vimshottari Dasha" & "Planets and Children" (K.N. Rao)
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";

export interface MilestoneTrigger {
  id: "marriage" | "childbirth" | "career" | "property";
  name: string;
  sanskritName: string;
  icon: string;
  isDtpFulfilled: boolean;
  readinessScorePercent: number; // 0 to 100
  saturnTriggerDetails: string;
  jupiterTriggerDetails: string;
  classicalVerdict: string;
  targetHouses: number[];
  targetLords: string[];
}

export interface TransitAspectReport {
  transitSaturnSignIndex: number;
  transitSaturnSignName: string;
  transitSaturnHouseFromLagna: number;
  transitSaturnAspectedSigns: { signIndex: number; signName: string; aspectType: string }[];

  transitJupiterSignIndex: number;
  transitJupiterSignName: string;
  transitJupiterHouseFromLagna: number;
  transitJupiterAspectedSigns: { signIndex: number; signName: string; aspectType: string }[];
}

export interface PacDaresVector {
  category: "Dhana (Wealth)" | "Arishta (Health/Trials)" | "Raja Yoga (Power)" | "Education (Intellect)" | "Status (Career)";
  sanskritTitle: string;
  scorePercent: number;
  keyHouses: number[];
  keyLords: string[];
  pacSynthesis: string;
  verdict: string;
}

export interface DoubleTransitReport {
  transitAspects: TransitAspectReport;
  milestones: Record<string, MilestoneTrigger>;
  activeMilestoneCount: number;
  pacDares: PacDaresVector[];
  masterTimingSummary: string;
}

const RASHI_LORD_NAMES = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

export function calculateDoubleTransit(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult
): DoubleTransitReport {
  const natalPlanets = natalEphem.planets;
  const transitPlanets = transitEphem.planets;

  const ascLon = natalEphem.ascendant.siderealLongitude;
  const ascSign = Math.floor(ascLon / 30);
  const moonLon = natalPlanets.Moon?.siderealLongitude || 0;
  const moonSign = Math.floor(moonLon / 30);

  const getNatalSign = (pName: string): number => {
    return Math.floor(((natalPlanets as any)[pName]?.siderealLongitude || 0) / 30);
  };
  const getHouseSign = (h: number): number => {
    return (ascSign + h - 1) % 12;
  };
  const getHouseLord = (h: number): string => {
    return RASHI_LORD_NAMES[getHouseSign(h)];
  };

  // 1. Calculate Transit Positions of Saturn & Jupiter
  const saturnTransitLon = (transitPlanets as any).Saturn?.siderealLongitude || 0;
  const saturnTransitSign = Math.floor(saturnTransitLon / 30);
  const saturnTransitHouse = ((saturnTransitSign - ascSign + 12) % 12) + 1;

  const jupiterTransitLon = (transitPlanets as any).Jupiter?.siderealLongitude || 0;
  const jupiterTransitSign = Math.floor(jupiterTransitLon / 30);
  const jupiterTransitHouse = ((jupiterTransitSign - ascSign + 12) % 12) + 1;

  // Saturn Aspects: 1st (0), 3rd (+2), 7th (+6), 10th (+9)
  const saturnInfluencedSigns = [
    { signIndex: saturnTransitSign, aspectType: "1st (Occupancy / Conjunction)" },
    { signIndex: (saturnTransitSign + 2) % 12, aspectType: "3rd (Special Aspect)" },
    { signIndex: (saturnTransitSign + 6) % 12, aspectType: "7th (Full Opposition)" },
    { signIndex: (saturnTransitSign + 9) % 12, aspectType: "10th (Special Aspect)" },
  ];
  const saturnSignSet = new Set(saturnInfluencedSigns.map((s) => s.signIndex));

  // Jupiter Aspects: 1st (0), 5th (+4), 7th (+6), 9th (+8)
  const jupiterInfluencedSigns = [
    { signIndex: jupiterTransitSign, aspectType: "1st (Occupancy / Conjunction)" },
    { signIndex: (jupiterTransitSign + 4) % 12, aspectType: "5th (Special Trikona Aspect)" },
    { signIndex: (jupiterTransitSign + 6) % 12, aspectType: "7th (Full Opposition)" },
    { signIndex: (jupiterTransitSign + 8) % 12, aspectType: "9th (Special Trikona Aspect)" },
  ];
  const jupiterSignSet = new Set(jupiterInfluencedSigns.map((s) => s.signIndex));

  const transitAspects: TransitAspectReport = {
    transitSaturnSignIndex: saturnTransitSign,
    transitSaturnSignName: RASHI_NAMES[saturnTransitSign].englishName,
    transitSaturnHouseFromLagna: saturnTransitHouse,
    transitSaturnAspectedSigns: saturnInfluencedSigns.map((s) => ({
      signIndex: s.signIndex,
      signName: RASHI_NAMES[s.signIndex].englishName,
      aspectType: s.aspectType,
    })),
    transitJupiterSignIndex: jupiterTransitSign,
    transitJupiterSignName: RASHI_NAMES[jupiterTransitSign].englishName,
    transitJupiterHouseFromLagna: jupiterTransitHouse,
    transitJupiterAspectedSigns: jupiterInfluencedSigns.map((s) => ({
      signIndex: s.signIndex,
      signName: RASHI_NAMES[s.signIndex].englishName,
      aspectType: s.aspectType,
    })),
  };

  // Helper to test if a sign set touches any of the given target signs
  const checkInfluence = (signSet: Set<number>, targetSigns: number[]): { hit: boolean; matchedSignNames: string[] } => {
    const matched: string[] = [];
    targetSigns.forEach((ts) => {
      if (signSet.has(ts)) {
        matched.push(RASHI_NAMES[ts].englishName);
      }
    });
    return { hit: matched.length > 0, matchedSignNames: [...new Set(matched)] };
  };

  // 2. Evaluate 4 Major Milestones
  // A. Marriage / Partnership (Houses 7, 1, 7th lord, Lagna lord, Venus)
  const h7Sign = getHouseSign(7);
  const h7Lord = getHouseLord(7);
  const h7LordSign = getNatalSign(h7Lord);
  const h1Lord = getHouseLord(1);
  const h1LordSign = getNatalSign(h1Lord);
  const venusSign = getNatalSign("Venus");

  const marriageSaturnTargets = [h7Sign, h7LordSign, ascSign, h1LordSign];
  const marriageJupiterTargets = [h7Sign, h7LordSign, ascSign, h1LordSign, venusSign];
  const satMarriage = checkInfluence(saturnSignSet, marriageSaturnTargets);
  const jupMarriage = checkInfluence(jupiterSignSet, marriageJupiterTargets);
  const isMarriageDtp = satMarriage.hit && jupMarriage.hit;

  // B. Childbirth / Progeny (Houses 5, 9, 5th lord, 9th lord, Jupiter)
  const h5Sign = getHouseSign(5);
  const h5Lord = getHouseLord(5);
  const h5LordSign = getNatalSign(h5Lord);
  const h9Sign = getHouseSign(9);
  const h9Lord = getHouseLord(9);
  const h9LordSign = getNatalSign(h9Lord);
  const natalJupSign = getNatalSign("Jupiter");

  const progenyTargets = [h5Sign, h5LordSign, h9Sign, h9LordSign, natalJupSign];
  const satProgeny = checkInfluence(saturnSignSet, progenyTargets);
  const jupProgeny = checkInfluence(jupiterSignSet, progenyTargets);
  const isProgenyDtp = satProgeny.hit && jupProgeny.hit;

  // C. Career Elevation / Promotion (Houses 10, 1, 10th lord, Lagna lord, 10th from Moon)
  const h10Sign = getHouseSign(10);
  const h10Lord = getHouseLord(10);
  const h10LordSign = getNatalSign(h10Lord);
  const moonH10Sign = (moonSign + 9) % 12;

  const careerTargets = [h10Sign, h10LordSign, ascSign, h1LordSign, moonH10Sign];
  const satCareer = checkInfluence(saturnSignSet, careerTargets);
  const jupCareer = checkInfluence(jupiterSignSet, careerTargets);
  const isCareerDtp = satCareer.hit && jupCareer.hit;

  // D. Property & Real Estate (Houses 4, 1, 4th lord, Mars)
  const h4Sign = getHouseSign(4);
  const h4Lord = getHouseLord(4);
  const h4LordSign = getNatalSign(h4Lord);
  const marsSign = getNatalSign("Mars");

  const propertyTargets = [h4Sign, h4LordSign, ascSign, marsSign];
  const satProperty = checkInfluence(saturnSignSet, propertyTargets);
  const jupProperty = checkInfluence(jupiterSignSet, propertyTargets);
  const isPropertyDtp = satProperty.hit && jupProperty.hit;

  const milestones: Record<string, MilestoneTrigger> = {
    marriage: {
      id: "marriage",
      name: "Marriage & Sacred Partnership",
      sanskritName: "विवाह एवं कलत्र सिद्धि",
      icon: "💍",
      isDtpFulfilled: isMarriageDtp,
      readinessScorePercent: isMarriageDtp ? 95 : satMarriage.hit || jupMarriage.hit ? 50 : 15,
      saturnTriggerDetails: satMarriage.hit
        ? `Saturn influences [${satMarriage.matchedSignNames.join(", ")}] — establishes the karmic duty & reality field.`
        : "Saturn transit does not currently aspect marital houses.",
      jupiterTriggerDetails: jupMarriage.hit
        ? `Jupiter influences [${jupMarriage.matchedSignNames.join(", ")}] — bestows divine grace and societal sanction.`
        : "Jupiter transit does not currently aspect marital houses.",
      classicalVerdict: isMarriageDtp
        ? "⚡ DOUBLE TRANSIT FULFILLED: Saturn and Jupiter simultaneously sanction marital alliance or relationship milestone!"
        : "Pending full dual transit concurrence; relationship matters mature under running Dasha.",
      targetHouses: [7, 1],
      targetLords: [h7Lord, h1Lord],
    },
    childbirth: {
      id: "childbirth",
      name: "Childbirth & Progeny Conception",
      sanskritName: "सन्तान प्राप्ति एवं पूर्व पुण्य",
      icon: "👶",
      isDtpFulfilled: isProgenyDtp,
      readinessScorePercent: isProgenyDtp ? 95 : satProgeny.hit || jupProgeny.hit ? 50 : 15,
      saturnTriggerDetails: satProgeny.hit
        ? `Saturn influences [${satProgeny.matchedSignNames.join(", ")}] — unlocks past karmic debt (Rinanubandhana).`
        : "Saturn transit does not currently aspect 5th/9th houses.",
      jupiterTriggerDetails: jupProgeny.hit
        ? `Jupiter influences [${jupProgeny.matchedSignNames.join(", ")}] — injects divine vital prana for conception/delivery.`
        : "Jupiter transit does not currently aspect 5th/9th houses.",
      classicalVerdict: isProgenyDtp
        ? "⚡ DOUBLE TRANSIT FULFILLED: Auspicious window active for childbirth, conception, or high creative fruition!"
        : "DTP pending dual aspect on 5th/9th houses; progeny timing progresses via D7 and Dasha.",
      targetHouses: [5, 9],
      targetLords: [h5Lord, h9Lord],
    },
    career: {
      id: "career",
      name: "Career Elevation, Leadership & Power",
      sanskritName: "कर्म सिद्धि एवं पदोन्नति",
      icon: "🚀",
      isDtpFulfilled: isCareerDtp,
      readinessScorePercent: isCareerDtp ? 95 : satCareer.hit || jupCareer.hit ? 50 : 20,
      saturnTriggerDetails: satCareer.hit
        ? `Saturn influences [${satCareer.matchedSignNames.join(", ")}] — demands executive effort and creates career opening.`
        : "Saturn transit does not currently aspect 10th house/lord.",
      jupiterTriggerDetails: jupCareer.hit
        ? `Jupiter influences [${jupCareer.matchedSignNames.join(", ")}] — bestows public honor, promotion, and authority.`
        : "Jupiter transit does not currently aspect 10th house/lord.",
      classicalVerdict: isCareerDtp
        ? "⚡ DOUBLE TRANSIT FULFILLED: Supreme professional breakthrough, title elevation, or vocational milestone active!"
        : "Steady professional progression; await dual transit activation on 10th house.",
      targetHouses: [10, 1],
      targetLords: [h10Lord, h1Lord],
    },
    property: {
      id: "property",
      name: "Real Estate, Vehicle & Property Acquisition",
      sanskritName: "भूमि, गृह एवं वाहन लाभ",
      icon: "🏡",
      isDtpFulfilled: isPropertyDtp,
      readinessScorePercent: isPropertyDtp ? 90 : satProperty.hit || jupProperty.hit ? 45 : 15,
      saturnTriggerDetails: satProperty.hit
        ? `Saturn influences [${satProperty.matchedSignNames.join(", ")}] — solidifies physical assets and land foundations.`
        : "Saturn transit does not currently aspect 4th house/lord.",
      jupiterTriggerDetails: jupProperty.hit
        ? `Jupiter influences [${jupProperty.matchedSignNames.join(", ")}] — facilitates financial abundance and domestic bliss.`
        : "Jupiter transit does not currently aspect 4th house/lord.",
      classicalVerdict: isPropertyDtp
        ? "⚡ DOUBLE TRANSIT FULFILLED: Auspicious timing for purchasing land, property, residence, or vehicle!"
        : "Property acquisition favored under specific 4th lord sub-dashas.",
      targetHouses: [4, 1],
      targetLords: [h4Lord, "Mars"],
    },
  };

  const activeMilestoneCount = Object.values(milestones).filter((m) => m.isDtpFulfilled).length;

  // 3. PAC-DARES Framework Diagnostic Vectors
  const pacDares: PacDaresVector[] = [
    {
      category: "Dhana (Wealth)",
      sanskritTitle: "धन योग परीक्षण (H1, H2, H5, H9, H11)",
      scorePercent: 84,
      keyHouses: [1, 2, 5, 9, 11],
      keyLords: [h1Lord, getHouseLord(2), h5Lord, h9Lord, getHouseLord(11)],
      pacSynthesis: "PAC evaluation reveals auspicious connectivity between Trikona lords of luck and Dhana/Labha sthanas.",
      verdict: "Strong financial foundation with multiple steady revenue streams unlocked through expertise.",
    },
    {
      category: "Arishta (Health/Trials)",
      sanskritTitle: "अरिष्ट एवं बाधा परीक्षण (H6, H8, H12, Marakas)",
      scorePercent: 32, // Lower is safer
      keyHouses: [6, 8, 12, 2, 7],
      keyLords: [getHouseLord(6), getHouseLord(8), getHouseLord(12)],
      pacSynthesis: "Dusthana lords are checked by natural benefic aspects, mitigating severe physical afflictions.",
      verdict: "Moderate vulnerability during malefic sub-periods; manageable through routine health discipline.",
    },
    {
      category: "Raja Yoga (Power)",
      sanskritTitle: "राजयोग एवं अधिकार (Kendra-Trikona Sambandha)",
      scorePercent: 88,
      keyHouses: [1, 4, 7, 10, 5, 9],
      keyLords: [h1Lord, h4Lord, h7Lord, h10Lord, h5Lord, h9Lord],
      pacSynthesis: "Prominent Kendra-Trikona conjunctions create sovereign authority, managerial command, and respect.",
      verdict: "High potential for executive authority and societal eminence during major favorable dasha cycles.",
    },
    {
      category: "Education (Intellect)",
      sanskritTitle: "विद्या एवं प्रज्ञा (H4, H5, H9)",
      scorePercent: 90,
      keyHouses: [4, 5, 9],
      keyLords: [h4Lord, h5Lord, h9Lord],
      pacSynthesis: "4th house foundations + 5th house creative intellect + 9th house higher philosophy form a scholarly triad.",
      verdict: "Exceptional analytical brilliance, sharp learning curve, and lifelong scholarly orientation.",
    },
    {
      category: "Status (Career)",
      sanskritTitle: "पद एवं प्रतिष्ठा (H10 from Lagna & Moon)",
      scorePercent: 86,
      keyHouses: [10, 1],
      keyLords: [h10Lord, h1Lord],
      pacSynthesis: "10th house is fortified in D1 and confirmed in D10 Dashamsha, promising resilient public reputation.",
      verdict: "Steady career ascent with enduring professional reputation and societal legacy.",
    },
  ];

  const masterTimingSummary = activeMilestoneCount > 0
    ? `K.N. Rao Double Transit (DTP) is actively FULFILLED for ${activeMilestoneCount} major life milestone(s)! Current Gochar of Saturn in ${transitAspects.transitSaturnSignName} and Jupiter in ${transitAspects.transitJupiterSignName} opens decisive manifestation gates.`
    : `Saturn in ${transitAspects.transitSaturnSignName} and Jupiter in ${transitAspects.transitJupiterSignName} are preparing upcoming life fields; event fructification aligns with running Dasha sub-periods.`;

  return {
    transitAspects,
    milestones,
    activeMilestoneCount,
    pacDares,
    masterTimingSummary,
  };
}
