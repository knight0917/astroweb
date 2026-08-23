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

export interface VargaEntityPosition {
  id: string;
  name: string;
  symbol: string;
  natalSignIndex: number;
  vargaSignIndex: number;
  vargaRashi: typeof RASHIS[0];
  house: number; // 1..12 from Varga Ascendant
  isVargottama: boolean; // Same sign in this Varga as D1 Rashi
  isRetro?: boolean;
  isUpagraha?: boolean;
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
 * Calculates complete Divisional Chart (Ascendant, Planets, Upagrahas, House Map, Vargottama)
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

  // Navagrahas & Planets
  Object.values(ephemeris.planets).forEach((p) => {
    if (!showModernPlanets && p.isModernPlanet) return;

    const natalSign = Math.floor(p.siderealLongitude / 30);
    const vargaSign = calculateVargaSign(p.siderealLongitude, vargaId);
    const house = ((vargaSign - ascVargaSign + 12) % 12) + 1;
    const isVargottama = vargaSign === natalSign;

    if (isVargottama && !p.isModernPlanet && p.id !== "Rahu" && p.id !== "Ketu") {
      vargottamaPlanets.push(p.name);
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
      natalDegrees: p.siderealLongitude % 30,
    });
  });

  // Upagrahas
  if (showUpagrahas) {
    Object.values(ephemeris.upagrahas).forEach((u) => {
      const natalSign = Math.floor(u.siderealLongitude / 30);
      const vargaSign = calculateVargaSign(u.siderealLongitude, vargaId);
      const house = ((vargaSign - ascVargaSign + 12) % 12) + 1;
      const isVargottama = vargaSign === natalSign;

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