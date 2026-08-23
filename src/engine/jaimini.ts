/**
 * Classical Jaimini Chara Karakas (चर कारक) Engine
 * Reference: Jaimini Upadesha Sutras & Brihat Parashara Hora Shastra (BPHS Ch. 32)
 */

import { EphemerisResult, RashiInfo } from "./types";

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
 * Evaluates the 7 classical physical planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn)
 * sorted in descending order of degrees traversed in their occupied zodiac sign (0° to 30°).
 */
export function calculateJaiminiKarakas(ephem: EphemerisResult): JaiminiKarakasResult {
  const eligiblePlanetIds = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  // Extract degrees in sign for each planet
  const planetDegreeList = eligiblePlanetIds.map((id) => {
    const p = ephem.planets[id];
    const degInSign = p ? p.siderealLongitude % 30 : 0;
    return {
      planetId: id,
      planet: p,
      degInSign,
    };
  });

  // Sort descending by degrees in sign (Highest degree = AK ... Lowest degree = DK)
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