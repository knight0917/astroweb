/**
 * Classical Vedic Three Sages (Rishi) Modality Framework, Parashari D-3 Drekkana Allocations,
 * Sacred Lineage of Houses (Kula, Dharma, Ishta Devatas with Elemental Propitiation),
 * 3rd-House 12-Year Change Axis, Paramochha Deep Exaltation Degrees,
 * and 12-Sign Lord Innate Awareness vs. Blind Spot Diagnostics
 * (त्रि-ऋषि द्रेष्काण, कुलदेवता पञ्च-तत्व पूजा, 3सरा भाव 12-वर्षीय चक्र व 12 राशि अंध-बिंदु)
 *
 * Shastric Foundations:
 * - Session 93: A Different Perspective on Understanding Our Horoscope (Part 1)
 *   - Astrology as Spiritual Self-Correction: Science of Rishis for personal karmic alignment, not fatalistic blame.
 *   - The Three Gunas across 4-Sign Blocks:
 *     * Signs 1–4 (Aries–Cancer): Rajasic ("I to I") — Self-preservation and personal bodily needs.
 *     * Signs 5–8 (Leo–Scorpio): Tamasic ("I to You") — Relational transactions, contracts, and external demands.
 *     * Signs 9–12 (Sagittarius–Pisces): Sattvic ("I to All") — Universal consciousness, higher dharma, and collective service.
 *   - The Three Sages (Rishis) Archetype for Sign Modalities:
 *     * Movable Signs (Chara — 1, 4, 7, 10) -> Devarshi Narada:
 *       Mind, constant motion, flexibility, wandering across realms, spreading divine praise (Narayana Narayana).
 *       Dynamic, non-stationary, adaptable, communicative lightness.
 *     * Fixed Signs (Sthira — 2, 5, 8, 11) -> Brahmarshi Agastya:
 *       Grounded, steady, protective. Balanced the physical Earth during Shiva's wedding, drank ocean to expose demons.
 *       Protector, preserver, steadfast anchor maintaining equilibrium.
 *     * Dual Signs (Dwiswabhava — 3, 6, 9, 12) -> Maharshi Durvasa:
 *       Fierce intensity, strict discipline, uncompromising penance (Tapasya), boundary testing.
 *       Demands rigorous adherence to truth, readiness to adjust, releasing frivolous attachments.
 * - Session 94: A Different Perspective on Understanding Our Horoscope (Part 2)
 *   - Sacred Lineage of Houses (Deity Triad):
 *     * 4th House -> Kula Devata (Ancestral Family Deity):
 *       Propitiation determined by the elemental nature of the 4th house (Water -> sweet milk/water offerings, emotional devotion;
 *       Fire -> lamps/deepam, havan, Aarti; Earth -> food grains, fresh fruits, sacred sandalwood; Air -> dhoop/incense, silent japa).
 *     * 9th House -> Dharma Devata (Guiding Deity of Principles & Path): Guides moral conduct, preceptors, and fortune.
 *     * 12th House -> Ishta Devata (Deity Guiding Soul to Liberation/Moksha): Personal spiritual ideal for final soul release.
 *   - The Life Axis of Entry and Exit:
 *     * 3rd House = Entry into Manifest Reality & Continuous Changes: 12-Year cycle of life changes (Age = 3 + 12k -> Ages 3, 15, 27, 39, 51, 63, 75).
 *     * 4th House & 8th House: 4th House = physical birth condition. 8th House = physical transition/death environment and release.
 *     * 3rd to 9th House Spiritual Axis: Evolution traveling from 3rd House (Adhyatma — study of personal ego/self) toward 9th House (Dharma — collective cosmic law).
 *   - Deep Exaltation Degrees of the Planets (Paramochha Amsha):
 *     * Sun: Aries 10° (Debilitation: Libra 10°)
 *     * Moon: Taurus 3° (Debilitation: Scorpio 3°)
 *     * Jupiter: Cancer 5° (Debilitation: Capricorn 5°)
 *     * Mars: Capricorn 28° (Debilitation: Cancer 28°)
 *     * Venus: Pisces 27° / 28° (Debilitation: Virgo 27°)
 *     * Mercury: Virgo 15° (Debilitation: Pisces 15°)
 *     * Saturn: Libra 20° (Debilitation: Aries 20°)
 *   - Parashari Drekkana (D3) Framework & Rishi Allocations (10° Segments):
 *     * Movable Signs: 0°–10° Narada, 10°–20° Agastya, 20°–30° Durvasa.
 *     * Fixed Signs: 0°–10° Agastya, 10°–20° Durvasa, 20°–30° Narada.
 *     * Dual Signs: 0°–10° Durvasa, 10°–20° Narada, 20°–30° Agastya.
 * - Session 95: A Different Perspective of Understanding Our Horoscope (Part 3)
 *   - Internalizing Archetypes as Practical Remedies:
 *     * Saluting and remembering the presiding Rishi of a planet's placement aligns with its energies.
 *     * "Yatha Pinde Tatha Brahmande": Narada (inspiration/awareness), Agastya (protection), Durvasa (discipline & heat to burn karma).
 *   - Sign-by-Sign Analysis of Innate Awareness (Uchha) vs. Blind Spots (Neecha):
 *     * Analyzes each sign through where its ruler exalts (highest natural competence) and where it debilitates (inherent blind spot relative to the sign).
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";

// ==========================================
// 1. INTERFACES & TYPES
// ==========================================

export type RishiName = "Devarshi Narada" | "Brahmarshi Agastya" | "Maharshi Durvasa";

export interface RishiArchetypeMeta {
  rishi: RishiName;
  sanskritTitle: string;
  primaryQuality: string;
  modalityAffiliation: "Movable (Chara)" | "Fixed (Sthira)" | "Dual (Dwiswabhava)";
  symbolicMission: string;
  temperamentKeywords: string[];
  psychologicalImpact: string;
  salutationMantra: string;
}

export interface PlanetDrekkanaRishiItem {
  planet: string;
  signName: string;
  signIndex: number;
  houseNumber: number;
  degreeInSign: number;
  drekkanaNumber: 1 | 2 | 3;
  modality: "Movable" | "Fixed" | "Dual";
  governingRishi: RishiName;
  rishiQuality: string;
  behavioralExpression: string;
  salutationMantra: string;
}

export interface SacredLineageDeitiesProfile {
  kulaDevata: {
    houseNumber: 4;
    signName: string;
    signIndex: number;
    element: "Water (Jala)" | "Fire (Agni)" | "Earth (Prithvi)" | "Air (Vayu)";
    signLord: string;
    occupants: string[];
    role: string;
    elementalPropitiationProtocol: string;
    ancestralGuidance: string;
  };
  dharmaDevata: {
    houseNumber: 9;
    signName: string;
    signIndex: number;
    signLord: string;
    occupants: string[];
    role: string;
    philosophicalGuidance: string;
  };
  ishtaDevata: {
    houseNumber: 12;
    signName: string;
    signIndex: number;
    signLord: string;
    occupants: string[];
    role: string;
    mokshaGuidance: string;
  };
}

export interface LifeAxisEntryExitProfile {
  thirdHouseChangeWave: {
    houseNumber: 3;
    signName: string;
    signLord: string;
    occupants: string[];
    nativeCurrentAge: number;
    baseCycleAge: number;
    recurringCycleInterval: 12;
    milestoneAges: number[];
    isCurrentlyInChangeWave: boolean;
    closestMilestoneAge: number;
    waveStatusDescription: string;
    changeInitiativeDirective: string;
  };
  entryExitPhysicalReality: {
    fourthHouseBirthCondition: string;
    eighthHouseExitRelease: string;
    spiritualEvolutionAxis: string;
  };
}

export interface DeepDignityDegreeItem {
  planet: string;
  currentSign: string;
  currentDegree: number;
  paramochhaSign: string;
  paramochhaDegree: number;
  paramaneechaSign: string;
  paramaneechaDegree: number;
  isDeeplyExalted: boolean;
  isDeeplyDebilitated: boolean;
  distanceFromParamochhaDeg: number;
  distanceFromParamaneechaDeg: number;
  dignityPotencyNote: string;
}

export interface SignLordAwarenessBlindSpotItem {
  signName: string;
  signIndex: number;
  rulingLord: string;
  lordExaltationSign: string;
  lordExaltationHouseRelative: number;
  lordDebilitationSign: string;
  lordDebilitationHouseRelative: number;
  innateAwarenessCompetence: string;
  subconsciousBlindSpot: string;
  actionableMindfulnessRemedy: string;
}

export interface RishiDrekkanaMasterReport {
  drekkanaRishiAllocations: {
    planets: PlanetDrekkanaRishiItem[];
    naradaCount: number;
    agastyaCount: number;
    durvasaCount: number;
    dominantRishi: RishiName;
    triRishiSynthesis: string;
  };
  sacredLineageDeities: SacredLineageDeitiesProfile;
  lifeAxisEntryExit: LifeAxisEntryExitProfile;
  deepDignityDegrees: DeepDignityDegreeItem[];
  nativeSignLordDiagnostics: {
    lagnaSignDiagnostic: SignLordAwarenessBlindSpotItem;
    moonSignDiagnostic: SignLordAwarenessBlindSpotItem;
    sunSignDiagnostic: SignLordAwarenessBlindSpotItem;
    all12SignDiagnostics: SignLordAwarenessBlindSpotItem[];
  };
  holisticDossierSummary: string;

  // Direct convenience aliases for flat consumption:
  drekkanaPlanets: PlanetDrekkanaRishiItem[];
  dominantRishi: RishiName;
  kulaDevataPropitiation: string;
  thirdHouseChangeWaveStatus: string;
  masterDossierSummary: string;
}

// ==========================================
// 2. REFERENCE DICTIONARIES & CONFIGS
// ==========================================

export const THREE_RISHIS_CONFIG: Record<RishiName, RishiArchetypeMeta> = {
  "Devarshi Narada": {
    rishi: "Devarshi Narada",
    sanskritTitle: "देवर्षि नारद (मन, गति, संचरण व भक्ति)",
    primaryQuality: "Mental Agility, Continuous Movement, Adaptability & Divine Praise",
    modalityAffiliation: "Movable (Chara)",
    symbolicMission:
      "Represents the pure Manas (mind) in perpetual joyful motion. Wanders freely across the three worlds chanting 'Narayana Narayana', carrying divine communication, sparking necessary developments, and breaking rigid stagnation.",
    temperamentKeywords: ["Agile", "Communicative", "Non-Stagnant", "Curious", "Devotional", "Pioneering"],
    psychologicalImpact:
      "Planets under Narada's governance operate with swift mental adaptability, eloquence, and a disinclination toward rigid fixation. The native navigates problems through diplomatic agility and spontaneous divine trust.",
    salutationMantra: "ॐ देवर्षये नारदाय नमः (Om Devarshaye Naradaya Namaha)",
  },
  "Brahmarshi Agastya": {
    rishi: "Brahmarshi Agastya",
    sanskritTitle: "ब्रह्मर्षि अगस्त्य (धैर्य, स्थिरता, संरक्षण व संतुलन)",
    primaryQuality: "Grounded Steadfastness, Protection, Elemental Mastery & Planetary Balance",
    modalityAffiliation: "Fixed (Sthira)",
    symbolicMission:
      "Represents unshakable equilibrium and grounded preservation. Journeyed south to balance the Earth's physical weight during Lord Shiva's divine wedding and swallowed the ocean to uncover hidden adversaries of the gods.",
    temperamentKeywords: ["Steadfast", "Protective", "Enduring", "Loyal", "Patient", "Grounded Anchor"],
    psychologicalImpact:
      "Planets under Agastya's governance act as formidable pillars of protection, perseverance, and emotional gravity. The native holds ground in adversity, safeguarding family, traditions, and institutional values.",
    salutationMantra: "ॐ अगस्त्याय नमः (Om Agastyaya Namaha)",
  },
  "Maharshi Durvasa": {
    rishi: "Maharshi Durvasa",
    sanskritTitle: "महर्षि दुर्वासा (तप, अनुशासन, परीक्षा व कर्म शुद्धि)",
    primaryQuality: "Fierce Intensity, Austere Discipline, Boundary Testing & Karmic Burning",
    modalityAffiliation: "Dual (Dwiswabhava)",
    symbolicMission:
      "Born as a portion of Lord Shiva's intense wrath and tapasic fire. Known for uncompromising expectations of truth, strict testing of disciples, and shattering false pride and complacency so that deep karmic debts are rapidly cleared.",
    temperamentKeywords: ["Disciplined", "Austere", "Fiery", "Boundary-Testing", "Strict", "Transformation"],
    psychologicalImpact:
      "Planets under Durvasa's governance demand rigorous adherence to high standards, zero tolerance for pretense, and readiness to undergo intense evolutionary refinement. The native learns to master anger and embrace strict spiritual tapasya.",
    salutationMantra: "ॐ महर्षये दुर्वाससे नमः (Om Maharshaye Durvasase Namaha)",
  },
};

/**
 * Classical Deep Exaltation Degrees (Paramochha Amsha) and Deep Debilitation Degrees (Paramaneecha Amsha).
 * Source: Parashara Hora Shastra & Session 94.
 */
export const PARAMOCHHA_DEGREES: Record<
  string,
  { paramochhaSign: string; paramochhaDegree: number; paramaneechaSign: string; paramaneechaDegree: number }
> = {
  Sun: { paramochhaSign: "Aries", paramochhaDegree: 10, paramaneechaSign: "Libra", paramaneechaDegree: 10 },
  Moon: { paramochhaSign: "Taurus", paramochhaDegree: 3, paramaneechaSign: "Scorpio", paramaneechaDegree: 3 },
  Mars: { paramochhaSign: "Capricorn", paramochhaDegree: 28, paramaneechaSign: "Cancer", paramaneechaDegree: 28 },
  Mercury: { paramochhaSign: "Virgo", paramochhaDegree: 15, paramaneechaSign: "Pisces", paramaneechaDegree: 15 },
  Jupiter: { paramochhaSign: "Cancer", paramochhaDegree: 5, paramaneechaSign: "Capricorn", paramaneechaDegree: 5 },
  Venus: { paramochhaSign: "Pisces", paramochhaDegree: 27, paramaneechaSign: "Virgo", paramaneechaDegree: 27 },
  Saturn: { paramochhaSign: "Libra", paramochhaDegree: 20, paramaneechaSign: "Aries", paramaneechaDegree: 20 },
};

/**
 * 12-Sign Lord Exaltation (Innate Awareness) vs. Debilitation (Inherent Blind Spot) Matrix.
 * Source: Session 95 masterclass analysis.
 */
export const SIGN_LORD_AWARENESS_BLIND_SPOT_MAP: Record<string, SignLordAwarenessBlindSpotItem> = {
  Aries: {
    signName: "Aries",
    signIndex: 0,
    rulingLord: "Mars",
    lordExaltationSign: "Capricorn",
    lordExaltationHouseRelative: 10,
    lordDebilitationSign: "Cancer",
    lordDebilitationHouseRelative: 4,
    innateAwarenessCompetence:
      "Executive Action & Hard Duty: Sharp instinctive comprehension of professional responsibility, competitive strategy, and tireless accomplishment in the 10th house arena.",
    subconsciousBlindSpot:
      "Emotional Passivity & Domestic Rest: Tends to overlook emotional vulnerability, nurturing passivity, and domestic equilibrium in the 4th house realm. Mars cannot fight effectively while crying.",
    actionableMindfulnessRemedy:
      "Consciously cultivate gentle domestic patience. Schedule dedicated rest periods at home without treating life as an unceasing battlefield.",
  },
  Taurus: {
    signName: "Taurus",
    signIndex: 1,
    rulingLord: "Venus",
    lordExaltationSign: "Pisces",
    lordExaltationHouseRelative: 11,
    lordDebilitationSign: "Virgo",
    lordDebilitationHouseRelative: 5,
    innateAwarenessCompetence:
      "Asset Expansion & Community Abundance: Natural mastery in accumulating tangible assets, managing social networks, and sharing prosperity in the 11th house sphere.",
    subconsciousBlindSpot:
      "Critical Over-Analysis in Romance: Tends to hyper-audit romance, creative projects, or children under analytical ledgers in the 5th house realm. Dissecting affection destroys joy.",
    actionableMindfulnessRemedy:
      "Cease scoring and auditing emotional relationships. Practice unconditional creative playfulness and romance without calculating material ROI.",
  },
  Gemini: {
    signName: "Gemini",
    signIndex: 2,
    rulingLord: "Mercury",
    lordExaltationSign: "Virgo",
    lordExaltationHouseRelative: 4,
    lordDebilitationSign: "Pisces",
    lordDebilitationHouseRelative: 10,
    innateAwarenessCompetence:
      "Analytical Home & Intellectual Grounding: Razor-sharp ability to organize home libraries, process educational data, and systematize knowledge in the 4th house foundation.",
    subconsciousBlindSpot:
      "Lack of Long-Term Professional Structure: Risk of boundless diffusion, drifting, or unstructured surrender in executive career commitments in the 10th house arena.",
    actionableMindfulnessRemedy:
      "Anchor intellectual curiosity with concrete, written professional goals. Commit to long-term vocational follow-through without scattering focus across shiny distractions.",
  },
  Cancer: {
    signName: "Cancer",
    signIndex: 3,
    rulingLord: "Moon",
    lordExaltationSign: "Taurus",
    lordExaltationHouseRelative: 11,
    lordDebilitationSign: "Scorpio",
    lordDebilitationHouseRelative: 5,
    innateAwarenessCompetence:
      "Nourishing Gains & Material Comfort: Instinctive genius for creating domestic security, wholesome culinary abundance, and financial safety nets in the 11th house realm.",
    subconsciousBlindSpot:
      "Subterranean Jealousy & Emotional Turmoil: Prone to intense subterranean suspicions, possessive jealousy, and anxiety over lovers or children in the 5th house arena.",
    actionableMindfulnessRemedy:
      "Channel deep emotional intensity into creative arts, mantra japa, and selfless devotion. Release possessiveness and grant loved ones sovereign autonomy.",
  },
  Leo: {
    signName: "Leo",
    signIndex: 4,
    rulingLord: "Sun",
    lordExaltationSign: "Aries",
    lordExaltationHouseRelative: 9,
    lordDebilitationSign: "Libra",
    lordDebilitationHouseRelative: 3,
    innateAwarenessCompetence:
      "Dharmic Vision & Sovereign Leadership: Inherent natural dignity aligned with high moral law, ancestral honor, executive statecraft, and broad philosophical vision in the 9th house realm.",
    subconsciousBlindSpot:
      "Aversion to Street-Level Bargaining: Deep disdain for petty daily banter, tedious logistical networking, small compromises, or transactional flattery in the 3rd house sphere.",
    actionableMindfulnessRemedy:
      "Recognize that grand royal visions require humble everyday communication and grass-roots execution. Practice patient, non-judgmental listening in small transactions.",
  },
  Virgo: {
    signName: "Virgo",
    signIndex: 5,
    rulingLord: "Mercury",
    lordExaltationSign: "Virgo",
    lordExaltationHouseRelative: 1,
    lordDebilitationSign: "Pisces",
    lordDebilitationHouseRelative: 7,
    innateAwarenessCompetence:
      "Supreme Self-Analysis & Diagnostic Precision: Exceptional analytical hygiene, meticulous bookkeeping, biological self-care, and organizational perfection in the 1st house self.",
    subconsciousBlindSpot:
      "Relational Audit & Partnership Strain: Relentless fault-finding, auditing, and critical nitpicking strain intimate partnerships and contractual warmth in the 7th house realm.",
    actionableMindfulnessRemedy:
      "Turn off the auditing lens when dealing with romantic and business partners. Accept human imperfections as natural; practice open-hearted emotional surrender.",
  },
  Libra: {
    signName: "Libra",
    signIndex: 6,
    rulingLord: "Venus",
    lordExaltationSign: "Pisces",
    lordExaltationHouseRelative: 6,
    lordDebilitationSign: "Virgo",
    lordDebilitationHouseRelative: 12,
    innateAwarenessCompetence:
      "Selfless Healing & Conflict Resolution: Miraculous capacity for compassionate dispute resolution, nursing the afflicted, and humble, patient service in the 6th house realm.",
    subconsciousBlindSpot:
      "Auditing in Solitude & Bed Restlessness: Hyper-analytical anxiety in the bedroom, calculating losses in isolation, and inability to achieve peaceful subconscious surrender in the 12th house sphere.",
    actionableMindfulnessRemedy:
      "Create a strict bedtime electronics and work curfew. Practice gentle yogic sleep (Yoga Nidra) and surrendering worries to the divine before closing eyes.",
  },
  Scorpio: {
    signName: "Scorpio",
    signIndex: 7,
    rulingLord: "Mars",
    lordExaltationSign: "Capricorn",
    lordExaltationHouseRelative: 3,
    lordDebilitationSign: "Cancer",
    lordDebilitationHouseRelative: 9,
    innateAwarenessCompetence:
      "Covert Courage & Tactical Initiative: Formidable stamina, psychological resilience, and relentless courage in hands-on enterprise and tactical negotiations in the 3rd house realm.",
    subconsciousBlindSpot:
      "Emotional Friction with Preceptors & Dogma: Hypersensitive skepticism, emotional defensiveness, or ideological clashes with gurus, mentors, and traditional philosophy in the 9th house arena.",
    actionableMindfulnessRemedy:
      "Approach spiritual teachers and philosophical traditions with an open, receptive heart rather than defensive psychological walls.",
  },
  Sagittarius: {
    signName: "Sagittarius",
    signIndex: 8,
    rulingLord: "Jupiter",
    lordExaltationSign: "Cancer",
    lordExaltationHouseRelative: 8,
    lordDebilitationSign: "Capricorn",
    lordDebilitationHouseRelative: 2,
    innateAwarenessCompetence:
      "Occult Wisdom & Transformative Empathy: Profound grasp of esoteric mysteries, metaphysical counseling, deep psychological rejuvenation, and guiding seekers through crises in the 8th house realm.",
    subconsciousBlindSpot:
      "Cold Financial Management & Domestic Speech: Struggles with disciplined everyday financial budgeting, penny-pinching, or harsh, impatient domestic communication in the 2nd house realm.",
    actionableMindfulnessRemedy:
      "Institute structured financial bookkeeping. Infuse everyday family dialogue with gentle sweetness (Madhura Vak) rather than abstract philosophical preaching.",
  },
  Capricorn: {
    signName: "Capricorn",
    signIndex: 9,
    rulingLord: "Saturn",
    lordExaltationSign: "Libra",
    lordExaltationHouseRelative: 10,
    lordDebilitationSign: "Aries",
    lordDebilitationHouseRelative: 4,
    innateAwarenessCompetence:
      "Impartial Justice & Institutional Authority: Supreme mastery of fair public governance, balanced ethical leadership, measured diplomacy, and enduring labor in the 10th house career.",
    subconsciousBlindSpot:
      "Domestic Restlessness & Impatience: Coldness, emotional suppression, or rash, abrupt irritation within the domestic sanctuary and mother's care in the 4th house realm.",
    actionableMindfulnessRemedy:
      "Leave administrative rank and institutional seriousness outside the front door. Nurture home life with warmth, emotional vulnerability, and genuine relaxation.",
  },
  Aquarius: {
    signName: "Aquarius",
    signIndex: 10,
    rulingLord: "Saturn",
    lordExaltationSign: "Libra",
    lordExaltationHouseRelative: 9,
    lordDebilitationSign: "Aries",
    lordDebilitationHouseRelative: 3,
    innateAwarenessCompetence:
      "Universal Law & Humanitarian Justice: Broad philosophical dedication to collective human equality, righteous social reforms, and ethical preceptor wisdom in the 9th house realm.",
    subconsciousBlindSpot:
      "Impulsive Personal Marketing & Sibling Friction: Rash, inconsistent, or impatient self-promotion, short-range travel anxiety, or erratic sibling communication in the 3rd house sphere.",
    actionableMindfulnessRemedy:
      "Apply the same measured fairness to immediate siblings, neighbors, and short-term commercial projects that you advocate for global humanity.",
  },
  Pisces: {
    signName: "Pisces",
    signIndex: 11,
    rulingLord: "Jupiter",
    lordExaltationSign: "Cancer",
    lordExaltationHouseRelative: 5,
    lordDebilitationSign: "Capricorn",
    lordDebilitationHouseRelative: 11,
    innateAwarenessCompetence:
      "Divine Devotion & Sacred Bhakti: Sublime mastery of loving spiritual surrender, mantra contemplation, intuitive guidance of students, and heartfelt creative genius in the 5th house realm.",
    subconsciousBlindSpot:
      "Cold Corporate Lobbying & Transactional Networks: Complete discomfort, naivete, or exhaustion when dealing with dry corporate networking, transactional lobbying, or political schmoozing in the 11th house sphere.",
    actionableMindfulnessRemedy:
      "Collaborate with grounded, pragmatic partners who can handle corporate contracts and networking logistics while you focus on vision, ethics, and inspirational guidance.",
  },
};

// ==========================================
// 3. CORE CALCULATION FUNCTIONS
// ==========================================

/**
 * Determines the sign modality: Movable (Chara), Fixed (Sthira), or Dual (Dwiswabhava).
 */
export function getSignModality(signIndex: number): "Movable" | "Fixed" | "Dual" {
  const norm = ((signIndex % 12) + 12) % 12;
  // Movable: 0, 3, 6, 9 (Aries, Cancer, Libra, Capricorn)
  if (norm % 3 === 0) return "Movable";
  // Fixed: 1, 4, 7, 10 (Taurus, Leo, Scorpio, Aquarius)
  if (norm % 3 === 1) return "Fixed";
  // Dual: 2, 5, 8, 11 (Gemini, Virgo, Sagittarius, Pisces)
  return "Dual";
}

/**
 * Parashari 10° Drekkana Rishi Allocation Rule (Session 94).
 */
export function getDrekkanaRishi(signIndex: number, degreeInSign: number): {
  rishi: RishiName;
  drekkanaNumber: 1 | 2 | 3;
} {
  const dNum: 1 | 2 | 3 = degreeInSign < 10 ? 1 : degreeInSign < 20 ? 2 : 3;
  const modality = getSignModality(signIndex);

  if (modality === "Movable") {
    // 0-10 Narada, 10-20 Agastya, 20-30 Durvasa
    if (dNum === 1) return { rishi: "Devarshi Narada", drekkanaNumber: 1 };
    if (dNum === 2) return { rishi: "Brahmarshi Agastya", drekkanaNumber: 2 };
    return { rishi: "Maharshi Durvasa", drekkanaNumber: 3 };
  } else if (modality === "Fixed") {
    // 0-10 Agastya, 10-20 Durvasa, 20-30 Narada
    if (dNum === 1) return { rishi: "Brahmarshi Agastya", drekkanaNumber: 1 };
    if (dNum === 2) return { rishi: "Maharshi Durvasa", drekkanaNumber: 2 };
    return { rishi: "Devarshi Narada", drekkanaNumber: 3 };
  } else {
    // Dual: 0-10 Durvasa, 10-20 Narada, 20-30 Agastya
    if (dNum === 1) return { rishi: "Maharshi Durvasa", drekkanaNumber: 1 };
    if (dNum === 2) return { rishi: "Devarshi Narada", drekkanaNumber: 2 };
    return { rishi: "Brahmarshi Agastya", drekkanaNumber: 3 };
  }
}

/**
 * Evaluates the Three Sages (Narada, Agastya, Durvasa) Drekkana allocations for all planets and Lagna.
 */
export function evaluateDrekkanaRishiAllocation(
  natalEphem: EphemerisResult
): RishiDrekkanaMasterReport["drekkanaRishiAllocations"] {
  const ascDegree = natalEphem.ascendant?.siderealLongitude ?? 0;
  const ascSignIdx = Math.floor((((ascDegree % 360) + 360) % 360) / 30);

  const targets = ["Lagna", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const planetItems: PlanetDrekkanaRishiItem[] = [];

  let naradaCount = 0;
  let agastyaCount = 0;
  let durvasaCount = 0;

  for (const name of targets) {
    let longitude = 0;
    if (name === "Lagna") {
      longitude = ascDegree;
    } else {
      const p = natalEphem.planets[name];
      if (!p) continue;
      longitude = p.siderealLongitude;
    }

    const sIdx = Math.floor((((longitude % 360) + 360) % 360) / 30);
    const sName = RASHI_NAMES[sIdx]?.englishName ?? "Unknown";
    const degInSign = (((longitude % 30) + 30) % 30);
    const houseNum = name === "Lagna" ? 1 : ((sIdx - ascSignIdx + 12) % 12) + 1;
    const modality = getSignModality(sIdx);

    const { rishi, drekkanaNumber } = getDrekkanaRishi(sIdx, degInSign);
    const rConfig = THREE_RISHIS_CONFIG[rishi];

    if (rishi === "Devarshi Narada") naradaCount++;
    else if (rishi === "Brahmarshi Agastya") agastyaCount++;
    else durvasaCount++;

    const behavioralExpression =
      `${name} occupies ${sName} at ${degInSign.toFixed(2)}° (Drekkana ${drekkanaNumber} in ${modality} sign) under ${rishi}. ` +
      `Its operational energy is infused with ${rConfig.primaryQuality.toLowerCase()}. ${rConfig.psychologicalImpact}`;

    planetItems.push({
      planet: name,
      signName: sName,
      signIndex: sIdx,
      houseNumber: houseNum,
      degreeInSign: Number(degInSign.toFixed(2)),
      drekkanaNumber,
      modality,
      governingRishi: rishi,
      rishiQuality: rConfig.primaryQuality,
      behavioralExpression,
      salutationMantra: rConfig.salutationMantra,
    });
  }

  let dominantRishi: RishiName = "Devarshi Narada";
  if (agastyaCount >= naradaCount && agastyaCount >= durvasaCount) dominantRishi = "Brahmarshi Agastya";
  else if (durvasaCount >= naradaCount && durvasaCount >= agastyaCount) dominantRishi = "Maharshi Durvasa";

  const triRishiSynthesis =
    `D-3 RISHI DREKKANA MATRIX (Sessions 93 & 94): Your chart carries ${naradaCount} point(s) of Devarshi Narada (Agility & Divine Inspiration), ` +
    `${agastyaCount} point(s) of Brahmarshi Agastya (Grounded Endurance & Protection), and ${durvasaCount} point(s) of Maharshi Durvasa ` +
    `(Fiery Discipline & Karmic Refinement). Your primary spiritual-temperament anchor is dominated by ${dominantRishi}. ` +
    `Remembering and saluting the presiding Rishi of each planet harmonizes its subtle energetic frequency according to the universal axiom: "Yatha Pinde Tatha Brahmande".`;

  return {
    planets: planetItems,
    naradaCount,
    agastyaCount,
    durvasaCount,
    dominantRishi,
    triRishiSynthesis,
  };
}

/**
 * Evaluates Sacred Lineage of Houses (4th House Kula Devata, 9th House Dharma Devata, 12th House Ishta Devata)
 * with exact elemental propitiation rules (Session 94).
 */
export function evaluateSacredLineageDeities(
  natalEphem: EphemerisResult
): SacredLineageDeitiesProfile {
  const ascDegree = natalEphem.ascendant?.siderealLongitude ?? 0;
  const ascSignIdx = Math.floor((((ascDegree % 360) + 360) % 360) / 30);

  // 4th House
  const fourthSignIdx = (ascSignIdx + 3) % 12;
  const fourthSignName = RASHI_NAMES[fourthSignIdx]?.englishName ?? "Unknown";
  const fourthLord = RASHI_NAMES[fourthSignIdx]?.lord ?? "Unknown";

  // Elemental classification for 4th house
  let fourthElement: SacredLineageDeitiesProfile["kulaDevata"]["element"] = "Earth (Prithvi)";
  let propitiationProtocol = "";

  if ([0, 4, 8].includes(fourthSignIdx)) {
    fourthElement = "Fire (Agni)";
    propitiationProtocol =
      "Agni Tattva Propitiation: Light pure cow ghee lamps (Deepam), perform regular Aarti, offer havana/sacrificial fire offerings, and honor the divine through morning Surya/Agni contemplation.";
  } else if ([1, 5, 9].includes(fourthSignIdx)) {
    fourthElement = "Earth (Prithvi)";
    propitiationProtocol =
      "Prithvi Tattva Propitiation: Offer sacred food grains, fresh wholesome fruits, pure sandalwood paste (Chandan), fragrant earthen blossoms, and plant sacred trees/tulsi on behalf of family lineage.";
  } else if ([2, 6, 10].includes(fourthSignIdx)) {
    fourthElement = "Air (Vayu)";
    propitiationProtocol =
      "Vayu Tattva Propitiation: Burn natural sweet dhoop/incense, chant sacred Vedic stotras aloud, practice silent japa, and ensure clean, well-ventilated, fragrant airflow in the family prayer altar.";
  } else {
    fourthElement = "Water (Jala)";
    propitiationProtocol =
      "Jala Tattva Propitiation: Offer pure sweet milk, fresh clean water (Jala Arghya), visit holy water shrines/rivers, offer white fragrant flowers, and approach the lineage deity with heartfelt emotional devotion.";
  }

  const fourthOccupants: string[] = [];
  const ninthOccupants: string[] = [];
  const twelfthOccupants: string[] = [];

  for (const [pName, p] of Object.entries(natalEphem.planets)) {
    if (!p) continue;
    const sIdx = Math.floor((((p.siderealLongitude % 360) + 360) % 360) / 30);
    const house = ((sIdx - ascSignIdx + 12) % 12) + 1;
    if (house === 4) fourthOccupants.push(pName);
    if (house === 9) ninthOccupants.push(pName);
    if (house === 12) twelfthOccupants.push(pName);
  }

  // 9th House
  const ninthSignIdx = (ascSignIdx + 8) % 12;
  const ninthSignName = RASHI_NAMES[ninthSignIdx]?.englishName ?? "Unknown";
  const ninthLord = RASHI_NAMES[ninthSignIdx]?.lord ?? "Unknown";

  // 12th House
  const twelfthSignIdx = (ascSignIdx + 11) % 12;
  const twelfthSignName = RASHI_NAMES[twelfthSignIdx]?.englishName ?? "Unknown";
  const twelfthLord = RASHI_NAMES[twelfthSignIdx]?.lord ?? "Unknown";

  return {
    kulaDevata: {
      houseNumber: 4,
      signName: fourthSignName,
      signIndex: fourthSignIdx,
      element: fourthElement,
      signLord: fourthLord,
      occupants: fourthOccupants,
      role: "Ancestral Lineage Deity (Protects household peace, biological bloodline, property, and mother)",
      elementalPropitiationProtocol: propitiationProtocol,
      ancestralGuidance: `Your 4th house falls in ${fourthSignName} (${fourthElement}), ruled by ${fourthLord}. Honoring your family Kula Devata using ${fourthElement} offerings dissolves stubborn genetic and ancestral karmic hurdles.`,
    },
    dharmaDevata: {
      houseNumber: 9,
      signName: ninthSignName,
      signIndex: ninthSignIdx,
      signLord: ninthLord,
      occupants: ninthOccupants,
      role: "Guiding Deity of Principles & Path (Commands moral dharma, higher conscience, preceptor grace, and fortune)",
      philosophicalGuidance: `Your 9th house is anchored by ${ninthSignName} (Lord: ${ninthLord}). Adhering to righteous, unbending ethics aligns your conscious will with the divine law of your Dharma Devata.`,
    },
    ishtaDevata: {
      houseNumber: 12,
      signName: twelfthSignName,
      signIndex: twelfthSignIdx,
      signLord: twelfthLord,
      occupants: twelfthOccupants,
      role: "Soul Liberation Deity (Guides the soul to peaceful detachment, dream transcendence, and ultimate Moksha)",
      mokshaGuidance: `Your 12th house Moksha gateway rests in ${twelfthSignName} (Lord: ${twelfthLord}). Quiet nocturnal meditation and surrendering worldly ego at this portal guarantees profound spiritual liberation.`,
    },
  };
}

/**
 * Evaluates the Life Axis of Entry and Exit & 3rd-House 12-Year Change Wave ($Age = 3 + 12k$).
 */
export function evaluateLifeAxisAndEntryExit(
  natalEphem: EphemerisResult,
  currentDate: Date = new Date()
): LifeAxisEntryExitProfile {
  const ascDegree = natalEphem.ascendant?.siderealLongitude ?? 0;
  const ascSignIdx = Math.floor((((ascDegree % 360) + 360) % 360) / 30);

  // 3rd House
  const thirdSignIdx = (ascSignIdx + 2) % 12;
  const thirdSignName = RASHI_NAMES[thirdSignIdx]?.englishName ?? "Unknown";
  const thirdLord = RASHI_NAMES[thirdSignIdx]?.lord ?? "Unknown";

  const thirdOccupants: string[] = [];
  for (const [pName, p] of Object.entries(natalEphem.planets)) {
    if (!p) continue;
    const sIdx = Math.floor((((p.siderealLongitude % 360) + 360) % 360) / 30);
    const house = ((sIdx - ascSignIdx + 12) % 12) + 1;
    if (house === 3) thirdOccupants.push(pName);
  }

  const birthDate = new Date(natalEphem.utcDate);
  const ageMs = currentDate.getTime() - birthDate.getTime();
  const nativeCurrentAge = Math.max(0, Math.floor(ageMs / (1000 * 60 * 60 * 24 * 365.2425)));

  // 3rd House Milestone Ages: 3, 15, 27, 39, 51, 63, 75, 87, 99
  const milestoneAges = [3, 15, 27, 39, 51, 63, 75, 87, 99];
  let isCurrentlyInChangeWave = false;
  let closestMilestoneAge = 3;
  let minDiff = 999;

  for (const mAge of milestoneAges) {
    const diff = Math.abs(nativeCurrentAge - mAge);
    if (diff < minDiff) {
      minDiff = diff;
      closestMilestoneAge = mAge;
    }
    if (diff <= 1) {
      isCurrentlyInChangeWave = true;
    }
  }

  const waveStatusDescription = isCurrentlyInChangeWave
    ? `🔥 ACTIVE 12-YEAR CHANGE WAVE: At Age ${nativeCurrentAge}, you are within the potent orbital window of the 3rd House Milestone (Age ${closestMilestoneAge}). Expect pivotal realignments in personal courage, relocation, entrepreneurial initiatives, and communicative drive.`
    : `Awaiting Next 12-Year Change Wave: Currently at Age ${nativeCurrentAge}. Your closest 3rd House turning point is Age ${closestMilestoneAge} (${closestMilestoneAge > nativeCurrentAge ? `in ~${closestMilestoneAge - nativeCurrentAge} year(s)` : `passed ${nativeCurrentAge - closestMilestoneAge} year(s) ago`}).`;

  const changeInitiativeDirective =
    `The 3rd House represents the entry spark into manifest reality and continuous transformation. ` +
    `Anchored in ${thirdSignName} (Lord: ${thirdLord}), every 12-year cycle resets how you take initiative and exercise free will (Purushartha).`;

  return {
    thirdHouseChangeWave: {
      houseNumber: 3,
      signName: thirdSignName,
      signLord: thirdLord,
      occupants: thirdOccupants,
      nativeCurrentAge,
      baseCycleAge: 3,
      recurringCycleInterval: 12,
      milestoneAges,
      isCurrentlyInChangeWave,
      closestMilestoneAge,
      waveStatusDescription,
      changeInitiativeDirective,
    },
    entryExitPhysicalReality: {
      fourthHouseBirthCondition:
        "4th House reflects physical birth conditions, the maternal womb sanctuary, and early environmental nurturance.",
      eighthHouseExitRelease:
        "8th House reflects the timing, psychological state, and release of the physical body at life's concluding transition.",
      spiritualEvolutionAxis:
        "3rd to 9th House Axis: Life is an evolutionary pilgrimage traveling from the 3rd house (Adhyatma — study of personal ego, self-effort, and small boundaries) toward the 9th house (Dharma — collective surrender to universal divine cosmic order).",
    },
  };
}

/**
 * Evaluates Deep Exaltation (Paramochha Amsha) and Deep Debilitation (Paramaneecha Amsha) Proximities.
 */
export function evaluateDeepDignityDegrees(
  natalEphem: EphemerisResult
): DeepDignityDegreeItem[] {
  const results: DeepDignityDegreeItem[] = [];

  for (const [pName, cfg] of Object.entries(PARAMOCHHA_DEGREES)) {
    const p = natalEphem.planets[pName];
    if (!p) continue;

    const sIdx = Math.floor((((p.siderealLongitude % 360) + 360) % 360) / 30);
    const sName = RASHI_NAMES[sIdx]?.englishName ?? "Unknown";
    const degInSign = (((p.siderealLongitude % 30) + 30) % 30);

    const isExaltedSign = sName === cfg.paramochhaSign;
    const isDebilitatedSign = sName === cfg.paramaneechaSign;

    const distParamochha = isExaltedSign
      ? Math.abs(degInSign - cfg.paramochhaDegree)
      : Math.abs(p.siderealLongitude - (RASHI_NAMES.findIndex(r => r.englishName === cfg.paramochhaSign) * 30 + cfg.paramochhaDegree));

    const distParamaneecha = isDebilitatedSign
      ? Math.abs(degInSign - cfg.paramaneechaDegree)
      : Math.abs(p.siderealLongitude - (RASHI_NAMES.findIndex(r => r.englishName === cfg.paramaneechaSign) * 30 + cfg.paramaneechaDegree));

    const isDeeplyExalted = isExaltedSign && distParamochha <= 3.0;
    const isDeeplyDebilitated = isDebilitatedSign && distParamaneecha <= 3.0;

    let dignityPotencyNote = `${pName} sits at ${degInSign.toFixed(2)}° in ${sName}.`;
    if (isDeeplyExalted) {
      dignityPotencyNote = `🌟 EXACT PARAMOCHHA ACTIVATION: ${pName} is within ${distParamochha.toFixed(2)}° of its deepest exaltation point (${cfg.paramochhaDegree}° ${cfg.paramochhaSign}), releasing peak conscious mastery and immense energetic potency!`;
    } else if (isDeeplyDebilitated) {
      dignityPotencyNote = `⚠️ EXACT PARAMANEECHA POINT: ${pName} is within ${distParamaneecha.toFixed(2)}° of its deepest debilitation point (${cfg.paramaneechaDegree}° ${cfg.paramaneechaSign}), marking an acute, sensitive subconscious blind spot requiring deliberate, humble mindfulness.`;
    } else if (isExaltedSign) {
      dignityPotencyNote = `${pName} is in its exaltation sign ${sName} (orb from deep peak ${cfg.paramochhaDegree}° is ${distParamochha.toFixed(2)}°).`;
    } else if (isDebilitatedSign) {
      dignityPotencyNote = `${pName} is in its debilitation sign ${sName} (orb from deep nadir ${cfg.paramaneechaDegree}° is ${distParamaneecha.toFixed(2)}°).`;
    }

    results.push({
      planet: pName,
      currentSign: sName,
      currentDegree: Number(degInSign.toFixed(2)),
      paramochhaSign: cfg.paramochhaSign,
      paramochhaDegree: cfg.paramochhaDegree,
      paramaneechaSign: cfg.paramaneechaSign,
      paramaneechaDegree: cfg.paramaneechaDegree,
      isDeeplyExalted,
      isDeeplyDebilitated,
      distanceFromParamochhaDeg: Number(distParamochha.toFixed(2)),
      distanceFromParamaneechaDeg: Number(distParamaneecha.toFixed(2)),
      dignityPotencyNote,
    });
  }

  return results;
}

/**
 * Evaluates the 12-Sign Lord Exaltation (Innate Awareness) vs. Debilitation (Blind Spot) Matrix (Session 95).
 */
export function evaluateSignLordAwarenessBlindSpots(
  natalEphem: EphemerisResult
): RishiDrekkanaMasterReport["nativeSignLordDiagnostics"] {
  const ascDegree = natalEphem.ascendant?.siderealLongitude ?? 0;
  const ascSignIdx = Math.floor((((ascDegree % 360) + 360) % 360) / 30);
  const ascSignName = RASHI_NAMES[ascSignIdx]?.englishName ?? "Aries";

  const moonDegree = natalEphem.planets.Moon?.siderealLongitude ?? 0;
  const moonSignIdx = Math.floor((((moonDegree % 360) + 360) % 360) / 30);
  const moonSignName = RASHI_NAMES[moonSignIdx]?.englishName ?? "Taurus";

  const sunDegree = natalEphem.planets.Sun?.siderealLongitude ?? 0;
  const sunSignIdx = Math.floor((((sunDegree % 360) + 360) % 360) / 30);
  const sunSignName = RASHI_NAMES[sunSignIdx]?.englishName ?? "Leo";

  const lagnaDiag = SIGN_LORD_AWARENESS_BLIND_SPOT_MAP[ascSignName] ?? SIGN_LORD_AWARENESS_BLIND_SPOT_MAP["Aries"];
  const moonDiag = SIGN_LORD_AWARENESS_BLIND_SPOT_MAP[moonSignName] ?? SIGN_LORD_AWARENESS_BLIND_SPOT_MAP["Taurus"];
  const sunDiag = SIGN_LORD_AWARENESS_BLIND_SPOT_MAP[sunSignName] ?? SIGN_LORD_AWARENESS_BLIND_SPOT_MAP["Leo"];

  const all12 = Object.values(SIGN_LORD_AWARENESS_BLIND_SPOT_MAP);

  return {
    lagnaSignDiagnostic: lagnaDiag,
    moonSignDiagnostic: moonDiag,
    sunSignDiagnostic: sunDiag,
    all12SignDiagnostics: all12,
  };
}

/**
 * Master Dossier Synthesizer for Sessions 93, 94 & 95.
 */
export function generateRishiDrekkanaMasterReport(
  natalEphem: EphemerisResult,
  evaluationDate: Date = new Date()
): RishiDrekkanaMasterReport {
  const drekkanaRishiAllocations = evaluateDrekkanaRishiAllocation(natalEphem);
  const sacredLineageDeities = evaluateSacredLineageDeities(natalEphem);
  const lifeAxisEntryExit = evaluateLifeAxisAndEntryExit(natalEphem, evaluationDate);
  const deepDignityDegrees = evaluateDeepDignityDegrees(natalEphem);
  const nativeSignLordDiagnostics = evaluateSignLordAwarenessBlindSpots(natalEphem);

  const lagnaDiag = nativeSignLordDiagnostics.lagnaSignDiagnostic;
  const kula = sacredLineageDeities.kulaDevata;

  const holisticDossierSummary =
    `THE THREE RISHIS, SACRED LINEAGE DEITIES & SIGN LORD BLIND SPOTS DOSSIER (Sessions 93–95): ` +
    `Your planetary temperament is predominantly anchored by ${drekkanaRishiAllocations.dominantRishi} ` +
    `(${drekkanaRishiAllocations.naradaCount} Narada, ${drekkanaRishiAllocations.agastyaCount} Agastya, ${drekkanaRishiAllocations.durvasaCount} Durvasa). ` +
    `Under the Sacred Lineage Triad, your 4th House Kula Devata is placed in ${kula.signName} (${kula.element}), ` +
    `prescribing ${kula.element} propitiation: "${kula.elementalPropitiationProtocol}". ` +
    `Your 3rd House Life Axis indicates: "${lifeAxisEntryExit.thirdHouseChangeWave.waveStatusDescription}". ` +
    `For your Ascendant (${lagnaDiag.signName}), ruling lord ${lagnaDiag.rulingLord} confers innate competence in House ${lagnaDiag.lordExaltationHouseRelative} ` +
    `(${lagnaDiag.innateAwarenessCompetence}), while cautioning against the inherent blind spot in House ${lagnaDiag.lordDebilitationHouseRelative} ` +
    `(${lagnaDiag.subconsciousBlindSpot}). Aligning daily conduct with these archetypes activates Lord Shiva's science of spiritual self-correction.`;

  return {
    drekkanaRishiAllocations,
    sacredLineageDeities,
    lifeAxisEntryExit,
    deepDignityDegrees,
    nativeSignLordDiagnostics,
    holisticDossierSummary,
    // Direct convenience aliases:
    drekkanaPlanets: drekkanaRishiAllocations.planets,
    dominantRishi: drekkanaRishiAllocations.dominantRishi,
    kulaDevataPropitiation: kula.elementalPropitiationProtocol,
    thirdHouseChangeWaveStatus: lifeAxisEntryExit.thirdHouseChangeWave.waveStatusDescription,
    masterDossierSummary: holisticDossierSummary,
  };
}
