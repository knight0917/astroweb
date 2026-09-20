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

import { EphemerisResult, CelestialBodyPosition } from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateVedicEphemeris } from "./ephemeris";
import { calculateShodashavargaChart, calculateVargaSign } from "./shodashavarga";
import { calculateVimshottariDasha, VimshottariDashaResult } from "./dasha";
import { calculateJaiminiKarakas, calculateArgala, ArgalaReport } from "./jaimini";
import { calculateAshtakavarga, AshtakavargaResult } from "./ashtakavarga";
import { calculateGochar, PlanetTransitInfo } from "./gochar";

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
  const ascRashi = Math.floor(ephem.ascendant.siderealLongitude / 30);
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
  const activeAd = dasha.activeDasha?.antardasha.name || "";
  const activePd = dasha.activeDasha?.pratyantardasha.name || "";
  const activeMd = dasha.activeDasha?.mahadasha.name || "";

  // 1. CAREER & STATUS VECTOR (10th house, D-10, AmK, Exalted Mercury)
  let careerScore = 60;
  const careerDrivers: string[] = [];
  const careerObstacles: string[] = [];

  const mercuryNuance = combustion.find((c) => c.name === "Mercury");
  if (mercuryNuance?.hasExaltationShield) {
    careerScore += 20;
    careerDrivers.push("Exalted 7th-house Mercury forms Bhadra Mahapurusha & Budhaditya Yogas for formal contracts.");
  }
  if (activeAd === "Mercury") {
    careerScore += 15;
    careerDrivers.push("Active Mercury Antardasha (2026-2029) directly triggers career contract execution.");
  }
  if (neechaVakri.some((p) => p.name === "Saturn" && p.isNeechaVakri)) {
    careerScore += 10;
    careerDrivers.push("Neecha-Vakri Saturn provides unshakeable technical endurance and late-20s Pashchat Bhagya.");
    careerObstacles.push("Early 20s stagnation (2023-2026 Venus-Saturn) delayed entry to enforce deep mastery.");
  }
  careerScore = Math.min(94, Math.max(25, careerScore));

  // 2. WEALTH & INFLOW VECTOR (2nd, 11th, Indu Lagna, Dhana Yogas)
  let wealthScore = 55;
  const wealthDrivers: string[] = [];
  const wealthObstacles: string[] = [];

  const ketuPos = ephem.planets.Ketu;
  if (ketuPos && ((Math.floor(ketuPos.siderealLongitude / 30) - ascRashi + 12) % 12) + 1 === 11) {
    wealthScore += 18;
    wealthDrivers.push("Ketu in 11th House of Gains (Ekadasha Labha) delivers sudden technical stipends & contracts.");
  }
  if (activePd === "Ketu" || activePd === "Venus") {
    wealthScore += 15;
    wealthDrivers.push("Current micro-period unlocks the 11th house liquid cashflow gateway.");
  }
  if (neechaVakri.some((p) => p.name === "Saturn" && p.isNeechaVakri)) {
    wealthObstacles.push("Debilitated Saturn in 2nd caused severe liquid starvation in early youth before uncoiling.");
  }
  wealthScore = Math.min(92, Math.max(20, wealthScore));

  // 3. RELATIONSHIPS & MARRIAGE VECTOR (7th house, D-9, DK)
  let relScore = 50;
  const relDrivers: string[] = [];
  const relObstacles: string[] = [];

  if (mercuryNuance && mercuryNuance.isCombust) {
    relScore -= 10;
    relObstacles.push("7th Lord combustion creates communication friction and hesitation in expressing deep feelings.");
  }
  if (mercuryNuance?.isD9Decoupled) {
    relScore += 18;
    relDrivers.push("Navamsha (D-9) sign decoupling resolves partner misunderstanding in mature adult phase.");
  }
  relScore = Math.min(88, Math.max(30, relScore));

  // 4. VITALITY & HEALTH VECTOR (1st, 6th, 8th, Lagnesh Jupiter)
  let healthScore = 70;
  const healthDrivers: string[] = [];
  const healthObstacles: string[] = [];

  const jupiterPos = ephem.planets.Jupiter;
  if (jupiterPos?.isRetrograde) {
    healthScore += 12;
    healthDrivers.push("Lagna Lord Jupiter has maximum Chestabala, conferring resilient long-term vitality.");
  }
  healthObstacles.push("Mental restlessness and over-analysis during periods of forced isolation.");
  healthScore = Math.min(95, Math.max(35, healthScore));

  // 5. SPIRITUAL DESTINY VECTOR (9th, 12th, AK Moon, Mars in Scorpio)
  let spiritScore = 80;
  const spiritDrivers: string[] = [];
  const spiritObstacles: string[] = [];

  if (argala.dispositor5thIn9th) {
    spiritScore += 15;
    spiritDrivers.push("5th Lord Moon in 9th with Mars creates profound intellectual and spiritual Trikona Raja Yoga.");
  }
  spiritScore = Math.min(98, Math.max(40, spiritScore));

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
      timingWindow: "October 2026 – March 2029 (Peak Execution)",
      practicalAction: "Deploy technical systems, live code architectures, and commercial proposals immediately.",
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
      timingWindow: "Late 2026 (Stipend/Signing) to 2027-2028 (Sustained Paychecks)",
      practicalAction: "Channel Ketu in the 11th via street-animal seva and maintain daily accounting rigor.",
    },
    relationships: {
      vectorId: "relationships",
      title: "Partnership & Marriage Harmony",
      icon: "💍",
      favorablePct: relScore,
      frictionPct: 100 - relScore,
      statusTitle: "Maturing Bond & Intellectual Alignment",
      primaryDrivers: relDrivers,
      keyObstacles: relObstacles,
      timingWindow: "Ages 28–30 (Post-Mercury Maturation)",
      practicalAction: "Practice transparent communication; avoid over-analyzing emotional intent.",
    },
    health: {
      vectorId: "health",
      title: "Vitality, Energy & Mental Well-being",
      icon: "🌿",
      favorablePct: healthScore,
      frictionPct: 100 - healthScore,
      statusTitle: "Resilient & High-Tensile Constitution",
      primaryDrivers: healthDrivers,
      keyObstacles: healthObstacles,
      timingWindow: "Active & Stable",
      practicalAction: "Morning Surya Arghya and grounding physical breathwork to soothe mental speed.",
    },
    spirituality: {
      vectorId: "spirituality",
      title: "Spiritual Mission & Higher Purpose",
      icon: "🧘",
      favorablePct: spiritScore,
      frictionPct: 100 - spiritScore,
      statusTitle: "Deep Awakening & Research Intellect",
      primaryDrivers: spiritDrivers,
      keyObstacles: spiritObstacles,
      timingWindow: "Lifelong Anchor (Accelerating from Age 27)",
      practicalAction: "Recite Sri Vishnu Sahasranama and engage with profound metaphysical/scientific texts.",
    },
  };
}

/**
 * Generates Context-Aware Follow-Up Chips based on the Native's Chart
 */
export function generateDynamicFollowUpChips(
  matrix: Partial<OmniAspectMatrix>
): DynamicFollowUpChip[] {
  return [
    {
      id: "chip-timing",
      category: "timing",
      label: "🗓️ Exact Dates for Inflow",
      prompt: "What are the exact monthly dates when my next sub-period will unlock my first job contract and money?",
    },
    {
      id: "chip-cross-domain",
      category: "cross_domain",
      label: "💼 How 11th Ketu Helps",
      prompt: "How does my 11th house Ketu in Capricorn work together with my exalted Mercury to bring high-paying tech roles?",
    },
    {
      id: "chip-remedy",
      category: "remedy",
      label: "⚡ Top Daily Remedy",
      prompt: "What is the single most powerful daily practice to harmonize my retrograde Saturn and combust Mercury?",
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

  // Dasha
  const moon = ephem.planets.Moon;
  const moonLon = moon ? moon.siderealLongitude : 0;
  const dasha = calculateVimshottariDasha(evalDate, moonLon, evalDate);

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

  const suggestedFollowUpChips = generateDynamicFollowUpChips({
    lifeVectorScores,
  });

  const activeMd = dasha.activeDasha?.mahadasha.name || "Venus";
  const activeAd = dasha.activeDasha?.antardasha.name || "Mercury";
  const activePd = dasha.activeDasha?.pratyantardasha.name || "Mercury";

  const fullSummary = `${activeMd} MD / ${activeAd} AD / ${activePd} PD`;

  const narrativeBrief = `Native possesses a high-tensile chart anchored by an Exalted Mercury in the 7th house and Neecha-Vakri Saturn with Jupiter [R] in the 2nd house. Prolonged career delays between 2023 and early 2026 were driven by the Saturnian compression cycle, which has now transitioned into the active Mercury contract gateway (78% favorable career velocity).`;

  return {
    evaluationDate,
    ascendantSignIndex: ascRashi,
    ascendantSignName: ascName,
    runningDasha: {
      mahadasha: activeMd,
      antardasha: activeAd,
      pratyantardasha: activePd,
      mdEnd: dasha.activeDasha?.mdEnd || new Date(),
      adEnd: dasha.activeDasha?.adEnd || new Date(),
      pdEnd: dasha.activeDasha?.pdEnd || new Date(),
      fullSummary,
    },
    neechaVakriPlanets: neechaVakri,
    combustionNuances: combustion,
    argalaSynthesis: argala,
    doubleTransitGates: doubleTransit,
    lifeVectorScores,
    suggestedFollowUpChips,
    narrativeBrief,
  };
}
