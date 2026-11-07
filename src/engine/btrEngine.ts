/**
 * Classical Birth Time Rectification (BTR) & Life Event Chronology Engine
 * Grounded in Brihat Parashara Hora Shastra (BPHS Ch. 5: Janma Samaya Shodhana),
 * Brihat Jataka (Ch. 4: Adhana Niyama), Deva Keralam (Chandra Kala Nadi),
 * Jataka Parijata, and K.N. Rao / Dr. B.V. Raman Event-Based Multi-Varga Rectification.
 */

import { EphemerisResult } from "./types";
import { calculateVimshottariDasha } from "./dasha";
import { calculateShodashavargaChart, calculateVargaSign } from "./shodashavarga";
import { calculateVedicEphemeris } from "./ephemeris";
import { RASHI_NAMES } from "./constants";
import { calculateAdhanaKundali } from "./adhanaKundali";

export interface ChitkaraConditionDetail {
  passed: boolean;
  name: string;
  harmonicChart: "D9" | "D60";
  primaryBody: string;
  primarySign: string;
  secondaryBody: string;
  secondarySign: string;
  houseDistance: number;
  aspectDetails?: string;
  explanation: string;
}

export interface ChitkaraRectificationCandidate {
  rectifiedLocalTime: string;
  deltaSeconds: number;
  deltaFormatted: string;
  score: number;
  d60LagnaSign: string;
  c1Passed: boolean;
  c2Passed: boolean;
  c3Passed: boolean;
  clinicalNote: string;
}

export interface ChitkaraBtrTriadResult {
  condition1D9MoonPP: ChitkaraConditionDetail;
  condition2D60VenusPP: ChitkaraConditionDetail;
  condition3D60KetuDispositorLagna: ChitkaraConditionDetail;
  passedCount: number;
  scorePercent: number;
  verdict: "PERFECT_ACCURACY" | "HIGH_PROXIMITY" | "RECTIFICATION_REQUIRED";
  verdictTitle: string;
  verdictDescription: string;
  rahuMetaphysicsNote: string;
  rectificationCandidate?: ChitkaraRectificationCandidate;
}

export interface KundaShodhanaResult {
  kundaLongitude: number;
  kundaRashi: string;
  kundaDegrees: number;
  kundaNakshatra: string;
  kundaNakshatraIndex: number;
  janmaNakshatraIndex: number;
  janmaNakshatraName: string;
  lagnaNakshatraIndex: number;
  lagnaNakshatraName: string;
  isTrikonaMatchWithMoon: boolean;
  isTrikonaMatchWithLagna: boolean;
  harmonyScorePercent: number;
  classicalVerdict: string;
}

export interface PranapadaResult {
  pranapadaLongitude: number;
  pranapadaRashi: string;
  pranapadaDegrees: number;
  pranapadaHouseFromLagna: number;
  pranapadaHouseFromMoon: number;
  isAuspiciousBhava: boolean; // 1, 4, 5, 7, 9, 10
  harmonyScorePercent: number;
  classicalVerdict: string;
}

export interface TattvaShodhanaResult {
  weekdayName: string;
  weekdayLord: string;
  primaryTattva: "Prithvi (Earth)" | "Jala (Water)" | "Agni (Fire)" | "Vayu (Air)" | "Akasha (Ether)";
  antarTattva: "Prithvi" | "Jala" | "Agni" | "Vayu" | "Akasha";
  antarTattvaGender: "Male" | "Female";
  nativeGender: "male" | "female";
  isGenderHarmonious: boolean;
  classicalVerdict: string;
}

export interface VargaSensitivityNode {
  vargaId: string;
  vargaName: string;
  divisionNumber: number;
  currentAscendantSign: string;
  currentAscendantDegrees: number;
  timeSpanMinutesTotal: number;
  remainingMinutesInCurrentSign: number;
  elapsedMinutesInCurrentSign: number;
  windowStartLocalTime: string;
  windowEndLocalTime: string;
  timeSpanSecondsTotal?: number;
  elapsedSecondsInCurrentSign?: number;
  remainingSecondsInCurrentSign?: number;
  boundaryCountdownFormatted?: string;
  boundaryVulnerabilityIndex?: "CRITICAL_SENSITIVE" | "MODERATE_SENSITIVE" | "SECURE";
  previousAscendantSign?: string;
  nextAscendantSign?: string;
}

export interface TriEpochBirthMomentResult {
  recordedBirthLocalTime: string;
  recordedBirthDateStr: string;
  adhanaEpoch: {
    conceptionDateStr: string;
    gestationDays: number;
    adhanaLagnaSign: string;
    adhanaLagnaLord: string;
    adhanaLagnaDegrees: number;
    adhanaMoonSign: string;
    adhanaMoonNakshatra: string;
    significance: string;
  };
  shirodarshanaEpoch: {
    estimatedTimeRange: string;
    estimatedMinutesBeforeDelivery: number;
    estimatedLagnaSign: string;
    isLagnaSignSameAsBhupatana: boolean;
    significance: string;
  };
  bhupatanaEpoch: {
    civilBirthTime: string;
    civilLagnaSign: string;
    civilLagnaDegrees: number;
    umbilicalSeveranceEvent: string;
    firstBreathPranaEvent: string;
    isUniversalBaseline: boolean;
    significance: string;
  };
  d60VulnerabilityStatus: {
    d60Sign: string;
    elapsedSeconds: number;
    remainingSeconds: number;
    totalSpanSeconds: number;
    bufferDescription: string;
    vulnerabilityLevel: "CRITICAL_SENSITIVE" | "MODERATE_SENSITIVE" | "SECURE";
    recommendation: string;
  };
  chitkaraBtrTriad?: ChitkaraBtrTriadResult;
  shastricSynthesis: string;
}

export interface ChronologicalDashaWindow {
  mahadashaLord: string;
  antardashaLord: string;
  startDate: Date;
  endDate: Date;
  startFormatted: string;
  endFormatted: string;
  nativeAgeStart: number;
  nativeAgeEnd: number;
  lifePhaseTitle: string;
  primaryHouseActivations: number[];
}

const NAKSHATRA_NAMES = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Svati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

/**
 * 1. Kunda Shodhana (कुण्ड शोधन - BPHS)
 * Formula: Kunda = (Lagna Longitude × 81) mod 360°
 * Kunda Nakshatra must fall in 1st, 10th, or 19th from Janma/Lagna Nakshatra (Trikona trines).
 */
export function calculateKundaShodhana(natalEphemeris: EphemerisResult): KundaShodhanaResult {
  const lagnaLon = natalEphemeris.ascendant.siderealLongitude;
  const kundaLon = (lagnaLon * 81) % 360;
  const kundaRashiIdx = Math.floor(kundaLon / 30);
  const kundaRashi = RASHI_NAMES[kundaRashiIdx].englishName;
  const kundaDegrees = kundaLon % 30;

  const nakSpan = 360 / 27; // 13.3333333333°
  const kundaNakIdx = Math.floor(kundaLon / nakSpan);
  const kundaNakName = NAKSHATRA_NAMES[kundaNakIdx] || "Ashwini";

  const moonLon = natalEphemeris.planets.Moon?.siderealLongitude || 0;
  const janmaNakIdx = Math.floor(moonLon / nakSpan);
  const janmaNakName = NAKSHATRA_NAMES[janmaNakIdx] || "Ashwini";

  const lagnaNakIdx = Math.floor(lagnaLon / nakSpan);
  const lagnaNakName = NAKSHATRA_NAMES[lagnaNakIdx] || "Ashwini";

  // Check 1-10-19 Trikona Nakshatra Trines
  const moonDiff = ((kundaNakIdx - janmaNakIdx + 27) % 27) + 1;
  const isTrikonaMatchWithMoon = moonDiff === 1 || moonDiff === 10 || moonDiff === 19;

  const lagnaDiff = ((kundaNakIdx - lagnaNakIdx + 27) % 27) + 1;
  const isTrikonaMatchWithLagna = lagnaDiff === 1 || lagnaDiff === 10 || lagnaDiff === 19;

  let harmonyScorePercent = 75;
  let classicalVerdict = "Moderate Kunda resonance with natal cusps.";

  if (isTrikonaMatchWithMoon && isTrikonaMatchWithLagna) {
    harmonyScorePercent = 98;
    classicalVerdict = "Supreme Kunda Shodhana alignment: Kunda Nakshatra forms exact trines with both Moon and Lagna Nakshatras.";
  } else if (isTrikonaMatchWithMoon || isTrikonaMatchWithLagna) {
    harmonyScorePercent = 92;
    classicalVerdict = `Verified Kunda Shodhana: Kunda Nakshatra (${kundaNakName}) harmonizes with ${isTrikonaMatchWithMoon ? "Janma Nakshatra (Moon)" : "Lagna Nakshatra"}.`;
  } else if ([5, 7, 9].includes(moonDiff) || [5, 7, 9].includes(lagnaDiff)) {
    harmonyScorePercent = 85;
    classicalVerdict = "Favorable secondary harmonic resonance between Kunda and natal luminaries.";
  }

  return {
    kundaLongitude: kundaLon,
    kundaRashi,
    kundaDegrees,
    kundaNakshatra: kundaNakName,
    kundaNakshatraIndex: kundaNakIdx,
    janmaNakshatraIndex: janmaNakIdx,
    janmaNakshatraName: janmaNakName,
    lagnaNakshatraIndex: lagnaNakIdx,
    lagnaNakshatraName: lagnaNakName,
    isTrikonaMatchWithMoon,
    isTrikonaMatchWithLagna,
    harmonyScorePercent,
    classicalVerdict,
  };
}

/**
 * 2. Pranapada Lagna (प्राणपद लग्न - BPHS Ch. 5)
 * Formula based on sunrise to birth time elapsed Ghatis.
 */
export function calculatePranapada(natalEphemeris: EphemerisResult): PranapadaResult {
  const birthDate = new Date(natalEphemeris.utcDate);
  const location = natalEphemeris.location;
  const tzOffset = location?.timezoneOffsetHours || 5.5;
  const localDate = new Date(birthDate.getTime() + tzOffset * 3600 * 1000);

  const localHoursDecimal = localDate.getUTCHours() + localDate.getUTCMinutes() / 60 + localDate.getUTCSeconds() / 3600;
  const sunriseHoursDecimal = 6.0; // Standard nominal 6:00 AM baseline
  let hoursSinceSunrise = (localHoursDecimal - sunriseHoursDecimal + 24) % 24;
  if (hoursSinceSunrise > 24) hoursSinceSunrise -= 24;

  const ghatisSinceSunrise = hoursSinceSunrise * 2.5; // 1 hr = 2.5 Ghatis
  const sunLon = natalEphemeris.planets.Sun?.siderealLongitude || 0;
  const sunSign = Math.floor(sunLon / 30);

  let modalityOffset = 0;
  if ([1, 4, 7, 10].includes(sunSign)) modalityOffset = 240; // Fixed
  else if ([2, 5, 8, 11].includes(sunSign)) modalityOffset = 120; // Dual

  const pranapadaLon = (sunLon + ghatisSinceSunrise * 6 + modalityOffset) % 360;
  const ppRashiIdx = Math.floor(pranapadaLon / 30);
  const ppRashi = RASHI_NAMES[ppRashiIdx].englishName;
  const ppDegrees = pranapadaLon % 30;

  const lagnaRashiIdx = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const moonRashiIdx = Math.floor((natalEphemeris.planets.Moon?.siderealLongitude || 0) / 30);

  const houseFromLagna = ((ppRashiIdx - lagnaRashiIdx + 12) % 12) + 1;
  const houseFromMoon = ((ppRashiIdx - moonRashiIdx + 12) % 12) + 1;

  const isAuspiciousBhava = [1, 4, 5, 7, 9, 10].includes(houseFromLagna) || [1, 4, 5, 7, 9, 10].includes(houseFromMoon);
  const harmonyScorePercent = isAuspiciousBhava ? 90 : 70;
  const classicalVerdict = isAuspiciousBhava
    ? `Pranapada in House ${houseFromLagna} from Lagna (House ${houseFromMoon} from Moon) falls in a classical Kendra/Trikona auspicious axis, validating biological vitality and birth moment.`
    : `Pranapada in House ${houseFromLagna} indicates slight sub-minute fine-tuning may be considered.`;

  return {
    pranapadaLongitude: pranapadaLon,
    pranapadaRashi: ppRashi,
    pranapadaDegrees: ppDegrees,
    pranapadaHouseFromLagna: houseFromLagna,
    pranapadaHouseFromMoon: houseFromMoon,
    isAuspiciousBhava,
    harmonyScorePercent,
    classicalVerdict,
  };
}

/**
 * 3. Tattva & Antar-Tattva Shodhana (तत्व शोधन - Maharshi Parashara)
 */
export function calculateTattvaShodhana(
  natalEphemeris: EphemerisResult,
  gender: "male" | "female" = "male"
): TattvaShodhanaResult {
  const birthDate = new Date(natalEphemeris.utcDate);
  const location = natalEphemeris.location;
  const tzOffset = location?.timezoneOffsetHours || 5.5;
  const localDate = new Date(birthDate.getTime() + tzOffset * 3600 * 1000);

  const dayOfWeek = localDate.getUTCDay();
  const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekdayLords = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  const weekdayName = weekdayNames[dayOfWeek];
  const weekdayLord = weekdayLords[dayOfWeek];

  const localHoursDecimal = localDate.getUTCHours() + localDate.getUTCMinutes() / 60 + localDate.getUTCSeconds() / 3600;
  const sunriseHoursDecimal = 6.0;
  const elapsedMinutes = Math.floor(((localHoursDecimal - sunriseHoursDecimal + 24) % 24) * 60) % 180;

  let primaryTattva: TattvaShodhanaResult["primaryTattva"] = "Agni (Fire)";
  let antarTattva: TattvaShodhanaResult["antarTattva"] = "Agni";
  let antarTattvaGender: "Male" | "Female" = "Male";

  if (elapsedMinutes < 45) {
    primaryTattva = "Agni (Fire)";
    antarTattva = "Agni";
    antarTattvaGender = "Male";
  } else if (elapsedMinutes < 60) {
    primaryTattva = "Akasha (Ether)";
    antarTattva = "Akasha";
    antarTattvaGender = "Male";
  } else if (elapsedMinutes < 90) {
    primaryTattva = "Vayu (Air)";
    antarTattva = "Vayu";
    antarTattvaGender = "Male";
  } else if (elapsedMinutes < 120) {
    primaryTattva = "Prithvi (Earth)";
    antarTattva = "Prithvi";
    antarTattvaGender = "Female";
  } else {
    primaryTattva = "Jala (Water)";
    antarTattva = "Jala";
    antarTattvaGender = "Female";
  }

  const isGenderHarmonious =
    (gender === "male" && antarTattvaGender === "Male") ||
    (gender === "female" && antarTattvaGender === "Female");

  const classicalVerdict = isGenderHarmonious
    ? `Tattva Shodhana matches native gender (${gender}): Active Antar-Tattva is ${antarTattva} (${antarTattvaGender}), in 100% biological harmony with the birth moment.`
    : `Tattva Shodhana indicates ${antarTattva} (${antarTattvaGender}). Complementary elemental balance operating.`;

  return {
    weekdayName,
    weekdayLord,
    primaryTattva,
    antarTattva,
    antarTattvaGender,
    nativeGender: gender,
    isGenderHarmonious,
    classicalVerdict,
  };
}

/**
 * 4. Varga Sensitivity & Minute Duration Boundaries
 */
export function calculateVargaSensitivities(natalEphemeris: EphemerisResult): VargaSensitivityNode[] {
  const birthDate = new Date(natalEphemeris.utcDate);
  const location = natalEphemeris.location;
  const tzOffset = location?.timezoneOffsetHours || 5.5;
  const localDate = new Date(birthDate.getTime() + tzOffset * 3600 * 1000);

  const ascLon = natalEphemeris.ascendant.siderealLongitude;
  const ascDeg = ascLon % 30;

  const formatTimeStr = (d: Date) => {
    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mm = String(d.getUTCMinutes()).padStart(2, "0");
    const ss = String(d.getUTCSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  const vargasToInspect = [
    { id: "D1", name: "Rashi (D-1 Lagna)", div: 1, spanDeg: 30 },
    { id: "D3", name: "Drekkana (D-3 Sibling/Action)", div: 3, spanDeg: 10 },
    { id: "D7", name: "Saptamsha (D-7 Progeny/Children)", div: 7, spanDeg: 30 / 7 },
    { id: "D9", name: "Navamsha (D-9 Marriage/Dharma)", div: 9, spanDeg: 30 / 9 },
    { id: "D10", name: "Dasamsa (D-10 Career/Karma)", div: 10, spanDeg: 30 / 10 },
    { id: "D24", name: "Siddhamsha (D-24 Higher Learning)", div: 24, spanDeg: 30 / 24 },
    { id: "D60", name: "Shashtiamsha (D-60 Karmic Clock)", div: 60, spanDeg: 30 / 60 },
  ];

  const results: VargaSensitivityNode[] = [];

  for (const v of vargasToInspect) {
    const elapsedInVargaDeg = ascDeg % v.spanDeg;
    const remainingInVargaDeg = v.spanDeg - elapsedInVargaDeg;

    const timeSpanMinutesTotal = v.spanDeg * 4;
    const elapsedMinutesInCurrentSign = elapsedInVargaDeg * 4;
    const remainingMinutesInCurrentSign = remainingInVargaDeg * 4;

    const timeSpanSecondsTotal = Math.round(v.spanDeg * 4 * 60);
    const elapsedSecondsInCurrentSign = Math.round(elapsedInVargaDeg * 4 * 60);
    const remainingSecondsInCurrentSign = Math.max(0, timeSpanSecondsTotal - elapsedSecondsInCurrentSign);

    const elapsedMin = Math.floor(elapsedSecondsInCurrentSign / 60);
    const elapsedSec = elapsedSecondsInCurrentSign % 60;
    const remMin = Math.floor(remainingSecondsInCurrentSign / 60);
    const remSec = remainingSecondsInCurrentSign % 60;
    const boundaryCountdownFormatted = `${elapsedMin}m ${elapsedSec}s elapsed, ${remMin}m ${remSec}s remaining`;

    let boundaryVulnerabilityIndex: "CRITICAL_SENSITIVE" | "MODERATE_SENSITIVE" | "SECURE" = "SECURE";
    if (v.id === "D60") {
      if (elapsedSecondsInCurrentSign <= 30 || remainingSecondsInCurrentSign <= 30) {
        boundaryVulnerabilityIndex = "CRITICAL_SENSITIVE";
      } else if (elapsedSecondsInCurrentSign <= 45 || remainingSecondsInCurrentSign <= 45) {
        boundaryVulnerabilityIndex = "MODERATE_SENSITIVE";
      }
    } else if (v.id === "D3" || v.id === "D7" || v.id === "D9" || v.id === "D10" || v.id === "D24") {
      if (elapsedSecondsInCurrentSign <= 90 || remainingSecondsInCurrentSign <= 90) {
        boundaryVulnerabilityIndex = "CRITICAL_SENSITIVE";
      } else if (elapsedSecondsInCurrentSign <= 180 || remainingSecondsInCurrentSign <= 180) {
        boundaryVulnerabilityIndex = "MODERATE_SENSITIVE";
      }
    }

    const winStartDate = new Date(localDate.getTime() - elapsedMinutesInCurrentSign * 60 * 1000);
    const winEndDate = new Date(localDate.getTime() + remainingMinutesInCurrentSign * 60 * 1000);

    const vChart = calculateShodashavargaChart(natalEphemeris, v.id as any);
    const currentSign = vChart.ascendant?.vargaRashi?.englishName || "Virgo";
    const currentDeg = (ascLon % v.spanDeg);

    // Compute adjacent (previous and next) Varga Ascendant signs across the cusp boundary
    const prevLon = (ascLon - elapsedInVargaDeg - 0.02 + 360) % 360;
    const nextLon = (ascLon + remainingInVargaDeg + 0.02) % 360;
    const prevEphem: EphemerisResult = {
      ...natalEphemeris,
      ascendant: { ...natalEphemeris.ascendant, siderealLongitude: prevLon },
    };
    const nextEphem: EphemerisResult = {
      ...natalEphemeris,
      ascendant: { ...natalEphemeris.ascendant, siderealLongitude: nextLon },
    };
    const prevVChart = calculateShodashavargaChart(prevEphem, v.id as any);
    const nextVChart = calculateShodashavargaChart(nextEphem, v.id as any);
    const previousAscendantSign = prevVChart.ascendant?.vargaRashi?.englishName || currentSign;
    const nextAscendantSign = nextVChart.ascendant?.vargaRashi?.englishName || currentSign;

    results.push({
      vargaId: v.id,
      vargaName: v.name,
      divisionNumber: v.div,
      currentAscendantSign: currentSign,
      currentAscendantDegrees: currentDeg,
      timeSpanMinutesTotal: Math.round(timeSpanMinutesTotal * 10) / 10,
      elapsedMinutesInCurrentSign: Math.round(elapsedMinutesInCurrentSign * 10) / 10,
      remainingMinutesInCurrentSign: Math.round(remainingMinutesInCurrentSign * 10) / 10,
      windowStartLocalTime: formatTimeStr(winStartDate),
      windowEndLocalTime: formatTimeStr(winEndDate),
      timeSpanSecondsTotal,
      elapsedSecondsInCurrentSign,
      remainingSecondsInCurrentSign,
      boundaryCountdownFormatted,
      boundaryVulnerabilityIndex,
      previousAscendantSign,
      nextAscendantSign,
    });
  }

  return results;
}

/**
 * Jaimini Rashi Drishti (Sign Aspect) Matrix
 * Chara (Movable: 0, 3, 6, 9) aspects Sthira (Fixed: 1, 4, 7, 10) EXCEPT adjacent (rashiIdx + 1)
 * Sthira (Fixed: 1, 4, 7, 10) aspects Chara (Movable: 0, 3, 6, 9) EXCEPT adjacent (rashiIdx - 1)
 * Dvisvabhava (Dual: 2, 5, 8, 11) aspects all other Dual signs
 */
export function getJaiminiRashiDrishtiSigns(rashiIdx: number): number[] {
  const modality = rashiIdx % 3; // 0: Chara, 1: Sthira, 2: Dvisvabhava
  const aspects: number[] = [];

  if (modality === 0) {
    // Chara -> Sthira except adjacent (rashiIdx + 1)
    const fixed = [1, 4, 7, 10];
    const adjacent = (rashiIdx + 1) % 12;
    for (const f of fixed) {
      if (f !== adjacent) aspects.push(f);
    }
  } else if (modality === 1) {
    // Sthira -> Chara except adjacent (rashiIdx - 1)
    const movable = [0, 3, 6, 9];
    const adjacent = (rashiIdx - 1 + 12) % 12;
    for (const m of movable) {
      if (m !== adjacent) aspects.push(m);
    }
  } else {
    // Dual -> other Dual signs
    const dual = [2, 5, 8, 11];
    for (const d of dual) {
      if (d !== rashiIdx) aspects.push(d);
    }
  }
  return aspects;
}

export const CHITKARA_RASHI_LORDS: Record<number, string> = {
  0: "Mars",    // Mesha (Aries)
  1: "Venus",   // Vrishabha (Taurus)
  2: "Mercury", // Mithuna (Gemini)
  3: "Moon",    // Karka (Cancer)
  4: "Sun",     // Simha (Leo)
  5: "Mercury", // Kanya (Virgo)
  6: "Venus",   // Tula (Libra)
  7: "Mars",    // Vrishchika (Scorpio)
  8: "Jupiter", // Dhanu (Sagittarius)
  9: "Saturn",  // Makara (Capricorn)
  10: "Saturn", // Kumbha (Aquarius)
  11: "Jupiter",// Meena (Pisces)
};

/**
 * Automated Timeline Scanner for Chitkara BTR Rectification
 * Sweeps +-scanWindowMinutes in stepSeconds increments to locate optimal 3/3 convergence.
 */
export function scanChitkaraRectificationCandidate(
  natalEphemeris: EphemerisResult,
  scanWindowMinutes: number = 10,
  stepSeconds: number = 15
): ChitkaraRectificationCandidate {
  const baseUtcDate = new Date(natalEphemeris.utcDate);
  const location = natalEphemeris.location || {
    latitude: 25.4358,
    longitude: 81.8463,
    timezoneOffsetHours: 5.5,
    cityName: "Patna",
    country: "India",
  };
  const tzOffset = location.timezoneOffsetHours || 5.5;

  let bestCandidate: {
    offsetSec: number;
    score: number;
    d60LagnaSign: string;
    c1: boolean;
    c2: boolean;
    c3: boolean;
  } | null = null;

  const maxOffset = scanWindowMinutes * 60;

  for (let offsetSec = -maxOffset; offsetSec <= maxOffset; offsetSec += stepSeconds) {
    const testDate = new Date(baseUtcDate.getTime() + offsetSec * 1000);
    const testEph = calculateVedicEphemeris(testDate, location);
    const triad = evaluateChitkaraBtrTriad(testEph, false);

    if (triad.passedCount === 3) {
      if (!bestCandidate || bestCandidate.score < 3 || Math.abs(offsetSec) < Math.abs(bestCandidate.offsetSec)) {
        bestCandidate = {
          offsetSec,
          score: triad.passedCount,
          d60LagnaSign: triad.condition3D60KetuDispositorLagna.secondarySign,
          c1: triad.condition1D9MoonPP.passed,
          c2: triad.condition2D60VenusPP.passed,
          c3: triad.condition3D60KetuDispositorLagna.passed,
        };
      }
    } else if (triad.passedCount === 2 && (!bestCandidate || bestCandidate.score < 2)) {
      bestCandidate = {
        offsetSec,
        score: triad.passedCount,
        d60LagnaSign: triad.condition3D60KetuDispositorLagna.secondarySign,
        c1: triad.condition1D9MoonPP.passed,
        c2: triad.condition2D60VenusPP.passed,
        c3: triad.condition3D60KetuDispositorLagna.passed,
      };
    }
  }

  const offsetSec = bestCandidate ? bestCandidate.offsetSec : 0;
  const recLocalDate = new Date(baseUtcDate.getTime() + offsetSec * 1000 + tzOffset * 3600 * 1000);
  const hh = String(recLocalDate.getUTCHours()).padStart(2, "0");
  const mm = String(recLocalDate.getUTCMinutes()).padStart(2, "0");
  const ss = String(recLocalDate.getUTCSeconds()).padStart(2, "0");
  const rectifiedLocalTime = `${hh}:${mm}:${ss}`;

  const absSec = Math.abs(offsetSec);
  const mins = Math.floor(absSec / 60);
  const remSec = absSec % 60;
  const sign = offsetSec > 0 ? "+" : offsetSec < 0 ? "-" : "";
  const deltaFormatted = offsetSec === 0 ? "0s (Exact)" : `${sign}${mins}m ${remSec}s (${sign}${absSec}s)`;

  let clinicalNote =
    "Hospital delivery staff typically record the birth time 2 to 4 minutes after umbilical cord severance during neonatal clearing and Apgar scoring, causing a clock-recording delay.";
  if (offsetSec === 0) {
    clinicalNote = "Recorded birth time aligns directly with the umbilical severance moment.";
  } else if (offsetSec < 0) {
    clinicalNote = `Umbilical cord severance (Naala-Chhedana) occurred ${mins}m ${remSec}s prior to the hospital clock record.`;
  } else {
    clinicalNote = `Umbilical cord severance occurred ${mins}m ${remSec}s after the nominal rounded hospital record.`;
  }

  return {
    rectifiedLocalTime,
    deltaSeconds: offsetSec,
    deltaFormatted,
    score: bestCandidate ? bestCandidate.score : 0,
    d60LagnaSign: bestCandidate ? bestCandidate.d60LagnaSign : "Unknown",
    c1Passed: bestCandidate ? bestCandidate.c1 : false,
    c2Passed: bestCandidate ? bestCandidate.c2 : false,
    c3Passed: bestCandidate ? bestCandidate.c3 : false,
    clinicalNote,
  };
}

/**
 * Navneet Chitkara 3-Point BTR Verification Triad
 * 1. D-9 Moon in trine (1, 5, 9) or 1/7 axis from D-9 Pranapada
 * 2. D-60 Pranapada in trine (1, 5, 9) or 1/7 axis from D-60 Venus
 * 3. D-60 Ketu's Dispositor casts Jaimini Rashi Drishti (or conjunction) on D-60 Lagna
 */
export function evaluateChitkaraBtrTriad(
  natalEphemeris: EphemerisResult,
  includeScanner: boolean = true
): ChitkaraBtrTriadResult {
  const pp = calculatePranapada(natalEphemeris);

  // 1. Condition 1: D-9 Moon vs D-9 Pranapada
  const moonLon = natalEphemeris.planets.Moon?.siderealLongitude || 0;
  const d9Moon = calculateVargaSign(moonLon, "D9");
  const d9PP = calculateVargaSign(pp.pranapadaLongitude, "D9");
  const c1House = ((d9Moon - d9PP + 12) % 12) + 1;
  const c1Passed = [1, 5, 7, 9].includes(c1House);

  const c1Detail: ChitkaraConditionDetail = {
    passed: c1Passed,
    name: "Navamsha (D-9) Moon & Pranapada Synchronicity",
    harmonicChart: "D9",
    primaryBody: "Pranapada Lagna",
    primarySign: RASHI_NAMES[d9PP]?.englishName || "Unknown",
    secondaryBody: "Moon",
    secondarySign: RASHI_NAMES[d9Moon]?.englishName || "Unknown",
    houseDistance: c1House,
    explanation: c1Passed
      ? `Navamsha Moon in ${RASHI_NAMES[d9Moon]?.englishName} occupies House ${c1House} (${c1House === 1 ? "conjunction" : c1House === 7 ? "1/7 opposition axis" : "trine/Trikona"}) from D-9 Pranapada in ${RASHI_NAMES[d9PP]?.englishName}, verifying emotional and respiratory synchronicity.`
      : `Navamsha Moon in ${RASHI_NAMES[d9Moon]?.englishName} occupies House ${c1House} from D-9 Pranapada (${RASHI_NAMES[d9PP]?.englishName}), outside the auspicious 1, 5, 7, 9 harmonic axis.`,
  };

  // 2. Condition 2: D-60 Pranapada vs D-60 Venus
  const venusLon = natalEphemeris.planets.Venus?.siderealLongitude || 0;
  const d60Venus = calculateVargaSign(venusLon, "D60");
  const d60PP = calculateVargaSign(pp.pranapadaLongitude, "D60");
  const c2House = ((d60PP - d60Venus + 12) % 12) + 1;
  const c2Passed = [1, 5, 7, 9].includes(c2House);

  const c2Detail: ChitkaraConditionDetail = {
    passed: c2Passed,
    name: "Shashtiamsha (D-60) Pranapada & Venus Alignment",
    harmonicChart: "D60",
    primaryBody: "Venus",
    primarySign: RASHI_NAMES[d60Venus]?.englishName || "Unknown",
    secondaryBody: "Pranapada Lagna",
    secondarySign: RASHI_NAMES[d60PP]?.englishName || "Unknown",
    houseDistance: c2House,
    explanation: c2Passed
      ? `Shashtiamsha Pranapada in ${RASHI_NAMES[d60PP]?.englishName} occupies House ${c2House} (${c2House === 1 ? "conjunction" : c2House === 7 ? "1/7 opposition axis" : "trine/Trikona"}) from D-60 Venus in ${RASHI_NAMES[d60Venus]?.englishName}, anchoring physical seminal vitality in the karmic harmonic.`
      : `Shashtiamsha Pranapada in ${RASHI_NAMES[d60PP]?.englishName} occupies House ${c2House} from D-60 Venus (${RASHI_NAMES[d60Venus]?.englishName}), requiring second-level rectification.`,
  };

  // 3. Condition 3: D-60 Ketu Dispositor Jaimini Rashi Drishti on D-60 Lagna
  const lagnaLon = natalEphemeris.ascendant.siderealLongitude;
  const d60Lagna = calculateVargaSign(lagnaLon, "D60");
  const ketuLon = natalEphemeris.planets.Ketu?.siderealLongitude || 0;
  const d60Ketu = calculateVargaSign(ketuLon, "D60");
  const ketuLord = CHITKARA_RASHI_LORDS[d60Ketu] || "Mars";
  const dispositorLon = natalEphemeris.planets[ketuLord as keyof typeof natalEphemeris.planets]?.siderealLongitude || 0;
  const d60DispositorSign = calculateVargaSign(dispositorLon, "D60");
  const aspects = getJaiminiRashiDrishtiSigns(d60DispositorSign);
  const hasRashiDrishti = aspects.includes(d60Lagna);
  const isConjunct = d60DispositorSign === d60Lagna;
  const c3Passed = hasRashiDrishti || isConjunct;

  const aspectNames = aspects.map((a) => RASHI_NAMES[a]?.englishName || String(a)).join(", ");
  const c3Detail: ChitkaraConditionDetail = {
    passed: c3Passed,
    name: "Shashtiamsha (D-60) Ketu Dispositor Aspect on Lagna",
    harmonicChart: "D60",
    primaryBody: `Ketu's Dispositor (${ketuLord})`,
    primarySign: RASHI_NAMES[d60DispositorSign]?.englishName || "Unknown",
    secondaryBody: "D-60 Lagna",
    secondarySign: RASHI_NAMES[d60Lagna]?.englishName || "Unknown",
    houseDistance: ((d60Lagna - d60DispositorSign + 12) % 12) + 1,
    aspectDetails: isConjunct ? "Direct Conjunction (1st House)" : `Jaimini Rashi Drishti aspects ${aspectNames}`,
    explanation: c3Passed
      ? `D-60 Ketu in ${RASHI_NAMES[d60Ketu]?.englishName} is ruled by ${ketuLord} (in D-60 ${RASHI_NAMES[d60DispositorSign]?.englishName}), which ${isConjunct ? "is conjunct with" : "casts Jaimini Rashi Drishti onto"} D-60 Lagna (${RASHI_NAMES[d60Lagna]?.englishName}). Past-life karma is legitimately sealed to the rising physical body.`
      : `D-60 Ketu in ${RASHI_NAMES[d60Ketu]?.englishName} is ruled by ${ketuLord} in D-60 ${RASHI_NAMES[d60DispositorSign]?.englishName}, whose sign aspects (${aspectNames}) do not reach D-60 Lagna in ${RASHI_NAMES[d60Lagna]?.englishName}.`,
  };

  const passedCount = (c1Passed ? 1 : 0) + (c2Passed ? 1 : 0) + (c3Passed ? 1 : 0);
  const scorePercent = Math.round((passedCount / 3) * 100);

  let verdict: ChitkaraBtrTriadResult["verdict"] = "RECTIFICATION_REQUIRED";
  let verdictTitle = "🛑 Birth Time Rectification Required (<= 1/3 Conditions Met)";
  let verdictDescription =
    "Hospital recorded time deviates from the true umbilical cord severance epoch. Automated BTR scan identifies the exact cord-cutting moment.";

  if (passedCount === 3) {
    verdict = "PERFECT_ACCURACY";
    verdictTitle = "🌟 Perfect Birth Moment Accuracy (3/3 Conditions Met)";
    verdictDescription =
      "All 3 harmonic tests across Navamsha (D-9) and Shashtiamsha (D-60) pass at 100%. The recorded birth time matches the exact umbilical cord severance (Bhūpatana Lagna) with supreme shastric precision.";
  } else if (passedCount === 2) {
    verdict = "HIGH_PROXIMITY";
    verdictTitle = "⚠️ High Proximity (2/3 Conditions Met)";
    verdictDescription =
      "Two conditions match; minor sub-minute or 1–2 minute adjustment locks all 3 harmonic coordinates.";
  }

  const rahuMetaphysicsNote =
    "Humans reincarnate driven by Rahu (unfulfilled material desires). The umbilical cord attached to the navel resembles Rahu's serpent tethering the child to the maternal bloodstream. Birth occurs when the cord is severed (Naala-Chhedana), initiating independent Prana.";

  let rectificationCandidate: ChitkaraRectificationCandidate | undefined = undefined;
  if (includeScanner && passedCount < 3) {
    rectificationCandidate = scanChitkaraRectificationCandidate(natalEphemeris, 10, 15);
  }

  return {
    condition1D9MoonPP: c1Detail,
    condition2D60VenusPP: c2Detail,
    condition3D60KetuDispositorLagna: c3Detail,
    passedCount,
    scorePercent,
    verdict,
    verdictTitle,
    verdictDescription,
    rahuMetaphysicsNote,
    rectificationCandidate,
  };
}

/**
 * 4B. Tri-Epoch Birth Moment Evaluation (Adhana vs Shirodarshana vs Bhupatana)
 * Grounded in Maharshi Parashara (BPHS), Acharya Varahamihira (Brihat Jataka Ch. 4),
 * and modern Astro-Scientist consensus (Navneet Chitkara).
 */
export function evaluateTriEpochBirthMoment(natalEphemeris: EphemerisResult): TriEpochBirthMomentResult {
  const birthDate = new Date(natalEphemeris.utcDate);
  const location = natalEphemeris.location;
  const tzOffset = location?.timezoneOffsetHours || 5.5;
  const localDate = new Date(birthDate.getTime() + tzOffset * 3600 * 1000);

  const formatTimeStr = (d: Date) => {
    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mm = String(d.getUTCMinutes()).padStart(2, "0");
    const ss = String(d.getUTCSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  const recordedBirthLocalTime = formatTimeStr(localDate);
  const recordedBirthDateStr = localDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  // 1. Adhana Lagna (Conception Epoch)
  const adhanaResult = calculateAdhanaKundali(natalEphemeris, birthDate, location);
  const adhanaAscDegree = adhanaResult.adhanaEphemeris.ascendant.siderealLongitude % 30;

  // 2. Shirodarshana Lagna (Crown Emergence ~15-25 mins prior to civil delivery)
  const crownOffsetMinutes = 20;
  const crownLocalDate = new Date(localDate.getTime() - crownOffsetMinutes * 60 * 1000);
  const crownTimeRange = `${formatTimeStr(crownLocalDate)} – ${formatTimeStr(new Date(localDate.getTime() - 10 * 60 * 1000))} (~10–20 mins prior to delivery)`;

  const natalAscLon = natalEphemeris.ascendant.siderealLongitude;
  const crownAscLon = (natalAscLon - (crownOffsetMinutes / 4) + 360) % 360;
  const crownRashiIdx = Math.floor(crownAscLon / 30);
  const crownRashiName = RASHI_NAMES[crownRashiIdx].englishName;
  const civilRashiIdx = Math.floor(natalAscLon / 30);
  const civilRashiName = RASHI_NAMES[civilRashiIdx].englishName;
  const isLagnaSignSameAsBhupatana = crownRashiIdx === civilRashiIdx;

  // 3. Bhupatana Lagna (Civil Delivery / Umbilical Cord Severance)
  const civilAscDegree = natalAscLon % 30;

  // 4. D-60 Vulnerability Telemetry
  const sensitivities = calculateVargaSensitivities(natalEphemeris);
  const d60Node = sensitivities.find((s) => s.vargaId === "D60");
  const d60ElapsedSec = d60Node?.elapsedSecondsInCurrentSign ?? 60;
  const d60RemSec = d60Node?.remainingSecondsInCurrentSign ?? 60;
  const d60TotalSpan = d60Node?.timeSpanSecondsTotal ?? 120;
  const d60Level = d60Node?.boundaryVulnerabilityIndex ?? "SECURE";

  const bufferDescription = `${Math.floor(d60ElapsedSec / 60)}m ${d60ElapsedSec % 60}s elapsed, ${Math.floor(d60RemSec / 60)}m ${d60RemSec % 60}s remaining in D-60 sign`;
  let d60Rec = "Birth moment is well-centered in the current D-60 Shashtiamsha window with ample second-level buffer.";
  if (d60Level === "CRITICAL_SENSITIVE") {
    d60Rec = `CRITICAL WARNING: Native's recorded birth time is within ${Math.min(d60ElapsedSec, d60RemSec)} seconds of a D-60 boundary shift! An error of less than 1 minute changes the Shashtiamsha chart and past karmic root causes. Multi-varga BTR verification is highly recommended.`;
  } else if (d60Level === "MODERATE_SENSITIVE") {
    d60Rec = `MODERATE CAUTION: Native sits ${Math.min(d60ElapsedSec, d60RemSec)} seconds from a D-60 boundary shift. Check past life turning points to lock precision.`;
  }

  const shastricSynthesis = `In classical Vedic Jyotish, three moments mark the incarnation of a soul: (1) Adhana Lagna (conception epoch when the genetic & karmic seed forms), (2) Shirodarshana Lagna (the emergence of the crown during labor), and (3) Bhupatana Lagna (the severance of the umbilical cord and first independent breath/cry). As taught by Maharshi Parashara, Acharya Varahamihira, and modern master Astro-Scientist Navneet Chitkara, Bhupatana Lagna is the universal, legally recorded civil standard for casting the natal horoscope because independent pulmonary circulation (Prana) begins only upon separation from the mother. However, because hospital clocks often possess an error margin of 2–15 minutes, Birth Time Rectification (BTR) across D-60 (2-minute window) and D-9 (13.3-minute window) is required to certify that the recorded birth time matches real-life destiny events.`;

  const chitkaraBtrTriad = evaluateChitkaraBtrTriad(natalEphemeris);

  return {
    recordedBirthLocalTime,
    recordedBirthDateStr,
    adhanaEpoch: {
      conceptionDateStr: adhanaResult.estimatedConceptionDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      gestationDays: adhanaResult.gestationDurationDays,
      adhanaLagnaSign: adhanaResult.adhanaLagnaSign,
      adhanaLagnaLord: adhanaResult.adhanaLagnaLord,
      adhanaLagnaDegrees: Math.round(adhanaAscDegree * 100) / 100,
      adhanaMoonSign: adhanaResult.adhanaMoonSign,
      adhanaMoonNakshatra: adhanaResult.adhanaMoonNakshatra,
      significance: "The moment the soul enters the maternal womb; the cosmic seed packet is sealed (Brihat Jataka Ch. 4).",
    },
    shirodarshanaEpoch: {
      estimatedTimeRange: crownTimeRange,
      estimatedMinutesBeforeDelivery: crownOffsetMinutes,
      estimatedLagnaSign: crownRashiName,
      isLagnaSignSameAsBhupatana,
      significance: "The physical crown emerges into the terrestrial atmosphere, but the infant is still nourished by maternal respiration through the pulsing umbilical cord.",
    },
    bhupatanaEpoch: {
      civilBirthTime: recordedBirthLocalTime,
      civilLagnaSign: civilRashiName,
      civilLagnaDegrees: Math.round(civilAscDegree * 100) / 100,
      umbilicalSeveranceEvent: "Umbilical cord clamped and severed (Naala-Chhedana).",
      firstBreathPranaEvent: "First independent breath and cry (Prathama Shwasa / Rodana), establishing the earthly prana-kundali.",
      isUniversalBaseline: true,
      significance: "The universal shastric & legal baseline for casting horoscopes (Maharshi Parashara & Astro Scientist Navneet Chitkara).",
    },
    d60VulnerabilityStatus: {
      d60Sign: d60Node?.currentAscendantSign ?? civilRashiName,
      elapsedSeconds: d60ElapsedSec,
      remainingSeconds: d60RemSec,
      totalSpanSeconds: d60TotalSpan,
      bufferDescription,
      vulnerabilityLevel: d60Level,
      recommendation: d60Rec,
    },
    chitkaraBtrTriad,
    shastricSynthesis,
  };
}

/**
 * 5. Full Chronological Vimshottari Life Timeline (Birth to Age 80+)
 */
export function buildFullChronologicalDashaTimeline(
  natalEphemeris: EphemerisResult
): ChronologicalDashaWindow[] {
  const birthDate = new Date(natalEphemeris.utcDate);
  const moonLon = natalEphemeris.planets.Moon?.siderealLongitude || 0;
  const dashaResult = calculateVimshottariDasha(birthDate, moonLon, new Date());

  const windows: ChronologicalDashaWindow[] = [];
  const birthMs = birthDate.getTime();
  const msInYear = 365.2425 * 24 * 3600 * 1000;

  const ascSign = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const SIGN_RULERS = [
    "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
    "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
  ];

  const getHousesRuledBy = (planetName: string): number[] => {
    const ruled: number[] = [];
    for (let h = 1; h <= 12; h++) {
      const signIdx = (ascSign + h - 1) % 12;
      if (SIGN_RULERS[signIdx] === planetName) {
        ruled.push(h);
      }
    }
    return ruled;
  };

  const getDynamicPlanetHouses = (planetName: string): number[] => {
    const pObj = (natalEphemeris.planets as any)[planetName];
    const occupiedHouse = pObj?.house || 1;
    if (planetName === "Rahu" || planetName === "Ketu") {
      // BPHS Ch. 47: Nodes act through occupied house, conjoined planets' lordships, and sign dispositor
      const nodeSignIdx = Math.floor((pObj?.siderealLongitude || 0) / 30);
      const dispositor = SIGN_RULERS[nodeSignIdx];
      const dispHouse = (natalEphemeris.planets as any)[dispositor]?.house || occupiedHouse;
      const dispRuled = getHousesRuledBy(dispositor);
      const conjoinedRuled: number[] = [];
      Object.values(natalEphemeris.planets).forEach((other: any) => {
        if (!other.isModernPlanet && other.name !== planetName && other.house === occupiedHouse) {
          conjoinedRuled.push(...getHousesRuledBy(other.name));
        }
      });
      return Array.from(new Set([occupiedHouse, dispHouse, ...dispRuled, ...conjoinedRuled]));
    }
    return Array.from(new Set([occupiedHouse, ...getHousesRuledBy(planetName)]));
  };

  const eighthSignIdx = (ascSign + 7) % 12;
  const eighthLord = SIGN_RULERS[eighthSignIdx];
  const eleventhSignIdx = (ascSign + 10) % 12;
  const eleventhLord = SIGN_RULERS[eleventhSignIdx];
  const twelfthSignIdx = (ascSign + 11) % 12;
  const twelfthLord = SIGN_RULERS[twelfthSignIdx];

  const fifthOccupants = Object.values(natalEphemeris.planets)
    .filter((p: any) => !p.isModernPlanet && p.house === 5)
    .map((p: any) => p.name);
  const hasVidhyaBhangaSeed =
    fifthOccupants.includes("Rahu") ||
    fifthOccupants.includes("Ketu") ||
    fifthOccupants.includes(eighthLord) ||
    fifthOccupants.includes("Saturn");

  const BHAVA_ARCHETYPE_SHORT: Record<number, string> = {
    1: "Self/Identity & Vitality",
    2: "Family, Speech & Sustenance",
    3: "Courage, Self-Effort & Short Moves",
    4: "Home, Mother, Roots & Inner Peace",
    5: "Intellect/Skill, Study, Risk/Speculation & Heart",
    6: "Struggle, Daily Work, Debt/Health & Obstacles",
    7: "Partnerships, Alliances & Public Dealings",
    8: "Sudden Shocks, Breaks, Crisis & Deep Transformation",
    9: "Fortune, Mentors, Long Journeys & Higher Purpose",
    10: "Livelihood, Action, Karma & Public Duty",
    11: "Gains, Community, Goals & Milestone Fulfillment",
    12: "Distant/Foreign Lands, Uprooting, Loss & Solitude",
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  for (const md of dashaResult.mahadashas) {
    for (const ad of md.antardashas) {
      const ageStart = Math.max(0, (ad.startDate.getTime() - birthMs) / msInYear);
      const ageEnd = (ad.endDate.getTime() - birthMs) / msInYear;
      const midAge = (ageStart + ageEnd) / 2;

      const mdHouses = getDynamicPlanetHouses(md.lord.name);
      const adHouses = getDynamicPlanetHouses(ad.lord.name);
      const activatedHouses = Array.from(new Set([...mdHouses, ...adHouses]));

      const topThemes = activatedHouses
        .slice(0, 3)
        .map((h) => `H${h} (${BHAVA_ARCHETYPE_SHORT[h] || "Karma"})`)
        .join(" + ");

      let stagePrefix = "Early Childhood";
      if (midAge >= 7 && midAge < 14) stagePrefix = "Formative Youth";
      else if (midAge >= 14 && midAge < 20) stagePrefix = "Adolescent Transition";
      else if (midAge >= 20 && midAge < 27) stagePrefix = "Young Adult Foundation";
      else if (midAge >= 27 && midAge < 38) stagePrefix = "Prime Adult Karma";
      else if (midAge >= 38 && midAge < 52) stagePrefix = "Mid-Life Consolidation";
      else if (midAge >= 52 && midAge < 66) stagePrefix = "Elder Stewardship";
      else if (midAge >= 66) stagePrefix = "Ripened Wisdom & Liberation";

      let specialFlag = "";
      if (
        hasVidhyaBhangaSeed &&
        midAge >= 14 &&
        midAge < 21 &&
        (ad.lord.name === "Rahu" || ad.lord.name === "Ketu" || ad.lord.name === eighthLord || md.lord.name === eighthLord)
      ) {
        specialFlag = " • ⚠️ 5th/8th/Nodal Shock: Sudden Break, Setback, Drop/Detour or Redirection Before Recovery";
      } else if (midAge >= 18 && (ad.lord.name === twelfthLord || adHouses.includes(12))) {
        specialFlag = " • ✈️ 12th-Axis: Uprooting, Distant/Foreign Relocation or Solitude Portal";
      } else if (midAge >= 18 && (ad.lord.name === eleventhLord || adHouses.includes(11))) {
        specialFlag = " • 🎯 11th-Axis: Goal/Skill/Milestone Completion & Network Gains";
      }

      const lifePhaseTitle = `${stagePrefix}: ${topThemes}${specialFlag}`;

      windows.push({
        mahadashaLord: md.lord.name,
        antardashaLord: ad.lord.name,
        startDate: ad.startDate,
        endDate: ad.endDate,
        startFormatted: formatDate(ad.startDate),
        endFormatted: formatDate(ad.endDate),
        nativeAgeStart: Math.round(ageStart * 10) / 10,
        nativeAgeEnd: Math.round(ageEnd * 10) / 10,
        lifePhaseTitle,
        primaryHouseActivations: activatedHouses,
      });
    }
  }

  return windows;
}

/**
 * 6. Locate exact running Dasha period on any given historical or future date
 */
export function locateDashaAtExactDate(
  natalEphemeris: EphemerisResult,
  targetDate: Date
): {
  mahadasha: string;
  antardasha: string;
  pratyantardasha: string;
  mdSpan: string;
  adSpan: string;
  pdSpan: string;
} {
  const birthDate = new Date(natalEphemeris.utcDate);
  const moonLon = natalEphemeris.planets.Moon?.siderealLongitude || 0;
  const dashaResult = calculateVimshottariDasha(birthDate, moonLon, targetDate);

  if (!dashaResult.activeDasha) {
    return {
      mahadasha: "Unknown",
      antardasha: "Unknown",
      pratyantardasha: "Unknown",
      mdSpan: "N/A",
      adSpan: "N/A",
      pdSpan: "N/A",
    };
  }

  const ad = dashaResult.activeDasha;
  const formatDate = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return {
    mahadasha: ad.mahadasha.name,
    antardasha: ad.antardasha.name,
    pratyantardasha: ad.pratyantardasha.name,
    mdSpan: `${formatDate(ad.mdStart)} – ${formatDate(ad.mdEnd)}`,
    adSpan: `${formatDate(ad.adStart)} – ${formatDate(ad.adEnd)}`,
    pdSpan: `${formatDate(ad.pdStart)} – ${formatDate(ad.pdEnd)}`,
  };
}

/**
 * 7. Master BTR Synthesis Generator for the Astro Chatbot Dossier
 */
export function generateBtrMasterSummary(
  natalEphemeris: EphemerisResult,
  gender: "male" | "female" = "male"
): string {
  const birthDate = new Date(natalEphemeris.utcDate);
  const location = natalEphemeris.location;
  const tzOffset = location?.timezoneOffsetHours || 5.5;
  const localDate = new Date(birthDate.getTime() + tzOffset * 3600 * 1000);

  const kunda = calculateKundaShodhana(natalEphemeris);
  const pranapada = calculatePranapada(natalEphemeris);
  const tattva = calculateTattvaShodhana(natalEphemeris, gender);
  const sensitivities = calculateVargaSensitivities(natalEphemeris);
  const timeline = buildFullChronologicalDashaTimeline(natalEphemeris);
  const triEpoch = evaluateTriEpochBirthMoment(natalEphemeris);
  const chitkara = triEpoch.chitkaraBtrTriad || evaluateChitkaraBtrTriad(natalEphemeris);

  const hh = String(localDate.getUTCHours()).padStart(2, "0");
  const mm = String(localDate.getUTCMinutes()).padStart(2, "0");
  const ssNum = localDate.getUTCSeconds();
  const ssSuffix = ssNum > 0 ? `:${String(ssNum).padStart(2, "0")}` : "";
  const dateFormatted = localDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const sensitivityTable = sensitivities
    .map(
      (s) =>
        `- **${s.vargaName}:** Ascendant in **${s.currentAscendantSign}** (${s.currentAscendantDegrees.toFixed(2)}°) • Window: **${s.windowStartLocalTime} to ${s.windowEndLocalTime}** (Span: ${s.timeSpanMinutesTotal}m) • Buffer: *${s.boundaryCountdownFormatted || `${s.elapsedMinutesInCurrentSign}m elapsed, ${s.remainingMinutesInCurrentSign}m remaining`}* [${s.boundaryVulnerabilityIndex || "SECURE"}]${s.boundaryVulnerabilityIndex !== "SECURE" ? ` (Prev: ${s.previousAscendantSign} | Next: ${s.nextAscendantSign})` : ""}`
    )
    .join("\n");

  const timelineFormatted = timeline
    .slice(0, 18)
    .map(
      (t) =>
        `- **Age ${t.nativeAgeStart}–${t.nativeAgeEnd} (${t.startFormatted} – ${t.endFormatted}):** **${t.mahadashaLord} – ${t.antardashaLord}** [${t.lifePhaseTitle}] -> Houses ${t.primaryHouseActivations.join(", ")}`
    )
    .join("\n");

  // Compute Non-Linear Chronological Milestone & Anti-Rigidity Audit
  const ascSign = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const SIGN_RULERS = [
    "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
    "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
  ];
  const birthYear = localDate.getUTCFullYear();
  const fifthLord = SIGN_RULERS[(ascSign + 4) % 12];
  const eighthLord = SIGN_RULERS[(ascSign + 7) % 12];
  const ninthLord = SIGN_RULERS[(ascSign + 8) % 12];
  const eleventhLord = SIGN_RULERS[(ascSign + 10) % 12];
  const twelfthLord = SIGN_RULERS[(ascSign + 11) % 12];

  const fifthOccupants = Object.values(natalEphemeris.planets)
    .filter((p: any) => !p.isModernPlanet && p.house === 5)
    .map((p: any) => p.name);
  const fifthLordObj = (natalEphemeris.planets as any)[fifthLord];
  const fifthLordSign = Math.floor((fifthLordObj?.siderealLongitude || 0) / 30);
  const fifthLordDeg = (fifthLordObj?.siderealLongitude || 0) % 30;
  const isFifthLordDebilitated =
    (fifthLord === "Sun" && fifthLordSign === 6) ||
    (fifthLord === "Moon" && fifthLordSign === 7) ||
    (fifthLord === "Mars" && fifthLordSign === 3) ||
    (fifthLord === "Mercury" && fifthLordSign === 11) ||
    (fifthLord === "Jupiter" && fifthLordSign === 9) ||
    (fifthLord === "Venus" && fifthLordSign === 5) ||
    (fifthLord === "Saturn" && fifthLordSign === 0);
  const isFifthLordGandanta =
    ([3, 7, 11].includes(fifthLordSign) && fifthLordDeg >= 26.66) ||
    ([0, 4, 8].includes(fifthLordSign) && fifthLordDeg <= 3.33);

  const hasVidhyaBhanga =
    isFifthLordDebilitated ||
    isFifthLordGandanta ||
    fifthOccupants.includes("Rahu") ||
    fifthOccupants.includes("Ketu") ||
    fifthOccupants.includes(eighthLord);

  const nodalReturnYear = Math.round(birthYear + 18.6);
  const adAt18 = timeline.find((w) => w.nativeAgeStart <= 18.6 && w.nativeAgeEnd >= 18.0);
  const adGrad = timeline.find(
    (w) =>
      w.nativeAgeStart <= 23.8 &&
      w.nativeAgeEnd >= 21.5 &&
      (w.antardashaLord === eleventhLord || w.antardashaLord === fifthLord || w.antardashaLord === ninthLord || w.primaryHouseActivations.includes(11))
  );
  const adForeign = timeline.find(
    (w) =>
      w.nativeAgeStart <= 26.5 &&
      w.nativeAgeEnd >= 22.0 &&
      (w.antardashaLord === twelfthLord || w.primaryHouseActivations.includes(12))
  );

  const nonLinearAuditLines: string[] = [
    `  * 🌍 **Desha-Kaala-Paatra (Universal Human Spectrum Law — BPHS Ch. 1 & Prasna Marga):** NEVER assume a single sociological template (e.g., never assume the native went to school/college, works a corporate job, or followed a middle-class conveyor belt). Read each Dasha-Transit window first as **pure planetary & Bhava energy** and adapt it to the native's real walk of life!`,
  ];
  if (hasVidhyaBhanga) {
    const breakReasons: string[] = [];
    if (fifthOccupants.length > 0) breakReasons.push(`5th House occupied by ${fifthOccupants.join(" + ")}`);
    if (isFifthLordDebilitated) breakReasons.push(`5th Lord ${fifthLord} Debilitated`);
    if (isFifthLordGandanta) breakReasons.push(`5th Lord ${fifthLord} in Gandānta (${fifthLordDeg.toFixed(1)}°)`);
    nonLinearAuditLines.push(
      `  * ⚠️ **5th/8th/Nodal Disruption Signature (*Bhanga / Parivartana*):** YES (${breakReasons.join("; ")}). Indicates a non-linear life path with sudden breaks, detours, or self-forged reinvention rather than a smooth textbook trajectory.`
    );
    nonLinearAuditLines.push(
      `  * 🌪️ **18.6-Year Nodal Return & 8th-Lord Shock Window (~${nodalReturnYear - 1}–${nodalReturnYear}, Age ~18–19):** Under **${adAt18 ? `${adAt18.mahadashaLord}–${adAt18.antardashaLord} (${adAt18.startFormatted} – ${adAt18.endFormatted})` : "Nodal Return"}**, when Transit Rahu-Ketu returns to its natal axis and activates the 5th/8th axis, the native experiences a **sharp life detour, setback, or directional break around ${nodalReturnYear}** (e.g., for a student: a Class 12 / exam setback or 1-year drop; for a non-student/worker: a sudden livelihood, emotional, or family upheaval), followed by **recovery and a new foundation in ${nodalReturnYear + 1}** once Transit Jupiter aspects the 5th/9th axis.`
    );
    nonLinearAuditLines.push(
      `  * 🎯 **Shifted Milestone Completion Window (~${nodalReturnYear + 5}, Age ~23–24):** Because of the ~1-year restructuring around age 18–19, the subsequent 4-year cycle of skill/study/work foundation culminates around **${nodalReturnYear + 5}** (under **${adGrad ? `${adGrad.mahadashaLord}–${adGrad.antardashaLord} (${adGrad.startFormatted} – ${adGrad.endFormatted})` : `11th Lord ${eleventhLord}`}**, activating House 11 of fulfillment/completion), NOT at a rigid age-21 template!`
    );
  } else {
    nonLinearAuditLines.push(
      `  * ✅ **5th/9th Axis Continuity:** Unafflicted 5th/9th foundation supports steady skill, learning, or creative development according to the native's background and active Dasha lords.`
    );
  }
  if (adForeign) {
    nonLinearAuditLines.push(
      `  * ✈️ **12th-House Uprooting / Distant Relocation & Saturnian Maturation Rule:** **${adForeign.mahadashaLord}–${adForeign.antardashaLord} (${adForeign.startFormatted} – ${adForeign.endFormatted})** activates 12th Lord **${twelfthLord}** (Houses ${adForeign.primaryHouseActivations.join(", ")}). Per Saturnian delay & transit lock laws, the first half of this sub-period completes prior domestic duties/foundations (e.g. **${nodalReturnYear + 5}**), while **actual physical uprooting or border crossing to a distant/foreign land manifests in the second half (around ${nodalReturnYear + 6})** when Transit Saturn in the 12th house and Transit Rahu/Ketu on the 1st-7th Lagna axis trigger physical departure.`
    );
  }
  const nonLinearAuditBlock = nonLinearAuditLines.join("\n");

  const now = new Date();
  const nativeAgeYears = Math.max(0, (now.getTime() - birthDate.getTime()) / (365.25 * 24 * 3600 * 1000));
  let lifeStageTitle = "Adult (Praudha Jataka - प्रौढ़ जातक)";
  let lifeStageGuidance = "Cross-examine real-world life events across ALL human possibilities (livelihood/work/trade, health/vitality shifts, relocations, relationships, family events, or formal/informal skill milestones) without assuming any fixed societal script.";
  if (nativeAgeYears < 3) {
    lifeStageTitle = `Newborn / Infant (Bala Jataka - बाल जातक, Age: ${nativeAgeYears < 1 ? "< 1 year" : `${Math.floor(nativeAgeYears)} yr(s)`})`;
    lifeStageGuidance = "CRITICAL: Native is an infant/newborn! DO NOT probe or ask about adult life milestones. Birth time is rectified strictly via Parashari mathematical Shodhanas (Kunda, Pranapada, Tattva), delivery circumstances (normal vs surgical/induced), and parental indicators (D-12).";
  } else if (nativeAgeYears < 18) {
    lifeStageTitle = `Child / Minor (Kishora Jataka - किशोर जातक, Age: ${Math.floor(nativeAgeYears)} yrs)`;
    lifeStageGuidance = "Native is a child/minor. Focus on childhood vitality, family environment, sibling dynamics, and natural talents/curiosity (whether in formal schooling, arts, crafts, or practical life). DO NOT ask about marriage or adult career.";
  } else if (nativeAgeYears < 25) {
    lifeStageTitle = `Young Adult (Yuva Jataka - युवा जातक, Age: ${Math.floor(nativeAgeYears)} yrs)`;
    lifeStageGuidance = "Native is a young adult. Explore formative turning points (age 15–24) openly across all life paths—whether independent hustle/work, trade/skill mastery, family responsibilities, relocations, emotional/health shifts, or academic/exam milestones.";
  }

  const chitkaraCandidateStr = chitkara.rectificationCandidate
    ? `**${chitkara.rectificationCandidate.rectifiedLocalTime}** (Delta: **${chitkara.rectificationCandidate.deltaFormatted}** • D-60 Lagna: **${chitkara.rectificationCandidate.d60LagnaSign}** • Score: **${chitkara.rectificationCandidate.score}/3**) -> *${chitkara.rectificationCandidate.clinicalNote}*`
    : "Current recorded birth time is 100% verified (3/3).";

  return `
#### ⏱️ 73. CLASSICAL BIRTH TIME RECTIFICATION (BTR), PRANAPADA, KUNDA, TATTVA & FULL EVENT DASHA TIMELINE:
- 📍 **Recorded Birth Moment:** **${dateFormatted} at ${hh}:${mm}${ssSuffix}** in **${location?.cityName || "Patna"}, ${location?.country || "India"}**
- 👶 **Native Life Stage & Age:** **${lifeStageTitle}** (Running Age: ~${(Math.round(nativeAgeYears * 10) / 10).toFixed(1)} yrs)
  * *Guidance:* ${lifeStageGuidance}
- 🧬 **The 3 Classical Birth Epochs (Adhana, Shirodarshana, Bhupatana - Navneet Chitkara & BPHS):**
  * 1️⃣ **Adhana Lagna (Conception Epoch):** Conception on **${triEpoch.adhanaEpoch.conceptionDateStr}** (Gestation: **${triEpoch.adhanaEpoch.gestationDays} days**) • Adhana Lagna in **${triEpoch.adhanaEpoch.adhanaLagnaSign}** (Lord: ${triEpoch.adhanaEpoch.adhanaLagnaLord}) • Moon in ${triEpoch.adhanaEpoch.adhanaMoonSign} (${triEpoch.adhanaEpoch.adhanaMoonNakshatra})
  * 2️⃣ **Shirodarshana Lagna (Crown Emergence):** Approx **${triEpoch.shirodarshanaEpoch.estimatedTimeRange}** • Ascendant in **${triEpoch.shirodarshanaEpoch.estimatedLagnaSign}** (${triEpoch.shirodarshanaEpoch.isLagnaSignSameAsBhupatana ? "Same sign as delivery" : "Sign transitioned before delivery"})
  * 3️⃣ **Bhupatana Lagna (Umbilical Severance & First Breath):** **${triEpoch.recordedBirthLocalTime}** (Civil Birth Time) • Ascendant in **${triEpoch.bhupatanaEpoch.civilLagnaSign} (${triEpoch.bhupatanaEpoch.civilLagnaDegrees.toFixed(2)}°)**. Severance of umbilical cord (*Naala-Chhedana*) & independent pulmonary respiration (*Prathama Shwasa*). This is the universal shastric & legal baseline for casting horoscopes.
- 🔬 **Navneet Chitkara 3-Point BTR Verification & Umbilical Severance Telemetry:**
  * 🐍 *Metaphysical Law:* Humans reincarnate through Rahu; the umbilical cord coiled at the navel is Rahu's serpent. Independent incarnation locks at cord severance (*Naala-Chhedana*).
  * 1️⃣ **Condition 1 (D-9 Moon vs D-9 Pranapada):** ${chitkara.condition1D9MoonPP.passed ? "✅ PASS" : "❌ FAIL"} -> ${chitkara.condition1D9MoonPP.explanation}
  * 2️⃣ **Condition 2 (D-60 Pranapada vs D-60 Venus):** ${chitkara.condition2D60VenusPP.passed ? "✅ PASS" : "❌ FAIL"} -> ${chitkara.condition2D60VenusPP.explanation}
  * 3️⃣ **Condition 3 (D-60 Ketu Dispositor Jaimini Rashi Drishti on D-60 Lagna):** ${chitkara.condition3D60KetuDispositorLagna.passed ? "✅ PASS" : "❌ FAIL"} -> ${chitkara.condition3D60KetuDispositorLagna.explanation}
  * 🎯 **Master BTR Verification Score:** **${chitkara.passedCount} / 3 (${chitkara.scorePercent}%)** • **[${chitkara.verdictTitle}]**
  * ⏱️ **Rectified Birth Moment Candidate:** ${chitkaraCandidateStr}
- 🚨 **Real-Time D-60 (Shashtiamsha) Boundary Vulnerability Telemetry:**
  * Current D-60 Sign: **${triEpoch.d60VulnerabilityStatus.d60Sign}** • Total Span: 120 seconds (2.0 minutes)
  * Real-Time Buffer: **${triEpoch.d60VulnerabilityStatus.bufferDescription}**
  * Vulnerability Level: **[${triEpoch.d60VulnerabilityStatus.vulnerabilityLevel}]** -> ${triEpoch.d60VulnerabilityStatus.recommendation}
- 📐 **Kunda Shodhana (कुण्ड शोधन - BPHS):**
  * Kunda Point: **${kunda.kundaRashi} (${kunda.kundaDegrees.toFixed(2)}°)** in Nakshatra **${kunda.kundaNakshatra}**
  * Harmony with Moon (${kunda.janmaNakshatraName}) & Lagna (${kunda.lagnaNakshatraName}): **${kunda.harmonyScorePercent}% Match** (${kunda.classicalVerdict})
- 🫁 **Pranapada Lagna (प्राणपद लग्न - BPHS Ch. 5):**
  * Pranapada Longitude: **${pranapada.pranapadaRashi} (${pranapada.pranapadaDegrees.toFixed(2)}°)** -> House **${pranapada.pranapadaHouseFromLagna} from Lagna** (${pranapada.classicalVerdict})
- 🌿 **Tattva & Antar-Tattva Shodhana (तत्व शोधन):**
  * Primary Tattva: **${tattva.primaryTattva}** | Active Antar-Tattva: **${tattva.antarTattva} (${tattva.antarTattvaGender})** -> ${tattva.classicalVerdict}
- ⏳ **Varga Sensitivity Windows (Exact Time Range Before Sub-Chart Ascendants Shift):**
${sensitivityTable}
- 📜 **Full Chronological Vimshottari Event Timeline (Exact MD-AD Periods):**
${timelineFormatted}
- 🧭 **Non-Linear Chronological Milestone & Anti-Rigidity Audit (K.N. Rao PAC-DARES & BPHS):**
${nonLinearAuditBlock}
- ⚖️ **Shastric Sensitivity Law (K.N. Rao & BPHS):**
  * **Dasha Shift Formula:** 1 minute of clock difference = ~6.08 days of Dasha shift.
  * A ±5 minute clock uncertainty alters Dasha boundaries by **ONLY ~30 DAYS (1 month)**, NEVER by years!
  * Whole years do NOT change with minutes; only Varga Ascendants (D-9, D-10, D-24, D-60) and Pratyantardashas (PDs) lock down the exact birth minute.
`;
}
