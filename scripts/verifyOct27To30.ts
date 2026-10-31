import * as fs from "fs";

interface Bar {
  date: string;
  time?: string;
  open: number;
  high: number;
  low: number;
  close: number;
  tickvol: number;
}

function parseCsv(path: string): Bar[] {
  const content = fs.readFileSync(path, "utf-8");
  const lines = content.trim().split("\n");
  const header = lines[0].split("\t");
  const hasTime = header.includes("<TIME>");
  
  const bars: Bar[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].trim().split("\t");
    if (parts.length < 5) continue;
    if (hasTime) {
      bars.push({
        date: parts[0],
        time: parts[1],
        open: parseFloat(parts[2]),
        high: parseFloat(parts[3]),
        low: parseFloat(parts[4]),
        close: parseFloat(parts[5]),
        tickvol: parseInt(parts[6] || "0", 10),
      });
    } else {
      bars.push({
        date: parts[0],
        open: parseFloat(parts[1]),
        high: parseFloat(parts[2]),
        low: parseFloat(parts[3]),
        close: parseFloat(parts[4]),
        tickvol: parseInt(parts[5] || "0", 10),
      });
    }
  }
  return bars;
}

const daily = parseCsv("D:\\GOLD.pro_Daily_202610270000_20300000.csv".replace("2030", "20261030"));
const h1 = parseCsv("D:\\GOLD.pro_H1_202610270000_202610302100.csv");
const m15 = parseCsv("D:\\GOLD.pro_M15_202610270000_202610302145.csv");

console.log("=== COMPREHENSIVE VERIFICATION REPORT (27 - 30 OCT 2026) ===");
console.log(`Loaded ${daily.length} Daily bars, ${h1.length} H1 bars, ${m15.length} M15 bars.\n`);

console.log("--- 1. DAILY BAR VERIFICATION ---");
for (const d of daily) {
  const change = d.close - d.open;
  const pct = (change / d.open) * 100;
  const range = d.high - d.low;
  console.log(
    `${d.date}: Open=${d.open.toFixed(2)}, High=${d.high.toFixed(2)}, Low=${d.low.toFixed(2)}, Close=${d.close.toFixed(2)} | Change=${change > 0 ? "+" : ""}${change.toFixed(2)} (${pct.toFixed(2)}%) | Range=$${range.toFixed(2)} | Vol=${d.tickvol}`
  );
}

// Now verify H1 turns for Oct 29 and Oct 30
console.log("\n--- 2. HOURLY EXTREMES & TURNING POINTS (OCT 29, 2026) ---");
const h1Oct29 = h1.filter(b => b.date === "2026.10.29");
let min29 = Infinity, max29 = -Infinity;
let minBar29: Bar | null = null, maxBar29: Bar | null = null;
for (const b of h1Oct29) {
  if (b.low < min29) { min29 = b.low; minBar29 = b; }
  if (b.high > max29) { max29 = b.high; maxBar29 = b; }
}
console.log(`Oct 29 Day High: ${max29.toFixed(2)} at ${maxBar29?.time}`);
console.log(`Oct 29 Day Low:  ${min29.toFixed(2)} at ${minBar29?.time}`);

console.log("\n--- 3. HOURLY EXTREMES & TURNING POINTS (OCT 30, 2026) ---");
const h1Oct30 = h1.filter(b => b.date === "2026.10.30");
let min30 = Infinity, max30 = -Infinity;
let minBar30: Bar | null = null, maxBar30: Bar | null = null;
for (const b of h1Oct30) {
  if (b.low < min30) { min30 = b.low; minBar30 = b; }
  if (b.high > max30) { max30 = b.high; maxBar30 = b; }
}
console.log(`Oct 30 Day High: ${max30.toFixed(2)} at ${maxBar30?.time}`);
console.log(`Oct 30 Day Low:  ${min30.toFixed(2)} at ${minBar30?.time}`);

// M15 Quarter analysis for Oct 29 and 30
console.log("\n--- 4. M15 QUARTER (Q1-Q4) DRIFT VERIFICATION ---");
function analyzeQuarters(dateStr: string) {
  const bars = m15.filter(b => b.date === dateStr);
  const qReturns: Record<number, number[]> = { 0: [], 1: [], 2: [], 3: [] };
  for (const b of bars) {
    const mins = parseInt(b.time!.split(":")[1], 10);
    const q = Math.floor(mins / 15);
    const retBps = ((b.close - b.open) / b.open) * 10000;
    qReturns[q].push(retBps);
  }
  console.log(`M15 Stats for ${dateStr}:`);
  for (let q = 0; q < 4; q++) {
    const arr = qReturns[q];
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    console.log(`  Q${q + 1} (: ${q * 15}m - :${q * 15 + 15}m): Count=${arr.length}, Avg Return=${avg.toFixed(3)} bps`);
  }
}
analyzeQuarters("2026.10.27");
analyzeQuarters("2026.10.28");
analyzeQuarters("2026.10.29");
analyzeQuarters("2026.10.30");
