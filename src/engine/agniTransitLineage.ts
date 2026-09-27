/**
 * Classical Agni Trine Transits, Divine Lineage Triad & Zodiac Degree Matrix
 * References:
 * - Classical Gochara Shastra & Agni Tattva Principles (Syllabus Unit 90)
 * - Macro Zodiac Architecture, Gunas & Water Sign Tears Psychology (Syllabus Unit 91)
 * - Structural Sambandhas, Divine Lineage of Houses & Dual Sign Degree Bifurcation (Syllabus Unit 92)
 */

import { EphemerisResult, CelestialBodyPosition } from "./types";
import { RASHI_NAMES } from "./constants";

// ============================================================================
// 1. DATA STRUCTURES & INTERFACES
// ============================================================================

export type FireDimension = "Rajasic ('I to I')" | "Tamasic ('I to You')" | "Sattvic ('I to All')";
export type WaterSignTearsMode = "Cries for Self (Cancer)" | "Suppressed Volcanic Tears (Scorpio)" | "Wipes Tears of Others (Pisces)";
export type Modality = "Movable (Chara)" | "Fixed (Sthira)" | "Dual (Dwiswabhava)";
export type DualSignSubModality = "Fixed Sub-Tone (0°–15°)" | "Movable Sub-Tone (15°–30°)";

export interface AgniTrinePlanetStatus {
  planet: "Mars" | "Sun" | "Jupiter";
  currentSign: string;
  signIndex: number;
  degreeInSign: number;
  isFireSign: boolean;
  isOwnSignOrMoolatrikona: boolean;
  moolatrikonaSpan: string;
  dimension: FireDimension;
  archetype: string;
  consciousnessLevel: string;
  operativeVerdict: string;
}

export interface GangaJalDrishtiStatus {
  isJupiterInSagittarius: boolean;
  isMarsInAries: boolean;
  isSunInLeo: boolean;
  jupiterRetrograde: boolean;
  fifthAspectOnMars: boolean;
  ninthAspectOnSun: boolean;
  sanctificationDescription: string;
  retrogradeWarning: string;
  drishtiQualityBadge: "Pure Sattvic Ganga Jal" | "Polarized / Ideological" | "Partial Trine Aspect" | "Dormant / Inactive";
}

export interface MarsUranusAriesCycle {
  isMarsInAriesOrPisces: boolean;
  isUranusInAries: boolean;
  marsUranusOrbDegrees: number | null;
  isConjoinedInAries: boolean;
  cycleDescription: string;
  breakthroughPotential: string;
}

export interface AgniTrineTransitEvaluation {
  marsStatus: AgniTrinePlanetStatus;
  sunStatus: AgniTrinePlanetStatus;
  jupiterStatus: AgniTrinePlanetStatus;
  alignmentScorePercent: number; // 0 to 100
  tripleFireAlignmentActive: boolean;
  gangaJalDrishti: GangaJalDrishtiStatus;
  marsUranusCycle: MarsUranusAriesCycle;
  macroSynthesis: string;
}

export interface ZodiacGunaDistribution {
  rajasicCount: number; // Signs 1-4 (Aries - Cancer): "I to I"
  tamasicCount: number; // Signs 5-8 (Leo - Scorpio): "I to You"
  sattvicCount: number; // Signs 9-12 (Sagittarius - Pisces): "I to All"
  rajasicPlanets: string[];
  tamasicPlanets: string[];
  sattvicPlanets: string[];
  dominantGunaPerspective: "Rajasic ('I to I' Self-Preservation)" | "Tamasic ('I to You' Relational/Authority)" | "Sattvic ('I to All' Universal/Legacy)" | "Balanced Tri-Guna Equilibrium";
  psychologicalProfile: string;
}

export interface WaterSignTearsAnalysis {
  cancerOccupants: string[];
  scorpioOccupants: string[];
  piscesOccupants: string[];
  dominantTearsMode: WaterSignTearsMode;
  emotionalProcessingStyle: string;
  detailedSignPhala: {
    cancerPhala: string;
    scorpioPhala: string;
    piscesPhala: string;
  };
}

export interface HouseDeityInfo {
  houseNumber: 4 | 9 | 12;
  deityRole: "Kula Devata (Ancestral / Family Presiding Deity)" | "Dharma Devata (Higher Dharma & Righteous Guide)" | "Ishta Devata (Moksha & Spiritual Liberation Ideal)";
  signIndex: number;
  signName: string;
  houseLord: string;
  houseLordSign: string;
  houseOccupants: string[];
  recommendedDeityForm: string;
  sanskritMantra: string;
  esotericGuidance: string;
}

export interface DivineLineageTriad {
  kulaDevata: HouseDeityInfo;
  dharmaDevata: HouseDeityInfo;
  ishtaDevata: HouseDeityInfo;
  lineageSynthesis: string;
}

export interface DualSignDegreeBifurcationItem {
  planetOrLagna: string;
  signIndex: number;
  signName: string;
  longitude: number;
  degreeInSign: number;
  degreeSpan: "0°–15°" | "15°–30°";
  subModality: DualSignSubModality;
  behavioralManifestation: string;
}

export interface LagnaTemperamentAnalysis {
  lagnaSignName: string;
  lagnaModality: Modality;
  lagnaLordName: string;
  lagnaLordSignName: string;
  lagnaLordModality: Modality;
  temperamentPattern: "Movable + Movable (Constantly Evolving)" | "Movable + Fixed (Adaptive Exterior with Resolute Core)" | "Fixed + Fixed (Steadfast & Unyielding Law)" | "Fixed + Movable (Resolute Exterior, Agile Adaptability)" | "Dual Harmony (Versatile Analytical)";
  temperamentDescription: string;
  leadershipStyle: string;
  dualSignBifurcations: DualSignDegreeBifurcationItem[];
}

export interface GeometricSambandhaBreakdown {
  kendras: { houses: number[]; description: string; impact: string };
  trikonas: { houses: number[]; description: string; impact: string };
  upachayaGrowthAxis: { axis: "3/11"; description: string; impact: string };
  feederResourceAxis: { axis: "2/12"; description: string; impact: string };
  shadashtakaFrictionAxis: { axis: "6/8"; description: string; impact: string };
}

export interface AgniTransitLineageReport {
  agniTrines: AgniTrineTransitEvaluation;
  zodiacGunas: ZodiacGunaDistribution;
  waterSignTears: WaterSignTearsAnalysis;
  divineLineage: DivineLineageTriad;
  lagnaTemperament: LagnaTemperamentAnalysis;
  sambandhas: GeometricSambandhaBreakdown;
  executiveSummary: string;
}

// ============================================================================
// 2. HELPER UTILITIES
// ============================================================================

const DUAL_SIGNS = new Set([2, 5, 8, 11]); // Gemini, Virgo, Sagittarius, Pisces
const MOVABLE_SIGNS = new Set([0, 3, 6, 9]); // Aries, Cancer, Libra, Capricorn
const FIXED_SIGNS = new Set([1, 4, 7, 10]); // Taurus, Leo, Scorpio, Aquarius

const SIGN_LORDS: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
  4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars",
  8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter"
};

const PLANET_DEITY_MAPPINGS: Record<string, { deity: string; mantra: string }> = {
  Sun: { deity: "Lord Shiva / Surya Narayana / Gayatri", mantra: "Om Namah Shivaya / Om Suryaya Namaha" },
  Moon: { deity: "Goddess Gauri / Parvati / Lalita Tripurasundari", mantra: "Om Som Somaya Namaha / Om Shri Matre Namaha" },
  Mars: { deity: "Lord Kartikeya (Subrahmanya) / Lord Hanuman", mantra: "Om Ksham Ksheem Kshoum Sah Bhaumaya Namaha / Om Hanumate Namaha" },
  Mercury: { deity: "Lord Vishnu / Sri Krishna / Mahasaraswati", mantra: "Om Namo Bhagavate Vasudevaya / Om Budhaya Namaha" },
  Jupiter: { deity: "Lord Dakshinamurthy / Shiva / Brihaspati / Dattatreya", mantra: "Om Dakshinamurthaye Namaha / Om Gram Greem Groum Sah Gurave Namaha" },
  Venus: { deity: "Mahalakshmi / Annapurna / Radharani", mantra: "Om Shreem Mahalakshmyai Namaha / Om Shukraya Namaha" },
  Saturn: { deity: "Lord Kurma / Bhairava / Shani Dev / Hanuman", mantra: "Om Sham Shanaishcharaya Namaha / Om Namo Bhagavate Kurmadevaya" },
  Rahu: { deity: "Goddess Durga / Chhinnamasta / Bhairava", mantra: "Om Dum Durgayai Namaha / Om Rahave Namaha" },
  Ketu: { deity: "Lord Ganesha / Matsya Avatar / Mahamrityunjaya", mantra: "Om Gam Ganapataye Namaha / Om Ketave Namaha" },
};

function getModality(signIdx: number): Modality {
  if (MOVABLE_SIGNS.has(signIdx)) return "Movable (Chara)";
  if (FIXED_SIGNS.has(signIdx)) return "Fixed (Sthira)";
  return "Dual (Dwiswabhava)";
}

// ============================================================================
// 3. CORE EVALUATORS
// ============================================================================

/**
 * Evaluates the Agni Trine Transits (Session 90)
 * Evaluates Mars in Aries, Sun in Leo, Jupiter in Sagittarius, Ganga Jal Drishti, and Mars-Uranus.
 */
export function evaluateAgniTrineTransits(
  natalEphem: EphemerisResult,
  transitEphem?: EphemerisResult
): AgniTrineTransitEvaluation {
  const ephem = transitEphem || natalEphem;
  const mars = ephem.planets.Mars;
  const sun = ephem.planets.Sun;
  const jupiter = ephem.planets.Jupiter;
  const uranus = ephem.planets.Uranus;

  // 1. Mars in Aries Evaluation
  const marsSignIdx = mars ? mars.rashi.index : 0;
  const marsDegInSign = mars ? (mars.siderealLongitude % 30) : 0;
  const isMarsAries = marsSignIdx === 0;
  const isMarsMoolatrikona = isMarsAries && marsDegInSign <= 12;

  const marsStatus: AgniTrinePlanetStatus = {
    planet: "Mars",
    currentSign: mars ? mars.rashi.englishName : "Aries",
    signIndex: marsSignIdx,
    degreeInSign: Number(marsDegInSign.toFixed(2)),
    isFireSign: marsSignIdx === 0 || marsSignIdx === 4 || marsSignIdx === 8,
    isOwnSignOrMoolatrikona: isMarsAries,
    moolatrikonaSpan: "Aries 0°00' - 12°00' (Own Sign: 12°00' - 30°00')",
    dimension: "Rajasic ('I to I')",
    archetype: "Army Commander (Senapati) / Chief of Police / Pure Warrior",
    consciousnessLevel: "Primal Duty, Physical Courage, and Direct Execution without sentimental compromise.",
    operativeVerdict: isMarsMoolatrikona
      ? "Mars resides in its supreme Moolatrikona room in Aries (0°–12°), operating with fierce, unfiltered resolve and zero hesitation."
      : isMarsAries
      ? "Mars resides in its own sign Aries (12°–30°), exercising sovereign tactical command and courageous forward momentum."
      : `Mars transits ${mars?.rashi.englishName || "Aries"}, directing drive into ${mars?.house || 1}st house terrain.`,
  };

  // 2. Sun in Leo Evaluation
  const sunSignIdx = sun ? sun.rashi.index : 4;
  const sunDegInSign = sun ? (sun.siderealLongitude % 30) : 0;
  const isSunLeo = sunSignIdx === 4;
  const isSunMoolatrikona = isSunLeo && sunDegInSign <= 10;

  const sunStatus: AgniTrinePlanetStatus = {
    planet: "Sun",
    currentSign: sun ? sun.rashi.englishName : "Leo",
    signIndex: sunSignIdx,
    degreeInSign: Number(sunDegInSign.toFixed(2)),
    isFireSign: sunSignIdx === 0 || sunSignIdx === 4 || sunSignIdx === 8,
    isOwnSignOrMoolatrikona: isSunLeo,
    moolatrikonaSpan: "Leo 0°00' - 10°00' (Own Sign: 10°00' - 30°00')",
    dimension: "Tamasic ('I to You')",
    archetype: "The Sovereign King (Raja) / State Executive / Sacrificial Monarch",
    consciousnessLevel: "Directed authority over others, duty of protection, governance, and royal self-sacrifice.",
    operativeVerdict: isSunMoolatrikona
      ? "Sun commands its highest Moolatrikona throne in Leo (0°–10°), radiating absolute authority, constitutional pride, and selfless statecraft."
      : isSunLeo
      ? "Sun sits in its home palace in Leo (10°–30°), expressing sovereign nobility, magnetic presence, and unshakeable executive will."
      : `Sun shines through ${sun?.rashi.englishName || "Leo"}, illuminating ${sun?.house || 5}th house affairs.`,
  };

  // 3. Jupiter in Sagittarius Evaluation
  const jupSignIdx = jupiter ? jupiter.rashi.index : 8;
  const jupDegInSign = jupiter ? (jupiter.siderealLongitude % 30) : 0;
  const isJupSagittarius = jupSignIdx === 8;
  const isJupMoolatrikona = isJupSagittarius && jupDegInSign <= 10;

  const jupiterStatus: AgniTrinePlanetStatus = {
    planet: "Jupiter",
    currentSign: jupiter ? jupiter.rashi.englishName : "Sagittarius",
    signIndex: jupSignIdx,
    degreeInSign: Number(jupDegInSign.toFixed(2)),
    isFireSign: jupSignIdx === 0 || jupSignIdx === 4 || jupSignIdx === 8,
    isOwnSignOrMoolatrikona: isJupSagittarius,
    moolatrikonaSpan: "Sagittarius 0°00' - 10°00' (Own Sign: 10°00' - 30°00')",
    dimension: "Sattvic ('I to All')",
    archetype: "Royal Priest (Rajpurohit) / Supreme Guru / Mentor of Civilization",
    consciousnessLevel: "Universal collective consciousness, divine philosophy, ethical compass, and spiritual guardianship.",
    operativeVerdict: isJupMoolatrikona
      ? "Jupiter presides over its Moolatrikona ashram in Sagittarius (0°–10°), bestowing uncorrupted Vedic wisdom, legal protection, and divine order."
      : isJupSagittarius
      ? "Jupiter abides in its own sanctuary in Sagittarius (10°–30°), radiating philanthropic benevolence and philosophical clarity."
      : `Jupiter transits ${jupiter?.rashi.englishName || "Sagittarius"}, blessing ${jupiter?.house || 9}th house themes.`,
  };

  // 4. Alignment Score & Concurrence
  let firePoints = 0;
  if (isMarsAries) firePoints += 33.33;
  if (isSunLeo) firePoints += 33.33;
  if (isJupSagittarius) firePoints += 33.34;
  const alignmentScorePercent = Math.min(100, Math.round(firePoints));
  const tripleFireAlignmentActive = isMarsAries && isSunLeo && isJupSagittarius;

  // 5. Jupiter Ganga Jal Drishti
  const jupRetro = Boolean(jupiter?.isRetrograde);
  const fifthAspectOnMars = isJupSagittarius && isMarsAries; // 5th aspect from Sagittarius is Aries
  const ninthAspectOnSun = isJupSagittarius && isSunLeo;     // 9th aspect from Sagittarius is Leo

  let drishtiQualityBadge: GangaJalDrishtiStatus["drishtiQualityBadge"] = "Dormant / Inactive";
  let sanctificationDesc = "";
  let retroWarning = "";

  if (isJupSagittarius) {
    if (jupRetro) {
      drishtiQualityBadge = "Polarized / Ideological";
      sanctificationDesc = "Jupiter casts 5th and 9th trinal aspects onto Aries and Leo while retrograde, causing ideological rigidity, self-righteous crusades, and dogmatic friction until turning direct.";
      retroWarning = "⚠️ Retrograde Jupiter Alert: The 'Ganga Jal' moral compass can become inverted into fanatical certainty or excessive moralizing. Re-anchor in humble discernment.";
    } else {
      drishtiQualityBadge = "Pure Sattvic Ganga Jal";
      sanctificationDesc = "Jupiter casts its pristine 5th aspect on Mars (Aries) and 9th aspect on Sun (Leo). Like sacred Ganga water sanctifying sacrificial fire, Guru's gaze purifies martial force and executive authority with truth, natural law, and righteousness.";
      retroWarning = "Jupiter is in direct motion, ensuring harmonious ethical moderation over all aggressive or executive initiatives.";
    }
  } else {
    drishtiQualityBadge = "Dormant / Inactive";
    sanctificationDesc = `Jupiter is transiting ${jupiter?.rashi.englishName || "its sign"}, outside Sagittarius. Trinal Ganga Jal sanctification over the Aries-Leo axis is inactive.`;
    retroWarning = "Standard planetary aspects apply.";
  }

  const gangaJalDrishti: GangaJalDrishtiStatus = {
    isJupiterInSagittarius: isJupSagittarius,
    isMarsInAries: isMarsAries,
    isSunInLeo: isSunLeo,
    jupiterRetrograde: jupRetro,
    fifthAspectOnMars,
    ninthAspectOnSun,
    sanctificationDescription: sanctificationDesc,
    retrogradeWarning: retroWarning,
    drishtiQualityBadge,
  };

  // 6. Mars-Uranus Aries Revolutionary Cycle
  const isMarsAriesOrPisces = marsSignIdx === 0 || marsSignIdx === 11;
  const uranusSignIdx = uranus ? uranus.rashi.index : -1;
  const isUranusAries = uranusSignIdx === 0;
  let marsUranusOrb: number | null = null;
  let isConjoinedInAries = false;

  if (mars && uranus && marsSignIdx === 0 && uranusSignIdx === 0) {
    marsUranusOrb = Math.abs(mars.siderealLongitude - uranus.siderealLongitude);
    isConjoinedInAries = marsUranusOrb <= 10;
  }

  const marsUranusCycle: MarsUranusAriesCycle = {
    isMarsInAriesOrPisces: isMarsAriesOrPisces,
    isUranusInAries: isUranusAries,
    marsUranusOrbDegrees: marsUranusOrb !== null ? Number(marsUranusOrb.toFixed(2)) : null,
    isConjoinedInAries,
    cycleDescription: isConjoinedInAries
      ? `Mars conjoins Uranus (Harshal) in Aries within a tight ${marsUranusOrb?.toFixed(2)}° orb, sparking sudden revolutionary breakthroughs, disruptive techno-military shifts, and volatility.`
      : isMarsAriesOrPisces
      ? "Mars undergoes its prolonged transit across the Aries-Pisces threshold, signaling deep cyclical rewiring of willpower and courageous leadership."
      : "Mars is transiting outside the Aries-Pisces revolutionary crucible.",
    breakthroughPotential: isConjoinedInAries
      ? "High Revolutionary Breakthrough Potential: Sudden unexpected opportunities emerge through technological innovation, calculated audacity, and breaking obsolete systemic bottlenecks."
      : "Standard martial kinetic drive.",
  };

  // 7. Macro Synthesis
  const macroSynthesis = tripleFireAlignmentActive
    ? "🌟 Rare Sovereign Agni Trine Alignment Active: Mars (Aries), Sun (Leo), and Jupiter (Sagittarius) simultaneously occupy their Moolatrikona / own domiciles. This rare cosmic concurrence unleashes pure, unfiltered Dharma fire—uniting personal duty ('I to I'), executive leadership ('I to You'), and universal wisdom ('I to All')."
    : `Agni Trine Potency: ${alignmentScorePercent}%. Mars in ${marsStatus.currentSign}, Sun in ${sunStatus.currentSign}, Jupiter in ${jupiterStatus.currentSign}. ${gangaJalDrishti.sanctificationDescription}`;

  return {
    marsStatus,
    sunStatus,
    jupiterStatus,
    alignmentScorePercent,
    tripleFireAlignmentActive,
    gangaJalDrishti,
    marsUranusCycle,
    macroSynthesis,
  };
}

/**
 * Evaluates the Zodiac Gunas & Perspectives Matrix (Session 91)
 * Signs 1-4: Rajasic ("I to I")
 * Signs 5-8: Tamasic ("I to You")
 * Signs 9-12: Sattvic ("I to All")
 */
export function evaluateZodiacGunasAndPerspectives(natalEphem: EphemerisResult): ZodiacGunaDistribution {
  const rajasicPlanets: string[] = [];
  const tamasicPlanets: string[] = [];
  const sattvicPlanets: string[] = [];

  const grahas = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  for (const name of grahas) {
    const p = natalEphem.planets[name];
    if (!p) continue;
    const signIdx = p.rashi.index;

    if (signIdx >= 0 && signIdx <= 3) {
      rajasicPlanets.push(`${name} (${p.rashi.englishName})`);
    } else if (signIdx >= 4 && signIdx <= 7) {
      tamasicPlanets.push(`${name} (${p.rashi.englishName})`);
    } else if (signIdx >= 8 && signIdx <= 11) {
      sattvicPlanets.push(`${name} (${p.rashi.englishName})`);
    }
  }

  const rajasicCount = rajasicPlanets.length;
  const tamasicCount = tamasicPlanets.length;
  const sattvicCount = sattvicPlanets.length;

  let dominant: ZodiacGunaDistribution["dominantGunaPerspective"] = "Balanced Tri-Guna Equilibrium";
  let profile = "";

  if (rajasicCount > tamasicCount && rajasicCount > sattvicCount) {
    dominant = "Rajasic ('I to I' Self-Preservation)";
    profile = `With ${rajasicCount} planets concentrated in Signs 1–4 (Aries through Cancer), your primary karmic perspective is 'I to I'. Consciousness focuses intensely on personal cultivation, physical health, autonomous mastery, and building a secure domestic foundation.`;
  } else if (tamasicCount > rajasicCount && tamasicCount > sattvicCount) {
    dominant = "Tamasic ('I to You' Relational/Authority)";
    profile = `With ${tamasicCount} planets concentrated in Signs 5–8 (Leo through Scorpio), your primary karmic perspective is 'I to You'. Consciousness revolves around dynamic one-on-one engagements, leadership over others, contractual negotiations, shared resources, and overcoming adversarial friction.`;
  } else if (sattvicCount > rajasicCount && sattvicCount > tamasicCount) {
    dominant = "Sattvic ('I to All' Universal/Legacy)";
    profile = `With ${sattvicCount} planets concentrated in Signs 9–12 (Sagittarius through Pisces), your primary karmic perspective is 'I to All'. Consciousness operates on a macro wavelength—dedicated to societal institutions, collective welfare, philosophical legacy, and spiritual transcendence.`;
  } else {
    dominant = "Balanced Tri-Guna Equilibrium";
    profile = `Planets are evenly distributed across the 3 perspective quadrants (${rajasicCount} Rajasic, ${tamasicCount} Tamasic, ${sattvicCount} Sattvic), enabling versatile cognitive transitions between personal focus, partnership dynamics, and societal leadership.`;
  }

  return {
    rajasicCount,
    tamasicCount,
    sattvicCount,
    rajasicPlanets,
    tamasicPlanets,
    sattvicPlanets,
    dominantGunaPerspective: dominant,
    psychologicalProfile: profile,
  };
}

/**
 * Evaluates the Water Sign Emotional Tears Psychology (Session 91)
 * Cancer: Cries for oneself
 * Scorpio: Suppresses tears until volcanic transformation erupts
 * Pisces: Wipes the tears of others (universal compassion)
 */
export function evaluateWaterSignTears(natalEphem: EphemerisResult): WaterSignTearsAnalysis {
  const cancerOccupants: string[] = [];
  const scorpioOccupants: string[] = [];
  const piscesOccupants: string[] = [];

  const grahas = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  for (const name of grahas) {
    const p = natalEphem.planets[name];
    if (!p) continue;
    if (p.rashi.index === 3) cancerOccupants.push(name);
    if (p.rashi.index === 7) scorpioOccupants.push(name);
    if (p.rashi.index === 11) piscesOccupants.push(name);
  }

  // Weight Moon, Lagna Lord, and Ascendant heavily
  const ascSign = natalEphem.ascendant.rashi.index;
  const moonSign = natalEphem.planets.Moon?.rashi.index;

  let cancerWeight = cancerOccupants.length;
  let scorpioWeight = scorpioOccupants.length;
  let piscesWeight = piscesOccupants.length;

  if (ascSign === 3) cancerWeight += 2;
  if (ascSign === 7) scorpioWeight += 2;
  if (ascSign === 11) piscesWeight += 2;

  if (moonSign === 3) cancerWeight += 3;
  if (moonSign === 7) scorpioWeight += 3;
  if (moonSign === 11) piscesWeight += 3;

  let dominantMode: WaterSignTearsMode = "Wipes Tears of Others (Pisces)";
  let emotionalStyle = "";

  if (cancerWeight >= scorpioWeight && cancerWeight >= piscesWeight && cancerWeight > 0) {
    dominantMode = "Cries for Self (Cancer)";
    emotionalStyle = "Emotional processing is deeply personal and domestic. You feel hurts acutely, shed tears for personal vulnerability, and heal through nurturing, maternal comfort, and safe sanctuary.";
  } else if (scorpioWeight >= cancerWeight && scorpioWeight >= piscesWeight && scorpioWeight > 0) {
    dominantMode = "Suppressed Volcanic Tears (Scorpio)";
    emotionalStyle = "Emotional processing is stoic, private, and subterranean. You rarely cry in public, holding pain in absolute silence until accumulated betrayal or emotional pressure triggers a volcanic, life-altering psychological purge.";
  } else {
    dominantMode = "Wipes Tears of Others (Pisces)";
    emotionalStyle = "Emotional processing is oceanic and deeply altruistic. You transcend personal grievance to wipe away the tears of suffering beings, finding catharsis and spiritual salvation through universal empathy and selfless compassion.";
  }

  return {
    cancerOccupants,
    scorpioOccupants,
    piscesOccupants,
    dominantTearsMode: dominantMode,
    emotionalProcessingStyle: emotionalStyle,
    detailedSignPhala: {
      cancerPhala: cancerOccupants.length > 0
        ? `Cancer hosts ${cancerOccupants.join(", ")}: Vulnerable emotional roots; tears release domestic and inner-child grief.`
        : "Cancer is unoccupied: Domestic emotional flow operates without heavy nodal or planetary friction.",
      scorpioPhala: scorpioOccupants.length > 0
        ? `Scorpio hosts ${scorpioOccupants.join(", ")}: Subterranean psychic endurance; unspoken tears undergo intense alchemical transformation.`
        : "Scorpio is unoccupied: Emotional transformation unfolds smoothly without protracted subterranean brooding.",
      piscesPhala: piscesOccupants.length > 0
        ? `Pisces hosts ${piscesOccupants.join(", ")}: Cosmic compassion portal; tears dissolve personal ego to serve the collective spiritual healing.`
        : "Pisces is unoccupied: Spiritual transcendence manifests through structured philosophy rather than oceanic emotional absorption.",
    },
  };
}

/**
 * Evaluates the Divine Lineage of Houses (Deity Triad) (Session 92)
 * 4th House: Kula Devata (Ancestral / Family Presiding Deity)
 * 9th House: Dharma Devata (Higher Dharma & Righteous Guide)
 * 12th House: Ishta Devata (Personal Divine Ideal for Moksha)
 */
export function evaluateDivineLineageTriad(natalEphem: EphemerisResult): DivineLineageTriad {
  const ascSign = natalEphem.ascendant.rashi.index;

  const buildHouseDeity = (
    houseNum: 4 | 9 | 12,
    role: HouseDeityInfo["deityRole"]
  ): HouseDeityInfo => {
    const signIdx = (ascSign + (houseNum - 1)) % 12;
    const signName = RASHI_NAMES[signIdx].englishName;
    const houseLord = SIGN_LORDS[signIdx];
    const lordPlanet = natalEphem.planets[houseLord];
    const lordSign = lordPlanet ? lordPlanet.rashi.englishName : signName;

    // Find occupants
    const occupants: string[] = [];
    for (const [name, p] of Object.entries(natalEphem.planets)) {
      if (p && p.house === houseNum) {
        occupants.push(name);
      }
    }

    // Determine primary presiding planet:
    // If house has occupants, strongest benefic or first occupant sets tone, else house lord
    const primePlanet = occupants.length > 0 ? occupants[0] : houseLord;
    const deityMeta = PLANET_DEITY_MAPPINGS[primePlanet] || PLANET_DEITY_MAPPINGS.Jupiter;

    let esotericGuidance = "";
    if (houseNum === 4) {
      esotericGuidance = `Your 4th house Kula Devata is presided over by ${primePlanet} (${deityMeta.deity}). Maintaining an ancestral altar at home, lighting a ghee lamp on Tuesdays/Fridays, and honoring family lineage traditions anchors lifelong emotional peace and property protection.`;
    } else if (houseNum === 9) {
      esotericGuidance = `Your 9th house Dharma Devata is guided by ${primePlanet} (${deityMeta.deity}). Propitiating this deity aligns you with righteous mentors (Gurus), unlocks higher ethical wisdom, and dissolves stubborn obstacles in fortune and public duty.`;
    } else {
      esotericGuidance = `Your 12th house Ishta Devata is crowned by ${primePlanet} (${deityMeta.deity}). Chanting the sacred mantra '${deityMeta.mantra}' during dawn meditation purifies the subconscious mind and illuminates your soul's direct pathway to liberation (Moksha).`;
    }

    return {
      houseNumber: houseNum,
      deityRole: role,
      signIndex: signIdx,
      signName,
      houseLord,
      houseLordSign: lordSign,
      houseOccupants: occupants,
      recommendedDeityForm: deityMeta.deity,
      sanskritMantra: deityMeta.mantra,
      esotericGuidance,
    };
  };

  const kulaDevata = buildHouseDeity(4, "Kula Devata (Ancestral / Family Presiding Deity)");
  const dharmaDevata = buildHouseDeity(9, "Dharma Devata (Higher Dharma & Righteous Guide)");
  const ishtaDevata = buildHouseDeity(12, "Ishta Devata (Moksha & Spiritual Liberation Ideal)");

  const lineageSynthesis = `Divine Deity Lineage Triad: 4th House Kula Devata is ${kulaDevata.recommendedDeityForm} (Family Roots), 9th House Dharma Devata is ${dharmaDevata.recommendedDeityForm} (Ethical Compass), and 12th House Ishta Devata is ${ishtaDevata.recommendedDeityForm} (Moksha Sanctuary). Honoring this sacred trinity establishes complete spiritual and worldly equilibrium.`;

  return {
    kulaDevata,
    dharmaDevata,
    ishtaDevata,
    lineageSynthesis,
  };
}

/**
 * Evaluates Lagna & Lagna Lord Behavioral Temperament & Dual Sign 15° Split (Session 92)
 * Movable/Fixed/Dual combinations + 0°-15° Fixed vs 15°-30° Movable in Dual signs.
 */
export function evaluateLagnaTemperamentAndDualSignSplit(natalEphem: EphemerisResult): LagnaTemperamentAnalysis {
  const lagnaSignIdx = natalEphem.ascendant.rashi.index;
  const lagnaSignName = natalEphem.ascendant.rashi.englishName;
  const lagnaModality = getModality(lagnaSignIdx);

  const lagnaLord = SIGN_LORDS[lagnaSignIdx];
  const lordPlanet = natalEphem.planets[lagnaLord];
  const lordSignIdx = lordPlanet ? lordPlanet.rashi.index : lagnaSignIdx;
  const lordSignName = lordPlanet ? lordPlanet.rashi.englishName : lagnaSignName;
  const lordModality = getModality(lordSignIdx);

  let temperamentPattern: LagnaTemperamentAnalysis["temperamentPattern"] = "Dual Harmony (Versatile Analytical)";
  let desc = "";
  let leadership = "";

  if (lagnaModality === "Movable (Chara)" && lordModality === "Movable (Chara)") {
    temperamentPattern = "Movable + Movable (Constantly Evolving)";
    desc = "Both physical vehicle (Lagna) and core pilot (Lagna Lord) are Movable. You possess exceptional agility, forward kinetic drive, and continuous real-time adaptability. You never stagnate in outdated structures.";
    leadership = "Agile Pioneer: Leads from the front through rapid iteration, swift tactical pivots, and pioneering new frontiers.";
  } else if (lagnaModality === "Movable (Chara)" && lordModality === "Fixed (Sthira)") {
    temperamentPattern = "Movable + Fixed (Adaptive Exterior with Resolute Core)";
    desc = "Movable Lagna grants swift, charming external agility, while the Fixed Lagna Lord holds unshakeable, resolute core convictions. You adapt seamlessly to shifting social tides without ever compromising your bedrock principles—the classic hallmark of pragmatic statesmen and visionary entrepreneurs.";
    leadership = "Pragmatic Statesman: Externally diplomatic and flexible, but completely uncompromising on fundamental long-term strategy.";
  } else if (lagnaModality === "Fixed (Sthira)" && lordModality === "Fixed (Sthira)") {
    temperamentPattern = "Fixed + Fixed (Steadfast & Unyielding Law)";
    desc = "Both physical vehicle and pilot are Fixed. Once you make a firm decision, it becomes an absolute law in your mind. You possess monumental endurance, rock-solid loyalty, and stubborn resistance to external pressure.";
    leadership = "Steadfast Anchor: Leads through unshakeable consistency, monumental institutional resilience, and immovable resolve.";
  } else if (lagnaModality === "Fixed (Sthira)" && lordModality === "Movable (Chara)") {
    temperamentPattern = "Fixed + Movable (Resolute Exterior, Agile Adaptability)";
    desc = "Presents an immovable, majestic exterior while maintaining nimble mental versatility to deploy new methods when circumstances demand.";
    leadership = "Strategic Builder: Projects rock-solid authority while orchestrating dynamic tactical evolutions.";
  } else {
    temperamentPattern = "Dual Harmony (Versatile Analytical)";
    desc = "Governed by Dual sign dynamics. You possess multifaceted intellectual depth, weighing alternate perspectives with ease and synthesizing paradoxical concepts.";
    leadership = "Philosophical Polymath: Leads through intellectual nuance, comprehensive synthesis, and dual-track problem solving.";
  }

  // Dual Sign 15° Degree Bifurcations
  const dualSignBifurcations: DualSignDegreeBifurcationItem[] = [];

  // Check Lagna
  if (DUAL_SIGNS.has(lagnaSignIdx)) {
    const degInSign = natalEphem.ascendant.siderealLongitude % 30;
    const isFirst15 = degInSign < 15;
    dualSignBifurcations.push({
      planetOrLagna: "Ascendant (Lagna)",
      signIndex: lagnaSignIdx,
      signName: lagnaSignName,
      longitude: Number(natalEphem.ascendant.siderealLongitude.toFixed(2)),
      degreeInSign: Number(degInSign.toFixed(2)),
      degreeSpan: isFirst15 ? "0°–15°" : "15°–30°",
      subModality: isFirst15 ? "Fixed Sub-Tone (0°–15°)" : "Movable Sub-Tone (15°–30°)",
      behavioralManifestation: isFirst15
        ? `Lagna sits at ${degInSign.toFixed(2)}° in the first 15° of ${lagnaSignName}: Expresses Sthira (Fixed) steadfastness, concentration, and resistance to erratic change.`
        : `Lagna sits at ${degInSign.toFixed(2)}° in the second 15° of ${lagnaSignName}: Expresses Chara (Movable) agility, curiosity, and rapid behavioral adaptation.`,
    });
  }

  // Check Grahas in Dual signs
  const grahas = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  for (const name of grahas) {
    const p = natalEphem.planets[name];
    if (!p) continue;
    const sIdx = p.rashi.index;
    if (DUAL_SIGNS.has(sIdx)) {
      const deg = p.siderealLongitude % 30;
      const isFirst15 = deg < 15;
      dualSignBifurcations.push({
        planetOrLagna: name,
        signIndex: sIdx,
        signName: p.rashi.englishName,
        longitude: Number(p.siderealLongitude.toFixed(2)),
        degreeInSign: Number(deg.toFixed(2)),
        degreeSpan: isFirst15 ? "0°–15°" : "15°–30°",
        subModality: isFirst15 ? "Fixed Sub-Tone (0°–15°)" : "Movable Sub-Tone (15°–30°)",
        behavioralManifestation: isFirst15
          ? `${name} is placed in the first 15° (${deg.toFixed(2)}°) of ${p.rashi.englishName}: Manifests through sustained, grounded, and persistent expression of its karakatvas.`
          : `${name} is placed in the second 15° (${deg.toFixed(2)}°) of ${p.rashi.englishName}: Manifests through dynamic, mobile, and versatile expression of its karakatvas.`,
      });
    }
  }

  return {
    lagnaSignName,
    lagnaModality,
    lagnaLordName: lagnaLord,
    lagnaLordSignName: lordSignName,
    lagnaLordModality: lordModality,
    temperamentPattern,
    temperamentDescription: desc,
    leadershipStyle: leadership,
    dualSignBifurcations,
  };
}

/**
 * Geometric Sambandhas Breakdown (Session 92)
 */
export function evaluateGeometricSambandhas(): GeometricSambandhaBreakdown {
  return {
    kendras: {
      houses: [1, 4, 7, 10],
      description: "Pillars of Power & Urgent Action Triggers (1st, 4th, 7th, 10th Houses)",
      impact: "Challenges the status quo, creates acute decision crucibles, and demands decisive real-world execution.",
    },
    trikonas: {
      houses: [1, 5, 9],
      description: "Dharma & Effortless Harmony Trines (1st, 5th, 9th Houses)",
      impact: "Provides natural grace, past-life merit (Purva Punya), mutual planetary support, and smooth fruition of endeavors.",
    },
    upachayaGrowthAxis: {
      axis: "3/11",
      description: "Inspiration & Incremental Growth Engine (3rd & 11th Houses)",
      impact: "Upachaya axis drives continuous self-improvement, networking, valor, and compounding material gains over time.",
    },
    feederResourceAxis: {
      axis: "2/12",
      description: "Back-End Feeder & Sustenance Support (12th Feeds the 2nd)",
      impact: "The 12th house (behind) provides foundational reserves, subconscious capital, and feeder support to the 2nd house (ahead), preventing financial collapse.",
    },
    shadashtakaFrictionAxis: {
      axis: "6/8",
      description: "Karmic Friction, Vulnerability & Inevitable Crisis (6th/8th Axis)",
      impact: "Generates direct opposition, unmasks hidden flaws, enforces debt settlements, and mandates profound transformation.",
    },
  };
}

// ============================================================================
// 4. MASTER SYNTHESIS & REPORT GENERATOR
// ============================================================================

export function generateAgniTransitLineageReport(
  natalEphem: EphemerisResult,
  transitEphem?: EphemerisResult
): AgniTransitLineageReport {
  const agniTrines = evaluateAgniTrineTransits(natalEphem, transitEphem);
  const zodiacGunas = evaluateZodiacGunasAndPerspectives(natalEphem);
  const waterSignTears = evaluateWaterSignTears(natalEphem);
  const divineLineage = evaluateDivineLineageTriad(natalEphem);
  const lagnaTemperament = evaluateLagnaTemperamentAndDualSignSplit(natalEphem);
  const sambandhas = evaluateGeometricSambandhas();

  const executiveSummary = [
    `🔥 **Agni Trine Transits:** Mars in ${agniTrines.marsStatus.currentSign} (${agniTrines.marsStatus.dimension}), Sun in ${agniTrines.sunStatus.currentSign} (${agniTrines.sunStatus.dimension}), Jupiter in ${agniTrines.jupiterStatus.currentSign} (${agniTrines.jupiterStatus.dimension}). Alignment Score: ${agniTrines.alignmentScorePercent}%. ${agniTrines.gangaJalDrishti.sanctificationDescription}`,
    `☸️ **Zodiac Perspective:** Dominant mode is ${zodiacGunas.dominantGunaPerspective} (${zodiacGunas.rajasicCount} Rajasic / ${zodiacGunas.tamasicCount} Tamasic / ${zodiacGunas.sattvicCount} Sattvic).`,
    `💧 **Water Sign Tears:** ${waterSignTears.dominantTearsMode}. ${waterSignTears.emotionalProcessingStyle}`,
    `🕉️ **Divine Lineage Triad:** 4th H Kula Devata: **${divineLineage.kulaDevata.recommendedDeityForm}**, 9th H Dharma Devata: **${divineLineage.dharmaDevata.recommendedDeityForm}**, 12th H Ishta Devata: **${divineLineage.ishtaDevata.recommendedDeityForm}**.`,
    `🧭 **Lagna Temperament:** ${lagnaTemperament.temperamentPattern}. ${lagnaTemperament.temperamentDescription}`,
  ].join("\n\n");

  return {
    agniTrines,
    zodiacGunas,
    waterSignTears,
    divineLineage,
    lagnaTemperament,
    sambandhas,
    executiveSummary,
  };
}
