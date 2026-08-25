/**
 * Classical Parashari Yoga Detection Engine
 * Based on Brihat Parashara Hora Shastra (BPHS) Chapters 35-43,
 * Saravali, and Phaladeepika.
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";

export interface DetectedYoga {
  name: string;
  sanskritName: string;
  category: "Raja Yoga" | "Dhana Yoga" | "Mahapurusha Yoga" | "Auspicious Yoga" | "Challenging / Inauspicious";
  participatingGrahas: string[];
  housesInvolved: number[];
  description: string;
  effects: string;
  activationDasha: string;
}

// Sign Rulers: 0=Aries (Mars), 1=Taurus (Venus), 2=Gemini (Mercury), 3=Cancer (Moon),
// 4=Leo (Sun), 5=Virgo (Mercury), 6=Libra (Venus), 7=Scorpio (Mars),
// 8=Sagittarius (Jupiter), 9=Capricorn (Saturn), 10=Aquarius (Saturn), 11=Pisces (Jupiter)
const SIGN_LORDS: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
  4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars",
  8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

export function detectVedicYogas(ephemeris: EphemerisResult): DetectedYoga[] {
  const yogas: DetectedYoga[] = [];
  const planets = ephemeris.planets;
  const ascLon = ephemeris.ascendant.siderealLongitude;
  const ascSign = Math.floor(ascLon / 30);

  // Helper to get house from Lagna (1..12) for any sign index (0..11)
  const getHouseFromSign = (signIdx: number): number => {
    return ((signIdx - ascSign + 12) % 12) + 1;
  };

  // Helper to get sign index where a specific house lord is sitting
  const getHouseLord = (houseNum: number): string => {
    const signIdx = (ascSign + houseNum - 1) % 12;
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

  // 1. PANCHA MAHAPURUSHA YOGAS (Mars, Mercury, Jupiter, Venus, Saturn in Kendra in own/exaltation sign)
  const kendraHouses = [1, 4, 7, 10];

  // Ruchaka (Mars)
  const marsHouse = getPlanetHouse("Mars");
  const marsSign = getPlanetSign("Mars");
  if (kendraHouses.includes(marsHouse) && [0, 7, 9].includes(marsSign)) {
    yogas.push({
      name: "Ruchaka Mahapurusha Yoga",
      sanskritName: "रुचक महापुरुष योग",
      category: "Mahapurusha Yoga",
      participatingGrahas: ["Mars"],
      housesInvolved: [marsHouse],
      description: "Mars is exalted or in own sign (Aries/Scorpio/Capricorn) situated in a Kendra house.",
      effects: "Courage, leadership, military or administrative prowess, victory over adversaries, and high physical stamina.",
      activationDasha: "Mars Mahadasha / Antardasha",
    });
  }

  // Bhadra (Mercury)
  const mercHouse = getPlanetHouse("Mercury");
  const mercSign = getPlanetSign("Mercury");
  if (kendraHouses.includes(mercHouse) && [2, 5].includes(mercSign)) {
    yogas.push({
      name: "Bhadra Mahapurusha Yoga",
      sanskritName: "भद्र महापुरुष योग",
      category: "Mahapurusha Yoga",
      participatingGrahas: ["Mercury"],
      housesInvolved: [mercHouse],
      description: "Mercury is in own or exalted sign (Gemini/Virgo) situated in a Kendra house.",
      effects: "Sharp intellect, eloquence, mastery in commerce, communication, mathematical acuity, and executive respect.",
      activationDasha: "Mercury Mahadasha / Antardasha",
    });
  }

  // Hamsa (Jupiter)
  const jupHouse = getPlanetHouse("Jupiter");
  const jupSign = getPlanetSign("Jupiter");
  if (kendraHouses.includes(jupHouse) && [3, 8, 11].includes(jupSign)) {
    yogas.push({
      name: "Hamsa Mahapurusha Yoga",
      sanskritName: "हंस महापुरुष योग",
      category: "Mahapurusha Yoga",
      participatingGrahas: ["Jupiter"],
      housesInvolved: [jupHouse],
      description: "Jupiter is in own or exalted sign (Cancer/Sagittarius/Pisces) situated in a Kendra house.",
      effects: "Noble character, profound wisdom, spiritual inclination, righteousness, respect from scholars and authorities.",
      activationDasha: "Jupiter Mahadasha / Antardasha",
    });
  }

  // Malavya (Venus)
  const venHouse = getPlanetHouse("Venus");
  const venSign = getPlanetSign("Venus");
  if (kendraHouses.includes(venHouse) && [1, 6, 11].includes(venSign)) {
    yogas.push({
      name: "Malavya Mahapurusha Yoga",
      sanskritName: "मालव्य महापुरुष योग",
      category: "Mahapurusha Yoga",
      participatingGrahas: ["Venus"],
      housesInvolved: [venHouse],
      description: "Venus is in own or exalted sign (Taurus/Libra/Pisces) situated in a Kendra house.",
      effects: "Artistic refinement, luxurious vehicles, magnetic charm, happy marital blessings, and material prosperity.",
      activationDasha: "Venus Mahadasha / Antardasha",
    });
  }

  // Sasa (Saturn)
  const satHouse = getPlanetHouse("Saturn");
  const satSign = getPlanetSign("Saturn");
  if (kendraHouses.includes(satHouse) && [6, 9, 10].includes(satSign)) {
    yogas.push({
      name: "Sasa Mahapurusha Yoga",
      sanskritName: "शश महापुरुष योग",
      category: "Mahapurusha Yoga",
      participatingGrahas: ["Saturn"],
      housesInvolved: [satHouse],
      description: "Saturn is in own or exalted sign (Libra/Capricorn/Aquarius) situated in a Kendra house.",
      effects: "Great endurance, command over masses, perseverance, authority in engineering/industry, and long-lasting legacy.",
      activationDasha: "Saturn Mahadasha / Antardasha",
    });
  }

  // 2. GAJA KESARI YOGA (Jupiter in Kendra from Moon: 1, 4, 7, 10 houses from Moon)
  const moonHouse = getPlanetHouse("Moon");
  if (jupHouse && moonHouse) {
    const distFromMoon = ((jupHouse - moonHouse + 12) % 12) + 1;
    if ([1, 4, 7, 10].includes(distFromMoon)) {
      yogas.push({
        name: "Gaja Kesari Yoga",
        sanskritName: "गजकेसरी योग",
        category: "Raja Yoga",
        participatingGrahas: ["Jupiter", "Moon"],
        housesInvolved: [moonHouse, jupHouse],
        description: `Jupiter is placed in the ${distFromMoon}th house from Moon (Kendra relationship).`,
        effects: "Overcomes obstacles like an elephant (Gaja) with the valor of a lion (Kesari); grants lasting reputation and virtuous mind.",
        activationDasha: "Jupiter or Moon Dasha periods",
      });
    }
  }

  // 3. BUDHADITYA YOGA (Sun and Mercury in the same house)
  const sunHouse = getPlanetHouse("Sun");
  const sunSign = getPlanetSign("Sun");
  if (sunHouse && mercHouse && sunHouse === mercHouse) {
    const sunMercDist = Math.abs(
      (planets.Sun?.siderealLongitude || 0) - (planets.Mercury?.siderealLongitude || 0)
    );
    const isCombust = sunMercDist < 3;
    yogas.push({
      name: "Budhaditya Yoga",
      sanskritName: "बुधादित्य योग",
      category: "Auspicious Yoga",
      participatingGrahas: ["Sun", "Mercury"],
      housesInvolved: [sunHouse],
      description: `Sun and Mercury are conjoined in House ${sunHouse} (${sunSign >= 0 ? RASHI_NAMES[sunSign].englishName : ""})${isCombust ? " (close degree)" : ""}.`,
      effects: "Intellectual brilliance, administrative acumen, persuasive communication, and professional respect.",
      activationDasha: "Sun or Mercury Dasha periods",
    });
  }

  // 4. CHANDRA-MANGALA YOGA (Moon and Mars in conjunction or mutual 7th aspect)
  if (moonHouse && marsHouse) {
    if (moonHouse === marsHouse || Math.abs(moonHouse - marsHouse) === 6) {
      yogas.push({
        name: "Chandra-Mangala Yoga",
        sanskritName: "चन्द्र-मंगल योग",
        category: "Dhana Yoga",
        participatingGrahas: ["Moon", "Mars"],
        housesInvolved: [moonHouse, marsHouse],
        description: `Moon and Mars are ${moonHouse === marsHouse ? "conjoined" : "in mutual 7th aspect"} in Houses ${moonHouse} and ${marsHouse}.`,
        effects: "Entrepreneurial drive, financial earnings through personal enterprise, real estate acumen, and commercial wealth.",
        activationDasha: "Moon or Mars Dasha periods",
      });
    }
  }

  // 5. DHARMA-KARMADHIPATI RAJA YOGA (9th Lord & 10th Lord combination)
  const lord9 = getHouseLord(9);
  const lord10 = getHouseLord(10);
  const houseLord9 = getPlanetHouse(lord9);
  const houseLord10 = getPlanetHouse(lord10);
  if (lord9 !== lord10 && houseLord9 && houseLord10) {
    if (houseLord9 === houseLord10 || Math.abs(houseLord9 - houseLord10) === 6) {
      yogas.push({
        name: "Dharma-Karmadhipati Raja Yoga",
        sanskritName: "धर्म-कर्माधिपति राजयोग",
        category: "Raja Yoga",
        participatingGrahas: [lord9, lord10],
        housesInvolved: [houseLord9, houseLord10],
        description: `9th Lord (${lord9}) and 10th Lord (${lord10}) are connected ${houseLord9 === houseLord10 ? "in House " + houseLord9 : "across Houses " + houseLord9 + " and " + houseLord10}.`,
        effects: "Highest auspicious Raja Yoga linking fortune (Dharma) with worldly action (Karma); brings fame, righteous leadership, and success.",
        activationDasha: `${lord9} or ${lord10} Dasha periods`,
      });
    }
  }

  // 6. VIPAREETA RAJA YOGAS (Trika lords in Trika houses 6, 8, 12)
  const trikaHouses = [6, 8, 12];
  const lord6 = getHouseLord(6);
  const houseLord6 = getPlanetHouse(lord6);
  if (trikaHouses.includes(houseLord6)) {
    yogas.push({
      name: "Harsha Vipareeta Raja Yoga",
      sanskritName: "हर्ष विपरीत राजयोग",
      category: "Raja Yoga",
      participatingGrahas: [lord6],
      housesInvolved: [houseLord6],
      description: `6th Lord (${lord6}) is situated in Dusthana House ${houseLord6}.`,
      effects: "Victory over enemies, sudden rise through overcoming adversity, physical resilience, and freedom from debts.",
      activationDasha: `${lord6} Dasha periods`,
    });
  }

  const lord8 = getHouseLord(8);
  const houseLord8 = getPlanetHouse(lord8);
  if (trikaHouses.includes(houseLord8) && lord8 !== lord6) {
    yogas.push({
      name: "Sarala Vipareeta Raja Yoga",
      sanskritName: "सरल विपरीत राजयोग",
      category: "Raja Yoga",
      participatingGrahas: [lord8],
      housesInvolved: [houseLord8],
      description: `8th Lord (${lord8}) is situated in Dusthana House ${houseLord8}.`,
      effects: "Fearlessness, unexpected gains, longevity, scholarly focus, and turning crisis into personal breakthrough.",
      activationDasha: `${lord8} Dasha periods`,
    });
  }

  const lord12 = getHouseLord(12);
  const houseLord12 = getPlanetHouse(lord12);
  if (trikaHouses.includes(houseLord12) && lord12 !== lord6 && lord12 !== lord8) {
    yogas.push({
      name: "Vimala Vipareeta Raja Yoga",
      sanskritName: "विमल विपरीत राजयोग",
      category: "Raja Yoga",
      participatingGrahas: [lord12],
      housesInvolved: [houseLord12],
      description: `12th Lord (${lord12}) is situated in Dusthana House ${houseLord12}.`,
      effects: "Frugality, righteous expenditure, independence, spiritual evolution, and peace of mind.",
      activationDasha: `${lord12} Dasha periods`,
    });
  }

  // 7. DHANA YOGAS (2nd/11th lords in Kendra/Trikona or together)
  const lord2 = getHouseLord(2);
  const lord11 = getHouseLord(11);
  const houseLord2 = getPlanetHouse(lord2);
  const houseLord11 = getPlanetHouse(lord11);
  if (lord2 !== lord11 && houseLord2 && houseLord11) {
    if (houseLord2 === houseLord11 || [1, 2, 5, 9, 11].includes(houseLord2) && [1, 2, 5, 9, 11].includes(houseLord11)) {
      yogas.push({
        name: "Maha Dhana Yoga",
        sanskritName: "महा धन योग",
        category: "Dhana Yoga",
        participatingGrahas: [lord2, lord11],
        housesInvolved: [houseLord2, houseLord11],
        description: `2nd Lord (${lord2}) and 11th Lord (${lord11}) occupy wealth-generating houses (${houseLord2} & ${houseLord11}).`,
        effects: "Steady accumulation of capital, financial liquidity, commercial profitability, and multi-stream earnings.",
        activationDasha: `${lord2} or ${lord11} Dasha periods`,
      });
    }
  }

  return yogas;
}