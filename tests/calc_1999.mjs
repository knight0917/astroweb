import * as Astronomy from "astronomy-engine";
import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { formatDMS } from "../src/engine/rashiNakshatra";

// Date: 17 Sep 1999 18:32 IST -> 13:02 UTC
const date = new Date(Date.UTC(1999, 8, 17, 13, 2, 0)); // month 8 = September

const allahabad = {
  cityName: "Allahabad (Prayagraj), India",
  latitude: 25.4358,
  longitude: 81.8463,
  elevation: 98,
  timezoneOffsetHours: 5.5,
};

const result = calculateVedicEphemeris(date, allahabad, "Lahiri", "WholeSign", "Mean");

console.log("=========================================================================================");
console.log("VEDIC HOROSCOPE & EPHEMERIS FOR: 17 SEPTEMBER 1999, 18:32 IST");
console.log(`Place: ${allahabad.cityName} (Lat: 25.4358° N, Lon: 81.8463° E)`);
console.log(`Lahiri (Chitrapaksha) Ayanamsha: ${formatDMS(result.ayanamshaValue)} (${result.ayanamshaValue.toFixed(5)}°)`);
console.log("=========================================================================================\n");

console.log("BODY       | SIDEREAL LONGITUDE | RASHI (ZODIAC)   | DEGREES IN SIGN  | NAKSHATRA & PADA     | LORD    | HOUSE | STATUS");
console.log("-----------+--------------------+------------------+------------------+----------------------+---------+-------+--------");

// Ascendant (Lagna)
const asc = result.ascendant;
console.log(
  `${"Lagna".padEnd(10)} | ${formatDMS(asc.siderealLongitude).padEnd(18)} | ${asc.rashi.sanskritName.padEnd(16)} | ${formatDMS(asc.rashi.degreesInSign).padEnd(16)} | ${(asc.nakshatra.sanskritName + " P" + asc.nakshatra.pada).padEnd(20)} | ${asc.nakshatra.lord.padEnd(7)} | ${("H" + asc.house).padEnd(5)} | Rising`
);

// Planets
for (const [name, p] of Object.entries(result.planets)) {
  const nakStr = `${p.nakshatra.sanskritName} P${p.nakshatra.pada}`;
  const status = p.isRetrograde ? "Retrograde (R)" : "Direct (D)";
  console.log(
    `${name.padEnd(10)} | ${formatDMS(p.siderealLongitude).padEnd(18)} | ${p.rashi.sanskritName.padEnd(16)} | ${formatDMS(p.rashi.degreesInSign).padEnd(16)} | ${nakStr.padEnd(20)} | ${p.nakshatra.lord.padEnd(7)} | ${("H" + p.house).padEnd(5)} | ${status}`
  );
}

console.log("\n--- UPAGRAHAS (SPECIAL VEDIC POINTS) ---");
console.log("UPAGRAHA         | RASHI            | DEG IN SIGN      | NAKSHATRA & PADA     | HOUSE");
console.log("-----------------+------------------+------------------+----------------------+-------");
for (const u of Object.values(result.upagrahas)) {
  const nakStr = `${u.nakshatra.sanskritName} P${u.nakshatra.pada}`;
  console.log(
    `${u.name.padEnd(16)} | ${u.rashi.sanskritName.padEnd(16)} | ${formatDMS(u.rashi.degreesInSign).padEnd(16)} | ${nakStr.padEnd(20)} | H${u.house}`
  );
}

console.log("\n--- PANCHANGA DETAILS (17 SEP 1999 18:32 IST) ---");
console.log(`Tithi:     ${result.panchanga.tithi.name} (${result.panchanga.tithi.paksha} Paksha, ${result.panchanga.tithi.progressPercent.toFixed(1)}% elapsed)`);
console.log(`Vara:      ${result.panchanga.vara.name} (Friday, Lord: ${result.panchanga.vara.lord})`);
console.log(`Nakshatra: ${result.panchanga.nakshatra.sanskritName} (Pada ${result.panchanga.nakshatra.pada}, Lord: ${result.panchanga.nakshatra.lord})`);
console.log(`Yoga:      ${result.panchanga.yoga.name}`);
console.log(`Karana:    ${result.panchanga.karana.name}`);
