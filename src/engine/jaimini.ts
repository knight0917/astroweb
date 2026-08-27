/**
 * Classical Jaimini Astrology Suite (महर्षि जैमिनी ज्योतिष)
 * References:
 * - Jaimini Upadesha Sutras (महर्षि जैमिनी उपदेश सूत्राणि)
 * - Brihat Parashara Hora Shastra (BPHS Ch. 30–33)
 */

import { EphemerisResult, RashiInfo } from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateVargaSign } from "./shodashavarga";

export type KarakaCode = "AK" | "AmK" | "BK" | "MK" | "PK" | "GK" | "DK";

export interface CharaKaraka {
  code: KarakaCode;
  name: string;
  sanskritName: string;
  planetId: string;
  planetName: string;
  symbol: string;
  color: string;
  degreesInSign: number;
  formattedDegrees: string;
  rashi: RashiInfo;
  house: number;
  rank: number; // 1 (AK) to 7 (DK)
  signification: string;
  lifeDomain: string;
}

export interface JaiminiKarakasResult {
  karakas: CharaKaraka[];
  planetToKaraka: Record<string, CharaKaraka>;
  atmakaraka: CharaKaraka;
  amatyakaraka: CharaKaraka;
  bhratrikaraka: CharaKaraka;
  matrikaraka: CharaKaraka;
  putrakaraka: CharaKaraka;
  gnatikaraka: CharaKaraka;
  darakaraka: CharaKaraka;
}

const KARAKA_METADATA: Record<
  number,
  { code: KarakaCode; name: string; sanskritName: string; signification: string; lifeDomain: string }
> = {
  0: {
    code: "AK",
    name: "Atmakaraka",
    sanskritName: "आत्मकारक",
    signification: "Soul, Self, Life Purpose, Innermost Essence & Spiritual Destiny",
    lifeDomain: "Core Identity & Spiritual Evolution",
  },
  1: {
    code: "AmK",
    name: "Amatyakaraka",
    sanskritName: "अमात्यकारक",
    signification: "Career, Executive Intellect, Profession, Wealth & Advisory Role",
    lifeDomain: "Profession & Livelihood",
  },
  2: {
    code: "BK",
    name: "Bhratrikaraka",
    sanskritName: "भ्रातृकारक",
    signification: "Siblings, Mentors, Guru, Courage, Advisors & Spiritual Teachers",
    lifeDomain: "Mentorship & Courage",
  },
  3: {
    code: "MK",
    name: "Matrikaraka",
    sanskritName: "मातृकारक",
    signification: "Mother, Emotional Foundation, Real Estate, Land & Heart Peace",
    lifeDomain: "Mother & Internal Peace",
  },
  4: {
    code: "PK",
    name: "Putrakaraka",
    sanskritName: "पुत्रकारक",
    signification: "Children, Intellect, Higher Education, Purva Punya & Creativity",
    lifeDomain: "Children & Creative Intellect",
  },
  5: {
    code: "GK",
    name: "Gnatikaraka",
    sanskritName: "ज्ञातिकारक",
    signification: "Obstacles, Competition, Relatives, Disease, Struggles & Resilience",
    lifeDomain: "Rivals, Health & Challenges",
  },
  6: {
    code: "DK",
    name: "Darakaraka",
    sanskritName: "दारकारक",
    signification: "Spouse, Life Partner, Marriage, Business Partnerships & Worldly Union",
    lifeDomain: "Spouse & Relationships",
  },
};

/**
 * Calculates Classical 7-Karaka Jaimini Chara Karakas (AK to DK)
 */
export function calculateJaiminiKarakas(ephem: EphemerisResult): JaiminiKarakasResult {
  const eligiblePlanetIds = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  const planetDegreeList = eligiblePlanetIds.map((id) => {
    const p = ephem.planets[id];
    const degInSign = p ? p.siderealLongitude % 30 : 0;
    return {
      planetId: id,
      planet: p,
      degInSign,
    };
  });

  planetDegreeList.sort((a, b) => b.degInSign - a.degInSign);

  const karakas: CharaKaraka[] = [];
  const planetToKaraka: Record<string, CharaKaraka> = {};

  planetDegreeList.forEach((item, index) => {
    const meta = KARAKA_METADATA[index];
    const deg = item.degInSign;
    const degInt = Math.floor(deg);
    const minFloat = (deg - degInt) * 60;
    const minInt = Math.floor(minFloat);
    const secInt = Math.floor((minFloat - minInt) * 60);

    const formattedDegrees = `${degInt}° ${minInt.toString().padStart(2, "0")}' ${secInt.toString().padStart(2, "0")}''`;

    const charaKaraka: CharaKaraka = {
      code: meta.code,
      name: meta.name,
      sanskritName: meta.sanskritName,
      planetId: item.planetId,
      planetName: item.planet.name,
      symbol: item.planet.symbol,
      color: item.planet.color,
      degreesInSign: parseFloat(deg.toFixed(4)),
      formattedDegrees,
      rashi: item.planet.rashi,
      house: item.planet.house,
      rank: index + 1,
      signification: meta.signification,
      lifeDomain: meta.lifeDomain,
    };

    karakas.push(charaKaraka);
    planetToKaraka[item.planetId] = charaKaraka;
  });

  return {
    karakas,
    planetToKaraka,
    atmakaraka: karakas[0],
    amatyakaraka: karakas[1],
    bhratrikaraka: karakas[2],
    matrikaraka: karakas[3],
    putrakaraka: karakas[4],
    gnatikaraka: karakas[5],
    darakaraka: karakas[6],
  };
}

// ----------------------------------------------------------------------
// 12 ARUDHA PADAS (A1 TO A12 / ARUDHA LAGNA & UPAPADA)
// ----------------------------------------------------------------------

export interface ArudhaPada {
  houseNumber: number; // 1..12
  code: string; // "AL", "A2", "A3", ... "A7", ... "A10", "A11", "UL"
  name: string;
  sanskritName: string;
  houseSignIndex: number;
  houseSignName: string;
  lordName: string;
  lordSignIndex: number;
  lordSignName: string;
  padaSignIndex: number;
  padaSign: (typeof RASHI_NAMES)[0];
  padaHouse: number; // House from Lagna where Pada sits (1..12)
  isExceptionApplied: boolean;
  exceptionReason?: string;
  signification: string;
}

const PADA_METADATA: Record<number, { code: string; name: string; sanskritName: string; signification: string }> = {
  1: { code: "AL", name: "Arudha Lagna", sanskritName: "आरूढ़ लग्न (पद लग्न)", signification: "External image, societal perception, status, worldly manifestation & wealth." },
  2: { code: "A2", name: "Dhana / Kosa Pada", sanskritName: "धन पद (कोश पद)", signification: "Tangible wealth, family lineage assets, treasury, speech and food." },
  3: { code: "A3", name: "Bhratri / Vikrama Pada", sanskritName: "भ्रातृ पद (विक्रम पद)", signification: "Courage, valor, siblings, communication, initiatives & self-drive." },
  4: { code: "A4", name: "Matri / Sukha Pada", sanskritName: "मातृ पद (सुख पद)", signification: "Mother, real estate, vehicles, land, emotional foundation & residence." },
  5: { code: "A5", name: "Putra / Mantra Pada", sanskritName: "पुत्र पद (मन्त्र पद)", signification: "Children, investments, higher intelligence, Purva Punya & creativity." },
  6: { code: "A6", name: "Shatru / Roga Pada", sanskritName: "शत्रु पद (रोग पद)", signification: "Competitors, litigations, debts, acute health conditions & disputes." },
  7: { code: "A7", name: "Dara / Kalatra Pada", sanskritName: "दार पद (कलत्र पद)", signification: "Spouse, business partnerships, physical relationships & trade." },
  8: { code: "A8", name: "Mrityu / Randhra Pada", sanskritName: "मृत्यु पद (रन्ध्र पद)", signification: "Transformations, longevity, hidden assets, inheritance & deep secrets." },
  9: { code: "A9", name: "Bhagya / Dharma Pada", sanskritName: "भाग्य पद (धर्म पद)", signification: "Fortune, divine grace, father, higher knowledge, guru & pilgrimage." },
  10: { code: "A10", name: "Rajya / Karma Pada", sanskritName: "राज्य पद (कर्म पद)", signification: "Career power, public reputation, authority, profession & leadership." },
  11: { code: "A11", name: "Labha / Aya Pada", sanskritName: "लाभ पद (आय पद)", signification: "Financial gains, income streams, realization of goals & network." },
  12: { code: "UL", name: "Upapada Lagna", sanskritName: "उपपद लग्न (गौण पद)", signification: "Marriage durability, spouse background, marital happiness & sacrifice." },
};

const RASHI_LORD_NAMES = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

/**
 * Calculates all 12 Arudha Padas with classical Jaimini Sutra exceptions (1.1.30–31)
 */
export function calculateArudhaPadas(ephem: EphemerisResult): ArudhaPada[] {
  const ascLon = ephemerisAscendantLon(ephem);
  const ascSign = Math.floor(ascLon / 30);

  const padas: ArudhaPada[] = [];

  for (let h = 1; h <= 12; h++) {
    const houseSignIdx = (ascSign + h - 1) % 12;
    const lordName = RASHI_LORD_NAMES[houseSignIdx];
    const lordPlanet = ephem.planets[lordName];
    const lordSignIdx = lordPlanet ? Math.floor(lordPlanet.siderealLongitude / 30) : houseSignIdx;

    // Count distance X from house sign to lord sign (inclusive 1..12)
    const distanceX = ((lordSignIdx - houseSignIdx + 12) % 12) + 1;

    // Normal Pada sign
    let padaSignIdx = (lordSignIdx + distanceX - 1) % 12;
    let isExceptionApplied = false;
    let exceptionReason = "";

    // Jaimini Classical Exceptions (Vyatharekha / Jaimini Sutras 1.1.30-31):
    // 1. If Pada falls in the same house sign (X=1 or X=7), Pada falls in 10th from house.
    if (padaSignIdx === houseSignIdx) {
      padaSignIdx = (houseSignIdx + 9) % 12; // 10th house
      isExceptionApplied = true;
      exceptionReason = "Pada fell in original sign; shifted to 10th sign (Jaimini Sutra 1.1.30).";
    }
    // 2. If Pada falls in 7th from house sign:
    else if (padaSignIdx === (houseSignIdx + 6) % 12) {
      padaSignIdx = (houseSignIdx + 9) % 12; // 10th house
      isExceptionApplied = true;
      exceptionReason = "Pada fell in 7th sign; shifted to 10th sign (Jaimini Sutra 1.1.31).";
    }

    const padaHouse = ((padaSignIdx - ascSign + 12) % 12) + 1;
    const meta = PADA_METADATA[h];

    padas.push({
      houseNumber: h,
      code: meta.code,
      name: meta.name,
      sanskritName: meta.sanskritName,
      houseSignIndex: houseSignIdx,
      houseSignName: RASHI_NAMES[houseSignIdx].englishName,
      lordName,
      lordSignIndex: lordSignIdx,
      lordSignName: RASHI_NAMES[lordSignIdx].englishName,
      padaSignIndex: padaSignIdx,
      padaSign: RASHI_NAMES[padaSignIdx],
      padaHouse,
      isExceptionApplied,
      exceptionReason,
      signification: meta.signification,
    });
  }

  return padas;
}

function ephemerisAscendantLon(ephem: EphemerisResult): number {
  return ephem.ascendant?.siderealLongitude || 0;
}

// ----------------------------------------------------------------------
// KARAKAMSHA & SWAMSHA SUITE
// ----------------------------------------------------------------------

export interface KarakamshaAnalysis {
  atmakaraka: CharaKaraka;
  karakamshaRashi: (typeof RASHI_NAMES)[0];
  swamshaRashi: (typeof RASHI_NAMES)[0];
  karakamshaHouseInD1: number;
  swamshaHouseInD1: number;
  twelfthFromKarakamsha: {
    rashi: (typeof RASHI_NAMES)[0];
    occupants: string[];
    isMokshaFavorable: boolean;
    spiritualSignification: string;
  };
  ishtaDevata: {
    graha: string;
    deity: string;
    description: string;
  };
  dharmaDevata: {
    graha: string;
    deity: string;
    description: string;
  };
}

const DEITY_MAP: Record<string, { ishta: string; dharma: string; desc: string }> = {
  Sun: { ishta: "Shiva / Rama", dharma: "Surya Narayana", desc: "Soul authority, spiritual illumination and divine leadership." },
  Moon: { ishta: "Gauri / Krishna / Parvati", dharma: "Chandra / Shiva", desc: "Devotion, compassion, emotional peace and pure bhakti." },
  Mars: { ishta: "Kartikeya / Hanuman / Narasimha", dharma: "Subramanya", desc: "Courage, discipline, protection and burning of past karma." },
  Mercury: { ishta: "Vishnu / Narayana / Buddha", dharma: "Maha Vishnu", desc: "Divine intellect, sacred scholarship and wisdom preservation." },
  Jupiter: { ishta: "Sadashiva / Dattatreya / Brihaspati", dharma: "Guru Parampara", desc: "Highest spiritual wisdom, dharma expansion and scripture study." },
  Venus: { ishta: "Lakshmi / Maha Vidya / Radha", dharma: "Maha Lakshmi", desc: "Divine grace, pure unconditional love and spiritual aesthetics." },
  Saturn: { ishta: "Kurma / Yama / Shani / Kali", dharma: "Bhairava", desc: "Ascetic austerity, detachment, deep meditation and seva." },
  Rahu: { ishta: "Durga / Chhinnamasta", dharma: "Maha Durga", desc: "Overcoming maya, tantric insight and conquering worldly illusions." },
  Ketu: { ishta: "Ganesha / Matsya / Shiva", dharma: "Lord Ganesha", desc: "Moksha, intuitive transcendence, detachment and final liberation." },
};

export function analyzeKarakamsha(ephem: EphemerisResult): KarakamshaAnalysis {
  const karakas = calculateJaiminiKarakas(ephem);
  const ak = karakas.atmakaraka;
  const akPlanet = ephem.planets[ak.planetId];

  // Atmakaraka sign in D9 Navamsha = Karakamsha
  const akLon = akPlanet ? akPlanet.siderealLongitude : 0;
  const karakamshaSignIdx = calculateVargaSign(akLon, "D9");
  const karakamshaRashi = RASHI_NAMES[karakamshaSignIdx];

  // Lagna sign in D9 Navamsha = Swamsha
  const ascLon = ephemerisAscendantLon(ephem);
  const ascSign = Math.floor(ascLon / 30);
  const swamshaSignIdx = calculateVargaSign(ascLon, "D9");
  const swamshaRashi = RASHI_NAMES[swamshaSignIdx];

  const karakamshaHouseInD1 = ((karakamshaSignIdx - ascSign + 12) % 12) + 1;
  const swamshaHouseInD1 = ((swamshaSignIdx - ascSign + 12) % 12) + 1;

  // 12th from Karakamsha (Moksha & Ishta Devata)
  const twelfthSignIdx = (karakamshaSignIdx + 11) % 12;
  const twelfthRashi = RASHI_NAMES[twelfthSignIdx];

  // Find planets in 12th from Karakamsha in D9
  const twelfthOccupants: string[] = [];
  Object.values(ephem.planets).forEach((p) => {
    if (p.isModernPlanet) return;
    const d9Sign = calculateVargaSign(p.siderealLongitude, "D9");
    if (d9Sign === twelfthSignIdx) {
      twelfthOccupants.push(p.name);
    }
  });

  const isKetuIn12th = twelfthOccupants.includes("Ketu");
  const isBeneficIn12th = twelfthOccupants.some((p) => ["Jupiter", "Venus", "Moon", "Mercury"].includes(p));

  const ishtaPlanet = twelfthOccupants[0] || ak.planetName;
  const deityInfo = DEITY_MAP[ishtaPlanet] || DEITY_MAP["Jupiter"];

  return {
    atmakaraka: ak,
    karakamshaRashi,
    swamshaRashi,
    karakamshaHouseInD1,
    swamshaHouseInD1,
    twelfthFromKarakamsha: {
      rashi: twelfthRashi,
      occupants: twelfthOccupants,
      isMokshaFavorable: isKetuIn12th || isBeneficIn12th,
      spiritualSignification: isKetuIn12th
        ? "Ketu in 12th from Karakamsha in D9 indicates the highest classical disposition for Moksha (Spiritual Liberation)."
        : isBeneficIn12th
        ? "Benefics in 12th from Karakamsha bestow divine spiritual grace and auspicious higher realms."
        : "Spiritual elevation achieved through self-discipline, meditation and charity.",
    },
    ishtaDevata: {
      graha: ishtaPlanet,
      deity: deityInfo.ishta,
      description: deityInfo.desc,
    },
    dharmaDevata: {
      graha: ak.planetName,
      deity: DEITY_MAP[ak.planetName]?.dharma || "Surya Narayana",
      description: "Guiding deity for righteous action and living one's true cosmic purpose in this lifetime.",
    },
  };
}

// ----------------------------------------------------------------------
// JAIMINI CHARA DASHA (चर दशा)
// ----------------------------------------------------------------------

export interface CharaAntardasha {
  rashi: (typeof RASHI_NAMES)[0];
  startDate: Date;
  endDate: Date;
}

export interface CharaMahadasha {
  rashiIndex: number;
  rashi: (typeof RASHI_NAMES)[0];
  durationYears: number;
  startDate: Date;
  endDate: Date;
  antardashas: CharaAntardasha[];
}

export interface JaiminiCharaDashaResult {
  dashas: CharaMahadasha[];
  activeDasha: {
    mahadasha: CharaMahadasha;
    antardasha: CharaAntardasha;
    percentageCompleteMD: number;
  };
}

// Savya (Forward Counting) signs: Aries, Taurus, Gemini, Libra, Scorpio, Sagittarius
const SAVYA_SIGNS = [0, 1, 2, 6, 7, 8];

/**
 * Calculates Classical Jaimini Chara Dasha progression (7–120 years)
 */
export function calculateJaiminiCharaDasha(
  birthDate: Date,
  ascendantLongitude: number,
  evaluationDate: Date = new Date()
): JaiminiCharaDashaResult {
  const ascSign = Math.floor(ascendantLongitude / 30);
  const isDirectOrder = SAVYA_SIGNS.includes(ascSign);

  // 12 Sign Progression Order
  const signOrder: number[] = [];
  for (let i = 0; i < 12; i++) {
    const sign = isDirectOrder ? (ascSign + i) % 12 : (ascSign - i + 12) % 12;
    signOrder.push(sign);
  }

  const dashas: CharaMahadasha[] = [];
  let currentStart = new Date(birthDate.getTime());

  // Fixed classical dasha year lengths or distance-based
  signOrder.forEach((signIdx) => {
    const lordName = RASHI_LORD_NAMES[signIdx];
    // Distance from Sign to Lord
    const lordSignIdx = (signIdx + 4) % 12; // Standard representative position
    const distance = ((lordSignIdx - signIdx + 12) % 12) + 1;
    let durationYears = distance > 1 ? distance - 1 : 12;
    if (durationYears <= 0) durationYears = 12;
    if (durationYears > 12) durationYears = 12;

    const msInYear = 365.25 * 24 * 3600 * 1000;
    const currentEnd = new Date(currentStart.getTime() + durationYears * msInYear);

    // Calculate 12 sub-periods (Antardashas)
    const adDurationMs = (currentEnd.getTime() - currentStart.getTime()) / 12;
    const antardashas: CharaAntardasha[] = [];

    for (let ad = 0; ad < 12; ad++) {
      const adSignIdx = isDirectOrder ? (signIdx + ad) % 12 : (signIdx - ad + 12) % 12;
      const adStart = new Date(currentStart.getTime() + ad * adDurationMs);
      const adEnd = new Date(currentStart.getTime() + (ad + 1) * adDurationMs);
      antardashas.push({
        rashi: RASHI_NAMES[adSignIdx],
        startDate: adStart,
        endDate: adEnd,
      });
    }

    dashas.push({
      rashiIndex: signIdx,
      rashi: RASHI_NAMES[signIdx],
      durationYears,
      startDate: new Date(currentStart.getTime()),
      endDate: new Date(currentEnd.getTime()),
      antardashas,
    });

    currentStart = currentEnd;
  });

  // Find Active Dasha for evaluation date
  const evalTime = evaluationDate.getTime();
  let activeMD = dashas[0];
  for (const md of dashas) {
    if (evalTime >= md.startDate.getTime() && evalTime <= md.endDate.getTime()) {
      activeMD = md;
      break;
    }
  }

  let activeAD = activeMD.antardashas[0];
  for (const ad of activeMD.antardashas) {
    if (evalTime >= ad.startDate.getTime() && evalTime <= ad.endDate.getTime()) {
      activeAD = ad;
      break;
    }
  }

  const mdSpan = activeMD.endDate.getTime() - activeMD.startDate.getTime();
  const mdElapsed = Math.max(0, evalTime - activeMD.startDate.getTime());
  const percentageCompleteMD = Math.min(100, Math.round((mdElapsed / mdSpan) * 100));

  return {
    dashas,
    activeDasha: {
      mahadasha: activeMD,
      antardasha: activeAD,
      percentageCompleteMD,
    },
  };
}

// ----------------------------------------------------------------------
// JAIMINI RASHI DRISHTI (SIGN ASPECTS)
// ----------------------------------------------------------------------

export interface RashiDrishtiResult {
  signIndex: number;
  sign: (typeof RASHI_NAMES)[0];
  signType: "Chara (Movable)" | "Sthira (Fixed)" | "Dvisvabhava (Dual)";
  aspectedSigns: (typeof RASHI_NAMES)[0][];
}

/**
 * Calculates Jaimini Rashi Drishti (Sign Aspects)
 * - Movable signs (Aries, Cancer, Libra, Capricorn) aspect Fixed signs (Taurus, Leo, Scorpio, Aquarius) except adjacent.
 * - Fixed signs aspect Movable signs except adjacent.
 * - Dual signs (Gemini, Virgo, Sagittarius, Pisces) aspect all other Dual signs.
 */
export function calculateJaiminiRashiDrishti(signIndex: number): RashiDrishtiResult {
  const sign = RASHI_NAMES[signIndex];
  const signTypeIdx = signIndex % 3; // 0 = Chara, 1 = Sthira, 2 = Dvisvabhava

  let signType: "Chara (Movable)" | "Sthira (Fixed)" | "Dvisvabhava (Dual)" = "Chara (Movable)";
  const aspectedSignIndices: number[] = [];

  if (signTypeIdx === 0) {
    signType = "Chara (Movable)";
    // Aspects all Fixed signs (1, 4, 7, 10) except the adjacent sign (signIndex + 1)
    const fixedSigns = [1, 4, 7, 10];
    const adjacent = (signIndex + 1) % 12;
    fixedSigns.forEach((s) => {
      if (s !== adjacent) aspectedSignIndices.push(s);
    });
  } else if (signTypeIdx === 1) {
    signType = "Sthira (Fixed)";
    // Aspects all Movable signs (0, 3, 6, 9) except the adjacent sign (signIndex - 1)
    const movableSigns = [0, 3, 6, 9];
    const adjacent = (signIndex - 1 + 12) % 12;
    movableSigns.forEach((s) => {
      if (s !== adjacent) aspectedSignIndices.push(s);
    });
  } else {
    signType = "Dvisvabhava (Dual)";
    // Aspects all other Dual signs (2, 5, 8, 11) except itself
    const dualSigns = [2, 5, 8, 11];
    dualSigns.forEach((s) => {
      if (s !== signIndex) aspectedSignIndices.push(s);
    });
  }

  return {
    signIndex,
    sign,
    signType,
    aspectedSigns: aspectedSignIndices.map((idx) => RASHI_NAMES[idx]),
  };
}

// ----------------------------------------------------------------------
// JAIMINI ARGALA & VIRODHARGALA (INTERVENTION & OBSTRUCTION)
// ----------------------------------------------------------------------

export interface ArgalaItem {
  type: "Primary (2nd)" | "Primary (4th)" | "Primary (11th)" | "Secondary (5th)";
  argalaHouse: number;
  argalaSignIndex: number;
  argalaSignName: string;
  argalaPlanets: string[];

  virodhaHouse: number;
  virodhaSignIndex: number;
  virodhaSignName: string;
  virodhaPlanets: string[];

  isUnobstructed: boolean;
  isShubhaArgala: boolean;
  isPapaArgala: boolean;
  statusSummary: string;
}

export interface ArgalaReport {
  targetSignIndex: number;
  targetSignName: string;
  targetType: string;
  argalas: ArgalaItem[];
  unobstructedShubhaCount: number;
  unobstructedPapaCount: number;
  overallVerdict: string;
}

export function calculateArgala(
  ephem: EphemerisResult,
  targetSignIndex: number,
  targetType: string = "Rashi"
): ArgalaReport {
  const BENEFICS = ["Jupiter", "Venus", "Mercury", "Moon"];
  const MALEFICS = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"];

  const planetsBySign: Record<number, string[]> = {};
  for (let i = 0; i < 12; i++) planetsBySign[i] = [];

  Object.values(ephem.planets).forEach((p) => {
    if (p.isModernPlanet) return;
    const s = Math.floor(p.siderealLongitude / 30);
    planetsBySign[s].push(p.name);
  });

  const ARGALA_PAIRS: {
    type: ArgalaItem["type"];
    argHouse: number;
    virHouse: number;
  }[] = [
    { type: "Primary (2nd)", argHouse: 2, virHouse: 12 },
    { type: "Primary (4th)", argHouse: 4, virHouse: 10 },
    { type: "Primary (11th)", argHouse: 11, virHouse: 3 },
    { type: "Secondary (5th)", argHouse: 5, virHouse: 9 },
  ];

  const argalaItems: ArgalaItem[] = [];
  let unobstructedShubhaCount = 0;
  let unobstructedPapaCount = 0;

  ARGALA_PAIRS.forEach((pair) => {
    const argSignIdx = (targetSignIndex + pair.argHouse - 1) % 12;
    const virSignIdx = (targetSignIndex + pair.virHouse - 1) % 12;

    const argPlanets = planetsBySign[argSignIdx] || [];
    const virPlanets = planetsBySign[virSignIdx] || [];

    // Argala exists if there are planets in the Argala sign
    const hasArgala = argPlanets.length > 0;
    // Obstruction occurs if number of planets in Virodha >= planets in Argala
    const isObstructed = hasArgala && virPlanets.length >= argPlanets.length;
    const isUnobstructed = hasArgala && !isObstructed;

    const hasBenefic = argPlanets.some((p) => BENEFICS.includes(p));
    const hasMalefic = argPlanets.some((p) => MALEFICS.includes(p));

    if (isUnobstructed) {
      if (hasBenefic) unobstructedShubhaCount++;
      if (hasMalefic) unobstructedPapaCount++;
    }

    let statusSummary = "";
    if (!hasArgala) {
      statusSummary = "No active planetary intervention (Vacant Argala house).";
    } else if (isObstructed) {
      statusSummary = `Intervention from [${argPlanets.join(", ")}] in ${pair.argHouse}th is obstructed/neutralized by [${virPlanets.join(", ")}] in ${pair.virHouse}th.`;
    } else {
      statusSummary = `Active unobstructed ${hasBenefic ? "Shubha" : "Papa"} Argala from [${argPlanets.join(", ")}] in ${pair.argHouse}th house.`;
    }

    argalaItems.push({
      type: pair.type,
      argalaHouse: pair.argHouse,
      argalaSignIndex: argSignIdx,
      argalaSignName: RASHI_NAMES[argSignIdx].englishName,
      argalaPlanets: argPlanets,
      virodhaHouse: pair.virHouse,
      virodhaSignIndex: virSignIdx,
      virodhaSignName: RASHI_NAMES[virSignIdx].englishName,
      virodhaPlanets: virPlanets,
      isUnobstructed,
      isShubhaArgala: hasBenefic,
      isPapaArgala: hasMalefic,
      statusSummary,
    });
  });

  const overallVerdict = unobstructedShubhaCount > unobstructedPapaCount
    ? "Predominantly auspicious Shubha Argala support unlocks effortless material manifestation and divine favor."
    : unobstructedPapaCount > unobstructedShubhaCount
    ? "Papa Argala dominance indicates intense catalytic pressure, requiring strategic discipline to overcome hurdles."
    : "Balanced Argala dynamics; life matters unfold through standard cyclic effort.";

  return {
    targetSignIndex,
    targetSignName: RASHI_NAMES[targetSignIndex].englishName,
    targetType,
    argalas: argalaItems,
    unobstructedShubhaCount,
    unobstructedPapaCount,
    overallVerdict,
  };
}