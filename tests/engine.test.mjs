import test from "node:test";
import assert from "node:assert/strict";
import { getAyanamsha, toSiderealLongitude } from "../src/engine/ayanamsha.ts";
import { getRashi, getNakshatra, getHouse } from "../src/engine/rashiNakshatra.ts";
import { calculateVedicEphemeris } from "../src/engine/ephemeris.ts";
import { POPULAR_CITIES } from "../src/engine/constants.ts";

test("Ayanamsha Calculation - Lahiri J2000 Epoch", () => {
  // JD 2451545.0 is 2000-01-01 12:00:00 UTC
  const lahiriJ2000 = getAyanamsha(2451545.0, "Lahiri");
  assert.ok(Math.abs(lahiriJ2000 - 23.8570917) < 0.001, `Expected ~23.857, got ${lahiriJ2000}`);

  const kpJ2000 = getAyanamsha(2451545.0, "KP");
  assert.ok(Math.abs(kpJ2000 - 23.7657083) < 0.001, `Expected ~23.765, got ${kpJ2000}`);

  const ramanJ2000 = getAyanamsha(2451545.0, "Raman");
  assert.ok(Math.abs(ramanJ2000 - 22.4604722) < 0.001, `Expected ~22.460, got ${ramanJ2000}`);
});

test("Rashi and Nakshatra Derivation", () => {
  // 0° = Mesha, Ashwini Pada 1
  const r0 = getRashi(0);
  const n0 = getNakshatra(0);
  assert.equal(r0.sanskritName, "Mesha");
  assert.equal(n0.sanskritName, "Ashwini");
  assert.equal(n0.pada, 1);

  // 142.31° = Simha (Leo: 120-150°), Nakshatra Purva Phalguni (133°20' - 146°40')
  const r142 = getRashi(142.31);
  const n142 = getNakshatra(142.31);
  assert.equal(r142.sanskritName, "Simha");
  assert.equal(n142.sanskritName, "Purva Phalguni");
  assert.ok(n142.pada >= 1 && n142.pada <= 4);

  // 359.9° = Meena, Revati Pada 4
  const r359 = getRashi(359.9);
  const n359 = getNakshatra(359.9);
  assert.equal(r359.sanskritName, "Meena");
  assert.equal(n359.sanskritName, "Revati");
  assert.equal(n359.pada, 4);
});

test("Full Vedic Ephemeris Output Verification", () => {
  const date = new Date("1998-06-14T09:32:00Z");
  const delhi = POPULAR_CITIES.find((c) => c.cityName === "New Delhi") || POPULAR_CITIES[0];

  const result = calculateVedicEphemeris(date, delhi, "Lahiri", "WholeSign", "Mean");

  // Validate Planets
  assert.ok(result.planets["Sun"]);
  assert.ok(result.planets["Moon"]);
  assert.ok(result.planets["Mars"]);
  assert.ok(result.planets["Mercury"]);
  assert.ok(result.planets["Jupiter"]);
  assert.ok(result.planets["Venus"]);
  assert.ok(result.planets["Saturn"]);
  assert.ok(result.planets["Rahu"]);
  assert.ok(result.planets["Ketu"]);

  // Rahu and Ketu must be 180° apart
  const rahuLon = result.planets["Rahu"].siderealLongitude;
  const ketuLon = result.planets["Ketu"].siderealLongitude;
  const nodeDiff = Math.abs((rahuLon - ketuLon + 360) % 360);
  assert.ok(Math.abs(nodeDiff - 180) < 0.001, `Rahu/Ketu offset must be 180°, got ${nodeDiff}`);

  // Solar Upagrahas Mathematical Rules
  const dhuma = result.upagrahas["Dhuma"].siderealLongitude;
  const vyatipata = result.upagrahas["Vyatipata"].siderealLongitude;
  const parivesha = result.upagrahas["Parivesha"].siderealLongitude;
  const indrachapa = result.upagrahas["Indrachapa"].siderealLongitude;
  const upaketu = result.upagrahas["Upaketu"].siderealLongitude;

  // Dhuma + Vyatipata = 360°
  assert.ok(Math.abs(((dhuma + vyatipata) % 360)) < 0.001);

  // Parivesha - Vyatipata = 180°
  assert.ok(Math.abs(((parivesha - vyatipata + 360) % 360) - 180) < 0.001);

  // Indrachapa + Parivesha = 360°
  assert.ok(Math.abs(((indrachapa + parivesha) % 360)) < 0.001);

  // Diurnal Upagrahas existence
  assert.ok(result.upagrahas["Gulika"]);
  assert.ok(result.upagrahas["Mandi"]);
  assert.ok(result.upagrahas["Kala"]);
  assert.ok(result.upagrahas["Mrityu"]);

  // Panchanga elements
  assert.ok(result.panchanga.tithi.name);
  assert.ok(result.panchanga.nakshatra.sanskritName);
  assert.ok(result.panchanga.yoga.name);
  assert.ok(result.panchanga.karana.name);
  assert.ok(result.panchanga.vara.name);
});

test("Classical Parashari Ashtakavarga & Bhinnaashtakavarga Verification", async () => {
  const { calculateAshtakavarga } = await import("../src/engine/ashtakavarga.ts");
  const date = new Date("2026-08-22T19:00:00Z");
  const city = POPULAR_CITIES[0];
  const ephem = calculateVedicEphemeris(date, city, "Lahiri", "WholeSign", "Mean");

  const av = calculateAshtakavarga(ephem);

  // Total Sarvashtakavarga must strictly equal 337
  assert.equal(av.totalSAV, 337, `Total SAV must be 337, got ${av.totalSAV}`);

  // Sum of SAV across 12 signs must equal 337
  const sumRashiSAV = av.sarvaRashiBindus.reduce((a, b) => a + b, 0);
  assert.equal(sumRashiSAV, 337, `Sum of SAV across Rashis must be 337, got ${sumRashiSAV}`);

  // Sum of SAV across 12 houses must equal 337
  const sumHouseSAV = av.sarvaHouseBindus.reduce((a, b) => a + b, 0);
  assert.equal(sumHouseSAV, 337, `Sum of SAV across Houses must be 337, got ${sumHouseSAV}`);

  // Verify individual classical BAV totals
  assert.equal(av.bav["Sun"].totalBindus, 48, "Sun BAV must have 48 bindus");
  assert.equal(av.bav["Moon"].totalBindus, 49, "Moon BAV must have 49 bindus");
  assert.equal(av.bav["Mars"].totalBindus, 39, "Mars BAV must have 39 bindus");
  assert.equal(av.bav["Mercury"].totalBindus, 54, "Mercury BAV must have 54 bindus");
  assert.equal(av.bav["Jupiter"].totalBindus, 56, "Jupiter BAV must have 56 bindus");
  assert.equal(av.bav["Venus"].totalBindus, 52, "Venus BAV must have 52 bindus");
  assert.equal(av.bav["Saturn"].totalBindus, 39, "Saturn BAV must have 39 bindus");

  // Verify Directional Strength (East 1-5-9, South 2-6-10, West 3-7-11, North 4-8-12)
  const dir = av.directionalAnalysis.overall;
  const dirSum = dir.east + dir.south + dir.west + dir.north;
  assert.equal(dirSum, 337, `Directional sum must equal 337, got ${dirSum}`);
  assert.ok(dir.bestDirection.bindus > 0, "Best direction must have positive bindus");
  assert.equal(dir.directions.length, 4, "Must have 4 directions");

  // Verify planet directional sums
  for (const planetId of ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]) {
    const pDir = av.directionalAnalysis.planetDirections[planetId];
    const pSum = pDir.east + pDir.south + pDir.west + pDir.north;
    assert.equal(pSum, av.bav[planetId].totalBindus, `${planetId} directional sum must equal total BAV`);
  }
});

test("Vedic & Chaldean Numerology Suite Verification", async () => {
  const {
    calculateMulank,
    calculateBhagyank,
    calculateNamank,
    calculateLoshuGrid,
    generateNumerologyReport,
  } = await import("../src/engine/numerology.ts");

  // Test 1: Mulank for Day 22 -> 2+2 = 4 (Rahu)
  const m22 = calculateMulank(22);
  assert.equal(m22.singleDigit, 4);

  // Test 2: Bhagyank for 22 Aug (8) 2026 -> 22+8+2026 = 2056 -> 2+0+5+6 = 13 -> 1+3 = 4
  const b22 = calculateBhagyank(22, 8, 2026);
  assert.equal(b22.singleDigit, 4);

  // Test 3: Chaldean & Pythagorean Name Number for "RAM"
  // R=2, A=1, M=4 -> Chaldean: 2+1+4 = 7
  // R=9, A=1, M=4 -> Pythagorean: 9+1+4 = 14 -> 5
  const nameRam = calculateNamank("RAM");
  assert.equal(nameRam.chaldean.number, 7);
  assert.equal(nameRam.pythagorean.number, 5);

  // Test 4: Loshu Grid 3x3 completeness
  const loshu = calculateLoshuGrid(22, 8, 2026, 4, 4);
  assert.ok(loshu.planes.length === 8);
  assert.ok(loshu.remedies.length === 9);

  // Test 5: Full Report Generator
  const report = generateNumerologyReport(new Date("2026-08-22T00:00:00Z"));
  assert.equal(report.mulank.singleDigit, 4);
  assert.equal(report.mulank.profile.planet, "Rahu");
  assert.ok(report.mulank.profile.luckyColors.length > 0);
});
