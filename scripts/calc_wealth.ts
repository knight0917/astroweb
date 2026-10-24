import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateVimshottariDasha } from "../src/engine/dasha";
import { calculateJaiminiCharaDasha } from "../src/engine/jaimini";
import { calculateShodashavargaChart } from "../src/engine/shodashavarga";
import { RASHI_NAMES } from "../src/engine/constants";

const birthUtc = new Date(Date.UTC(1999, 8, 17, 12, 59, 45));
const location = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };
const ephem = calculateVedicEphemeris(birthUtc, location, "Lahiri", "WholeSign", "Mean");

// 1. Indu Lagna calculation:
// Ray values (Kala): Sun: 30, Moon: 16, Mars: 6, Mercury: 8, Jupiter: 10, Venus: 12, Saturn: 1
const KALAS: Record<string, number> = {
  Sun: 30, Moon: 16, Mars: 6, Mercury: 8, Jupiter: 10, Venus: 12, Saturn: 1
};

const ascSign = Math.floor(ephem.ascendant.siderealLongitude / 30);
const moonSign = Math.floor(ephem.planets.Moon.siderealLongitude / 30);

// 9th from Lagna lord Kala:
const ninthFromAscSign = (ascSign + 8) % 12;
const lordNinthAsc = RASHI_NAMES[ninthFromAscSign].lord;
const kalaAsc = KALAS[lordNinthAsc] || 0;

// 9th from Moon lord Kala:
const ninthFromMoonSign = (moonSign + 8) % 12;
const lordNinthMoon = RASHI_NAMES[ninthFromMoonSign].lord;
const kalaMoon = KALAS[lordNinthMoon] || 0;

const totalKala = kalaAsc + kalaMoon;
const remainder = totalKala % 12 === 0 ? 12 : totalKala % 12;
const induLagnaSignIdx = (moonSign + remainder - 1) % 12;
const induLagnaRashi = RASHI_NAMES[induLagnaSignIdx].englishName;

console.log("=== INDU LAGNA (WEALTH PROSPERITY ASCENDANT) ===");
console.log("9th from Lagna:", RASHI_NAMES[ninthFromAscSign].englishName, "ruled by", lordNinthAsc, `(Kala: ${kalaAsc})`);
console.log("9th from Moon:", RASHI_NAMES[ninthFromMoonSign].englishName, "ruled by", lordNinthMoon, `(Kala: ${kalaMoon})`);
console.log("Total Kala:", totalKala, "Remainder:", remainder);
console.log("Indu Lagna Sign:", induLagnaRashi, `(House ${((induLagnaSignIdx - ascSign + 12) % 12) + 1} from Lagna)`);

// Check occupants and aspects on Indu Lagna
Object.values(ephem.planets).forEach(p => {
  if (p.isModernPlanet || p.isUpagraha) return;
  const pSign = Math.floor(p.siderealLongitude / 30);
  if (pSign === induLagnaSignIdx) {
    console.log("  Planet in Indu Lagna:", p.name, "at", (p.siderealLongitude % 30).toFixed(2));
  }
});

// 2. D-2 Hora
const d2 = calculateShodashavargaChart(ephem, "D2", false, false);
console.log("\n=== D2 HORA CHART (WEALTH) ===");
console.log("D2 Ascendant:", d2.ascendant.vargaRashi.englishName);
for (const p of d2.entities) {
  console.log("  " + p.name.padEnd(8) + ": D2 Sign: " + RASHI_NAMES[p.vargaSignIndex].englishName);
}

// 3. Vimshottari Timeline 2026 - 2029 (Month by month / PD breakdown)
console.log("\n=== VIMSHOTTARI PRATYANTARDASHA TIMELINE (2026 - 2029) ===");
const dashaOrder = ["Mercury", "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn"];
const dashaYears: Record<string, number> = {
  Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17, Ketu: 7
};

// Venus - Mercury runs: 2026-05-18 to 2029-03-18 (total ~2.833 years)
const adYears = (20 * 17) / 120; // 2.8333 years
let curMs = new Date("2026-05-18T12:00:00Z").getTime();
const msPerYear = 365.2425 * 86400 * 1000;

for (const pd of dashaOrder) {
  const pdSpan = (adYears * dashaYears[pd]) / 120;
  const nextMs = curMs + pdSpan * msPerYear;
  console.log(("Venus-Mercury-" + pd).padEnd(25) + ": " + new Date(curMs).toISOString().slice(0, 10) + " to " + new Date(nextMs).toISOString().slice(0, 10));
  curMs = nextMs;
}
