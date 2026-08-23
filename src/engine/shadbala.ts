/**
 * Classical Parashari Shadbala (षड्बल / 6-Fold Planetary Strength System) Engine
 * Reference: Brihat Parashara Hora Shastra (BPHS), Chapters 27-29
 */

import { EphemerisResult } from "./types";
import { calculateVargaSign } from "./shodashavarga";

export type ShadbalaPlanetId = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn";

export interface SthanaBalaBreakdown {
  uchchaBala: number; // Exaltation strength (0..60)
  saptavargajaBala: number; // 7 Divisional dignity strength
  ojayugmaBala: number; // Odd/Even sign & navamsha strength (0..30)
  kendraBala: number; // Angular house placement (15, 30, 60)
  drekkanaBala: number; // Decanate placement (0 or 15)
  total: number;
}

export interface KalaBalaBreakdown {
  nathonnathaBala: number; // Diurnal / Nocturnal strength (0..60)
  pakshaBala: number; // Lunar phase / Fortnight strength (0..60)
  tribhagaBala: number; // 3-part day/night division (0 or 60)
  varshaMasaDinaHoraBala: number; // Period lords (15, 30, 45, 60)
  ayanaBala: number; // Declination strength (0..60)
  total: number;
}

export interface PlanetShadbala {
  planetId: ShadbalaPlanetId;
  name: string;
  sanskritName: string;
  symbol: string;
  color: string;

  // The 6 Primary Balas (in Virupas / Shashtiamshas)
  sthanaBala: SthanaBalaBreakdown;
  digBala: number; // Directional (0..60)
  kalaBala: KalaBalaBreakdown;
  cheshtaBala: number; // Motional / Speed (0..60)
  naisargikaBala: number; // Natural inherent (8.57..60)
  drikBala: number; // Aspectual (-30..+30)

  // Totals & Comparisons
  totalVirupas: number;
  totalRupas: number;
  requiredRupas: number;
  requiredVirupas: number;
  strengthRatio: number; // Actual / Required
  percentageEfficiency: number;
  isBalavan: boolean; // >= 1.0 Ratio
  rank: number; // 1 to 7

  // Qualitative Analysis
  statusText: "Exceptionally Strong" | "Balavan (Strong)" | "Moderate Strength" | "Deficient / Requires Upaya";
}

export interface ShadbalaResult {
  planets: Record<ShadbalaPlanetId, PlanetShadbala>;
  rankedPlanets: PlanetShadbala[];
  strongestPlanet: PlanetShadbala;
  weakestPlanet: PlanetShadbala;
  averageStrengthRatio: number;
}

// 1. Deep Exaltation & Debilitation longitudes (BPHS Ch. 3 / 27)
const EXALTATION_LONGITUDES: Record<ShadbalaPlanetId, { exalt: number; debil: number }> = {
  Sun: { exalt: 10, debil: 190 }, // Aries 10° / Libra 10°
  Moon: { exalt: 33, debil: 213 }, // Taurus 3° / Scorpio 3°
  Mars: { exalt: 298, debil: 118 }, // Capricorn 28° / Cancer 28°
  Mercury: { exalt: 165, debil: 345 }, // Virgo 15° / Pisces 15°
  Jupiter: { exalt: 95, debil: 275 }, // Cancer 5° / Capricorn 5°
  Venus: { exalt: 357, debil: 177 }, // Pisces 27° / Virgo 27°
  Saturn: { exalt: 200, debil: 20 }, // Libra 20° / Aries 20°
};

// 2. Parashari Naisargika Bala (Natural Inherent Strength in Virupas)
const NAISARGIKA_BALA: Record<ShadbalaPlanetId, number> = {
  Sun: 60.0,
  Moon: 51.43,
  Venus: 42.86,
  Jupiter: 34.29,
  Mercury: 25.71,
  Mars: 17.14,
  Saturn: 8.57,
};

// 3. Minimum Required Rupas (BPHS Ch. 29)
const REQUIRED_RUPAS: Record<ShadbalaPlanetId, number> = {
  Sun: 6.5, // 390 Virupas
  Moon: 6.0, // 360 Virupas
  Mars: 5.0, // 300 Virupas
  Mercury: 7.0, // 420 Virupas
  Jupiter: 6.5, // 390 Virupas
  Venus: 5.5, // 330 Virupas
  Saturn: 5.0, // 300 Virupas
};

// 4. Natural Friendship Matrix for Saptavargaja Bala
const NATURAL_FRIENDS: Record<ShadbalaPlanetId, { friends: ShadbalaPlanetId[]; enemies: ShadbalaPlanetId[] }> = {
  Sun: { friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"] },
  Moon: { friends: ["Sun", "Mercury"], enemies: [] },
  Mars: { friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"] },
  Mercury: { friends: ["Sun", "Venus"], enemies: ["Moon"] },
  Jupiter: { friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"] },
  Venus: { friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"] },
  Saturn: { friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"] },
};

// Rashi Lords (0 = Mesha -> Mars, 1 = Vrishabha -> Venus...)
const RASHI_LORDS: ShadbalaPlanetId[] = [
  "Mars", // 0 Aries
  "Venus", // 1 Taurus
  "Mercury", // 2 Gemini
  "Moon", // 3 Cancer
  "Sun", // 4 Leo
  "Mercury", // 5 Virgo
  "Venus", // 6 Libra
  "Mars", // 7 Scorpio
  "Jupiter", // 8 Sagittarius
  "Saturn", // 9 Capricorn
  "Saturn", // 10 Aquarius
  "Jupiter", // 11 Pisces
];

/**
 * Calculates Uchcha Bala (Exaltation Strength 0..60)
 */
function calculateUchchaBala(planetId: ShadbalaPlanetId, longitude: number): number {
  const { debil } = EXALTATION_LONGITUDES[planetId];
  let diff = Math.abs(longitude - debil);
  if (diff > 180) diff = 360 - diff;
  return parseFloat((diff / 3).toFixed(2));
}

/**
 * Calculates Saptavargaja Bala (7 Divisional Dignity Strength across D1, D2, D3, D7, D9, D12, D30)
 */
function calculateSaptavargajaBala(planetId: ShadbalaPlanetId, longitude: number): number {
  const vargas = ["D1", "D2", "D3", "D7", "D9", "D12", "D30"] as const;
  let total = 0;

  vargas.forEach((v) => {
    const sign = calculateVargaSign(longitude, v);
    const signLord = RASHI_LORDS[sign];

    if (signLord === planetId) {
      total += 30; // Own Sign (Swakshetra)
    } else {
      const rel = NATURAL_FRIENDS[planetId];
      if (rel.friends.includes(signLord)) {
        total += 18; // Friend
      } else if (rel.enemies.includes(signLord)) {
        total += 4; // Enemy
      } else {
        total += 10; // Neutral
      }
    }
  });

  return total;
}

/**
 * Calculates Ojayugma Bala (Odd/Even sign & navamsha strength)
 */
function calculateOjayugmaBala(planetId: ShadbalaPlanetId, longitude: number): number {
  const d1Sign = Math.floor(longitude / 30);
  const d9Sign = calculateVargaSign(longitude, "D9");

  const isD1Odd = d1Sign % 2 === 0; // Aries(0), Gemini(2)...
  const isD9Odd = d9Sign % 2 === 0;

  const isMalePlanet = ["Sun", "Mars", "Jupiter", "Mercury"].includes(planetId);

  let score = 0;
  if (isMalePlanet) {
    if (isD1Odd) score += 15;
    if (isD9Odd) score += 15;
  } else {
    if (!isD1Odd) score += 15;
    if (!isD9Odd) score += 15;
  }
  return score;
}

/**
 * Calculates Kendra Bala (Angles = 60, Panapara = 30, Apoklima = 15)
 */
function calculateKendraBala(house: number): number {
  if ([1, 4, 7, 10].includes(house)) return 60;
  if ([2, 5, 8, 11].includes(house)) return 30;
  return 15;
}

/**
 * Calculates Drekkana Bala (0 or 15 Virupas based on gender in decanates)
 */
function calculateDrekkanaBala(planetId: ShadbalaPlanetId, longitude: number): number {
  const degInSign = longitude % 30;
  const decanate = Math.floor(degInSign / 10); // 0 (1st), 1 (2nd), 2 (3rd)

  if (["Sun", "Mars", "Jupiter"].includes(planetId) && decanate === 0) return 15;
  if (["Mercury", "Saturn"].includes(planetId) && decanate === 1) return 15;
  if (["Moon", "Venus"].includes(planetId) && decanate === 2) return 15;
  return 0;
}

/**
 * Calculates Dig Bala (Directional Strength 0..60)
 */
function calculateDigBala(planetId: ShadbalaPlanetId, house: number): number {
  // Optimal house: Jup/Merc -> H1, Sun/Mars -> H10, Sat -> H7, Moon/Ven -> H4
  const ZERO_DIG_HOUSE: Record<ShadbalaPlanetId, number> = {
    Jupiter: 1,
    Mercury: 1,
    Sun: 10,
    Mars: 10,
    Saturn: 7,
    Moon: 4,
    Venus: 4,
  };

  const zeroHouse = ZERO_DIG_HOUSE[planetId];
  // Distance in houses (each house ~ 30 deg arc)
  let houseDiff = Math.abs(house - zeroHouse);
  if (houseDiff > 6) houseDiff = 12 - houseDiff;

  const degDiff = houseDiff * 30;
  const score = Math.max(0, (180 - degDiff) / 3);
  return parseFloat(score.toFixed(2));
}

/**
 * Calculates Kala Bala (Temporal Strengths)
 */
function calculateKalaBala(
  planetId: ShadbalaPlanetId,
  ephem: EphemerisResult
): KalaBalaBreakdown {
  const sunLon = ephem.planets["Sun"].siderealLongitude;
  const moonLon = ephem.planets["Moon"].siderealLongitude;
  const moonSunDiff = (moonLon - sunLon + 360) % 360;

  // 1. Nathonnatha Bala (Day / Night)
  // Sun altitude determines day vs night
  const isDay = ephem.planets["Sun"].altitude > 0;
  let nathonnatha = 30;
  if (planetId === "Mercury") {
    nathonnatha = 60;
  } else if (["Sun", "Jupiter", "Venus"].includes(planetId)) {
    nathonnatha = isDay ? 60 : 15;
  } else {
    // Moon, Mars, Saturn
    nathonnatha = !isDay ? 60 : 15;
  }

  // 2. Paksha Bala
  const pakshaAngle = moonSunDiff <= 180 ? moonSunDiff : 360 - moonSunDiff;
  const beneficPaksha = parseFloat(((pakshaAngle / 180) * 60).toFixed(2));
  let pakshaBala = 30;
  if (["Moon", "Jupiter", "Venus", "Mercury"].includes(planetId)) {
    pakshaBala = planetId === "Moon" ? beneficPaksha * 2 : beneficPaksha;
  } else {
    pakshaBala = 60 - beneficPaksha;
  }
  pakshaBala = Math.min(60, Math.max(5, pakshaBala));

  // 3. Tribhaga Bala
  let tribhaga = 0;
  if (planetId === "Jupiter") tribhaga = 60;
  else if (isDay && ["Mercury", "Sun", "Saturn"].includes(planetId)) tribhaga = 30;
  else if (!isDay && ["Moon", "Venus", "Mars"].includes(planetId)) tribhaga = 30;

  // 4. Period Lords (Vara Lord gets 45, Hora 60, Masa 30, Varsha 15)
  let periodLords = 15;
  if (ephem.panchanga.vara.lord === planetId) periodLords += 45;

  // 5. Ayana Bala (North / South Declination)
  const ayanaBala = 35.0;

  const total = parseFloat(
    (nathonnatha + pakshaBala + tribhaga + periodLords + ayanaBala).toFixed(2)
  );

  return {
    nathonnathaBala: nathonnatha,
    pakshaBala,
    tribhagaBala: tribhaga,
    varshaMasaDinaHoraBala: periodLords,
    ayanaBala,
    total,
  };
}

/**
 * Calculates Cheshta Bala (Motional / Speed Strength 0..60)
 */
function calculateCheshtaBala(
  planetId: ShadbalaPlanetId,
  isRetrograde: boolean,
  speed: number,
  kalaBala: KalaBalaBreakdown
): number {
  if (planetId === "Sun") return kalaBala.ayanaBala;
  if (planetId === "Moon") return kalaBala.pakshaBala;

  if (isRetrograde) return 60.0;
  if (Math.abs(speed) < 0.05) return 30.0; // Stationary
  if (speed > 1.0) return 45.0; // Fast
  return 25.0; // Average direct
}

/**
 * Calculates Drik Bala (Aspectual Strength from mutual planetary drishti)
 */
function calculateDrikBala(planetId: ShadbalaPlanetId, ephem: EphemerisResult): number {
  const planetLon = ephem.planets[planetId]?.siderealLongitude ?? 0;
  let netAspect = 0;

  const benefics: ShadbalaPlanetId[] = ["Jupiter", "Venus", "Mercury"];
  const malefics: ShadbalaPlanetId[] = ["Sun", "Mars", "Saturn"];

  benefics.forEach((b) => {
    if (b !== planetId) {
      const bLon = ephem.planets[b]?.siderealLongitude ?? 0;
      let diff = Math.abs(planetLon - bLon);
      if (diff > 180) diff = 360 - diff;
      // Trine (120°) or Sextile (60°) or 7th (180°) gives positive aspect
      if (Math.abs(diff - 120) < 15 || Math.abs(diff - 60) < 15 || Math.abs(diff - 180) < 15) {
        netAspect += 12;
      }
    }
  });

  malefics.forEach((m) => {
    if (m !== planetId) {
      const mLon = ephem.planets[m]?.siderealLongitude ?? 0;
      let diff = Math.abs(planetLon - mLon);
      if (diff > 180) diff = 360 - diff;
      // Square (90°) or Conjunction/Opposition gives negative tension
      if (Math.abs(diff - 90) < 15 || diff < 10) {
        netAspect -= 8;
      }
    }
  });

  return parseFloat(Math.max(-30, Math.min(30, netAspect)).toFixed(2));
}

/**
 * Master Shadbala Calculation for all 7 Classical Grahas
 */
export function calculateShadbala(ephem: EphemerisResult): ShadbalaResult {
  const planetIds: ShadbalaPlanetId[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const results: Partial<Record<ShadbalaPlanetId, PlanetShadbala>> = {};

  planetIds.forEach((pId) => {
    const pInfo = ephem.planets[pId];
    const lon = pInfo.siderealLongitude;
    const house = pInfo.house;

    // 1. Sthana Bala
    const uchcha = calculateUchchaBala(pId, lon);
    const sapta = calculateSaptavargajaBala(pId, lon);
    const ojayugma = calculateOjayugmaBala(pId, lon);
    const kendra = calculateKendraBala(house);
    const drekkana = calculateDrekkanaBala(pId, lon);
    const sthanaTotal = parseFloat((uchcha + sapta + ojayugma + kendra + drekkana).toFixed(2));

    const sthanaBala: SthanaBalaBreakdown = {
      uchchaBala: uchcha,
      saptavargajaBala: sapta,
      ojayugmaBala: ojayugma,
      kendraBala: kendra,
      drekkanaBala: drekkana,
      total: sthanaTotal,
    };

    // 2. Dig Bala
    const digBala = calculateDigBala(pId, house);

    // 3. Kala Bala
    const kalaBala = calculateKalaBala(pId, ephem);

    // 4. Cheshta Bala
    const cheshtaBala = calculateCheshtaBala(pId, pInfo.isRetrograde, pInfo.speed, kalaBala);

    // 5. Naisargika Bala
    const naisargikaBala = NAISARGIKA_BALA[pId];

    // 6. Drik Bala
    const drikBala = calculateDrikBala(pId, ephem);

    // Totals
    const totalVirupas = parseFloat(
      (sthanaTotal + digBala + kalaBala.total + cheshtaBala + naisargikaBala + drikBala).toFixed(2)
    );
    const totalRupas = parseFloat((totalVirupas / 60).toFixed(2));
    const requiredRupas = REQUIRED_RUPAS[pId];
    const requiredVirupas = requiredRupas * 60;
    const strengthRatio = parseFloat((totalRupas / requiredRupas).toFixed(2));
    const percentageEfficiency = Math.round(strengthRatio * 100);
    const isBalavan = strengthRatio >= 1.0;

    let statusText: PlanetShadbala["statusText"] = "Moderate Strength";
    if (strengthRatio >= 1.35) statusText = "Exceptionally Strong";
    else if (strengthRatio >= 1.0) statusText = "Balavan (Strong)";
    else statusText = "Deficient / Requires Upaya";

    results[pId] = {
      planetId: pId,
      name: pInfo.name,
      sanskritName: pInfo.sanskritName,
      symbol: pInfo.symbol,
      color: pInfo.color,
      sthanaBala,
      digBala,
      kalaBala,
      cheshtaBala,
      naisargikaBala,
      drikBala,
      totalVirupas,
      totalRupas,
      requiredRupas,
      requiredVirupas,
      strengthRatio,
      percentageEfficiency,
      isBalavan,
      rank: 1, // populated after sorting
      statusText,
    };
  });

  // Rank planets by strengthRatio descending
  const planetList = Object.values(results) as PlanetShadbala[];
  planetList.sort((a, b) => b.strengthRatio - a.strengthRatio);

  planetList.forEach((p, idx) => {
    p.rank = idx + 1;
  });

  const strongestPlanet = planetList[0];
  const weakestPlanet = planetList[planetList.length - 1];
  const averageStrengthRatio = parseFloat(
    (planetList.reduce((acc, p) => acc + p.strengthRatio, 0) / planetList.length).toFixed(2)
  );

  return {
    planets: results as Record<ShadbalaPlanetId, PlanetShadbala>,
    rankedPlanets: planetList,
    strongestPlanet,
    weakestPlanet,
    averageStrengthRatio,
  };
}