/**
 * Financial Astrology & Astro-Economics Engine (व्यापार ज्योतिष)
 * 
 * Synthesized from:
 * 1. Varahamihira's Brihat Samhita (Adhyaya 41 Dravya Nishchaya & Adhyaya 42 Argha Kanda)
 * 2. Pandit Hira Lal Dikshit's Vyapar Bhavishya (Nakshatra Buy/Sell Liquidity & Weekly Cycles)
 * 3. Narapati's Narapatijayacharya Swarodaya (Sarvatobhadra Chakra 28-Nakshatra Vedha System)
 * 4. Classical Planetary Horas (Intraday 1-Hour Planetary rulership)
 */

import { calculateVedicEphemeris } from "./ephemeris";
import { EphemerisResult } from "./types";

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
    rulingRashis: [0, 9, 4], // Mesha (Aries - raw gold), Makara (Capricorn - bullion/vaults), Simha (Leo - solar sovereign metal)
    keyNakshatras: [2, 7, 11, 20], // Krittika, Pushya, Uttara Phalguni, Uttara Ashadha (Solar/Jupiterian fire stars)
    opposingLord: "Saturn",
  },
  EURUSD: {
    symbol: "EURUSD",
    name: "Euro / US Dollar",
    primaryLord: "Venus",
    secondaryLord: "Jupiter",
    rulingRashis: [1, 6, 11], // Taurus, Libra, Pisces (Venusian banking & trade treaty unions)
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
    rulingRashis: [3, 2, 5], // Cancer (Yen safe haven liquidity), Gemini/Virgo
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
    rulingRashis: [7, 9, 10], // Scorpio, Capricorn, Aquarius
    keyNakshatras: [5, 17, 22], // Ardra, Jyeshtha, Dhanishta
    opposingLord: "Sun",
  },
  BTCUSD: {
    symbol: "BTCUSD",
    name: "Bitcoin / US Dollar",
    primaryLord: "Rahu",
    secondaryLord: "Mercury",
    rulingRashis: [10, 2], // Aquarius (Decentralized future), Gemini (Cryptographic code)
    keyNakshatras: [5, 14, 23], // Ardra, Swati, Shatabhisha (Rahu's triad)
    opposingLord: "Jupiter",
  },
};

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
  dikshitLiquidityCycle: {
    moonNakshatraIndex: number;
    moonNakshatraName: string;
    action: NakshatraAction;
    ruleDescription: string;
    dayOfWeek: string;
    weeklySessionRegime: string;
  };
  varahamihiraScarcity: {
    primarySignIndex: number;
    primarySignName: string;
    maleficsInAfflictingHouses: string[];
    beneficsInSupportingHouses: string[];
    scarcityInflationScore: number;  // Positive = Supply shock (Bullish price spike)
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
  // UTC hour approximation (can be calibrated with local exchange sunrise if needed)
  const hour = date.getUTCHours();
  const horaIndex = (startIndex + hour) % 7;
  return HORA_ORDER[horaIndex];
}

/**
 * Computes the complete multi-layered Astro Market Signal for any symbol and date.
 */
export function calculateAstroMarketSignal(
  symbol: MarketSymbol,
  date: Date = new Date()
): AstroMarketSignal {
  const asset = ASSET_SIGNIFICATIONS[symbol] || ASSET_SIGNIFICATIONS.XAUUSD;
  
  // 1. Calculate Ephemeris for date (expects a Date object)
  const ephemeris = calculateVedicEphemeris(date, {
    latitude: 51.5074, // London Greenwich benchmark for UTC/Forex
    longitude: 0.1278,
    cityName: "London GMT",
    timezoneOffsetHours: 0,
  });

  const planets = ephemeris.planets;
  const primaryRashi = asset.rulingRashis[0];

  // 2. Varahamihira Dravya Nishchaya & Argha Kanda Logic (Adhyaya 41 & 42)
  // Houses counted from the asset's ruling Rashi
  const getHouseFromRashi = (planetRashiIndex: number, targetRashiIndex: number) => {
    return ((planetRashiIndex - targetRashiIndex + 12) % 12) + 1;
  };

  const maleficsInAfflictingHouses: string[] = [];
  const beneficsInSupportingHouses: string[] = [];
  let scarcityScore = 0.0;

  // Malefics: Saturn, Mars, Sun, Rahu
  // In 1, 2, 4, 5, 7, 8, 9, 12 from asset Rashi -> causes Mahat-Argha (Mahargha / Scarcity Price Spike)
  const maleficNames = ["Saturn", "Mars", "Sun", "Rahu"];
  const afflictingHouses = [1, 2, 4, 5, 7, 8, 9, 12];

  for (const mName of maleficNames) {
    const p = planets[mName];
    if (!p) continue;
    const h = getHouseFromRashi(p.rashi.index, primaryRashi);
    if (afflictingHouses.includes(h)) {
      maleficsInAfflictingHouses.push(`${mName} in H${h}`);
      scarcityScore += 0.25; // Malefic in affliction house creates supply scarcity = Price Bullishness
    } else {
      scarcityScore -= 0.10; // Malefic in Upachaya (3, 6, 10, 11) stabilizes supply
    }
  }

  // Benefics: Jupiter, Venus, unafflicted Mercury
  // In 2, 4, 5, 7, 9, 10, 11 -> promotes stable trade
  const beneficNames = ["Jupiter", "Venus", "Mercury"];
  const supportingHouses = [2, 4, 5, 7, 9, 10, 11];

  for (const bName of beneficNames) {
    const p = planets[bName];
    if (!p) continue;
    const h = getHouseFromRashi(p.rashi.index, primaryRashi);
    if (supportingHouses.includes(h)) {
      beneficsInSupportingHouses.push(`${bName} in H${h}`);
      scarcityScore += 0.15; // Sustained commercial growth
    }
    // Venus in 6 or 7 destroys prices (Sloka 10)
    if (bName === "Venus" && (h === 6 || h === 7)) {
      scarcityScore -= 0.35; // Sharp demand drop
    }
  }

  // 3. Pandit Hira Lal Dikshit Nakshatra Liquidity Cycle
  const moonNak = ephemeris.panchanga.nakshatra.index;
  let nakshatraAction: NakshatraAction = "NEUTRAL_EXPANSION";
  let ruleDesc = "Moon is in a neutral expansion star. Standard order flow applies.";

  if (SELLING_NAKSHATRAS.has(moonNak)) {
    nakshatraAction = "SELL_RALLY";
    ruleDesc = `Moon in ${ephemeris.panchanga.nakshatra.sanskritName} (Ugra/Tikshna star). Bullish rallies exhaust quickly; favor shorting resistances and taking profit.`;
  } else if (BUYING_NAKSHATRAS.has(moonNak)) {
    nakshatraAction = "BUY_DIP";
    ruleDesc = `Moon in ${ephemeris.panchanga.nakshatra.sanskritName} (Laghu/Chara star). Institutional accumulation at bottoms; favor buying pullbacks at key support.`;
  }

  // 4. Day-of-Week Liquidity Regime (Dikshit Pages 206-207)
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

  // 5. Active Planetary Hora
  const activeHoraLord = getPlanetaryHora(date);
  const isHoraBeneficial =
    activeHoraLord === asset.primaryLord ||
    activeHoraLord === asset.secondaryLord;
  const isHoraAdverse = activeHoraLord === asset.opposingLord;

  let horaMultiplier = 1.0;
  if (isHoraBeneficial) horaMultiplier = 1.25;
  if (isHoraAdverse) horaMultiplier = 0.80;

  // 6. Lunar Phase Climax (Amavasya / Purnima)
  const tithiIdx = ephemeris.panchanga.tithi.index;
  const isPurnimaAmavasya = tithiIdx === 14 || tithiIdx === 15 || tithiIdx === 29 || tithiIdx === 30;

  // 7. Calculate Composite Quant Directional Bias (-1.0 to +1.0)
  let rawBias = scarcityScore;
  if (nakshatraAction === "BUY_DIP") rawBias += 0.20;
  if (nakshatraAction === "SELL_RALLY") rawBias -= 0.20;
  if (isHoraBeneficial) rawBias += 0.15;
  if (isHoraAdverse) rawBias -= 0.15;

  // Primary Lord dignity bonus
  const pLord = planets[asset.primaryLord];
  if (pLord) {
    if (pLord.isRetrograde) rawBias *= 0.85; // Retrograde increases whip-saw/indecision
  }

  const directionalBias = Number(Math.max(-1.0, Math.min(1.0, rawBias)).toFixed(2));

  // Volatility Multiplier (1.0 = normal, >1.3 = event risk expansion)
  let volMult = 1.0;
  if (isPurnimaAmavasya) volMult += 0.40;
  if (maleficsInAfflictingHouses.length >= 3) volMult += 0.35;
  if (pLord && pLord.isRetrograde) volMult += 0.25;
  const volatilityMultiplier = Number(volMult.toFixed(2));

  // Confluence Points (-25 to +25 for MT5 Confluence Engine)
  const confluencePoints = Math.round(directionalBias * 25);

  // Regime determination
  let marketRegime: AstroMarketSignal["signals"]["marketRegime"] = "STABLE_TREND";
  if (volatilityMultiplier >= 1.4) {
    marketRegime = directionalBias > 0.3 ? "EXPANSION_BULLISH" : directionalBias < -0.3 ? "EXPANSION_BEARISH" : "HIGH_VOL_CHOP";
  } else if (Math.abs(directionalBias) < 0.2) {
    marketRegime = "CONSOLIDATION";
  }

  // Quant execution advice
  const allowLongs = directionalBias > -0.40 && nakshatraAction !== "SELL_RALLY";
  const allowShorts = directionalBias < 0.40 && nakshatraAction !== "BUY_DIP";
  const lotSizeScale = volatilityMultiplier > 1.4 ? 0.75 : 1.0; // scale down position size on extreme volatility days

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
    dikshitLiquidityCycle: {
      moonNakshatraIndex: moonNak,
      moonNakshatraName: ephemeris.panchanga.nakshatra.sanskritName,
      action: nakshatraAction,
      ruleDescription: ruleDesc,
      dayOfWeek: dayName,
      weeklySessionRegime: weeklyRegime,
    },
    varahamihiraScarcity: {
      primarySignIndex: primaryRashi,
      primarySignName: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"][primaryRashi],
      maleficsInAfflictingHouses,
      beneficsInSupportingHouses,
      scarcityInflationScore: Number(scarcityScore.toFixed(2)),
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
