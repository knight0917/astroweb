import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateVimshottariDasha } from "../src/engine/dasha";

const birthUtc = new Date(Date.UTC(1999, 8, 17, 12, 59, 45));
const loc = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };

const checkDates = [
  "2014-11-02", // Saturn enters Scorpio (Peak Sade Sati)
  "2017-06-01", // End of high school / 12th
  "2017-10-26", // Saturn enters Sagittarius (final phase of Sade Sati)
  "2020-01-24", // Saturn enters Capricorn (Sade Sati ends!)
  "2021-06-01", // College graduation era
  "2022-10-01", // Preparation / Move to Italy
  "2023-01-17", // Saturn enters Aquarius (12th house of Foreign Lands)
  "2023-03-18", // Venus-Saturn start
  "2024-05-01", // Jupiter enters Taurus
  "2025-03-29", // Saturn enters Pisces (Lagna!)
  "2026-05-18", // Venus-Mercury start
  "2026-11-03", // Today
];

console.log("=== TRANSITS & DETAILED TIMELINE CHECK ===");
for (const dStr of checkDates) {
  const d = new Date(dStr + "T12:00:00Z");
  const eph = calculateVedicEphemeris(d, loc, "Lahiri", "WholeSign", "Mean");
  const vim = calculateVimshottariDasha(birthUtc, 237.1241, d);
  const active = vim.activeDasha;
  const satH = eph.planets.Saturn.house;
  const jupH = eph.planets.Jupiter.house;
  const rahuH = eph.planets.Rahu.house;

  console.log(
    `${dStr}: Dasha = ${active?.mahadasha.name}-${active?.antardasha.name}-${active?.pratyantardasha?.name} | TrSat H${satH} (${eph.planets.Saturn.rashi.englishName}) | TrJup H${jupH} (${eph.planets.Jupiter.rashi.englishName}) | TrRahu H${rahuH} (${eph.planets.Rahu.rashi.englishName})`
  );
}
