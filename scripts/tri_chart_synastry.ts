import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateShodashavargaChart } from "../src/engine/shodashavarga";
import { RASHI_NAMES } from "../src/engine/constants";

const c1Birth = new Date(Date.UTC(1999, 8, 17, 12, 59, 45)); // F1: 17 Sep 1999, 18:29:45, Allahabad
const c2Birth = new Date(Date.UTC(1998, 4, 24, 18, 44, 29)); // F2: 25 May 1998, 00:14:29, Allahabad
const c3Birth = new Date(Date.UTC(1999, 11, 18, 18, 18, 0));  // F3: 18 Dec 1999, 23:48:00, Bakhtiyarpur

const loc1 = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };
const loc3 = { cityName: "Bakhtiyarpur", country: "India", latitude: 25.4586, longitude: 85.5369, timezoneOffsetHours: 5.5 };

const ephem1 = calculateVedicEphemeris(c1Birth, loc1, "Lahiri", "WholeSign", "Mean");
const ephem2 = calculateVedicEphemeris(c2Birth, loc1, "Lahiri", "WholeSign", "Mean");
const ephem3 = calculateVedicEphemeris(c3Birth, loc3, "Lahiri", "WholeSign", "Mean");

console.log("=== TRI-CHART DETAILED SYNASTRY REPORT ===");
console.log("F1 Lagna:", ephem1.ascendant.rashi.englishName, `${(ephem1.ascendant.siderealLongitude % 30).toFixed(2)}°`);
console.log("F2 Lagna:", ephem2.ascendant.rashi.englishName, `${(ephem2.ascendant.siderealLongitude % 30).toFixed(2)}°`);
console.log("F3 Lagna:", ephem3.ascendant.rashi.englishName, `${(ephem3.ascendant.siderealLongitude % 30).toFixed(2)}°`);

console.log("\n--- The Aries Vortex Comparison ---");
const aries1 = Object.entries(ephem1.planets).filter(([_, p]) => p.rashi.englishName === "Aries");
const aries2 = Object.entries(ephem2.planets).filter(([_, p]) => p.rashi.englishName === "Aries");
const aries3 = Object.entries(ephem3.planets).filter(([_, p]) => p.rashi.englishName === "Aries");

console.log("F1 in Aries:", aries1.map(([n, p]) => `${n} ${(p.siderealLongitude%30).toFixed(2)}°`).join(", "));
console.log("F2 in Aries:", aries2.map(([n, p]) => `${n} ${(p.siderealLongitude%30).toFixed(2)}°`).join(", "));
console.log("F3 in Aries:", aries3.map(([n, p]) => `${n} ${(p.siderealLongitude%30).toFixed(2)}°`).join(", "));

console.log("\n--- Tight Cross-Conjunctions (< 5 degrees) ---");
const allPlanets = [
  { friend: "F1", planets: ephem1.planets },
  { friend: "F2", planets: ephem2.planets },
  { friend: "F3", planets: ephem3.planets },
];

for (let i = 0; i < 3; i++) {
  for (let j = i + 1; j < 3; j++) {
    const fA = allPlanets[i];
    const fB = allPlanets[j];
    console.log(`\nPairs: ${fA.friend} <-> ${fB.friend}`);
    for (const [nA, pA] of Object.entries(fA.planets)) {
      if (pA.isUpagraha || pA.isModernPlanet) continue;
      for (const [nB, pB] of Object.entries(fB.planets)) {
        if (pB.isUpagraha || pB.isModernPlanet) continue;
        if (pA.rashi.index === pB.rashi.index) {
          const diff = Math.abs((pA.siderealLongitude % 30) - (pB.siderealLongitude % 30));
          if (diff < 6.0) {
            console.log(`  ${fA.friend} ${nA} (${(pA.siderealLongitude%30).toFixed(2)}°) & ${fB.friend} ${nB} (${(pB.siderealLongitude%30).toFixed(2)}°) in ${pA.rashi.englishName} [Diff: ${diff.toFixed(2)}°]`);
          }
        }
      }
    }
  }
}
