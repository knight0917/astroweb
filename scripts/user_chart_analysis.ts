import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateShodashavargaChart } from "../src/engine/shodashavarga";
import { calculateJaiminiCharaDasha } from "../src/engine/jaimini";
import { calculateVimshottariDasha } from "../src/engine/dasha";
import { calculateYoginiDasha } from "../src/engine/dashaSystems";
import { RASHI_NAMES } from "../src/engine/constants";

const birthUtc = new Date(Date.UTC(1999, 8, 17, 12, 59, 45));

const location = {
  cityName: "Allahabad",
  country: "India",
  latitude: 25.4358,
  longitude: 81.8463,
  elevation: 98,
  timezoneOffsetHours: 5.5,
};

const ephem = calculateVedicEphemeris(birthUtc, location, "Lahiri", "WholeSign", "Mean");

console.log("=== NATAL D1 CHART (ROOT) ===");
console.log(
  "Ascendant:",
  ephem.ascendant.rashi.englishName,
  `${(ephem.ascendant.siderealLongitude % 30).toFixed(2)}°`,
  "Nakshatra:",
  ephem.ascendant.nakshatra?.sanskritName,
  "Pada:",
  ephem.ascendant.nakshatra?.pada
);

for (const [name, p] of Object.entries(ephem.planets)) {
  if (p.isUpagraha || p.isModernPlanet) continue;
  console.log(
    `${name.padEnd(8)}: House ${String(p.house).padStart(2)} | ${p.rashi.englishName.padEnd(12)} ${(p.siderealLongitude % 30).toFixed(2).padStart(5)}° | Nakshatra: ${(p.nakshatra?.sanskritName || "").padEnd(16)} Pada: ${p.nakshatra?.pada} | Speed: ${p.isRetrograde ? "R" : "D"}`
  );
}

const d9 = calculateShodashavargaChart(ephem, "D9", false, false);
const d9LagnaSignIdx = d9.ascendant.vargaSignIndex;
console.log("\n=== D9 NAVAMSHA CHART (FRUIT) ===");
console.log("D9 Ascendant:", RASHI_NAMES[d9LagnaSignIdx].englishName, `(Sign index: ${d9LagnaSignIdx})`);

for (const p of d9.entities) {
  const d9SignName = RASHI_NAMES[p.vargaSignIndex].englishName;
  console.log(`${p.name.padEnd(8)}: D9 Sign: ${d9SignName.padEnd(12)} (Sign index: ${p.vargaSignIndex}) | D9 House: ${p.house} | Dignity: ${p.dignity}`);
}

// Check Root vs Fruit for houses:
const d1LagnaSignIdx = Math.floor(ephem.ascendant.siderealLongitude / 30);

console.log("\n=== DEEPANSHU GIRI ROOT VS FRUIT (D1 SIGN IN D9 HOUSE POSITION) ===");
for (let h = 1; h <= 12; h++) {
  const d1SignIdx = (d1LagnaSignIdx + (h - 1)) % 12;
  const d1SignName = RASHI_NAMES[d1SignIdx].englishName;
  // Where does this sign fall in D9?
  const d9House = ((d1SignIdx - d9LagnaSignIdx + 12) % 12) + 1;
  console.log(`D1 House ${String(h).padStart(2)} sign [${d1SignName.padEnd(11)}] -> Falls in D9 House ${String(d9House).padStart(2)}!`);
}

// 7th House specific analysis
const d1H7SignIdx = (d1LagnaSignIdx + 6) % 12;
const d1H7SignName = RASHI_NAMES[d1H7SignIdx].englishName;
const d9HouseOfD1H7 = ((d1H7SignIdx - d9LagnaSignIdx + 12) % 12) + 1;
console.log(`\n>>> 7TH HOUSE CRITICAL RULE: D1 7th sign is [${d1H7SignName}]. In D9 Navamsha, [${d1H7SignName}] becomes HOUSE ${d9HouseOfD1H7}!`);

// 10th House career analysis
const d1H10SignIdx = (d1LagnaSignIdx + 9) % 12;
const d1H10SignName = RASHI_NAMES[d1H10SignIdx].englishName;
const d9HouseOfD1H10 = ((d1H10SignIdx - d9LagnaSignIdx + 12) % 12) + 1;
console.log(`>>> 10TH HOUSE CAREER RULE: D1 10th sign is [${d1H10SignName}]. In D9 Navamsha, [${d1H10SignName}] becomes HOUSE ${d9HouseOfD1H10}!`);

// Dasha timing
const now = new Date();
const vim = calculateVimshottariDasha(birthUtc, ephem.planets.Moon.siderealLongitude, now);
console.log("\n=== CURRENT VIMSHOTTARI DASHA (2026) ===");
console.log("Current:", vim.activeDasha?.mahadasha.name, "MD /", vim.activeDasha?.antardasha.name, "AD /", vim.activeDasha?.pratyantardasha?.name, "PD");
if (vim.activeDasha) {
  console.log(`Period: ${vim.activeDasha.adStart.toISOString().split("T")[0]} to ${vim.activeDasha.adEnd.toISOString().split("T")[0]}`);
}

// Show upcoming Vimshottari Mahadashas & Antardashas
console.log("\n=== ALL VIMSHOTTARI DASHAS ===");
if (vim.mahadashas) {
  for (const md of vim.mahadashas) {
    console.log(`MD: ${md.lord.name.padEnd(8)} | ${md.startDate.toISOString().split("T")[0]} to ${md.endDate.toISOString().split("T")[0]}`);
    if (md.antardashas) {
      for (const ad of md.antardashas) {
        if (ad.endDate.getFullYear() >= 2024 && ad.startDate.getFullYear() <= 2032) {
          console.log(`   AD: ${ad.lord.name.padEnd(8)} | ${ad.startDate.toISOString().split("T")[0]} to ${ad.endDate.toISOString().split("T")[0]}`);
        }
      }
    }
  }
}

const chara = calculateJaiminiCharaDasha(birthUtc, ephem.ascendant.siderealLongitude, now);
console.log("\n=== CHARA DASHA (RASHI DASHA) ===");
if (chara.activeDasha) {
  console.log("Current Chara Dasha:", chara.activeDasha.mahadasha.rashi.englishName, "MD /", chara.activeDasha.antardasha.rashi.englishName, "AD");
  console.log(`Period: ${chara.activeDasha.mahadasha.startDate.toISOString().split("T")[0]} to ${chara.activeDasha.mahadasha.endDate.toISOString().split("T")[0]}`);
}

console.log("\nAll Chara Mahadashas:");
if (chara.dashas) {
  for (const cd of chara.dashas) {
    console.log(`Chara MD: ${cd.rashi.englishName.padEnd(12)} (${cd.durationYears} yrs) | ${cd.startDate.toISOString().split("T")[0]} to ${cd.endDate.toISOString().split("T")[0]}`);
  }
}

const yogini = calculateYoginiDasha(birthUtc, ephem.planets.Moon.siderealLongitude, now);
console.log("\n=== YOGINI DASHA ===");
console.log("Current Yogini:", yogini.activeYogini.mahadasha.name, `(${yogini.activeYogini.mahadasha.lord})`, "/", yogini.activeYogini.antardasha.name);
console.log(`Period: ${yogini.activeYogini.adStartDate.toISOString().split("T")[0]} to ${yogini.activeYogini.adEndDate.toISOString().split("T")[0]}`);
