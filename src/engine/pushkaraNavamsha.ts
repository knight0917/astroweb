/**
 * Classical Pushkara Navamsha (पुष्कर नवांश) & Pushkara Bhaga (पुष्कर भाग) Engine
 * References:
 * - Jataka Parijata (जातक पारिजात - Adhyaya 1, Slokas 57-58)
 * - Vidyamadhaveeyam (विद्यामाधवीयम्)
 * - Uttara Kalamrita (उत्तर कालामृत - Mahakavi Kalidasa)
 * - C.S. Patel's "Navamsha in Astrology"
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";

export interface PushkaraEntityDetail {
  id: string;
  name: string;
  sanskritName: string;
  rashiIndex: number;
  rashiName: string;
  longitudeInRashi: number; // 0 to 30
  formattedDegree: string;
  navamshaIndexInRashi: number; // 1 to 9
  d9RashiIndex: number;
  d9RashiName: string;
  d9RashiLord: string;
  isPushkaraNavamsha: boolean;
  pushkaraNavamshaType: "Fire-Libra" | "Fire-Sagittarius" | "Earth-Pisces" | "Earth-Taurus" | "Air-Pisces" | "Air-Taurus" | "Water-Cancer" | "Water-Virgo" | null;
  isPushkaraBhaga: boolean;
  exactPushkaraBhagaDegree: number;
  orbToPushkaraBhagaDeg: number;
  isPushkaraVargottama: boolean;
  significance: string;
}

export interface PushkaraAnalysisResult {
  totalPushkaraEntitiesCount: number;
  pushkaraEntities: PushkaraEntityDetail[];
  pushkaraVargottamaEntities: PushkaraEntityDetail[];
  pushkaraBhagaEntities: PushkaraEntityDetail[];
  isLagnaInPushkara: boolean;
  isMoonInPushkara: boolean;
  isSunInPushkara: boolean;
  is10thLordInPushkara: boolean;
  is7thLordInPushkara: boolean;
  isLagneshaInPushkara: boolean;
  overallPushkaraBlessingSummary: string;
}

// Classical Pushkara Bhaga exact degrees per Rashi (0 = Aries, 11 = Pisces)
const PUSHKARA_BHAGA_DEGREES = [
  21, // Aries
  14, // Taurus
  18, // Gemini
  8,  // Cancer
  19, // Leo
  9,  // Virgo
  24, // Libra
  11, // Scorpio
  23, // Sagittarius
  14, // Capricorn
  19, // Aquarius
  9,  // Pisces
];

export function evaluatePushkaraForLongitude(longitude: number, id: string, name: string, sanskritName: string): PushkaraEntityDetail {
  const normLon = (longitude % 360 + 360) % 360;
  const rashiIndex = Math.floor(normLon / 30);
  const lonInRashi = normLon % 30;

  const deg = Math.floor(lonInRashi);
  const min = Math.floor((lonInRashi - deg) * 60);
  const sec = Math.round(((lonInRashi - deg) * 60 - min) * 60);
  const formattedDegree = `${deg}°${String(min).padStart(2, "0")}'${String(sec).padStart(2, "0")}"`;

  const navamshaIndexInRashi = Math.floor(lonInRashi / (30 / 9)) + 1; // 1 to 9

  // D-9 Navamsha Sign Index Calculation
  // Fire signs (0, 4, 8) start from Aries (0)
  // Earth signs (1, 5, 9) start from Capricorn (9)
  // Air signs (2, 6, 10) start from Libra (6)
  // Water signs (3, 7, 11) start from Cancer (3)
  const elementGroup = rashiIndex % 4; // 0=Fire, 1=Earth, 2=Air, 3=Water
  let d9StartSign = 0;
  if (elementGroup === 0) d9StartSign = 0;      // Aries
  else if (elementGroup === 1) d9StartSign = 9; // Capricorn
  else if (elementGroup === 2) d9StartSign = 6; // Libra
  else if (elementGroup === 3) d9StartSign = 3; // Cancer

  const d9RashiIndex = (d9StartSign + navamshaIndexInRashi - 1) % 12;
  const d9RashiName = RASHI_NAMES[d9RashiIndex].englishName;
  const d9RashiLord = RASHI_NAMES[d9RashiIndex].lord;

  // 24 Classical Pushkara Navamshas check:
  let isPushkaraNavamsha = false;
  let pushkaraNavamshaType: PushkaraEntityDetail["pushkaraNavamshaType"] = null;

  if (elementGroup === 0) {
    // Fire Signs (Aries, Leo, Sagittarius) -> 7th (Libra) & 9th (Sagittarius)
    if (navamshaIndexInRashi === 7) {
      isPushkaraNavamsha = true;
      pushkaraNavamshaType = "Fire-Libra";
    } else if (navamshaIndexInRashi === 9) {
      isPushkaraNavamsha = true;
      pushkaraNavamshaType = "Fire-Sagittarius";
    }
  } else if (elementGroup === 1) {
    // Earth Signs (Taurus, Virgo, Capricorn) -> 3rd (Pisces) & 5th (Taurus)
    if (navamshaIndexInRashi === 3) {
      isPushkaraNavamsha = true;
      pushkaraNavamshaType = "Earth-Pisces";
    } else if (navamshaIndexInRashi === 5) {
      isPushkaraNavamsha = true;
      pushkaraNavamshaType = "Earth-Taurus";
    }
  } else if (elementGroup === 2) {
    // Air Signs (Gemini, Libra, Aquarius) -> 6th (Pisces) & 8th (Taurus)
    if (navamshaIndexInRashi === 6) {
      isPushkaraNavamsha = true;
      pushkaraNavamshaType = "Air-Pisces";
    } else if (navamshaIndexInRashi === 8) {
      isPushkaraNavamsha = true;
      pushkaraNavamshaType = "Air-Taurus";
    }
  } else if (elementGroup === 3) {
    // Water Signs (Cancer, Scorpio, Pisces) -> 1st (Cancer) & 3rd (Virgo)
    if (navamshaIndexInRashi === 1) {
      isPushkaraNavamsha = true;
      pushkaraNavamshaType = "Water-Cancer";
    } else if (navamshaIndexInRashi === 3) {
      isPushkaraNavamsha = true;
      pushkaraNavamshaType = "Water-Virgo";
    }
  }

  // Pushkara Bhaga check
  const exactPushkaraBhagaDegree = PUSHKARA_BHAGA_DEGREES[rashiIndex];
  const orbToPushkaraBhagaDeg = Math.abs(lonInRashi - exactPushkaraBhagaDegree);
  const isPushkaraBhaga = orbToPushkaraBhagaDeg <= 1.0; // Within 1° orb

  // Pushkara Vargottama check (Same sign in D1 & D9 + Pushkara)
  const isPushkaraVargottama = isPushkaraNavamsha && rashiIndex === d9RashiIndex;

  let significance = "";
  if (isPushkaraVargottama) {
    significance = `Supreme Pushkara Vargottama in ${d9RashiName} (Ruled by ${d9RashiLord}). Bestows Raja Yoga potency equivalent to an exalted planet; confers extraordinary karmic protection, status, and longevity.`;
  } else if (isPushkaraBhaga) {
    significance = `Exact Pushkara Bhaga (Exact healing degree ${exactPushkaraBhagaDegree}° within ${orbToPushkaraBhagaDeg.toFixed(2)}° orb). Acts as a divine nectar (Amrita) reservoir, neutralizing severe doshas and restoring health/wealth.`;
  } else if (isPushkaraNavamsha) {
    significance = `Pushkara Navamsha in ${d9RashiName} (Ruled by benefic ${d9RashiLord}). Purifies natal debility or afflictions and delivers sustained benefic fruits during its Dasha/Antardasha.`;
  } else {
    significance = `Standard Navamsha in ${d9RashiName} (${d9RashiLord}).`;
  }

  return {
    id,
    name,
    sanskritName,
    rashiIndex,
    rashiName: RASHI_NAMES[rashiIndex].englishName,
    longitudeInRashi: lonInRashi,
    formattedDegree,
    navamshaIndexInRashi,
    d9RashiIndex,
    d9RashiName,
    d9RashiLord,
    isPushkaraNavamsha,
    pushkaraNavamshaType,
    isPushkaraBhaga,
    exactPushkaraBhagaDegree,
    orbToPushkaraBhagaDeg,
    isPushkaraVargottama,
    significance,
  };
}

export function evaluatePushkaraNavamsha(ephem: EphemerisResult): PushkaraAnalysisResult {
  const ascLon = ephem.ascendant.siderealLongitude;
  const ascSignIdx = Math.floor(ascLon / 30);
  const lagneshaName = RASHI_NAMES[ascSignIdx].lord;
  const lord10Name = RASHI_NAMES[(ascSignIdx + 9) % 12].lord;
  const lord7Name = RASHI_NAMES[(ascSignIdx + 6) % 12].lord;

  const entitiesToTest: { id: string; name: string; sanskritName: string; lon: number }[] = [
    { id: "lagna", name: "Ascendant (Lagna)", sanskritName: "लग्न", lon: ascLon },
  ];

  const mainPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  mainPlanets.forEach((pName) => {
    const pl = ephem.planets[pName];
    if (pl) {
      entitiesToTest.push({
        id: pl.id || pName.toLowerCase(),
        name: pl.name,
        sanskritName: pl.sanskritName,
        lon: pl.siderealLongitude,
      });
    }
  });

  const pushkaraEntities: PushkaraEntityDetail[] = [];
  const pushkaraVargottamaEntities: PushkaraEntityDetail[] = [];
  const pushkaraBhagaEntities: PushkaraEntityDetail[] = [];

  entitiesToTest.forEach((e) => {
    const detail = evaluatePushkaraForLongitude(e.lon, e.id, e.name, e.sanskritName);
    if (detail.isPushkaraNavamsha) pushkaraEntities.push(detail);
    if (detail.isPushkaraVargottama) pushkaraVargottamaEntities.push(detail);
    if (detail.isPushkaraBhaga) pushkaraBhagaEntities.push(detail);
  });

  const lagnaPushkara = pushkaraEntities.find((e) => e.id === "lagna");
  const isLagnaInPushkara = Boolean(lagnaPushkara);
  const isMoonInPushkara = pushkaraEntities.some((e) => e.name === "Moon");
  const isSunInPushkara = pushkaraEntities.some((e) => e.name === "Sun");
  const isLagneshaInPushkara = pushkaraEntities.some((e) => e.name === lagneshaName);
  const is10thLordInPushkara = pushkaraEntities.some((e) => e.name === lord10Name);
  const is7thLordInPushkara = pushkaraEntities.some((e) => e.name === lord7Name);

  let summaryParts: string[] = [];
  if (pushkaraVargottamaEntities.length > 0) {
    summaryParts.push(`Supreme Pushkara Vargottama active on: ${pushkaraVargottamaEntities.map((e) => e.name).join(", ")} (confers high Raja Yoga and unshakeable resilience).`);
  }
  if (pushkaraBhagaEntities.length > 0) {
    summaryParts.push(`Exact Pushkara Bhaga (healing degrees) activated on: ${pushkaraBhagaEntities.map((e) => `${e.name} at ${e.formattedDegree}`).join(", ")}.`);
  }
  if (pushkaraEntities.length > 0) {
    summaryParts.push(`Total ${pushkaraEntities.length} Pushkara Navamsha placements found (${pushkaraEntities.map((e) => `${e.name} in D9 ${e.d9RashiName}`).join(", ")}), infusing divine nectar (Amrita) and restorative power during their ruling periods.`);
  } else {
    summaryParts.push(`No direct Pushkara Navamsha placements; horoscopic strength relies on Shadbala, Ashtakavarga, and standard Varga configurations.`);
  }

  return {
    totalPushkaraEntitiesCount: pushkaraEntities.length,
    pushkaraEntities,
    pushkaraVargottamaEntities,
    pushkaraBhagaEntities,
    isLagnaInPushkara,
    isMoonInPushkara,
    isSunInPushkara,
    is10thLordInPushkara,
    is7thLordInPushkara,
    isLagneshaInPushkara,
    overallPushkaraBlessingSummary: summaryParts.join(" "),
  };
}
