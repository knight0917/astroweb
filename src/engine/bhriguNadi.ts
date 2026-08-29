/**
 * Classical Bhrigu Nandi Nadi (BNN) & Bhrigu Saral Paddhati (BSP) Engine
 * Reference:
 * 1. Essence of Nadi Astrology & Bhrigu Nandi Nadi (Sri R.G. Rao)
 * 2. Bhrigu Saral Paddhati (BSP) Rules (Saptarishis Astrology Research)
 */

import { EphemerisResult } from "./types";

export type NadiDirection = "East (Agni)" | "South (Prithvi)" | "West (Vayu)" | "North (Jala)";

export interface NadiDirectionCluster {
  direction: NadiDirection;
  element: "Agni" | "Prithvi" | "Vayu" | "Jala";
  signs: string[];
  planets: string[];
  signIndices: number[];
  description: string;
}

export interface BnnKarakaLinkage {
  karakaName: string;
  sanskritRole: string;
  representedPlanet: string;
  occupiedSign: string;
  occupiedHouse: number;
  directionalCompanions: string[]; // Planets in 1, 5, 9 from this planet
  secondHousePlanets: string[]; // Planets in 2nd (Front / Food)
  twelfthHousePlanets: string[]; // Planets in 12th (Rear / Past baggage)
  seventhHousePlanets: string[]; // Planets in 7th (Opposite / Aspect)
  synthesisVerdict: string;
}

export interface BspAgeActivation {
  ageYear: number;
  isCurrentRunningYear: boolean;
  cycleHouseNumber: number; // 12-year wheel
  cycleHouseTheme: string;
  specificBspTriggers: {
    ruleName: string;
    triggerDescription: string;
    activatedHouse: number;
    activatedPlanet: string;
    karmicOutcome: string;
  }[];
}

export interface BhriguNadiReport {
  runningAge: number;
  directionalClusters: Record<string, NadiDirectionCluster>;
  jivaProfile: BnnKarakaLinkage; // Jupiter
  karmaProfile: BnnKarakaLinkage; // Saturn
  kalatraProfile: BnnKarakaLinkage; // Venus
  activeBspActivations: BspAgeActivation[];
  currentYearBsp: BspAgeActivation;
}

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const DIRECTION_MAP: Record<number, { dir: NadiDirection; element: "Agni" | "Prithvi" | "Vayu" | "Jala" }> = {
  0: { dir: "East (Agni)", element: "Agni" }, // Aries
  4: { dir: "East (Agni)", element: "Agni" }, // Leo
  8: { dir: "East (Agni)", element: "Agni" }, // Sagittarius

  1: { dir: "South (Prithvi)", element: "Prithvi" }, // Taurus
  5: { dir: "South (Prithvi)", element: "Prithvi" }, // Virgo
  9: { dir: "South (Prithvi)", element: "Prithvi" }, // Capricorn

  2: { dir: "West (Vayu)", element: "Vayu" }, // Gemini
  6: { dir: "West (Vayu)", element: "Vayu" }, // Libra
  10: { dir: "West (Vayu)", element: "Vayu" }, // Aquarius

  3: { dir: "North (Jala)", element: "Jala" }, // Cancer
  7: { dir: "North (Jala)", element: "Jala" }, // Scorpio
  11: { dir: "North (Jala)", element: "Jala" }, // Pisces
};

const HOUSE_DOMAINS: Record<number, string> = {
  1: "Physical body, vitality, self-identity, emergence",
  2: "Liquid wealth, family accumulation, speech, nutrition",
  3: "Initiative, courage, siblings, skills, short journeys",
  4: "Domestic foundation, mother, real estate, vehicles, peace",
  5: "Creative intellect, progeny, speculation, past merit (Purva Punya)",
  6: "Overcoming rivals, debts, health discipline, daily routine",
  7: "Partnerships, spouse, public contracts, open relations",
  8: "Sudden transformations, deep research, occult, windfalls",
  9: "Higher wisdom, father, Guru, spiritual philosophy, fortune",
  10: "Career pinnacle, leadership, public authority, execution",
  11: "Realization of ambitions, network gains, cashflow expansion",
  12: "Spiritual liberation, expenditures, foreign relocation, isolation",
};

// Classical R.G. Rao Saturn (Karma) Synthesis
function getSaturnKarmaSynthesis(directionalCompanions: string[], secondPlanets: string[]): string {
  const allPartners = [...new Set([...directionalCompanions, ...secondPlanets])];
  
  if (allPartners.includes("Jupiter")) {
    return "Saturn + Jupiter (Dharma-Karmadhipati / Guru-Shani Yoga): Endows supreme managerial authority, honorable status, advisory/consultancy roles, and high ethical standing.";
  }
  if (allPartners.includes("Mercury")) {
    return "Saturn + Mercury (Vanijya Yoga): Natural inclination toward commerce, accountancy, technology, publishing, intellectual enterprise, and business management.";
  }
  if (allPartners.includes("Venus")) {
    return "Saturn + Venus (Bhoga-Karma Yoga): Financial management, luxury goods, design/architecture, banking, artistic enterprise, and prosperous professional stability.";
  }
  if (allPartners.includes("Mars")) {
    return "Saturn + Mars (Bhratri-Shani Sangama): Technical engineering, machinery, real estate, industrial execution, surgery, or executive command requiring energetic drive.";
  }
  if (allPartners.includes("Sun")) {
    return "Saturn + Sun (Raja-Karma Yoga): Government connections, administrative authority, public leadership, or carrying forward ancestral/fatherly legacy.";
  }
  if (allPartners.includes("Rahu")) {
    return "Saturn + Rahu (Maya-Karma Yoga): Foreign technologies, unconventional or cutting-edge industries, electronics, mass media, and sudden unconventional career leaps.";
  }
  if (allPartners.includes("Ketu")) {
    return "Saturn + Ketu (Mukti-Karma Yoga): Research, software coding, legal consultancy, spiritual philosophy, medicine/healing, with a detachment from corporate politics.";
  }
  if (allPartners.includes("Moon")) {
    return "Saturn + Moon (Jala-Pravasi Yoga): Frequent travels, public relations, food/hospitality, liquid products, and dynamic shifts in workplace environment.";
  }

  return "Independent professional trajectory driven by Saturn's discipline, requiring steady self-mastery and persevering execution.";
}

export function evaluateBhriguNadi(
  ephemeris: EphemerisResult,
  evaluationDate: Date = new Date()
): BhriguNadiReport {
  const birthDate = new Date(ephemeris.utcDate);
  const diffTime = Math.abs(evaluationDate.getTime() - birthDate.getTime());
  const ageYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  const runningAge = Math.floor(ageYears) + 1;

  const planets = ephemeris.planets;
  const physicalPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  const getSign = (pName: string): number => {
    return Math.floor(((planets as any)[pName]?.siderealLongitude || 0) / 30);
  };
  const getHouse = (pName: string): number => {
    return (planets as any)[pName]?.house || 1;
  };

  // 1. Group planets into 4 Directional Clusters
  const clusters: Record<string, NadiDirectionCluster> = {
    East: { direction: "East (Agni)", element: "Agni", signs: ["Aries", "Leo", "Sagittarius"], signIndices: [0, 4, 8], planets: [], description: "Fire trine — Spirit, vitality, soul authority, self-drive." },
    South: { direction: "South (Prithvi)", element: "Prithvi", signs: ["Taurus", "Virgo", "Capricorn"], signIndices: [1, 5, 9], planets: [], description: "Earth trine — Material assets, professional stability, liquid wealth." },
    West: { direction: "West (Vayu)", element: "Vayu", signs: ["Gemini", "Libra", "Aquarius"], signIndices: [2, 6, 10], planets: [], description: "Air trine — Intellect, communication, trade, social networking." },
    North: { direction: "North (Jala)", element: "Jala", signs: ["Cancer", "Scorpio", "Pisces"], signIndices: [3, 7, 11], planets: [], description: "Water trine — Intuition, emotions, subconscious changes, Moksha." },
  };

  physicalPlanets.forEach((pName) => {
    const s = getSign(pName);
    const dirInfo = DIRECTION_MAP[s];
    if (dirInfo.dir.startsWith("East")) clusters.East.planets.push(pName);
    else if (dirInfo.dir.startsWith("South")) clusters.South.planets.push(pName);
    else if (dirInfo.dir.startsWith("West")) clusters.West.planets.push(pName);
    else if (dirInfo.dir.startsWith("North")) clusters.North.planets.push(pName);
  });

  // Helper to extract 1-2-12-7 connections for a Karaka
  const buildKarakaLinkage = (karakaName: string, sanskritRole: string, pName: string): BnnKarakaLinkage => {
    const s = getSign(pName);
    const h = getHouse(pName);
    const signName = SIGN_NAMES[s];

    // Trines (1, 5, 9 from pName)
    const trineSigns = [s, (s + 4) % 12, (s + 8) % 12];
    const secondSign = (s + 1) % 12;
    const twelfthSign = (s + 11) % 12;
    const seventhSign = (s + 6) % 12;

    const dirCompanions: string[] = [];
    const secPlanets: string[] = [];
    const twelPlanets: string[] = [];
    const sevPlanets: string[] = [];

    physicalPlanets.forEach((other) => {
      if (other === pName) return;
      const otherSign = getSign(other);
      if (trineSigns.includes(otherSign)) dirCompanions.push(other);
      if (otherSign === secondSign) secPlanets.push(other);
      if (otherSign === twelfthSign) twelPlanets.push(other);
      if (otherSign === seventhSign) sevPlanets.push(other);
    });

    let verdict = "";
    if (pName === "Saturn") {
      verdict = getSaturnKarmaSynthesis(dirCompanions, secPlanets);
    } else if (pName === "Jupiter") {
      verdict = "Jupiter (Jiva) in " + signName + " aligns with [" + (dirCompanions.length ? dirCompanions.join(", ") : "Independent") + "] in its directional trine, with [" + (secPlanets.length ? secPlanets.join(", ") : "Open space") + "] in the 2nd house of forward momentum.";
    } else if (pName === "Venus") {
      verdict = "Venus (Bhoga/Kalatra) in " + signName + " receives support from [" + (dirCompanions.length ? dirCompanions.join(", ") : "Independent") + "] for financial stability and relationship harmony.";
    } else {
      verdict = pName + " in " + signName + " expresses core energy through directional trines and adjacent houses.";
    }

    return {
      karakaName,
      sanskritRole,
      representedPlanet: pName,
      occupiedSign: signName,
      occupiedHouse: h,
      directionalCompanions: dirCompanions,
      secondHousePlanets: secPlanets,
      twelfthHousePlanets: twelPlanets,
      seventhHousePlanets: sevPlanets,
      synthesisVerdict: verdict,
    };
  };

  const jivaProfile = buildKarakaLinkage("Jiva Karaka (Self & Soul)", "जीव कारक", "Jupiter");
  const karmaProfile = buildKarakaLinkage("Karma Karaka (Profession & Livelihood)", "कर्म कारक", "Saturn");
  const kalatraProfile = buildKarakaLinkage("Kalatra & Bhoga Karaka (Wealth & Partner)", "कलत्र एवं भोग कारक", "Venus");

  // 3. Bhrigu Saral Paddhati (BSP) Age Timeline Generator
  const SPECIFIC_BSP_RULES: Record<number, { rule: string; planet: string; relHouse: number; outcome: string }[]> = {
    10: [{ rule: "BSP 10", planet: "Sun", relHouse: 6, outcome: "6th House from Sun activates: Health discipline, overcoming competitors, father's enterprise adjustments." }],
    18: [{ rule: "BSP 18", planet: "Moon", relHouse: 1, outcome: "1st House from Moon activates: Emotional awakening, identity clarity, artistic/imaginative ventures." }],
    20: [{ rule: "BSP 13 / 20", planet: "Saturn", relHouse: 3, outcome: "3rd House from Saturn activates: Skill mastery, practical efforts, foundation of vocational career." }],
    21: [{ rule: "BSP 21", planet: "Saturn", relHouse: 4, outcome: "4th House from Saturn activates: Educational milestone, domestic shift, foundational assets." }],
    22: [
      { rule: "BSP 22a", planet: "Jupiter", relHouse: 9, outcome: "9th House from Jupiter activates: Higher philosophical wisdom, Guru alignment, distant travel." },
      { rule: "BSP 22b", planet: "Rahu", relHouse: 5, outcome: "5th House from Rahu activates: Creative breakthroughs, unconventional intellectual expansion." },
    ],
    24: [
      { rule: "BSP 24a", planet: "Ketu", relHouse: 12, outcome: "12th House from Ketu activates: Spiritual detachment, foreign connections, expenditure redirection." },
      { rule: "BSP 24b", planet: "Saturn", relHouse: 4, outcome: "4th House from Saturn activates: Stabilization of core domestic foundation." },
      { rule: "BSP 24c", planet: "Mercury", relHouse: 10, outcome: "10th House from Mercury activates: Commercial recognition, career initiative, intellectual output." },
    ],
    25: [{ rule: "BSP 25", planet: "Sun", relHouse: 1, outcome: "1st House from Sun activates: Status emergence, self-confidence, personal authority rise." }],
    27: [{ rule: "BSP 27", planet: "Mars", relHouse: 10, outcome: "10th House from Mars activates: Ambitious professional drive, competitive achievement." }],
    28: [
      { rule: "BSP 22 / 28", planet: "Saturn", relHouse: 6, outcome: "6th House from Saturn activates: Triumph over systemic bottlenecks, debt resolution." },
      { rule: "BSP 28b", planet: "Mercury", relHouse: 5, outcome: "5th House from Mercury activates: Intellectual mastery, strategic commercial success." },
    ],
    30: [{ rule: "BSP 30", planet: "Rahu", relHouse: 1, outcome: "1st House from Rahu activates: Major illusion breakthrough, sudden unconventional elevation." }],
    32: [
      { rule: "BSP 32a", planet: "Jupiter", relHouse: 5, outcome: "5th House from Jupiter activates: Supreme Purva Punya fruition, creative intellect expansion." },
      { rule: "BSP 32b", planet: "Saturn", relHouse: 10, outcome: "10th House from Saturn activates: Major professional pivot and vocational authority." },
      { rule: "BSP 32c", planet: "Mars", relHouse: 4, outcome: "4th House from Mars activates: Property acquisition, bold domestic transformation." },
    ],
    35: [{ rule: "BSP 35", planet: "Jupiter", relHouse: 1, outcome: "1st House from Jupiter activates: Jiva expansion, societal honour, prosperity rise." }],
    36: [{ rule: "BSP 36", planet: "Mars", relHouse: 8, outcome: "8th House from Mars activates: Transformative breakthrough, overcoming hidden obstacles." }],
    37: [
      { rule: "BSP 37a", planet: "Rahu", relHouse: 9, outcome: "9th House from Rahu activates: Unconventional fortune, foreign travels/mentors." },
      { rule: "BSP 37b", planet: "Jupiter", relHouse: 1, outcome: "1st House from Jupiter activates: High spiritual grace, leadership authority." },
    ],
    38: [{ rule: "BSP 38", planet: "Rahu", relHouse: 6, outcome: "6th House from Rahu activates: Complete victory over competitors and complex challenges." }],
    40: [
      { rule: "BSP 40a", planet: "Jupiter", relHouse: 9, outcome: "9th House from Jupiter activates: Peak Dharma, mentorship, philanthropy, divine blessings." },
      { rule: "BSP 40b", planet: "Mercury", relHouse: 7, outcome: "7th House from Mercury activates: Commercial partnerships, high-value trade contracts." },
    ],
    48: [{ rule: "BSP 48", planet: "Saturn", relHouse: 4, outcome: "4th House from Saturn activates: Consolidation of lifelong assets and security." }],
    51: [{ rule: "BSP 51", planet: "Saturn", relHouse: 1, outcome: "1st House from Saturn activates: Master elder authority, legacy execution, enduring duty." }],
  };

  const activeBspList: BspAgeActivation[] = [];
  
  // Render range around running age (+/- 4 years)
  for (let a = Math.max(1, runningAge - 4); a <= runningAge + 6; a++) {
    const cycleHouse = ((a - 1) % 12) + 1;
    const isCurrent = a === runningAge;
    const triggers = (SPECIFIC_BSP_RULES[a] || []).map((t) => {
      const pSign = getSign(t.planet);
      const actHouse = ((getHouse(t.planet) + t.relHouse - 2) % 12) + 1;
      return {
        ruleName: t.rule,
        triggerDescription: t.outcome,
        activatedHouse: actHouse,
        activatedPlanet: t.planet,
        karmicOutcome: t.outcome,
      };
    });

    activeBspList.push({
      ageYear: a,
      isCurrentRunningYear: isCurrent,
      cycleHouseNumber: cycleHouse,
      cycleHouseTheme: HOUSE_DOMAINS[cycleHouse] || "General unfolding",
      specificBspTriggers: triggers,
    });
  }

  const currentYearBsp = activeBspList.find((b) => b.isCurrentRunningYear) || activeBspList[0];

  return {
    runningAge,
    directionalClusters: clusters,
    jivaProfile,
    karmaProfile,
    kalatraProfile,
    activeBspActivations: activeBspList,
    currentYearBsp,
  };
}

/**
 * R.G. Rao's Bhrigu Prashna Nadi (भृगु प्रश्न नाड़ी)
 * Instant Horary Directional Oracle
 */
export function evaluateBhriguPrashna(
  ephemeris: EphemerisResult,
  queryDomain: "Career" | "Finance" | "Marriage" | "Health" | "Travel" | "Property" = "Career"
): import("./types").BhriguPrashnaAnalysis {
  const planets = ephemeris.planets;
  const ascSignIdx = Math.floor(ephemeris.ascendant.siderealLongitude / 30);

  const domainKarakaMap: Record<string, { karaka: string; targetDirIndex: number }> = {
    Career: { karaka: "Saturn", targetDirIndex: 1 }, // South / Artha
    Finance: { karaka: "Venus", targetDirIndex: 1 }, // South / Artha
    Marriage: { karaka: "Venus", targetDirIndex: 2 }, // West / Kama
    Health: { karaka: "Jupiter", targetDirIndex: 0 }, // East / Dharma
    Travel: { karaka: "Moon", targetDirIndex: 3 }, // North / Moksha
    Property: { karaka: "Mars", targetDirIndex: 1 }, // South / Artha
  };

  const config = domainKarakaMap[queryDomain] || domainKarakaMap.Career;
  const karakaObj = planets[config.karaka];
  const karakaSignIdx = karakaObj ? Math.floor(karakaObj.siderealLongitude / 30) : 0;
  const karakaDir = DIRECTION_MAP[karakaSignIdx]?.dir || "East (Agni)";

  // Find planets sharing the same directional trines (1, 5, 9 from karaka)
  const dirCompanions = Object.entries(planets)
    .filter(([name, p]) => {
      if (name === config.karaka || p.isModernPlanet || p.isUpagraha) return false;
      const pSign = Math.floor(p.siderealLongitude / 30);
      return pSign % 4 === karakaSignIdx % 4;
    })
    .map(([name]) => name);

  let score = 50;
  if (dirCompanions.includes("Jupiter") || dirCompanions.includes("Venus")) score += 25;
  if (dirCompanions.includes("Mercury") || dirCompanions.includes("Sun")) score += 15;
  if (dirCompanions.includes("Rahu") || dirCompanions.includes("Saturn")) score -= 15;

  score = Math.max(20, Math.min(95, score));

  const outcome: import("./types").BhriguPrashnaAnalysis["outcome"] =
    score >= 70
      ? "Immediate Success (शीघ्र कार्य सिद्धि)"
      : score >= 50
      ? "Moderate / Effort Required (प्रयत्न साध्य)"
      : "Obstruction (विघ्न / अवरोध)";

  const bhriguPrashnaVerdict = `Bhrigu Prashna Nadi: Primary Karaka ${config.karaka} posited in ${karakaDir} accompanied by trinal Grahas: [${dirCompanions.join(", ") || "None"}]. Oracle confirms ${outcome.split(" (")[0]} for ${queryDomain} query.`;

  return {
    queryKaraka: config.karaka,
    queryDomain,
    directionalDisposition: `${karakaDir} Trinal Axis`,
    outcome,
    probabilityScore: score,
    bhriguPrashnaVerdict,
  };
}

/**
 * Essence of Nadi Astrology: 12-Year Jupiter (Jeeva) Age Progression Cycles
 */
export function calculateNadiAgeProgressions(ephemeris: EphemerisResult): import("./types").NadiAgeProgressionCycle[] {
  const jupObj = ephemeris.planets.Jupiter;
  const jupSignIdx = jupObj ? Math.floor(jupObj.siderealLongitude / 30) : 0;

  const cycles: import("./types").NadiAgeProgressionCycle[] = [
    {
      cycleRound: 1,
      ageRange: "Ages 1 - 12 (Infancy & Education)",
      progressedSign: SIGN_NAMES[jupSignIdx],
      activatedHouses: [1, 5, 9],
      lifeFocus: "Physical growth, primary schooling, parental nurture, foundational Sanskaras.",
      keyMilestones: "Immunity building, language acquisition, and foundational learning.",
    },
    {
      cycleRound: 2,
      ageRange: "Ages 13 - 24 (Higher Learning & Skills)",
      progressedSign: SIGN_NAMES[(jupSignIdx + 1) % 12],
      activatedHouses: [2, 6, 10],
      lifeFocus: "Higher education, career skill acquisition, competitive exams, initial financial self-reliance.",
      keyMilestones: "Graduation, first job / venture, and emergence of independent identity.",
    },
    {
      cycleRound: 3,
      ageRange: "Ages 25 - 36 (Career & Conjugal Union)",
      progressedSign: SIGN_NAMES[(jupSignIdx + 2) % 12],
      activatedHouses: [3, 7, 11],
      lifeFocus: "Matrimony, establishment of family lineage, major career promotions, asset creation.",
      keyMilestones: "Marriage, childbirth, real estate purchase, and professional expansion.",
    },
    {
      cycleRound: 4,
      ageRange: "Ages 37 - 48 (Executive Pinnacle & Status)",
      progressedSign: SIGN_NAMES[(jupSignIdx + 3) % 12],
      activatedHouses: [4, 8, 12],
      lifeFocus: "Peak professional leadership, societal prestige, wealth accumulation, spiritual introspection.",
      keyMilestones: "Executive authority, major business breakthroughs, and mentorship roles.",
    },
    {
      cycleRound: 5,
      ageRange: "Ages 49 - 60 (Legacy Consolidation & Dharma)",
      progressedSign: SIGN_NAMES[(jupSignIdx + 4) % 12],
      activatedHouses: [1, 5, 9],
      lifeFocus: "Children's settlement, philanthropic investments, religious pilgrimages, legacy handoff.",
      keyMilestones: "Grandchildren, senior societal honors, and spiritual renunciation.",
    },
    {
      cycleRound: 6,
      ageRange: "Ages 61 - 72+ (Moksha & Spiritual Enlightenment)",
      progressedSign: SIGN_NAMES[(jupSignIdx + 5) % 12],
      activatedHouses: [2, 6, 10],
      lifeFocus: "Self-realization, dispassionate wisdom, sharing ancestral knowledge, liberation.",
      keyMilestones: "Spiritual mastery, peace of mind, and harmonious detachment.",
    },
  ];

  return cycles;
}

/**
 * Bhrigu Nadi Sangraha: Rare Nadi Planetary Combinations
 */
export function detectNadiSangrahaYogas(ephemeris: EphemerisResult): { yogaName: string; participatingPlanets: string[]; description: string; effect: string }[] {
  const planets = ephemeris.planets;
  const yogas: { yogaName: string; participatingPlanets: string[]; description: string; effect: string }[] = [];

  const getSign = (p: string) => Math.floor((planets[p]?.siderealLongitude || 0) / 30);
  const areInTrine = (p1: string, p2: string) => planets[p1] && planets[p2] && getSign(p1) % 4 === getSign(p2) % 4;

  if (areInTrine("Jupiter", "Moon")) {
    yogas.push({
      yogaName: "Guru-Chandra Nadi Yoga (ज्ञान एवं जनप्रियता)",
      participatingPlanets: ["Jupiter", "Moon"],
      description: "Jupiter and Moon in trinal resonance (1-5-9 axis).",
      effect: "Bestows high emotional intelligence, spotless reputation, divine protection, and public popularity.",
    });
  }

  if (areInTrine("Jupiter", "Venus")) {
    yogas.push({
      yogaName: "Guru-Shukra Maha Bhoga Yoga (वैभव एवं राजसुख)",
      participatingPlanets: ["Jupiter", "Venus"],
      description: "Two great Gurus (Devaguru Jupiter and Daityaguru Venus) in trinal connection.",
      effect: "Confers profound aesthetic refinement, abundant wealth, luxury vehicles, and spiritual elegance.",
    });
  }

  if (areInTrine("Saturn", "Rahu")) {
    yogas.push({
      yogaName: "Shani-Rahu Videsha/Tantra Yoga (विदेश एवं तकनीकी कर्म)",
      participatingPlanets: ["Saturn", "Rahu"],
      description: "Saturn (Karma) trine Rahu (Foreign/Innovation).",
      effect: "Unlocks cutting-edge technological mastery, international business, foreign employment, and unconventional success.",
    });
  }

  if (areInTrine("Mars", "Ketu")) {
    yogas.push({
      yogaName: "Mangala-Ketu Astra/Trikala Yoga (शल्यक्रिया एवं सूक्ष्म पराक्रम)",
      participatingPlanets: ["Mars", "Ketu"],
      description: "Mars (Valour) trine Ketu (Moksha/Precision).",
      effect: "Produces extraordinary surgical precision, technical problem solving, martial arts prowess, or intense spiritual tapas.",
    });
  }

  return yogas;
}

