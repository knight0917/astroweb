import { getRomeTimezoneOffset } from "../src/engine/morningTradingBriefing";

const testDates = [
  new Date(Date.UTC(2026, 0, 15, 12, 0, 0)),  // Jan 15 (Winter -> CET, UTC+1)
  new Date(Date.UTC(2026, 2, 28, 12, 0, 0)),  // Mar 28 (Winter -> CET, UTC+1)
  new Date(Date.UTC(2026, 2, 30, 12, 0, 0)),  // Mar 30 (Summer -> CEST, UTC+2)
  new Date(Date.UTC(2026, 5, 15, 12, 0, 0)),  // Jun 15 (Summer -> CEST, UTC+2)
  new Date(Date.UTC(2026, 9, 24, 12, 0, 0)),  // Oct 24 (Summer -> CEST, UTC+2)
  new Date(Date.UTC(2026, 9, 26, 12, 0, 0)),  // Oct 26 (Winter -> CET, UTC+1)
  new Date(Date.UTC(2026, 9, 29, 12, 0, 0)),  // Oct 29 (Winter -> CET, UTC+1)
  new Date(Date.UTC(2026, 11, 25, 12, 0, 0)), // Dec 25 (Winter -> CET, UTC+1)
];

console.log("=== ROME TIMEZONE OFFSET AUDIT (2026) ===");
for (const d of testDates) {
  const tz = getRomeTimezoneOffset(d);
  console.log(`${d.toISOString().substring(0, 10)}: Offset = UTC+${tz.offsetHours} | Code = ${tz.tzCode}`);
}
