import * as fs from "fs";
import * as path from "path";
import { generateMorningTradingBriefing, MorningBriefingPayload } from "../src/engine/morningTradingBriefing";

// Parse date from CLI args --date=YYYY-MM-DD or default to Oct 29, 2026 / current date
let targetDate = new Date();
const argDate = process.argv.find(a => a.startsWith("--date="));
if (argDate) {
  const dateStr = argDate.split("=")[1];
  const [y, m, d] = dateStr.split("-").map(n => parseInt(n, 10));
  targetDate = new Date(Date.UTC(y, m - 1, d, 11, 0, 0));
} else if (process.argv[2] && /^\d{4}-\d{2}-\d{2}$/.test(process.argv[2])) {
  const [y, m, d] = process.argv[2].split("-").map(n => parseInt(n, 10));
  targetDate = new Date(Date.UTC(y, m - 1, d, 11, 0, 0));
}

const year = targetDate.getUTCFullYear();
const month = targetDate.getUTCMonth() + 1;
const day = targetDate.getUTCDate();

const briefing = generateMorningTradingBriefing(year, month, day);

console.log("\n╔══════════════════════════════════════════════════════════════════════════════════════╗");
console.log(`║ 🏛️  ITALIAN PRE-MARKET TRADING TERMINAL — ROME, ITALY (${briefing.romeTimezone} / UTC+${briefing.timezoneOffsetHours})            ║`);
console.log(`║ 📅 DATE: ${briefing.targetDateStr.padEnd(12)} | SUNRISE: ${briefing.astronomical.sunriseRome.padEnd(10)} | SUNSET: ${briefing.astronomical.sunsetRome.padEnd(12)} ║`);
console.log("╚══════════════════════════════════════════════════════════════════════════════════════╝\n");

console.log("════════════════════════════════════════════════════════════════════════════════════════");
console.log("1. DAILY (D1) MACRO REGIME & EPHEMERIS SCORECARD");
console.log("════════════════════════════════════════════════════════════════════════════════════════");
console.log(`• Weekday (Vaar) : ${briefing.panchanga.vara} (Lord: ${briefing.panchanga.varaLord})`);
console.log(`• Tithi & Paksha : ${briefing.panchanga.tithi} (${briefing.panchanga.paksha} Paksha)`);
console.log(`• Moon Asterism  : ${briefing.panchanga.nakshatra} (Pada ${briefing.panchanga.nakshatraPada}, Lord: ${briefing.panchanga.nakshatraLord})`);
console.log(`• Yoga & Karana  : ${briefing.panchanga.yoga} | ${briefing.panchanga.karana}`);
console.log(`• Dina / Ratri   : Day Duration = ${briefing.astronomical.dayDurationHours}h (${briefing.astronomical.dinaHoraDurationMins}m/hora) | Night = ${briefing.astronomical.nightDurationHours}h (${briefing.astronomical.ratriHoraDurationMins}m/hora)`);

console.log("\n--- Planetary Positions (Rome Topocentric Lahiri) ---");
for (const [name, p] of Object.entries(briefing.planetaryPositions)) {
  const retroTag = p.isRetrograde ? "[RETRO]" : "       ";
  console.log(`  ${name.padEnd(8)}: ${p.rashi.padEnd(12)} ${String(p.degreesInSign).padStart(5)}° | Nak: ${p.nakshatra.padEnd(14)} (p${p.pada}) ${retroTag} | Speed: ${p.speed}°/day`);
}

console.log("\n--- Active Risk & Astrological Override Alerts ---");
if (briefing.alerts.gandantaAlert) console.log(`  🚨 GANDANTA ALERT: ${briefing.alerts.gandantaDescription}`);
if (briefing.alerts.combustionAlert) console.log(`  ⚠️  COMBUSTION ALERT: ${briefing.alerts.combustionDescription}`);
if (briefing.alerts.dwiNeechaAlert) console.log(`  ⚠️  DWI-NEECHA ALERT: Sun in Libra square Mars in Cancer.`);
if (briefing.alerts.rahuAsterismAlert) console.log(`  🌪️  RAHU ASTERISM ALERT: High turbulence / false breakout conditions.`);
if (!briefing.alerts.gandantaAlert && !briefing.alerts.combustionAlert && !briefing.alerts.dwiNeechaAlert && !briefing.alerts.rahuAsterismAlert) {
  console.log(`  ✅ All primary risk gates clear. Standard institutional weekday flow active.`);
}

console.log("\n--- D1 Forecast & Directional Target ---");
console.log(`• Macro Regime   : ${briefing.macroForecastD1.regime}`);
console.log(`• Bias & Drift   : ${briefing.macroForecastD1.directionalBias} (Exp Return: ${briefing.macroForecastD1.expectedReturnPct})`);
console.log(`• Range Target   : ${briefing.macroForecastD1.projectedRangeUsd}`);
console.log(`• Trade Setup    : ${briefing.macroForecastD1.coreTradeSetup}`);

console.log("\n════════════════════════════════════════════════════════════════════════════════════════");
console.log(`2. HOURLY (H1) ROADMAP & KEY TURNING POINTS (${briefing.romeTimezone} / ITALIAN LOCAL TIME)`);
console.log("════════════════════════════════════════════════════════════════════════════════════════");
console.log("Rome Time   | UTC Time | Vedic Hora  | Clock Hora | Lagna       | Kakshya  | Action / Regime");
console.log("----------------------------------------------------------------------------------------");
for (const h of briefing.hourlyRoadmapH1) {
  const star = h.isKeyTurningPoint ? "⭐ " : "   ";
  console.log(
    `${h.romeTime.padEnd(11)} | ${h.utcTime.padEnd(8)} | ${h.vedicHora.padEnd(11)} | ${h.clockHora.padEnd(10)} | ${h.lagna.padEnd(11)} | ${h.kakshyaLord.padEnd(8)} | ${star}${h.actionBias}`
  );
}

console.log("\n════════════════════════════════════════════════════════════════════════════════════════");
console.log("3. 15-MINUTE (M15) MICROSTRUCTURE PLAYBOOK & QUARTERLY EXECUTION");
console.log("════════════════════════════════════════════════════════════════════════════════════════");
console.log(`• ${briefing.microstructureM15.q1ImpulseStrategy}`);
console.log(`• ${briefing.microstructureM15.q2RetracementRule}`);
console.log(`• ${briefing.microstructureM15.q3ExpansionTarget}`);
console.log(`• ${briefing.microstructureM15.q4DragDefense}`);
console.log(`• Prime Windows : ${briefing.microstructureM15.primeExecutionWindows.join(" | ")}`);

// Save briefing markdown artifact to reports/
const reportsDir = path.join(process.cwd(), "reports");
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
const reportFilePath = path.join(reportsDir, `morning_briefing_${briefing.targetDateStr}.md`);

const mdContent = `# 🏛️ Pre-Market Trading Briefing: ${briefing.targetDateStr}
**Location:** Rome, Italy ($41.9028^\\circ\\text{ N}, 12.4964^\\circ\\text{ E}$) | **Timezone:** ${briefing.romeTimezone} (UTC+${briefing.timezoneOffsetHours})  
**Sunrise:** ${briefing.astronomical.sunriseRome} | **Sunset:** ${briefing.astronomical.sunsetRome}

---

## 1. D1 Macro Regime & Panchanga
- **Weekday (Vaar):** ${briefing.panchanga.vara} (Lord: ${briefing.panchanga.varaLord})
- **Tithi:** ${briefing.panchanga.tithi} (${briefing.panchanga.paksha} Paksha)
- **Nakshatra:** ${briefing.panchanga.nakshatra} (Pada ${briefing.panchanga.nakshatraPada}, Lord: ${briefing.panchanga.nakshatraLord})
- **Yoga & Karana:** ${briefing.panchanga.yoga} | ${briefing.panchanga.karana}
- **Macro Regime:** **${briefing.macroForecastD1.regime}**
- **Directional Bias:** **${briefing.macroForecastD1.directionalBias}**
- **Expected Return:** ${briefing.macroForecastD1.expectedReturnPct} | **Expected Range:** ${briefing.macroForecastD1.projectedRangeUsd}
- **Core Trade Setup:** ${briefing.macroForecastD1.coreTradeSetup}

---

## 2. 24-Hour H1 Roadmap (${briefing.romeTimezone} Italian Time)

| Italian Time (${briefing.romeTimezone}) | UTC Time | Vedic Sunrise Hora | Clock Hora | Rome Lagna | Kakshya Lord | Action / Bias |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
${briefing.hourlyRoadmapH1.map(h => `| **${h.romeTime}** | ${h.utcTime} | ${h.vedicHora} | ${h.clockHora} | ${h.lagna} | ${h.kakshyaLord} | ${h.isKeyTurningPoint ? '⭐ ' : ''}${h.actionBias} |`).join("\n")}

---

## 3. M15 Microstructure Playbook
- **${briefing.microstructureM15.q1ImpulseStrategy}**
- **${briefing.microstructureM15.q2RetracementRule}**
- **${briefing.microstructureM15.q3ExpansionTarget}**
- **${briefing.microstructureM15.q4DragDefense}**
- **Prime Trading Windows:** ${briefing.microstructureM15.primeExecutionWindows.join(" • ")}
`;

fs.writeFileSync(reportFilePath, mdContent, "utf-8");
console.log(`\n💾 Saved full briefing dossier to: ${reportFilePath}\n`);
