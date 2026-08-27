/**
 * Classical Badhaka Sthana & Planetary Avasthas Engine (बाधक स्थान एवं ग्रहावस्था)
 * Reference: A Textbook of Scientific Hindu Astrology (Prof. P.S. Sastri / Dr. B.V. Raman), Ch. 12 & 13
 */

import { EphemerisResult } from "./types";
import { evaluatePanchadaMaitri } from "./panchadaMaitri";

export type Modality = "Movable" | "Fixed" | "Dual";

export type BaladiAvastha = "Bala (Infant)" | "Kumara (Youth)" | "Yuva (Adult)" | "Vriddha (Old)" | "Mrita (Deceased)";
export type JagradadiAvastha = "Jagrata (Awake)" | "Swapna (Dreaming)" | "Sushupti (Deep Sleep)";

export interface PlanetAvasthaReport {
  planet: string;
  sanskritName: string;
  signIndex: number;
  signName: string;
  isOddSign: boolean;
  degreesInSign: number;
  baladiAvastha: BaladiAvastha;
  baladiPotencyPercent: number; // 25, 50, 100, 10, 0
  jagradadiAvastha: JagradadiAvastha;
  jagradadiPotencyPercent: number; // 100, 50, 10
  effectivePotencyPercent: number; // Combined modifier
  isBadhakesh: boolean;
  badgeColor: string;
  description: string;
}

export interface BadhakaSthanaReport {
  ascendantSignIndex: number;
  ascendantSignName: string;
  modality: Modality;
  badhakaHouseNumber: number; // 11, 9, or 7
  badhakaSignIndex: number;
  badhakaSignName: string;
  badhakadhipati: string; // The Badhakesh planet
  badhakeshHouse: number;
  isBadhakeshActiveInDasha: boolean;
  classicalSignificance: string;
  remedialAdvice: string;
}

export interface BadhakaAvasthasResult {
  badhaka: BadhakaSthanaReport;
  avasthas: Record<string, PlanetAvasthaReport>;
  peakAwakenedPlanets: PlanetAvasthaReport[]; // Yuva + Jagrata
  dormantPlanets: PlanetAvasthaReport[]; // Mrita or Sushupti
}

const SIGN_MODALITY: Record<number, Modality> = {
  0: "Movable", 1: "Fixed", 2: "Dual",
  3: "Movable", 4: "Fixed", 5: "Dual",
  6: "Movable", 7: "Fixed", 8: "Dual",
  9: "Movable", 10: "Fixed", 11: "Dual",
};

const SIGN_LORDS: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
  4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars",
  8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SANSKRIT_PLANET_NAMES: Record<string, string> = {
  Sun: "सूर्य", Moon: "चन्द्र", Mars: "मंगल", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु",
};

const EXALTATION_SIGNS: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6,
};

const DEBILITATION_SIGNS: Record<string, number> = {
  Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0,
};

const OWN_SIGNS: Record<string, number[]> = {
  Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5],
  Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
};

export function calculateBadhakaAvasthas(
  ephemeris: EphemerisResult,
  activeDashaLords: string[] = []
): BadhakaAvasthasResult {
  const ascLon = ephemeris.ascendant.siderealLongitude;
  const ascSign = Math.floor(ascLon / 30);
  const modality = SIGN_MODALITY[ascSign];

  // 1. Badhaka Sthana Resolution
  let badhakaHouse = 11;
  if (modality === "Movable") badhakaHouse = 11;
  else if (modality === "Fixed") badhakaHouse = 9;
  else if (modality === "Dual") badhakaHouse = 7;

  const badhakaSignIdx = (ascSign + badhakaHouse - 1) % 12;
  const badhakadhipati = SIGN_LORDS[badhakaSignIdx];
  const badhakeshPlanet = (ephemeris.planets as any)[badhakadhipati];
  const badhakeshHouse = badhakeshPlanet ? badhakeshPlanet.house : badhakaHouse;
  const isBadhakeshActive = activeDashaLords.includes(badhakadhipati);

  const badhakaReport: BadhakaSthanaReport = {
    ascendantSignIndex: ascSign,
    ascendantSignName: SIGN_NAMES[ascSign],
    modality,
    badhakaHouseNumber: badhakaHouse,
    badhakaSignIndex: badhakaSignIdx,
    badhakaSignName: SIGN_NAMES[badhakaSignIdx],
    badhakadhipati,
    badhakeshHouse,
    isBadhakeshActiveInDasha: isBadhakeshActive,
    classicalSignificance: "For " + modality + " Ascendants (" + SIGN_NAMES[ascSign] + "), the " + badhakaHouse + "th House acts as Badhakasthana. " + badhakadhipati + " rules obstruction, testing patience and strategic resourcefulness.",
    remedialAdvice: isBadhakeshActive
      ? "Currently navigating " + badhakadhipati + " sub-periods. Exercise extra verification in administrative and contractual matters; maintain regular spiritual discipline dedicated to " + badhakadhipati + "."
      : badhakadhipati + " is dormant in active Dasha; maintain standard ethical harmony in " + badhakaHouse + "th house matters.",
  };

  // 2. Planetary Avasthas Calculation
  const physicalPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const avasthas: Record<string, PlanetAvasthaReport> = {};

  let pmReport: Record<string, any> = {};
  try {
    const pm = evaluatePanchadaMaitri(ephemeris);
    pmReport = pm.planets;
  } catch (_) {}

  physicalPlanets.forEach((pName) => {
    const p = (ephemeris.planets as any)[pName];
    if (!p) return;

    const lon = p.siderealLongitude;
    const signIdx = Math.floor(lon / 30);
    const degInSign = lon % 30;
    const isOdd = signIdx % 2 === 0; // 0=Aries (Odd 1st sign), 1=Taurus (Even 2nd sign)

    // Baladi Avastha
    let baladi: BaladiAvastha = "Yuva (Adult)";
    let baladiPotency = 100;

    if (isOdd) {
      if (degInSign < 6) { baladi = "Bala (Infant)"; baladiPotency = 25; }
      else if (degInSign < 12) { baladi = "Kumara (Youth)"; baladiPotency = 50; }
      else if (degInSign < 18) { baladi = "Yuva (Adult)"; baladiPotency = 100; }
      else if (degInSign < 24) { baladi = "Vriddha (Old)"; baladiPotency = 10; }
      else { baladi = "Mrita (Deceased)"; baladiPotency = 0; }
    } else {
      if (degInSign < 6) { baladi = "Mrita (Deceased)"; baladiPotency = 0; }
      else if (degInSign < 12) { baladi = "Vriddha (Old)"; baladiPotency = 10; }
      else if (degInSign < 18) { baladi = "Yuva (Adult)"; baladiPotency = 100; }
      else if (degInSign < 24) { baladi = "Kumara (Youth)"; baladiPotency = 50; }
      else { baladi = "Bala (Infant)"; baladiPotency = 25; }
    }

    // Jagradadi Avastha
    let jagradadi: JagradadiAvastha = "Swapna (Dreaming)";
    let jagradadiPotency = 50;

    const isExalted = EXALTATION_SIGNS[pName] === signIdx;
    const isOwn = OWN_SIGNS[pName]?.includes(signIdx);
    const isDebilitated = DEBILITATION_SIGNS[pName] === signIdx;

    if (isExalted || isOwn) {
      jagradadi = "Jagrata (Awake)";
      jagradadiPotency = 100;
    } else if (isDebilitated) {
      jagradadi = "Sushupti (Deep Sleep)";
      jagradadiPotency = 10;
    } else {
      const pm = pmReport[pName];
      if (pm && ["Shatru", "Adhi Shatru"].includes(pm.compoundRelation)) {
        jagradadi = "Sushupti (Deep Sleep)";
        jagradadiPotency = 15;
      } else {
        jagradadi = "Swapna (Dreaming)";
        jagradadiPotency = 50;
      }
    }

    const effectivePotency = Math.round((baladiPotency * 0.6) + (jagradadiPotency * 0.4));

    let badgeColor = "text-amber-400 bg-amber-950/40 border-amber-500/40";
    if (effectivePotency >= 75) badgeColor = "text-emerald-400 bg-emerald-950/40 border-emerald-500/40";
    else if (effectivePotency >= 45) badgeColor = "text-teal-400 bg-teal-950/40 border-teal-500/40";
    else badgeColor = "text-rose-400 bg-rose-950/40 border-rose-500/40";

    const isBadhakesh = pName === badhakadhipati;

    avasthas[pName] = {
      planet: pName,
      sanskritName: SANSKRIT_PLANET_NAMES[pName] || pName,
      signIndex: signIdx,
      signName: SIGN_NAMES[signIdx],
      isOddSign: isOdd,
      degreesInSign: parseFloat(degInSign.toFixed(2)),
      baladiAvastha: baladi,
      baladiPotencyPercent: baladiPotency,
      jagradadiAvastha: jagradadi,
      jagradadiPotencyPercent: jagradadiPotency,
      effectivePotencyPercent: effectivePotency,
      isBadhakesh,
      badgeColor,
      description: pName + " sits at " + degInSign.toFixed(1) + "° in " + SIGN_NAMES[signIdx] + " (" + (isOdd ? "Odd" : "Even") + " sign) in " + baladi + " (" + baladiPotency + "% vitality) and " + jagradadi + " (" + jagradadiPotency + "% alertness)." + (isBadhakesh ? " [Rules Badhaka House " + badhakaHouse + "]" : ""),
    };
  });

  const peakAwakened = Object.values(avasthas).filter((a) => a.effectivePotencyPercent >= 70);
  const dormant = Object.values(avasthas).filter((a) => a.effectivePotencyPercent < 30);

  return {
    badhaka: badhakaReport,
    avasthas,
    peakAwakenedPlanets: peakAwakened,
    dormantPlanets: dormant,
  };
}
