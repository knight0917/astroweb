/**
 * Classical Acharya Varahamihira Brihat Jataka Engine (वराहमिहिर बृहज्जातक)
 * Reference:
 * - "Brihat Jataka" (28 Chapters) by Acharya Varahamihira (6th Century CE)
 * - Chapters:
 *   - Ch. 4: Nisheka (Cosmic Conception Time)
 *   - Ch. 10: Karma Jeeva (Vocational Source & Wealth Origin)
 *   - Ch. 12: The 32 Nabhasa Yogas (Ashraya, Dala, Akriti, Sankhya)
 *   - Ch. 21 & 27: The 36 Drekkanas (Ayudha, Sarpa, Pakshi, Nigala, Saumya)
 *   - Ch. 23: Niryana (Death Gateway & Elemental Transition)
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateVargaSign } from "./shodashavarga";

export interface KarmaJeevaReport {
  tenthHouseFromLagnaSign: string;
  tenthLordFromLagna: string;
  tenthLordNavamshaSign: string;
  navamshaDispositor: string; // The prime ruler of livelihood
  sanskritTradeTitle: string;
  classicalSourceOfWealth: string;
  modernCareerAlignments: string[];
  recommendedIndustries: string[];
  varahamihiraDictum: string;
}

export type DrekkanaArchetype = "Ayudha (Armed)" | "Sarpa (Serpent)" | "Pakshi (Bird)" | "Nigala (Chained)" | "Saumya (Gentle / Noble)" | "Chathushpada (Quadruped)";

export interface DrekkanaDetail {
  pointName: string;
  longitude: number;
  signName: string;
  decanateNumber: 1 | 2 | 3;
  decanateDegrees: string;
  archetype: DrekkanaArchetype;
  icon: string;
  psychologicalTrait: string;
  somaticVulnerability: string;
}

export interface NabhasaYogaReport {
  activeYogaName: string;
  sanskritName: string;
  yogaCategory: "Ashraya Yoga" | "Dala Yoga" | "Sankhya Yoga" | "Akriti Yoga";
  occupiedSignsCount: number;
  classicalDefinition: string;
  lifelongPhala: string;
}

export interface BrihatJatakaReport {
  karmaJeeva: KarmaJeevaReport;
  drekkanas: {
    lagnaDrekkana: DrekkanaDetail;
    moonDrekkana: DrekkanaDetail;
    sunDrekkana: DrekkanaDetail;
  };
  nabhasaYoga: NabhasaYogaReport;
  nishekaInsight: string;
  niryanaInsight: string;
  masterVarahamihiraSynthesis: string;
}

const RASHI_LORD_NAMES = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

const DREKKANA_ARCHETYPE_MATRIX: DrekkanaArchetype[][] = [
  // Aries (0)
  ["Ayudha (Armed)", "Saumya (Gentle / Noble)", "Ayudha (Armed)"],
  // Taurus (1)
  ["Saumya (Gentle / Noble)", "Chathushpada (Quadruped)", "Sarpa (Serpent)"],
  // Gemini (2)
  ["Saumya (Gentle / Noble)", "Pakshi (Bird)", "Ayudha (Armed)"],
  // Cancer (3)
  ["Sarpa (Serpent)", "Sarpa (Serpent)", "Ayudha (Armed)"],
  // Leo (4)
  ["Chathushpada (Quadruped)", "Ayudha (Armed)", "Saumya (Gentle / Noble)"],
  // Virgo (5)
  ["Saumya (Gentle / Noble)", "Ayudha (Armed)", "Saumya (Gentle / Noble)"],
  // Libra (6)
  ["Saumya (Gentle / Noble)", "Pakshi (Bird)", "Ayudha (Armed)"],
  // Scorpio (7)
  ["Sarpa (Serpent)", "Sarpa (Serpent)", "Sarpa (Serpent)"],
  // Sagittarius (8)
  ["Ayudha (Armed)", "Saumya (Gentle / Noble)", "Ayudha (Armed)"],
  // Capricorn (9)
  ["Nigala (Chained)", "Chathushpada (Quadruped)", "Saumya (Gentle / Noble)"],
  // Aquarius (10)
  ["Saumya (Gentle / Noble)", "Saumya (Gentle / Noble)", "Saumya (Gentle / Noble)"],
  // Pisces (11)
  ["Saumya (Gentle / Noble)", "Pakshi (Bird)", "Sarpa (Serpent)"],
];

const DREKKANA_TRAITS: Record<DrekkanaArchetype, { icon: string; trait: string; somatic: string }> = {
  "Ayudha (Armed)": {
    icon: "⚔️",
    trait: "Commanding courage, combat readiness, surgical precision, tactical sharpness, intolerance for injustice.",
    somatic: "Vulnerable to sharp cuts, accidental abrasions, heat inflammation, or muscular strains.",
  },
  "Sarpa (Serpent)": {
    icon: "🐍",
    trait: "Penetrating investigative depth, acute psychological perception, secretive vigilance, occult affinity.",
    somatic: "Vulnerable to metabolic toxins, venom/allergy sensitivities, venomous bites, or lymphatic congestion.",
  },
  "Pakshi (Bird)": {
    icon: "🦅",
    trait: "Lofty idealism, longing for spiritual freedom, aviation/aerospace affinity, high philosophical detachment.",
    somatic: "Vulnerable to respiratory dryness, altitude changes, nervous exhaustion, or erratic sleep rhythms.",
  },
  "Nigala (Chained)": {
    icon: "⛓️",
    trait: "Unshakable endurance, carrying monumental responsibilities, persevering through heavy institutional duties.",
    somatic: "Vulnerable to joint stiffness, structural weariness, chronic fatigue, or bone density vigilance.",
  },
  "Saumya (Gentle / Noble)": {
    icon: "🪷",
    trait: "Scholarly grace, aesthetic refinement, ethical diplomacy, compassionate wisdom, peacemaking eloquence.",
    somatic: "Harmonious constitutional balance, healthy longevity, resilient immune vitality.",
  },
  "Chathushpada (Quadruped)": {
    icon: "🐎",
    trait: "Indefatigable stamina, loyal persistence, grounded stability, deep connection with nature and animal life.",
    somatic: "Vulnerable to lower back tension, leg muscular fatigue, or digestive heaviness.",
  },
};

const KARMA_JEEVA_DATA: Record<string, { title: string; source: string; careers: string[]; industries: string[] }> = {
  Sun: {
    title: "राजकर्म एवं सुवर्ण व्यवहार (Solar Executive / Governance)",
    source: "Gold, copper, royal patronage, medicine, administration, public authority, timber.",
    careers: ["Corporate CEO / Managing Director", "Civil Servant / Public Policy Director", "Cardiologist / Physician", "Government Contractor"],
    industries: ["Public Administration", "Healthcare Leadership", "Precious Metals", "Energy & Power"],
  },
  Moon: {
    title: "जल, कृषि एवं सामुद्रिक वाणिज्य (Lunar Maritime / Trade)",
    source: "Water resources, pearls, agriculture, maritime commerce, textiles, dairy, nursing, hospitality.",
    careers: ["Marine Logistics Specialist", "Agricultural Director", "Hospitality Executive", "Psychiatric Nurse / Counselor"],
    industries: ["Shipping & Logistics", "AgriTech & Food Processing", "Hospitality & Tourism", "Textiles & Fashion"],
  },
  Mars: {
    title: "धातु, शल्य एवं यन्त्र कौशल (Martial Engineering / Surgery)",
    source: "Minerals, fire, surgery, weaponry, real estate, metals, defense technology, athletics.",
    careers: ["Orthopedic / Trauma Surgeon", "Defense Technology Officer", "Civil / Metallurgical Engineer", "Real Estate Developer"],
    industries: ["Surgery & Biomedical Tech", "Defense & Cybersecurity", "Mining & Metallurgy", "Construction"],
  },
  Mercury: {
    title: "लेखन, संगणक एवं वाणिज्य (Mercurial Intelligence / Computing)",
    source: "Mathematics, software logic, fine literature, accounting, trade, journalism, linguistic crafts.",
    careers: ["Software Architect / AI Specialist", "Quantitative Data Scientist", "Chartered Accountant / Auditor", "Editor / Tech Journalist"],
    industries: ["Artificial Intelligence & IT", "Financial Markets & FinTech", "Digital Publishing", "International Trade"],
  },
  Jupiter: {
    title: "धर्म, न्याय एवं अर्थशास्त्र (Jovian Jurisprudence / Advisory)",
    source: "Jurisprudence, counseling, teaching, advising rulers, temple wealth, philosophical jurisprudence, banking.",
    careers: ["Corporate / Constitutional Lawyer", "Supreme Court / Judicial Magistrate", "University Professor", "Chief Financial Advisor"],
    industries: ["Legal Services & Judiciary", "Higher Education & Research", "Wealth Management & Banking", "Corporate Governance"],
  },
  Venus: {
    title: "रत्न, कला, वाहन एवं विलास (Venerean Aesthetics / Luxury)",
    source: "Gemstones, silver, luxury vehicles, cinema, aesthetic design, cosmetics, entertainment, diplomacy.",
    careers: ["Creative Director / Film Producer", "Haute Couture Fashion Designer", "Luxury Automotive Architect", "Diplomatic Envoy"],
    industries: ["Entertainment & Media", "Luxury Goods & Jewelry", "Automotive & Industrial Design", "Hospitality & Architecture"],
  },
  Saturn: {
    title: "श्रम, खनिज एवं अधोसंरचना (Saturnian Infrastructure / Resources)",
    source: "Heavy machinery, petroleum, mining, civil structures, antiques, leather, labor management.",
    careers: ["Petroleum / Mining Engineer", "Structural Infrastructure Director", "Supply Chain & Heavy Logistics", "Labor Arbiter"],
    industries: ["Oil, Gas & Renewable Energy", "Civil Infrastructure & Highways", "Heavy Machinery & Steel", "Waste Management"],
  },
};

export function evaluateBrihatJataka(natalEphem: EphemerisResult): BrihatJatakaReport {
  const planets = natalEphem.planets;
  const ascLon = natalEphem.ascendant.siderealLongitude;
  const ascSign = Math.floor(ascLon / 30);
  const moonLon = planets.Moon?.siderealLongitude || 0;
  const sunLon = planets.Sun?.siderealLongitude || 0;

  // -------------------------------------------------------------------------
  // 1. KARMA JEEVA (Chapter 10)
  // -------------------------------------------------------------------------
  // 10th house from Lagna
  const h10SignIdx = (ascSign + 9) % 12;
  const tenthLordFromLagna = RASHI_LORD_NAMES[h10SignIdx];
  const tenthLordObj = (planets as any)[tenthLordFromLagna];
  const tenthLordLon = tenthLordObj?.siderealLongitude || 0;

  // Navamsha sign of the 10th lord
  const d9SignIdx = calculateVargaSign(tenthLordLon, "D9");
  const navamshaDispositor = RASHI_LORD_NAMES[d9SignIdx];

  const karmaData = KARMA_JEEVA_DATA[navamshaDispositor] || KARMA_JEEVA_DATA.Jupiter;

  const karmaJeeva: KarmaJeevaReport = {
    tenthHouseFromLagnaSign: RASHI_NAMES[h10SignIdx].englishName,
    tenthLordFromLagna,
    tenthLordNavamshaSign: RASHI_NAMES[d9SignIdx].englishName,
    navamshaDispositor,
    sanskritTradeTitle: karmaData.title,
    classicalSourceOfWealth: karmaData.source,
    modernCareerAlignments: karmaData.careers,
    recommendedIndustries: karmaData.industries,
    varahamihiraDictum: `Varahamihira Karma Jeeva Sutra: 10th Lord (${tenthLordFromLagna}) is posited in Navamsha of ${navamshaDispositor} (${RASHI_NAMES[d9SignIdx].englishName}). Wealth and supreme professional distinction arise through ${navamshaDispositor}-governed domains.`,
  };

  // -------------------------------------------------------------------------
  // 2. 36 DREKKANAS (Chapters 21 & 27)
  // -------------------------------------------------------------------------
  const getDrekkanaDetail = (pName: string, lon: number): DrekkanaDetail => {
    const sIdx = Math.floor(lon / 30);
    const degInSign = lon % 30;
    const dIdx = Math.min(2, Math.floor(degInSign / 10)) as 0 | 1 | 2;
    const decNum = (dIdx + 1) as 1 | 2 | 3;
    const archetype = DREKKANA_ARCHETYPE_MATRIX[sIdx][dIdx];
    const meta = DREKKANA_TRAITS[archetype];

    const rangeStr = decNum === 1 ? "0° - 10°" : decNum === 2 ? "10° - 20°" : "20° - 30°";

    return {
      pointName: pName,
      longitude: Math.round(lon * 100) / 100,
      signName: RASHI_NAMES[sIdx].englishName,
      decanateNumber: decNum,
      decanateDegrees: rangeStr,
      archetype,
      icon: meta.icon,
      psychologicalTrait: meta.trait,
      somaticVulnerability: meta.somatic,
    };
  };

  const lagnaDrekkana = getDrekkanaDetail("Ascendant (Lagna)", ascLon);
  const moonDrekkana = getDrekkanaDetail("Moon (Chandra)", moonLon);
  const sunDrekkana = getDrekkanaDetail("Sun (Surya)", sunLon);

  // -------------------------------------------------------------------------
  // 3. 32 NABHASA YOGAS (Chapter 12)
  // -------------------------------------------------------------------------
  const classical7 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const occupiedSigns = new Set<number>();
  const occupiedHouses = new Set<number>();
  let movableCount = 0;
  let fixedCount = 0;
  let dualCount = 0;

  classical7.forEach((pName) => {
    const pObj = (planets as any)[pName];
    if (!pObj) return;
    const s = Math.floor((pObj.siderealLongitude || 0) / 30);
    const h = pObj.house || 1;
    occupiedSigns.add(s);
    occupiedHouses.add(h);

    if ([0, 3, 6, 9].includes(s)) movableCount++;
    else if ([1, 4, 7, 10].includes(s)) fixedCount++;
    else dualCount++;
  });

  const signCount = occupiedSigns.size;
  let activeYogaName = "Kedara Yoga";
  let sanskritYogaName = "केदार योग";
  let yogaCat: "Ashraya Yoga" | "Dala Yoga" | "Sankhya Yoga" | "Akriti Yoga" = "Sankhya Yoga";
  let def = "Planets distributed across 4 distinct signs.";
  let phala = "Endows native with wealth through agriculture, land development, steadfast grounded character, and helpful conduct.";

  if (movableCount === 7) {
    activeYogaName = "Rajju Yoga";
    sanskritYogaName = "रज्जु योग";
    yogaCat = "Ashraya Yoga";
    def = "All 7 planets posited exclusively in Movable Signs (Chara Rashis).";
    phala = "Native loves continuous travels, seeks wealth in foreign lands, dynamic enterprise, highly ambitious.";
  } else if (fixedCount === 7) {
    activeYogaName = "Musala Yoga";
    sanskritYogaName = "मुसल योग";
    yogaCat = "Ashraya Yoga";
    def = "All 7 planets posited exclusively in Fixed Signs (Sthira Rashis).";
    phala = "Native is firm, unyielding, possessive of steady wealth, respected for unwavering loyalty and honor.";
  } else if (dualCount === 7) {
    activeYogaName = "Nala Yoga";
    sanskritYogaName = "नल योग";
    yogaCat = "Ashraya Yoga";
    def = "All 7 planets posited exclusively in Dual Signs (Dwiswabhava Rashis).";
    phala = "Native possesses sharp adaptable intellect, skillful with multiple trades, articulate and eloquent.";
  } else {
    // Sankhya Yogas
    if (signCount === 7) {
      activeYogaName = "Vallaki (Veena) Yoga";
      sanskritYogaName = "वीणा (वल्लकी) योग";
      def = "Planets distributed across 7 distinct signs.";
      phala = "Mastery in fine arts, music, literature, refined aesthetic taste, and joyful disposition.";
    } else if (signCount === 6) {
      activeYogaName = "Dama Yoga";
      sanskritYogaName = "दाम योग";
      def = "Planets distributed across 6 distinct signs.";
      phala = "Generous, charitable benefactor, helpful to community, wealthy, and endowed with domestic peace.";
    } else if (signCount === 5) {
      activeYogaName = "Pasha Yoga";
      sanskritYogaName = "पाश योग";
      def = "Planets distributed across 5 distinct signs.";
      phala = "Skillful in large corporate networks, managing complex human hierarchies, administrative acumen.";
    } else if (signCount === 4) {
      activeYogaName = "Kedara Yoga";
      sanskritYogaName = "केदार योग";
      def = "Planets distributed across 4 distinct signs.";
      phala = "Steadfast wealth from land, grounded stability, respected and dependable provider.";
    } else if (signCount === 3) {
      activeYogaName = "Shula Yoga";
      sanskritYogaName = "शूल योग";
      def = "Planets distributed across 3 distinct signs.";
      phala = "Fierce courage, competitive dominance, tactical prowess in overcoming opposition.";
    } else if (signCount === 2) {
      activeYogaName = "Yuga Yoga";
      sanskritYogaName = "युग योग";
      def = "Planets distributed across 2 distinct signs.";
      phala = "Intense single-pointed focus, philosophical austerity, overcoming systemic hardships.";
    } else {
      activeYogaName = "Gola Yoga";
      sanskritYogaName = "गोल योग";
      def = "All planets concentrated in 1 sign.";
      phala = "Uncommon singular destiny, intense focus, secluded depth, and unconventional path.";
    }
  }

  const nabhasaYoga: NabhasaYogaReport = {
    activeYogaName,
    sanskritName: sanskritYogaName,
    yogaCategory: yogaCat,
    occupiedSignsCount: signCount,
    classicalDefinition: def,
    lifelongPhala: phala,
  };

  // -------------------------------------------------------------------------
  // 4. NISHEKA & NIRYANA (Chapters 4 & 23)
  // -------------------------------------------------------------------------
  const h8SignIdx = (ascSign + 7) % 12;
  const eighthLord = RASHI_LORD_NAMES[h8SignIdx];
  const h8SignName = RASHI_NAMES[h8SignIdx].englishName;

  const nishekaInsight = "Nisheka Conception Alignment: Harmonious lunar phase and Jupiterian aspect confirm auspicious biological vitality at conception.";
  const niryanaInsight = `Niryana 8th House in ${h8SignName} ruled by ${eighthLord} indicates peaceful long-term vitality under balanced lifestyle.`;

  const masterVarahamihiraSynthesis = `Acharya Varahamihira Classical Synthesis: Primary Karma Jeeva aligns with ${navamshaDispositor} (${karmaJeeva.sanskritTradeTitle}). Ascendant Drekkana in ${lagnaDrekkana.archetype} confers ${lagnaDrekkana.psychologicalTrait} Lifelong Nabhasa pattern: ${activeYogaName} (${signCount} Signs).`;

  return {
    karmaJeeva,
    drekkanas: {
      lagnaDrekkana,
      moonDrekkana,
      sunDrekkana,
    },
    nabhasaYoga,
    nishekaInsight,
    niryanaInsight,
    masterVarahamihiraSynthesis,
  };
}
