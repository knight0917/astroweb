/**
 * Classical Pancha-da Maitri (5-Fold Compound Planetary Relationship Engine)
 * Reference: Astrology for Beginners (Dr. B.V. Raman, Ch. 4) & Brihat Parashara Hora Shastra (BPHS Ch. 15)
 */

import { EphemerisResult } from "./types";

export type NaturalRelationship = "Friend" | "Neutral" | "Enemy";
export type TemporalRelationship = "Friend" | "Enemy";
export type PanchadaRelationship = "Adhi Mitra" | "Mitra" | "Sama" | "Shatru" | "Adhi Shatru";

export interface PanchadaMaitriScore {
  planet: string;
  dispositor: string;
  occupiedSignIndex: number;
  occupiedHouse: number;
  naturalRelation: NaturalRelationship;
  temporalRelation: TemporalRelationship;
  compoundRelation: PanchadaRelationship;
  sanskritName: string;
  scorePercent: number; // 100, 75, 50, 25, 0
  badgeColor: string;
  description: string;
}

export interface PanchadaMaitriReport {
  planets: Record<string, PanchadaMaitriScore>;
  fullMatrix: Record<string, Record<string, PanchadaMaitriScore>>;
}

// 1. Classical Naisargika (Natural) Relationships (Dr. B.V. Raman)
export const NAISARGIKA_MAITRI: Record<string, { friends: string[]; neutrals: string[]; enemies: string[] }> = {
  Sun: {
    friends: ["Moon", "Mars", "Jupiter"],
    neutrals: ["Mercury"],
    enemies: ["Venus", "Saturn"],
  },
  Moon: {
    friends: ["Sun", "Mercury"],
    neutrals: ["Mars", "Jupiter", "Venus", "Saturn"],
    enemies: [],
  },
  Mars: {
    friends: ["Sun", "Moon", "Jupiter"],
    neutrals: ["Venus", "Saturn"],
    enemies: ["Mercury"],
  },
  Mercury: {
    friends: ["Sun", "Venus"],
    neutrals: ["Mars", "Jupiter", "Saturn"],
    enemies: ["Moon"],
  },
  Jupiter: {
    friends: ["Sun", "Moon", "Mars"],
    neutrals: ["Saturn"],
    enemies: ["Mercury", "Venus"],
  },
  Venus: {
    friends: ["Mercury", "Saturn"],
    neutrals: ["Mars", "Jupiter"],
    enemies: ["Sun", "Moon"],
  },
  Saturn: {
    friends: ["Mercury", "Venus"],
    neutrals: ["Jupiter"],
    enemies: ["Sun", "Moon", "Mars"],
  },
};

const SIGN_LORDS: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
  4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars",
  8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

export function getNaturalRelationship(planetA: string, planetB: string): NaturalRelationship {
  if (planetA === planetB) return "Friend";
  const def = NAISARGIKA_MAITRI[planetA];
  if (!def) return "Neutral";
  if (def.friends.includes(planetB)) return "Friend";
  if (def.enemies.includes(planetB)) return "Enemy";
  return "Neutral";
}

export function getTemporalRelationship(houseA: number, houseB: number): TemporalRelationship {
  if (houseA === houseB) return "Enemy"; // Same house is 1st from each other (Enemy)
  const diff = ((houseB - houseA + 12) % 12) + 1;
  // Houses 2, 3, 4, 10, 11, 12 from planet A are Tatkalika Friends
  if ([2, 3, 4, 10, 11, 12].includes(diff)) {
    return "Friend";
  }
  return "Enemy";
}

export function getCompoundRelationship(
  natural: NaturalRelationship,
  temporal: TemporalRelationship
): { relation: PanchadaRelationship; sanskrit: string; score: number; color: string; desc: string } {
  if (natural === "Friend" && temporal === "Friend") {
    return {
      relation: "Adhi Mitra",
      sanskrit: "अधिमित्र",
      score: 100,
      color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/40",
      desc: "Intimate Friend: Planet operates with supreme harmony, confidence, and maximum benefic manifestation.",
    };
  }
  if (natural === "Neutral" && temporal === "Friend") {
    return {
      relation: "Mitra",
      sanskrit: "मित्र",
      score: 75,
      color: "text-teal-400 bg-teal-950/40 border-teal-500/40",
      desc: "Friend: Planet is well-supported by host dispositor, delivering positive and constructive results.",
    };
  }
  if ((natural === "Friend" && temporal === "Enemy") || (natural === "Enemy" && temporal === "Friend")) {
    return {
      relation: "Sama",
      sanskrit: "सम",
      score: 50,
      color: "text-amber-400 bg-amber-950/40 border-amber-500/40",
      desc: "Neutral: Mixed influences balance out, delivering steady, uninhibited average results.",
    };
  }
  if (natural === "Neutral" && temporal === "Enemy") {
    return {
      relation: "Shatru",
      sanskrit: "शत्रु",
      score: 25,
      color: "text-orange-400 bg-orange-950/40 border-orange-500/40",
      desc: "Enemy: Dispositor creates friction and delays; requires dedicated conscious effort to manifest.",
    };
  }
  // Enemy + Enemy
  return {
    relation: "Adhi Shatru",
    sanskrit: "अधिशत्रु",
    score: 0,
    color: "text-rose-400 bg-rose-950/40 border-rose-500/40",
    desc: "Bitter Enemy: Severe friction in host sign; results face obstacles and require classical remedies.",
  };
}

export function evaluatePanchadaMaitri(ephemeris: EphemerisResult): PanchadaMaitriReport {
  const physicalPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const planets = ephemeris.planets;

  const getPlanetHouse = (pName: string): number => {
    return (planets as any)[pName]?.house || 1;
  };

  const getPlanetSign = (pName: string): number => {
    const lon = (planets as any)[pName]?.siderealLongitude || 0;
    return Math.floor(lon / 30);
  };

  const fullMatrix: Record<string, Record<string, PanchadaMaitriScore>> = {};
  const dispositorReports: Record<string, PanchadaMaitriScore> = {};

  physicalPlanets.forEach((pA) => {
    fullMatrix[pA] = {};
    const houseA = getPlanetHouse(pA);
    const signA = getPlanetSign(pA);
    const dispositorOfA = SIGN_LORDS[signA];

    physicalPlanets.forEach((pB) => {
      const houseB = getPlanetHouse(pB);
      const natural = getNaturalRelationship(pA, pB);
      const temporal = getTemporalRelationship(houseA, houseB);
      const compound = getCompoundRelationship(natural, temporal);

      fullMatrix[pA][pB] = {
        planet: pA,
        dispositor: pB,
        occupiedSignIndex: signA,
        occupiedHouse: houseA,
        naturalRelation: natural,
        temporalRelation: temporal,
        compoundRelation: compound.relation,
        sanskritName: compound.sanskrit,
        scorePercent: compound.score,
        badgeColor: compound.color,
        description: compound.desc,
      };
    });

    // Extract relation with its sign dispositor
    dispositorReports[pA] = fullMatrix[pA][dispositorOfA];
  });

  return {
    planets: dispositorReports,
    fullMatrix,
  };
}
