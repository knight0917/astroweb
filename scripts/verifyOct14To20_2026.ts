import fs from "fs";

const dailyPath = "D:/GOLD.pro_Daily_202601140000_202610200000.csv";
const h1Path = "D:/GOLD.pro_H1_202601140000_202610202200.csv";
const m15Path = "D:/GOLD.pro_M15_202601140000_202610202245.csv";

console.log("Checking file existence...");
console.log("Daily:", fs.existsSync(dailyPath));
console.log("H1:", fs.existsSync(h1Path));
console.log("M15:", fs.existsSync(m15Path));

// 1. Inspect Daily lines for Oct 14 - 20, 2026
const dLines = fs.readFileSync(dailyPath, "utf-8").trim().split(/\r?\n/);
console.log(`\nDaily total lines: ${dLines.length}`);
console.log("Header:", dLines[0]);
console.log("\nLast 10 Daily bars:");
for (let i = Math.max(1, dLines.length - 10); i < dLines.length; i++) {
  console.log(dLines[i]);
}

// 2. Parse daily bars specifically for 2026.10.14 to 2026.10.20
interface DailyResult {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  retPct: number;
  range: number;
  dir: "UP" | "DOWN";
}

const targetDates = ["2026.10.14", "2026.10.15", "2026.10.16", "2026.10.19", "2026.10.20"];
const dailyMap = new Map<string, DailyResult>();

for (let i = 1; i < dLines.length; i++) {
  const p = dLines[i].split("\t");
  if (p.length < 5) continue;
  const dateStr = p[0];
  if (targetDates.includes(dateStr)) {
    const open = parseFloat(p[1]);
    const high = parseFloat(p[2]);
    const low = parseFloat(p[3]);
    const close = parseFloat(p[4]);
    const retPct = ((close - open) / open) * 100;
    const range = high - low;
    dailyMap.set(dateStr, {
      date: dateStr,
      open,
      high,
      low,
      close,
      retPct,
      range,
      dir: close >= open ? "UP" : "DOWN"
    });
  }
}

console.log("\n=== TARGET DAILY BARS (14 OCT - 20 OCT 2026) ===");
for (const dt of targetDates) {
  const b = dailyMap.get(dt);
  if (b) {
    console.log(
      `${b.date} | Open: ${b.open.toFixed(2)} | High: ${b.high.toFixed(2)} | Low: ${b.low.toFixed(2)} | Close: ${b.close.toFixed(2)} | Ret%: ${(b.retPct >= 0 ? "+" : "") + b.retPct.toFixed(2)}% | Range: $${b.range.toFixed(2)} | Dir: ${b.dir}`
    );
  } else {
    console.log(`${dt} | NOT FOUND`);
  }
}
