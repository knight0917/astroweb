/**
 * Maharshi Satyacharya's Satya Jataka (सत्यजातकम् — Dhruva Nadi Foundation)
 * Classical Foundations by Sage Satyacharya
 *
 * Core Classical Pillars:
 * 1. Satyacharya's Starlord Principle (नक्षत्र स्वामी सिद्धान्त): Planets act through Nakshatra dispositors.
 * 2. Functional Lordship Rules: Trikonadhipatis (Subha), Trishadayadhipatis (Asubha), Kendradhipatis.
 * 3. 9 Janma Tara Matrix (नवतारा चक्र): Janma, Sampat, Vipat, Kshema, Pratyak, Sadhaka, Vadha, Mitra, Parama Mitra.
 * 4. Dhruva Nadi Predictive Filters.
 */

import {
  EphemerisResult,
  SatyaJatakaAnalysis,
  SatyaPlanetaryStarLord,
  SatyaFunctionalDignity,
  SatyaJanmaTara,
} from "./types";
import { NAKSHATRAS } from "./constants";

const NAKSHATRA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
];

const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

const TARA_NAMES: Array<SatyaJanmaTara["taraName"]> = [
  "Janma (जन्म)",
  "Sampat (सम्पत्)",
  "Vipat (विपत्)",
  "Kshema (क्षेम)",
  "Pratyak (प्रत्यक्)",
  "Sadhaka (साधक)",
  "Vadha (वध)",
  "Mitra (मित्र)",
  "Parama Mitra (परम मित्र)",
];

const TARA_DESCRIPTIONS: Record<string, { isFav: boolean; desc: string }> = {
  "Janma (जन्म)": { isFav: true, desc: "Birth star; governs physical vitality, mental constitution, and self-identity." },
  "Sampat (सम्पत्)": { isFav: true, desc: "Wealth star; activates prosperity, material growth, and liquid asset gains." },
  "Vipat (विपत्)": { isFav: false, desc: "Obstacle star; prompts delays, sudden challenges, and tests of resilience." },
  "Kshema (क्षेम)": { isFav: true, desc: "Security star; bestows well-being, domestic peace, and protective shelter." },
  "Pratyak (प्रत्यक्)": { isFav: false, desc: "Friction star; requires diplomacy, patience, and avoidance of confrontations." },
  "Sadhaka (साधक)": { isFav: true, desc: "Accomplishment star; unlocks high achievement, spiritual focus, and success in ventures." },
  "Vadha (वध)": { isFav: false, desc: "Vulnerable star; cautions against physical recklessness and high-risk speculations." },
  "Mitra (मित्र)": { isFav: true, desc: "Friendly star; brings allies, collaborative goodwill, and harmonious connections." },
  "Parama Mitra (परम मित्र)": { isFav: true, desc: "Best friend star; delivers profound fortune, divine grace, and exceptional breakthroughs." },
};

const VEDIC_9_GRAHAS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

export function evaluateSatyaJataka(natalEphemeris: EphemerisResult): SatyaJatakaAnalysis {
  const ascSignIdx = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const moonNakIdx = Math.floor((natalEphemeris.planets.Moon.siderealLongitude * 27) / 360);

  // 1. Satyacharya's Starlord Principle (नक्षत्र स्वामी सिद्धान्त)
  const planetaryStarLords: SatyaPlanetaryStarLord[] = [];

  for (const pName of VEDIC_9_GRAHAS) {
    const pData = natalEphemeris.planets[pName];
    if (!pData) continue;
    const nakIdx = Math.floor((pData.siderealLongitude * 27) / 360);
    const starLord = NAKSHATRA_LORDS[nakIdx] || "Sun";
    const nakName = NAKSHATRAS[nakIdx]?.sanskritName || `Nakshatra #${nakIdx + 1}`;

    // Houses owned by starLord
    const ownedHouses: number[] = [];
    SIGN_LORDS.forEach((lName, sIdx) => {
      if (lName === starLord) {
        const hNum = ((sIdx - ascSignIdx + 12) % 12) + 1;
        ownedHouses.push(hNum);
      }
    });

    const starLordPlanet = natalEphemeris.planets[starLord];
    const occupiedHouse = starLordPlanet ? starLordPlanet.house : pData.house;
    const allManifestedBhavas = Array.from(new Set([...ownedHouses, occupiedHouse])).sort((a, b) => a - b);

    const effectSummary = `${pName} is posited in ${nakName} (ruled by ${starLord}). Per Sage Satyacharya, ${pName} manifests results of House(s) ${allManifestedBhavas.join(", ")}.`;

    planetaryStarLords.push({
      planetName: pName,
      nakshatraName: nakName,
      starLord,
      manifestedBhavas: allManifestedBhavas,
      effectSummary,
    });
  }

  // 2. Functional Dignities per Sage Satyacharya
  const functionalDignities: SatyaFunctionalDignity[] = [];
  const checkedPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  for (const pName of checkedPlanets) {
    const ownedHouses: number[] = [];
    SIGN_LORDS.forEach((lName, sIdx) => {
      if (lName === pName) {
        const hNum = ((sIdx - ascSignIdx + 12) % 12) + 1;
        ownedHouses.push(hNum);
      }
    });

    let role = `Lord of House(s) ${ownedHouses.join(", ")}`;
    let dignityType: SatyaFunctionalDignity["dignityType"] = "Neutral/Mixed (मिश्र)";
    let satyaRule = "Neutral Graha functioning according to associations and dispositor.";

    const hasLagna = ownedHouses.includes(1);
    const hasTrikona = ownedHouses.includes(5) || ownedHouses.includes(9);
    const hasTrishadaya = ownedHouses.includes(3) || ownedHouses.includes(6) || ownedHouses.includes(11);

    if (hasLagna || hasTrikona) {
      dignityType = "Subha (शुभ - Auspicious)";
      satyaRule = "Trikonadhipati Rule: Maharshi Satyacharya declares lords of 1, 5, and 9 to be intrinsically auspicious and virtuous.";
    } else if (hasTrishadaya) {
      dignityType = "Asubha (अशुभ - Friction/Struggle)";
      satyaRule = "Trishadayadhipati Rule: Lords of 3, 6, and 11 produce worldly friction, ambitious exertion, and trials.";
    }

    functionalDignities.push({
      planetName: pName,
      role,
      dignityType,
      satyaRule,
    });
  }

  // 3. 9 Janma Tara Matrix (नवतारा चक्र)
  const janmaTaraMatrix: SatyaJanmaTara[] = [];

  for (const pName of VEDIC_9_GRAHAS) {
    const pData = natalEphemeris.planets[pName];
    if (!pData) continue;
    const nakIdx = Math.floor((pData.siderealLongitude * 27) / 360);
    const nakName = NAKSHATRAS[nakIdx]?.sanskritName || `Nakshatra #${nakIdx + 1}`;

    const taraStep = ((nakIdx - moonNakIdx + 27) % 9);
    const taraName = TARA_NAMES[taraStep] || "Janma (जन्म)";
    const taraInfo = TARA_DESCRIPTIONS[taraName] || { isFav: true, desc: "Auspicious Tara." };

    janmaTaraMatrix.push({
      planetName: pName,
      nakshatraName: nakName,
      taraName,
      isFavorable: taraInfo.isFav,
      description: `${pName} is in ${taraName} Tara (${nakName}) -> ${taraInfo.desc}`,
    });
  }

  // Master Synthesis
  const favTarasCount = janmaTaraMatrix.filter((t) => t.isFavorable).length;
  const auspiciousLords = functionalDignities.filter((f) => f.dignityType.includes("Subha")).map((f) => f.planetName).join(", ");

  const masterSatyaJatakaSynthesis = `Maharshi Satyacharya's Satya Jataka indicates **${favTarasCount} of 9 Grahas posited in Favorable Janma Taras** (Sampat, Kshema, Sadhaka, Mitra, Parama Mitra). Auspicious Trikonadhipatis are **${auspiciousLords}**, delivering unhindered fortune and Dharma Siddhi via Nakshatra dispositor mechanics.`;

  return {
    planetaryStarLords,
    functionalDignities,
    janmaTaraMatrix,
    masterSatyaJatakaSynthesis,
  };
}
