import * as Astronomy from "astronomy-engine";
import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateTropicalAngles } from "../src/engine/ascendant";
import { toSiderealLongitude } from "../src/engine/ayanamsha";
import { RASHI_NAMES } from "../src/engine/constants";

const TORINO_LAT = 45.0678;
const TORINO_LON = 7.6825;
const TORINO_TZ = 1;

function getMuhurtaForDay(year: number, month: number, day: number) {
  const observer = new Astronomy.Observer(TORINO_LAT, TORINO_LON, 0);
  const midnightUtc = new Date(Date.UTC(year, month - 1, day - 1, 23, 0, 0)); // 00:00 CET = 23:00 UTC previous day

  const sunriseTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, midnightUtc, 1)!;
  const sunriseUtc = sunriseTime.date;
  const sunsetTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, sunriseUtc, 1)!;
  const sunsetUtc = sunsetTime.date;

  const sunriseCet = new Date(sunriseUtc.getTime() + TORINO_TZ * 3600 * 1000);
  const sunsetCet = new Date(sunsetUtc.getTime() + TORINO_TZ * 3600 * 1000);

  const dayDurationMs = sunsetUtc.getTime() - sunriseUtc.getTime();
  const horaLenMs = dayDurationMs / 12;

  console.log(`\n=======================================================`);
  console.log(`DATE: ${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} (TORINO, ITALY)`);
  console.log(`Sunrise: ${sunriseCet.toISOString().slice(11, 16)} CET | Sunset: ${sunsetCet.toISOString().slice(11, 16)} CET`);
  console.log(`=======================================================`);

  // Chaldean order of Horas: Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars
  const CHALDEAN = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"];
  // Weekday lord determines first Hora
  // JS getUTCDay() for midnightUtc: 0 = Sunday, 1 = Monday, etc.
  // Actually weekday at sunrise:
  const weekdayNames = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const dayOfWeek = sunriseCet.getUTCDay(); // 0 is Sun, 1 is Mon, etc.
  const dayLord = weekdayNames[dayOfWeek];
  const startIdx = CHALDEAN.indexOf(dayLord);

  console.log(`\n--- DAY HORAS (${dayLord}'s Day) ---`);
  for (let h = 0; h < 12; h++) {
    const horaLord = CHALDEAN[(startIdx + h) % 7];
    const hStart = new Date(sunriseUtc.getTime() + h * horaLenMs + TORINO_TZ * 3600 * 1000);
    const hEnd = new Date(sunriseUtc.getTime() + (h + 1) * horaLenMs + TORINO_TZ * 3600 * 1000);

    // Calculate Ascendant at midpoint of this hora:
    const midUtc = new Date(sunriseUtc.getTime() + (h + 0.5) * horaLenMs);
    const ephMid = calculateVedicEphemeris(midUtc, { latitude: TORINO_LAT, longitude: TORINO_LON, timezoneOffsetHours: TORINO_TZ }, "Lahiri", "WholeSign", "Mean");
    const ascSign = ephMid.ascendant.rashi.englishName;
    const ascDeg = (ephMid.ascendant.siderealLongitude % 30).toFixed(1);

    const isFavorableHora = ["Mercury", "Jupiter", "Venus"].includes(horaLord);
    const tag = isFavorableHora ? "⭐⭐ [AUSPICIOUS]" : "";

    console.log(
      `Hora ${String(h + 1).padStart(2)}: ${hStart.toISOString().slice(11, 16)} - ${hEnd.toISOString().slice(11, 16)} CET | Lord: ${horaLord.padEnd(8)} | Lagna: ${ascSign.padEnd(11)} ${ascDeg}° ${tag}`
    );
  }
}

getMuhurtaForDay(2026, 10, 29); // Tomorrow
getMuhurtaForDay(2026, 11, 18); // Wednesday (Budhavara)
getMuhurtaForDay(2026, 11, 19); // Thursday (Guruvara)
