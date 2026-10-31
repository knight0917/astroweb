import * as Astronomy from "astronomy-engine";
import { generateMorningTradingBriefing, ROME_LATITUDE, ROME_LONGITUDE } from "../src/engine/morningTradingBriefing";

// Let's audit Thursday Oct 29, 2026
const brief = generateMorningTradingBriefing(2026, 10, 29);

console.log("=== VEDIC HORA CONTINUITY AUDIT FOR OCT 29, 2026 ===");
console.log("Sunrise:", brief.astronomical.sunriseRome);
console.log("Sunset: ", brief.astronomical.sunsetRome);
console.log("Dina hora len: ", brief.astronomical.dinaHoraDurationMins, "mins");
console.log("Ratri hora len:", brief.astronomical.ratriHoraDurationMins, "mins");

for (let i = 0; i < brief.hourlyRoadmapH1.length; i++) {
  const h = brief.hourlyRoadmapH1[i];
  console.log(`${h.romeTime} | Vedic Hora: ${h.vedicHora.padEnd(10)} | Clock Hora: ${h.clockHora.padEnd(10)}`);
}
