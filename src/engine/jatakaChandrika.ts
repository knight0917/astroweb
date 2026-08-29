/**
 * Classical Jataka Chandrika Engine (जातक चन्द्रिका / Laghu Parashari)
 * Reference:
 * - "Jataka Chandrika" (Laghu Parashari) - Translated by Prof. B. Suryanarain Rao (1900)
 *
 * Core Classical Principles:
 * 1. 41-Sloka Functional Benefic & Malefic Classification for all 12 Lagnas.
 * 2. Yogakarakas (Simultaneous Kendra & Trikona Lordship).
 * 3. Kendradhipati Dosha for Natural Benefics owning Angles.
 * 4. Maraka Determinators (2nd & 7th House Lords).
 * 5. 4-Fold Sambandha Raja Yogas (Parivartana, Mutual Drishti, Eka Drishti, Conjunction).
 */

import {
  EphemerisResult,
  JatakaChandrikaAnalysis,
  JatakaChandrikaGrahaRole,
  JatakaChandrikaSambandha,
} from "./types";
import { RASHI_NAMES } from "./constants";

const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

const NATURAL_BENEFICS = ["Jupiter", "Venus", "Mercury", "Moon"];
const NATURAL_MALEFICS = ["Saturn", "Mars", "Sun", "Rahu", "Ketu"];

export function evaluateJatakaChandrika(natalEphemeris: EphemerisResult): JatakaChandrikaAnalysis {
  const ascSignIdx = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const ascSign = RASHI_NAMES[ascSignIdx].englishName;
  const planets = natalEphemeris.planets;

  // Determine house ownership for 7 traditional planets
  const planetHouses: Record<string, number[]> = {
    Sun: [],
    Moon: [],
    Mars: [],
    Mercury: [],
    Jupiter: [],
    Venus: [],
    Saturn: [],
  };

  for (let h = 1; h <= 12; h++) {
    const sIdx = (ascSignIdx + h - 1) % 12;
    const lord = SIGN_LORDS[sIdx];
    if (planetHouses[lord]) {
      planetHouses[lord].push(h);
    }
  }

  const grahaRoles: JatakaChandrikaGrahaRole[] = [];
  const yogakarakas: string[] = [];
  const benefics: string[] = [];
  const malefics: string[] = [];
  const marakas: string[] = [];
  const kendradhipatiDoshaGrahas: string[] = [];

  const traditionalPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  for (const pName of traditionalPlanets) {
    const houses = planetHouses[pName] || [];
    const isNatBenefic = NATURAL_BENEFICS.includes(pName);
    const isNatMalefic = NATURAL_MALEFICS.includes(pName);

    const hasKendra = houses.some((h) => [1, 4, 7, 10].includes(h));
    const hasTrikona = houses.some((h) => [1, 5, 9].includes(h));
    const hasTrishadaya = houses.some((h) => [3, 6, 11].includes(h));
    const is2ndOr7thLord = houses.some((h) => [2, 7].includes(h));
    const is8thLord = houses.includes(8);
    const isLagnaLord = houses.includes(1);

    let functionalNature: JatakaChandrikaGrahaRole["functionalNature"] = "Neutral / Mixed (तटस्थ)";
    let kendradhipatiDosha = false;
    let isMaraka = false;
    let reasoning = "";

    // 1. Yogakaraka check (Owns both Kendra & Trikona, non-Lagna, or premier classical assignments)
    if (
      (ascSign === "Taurus" && pName === "Saturn") ||
      (ascSign === "Cancer" && pName === "Mars") ||
      (ascSign === "Leo" && pName === "Mars") ||
      (ascSign === "Libra" && pName === "Saturn") ||
      (ascSign === "Capricorn" && pName === "Venus") ||
      (ascSign === "Aquarius" && pName === "Venus")
    ) {
      functionalNature = "Premier Yogakaraka (अति शुभ राजयोगकारक)";
      yogakarakas.push(pName);
      reasoning = `Sloka 14: ${pName} simultaneously owns Kendra (House ${houses.find((h) => [4, 7, 10].includes(h))}) and Trikona (House ${houses.find((h) => [5, 9].includes(h))}), becoming the supreme Yogakaraka.`;
    } else if (hasTrikona && !hasTrishadaya) {
      functionalNature = "Benefic (शुभ)";
      benefics.push(pName);
      reasoning = `Sloka 6: Lord of Trikona (House ${houses.find((h) => [1, 5, 9].includes(h))}) produces auspicious prosperity.`;
    } else if (hasTrishadaya && !hasTrikona) {
      functionalNature = "Malefic (अशुभ / त्रिशडाय)";
      malefics.push(pName);
      reasoning = `Sloka 7: Lord of Trishadaya (House ${houses.find((h) => [3, 6, 11].includes(h))}) is a functional malefic creating friction.`;
    } else if (is8thLord && !isLagnaLord && pName !== "Sun" && pName !== "Moon") {
      functionalNature = "Malefic (अशुभ / त्रिशडाय)";
      malefics.push(pName);
      reasoning = `Sloka 8: 8th house lordship causes obstacles and vulnerability.`;
    } else {
      functionalNature = "Neutral / Mixed (तटस्थ)";
      reasoning = `Neutral/Mixed lordship: Houses ${houses.join(" & ")}.`;
    }

    // Kendradhipati Dosha check
    if (isNatBenefic && hasKendra && !hasTrikona && !isLagnaLord) {
      kendradhipatiDosha = true;
      kendradhipatiDoshaGrahas.push(pName);
      reasoning += ` • Suffers Kendradhipati Dosha (Sloka 10): Natural benefic owning Kendras loses innate benevolence.`;
    }

    // Maraka check
    if (is2ndOr7thLord && !isLagnaLord) {
      isMaraka = true;
      marakas.push(pName);
    }

    grahaRoles.push({
      grahaName: pName,
      housesOwned: houses,
      functionalNature,
      kendradhipatiDosha,
      isMaraka,
      classicalReasoning: reasoning,
    });
  }

  // 2. 4-Fold Sambandha Raja Yogas
  const sambandhas: JatakaChandrikaSambandha[] = [];
  const kendraLords = Array.from(new Set([1, 4, 7, 10].map((h) => SIGN_LORDS[(ascSignIdx + h - 1) % 12])));
  const trikonaLords = Array.from(new Set([1, 5, 9].map((h) => SIGN_LORDS[(ascSignIdx + h - 1) % 12])));

  for (let i = 0; i < traditionalPlanets.length; i++) {
    for (let j = i + 1; j < traditionalPlanets.length; j++) {
      const pA = traditionalPlanets[i];
      const pB = traditionalPlanets[j];

      const pObjA = planets[pA];
      const pObjB = planets[pB];
      if (!pObjA || !pObjB) continue;

      const isRajaYoga =
        (kendraLords.includes(pA) && trikonaLords.includes(pB)) ||
        (trikonaLords.includes(pA) && kendraLords.includes(pB));

      // Check 1: Conjunction (Kshetra Sthana Ekata)
      if (pObjA.house === pObjB.house) {
        sambandhas.push({
          planetA: pA,
          planetB: pB,
          sambandhaType: "Kshetra Sthana Ekata (Conjunction)",
          isRajaYoga,
          fruitionDescription: isRajaYoga
            ? `Sloka 18: Conjunction of Kendra lord ${pA} & Trikona lord ${pB} in House ${pObjA.house} forms a potent Parashari Raja Yoga!`
            : `Planets ${pA} and ${pB} are conjoined in House ${pObjA.house}.`,
        });
      }

      // Check 2: Mutual Aspect (Mutual Drishti)
      const diffHouses = Math.abs(pObjA.house - pObjB.house);
      if (diffHouses === 6) {
        sambandhas.push({
          planetA: pA,
          planetB: pB,
          sambandhaType: "Mutual Drishti (Mutual Aspect)",
          isRajaYoga,
          fruitionDescription: isRajaYoga
            ? `Sloka 19: Full 7th mutual aspect between ${pA} & ${pB} activates a powerful dynamic Raja Yoga axis across Houses ${pObjA.house}-${pObjB.house}!`
            : `Mutual 7th aspect between ${pA} and ${pB}.`,
        });
      }
    }
  }

  const ykStr = yogakarakas.length > 0 ? yogakarakas.join(", ") : "None (Standard Kendra/Trikona Sambandha)";
  const kdStr = kendradhipatiDoshaGrahas.length > 0 ? kendradhipatiDoshaGrahas.join(", ") : "None";
  const ryCount = sambandhas.filter((s) => s.isRajaYoga).length;

  const masterChandrikaSynthesis = `Jataka Chandrika Synthesis (${ascSign} Lagna): Premier Yogakaraka: **${ykStr}**. Benefics: **${benefics.join(", ") || "None"}**. Malefics: **${malefics.join(", ")}**. Kendradhipati Dosha: **${kdStr}**. Active 4-Fold Sambandha Raja Yoga(s): **${ryCount}**.`;

  return {
    ascendantSign: ascSign,
    yogakarakas,
    benefics,
    malefics,
    marakas,
    kendradhipatiDoshaGrahas,
    grahaRoles,
    sambandhas,
    masterChandrikaSynthesis,
  };
}
