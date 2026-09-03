/**
 * Dr. Samir Tripathi Vedic Master Suite: Marriage Masterclass 2
 * "Sexual Compatibility and Lapping Systems (Planetary Superimposition)"
 * Video Source: 74KqXMGtHwM
 *
 * Implements bi-directional planetary superimposition (रोपण पद्धति) across dual horoscopes,
 * evaluating Venus-centric physical attraction, marital endurance, material joy,
 * preacher conflict, ego combustion, soul-level detachment, and 8th-house solitude remedies.
 */

import { EphemerisResult } from "./types";
import { RASHIS } from "./constants";

export type LappingGrade =
  | "Exceptional (Top-Tier)"
  | "High Endurance & Devotion"
  | "High Material Joy & Honeymoon"
  | "Romantic Harmony"
  | "Emotional / Artistic Life"
  | "Friendly & Banter-Driven"
  | "Preacher / Teacher Conflict"
  | "Ego Combustion"
  | "Soul Pain & Detachment";

export interface LappingSingleOverlay {
  superimposedPlanet: string;
  sourcePerson: "Partner A" | "Partner B";
  targetVenusPerson: "Partner A" | "Partner B";
  rashiIndex: number;
  rashiName: string;
  relationship: "Same Rashi (100%)" | "5th Trine (50%)" | "9th Trine (50%)";
  weight: number;
  baseScore: number;
  weightedScore: number;
  grade: LappingGrade;
  summary: string;
  mechanism: string;
  riskWarning?: string;
}

export interface CompoundOverlap {
  targetVenusPerson: "Partner A" | "Partner B";
  rashiIndex: number;
  rashiName: string;
  superimposedPlanets: string[];
  compoundType: string;
  score: number;
  verdict: string;
  explanation: string;
}

export interface EighthHouseKarmicAnalysis {
  hasAffliction: boolean;
  partnerWithAffliction: string;
  details: string;
  solitudeRemedy: string;
}

export interface LappingCompatibilityResult {
  partnerA_on_B_Venus: LappingSingleOverlay[];
  partnerB_on_A_Venus: LappingSingleOverlay[];
  compoundOverlaps: CompoundOverlap[];
  sexualAttractionScore: number; // 0..100
  longevityDevotionScore: number; // 0..100
  materialJoyScore: number; // 0..100
  overallLappingScore: number; // 0..100
  overallVerdict:
    | "Extraordinary Karmic Resonance"
    | "High Compatibility & Passion"
    | "Moderate / Friendship & Banter"
    | "High Friction & Preacher Dynamic"
    | "Severe Karmic Detachment (High Risk)";
  primaryGifts: string[];
  criticalRisks: string[];
  karmicRemedies: string[];
  samirTripathiVerdict: string;
  eighthHouseAnalysis: EighthHouseKarmicAnalysis;
}

// Baseline scores and attributes defined by Dr. Samir Tripathi in Masterclass 2
const VENUS_LAPPING_RULES: Record<
  string,
  {
    baseScore: number;
    grade: LappingGrade;
    summary: string;
    mechanism: string;
    riskWarning?: string;
  }
> = {
  Mars: {
    baseScore: 95,
    grade: "Exceptional (Top-Tier)",
    summary: "Natural physical/sexual chemistry, active pursuit, passion, and rapid reconciliation after fights.",
    mechanism:
      "Opposites attract: Mars sparks healthy possessiveness, active vacation planning, and deep mutual romantic drive. Even after arguments, passion quickly restores harmony.",
  },
  Saturn: {
    baseScore: 90,
    grade: "High Endurance & Devotion",
    summary: "Deep lifelong devotion, sacrificial loyalty, and mutual respect born from shared hardships.",
    mechanism:
      "Classical Shukra-Shani lore of sacrifice: Initial difficulties transform into unwavering loyalty, forgiveness, and enduring marital longevity. Couples stick together through all life storms.",
  },
  Rahu: {
    baseScore: 92,
    grade: "High Material Joy & Honeymoon",
    summary: "10+ year extended honeymoon phase, passion for foreign travel, luxury, adventures, and optimism.",
    mechanism:
      "Rahu is the planet of Bhautik Sadhana (material fulfillment) and constant freshness (Nayanpan). Sparks excitement, vacations, cinema, and modern romantic lifestyle.",
  },
  Venus: {
    baseScore: 88,
    grade: "Romantic Harmony",
    summary: "Identical aesthetic tastes, matching romantic language, and harmonious social bonding.",
    mechanism:
      "Natural resonance of beauty, comfort, and shared romantic expressions. Both partners value peace and elegance in domestic life.",
  },
  Moon: {
    baseScore: 85,
    grade: "Emotional / Artistic Life",
    summary: "Painting-like life, deep emotional intimacy, and soul-level tenderness.",
    mechanism:
      "Poetic and artistic resonance where partners feel deeply seen emotionally. (Requires emotional stability; ungrounded Moon or Mercury interference can cause emotional turbulence).",
    riskWarning: "Ensure Moon is well-placed or anchored by Saturn to prevent emotional restlessness.",
  },
  Mercury: {
    baseScore: 70,
    grade: "Friendly & Banter-Driven",
    summary: "Works best as playful friends with banter, humor, and intellectual lightness.",
    mechanism:
      "Operates like best friends who banter and laugh together. Requires personal freedom and lightheartedness; relationship feels suffocated if rules become overly rigid.",
  },
  Jupiter: {
    baseScore: 35,
    grade: "Preacher / Teacher Conflict",
    summary: "Two Gurus clashing: Partner turns into a preachy schoolteacher, lecturing mistakes and deflating romance.",
    mechanism:
      "Daitya Guru (Venus) vs Deva Guru (Jupiter) clash. One spouse constantly corrects and lectures the other, creating moral superiority, resentment, and extinguishing romantic desire.",
    riskWarning: "Avoid treating your spouse like a student or lecturing on ethics at home.",
  },
  Sun: {
    baseScore: 25,
    grade: "Ego Combustion",
    summary: "Ego burns romance: Royal authority and pride incinerate tender romantic affection.",
    mechanism:
      "Sun's intense royal ego and demand for dominance overpower Venus's delicate tenderness, creating power struggles and extinguishing romantic intimacy.",
    riskWarning: "High ego clashes and power struggles require deliberate humility.",
  },
  Ketu: {
    baseScore: 15,
    grade: "Soul Pain & Detachment",
    summary: "Severe emotional detachment, psychological emptiness, or traumatic 10-20 year separation.",
    mechanism:
      "Ketu drains Venusian vitality, producing coldness, feelings of isolation, or sudden estrangement (even in Pisces) unless both partners live as spiritual ascetics.",
    riskWarning:
      "Extreme karmic detachment risk. Requires spiritual sadhana and avoiding emotional neglect.",
  },
};

/**
 * Calculates Dr. Samir Tripathi's Lapping (Superimposition) Compatibility
 */
export function calculateLappingCompatibility(
  chartA: EphemerisResult,
  chartB: EphemerisResult
): LappingCompatibilityResult {
  // Helper to extract planet rashi index (0..11)
  const getPlanetRashi = (chart: EphemerisResult, planetId: string): number => {
    const p = chart.planets[planetId];
    return p ? Math.floor(p.siderealLongitude / 30) : 0;
  };

  const getRashiPlanets = (chart: EphemerisResult, rashiIdx: number): string[] => {
    const planets: string[] = [];
    Object.entries(chart.planets).forEach(([id, p]) => {
      if (!p.isModernPlanet && Math.floor(p.siderealLongitude / 30) === rashiIdx) {
        planets.push(p.name);
      }
    });
    return planets;
  };

  const venusA_Rashi = getPlanetRashi(chartA, "Venus");
  const venusB_Rashi = getPlanetRashi(chartB, "Venus");

  // Evaluate single overlays for a target Venus
  const evaluateVenusOverlays = (
    targetVenusRashi: number,
    targetPerson: "Partner A" | "Partner B",
    sourceChart: EphemerisResult,
    sourcePerson: "Partner A" | "Partner B"
  ): LappingSingleOverlay[] => {
    const overlays: LappingSingleOverlay[] = [];
    const trine5 = (targetVenusRashi + 4) % 12;
    const trine9 = (targetVenusRashi + 8) % 12;

    const sourcePlanets = Object.entries(sourceChart.planets).filter(
      ([_, p]) => !p.isModernPlanet
    );

    sourcePlanets.forEach(([_, p]) => {
      const pRashi = Math.floor(p.siderealLongitude / 30);
      let relationship: "Same Rashi (100%)" | "5th Trine (50%)" | "9th Trine (50%)" | null = null;
      let weight = 0;

      if (pRashi === targetVenusRashi) {
        relationship = "Same Rashi (100%)";
        weight = 1.0;
      } else if (pRashi === trine5) {
        relationship = "5th Trine (50%)";
        weight = 0.5;
      } else if (pRashi === trine9) {
        relationship = "9th Trine (50%)";
        weight = 0.5;
      }

      if (relationship && weight > 0) {
        const rule = VENUS_LAPPING_RULES[p.name] || {
          baseScore: 50,
          grade: "Friendly & Banter-Driven" as LappingGrade,
          summary: `Superimposition of ${p.name} on Venus.`,
          mechanism: `Energy of ${p.name} overlays Venus.`,
        };

        const weightedScore = Math.round(rule.baseScore * weight);

        overlays.push({
          superimposedPlanet: p.name,
          sourcePerson,
          targetVenusPerson: targetPerson,
          rashiIndex: pRashi,
          rashiName: RASHIS[pRashi]?.englishName || "Unknown",
          relationship,
          weight,
          baseScore: rule.baseScore,
          weightedScore,
          grade: rule.grade,
          summary: rule.summary,
          mechanism: rule.mechanism,
          riskWarning: rule.riskWarning,
        });
      }
    });

    return overlays;
  };

  // 1. Partner B's planets overlaying Partner A's Venus
  const partnerB_on_A_Venus = evaluateVenusOverlays(venusA_Rashi, "Partner A", chartB, "Partner B");

  // 2. Partner A's planets overlaying Partner B's Venus
  const partnerA_on_B_Venus = evaluateVenusOverlays(venusB_Rashi, "Partner B", chartA, "Partner A");

  // 3. Compound Overlap Evaluator (Multi-planet clusters falling on Venus)
  const compoundOverlaps: CompoundOverlap[] = [];

  const checkCompound = (
    targetVenusRashi: number,
    targetPerson: "Partner A" | "Partner B",
    sourceChart: EphemerisResult
  ) => {
    const sourcePlanetsInRashi = getRashiPlanets(sourceChart, targetVenusRashi);

    if (sourcePlanetsInRashi.length >= 2) {
      const hasSun = sourcePlanetsInRashi.includes("Sun");
      const hasJupiter = sourcePlanetsInRashi.includes("Jupiter");
      const hasRahu = sourcePlanetsInRashi.includes("Rahu");
      const hasMars = sourcePlanetsInRashi.includes("Mars");
      const hasKetu = sourcePlanetsInRashi.includes("Ketu");
      const hasSaturn = sourcePlanetsInRashi.includes("Saturn");
      const hasVenus = sourcePlanetsInRashi.includes("Venus");

      if (hasSun && hasJupiter) {
        compoundOverlaps.push({
          targetVenusPerson: targetPerson,
          rashiIndex: targetVenusRashi,
          rashiName: RASHIS[targetVenusRashi].englishName,
          superimposedPlanets: ["Sun", "Jupiter"],
          compoundType: "EgoTeacher",
          score: 20,
          verdict: "Egoistic Preacher Conflict (Severe)",
          explanation:
            "Partner's Sun + Jupiter in the same sign as your Venus creates an authoritarian, lecturing dynamic where ego and moral superiority snuff out romance.",
        });
      }

      if (hasSun && hasRahu) {
        compoundOverlaps.push({
          targetVenusPerson: targetPerson,
          rashiIndex: targetVenusRashi,
          rashiName: RASHIS[targetVenusRashi].englishName,
          superimposedPlanets: ["Sun", "Rahu"],
          compoundType: "Grahan",
          score: 30,
          verdict: "Eclipse Volatility on Venus",
          explanation:
            "Sun fights Rahu inside the partner's chart while overlaying Venus, causing erratic swings between intense attraction and sudden ego conflicts.",
        });
      }

      if (hasMars && hasKetu) {
        compoundOverlaps.push({
          targetVenusPerson: targetPerson,
          rashiIndex: targetVenusRashi,
          rashiName: RASHIS[targetVenusRashi].englishName,
          superimposedPlanets: ["Mars", "Ketu"],
          compoundType: "Angarak",
          score: 10,
          verdict: "Angarak Fiery Rupture (High Trauma)",
          explanation:
            "Mars and Ketu fighting together superimpose excessive fire onto delicate Venus, leading to explosive fights and soul-breaking heartbreak.",
        });
      }

      if (hasMars && hasJupiter) {
        compoundOverlaps.push({
          targetVenusPerson: targetPerson,
          rashiIndex: targetVenusRashi,
          rashiName: RASHIS[targetVenusRashi].englishName,
          superimposedPlanets: ["Mars", "Jupiter"],
          compoundType: "GuruMangal",
          score: 75,
          verdict: "Balanced Passion & Noble Partnership",
          explanation:
            "Mars and Jupiter are mutual friends; passion is tempered by ethics and mutual respect, producing a stable 60-75% supportive bond.",
        });
      }

      if (hasSaturn && hasVenus) {
        compoundOverlaps.push({
          targetVenusPerson: targetPerson,
          rashiIndex: targetVenusRashi,
          rashiName: RASHIS[targetVenusRashi].englishName,
          superimposedPlanets: ["Saturn", "Venus"],
          compoundType: "ShaniShukra",
          score: 92,
          verdict: "Enduring Sacrificial Devotion & Harmony",
          explanation:
            "Saturn provides steadfast longevity and forgiveness, while Venus maintains tenderness and mutual appreciation.",
        });
      }
    }
  };

  checkCompound(venusA_Rashi, "Partner A", chartB);
  checkCompound(venusB_Rashi, "Partner B", chartA);

  // 4. Calculate Sub-Scores
  const allOverlays = [...partnerB_on_A_Venus, ...partnerA_on_B_Venus];

  // Sexual Attraction (driven by Mars, Rahu, Venus overlays)
  let sexualScore = 50;
  const marsOverlays = allOverlays.filter((o) => o.superimposedPlanet === "Mars");
  const rahuOverlays = allOverlays.filter((o) => o.superimposedPlanet === "Rahu");
  const venusOverlays = allOverlays.filter((o) => o.superimposedPlanet === "Venus");

  if (marsOverlays.length > 0) {
    const highestMars = Math.max(...marsOverlays.map((m) => m.weightedScore));
    sexualScore = Math.max(sexualScore, highestMars);
  }
  if (rahuOverlays.length > 0) {
    sexualScore = Math.min(100, sexualScore + 10);
  }
  if (venusOverlays.length > 0) {
    sexualScore = Math.min(100, sexualScore + 8);
  }

  // Longevity & Devotion (driven by Saturn, Venus, Jupiter-Mars)
  let longevityScore = 50;
  const saturnOverlays = allOverlays.filter((o) => o.superimposedPlanet === "Saturn");
  if (saturnOverlays.length > 0) {
    const highestSaturn = Math.max(...saturnOverlays.map((s) => s.weightedScore));
    longevityScore = Math.max(longevityScore, highestSaturn);
  }

  // Material Joy (driven by Rahu, Venus)
  let materialJoyScore = 50;
  if (rahuOverlays.length > 0) {
    materialJoyScore = Math.max(
      materialJoyScore,
      Math.max(...rahuOverlays.map((r) => r.weightedScore))
    );
  }
  if (venusOverlays.length > 0) {
    materialJoyScore = Math.min(100, materialJoyScore + 10);
  }

  // 5. Aggregate Overall Lapping Score
  let totalScore = 0;
  let totalWeights = 0;

  if (allOverlays.length > 0) {
    allOverlays.forEach((o) => {
      totalScore += o.weightedScore;
      totalWeights += o.weight;
    });
  }

  let overallLappingScore =
    totalWeights > 0 ? Math.round(totalScore / totalWeights) : 55;

  // Penalize if compound negative overlaps exist
  compoundOverlaps.forEach((c) => {
    if (c.score < 40) {
      overallLappingScore = Math.max(10, overallLappingScore - 15);
      sexualScore = Math.max(10, sexualScore - 15);
    }
  });

  // Determine Overall Verdict
  let overallVerdict: LappingCompatibilityResult["overallVerdict"] = "Moderate / Friendship & Banter";
  if (overallLappingScore >= 85) {
    overallVerdict = "Extraordinary Karmic Resonance";
  } else if (overallLappingScore >= 70) {
    overallVerdict = "High Compatibility & Passion";
  } else if (overallLappingScore >= 50) {
    overallVerdict = "Moderate / Friendship & Banter";
  } else if (overallLappingScore >= 35) {
    overallVerdict = "High Friction & Preacher Dynamic";
  } else {
    overallVerdict = "Severe Karmic Detachment (High Risk)";
  }

  // 6. Extract Primary Gifts & Critical Risks
  const primaryGifts: string[] = [];
  const criticalRisks: string[] = [];
  const karmicRemedies: string[] = [];

  allOverlays.forEach((o) => {
    if (o.baseScore >= 85) {
      primaryGifts.push(
        `⚡ ${o.sourcePerson}'s ${o.superimposedPlanet} on ${o.targetVenusPerson}'s Venus (${o.relationship}): ${o.summary}`
      );
    } else if (o.baseScore <= 35) {
      criticalRisks.push(
        `⚠️ ${o.sourcePerson}'s ${o.superimposedPlanet} on ${o.targetVenusPerson}'s Venus (${o.relationship}): ${o.summary}`
      );
    }
  });

  compoundOverlaps.forEach((c) => {
    if (c.score < 40) {
      criticalRisks.push(`⛔ Compound Overlap (${c.superimposedPlanets.join(" + ")}): ${c.verdict} - ${c.explanation}`);
    } else {
      primaryGifts.push(`✨ Compound Overlap (${c.superimposedPlanets.join(" + ")}): ${c.verdict}`);
    }
  });

  // Default fallbacks if empty
  if (primaryGifts.length === 0) {
    primaryGifts.push("Neutral baseline: Relationship is governed by standard individual dasha cycles and transit periods.");
  }
  if (criticalRisks.length === 0) {
    criticalRisks.push("No severe Venus lapping afflictions detected (No direct Ketu or Sun/Jupiter burning on Venus).");
  }

  // 7. 8th House Karmic Analysis & Solitude Remedy
  // Check if either partner has 7th lord or Mars/Rahu in 8th/6th/12th
  const ascA_Rashi = Math.floor(chartA.ascendant.siderealLongitude / 30);
  const rashi7_A = (ascA_Rashi + 6) % 12;
  const pA_L7 = RASHIS[rashi7_A]?.lord || "Mars";
  const pA_L7_pos = chartA.planets[pA_L7]?.house || 0;
  const pA_H8_hasRahu = chartA.planets["Rahu"]?.house === 8;

  const ascB_Rashi = Math.floor(chartB.ascendant.siderealLongitude / 30);
  const rashi7_B = (ascB_Rashi + 6) % 12;
  const pB_L7 = RASHIS[rashi7_B]?.lord || "Mars";
  const pB_L7_pos = chartB.planets[pB_L7]?.house || 0;
  const pB_H8_hasRahu = chartB.planets["Rahu"]?.house === 8;

  const hasAffliction =
    pA_L7_pos === 8 ||
    pA_L7_pos === 6 ||
    pA_L7_pos === 12 ||
    pA_H8_hasRahu ||
    pB_L7_pos === 8 ||
    pB_L7_pos === 6 ||
    pB_L7_pos === 12 ||
    pB_H8_hasRahu;

  let partnerWithAffliction = "None";
  if ((pA_L7_pos === 8 || pA_H8_hasRahu) && (pB_L7_pos === 8 || pB_H8_hasRahu)) {
    partnerWithAffliction = "Both Partners";
  } else if (pA_L7_pos === 8 || pA_H8_hasRahu) {
    partnerWithAffliction = "Partner A";
  } else if (pB_L7_pos === 8 || pB_H8_hasRahu) {
    partnerWithAffliction = "Partner B";
  }

  const eighthHouseAnalysis: EighthHouseKarmicAnalysis = {
    hasAffliction,
    partnerWithAffliction,
    details: hasAffliction
      ? `8th/6th/12th house karmic tension detected in ${partnerWithAffliction}'s horoscope. When 8th house heaviness peaks, domestic disagreements turn into stubborn emotional stalemates.`
      : "8th house energy is clear of heavy malefic nodal locks.",
    solitudeRemedy:
      "Dr. Samir Tripathi 8th-House Prescription: Take a 15-day solo mountain retreat / quiet solitary travel and observe periodic Ekadashi Upavasa (fasting). This detaches the 2nd-house possessive grip and completely resets the 8th-house karmic weight.",
  };

  karmicRemedies.push(eighthHouseAnalysis.solitudeRemedy);
  karmicRemedies.push(
    "Shukra-Shani Forgiveness Sadhana: When friction arises, practice deliberate forgiveness and view mutual hardships as sacred karmic endurance rather than a reason to separate."
  );

  // 8. Samir Tripathi Final Masterclass Verdict Summary
  const samirTripathiVerdict = `Dr. Samir Tripathi's Masterclass Verdict: ${overallVerdict} (Overall Score: ${overallLappingScore}/100, Sexual Attraction: ${sexualScore}/100, Longevity Devotion: ${longevityScore}/100, Material Joy: ${materialJoyScore}/100). ${
    overallLappingScore >= 75
      ? "Strong planetary superimposition supports deep attraction and enduring commitment."
      : overallLappingScore >= 50
      ? "Moderate lapping; relationship thrives when treated as mutual friendship with lighthearted banter."
      : "High risk of preacher conflict or emotional detachment. Strict mindfulness against lecturing and emotional neglect is essential."
  }`;

  return {
    partnerA_on_B_Venus,
    partnerB_on_A_Venus,
    compoundOverlaps,
    sexualAttractionScore: sexualScore,
    longevityDevotionScore: longevityScore,
    materialJoyScore: materialJoyScore,
    overallLappingScore,
    overallVerdict,
    primaryGifts,
    criticalRisks,
    karmicRemedies,
    samirTripathiVerdict,
    eighthHouseAnalysis,
  };
}
