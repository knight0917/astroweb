/**
 * Bhavartha Ratnakara Engine (भावार्थ रत्नाकर)
 * Reference:
 * - "Bhavartha Ratnakara" by Sri Ramanujacharya, translated with notes by Dr. B.V. Raman.
 *
 * Core Classical Principles:
 * 1. 12 Lagnawise Secret Raja & Dhana Yogas (Adhyayas 1 - 12).
 * 2. Special Dhana Yogas & Poverty Yogas (Adhyaya 13).
 * 3. Dasha-Bhukti Exceptions Overriding Standard Parashari Dictums (Adhyaya 14).
 */

import { EphemerisResult, BhavarthaRatnakaraAnalysis, BhavarthaRatnakaraYoga } from "./types";
import { RASHI_NAMES } from "./constants";

export function evaluateBhavarthaRatnakara(natalEphemeris: EphemerisResult): BhavarthaRatnakaraAnalysis {
  const ascSignIdx = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const ascSign = RASHI_NAMES[ascSignIdx].englishName;
  const planets = natalEphemeris.planets;

  const isConjoined = (p1: string, p2: string) =>
    planets[p1] && planets[p2] && planets[p1].house === planets[p2].house;

  const isMutualAspect = (p1: string, p2: string) => {
    if (!planets[p1] || !planets[p2]) return false;
    const diff = Math.abs(planets[p1].house - planets[p2].house);
    return diff === 6;
  };

  const getHouse = (p: string) => planets[p]?.house || 0;

  const activeYogas: BhavarthaRatnakaraYoga[] = [];
  const dhanaYogas: BhavarthaRatnakaraYoga[] = [];
  const dashaExceptions: BhavarthaRatnakaraYoga[] = [];

  let premierRatnakaraYogakaraka = "Kendra-Trikona Lords";

  // 1. Lagnawise Secret Yogas (Adhyayas 1 to 12)
  if (ascSign === "Aries") {
    premierRatnakaraYogakaraka = "Jupiter (Guru - 9th Lord) & Sun (5th Lord)";
    if (isConjoined("Sun", "Moon")) {
      activeYogas.push({
        yogaName: "Surya-Chandra Raja Yoga (Mesha Lagna)",
        adhyayaNumber: 1,
        category: "Lagna Specific Raja Yoga",
        participatingPlanets: ["Sun", "Moon"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 1, Sloka 1: For Aries, Sun (5th lord) and Moon (4th lord) in conjunction produce immense Raja Yoga.",
        drBvRamanCommentary: "Dr. B.V. Raman: Conjunction of Kendra and Trikona lords in Aries elevates native to regal status and emotional contentment.",
        fruitionStrength: "High (तीव्र)",
      });
    }
    if ([1, 5, 9].includes(getHouse("Jupiter"))) {
      activeYogas.push({
        yogaName: "Guru Bhagya Yoga (Mesha Lagna)",
        adhyayaNumber: 1,
        category: "Lagna Specific Raja Yoga",
        participatingPlanets: ["Jupiter"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 1, Sloka 3: Jupiter as 9th lord in Trikona confers high righteousness, state honors, and wealth.",
        drBvRamanCommentary: "Dr. B.V. Raman: Even though Jupiter owns the 12th house (Pisces), its Moolatrikona in Sagittarius (9th) dominates completely.",
        fruitionStrength: "High (तीव्र)",
      });
    }
  } else if (ascSign === "Taurus") {
    premierRatnakaraYogakaraka = "Saturn (Shani - 9th & 10th Lord)";
    if ([1, 4, 5, 9, 10].includes(getHouse("Saturn"))) {
      activeYogas.push({
        yogaName: "Shani Yoga-Karaka Imperial Yoga (Vrishabha Lagna)",
        adhyayaNumber: 2,
        category: "Lagna Specific Raja Yoga",
        participatingPlanets: ["Saturn"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 2, Sloka 1: For Taurus, Saturn alone as 9th and 10th lord confers sovereign authority and wealth.",
        drBvRamanCommentary: "Dr. B.V. Raman: Saturn is the single most powerful planet for Taurus, acting as a complete Raja-Dhana provider.",
        fruitionStrength: "High (तीव्र)",
      });
    }
    if (isConjoined("Sun", "Mercury")) {
      activeYogas.push({
        yogaName: "Surya-Budha Dhana Yoga (Vrishabha Lagna)",
        adhyayaNumber: 2,
        category: "Special Dhana Yoga",
        participatingPlanets: ["Sun", "Mercury"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 2, Sloka 5: Sun (4th lord) conjoined with Mercury (2nd & 5th lord) generates extraordinary wealth.",
        drBvRamanCommentary: "Dr. B.V. Raman: Conjunction of 2nd/5th lord Mercury with 4th lord Sun confers enduring landed property and sharp commerce.",
        fruitionStrength: "High (तीव्र)",
      });
    }
  } else if (ascSign === "Gemini") {
    premierRatnakaraYogakaraka = "Mercury & Venus Conjunction";
    if (isConjoined("Mercury", "Venus")) {
      activeYogas.push({
        yogaName: "Budha-Shukra Maha Raja Yoga (Mithuna Lagna)",
        adhyayaNumber: 3,
        category: "Lagna Specific Raja Yoga",
        participatingPlanets: ["Mercury", "Venus"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 3, Sloka 1: Mercury (Lagna lord) conjoined with Venus (5th lord) produces immense fame and artistic brilliance.",
        drBvRamanCommentary: "Dr. B.V. Raman: Mercury and Venus form an exquisite Dharma-Karmadhipati combination for Gemini natives.",
        fruitionStrength: "High (तीव्र)",
      });
    }
  } else if (ascSign === "Cancer") {
    premierRatnakaraYogakaraka = "Mars (Mangala - 5th & 10th Lord)";
    if ([1, 4, 5, 7, 9, 10].includes(getHouse("Mars"))) {
      activeYogas.push({
        yogaName: "Kuja Yogakaraka Parakrama Yoga (Karka Lagna)",
        adhyayaNumber: 4,
        category: "Lagna Specific Raja Yoga",
        participatingPlanets: ["Mars"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 4, Sloka 1: For Cancer, Mars owning 5th (Trikona) and 10th (Kendra) is the supreme auspicious benefactor.",
        drBvRamanCommentary: "Dr. B.V. Raman: Mars grants high executive position, real estate mastery, and administrative authority.",
        fruitionStrength: "High (तीव्र)",
      });
    }
    if (isConjoined("Mars", "Moon") || isConjoined("Mars", "Jupiter")) {
      dhanaYogas.push({
        yogaName: "Chandra-Mangala / Guru-Mangala Dhana Yoga (Karka Lagna)",
        adhyayaNumber: 4,
        category: "Special Dhana Yoga",
        participatingPlanets: ["Mars", isConjoined("Mars", "Moon") ? "Moon" : "Jupiter"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 4, Sloka 4: Mars conjoined with Moon or Jupiter confers immense wealth and societal honors.",
        drBvRamanCommentary: "Dr. B.V. Raman: Mars teaming with Lagna lord Moon or 9th lord Jupiter creates multi-generational wealth.",
        fruitionStrength: "High (तीव्र)",
      });
    }
  } else if (ascSign === "Leo") {
    premierRatnakaraYogakaraka = "Mars (Mangala - 4th & 9th Lord)";
    if ([1, 4, 5, 9, 10].includes(getHouse("Mars"))) {
      activeYogas.push({
        yogaName: "Kuja Bhagya-Rajya Yoga (Simha Lagna)",
        adhyayaNumber: 5,
        category: "Lagna Specific Raja Yoga",
        participatingPlanets: ["Mars"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 5, Sloka 1: Mars owning 4th and 9th is the premier Yogakaraka for Leo ascendant.",
        drBvRamanCommentary: "Dr. B.V. Raman: Mars confers ancestral wealth, political backing, and majestic authority for Leo natives.",
        fruitionStrength: "High (तीव्र)",
      });
    }
    if (isConjoined("Mars", "Jupiter")) {
      dhanaYogas.push({
        yogaName: "Kuja-Guru Samrajya Dhana Yoga (Simha Lagna)",
        adhyayaNumber: 5,
        category: "Special Dhana Yoga",
        participatingPlanets: ["Mars", "Jupiter"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 5, Sloka 3: Mars (9th lord) conjoined with Jupiter (5th lord) produces imperial fortune.",
        drBvRamanCommentary: "Dr. B.V. Raman: The 5th and 9th Trikona lords together in Leo establish unbroken prosperity and divine blessings.",
        fruitionStrength: "High (तीव्र)",
      });
    }
  } else if (ascSign === "Virgo") {
    premierRatnakaraYogakaraka = "Mercury & Venus Conjunction";
    if (isConjoined("Mercury", "Venus") || [1, 2, 5, 9].includes(getHouse("Venus"))) {
      activeYogas.push({
        yogaName: "Shukra-Budha Dhana Yoga (Kanya Lagna)",
        adhyayaNumber: 6,
        category: "Special Dhana Yoga",
        participatingPlanets: ["Venus", "Mercury"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 6, Sloka 1: Venus as 2nd and 9th lord in Kendra/Trikona or with Mercury confers immense wealth.",
        drBvRamanCommentary: "Dr. B.V. Raman: Venus is the pivotal wealth planet for Virgo, ruling both Dhana (2nd) and Bhagya (9th).",
        fruitionStrength: "High (तीव्र)",
      });
    }
  } else if (ascSign === "Libra") {
    premierRatnakaraYogakaraka = "Saturn (Shani - 4th & 5th Lord)";
    if ([1, 4, 5, 9, 10].includes(getHouse("Saturn"))) {
      activeYogas.push({
        yogaName: "Shani Yoga-Karaka Empire Yoga (Tula Lagna)",
        adhyayaNumber: 7,
        category: "Lagna Specific Raja Yoga",
        participatingPlanets: ["Saturn"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 7, Sloka 1: Saturn owning 4th (Kendra) and 5th (Trikona) is the premier Yogakaraka for Libra.",
        drBvRamanCommentary: "Dr. B.V. Raman: Saturn exalted in Libra or posited in Kendras/Trikonas guarantees durable power and material comfort.",
        fruitionStrength: "High (तीव्र)",
      });
    }
    if (isConjoined("Saturn", "Mercury") || isMutualAspect("Saturn", "Mercury")) {
      dhanaYogas.push({
        yogaName: "Shani-Budha Maha Dhana Yoga (Tula Lagna)",
        adhyayaNumber: 7,
        category: "Special Dhana Yoga",
        participatingPlanets: ["Saturn", "Mercury"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 7, Sloka 3: Saturn (5th lord) aligned with Mercury (9th lord) produces empire-level prosperity.",
        drBvRamanCommentary: "Dr. B.V. Raman: 5th and 9th lords interacting in Libra create lasting commercial and industrial fortunes.",
        fruitionStrength: "High (तीव्र)",
      });
    }
  } else if (ascSign === "Scorpio") {
    premierRatnakaraYogakaraka = "Jupiter (5th Lord) & Sun (10th Lord)";
    if (isConjoined("Sun", "Moon")) {
      activeYogas.push({
        yogaName: "Surya-Chandra Dharma-Karmadhipati Yoga (Vrischika Lagna)",
        adhyayaNumber: 8,
        category: "Lagna Specific Raja Yoga",
        participatingPlanets: ["Sun", "Moon"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 8, Sloka 1: Sun (10th lord) and Moon (9th lord) in conjunction produce pure Dharma-Karmadhipati Raja Yoga.",
        drBvRamanCommentary: "Dr. B.V. Raman: One of the highest Raja Yogas in astrology, making the native an influential leader and institution builder.",
        fruitionStrength: "High (तीव्र)",
      });
    }
  } else if (ascSign === "Sagittarius") {
    premierRatnakaraYogakaraka = "Sun (9th Lord) & Mars (5th Lord)";
    if (isConjoined("Sun", "Mercury")) {
      activeYogas.push({
        yogaName: "Surya-Budha Raja Yoga (Dhanu Lagna)",
        adhyayaNumber: 9,
        category: "Lagna Specific Raja Yoga",
        participatingPlanets: ["Sun", "Mercury"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 9, Sloka 1: Sun (9th lord) conjoined with Mercury (10th lord) produces Dharma-Karmadhipati Yoga.",
        drBvRamanCommentary: "Dr. B.V. Raman: Outstanding combination for statesmen, jurists, advisors, and high intellectuals.",
        fruitionStrength: "High (तीव्र)",
      });
    }
  } else if (ascSign === "Capricorn") {
    premierRatnakaraYogakaraka = "Venus (Shukra - 5th & 10th Lord)";
    if ([1, 4, 5, 9, 10].includes(getHouse("Venus"))) {
      activeYogas.push({
        yogaName: "Shukra Yogakaraka Samrajya Yoga (Makara Lagna)",
        adhyayaNumber: 10,
        category: "Lagna Specific Raja Yoga",
        participatingPlanets: ["Venus"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 10, Sloka 1: Venus as 5th and 10th lord is the sole premier Yogakaraka for Capricorn.",
        drBvRamanCommentary: "Dr. B.V. Raman: Venus confers massive wealth, artistic refinement, executive authority, and happy conjugal life.",
        fruitionStrength: "High (तीव्र)",
      });
    }
    if (isConjoined("Venus", "Mercury")) {
      dhanaYogas.push({
        yogaName: "Shukra-Budha Dhana Yoga (Makara Lagna)",
        adhyayaNumber: 10,
        category: "Special Dhana Yoga",
        participatingPlanets: ["Venus", "Mercury"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 10, Sloka 4: Venus (5th & 10th lord) conjoined with Mercury (9th lord) creates supreme wealth.",
        drBvRamanCommentary: "Dr. B.V. Raman: The confluence of 5th, 9th, and 10th lordships guarantees monumental commercial triumphs.",
        fruitionStrength: "High (तीव्र)",
      });
    }
  } else if (ascSign === "Aquarius") {
    premierRatnakaraYogakaraka = "Venus (Shukra - 4th & 9th Lord)";
    if ([1, 4, 5, 9, 10].includes(getHouse("Venus"))) {
      activeYogas.push({
        yogaName: "Shukra Bhagya-Kendra Yoga (Kumbha Lagna)",
        adhyayaNumber: 11,
        category: "Lagna Specific Raja Yoga",
        participatingPlanets: ["Venus"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 11, Sloka 1: Venus owning 4th (Kendra) and 9th (Trikona) is the premier Yogakaraka for Aquarius.",
        drBvRamanCommentary: "Dr. B.V. Raman: Venus bestows landed estates, vehicles, high fortune, and philanthropic inclinations.",
        fruitionStrength: "High (तीव्र)",
      });
    }
  } else if (ascSign === "Pisces") {
    premierRatnakaraYogakaraka = "Moon (5th Lord) & Mars (9th Lord)";
    if (isConjoined("Moon", "Mars")) {
      dhanaYogas.push({
        yogaName: "Chandra-Mangala Maha Dhana Yoga (Meena Lagna)",
        adhyayaNumber: 12,
        category: "Special Dhana Yoga",
        participatingPlanets: ["Moon", "Mars"],
        isActive: true,
        classicalSlokaSummary: "Adhyaya 12, Sloka 1: Moon (5th lord) and Mars (2nd & 9th lord) in conjunction create extraordinary wealth.",
        drBvRamanCommentary: "Dr. B.V. Raman: The conjunction of 2nd, 5th, and 9th lords produces persistent financial prosperity.",
        fruitionStrength: "High (तीव्र)",
      });
    }
  }

  // 2. Generic Dhana Yogas (Adhyaya 13)
  if (isConjoined("Jupiter", "Venus")) {
    dhanaYogas.push({
      yogaName: "Devaguru-Daityaguru Conjunction (Adhyaya 13)",
      adhyayaNumber: 13,
      category: "Special Dhana Yoga",
      participatingPlanets: ["Jupiter", "Venus"],
      isActive: true,
      classicalSlokaSummary: "Adhyaya 13, Sloka 8: Conjunction of Jupiter and Venus in any auspicious house confers scholarly wealth and comfort.",
      drBvRamanCommentary: "Dr. B.V. Raman: The two great spiritual preceptors together harmonize wisdom and luxury.",
      fruitionStrength: "Moderate (मध्यम)",
    });
  }

  // 3. Dasha Exceptions Overriding Parashari (Adhyaya 14)
  const dashaExceptionsList: BhavarthaRatnakaraYoga[] = [
    {
      yogaName: "6th/8th/12th Lord Unexpected Fruition Exception",
      adhyayaNumber: 14,
      category: "Dasha Exception / Override",
      participatingPlanets: ["Saturn", "Rahu"],
      isActive: true,
      classicalSlokaSummary: "Adhyaya 14, Sloka 11: A planet owning Dusthana but occupying its own sign or exaltation confers unexpected wealth in its Dasha.",
      drBvRamanCommentary: "Dr. B.V. Raman: Ramanujacharya explicitly notes that strong Dusthana lords shed their sting and produce immense material elevation.",
      fruitionStrength: "High (तीव्र)",
    },
  ];
  dashaExceptions.push(...dashaExceptionsList);

  const totalRules = activeYogas.length + dhanaYogas.length + dashaExceptions.length;

  const masterRatnakaraSynthesis = `Bhavartha Ratnakara Analysis (${ascSign} Lagna per Sri Ramanujacharya & Dr. B.V. Raman): Premier Yogakaraka: **${premierRatnakaraYogakaraka}**. Active Specialized Yogas: **${activeYogas.length} Raja Yogas, ${dhanaYogas.length} Dhana Yogas, and ${dashaExceptions.length} Dasha Exceptions**. Ramanujacharya's dictums highlight special planetary combinations that enhance native's destiny beyond standard Parashari limits.`;

  return {
    ascendantSign: ascSign,
    lagnawiseRulesCount: totalRules,
    activeYogas,
    dhanaYogas,
    dashaExceptions,
    premierRatnakaraYogakaraka,
    masterRatnakaraSynthesis,
  };
}
