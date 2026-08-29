/**
 * Dr. B.V. Raman's Jatak Nirnay (जातक निर्णय - How to Judge a Horoscope Parts 1 & 2) Engine
 * Classical Tripartite House Assessment (भाव, भावेश, भावकारक),
 * Bhava Vriddhi vs Bhava Nasha Engine, Kartari Yogas & Remedial Navigator.
 */

import {
  EphemerisResult,
  JatakNirnayAnalysis,
  JatakNirnayBhavaJudgement,
  JatakNirnayKartari,
  JatakNirnayVriddhiNasha,
} from "./types";
import { RASHI_NAMES } from "./constants";

const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

const PRIMARY_KARAKAS = [
  { bhavaNum: 1, karaka: "Sun", altKaraka: "Moon", title: "तनु भाव (Tanu / Ascendant)", part: "Part 1 (Bhavas 1-6)" as const },
  { bhavaNum: 2, karaka: "Jupiter", altKaraka: "Mercury", title: "धन भाव (Dhana / Wealth & Speech)", part: "Part 1 (Bhavas 1-6)" as const },
  { bhavaNum: 3, karaka: "Mars", altKaraka: "Mercury", title: "सहज भाव (Sahaja / Siblings & Valour)", part: "Part 1 (Bhavas 1-6)" as const },
  { bhavaNum: 4, karaka: "Moon", altKaraka: "Venus", title: "मातृ/बन्धु भाव (Matri & Bandhu / Mother & Property)", part: "Part 1 (Bhavas 1-6)" as const },
  { bhavaNum: 5, karaka: "Jupiter", altKaraka: "Mercury", title: "पुत्र भाव (Putra / Children & Intellect)", part: "Part 1 (Bhavas 1-6)" as const },
  { bhavaNum: 6, karaka: "Mars", altKaraka: "Saturn", title: "अरि/रोग भाव (Ari & Roga / Enemies & Diseases)", part: "Part 1 (Bhavas 1-6)" as const },
  { bhavaNum: 7, karaka: "Venus", altKaraka: "Jupiter", title: "कलत्र भाव (Kalatra / Marriage & Spouse)", part: "Part 2 (Bhavas 7-12)" as const },
  { bhavaNum: 8, karaka: "Saturn", altKaraka: "Mars", title: "रन्ध्र/आयुर् भाव (Randhra & Ayur / Longevity & Legacies)", part: "Part 2 (Bhavas 7-12)" as const },
  { bhavaNum: 9, karaka: "Jupiter", altKaraka: "Sun", title: "भाग्य/धर्म भाव (Bhagya & Dharma / Fortune & Father)", part: "Part 2 (Bhavas 7-12)" as const },
  { bhavaNum: 10, karaka: "Sun", altKaraka: "Mercury", title: "कर्म/राज्य भाव (Karma & Rajya / Career & Honor)", part: "Part 2 (Bhavas 7-12)" as const },
  { bhavaNum: 11, karaka: "Jupiter", altKaraka: "Sun", title: "लाभ भाव (Labha / Revenues & Ambitions)", part: "Part 2 (Bhavas 7-12)" as const },
  { bhavaNum: 12, karaka: "Saturn", altKaraka: "Ketu", title: "व्यय/मोक्ष भाव (Vyaya & Moksha / Expenses & Liberation)", part: "Part 2 (Bhavas 7-12)" as const },
];

function isCombust(planetName: string, planetLon: number, sunLon: number): boolean {
  if (planetName === "Sun" || planetName === "Rahu" || planetName === "Ketu") return false;
  let diff = Math.abs(planetLon - sunLon) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff <= 10;
}

function getAspectingPlanetsToHouse(targetHouse: number, ephemeris: EphemerisResult): string[] {
  const aspecting: string[] = [];
  for (const [name, p] of Object.entries(ephemeris.planets)) {
    if (p.isUpagraha || p.isModernPlanet) continue;
    const pHouse = p.house;
    const dist = ((targetHouse - pHouse + 12) % 12) + 1;

    if (dist === 7) aspecting.push(name);
    else if (name === "Mars" && (dist === 4 || dist === 8)) aspecting.push(name);
    else if ((name === "Jupiter" || name === "Rahu" || name === "Ketu") && (dist === 5 || dist === 9)) aspecting.push(name);
    else if (name === "Saturn" && (dist === 3 || dist === 10)) aspecting.push(name);
  }
  return aspecting;
}

export function evaluateJatakNirnay(natalEphemeris: EphemerisResult): JatakNirnayAnalysis {
  const ascSignIdx = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const sunLon = natalEphemeris.planets.Sun?.siderealLongitude ?? 0;

  // 1. Evaluate Kartari Yogas for all 12 Houses
  const kartariYogas: JatakNirnayKartari[] = [];
  const houseOccupantsMap: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) {
    houseOccupantsMap[h] = [];
  }
  for (const [name, p] of Object.entries(natalEphemeris.planets)) {
    if (p.isUpagraha || p.isModernPlanet) continue;
    if (p.house >= 1 && p.house <= 12) {
      houseOccupantsMap[p.house].push(name);
    }
  }

  const getKartariForHouse = (h: number): "Shubha Kartari" | "Papa Kartari" | "Neutral" => {
    const h12 = h === 1 ? 12 : h - 1;
    const h2 = h === 12 ? 1 : h + 1;
    const occ12 = houseOccupantsMap[h12] || [];
    const occ2 = houseOccupantsMap[h2] || [];

    const isBenefic12 = occ12.some((p) => ["Jupiter", "Venus", "Mercury"].includes(p));
    const isBenefic2 = occ2.some((p) => ["Jupiter", "Venus", "Mercury"].includes(p));
    const isMalefic12 = occ12.some((p) => ["Saturn", "Mars", "Rahu", "Ketu", "Sun"].includes(p));
    const isMalefic2 = occ2.some((p) => ["Saturn", "Mars", "Rahu", "Ketu", "Sun"].includes(p));

    if (isBenefic12 && isBenefic2) {
      kartariYogas.push({
        targetType: "Bhava",
        targetIndex: h,
        targetName: `House ${h}`,
        kartariType: "Shubha Kartari",
        planets2nd: occ2,
        planets12th: occ12,
        effect: `House ${h} is hemmed between benefic rays, protecting and expanding its auspicious indications.`,
      });
      return "Shubha Kartari";
    }
    if (isMalefic12 && isMalefic2) {
      kartariYogas.push({
        targetType: "Bhava",
        targetIndex: h,
        targetName: `House ${h}`,
        kartariType: "Papa Kartari",
        planets2nd: occ2,
        planets12th: occ12,
        effect: `House ${h} is hemmed between malefic scissors, creating obstacles and delays in house matters.`,
      });
      return "Papa Kartari";
    }
    return "Neutral";
  };

  // 2. Evaluate 12 Bhava Tripartite Judgements
  const bhavaJudgements: JatakNirnayBhavaJudgement[] = [];
  const vriddhiNashaSummaries: JatakNirnayVriddhiNasha[] = [];

  for (let h = 1; h <= 12; h++) {
    const meta = PRIMARY_KARAKAS[h - 1];
    const signIdx = (ascSignIdx + h - 1) % 12;
    const signName = RASHI_NAMES[signIdx]?.englishName || "Aries";
    const lordName = SIGN_LORDS[signIdx];
    const lordPlanet = natalEphemeris.planets[lordName];
    const lordHouse = lordPlanet ? lordPlanet.house : h;
    const occupants = houseOccupantsMap[h] || [];
    const aspectingPlanets = getAspectingPlanetsToHouse(h, natalEphemeris);
    const kartariStatus = getKartariForHouse(h);

    // A. Bhava Score (30% Weight)
    let bhavaScore = 50;
    for (const occ of occupants) {
      if (["Jupiter", "Venus", "Mercury", "Moon"].includes(occ)) bhavaScore += 15;
      if (["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(occ)) {
        if ([3, 6, 11].includes(h) && ["Mars", "Saturn", "Sun"].includes(occ)) bhavaScore += 12;
        else bhavaScore -= 12;
      }
    }
    for (const asp of aspectingPlanets) {
      if (["Jupiter", "Venus", "Mercury"].includes(asp)) bhavaScore += 10;
      if (["Saturn", "Mars", "Rahu"].includes(asp)) bhavaScore -= 8;
    }
    if (kartariStatus === "Shubha Kartari") bhavaScore += 15;
    if (kartariStatus === "Papa Kartari") bhavaScore -= 15;
    bhavaScore = Math.max(10, Math.min(100, bhavaScore));

    // B. Bhavadhipati (Lord) Score (40% Weight)
    let lordScore = 50;
    if ([1, 4, 7, 10].includes(lordHouse)) lordScore += 20;
    else if ([5, 9].includes(lordHouse)) lordScore += 25;
    else if (lordHouse === 11) lordScore += 15;
    else if ([6, 8, 12].includes(lordHouse) && h !== lordHouse) lordScore -= 20;

    if (lordPlanet) {
      if (isCombust(lordName, lordPlanet.siderealLongitude, sunLon)) lordScore -= 20;
      if (lordPlanet.isRetrograde) lordScore += 10;
    }
    lordScore = Math.max(10, Math.min(100, lordScore));

    // C. Bhava Karaka Score (30% Weight)
    const karakaPlanet = natalEphemeris.planets[meta.karaka];
    let karakaScore = 50;
    if (karakaPlanet) {
      if ([1, 4, 7, 10, 5, 9, 11].includes(karakaPlanet.house)) karakaScore += 20;
      if ([6, 8, 12].includes(karakaPlanet.house)) karakaScore -= 18;
      if (isCombust(meta.karaka, karakaPlanet.siderealLongitude, sunLon)) karakaScore -= 15;
    }
    karakaScore = Math.max(10, Math.min(100, karakaScore));

    // Composite Raman Score
    const compositeRamanScore = Math.round(bhavaScore * 0.3 + lordScore * 0.4 + karakaScore * 0.3);

    const potencyGrade: "Uttama (Supreme)" | "Madhyama (Moderate)" | "Heena (Depleted)" =
      compositeRamanScore >= 75 ? "Uttama (Supreme)" : compositeRamanScore >= 50 ? "Madhyama (Moderate)" : "Heena (Depleted)";

    const vriddhiNashaStatus: "Bhava Vriddhi (Flourishing)" | "Bhava Samanya (Balanced)" | "Bhava Nasha (Afflicted)" =
      compositeRamanScore >= 70 && ![6, 8, 12].includes(lordHouse)
        ? "Bhava Vriddhi (Flourishing)"
        : compositeRamanScore < 50
        ? "Bhava Nasha (Afflicted)"
        : "Bhava Samanya (Balanced)";

    if (vriddhiNashaStatus === "Bhava Vriddhi (Flourishing)") {
      vriddhiNashaSummaries.push({
        bhavaNum: h,
        sanskritTitle: meta.title,
        status: "Bhava Vriddhi (Flourishing)",
        astrologicalBasis: `Fortified Bhava score (${bhavaScore}%), powerful Lord ${lordName} in House ${lordHouse}, and dignified Karaka ${meta.karaka}.`,
        realWorldImpact: `Abundant manifestation and expansion of house indications with minimal impedance.`,
      });
    } else if (vriddhiNashaStatus === "Bhava Nasha (Afflicted)") {
      vriddhiNashaSummaries.push({
        bhavaNum: h,
        sanskritTitle: meta.title,
        status: "Bhava Nasha (Afflicted)",
        astrologicalBasis: `Afflicted Lord (${lordScore}%) or Karaka ${meta.karaka} under malefic/combust rays.`,
        realWorldImpact: `Indications of house ${h} require patient conscious cultivation and classical remedial shielding.`,
      });
    }

    // Comprehensive Life Prediction Formulation
    let lifePredictions = "";
    if (h === 1) lifePredictions = `Physical constitution is rated ${potencyGrade} (${compositeRamanScore}%). Lord ${lordName} in H${lordHouse} governs vitality, longevity, and self-expression.`;
    else if (h === 2) lifePredictions = `Financial liquidity and oratorical eloquence rated ${potencyGrade} (${compositeRamanScore}%). Family wealth sustained by Karaka ${meta.karaka}.`;
    else if (h === 3) lifePredictions = `Courage, initiatives, and sibling bonds rated ${potencyGrade} (${compositeRamanScore}%). Enterprise driven by Karaka ${meta.karaka}.`;
    else if (h === 4) lifePredictions = `Landed properties, vehicles, and maternal happiness rated ${potencyGrade} (${compositeRamanScore}%). Peace of mind secured by Karaka ${meta.karaka}.`;
    else if (h === 5) lifePredictions = `Intellectual brilliance, advisory wisdom, and progeny rated ${potencyGrade} (${compositeRamanScore}%). Purva Punya energized by Karaka ${meta.karaka}.`;
    else if (h === 6) lifePredictions = `Conquest of adversaries, competitive triumph, and immunity rated ${potencyGrade} (${compositeRamanScore}%). Litigation shield governed by Lord ${lordName}.`;
    else if (h === 7) lifePredictions = `Marital harmony and commercial alliances rated ${potencyGrade} (${compositeRamanScore}%). Spouse's auspiciousness fostered by Karaka ${meta.karaka}.`;
    else if (h === 8) lifePredictions = `Longevity, legacy assets, and occult research rated ${potencyGrade} (${compositeRamanScore}%). Vital endurance governed by Karaka ${meta.karaka}.`;
    else if (h === 9) lifePredictions = `Divine fortune, preceptor patronage, and dharmic righteousness rated ${potencyGrade} (${compositeRamanScore}%). Blessings bestowed by Karaka ${meta.karaka}.`;
    else if (h === 10) lifePredictions = `Professional authority, executive status, and societal honors rated ${potencyGrade} (${compositeRamanScore}%). Career zenith steered by Lord ${lordName}.`;
    else if (h === 11) lifePredictions = `Financial revenues, realization of cherished goals, and networks rated ${potencyGrade} (${compositeRamanScore}%). Influx of wealth energized by Karaka ${meta.karaka}.`;
    else if (h === 12) lifePredictions = `Spiritual liberation (Moksha), overseas travels, and philanthropic expenditure rated ${potencyGrade} (${compositeRamanScore}%). Detachment nurtured by Karaka ${meta.karaka}.`;

    const ramanRemedy = compositeRamanScore >= 70
      ? "Perform regular thanksgiving charity and honor the house preceptor."
      : `Strengthen Lord ${lordName} and Karaka ${meta.karaka} through dedicated japa, gemstone energization, and charitable donations.`;

    bhavaJudgements.push({
      bhavaNum: h,
      sanskritTitle: meta.title,
      part: meta.part,
      signName,
      lordName,
      lordPlacementHouse: lordHouse,
      primaryKaraka: meta.karaka,
      bhavaScore,
      lordScore,
      karakaScore,
      compositeRamanScore,
      potencyGrade,
      vriddhiNashaStatus,
      kartariStatus,
      occupants,
      aspectingPlanets,
      lifePredictions,
      ramanRemedy,
    });
  }

  const sortedJudgements = [...bhavaJudgements].sort((a, b) => b.compositeRamanScore - a.compositeRamanScore);
  const strongestBhava = sortedJudgements[0];
  const weakestBhava = sortedJudgements[sortedJudgements.length - 1];

  const vriddhiCount = bhavaJudgements.filter((b) => b.vriddhiNashaStatus === "Bhava Vriddhi (Flourishing)").length;
  const nashaCount = bhavaJudgements.filter((b) => b.vriddhiNashaStatus === "Bhava Nasha (Afflicted)").length;

  const masterNirnaySynthesis = `Dr. B.V. Raman's Jatak Nirnay (How to Judge a Horoscope) identifies **House ${strongestBhava.bhavaNum} (${strongestBhava.sanskritTitle.split(" ")[0]})** as the strongest house with a composite score of **${strongestBhava.compositeRamanScore}% (${strongestBhava.potencyGrade})**, driven by a powerful Lord ${strongestBhava.lordName} in House ${strongestBhava.lordPlacementHouse}. Overall, **${vriddhiCount} Bhavas experience Bhava Vriddhi (Flourishing)** while **${nashaCount} Bhavas undergo Bhava Nasha (Requiring Remediation)**.`;

  return {
    strongestBhava,
    weakestBhava,
    bhavaJudgements,
    kartariYogas,
    vriddhiNashaSummaries,
    masterNirnaySynthesis,
  };
}
