import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateShodashavargaChart } from "../src/engine/shodashavarga";
import { calculateJaiminiKarakas } from "../src/engine/jaimini";

const c1Birth = new Date(Date.UTC(1999, 8, 17, 12, 59, 45));
const c2Birth = new Date(Date.UTC(1998, 4, 24, 18, 44, 29));
const loc = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };

const ephem1 = calculateVedicEphemeris(c1Birth, loc, "Lahiri", "WholeSign", "Mean");
const ephem2 = calculateVedicEphemeris(c2Birth, loc, "Lahiri", "WholeSign", "Mean");

const d9_1 = calculateShodashavargaChart(ephem1, "D9", false, false);
const d9_2 = calculateShodashavargaChart(ephem2, "D9", false, false);

console.log("=== CROSS-CHART PLANETARY OVERLAYS ===");
console.log("Chart 1 Lagna:", ephem1.ascendant.rashi.englishName, `${(ephem1.ascendant.siderealLongitude % 30).toFixed(2)}°`);
console.log("Chart 2 Lagna:", ephem2.ascendant.rashi.englishName, `${(ephem2.ascendant.siderealLongitude % 30).toFixed(2)}°`);

console.log("\n--- Chart 1 Planets in Chart 2 Houses & Signs ---");
for (const [name, p] of Object.entries(ephem1.planets)) {
  if (p.isUpagraha || p.isModernPlanet) continue;
  const c2House = ((Math.floor(p.siderealLongitude / 30) - Math.floor(ephem2.ascendant.siderealLongitude / 30) + 12) % 12) + 1;
  console.log(`C1 ${name.padEnd(8)} at ${p.rashi.englishName.padEnd(12)} ${(p.siderealLongitude % 30).toFixed(2)}° -> Falls in C2 House ${c2House}`);
}

console.log("\n--- Chart 2 Planets in Chart 1 Houses & Signs ---");
for (const [name, p] of Object.entries(ephem2.planets)) {
  if (p.isUpagraha || p.isModernPlanet) continue;
  const c1House = ((Math.floor(p.siderealLongitude / 30) - Math.floor(ephem1.ascendant.siderealLongitude / 30) + 12) % 12) + 1;
  console.log(`C2 ${name.padEnd(8)} at ${p.rashi.englishName.padEnd(12)} ${(p.siderealLongitude % 30).toFixed(2)}° -> Falls in C1 House ${c1House}`);
}

console.log("\n--- CONJUNCTIONS BETWEEN C1 & C2 (within same sign) ---");
for (const [n1, p1] of Object.entries(ephem1.planets)) {
  if (p1.isUpagraha || p1.isModernPlanet) continue;
  for (const [n2, p2] of Object.entries(ephem2.planets)) {
    if (p2.isUpagraha || p2.isModernPlanet) continue;
    if (p1.rashi.index === p2.rashi.index) {
      const diff = Math.abs(p1.siderealLongitude - p2.siderealLongitude);
      console.log(`C1 ${n1} & C2 ${n2} in ${p1.rashi.englishName}: C1=${(p1.siderealLongitude%30).toFixed(2)}°, C2=${(p2.siderealLongitude%30).toFixed(2)}° (Diff: ${diff.toFixed(2)}°)`);
    }
  }
}
