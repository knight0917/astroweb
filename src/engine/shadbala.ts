/**
 * Classical Parashari Shadbala (षड्बल / 6-Fold Planetary Strength System) Engine
 * References:
 * - Brihat Parashara Hora Shastra (BPHS), Chapters 27-29
 * - Sripati Paddhati (श्रीपति पद्धति)
 * - Dr. B.V. Raman: Graha and Bhava Balas
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
  abdaBala: number; // Year lord (15)
  masaBala: number; // Month lord (30)
  varaBala: number; // Day lord (45)
  horaBala: number; // Hour lord (60)
  varshaMasaDinaHoraBala: number; // Sum of period lords
  ayanaBala: number; // Declination strength (0..120)
  yuddhaBala: number; // Planetary war
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
  rank: number; // 1 to 7 (by strength ratio)
  rankByRatio: number; // 1 to 7 (by % of minimum requirement)
  rankByTotal: number; // 1 to 7 (by total absolute rupas/virupas)

  // Phalas (Fruits of Strength - BPHS Ch. 29)
  ishtaPhala: number; // Auspicious Fruit (0..60) = sqrt(Uchcha * Cheshta)
  kashtaPhala: number; // Struggle Fruit (0..60) = sqrt((60 - Uchcha) * (60 - Cheshta))

  // Qualitative Analysis
  statusText: "Exceptionally Strong" | "Balavan (Strong)" | "Moderate Strength" | "Deficient / Requires Upaya";
}

export interface ShadbalaResult {
  planets: Record<ShadbalaPlanetId, PlanetShadbala>;
  rankedPlanets: PlanetShadbala[];
  rankedPlanetsByTotal: PlanetShadbala[];
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

// 3. Minimum Required Rupas (BPHS Ch. 29 Verse 28-29)
export const REQUIRED_SHADBALA_RUPAS: Record<ShadbalaPlanetId, number> = {
  Sun: 5.0, // 300 Virupas (Classical BPHS Chapter 29 standard)
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

// Chaldean Hora Order (Sun -> Venus -> Mercury -> Moon -> Saturn -> Jupiter -> Mars)
const CHALDEAN_HORA_ORDER: ShadbalaPlanetId[] = [
  "Sun",
  "Venus",
  "Mercury",
  "Moon",
  "Saturn",
  "Jupiter",
  "Mars",
];

// Weekday to Planet (0 = Sunday -> Sun, 1 = Monday -> Moon...)
const WEEKDAY_LORDS: ShadbalaPlanetId[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

/**
 * 1. Sthana Bala Calculations
 */
function calculateUchchaBala(planetId: ShadbalaPlanetId, longitude: number): number {
  const { debil } = EXALTATION_LONGITUDES[planetId];
  let diff = Math.abs(longitude - debil);
  if (diff > 180) diff = 360 - diff;
  return parseFloat((diff / 3).toFixed(2));
}

function calculateSaptavargajaBala(planetId: ShadbalaPlanetId, longitude: number): number {
  const vargas = ["D1", "D2", "D3", "D7", "D9", "D12", "D30"] as const;
  let total = 0;

  vargas.forEach((v) => {
    const sign = calculateVargaSign(longitude, v);
    const signLord = RASHI_LORDS[sign];

    if (signLord === planetId) {
      total += 30; // Own Sign (Swakshetra) / Moolatrikona
    } else {
      const rel = NATURAL_FRIENDS[planetId];
      if (rel.friends.includes(signLord)) {
        total += 22.5; // Great Friend / Friend average in saptavarga
      } else if (rel.enemies.includes(signLord)) {
        total += 3.75; // Enemy
      } else {
        total += 15.0; // Neutral
      }
    }
  });

  return parseFloat(total.toFixed(2));
}

function calculateOjayugmaBala(planetId: ShadbalaPlanetId, longitude: number): number {
  const d1Sign = Math.floor(longitude / 30);
  const d9Sign = calculateVargaSign(longitude, "D9");

  // Odd signs: Aries(0), Gemini(2), Leo(4), Libra(6), Sag(8), Aqu(10) -> index is EVEN in 0-based
  const isD1Odd = d1Sign % 2 === 0;
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

function calculateKendraBala(house: number): number {
  if ([1, 4, 7, 10].includes(house)) return 60;
  if ([2, 5, 8, 11].includes(house)) return 30; // Panapara
  return 15; // Apoklima
}

function calculateDrekkanaBala(planetId: ShadbalaPlanetId, longitude: number): number {
  const degInSign = longitude % 30;
  const decanate = Math.floor(degInSign / 10); // 0 (1st: 0-10°), 1 (2nd: 10-20°), 2 (3rd: 20-30°)

  // Male Planets (Sun, Mars, Jupiter) get 15 in 1st Decanate
  if (["Sun", "Mars", "Jupiter"].includes(planetId) && decanate === 0) return 15;
  // Neutral Planets (Mercury, Saturn) get 15 in 2nd Decanate
  if (["Mercury", "Saturn"].includes(planetId) && decanate === 1) return 15;
  // Female Planets (Moon, Venus) get 15 in 3rd Decanate
  if (["Moon", "Venus"].includes(planetId) && decanate === 2) return 15;
  return 0;
}

/**
 * 2. Dig Bala (Directional Strength 0..60)
 */
function calculateDigBala(planetId: ShadbalaPlanetId, planetLon: number, ascLon: number): number {
  // Peak Dig Bala Longitudes:
  // Jup/Merc -> Lagna (ascLon)
  // Sun/Mars -> 10th House cusp (ascLon + 270)
  // Saturn -> 7th House cusp (ascLon + 180)
  // Moon/Venus -> 4th House cusp (ascLon + 90)
  const DIG_PEAK_OFFSETS: Record<ShadbalaPlanetId, number> = {
    Jupiter: 0,
    Mercury: 0,
    Sun: 270,
    Mars: 270,
    Saturn: 180,
    Moon: 90,
    Venus: 90,
  };

  const peakLon = (ascLon + DIG_PEAK_OFFSETS[planetId]) % 360;
  let diff = Math.abs(planetLon - peakLon);
  if (diff > 180) diff = 360 - diff;

  // Dig Bala = (180 - diff) / 3
  const score = Math.max(0, (180 - diff) / 3);
  return parseFloat(score.toFixed(2));
}

/**
 * 3. Kala Bala (Temporal Strengths)
 */
function calculateKalaBala(
  planetId: ShadbalaPlanetId,
  ephem: EphemerisResult,
  date: Date
): KalaBalaBreakdown {
  const sunLon = ephem.planets["Sun"].siderealLongitude;
  const moonLon = ephem.planets["Moon"].siderealLongitude;
  const sunAlt = ephem.planets["Sun"].altitude; // >0 is Day, <0 is Night

  // A. Nathonnatha Bala (Diurnal / Nocturnal)
  // Midnight / Noon ratio: distance from horizon / meridian
  let nathonnatha = 30.0;
  const isNight = sunAlt < 0;
  const midnightProximity = Math.min(1.0, Math.max(0.0, Math.abs(sunAlt) / 60)); // normalized arc

  if (planetId === "Mercury") {
    nathonnatha = 60.0; // Always receives full 60 Virupas
  } else if (["Moon", "Mars", "Saturn"].includes(planetId)) {
    // Nocturnal planets: stronger at night
    nathonnatha = isNight ? parseFloat((30 + midnightProximity * 30).toFixed(2)) : parseFloat((30 - midnightProximity * 28).toFixed(2));
  } else {
    // Sun, Jupiter, Venus (Diurnal planets): stronger at day
    nathonnatha = !isNight ? parseFloat((30 + midnightProximity * 30).toFixed(2)) : parseFloat((30 - midnightProximity * 28).toFixed(2));
  }
  nathonnatha = Math.min(60, Math.max(1.5, nathonnatha));

  // B. Paksha Bala (Lunar Phase)
  let moonSunElongation = (moonLon - sunLon + 360) % 360;
  const pakshaDistance = moonSunElongation <= 180 ? moonSunElongation : 360 - moonSunElongation;
  const rawPaksha = parseFloat((pakshaDistance / 3).toFixed(2));

  let pakshaBala = 30.0;
  if (planetId === "Moon") {
    pakshaBala = parseFloat((rawPaksha * 2).toFixed(2));
  } else if (["Jupiter", "Venus"].includes(planetId)) {
    pakshaBala = rawPaksha;
  } else {
    // Malefics (Sun, Mars, Saturn) receive inverse
    pakshaBala = parseFloat((60.0 - rawPaksha).toFixed(2));
  }
  pakshaBala = Math.min(60, Math.max(1.0, pakshaBala));

  // C. Tribhaga Bala (Three parts of day and three parts of night)
  let tribhagaBala = 0.0;
  if (planetId === "Jupiter") tribhagaBala += 60.0; // Jupiter always gets 60 in classical Sripati
  if (isNight && planetId === "Venus") tribhagaBala = 60.0; // Venus rules midnight portion

  // D. Period Lords (Vedic Sunrise Rule)
  // Local time conversion
  const tzOffset = ephem.location?.timezoneOffsetHours ?? 5.5;
  const localMs = date.getTime() + tzOffset * 3600 * 1000;
  const localDate = new Date(localMs);
  const localHour = localDate.getUTCHours() + localDate.getUTCMinutes() / 60;

  // If before sunrise (~05:15 AM), the Vedic day belongs to previous weekday
  let vedicDayIndex = localDate.getUTCDay();
  if (localHour < 5.25) {
    vedicDayIndex = (vedicDayIndex + 6) % 7;
  }
  const varaLord = WEEKDAY_LORDS[vedicDayIndex];

  let varaBala = varaLord === planetId ? 45.0 : 0.0;

  // Hora Lord (Chaldean hour sequence from sunrise)
  const hoursSinceSunrise = (localHour >= 5.25 ? localHour - 5.25 : localHour + 24 - 5.25);
  const horaIndex = Math.floor(hoursSinceSunrise);
  const startHoraOffset = CHALDEAN_HORA_ORDER.indexOf(varaLord);
  const currentHoraLord = CHALDEAN_HORA_ORDER[(startHoraOffset + horaIndex) % 7];
  const horaBala = currentHoraLord === planetId ? 60.0 : 0.0;

  // Month & Year Lords
  const masaLord = planetId === "Mars" ? 30.0 : 0.0; // Taurus solar month ruler
  const abdaLord = planetId === "Jupiter" ? 15.0 : 0.0; // Year ruler

  const periodSum = parseFloat((abdaLord + masaLord + varaBala + horaBala).toFixed(2));

  // E. Ayana Bala (Declination Strength + Sripati Uttarāyana Doubling for Sun)
  // Approximate tropical declination based on solar/planetary longitude
  const tropLon = (ephem.planets[planetId]?.tropicalLongitude ?? 0);
  const declination = 23.44 * Math.sin((tropLon * Math.PI) / 180);
  let ayanaBala = parseFloat(((24 + declination) * 1.25).toFixed(2));

  if (planetId === "Sun") {
    // Sripati rule: double Sun's Ayana Bala during Uttarāyana (Capricorn to Gemini)
    if (tropLon >= 270 || tropLon <= 90) {
      ayanaBala = parseFloat((ayanaBala * 2).toFixed(2));
    }
  }

  const yuddhaBala = 0.0;
  const total = parseFloat((nathonnatha + pakshaBala + tribhagaBala + periodSum + ayanaBala + yuddhaBala).toFixed(2));

  return {
    nathonnathaBala: nathonnatha,
    pakshaBala,
    tribhagaBala,
    abdaBala: abdaLord,
    masaBala: masaLord,
    varaBala,
    horaBala,
    varshaMasaDinaHoraBala: periodSum,
    ayanaBala,
    yuddhaBala,
    total,
  };
}

/**
 * 4. Cheshta Bala (Motional / Planetary Velocity Strength)
 */
function calculateCheshtaBala(
  planetId: ShadbalaPlanetId,
  isRetrograde: boolean,
  speed: number,
  kalaBala: KalaBalaBreakdown
): number {
  if (planetId === "Sun") return parseFloat((kalaBala.ayanaBala * 0.45).toFixed(2));
  if (planetId === "Moon") return kalaBala.pakshaBala;

  if (isRetrograde) return 60.0;

  // Speed-based Cheshta curve (BPHS Ch. 28)
  const normSpeed = Math.abs(speed);
  if (normSpeed < 0.1) return 10.0;
  if (normSpeed < 0.5) return 20.0;
  if (normSpeed < 1.0) return 25.0;
  return parseFloat(Math.min(60, 25 + normSpeed * 15).toFixed(2));
}

/**
 * 5. Drik Bala (Aspectual Net Strength from Parashari Drishtis)
 */
function calculateDrikBala(planetId: ShadbalaPlanetId, ephem: EphemerisResult): number {
  const pLon = ephem.planets[planetId]?.siderealLongitude ?? 0;
  let netAspect = 0.0;

  const benefics: ShadbalaPlanetId[] = ["Jupiter", "Venus", "Mercury"];
  const malefics: ShadbalaPlanetId[] = ["Sun", "Mars", "Saturn"];

  benefics.forEach((b) => {
    if (b !== planetId) {
      const bLon = ephem.planets[b]?.siderealLongitude ?? 0;
      let diff = Math.abs(pLon - bLon);
      if (diff > 180) diff = 360 - diff;

      // Positive Trine / Sextile / Kendra aspects
      if (Math.abs(diff - 120) < 15) netAspect += 6.0;
      else if (Math.abs(diff - 60) < 15) netAspect += 3.0;
      else if (Math.abs(diff - 180) < 15) netAspect += 4.0;
    }
  });

  malefics.forEach((m) => {
    if (m !== planetId) {
      const mLon = ephem.planets[m]?.siderealLongitude ?? 0;
      let diff = Math.abs(pLon - mLon);
      if (diff > 180) diff = 360 - diff;

      if (Math.abs(diff - 90) < 15) netAspect -= 4.0;
      else if (diff < 10) netAspect -= 2.0;
    }
  });

  return parseFloat(Math.max(-30, Math.min(30, netAspect)).toFixed(2));
}

/**
 * Master Shadbala Calculation Function
 */
export function calculateShadbala(ephem: EphemerisResult): ShadbalaResult {
  const planetIds: ShadbalaPlanetId[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const planets: Record<ShadbalaPlanetId, PlanetShadbala> = {} as any;
  const date = ephem.utcDate ? new Date(ephem.utcDate) : new Date();
  const ascLon = ephem.ascendant.siderealLongitude;

  planetIds.forEach((id) => {
    const p = ephem.planets[id];
    const lon = p.siderealLongitude;

    // 1. Sthana Bala
    const uchcha = calculateUchchaBala(id, lon);
    const saptavarga = calculateSaptavargajaBala(id, lon);
    const ojayugma = calculateOjayugmaBala(id, lon);
    const kendra = calculateKendraBala(p.house);
    const drekkana = calculateDrekkanaBala(id, lon);
    const sthanaTotal = parseFloat((uchcha + saptavarga + ojayugma + kendra + drekkana).toFixed(2));

    const sthanaBala: SthanaBalaBreakdown = {
      uchchaBala: uchcha,
      saptavargajaBala: saptavarga,
      ojayugmaBala: ojayugma,
      kendraBala: kendra,
      drekkanaBala: drekkana,
      total: sthanaTotal,
    };

    // 2. Dig Bala
    const digBala = calculateDigBala(id, lon, ascLon);

    // 3. Kala Bala
    const kalaBala = calculateKalaBala(id, ephem, date);

    // 4. Cheshta Bala
    const cheshtaBala = calculateCheshtaBala(id, p.isRetrograde, p.speed, kalaBala);

    // 5. Naisargika Bala
    const naisargikaBala = NAISARGIKA_BALA[id];

    // 6. Drik Bala
    const drikBala = calculateDrikBala(id, ephem);

    // Total Virupas & Rupas
    const totalVirupas = parseFloat(
      (sthanaTotal + digBala + kalaBala.total + cheshtaBala + naisargikaBala + drikBala).toFixed(2)
    );
    const totalRupas = parseFloat((totalVirupas / 60).toFixed(2));

    const requiredRupas = REQUIRED_SHADBALA_RUPAS[id];
    const requiredVirupas = requiredRupas * 60;
    const strengthRatio = parseFloat((totalRupas / requiredRupas).toFixed(2));
    const percentageEfficiency = parseFloat((strengthRatio * 100).toFixed(0));
    const isBalavan = strengthRatio >= 1.0;

    // Phalas (BPHS Ch. 29)
    const ishtaPhala = parseFloat(Math.sqrt(Math.max(0, uchcha * cheshtaBala)).toFixed(2));
    const kashtaPhala = parseFloat(
      Math.sqrt(Math.max(0, (60 - uchcha) * (60 - Math.min(60, cheshtaBala)))).toFixed(2)
    );

    let statusText: PlanetShadbala["statusText"] = "Balavan (Strong)";
    if (strengthRatio >= 1.35) statusText = "Exceptionally Strong";
    else if (strengthRatio >= 1.0) statusText = "Balavan (Strong)";
    else if (strengthRatio >= 0.9) statusText = "Moderate Strength";
    else statusText = "Deficient / Requires Upaya";

    planets[id] = {
      planetId: id,
      name: p.name,
      sanskritName: p.sanskritName,
      symbol: p.symbol,
      color: p.color,
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
      rank: 1, // Will assign after sorting
      rankByRatio: 1,
      rankByTotal: 1,
      ishtaPhala,
      kashtaPhala,
      statusText,
    };
  });

  // 1. Sort by strength ratio descending (% of required minimum)
  const rankedPlanets = Object.values(planets).sort((a, b) => b.strengthRatio - a.strengthRatio);
  rankedPlanets.forEach((p, idx) => {
    p.rank = idx + 1;
    p.rankByRatio = idx + 1;
  });

  // 2. Sort by total absolute Virupas / Rupas descending
  const rankedPlanetsByTotal = [...rankedPlanets].sort((a, b) => b.totalVirupas - a.totalVirupas);
  rankedPlanetsByTotal.forEach((p, idx) => {
    p.rankByTotal = idx + 1;
  });

  const totalRatios = rankedPlanets.reduce((acc, p) => acc + p.strengthRatio, 0);
  const averageStrengthRatio = parseFloat((totalRatios / rankedPlanets.length).toFixed(2));

  return {
    planets,
    rankedPlanets,
    rankedPlanetsByTotal,
    strongestPlanet: rankedPlanets[0],
    weakestPlanet: rankedPlanets[rankedPlanets.length - 1],
    averageStrengthRatio,
  };
}