import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateVimshottariDasha } from "../src/engine/dasha";

const birthUtc = new Date(Date.UTC(1999, 8, 17, 12, 59, 45));
const loc = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };

const checkDates = [
  { label: "Childhood Transition", date: "2003-05-18" },
  { label: "Start of Venus Dasha", date: "2010-05-18" },
  { label: "10th Board Exams", date: "2015-03-15" },
  { label: "12th Finish / College Entrance", date: "2017-06-01" },
  { label: "College Years / Peak Rahu AD", date: "2018-10-01" },
  { label: "Sade Sati End / COVID Period", date: "2020-03-01" },
  { label: "College Graduation", date: "2021-06-01" },
  { label: "Decision / Move to Italy", date: "2022-09-15" },
  { label: "Living in Italy / Saturn in 12th", date: "2023-09-01" },
  { label: "Saturn in Pisces (Lagna Transit)", date: "2025-04-01" },
  { label: "Start of Venus-Mercury (Commerce)", date: "2026-05-18" },
  { label: "Current Moment (Nov 2026)", date: "2026-11-03" },
];

const natalLagnaIdx = 11; // Pisces = 11 (0-indexed: Aries=0)
const natalMoonIdx = 7;   // Scorpio = 7

console.log("=== EXACT HOUSES FROM NATAL LAGNA (PISCES) & NATAL MOON (SCORPIO) ===");
for (const item of checkDates) {
  const d = new Date(item.date + "T12:00:00Z");
  const eph = calculateVedicEphemeris(d, loc, "Lahiri", "WholeSign", "Mean");
  const vim = calculateVimshottariDasha(birthUtc, 237.1241, d);
  const active = vim.activeDasha;

  const satSign = eph.planets.Saturn.rashi.index;
  const satFromLagna = ((satSign - natalLagnaIdx + 12) % 12) + 1;
  const satFromMoon = ((satSign - natalMoonIdx + 12) % 12) + 1;

  const jupSign = eph.planets.Jupiter.rashi.index;
  const jupFromLagna = ((jupSign - natalLagnaIdx + 12) % 12) + 1;
  const jupFromMoon = ((jupSign - natalMoonIdx + 12) % 12) + 1;

  console.log(
    `${item.date} [${item.label.padEnd(30)}]: Dasha: ${active?.mahadasha.name.padEnd(6)}-${active?.antardasha.name.padEnd(7)} | TrSat: ${eph.planets.Saturn.rashi.englishName.padEnd(11)} (Lagna H${satFromLagna}, Moon H${satFromMoon}) | TrJup: ${eph.planets.Jupiter.rashi.englishName.padEnd(11)} (Lagna H${jupFromLagna}, Moon H${jupFromMoon})`
  );
}
