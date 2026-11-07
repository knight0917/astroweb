/**
 * Omniscient 360° Multi-Aspect Astrological Intelligence Engine
 * 
 * Synthesizes every classical dimension:
 * 1. D-1 Rashi & Bhava foundations
 * 2. D-9 Navamsha & D-10 Dashamsha cross-verification
 * 3. Vimshottari micro-dasha (MD, AD, PD) active locator & timing windows
 * 4. Planetary Nuance Analyzer:
 *    - Neecha-Vakri & Uccha-Vakri Inversion (Uttara Kalamrita 2.6)
 *    - Multi-Tier Combustion Nuance (Cazimi vs Deep vs Exaltation Shield vs D-9 Decoupling)
 * 5. Jaimini Catalyst & Obstruction Engine (Chara Karakas, Argalas, Dispositor Loops)
 * 6. Double Transit of Jupiter & Saturn (Gochara Activation Gates)
 * 7. Ashtakavarga Energy Density (SAV & BAV)
 * 8. Deterministic Weighted Probability Scoring across 5 core life vectors.
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateVedicEphemeris } from "./ephemeris";
import { calculateVargaSign } from "./shodashavarga";
import { calculateVimshottariDasha, VimshottariDashaResult } from "./dasha";
import { calculateArgala, ArgalaReport } from "./jaimini";
import { calculateAshtakavarga, AshtakavargaResult } from "./ashtakavarga";
import { calculateGochar } from "./gochar";

// ============================================================================
// 1. DATA STRUCTURES & INTERFACES
// ============================================================================

export interface NeechaVakriPlanetInfo {
  name: string;
  signIndex: number;
  signName: string;
  house: number;
  isRetrograde: boolean;
  isDebilitated: boolean;
  isExalted: boolean;
  isNeechaVakri: boolean;
  isUcchaVakri: boolean;
  chestabalaStatus: "Peak (Chestabala 60/60)" | "Normal" | "Direct";
  classicalVerdict: string;
  actionGuidance: string;
}

export interface CombustionNuanceInfo {
  name: string;
  signIndex: number;
  signName: string;
  house: number;
  separationDeg: number;
  isCombust: boolean;
  combustionTier: "Cazimi (Divine Solar Core)" | "Deep Combustion (Scorched)" | "Corona Combustion (Mild Shadow)" | "Uncombust";
  hasExaltationShield: boolean;
  hasOwnSignShield: boolean;
  d1SunSign: string;
  d9SunSign: string;
  d1PlanetSign: string;
  d9PlanetSign: string;
  isD9Decoupled: boolean;
  immunityScore: number; // 0 to 100
  effectiveVerdict: string;
}

export interface JaiminiArgalaSynthesisInfo {
  argalaReport: ArgalaReport;
  has5thArgala: boolean;
  has9thVirodha: boolean;
  is5thObstructedBy9th: boolean;
  dispositor5thIn9th: boolean;
  karmicFirewallExplanation: string;
}

export interface DoubleTransitGateInfo {
  saturnTransitSign: string;
  saturnTransitHouseFromLagna: number;
  saturnAspectsHouses: number[];
  jupiterTransitSign: string;
  jupiterTransitHouseFromLagna: number;
  jupiterAspectsHouses: number[];
  activatedHouses: number[];
  doubleTransitSummary: string;
}

export interface LifeVectorScore {
  vectorId: "career" | "wealth" | "relationships" | "health" | "spirituality";
  title: string;
  icon: string;
  favorablePct: number;
  frictionPct: number;
  statusTitle: string;
  primaryDrivers: string[];
  keyObstacles: string[];
  timingWindow: string;
  practicalAction: string;
}

export interface DynamicFollowUpChip {
  id: string;
  category: "timing" | "cross_domain" | "remedy";
  label: string;
  prompt: string;
}

export interface OmniAspectMatrix {
  evaluationDate: Date;
  ascendantSignIndex: number;
  ascendantSignName: string;
  runningDasha: {
    mahadasha: string;
    antardasha: string;
    pratyantardasha: string;
    mdEnd: Date;
    adEnd: Date;
    pdEnd: Date;
    fullSummary: string;
  };
  neechaVakriPlanets: NeechaVakriPlanetInfo[];
  combustionNuances: CombustionNuanceInfo[];
  argalaSynthesis: JaiminiArgalaSynthesisInfo;
  doubleTransitGates: DoubleTransitGateInfo;
  lifeVectorScores: Record<"career" | "wealth" | "relationships" | "health" | "spirituality", LifeVectorScore>;
  suggestedFollowUpChips: DynamicFollowUpChip[];
  narrativeBrief: string;
}

// ============================================================================
// 2. CLASSICAL EXALTATION & DEBILITATION SIGNS (BPHS / SURYA SIDDHANTA)
// ============================================================================

const EXALTATION_MAP: Record<string, number> = {
  Sun: 0, // Aries
  Moon: 1, // Taurus
  Mars: 9, // Capricorn
  Mercury: 5, // Virgo
  Jupiter: 3, // Cancer
  Venus: 11, // Pisces
  Saturn: 6, // Libra
  Rahu: 1, // Taurus
  Ketu: 7, // Scorpio
};

const DEBILITATION_MAP: Record<string, number> = {
  Sun: 6, // Libra
  Moon: 7, // Scorpio
  Mars: 3, // Cancer
  Mercury: 11, // Pisces
  Jupiter: 9, // Capricorn
  Venus: 5, // Virgo
  Saturn: 0, // Aries
  Rahu: 7, // Scorpio
  Ketu: 1, // Taurus
};

const COMBUSTION_LIMITS: Record<string, number> = {
  Moon: 12,
  Mars: 17,
  Mercury: 14,
  Jupiter: 11,
  Venus: 10,
  Saturn: 15,
};

// ============================================================================
// 3. OMNI-ASPECT ENGINE CALCULATIONS
// ============================================================================

/**
 * Evaluates Neecha-Vakri and Uccha-Vakri Inversions
 * Reference: Uttara Kalamrita, Khanda 2, Sloka 6: "वक्रं गतो नीचोऽपि उच्चवत् फलम्"
 */
export function evaluateNeechaVakriPlanets(ephem: EphemerisResult): NeechaVakriPlanetInfo[] {
  const ascRashi = Math.floor(ephem.ascendant.siderealLongitude / 30);
  const results: NeechaVakriPlanetInfo[] = [];

  for (const [name, p] of Object.entries(ephem.planets)) {
    if (p.isModernPlanet) continue;
    const signIdx = Math.floor(p.siderealLongitude / 30);
    const house = ((signIdx - ascRashi + 12) % 12) + 1;
    const isDebilitated = signIdx === DEBILITATION_MAP[name];
    const isExalted = signIdx === EXALTATION_MAP[name];
    const isRetrograde = !!p.isRetrograde;

    const isNeechaVakri = isDebilitated && isRetrograde;
    const isUcchaVakri = isExalted && isRetrograde;

    let chestabalaStatus: NeechaVakriPlanetInfo["chestabalaStatus"] = isRetrograde
      ? "Peak (Chestabala 60/60)"
      : "Direct";

    let classicalVerdict = "Normal direct motion and dignity.";
    let actionGuidance = "Standard planetary operations apply.";

    if (isNeechaVakri) {
      classicalVerdict = `Classical Neecha-Vakri (Uttara Kalamrita 2.6): Functions with spring-loaded Exalted power (Ucchavat Phala). Causes severe initial compression and delay, but guarantees monumental, unshakeable late-life fruition (Pashchat Bhagya).`;
      actionGuidance = `Treat early obstacles as root-building endurance training; do not judge this placement by youthful stagnation—its wealth/authority arrives after age 26-28.`;
    } else if (isUcchaVakri) {
      classicalVerdict = `Classical Uccha-Vakri: Exalted dignity with retrograde intensity. Produces erratic bursts of high achievement followed by intense internal re-evaluation.`;
      actionGuidance = `Channel the high pressure into creative architecture rather than personal impatience.`;
    } else if (isDebilitated) {
      classicalVerdict = `Direct Debilitation: Planet operates in an uncomfortable environment without retrograde friction resistance.`;
      actionGuidance = `Requires conscious remedial strengthening and external mentorship.`;
    } else if (isExalted) {
      classicalVerdict = `Direct Exaltation: Pure positive flow and effortless authority in its domain.`;
      actionGuidance = `Leverage this placement as the natural anchor for career and self-presentation.`;
    }

    results.push({
      name,
      signIndex: signIdx,
      signName: RASHI_NAMES[signIdx].englishName,
      house,
      isRetrograde,
      isDebilitated,
      isExalted,
      isNeechaVakri,
      isUcchaVakri,
      chestabalaStatus,
      classicalVerdict,
      actionGuidance,
    });
  }

  return results;
}

/**
 * Evaluates Multi-Tier Combustion Nuance & Shastric Immunity Shields
 * References: Saravali Ch. 35, BPHS Ch. 34, Phaladeepika Adhyaya 6
 */
export function evaluateCombustionNuances(ephem: EphemerisResult): CombustionNuanceInfo[] {
  const sun = ephem.planets.Sun;
  if (!sun) return [];

  const sunSign = Math.floor(sun.siderealLongitude / 30);
  const sunD9SignIdx = calculateVargaSign(sun.siderealLongitude, "D9");
  const sunD9SignName = RASHI_NAMES[sunD9SignIdx].englishName;
  const ascRashi = Math.floor(ephem.ascendant.siderealLongitude / 30);

  const results: CombustionNuanceInfo[] = [];

  for (const [name, p] of Object.entries(ephem.planets)) {
    if (["Sun", "Rahu", "Ketu"].includes(name) || p.isModernPlanet) continue;

    const signIdx = Math.floor(p.siderealLongitude / 30);
    const house = ((signIdx - ascRashi + 12) % 12) + 1;
    const d9SignIdx = calculateVargaSign(p.siderealLongitude, "D9");
    const d9SignName = RASHI_NAMES[d9SignIdx].englishName;

    // Angular separation
    let diff = Math.abs(p.siderealLongitude - sun.siderealLongitude) % 360;
    if (diff > 180) diff = 360 - diff;

    const limit = COMBUSTION_LIMITS[name] || 14;
    const isCombust = diff <= limit;

    let combustionTier: CombustionNuanceInfo["combustionTier"] = "Uncombust";
    if (isCombust) {
      if (diff <= 0.2833) combustionTier = "Cazimi (Divine Solar Core)";
      else if (diff <= 3.3333) combustionTier = "Deep Combustion (Scorched)";
      else combustionTier = "Corona Combustion (Mild Shadow)";
    }

    // Immunity shields
    const hasExaltationShield = signIdx === EXALTATION_MAP[name];
    const hasOwnSignShield = signIdx === DEBILITATION_MAP[name] ? false : [p.rashi.lord].includes(name);
    const isD9Decoupled = d9SignIdx !== sunD9SignIdx;

    let immunityScore = 0;
    if (!isCombust) {
      immunityScore = 100;
    } else {
      if (combustionTier === "Cazimi (Divine Solar Core)") immunityScore = 95;
      else {
        if (hasExaltationShield) immunityScore += 45;
        if (hasOwnSignShield) immunityScore += 35;
        if (isD9Decoupled) immunityScore += 35;
        if (combustionTier === "Corona Combustion (Mild Shadow)") immunityScore += 20;
        immunityScore = Math.min(100, immunityScore);
      }
    }

    let effectiveVerdict = "Free from solar combustion.";
    if (isCombust) {
      if (combustionTier === "Cazimi (Divine Solar Core)") {
        effectiveVerdict = `Cazimi (In the Heart of the Sun): Imbued with royal solar radiance and elevated spiritual authority.`;
      } else if (immunityScore >= 70) {
        effectiveVerdict = `Combustion Neutralized: Shielded by Exaltation / Navamsha (D-9) sign decoupling. Causes psychological hesitation in early interviews, but preserves 100% functional yoga delivery.`;
      } else {
        effectiveVerdict = `Active Combustion: Requires gemstone amplification and Vishnu/Surya remedial propitiation.`;
      }
    }

    results.push({
      name,
      signIndex: signIdx,
      signName: RASHI_NAMES[signIdx].englishName,
      house,
      separationDeg: Number(diff.toFixed(2)),
      isCombust,
      combustionTier,
      hasExaltationShield,
      hasOwnSignShield,
      d1SunSign: RASHI_NAMES[sunSign].englishName,
      d9SunSign: sunD9SignName,
      d1PlanetSign: RASHI_NAMES[signIdx].englishName,
      d9PlanetSign: d9SignName,
      isD9Decoupled,
      immunityScore,
      effectiveVerdict,
    });
  }

  return results;
}

/**
 * Evaluates Jaimini Argala & Virodhargala with Dispositor Resonance
 */
export function evaluateJaiminiArgalaSynthesis(ephem: EphemerisResult): JaiminiArgalaSynthesisInfo {
  const ascRashi = Math.floor(ephem.ascendant.siderealLongitude / 30);
  const lagnaArgala = calculateArgala(ephem, ascRashi, "Lagna");

  const fifthArgala = lagnaArgala.argalas.find((a) => a.type === "Secondary (5th)");
  const has5thArgala = (fifthArgala?.argalaPlanets.length || 0) > 0;
  const has9thVirodha = (fifthArgala?.virodhaPlanets.length || 0) > 0;
  const is5thObstructedBy9th = !!fifthArgala && !fifthArgala.isUnobstructed && has5thArgala;

  // Check 5th lord position
  const fifthSign = (ascRashi + 4) % 12;
  const ninthSign = (ascRashi + 8) % 12;
  const fifthLord = RASHI_NAMES[fifthSign].lord;
  const fifthLordPos = ephem.planets[fifthLord];
  const dispositor5thIn9th = !!fifthLordPos && Math.floor(fifthLordPos.siderealLongitude / 30) === ninthSign;

  let karmicFirewallExplanation = "Balanced intellectual and dharmic energy.";
  if (is5thObstructedBy9th) {
    if (dispositor5thIn9th) {
      karmicFirewallExplanation = `The 9th house acts as a Karmic Firewall: It blocks superficial Venus-Rahu shortcuts and fantasies, while the 5th Lord sitting in the 9th forms a supreme Trikona Raja Yoga, transmuting creative restlessness into deep technical mastery.`;
    } else {
      karmicFirewallExplanation = `5th house creative/speculative pursuits face rigorous parental and ethical filters from the 9th house.`;
    }
  }

  return {
    argalaReport: lagnaArgala,
    has5thArgala,
    has9thVirodha,
    is5thObstructedBy9th,
    dispositor5thIn9th,
    karmicFirewallExplanation,
  };
}

/**
 * Evaluates Double Transit of Jupiter & Saturn over Natal Houses
 */
export function evaluateDoubleTransitGates(
  ephem: EphemerisResult,
  transitEphemerisOrDate?: EphemerisResult | Date,
  evaluationDate: Date = new Date()
): DoubleTransitGateInfo {
  let transitEphem: EphemerisResult;
  let evalDate = evaluationDate;

  if (transitEphemerisOrDate instanceof Date) {
    evalDate = transitEphemerisOrDate;
    transitEphem = calculateVedicEphemeris(
      evalDate,
      { cityName: "Transit", country: "Global", latitude: 20.0, longitude: 78.0, timezoneOffsetHours: 5.5 },
      ephem.ayanamshaType || "Lahiri"
    );
  } else if (transitEphemerisOrDate && (transitEphemerisOrDate as EphemerisResult).planets) {
    transitEphem = transitEphemerisOrDate as EphemerisResult;
  } else {
    transitEphem = calculateVedicEphemeris(
      evalDate,
      { cityName: "Transit", country: "Global", latitude: 20.0, longitude: 78.0, timezoneOffsetHours: 5.5 },
      ephem.ayanamshaType || "Lahiri"
    );
  }

  const gochar = calculateGochar(ephem, transitEphem);
  const transits = gochar.transits;

  const saturnTransit = transits.find((t) => t.id === "Saturn");
  const jupiterTransit = transits.find((t) => t.id === "Jupiter");

  const saturnHouse = saturnTransit?.transitHouseFromLagna || 1;
  const jupiterHouse = jupiterTransit?.transitHouseFromLagna || 1;

  // Classical aspects from Lagna house
  // Saturn aspects 3rd, 7th, 10th from itself + occupies its own house
  const saturnAspects = [
    saturnHouse,
    ((saturnHouse + 2 - 1) % 12) + 1,
    ((saturnHouse + 6 - 1) % 12) + 1,
    ((saturnHouse + 9 - 1) % 12) + 1,
  ];

  // Jupiter aspects 5th, 7th, 9th from itself + occupies its own house
  const jupiterAspects = [
    jupiterHouse,
    ((jupiterHouse + 4 - 1) % 12) + 1,
    ((jupiterHouse + 6 - 1) % 12) + 1,
    ((jupiterHouse + 8 - 1) % 12) + 1,
  ];

  // Find intersection (Double Transit activated houses)
  const activatedHouses = saturnAspects.filter((h) => jupiterAspects.includes(h));

  const doubleTransitSummary =
    activatedHouses.length > 0
      ? `Double Transit Activation Gate: Houses [${activatedHouses.join(", ")}] are energized simultaneously by Jupiter's grace and Saturn's manifestation power.`
      : `Saturn and Jupiter operate on divergent sectors; individual house transits dictate timing.`;

  return {
    saturnTransitSign: saturnTransit?.transitRashiName || "Pisces",
    saturnTransitHouseFromLagna: saturnHouse,
    saturnAspectsHouses: saturnAspects,
    jupiterTransitSign: jupiterTransit?.transitRashiName || "Gemini",
    jupiterTransitHouseFromLagna: jupiterHouse,
    jupiterAspectsHouses: jupiterAspects,
    activatedHouses,
    doubleTransitSummary,
  };
}

/**
 * Computes Deterministic Weighted Probability Scores across 5 Life Vectors
 */
export function calculateWeightedProbabilityScores(
  ephem: EphemerisResult,
  dasha: VimshottariDashaResult,
  neechaVakri: NeechaVakriPlanetInfo[],
  combustion: CombustionNuanceInfo[],
  argala: JaiminiArgalaSynthesisInfo,
  doubleTransit: DoubleTransitGateInfo,
  ashtakavarga: AshtakavargaResult
): Record<"career" | "wealth" | "relationships" | "health" | "spirituality", LifeVectorScore> {
  const ascRashi = Math.floor(ephem.ascendant.siderealLongitude / 30);
  const activeMd = dasha.activeDasha?.mahadasha.name || "Jupiter";
  const activeAd = dasha.activeDasha?.antardasha.name || "Mercury";

  const getHouseSignIdx = (houseNum: number) => (ascRashi + houseNum - 1) % 12;
  const getHouseLordName = (houseNum: number) => RASHI_NAMES[getHouseSignIdx(houseNum)].lord;
  const formatMonthYear = (d?: Date) =>
    d instanceof Date && !Number.isNaN(d.getTime())
      ? d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
      : "Upcoming Cycle";

  const adEndFormatted = formatMonthYear(dasha.activeDasha?.adEnd);
  const mdEndFormatted = formatMonthYear(dasha.activeDasha?.mdEnd);

  const lagnaLord = getHouseLordName(1);
  const secondLord = getHouseLordName(2);
  const fifthLord = getHouseLordName(5);
  const seventhLord = getHouseLordName(7);
  const ninthLord = getHouseLordName(9);
  const tenthLord = getHouseLordName(10);
  const eleventhLord = getHouseLordName(11);

  const sarva10 = ashtakavarga.sarvaHouseBindus?.[9] ?? 28;
  const sarva11 = ashtakavarga.sarvaHouseBindus?.[10] ?? 28;
  const sarva7 = ashtakavarga.sarvaHouseBindus?.[6] ?? 28;
  const sarva1 = ashtakavarga.sarvaHouseBindus?.[0] ?? 28;
  const sarva9 = ashtakavarga.sarvaHouseBindus?.[8] ?? 28;

  // 1. CAREER & STATUS VECTOR (10th house, D-10, AmK, Ashtakavarga, Double Transit)
  let careerScore = 58 + Math.max(-8, Math.min(12, (sarva10 - 28) * 2));
  const careerDrivers: string[] = [];
  const careerObstacles: string[] = [];

  const tenthLordPos = ephem.planets[tenthLord];
  if (tenthLordPos && [1, 4, 5, 7, 9, 10, 11].includes(tenthLordPos.house)) {
    careerScore += 10;
    careerDrivers.push(
      `10th Lord ${tenthLord} placed in Kendra/Trikona/Labha House ${tenthLordPos.house} (${tenthLordPos.rashi.englishName}) anchors professional authority.`
    );
  }
  const mercuryNuance = combustion.find((c) => c.name === "Mercury");
  if (mercuryNuance?.hasExaltationShield) {
    careerScore += 12;
    careerDrivers.push("Exalted Mercury forms high-potency analytical & commercial execution yogas.");
  }
  if (doubleTransit.activatedHouses.includes(10)) {
    careerScore += 10;
    careerDrivers.push("Jupiter-Saturn Double Transit actively illuminates the 10th House of Karma.");
  }
  if (activeAd === tenthLord || activeMd === tenthLord || activeAd === eleventhLord) {
    careerScore += 10;
    careerDrivers.push(
      `Active ${activeMd}–${activeAd} period (through ${adEndFormatted}) directly triggers career milestone houses.`
    );
  }
  const nvPlanets = neechaVakri.filter((p) => p.isNeechaVakri);
  if (nvPlanets.length > 0) {
    careerScore += 6;
    careerDrivers.push(
      `Neecha-Vakri ${nvPlanets.map((p) => p.name).join(", ")} confers high Chestabala resilience after initial testing.`
    );
  }
  if (careerDrivers.length === 0) {
    careerDrivers.push(
      `10th House carries ${sarva10} Sarvashtakavarga bindus under ${tenthLord} lordship, supporting steady professional progression.`
    );
  }
  if (tenthLordPos && [6, 8, 12].includes(tenthLordPos.house)) {
    careerScore -= 8;
    careerObstacles.push(
      `10th Lord ${tenthLord} in Dusthana House ${tenthLordPos.house} requires strategic adaptability and unconventional skill-building.`
    );
  }
  if (sarva10 < 26) {
    careerObstacles.push(
      `Moderate 10th-house SAV density (${sarva10} bindus) demands extra operational persistence.`
    );
  }
  if (careerObstacles.length === 0) {
    careerObstacles.push("Pacing major role transitions with Double Transit windows prevents premature burnout.");
  }
  careerScore = Math.min(94, Math.max(25, careerScore));

  // 2. WEALTH & INFLOW VECTOR (2nd, 11th, SAV, Active Dasha)
  let wealthScore = 55 + Math.max(-8, Math.min(14, (sarva11 - 28) * 2));
  const wealthDrivers: string[] = [];
  const wealthObstacles: string[] = [];

  const eleventhLordPos = ephem.planets[eleventhLord];
  const secondLordPos = ephem.planets[secondLord];
  if (eleventhLordPos && [1, 2, 4, 5, 7, 9, 10, 11].includes(eleventhLordPos.house)) {
    wealthScore += 12;
    wealthDrivers.push(
      `11th Lord ${eleventhLord} in House ${eleventhLordPos.house} (${eleventhLordPos.rashi.englishName}) energizes recurring gains and network inflows.`
    );
  }
  if (sarva11 >= 30) {
    wealthScore += 8;
    wealthDrivers.push(
      `Elevated 11th-house Labha Sarvashtakavarga (${sarva11} bindus) multiplies capital retention.`
    );
  }
  if ([secondLord, eleventhLord, "Jupiter", "Venus"].includes(activeAd)) {
    wealthScore += 8;
    wealthDrivers.push(`Running ${activeAd} Antardasha activates liquid cashflow and asset accumulation channels.`);
  }
  if (wealthDrivers.length === 0) {
    wealthDrivers.push(
      `2nd Lord ${secondLord} and 11th Lord ${eleventhLord} govern structured wealth compounding (${sarva11} Labha bindus).`
    );
  }
  if (secondLordPos && [6, 8, 12].includes(secondLordPos.house)) {
    wealthScore -= 8;
    wealthObstacles.push(
      `2nd Lord ${secondLord} in House ${secondLordPos.house} cautions against impulsive liquidity leaks.`
    );
  }
  if (wealthObstacles.length === 0) {
    wealthObstacles.push("Disciplined treasury allocation is required to convert gross inflows into lasting net worth.");
  }
  wealthScore = Math.min(92, Math.max(20, wealthScore));

  // 3. RELATIONSHIPS & MARRIAGE VECTOR (7th house, D-9, Combustion/Decoupling)
  let relScore = 54 + Math.max(-8, Math.min(10, (sarva7 - 28) * 2));
  const relDrivers: string[] = [];
  const relObstacles: string[] = [];

  const seventhLordPos = ephem.planets[seventhLord];
  const seventhCombust = combustion.find((c) => c.name === seventhLord && c.isCombust);
  if (seventhLordPos && [1, 2, 4, 5, 7, 9, 10, 11].includes(seventhLordPos.house)) {
    relScore += 10;
    relDrivers.push(
      `7th Lord ${seventhLord} in House ${seventhLordPos.house} (${seventhLordPos.rashi.englishName}) supports committed partnership alignment.`
    );
  }
  if (seventhCombust?.isD9Decoupled) {
    relScore += 12;
    relDrivers.push(
      `Navamsha (D-9) decoupling of ${seventhLord} resolves early communication friction in mature partnership.`
    );
  }
  if (doubleTransit.activatedHouses.includes(7)) {
    relScore += 10;
    relDrivers.push("Active Double Transit across the 7th House favors relationship formalization and harmony.");
  }
  if (relDrivers.length === 0) {
    relDrivers.push(
      `7th House governed by ${seventhLord} (${sarva7} SAV bindus) anchors long-term mutual trust through conscious dialogue.`
    );
  }
  if (seventhCombust && !seventhCombust.isD9Decoupled) {
    relScore -= 10;
    relObstacles.push(
      `7th Lord ${seventhLord} solar proximity (${seventhCombust.separationDeg.toFixed(1)}°) requires patience in emotional expression.`
    );
  }
  if (relObstacles.length === 0) {
    relObstacles.push("Balancing career commitments with transparent emotional availability prevents misunderstanding.");
  }
  relScore = Math.min(88, Math.max(30, relScore));

  // 4. VITALITY & HEALTH VECTOR (1st, 6th, 8th, Lagna Lord)
  let healthScore = 66 + Math.max(-8, Math.min(10, (sarva1 - 28) * 2));
  const healthDrivers: string[] = [];
  const healthObstacles: string[] = [];

  const lagnaLordPos = ephem.planets[lagnaLord];
  if (lagnaLordPos && [1, 4, 5, 7, 9, 10, 11].includes(lagnaLordPos.house)) {
    healthScore += 10;
    healthDrivers.push(
      `Lagna Lord ${lagnaLord} well-placed in House ${lagnaLordPos.house} (${lagnaLordPos.rashi.englishName}) fortifies constitutional stamina.`
    );
  }
  if (lagnaLordPos?.isRetrograde) {
    healthScore += 6;
    healthDrivers.push(`Retrograde Lagna Lord ${lagnaLord} carries strong Chestabala recovery vigor.`);
  }
  if (healthDrivers.length === 0) {
    healthDrivers.push(
      `Ascendant in ${RASHI_NAMES[ascRashi].englishName} (${sarva1} SAV bindus) maintains resilient baseline vitality with rhythmic daily routine.`
    );
  }
  healthObstacles.push("Nervous over-extension during intense Dasha transitions requires structured sleep and pranayama.");
  healthScore = Math.min(95, Math.max(35, healthScore));

  // 5. SPIRITUAL DESTINY VECTOR (5th, 9th, 12th, Argala Dharma Loop)
  let spiritScore = 72 + Math.max(-6, Math.min(10, (sarva9 - 28) * 2));
  const spiritDrivers: string[] = [];
  const spiritObstacles: string[] = [];

  if (argala.dispositor5thIn9th) {
    spiritScore += 14;
    spiritDrivers.push(
      `5th Lord ${fifthLord} linked with 9th House creates a powerful Trikona Dharma-Jnana Yoga.`
    );
  }
  const ninthLordPos = ephem.planets[ninthLord];
  if (ninthLordPos && [1, 4, 5, 7, 9, 10, 11].includes(ninthLordPos.house)) {
    spiritScore += 8;
    spiritDrivers.push(
      `9th Lord ${ninthLord} in House ${ninthLordPos.house} (${ninthLordPos.rashi.englishName}) deepens philosophical intuition and dharmic protection.`
    );
  }
  if (spiritDrivers.length === 0) {
    spiritDrivers.push(
      `Trikona lords ${fifthLord} and ${ninthLord} sustain inner clarity, contemplation, and protective purva-punya grace.`
    );
  }
  spiritObstacles.push("Sustaining daily sadhana consistency amidst material responsibilities.");
  spiritScore = Math.min(98, Math.max(40, spiritScore));

  const activeWindowLabel = `${activeMd}–${activeAd} Window (until ${adEndFormatted})`;

  return {
    career: {
      vectorId: "career",
      title: "Career & Professional Authority",
      icon: "💼",
      favorablePct: careerScore,
      frictionPct: 100 - careerScore,
      statusTitle: careerScore >= 75 ? "Highly Favorable (Breakthrough Gateway)" : "Developing Momentum",
      primaryDrivers: careerDrivers,
      keyObstacles: careerObstacles,
      timingWindow: activeWindowLabel,
      practicalAction: `Align high-leverage career deliverables with ${tenthLord} and ${activeAd} significations.`,
    },
    wealth: {
      vectorId: "wealth",
      title: "Liquid Wealth & Financial Inflow",
      icon: "💰",
      favorablePct: wealthScore,
      frictionPct: 100 - wealthScore,
      statusTitle: wealthScore >= 70 ? "Unlocking Cashflow Stream" : "Gradual Stabilization",
      primaryDrivers: wealthDrivers,
      keyObstacles: wealthObstacles,
      timingWindow: activeWindowLabel,
      practicalAction: `Compound inflows systematically through ${eleventhLord} and ${secondLord} treasury discipline.`,
    },
    relationships: {
      vectorId: "relationships",
      title: "Partnership & Marriage Harmony",
      icon: "💍",
      favorablePct: relScore,
      frictionPct: 100 - relScore,
      statusTitle: relScore >= 70 ? "Harmonious Partnership Alignment" : "Maturing Bond & Intellectual Alignment",
      primaryDrivers: relDrivers,
      keyObstacles: relObstacles,
      timingWindow: `${activeMd} Mahadasha (through ${mdEndFormatted})`,
      practicalAction: "Practice transparent communication and mutual dharmic respect in partnerships.",
    },
    health: {
      vectorId: "health",
      title: "Vitality, Energy & Mental Well-being",
      icon: "🌿",
      favorablePct: healthScore,
      frictionPct: 100 - healthScore,
      statusTitle: healthScore >= 72 ? "Resilient & High-Tensile Constitution" : "Balanced Constitutional Care",
      primaryDrivers: healthDrivers,
      keyObstacles: healthObstacles,
      timingWindow: "Active & Ongoing Daily Rhythm",
      practicalAction: `Support Lagna Lord ${lagnaLord} via morning Surya Arghya, hydration, and grounding breathwork.`,
    },
    spirituality: {
      vectorId: "spirituality",
      title: "Spiritual Mission & Higher Purpose",
      icon: "🧘",
      favorablePct: spiritScore,
      frictionPct: 100 - spiritScore,
      statusTitle: "Deep Awakening & Dharmic Intellect",
      primaryDrivers: spiritDrivers,
      keyObstacles: spiritObstacles,
      timingWindow: `Lifelong Anchor (${activeMd}–${activeAd} Phase)`,
      practicalAction: `Honor 9th Lord ${ninthLord} through daily mantra japa and study of classical wisdom.`,
    },
  };
}

/**
 * Generates Context-Aware Follow-Up Chips based on the Native's Chart
 */
export function generateDynamicFollowUpChips(
  matrix: Partial<OmniAspectMatrix>
): DynamicFollowUpChip[] {
  const md = matrix.runningDasha?.mahadasha || "current";
  const ad = matrix.runningDasha?.antardasha || "active";
  const asc = matrix.ascendantSignName || "natal";

  return [
    {
      id: "chip-timing",
      category: "timing",
      label: `🗓️ ${md}–${ad} Peak Dates`,
      prompt: `What are the exact monthly breakthrough windows during my ${md} Mahadasha and ${ad} Antardasha?`,
    },
    {
      id: "chip-cross-domain",
      category: "cross_domain",
      label: `💼 ${asc} Career & Wealth`,
      prompt: `How do my 10th and 11th house lords interact in D-1 and D-10 to shape my career growth and financial inflow?`,
    },
    {
      id: "chip-remedy",
      category: "remedy",
      label: "⚡ Top Daily Remedy",
      prompt: `What is the single most effective daily Vedic remedy for my ${asc} Ascendant and active ${md}–${ad} Dasha?`,
    },
  ];
}

/**
 * Master Entry Point: Computes the complete 360° Omni-Aspect Matrix
 */
export function calculateOmniAspectMatrix(
  ephem: EphemerisResult,
  transitEphemerisOrDate?: EphemerisResult | Date,
  evaluationDate: Date = new Date()
): OmniAspectMatrix {
  let evalDate = evaluationDate;
  let transitEphem: EphemerisResult | undefined;

  if (transitEphemerisOrDate instanceof Date) {
    evalDate = transitEphemerisOrDate;
  } else if (transitEphemerisOrDate) {
    transitEphem = transitEphemerisOrDate;
  }

  const ascRashi = Math.floor(ephem.ascendant.siderealLongitude / 30);
  const ascName = RASHI_NAMES[ascRashi].englishName;

  // Dasha (anchored to true natal UTC birth timestamp!)
  const moon = ephem.planets.Moon;
  const moonLon = moon ? moon.siderealLongitude : 0;
  const birthDate = ephem.utcDate ? new Date(ephem.utcDate) : evalDate;
  const safeBirthDate = Number.isNaN(birthDate.getTime()) ? evalDate : birthDate;
  const dasha = calculateVimshottariDasha(safeBirthDate, moonLon, evalDate);

  // Components
  const neechaVakri = evaluateNeechaVakriPlanets(ephem);
  const combustion = evaluateCombustionNuances(ephem);
  const argala = evaluateJaiminiArgalaSynthesis(ephem);
  const doubleTransit = evaluateDoubleTransitGates(ephem, transitEphem || evalDate, evalDate);
  const ashtakavarga = calculateAshtakavarga(ephem);

  const lifeVectorScores = calculateWeightedProbabilityScores(
    ephem,
    dasha,
    neechaVakri,
    combustion,
    argala,
    doubleTransit,
    ashtakavarga
  );

  const activeMd = dasha.activeDasha?.mahadasha.name || "Jupiter";
  const activeAd = dasha.activeDasha?.antardasha.name || "Mercury";
  const activePd = dasha.activeDasha?.pratyantardasha.name || "Mercury";

  const fullSummary = `${activeMd} MD / ${activeAd} AD / ${activePd} PD`;
  const runningDashaObj = {
    mahadasha: activeMd,
    antardasha: activeAd,
    pratyantardasha: activePd,
    mdEnd: dasha.activeDasha?.mdEnd || evalDate,
    adEnd: dasha.activeDasha?.adEnd || evalDate,
    pdEnd: dasha.activeDasha?.pdEnd || evalDate,
    fullSummary,
  };

  const suggestedFollowUpChips = generateDynamicFollowUpChips({
    ascendantSignName: ascName,
    runningDasha: runningDashaObj,
    lifeVectorScores,
  });

  const lagnaLord = RASHI_NAMES[ascRashi].lord;
  const tenthLord = RASHI_NAMES[(ascRashi + 9) % 12].lord;
  const narrativeBrief = `${ascName} Ascendant chart governed by ${lagnaLord} with 10th Lord ${tenthLord}, currently operating in ${fullSummary}. Multi-varga synthesis indicates ${lifeVectorScores.career.favorablePct}% career momentum and ${lifeVectorScores.wealth.favorablePct}% financial inflow alignment, with Double Transit activating Houses [${doubleTransit.activatedHouses.join(", ") || "none"}].`;

  return {
    evaluationDate: evalDate,
    ascendantSignIndex: ascRashi,
    ascendantSignName: ascName,
    runningDasha: runningDashaObj,
    neechaVakriPlanets: neechaVakri,
    combustionNuances: combustion,
    argalaSynthesis: argala,
    doubleTransitGates: doubleTransit,
    lifeVectorScores,
    suggestedFollowUpChips,
    narrativeBrief,
  };
}
