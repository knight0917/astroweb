/**
 * Classical Kota Chakra (28-Nakshatra Fort Defense) & Dasha-Lord Transit Engine
 * References:
 * - "Kota Chakra and Professional Setback" by M. Imran
 * - "Dasa Lord Transit & Padamsa Transit"
 * - Classical Horary & Transit Defense Principles
 */

import { EphemerisResult, KotaChakraAnalysis, KotaChakraSegment, KotaZone, DashaLordTransitAnalysis } from "./types";
import { RASHI_NAMES } from "./constants";

export const NAKSHATRAS_28 = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
  "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra",
  "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
  "Abhijit", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

// Longitude to 28-Nakshatra index (0 to 27)
export function get28NakshatraIndex(longitude: number): number {
  const normLon = ((longitude % 360) + 360) % 360;

  // Abhijit spans from 276°40' (276.666667°) to 280°53'20" (280.888889°)
  // Uttara Ashadha 1st 3 padas span 266°40' to 276°40'
  // Shravana spans 280°53'20" to 293°20'
  if (normLon >= 276.666667 && normLon < 280.888889) {
    return 21; // Abhijit
  }

  // Standard 27 nakshatras mapping with adjustment around Abhijit
  if (normLon < 276.666667) {
    const idx27 = Math.floor(normLon / (360 / 27));
    return Math.min(20, idx27);
  } else {
    // Past Abhijit
    const remDeg = normLon - 280.888889;
    const remainingSpan = (360 - 280.888889);
    const postAbhijitIdx = Math.min(5, Math.floor(remDeg / (remainingSpan / 6)));
    return 22 + postAbhijitIdx;
  }
}

export function evaluateKotaChakra(ephemeris: EphemerisResult): KotaChakraAnalysis {
  const moonLon = ephemeris.planets.Moon?.siderealLongitude || 0;
  const janmaNakIdx28 = get28NakshatraIndex(moonLon);
  const moonRashiIdx = Math.floor(moonLon / 30);
  const kotaSwamiPlanet = RASHI_NAMES[moonRashiIdx].lord;

  // Map each of the 28 relative nakshatras into the 4 concentric zones
  // Relative offset from Janma Nakshatra (0 to 27)
  const getZoneForRelativeOffset = (offset: number): { zone: KotaZone; direction: "East" | "South" | "West" | "North" } => {
    // Classical 4 quadrants & 4 concentric tiers
    // Stambha (Center 4: 0, 7, 14, 21 relative to Janma)
    if ([0, 7, 14, 21].includes(offset)) {
      return { zone: "Stambha (स्तम्भ - Central Pillar)", direction: offset === 0 ? "East" : offset === 7 ? "South" : offset === 14 ? "West" : "North" };
    }
    // Madhya (Inner Court 6: 1, 6, 8, 13, 15, 20)
    if ([1, 6, 8, 13, 15, 20].includes(offset)) {
      return { zone: "Madhya (मध्य - Inner Court)", direction: offset <= 6 ? "East" : offset <= 13 ? "South" : offset <= 20 ? "West" : "North" };
    }
    // Prakara (Ramparts 8: 2, 5, 9, 12, 16, 19, 22, 27)
    if ([2, 5, 9, 12, 16, 19, 22, 27].includes(offset)) {
      return { zone: "Prakara (प्राकार - Ramparts)", direction: offset <= 5 ? "East" : offset <= 12 ? "South" : offset <= 19 ? "West" : "North" };
    }
    // Bahya (Outer Gates 10: 3, 4, 10, 11, 17, 18, 23, 24, 25, 26)
    return { zone: "Bahya (बाह्य - Outer Gate)", direction: offset <= 4 ? "East" : offset <= 11 ? "South" : offset <= 18 ? "West" : "North" };
  };

  // Group planets into their 28-nakshatras
  const planetNakMap: Record<number, string[]> = {};
  for (let i = 0; i < 28; i++) planetNakMap[i] = [];

  const mainGrahas = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  mainGrahas.forEach((pName) => {
    const pData = ephemeris.planets[pName];
    if (pData) {
      const nakIdx = get28NakshatraIndex(pData.siderealLongitude);
      planetNakMap[nakIdx].push(pName);
    }
  });

  const segments: KotaChakraSegment[] = [];
  const stambhaPlanets: string[] = [];
  let kotaSwamiZone: KotaZone = "Bahya (बाह्य - Outer Gate)";
  let kotaPalaZone: KotaZone = "Prakara (प्राकार - Ramparts)";

  // Kota Pala is classical gatekeeper (Mercury/Jupiter for East/North, Mars/Saturn for South/West)
  const kotaPalaPlanet = ["Mars", "Sun"].includes(kotaSwamiPlanet) ? "Jupiter" : "Mars";

  for (let i = 0; i < 28; i++) {
    const relOffset = (i - janmaNakIdx28 + 28) % 28;
    const { zone, direction } = getZoneForRelativeOffset(relOffset);
    const occ = planetNakMap[i];
    const isJanma = i === janmaNakIdx28;

    if (zone.includes("Stambha")) {
      stambhaPlanets.push(...occ);
    }

    if (occ.includes(kotaSwamiPlanet)) {
      kotaSwamiZone = zone;
    }
    if (occ.includes(kotaPalaPlanet)) {
      kotaPalaZone = zone;
    }

    let grade: "Impregnable / Fortified" | "Guarded / Neutral" | "Vulnerable / Under Siege" = "Guarded / Neutral";
    const hasBenefic = occ.some((p) => ["Jupiter", "Venus", "Mercury"].includes(p));
    const hasMalefic = occ.some((p) => ["Saturn", "Mars", "Rahu", "Ketu"].includes(p));

    if (hasMalefic && zone.includes("Stambha")) {
      grade = "Vulnerable / Under Siege";
    } else if (hasBenefic || occ.includes(kotaSwamiPlanet)) {
      grade = "Impregnable / Fortified";
    }

    segments.push({
      nakshatraNumber28: i + 1,
      nakshatraName: NAKSHATRAS_28[i],
      zone,
      direction,
      isJanmaNakshatra: isJanma,
      occupyingPlanets: occ,
      segmentVulnerabilityGrade: grade,
    });
  }

  // Kota Bhanga Assessment
  const maleficInStambha = stambhaPlanets.filter((p) => ["Saturn", "Mars", "Rahu", "Ketu"].includes(p));
  const isKotaBhangaActive = maleficInStambha.length > 0 && !kotaSwamiZone.includes("Stambha");

  const vulnerabilityWarnings: string[] = [];
  if (maleficInStambha.length > 0) {
    vulnerabilityWarnings.push(`Malefics (${maleficInStambha.join(", ")}) occupy the central Stambha pillar -> Demands protective vigilance in career and health.`);
  }
  if (kotaSwamiZone.includes("Bahya")) {
    vulnerabilityWarnings.push(`Kota Swami (${kotaSwamiPlanet}) is stationed in the outer Bahya gateway -> Native's primary defense relies on external support.`);
  }

  let fortDefenseScore = 85;
  if (isKotaBhangaActive) fortDefenseScore -= 30;
  if (stambhaPlanets.some((p) => ["Jupiter", "Venus"].includes(p))) fortDefenseScore += 15;
  fortDefenseScore = Math.min(100, Math.max(25, fortDefenseScore));

  const kotaSwamiStatus = `Kota Swami (${kotaSwamiPlanet}) commands from ${kotaSwamiZone.split(" ")[0]}, anchoring sovereign authority.`;
  const kotaPalaStatus = `Kota Pala (${kotaPalaPlanet}) guards the ramparts at ${kotaPalaZone.split(" ")[0]}.`;

  const masterKotaSynthesis = `Kota Chakra indicates a Fort Defense Integrity of ${fortDefenseScore}%. ${kotaSwamiStatus} ${isKotaBhangaActive ? "⚠️ Active Kota Bhanga alert detected; maintain strategic caution against sudden professional shakeups." : "✨ Cosmic fort is fortified against external adversity."}`;

  return {
    segments,
    kotaSwamiPlanet,
    kotaSwamiZone,
    kotaSwamiStatus,
    kotaPalaPlanet,
    kotaPalaZone,
    kotaPalaStatus,
    stambhaPlanets,
    isKotaBhangaActive,
    fortDefenseScore,
    vulnerabilityWarnings,
    masterKotaSynthesis,
  };
}

// ----------------------------------------------------
// DASHA-LORD TRANSIT EVALUATOR
// ----------------------------------------------------

export function evaluateDashaLordTransit(ephemeris: EphemerisResult, mahaDashaLord: string = "Jupiter", antarDashaLord: string = "Saturn"): DashaLordTransitAnalysis {
  const planets = ephemeris.planets;
  const mdHouse = planets[mahaDashaLord]?.house || 1;
  const adHouse = planets[antarDashaLord]?.house || 1;

  const keyTransitPlanets = ["Jupiter", "Saturn", "Rahu", "Mars"];

  const getImpact = (houseFromDasha: number, planet: string): string => {
    if ([1, 5, 9, 10, 11].includes(houseFromDasha)) {
      return `Auspicious transit (${houseFromDasha}th from Dasha Lord) -> Boosts vitality and expansion in ${planet}'s domain.`;
    } else if ([6, 8, 12].includes(houseFromDasha)) {
      return `Friction transit (${houseFromDasha}th from Dasha Lord) -> Requires conscious management and pariharas.`;
    }
    return `Neutral transit (${houseFromDasha}th from Dasha Lord) -> Steady operational progress.`;
  };

  const transitsFromMahaDasha = keyTransitPlanets.map((pName) => {
    const pHouse = planets[pName]?.house || 1;
    const hDiff = ((pHouse - mdHouse + 12) % 12) + 1;
    return {
      planetName: pName,
      houseFromDasha: hDiff,
      transitImpact: getImpact(hDiff, pName),
    };
  });

  const transitsFromAntarDasha = keyTransitPlanets.map((pName) => {
    const pHouse = planets[pName]?.house || 1;
    const hDiff = ((pHouse - adHouse + 12) % 12) + 1;
    return {
      planetName: pName,
      houseFromDasha: hDiff,
      transitImpact: getImpact(hDiff, pName),
    };
  });

  const masterDashaTransitSynthesis = `Dasha-Lord Transit analysis shows active transits aligned with Mahadasha Lord ${mahaDashaLord} (H${mdHouse}) and Antardasha Lord ${antarDashaLord} (H${adHouse}), synchronizing macro karmic delivery.`;

  return {
    activeMahadashaLord: mahaDashaLord,
    activeAntardashaLord: antarDashaLord,
    transitsFromMahaDasha,
    transitsFromAntarDasha,
    masterDashaTransitSynthesis,
  };
}
