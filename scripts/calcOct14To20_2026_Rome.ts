import * as Astronomy from "astronomy-engine";
import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateTropicalAngles } from "../src/engine/ascendant";
import { toSiderealLongitude } from "../src/engine/ayanamsha";

const ROME_LAT = 41.9028;
const ROME_LON = 12.4964;
const ROME_TZ_OFFSET = 2; // CEST (UTC+2)

const HORA_ORDER = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];
const DAY_FIRST_HORA: Record<number, string> = {
  0: "Sun", 1: "Moon", 2: "Mars", 3: "Mercury", 4: "Jupiter", 5: "Venus", 6: "Saturn"
};

const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];
const KAKSHYA_LORDS = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Lagna"];

console.log("==================================================================================================================================================");
console.log("EPHEMERIS & PANCHANGA SCAN: 14 OCT 2026 TO 20 OCT 2026 (ROME, ITALY - CEST)");
console.log("==================================================================================================================================================");

interface DayReport {
  dateStr: string;
  dayName: string;
  isTradingDay: boolean;
  tithiName: string;
  tithiGroup: string;
  paksha: string;
  tithiIndex: number;
  nakshatra: string;
  nakLord: string;
  yoga: string;
  karana: string;
  sunRashi: string;
  sunDeg: number;
  moonRashi: string;
  moonDeg: number;
  venusRx: boolean;
  venusDeg: number;
  venusCombustSep: number;
  marsRashi: string;
  marsDeg: number;
  saturnRx: boolean;
  mercRx: boolean;
  isDwiNeechaActive: boolean;
  isVenusCombustActive: boolean;
  regime: string;
  bias: string;
  expRet: string;
  expRange: string;
}

const reports: DayReport[] = [];

for (let d = 14; d <= 20; d++) {
  const dateLocal = `2026-10-${d}`;
  // 12:00 CEST = 10:00 UTC
  const dUtc = new Date(Date.UTC(2026, 9, d, 10, 0, 0));
  const eph = calculateVedicEphemeris(dUtc, { latitude: ROME_LAT, longitude: ROME_LON, timezoneOffsetHours: ROME_TZ_OFFSET });

  const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dUtc.getUTCDay()];
  const isTradingDay = dayOfWeek !== "Saturday" && dayOfWeek !== "Sunday";

  const tIdx = eph.panchanga.tithi.index;
  const tithiGroupMap: Record<number, string> = {
    1: "Nanda", 6: "Nanda", 11: "Nanda", 16: "Nanda", 21: "Nanda", 26: "Nanda",
    2: "Bhadra", 7: "Bhadra", 12: "Bhadra", 17: "Bhadra", 22: "Bhadra", 27: "Bhadra",
    3: "Jaya", 8: "Jaya", 13: "Jaya", 18: "Jaya", 23: "Jaya", 28: "Jaya",
    4: "Rikta", 9: "Rikta", 14: "Rikta", 19: "Rikta", 24: "Rikta", 29: "Rikta",
    5: "Poorna", 10: "Poorna", 15: "Poorna", 20: "Poorna", 25: "Poorna", 30: "Poorna",
  };
  const tGroup = tithiGroupMap[tIdx] || "Nanda";

  const sunRashi = eph.planets.Sun.rashi.englishName;
  const sunDeg = eph.planets.Sun.rashi.degreesInSign;
  const moonRashi = eph.planets.Moon.rashi.englishName;
  const moonDeg = eph.planets.Moon.rashi.degreesInSign;
  const venusDeg = eph.planets.Venus.rashi.degreesInSign;
  const venusRashi = eph.planets.Venus.rashi.englishName;
  const venusRx = eph.planets.Venus.isRetrograde;
  const marsRashi = eph.planets.Mars.rashi.englishName;
  const marsDeg = eph.planets.Mars.rashi.degreesInSign;

  // Check Venus combustion (same sign & separation < 10 deg)
  const isVenusSameSign = sunRashi === venusRashi;
  const venusCombustSep = isVenusSameSign ? Math.abs(sunDeg - venusDeg) : 999;
  const isVenusCombustActive = isVenusSameSign && venusCombustSep < 8.0 && venusRx;

  // Dwi-Neecha check: Sun in Libra + Mars in Cancer
  const isDwiNeechaActive = sunRashi === "Libra" && marsRashi === "Cancer";

  let regime = "BALANCED";
  let bias = "NEUTRAL";
  let expRet = "0.00% to +0.10%";
  let expRange = "$35 - $42";

  if (isVenusCombustActive && isDwiNeechaActive) {
    regime = "🚨 SYSTEMIC LIQUIDATION (Venus Combustion + Dwi-Neecha)";
    bias = "HEAVY DOWN / CAPITAL FLIGHT";
    expRet = "-1.50% to -3.00%";
    expRange = "$80 - $120";
  } else if (isDwiNeechaActive) {
    regime = "⚠️ HIGH VOLATILITY / BEARISH PRESSURE (Dwi-Neecha)";
    bias = "BEARISH BIAS / DEEP WICKS";
    expRet = "-0.20% to -0.60%";
    expRange = "$50 - $70";
  } else if (sunRashi === "Virgo") {
    // Sun still in Virgo (Mercury-ruled, stable)
    if (["Mula", "Rohini", "Uttara Phalguni", "Uttara Ashadha", "Revati"].includes(eph.panchanga.nakshatra.sanskritName)) {
      regime = "🏆 BULL EXPANSION";
      bias = "BULLISH UP";
      expRet = "+0.25% to +0.45%";
      expRange = "$35 - $45";
    } else if (tGroup === "Jaya" || tGroup === "Nanda") {
      regime = "ACCUMULATION / BULLISH DRIFT";
      bias = "MILD BULLISH UP";
      expRet = "+0.15% to +0.30%";
      expRange = "$32 - $40";
    } else if (tGroup === "Rikta" || tGroup === "Poorna") {
      regime = "RANGE BOUND / CHOP";
      bias = "CHOP / FADE EXTREMES";
      expRet = "-0.05% to +0.05%";
      expRange = "$30 - $38";
    }
  }

  reports.push({
    dateStr: dateLocal,
    dayName: dayOfWeek,
    isTradingDay,
    tithiName: eph.panchanga.tithi.name,
    tithiGroup: tGroup,
    paksha: eph.panchanga.tithi.paksha,
    tithiIndex: tIdx,
    nakshatra: eph.panchanga.nakshatra.sanskritName,
    nakLord: eph.panchanga.nakshatra.lord,
    yoga: eph.panchanga.yoga.name,
    karana: eph.panchanga.karana.name,
    sunRashi,
    sunDeg,
    moonRashi,
    moonDeg,
    venusRx,
    venusDeg,
    venusCombustSep,
    marsRashi,
    marsDeg,
    saturnRx: eph.planets.Saturn.isRetrograde,
    mercRx: eph.planets.Mercury.isRetrograde,
    isDwiNeechaActive,
    isVenusCombustActive,
    regime,
    bias,
    expRet,
    expRange,
  });
}

for (const r of reports) {
  console.log(`\n------------------------------------------------------------------------------------------------------------------`);
  console.log(`📅 ${r.dateStr} (${r.dayName}) ${r.isTradingDay ? "[MARKET OPEN]" : "[WEEKEND CLOSED]"}`);
  console.log(`------------------------------------------------------------------------------------------------------------------`);
  console.log(`Panchanga : Tithi ${r.tithiName} (${r.tithiGroup}, Index ${r.tithiIndex}) | Nakshatra: ${r.nakshatra} (Lord: ${r.nakLord}) | Yoga: ${r.yoga} | Karana: ${r.karana}`);
  console.log(`Placements: Sun: ${r.sunRashi} ${r.sunDeg.toFixed(2)}° | Moon: ${r.moonRashi} ${r.moonDeg.toFixed(2)}° | Mars: ${r.marsRashi} ${r.marsDeg.toFixed(2)}° (Debilitated)`);
  console.log(`Retrogrades: Venus Rx: ${r.venusRx} (${r.sunRashi === "Libra" ? `Combust Sep: ${r.venusCombustSep.toFixed(2)}°` : "In Libra"}) | Saturn Rx: ${r.saturnRx} | Merc Rx: ${r.mercRx}`);
  console.log(`Astro Alert: Dwi-Neecha Active: ${r.isDwiNeechaActive} | Venus Combustion Active: ${r.isVenusCombustActive}`);
  console.log(`FORECAST   : Regime = ${r.regime}`);
  console.log(`             Direction = ${r.bias} | Exp Ret = ${r.expRet} | Exp Range = ${r.expRange}`);
}
