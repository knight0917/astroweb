/**
 * Crux of Vedic Astrology (Pt. Sanjay Rath) & Parashari Conditional Dashas Engine
 * References:
 * - "Crux of Vedic Astrology - Timing of Events" (Vols 1 & 2) by Pt. Sanjay Rath
 * - "Brihat Parashara Hora Shastra" (BPHS Ch. 46 - Conditional Nakshatra Dashas)
 * - "Vimsottari and Udu Dasas" by Pt. Sanjay Rath & V.P. Goel
 */

import {
  EphemerisResult,
  CruxOfAstrologyAnalysis,
  CruxBhavaReading,
  CruxNarayanaDashaPeriod,
  ParashariConditionalDasha,
} from "./types";
import { RASHI_NAMES } from "./constants";

const SIGN_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

const VARGA_DEITIES = [
  "Agni & Indra (Primordial Fire & Executive Will)",
  "Kubera (Lord of Celestial Treasury)",
  "Yama & Vayu (Courage & Dynamic Breath)",
  "Varuna (Celestial Waters & Domestic Nourishment)",
  "Brahma (Creative Intellect & Supreme Wisdom)",
  "Rakshasa & Kartikeya (Protective Shield & Martial Valor)",
  "Kamadeva & Lakshmi (Harmonious Union & Grace)",
  "Nirriti & Rudra (Deep Transformation & Esoteric Prana)",
  "Brihaspati / Guru (Divine Preceptor & Righteous Dharma)",
  "Indra & Maha Vishnu (Sovereign Governance & Sustenance)",
  "Kubera & Mitra (Inexhaustible Gains & Universal Friendship)",
  "Paramashiva (Moksha & Spiritual Transcendence)"
];

const BHAVA_NAMES = [
  "1st House (Tanu - Self & Bodily Radiance)",
  "2nd House (Dhana - Wealth, Speech & Lineage)",
  "3rd House (Bhratri - Courage & Communications)",
  "4th House (Matru / Sukha - Land, Home & Peace)",
  "5th House (Putra / Dhi - Creative Intellect & Devotion)",
  "6th House (Shatru / Roga - Overcoming Obstacles & Service)",
  "7th House (Kalatra - Marriage, Contracts & Partners)",
  "8th House (Randhra / Ayur - Longevity & Transformation)",
  "9th House (Dharma / Bhagya - Fortune & Higher Wisdom)",
  "10th House (Karma / Rajya - Profession & Status)",
  "11th House (Labha - Inflows, Gains & Network)",
  "12th House (Vyaya / Moksha - Sanctuary & Liberation)"
];

const BHAVA_KARAKAS = [
  "Sun (Soul / Vitality)",
  "Jupiter (Wealth / Speech)",
  "Mars (Courage / Siblings)",
  "Moon & Venus (Home / Comforts)",
  "Jupiter (Intellect / Progeny)",
  "Mars & Saturn (Protection / Service)",
  "Venus (Spouse / Contracts)",
  "Saturn (Longevity / Vulnerabilities)",
  "Jupiter & Sun (Dharma / Guru)",
  "Sun, Mercury, Jupiter, Saturn (Career)",
  "Jupiter (Gains / Fulfillment)",
  "Saturn & Ketu (Moksha / Sanctuary)"
];

export function evaluateCruxOfAstrology(natalEphemeris: EphemerisResult): CruxOfAstrologyAnalysis {
  const ascSign = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const birthYear = new Date(natalEphemeris.utcDate).getFullYear();
  const currentYear = new Date().getFullYear();
  const planets = natalEphemeris.planets;

  const getHouse = (p: string) => planets[p]?.house || 0;
  const getSign = (p: string) => Math.floor(planets[p]?.siderealLongitude / 30 || 0);

  // 1. Narayana Dasha (BPHS / Pt. Sanjay Rath)
  // For Movable signs -> 1st house initiates; Fixed signs -> 6th or 9th; Dual signs -> direct
  const isOddSign = ascSign % 2 === 0;
  const narayanaPeriods: CruxNarayanaDashaPeriod[] = [];
  let runningYear = birthYear;
  let activeNarayanaSign = RASHI_NAMES[ascSign].englishName;

  for (let i = 0; i < 12; i++) {
    const sSignIdx = isOddSign ? (ascSign + i) % 12 : ((ascSign - i) % 12 + 12) % 12;
    const signName = RASHI_NAMES[sSignIdx].englishName;
    const lordName = SIGN_LORDS[sSignIdx];
    const lordSign = getSign(lordName);

    // Duration calculation: count from sign to lord
    let duration = (lordSign - sSignIdx + 12) % 12;
    if (duration === 0) duration = 12;

    const startY = runningYear;
    const endY = startY + duration;
    runningYear = endY;

    const isCurrentlyActive = currentYear >= startY && currentYear < endY;
    if (isCurrentlyActive) {
      activeNarayanaSign = signName;
    }

    const lifeFocus = `Activates ${signName} and house ${(sSignIdx - ascSign + 12) % 12 + 1} themes`;
    const narayanaIndication = `Pt. Sanjay Rath: Period of ${signName} brings fruition of ${SIGN_LORDS[sSignIdx]}'s natal yogas and directional shifts.`;

    narayanaPeriods.push({
      signIndex: sSignIdx,
      signName,
      startYear: startY,
      endYear: endY,
      durationYears: duration,
      isActive: isCurrentlyActive,
      lifeFocus,
      narayanaIndication,
    });
  }

  // 2. 12 Bhavas Crux Analysis (Vols 1 & 2)
  const bhavaCruxReadings: CruxBhavaReading[] = [];
  for (let h = 0; h < 12; h++) {
    const hSign = (ascSign + h) % 12;
    const lord = SIGN_LORDS[hSign];
    const lSign = getSign(lord);
    const diff = (lSign - hSign + 12) % 12;
    let arudha = (lSign + diff) % 12;
    if (diff === 0) arudha = (hSign + 9) % 12;
    else if (diff === 6) arudha = (hSign + 3) % 12;

    const arudhaSign = RASHI_NAMES[arudha].englishName;
    const vargaDeity = VARGA_DEITIES[h];
    const karaka = BHAVA_KARAKAS[h];
    const bhavaName = BHAVA_NAMES[h];

    let dictum = "";
    if (h < 6) {
      dictum = `Crux Vol 1: Foundation of ${bhavaName.split(" - ")[0]} manifests through Arudha in ${arudhaSign} and ${karaka}.`;
    } else {
      dictum = `Crux Vol 2: Fruition of ${bhavaName.split(" - ")[0]} aligns with ${vargaDeity} and planetary partnerships.`;
    }

    const cruxSynthesis = `${bhavaName}: Ruled by ${lord} with Arudha projecting to ${arudhaSign}. Varga Devata: ${vargaDeity}.`;

    bhavaCruxReadings.push({
      bhava: h + 1,
      bhavaName,
      karaka,
      arudhaSign,
      vargaDeity,
      sanjayRathDictum: dictum,
      cruxSynthesis,
    });
  }

  // 3. Parashari Conditional Nakshatra Dashas (BPHS Ch. 46)
  const lagnaLord = SIGN_LORDS[ascSign];
  const seventhSign = (ascSign + 6) % 12;
  const seventhLord = SIGN_LORDS[seventhSign];
  const tenthSign = (ascSign + 9) % 12;
  const tenthLord = SIGN_LORDS[tenthSign];

  const conditionalDashas: ParashariConditionalDasha[] = [];

  // (1) Dwisaptati Sama Dasha (72y): Lagna lord in 7th OR 7th lord in Lagna
  const dwisaptatiEligible = getHouse(lagnaLord) === 7 || getHouse(seventhLord) === 1;
  conditionalDashas.push({
    dashaName: "Dwisaptati Sama Dasha (72 Years)",
    totalSpanYears: 72,
    conditionRule: "Lagna Lord in 7th House OR 7th Lord in 1st House",
    isEligible: dwisaptatiEligible,
    eligibilityReason: dwisaptatiEligible
      ? `Active: ${lagnaLord} in 7th or ${seventhLord} in 1st triggers special 72-year cycle.`
      : `Inactive: Requires Lagna lord in 7th or 7th lord in 1st.`,
    activeLord: dwisaptatiEligible ? lagnaLord : "None",
    activePeriodRange: dwisaptatiEligible ? "8 Planets × 9 Years each" : "N/A",
  });

  // (2) Chatursheeti Sama Dasha (84y): 10th lord in 10th
  const chatursheetiEligible = getHouse(tenthLord) === 10;
  conditionalDashas.push({
    dashaName: "Chatursheeti Sama Dasha (84 Years)",
    totalSpanYears: 84,
    conditionRule: "10th Lord occupies 10th House (Swakshetra / Moolatrikona)",
    isEligible: chatursheetiEligible,
    eligibilityReason: chatursheetiEligible
      ? `Active: ${tenthLord} in 10th house activates supreme 84-year Karmic Career Dasha.`
      : `Inactive: Requires 10th lord in 10th house.`,
    activeLord: chatursheetiEligible ? tenthLord : "None",
    activePeriodRange: chatursheetiEligible ? "7 Planets × 12 Years each" : "N/A",
  });

  // (3) Shat-Trimsha Sama Dasha (36y): Day birth with Sun in Lagna or Night birth with Moon in Lagna
  const shatTrimshaEligible = getHouse("Sun") === 1 || getHouse("Moon") === 1;
  conditionalDashas.push({
    dashaName: "Shat-Trimsha Sama Dasha (36 Years)",
    totalSpanYears: 36,
    conditionRule: "Day birth with Sun in Lagna/Hora OR Night birth with Moon in Lagna/Hora",
    isEligible: shatTrimshaEligible,
    eligibilityReason: shatTrimshaEligible
      ? `Active: Luminaries in Lagna trigger rapid 36-year dynamic progression.`
      : `Inactive: Requires Sun or Moon in Lagna/Hora.`,
    activeLord: shatTrimshaEligible ? "Moon" : "None",
    activePeriodRange: shatTrimshaEligible ? "8 Planets (1y to 8y) = 36 Years" : "N/A",
  });

  // (4) Shodashottari Dasha (116y): Moon in Lagna/Kendra with special Paksha conditions
  const shodashottariEligible = [1, 4, 7, 10].includes(getHouse("Moon"));
  conditionalDashas.push({
    dashaName: "Shodashottari Dasha (116 Years)",
    totalSpanYears: 116,
    conditionRule: "Moon in Kendra (1, 4, 7, 10) in Shukla/Krishna Paksha alignment",
    isEligible: shodashottariEligible,
    eligibilityReason: shodashottariEligible
      ? `Active: Moon in Kendra (${getHouse("Moon")}th house) enables 116-year longevity Dasha.`
      : `Inactive: Requires Moon in Kendra.`,
    activeLord: shodashottariEligible ? "Sun" : "None",
    activePeriodRange: shodashottariEligible ? "8 Planets (11y to 18y) = 116 Years" : "N/A",
  });

  // (5) Ashtottari Dasha (108y): Rahu in Kendra or Trikona from Lagna Lord
  const llHouse = getHouse(lagnaLord);
  const rahuHouse = getHouse("Rahu");
  const rahuDiff = (rahuHouse - llHouse + 12) % 12 + 1;
  const ashtottariEligible = [1, 4, 5, 7, 9, 10].includes(rahuDiff);
  conditionalDashas.push({
    dashaName: "Ashtottari Dasha (108 Years)",
    totalSpanYears: 108,
    conditionRule: "Rahu in Kendra (1, 4, 7, 10) or Trikona (5, 9) from Lagna Lord",
    isEligible: ashtottariEligible,
    eligibilityReason: ashtottariEligible
      ? `Active: Rahu in ${rahuDiff}th house from Lagna Lord ${lagnaLord} triggers 108-year Ashtottari Dasha.`
      : `Inactive: Rahu is in ${rahuDiff}th house from Lagna Lord.`,
    activeLord: ashtottariEligible ? "Sun" : "None",
    activePeriodRange: ashtottariEligible ? "8 Planets (6y to 21y) = 108 Years" : "N/A",
  });

  // 4. Tithi Pravesha Overview
  const tithiPraveshaOverview = `Tithi Pravesha (Vedic Annual Solar Return): The native's exact birth lunar-solar phase angle governs the annual chart, determining the Year Lord (Varsha Lord) for institutional prosperity and the Day Lord (Vara Lord) for vital energy.`;

  const eligibleCount = conditionalDashas.filter((d) => d.isEligible).length;

  const masterCruxSynthesis = `Crux of Vedic Astrology Analysis (Pt. Sanjay Rath & Maharshi Parashara): Active Narayana Dasha Sign: **${activeNarayanaSign}**. Eligible Parashari Conditional Dashas: **${eligibleCount} Active Systems** (${conditionalDashas.filter(d => d.isEligible).map(d => d.dashaName.split(" (")[0]).join(", ") || "Standard Vimshottari Primary"}). 12 Bhavas Arudha projections and Varga deities establish the physical manifestation of natal destiny.`;

  return {
    narayanaDashaPeriods: narayanaPeriods,
    activeNarayanaSign,
    bhavaCruxReadings,
    conditionalDashas,
    tithiPraveshaOverview,
    masterCruxSynthesis,
  };
}
