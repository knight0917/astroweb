import { calculateVedicEphemeris } from "../src/engine/ephemeris";

const dUtc = new Date(Date.UTC(2026, 9, 22, 10, 0, 0));
const eph = calculateVedicEphemeris(dUtc, { latitude: 41.9, longitude: 12.5, timezoneOffsetHours: 2 });

console.log("=== PLANETARY DIGNITIES & POSITIONS ON 22 OCT 2026 ===");
for (const [name, p] of Object.entries(eph.planets)) {
  console.log(
    `${name.padEnd(8)}: Rashi=${p.rashi.englishName.padEnd(12)} DegInSign=${p.rashi.degreesInSign.toFixed(2)} Rx=${p.isRetrograde}`
  );
}

const sunDeg = eph.planets.Sun.rashi.degreesInSign + (eph.planets.Sun.rashi.number - 1) * 30;
const marsDeg = eph.planets.Mars.rashi.degreesInSign + (eph.planets.Mars.rashi.number - 1) * 30;
const diffSunMars = Math.abs(sunDeg - marsDeg);
console.log(`\nSun Longitude: ${sunDeg.toFixed(2)} deg, Mars Longitude: ${marsDeg.toFixed(2)} deg`);
console.log(`Sun-Mars angular separation: ${diffSunMars.toFixed(2)} deg (Square = 90 deg)`);

const venDeg = eph.planets.Venus.rashi.degreesInSign + (eph.planets.Venus.rashi.number - 1) * 30;
console.log(`Sun-Venus separation: ${Math.abs(sunDeg - venDeg).toFixed(2)} deg`);
