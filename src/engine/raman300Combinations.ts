/**
 * Dr. B.V. Raman 300 Important Combinations, Lal Kitab Tevas & Narayana Kavacham Engine
 * References:
 * - "300 Important Combinations" by Dr. B.V. Raman
 * - "Lal Kitab Kundli Types & Teva Diagnostics"
 * - "Sri Narayana Kavacham" (Srimad Bhagavatam Canto 6, Ch. 8)
 */

import { EphemerisResult, Raman300Analysis, RamanCombinationYoga, LalKitabAnalysis, LalKitabTevaType, NarayanaKavachamAnalysis, NarayanaKavachamShield } from "./types";
import { RASHI_NAMES } from "./constants";

export function evaluateRaman300Combinations(ephemeris: EphemerisResult): Raman300Analysis {
  const planets = ephemeris.planets;
  const ascLon = ephemeris.ascendant.siderealLongitude;
  const ascRashiIdx = Math.floor(ascLon / 30);

  const getHouse = (pName: string): number => planets[pName]?.house || 1;
  const getLordOfHouse = (hNum: number): string => {
    const targetSignIdx = (ascRashiIdx + hNum - 1) % 12;
    return RASHI_NAMES[targetSignIdx].lord;
  };

  const l1Lord = getLordOfHouse(1);
  const l2Lord = getLordOfHouse(2);
  const l4Lord = getLordOfHouse(4);
  const l5Lord = getLordOfHouse(5);
  const l6Lord = getLordOfHouse(6);
  const l7Lord = getLordOfHouse(7);
  const l9Lord = getLordOfHouse(9);
  const l10Lord = getLordOfHouse(10);
  const l11Lord = getLordOfHouse(11);

  const allYogas: RamanCombinationYoga[] = [
    {
      combinationNumber: 45,
      yogaName: "Parijata Yoga",
      sanskritTitle: "पारिजात योग",
      category: "Raja Yoga",
      isActive: [1, 4, 5, 7, 9, 10, 11].includes(getHouse(l1Lord)),
      potencyScore: 92,
      classicalFormula: "Dispositor of Lagna Lord's dispositor is posited in a Kendra, Trikona, or own/exalted sign.",
      lifeFruition: "Steady mid-life rise, royal honors, expansive estates, and permanent societal reputation.",
    },
    {
      combinationNumber: 46,
      yogaName: "Parvata Yoga",
      sanskritTitle: "पर्वत योग",
      category: "Raja Yoga",
      isActive: [1, 4, 7, 10].includes(getHouse(l1Lord)) && [1, 4, 7, 10, 5, 9].includes(getHouse(l9Lord)),
      potencyScore: 88,
      classicalFormula: "Benefics occupy Kendras while 6th and 8th houses are unoccupied or aspected by benefics.",
      lifeFruition: "Unshakable authority, civic leadership, charitable disposition, and landed wealth.",
    },
    {
      combinationNumber: 47,
      yogaName: "Kahala Yoga",
      sanskritTitle: "काहल योग",
      category: "Raja Yoga",
      isActive: [1, 4, 7, 10].includes(getHouse(l4Lord)) && [1, 4, 7, 10].includes(getHouse(l9Lord)),
      potencyScore: 85,
      classicalFormula: "4th and 9th lords in mutual Kendras with Lagna lord fortified.",
      lifeFruition: "Dynamic executive command, enterprise, commanding presence, and organizational dominance.",
    },
    {
      combinationNumber: 48,
      yogaName: "Chamara Yoga",
      sanskritTitle: "चामर योग",
      category: "Raja Yoga",
      isActive: [1, 4, 7, 10].includes(getHouse(l1Lord)) && (getHouse("Jupiter") === 1 || getHouse("Jupiter") === getHouse(l1Lord)),
      potencyScore: 95,
      classicalFormula: "Lagna Lord exalted or in own sign in Kendra, aspected or conjoined by Jupiter.",
      lifeFruition: "Philosophical eloquence, academic leadership, state honors, and long virtuous life.",
    },
    {
      combinationNumber: 49,
      yogaName: "Dhenu Yoga",
      sanskritTitle: "धेनु योग",
      category: "Dhana Yoga",
      isActive: [1, 2, 4, 5, 7, 9, 10, 11].includes(getHouse(l2Lord)),
      potencyScore: 90,
      classicalFormula: "2nd lord fortified in Kendra or Trikona aspected by natural benefics.",
      lifeFruition: "Vast immovable property, agricultural/real estate wealth, sweet speech, and high pedigree.",
    },
    {
      combinationNumber: 50,
      yogaName: "Pushkala Yoga",
      sanskritTitle: "पुष्कल योग",
      category: "Dhana Yoga",
      isActive: [1, 4, 7, 10].includes(getHouse(l1Lord)) && [1, 4, 7, 10].includes(getHouse("Moon")),
      potencyScore: 86,
      classicalFormula: "Lagna Lord and Moon in Kendras, aspected by natural benefics.",
      lifeFruition: "Magnetic public charm, sweet words, administrative respect, and financial abundance.",
    },
    {
      combinationNumber: 112,
      yogaName: "Srikanta Yoga",
      sanskritTitle: "श्रीकण्ठ योग (Lord Shiva's Grace)",
      category: "Spiritual / Wisdom",
      isActive: [1, 4, 5, 7, 9, 10].includes(getHouse(l1Lord)) && [1, 4, 5, 7, 9, 10].includes(getHouse("Sun")),
      potencyScore: 94,
      classicalFormula: "Lagna Lord, Sun, and Moon occupy Kendra or Trikona in high dignity.",
      lifeFruition: "Supreme intellect, devout devotion to Lord Shiva, luminous aura, and fearless character.",
    },
    {
      combinationNumber: 113,
      yogaName: "Srinatha Yoga",
      sanskritTitle: "श्रीनाथ योग (Lord Vishnu's Grace)",
      category: "Dhana Yoga",
      isActive: [9, 10].includes(getHouse(l7Lord)) && [1, 4, 5, 7, 9, 10, 11].includes(getHouse("Venus")),
      potencyScore: 96,
      classicalFormula: "7th lord in 10th house while 9th and 10th lords are fortified.",
      lifeFruition: "Blessings of Goddess Lakshmi, boundless commercial prosperity, luxurious vehicles, and joy.",
    },
    {
      combinationNumber: 114,
      yogaName: "Viranchi Yoga",
      sanskritTitle: "विरञ्चि योग (Lord Brahma's Grace)",
      category: "Spiritual / Wisdom",
      isActive: [1, 4, 5, 7, 9, 10].includes(getHouse(l5Lord)) && [1, 4, 5, 7, 9, 10].includes(getHouse("Jupiter")),
      potencyScore: 92,
      classicalFormula: "5th lord, Jupiter, and Saturn in mutual Kendras or Trikonas.",
      lifeFruition: "Master scholar of sciences and scriptures, flawless wisdom, enduring disciples, and long life.",
    },
    {
      combinationNumber: 125,
      yogaName: "Saraswati Yoga",
      sanskritTitle: "सरस्वती योग",
      category: "Spiritual / Wisdom",
      isActive: [1, 2, 4, 5, 7, 9, 10].includes(getHouse("Mercury")) && [1, 2, 4, 5, 7, 9, 10].includes(getHouse("Jupiter")) && [1, 2, 4, 5, 7, 9, 10].includes(getHouse("Venus")),
      potencyScore: 95,
      classicalFormula: "Mercury, Jupiter, and Venus occupy Kendras, Trikonas, or 2nd house with Jupiter strong.",
      lifeFruition: "Master of speech, celebrated author/thinker, poetic genius, and universal scholastic respect.",
    },
    {
      combinationNumber: 127,
      yogaName: "Vasumati Yoga",
      sanskritTitle: "वसुमति योग",
      category: "Dhana Yoga",
      isActive: [3, 6, 10, 11].includes(getHouse("Jupiter")) || [3, 6, 10, 11].includes(getHouse("Venus")),
      potencyScore: 91,
      classicalFormula: "Natural benefics occupy Upachaya houses (3, 6, 10, 11) from Lagna or Moon.",
      lifeFruition: "Inexhaustible self-earned wealth, independent enterprise, and financial sovereignty.",
    },
  ];

  const activeYogas = allYogas.filter((y) => y.isActive);
  const premierYoga = activeYogas[0] || allYogas[0];

  const rajaYogas = activeYogas.filter((y) => y.category === "Raja Yoga");
  const dhanaYogas = activeYogas.filter((y) => y.category === "Dhana Yoga");
  const rajaYogaScore = Math.min(100, rajaYogas.length * 30 + 35);
  const dhanaYogaScore = Math.min(100, dhanaYogas.length * 30 + 35);

  const masterRamanSynthesis = `Dr. B.V. Raman 300 Important Combinations identifies ${activeYogas.length} active classical yogas. Premier configuration is **${premierYoga.yogaName} (${premierYoga.sanskritTitle})**, establishing high Raja Yoga potency (${rajaYogaScore}%) and Dhana Yoga resilience (${dhanaYogaScore}%).`;

  return {
    activeYogas,
    totalActiveCount: activeYogas.length,
    premierYoga,
    rajaYogaScore,
    dhanaYogaScore,
    masterRamanSynthesis,
  };
}

// ----------------------------------------------------
// LAL KITAB TEVA ARCHETYPES & DIAGNOSTICS
// ----------------------------------------------------

export function evaluateLalKitabTeva(ephemeris: EphemerisResult): LalKitabAnalysis {
  const planets = ephemeris.planets;
  const jupHouse = planets.Jupiter?.house || 1;
  const moonHouse = planets.Moon?.house || 1;
  const sunHouse = planets.Sun?.house || 1;
  const saturnHouse = planets.Saturn?.house || 1;
  const h10Planets = Object.values(planets).filter((p) => p.house === 10);

  let tevaType: LalKitabTevaType = "Kayam Teva (कायम तेवा - Established)";
  let tevaSignification = "Planets are seated in mutually supportive houses, generating steady karmic flow.";

  if (jupHouse === 10 || moonHouse === 4 || moonHouse === 9) {
    tevaType = "Dharmi Teva (धर्मी तेवा - Divinely Protected)";
    tevaSignification = "Supreme divine shield. In moments of extreme crisis, unseen help and protective grace naturally intervene.";
  } else if (h10Planets.length === 0 || (sunHouse === 10 && saturnHouse === 10)) {
    tevaType = "Andhi Kundli (अन्धी कुण्डली - Blind Chart)";
    tevaSignification = "10th house requires energetic activation through dedicated ethical work and pariharas.";
  } else if ((sunHouse === 1 || sunHouse === 7) && saturnHouse === 4) {
    tevaType = "Ratandhi Kundli (रतौंधी - Night Blind)";
    tevaSignification = "Daytime initiatives prosper effortlessly; night-time negotiations require careful verification.";
  }

  const karmicRinaDebts: string[] = [
    "Pitru Rina (Ancestral Debt): Clear by offering water to Peepal tree and donating whole wheat.",
    "Matru Rina (Maternal Debt): Clear by honoring mother figures and feeding silver coin to running water.",
    "Sva Rina (Self Debt): Clear by adhering to unbending ethical truth in all commercial contracts.",
  ];

  const targetedLalKitabRemedies: string[] = [
    "💧 **Flowing Water Parihara:** Float yellow flowers or copper coins in running river on Thursdays for Jupiter blessings.",
    "🐕 **Seva to Animals:** Feed roti to stray dogs on Saturdays to neutralize Saturn/Rahu friction.",
    "🕊️ **Bird Feeding:** Offer mixed grains (Satnaja) to birds on rooftop at dawn for Mercury mental clarity.",
    "🪔 **Saffron Tilak:** Apply saffron (kesar) or turmeric tilak on forehead and navel every morning.",
  ];

  const masterLalKitabSynthesis = `Lal Kitab diagnostic classifies the chart as **${tevaType}**. ${tevaSignification}`;

  return {
    tevaType,
    tevaSignification,
    karmicRinaDebts,
    targetedLalKitabRemedies,
    masterLalKitabSynthesis,
  };
}

// ----------------------------------------------------
// SRI NARAYANA KAVACHAM 9-GRAHA ARMOR
// ----------------------------------------------------

export function evaluateNarayanaKavacham(ephemeris: EphemerisResult): NarayanaKavachamAnalysis {
  const shields: NarayanaKavachamShield[] = [
    {
      planetName: "Sun (Surya)",
      narayanaForm: "Lord Rama & Aditya Narayana",
      sanskritArmorVerse: "रामोऽद्रिकूटेष्वथ विप्रवासे प्रसादयन्मां भरतानुजोऽव्यात्",
      protectiveShieldBenefit: "Bestows royal protection, soul radiance, and leadership victory over adversaries.",
    },
    {
      planetName: "Moon (Chandra)",
      narayanaForm: "Lord Krishna & Matsya Avatara",
      sanskritArmorVerse: "जलेषु मां रक्षतु मत्स्यमूर्तिर्यादोगणेभ्यो वरूणस्य पाशात्",
      protectiveShieldBenefit: "Protects emotional mind, eliminates fears, and ensures deep mental tranquility.",
    },
    {
      planetName: "Mars (Mangala)",
      narayanaForm: "Lord Narasimha",
      sanskritArmorVerse: "दिक्षु विदिक्षूर्ध्वमधः समन्तादन्तर्बहिर्भगवान् नारसिंहः",
      protectiveShieldBenefit: "Supreme shield against enmities, physical dangers, lawsuits, and sudden accidents.",
    },
    {
      planetName: "Mercury (Budha)",
      narayanaForm: "Lord Buddha & Narayana",
      sanskritArmorVerse: "नारायणः परं ब्रह्म तत्त्वं नारायणः परः",
      protectiveShieldBenefit: "Awakens discriminating intellect (Viveka), eloquence, and trade prosperity.",
    },
    {
      planetName: "Jupiter (Guru)",
      narayanaForm: "Lord Vamana & Hayagriva",
      sanskritArmorVerse: "द्विजेषु मां रक्षतु वामनाख्यस्त्रिविक्रमः खेऽवतु विश्वरूपः",
      protectiveShieldBenefit: "Grants supreme wisdom, spiritual preceptor grace, and divine fortune.",
    },
    {
      planetName: "Venus (Shukra)",
      narayanaForm: "Lord Parashurama & Lakshmi Narayana",
      sanskritArmorVerse: "जामदग्न्यः प्रसादयतु मां सर्वशत्रुविमर्दनः",
      protectiveShieldBenefit: "Harmonizes marital love, artistic joy, liquid wealth, and sensory purity.",
    },
    {
      planetName: "Saturn (Shani)",
      narayanaForm: "Lord Kurma",
      sanskritArmorVerse: "कूर्मोऽधस्तान्मां पातु शेषः पृथिव्याम्",
      protectiveShieldBenefit: "Sustains patience, long-term foundation, longevity, and removes chronic fatigue.",
    },
    {
      planetName: "Rahu",
      narayanaForm: "Lord Varaha",
      sanskritArmorVerse: "वाराहरूपी भगवान् महीं समुद्धरन् रसातलात्",
      protectiveShieldBenefit: "Lifts the native from lowest depths, dissolves illusions, and grants material success.",
    },
    {
      planetName: "Ketu",
      narayanaForm: "Lord Kalki & Matsya",
      sanskritArmorVerse: "कल्किः प्रमादात् पातु धर्मगोप्ता",
      protectiveShieldBenefit: "Bestows spiritual detachment, occult perception, and ultimate Moksha liberation.",
    },
  ];

  const supremeProtectorForm = "Lord Narasimha & Aditya Narayana (Supreme Dual Shield)";
  const masterKavachamSynthesis = "Sri Narayana Kavacham provides complete 9-Graha spiritual armor, neutralizing planetary doshas through the divine vibrations of Srimad Bhagavatam.";

  return {
    shields,
    supremeProtectorForm,
    masterKavachamSynthesis,
  };
}
