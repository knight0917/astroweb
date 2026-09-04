/**
 * Classical Birth Time Rectification (BTR) & Life Event Chronology Engine
 * Grounded in Brihat Parashara Hora Shastra (BPHS Ch. 5: Janma Samaya Shodhana),
 * Brihat Jataka (Ch. 4: Adhana Niyama), Deva Keralam (Chandra Kala Nadi),
 * Jataka Parijata, and K.N. Rao / Dr. B.V. Raman Event-Based Multi-Varga Rectification.
 */

import { EphemerisResult } from "./types";
import { calculateVimshottariDasha, VimshottariDashaResult, ActiveDashaPeriod } from "./dasha";
import { calculateShodashavargaChart } from "./shodashavarga";
import { RASHI_NAMES } from "./constants";

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

export interface BtrMasterReport {
  recordedLocalTime: string;
  recordedDateStr: string;
  cityName: string;
  kundaShodhana: KundaShodhanaResult;
  pranapada: PranapadaResult;
  tattvaShodhana: TattvaShodhanaResult;
  vargaSensitivities: VargaSensitivityNode[];
  fullLifeDashaTimeline: ChronologicalDashaWindow[];
  dashaToClockSensitivityRule: string;
  masterBtrVerdict: string;
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

  const localHoursDecimal = localDate.getUTCHours() + localDate.getUTCMinutes() / 60;
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

    const winStartDate = new Date(localDate.getTime() - elapsedMinutesInCurrentSign * 60 * 1000);
    const winEndDate = new Date(localDate.getTime() + remainingMinutesInCurrentSign * 60 * 1000);

    const vChart = calculateShodashavargaChart(natalEphemeris, v.id as any);
    const currentSign = vChart.ascendant?.vargaRashi?.englishName || "Virgo";
    const currentDeg = (ascLon % v.spanDeg);

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
    });
  }

  return results;
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

  const HOUSE_ACTIVATION_MAP: Record<string, number[]> = {
    Sun: [1, 9, 10],
    Moon: [4, 1, 11],
    Mars: [3, 8, 10],
    Rahu: [11, 6, 12],
    Jupiter: [5, 9, 2, 7],
    Saturn: [10, 11, 6, 8],
    Mercury: [1, 4, 10, 5],
    Ketu: [12, 8, 9],
    Venus: [2, 7, 4, 9],
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  for (const md of dashaResult.mahadashas) {
    for (const ad of md.antardashas) {
      const ageStart = Math.max(0, (ad.startDate.getTime() - birthMs) / msInYear);
      const ageEnd = (ad.endDate.getTime() - birthMs) / msInYear;

      let lifePhaseTitle = "Foundational Early Years";
      if (ageStart >= 12 && ageEnd <= 19) lifePhaseTitle = "Schooling & Adolescent Education";
      else if (ageStart >= 19 && ageEnd <= 25) lifePhaseTitle = "Higher Education, Degree & Career Launch";
      else if (ageStart >= 25 && ageEnd <= 35) lifePhaseTitle = "Career Consolidation, Marriage & Family Expansion";
      else if (ageStart >= 35 && ageEnd <= 50) lifePhaseTitle = "Peak Professional Authority & Wealth Building";
      else if (ageStart >= 50 && ageEnd <= 65) lifePhaseTitle = "Maturity, Social Influence & Mentorship";
      else if (ageStart >= 65) lifePhaseTitle = "Spiritual Wisdom & Legacy Phase";

      const activatedHouses = Array.from(
        new Set([...(HOUSE_ACTIVATION_MAP[md.lord.name] || []), ...(HOUSE_ACTIVATION_MAP[ad.lord.name] || [])])
      );

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

  const hh = String(localDate.getUTCHours()).padStart(2, "0");
  const mm = String(localDate.getUTCMinutes()).padStart(2, "0");
  const dateFormatted = localDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const sensitivityTable = sensitivities
    .map(
      (s) =>
        `- **${s.vargaName}:** Ascendant in **${s.currentAscendantSign}** (${s.currentAscendantDegrees.toFixed(2)}°) • Total Span: **${s.timeSpanMinutesTotal} mins** • Current Window: **${s.windowStartLocalTime} to ${s.windowEndLocalTime}** (Elapsed: ${s.elapsedMinutesInCurrentSign}m, Remaining: ${s.remainingMinutesInCurrentSign}m)`
    )
    .join("\n");

  const timelineFormatted = timeline
    .slice(0, 16)
    .map(
      (t) =>
        `- **Age ${t.nativeAgeStart}–${t.nativeAgeEnd} (${t.startFormatted} – ${t.endFormatted}):** **${t.mahadashaLord} – ${t.antardashaLord}** [${t.lifePhaseTitle}] -> Houses ${t.primaryHouseActivations.join(", ")}`
    )
    .join("\n");

  const now = new Date();
  const nativeAgeYears = Math.max(0, (now.getTime() - birthDate.getTime()) / (365.25 * 24 * 3600 * 1000));
  let lifeStageTitle = "Adult (Praudha Jataka - प्रौढ़ जातक)";
  let lifeStageGuidance = "Standard adult life event cross-examination applies (higher learning, career shifts, marriage, progeny).";
  if (nativeAgeYears < 3) {
    lifeStageTitle = `Newborn / Infant (Bala Jataka - बाल जातक, Age: ${nativeAgeYears < 1 ? "< 1 year" : `${Math.floor(nativeAgeYears)} yr(s)`})`;
    lifeStageGuidance = "CRITICAL: Native is an infant/newborn! DO NOT probe or ask about adult life milestones like college graduation, career, or marriage. Birth time is rectified strictly via Parashari mathematical Shodhanas (Kunda, Pranapada, Tattva), delivery circumstances (normal vs surgical/induced), and parental indicators (D-12).";
  } else if (nativeAgeYears < 18) {
    lifeStageTitle = `Child / Minor (Kishora Jataka - किशोर जातक, Age: ${Math.floor(nativeAgeYears)} yrs)`;
    lifeStageGuidance = "Native is a child/minor. Only early childhood milestones (speech, sibling arrival, early schooling aptitude D-24) apply. DO NOT ask about marriage or adult career.";
  } else if (nativeAgeYears < 25) {
    lifeStageTitle = `Young Adult (Yuva Jataka - युवा जातक, Age: ${Math.floor(nativeAgeYears)} yrs)`;
    lifeStageGuidance = "Native is a young adult. Focus on 10th/12th board exams, college qualification, and first career foundation.";
  }

  return `
#### ⏱️ 73. CLASSICAL BIRTH TIME RECTIFICATION (BTR), PRANAPADA, KUNDA, TATTVA & FULL EVENT DASHA TIMELINE:
- 📍 **Recorded Birth Moment:** **${dateFormatted} at ${hh}:${mm}** in **${location?.cityName || "Patna"}, ${location?.country || "India"}**
- 👶 **Native Life Stage & Age:** **${lifeStageTitle}** (Running Age: ~${(Math.round(nativeAgeYears * 10) / 10).toFixed(1)} yrs)
  * *Guidance:* ${lifeStageGuidance}
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
- ⚖️ **Shastric Sensitivity Law (K.N. Rao & BPHS):**
  * **Dasha Shift Formula:** 1 minute of clock difference = ~6.08 days of Dasha shift.
  * A ±5 minute clock uncertainty alters Dasha boundaries by **ONLY ~30 DAYS (1 month)**, NEVER by years!
  * Whole years do NOT change with minutes; only Varga Ascendants (D-9, D-10, D-24, D-60) and Pratyantardashas (PDs) lock down the exact birth minute.
`;
}
