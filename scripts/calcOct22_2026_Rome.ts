import * as Astronomy from "astronomy-engine";
import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateTropicalAngles } from "../src/engine/ascendant";
import { toSiderealLongitude } from "../src/engine/ayanamsha";

const ROME_LAT = 41.9028;
const ROME_LON = 12.4964;

// On Oct 22, 2026, Rome is in CEST (UTC+2) because DST ends on Oct 25, 2026
const ROME_TZ_OFFSET = 2; // +2 hours

// Check timezone using Intl
const dApprox = new Date(Date.UTC(2026, 9, 22, 12, 0, 0));
const tf = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Rome", timeZoneName: "shortOffset" }).format(dApprox);
console.log(`Rome Timezone format check for Oct 22, 2026: ${tf}`);

// Local Midday in Rome: 12:00 CEST = 10:00 UTC
const middayUtc = new Date(Date.UTC(2026, 9, 22, 10, 0, 0));
const eph = calculateVedicEphemeris(middayUtc, { latitude: ROME_LAT, longitude: ROME_LON, timezoneOffsetHours: ROME_TZ_OFFSET });

console.log("=== PANCHANGA FOR 22 OCT 2026 (ROME, ITALY) ===");
console.log("Date Local:", "2026-10-22 12:00:00 CEST");
console.log("Vaar (Weekday):", eph.panchanga.vara.name, "| Lord:", eph.panchanga.vara.lord);
console.log("Tithi:", eph.panchanga.tithi.name, "| Paksha:", eph.panchanga.tithi.paksha, "| Index:", eph.panchanga.tithi.index);
console.log("Nakshatra:", eph.panchanga.nakshatra.sanskritName, "| Pada:", eph.panchanga.nakshatra.pada, "| Lord:", eph.panchanga.nakshatra.lord);
console.log("Yoga:", eph.panchanga.yoga.name, "| Index:", eph.panchanga.yoga.index);
console.log("Karana:", eph.panchanga.karana.name, "| Index:", eph.panchanga.karana.index);
console.log("Sun Rashi:", eph.planets.Sun.rashi.englishName, "| Deg:", eph.planets.Sun.rashi.degreesInSign.toFixed(2));
console.log("Moon Rashi:", eph.planets.Moon.rashi.englishName, "| Deg:", eph.planets.Moon.rashi.degreesInSign.toFixed(2));
console.log("Mercury Retrograde:", eph.planets.Mercury.isRetrograde, "| Rashi:", eph.planets.Mercury.rashi.englishName);
console.log("Venus Retrograde:", eph.planets.Venus.isRetrograde, "| Rashi:", eph.planets.Venus.rashi.englishName);
console.log("Saturn Retrograde:", eph.planets.Saturn.isRetrograde, "| Rashi:", eph.planets.Saturn.rashi.englishName);
console.log("Mars Retrograde:", eph.planets.Mars.isRetrograde, "| Rashi:", eph.planets.Mars.rashi.englishName);
console.log("Jupiter Retrograde:", eph.planets.Jupiter.isRetrograde, "| Rashi:", eph.planets.Jupiter.rashi.englishName);

// Sunrise and Sunset in Rome on Oct 22, 2026
const observer = new Astronomy.Observer(ROME_LAT, ROME_LON, 0);
const dateMidnightUtc = new Date(Date.UTC(2026, 9, 21, 22, 0, 0)); // 00:00 CEST = 22:00 UTC Oct 21
const sunriseTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, dateMidnightUtc, 1)!;
const sunriseUtc = sunriseTime.date;
const sunsetTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, sunriseUtc, 1)!;
const sunsetUtc = sunsetTime.date;

const sunriseCestHours = sunriseUtc.getUTCHours() + 2 + sunriseUtc.getUTCMinutes() / 60 + sunriseUtc.getUTCSeconds() / 3600;
const sunsetCestHours = sunsetUtc.getUTCHours() + 2 + sunsetUtc.getUTCMinutes() / 60 + sunsetUtc.getUTCSeconds() / 3600;

console.log(`Sunrise in Rome (CEST): ${sunriseCestHours.toFixed(4)} (approx ${Math.floor(sunriseCestHours)}:${Math.round((sunriseCestHours % 1) * 60).toString().padStart(2, "0")} CEST)`);
console.log(`Sunset in Rome (CEST): ${sunsetCestHours.toFixed(4)} (approx ${Math.floor(sunsetCestHours)}:${Math.round((sunsetCestHours % 1) * 60).toString().padStart(2, "0")} CEST)`);

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
  // Thursday = Jupiter first hora
  const startIdx = HORA_ORDER.indexOf(DAY_FIRST_HORA[4]);
  return HORA_ORDER[(startIdx + horaIdx) % 7];
}

const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];
const KAKSHYA_LORDS = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Lagna"];

console.log("\n==========================================================================================");
console.log("HOURLY TIMELINE FOR 22 OCT 2026 IN ROME, ITALY (CEST / UTC+2)");
console.log("==========================================================================================");
console.log("Rome Time (CEST) | UTC Time | Vedic Hora (Sunrise) | Clock Hora | Rome Lagna  | Kakshya Lord | Action / Bias");
console.log("---------------------------------------------------------------------------------------------------------");

for (let hh = 0; hh < 24; hh++) {
  // Convert Rome CEST (UTC+2) to UTC
  const utcHour = (hh - 2 + 24) % 24;
  const utcDay = hh < 2 ? 21 : 22;
  const dUtc = new Date(Date.UTC(2026, 9, utcDay, utcHour, 0, 0));

  const vHora = getVedicHora(dUtc);
  
  // Clock Hora based on Thursday = 4
  const clockStart = HORA_ORDER.indexOf(DAY_FIRST_HORA[4]);
  const cHora = HORA_ORDER[(clockStart + hh) % 7];

  const astroTime = new Astronomy.AstroTime(dUtc);
  const trop = calculateTropicalAngles(astroTime, ROME_LAT, ROME_LON);
  const sid = toSiderealLongitude(trop.ascendant, astroTime.ut + 2451545.0, "Lahiri");
  const degInSign = ((sid % 30) + 30) % 30;
  const lagna = RASHI_NAMES[Math.floor(sid / 30) % 12];
  const kak = KAKSHYA_LORDS[Math.min(Math.floor(degInSign / 3.75), 7)];

  let action = "HOLD / NEUTRAL";
  if (vHora === "Jupiter" || vHora === "Sun" || vHora === "Moon") action = "EXPANSION / BUY DIP";
  else if (vHora === "Saturn") action = "CAUTION / DIP TRAP";
  else if (vHora === "Mars") action = "MOMENTUM DRIVE";

  const cestLabel = `${String(hh).padStart(2, "0")}:00 CEST`;
  const utcLabel = `${String(utcHour).padStart(2, "0")}:00 UTC`;
  console.log(
    `${cestLabel.padEnd(16)} | ${utcLabel.padEnd(8)} | ${vHora.padEnd(20)} | ${cHora.padEnd(10)} | ${lagna.padEnd(11)} | ${kak.padEnd(12)} | ${action}`
  );
}
