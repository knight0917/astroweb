import { calculateVedicEphemeris } from "../src/engine/ephemeris";

console.log("=== SCANNING MOON TRANSITS FOR OCT 29 AND OCT 30, 2026 (ROME CET) ===");

let prevRashi = "";
let prevNak = "";

for (let h = 0; h <= 48; h++) {
  const dt = new Date(Date.UTC(2026, 9, 28, 23 + h, 0, 0)); // Start 00:00 CET Oct 29
  const eph = calculateVedicEphemeris(dt, { latitude: 41.9028, longitude: 12.4964, timezoneOffsetHours: 1 });
  const pM = eph.planets.Moon;
  const pS = eph.planets.Sun;
  const cetHour = h % 24;
  const cetDay = h < 24 ? 29 : 30;
  const cetDateStr = `2026-10-${cetDay} ${String(cetHour).padStart(2, "0")}:00 CET`;

  const currRashi = pM.rashi.englishName;
  const currNak = pM.nakshatra.sanskritName;

  const isTransition = (prevRashi && prevRashi !== currRashi) || (prevNak && prevNak !== currNak);

  if (h % 4 === 0 || isTransition) {
    console.log(
      `${cetDateStr} | Moon: ${currRashi.padEnd(8)} ${(pM.siderealLongitude % 30).toFixed(2).padStart(5)}° | Nak: ${currNak.padEnd(12)} p${pM.nakshatra.pada} (${pM.nakshatra.lord}) | Tithi: ${eph.panchanga.tithi.name} | Yoga: ${eph.panchanga.yoga.name}${isTransition ? " <-- TRANSITION!" : ""}`
    );
  }

  prevRashi = currRashi;
  prevNak = currNak;
}
