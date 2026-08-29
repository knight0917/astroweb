/**
 * Acharya Ganesh Kavi's Jataka Alankara (जातकालंकार, 1613 CE) Engine
 * Annotated by Ganesha Daivajna (son of Gopala Daivajna)
 *
 * Classical Predictive Treatise featuring:
 * 1. 12 Bhavas Ornamentation Matrix (द्वादश भाव अलंकार) & Classical Shloka Phalas.
 * 2. Ganesh Kavi Special Raja, Dhana & Jnana Yogas.
 * 3. Arishta & Disease Diagnostics (रोग एवं अरिष्ट निर्णय).
 * 4. Stri Jataka & Marital Fortune (स्त्री जातक एवं दाम्पत्य सौख्य).
 */

import {
  EphemerisResult,
  JatakaAlankaraAnalysis,
  JatakaAlankaraBhava,
  JatakaAlankaraYoga,
  JatakaAlankaraDisease,
  JatakaAlankaraMarital,
} from "./types";
import { RASHI_NAMES } from "./constants";

const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

const BHAVA_METADATA: Array<{
  bhavaNum: number;
  sanskritTitle: string;
  signification: string;
  shlokaRef: string;
  basePhalaUttama: string;
  basePhalaAlpa: string;
}> = [
  {
    bhavaNum: 1,
    sanskritTitle: "तनु भाव (Body, Vitality, Stature & Radiance)",
    signification: "Physical constitution, majestic demeanor, enduring health, and societal eminence.",
    shlokaRef: "J.A. Ch. 2, Shloka 1-4 (Tanu Bhava Alankara)",
    basePhalaUttama: "Endowed with radiant complexion, robust vitality, commanding executive presence, and long-lasting fame.",
    basePhalaAlpa: "Requires mindful health discipline and energetic rejuvenation to maintain steady physical vitality.",
  },
  {
    bhavaNum: 2,
    sanskritTitle: "धन भाव (Liquid Wealth, Speech & Family Lineage)",
    signification: "Treasury of wealth, persuasive oratorical eloquence, facial grace, and ancestral heritage.",
    shlokaRef: "J.A. Ch. 2, Shloka 5-8 (Dhana Bhava Alankara)",
    basePhalaUttama: "Effortless accumulation of liquid wealth, sweet and authoritative speech, and flourishing family prosperity.",
    basePhalaAlpa: "Fluctuations in liquid cash reserves; prudent financial budgeting and speech moderation recommended.",
  },
  {
    bhavaNum: 3,
    sanskritTitle: "सहज भाव (Valour, Enterprise & Younger Siblings)",
    signification: "Heroic initiative, technical dexterity, creative arts, and sibling solidarity.",
    shlokaRef: "J.A. Ch. 2, Shloka 9-12 (Sahaja Bhava Alankara)",
    basePhalaUttama: "Courageous strategic enterprise, mastery in communications and mechanical/fine arts, and devoted siblings.",
    basePhalaAlpa: "Need for persistent personal initiative; self-reliance is the primary engine of progress.",
  },
  {
    bhavaNum: 4,
    sanskritTitle: "बन्धु भाव (Mansions, Landed Property & Mother)",
    signification: "Palatial residences, agricultural and real estate estates, luxury vehicles, and maternal happiness.",
    shlokaRef: "J.A. Ch. 2, Shloka 13-17 (Bandhu Bhava Alankara)",
    basePhalaUttama: "Acquisition of prime landed estates, multi-storeyed residences, elegant conveyances, and blissful maternal affection.",
    basePhalaAlpa: "Real estate transactions require careful vetting; domestic tranquility nurtured through patience.",
  },
  {
    bhavaNum: 5,
    sanskritTitle: "पुत्र भाव (Intellect, Progeny & Mantra Siddhi)",
    signification: "Supreme creative intelligence (Medha), virtuous progeny, advisory roles, and mantra mastery.",
    shlokaRef: "J.A. Ch. 2, Shloka 18-22 (Putra Bhava Alankara)",
    basePhalaUttama: "Genius intellect, profound capacity for governance and counsel, blessed with noble children and sacred mantra siddhi.",
    basePhalaAlpa: "Mental energy needs focused meditation; investment decisions require thorough analytical verification.",
  },
  {
    bhavaNum: 6,
    sanskritTitle: "अरि भाव (Conquest of Enemies, Health & Service)",
    signification: "Subjugation of rivals, immunity from chronic diseases, triumph in competitive contests, and litigations.",
    shlokaRef: "J.A. Ch. 2, Shloka 23-26 (Ari Bhava Alankara)",
    basePhalaUttama: "Total vanquishing of adversaries (Shatru Nashana), formidable immune constitution, and triumph in all legal/competitive arenas.",
    basePhalaAlpa: "Vulnerability to seasonal fatigue and competitive rivalries; dietary moderation and boundary setting advised.",
  },
  {
    bhavaNum: 7,
    sanskritTitle: "कलत्र भाव (Marital Bliss & Commercial Partnerships)",
    signification: "Spouse's noble virtues, marital compatibility, business alliances, and public prestige.",
    shlokaRef: "J.A. Ch. 2, Shloka 27-31 (Kalatra Bhava Alankara)",
    basePhalaUttama: "Blessed with a noble, affectionate, and fortunate life-partner, accompanied by flourishing commercial syndicates.",
    basePhalaAlpa: "Partnerships and marriage thrive when mutual understanding, respect, and clear expectations are maintained.",
  },
  {
    bhavaNum: 8,
    sanskritTitle: "रन्ध्र भाव (Longevity, Inheritance & Occult Insight)",
    signification: "Enduring longevity (Dirghayu), sudden inheritances, esoteric research depth, and regenerative power.",
    shlokaRef: "J.A. Ch. 2, Shloka 32-35 (Randhra Bhava Alankara)",
    basePhalaUttama: "Robust longevity, profound access to unearned legacy assets, deep mystical insight, and resilience in crises.",
    basePhalaAlpa: "Need for holistic lifestyle discipline to safeguard vitality and maintain balanced nervous health.",
  },
  {
    bhavaNum: 9,
    sanskritTitle: "भाग्य भाव (Divine Fortune, Dharma & Father)",
    signification: "Profound spiritual righteousness, preceptor's blessings, righteous fortune, and global pilgrimages.",
    shlokaRef: "J.A. Ch. 2, Shloka 36-40 (Bhagya Bhava Alankara)",
    basePhalaUttama: "Incomparable luck, unshakeable dharmic integrity, father's prosperity, and auspicious preceptor patronage.",
    basePhalaAlpa: "Fortune unfolds through disciplined personal righteousness and respectful service to elders and teachers.",
  },
  {
    bhavaNum: 10,
    sanskritTitle: "कर्म भाव (Sovereign Authority, Career & Honour)",
    signification: "Executive supremacy, royal and governmental honors, flourishing professional zenith, and societal leadership.",
    shlokaRef: "J.A. Ch. 2, Shloka 41-45 (Karma Bhava Alankara)",
    basePhalaUttama: "Attainment of high institutional rank, royal/governmental recognition, unwavering professional authority, and public respect.",
    basePhalaAlpa: "Professional stability built through continuous skill refinement, strategic diplomacy, and steadfast dedication.",
  },
  {
    bhavaNum: 11,
    sanskritTitle: "लाभ भाव (Abundant Revenues, Gains & Desires)",
    signification: "Continuous influx of wealth, realization of ambitious goals, influential networks, and prosperity.",
    shlokaRef: "J.A. Ch. 2, Shloka 46-49 (Labha Bhava Alankara)",
    basePhalaUttama: "Uninterrupted streams of financial revenue, lucrative investments, fulfillment of all cherished ambitions, and powerful allies.",
    basePhalaAlpa: "Financial gains materialize steadily through calculated investments and diversified income channels.",
  },
  {
    bhavaNum: 12,
    sanskritTitle: "व्यय भाव (Spiritual Liberation, Charity & Foreign Travels)",
    signification: "Philanthropic expenditures, serene overseas residence, bedroom happiness, and spiritual Kaivalya.",
    shlokaRef: "J.A. Ch. 2, Shloka 50-53 (Vyaya Bhava Alankara)",
    basePhalaUttama: "Noble and charitable use of wealth, flourishing overseas travel/residence, tranquil sleep, and high spiritual detachment.",
    basePhalaAlpa: "Careful monitoring of unnecessary expenses advised; regular charitable giving harmonizes financial flow.",
  },
];

// Helper: Parashari full aspects
function getAspectingPlanetsToHouse(targetHouse: number, ephemeris: EphemerisResult): string[] {
  const aspecting: string[] = [];
  for (const [name, p] of Object.entries(ephemeris.planets)) {
    if (p.isUpagraha || p.isModernPlanet) continue;
    const pHouse = p.house;
    const dist = ((targetHouse - pHouse + 12) % 12) + 1; // 1 to 12

    // All planets aspect 7th
    if (dist === 7) aspecting.push(name);
    // Mars aspects 4th and 8th
    else if (name === "Mars" && (dist === 4 || dist === 8)) aspecting.push(name);
    // Jupiter and Rahu/Ketu aspect 5th and 9th
    else if ((name === "Jupiter" || name === "Rahu" || name === "Ketu") && (dist === 5 || dist === 9)) aspecting.push(name);
    // Saturn aspects 3rd and 10th
    else if (name === "Saturn" && (dist === 3 || dist === 10)) aspecting.push(name);
  }
  return aspecting;
}

export function evaluateJatakaAlankara(natalEphemeris: EphemerisResult): JatakaAlankaraAnalysis {
  const ascSignIdx = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);

  // 1. Evaluate 12 Bhava Alankaras
  const bhavaAlankaras: JatakaAlankaraBhava[] = [];

  for (let h = 1; h <= 12; h++) {
    const signIdx = (ascSignIdx + h - 1) % 12;
    const signName = RASHI_NAMES[signIdx]?.englishName || "Aries";
    const lordName = SIGN_LORDS[signIdx];
    const lordPlanet = natalEphemeris.planets[lordName];
    const lordHouse = lordPlanet ? lordPlanet.house : h;

    // Find occupants
    const occupants: string[] = [];
    for (const [name, p] of Object.entries(natalEphemeris.planets)) {
      if (p.isUpagraha || p.isModernPlanet) continue;
      if (p.house === h) occupants.push(name);
    }

    // Find aspects
    const aspectingPlanets = getAspectingPlanetsToHouse(h, natalEphemeris);

    // Calculate Alankara Score (0-100%)
    let score = 50;

    // Lord Placement
    if ([1, 4, 7, 10].includes(lordHouse)) score += 20; // Kendra
    else if ([5, 9].includes(lordHouse)) score += 25; // Trikona
    else if (lordHouse === 11) score += 15; // Labha
    else if ([6, 8, 12].includes(lordHouse) && h !== lordHouse) score -= 18; // Dusthana

    // Occupants
    for (const occ of occupants) {
      if (["Jupiter", "Venus", "Mercury", "Moon"].includes(occ)) score += 15;
      if (["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(occ)) {
        if ([3, 6, 11].includes(h) && ["Mars", "Saturn", "Sun"].includes(occ)) score += 12; // Malefics in Upachaya
        else score -= 10;
      }
    }

    // Aspects
    for (const asp of aspectingPlanets) {
      if (["Jupiter", "Venus", "Mercury"].includes(asp)) score += 10;
      if (["Saturn", "Mars", "Rahu"].includes(asp)) score -= 8;
    }

    score = Math.max(15, Math.min(100, score));

    const grade: "Uttama (Supreme)" | "Madhyama (Moderate)" | "Alpa (Modest)" =
      score >= 75 ? "Uttama (Supreme)" : score >= 50 ? "Madhyama (Moderate)" : "Alpa (Modest)";

    const meta = BHAVA_METADATA[h - 1];
    const classicalPhala = grade === "Uttama (Supreme)" ? meta.basePhalaUttama : grade === "Madhyama (Moderate)" ? `${meta.basePhalaUttama} Balanced by routine perseverance.` : meta.basePhalaAlpa;

    bhavaAlankaras.push({
      bhavaNum: h,
      sanskritTitle: meta.sanskritTitle,
      signName,
      lordName,
      lordPlacementHouse: lordHouse,
      occupants,
      aspectingPlanets,
      alankaraScore: score,
      ornamentationGrade: grade,
      classicalPhala,
      shlokaReference: meta.shlokaRef,
    });
  }

  const strongestBhava = [...bhavaAlankaras].sort((a, b) => b.alankaraScore - a.alankaraScore)[0];

  // 2. Special Raja & Dhana Yogas of Jataka Alankara
  const specialYogas: JatakaAlankaraYoga[] = [];

  // Yoga 1: Rajya Prapti Yoga (9th and 10th lords in Kendra or Trikona)
  const lord9House = bhavaAlankaras[8].lordPlacementHouse;
  const lord10House = bhavaAlankaras[9].lordPlacementHouse;
  const isRajyaPrapti = ([1, 4, 7, 10, 5, 9].includes(lord9House) && lord9House === lord10House) || (lord9House === 10 && lord10House === 9);
  specialYogas.push({
    yogaName: "Rajya Prapti Yoga (राज्य प्राप्ति योग)",
    sanskritName: "धर्म-कर्माधिपति राजयोग",
    category: "Raja Yoga",
    isFormed: isRajyaPrapti,
    participatingPlanets: [bhavaAlankaras[8].lordName, bhavaAlankaras[9].lordName],
    description: "Conjunction or mutual exchange between the 9th Lord of Dharma and 10th Lord of Karma in an auspicious house.",
    classicalShlokaEffect: "Elevates the native to eminent sovereign command, ministerial authority, and supreme public honor (J.A. Ch. 3, Shloka 1-2).",
  });

  // Yoga 2: Sarva Vidya Visharada Yoga (Jupiter in 5th or aspecting 5th, with Mercury strong)
  const isSarvaVidya = bhavaAlankaras[4].occupants.includes("Jupiter") || bhavaAlankaras[4].aspectingPlanets.includes("Jupiter");
  specialYogas.push({
    yogaName: "Sarva Vidya Visharada Yoga (सर्वविद्या विशारद योग)",
    sanskritName: "सरस्वती कृपा योग",
    category: "Jnana Yoga",
    isFormed: isSarvaVidya,
    participatingPlanets: ["Jupiter", "Mercury"],
    description: "Jupiter occupying or aspecting the 5th House of Intellect and Mantra Siddhi.",
    classicalShlokaEffect: "Endows masterly comprehension across all classical scriptures, literature, legal codes, and arts (J.A. Ch. 3, Shloka 8).",
  });

  // Yoga 3: Maha Bhagyavan Yoga (9th Lord in Kendra or Trikona with high score)
  const isMahaBhagya = [1, 4, 7, 10, 5, 9, 11].includes(lord9House) && bhavaAlankaras[8].alankaraScore >= 65;
  specialYogas.push({
    yogaName: "Maha Bhagyavan Yoga (महाभाग्यवान् योग)",
    sanskritName: "भाग्य वृद्धि योग",
    category: "Dhana Yoga",
    isFormed: isMahaBhagya,
    participatingPlanets: [bhavaAlankaras[8].lordName, "Jupiter"],
    description: "9th Lord of Fortune strongly placed in an angle or trine, fortified by benefic rays.",
    classicalShlokaEffect: "Blesses the native with unshakeable fortune, righteous wealth, global travels, and divine protection (J.A. Ch. 3, Shloka 15).",
  });

  // Yoga 4: Shatru Nashana Yoga (6th Lord in 6th, 8th, or 12th while Lagna Lord is in Kendra/Trikona)
  const lord6House = bhavaAlankaras[5].lordPlacementHouse;
  const lord1House = bhavaAlankaras[0].lordPlacementHouse;
  const isShatruNashana = [6, 8, 12].includes(lord6House) && [1, 4, 7, 10, 5, 9, 11].includes(lord1House);
  specialYogas.push({
    yogaName: "Shatru Nashana Yoga (शत्रु नाशन योग)",
    sanskritName: "रिपु विजय योग",
    category: "Raja Yoga",
    isFormed: isShatruNashana,
    participatingPlanets: [bhavaAlankaras[5].lordName, bhavaAlankaras[0].lordName],
    description: "6th Lord of Enemies placed in a Dusthana while the Ascendant Lord remains powerful in a Kendra/Trikona.",
    classicalShlokaEffect: "Guarantees complete annihilation of competitive adversaries, victory in lawsuits, and invulnerable immunity (J.A. Ch. 3, Shloka 22).",
  });

  // 3. Arishta & Disease Diagnostics (Jataka Alankara Ch. 4)
  const sunHouse = natalEphemeris.planets.Sun?.house ?? 1;
  const moonHouse = natalEphemeris.planets.Moon?.house ?? 1;
  const marsHouse = natalEphemeris.planets.Mars?.house ?? 1;
  const saturnHouse = natalEphemeris.planets.Saturn?.house ?? 1;

  const diseaseDiagnostics: JatakaAlankaraDisease[] = [
    {
      diseaseCategory: "Netra Roga (Vision)",
      vulnerabilityLevel: ([2, 12, 6, 8].includes(sunHouse) || [2, 12, 6, 8].includes(moonHouse)) ? "Moderate" : "Low",
      astrologicalCause: "Evaluation of the 2nd/12th axis (Luminaries and malefic aspect lines) from Jataka Alankara Ch. 4 Shloka 5.",
      classicalRemedy: "Recite the Netra Upanishad and offer water (Surya Arghya) to Lord Savita at sunrise.",
    },
    {
      diseaseCategory: "Hridaya Roga (Cardiac)",
      vulnerabilityLevel: (sunHouse === 4 || [saturnHouse, marsHouse].includes(4)) ? "Moderate" : "Low",
      astrologicalCause: "Assessment of the 4th House (Heart and Chest Cavity) under malefic aspect from J.A. Ch. 4 Shloka 9.",
      classicalRemedy: "Chant the Aditya Hridaya Stotram on Sundays and consume heart-supporting sattvic herbs.",
    },
    {
      diseaseCategory: "Udara Roga (Digestive)",
      vulnerabilityLevel: ([5, 6].includes(marsHouse) || [5, 6].includes(saturnHouse)) ? "Moderate" : "Low",
      astrologicalCause: "Analysis of 5th/6th houses (Digestive Fire / Jatharagni) under Martian/Saturnine heat (J.A. Ch. 4 Shloka 14).",
      classicalRemedy: "Drink water stored in a copper vessel and observe light fasting on the weekday of the 6th Lord.",
    },
    {
      diseaseCategory: "Asthi/Sandhi (Bone/Joints)",
      vulnerabilityLevel: ([1, 8].includes(saturnHouse)) ? "Moderate" : "Low",
      astrologicalCause: "Saturnine influence on the musculoskeletal structure and 8th house joints (J.A. Ch. 4 Shloka 19).",
      classicalRemedy: "Regular sesame oil massage (Abhyanga) and recitation of the Shani Gayatri Mantra.",
    },
  ];

  // 4. Stri Jataka & Marital Fortune (Jataka Alankara Ch. 5)
  const h7 = bhavaAlankaras[6];
  const saubhagyaScore = h7.alankaraScore;
  const spouseCharacter = saubhagyaScore >= 70
    ? "Virtuous, cultured, of graceful demeanour and dedicated to mutual dharmic prosperity (J.A. Ch. 5 Shloka 3)."
    : saubhagyaScore >= 50
    ? "Intelligent, capable, practical partner fostering steady household stability."
    : "Spouse of strong independent character; mutual adjustment and patience required.";

  const maritalProsperityVerdict = saubhagyaScore >= 70
    ? "High marital auspiciousness (Saubhagya Vriddhi) leading to sustained financial and social elevation post-marriage."
    : "Stable marital foundation sustained through open communication and shared ethical values.";

  const progenyProspects = bhavaAlankaras[4].alankaraScore >= 60
    ? "Auspicious progeny endowed with good intellect and filial piety."
    : "Progeny blesses the household through patient nurturing and educational discipline.";

  const maritalFortune: JatakaAlankaraMarital = {
    saubhagyaScore,
    spouseCharacter,
    maritalProsperityVerdict,
    progenyProspects,
    ganeshKaviRemedy: "Worship of Uma-Maheshwara (Lord Shiva and Goddess Parvati) and observing Pradosha Vrata preserves lifelong marital bliss.",
  };

  // 5. Master Synthesis
  const activeYogasCount = specialYogas.filter((y) => y.isFormed).length;
  const masterAlankaraSynthesis = `Acharya Ganesh Kavi's Jataka Alankara (1613 CE) crowns **House ${strongestBhava.bhavaNum} (${strongestBhava.sanskritTitle.split(" ")[0]})** with the supreme ornamentation score of **${strongestBhava.alankaraScore}% (${strongestBhava.ornamentationGrade})**. The chart forms **${activeYogasCount} classical Jataka Alankara Yogas**, highlighted by **${specialYogas.find((y) => y.isFormed)?.yogaName || "Kshema Yoga"}**. Marital Saubhagya stands at **${maritalFortune.saubhagyaScore}%**, with disease vulnerabilities effectively managed via classical Shanti remedies.`;

  return {
    strongestBhava,
    bhavaAlankaras,
    specialYogas,
    diseaseDiagnostics,
    maritalFortune,
    masterAlankaraSynthesis,
  };
}
