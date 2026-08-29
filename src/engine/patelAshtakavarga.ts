/**
 * Chandrakant S. Patel & C.A.S. Aiyar Ashtakavarga Engine (1957)
 * References:
 * - "Ashtakavarga" by C.S. Patel & C.A. Subramania Aiyar (1957)
 * - Classical Trikona & Ekadhipatya Shodhana Reductions
 * - Precision Shodhya Pinda (Rashi & Graha Gunakaras) & 8 Kakshyas System
 */

import { EphemerisResult, PatelAshtakavargaAnalysis, ShodhyaPindaReport, KakshyaZoneItem } from "./types";
import { calculateAshtakavarga } from "./ashtakavarga";

export const RASHI_GUNAKARAS = [7, 10, 8, 4, 10, 5, 7, 8, 9, 5, 11, 12]; // Aries to Pisces
export const GRAHA_GUNAKARAS: Record<string, number> = {
  Sun: 5,
  Moon: 5,
  Mars: 8,
  Mercury: 5,
  Jupiter: 10,
  Venus: 7,
  Saturn: 5,
};

export const KAKSHYA_LORDS = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Ascendant"];

// 1. TRIKONA SHODHANA (Trinal Reductions)
export function applyTrikonaShodhana(rawBindus: number[]): number[] {
  const reduced = [...rawBindus];
  const triads = [
    [0, 4, 8],  // Fire: Aries, Leo, Sagittarius
    [1, 5, 9],  // Earth: Taurus, Virgo, Capricorn
    [2, 6, 10], // Air: Gemini, Libra, Aquarius
    [3, 7, 11], // Water: Cancer, Scorpio, Pisces
  ];

  for (const [s1, s2, s3] of triads) {
    const b1 = reduced[s1];
    const b2 = reduced[s2];
    const b3 = reduced[s3];

    const zerosCount = (b1 === 0 ? 1 : 0) + (b2 === 0 ? 1 : 0) + (b3 === 0 ? 1 : 0);

    if (zerosCount === 0) {
      const minB = Math.min(b1, b2, b3);
      reduced[s1] -= minB;
      reduced[s2] -= minB;
      reduced[s3] -= minB;
    } else if (zerosCount === 1) {
      if (b1 === 0) {
        const minB = Math.min(b2, b3);
        reduced[s2] -= minB;
        reduced[s3] -= minB;
      } else if (b2 === 0) {
        const minB = Math.min(b1, b3);
        reduced[s1] -= minB;
        reduced[s3] -= minB;
      } else {
        const minB = Math.min(b1, b2);
        reduced[s1] -= minB;
        reduced[s2] -= minB;
      }
    } else if (zerosCount === 2) {
      // If two are zero, the remaining one becomes zero per Patel (1957)
      reduced[s1] = 0;
      reduced[s2] = 0;
      reduced[s3] = 0;
    }
  }

  return reduced;
}

// 2. EKADHIPATYA SHODHANA (Dual Ownership Reductions)
export function applyEkadhipatyaShodhana(trikonaReduced: number[], occupiedSigns: Set<number>): number[] {
  const reduced = [...trikonaReduced];
  const dualPairs = [
    [0, 7],  // Mars: Aries & Scorpio
    [1, 6],  // Venus: Taurus & Libra
    [2, 5],  // Mercury: Gemini & Virgo
    [8, 11], // Jupiter: Sagittarius & Pisces
    [9, 10], // Saturn: Capricorn & Aquarius
  ];

  for (const [s1, s2] of dualPairs) {
    const b1 = reduced[s1];
    const b2 = reduced[s2];
    const occ1 = occupiedSigns.has(s1);
    const occ2 = occupiedSigns.has(s2);

    if (b1 === 0 && b2 === 0) continue;

    // Case 1: Both signs unoccupied by planets
    if (!occ1 && !occ2) {
      if (b1 === b2) {
        reduced[s1] = 0;
        reduced[s2] = 0;
      } else {
        const minB = Math.min(b1, b2);
        reduced[s1] = minB;
        reduced[s2] = minB;
      }
    }
    // Case 2: One occupied, other unoccupied
    else if (occ1 && !occ2) {
      if (b2 > b1) reduced[s2] = b1;
      else if (b2 < b1) reduced[s2] = 0;
      else reduced[s2] = 0;
    } else if (!occ1 && occ2) {
      if (b1 > b2) reduced[s1] = b2;
      else if (b1 < b2) reduced[s1] = 0;
      else reduced[s1] = 0;
    }
    // Case 3: Both occupied -> No reduction
  }

  return reduced;
}

// 3. PINDA SHODHANA (Rashi & Graha Pinda Calculator)
export function calculateShodhyaPinda(
  planetName: string,
  rawBindus: number[],
  planetSignPositions: Record<string, number>
): ShodhyaPindaReport {
  const occupiedSigns = new Set(Object.values(planetSignPositions));
  const trikonaReduced = applyTrikonaShodhana(rawBindus);
  const ekadhipatyaReduced = applyEkadhipatyaShodhana(trikonaReduced, occupiedSigns);

  // Calculate Rashi Pinda
  let rashiPinda = 0;
  for (let i = 0; i < 12; i++) {
    rashiPinda += ekadhipatyaReduced[i] * RASHI_GUNAKARAS[i];
  }

  // Calculate Graha Pinda
  let grahaPinda = 0;
  for (const [pName, signIdx] of Object.entries(planetSignPositions)) {
    const gMultiplier = GRAHA_GUNAKARAS[pName] || 5;
    grahaPinda += ekadhipatyaReduced[signIdx] * gMultiplier;
  }

  const shodhyaPinda = rashiPinda + grahaPinda;
  const longevityAyurContributionYears = parseFloat((shodhyaPinda / 7).toFixed(1));

  return {
    planetName,
    rawBindus,
    trikonaReducedBindus: trikonaReduced,
    ekadhipatyaReducedBindus: ekadhipatyaReduced,
    rashiPinda,
    grahaPinda,
    shodhyaPinda,
    longevityAyurContributionYears,
  };
}

export function evaluatePatelAshtakavarga(ephemeris: EphemerisResult): PatelAshtakavargaAnalysis {
  const av = calculateAshtakavarga(ephemeris);
  const mainPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  const planetSignPositions: Record<string, number> = {};
  mainPlanets.forEach((p) => {
    const lon = ephemeris.planets[p]?.siderealLongitude || 0;
    planetSignPositions[p] = Math.floor(lon / 30);
  });

  const shodhyaPindas: ShodhyaPindaReport[] = mainPlanets.map((pName) => {
    const raw = av.bav[pName as keyof typeof av.bav]?.rashiBindus || [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
    return calculateShodhyaPinda(pName, raw, planetSignPositions);
  });

  const sarvashtakaShodhyaPindaTotal = shodhyaPindas.reduce((acc, p) => acc + p.shodhyaPinda, 0);

  const vitalPlanetaryPindas = shodhyaPindas.map((p) => {
    let tier = "Moderate Karmic Yield";
    if (p.shodhyaPinda > 120) tier = "Supreme Karmic Yield (Parijata Pinda)";
    else if (p.shodhyaPinda > 90) tier = "Fortified Karmic Yield";
    else if (p.shodhyaPinda < 60) tier = "Lean Karmic Yield (Demands Pariharas)";
    return {
      planet: p.planetName,
      pinda: p.shodhyaPinda,
      strengthTier: tier,
    };
  });

  // ----------------------------------------------------
  // 4. THE 8 KAKSHYAS EVALUATOR (3°45' Micro-Transit Zones)
  // ----------------------------------------------------
  const moonDegInSign = (ephemeris.planets.Moon?.siderealLongitude || 0) % 30;
  const currentKakshyaIdx = Math.min(7, Math.floor(moonDegInSign / 3.75));

  const kakshyas: KakshyaZoneItem[] = KAKSHYA_LORDS.map((lord, idx) => {
    const startDeg = (idx * 3.75).toFixed(2);
    const endDeg = ((idx + 1) * 3.75).toFixed(2);
    const isCurrent = idx === currentKakshyaIdx;

    const occupying: string[] = [];
    if (isCurrent) occupying.push("Moon (Mind / Flow)");

    return {
      kakshyaNumber: idx + 1,
      degreeSpan: `${startDeg}° - ${endDeg}°`,
      governingLord: lord,
      hasBeneficBindu: idx % 2 === 0 || isCurrent,
      currentTransitingPlanets: occupying,
      transitActivationStatus: isCurrent
        ? `🔥 Active Transit Kakshya: Governed by ${lord} -> Delivering instantaneous mental and physical fruit.`
        : `Dormant Kakshya until activated by transit trigger.`,
    };
  });

  const topPinda = [...vitalPlanetaryPindas].sort((a, b) => b.pinda - a.pinda)[0];

  const masterPatelSynthesis = `C.S. Patel Ashtakavarga Shodhana computes a total Sarvashtaka Shodhya Pinda of **${sarvashtakaShodhyaPindaTotal} points**. Highest individual karmic vitality is anchored in **${topPinda.planet} (${topPinda.pinda} Pinda Points - ${topPinda.strengthTier})**. Current transit Moon activates Kakshya #${currentKakshyaIdx + 1} (${KAKSHYA_LORDS[currentKakshyaIdx]}).`;

  return {
    shodhyaPindas,
    sarvashtakaShodhyaPindaTotal,
    kakshyas,
    vitalPlanetaryPindas,
    masterPatelSynthesis,
  };
}
