import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateShodashavargaChart } from "../src/engine/shodashavarga";
import { evaluateKarmaRebirth } from "../src/engine/karmaRebirth";
import { evaluateShashtiamsha } from "../src/engine/shashtiamsha";
import { evaluateBphsKarmicCurses, evaluateBphsBirthShantis, synthesizeBphsKarmicShanti } from "../src/engine/bphsKarmicShanti";
import { calculateJaiminiKarakas, analyzeKarakamsha } from "../src/engine/jaimini";

const birthUtc = new Date(Date.UTC(1999, 8, 17, 12, 59, 45));
const location = {
  cityName: "Allahabad",
  country: "India",
  latitude: 25.4358,
  longitude: 81.8463,
  elevation: 98,
  timezoneOffsetHours: 5.5,
};

const ephem = calculateVedicEphemeris(birthUtc, location, "Lahiri", "WholeSign", "Mean");

console.log("=== NATAL D1 ===");
console.log("Ascendant:", ephem.ascendant.rashi.englishName, `${(ephem.ascendant.siderealLongitude % 30).toFixed(4)}°`, ephem.ascendant.nakshatra?.sanskritName, "pada", ephem.ascendant.nakshatra?.pada);

for (const [name, p] of Object.entries(ephem.planets)) {
  if (p.isUpagraha || p.isModernPlanet) continue;
  console.log(`${name.padEnd(8)}: H${p.house} ${p.rashi.englishName.padEnd(12)} ${(p.siderealLongitude % 30).toFixed(4)}° Nakshatra: ${p.nakshatra?.sanskritName} Pada: ${p.nakshatra?.pada} Retro: ${p.isRetrograde}`);
}

console.log("\n=== KARMA REBIRTH REPORT ===");
const karma = evaluateKarmaRebirth(ephem);
console.log(JSON.stringify(karma, null, 2));

console.log("\n=== SHASHTIAMSHA EVALUATION ===");
const d60Eval = evaluateShashtiamsha(ephem);
console.log(JSON.stringify(d60Eval, null, 2));

console.log("\n=== BPHS KARMIC CURSES ===");
const curses = evaluateBphsKarmicCurses(ephem);
console.log("Active curses:", JSON.stringify(curses.filter(c => c.isActive), null, 2));

console.log("\n=== BPHS BIRTH SHANTIS ===");
const shantis = evaluateBphsBirthShantis(ephem);
console.log("Afflicted shantis:", JSON.stringify(shantis.filter(s => s.isAfflicted), null, 2));

console.log("\n=== JAIMINI KARAKAS ===");
const karakas = calculateJaiminiKarakas(ephem);
console.log("Atmakaraka (AK):", karakas.atmakaraka);
console.log("Amatyakaraka (AmK):", karakas.amatyakaraka);
console.log("All Karakas:", karakas.karakas);

console.log("\n=== KARAKAMSHA ANALYSIS ===");
const kAnalysis = analyzeKarakamsha(ephem);
console.log(JSON.stringify(kAnalysis, null, 2));
