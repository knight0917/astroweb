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

test("Vedic Tithi Birthday & Tithi Pravesha Verification", async () => {
  const { calculateTithiBirthday } = await import("../src/engine/tithiBirthday.ts");

  const birthDate = new Date("1998-05-25T12:00:00Z");
  const refDate = new Date("2026-08-23T00:00:00Z");

  const result = calculateTithiBirthday(birthDate, undefined, "Lahiri", refDate);

  // Assert birth tithi details
  assert.ok(result.birthDetails.tithiName.length > 0, "Birth Tithi name must be present");
  assert.ok(result.birthDetails.masaName.length > 0, "Birth Masa name must be present");
  assert.ok(result.birthDetails.tithiDeity.length > 0, "Birth Tithi Deity must be present");

  // Assert next birthday
  assert.ok(result.nextBirthday.gregorianDate.getTime() > refDate.getTime(), "Next birthday must be in future");
  assert.ok(result.nextBirthday.daysRemaining >= 0, "Days remaining must be non-negative");
  assert.ok(result.nextBirthday.formattedDate.length > 0, "Formatted date must be present");

  // Assert last birthday and past birthdays archive
  assert.ok(result.lastBirthday, "Last birthday must be calculated");
  assert.ok(result.lastBirthday.isPast, "Last birthday isPast must be true");
  assert.ok(result.pastBirthdays.length > 0, "Must compute past birthdays");

  // Assert 5-year upcoming birthdays list
  assert.equal(result.upcomingBirthdays.length, 5, "Must compute 5 upcoming birthdays");
  assert.ok(result.vedicRituals.lifestyleRules.length > 0, "Ritual rules must be populated");
});

test("Classical Parashari Shodashavarga (16 Divisional Charts) Verification", async () => {
  const { calculateVargaSign, calculateShodashavargaChart, VARGA_DEFINITIONS } = await import(
    "../src/engine/shodashavarga.ts"
  );
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  // 1. Verify all 16 Vargas are defined
  const vargaKeys = Object.keys(VARGA_DEFINITIONS);
  assert.equal(vargaKeys.length, 16, "Must define exactly 16 Parashari Shodashavargas");

  // 2. Test D9 Navamsha:
  // 0 deg Aries (Mesha, Fire, part 0) -> Aries (0)
  assert.equal(calculateVargaSign(0.5, "D9"), 0);
  // 3 deg 25 min Aries (part 1) -> Taurus (1)
  assert.equal(calculateVargaSign(3.5, "D9"), 1);
  // 0 deg Taurus (Vrishabha, Earth, part 0) -> Capricorn (9)
  assert.equal(calculateVargaSign(30.5, "D9"), 9);
  // 0 deg Gemini (Mithuna, Air, part 0) -> Libra (6)
  assert.equal(calculateVargaSign(60.5, "D9"), 6);
  // 0 deg Cancer (Karka, Water, part 0) -> Cancer (3)
  assert.equal(calculateVargaSign(90.5, "D9"), 3);

  // 3. Test D2 Hora:
  // Odd sign (Aries, sign 0): 0-15 deg -> Sun/Leo (4), 15-30 deg -> Moon/Cancer (3)
  assert.equal(calculateVargaSign(5, "D2"), 4);
  assert.equal(calculateVargaSign(20, "D2"), 3);
  // Even sign (Taurus, sign 1): 0-15 deg -> Moon/Cancer (3), 15-30 deg -> Sun/Leo (4)
  assert.equal(calculateVargaSign(35, "D2"), 3);
  assert.equal(calculateVargaSign(50, "D2"), 4);

  // 4. Test D3 Drekkana:
  // Aries (0): 0-10 deg -> Aries (0), 10-20 deg -> Leo (4), 20-30 deg -> Sagittarius (8)
  assert.equal(calculateVargaSign(5, "D3"), 0);
  assert.equal(calculateVargaSign(15, "D3"), 4);
  assert.equal(calculateVargaSign(25, "D3"), 8);

  // 5. Test D10 Dashamsha:
  // Odd sign (Aries, sign 0): 0-3 deg -> Aries (0), 3-6 deg -> Taurus (1)...
  assert.equal(calculateVargaSign(1.5, "D10"), 0);
  assert.equal(calculateVargaSign(4.5, "D10"), 1);
  // Even sign (Taurus, sign 1): starts from 9th (Taurus + 8 = Capricorn / 9)
  assert.equal(calculateVargaSign(31.5, "D10"), 9);

  // 6. Test D60 Shashtiamsha:
  // Aries 0.25 deg -> Aries (0), Aries 0.75 deg -> Taurus (1)
  assert.equal(calculateVargaSign(0.25, "D60"), 0);
  assert.equal(calculateVargaSign(0.75, "D60"), 1);

  // 7. Full Shodashavarga Chart Generator Verification
  const ephem = calculateVedicEphemeris(
    new Date("2026-08-23T12:00:00Z"),
    { cityName: "Delhi", latitude: 28.6139, longitude: 77.209, timezoneOffsetHours: 5.5, country: "India" }
  );

  for (const vKey of vargaKeys) {
    const vChart = calculateShodashavargaChart(ephem, vKey);
    assert.ok(vChart.ascendant.vargaSignIndex >= 0 && vChart.ascendant.vargaSignIndex <= 11);
    assert.ok(vChart.entities.length >= 9, "Must contain at least 9 planetary entities");
    assert.ok(Object.keys(vChart.houseOccupants).length === 12, "Must contain all 12 houses");
  }
});

test("Classical Parashari Shadbala (6-Fold Planetary Strength) Verification", async () => {
  const { calculateShadbala } = await import("../src/engine/shadbala.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const ephem = calculateVedicEphemeris(
    new Date("2026-08-23T12:00:00Z"),
    { cityName: "Prayagraj", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5, country: "India" }
  );

  const shadbala = calculateShadbala(ephem);

  // 1. Verify all 7 classical grahas exist in result
  const planetIds = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  for (const pId of planetIds) {
    const p = shadbala.planets[pId];
    assert.ok(p, `Planet ${pId} must be present in Shadbala`);
    assert.ok(p.sthanaBala.total > 0, `${pId} Sthana Bala must be > 0`);
    assert.ok(p.digBala >= 0 && p.digBala <= 60, `${pId} Dig Bala must be between 0 and 60`);
    assert.ok(p.kalaBala.total > 0, `${pId} Kala Bala must be > 0`);
    assert.ok(p.totalRupas > 0, `${pId} total Rupas must be > 0`);
    assert.ok(p.requiredRupas > 0, `${pId} required Rupas must be > 0`);
    assert.ok(p.strengthRatio > 0, `${pId} strength ratio must be > 0`);
    assert.ok(p.rank >= 1 && p.rank <= 7, `${pId} rank must be between 1 and 7`);
  }

  // 2. Verify ranked list
  assert.equal(shadbala.rankedPlanets.length, 7, "Ranked list must have 7 planets");
  assert.equal(shadbala.rankedPlanets[0].rank, 1, "First planet must have rank 1");
  assert.equal(shadbala.rankedPlanets[6].rank, 7, "Last planet must have rank 7");

  // 3. Verify Naisargika fixed constants
  assert.equal(shadbala.planets["Sun"].naisargikaBala, 60.0);
  assert.equal(shadbala.planets["Moon"].naisargikaBala, 51.43);
  assert.equal(shadbala.planets["Venus"].naisargikaBala, 42.86);
  assert.equal(shadbala.planets["Jupiter"].naisargikaBala, 34.29);
  assert.equal(shadbala.planets["Mercury"].naisargikaBala, 25.71);
  assert.equal(shadbala.planets["Mars"].naisargikaBala, 17.14);
  assert.equal(shadbala.planets["Saturn"].naisargikaBala, 8.57);
});

test("Classical Parashari Bhava Bala (12 House Strengths) Verification", async () => {
  const { calculateBhavaBala } = await import("../src/engine/bhavabala.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const ephem = calculateVedicEphemeris(
    new Date("2026-08-23T12:00:00Z"),
    { cityName: "Prayagraj", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5, country: "India" }
  );

  const bb = calculateBhavaBala(ephem);

  // 1. Verify all 12 houses exist
  for (let h = 1; h <= 12; h++) {
    const house = bb.houses[h];
    assert.ok(house, `House ${h} must exist in Bhava Bala`);
    assert.ok(house.bhavaadhipatiBala > 0, `House ${h} Lord Bala must be > 0`);
    assert.ok(house.totalRupas > 0, `House ${h} total Rupas must be > 0`);
    assert.ok(house.requiredRupas > 0, `House ${h} required Rupas must be > 0`);
    assert.ok(house.strengthRatio > 0, `House ${h} ratio must be > 0`);
    assert.ok(house.rank >= 1 && house.rank <= 12, `House ${h} rank must be between 1 and 12`);
  }

  // 2. Verify Kendra, Panapara, Apoklima required Rupas thresholds
  assert.equal(bb.houses[1].requiredRupas, 6.0, "H1 Kendra must require 6.0 Rupas");
  assert.equal(bb.houses[4].requiredRupas, 6.0, "H4 Kendra must require 6.0 Rupas");
  assert.equal(bb.houses[7].requiredRupas, 6.0, "H7 Kendra must require 6.0 Rupas");
  assert.equal(bb.houses[10].requiredRupas, 6.0, "H10 Kendra must require 6.0 Rupas");

  assert.equal(bb.houses[2].requiredRupas, 5.5, "H2 Panapara must require 5.5 Rupas");
  assert.equal(bb.houses[5].requiredRupas, 5.5, "H5 Panapara must require 5.5 Rupas");
  assert.equal(bb.houses[8].requiredRupas, 5.5, "H8 Panapara must require 5.5 Rupas");
  assert.equal(bb.houses[11].requiredRupas, 5.5, "H11 Panapara must require 5.5 Rupas");

  assert.equal(bb.houses[3].requiredRupas, 5.0, "H3 Apoklima must require 5.0 Rupas");
  assert.equal(bb.houses[6].requiredRupas, 5.0, "H6 Apoklima must require 5.0 Rupas");
  assert.equal(bb.houses[9].requiredRupas, 5.0, "H9 Apoklima must require 5.0 Rupas");
  assert.equal(bb.houses[12].requiredRupas, 5.0, "H12 Apoklima must require 5.0 Rupas");

  // 3. Verify ranked array length and sorting
  assert.equal(bb.rankedHouses.length, 12, "Ranked list must have 12 houses");
  assert.equal(bb.rankedHouses[0].rank, 1, "First house must have rank 1");
  assert.equal(bb.rankedHouses[11].rank, 12, "Last house must have rank 12");
});

test("Classical Jaimini Chara Karakas (AK to DK) Verification", async () => {
  const {
    calculateJaiminiKarakas,
    calculateArudhaPadas,
    analyzeKarakamsha,
    calculateJaiminiCharaDasha,
    calculateJaiminiRashiDrishti,
  } = await import("../src/engine/jaimini.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  // 25 May 1998 00:16 IST
  const birthDate = new Date(Date.UTC(1998, 4, 24, 18, 46, 0));
  const ephem = calculateVedicEphemeris(
    birthDate,
    { cityName: "Mau", latitude: 25.9416, longitude: 83.5611, timezoneOffsetHours: 5.5, country: "India" }
  );

  const jaimini = calculateJaiminiKarakas(ephem);

  // 1. Verify 7 Karakas exist in order
  assert.equal(jaimini.karakas.length, 7, "Must contain exactly 7 Chara Karakas");
  assert.equal(jaimini.karakas[0].code, "AK");
  assert.equal(jaimini.karakas[1].code, "AmK");
  assert.equal(jaimini.karakas[2].code, "BK");
  assert.equal(jaimini.karakas[3].code, "MK");
  assert.equal(jaimini.karakas[4].code, "PK");
  assert.equal(jaimini.karakas[5].code, "GK");
  assert.equal(jaimini.karakas[6].code, "DK");

  // 2. Degrees must be strictly descending
  for (let i = 0; i < jaimini.karakas.length - 1; i++) {
    assert.ok(
      jaimini.karakas[i].degreesInSign >= jaimini.karakas[i + 1].degreesInSign,
      `${jaimini.karakas[i].code} (${jaimini.karakas[i].degreesInSign}) must have >= degrees than ${jaimini.karakas[i + 1].code} (${jaimini.karakas[i + 1].degreesInSign})`
    );
  }

  // 3. For 25 May 1998 00:16 IST: Jupiter (29° 49') is AK, Venus (0° 08') is DK
  assert.equal(jaimini.atmakaraka.planetId, "Jupiter", "Jupiter must be Atmakaraka (AK)");
  assert.equal(jaimini.darakaraka.planetId, "Venus", "Venus must be Darakaraka (DK)");
  assert.equal(jaimini.amatyakaraka.planetId, "Moon", "Moon must be Amatyakaraka (AmK)");

  // 4. Verify 12 Arudha Padas (A1 to A12)
  const padas = calculateArudhaPadas(ephem);
  assert.equal(padas.length, 12, "Must calculate all 12 Arudha Padas");
  assert.equal(padas[0].code, "AL", "First Pada must be Arudha Lagna (AL)");
  assert.equal(padas[11].code, "UL", "Twelfth Pada must be Upapada Lagna (UL)");
  padas.forEach((p) => {
    assert.ok(p.padaHouse >= 1 && p.padaHouse <= 12, "Pada house must be between 1 and 12");
    assert.ok(p.padaSignIndex >= 0 && p.padaSignIndex <= 11, "Pada sign index must be between 0 and 11");
  });

  // 5. Verify Karakamsha & Swamsha analysis
  const karakamsha = analyzeKarakamsha(ephem);
  assert.equal(karakamsha.atmakaraka.planetId, "Jupiter");
  assert.ok(karakamsha.karakamshaRashi.englishName);
  assert.ok(karakamsha.swamshaRashi.englishName);
  assert.ok(karakamsha.ishtaDevata.deity);

  // 6. Verify Jaimini Chara Dasha
  const charaDasha = calculateJaiminiCharaDasha(birthDate, ephem.ascendant.siderealLongitude, new Date());
  assert.equal(charaDasha.dashas.length, 12, "Must have 12 Mahadashas");
  assert.ok(charaDasha.activeDasha.mahadasha.rashi.englishName);
  assert.ok(charaDasha.activeDasha.percentageCompleteMD >= 0 && charaDasha.activeDasha.percentageCompleteMD <= 100);

  // 7. Verify Jaimini Rashi Drishti (Movable aspects Fixed except adjacent, Fixed aspects Movable, Dual aspects Dual)
  const ariesDrishti = calculateJaiminiRashiDrishti(0); // Aries (Movable)
  assert.equal(ariesDrishti.signType, "Chara (Movable)");
  const aspectedByAries = ariesDrishti.aspectedSigns.map((s) => s.englishName);
  assert.ok(aspectedByAries.includes("Leo"));
  assert.ok(aspectedByAries.includes("Scorpio"));
  assert.ok(aspectedByAries.includes("Aquarius"));
  assert.ok(!aspectedByAries.includes("Taurus"), "Aries cannot aspect adjacent Taurus");
});

test("Classical Ashtakoota 36-Guna Matchmaking & Manglik Dosha Verification", async () => {
  const { calculateMatchmaking, evaluateManglikDosha } = await import("../src/engine/matchmaking.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const boyDate = new Date("1998-05-25T00:16:00Z");
  const girlDate = new Date("2000-09-14T14:30:00Z");
  const loc = { cityName: "Delhi", latitude: 28.6139, longitude: 77.209, timezoneOffsetHours: 5.5, country: "India" };

  const boyEphem = calculateVedicEphemeris(boyDate, loc, "Lahiri", "WholeSign", "Mean");
  const girlEphem = calculateVedicEphemeris(girlDate, loc, "Lahiri", "WholeSign", "Mean");

  const result = calculateMatchmaking(boyEphem, girlEphem);

  // 1. Gunas must sum to total score (0 to 36)
  assert.ok(result.totalScore >= 0 && result.totalScore <= 36, "Total score must be between 0 and 36");
  assert.equal(result.maxScore, 36);
  assert.ok(result.percentage >= 0 && result.percentage <= 100);

  // 2. Verify all 8 Kootas exist with proper max scores
  assert.equal(result.kootas.varna.maxScore, 1);
  assert.equal(result.kootas.vashya.maxScore, 2);
  assert.equal(result.kootas.tara.maxScore, 3);
  assert.equal(result.kootas.yoni.maxScore, 4);
  assert.equal(result.kootas.grahaMaitri.maxScore, 5);
  assert.equal(result.kootas.gana.maxScore, 6);
  assert.equal(result.kootas.bhakoot.maxScore, 7);
  assert.equal(result.kootas.nadi.maxScore, 8);

  // 3. Verify Manglik Dosha Evaluation
  const boyManglik = evaluateManglikDosha(boyEphem);
  const girlManglik = evaluateManglikDosha(girlEphem);
  assert.ok(typeof boyManglik.isManglik === "boolean");
  assert.ok(typeof girlManglik.isManglik === "boolean");
  assert.ok(result.manglikCompatibility.statusText);
  assert.ok(result.verdict);
});

test("Classical Auspicious Muhurta Finder & Panchanga Shuddhi Verification", async () => {
  const { calculateDayMuhurta, evaluateEventMuhurta } = await import("../src/engine/muhurta.ts");

  const testDate = new Date("2026-08-27T10:00:00Z");
  const loc = { cityName: "Varanasi", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5, country: "India" };

  const dayData = calculateDayMuhurta(testDate, loc);

  // 1. Check Day Data
  assert.ok(dayData.sunrise instanceof Date);
  assert.ok(dayData.sunset instanceof Date);
  assert.ok(dayData.sunrise < dayData.sunset, "Sunrise must be earlier than sunset");
  assert.ok(dayData.dayDurationHours > 0 && dayData.dayDurationHours < 24);
  assert.ok(dayData.shuddhiScore >= 0 && dayData.shuddhiScore <= 100);

  // 2. Auspicious slots check (Abhijit, Brahma, Godhuli, Amrit Kaal)
  assert.ok(dayData.auspiciousSlots.length >= 4, "Must contain standard auspicious Muhurtas");
  const slotTypes = dayData.auspiciousSlots.map((s) => s.type);
  assert.ok(slotTypes.includes("Abhijit"));
  assert.ok(slotTypes.includes("Brahma"));
  assert.ok(slotTypes.includes("Godhuli"));

  // 3. Inauspicious slots check (Rahu Kaal, Gulika, Yamaganda)
  assert.equal(dayData.inauspiciousSlots.length, 3, "Must calculate Rahu, Gulika and Yamaganda");
  const inauspiciousTypes = dayData.inauspiciousSlots.map((s) => s.type);
  assert.ok(inauspiciousTypes.includes("RahuKaal"));
  assert.ok(inauspiciousTypes.includes("GulikaKaal"));
  assert.ok(inauspiciousTypes.includes("Yamaganda"));

  // 4. Event Suitability Evaluations
  const griha = evaluateEventMuhurta("grihaPravesh", dayData);
  assert.ok(typeof griha.isRecommended === "boolean");
  assert.ok(griha.suitabilityScore >= 0 && griha.suitabilityScore <= 100);
  assert.ok(griha.bestTimeSlots.length > 0);

  const vivaha = evaluateEventMuhurta("vivaha", dayData);
  assert.ok(typeof vivaha.isRecommended === "boolean");
});

test("Classical Tajik Prashna (Horary) 16 Yogas & Yes/No Verdict Verification", async () => {
  const { evaluatePrashna, PRASHNA_TOPICS } = await import("../src/engine/prashna.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const queryDate = new Date("2026-08-27T10:00:00Z");
  const loc = { cityName: "Varanasi", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5, country: "India" };
  const ephem = calculateVedicEphemeris(queryDate, loc);

  // 1. Evaluate Career Prashna
  const careerPrashna = evaluatePrashna("career", ephem, 45);
  assert.equal(careerPrashna.topic.id, "career");
  assert.equal(careerPrashna.karyaHouse, 10);
  assert.ok(careerPrashna.lagnesha, "Lagnesha must be identified");
  assert.ok(careerPrashna.karyesha, "Karyesha must be identified");
  assert.ok(careerPrashna.confidenceScore >= 0 && careerPrashna.confidenceScore <= 100);
  assert.ok(careerPrashna.verdict, "Must have an authoritative verdict");
  assert.ok(careerPrashna.timingPrediction, "Must provide manifestation timing prediction");

  // 2. Evaluate Marriage Prashna
  const marriagePrashna = evaluatePrashna("marriage", ephem);
  assert.equal(marriagePrashna.topic.id, "marriage");
  assert.equal(marriagePrashna.karyaHouse, 7);
  assert.ok(marriagePrashna.applyingAspect.aspectType);
  assert.ok(marriagePrashna.applyingAspect.maxAllowedOrb > 0);

  // 3. Verify All 9 Topics Exist
  assert.equal(Object.keys(PRASHNA_TOPICS).length, 9, "Must support 9 classical Prashna topics");
});

test("Classical Vedic Tithi & Panchanga Calendar Suite Verification", async () => {
  const { getMonthlyTithiCalendar } = await import("../src/engine/tithiCalendar.ts");

  const location = {
    cityName: "Varanasi",
    country: "India",
    latitude: 25.3176,
    longitude: 82.9739,
    timezoneOffsetHours: 5.5,
  };

  // 1. Verify August 2026 calendar
  const calAug2026 = getMonthlyTithiCalendar(2026, 8, location);
  assert.equal(calAug2026.year, 2026);
  assert.equal(calAug2026.month, 8);
  assert.equal(calAug2026.totalDays, 31);
  assert.equal(calAug2026.days.length, 31);

  // 2. Verify all days have complete Panchanga 5 limbs
  for (const day of calAug2026.days) {
    assert.ok(day.dayOfMonth >= 1 && day.dayOfMonth <= 31);
    assert.ok(day.tithi.name, "Tithi name must be present");
    assert.ok(day.nakshatra.name, "Nakshatra name must be present");
    assert.ok(day.yoga.name, "Yoga name must be present");
    assert.ok(day.karana.name, "Karana name must be present");
    assert.ok(day.tithi.moonPhaseEmoji, "Moon phase emoji must be present");
    assert.ok(day.tithi.illuminationPercent >= 0 && day.tithi.illuminationPercent <= 100);
  }

  // 3. Verify key Vrats and Festivals in August 2026
  assert.ok(calAug2026.ekadashiDates.length >= 2, "Must identify at least 2 Ekadashis per month");
  assert.ok(calAug2026.pradoshDates.length >= 1, "Must identify Pradosh dates");
  assert.ok(calAug2026.majorFestivals.length > 0, "Must detect auspicious festivals");

  const festivalIds = calAug2026.majorFestivals.map((f) => f.festival.id);
  assert.ok(
    festivalIds.some((id) => id.includes("ekadashi")),
    "Ekadashi vrat must be present in festivals list"
  );
  assert.ok(
    festivalIds.some((id) => id.includes("nag-panchami")),
    "Nag Panchami must be detected in Shravana Shukla Panchami"
  );

  // 4. Verify Raksha Bandhan on Shravana Purnima with Muhurta & Bhadra warning
  const rakhiFest = calAug2026.majorFestivals.find((f) => f.festival.id === "raksha-bandhan");
  assert.ok(rakhiFest, "Raksha Bandhan must be detected on Shravana Purnima in August 2026");
  assert.ok(rakhiFest.festival.muhurta, "Raksha Bandhan must include detailed Shubh Muhurta");
  assert.ok(rakhiFest.festival.muhurta.timeRange, "Must have valid Muhurta time range");
  assert.equal(rakhiFest.festival.muhurta.isAvoidBhadra, true, "Must have Bhadra prohibition warning");
  assert.ok(rakhiFest.festival.muhurta.mantra, "Must include sacred Rakhi tying Vedic mantra");
});

test("Classical Vimshottari Dasha (120 Years MD/AD/PD) Verification", async () => {
  const { calculateVimshottariDasha } = await import("../src/engine/dasha.ts");

  const birthDate = new Date("1998-05-25T00:16:00Z");
  // Moon at 22.56° Aries (Bharani Nakshatra -> Venus Mahadasha at birth)
  const moonLon = 22.56;

  const result = calculateVimshottariDasha(birthDate, moonLon, new Date("2026-08-24T00:00:00Z"));

  assert.equal(result.startingNakshatraName, "Bharani");
  assert.equal(result.startingLord.name, "Venus");
  assert.ok(result.balanceYears > 0 && result.balanceYears <= 20);
  assert.equal(result.mahadashas.length, 9);

  // Verify full 120-year span
  const firstMD = result.mahadashas[0];
  const lastMD = result.mahadashas[8];
  assert.equal(firstMD.lord.name, "Venus");
  assert.equal(firstMD.antardashas.length, 9);
  assert.equal(firstMD.antardashas[0].pratyantardashas.length, 9);

  // Verify Active Dasha in 2026
  assert.ok(result.activeDasha, "Must identify active dasha period for current date");
  assert.ok(result.activeDasha.mahadasha.name);
  assert.ok(result.activeDasha.antardasha.name);
  assert.ok(result.activeDasha.pratyantardasha.name);
});

test("Planetary Transit (Gochar) & Shani Sade Sati Verification", async () => {
  const { calculateGochar } = await import("../src/engine/gochar.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = {
    cityName: "Varanasi",
    country: "India",
    latitude: 25.3176,
    longitude: 82.9739,
    timezoneOffsetHours: 5.5,
  };

  const natalEphemeris = calculateVedicEphemeris(
    new Date("1998-05-25T00:16:00Z"),
    location,
    "Lahiri",
    "WholeSign",
    "Mean"
  );

  const transitEphemeris = calculateVedicEphemeris(
    new Date("2026-08-24T00:00:00Z"),
    location,
    "Lahiri",
    "WholeSign",
    "Mean"
  );

  const gochar = calculateGochar(natalEphemeris, transitEphemeris);

  assert.equal(gochar.natalMoonRashiName, "Aries");
  assert.ok(gochar.transits.length >= 7);
  assert.ok(gochar.sadeSati.statusTitle);
  assert.ok(gochar.sadeSati.remedies.length > 0);
  assert.ok(gochar.sadeSati.remainingDurationFormatted, "Must compute remaining Sade Sati / Dhaiya duration");

  for (const t of gochar.transits) {
    assert.ok(t.transitHouseFromMoon >= 1 && t.transitHouseFromMoon <= 12);
    assert.ok(["Auspicious", "Neutral", "Inauspicious"].includes(t.score));
  }
});

test("Real-Time Choghadiya & 24 Planetary Horas Verification", async () => {
  const { calculateChoghadiyaAndHoras } = await import("../src/engine/choghadiyaHora.ts");

  const location = {
    cityName: "Varanasi",
    country: "India",
    latitude: 25.3176,
    longitude: 82.9739,
    timezoneOffsetHours: 5.5,
  };

  const result = calculateChoghadiyaAndHoras(new Date("2026-08-24T12:00:00Z"), location);

  assert.equal(result.dayChoghadiyas.length, 8);
  assert.equal(result.nightChoghadiyas.length, 8);
  assert.equal(result.planetaryHoras.length, 24);

  assert.ok(result.activeChoghadiya);
  assert.ok(result.activeHora);
  assert.ok(result.sunriseFormatted);
  assert.ok(result.sunsetFormatted);
});

test("Vedic AI Astrologer Chat Context Dossier Verification", async () => {
  const { buildAstroDossier } = await import("../src/engine/chatContext.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = {
    cityName: "Prayagraj",
    country: "India",
    latitude: 25.44,
    longitude: 81.85,
    timezoneOffsetHours: 5.5,
  };

  const natalEphemeris = calculateVedicEphemeris(
    new Date("1999-09-17T18:32:00Z"),
    location,
    "Lahiri",
    "WholeSign",
    "Mean"
  );

  const transitEphemeris = calculateVedicEphemeris(
    new Date("2026-08-24T00:00:00Z"),
    location,
    "Lahiri",
    "WholeSign",
    "Mean"
  );

  const dossier = buildAstroDossier(natalEphemeris, transitEphemeris, new Date("2026-08-24T00:00:00Z"));

  assert.ok(dossier.includes("NATIVE'S COMPREHENSIVE VEDIC ASTROLOGICAL DOSSIER"));
  assert.ok(dossier.includes("Ascendant (Lagna"));
  assert.ok(dossier.includes("Moon Sign (Janma Rashi"));
  assert.ok(dossier.includes("D9 Navamsha"));
  assert.ok(dossier.includes("D10 Dashamsha"));
  assert.ok(dossier.includes("JAIMINI CHARA KARAKAS"));
  assert.ok(dossier.includes("SHADBALA"));
  assert.ok(dossier.includes("ASHTAKAVARGA STRENGTH"));
  assert.ok(dossier.includes("B.V. RAMAN 300 YOGAS"));
  assert.ok(dossier.includes("SHANI SADE SATI"));
  assert.ok(dossier.includes("PANCHANGA AT BIRTH"));
  assert.ok(dossier.includes("ACHARYA VARAHAMIHIRA BRIHAT SAMHITA DOSSIER"));
  assert.ok(dossier.includes("Kurma Chakra"));
  assert.ok(dossier.includes("Ratna Pariksha"));

  // Verify Matchmaking Section inclusion
  const matchmakingData = {
    boy: {
      name: "Aditya (Groom)",
      dateIso: "1998-09-05T21:29",
      location: { cityName: "Bhuj", country: "India", latitude: 23.254, longitude: 69.6693, timezoneOffsetHours: 5.5 },
    },
    girl: {
      name: "Pooja (Bride)",
      dateIso: "2000-07-04T19:07",
      location: { cityName: "Vasai", country: "India", latitude: 19.3919, longitude: 72.8397, timezoneOffsetHours: 5.5 },
    },
  };

  const dossierWithMatch = buildAstroDossier(
    natalEphemeris,
    transitEphemeris,
    new Date("2026-08-24T00:00:00Z"),
    "male",
    matchmakingData
  );

  assert.ok(dossierWithMatch.includes("KUNDLI MILAN & 36-GUNA COMPATIBILITY DOSSIER"));
  assert.ok(dossierWithMatch.includes("Aditya (Groom)"));
  assert.ok(dossierWithMatch.includes("Pooja (Bride)"));
  assert.ok(dossierWithMatch.includes("Ashtakoota 36-Guna Scoring"));
  assert.ok(dossierWithMatch.includes("Manglik Dosha & Bhanga Status"));
  assert.ok(dossierWithMatch.includes("Cross-Kundli Synastry"));
});

test("Classical Vedic Yoga Detection Engine Verification", async () => {
  const { detectVedicYogas } = await import("../src/engine/yogas.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = {
    cityName: "Prayagraj",
    country: "India",
    latitude: 25.44,
    longitude: 81.85,
    timezoneOffsetHours: 5.5,
  };

  const ephem = calculateVedicEphemeris(
    new Date("1999-09-17T18:32:00Z"),
    location,
    "Lahiri",
    "WholeSign",
    "Mean"
  );

  const yogas = detectVedicYogas(ephem);
  assert.ok(Array.isArray(yogas));
  yogas.forEach((y) => {
    assert.ok(y.name);
    assert.ok(y.sanskritName);
    assert.ok(y.category);
    assert.ok(y.description);
    assert.ok(y.effects);
    assert.ok(y.activationDasha);
  });
});

test("Classical B.V. Raman 300 Yogas Engine & Dasha Activation Verification", async () => {
  const { evaluateRamanYogas } = await import("../src/engine/ramanYogas.ts");
  const { mapYogaActivationTimeline } = await import("../src/engine/yogaActivation.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");
  const { calculateVimshottariDasha } = await import("../src/engine/dasha.ts");

  const location = {
    cityName: "Varanasi",
    country: "India",
    latitude: 25.3176,
    longitude: 82.9739,
    timezoneOffsetHours: 5.5,
  };

  const birthDate = new Date("1995-10-15T06:30:00Z");
  const ephem = calculateVedicEphemeris(birthDate, location, "Lahiri", "WholeSign", "Mean");

  const ramanResult = evaluateRamanYogas(ephem);

  // 1. Structural evaluation
  assert.ok(ramanResult.totalFormed > 0, "Must detect yogas in chart");
  assert.ok(ramanResult.yogas.length === ramanResult.totalFormed);
  assert.ok(ramanResult.functionalRoles["Mars"]);
  assert.ok(ramanResult.functionalRoles["Jupiter"]);
  assert.ok(ramanResult.functionalRoles["Saturn"]);

  // 2. Every yoga must contain classical definitions, potency %, and activation lords
  ramanResult.yogas.forEach((y) => {
    assert.ok(y.id);
    assert.ok(y.name);
    assert.ok(y.sanskritName);
    assert.ok(y.category);
    assert.ok(y.potencyPercent >= 0 && y.potencyPercent <= 100, `Potency % (${y.potencyPercent}) must be 0-100`);
    assert.ok(Array.isArray(y.participatingGrahas));
    assert.ok(Array.isArray(y.housesInvolved));
    assert.ok(Array.isArray(y.activationDashaLords));
    assert.ok(y.classicalDescription);
    assert.ok(y.practicalEffects);
  });

  // 3. Verify Dasha-Gochar activation mapping
  const moonLon = ephem.planets.Moon?.siderealLongitude || 0;
  const dasha = calculateVimshottariDasha(birthDate, moonLon, new Date("2026-08-27T00:00:00Z"));
  const timeline = mapYogaActivationTimeline(ramanResult.yogas, dasha);

  assert.ok(Array.isArray(timeline.currentlyActive));
  assert.ok(Array.isArray(timeline.lifelongYogas));
  assert.ok(Array.isArray(timeline.upcomingYogas));
  assert.ok(Array.isArray(timeline.dormantYogas));
  assert.ok(Array.isArray(timeline.cancelledYogas));
  assert.ok(timeline.dominantLifeTheme.length > 10);
});

test("Classical Pancha-da Maitri (5-Fold Compound Relationship) Verification", async () => {
  const { evaluatePanchadaMaitri, getNaturalRelationship, getTemporalRelationship, getCompoundRelationship } = await import("../src/engine/panchadaMaitri.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  // 1. Classical Matrix Test
  assert.strictEqual(getNaturalRelationship("Sun", "Moon"), "Friend");
  assert.strictEqual(getNaturalRelationship("Sun", "Saturn"), "Enemy");
  assert.strictEqual(getNaturalRelationship("Sun", "Mercury"), "Neutral");

  // Tatkalika: H2 is friend, H7 is enemy
  assert.strictEqual(getTemporalRelationship(1, 2), "Friend");
  assert.strictEqual(getTemporalRelationship(1, 7), "Enemy");

  // Compound rules
  assert.strictEqual(getCompoundRelationship("Friend", "Friend").relation, "Adhi Mitra");
  assert.strictEqual(getCompoundRelationship("Neutral", "Friend").relation, "Mitra");
  assert.strictEqual(getCompoundRelationship("Friend", "Enemy").relation, "Sama");
  assert.strictEqual(getCompoundRelationship("Neutral", "Enemy").relation, "Shatru");
  assert.strictEqual(getCompoundRelationship("Enemy", "Enemy").relation, "Adhi Shatru");

  // 2. Full Chart Evaluation
  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const ephem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");
  const report = evaluatePanchadaMaitri(ephem);

  ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].forEach((p) => {
    const score = report.planets[p];
    assert.ok(score, `Score must exist for ${p}`);
    assert.ok(["Adhi Mitra", "Mitra", "Sama", "Shatru", "Adhi Shatru"].includes(score.compoundRelation));
    assert.ok(score.scorePercent >= 0 && score.scorePercent <= 100);
    assert.ok(score.sanskritName);
    assert.ok(score.dispositor);
  });
});

test("Classical Ishta Phala, Kashta Phala & Residential Strength Verification", async () => {
  const { calculateIshtaKashta } = await import("../src/engine/ishtaKashta.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const ephem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");
  const result = calculateIshtaKashta(ephem);

  assert.ok(result.highestIshtaPlanet);
  assert.ok(result.highestKashtaPlanet);
  assert.ok(result.averageIshta > 0);
  assert.ok(result.averageKashta > 0);

  ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].forEach((p) => {
    const report = result.planets[p];
    assert.ok(report, `Report must exist for ${p}`);
    assert.ok(report.ishtaPhala >= 0 && report.ishtaPhala <= 60, `Ishta Phala (${report.ishtaPhala}) must be between 0 and 60`);
    assert.ok(report.kashtaPhala >= 0 && report.kashtaPhala <= 60, `Kashta Phala (${report.kashtaPhala}) must be between 0 and 60`);
    assert.ok(report.residentialPercent >= 0 && report.residentialPercent <= 100, `Residential % (${report.residentialPercent}) must be 0-100%`);
    assert.ok(report.netBeneficRatio >= 0.0 && report.netBeneficRatio <= 1.0);
    assert.ok(report.qualityBadge);
  });
});

test("Classical 12 Bhavas Tripartite Judgement Engine Verification", async () => {
  const { evaluate12BhavasJudgement } = await import("../src/engine/bhavaJudgement.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const ephem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");
  const result = evaluate12BhavasJudgement(ephem);

  assert.ok(result.strongestHouse);
  assert.ok(result.weakestHouse);
  assert.ok(result.averageScore >= 0 && result.averageScore <= 100);

  for (let h = 1; h <= 12; h++) {
    const bhava = result.bhavas[h];
    assert.ok(bhava, `Bhava ${h} must exist in judgement report`);
    assert.strictEqual(bhava.houseNumber, h);
    assert.ok(bhava.name);
    assert.ok(bhava.sanskritName);
    assert.ok(bhava.domain);
    assert.ok(bhava.signLord);
    assert.ok(bhava.primaryKaraka);
    assert.ok(bhava.bhavaScore >= 0 && bhava.bhavaScore <= 100);
    assert.ok(bhava.lordScore >= 0 && bhava.lordScore <= 100);
    assert.ok(bhava.karakaScore >= 0 && bhava.karakaScore <= 100);
    assert.ok(bhava.compositeScore >= 0 && bhava.compositeScore <= 100);
    assert.ok(bhava.qualityBadge);
    assert.ok(bhava.lordPlacementEffect.length > 10);
    assert.ok(bhava.classicalVerdict.length > 10);
    assert.ok(bhava.remedialAdvice.length > 10);
  }
});

test("Classical Badhaka Sthana & Planetary Avasthas Engine Verification", async () => {
  const { calculateBadhakaAvasthas } = await import("../src/engine/badhakaAvasthas.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const ephem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");
  const result = calculateBadhakaAvasthas(ephem, ["Sun", "Saturn"]);

  // 1. Badhaka Sthana checks
  assert.ok(result.badhaka);
  assert.ok(["Movable", "Fixed", "Dual"].includes(result.badhaka.modality));
  assert.ok([11, 9, 7].includes(result.badhaka.badhakaHouseNumber));
  assert.ok(result.badhaka.badhakadhipati);
  assert.ok(result.badhaka.classicalSignificance);
  assert.ok(result.badhaka.remedialAdvice);

  // 2. Avasthas checks
  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  planets.forEach((p) => {
    const report = result.avasthas[p];
    assert.ok(report, `Report must exist for ${p}`);
    assert.ok(["Bala (Infant)", "Kumara (Youth)", "Yuva (Adult)", "Vriddha (Old)", "Mrita (Deceased)"].includes(report.baladiAvastha));
    assert.ok([0, 10, 25, 50, 100].includes(report.baladiPotencyPercent));
    assert.ok(["Jagrata (Awake)", "Swapna (Dreaming)", "Sushupti (Deep Sleep)"].includes(report.jagradadiAvastha));
    assert.ok(report.effectivePotencyPercent >= 0 && report.effectivePotencyPercent <= 100);
    assert.ok(report.description);
    assert.ok(report.badgeColor);
  });
});

test("Classical Bhrigu Nandi Nadi & Bhrigu Saral Paddhati (BSP) Engine Verification", async () => {
  const { evaluateBhriguNadi } = await import("../src/engine/bhriguNadi.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const ephem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");
  const result = evaluateBhriguNadi(ephem, new Date("2026-08-27T00:00:00Z"));

  // 1. Age & 12-Year Cycle checks
  assert.ok(result.runningAge > 0);
  assert.strictEqual(result.runningAge, 31); // Born Oct 1995 -> in 31st year in Aug 2026
  assert.ok(result.currentYearBsp);
  assert.strictEqual(result.currentYearBsp.cycleHouseNumber, 7); // ((31-1)%12)+1 = 7

  // 2. 4 Directional Quadrant clusters
  assert.ok(result.directionalClusters.East);
  assert.ok(result.directionalClusters.South);
  assert.ok(result.directionalClusters.West);
  assert.ok(result.directionalClusters.North);
  assert.strictEqual(result.directionalClusters.East.element, "Agni");
  assert.strictEqual(result.directionalClusters.South.element, "Prithvi");
  assert.strictEqual(result.directionalClusters.West.element, "Vayu");
  assert.strictEqual(result.directionalClusters.North.element, "Jala");

  // 3. Jiva (Jupiter) & Karma (Saturn) Linkages
  assert.ok(result.jivaProfile);
  assert.strictEqual(result.jivaProfile.representedPlanet, "Jupiter");
  assert.ok(result.jivaProfile.occupiedSign);
  assert.ok(result.jivaProfile.synthesisVerdict.length > 10);

  assert.ok(result.karmaProfile);
  assert.strictEqual(result.karmaProfile.representedPlanet, "Saturn");
  assert.ok(result.karmaProfile.occupiedSign);
  assert.ok(result.karmaProfile.synthesisVerdict.length > 10);

  // 4. BSP Activations array
  assert.ok(result.activeBspActivations.length >= 10);
  result.activeBspActivations.forEach((b) => {
    assert.ok(b.ageYear >= 1);
    assert.ok(b.cycleHouseNumber >= 1 && b.cycleHouseNumber <= 12);
    assert.ok(b.cycleHouseTheme);
  });

  // 5. Upgraded Bhrigu Prashna Nadi & Progressions
  const { evaluateBhriguPrashna, calculateNadiAgeProgressions, detectNadiSangrahaYogas } = await import("../src/engine/bhriguNadi.ts");
  const prashnaResult = evaluateBhriguPrashna(ephem, "Career");
  assert.ok(prashnaResult.queryKaraka);
  assert.ok(prashnaResult.directionalDisposition);
  assert.ok(["Immediate Success (शीघ्र कार्य सिद्धि)", "Moderate / Effort Required (प्रयत्न साध्य)", "Obstruction (विघ्न / अवरोध)"].includes(prashnaResult.outcome));
  assert.ok(prashnaResult.bhriguPrashnaVerdict.length > 20);

  const progressions = calculateNadiAgeProgressions(ephem);
  assert.strictEqual(progressions.length, 6);
  for (const p of progressions) {
    assert.ok(p.cycleRound >= 1 && p.cycleRound <= 6);
    assert.ok(p.ageRange);
    assert.ok(p.progressedSign);
    assert.ok(p.activatedHouses.length > 0);
  }

  const sangrahaYogas = detectNadiSangrahaYogas(ephem);
  assert.ok(Array.isArray(sangrahaYogas));
});

test("Classical Jaimini Argala & Virodhargala Engine Verification", async () => {
  const { calculateArgala, calculateJaiminiKarakas, calculateArudhaPadas } = await import("../src/engine/jaimini.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const ephem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const ascSign = Math.floor(ephem.ascendant.siderealLongitude / 30);
  const lagnaArgala = calculateArgala(ephem, ascSign, "Lagna");

  assert.ok(lagnaArgala);
  assert.strictEqual(lagnaArgala.targetSignIndex, ascSign);
  assert.ok(lagnaArgala.argalas.length === 4); // 2nd, 4th, 11th, 5th
  assert.ok(lagnaArgala.overallVerdict);

  // Check specific Argala properties
  lagnaArgala.argalas.forEach((item) => {
    assert.ok(["Primary (2nd)", "Primary (4th)", "Primary (11th)", "Secondary (5th)"].includes(item.type));
    assert.ok(item.argalaHouse);
    assert.ok(item.argalaSignName);
    assert.ok(item.virodhaHouse);
    assert.ok(item.virodhaSignName);
    assert.ok(typeof item.isUnobstructed === "boolean");
    assert.ok(typeof item.isShubhaArgala === "boolean");
    assert.ok(typeof item.isPapaArgala === "boolean");
    assert.ok(item.statusSummary.length > 5);
  });

  // Test Argala on Arudha Lagna (AL)
  const padas = calculateArudhaPadas(ephem);
  const alSign = padas[0].padaSignIndex;
  const alArgala = calculateArgala(ephem, alSign, "Arudha Lagna");
  assert.ok(alArgala);
  assert.strictEqual(alArgala.targetSignIndex, alSign);
});

test("Classical K.N. Rao Karma, Rebirth & Purva Punya Engine Verification", async () => {
  const { evaluateKarmaRebirth } = await import("../src/engine/karmaRebirth.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const ephem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateKarmaRebirth(ephem);

  // 1. Quad-Karma Spectrum
  assert.ok(result.quadKarma);
  assert.ok(result.quadKarma.sanchita.sanskritName);
  assert.ok(result.quadKarma.prarabdha.sanskritName);
  assert.ok(result.quadKarma.kriyamana.scorePercent > 0);
  assert.ok(result.quadKarma.agama.scorePercent > 0);

  // 2. Loka of Descent
  assert.ok(result.lokaOfDescent);
  assert.ok(["Sun", "Moon"].includes(result.lokaOfDescent.strongerLuminary));
  assert.ok(result.lokaOfDescent.lokaName.length > 5);
  assert.ok(result.lokaOfDescent.sanskritLoka.length > 3);
  assert.ok(result.lokaOfDescent.realmDescription);
  assert.ok(result.lokaOfDescent.spiritualHeritage);

  // 3. 22nd Dreshkona (Kharesh)
  assert.ok(result.kharesh);
  assert.ok(result.kharesh.twentySecondDreshkonaSignName);
  assert.ok(result.kharesh.khareshLord);
  assert.ok(result.kharesh.khareshHouseInD1 >= 1 && result.kharesh.khareshHouseInD1 <= 12);
  assert.ok(result.kharesh.vulnerabilityTheme);
  assert.ok(result.kharesh.remedialAdvice);

  // 4. Purva Punya & Bhagya
  assert.ok(result.purvaPunya);
  assert.ok(result.purvaPunya.purvaPunyaScore >= 0 && result.purvaPunya.purvaPunyaScore <= 100);
  assert.ok(result.purvaPunya.pastSadhanaMerits);
  assert.ok(result.purvaPunya.rinanubandhanaChildrenDebts);
  assert.ok(result.purvaPunya.guruDharmaArmor);

  // 5. Rahu-Ketu Axis
  assert.ok(result.rahuKetuAxis);
  assert.ok(result.rahuKetuAxis.ketuPastMastery);
  assert.ok(result.rahuKetuAxis.rahuFutureFrontier);

  // 6. Master synthesis
  assert.ok(result.masterKarmicSynthesis.length > 20);
});

test("Classical K.N. Rao Double Transit & PAC-DARES Engine Verification", async () => {
  const { calculateDoubleTransit } = await import("../src/engine/doubleTransit.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");
  const transitEphem = calculateVedicEphemeris(new Date("2026-08-27T00:00:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = calculateDoubleTransit(natalEphem, transitEphem);

  // 1. Transit Aspects Radar
  assert.ok(result.transitAspects);
  assert.ok(result.transitAspects.transitSaturnSignName);
  assert.strictEqual(result.transitAspects.transitSaturnAspectedSigns.length, 4); // 1, 3, 7, 10
  assert.ok(result.transitAspects.transitJupiterSignName);
  assert.strictEqual(result.transitAspects.transitJupiterAspectedSigns.length, 4); // 1, 5, 7, 9

  // 2. 4 Major Milestones
  assert.ok(result.milestones.marriage);
  assert.ok(result.milestones.childbirth);
  assert.ok(result.milestones.career);
  assert.ok(result.milestones.property);

  ["marriage", "childbirth", "career", "property"].forEach((k) => {
    const m = result.milestones[k];
    assert.ok(typeof m.isDtpFulfilled === "boolean");
    assert.ok(m.readinessScorePercent >= 0 && m.readinessScorePercent <= 100);
    assert.ok(m.saturnTriggerDetails.length > 5);
    assert.ok(m.jupiterTriggerDetails.length > 5);
    assert.ok(m.classicalVerdict.length > 5);
    assert.ok(m.targetHouses.length > 0);
  });

  // 3. PAC-DARES Framework
  assert.ok(result.pacDares.length === 5);
  result.pacDares.forEach((v) => {
    assert.ok(v.category);
    assert.ok(v.sanskritTitle);
    assert.ok(v.scorePercent >= 0 && v.scorePercent <= 100);
    assert.ok(v.pacSynthesis.length > 10);
    assert.ok(v.verdict.length > 10);
  });

  // 4. Master timing summary
  assert.ok(result.masterTimingSummary.length > 20);
});

test("Classical K.N. Rao Timing of Marriage Engine Verification", async () => {
  const { evaluateMarriageTiming } = await import("../src/engine/marriageTiming.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");
  const transitEphem = calculateVedicEphemeris(new Date("2026-08-27T00:00:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateMarriageTiming(natalEphem, transitEphem, new Date("2026-08-27T00:00:00Z"));

  // 1. Tier 1: Natal Promise
  assert.ok(result.promise);
  assert.ok(["Early Marriage (18-24)", "Normal / Timely (25-29)", "Delayed Marriage (30-38+)", "Complex / Karmic Trials"].includes(result.promise.maritalBand));
  assert.ok(result.promise.sanskritBand);
  assert.ok(result.promise.seventhHouseSign);
  assert.ok(result.promise.seventhLord);
  assert.ok(result.promise.d9LagnaSign);
  assert.ok(result.promise.upapadaSign);
  assert.ok(result.promise.promiseScorePercent >= 0 && result.promise.promiseScorePercent <= 100);

  // 2. Tier 2: Dual Dasha Convergence
  assert.ok(result.dualDasha);
  assert.ok(result.dualDasha.activeVimshottariMD);
  assert.ok(result.dualDasha.activeCharaMD);
  assert.ok(typeof result.dualDasha.isDualConvergenceActive === "boolean");
  assert.ok(result.dualDasha.dashaConvergenceScorePercent >= 0 && result.dualDasha.dashaConvergenceScorePercent <= 100);
  assert.ok(result.dualDasha.timingWindowVerdict);

  // 3. Tier 3: Double Transit
  assert.ok(result.doubleTransit);
  assert.ok(typeof result.doubleTransit.isDoubleTransitFulfilled === "boolean");
  assert.ok(result.doubleTransit.transitScorePercent >= 0 && result.doubleTransit.transitScorePercent <= 100);
  assert.ok(result.doubleTransit.transitVerdict);

  // 4. Composite Readiness
  assert.ok(result.compositeReadinessPercent >= 0 && result.compositeReadinessPercent <= 100);
  assert.ok(result.masterTimingVerdict.length > 15);
  assert.ok(result.remedialGuidance.length > 15);
});

test("Classical K.N. Rao Advanced Predictive Techniques Engine Verification", async () => {
  const { evaluateKnRaoTechniques } = await import("../src/engine/knRaoTechniques.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateKnRaoTechniques(natalEphem);

  // 1. Saturn-Venus Paradox
  assert.ok(result.saturnVenusParadox);
  assert.ok(result.saturnVenusParadox.mutualRelationshipD1);
  assert.ok(result.saturnVenusParadox.mutualRelationshipD10);
  assert.ok(result.saturnVenusParadox.saturnDignity);
  assert.ok(result.saturnVenusParadox.venusDignity);
  assert.ok(typeof result.saturnVenusParadox.isParadoxicalReversalActive === "boolean");
  assert.ok(result.saturnVenusParadox.dashaPeriodEffect.length > 10);
  assert.ok(result.saturnVenusParadox.classicalVerdict.length > 10);

  // 2. Beeja Sphuta (Male)
  assert.ok(result.beejaSphuta);
  assert.ok(result.beejaSphuta.longitude >= 0 && result.beejaSphuta.longitude < 360);
  assert.ok(result.beejaSphuta.signName);
  assert.ok(result.beejaSphuta.navamshaSignName);
  assert.ok(typeof result.beejaSphuta.isSignOdd === "boolean");
  assert.ok(typeof result.beejaSphuta.isNavamshaOdd === "boolean");
  assert.ok(result.beejaSphuta.scorePercent >= 0 && result.beejaSphuta.scorePercent <= 100);
  assert.ok(result.beejaSphuta.classicalInterpretation.length > 15);

  // 3. Kshetra Sphuta (Female)
  assert.ok(result.kshetraSphuta);
  assert.ok(result.kshetraSphuta.longitude >= 0 && result.kshetraSphuta.longitude < 360);
  assert.ok(result.kshetraSphuta.signName);
  assert.ok(result.kshetraSphuta.navamshaSignName);
  assert.ok(typeof result.kshetraSphuta.isSignOdd === "boolean");
  assert.ok(typeof result.kshetraSphuta.isNavamshaOdd === "boolean");
  assert.ok(result.kshetraSphuta.scorePercent >= 0 && result.kshetraSphuta.scorePercent <= 100);
  assert.ok(result.kshetraSphuta.classicalInterpretation.length > 15);

  // 4. Cross-Vargas
  assert.ok(result.crossVarga);
  assert.ok(result.crossVarga.d7SaptamshaLagna);
  assert.ok(result.crossVarga.d7FifthHouseSign);
  assert.ok(result.crossVarga.d10DashamshaLagna);
  assert.ok(result.crossVarga.d10TenthHouseSign);

  // 5. Master synthesis
  assert.ok(result.masterPredictiveSynthesis.length > 20);
});

test("Classical K.N. Rao & Naval Singh Planets and Education Engine Verification", async () => {
  const { evaluateEducationStream } = await import("../src/engine/educationStream.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateEducationStream(natalEphem);

  // 1. Tripartite Houses
  assert.ok(result.tripartiteHouses.fourthHouse);
  assert.ok(result.tripartiteHouses.fourthHouse.signName);
  assert.ok(result.tripartiteHouses.fourthHouse.lord);
  assert.ok(result.tripartiteHouses.fifthHouse);
  assert.ok(result.tripartiteHouses.fifthHouse.signName);
  assert.ok(result.tripartiteHouses.fifthHouse.lord);
  assert.ok(result.tripartiteHouses.ninthHouse);
  assert.ok(result.tripartiteHouses.ninthHouse.signName);
  assert.ok(result.tripartiteHouses.ninthHouse.lord);

  // 2. 6 Stream Aptitudes
  assert.strictEqual(result.streamAptitudes.length, 6);
  result.streamAptitudes.forEach((s) => {
    assert.ok(s.id);
    assert.ok(s.streamName);
    assert.ok(s.aptitudeScorePercent >= 0 && s.aptitudeScorePercent <= 100);
    assert.ok(s.recommendedDegrees.length > 0);
    assert.ok(s.careerPathways.length > 0);
    assert.ok(s.classicalReasoning.length > 10);
  });

  // 3. Top Recommended Stream
  assert.ok(result.topRecommendedStream);
  assert.ok(result.topRecommendedStream.aptitudeScorePercent >= 50);

  // 4. D24 Siddhamsa
  assert.ok(result.d24Siddhamsa);
  assert.ok(result.d24Siddhamsa.d24LagnaSign);
  assert.ok(result.d24Siddhamsa.d24FifthHouseSign);
  assert.ok(result.d24Siddhamsa.academicDistinctionScore >= 0 && result.d24Siddhamsa.academicDistinctionScore <= 100);
  assert.ok(result.d24Siddhamsa.classicalInterpretation.length > 15);

  // 5. Master guidance
  assert.ok(result.masterAcademicGuidance.length > 20);
});

test("Classical Multi-Dasha & Yogini Dasha Engine Verification", async () => {
  const { evaluateMultiDashaSystems, calculateYoginiDasha } = await import("../src/engine/dashaSystems.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateMultiDashaSystems(natalEphem, new Date("2026-08-27T00:00:00Z"));

  // 1. Yogini Timeline
  assert.ok(result.yoginiTimeline.length >= 24); // 3 complete 36y cycles
  result.yoginiTimeline.forEach((md) => {
    assert.ok(md.yogini.name);
    assert.ok(md.yogini.lord);
    assert.ok(md.durationYears > 0);
    assert.strictEqual(md.antardashas.length, 8);
  });

  // 2. Active Yogini
  assert.ok(result.activeYogini.mahadasha.name);
  assert.ok(result.activeYogini.mahadasha.lord);
  assert.ok(result.activeYogini.antardasha.name);
  assert.ok(result.activeYogini.antardasha.lord);
  assert.ok(result.activeYogini.interpretation.length > 20);

  // 3. Conditional Eligibilities
  assert.strictEqual(result.conditionalEligibilities.length, 6);
  result.conditionalEligibilities.forEach((c) => {
    assert.ok(c.id);
    assert.ok(c.name);
    assert.ok(typeof c.isEligible === "boolean");
    assert.ok(c.conditionText.length > 10);
    assert.ok(c.evaluationReason.length > 10);
  });

  // 4. Multi-Dasha Triangulation
  assert.ok(result.multiDashaTriangulation.vimshottariMD);
  assert.ok(result.multiDashaTriangulation.yoginiMD);
  assert.ok(result.multiDashaTriangulation.concurrenceScorePercent >= 50);
  assert.ok(result.multiDashaTriangulation.triangulationVerdict.length > 20);
});

test("Classical Brihat Parashara Hora Shastra (BPHS) Core Engine Verification", async () => {
  const { evaluateBphsCore } = await import("../src/engine/bphsCore.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateBphsCore(natalEphem);

  // 1. Special Lagnas
  assert.ok(result.specialLagnas.horaLagna);
  assert.ok(result.specialLagnas.horaLagna.signName);
  assert.ok(result.specialLagnas.horaLagna.houseFromLagna >= 1 && result.specialLagnas.horaLagna.houseFromLagna <= 12);
  assert.ok(result.specialLagnas.ghatikaLagna);
  assert.ok(result.specialLagnas.ghatikaLagna.signName);
  assert.ok(result.specialLagnas.shreeLagna);
  assert.ok(result.specialLagnas.shreeLagna.signName);
  assert.ok(result.specialLagnas.bhavaLagna);
  assert.ok(result.specialLagnas.bhavaLagna.signName);
  assert.ok(result.specialLagnas.varnadaLagna);
  assert.ok(result.specialLagnas.varnadaLagna.signName);

  // 2. Sudarshana Chakra
  assert.strictEqual(result.sudarshanaChakra.bhavas.length, 12);
  assert.ok(result.sudarshanaChakra.highestFortifiedHouse >= 1 && result.sudarshanaChakra.highestFortifiedHouse <= 12);
  assert.ok(result.sudarshanaChakra.highestFortifiedHouseTheme);

  // 3. Sayanadi Avasthas
  assert.strictEqual(result.sayanadiAvasthas.length, 9);
  result.sayanadiAvasthas.forEach((a) => {
    assert.ok(a.planetName);
    assert.ok(a.avasthaName);
    assert.ok(a.avasthaIndex >= 0 && a.avasthaIndex <= 11);
    assert.ok(a.icon);
    assert.ok(a.classicalInterpretation.length > 15);
  });

  // 4. Ashtakavarga Shodhana & Pindas
  assert.strictEqual(result.ashtakavargaPindas.length, 7);
  assert.ok(result.sarvaYogaPinda > 0);
  result.ashtakavargaPindas.forEach((p) => {
    assert.ok(p.planetName);
    assert.strictEqual(p.trikonaReducedBindus.length, 12);
    assert.strictEqual(p.ekadhipatyaReducedBindus.length, 12);
    assert.ok(p.rashiPinda >= 0);
    assert.ok(p.grahaPinda >= 0);
    assert.ok(p.yogaPinda >= 0);
  });

  // 5. Vishnu Avataras
  assert.strictEqual(result.vishnuAvataras.length, 9);
  assert.ok(result.leadingAvatara.avataraName);
  assert.ok(result.leadingAvatara.divineArchetype);

  // 6. Master synthesis
  assert.ok(result.masterBphsSynthesis.length > 25);
});

test("Classical Varahamihira Brihat Jataka Engine Verification", async () => {
  const { evaluateBrihatJataka } = await import("../src/engine/brihatJataka.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateBrihatJataka(natalEphem);

  // 1. Karma Jeeva & Tri-Lagna
  assert.ok(result.karmaJeeva.tenthHouseFromLagnaSign);
  assert.ok(result.karmaJeeva.tenthLordFromLagna);
  assert.ok(result.karmaJeeva.tenthLordNavamshaSign);
  assert.ok(result.karmaJeeva.navamshaDispositor);
  assert.ok(result.karmaJeeva.sanskritTradeTitle.length > 5);
  assert.ok(result.karmaJeeva.classicalSourceOfWealth.length > 10);
  assert.ok(result.karmaJeeva.modernCareerAlignments.length > 0);
  assert.ok(result.karmaJeeva.recommendedIndustries.length > 0);
  assert.ok(result.karmaJeeva.varahamihiraDictum.length > 20);

  assert.ok(result.triLagnaKarma.fromLagna.navamshaDispositor);
  assert.ok(result.triLagnaKarma.fromMoon.navamshaDispositor);
  assert.ok(result.triLagnaKarma.fromSun.navamshaDispositor);
  assert.ok(result.triLagnaKarma.synthesis.length > 20);

  // 2. Chandra Yogas (Ch. 13)
  assert.ok(result.chandraYogas.length > 0);
  for (const cy of result.chandraYogas) {
    assert.ok(cy.yogaName);
    assert.ok(cy.sanskritName);
    assert.ok(typeof cy.isAuspicious === "boolean");
    assert.ok(cy.description.length > 15);
  }

  // 3. Pravrajya Sannyasa Yogas (Ch. 15)
  assert.ok(typeof result.pravrajyaYoga.isActive === "boolean");
  assert.ok(result.pravrajyaYoga.initiatorPlanet);
  assert.ok(result.pravrajyaYoga.sanskritLineage.length > 5);
  assert.ok(result.pravrajyaYoga.spiritualOrder.length > 10);
  assert.ok(result.pravrajyaYoga.philosophicalDrive.length > 10);
  assert.ok(result.pravrajyaYoga.varahaSutra.length > 15);

  // 4. 36 Drekkanas
  assert.ok(result.drekkanas.lagnaDrekkana.archetype);
  assert.ok(result.drekkanas.lagnaDrekkana.icon);
  assert.ok(result.drekkanas.lagnaDrekkana.decanateNumber >= 1 && result.drekkanas.lagnaDrekkana.decanateNumber <= 3);
  assert.ok(result.drekkanas.moonDrekkana.archetype);
  assert.ok(result.drekkanas.sunDrekkana.archetype);

  // 5. 32 Nabhasa Yogas
  assert.ok(result.nabhasaYoga.activeYogaName);
  assert.ok(result.nabhasaYoga.sanskritName);
  assert.ok(result.nabhasaYoga.yogaCategory);
  assert.ok(result.nabhasaYoga.occupiedSignsCount >= 1 && result.nabhasaYoga.occupiedSignsCount <= 7);
  assert.ok(result.nabhasaYoga.lifelongPhala.length > 15);

  // 6. Gateways & Master Synthesis
  assert.ok(result.nishekaInsight.length > 15);
  assert.ok(result.niryanaInsight.length > 15);
  assert.ok(result.masterVarahamihiraSynthesis.length > 25);
});

test("Classical Varahamihira Brihat Samhita Engine Verification", async () => {
  const { evaluateBrihatSamhita } = await import("../src/engine/brihatSamhita.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateBrihatSamhita(natalEphem);

  // 1. Kurma Chakra (9 directions)
  assert.ok(result.kurmaChakra);
  assert.strictEqual(Object.keys(result.kurmaChakra.sectors).length, 9);
  assert.ok(result.kurmaChakra.mostAfflictedDirection);
  assert.ok(result.kurmaChakra.mostFortifiedDirection);
  assert.ok(result.kurmaChakra.cosmicSynthesis.length > 20);

  // Check specific sector
  const central = result.kurmaChakra.sectors["Central"];
  assert.ok(central);
  assert.strictEqual(central.sanskritDirection, "Madhya Desha (मध्य देश)");
  assert.strictEqual(central.nakshatras.length, 3);
  assert.ok(central.rulingDeity.includes("Brahma"));

  // 2. Graha Yuddha
  assert.ok(Array.isArray(result.grahaYuddhas));
  assert.strictEqual(typeof result.hasActiveGrahaYuddha, "boolean");

  // 3. Ratna Pariksha (9 gems)
  assert.ok(result.ratnaPariksha.primaryGem);
  assert.ok(result.ratnaPariksha.primaryGem.gemstoneName);
  assert.ok(result.ratnaPariksha.primaryGem.metal);
  assert.ok(result.ratnaPariksha.primaryGem.wearingFinger);
  assert.ok(result.ratnaPariksha.primaryGem.classicalVedicMantra);
  assert.strictEqual(result.ratnaPariksha.primaryGem.flawsToAvoid.length, 4);
  assert.strictEqual(result.ratnaPariksha.primaryGem.virtuesRequired.length, 4);
  assert.strictEqual(result.ratnaPariksha.allGems.length, 9);
  assert.ok(result.ratnaPariksha.masterGemGuidance.length > 20);

  // 4. Environmental & Dakargala Hydrology
  assert.ok(result.environmentalMundane.elementalDominance);
  assert.ok(result.environmentalMundane.dakargalaGroundWaterIndex >= 0 && result.environmentalMundane.dakargalaGroundWaterIndex <= 100);
  assert.ok(result.environmentalMundane.dakargalaWaterVerdict.length > 10);
  assert.ok(result.environmentalMundane.nimittaSignatures.length >= 2);

  // 5. Master Synthesis
  assert.ok(result.masterBrihatSamhitaSynthesis.length > 30);
});

test("Classical Deva Keralam (Chandra Kala Nadi) 150 Nadi Amshas Verification", async () => {
  const { calculateNadiAmsha, evaluateDevaKeralam } = await import("../src/engine/devaKeralam.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  // 1. Test Modality Directionality for 150 Nadi Amshas
  // Chara (Movable - Aries = 0): 0.05° -> slot 0 -> Nadi #1 (Vasudha), Purvabhaga
  const chara1 = calculateNadiAmsha(0.05);
  assert.strictEqual(chara1.index, 1);
  assert.strictEqual(chara1.name, "Vasudha");
  assert.strictEqual(chara1.halfBhaga, "Purvabhaga");

  // Chara (Aries): 0.15° -> slot 0 -> Nadi #1 (Vasudha), Uttarabhaga
  const chara2 = calculateNadiAmsha(0.15);
  assert.strictEqual(chara2.index, 1);
  assert.strictEqual(chara2.name, "Vasudha");
  assert.strictEqual(chara2.halfBhaga, "Uttarabhaga");

  // Sthira (Fixed - Taurus = 30° + 0.05° = 30.05°): slot 0 -> Nadi #150 (Kula), Purvabhaga
  const sthira1 = calculateNadiAmsha(30.05);
  assert.strictEqual(sthira1.index, 150);
  assert.strictEqual(sthira1.name, "Kula");

  // Dwiswabhava (Dual - Gemini = 60° + 0.05° = 60.05°): slot 0 -> Nadi #76
  const dual1 = calculateNadiAmsha(60.05);
  assert.strictEqual(dual1.index, 76);

  // 2. Full Deva Keralam Evaluator
  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");
  const transitEphem = calculateVedicEphemeris(new Date("2026-08-24T00:00:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateDevaKeralam(natalEphem, transitEphem);

  assert.ok(result.lagnaNadi.index >= 1 && result.lagnaNadi.index <= 150);
  assert.ok(result.lagnaNadi.name);
  assert.ok(result.lagnaNadi.sanskritName);
  assert.ok(result.lagnaNadi.rulingDeity);
  assert.ok(result.lagnaNadi.archetype);
  assert.ok(result.lagnaNadi.classicalSutra);

  assert.ok(result.moonNadi.index >= 1 && result.moonNadi.index <= 150);
  assert.ok(result.sunNadi.index >= 1 && result.sunNadi.index <= 150);
  assert.ok(Object.keys(result.planetsNadi).length >= 7);

  assert.ok(Array.isArray(result.dhanaYogas));
  assert.ok(result.dhanaYogas.length > 0);
  assert.ok(Array.isArray(result.rajaYogas));
  assert.ok(result.kulaAndVamshaPhala.length > 20);
  assert.ok(result.ayurdayaInsight.length > 20);
  assert.ok(result.masterDevaKeralamSynthesis.length > 30);
});

test("Classical Doctrines of Suka Nadi (Maharshi Shukacharya) Verification", async () => {
  const { calculateSukaNadi } = await import("../src/engine/sukaNadi.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = calculateSukaNadi(natalEphem);

  // 1. Karakatwa Blends
  assert.ok(result.jeevaKaraka);
  assert.strictEqual(result.jeevaKaraka.planet, "Jupiter");
  assert.ok(result.jeevaKaraka.primaryArchetype.length > 5);
  assert.ok(result.jeevaKaraka.synthesis.length > 20);
  assert.ok(result.jeevaKaraka.careerAndDestinyImpact.length > 10);

  assert.ok(result.karmaKaraka);
  assert.strictEqual(result.karmaKaraka.planet, "Saturn");
  assert.ok(result.karmaKaraka.primaryArchetype.length > 5);

  assert.ok(result.bhogaKaraka);
  assert.strictEqual(result.bhogaKaraka.planet, "Venus");

  // 2. Directional Trines (4 Groups)
  assert.strictEqual(result.directionalTrines.length, 4);
  for (const dt of result.directionalTrines) {
    assert.strictEqual(dt.signs.length, 3);
    assert.ok(dt.sanskritName);
    assert.ok(dt.lifeSignification.length > 15);
  }

  // 3. Past Life Karma
  assert.ok(result.pastLifeKarma.length > 0);
  assert.ok(result.pastLifeKarma[0].karmaPattern);
  assert.ok(result.pastLifeKarma[0].classicalSukaParihara.length > 15);

  // 4. Age Progression Cycles
  assert.ok(result.ageCycles.length >= 6);
  assert.ok(result.ageCycles[0].ageWindow);
  assert.ok(result.ageCycles[0].karmicMilestone);

  // 5. Special Yogas & Master Synthesis
  assert.ok(result.specialYogas.length > 0);
  assert.ok(result.masterSukaSynthesis.length > 30);
});

test("Classical Maharshi Jaimini Upadesha Sutras (Complete 4 Adhyayas) Verification", async () => {
  const { evaluateJaiminiSutrasComplete, getRashiDrishtiSigns } = await import("../src/engine/jaiminiSutras.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  // 1. Verify Rashi Drishti (Adhyaya 1)
  // Aries (Movable = 0) aspects Fixed signs (1, 4, 7, 10) except adjacent (1 = Taurus) -> [4, 7, 10] (Leo, Scorpio, Aquarius)
  const ariesDrishti = getRashiDrishtiSigns(0);
  assert.deepStrictEqual(ariesDrishti, [4, 7, 10]);

  // Taurus (Fixed = 1) aspects Movable signs (0, 3, 6, 9) except adjacent (0 = Aries) -> [3, 6, 9] (Cancer, Libra, Capricorn)
  const taurusDrishti = getRashiDrishtiSigns(1);
  assert.deepStrictEqual(taurusDrishti, [3, 6, 9]);

  // Gemini (Dual = 2) aspects other Dual signs (5, 8, 11) -> [5, 8, 11] (Virgo, Sagittarius, Pisces)
  const geminiDrishti = getRashiDrishtiSigns(2);
  assert.deepStrictEqual(geminiDrishti, [5, 8, 11]);

  // 2. Full Jaimini Evaluator
  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateJaiminiSutrasComplete(natalEphem, new Date("2026-08-24T00:00:00Z"));

  // Adhyaya 2: Karakamsha & Ishta Devata
  assert.ok(result.atmakarakaPlanet);
  assert.ok(result.amatyakarakaPlanet);
  assert.ok(result.karakamshaSign);
  assert.strictEqual(result.karakamshaBhavas.length, 12);
  assert.ok(result.ishtaDevata.ishtaDevataName);
  assert.ok(result.ishtaDevata.dharmaDevataName);
  assert.ok(result.ishtaDevata.mantraRecommendation.length > 5);

  // Adhyaya 1: Chara Dasha System
  assert.strictEqual(result.charaDasha.periods.length, 12);
  assert.ok(result.charaDasha.activeMahadasha);
  assert.ok(result.charaDasha.activeMahadasha.signName);
  assert.ok(result.charaDasha.activeMahadasha.durationYears >= 1 && result.charaDasha.activeMahadasha.durationYears <= 12);

  // Adhyaya 3: 3-Pair Longevity
  assert.ok(result.longevity.compositeLongevity);
  assert.ok(result.longevity.rudraGraha);
  assert.ok(result.longevity.brahmaGraha);
  assert.ok(result.longevity.longevitySummary.length > 20);

  // Adhyaya 4: Upapada Lagna & Raja Yogas
  assert.ok(result.upapada.upapadaSign);
  assert.ok(result.upapada.maritalHarmonyScore >= 0 && result.upapada.maritalHarmonyScore <= 100);
  assert.ok(result.upapada.spouseProfile.length > 15);
  assert.ok(result.upapada.jaiminiRemedies.length > 15);
  assert.ok(result.jaiminiRajaYogas.length > 0);
  assert.ok(result.masterJaiminiSynthesis.length > 30);
});

test("Classical Gayatri Jyotish (24 Aksharas, 9 Graha Gayatris & 5 Koshas) Verification", async () => {
  const { evaluateGayatriJyotish } = await import("../src/engine/gayatriJyotish.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateGayatriJyotish(natalEphem);

  // 1. Personal Gayatri Akshara
  assert.ok(result.personalAkshara);
  assert.ok(result.personalAkshara.syllable.length > 0);
  assert.ok(result.personalAkshara.presidingDeity.length > 0);
  assert.ok(result.personalAkshara.presidingRishi.length > 0);
  assert.ok(result.savitaSolarResonanceScore >= 0 && result.savitaSolarResonanceScore <= 100);

  // 2. 24 Akshara Matrix
  assert.strictEqual(result.aksharaMatrix.length, 24);
  for (const ak of result.aksharaMatrix) {
    assert.ok(ak.syllable);
    assert.ok(ak.presidingDeity);
    assert.ok(ak.presidingRishi);
    assert.ok(ak.tattwa);
    assert.ok(ak.associatedRashiName);
  }

  // 3. 9 Graha Gayatri Mantras
  assert.strictEqual(result.grahaGayatris.length, 9);
  for (const gg of result.grahaGayatris) {
    assert.ok(gg.planetName);
    assert.ok(gg.sanskritMantra.includes("धीमहि"));
    assert.ok(gg.englishTransliteration.includes("Dhimahi"));
    assert.ok(gg.afflictionScore >= 0 && gg.afflictionScore <= 100);
    assert.ok(gg.recommendedDailyMalas >= 1);
  }

  // 4. 5 Kosha Diagnostics
  assert.strictEqual(result.koshaDiagnostics.length, 5);
  const koshaNames = result.koshaDiagnostics.map((k) => k.koshaName);
  assert.deepStrictEqual(koshaNames, ["Annamaya", "Pranamaya", "Manomaya", "Vijnanamaya", "Anandamaya"]);
  for (const kd of result.koshaDiagnostics) {
    assert.ok(kd.vitalityScore >= 0 && kd.vitalityScore <= 100);
    assert.ok(["Fortified", "Balanced", "Depleted"].includes(kd.pranicStatus));
    assert.ok(kd.harmonizationGuidance.length > 15);
  }

  // 5. Anushthana Plan & Master Synthesis
  assert.ok(result.anushthanaPlan);
  assert.ok(result.anushthanaPlan.targetJapaCount > 0);
  assert.ok(result.anushthanaPlan.dailyMalaCount >= 1);
  assert.ok(result.anushthanaPlan.suryaArghyaGuidance.length > 20);
  assert.ok(result.anushthanaPlan.savitaMeditationVisualization.length > 20);
  assert.ok(result.masterGayatriSynthesis.length > 30);
});

test("Classical Acharya Ganesh Kavi Jataka Alankara (1613 CE) Verification", async () => {
  const { evaluateJatakaAlankara } = await import("../src/engine/jatakaAlankara.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateJatakaAlankara(natalEphem);

  // 1. 12 Bhava Alankaras
  assert.strictEqual(result.bhavaAlankaras.length, 12);
  assert.ok(result.strongestBhava);
  assert.ok(result.strongestBhava.bhavaNum >= 1 && result.strongestBhava.bhavaNum <= 12);
  assert.ok(result.strongestBhava.alankaraScore >= 10 && result.strongestBhava.alankaraScore <= 100);

  for (const b of result.bhavaAlankaras) {
    assert.ok(b.sanskritTitle);
    assert.ok(b.signName);
    assert.ok(b.lordName);
    assert.ok(b.lordPlacementHouse >= 1 && b.lordPlacementHouse <= 12);
    assert.ok(b.classicalPhala.length > 15);
    assert.ok(b.shlokaReference.includes("J.A."));
    assert.ok(["Uttama (Supreme)", "Madhyama (Moderate)", "Alpa (Modest)"].includes(b.ornamentationGrade));
  }

  // 2. Special Raja Yogas
  assert.ok(result.specialYogas.length >= 4);
  for (const y of result.specialYogas) {
    assert.ok(y.yogaName);
    assert.ok(y.sanskritName);
    assert.ok(y.classicalShlokaEffect.length > 15);
  }

  // 3. Arishta & Disease Diagnostics
  assert.strictEqual(result.diseaseDiagnostics.length, 4);
  for (const d of result.diseaseDiagnostics) {
    assert.ok(d.diseaseCategory);
    assert.ok(["Low", "Moderate", "Elevated"].includes(d.vulnerabilityLevel));
    assert.ok(d.astrologicalCause.length > 15);
    assert.ok(d.classicalRemedy.length > 15);
  }

  // 4. Stri Jataka & Marital Fortune
  assert.ok(result.maritalFortune.saubhagyaScore >= 0 && result.maritalFortune.saubhagyaScore <= 100);
  assert.ok(result.maritalFortune.spouseCharacter.length > 15);
  assert.ok(result.maritalFortune.maritalProsperityVerdict.length > 15);
  assert.ok(result.maritalFortune.ganeshKaviRemedy.length > 15);
  assert.ok(result.masterAlankaraSynthesis.length > 30);
});

test("Classical Dr. B.V. Raman Jatak Nirnay (How to Judge a Horoscope 1 & 2) Verification", async () => {
  const { evaluateJatakNirnay } = await import("../src/engine/jatakNirnay.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateJatakNirnay(natalEphem);

  // 1. 12 Bhava Judgements
  assert.strictEqual(result.bhavaJudgements.length, 12);
  assert.ok(result.strongestBhava);
  assert.ok(result.weakestBhava);
  assert.ok(result.strongestBhava.compositeRamanScore >= result.weakestBhava.compositeRamanScore);

  for (const b of result.bhavaJudgements) {
    assert.ok(b.sanskritTitle);
    assert.ok(b.signName);
    assert.ok(b.lordName);
    assert.ok(b.primaryKaraka);
    assert.ok(b.bhavaScore >= 0 && b.bhavaScore <= 100);
    assert.ok(b.lordScore >= 0 && b.lordScore <= 100);
    assert.ok(b.karakaScore >= 0 && b.karakaScore <= 100);
    assert.ok(b.compositeRamanScore >= 0 && b.compositeRamanScore <= 100);
    assert.ok(["Uttama (Supreme)", "Madhyama (Moderate)", "Heena (Depleted)"].includes(b.potencyGrade));
    assert.ok(["Bhava Vriddhi (Flourishing)", "Bhava Samanya (Balanced)", "Bhava Nasha (Afflicted)"].includes(b.vriddhiNashaStatus));
    assert.ok(["Shubha Kartari", "Papa Kartari", "Neutral"].includes(b.kartariStatus));
    assert.ok(b.lifePredictions.length > 20);
    assert.ok(b.ramanRemedy.length > 15);
  }

  // 2. Vriddhi / Nasha Summaries
  assert.ok(result.vriddhiNashaSummaries.length >= 0);
  for (const vn of result.vriddhiNashaSummaries) {
    assert.ok(vn.bhavaNum >= 1 && vn.bhavaNum <= 12);
    assert.ok(vn.astrologicalBasis.length > 15);
    assert.ok(vn.realWorldImpact.length > 15);
  }

  // 3. Master Synthesis
  assert.ok(result.masterNirnaySynthesis.length > 30);
});

test("Classical Vaidyanatha Dikshita Jataka Parijata (Vols 1, 2, 3 - 18 Adhyayas) Verification", async () => {
  const { evaluateJatakaParijata } = await import("../src/engine/jatakaParijata.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateJatakaParijata(natalEphem);

  // 1. 16 Shodasha Parijata Yogas
  assert.strictEqual(result.shodashaYogas.length, 13); // 8 classic named + 5 Pancha Mahapurusha
  for (const y of result.shodashaYogas) {
    assert.ok(y.yogaName);
    assert.ok(y.sanskritName);
    assert.ok(y.category);
    assert.ok(y.description.length > 10);
    assert.ok(y.classicalShlokaEffect.length > 15);
    assert.ok(y.adhyayaRef.includes("Jataka Parijata"));
  }

  // 2. 64th Navamsha & 22nd Drekkana / Kharesh
  assert.ok(result.khareshAndNavamsha.navamsha64Moon.signName);
  assert.ok(result.khareshAndNavamsha.navamsha64Moon.lord);
  assert.ok(result.khareshAndNavamsha.navamsha64Lagna.signName);
  assert.ok(result.khareshAndNavamsha.drekkana22Kharesh.khareshLord);
  assert.ok(result.khareshAndNavamsha.gulika.signName);
  assert.ok(result.khareshAndNavamsha.protectionGuidelines.length > 20);

  // 3. Kalachakra Dasha Deha & Jeeva
  assert.ok(result.kalachakraDiagnostics.group);
  assert.ok(result.kalachakraDiagnostics.dehaRashi);
  assert.ok(result.kalachakraDiagnostics.jeevaRashi);
  assert.ok(result.kalachakraDiagnostics.vitalityAlert.length > 20);

  // 4. 12 Bhavas Parijata Mastery
  assert.strictEqual(result.bhavaMastery.length, 12);
  for (const b of result.bhavaMastery) {
    assert.ok(b.sanskritTitle);
    assert.ok(b.signName);
    assert.ok(b.lordName);
    assert.ok(b.parijataScore >= 0 && b.parijataScore <= 100);
    assert.ok(["Uttama Parijata", "Madhyama Parijata", "Alpa Parijata"].includes(b.masteryGrade));
    assert.ok(b.classicalPhala.length > 15);
  }

  // 5. Master Synthesis
  assert.ok(result.masterParijataSynthesis.length > 30);
});

test("Classical Maharaja Kalyana Varma Saravali (800 CE, 45 Adhyayas) Verification", async () => {
  const { evaluateSaravali } = await import("../src/engine/saravali.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateSaravali(natalEphem);

  // 1. Royal & Prosperity Yogas (Vasumati, Adhi, Chandra Yogas)
  assert.ok(result.royalYogas.length >= 3);
  for (const y of result.royalYogas) {
    assert.ok(y.yogaName);
    assert.ok(y.sanskritName);
    assert.ok(y.category);
    assert.ok(y.description.length > 10);
    assert.ok(y.classicalShlokaEffect.length > 15);
    assert.ok(y.adhyayaRef.includes("Saravali"));
  }

  // 2. Conjunctions
  assert.ok(result.conjunctions.length >= 0);
  for (const c of result.conjunctions) {
    assert.ok(c.conjunctionType);
    assert.ok(c.planets.length >= 2);
    assert.ok(c.yogaTitle);
    assert.ok(c.saravaliPhala.length > 15);
    assert.ok(c.adhyayaCitation.includes("Saravali"));
  }

  // 3. Stri Jataka & Trimsamsha
  assert.ok(result.striJataka.trimsamshaLord);
  assert.ok(result.striJataka.trimsamshaSign);
  assert.ok(result.striJataka.trimsamshaNature.length > 15);
  assert.ok(typeof result.striJataka.vishaKanyaDetected === "boolean");
  assert.ok(typeof result.striJataka.vishaKanyaBhanga === "boolean");
  assert.ok(result.striJataka.maritalAndMoralDisposition.length > 15);

  // 4. 12 Bhavas Saravali Potency
  assert.strictEqual(result.bhavaPotency.length, 12);
  for (const b of result.bhavaPotency) {
    assert.ok(b.sanskritTitle);
    assert.ok(b.signName);
    assert.ok(b.lordName);
    assert.ok(b.saravaliScore >= 0 && b.saravaliScore <= 100);
    assert.ok(["Maharaja Grade (Uttama)", "Samanta Grade (Madhyama)", "Alpa Grade (Heena)"].includes(b.royalGrade));
    assert.ok(b.classicalPhala.length > 15);
  }

  // 5. Master Synthesis
  assert.ok(result.masterSaravaliSynthesis.length > 30);
});

test("Classical Acharya Mantreswara Phaladeepika (28 Adhyayas) Verification", async () => {
  const { evaluatePhaladeepika } = await import("../src/engine/phaladeepika.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluatePhaladeepika(natalEphem);

  // 1. Viparita Raja Yogas (Harsha, Sarala, Vimala)
  assert.strictEqual(result.viparitaRajaYogas.length, 3);
  for (const v of result.viparitaRajaYogas) {
    assert.ok(v.yogaName);
    assert.ok(v.sanskritName);
    assert.ok(v.description.length > 10);
    assert.ok(v.classicalShlokaEffect.length > 15);
    assert.ok(v.adhyayaCitation.includes("Phaladeepika"));
  }

  // 2. 9 Planetary Avasthas
  assert.strictEqual(result.planetaryAvasthas.length, 9);
  for (const a of result.planetaryAvasthas) {
    assert.ok(a.planetName);
    assert.ok(a.avasthaName);
    assert.ok(a.sanskritName);
    assert.ok(a.potencyPercentage >= 0 && a.potencyPercentage <= 100);
    assert.ok(a.functionalEffect.length > 15);
  }

  // 3. 12 Bhavas Phaladeepika Mastery
  assert.strictEqual(result.bhavaMastery.length, 12);
  for (const b of result.bhavaMastery) {
    assert.ok(b.sanskritTitle);
    assert.ok(b.signName);
    assert.ok(b.lordName);
    assert.ok(b.phaladeepikaScore >= 0 && b.phaladeepikaScore <= 100);
    assert.ok(["Uttama Phaladeepika", "Madhyama Phaladeepika", "Alpa Phaladeepika"].includes(b.masteryGrade));
    assert.ok(b.classicalPhala.length > 15);
  }

  // 4. Master Synthesis
  assert.ok(result.masterPhaladeepikaSynthesis.length > 30);
});

test("Classical Prasna Marga (32 Adhyayas) & Prasna Arudha Phala Verification", async () => {
  const { evaluatePrasnaMarga } = await import("../src/engine/prasnaMarga.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Kochi", country: "India", latitude: 9.9312, longitude: 76.2673, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluatePrasnaMarga(natalEphem, 0); // Arudha = Aries

  // 1. Tri-Lagnas
  assert.ok(result.triLagnas.udayaSign);
  assert.ok(result.triLagnas.arudhaSign);
  assert.ok(result.triLagnas.chatraSign);
  assert.ok(result.triLagnas.veedhiRashi);
  assert.ok(result.triLagnas.relationship.length > 10);

  // 2. Pancha Sutras
  assert.strictEqual(result.panchaSutras.length, 5);
  for (const s of result.panchaSutras) {
    assert.ok(s.sutraName);
    assert.ok(s.sanskritName);
    assert.ok(s.diagnosticVerdict.length > 15);
    assert.ok(s.classicalShloka.includes("Prasna Marga"));
  }

  // 3. Ashtamangala
  assert.ok(result.ashtamangala.ashtamangalaNumber >= 1 && result.ashtamangala.ashtamangalaNumber <= 8);
  assert.ok(result.ashtamangala.auspiciousScore >= 0 && result.ashtamangala.auspiciousScore <= 100);
  assert.ok(typeof result.ashtamangala.devaDoshaDetected === "boolean");
  assert.ok(typeof result.ashtamangala.abhicharaDetected === "boolean");
  assert.ok(result.ashtamangala.deepaLakshana.length > 15);
  assert.ok(result.ashtamangala.keralaParihara.length > 15);

  // 4. 12 Bhavas Arudha Phala
  assert.strictEqual(result.bhavaVerdicts.length, 12);
  for (const b of result.bhavaVerdicts) {
    assert.ok(b.queryTopic);
    assert.ok(b.sanskritTitle);
    assert.ok(b.arudhaLordName);
    assert.ok(b.successProbability >= 0 && b.successProbability <= 100);
    assert.ok(["Immediate Fulfillment (शीघ्र फल)", "Delayed Success with Effort (विलम्ब फल)", "Adverse / High Obstacles (कष्ट फल)"].includes(b.verdict));
    assert.ok(b.timingWindow.length > 5);
    assert.ok(b.classicalShlokaPhala.length > 15);
  }

  // 5. Master Horary Verdict
  assert.ok(result.masterPrasnaVerdict.length > 30);
});

test("Classical Acharya Sadananda Samhita Skandha (Mundane & Astrometeorology) Verification", async () => {
  const { evaluateSamhitaSkandha } = await import("../src/engine/samhitaSkandha.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Ujjain", country: "India", latitude: 23.1765, longitude: 75.7885, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateSamhitaSkandha(natalEphem);

  // 1. Planetary Cabinet
  assert.ok(result.planetaryCabinet.kingPlanet);
  assert.ok(result.planetaryCabinet.ministerPlanet);
  assert.ok(result.planetaryCabinet.commanderPlanet);
  assert.ok(result.planetaryCabinet.sasyeshaPlanet);
  assert.ok(result.planetaryCabinet.kingEffect.length > 15);

  // 2. Varsha Astrometeorology
  assert.ok(result.varshaAstrology.rainfallScore >= 0 && result.varshaAstrology.rainfallScore <= 100);
  assert.ok(["Abundant Monsoon (अतिवृष्टि)", "Normal Bountiful (सुवृष्टि)", "Moderate Selective (मध्यम)", "Deficit Drought Risk (अनावृष्टि)"].includes(result.varshaAstrology.precipitationGrade));
  assert.ok(result.varshaAstrology.meghaGarbhaStatus.length > 15);
  assert.ok(result.varshaAstrology.classicalShloka.includes("Samhita Skandha"));

  // 3. Seismic Mandalas
  assert.strictEqual(result.seismicMandalas.length, 4);
  for (const m of result.seismicMandalas) {
    assert.ok(m.mandalaName);
    assert.ok(m.sanskritTitle);
    assert.ok(m.governingPlanets.length > 0);
    assert.ok(["High Alert", "Elevated Risk", "Low / Serene"].includes(m.riskLevel));
    assert.ok(m.geographicVulnerability.length > 15);
  }

  // 4. Argha Commodities
  assert.strictEqual(result.arghaCommodities.length, 6);
  for (const c of result.arghaCommodities) {
    assert.ok(c.commodityName);
    assert.ok(c.governingPlanet);
    assert.ok(["Strongly Bullish (तेजी / Rises)", "Mild Uptrend (स्थिर लाभ)", "Bearish (मंदी / Drops)", "Volatile (चंचल)"].includes(c.trend));
    assert.ok(c.projectedPriceFactor > 0);
    assert.ok(c.classicalArghaReasoning.length > 15);
  }

  // 5. Master Synthesis
  assert.ok(result.masterSamhitaSynthesis.length > 30);
});

test("Classical Acharya Ramadayalu Sanketanidhi (9 Sanketas) Verification", async () => {
  const { evaluateSanketanidhi } = await import("../src/engine/sanketanidhi.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateSanketanidhi(natalEphem);

  // 1. Bhava Vitality
  assert.strictEqual(result.bhavaVitality.length, 12);
  for (const b of result.bhavaVitality) {
    assert.ok(b.sanskritTitle);
    assert.ok(b.signName);
    assert.ok(b.lordName);
    assert.ok(b.vridhiScore >= 0 && b.vridhiScore <= 100);
    assert.ok(b.nashanaScore >= 0 && b.nashanaScore <= 100);
    assert.ok(["Brimming Vridhi (पूर्ण वृद्धि)", "Balanced Growth (सम वृद्धि)", "Vulnerable / Nashana (भाव क्षय)"].includes(b.status));
    assert.ok(b.anatomicalZone.length > 10);
    assert.ok(b.classicalSanketaShloka.length > 15);
  }

  // 2. Medical Tridosha Diagnostics
  assert.ok(result.medicalDiagnostics.vataPercentage >= 0 && result.medicalDiagnostics.vataPercentage <= 100);
  assert.ok(result.medicalDiagnostics.pittaPercentage >= 0 && result.medicalDiagnostics.pittaPercentage <= 100);
  assert.ok(result.medicalDiagnostics.kaphaPercentage >= 0 && result.medicalDiagnostics.kaphaPercentage <= 100);
  assert.strictEqual(result.medicalDiagnostics.vataPercentage + result.medicalDiagnostics.pittaPercentage + result.medicalDiagnostics.kaphaPercentage, 100);
  assert.ok(result.medicalDiagnostics.dominantDosha);
  assert.ok(result.medicalDiagnostics.vulnerableOrgans.length > 0);
  assert.ok(result.medicalDiagnostics.ayurvedicParihara.length > 15);

  // 3. Ayurdaya Longevity
  assert.ok(["Purnayu (Long Life: 67-100+ Years)", "Madhyayu (Middle Life: 33-66 Years)", "Alpayu (Short Life: 0-32 Years)"].includes(result.ayurdayaLongevity.longevityTier));
  assert.ok(result.ayurdayaLongevity.vitalityIndex >= 0 && result.ayurdayaLongevity.vitalityIndex <= 100);
  assert.strictEqual(result.ayurdayaLongevity.marakaLords.length, 2);
  assert.ok(result.ayurdayaLongevity.longevityAnalysis.length > 20);

  // 4. Arishta Bhanga Shields
  assert.strictEqual(result.arishtaBhangaShields.length, 4);
  for (const s of result.arishtaBhangaShields) {
    assert.ok(s.shieldName);
    assert.ok(s.sanskritName);
    assert.ok(typeof s.isActive === "boolean");
    assert.ok(s.potencyScore >= 0 && s.potencyScore <= 100);
    assert.ok(s.sanketaCitation.includes("Sanketanidhi"));
  }

  // 5. Master Synthesis
  assert.ok(result.masterSanketanidhiSynthesis.length > 30);
});

test("Classical Acharya Venkatesha Sharma Sarvartha Chintamani (13 Adhyayas) Verification", async () => {
  const { evaluateSarvarthaChintamani } = await import("../src/engine/sarvarthaChintamani.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Tirupati", country: "India", latitude: 13.6288, longitude: 79.4192, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateSarvarthaChintamani(natalEphem);

  // 1. 12 Bhavas Wish-Fulfilling Predictions
  assert.strictEqual(result.bhavaPredictions.length, 12);
  for (const b of result.bhavaPredictions) {
    assert.ok(b.sanskritTitle);
    assert.ok(b.signName);
    assert.ok(b.lordName);
    assert.ok(b.chintamaniScore >= 0 && b.chintamaniScore <= 100);
    assert.ok(["Uttama Chintamani (उत्कृष्ट फल)", "Madhyama Chintamani (मध्यम फल)", "Samanya Chintamani (सामान्य फल)"].includes(b.fulfillmentGrade));
    assert.ok(b.primaryPrediction.length > 15);
    assert.ok(b.classicalShloka.includes("Sarvartha Chintamani"));
  }

  // 2. Special Classical Yogas
  assert.strictEqual(result.specialYogas.length, 8);
  for (const y of result.specialYogas) {
    assert.ok(y.yogaName);
    assert.ok(y.sanskritName);
    assert.ok(typeof y.isFormed === "boolean");
    assert.ok(y.potencyScore >= 0 && y.potencyScore <= 100);
    assert.ok(y.formationRule.length > 15);
  }

  // 3. Bhagyodaya Ages
  assert.strictEqual(result.bhagyodayaAges.length, 8);
  for (const bg of result.bhagyodayaAges) {
    assert.ok(bg.ageYear >= 16 && bg.ageYear <= 60);
    assert.ok(bg.triggerPlanet);
    assert.ok(typeof bg.isActive === "boolean");
    assert.ok(bg.fortuneManifestation.length > 15);
  }

  // 4. Tri-Bhaga Potency
  assert.strictEqual(result.triBhagaAnalysis.length, 4);
  for (const t of result.triBhagaAnalysis) {
    assert.ok([1, 4, 9, 10].includes(t.bhavaNum));
    assert.ok(t.prathamaThirdEffect.length > 10);
    assert.ok(t.madhyamaThirdEffect.length > 10);
    assert.ok(t.uttamaThirdEffect.length > 10);
  }

  // 5. Master Synthesis
  assert.ok(result.masterChintamaniSynthesis.length > 30);
});

test("Classical Stri Jataka (Female Horoscopy & Trimsamsha) Verification", async () => {
  const { evaluateStriJataka } = await import("../src/engine/striJataka.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Kashi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1996-05-20T10:15:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateStriJataka(natalEphem);

  // 1. Disposition
  assert.ok(result.disposition.ascendantSignType);
  assert.ok(result.disposition.moonSignType);
  assert.ok(result.disposition.summary.length > 20);

  // 2. Trimsamsha
  assert.ok(result.trimsamshaAnalysis.ascendantTrimsamshaLord);
  assert.ok(result.trimsamshaAnalysis.moonTrimsamshaLord);
  assert.ok(result.trimsamshaAnalysis.moralDisposition.length > 15);
  assert.ok(result.trimsamshaAnalysis.spiritualInclination.length > 15);

  // 3. Mangalya & Soubhagya
  assert.ok(result.mangalyaSoubhagya.mangalyaScore >= 0 && result.mangalyaSoubhagya.mangalyaScore <= 100);
  assert.ok(result.mangalyaSoubhagya.soubhagyaScore >= 0 && result.mangalyaSoubhagya.soubhagyaScore <= 100);
  assert.ok(result.mangalyaSoubhagya.maritalBlissGrade);
  assert.ok(result.mangalyaSoubhagya.partnerLongevityOutlook.length > 15);

  // 4. Visha Kanya
  assert.ok(typeof result.vishaKanya.isFormed === "boolean");
  assert.ok(typeof result.vishaKanya.isCancelled === "boolean");
  assert.ok(result.vishaKanya.cancellationFactor.length > 10);
  assert.ok(result.vishaKanya.analysis.length > 15);

  // 5. Master Synthesis
  assert.ok(result.masterStriJatakaSynthesis.length > 30);
});

test("Classical Maharshi Satyacharya Satya Jataka (Dhruva Nadi) Verification", async () => {
  const { evaluateSatyaJataka } = await import("../src/engine/satyaJataka.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Kashi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1996-05-20T10:15:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateSatyaJataka(natalEphem);

  // 1. Planetary Star Lords
  assert.strictEqual(result.planetaryStarLords.length, 9);
  for (const s of result.planetaryStarLords) {
    assert.ok(s.planetName);
    assert.ok(s.nakshatraName);
    assert.ok(s.starLord);
    assert.ok(s.manifestedBhavas.length > 0);
    assert.ok(s.effectSummary.includes("Satyacharya"));
  }

  // 2. Functional Dignities
  assert.strictEqual(result.functionalDignities.length, 7);
  for (const f of result.functionalDignities) {
    assert.ok(f.planetName);
    assert.ok(f.role);
    assert.ok(["Subha (शुभ - Auspicious)", "Asubha (अशुभ - Friction/Struggle)", "Neutral/Mixed (मिश्र)"].includes(f.dignityType));
    assert.ok(f.satyaRule.length > 15);
  }

  // 3. Janma Tara Matrix
  assert.strictEqual(result.janmaTaraMatrix.length, 9);
  for (const t of result.janmaTaraMatrix) {
    assert.ok(t.planetName);
    assert.ok(t.nakshatraName);
    assert.ok(t.taraName);
    assert.ok(typeof t.isFavorable === "boolean");
    assert.ok(t.description.length > 15);
  }

  // 4. Master Synthesis
  assert.ok(result.masterSatyaJatakaSynthesis.length > 30);
});

test("Classical Sugam Jyotish (Practical Predictive Manual & Everyday Remedies) Verification", async () => {
  const { evaluateSugamJyotish } = await import("../src/engine/sugamJyotish.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Jaipur", country: "India", latitude: 26.9124, longitude: 75.7873, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1998-11-22T14:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateSugamJyotish(natalEphem);

  // 1. 12 Bhavas Practical Diagnostics
  assert.strictEqual(result.bhavaDiagnostics.length, 12);
  for (const b of result.bhavaDiagnostics) {
    assert.ok(b.sanskritTitle);
    assert.ok(b.signName);
    assert.ok(b.lordName);
    assert.ok(b.karakaPlanet);
    assert.ok(b.practicalScore >= 0 && b.practicalScore <= 100);
    assert.ok(["Ati-Uttama (अति उत्तम)", "Uttama (उत्तम)", "Madhyama (मध्यम)", "Samanya (सामान्य)"].includes(b.practicalGrade));
    assert.ok(b.practicalOutcome.length > 15);
    assert.ok(b.actionableAdvice.length > 15);
  }

  // 2. Baladi Avasthas
  assert.strictEqual(result.baladiAvasthas.length, 9);
  for (const a of result.baladiAvasthas) {
    assert.ok(a.planetName);
    assert.ok(a.degreesInSign >= 0 && a.degreesInSign <= 30);
    assert.ok(["Bala (बाल)", "Kumara (कुमार)", "Yuva (युवा)", "Vriddha (वृद्ध)", "Mrita (मृत)"].includes(a.avasthaName));
    assert.ok([0, 10, 25, 75, 100].includes(a.potencyPercentage));
    assert.ok(a.manifestationSpeed.length > 10);
  }

  // 3. Kartari Analysis
  assert.ok(result.kartariAnalysis.length > 0);
  for (const k of result.kartariAnalysis) {
    assert.ok(k.focusBhava);
    assert.ok(["Subha Kartari (शुभ कर्तरी - Fortified Protection)", "Papa Kartari (पाप कर्तरी - Afflicted Flanking)", "Neutral / Open (तटस्थ)"].includes(k.kartariType));
    assert.ok(k.effectSummary.length > 15);
  }

  // 4. Practical Remedies
  assert.strictEqual(result.practicalRemedies.length, 9);
  for (const r of result.practicalRemedies) {
    assert.ok(r.grahaName);
    assert.ok(r.easyRemedy.length > 10);
    assert.ok(r.mantra.length > 10);
    assert.ok(r.donationItem.length > 10);
    assert.ok(r.behavioralParihara.length > 10);
  }

  // 5. Master Synthesis
  assert.ok(result.masterSugamSynthesis.length > 30);
});

test("Classical Mahakavi Kalidasa Uttara Kalamrita (VRY, Shukra-Shani Paradox & Karakatva) Verification", async () => {
  const { evaluateUttaraKalamrita } = await import("../src/engine/uttaraKalamrita.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Ujjain", country: "India", latitude: 23.1765, longitude: 75.7885, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1993-07-14T09:45:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateUttaraKalamrita(natalEphem);

  // 1. Viparita Raja Yogas (Harsha, Sarala, Vimala)
  assert.strictEqual(result.viparitaRajaYogas.length, 3);
  for (const v of result.viparitaRajaYogas) {
    assert.ok(v.yogaName);
    assert.ok(typeof v.isActive === "boolean");
    assert.ok(v.dusthanaLord);
    assert.ok(v.participatingPlanet);
    assert.ok(["Pure Classical VRY (अति प्रबल)", "Moderate VRY (मध्यम)", "Inactive"].includes(v.potency));
    assert.ok(v.kalidasaDictum.includes("Khanda 4"));
    assert.ok(v.effects.length > 15);
  }

  // 2. Shukra-Shani Dasha Paradox
  assert.ok(result.shukraShaniParadox.venusDignity);
  assert.ok(result.shukraShaniParadox.saturnDignity);
  assert.ok(["Ascetic Detachment / Hidden Friction (अपेक्षित फल विपरीतता)", "Sudden Mundane Wealth / Unexpected Rise (अप्रत्याशित धन लाभ)", "Balanced Interplay (संतुलित फल)"].includes(result.shukraShaniParadox.paradoxType));
  assert.ok(result.shukraShaniParadox.mutualDashaEffect.length > 20);
  assert.ok(result.shukraShaniParadox.kalidasaRule.includes("Khanda 4"));

  // 3. Node Mechanics
  assert.strictEqual(result.nodeMechanics.length, 2);
  for (const n of result.nodeMechanics) {
    assert.ok(n.nodeName);
    assert.ok(n.house >= 1 && n.house <= 12);
    assert.ok(n.dispositor);
    assert.ok(typeof n.isYogakaraka === "boolean");
    assert.ok(n.fruitionPattern.length > 15);
  }

  // 4. Vakra Graha Potency
  assert.strictEqual(result.vakraPotencies.length, 5);
  for (const vp of result.vakraPotencies) {
    assert.ok(vp.planetName);
    assert.ok(typeof vp.isRetrograde === "boolean");
    assert.ok(typeof vp.uchchaEquivalence === "boolean");
    assert.ok(vp.potencyScore > 0);
    assert.ok(vp.effectDescription.length > 15);
  }

  // 5. Karakatva Highlights
  assert.strictEqual(result.karakatvaHighlights.length, 9);
  for (const kh of result.karakatvaHighlights) {
    assert.ok(kh.graha);
    assert.ok(kh.significations.length >= 4);
  }

  // 6. Master Synthesis
  assert.ok(result.masterUttaraKalamritaSynthesis.length > 30);
});

test("Classical Vedic Astrology and Predictions (Multi-Tier Event Forecasting & Milestones) Verification", async () => {
  const { evaluateVedicPredictions } = await import("../src/engine/vedicPredictions.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Delhi", country: "India", latitude: 28.6139, longitude: 77.2090, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1994-04-18T11:20:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateVedicPredictions(natalEphem);

  // 1. Milestone Predictions
  assert.strictEqual(result.milestonePredictions.length, 6);
  for (const m of result.milestonePredictions) {
    assert.ok(m.milestoneId);
    assert.ok(m.title);
    assert.ok(m.sanskritTitle);
    assert.ok(m.targetBhavas.length > 0);
    assert.ok(m.probabilityScore >= 0 && m.probabilityScore <= 100);
    assert.ok(["High Certainty (अति प्रबल सम्भावना)", "Moderate Potential (मध्यम सम्भावना)", "Future / Dormant (आगामी सम्भावना)"].includes(m.probabilityTier));
    assert.ok(typeof m.tiers.tier1NatalPromise === "boolean");
    assert.ok(m.tiers.tier1Details.length > 10);
    assert.ok(typeof m.tiers.tier2DashaGateway === "boolean");
    assert.ok(m.tiers.tier2Details.length > 10);
    assert.ok(typeof m.tiers.tier3DoubleTransit === "boolean");
    assert.ok(m.tiers.tier3Details.length > 10);
    assert.ok(["Immediate (0-6 Months)", "Near-Term (6-18 Months)", "Long-Term (2-5 Years)"].includes(m.timeHorizon));
    assert.ok(m.predictiveVerdict.length > 15);
    assert.ok(m.actionGuidance.length > 15);
  }

  // 2. Overall Potency & Horizons
  assert.ok(result.overallPredictivePotency >= 0 && result.overallPredictivePotency <= 100);
  assert.ok(typeof result.activeTimeHorizons.immediateCount === "number");
  assert.ok(typeof result.activeTimeHorizons.nearTermCount === "number");
  assert.ok(typeof result.activeTimeHorizons.longTermCount === "number");

  // 3. Holistic Remedies
  assert.strictEqual(result.holisticRemedies.length, 3);
  for (const r of result.holisticRemedies) {
    assert.ok(r.category);
    assert.ok(r.remedy.length > 15);
    assert.ok(r.targetGraha);
  }

  // 4. Master Synthesis
  assert.ok(result.masterPredictionsSynthesis.length > 30);
});

test("Classical Jataka Chandrika (Laghu Parashari - Prof. B. Suryanarain Rao) Verification", async () => {
  const { evaluateJatakaChandrika } = await import("../src/engine/jatakaChandrika.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1989-11-22T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateJatakaChandrika(natalEphem);

  // 1. Core Synthesis & Classification
  assert.ok(result.ascendantSign);
  assert.ok(Array.isArray(result.yogakarakas));
  assert.ok(Array.isArray(result.benefics));
  assert.ok(Array.isArray(result.malefics));
  assert.ok(Array.isArray(result.marakas));
  assert.ok(Array.isArray(result.kendradhipatiDoshaGrahas));

  // 2. Graha Roles
  assert.strictEqual(result.grahaRoles.length, 7);
  for (const gr of result.grahaRoles) {
    assert.ok(gr.grahaName);
    assert.ok(gr.housesOwned.length > 0);
    assert.ok(["Premier Yogakaraka (अति शुभ राजयोगकारक)", "Benefic (शुभ)", "Neutral / Mixed (तटस्थ)", "Malefic (अशुभ / त्रिशडाय)", "Maraka (मारक)"].includes(gr.functionalNature));
    assert.ok(typeof gr.kendradhipatiDosha === "boolean");
    assert.ok(typeof gr.isMaraka === "boolean");
    assert.ok(gr.classicalReasoning.length > 10);
  }

  // 3. Sambandhas
  assert.ok(Array.isArray(result.sambandhas));
  for (const s of result.sambandhas) {
    assert.ok(s.planetA);
    assert.ok(s.planetB);
    assert.ok(s.sambandhaType);
    assert.ok(typeof s.isRajaYoga === "boolean");
    assert.ok(s.fruitionDescription.length > 10);
  }

  // 4. Master Synthesis
  assert.ok(result.masterChandrikaSynthesis.length > 30);
});

test("Classical Chappanna Prasna Sastra (56 Questions Horary Oracle - Prof. B. Suryanarain Rao) Verification", async () => {
  const { evaluateChappannaPrasna } = await import("../src/engine/chappannaPrasna.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Bangalore", country: "India", latitude: 12.9716, longitude: 77.5946, timezoneOffsetHours: 5.5 };
  const prasnaEphem = calculateVedicEphemeris(new Date("2026-06-21T09:08:42Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateChappannaPrasna(prasnaEphem, 1);

  // 1. Structure Verification
  assert.strictEqual(result.totalQuestionsCount, 56);
  assert.strictEqual(result.allQuestions.length, 56);
  assert.ok(result.lagnaSign);
  assert.ok(result.lagnaLord);
  assert.ok(result.moonSign);
  assert.ok(result.moonLord);

  // 2. Selected Question
  assert.strictEqual(result.selectedQuestion.id, 1);
  assert.strictEqual(result.selectedQuestion.category, "Health & Longevity");
  assert.ok(result.selectedQuestion.sanskritName);
  assert.ok(result.selectedQuestion.questionTitle);
  assert.ok(result.selectedQuestion.karyaBhava >= 1 && result.selectedQuestion.karyaBhava <= 12);
  assert.ok(result.selectedQuestion.karyeshPlanet);
  assert.ok(["Highly Favorable / Immediate Success (शीघ्र कार्य सिद्धि)", "Moderate / Delayed Success (विलम्बित फल)", "Obstruction / Unfavorable (कार्य हानि)"].includes(result.selectedQuestion.outcomeStatus));
  assert.ok(result.selectedQuestion.successProbability >= 0 && result.selectedQuestion.successProbability <= 100);
  assert.ok(result.selectedQuestion.timingOfFruition.length > 5);
  assert.ok(result.selectedQuestion.oracleVerdict.length > 15);
  assert.ok(result.selectedQuestion.classicalGuidance.length > 15);

  // 3. Master Synthesis
  assert.ok(result.masterPrasnaSynthesis.length > 30);
});

test("Classical Maharshi Bhrigu Samhita (Karmic Debts, Past Life Sins & Pariharas) Verification", async () => {
  const { evaluateBhriguSamhita } = await import("../src/engine/bhriguSamhita.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Ujjain", country: "India", latitude: 23.1765, longitude: 75.7885, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1991-03-25T14:40:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateBhriguSamhita(natalEphem);

  // 1. 6 Karmic Debts (Purva Janma Rinas)
  assert.strictEqual(result.karmicDebts.length, 6);
  for (const kd of result.karmicDebts) {
    assert.ok(kd.debtName);
    assert.ok(typeof kd.isAfflicted === "boolean");
    assert.ok(["Severe (गम्भीर)", "Moderate (मध्यम)", "Clear / Unafflicted (ऋण मुक्त)"].includes(kd.severity));
    assert.ok(kd.karmicReason.length > 15);
    assert.ok(kd.symptomsInCurrentLife.length > 15);
    assert.ok(kd.bhriguSamhitaRemedy.length > 15);
  }

  // 2. 12 Bhavas Karmic Readings
  assert.strictEqual(result.bhavaReadings.length, 12);
  for (const br of result.bhavaReadings) {
    assert.ok(br.bhava >= 1 && br.bhava <= 12);
    assert.ok(br.bhavaName);
    assert.ok(Array.isArray(br.occupyingPlanets));
    assert.ok(br.karmicImprint.length > 10);
    assert.ok(br.bhriguDictum.length > 10);
  }

  // 3. Dominant Theme & Master Synthesis
  assert.ok(result.dominantPastLifeTheme.length > 15);
  assert.ok(result.masterSamhitaSynthesis.length > 30);
});

test("Classical Sri Ramanujacharya Bhavartha Ratnakara (Dr. B.V. Raman) Verification", async () => {
  const { evaluateBhavarthaRatnakara } = await import("../src/engine/bhavarthaRatnakara.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Bangalore", country: "India", latitude: 12.9716, longitude: 77.5946, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1988-08-12T05:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateBhavarthaRatnakara(natalEphem);

  // 1. Basic properties
  assert.ok(result.ascendantSign);
  assert.ok(result.premierRatnakaraYogakaraka);
  assert.ok(result.lagnawiseRulesCount >= 0);

  // 2. Yogas & Dasha Exceptions
  assert.ok(Array.isArray(result.activeYogas));
  assert.ok(Array.isArray(result.dhanaYogas));
  assert.ok(Array.isArray(result.dashaExceptions));

  for (const y of [...result.activeYogas, ...result.dhanaYogas, ...result.dashaExceptions]) {
    assert.ok(y.yogaName);
    assert.ok(y.adhyayaNumber >= 1 && y.adhyayaNumber <= 14);
    assert.ok(y.classicalSlokaSummary.length > 10);
    assert.ok(y.drBvRamanCommentary.length > 10);
    assert.ok(["High (तीव्र)", "Moderate (मध्यम)", "Latent / Inactive (सुप्त)"].includes(y.fruitionStrength));
  }

  // 3. Master Synthesis
  assert.ok(result.masterRatnakaraSynthesis.length > 30);
});

test("Classical Jaimini Master Suite (Iranganti Rangacharya & Arudha Exceptions) Verification", async () => {
  const { evaluateJaiminiRangacharya } = await import("../src/engine/jaiminiRangacharya.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-24T18:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateJaiminiRangacharya(natalEphem);

  // 1. Varnada Lagna & 12 Padas
  assert.ok(result.varnadaLagnaSign);
  assert.strictEqual(result.varnadaPadas.length, 12);
  for (const vp of result.varnadaPadas) {
    assert.ok(vp.bhava >= 1 && vp.bhava <= 12);
    assert.ok(vp.name);
    assert.ok(vp.signName);
    assert.ok(vp.vitalityImpact.length > 5);
  }

  // 2. Shoola Dasha 9-year cycles
  assert.strictEqual(result.shoolaDashaPeriods.length, 12);
  for (const sp of result.shoolaDashaPeriods) {
    assert.ok(sp.signName);
    assert.ok(sp.startYear < sp.endYear);
    assert.strictEqual(sp.endYear - sp.startYear, 9);
    assert.ok(sp.ageRange);
    assert.ok(typeof sp.isMarakaOrRudra === "boolean");
    assert.ok(sp.healthCrisisVulnerability.length > 5);
  }

  // 3. Brahma, Rudra & Maheshwara
  assert.ok(result.brahmaRudra.brahmaPlanet);
  assert.ok(result.brahmaRudra.rudraPlanet);
  assert.ok(result.brahmaRudra.maheshwaraPlanet);
  assert.ok(result.brahmaRudra.longevityAssessment.length > 20);

  // 4. 12 Arudha Padas with Exceptions
  assert.strictEqual(result.arudhaPadasWithExceptions.length, 12);
  for (const ap of result.arudhaPadasWithExceptions) {
    assert.ok(ap.houseNum >= 1 && ap.houseNum <= 12);
    assert.ok(ap.code);
    assert.ok(ap.signName);
    assert.ok(typeof ap.isExceptionApplied === "boolean");
    assert.ok(ap.exceptionRuleNote.length > 10);
  }

  // 5. Arudha Raja Yogas & Master Synthesis
  assert.ok(Array.isArray(result.arudhaRajaYogas));
  assert.ok(result.masterRangacharyaSynthesis.length > 30);
});

test("Classical Crux of Vedic Astrology (Pt. Sanjay Rath) & Parashari Conditional Dashas Verification", async () => {
  const { evaluateCruxOfAstrology } = await import("../src/engine/cruxOfVedicAstrology.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Delhi", country: "India", latitude: 28.6139, longitude: 77.2090, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1993-07-15T09:15:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateCruxOfAstrology(natalEphem);

  // 1. Narayana Dasha
  assert.strictEqual(result.narayanaDashaPeriods.length, 12);
  assert.ok(result.activeNarayanaSign);
  for (const np of result.narayanaDashaPeriods) {
    assert.ok(np.signName);
    assert.ok(np.durationYears >= 1 && np.durationYears <= 12);
    assert.ok(np.lifeFocus.length > 5);
    assert.ok(np.narayanaIndication.length > 10);
  }

  // 2. 12 Bhavas Crux Readings
  assert.strictEqual(result.bhavaCruxReadings.length, 12);
  for (const b of result.bhavaCruxReadings) {
    assert.ok(b.bhava >= 1 && b.bhava <= 12);
    assert.ok(b.bhavaName);
    assert.ok(b.karaka);
    assert.ok(b.arudhaSign);
    assert.ok(b.vargaDeity);
    assert.ok(b.sanjayRathDictum.length > 10);
  }

  // 3. Parashari Conditional Dashas
  assert.strictEqual(result.conditionalDashas.length, 5);
  for (const cd of result.conditionalDashas) {
    assert.ok(cd.dashaName);
    assert.ok(cd.totalSpanYears > 0);
    assert.ok(typeof cd.isEligible === "boolean");
    assert.ok(cd.eligibilityReason.length > 10);
  }

  // 4. Tithi Pravesha & Master Synthesis
  assert.ok(result.tithiPraveshaOverview.length > 20);
  assert.ok(result.masterCruxSynthesis.length > 30);
});

test("Classical Kalamsa and Cuspal Interlinks Theory (KCIL - S.P. Khullar) Verification", async () => {
  const { evaluateCuspalInterlinks, getKpSubSubLord } = await import("../src/engine/cuspalInterlinks.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Delhi", country: "India", latitude: 28.6139, longitude: 77.2090, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1993-07-15T09:15:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateCuspalInterlinks(natalEphem);

  // 1. Sub-Sub Lord calculation helper
  const kp = getKpSubSubLord(125.5);
  assert.ok(kp.signLord);
  assert.ok(kp.starLord);
  assert.ok(kp.subLord);
  assert.ok(kp.subSubLord);

  // 2. 12 Cusps
  assert.strictEqual(result.cuspalData.length, 12);
  for (const c of result.cuspalData) {
    assert.ok(c.cuspNum >= 1 && c.cuspNum <= 12);
    assert.ok(c.cuspName);
    assert.ok(c.signLord);
    assert.ok(c.starLord);
    assert.ok(c.subLord);
    assert.ok(c.subSubLord);
    assert.ok(typeof c.positionalStatus === "boolean");
    assert.ok(Array.isArray(c.linkedHouses));
    assert.ok(c.primaryInterlinkSignification.length > 10);
  }

  // 3. Domain Promises
  assert.strictEqual(result.domainPromises.length, 6);
  for (const dp of result.domainPromises) {
    assert.ok(dp.domain);
    assert.ok(dp.primaryCusp >= 1 && dp.primaryCusp <= 12);
    assert.ok(dp.promiseVerdict);
    assert.ok(dp.kcilAnalysis.length > 15);
  }

  // 4. BTR & Ruling Planets
  assert.ok(result.btrDiagnostic.lagnaSsl);
  assert.ok(result.btrDiagnostic.moonNl);
  assert.ok(result.btrDiagnostic.btrRecommendation.length > 15);
  assert.ok(result.rulingPlanets.lagnaLord);
  assert.ok(result.masterKcilSynthesis.length > 30);
});

test("Classical Meena Nadi (Jeeva & Sareera Stellar Theory) Engine Verification", async () => {
  const { evaluateMeenaNadi } = await import("../src/engine/meenaNadi.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateMeenaNadi(natalEphem);

  // 1. Planets Jeeva & Sareera
  assert.ok(result.planets);
  assert.strictEqual(Object.keys(result.planets).length, 9);

  for (const p of Object.values(result.planets)) {
    assert.ok(p.planetName);
    assert.ok(p.nakshatraName);
    assert.ok(p.jeevaPlanet);
    assert.ok(p.jeevaHouse >= 1 && p.jeevaHouse <= 12);
    assert.ok(p.sareeraPlanet);
    assert.ok(p.sareeraHouse >= 1 && p.sareeraHouse <= 12);
    assert.ok(p.vitalityGrade);
    assert.ok(p.potencyScore >= 0 && p.potencyScore <= 100);
    assert.ok(p.fruitOutcome.length > 10);
  }

  // 2. Domain Promises
  assert.strictEqual(result.domainPromises.length, 6);
  for (const dp of result.domainPromises) {
    assert.ok(dp.domain);
    assert.ok(dp.primaryKaraka);
    assert.ok(dp.jeevaLord);
    assert.ok(dp.sareeraLord);
    assert.ok(dp.promiseGrade);
    assert.ok(dp.nadiGuidance.length > 15);
  }

  // 3. Synthesis
  assert.ok(Array.isArray(result.vipatPratyakVadhaAfflictions));
  assert.ok(result.masterMeenaSynthesis.length > 25);
});

test("Classical Mahadeva's Jataka Tattvam (5 Sutra Vivekas & 12 Bhavas) Verification", async () => {
  const { evaluateJatakaTattvam } = await import("../src/engine/jatakaTattvam.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluateJatakaTattvam(natalEphem);

  // 1. Active Sutras
  assert.ok(Array.isArray(result.activeSutras));
  assert.ok(result.activeSutras.length >= 10);

  for (const s of result.activeSutras) {
    assert.ok(s.id);
    assert.ok(s.viveka);
    assert.ok(s.sanskritSutra);
    assert.ok(s.englishTranslation);
    assert.strictEqual(typeof s.isActivated, "boolean");
    assert.ok(s.potencyScore >= 0 && s.potencyScore <= 100);
    assert.ok(s.lifeSignification.length > 10);
  }

  // 2. Bhava Scores
  assert.strictEqual(result.bhavaScores.length, 12);
  for (const b of result.bhavaScores) {
    assert.ok(b.bhavaNumber >= 1 && b.bhavaNumber <= 12);
    assert.ok(b.bhavaName);
    assert.ok(b.bhavaLord);
    assert.ok(b.compositeHealth >= 0 && b.compositeHealth <= 100);
    assert.ok(b.verdict);
  }

  // 3. Raja Yogas & Insights
  assert.ok(Array.isArray(result.prakirnaRajaYogas));
  assert.ok(Array.isArray(result.striJatakaInsights));
  assert.ok(result.masterJatakaTattvamSynthesis.length > 25);
});

test("Classical D-12 Padma Chakra (Dwadasamsa Nadi & 12 Adityas) Verification", async () => {
  const { evaluatePadmaChakra } = await import("../src/engine/padmaChakra.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluatePadmaChakra(natalEphem);

  // 1. 12 Petals
  assert.strictEqual(result.petals.length, 12);
  for (const petal of result.petals) {
    assert.ok(petal.petalNumber >= 1 && petal.petalNumber <= 12);
    assert.ok(petal.rashiName);
    assert.ok(petal.solarAditya);
    assert.ok(petal.adityaSignification);
    assert.ok(Array.isArray(petal.occupyingPlanets));
    assert.ok(petal.ancestralKarmicType);
    assert.ok(petal.petalScore >= 0 && petal.petalScore <= 100);
    assert.ok(petal.lifeBlessing.length > 10);
  }

  // 2. Lineage Anchors
  assert.ok(result.lagnaPetalAditya);
  assert.ok(result.sunFatherLineagePetal);
  assert.ok(result.moonMotherLineagePetal);
  assert.ok(result.ancestralBlessingScore >= 0 && result.ancestralBlessingScore <= 100);
  assert.ok(Array.isArray(result.pitruMatruRinaDiagnostics));
  assert.ok(result.masterPadmaChakraSynthesis.length > 25);
});

test("Classical D-60 Shashtiamsha, BCP 12-Year Wheel & 108 Surya Remedies Verification", async () => {
  const { evaluateShashtiamsha, evaluateBcpWheel, evaluateSuryaRemedies } = await import("../src/engine/shashtiamsha.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  // 1. D-60 Shashtiamsha
  const d60 = evaluateShashtiamsha(natalEphem);
  assert.ok(d60.planets);
  assert.strictEqual(Object.keys(d60.planets).length, 9);
  for (const p of Object.values(d60.planets)) {
    assert.ok(p.planetName);
    assert.ok(p.d60SignName);
    assert.ok(p.shashtiamshaNumber >= 1 && p.shashtiamshaNumber <= 60);
    assert.ok(p.deityName);
    assert.ok(p.deityCategory);
    assert.ok(p.sanchitaKarmaSignification.length > 10);
    assert.ok(p.karmicPotencyScore >= 0 && p.karmicPotencyScore <= 100);
  }
  assert.ok(d60.lagnaResult.deityName);
  assert.ok(d60.sanchitaKarmaScore >= 0 && d60.sanchitaKarmaScore <= 100);
  assert.ok(d60.dominantKarmicOrientation);
  assert.ok(d60.masterShashtiamshaSynthesis.length > 25);

  // 2. Bhrigu Chakra Paddhati (BCP)
  const bcp = evaluateBcpWheel(natalEphem, 28);
  assert.strictEqual(bcp.currentRunningAge, 28);
  assert.strictEqual(bcp.currentActiveCycle.activeHouseNum, 4); // (28-1)%12 + 1 = 4
  assert.strictEqual(bcp.currentActiveCycle.cycleNumber, 3);
  assert.ok(bcp.currentActiveCycle.houseSignName);
  assert.ok(bcp.currentActiveCycle.houseLord);
  assert.ok(bcp.currentActiveCycle.primaryKarmicTrigger.length > 10);
  assert.strictEqual(bcp.tenYearUpcomingCycles.length, 11);
  assert.ok(bcp.masterBcpSynthesis.length > 25);

  // 3. 108 Surya Remedies
  const surya = evaluateSuryaRemedies(natalEphem);
  assert.ok(Array.isArray(surya.names));
  assert.ok(surya.names.length >= 10);
  assert.ok(surya.solarVitalityScore >= 0 && surya.solarVitalityScore <= 100);
  assert.strictEqual(surya.targetedSolarRemedies.length, 4);
  assert.ok(surya.mantraAnushthanaRecommendation.length > 20);
});

test("Classical Maharshi Patanjali Yoga Sutras & Chakra Sadhana Engine Verification", async () => {
  const { evaluatePatanjaliYoga } = await import("../src/engine/patanjaliYoga.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  const result = evaluatePatanjaliYoga(natalEphem);

  // 1. 7 Chakras
  assert.ok(Array.isArray(result.chakras));
  assert.strictEqual(result.chakras.length, 7);
  for (const chk of result.chakras) {
    assert.ok(chk.chakraNumber >= 1 && chk.chakraNumber <= 7);
    assert.ok(chk.sanskritName);
    assert.ok(chk.englishName);
    assert.ok(chk.element);
    assert.ok(Array.isArray(chk.rulingGrahas));
    assert.ok(chk.balanceScore >= 0 && chk.balanceScore <= 100);
    assert.ok(chk.status);
    assert.ok(chk.recommendedAsana.length > 5);
    assert.ok(chk.recommendedPranayama.length > 5);
    assert.ok(chk.bijaMantra.length > 1);
  }

  // 2. 8 Limbs of Ashtanga Yoga
  assert.ok(Array.isArray(result.ashtangaLimbs));
  assert.strictEqual(result.ashtangaLimbs.length, 8);
  for (const limb of result.ashtangaLimbs) {
    assert.ok(limb.limbNumber >= 1 && limb.limbNumber <= 8);
    assert.ok(limb.limbName);
    assert.ok(limb.sanskritTitle);
    assert.ok(limb.planetaryAlignment);
    assert.ok(limb.dailyPracticeProtocol.length > 10);
    assert.ok(limb.spiritualObjective.length > 10);
  }

  // 3. Key Sutras & Synthesis
  assert.ok(Array.isArray(result.keySutras));
  assert.ok(result.keySutras.length >= 4);
  assert.ok(result.overallChakraHarmonyScore >= 0 && result.overallChakraHarmonyScore <= 100);
  assert.ok(result.chittaVrittiState);
  assert.ok(result.kaivalyaLiberationReadiness);
  assert.ok(result.masterPatanjaliSynthesis.length > 25);
});

test("Classical Kota Chakra (28-Nakshatra Fort) & Dasha-Lord Transit Engine Verification", async () => {
  const { evaluateKotaChakra, evaluateDashaLordTransit } = await import("../src/engine/kotaChakra.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  // 1. Kota Chakra
  const kota = evaluateKotaChakra(natalEphem);
  assert.ok(Array.isArray(kota.segments));
  assert.strictEqual(kota.segments.length, 28);
  for (const seg of kota.segments) {
    assert.ok(seg.nakshatraNumber28 >= 1 && seg.nakshatraNumber28 <= 28);
    assert.ok(seg.nakshatraName);
    assert.ok(seg.zone);
    assert.ok(seg.direction);
    assert.strictEqual(typeof seg.isJanmaNakshatra, "boolean");
    assert.ok(Array.isArray(seg.occupyingPlanets));
    assert.ok(seg.segmentVulnerabilityGrade);
  }
  assert.ok(kota.kotaSwamiPlanet);
  assert.ok(kota.kotaSwamiZone);
  assert.ok(kota.kotaPalaPlanet);
  assert.ok(kota.kotaPalaZone);
  assert.strictEqual(typeof kota.isKotaBhangaActive, "boolean");
  assert.ok(kota.fortDefenseScore >= 0 && kota.fortDefenseScore <= 100);
  assert.ok(Array.isArray(kota.vulnerabilityWarnings));
  assert.ok(kota.masterKotaSynthesis.length > 25);

  // 2. Dasha-Lord Transit
  const dlt = evaluateDashaLordTransit(natalEphem, "Jupiter", "Saturn");
  assert.strictEqual(dlt.activeMahadashaLord, "Jupiter");
  assert.strictEqual(dlt.activeAntardashaLord, "Saturn");
  assert.ok(Array.isArray(dlt.transitsFromMahaDasha));
  assert.strictEqual(dlt.transitsFromMahaDasha.length, 4);
  for (const t of dlt.transitsFromMahaDasha) {
    assert.ok(t.planetName);
    assert.ok(t.houseFromDasha >= 1 && t.houseFromDasha <= 12);
    assert.ok(t.transitImpact.length > 10);
  }
  assert.strictEqual(dlt.transitsFromAntarDasha.length, 4);
  assert.ok(dlt.masterDashaTransitSynthesis.length > 25);
});

test("Classical Dr. B.V. Raman 300 Important Combinations, Lal Kitab Tevas & Narayana Kavacham Verification", async () => {
  const { evaluateRaman300Combinations, evaluateLalKitabTeva, evaluateNarayanaKavacham } = await import("../src/engine/raman300Combinations.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  // 1. Raman 300 Combinations
  const raman = evaluateRaman300Combinations(natalEphem);
  assert.ok(Array.isArray(raman.activeYogas));
  assert.ok(raman.totalActiveCount >= 1);
  assert.ok(raman.premierYoga);
  assert.ok(raman.premierYoga.yogaName);
  assert.ok(raman.premierYoga.sanskritTitle);
  assert.ok(raman.rajaYogaScore >= 0 && raman.rajaYogaScore <= 100);
  assert.ok(raman.dhanaYogaScore >= 0 && raman.dhanaYogaScore <= 100);
  assert.ok(raman.masterRamanSynthesis.length > 25);

  // 2. Lal Kitab Teva
  const lk = evaluateLalKitabTeva(natalEphem);
  assert.ok(lk.tevaType);
  assert.ok(lk.tevaSignification.length > 10);
  assert.ok(Array.isArray(lk.karmicRinaDebts));
  assert.ok(lk.karmicRinaDebts.length >= 2);
  assert.ok(Array.isArray(lk.targetedLalKitabRemedies));
  assert.ok(lk.targetedLalKitabRemedies.length >= 2);
  assert.ok(lk.masterLalKitabSynthesis.length > 20);

  // 3. Narayana Kavacham
  const nk = evaluateNarayanaKavacham(natalEphem);
  assert.ok(Array.isArray(nk.shields));
  assert.strictEqual(nk.shields.length, 9);
  for (const s of nk.shields) {
    assert.ok(s.planetName);
    assert.ok(s.narayanaForm);
    assert.ok(s.sanskritArmorVerse);
    assert.ok(s.protectiveShieldBenefit.length > 10);
  }
  assert.ok(nk.supremeProtectorForm);
  assert.ok(nk.masterKavachamSynthesis.length > 20);
});

test("Empirical Benchmark Horoscopes & Archetypal Karmic Resonance Engine Verification", async () => {
  const { evaluateBenchmarkResonance, BENCHMARK_TITANS } = await import("../src/engine/benchmarkHoroscopes.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  // 1. Titans Database
  assert.ok(Array.isArray(BENCHMARK_TITANS));
  assert.ok(BENCHMARK_TITANS.length >= 8);
  for (const t of BENCHMARK_TITANS) {
    assert.ok(t.id);
    assert.ok(t.name);
    assert.ok(t.category);
    assert.ok(t.birthData);
    assert.ok(t.lagnaSign);
    assert.ok(t.moonSign);
    assert.ok(t.keyPlanetarySignature.length > 10);
    assert.ok(Array.isArray(t.paramountYogas));
    assert.ok(t.paramountYogas.length >= 2);
    assert.ok(t.destinyMilestone.length > 15);
  }

  // 2. Resonance Analysis
  const result = evaluateBenchmarkResonance(natalEphem);
  assert.ok(Array.isArray(result.archetypes));
  assert.strictEqual(result.archetypes.length, 5);
  for (const a of result.archetypes) {
    assert.ok(a.category);
    assert.ok(a.resonancePercentage >= 0 && a.resonancePercentage <= 100);
    assert.ok(a.closestTitanMatch);
    assert.ok(a.sharedAstrologicalBlueprint.length > 10);
    assert.ok(a.karmicTakeaway.length > 10);
  }
  assert.ok(result.topArchetype);
  assert.ok(result.topTitanMatch);
  assert.ok(result.overallResonanceProfile.length > 20);
  assert.ok(result.masterBenchmarkSynthesis.length > 25);
});

test("Sri Neelakanta Prasna Tantra 16 Tajik Yogas, 12 Sahams & Margabandhu Shield Engine Verification", async () => {
  const { evaluatePrasnaTantra, evaluateMargabandhuStotram, DEEPTAMSHAS, PLANET_SPEED_RANK } = await import("../src/engine/prasnaTantra.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  // 1. Constants check
  assert.strictEqual(DEEPTAMSHAS.Sun, 15);
  assert.strictEqual(DEEPTAMSHAS.Moon, 12);
  assert.strictEqual(PLANET_SPEED_RANK.Moon, 1);

  // 2. 16 Tajik Yogas & Horary
  const pt = evaluatePrasnaTantra(natalEphem);
  assert.ok(Array.isArray(pt.tajikYogas));
  assert.ok(pt.tajikYogas.length >= 7);
  for (const y of pt.tajikYogas) {
    assert.ok(y.yogaNumber >= 1 && y.yogaNumber <= 16);
    assert.ok(y.yogaName);
    assert.ok(y.sanskritTitle);
    assert.ok(y.fasterPlanet);
    assert.ok(y.slowerPlanet);
    assert.ok(y.aspectType);
    assert.strictEqual(typeof y.isWithinDeeptamsha, "boolean");
    assert.strictEqual(typeof y.isActive, "boolean");
    assert.ok(y.horaryFruitionVerdict);
    assert.ok(y.classicalFormula.length > 10);
  }
  assert.ok(pt.primaryIthasalaStatus.length > 10);
  assert.ok(pt.querySuccessScore >= 0 && pt.querySuccessScore <= 100);
  assert.ok(pt.masterPrasnaVerdict.length > 25);

  // 3. 12 Tajik Sahams
  assert.ok(Array.isArray(pt.sahams));
  assert.strictEqual(pt.sahams.length, 12);
  for (const s of pt.sahams) {
    assert.ok(s.sahamNumber >= 1 && s.sahamNumber <= 12);
    assert.ok(s.sahamName);
    assert.ok(s.sanskritTitle);
    assert.ok(s.longitude >= 0 && s.longitude < 360);
    assert.ok(s.signName);
    assert.ok(s.degreesInSign >= 0 && s.degreesInSign < 30);
    assert.ok(s.houseNumber >= 1 && s.houseNumber <= 12);
    assert.ok(s.significance.length > 10);
    assert.ok(s.calculationRule.length > 5);
  }

  // 4. Margabandhu Stotram Shield
  const mb = evaluateMargabandhuStotram(natalEphem);
  assert.ok(Array.isArray(mb.verses));
  assert.strictEqual(mb.verses.length, 3);
  for (const v of mb.verses) {
    assert.ok(v.verseNumber >= 1);
    assert.ok(v.deityInvoked);
    assert.ok(v.sanskritShloka);
    assert.ok(v.englishMeaning);
    assert.ok(v.travelProtectionDomain.length > 10);
  }
  assert.ok(mb.shieldActivationScore >= 0 && mb.shieldActivationScore <= 100);
  assert.ok(mb.masterMargabandhuSynthesis.length > 20);
});

test("C.S. Patel & Aiyar Ashtakavarga Shodhana, Shodhya Pinda & 8 Kakshyas Engine Verification", async () => {
  const { evaluatePatelAshtakavarga, applyTrikonaShodhana, applyEkadhipatyaShodhana, RASHI_GUNAKARAS, GRAHA_GUNAKARAS, KAKSHYA_LORDS } = await import("../src/engine/patelAshtakavarga.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), location, "Lahiri", "WholeSign", "Mean");

  // 1. Constants verification
  assert.strictEqual(RASHI_GUNAKARAS.length, 12);
  assert.strictEqual(RASHI_GUNAKARAS[0], 7); // Aries = 7
  assert.strictEqual(RASHI_GUNAKARAS[11], 12); // Pisces = 12
  assert.strictEqual(GRAHA_GUNAKARAS.Sun, 5);
  assert.strictEqual(GRAHA_GUNAKARAS.Jupiter, 10);
  assert.strictEqual(KAKSHYA_LORDS.length, 8);

  // 2. Trikona & Ekadhipatya Shodhana logic tests
  const testBindus = [5, 4, 3, 6, 5, 2, 4, 3, 2, 6, 5, 4];
  const trikonaRes = applyTrikonaShodhana(testBindus);
  assert.strictEqual(trikonaRes.length, 12);
  // Aries(0)=5, Leo(4)=5, Sag(8)=2 -> min=2 -> reduced: 3, 3, 0
  assert.strictEqual(trikonaRes[0], 3);
  assert.strictEqual(trikonaRes[4], 3);
  assert.strictEqual(trikonaRes[8], 0);

  const ekadhipatyaRes = applyEkadhipatyaShodhana(trikonaRes, new Set([0, 2]));
  assert.strictEqual(ekadhipatyaRes.length, 12);

  // 3. Full Patel Ashtakavarga Evaluation
  const pa = evaluatePatelAshtakavarga(natalEphem);
  assert.ok(Array.isArray(pa.shodhyaPindas));
  assert.strictEqual(pa.shodhyaPindas.length, 7);
  for (const p of pa.shodhyaPindas) {
    assert.ok(p.planetName);
    assert.strictEqual(p.rawBindus.length, 12);
    assert.strictEqual(p.trikonaReducedBindus.length, 12);
    assert.strictEqual(p.ekadhipatyaReducedBindus.length, 12);
    assert.ok(p.rashiPinda >= 0);
    assert.ok(p.grahaPinda >= 0);
    assert.strictEqual(p.shodhyaPinda, p.rashiPinda + p.grahaPinda);
    assert.ok(p.longevityAyurContributionYears >= 0);
  }

  assert.ok(pa.sarvashtakaShodhyaPindaTotal > 100);
  assert.ok(Array.isArray(pa.vitalPlanetaryPindas));
  assert.strictEqual(pa.vitalPlanetaryPindas.length, 7);

  // 4. 8 Kakshyas System
  assert.ok(Array.isArray(pa.kakshyas));
  assert.strictEqual(pa.kakshyas.length, 8);
  for (const k of pa.kakshyas) {
    assert.ok(k.kakshyaNumber >= 1 && k.kakshyaNumber <= 8);
    assert.ok(k.degreeSpan);
    assert.ok(k.governingLord);
    assert.strictEqual(typeof k.hasBeneficBindu, "boolean");
    assert.ok(Array.isArray(k.currentTransitingPlanets));
    assert.ok(k.transitActivationStatus.length > 10);
  }
  assert.ok(pa.masterPatelSynthesis.length > 25);
});

test("Classical Ashtakavarga Synastry & Dual Chart Compatibility (C.S. Patel & Parashara) Verification", async () => {
  const { calculateMatchmaking } = await import("../src/engine/matchmaking.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const loc = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const boyEphem = calculateVedicEphemeris(new Date("1995-10-15T06:30:00Z"), loc, "Lahiri", "WholeSign", "Mean");
  const girlEphem = calculateVedicEphemeris(new Date("1998-05-25T04:45:00Z"), loc, "Lahiri", "WholeSign", "Mean");

  const match = calculateMatchmaking(boyEphem, girlEphem);

  assert.ok(match);
  assert.ok(match.totalScore >= 0 && match.totalScore <= 36);
  assert.ok(match.ashtakavargaCompatibility);

  const av = match.ashtakavargaCompatibility;
  assert.ok(av.boyLagnaSAVInGirlChart >= 0);
  assert.ok(av.girlLagnaSAVInBoyChart >= 0);
  assert.ok(av.boyMoonSAVInGirlChart >= 0);
  assert.ok(av.girlMoonSAVInBoyChart >= 0);
  assert.ok(av.boyMoonBAVInGirl >= 0 && av.boyMoonBAVInGirl <= 8);
  assert.ok(av.girlMoonBAVInBoy >= 0 && av.girlMoonBAVInBoy <= 8);
  assert.ok(av.boy7thHouseSAV > 0);
  assert.ok(av.girl7thHouseSAV > 0);
  assert.ok(av.ashtakavargaScore >= 0 && av.ashtakavargaScore <= 100);
  assert.ok(av.verdict);
  assert.ok(Array.isArray(av.principles));
  assert.ok(av.principles.length >= 3);

  // D-1 and D-9 Multi-Varga Synastry verification
  assert.ok(match.d1d9Synastry);
  assert.ok(match.d1d9Synastry.boyD9LagnaRashi);
  assert.ok(match.d1d9Synastry.girlD9LagnaRashi);
  assert.ok(match.d1d9Synastry.d9LagnaRelationship);
  assert.ok(typeof match.d1d9Synastry.isD9LagnaLordInTrik === "boolean");
  assert.ok(match.d1d9Synastry.d9LagnaLordCrossVerdict.length > 10);
  assert.ok(typeof match.d1d9Synastry.crossSynastryScorePercent === "number");
  assert.ok(match.d1d9Synastry.synthesis.length > 20);
});

test("Predictive Decision Gates & Deterministic Shastric Proofs Verification", async () => {
  const { calculatePredictiveDecisionGates } = await import("../src/engine/predictiveDecisionGates.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const loc = { cityName: "New Delhi", country: "India", latitude: 28.6139, longitude: 77.209, timezoneOffsetHours: 5.5 };
  const ephem = calculateVedicEphemeris(new Date("1998-05-25T00:16:00Z"), loc, "Lahiri", "WholeSign", "Mean");

  const gates = calculatePredictiveDecisionGates(ephem);

  assert.ok(gates);
  assert.ok(gates.careerGate);
  assert.ok(gates.careerGate.tenthLord);
  assert.ok(gates.careerGate.amatyakaraka.planet);
  assert.ok(gates.careerGate.timingWindow);

  assert.ok(gates.marriageGate);
  assert.ok(gates.marriageGate.seventhLord);
  assert.ok(gates.marriageGate.darakaraka.planet);
  assert.ok(gates.marriageGate.timingWindow);
  assert.strictEqual(typeof gates.marriageGate.delayIndicatorSaturnD9Lagna, "boolean");

  assert.ok(gates.healthGate);
  assert.ok(gates.healthGate.lagnaLord);
  assert.ok(gates.healthGate.vitalityStatus);

  assert.ok(gates.educationGate);
  assert.ok(gates.educationGate.fifthLord);
  assert.ok(gates.educationGate.recommendedStreams.length > 0);

  assert.ok(gates.prasnaGate);
  assert.ok(gates.prasnaGate.definitiveVerdict);

  assert.ok(Array.isArray(gates.executiveSummary));
  assert.ok(gates.executiveSummary.length >= 4);
});

test("Classical Job vs Business & D-10 Dasamsa Career Engine Verification", async () => {
  const { analyzeCareerJobBusiness } = await import("../src/engine/careerJobBusiness.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Mau", country: "India", latitude: 25.94, longitude: 83.56, timezoneOffsetHours: 5.5 };
  const ephem = calculateVedicEphemeris(new Date("1998-05-24T18:46:51.000Z"), location, "Lahiri", "WholeSign", "Mean");

  const career = analyzeCareerJobBusiness(ephem);

  assert.ok(career);
  assert.ok(typeof career.leftCount === "number");
  assert.ok(typeof career.rightCount === "number");
  assert.strictEqual(career.leftCount + career.rightCount, 9);
  assert.ok(["Left (Service & Self-Execution)", "Right (Trade, Public & Business)", "Balanced"].includes(career.hemisphereDominance));
  assert.ok(career.d10LagnaSign);
  assert.ok(career.d10LagnaLord);
  assert.ok(career.d110thLordInD10);
  assert.ok(typeof career.d110thLordD10House === "number");
  assert.ok(career.amatyakarakaPlanet);
  assert.ok(typeof career.savHouse6 === "number");
  assert.ok(typeof career.savHouse7 === "number");
  assert.ok(career.bnnCareerArchetype);
  assert.ok(Array.isArray(career.recommendedVocationStreams));
  assert.ok(career.recommendedVocationStreams.length > 0);
  assert.ok(career.primaryRecommendation);
  assert.ok(career.executiveSummary.length > 20);
  assert.ok(career.promotionsAndTimingNote.length > 20);
});

test("Classical Pushkara Navamsha & Pushkara Bhaga Engine (Jataka Parijata) Verification", async () => {
  const { evaluatePushkaraNavamsha, evaluatePushkaraForLongitude } = await import("../src/engine/pushkaraNavamsha.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  // 1. Direct Longitude Unit Checks
  // Aries 21.0° (Fire, 7th Navamsha) -> Pushkara Navamsha (Libra) & Pushkara Bhaga
  const p1 = evaluatePushkaraForLongitude(21.0, "sun", "Sun", "सूर्य");
  assert.strictEqual(p1.isPushkaraNavamsha, true);
  assert.strictEqual(p1.pushkaraNavamshaType, "Fire-Libra");
  assert.strictEqual(p1.d9RashiName, "Libra");
  assert.strictEqual(p1.d9RashiLord, "Venus");
  assert.strictEqual(p1.isPushkaraBhaga, true);

  // Taurus 14.5° (Earth, 5th Navamsha -> Taurus) -> Pushkara Vargottama & Pushkara Bhaga
  const p2 = evaluatePushkaraForLongitude(30 + 14.5, "moon", "Moon", "चन्द्र");
  assert.strictEqual(p2.isPushkaraNavamsha, true);
  assert.strictEqual(p2.isPushkaraVargottama, true);
  assert.strictEqual(p2.d9RashiName, "Taurus");
  assert.strictEqual(p2.isPushkaraBhaga, true);

  // Cancer 1.5° (Water, 1st Navamsha -> Cancer) -> Pushkara Vargottama
  const p3 = evaluatePushkaraForLongitude(90 + 1.5, "jup", "Jupiter", "गुरु");
  assert.strictEqual(p3.isPushkaraNavamsha, true);
  assert.strictEqual(p3.isPushkaraVargottama, true);
  assert.strictEqual(p3.d9RashiName, "Cancer");

  // 2. Full Chart Evaluator
  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const ephem = calculateVedicEphemeris(new Date("1998-05-24T18:46:51.000Z"), location, "Lahiri", "WholeSign", "Mean");

  const pushkaraRes = evaluatePushkaraNavamsha(ephem);
  assert.ok(pushkaraRes);
  assert.ok(typeof pushkaraRes.totalPushkaraEntitiesCount === "number");
  assert.ok(Array.isArray(pushkaraRes.pushkaraEntities));
  assert.ok(typeof pushkaraRes.isLagnaInPushkara === "boolean");
  assert.ok(pushkaraRes.overallPushkaraBlessingSummary.length > 20);
});

test("Master Multi-Varga Marriage & Separation Shields Engine (Stri Jataka) Verification", async () => {
  const { evaluateMarriageMasterSynthesis } = await import("../src/engine/marriageMasterSynthesis.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const ephem = calculateVedicEphemeris(new Date("1998-05-24T18:46:51.000Z"), location, "Lahiri", "WholeSign", "Mean");

  const marriageReport = evaluateMarriageMasterSynthesis(ephem, "male");
  assert.ok(marriageReport);
  assert.ok(["Early Marriage", "Timely Marriage (Auspicious Age)", "Delayed Marriage", "Ascetic / Spiritual Focus"].includes(marriageReport.marriageTimingClassification));
  assert.ok(typeof marriageReport.qualityOfMarriageScore === "number");
  assert.ok(marriageReport.qualityOfMarriageScore >= 35 && marriageReport.qualityOfMarriageScore <= 100);
  assert.ok(["Low / Harmonious", "Moderate / Resolvable via Remedies", "High / Requires Pre-marital Alignment"].includes(marriageReport.divorceSeparationRiskLevel));
  assert.ok(typeof marriageReport.isForeignSpouseIndicated === "boolean");
  assert.ok(marriageReport.spouseComplexion.length > 10);
  assert.ok(marriageReport.spouseArchetypeDetails.length > 10);
  assert.ok(marriageReport.executiveMarriageSummary.length > 20);
});

test("Classical Relationship, Love Affairs, Elopement & Yogini Dasha Engine Verification", async () => {
  const { evaluateRelationshipAffairs, YOGINI_DASHAS } = await import("../src/engine/relationshipAffairsMaster.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  // 1. Yogini Dasha static verification (36 years total)
  assert.strictEqual(YOGINI_DASHAS.length, 8);
  const totalYears = YOGINI_DASHAS.reduce((sum, y) => sum + y.years, 0);
  assert.strictEqual(totalYears, 36);

  // 2. Full Chart Evaluator
  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const ephem = calculateVedicEphemeris(new Date("1998-05-24T18:46:51.000Z"), location, "Lahiri", "WholeSign", "Mean");

  const relReport = evaluateRelationshipAffairs(ephem, "male");
  assert.ok(relReport);
  assert.ok(typeof relReport.isLoveMarriageLikely === "boolean");
  assert.ok(typeof relReport.isElopementRiskPresent === "boolean");
  assert.ok(relReport.sexualDesireSynthesis.length > 10);
  assert.ok(relReport.d9AffairsSynthesis.length > 10);
  assert.ok(relReport.activeYoginiDasha);
  assert.ok(relReport.activeYoginiDasha.name);
  assert.ok(relReport.tripleDashaMarriageConvergence.length > 20);
  assert.ok(relReport.executiveRelationshipSummary.length > 20);
});

test("Classical Bhrigu Nandi Nadi, Vivah Saham & Rashi Tulya Navamsha Engine Verification", async () => {
  const { evaluateBhriguNadiMarriageTiming } = await import("../src/engine/bhriguNadiMarriageTiming.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1998-05-24T18:46:51.000Z"), location, "Lahiri", "WholeSign", "Mean");
  const transitEphem = calculateVedicEphemeris(new Date("2026-08-31T00:00:00.000Z"), location, "Lahiri", "WholeSign", "Mean");

  const bnnReport = evaluateBhriguNadiMarriageTiming(natalEphem, transitEphem, "male");
  assert.ok(bnnReport);
  assert.ok(typeof bnnReport.brighuBinduLongitude === "number");
  assert.ok(bnnReport.brighuBinduRashi);
  assert.ok(bnnReport.brighuBinduDegreeStr);
  assert.ok(typeof bnnReport.isTransitBeneficOnBB === "boolean");
  assert.ok(bnnReport.sensitiveNadiSignName);
  assert.ok(bnnReport.bnnTransitMarriageVerdict.length > 10);
  assert.ok(typeof bnnReport.vivahSahamLongitude === "number");
  assert.ok(bnnReport.vivahSahamDegreeStr);
  assert.ok(typeof bnnReport.rashiTulyaKendraTrikonaCount === "number");
  assert.ok(bnnReport.d9TattvaSummary.length > 10);
  assert.ok(bnnReport.executiveBnnTimingSummary.length > 20);
});

test("End-to-End Chatbot Astro Dossier (All 65 Sections & Notes) Verification", async () => {
  const { buildAstroDossier } = await import("../src/engine/chatContext.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const natalEphem = calculateVedicEphemeris(new Date("1998-05-24T18:46:51.000Z"), location, "Lahiri", "WholeSign", "Mean");
  const transitEphem = calculateVedicEphemeris(new Date("2026-08-31T00:00:00.000Z"), location, "Lahiri", "WholeSign", "Mean");

  const dossier = buildAstroDossier(natalEphem, transitEphem, new Date("2026-08-31T00:00:00.000Z"), "male");
  assert.ok(dossier);
  assert.ok(dossier.length > 10000);

  // Verify all handwritten notes sections are present in the dossier
  assert.ok(dossier.includes("#### 💼 61. JOB VS BUSINESS, CAREER ORIENTATION & D-10 DASAMSA PHALA DOSSIER (15 CLASSICAL RULES):"), "Section 61 missing");
  assert.ok(dossier.includes("#### 🌸 62. PUSHKARA NAVAMSHA, PUSHKARA BHAGA & PUSHKARA VARGOTTAMA (JATAKA PARIJATA) DOSSIER:"), "Section 62 missing");
  assert.ok(dossier.includes("#### 💍 63. MASTER MULTI-VARGA MARRIAGE, SPOUSE COMPLEXION & SEPARATION SHIELDS (STRI JATAKA) DOSSIER:"), "Section 63 missing");
  assert.ok(dossier.includes("#### 💘 64. LOVE AFFAIRS, ELOPEMENT, SEXUAL VITALITY & YOGINI DASHA (STRI JATAKA) DOSSIER:"), "Section 64 missing");
  assert.ok(dossier.includes("#### 🕊️ 65. BHRIGU NANDI NADI, VIVAH SAHAM & RASHI TULYA NAVAMSHA DOSSIER:"), "Section 65 missing");
  assert.ok(dossier.includes("#### 🤰 66. ADHANA KUNDALI (CONCEPTION CHART) & 10-MONTH FOETAL GESTATION DOSSIER:"), "Section 66 missing");
  assert.ok(dossier.includes("#### 🔤 67. VEDIC NAME DECODING, SVARA JYOTISH & CALLING NAME PHONETICS DOSSIER:"), "Section 67 missing");

  // Verify key variables and terms inside the dossier
  assert.ok(dossier.includes("Chart Hemisphere Distribution"), "Hemisphere distribution missing in Section 61");
  assert.ok(dossier.includes("Pushkara Entities List"), "Pushkara list missing in Section 62");
  assert.ok(dossier.includes("Spouse Physical Appearance & Complexion"), "Complexion missing in Section 63");
  assert.ok(dossier.includes("Yogini Dasha Timing Matrix"), "Yogini Dasha missing in Section 64");
  assert.ok(dossier.includes("Brighu Bindu"), "Brighu Bindu missing in Section 65");
  assert.ok(dossier.includes("Vivah Saham"), "Vivah Saham missing in Section 65");
  assert.ok(dossier.includes("Estimated Conception Date (Adhana Epoch)"), "Conception date missing in Section 66");
  assert.ok(dossier.includes("Garbha Raksha"), "Garbha Raksha missing in Section 66");
  assert.ok(dossier.includes("Sacred Janma / Sankalpa Syllable"), "Sankalpa syllable missing in Section 67");
  assert.ok(dossier.includes("Predicted Worldly Calling / Certificate Name Letters"), "Calling letters missing in Section 67");
});

test("Classical Adhana Kundali (Epoch Conception Chart & 10-Month Foetal Gestation) Verification", async () => {
  const { calculateAdhanaKundali } = await import("../src/engine/adhanaKundali.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const loc = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const birthDate = new Date("1998-05-24T18:46:51.000Z");
  const natalEphem = calculateVedicEphemeris(birthDate, loc, "Lahiri", "WholeSign", "Mean");

  const adhana = calculateAdhanaKundali(natalEphem, birthDate, loc);
  assert.ok(adhana);
  assert.ok(adhana.estimatedConceptionDate instanceof Date);
  assert.ok(adhana.gestationDurationDays >= 250 && adhana.gestationDurationDays <= 300);
  assert.ok(adhana.adhanaLagnaSign);
  assert.ok(adhana.adhanaLagnaLord);
  assert.ok(adhana.adhanaMoonSign);
  assert.ok(adhana.adhanaMoonNakshatra);
  assert.ok(adhana.gestationalMonths.length === 10);

  // Verify Masa Patis
  assert.strictEqual(adhana.gestationalMonths[0].rulingPlanet, "Venus");
  assert.strictEqual(adhana.gestationalMonths[1].rulingPlanet, "Mars");
  assert.strictEqual(adhana.gestationalMonths[2].rulingPlanet, "Jupiter");
  assert.strictEqual(adhana.gestationalMonths[3].rulingPlanet, "Sun");
  assert.strictEqual(adhana.gestationalMonths[4].rulingPlanet, "Moon");
  assert.strictEqual(adhana.gestationalMonths[5].rulingPlanet, "Saturn");
  assert.strictEqual(adhana.gestationalMonths[6].rulingPlanet, "Mercury");
  assert.strictEqual(adhana.gestationalMonths[8].rulingPlanet, "Moon");
  assert.strictEqual(adhana.gestationalMonths[9].rulingPlanet, "Sun");

  // Verify Garbha Raksha & BTR
  assert.ok(adhana.garbhaRaksha.protectionScore >= 0 && adhana.garbhaRaksha.protectionScore <= 100);
  assert.ok(adhana.garbhaRaksha.verdict);
  assert.ok(adhana.btrConfidenceScore >= 50);
  assert.ok(adhana.executiveSummary.length > 20);
});

test("Classical Vedic Name Decoding & Svara Jyotish Verification", async () => {
  const { evaluateVedicNameMatrix } = await import("../src/engine/nameAnalysis.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  // Test Chart 1: 17/09/1999 18:32 Allahabad
  const loc1 = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };
  const dt1 = new Date("1999-09-17T13:02:00.000Z");
  const ephem1 = calculateVedicEphemeris(dt1, loc1, "Lahiri", "WholeSign", "Mean");

  const nameRes1 = evaluateVedicNameMatrix(ephem1, "male");
  assert.strictEqual(nameRes1.janmaNakshatraName, "Jyeshtha");
  assert.strictEqual(nameRes1.janmaNakshatraPada, 4);
  assert.strictEqual(nameRes1.janmaSyllableEnglish, "Yu");
  assert.ok(nameRes1.predictedCallingLetters.includes("A"), "Calling letters should include 'A' due to Sun aspect on Lagna");
  assert.ok(nameRes1.predictedSpouseLetters.length > 0);

  // Test Chart 2: 25/05/1998 14:35 Patna
  const loc2 = { cityName: "Patna", country: "India", latitude: 25.5941, longitude: 85.1376, timezoneOffsetHours: 5.5 };
  const dt2 = new Date("1998-05-25T09:05:00.000Z");
  const ephem2 = calculateVedicEphemeris(dt2, loc2, "Lahiri", "WholeSign", "Mean");

  const nameRes2 = evaluateVedicNameMatrix(ephem2, "male");
  assert.strictEqual(nameRes2.janmaNakshatraName, "Krittika");
  assert.strictEqual(nameRes2.janmaNakshatraPada, 3);
  assert.strictEqual(nameRes2.janmaSyllableEnglish, "U / Oo");
  assert.ok(nameRes2.predictedCallingLetters.includes("R") || nameRes2.predictedCallingLetters.includes("A"), "Calling letters should include 'R' or 'A'");
});

test("Client Reviews & Feedback Database Storage & 1-Day Rate Limit Verification", async () => {
  const { saveReview, getReviews, hasRecentReviewByEmail } = await import("../src/lib/db.ts");

  const testEmail = `aryavrat_${Date.now()}@testvedic.com`;

  // 1. Initially should be false (no submission in last 24h)
  const initialCheck = await hasRecentReviewByEmail(testEmail, 24);
  assert.strictEqual(initialCheck, false, "Initial check should be false");

  const testReview = {
    name: "Aryavrat Sharma",
    email: testEmail,
    subject: "Accurate Dasha Timing", // Max 20 chars
    description: "The BTR and career prediction timing was exceptionally accurate!",
    rating: 5,
  };

  const saved = await saveReview(testReview);
  assert.ok(saved.id.startsWith("rev_"));
  assert.strictEqual(saved.name, "Aryavrat Sharma");
  assert.strictEqual(saved.email, testEmail);
  assert.strictEqual(saved.subject, "Accurate Dasha Timing".slice(0, 20));
  assert.strictEqual(saved.rating, 5);
  assert.ok(saved.createdAt);

  // 2. Immediately after submission, 24-hour rate limit check should be true
  const afterCheck = await hasRecentReviewByEmail(testEmail, 24);
  assert.strictEqual(afterCheck, true, "Rate limit check must be true within 24 hours of submission");

  const allReviews = await getReviews();
  assert.ok(Array.isArray(allReviews));
  const found = allReviews.find((r) => r.id === saved.id);
  assert.ok(found, "Saved review should be present in getReviews list");
});

test("Chatbot Intent-Based Context Slicing & High-Efficiency Dossier Verification", async () => {
  const { detectConsultationIntent, buildAstroDossier } = await import("../src/engine/chatContext.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  // 1. Verify intent detection
  assert.strictEqual(detectConsultationIntent("When will I get a promotion in my job?"), "career");
  assert.strictEqual(detectConsultationIntent("What is my spouse's direction and marriage timing?"), "marriage");
  assert.strictEqual(detectConsultationIntent("What is the 1st letter of my name based on nakshatra?"), "name_phonetics");
  assert.strictEqual(detectConsultationIntent("Can we do birth time verification?"), "btr_verification");
  assert.strictEqual(detectConsultationIntent("What is today's panchang and rahu kalam?"), "panchang_muhurta");
  assert.strictEqual(detectConsultationIntent("What mantra or gemstone remedy should I wear?"), "remedies_health");
  assert.strictEqual(detectConsultationIntent("Tell me about my general life"), "all");

  // 2. Verify dossier token / length efficiency
  const loc = { cityName: "New Delhi", country: "India", latitude: 28.6139, longitude: 77.209, timezoneOffsetHours: 5.5 };
  const dt = new Date("1995-10-15T06:30:00.000Z");
  const natal = calculateVedicEphemeris(dt, loc, "Lahiri", "WholeSign", "Mean");
  const transit = calculateVedicEphemeris(new Date(), loc, "Lahiri", "WholeSign", "Mean");

  const fullDossier = buildAstroDossier(natal, transit, new Date(), "male", undefined, "all");
  const careerDossier = buildAstroDossier(natal, transit, new Date(), "male", undefined, "career");
  const nameDossier = buildAstroDossier(natal, transit, new Date(), "male", undefined, "name_phonetics");

  // Verify that targeted dossiers are significantly more compact than the full 67-section payload
  assert.ok(fullDossier.length > careerDossier.length, "Career dossier must be more compact than full dossier");
  assert.ok(careerDossier.length > nameDossier.length, "Name phonetics dossier must be even more focused");
  assert.ok(careerDossier.includes("JOB VS BUSINESS"), "Career dossier must contain Job vs Business section");
  assert.ok(nameDossier.includes("VEDIC NAME DECODING"), "Name dossier must contain Svara Jyotish section");
});

test("Dr. Samir Tripathi Vedic Master Suite (Indu Lagna, Age Triggers & Baadhak Dynamics) Verification", async () => {
  const {
    calculateInduLagna,
    calculatePlanetaryAgeActivations,
    evaluateBaadhakDynamics,
    calculateBhagyaBindu,
    generateDrSamirTripathiSummary,
    INDU_KALA_VALUES,
  } = await import("../src/engine/samirTripathiSuite.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Varanasi", country: "India", latitude: 25.3176, longitude: 82.9739, timezoneOffsetHours: 5.5 };
  const birthDate = new Date("1995-10-15T06:30:00Z");
  const natalEphem = calculateVedicEphemeris(birthDate, location, "Lahiri", "WholeSign", "Mean");
  const transitEphem = calculateVedicEphemeris(new Date(), location, "Lahiri", "WholeSign", "Mean");

  // 1. Classical Ray (Kala) Values per Session 86
  assert.strictEqual(INDU_KALA_VALUES.Sun, 30);
  assert.strictEqual(INDU_KALA_VALUES.Moon, 16);
  assert.strictEqual(INDU_KALA_VALUES.Mars, 6);
  assert.strictEqual(INDU_KALA_VALUES.Mercury, 8);
  assert.strictEqual(INDU_KALA_VALUES.Jupiter, 10);
  assert.strictEqual(INDU_KALA_VALUES.Venus, 12);
  assert.strictEqual(INDU_KALA_VALUES.Saturn, 1);

  // 2. Indu Lagna Wealth Math
  const induRes = calculateInduLagna(natalEphem);
  assert.ok(induRes.induLagnaRashi);
  assert.ok(induRes.induLagnaRashi.englishName);
  assert.ok(induRes.totalKalas > 0);
  assert.ok(induRes.remainderKala >= 1 && induRes.remainderKala <= 12);
  assert.ok(induRes.induLagnaHouseFromD1 >= 1 && induRes.induLagnaHouseFromD1 <= 12);
  assert.ok(induRes.wealthVerdict.length > 20);
  assert.ok(induRes.wealthGrade.length > 5);

  // 3. 12-House & Planetary Age Activations
  const ageRes = calculatePlanetaryAgeActivations(natalEphem, new Date("2026-09-02T00:00:00Z"));
  assert.strictEqual(ageRes.currentAge, 30); // 1995 to 2026 is 30
  assert.ok(ageRes.activeHouse);
  assert.strictEqual(ageRes.activeHouse.houseNumber, 6); // Age 30 activates 6th House (6 + 2*12 = 30)
  assert.strictEqual(ageRes.allHouses.length, 12);
  assert.strictEqual(ageRes.planetaryAwakenings.length, 9);
  
  // Jupiter (16 & 32), Saturn (36) checks
  const jupAwakening = ageRes.planetaryAwakenings.find((p) => p.planet === "Jupiter");
  assert.ok(jupAwakening.status.includes("Activation") || jupAwakening.status.includes("Awakened"));

  // 4. Baadhak Dynamics & Transit Intersection
  const baadhakRes = evaluateBaadhakDynamics(natalEphem, transitEphem);
  assert.ok(baadhakRes.lagnaModality);
  assert.ok([7, 9, 11].includes(baadhakRes.baadhakHouseNumber));
  assert.ok(baadhakRes.baadhakRashi.englishName);
  assert.ok(baadhakRes.baadhakeshPlanet);
  assert.ok(baadhakRes.prescribedRemedy.length > 10);

  // 5. Bhagya Bindu
  const bhagyaRes = calculateBhagyaBindu(natalEphem);
  assert.ok(bhagyaRes.longitude >= 0 && bhagyaRes.longitude < 360);
  assert.ok(bhagyaRes.rashi.englishName);
  assert.ok(bhagyaRes.house >= 1 && bhagyaRes.house <= 12);
  assert.ok(bhagyaRes.nakshatra);
  assert.ok(bhagyaRes.nakshatraLord);

  // 6. Master Dossier Integration String
  const masterSummary = generateDrSamirTripathiSummary(natalEphem, transitEphem, new Date());
  assert.ok(masterSummary.includes("DR. SAMIR TRIPATHI VEDIC MASTER SUITE"));
  assert.ok(masterSummary.includes("INDU LAGNA (इन्दु लग्न) WEALTH FORMULA"));
  assert.ok(masterSummary.includes("BHRIGU HOUSE & PLANETARY AGE ACTIVATION MATRIX"));
  assert.ok(masterSummary.includes("BAADHAK STHANA & TRANSIT IMPEDIMENT DYNAMICS"));
  assert.ok(masterSummary.includes("BHAGYA BINDU"));
});

test("Classical Rashi Tulya Navamsha (RTN) & 64th Navamsha Cross-Varga Engine Verification", async () => {
  const { evaluateRashiTulyaNavamsha, generateRashiTulyaNavamshaSummary, getD9RashiIndex } = await import("../src/engine/rashiTulyaNavamsha.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };
  const birthDate = new Date("1999-09-17T13:02:00Z");
  const natalEphem = calculateVedicEphemeris(birthDate, location, "Lahiri", "WholeSign", "Mean");
  const transitEphem = calculateVedicEphemeris(new Date(), location, "Lahiri", "WholeSign", "Mean");

  // 1. D9 Index Math
  assert.strictEqual(getD9RashiIndex(0), 0); // Aries 0 -> Aries
  assert.strictEqual(getD9RashiIndex(30), 9); // Taurus 0 -> Capricorn
  assert.strictEqual(getD9RashiIndex(60), 6); // Gemini 0 -> Libra
  assert.strictEqual(getD9RashiIndex(90), 3); // Cancer 0 -> Cancer

  // 2. RTN Evaluation
  const rtn = evaluateRashiTulyaNavamsha(natalEphem, transitEphem);
  assert.strictEqual(rtn.d1LagnaRashi.englishName, "Pisces");
  assert.strictEqual(rtn.d9LagnaRashi.englishName, "Libra");

  // 3. Planetary RTN House Assignments
  const sun = rtn.planets.Sun;
  assert.ok(sun);
  assert.strictEqual(sun.d1HouseFromLagna, 7); // Sun in Virgo (7th)
  assert.strictEqual(sun.d9Rashi.englishName, "Capricorn"); // 1st Navamsha of Virgo is Capricorn
  assert.strictEqual(sun.rtnHouseFromD1Lagna, 11); // Capricorn is 11th from Pisces

  const mercury = rtn.planets.Mercury;
  assert.ok(mercury);
  assert.strictEqual(mercury.d1HouseFromLagna, 7); // Mercury in Virgo (7th)
  assert.strictEqual(mercury.d9Rashi.englishName, "Pisces");
  assert.strictEqual(mercury.rtnHouseFromD1Lagna, 1); // Pisces is 1st from Pisces

  const moon = rtn.planets.Moon;
  assert.ok(moon);
  assert.strictEqual(moon.d1HouseFromLagna, 9); // Moon in Scorpio (9th)
  assert.ok(moon.d9Rashi.englishName);
  assert.ok(moon.rtnHouseFromD1Lagna >= 1 && moon.rtnHouseFromD1Lagna <= 12);

  const mars = rtn.planets.Mars;
  assert.ok(mars);
  assert.strictEqual(mars.d1HouseFromLagna, 9); // Mars in Scorpio (9th)
  assert.ok(mars.d9Rashi.englishName);
  assert.ok(mars.rtnHouseFromD1Lagna >= 1 && mars.rtnHouseFromD1Lagna <= 12);

  // 4. 64th Navamsha
  assert.ok(rtn.kharaNavamsha.moon64thNavamshaRashi);
  assert.ok(rtn.kharaNavamsha.moon64thNavamshaRashi.englishName);
  assert.ok(rtn.kharaNavamsha.kharaWarningSummary);

  // 5. Dossier Synthesis
  const summary = generateRashiTulyaNavamshaSummary(natalEphem, transitEphem);
  assert.ok(summary.includes("RASHI TULYA NAVAMSHA (RTN)"));
  assert.ok(summary.includes("64TH NAVAMSHA"));
  assert.ok(summary.includes("RTN PREDICTIVE TRANSIT TRIGGERS"));
});

test("Dr. Samir Tripathi Daily Vedic Panchanga & Astro Guidance Engine Verification", async () => {
  const { calculateSamirTripathiPanchang } = await import("../src/engine/samirTripathiPanchang.ts");

  const location = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };
  const date = new Date("2026-09-02T06:00:00Z");

  const panchang = calculateSamirTripathiPanchang(date, location, "Lahiri");

  // 1. Core 5 Angas
  assert.ok(panchang.tithi);
  assert.ok(panchang.tithi.name);
  assert.ok(panchang.tithi.paksha);
  assert.ok(panchang.tithi.category);
  assert.ok(panchang.tithi.deity);
  assert.ok(panchang.tithi.endTimeFormatted);

  assert.ok(panchang.vara);
  assert.ok(panchang.vara.hindiName);
  assert.ok(panchang.vara.rulingPlanet);
  assert.ok(panchang.vara.auspiciousColors.length > 0);

  assert.ok(panchang.nakshatra);
  assert.ok(panchang.nakshatra.name);
  assert.ok(panchang.nakshatra.lord);
  assert.ok(panchang.nakshatra.gana);
  assert.ok(panchang.nakshatra.nature);

  assert.ok(panchang.yoga);
  assert.ok(panchang.yoga.name);
  assert.ok(panchang.yoga.nature);

  assert.ok(panchang.karana);
  assert.ok(panchang.karana.name);
  assert.ok(typeof panchang.karana.isBhadra === "boolean");

  // 2. Astrological Guidance
  assert.ok(panchang.dishaShool);
  assert.ok(panchang.dishaShool.prohibitedDirection);
  assert.ok(panchang.dishaShool.chandraVaas);
  assert.ok(panchang.exitRemedy.length > 10);
  assert.ok(panchang.dayMantra.length > 10);
  assert.ok(panchang.recommendedCharity.length > 5);

  // 3. Auspicious & Inauspicious Muhurtas
  assert.ok(panchang.auspiciousMuhurtas.length >= 3);
  assert.ok(panchang.inauspiciousMuhurtas.length >= 3);
  const rahuKaal = panchang.inauspiciousMuhurtas.find((m) => m.name === "Rahu Kaalam");
  assert.ok(rahuKaal);
  assert.ok(rahuKaal.startFormatted);

  // 4. Chandra Bala
  assert.strictEqual(panchang.chandraBalaList.length, 12);
  const ariesBala = panchang.chandraBalaList[0];
  assert.ok(ariesBala.strength);
  assert.ok(ariesBala.guidance);

  // 5. Shuddhi Score
  assert.ok(panchang.shuddhiScore >= 0 && panchang.shuddhiScore <= 100);
  assert.ok(panchang.panchangaSummary.length > 30);
});

test("27 Nakshatras Activation Years & Cosmic Awakening Engine Verification", async () => {
  const { evaluateNakshatraActivation, generateNakshatraActivationSummary, NAKSHATRA_ACTIVATION_TABLE } = await import("../src/engine/nakshatraActivation.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  // 1. Master Table Integrity
  assert.strictEqual(NAKSHATRA_ACTIVATION_TABLE.length, 27);
  const ashwini = NAKSHATRA_ACTIVATION_TABLE[0];
  assert.deepStrictEqual(ashwini.activationAges, [16, 24, 28]);
  assert.ok(ashwini.primaryThemes.length > 10);
  assert.ok(ashwini.materialManifestation.length > 10);

  // 2. Sample Chart: 17-09-1999 Allahabad (Native Age ~26-27)
  const location = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };
  const birthDate = new Date("1999-09-17T18:32:00+05:30");
  const evalDate = new Date("2026-09-02T12:00:00Z");
  const natalEphem = calculateVedicEphemeris(birthDate, location, "Lahiri");

  const res = evaluateNakshatraActivation(natalEphem, birthDate, evalDate);

  assert.strictEqual(res.completedAge, 26);
  assert.strictEqual(res.runningYear, 27);
  assert.ok(res.vitalPoints.length >= 4);

  // Check Janma Nakshatra
  const janmaPoint = res.vitalPoints.find((p) => p.pointType.includes("Janma"));
  assert.ok(janmaPoint);
  assert.ok(janmaPoint.nakshatraName);
  assert.ok(janmaPoint.activationAges.length > 0);
  assert.ok(janmaPoint.remedy.length > 10);

  // Check Lifetime Milestones
  assert.ok(res.lifetimeMilestones.length > 0);
  const m1 = res.lifetimeMilestones[0];
  assert.ok(m1.age > 0);
  assert.ok(m1.activeNakshatras.length > 0);

  // Check Dossier Summary
  const summary = generateNakshatraActivationSummary(natalEphem, birthDate, evalDate);
  assert.ok(summary.includes("NAKSHATRA ACTIVATION YEARS"));
  assert.ok(summary.includes("Native's Current Age"));
  assert.ok(summary.includes("Executive Nakshatra Synthesis"));
});

test("End-to-End Chatbot Response Quality Gates & Shastric Evaluation Verification", async () => {
  const { buildAstroDossier, detectConsultationIntent } = await import("../src/engine/chatContext.ts");
  const { calculateInduLagna, calculateBhagyaBindu } = await import("../src/engine/samirTripathiSuite.ts");
  const { calculateSamirTripathiPanchang } = await import("../src/engine/samirTripathiPanchang.ts");
  const { evaluateNakshatraActivation } = await import("../src/engine/nakshatraActivation.ts");
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");

  const location = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };
  const birthDate = new Date("1999-09-17T18:32:00+05:30");
  const evalDate = new Date("2026-09-02T12:00:00Z");

  const natalEphem = calculateVedicEphemeris(birthDate, location, "Lahiri");
  const transitEphem = calculateVedicEphemeris(evalDate, location, "Lahiri");

  // 1. Indu Lagna Gate
  const indu = calculateInduLagna(natalEphem);
  assert.strictEqual(indu.induLagnaRashi.englishName, "Leo");
  assert.strictEqual(indu.induLagnaHouseFromD1, 6);

  // 2. Bhagya Bindu Gate
  const bb = calculateBhagyaBindu(natalEphem);
  assert.ok(bb.rashi.englishName);
  assert.ok(bb.house > 0);

  // 3. Nakshatra Activation Gate
  const nakAct = evaluateNakshatraActivation(natalEphem, birthDate, evalDate);
  assert.strictEqual(nakAct.completedAge, 26);
  assert.strictEqual(nakAct.runningYear, 27);
  assert.ok(nakAct.masterRemedyRecommendation.length > 20);

  // 4. Daily Panchang Gate
  const panchang = calculateSamirTripathiPanchang(evalDate, location, "Lahiri");
  assert.ok(panchang.tithi.name);
  assert.ok(panchang.vara.hindiName);
  assert.ok(panchang.dishaShool.prohibitedDirection);
  assert.ok(panchang.exitRemedy);

  // 5. Intent Slicing & Quality Dossier Gate
  const careerDossier = buildAstroDossier(natalEphem, transitEphem, evalDate, "male", undefined, "career");
  assert.ok(careerDossier.includes("JOB VS BUSINESS"));
  assert.ok(careerDossier.includes("27 NAKSHATRA ACTIVATION YEARS"));
  assert.ok(careerDossier.includes("RASHI TULYA NAVAMSHA"));

  const marriageDossier = buildAstroDossier(natalEphem, transitEphem, evalDate, "male", undefined, "marriage");
  assert.ok(marriageDossier.includes("MASTER MULTI-VARGA MARRIAGE"));
  assert.ok(marriageDossier.includes("BHRIGU NANDI NADI"));
});

test("6-Point Multi-Divisional (D-1, D-3, D-4, D-9, D-10, D-24, D-60) BTR Verification", async () => {
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");
  const { calculateShodashavargaChart } = await import("../src/engine/shodashavarga.ts");

  const location = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };
  const birthDate = new Date("1999-09-17T18:32:00+05:30");

  const natalEphem = calculateVedicEphemeris(birthDate, location, "Lahiri");
  
  // D-1 Lagna check
  assert.strictEqual(natalEphem.ascendant.rashi.englishName, "Pisces");

  // D-3 Drekkana (Sibling Order)
  const d3Chart = calculateShodashavargaChart(natalEphem, "D3");
  assert.ok(d3Chart.entities.length > 0);

  // D-4 Chaturthamsha (Residence & Relocation)
  const d4Chart = calculateShodashavargaChart(natalEphem, "D4");
  assert.ok(d4Chart.entities.length > 0);

  // D-9 Navamsha (Soul Blueprint & Marriage)
  const d9Chart = calculateShodashavargaChart(natalEphem, "D9");
  assert.ok(d9Chart.entities.length > 0);

  // D-10 Dasamsa (Career Karma)
  const d10Chart = calculateShodashavargaChart(natalEphem, "D10");
  assert.ok(d10Chart.entities.length > 0);

  // D-24 Siddhamsa (Higher Learning & Skills)
  const d24Chart = calculateShodashavargaChart(natalEphem, "D24");
  assert.ok(d24Chart.entities.length > 0);

  // D-60 Shashtiamsha (Past-Life Karmic Clock)
  const d60Chart = calculateShodashavargaChart(natalEphem, "D60");
  assert.ok(d60Chart.entities.length > 0);
});

test("Anti-Sycophancy & Chhala Prashna Shastric Boundary Verification", async () => {
  const { calculateVedicEphemeris } = await import("../src/engine/ephemeris.ts");
  const fs = await import("fs");
  const path = await import("path");

  // 1. Verify route.ts contains Rule 0F (Anti-Sycophancy) and Rule 0G (Chhala Prashna)
  const routeContent = fs.readFileSync(path.join(process.cwd(), "src/app/api/astro-chat/route.ts"), "utf-8");
  assert.ok(routeContent.includes("ANTI-SYCOPHANCY & NON-RETROFITTING LAW"));
  assert.ok(routeContent.includes("CHHALA PRASHNA & PHYSICAL SURVEILLANCE BOUNDARY PROTOCOL"));
  assert.ok(routeContent.includes("Purushartha"));

  // 2. Verify AstroChatbot.tsx contains Rule 0F and Rule 0G
  const chatbotContent = fs.readFileSync(path.join(process.cwd(), "src/components/AstroChatbot.tsx"), "utf-8");
  assert.ok(chatbotContent.includes("ANTI-SYCOPHANCY & NON-RETROFITTING LAW"));
  assert.ok(chatbotContent.includes("CHHALA PRASHNA & PHYSICAL SURVEILLANCE BOUNDARY PROTOCOL"));

  // 3. Verify Local Civil Date Time Accuracy
  const location = { cityName: "Mau", country: "India", latitude: 25.9419, longitude: 83.5606, timezoneOffsetHours: 5.5 };
  const birthDate = new Date("1998-05-24T18:46:00Z"); // In UTC -> +5.5 hours = 1998-05-25 00:16 (12:16 AM)
  const natalEphem = calculateVedicEphemeris(birthDate, location, "Lahiri");

  const birthDateObj = new Date(natalEphem.utcDate);
  const tzOffset = natalEphem.location?.timezoneOffsetHours ?? 0;
  const localBirthDate = new Date(birthDateObj.getTime() + tzOffset * 3600 * 1000);

  const rawHours = localBirthDate.getUTCHours();
  const rawMinutes = String(localBirthDate.getUTCMinutes()).padStart(2, "0");
  const hour12 = rawHours % 12 || 12;
  const ampm = rawHours >= 12 ? "PM" : "AM";

  assert.strictEqual(hour12, 12);
  assert.strictEqual(rawMinutes, "16");
  assert.strictEqual(ampm, "AM");
  assert.strictEqual(localBirthDate.getUTCDate(), 25);
  assert.strictEqual(localBirthDate.getUTCMonth(), 4); // May (0-indexed)
});









































