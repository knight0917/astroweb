import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { evaluateRelationshipAffairs } from "../src/engine/relationshipAffairsMaster";
import { calculateVimshottariDasha } from "../src/engine/dasha";
import { calculateJaiminiCharaDasha } from "../src/engine/jaimini";

const birthUtc = new Date(Date.UTC(1999, 8, 17, 12, 59, 45));
const location = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };
const ephem = calculateVedicEphemeris(birthUtc, location, "Lahiri", "WholeSign", "Mean");

const rel = evaluateRelationshipAffairs(ephem, "male");
console.log("Relationship Affairs Summary:");
console.log("  Love marriage likely:", rel.isLoveMarriageLikely);
console.log("  5th-7th connected D1:", rel.is5th7thConnectedD1);
console.log("  5th-7th connected D9:", rel.is5th7thConnectedD9);
console.log("  Secret 5/7/8:", rel.isSecret5th7th8thActive);
console.log("  Mars-Venus vector:", rel.isMarsVenusStrongVector);
console.log("  Executive Summary:", rel.executiveRelationshipSummary);

const dates = [
  "2014-07-01", "2015-01-01", "2015-07-01", "2016-01-01", "2016-07-01",
  "2017-01-01", "2017-07-01", "2018-01-01", "2018-07-01", "2019-01-01",
  "2019-07-01", "2020-01-01", "2020-07-01", "2021-01-01", "2021-07-01"
];

console.log("\nDasha Progression across Youth:");
for (const d of dates) {
  const dt = new Date(d + "T00:00:00Z");
  const vim = calculateVimshottariDasha(birthUtc, ephem.planets.Moon.siderealLongitude, dt);
  const chara = calculateJaiminiCharaDasha(birthUtc, ephem.ascendant.siderealLongitude, dt);
  const vStr = vim.activeDasha ? `${vim.activeDasha.mahadasha.name}-${vim.activeDasha.antardasha.name}-${vim.activeDasha.pratyantardasha?.name}` : "N/A";
  const cStr = chara.activeDasha ? `${chara.activeDasha.mahadasha.rashi.englishName}-${chara.activeDasha.antardasha.rashi.englishName}` : "N/A";
  console.log(d, "-> Vim:", vStr.padEnd(25), "| Chara:", cStr);
}
