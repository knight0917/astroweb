/**
 * D-12 Padma Chakra & Dwadasamsa Nadi Engine
 * Classical Ancestral Karmic Mandala & 12-Petal Lotus of the 12 Adityas
 * Evaluates Paternal (Pitru) and Maternal (Matru) lineage blessings, karmic debts, and spiritual inheritance.
 */

import { EphemerisResult, PadmaChakraAnalysis, PadmaChakraPetal } from "./types";
import { RASHI_NAMES } from "./constants";

export const ADITYA_DEITIES = [
  { name: "Dhata (धाता)", signification: "Creation, foundational vigor, ancestral root & vitality", archetype: "Aries / 1st Petal" },
  { name: "Aryama (अर्यमा)", signification: "Lineage nobility, Pitru grace, honorable conduct & family legacy", archetype: "Taurus / 2nd Petal" },
  { name: "Mitra (मित्र)", signification: "Universal friendship, harmonious alliances & sacred covenants", archetype: "Gemini / 3rd Petal" },
  { name: "Varuna (वरुण)", signification: "Cosmic order (Rta), emotional sanctity & spiritual purification", archetype: "Cancer / 4th Petal" },
  { name: "Indra (इन्द्र)", signification: "Sovereign leadership, triumph over obstacles & radiant courage", archetype: "Leo / 5th Petal" },
  { name: "Vivasvan (विवस्वान्)", signification: "Healing radiance, metabolic vitality & selfless service", archetype: "Virgo / 6th Petal" },
  { name: "Pusha (पूषा)", signification: "Safe travels, marital nourishment, trade & community growth", archetype: "Libra / 7th Petal" },
  { name: "Parjanya (पर्जन्य)", signification: "Nourishing rains, occult regeneration & fertile transformation", archetype: "Scorpio / 8th Petal" },
  { name: "Anshuman (अंशुमान्)", signification: "Intellectual brilliance, Dharmic wisdom & Guru's grace", archetype: "Sagittarius / 9th Petal" },
  { name: "Bhaga (भग)", signification: "Inherited royal fortune, material wealth & executive authority", archetype: "Capricorn / 10th Petal" },
  { name: "Tvashta (त्वष्टा)", signification: "Divine craftsmanship, architectural innovation & artistic skill", archetype: "Aquarius / 11th Petal" },
  { name: "Vishnu (विष्णु)", signification: "Universal preservation, divine protection & Moksha liberation", archetype: "Pisces / 12th Petal" },
];

export function evaluatePadmaChakra(ephemeris: EphemerisResult): PadmaChakraAnalysis {
  // Calculate D12 position for any longitude
  const getD12RashiIdx = (lon: number): number => {
    const normLon = ((lon % 360) + 360) % 360;
    const signIdx = Math.floor(normLon / 30);
    const degInSign = normLon % 30;
    const d12Part = Math.floor(degInSign / 2.5); // 0 to 11
    return (signIdx + d12Part) % 12;
  };

  const ascD12 = getD12RashiIdx(ephemeris.ascendant.siderealLongitude);
  const sunD12 = getD12RashiIdx(ephemeris.planets.Sun?.siderealLongitude || 0);
  const moonD12 = getD12RashiIdx(ephemeris.planets.Moon?.siderealLongitude || 0);
  const jupD12 = getD12RashiIdx(ephemeris.planets.Jupiter?.siderealLongitude || 0);

  // Group planets into their D12 rashis
  const d12PlanetMap: Record<number, string[]> = {};
  for (let i = 0; i < 12; i++) d12PlanetMap[i] = [];

  const mainGrahas = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  mainGrahas.forEach((pName) => {
    const pData = ephemeris.planets[pName];
    if (!pData) return;
    const rIdx = getD12RashiIdx(pData.siderealLongitude);
    d12PlanetMap[rIdx].push(pName);
  });

  const petals: PadmaChakraPetal[] = [];
  let totalBlessingPoints = 0;
  const pitruMatruRinaDiagnostics: string[] = [];

  for (let i = 0; i < 12; i++) {
    const aditya = ADITYA_DEITIES[i];
    const rashi = RASHI_NAMES[i];
    const occ = d12PlanetMap[i] || [];

    let karmicType: "Paternal Lineage (पितृ कृपा)" | "Maternal Lineage (मातृ कृपा)" | "Spiritual Heritage (कुल गुरु)" | "Karmic Debt (ऋण)" | "Neutral" = "Neutral";
    let score = 70;
    let blessing = `Governed by ${aditya.name}, bestowing ${aditya.signification}.`;

    if (i === sunD12) {
      karmicType = "Paternal Lineage (पितृ कृपा)";
      score += 20;
      blessing = `Sun resides here in D12. Channels direct ancestral paternal blessings, executive vitality, and honor.`;
    } else if (i === moonD12) {
      karmicType = "Maternal Lineage (मातृ कृपा)";
      score += 20;
      blessing = `Moon resides here in D12. Channels maternal lineage grace, emotional intuition, and prosperity.`;
    } else if (i === jupD12) {
      karmicType = "Spiritual Heritage (कुल गुरु)";
      score += 25;
      blessing = `Jupiter resides here in D12. Carries profound Guru blessings and past-life dharmic merit (Purva Punya).`;
    } else if (occ.includes("Rahu") || occ.includes("Ketu") || occ.includes("Saturn")) {
      karmicType = "Karmic Debt (ऋण)";
      score -= 15;
      blessing = `Node/Saturn presence highlights an ancestral lesson in ${rashi.englishName} requiring mindful dharma and selfless acts.`;
      pitruMatruRinaDiagnostics.push(`Petal ${i + 1} (${aditya.name}): ${occ.join(" & ")} indicates ancestral karmic clearing around ${aditya.signification}.`);
    }

    score = Math.max(10, Math.min(100, score));
    totalBlessingPoints += score;

    petals.push({
      petalNumber: i + 1,
      rashiName: rashi.englishName,
      solarAditya: aditya.name,
      adityaSignification: aditya.signification,
      occupyingPlanets: occ,
      ancestralKarmicType: karmicType,
      petalScore: score,
      lifeBlessing: blessing,
    });
  }

  const lagnaPetalAditya = ADITYA_DEITIES[ascD12].name;
  const sunFatherLineagePetal = ADITYA_DEITIES[sunD12].name;
  const moonMotherLineagePetal = ADITYA_DEITIES[moonD12].name;
  const ancestralBlessingScore = Math.round(totalBlessingPoints / 12);

  const masterPadmaChakraSynthesis = `D-12 Padma Chakra reflects an Ancestral Grace Score of ${ancestralBlessingScore}%. Ascendant anchors in Petal ${ascD12 + 1} (${lagnaPetalAditya}), while Paternal Lineage radiates via ${sunFatherLineagePetal} and Maternal Lineage flows through ${moonMotherLineagePetal}.`;

  return {
    petals,
    lagnaPetalAditya,
    sunFatherLineagePetal,
    moonMotherLineagePetal,
    ancestralBlessingScore,
    pitruMatruRinaDiagnostics,
    masterPadmaChakraSynthesis,
  };
}
