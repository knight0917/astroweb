import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { evaluateShashtiamsha } from "../src/engine/shashtiamsha";
import { evaluateBphsKarmicCurses, evaluateBphsBirthShantis } from "../src/engine/bphsKarmicShanti";

const birthUtc = new Date(Date.UTC(1999, 8, 17, 12, 59, 45));
const location = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };
const ephem = calculateVedicEphemeris(birthUtc, location, "Lahiri", "WholeSign", "Mean");

const curses = evaluateBphsKarmicCurses(ephem);
console.log("=== ACTIVE BPHS CURSES ===");
for (const c of curses.filter(x => x.isActive)) {
  console.log(`- ${c.name} (${c.sanskritName}) | Severity: ${c.severity} | Source: ${c.curseSource}`);
  console.log(`  Yoga: ${c.specificYogaTriggered}`);
  console.log(`  Evidence: ${c.astrologicalEvidence.join("; ")}`);
}

const shantis = evaluateBphsBirthShantis(ephem);
console.log("\n=== AFFLICTED BIRTH SHANTIS ===");
for (const s of shantis.filter(x => x.isAfflicted)) {
  console.log(`- ${s.name} (${s.sanskritName}) | Chapter: ${s.bphsChapter} | Severity: ${s.severity}`);
  console.log(`  Details: ${s.diagnosticDetails}`);
}

const d60 = evaluateShashtiamsha(ephem);
console.log("\n=== D-60 PLANETARY DEITIES ===");
for (const [p, d] of Object.entries(d60.planets)) {
  console.log(`${p.padEnd(8)}: D60 Sign: ${d.d60SignName.padEnd(12)} #${String(d.shashtiamshaNumber).padStart(2)} ${d.deityName.padEnd(20)} [${d.deityCategory}] -> ${d.sanchitaKarmaSignification}`);
}
console.log(`Ascendant: D60 Sign: ${d60.ascendantDeity?.d60SignName} #${d60.ascendantDeity?.shashtiamshaNumber} ${d60.ascendantDeity?.deityName} [${d60.ascendantDeity?.deityCategory}] -> ${d60.ascendantDeity?.sanchitaKarmaSignification}`);
