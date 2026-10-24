import { calculateVedicEphemeris } from "../src/engine/ephemeris.ts";
import { calculateInduLagna } from "../src/engine/samirTripathiSuite.ts";
import { calculateJaiminiKarakas } from "../src/engine/jaimini.ts";
import { calculateVimshottariDasha } from "../src/engine/dasha.ts";
import { calculateAllLagnas } from "../src/engine/allLagnas.ts";

// Date: 17/09/1999 18:29:45 Allahabad (Prayagraj)
// 18:29:45 IST (UTC+5.5) -> 12:59:45 UTC
const d = new Date("1999-09-17T12:59:45Z");
const loc = {
  cityName: "Allahabad",
  country: "India",
  latitude: 25.4358,
  longitude: 81.8463,
  timezoneOffsetHours: 5.5,
};

const eph = calculateVedicEphemeris(d, loc, "Lahiri", "WholeSign", "Mean");

console.log("=== ASCENDANT & HOUSES ===");
console.log("Ascendant:", eph.ascendant.rashi.englishName, `(${(eph.ascendant.siderealLongitude % 30).toFixed(2)}°)`, "Nakshatra:", eph.ascendant.nakshatra.sanskritName, "Pada:", eph.ascendant.nakshatra.pada);

console.log("\n=== PLANETARY POSITIONS (D1) ===");
for (const p of Object.values(eph.planets)) {
  console.log(`${p.name.padEnd(8)}: House ${String(p.house).padStart(2)} in ${p.rashi.englishName.padEnd(11)} (${(p.siderealLongitude % 30).toFixed(2).padStart(5)}°) Nak: ${p.nakshatra.sanskritName.padEnd(14)} P${p.nakshatra.pada} ${p.isRetrograde ? "[R]" : "   "} Lord: ${p.rashi.lord}`);
}

const indu = calculateInduLagna(eph);
console.log("\n=== SPECIAL POINTS ===");
console.log("Indu Lagna (IL): House", indu.induLagnaHouseFromD1, "in", indu.induLagnaSign);

const jaimini = calculateJaiminiKarakas(eph);
console.log("Atmakaraka (AK):", jaimini.atmakaraka?.name);
console.log("Amatyakaraka (AmK):", jaimini.amatyakaraka?.name);

const lagnas = calculateAllLagnas(eph);
const al = lagnas.find(l => l.code === "AL");
console.log("Arudha Lagna (AL): House", al?.house, "in", al?.rashi.englishName);

const dashaRes = calculateVimshottariDasha(d, eph.planets.Moon.siderealLongitude, new Date());
console.log("\n=== ACTIVE DASHA FOR CURRENT TIME (OCT 2026) ===");
if (dashaRes.activeDasha) {
  const ad = dashaRes.activeDasha;
  console.log("Active Mahadasha:", ad.mahadasha.name, "from", ad.mdStart.toISOString().slice(0, 10), "to", ad.mdEnd.toISOString().slice(0, 10));
  console.log("Active Antardasha:", ad.antardasha.name, "from", ad.adStart.toISOString().slice(0, 10), "to", ad.adEnd.toISOString().slice(0, 10));
  console.log("Active Pratyantardasha:", ad.pratyantardasha.name, "from", ad.pdStart.toISOString().slice(0, 10), "to", ad.pdEnd.toISOString().slice(0, 10));
}

// Check D9 Navamsha placements
console.log("\n=== D9 NAVAMSHA PLACEMENTS ===");
function getNavamshaRashi(lon) {
  const norm = ((lon % 360) + 360) % 360;
  const navIdx = Math.floor(norm / (30 / 9)) % 12;
  const RASHIS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  return RASHIS[navIdx];
}

console.log("D9 Lagna:", getNavamshaRashi(eph.ascendant.siderealLongitude));
for (const p of Object.values(eph.planets)) {
  console.log(`${p.name.padEnd(8)}: D9 ${getNavamshaRashi(p.siderealLongitude)}`);
}
