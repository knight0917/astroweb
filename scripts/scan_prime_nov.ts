import * as Astronomy from "astronomy-engine";
import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateTropicalAngles } from "../src/engine/ascendant";
import { toSiderealLongitude } from "../src/engine/ayanamsha";
import { RASHI_NAMES } from "../src/engine/constants";

const TORINO_LAT = 45.0678;
const TORINO_LON = 7.6825;
const TORINO_TZ = 1;

console.log("=== SCANNING FOR PRIME TRADING MUHURTAS IN TORINO (NOV 15 - NOV 30, 2026) ===");

for (let d = 15; d <= 30; d++) {
  const dt = new Date(Date.UTC(2026, 10, d, 11, 0, 0)); // Nov d, 2026 (month 10 = Nov)
  const loc = { latitude: TORINO_LAT, longitude: TORINO_LON, timezoneOffsetHours: TORINO_TZ };
  const eph = calculateVedicEphemeris(dt, loc, "Lahiri", "WholeSign", "Mean");

  const moonSignIdx = Math.floor(eph.planets.Moon.siderealLongitude / 30);
  const hFromF1 = ((moonSignIdx - 7 + 12) % 12) + 1; // F1 Moon = Scorpio (7)
  const hFromF2 = ((moonSignIdx - 0 + 12) % 12) + 1; // F2 Moon = Aries (0)

  const badF1 = [6, 8, 12].includes(hFromF1);
  const badF2 = [6, 8, 12].includes(hFromF2);
  const chandraBala = !badF1 && !badF2;

  const currentNakIdx = Math.floor(eph.planets.Moon.siderealLongitude / (360 / 27));
  const t1 = ((currentNakIdx - 17 + 27) % 9) + 1; // F1 = Jyeshtha (17)
  const t2 = ((currentNakIdx - 1 + 27) % 9) + 1;  // F2 = Bharani (1)
  const goodTara = [2, 4, 6, 8, 9];
  const tb1 = goodTara.includes(t1);
  const tb2 = goodTara.includes(t2);

  const tithiName = eph.panchanga.tithi.name;
  const paksha = eph.panchanga.tithi.paksha;
  const nakName = eph.panchanga.nakshatra.sanskritName;
  const vara = eph.panchanga.vara.name;
  const yoga = eph.panchanga.yoga.name;

  if (chandraBala && (tb1 || tb2)) {
    console.log(
      `${dt.toISOString().slice(0, 10)} (${vara.padEnd(9)}): Moon in ${eph.planets.Moon.rashi.englishName.padEnd(11)} | Nak: ${nakName.padEnd(16)} | Tithi: ${tithiName} (${paksha}) | Yoga: ${yoga} | CB: Both YES (F1:H${hFromF1}, F2:H${hFromF2}) | TB: F1(${t1} ${tb1?'GOOD':'NO'}), F2(${t2} ${tb2?'GOOD':'NO'})`
    );
  }
}
