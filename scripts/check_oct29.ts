import * as Astronomy from "astronomy-engine";
import { calculateVedicEphemeris } from "../src/engine/ephemeris";

const TORINO_LAT = 45.0678;
const TORINO_LON = 7.6825;
const TORINO_TZ = 1;

const dt = new Date(Date.UTC(2026, 9, 29, 11, 0, 0)); // Oct 29, 2026 12:00 CET
const eph = calculateVedicEphemeris(dt, { latitude: TORINO_LAT, longitude: TORINO_LON, timezoneOffsetHours: TORINO_TZ }, "Lahiri", "WholeSign", "Mean");

console.log("=== PLANETS ON 29 OCT 2026 (12:00 CET, TORINO) ===");
for (const [name, p] of Object.entries(eph.planets)) {
  if (p.isUpagraha || p.isModernPlanet) continue;
  console.log(`${name.padEnd(8)}: ${p.rashi.englishName.padEnd(12)} ${(p.siderealLongitude % 30).toFixed(2)}° | Nak: ${p.nakshatra?.sanskritName} (${p.nakshatra?.pada}) | Retro: ${p.isRetrograde}`);
}
console.log("Panchanga:", eph.panchanga.vara.name, eph.panchanga.tithi.name, eph.panchanga.nakshatra.sanskritName, eph.panchanga.yoga.name, eph.panchanga.karana.name);
