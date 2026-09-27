/**
 * ============================================================================
 * MEDHAJ ASTRO RAHU-KETU TRANSIT, ROHINI BHEDANA & SACRED REMEDIES SUITE
 * ============================================================================
 * Comprehensive implementation of Medhaj Astro Sessions 83, 88 & 89:
 * 
 * 1. Session 83: Rahu – Ketu Transit (The Nadi "Destiny Breakers" & Taurus/Scorpio Axis)
 *    - Nadi Archetype: Rahu and Ketu as "Destiny Breakers" commanding human karma.
 *    - Rahu (Head): Worldly amplification (Bhoga), future cravings, digital media, artificial projections.
 *    - Ketu (Tail): Contraction to zero (Shunya), past-life Prarabdha karma, detachment, Moksha.
 *    - Previous Phase (Moola / Gemini): Ketu in Moola (virus root), Rahu in Gemini (global communication/fear amplification).
 *    - Taurus / Scorpio Axis Shift:
 *      * Rahu in Taurus (Kalapurusha 2nd house): Bank balance, food supply chain, agriculture, inflation, survival anxiety.
 *      * Ketu in Scorpio (Kalapurusha 8th house): Destroys unearned/ill-gotten wealth (Asatya Dhana), subterranean secrets, dissolves irrational fear via direct confrontation.
 *    - Anatomy of Fear: Confronting phobias directly to break illusion.
 * 
 * 2. Session 88: Cosmic Reset Timelines, 20-Year Great Conjunction & Ayurvedic Nasal Shield
 *    - Civilizational Reset Timeline:
 *      * Dec 2019 – Mar 2020: The "Teaser" (eclipses, initial viral outbreak).
 *      * Mid-2020: The "Trailer" (Jupiter preliminary retrograde dip into Capricorn, lockdown turbulence).
 *      * Post-Nov 16, 2020: The "Main Picture" (Jupiter direct in Capricorn alongside Saturn and Pluto).
 *    - Pluto in Capricorn: Mass destruction of corrupt/obsolete structures; F.E.A.R. = "False Evidence Appearing Real".
 *    - The 20-Year Great Conjunction (Jupiter & Saturn in Capricorn):
 *      * Jupiter = Inhaling / Prana Vayu (expansion); Saturn = Exhaling / Apana Vayu (contraction).
 *      * Historical cycle: 1960–1962 (Indo-China era), 1980, 2000, 2020.
 *      * Exact Conjunction at 6° Capricorn (Uttara Ashadha Nakshatra): Arduous mountain forest climb & geopolitical friction.
 *      * Debilitated Jupiter: Framework strain; warns against over-relying exclusively on quick-fix pharmaceuticals; priority on bodily immunity (Jiva).
 *    - Sacred Ayurvedic Nasal Drops Remedy:
 *      * 6 drops of pure mustard oil (Sarson ka Tel) into nostrils daily between 4:00 PM and 6:00 PM (or post-sunset).
 *      * Nasal passage/breath = Mars & Jupiter; 4-6 PM = Mars hour; Mustard oil = Saturn; 6 drops = Venus/Sanjeevani.
 *    - Heaviest dark cycle duration until Nov/Dec 2021 when Jupiter enters Aquarius.
 * 
 * 3. Session 89: Rohini Shakata Bhedana, Anna Tyaga & Moon Primacy
 *    - Rahu's Retrograde Transit in Taurus: Mrigashira -> Rohini -> Krittika.
 *    - Legend of King Dasharatha & Rohini Shakata Bhedana:
 *      * Saturn piercing cart of Rohini Nakshatra causes drought & famine (Durbhiksha).
 *      * Dasharatha composed Dasharatha Shani Stuti (Nilanjana Samabhasam...) and challenged Saturn; obtained boon of mitigation via self-restraint.
 *    - Rahu in Rohini Nakshatra (Shani-vat Rahu in Moon's Nakshatra):
 *      * Food scarcity, supply chain blockades, cyclones, coastal flooding, unseasonal storms.
 *    - Ultimate Collective Remedy: Voluntary Food Fasting (Anna Tyaga / Upavasa):
 *      * Taurus = 2nd house (food intake); Rohini = Moon (mind/hunger).
 *      * Stop eating between sunset and sunrise; voluntarily sacrifice 1–2 meals daily; eat strictly for survival.
 *    - Primacy of the Moon (Chandra) in Activating Yogas:
 *      * Raja and Dhana Yogas require Moon's psychological backing to manifest.
 *    - Ketu in Scorpio Spiritual Sanctuary:
 *      * Shelter for seekers of genuine occult wisdom, selfless service, and divine surrender.
 */

import { EphemerisResult, CelestialBodyPosition, SpecialPoint } from "./types";
import { ZODIAC_SIGNS, RASHI_SANSKRIT, SIGN_LORDS, getBodySignIndex } from "./medhajInduLagna";

// =========================================================================
// 1. SESSION 83: NADI DESTINY BREAKERS & TAURUS-SCORPIO AXIS
// =========================================================================

export interface DestinyBreakerProfile {
  nodeName: "Rahu" | "Ketu";
  role: string;
  nadiArchetype: string;
  elementalAction: string;
  cosmicPolarity: string;
  psychologicalFocus: string;
}

export const DESTINY_BREAKER_PROFILES: Record<"Rahu" | "Ketu", DestinyBreakerProfile> = {
  Rahu: {
    nodeName: "Rahu",
    role: "The Head of the Serpent / Cosmic Amplifier / Worldly Obsession (Bhoga)",
    nadiArchetype: "Destiny Breaker (Future Pull): Uncontrollable cravings, ambitious expansion, technological innovation, modern media, and artificial reality.",
    elementalAction: "Amplifies, magnifies, and expands worldly matters beyond conventional boundaries. Pulls the soul into uncharted evolutionary territory.",
    cosmicPolarity: "Future / Ingestion / Worldly Hunger",
    psychologicalFocus: "Where Rahu lands, the native experiences relentless insatiable hunger, paranoia of lack, and extreme ambition to conquer that domain.",
  },
  Ketu: {
    nodeName: "Ketu",
    role: "The Tail of the Serpent / Cosmic Dissolver / Spiritual Detachment (Moksha)",
    nadiArchetype: "Destiny Breaker (Past Severance): Contraction to zero (Shunya), past-life Prarabdha mastery, accumulated karmic debts, and ultimate spiritual liberation.",
    elementalAction: "Contracts, minimizes, cuts away illusions, and dissolves unearned attachments. Leaves only pure spiritual essence.",
    cosmicPolarity: "Past / Evacuation / Spiritual Renunciation",
    psychologicalFocus: "Where Ketu lands, the native experiences natural detachment, fatigue with worldly games, and sudden karmic severances forcing spiritual surrender.",
  },
};

export interface RahuKetuDestinyAxisResult {
  natalRahuHouse: number;
  natalRahuSign: string;
  natalRahuSanskritSign: string;
  natalKetuHouse: number;
  natalKetuSign: string;
  natalKetuSanskritSign: string;
  transitRahuHouse: number;
  transitRahuSign: string;
  transitRahuSanskritSign: string;
  transitKetuHouse: number;
  transitKetuSign: string;
  transitKetuSanskritSign: string;
  isTaurusScorpioAxisActive: boolean;
  axisKarmicTheme: string;
  rahuResourceAmplificationScore: number;
  ketuUnearnedWealthSeveranceScore: number;
  fearDiagnostics: {
    fearMetricScore: number; // 0-100
    fearMechanism: string;
    confrontationPath: string;
  };
  axisSynthesis: string;
}

/**
 * Evaluates the Rahu-Ketu Destiny Breaker axis per Session 83.
 */
export function evaluateRahuKetuDestinyAxis(
  natalEphem: EphemerisResult,
  transitEphem?: EphemerisResult | null
): RahuKetuDestinyAxisResult {
  const nRahu = natalEphem.planets.Rahu;
  const nKetu = natalEphem.planets.Ketu;
  const nRahuSignIdx = getBodySignIndex(nRahu);
  const nKetuSignIdx = getBodySignIndex(nKetu);

  const tRahu = transitEphem?.planets?.Rahu || nRahu;
  const tKetu = transitEphem?.planets?.Ketu || nKetu;
  const tRahuSignIdx = getBodySignIndex(tRahu);
  const tKetuSignIdx = getBodySignIndex(tKetu);

  const isTaurusScorpio = (tRahuSignIdx === 1 && tKetuSignIdx === 7) || (nRahuSignIdx === 1 && nKetuSignIdx === 7);

  const rahuHouse = tRahu ? tRahu.house : 2;
  const ketuHouse = tKetu ? tKetu.house : 8;

  let rahuResourceAmplificationScore = 60;
  let ketuUnearnedWealthSeveranceScore = 60;

  if (tRahuSignIdx === 1) { // Taurus
    rahuResourceAmplificationScore = 95;
  }
  if (tKetuSignIdx === 7) { // Scorpio
    ketuUnearnedWealthSeveranceScore = 95;
  }

  // Fear diagnostics (Pluto / Ketu Scorpio / Rahu Taurus)
  const fearMetricScore = isTaurusScorpio ? 85 : 55;
  const fearMechanism = isTaurusScorpio
    ? "Rahu in Taurus (Kalapurusha 2nd house) induces systemic anxiety regarding financial liquidity, food supply security, bank stability, and family preservation. Meanwhile, Ketu in Scorpio (Kalapurusha 8th house) surfaces subconscious phobias of sudden annihilation or total loss."
    : `Rahu in ${ZODIAC_SIGNS[tRahuSignIdx]} amplifies worldly desire and fear of missing out, while Ketu in ${ZODIAC_SIGNS[tKetuSignIdx]} enforces detachment from unearned ego.`;

  const confrontationPath = isTaurusScorpio
    ? "Direct Confrontation Principle: Fear is F.E.A.R. ('False Evidence Appearing Real'). In Scorpio, Ketu dissolves fear not by flight, but by direct spiritual confrontation. Once you face the worst-case scenario and surrender the illusion of material permanence, Ketu's terrifying mask transforms into supreme spiritual invulnerability."
    : "Confront illusions directly through meditation and righteous duty; avoid escapism.";

  const axisKarmicTheme = isTaurusScorpio
    ? "The Great Shift: From Gemini-Sagittarius (Biological virus root in Moola & global media amplification) into Taurus-Scorpio (Global financial reset, food chain restructuring & destruction of ill-gotten wealth)."
    : `Nodal Axis Active along ${ZODIAC_SIGNS[tRahuSignIdx]} (Desire/Expansion) - ${ZODIAC_SIGNS[tKetuSignIdx]} (Purification/Detachment).`;

  const axisSynthesis = `Rahu-Ketu Destiny Breakers Telemetry:
- Rahu in ${ZODIAC_SIGNS[tRahuSignIdx]} (H#${rahuHouse}): Amplifying worldly focus, material desires, and resource strategies.
- Ketu in ${ZODIAC_SIGNS[tKetuSignIdx]} (H#${ketuHouse}): Contracting illusions, exposing corrupt or unearned structures, and demanding spiritual surrender.
- Karmic Directive: Accept direct confrontation of fears. Sever reliance on deceptive gains and anchor into disciplined self-reliance.`;

  return {
    natalRahuHouse: nRahu ? nRahu.house : 1,
    natalRahuSign: ZODIAC_SIGNS[nRahuSignIdx],
    natalRahuSanskritSign: RASHI_SANSKRIT[nRahuSignIdx],
    natalKetuHouse: nKetu ? nKetu.house : 7,
    natalKetuSign: ZODIAC_SIGNS[nKetuSignIdx],
    natalKetuSanskritSign: RASHI_SANSKRIT[nKetuSignIdx],
    transitRahuHouse: rahuHouse,
    transitRahuSign: ZODIAC_SIGNS[tRahuSignIdx],
    transitRahuSanskritSign: RASHI_SANSKRIT[tRahuSignIdx],
    transitKetuHouse: ketuHouse,
    transitKetuSign: ZODIAC_SIGNS[tKetuSignIdx],
    transitKetuSanskritSign: RASHI_SANSKRIT[tKetuSignIdx],
    isTaurusScorpioAxisActive: isTaurusScorpio,
    axisKarmicTheme,
    rahuResourceAmplificationScore,
    ketuUnearnedWealthSeveranceScore,
    fearDiagnostics: {
      fearMetricScore,
      fearMechanism,
      confrontationPath,
    },
    axisSynthesis,
  };
}

// =========================================================================
// 2. SESSION 88: COSMIC RESET TIMELINE & 20-YEAR GREAT CONJUNCTION
// =========================================================================

export interface GreatConjunctionCycleResult {
  isConjunctionActive: boolean;
  jupiterSign: string;
  saturnSign: string;
  jupiterLongitude: number;
  saturnLongitude: number;
  separationDegrees: number;
  isNearSixDegreesCapricorn: boolean; // Exact 6° Capricorn Uttara Ashadha threshold
  pranaVayuStatus: string; // Jupiter (Expansion / Inhaling)
  apanaVayuStatus: string; // Saturn (Contraction / Exhaling)
  resetTimelinePhase: "Teaser (Dec 2019 - Mar 2020)" | "Trailer (Mid-2020)" | "Main Picture (Post-Nov 2020 - Late 2021)" | "Post-Cycle Consolidation (Aquarius Onward)";
  geopoliticalTensionRating: "High / Arduous Forest Climb" | "Moderate Transition" | "Stable Integration";
  pharmaceuticalWarning: string;
  bodilyImmunityGuidance: string;
  synthesis: string;
}

/**
 * Evaluates the 20-Year Great Conjunction (Jupiter-Saturn) in Capricorn per Session 88.
 */
export function evaluateGreatConjunctionCycle(
  transitEphem?: EphemerisResult | null,
  evaluationDate?: Date
): GreatConjunctionCycleResult {
  const evalDate = evaluationDate || new Date();
  const year = evalDate.getFullYear();
  const month = evalDate.getMonth() + 1;

  const jup = transitEphem?.planets?.Jupiter;
  const sat = transitEphem?.planets?.Saturn;

  const jupLon = jup ? jup.siderealLongitude : 276.5; // ~6.5° Capricorn benchmark
  const satLon = sat ? sat.siderealLongitude : 276.2; // ~6.2° Capricorn benchmark
  const jupSignIdx = getBodySignIndex(jup || { siderealLongitude: 276 } as any);
  const satSignIdx = getBodySignIndex(sat || { siderealLongitude: 276 } as any);

  const separationDegrees = Math.abs(jupLon - satLon);
  const isConjunctionActive = jupSignIdx === satSignIdx && separationDegrees <= 10;

  // 6° Capricorn (270° + 6° = 276°)
  const capricornLon = (jupLon % 30);
  const isNearSixDegreesCapricorn = jupSignIdx === 9 && capricornLon >= 4 && capricornLon <= 8;

  // Timeline classification
  let resetTimelinePhase: GreatConjunctionCycleResult["resetTimelinePhase"] = "Post-Cycle Consolidation (Aquarius Onward)";
  if (year === 2019 && month >= 11 || (year === 2020 && month <= 3)) {
    resetTimelinePhase = "Teaser (Dec 2019 - Mar 2020)";
  } else if (year === 2020 && month >= 4 && month <= 10) {
    resetTimelinePhase = "Trailer (Mid-2020)";
  } else if ((year === 2020 && month >= 11) || year === 2021) {
    resetTimelinePhase = "Main Picture (Post-Nov 2020 - Late 2021)";
  }

  const geopoliticalTensionRating: GreatConjunctionCycleResult["geopoliticalTensionRating"] =
    isNearSixDegreesCapricorn || isConjunctionActive
      ? "High / Arduous Forest Climb"
      : "Moderate Transition";

  const pranaVayuStatus = "Jupiter represents Prana Vayu (Inhalation, Expansion, Optimism, Divine Grace). In Capricorn (debilitated), Prana Vayu is compressed and struggles for breath under Saturnian coldness.";
  const apanaVayuStatus = "Saturn represents Apana Vayu (Exhalation, Contraction, Cold Elimination, Reality Check). In its own sign Capricorn, Apana Vayu dominates, forcing structural purge of corrupted systems.";

  const pharmaceuticalWarning = "Debilitated Jupiter warns against exclusive reliance on rushed chemical pharmaceutical panaceas. The lecture notes that rushed medical solutions carry unforeseen systemic complications and cannot replace organic cellular resilience.";
  const bodilyImmunityGuidance = "Strengthen the living organism (Jiva). Rely on natural immunity, proper circadian rhythm, and sacred preventive Ayurvedic protections.";

  const synthesis = `The 20-Year Great Conjunction (Capricorn Reset):
- Dynamic: Conjunction of Jupiter (${ZODIAC_SIGNS[jupSignIdx]} ${jupLon.toFixed(1)}°) and Saturn (${ZODIAC_SIGNS[satSignIdx]} ${satLon.toFixed(1)}°)
- Prana vs Apana: Prana Vayu (Jupiter expansion) is disciplined by Apana Vayu (Saturn contraction).
- Capricorn 6° (Uttara Ashadha): Symbolizes arduous climbing through dark, dense mountain forests. Old paradigms collapse; unearned structures dissolve.
- Health Strategy: Avoid pure reliance on chemical panaceas; fortify natural cellular immunity (Jiva).`;

  return {
    isConjunctionActive,
    jupiterSign: ZODIAC_SIGNS[jupSignIdx],
    saturnSign: ZODIAC_SIGNS[satSignIdx],
    jupiterLongitude: jupLon,
    saturnLongitude: satLon,
    separationDegrees: parseFloat(separationDegrees.toFixed(2)),
    isNearSixDegreesCapricorn,
    pranaVayuStatus,
    apanaVayuStatus,
    resetTimelinePhase,
    geopoliticalTensionRating,
    pharmaceuticalWarning,
    bodilyImmunityGuidance,
    synthesis,
  };
}

// =========================================================================
// 3. SESSION 88: SACRED AYURVEDIC NASAL MUSTARD OIL PROTOCOL
// =========================================================================

export interface AyurvedicNasalProtocol {
  remedyTitle: string;
  dropDosage: number; // 6 drops
  substance: string; // Pure mustard oil (Sarson ka Tel)
  applicationWindow: string; // 4:00 PM - 6:00 PM or post-sunset
  astrologicalDerivation: {
    nostrilsAndBreath: string; // Mars & Jupiter
    timeHour: string; // Mars potency hour (4 PM - 6 PM)
    substanceRuler: string; // Saturn (Shani)
    dropCountRuler: string; // Venus (6 / Sanjeevani Vidya)
  };
  therapeuticAction: string;
  instructions: string;
}

export const AYURVEDIC_NASAL_PROTOCOL: AyurvedicNasalProtocol = {
  remedyTitle: "Sacred 6-Drop Mustard Oil Nasal Immunity Shield (Sarson Tel Nasya)",
  dropDosage: 6,
  substance: "Pure cold-pressed Mustard Oil (Sarson ka Tel)",
  applicationWindow: "Daily between 4:00 PM and 6:00 PM (Mars Hora/potency window) or immediately post-sunset",
  astrologicalDerivation: {
    nostrilsAndBreath: "The nasal passage and vital breath correspond to Mars (prana drive/vital heat) and Jupiter (inhalation/life force).",
    timeHour: "4:00 PM to 6:00 PM is an hour energized by Mars potency, ideal for activating protective biological barriers.",
    substanceRuler: "Mustard oil is the dense, pungent, warming substance governed by Saturn (Shani), providing resistance against external decay.",
    dropCountRuler: "The number 6 corresponds to Venus (Shukra), the master of Sanjeevani Vidya (cellular regeneration and immune revitalization).",
  },
  therapeuticAction: "Lubricates mucosal membranes, neutralizes airborne respiratory pathogens, and forms an energetic/physical protective boundary in the vital breath channel.",
  instructions: "Gently warm a small quantity of pure mustard oil. Lie flat and instill 3 to 6 drops into each nostril between 4:00 PM and 6:00 PM (or right after sunset). Sniff gently to coat the nasal passage. Avoid cold drinks immediately afterward.",
};

// =========================================================================
// 4. SESSION 89: ROHINI SHAKATA BHEDANA & ANNA TYAGA COLLECTIVE REMEDY
// =========================================================================

export interface RohiniBhedanaResult {
  isRahuInRohini: boolean;
  isSaturnInRohini: boolean;
  isRohiniBhedanaActive: boolean;
  legendOfDasharatha: {
    king: string;
    crisis: string;
    saturnEncounter: string;
    dasharathaBoon: string;
    stutiName: string;
  };
  supplyChainAndWeatherAlert: {
    severity: "Extreme Crisis Alert" | "Elevated Caution" | "Standard Climate";
    projectedDisruptions: string[];
  };
  annaTyagaFastingRemedy: {
    remedyName: string;
    philosophy: string;
    sunsetRule: string;
    mealSacrificeRule: string;
    moonPrimacyNote: string;
  };
  bhedanaSynthesis: string;
}

/**
 * Evaluates Rohini Shakata Bhedana and Rahu in Rohini Nakshatra per Session 89.
 */
export function evaluateRohiniBhedanaTelemetry(
  transitEphem?: EphemerisResult | null,
  natalEphem?: EphemerisResult | null
): RohiniBhedanaResult {
  const tRahu = transitEphem?.planets?.Rahu || natalEphem?.planets?.Rahu;
  const tSaturn = transitEphem?.planets?.Saturn || natalEphem?.planets?.Saturn;

  // Rohini Nakshatra span: 40°00' to 53°20' sidereal (10°00' Taurus to 23°20' Taurus)
  const isRahuInRohini = Boolean(tRahu && tRahu.siderealLongitude >= 40.0 && tRahu.siderealLongitude < 53.333);
  const isSaturnInRohini = Boolean(tSaturn && tSaturn.siderealLongitude >= 40.0 && tSaturn.siderealLongitude < 53.333);
  const isRohiniBhedanaActive = isRahuInRohini || isSaturnInRohini;

  const legendOfDasharatha = {
    king: "King Dasharatha (Emperor of Ayodhya, Father of Lord Rama)",
    crisis: "Scriptural warning of Rohini Shakata Bhedana (Saturn piercing the cart of Rohini), destined to bring 12 years of catastrophic drought, famine (Durbhiksha), and societal devastation to Earth.",
    saturnEncounter: "King Dasharatha mounted his celestial chariot, ascended into the heavens armed with divine weapons, and prepared to challenge Lord Shani in defense of his starving subjects.",
    dasharathaBoon: "Pleased by King Dasharatha's unyielding courage, devotion, and willingness to sacrifice himself for his subjects, Saturn granted the boon that Rohini Bhedana's devastation would be mitigated if humanity observed self-restraint and chanted the Dasharatha Shani Stuti.",
    stutiName: "Dasharatha Shani Stuti ('Nilanjana Samabhasam Raviputram Yamagrajam...')",
  };

  const severity: RohiniBhedanaResult["supplyChainAndWeatherAlert"]["severity"] = isRohiniBhedanaActive
    ? "Extreme Crisis Alert"
    : "Elevated Caution";

  const projectedDisruptions = isRohiniBhedanaActive
    ? [
        "Unseasonal torrential precipitation, coastal cyclones, and agricultural flooding.",
        "Localized grain and crop shortages causing acute food inflation.",
        "Supply-chain bottlenecks and commercial transit blockades.",
        "Psychological anxiety regarding family security and food distribution.",
      ]
    : [
        "Standard weather patterns with localized seasonal fluctuations.",
        "Regular agricultural distribution channels operating with minor adjustments.",
      ];

  const annaTyagaFastingRemedy = {
    remedyName: "Sacred Anna Tyaga & Sunset-to-Sunrise Upavasa Protocol",
    philosophy: "Taurus represents the 2nd house of Kalapurusha (eating habits, oral intake, accumulated resources); Rohini is governed by the Moon (mind, biological hunger). When Rahu occupies Rohini, sensory appetites run wild. Voluntarily restricting food intake aligns human biology with cosmic law.",
    sunsetRule: "Strict Invariant: Cease consuming solid food between sunset and sunrise. Only clean water or herbal infusions allowed.",
    mealSacrificeRule: "Voluntarily sacrifice one or two meals daily. Eat strictly what is necessary for basic biological sustenance rather than sensory indulgence.",
    moonPrimacyNote: "The Primacy of the Moon: All classical Raja Yogas and Dhana Yogas in Jyotish only bear fruit when supported by a calm, tranquil Moon (Chandra). By mastering hunger and speech via Anna Tyaga, the mind is purified to receive high yogic blessings.",
  };

  const bhedanaSynthesis = `Rohini Shakata Bhedana & Rahu in Taurus Telemetry:
- Status: ${isRohiniBhedanaActive ? "🚨 ACTIVE ROHINI TRANSIT DETECTED (Rahu/Saturn in Moon's Cart)" : "Shielded; neither Rahu nor Saturn currently transiting Rohini Nakshatra."}
- Dasharatha Boon: King Dasharatha's self-sacrifice earned cosmic protection against Rohini famine; mitigated through human self-restraint and Shani Stuti.
- Supreme Collective Remedy (Anna Tyaga): Observe sunset-to-sunrise fasting; voluntarily reduce meal intake to align with cosmic energy and protect against inflation/illness.
- Moon Primacy: Mastery over food and appetites unlocks the true fruition of all natal Raja and Dhana Yogas.`;

  return {
    isRahuInRohini,
    isSaturnInRohini,
    isRohiniBhedanaActive,
    legendOfDasharatha,
    supplyChainAndWeatherAlert: {
      severity,
      projectedDisruptions,
    },
    annaTyagaFastingRemedy,
    bhedanaSynthesis,
  };
}

// =========================================================================
// 5. MASTER REPORT CONSOLIDATION
// =========================================================================

export interface MedhajRahuKetuTransitMasterReport {
  generatedAt: string;
  birthDate: string;
  evaluationDate: string;
  destinyAxis: RahuKetuDestinyAxisResult;
  greatConjunction: GreatConjunctionCycleResult;
  nasalProtocol: AyurvedicNasalProtocol;
  rohiniBhedana: RohiniBhedanaResult;
  masterExecutiveSummary: string;
}

/**
 * Generates the complete Medhaj Astro Master Report for Sessions 83, 88 & 89.
 */
export function generateMedhajRahuKetuTransitMasterReport(
  natalEphem: EphemerisResult,
  transitEphem?: EphemerisResult | null,
  birthDate?: Date,
  evaluationDate?: Date
): MedhajRahuKetuTransitMasterReport {
  const bDate = birthDate || new Date(natalEphem.utcDate);
  const eDate = evaluationDate || new Date();

  const destinyAxis = evaluateRahuKetuDestinyAxis(natalEphem, transitEphem);
  const greatConjunction = evaluateGreatConjunctionCycle(transitEphem, eDate);
  const nasalProtocol = AYURVEDIC_NASAL_PROTOCOL;
  const rohiniBhedana = evaluateRohiniBhedanaTelemetry(transitEphem, natalEphem);

  const masterExecutiveSummary = `
========================================================================================
MEDHAJ ASTRO RAHU-KETU TRANSIT, ROHINI BHEDANA & REMEDIES REPORT (SESSIONS 83, 88 & 89)
========================================================================================
1. Nadi "Destiny Breakers" & Taurus-Scorpio Axis (Session 83):
   - Rahu Placement: ${destinyAxis.transitRahuSign} in House #${destinyAxis.transitRahuHouse} (Resource Amplification: ${destinyAxis.rahuResourceAmplificationScore}/100)
   - Ketu Placement: ${destinyAxis.transitKetuSign} in House #${destinyAxis.transitKetuHouse} (Unearned Wealth Severance: ${destinyAxis.ketuUnearnedWealthSeveranceScore}/100)
   - F.E.A.R. Metric: ${destinyAxis.fearDiagnostics.fearMetricScore}/100 ("False Evidence Appearing Real")
   - Guidance: ${destinyAxis.fearDiagnostics.confrontationPath}

2. The 20-Year Great Conjunction & Cosmic Reset (Session 88):
   - Conjunction Status: ${greatConjunction.isConjunctionActive ? "Active" : "Consolidating"} (Separation: ${greatConjunction.separationDegrees}°)
   - 6° Capricorn Marker: ${greatConjunction.isNearSixDegreesCapricorn ? "⚠️ PEAK UTTARA ASHADHA THRESHOLD" : "Normal Separation"}
   - Prana vs Apana: Prana Vayu (Jupiter expansion) disciplined by Apana Vayu (Saturn contraction).
   - Medical Invariant: ${greatConjunction.pharmaceuticalWarning}

3. Rohini Shakata Bhedana & King Dasharatha Boon (Session 89):
   - Rahu in Rohini: ${rohiniBhedana.isRahuInRohini ? "YES (Food & Weather Anomalies Peak)" : "NO"}
   - Shani Bhedana Status: ${rohiniBhedana.isSaturnInRohini ? "YES (Classic Rohini Bhedana)" : "NO"}
   - Stuti Prescribed: ${rohiniBhedana.legendOfDasharatha.stutiName}
   - Supply Risk: ${rohiniBhedana.supplyChainAndWeatherAlert.severity}

4. Sacred Collective Remedies (Sessions 88 & 89):
   - Ayurvedic Nasal Shield: 6 drops pure mustard oil in nostrils daily between 4:00 PM and 6:00 PM (or post-sunset).
   - Anna Tyaga Fasting: Stop eating between sunset and sunrise; voluntarily sacrifice 1–2 meals daily.
   - Moon Primacy: Calming the mind and conquering food cravings unlocks all classical Raja/Dhana Yogas.
========================================================================================
`.trim();

  return {
    generatedAt: new Date().toISOString(),
    birthDate: bDate.toISOString().slice(0, 10),
    evaluationDate: eDate.toISOString().slice(0, 10),
    destinyAxis,
    greatConjunction,
    nasalProtocol,
    rohiniBhedana,
    masterExecutiveSummary,
  };
}
