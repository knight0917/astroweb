/**
 * Maharshi Bhrigu Samhita Engine (महर्षि भृगु संहिता)
 * Reference:
 * - "Bhrigu Samhita" by Dr. T.M. Rao / Maharshi Bhrigu
 *
 * Core Classical Principles:
 * 1. 12 Bhavas Karmic Planetary Readings per Maharshi Bhrigu.
 * 2. 6 Past-Life Sins & Karmic Debts (Pitru, Matru, Bhratri, Stri, Brahma Hatya, Sarpa Rinas).
 * 3. Classical Bhrigu Samhita Scriptural Pariharas (दान, जप, तीर्थ एवं सेवा).
 */

import {
  EphemerisResult,
  BhriguSamhitaAnalysis,
  BhriguKarmicDebt,
  BhriguBhavaKarmicReading,
} from "./types";

const BHAVA_NAMES = [
  "Tanu Bhava (Self & Vitality)",
  "Dhana Bhava (Wealth & Speech)",
  "Sahaja Bhava (Courage & Siblings)",
  "Sukha Bhava (Mother & Homeland)",
  "Putra Bhava (Progeny & Intellect)",
  "Ari Bhava (Debts & Enemies)",
  "Yuvati Bhava (Spouse & Partnership)",
  "Randhra Bhava (Longevity & Occult)",
  "Dharma Bhava (Fortune & Guru)",
  "Karma Bhava (Career & Authority)",
  "Labha Bhava (Gains & Network)",
  "Vyaya Bhava (Expenditure & Moksha)",
];

export function evaluateBhriguSamhita(natalEphemeris: EphemerisResult): BhriguSamhitaAnalysis {
  const planets = natalEphemeris.planets;

  const sunObj = planets.Sun;
  const moonObj = planets.Moon;
  const marsObj = planets.Mars;
  const jupObj = planets.Jupiter;
  const venObj = planets.Venus;
  const satObj = planets.Saturn;
  const rahuObj = planets.Rahu;
  const ketuObj = planets.Ketu;

  // Helper to check conjunction in same house
  const isConjoined = (p1Name: string, p2Name: string) => {
    const p1 = planets[p1Name];
    const p2 = planets[p2Name];
    return p1 && p2 && p1.house === p2.house;
  };

  // 1. Evaluate 6 Karmic Debts (Purva Janma Rinas)
  const karmicDebts: BhriguKarmicDebt[] = [];

  // A. Pitru Rina (Paternal Debt)
  const isPitruSevere = isConjoined("Sun", "Rahu") || isConjoined("Sun", "Saturn") || (sunObj && [6, 8, 12].includes(sunObj.house) && isConjoined("Sun", "Ketu"));
  const isPitruMod = !isPitruSevere && (sunObj?.house === 9 && (rahuObj?.house === 9 || satObj?.house === 9));
  karmicDebts.push({
    debtName: "Pitru Rina (पितृ ऋण - Paternal Debt)",
    isAfflicted: isPitruSevere || isPitruMod,
    severity: isPitruSevere ? "Severe (गम्भीर)" : isPitruMod ? "Moderate (मध्यम)" : "Clear / Unafflicted (ऋण मुक्त)",
    afflictingPlanets: isPitruSevere ? ["Sun", isConjoined("Sun", "Rahu") ? "Rahu" : "Saturn"] : [],
    karmicReason: "Past-life disrespect to father, lineage ancestors (Pitris), or spiritual teachers; neglect of ancestral shraddha duties.",
    symptomsInCurrentLife: "Struggles with state authority, obstacles in career recognition, eye weaknesses, friction with elders/father.",
    bhriguSamhitaRemedy: "Perform Pitru Gayatri japa, offer water (Tarpan) to Sun in copper vessel with red flowers at sunrise, and organize Annadaanam at holy riverbank.",
  });

  // B. Matru Rina (Maternal Debt)
  const isMatruSevere = isConjoined("Moon", "Ketu") || (moonObj && isConjoined("Moon", "Mars") && [6, 8, 12].includes(moonObj.house));
  const isMatruMod = !isMatruSevere && (moonObj?.house === 4 && (ketuObj?.house === 4 || marsObj?.house === 4));
  karmicDebts.push({
    debtName: "Matru Rina (मातृ ऋण - Maternal Debt)",
    isAfflicted: isMatruSevere || isMatruMod,
    severity: isMatruSevere ? "Severe (गम्भीर)" : isMatruMod ? "Moderate (मध्यम)" : "Clear / Unafflicted (ऋण मुक्त)",
    afflictingPlanets: isMatruSevere ? ["Moon", "Ketu"] : [],
    karmicReason: "Past-life emotional pain inflicted upon mother, maternal relatives, or mistreatment of pure water sources/cows.",
    symptomsInCurrentLife: "Emotional turbulence, restlessness of subconscious mind, lack of domestic peace, respiratory sensitivities.",
    bhriguSamhitaRemedy: "Touch mother's feet daily for blessings, offer milk to Shivling on Mondays, donate silver coin in flowing river, and serve white cows.",
  });

  // C. Bhratri Rina (Sibling Debt)
  const isBhratriSevere = isConjoined("Mars", "Rahu") || (marsObj && [6, 8, 12].includes(marsObj.house) && isConjoined("Mars", "Saturn"));
  const isBhratriMod = !isBhratriSevere && (marsObj?.house === 3 && rahuObj?.house === 3);
  karmicDebts.push({
    debtName: "Bhratri Rina (भ्रातृ ऋण - Sibling Debt)",
    isAfflicted: isBhratriSevere || isBhratriMod,
    severity: isBhratriSevere ? "Severe (गम्भीर)" : isBhratriMod ? "Moderate (मध्यम)" : "Clear / Unafflicted (ऋण मुक्त)",
    afflictingPlanets: isBhratriSevere ? ["Mars", "Rahu"] : [],
    karmicReason: "Past-life land dispute, breach of trust with brothers/friends, or abuse of physical strength.",
    symptomsInCurrentLife: "Property disputes, blood/muscular inflammation, mistrust among comrades, sudden financial friction with siblings.",
    bhriguSamhitaRemedy: "Recite Hanuman Chalisa daily, donate red lentils (masoor dal) and sweet jaggery on Tuesdays, maintain peaceful conduct with brothers.",
  });

  // D. Stri Rina (Spouse / Female Debt)
  const isStriSevere = isConjoined("Venus", "Rahu") || isConjoined("Venus", "Ketu") || (venObj && [6, 8, 12].includes(venObj.house) && isConjoined("Venus", "Mars"));
  const isStriMod = !isStriSevere && (venObj?.house === 7 && (rahuObj?.house === 7 || ketuObj?.house === 7));
  karmicDebts.push({
    debtName: "Stri Rina (स्त्री ऋण - Spouse/Female Debt)",
    isAfflicted: isStriSevere || isStriMod,
    severity: isStriSevere ? "Severe (गम्भीर)" : isStriMod ? "Moderate (मध्यम)" : "Clear / Unafflicted (ऋण मुक्त)",
    afflictingPlanets: isStriSevere ? ["Venus", isConjoined("Venus", "Rahu") ? "Rahu" : "Ketu"] : [],
    karmicReason: "Past-life infidelity, mistreatment of women, or disrespect to holy married women (Sumangalis).",
    symptomsInCurrentLife: "Marital delays, lack of conjugal bliss, financial dissipation on fleeting pleasures, reproductive vulnerabilities.",
    bhriguSamhitaRemedy: "Offer white sweets and cosmetics to 9 young girls (Kanya Seva) on Fridays, worship Goddess Lakshmi, treat spouse with utmost reverence.",
  });

  // E. Brahma Hatya Rina (Guru / Scholar Debt)
  const isBrahmaSevere = isConjoined("Jupiter", "Rahu") || (jupObj && [6, 8, 12].includes(jupObj.house) && isConjoined("Jupiter", "Saturn"));
  const isBrahmaMod = !isBrahmaSevere && (jupObj?.house === 9 && rahuObj?.house === 9);
  karmicDebts.push({
    debtName: "Brahma Hatya Rina (ब्रह्म हत्या ऋण - Guru/Scholar Debt)",
    isAfflicted: isBrahmaSevere || isBrahmaMod,
    severity: isBrahmaSevere ? "Severe (गम्भीर)" : isBrahmaMod ? "Moderate (मध्यम)" : "Clear / Unafflicted (ऋण मुक्त)",
    afflictingPlanets: isBrahmaSevere ? ["Jupiter", "Rahu"] : [],
    karmicReason: "Past-life disrespect to preceptors, violation of sacred vows, destroying sacred scriptures, or misleading disciples.",
    symptomsInCurrentLife: "Obstacles in higher learning, progeny complications, loss of spiritual peace, cynicism towards dharma.",
    bhriguSamhitaRemedy: "Plant and nurture a Peepal or Banyan tree, donate yellow cloth, gold or turmeric to learned spiritual seekers on Thursdays, chant Guru Gayatri.",
  });

  // F. Sarpa Rina (Serpent Curse)
  const isSarpaSevere = (rahuObj?.house === 5 || ketuObj?.house === 5) || (rahuObj?.house === 1 && ketuObj?.house === 7);
  karmicDebts.push({
    debtName: "Sarpa Rina (सर्प ऋण - Serpent Curse)",
    isAfflicted: isSarpaSevere,
    severity: isSarpaSevere ? "Moderate (मध्यम)" : "Clear / Unafflicted (ऋण मुक्त)",
    afflictingPlanets: isSarpaSevere ? ["Rahu", "Ketu"] : [],
    karmicReason: "Past-life destruction of serpent nests, harming reptiles, or excessive greed blocking family lineage.",
    symptomsInCurrentLife: "Obstacles in conceiving progeny, frequent skin allergies, venomous phobias, recurring dreams of snakes.",
    bhriguSamhitaRemedy: "Perform Nag Pratishtha or Sarpa Sukta recitation at sacred pilgrimage, offer milk to snakes on Nag Panchami, chant Maha Mrityunjaya Mantra.",
  });

  // 2. 12 Bhavas Karmic Readings
  const bhavaReadings: BhriguBhavaKarmicReading[] = [];

  for (let h = 1; h <= 12; h++) {
    const occupying = Object.entries(planets)
      .filter(([name, p]) => p.house === h && !p.isModernPlanet && !p.isUpagraha)
      .map(([name]) => name);

    const bhavaName = BHAVA_NAMES[h - 1] || `Bhava ${h}`;
    let karmicImprint = "Neutral karmic slate; outcomes depend on lord's dignity and ongoing dasha cycles.";
    let bhriguDictum = `Maharshi Bhrigu: House ${h} reflects karmic seeds of ${bhavaName}.`;

    if (occupying.includes("Sun")) {
      karmicImprint = "Solar Karmic Seal: Soul has taken rebirth to master righteous leadership and transcend egoic pride.";
      bhriguDictum = `Bhrigu Samhita Ch. ${h}: Sun here confers regal authority, self-respect, and strong vitality if unafflicted.`;
    } else if (occupying.includes("Jupiter")) {
      karmicImprint = "Divine Grace Seal: Accumulation of past-life meritorious deeds (Purva Punya) providing spiritual protection.";
      bhriguDictum = `Bhrigu Samhita Ch. ${h}: Jupiter radiates divine benevolence, high scholarship, and moral fortitude across this house.`;
    } else if (occupying.includes("Saturn")) {
      karmicImprint = "Karmic Debt Retribution: House demanding intense patience, humble labor, and disciplined detachment.";
      bhriguDictum = `Bhrigu Samhita Ch. ${h}: Saturn imposes delays and austere discipline to burn off lingering karmas before rewarding stability.`;
    } else if (occupying.includes("Rahu")) {
      karmicImprint = "Unfulfilled Material Desire: Soul's obsessive evolutionary frontier in current incarnation.";
      bhriguDictum = `Bhrigu Samhita Ch. ${h}: Rahu creates unconventional breakthroughs, foreign connections, and sudden ascents.`;
    }

    bhavaReadings.push({
      bhava: h,
      bhavaName,
      occupyingPlanets: occupying,
      karmicImprint,
      bhriguDictum,
    });
  }

  // Master Synthesis
  const afflictedDebts = karmicDebts.filter((d) => d.isAfflicted).map((d) => d.debtName.split(" (")[0]);
  const dominantTheme = afflictedDebts.length > 0
    ? `Active Karmic Debts: **${afflictedDebts.join(", ")}** requiring conscious remedial neutralization.`
    : "Karmically Clear Horoscope: Minimal major past-life curses detected; smooth evolutionary path.";

  const masterSamhitaSynthesis = `Maharshi Bhrigu Samhita Synthesis: ${dominantTheme} Core karmic anchor placed in House ${jupObj?.house || 1} (Jupiter) and House ${satObj?.house || 10} (Saturn). Scriptural remedies emphasize Tarpan, Annadaanam, and Kanya Seva.`;

  return {
    karmicDebts,
    bhavaReadings,
    dominantPastLifeTheme: dominantTheme,
    masterSamhitaSynthesis,
  };
}
