import fs from "fs";
import * as Astronomy from "astronomy-engine";
import { calculateTropicalAngles } from "../src/engine/ascendant";
import { toSiderealLongitude } from "../src/engine/ayanamsha";

const ROME_LAT = 41.9028;
const ROME_LON = 12.4964;

const dailyPath = "D:/GOLD.pro_Daily_202610270000_202610280000.csv";
const m15Path = "D:/GOLD.pro_M15_202610270000_202610280000.csv";

// 1. Daily
const dLines = fs.readFileSync(dailyPath, "utf-8").trim().split(/\r?\n/);
const dParts = dLines[1].split("\t");
const dDate = dParts[0];
const dOpen = parseFloat(dParts[1]);
const dHigh = parseFloat(dParts[2]);
const dLow = parseFloat(dParts[3]);
const dClose = parseFloat(dParts[4]);
const dRet = ((dClose - dOpen) / dOpen) * 100;
const dRng = dHigh - dLow;

console.log("==========================================================================================");
console.log("1. DAILY (D1) VERIFICATION (OCTOBER 27, 2026 - ROME TIME)");
console.log("==========================================================================================");
console.log(`Date: ${dDate}`);
console.log(`Open: ${dOpen.toFixed(2)}, High: ${dHigh.toFixed(2)}, Low: ${dLow.toFixed(2)}, Close: ${dClose.toFixed(2)}`);
console.log(`Net Return: ${(dRet >= 0 ? "+" : "") + dRet.toFixed(4)}% (+${(dClose - dOpen).toFixed(2)}$) | Range: $${dRng.toFixed(2)} | Close: ${dClose >= dOpen ? "BULLISH UP" : "BEARISH DOWN"}`);

// 2. Build True H1 from M15
const m15Lines = fs.readFileSync(m15Path, "utf-8").trim().split(/\r?\n/).slice(1);

interface H1Agg {
  hour: number;
  open: number;
  high: number;
  low: number;
  close: number;
  barsCount: number;
}

const h1Map = new Map<number, H1Agg>();

for (const line of m15Lines) {
  const p = line.split("\t");
  if (p.length < 6) continue;
  const dateStr = p[0];
  if (dateStr !== "2026.10.27") continue; // only Oct 27
  const timeStr = p[1];
  const [hh, mm] = timeStr.split(":").map(Number);
  const open = parseFloat(p[2]);
  const high = parseFloat(p[3]);
  const low = parseFloat(p[4]);
  const close = parseFloat(p[5]);

  if (!h1Map.has(hh)) {
    h1Map.set(hh, {
      hour: hh,
      open,
      high,
      low,
      close,
      barsCount: 1
    });
  } else {
    const cur = h1Map.get(hh)!;
    cur.high = Math.max(cur.high, high);
    cur.low = Math.min(cur.low, low);
    cur.close = close; // latest close
    cur.barsCount++;
  }
}

// Sunrise in Rome on Oct 27
const observer = new Astronomy.Observer(ROME_LAT, ROME_LON, 0);
const dateMidnightUtc = new Date(Date.UTC(2026, 9, 26, 23, 0, 0)); // 00:00 CET Oct 27
const sunriseTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, dateMidnightUtc, 1)!;
const sunriseUtc = sunriseTime.date;
const sunsetTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, sunriseUtc, 1)!;
const sunsetUtc = sunsetTime.date;

const dayDurationHours = (sunsetUtc.getTime() - sunriseUtc.getTime()) / (3600 * 1000);
const nightDurationHours = 24 - dayDurationHours;
const dinaHoraLen = dayDurationHours / 12;
const ratriHoraLen = nightDurationHours / 12;

const HORA_ORDER = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];
const DAY_FIRST_HORA: Record<number, string> = {
  0: "Sun", 1: "Moon", 2: "Mars", 3: "Mercury", 4: "Jupiter", 5: "Venus", 6: "Saturn"
};

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
  const startIdx = HORA_ORDER.indexOf(DAY_FIRST_HORA[2]); // Tuesday = Mars
  return HORA_ORDER[(startIdx + horaIdx) % 7];
}

const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];
const KAKSHYA_LORDS = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Lagna"];

console.log("\n==========================================================================================");
console.log("2. TRUE HOURLY (H1) EVOLUTION (ROME CET)");
console.log("==========================================================================================");
console.log("Hour CET | Open    | High    | Low     | Close   | Ret%   | Range$ | Dir  | Vedic Hora  | Lagna Rome  | Kakshya");
console.log("-------------------------------------------------------------------------------------------------------------");

let h1Low = 999999, h1LowH = -1, h1LowHora = "", h1LowLagna = "";
let h1High = -1, h1HighH = -1, h1HighHora = "", h1HighLagna = "";

for (let hh = 0; hh < 24; hh++) {
  const b = h1Map.get(hh);
  if (!b) continue;

  const ret = ((b.close - b.open) / b.open) * 100;
  const rng = b.high - b.low;
  const dir = b.close >= b.open ? "UP" : "DOWN";

  const dUtc = new Date(Date.UTC(2026, 9, hh < 1 ? 26 : 27, (hh - 1 + 24) % 24, 0, 0));
  const vHora = getVedicHora(dUtc);

  const astroTime = new Astronomy.AstroTime(dUtc);
  const trop = calculateTropicalAngles(astroTime, ROME_LAT, ROME_LON);
  const sid = toSiderealLongitude(trop.ascendant, astroTime.ut + 2451545.0, "Lahiri");
  const degInSign = ((sid % 30) + 30) % 30;
  const lagna = RASHI_NAMES[Math.floor(sid / 30) % 12];
  const kak = KAKSHYA_LORDS[Math.min(Math.floor(degInSign / 3.75), 7)];

  if (b.low < h1Low) {
    h1Low = b.low;
    h1LowH = hh;
    h1LowHora = vHora;
    h1LowLagna = lagna;
  }
  if (b.high > h1High) {
    h1High = b.high;
    h1HighH = hh;
    h1HighHora = vHora;
    h1HighLagna = lagna;
  }

  const retStr = (ret >= 0 ? "+" : "") + ret.toFixed(2) + "%";
  console.log(
    `${String(hh).padStart(2, "0")}:00 CET | ${b.open.toFixed(2)} | ${b.high.toFixed(2)} | ${b.low.toFixed(2)} | ${b.close.toFixed(2)} | ${retStr.padStart(6)} | $${rng.toFixed(2).padStart(5)} | ${dir.padEnd(4)} | ${vHora.padEnd(11)} | ${lagna.padEnd(11)} | ${kak}`
  );
}

console.log(`\nH1 Extreme Summary in Rome Time:`);
console.log(`Day Low : $${h1Low.toFixed(2)} at ${String(h1LowH).padStart(2, "0")}:00 CET | Vedic Hora: ${h1LowHora} | Lagna: ${h1LowLagna}`);
console.log(`Day High: $${h1High.toFixed(2)} at ${String(h1HighH).padStart(2, "0")}:00 CET | Vedic Hora: ${h1HighHora} | Lagna: ${h1HighLagna}`);

// 3. M15 Quarter Breakdown for Oct 27
let qRet = { 1: 0, 2: 0, 3: 0, 4: 0 };
let qCount = { 1: 0, 2: 0, 3: 0, 4: 0 };

for (const line of m15Lines) {
  const p = line.split("\t");
  if (p.length < 6) continue;
  if (p[0] !== "2026.10.27") continue;
  const timeStr = p[1];
  const [hh, mm] = timeStr.split(":").map(Number);
  const open = parseFloat(p[2]);
  const close = parseFloat(p[5]);
  const retBps = ((close - open) / open) * 10000;
  const q = Math.floor(mm / 15) + 1;
  qRet[q as 1|2|3|4] += retBps;
  qCount[q as 1|2|3|4]++;
}

console.log("\n==========================================================================================");
console.log("3. M15 QUARTER SUMMARY FOR OCT 27 IN ROME");
console.log("==========================================================================================");
console.log(`Q1 (:00-:15 CET): ${(qRet[1]/qCount[1]).toFixed(3)} bps (${qCount[1]} bars) -> Primary Impulse Leader!`);
console.log(`Q2 (:15-:30 CET): ${(qRet[2]/qCount[2]).toFixed(3)} bps (${qCount[2]} bars)`);
console.log(`Q3 (:30-:45 CET): ${(qRet[3]/qCount[3]).toFixed(3)} bps (${qCount[3]} bars)`);
console.log(`Q4 (:45-:00 CET): ${(qRet[4]/qCount[4]).toFixed(3)} bps (${qCount[4]} bars)`);
