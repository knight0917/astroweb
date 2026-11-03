import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateVimshottariDasha } from "../src/engine/dasha";
import { calculateJaiminiCharaDasha } from "../src/engine/jaimini";

const birthUtc = new Date(Date.UTC(1999, 8, 17, 12, 59, 45));
const loc = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };

const ephem = calculateVedicEphemeris(birthUtc, loc, "Lahiri", "WholeSign", "Mean");

const now = new Date(Date.UTC(2026, 10, 3)); // Nov 3, 2026
const vim = calculateVimshottariDasha(birthUtc, ephem.planets.Moon.siderealLongitude, now);
const chara = calculateJaiminiCharaDasha(birthUtc, ephem.ascendant.siderealLongitude, now);

console.log("=== VIMSHOTTARI DASHAS (1999 - 2027) ===");
if (vim.mahadashas) {
  for (const md of vim.mahadashas) {
    console.log(`\nMD: ${md.lord.name} (${md.startDate.toISOString().slice(0,10)} to ${md.endDate.toISOString().slice(0,10)})`);
    if (md.antardashas) {
      for (const ad of md.antardashas) {
        if (ad.endDate.getFullYear() >= 1999 && ad.startDate.getFullYear() <= 2027) {
          console.log(`   AD: ${ad.lord.name.padEnd(8)} | ${ad.startDate.toISOString().slice(0,10)} to ${ad.endDate.toISOString().slice(0,10)}`);
        }
      }
    }
  }
}

console.log("\n=== CHARA DASHAS ===");
if (chara.dashas) {
  for (const cd of chara.dashas) {
    if (cd.endDate.getFullYear() >= 1999 && cd.startDate.getFullYear() <= 2028) {
      console.log(`Chara MD: ${cd.rashi.englishName.padEnd(12)} (${cd.durationYears}y) | ${cd.startDate.toISOString().slice(0,10)} to ${cd.endDate.toISOString().slice(0,10)}`);
    }
  }
}
