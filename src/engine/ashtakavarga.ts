/**
 * Classical Vedic Parashari Ashtakavarga & Bhinnaashtakavarga Engine
 * Based on Brihat Parashara Hora Shastra (BPHS)
 * Total Sarvashtakavarga (SAV) = 337 Bindus
 * Includes Directional Strength (Dik-Shuddhi / Dig-Bala in Ashtakavarga):
 * - East (Purva): Houses 1, 5, 9 (Dharma Trikona / Fire)
 * - South (Dakshina): Houses 2, 6, 10 (Artha Trikona / Earth)
 * - West (Pashchima): Houses 3, 7, 11 (Kama Trikona / Air)
 * - North (Uttara): Houses 4, 8, 12 (Moksha Trikona / Water)
 */

import { EphemerisResult } from "./types";
import { RASHIS } from "./constants";

export interface ContributorRule {
  sun: number[];
  moon: number[];
  mars: number[];
  mercury: number[];
  jupiter: number[];
  venus: number[];
  saturn: number[];
  lagna: number[];
}

// Classical BPHS Benefic House Offsets (1-indexed from contributor)
export const BAV_RULES: Record<string, ContributorRule> = {
  Sun: {
    sun: [1, 2, 4, 7, 8, 9, 10, 11],
    moon: [3, 6, 10, 11],
    mars: [1, 2, 4, 7, 8, 9, 10, 11],
    mercury: [3, 5, 6, 9, 10, 11, 12],
    jupiter: [5, 6, 9, 11],
    venus: [6, 7, 12],
    saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    lagna: [3, 4, 6, 10, 11, 12],
  },
  Moon: {
    sun: [3, 6, 7, 8, 10, 11],
    moon: [1, 3, 6, 7, 10, 11],
    mars: [2, 3, 5, 6, 9, 10, 11],
    mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    jupiter: [1, 4, 7, 8, 10, 11, 12],
    venus: [3, 4, 5, 7, 9, 10, 11],
    saturn: [3, 5, 6, 11],
    lagna: [3, 6, 10, 11],
  },
  Mars: {
    sun: [3, 5, 6, 10, 11],
    moon: [3, 6, 11],
    mars: [1, 2, 4, 7, 8, 10, 11],
    mercury: [3, 5, 6, 11],
    jupiter: [6, 10, 11, 12],
    venus: [6, 8, 11, 12],
    saturn: [1, 4, 7, 8, 9, 10, 11],
    lagna: [1, 3, 6, 10, 11],
  },
  Mercury: {
    sun: [5, 6, 9, 11, 12],
    moon: [2, 4, 6, 8, 10, 11],
    mars: [1, 2, 4, 7, 8, 9, 10, 11],
    mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    jupiter: [6, 8, 11, 12],
    venus: [1, 2, 3, 4, 5, 8, 9, 11],
    saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    lagna: [1, 2, 4, 6, 8, 10, 11],
  },
  Jupiter: {
    sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    moon: [2, 5, 7, 9, 11],
    mars: [1, 2, 4, 7, 8, 10, 11],
    mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    venus: [2, 5, 6, 9, 10, 11],
    saturn: [3, 5, 6, 12],
    lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  Venus: {
    sun: [8, 11, 12],
    moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    mars: [3, 5, 6, 9, 11, 12],
    mercury: [3, 5, 6, 9, 11],
    jupiter: [5, 8, 9, 10, 11],
    venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    saturn: [3, 4, 5, 8, 9, 10, 11],
    lagna: [1, 2, 3, 4, 5, 8, 9, 11],
  },
  Saturn: {
    sun: [1, 2, 4, 7, 8, 10, 11],
    moon: [3, 6, 11],
    mars: [3, 5, 6, 10, 11, 12],
    mercury: [6, 8, 9, 10, 11, 12],
    jupiter: [5, 6, 11, 12],
    venus: [6, 11, 12],
    saturn: [3, 5, 6, 11],
    lagna: [1, 3, 4, 6, 10, 11],
  },
};

export interface GrahaBAVDetail {
  planetId: string;
  planetName: string;
  sanskritName: string;
  symbol: string;
  color: string;
  totalBindus: number; // e.g. 48 for Sun, 49 for Moon, etc.
  rashiBindus: number[]; // 12 signs (0=Aries, 11=Pisces)
  houseBindus: number[]; // 12 houses (0=1st House, 11=12th House)
  matrix: Record<string, number[]>; // [contributorKey][signIndex] = 0 or 1
  directional: {
    east: number; // Houses 1, 5, 9
    south: number; // Houses 2, 6, 10
    west: number; // Houses 3, 7, 11
    north: number; // Houses 4, 8, 12
    bestDirection: "East" | "South" | "West" | "North";
    bestBindus: number;
    purpose: string;
  };
}

export interface DirectionalStrength {
  direction: "East" | "South" | "West" | "North";
  sanskritName: string;
  hindiName: string;
  houses: [number, number, number];
  trikonaName: string;
  element: string;
  bindus: number;
  percentage: number;
  significance: string;
  recommendedActivities: string[];
}

export interface AshtakavargaDirectionAnalysis {
  overall: {
    east: number;
    south: number;
    west: number;
    north: number;
    directions: DirectionalStrength[];
    bestDirection: DirectionalStrength;
  };
  planetDirections: Record<
    string,
    {
      planetId: string;
      planetName: string;
      sanskritName: string;
      symbol: string;
      color: string;
      east: number;
      south: number;
      west: number;
      north: number;
      bestDirection: "East" | "South" | "West" | "North";
      bestBindus: number;
      purpose: string;
    }
  >;
}

export interface AshtakavargaResult {
  sarvaRashiBindus: number[]; // 12 signs (0=Aries, 11=Pisces)
  sarvaHouseBindus: number[]; // 12 houses (0=1st House, 11=12th House)
  totalSAV: number; // Total SAV Bindus (Sum is 337)
  bav: Record<string, GrahaBAVDetail>;
  lagnaRashiIndex: number;
  directionalAnalysis: AshtakavargaDirectionAnalysis;
}

const PLANET_PURPOSES: Record<string, string> = {
  Sun: "Leadership, Government dealings, Vitality, Authority, Career initiation",
  Moon: "Residence, Mental peace, Emotional wellbeing, Water activities, Mother's blessings",
  Mars: "Property / Land purchase, Real estate, Surgery, Sports, Legal victory",
  Mercury: "Business ventures, Higher education, Commerce, Accounting, Writing & Trading",
  Jupiter: "Spiritual pilgrimage, Wealth accumulation, Guru blessings, Temple worship, Financial investments",
  Venus: "Marriage, Purchasing vehicles/luxury, Artistic creation, Romantic harmony",
  Saturn: "Long-term factories, Labor, Mining, Deep spiritual discipline, Property foundation",
};

export function calculateAshtakavarga(ephemeris: EphemerisResult): AshtakavargaResult {
  const planets = ephemeris.planets;
  const lagnaRashiIndex = ephemeris.ascendant.rashi.index;

  // Positions of 7 Grahas and Lagna in 0-11 sign indices
  const contributorPositions: Record<string, number> = {
    sun: planets["Sun"] ? planets["Sun"].rashi.index : 0,
    moon: planets["Moon"] ? planets["Moon"].rashi.index : 0,
    mars: planets["Mars"] ? planets["Mars"].rashi.index : 0,
    mercury: planets["Mercury"] ? planets["Mercury"].rashi.index : 0,
    jupiter: planets["Jupiter"] ? planets["Jupiter"].rashi.index : 0,
    venus: planets["Venus"] ? planets["Venus"].rashi.index : 0,
    saturn: planets["Saturn"] ? planets["Saturn"].rashi.index : 0,
    lagna: lagnaRashiIndex,
  };

  const classicalPlanets = [
    { id: "Sun", name: "Sun", sanskrit: "Surya", symbol: "☉", color: "#FFB300" },
    { id: "Moon", name: "Moon", sanskrit: "Chandra", symbol: "☽", color: "#E0E0E0" },
    { id: "Mars", name: "Mars", sanskrit: "Mangala", symbol: "♂", color: "#E53935" },
    { id: "Mercury", name: "Mercury", sanskrit: "Budha", symbol: "☿", color: "#43A047" },
    { id: "Jupiter", name: "Jupiter", sanskrit: "Guru", symbol: "♃", color: "#FFD54F" },
    { id: "Venus", name: "Venus", sanskrit: "Shukra", symbol: "♀", color: "#F06292" },
    { id: "Saturn", name: "Saturn", sanskrit: "Shani", symbol: "♄", color: "#5C6BC0" },
  ];

  const bavResults: Record<string, GrahaBAVDetail> = {};
  const sarvaRashiBindus = new Array(12).fill(0);
  const sarvaHouseBindus = new Array(12).fill(0);
  let totalSAV = 0;

  for (const cp of classicalPlanets) {
    const rules = BAV_RULES[cp.id];
    const rashiBindus = new Array(12).fill(0);
    const matrix: Record<string, number[]> = {
      sun: new Array(12).fill(0),
      moon: new Array(12).fill(0),
      mars: new Array(12).fill(0),
      mercury: new Array(12).fill(0),
      jupiter: new Array(12).fill(0),
      venus: new Array(12).fill(0),
      saturn: new Array(12).fill(0),
      lagna: new Array(12).fill(0),
    };

    let totalBindus = 0;

    // Process each contributor
    for (const [contribKey, ruleOffsets] of Object.entries(rules)) {
      const sourceSign = contributorPositions[contribKey];
      for (const offset of ruleOffsets) {
        const targetSign = (sourceSign + offset - 1) % 12;
        matrix[contribKey][targetSign] = 1;
        rashiBindus[targetSign] += 1;
        totalBindus += 1;
      }
    }

    // Map sign bindus to house bindus (House 1 = Lagna sign)
    const houseBindus = new Array(12).fill(0);
    for (let h = 0; h < 12; h++) {
      const signIdx = (lagnaRashiIndex + h) % 12;
      houseBindus[h] = rashiBindus[signIdx];
      sarvaHouseBindus[h] += rashiBindus[signIdx];
    }

    for (let s = 0; s < 12; s++) {
      sarvaRashiBindus[s] += rashiBindus[s];
    }

    totalSAV += totalBindus;

    // Calculate Directional Strengths for this Graha
    // East: Houses 1, 5, 9 (indices 0, 4, 8)
    // South: Houses 2, 6, 10 (indices 1, 5, 9)
    // West: Houses 3, 7, 11 (indices 2, 6, 10)
    // North: Houses 4, 8, 12 (indices 3, 7, 11)
    const east = houseBindus[0] + houseBindus[4] + houseBindus[8];
    const south = houseBindus[1] + houseBindus[5] + houseBindus[9];
    const west = houseBindus[2] + houseBindus[6] + houseBindus[10];
    const north = houseBindus[3] + houseBindus[7] + houseBindus[11];

    const dirScores: { dir: "East" | "South" | "West" | "North"; val: number }[] = [
      { dir: "East", val: east },
      { dir: "South", val: south },
      { dir: "West", val: west },
      { dir: "North", val: north },
    ];
    dirScores.sort((a, b) => b.val - a.val);

    bavResults[cp.id] = {
      planetId: cp.id,
      planetName: cp.name,
      sanskritName: cp.sanskrit,
      symbol: cp.symbol,
      color: cp.color,
      totalBindus,
      rashiBindus,
      houseBindus,
      matrix,
      directional: {
        east,
        south,
        west,
        north,
        bestDirection: dirScores[0].dir,
        bestBindus: dirScores[0].val,
        purpose: PLANET_PURPOSES[cp.id] || "General auspicious endeavors",
      },
    };
  }

  // Calculate Overall Sarvashtakavarga Directional Analysis
  const savEast = sarvaHouseBindus[0] + sarvaHouseBindus[4] + sarvaHouseBindus[8];
  const savSouth = sarvaHouseBindus[1] + sarvaHouseBindus[5] + sarvaHouseBindus[9];
  const savWest = sarvaHouseBindus[2] + sarvaHouseBindus[6] + sarvaHouseBindus[10];
  const savNorth = sarvaHouseBindus[3] + sarvaHouseBindus[7] + sarvaHouseBindus[11];

  const directionalList: DirectionalStrength[] = [
    {
      direction: "East",
      sanskritName: "Purva (पूर्व)",
      hindiName: "पूर्व दिशा",
      houses: [1, 5, 9],
      trikonaName: "Dharma Trikona (धर्म त्रिकोण)",
      element: "Fire (Agni / अग्नि)",
      bindus: savEast,
      percentage: Math.round((savEast / 337) * 100),
      significance: "Self-expression, Wisdom, Higher Education, Spiritual Guidance, Vitality",
      recommendedActivities: [
        "Starting new enterprises & leadership roles",
        "Temple visits, mantra recitation, and meditation",
        "Higher learning, scientific research, and innovation",
      ],
    },
    {
      direction: "South",
      sanskritName: "Dakshina (दक्षिण)",
      hindiName: "दक्षिण दिशा",
      houses: [2, 6, 10],
      trikonaName: "Artha Trikona (अर्थ त्रिकोण)",
      element: "Earth (Prithvi / पृथ्वी)",
      bindus: savSouth,
      percentage: Math.round((savSouth / 337) * 100),
      significance: "Career Growth, Professional Prestige, Wealth Accumulation, Competitive Success",
      recommendedActivities: [
        "Expanding profession, business operations, and jobs",
        "Overcoming competitors, litigation, and debt clearance",
        "Commercial investments and asset building",
      ],
    },
    {
      direction: "West",
      sanskritName: "Pashchima (पश्चिम)",
      hindiName: "पश्चिम दिशा",
      houses: [3, 7, 11],
      trikonaName: "Kama Trikona (काम त्रिकोण)",
      element: "Air (Vayu / वायु)",
      bindus: savWest,
      percentage: Math.round((savWest / 337) * 100),
      significance: "Social Network, Partnerships, Business Trade, Large Financial Inflows",
      recommendedActivities: [
        "Forming alliances, partnerships, and marriage",
        "Large-scale trade, marketing, and networking",
        "Realizing long-term aspirations and dreams",
      ],
    },
    {
      direction: "North",
      sanskritName: "Uttara (उत्तर)",
      hindiName: "उत्तर दिशा",
      houses: [4, 8, 12],
      trikonaName: "Moksha Trikona (मोक्ष त्रिकोण)",
      element: "Water (Jala / जल)",
      bindus: savNorth,
      percentage: Math.round((savNorth / 337) * 100),
      significance: "Domestic Bliss, Peace of Mind, Property Ownership, Spiritual Liberation",
      recommendedActivities: [
        "Buying home, land, vehicles, and settling residences",
        "Spiritual retreats, foreign travels, and healing",
        "Ancestor worship and deep inner reflection",
      ],
    },
  ];

  // Sort to find the highest direction
  const sortedDirections = [...directionalList].sort((a, b) => b.bindus - a.bindus);
  const bestDirection = sortedDirections[0];

  const planetDirections: AshtakavargaDirectionAnalysis["planetDirections"] = {};
  for (const cp of classicalPlanets) {
    const b = bavResults[cp.id];
    planetDirections[cp.id] = {
      planetId: cp.id,
      planetName: cp.name,
      sanskritName: cp.sanskrit,
      symbol: cp.symbol,
      color: cp.color,
      east: b.directional.east,
      south: b.directional.south,
      west: b.directional.west,
      north: b.directional.north,
      bestDirection: b.directional.bestDirection,
      bestBindus: b.directional.bestBindus,
      purpose: b.directional.purpose,
    };
  }

  const directionalAnalysis: AshtakavargaDirectionAnalysis = {
    overall: {
      east: savEast,
      south: savSouth,
      west: savWest,
      north: savNorth,
      directions: directionalList,
      bestDirection,
    },
    planetDirections,
  };

  return {
    sarvaRashiBindus,
    sarvaHouseBindus,
    totalSAV,
    bav: bavResults,
    lagnaRashiIndex,
    directionalAnalysis,
  };
}