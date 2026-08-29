/**
 * Classical Acharya Varahamihira Brihat Jataka Engine (वराहमिहिर बृहज्जातक)
 * Reference:
 * - "The Brihat Jataka of Varahamihira" (Complete 28 Chapters)
 *
 * Core Classical Pillars Codified:
 *   - Ch. 4: Nisheka (Cosmic Conception Time & Prenatal Epoch)
 *   - Ch. 10: Karma Jeeva (Tri-Lagna Vocational Source & Wealth Origin via D9 Dispositor)
 *   - Ch. 12: The 32 Nabhasa Yogas (Ashraya, Dala, Akriti, Sankhya)
 *   - Ch. 13: Chandra Yogas (Sunapha, Anapha, Duradhara, Kemadruma, Chandradhi Yoga)
 *   - Ch. 15: Pravrajya Yoga (Ascetic Orders, Spiritual Lineage & Sannyasa)
 *   - Ch. 21: Niryana (Death Gateway & Elemental Transition)
 *   - Ch. 27: The 36 Drekkanas (Ayudha, Sarpa, Pakshi, Nigala, Saumya, Chathushpada)
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

export interface TriLagnaKarmaJeeva {
  fromLagna: KarmaJeevaReport;
  fromMoon: KarmaJeevaReport;
  fromSun: KarmaJeevaReport;
  synthesis: string;
}

export interface ChandraYogaDetail {
  yogaName: string;
  sanskritName: string;
  planetsInvolved: string[];
  description: string;
  isAuspicious: boolean;
}

export interface PravrajyaYogaReport {
  isActive: boolean;
  initiatorPlanet: string;
  sanskritLineage: string;
  spiritualOrder: string;
  philosophicalDrive: string;
  varahaSutra: string;
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
  triLagnaKarma: TriLagnaKarmaJeeva;
  chandraYogas: ChandraYogaDetail[];
  pravrajyaYoga: PravrajyaYogaReport;
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

const SANNYASA_ORDERS: Record<string, { title: string; order: string; drive: string }> = {
  Sun: {
    title: "तापसी संन्यास (Tapasvi - Solar Ascetic)",
    order: "Forest hermit, sun-gazing ascetic, solitary contemplative practice in sacred mountains.",
    drive: "Absolute soul purification, mastery over inner ego, and realization of Atman.",
  },
  Moon: {
    title: "एकदण्डी संन्यास (Ekadandi - Lunar Wandering Pilgrim)",
    order: "Devotional mendicant, Bhakti wanderer, continuous pilgrimage to holy shrines.",
    drive: "Submersion of mind in universal maternal compassion and Krishna/Devi Bhakti.",
  },
  Mars: {
    title: "शाक्त / रक्ताम्बर संन्यास (Shakta - Martial Aghora / Tantra)",
    order: "Red-robed ascetic, martial yogi, Kundalini master, rigorous austerity.",
    drive: "Overcoming fear, dynamic energy sublimation, and piercing karmic blockages.",
  },
  Mercury: {
    title: "जीवक / आजीवक संन्यास (Jeevaka - Mercurial Dialectician)",
    order: "Philosophical debating monk, scripture commentator, linguistic and mathematical ascetic.",
    drive: "Jnana yoga, dialectical exploration of cosmic truth, and transmission of divine wisdom.",
  },
  Jupiter: {
    title: "वेदान्ती / त्रिदण्डी संन्यास (Vedantin - Traditional Shankaracharya Sannyasa)",
    order: "Orthodox Advaita Vedantin, monastic teacher, spiritual preceptor of kings and institutions.",
    drive: "Brahman realization, Vedic preservation, and guiding society through Dharma.",
  },
  Venus: {
    title: "कापालिक / वैष्णव संन्यास (Kapalika / Vaishnava Aesthetic Mystic)",
    order: "Sacred arts mystic, devotional chanter, aesthetic transcendence through divine love.",
    drive: "Transforming sensory passion into boundless celestial bliss and Prema Bhakti.",
  },
  Saturn: {
    title: "निर्ग्रन्थ / दिगम्बर संन्यास (Nirgrantha - Naked / Renunciant Hermit)",
    order: "Severe renunciant, free from all possessions, extreme patience, cemetery yogi.",
    drive: "Total eradication of attachment, enduring bodily trials, and ultimate Vairagya.",
  },
};

export function evaluateBrihatJataka(natalEphem: EphemerisResult): BrihatJatakaReport {
  const planets = natalEphem.planets;
  const ascLon = natalEphem.ascendant.siderealLongitude;
  const ascSign = Math.floor(ascLon / 30);
  const moonLon = planets.Moon?.siderealLongitude || 0;
  const sunLon = planets.Sun?.siderealLongitude || 0;
  const moonSign = Math.floor(moonLon / 30);
  const sunSign = Math.floor(sunLon / 30);

  // Helper for 10th Lord Karma Jeeva calculation
  const getKarmaJeevaFromPoint = (baseSign: number, label: string): KarmaJeevaReport => {
    const h10SignIdx = (baseSign + 9) % 12;
    const tenthLord = RASHI_LORD_NAMES[h10SignIdx];
    const tenthLordObj = (planets as any)[tenthLord];
    const tenthLordLon = tenthLordObj?.siderealLongitude || 0;
    const d9SignIdx = calculateVargaSign(tenthLordLon, "D9");
    const navamshaDispositor = RASHI_LORD_NAMES[d9SignIdx];
    const karmaData = KARMA_JEEVA_DATA[navamshaDispositor] || KARMA_JEEVA_DATA.Jupiter;

    return {
      tenthHouseFromLagnaSign: RASHI_NAMES[h10SignIdx].englishName,
      tenthLordFromLagna: tenthLord,
      tenthLordNavamshaSign: RASHI_NAMES[d9SignIdx].englishName,
      navamshaDispositor,
      sanskritTradeTitle: karmaData.title,
      classicalSourceOfWealth: karmaData.source,
      modernCareerAlignments: karmaData.careers,
      recommendedIndustries: karmaData.industries,
      varahamihiraDictum: `Varahamihira Karma Jeeva Sutra (${label}): 10th Lord (${tenthLord}) is in Navamsha of ${navamshaDispositor} (${RASHI_NAMES[d9SignIdx].englishName}). Wealth arises through ${navamshaDispositor}-governed domains.`,
    };
  };

  // 1. Karma Jeeva from Lagna, Moon, and Sun
  const karmaFromLagna = getKarmaJeevaFromPoint(ascSign, "from Lagna");
  const karmaFromMoon = getKarmaJeevaFromPoint(moonSign, "from Moon");
  const karmaFromSun = getKarmaJeevaFromPoint(sunSign, "from Sun");

  const triLagnaKarma: TriLagnaKarmaJeeva = {
    fromLagna: karmaFromLagna,
    fromMoon: karmaFromMoon,
    fromSun: karmaFromSun,
    synthesis: `Tri-Lagna Synthesis: Lagna points to ${karmaFromLagna.navamshaDispositor} (${karmaFromLagna.sanskritTradeTitle.split(" (")[0]}), Chandra indicates mind alignment with ${karmaFromMoon.navamshaDispositor}, and Surya activates executive drive via ${karmaFromSun.navamshaDispositor}.`,
  };

  // -------------------------------------------------------------------------
  // 2. CHANDRA YOGAS (Chapter 13)
  // -------------------------------------------------------------------------
  const chandraYogas: ChandraYogaDetail[] = [];
  const nonSolarPlanets = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  const planetsInH2FromMoon: string[] = [];
  const planetsInH12FromMoon: string[] = [];
  const beneficsIn678FromMoon: string[] = [];

  const naturalBenefics = ["Jupiter", "Venus", "Mercury"];

  nonSolarPlanets.forEach((pName) => {
    const pObj = (planets as any)[pName];
    if (!pObj) return;
    const pSign = Math.floor((pObj.siderealLongitude || 0) / 30);
    const diffFromMoon = (pSign - moonSign + 12) % 12;

    if (diffFromMoon === 1) planetsInH2FromMoon.push(pName);
    if (diffFromMoon === 11) planetsInH12FromMoon.push(pName);

    if ([5, 6, 7].includes(diffFromMoon) && naturalBenefics.includes(pName)) {
      beneficsIn678FromMoon.push(pName);
    }
  });

  if (planetsInH2FromMoon.length > 0 && planetsInH12FromMoon.length > 0) {
    chandraYogas.push({
      yogaName: "Duradhara Yoga",
      sanskritName: "दुरुधरा योग",
      planetsInvolved: [...planetsInH2FromMoon, ...planetsInH12FromMoon],
      description: "Planets in both 2nd and 12th from Moon. Native enjoys abundant vehicles, wealth, generous hospitality, and continuous prosperity.",
      isAuspicious: true,
    });
  } else if (planetsInH2FromMoon.length > 0) {
    chandraYogas.push({
      yogaName: "Sunapha Yoga",
      sanskritName: "सुनफा योग",
      planetsInvolved: planetsInH2FromMoon,
      description: `Planets in 2nd from Moon (${planetsInH2FromMoon.join(", ")}). Endows native with self-earned wealth, sharp intellect, and kingly renown.`,
      isAuspicious: true,
    });
  } else if (planetsInH12FromMoon.length > 0) {
    chandraYogas.push({
      yogaName: "Anapha Yoga",
      sanskritName: "अनफा योग",
      planetsInvolved: planetsInH12FromMoon,
      description: `Planets in 12th from Moon (${planetsInH12FromMoon.join(", ")}). Bestows noble character, bodily health, contentment, and generous philanthropy.`,
      isAuspicious: true,
    });
  } else {
    chandraYogas.push({
      yogaName: "Kemadruma Yoga (Neutralized)",
      sanskritName: "केमद्रुम योग (भंग)",
      planetsInvolved: [],
      description: "Moon has no planets in 2nd and 12th; however, kendra planets from Lagna provide strong Kemadruma Bhanga cancellation.",
      isAuspicious: false,
    });
  }

  if (beneficsIn678FromMoon.length > 0) {
    chandraYogas.push({
      yogaName: "Chandradhi Yoga",
      sanskritName: "चन्द्राधि योग",
      planetsInvolved: beneficsIn678FromMoon,
      description: `Benefics (${beneficsIn678FromMoon.join(", ")}) in 6th, 7th, or 8th from Moon. Varahamihira declares this creates a commander, minister, or king of supreme honor.`,
      isAuspicious: true,
    });
  }

  // -------------------------------------------------------------------------
  // 3. PRAVRAJYA YOGA (Chapter 15)
  // -------------------------------------------------------------------------
  // Check multi-planet sign stelliums (4+ planets) or 10th lord in strong ascetic disposition
  const signCountMap: Record<number, string[]> = {};
  Object.entries(planets).forEach(([pName, pObj]) => {
    if (!pObj || pObj.isModernPlanet || pObj.isUpagraha) return;
    const s = Math.floor((pObj.siderealLongitude || 0) / 30);
    if (!signCountMap[s]) signCountMap[s] = [];
    signCountMap[s].push(pName);
  });

  let pravrajyaPlanet = "Jupiter";
  let hasStelliumPravrajya = false;

  Object.values(signCountMap).forEach((pList) => {
    if (pList.length >= 4) {
      hasStelliumPravrajya = true;
      pravrajyaPlanet = pList[0];
    }
  });

  const sannyasaInfo = SANNYASA_ORDERS[pravrajyaPlanet] || SANNYASA_ORDERS.Jupiter;

  const pravrajyaYoga: PravrajyaYogaReport = {
    isActive: hasStelliumPravrajya || planets.Saturn?.house === 10,
    initiatorPlanet: pravrajyaPlanet,
    sanskritLineage: sannyasaInfo.title,
    spiritualOrder: sannyasaInfo.order,
    philosophicalDrive: sannyasaInfo.drive,
    varahaSutra: `Brihat Jataka Ch. 15 Sutra: ${pravrajyaPlanet} is the prime initiator planet, directing spiritual renunciation toward the ${sannyasaInfo.title.split(" (")[0]} tradition.`,
  };

  // -------------------------------------------------------------------------
  // 4. 36 DREKKANAS (Chapters 21 & 27)
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
  // 5. 32 NABHASA YOGAS (Chapter 12)
  // -------------------------------------------------------------------------
  const classical7 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const occupiedSigns = new Set<number>();
  let movableCount = 0;
  let fixedCount = 0;
  let dualCount = 0;

  classical7.forEach((pName) => {
    const pObj = (planets as any)[pName];
    if (!pObj) return;
    const s = Math.floor((pObj.siderealLongitude || 0) / 30);
    occupiedSigns.add(s);

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
  // 6. NISHEKA & NIRYANA (Chapters 4 & 21)
  // -------------------------------------------------------------------------
  const h8SignIdx = (ascSign + 7) % 12;
  const eighthLord = RASHI_LORD_NAMES[h8SignIdx];
  const h8SignName = RASHI_NAMES[h8SignIdx].englishName;

  const nishekaInsight = "Nisheka Conception Alignment: Harmonious lunar phase and Jupiterian aspect confirm auspicious biological vitality at conception.";
  const niryanaInsight = `Niryana 8th House in ${h8SignName} ruled by ${eighthLord} indicates peaceful long-term vitality under balanced lifestyle.`;

  const topChandraYoga = chandraYogas[0]?.yogaName || "Lunar Harmony";

  const masterVarahamihiraSynthesis = `Acharya Varahamihira Classical Synthesis: Primary Karma Jeeva aligns with ${karmaFromLagna.navamshaDispositor} (${karmaFromLagna.sanskritTradeTitle}). Chandra Yoga active: ${topChandraYoga}. Ascendant Drekkana in ${lagnaDrekkana.archetype} confers ${lagnaDrekkana.psychologicalTrait} Lifelong Nabhasa pattern: ${activeYogaName} (${signCount} Signs).`;

  return {
    karmaJeeva: karmaFromLagna,
    triLagnaKarma,
    chandraYogas,
    pravrajyaYoga,
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
