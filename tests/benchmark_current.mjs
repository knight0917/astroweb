import * as Astronomy from "astronomy-engine";
import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { formatDMS } from "../src/engine/rashiNakshatra";
import { getAyanamsha } from "../src/engine/ayanamsha";

// Current exact timestamp: 2026-08-21 19:04:03 +02:00 -> 17:04:03 UTC (22:34:03 IST)
const currentDate = new Date("2026-08-21T17:04:03Z");
const astroTime = Astronomy.MakeTime(currentDate);

const varanasi = {
  cityName: "Varanasi, India",
  latitude: 25.3176,
  longitude: 82.9739,
  timezoneOffsetHours: 5.5,
};

const result = calculateVedicEphemeris(currentDate, varanasi, "Lahiri", "WholeSign", "Mean");

console.log("=========================================================================================");
console.log("PRECISION BENCHMARK REPORT: CURRENT CELESTIAL TIMING");
console.log(`Timestamp: ${currentDate.toISOString()} (Local IST: 22:34:03 IST)`);
console.log(`Location: ${varanasi.cityName} (Lat: ${varanasi.latitude}° N, Lon: ${varanasi.longitude}° E)`);
console.log(`Ayanamsha: Lahiri (Chitrapaksha) = ${result.ayanamshaValue.toFixed(5)}°`);
console.log("=========================================================================================\n");

console.log("BODY       | SIDEREAL LONGITUDE | RASHI (ZODIAC)   | NAKSHATRA & PADA     | LORD    | SPEED (°/d) | STATUS");
console.log("-----------+--------------------+------------------+----------------------+---------+-------------+--------");

// Ascendant (Lagna)
const asc = result.ascendant;
console.log(
  `${"Lagna".padEnd(10)} | ${formatDMS(asc.siderealLongitude).padEnd(18)} | ${(asc.rashi.sanskritName + " (" + formatDMS(asc.rashi.degreesInSign) + ")").padEnd(16)} | ${(asc.nakshatra.sanskritName + " P" + asc.nakshatra.pada).padEnd(20)} | ${asc.nakshatra.lord.padEnd(7)} | ${"---".padEnd(11)} | Rising`
);

// Planets
for (const [name, p] of Object.entries(result.planets)) {
  const rashiStr = `${p.rashi.sanskritName} (${formatDMS(p.rashi.degreesInSign)})`;
  const nakStr = `${p.nakshatra.sanskritName} P${p.nakshatra.pada}`;
  const speedStr = `${p.speed >= 0 ? "+" : ""}${p.speed.toFixed(3)}`;
  const status = p.isRetrograde ? "Retrograde (R)" : "Direct (D)";
  console.log(
    `${name.padEnd(10)} | ${formatDMS(p.siderealLongitude).padEnd(18)} | ${rashiStr.padEnd(16)} | ${nakStr.padEnd(20)} | ${p.nakshatra.lord.padEnd(7)} | ${speedStr.padEnd(11)} | ${status}`
  );
}

console.log("\n--- PANCHANGA DETAILS AT CURRENT MOMENT ---");
console.log(`Tithi:     ${result.panchanga.tithi.name} (${result.panchanga.tithi.paksha} Paksha, ${result.panchanga.tithi.progressPercent.toFixed(1)}% elapsed)`);
console.log(`Vara:      ${result.panchanga.vara.name} (Lord: ${result.panchanga.vara.lord})`);
console.log(`Nakshatra: ${result.panchanga.nakshatra.sanskritName} (Pada ${result.panchanga.nakshatra.pada}, Lord: ${result.panchanga.nakshatra.lord})`);
console.log(`Yoga:      ${result.panchanga.yoga.name} (Lord: ${result.panchanga.yoga.lord})`);
console.log(`Karana:    ${result.panchanga.karana.name}`);
