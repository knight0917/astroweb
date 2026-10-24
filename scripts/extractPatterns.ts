import fs from 'fs';
import { calculateAstroMarketSignal } from '../src/engine/financialAstro';

interface DailyCandle {
  dateStr: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  range: number;
  netChange: number;
  isBullish: boolean;
  isBearish: boolean;
}

const DAILY_FILES = [
  'C:\\Users\\singh\\Downloads\\GOLD.pro_Daily_202604010000_202604300000.csv',
  'C:\\Users\\singh\\Downloads\\GOLD.pro_Daily_202605010000_202605290000.csv',
  'C:\\Users\\singh\\Downloads\\GOLD.pro_Daily_202606010000_202606300000.csv',
  'C:\\Users\\singh\\Downloads\\GOLD.pro_Daily_202607010000_202607310000.csv',
  'C:\\Users\\singh\\Downloads\\GOLD.pro_Daily_202608030000_202608310000.csv',
  'C:\\Users\\singh\\Downloads\\GOLD.pro_Daily_202609010000_202609300000.csv',
];

const candles: DailyCandle[] = [];

for (const f of DAILY_FILES) {
  const content = fs.readFileSync(f, 'utf-8');
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split('\t');
    if (parts.length < 5) continue;
    const rawDate = parts[0].trim().replace(/\./g, '-');
    const open = parseFloat(parts[1]);
    const high = parseFloat(parts[2]);
    const low = parseFloat(parts[3]);
    const close = parseFloat(parts[4]);
    const dateParts = rawDate.split('-').map(Number);
    const date = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], 12, 0, 0));
    candles.push({
      dateStr: rawDate,
      date,
      open,
      high,
      low,
      close,
      range: high - low,
      netChange: close - open,
      isBullish: close > open,
      isBearish: close < open,
    });
  }
}

// Map each candle with full signal
const records = candles.map((c) => {
  const signal = calculateAstroMarketSignal('XAUUSD', c.date);
  return { candle: c, signal };
});

// A. NAKSHATRA WIN RATES
const nakStats: Record<string, { total: number; bull: number; bear: number; netPts: number }> = {};
for (const r of records) {
  const nak = r.signal.dikshitLiquidityCycle.moonNakshatraName || 'Unknown';
  if (!nakStats[nak]) nakStats[nak] = { total: 0, bull: 0, bear: 0, netPts: 0 };
  nakStats[nak].total++;
  if (r.candle.isBullish) nakStats[nak].bull++;
  if (r.candle.isBearish) nakStats[nak].bear++;
  nakStats[nak].netPts += r.candle.netChange;
}

// B. TITHI WIN RATES
const tithiStats: Record<string, { total: number; bull: number; bear: number; netPts: number }> = {};
for (const r of records) {
  const tithi = r.signal.lunarPhase.tithiName;
  if (!tithiStats[tithi]) tithiStats[tithi] = { total: 0, bull: 0, bear: 0, netPts: 0 };
  tithiStats[tithi].total++;
  if (r.candle.isBullish) tithiStats[tithi].bull++;
  if (r.candle.isBearish) tithiStats[tithi].bear++;
  tithiStats[tithi].netPts += r.candle.netChange;
}

// C. PAKSHA WIN RATES
const pakshaStats: Record<string, { total: number; bull: number; bear: number; netPts: number }> = {};
for (const r of records) {
  const paksha = r.signal.lunarPhase.paksha;
  if (!pakshaStats[paksha]) pakshaStats[paksha] = { total: 0, bull: 0, bear: 0, netPts: 0 };
  pakshaStats[paksha].total++;
  if (r.candle.isBullish) pakshaStats[paksha].bull++;
  if (r.candle.isBearish) pakshaStats[paksha].bear++;
  pakshaStats[paksha].netPts += r.candle.netChange;
}

// D. NARAPATI RAHU CHAKRA (JIVA vs MRITA PAKSHA)
const rahuStats: Record<string, { total: number; bull: number; bear: number; netPts: number }> = {};
for (const r of records) {
  const p = r.signal.narapatiSwarodaya.rahuKalanalaHemisphere;
  if (!rahuStats[p]) rahuStats[p] = { total: 0, bull: 0, bear: 0, netPts: 0 };
  rahuStats[p].total++;
  if (r.candle.isBullish) rahuStats[p].bull++;
  if (r.candle.isBearish) rahuStats[p].bear++;
  rahuStats[p].netPts += r.candle.netChange;
}

// E. BRIHAT SAMHITA SCARCITY (MAHARGHA)
const scarcityBullish = records.filter((r) => r.signal.varahamihiraScarcity.scarcityInflationScore > 0);
const abundanceBearish = records.filter((r) => r.signal.varahamihiraScarcity.scarcityInflationScore <= 0);

console.log('=== HIGH-CONFIDENCE ASTROLOGICAL CORRELATIONS (N >= 4) ===\n');

console.log('1. LUNAR PAKSHA (SHUKLA vs KRISHNA):');
for (const [p, s] of Object.entries(pakshaStats)) {
  const bPct = ((s.bull / s.total) * 100).toFixed(1);
  console.log(`  ${p.padEnd(8)}: Total=${s.total}, Bull WinRate=${bPct}% (${s.bull}/${s.total}), Net Change=${s.netPts.toFixed(1)} pts`);
}
console.log('');

console.log('2. NARAPATI JIVA vs MRITA PAKSHA:');
for (const [p, s] of Object.entries(rahuStats)) {
  const bPct = ((s.bull / s.total) * 100).toFixed(1);
  console.log(`  ${p}: Total=${s.total}, Bull WinRate=${bPct}% (${s.bull}/${s.total}), Net Change=${s.netPts.toFixed(1)} pts`);
}
console.log('');

console.log('3. TOP BULLISH NAKSHATRAS (Bull Win Rate >= 65%, N >= 4):');
const topBullNaks = Object.entries(nakStats)
  .filter(([_, s]) => s.total >= 4 && (s.bull / s.total) >= 0.65)
  .sort((a, b) => (b[1].bull / b[1].total) - (a[1].bull / a[1].total));
for (const [nak, s] of topBullNaks) {
  const pct = ((s.bull / s.total) * 100).toFixed(1);
  console.log(`  ⭐ ${nak.padEnd(18)}: ${pct}% Long (${s.bull}/${s.total} days) | Net Gain: +${s.netPts.toFixed(1)} pts`);
}
console.log('');

console.log('4. TOP BEARISH NAKSHATRAS (Bear Win Rate >= 65%, N >= 4):');
const topBearNaks = Object.entries(nakStats)
  .filter(([_, s]) => s.total >= 4 && (s.bear / s.total) >= 0.65)
  .sort((a, b) => (b[1].bear / b[1].total) - (a[1].bear / a[1].total));
for (const [nak, s] of topBearNaks) {
  const pct = ((s.bear / s.total) * 100).toFixed(1);
  console.log(`  🔻 ${nak.padEnd(18)}: ${pct}% Short (${s.bear}/${s.total} days) | Net Drop: ${s.netPts.toFixed(1)} pts`);
}
console.log('');

console.log('5. TOP TITHIS (High Win Rate, N >= 4):');
const highWinTithis = Object.entries(tithiStats)
  .filter(([_, s]) => s.total >= 4 && ((s.bull / s.total) >= 0.65 || (s.bear / s.total) >= 0.65))
  .sort((a, b) => Math.max(b[1].bull / b[1].total, b[1].bear / b[1].total) - Math.max(a[1].bull / a[1].total, a[1].bear / a[1].total));
for (const [tithi, s] of highWinTithis) {
  const bRate = s.bull / s.total;
  if (bRate >= 0.65) {
    console.log(`  🟢 ${tithi.padEnd(20)}: ${((bRate) * 100).toFixed(1)}% Bullish (${s.bull}/${s.total} days) | Net: +${s.netPts.toFixed(1)} pts`);
  } else {
    console.log(`  🔴 ${tithi.padEnd(20)}: ${(((s.bear / s.total)) * 100).toFixed(1)}% Bearish (${s.bear}/${s.total} days) | Net: ${s.netPts.toFixed(1)} pts`);
  }
}
console.log('');

console.log('6. BRIHAT SAMHITA SCARCITY (CH. 41) RESULT:');
const sBullCount = scarcityBullish.filter((r) => r.candle.isBullish).length;
const aBearCount = abundanceBearish.filter((r) => r.candle.isBearish).length;
console.log(`  Mahargha Score > 0 (Scarcity): ${((sBullCount / scarcityBullish.length) * 100).toFixed(1)}% Bullish (${sBullCount}/${scarcityBullish.length}) | Avg Net = ${(scarcityBullish.reduce((a, b) => a + b.candle.netChange, 0) / scarcityBullish.length).toFixed(2)} pts`);
console.log(`  Abundance Score <= 0:          ${((aBearCount / abundanceBearish.length) * 100).toFixed(1)}% Bearish (${aBearCount}/${abundanceBearish.length}) | Avg Net = ${(abundanceBearish.reduce((a, b) => a + b.candle.netChange, 0) / abundanceBearish.length).toFixed(2)} pts`);
