/**
 * Maharaja Kalyana Varma's Saravali (सारावली - 800 CE, 45 Adhyayas, 2,500+ Shlokas) Engine
 * Supreme Classical Textbook of Predictive Horoscopy
 *
 * Core Classical Pillars:
 * 1. Saravali Royal & Prosperity Yogas (Vasumati, Adhi, Chandra Yogas, Maharaja Yogas - Adhyayas 35–38).
 * 2. Multi-Graha Conjunction Matrix (2, 3, 4 Planet Assemblies - Adhyayas 15–21).
 * 3. Stri Jataka & Visha Kanya Diagnostics (Trimsamsha & Cancellation Shields - Adhyaya 43).
 * 4. 12 Bhavas Saravali Royal Potency Matrix (Adhyayas 32–34).
 */

import {
  EphemerisResult,
  SaravaliAnalysis,
  SaravaliYoga,
  SaravaliConjunction,
  SaravaliStriJataka,
  SaravaliBhavaPotency,
} from "./types";
import { RASHI_NAMES } from "./constants";

const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

function getTrimsamshaLord(lon: number): { lord: string; trimsamshaSign: string; nature: string } {
  const normLon = ((lon % 360) + 360) % 360;
  const rashiIdx = Math.floor(normLon / 30);
  const degInRashi = normLon % 30;
  const isOdd = rashiIdx % 2 === 0; // Aries = 0 (odd sign)

  let lord = "Jupiter";
  let sign = "Sagittarius";
  let nature = "Pious, noble, highly cultured and virtuous disposition.";

  if (isOdd) {
    // Odd Signs: 0-5 Mars (Aries), 5-10 Saturn (Aquarius), 10-18 Jupiter (Sagittarius), 18-25 Mercury (Gemini), 25-30 Venus (Libra)
    if (degInRashi < 5) {
      lord = "Mars";
      sign = "Aries";
      nature = "Fiery, independent, spirited, and heroic temperament (Adhyaya 43, Shloka 12).";
    } else if (degInRashi < 10) {
      lord = "Saturn";
      sign = "Aquarius";
      nature = "Austere, reserved, persevering, and deeply pragmatic character (Adhyaya 43, Shloka 13).";
    } else if (degInRashi < 18) {
      lord = "Jupiter";
      sign = "Sagittarius";
      nature = "Deeply virtuous, charitable, respected, and auspicious demeanor (Adhyaya 43, Shloka 14).";
    } else if (degInRashi < 25) {
      lord = "Mercury";
      sign = "Gemini";
      nature = "Eloquent, artistic, intellectually witty, and adaptable personality (Adhyaya 43, Shloka 15).";
    } else {
      lord = "Venus";
      sign = "Libra";
      nature = "Exquisite refinement, beauty, fond of ornaments, and devoted to family (Adhyaya 43, Shloka 16).";
    }
  } else {
    // Even Signs: 0-5 Venus (Taurus), 5-12 Mercury (Virgo), 12-20 Jupiter (Pisces), 20-25 Saturn (Capricorn), 25-30 Mars (Scorpio)
    if (degInRashi < 5) {
      lord = "Venus";
      sign = "Taurus";
      nature = "Gracious, magnetic charm, prosperous, and devoted to fine arts (Adhyaya 43, Shloka 17).";
    } else if (degInRashi < 12) {
      lord = "Mercury";
      sign = "Virgo";
      nature = "Discreet, highly intelligent, skilled in crafts and home economy (Adhyaya 43, Shloka 18).";
    } else if (degInRashi < 20) {
      lord = "Jupiter";
      sign = "Pisces";
      nature = "Sattvic, serene, blessed with noble children, and revered in society (Adhyaya 43, Shloka 19).";
    } else if (degInRashi < 25) {
      lord = "Saturn";
      sign = "Capricorn";
      nature = "Hardworking, disciplined, steady in duty, and resilient (Adhyaya 43, Shloka 20).";
    } else {
      lord = "Mars";
      sign = "Scorpio";
      nature = "Intense, resolute, commanding authority, and fearless (Adhyaya 43, Shloka 21).";
    }
  }

  return { lord, trimsamshaSign: sign, nature };
}

export function evaluateSaravali(natalEphemeris: EphemerisResult): SaravaliAnalysis {
  const ascSignIdx = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const lagnaLordName = SIGN_LORDS[ascSignIdx];
  const lagnaLordPlanet = natalEphemeris.planets[lagnaLordName];
  const lagnaLordHouse = lagnaLordPlanet ? lagnaLordPlanet.house : 1;

  const moonPlanet = natalEphemeris.planets.Moon;
  const moonHouse = moonPlanet ? moonPlanet.house : 1;
  const moonSignIdx = moonPlanet ? Math.floor(moonPlanet.siderealLongitude / 30) : 0;

  const jupiterPlanet = natalEphemeris.planets.Jupiter;
  const venusPlanet = natalEphemeris.planets.Venus;
  const mercuryPlanet = natalEphemeris.planets.Mercury;
  const marsPlanet = natalEphemeris.planets.Mars;
  const saturnPlanet = natalEphemeris.planets.Saturn;
  const sunPlanet = natalEphemeris.planets.Sun;

  // 1. Royal & Prosperity Yogas (Adhyayas 35–38)
  const royalYogas: SaravaliYoga[] = [];

  // A. Vasumati Yoga (वसुमती योग - Adhyaya 38, Shloka 1-3)
  // Natural benefics (Jupiter, Venus, Mercury) in Upachayas (3, 6, 10, 11) from Lagna OR Moon
  const UPACHAYAS = [3, 6, 10, 11];
  const lagnaUpachayaBenefics = [jupiterPlanet, venusPlanet, mercuryPlanet].filter((p) => p && UPACHAYAS.includes(p.house));
  const moonUpachayaBenefics = [jupiterPlanet, venusPlanet, mercuryPlanet].filter((p) => {
    if (!p) return false;
    const distFromMoon = (((p.house - moonHouse + 12) % 12) + 1);
    return UPACHAYAS.includes(distFromMoon);
  });

  const isFullVasumati = lagnaUpachayaBenefics.length === 3 || moonUpachayaBenefics.length === 3;
  const isPartialVasumati = lagnaUpachayaBenefics.length >= 2 || moonUpachayaBenefics.length >= 2;

  royalYogas.push({
    yogaName: "Vasumati Yoga (वसुमती योग)",
    sanskritName: "अखण्ड कुबेर वसुमती योग",
    category: "Vasumati / Dhana Yoga",
    isFormed: isFullVasumati || isPartialVasumati,
    participatingPlanets: ["Jupiter", "Venus", "Mercury"],
    description: "Benefics (Jupiter, Venus, Mercury) occupying Upachaya houses (3, 6, 10, 11) from Lagna or Moon.",
    classicalShlokaEffect: isFullVasumati
      ? "Even if born in a destitute family, the native commands boundless royal riches like Kubera, multi-millionaire status, and independent sovereign authority (Saravali Adhyaya 38, Shloka 1)."
      : "Confers steadfast wealth, landed estates, financial autonomy, and prosperous enterprises (Saravali Adhyaya 38, Shloka 2).",
    adhyayaRef: "Saravali, Adhyaya 38 (Dhana & Raja Yoga)",
  });

  // B. Adhi Yoga from Lagna & Moon (अधि योग - Adhyaya 38, Shloka 4-6)
  // Benefics in 6, 7, 8 from Moon or Lagna
  const ADHI_HOUSES = [6, 7, 8];
  const lagnaAdhiBenefics = [jupiterPlanet, venusPlanet, mercuryPlanet].filter((p) => p && ADHI_HOUSES.includes(p.house));
  const moonAdhiBenefics = [jupiterPlanet, venusPlanet, mercuryPlanet].filter((p) => {
    if (!p) return false;
    const dist = (((p.house - moonHouse + 12) % 12) + 1);
    return ADHI_HOUSES.includes(dist);
  });

  const isAdhiYoga = lagnaAdhiBenefics.length >= 2 || moonAdhiBenefics.length >= 2;
  const isFullAdhi = lagnaAdhiBenefics.length === 3 || moonAdhiBenefics.length === 3;

  royalYogas.push({
    yogaName: "Lagna / Chandradhi Yoga (अधि योग)",
    sanskritName: "नृपति अधि योग",
    category: "Adhi Yoga",
    isFormed: isAdhiYoga,
    participatingPlanets: ["Jupiter", "Venus", "Mercury"],
    description: "Benefic planets occupying the 6th, 7th, and 8th houses from the Ascendant or the Moon.",
    classicalShlokaEffect: isFullAdhi
      ? "The native becomes a King or Supreme Head of State; with two benefics, a Prime Minister or Minister of State; with one, a Commander-in-Chief (Saravali Adhyaya 38, Shloka 4)."
      : "Elevates the native to eminent ministerial rank, triumph over all adversaries, and long-lasting societal veneration (Saravali Adhyaya 38, Shloka 5).",
    adhyayaRef: "Saravali, Adhyaya 38",
  });

  // C. Chandra Yogas: Sunapha, Anapha, Dhurdhura, Kemadruma (Adhyaya 37)
  const h2FromMoon = ((moonHouse % 12) + 1);
  const h12FromMoon = (((moonHouse - 2 + 12) % 12) + 1);

  const planetsIn2nd = Object.values(natalEphemeris.planets).filter((p) => {
    if (["Sun", "Moon", "Rahu", "Ketu"].includes(p.name) || p.isUpagraha || p.isModernPlanet) return false;
    return p.house === h2FromMoon;
  });

  const planetsIn12th = Object.values(natalEphemeris.planets).filter((p) => {
    if (["Sun", "Moon", "Rahu", "Ketu"].includes(p.name) || p.isUpagraha || p.isModernPlanet) return false;
    return p.house === h12FromMoon;
  });

  if (planetsIn2nd.length > 0 && planetsIn12th.length > 0) {
    royalYogas.push({
      yogaName: "Dhurdhura Yoga (दुरुधुरा योग)",
      sanskritName: "उभयचन्द्र दुरुधुरा योग",
      category: "Chandra Yoga",
      isFormed: true,
      participatingPlanets: ["Moon", ...planetsIn2nd.map((p) => p.name), ...planetsIn12th.map((p) => p.name)],
      description: "Non-Sun planets occupying both the 2nd and 12th houses from Moon.",
      classicalShlokaEffect: "Endowed with generous munificence, exquisite vehicles, abundant gold and grain, and unassailable authority (Saravali Adhyaya 37, Shloka 11).",
      adhyayaRef: "Saravali, Adhyaya 37 (Chandra Yoga)",
    });
  } else if (planetsIn2nd.length > 0) {
    royalYogas.push({
      yogaName: "Sunapha Yoga (सुनफा योग)",
      sanskritName: "धनवान सुनफा योग",
      category: "Chandra Yoga",
      isFormed: true,
      participatingPlanets: ["Moon", ...planetsIn2nd.map((p) => p.name)],
      description: "Planets (other than Sun/nodes) in the 2nd house from Moon.",
      classicalShlokaEffect: "Acquires massive self-earned wealth, intellectual sharp acumen, virtuous conduct, and royal esteem (Saravali Adhyaya 37, Shloka 2).",
      adhyayaRef: "Saravali, Adhyaya 37",
    });
  } else if (planetsIn12th.length > 0) {
    royalYogas.push({
      yogaName: "Anapha Yoga (अनफा योग)",
      sanskritName: "यशस्वी अनफा योग",
      category: "Chandra Yoga",
      isFormed: true,
      participatingPlanets: ["Moon", ...planetsIn12th.map((p) => p.name)],
      description: "Planets (other than Sun/nodes) in the 12th house from Moon.",
      classicalShlokaEffect: "Physically handsome, self-respecting, renowned, skilled in diplomacy, and enjoying peaceful longevity (Saravali Adhyaya 37, Shloka 3).",
      adhyayaRef: "Saravali, Adhyaya 37",
    });
  } else {
    // Check Kemadruma Bhanga (cancellation)
    const kendraPlanets = Object.values(natalEphemeris.planets).filter((p) => {
      if (["Rahu", "Ketu"].includes(p.name) || p.isUpagraha || p.isModernPlanet) return false;
      return [1, 4, 7, 10].includes(p.house);
    });
    const isKemadrumaBhanga = kendraPlanets.length > 0 || [1, 4, 7, 10].includes(moonHouse);

    royalYogas.push({
      yogaName: isKemadrumaBhanga ? "Kemadruma Bhanga Rajayoga (केमद्रुम भंग राजयोग)" : "Kemadruma Yoga (केमद्रुम योग)",
      sanskritName: isKemadrumaBhanga ? "केमद्रुम भंग राजयोग" : "दारिद्र्य केमद्रुम योग",
      category: "Chandra Yoga",
      isFormed: true,
      participatingPlanets: ["Moon"],
      description: isKemadrumaBhanga
        ? "Absence of planets adjacent to Moon is powerfully neutralized by planets occupying Kendras, transmuting it into Raja Yoga."
        : "No planets in the 2nd and 12th from Moon.",
      classicalShlokaEffect: isKemadrumaBhanga
        ? "Cancels poverty; confers majestic resurgence, intellectual brilliance, and royal honor in mature life (Saravali Adhyaya 37, Shloka 15)."
        : "Advises regular Shiva worship to clear fluctuations in wealth and domestic ease (Saravali Adhyaya 37, Shloka 14).",
      adhyayaRef: "Saravali, Adhyaya 37",
    });
  }

  // D. Maharaja Yogas & Exaltations (Adhyaya 35)
  const exaltedPlanets: string[] = [];
  if (sunPlanet && Math.floor(sunPlanet.siderealLongitude / 30) === 0) exaltedPlanets.push("Sun");
  if (moonPlanet && Math.floor(moonPlanet.siderealLongitude / 30) === 1) exaltedPlanets.push("Moon");
  if (marsPlanet && Math.floor(marsPlanet.siderealLongitude / 30) === 9) exaltedPlanets.push("Mars");
  if (mercuryPlanet && Math.floor(mercuryPlanet.siderealLongitude / 30) === 5) exaltedPlanets.push("Mercury");
  if (jupiterPlanet && Math.floor(jupiterPlanet.siderealLongitude / 30) === 3) exaltedPlanets.push("Jupiter");
  if (venusPlanet && Math.floor(venusPlanet.siderealLongitude / 30) === 11) exaltedPlanets.push("Venus");
  if (saturnPlanet && Math.floor(saturnPlanet.siderealLongitude / 30) === 6) exaltedPlanets.push("Saturn");

  if (exaltedPlanets.length >= 2) {
    royalYogas.push({
      yogaName: `Maharaja Yoga (${exaltedPlanets.length} Exalted Planets)`,
      sanskritName: "महाराज योग",
      category: "Maharaja Yoga",
      isFormed: true,
      participatingPlanets: exaltedPlanets,
      description: `${exaltedPlanets.join(", ")} occupying their supreme exaltation signs (Uchcha Rashi).`,
      classicalShlokaEffect: "Commands extensive domains, universally celebrated, wielding supreme executive power and immense philanthropy (Saravali Adhyaya 35, Shloka 1-8).",
      adhyayaRef: "Saravali, Adhyaya 35 (Maharaja Yogas)",
    });
  }

  // 2. Multi-Planet Conjunction Matrix (Adhyayas 15–21)
  const conjunctions: SaravaliConjunction[] = [];
  const houseOccupantsMap: Record<number, string[]> = {};

  for (const [name, p] of Object.entries(natalEphemeris.planets)) {
    if (p.isUpagraha || p.isModernPlanet) continue;
    if (!houseOccupantsMap[p.house]) houseOccupantsMap[p.house] = [];
    houseOccupantsMap[p.house].push(name);
  }

  for (const [hStr, occupants] of Object.entries(houseOccupantsMap)) {
    const h = Number(hStr);
    const sIdx = (ascSignIdx + h - 1) % 12;
    const sName = RASHI_NAMES[sIdx]?.englishName || "Aries";

    if (occupants.length === 2) {
      const [p1, p2] = occupants;
      let yogaTitle = `${p1}-${p2} Conjunction`;
      let phala = "Creates dynamic combined planetary synergy.";
      let citation = "Saravali Adhyaya 15";

      if ((occupants.includes("Sun") && occupants.includes("Mercury"))) {
        yogaTitle = "Budhaditya / Nipuna Yoga (बुधादित्य योग)";
        phala = "Highly intelligent, sharp analytical acuity, sweet and persuasive speech, royal counselor (Saravali Adhyaya 15, Shloka 3).";
        citation = "Saravali Adhyaya 15, Shloka 3";
      } else if ((occupants.includes("Sun") && occupants.includes("Jupiter"))) {
        yogaTitle = "Guru-Aditya Yoga (गुरु-आदित्य योग)";
        phala = "Noble character, respected by kings, endowed with profound Vedic scholarship and virtuous leadership (Saravali Adhyaya 15, Shloka 4).";
        citation = "Saravali Adhyaya 15, Shloka 4";
      } else if ((occupants.includes("Moon") && occupants.includes("Mars"))) {
        yogaTitle = "Chandra-Mangala Yoga (चन्द्र-मङ्गल योग)";
        phala = "Unceasing wealth generation through commerce, heroic vitality, real estate acquisitions (Saravali Adhyaya 15, Shloka 21).";
        citation = "Saravali Adhyaya 15, Shloka 21";
      } else if ((occupants.includes("Moon") && occupants.includes("Jupiter"))) {
        yogaTitle = "Gaja-Kesari Yoga (गजकेसरी योग)";
        phala = "Enduring prestige, lion-like courage, righteous conduct, and triumph in civic affairs (Saravali Adhyaya 15, Shloka 23).";
        citation = "Saravali Adhyaya 15, Shloka 23";
      } else if ((occupants.includes("Venus") && occupants.includes("Mercury"))) {
        yogaTitle = "Lakshmi-Narayana Yoga (लक्ष्मी-नारायण योग)";
        phala = "Artistic refinement, poetic genius, exquisite luxury mansions, and magnetic public appeal (Saravali Adhyaya 15, Shloka 35).";
        citation = "Saravali Adhyaya 15, Shloka 35";
      } else if ((occupants.includes("Mars") && occupants.includes("Jupiter"))) {
        yogaTitle = "Guru-Mangala Yoga (गुरु-मङ्गल योग)";
        phala = "Leader of enterprises, skilled in strategic engineering, highly energetic and righteous (Saravali Adhyaya 15, Shloka 30).";
        citation = "Saravali Adhyaya 15, Shloka 30";
      }

      conjunctions.push({
        conjunctionType: "2-Planet (Dwi-Graha)",
        planets: occupants,
        house: h,
        signName: sName,
        yogaTitle,
        saravaliPhala: phala,
        adhyayaCitation: citation,
      });
    } else if (occupants.length === 3) {
      conjunctions.push({
        conjunctionType: "3-Planet (Tri-Graha)",
        planets: occupants,
        house: h,
        signName: sName,
        yogaTitle: `Tri-Graha Assembly (${occupants.join(" + ")})`,
        saravaliPhala: "Concentrated three-fold planetary ray conferring multi-disciplinary mastery, executive prominence, and dynamic fortunes (Saravali Adhyayas 16-17).",
        adhyayaCitation: "Saravali Adhyayas 16-17 (Tri-Graha Yuti)",
      });
    } else if (occupants.length >= 4) {
      conjunctions.push({
        conjunctionType: "4-Planet (Chatur-Graha)",
        planets: occupants,
        house: h,
        signName: sName,
        yogaTitle: `Chatur-Graha Conjunction (${occupants.join(" + ")})`,
        saravaliPhala: "Commanding multi-planetary nexus granting extraordinary life pivot, spiritual depth, and sovereign renown (Saravali Adhyayas 18-20).",
        adhyayaCitation: "Saravali Adhyayas 18-20 (Chatur-Graha Yuti)",
      });
    }
  }

  // 3. Stri Jataka & Visha Kanya Diagnostics (Adhyaya 43)
  const lagnaLon = natalEphemeris.ascendant.siderealLongitude;
  const trimsamsha = getTrimsamshaLord(lagnaLon);

  // Visha Kanya evaluation (approximate classical check)
  const moonNakIdx = moonPlanet?.nakshatra?.index ?? 0;
  const isVishaNakshatra = [2, 8, 23].includes(moonNakIdx); // Krittika, Ashlesha, Shatabhisha
  const kendraBenefics = [jupiterPlanet, venusPlanet, mercuryPlanet].filter((p) => p && [1, 4, 7, 10].includes(p.house));
  const isVishaKanya = Boolean(isVishaNakshatra);
  const isVishaKanyaBhanga = kendraBenefics.length > 0 || (lagnaLordPlanet && [1, 4, 7, 10, 5, 9].includes(lagnaLordPlanet.house));

  const striJataka: SaravaliStriJataka = {
    trimsamshaLord: trimsamsha.lord,
    trimsamshaSign: trimsamsha.trimsamshaSign,
    trimsamshaNature: trimsamsha.nature,
    vishaKanyaDetected: isVishaKanya,
    vishaKanyaBhanga: Boolean(isVishaKanyaBhanga),
    maritalAndMoralDisposition: isVishaKanya && !isVishaKanyaBhanga
      ? "Demands conscious spiritual harmony and Shiva-Parvati worship to ensure marital bliss (Saravali Adhyaya 43)."
      : `Governed by Lord ${trimsamsha.lord} Trimsamsha; endows unblemished character, marital devotion, and familial prosperity.`,
  };

  // 4. 12 Bhavas Saravali Royal Potency Matrix (Adhyayas 32–34)
  const bhavaPotency: SaravaliBhavaPotency[] = [];
  const BHAVA_TITLES = [
    "तनु भाव (Tanu - Royal Physique & Dignity)",
    "धन भाव (Dhana - Treasury & Oratory)",
    "सहज भाव (Sahaja - Courage & Valour)",
    "बन्धु भाव (Bandhu - Palaces & Vehicles)",
    "पुत्र भाव (Putra - Sovereign Intellect)",
    "अरि भाव (Ari - Conquest over Enemies)",
    "कलत्र भाव (Kalatra - Royal Consort & Alliances)",
    "रन्ध्र भाव (Randhra - Secret Power & Longevity)",
    "भाग्य भाव (Bhagya - Imperial Fortune)",
    "कर्म भाव (Karma - Sovereign Authority)",
    "लाभ भाव (Labha - Revenues & Imperial Tributes)",
    "व्यय भाव (Vyaya - Emancipation & Foreign Realms)",
  ];

  for (let h = 1; h <= 12; h++) {
    const sIdx = (ascSignIdx + h - 1) % 12;
    const sName = RASHI_NAMES[sIdx]?.englishName || "Aries";
    const lName = SIGN_LORDS[sIdx];
    const lPlanet = natalEphemeris.planets[lName];
    const lHouse = lPlanet ? lPlanet.house : h;
    const occs = houseOccupantsMap[h] || [];

    let score = 50;
    if ([1, 4, 7, 10].includes(lHouse)) score += 25;
    else if ([5, 9].includes(lHouse)) score += 25;
    else if (lHouse === 11) score += 15;
    else if ([6, 8, 12].includes(lHouse) && h !== lHouse) score -= 15;

    for (const occ of occs) {
      if (["Jupiter", "Venus", "Mercury", "Moon"].includes(occ)) score += 15;
      if (["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(occ)) {
        if ([3, 6, 11].includes(h)) score += 15;
        else score -= 10;
      }
    }
    score = Math.max(15, Math.min(100, score));

    const grade: "Maharaja Grade (Uttama)" | "Samanta Grade (Madhyama)" | "Alpa Grade (Heena)" =
      score >= 75 ? "Maharaja Grade (Uttama)" : score >= 50 ? "Samanta Grade (Madhyama)" : "Alpa Grade (Heena)";

    const classicalPhala = grade === "Maharaja Grade (Uttama)"
      ? `Commands sovereign elevation, flourishing assets, and royal eminence in ${BHAVA_TITLES[h - 1].split(" ")[0]} matters.`
      : grade === "Samanta Grade (Madhyama)"
      ? `Steady, respectable outcomes achieved through steadfast royal determination.`
      : `Requires protective pariharas to overcome planetary impediments.`;

    bhavaPotency.push({
      bhavaNum: h,
      sanskritTitle: BHAVA_TITLES[h - 1],
      signName: sName,
      lordName: lName,
      lordPlacementHouse: lHouse,
      occupants: occs,
      saravaliScore: score,
      royalGrade: grade,
      classicalPhala,
      adhyayaCitation: "Saravali Adhyayas 32-34 (Bhava Phala)",
    });
  }

  // 5. Master Synthesis
  const activeRoyalYogas = royalYogas.filter((y) => y.isFormed);
  const masterSaravaliSynthesis = `Maharaja Kalyana Varma's Saravali (45 Adhyayas) highlights **${activeRoyalYogas.length} Sovereign Yogas**, spearheaded by **${activeRoyalYogas[0]?.yogaName || "Vasumati Yoga"}**. ${conjunctions.length} significant planetary conjunctions are active. Trimsamsha analysis assigns Lord **${trimsamsha.lord}** (${trimsamsha.trimsamshaSign}), confirming **${striJataka.maritalAndMoralDisposition}**.`;

  return {
    royalYogas,
    conjunctions,
    striJataka,
    bhavaPotency,
    masterSaravaliSynthesis,
  };
}
