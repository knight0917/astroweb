import * as Astronomy from "astronomy-engine";

const TORINO_LAT = 45.0678;
const TORINO_LON = 7.6825;
const TORINO_TZ = 1;

function getChoghadiyaAndRahuKaal(year: number, month: number, day: number) {
  const observer = new Astronomy.Observer(TORINO_LAT, TORINO_LON, 0);
  const midnightUtc = new Date(Date.UTC(year, month - 1, day - 1, 23, 0, 0));

  const sunriseTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, midnightUtc, 1)!;
  const sunriseUtc = sunriseTime.date;
  const sunsetTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, sunriseUtc, 1)!;
  const sunsetUtc = sunsetTime.date;

  const sunriseCet = new Date(sunriseUtc.getTime() + TORINO_TZ * 3600 * 1000);
  const sunsetCet = new Date(sunsetUtc.getTime() + TORINO_TZ * 3600 * 1000);
  const dayDurationMs = sunsetUtc.getTime() - sunriseUtc.getTime();
  const chogLenMs = dayDurationMs / 8;

  // Day order of Choghadiya starts with ruler:
  // Sunday: Udveg, Chal, Labh, Amrit, Kaal, Shubh, Rog, Udveg
  // Monday: Amrit, Kaal, Shubh, Rog, Udveg, Chal, Labh, Amrit
  // Tuesday: Rog, Udveg, Chal, Labh, Amrit, Kaal, Shubh, Rog
  // Wednesday: Labh, Amrit, Kaal, Shubh, Rog, Udveg, Chal, Labh
  // Thursday: Shubh, Rog, Udveg, Chal, Labh, Amrit, Kaal, Shubh
  // Friday: Chal, Labh, Amrit, Kaal, Shubh, Rog, Udveg, Chal
  // Saturday: Kaal, Shubh, Rog, Udveg, Chal, Labh, Amrit, Kaal

  const DAY_CHOG_START: Record<number, string[]> = {
    0: ["Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg"],
    1: ["Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Chal", "Labh", "Amrit"],
    2: ["Rog", "Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog"],
    3: ["Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Chal", "Labh"],
    4: ["Shubh", "Rog", "Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh"],
    5: ["Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Chal"],
    6: ["Kaal", "Shubh", "Rog", "Udveg", "Chal", "Labh", "Amrit", "Kaal"],
  };

  // Rahu Kaal 8th parts:
  // Sun: 8th part (approx 16:30-18:00) -> 8th
  // Mon: 2nd part (07:30-09:00) -> 2nd
  // Tue: 7th part (15:00-16:30) -> 7th
  // Wed: 5th part (12:00-13:30) -> 5th
  // Thu: 6th part (13:30-15:00) -> 6th
  // Fri: 4th part (10:30-12:00) -> 4th
  // Sat: 3rd part (09:00-10:30) -> 3rd
  const RAHU_PART: Record<number, number> = { 0: 8, 1: 2, 2: 7, 3: 5, 4: 6, 5: 4, 6: 3 };

  const dayOfWeek = sunriseCet.getUTCDay();
  const chogs = DAY_CHOG_START[dayOfWeek];
  const rahuP = RAHU_PART[dayOfWeek];

  console.log(`\n======================================================`);
  console.log(`CHOGHADIYA & TIMINGS: ${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")} (TORINO)`);
  console.log(`Sunrise: ${sunriseCet.toISOString().slice(11, 16)} CET | Sunset: ${sunsetCet.toISOString().slice(11, 16)} CET`);
  console.log(`======================================================`);

  for (let c = 0; c < 8; c++) {
    const cStart = new Date(sunriseUtc.getTime() + c * chogLenMs + TORINO_TZ * 3600 * 1000);
    const cEnd = new Date(sunriseUtc.getTime() + (c + 1) * chogLenMs + TORINO_TZ * 3600 * 1000);
    const name = chogs[c];
    const isGood = ["Amrit", "Shubh", "Labh"].includes(name);
    const isRahu = (c + 1) === rahuP;

    console.log(
      `Part ${c + 1}: ${cStart.toISOString().slice(11, 16)} - ${cEnd.toISOString().slice(11, 16)} CET | ${name.padEnd(8)} ${isGood ? "🟢 [EXCELLENT]" : isRahu ? "🔴 [RAHU KAAL]" : "⚪ [NEUTRAL/AVOID]"}`
    );
  }

  // Abhijit Muhurta (8th of 15 muhurtas, around local solar noon):
  const noonUtc = new Date((sunriseUtc.getTime() + sunsetUtc.getTime()) / 2);
  const muhurtaLenMs = dayDurationMs / 15;
  const abhijitStart = new Date(noonUtc.getTime() - muhurtaLenMs / 2 + TORINO_TZ * 3600 * 1000);
  const abhijitEnd = new Date(noonUtc.getTime() + muhurtaLenMs / 2 + TORINO_TZ * 3600 * 1000);
  console.log(`Abhijit Muhurta: ${abhijitStart.toISOString().slice(11, 16)} - ${abhijitEnd.toISOString().slice(11, 16)} CET`);
}

getChoghadiyaAndRahuKaal(2026, 10, 29);
getChoghadiyaAndRahuKaal(2026, 11, 18);
getChoghadiyaAndRahuKaal(2026, 11, 19);
