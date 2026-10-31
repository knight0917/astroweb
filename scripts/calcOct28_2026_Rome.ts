import * as Astronomy from "astronomy-engine";
import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateTropicalAngles } from "../src/engine/ascendant";
import { toSiderealLongitude } from "../src/engine/ayanamsha";

const ROME_LAT = 41.9028;
const ROME_LON = 12.4964;

// On Oct 28, 2026, Rome is in CET (UTC+1)
const ROME_TZ_OFFSET = 1;

// Midday in Rome: 12:00 CET = 11:00 UTC
const middayUtc = new Date(Date.UTC(2026, 9, 28, 11, 0, 0));
const eph = calculateVedicEphemeris(middayUtc, { latitude: ROME_LAT, longitude: ROME_LON, timezoneOffsetHours: ROME_TZ_OFFSET });

console.log("=== PANCHANGA FOR 28 OCT 2026 (ROME, ITALY) ===");
console.log("Date Local:", "2026-10-28 12:00:00 CET");
console.log("Vaar (Weekday):", eph.panchanga.vara.name, "| Lord:", eph.panchanga.vara.lord);
console.log("Tithi:", eph.panchanga.tithi.name, "| Paksha:", eph.panchanga.tithi.paksha, "| Index:", eph.panchanga.tithi.index);
console.log("Nakshatra:", eph.panchanga.nakshatra.sanskritName, "| Pada:", eph.panchanga.nakshatra.pada, "| Lord:", eph.panchanga.nakshatra.lord);
console.log("Yoga:", eph.panchanga.yoga.name, "| Index:", eph.panchanga.yoga.index);
console.log("Karana:", eph.panchanga.karana.name, "| Index:", eph.panchanga.karana.index);
console.log("Sun Rashi:", eph.planets.Sun.rashi.englishName, "| Deg:", eph.planets.Sun.rashi.degreesInSign.toFixed(2));
console.log("Moon Rashi:", eph.planets.Moon.rashi.englishName, "| Deg:", eph.planets.Moon.rashi.degreesInSign.toFixed(2), "| Exalted:", eph.planets.Moon.rashi.englishName === "Taurus");
console.log("Mercury Retrograde:", eph.planets.Mercury.isRetrograde, "| Rashi:", eph.planets.Mercury.rashi.englishName, "| Deg:", eph.planets.Mercury.rashi.degreesInSign.toFixed(2));
console.log("Venus Retrograde:", eph.planets.Venus.isRetrograde, "| Rashi:", eph.planets.Venus.rashi.englishName, "| Deg:", eph.planets.Venus.rashi.degreesInSign.toFixed(2));
console.log("Saturn Retrograde:", eph.planets.Saturn.isRetrograde, "| Rashi:", eph.planets.Saturn.rashi.englishName);
console.log("Mars Retrograde:", eph.planets.Mars.isRetrograde, "| Rashi:", eph.planets.Mars.rashi.englishName, "| Deg:", eph.planets.Mars.rashi.degreesInSign.toFixed(2));
console.log("Jupiter Retrograde:", eph.planets.Jupiter.isRetrograde, "| Rashi:", eph.planets.Jupiter.rashi.englishName);

// Sunrise and Sunset in Rome on Oct 28, 2026
const observer = new Astronomy.Observer(ROME_LAT, ROME_LON, 0);
const dateMidnightUtc = new Date(Date.UTC(2026, 9, 27, 23, 0, 0)); // 00:00 CET Oct 28 = 23:00 UTC Oct 27
const sunriseTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, dateMidnightUtc, 1)!;
const sunriseUtc = sunriseTime.date;
const sunsetTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, sunriseUtc, 1)!;
const sunsetUtc = sunsetTime.date;

const sunriseCetHours = sunriseUtc.getUTCHours() + 1 + sunriseUtc.getUTCMinutes() / 60 + sunriseUtc.getUTCSeconds() / 3600;
const sunsetCetHours = sunsetUtc.getUTCHours() + 1 + sunsetUtc.getUTCMinutes() / 60 + sunsetUtc.getUTCSeconds() / 3600;

console.log(`Sunrise in Rome (CET): ${sunriseCetHours.toFixed(4)} (approx ${Math.floor(sunriseCetHours)}:${Math.round((sunriseCetHours % 1) * 60).toString().padStart(2, "0")} CET)`);
console.log(`Sunset in Rome (CET): ${sunsetCetHours.toFixed(4)} (approx ${Math.floor(sunsetCetHours)}:${Math.round((sunsetCetHours % 1) * 60).toString().padStart(2, "0")} CET)`);

const dayDurationHours = (sunsetUtc.getTime() - sunriseUtc.getTime()) / (3600 * 1000);
const nightDurationHours = 24 - dayDurationHours;
const dinaHoraLen = dayDurationHours / 12;
const ratriHoraLen = nightDurationHours / 12;

console.log(`Day Duration: ${dayDurationHours.toFixed(2)} hrs. Day Hora Length = ${(dinaHoraLen * 60).toFixed(1)} mins`);

// Chaldean sequence
const HORA_ORDER = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];
const DAY_FIRST_HORA: Record<number, string> = {
  0: "Sun", 1: "Moon", 2: "Mars", 3: "Mercury", 4: "Jupiter", 5: "Venus", 6: "Saturn"
};

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
  // Wednesday = Mercury first hora
  const startIdx = HORA_ORDER.indexOf(DAY_FIRST_HORA[3]);
  return HORA_ORDER[(startIdx + horaIdx) % 7];
}

const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];
const KAKSHYA_LORDS = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Lagna"];

console.log("\n==========================================================================================");
console.log("HOURLY TIMELINE FOR 28 OCT 2026 IN ROME, ITALY (CET / UTC+1)");
console.log("==========================================================================================");
console.log("Rome Time (CET)  | UTC Time | Vedic Hora (Sunrise) | Clock Hora | Rome Lagna  | Kakshya Lord | Action / Bias");
console.log("---------------------------------------------------------------------------------------------------------");

for (let hh = 0; hh < 24; hh++) {
  const utcHour = (hh - 1 + 24) % 24;
  const utcDay = hh < 1 ? 27 : 28;
  const dUtc = new Date(Date.UTC(2026, 9, utcDay, utcHour, 0, 0));

  const vHora = getVedicHora(dUtc);
  
  // Clock Hora based on Wednesday = 3
  const clockStart = HORA_ORDER.indexOf(DAY_FIRST_HORA[3]);
  const cHora = HORA_ORDER[(clockStart + hh) % 7];

  const astroTime = new Astronomy.AstroTime(dUtc);
  const trop = calculateTropicalAngles(astroTime, ROME_LAT, ROME_LON);
  const sid = toSiderealLongitude(trop.ascendant, astroTime.ut + 2451545.0, "Lahiri");
  const degInSign = ((sid % 30) + 30) % 30;
  const lagna = RASHI_NAMES[Math.floor(sid / 30) % 12];
  const kak = KAKSHYA_LORDS[Math.min(Math.floor(degInSign / 3.75), 7)];

  let action = "HOLD / CONSOLIDATE";
  if (vHora === "Mercury") action = "MOMENTUM EXPANSION (WED LORD)";
  else if (vHora === "Moon") action = "EXALTED MOON SURGE / BUY DIP";
  else if (vHora === "Jupiter" || vHora === "Sun") action = "EXPANSION / TREND PUSH";
  else if (vHora === "Saturn") action = "CAUTION / DIP TRAP";
  else if (vHora === "Mars") action = "KINETIC BREAKOUT";

  const cetLabel = `${String(hh).padStart(2, "0")}:00 CET`;
  const utcLabel = `${String(utcHour).padStart(2, "0")}:00 UTC`;
  console.log(
    `${cetLabel.padEnd(16)} | ${utcLabel.padEnd(8)} | ${vHora.padEnd(20)} | ${cHora.padEnd(10)} | ${lagna.padEnd(11)} | ${kak.padEnd(12)} | ${action}`
  );
}
