/**
 * Classical Tajik Prashna (Horary / Question Astrology) Engine (ताजिक प्रश्न तन्त्र)
 * References:
 * - Prasna Tantra (प्रश्न तन्त्र by Neelakantha)
 * - Tajika Neelakanthi (ताजिक नीलकण्ठी)
 * - Daivajna Vallabha (दैवज्ञ वल्लभा by Varahamihira)
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";

export type PrashnaTopic =
  | "career"
  | "finance"
  | "marriage"
  | "health"
  | "travel"
  | "property"
  | "litigation"
  | "childbirth"
  | "generalSuccess";

export interface PrashnaTopicInfo {
  id: PrashnaTopic;
  title: string;
  sanskritTitle: string;
  karyaHouse: number;
  significations: string;
}

export interface TajikaYogaResult {
  name: string;
  sanskritName: string;
  isFormed: boolean;
  type: "Auspicious (शुभ)" | "Inauspicious (अशुभ)" | "Neutral (तटस्थ)";
  description: string;
  impactOnOutcome: "Strong Positive" | "Moderate Positive" | "Negative" | "Delays / Obstacles";
}

export interface PrashnaAnalysisResult {
  topic: PrashnaTopicInfo;
  queryTime: Date;
  seedNumber?: number;
  lagnaSign: string;
  lagnaDegree: string;
  lagnesha: string;
  karyesha: string;
  karyaHouse: number;
  moonSign: string;
  moonNakshatra: string;
  isMoonVoidOfCourse: boolean;
  applyingAspect: {
    isApplying: boolean;
    aspectAngle: number;
    aspectType: "Conjunction (0°)" | "Sextile (60°)" | "Square (90°)" | "Trine (120°)" | "Opposition (180°)" | "None";
    orbDegrees: number;
    maxAllowedOrb: number;
    isWithinOrb: boolean;
  };
  detectedYogas: TajikaYogaResult[];
  verdict: "Definite YES (अवश्य सिद्धि)" | "Probable YES with Effort (प्रयत्नपूर्वक सिद्धि)" | "Conditional / Delayed (विलम्ब से कार्यसिद्धि)" | "Unlikely / NO (असिद्धि / प्रतिकूल)";
  confidenceScore: number; // 0..100
  verdictSummary: string;
  timingPrediction: string;
}

// Tajik Planetary Orbs (दीप्तांश)
const TAJIK_DEEPTAMSHA: Record<string, number> = {
  Sun: 15,
  Moon: 12,
  Mars: 8,
  Mercury: 7,
  Jupiter: 9,
  Venus: 7,
  Saturn: 9,
  Rahu: 6,
  Ketu: 6,
};

const RASHI_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

const PLANET_DAILY_SPEED: Record<string, number> = {
  Moon: 13.176,
  Mercury: 1.383,
  Venus: 1.200,
  Sun: 0.985,
  Mars: 0.524,
  Jupiter: 0.083,
  Saturn: 0.033,
};

export const PRASHNA_TOPICS: Record<PrashnaTopic, PrashnaTopicInfo> = {
  career: {
    id: "career",
    title: "Career Promotion & Job Opportunity",
    sanskritTitle: "कर्म / पदोन्नति प्रश्न",
    karyaHouse: 10,
    significations: "Job offer, promotion, authority, workplace change, business recognition",
  },
  finance: {
    id: "finance",
    title: "Wealth, Income & Financial Gains",
    sanskritTitle: "धन / लाभ प्रश्न",
    karyaHouse: 11,
    significations: "Money inflow, salary hike, investment return, repayment of debts",
  },
  marriage: {
    id: "marriage",
    title: "Marriage, Relationship & Proposal",
    sanskritTitle: "विवाह / सम्बन्ध प्रश्न",
    karyaHouse: 7,
    significations: "Proposal acceptance, wedding confirmation, partnership harmony",
  },
  health: {
    id: "health",
    title: "Health Recovery & Disease Relief",
    sanskritTitle: "रोग मुक्ति / स्वास्थ्य प्रश्न",
    karyaHouse: 1,
    significations: "Cure from illness, surgery outcome, vitality, mental peace",
  },
  travel: {
    id: "travel",
    title: "Foreign Travel & Relocation",
    sanskritTitle: "विदेश यात्रा / गमन प्रश्न",
    karyaHouse: 9,
    significations: "Visa approval, overseas education, pilgrimage, long journeys",
  },
  property: {
    id: "property",
    title: "Property Purchase & Real Estate",
    sanskritTitle: "भूमि / गृह क्रय प्रश्न",
    karyaHouse: 4,
    significations: "Buying home, vehicle purchase, land dispute resolution",
  },
  litigation: {
    id: "litigation",
    title: "Court Case, Disputes & Victory",
    sanskritTitle: "शत्रु जय / विवाद प्रश्न",
    karyaHouse: 6,
    significations: "Legal verdict, triumph over opponents, competitive exam success",
  },
  childbirth: {
    id: "childbirth",
    title: "Progeny, Childbirth & Conception",
    sanskritTitle: "सन्तान प्राप्ति प्रश्न",
    karyaHouse: 5,
    significations: "Childbirth, pregnancy, creative project fruition",
  },
  generalSuccess: {
    id: "generalSuccess",
    title: "General Wish Fulfillment / Endeavor",
    sanskritTitle: "सर्वकार्य सिद्धि प्रश्न",
    karyaHouse: 11,
    significations: "Will my intended wish or ambition succeed?",
  },
};

/**
 * Evaluates Instant Tajik Prashna Horary Chart
 */
export function evaluatePrashna(
  topicId: PrashnaTopic,
  ephem: EphemerisResult,
  seedNumber?: number
): PrashnaAnalysisResult {
  const topic = PRASHNA_TOPICS[topicId] || PRASHNA_TOPICS.generalSuccess;

  const ascLon = ephem.ascendant.siderealLongitude;
  const ascSign = Math.floor(ascLon / 30);
  const lagnesha = RASHI_LORDS[ascSign];

  // Karyesha = Lord of the target house
  const karyaSign = (ascSign + (topic.karyaHouse - 1)) % 12;
  const karyesha = RASHI_LORDS[karyaSign];

  const lagnaPlanet = ephem.planets[lagnesha] || ephem.planets.Sun;
  const karyaPlanet = ephem.planets[karyesha] || ephem.planets.Jupiter;
  const moon = ephem.planets.Moon;

  // Degrees inside signs
  const degLagnaLord = lagnaPlanet.rashi.degreesInSign;
  const degKaryaLord = karyaPlanet.rashi.degreesInSign;

  // Faster vs Slower planet
  const speedL = PLANET_DAILY_SPEED[lagnesha] || 0.5;
  const speedK = PLANET_DAILY_SPEED[karyesha] || 0.5;
  const fasterLord = speedL >= speedK ? lagnesha : karyesha;
  const degFaster = fasterLord === lagnesha ? degLagnaLord : degKaryaLord;
  const degSlower = fasterLord === lagnesha ? degKaryaLord : degLagnaLord;

  // Tajik Orbs
  const orbL = TAJIK_DEEPTAMSHA[lagnesha] || 8;
  const orbK = TAJIK_DEEPTAMSHA[karyesha] || 8;
  const maxAllowedOrb = (orbL + orbK) / 2;

  // Aspect between Lagnesha & Karyesha
  const lonDiff = Math.abs(lagnaPlanet.siderealLongitude - karyaPlanet.siderealLongitude);
  const normAngle = Math.min(lonDiff, 360 - lonDiff);

  let aspectType: PrashnaAnalysisResult["applyingAspect"]["aspectType"] = "None";
  let targetAngle = 0;

  if (normAngle <= 12) {
    aspectType = "Conjunction (0°)";
    targetAngle = 0;
  } else if (Math.abs(normAngle - 60) <= 8) {
    aspectType = "Sextile (60°)";
    targetAngle = 60;
  } else if (Math.abs(normAngle - 90) <= 8) {
    aspectType = "Square (90°)";
    targetAngle = 90;
  } else if (Math.abs(normAngle - 120) <= 8) {
    aspectType = "Trine (120°)";
    targetAngle = 120;
  } else if (Math.abs(normAngle - 180) <= 8) {
    aspectType = "Opposition (180°)";
    targetAngle = 180;
  }

  const orbDiff = Math.abs(normAngle - targetAngle);
  const isWithinOrb = aspectType !== "None" && orbDiff <= maxAllowedOrb;

  // Applying vs Separating (Ithasala vs Ishrafa)
  const isApplying = degFaster < degSlower;

  // Evaluate Tajika 16 Yogas
  const detectedYogas: TajikaYogaResult[] = [];

  // 1. Ithasala (Muthashila) Yoga
  const hasIthasala = isWithinOrb && isApplying && (aspectType === "Trine (120°)" || aspectType === "Sextile (60°)" || aspectType === "Conjunction (0°)");
  if (hasIthasala) {
    detectedYogas.push({
      name: "Ithasala (Muthashila) Yoga",
      sanskritName: "इत्थशाल / संयोग योग",
      isFormed: true,
      type: "Auspicious (शुभ)",
      description: `Faster planet (${fasterLord}) is applying to slower planet within orb (${orbDiff.toFixed(1)}°). Indicates swift and direct fulfillment of the desire.`,
      impactOnOutcome: "Strong Positive",
    });
  }

  // 2. Ishrafa (Musaripha) Yoga
  const hasIshrafa = isWithinOrb && !isApplying;
  if (hasIshrafa) {
    detectedYogas.push({
      name: "Ishrafa (Musaripha) Yoga",
      sanskritName: "ईशराफ / वियोग योग",
      isFormed: true,
      type: "Inauspicious (अशुभ)",
      description: `Faster planet (${fasterLord}) has already passed the degrees of the slower planet. Opportunity may have slipped or requires new initiative.`,
      impactOnOutcome: "Negative",
    });
  }

  // 3. Nakta Yoga (Transfer of Light via Moon)
  const isMoonApplyingLagna = moon.rashi.degreesInSign < degLagnaLord;
  const isMoonApplyingKarya = moon.rashi.degreesInSign < degKaryaLord;
  const hasNakta = !hasIthasala && (isMoonApplyingLagna || isMoonApplyingKarya);
  if (hasNakta) {
    detectedYogas.push({
      name: "Nakta Yoga",
      sanskritName: "नक्त योग",
      isFormed: true,
      type: "Auspicious (शुभ)",
      description: "The Moon acts as an intermediary, transferring light between Lagnesha and Karyesha. Success through third-party mediation.",
      impactOnOutcome: "Moderate Positive",
    });
  }

  // 4. Kamboola Yoga (Moon joining Ithasala)
  const hasKamboola = hasIthasala && Math.abs(moon.siderealLongitude - lagnaPlanet.siderealLongitude) < 12;
  if (hasKamboola) {
    detectedYogas.push({
      name: "Kamboola Yoga",
      sanskritName: "कम्बूल योग",
      isFormed: true,
      type: "Auspicious (शुभ)",
      description: "Moon conjoins the auspicious Ithasala formation. Supreme indicator of immense success, public acclaim and joy.",
      impactOnOutcome: "Strong Positive",
    });
  }

  // 5. Manahoo Yoga (Affliction by Saturn/Mars)
  const saturn = ephem.planets.Saturn;
  const mars = ephem.planets.Mars;
  const isAfflicted =
    Math.abs(saturn.siderealLongitude - lagnaPlanet.siderealLongitude) < 5 ||
    Math.abs(mars.siderealLongitude - karyaPlanet.siderealLongitude) < 5;

  if (isAfflicted) {
    detectedYogas.push({
      name: "Manahoo Yoga",
      sanskritName: "मनहू योग",
      isFormed: true,
      type: "Inauspicious (अशुभ)",
      description: "Malefic aspect from Saturn or Mars impairs the significator. Unforeseen delays or stress likely.",
      impactOnOutcome: "Delays / Obstacles",
    });
  }

  // Calculate Verdict & Confidence
  let confidenceScore = 50;
  if (hasKamboola) confidenceScore += 40;
  else if (hasIthasala) confidenceScore += 30;
  else if (hasNakta) confidenceScore += 15;

  if (hasIshrafa) confidenceScore -= 20;
  if (isAfflicted) confidenceScore -= 15;

  // Void of course Moon check
  const isMoonVoidOfCourse = moon.rashi.degreesInSign > 28;
  if (isMoonVoidOfCourse) confidenceScore -= 15;

  confidenceScore = Math.max(10, Math.min(95, confidenceScore));

  let verdict: PrashnaAnalysisResult["verdict"] = "Conditional / Delayed (विलम्ब से कार्यसिद्धि)";
  let verdictSummary = "";
  let timingPrediction = "";

  if (confidenceScore >= 75) {
    verdict = "Definite YES (अवश्य सिद्धि)";
    verdictSummary = `The celestial geometry strongly supports success! Auspicious ${detectedYogas[0]?.name || "Ithasala"} confirms the endeavor will manifest favorably.`;
    timingPrediction = `Expected manifestation within ${Math.max(1, Math.round(orbDiff * 2))} to ${Math.max(3, Math.round(orbDiff * 5))} days/weeks (during the applying transit).`;
  } else if (confidenceScore >= 55) {
    verdict = "Probable YES with Effort (प्रयत्नपूर्वक सिद्धि)";
    verdictSummary = "The objective is attainable, but requires active perseverance and assistance from allies or mentors.";
    timingPrediction = `Progress expected within ${Math.max(2, Math.round(orbDiff * 3))} weeks upon taking deliberate action.`;
  } else if (confidenceScore >= 40) {
    verdict = "Conditional / Delayed (विलम्ब से कार्यसिद्धि)";
    verdictSummary = "Success is possible but currently hindered by planetary impediments or lack of timing clarity. Re-evaluate strategy.";
    timingPrediction = "Manifestation delayed until key transits or planetary shifts occur.";
  } else {
    verdict = "Unlikely / NO (असिद्धि / प्रतिकूल)";
    verdictSummary = "The current planetary configuration advises against pushing this matter immediately. Patience and spiritual remedies advised.";
    timingPrediction = "Wait for a more auspicious astrological window before restarting.";
  }

  return {
    topic,
    queryTime: new Date(ephem.julianDay),
    seedNumber,
    lagnaSign: RASHI_NAMES[ascSign].englishName,
    lagnaDegree: `${Math.floor(ascLon % 30)}° ${Math.floor((ascLon * 60) % 60)}'`,
    lagnesha,
    karyesha,
    karyaHouse: topic.karyaHouse,
    moonSign: ephem.planets.Moon.rashi.englishName,
    moonNakshatra: ephem.planets.Moon.nakshatra.sanskritName,
    isMoonVoidOfCourse,
    applyingAspect: {
      isApplying,
      aspectAngle: normAngle,
      aspectType,
      orbDegrees: Math.round(orbDiff * 100) / 100,
      maxAllowedOrb: Math.round(maxAllowedOrb * 100) / 100,
      isWithinOrb,
    },
    detectedYogas,
    verdict,
    confidenceScore,
    verdictSummary,
    timingPrediction,
  };
}
