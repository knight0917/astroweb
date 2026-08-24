/**
 * Planetary Transit (Gochar) & Shani Sade Sati Engine
 * Computes live planetary transits over Natal Moon & Natal Lagna,
 * Gochar auspiciousness, Vedha (obstruction), and 5-phase Saturn Sade Sati / Dhaiya.
 */

import { EphemerisResult, PlanetData } from "./types";
import { RASHI_NAMES } from "./constants";

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
}

// Classical Favorable Transit Houses from Natal Moon (Phaladeepika & BPHS)
const AUSPICIOUS_HOUSES_FROM_MOON: Record<string, number[]> = {
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
 * Calculates complete Gochar (Transit) results given Natal and Transit ephemerides
 */
export function calculateGochar(
  natalEphemeris: EphemerisResult,
  transitEphemeris: EphemerisResult
): GocharResult {
  const natalMoonRashi = Math.floor(natalEphemeris.planets.Moon.siderealLongitude / 30);
  const natalAscRashi = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);

  const transits: PlanetTransitInfo[] = [];

  const mainPlanetKeys = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  for (const key of mainPlanetKeys) {
    const natalP = natalEphemeris.planets[key];
    const transitP = transitEphemeris.planets[key];

    if (!natalP || !transitP) continue;

    const natalRashi = Math.floor(natalP.siderealLongitude / 30);
    const transitRashi = Math.floor(transitP.siderealLongitude / 30);

    const houseFromMoon = ((transitRashi - natalMoonRashi + 12) % 12) + 1;
    const houseFromLagna = ((transitRashi - natalAscRashi + 12) % 12) + 1;

    const auspiciousList = AUSPICIOUS_HOUSES_FROM_MOON[key] || [3, 6, 11];
    const isAuspicious = auspiciousList.includes(houseFromMoon);

    let score: "Auspicious" | "Neutral" | "Inauspicious" = "Neutral";
    if (isAuspicious) score = "Auspicious";
    else if ([6, 8, 12].includes(houseFromMoon) || (key === "Saturn" && [1, 2, 4, 8, 12].includes(houseFromMoon))) {
      score = "Inauspicious";
    }

    let effectsSummary = "";
    if (key === "Jupiter") {
      effectsSummary = isAuspicious
        ? `Guru transiting House ${houseFromMoon} from Moon: Highly benevolent blessings for wisdom, finances, marital harmony, and expansion.`
        : `Guru in House ${houseFromMoon}: Requires patience in major investments and professional decisions.`;
    } else if (key === "Saturn") {
      effectsSummary = isAuspicious
        ? `Shani in House ${houseFromMoon} (Upachaya): Excellent for overcoming adversaries, stamina, discipline, and long-term gains.`
        : `Shani in House ${houseFromMoon}: Demands rigorous discipline, self-restraint, and mental equanimity.`;
    } else if (key === "Sun") {
      effectsSummary = isAuspicious
        ? `Surya in House ${houseFromMoon}: High vitality, administrative support, confidence, and victory.`
        : `Surya in House ${houseFromMoon}: Mild ego friction, authority challenges, and eye/health care required.`;
    } else if (key === "Mars") {
      effectsSummary = isAuspicious
        ? `Mangala in House ${houseFromMoon}: High physical energy, courage, competitive success, and land gains.`
        : `Mangala in House ${houseFromMoon}: Avoid rash temper, impulsive financial moves, and vehicle haste.`;
    } else {
      effectsSummary = isAuspicious
        ? `${natalP.name} in favorable House ${houseFromMoon} from Moon: Favorable support and smoother affairs.`
        : `${natalP.name} in House ${houseFromMoon} from Moon: Routine results with focus on balance.`;
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
      classicalRules: `Favorable in Houses: ${auspiciousList.join(", ")} from Natal Moon`,
      isRetrograde: transitP.isRetrograde || false,
      transitDegree: transitP.siderealLongitude % 30,
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

  const sadeSati: SadeSatiAnalysis = {
    hasSadeSati: ["rising", "peak", "setting"].includes(sadeSatiPhase),
    hasDhaiya: ["kantaka_4", "ashtama_8"].includes(sadeSatiPhase),
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
  };
}