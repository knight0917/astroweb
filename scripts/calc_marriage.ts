import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateDoubleTransit } from "../src/engine/doubleTransit";
import { calculateVimshottariDasha } from "../src/engine/dasha";
import { calculateJaiminiCharaDasha } from "../src/engine/jaimini";

const birthUtc = new Date(Date.UTC(1999, 8, 17, 12, 59, 45));
const location = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };
const ephem = calculateVedicEphemeris(birthUtc, location, "Lahiri", "WholeSign", "Mean");

console.log("=== MARRIAGE TIMING ANALYSIS (2026 - 2031) ===");

for (let y = 2026; y <= 2031; y++) {
  for (let m = 1; m <= 12; m += 3) {
    const dt = new Date(Date.UTC(y, m - 1, 15));
    const trEphem = calculateVedicEphemeris(dt, location, "Lahiri", "WholeSign", "Mean");
    const dtReport = calculateDoubleTransit(ephem, trEphem);
    const vim = calculateVimshottariDasha(birthUtc, ephem.planets.Moon.siderealLongitude, dt);
    const chara = calculateJaiminiCharaDasha(birthUtc, ephem.ascendant.siderealLongitude, dt);

    const vStr = vim.activeDasha ? `${vim.activeDasha.mahadasha.name}-${vim.activeDasha.antardasha.name}-${vim.activeDasha.pratyantardasha?.name}` : "";
    const cStr = chara.activeDasha ? `${chara.activeDasha.mahadasha.rashi.englishName}-${chara.activeDasha.antardasha.rashi.englishName}` : "";

    const satH = trEphem.planets.Saturn.house;
    const jupH = trEphem.planets.Jupiter.house;

    const marTrigger = dtReport.milestones["marriage"];

    console.log(
      dt.toISOString().slice(0, 10),
      "| Vim:", vStr.padEnd(25),
      "| Chara:", cStr.padEnd(20),
      `| TrSat H${satH} (${trEphem.planets.Saturn.rashi.englishName.padEnd(11)})`,
      `| TrJup H${jupH} (${trEphem.planets.Jupiter.rashi.englishName.padEnd(11)})`,
      marTrigger ? `| M-Score: ${(marTrigger as any).probabilityScore}% (${marTrigger.timingWindow})` : ""
    );
  }
}
