/**
 * Planetary Transit (Gochar) & Shani Sade Sati Engine
 * Computes live planetary transits over Natal Moon & Natal Lagna,
 * Gochar auspiciousness, Vedha (obstruction), and 5-phase Saturn Sade Sati / Dhaiya.
 */

import * as Astronomy from "astronomy-engine";
import { EphemerisResult, CelestialBodyPosition } from "./types";
import { RASHI_NAMES } from "./constants";
import { getAyanamsha } from "./ayanamsha";

export interface PlanetTransitInfo {
  id: string;
  name: string;
  hindiName: string;
  symbol: string;
  natalRashi: number; // 0 to 11
  natalRashiName: string;
  transitRashi: number; // 0 to 11
  transitRashiName: string;
  transitHouseFromMoon: number; // 1 to 12
  transitHouseFromLagna: number; // 1 to 12
  isAuspicious: boolean;
  score: "Auspicious" | "Neutral" | "Inauspicious";
  effectsSummary: string;
  classicalRules: string;
  isRetrograde: boolean;
  transitDegree: number;
  // Gochara Vedha (Transit Obstruction) Telemetry (Phaladeepika Ch. 26)
  vedhaHouse?: number;
  isObstructed: boolean;
  obstructingPlanets: string[];
  isVipareetaVedha: boolean;
  shieldingPlanets: string[];
  netEfficacy: "Full Auspicious" | "Obstructed (Vedha)" | "Inauspicious" | "Shielded (Vipareeta Vedha)" | "Neutral";
  vedhaExplanation?: string;
}

export type SadeSatiPhaseType =
  | "rising" // 12th from Moon
  | "peak" // 1st (Over Moon)
  | "setting" // 2nd from Moon
  | "kantaka_4" // 4th from Moon
  | "ashtama_8" // 8th from Moon
  | "none";

export interface SadeSatiAnalysis {
  hasSadeSati: boolean;
  hasDhaiya: boolean;
  phase: SadeSatiPhaseType;
  phaseName: string;
  hindiPhaseName: string;
  statusTitle: string;
  severity: "High" | "Moderate" | "Mild" | "None";
  saturnNatalRashi: string;
  saturnTransitRashi: string;
  moonNatalRashi: string;
  houseFromMoon: number;
  description: string;
  remedies: string[];
  // Precise Transit Timing & End Dates ("Until When")
  currentPhaseEndDate?: Date;
  currentPhaseEndFormatted?: string;
  totalCompletionDate?: Date;
  totalCompletionFormatted?: string;
  remainingDurationFormatted?: string;
  nextCycleStartDate?: Date;
  nextCycleStartFormatted?: string;
  phaseProgressPercent?: number;
}

export interface GocharResult {
  natalMoonRashi: number;
  natalMoonRashiName: string;
  natalAscRashi: number;
  natalAscRashiName: string;
  transits: PlanetTransitInfo[];
  sadeSati: SadeSatiAnalysis;
  guruGocharAuspicious: boolean;
  guruHouseFromMoon: number;
  obstructedCount: number;
  shieldedCount: number;
}

// Classical Favorable Transit Houses from Natal Moon (Phaladeepika & BPHS)
export const AUSPICIOUS_HOUSES_FROM_MOON: Record<string, number[]> = {
  Sun: [3, 6, 10, 11],
  Moon: [1, 3, 6, 7, 10, 11],
  Mars: [3, 6, 11],
  Mercury: [2, 4, 6, 8, 10, 11],
  Jupiter: [2, 5, 7, 9, 11],
  Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  Saturn: [3, 6, 11],
  Rahu: [3, 6, 10, 11],
  Ketu: [3, 6, 11],
};

/**
 * Classical Gochara Vedha (Transit Obstruction) Mappings (Phaladeepika Ch. 26)
 * Maps Favorable House -> Corresponding Obstruction (Vedha) House from Moon
 */
export const VEDHA_HOUSES: Record<string, Record<number, number>> = {
  Sun: { 3: 9, 6: 12, 10: 4, 11: 5 },
  Moon: { 1: 5, 3: 9, 6: 12, 7: 2, 10: 4, 11: 8 },
  Mars: { 3: 12, 6: 9, 11: 5 },
  Mercury: { 2: 5, 4: 3, 6: 9, 8: 1, 10: 7, 11: 12 },
  Jupiter: { 2: 12, 5: 4, 7: 3, 9: 10, 11: 8 },
  Venus: { 1: 8, 2: 7, 3: 1, 4: 10, 5: 9, 8: 5, 9: 11, 11: 6, 12: 3 },
  Saturn: { 3: 12, 6: 9, 11: 5 },
  Rahu: { 3: 12, 6: 9, 10: 4, 11: 5 },
  Ketu: { 3: 12, 6: 9, 11: 5 },
};

/**
 * Reverse mapping for Vipareeta Vedha (when inauspicious transit fruit is obstructed/shielded)
 * If planet P is in inauspicious house H, check if any planet is in its counterpart favorable house!
 */
export const VIPAREETA_VEDHA_HOUSES: Record<string, Record<number, number>> = {};
for (const [planet, fwdMap] of Object.entries(VEDHA_HOUSES)) {
  VIPAREETA_VEDHA_HOUSES[planet] = {};
  for (const [favorableHouse, vedhaHouse] of Object.entries(fwdMap)) {
    VIPAREETA_VEDHA_HOUSES[planet][vedhaHouse] = Number(favorableHouse);
  }
}

/**
 * Classical Father-Son Immunity Rules (Phaladeepika Ch. 26 Shloka 10):
 * 1. Sun and Saturn do not cause Vedha to each other (न वेधः सूर्यशन्योः).
 * 2. Moon and Mercury do not cause Vedha to each other (न वेधः शशिसुतयोः).
 */
export function hasFatherSonImmunity(p1: string, p2: string): boolean {
  if ((p1 === "Sun" && p2 === "Saturn") || (p1 === "Saturn" && p2 === "Sun")) return true;
  if ((p1 === "Moon" && p2 === "Mercury") || (p1 === "Mercury" && p2 === "Moon")) return true;
  return false;
}

const PLANET_HINDI_NAMES: Record<string, string> = {
  Sun: "सूर्य",
  Moon: "चन्द्र",
  Mars: "मंगल",
  Mercury: "बुध",
  Jupiter: "गुरु",
  Venus: "शुक्र",
  Saturn: "शनि",
  Rahu: "राहु",
  Ketu: "केतु",
};

/**
 * Calculates complete Gochar (Transit) results given Natal and Transit ephemerides,
 * including full-spectrum Gochara Vedha (obstruction) and Vipareeta Vedha (shielding).
 */
export function calculateGochar(
  natalEphemeris: EphemerisResult,
  transitEphemeris: EphemerisResult
): GocharResult {
  const natalMoonRashi = Math.floor(natalEphemeris.planets.Moon.siderealLongitude / 30);
  const natalAscRashi = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);

  const mainPlanetKeys = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  // Pass 1: Catalog transit houses from Natal Moon for all planets
  const planetTransitHouses: Record<string, number> = {};
  const houseOccupantsFromMoon: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) houseOccupantsFromMoon[h] = [];

  for (const key of mainPlanetKeys) {
    const transitP = transitEphemeris.planets[key];
    if (!transitP) continue;
    const transitRashi = Math.floor(transitP.siderealLongitude / 30);
    const houseFromMoon = ((transitRashi - natalMoonRashi + 12) % 12) + 1;
    planetTransitHouses[key] = houseFromMoon;
    houseOccupantsFromMoon[houseFromMoon].push(key);
  }

  // Pass 2: Compute transit scores, direct Vedha, and Vipareeta Vedha
  const transits: PlanetTransitInfo[] = [];
  let obstructedCount = 0;
  let shieldedCount = 0;

  for (const key of mainPlanetKeys) {
    const natalP = natalEphemeris.planets[key];
    const transitP = transitEphemeris.planets[key];
    if (!natalP || !transitP) continue;

    const natalRashi = Math.floor(natalP.siderealLongitude / 30);
    const transitRashi = Math.floor(transitP.siderealLongitude / 30);
    const houseFromMoon = planetTransitHouses[key] || 1;
    const houseFromLagna = ((transitRashi - natalAscRashi + 12) % 12) + 1;

    const auspiciousList = AUSPICIOUS_HOUSES_FROM_MOON[key] || [3, 6, 11];
    const isAuspicious = auspiciousList.includes(houseFromMoon);

    // Vedha evaluation
    const expectedVedhaHouse = VEDHA_HOUSES[key]?.[houseFromMoon];
    const expectedShieldHouse = VIPAREETA_VEDHA_HOUSES[key]?.[houseFromMoon];

    let isObstructed = false;
    let obstructingPlanets: string[] = [];
    let isVipareetaVedha = false;
    let shieldingPlanets: string[] = [];
    let netEfficacy: "Full Auspicious" | "Obstructed (Vedha)" | "Inauspicious" | "Shielded (Vipareeta Vedha)" | "Neutral" = "Neutral";
    let vedhaExplanation = "";

    if (isAuspicious) {
      if (expectedVedhaHouse) {
        const potentialBlockers = houseOccupantsFromMoon[expectedVedhaHouse] || [];
        obstructingPlanets = potentialBlockers.filter((blocker) => blocker !== key && !hasFatherSonImmunity(key, blocker));
        if (obstructingPlanets.length > 0) {
          isObstructed = true;
          obstructedCount++;
          netEfficacy = "Obstructed (Vedha)";
          vedhaExplanation = `Auspicious transit in House ${houseFromMoon} is locked by Vedha due to ${obstructingPlanets.join(", ")} transiting House ${expectedVedhaHouse}. Blessings are stalled until the obstruction clears.`;
        } else {
          netEfficacy = "Full Auspicious";
          vedhaExplanation = `Transiting auspicious House ${houseFromMoon} with zero Vedha (House ${expectedVedhaHouse} is clear). Full benefic results manifest smoothly.`;
        }
      } else {
        netEfficacy = "Full Auspicious";
        vedhaExplanation = `Auspicious transit in House ${houseFromMoon} has no classical obstruction point.`;
      }
    } else {
      // Inauspicious transit: check for Vipareeta Vedha (protective counter-shield)
      if (expectedShieldHouse) {
        const potentialShielders = houseOccupantsFromMoon[expectedShieldHouse] || [];
        shieldingPlanets = potentialShielders.filter((shielder) => shielder !== key && !hasFatherSonImmunity(key, shielder));
        if (shieldingPlanets.length > 0) {
          isVipareetaVedha = true;
          shieldedCount++;
          netEfficacy = "Shielded (Vipareeta Vedha)";
          vedhaExplanation = `Challenging transit in House ${houseFromMoon} is disarmed by Vipareeta Vedha from ${shieldingPlanets.join(", ")} in House ${expectedShieldHouse}. Anticipated friction is neutralized.`;
        } else {
          netEfficacy = [6, 8, 12].includes(houseFromMoon) || (key === "Saturn" && [1, 2, 4, 8, 12].includes(houseFromMoon))
            ? "Inauspicious"
            : "Neutral";
          vedhaExplanation = `Transiting House ${houseFromMoon}; requires conscious navigation without counter-shielding.`;
        }
      } else {
        netEfficacy = [6, 8, 12].includes(houseFromMoon) || (key === "Saturn" && [1, 2, 4, 8, 12].includes(houseFromMoon))
          ? "Inauspicious"
          : "Neutral";
      }
    }

    let score: "Auspicious" | "Neutral" | "Inauspicious" = "Neutral";
    if (netEfficacy === "Full Auspicious") score = "Auspicious";
    else if (netEfficacy === "Inauspicious") score = "Inauspicious";
    else if (netEfficacy === "Obstructed (Vedha)") score = "Neutral";
    else if (netEfficacy === "Shielded (Vipareeta Vedha)") score = "Neutral";

    let effectsSummary = "";
    if (key === "Jupiter") {
      if (netEfficacy === "Full Auspicious") {
        effectsSummary = `Guru transiting House ${houseFromMoon} from Moon (Unobstructed): Radiates peak beneficence for wisdom, wealth expansion, auspicious ventures, and mentor blessings.`;
      } else if (netEfficacy === "Obstructed (Vedha)") {
        effectsSummary = `Guru transiting favorable House ${houseFromMoon}, but locked by Vedha from ${obstructingPlanets.join(", ")} in House ${expectedVedhaHouse}. High aspirations face temporary administrative delays.`;
      } else if (netEfficacy === "Shielded (Vipareeta Vedha)") {
        effectsSummary = `Guru in House ${houseFromMoon}: Potential financial stagnation is shielded by Vipareeta Vedha from ${shieldingPlanets.join(", ")} in House ${expectedShieldHouse}.`;
      } else {
        effectsSummary = `Guru in House ${houseFromMoon}: Demands patience, disciplined asset management, and ethical choices.`;
      }
    } else if (key === "Saturn") {
      if (netEfficacy === "Full Auspicious") {
        effectsSummary = `Shani in House ${houseFromMoon} (Unobstructed Upachaya): Solid foundation for triumphing over obstacles, heavy career gains, and unbreakable endurance.`;
      } else if (netEfficacy === "Obstructed (Vedha)") {
        effectsSummary = `Shani in House ${houseFromMoon} is blocked by Vedha from ${obstructingPlanets.join(", ")} in House ${expectedVedhaHouse}. Routine efforts require extra perseverance.`;
      } else if (netEfficacy === "Shielded (Vipareeta Vedha)") {
        effectsSummary = `Shani in House ${houseFromMoon}: Heavy karmic pressure is significantly mitigated by Vipareeta Vedha from ${shieldingPlanets.join(", ")} in House ${expectedShieldHouse}.`;
      } else {
        effectsSummary = `Shani in House ${houseFromMoon}: Demands rigorous discipline, self-restraint, and mental equanimity.`;
      }
    } else if (key === "Sun") {
      if (netEfficacy === "Full Auspicious") {
        effectsSummary = `Surya in House ${houseFromMoon} (Unobstructed): High vitality, administrative support, confidence, and public victory.`;
      } else if (netEfficacy === "Obstructed (Vedha)") {
        effectsSummary = `Surya in House ${houseFromMoon} is obstructed by ${obstructingPlanets.join(", ")} in House ${expectedVedhaHouse}. Guard against ego friction with leaders.`;
      } else {
        effectsSummary = `Surya in House ${houseFromMoon}: Focus on cardiovascular balance, modesty, and clear teamwork.`;
      }
    } else if (key === "Mars") {
      if (netEfficacy === "Full Auspicious") {
        effectsSummary = `Mangala in House ${houseFromMoon} (Unobstructed): Dynamic physical drive, swift competitive victory, and real estate stamina.`;
      } else if (netEfficacy === "Obstructed (Vedha)") {
        effectsSummary = `Mangala in House ${houseFromMoon} is locked by Vedha from ${obstructingPlanets.join(", ")} in House ${expectedVedhaHouse}. Channel adrenaline carefully.`;
      } else if (netEfficacy === "Shielded (Vipareeta Vedha)") {
        effectsSummary = `Mangala in House ${houseFromMoon}: Potential accident or conflict vulnerability is disarmed by ${shieldingPlanets.join(", ")} in House ${expectedShieldHouse}.`;
      } else {
        effectsSummary = `Mangala in House ${houseFromMoon}: Avoid rash temper, impulsive financial moves, and vehicle haste.`;
      }
    } else {
      effectsSummary = `${natalP.name} in House ${houseFromMoon} from Moon: ${netEfficacy === "Full Auspicious" ? "Auspicious flow" : netEfficacy === "Obstructed (Vedha)" ? "Temporarily obstructed" : netEfficacy === "Shielded (Vipareeta Vedha)" ? "Protected by counter-transit" : "Standard cycle"}.`;
    }

    transits.push({
      id: key,
      name: natalP.name,
      hindiName: PLANET_HINDI_NAMES[key] || natalP.name,
      symbol: natalP.symbol,
      natalRashi,
      natalRashiName: RASHI_NAMES[natalRashi].englishName,
      transitRashi,
      transitRashiName: RASHI_NAMES[transitRashi].englishName,
      transitHouseFromMoon: houseFromMoon,
      transitHouseFromLagna: houseFromLagna,
      isAuspicious,
      score,
      effectsSummary,
      classicalRules: expectedVedhaHouse
        ? `Favorable in House ${houseFromMoon} (Vedha House: ${expectedVedhaHouse})`
        : `Favorable in Houses: ${auspiciousList.join(", ")} from Moon`,
      isRetrograde: transitP.isRetrograde || false,
      transitDegree: transitP.siderealLongitude % 30,
      vedhaHouse: expectedVedhaHouse,
      isObstructed,
      obstructingPlanets,
      isVipareetaVedha,
      shieldingPlanets,
      netEfficacy,
      vedhaExplanation,
    });
  }

  // --- Saturn Sade Sati & Dhaiya Determination ---
  const saturnTransitRashi = Math.floor(transitEphemeris.planets.Saturn.siderealLongitude / 30);
  const saturnHouseFromMoon = ((saturnTransitRashi - natalMoonRashi + 12) % 12) + 1;

  let sadeSatiPhase: SadeSatiPhaseType = "none";
  let phaseName = "No Active Sade Sati or Dhaiya";
  let hindiPhaseName = "शनि साढ़े साती / ढैय्या प्रभाव नहीं है";
  let statusTitle = "Favorable Shani Gochar (शनि अनुकूल)";
  let severity: "High" | "Moderate" | "Mild" | "None" = "None";
  let description = "Saturn is currently transiting in a non-afflicting house from your Natal Moon, bringing steady progress through honest labor.";
  const remedies: string[] = [
    "Chant Hanuman Chalisa daily in the evening.",
    "Light a mustard oil lamp under a Peepal tree on Saturdays.",
    "Practice charity by offering black sesame, iron, or blankets to the needy.",
    "Chant the Shani Mantra: 'ॐ शं शनैश्चराय नमः' 108 times.",
  ];

  if (saturnHouseFromMoon === 12) {
    sadeSatiPhase = "rising";
    phaseName = "Sade Sati — 1st Phase: Rising (आरोही / प्रथम चरण)";
    hindiPhaseName = "साढ़े साती प्रथम चरण (12वां भाव)";
    statusTitle = "Active Shani Sade Sati: Phase 1";
    severity = "Moderate";
    description = "Saturn is in the 12th house from your Natal Moon. Focus on prudent financial management, avoiding unnecessary expenditure, and sound sleep routines.";
  } else if (saturnHouseFromMoon === 1) {
    sadeSatiPhase = "peak";
    phaseName = "Sade Sati — 2nd Phase: Peak / Core (शिखर / द्वितीय चरण)";
    hindiPhaseName = "साढ़े साती द्वितीय चरण (चन्द्र राशि)";
    statusTitle = "Active Shani Sade Sati: Peak Phase (Janma Shani)";
    severity = "High";
    description = "Saturn is directly transiting over your Natal Moon (Janma Rashi). This is a transformative karmic crucible fostering maturity, perseverance, and deep self-realization.";
  } else if (saturnHouseFromMoon === 2) {
    sadeSatiPhase = "setting";
    phaseName = "Sade Sati — 3rd Phase: Setting (अवरोही / तृतीय चरण)";
    hindiPhaseName = "साढ़े साती तृतीय चरण (2रा भाव)";
    statusTitle = "Active Shani Sade Sati: Final Setting Phase";
    severity = "Mild";
    description = "Saturn is in the 2nd house from your Natal Moon. The heaviest phase has passed; emphasis shifts to family harmony and gradual financial consolidation.";
  } else if (saturnHouseFromMoon === 4) {
    sadeSatiPhase = "kantaka_4";
    phaseName = "Kantaka Shani / Laghu Kalyani Dhaiya (कंटक शनि ढैय्या)";
    hindiPhaseName = "कंटक शनि ढैय्या (4था भाव)";
    statusTitle = "Active Shani Dhaiya (4th House)";
    severity = "Moderate";
    description = "Saturn transiting 4th from Moon causes domestic restlessness and career workload. Cultivate patience and maintain harmony at home.";
  } else if (saturnHouseFromMoon === 8) {
    sadeSatiPhase = "ashtama_8";
    phaseName = "Ashtama Shani Dhaiya (अष्टम शनि ढैय्या)";
    hindiPhaseName = "अष्टम शनि ढैय्या (8वां भाव)";
    statusTitle = "Active Ashtama Shani Dhaiya (8th House)";
    severity = "High";
    description = "Saturn transiting 8th from Moon brings deep karmic tests, health discipline needs, and sudden breakthroughs if guided by righteousness.";
  }

  // --- Precise Saturn Sade Sati & Dhaiya End Date Calculations ---
  const evalDate = transitEphemeris.utcDate ? new Date(transitEphemeris.utcDate) : new Date();
  const ayanType = transitEphemeris.ayanamshaType || "Lahiri";

  let currentPhaseEndDate: Date | undefined;
  let totalCompletionDate: Date | undefined;
  let nextCycleStartDate: Date | undefined;
  let remainingDurationFormatted: string | undefined;

  const isSadeSati = ["rising", "peak", "setting"].includes(sadeSatiPhase);
  const isDhaiya = ["kantaka_4", "ashtama_8"].includes(sadeSatiPhase);

  if (isSadeSati) {
    // Current phase ends when Saturn leaves its current Rashi
    currentPhaseEndDate = findDateWhenSaturnLeavesRashi(evalDate, saturnTransitRashi, ayanType);

    if (sadeSatiPhase === "setting") {
      // 3rd phase is the final phase of Sade Sati
      totalCompletionDate = currentPhaseEndDate;
    } else {
      // Total Sade Sati ends when Saturn exits the 2nd house from Moon (natalMoonRashi + 1)
      const phase3Rashi = (natalMoonRashi + 1) % 12;
      const entersPhase3 = findDateWhenSaturnEntersRashi(evalDate, phase3Rashi, ayanType);
      totalCompletionDate = findDateWhenSaturnLeavesRashi(entersPhase3, phase3Rashi, ayanType);
    }
    remainingDurationFormatted = formatRemainingDuration(totalCompletionDate, evalDate);
  } else if (isDhaiya) {
    currentPhaseEndDate = findDateWhenSaturnLeavesRashi(evalDate, saturnTransitRashi, ayanType);
    totalCompletionDate = currentPhaseEndDate;
    remainingDurationFormatted = formatRemainingDuration(totalCompletionDate, evalDate);
  } else {
    // When will next Sade Sati begin? (Saturn enters 12th from Moon)
    const nextSadeSatiRashi = (natalMoonRashi + 11) % 12;
    nextCycleStartDate = findDateWhenSaturnEntersRashi(evalDate, nextSadeSatiRashi, ayanType);
    remainingDurationFormatted = `Next cycle begins in ${formatRemainingDuration(nextCycleStartDate, evalDate).replace(" remaining", "")}`;
  }

  const sadeSati: SadeSatiAnalysis = {
    hasSadeSati: isSadeSati,
    hasDhaiya: isDhaiya,
    phase: sadeSatiPhase,
    phaseName,
    hindiPhaseName,
    statusTitle,
    severity,
    saturnNatalRashi: RASHI_NAMES[Math.floor(natalEphemeris.planets.Saturn.siderealLongitude / 30)].englishName,
    saturnTransitRashi: RASHI_NAMES[saturnTransitRashi].englishName,
    moonNatalRashi: RASHI_NAMES[natalMoonRashi].englishName,
    houseFromMoon: saturnHouseFromMoon,
    description,
    remedies,
    currentPhaseEndDate,
    currentPhaseEndFormatted: currentPhaseEndDate ? formatTransitDate(currentPhaseEndDate) : undefined,
    totalCompletionDate,
    totalCompletionFormatted: totalCompletionDate ? formatTransitDate(totalCompletionDate) : undefined,
    remainingDurationFormatted,
    nextCycleStartDate,
    nextCycleStartFormatted: nextCycleStartDate ? formatTransitDate(nextCycleStartDate) : undefined,
  };

  const guruTransit = transits.find((t) => t.id === "Jupiter");

  return {
    natalMoonRashi,
    natalMoonRashiName: RASHI_NAMES[natalMoonRashi].englishName,
    natalAscRashi,
    natalAscRashiName: RASHI_NAMES[natalAscRashi].englishName,
    transits,
    sadeSati,
    guruGocharAuspicious: guruTransit?.isAuspicious || false,
    guruHouseFromMoon: guruTransit?.transitHouseFromMoon || 1,
    obstructedCount,
    shieldedCount,
  };
}

function getSaturnSiderealRashi(d: Date, ayanamshaType: any = "Lahiri"): number {
  const t = Astronomy.MakeTime(d);
  const pos = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Saturn, t, false));
  const ayan = getAyanamsha(t.ut, ayanamshaType);
  const siderealLon = (pos.elon - ayan + 360) % 360;
  return Math.floor(siderealLon / 30);
}

function findDateWhenSaturnLeavesRashi(startDate: Date, targetRashi: number, ayanamshaType: any = "Lahiri"): Date {
  const highDays = 365 * 4;
  for (let i = 0; i <= highDays; i += 10) {
    const testD = new Date(startDate.getTime() + i * 86400000);
    if (getSaturnSiderealRashi(testD, ayanamshaType) !== targetRashi) {
      let low = Math.max(0, i - 10);
      let high = i;
      while (high - low > 1) {
        const mid = Math.floor((low + high) / 2);
        const midD = new Date(startDate.getTime() + mid * 86400000);
        if (getSaturnSiderealRashi(midD, ayanamshaType) !== targetRashi) high = mid;
        else low = mid;
      }
      return new Date(startDate.getTime() + high * 86400000);
    }
  }
  return new Date(startDate.getTime() + 900 * 86400000);
}

function findDateWhenSaturnEntersRashi(startDate: Date, targetRashi: number, ayanamshaType: any = "Lahiri"): Date {
  const maxDays = 365 * 30;
  for (let i = 0; i <= maxDays; i += 15) {
    const testD = new Date(startDate.getTime() + i * 86400000);
    if (getSaturnSiderealRashi(testD, ayanamshaType) === targetRashi) {
      let low = Math.max(0, i - 15);
      let high = i;
      while (high - low > 1) {
        const mid = Math.floor((low + high) / 2);
        const midD = new Date(startDate.getTime() + mid * 86400000);
        if (getSaturnSiderealRashi(midD, ayanamshaType) === targetRashi) high = mid;
        else low = mid;
      }
      return new Date(startDate.getTime() + high * 86400000);
    }
  }
  return new Date(startDate.getTime() + 365 * 7 * 86400000);
}

function formatRemainingDuration(targetDate: Date, fromDate: Date): string {
  const diffMs = targetDate.getTime() - fromDate.getTime();
  if (diffMs <= 0) return "Concluding now";
  const diffDays = Math.floor(diffMs / 86400000);
  const years = Math.floor(diffDays / 365.25);
  const months = Math.floor((diffDays % 365.25) / 30.4375);
  const days = Math.floor(diffDays % 30.4375);

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  if (years === 0 && days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  return parts.length > 0 ? `${parts.join(", ")} remaining` : "Concluding shortly";
}

function formatTransitDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}