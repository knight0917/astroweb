import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateShodashavargaChart } from "../src/engine/shodashavarga";
import { RASHI_NAMES } from "../src/engine/constants";

const c1Birth = new Date(Date.UTC(1999, 8, 17, 12, 59, 45));
const c2Birth = new Date(Date.UTC(1998, 4, 24, 18, 44, 29));
const loc = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };

const ephem1 = calculateVedicEphemeris(c1Birth, loc, "Lahiri", "WholeSign", "Mean");
const ephem2 = calculateVedicEphemeris(c2Birth, loc, "Lahiri", "WholeSign", "Mean");

const d9_1 = calculateShodashavargaChart(ephem1, "D9", false, false);
const d9_2 = calculateShodashavargaChart(ephem2, "D9", false, false);

console.log("=== NAVAMSHA (D-9) OVERLAY ===");
console.log("C1 D9 Lagna:", RASHI_NAMES[d9_1.ascendant.vargaSignIndex].englishName);
console.log("C2 D9 Lagna:", RASHI_NAMES[d9_2.ascendant.vargaSignIndex].englishName);

console.log("\nC1 D9 Planets:");
for (const p of d9_1.entities) {
  console.log(`C1 ${p.name.padEnd(8)}: D9 Sign = ${RASHI_NAMES[p.vargaSignIndex].englishName.padEnd(12)} (House ${p.house})`);
}

console.log("\nC2 D9 Planets:");
for (const p of d9_2.entities) {
  console.log(`C2 ${p.name.padEnd(8)}: D9 Sign = ${RASHI_NAMES[p.vargaSignIndex].englishName.padEnd(12)} (House ${p.house})`);
}

console.log("\n=== CROSS NAVAMSHA CONJUNCTIONS (Same D9 Sign) ===");
for (const p1 of d9_1.entities) {
  for (const p2 of d9_2.entities) {
    if (p1.vargaSignIndex === p2.vargaSignIndex) {
      console.log(`C1 ${p1.name} & C2 ${p2.name} in D9 ${RASHI_NAMES[p1.vargaSignIndex].englishName}`);
    }
  }
}

console.log("\n=== D1 TO D9 CROSS OVERLAYS (Rashi Tulya Navamsha) ===");
// Where do C1 D1 planets fall in C2 D9, and vice versa?
for (const [name, p] of Object.entries(ephem1.planets)) {
  if (p.isUpagraha || p.isModernPlanet) continue;
  const sIdx = p.rashi.index;
  const matchD9_2 = d9_2.entities.filter(e => e.vargaSignIndex === sIdx);
  if (matchD9_2.length > 0) {
    console.log(`C1 D1 ${name} in ${p.rashi.englishName} matches C2 D9: ${matchD9_2.map(e => e.name).join(", ")}`);
  }
}

for (const [name, p] of Object.entries(ephem2.planets)) {
  if (p.isUpagraha || p.isModernPlanet) continue;
  const sIdx = p.rashi.index;
  const matchD9_1 = d9_1.entities.filter(e => e.vargaSignIndex === sIdx);
  if (matchD9_1.length > 0) {
    console.log(`C2 D1 ${name} in ${p.rashi.englishName} matches C1 D9: ${matchD9_1.map(e => e.name).join(", ")}`);
  }
}
