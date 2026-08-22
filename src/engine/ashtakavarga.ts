/**
 * Classical Vedic Parashari Ashtakavarga & Bhinnaashtakavarga Engine
 * Based on Brihat Parashara Hora Shastra (BPHS)
 * Total Sarvashtakavarga (SAV) = 337 Bindus
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
  // 12 signs (0=Aries, 11=Pisces)
  rashiBindus: number[];
  // 12 houses (0=1st House, 11=12th House)
  houseBindus: number[];
  // Contributor breakdown per sign [contributorKey][signIndex] = 0 or 1
  matrix: Record<string, number[]>;
}

export interface AshtakavargaResult {
  // Sarvashtakavarga 12 signs (0=Aries, 11=Pisces)
  sarvaRashiBindus: number[];
  // Sarvashtakavarga 12 houses (0=1st House, 11=12th House)
  sarvaHouseBindus: number[];
  // Total SAV Bindus (Sum is 337)
  totalSAV: number;
  // Detailed BAV for each of the 7 Classical Grahas
  bav: Record<string, GrahaBAVDetail>;
  // Ascendant Sign Index
  lagnaRashiIndex: number;
}

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
        // Benefic target sign = (sourceSign + offset - 1) % 12
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
    };
  }

  return {
    sarvaRashiBindus,
    sarvaHouseBindus,
    totalSAV,
    bav: bavResults,
    lagnaRashiIndex,
  };
}