/**
 * Financial Astrology & Astro-Economics Engine v2.0 (व्यापार ज्योतिष एवं संहिता)
 *
 * Synthesized from:
 * 1. Varahamihira's Brihat Samhita (Adhyaya 16 Graha Bhakti, Adhyaya 17 Graha Yuddha, Adhyaya 41 Dravya Nishchaya & Adhyaya 42 Argha Kanda)
 * 2. Pandit Hira Lal Dikshit's Vyapar Bhavishya (Nakshatra Buy/Sell Liquidity, Panchaka 5x Rule, Station/Udaya Reversals, Intraday Chandra Yuti & Weekly Cycles)
 * 3. Narapati's Narapatijayacharya Swarodaya (Sarvatobhadra Vedha Multipliers: 3x Uchcha, 2x Vakri, 0x Neecha; Panchanga Rahu Jiva/Mrita Paksha; 8 Solar Upagrahas)
 * 4. C.S. Patel & Aiyar's Ashtakavarga Kakshya Transit System (3°45' 8-fold orbital sub-divisions)
 * 5. Classical Transit & Panchanga Deep Rules (Yogi/Avayogi Points, Tithi Dagdha Rashis, Dual Sign 15° Bifurcation, Rohini Shakata Bhedana, Kharmas)
 */

import { calculateVedicEphemeris } from "./ephemeris";

export type MarketSymbol = "XAUUSD" | "EURUSD" | "GBPUSD" | "USDJPY" | "US30" | "USOIL" | "BTCUSD";

export interface AssetSignification {
  symbol: MarketSymbol;
  name: string;
  primaryLord: string;       // e.g. "Sun" for Gold
  secondaryLord: string;     // e.g. "Jupiter" for Gold
  rulingRashis: number[];    // 0 = Mesha (Aries), 9 = Makara (Capricorn)
  keyNakshatras: number[];   // 0 = Ashwini, 2 = Krittika, 7 = Pushya
  opposingLord: string;      // e.g. "Saturn" for Gold / "Sun" for EUR
}

export const ASSET_SIGNIFICATIONS: Record<MarketSymbol, AssetSignification> = {
  XAUUSD: {
    symbol: "XAUUSD",
    name: "Gold / US Dollar",
    primaryLord: "Sun",
    secondaryLord: "Jupiter",
    rulingRashis: [0, 9, 4], // Mesha (Aries - raw gold, BS 41.2), Makara (Capricorn - gold & black metal, BS 41.7), Simha (Leo - solar bullion, BS 42.6)
    keyNakshatras: [2, 7, 11, 20], // Krittika, Pushya, Uttara Phalguni, Uttara Ashadha
    opposingLord: "Saturn",
  },
  EURUSD: {
    symbol: "EURUSD",
    name: "Euro / US Dollar",
    primaryLord: "Venus",
    secondaryLord: "Jupiter",
    rulingRashis: [1, 6, 11], // Taurus, Libra, Pisces
    keyNakshatras: [1, 10, 13, 19], // Bharani, Purva Phalguni, Chitra, Purva Ashadha
    opposingLord: "Saturn",
  },
  GBPUSD: {
    symbol: "GBPUSD",
    name: "British Pound / US Dollar",
    primaryLord: "Jupiter",
    secondaryLord: "Mars",
    rulingRashis: [8, 0], // Sagittarius, Aries
    keyNakshatras: [6, 15, 24], // Punarvasu, Vishakha, Purva Bhadrapada
    opposingLord: "Saturn",
  },
  USDJPY: {
    symbol: "USDJPY",
    name: "US Dollar / Japanese Yen",
    primaryLord: "Moon",
    secondaryLord: "Mercury",
    rulingRashis: [3, 2, 5], // Cancer, Gemini, Virgo
    keyNakshatras: [3, 12, 21], // Rohini, Hasta, Shravana
    opposingLord: "Mars",
  },
  US30: {
    symbol: "US30",
    name: "Dow Jones Industrial Average",
    primaryLord: "Mercury",
    secondaryLord: "Jupiter",
    rulingRashis: [2, 5, 8], // Gemini, Virgo, Sagittarius
    keyNakshatras: [4, 16, 26], // Mrigashira, Anuradha, Revati
    opposingLord: "Saturn",
  },
  USOIL: {
    symbol: "USOIL",
    name: "WTI Crude Oil",
    primaryLord: "Saturn",
    secondaryLord: "Mars",
    rulingRashis: [7, 9, 10, 11], // Scorpio, Capricorn, Aquarius, Pisces (Oils - BS 41.8)
    keyNakshatras: [5, 17, 22], // Ardra, Jyeshtha, Dhanishta
    opposingLord: "Sun",
  },
  BTCUSD: {
    symbol: "BTCUSD",
    name: "Bitcoin / US Dollar",
    primaryLord: "Rahu",
    secondaryLord: "Mercury",
    rulingRashis: [10, 2], // Aquarius, Gemini
    keyNakshatras: [5, 14, 23], // Ardra, Swati, Shatabhisha (Rahu's triad)
    opposingLord: "Jupiter",
  },
};

const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const NAKSHATRA_NAMES = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const NAKSHATRA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"
];

/**
 * Exaltation & Debilitation Sign Map for Narapati Jaicharya Sloka 38 Vedha Multipliers:
 * "वक्रग्रहे फलं द्विगुणं त्रिगुणं स्वोच्चसंस्थिते, नीचस्थो निष्फलो ग्रहः"
 * Exalted = 3x, Retrograde = 2x, Debilitated = 0x (nullified).
 */
const EXALTATION_RASHI: Record<string, number> = {
  Sun: 0,      // Aries
  Moon: 1,     // Taurus
  Mars: 9,     // Capricorn
  Mercury: 5,  // Virgo
  Jupiter: 3,  // Cancer
  Venus: 11,   // Pisces
  Saturn: 6,   // Libra
  Rahu: 1,     // Taurus
  Ketu: 7,     // Scorpio
};

const DEBILITATION_RASHI: Record<string, number> = {
  Sun: 6,      // Libra
  Moon: 7,     // Scorpio
  Mars: 3,     // Cancer
  Mercury: 11, // Pisces
  Jupiter: 9,  // Capricorn
  Venus: 5,    // Virgo
  Saturn: 0,   // Aries
  Rahu: 7,     // Scorpio
  Ketu: 1,     // Taurus
};

/**
 * Tithi Dagdha Rashis (Burnt Signs by Lunar Day 1-14; 15/30 have none).
 * Planets transiting Dagdha Rashis experience liquidity traps / false breakouts unless Retrograde.
 */
const TITHI_DAGDHA_RASHIS: Record<number, [number, number]> = {
  1: [9, 6],   // Pratipada: Capricorn, Libra
  2: [8, 11],  // Dwitiya: Sagittarius, Pisces
  3: [4, 9],   // Tritiya: Leo, Capricorn
  4: [1, 10],  // Chaturthi: Taurus, Aquarius
  5: [2, 5],   // Panchami: Gemini, Virgo
  6: [0, 4],   // Shashthi: Aries, Leo
  7: [3, 8],   // Saptami: Cancer, Sagittarius
  8: [2, 5],   // Ashtami: Gemini, Virgo
  9: [4, 7],   // Navami: Leo, Scorpio
  10: [4, 7],  // Dashami: Leo, Scorpio
  11: [8, 11], // Ekadashi: Sagittarius, Pisces
  12: [6, 9],  // Dwadashi: Libra, Capricorn
  13: [1, 4],  // Trayodashi: Taurus, Leo
  14: [2, 5],  // Chaturdashi: Gemini, Virgo
};

/**
 * C.S. Patel's Ashtakavarga Kakshya Order (8 sub-divisions of 3°45' per 30° sign)
 */
const KAKSHYA_LORDS = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Lagna"];

/**
 * Pandit Hira Lal Dikshit's Nakshatra Liquidity Rules (Page 199):
 * 8 Selling Nakshatras (Institutional Distribution / Sell Rallies):
 *   Bharani(1), Krittika(2), Ashlesha(8), Purva Phalguni(10), Vishakha(15), Jyeshtha(17), Purva Ashadha(19), Purva Bhadrapada(24)
 * 6 Buying Nakshatras (Institutional Accumulation / Buy Dips):
 *   Ashwini(0), Chitra(13), Swati(14), Shravana(21), Shatabhisha(23), Revati(26)
 */
export const SELLING_NAKSHATRAS = new Set<number>([1, 2, 8, 10, 15, 17, 19, 24]);
export const BUYING_NAKSHATRAS = new Set<number>([0, 13, 14, 21, 23, 26]);

export type NakshatraAction = "SELL_RALLY" | "BUY_DIP" | "NEUTRAL_EXPANSION";

export interface IntradayHourSlice {
  hourUtc: number;           // 0..23
  timeUtcLabel: string;      // "08:00 - 09:00 UTC"
  sessionName: "Tokyo / Asian" | "London Open & Core" | "London / NY Overlap" | "NY Afternoon / Close";
  horaLord: string;
  moonKakshyaLord: string;
  hourlyBias: number;        // -1.0 to +1.0
  hourlyAction: "BUY_DIP" | "SELL_RALLY" | "NEUTRAL";
  isPrimaryLordHora: boolean;
  isOpposingLordHora: boolean;
  shastricReason: string;
  isChopTrap?: boolean;
  chopSeverity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  chopReason?: string;
}

export interface ChopPillarDetail {
  id: string;
  name: string;
  sanskritName: string;
  isActive: boolean;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  scoreContribution: number;
  description: string;
  tradingImpact: string;
}

export interface ChopRadarAssessment {
  chopScore: number; // 0 - 100%
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  circuitBreakerActive: boolean;
  marketRegime: "CLEAN_TREND" | "STRUCTURED_RANGE" | "CHOPPY_WHIPSAW" | "CRITICAL_VOID";
  regimeTitle: string;
  regimeGuidance: string;
  recommendedLotScale: number; // 1.0, 0.5, 0.25, or 0.0
  pillars: ChopPillarDetail[];
  activeWarnings: string[];
  gandantaDetails: {
    isGandanta: boolean;
    isWaterFireJunction: boolean;
    junctionName?: string;
    degreesFromNode?: number;
  };
  riktaTithiDetails: {
    isRikta: boolean;
    tithiName: string;
    lunarDay: number;
    paksha: "Shukla" | "Krishna";
  };
}

export interface MasterExecutionMatrix {
  marketCondition: "TRENDING_EXPANSION" | "SIDEWAYS_RANGE" | "CHOPPY_WHIPSAW" | "CRITICAL_VOID";
  conditionLabel: string;
  conditionDetail: string;
  conditionColor: "emerald" | "amber" | "rose";
  tradePermittedVerdict: "TRADE_APPROVED" | "CAUTION_REDUCED_SIZE" | "DO_NOT_TRADE";
  verdictBadge: string;
  verdictColor: "emerald" | "amber" | "rose";
  verdictDetail: string;
  recommendedTimeframe: "M5_M15" | "M15_H1" | "H1_H4" | "H4_D1_ONLY";
  timeframeLabel: string;
  timeframeDetail: string;
  slProfile: "TIGHT_STRUCTURAL" | "STANDARD_ATR" | "WIDE_BUFFER";
  slLabel: string;
  slDetail: string;
  tpExpectancy: "QUICK_SCALP_1_2" | "STANDARD_SWING_1_3" | "FULL_EXPANSION_1_5_PLUS" | "ZERO_TARGET";
  tpLabel: string;
  tpDetail: string;
}

export interface AstroMarketSignal {
  symbol: MarketSymbol;
  timestampIso: string;
  signals: {
    directionalBias: number;         // -1.0 (Strong Bearish) to +1.0 (Strong Bullish)
    volatilityMultiplier: number;    // 0.5 to 2.5 ATR scaling
    confluencePoints: number;        // -25 to +25 points to inject into MT5 Confluence Engine
    marketRegime: "EXPANSION_BULLISH" | "EXPANSION_BEARISH" | "HIGH_VOL_CHOP" | "STABLE_TREND" | "CONSOLIDATION";
    confidenceScore: number;         // 0 to 100%
  };
  chopRadar: ChopRadarAssessment;
  masterExecutionMatrix: MasterExecutionMatrix;
  intradayTimeline: IntradayHourSlice[];
  dikshitLiquidityCycle: {
    moonNakshatraIndex: number;
    moonNakshatraName: string;
    action: NakshatraAction;
    ruleDescription: string;
    dayOfWeek: string;
    weeklySessionRegime: string;
    isPanchaka5xActive: boolean;
    intradayLunarConjunctions: string[];
    solarChestabalaStations: string[];
    panchakaTiming?: {
      isActive: boolean;
      activeWindow: string;
      endsWhen: string;
      tradingImpact: string;
    };
    isEmpiricalOverridden?: boolean;
  };
  varahamihiraScarcity: {
    primarySignIndex: number;
    primarySignName: string;
    maleficsInAfflictingHouses: string[];
    beneficsInSupportingHouses: string[];
    scarcityInflationScore: number;  // Positive = Supply shock (Bullish price spike)
    activeGrahaYuddha: string[];     // Brihat Samhita Ch. 17 Planetary Wars (<1° orb)
  };
  narapatiSwarodaya: {
    rahuKalanalaHemisphere: "JIVA_PAKSHA_BULLISH" | "MRITA_PAKSHA_BEARISH";
    sunMoonNodalRegime: string;
    primaryLordVedhaMultiplier: number; // 3x Exalted, 2x Retrograde, 0x Debilitated, 1x Normal
    activeSolarUpagrahaShocks: string[];
    upagrahaShockDetails?: Array<{
      title: string;
      rulingPlanet: string;
      whenDoesItStrike: string;
      tradingAdvice: string;
    }>;
  };
  advancedTransitConfluence: {
    moonKakshyaLord: string;         // C.S. Patel 3°45' Kakshya sub-lord of Moon
    primaryLordKakshyaLord: string;  // C.S. Patel 3°45' Kakshya sub-lord of Asset Lord
    yogiNakshatraName: string;
    yogiLord: string;
    avayogiNakshatraName: string;
    avayogiLord: string;
    isYogiTailwindActive: boolean;
    isAvayogiHeadwindActive: boolean;
    dagdhaRashiAlert: string | null;
    dualSign15DegZone: string | null;
    macroAlerts: string[];           // Rohini Shakata Bhedana, Kharmas, Angarak/Guru-Chandal
  };
  activeHora: {
    horaLord: string;
    horaBeneficialForAsset: boolean;
    horaMultiplier: number;
  };
  lunarPhase: {
    paksha: "Shukla" | "Krishna";
    tithiName: string;
    tithiIndex: number;
    isPurnimaAmavasyaClimax: boolean;
  };
  quantAdvice: {
    allowLongs: boolean;
    allowShorts: boolean;
    suggestedAtrSlMultiplier: number;
    lotSizeScale: number;
  };
}

/**
 * Calculates the Chaldean Planetary Hora for any UTC moment.
 * Order: Saturn -> Jupiter -> Mars -> Sun -> Venus -> Mercury -> Moon
 */
const HORA_ORDER = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];
const DAY_FIRST_HORA: Record<number, string> = {
  0: "Sun",      // Sunday
  1: "Moon",     // Monday
  2: "Mars",     // Tuesday
  3: "Mercury",  // Wednesday
  4: "Jupiter",  // Thursday
  5: "Venus",    // Friday
  6: "Saturn",   // Saturday
};

export function getPlanetaryHora(date: Date): string {
  const dayOfWeek = date.getUTCDay();
  const firstHora = DAY_FIRST_HORA[dayOfWeek];
  const startIndex = HORA_ORDER.indexOf(firstHora);
  const hour = date.getUTCHours();
  const horaIndex = (startIndex + hour) % 7;
  return HORA_ORDER[horaIndex];
}

/**
 * C.S. Patel Ashtakavarga Kakshya Calculator (8 subdivisions of 3°45' = 3.75° per sign)
 */
export function getKakshyaLord(degreeInRashi: number): string {
  const idx = Math.min(7, Math.max(0, Math.floor(degreeInRashi / 3.75)));
  return KAKSHYA_LORDS[idx];
}

/**
 * Shortest angular distance on the 360° zodiac circle
 */
function angularDistance(lon1: number, lon2: number): number {
  const diff = Math.abs(lon1 - lon2) % 360;
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Calculates the exact 24-hour hour-by-hour intraday timing breakdown for a trading day.
 * Combines:
 * 1. The day's macro celestial momentum (65% baseline)
 * 2. Hourly Chaldean/Vedic Planetary Horas (Sun/Jup/Mars/Sat hours)
 * 3. C.S. Patel's 3°45' Kakshya Sub-Lord shifts as the Moon transits across the day
 * 4. Classical Global Session Windows (Tokyo, London Open, London/NY Overlap, NY Close)
 */
export function calculateIntradayTimeline(
  symbol: MarketSymbol,
  baseDate: Date,
  dailyBias: number,
  options?: {
    isPanchakaActive?: boolean;
    isGandantaActive?: boolean;
    isRiktaTithi?: boolean;
  }
): IntradayHourSlice[] {
  const asset = ASSET_SIGNIFICATIONS[symbol] || ASSET_SIGNIFICATIONS.XAUUSD;
  const year = baseDate.getUTCFullYear();
  const month = baseDate.getUTCMonth();
  const day = baseDate.getUTCDate();

  const slices: IntradayHourSlice[] = [];

  for (let h = 0; h < 24; h++) {
    const hourDate = new Date(Date.UTC(year, month, day, h, 30, 0));
    const horaLord = getPlanetaryHora(hourDate);

    // Compute ephemeris for that hour to get Moon's exact longitude & Kakshya sub-lord
    const hourEphem = calculateVedicEphemeris(hourDate, {
      latitude: 51.5074,
      longitude: 0.1278,
      cityName: "London GMT",
      timezoneOffsetHours: 0,
    });

    const moonDegInSign = hourEphem.planets.Moon ? hourEphem.planets.Moon.rashi.degreesInSign : 0;
    const moonKakshyaLord = getKakshyaLord(moonDegInSign);

    const isPrimaryLordHora = horaLord === asset.primaryLord;
    const isSecondaryLordHora = horaLord === asset.secondaryLord;
    const isOpposingLordHora = horaLord === asset.opposingLord;

    // Hourly bias modifier: 65% macro daily trend + 35% intraday Hora & Kakshya alignment
    let hBias = dailyBias * 0.65;
    let shastricReason = "";

    if (isPrimaryLordHora) {
      hBias += 0.28;
      shastricReason = `${horaLord} Hora (Primary Ruler): Maximum institutional liquidity & directional thrust.`;
    } else if (isSecondaryLordHora) {
      hBias += 0.18;
      shastricReason = `${horaLord} Hora (Secondary Ruler): Steady expansion & trend continuation.`;
    } else if (isOpposingLordHora) {
      hBias -= 0.28;
      shastricReason = `${horaLord} Hora (Opposing Ruler): Heavy counter-trend pressure & profit-taking sweeps.`;
    } else {
      shastricReason = `${horaLord} Hora: Standard background liquidity.`;
    }

    if (moonKakshyaLord === asset.primaryLord || moonKakshyaLord === asset.secondaryLord) {
      hBias += 0.10;
      shastricReason += ` Moon in ${moonKakshyaLord} Kakshya (supportive).`;
    } else if (moonKakshyaLord === asset.opposingLord) {
      hBias -= 0.10;
      shastricReason += ` Moon in ${moonKakshyaLord} Kakshya (resistance).`;
    }

    const hourlyBias = Number(Math.max(-1.0, Math.min(1.0, hBias)).toFixed(2));

    let hourlyAction: "BUY_DIP" | "SELL_RALLY" | "NEUTRAL" = "NEUTRAL";
    if (hourlyBias >= 0.25) hourlyAction = "BUY_DIP";
    else if (hourlyBias <= -0.25) hourlyAction = "SELL_RALLY";

    // Session classification
    let sessionName: IntradayHourSlice["sessionName"] = "Tokyo / Asian";
    if (h >= 7 && h <= 11) sessionName = "London Open & Core";
    else if (h >= 12 && h <= 16) sessionName = "London / NY Overlap";
    else if (h >= 17) sessionName = "NY Afternoon / Close";

    // Compute hour-specific chop risk
    let hourlyChopScore = 0;
    const hourlyChopReasons: string[] = [];

    if (horaLord === "Mercury") {
      hourlyChopScore += 35;
      hourlyChopReasons.push("Mercury Hora (-126.5 pts Alpha Drag)");
    }

    if (options?.isPanchakaActive) {
      hourlyChopScore += 25;
      hourlyChopReasons.push("Panchaka 5x Turbulence");
    }

    if (options?.isGandantaActive) {
      hourlyChopScore += 45;
      hourlyChopReasons.push("Moon in Gandanta / Sandhi");
    }

    if (options?.isRiktaTithi) {
      hourlyChopScore += 15;
      hourlyChopReasons.push("Rikta Tithi (Void Day)");
    }

    const isChopTrap = hourlyChopScore >= 35;
    const chopSeverity: IntradayHourSlice["chopSeverity"] =
      hourlyChopScore >= 60 ? "HIGH" : hourlyChopScore >= 35 ? "MEDIUM" : "LOW";
    const chopReason = hourlyChopReasons.length > 0 ? hourlyChopReasons.join(" • ") : undefined;

    const startH = h.toString().padStart(2, "0");
    const endH = ((h + 1) % 24).toString().padStart(2, "0");

    slices.push({
      hourUtc: h,
      timeUtcLabel: `${startH}:00 - ${endH}:00 UTC`,
      sessionName,
      horaLord,
      moonKakshyaLord,
      hourlyBias,
      hourlyAction,
      isPrimaryLordHora,
      isOpposingLordHora,
      shastricReason,
      isChopTrap,
      chopSeverity,
      chopReason,
    });
  }

  return slices;
}

/**
 * Computes the complete multi-layered Astro Market Signal v2.0 for any symbol and date.
 */
export function calculateAstroMarketSignal(
  symbol: MarketSymbol,
  date: Date = new Date()
): AstroMarketSignal {
  const asset = ASSET_SIGNIFICATIONS[symbol] || ASSET_SIGNIFICATIONS.XAUUSD;

  // 1. Calculate Ephemeris for date
  const ephemeris = calculateVedicEphemeris(date, {
    latitude: 51.5074, // London Greenwich benchmark for UTC/Forex
    longitude: 0.1278,
    cityName: "London GMT",
    timezoneOffsetHours: 0,
  });

  const planets = ephemeris.planets;
  const primaryRashi = asset.rulingRashis[0];

  const getHouseFromRashi = (planetRashiIndex: number, targetRashiIndex: number) => {
    return ((planetRashiIndex - targetRashiIndex + 12) % 12) + 1;
  };

  // ============================================================================
  // 2. Varahamihira Dravya Nishchaya (Ch. 41), Argha Kanda (Ch. 42) & Graha Yuddha (Ch. 17)
  // ============================================================================
  const maleficsInAfflictingHouses: string[] = [];
  const beneficsInSupportingHouses: string[] = [];
  let scarcityScore = 0.0;

  // Malefics: Saturn, Mars, Sun, Rahu
  // In 1, 2, 4, 5, 7, 8, 9, 12 from asset Rashi -> causes Mahargha (Scarcity / Bullish Price Spike, Ch. 41 Sloka 11)
  const maleficNames = ["Saturn", "Mars", "Sun", "Rahu"];
  const afflictingHouses = [1, 2, 4, 5, 7, 8, 9, 12];

  for (const mName of maleficNames) {
    const p = planets[mName];
    if (!p) continue;
    const h = getHouseFromRashi(p.rashi.index, primaryRashi);
    if (afflictingHouses.includes(h)) {
      maleficsInAfflictingHouses.push(`${mName} in H${h}`);
      scarcityScore += 0.22;
    } else {
      scarcityScore -= 0.08; // Upachaya (3, 6, 10, 11) stabilizes supply (Sloka 10)
    }
  }

  // Benefics: Jupiter, Venus, Mercury (Ch. 41 Slokas 9-10)
  const beneficNames = ["Jupiter", "Venus", "Mercury"];
  const supportingHouses = [2, 4, 5, 7, 9, 10, 11];

  for (const bName of beneficNames) {
    const p = planets[bName];
    if (!p) continue;
    const h = getHouseFromRashi(p.rashi.index, primaryRashi);
    if (supportingHouses.includes(h)) {
      beneficsInSupportingHouses.push(`${bName} in H${h}`);
      scarcityScore += 0.14;
    }
    // Venus in 6th or 7th house from a Rasi destroys its objects (Brihat Samhita 41.10)
    if (bName === "Venus" && (h === 6 || h === 7)) {
      scarcityScore -= 0.30;
    }
  }

  // Brihat Samhita Ch. 17: Graha Yuddha (Planetary Conflict < 1.0° orb among Tara Grahas)
  const taraGrahas = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const activeGrahaYuddha: string[] = [];
  for (let i = 0; i < taraGrahas.length; i++) {
    for (let j = i + 1; j < taraGrahas.length; j++) {
      const p1 = planets[taraGrahas[i]];
      const p2 = planets[taraGrahas[j]];
      if (!p1 || !p2) continue;
      const dist = angularDistance(p1.siderealLongitude, p2.siderealLongitude);
      if (dist <= 1.0) {
        activeGrahaYuddha.push(
          `${taraGrahas[i]}-${taraGrahas[j]} Graha Yuddha (${dist.toFixed(2)}° orb)`
        );
      }
    }
  }

  // ============================================================================
  // 3. Narapati Jaicharya Swarodaya (Pages 58-92):
  //    - Panchanga Rahu Chakra (Jiva Paksha vs. Mrita Paksha 14-Nakshatra Split)
  //    - Sloka 38 Quantitative Vedha Multipliers (3x Exalted, 2x Retrograde, 0x Debilitated)
  //    - Slokas 59-61: 8 Solar Upagraha Mathematical Shock Points
  // ============================================================================
  const moonNak = ephemeris.panchanga.nakshatra.index;
  const sunNak = planets.Sun ? planets.Sun.nakshatra.index : 0;
  const rahuNak = planets.Rahu ? planets.Rahu.nakshatra.index : 0;

  // Rahu moves retrograde. The 13 Nakshatras ahead of Rahu in retrograde motion
  // ((rahuNak - k + 27) % 27 for k = 1..13) are the traversed Jiva Paksha (Living/Bullish Half).
  const retroDistMoonFromRahu = (rahuNak - moonNak + 27) % 27;
  const retroDistSunFromRahu = (rahuNak - sunNak + 27) % 27;
  const isMoonInJivaPaksha = retroDistMoonFromRahu >= 1 && retroDistMoonFromRahu <= 13;
  const isSunInJivaPaksha = retroDistSunFromRahu >= 1 && retroDistSunFromRahu <= 13;

  const rahuKalanalaHemisphere = isMoonInJivaPaksha
    ? "JIVA_PAKSHA_BULLISH"
    : "MRITA_PAKSHA_BEARISH";

  let sunMoonNodalRegime = "";
  let rahuPakshaBias = 0.0;
  if (isMoonInJivaPaksha && isSunInJivaPaksha) {
    sunMoonNodalRegime = "Both Sun & Moon in Jiva Paksha (Narapati Sloka 19: Kshema-Jaya-Labha / Strong Expansion)";
    rahuPakshaBias = 0.22;
  } else if (isMoonInJivaPaksha && !isSunInJivaPaksha) {
    sunMoonNodalRegime = "Moon in Jiva Paksha & Sun in Mrita Paksha (Narapati Sloka 18: Shubha Yatra / Bullish Accumulation)";
    rahuPakshaBias = 0.15;
  } else if (!isMoonInJivaPaksha && isSunInJivaPaksha) {
    sunMoonNodalRegime = "Moon in Mrita Paksha & Sun in Jiva Paksha (Narapati Sloka 18: Viparita Hani / Liquidity Drain)";
    rahuPakshaBias = -0.15;
  } else {
    sunMoonNodalRegime = "Both Sun & Moon in Mrita Paksha (Narapati Sloka 20: Hani-Bhaya-Bhanga / Defensive Risk-Off)";
    rahuPakshaBias = -0.22;
  }

  // Narapati Page 59 Sloka 38 Vedha Strength Multiplier on Asset's Primary Lord
  const pLord = planets[asset.primaryLord];
  let primaryLordVedhaMultiplier = 1.0;
  if (pLord) {
    if (DEBILITATION_RASHI[asset.primaryLord] === pLord.rashi.index) {
      primaryLordVedhaMultiplier = 0.0; // "नीचस्थो निष्फलो ग्रहः" (Debilitated = Nullified)
    } else {
      if (EXALTATION_RASHI[asset.primaryLord] === pLord.rashi.index) {
        primaryLordVedhaMultiplier = 3.0; // "त्रिगुणं स्वोच्चसंस्थिते" (Exalted = 3x)
      }
      if (pLord.isRetrograde) {
        primaryLordVedhaMultiplier = Math.max(2.0, primaryLordVedhaMultiplier * 2.0); // "वक्रग्रहे फलं द्विगुणम्" (Retrograde = 2x)
      }
    }
  }

  // Narapati Page 62 Slokas 59-61: 8 Upagraha Vedhas counted from Sun's Nakshatra
  const upagrahaOffsets: Array<{ offset: number; name: string; nature: string }> = [
    { offset: 4, name: "Vidyutmukha (5th from Sun)", nature: "Sun / Flash Volatility" },
    { offset: 7, name: "Shula (8th from Sun)", nature: "Moon / Sharp Spike" },
    { offset: 13, name: "Sannipata (14th from Sun)", nature: "Mars / Aggressive Stop-Hunt" },
    { offset: 17, name: "Ketu-Upagraha (18th from Sun)", nature: "Mercury / Whipsaw" },
    { offset: 20, name: "Ulka (21st from Sun)", nature: "Jupiter / Macro Shock" },
    { offset: 21, name: "Kampa (22nd from Sun)", nature: "Saturn / Supply Freeze" },
    { offset: 22, name: "Vajraka (23rd from Sun)", nature: "Venus / Liquidity Sweep" },
    { offset: 23, name: "Nirghata (24th from Sun)", nature: "Rahu / Extreme Breakout" },
  ];
  const activeSolarUpagrahaShocks: string[] = [];
  for (const upa of upagrahaOffsets) {
    const upaNak = (sunNak + upa.offset) % 27;
    if (upaNak === moonNak || asset.keyNakshatras.includes(upaNak)) {
      activeSolarUpagrahaShocks.push(`${upa.name} on ${NAKSHATRA_NAMES[upaNak]} (${upa.nature})`);
    }
  }

  // ============================================================================
  // 4. Pandit Hira Lal Dikshit Liquidity Cycle, Panchaka 5x, Chestabala & Intraday Yutis
  // ============================================================================
  let nakshatraAction: NakshatraAction = "NEUTRAL_EXPANSION";
  let ruleDesc = "Moon is in a neutral expansion star. Standard order flow applies.";
  let isEmpiricalOverridden = false;

  const currentNakName = NAKSHATRA_NAMES[moonNak];
  const empiricalEdge = EMPIRICAL_GOLD_EDGES[currentNakName];

  if (SELLING_NAKSHATRAS.has(moonNak)) {
    nakshatraAction = "SELL_RALLY";
    ruleDesc = `Moon in ${ephemeris.panchanga.nakshatra.sanskritName} (Dikshit 8 Selling Stars). Bullish rallies exhaust quickly; favor shorting resistances and taking profit.`;
  } else if (BUYING_NAKSHATRAS.has(moonNak)) {
    nakshatraAction = "BUY_DIP";
    ruleDesc = `Moon in ${ephemeris.panchanga.nakshatra.sanskritName} (Dikshit 6 Buying Stars). Institutional accumulation at bottoms; favor buying pullbacks at key support.`;
  }

  // Harmonize Classical vs. Modern MT5 6-Month Backtest Conflict
  if (empiricalEdge && empiricalEdge.bias === "BEARISH" && nakshatraAction === "BUY_DIP") {
    nakshatraAction = "SELL_RALLY";
    isEmpiricalOverridden = true;
    ruleDesc = `Moon in ${ephemeris.panchanga.nakshatra.sanskritName}. ⚠️ OVERRULED BY MT5 DATA: While classical texts classify as Buy-Dip, empirical 6-month MT5 backtest shows ${empiricalEdge.winRatePct}% Bearish Breakdown (${empiricalEdge.historicalNetPts} pts). EA Directive: SHORT RALLIES.`;
  }

  // Dikshit Page 198: Panchaka 5x Rule (Moon in Aquarius or Pisces, ~300° to 360°)
  const moonLon = planets.Moon ? planets.Moon.siderealLongitude : 0;
  const isPanchaka5xActive = moonLon >= 300.0 && moonLon < 360.0;

  const degreesRemainingInPanchaka = isPanchaka5xActive ? 360.0 - moonLon : 0;
  const hoursRemainingInPanchaka = (degreesRemainingInPanchaka / 0.55).toFixed(0);

  const panchakaTiming = {
    isActive: isPanchaka5xActive,
    activeWindow: isPanchaka5xActive
      ? `Active All Day (24h continuous) • Moon at ${(moonLon % 30).toFixed(1)}° in ${RASHI_NAMES[Math.floor(moonLon / 30)]} (${currentNakName})`
      : "Inactive (Moon outside 300°-360° Aquarius/Pisces)",
    endsWhen: isPanchaka5xActive
      ? `Ends when Moon crosses into Aries (~${hoursRemainingInPanchaka} hours remaining)`
      : "Normal market flow",
    tradingImpact: isPanchaka5xActive
      ? "Causes repeating 5-fold whipsaws & false breakout traps. Scalp support/resistance; avoid chasing trends."
      : "Standard trend structures intact.",
  };

  const upagrahaShockDetails = activeSolarUpagrahaShocks.map((shockStr) => {
    let rulingPlanet = "Jupiter";
    if (shockStr.startsWith("Vidyutmukha")) rulingPlanet = "Sun";
    else if (shockStr.startsWith("Shula")) rulingPlanet = "Moon";
    else if (shockStr.startsWith("Sannipata")) rulingPlanet = "Mars";
    else if (shockStr.startsWith("Ketu-Upagraha") || shockStr.startsWith("Upaketu")) rulingPlanet = "Mercury";
    else if (shockStr.startsWith("Ulka")) rulingPlanet = "Jupiter";
    else if (shockStr.startsWith("Kampa")) rulingPlanet = "Saturn";
    else if (shockStr.startsWith("Vajraka") || shockStr.startsWith("Indrachapa")) rulingPlanet = "Venus";
    else if (shockStr.startsWith("Nirghata") || shockStr.startsWith("Vyatipata")) rulingPlanet = "Rahu";

    return {
      title: shockStr,
      rulingPlanet,
      whenDoesItStrike: `Active during ${rulingPlanet} Horas & NY Overlap (16:00 - 18:00 Rome)`,
      tradingAdvice: "Expect sharp liquidity wicks & stop-loss sweeps. Widen stops by 1.5x.",
    };
  });

  // Dikshit Intraday Lunar Conjunctions (Chandra Yuti within 6.5° orb, Pages 44-164)
  const intradayLunarConjunctions: string[] = [];
  for (const [pName, pData] of Object.entries(planets)) {
    if (pName === "Moon" || !pData) continue;
    const dist = angularDistance(moonLon, pData.siderealLongitude);
    if (dist <= 6.5) {
      if (pName === "Sun") {
        intradayLunarConjunctions.push(`Moon-Sun Yuti (${dist.toFixed(1)}°): 24h Bullish Impulse (Dikshit p.79)`);
      } else if (pName === "Saturn") {
        intradayLunarConjunctions.push(`Moon-Saturn Yuti (${dist.toFixed(1)}°): Crude Oil / Black Commodities Spike (Dikshit p.44)`);
      } else if (pName === "Ketu" || pName === "Rahu") {
        intradayLunarConjunctions.push(`Moon-${pName} Yuti (${dist.toFixed(1)}°): Two-Way Whipsaw / Spike & Dump (Dikshit p.79)`);
      } else if (pName === "Mars") {
        intradayLunarConjunctions.push(`Moon-Mars Yuti (${dist.toFixed(1)}°): Gold, Copper & Red Commodities Surge (Dikshit p.171)`);
      } else if (pName === "Uranus") {
        intradayLunarConjunctions.push(`Moon-Harshal/Uranus Yuti (${dist.toFixed(1)}°): Two-Way Flash Whipsaw (Dikshit p.25)`);
      } else {
        intradayLunarConjunctions.push(`Moon-${pName} Yuti (${dist.toFixed(1)}°): Intraday Liquidity Inflection`);
      }
    }
  }

  // Solar Chestabala Retrogression Zone (6th, 7th, 8th from Sun - Session 52 & Dikshit Pages 16-26)
  const solarChestabalaStations: string[] = [];
  const sunRashi = planets.Sun ? planets.Sun.rashi.index : 0;
  for (const heavyPlanet of ["Mars", "Jupiter", "Saturn", "Uranus", "Neptune"]) {
    const hp = planets[heavyPlanet];
    if (!hp) continue;
    const houseFromSun = getHouseFromRashi(hp.rashi.index, sunRashi);
    if ([6, 7, 8].includes(houseFromSun) || hp.isRetrograde) {
      solarChestabalaStations.push(
        `${heavyPlanet} in H${houseFromSun} from Sun (${hp.isRetrograde ? "Vakri/Retrograde" : "Direct"}) — High Chestabala One-Way Trend Zone`
      );
    }
  }

  // Day-of-Week Liquidity Regime (Dikshit Pages 206-207)
  const day = date.getUTCDay();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayNames[day];
  let weeklyRegime = "Standard intraday flow";

  if (day === 1) {
    weeklyRegime = "Monday: High probability of printing the High or Low of the Week. Initial breakouts usually run until Tuesday 12:00 PM.";
  } else if (day === 2) {
    weeklyRegime = "Tuesday: Continuation of Monday trend until midday. Watch for climax pivots around 12:00 PM.";
  } else if (day === 3) {
    weeklyRegime = "Wednesday: Trend expansion / reversal day. Tuesday rallies often reverse to sell-offs after 12:00 PM.";
  } else if (day === 4) {
    weeklyRegime = "Thursday: High-momentum expansion day. Double-dump from Mon/Tue often squeezes explosively into Thursday.";
  } else if (day === 5) {
    weeklyRegime = "Friday: High probability of printing the High or Low of the Week. Expect sharp afternoon profit-taking sweeps.";
  }

  // ============================================================================
  // 5. Advanced Transit Confluence (C.S. Patel Kakshya, Yogi/Avayogi, Dagdha Rashi, Dual 15°)
  // ============================================================================
  const moonKakshyaLord = planets.Moon ? getKakshyaLord(planets.Moon.rashi.degreesInSign) : "Moon";
  const primaryLordKakshyaLord = pLord ? getKakshyaLord(pLord.rashi.degreesInSign) : asset.primaryLord;

  // Daily Yogi & Avayogi Point (Session 96: Yogi = Sun + Moon + 93°20')
  const sunLon = planets.Sun ? planets.Sun.siderealLongitude : 0;
  const yogiLon = (sunLon + moonLon + 93.3333333333) % 360;
  const yogiNakIdx = Math.floor(yogiLon / (360 / 27)) % 27;
  const yogiNakshatraName = NAKSHATRA_NAMES[yogiNakIdx];
  const yogiLord = NAKSHATRA_LORDS[yogiNakIdx % 9];

  // Avayogi is 186°40' (14 Nakshatras) ahead of Yogi
  const avayogiLon = (yogiLon + 186.6666666667) % 360;
  const avayogiNakIdx = Math.floor(avayogiLon / (360 / 27)) % 27;
  const avayogiNakshatraName = NAKSHATRA_NAMES[avayogiNakIdx];
  const avayogiLord = NAKSHATRA_LORDS[avayogiNakIdx % 9];

  const isYogiTailwindActive =
    moonNak === yogiNakIdx ||
    yogiLord === asset.primaryLord ||
    yogiLord === asset.secondaryLord;
  const isAvayogiHeadwindActive =
    moonNak === avayogiNakIdx ||
    avayogiLord === asset.primaryLord;

  // Tithi Dagdha Rashi (Burnt Sign) Check (Session 49)
  const tithiIdx = ephemeris.panchanga.tithi.index;
  const tithiMod15 = ((tithiIdx - 1) % 15) + 1;
  const burntPair = TITHI_DAGDHA_RASHIS[tithiMod15];
  let dagdhaRashiAlert: string | null = null;
  if (burntPair && pLord) {
    if (burntPair.includes(pLord.rashi.index) && !pLord.isRetrograde) {
      dagdhaRashiAlert = `${asset.primaryLord} is in Tithi Dagdha Rashi (${RASHI_NAMES[pLord.rashi.index]}) — High risk of false breakouts / liquidity traps`;
    } else if (burntPair.includes(pLord.rashi.index) && pLord.isRetrograde) {
      dagdhaRashiAlert = `${asset.primaryLord} is Retrograde in Dagdha Rashi (${RASHI_NAMES[pLord.rashi.index]}) — Reversal immunity active`;
    }
  }

  // Dual Sign 15° Bifurcation (Gemini=2, Virgo=5, Sagittarius=8, Pisces=11 — Session 92)
  let dualSign15DegZone: string | null = null;
  if (pLord && [2, 5, 8, 11].includes(pLord.rashi.index)) {
    dualSign15DegZone =
      pLord.rashi.degreesInSign < 15.0
        ? `${asset.primaryLord} in ${RASHI_NAMES[pLord.rashi.index]} 0°-15° (Sthira/Fixed Half — Range-Bound Accumulation)`
        : `${asset.primaryLord} in ${RASHI_NAMES[pLord.rashi.index]} 15°-30° (Chara/Movable Half — Trend Breakout Zone)`;
  }

  // Macro Alerts (Rohini Shakata Bhedana, Kharmas, Rahu-Mars Angarak Yoga)
  const macroAlerts: string[] = [];
  if (planets.Rahu && planets.Rahu.nakshatra.index === 3) {
    macroAlerts.push("ROHINI SHAKATA BHEDANA: Rahu in Rohini — Macro Banking & Supply-Chain Crisis Regime");
  }
  if (planets.Saturn && planets.Saturn.nakshatra.index === 3) {
    macroAlerts.push("ROHINI SHAKATA BHEDANA: Saturn in Rohini — Severe Sovereign Liquidity Contraction");
  }
  if (sunRashi === 8 || sunRashi === 11) {
    macroAlerts.push(`KHARMAS ACTIVE (Sun in ${RASHI_NAMES[sunRashi]}): Institutional Liquidity Slowdown / Mean-Reversion Favored`);
  }
  if (planets.Rahu && planets.Mars && planets.Rahu.rashi.index === planets.Mars.rashi.index) {
    macroAlerts.push(`ANGARAK YOGA (Rahu-Mars in ${RASHI_NAMES[planets.Rahu.rashi.index]}): High-Voltage Speculative Stop-Hunts`);
  }

  // ============================================================================
  // 6. Active Planetary Hora & Lunar Phase
  // ============================================================================
  const activeHoraLord = getPlanetaryHora(date);
  const isHoraBeneficial =
    activeHoraLord === asset.primaryLord ||
    activeHoraLord === asset.secondaryLord;
  const isHoraAdverse = activeHoraLord === asset.opposingLord;

  let horaMultiplier = 1.0;
  if (isHoraBeneficial) horaMultiplier = 1.25;
  if (isHoraAdverse) horaMultiplier = 0.80;

  const isPurnimaAmavasya = tithiIdx === 14 || tithiIdx === 15 || tithiIdx === 29 || tithiIdx === 30;

  // ============================================================================
  // 7. Composite Quant Directional Bias (-1.0 to +1.0) & Volatility Scaling
  // ============================================================================
  let rawBias = scarcityScore + rahuPakshaBias;
  if (nakshatraAction === "BUY_DIP") rawBias += 0.18;
  if (nakshatraAction === "SELL_RALLY") rawBias -= 0.18;
  if (isHoraBeneficial) rawBias += 0.12;
  if (isHoraAdverse) rawBias -= 0.12;
  if (isYogiTailwindActive) rawBias += 0.12;
  if (isAvayogiHeadwindActive) rawBias -= 0.12;

  // C.S. Patel Kakshya sub-lord alignment bonus
  if (moonKakshyaLord === asset.primaryLord || moonKakshyaLord === asset.secondaryLord) {
    rawBias += 0.10;
  } else if (moonKakshyaLord === asset.opposingLord) {
    rawBias -= 0.10;
  }

  // Apply Narapati Sloka 38 Dignity/Motion Scaling on Primary Lord
  if (primaryLordVedhaMultiplier === 0.0) {
    rawBias *= 0.65; // Debilitated primary lord dampens trend conviction
  } else if (primaryLordVedhaMultiplier >= 2.0) {
    rawBias *= 1.15; // Exalted (3x) or Retrograde (2x) amplifies directional impulse
  }

  // Dagdha Rashi dampener (if not retrograde)
  if (dagdhaRashiAlert && pLord && !pLord.isRetrograde) {
    rawBias *= 0.75;
  }

  const directionalBias = Number(Math.max(-1.0, Math.min(1.0, rawBias)).toFixed(2));

  // Volatility Multiplier (1.0 = normal, >1.3 = event risk expansion)
  let volMult = 1.0;
  if (isPurnimaAmavasya) volMult += 0.35;
  if (isPanchaka5xActive) volMult += 0.30; // Dikshit Panchaka 5x expansion
  if (maleficsInAfflictingHouses.length >= 3) volMult += 0.25;
  if (activeGrahaYuddha.length > 0) volMult += 0.35; // Brihat Samhita Ch. 17 Planetary War
  if (activeSolarUpagrahaShocks.length > 0) volMult += 0.15;
  if (pLord && pLord.isRetrograde) volMult += 0.20;
  const volatilityMultiplier = Number(Math.min(2.5, volMult).toFixed(2));

  // Confluence Points (-25 to +25 for MT5 Confluence Engine)
  const confluencePoints = Math.round(directionalBias * 25);

  // Regime determination
  let marketRegime: AstroMarketSignal["signals"]["marketRegime"] = "STABLE_TREND";
  if (volatilityMultiplier >= 1.4) {
    marketRegime =
      directionalBias > 0.3
        ? "EXPANSION_BULLISH"
        : directionalBias < -0.3
        ? "EXPANSION_BEARISH"
        : "HIGH_VOL_CHOP";
  } else if (Math.abs(directionalBias) < 0.2) {
    marketRegime = "CONSOLIDATION";
  }

  // ============================================================================
  // 8. Classical 6-Pillar Chop & Whipsaw Radar Engine (Brihat Samhita & Vyapar Bhavishya)
  // ============================================================================
  const moonDeg = planets.Moon ? planets.Moon.rashi.degreesInSign : 0;
  const moonRashiIdx = planets.Moon ? planets.Moon.rashi.index : 0;

  // Water-Fire Gandanta Nodes (Pisces-Aries, Cancer-Leo, Scorpio-Sagittarius)
  let isWaterFireJunction = false;
  let isGandanta = false;
  let gandantaJunctionName: string | undefined = undefined;
  let degreesFromNode: number | undefined = undefined;

  if (moonRashiIdx === 11 && moonDeg >= 29.0) {
    isWaterFireJunction = true;
    isGandanta = true;
    gandantaJunctionName = "Revati – Ashwini (Abhukta Mula / Pisces-Aries)";
    degreesFromNode = Number((30.0 - moonDeg).toFixed(2));
  } else if (moonRashiIdx === 0 && moonDeg <= 1.0) {
    isWaterFireJunction = true;
    isGandanta = true;
    gandantaJunctionName = "Revati – Ashwini (Abhukta Mula / Pisces-Aries)";
    degreesFromNode = Number(moonDeg.toFixed(2));
  } else if (moonRashiIdx === 3 && moonDeg >= 29.0) {
    isWaterFireJunction = true;
    isGandanta = true;
    gandantaJunctionName = "Ashlesha – Magha (Cancer-Leo)";
    degreesFromNode = Number((30.0 - moonDeg).toFixed(2));
  } else if (moonRashiIdx === 4 && moonDeg <= 1.0) {
    isWaterFireJunction = true;
    isGandanta = true;
    gandantaJunctionName = "Ashlesha – Magha (Cancer-Leo)";
    degreesFromNode = Number(moonDeg.toFixed(2));
  } else if (moonRashiIdx === 7 && moonDeg >= 29.0) {
    isWaterFireJunction = true;
    isGandanta = true;
    gandantaJunctionName = "Jyeshtha – Mula (Scorpio-Sagittarius)";
    degreesFromNode = Number((30.0 - moonDeg).toFixed(2));
  } else if (moonRashiIdx === 8 && moonDeg <= 1.0) {
    isWaterFireJunction = true;
    isGandanta = true;
    gandantaJunctionName = "Jyeshtha – Mula (Scorpio-Sagittarius)";
    degreesFromNode = Number(moonDeg.toFixed(2));
  } else if (moonDeg < 1.0 || moonDeg > 29.0) {
    isGandanta = true;
    gandantaJunctionName = "Rashi Sandhi Boundary (<1° or >29°)";
    degreesFromNode = moonDeg < 1.0 ? Number(moonDeg.toFixed(2)) : Number((30.0 - moonDeg).toFixed(2));
  }

  // Rikta Tithi Check (Chaturthi, Navami, Chaturdashi in Shukla or Krishna Paksha)
  const isRikta = [4, 9, 14, 19, 24, 29].includes(tithiIdx);
  const riktaTithiName = isRikta ? ephemeris.panchanga.tithi.name : "";

  // Mercury condition (active Mercury hora or combust/retrograde)
  const isMercuryCombust = planets.Mercury && planets.Sun
    ? angularDistance(planets.Mercury.siderealLongitude, planets.Sun.siderealLongitude) <= 14.0
    : false;
  const isMercuryDrag = activeHoraLord === "Mercury" || isMercuryCombust || (planets.Mercury?.isRetrograde ?? false);

  // Six Pillar details
  const pillars: ChopPillarDetail[] = [
    {
      id: "panchaka",
      name: "Panchaka 5x Turbulence",
      sanskritName: "पंचक (Panchaka 5x)",
      isActive: isPanchaka5xActive,
      severity: "HIGH",
      scoreContribution: isPanchaka5xActive ? 35 : 0,
      description: "Moon in final 5 Nakshatras (Dhanishta–Revati). Breakouts false up to 5x; heavy retail whipsaws.",
      tradingImpact: "Fade range extremes only; disable breakout momentum EAs.",
    },
    {
      id: "graha_yuddha",
      name: "Graha Yuddha (Planetary War)",
      sanskritName: "ग्रह युद्ध (Graha Yuddha)",
      isActive: activeGrahaYuddha.length > 0,
      severity: "CRITICAL",
      scoreContribution: activeGrahaYuddha.length > 0 ? 40 : 0,
      description: activeGrahaYuddha.length > 0
        ? `Active collision between ${activeGrahaYuddha.join(", ")}. Standoff between institutional market makers.`
        : "No planetary war (<1° orb) between visible planets.",
      tradingImpact: "Avoid swing positions; expect sudden slippage and directional deadlock.",
    },
    {
      id: "gandanta_sandhi",
      name: isWaterFireJunction ? "Water-Fire Gandanta Vortex" : "Rashi Sandhi Transition",
      sanskritName: isWaterFireJunction ? "गण्डान्त (Gandanta Void)" : "राशि संधि (Rashi Sandhi)",
      isActive: isGandanta,
      severity: isWaterFireJunction ? "CRITICAL" : "MEDIUM",
      scoreContribution: isWaterFireJunction ? 45 : isGandanta ? 20 : 0,
      description: isWaterFireJunction
        ? `Moon in sacred ${gandantaJunctionName} vortex (${degreesFromNode}° from exact node). Complete liquidity vacuum.`
        : isGandanta
        ? `Moon at sign boundary (${degreesFromNode}° from edge). Weak directional follow-through.`
        : "Moon well-centered inside sign body (healthy liquidity).",
      tradingImpact: isWaterFireJunction
        ? "HALT TRADING: Zero-trade mandate (0.0x risk) during exact node crossing."
        : "Reduce position sizing to 0.50x; wait for sign establishment.",
    },
    {
      id: "rikta_tithi",
      name: "Rikta Tithi (Void Day)",
      sanskritName: "रिक्ता तिथि (Rikta Tithi)",
      isActive: isRikta,
      severity: "MEDIUM",
      scoreContribution: isRikta ? 20 : 0,
      description: isRikta
        ? `Active ${riktaTithiName} (4th, 9th, or 14th lunar phase). Ruled by Saturn/Bhadra; volume hollows out.`
        : "Active lunar day possesses organic trend expansion volume.",
      tradingImpact: "Expect choppy mean reversion; tighten profit targets to 1:1 Risk/Reward.",
    },
    {
      id: "mercury_duality",
      name: "Mercury Duality & Alpha Drag",
      sanskritName: "बुध द्विसद्भाव (Mercury Duality)",
      isActive: isMercuryDrag,
      severity: "MEDIUM",
      scoreContribution: isMercuryDrag ? 15 : 0,
      description: isMercuryDrag
        ? "Mercury Hora or combustion active. Historical backtest shows -126.5 pts Alpha drag on Gold."
        : "Clean planetary hora alignment with asset rulers.",
      tradingImpact: "Avoid trailing stops; scalping only.",
    },
    {
      id: "rahu_kaal",
      name: "Rahu Kaal Fakeout Window",
      sanskritName: "राहु काल (Rahu Kaal Maya)",
      isActive: true,
      severity: "HIGH",
      scoreContribution: 15,
      description: "Daily 90-minute octant ruled by Rahu. Institutional liquidity sweeps and false breakouts peak.",
      tradingImpact: "Never buy high or sell low during Rahu Kaal; wait for the post-exit pivot.",
    },
  ];

  // Synthesize Chop Risk Score
  let rawChopScore = pillars.reduce((sum, p) => sum + p.scoreContribution, 0);
  const isCriticalTripwire = isWaterFireJunction || activeGrahaYuddha.length > 0;
  if (isCriticalTripwire) {
    rawChopScore = Math.max(rawChopScore, 75);
  }
  const chopScore = Math.min(100, Math.max(5, rawChopScore));

  const activeWarnings: string[] = [];
  if (isWaterFireJunction) activeWarnings.push(`Critical Gandanta Void: ${gandantaJunctionName}`);
  if (activeGrahaYuddha.length > 0) activeWarnings.push(`Graha Yuddha: ${activeGrahaYuddha.join(", ")}`);
  if (isPanchaka5xActive) activeWarnings.push("Panchaka Active: Breakouts fail up to 5x");
  if (isRikta) activeWarnings.push(`Rikta Tithi: ${riktaTithiName} (Hollow Trend)`);
  if (isMercuryDrag) activeWarnings.push("Mercury Duality: Negative Alpha Drag");

  let riskLevel: ChopRadarAssessment["riskLevel"] = "LOW";
  let circuitBreakerActive = false;
  let chopRegime: ChopRadarAssessment["marketRegime"] = "CLEAN_TREND";
  let regimeTitle = "🟢 CLEAN TRENDING REGIME";
  let regimeGuidance = "Low astronomical turbulence. Clean order flow expansion; standard 1.0x lot sizing and trend continuation setups permitted.";
  let recommendedLotScale = 1.0;

  if (chopScore >= 65 || isCriticalTripwire) {
    riskLevel = isWaterFireJunction ? "CRITICAL" : "HIGH";
    circuitBreakerActive = true;
    chopRegime = isWaterFireJunction ? "CRITICAL_VOID" : "CHOPPY_WHIPSAW";
    regimeTitle = isWaterFireJunction
      ? "🛑 CRITICAL GANDANTA VOID: ZERO-TRADE MANDATE"
      : "🛑 HARD CIRCUIT-BREAKER: Extreme Whipsaw Risk";
    regimeGuidance = isWaterFireJunction
      ? "Moon crossing Water-Fire Gandanta vortex. Extreme order book manipulation and liquidity vacuum. Trading strictly prohibited: 0.0x risk."
      : "Severe multi-pillar chop detected. High probability of false breakouts and two-way stop hunts. Enforce capital preservation: stand aside or reduce lot sizing to 0.25x.";
    recommendedLotScale = isWaterFireJunction ? 0.0 : 0.25;
  } else if (chopScore >= 35) {
    riskLevel = "MEDIUM";
    circuitBreakerActive = false;
    chopRegime = "STRUCTURED_RANGE";
    regimeTitle = "🟡 CAUTION: Range-Bound / Moderate Chop";
    regimeGuidance = "Market lacks strong directional thrust. Trade verified support/resistance boundaries only; reduce lot sizing to 0.50x.";
    recommendedLotScale = 0.5;
  }

  const chopRadar: ChopRadarAssessment = {
    chopScore,
    riskLevel,
    circuitBreakerActive,
    marketRegime: chopRegime,
    regimeTitle,
    regimeGuidance,
    recommendedLotScale,
    pillars,
    activeWarnings,
    gandantaDetails: {
      isGandanta,
      isWaterFireJunction,
      junctionName: gandantaJunctionName,
      degreesFromNode,
    },
    riktaTithiDetails: {
      isRikta,
      tithiName: ephemeris.panchanga.tithi.name,
      lunarDay: tithiIdx % 15 === 0 ? 15 : tithiIdx % 15,
      paksha: ephemeris.panchanga.tithi.paksha,
    },
  };

  // --- Phase 58: Pre-Market Master Execution Matrix ---
  let matCondition: MasterExecutionMatrix["marketCondition"] = "TRENDING_EXPANSION";
  let conditionLabel = "🟢 CLEAN TRENDING EXPANSION";
  let conditionDetail = "Clean institutional order flow expansion. Trend continuation setups favored.";
  let conditionColor: MasterExecutionMatrix["conditionColor"] = "emerald";

  let matTradeVerdict: MasterExecutionMatrix["tradePermittedVerdict"] = "TRADE_APPROVED";
  let verdictBadge = "✅ TRADE APPROVED (NORMAL 1.0×)";
  let verdictColor: MasterExecutionMatrix["verdictColor"] = "emerald";
  let verdictDetail = "Astronomical friction is low. Standard execution with full 1.0x position sizing permitted.";

  let matTimeframe: MasterExecutionMatrix["recommendedTimeframe"] = "M5_M15";
  let timeframeLabel = "⚡ M5 / M15 (Scalp & Trend)";
  let timeframeDetail = "Clean flow allows tighter precision entries on M5 pullbacks and M15 structure.";

  let matSl: MasterExecutionMatrix["slProfile"] = "TIGHT_STRUCTURAL";
  let slLabel = "🎯 Tight Structural (1.2× ATR)";
  let slDetail = "Set stop loss behind nearest M15 swing high/low. Low risk of rogue wicks.";

  let matTp: MasterExecutionMatrix["tpExpectancy"] = "FULL_EXPANSION_1_5_PLUS";
  let tpLabel = "🚀 TP Target: 1:3 - 1:5+ R:R (Ride Trend)";
  let tpDetail = "Trail stops behind H1 swing pivots. Let profits run through institutional expansion.";

  // Tier 1: Critical Stand Aside / Void
  if (recommendedLotScale === 0.0 || (circuitBreakerActive && isWaterFireJunction)) {
    matCondition = "CRITICAL_VOID";
    conditionLabel = "🛑 CRITICAL LIQUIDITY VOID";
    conditionDetail = "Moon in Water-Fire Gandanta boundary. Severe order-book manipulation and zero-liquidity air pockets.";
    conditionColor = "rose";

    matTradeVerdict = "DO_NOT_TRADE";
    verdictBadge = "🛑 DO NOT TRADE (STAND ASIDE)";
    verdictColor = "rose";
    verdictDetail = "Mandatory capital preservation rule active. Stand down completely; zero trade entries advised (0.0x size).";

    matTimeframe = "H4_D1_ONLY";
    timeframeLabel = "🛑 H4 / D1 Macro Only";
    timeframeDetail = "Intraday execution disabled. Observe daily/H4 macro closes only; avoid intraday whipsaws.";

    matSl = "WIDE_BUFFER";
    slLabel = "⛔ N/A (Trading Prohibited)";
    slDetail = "No orders permitted. Spreads and slippage are abnormal.";

    matTp = "ZERO_TARGET";
    tpLabel = "⛔ 0.0 R:R (Stand Down)";
    tpDetail = "Preserve account equity. The best trade today is no trade.";
  }
  // Tier 2: Severe Whipsaw / Circuit Breaker Active
  else if (circuitBreakerActive || chopScore >= 65) {
    matCondition = "CHOPPY_WHIPSAW";
    conditionLabel = "🔴 CHOPPY / SEVERE WHIPSAW";
    conditionDetail = "Extreme multi-pillar astronomical friction. High probability of two-way stop hunting and aggressive false breakouts.";
    conditionColor = "rose";

    matTradeVerdict = "CAUTION_REDUCED_SIZE";
    verdictBadge = "⚠️ CAUTION (0.25× SIZE ONLY)";
    verdictColor = "rose";
    verdictDetail = "Hard circuit-breaker active. Cut lot size to 0.25x or stand aside. Expect erratic volatility spikes.";

    matTimeframe = "H1_H4";
    timeframeLabel = "📊 H1 / H4 High-Timeframe Only";
    timeframeDetail = "Lower timeframes (M1 to M15) will suffer violent whipsaws. Only trade confirmed H1 rejections.";

    matSl = "WIDE_BUFFER";
    slLabel = "🛡️ Ultra-Wide Buffer (3.0× ATR)";
    slDetail = "Widen stops to 3.0x ATR to survive stop-hunting spikes; tighten position size accordingly.";

    matTp = "QUICK_SCALP_1_2";
    tpLabel = "🎯 TP Target: 1:1 - 1:1.5 R:R Max";
    tpDetail = "Take immediate partials at first support/resistance test. Do not attempt trend holding.";
  }
  // Tier 3: Structured Range / Sideways / Panchaka Friction
  else if (chopScore >= 35 || isPanchaka5xActive || Math.abs(directionalBias) < 0.25) {
    matCondition = "SIDEWAYS_RANGE";
    conditionLabel = "🟡 SIDEWAYS / STRUCTURED RANGE";
    conditionDetail = isPanchaka5xActive
      ? "Panchaka 5x Active: Market will compress into range boxes with repeating 5-fold breakout fakeouts."
      : "Balanced planetary opposing forces. Range-bound oscillations between session high and low expected.";
    conditionColor = "amber";

    matTradeVerdict = "CAUTION_REDUCED_SIZE";
    verdictBadge = "⚠️ CAUTION (0.50× SIZE ONLY)";
    verdictColor = "amber";
    verdictDetail = "Market lacks full directional thrust. Scale down exposure to 0.50x and trade edges only.";

    matTimeframe = "M15_H1";
    timeframeLabel = "📊 M15 / H1 Execution";
    timeframeDetail = "Filter M1/M5 noise. Only take entries when M15 candles close with clear rejection at range boundaries.";

    matSl = "WIDE_BUFFER";
    slLabel = "🛡️ Wide Buffer (2.5× ATR)";
    slDetail = "Give price room to breathe (2.5x ATR). Narrow stops will get hunted by Panchaka wicks.";

    matTp = "QUICK_SCALP_1_2";
    tpLabel = "🎯 TP Target: 1:1.5 - 1:2 R:R (Quick Scalp)";
    tpDetail = "Take profits swiftly at nearest support/resistance. Rallies quickly exhaust into mean-reversion.";
  }
  // Tier 4: Clean Trending Expansion
  else {
    matCondition = "TRENDING_EXPANSION";
    conditionLabel = directionalBias > 0 ? "🟢 CLEAN BULLISH EXPANSION" : "🔴 CLEAN BEARISH EXPANSION";
    conditionDetail = `Low astronomical friction (${chopScore}% risk). Institutional order flow aligns ${directionalBias > 0 ? "Bullish" : "Bearish"}.`;
    conditionColor = "emerald";

    matTradeVerdict = "TRADE_APPROVED";
    verdictBadge = "✅ TRADE APPROVED (NORMAL 1.0×)";
    verdictColor = "emerald";
    verdictDetail = "Full statistical edge active. Normal 1.0x position sizing permitted.";

    matTimeframe = "M5_M15";
    timeframeLabel = "⚡ M5 / M15 (Scalp & Continuation)";
    timeframeDetail = "Clean flow allows surgical pullback entries on M5 aligned with M15 market structure.";

    matSl = "STANDARD_ATR";
    slLabel = "🎯 Standard Structural (1.5× ATR)";
    slDetail = "Place SL behind key swing structure. High edge allows disciplined risk parameters.";

    matTp = "FULL_EXPANSION_1_5_PLUS";
    tpLabel = "🚀 TP Target: 1:3 - 1:5+ R:R (Ride Trend)";
    tpDetail = "High conviction trend expansion. Trail stops behind H1 candles to capture maximum daily range.";
  }

  const masterExecutionMatrix: MasterExecutionMatrix = {
    marketCondition: matCondition,
    conditionLabel,
    conditionDetail,
    conditionColor,
    tradePermittedVerdict: matTradeVerdict,
    verdictBadge,
    verdictColor,
    verdictDetail,
    recommendedTimeframe: matTimeframe,
    timeframeLabel,
    timeframeDetail,
    slProfile: matSl,
    slLabel,
    slDetail,
    tpExpectancy: matTp,
    tpLabel,
    tpDetail,
  };

  // Quant execution advice
  const baseLotSizeScale = volatilityMultiplier > 1.4 ? 0.75 : 1.0;
  const finalLotSizeScale = Math.min(baseLotSizeScale, recommendedLotScale);
  const allowLongs = recommendedLotScale === 0.0 ? false : directionalBias > -0.40 && nakshatraAction !== "SELL_RALLY";
  const allowShorts = recommendedLotScale === 0.0 ? false : directionalBias < 0.40 && nakshatraAction !== "BUY_DIP";

  return {
    symbol,
    timestampIso: date.toISOString(),
    signals: {
      directionalBias,
      volatilityMultiplier,
      confluencePoints,
      marketRegime,
      confidenceScore: Math.min(95, Math.max(50, Math.round(65 + Math.abs(directionalBias) * 30))),
    },
    chopRadar,
    masterExecutionMatrix,
    intradayTimeline: calculateIntradayTimeline(symbol, date, directionalBias, {
      isPanchakaActive: isPanchaka5xActive,
      isGandantaActive: isGandanta,
      isRiktaTithi: isRikta,
    }),
    dikshitLiquidityCycle: {
      moonNakshatraIndex: moonNak,
      moonNakshatraName: ephemeris.panchanga.nakshatra.sanskritName,
      action: nakshatraAction,
      ruleDescription: ruleDesc,
      dayOfWeek: dayName,
      weeklySessionRegime: weeklyRegime,
      isPanchaka5xActive,
      intradayLunarConjunctions,
      solarChestabalaStations,
      panchakaTiming,
      isEmpiricalOverridden,
    },
    varahamihiraScarcity: {
      primarySignIndex: primaryRashi,
      primarySignName: RASHI_NAMES[primaryRashi],
      maleficsInAfflictingHouses,
      beneficsInSupportingHouses,
      scarcityInflationScore: Number(scarcityScore.toFixed(2)),
      activeGrahaYuddha,
    },
    narapatiSwarodaya: {
      rahuKalanalaHemisphere,
      sunMoonNodalRegime,
      primaryLordVedhaMultiplier,
      activeSolarUpagrahaShocks,
      upagrahaShockDetails,
    },
    advancedTransitConfluence: {
      moonKakshyaLord,
      primaryLordKakshyaLord,
      yogiNakshatraName,
      yogiLord,
      avayogiNakshatraName,
      avayogiLord,
      isYogiTailwindActive,
      isAvayogiHeadwindActive,
      dagdhaRashiAlert,
      dualSign15DegZone,
      macroAlerts,
    },
    activeHora: {
      horaLord: activeHoraLord,
      horaBeneficialForAsset: isHoraBeneficial,
      horaMultiplier,
    },
    lunarPhase: {
      paksha: ephemeris.panchanga.tithi.paksha,
      tithiName: ephemeris.panchanga.tithi.name,
      tithiIndex: tithiIdx,
      isPurnimaAmavasyaClimax: isPurnimaAmavasya,
    },
    quantAdvice: {
      allowLongs,
      allowShorts,
      suggestedAtrSlMultiplier: Number((1.5 * volatilityMultiplier).toFixed(2)),
      lotSizeScale: finalLotSizeScale,
    },
  };
}


/**
 * Empirical Astro-Quant Discovery Lookup Table (Phase 54.3)
 * Derived from 6-month MT5 GOLD.pro backtest (130 Daily bars, 2,952 H1 bars; April - Sept 2026).
 */
export interface EmpiricalAstroEdge {
  category: "Nakshatra" | "Tithi" | "Paksha";
  name: string;
  bias: "BULLISH" | "BEARISH" | "NEUTRAL";
  winRatePct: number;
  sampleSize: number;
  historicalNetPts: number;
  tradeGuidance: string;
}

export const EMPIRICAL_GOLD_EDGES: Record<string, EmpiricalAstroEdge> = {
  // Top Bearish Nakshatras
  "Uttara Bhadrapada": {
    category: "Nakshatra",
    name: "Uttara Bhadrapada",
    bias: "BEARISH",
    winRatePct: 100.0,
    sampleSize: 5,
    historicalNetPts: -191.7,
    tradeGuidance: "100% Bearish dump in MT5 backtest. Block all buy orders; prioritize short rallies.",
  },
  "Ashlesha": {
    category: "Nakshatra",
    name: "Ashlesha",
    bias: "BEARISH",
    winRatePct: 80.0,
    sampleSize: 5,
    historicalNetPts: -190.6,
    tradeGuidance: "80% Bearish dump. Mercury Naga star aggressively drains gold liquidity.",
  },
  "Dhanishta": {
    category: "Nakshatra",
    name: "Dhanishta",
    bias: "BEARISH",
    winRatePct: 75.0,
    sampleSize: 4,
    historicalNetPts: -86.0,
    tradeGuidance: "75% Bearish trend. Downward distribution pressure active.",
  },
  "Revati": {
    category: "Nakshatra",
    name: "Revati",
    bias: "BEARISH",
    winRatePct: 66.7,
    sampleSize: 6,
    historicalNetPts: -262.6,
    tradeGuidance: "66.7% Bearish breakdown. Heavy institutional liquidation (-262 pts).",
  },
  "Swati": {
    category: "Nakshatra",
    name: "Swati",
    bias: "BEARISH",
    winRatePct: 66.7,
    sampleSize: 6,
    historicalNetPts: -162.8,
    tradeGuidance: "66.7% Bearish. Rahu wind star creates volatile downward flushes.",
  },

  // Top Bullish Nakshatras
  "Bharani": {
    category: "Nakshatra",
    name: "Bharani",
    bias: "BULLISH",
    winRatePct: 80.0,
    sampleSize: 5,
    historicalNetPts: 169.3,
    tradeGuidance: "80% Bullish expansion. High-statistical edge for Long setups (+169 pts).",
  },
  "Purva Bhadrapada": {
    category: "Nakshatra",
    name: "Purva Bhadrapada",
    bias: "BULLISH",
    winRatePct: 75.0,
    sampleSize: 4,
    historicalNetPts: 88.7,
    tradeGuidance: "75% Bullish continuation. Institutional long accumulation active.",
  },
  "Vishakha": {
    category: "Nakshatra",
    name: "Vishakha",
    bias: "BULLISH",
    winRatePct: 66.7,
    sampleSize: 6,
    historicalNetPts: 225.9,
    tradeGuidance: "66.7% Bullish. Powerful upward expansion (+225 pts).",
  },
  "Punarvasu": {
    category: "Nakshatra",
    name: "Punarvasu",
    bias: "BULLISH",
    winRatePct: 66.7,
    sampleSize: 6,
    historicalNetPts: 114.9,
    tradeGuidance: "66.7% Bullish. Dip-buying at support heavily favored.",
  },
  "Shravana": {
    category: "Nakshatra",
    name: "Shravana",
    bias: "BULLISH",
    winRatePct: 66.7,
    sampleSize: 6,
    historicalNetPts: 48.7,
    tradeGuidance: "66.7% Bullish. Classical buying star (Institutional dip accumulation).",
  },

  // Tithis
  "Saptami": {
    category: "Tithi",
    name: "Saptami",
    bias: "BULLISH",
    winRatePct: 70.0,
    sampleSize: 10,
    historicalNetPts: 493.6,
    tradeGuidance: "Surya's 7th Tithi! Massive +493 pts net bullish expansion on Gold.",
  },
  "Chaturthi": {
    category: "Tithi",
    name: "Chaturthi",
    bias: "BULLISH",
    winRatePct: 70.0,
    sampleSize: 10,
    historicalNetPts: 99.5,
    tradeGuidance: "70% Bullish win rate. Solid upward momentum.",
  },
  "Tritiya": {
    category: "Tithi",
    name: "Tritiya",
    bias: "BEARISH",
    winRatePct: 80.0,
    sampleSize: 5,
    historicalNetPts: -231.0,
    tradeGuidance: "80% Bearish dump (-231 pts). Avoid aggressive long positions.",
  },
  "Panchami": {
    category: "Tithi",
    name: "Panchami",
    bias: "BEARISH",
    winRatePct: 66.7,
    sampleSize: 9,
    historicalNetPts: -218.8,
    tradeGuidance: "66.7% Bearish breakdown (-218 pts). Favor selling rallies.",
  },
};

export const EMPIRICAL_HORA_ALPHA: Record<string, {
  name: string;
  bullRatePct: number;
  netPts: number;
  avgPtsPerHour: number;
  verdict: "TOP_BUY_ALPHA" | "SECONDARY_BUY" | "RANGE_CHOP" | "SELLING_TRAP";
  badge: string;
}> = {
  Sun: {
    name: "Sun",
    bullRatePct: 49.9,
    netPts: 213.9,
    avgPtsPerHour: 0.52,
    verdict: "TOP_BUY_ALPHA",
    badge: "☀️ Prime Buying Alpha (+213.9 pts)",
  },
  Moon: {
    name: "Moon",
    bullRatePct: 47.5,
    netPts: 105.2,
    avgPtsPerHour: 0.24,
    verdict: "SECONDARY_BUY",
    badge: "🌙 Dip Accumulation (+105.2 pts)",
  },
  Mars: {
    name: "Mars",
    bullRatePct: 46.9,
    netPts: 8.0,
    avgPtsPerHour: 0.02,
    verdict: "RANGE_CHOP",
    badge: "♂️ Neutral Drift (+8.0 pts)",
  },
  Saturn: {
    name: "Saturn",
    bullRatePct: 49.6,
    netPts: -54.0,
    avgPtsPerHour: -0.13,
    verdict: "RANGE_CHOP",
    badge: "🪐 Slow Rangebound (-54.0 pts)",
  },
  Mercury: {
    name: "Mercury",
    bullRatePct: 46.2,
    netPts: -126.5,
    avgPtsPerHour: -0.29,
    verdict: "RANGE_CHOP",
    badge: "☿️ Whipsaw / Trap (-126.5 pts)",
  },
  Jupiter: {
    name: "Jupiter",
    bullRatePct: 45.9,
    netPts: -248.6,
    avgPtsPerHour: -0.60,
    verdict: "RANGE_CHOP",
    badge: "♃ Corrective Pullback (-248.6 pts)",
  },
  Venus: {
    name: "Venus",
    bullRatePct: 47.8,
    netPts: -494.7,
    avgPtsPerHour: -1.21,
    verdict: "SELLING_TRAP",
    badge: "⚠️ Severe Selling Drain (-494.7 pts)",
  },
};
