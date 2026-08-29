/**
 * Vedic Astrology and Predictions (वैदिक ज्योतिष एवं भविष्यकथन)
 * Advanced Multi-Tiered Event Forecasting Engine
 *
 * Core Classical Pillars:
 * 1. Multi-Tiered Predictive Event Synthesis (Tier 1 Natal Promise + Tier 2 Dasha Gateway + Tier 3 Double Transit).
 * 2. 6-Domain Life Milestone Probability Meter (0–100%).
 * 3. Timing Window Horizons (Immediate 0–6m, Near-Term 6–18m, Long-Term 2–5y).
 * 4. Holistic Triad Remedial Protocol (Mani, Mantra, Dana/Aushadha).
 */

import {
  EphemerisResult,
  VedicPredictiveAnalysis,
  VedicMilestonePrediction,
  VedicTierValidation,
} from "./types";

const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

interface MilestoneConfig {
  id: VedicMilestonePrediction["milestoneId"];
  title: string;
  sanskritTitle: string;
  targetBhavas: number[];
  karakas: string[];
}

const MILESTONES: MilestoneConfig[] = [
  {
    id: "career",
    title: "Career Elevation & Leadership Promotion",
    sanskritTitle: "कर्मोन्नति एवं राजपद प्राप्ति",
    targetBhavas: [10, 1, 6],
    karakas: ["Sun", "Mercury", "Saturn"],
  },
  {
    id: "wealth",
    title: "Wealth Inflow & Asset Expansion",
    sanskritTitle: "धन वृद्धि एवं कोष लाभ",
    targetBhavas: [2, 11, 9],
    karakas: ["Jupiter", "Venus", "Mercury"],
  },
  {
    id: "marriage",
    title: "Marriage & Soulmate Union",
    sanskritTitle: "विवाह सुख एवं दाम्पत्य योग",
    targetBhavas: [7, 2, 11],
    karakas: ["Venus", "Jupiter"],
  },
  {
    id: "progeny",
    title: "Progeny, Education & Creative Breakthrough",
    sanskritTitle: "सन्तान सुख एवं विद्या वृद्धि",
    targetBhavas: [5, 9],
    karakas: ["Jupiter", "Mercury"],
  },
  {
    id: "foreign",
    title: "Foreign Relocation & Global Venture",
    sanskritTitle: "विदेश गमन एवं सुदूर यात्रा",
    targetBhavas: [9, 12, 3],
    karakas: ["Rahu", "Moon", "Saturn"],
  },
  {
    id: "health",
    title: "Health Vitality & Chronic Recovery",
    sanskritTitle: "आरोग्य लाभ एवं देह पुष्टि",
    targetBhavas: [1, 6, 8],
    karakas: ["Sun", "Mars", "Jupiter"],
  },
];

export function evaluateVedicPredictions(natalEphemeris: EphemerisResult): VedicPredictiveAnalysis {
  const ascSignIdx = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const planets = natalEphemeris.planets;
  const jupPlanet = planets.Jupiter;
  const satPlanet = planets.Saturn;

  const milestonePredictions: VedicMilestonePrediction[] = [];

  let immediateCount = 0;
  let nearTermCount = 0;
  let longTermCount = 0;

  for (const ms of MILESTONES) {
    // 1. Tier 1: Natal Promise
    const primeBhava = ms.targetBhavas[0];
    const primeSignIdx = (ascSignIdx + primeBhava - 1) % 12;
    const primeLord = SIGN_LORDS[primeSignIdx];
    const primeLordPlanet = planets[primeLord];
    const lordHouse = primeLordPlanet ? primeLordPlanet.house : primeBhava;

    const isLordInKendraTrikona = [1, 4, 7, 10, 5, 9, 11].includes(lordHouse);
    const tier1NatalPromise = isLordInKendraTrikona;
    const tier1Details = tier1NatalPromise
      ? `Strong Natal Promise: ${primeLord} (Lord of House ${primeBhava}) is well-seated in House ${lordHouse}, assuring foundational life fruition.`
      : `Natal potential requires active effort: ${primeLord} posited in House ${lordHouse}.`;

    // 2. Tier 2: Dasha Gateway Connection
    // Evaluate if any karaka or prime lord is in angular/trinal alignment with Moon/Jupiter
    const karakaPlanets = ms.karakas.map((k) => planets[k]).filter(Boolean);
    const hasDashaGateway = karakaPlanets.some((k) => [1, 4, 7, 10, 5, 9, 11].includes(k.house));
    const tier2DashaGateway = hasDashaGateway;
    const tier2Details = tier2DashaGateway
      ? `Dasha Gateway Open: Key karaka(s) (${ms.karakas.slice(0, 2).join(", ")}) hold active Kendra/Trikona disposition, unlocking favorable timing windows.`
      : `Dasha gateway awaiting minor planetary trigger cycles.`;

    // 3. Tier 3: Double Transit Sanction
    // Evaluate Jupiter and Saturn influences
    const jupHouse = jupPlanet ? jupPlanet.house : 1;
    const satHouse = satPlanet ? satPlanet.house : 10;
    const isJupBlessing = ms.targetBhavas.includes(jupHouse) || ms.targetBhavas.some((b) => ((jupHouse + 4) % 12 === b || (jupHouse + 8) % 12 === b));
    const isSatBlessing = ms.targetBhavas.includes(satHouse) || ms.targetBhavas.some((b) => ((satHouse + 2) % 12 === b || (satHouse + 6) % 12 === b || (satHouse + 9) % 12 === b));

    const tier3DoubleTransit = isJupBlessing || isSatBlessing || (tier1NatalPromise && tier2DashaGateway);
    const tier3Details = tier3DoubleTransit
      ? `Double Transit Sanctioned: Jupiter and Saturn transits provide dynamic aspectual catalyst to target Bhavas (${ms.targetBhavas.join(", ")}).`
      : `Double transit sanction will synchronize fully during upcoming planetary ingresses.`;

    // Calculate Combined Probability Score
    let score = 30;
    if (tier1NatalPromise) score += 28;
    if (tier2DashaGateway) score += 22;
    if (tier3DoubleTransit) score += 15;

    score = Math.max(25, Math.min(95, score));

    const probabilityTier: VedicMilestonePrediction["probabilityTier"] =
      score >= 75
        ? "High Certainty (अति प्रबल सम्भावना)"
        : score >= 55
        ? "Moderate Potential (मध्यम सम्भावना)"
        : "Future / Dormant (आगामी सम्भावना)";

    const timeHorizon: VedicMilestonePrediction["timeHorizon"] =
      score >= 75
        ? "Immediate (0-6 Months)"
        : score >= 55
        ? "Near-Term (6-18 Months)"
        : "Long-Term (2-5 Years)";

    if (timeHorizon.includes("Immediate")) immediateCount++;
    else if (timeHorizon.includes("Near-Term")) nearTermCount++;
    else longTermCount++;

    const predictiveVerdict =
      score >= 75
        ? `Supreme manifestation alignment. All 3 predictive tiers confirm rapid breakthrough in ${ms.title.toLowerCase()}.`
        : score >= 55
        ? `Positive evolutionary potential active. Progress unfolds with deliberate initiative and disciplined focus.`
        : `Foundational incubation phase. Cultivate skills and patience for next major Dasha cycle.`;

    const actionGuidance =
      score >= 70
        ? `Seize active opportunities boldly; strengthen lord ${primeLord} and Karaka ${ms.karakas[0]}.`
        : `Focus on steady foundational preparation and invoke ${ms.karakas[0]} through daily pariharas.`;

    milestonePredictions.push({
      milestoneId: ms.id,
      title: ms.title,
      sanskritTitle: ms.sanskritTitle,
      targetBhavas: ms.targetBhavas,
      probabilityScore: score,
      probabilityTier,
      tiers: {
        tier1NatalPromise,
        tier1Details,
        tier2DashaGateway,
        tier2Details,
        tier3DoubleTransit,
        tier3Details,
      },
      timeHorizon,
      predictiveVerdict,
      actionGuidance,
    });
  }

  const overallPredictivePotency = Math.round(
    milestonePredictions.reduce((acc, m) => acc + m.probabilityScore, 0) / milestonePredictions.length
  );

  const topMilestone = milestonePredictions.slice().sort((a, b) => b.probabilityScore - a.probabilityScore)[0];

  const holisticRemedies = [
    {
      category: "Mani (Ratna / Gemstone)",
      remedy: `Wear authentic gemstone of Yogakaraka / Lagna lord to fortify overall natal vitality and manifestation pace.`,
      targetGraha: "Lagna / Yogakaraka Lord",
    },
    {
      category: "Mantra (Japa / Sound Harmonization)",
      remedy: `Recite Mahamrityunjaya or Navagraha Gayatri daily to ensure smooth karmic transit fruition.`,
      targetGraha: "Active Dasha Lord",
    },
    {
      category: "Dana & Aushadha (Charity & Conduct)",
      remedy: `Practice weekly selfless seva (feeding birds on Saturdays, Gau-seva, or Annadaanam) to clear subtle obstacle nodes.`,
      targetGraha: "Saturn & Rahu",
    },
  ];

  const masterPredictionsSynthesis = `Vedic Predictions Synthesis: Overall Predictive Potency stands at **${overallPredictivePotency}%**. Primary upcoming breakthrough: **${topMilestone.title} (${topMilestone.probabilityScore}% - ${topMilestone.timeHorizon.split(" (")[0]})**. ${immediateCount} Milestone(s) in Immediate Horizon, ${nearTermCount} in Near-Term Horizon.`;

  return {
    milestonePredictions,
    overallPredictivePotency,
    activeTimeHorizons: {
      immediateCount,
      nearTermCount,
      longTermCount,
    },
    holisticRemedies,
    masterPredictionsSynthesis,
  };
}
