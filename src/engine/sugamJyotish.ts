/**
 * Sugam Jyotish (सुगम ज्योतिष — Practical Predictive Astrology Manual)
 * Practical Real-World Astrology Framework
 *
 * Core Classical Pillars:
 * 1. Sugam 12-Bhava Practical Diagnostics (द्वादश भाव व्यावहारिक फल).
 * 2. Baladi Avastha Potency Meter (0%, 10%, 25%, 75%, 100%).
 * 3. Subha & Papa Kartari Flanking Analysis (शुभ/पाप कर्तरी).
 * 4. Sugam Everyday Accessible Remedial Matrix.
 */

import {
  EphemerisResult,
  SugamJyotishAnalysis,
  SugamBhavaDiagnostic,
  SugamBaladiAvastha,
  SugamKartariAnalysis,
  SugamRemedy,
} from "./types";
import { RASHI_NAMES } from "./constants";

const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

const BHAVA_KARAKAS: Record<number, string> = {
  1: "Sun (सूर्य)",
  2: "Jupiter (गुरु)",
  3: "Mars (मंगल)",
  4: "Moon & Venus (चन्द्र/शुक्र)",
  5: "Jupiter (गुरु)",
  6: "Mars & Saturn (मंगल/शनि)",
  7: "Venus (शुक्र)",
  8: "Saturn (शनि)",
  9: "Jupiter (गुरु)",
  10: "Sun & Mercury (सूर्य/बुध)",
  11: "Jupiter (गुरु)",
  12: "Saturn & Ketu (शनि/केतु)",
};

const SUGAM_BHAVA_TITLES = [
  "1. Tanu Bhava (Health, Vitality, Self-Confidence & Stature)",
  "2. Dhana Bhava (Family Savings, Speech Tone & Liquid Wealth)",
  "3. Sahaja Bhava (Courage, Daily Initiative & Sibling Concord)",
  "4. Sukha Bhava (Domestic Peace, Mother, Property & Vehicles)",
  "5. Santana & Buddhi (Intellect, Decision-Making & Children)",
  "6. Roga & Ripu (Immunity, Work Challenges, Debts & Competition)",
  "7. Jaya Bhava (Marital Harmony, Partner Cooperation & Deals)",
  "8. Ayush & Randhra (Longevity, Sudden Transformations & Secrets)",
  "9. Dharma & Bhagya (Higher Luck, Spiritual Faith & Mentors)",
  "10. Karma Bhava (Career Prestige, Professional Drive & Promotion)",
  "11. Labha Bhava (Regular Revenue, Cash Flows & Network Circles)",
  "12. Vyaya Bhava (Expenditure Moderation, Foreign Links & Sleep)",
];

const NATURAL_BENEFICS = ["Jupiter", "Venus", "Mercury", "Moon"];
const NATURAL_MALEFICS = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"];
const VEDIC_9_GRAHAS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

export function evaluateSugamJyotish(natalEphemeris: EphemerisResult): SugamJyotishAnalysis {
  const ascSignIdx = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const jupPlanet = natalEphemeris.planets.Jupiter;
  const venPlanet = natalEphemeris.planets.Venus;

  // 1. 12 Bhavas Practical Diagnostics
  const bhavaDiagnostics: SugamBhavaDiagnostic[] = [];

  for (let h = 1; h <= 12; h++) {
    const signIdx = (ascSignIdx + h - 1) % 12;
    const lordName = SIGN_LORDS[signIdx];
    const lordPlanet = natalEphemeris.planets[lordName];
    const lordHouse = lordPlanet ? lordPlanet.house : h;

    let score = 55;
    if ([1, 4, 7, 10].includes(lordHouse)) score += 25;
    else if ([5, 9].includes(lordHouse)) score += 30;
    else if (lordHouse === 11) score += 20;
    else if ([6, 8, 12].includes(lordHouse)) score -= 15;

    if (jupPlanet && [1, 4, 7, 10, 5, 9].includes(h)) score += 10;
    if (venPlanet && [1, 4, 7, 10, 5, 9].includes(h)) score += 8;

    score = Math.max(20, Math.min(95, score));

    const practicalGrade: SugamBhavaDiagnostic["practicalGrade"] =
      score >= 80
        ? "Ati-Uttama (अति उत्तम)"
        : score >= 65
        ? "Uttama (उत्तम)"
        : score >= 50
        ? "Madhyama (मध्यम)"
        : "Samanya (सामान्य)";

    const practicalOutcome =
      score >= 80
        ? `Exceptionally supportive real-world results. Lord ${lordName} in House ${lordHouse} generates smooth fruition of goals without major resistance.`
        : score >= 65
        ? `Consistently positive results achieved with disciplined effort and practical focus.`
        : `Moderate progress; periodic patience and daily mindfulness recommended.`;

    const actionableAdvice =
      score >= 65
        ? `Strengthen positive momentum by honoring lord ${lordName} through focused weekly routines.`
        : `Apply simple everyday pariharas and avoid impulsive decisions in this domain.`;

    bhavaDiagnostics.push({
      bhavaNum: h,
      sanskritTitle: SUGAM_BHAVA_TITLES[h - 1],
      signName: RASHI_NAMES[signIdx]?.englishName || "Aries",
      lordName,
      karakaPlanet: BHAVA_KARAKAS[h] || "Jupiter",
      practicalScore: score,
      practicalGrade,
      practicalOutcome,
      actionableAdvice,
    });
  }

  // 2. Baladi Avastha Potency Meter
  const baladiAvasthas: SugamBaladiAvastha[] = [];

  for (const pName of VEDIC_9_GRAHAS) {
    const pData = natalEphemeris.planets[pName];
    if (!pData) continue;

    const signIdx = Math.floor(pData.siderealLongitude / 30);
    const isOdd = signIdx % 2 === 0; // 0=Aries (Odd), 1=Taurus (Even), etc.
    const degInSign = pData.siderealLongitude % 30;

    let avasthaName: SugamBaladiAvastha["avasthaName"] = "Yuva (युवा)";
    let potencyPercentage = 100;
    let manifestationSpeed = "100% full capacity and immediate manifestation.";

    if (isOdd) {
      if (degInSign < 6) {
        avasthaName = "Bala (बाल)";
        potencyPercentage = 25;
        manifestationSpeed = "25% infant potency; results mature slowly over time.";
      } else if (degInSign < 12) {
        avasthaName = "Kumara (कुमार)";
        potencyPercentage = 75;
        manifestationSpeed = "75% adolescent potency; strong enthusiasm and quick activation.";
      } else if (degInSign < 18) {
        avasthaName = "Yuva (युवा)";
        potencyPercentage = 100;
        manifestationSpeed = "100% peak youthful vigor; delivers immediate and robust fruits.";
      } else if (degInSign < 24) {
        avasthaName = "Vriddha (वृद्ध)";
        potencyPercentage = 10;
        manifestationSpeed = "10% elder maturity; produces wisdom but delayed physical results.";
      } else {
        avasthaName = "Mrita (मृत)";
        potencyPercentage = 0;
        manifestationSpeed = "0% dormant state; requires conscious strengthening and propitiation.";
      }
    } else {
      if (degInSign < 6) {
        avasthaName = "Mrita (मृत)";
        potencyPercentage = 0;
        manifestationSpeed = "0% dormant state; requires conscious strengthening and propitiation.";
      } else if (degInSign < 12) {
        avasthaName = "Vriddha (वृद्ध)";
        potencyPercentage = 10;
        manifestationSpeed = "10% elder maturity; produces wisdom but delayed physical results.";
      } else if (degInSign < 18) {
        avasthaName = "Yuva (युवा)";
        potencyPercentage = 100;
        manifestationSpeed = "100% peak youthful vigor; delivers immediate and robust fruits.";
      } else if (degInSign < 24) {
        avasthaName = "Kumara (कुमार)";
        potencyPercentage = 75;
        manifestationSpeed = "75% adolescent potency; strong enthusiasm and quick activation.";
      } else {
        avasthaName = "Bala (बाल)";
        potencyPercentage = 25;
        manifestationSpeed = "25% infant potency; results mature slowly over time.";
      }
    }

    baladiAvasthas.push({
      planetName: pName,
      degreesInSign: Number(degInSign.toFixed(2)),
      avasthaName,
      potencyPercentage,
      manifestationSpeed,
    });
  }

  // 3. Subha & Papa Kartari Flanking Analysis
  const getHousePlanets = (hNum: number) => {
    return Object.entries(natalEphemeris.planets)
      .filter(([_, p]) => p.house === hNum)
      .map(([name]) => name);
  };

  const lagna12th = getHousePlanets(12);
  const lagna2nd = getHousePlanets(2);

  const hasBeneficIn12th = lagna12th.some((p) => NATURAL_BENEFICS.includes(p));
  const hasBeneficIn2nd = lagna2nd.some((p) => NATURAL_BENEFICS.includes(p));
  const hasMaleficIn12th = lagna12th.some((p) => NATURAL_MALEFICS.includes(p));
  const hasMaleficIn2nd = lagna2nd.some((p) => NATURAL_MALEFICS.includes(p));

  let lagnaKartari: SugamKartariAnalysis["kartariType"] = "Neutral / Open (तटस्थ)";
  let lagnaEffect = "Ascendant is flanked by neutral configurations; native operates with normal free will.";

  if (hasBeneficIn12th && hasBeneficIn2nd) {
    lagnaKartari = "Subha Kartari (शुभ कर्तरी - Fortified Protection)";
    lagnaEffect = "Ascendant is protected by auspicious flanking benefics; confers continuous ease, comfort, and protection.";
  } else if (hasMaleficIn12th && hasMaleficIn2nd) {
    lagnaKartari = "Papa Kartari (पाप कर्तरी - Afflicted Flanking)";
    lagnaEffect = "Ascendant is flanked by malefics; requires mindfulness against unnecessary anxieties and stress.";
  }

  const kartariAnalysis: SugamKartariAnalysis[] = [
    {
      focusBhava: "1st House (Lagna / Self)",
      kartariType: lagnaKartari,
      flankingPlanets12th: lagna12th,
      flankingPlanets2nd: lagna2nd,
      effectSummary: lagnaEffect,
    },
  ];

  // 4. Practical Everyday Remedial Matrix
  const practicalRemedies: SugamRemedy[] = [
    {
      grahaName: "Surya (Sun)",
      easyRemedy: "Offer water (Arghya) in a copper vessel to rising Sun each morning.",
      mantra: "Om Ghrinih Suryaya Namah (ॐ घृणिः सूर्याय नमः) - 11 times",
      donationItem: "Wheat, jaggery, or copper vessel on Sundays.",
      behavioralParihara: "Wake up near sunrise and maintain respectful regard for father and elders.",
    },
    {
      grahaName: "Chandra (Moon)",
      easyRemedy: "Drink water from a silver cup and avoid wasting milk or drinking water.",
      mantra: "Om Som Somaya Namah (ॐ सों सोमाय नमः) - 11 times",
      donationItem: "Milk, rice, or white sweets on Mondays.",
      behavioralParihara: "Touch mother's feet for blessings and practice mindful emotional calmness.",
    },
    {
      grahaName: "Mangala (Mars)",
      easyRemedy: "Recite Hanuman Chalisa daily and avoid unnecessary arguments.",
      mantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah (ॐ क्रां क्रीं क्रौं सः भौमाय नमः)",
      donationItem: "Red lentils (Masoor dal) or sweet rotis on Tuesdays.",
      behavioralParihara: "Channel physical energy through regular exercise and maintain cordial sibling ties.",
    },
    {
      grahaName: "Budha (Mercury)",
      easyRemedy: "Care for green household plants (Tulsi) and feed green grass/spinach to cows.",
      mantra: "Om Bum Budhaya Namah (ॐ बुं बुधाय नमः) - 11 times",
      donationItem: "Whole green gram (Moong dal) or green fruits on Wednesdays.",
      behavioralParihara: "Speak truthfully, maintain organized financial accounts, and respect daughters/aunts.",
    },
    {
      grahaName: "Guru (Jupiter)",
      easyRemedy: "Apply a small saffron or turmeric tilak on forehead each morning.",
      mantra: "Om Gram Greem Groum Sah Gurave Namah (ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः)",
      donationItem: "Yellow chana dal, bananas, or yellow clothes on Thursdays.",
      behavioralParihara: "Honor teachers, mentors, and practice moral, righteous conduct.",
    },
    {
      grahaName: "Shukra (Venus)",
      easyRemedy: "Wear clean, fragrant clothes and maintain pleasant, gracious hospitality.",
      mantra: "Om Shum Shukraya Namah (ॐ शुं शुक्राय नमः) - 11 times",
      donationItem: "Pure cow ghee, white rice, or curd on Fridays.",
      behavioralParihara: "Treat spouse and women with deep respect and avoid squandering resources.",
    },
    {
      grahaName: "Shani (Saturn)",
      easyRemedy: "Light a mustard oil lamp (Deepam) near a Peepal tree or Shani temple on Saturday evenings.",
      mantra: "Om Sham Shanaishcharaya Namah (ॐ शं शनैश्चराय नमः) - 11 times",
      donationItem: "Black sesame seeds (Til), mustard oil, or blue/black blankets to laborers.",
      behavioralParihara: "Be kind to working-class laborers, practice disciplined patience, and never cheat anyone.",
    },
    {
      grahaName: "Rahu",
      easyRemedy: "Feed birds with bajra (millet) and keep the home free of non-working electronic junk.",
      mantra: "Om Bhram Bhreem Bhroum Sah Rahave Namah (ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः)",
      donationItem: "Radish, coconut, or dark blankets on Wednesdays/Saturdays.",
      behavioralParihara: "Maintain clean electrical wires at home and avoid deceitful or intoxicant habits.",
    },
    {
      grahaName: "Ketu",
      easyRemedy: "Feed stray multi-colored dogs with bread/roti and recite Ganesh Atharvashirsha.",
      mantra: "Om Stram Streem Stroum Sah Ketave Namah (ॐ स्रां स्रीं स्रौं सः केतवे नमः)",
      donationItem: "Black & white sesame seeds or yellow bananas on Thursdays.",
      behavioralParihara: "Practice quiet meditation, detachment from ego, and serve spiritual ascetics.",
    },
  ];

  // Master Synthesis
  const topBhavas = bhavaDiagnostics.filter((b) => b.practicalScore >= 75).length;
  const yuvaGrahas = baladiAvasthas.filter((b) => b.avasthaName.includes("Yuva")).map((b) => b.planetName).join(", ") || "Active Grahas";

  const masterSugamSynthesis = `Sugam Jyotish practical analysis indicates **${topBhavas} of 12 Bhavas operating in High Real-World Potency**. Peak 100% capacity (*Yuva Avastha*) active for **${yuvaGrahas}**. Ascendant Kartari status is **${lagnaKartari.split(" (")[0]}**, ensuring stability when supported by simple daily pariharas.`;

  return {
    bhavaDiagnostics,
    baladiAvasthas,
    kartariAnalysis,
    practicalRemedies,
    masterSugamSynthesis,
  };
}
