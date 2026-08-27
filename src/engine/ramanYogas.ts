/**
 * Classical B.V. Raman 300 Important Combinations Calculation Engine
 */

import { EphemerisResult } from "./types";
import { calculateShadbala } from "./shadbala";

export type YogaCategory =
  | "Lunar & Solar"
  | "Pancha Mahapurusha"
  | "Raja Yoga & Eminence"
  | "Dhana & Prosperity"
  | "32 Nabhasa Yogas"
  | "Arishta & Challenging";

export interface RamanYoga {
  id: string;
  name: string;
  sanskritName: string;
  category: YogaCategory;
  ramanNumber?: number;
  participatingGrahas: string[];
  housesInvolved: number[];
  bhavasSignified: string[];
  potencyPercent: number;
  isCancelled: boolean;
  cancellationReason?: string;
  classicalDescription: string;
  practicalEffects: string;
  activationDashaLords: string[];
  isLifelong: boolean;
}

export interface RamanYogaAnalysisResult {
  totalFormed: number;
  activeCount: number;
  cancelledCount: number;
  yogas: RamanYoga[];
  yogasByCategory: Record<YogaCategory, RamanYoga[]>;
  highestPotencyYoga: RamanYoga | null;
  functionalRoles: Record<string, string>;
}

const SIGN_LORDS: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
  4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars",
  8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

const SIGN_MODALITY: Record<number, "Movable" | "Fixed" | "Dual"> = {
  0: "Movable", 1: "Fixed", 2: "Dual",
  3: "Movable", 4: "Fixed", 5: "Dual",
  6: "Movable", 7: "Fixed", 8: "Dual",
  9: "Movable", 10: "Fixed", 11: "Dual",
};

const DEBILITATION_SIGNS: Record<string, number> = {
  Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0,
};

const EXALTATION_SIGNS: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6,
};

const OWN_SIGNS: Record<string, number[]> = {
  Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5],
  Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
};

const NATURAL_BENEFICS = ["Jupiter", "Venus", "Mercury", "Moon"];
const NATURAL_MALEFICS = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"];

export function evaluateRamanYogas(ephemeris: EphemerisResult): RamanYogaAnalysisResult {
  const yogas: RamanYoga[] = [];
  const planets = ephemeris.planets;
  const ascLon = ephemeris.ascendant.siderealLongitude;
  const ascSign = Math.floor(ascLon / 30);

  let shadbalaRupas: Record<string, number> = {};
  let shadbalaRatio: Record<string, number> = {};
  try {
    const sb = calculateShadbala(ephemeris);
    Object.values(sb.planets).forEach((p) => {
      shadbalaRupas[p.name] = p.totalRupas;
      shadbalaRatio[p.name] = p.percentageEfficiency / 100;
    });
  } catch (_) {
    ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].forEach((p) => {
      shadbalaRupas[p] = 6.0;
      shadbalaRatio[p] = 1.0;
    });
  }

  const functionalRoles: Record<string, string> = {};
  const getHouseLord = (hNum: number): string => {
    const signIdx = (ascSign + hNum - 1) % 12;
    return SIGN_LORDS[signIdx];
  };

  const getPlanetHouse = (planetName: string): number => {
    const p = (planets as any)[planetName];
    if (!p) return 0;
    return p.house;
  };

  const getPlanetSign = (planetName: string): number => {
    const p = (planets as any)[planetName];
    if (!p) return -1;
    return Math.floor(p.siderealLongitude / 30);
  };

  const lordOfHouses: Record<string, number[]> = {};
  for (let h = 1; h <= 12; h++) {
    const l = getHouseLord(h);
    if (!lordOfHouses[l]) lordOfHouses[l] = [];
    lordOfHouses[l].push(h);
  }

  Object.keys(lordOfHouses).forEach((p) => {
    const hs = lordOfHouses[p];
    const isKendra = hs.some((h) => [1, 4, 7, 10].includes(h));
    const isTrikona = hs.some((h) => [5, 9].includes(h));
    const isDusthana = hs.some((h) => [6, 8, 12].includes(h));

    if (isKendra && isTrikona && hs.length >= 2) {
      functionalRoles[p] = "Yogakaraka (Lord of " + hs.join(" & ") + ")";
    } else if (isTrikona) {
      functionalRoles[p] = "Functional Benefic (Lord of " + hs.join(" & ") + ")";
    } else if (isDusthana && !isTrikona) {
      functionalRoles[p] = "Functional Malefic (Lord of " + hs.join(" & ") + ")";
    } else {
      functionalRoles[p] = "Neutral / Lord of " + hs.join(" & ");
    }
  });

  const calcPotency = (grahas: string[], basePotency = 75): number => {
    if (grahas.length === 0) return basePotency;
    let totalScore = 0;
    grahas.forEach((g) => {
      const p = (planets as any)[g];
      if (!p) {
        totalScore += 60;
        return;
      }
      let score = 50;
      const sign = getPlanetSign(g);
      const isExalted = EXALTATION_SIGNS[g] === sign;
      const isOwn = OWN_SIGNS[g]?.includes(sign);
      const isDebil = DEBILITATION_SIGNS[g] === sign;

      if (isExalted) score += 35;
      else if (isOwn) score += 25;
      else if (isDebil) score -= 30;

      const sbRatio = shadbalaRatio[g] || 1.0;
      score += Math.min(25, (sbRatio - 1.0) * 35);

      if (p.isCombust) score -= 20;
      if (p.isRetrograde) score += 10;

      totalScore += Math.max(15, Math.min(100, score));
    });
    return Math.round(totalScore / grahas.length);
  };

  const kendras = [1, 4, 7, 10];
  const trikonas = [1, 5, 9];
  const dusthanas = [6, 8, 12];
  const upachayas = [3, 6, 10, 11];

  const moonHouse = getPlanetHouse("Moon");
  const sunHouse = getPlanetHouse("Sun");
  const jupHouse = getPlanetHouse("Jupiter");
  const marsHouse = getPlanetHouse("Mars");
  const mercHouse = getPlanetHouse("Mercury");
  const venHouse = getPlanetHouse("Venus");
  const satHouse = getPlanetHouse("Saturn");

  // 1. GAJAKESARI YOGA
  const jupFromMoon = ((jupHouse - moonHouse + 12) % 12) + 1;
  if ([1, 4, 7, 10].includes(jupFromMoon)) {
    const isAfflicted = dusthanas.includes(jupHouse) && dusthanas.includes(moonHouse);
    yogas.push({
      id: "gajakesari",
      name: "Gajakesari Yoga",
      sanskritName: "गजकेसरी योग",
      category: "Lunar & Solar",
      ramanNumber: 1,
      participatingGrahas: ["Jupiter", "Moon"],
      housesInvolved: [moonHouse, jupHouse],
      bhavasSignified: ["Wisdom", "Status", "Honor", "Prosperity"],
      potencyPercent: calcPotency(["Jupiter", "Moon"], 85),
      isCancelled: isAfflicted,
      cancellationReason: isAfflicted ? "Both Moon and Jupiter occupy Dusthana houses (6/8/12)." : undefined,
      classicalDescription: "Jupiter in a quadrant (Kendra) from the Moon.",
      practicalEffects: "Endows high intelligence, unimpeachable character, lasting reputation, royal favor, and victory over adversaries.",
      activationDashaLords: ["Jupiter", "Moon"],
      isLifelong: false,
    });
  }

  // 2. SUNAPHA YOGA
  const moonSign = getPlanetSign("Moon");
  const sign2ndFromMoon = (moonSign + 1) % 12;
  const sunaphaPlanets = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"].filter(
    (p) => getPlanetSign(p) === sign2ndFromMoon
  );
  if (sunaphaPlanets.length > 0) {
    yogas.push({
      id: "sunapha",
      name: "Sunapha Yoga",
      sanskritName: "सुनफा योग",
      category: "Lunar & Solar",
      ramanNumber: 2,
      participatingGrahas: ["Moon", ...sunaphaPlanets],
      housesInvolved: [moonHouse, ((moonHouse % 12) + 1)],
      bhavasSignified: ["Self-earned wealth", "Enterprise", "Comforts"],
      potencyPercent: calcPotency(["Moon", ...sunaphaPlanets], 78),
      isCancelled: false,
      classicalDescription: "Planets other than Sun in the 2nd house from the Moon.",
      practicalEffects: "Self-made financial status, intellectual enterprise, landed property, and virtuous reputation.",
      activationDashaLords: ["Moon", ...sunaphaPlanets],
      isLifelong: false,
    });
  }

  // 3. ANAPHA YOGA
  const sign12thFromMoon = (moonSign + 11) % 12;
  const anaphaPlanets = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"].filter(
    (p) => getPlanetSign(p) === sign12thFromMoon
  );
  if (anaphaPlanets.length > 0) {
    yogas.push({
      id: "anapha",
      name: "Anapha Yoga",
      sanskritName: "अनफा योग",
      category: "Lunar & Solar",
      ramanNumber: 3,
      participatingGrahas: ["Moon", ...anaphaPlanets],
      housesInvolved: [moonHouse, (((moonHouse + 10) % 12) + 1)],
      bhavasSignified: ["Generosity", "Virtue", "Refinement", "Health"],
      potencyPercent: calcPotency(["Moon", ...anaphaPlanets], 75),
      isCancelled: false,
      classicalDescription: "Planets other than Sun in the 12th house from the Moon.",
      practicalEffects: "Well-formed body, generous disposition, high self-respect, polite manners, and spiritual inclination.",
      activationDashaLords: ["Moon", ...anaphaPlanets],
      isLifelong: false,
    });
  }

  // 4. DHURDHURA YOGA
  if (sunaphaPlanets.length > 0 && anaphaPlanets.length > 0) {
    yogas.push({
      id: "dhurdhura",
      name: "Dhurdhura Yoga",
      sanskritName: "धुरधुरा योग",
      category: "Lunar & Solar",
      ramanNumber: 4,
      participatingGrahas: ["Moon", ...sunaphaPlanets, ...anaphaPlanets],
      housesInvolved: [moonHouse],
      bhavasSignified: ["Abundance", "Vehicles", "Command", "Generosity"],
      potencyPercent: calcPotency(["Moon", ...sunaphaPlanets, ...anaphaPlanets], 88),
      isCancelled: false,
      classicalDescription: "Planets situated on both sides (2nd and 12th) of the Moon.",
      practicalEffects: "Unfailing power, boundless generosity, abundant wealth, continuous conveyance, and faithful attendants.",
      activationDashaLords: ["Moon", ...sunaphaPlanets, ...anaphaPlanets],
      isLifelong: true,
    });
  }

  // 5. KEMADRUMA YOGA & BHANGA
  if (sunaphaPlanets.length === 0 && anaphaPlanets.length === 0) {
    const planetsInMoonKendra = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"].filter((p) => {
      const hFromMoon = ((getPlanetHouse(p) - moonHouse + 12) % 12) + 1;
      return [1, 4, 7, 10].includes(hFromMoon);
    });
    const planetsInLagnaKendra = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"].filter((p) => {
      return [1, 4, 7, 10].includes(getPlanetHouse(p));
    });

    const isKemadrumaCancelled = planetsInMoonKendra.length > 0 || planetsInLagnaKendra.length > 0;

    yogas.push({
      id: "kemadruma",
      name: isKemadrumaCancelled ? "Kemadruma Yoga (Cancelled / Kemadruma Bhanga)" : "Kemadruma Yoga",
      sanskritName: "केमद्रुम योग (भङ्ग सहित)",
      category: "Lunar & Solar",
      ramanNumber: 5,
      participatingGrahas: ["Moon"],
      housesInvolved: [moonHouse],
      bhavasSignified: ["Emotional depth", "Self-reliance", "Spiritual growth"],
      potencyPercent: isKemadrumaCancelled ? 25 : 70,
      isCancelled: isKemadrumaCancelled,
      cancellationReason: isKemadrumaCancelled
        ? "Kemadruma Bhanga: Benefic planets (" + [...planetsInMoonKendra, ...planetsInLagnaKendra].join(", ") + ") occupy Kendras from Lagna/Moon."
        : undefined,
      classicalDescription: "No planets in the 2nd and 12th from the Moon.",
      practicalEffects: isKemadrumaCancelled
        ? "Early life struggles convert into profound self-reliance, philosophical wisdom, and late-life stability."
        : "Periods of emotional solitude, financial fluctuation, requiring patience during Moon sub-periods.",
      activationDashaLords: ["Moon"],
      isLifelong: true,
    });
  }

  // 6. CHANDRA-MANGALA YOGA
  if (moonHouse === marsHouse && moonHouse > 0) {
    yogas.push({
      id: "chandra_mangala",
      name: "Chandra-Mangala Yoga",
      sanskritName: "चन्द्र-मङ्गल योग",
      category: "Lunar & Solar",
      ramanNumber: 6,
      participatingGrahas: ["Moon", "Mars"],
      housesInvolved: [moonHouse],
      bhavasSignified: ["Commercial enterprise", "Material wealth", "Real estate"],
      potencyPercent: calcPotency(["Moon", "Mars"], 80),
      isCancelled: false,
      classicalDescription: "Conjunction of the Moon and Mars.",
      practicalEffects: "Great commercial acumen, earnings through property/trade, energetic drive, and wealth accumulation.",
      activationDashaLords: ["Moon", "Mars"],
      isLifelong: false,
    });
  }

  // 7. ADHI YOGA
  const beneficsIn678Moon = ["Mercury", "Jupiter", "Venus"].filter((p) => {
    const hFromMoon = ((getPlanetHouse(p) - moonHouse + 12) % 12) + 1;
    return [6, 7, 8].includes(hFromMoon);
  });
  if (beneficsIn678Moon.length >= 2) {
    yogas.push({
      id: "adhi_yoga",
      name: "Chandradhi Yoga (Adhi Yoga)",
      sanskritName: "अधि योग (चन्द्राधि)",
      category: "Lunar & Solar",
      ramanNumber: 7,
      participatingGrahas: ["Moon", ...beneficsIn678Moon],
      housesInvolved: [moonHouse, ...beneficsIn678Moon.map((p) => getPlanetHouse(p))],
      bhavasSignified: ["Leadership", "Authority", "Longevity", "Victory"],
      potencyPercent: calcPotency(["Moon", ...beneficsIn678Moon], 90),
      isCancelled: false,
      classicalDescription: "Natural benefics (Mercury, Jupiter, Venus) in 6th, 7th, and 8th from Moon.",
      practicalEffects: "High administrative status, triumphs over opponents, prosperity, robust vitality, and longevity.",
      activationDashaLords: ["Moon", ...beneficsIn678Moon],
      isLifelong: true,
    });
  }

  // 8. SAKATA YOGA
  if ([6, 8, 12].includes(jupFromMoon)) {
    const isSakataCancelled = kendras.includes(moonHouse);
    yogas.push({
      id: "sakata",
      name: isSakataCancelled ? "Sakata Yoga (Cancelled by Moon in Kendra)" : "Sakata Yoga",
      sanskritName: "शकट योग",
      category: "Lunar & Solar",
      ramanNumber: 12,
      participatingGrahas: ["Jupiter", "Moon"],
      housesInvolved: [moonHouse, jupHouse],
      bhavasSignified: ["Fortune cycles", "Resilience"],
      potencyPercent: isSakataCancelled ? 20 : 65,
      isCancelled: isSakataCancelled,
      cancellationReason: isSakataCancelled ? "Moon occupies a Kendra from Lagna (B.V. Raman Rule #12 exception)." : undefined,
      classicalDescription: "The Moon in 6th, 8th, or 12th house from Jupiter.",
      practicalEffects: isSakataCancelled
        ? "Cycles of temporary setbacks followed by complete restoration of prestige and wealth."
        : "Wheel-like fluctuations of fortune, requiring patience during Jupiter/Moon sub-periods.",
      activationDashaLords: ["Jupiter", "Moon"],
      isLifelong: false,
    });
  }

  // 9. AMALA YOGA
  const beneficsIn10th = ["Jupiter", "Venus", "Mercury"].filter((p) => {
    const hLagna = getPlanetHouse(p);
    const hMoon = ((hLagna - moonHouse + 12) % 12) + 1;
    return hLagna === 10 || hMoon === 10;
  });
  if (beneficsIn10th.length > 0) {
    yogas.push({
      id: "amala",
      name: "Amala Yoga",
      sanskritName: "अमल योग",
      category: "Lunar & Solar",
      ramanNumber: 13,
      participatingGrahas: beneficsIn10th,
      housesInvolved: [10],
      bhavasSignified: ["Spotless career", "Integrity", "Fame"],
      potencyPercent: calcPotency(beneficsIn10th, 85),
      isCancelled: false,
      classicalDescription: "A natural benefic planet occupies the 10th house from Lagna or Moon.",
      practicalEffects: "Spotless reputation, professional integrity, philanthropic nature, honored by institutions.",
      activationDashaLords: beneficsIn10th,
      isLifelong: true,
    });
  }

  // 10. SOLAR YOGAS
  const sunSign = getPlanetSign("Sun");
  const sign2ndFromSun = (sunSign + 1) % 12;
  const sign12thFromSun = (sunSign + 11) % 12;
  const vesiPlanets = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"].filter((p) => getPlanetSign(p) === sign2ndFromSun);
  const vasiPlanets = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"].filter((p) => getPlanetSign(p) === sign12thFromSun);

  if (vesiPlanets.length > 0 && vasiPlanets.length > 0) {
    yogas.push({
      id: "obhayachari",
      name: "Obhayachari Yoga",
      sanskritName: "उभयचारी योग",
      category: "Lunar & Solar",
      ramanNumber: 18,
      participatingGrahas: ["Sun", ...vesiPlanets, ...vasiPlanets],
      housesInvolved: [sunHouse],
      bhavasSignified: ["Eloquent speech", "Leadership", "Renown"],
      potencyPercent: calcPotency(["Sun", ...vesiPlanets, ...vasiPlanets], 85),
      isCancelled: false,
      classicalDescription: "Planets other than Moon occupy both the 2nd and 12th from the Sun.",
      practicalEffects: "Eloquent speaker, proportionate physique, delight in company, broad fame, and steady administrative power.",
      activationDashaLords: ["Sun", ...vesiPlanets, ...vasiPlanets],
      isLifelong: true,
    });
  } else if (vesiPlanets.length > 0) {
    yogas.push({
      id: "vesi",
      name: "Vesi Yoga",
      sanskritName: "वेशि योग",
      category: "Lunar & Solar",
      ramanNumber: 16,
      participatingGrahas: ["Sun", ...vesiPlanets],
      housesInvolved: [sunHouse],
      bhavasSignified: ["Steadiness", "Truthfulness", "Wealth"],
      potencyPercent: calcPotency(["Sun", ...vesiPlanets], 75),
      isCancelled: false,
      classicalDescription: "Planets other than Moon in the 2nd house from the Sun.",
      practicalEffects: "Fortunate, truthful, courageous, and steady in pursuits.",
      activationDashaLords: ["Sun", ...vesiPlanets],
      isLifelong: true,
    });
  } else if (vasiPlanets.length > 0) {
    yogas.push({
      id: "vasi",
      name: "Vasi Yoga",
      sanskritName: "वाशि योग",
      category: "Lunar & Solar",
      ramanNumber: 17,
      participatingGrahas: ["Sun", ...vasiPlanets],
      housesInvolved: [sunHouse],
      bhavasSignified: ["Memory", "Learning", "Prosperity"],
      potencyPercent: calcPotency(["Sun", ...vasiPlanets], 75),
      isCancelled: false,
      classicalDescription: "Planets other than Moon in the 12th house from the Sun.",
      practicalEffects: "Sharp memory, physical vitality, philosophical outlook, and respected by superiors.",
      activationDashaLords: ["Sun", ...vasiPlanets],
      isLifelong: true,
    });
  }

  // 11. PANCHA MAHAPURUSHA YOGAS
  const marsSign = getPlanetSign("Mars");
  if (kendras.includes(marsHouse) && [0, 7, 9].includes(marsSign)) {
    yogas.push({
      id: "ruchaka",
      name: "Ruchaka Mahapurusha Yoga",
      sanskritName: "रुचक महापुरुष योग",
      category: "Pancha Mahapurusha",
      ramanNumber: 22,
      participatingGrahas: ["Mars"],
      housesInvolved: [marsHouse],
      bhavasSignified: ["Valor", "Executive authority", "Victory", "Land"],
      potencyPercent: calcPotency(["Mars"], 92),
      isCancelled: false,
      classicalDescription: "Mars in own or exaltation sign (Aries, Scorpio, Capricorn) in a Kendra house.",
      practicalEffects: "Extraordinary courage, executive leadership, stamina, land acquisitions, and glorious success.",
      activationDashaLords: ["Mars"],
      isLifelong: true,
    });
  }

  const mercSign = getPlanetSign("Mercury");
  if (kendras.includes(mercHouse) && [2, 5].includes(mercSign)) {
    yogas.push({
      id: "bhadra",
      name: "Bhadra Mahapurusha Yoga",
      sanskritName: "भद्र महापुरुष योग",
      category: "Pancha Mahapurusha",
      ramanNumber: 23,
      participatingGrahas: ["Mercury"],
      housesInvolved: [mercHouse],
      bhavasSignified: ["Genius intellect", "Commerce", "Scholarship"],
      potencyPercent: calcPotency(["Mercury"], 90),
      isCancelled: false,
      classicalDescription: "Mercury in own or exaltation sign (Gemini, Virgo) in a Kendra house.",
      practicalEffects: "Brilliant analytical intellect, mastery in commerce, mathematical acuity, and respected scholarship.",
      activationDashaLords: ["Mercury"],
      isLifelong: true,
    });
  }

  const jupSign = getPlanetSign("Jupiter");
  if (kendras.includes(jupHouse) && [3, 8, 11].includes(jupSign)) {
    yogas.push({
      id: "hamsa",
      name: "Hamsa Mahapurusha Yoga",
      sanskritName: "हंस महापुरुष योग",
      category: "Pancha Mahapurusha",
      ramanNumber: 19,
      participatingGrahas: ["Jupiter"],
      housesInvolved: [jupHouse],
      bhavasSignified: ["Wisdom", "Righteousness", "Spiritual eminence"],
      potencyPercent: calcPotency(["Jupiter"], 95),
      isCancelled: false,
      classicalDescription: "Jupiter in own or exaltation sign (Cancer, Sagittarius, Pisces) in a Kendra house.",
      practicalEffects: "High spiritual stature, unshakeable virtue, revered by institutions, and deep philosophical knowledge.",
      activationDashaLords: ["Jupiter"],
      isLifelong: true,
    });
  }

  const venSign = getPlanetSign("Venus");
  if (kendras.includes(venHouse) && [1, 6, 11].includes(venSign)) {
    yogas.push({
      id: "malavya",
      name: "Malavya Mahapurusha Yoga",
      sanskritName: "मालव्य महापुरुष योग",
      category: "Pancha Mahapurusha",
      ramanNumber: 20,
      participatingGrahas: ["Venus"],
      housesInvolved: [venHouse],
      bhavasSignified: ["Artistic brilliance", "Luxury", "Charisma"],
      potencyPercent: calcPotency(["Venus"], 92),
      isCancelled: false,
      classicalDescription: "Venus in own or exaltation sign (Taurus, Libra, Pisces) in a Kendra house.",
      practicalEffects: "Refined aesthetic brilliance, luxurious lifestyle, magnetic charm, prosperous marriage, and conveyances.",
      activationDashaLords: ["Venus"],
      isLifelong: true,
    });
  }

  const satSign = getPlanetSign("Saturn");
  if (kendras.includes(satHouse) && [6, 9, 10].includes(satSign)) {
    yogas.push({
      id: "sasa",
      name: "Sasa Mahapurusha Yoga",
      sanskritName: "शश महापुरुष योग",
      category: "Pancha Mahapurusha",
      ramanNumber: 21,
      participatingGrahas: ["Saturn"],
      housesInvolved: [satHouse],
      bhavasSignified: ["Endurance", "Command over masses", "Resilience"],
      potencyPercent: calcPotency(["Saturn"], 88),
      isCancelled: false,
      classicalDescription: "Saturn in own or exaltation sign (Libra, Capricorn, Aquarius) in a Kendra house.",
      practicalEffects: "Command over organizations, profound resilience, lasting legacy, and disciplined mastery.",
      activationDashaLords: ["Saturn"],
      isLifelong: true,
    });
  }

  // 12. RAJAYOGAS & NEECHABHANGA
  if (sunHouse === mercHouse && sunHouse > 0) {
    const sunPos = planets.Sun?.siderealLongitude || 0;
    const mercPos = planets.Mercury?.siderealLongitude || 0;
    const diff = Math.abs(sunPos - mercPos);
    const isCombustTight = diff < 3.0;

    yogas.push({
      id: "budhaditya",
      name: "Budhaditya Yoga",
      sanskritName: "बुधादित्य योग",
      category: "Raja Yoga & Eminence",
      ramanNumber: 24,
      participatingGrahas: ["Sun", "Mercury"],
      housesInvolved: [sunHouse],
      bhavasSignified: ["Sharp intellect", "Administrative skill", "Honor"],
      potencyPercent: calcPotency(["Sun", "Mercury"], isCombustTight ? 60 : 85),
      isCancelled: isCombustTight,
      cancellationReason: isCombustTight ? "Mercury is deeply combust within 3° of Sun." : undefined,
      classicalDescription: "Conjunction of the Sun and Mercury.",
      practicalEffects: "Quick intellect, high reputation, administrative skill, scholarly knowledge, and executive respect.",
      activationDashaLords: ["Sun", "Mercury"],
      isLifelong: false,
    });
  }

  const lord9 = getHouseLord(9);
  const lord10 = getHouseLord(10);
  const hLord9 = getPlanetHouse(lord9);
  const hLord10 = getPlanetHouse(lord10);

  if ((hLord9 === hLord10 && hLord9 > 0) || (hLord9 === 10 && hLord10 === 9)) {
    yogas.push({
      id: "dharma_karmadhipati",
      name: "Dharma-Karmadhipati Raja Yoga",
      sanskritName: "धर्म-कर्माधिपति राजयोग",
      category: "Raja Yoga & Eminence",
      participatingGrahas: [lord9, lord10],
      housesInvolved: [hLord9, hLord10],
      bhavasSignified: ["Supreme prestige", "Ethical leadership", "Career pinnacle"],
      potencyPercent: calcPotency([lord9, lord10], 95),
      isCancelled: false,
      classicalDescription: "Lords of the 9th (Dharma) and 10th (Karma) in conjunction or mutual reception.",
      practicalEffects: "One of the highest Vedic Rajayogas. Grants authority, ethical governance, immense societal contribution, and honor.",
      activationDashaLords: [lord9, lord10],
      isLifelong: false,
    });
  }

  const lord6 = getHouseLord(6);
  const lord8 = getHouseLord(8);
  const lord12 = getHouseLord(12);

  const hLord6 = getPlanetHouse(lord6);
  const hLord8 = getPlanetHouse(lord8);
  const hLord12 = getPlanetHouse(lord12);

  if (dusthanas.includes(hLord6) && hLord6 > 0) {
    yogas.push({
      id: "harsha_yoga",
      name: "Harsha Vipareeta Raja Yoga",
      sanskritName: "हर्ष विपरीत राजयोग",
      category: "Raja Yoga & Eminence",
      participatingGrahas: [lord6],
      housesInvolved: [hLord6],
      bhavasSignified: ["Victory over enemies", "Immunity", "Turnaround"],
      potencyPercent: calcPotency([lord6], 82),
      isCancelled: false,
      classicalDescription: "6th lord posited in the 6th, 8th, or 12th house.",
      practicalEffects: "Invincible against adversaries, overcoming sickness, gains through competitors, and turnaround in adversity.",
      activationDashaLords: [lord6],
      isLifelong: false,
    });
  }

  if (dusthanas.includes(hLord8) && hLord8 > 0) {
    yogas.push({
      id: "sarala_yoga",
      name: "Sarala Vipareeta Raja Yoga",
      sanskritName: "सरल विपरीत राजयोग",
      category: "Raja Yoga & Eminence",
      participatingGrahas: [lord8],
      housesInvolved: [hLord8],
      bhavasSignified: ["Fearlessness", "Sudden windfalls", "Longevity"],
      potencyPercent: calcPotency([lord8], 82),
      isCancelled: false,
      classicalDescription: "8th lord posited in the 6th, 8th, or 12th house.",
      practicalEffects: "Long life, resolute courage, success in difficult enterprises, sudden unearned wealth, and fearlessness.",
      activationDashaLords: [lord8],
      isLifelong: false,
    });
  }

  if (dusthanas.includes(hLord12) && hLord12 > 0) {
    yogas.push({
      id: "vimala_yoga",
      name: "Vimala Vipareeta Raja Yoga",
      sanskritName: "विमल विपरीत राजयोग",
      category: "Raja Yoga & Eminence",
      participatingGrahas: [lord12],
      housesInvolved: [hLord12],
      bhavasSignified: ["Prudent savings", "Independence", "Foreign victory"],
      potencyPercent: calcPotency([lord12], 80),
      isCancelled: false,
      classicalDescription: "12th lord posited in the 6th, 8th, or 12th house.",
      practicalEffects: "Prudent financial accumulation, independent life, spiritual contentment, and gains in foreign lands.",
      activationDashaLords: [lord12],
      isLifelong: false,
    });
  }

  Object.keys(DEBILITATION_SIGNS).forEach((graha) => {
    const debSign = DEBILITATION_SIGNS[graha];
    if (getPlanetSign(graha) === debSign) {
      const debLord = SIGN_LORDS[debSign];
      const hDebLord = getPlanetHouse(debLord);
      const isDebLordKendra = kendras.includes(hDebLord) || [1, 4, 7, 10].includes(((hDebLord - moonHouse + 12) % 12) + 1);

      const exaltGraha = Object.keys(EXALTATION_SIGNS).find((k) => EXALTATION_SIGNS[k] === debSign);
      const hExaltGraha = exaltGraha ? getPlanetHouse(exaltGraha) : 0;
      const isExaltGrahaKendra = kendras.includes(hExaltGraha);
      const isConjunctExalted = hExaltGraha === getPlanetHouse(graha) && hExaltGraha > 0;

      if (isDebLordKendra || isExaltGrahaKendra || isConjunctExalted) {
        yogas.push({
          id: "neechabhanga_" + graha.toLowerCase(),
          name: "Neechabhanga Raja Yoga (" + graha + ")",
          sanskritName: "नीचभङ्ग राजयोग (" + graha + ")",
          category: "Raja Yoga & Eminence",
          participatingGrahas: [graha, debLord, ...(exaltGraha ? [exaltGraha] : [])],
          housesInvolved: [getPlanetHouse(graha), hDebLord],
          bhavasSignified: ["Rise from humble beginnings", "Pinnacle achievement"],
          potencyPercent: calcPotency([graha, debLord], 88),
          isCancelled: false,
          classicalDescription: "Debilitation of " + graha + " cancelled by disposal or conjunction with exaltation lords.",
          practicalEffects: "Rise from initial adversity or humble background to achieve supreme eminence, wealth, and authority.",
          activationDashaLords: [graha, debLord],
          isLifelong: false,
        });
      }
    }
  });

  // 13. DHANA & LAKSHMI YOGAS
  const lord1 = getHouseLord(1);
  const hLord1 = getPlanetHouse(lord1);
  if ([...kendras, ...trikonas].includes(hLord9) && [...kendras, ...trikonas].includes(hLord1)) {
    yogas.push({
      id: "lakshmi_yoga",
      name: "Lakshmi Yoga",
      sanskritName: "लक्ष्मी योग",
      category: "Dhana & Prosperity",
      ramanNumber: 27,
      participatingGrahas: [lord1, lord9],
      housesInvolved: [hLord1, hLord9],
      bhavasSignified: ["Abundant wealth", "Grace", "Nobility"],
      potencyPercent: calcPotency([lord1, lord9], 90),
      isCancelled: false,
      classicalDescription: "Lord of the 9th and Lagnesha situated in Kendras or Trikonas with strength.",
      practicalEffects: "High financial prosperity, noble character, blessed with auspicious opportunities, and enjoying life comforts.",
      activationDashaLords: [lord1, lord9],
      isLifelong: false,
    });
  }

  const beneficsInUpachaya = ["Jupiter", "Venus", "Mercury"].filter((p) => {
    const hLagna = getPlanetHouse(p);
    const hMoon = ((hLagna - moonHouse + 12) % 12) + 1;
    return upachayas.includes(hLagna) || upachayas.includes(hMoon);
  });
  if (beneficsInUpachaya.length >= 2) {
    yogas.push({
      id: "vasumathi_yoga",
      name: "Vasumathi Yoga",
      sanskritName: "वसुमति योग",
      category: "Dhana & Prosperity",
      ramanNumber: 9,
      participatingGrahas: beneficsInUpachaya,
      housesInvolved: beneficsInUpachaya.map((p) => getPlanetHouse(p)),
      bhavasSignified: ["Independent wealth", "Treasury", "Self-reliance"],
      potencyPercent: calcPotency(beneficsInUpachaya, 85),
      isCancelled: false,
      classicalDescription: "Benefics occupy Upachaya houses (3, 6, 10, 11) from Lagna or Moon.",
      practicalEffects: "Immense independent wealth, frees native from subservience, endows financial self-sufficiency.",
      activationDashaLords: beneficsInUpachaya,
      isLifelong: false,
    });
  }

  const lord2 = getHouseLord(2);
  const lord11 = getHouseLord(11);
  const hLord2 = getPlanetHouse(lord2);
  const hLord11 = getPlanetHouse(lord11);

  if ((hLord2 === hLord11 && hLord2 > 0) || (hLord2 === 11 && hLord11 === 2) || (kendras.includes(hLord2) && kendras.includes(hLord11))) {
    yogas.push({
      id: "dhana_yoga",
      name: "Maha Dhana Yoga",
      sanskritName: "महाधन योग",
      category: "Dhana & Prosperity",
      participatingGrahas: [lord2, lord11],
      housesInvolved: [hLord2, hLord11],
      bhavasSignified: ["Continuous income", "Multi-source wealth", "Savings"],
      potencyPercent: calcPotency([lord2, lord11], 88),
      isCancelled: false,
      classicalDescription: "Strong mutual connection between 2nd (Dhana) and 11th (Labha) lords.",
      practicalEffects: "Continuous flow of income, great ability to multiply investments, and high material stability.",
      activationDashaLords: [lord2, lord11],
      isLifelong: false,
    });
  }

  // 14. 32 NABHASA YOGAS
  const physicalPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const modalities = physicalPlanets.map((p) => {
    const s = getPlanetSign(p);
    return SIGN_MODALITY[s];
  });

  const allMovable = modalities.every((m) => m === "Movable");
  const allFixed = modalities.every((m) => m === "Fixed");
  const allDual = modalities.every((m) => m === "Dual");

  if (allMovable) {
    yogas.push({
      id: "rajju_yoga",
      name: "Rajju Nabhasa Yoga",
      sanskritName: "रज्जु योग",
      category: "32 Nabhasa Yogas",
      ramanNumber: 71,
      participatingGrahas: physicalPlanets,
      housesInvolved: physicalPlanets.map((p) => getPlanetHouse(p)),
      bhavasSignified: ["Mobility", "Foreign travels", "Adaptability"],
      potencyPercent: 75,
      isCancelled: false,
      classicalDescription: "All seven physical planets situated exclusively in Movable (Chara) signs.",
      practicalEffects: "Fond of travel, seeks fortunes in distant/foreign lands, dynamic, quick-acting, and adaptable.",
      activationDashaLords: physicalPlanets,
      isLifelong: true,
    });
  } else if (allFixed) {
    yogas.push({
      id: "musala_yoga",
      name: "Musala Nabhasa Yoga",
      sanskritName: "मुसल योग",
      category: "32 Nabhasa Yogas",
      ramanNumber: 72,
      participatingGrahas: physicalPlanets,
      housesInvolved: physicalPlanets.map((p) => getPlanetHouse(p)),
      bhavasSignified: ["Stability", "Unshakable honor", "Rootedness"],
      potencyPercent: 80,
      isCancelled: false,
      classicalDescription: "All seven physical planets situated exclusively in Fixed (Sthira) signs.",
      practicalEffects: "Firm, unwavering determination, respected for steadfastness, accumulates lasting assets and family honor.",
      activationDashaLords: physicalPlanets,
      isLifelong: true,
    });
  } else if (allDual) {
    yogas.push({
      id: "nala_yoga",
      name: "Nala Nabhasa Yoga",
      sanskritName: "नल योग",
      category: "32 Nabhasa Yogas",
      ramanNumber: 73,
      participatingGrahas: physicalPlanets,
      housesInvolved: physicalPlanets.map((p) => getPlanetHouse(p)),
      bhavasSignified: ["Intellectual versatility", "Diplomacy"],
      potencyPercent: 75,
      isCancelled: false,
      classicalDescription: "All seven physical planets situated exclusively in Dual (Dwisvabhava) signs.",
      practicalEffects: "Versatile intellect, skilled in multiple crafts, diplomatic, philosophical, and adaptable.",
      activationDashaLords: physicalPlanets,
      isLifelong: true,
    });
  }

  const kendraOccupants = physicalPlanets.filter((p) => kendras.includes(getPlanetHouse(p)));
  if (kendraOccupants.length >= 3) {
    const isAllBeneficsInKendra = kendraOccupants.every((p) => NATURAL_BENEFICS.includes(p));
    const isAllMaleficsInKendra = kendraOccupants.every((p) => NATURAL_MALEFICS.includes(p));

    if (isAllBeneficsInKendra) {
      yogas.push({
        id: "mala_yoga",
        name: "Mala (Srik) Dala Yoga",
        sanskritName: "माला (स्रक्) योग",
        category: "32 Nabhasa Yogas",
        ramanNumber: 74,
        participatingGrahas: kendraOccupants,
        housesInvolved: kendraOccupants.map((p) => getPlanetHouse(p)),
        bhavasSignified: ["Splendor", "Everlasting joy", "Luxury"],
        potencyPercent: 90,
        isCancelled: false,
        classicalDescription: "Kendras occupied exclusively by natural benefic planets.",
        practicalEffects: "Continuous enjoyment of luxuries, beloved by all, surrounded by loving family, vehicles, and peace.",
        activationDashaLords: kendraOccupants,
        isLifelong: true,
      });
    } else if (isAllMaleficsInKendra) {
      yogas.push({
        id: "sarpa_yoga",
        name: "Sarpa Dala Yoga",
        sanskritName: "सर्प योग",
        category: "32 Nabhasa Yogas",
        ramanNumber: 75,
        participatingGrahas: kendraOccupants,
        housesInvolved: kendraOccupants.map((p) => getPlanetHouse(p)),
        bhavasSignified: ["Struggle", "Toughness", "Hard lessons"],
        potencyPercent: 65,
        isCancelled: false,
        classicalDescription: "Kendras occupied exclusively by natural malefic planets without benefic presence.",
        practicalEffects: "Hard-won battles, requires unyielding resilience and self-reliance against life obstacles.",
        activationDashaLords: kendraOccupants,
        isLifelong: true,
      });
    }
  }

  const occupiedHouses = new Set(physicalPlanets.map((p) => getPlanetHouse(p)));
  const numHouses = occupiedHouses.size;

  const SANKHYA_MAP: Record<number, { name: string; sanskrit: string; ramanNo: number; desc: string }> = {
    7: { name: "Vallaki (Veena) Yoga", sanskrit: "वल्लकी (वीणा) योग", ramanNo: 96, desc: "Musical/artistic brilliance, intellectual curiosity, loved by friends." },
    6: { name: "Dama Yoga", sanskrit: "दाम योग", ramanNo: 97, desc: "Philanthropic, generous, wealthy, helping many dependents." },
    5: { name: "Pasa Yoga", sanskrit: "पाश योग", ramanNo: 98, desc: "Skilled in organizing, surrounded by large circle of associates and relatives." },
    4: { name: "Kedara Yoga", sanskrit: "केदार योग", ramanNo: 99, desc: "Agricultural/real estate focus, truthful, steady, and productive." },
    3: { name: "Sula Yoga", sanskrit: "शूल योग", ramanNo: 100, desc: "Sharp, courageous in combat/business, resolute temperament." },
    2: { name: "Yuga Yoga", sanskrit: "युग योग", ramanNo: 101, desc: "Distinct unconventional path, deep focused intensity." },
    1: { name: "Gola Yoga", sanskrit: "गोल योग", ramanNo: 102, desc: "Hyper-concentrated planetary power in a single house." },
  };

  if (SANKHYA_MAP[numHouses]) {
    const meta = SANKHYA_MAP[numHouses];
    yogas.push({
      id: "sankhya_" + numHouses,
      name: meta.name + " (Sankhya)",
      sanskritName: meta.sanskrit,
      category: "32 Nabhasa Yogas",
      ramanNumber: meta.ramanNo,
      participatingGrahas: physicalPlanets,
      housesInvolved: Array.from(occupiedHouses),
      bhavasSignified: ["Spatial distribution", "Lifelong archetype"],
      potencyPercent: 75,
      isCancelled: false,
      classicalDescription: "All 7 physical planets occupy exactly " + numHouses + " houses.",
      practicalEffects: meta.desc,
      activationDashaLords: physicalPlanets,
      isLifelong: true,
    });
  }

  // 15. ARISHTA & CHALLENGING YOGAS
  if (dusthanas.includes(hLord10) && hLord10 > 0) {
    const isCancelled = [...kendras, ...trikonas].includes(hLord1);
    yogas.push({
      id: "duryoga",
      name: isCancelled ? "Duryoga (Mitigated by Strong Lagnesha)" : "Duryoga",
      sanskritName: "दुर्यॊग",
      category: "Arishta & Challenging",
      ramanNumber: 103,
      participatingGrahas: [lord10],
      housesInvolved: [hLord10],
      bhavasSignified: ["Career hurdles", "Effort-reward disparity"],
      potencyPercent: isCancelled ? 25 : 60,
      isCancelled: isCancelled,
      cancellationReason: isCancelled ? "Strong Lagnesha in Kendra/Trikona shields against career downfall." : undefined,
      classicalDescription: "10th lord posited in a Dusthana (6th, 8th, or 12th house).",
      practicalEffects: isCancelled
        ? "Early career instability converts to unconventional success through persistent dedication."
        : "Requires careful professional choices, avoid quick shortcuts, and maintain integrity in business.",
      activationDashaLords: [lord10],
      isLifelong: false,
    });
  }

  if (dusthanas.includes(hLord11) && hLord11 > 0) {
    const isCancelled = [1, 2, 9].includes(hLord2);
    yogas.push({
      id: "daridra_yoga",
      name: isCancelled ? "Daridra Yoga (Cancelled by Strong Dhana Lord)" : "Daridra Yoga",
      sanskritName: "दरिद्र योग",
      category: "Arishta & Challenging",
      ramanNumber: 104,
      participatingGrahas: [lord11],
      housesInvolved: [hLord11],
      bhavasSignified: ["Financial leaks", "Debt management"],
      potencyPercent: isCancelled ? 20 : 60,
      isCancelled: isCancelled,
      cancellationReason: isCancelled ? "2nd lord placed in an auspicious house preserves wealth accumulation." : undefined,
      classicalDescription: "11th lord (Lord of gains) situated in 6th, 8th, or 12th house.",
      practicalEffects: isCancelled
        ? "Financial expenditures balance out via disciplined budget management and investments."
        : "Need for prudent expenditure control and steady asset allocation during 11th lord sub-periods.",
      activationDashaLords: [lord11],
      isLifelong: false,
    });
  }

  const yogasByCategory: Record<YogaCategory, RamanYoga[]> = {
    "Lunar & Solar": yogas.filter((y) => y.category === "Lunar & Solar"),
    "Pancha Mahapurusha": yogas.filter((y) => y.category === "Pancha Mahapurusha"),
    "Raja Yoga & Eminence": yogas.filter((y) => y.category === "Raja Yoga & Eminence"),
    "Dhana & Prosperity": yogas.filter((y) => y.category === "Dhana & Prosperity"),
    "32 Nabhasa Yogas": yogas.filter((y) => y.category === "32 Nabhasa Yogas"),
    "Arishta & Challenging": yogas.filter((y) => y.category === "Arishta & Challenging"),
  };

  const activeYogas = yogas.filter((y) => !y.isCancelled);
  const highestPotency = activeYogas.length > 0
    ? [...activeYogas].sort((a, b) => b.potencyPercent - a.potencyPercent)[0]
    : null;

  return {
    totalFormed: yogas.length,
    activeCount: activeYogas.length,
    cancelledCount: yogas.filter((y) => y.isCancelled).length,
    yogas,
    yogasByCategory,
    highestPotencyYoga: highestPotency,
    functionalRoles,
  };
}
