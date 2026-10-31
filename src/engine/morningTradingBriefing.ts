import * as Astronomy from "astronomy-engine";
import { calculateVedicEphemeris } from "./ephemeris";
import { calculateTropicalAngles } from "./ascendant";
import { toSiderealLongitude, getAyanamsha } from "./ayanamsha";

export const ROME_LATITUDE = 41.9028;
export const ROME_LONGITUDE = 12.4964;

export const CHALDEAN_HORA_ORDER = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];
export const WEEKDAY_FIRST_HORA: Record<number, string> = {
  0: "Sun",      // Sunday (Ravivara)
  1: "Moon",     // Monday (Somavara)
  2: "Mars",     // Tuesday (Mangalavara)
  3: "Mercury",  // Wednesday (Budhavara)
  4: "Jupiter",  // Thursday (Guruvara)
  5: "Venus",    // Friday (Shukravara)
  6: "Saturn"    // Saturday (Shanivara)
};

export const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const KAKSHYA_LORDS = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Lagna"];

export interface HourlyBriefingBar {
  romeTime: string;
  utcTime: string;
  vedicHora: string;
  clockHora: string;
  lagna: string;
  kakshyaLord: string;
  sessionPhase: string;
  actionBias: string;
  isKeyTurningPoint: boolean;
  notes: string;
}

export interface MorningBriefingPayload {
  targetDateStr: string; // YYYY-MM-DD
  romeTimezone: string; // "CET" or "CEST"
  timezoneOffsetHours: number;
  astronomical: {
    sunriseRome: string;
    sunsetRome: string;
    dayDurationHours: number;
    nightDurationHours: number;
    dinaHoraDurationMins: number;
    ratriHoraDurationMins: number;
  };
  panchanga: {
    vara: string;
    varaLord: string;
    tithi: string;
    paksha: string;
    nakshatra: string;
    nakshatraLord: string;
    nakshatraPada: number;
    yoga: string;
    karana: string;
  };
  planetaryPositions: Record<string, {
    rashi: string;
    degreesInSign: number;
    nakshatra: string;
    pada: number;
    isRetrograde: boolean;
    speed: number;
  }>;
  alerts: {
    gandantaAlert: boolean;
    gandantaDescription?: string;
    combustionAlert: boolean;
    combustionDescription?: string;
    dwiNeechaAlert: boolean;
    rahuAsterismAlert: boolean;
    highRiskWindow: string;
  };
  macroForecastD1: {
    regime: string;
    directionalBias: "STRONG_BULLISH" | "MILD_BULLISH" | "NEUTRAL_CHOP" | "MILD_BEARISH" | "HIGH_VOLATILITY_LIQUIDATION";
    expectedReturnPct: string;
    projectedRangeUsd: string;
    institutionalTheme: string;
    coreTradeSetup: string;
  };
  hourlyRoadmapH1: HourlyBriefingBar[];
  microstructureM15: {
    q1ImpulseStrategy: string;
    q2RetracementRule: string;
    q3ExpansionTarget: string;
    q4DragDefense: string;
    primeExecutionWindows: string[];
  };
}

/**
 * Determine timezone offset in hours for Rome, Italy on a given date.
 */
export function getRomeTimezoneOffset(dateUtc: Date): { offsetHours: number; tzCode: string } {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome",
    timeZoneName: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const parts = formatter.formatToParts(dateUtc);
  const tzName = parts.find(p => p.type === "timeZoneName")?.value || "CET";
  const offsetHours = tzName.includes("CEST") || tzName === "GMT+2" ? 2 : 1;
  const tzCode = offsetHours === 2 ? "CEST" : "CET";
  return { offsetHours, tzCode };
}

/**
 * Generate a complete Italian Pre-Market Trading Briefing for any date.
 */
export function generateMorningTradingBriefing(year: number, month1Based: number, day: number): MorningBriefingPayload {
  // Approximate noon in Rome for mid-day ephemeris baseline
  const testUtc = new Date(Date.UTC(year, month1Based - 1, day, 12, 0, 0));
  const { offsetHours: romeOffset, tzCode: romeTz } = getRomeTimezoneOffset(testUtc);

  // Exact local midnight in UTC
  const localMidnightUtc = new Date(Date.UTC(year, month1Based - 1, day, 0 - romeOffset, 0, 0));
  const localMiddayUtc = new Date(Date.UTC(year, month1Based - 1, day, 12 - romeOffset, 0, 0));

  const eph = calculateVedicEphemeris(localMiddayUtc, {
    cityName: "Rome",
    latitude: ROME_LATITUDE,
    longitude: ROME_LONGITUDE,
    timezoneOffsetHours: romeOffset
  });

  // Astronomical Sunrise and Sunset in Rome for Today, Yesterday, and Tomorrow
  const observer = new Astronomy.Observer(ROME_LATITUDE, ROME_LONGITUDE, 0);

  // Today
  const todaySunriseSearch = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, localMidnightUtc, 1)!;
  const todaySunriseUtc = todaySunriseSearch.date;
  const todaySunsetSearch = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, todaySunriseUtc, 1)!;
  const todaySunsetUtc = todaySunsetSearch.date;

  // Yesterday (to calculate exact Ratri horas for hours between 00:00 and today's sunrise)
  const yesterdayMidnightUtc = new Date(localMidnightUtc.getTime() - 24 * 3600 * 1000);
  const prevSunriseSearch = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, yesterdayMidnightUtc, 1)!;
  const prevSunsetSearch = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, prevSunriseSearch.date, 1)!;
  const prevSunsetUtc = prevSunsetSearch.date;

  // Tomorrow (to calculate exact Ratri horas for hours after today's sunset)
  const tomorrowMidnightUtc = new Date(localMidnightUtc.getTime() + 24 * 3600 * 1000);
  const nextSunriseSearch = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, tomorrowMidnightUtc, 1)!;
  const nextSunriseUtc = nextSunriseSearch.date;

  const srLocalMs = todaySunriseUtc.getTime() + romeOffset * 3600 * 1000;
  const ssLocalMs = todaySunsetUtc.getTime() + romeOffset * 3600 * 1000;
  const srDate = new Date(srLocalMs);
  const ssDate = new Date(ssLocalMs);

  const srStr = `${String(srDate.getUTCHours()).padStart(2, "0")}:${String(srDate.getUTCMinutes()).padStart(2, "0")} ${romeTz}`;
  const ssStr = `${String(ssDate.getUTCHours()).padStart(2, "0")}:${String(ssDate.getUTCMinutes()).padStart(2, "0")} ${romeTz}`;

  const dayDurationHours = (todaySunsetUtc.getTime() - todaySunriseUtc.getTime()) / (3600 * 1000);
  const prevNightDurationHours = (todaySunriseUtc.getTime() - prevSunsetUtc.getTime()) / (3600 * 1000);
  const todayNightDurationHours = (nextSunriseUtc.getTime() - todaySunsetUtc.getTime()) / (3600 * 1000);

  const dinaHoraLenHours = dayDurationHours / 12;
  const prevRatriHoraLenHours = prevNightDurationHours / 12;
  const todayRatriHoraLenHours = todayNightDurationHours / 12;

  // Today's Day Ruler (based on today's local sunrise)
  const todayWeekdayIdx = srDate.getUTCDay();
  const todayDayRuler = WEEKDAY_FIRST_HORA[todayWeekdayIdx];
  const todayStartIdx = CHALDEAN_HORA_ORDER.indexOf(todayDayRuler);

  // Yesterday's Day Ruler (governs night horas before today's sunrise)
  const prevWeekdayIdx = (todayWeekdayIdx + 6) % 7;
  const prevDayRuler = WEEKDAY_FIRST_HORA[prevWeekdayIdx];
  const prevStartIdx = CHALDEAN_HORA_ORDER.indexOf(prevDayRuler);

  function getVedicHoraForTime(dUtc: Date): string {
    const t = dUtc.getTime();
    const srToday = todaySunriseUtc.getTime();
    const ssToday = todaySunsetUtc.getTime();

    if (t >= srToday && t < ssToday) {
      // Dina Hora (Daytime)
      const diffHours = (t - srToday) / (3600 * 1000);
      const horaIdx = Math.min(11, Math.max(0, Math.floor(diffHours / dinaHoraLenHours)));
      return CHALDEAN_HORA_ORDER[(todayStartIdx + horaIdx) % 7];
    } else if (t < srToday) {
      // Ratri Hora before Sunrise (part of yesterday's Vedic day)
      const diffHours = (t - prevSunsetUtc.getTime()) / (3600 * 1000);
      const ratriIdx = Math.min(11, Math.max(0, Math.floor(diffHours / prevRatriHoraLenHours)));
      return CHALDEAN_HORA_ORDER[(prevStartIdx + 12 + ratriIdx) % 7];
    } else {
      // Ratri Hora after Sunset (part of today's night)
      const diffHours = (t - ssToday) / (3600 * 1000);
      const ratriIdx = Math.min(11, Math.max(0, Math.floor(diffHours / todayRatriHoraLenHours)));
      return CHALDEAN_HORA_ORDER[(todayStartIdx + 12 + ratriIdx) % 7];
    }
  }

  // Check critical astrological alerts
  const sunLong = eph.planets.Sun.siderealLongitude;
  const venLong = eph.planets.Venus.siderealLongitude;
  const marsLong = eph.planets.Mars.siderealLongitude;
  const jupLong = eph.planets.Jupiter.siderealLongitude;
  const moonLong = eph.planets.Moon.siderealLongitude;
  const rahLong = eph.planets.Rahu.siderealLongitude;

  // Combustion check
  let sunVenDiff = Math.abs(sunLong - venLong);
  if (sunVenDiff > 180) sunVenDiff = 360 - sunVenDiff;
  const isVenCombust = sunVenDiff < 10.0;

  // Bidirectional Gandanta check (Water 29.0°–30.0° or Fire 0.0°–1.0°)
  const jupDeg = jupLong % 30;
  const jupSignIdx = Math.floor(jupLong / 30);
  const isWaterSign = jupSignIdx === 3 || jupSignIdx === 7 || jupSignIdx === 11; // Cancer, Scorpio, Pisces
  const isFireSign = jupSignIdx === 0 || jupSignIdx === 4 || jupSignIdx === 8;   // Aries, Leo, Sagittarius
  const isJupGandanta = (isWaterSign && jupDeg >= 29.0) || (isFireSign && jupDeg <= 1.0);

  // Guru-Chandal Rahu Aspect (conjunction <10° or opposition within 5° of 180°)
  let jupRahDiff = Math.abs(jupLong - rahLong);
  if (jupRahDiff > 180) jupRahDiff = 360 - jupRahDiff;
  const isGuruChandal = jupRahDiff <= 10.0 || Math.abs(jupRahDiff - 180.0) <= 6.0;

  // Dwi-Neecha check (Sun in Libra, Mars in Cancer)
  const isSunInLibra = Math.floor(sunLong / 30) === 6;
  const isMarsInCancer = Math.floor(marsLong / 30) === 3;
  const isDwiNeecha = isSunInLibra && isMarsInCancer;

  // Rahu asterism check (Sun or Moon in Ardra or Swati or Shatabhisha)
  const moonNak = eph.planets.Moon.nakshatra?.sanskritName || "";
  const sunNak = eph.planets.Sun.nakshatra?.sanskritName || "";
  const isRahuAsterism = moonNak === "Ardra" || moonNak === "Swati" || sunNak === "Swati" || moonNak === "Shatabhisha";

  // Macro Regime classification
  let regime = "BALANCED ACCUMULATION & ROTATION";
  let directionalBias: MorningBriefingPayload["macroForecastD1"]["directionalBias"] = "MILD_BULLISH";
  let expReturn = "+0.20% to +0.50%";
  let projRange = "$35.00 - $48.00";
  let instTheme = "Steady rotational liquidity and orderly session expansion.";
  let coreSetup = "Buy dips during Asian/London support tests; scale out into NY overlap.";

  if (isJupGandanta) {
    regime = isGuruChandal
      ? "CRITICAL GANDANTA GURU-CHANDAL SYSTEMIC LIQUIDATION"
      : "GANDANTA STRUCTURAL VOID TRANSITION";
    directionalBias = "HIGH_VOLATILITY_LIQUIDATION";
    expReturn = "-2.00% to -4.00%";
    projRange = "$90.00 - $160.00";
    instTheme = "Institutional capital preservation; structural support void in bullion.";
    coreSetup = "Strict capital defense. Fade relief rallies; protect against cascade flushes.";
  } else if (isDwiNeecha && isVenCombust) {
    regime = "DWI-NEECHA & VENUS COMBUSTION BREAKDOWN";
    directionalBias = "MILD_BEARISH";
    expReturn = "-1.00% to -2.50%";
    projRange = "$65.00 - $110.00";
    instTheme = "Aggressive long-liquidation and currency headwinds.";
    coreSetup = "Sell intraday pullbacks into European/NY resistance; trail stops aggressively.";
  } else if (isRahuAsterism) {
    regime = "DOUBLE-RAHU TWO-WAY VOLATILITY EXPANSION";
    directionalBias = "NEUTRAL_CHOP";
    expReturn = "-0.50% to +0.50%";
    projRange = "$55.00 - $85.00";
    instTheme = "Violent liquidity sweeps, sharp stop hunts, false breakouts.";
    coreSetup = "Trade mean-reversion at session extremes; avoid breakout chasing in Q1.";
  } else if (todayDayRuler === "Jupiter" || todayDayRuler === "Mars") {
    regime = "BULLISH TREND EXPANSION";
    directionalBias = "STRONG_BULLISH";
    expReturn = "+0.45% to +1.20%";
    projRange = "$45.00 - $65.00";
    instTheme = "Institutional trend following and persistent spot bullion bids.";
    coreSetup = "Execute aggressive Q1 trend entries on European and NY open breaks.";
  }

  // 24-Hour H1 Timeline
  const hourlyRoadmapH1: HourlyBriefingBar[] = [];

  for (let hh = 0; hh < 24; hh++) {
    const utcHour = (hh - romeOffset + 24) % 24;
    const utcDay = hh < romeOffset ? day - 1 : day;
    const dUtc = new Date(Date.UTC(year, month1Based - 1, utcDay, utcHour, 0, 0));

    const vHora = getVedicHoraForTime(dUtc);
    const clockStart = CHALDEAN_HORA_ORDER.indexOf(todayDayRuler);
    const cHora = CHALDEAN_HORA_ORDER[(clockStart + hh) % 7];

    const astroTime = new Astronomy.AstroTime(dUtc);
    const trop = calculateTropicalAngles(astroTime, ROME_LATITUDE, ROME_LONGITUDE);
    const jd = astroTime.ut + 2451545.0;
    const ayan = getAyanamsha(jd, "Lahiri");
    const sid = toSiderealLongitude(trop.ascendant, ayan);
    const degInSign = ((sid % 30) + 30) % 30;
    const lagna = RASHI_NAMES[Math.floor(sid / 30) % 12];
    const kak = KAKSHYA_LORDS[Math.min(Math.floor(degInSign / 3.75), 7)];

    let sessionPhase = "ASIAN ACCUMULATION";
    let actionBias = "CONSOLIDATION & BASE FORMATION";
    let isKeyTurn = false;
    let notes = "Monitor overnight range boundaries.";

    if (hh >= 1 && hh < 8) {
      sessionPhase = "ASIAN SESSION";
      if (vHora === "Saturn" || hh === 2 || hh === 3) {
        actionBias = "ASIAN DIP / RANGE LOW FORMATION";
        isKeyTurn = true;
        notes = "Prime overnight accumulation window.";
      } else {
        actionBias = "RANGE BOUND / DRIFT";
      }
    } else if (hh >= 8 && hh < 14) {
      sessionPhase = "EUROPEAN CORE";
      if (hh === 8 || hh === 9) {
        actionBias = "LONDON OPEN BREAKOUT / LIQUIDITY SWEEP";
        isKeyTurn = true;
        notes = "High-velocity expansion bar. Follow Q1 impulse.";
      } else if (vHora === "Sun" || vHora === "Jupiter" || vHora === "Mars") {
        actionBias = "TREND EXPANSION";
        notes = "Directional acceleration under fire/benefic hora.";
      } else if (vHora === "Venus") {
        actionBias = "MIDDAY RETRACEMENT / ROTATION";
        notes = "Watch for false tops and mean reversion to VWAP.";
      } else {
        actionBias = "STEADY CONTINUATION";
      }
    } else if (hh >= 14 && hh < 21) {
      sessionPhase = "NY OVERLAP & CASH SESSION";
      if (hh === 14 || hh === 15) {
        actionBias = "NY OPEN PEAK VOLATILITY SPIKE";
        isKeyTurn = true;
        notes = "Highest volume and spread of the day. Strict risk controls.";
      } else if (vHora === "Saturn" || hh === 16 || hh === 19) {
        actionBias = "NY LIQUIDATION SHAKEOUT / FLUSH";
        isKeyTurn = true;
        notes = "Saturn Hora flush often prints the late-day low.";
      } else if (hh === 20) {
        actionBias = "NY CLOSING POWER-HOUR";
        isKeyTurn = true;
        notes = "Trend resolution and short-covering surge into settlement.";
      } else {
        actionBias = "NY EXTENSION / RE-ACCELERATION";
      }
    } else {
      sessionPhase = "POST-NY SETTLEMENT";
      actionBias = "PROFIT TAKING & SPREAD COMPRESSION";
      notes = "Square intraday exposure before rollover.";
    }

    hourlyRoadmapH1.push({
      romeTime: `${String(hh).padStart(2, "0")}:00 ${romeTz}`,
      utcTime: `${String(utcHour).padStart(2, "0")}:00 UTC`,
      vedicHora: vHora,
      clockHora: cHora,
      lagna,
      kakshyaLord: kak,
      sessionPhase,
      actionBias,
      isKeyTurningPoint: isKeyTurn,
      notes
    });
  }

  // Planetary positions dictionary
  const planetsDict: Record<string, any> = {};
  for (const [name, p] of Object.entries(eph.planets)) {
    if (p.isUpagraha || p.isModernPlanet) continue;
    planetsDict[name] = {
      rashi: p.rashi.englishName,
      degreesInSign: parseFloat((p.siderealLongitude % 30).toFixed(2)),
      nakshatra: p.nakshatra?.sanskritName || "Unknown",
      pada: p.nakshatra?.pada || 1,
      isRetrograde: p.isRetrograde,
      speed: parseFloat((p.speed || 0).toFixed(3))
    };
  }

  return {
    targetDateStr: `${year}-${String(month1Based).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    romeTimezone: romeTz,
    timezoneOffsetHours: romeOffset,
    astronomical: {
      sunriseRome: srStr,
      sunsetRome: ssStr,
      dayDurationHours: parseFloat(dayDurationHours.toFixed(2)),
      nightDurationHours: parseFloat(todayNightDurationHours.toFixed(2)),
      dinaHoraDurationMins: parseFloat((dinaHoraLenHours * 60).toFixed(1)),
      ratriHoraDurationMins: parseFloat((todayRatriHoraLenHours * 60).toFixed(1))
    },
    panchanga: {
      vara: eph.panchanga.vara.name,
      varaLord: eph.panchanga.vara.lord,
      tithi: eph.panchanga.tithi.name,
      paksha: eph.panchanga.tithi.paksha,
      nakshatra: eph.panchanga.nakshatra.sanskritName,
      nakshatraLord: eph.panchanga.nakshatra.lord,
      nakshatraPada: eph.panchanga.nakshatra.pada,
      yoga: eph.panchanga.yoga.name,
      karana: eph.panchanga.karana.name
    },
    planetaryPositions: planetsDict,
    alerts: {
      gandantaAlert: isJupGandanta,
      gandantaDescription: isJupGandanta ? `Jupiter at ${(jupLong % 30).toFixed(2)}° ${RASHI_NAMES[Math.floor(jupLong / 30)]} in Gandanta knot.` : undefined,
      combustionAlert: isVenCombust,
      combustionDescription: isVenCombust ? `Venus combust within ${sunVenDiff.toFixed(2)}° of Sun.` : undefined,
      dwiNeechaAlert: isDwiNeecha,
      rahuAsterismAlert: isRahuAsterism,
      highRiskWindow: isJupGandanta ? "14:00 - 17:00 CET (NY Liquidation)" : "16:00 - 17:00 CET (Saturn Flush)"
    },
    macroForecastD1: {
      regime,
      directionalBias,
      expectedReturnPct: expReturn,
      projectedRangeUsd: projRange,
      institutionalTheme: instTheme,
      coreTradeSetup: coreSetup
    },
    hourlyRoadmapH1,
    microstructureM15: {
      q1ImpulseStrategy: "Q1 (:00 - :15): Enter on the :00 minute open bar with prevailing H1 trend. Historically delivers +2.5 to +3.3 bps systematic positive drift.",
      q2RetracementRule: "Q2 (:15 - :30): Never chase extreme highs/lows of Q1. Allow Q2 to test 15-minute VWAP support.",
      q3ExpansionTarget: "Q3 (:30 - :45): Secondary breakout confirmation. If Q2 holds higher lows, Q3 accelerates toward Kakshya targets.",
      q4DragDefense: "Q4 (:45 - :00): Pre-hourly close drag (-1.5 to -2.5 bps). Tighten trailing stops and take partial profits before :00.",
      primeExecutionWindows: ["08:00 - 08:30 CET (London Open)", "13:00 - 13:30 CET (Pre-NY Bid)", "14:00 - 14:30 CET (NY Cash Open)", "19:00 - 19:30 CET (Saturn Low)"]
    }
  };
}
