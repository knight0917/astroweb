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
  dailyBias: number
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

  if (SELLING_NAKSHATRAS.has(moonNak)) {
    nakshatraAction = "SELL_RALLY";
    ruleDesc = `Moon in ${ephemeris.panchanga.nakshatra.sanskritName} (Dikshit 8 Selling Stars). Bullish rallies exhaust quickly; favor shorting resistances and taking profit.`;
  } else if (BUYING_NAKSHATRAS.has(moonNak)) {
    nakshatraAction = "BUY_DIP";
    ruleDesc = `Moon in ${ephemeris.panchanga.nakshatra.sanskritName} (Dikshit 6 Buying Stars). Institutional accumulation at bottoms; favor buying pullbacks at key support.`;
  }

  // Dikshit Page 198: Panchaka 5x Rule (Moon in Aquarius or Pisces, ~300° to 360°)
  const moonLon = planets.Moon ? planets.Moon.siderealLongitude : 0;
  const isPanchaka5xActive = moonLon >= 300.0 && moonLon < 360.0;

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

  // Quant execution advice
  const allowLongs = directionalBias > -0.40 && nakshatraAction !== "SELL_RALLY";
  const allowShorts = directionalBias < 0.40 && nakshatraAction !== "BUY_DIP";
  const lotSizeScale = volatilityMultiplier > 1.4 ? 0.75 : 1.0;

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
    intradayTimeline: calculateIntradayTimeline(symbol, date, directionalBias),
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
      lotSizeScale,
    },
  };
}
