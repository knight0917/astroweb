/**
 * Paka Lagna, Annual House Progression (Varsha Chakra), Rahu-Ketu Nuclear Bomb Effect,
 * Trikona Resonance & 9th House Bhagyodaya Engine.
 * 
 * References:
 * - Lecture 1 (bUSAiZ5nniE): Operating Self vs. Core Identity (Paka Lagna),
 *   Kalapurusha 12-sign archetypal blending, Sign dignities & philosophical rationale (Libra Sun/Saturn),
 *   Annual House Progression (Cycles 1-12, 13-24, 25-36...),
 *   The "Nuclear Bomb" Effect (Active house along Rahu-Ketu axis or in square/Kendra from nodes).
 * - Lecture 2 (C3YKcYFLAIs - Session 51): The Four Trikonas (Dharma 1-5-9, Artha 2-6-10, Kama 3-7-11, Moksha 4-8-12),
 *   Timing Awakening of Fortune (Bhagyodaya via 4-pillar 9th house audit),
 *   Planetary Awakening Ages (Graha Udaya) + 12-Year Addition Rule (Base + 12k),
 *   Activation Hierarchy (Resident planets -> Sign & Lord -> Drishti),
 *   Simultaneous Trine Activation (Trikona Resonance) & Karmic Protection (H5 & H9),
 *   Benefic (Shubha) vs. Cruel (Kroora) delivery mode,
 *   Planetary Returns (Solar 1y, Lunar 27.3d, Jupiter 12y, Saturn 30y, Nodal 18.5y).
 */

import { EphemerisResult } from "./types";

// ==========================================
// CONSTANTS & REPOSITORY DATA
// ==========================================

export const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const RASHI_LORDS: Record<number, string> = {
  0: "Mars",
  1: "Venus",
  2: "Mercury",
  3: "Moon",
  4: "Sun",
  5: "Mercury",
  6: "Venus",
  7: "Mars",
  8: "Jupiter",
  9: "Saturn",
  10: "Saturn",
  11: "Jupiter"
};

export const KROORA_GRAHAS = new Set(["Sun", "Mars", "Saturn", "Rahu", "Ketu"]);
export const SHUBHA_GRAHAS = new Set(["Jupiter", "Venus", "Mercury", "Moon"]);

export const KALAPURUSHA_ARCHETYPES: Record<number, {
  domain: string;
  energy: string;
  operatingTrait: string;
  frugalOrDecisiveExample: string;
}> = {
  1: {
    domain: "Head / Individuality / Sovereign Initiation",
    energy: "Agni Tattva (Fire) • Pure initiative and martial momentum",
    operatingTrait: "Acts with bold autonomy, swift execution, and assertive leadership. Does not wait for committee consensus.",
    frugalOrDecisiveExample: "Decisive, action-oriented, and commanding; initiates endeavors without hesitation."
  },
  2: {
    domain: "Face / Throat / Accumulated Assets & Family Values",
    energy: "Prithvi Tattva (Earth) • Conservation, sustenance, and liquid capital",
    operatingTrait: "Operates with prudent financial conservation, protecting legacy resources, and anchoring family welfare.",
    frugalOrDecisiveExample: "Deeply mindful of asset security and liquidity; preserves capital rather than taking reckless gambles."
  },
  3: {
    domain: "Shoulders / Arms / Courage, Media & Enterprise",
    energy: "Vayu Tattva (Air) • Multi-channel marketing, communicative skill, and technical acumen",
    operatingTrait: "Operates via agile networking, versatile skill execution, rapid communication, and contractual initiative.",
    frugalOrDecisiveExample: "Rapid communication and commercial hustle; agile pivoting across digital and verbal channels."
  },
  4: {
    domain: "Chest / Heart / Domestic Sanctuary, Land & Maternal Peace",
    energy: "Jala Tattva (Water) • Emotional grounding, private sanctuary, and vehicular stability",
    operatingTrait: "Operates with maternal care, intuitive emotional boundary protection, and building durable domestic sanctuaries.",
    frugalOrDecisiveExample: "Values inner emotional safety and private comfort; anchors decisions in emotional well-being."
  },
  5: {
    domain: "Upper Abdomen / Solar Plexus / Creative Intellect & Regal Sovereignty",
    energy: "Agni Tattva (Fire) • Purva Punya, sovereign dignity, and speculative intelligence",
    operatingTrait: "Operates with authoritative confidence, creative conviction, philosophical pride, and mentorship flair.",
    frugalOrDecisiveExample: "Commands dignity and creative sovereignty; disdains subservience and acts with regal pride."
  },
  6: {
    domain: "Lower Abdomen / Intestines / Problem Solving, Debts, Analysis & Service",
    energy: "Prithvi Tattva (Earth) • Tactical remediation, conflict management, and precision detail",
    operatingTrait: "Operates through rigorous analytical scrutiny, debt elimination, conflict mitigation, and relentless service.",
    frugalOrDecisiveExample: "Meticulous problem solver; audits every microscopic discrepancy before sanctioning action."
  },
  7: {
    domain: "Pelvis / Lumbar / Relational Diplomacy & Contractual Balance",
    energy: "Vayu Tattva (Air) • Mutual negotiation, commercial trade, and social consensus",
    operatingTrait: "Operates through consensus building, diplomatic fairness, tactical trade-offs, and reciprocal partnerships.",
    frugalOrDecisiveExample: "Relational harmony requires dropping individual ego; seeks win-win compromises."
  },
  8: {
    domain: "Genitals / Secretion / Rebirth, Occult Depth & Sudden Transformation",
    energy: "Jala Tattva (Water) • Subterranean depth, crisis remediation, and unrevealed power",
    operatingTrait: "Operates with intense secrecy, profound psychological vigilance, crisis-readiness, and regenerative stamina.",
    frugalOrDecisiveExample: "Guards strategic moves behind veiled silence; operates calmly under severe crisis."
  },
  9: {
    domain: "Thighs / Higher Wisdom / Dharma, Ethics, Gurus & Divine Law",
    energy: "Agni Tattva (Fire) • Philosophical conviction, righteous guidance, and expansive vision",
    operatingTrait: "Operates by moral principles, ethical adherence, higher philosophical education, and reverence for mentors.",
    frugalOrDecisiveExample: "Anchored in righteous principle; expands enterprises through ethical alignment and higher truth."
  },
  10: {
    domain: "Knees / Skeletal Joints / Institutional Career & Executive Governance",
    energy: "Prithvi Tattva (Earth) • Concrete institutional status, organizational discipline, and public duty",
    operatingTrait: "Operates through tireless organizational perseverance, structural hierarchy, executive accountability, and long-term duty.",
    frugalOrDecisiveExample: "Professional tenacity; prioritizes hard institutional results and public credibility."
  },
  11: {
    domain: "Shins / Calves / Community Networks, Large Gains & Future Vision",
    energy: "Vayu Tattva (Air) • Collective aspirations, community scaling, and non-linear profits",
    operatingTrait: "Operates through large-scale collective syndicates, technological leverage, network monetization, and visionary friendships.",
    frugalOrDecisiveExample: "Scales through community leverage and strategic distribution networks."
  },
  12: {
    domain: "Feet / Subconscious / Renunciation, Frugality, Foreign Spheres & Spiritual Surrender",
    energy: "Jala Tattva (Water) • Expenditure, foreign isolation, ego dissolution, and transcendental retreat",
    operatingTrait: "Operates with detachment, deep inward retreat, hesitation in personal spending, foreign connections, and spiritual surrender.",
    frugalOrDecisiveExample: "LECTURE CLASSIC: Operates with extreme frugality at workplace, hesitant to spend money, mindful of losses and expenditure."
  }
};

export const GRAHA_UDAYA_BASE_RULES: {
  planet: string;
  baseAge: number;
  signification: string;
  lifeDomain: string;
}[] = [
  {
    planet: "Jupiter",
    baseAge: 16,
    signification: "Guru Udaya • Wisdom, ethical conscience, higher mentorship, divine fortune",
    lifeDomain: "Spiritual initiation, academic breakthrough, mentor guidance, and philosophical clarity"
  },
  {
    planet: "Sun",
    baseAge: 22,
    signification: "Surya Udaya • Sovereign individuation, recognition, vocational confidence",
    lifeDomain: "Clear crystallization of self-worth, paternal separation, authority, and public respect"
  },
  {
    planet: "Moon",
    baseAge: 24,
    signification: "Chandra Udaya • Mental stabilization, emotional maturity, public appeal",
    lifeDomain: "Domestic harmony, psychological calm, public responsiveness, and maternal bonding"
  },
  {
    planet: "Venus",
    baseAge: 26,
    signification: "Shukra Udaya • Aesthetic luxury, romantic alliances, marriage, comforts",
    lifeDomain: "Refinement of lifestyle, partnership fruition, creative arts, and sensory fulfillment"
  },
  {
    planet: "Mars",
    baseAge: 28,
    signification: "Mangal Udaya • Executive courage, property acquisition, physical drive",
    lifeDomain: "Real estate investment, competitive conquest, independent courage, and fearless enterprise"
  },
  {
    planet: "Mercury",
    baseAge: 32,
    signification: "Budha Udaya • Commercial acumen, trade stability, intellectual synthesis",
    lifeDomain: "Business expansion, diversified income streams, media/contract mastery, and sharp negotiation"
  },
  {
    planet: "Saturn",
    baseAge: 36,
    signification: "Shani Udaya • Structural consolidation, endurance crystallization, delayed fortune",
    lifeDomain: "Enduring life foundation, institutional appointment, long-term mastery; causes delayed fortune if ruling/occupying 9th"
  },
  {
    planet: "Rahu",
    baseAge: 42,
    signification: "Rahu Udaya • Unconventional expansion, foreign breakthroughs, worldly ambition",
    lifeDomain: "Cross-border influence, breakthrough technology adoption, high public fame, and out-of-the-box leaps"
  },
  {
    planet: "Ketu",
    baseAge: 48,
    signification: "Ketu Udaya • Spiritual liberation, inward detachment, deep occult mastery",
    lifeDomain: "Karmic debt settlement, mystical insight, spiritual detachment from vanity, and higher illumination"
  }
];

// ==========================================
// INTERFACES
// ==========================================

export interface PakaLagnaProfile {
  lagnaHouse: number; // 1
  lagnaRashiIndex: number;
  lagnaRashiName: string;
  lagnesha: string;
  pakaLagnaHouse: number; // 1 to 12
  pakaLagnaRashiIndex: number;
  pakaLagnaRashiName: string;
  pakaLagnaDignity: string;
  kalapurushaHouseNumber: number; // 1 to 12 based on pakaLagnaRashiIndex + 1
  kalapurushaSignification: string;
  operatingSelfBehavior: string;
  coreIdentityVsOperatingSummary: string;
  dignityPhilosophicalRationale: string;
}

export interface AspectingGraha {
  planet: string;
  aspectType: string;
  isKroora: boolean;
}

export interface AnnualHouseProgression {
  lifeYear: number; // N-th year of life (e.g. 27th year)
  completedAge: number; // e.g. 26
  activeHouse: number; // 1 to 12
  cycleNumber: number; // 1 to 7+
  rashiIndex: number;
  rashiName: string;
  houseLord: string;
  lordHouse: number;
  lordDignity: string;
  residentPlanets: string[];
  incomingAspectingPlanets: AspectingGraha[];
  deliveryMode: "Benefic (Shubha)" | "Cruel / Forceful (Kroora)" | "Mixed Dynamic";
  deliveryExplanation: string;
  kalapurushaHouseNumber: number;
  kalapurushaSignification: string;
  practicalManifestationGuidance: string;
}

export interface NuclearBombAlert {
  isNuclearBombYear: boolean;
  triggerType: "Direct Nodal Axis (1st/7th)" | "Square to Nodal Axis (4th/10th / Kendra)" | "None";
  rahuHouse: number;
  ketuHouse: number;
  warningTitle: string;
  warningDescription: string;
  karmicActionAdvice: string;
}

export interface TrikonaResonanceResult {
  trikonaCategory: "Dharma Trikona (Duty & Soul Grace)" | "Artha Trikona (Wealth & Sustenance)" | "Kama Trikona (Desire & Alliances)" | "Moksha Trikona (Detachment & Transformation)";
  trikonaHouses: [number, number, number];
  activeTrineHousesDescription: string;
  karmicProtectionLevel: "Supreme Auspicious Armor (H5/H9 Active)" | "Standard Trikona Support";
  protectionExplanation: string;
}

export interface BhagyodayaResult {
  ninthHouseSignIndex: number;
  ninthHouseSignName: string;
  ninthHouseLord: string;
  ninthLordHouse: number;
  ninthLordDignity: string;
  residentPlanetsIn9th: string[];
  aspectingPlanetsOn9th: { planet: string; aspectType: string; isKroora: boolean }[];
  isSaturnDelayingFortune: boolean;
  primaryBhagyodayaAge: number;
  secondaryBhagyodayaAges: number[];
  synthesisSummary: string;
}

export interface GrahaUdayaMilestone {
  planet: string;
  baseAwakeningAge: number;
  recurringCycles: number[];
  signification: string;
  lifeDomain: string;
  isCurrentlyActiveWave: boolean;
  closestCycleAge: number;
}

export interface PlanetaryReturnsReport {
  solarReturnCurrentYear: number;
  lunarReturnCycleDays: number;
  jupiterReturnAges: number[];
  isJupiterReturnActive: boolean;
  saturnReturnAges: number[];
  isSaturnReturnActive: boolean;
  nodalReturnAges: number[];
  isNodalReturnActive: boolean;
  activeReturnDescriptions: string[];
}

export interface AnnualActivationMasterReport {
  currentLifeYear: number;
  completedAge: number;
  pakaLagna: PakaLagnaProfile;
  annualProgression: AnnualHouseProgression;
  nuclearBomb: NuclearBombAlert;
  trikonaResonance: TrikonaResonanceResult;
  bhagyodaya: BhagyodayaResult;
  grahaUdaya: GrahaUdayaMilestone[];
  activeGrahaUdayaWaves: GrahaUdayaMilestone[];
  planetaryReturns: PlanetaryReturnsReport;
  masterExecutiveSummary: string;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function calculateExactAgeYears(birthDate: Date, targetDate: Date = new Date()): number {
  let age = targetDate.getFullYear() - birthDate.getFullYear();
  const m = targetDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && targetDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

export function getPlanetaryDignity(planetName: string, rashiIdx: number): string {
  const normPlanet = planetName.trim();
  const rIdx = ((rashiIdx % 12) + 12) % 12;

  switch (normPlanet) {
    case "Sun":
      if (rIdx === 0) return "Exalted (Ucha)";
      if (rIdx === 6) return "Debilitated (Neecha)";
      if (rIdx === 4) return "Own Sign (Swakshetra)";
      return [8, 7, 3].includes(rIdx) ? "Friendly Sign" : "Neutral/Enemy Sign";
    case "Moon":
      if (rIdx === 1) return "Exalted (Ucha)";
      if (rIdx === 7) return "Debilitated (Neecha)";
      if (rIdx === 3) return "Own Sign (Swakshetra)";
      return [0, 4, 2].includes(rIdx) ? "Friendly Sign" : "Neutral/Enemy Sign";
    case "Mars":
      if (rIdx === 9) return "Exalted (Ucha)";
      if (rIdx === 3) return "Debilitated (Neecha)";
      if (rIdx === 0 || rIdx === 7) return "Own Sign (Swakshetra)";
      return [4, 8, 11].includes(rIdx) ? "Friendly Sign" : "Neutral/Enemy Sign";
    case "Mercury":
      if (rIdx === 5) return "Exalted (Ucha)";
      if (rIdx === 11) return "Debilitated (Neecha)";
      if (rIdx === 2 || rIdx === 5) return "Own Sign (Swakshetra)";
      return [0, 6, 1].includes(rIdx) ? "Friendly Sign" : "Neutral/Enemy Sign";
    case "Jupiter":
      if (rIdx === 3) return "Exalted (Ucha)";
      if (rIdx === 9) return "Debilitated (Neecha)";
      if (rIdx === 8 || rIdx === 11) return "Own Sign (Swakshetra)";
      return [0, 4, 7].includes(rIdx) ? "Friendly Sign" : "Neutral/Enemy Sign";
    case "Venus":
      if (rIdx === 11) return "Exalted (Ucha)";
      if (rIdx === 5) return "Debilitated (Neecha)";
      if (rIdx === 1 || rIdx === 6) return "Own Sign (Swakshetra)";
      return [2, 9, 10].includes(rIdx) ? "Friendly Sign" : "Neutral/Enemy Sign";
    case "Saturn":
      if (rIdx === 6) return "Exalted (Ucha)";
      if (rIdx === 0) return "Debilitated (Neecha)";
      if (rIdx === 9 || rIdx === 10) return "Own Sign (Swakshetra)";
      return [1, 2, 5].includes(rIdx) ? "Friendly Sign" : "Neutral/Enemy Sign";
    case "Rahu":
      if (rIdx === 1 || rIdx === 2) return "Exalted (Ucha)";
      if (rIdx === 7 || rIdx === 8) return "Debilitated (Neecha)";
      if (rIdx === 10) return "Co-Lord (Aquarius)";
      return "Neutral";
    case "Ketu":
      if (rIdx === 7 || rIdx === 8) return "Exalted (Ucha)";
      if (rIdx === 1 || rIdx === 2) return "Debilitated (Neecha)";
      if (rIdx === 7) return "Co-Lord (Scorpio)";
      return "Neutral";
    default:
      return "Neutral";
  }
}

/**
 * Calculates incoming Drishti (aspects) on a target house from classical 9 planets.
 */
export function getAspectsOnHouse(
  targetHouse: number,
  planets: Record<string, { house: number; name: string }>
): AspectingGraha[] {
  const aspects: AspectingGraha[] = [];
  const CLASSICAL_NINE = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  for (const pName of CLASSICAL_NINE) {
    const pObj = planets[pName];
    if (!pObj) continue;
    const pHouse = pObj.house;
    if (pHouse === targetHouse) continue; // Resident, not aspecting

    const dist = ((targetHouse - pHouse + 12) % 12) || 12; // 1 to 12

    // All planets cast 7th house aspect
    if (dist === 7) {
      aspects.push({
        planet: pName,
        aspectType: "7th Full Drishti (Saptama Drishti)",
        isKroora: KROORA_GRAHAS.has(pName)
      });
    }

    // Mars special aspects: 4th and 8th
    if (pName === "Mars" && (dist === 4 || dist === 8)) {
      aspects.push({
        planet: pName,
        aspectType: `${dist}th Special Mars Drishti (Chaturtha/Ashtama)`,
        isKroora: true
      });
    }

    // Jupiter special aspects: 5th and 9th
    if (pName === "Jupiter" && (dist === 5 || dist === 9)) {
      aspects.push({
        planet: pName,
        aspectType: `${dist}th Special Guru Trikona Drishti (Panchama/Navama)`,
        isKroora: false
      });
    }

    // Saturn special aspects: 3rd and 10th
    if (pName === "Saturn" && (dist === 3 || dist === 10)) {
      aspects.push({
        planet: pName,
        aspectType: `${dist}th Special Shani Drishti (Tritiya/Dashama)`,
        isKroora: true
      });
    }

    // Rahu / Ketu trinal aspects (5th & 9th)
    if ((pName === "Rahu" || pName === "Ketu") && (dist === 5 || dist === 9)) {
      aspects.push({
        planet: pName,
        aspectType: `${dist}th Nodal Trine Influence`,
        isKroora: true
      });
    }
  }

  return aspects;
}

// ==========================================
// 1. PAKA LAGNA ENGINE
// ==========================================

export function calculatePakaLagnaProfile(ephemeris: EphemerisResult): PakaLagnaProfile {
  const lagnaRashiIndex = ephemeris.ascendant.rashi.index;
  const lagnaRashiName = RASHI_NAMES[lagnaRashiIndex];
  const lagnesha = RASHI_LORDS[lagnaRashiIndex] || "Mars";

  const lordObj = ephemeris.planets[lagnesha];
  const pakaLagnaHouse = lordObj ? lordObj.house : 1;
  const pakaLagnaRashiIndex = lordObj ? lordObj.rashi.index : lagnaRashiIndex;
  const pakaLagnaRashiName = RASHI_NAMES[pakaLagnaRashiIndex];
  const pakaLagnaDignity = getPlanetaryDignity(lagnesha, pakaLagnaRashiIndex);

  // Kalapurusha scheme maps sign index to natural house: Aries=1, Taurus=2... Pisces=12
  const kalapurushaHouseNumber = pakaLagnaRashiIndex + 1;
  const kalapurushaData = KALAPURUSHA_ARCHETYPES[kalapurushaHouseNumber];

  let dignityPhilosophicalRationale = "";
  if (pakaLagnaRashiIndex === 6) { // Libra
    dignityPhilosophicalRationale =
      "LIBRA METAPHYSICS (Deepanshu Giri Rule): In Kalapurusha 7th house (Libra), Sun is debilitated because relational harmony demands dropping the individual ego/Atma-ahamkara. Conversely, Saturn is exalted here because sustaining enduring partnerships requires discipline, delay, sacrifice, and long-term endurance.";
  } else if (pakaLagnaRashiIndex === 0) { // Aries
    dignityPhilosophicalRationale =
      "ARIES METAPHYSICS: In Kalapurusha 1st house (Aries), Sun is exalted because sovereign initiation demands pure self-confidence, while Saturn is debilitated because martial breakthroughs cannot tolerate hesitation or delay.";
  } else if (pakaLagnaRashiIndex === 11) { // Pisces
    dignityPhilosophicalRationale =
      "PISCES METAPHYSICS: In Kalapurusha 12th house (Pisces), Venus is exalted because supreme love is unconditional spiritual surrender, whereas Mercury is debilitated because analytical calculations inhibit transcendent faith.";
  } else if (pakaLagnaRashiIndex === 5) { // Virgo
    dignityPhilosophicalRationale =
      "VIRGO METAPHYSICS: In Kalapurusha 6th house (Virgo), Mercury is exalted because precision accounting, auditing, and problem-solving remediate debt and conflict, while Venus is debilitated because hedonism undermines rigorous duty.";
  } else {
    dignityPhilosophicalRationale = `Natural Kalapurusha House ${kalapurushaHouseNumber} governs ${kalapurushaData.domain}. Operating efficiency depends on whether the native's actions harmonize with ${kalapurushaData.energy}.`;
  }

  const operatingSelfBehavior = `The native operates their everyday life and professional decisions through the archetypal lens of House ${pakaLagnaHouse} and Kalapurusha House ${kalapurushaHouseNumber} (${pakaLagnaRashiName}). ${kalapurushaData.operatingTrait} ${kalapurushaData.frugalOrDecisiveExample}`;

  const coreIdentityVsOperatingSummary = `Core Identity (Lagna H1) is anchored in ${lagnaRashiName} (Innate Nature). Operating Execution (Paka Lagna) is conducted in House ${pakaLagnaHouse} in ${pakaLagnaRashiName} with ${pakaLagnaDignity} dignity (How Life is Actively Carried Out).`;

  return {
    lagnaHouse: 1,
    lagnaRashiIndex,
    lagnaRashiName,
    lagnesha,
    pakaLagnaHouse,
    pakaLagnaRashiIndex,
    pakaLagnaRashiName,
    pakaLagnaDignity,
    kalapurushaHouseNumber,
    kalapurushaSignification: kalapurushaData.domain,
    operatingSelfBehavior,
    coreIdentityVsOperatingSummary,
    dignityPhilosophicalRationale
  };
}

// ==========================================
// 2. ANNUAL HOUSE PROGRESSION (VARSHA CHAKRA)
// ==========================================

export function calculateAnnualHouseProgression(
  ephemeris: EphemerisResult,
  birthDate: Date,
  targetDateOrAge?: Date | number
): AnnualHouseProgression {
  let completedAge: number;
  let lifeYear: number;

  if (typeof targetDateOrAge === "number") {
    // If integer age passed, determine life year
    completedAge = Math.max(0, Math.floor(targetDateOrAge));
    lifeYear = completedAge + 1;
  } else {
    const target = targetDateOrAge || new Date();
    completedAge = calculateExactAgeYears(birthDate, target);
    lifeYear = completedAge + 1;
  }

  // Lecture formula: Sequential progression 1 to 12 across 12-year cycles
  // Year 1 -> H1, Year 12 -> H12, Year 13 -> H1, Year 24 -> H12, Year 25 -> H1, Year 27 -> H3, Year 34 -> H10
  const activeHouse = ((lifeYear - 1) % 12) + 1;
  const cycleNumber = Math.floor((lifeYear - 1) / 12) + 1;

  // Find sign in this house
  const ascRashiIdx = ephemeris.ascendant.rashi.index;
  const rashiIndex = (ascRashiIdx + (activeHouse - 1)) % 12;
  const rashiName = RASHI_NAMES[rashiIndex];
  const houseLord = RASHI_LORDS[rashiIndex] || "Mars";

  const lordObj = ephemeris.planets[houseLord];
  const lordHouse = lordObj ? lordObj.house : activeHouse;
  const lordRashiIdx = lordObj ? lordObj.rashi.index : rashiIndex;
  const lordDignity = getPlanetaryDignity(houseLord, lordRashiIdx);

  // Resident planets
  const residentPlanets: string[] = [];
  const CLASSICAL_NINE = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  for (const pName of CLASSICAL_NINE) {
    const p = ephemeris.planets[pName];
    if (p && p.house === activeHouse) {
      residentPlanets.push(pName);
    }
  }

  // Aspecting planets
  const incomingAspectingPlanets = getAspectsOnHouse(activeHouse, ephemeris.planets);

  // Delivery mode determination:
  // Hierarchy: 1. Resident Planets -> 2. Lord's nature/dignity -> 3. Aspects
  const krooraResidents = residentPlanets.filter((p) => KROORA_GRAHAS.has(p));
  const shubhaResidents = residentPlanets.filter((p) => SHUBHA_GRAHAS.has(p));
  const krooraAspects = incomingAspectingPlanets.filter((a) => a.isKroora);
  const shubhaAspects = incomingAspectingPlanets.filter((a) => !a.isKroora);

  let deliveryMode: "Benefic (Shubha)" | "Cruel / Forceful (Kroora)" | "Mixed Dynamic" = "Benefic (Shubha)";
  let deliveryExplanation = "";

  if (krooraResidents.length > 0) {
    deliveryMode = "Cruel / Forceful (Kroora)";
    deliveryExplanation = `Active House ${activeHouse} is directly occupied by Kroora Graha(s): ${krooraResidents.join(", ")}. Results will be delivered intensely, aggressively, through pressure, high discipline, or structural friction. Per Session 51, Kroora planets are not evil; they catalyze breakthroughs through relentless force.`;
  } else if (shubhaResidents.length > 0) {
    deliveryMode = "Benefic (Shubha)";
    deliveryExplanation = `Active House ${activeHouse} is blessed by resident Shubha Graha(s): ${shubhaResidents.join(", ")}. Results manifest harmoniously, smoothly, with institutional support, social ease, and pleasant milestones.`;
  } else if (KROORA_GRAHAS.has(houseLord) && krooraAspects.length > shubhaAspects.length) {
    deliveryMode = "Cruel / Forceful (Kroora)";
    deliveryExplanation = `House ${activeHouse} is ruled by Kroora Lord ${houseLord} (${lordDignity} in H${lordHouse}) and receives forceful aspectual rays from ${krooraAspects.map((a) => a.planet).join(", ")}. Requires perseverance and rigorous toil.`;
  } else if (SHUBHA_GRAHAS.has(houseLord) && shubhaAspects.length >= krooraAspects.length) {
    deliveryMode = "Benefic (Shubha)";
    deliveryExplanation = `House ${activeHouse} is ruled by Shubha Lord ${houseLord} (${lordDignity} in H${lordHouse}) and supported by gracious aspects (${shubhaAspects.map((a) => a.planet).join(", ") || "Benevolent disposition"}). Auspicious outcomes flourish smoothly.`;
  } else {
    deliveryMode = "Mixed Dynamic";
    deliveryExplanation = `House ${activeHouse} experiences mixed planetary currents (Lord ${houseLord} in ${lordDignity}, aspects from both benefics and cruel planets). Requires tactical balance between assertive drive and diplomatic patience.`;
  }

  const kalapurushaData = KALAPURUSHA_ARCHETYPES[activeHouse];
  const primarySignifications = `House ${activeHouse} (${rashiName}): ${kalapurushaData.domain}. Focuses life spotlight on ${kalapurushaData.operatingTrait}`;
  const practicalManifestationGuidance = `During your ${lifeYear}th Year of life (Cycle ${cycleNumber}, Age ${completedAge}), House ${activeHouse} is activated. ${deliveryExplanation}`;

  return {
    lifeYear,
    completedAge,
    activeHouse,
    cycleNumber,
    rashiIndex,
    rashiName,
    houseLord,
    lordHouse,
    lordDignity,
    residentPlanets,
    incomingAspectingPlanets,
    deliveryMode,
    deliveryExplanation,
    kalapurushaHouseNumber: activeHouse,
    kalapurushaSignification: kalapurushaData.domain,
    practicalManifestationGuidance
  };
}

// ==========================================
// 3. "NUCLEAR BOMB" EFFECT DETECTOR
// ==========================================

export function detectRahuKetuNuclearBombEffect(
  activeHouse: number,
  ephemeris: EphemerisResult
): NuclearBombAlert {
  const rahu = ephemeris.planets["Rahu"];
  const ketu = ephemeris.planets["Ketu"];

  const rahuHouse = rahu ? rahu.house : 11;
  const ketuHouse = ketu ? ketu.house : 5;

  // Axis houses: house of Rahu and house of Ketu
  const isDirectAxis = activeHouse === rahuHouse || activeHouse === ketuHouse;

  // Square houses (Kendra / 4th or 10th from Rahu/Ketu):
  // Since nodes are opposite (7 houses apart), 4th from Rahu is (rahuHouse + 3)%12, 10th from Rahu is (rahuHouse + 9)%12
  const squareHouse1 = ((rahuHouse + 3 - 1) % 12) + 1;
  const squareHouse2 = ((rahuHouse + 9 - 1) % 12) + 1;
  const isSquare = activeHouse === squareHouse1 || activeHouse === squareHouse2;

  if (isDirectAxis) {
    return {
      isNuclearBombYear: true,
      triggerType: "Direct Nodal Axis (1st/7th)",
      rahuHouse,
      ketuHouse,
      warningTitle: "🚨 THE NUCLEAR BOMB EFFECT: DIRECT NODAL AXIS ACTIVATED",
      warningDescription: `Active House ${activeHouse} coincides directly with the natal Rahu-Ketu axis (Rahu in H${rahuHouse}, Ketu in H${ketuHouse}). Per Deepanshu Giri, this year acts as an explosive karmic inflection point—dismantling obsolete comfort zones, triggering unforeseen opportunities or upheavals, and executing non-negotiable destiny resets.`,
      karmicActionAdvice: "Do not cling to rigid historical structures. Emphasize ethical boundaries, avoid speculative gambles under illusion, and accept rapid karmic shifts as divine realignment."
    };
  }

  if (isSquare) {
    return {
      isNuclearBombYear: true,
      triggerType: "Square to Nodal Axis (4th/10th / Kendra)",
      rahuHouse,
      ketuHouse,
      warningTitle: "💥 THE NUCLEAR BOMB EFFECT: SQUARE TO RAHU-KETU ACTIVATED",
      warningDescription: `Active House ${activeHouse} sits at a 90° square aspect (Kendra/4th-10th) to the natal Rahu-Ketu axis (Rahu in H${rahuHouse}, Ketu in H${ketuHouse}). Per the lecture, square years to the nodes generate acute systemic friction, forcing life-altering career or relationship decisions through high-pressure crucibles.`,
      karmicActionAdvice: "Channel high pressure into disciplined, methodical restructuring. Expect sudden institutional demands; maintain integrity and avoid impulsive exits."
    };
  }

  return {
    isNuclearBombYear: false,
    triggerType: "None",
    rahuHouse,
    ketuHouse,
    warningTitle: "Stable Nodal Geometry",
    warningDescription: `Active House ${activeHouse} operates outside the acute Rahu-Ketu nodal squares. Energetic flow proceeds along standard Parashari progressions without sudden nodal disruptions.`,
    karmicActionAdvice: "Pursue steady progressive expansion along your active house's natural significations."
  };
}

// ==========================================
// 4. THE FOUR TRIKONAS & TRIKONA RESONANCE
// ==========================================

export function calculateTrikonaResonance(
  activeHouse: number,
  ephemeris: EphemerisResult
): TrikonaResonanceResult {
  // Dharma Trikona: 1, 5, 9
  // Artha Trikona: 2, 6, 10
  // Kama Trikona: 3, 7, 11
  // Moksha Trikona: 4, 8, 12

  if ([1, 5, 9].includes(activeHouse)) {
    return {
      trikonaCategory: "Dharma Trikona (Duty & Soul Grace)",
      trikonaHouses: [1, 5, 9],
      activeTrineHousesDescription:
        "Activating House " + activeHouse + " simultaneously energizes Houses 1, 5, and 9. Soul duty, ethical purpose, intellect, and divine past-life grace (Purva Punya) are fully resonant.",
      karmicProtectionLevel: "Supreme Auspicious Armor (H5/H9 Active)",
      protectionExplanation:
        "LECTURE PRINCIPLE (Session 51): Houses 5 and 9 consistently provide auspicious fruit and divine protection. Even seemingly difficult lessons during this year serve as lifelong course-corrections and shielding armor."
    };
  }

  if ([2, 6, 10].includes(activeHouse)) {
    return {
      trikonaCategory: "Artha Trikona (Wealth & Sustenance)",
      trikonaHouses: [2, 6, 10],
      activeTrineHousesDescription:
        "Activating House " + activeHouse + " simultaneously energizes Houses 2, 6, and 10. Wealth accumulation, daily problem-solving/toil, and institutional career governance resonate as an interconnected circuit.",
      karmicProtectionLevel: "Standard Trikona Support",
      protectionExplanation:
        "Financial growth (H2), daily operational rigor (H6), and professional standing (H10) cross-fertilize. Hard work directly unlocks liquidity and status."
    };
  }

  if ([3, 7, 11].includes(activeHouse)) {
    return {
      trikonaCategory: "Kama Trikona (Desire & Alliances)",
      trikonaHouses: [3, 7, 11],
      activeTrineHousesDescription:
        "Activating House " + activeHouse + " simultaneously energizes Houses 3, 7, and 11. Entrepreneurial courage, contractual partnerships/marriage, and large aspirational gains/networks ignite concurrently.",
      karmicProtectionLevel: "Standard Trikona Support",
      protectionExplanation:
        "Contractual alliances (H7) and personal enterprise (H3) directly feed massive aspirational revenues (H11)."
    };
  }

  // Default: Moksha Trikona (4, 8, 12)
  return {
    trikonaCategory: "Moksha Trikona (Detachment & Transformation)",
    trikonaHouses: [4, 8, 12],
    activeTrineHousesDescription:
      "Activating House " + activeHouse + " simultaneously energizes Houses 4, 8, and 12. Emotional sanctuary, psychological transformation, and spiritual detachment/foreign ventures operate in deep unison.",
    karmicProtectionLevel: "Standard Trikona Support",
    protectionExplanation:
      "Inner emotional peace (H4) and subterranean transformation (H8) guide the soul toward liberation, spiritual charity, and foreign release (H12)."
  };
}

// ==========================================
// 5. 9TH HOUSE BHAGYODAYA TIMING ENGINE
// ==========================================

export function calculateBhagyodayaTiming(ephemeris: EphemerisResult): BhagyodayaResult {
  const ascRashiIdx = ephemeris.ascendant.rashi.index;
  const ninthHouseSignIndex = (ascRashiIdx + 8) % 12;
  const ninthHouseSignName = RASHI_NAMES[ninthHouseSignIndex];
  const ninthHouseLord = RASHI_LORDS[ninthHouseSignIndex] || "Jupiter";

  const lordObj = ephemeris.planets[ninthHouseLord];
  const ninthLordHouse = lordObj ? lordObj.house : 9;
  const ninthLordRashiIdx = lordObj ? lordObj.rashi.index : ninthHouseSignIndex;
  const ninthLordDignity = getPlanetaryDignity(ninthHouseLord, ninthLordRashiIdx);

  // Resident planets in 9th
  const residentPlanetsIn9th: string[] = [];
  const CLASSICAL_NINE = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  for (const pName of CLASSICAL_NINE) {
    const p = ephemeris.planets[pName];
    if (p && p.house === 9) {
      residentPlanetsIn9th.push(pName);
    }
  }

  // Aspecting planets on 9th
  const aspectingPlanetsOn9th = getAspectsOnHouse(9, ephemeris.planets);

  // Saturn delay check: Saturn in 9th, rules 9th, or casts aspect on 9th
  const isSaturnIn9th = residentPlanetsIn9th.includes("Saturn");
  const isSaturnRuler = ninthHouseLord === "Saturn";
  const isSaturnAspecting = aspectingPlanetsOn9th.some((a) => a.planet === "Saturn");
  const isSaturnDelayingFortune = isSaturnIn9th || isSaturnRuler || isSaturnAspecting;

  // Determine Primary Bhagyodaya Age based on 4-pillar priority:
  // 1. Resident Planet base age
  // 2. 9th Lord base age
  // 3. Sign ruler base age
  let primaryAge = 28; // Default Mars/general baseline

  if (residentPlanetsIn9th.length > 0) {
    const firstResident = residentPlanetsIn9th[0];
    const rule = GRAHA_UDAYA_BASE_RULES.find((r) => r.planet === firstResident);
    if (rule) primaryAge = rule.baseAge;
  } else {
    const lordRule = GRAHA_UDAYA_BASE_RULES.find((r) => r.planet === ninthHouseLord);
    if (lordRule) primaryAge = lordRule.baseAge;
  }

  // If Saturn delays, fortune cannot fully crystallize prior to age 36
  if (isSaturnDelayingFortune && primaryAge < 36) {
    primaryAge = 36;
  }

  // Secondary Bhagyodaya recurring waves (+12-year addition rule)
  const secondaryBhagyodayaAges: number[] = [
    primaryAge,
    primaryAge + 12,
    primaryAge + 24,
    primaryAge + 36
  ].filter((a) => a <= 84);

  let synthesisSummary = `Bhagyodaya (Fortune Awakening) is governed by 9th House in ${ninthHouseSignName} (Lord ${ninthHouseLord} in H${ninthLordHouse}, ${ninthLordDignity}). `;
  if (isSaturnDelayingFortune) {
    synthesisSummary += `Due to Saturn's direct involvement with the 9th house (${isSaturnIn9th ? "occupying H9" : isSaturnRuler ? "ruling H9" : "casting severe Drishti on H9"}), early fortune is tempered by rigorous testing and maturity. Primary Bhagyodaya matures at Age 36, followed by sovereign expansion waves at ${secondaryBhagyodayaAges.slice(1).join(", ")}.`;
  } else {
    synthesisSummary += `Primary Bhagyodaya unlocks at Age ${primaryAge} (${residentPlanetsIn9th.length > 0 ? residentPlanetsIn9th[0] : ninthHouseLord} activation wave), with recurring fortune crests at ages ${secondaryBhagyodayaAges.join(", ")}.`;
  }

  return {
    ninthHouseSignIndex,
    ninthHouseSignName,
    ninthHouseLord,
    ninthLordHouse,
    ninthLordDignity,
    residentPlanetsIn9th,
    aspectingPlanetsOn9th,
    isSaturnDelayingFortune,
    primaryBhagyodayaAge: primaryAge,
    secondaryBhagyodayaAges,
    synthesisSummary
  };
}

// ==========================================
// 6. PLANETARY AWAKENING AGES (12-YEAR RULE)
// ==========================================

export function calculateGrahaUdayaTimeline(
  ephemeris: EphemerisResult,
  targetAge: number = 30
): {
  allMilestones: GrahaUdayaMilestone[];
  activeMilestones: GrahaUdayaMilestone[];
} {
  const currentLifeYear = targetAge + 1; // e.g. 26 completed -> 27th year

  const allMilestones: GrahaUdayaMilestone[] = GRAHA_UDAYA_BASE_RULES.map((rule) => {
    // Generate recurring waves up to age 90 via +12 addition rule
    const recurringCycles: number[] = [];
    for (let age = rule.baseAge; age <= 90; age += 12) {
      recurringCycles.push(age);
    }

    // Active wave check: If current targetAge matches base or any recurring cycle
    const isCurrentlyActiveWave = recurringCycles.includes(targetAge) || recurringCycles.includes(currentLifeYear);

    // Closest cycle
    let closestCycleAge = rule.baseAge;
    let minDiff = Infinity;
    for (const cycleAge of recurringCycles) {
      const diff = Math.abs(cycleAge - targetAge);
      if (diff < minDiff) {
        minDiff = diff;
        closestCycleAge = cycleAge;
      }
    }

    return {
      planet: rule.planet,
      baseAwakeningAge: rule.baseAge,
      recurringCycles,
      signification: rule.signification,
      lifeDomain: rule.lifeDomain,
      isCurrentlyActiveWave,
      closestCycleAge
    };
  });

  const activeMilestones = allMilestones.filter((m) => m.isCurrentlyActiveWave);

  return {
    allMilestones,
    activeMilestones
  };
}

// ==========================================
// 7. PLANETARY RETURNS
// ==========================================

export function calculatePlanetaryReturns(
  birthDate: Date,
  ephemeris: EphemerisResult,
  targetDate: Date = new Date()
): PlanetaryReturnsReport {
  const completedAge = calculateExactAgeYears(birthDate, targetDate);

  const solarReturnCurrentYear = completedAge + 1;
  const lunarReturnCycleDays = 27.3216;

  const jupiterReturnAges = [12, 24, 36, 48, 60, 72, 84];
  const saturnReturnAges = [30, 60, 90];
  const nodalReturnAges = [18.5, 37, 55.5, 74];

  const isJupiterReturnActive = jupiterReturnAges.some((a) => Math.abs(completedAge - a) <= 1);
  const isSaturnReturnActive = saturnReturnAges.some((a) => Math.abs(completedAge - a) <= 1);
  const isNodalReturnActive = nodalReturnAges.some((a) => Math.abs(completedAge - a) <= 1);

  const activeReturnDescriptions: string[] = [];

  activeReturnDescriptions.push(`Solar Return (Varshaphala): Operates continuously at every birthday (currently in Solar Cycle ${solarReturnCurrentYear}).`);
  activeReturnDescriptions.push(`Lunar Return: Moon recycles over natal longitude every ~27.3 days, marking monthly emotional renewal.`);

  if (isJupiterReturnActive) {
    activeReturnDescriptions.push(`⭐ JUPITER RETURN ACTIVE: Transiting Jupiter returns to its natal sign (every 12 years). Brings monumental spiritual elevation, wisdom breakthroughs, mentor blessings, and expansion of purpose.`);
  }

  if (isSaturnReturnActive) {
    activeReturnDescriptions.push(`⚖️ SATURN RETURN ACTIVE: Transiting Saturn returns to its natal sign (every ~29.5-30 years). Structural reckoning, shedding frivolous attachments, karmic crystallization, and heavy adult accountability.`);
  }

  if (isNodalReturnActive) {
    activeReturnDescriptions.push(`🌀 NODAL (RAHU-KETU) RETURN ACTIVE: The lunar nodes return to their natal axis (every ~18.5 years). Major karmic turning points, destiny pivots, foreign connections, and spiritual reassessment.`);
  }

  return {
    solarReturnCurrentYear,
    lunarReturnCycleDays,
    jupiterReturnAges,
    isJupiterReturnActive,
    saturnReturnAges,
    isSaturnReturnActive,
    nodalReturnAges,
    isNodalReturnActive,
    activeReturnDescriptions
  };
}

// ==========================================
// 8. MASTER SUMMARY GENERATOR
// ==========================================

export function generateAnnualActivationMasterSummary(
  ephemeris: EphemerisResult,
  birthDate: Date,
  targetDateOrAge?: Date | number
): AnnualActivationMasterReport {
  let completedAge: number;
  let currentLifeYear: number;

  if (typeof targetDateOrAge === "number") {
    completedAge = Math.max(0, Math.floor(targetDateOrAge));
    currentLifeYear = completedAge + 1;
  } else {
    const target = targetDateOrAge || new Date();
    completedAge = calculateExactAgeYears(birthDate, target);
    currentLifeYear = completedAge + 1;
  }

  const pakaLagna = calculatePakaLagnaProfile(ephemeris);
  const annualProgression = calculateAnnualHouseProgression(ephemeris, birthDate, targetDateOrAge);
  const nuclearBomb = detectRahuKetuNuclearBombEffect(annualProgression.activeHouse, ephemeris);
  const trikonaResonance = calculateTrikonaResonance(annualProgression.activeHouse, ephemeris);
  const bhagyodaya = calculateBhagyodayaTiming(ephemeris);
  const grahaUdayaReport = calculateGrahaUdayaTimeline(ephemeris, completedAge);
  const planetaryReturns = calculatePlanetaryReturns(
    birthDate,
    ephemeris,
    typeof targetDateOrAge === "object" ? targetDateOrAge : new Date()
  );

  const masterExecutiveSummary = `
**MASTER ANNUAL ACTIVATION & PAKA LAGNA DOSSIER (वर्ष चक्र व पाक लग्न)**
1. **Core Identity vs. Operating Self (Paka Lagna):**
   - Core Identity (Lagna): House 1 in **${pakaLagna.lagnaRashiName}** (Lord: ${pakaLagna.lagnesha}).
   - Operating Demeanor (Paka Lagna): House **${pakaLagna.pakaLagnaHouse}** in **${pakaLagna.pakaLagnaRashiName}** (${pakaLagna.pakaLagnaDignity}).
   - Kalapurusha Integration: Maps to Kalapurusha House ${pakaLagna.kalapurushaHouseNumber} (${pakaLagna.kalapurushaSignification}).
   - Execution Archetype: ${pakaLagna.operatingSelfBehavior}
   - Philosophical Rationale: ${pakaLagna.dignityPhilosophicalRationale}

2. **Current Annual House Activation (Varsha Chakra Progression):**
   - Life Year: **${currentLifeYear}th Year** (Age ${completedAge}, Cycle ${annualProgression.cycleNumber}).
   - Active House: **House ${annualProgression.activeHouse}** (${annualProgression.rashiName}, Lord: ${annualProgression.houseLord} in H${annualProgression.lordHouse}, ${annualProgression.lordDignity}).
   - Delivery Mode: **${annualProgression.deliveryMode}**.
   - Assessment Hierarchy: Residents: [${annualProgression.residentPlanets.join(", ") || "None"}]; Incoming Drishti: [${annualProgression.incomingAspectingPlanets.map((a) => `${a.planet} (${a.aspectType})`).join(", ") || "None"}].
   - Guidance: ${annualProgression.deliveryExplanation}

3. **Nuclear Bomb Nodal Effect:**
   - Status: ${nuclearBomb.warningTitle} (${nuclearBomb.triggerType}).
   - Karmic Impact: ${nuclearBomb.warningDescription}

4. **Trikona Resonance & Auspicious Shield:**
   - Active Trine: **${trikonaResonance.trikonaCategory}** (Houses ${trikonaResonance.trikonaHouses.join(", ")} simultaneously energized).
   - Karmic Protection: ${trikonaResonance.karmicProtectionLevel} — ${trikonaResonance.protectionExplanation}

5. **Bhagyodaya (Fortune Awakening Timing):**
   - 9th House Sign: **${bhagyodaya.ninthHouseSignName}** (Lord: ${bhagyodaya.ninthHouseLord} in H${bhagyodaya.ninthLordHouse}, ${bhagyodaya.ninthLordDignity}).
   - Saturn Factor: ${bhagyodaya.isSaturnDelayingFortune ? "Saturn directly delays early fortune until maturity at Age 36." : "Favorable acceleration without Saturn obstruction."}
   - Prime Fortune Rise Ages: **Age ${bhagyodaya.primaryBhagyodayaAge}**, recurring at **${bhagyodaya.secondaryBhagyodayaAges.slice(1).join(", ") || "later cycles"}**.

6. **Active Planetary Awakening Waves (12-Year Addition Rule):**
   - Currently Energized Grahas: ${grahaUdayaReport.activeMilestones.map((m) => `**${m.planet}** (Wave: Age ${m.closestCycleAge})`).join(", ") || "Baseline consolidation"}.

7. **Cyclic Planetary Returns:**
   - Active Cycles: ${planetaryReturns.activeReturnDescriptions.join(" ")}
`.trim();

  return {
    currentLifeYear,
    completedAge,
    pakaLagna,
    annualProgression,
    nuclearBomb,
    trikonaResonance,
    bhagyodaya,
    grahaUdaya: grahaUdayaReport.allMilestones,
    activeGrahaUdayaWaves: grahaUdayaReport.activeMilestones,
    planetaryReturns,
    masterExecutiveSummary
  };
}
