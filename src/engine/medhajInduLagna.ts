/**
 * Medhaj Astro Indu Lagna Wealth Masterclass Engine (Sessions 86 & 87)
 * 
 * References:
 * - Session 86: Introduction and Calculation of Indu Lagna (इन्दु लग्न - Moon-Ray Wealth Ascendant)
 *   - Purpose: In Vedic astrology, while 2nd (accumulated assets), 11th (cash flow/gains), and 4th (property)
 *     indicate general wealth, Indu Lagna is a specialized mathematical reference point for prosperity,
 *     sudden financial abundance, and overall financial destiny.
 *   - Philosophy: Present-life fortune (Bhagya) is from 9th house of Lagna; past-life fortune (Purva Janma Bhagya)
 *     is tied to the Moon and the 9th house from Moon.
 *   - Planetary Ray Values (Kala Units):
 *     * Sun (Surya): 30
 *     * Moon (Chandra): 16
 *     * Mars (Mangal): 6
 *     * Mercury (Budha): 8
 *     * Jupiter (Guru): 10
 *     * Venus (Shukra): 12
 *     * Saturn (Shani): 1
 *     * (Rahu & Ketu have 0 rays).
 *   - Calculation Method:
 *     * 9th Lord from Lagna Kala + 9th Lord from Moon Kala.
 *     * Divide sum by 12. If remainder is 0, count 12 houses.
 *     * Count remainder signs forward from Natal Moon's sign (1-indexed). The resulting sign is Indu Lagna.
 *   - Core Environmental Dignity:
 *     * Kendra / Trikona from Lagna: Unhindered wealth flow, minimal friction.
 *     * Dusthanas (6, 8, 12 from Lagna): Wealth realized through intense labor, debt management, or crisis.
 *     * Rule of Thumb for Sustained Support: Occupation of houses 2, 4, and 8 guarantees timely financial rescue.
 * 
 * - Session 87: Examples of Indu Lagna Calculation and Related Yogas
 *   - Lecture Benchmark 1: Jupiter (10) + Jupiter (10) = 20 % 12 = Remainder 8 from Moon.
 *   - Lecture Benchmark 2: Virgo Lagna (9th lord Venus = 12), Capricorn Moon (9th lord Mercury = 8).
 *     Total = 20. Remainder = 8. Count 8 signs from Capricorn -> Leo (Simha) Indu Lagna!
 *   - Dhana Yogas from Indu Lagna:
 *     * Benefics in Trines (1, 5, 9): Grand Dhana Yoga; scale determined by dignity.
 *     * Benefics in Kendras (1, 4, 7, 10): Rapid materialization with minimal resistance.
 *     * Indu Lagna as 11th House: Large-scale entrepreneurial empires after conquering competitive hurdles.
 *   - Timing Wealth by Planetary Activation Ages on Indu Lagna:
 *     * Jupiter: Age 16 (recurring at 28, 40, 52, 64).
 *     * Sun: Age 22 (authority, government patronage, sovereignty).
 *     * Moon: Age 24 (public popularity, emotional ease, liquid capital).
 *     * Venus: Age 26 (luxury, vehicles, artistic fruition, marital wealth).
 *     * Mars: Age 28 (real estate, land, construction, engineering assets).
 *     * Mercury: Age 32 (commerce, trade, digital business, media).
 *     * Saturn: Age 36 onward (solid, long-term foundation after discipline).
 *     * Rahu: Age 42 (unconventional, foreign, tech, speculative breakthroughs).
 *     * Ketu: Age 48 (spiritual wealth, non-attachment, liquidation).
 *   - Coincidence with Arudha Lagna (AL): Maya aligns with Satya; perception equals reality.
 *   - Aggressive / Malefic Influences (Sun/Mars/Ardra Nakshatra): Wealth through high-risk enforcement.
 *   - Transit Portals: Transiting benefics crossing Indu Lagna or its Kendra/Trikona axes unlock liquidity.
 */

import { EphemerisResult, CelestialBodyPosition, SpecialPoint, RashiInfo } from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateArudhaPadas, ArudhaPada } from "./jaimini";

// =========================================================================
// 1. FUNDAMENTAL CONSTANTS & KALA RAY VALUES (SESSION 86)
// =========================================================================

export const INDU_KALA_VALUES: Record<string, number> = {
  Sun: 30,
  Moon: 16,
  Mars: 6,
  Mercury: 8,
  Jupiter: 10,
  Venus: 12,
  Saturn: 1,
};

export const ZODIAC_SIGNS: string[] = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const RASHI_SANSKRIT: string[] = [
  "Mesha", "Vrishabha", "Mithuna", "Karka",
  "Simha", "Kanya", "Tula", "Vrishchika",
  "Dhanu", "Makara", "Kumbha", "Meena"
];

export const SIGN_LORDS: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
  4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars",
  8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter"
};

/**
 * Robustly extracts 0-11 zodiac sign index from any CelestialBodyPosition or SpecialPoint.
 */
export function getBodySignIndex(body?: CelestialBodyPosition | SpecialPoint | null): number {
  if (!body) return 0;
  if ("rashi" in body && body.rashi && typeof body.rashi.index === "number") {
    return body.rashi.index;
  }
  const lon = body.siderealLongitude || 0;
  return Math.floor(((lon % 360) + 360) % 360 / 30);
}

// =========================================================================
// 2. CORE INDU LAGNA CALCULATION (SESSION 86)
// =========================================================================

export interface InduLagnaCoreResult {
  induLagnaRashiIndex: number;
  induLagnaSignName: string;
  induLagnaSanskritName: string;
  induLagnaLongitude: number;
  induLagnaHouseFromD1: number;
  induLagnaHouseFromMoon: number;
  lagnaNinthRashiIndex: number;
  lagnaNinthLord: string;
  lagnaNinthKala: number;
  moonNinthRashiIndex: number;
  moonNinthLord: string;
  moonNinthKala: number;
  totalKalas: number;
  remainderKala: number;
  isKendraFromLagna: boolean;
  isTrikonaFromLagna: boolean;
  isDusthanaFromLagna: boolean;
  environmentalDignity: "Effortless Abundance (Kendra/Trikona)" | "High-Struggle Toil (Dusthana 6/8/12)" | "Direct Growth & Accumulation (2/3/11)";
  environmentalDignityExplanation: string;
}

/**
 * Calculates Indu Lagna per Medhaj Astro Session 86.
 */
export function calculateMedhajInduLagna(natalEphem: EphemerisResult): InduLagnaCoreResult {
  const ascSignIdx = getBodySignIndex(natalEphem.ascendant);
  const moonSignIdx = getBodySignIndex(natalEphem.planets.Moon);
  const moonLon = natalEphem.planets.Moon ? natalEphem.planets.Moon.siderealLongitude : 0;

  // 9th house from Lagna (offset +8 signs)
  const lagnaNinthRashiIdx = (ascSignIdx + 8) % 12;
  const lagnaNinthLord = SIGN_LORDS[lagnaNinthRashiIdx];
  const lagnaNinthKala = INDU_KALA_VALUES[lagnaNinthLord] || 0;

  // 9th house from Moon (offset +8 signs)
  const moonNinthRashiIdx = (moonSignIdx + 8) % 12;
  const moonNinthLord = SIGN_LORDS[moonNinthRashiIdx];
  const moonNinthKala = INDU_KALA_VALUES[moonNinthLord] || 0;

  const totalKalas = lagnaNinthKala + moonNinthKala;
  let remainder = totalKalas % 12;
  if (remainder === 0) remainder = 12;

  // Count remainder signs forward from Natal Moon (1-indexed: 1 = Moon sign itself)
  const induLagnaRashiIdx = (moonSignIdx + (remainder - 1)) % 12;
  const induLagnaLongitude = induLagnaRashiIdx * 30 + (moonLon % 30);

  // House from D1 Lagna
  const induLagnaHouseFromD1 = ((induLagnaRashiIdx - ascSignIdx + 12) % 12) + 1;
  // House from Moon Lagna
  const induLagnaHouseFromMoon = ((induLagnaRashiIdx - moonSignIdx + 12) % 12) + 1;

  const isKendraFromLagna = [1, 4, 7, 10].includes(induLagnaHouseFromD1);
  const isTrikonaFromLagna = [1, 5, 9].includes(induLagnaHouseFromD1);
  const isDusthanaFromLagna = [6, 8, 12].includes(induLagnaHouseFromD1);

  let environmentalDignity: InduLagnaCoreResult["environmentalDignity"] = "Direct Growth & Accumulation (2/3/11)";
  let environmentalDignityExplanation = "";

  if (isKendraFromLagna || isTrikonaFromLagna) {
    environmentalDignity = "Effortless Abundance (Kendra/Trikona)";
    environmentalDignityExplanation = `Indu Lagna sits in auspicious House #${induLagnaHouseFromD1} (${ZODIAC_SIGNS[induLagnaRashiIdx]}). Financial opportunities and prosperity materialize with natural grace, minimal resistance, and strong past-life karmic support.`;
  } else if (isDusthanaFromLagna) {
    environmentalDignity = "High-Struggle Toil (Dusthana 6/8/12)";
    environmentalDignityExplanation = `Indu Lagna falls into Dusthana House #${induLagnaHouseFromD1} (${ZODIAC_SIGNS[induLagnaRashiIdx]}). In Medhaj Indu doctrine, wealth manifests only after persistent hard labor, debt restructuring, high-stress battles, or transformative crisis management.`;
  } else {
    environmentalDignity = "Direct Growth & Accumulation (2/3/11)";
    environmentalDignityExplanation = `Indu Lagna sits in Upachaya/Dhana House #${induLagnaHouseFromD1} (${ZODIAC_SIGNS[induLagnaRashiIdx]}). Wealth compounds steadily through commercial enterprise, self-effort, and disciplined asset-building.`;
  }

  return {
    induLagnaRashiIndex: induLagnaRashiIdx,
    induLagnaSignName: ZODIAC_SIGNS[induLagnaRashiIdx],
    induLagnaSanskritName: RASHI_SANSKRIT[induLagnaRashiIdx],
    induLagnaLongitude: parseFloat(induLagnaLongitude.toFixed(2)),
    induLagnaHouseFromD1,
    induLagnaHouseFromMoon,
    lagnaNinthRashiIndex: lagnaNinthRashiIdx,
    lagnaNinthLord,
    lagnaNinthKala,
    moonNinthRashiIndex: moonNinthRashiIdx,
    moonNinthLord,
    moonNinthKala,
    totalKalas,
    remainderKala: remainder,
    isKendraFromLagna,
    isTrikonaFromLagna,
    isDusthanaFromLagna,
    environmentalDignity,
    environmentalDignityExplanation,
  };
}

// =========================================================================
// 3. DHANA YOGAS FROM INDU LAGNA REFERENCE FRAME (SESSION 87)
// =========================================================================

export interface InduDhanaYogasResult {
  planetsInInduLagna: string[];
  beneficsInInduLagna: string[];
  maleficsInInduLagna: string[];
  trineBenefics: { houseFromIndu: number; planet: string; signName: string }[];
  kendraBenefics: { houseFromIndu: number; planet: string; signName: string }[];
  dhanaYogaGrade: "Koti-Pati / Imperial Wealth (कोटिपति)" | "High Multi-Millionaire (महाधनी)" | "Substantial Affluence (सम्पन्न)" | "Moderate Prosperity (मध्यम)";
  dhanaYogaVerdict: string;
  isInduLagnaIn11thHouse: boolean;
  entrepreneurial11thVerdict: string | null;
}

/**
 * Evaluates Dhana Yogas from the Indu Lagna reference frame per Session 87.
 */
export function evaluateInduDhanaYogas(
  natalEphem: EphemerisResult,
  induCore: InduLagnaCoreResult
): InduDhanaYogasResult {
  const induSignIdx = induCore.induLagnaRashiIndex;
  const beneficsList = ["Jupiter", "Venus", "Mercury", "Moon"];
  const maleficsList = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"];

  const planetsInInduLagna: string[] = [];
  const beneficsInInduLagna: string[] = [];
  const maleficsInInduLagna: string[] = [];

  const trineBenefics: { houseFromIndu: number; planet: string; signName: string }[] = [];
  const kendraBenefics: { houseFromIndu: number; planet: string; signName: string }[] = [];

  for (const [pName, pData] of Object.entries(natalEphem.planets)) {
    if (!pData || pData.isUpagraha || pData.isModernPlanet) continue;
    const pSignIdx = getBodySignIndex(pData);
    const houseFromIndu = ((pSignIdx - induSignIdx + 12) % 12) + 1;

    // Check direct occupancy
    if (houseFromIndu === 1) {
      planetsInInduLagna.push(pName);
      if (beneficsList.includes(pName)) {
        beneficsInInduLagna.push(pName);
      } else if (maleficsList.includes(pName)) {
        maleficsInInduLagna.push(pName);
      }
    }

    // Check Trines from Indu Lagna (1, 5, 9)
    if ([1, 5, 9].includes(houseFromIndu) && beneficsList.includes(pName)) {
      trineBenefics.push({
        houseFromIndu,
        planet: pName,
        signName: ZODIAC_SIGNS[pSignIdx]
      });
    }

    // Check Kendras from Indu Lagna (1, 4, 7, 10)
    if ([1, 4, 7, 10].includes(houseFromIndu) && beneficsList.includes(pName)) {
      kendraBenefics.push({
        houseFromIndu,
        planet: pName,
        signName: ZODIAC_SIGNS[pSignIdx]
      });
    }
  }

  // 11th House Entrepreneurial Rule (Session 87)
  const isInduLagnaIn11thHouse = induCore.induLagnaHouseFromD1 === 11;
  let entrepreneurial11thVerdict: string | null = null;
  if (isInduLagnaIn11thHouse) {
    entrepreneurial11thVerdict = `Major Entrepreneurial Wealth Signature! Indu Lagna falls in House #11 (${induCore.induLagnaSignName}). In Medhaj Astro Session 87, when Indu Lagna occupies the 11th house (especially if Movable / Baadhaka), massive financial empires are established after overcoming intense competitive and network friction.`;
  }

  // Grade formulation
  let dhanaYogaGrade: InduDhanaYogasResult["dhanaYogaGrade"] = "Moderate Prosperity (मध्यम)";
  let dhanaYogaVerdict = "";

  const totalBeneficTrinesAndKendras = trineBenefics.length + kendraBenefics.length;

  if (
    beneficsInInduLagna.length >= 2 ||
    (beneficsInInduLagna.includes("Jupiter") && beneficsInInduLagna.includes("Venus")) ||
    (trineBenefics.length >= 2 && kendraBenefics.length >= 2)
  ) {
    dhanaYogaGrade = "Koti-Pati / Imperial Wealth (कोटिपति)";
    dhanaYogaVerdict = `Supreme Indu Dhana Yoga! Benefics (${beneficsInInduLagna.join(", ") || "Trines/Kendras"}) empower Indu Lagna (${induCore.induLagnaSignName}). Grants sovereign wealth, unshakeable multi-generational assets, and effortless capital multiplication.`;
  } else if (beneficsInInduLagna.length >= 1 || trineBenefics.length >= 2) {
    dhanaYogaGrade = "High Multi-Millionaire (महाधनी)";
    dhanaYogaVerdict = `Fortified Indu Dhana Yoga! Benefic support in or trine to Indu Lagna (${induCore.induLagnaSignName}) ensures continuous financial expansion, upscale real estate, and rapid recovery from commercial setbacks.`;
  } else if (maleficsInInduLagna.length > 0 && beneficsInInduLagna.length === 0) {
    dhanaYogaGrade = "Substantial Affluence (सम्पन्न)";
    dhanaYogaVerdict = `Self-Made Warrior Wealth! Indu Lagna is energized by dynamic planet (${maleficsInInduLagna.join(", ")}). Wealth is generated through bold entrepreneurial risk, aggressive enterprise, and fierce resilience rather than passive inheritance.`;
  } else if (totalBeneficTrinesAndKendras >= 1) {
    dhanaYogaGrade = "Substantial Affluence (सम्पन्न)";
    dhanaYogaVerdict = `Supported Indu Axis. Benefics in angles/trines from Indu Lagna (${kendraBenefics.map(b => b.planet).join(", ")}) provide timely capital inflows and investment maturity.`;
  } else {
    dhanaYogaGrade = "Moderate Prosperity (मध्यम)";
    dhanaYogaVerdict = `Indu Lagna in ${induCore.induLagnaSignName} governed by ${SIGN_LORDS[induCore.induLagnaRashiIndex]}. Wealth manifests through disciplined personal labor and the periodic dashas/transits of Lord ${SIGN_LORDS[induCore.induLagnaRashiIndex]}.`;
  }

  return {
    planetsInInduLagna,
    beneficsInInduLagna,
    maleficsInInduLagna,
    trineBenefics,
    kendraBenefics,
    dhanaYogaGrade,
    dhanaYogaVerdict,
    isInduLagnaIn11thHouse,
    entrepreneurial11thVerdict,
  };
}

// =========================================================================
// 4. RULE OF THUMB FOR SUSTAINED SUPPORT (2, 4, 8 PATTERN) (SESSION 86)
// =========================================================================

export interface SustainedSupportPatternResult {
  hasHouse2Occupants: boolean;
  house2Occupants: string[];
  hasHouse4Occupants: boolean;
  house4Occupants: string[];
  hasHouse8Occupants: boolean;
  house8Occupants: string[];
  isSustainedSupportActive: boolean; // true if 2, 4, and 8 all occupied
  supportCoveragePercentage: number; // 0, 33, 67, 100
  verdict: string;
}

/**
 * Evaluates the Session 86 Rule of Thumb: If planets occupy houses 2, 4, and 8,
 * the native experiences timely financial support whenever necessary.
 */
export function evaluateSustainedSupportPattern(natalEphem: EphemerisResult): SustainedSupportPatternResult {
  const h2Occupants: string[] = [];
  const h4Occupants: string[] = [];
  const h8Occupants: string[] = [];

  for (const [pName, pData] of Object.entries(natalEphem.planets)) {
    if (!pData || pData.isUpagraha || pData.isModernPlanet) continue;
    if (pData.house === 2) h2Occupants.push(pName);
    if (pData.house === 4) h4Occupants.push(pName);
    if (pData.house === 8) h8Occupants.push(pName);
  }

  const hasH2 = h2Occupants.length > 0;
  const hasH4 = h4Occupants.length > 0;
  const hasH8 = h8Occupants.length > 0;

  let activeCount = 0;
  if (hasH2) activeCount++;
  if (hasH4) activeCount++;
  if (hasH8) activeCount++;

  const supportCoveragePercentage = Math.round((activeCount / 3) * 100);
  const isSustainedSupportActive = activeCount === 3;

  let verdict = "";
  if (isSustainedSupportActive) {
    verdict = `Sacred 2-4-8 Sustained Support Shield ACTIVE (100%): Planets occupy House 2 (${h2Occupants.join(", ")}), House 4 (${h4Occupants.join(", ")}), and House 8 (${h8Occupants.join(", ")}). Per Session 86, the universe guarantees timely, unexpected financial rescue, family buffers, and emergency liquidity whenever adversity strikes.`;
  } else if (activeCount === 2) {
    verdict = `Partial Sustained Support Shield (67%): Two of the three pivotal lifeline houses are fortified. Provides substantial financial resilience during economic fluctuations.`;
  } else {
    verdict = `Standard Financial Independence (${supportCoveragePercentage}%): Wealth stability depends on primary dasha lords and disciplined self-budgeting rather than automatic 2-4-8 karmic safety nets.`;
  }

  return {
    hasHouse2Occupants: hasH2,
    house2Occupants: h2Occupants,
    hasHouse4Occupants: hasH4,
    house4Occupants: h4Occupants,
    hasHouse8Occupants: hasH8,
    house8Occupants: h8Occupants,
    isSustainedSupportActive,
    supportCoveragePercentage,
    verdict,
  };
}

// =========================================================================
// 5. PLANETARY ACTIVATION AGES ON INDU LAGNA (SESSION 87)
// =========================================================================

export interface InduAgeActivationEntry {
  planet: string;
  isOccupant: boolean;
  isAspecting: boolean;
  primaryActivationAge: number;
  recurringCycleYears: number | null;
  significance: string;
  activationStatus: "Currently Active Milestone" | "Upcoming Milestone" | "Past Milestone";
  detailedPhala: string;
}

export interface InduPlanetaryAgeRadarResult {
  currentAgeYears: number;
  activeMilestonesNow: InduAgeActivationEntry[];
  allMilestones: InduAgeActivationEntry[];
  executiveGuidance: string;
}

export const INDU_PLANETARY_AGE_RULES: Record<string, {
  age: number;
  recurring: number | null;
  domain: string;
  phala: string;
}> = {
  Jupiter: {
    age: 16,
    recurring: 12, // 16, 28, 40, 52, 64
    domain: "Wisdom, Ethical Enterprise, Large-Scale Expansion & Guru Kripa",
    phala: "Activates at Age 16 and re-triggers in 12-year recurring cycles (Ages 28, 40, 52, 64). Brings exponential financial elevation, respected counsel, and sovereign prosperity."
  },
  Sun: {
    age: 22,
    recurring: null,
    domain: "Executive Authority, Government Favor, Self-Sovereignty & Fatherly Assets",
    phala: "Activates at Age 22. Unlocks administrative elevation, high societal recognition, and sovereign career autonomy."
  },
  Moon: {
    age: 24,
    recurring: null,
    domain: "Liquid Capital, Public Popularity, Food/Hospitality & Maternal Wealth",
    phala: "Activates at Age 24. Brings sudden surges in liquid cash flow, public approval, and emotional comfort."
  },
  Venus: {
    age: 26,
    recurring: null,
    domain: "Luxury Vehicles, Prime Real Estate, Creative Arts & Marital Prosperity",
    phala: "Activates at Age 26. Triggers high material comforts, luxury conveyances, artistic monetization, and wealth via marriage."
  },
  Mars: {
    age: 28,
    recurring: null,
    domain: "Landed Property, Real Estate, Construction, Engineering & Competitive Victory",
    phala: "Activates at Age 28. Marks the breakthrough milestone for landed property acquisitions, commercial real estate, and high-energy competitive gains."
  },
  Mercury: {
    age: 32,
    recurring: null,
    domain: "Commercial Trading, Media, Tech Platforms, Brokerage & Analytical Enterprise",
    phala: "Activates at Age 32. Triggers commercial breakthroughs, trade networks, digital platform monetization, and lucrative contract signings."
  },
  Saturn: {
    age: 36,
    recurring: null,
    domain: "Enduring Foundations, Mass Enterprise, Manufacturing & Karmic Maturation",
    phala: "Activates at Age 36 onward. Establishes rock-solid, long-term wealth foundations after years of disciplined labor and humility."
  },
  Rahu: {
    age: 42,
    recurring: null,
    domain: "Unconventional Wealth, Foreign Trade, Tech Breakthroughs & Mass Speculation",
    phala: "Activates at Age 42. Brings sudden out-of-the-box wealth leaps, foreign revenue streams, viral media success, or speculative breakthroughs."
  },
  Ketu: {
    age: 48,
    recurring: null,
    domain: "Spiritual Wealth, Ancestral Liquidation, Occult Mastery & Complete Detachment",
    phala: "Activates at Age 48. Brings wealth through ancestral assets, sudden liquidation, or spiritual detachment where money flows effortlessly as ego dissolves."
  }
};

/**
 * Calculates Indu Lagna Planetary Activation Ages per Session 87.
 */
export function calculateInduPlanetaryAgeActivations(
  natalEphem: EphemerisResult,
  induCore: InduLagnaCoreResult,
  birthDate: Date,
  evaluationDate: Date
): InduPlanetaryAgeRadarResult {
  const induSignIdx = induCore.induLagnaRashiIndex;
  const diffMs = evaluationDate.getTime() - birthDate.getTime();
  const currentAge = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25)));

  const allMilestones: InduAgeActivationEntry[] = [];
  const activeMilestonesNow: InduAgeActivationEntry[] = [];

  for (const [planetName, rule] of Object.entries(INDU_PLANETARY_AGE_RULES)) {
    const pData = natalEphem.planets[planetName];
    if (!pData) continue;

    const pSignIdx = getBodySignIndex(pData);
    const houseFromIndu = ((pSignIdx - induSignIdx + 12) % 12) + 1;
    const isOccupant = houseFromIndu === 1;
    // 7th house aspect
    const isAspecting = houseFromIndu === 7;

    // Check relevant ages
    const agesToCheck: number[] = [rule.age];
    if (rule.recurring) {
      for (let r = rule.age + rule.recurring; r <= 80; r += rule.recurring) {
        agesToCheck.push(r);
      }
    }

    const isCurrent = agesToCheck.includes(currentAge);
    const hasPast = agesToCheck.every(a => a < currentAge);

    let activationStatus: InduAgeActivationEntry["activationStatus"] = "Upcoming Milestone";
    if (isCurrent) {
      activationStatus = "Currently Active Milestone";
    } else if (hasPast) {
      activationStatus = "Past Milestone";
    }

    const entry: InduAgeActivationEntry = {
      planet: planetName,
      isOccupant,
      isAspecting,
      primaryActivationAge: rule.age,
      recurringCycleYears: rule.recurring,
      significance: rule.domain,
      activationStatus,
      detailedPhala: rule.phala,
    };

    allMilestones.push(entry);

    if (isCurrent || (isOccupant && isCurrent)) {
      activeMilestonesNow.push(entry);
    }
  }

  let executiveGuidance = "";
  if (activeMilestonesNow.length > 0) {
    executiveGuidance = `🔥 Active Indu Wealth Portal at Age ${currentAge}! Planet ${activeMilestonesNow.map(m => m.planet).join(", ")} is currently triggering its Indu Lagna activation window (${activeMilestonesNow[0].significance}). Focus capital and effort on these domains.`;
  } else {
    // Find closest upcoming
    const upcoming = allMilestones.filter(m => m.activationStatus === "Upcoming Milestone");
    executiveGuidance = `Native is currently Age ${currentAge}. Upcoming Indu Lagna maturation milestones will awaken key financial channels as designated in the planetary radar.`;
  }

  return {
    currentAgeYears: currentAge,
    activeMilestonesNow,
    allMilestones,
    executiveGuidance,
  };
}

// =========================================================================
// 6. INDU LAGNA & ARUDHA LAGNA (AL) CONVERGENCE (SESSION 87)
// =========================================================================

export interface InduArudhaAlignmentResult {
  induLagnaSignIndex: number;
  induLagnaSignName: string;
  arudhaLagnaSignIndex: number;
  arudhaLagnaSignName: string;
  isInduAlignedWithAL: boolean; // True if Indu Lagna === AL
  isInduInKendraFromAL: boolean;
  isInduInTrineFromAL: boolean;
  distanceFromAL: number; // 1-12
  convergenceInterpretation: string;
}

/**
 * Evaluates the coincidence or geometric relationship between Indu Lagna and Arudha Lagna (AL).
 */
export function evaluateInduArudhaAlignment(
  natalEphem: EphemerisResult,
  induCore: InduLagnaCoreResult
): InduArudhaAlignmentResult {
  const padas = calculateArudhaPadas(natalEphem);
  const alPada = padas.find(p => p.code === "AL") || padas[0];
  const alSignIdx = alPada ? alPada.padaSignIndex : 0;
  const induSignIdx = induCore.induLagnaRashiIndex;

  const isInduAlignedWithAL = induSignIdx === alSignIdx;
  const distanceFromAL = ((induSignIdx - alSignIdx + 12) % 12) + 1;
  const isInduInKendraFromAL = [1, 4, 7, 10].includes(distanceFromAL);
  const isInduInTrineFromAL = [1, 5, 9].includes(distanceFromAL);

  let convergenceInterpretation = "";
  if (isInduAlignedWithAL) {
    convergenceInterpretation = "🌟 Supreme Maya-Satya Fusion! Indu Lagna coincides EXACTLY with your Arudha Lagna (AL). In Medhaj Astro Session 87, this rare combination means the world perceives your status with 100% precision relative to your true wealth. There is zero false pretension; your reputation and bank balance operate in perfect divine alignment.";
  } else if (isInduInTrineFromAL) {
    convergenceInterpretation = `Harmonic Trine Alignment. Indu Lagna is in the ${distanceFromAL}th house (Trikona) from Arudha Lagna. Worldly public projects naturally attract strong investment and capital backing.`;
  } else if (isInduInKendraFromAL) {
    convergenceInterpretation = `Dynamic Angular Support. Indu Lagna is in the ${distanceFromAL}th house (Kendra) from Arudha Lagna. Public visibility directly fuels material expansion.`;
  } else {
    convergenceInterpretation = `Independent Reference Frames. Indu Lagna is ${distanceFromAL} houses from Arudha Lagna. Inner financial assets operate quietly away from public scrutiny.`;
  }

  return {
    induLagnaSignIndex: induSignIdx,
    induLagnaSignName: ZODIAC_SIGNS[induSignIdx],
    arudhaLagnaSignIndex: alSignIdx,
    arudhaLagnaSignName: ZODIAC_SIGNS[alSignIdx],
    isInduAlignedWithAL,
    isInduInKendraFromAL,
    isInduInTrineFromAL,
    distanceFromAL,
    convergenceInterpretation,
  };
}

// =========================================================================
// 7. REAL-TIME TRANSIT PORTALS OVER INDU LAGNA (SESSION 86)
// =========================================================================

export interface InduTransitPortalEntry {
  planet: string;
  transitSignName: string;
  relationToIndu: "Conjunction (1st)" | "Trine (5th/9th)" | "Kendra (4th/7th/10th)" | "Neutral";
  isBenefic: boolean;
  impactVerdict: string;
}

export interface InduTransitPortalsResult {
  activePortals: InduTransitPortalEntry[];
  hasMajorBeneficPortal: boolean;
  transitSummary: string;
}

/**
 * Evaluates real-time planetary transits passing over Indu Lagna or its Trines/Kendras.
 */
export function evaluateInduTransitPortals(
  transitEphem: EphemerisResult,
  induCore: InduLagnaCoreResult
): InduTransitPortalsResult {
  const induSignIdx = induCore.induLagnaRashiIndex;
  const beneficsList = ["Jupiter", "Venus", "Mercury", "Moon"];
  const activePortals: InduTransitPortalEntry[] = [];

  for (const [pName, pData] of Object.entries(transitEphem.planets)) {
    if (!pData || pData.isUpagraha || pData.isModernPlanet) continue;
    const tSignIdx = getBodySignIndex(pData);
    const houseFromIndu = ((tSignIdx - induSignIdx + 12) % 12) + 1;
    const isBenefic = beneficsList.includes(pName);

    let relationToIndu: InduTransitPortalEntry["relationToIndu"] = "Neutral";
    if (houseFromIndu === 1) relationToIndu = "Conjunction (1st)";
    else if ([5, 9].includes(houseFromIndu)) relationToIndu = "Trine (5th/9th)";
    else if ([4, 7, 10].includes(houseFromIndu)) relationToIndu = "Kendra (4th/7th/10th)";

    if (relationToIndu !== "Neutral") {
      let impactVerdict = "";
      if (pName === "Jupiter") {
        impactVerdict = `Transit Jupiter in ${ZODIAC_SIGNS[tSignIdx]} (${relationToIndu} from Indu Lagna): Major Golden Portal! Unlocks massive wealth accumulation, wise investments, and business expansion.`;
      } else if (pName === "Venus") {
        impactVerdict = `Transit Venus in ${ZODIAC_SIGNS[tSignIdx]} (${relationToIndu} from Indu Lagna): Luxury & Cash Flow Portal! Facilitates high liquid income, vehicle purchases, and artistic gains.`;
      } else if (pName === "Saturn") {
        impactVerdict = `Transit Saturn in ${ZODIAC_SIGNS[tSignIdx]} (${relationToIndu} from Indu Lagna): Restructuring & Discipline! Tests financial efficiency and builds solid long-term enterprise.`;
      } else if (pName === "Rahu") {
        impactVerdict = `Transit Rahu in ${ZODIAC_SIGNS[tSignIdx]} (${relationToIndu} from Indu Lagna): High-Risk Speculation Alert! Offers sudden non-traditional gains but warns against unverified get-rich-quick shortcuts.`;
      } else {
        impactVerdict = `Transit ${pName} in ${ZODIAC_SIGNS[tSignIdx]} (${relationToIndu} from Indu Lagna) actively influences the financial channel.`;
      }

      activePortals.push({
        planet: pName,
        transitSignName: ZODIAC_SIGNS[tSignIdx],
        relationToIndu,
        isBenefic,
        impactVerdict,
      });
    }
  }

  const hasMajorBeneficPortal = activePortals.some(p => (p.planet === "Jupiter" || p.planet === "Venus") && p.relationToIndu !== "Neutral");

  let transitSummary = "";
  if (hasMajorBeneficPortal) {
    transitSummary = "🌟 HIGH WEALTH TRANSIT WINDOW ACTIVE: Natural benefics (Jupiter/Venus) are directly activating your Indu Lagna axes. An ideal cosmic period for launching ventures, negotiating high-value deals, or expanding investments.";
  } else if (activePortals.length > 0) {
    transitSummary = "Moderate Transit Activity across Indu Lagna axes. Capital grows steadily through focused discipline.";
  } else {
    transitSummary = "Indu Lagna transit portals are operating quietly in background maintenance mode.";
  }

  return {
    activePortals,
    hasMajorBeneficPortal,
    transitSummary,
  };
}

// =========================================================================
// 8. MASTER REPORT GENERATOR (SESSIONS 86 & 87 SYNTHESIS)
// =========================================================================

export interface MedhajInduLagnaMasterReport {
  generatedAt: string;
  birthDate: string;
  evaluationDate: string;
  core: InduLagnaCoreResult;
  dhanaYogas: InduDhanaYogasResult;
  sustainedSupport: SustainedSupportPatternResult;
  ageActivations: InduPlanetaryAgeRadarResult;
  arudhaAlignment: InduArudhaAlignmentResult;
  transitPortals: InduTransitPortalsResult;
  masterExecutiveSummary: string;
}

/**
 * Generates the complete, production-grade Medhaj Astro Indu Lagna Master Report.
 */
export function generateMedhajInduLagnaMasterReport(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult,
  birthDate: Date,
  evaluationDate: Date
): MedhajInduLagnaMasterReport {
  const core = calculateMedhajInduLagna(natalEphem);
  const dhanaYogas = evaluateInduDhanaYogas(natalEphem, core);
  const sustainedSupport = evaluateSustainedSupportPattern(natalEphem);
  const ageActivations = calculateInduPlanetaryAgeActivations(natalEphem, core, birthDate, evaluationDate);
  const arudhaAlignment = evaluateInduArudhaAlignment(natalEphem, core);
  const transitPortals = evaluateInduTransitPortals(transitEphem, core);

  const masterExecutiveSummary = `
========================================================================================
MEDHAJ ASTRO INDU LAGNA WEALTH MASTER REPORT (SESSIONS 86 & 87)
========================================================================================
1. Indu Lagna Derivation:
   - 9th Lord from Lagna: ${core.lagnaNinthLord} (${core.lagnaNinthKala} Kalas)
   - 9th Lord from Moon: ${core.moonNinthLord} (${core.moonNinthKala} Kalas)
   - Total Points: ${core.totalKalas} ──► Remainder: ${core.remainderKala}
   - Indu Lagna Sign: ${core.induLagnaSignName} (${core.induLagnaSanskritName})
   - Placement: House #${core.induLagnaHouseFromD1} from D1 Lagna (${core.environmentalDignity})

2. Dhana Yoga Grade & Wealth Scaling:
   - Status: ${dhanaYogas.dhanaYogaGrade}
   - Occupants: ${dhanaYogas.planetsInInduLagna.join(", ") || "None"} (Benefics: ${dhanaYogas.beneficsInInduLagna.join(", ") || "None"})
   - Benefics in Trines (1, 5, 9): ${dhanaYogas.trineBenefics.map(b => `${b.planet} (H#${b.houseFromIndu})`).join(", ") || "None"}
   - Benefics in Kendras (1, 4, 7, 10): ${dhanaYogas.kendraBenefics.map(b => `${b.planet} (H#${b.houseFromIndu})`).join(", ") || "None"}
   - Verdict: ${dhanaYogas.dhanaYogaVerdict}
   ${dhanaYogas.entrepreneurial11thVerdict ? `\n   - 🚀 11th House Special: ${dhanaYogas.entrepreneurial11thVerdict}` : ""}

3. Sustained Financial Support (2, 4, 8 Rule of Thumb):
   - Coverage: ${sustainedSupport.supportCoveragePercentage}%
   - ${sustainedSupport.verdict}

4. Planetary Activation Ages on Indu Lagna:
   - Native Current Age: ${ageActivations.currentAgeYears} Years Old
   - ${ageActivations.executiveGuidance}

5. Arudha Lagna (AL) Alignment:
   - ${arudhaAlignment.convergenceInterpretation}

6. Real-Time Transit Portals:
   - ${transitPortals.transitSummary}
========================================================================================
`.trim();

  return {
    generatedAt: new Date().toISOString(),
    birthDate: birthDate.toISOString().slice(0, 10),
    evaluationDate: evaluationDate.toISOString().slice(0, 10),
    core,
    dhanaYogas,
    sustainedSupport,
    ageActivations,
    arudhaAlignment,
    transitPortals,
    masterExecutiveSummary,
  };
}
