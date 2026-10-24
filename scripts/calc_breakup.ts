import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateVimshottariDasha } from "../src/engine/dasha";
import { calculateJaiminiCharaDasha } from "../src/engine/jaimini";

const birthUtc = new Date(Date.UTC(1999, 8, 17, 12, 59, 45));
const location = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };
const ephem = calculateVedicEphemeris(birthUtc, location, "Lahiri", "WholeSign", "Mean");

const testDates = [
  "2019-11-01", "2019-12-15", "2020-02-15", "2020-04-15", "2020-06-15",
  "2020-09-15", "2020-11-15", "2021-03-15", "2021-06-15", "2021-09-15",
  "2022-02-15", "2022-06-15"
];

for (const d of testDates) {
  const dt = new Date(d + "T00:00:00Z");
  const vim = calculateVimshottariDasha(birthUtc, ephem.planets.Moon.siderealLongitude, dt);
  const chara = calculateJaiminiCharaDasha(birthUtc, ephem.ascendant.siderealLongitude, dt);
  const v = vim.activeDasha ? `${vim.activeDasha.mahadasha.name}-${vim.activeDasha.antardasha.name}-${vim.activeDasha.pratyantardasha?.name}` : "";
  const c = chara.activeDasha ? `${chara.activeDasha.mahadasha.rashi.englishName}-${chara.activeDasha.antardasha.rashi.englishName}` : "";
  console.log(d, "-> Vim:", v.padEnd(25), "| Chara:", c);
}
