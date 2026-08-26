/**
 * Classical Parashari Shodashavarga (षोडशवर्ग / 16 Divisional Charts) Engine
 * Reference: Brihat Parashara Hora Shastra (BPHS), Chapter 6: Shodashavargaadhyaya
 */

import { RASHIS } from "./constants";
import { EphemerisResult } from "./types";

export type VargaId =
  | "D1"
  | "D2"
  | "D3"
  | "D4"
  | "D7"
  | "D9"
  | "D10"
  | "D12"
  | "D16"
  | "D20"
  | "D24"
  | "D27"
  | "D30"
  | "D40"
  | "D45"
  | "D60";

export interface VargaMeta {
  id: VargaId;
  name: string;
  sanskritName: string;
  divisionNumber: number;
  spanDegrees: number;
  significance: string;
  category: "Shadvarga" | "Saptavarga" | "Dashavarga" | "Shodashavarga";
  deityGroup: string;
}

export const VARGA_DEFINITIONS: Record<VargaId, VargaMeta> = {
  D1: {
    id: "D1",
    name: "Rashi",
    sanskritName: "राशि चक्र",
    divisionNumber: 1,
    spanDegrees: 30,
    significance: "Physical body, general existence, overall destiny and vitality",
    category: "Shadvarga",
    deityGroup: "12 Rashis (Mesha to Meena)",
  },
  D2: {
    id: "D2",
    name: "Hora",
    sanskritName: "होरा चक्र",
    divisionNumber: 2,
    spanDegrees: 15,
    significance: "Wealth, assets, treasury, financial prosperity and speech",
    category: "Shadvarga",
    deityGroup: "Devas (Sun/Leo) & Pitris (Moon/Cancer)",
  },
  D3: {
    id: "D3",
    name: "Drekkana",
    sanskritName: "द्रेष्काण चक्र",
    divisionNumber: 3,
    spanDegrees: 10,
    significance: "Siblings, courage, vitality, energy, third-house pursuits",
    category: "Shadvarga",
    deityGroup: "Narada, Agastya, Durvasa",
  },
  D4: {
    id: "D4",
    name: "Chaturthamsha (Turyamsha)",
    sanskritName: "चतुर्थांश चक्र",
    divisionNumber: 4,
    spanDegrees: 7.5,
    significance: "Landed property, fixed assets, home, conveyances, fortune",
    category: "Dashavarga",
    deityGroup: "Sanaka, Sanandana, Sanatkumara, Sanatsujata",
  },
  D7: {
    id: "D7",
    name: "Saptamsha",
    sanskritName: "सप्तांश चक्र",
    divisionNumber: 7,
    spanDegrees: 30 / 7,
    significance: "Children, progeny, grandchildren, creative fertility and legacy",
    category: "Saptavarga",
    deityGroup: "7 Guardian Deities (Kshara, Ksheera, Dadhi, Ghrita, etc.)",
  },
  D9: {
    id: "D9",
    name: "Navamsha (Dharmamsha)",
    sanskritName: "नवांश चक्र",
    divisionNumber: 9,
    spanDegrees: 30 / 9,
    significance: "Dharma, marriage, spouse, soul destiny, true planetary strength & fruition",
    category: "Shadvarga",
    deityGroup: "Deva, Nara, Rakshasa",
  },
  D10: {
    id: "D10",
    name: "Dashamsha",
    sanskritName: "दशांश चक्र",
    divisionNumber: 10,
    spanDegrees: 3,
    significance: "Career, profession, social status, fame, power, executive karma",
    category: "Dashavarga",
    deityGroup: "10 Digpalas (Indra, Agni, Yama, Nirriti, Varuna, Vayu, Kubera, Ishana, Brahma, Ananta)",
  },
  D12: {
    id: "D12",
    name: "Dwadashamsha",
    sanskritName: "द्वादशांश चक्र",
    divisionNumber: 12,
    spanDegrees: 2.5,
    significance: "Parents, ancestry, inherited karma, lineage and paternal/maternal blessings",
    category: "Shadvarga",
    deityGroup: "Ganesha, Ashvini Kumaras, Yama, Sarpa",
  },
  D16: {
    id: "D16",
    name: "Shodashamsha (Kalangsha)",
    sanskritName: "षोडशांश चक्र",
    divisionNumber: 16,
    spanDegrees: 1.875,
    significance: "Vehicles, conveyances, mental happiness, luxuries, comforts",
    category: "Dashavarga",
    deityGroup: "Brahma, Vishnu, Shiva, Surya",
  },
  D20: {
    id: "D20",
    name: "Vimshamsha",
    sanskritName: "विंशांश चक्र",
    divisionNumber: 20,
    spanDegrees: 1.5,
    significance: "Spiritual progress, religious devotion, upasana, mantras, bhakti",
    category: "Shodashavarga",
    deityGroup: "Kali, Gauri, Jaya, Vijaya, etc.",
  },
  D24: {
    id: "D24",
    name: "Chaturvimshamsha (Siddhamsa)",
    sanskritName: "चतुर्विंशांश चक्र",
    divisionNumber: 24,
    spanDegrees: 1.25,
    significance: "Higher knowledge, learning, education, intellect, academic mastery",
    category: "Shodashavarga",
    deityGroup: "Skanda, Parashudhara, Ananta, Vasuki",
  },
  D27: {
    id: "D27",
    name: "Saptavimshamsha (Bhamsa / Nakshatramsha)",
    sanskritName: "सप्तविंशांश चक्र",
    divisionNumber: 27,
    spanDegrees: 30 / 27,
    significance: "Physical stamina, strength, inherent potential, bodily vulnerabilities",
    category: "Shodashavarga",
    deityGroup: "27 Nakshatra Deities",
  },
  D30: {
    id: "D30",
    name: "Trimshamsha",
    sanskritName: "त्रिंशांश चक्र",
    divisionNumber: 30,
    spanDegrees: 1,
    significance: "Arishta, misfortunes, hidden evils, character challenges, disease predispositions",
    category: "Shadvarga",
    deityGroup: "Agni, Vayu, Indra, Varuna, Yama",
  },
  D40: {
    id: "D40",
    name: "Khavedamsha (Swavedamsha)",
    sanskritName: "खवेदांश चक्र",
    divisionNumber: 40,
    spanDegrees: 0.75,
    significance: "General auspicious and inauspicious effects, matrilineal karma",
    category: "Shodashavarga",
    deityGroup: "Vishnu & Shiva aspects",
  },
  D45: {
    id: "D45",
    name: "Akshavedamsha",
    sanskritName: "अक्षवेदांश चक्र",
    divisionNumber: 45,
    spanDegrees: 30 / 45,
    significance: "Character integrity, moral purity, all-round wellbeing and spiritual conduct",
    category: "Shodashavarga",
    deityGroup: "Brahma, Shiva, Vishnu",
  },
  D60: {
    id: "D60",
    name: "Shashtiamsha",
    sanskritName: "षष्ठ्यंश चक्र",
    divisionNumber: 60,
    spanDegrees: 0.5,
    significance: "Past life karma, subtle impressions, supreme precision verification (Vimsopaka weight: 4/20)",
    category: "Dashavarga",
    deityGroup: "60 Classical Shashtiamsha Deities (Ghora, Rakshasa, Deva, Kubera, etc.)",
  },
};

/**
 * Computes the Varga Rashi sign index (0 = Aries, ..., 11 = Pisces) for any longitude
 * under the classical Parashari rules of BPHS Chapter 6.
 */
export function calculateVargaSign(longitude: number, vargaId: VargaId): number {
  const normLon = ((longitude % 360) + 360) % 360;
  const natalSign = Math.floor(normLon / 30); // 0..11
  const degInSign = normLon % 30; // 0..30

  const isOdd = natalSign % 2 === 0; // 0(Mesha), 2(Mithuna)... are Odd (1st, 3rd...)
  const modality = natalSign % 3; // 0 = Movable (Chara), 1 = Fixed (Sthira), 2 = Dual (Dwiswabhava)
  const element = natalSign % 4; // 0 = Fire, 1 = Earth, 2 = Air, 3 = Water

  switch (vargaId) {
    case "D1":
      return natalSign;

    case "D2": {
      // D2 Hora (15 deg): Odd -> Sun(Leo:4), Moon(Cancer:3); Even -> Moon(3), Sun(4)
      const part = Math.floor(degInSign / 15);
      if (isOdd) {
        return part === 0 ? 4 : 3; // Sun(Leo), Moon(Cancer)
      } else {
        return part === 0 ? 3 : 4; // Moon(Cancer), Sun(Leo)
      }
    }

    case "D3": {
      // D3 Drekkana (10 deg): 1st, 5th, 9th from natal sign
      const part = Math.floor(degInSign / 10);
      return (natalSign + part * 4) % 12;
    }

    case "D4": {
      // D4 Chaturthamsha (7.5 deg): 1st, 4th, 7th, 10th from natal sign
      const part = Math.floor(degInSign / 7.5);
      return (natalSign + part * 3) % 12;
    }

    case "D7": {
      // D7 Saptamsha (30/7 deg): Odd -> from same; Even -> from 7th (natalSign + 6)
      const part = Math.floor(degInSign / (30 / 7));
      const start = isOdd ? natalSign : (natalSign + 6) % 12;
      return (start + part) % 12;
    }

    case "D9": {
      // D9 Navamsha (3 deg 20 min): Fire->Aries(0), Earth->Cap(9), Air->Libra(6), Water->Cancer(3)
      const part = Math.floor(degInSign / (30 / 9));
      let start = 0;
      if (element === 0) start = 0; // Aries
      else if (element === 1) start = 9; // Capricorn
      else if (element === 2) start = 6; // Libra
      else if (element === 3) start = 3; // Cancer
      return (start + part) % 12;
    }

    case "D10": {
      // D10 Dashamsha (3 deg): Odd -> from same; Even -> from 9th (natalSign + 8)
      const part = Math.floor(degInSign / 3);
      const start = isOdd ? natalSign : (natalSign + 8) % 12;
      return (start + part) % 12;
    }

    case "D12": {
      // D12 Dwadashamsha (2.5 deg): starts from same sign
      const part = Math.floor(degInSign / 2.5);
      return (natalSign + part) % 12;
    }

    case "D16": {
      // D16 Shodashamsha (1.875 deg): Movable->Aries(0), Fixed->Leo(4), Dual->Sagittarius(8)
      const part = Math.floor(degInSign / 1.875);
      let start = 0;
      if (modality === 0) start = 0;
      else if (modality === 1) start = 4;
      else if (modality === 2) start = 8;
      return (start + part) % 12;
    }

    case "D20": {
      // D20 Vimshamsha (1.5 deg): Movable->Aries(0), Fixed->Sagittarius(8), Dual->Leo(4)
      const part = Math.floor(degInSign / 1.5);
      let start = 0;
      if (modality === 0) start = 0;
      else if (modality === 1) start = 8;
      else if (modality === 2) start = 4;
      return (start + part) % 12;
    }

    case "D24": {
      // D24 Chaturvimshamsha (1.25 deg): Odd -> Leo(4); Even -> Cancer(3)
      const part = Math.floor(degInSign / 1.25);
      const start = isOdd ? 4 : 3;
      return (start + part) % 12;
    }

    case "D27": {
      // D27 Saptavimshamsha (30/27 deg): Fire->Aries(0), Earth->Cancer(3), Air->Libra(6), Water->Cap(9)
      const part = Math.floor(degInSign / (30 / 27));
      let start = 0;
      if (element === 0) start = 0;
      else if (element === 1) start = 3;
      else if (element === 2) start = 6;
      else if (element === 3) start = 9;
      return (start + part) % 12;
    }

    case "D30": {
      // D30 Trimshamsha: Unequal 5 parts per sign
      if (isOdd) {
        if (degInSign < 5) return 0; // Mars (Aries)
        if (degInSign < 10) return 10; // Saturn (Aquarius)
        if (degInSign < 18) return 8; // Jupiter (Sagittarius)
        if (degInSign < 25) return 2; // Mercury (Gemini)
        return 6; // Venus (Libra)
      } else {
        if (degInSign < 5) return 1; // Venus (Taurus)
        if (degInSign < 12) return 5; // Mercury (Virgo)
        if (degInSign < 20) return 11; // Jupiter (Pisces)
        if (degInSign < 25) return 9; // Saturn (Capricorn)
        return 7; // Mars (Scorpio)
      }
    }

    case "D40": {
      // D40 Khavedamsha (0.75 deg): Odd -> Aries(0); Even -> Libra(6)
      const part = Math.floor(degInSign / 0.75);
      const start = isOdd ? 0 : 6;
      return (start + part) % 12;
    }

    case "D45": {
      // D45 Akshavedamsha (30/45 deg): Movable->Aries(0), Fixed->Leo(4), Dual->Sagittarius(8)
      const part = Math.floor(degInSign / (30 / 45));
      let start = 0;
      if (modality === 0) start = 0;
      else if (modality === 1) start = 4;
      else if (modality === 2) start = 8;
      return (start + part) % 12;
    }

    case "D60": {
      // D60 Shashtiamsha (0.5 deg): starts from same sign
      const part = Math.floor(degInSign / 0.5);
      return (natalSign + part) % 12;
    }

    default:
      return natalSign;
  }
}

// Classical Dignity Definitions (BPHS)
const EXALTATION_SIGNS: Record<string, number> = {
  Sun: 0, // Aries
  Moon: 1, // Taurus
  Mars: 9, // Capricorn
  Mercury: 5, // Virgo
  Jupiter: 3, // Cancer
  Venus: 11, // Pisces
  Saturn: 6, // Libra
  Rahu: 1, // Taurus (also Gemini in some traditions)
  Ketu: 7, // Scorpio (also Sagittarius in some traditions)
};

const DEBILITATION_SIGNS: Record<string, number> = {
  Sun: 6, // Libra
  Moon: 7, // Scorpio
  Mars: 3, // Cancer
  Mercury: 11, // Pisces
  Jupiter: 9, // Capricorn
  Venus: 5, // Virgo
  Saturn: 0, // Aries
  Rahu: 7, // Scorpio
  Ketu: 1, // Taurus
};

const OWN_SIGNS: Record<string, number[]> = {
  Sun: [4], // Leo
  Moon: [3], // Cancer
  Mars: [0, 7], // Aries, Scorpio
  Mercury: [2, 5], // Gemini, Virgo
  Jupiter: [8, 11], // Sagittarius, Pisces
  Venus: [1, 6], // Taurus, Libra
  Saturn: [9, 10], // Capricorn, Aquarius
  Rahu: [10], // Aquarius
  Ketu: [7], // Scorpio
};

const MOOLATRIKONA_SIGNS: Record<string, number> = {
  Sun: 4, // Leo
  Moon: 1, // Taurus
  Mars: 0, // Aries
  Mercury: 5, // Virgo
  Jupiter: 8, // Sagittarius
  Venus: 6, // Libra
  Saturn: 10, // Aquarius
};

const NATURAL_FRIENDS: Record<string, { friends: string[]; enemies: string[] }> = {
  Sun: { friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"] },
  Moon: { friends: ["Sun", "Mercury"], enemies: [] },
  Mars: { friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"] },
  Mercury: { friends: ["Sun", "Venus"], enemies: ["Moon"] },
  Jupiter: { friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"] },
  Venus: { friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"] },
  Saturn: { friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"] },
  Rahu: { friends: ["Venus", "Saturn", "Mercury"], enemies: ["Sun", "Moon", "Mars"] },
  Ketu: { friends: ["Mars", "Venus", "Jupiter"], enemies: ["Sun", "Moon"] },
};

const SIGN_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

const COMBUSTION_ORBS: Record<string, { direct: number; retro: number }> = {
  Moon: { direct: 12, retro: 12 },
  Mars: { direct: 17, retro: 17 },
  Mercury: { direct: 14, retro: 12 },
  Jupiter: { direct: 11, retro: 11 },
  Venus: { direct: 10, retro: 8 },
  Saturn: { direct: 15, retro: 15 },
};

export function isPlanetCombust(
  planetId: string,
  planetLon: number,
  sunLon: number,
  isRetro: boolean = false
): boolean {
  const orbDef = COMBUSTION_ORBS[planetId];
  if (!orbDef) return false;
  const maxOrb = isRetro ? orbDef.retro : orbDef.direct;
  let diff = Math.abs(planetLon - sunLon) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff <= maxOrb;
}

export type PlanetaryDignityType =
  | "Exalted"
  | "Debilitated"
  | "Moolatrikona"
  | "Own Sign"
  | "Friend"
  | "Neutral"
  | "Enemy";

export function getVargaPlanetaryDignity(
  planetId: string,
  signIndex: number
): { dignity: PlanetaryDignityType; dignityHindi: string } {
  if (EXALTATION_SIGNS[planetId] === signIndex) {
    return { dignity: "Exalted", dignityHindi: "उच्च (Uchcha)" };
  }
  if (DEBILITATION_SIGNS[planetId] === signIndex) {
    return { dignity: "Debilitated", dignityHindi: "नीच (Neecha)" };
  }
  if (MOOLATRIKONA_SIGNS[planetId] === signIndex) {
    return { dignity: "Moolatrikona", dignityHindi: "मूलत्रिकोण" };
  }
  if (OWN_SIGNS[planetId]?.includes(signIndex)) {
    return { dignity: "Own Sign", dignityHindi: "स्वक्षेत्र (Own Sign)" };
  }

  const signLord = SIGN_LORDS[signIndex];
  if (!signLord || signLord === planetId) {
    return { dignity: "Own Sign", dignityHindi: "स्वक्षेत्र" };
  }

  const rel = NATURAL_FRIENDS[planetId];
  if (rel) {
    if (rel.friends.includes(signLord)) {
      return { dignity: "Friend", dignityHindi: "मित्र (Friend)" };
    }
    if (rel.enemies.includes(signLord)) {
      return { dignity: "Enemy", dignityHindi: "शत्रु (Enemy)" };
    }
  }

  return { dignity: "Neutral", dignityHindi: "सम (Neutral)" };
}

export interface EntityStatusBadge {
  label: string;
  hindiLabel?: string;
  type:
    | "exalted"
    | "debilitated"
    | "own"
    | "moolatrikona"
    | "vargottama"
    | "combust"
    | "retro"
    | "friend"
    | "enemy"
    | "neutral"
    | "upagraha";
}

export interface VargaEntityPosition {
  id: string;
  name: string;
  symbol: string;
  natalSignIndex: number;
  vargaSignIndex: number;
  vargaRashi: typeof RASHIS[0];
  house: number; // 1..12 from Varga Ascendant
  isVargottama: boolean; // Same sign in this Varga as D1 Rashi (only true when vargaId !== D1)
  isRetro?: boolean;
  isCombust?: boolean;
  isUpagraha?: boolean;
  dignity?: PlanetaryDignityType;
  dignityHindi?: string;
  statusBadges: EntityStatusBadge[];
  natalDegrees: number;
}

export interface VargaChartResult {
  varga: VargaMeta;
  ascendant: {
    natalSignIndex: number;
    vargaSignIndex: number;
    vargaRashi: typeof RASHIS[0];
  };
  entities: VargaEntityPosition[];
  houseOccupants: Record<number, VargaEntityPosition[]>;
  vargottamaPlanets: string[];
}

/**
 * Calculates complete Divisional Chart (Ascendant, Planets, Upagrahas, House Map, Dignities, Vargottama)
 */
export function calculateShodashavargaChart(
  ephemeris: EphemerisResult,
  vargaId: VargaId,
  showUpagrahas: boolean = true,
  showModernPlanets: boolean = false
): VargaChartResult {
  const meta = VARGA_DEFINITIONS[vargaId] || VARGA_DEFINITIONS.D1;

  // 1. Calculate Varga Ascendant
  const ascLon = ephemeris.ascendant.siderealLongitude;
  const ascNatalSign = Math.floor(ascLon / 30);
  const ascVargaSign = calculateVargaSign(ascLon, vargaId);

  // 2. Map all entities
  const entities: VargaEntityPosition[] = [];
  const vargottamaPlanets: string[] = [];
  const sunLon = ephemeris.planets.Sun?.siderealLongitude || 0;

  // Navagrahas & Planets
  Object.values(ephemeris.planets).forEach((p) => {
    if (!showModernPlanets && p.isModernPlanet) return;

    const natalSign = Math.floor(p.siderealLongitude / 30);
    const vargaSign = calculateVargaSign(p.siderealLongitude, vargaId);
    const house = ((vargaSign - ascVargaSign + 12) % 12) + 1;

    // Classical rule: Vargottama applies only in divisional charts (D2..D60, esp D9) when matching D1
    const isVargottama = vargaId !== "D1" && vargaSign === natalSign;
    const isCombust = p.id !== "Sun" && isPlanetCombust(p.id, p.siderealLongitude, sunLon, !!p.isRetrograde);
    const { dignity, dignityHindi } = getVargaPlanetaryDignity(p.id, vargaSign);

    if (isVargottama && !p.isModernPlanet && p.id !== "Rahu" && p.id !== "Ketu") {
      vargottamaPlanets.push(p.name);
    }

    const statusBadges: EntityStatusBadge[] = [];

    // Dignity badge
    if (dignity === "Exalted") {
      statusBadges.push({ label: "Exalted", hindiLabel: "उच्च", type: "exalted" });
    } else if (dignity === "Debilitated") {
      statusBadges.push({ label: "Debilitated", hindiLabel: "नीच", type: "debilitated" });
    } else if (dignity === "Moolatrikona") {
      statusBadges.push({ label: "Moolatrikona", hindiLabel: "मूलत्रिकोण", type: "moolatrikona" });
    } else if (dignity === "Own Sign") {
      statusBadges.push({ label: "Own Sign", hindiLabel: "स्वक्षेत्र", type: "own" });
    } else if (dignity === "Friend") {
      statusBadges.push({ label: "Friend", hindiLabel: "मित्र", type: "friend" });
    } else if (dignity === "Enemy") {
      statusBadges.push({ label: "Enemy", hindiLabel: "शत्रु", type: "enemy" });
    } else {
      statusBadges.push({ label: "Neutral", hindiLabel: "सम", type: "neutral" });
    }

    // Vargottama badge (only when in D2..D60 and in same sign as D1)
    if (isVargottama) {
      statusBadges.push({ label: "Vargottama", hindiLabel: "वर्गोत्तम", type: "vargottama" });
    }

    // Retrograde badge
    if (p.isRetrograde) {
      statusBadges.push({ label: "Retro", hindiLabel: "वक्री", type: "retro" });
    }

    // Combust badge
    if (isCombust) {
      statusBadges.push({ label: "Combust", hindiLabel: "अस्त", type: "combust" });
    }

    entities.push({
      id: p.id,
      name: p.name,
      symbol: p.symbol,
      natalSignIndex: natalSign,
      vargaSignIndex: vargaSign,
      vargaRashi: RASHIS[vargaSign],
      house,
      isVargottama,
      isRetro: p.isRetrograde,
      isCombust,
      dignity,
      dignityHindi,
      statusBadges,
      natalDegrees: p.siderealLongitude % 30,
    });
  });

  // Upagrahas
  if (showUpagrahas) {
    Object.values(ephemeris.upagrahas).forEach((u) => {
      const natalSign = Math.floor(u.siderealLongitude / 30);
      const vargaSign = calculateVargaSign(u.siderealLongitude, vargaId);
      const house = ((vargaSign - ascVargaSign + 12) % 12) + 1;
      const isVargottama = vargaId !== "D1" && vargaSign === natalSign;

      const statusBadges: EntityStatusBadge[] = [
        { label: "Upagraha", hindiLabel: "उपग्रह", type: "upagraha" },
      ];
      if (isVargottama) {
        statusBadges.push({ label: "Vargottama", hindiLabel: "वर्गोत्तम", type: "vargottama" });
      }

      entities.push({
        id: u.id,
        name: u.name,
        symbol: "✦",
        natalSignIndex: natalSign,
        vargaSignIndex: vargaSign,
        vargaRashi: RASHIS[vargaSign],
        house,
        isVargottama,
        isUpagraha: true,
        statusBadges,
        natalDegrees: u.siderealLongitude % 30,
      });
    });
  }

  // 3. Build House Occupants Map
  const houseOccupants: Record<number, VargaEntityPosition[]> = {};
  for (let h = 1; h <= 12; h++) {
    houseOccupants[h] = [];
  }
  entities.forEach((e) => {
    houseOccupants[e.house].push(e);
  });

  return {
    varga: meta,
    ascendant: {
      natalSignIndex: ascNatalSign,
      vargaSignIndex: ascVargaSign,
      vargaRashi: RASHIS[ascVargaSign],
    },
    entities,
    houseOccupants,
    vargottamaPlanets,
  };
}