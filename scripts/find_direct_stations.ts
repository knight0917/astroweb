import { calculateVedicEphemeris } from "../src/engine/ephemeris";

console.log("=== SCANNING FOR PLANETARY DIRECT STATIONS & RECOVERY (NOV 2026) ===");

for (let d = 29; d <= 70; d++) {
  const dt = new Date(Date.UTC(2026, 9, d, 11, 0, 0));
  const eph = calculateVedicEphemeris(dt, { latitude: 45.0678, longitude: 7.6825, timezoneOffsetHours: 1 }, "Lahiri", "WholeSign", "Mean");

  const mercRetro = eph.planets.Mercury.isRetrograde;
  const venRetro = eph.planets.Venus.isRetrograde;
  const jupDeg = (eph.planets.Jupiter.siderealLongitude % 30).toFixed(2);
  const jupSign = eph.planets.Jupiter.rashi.englishName;

  if (d % 3 === 0 || !mercRetro || !venRetro) {
    console.log(
      `${dt.toISOString().slice(0, 10)}: Mercury Retro=${mercRetro} (${eph.planets.Mercury.rashi.englishName} ${(eph.planets.Mercury.siderealLongitude%30).toFixed(1)}°) | Venus Retro=${venRetro} (${eph.planets.Venus.rashi.englishName} ${(eph.planets.Venus.siderealLongitude%30).toFixed(1)}°) | Jupiter in ${jupSign} ${jupDeg}°`
    );
  }
}
