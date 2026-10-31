import * as Astronomy from "astronomy-engine";
import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateTropicalAngles } from "../src/engine/ascendant";
import { toSiderealLongitude } from "../src/engine/ayanamsha";
import { RASHI_NAMES, NAKSHATRAS } from "../src/engine/constants";

const TORINO_LAT = 45.0678;
const TORINO_LON = 7.6825;
const TORINO_TZ = 1; // CET (UTC+1)

// Friend 1: Moon Scorpio 27.12° (Jyeshtha 4), Lagna Pisces 9.99°
// Friend 2: Moon Aries 25.21° (Bharani 4), Lagna Aquarius 2.98°

console.log("=== SCANNING DAYS FROM OCT 29 TO NOV 08, 2026 (TORINO, ITALY) ===");

for (let d = 29; d <= 38; d++) {
  const dateObj = new Date(Date.UTC(2026, 9, d, 11, 0, 0)); // 12:00 CET = 11:00 UTC
  const loc = { latitude: TORINO_LAT, longitude: TORINO_LON, timezoneOffsetHours: TORINO_TZ };
  const eph = calculateVedicEphemeris(dateObj, loc, "Lahiri", "WholeSign", "Mean");

  const dayStr = dateObj.toISOString().slice(0, 10);
  const moonRashi = eph.planets.Moon.rashi.englishName;
  const moonDeg = (eph.planets.Moon.siderealLongitude % 30).toFixed(2);
  const nak = eph.panchanga.nakshatra.sanskritName;
  const tithi = eph.panchanga.tithi.name + " (" + eph.panchanga.tithi.paksha + " #" + eph.panchanga.tithi.number + ")";
  const vara = eph.panchanga.vara.name;
  const yoga = eph.panchanga.yoga.name;
  const karana = eph.panchanga.karana.name;

  // Chandra Bala check:
  // F1 Moon is Scorpio (idx 7). Favorable: 1, 3, 6, 7, 10, 11 from Scorpio -> signs: Scorpio(1), Capricorn(3), Aries(6-avoid), Taurus(7), Leo(10), Virgo(11)
  // Actually bad houses from Moon: 6th, 8th, 12th!
  // From Scorpio: 6th=Aries, 8th=Gemini, 12th=Libra
  // From Aries: 6th=Virgo, 8th=Scorpio, 12th=Pisces
  const moonSignIdx = Math.floor(eph.planets.Moon.siderealLongitude / 30);
  const hFromF1 = ((moonSignIdx - 7 + 12) % 12) + 1;
  const hFromF2 = ((moonSignIdx - 0 + 12) % 12) + 1;

  const badF1 = [6, 8, 12].includes(hFromF1);
  const badF2 = [6, 8, 12].includes(hFromF2);
  const chandraBalaBoth = !badF1 && !badF2;

  // Tara Bala check:
  // F1 Nakshatra: Jyeshtha (idx 17, 0-indexed)
  // F2 Nakshatra: Bharani (idx 1, 0-indexed)
  const currentNakIdx = Math.floor(eph.planets.Moon.siderealLongitude / (360 / 27));
  const t1 = ((currentNakIdx - 17 + 27) % 9) + 1; // 1 to 9
  const t2 = ((currentNakIdx - 1 + 27) % 9) + 1;
  // Auspicious Taras: 2 (Sampat), 4 (Kshema), 6 (Sadhana), 8 (Mitra), 9 (Parama Mitra). (And 1 Janma sometimes ok, 3 Vipat bad, 5 Pratyak bad, 7 Naidhana very bad)
  const goodTara = [2, 4, 6, 8, 9];
  const taraF1Good = goodTara.includes(t1);
  const taraF2Good = goodTara.includes(t2);

  console.log(
    `${dayStr} (${vara.padEnd(9)}): Moon in ${moonRashi.padEnd(11)} ${moonDeg.padStart(5)}° | Nak: ${nak.padEnd(16)} | Tithi: ${tithi.padEnd(24)} | Yoga: ${yoga.padEnd(12)} | Karana: ${karana.padEnd(10)} | CB: F1(H${hFromF1} ${badF1?'BAD':'OK'}), F2(H${hFromF2} ${badF2?'BAD':'OK'}) -> Both CB: ${chandraBalaBoth?'YES':'NO'} | TB: F1(${t1} ${taraF1Good?'GOOD':'NO'}), F2(${t2} ${taraF2Good?'GOOD':'NO'})`
  );
}
