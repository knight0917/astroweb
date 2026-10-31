import * as Astronomy from "astronomy-engine";

const ROME_LAT = 41.9028;
const ROME_LON = 12.4964;
const observer = new Astronomy.Observer(ROME_LAT, ROME_LON, 0);

const HORA_ORDER = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];
const DAY_FIRST_HORA: Record<number, string> = {
  0: "Sun", 1: "Moon", 2: "Mars", 3: "Mercury", 4: "Jupiter", 5: "Venus", 6: "Saturn"
};

// Let's compute true continuous Vedic Horas across Oct 28 and Oct 29
// Oct 28 (Wed) sunrise and sunset:
const d28MidUtc = new Date(Date.UTC(2026, 9, 27, 23, 0, 0)); // 00:00 CET Oct 28
const sr28Utc = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, d28MidUtc, 1)!.date;
const ss28Utc = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, sr28Utc, 1)!.date;

// Oct 29 (Thu) sunrise and sunset:
const d29MidUtc = new Date(Date.UTC(2026, 9, 28, 23, 0, 0)); // 00:00 CET Oct 29
const sr29Utc = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, d29MidUtc, 1)!.date;
const ss29Utc = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, sr29Utc, 1)!.date;

// Oct 30 (Fri) sunrise:
const d30MidUtc = new Date(Date.UTC(2026, 9, 29, 23, 0, 0)); // 00:00 CET Oct 30
const sr30Utc = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, d30MidUtc, 1)!.date;

console.log("Oct 28 Sunrise:", sr28Utc.toISOString());
console.log("Oct 28 Sunset: ", ss28Utc.toISOString());
console.log("Oct 29 Sunrise:", sr29Utc.toISOString());
console.log("Oct 29 Sunset: ", ss29Utc.toISOString());
console.log("Oct 30 Sunrise:", sr30Utc.toISOString());

// Night of Oct 28 -> Oct 29: from ss28Utc to sr29Utc
const night28_29_durationHours = (sr29Utc.getTime() - ss28Utc.getTime()) / (3600 * 1000);
const ratriHora28_29 = night28_29_durationHours / 12;

console.log(`Night of 28->29 duration: ${night28_29_durationHours.toFixed(4)}h, hora = ${(ratriHora28_29 * 60).toFixed(2)}m`);

// On Wednesday Oct 28, Day Ruler is Mercury (index 5)
// Day Horas (0 to 11): 5 to 16
// Night Horas (12 to 23): starting at ss28Utc
// Let's print every hora of that night:
console.log("\n--- Wednesday Night (28-29 Oct) Horas ---");
const wedStart = HORA_ORDER.indexOf("Mercury");
for (let h = 0; h < 12; h++) {
  const horaLord = HORA_ORDER[(wedStart + 12 + h) % 7];
  const horaStartMs = ss28Utc.getTime() + h * ratriHora28_29 * 3600 * 1000;
  const horaStartDate = new Date(horaStartMs + 3600 * 1000); // CET
  console.log(`Ratri Hora ${h + 1} (Overall Hora ${13 + h}): Start = ${horaStartDate.toISOString().substring(11, 16)} CET | Lord = ${horaLord}`);
}
console.log(`\nThursday Sunrise at: ${new Date(sr29Utc.getTime() + 3600 * 1000).toISOString().substring(11, 16)} CET | First Hora must be: ${DAY_FIRST_HORA[4]} (Jupiter)`);
