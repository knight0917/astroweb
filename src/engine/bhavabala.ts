/**
 * Classical Parashari Bhava Bala (भावबल / 12 House Strengths System) Engine
 * Reference: Brihat Parashara Hora Shastra (BPHS), Chapter 28: Bhavabaladhyaya
 */

import { EphemerisResult } from "./types";
import { RASHIS } from "./constants";
import { calculateShadbala, ShadbalaPlanetId } from "./shadbala";

export interface HouseBala {
  houseNum: number; // 1..12
  sanskritName: string;
  name: string;
  significations: string;
  category: "Kendra" | "Panapara" | "Apoklima";

  // Sign & Lord on House Cusp
  rashiIndex: number; // 0..11
  rashi: typeof RASHIS[0];
  lordId: ShadbalaPlanetId;
  lordName: string;

  // The 4 Core Bhava Balas (in Virupas)
  bhavaadhipatiBala: number; // Lord's Shadbala (Virupas)
  bhavaDigBala: number; // Sign Directional Strength (0..60 Virupas)
  bhavaDrishtiBala: number; // Aspectual Strength on House (-30..+60 Virupas)
  bhavaDinaRatriBala: number; // Rising Sign Day/Night Strength (15..60 Virupas)

  // Totals & Comparisons
  totalVirupas: number;
  totalRupas: number;
  requiredRupas: number;
  requiredVirupas: number;
  strengthRatio: number; // Actual / Required
  percentageEfficiency: number;
  isBalavan: boolean; // >= 1.0 Ratio
  rank: number; // 1 to 12

  // Qualitative Analysis
  statusText: "Exceptionally Fruitful" | "Balavan (Strong & Auspicious)" | "Moderate" | "Vulnerable / Weak";
}

export interface BhavaBalaResult {
  houses: Record<number, HouseBala>;
  rankedHouses: HouseBala[];
  strongestHouse: HouseBala;
  weakestHouse: HouseBala;
  averageStrengthRatio: number;
}

const HOUSE_METADATA: Record<
  number,
  { name: string; sanskritName: string; significations: string; category: "Kendra" | "Panapara" | "Apoklima"; requiredRupas: number }
> = {
  1: {
    name: "1st House (Lagna / Self)",
    sanskritName: "तनु भाव (Tanu Bhava)",
    significations: "Physical body, vitality, character, appearance, longevity, general success",
    category: "Kendra",
    requiredRupas: 6.0,
  },
  2: {
    name: "2nd House (Wealth & Family)",
    sanskritName: "धन भाव (Dhana Bhava)",
    significations: "Accumulated wealth, speech, family lineage, diet, resources, financial stability",
    category: "Panapara",
    requiredRupas: 5.5,
  },
  3: {
    name: "3rd House (Siblings & Courage)",
    sanskritName: "सहज भाव (Sahaja Bhava)",
    significations: "Siblings, valour, physical courage, communication, short travels, manual skills",
    category: "Apoklima",
    requiredRupas: 5.0,
  },
  4: {
    name: "4th House (Home & Mother)",
    sanskritName: "सुख भाव (Sukha Bhava)",
    significations: "Mother, landed property, real estate, vehicles, happiness, heart peace",
    category: "Kendra",
    requiredRupas: 6.0,
  },
  5: {
    name: "5th House (Children & Intellect)",
    sanskritName: "पुत्र भाव (Putra Bhava)",
    significations: "Intelligence, children, creativity, past-life merits (Purva Punya), speculation",
    category: "Panapara",
    requiredRupas: 5.5,
  },
  6: {
    name: "6th House (Health & Enemies)",
    sanskritName: "शत्रु/अरि भाव (Ari Bhava)",
    significations: "Health vitality, overcoming debts, litigation, enemies, daily service and work",
    category: "Apoklima",
    requiredRupas: 5.0,
  },
  7: {
    name: "7th House (Marriage & Partnership)",
    sanskritName: "कलत्र भाव (Kalatra Bhava)",
    significations: "Spouse, marital harmony, business partnerships, trade, social relationships",
    category: "Kendra",
    requiredRupas: 6.0,
  },
  8: {
    name: "8th House (Longevity & Mysteries)",
    sanskritName: "आयुर्/रन्ध्र भाव (Ayur Bhava)",
    significations: "Longevity, sudden events, occult knowledge, transformations, inheritance",
    category: "Panapara",
    requiredRupas: 5.5,
  },
  9: {
    name: "9th House (Fortune & Dharma)",
    sanskritName: "धर्म/भाग्य भाव (Bhagya Bhava)",
    significations: "Fortune, father, Guru, higher philosophical wisdom, pilgrimage, righteousness",
    category: "Apoklima",
    requiredRupas: 5.0,
  },
  10: {
    name: "10th House (Career & Status)",
    sanskritName: "कर्म भाव (Karma Bhava)",
    significations: "Profession, authority, social fame, career executive power, achievements",
    category: "Kendra",
    requiredRupas: 6.0,
  },
  11: {
    name: "11th House (Gains & Income)",
    sanskritName: "लाभ भाव (Labha Bhava)",
    significations: "Income, financial gains, fulfillment of desires, elder siblings, network",
    category: "Panapara",
    requiredRupas: 5.5,
  },
  12: {
    name: "12th House (Expenditure & Moksha)",
    sanskritName: "व्यय भाव (Vyaya Bhava)",
    significations: "Expenditure, foreign travels, spiritual liberation (Moksha), sleep comforts",
    category: "Apoklima",
    requiredRupas: 5.0,
  },
};

const RASHI_LORDS: ShadbalaPlanetId[] = [
  "Mars", // 0 Aries
  "Venus", // 1 Taurus
  "Mercury", // 2 Gemini
  "Moon", // 3 Cancer
  "Sun", // 4 Leo
  "Mercury", // 5 Virgo
  "Venus", // 6 Libra
  "Mars", // 7 Scorpio
  "Jupiter", // 8 Sagittarius
  "Saturn", // 9 Capricorn
  "Saturn", // 10 Aquarius
  "Jupiter", // 11 Pisces
];

/**
 * Calculates Bhava Dig Bala (Directional Strength of sign on house cusp)
 */
function calculateBhavaDigBala(rashiIndex: number, houseNum: number): number {
  // Peak directional houses:
  // Nara (Human: Gemini 2, Virgo 5, Libra 6, Aquarius 10) -> East (H1)
  // Chatushpada (Animal: Aries 0, Taurus 1, Leo 4, Sag 8, Cap 9) -> South (H10)
  // Jalachara (Watery: Cancer 3, Pisces 11) -> North (H4)
  // Keeta (Insect: Scorpio 7) -> West (H7)
  let peakHouse = 1;
  if ([2, 5, 6, 10].includes(rashiIndex)) peakHouse = 1; // East (H1)
  else if ([0, 1, 4, 8, 9].includes(rashiIndex)) peakHouse = 10; // South (H10)
  else if ([3, 11].includes(rashiIndex)) peakHouse = 4; // North (H4)
  else if (rashiIndex === 7) peakHouse = 7; // West (H7)

  let houseDiff = Math.abs(houseNum - peakHouse);
  if (houseDiff > 6) houseDiff = 12 - houseDiff;

  const degDiff = houseDiff * 30;
  const score = Math.max(0, (180 - degDiff) / 3);
  return parseFloat(score.toFixed(2));
}

/**
 * Calculates Bhava Drishti Bala (Aspectual strength cast on house)
 */
function calculateBhavaDrishtiBala(
  houseNum: number,
  rashiIndex: number,
  lordId: ShadbalaPlanetId,
  ephem: EphemerisResult
): number {
  let netAspect = 0;
  const benefics = ["Jupiter", "Venus", "Mercury"];
  const malefics = ["Saturn", "Mars", "Sun", "Rahu", "Ketu"];

  const ascSign = Math.floor(ephem.ascendant.siderealLongitude / 30);

  // Check which planets aspect this house
  Object.values(ephem.planets).forEach((p) => {
    const planetHouse = ((p.rashi.index - ascSign + 12) % 12) + 1;
    let houseDiff = ((houseNum - planetHouse + 12) % 12);

    // Standard 7th aspect (6 houses away) or special aspects (Mars 4,8; Jup 5,9; Sat 3,10)
    let isAspecting = houseDiff === 6;
    if (p.id === "Mars" && (houseDiff === 3 || houseDiff === 7)) isAspecting = true;
    if (p.id === "Jupiter" && (houseDiff === 4 || houseDiff === 8)) isAspecting = true;
    if (p.id === "Saturn" && (houseDiff === 2 || houseDiff === 9)) isAspecting = true;

    if (isAspecting) {
      if (p.id === lordId) {
        netAspect += 30; // Lord aspects own house
      } else if (benefics.includes(p.id)) {
        netAspect += 20; // Benefic aspect
      } else if (malefics.includes(p.id)) {
        netAspect -= 15; // Malefic aspect
      }
    }
  });

  return parseFloat(Math.max(-30, Math.min(60, netAspect)).toFixed(2));
}

/**
 * Calculates Bhava Dina-Ratri Bala (Rising sign day/night strength)
 */
function calculateBhavaDinaRatriBala(rashiIndex: number, isDay: boolean): number {
  // Shirshodaya: Gemini 2, Leo 4, Virgo 5, Libra 6, Scorpio 7, Aquarius 10
  // Prishtodaya: Aries 0, Taurus 1, Cancer 3, Sag 8, Cap 9
  // Ubhayodaya: Pisces 11
  if ([2, 4, 5, 6, 7, 10].includes(rashiIndex)) {
    return isDay ? 60.0 : 15.0;
  }
  if ([0, 1, 3, 8, 9].includes(rashiIndex)) {
    return !isDay ? 60.0 : 15.0;
  }
  return 45.0; // Pisces
}

/**
 * Calculates Master Bhava Bala for all 12 Houses
 */
export function calculateBhavaBala(ephem: EphemerisResult): BhavaBalaResult {
  const shadbala = calculateShadbala(ephem);
  const ascSign = Math.floor(ephem.ascendant.siderealLongitude / 30);
  const isDay = ephem.planets["Sun"].altitude > 0;

  const houses: Record<number, HouseBala> = {};
  const houseList: HouseBala[] = [];

  for (let h = 1; h <= 12; h++) {
    const meta = HOUSE_METADATA[h];
    const rashiIndex = (ascSign + (h - 1)) % 12;
    const rashi = RASHIS[rashiIndex];
    const lordId = RASHI_LORDS[rashiIndex];
    const lordShadbala = shadbala.planets[lordId]?.totalVirupas ?? 300;

    // 1. Bhavaadhipati Bala (Lord's Shadbala)
    const bhavaadhipatiBala = lordShadbala;

    // 2. Bhava Dig Bala
    const bhavaDigBala = calculateBhavaDigBala(rashiIndex, h);

    // 3. Bhava Drishti Bala
    const bhavaDrishtiBala = calculateBhavaDrishtiBala(h, rashiIndex, lordId, ephem);

    // 4. Bhava Dina-Ratri Bala
    const bhavaDinaRatriBala = calculateBhavaDinaRatriBala(rashiIndex, isDay);

    // Total
    const totalVirupas = parseFloat(
      (bhavaadhipatiBala + bhavaDigBala + bhavaDrishtiBala + bhavaDinaRatriBala).toFixed(2)
    );
    const totalRupas = parseFloat((totalVirupas / 60).toFixed(2));
    const requiredRupas = meta.requiredRupas;
    const requiredVirupas = requiredRupas * 60;
    const strengthRatio = parseFloat((totalRupas / requiredRupas).toFixed(2));
    const percentageEfficiency = Math.round(strengthRatio * 100);
    const isBalavan = strengthRatio >= 1.0;

    let statusText: HouseBala["statusText"] = "Moderate";
    if (strengthRatio >= 1.4) statusText = "Exceptionally Fruitful";
    else if (strengthRatio >= 1.0) statusText = "Balavan (Strong & Auspicious)";
    else statusText = "Vulnerable / Weak";

    const houseObj: HouseBala = {
      houseNum: h,
      name: meta.name,
      sanskritName: meta.sanskritName,
      significations: meta.significations,
      category: meta.category,
      rashiIndex,
      rashi,
      lordId,
      lordName: lordId,
      bhavaadhipatiBala,
      bhavaDigBala,
      bhavaDrishtiBala,
      bhavaDinaRatriBala,
      totalVirupas,
      totalRupas,
      requiredRupas,
      requiredVirupas,
      strengthRatio,
      percentageEfficiency,
      isBalavan,
      rank: 1, // populated after sorting
      statusText,
    };

    houses[h] = houseObj;
    houseList.push(houseObj);
  }

  // Sort houses by strengthRatio descending
  houseList.sort((a, b) => b.strengthRatio - a.strengthRatio);

  houseList.forEach((h, idx) => {
    h.rank = idx + 1;
  });

  const strongestHouse = houseList[0];
  const weakestHouse = houseList[houseList.length - 1];
  const averageStrengthRatio = parseFloat(
    (houseList.reduce((acc, h) => acc + h.strengthRatio, 0) / 12).toFixed(2)
  );

  return {
    houses,
    rankedHouses: houseList,
    strongestHouse,
    weakestHouse,
    averageStrengthRatio,
  };
}