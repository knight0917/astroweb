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

