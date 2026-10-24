import fs from 'fs';
import path from 'path';
import { calculateAstroMarketSignal, AstroMarketSignal } from '../src/engine/financialAstro';

interface DailyCandle {
  dateStr: string; // YYYY-MM-DD
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  tickVol: number;
  spread: number;
  range: number;
  netChange: number;
  percentChange: number;
  isBullish: boolean;
  isBearish: boolean;
  regime: 'EXPANSIVE_BULL' | 'EXPANSIVE_BEAR' | 'MODERATE_BULL' | 'MODERATE_BEAR' | 'CHOP_NEUTRAL';
  hodUtcHour?: number;
  lodUtcHour?: number;
  hodRomeHour?: number;
  lodRomeHour?: number;
}

interface H1Candle {
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // HH:mm:ss
  utcHour: number;
  romeHour: number;
  open: number;
  high: number;
  low: number;
  close: number;
  netChange: number;
  isBullish: boolean;
  horaLord?: string;
  moonKakshyaLord?: string;
  sessionName?: string;
}

const DAILY_FILES = [
  'C:\\Users\\singh\\Downloads\\GOLD.pro_Daily_202604010000_202604300000.csv',
  'C:\\Users\\singh\\Downloads\\GOLD.pro_Daily_202605010000_202605290000.csv',
  'C:\\Users\\singh\\Downloads\\GOLD.pro_Daily_202606010000_202606300000.csv',
  'C:\\Users\\singh\\Downloads\\GOLD.pro_Daily_202607010000_202607310000.csv',
  'C:\\Users\\singh\\Downloads\\GOLD.pro_Daily_202608030000_202608310000.csv',
  'C:\\Users\\singh\\Downloads\\GOLD.pro_Daily_202609010000_202609300000.csv',
];

const H1_FILES = [
  'C:\\Users\\singh\\Downloads\\GOLD.pro_H1_202604010000_202604301800.csv',
  'C:\\Users\\singh\\Downloads\\GOLD.pro_H1_202605010000_202605292200.csv',
  'C:\\Users\\singh\\Downloads\\GOLD.pro_H1_202606010000_202606301800.csv',
  'C:\\Users\\singh\\Downloads\\GOLD.pro_H1_202607010000_202607311800.csv',
  'C:\\Users\\singh\\Downloads\\GOLD.pro_H1_202608030000_202608311800.csv',
  'C:\\Users\\singh\\Downloads\\GOLD.pro_H1_202609010000_202609301800.csv',
];

function getRomeHour(date: Date, utcHour: number): number {
  const d = new Date(date);
  d.setUTCHours(utcHour, 0, 0, 0);
  const timeStr = d.toLocaleTimeString('en-GB', {
    timeZone: 'Europe/Rome',
    hour: '2-digit',
    hour12: false,
  });
  return parseInt(timeStr, 10);
}

function parseDailyFiles(): DailyCandle[] {
  const candles: DailyCandle[] = [];

  for (const filePath of DAILY_FILES) {
    if (!fs.existsSync(filePath)) {
      console.warn(`File missing: ${filePath}`);
      continue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split('\t');
      if (parts.length < 5) continue;

      const rawDate = parts[0].trim().replace(/\./g, '-'); // YYYY-MM-DD
      const open = parseFloat(parts[1]);
      const high = parseFloat(parts[2]);
      const low = parseFloat(parts[3]);
      const close = parseFloat(parts[4]);
      const tickVol = parts[5] ? parseInt(parts[5], 10) : 0;
      const spread = parts[7] ? parseInt(parts[7], 10) : 0;

      const range = high - low;
      const netChange = close - open;
      const percentChange = (netChange / open) * 100;
      const isBullish = netChange > 0;
      const isBearish = netChange < 0;

      const dateParts = rawDate.split('-').map(Number);
      const date = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], 12, 0, 0));

      candles.push({
        dateStr: rawDate,
        date,
        open,
        high,
        low,
        close,
        tickVol,
        spread,
        range,
        netChange,
        percentChange,
        isBullish,
        isBearish,
        regime: 'CHOP_NEUTRAL', // Will calculate after average ATR
      });
    }
  }

  // Calculate 14-day rolling ATR or median range
  const avgRange = candles.reduce((acc, c) => acc + c.range, 0) / candles.length;

  for (const c of candles) {
    if (c.netChange > avgRange * 0.45) {
      c.regime = 'EXPANSIVE_BULL';
    } else if (c.netChange < -avgRange * 0.45) {
      c.regime = 'EXPANSIVE_BEAR';
    } else if (c.netChange > 0) {
      c.regime = 'MODERATE_BULL';
    } else if (c.netChange < 0) {
      c.regime = 'MODERATE_BEAR';
    } else {
      c.regime = 'CHOP_NEUTRAL';
    }
  }

  return candles;
}

function parseH1Files(): Map<string, H1Candle[]> {
  const dailyH1Map = new Map<string, H1Candle[]>();

  for (const filePath of H1_FILES) {
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split('\t');
      if (parts.length < 6) continue;

      const rawDate = parts[0].trim().replace(/\./g, '-');
      const timeStr = parts[1].trim(); // HH:mm:ss
      const utcHour = parseInt(timeStr.split(':')[0], 10);
      const open = parseFloat(parts[2]);
      const high = parseFloat(parts[3]);
      const low = parseFloat(parts[4]);
      const close = parseFloat(parts[5]);
      const netChange = close - open;

      const dateParts = rawDate.split('-').map(Number);
      const date = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));
      const romeHour = getRomeHour(date, utcHour);

      const h1: H1Candle = {
        dateStr: rawDate,
        timeStr,
        utcHour,
        romeHour,
        open,
        high,
        low,
        close,
        netChange,
        isBullish: netChange >= 0,
      };

      if (!dailyH1Map.has(rawDate)) {
        dailyH1Map.set(rawDate, []);
      }
      dailyH1Map.get(rawDate)!.push(h1);
    }
  }

  return dailyH1Map;
}

async function runAnalysis() {
  console.log('===============================================================');
  console.log('ASTRO-QUANT GOLD.PRO EMPIRICAL CORRELATION ENGINE (APR - SEP 2026)');
  console.log('===============================================================\n');

  const dailyCandles = parseDailyFiles();
  const h1Map = parseH1Files();

  console.log(`Parsed ${dailyCandles.length} Daily candles.`);
  console.log(`Parsed H1 series across ${h1Map.size} trading sessions.\n`);

  // Enrich Daily candles with HOD and LOD hour
  for (const d of dailyCandles) {
    const h1Bars = h1Map.get(d.dateStr);
    if (h1Bars && h1Bars.length > 0) {
      let maxHigh = -Infinity;
      let minLow = Infinity;
      let hodUtc = 0;
      let lodUtc = 0;

      for (const bar of h1Bars) {
        if (bar.high > maxHigh) {
          maxHigh = bar.high;
          hodUtc = bar.utcHour;
        }
        if (bar.low < minLow) {
          minLow = bar.low;
          lodUtc = bar.utcHour;
        }
      }

      d.hodUtcHour = hodUtc;
      d.lodUtcHour = lodUtc;
      d.hodRomeHour = getRomeHour(d.date, hodUtc);
      d.lodRomeHour = getRomeHour(d.date, lodUtc);
    }
  }

  // Correlate with Astrological Signal for each day
  interface EnrichedDayRecord {
    candle: DailyCandle;
    astro: AstroMarketSignal;
  }

  const enrichedData: EnrichedDayRecord[] = [];

  for (const c of dailyCandles) {
    const signal = calculateAstroMarketSignal('XAUUSD', c.date);
    enrichedData.push({ candle: c, astro: signal });
  }

  // 1. DIRECTIONAL BIAS ACCURACY
  let totalPredicted = 0;
  let correctDirectionCount = 0;
  let strongBullishPredicted = 0;
  let strongBullishWins = 0;
  let strongBearishPredicted = 0;
  let strongBearishWins = 0;

  for (const item of enrichedData) {
    const bias = item.astro.signals.directionalBias;
    const isBull = item.candle.isBullish;
    const isBear = item.candle.isBearish;

    if (Math.abs(bias) >= 0.15) {
      totalPredicted++;
      if (bias > 0 && isBull) correctDirectionCount++;
      if (bias < 0 && isBear) correctDirectionCount++;
    }

    if (bias >= 0.35) {
      strongBullishPredicted++;
      if (isBull) strongBullishWins++;
    } else if (bias <= -0.35) {
      strongBearishPredicted++;
      if (isBear) strongBearishWins++;
    }
  }

  console.log('--- 1. SHODASHA DAILY DIRECTIONAL BIAS ACCURACY ---');
  console.log(`Overall Bias Win Rate (|Bias| >= 0.15): ${((correctDirectionCount / totalPredicted) * 100).toFixed(1)}% (${correctDirectionCount}/${totalPredicted} days)`);
  if (strongBullishPredicted > 0) {
    console.log(`Strong Bullish Signal Win Rate (Bias >= +0.35): ${((strongBullishWins / strongBullishPredicted) * 100).toFixed(1)}% (${strongBullishWins}/${strongBullishPredicted} days)`);
  }
  if (strongBearishPredicted > 0) {
    console.log(`Strong Bearish Signal Win Rate (Bias <= -0.35): ${((strongBearishWins / strongBearishPredicted) * 100).toFixed(1)}% (${strongBearishWins}/${strongBearishPredicted} days)`);
  }
  console.log('');

  // 2. VAAR (WEEKDAY LORD) WIN RATE & VOLATILITY
  const vaarStats: Record<string, { total: number; bullWins: number; totalPips: number; avgRange: number }> = {};

  for (const item of enrichedData) {
    const dayName = item.candle.date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
    if (!vaarStats[dayName]) {
      vaarStats[dayName] = { total: 0, bullWins: 0, totalPips: 0, avgRange: 0 };
    }
    vaarStats[dayName].total++;
    if (item.candle.isBullish) vaarStats[dayName].bullWins++;
    vaarStats[dayName].totalPips += item.candle.netChange;
    vaarStats[dayName].avgRange += item.candle.range;
  }

  console.log('--- 2. VAAR (WEEKDAY LORD) PERFORMANCE ON GOLD.PRO ---');
  for (const [day, s] of Object.entries(vaarStats)) {
    const winRate = ((s.bullWins / s.total) * 100).toFixed(1);
    const avgChange = (s.totalPips / s.total).toFixed(2);
    const avgR = (s.avgRange / s.total).toFixed(2);
    console.log(`${day.padEnd(10)}: Bull Win Rate = ${winRate}% (${s.bullWins}/${s.total}) | Avg Net Change = ${avgChange} pts | Avg Daily Range = ${avgR} pts`);
  }
  console.log('');

  // 3. DIKSHIT LIQUIDITY ACTIONS
  const dikshitStats: Record<string, { total: number; bullWins: number; bearWins: number; avgChange: number }> = {};

  for (const item of enrichedData) {
    const action = item.astro.dikshitLiquidityCycle.action;
    if (!dikshitStats[action]) {
      dikshitStats[action] = { total: 0, bullWins: 0, bearWins: 0, avgChange: 0 };
    }
    dikshitStats[action].total++;
    if (item.candle.isBullish) dikshitStats[action].bullWins++;
    if (item.candle.isBearish) dikshitStats[action].bearWins++;
    dikshitStats[action].avgChange += item.candle.netChange;
  }

  console.log('--- 3. PANDIT HIRA LAL DIKSHIT LIQUIDITY CYCLE ACCURACY ---');
  for (const [act, s] of Object.entries(dikshitStats)) {
    const bullRate = ((s.bullWins / s.total) * 100).toFixed(1);
    const avgPts = (s.avgChange / s.total).toFixed(2);
    console.log(`${act.padEnd(25)}: Bull Win Rate = ${bullRate}% (${s.bullWins}/${s.total}) | Avg Change = ${avgPts} pts`);
  }
  console.log('');

  // 4. HOD & LOD FORMATION TIMING (UTC & ROME TIME)
  const hodHourCounts: Record<number, number> = {};
  const lodHourCounts: Record<number, number> = {};

  for (const item of enrichedData) {
    if (item.candle.hodRomeHour !== undefined) {
      hodHourCounts[item.candle.hodRomeHour] = (hodHourCounts[item.candle.hodRomeHour] || 0) + 1;
    }
    if (item.candle.lodRomeHour !== undefined) {
      lodHourCounts[item.candle.lodRomeHour] = (lodHourCounts[item.candle.lodRomeHour] || 0) + 1;
    }
  }

  console.log('--- 4. INTRADAY TURNING POINT HOURS (HIGH & LOW OF DAY IN ROME TIME) ---');
  const sortedHod = Object.entries(hodHourCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const sortedLod = Object.entries(lodHourCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  console.log('Top 5 Peak High-of-Day (HOD) Hours (Rome Time):');
  for (const [hr, count] of sortedHod) {
    const pct = ((count / enrichedData.length) * 100).toFixed(1);
    const utcHr = (parseInt(hr, 10) - 2 + 24) % 24; // CEST
    console.log(`  ⏰ ${hr.padStart(2, '0')}:00 Rome (${utcHr.toString().padStart(2, '0')}:00 UTC) -> ${count} days (${pct}%)`);
  }

  console.log('\nTop 5 Peak Low-of-Day (LOD) Hours (Rome Time):');
  for (const [hr, count] of sortedLod) {
    const pct = ((count / enrichedData.length) * 100).toFixed(1);
    const utcHr = (parseInt(hr, 10) - 2 + 24) % 24;
    console.log(`  ⏰ ${hr.padStart(2, '0')}:00 Rome (${utcHr.toString().padStart(2, '0')}:00 UTC) -> ${count} days (${pct}%)`);
  }
  console.log('');

  // 5. INTRADAY HORA WIN-RATES ACROSS ALL 2,952 H1 CANDLES
  const horaStats: Record<string, { totalHours: number; bullishHours: number; netPips: number }> = {};

  for (const item of enrichedData) {
    const dateStr = item.candle.dateStr;
    const h1Bars = h1Map.get(dateStr);
    const timeline = item.astro.intradayTimeline;

    if (h1Bars && timeline) {
      for (const bar of h1Bars) {
        const slice = timeline.find((s) => s.hourUtc === bar.utcHour);
        if (slice) {
          const lord = slice.horaLord;
          if (!horaStats[lord]) {
            horaStats[lord] = { totalHours: 0, bullishHours: 0, netPips: 0 };
          }
          horaStats[lord].totalHours++;
          if (bar.isBullish) horaStats[lord].bullishHours++;
          horaStats[lord].netPips += bar.netChange;
        }
      }
    }
  }

  console.log('--- 5. INTRADAY HORA LORD EDGE ACROSS 2,952 HOURLY BARS ---');
  for (const [lord, s] of Object.entries(horaStats)) {
    const winRate = ((s.bullishHours / s.totalHours) * 100).toFixed(1);
    const avgPip = (s.netPips / s.totalHours).toFixed(2);
    console.log(`${lord.padEnd(10)}: Bull Win Rate = ${winRate}% (${s.bullishHours}/${s.totalHours} hrs) | Total Net Change = ${s.netPips.toFixed(1)} pts | Avg Per Hour = ${avgPip} pts`);
  }

  // Output discovery artifact
  const discoveryOutput = {
    totalDailyCandles: dailyCandles.length,
    totalH1Bars: Array.from(h1Map.values()).reduce((a, b) => a + b.length, 0),
    overallBiasAccuracyPct: ((correctDirectionCount / totalPredicted) * 100).toFixed(1),
    strongBullishWinRatePct: strongBullishPredicted > 0 ? ((strongBullishWins / strongBullishPredicted) * 100).toFixed(1) : 'N/A',
    strongBearishWinRatePct: strongBearishPredicted > 0 ? ((strongBearishWins / strongBearishPredicted) * 100).toFixed(1) : 'N/A',
    vaarStats,
    dikshitStats,
    sortedHod,
    sortedLod,
    horaStats,
  };

  fs.writeFileSync('scripts/astro_quant_results.json', JSON.stringify(discoveryOutput, null, 2), 'utf-8');
  console.log('\nSaved full quantitative results to scripts/astro_quant_results.json');
}

runAnalysis().catch((err) => {
  console.error('Analysis error:', err);
});
