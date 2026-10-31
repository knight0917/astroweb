import fs from "fs";

const h1Path = "D:/GOLD.pro_H1_202601140000_202610202200.csv";
const m15Path = "D:/GOLD.pro_M15_202601140000_202610202245.csv";

const targetDates = ["2026.10.14", "2026.10.15", "2026.10.16", "2026.10.19", "2026.10.20"];

console.log("Parsing H1 lines for target dates...");
const h1Lines = fs.readFileSync(h1Path, "utf-8").trim().split(/\r?\n/);
const h1ByDate: Record<string, any[]> = {};
for (const dt of targetDates) h1ByDate[dt] = [];

for (let i = 1; i < h1Lines.length; i++) {
  const p = h1Lines[i].split("\t");
  if (p.length < 6) continue;
  const dStr = p[0];
  if (targetDates.includes(dStr)) {
    const timeStr = p[1];
    const open = parseFloat(p[2]);
    const high = parseFloat(p[3]);
    const low = parseFloat(p[4]);
    const close = parseFloat(p[5]);
    const ret = ((close - open) / open) * 100;
    const rng = high - low;
    h1ByDate[dStr].push({ timeStr, open, high, low, close, ret, rng });
  }
}

for (const dt of targetDates) {
  const bars = h1ByDate[dt];
  console.log(`\n========================================================================`);
  console.log(`H1 AUDIT: ${dt} (${bars.length} bars)`);
  console.log(`========================================================================`);
  let dayLow = 999999, dayLowT = "", dayHigh = -1, dayHighT = "";
  let upBars = 0, dnBars = 0;
  for (const b of bars) {
    if (b.low < dayLow) { dayLow = b.low; dayLowT = b.timeStr; }
    if (b.high > dayHigh) { dayHigh = b.high; dayHighT = b.timeStr; }
    if (b.close >= b.open) upBars++;
    else dnBars++;
  }
  console.log(`Day High: $${dayHigh.toFixed(2)} at ${dayHighT} | Day Low: $${dayLow.toFixed(2)} at ${dayLowT}`);
  console.log(`H1 Up bars: ${upBars}, Down bars: ${dnBars}`);
  
  // Print key sessions:
  // European morning (08:00 - 12:00)
  const eurBars = bars.filter(b => {
    const h = parseInt(b.timeStr.split(":")[0], 10);
    return h >= 8 && h < 13;
  });
  let eurRet = 0;
  for (const eb of eurBars) eurRet += eb.ret;
  console.log(`Europe Session (08:00-13:00): Net Ret = ${(eurRet >= 0 ? "+" : "") + eurRet.toFixed(2)}% across ${eurBars.length} bars`);

  // US session (13:00 - 19:00)
  const usBars = bars.filter(b => {
    const h = parseInt(b.timeStr.split(":")[0], 10);
    return h >= 13 && h < 19;
  });
  let usRet = 0;
  for (const ub of usBars) usRet += ub.ret;
  console.log(`US Session (13:00-19:00): Net Ret = ${(usRet >= 0 ? "+" : "") + usRet.toFixed(2)}% across ${usBars.length} bars`);
}
