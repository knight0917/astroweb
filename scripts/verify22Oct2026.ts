import fs from "fs";
import * as Astronomy from "astronomy-engine";
import { calculateTropicalAngles } from "../src/engine/ascendant";
import { toSiderealLongitude } from "../src/engine/ayanamsha";

const ROME_LAT = 41.9028;
const ROME_LON = 12.4964;

// Daily
const dPath = "D:/GOLD.pro_Daily_202610220000_202610220000.csv";
const dLine = fs.readFileSync(dPath, "utf-8").trim().split(/\r?\n/)[1].split("\t");
const [dDate, dOpen, dHigh, dLow, dClose] = [dLine[0], parseFloat(dLine[1]), parseFloat(dLine[2]), parseFloat(dLine[3]), parseFloat(dLine[4])];

// H1
const h1Path = "D:/GOLD.pro_H1_202610220000_202610222200.csv";
const h1Lines = fs.readFileSync(h1Path, "utf-8").trim().split(/\r?\n/).slice(1);

// M15
const m15Path = "D:/GOLD.pro_M15_202610220000_202610222245.csv";
const m15Lines = fs.readFileSync(m15Path, "utf-8").trim().split(/\r?\n/).slice(1);

// Rashi names
const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];
const KAKSHYA_LORDS = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Lagna"];
const HORA_ORDER = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];
const DAY_FIRST_HORA: Record<number, string> = {
  0: "Sun", 1: "Moon", 2: "Mars", 3: "Mercury", 4: "Jupiter", 5: "Venus", 6: "Saturn"
};

// Sunrise in Rome on Oct 22 (CEST = UTC+2)
const observer = new Astronomy.Observer(ROME_LAT, ROME_LON, 0);
const dateMidnightUtc = new Date(Date.UTC(2026, 9, 21, 22, 0, 0)); // 00:00 CEST
const sunriseTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, dateMidnightUtc, 1)!;
const sunriseUtc = sunriseTime.date;
const sunsetTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, sunriseUtc, 1)!;
const sunsetUtc = sunsetTime.date;

const dayDurationHours = (sunsetUtc.getTime() - sunriseUtc.getTime()) / (3600 * 1000);
const nightDurationHours = 24 - dayDurationHours;
const dinaHoraLen = dayDurationHours / 12;
const ratriHoraLen = nightDurationHours / 12;

function getVedicHora(dUtc: Date): string {
  const t = dUtc.getTime();
  const sr = sunriseUtc.getTime();
  const ss = sunsetUtc.getTime();
  let diff = 0, horaIdx = 0;
  if (t >= sr && t < ss) {
    diff = (t - sr) / (3600 * 1000);
    horaIdx = Math.floor(diff / dinaHoraLen);
  } else if (t >= ss) {
    diff = (t - ss) / (3600 * 1000);
    horaIdx = 12 + Math.floor(diff / ratriHoraLen);
  } else {
    const prevSunset = new Date(sunsetUtc.getTime() - 24 * 3600 * 1000);
    diff = (t - prevSunset.getTime()) / (3600 * 1000);
    horaIdx = 12 + Math.floor(diff / ratriHoraLen);
  }
  const startIdx = HORA_ORDER.indexOf(DAY_FIRST_HORA[4]); // Thursday = Jupiter
  return HORA_ORDER[(startIdx + horaIdx) % 7];
}

console.log("==========================================================================================");
console.log("1. DAILY (D1) VERIFICATION (ROME LOCAL DATE: 2026.10.22)");
console.log("==========================================================================================");
const dRet = ((dClose - dOpen) / dOpen) * 100;
const dRng = dHigh - dLow;
console.log(`Open: ${dOpen.toFixed(2)}, High: ${dHigh.toFixed(2)}, Low: ${dLow.toFixed(2)}, Close: ${dClose.toFixed(2)}`);
console.log(`Net Return: ${(dRet >= 0 ? "+" : "") + dRet.toFixed(4)}% | Range: $${dRng.toFixed(2)} | Close Direction: ${dClose > dOpen ? "BULLISH UP" : "BEARISH DOWN"}`);

console.log("\n==========================================================================================");
console.log("2. HOURLY (H1) VERIFICATION (ROME LOCAL TIMESTAMPS)");
console.log("==========================================================================================");
console.log("Time CEST | Open    | High    | Low     | Close   | Ret%   | Range$ | Dir  | Vedic Hora  | Lagna Rome  | Kakshya");
console.log("-------------------------------------------------------------------------------------------------------------");

let h1Low = 999999, h1LowTime = "", h1LowHora = "", h1LowLagna = "";
let h1High = -1, h1HighTime = "", h1HighHora = "", h1HighLagna = "";

for (const line of h1Lines) {
  const p = line.split("\t");
  if (p.length < 6) continue;
  const tRome = p[1];
  const [hh, mm] = tRome.split(":").map(Number);
  const open = parseFloat(p[2]);
  const high = parseFloat(p[3]);
  const low = parseFloat(p[4]);
  const close = parseFloat(p[5]);
  const ret = ((close - open) / open) * 100;
  const rng = high - low;
  const dir = close >= open ? "UP" : "DOWN";

  // Rome CEST is UTC+2
  const dUtc = new Date(Date.UTC(2026, 9, hh < 2 ? 21 : 22, (hh - 2 + 24) % 24, mm, 0));
  const vHora = getVedicHora(dUtc);

  const astroTime = new Astronomy.AstroTime(dUtc);
  const trop = calculateTropicalAngles(astroTime, ROME_LAT, ROME_LON);
  const sid = toSiderealLongitude(trop.ascendant, astroTime.ut + 2451545.0, "Lahiri");
  const degInSign = ((sid % 30) + 30) % 30;
  const lagna = RASHI_NAMES[Math.floor(sid / 30) % 12];
  const kak = KAKSHYA_LORDS[Math.min(Math.floor(degInSign / 3.75), 7)];

  if (low < h1Low) {
    h1Low = low;
    h1LowTime = tRome;
    h1LowHora = vHora;
    h1LowLagna = lagna;
  }
  if (high > h1High) {
    h1High = high;
    h1HighTime = tRome;
    h1HighHora = vHora;
    h1HighLagna = lagna;
  }

  const retStr = (ret >= 0 ? "+" : "") + ret.toFixed(2) + "%";
  console.log(
    `${tRome.padEnd(9)} | ${open.toFixed(2)} | ${high.toFixed(2)} | ${low.toFixed(2)} | ${close.toFixed(2)} | ${retStr.padStart(6)} | $${rng.toFixed(2).padStart(5)} | ${dir.padEnd(4)} | ${vHora.padEnd(11)} | ${lagna.padEnd(11)} | ${kak}`
  );
}

console.log(`\nH1 Extreme Summary in Rome Time:`);
console.log(`Day Low : $${h1Low.toFixed(2)} at ${h1LowTime} CEST | Vedic Hora: ${h1LowHora} | Lagna: ${h1LowLagna}`);
console.log(`Day High: $${h1High.toFixed(2)} at ${h1HighTime} CEST | Vedic Hora: ${h1HighHora} | Lagna: ${h1HighLagna}`);

console.log("\n==========================================================================================");
console.log("3. 15-MINUTE (M15) VERIFICATION (ROME LOCAL TIMESTAMPS)");
console.log("==========================================================================================");

let m15Count = 0;
let m15Up = 0, m15Dn = 0, m15Chop = 0, m15Sweep = 0;
let qRet = { 1: 0, 2: 0, 3: 0, 4: 0 };
let qCount = { 1: 0, 2: 0, 3: 0, 4: 0 };
let kakRet: Record<string, number> = {};
let kakCount: Record<string, number> = {};
for (const k of KAKSHYA_LORDS) {
  kakRet[k] = 0;
  kakCount[k] = 0;
}

let m15Low = 999999, m15LowTime = "";
let m15High = -1, m15HighTime = "";

for (const line of m15Lines) {
  const p = line.split("\t");
  if (p.length < 6) continue;
  m15Count++;
  const tRome = p[1];
  const [hh, mm] = tRome.split(":").map(Number);
  const open = parseFloat(p[2]);
  const high = parseFloat(p[3]);
  const low = parseFloat(p[4]);
  const close = parseFloat(p[5]);
  const range = high - low;
  const body = Math.abs(close - open);
  const retBps = ((close - open) / open) * 10000;

  if (low < m15Low) {
    m15Low = low;
    m15LowTime = tRome;
  }
  if (high > m15High) {
    m15High = high;
    m15HighTime = tRome;
  }

  const q = Math.floor(mm / 15) + 1;
  qRet[q as 1|2|3|4] += retBps;
  qCount[q as 1|2|3|4]++;

  const upperWick = high - Math.max(open, close);
  const lowerWick = Math.min(open, close) - low;
  const bodyToRange = range > 0 ? body / range : 0;

  if (range > 0 && upperWick > body * 1.5 && lowerWick > body * 1.5) m15Sweep++;
  else if (bodyToRange < 0.25 || Math.abs(retBps) < 3.0) m15Chop++;
  else if (close > open) m15Up++;
  else m15Dn++;

  const dUtc = new Date(Date.UTC(2026, 9, hh < 2 ? 21 : 22, (hh - 2 + 24) % 24, mm, 0));
  const astroTime = new Astronomy.AstroTime(dUtc);
  const trop = calculateTropicalAngles(astroTime, ROME_LAT, ROME_LON);
  const sid = toSiderealLongitude(trop.ascendant, astroTime.ut + 2451545.0, "Lahiri");
  const degInSign = ((sid % 30) + 30) % 30;
  const kak = KAKSHYA_LORDS[Math.min(Math.floor(degInSign / 3.75), 7)];

  kakRet[kak] += retBps;
  kakCount[kak]++;
}

console.log(`Total M15 Bars: ${m15Count}`);
console.log(`Direction Distribution: UP = ${m15Up} (${((m15Up/m15Count)*100).toFixed(1)}%), DOWN = ${m15Dn} (${((m15Dn/m15Count)*100).toFixed(1)}%), CHOP = ${m15Chop} (${((m15Chop/m15Count)*100).toFixed(1)}%), SWEEP = ${m15Sweep} (${((m15Sweep/m15Count)*100).toFixed(1)}%)`);
console.log(`Absolute M15 Low : $${m15Low.toFixed(2)} at ${m15LowTime} CEST`);
console.log(`Absolute M15 High: $${m15High.toFixed(2)} at ${m15HighTime} CEST`);

console.log("\nQuarter Returns across the entire day in Rome (bps):");
console.log(`Q1 (:00-:15 CEST): ${(qRet[1]/qCount[1]).toFixed(3)} bps (${qCount[1]} bars)`);
console.log(`Q2 (:15-:30 CEST): ${(qRet[2]/qCount[2]).toFixed(3)} bps (${qCount[2]} bars)`);
console.log(`Q3 (:30-:45 CEST): ${(qRet[3]/qCount[3]).toFixed(3)} bps (${qCount[3]} bars)`);
console.log(`Q4 (:45-:00 CEST): ${(qRet[4]/qCount[4]).toFixed(3)} bps (${qCount[4]} bars)`);

console.log("\nAshtakavarga Kakshya Returns in Rome (bps):");
for (const k of KAKSHYA_LORDS) {
  const c = kakCount[k] || 0;
  const avg = c > 0 ? (kakRet[k] / c).toFixed(3) : "0.000";
  console.log(`Kakshya Lord ${k.padEnd(8)}: ${avg.padStart(7)} bps across ${String(c).padStart(2)} candles`);
}
