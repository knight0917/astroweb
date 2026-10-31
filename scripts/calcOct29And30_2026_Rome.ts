import * as Astronomy from "astronomy-engine";
import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateTropicalAngles } from "../src/engine/ascendant";
import { toSiderealLongitude } from "../src/engine/ayanamsha";

const ROME_LAT = 41.9028;
const ROME_LON = 12.4964;
const ROME_TZ_OFFSET = 1; // CET = UTC+1

const HORA_ORDER = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];
const DAY_FIRST_HORA: Record<number, string> = {
  0: "Sun", 1: "Moon", 2: "Mars", 3: "Mercury", 4: "Jupiter", 5: "Venus", 6: "Saturn"
};
const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];
const KAKSHYA_LORDS = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Lagna"];

function processDay(dayNumber: number, weekdayIndex: number, dayName: string) {
  const middayUtc = new Date(Date.UTC(2026, 9, dayNumber, 11, 0, 0));
  const eph = calculateVedicEphemeris(middayUtc, {
    latitude: ROME_LAT,
    longitude: ROME_LON,
    timezoneOffsetHours: ROME_TZ_OFFSET
  });

  console.log(`\n==========================================================================================`);
  console.log(`PANCHANGA & EPHEMERIS FOR ${dayNumber} OCT 2026 (${dayName.toUpperCase()}) - ROME, ITALY`);
  console.log(`==========================================================================================`);
  console.log(`Date Local: 2026-10-${dayNumber} 12:00:00 CET (UTC+1)`);
  console.log(`Vaar (Weekday): ${eph.panchanga.vara.name} | Lord: ${eph.panchanga.vara.lord}`);
  console.log(`Tithi: ${eph.panchanga.tithi.name} | Paksha: ${eph.panchanga.tithi.paksha} | Index: ${eph.panchanga.tithi.index}`);
  console.log(`Nakshatra: ${eph.panchanga.nakshatra.sanskritName} | Pada: ${eph.panchanga.nakshatra.pada} | Lord: ${eph.panchanga.nakshatra.lord}`);
  console.log(`Yoga: ${eph.panchanga.yoga.name} | Index: ${eph.panchanga.yoga.index}`);
  console.log(`Karana: ${eph.panchanga.karana.name} | Index: ${eph.panchanga.karana.index}`);
  
  console.log("\n--- Planetary Positions (Lahiri Ayanamsha) ---");
  for (const [name, p] of Object.entries(eph.planets)) {
    if (p.isUpagraha || p.isModernPlanet) continue;
    const degInSign = (p.siderealLongitude % 30).toFixed(2);
    const speed = p.speed ? p.speed.toFixed(3) : "N/A";
    console.log(
      `${name.padEnd(8)}: ${p.rashi.englishName.padEnd(12)} ${degInSign}° | Nak: ${(p.nakshatra?.sanskritName || "").padEnd(14)} (Pada ${p.nakshatra?.pada || 1}) | Lord: ${(p.nakshatra?.lord || "").padEnd(8)} | Speed: ${speed} | Retro: ${p.isRetrograde}`
    );
  }

  // Calculate Sun and Venus separation for combustion check
  const sunLong = eph.planets.Sun.siderealLongitude;
  const venLong = eph.planets.Venus.siderealLongitude;
  const merLong = eph.planets.Mercury.siderealLongitude;
  const marsLong = eph.planets.Mars.siderealLongitude;
  const jupLong = eph.planets.Jupiter.siderealLongitude;
  const satLong = eph.planets.Saturn.siderealLongitude;
  const moonLong = eph.planets.Moon.siderealLongitude;

  const sunVenDiff = Math.abs(sunLong - venLong);
  const sunVenSep = sunVenDiff > 180 ? 360 - sunVenDiff : sunVenDiff;
  console.log(`\nSun-Venus Separation: ${sunVenSep.toFixed(2)}° (Combustion threshold < 10°)`);

  // Sun-Mars aspect check (Sun in Libra, Mars in Cancer)
  const sunMarsDiff = Math.abs(sunLong - marsLong);
  const sunMarsSep = sunMarsDiff > 180 ? 360 - sunMarsDiff : sunMarsDiff;
  console.log(`Sun-Mars Separation: ${sunMarsSep.toFixed(2)}° (Square/Kendra = ~90°)`);

  // Sunrise and Sunset in Rome
  const observer = new Astronomy.Observer(ROME_LAT, ROME_LON, 0);
  const dateMidnightUtc = new Date(Date.UTC(2026, 9, dayNumber - 1, 23, 0, 0)); // 00:00 CET
  const sunriseTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, dateMidnightUtc, 1)!;
  const sunriseUtc = sunriseTime.date;
  const sunsetTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, sunriseUtc, 1)!;
  const sunsetUtc = sunsetTime.date;

  const srCetH = sunriseUtc.getUTCHours() + 1 + sunriseUtc.getUTCMinutes() / 60 + sunriseUtc.getUTCSeconds() / 3600;
  const ssCetH = sunsetUtc.getUTCHours() + 1 + sunsetUtc.getUTCMinutes() / 60 + sunsetUtc.getUTCSeconds() / 3600;

  console.log(`Sunrise Rome: ${srCetH.toFixed(4)} CET (${Math.floor(srCetH)}:${Math.round((srCetH % 1) * 60).toString().padStart(2, "0")} CET)`);
  console.log(`Sunset Rome:  ${ssCetH.toFixed(4)} CET (${Math.floor(ssCetH)}:${Math.round((ssCetH % 1) * 60).toString().padStart(2, "0")} CET)`);

  const dayDurationHours = (sunsetUtc.getTime() - sunriseUtc.getTime()) / (3600 * 1000);
  const nightDurationHours = 24 - dayDurationHours;
  const dinaHoraLen = dayDurationHours / 12;
  const ratriHoraLen = nightDurationHours / 12;
  console.log(`Day Duration: ${dayDurationHours.toFixed(2)}h (${(dinaHoraLen * 60).toFixed(1)}m/hora) | Night: ${nightDurationHours.toFixed(2)}h (${(ratriHoraLen * 60).toFixed(1)}m/hora)`);

  function getVedicHora(dUtc: Date): string {
    const t = dUtc.getTime();
    const sr = sunriseUtc.getTime();
    const ss = sunsetUtc.getTime();
    let diff = 0, horaIdx = 0;
    if (t >= sr && t < ss) {
      diff = (t - sr) / (3600 * 1000);
      horaIdx = Math.floor(diff / dinaHoraLen);
    } else if (t >= ss) {
      diff = (t - ss) / (3600 * 1000);
      horaIdx = 12 + Math.floor(diff / ratriHoraLen);
    } else {
      const prevSunset = new Date(sunsetUtc.getTime() - 24 * 3600 * 1000);
      diff = (t - prevSunset.getTime()) / (3600 * 1000);
      horaIdx = 12 + Math.floor(diff / ratriHoraLen);
    }
    const startIdx = HORA_ORDER.indexOf(DAY_FIRST_HORA[weekdayIndex]);
    return HORA_ORDER[(startIdx + horaIdx) % 7];
  }

  console.log(`\n==========================================================================================`);
  console.log(`HOURLY TIMELINE FOR ${dayNumber} OCT 2026 (${dayName.toUpperCase()}) - ROME, ITALY (CET / UTC+1)`);
  console.log(`==========================================================================================`);
  console.log(`Rome Time (CET)  | UTC Time | Vedic Hora (Sunrise) | Clock Hora | Rome Lagna  | Kakshya Lord | Action / Market Regime`);
  console.log(`-----------------------------------------------------------------------------------------------------------------`);

  const hourlyData = [];

  for (let hh = 0; hh < 24; hh++) {
    const utcHour = (hh - 1 + 24) % 24;
    const utcDay = hh < 1 ? dayNumber - 1 : dayNumber;
    const dUtc = new Date(Date.UTC(2026, 9, utcDay, utcHour, 0, 0));

    const vHora = getVedicHora(dUtc);

    const clockStart = HORA_ORDER.indexOf(DAY_FIRST_HORA[weekdayIndex]);
    const cHora = HORA_ORDER[(clockStart + hh) % 7];

    const astroTime = new Astronomy.AstroTime(dUtc);
    const trop = calculateTropicalAngles(astroTime, ROME_LAT, ROME_LON);
    const sid = toSiderealLongitude(trop.ascendant, astroTime.ut + 2451545.0, "Lahiri");
    const degInSign = ((sid % 30) + 30) % 30;
    const lagna = RASHI_NAMES[Math.floor(sid / 30) % 12];
    const kak = KAKSHYA_LORDS[Math.min(Math.floor(degInSign / 3.75), 7)];

    let action = "CONSOLIDATION / LIQUIDITY BUILD";
    if (hh >= 1 && hh < 8) {
      action = "ASIAN ACCUMULATION & BASE FORMATION";
      if (vHora === DAY_FIRST_HORA[weekdayIndex]) action = "ASIAN MOMENTUM EXPANSION";
      if (vHora === "Saturn") action = "ASIAN DIP / RANGE LOW TEST";
    } else if (hh >= 8 && hh < 14) {
      if (hh === 8 || hh === 9) action = "EUROPE OPEN VOLATILITY / LIQUIDITY SWEEP";
      else if (vHora === "Sun" || vHora === "Jupiter" || vHora === "Mars") action = "EUROPEAN TREND EXPANSION";
      else if (vHora === "Venus") action = "EUROPE MIDDAY PULLBACK / ROTATION";
      else action = "EUROPEAN TREND CONTINUATION";
    } else if (hh >= 14 && hh < 21) {
      if (hh === 14 || hh === 15) action = "NY OPEN PEAK VOLATILITY / BREAKOUT";
      else if (vHora === "Saturn") action = "NY REVERSAL / LIQUIDATION FLUSH";
      else if (vHora === DAY_FIRST_HORA[weekdayIndex]) action = "NY POWER-HOUR TREND DRIVER";
      else action = "NY CORE EXPANSION";
    } else {
      action = "POST-NY PROFIT TAKING / EQUILIBRIUM";
    }

    const cetLabel = `${String(hh).padStart(2, "0")}:00 CET`;
    const utcLabel = `${String(utcHour).padStart(2, "0")}:00 UTC`;
    console.log(
      `${cetLabel.padEnd(16)} | ${utcLabel.padEnd(8)} | ${vHora.padEnd(20)} | ${cHora.padEnd(10)} | ${lagna.padEnd(11)} | ${kak.padEnd(12)} | ${action}`
    );

    hourlyData.push({
      cetHour: hh,
      vHora,
      cHora,
      lagna,
      kak,
      action
    });
  }

  return { eph, hourlyData, sunriseCet: srCetH, sunsetCet: ssCetH };
}

console.log("CALCULATING COMPLETE ASTRO-DATA FOR OCTOBER 29 AND OCTOBER 30, 2026 IN ROME, ITALY...");
const oct29 = processDay(29, 4, "Thursday");
const oct30 = processDay(30, 5, "Friday");
