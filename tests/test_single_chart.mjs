import { calculateVedicEphemeris } from "../src/engine/ephemeris.ts";

const loc = {
  cityName: "Patna",
  country: "India",
  latitude: 25.5941,
  longitude: 85.1376,
  timezoneOffsetHours: 5.5,
};

// 25 May 1998, 14:35 IST -> 1998-05-25T09:05:00.000Z
const dt = new Date("1998-05-25T09:05:00.000Z");
const ephem = calculateVedicEphemeris(dt, loc, "Lahiri", "WholeSign", "Mean");

console.log("=== 25/05/1998 14:35 PATNA ASTRO DATA ===");
console.log("Ascendant (Lagna):", ephem.ascendant.rashi.englishName, (ephem.ascendant.siderealLongitude % 30).toFixed(2) + "°");
console.log("Moon Sign (Janma Rashi):", ephem.planets.Moon.rashi.englishName, (ephem.planets.Moon.siderealLongitude % 30).toFixed(2) + "°");
console.log("Moon Nakshatra:", ephem.planets.Moon.nakshatra.sanskritName, "Pada", ephem.planets.Moon.nakshatra.pada);
console.log("Moon Nakshatra Lord:", ephem.planets.Moon.nakshatra.lord);
console.log("Sun Sign:", ephem.planets.Sun.rashi.englishName, (ephem.planets.Sun.siderealLongitude % 30).toFixed(2) + "°");
console.log("Sun Nakshatra:", ephem.planets.Sun.nakshatra.sanskritName, "Pada", ephem.planets.Sun.nakshatra.pada);
console.log("All Planets:");
Object.entries(ephem.planets).forEach(([k, v]) => {
  console.log(`  ${k}: House ${v.house}, ${v.rashi.englishName} ${(v.siderealLongitude % 30).toFixed(2)}°, Nakshatra: ${v.nakshatra.sanskritName} Pada ${v.nakshatra.pada}`);
});
