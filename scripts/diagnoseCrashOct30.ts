import * as Astronomy from "astronomy-engine";
import { calculateVedicEphemeris } from "../src/engine/ephemeris";

console.log("=== DEEP DIAGNOSTIC OF 30 OCT 2026 CRASH ===");

const dt = new Date(Date.UTC(2026, 9, 30, 11, 0, 0)); // 12:00 CET
const eph = calculateVedicEphemeris(dt, { latitude: 41.9028, longitude: 12.4964, timezoneOffsetHours: 1 });

console.log("Sun:", eph.planets.Sun.siderealLongitude.toFixed(3), "Libra", eph.planets.Sun.nakshatra.sanskritName, "pada", eph.planets.Sun.nakshatra.pada);
console.log("Moon:", eph.planets.Moon.siderealLongitude.toFixed(3), "Gemini", eph.planets.Moon.nakshatra.sanskritName, "pada", eph.planets.Moon.nakshatra.pada);
console.log("Mars:", eph.planets.Mars.siderealLongitude.toFixed(3), "Cancer", eph.planets.Mars.nakshatra.sanskritName, "pada", eph.planets.Mars.nakshatra.pada);
console.log("Mercury:", eph.planets.Mercury.siderealLongitude.toFixed(3), "Libra", eph.planets.Mercury.nakshatra.sanskritName, "Speed:", eph.planets.Mercury.speed);
console.log("Jupiter:", eph.planets.Jupiter.siderealLongitude.toFixed(3), "Cancer", eph.planets.Jupiter.nakshatra.sanskritName);
console.log("Venus:", eph.planets.Venus.siderealLongitude.toFixed(3), "Libra", eph.planets.Venus.nakshatra.sanskritName, "Speed:", eph.planets.Venus.speed);
console.log("Saturn:", eph.planets.Saturn.siderealLongitude.toFixed(3), "Pisces", eph.planets.Saturn.nakshatra.sanskritName);
console.log("Rahu:", eph.planets.Rahu.siderealLongitude.toFixed(3), "Aquarius");
console.log("Ketu:", eph.planets.Ketu.siderealLongitude.toFixed(3), "Leo");

// Calculate planetary aspects and mutual kendras
console.log("\n--- Mutual Angles (Aspects) ---");
const pNames = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu"];
for (let i = 0; i < pNames.length; i++) {
  for (let j = i + 1; j < pNames.length; j++) {
    const p1 = (eph.planets as any)[pNames[i]].siderealLongitude;
    const p2 = (eph.planets as any)[pNames[j]].siderealLongitude;
    let diff = Math.abs(p1 - p2);
    if (diff > 180) diff = 360 - diff;
    if (diff < 5 || (diff >= 85 && diff <= 95) || (diff >= 115 && diff <= 125) || (diff >= 175 && diff <= 185)) {
      console.log(`${pNames[i]} - ${pNames[j]}: ${diff.toFixed(2)}° aspect!`);
    }
  }
}

// Check Jupiter Sandhi (Gandanta / Sign boundary)
console.log("\nJupiter at Cancer:", (eph.planets.Jupiter.siderealLongitude % 30).toFixed(3), "° (Sign boundary is 30.00°!)");
console.log("Is Jupiter in Gandanta/Rashi Sandhi? Degree:", (eph.planets.Jupiter.siderealLongitude % 30).toFixed(3));
