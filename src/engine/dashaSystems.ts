/**
 * Classical Parashari Multi-Dasha & Yogini Dasha Engine (36-Year Tantric Cycle)
 * Reference:
 * - "Encyclopedia of Vedic Astrology: Dasha Systems" by Dr. Shanker Adawal
 * - Brihat Parashara Hora Shastra (BPHS), Chapters 46–50
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateVimshottariDasha } from "./dasha";
import { calculateShodashavargaChart } from "./shodashavarga";

export interface YoginiMeta {
  index: number;
  name: string;
  sanskritName: string;
  lord: string;
  durationYears: number;
  icon: string;
  generalSignificance: string;
}

export const YOGINI_LIST: YoginiMeta[] = [
  {
    index: 0,
    name: "Mangala",
    sanskritName: "मङ्गला",
    lord: "Moon",
    durationYears: 1,
    icon: "🌕",
    generalSignificance: "Mental peace, domestic happiness, spiritual purity, auspicious beginnings.",
  },
  {
    index: 1,
    name: "Pingala",
    sanskritName: "पिङ्गला",
    lord: "Sun",
    durationYears: 2,
    icon: "☀️",
    generalSignificance: "Authority, social recognition, physical vitality, fatherly connections.",
  },
  {
    index: 2,
    name: "Dhanya",
    sanskritName: "धान्या",
    lord: "Jupiter",
    durationYears: 3,
    icon: "🌾",
    generalSignificance: "Financial prosperity, wealth multiplication, learning, high moral grace.",
  },
  {
    index: 3,
    name: "Bhramari",
    sanskritName: "भ्रामरी",
    lord: "Mars",
    durationYears: 4,
    icon: "🐝",
    generalSignificance: "Restless travels, energetic action, relocation, competitive courage.",
  },
  {
    index: 4,
    name: "Bhadrika",
    sanskritName: "भद्रिका",
    lord: "Mercury",
    durationYears: 5,
    icon: "🪷",
    generalSignificance: "Intellectual brilliance, commercial trade profits, eloquent speech.",
  },
  {
    index: 5,
    name: "Ulka",
    sanskritName: "उल्का",
    lord: "Saturn",
    durationYears: 6,
    icon: "☄️",
    generalSignificance: "Karmic tests, heavy responsibilities, delays, endurance and structural discipline.",
  },
  {
    index: 6,
    name: "Siddha",
    sanskritName: "सिद्धा",
    lord: "Venus",
    durationYears: 7,
    icon: "👑",
    generalSignificance: "Supreme accomplishments, artistic honors, luxurious comfort, marriage and joy.",
  },
  {
    index: 7,
    name: "Sankata",
    sanskritName: "सङ्कटा",
    lord: "Rahu",
    durationYears: 8,
    icon: "🌪️",
    generalSignificance: "Sudden transformative shifts, foreign journeys, occult breakthroughs, karmic lessons.",
  },
];

export interface YoginiAntardasha {
  yogini: YoginiMeta;
  startDate: Date;
  endDate: Date;
  durationMonths: number;
}

export interface YoginiMahadasha {
  yogini: YoginiMeta;
  startDate: Date;
  endDate: Date;
  durationYears: number;
  antardashas: YoginiAntardasha[];
}

export interface ActiveYoginiDasha {
  mahadasha: YoginiMeta;
  antardasha: YoginiMeta;
  mdStartDate: Date;
  mdEndDate: Date;
  adStartDate: Date;
  adEndDate: Date;
  interpretation: string;
}

export interface ConditionalDashaEligibility {
  id: string;
  name: string;
  sanskritName: string;
  totalYears: number;
  conditionText: string;
  isEligible: boolean;
  evaluationReason: string;
}

export interface MultiDashaReport {
  yoginiTimeline: YoginiMahadasha[];
  activeYogini: ActiveYoginiDasha;
  conditionalEligibilities: ConditionalDashaEligibility[];
  activeConditionalCount: number;
  multiDashaTriangulation: {
    vimshottariMD: string;
    vimshottariAD: string;
    yoginiMD: string;
    yoginiAD: string;
    concurrenceScorePercent: number;
    triangulationVerdict: string;
  };
}

const RASHI_LORD_NAMES = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

export function calculateYoginiDasha(
  birthDate: Date,
  moonLongitude: number,
  evaluationDate: Date = new Date()
): { yoginiTimeline: YoginiMahadasha[]; activeYogini: ActiveYoginiDasha } {
  const nakshatraSpan = 360 / 27; // 13.333333 degrees
  const normMoonLon = ((moonLongitude % 360) + 360) % 360;
  const nakshatraIndex = Math.floor(normMoonLon / nakshatraSpan); // 0 to 26
  const remLon = normMoonLon % nakshatraSpan;
  const fractionElapsed = remLon / nakshatraSpan;

  // Starting Yogini Index = (Nakshatra Index + 3) mod 8
  // (0-based: Ashwini(0)+3 = 3 -> Bhramari)
  const startYoginiIndex = (nakshatraIndex + 3) % 8;
  const firstYogini = YOGINI_LIST[startYoginiIndex];

  // Balance of first Yogini at birth
  const firstYoginiBalanceYears = firstYogini.durationYears * (1 - fractionElapsed);

  const timeline: YoginiMahadasha[] = [];
  let currentStart = new Date(birthDate.getTime());

  // Generate 3 complete cycles (36 * 3 = 108 years)
  let yIdx = startYoginiIndex;
  let isFirst = true;

  for (let c = 0; c < 24; c++) {
    const yogini = YOGINI_LIST[yIdx];
    const durYears = isFirst ? firstYoginiBalanceYears : yogini.durationYears;
    const durMs = durYears * 365.2425 * 24 * 60 * 60 * 1000;
    const currentEnd = new Date(currentStart.getTime() + durMs);

    // Compute Antardashas for this MD
    const antardashas: YoginiAntardasha[] = [];
    let adStart = new Date(currentStart.getTime());

    // 8 Antardashas start from the MD Yogini and follow the sequence
    for (let a = 0; a < 8; a++) {
      const adYogini = YOGINI_LIST[(yIdx + a) % 8];
      // Formula: Duration_AD = (MD_Years * AD_Years) / 36
      const adYears = (durYears * adYogini.durationYears) / 36;
      const adDurMs = adYears * 365.2425 * 24 * 60 * 60 * 1000;
      const adEnd = new Date(adStart.getTime() + adDurMs);

      antardashas.push({
        yogini: adYogini,
        startDate: new Date(adStart),
        endDate: new Date(adEnd),
        durationMonths: Math.round(adYears * 12 * 10) / 10,
      });

      adStart = new Date(adEnd);
    }

    timeline.push({
      yogini,
      startDate: new Date(currentStart),
      endDate: new Date(currentEnd),
      durationYears: Math.round(durYears * 100) / 100,
      antardashas,
    });

    currentStart = new Date(currentEnd);
    yIdx = (yIdx + 1) % 8;
    isFirst = false;
  }

  // Find active Yogini MD & AD for evaluationDate
  const targetTime = evaluationDate.getTime();
  let activeMD = timeline[0];
  let activeAD = activeMD.antardashas[0];

  for (const md of timeline) {
    if (targetTime >= md.startDate.getTime() && targetTime <= md.endDate.getTime()) {
      activeMD = md;
      for (const ad of md.antardashas) {
        if (targetTime >= ad.startDate.getTime() && targetTime <= ad.endDate.getTime()) {
          activeAD = ad;
          break;
        }
      }
      break;
    }
  }

  const activeYogini: ActiveYoginiDasha = {
    mahadasha: activeMD.yogini,
    antardasha: activeAD.yogini,
    mdStartDate: activeMD.startDate,
    mdEndDate: activeMD.endDate,
    adStartDate: activeAD.startDate,
    adEndDate: activeAD.endDate,
    interpretation: `Operating Yogini period of ${activeMD.yogini.name} (${activeMD.yogini.lord}) / ${activeAD.yogini.name} (${activeAD.yogini.lord}). ${activeMD.yogini.generalSignificance}`,
  };

  return { yoginiTimeline: timeline, activeYogini };
}

export function evaluateMultiDashaSystems(
  natalEphem: EphemerisResult,
  evaluationDate: Date = new Date()
): MultiDashaReport {
  const birthDate = new Date(natalEphem.utcDate);
  const moonLon = natalEphem.planets.Moon?.siderealLongitude || 0;
  const sunLon = natalEphem.planets.Sun?.siderealLongitude || 0;
  const ascLon = natalEphem.ascendant.siderealLongitude;
  const ascSign = Math.floor(ascLon / 30);

  const getHouse = (pName: string): number => (natalEphem.planets as any)[pName]?.house || 1;

  // 1. Yogini Dasha Calculation
  const { yoginiTimeline, activeYogini } = calculateYoginiDasha(birthDate, moonLon, evaluationDate);

  // 2. 8 Classical Conditional Dasha Eligibility Checks
  const h1Lord = RASHI_LORD_NAMES[ascSign];
  const h1LordHouse = getHouse(h1Lord);
  const rahuHouse = getHouse("Rahu");
  const sunHouse = getHouse("Sun");
  const h7Lord = RASHI_LORD_NAMES[(ascSign + 6) % 12];
  const h7LordHouse = getHouse(h7Lord);
  const h10Lord = RASHI_LORD_NAMES[(ascSign + 9) % 12];
  const h10LordHouse = getHouse(h10Lord);

  // Rahu distance from Lagna Lord
  const rahuDistFromLagnaLord = ((rahuHouse - h1LordHouse + 12) % 12) + 1;
  const isRahuInKendraTrikonaFromLL = [1, 4, 5, 7, 9, 10].includes(rahuDistFromLagnaLord);

  // D9 Navamsha Lagna check
  const d9Chart = calculateShodashavargaChart(natalEphem, "D9");
  const d9LagnaSignIdx = d9Chart.ascendant.vargaSignIndex;
  const isVargottamaLagna = ascSign === d9LagnaSignIdx;
  const isD9LagnaInVenus = d9LagnaSignIdx === 1 || d9LagnaSignIdx === 6; // Taurus or Libra

  const conditionalEligibilities: ConditionalDashaEligibility[] = [
    {
      id: "ashtottari",
      name: "Ashtottari Dasha (108 Years)",
      sanskritName: "अष्टोत्तरी दशा (१०८ वर्ष)",
      totalYears: 108,
      conditionText: "Rahu posited in a Kendra (1,4,7,10) or Trikona (5,9) from the Lagna Lord.",
      isEligible: isRahuInKendraTrikonaFromLL,
      evaluationReason: isRahuInKendraTrikonaFromLL
        ? `Rahu is in House #${rahuDistFromLagnaLord} (Kendra/Trikona) from Lagna Lord (${h1Lord}). Ashtottari Dasha is fully ELIGIBLE and applicable.`
        : `Rahu is in House #${rahuDistFromLagnaLord} from Lagna Lord; standard Vimshottari takes precedence.`,
    },
    {
      id: "dwisaptati",
      name: "Dwisaptati-Sama Dasha (72 Years)",
      sanskritName: "द्विसप्तति समा दशा (७२ वर्ष)",
      totalYears: 72,
      conditionText: "7th Lord posited in the 7th House or in Lagna (1st House).",
      isEligible: h7LordHouse === 7 || h7LordHouse === 1,
      evaluationReason: h7LordHouse === 7 || h7LordHouse === 1
        ? `7th Lord (${h7Lord}) is in House #${h7LordHouse}. Dwisaptati Dasha is actively triggered.`
        : `7th Lord is in House #${h7LordHouse}; condition not satisfied.`,
    },
    {
      id: "chaturashiti",
      name: "Chaturashiti-Sama Dasha (84 Years)",
      sanskritName: "चतुरशीति समा दशा (८४ वर्ष)",
      totalYears: 84,
      conditionText: "10th Lord posited in the 10th House.",
      isEligible: h10LordHouse === 10,
      evaluationReason: h10LordHouse === 10
        ? `10th Lord (${h10Lord}) occupies the 10th House (Swakshetra). Chaturashiti Dasha is actively triggered.`
        : `10th Lord is in House #${h10LordHouse}; condition not satisfied.`,
    },
    {
      id: "shastihayani",
      name: "Shastihayani Dasha (60 Years)",
      sanskritName: "षष्टिहायनी दशा (६० वर्ष)",
      totalYears: 60,
      conditionText: "Sun posited in Lagna (1st House).",
      isEligible: sunHouse === 1,
      evaluationReason: sunHouse === 1
        ? "Sun is posited in the 1st House (Lagna). Shastihayani Dasha is actively triggered."
        : `Sun is in House #${sunHouse}; condition not satisfied.`,
    },
    {
      id: "shatabdika",
      name: "Shatabdika Dasha (100 Years)",
      sanskritName: "शताब्दिका दशा (१०० वर्ष)",
      totalYears: 100,
      conditionText: "Vargottama Lagna (Birth Lagna and Navamsha Lagna in the same sign).",
      isEligible: isVargottamaLagna,
      evaluationReason: isVargottamaLagna
        ? `Lagna is Vargottama in ${RASHI_NAMES[ascSign].englishName}. Shatabdika Dasha is actively triggered.`
        : "Lagna is not Vargottama; condition not satisfied.",
    },
    {
      id: "dwadashottari",
      name: "Dwadashottari Dasha (112 Years)",
      sanskritName: "द्वादशोत्तरी दशा (११२ वर्ष)",
      totalYears: 112,
      conditionText: "Lagna falls in Venus's Navamsha (Taurus or Libra in D9).",
      isEligible: isD9LagnaInVenus,
      evaluationReason: isD9LagnaInVenus
        ? `D9 Navamsha Lagna is in ${RASHI_NAMES[d9LagnaSignIdx].englishName} (Venus's sign). Dwadashottari Dasha is actively triggered.`
        : `D9 Lagna is in ${RASHI_NAMES[d9LagnaSignIdx].englishName}; condition not satisfied.`,
    },
  ];

  const activeConditionalCount = conditionalEligibilities.filter((c) => c.isEligible).length;

  // 3. Multi-Dasha Triangulation
  const vimshottariResult = calculateVimshottariDasha(birthDate, moonLon, evaluationDate);
  const vimMD = vimshottariResult.activeDasha?.mahadasha.name || "";
  const vimAD = vimshottariResult.activeDasha?.antardasha.name || "";
  const yogMD = activeYogini.mahadasha.lord;
  const yogAD = activeYogini.antardasha.lord;

  // Check planetary harmony between Vimshottari and Yogini lords
  const isLordMatch = vimMD === yogMD || vimAD === yogAD || vimMD === yogAD || vimAD === yogMD;
  const concurrenceScore = isLordMatch ? 95 : 75;

  const triangulationVerdict = isLordMatch
    ? `⚡ HIGH MULTI-DASHA CONCURRENCE: Vimshottari period (${vimMD}/${vimAD}) and Yogini period (${activeYogini.mahadasha.name}/${activeYogini.antardasha.name} ruled by ${yogMD}/${yogAD}) converge on identical planetary rulers, confirming imminent event realization!`
    : `Vimshottari (${vimMD}/${vimAD}) sets the macro karmic timeline while Yogini (${activeYogini.mahadasha.name}/${activeYogini.antardasha.name}) catalyzes fast environmental triggers.`;

  return {
    yoginiTimeline,
    activeYogini,
    conditionalEligibilities,
    activeConditionalCount,
    multiDashaTriangulation: {
      vimshottariMD: vimMD,
      vimshottariAD: vimAD,
      yoginiMD: activeYogini.mahadasha.name + " (" + yogMD + ")",
      yoginiAD: activeYogini.antardasha.name + " (" + yogAD + ")",
      concurrenceScorePercent: concurrenceScore,
      triangulationVerdict,
    },
  };
}
