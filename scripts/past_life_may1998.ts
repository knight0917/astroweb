import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateShodashavargaChart } from "../src/engine/shodashavarga";
import { evaluateKarmaRebirth } from "../src/engine/karmaRebirth";
import { evaluateShashtiamsha } from "../src/engine/shashtiamsha";
import { evaluateBphsKarmicCurses, evaluateBphsBirthShantis } from "../src/engine/bphsKarmicShanti";
import { calculateJaiminiKarakas, analyzeKarakamsha } from "../src/engine/jaimini";
import { RASHI_NAMES } from "../src/engine/constants";

// 25 May 1998, 00:14:29 IST
// UTC: 1998-05-24 18:44:29 UTC
const birthUtc = new Date(Date.UTC(1998, 4, 24, 18, 44, 29)); // month is 0-indexed: May = 4
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

const d9 = calculateShodashavargaChart(ephem, "D9", false, false);
console.log("\n=== D9 NAVAMSHA ===");
console.log("D9 Ascendant:", RASHI_NAMES[d9.ascendant.vargaSignIndex].englishName);
for (const p of d9.entities) {
  console.log(`${p.name.padEnd(8)}: D9 Sign: ${RASHI_NAMES[p.vargaSignIndex].englishName.padEnd(12)} House: ${p.house} Dignity: ${p.dignity}`);
}

const d60 = calculateShodashavargaChart(ephem, "D60", false, false);
console.log("\n=== D60 SHASHTIAMSHA ===");
console.log("D60 Ascendant Sign Index:", d60.ascendant.vargaSignIndex, RASHI_NAMES[d60.ascendant.vargaSignIndex].englishName);
for (const p of d60.entities) {
  console.log(`${p.name.padEnd(8)}: D60 Sign: ${RASHI_NAMES[p.vargaSignIndex].englishName.padEnd(12)} House: ${p.house} Dignity: ${p.dignity}`);
}

console.log("\n=== KARMA REBIRTH REPORT ===");
const karma = evaluateKarmaRebirth(ephem);
console.log(JSON.stringify(karma, null, 2));

console.log("\n=== SHASHTIAMSHA EVALUATION ===");
const d60Eval = evaluateShashtiamsha(ephem);
for (const [p, d] of Object.entries(d60Eval.planets)) {
  console.log(`${p.padEnd(8)}: D60 Sign: ${d.d60SignName.padEnd(12)} #${String(d.shashtiamshaNumber).padStart(2)} ${d.deityName.padEnd(20)} [${d.deityCategory}] -> ${d.sanchitaKarmaSignification}`);
}

console.log("\n=== BPHS KARMIC CURSES ===");
const curses = evaluateBphsKarmicCurses(ephem);
for (const c of curses.filter(x => x.isActive)) {
  console.log(`- ${c.name} (${c.sanskritName}) | Severity: ${c.severity} | Source: ${c.curseSource}`);
  console.log(`  Yoga: ${c.specificYogaTriggered}`);
  console.log(`  Evidence: ${c.astrologicalEvidence.join("; ")}`);
}

console.log("\n=== BPHS BIRTH SHANTIS ===");
const shantis = evaluateBphsBirthShantis(ephem);
for (const s of shantis.filter(x => x.isAfflicted)) {
  console.log(`- ${s.name} (${s.sanskritName}) | Chapter: ${s.bphsChapter} | Severity: ${s.severity}`);
  console.log(`  Details: ${s.diagnosticDetails}`);
}

console.log("\n=== JAIMINI KARAKAS ===");
const karakas = calculateJaiminiKarakas(ephem);
console.log("Atmakaraka (AK):", karakas.atmakaraka.planetName, `${karakas.atmakaraka.degreesInSign.toFixed(4)}°`, karakas.atmakaraka.rashi.englishName);
console.log("Amatyakaraka (AmK):", karakas.amatyakaraka.planetName, `${karakas.amatyakaraka.degreesInSign.toFixed(4)}°`, karakas.amatyakaraka.rashi.englishName);
for (const k of karakas.karakas) {
  console.log(`${k.code.padEnd(4)}: ${k.planetName.padEnd(8)} ${k.degreesInSign.toFixed(4)}° ${k.rashi.englishName.padEnd(12)} ${k.name} (${k.signification})`);
}

console.log("\n=== KARAKAMSHA ANALYSIS ===");
const kAnalysis = analyzeKarakamsha(ephem);
console.log(JSON.stringify(kAnalysis, null, 2));
