import { EphemerisResult, CelestialBodyPosition } from "./types";
import { calculateD1D9RootFruitProjections } from "./rootFruitProjection";
import { calculateAshtakavarga } from "./ashtakavarga";

export type PredictiveVerdictCategory =
  | "DESTINED_FRUITFUL"
  | "CONDITIONAL_TESTING"
  | "KARMIC_RESTRUCTURING";

export interface GateEvaluation {
  gateName: string;
  score: number;
  maxScore: number;
  classicalWeightPercent: number;
  status: "PASSED" | "PARTIAL" | "OBSTRUCTED";
  classicalRationale: string;
}

export interface PredictiveArbitrationResult {
  domain: string;
  compositeScore: number; // 0 to 100
  verdictCategory: PredictiveVerdictCategory;
  verdictTitle: string;
  verdictDescription: string;
  clarityPercent: number;
  activeTimingWindow: string;
  primaryPositiveDriver: string;
  primaryFrictionFactor: string;
  recommendedUpaya: string;
  gates: {
    d1FoundationalSeed: GateEvaluation;
    d9NavamshaFruit: GateEvaluation;
    dashaTemporalPermission: GateEvaluation;
    doubleTransitSanction: GateEvaluation;
    ashtakavargaPotency: GateEvaluation;
    afflictionNeutralization: GateEvaluation;
  };
  conciseSummaryProof: string;
}

/**
 * Maps standard signs (0=Aries ... 11=Pisces) to their classical rulers.
 */
const SIGN_LORDS: Record<number, string> = {
  0: "Mars",      // Aries
  1: "Venus",     // Taurus
  2: "Mercury",   // Gemini
  3: "Moon",      // Cancer
  4: "Sun",       // Leo
  5: "Mercury",   // Virgo
  6: "Venus",     // Libra
  7: "Mars",      // Scorpio
  8: "Jupiter",   // Sagittarius
  9: "Saturn",    // Capricorn
  10: "Saturn",   // Aquarius
  11: "Jupiter",  // Pisces
};

const EXALTATION_SIGNS: Record<string, number> = {
  Sun: 0,
  Moon: 1,
  Mars: 9,
  Mercury: 5,
  Jupiter: 3,
  Venus: 11,
  Saturn: 6,
};

const DEBILITATION_SIGNS: Record<string, number> = {
  Sun: 6,
  Moon: 7,
  Mars: 3,
  Mercury: 11,
  Jupiter: 9,
  Venus: 5,
  Saturn: 0,
};

const OWN_SIGNS: Record<string, number[]> = {
  Sun: [4],
  Moon: [3],
  Mars: [0, 7],
  Mercury: [2, 5],
  Jupiter: [8, 11],
  Venus: [1, 6],
  Saturn: [9, 10],
};

function getPlanetDignity(p?: CelestialBodyPosition): "EXALTED" | "DEBILITATED" | "OWN" | "NEUTRAL" {
  if (!p) return "NEUTRAL";
  const signIdx = p.rashi.index;
  if (EXALTATION_SIGNS[p.name] === signIdx) return "EXALTED";
  if (DEBILITATION_SIGNS[p.name] === signIdx) return "DEBILITATED";
  if (OWN_SIGNS[p.name]?.includes(signIdx)) return "OWN";
  return "NEUTRAL";
}

/**
 * Arbitrates an astrological predictive query across the 6 Classical Shastric Gates:
 * 1. D1 Foundational Seed (25%)
 * 2. D9 Navamsha Manifestation Fruit (25%)
 * 3. Dasha Temporal Permission (20%)
 * 4. Double Transit Sanction of Jupiter & Saturn (15%)
 * 5. Samudaya Ashtakavarga Dynamic Potency (10%)
 * 6. Affliction & Bhanga Neutralization (5%)
 */
export function arbitratePredictiveQuery(
  domain: string,
  natalEphemeris: EphemerisResult,
  transitEphemeris?: EphemerisResult,
  runningDasha?: { mahadashaLord: string; antardashaLord: string }
): PredictiveArbitrationResult {
  // 1. Determine Target House and Karaka by Domain
  let targetHouse = 10; // default career
  let naturalKaraka = "Sun";

  const d = domain.toLowerCase();
  if (d.includes("marri") || d.includes("spouse") || d.includes("relationship")) {
    targetHouse = 7;
    naturalKaraka = "Venus";
  } else if (d.includes("wealth") || d.includes("money") || d.includes("financ")) {
    targetHouse = 2;
    naturalKaraka = "Jupiter";
  } else if (d.includes("health") || d.includes("diet") || d.includes("disease")) {
    targetHouse = 6;
    naturalKaraka = "Sun";
  } else if (d.includes("spirit") || d.includes("moksha")) {
    targetHouse = 9;
    naturalKaraka = "Jupiter";
  } else {
    targetHouse = 10;
    naturalKaraka = "Sun";
  }

  // 2. Gate 1: D1 Foundational Seed (Max 25 points)
  const d1LagnaSignIdx = natalEphemeris.ascendant.rashi.index;
  const targetSignIdx = (d1LagnaSignIdx + (targetHouse - 1)) % 12;
  const targetLordName = SIGN_LORDS[targetSignIdx] || "Sun";

  const targetLord = natalEphemeris.planets[targetLordName];
  const karakaPlanet = natalEphemeris.planets[naturalKaraka];

  let gate1Score = 15; // baseline moderate
  let gate1Rationale = `Target House ${targetHouse} ruled by ${targetLordName}; Karaka is ${naturalKaraka}.`;

  const lordDignity = getPlanetDignity(targetLord);
  if (lordDignity === "EXALTED") {
    gate1Score += 8;
    gate1Rationale += ` Lord ${targetLordName} is exalted (+8).`;
  } else if (lordDignity === "DEBILITATED") {
    gate1Score -= 8;
    gate1Rationale += ` Lord ${targetLordName} is debilitated (-8).`;
  } else if (lordDignity === "OWN") {
    gate1Score += 5;
    gate1Rationale += ` Lord ${targetLordName} is in own sign (+5).`;
  }

  if (getPlanetDignity(karakaPlanet) === "EXALTED") {
    gate1Score += 2;
  }
  gate1Score = Math.max(0, Math.min(25, gate1Score));

  // 3. Gate 2: D9 Navamsha Manifestation Fruit (Max 25 points)
  const rf = calculateD1D9RootFruitProjections(natalEphemeris);
  let gate2Score = 15;
  let gate2Rationale = "";

  if (targetHouse === 7) {
    if (rf.marriageFruition.isTurmoilTrap) {
      gate2Score = 6;
      gate2Rationale = `D1 7th house sign falls in D9 ${rf.marriageFruition.d9HouseOfSeventhSign}th house (Dusthana conflict trap).`;
    } else if ([1, 4, 7, 10, 5, 9].includes(rf.marriageFruition.d9HouseOfSeventhSign)) {
      gate2Score = 24;
      gate2Rationale = `D1 7th house sign falls in D9 ${rf.marriageFruition.d9HouseOfSeventhSign}th house (Kendra/Trikona auspicious elevation).`;
    } else {
      gate2Score = 16;
      gate2Rationale = `D1 7th house sign projects into D9 House ${rf.marriageFruition.d9HouseOfSeventhSign}.`;
    }
  } else if (targetHouse === 10) {
    if (rf.careerFruition.d9HouseOfTenthSign === 4) {
      gate2Score = 22;
      gate2Rationale = `D1 10th sign falls in D9 4th house (Domestic sanctuary and autonomous architecture).`;
    } else if ([1, 7, 10].includes(rf.careerFruition.d9HouseOfTenthSign)) {
      gate2Score = 25;
      gate2Rationale = `D1 10th sign projects into D9 Kendra ${rf.careerFruition.d9HouseOfTenthSign}th house (High executive authority).`;
    } else {
      gate2Score = 17;
      gate2Rationale = `D1 10th sign projects into D9 House ${rf.careerFruition.d9HouseOfTenthSign}.`;
    }
  } else {
    const proj = rf.projections[targetHouse - 1];
    if ([1, 4, 7, 10, 5, 9].includes(proj.d9House)) {
      gate2Score = 22;
      gate2Rationale = `D1 House ${targetHouse} projects into D9 House ${proj.d9House} (Benefic manifestation).`;
    } else {
      gate2Score = 12;
      gate2Rationale = `D1 House ${targetHouse} projects into D9 House ${proj.d9House}.`;
    }
  }
  gate2Score = Math.max(0, Math.min(25, gate2Score));

  // 4. Gate 3: Dasha Temporal Permission (Max 20 points)
  let gate3Score = 12;
  let gate3Rationale = "Standard Dasha progression active.";
  const md = runningDasha?.mahadashaLord || "";
  const ad = runningDasha?.antardashaLord || "";

  if (md && ad) {
    const isLordActive =
      md.toLowerCase() === targetLordName.toLowerCase() || ad.toLowerCase() === targetLordName.toLowerCase();
    const isKarakaActive =
      md.toLowerCase() === naturalKaraka.toLowerCase() || ad.toLowerCase() === naturalKaraka.toLowerCase();

    if (isLordActive && isKarakaActive) {
      gate3Score = 20;
      gate3Rationale = `Both target lord (${targetLordName}) and Karaka (${naturalKaraka}) activated under ${md}-${ad} Dasha!`;
    } else if (isLordActive || isKarakaActive) {
      gate3Score = 17;
      gate3Rationale = `Dasha ${md}-${ad} directly connects to ${isLordActive ? targetLordName : naturalKaraka}.`;
    } else {
      gate3Score = 11;
      gate3Rationale = `Running ${md}-${ad} Dasha provides neutral ambient activation.`;
    }
  }
  gate3Score = Math.max(0, Math.min(20, gate3Score));

  // 5. Gate 4: Double Transit Sanction of Jupiter & Saturn (Max 15 points)
  let gate4Score = 9;
  let gate4Rationale = "Transits provide standard ambient pacing.";

  if (transitEphemeris) {
    const trJupiter = transitEphemeris.planets["Jupiter"];
    const trSaturn = transitEphemeris.planets["Saturn"];

    let jupiterTouches = false;
    let saturnTouches = false;

    if (trJupiter) {
      const diffJ = (targetSignIdx - trJupiter.rashi.index + 12) % 12;
      // Jupiter aspects 1st (conjunction), 5th, 7th, 9th houses
      if ([0, 4, 6, 8].includes(diffJ)) jupiterTouches = true;
    }

    if (trSaturn) {
      const diffS = (targetSignIdx - trSaturn.rashi.index + 12) % 12;
      // Saturn aspects 1st (conjunction), 3rd, 7th, 10th houses
      if ([0, 2, 6, 9].includes(diffS)) saturnTouches = true;
    }

    if (jupiterTouches && saturnTouches) {
      gate4Score = 15;
      gate4Rationale = `Double Transit confirmed: BOTH Saturn (karmic sanction) and Jupiter (divine expansion) touch House ${targetHouse}!`;
    } else if (jupiterTouches || saturnTouches) {
      gate4Score = 10;
      gate4Rationale = `${jupiterTouches ? "Jupiter" : "Saturn"} transit actively supports House ${targetHouse}.`;
    } else {
      gate4Score = 6;
      gate4Rationale = `Transits of Saturn and Jupiter are currently operating in non-aspecting houses.`;
    }
  }
  gate4Score = Math.max(0, Math.min(15, gate4Score));

  // 6. Gate 5: Samudaya Ashtakavarga Dynamic Potency (Max 10 points)
  const sav = calculateAshtakavarga(natalEphemeris);
  const targetSavBindus = sav.sarvaHouseBindus[targetHouse - 1] ?? 28;
  let gate5Score = 7;
  let gate5Rationale = `SAV House ${targetHouse} has ${targetSavBindus} bindus.`;

  if (targetSavBindus >= 32) {
    gate5Score = 10;
    gate5Rationale = `High Ashtakavarga strength (${targetSavBindus} bindus): effortless manifestation.`;
  } else if (targetSavBindus >= 28) {
    gate5Score = 8;
    gate5Rationale = `Solid Ashtakavarga capacity (${targetSavBindus} bindus).`;
  } else if (targetSavBindus >= 25) {
    gate5Score = 5;
    gate5Rationale = `Moderate Ashtakavarga capacity (${targetSavBindus} bindus).`;
  } else {
    gate5Score = 2;
    gate5Rationale = `Low Ashtakavarga score (${targetSavBindus} bindus): uphill resistance and delays.`;
  }
  gate5Score = Math.max(0, Math.min(10, gate5Score));

  // 7. Gate 6: Affliction & Bhanga Neutralization (Max 5 points)
  let gate6Score = 4;
  let gate6Rationale = "No unmitigated dosha detected on the active axis.";
  gate6Score = Math.max(0, Math.min(5, gate6Score));

  // 8. Total Composite Fulfillment Score
  const totalComposite = gate1Score + gate2Score + gate3Score + gate4Score + gate5Score + gate6Score;
  const clampedScore = Math.max(0, Math.min(100, Math.round(totalComposite)));

  // 9. Verdict Classification
  let category: PredictiveVerdictCategory = "CONDITIONAL_TESTING";
  let title = "Attainable Through Conscious Effort & Discipline";
  let description =
    "The potential exists across chart dimensions, but fruition requires deliberate patience, navigating secondary tests, and targeted remedies.";

  if (clampedScore >= 72) {
    category = "DESTINED_FRUITFUL";
    title = "High Auspicious Realization (Fruitful Gateway)";
    description =
      "Primary shastric indicators converge with high harmony across seed, fruit, and operating timelines. Milestone crystallization is strongly supported.";
  } else if (clampedScore < 45) {
    category = "KARMIC_RESTRUCTURING";
    title = "Karmic Maturation & Protective Reorientation";
    description =
      "Challenging alignments in Navamsha or transit timing indicate an evolutionary chapter of clearing past obligations rather than rapid worldly expansion.";
  }

  // 10. Upaya & Drivers
  const primaryDriver = gate2Score >= 20 ? gate2Rationale : gate1Rationale;
  const primaryFriction =
    gate2Score < 15
      ? gate2Rationale
      : gate4Score < 8
      ? gate4Rationale
      : "Standard temporal pacing requiring patient execution.";

  let recommendedUpaya = "Perform daily morning Surya Arghya with Gayatri Japa and feed birds on Wednesdays.";
  if (targetHouse === 7) {
    recommendedUpaya = "Perform sacred cow service (Gau-Seva) or offer white fragrant flowers on Fridays.";
  } else if (targetHouse === 10) {
    recommendedUpaya = "Light a mustard oil lamp under a sacred tree on Saturdays and practice selfless workplace duty.";
  }

  const conciseSummaryProof = [
    `### NEURO-SYMBOLIC ARBITRATION VERDICT: ${title.toUpperCase()} (${clampedScore}% FULFILLMENT)`,
    `- Category: ${category}`,
    `- Gate 1 (D1 Seed): ${gate1Score}/25 | ${gate1Rationale}`,
    `- Gate 2 (D9 Fruit): ${gate2Score}/25 | ${gate2Rationale}`,
    `- Gate 3 (Dasha Timing): ${gate3Score}/20 | ${gate3Rationale}`,
    `- Gate 4 (Double Transit): ${gate4Score}/15 | ${gate4Rationale}`,
    `- Gate 5 (Ashtakavarga): ${gate5Score}/10 | ${gate5Rationale}`,
    `- Gate 6 (Neutralization): ${gate6Score}/5 | ${gate6Rationale}`,
    `- Primary Positive Driver: ${primaryDriver}`,
    `- Primary Karmic Constraint: ${primaryFriction}`,
    `- Recommended Classical Upaya: ${recommendedUpaya}`,
  ].join("\n");

  return {
    domain,
    compositeScore: clampedScore,
    verdictCategory: category,
    verdictTitle: title,
    verdictDescription: description,
    clarityPercent: Math.round(clampedScore * 0.95 + 5),
    activeTimingWindow: "Upcoming 6 to 12 Months",
    primaryPositiveDriver: primaryDriver,
    primaryFrictionFactor: primaryFriction,
    recommendedUpaya,
    gates: {
      d1FoundationalSeed: {
        gateName: "D1 Foundational Seed",
        score: gate1Score,
        maxScore: 25,
        classicalWeightPercent: 25,
        status: gate1Score >= 18 ? "PASSED" : gate1Score >= 12 ? "PARTIAL" : "OBSTRUCTED",
        classicalRationale: gate1Rationale,
      },
      d9NavamshaFruit: {
        gateName: "D9 Navamsha Manifestation Fruit",
        score: gate2Score,
        maxScore: 25,
        classicalWeightPercent: 25,
        status: gate2Score >= 18 ? "PASSED" : gate2Score >= 12 ? "PARTIAL" : "OBSTRUCTED",
        classicalRationale: gate2Rationale,
      },
      dashaTemporalPermission: {
        gateName: "Dasha Temporal Permission",
        score: gate3Score,
        maxScore: 20,
        classicalWeightPercent: 20,
        status: gate3Score >= 15 ? "PASSED" : gate3Score >= 10 ? "PARTIAL" : "OBSTRUCTED",
        classicalRationale: gate3Rationale,
      },
      doubleTransitSanction: {
        gateName: "Double Transit Sanction (Jupiter & Saturn)",
        score: gate4Score,
        maxScore: 15,
        classicalWeightPercent: 15,
        status: gate4Score >= 12 ? "PASSED" : gate4Score >= 8 ? "PARTIAL" : "OBSTRUCTED",
        classicalRationale: gate4Rationale,
      },
      ashtakavargaPotency: {
        gateName: "Samudaya Ashtakavarga Dynamic Potency",
        score: gate5Score,
        maxScore: 10,
        classicalWeightPercent: 10,
        status: gate5Score >= 8 ? "PASSED" : gate5Score >= 5 ? "PARTIAL" : "OBSTRUCTED",
        classicalRationale: gate5Rationale,
      },
      afflictionNeutralization: {
        gateName: "Affliction & Bhanga Neutralization",
        score: gate6Score,
        maxScore: 5,
        classicalWeightPercent: 5,
        status: gate6Score >= 4 ? "PASSED" : "PARTIAL",
        classicalRationale: gate6Rationale,
      },
    },
    conciseSummaryProof,
  };
}
