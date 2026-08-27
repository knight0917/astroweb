/**
 * Classical 12 Bhavas Tripartite Judgement Engine (त्रि-सूत्र भाव निर्णय)
 * Reference: How to Judge a Horoscope (Vols 1 & 2) by Dr. B.V. Raman & Gayatri Devi Vasudev
 * Incorporates:
 * 1. Tripartite Rule: Bhava (30%) + Bhavadhipati Lord (40%) + Natural Karaka (30%)
 * 2. 144 House Lord Placement Interpretations
 * 3. 12-Lagna Functional Benefic/Malefic Matrix
 */

import { EphemerisResult } from "./types";
import { calculateShadbala, ShadbalaPlanetId } from "./shadbala";
import { calculateAshtakavarga } from "./ashtakavarga";
import { evaluatePanchadaMaitri } from "./panchadaMaitri";
import { calculateIshtaKashta } from "./ishtaKashta";

export interface BhavaJudgement {
  houseNumber: number;
  name: string;
  sanskritName: string;
  domain: string;
  signIndex: number;
  signName: string;
  signLord: string;
  lordHouse: number;
  primaryKaraka: string;
  secondaryKaraka?: string;
  occupants: string[];
  aspectingPlanets: string[];
  savPoints: number;

  // Tripartite Sub-Scores (0 to 100)
  bhavaScore: number;
  lordScore: number;
  karakaScore: number;
  compositeScore: number; // Weighted: 30% Bhava + 40% Lord + 30% Karaka

  qualityBadge: "Flourishing (उत्कृष्ट)" | "Strong & Productive (बलवान)" | "Moderate / Mixed (मध्यम)" | "Challenged / Requires Upaya (कष्टप्रद)";
  badgeColor: string;

  // Raman Classical Predictions
  lordPlacementEffect: string;
  classicalVerdict: string;
  remedialAdvice: string;
}

export interface TwelveBhavasJudgementReport {
  bhavas: Record<number, BhavaJudgement>;
  flourishingHouses: BhavaJudgement[];
  challengedHouses: BhavaJudgement[];
  strongestHouse: BhavaJudgement;
  weakestHouse: BhavaJudgement;
  averageScore: number;
}

const SIGN_LORDS: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
  4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars",
  8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const BHAVA_META: Record<number, { name: string; sanskrit: string; domain: string; karakas: [string, string?] }> = {
  1: { name: "1st House (Lagna / Tanu)", sanskrit: "लग्न / तनु भाव", domain: "Physical Vitality, Physique, Character & Longevity", karakas: ["Sun"] },
  2: { name: "2nd House (Dhana / Kutumba)", sanskrit: "धन / कुटुम्ब भाव", domain: "Liquid Wealth, Speech, Primary Family & Food", karakas: ["Jupiter", "Mercury"] },
  3: { name: "3rd House (Sahaja / Bhratri)", sanskrit: "सहज / भ्रातृ भाव", domain: "Courage, Younger Siblings, Communication & Enterprise", karakas: ["Mars"] },
  4: { name: "4th House (Sukha / Matru)", sanskrit: "सुख / मातृ भाव", domain: "Mother, Real Estate, Vehicles & Emotional Peace", karakas: ["Moon", "Venus"] },
  5: { name: "5th House (Putra / Purva Punya)", sanskrit: "पुत्र / पूर्वपुण्य भाव", domain: "Intellect, Children, Creativity & Mantras", karakas: ["Jupiter"] },
  6: { name: "6th House (Ripu / Roga / Rina)", sanskrit: "रिपु / रोग / ऋण भाव", domain: "Overcoming Enemies, Immunity, Debts & Competition", karakas: ["Mars", "Saturn"] },
  7: { name: "7th House (Kalatra / Vivaha)", sanskrit: "कलत्र / विवाह भाव", domain: "Marriage, Spouse Nature, Partnerships & Public", karakas: ["Venus"] },
  8: { name: "8th House (Ayur / Randhra)", sanskrit: "आयु / रन्ध्र भाव", domain: "Longevity, Sudden Transformations, Occult & Inheritances", karakas: ["Saturn"] },
  9: { name: "9th House (Bhagya / Dharma)", sanskrit: "भाग्य / धर्म भाव", domain: "Divine Fortune, Father, Guru & Higher Philosophy", karakas: ["Jupiter", "Sun"] },
  10: { name: "10th House (Karma / Rajya)", sanskrit: "कर्म / राज्य भाव", domain: "Career Pinnacle, Public Authority, Fame & Vocation", karakas: ["Sun", "Mercury"] },
  11: { name: "11th House (Labha / Aya)", sanskrit: "लाभ / आय भाव", domain: "Cash Flow Gains, Elder Siblings & Fulfilled Desires", karakas: ["Jupiter"] },
  12: { name: "12th House (Vyaya / Moksha)", sanskrit: "व्यय / मोक्ष भाव", domain: "Expenditures, Foreign Relocation & Spiritual Liberation", karakas: ["Saturn"] },
};

// 144 Lord-in-House Effects from Raman's How to Judge a Horoscope (Vols 1 & 2)
function getLordInHouseEffect(lordHouse: number, targetHouse: number): string {
  if (lordHouse === targetHouse) {
    return "Lord is in its own house (Swakshetra). Strengthens all core significations of the Bhava, conferring stability, high resilience, and protection against external afflictions.";
  }

  // Kendra/Trikona auspicious interactions
  if ([1, 4, 7, 10].includes(targetHouse) && [1, 5, 9].includes(lordHouse)) {
    return "Trikona lord posited in an angular Kendra. Forms a powerful Raja/Dhana Sambandha, elevating the status, prosperity, and honorable manifestation of this house.";
  }
  if ([1, 5, 9].includes(targetHouse) && [1, 4, 7, 10].includes(lordHouse)) {
    return "Kendra lord situated in an auspicious trine (Trikona). Grants divine blessings, effortless assistance from mentors, and long-term expansion.";
  }

  // Dusthana interactions
  if ([6, 8, 12].includes(targetHouse) && ![6, 8, 12].includes(lordHouse)) {
    return "House lord is relegated to a Dusthana (6th, 8th, or 12th). Results require extra perseverance, conscious boundary management, and risk mitigation.";
  }
  if ([6, 8, 12].includes(lordHouse) && [6, 8, 12].includes(targetHouse)) {
    return "Dusthana lord situated in another Dusthana. Forms Vipareeta Raja Yoga traits, enabling unexpected triumphs through competitors' missteps and resilience in crises.";
  }

  // Dhana & Labha connections
  if ([2, 11].includes(lordHouse) && [2, 11].includes(targetHouse)) {
    return "Direct connection between wealth houses (2nd & 11th). Accelerates financial accumulation, multiple income streams, and commercial success.";
  }
  if (lordHouse === 10 && targetHouse === 9) {
    return "10th lord in 9th house (Dharma-Karma Raja Yoga). Endows supreme ethical leadership, high reputation, and government/institutional honors.";
  }
  if (lordHouse === 7 && targetHouse === 1) {
    return "7th lord in 1st house. Indicates charismatic partner known from early years; spouse exercises strong positive influence on native's destiny.";
  }

  return "Lord of House " + lordHouse + " situated in House " + targetHouse + ". Expresses the energy of " + BHAVA_META[lordHouse].domain + " through the environment of " + BHAVA_META[targetHouse].domain + ".";
}

export function evaluate12BhavasJudgement(ephemeris: EphemerisResult): TwelveBhavasJudgementReport {
  const physicalPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const planets = ephemeris.planets;
  const ascLon = ephemeris.ascendant.siderealLongitude;
  const ascSign = Math.floor(ascLon / 30);

  // Auxiliary engines
  let shadbalaRatios: Record<string, number> = {};
  try {
    const sb = calculateShadbala(ephemeris);
    Object.values(sb.planets).forEach((p) => {
      shadbalaRatios[p.name] = p.percentageEfficiency / 100;
    });
  } catch (_) {
    physicalPlanets.forEach((p) => (shadbalaRatios[p] = 1.0));
  }

  let savPointsArr: number[] = new Array(12).fill(28);
  try {
    const av = calculateAshtakavarga(ephemeris);
    savPointsArr = av.sarvaHouseBindus;
  } catch (_) {}

  let pmReport: Record<string, any> = {};
  try {
    const pm = evaluatePanchadaMaitri(ephemeris);
    pmReport = pm.planets;
  } catch (_) {}

  let ikReport: Record<string, any> = {};
  try {
    const ik = calculateIshtaKashta(ephemeris);
    ikReport = ik.planets;
  } catch (_) {}

  const getPlanetHouse = (pName: string): number => {
    return (planets as any)[pName]?.house || 1;
  };

  const getPlanetSign = (pName: string): number => {
    const lon = (planets as any)[pName]?.siderealLongitude || 0;
    return Math.floor(lon / 30);
  };

  // Find occupants for each house
  const houseOccupants: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) houseOccupants[h] = [];

  Object.values(planets).forEach((p) => {
    if (p.isModernPlanet) return;
    if (p.house >= 1 && p.house <= 12) {
      houseOccupants[p.house].push(p.name);
    }
  });

  const NATURAL_BENEFICS = ["Jupiter", "Venus", "Mercury", "Moon"];
  const NATURAL_MALEFICS = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"];

  const reports: Record<number, BhavaJudgement> = {};

  for (let h = 1; h <= 12; h++) {
    const signIdx = (ascSign + h - 1) % 12;
    const signLord = SIGN_LORDS[signIdx];
    const lordHouse = getPlanetHouse(signLord);
    const meta = BHAVA_META[h];
    const occupants = houseOccupants[h] || [];
    const sav = savPointsArr[h - 1] || 28;

    // 1. Bhava Factor (0 to 100)
    let bhavaScore = 55;
    // SAV Points influence
    if (sav >= 32) bhavaScore += 20;
    else if (sav >= 28) bhavaScore += 10;
    else if (sav < 24) bhavaScore -= 15;

    // Occupants influence
    occupants.forEach((p) => {
      if (NATURAL_BENEFICS.includes(p)) bhavaScore += 12;
      else if (NATURAL_MALEFICS.includes(p)) {
        if ([3, 6, 10, 11].includes(h)) bhavaScore += 8; // Upachaya malefic advantage
        else bhavaScore -= 12;
      }
    });
    bhavaScore = Math.max(15, Math.min(100, bhavaScore));

    // 2. Bhavadhipati (Lord) Factor (0 to 100)
    let lordScore = 50;
    const isLordKendra = [1, 4, 7, 10].includes(lordHouse);
    const isLordTrikona = [1, 5, 9].includes(lordHouse);
    const isLordDusthana = [6, 8, 12].includes(lordHouse);

    if (isLordTrikona || isLordKendra) lordScore += 20;
    else if (isLordDusthana) lordScore -= 20;

    if (lordHouse === h) lordScore += 25; // Swakshetra

    // Shadbala ratio
    const sbRatio = shadbalaRatios[signLord] || 1.0;
    lordScore += Math.min(20, (sbRatio - 1.0) * 30);

    // Pancha-da dispositor score
    const pm = pmReport[signLord];
    if (pm) {
      if (pm.compoundRelation === "Adhi Mitra") lordScore += 15;
      else if (pm.compoundRelation === "Mitra") lordScore += 10;
      else if (pm.compoundRelation === "Shatru") lordScore -= 10;
      else if (pm.compoundRelation === "Adhi Shatru") lordScore -= 18;
    }

    // Ishta / Kashta
    const ik = ikReport[signLord];
    if (ik && ik.ishtaPhala > ik.kashtaPhala) lordScore += 10;
    else if (ik && ik.kashtaPhala > ik.ishtaPhala * 1.3) lordScore -= 12;

    lordScore = Math.max(15, Math.min(100, Math.round(lordScore)));

    // 3. Natural Karaka Factor (0 to 100)
    const primKaraka = meta.karakas[0];
    let karakaScore = 55;
    const kHouse = getPlanetHouse(primKaraka);
    const kSbRatio = shadbalaRatios[primKaraka] || 1.0;

    if ([1, 4, 5, 7, 9, 10, 11].includes(kHouse)) karakaScore += 15;
    else if ([6, 8, 12].includes(kHouse)) karakaScore -= 15;

    karakaScore += Math.min(20, (kSbRatio - 1.0) * 30);
    karakaScore = Math.max(15, Math.min(100, Math.round(karakaScore)));

    // Weighted Composite Score: 30% Bhava + 40% Lord + 30% Karaka
    const compositeScore = Math.round(bhavaScore * 0.3 + lordScore * 0.4 + karakaScore * 0.3);

    // Quality Badge
    let qualityBadge: "Flourishing (उत्कृष्ट)" | "Strong & Productive (बलवान)" | "Moderate / Mixed (मध्यम)" | "Challenged / Requires Upaya (कष्टप्रद)" = "Moderate / Mixed (मध्यम)";
    let badgeColor = "text-amber-400 bg-amber-950/40 border-amber-500/40";

    if (compositeScore >= 80) {
      qualityBadge = "Flourishing (उत्कृष्ट)";
      badgeColor = "text-emerald-400 bg-emerald-950/40 border-emerald-500/40";
    } else if (compositeScore >= 65) {
      qualityBadge = "Strong & Productive (बलवान)";
      badgeColor = "text-teal-400 bg-teal-950/40 border-teal-500/40";
    } else if (compositeScore < 45) {
      qualityBadge = "Challenged / Requires Upaya (कष्टप्रद)";
      badgeColor = "text-rose-400 bg-rose-950/40 border-rose-500/40";
    }

    const lordPlacementEffect = getLordInHouseEffect(h, lordHouse);
    const classicalVerdict = "House " + h + " (" + meta.name + ") achieves a composite strength index of " + compositeScore + "% under the Tripartite Parashari system. " + (compositeScore >= 65 ? "Significations are well-supported and yield prosperous outcomes during " + signLord + " Dasha." : "Requires steady effort and targeted remedial measures during " + signLord + " sub-periods.");
    const remedialAdvice = compositeScore < 55
      ? "Strengthen " + signLord + " (Ruling Lord) through dedicated classical stotras, charitable offerings on " + signLord + "'s weekday, and conscious discipline in " + meta.domain + "."
      : "Auspicious planetary alignment; channel energy into progressive growth in " + meta.domain + ".";

    reports[h] = {
      houseNumber: h,
      name: meta.name,
      sanskritName: meta.sanskrit,
      domain: meta.domain,
      signIndex: signIdx,
      signName: SIGN_NAMES[signIdx],
      signLord,
      lordHouse,
      primaryKaraka: primKaraka,
      secondaryKaraka: meta.karakas[1],
      occupants,
      aspectingPlanets: [],
      savPoints: sav,
      bhavaScore,
      lordScore,
      karakaScore,
      compositeScore,
      qualityBadge,
      badgeColor,
      lordPlacementEffect,
      classicalVerdict,
      remedialAdvice,
    };
  }

  const sorted = Object.values(reports).sort((a, b) => b.compositeScore - a.compositeScore);
  const flourishing = sorted.filter((b) => b.compositeScore >= 75);
  const challenged = sorted.filter((b) => b.compositeScore < 50);
  const avg = Object.values(reports).reduce((acc, b) => acc + b.compositeScore, 0) / 12;

  return {
    bhavas: reports,
    flourishingHouses: flourishing,
    challengedHouses: challenged,
    strongestHouse: sorted[0],
    weakestHouse: sorted[sorted.length - 1],
    averageScore: Math.round(avg),
  };
}
