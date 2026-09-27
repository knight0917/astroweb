/**
 * Classical Vedic Natal Panchanga Deep Synthesis & Dagdha Rashi Engine
 * (पञ्चाङ्ग तत्व, दग्ध राशि, विपरीत राजयोग, योगी-अवयोगी एवं मन्त्र विज्ञान)
 *
 * Shastric Foundations:
 * - Session 46: Panchang Foundations, 5 Elemental Limbs (Kshiti, Jala, Pavaka, Gagana, Sameera),
 *   Body Organs (Sensory & Working), and Weekday Lord house placement revealing lifelong core desires.
 * - Session 47: Panchak Constellations (5x multiplication effect), 28th Lost Nakshatra Abhijit
 *   (Sahadeva/Krishna victory history), and the 15 Tithi Presiding Deities.
 * - Session 48: Tithi Elemental Classes (Nanda, Bhadra, Jaya, Rikta, Poorna), Complete Dagdha Rashis
 *   (Burnt Signs) matrix, and Predictive Rules:
 *     1. Dagdha in Dusthanas (6th, 8th, 12th) forming exceptional Viparita Raja Yoga.
 *     2. Retrograde planet in Dagdha sign working tenaciously to overcome burnout.
 *     3. Dagdha in Kendras/Trikonas causing initial setbacks healing through Amavasya/Purnima sadhana.
 * - Session 49: 11 Karans, Mantra Science (Svaha, Phat, Namaha), Three-Tier Vishnu Armor,
 *   and Yogi, Sahayogi & Avayogi calculations (+6 constellations forward).
 * - Session 96: Sunrise Tithi Archetypes (Purna, Kshaya, Vriddhi) and Deity Healing Invocations.
 * - Session 98: Deep Karan dynamics (Mars governance, physical execution of effort, "Karama Pradhana",
 *   and de-stigmatization of the 4 Fixed Karans: Shakuni, Chatushpada, Naga, Kimstughna).
 */

import { EphemerisResult, CelestialBodyPosition } from "./types";
import { RASHI_NAMES, NAKSHATRA_NAMES } from "./constants";

// ==========================================
// 1. INTERFACES & TYPES
// ==========================================

export type PanchangaElement = "Agni" | "Prithvi" | "Vayu" | "Jala" | "Akasha";

export interface ElementalLimbInfo {
  limb: "Vara" | "Karan" | "Nakshatra" | "Tithi" | "Yoga";
  limbHindi: string;
  name: string;
  element: PanchangaElement;
  elementHindi: string;
  dimension: string;
  sensoryOrgan: string;
  workingOrgan: string;
  governingPlanets: string[];
  nativeLord: string;
  nativeHouse: number;
  shastricGuidance: string;
}

export interface WeekdayDesireAnalysis {
  weekday: string;
  weekdayHindi: string;
  weekdayLord: string;
  lordHouse: number;
  lordSign: string;
  isLordRetrograde: boolean;
  coreLifelongDesire: string;
  desireTheme: string;
  fulfillmentPathway: string;
}

export interface TithiPresidingDeityInfo {
  tithiNumber: number; // 1 to 15
  tithiName: string;
  paksha: "Shukla" | "Krishna";
  category: "Nanda" | "Bhadra" | "Jaya" | "Rikta" | "Poorna";
  categoryHindi: string;
  element: PanchangaElement;
  elementHindi: string;
  presidingDeity: string;
  deityRole: string;
  healingInvocation: string;
  healingMantra: string;
  spanType: "Purna Tithi" | "Kshaya Tithi" | "Vriddhi Tithi";
  karmicLesson: string;
}

export interface DagdhaSignDetail {
  signIndex: number;
  signName: string;
  signHindi: string;
  houseFromLagna: number;
  isViparitaRajaYoga: boolean;
  viparitaRationale?: string;
  isKendraTrikonaAfflicted: boolean;
  occupyingPlanets: Array<{
    name: string;
    isRetrograde: boolean;
    remediationStatus: "Overcomes Burnout (Asset)" | "Burnt Vitality (Needs Sadhana)";
    impact: string;
  }>;
  houseSignifications: string;
  remedialAction: string;
}

export interface DagdhaRashiAnalysis {
  tithiNumber: number;
  tithiName: string;
  hasDagdhaSigns: boolean;
  burntSignNames: string[];
  dagdhaSigns: DagdhaSignDetail[];
  viparitaYogaActive: boolean;
  viparitaDescription?: string;
  kendraTrikonaAfflictionsCount: number;
  spiritualHealingPrescription: string;
}

export interface YogiAvayogiAnalysis {
  sunLongitude: number;
  moonLongitude: number;
  yogiPointLongitude: number;
  yogiDegreeFormatted: string;
  yogiSign: string;
  yogiSignIndex: number;
  yogiSignLord: string; // Sahayogi
  yogiNakshatra: string;
  yogiNakshatraIndex: number;
  yogiPlanet: string; // Yogi Planet (Nakshatra lord)
  yogiRole: string;
  sahayogiPlanet: string;
  sahayogiRole: string;
  avayogiNakshatra: string; // +6 constellations forward
  avayogiNakshatraIndex: number;
  avayogiPlanet: string;
  avayogiRole: string;
  avayogiHouse: number;
  consciousRefinementAdvice: string;
}

export interface KaranMarsExecutionAnalysis {
  karanName: string;
  karanIndex: number;
  karanType: "Movable (Chara)" | "Fixed (Sthira)";
  karanLord: string;
  karanLordHouse: number;
  marsHouse: number;
  marsSign: string;
  marsDignity: string;
  isFixedDeStigmatized: boolean;
  fixedArchetypeSummary?: string;
  workExecutionStyle: string;
  deliveryObstacle: string;
  optimalExecutionEnvironment: string;
}

export interface PanchakAbhijitAnalysis {
  moonNakshatra: string;
  moonNakshatraIndex: number;
  moonPada: number;
  isPanchakBirth: boolean;
  panchakCategory?: string;
  panchakMultiplier: string;
  isAbhijitZone: boolean;
  abhijitSignificance: string;
}

export interface ThreeTierVishnuArmor {
  mantraPhoneticsRule: string;
  tier1Physical: {
    mantra: string;
    mantraDevanagari: string;
    target: string;
    guidance: string;
  };
  tier2Mental: {
    mantra: string;
    mantraDevanagari: string;
    target: string;
    guidance: string;
  };
  tier3Spiritual: {
    mantra: string;
    mantraDevanagari: string;
    target: string;
    guidance: string;
  };
  prescribedFocus: string;
}

export interface NatalPanchangaDeepReport {
  elementalLimbs: ElementalLimbInfo[];
  dominantElement: PanchangaElement;
  deficientElement: PanchangaElement;
  weekdayDesire: WeekdayDesireAnalysis;
  tithiDeity: TithiPresidingDeityInfo;
  dagdhaAnalysis: DagdhaRashiAnalysis;
  yogiAvayogi: YogiAvayogiAnalysis;
  karanExecution: KaranMarsExecutionAnalysis;
  panchakAbhijit: PanchakAbhijitAnalysis;
  vishnuArmor: ThreeTierVishnuArmor;
  overallSynthesis: string;
}

// ==========================================
// 2. CLASSICAL REFERENCE MATRICES
// ==========================================

// Dagdha Rashis (Burnt Signs) lookup for Tithis 1 to 15 (Index 0 = Tithi 1 / Pratipada)
// Note: Tithi 15 (Purnima) and Tithi 30 (Amavasya) have NO Dagdha signs.
export const DAGDHA_RASHIS_BY_TITHI: Record<number, number[]> = {
  1: [6, 9], // Libra (6) & Capricorn (9)
  2: [8, 11], // Sagittarius (8) & Pisces (11)
  3: [4, 9], // Leo (4) & Capricorn (9)
  4: [1, 10], // Taurus (1) & Aquarius (10)
  5: [2, 5], // Gemini (2) & Virgo (5)
  6: [0, 4], // Aries (0) & Leo (4)
  7: [3, 8], // Cancer (3) & Sagittarius (8)
  8: [2, 5], // Gemini (2) & Virgo (5)
  9: [4, 7], // Leo (4) & Scorpio (7)
  10: [4, 7], // Leo (4) & Scorpio (7)
  11: [6, 9], // Libra (6) & Capricorn (9)
  12: [0, 6], // Aries (0) & Libra (6)
  13: [1, 4], // Taurus (1) & Leo (4)
  14: [2, 5, 8, 11], // Gemini (2), Virgo (5), Sagittarius (8), Pisces (11) - All 4 Dual signs
  15: [], // Purnima - No Dagdha signs
};

// 15 Tithi Presiding Deities & Categories (Sessions 47, 48, 96)
export const TITHI_METADATA: Record<
  number,
  {
    name: string;
    category: "Nanda" | "Bhadra" | "Jaya" | "Rikta" | "Poorna";
    categoryHindi: string;
    element: PanchangaElement;
    elementHindi: string;
    presidingDeity: string;
    deityRole: string;
    healingInvocation: string;
    healingMantra: string;
    karmicLesson: string;
  }
> = {
  1: {
    name: "Pratipada",
    category: "Nanda",
    categoryHindi: "नन्दा (आनन्ददायिनी)",
    element: "Agni",
    elementHindi: "अग्नि तत्व",
    presidingDeity: "Agni Devata (अग्नि)",
    deityRole: "Cosmic transformer, burner of karmic dross, guardian of sacred initiatives.",
    healingInvocation: "Offer ghee or camphor into fire; maintain internal mental enthusiasm without anger.",
    healingMantra: "ॐ अग्नये नमः (Om Agnaye Namaha)",
    karmicLesson: "Cultivating pure initial impulse and overcoming initial lethargy or impulsiveness.",
  },
  2: {
    name: "Dwitiya",
    category: "Bhadra",
    categoryHindi: "भद्रा (कल्याणकारिणी)",
    element: "Prithvi",
    elementHindi: "पृथ्वी तत्व",
    presidingDeity: "Ashwini Kumaras (अश्विनी कुमार)",
    deityRole: "Divine celestial healers and physicians of the cosmos.",
    healingInvocation: "Drink water blessed with sunrise light; study holistic wellness; serve doctors/nurses.",
    healingMantra: "ॐ अश्विनीकुमाराभ्यां नमः (Om Ashwini Kumarabhyam Namaha)",
    karmicLesson: "Healing emotional fractures and building enduring, pragmatic foundations.",
  },
  3: {
    name: "Tritiya",
    category: "Jaya",
    categoryHindi: "जया (विजयदायिनी)",
    element: "Akasha",
    elementHindi: "आकाश तत्व",
    presidingDeity: "Maa Gauri (माँ गौरी)",
    deityRole: "Goddess of auspicious domestic harmony, grace, and creative fortitude.",
    healingInvocation: "Offer red flowers or raw milk to Maa Parvati/Gauri on third lunar days.",
    healingMantra: "ॐ गौर्ये नमः (Om Gaurye Namaha)",
    karmicLesson: "Channeling courageous competitive energy into righteous protection rather than aggression.",
  },
  4: {
    name: "Chaturthi",
    category: "Rikta",
    categoryHindi: "रिक्ता (रिक्तीकरण / शुद्धि)",
    element: "Jala",
    elementHindi: "जल तत्व",
    presidingDeity: "Lord Ganesha (भगवान गणेश)",
    deityRole: "Supreme remover of hurdles, patron of discernment and obstacle clearing.",
    healingInvocation: "Offer Durva grass and modak to Ganesha; clear obsolete habits and clutter.",
    healingMantra: "ॐ गं गणपतये नमः (Om Gam Ganapataye Namaha)",
    karmicLesson: "Emptying out obsolete emotional baggage; cultivating total self-reliance during dry spells.",
  },
  5: {
    name: "Panchami",
    category: "Poorna",
    categoryHindi: "पूर्णा (पूर्णता / सिद्धि)",
    element: "Vayu",
    elementHindi: "वायु तत्व",
    presidingDeity: "Naga Devatas (नाग देवता)",
    deityRole: "Keepers of the underworld treasures, occult knowledge, and ancestral vitality.",
    healingInvocation: "Worship Nagas or Lord Shiva; respect reptiles and underground waterways.",
    healingMantra: "ॐ नवकुल नागाय नमः (Om Navakula Nagaya Namaha)",
    karmicLesson: "Awakening coiled latent intuitive faculties and maintaining relationship purity.",
  },
  6: {
    name: "Shashti",
    category: "Nanda",
    categoryHindi: "नन्दा (आनन्ददायिनी)",
    element: "Agni",
    elementHindi: "अग्नि तत्व",
    presidingDeity: "Lord Kartikeya / Skanda (भगवान कार्तिकेय)",
    deityRole: "Commander-in-chief of divine forces; conqueror of internal fear and doubt.",
    healingInvocation: "Chant Subramanya mantras; defend the defenseless; eliminate envy.",
    healingMantra: "ॐ शरवणभवाय नमः (Om Sharavanabhavaya Namaha)",
    karmicLesson: "Standing courageous in moral battles and eliminating internal hesitations.",
  },
  7: {
    name: "Saptami",
    category: "Bhadra",
    categoryHindi: "भद्रा (कल्याणकारिणी)",
    element: "Prithvi",
    elementHindi: "पृथ्वी तत्व",
    presidingDeity: "Surya Deva (भगवान सूर्यदेव)",
    deityRole: "Supreme cosmic light, soul significator, bestower of eyesight and societal prestige.",
    healingInvocation: "Offer Arghya (water) to rising Sun; recite Aditya Hridaya Stotram.",
    healingMantra: "ॐ सूर्याय नमः (Om Suryaya Namaha)",
    karmicLesson: "Integrating unwavering personal accountability with societal service.",
  },
  8: {
    name: "Ashtami",
    category: "Jaya",
    categoryHindi: "जया (विजयदायिनी)",
    element: "Akasha",
    elementHindi: "आकाश तत्व",
    presidingDeity: "Lord Shiva & Lord Krishna (भगवान शिव एवं श्रीकृष्ण)",
    deityRole: "Transcenders of earthly duality, dispellers of darkness and demonic forces.",
    healingInvocation: "Meditate on Lord Shiva with water offering; chant Krishna Mahamantra.",
    healingMantra: "ॐ नमः शिवाय (Om Namah Shivaya)",
    karmicLesson: "Navigating sharp existential crossroads; maintaining equanimity in victory and defeat.",
  },
  9: {
    name: "Navami",
    category: "Rikta",
    categoryHindi: "रिक्ता (रिक्तीकरण / शुद्धि)",
    element: "Jala",
    elementHindi: "जल तत्व",
    presidingDeity: "Goddess Durga (माँ दुर्गा)",
    deityRole: "Invincible divine protector; destroyer of Mahishasura (ego and arrogance).",
    healingInvocation: "Recite Argala Stotram or Durga Saptashati; honor and feed young girls.",
    healingMantra: "ॐ दुं दुर्गायै नमः (Om Dum Durgayei Namaha)",
    karmicLesson: "Surrendering personal pride to emerge victorious through divine feminine fortitude.",
  },
  10: {
    name: "Dashami",
    category: "Poorna",
    categoryHindi: "पूर्णा (पूर्णता / सिद्धि)",
    element: "Vayu",
    elementHindi: "वायु तत्व",
    presidingDeity: "Yamaraja & Ten Dikpalas (यमराज एवं दश दिक्पाल)",
    deityRole: "Guardians of cosmic law, righteous karma, and the ten directional realms.",
    healingInvocation: "Speak unwavering truth; respect boundaries; donate sesame and black items to needy.",
    healingMantra: "ॐ यमाय धर्मराजाय नमः (Om Yamaya Dharmarajaya Namaha)",
    karmicLesson: "Attaining lasting victory through uncompromising adherence to Dharma.",
  },
  11: {
    name: "Ekadashi",
    category: "Nanda",
    categoryHindi: "नन्दा (आनन्ददायिनी)",
    element: "Agni",
    elementHindi: "अग्नि तत्व",
    presidingDeity: "Lord Vishnu & Kubera (भगवान विष्णु एवं कुबेर)",
    deityRole: "Preserver of cosmic order, bestower of spiritual liberation and supreme affluence.",
    healingInvocation: "Observe grains fast (Upavasa); read Bhagavad Gita; donate yellow fruits.",
    healingMantra: "ॐ नमो भगवते वासुदेवाय (Om Namo Bhagavate Vasudevaya)",
    karmicLesson: "Purifying sensory cravings through voluntary austerity and spiritual joyousness.",
  },
  12: {
    name: "Dwadashi",
    category: "Bhadra",
    categoryHindi: "भद्रा (कल्याणकारिणी)",
    element: "Prithvi",
    elementHindi: "पृथ्वी तत्व",
    presidingDeity: "Lord Vishnu / Hari (भगवान विष्णु)",
    deityRole: "Maintainer of cosmic balance, protector of vows, fulfiller of pious deeds.",
    healingInvocation: "Break fasting mindfully with charity; feed cows with green fodder.",
    healingMantra: "ॐ विष्णवे नमः (Om Vishnave Namaha)",
    karmicLesson: "Grounding spiritual insights into practical acts of daily kindness.",
  },
  13: {
    name: "Trayodashi",
    category: "Jaya",
    categoryHindi: "जया (विजयदायिनी)",
    element: "Akasha",
    elementHindi: "आकाश तत्व",
    presidingDeity: "Kamadeva & Dharma Devata (कामदेव एवं धर्म देवता / प्रदोष)",
    deityRole: "Purifier of desires, ruler of the holy twilight Pradosha window.",
    healingInvocation: "Observe Pradosha Vrata; perform Shiva Abhishek during sunset twilight.",
    healingMantra: "ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि (Shiva Gayatri)",
    karmicLesson: "Purifying base worldly attachments into transcendent spiritual devotion.",
  },
  14: {
    name: "Chaturdashi",
    category: "Rikta",
    categoryHindi: "रिक्ता (रिक्तीकरण / शुद्धि)",
    element: "Jala",
    elementHindi: "जल तत्व",
    presidingDeity: "Lord Shiva (भगवान रुद्र / शिव)",
    deityRole: "Supreme dissolves of karma; lord of cosmic transformation.",
    healingInvocation: "Chant Maha Mrityunjaya Mantra; maintain solemn silence during twilight.",
    healingMantra: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् (Maha Mrityunjaya Mantra)",
    karmicLesson: "Embracing dissolution of old karmic knots to birth higher spiritual awareness.",
  },
  15: {
    name: "Purnima",
    category: "Poorna",
    categoryHindi: "पूर्णा (पूर्णता / सिद्धि)",
    element: "Vayu",
    elementHindi: "वायु तत्व",
    presidingDeity: "Somadeva / Chandra (सोमदेव / चन्द्र)",
    deityRole: "Nourisher of plants, controller of bodily fluids, queen of maternal calm.",
    healingInvocation: "Meditate under direct moonlight; offer kheer to young girls or mothers.",
    healingMantra: "ॐ सों सोमाय नमः (Om Som Somaya Namaha)",
    karmicLesson: "Realizing emotional wholeness and shining radiant benevolent light on others.",
  },
};

// Amavasya (Tithi 30) Override
export const AMAVASYA_METADATA = {
  name: "Amavasya",
  category: "Poorna" as const,
  categoryHindi: "पूर्णा (अमावस्या - पितृ तर्पण)",
  element: "Vayu" as PanchangaElement,
  elementHindi: "वायु तत्व",
  presidingDeity: "Pitrus / Ancestors & Lord Yama (पितृगण एवं यमराज)",
  deityRole: "Guardians of genetic lineage and ancestral karmic continuum.",
  healingInvocation: "Perform Pitru Tarpan; feed crows, black dogs, and cows; light a mustard oil lamp facing South.",
  healingMantra: "ॐ पितृभ्यो नमः (Om Pitribhyo Namaha)",
  karmicLesson: "Resolving ancestral debts, maintaining deep humility, and dissolving generational blocks.",
};

// Weekday Lifelong Core Desires (Session 46: Vara Lord house placement)
export const HOUSE_DESIRE_MAP: Record<number, { theme: string; desire: string; pathway: string }> = {
  1: {
    theme: "Self-Actualization & Independence",
    desire: "Deep lifelong desire to establish sovereign identity, physical autonomy, and authentic self-mastery.",
    pathway: "Direct self-leadership, pioneering initiatives, and maintaining physical vitality.",
  },
  2: {
    theme: "Resource Security & Family Legacy",
    desire: "Deep lifelong desire for financial fortification, vocal eloquence, lineage preservation, and wealth accumulation.",
    pathway: "Prudent fiscal planning, speech refinement, and honoring ancestral heritage.",
  },
  3: {
    theme: "Courage, Innovation & Sibling Ties",
    desire: "Deep lifelong desire to conquer through heroic valor, creative writing, enterprise, and constant communication.",
    pathway: "Hands-on projects, short travels, artistic ventures, and building collaborative brotherhood.",
  },
  4: {
    theme: "Emotional Peace & Real Estate Sanctuary",
    desire: "Deep lifelong desire for rooted domestic peace, landed estate, vehicular comforts, and maternal sanctuary.",
    pathway: "Building a grounded home environment, inner emotional meditation, and community heart-work.",
  },
  5: {
    theme: "Creative Expression, Mantras & Progeny",
    desire: "Deep lifelong desire for intellectual renown, creative genius, spiritual mantras, and raising brilliant children.",
    pathway: "Devotional mantra sadhana, speculative wisdom, artistic creation, and mentoring the youth.",
  },
  6: {
    theme: "Problem Solving, Service & Overcoming Obstacles",
    desire: "Deep lifelong desire to dismantle challenges, conquer adversaries, master healing, and deliver relentless service.",
    pathway: "Healthcare, legal arbitration, daily disciplined routines, and eliminating debt and friction.",
  },
  7: {
    theme: "Public Partnerships, Diplomacy & Marriage",
    desire: "Deep lifelong desire for egalitarian relationships, magnetic public appeal, commerce, and profound partnership.",
    pathway: "Fair negotiations, business ventures, marital devotion, and public diplomacy.",
  },
  8: {
    theme: "Occult Research, Transformation & Hidden Depths",
    desire: "Deep lifelong desire to investigate hidden mysteries, inherit latent knowledge, and undergo transformative rebirth.",
    pathway: "Esoteric sciences, forensic research, psychological self-mastery, and spiritual surrender.",
  },
  9: {
    theme: "Higher Wisdom, Dharma & Global Pilgrimage",
    desire: "Deep lifelong desire for spiritual truth, philosophical elevation, higher law, and benevolent guidance of Gurus.",
    pathway: "Pilgrimages, higher academia, ethical living, and disseminating authentic wisdom.",
  },
  10: {
    theme: "Professional Authority & Societal Impact",
    desire: "Deep lifelong desire for peak career accomplishment, administrative authority, and monumental societal contribution.",
    pathway: "Uncompromising professional ethics, executive responsibility, and tireless vocational diligence.",
  },
  11: {
    theme: "Mass Reach, Community Gains & Cosmic Hopes",
    desire: "Deep lifelong desire for extensive networks, large-scale financial gains, philanthropy, and realizing grand ideals.",
    pathway: "Community organizing, networking, mentoring forward-looking causes, and collective upliftment.",
  },
  12: {
    theme: "Spiritual Liberation, Solitude & Transcendent Peace",
    desire: "Deep lifelong desire for moksha, solitary retreat, philanthropic charity, and foreign horizon exploration.",
    pathway: "Silent meditation, selfless ashram service, foreign engagements, and non-attachment.",
  },
};

// ==========================================
// 3. CORE CALCULATION FUNCTIONS
// ==========================================

/**
 * Normalizes an angle to [0, 360)
 */
function normalize360(deg: number): number {
  const mod = deg % 360;
  return mod < 0 ? mod + 360 : mod;
}

/**
 * Calculates Yogi Point, Yogi Nakshatra, Yogi Planet, Sahayogi, and Avayogi Nakshatra/Planet (Session 49).
 *
 * Shastric Formula:
 * Yogi Point = (Sun Sidereal Longitude + Moon Sidereal Longitude + 93°20') % 360°
 * Pushya Offset = 93° 20' = 93.3333333333° (Point of Pushya start, symbolizing nourishing divine grace)
 * Avayogi = 6 constellations forward from Yogi Nakshatra
 */
export function calculateYogiAvayogi(
  sunLongitude: number,
  moonLongitude: number,
  planets: Record<string, CelestialBodyPosition>
): YogiAvayogiAnalysis {
  const pushyaOffset = 93 + 20 / 60; // 93.3333333333°
  const rawYogiLon = normalize360(sunLongitude + moonLongitude + pushyaOffset);

  const signIndex = Math.floor((rawYogiLon + 1e-9) / 30) % 12;
  const signInfo = RASHI_NAMES[signIndex];
  const degreesInSign = rawYogiLon % 30;

  const deg = Math.floor(degreesInSign);
  const min = Math.floor((degreesInSign - deg) * 60);
  const yogiDegreeFormatted = `${signInfo.englishName} (${signInfo.sanskritName}) ${deg}° ${min}'`;

  // Nakshatra calculation (360 / 27 = 13.3333333333° per nakshatra)
  const nakshatraSpan = 360 / 27;
  const yogiNakIndex = Math.floor((rawYogiLon + 1e-9) / nakshatraSpan) % 27;
  const yogiNakInfo = NAKSHATRA_NAMES[yogiNakIndex];
  const yogiPlanet = yogiNakInfo.lord;
  const sahayogiPlanet = signInfo.lord;

  // Avayogi Nakshatra: 6 constellations forward (Session 49)
  const avayogiNakIndex = (yogiNakIndex + 6) % 27;
  const avayogiNakInfo = NAKSHATRA_NAMES[avayogiNakIndex];
  const avayogiPlanet = avayogiNakInfo.lord;

  // Locate Avayogi Planet's house in native's chart
  const avayogiBody = planets[avayogiPlanet];
  const avayogiHouse = avayogiBody ? avayogiBody.house : 1;

  const yogiRole = `Catalyst of divine fortune, effortless prosperity, and auspicious turning points. Activating ${yogiPlanet} removes karmic obstacles.`;
  const sahayogiRole = `Sign lord of Yogi Point (${sahayogiPlanet}). Acts as a loyal facilitator supporting the Yogi planet's blessings.`;
  const avayogiRole = `Ruler of the 6th constellation forward (${avayogiPlanet}). Points to areas of friction, blind spots, and testing where karmic debt requires conscious refinement.`;
  const consciousRefinementAdvice = `Whenever entering periods or dealing with significations of ${avayogiPlanet} in House ${avayogiHouse}, exercise extra discernment, avoid speculative gambles, and practice humility to dissolve friction.`;

  return {
    sunLongitude,
    moonLongitude,
    yogiPointLongitude: rawYogiLon,
    yogiDegreeFormatted,
    yogiSign: `${signInfo.sanskritName} (${signInfo.englishName})`,
    yogiSignIndex: signIndex,
    yogiSignLord: sahayogiPlanet,
    yogiNakshatra: yogiNakInfo.sanskritName,
    yogiNakshatraIndex: yogiNakIndex,
    yogiPlanet,
    yogiRole,
    sahayogiPlanet,
    sahayogiRole,
    avayogiNakshatra: avayogiNakInfo.sanskritName,
    avayogiNakshatraIndex: avayogiNakIndex,
    avayogiPlanet,
    avayogiRole,
    avayogiHouse,
    consciousRefinementAdvice,
  };
}

/**
 * Evaluates Dagdha Rashis (Burnt Signs) for the native's birth Tithi and checks for:
 * 1. Viparita Raja Yoga (Dagdha sign in Dusthana: 6th, 8th, 12th).
 * 2. Retrograde planet remediation (retrograde planet working tenaciously to turn burnout into an asset).
 * 3. Kendra/Trikona afflictions (requiring Amavasya/Purnima sadhana and Tithi deity healing).
 */
export function calculateDagdhaRashis(
  tithiNumber: number, // 1 to 15
  isKrishnaAmavasya: boolean,
  lagnaSignIndex: number,
  planets: Record<string, CelestialBodyPosition>
): DagdhaRashiAnalysis {
  // Purnima (15) and Amavasya (30) have no Dagdha signs (Session 48)
  const effectiveTithi = isKrishnaAmavasya ? 15 : tithiNumber;
  const burntIndices = DAGDHA_RASHIS_BY_TITHI[effectiveTithi] || [];
  const tithiMeta = isKrishnaAmavasya ? AMAVASYA_METADATA : TITHI_METADATA[effectiveTithi] || TITHI_METADATA[1];

  if (burntIndices.length === 0) {
    return {
      tithiNumber: effectiveTithi,
      tithiName: tithiMeta.name,
      hasDagdhaSigns: false,
      burntSignNames: [],
      dagdhaSigns: [],
      viparitaYogaActive: false,
      kendraTrikonaAfflictionsCount: 0,
      spiritualHealingPrescription:
        "Sun and Moon are fully balanced at Purnima/Amavasya; no zodiac signs are burnt or deficient in vitality. Karmic focus is direct spiritual devotion.",
    };
  }

  const dagdhaSigns: DagdhaSignDetail[] = [];
  let viparitaYogaActive = false;
  let kendraTrikonaCount = 0;
  const viparitaHouses: number[] = [];

  for (const signIdx of burntIndices) {
    const signInfo = RASHI_NAMES[signIdx];
    // Calculate house from Lagna: (signIdx - lagnaSignIdx + 12) % 12 + 1
    const houseFromLagna = ((signIdx - lagnaSignIndex + 12) % 12) + 1;

    // Check if house is Dusthana (6, 8, 12)
    const isViparita = houseFromLagna === 6 || houseFromLagna === 8 || houseFromLagna === 12;
    if (isViparita) {
      viparitaYogaActive = true;
      viparitaHouses.push(houseFromLagna);
    }

    // Check if house is Kendra (1, 4, 7, 10) or Trikona (1, 5, 9)
    const isKendraTrikona = [1, 4, 7, 10, 5, 9].includes(houseFromLagna);
    if (isKendraTrikona) {
      kendraTrikonaCount++;
    }

    // Identify occupying planets in this Dagdha sign
    const occupants: DagdhaSignDetail["occupyingPlanets"] = [];
    for (const [pName, pBody] of Object.entries(planets)) {
      if (pBody.isUpagraha || pBody.isModernPlanet) continue;
      if (pBody.rashi.index === signIdx) {
        const isRetro = pBody.isRetrograde;
        occupants.push({
          name: pName,
          isRetrograde: isRetro,
          remediationStatus: isRetro ? "Overcomes Burnout (Asset)" : "Burnt Vitality (Needs Sadhana)",
          impact: isRetro
            ? `Retrograde ${pName} tenaciously turns the burnt condition into an asset through relentless self-correction.`
            : `Direct ${pName} experiences depleted vitality in this sign, requiring conscious remedial reinforcement.`,
        });
      }
    }

    const houseSignifications = getHouseSignificationsShort(houseFromLagna);
    const remedialAction = isViparita
      ? "Exceptional Viparita Raja Yoga active: Debts, litigations, and hidden adversaries get burnt away naturally. Maintain ethical conduct to preserve this shield."
      : isKendraTrikona
      ? `House ${houseFromLagna} (${houseSignifications}) experiences initial friction. Perform sadhana dedicated to ${tithiMeta.presidingDeity} and observe purity on Amavasya/Purnima.`
      : `Observe conscious moderation in House ${houseFromLagna} matters (${houseSignifications}).`;

    dagdhaSigns.push({
      signIndex: signIdx,
      signName: `${signInfo.sanskritName} (${signInfo.englishName})`,
      signHindi: `${signInfo.symbol} ${signInfo.sanskritName}`,
      houseFromLagna,
      isViparitaRajaYoga: isViparita,
      viparitaRationale: isViparita
        ? `Dagdha sign ${signInfo.sanskritName} falls in Dusthana House ${houseFromLagna}, burning away malefic traits of debts, obstacles, and enemies (Viparita Raja Yoga).`
        : undefined,
      isKendraTrikonaAfflicted: isKendraTrikona,
      occupyingPlanets: occupants,
      houseSignifications,
      remedialAction,
    });
  }

  const burntSignNames = dagdhaSigns.map((d) => d.signName);
  const viparitaDescription = viparitaYogaActive
    ? `Exceptional Viparita Raja Yoga formed by Dagdha sign(s) falling in Dusthana House(s) ${viparitaHouses.join(
        ", "
      )}. As taught in Session 48, the burnt condition consumes debts, diseases, and hidden enemies, turning an apparent deficiency into a powerful protective armor.`
    : undefined;

  const spiritualHealingPrescription = kendraTrikonaCount > 0
    ? `Dagdha signs touch prominent Kendra/Trikona houses. Heal initial delays by invoking the Tithi deity ${tithiMeta.presidingDeity} with the sacred mantra "${tithiMeta.healingMantra}" and maintaining spiritual purity on Amavasya.`
    : "No Kendra/Trikona afflictions present. The Dagdha signs operate either neutrally or as Viparita Raja Yoga shields.";

  return {
    tithiNumber: effectiveTithi,
    tithiName: tithiMeta.name,
    hasDagdhaSigns: true,
    burntSignNames,
    dagdhaSigns,
    viparitaYogaActive,
    viparitaDescription,
    kendraTrikonaAfflictionsCount: kendraTrikonaCount,
    spiritualHealingPrescription,
  };
}

/**
 * Evaluates the 11 Karans, Mars Work Execution Dynamics, and Fixed Karan De-stigmatization (Sessions 49, 98).
 */
export function evaluateKaranMarsExecution(
  karanName: string,
  karanIndex: number,
  planets: Record<string, CelestialBodyPosition>
): KaranMarsExecutionAnalysis {
  // Karana classification
  const fixedKaranas = ["Shakuni", "Chatushpada", "Naga", "Kintughna", "Kimstughna"];
  const isFixed = fixedKaranas.includes(karanName);

  // Determine Karan Lord
  let karanLord = "Sun";
  let isFixedDeStigmatized = false;
  let fixedArchetypeSummary = "";

  if (karanName === "Shakuni") {
    karanLord = "Rahu";
    isFixedDeStigmatized = true;
    fixedArchetypeSummary =
      "De-stigmatized Archetype (Session 98): Shakuni is not deceitful; the native is tested early in manipulative environments and develops profound strategic foresight, psychological resilience, and master problem-solving skills.";
  } else if (karanName === "Chatushpada") {
    karanLord = "Rahu";
    isFixedDeStigmatized = true;
    fixedArchetypeSummary =
      "De-stigmatized Archetype (Session 98): Connected to the foundational Amavasya phase; bestows immense grounded physical endurance, animal empathy, and the ability to carry heavy responsibilities without cracking.";
  } else if (karanName === "Naga") {
    karanLord = "Ketu";
    isFixedDeStigmatized = true;
    fixedArchetypeSummary =
      "De-stigmatized Archetype (Session 98): Bestows penetrating esoteric insight, serpent kundalini energy, and deep intuition for navigating complex, high-pressure environments.";
  } else if (karanName === "Kintughna" || karanName === "Kimstughna") {
    karanLord = "Ketu";
    isFixedDeStigmatized = true;
    fixedArchetypeSummary =
      "De-stigmatized Archetype (Session 98): Positioned at the dawn of the waxing moon (Shukla Pratipada); channels raw unconditioned potential into independent self-creation and breakthrough initiatives.";
  } else {
    // 7 Movable Karans
    const movableRulers: Record<string, string> = {
      Bava: "Sun",
      Balava: "Moon",
      Kaulava: "Mars",
      Taitila: "Mercury",
      Gara: "Jupiter",
      Vanija: "Venus",
      Vishti: "Saturn",
    };
    karanLord = movableRulers[karanName] || "Mars";
  }

  const karanLordBody = planets[karanLord];
  const karanLordHouse = karanLordBody ? karanLordBody.house : 1;

  // Mars position & dignity (Mars is the overall significator of Karan execution - Session 98)
  const marsBody = planets["Mars"];
  const marsHouse = marsBody ? marsBody.house : 1;
  const marsSign = marsBody ? `${marsBody.rashi.sanskritName} (${marsBody.rashi.englishName})` : "Mesha (Aries)";
  const marsDignity = marsBody?.rashi.index === 9 ? "Exalted (Ucha)" : marsBody?.rashi.index === 3 ? "Debilitated (Neecha)" : "Neutral/Functional";

  // Work execution style
  let workExecutionStyle = "";
  let deliveryObstacle = "";
  let optimalExecutionEnvironment = "";

  if (karanLord === "Sun") {
    workExecutionStyle = "Principled, authoritative, and direct execution driven by high willpower and sovereign responsibility.";
    deliveryObstacle = "Resistance to subservient supervision or arbitrary micro-management.";
    optimalExecutionEnvironment = "Independent executive leadership, administrative control, and clear mission mandates.";
  } else if (karanLord === "Moon") {
    workExecutionStyle = "Empathetic, responsive, and nourishing execution attuned to public needs and team morale.";
    deliveryObstacle = "Susceptibility to workplace emotional tides or lack of psychological validation.";
    optimalExecutionEnvironment = "People-centric organizations, caregiving, hospitality, public welfare, and collaborative creative hubs.";
  } else if (karanLord === "Mars") {
    workExecutionStyle = "Dynamic, fearless, and action-oriented execution that attacks tasks head-on.";
    deliveryObstacle = "Impatience with prolonged delays or excessive bureaucratic formalities.";
    optimalExecutionEnvironment = "Crisis management, engineering, competitive arenas, emergency response, and pioneering projects.";
  } else if (karanLord === "Mercury") {
    workExecutionStyle = "Analytical, data-backed, agile, and communicative execution.";
    deliveryObstacle = "Mental over-analysis or scattered focus across too many concurrent projects.";
    optimalExecutionEnvironment = "Commercial trade, software systems, financial analysis, journalism, and research.";
  } else if (karanLord === "Jupiter") {
    workExecutionStyle = "Advisory, ethical, holistic, and wisdom-guided execution prioritizing sustainability.";
    deliveryObstacle = "Frustration when forced into cutthroat, morally ambiguous commercial compromises.";
    optimalExecutionEnvironment = "Strategic mentorship, education, judicial/legal counsel, and institutional stewardship.";
  } else if (karanLord === "Venus") {
    workExecutionStyle = "Harmonious, diplomatic, aesthetically refined, and partnership-oriented execution.";
    deliveryObstacle = "Aversion to harsh conflict or sterile, uninspiring work surroundings.";
    optimalExecutionEnvironment = "Creative industries, design, diplomatic negotiation, luxury trade, and consensus building.";
  } else if (karanLord === "Saturn") {
    workExecutionStyle = "Tenacious, endurance-focused, disciplined execution thriving on long arduous timelines.";
    deliveryObstacle = "Initial delays or heavy burden of unpaid labor before recognition manifests.";
    optimalExecutionEnvironment = "Large-scale infrastructure, long-term research, operational logistics, and unyielding perseverance.";
  } else {
    // Rahu / Ketu
    workExecutionStyle = "Unconventional, out-of-the-box, intuitive, and hyper-strategic execution.";
    deliveryObstacle = "Misunderstanding by conventional peers or periods of psychological isolation.";
    optimalExecutionEnvironment = "Complex turnaround situations, strategic crisis recovery, esoteric sciences, and cutting-edge innovations.";
  }

  return {
    karanName,
    karanIndex,
    karanType: isFixed ? "Fixed (Sthira)" : "Movable (Chara)",
    karanLord,
    karanLordHouse,
    marsHouse,
    marsSign,
    marsDignity,
    isFixedDeStigmatized,
    fixedArchetypeSummary: fixedArchetypeSummary || undefined,
    workExecutionStyle,
    deliveryObstacle,
    optimalExecutionEnvironment,
  };
}

/**
 * Checks Panchak Nakshatras (Final 5: 5-fold multiplication effect) and Abhijit (28th Lost Constellation).
 */
export function evaluatePanchakAbhijit(moonLongitude: number): PanchakAbhijitAnalysis {
  const nakshatraSpan = 360 / 27;
  const nakIndex = Math.floor(moonLongitude / nakshatraSpan);
  const nakInfo = NAKSHATRA_NAMES[nakIndex];
  const degreesInNak = moonLongitude % nakshatraSpan;
  const pada = Math.floor(degreesInNak / (nakshatraSpan / 4)) + 1;

  // Panchak check: Dhanishta latter half (padas 3 & 4, index 22) + Shatabhisha (23) + Purva Bhadra (24) + Uttara Bhadra (25) + Revati (26)
  const isPanchak = nakIndex >= 23 || (nakIndex === 22 && pada >= 3);
  let panchakCategory: string | undefined;
  let panchakMultiplier = "Normal (1x energetic potential)";

  if (isPanchak) {
    panchakMultiplier = "5-Fold Multiplication Effect (Session 47): Birth in Panchak multiplies energetic and karmic potential fivefold. Actions, endeavors, and creative output tend to recur in expansive 5x cycles.";
    if (nakIndex === 22) panchakCategory = "Dhanishta Panchak (Agni / Courage Multiplier)";
    else if (nakIndex === 23) panchakCategory = "Shatabhisha Panchak (Varuna / Secret Wisdom & Healing Multiplier)";
    else if (nakIndex === 24) panchakCategory = "Purva Bhadrapada Panchak (Aja Ekapada / Spiritual Fire Multiplier)";
    else if (nakIndex === 25) panchakCategory = "Uttara Bhadrapada Panchak (Ahirbudhnya / Deep Kundalini Multiplier)";
    else if (nakIndex === 26) panchakCategory = "Revati Panchak (Pushan / Wealth & Safe Crossing Multiplier)";
  }

  // Abhijit check: 276°40' to 280°53'20'' (276.6667° to 280.8889°)
  const abhijitStart = 276 + 40 / 60;
  const abhijitEnd = 280 + 53 / 60 + 20 / 3600;
  const isAbhijitZone = moonLongitude >= abhijitStart && moonLongitude <= abhijitEnd;

  const abhijitSignificance = isAbhijitZone
    ? "Native's Moon touches the sacred Abhijit constellation cusp (Session 47). Mythologically removed by Lord Krishna from regular planetary calculation to prevent its weaponization, this constellation confers infallible victory and divine grace under adversity."
    : "Moon resides outside the Abhijit cusp in regular 27-Nakshatra zodiac calculation.";

  return {
    moonNakshatra: nakInfo.sanskritName,
    moonNakshatraIndex: nakIndex,
    moonPada: pada,
    isPanchakBirth: isPanchak,
    panchakCategory,
    panchakMultiplier,
    isAbhijitZone,
    abhijitSignificance,
  };
}

/**
 * Three-Tier Vishnu Armor & Mantra Science (Session 49)
 */
export function getThreeTierVishnuArmor(): ThreeTierVishnuArmor {
  return {
    mantraPhoneticsRule:
      "Mantra Science (Session 49): Mantras ending in 'Svaha' are feminine sacrificial fire mantras; mantras ending in 'Phat' are masculine forceful subjugation mantras requiring strict initiation; mantras ending in 'Namaha' are gender-neutral, universally safe for Kali Yuga, expressing total humble surrender.",
    tier1Physical: {
      mantra: "Om Narayanaya Namaha",
      mantraDevanagari: "ॐ नारायणाय नमः",
      target: "Annamaya Kosha (Physical Body & Health Protection)",
      guidance: "Chant 11 times every morning to fortify physical immunity, cellular vitality, and structural health against bodily afflictions.",
    },
    tier2Mental: {
      mantra: "Om Vishnave Namaha",
      mantraDevanagari: "ॐ विष्णवे नमः",
      target: "Manomaya Kosha (Mental & Emotional Equilibrium)",
      guidance: "Chant 11 times at dusk (Sandhya) to soothe emotional restlessness, dissolve subconscious anxiety, and restore mental clarity.",
    },
    tier3Spiritual: {
      mantra: "Om Namo Bhagavate Vasudevaya",
      mantraDevanagari: "ॐ नमो भगवते वासुदेवाय",
      target: "Vijnanamaya & Anandamaya Kosha (Spiritual Body & Cosmic Alignment)",
      guidance: "Chant 1 mala (108 times) on Ekadashi or Thursdays to align with Daiva Kripa (Divine Grace) and dissolve ancestral karmic knots.",
    },
    prescribedFocus:
      "Combine all three tiers sequentially to form the impenetrable Vishnu Armor (विष्णु कवच) for integrated physical, emotional, and spiritual protection.",
  };
}

/**
 * Helper to get short descriptions of house significations
 */
function getHouseSignificationsShort(house: number): string {
  const map: Record<number, string> = {
    1: "Self, vitality, physical constitution, head",
    2: "Wealth, family, speech, liquid assets",
    3: "Courage, siblings, short travel, communication",
    4: "Mother, home, peace of mind, landed assets",
    5: "Intellect, children, speculative ventures, purva punya",
    6: "Debts, diseases, litigation, service, adversaries",
    7: "Spouse, partnership, public dealings, commerce",
    8: "Longevity, sudden transformations, occult research, chronic obstacles",
    9: "Dharma, father, higher wisdom, pilgrimages, good fortune",
    10: "Career, societal status, executive karma, public authority",
    11: "Gains, large networks, elder siblings, fulfillment of hopes",
    12: "Moksha, foreign residence, expenditures, solitude, sleep",
  };
  return map[house] || "Life area";
}

// ==========================================
// 4. MASTER ENGINE SYNTHESIS FUNCTION
// ==========================================

/**
 * Evaluates the full Deep Natal Panchanga blueprint:
 * 1. Five Elemental Limbs (Kshiti, Jala, Pavaka, Gagana, Sameera)
 * 2. Weekday Lord Lifelong Desire House
 * 3. Tithi Presiding Deity & Healing Invocation
 * 4. Dagdha Rashis (Burnt Signs) & Viparita Raja Yoga
 * 5. Yogi, Sahayogi & Avayogi Mathematical Points
 * 6. Karan-Mars Execution Dynamics & De-stigmatized Fixed Karans
 * 7. Panchak 5x Multiplier & Abhijit Constellation
 * 8. Three-Tier Vishnu Armor
 */
export function evaluateNatalPanchangaDeep(ephemeris: EphemerisResult): NatalPanchangaDeepReport {
  const sunBody = ephemeris.planets["Sun"];
  const moonBody = ephemeris.planets["Moon"];
  const sunLon = sunBody ? sunBody.siderealLongitude : 0;
  const moonLon = moonBody ? moonBody.siderealLongitude : 0;
  const lagnaSignIndex = ephemeris.ascendant.rashi.index;

  // 1. Tithi & Paksha
  const moonSunDiff = normalize360(moonLon - sunLon);
  const tithiIndex = Math.floor(moonSunDiff / 12);
  const tithiNumber = (tithiIndex % 15) + 1; // 1 to 15
  const isKrishnaAmavasya = tithiIndex === 29;
  const paksha: "Shukla" | "Krishna" = tithiIndex < 15 ? "Shukla" : "Krishna";

  // Tithi Metadata
  const tithiMeta = isKrishnaAmavasya ? AMAVASYA_METADATA : TITHI_METADATA[tithiNumber] || TITHI_METADATA[1];

  // 2. Weekday (Vara)
  const varaName = ephemeris.panchanga.vara.name;
  const varaLord = ephemeris.panchanga.vara.lord;
  const varaLordBody = ephemeris.planets[varaLord];
  const varaLordHouse = varaLordBody ? varaLordBody.house : 1;
  const varaLordSign = varaLordBody ? `${varaLordBody.rashi.sanskritName} (${varaLordBody.rashi.englishName})` : "Mesha";
  const isVaraLordRetro = varaLordBody?.isRetrograde ?? false;

  const desireData = HOUSE_DESIRE_MAP[varaLordHouse] || HOUSE_DESIRE_MAP[1];
  const weekdayDesire: WeekdayDesireAnalysis = {
    weekday: varaName,
    weekdayHindi: ephemeris.panchanga.vara.sanskritName,
    weekdayLord: varaLord,
    lordHouse: varaLordHouse,
    lordSign: varaLordSign,
    isLordRetrograde: isVaraLordRetro,
    coreLifelongDesire: desireData.desire,
    desireTheme: desireData.theme,
    fulfillmentPathway: desireData.pathway,
  };

  // 3. Tithi Presiding Deity Info
  const tithiDeity: TithiPresidingDeityInfo = {
    tithiNumber,
    tithiName: tithiMeta.name,
    paksha,
    category: tithiMeta.category,
    categoryHindi: tithiMeta.categoryHindi,
    element: tithiMeta.element,
    elementHindi: tithiMeta.elementHindi,
    presidingDeity: tithiMeta.presidingDeity,
    deityRole: tithiMeta.deityRole,
    healingInvocation: tithiMeta.healingInvocation,
    healingMantra: tithiMeta.healingMantra,
    spanType: "Purna Tithi", // Default; enriched if sunrise data matches
    karmicLesson: tithiMeta.karmicLesson,
  };

  // 4. Five Elemental Limbs
  const elementalLimbs: ElementalLimbInfo[] = [
    {
      limb: "Vara",
      limbHindi: "वार (अग्नि तत्व)",
      name: varaName,
      element: "Agni",
      elementHindi: "अग्नि तत्व (Life Drive / Vitality)",
      dimension: "Vitality, Life Drive, Core Lifelong Desires",
      sensoryOrgan: "Eyes (Netra - नेत्र)",
      workingOrgan: "Feet / Locomotion (Pada - पाद)",
      governingPlanets: ["Sun", "Mars"],
      nativeLord: varaLord,
      nativeHouse: varaLordHouse,
      shastricGuidance: `Governed by Agni. Weekday ruler ${varaLord} seated in House ${varaLordHouse} directs the native's core life drive toward: ${desireData.theme}.`,
    },
    {
      limb: "Karan",
      limbHindi: "करण (पृथ्वी तत्व)",
      name: ephemeris.panchanga.karana.name,
      element: "Prithvi",
      elementHindi: "पृथ्वी तत्व (Karma / Physical Execution)",
      dimension: "Physical Execution of Karma, Tangible Delivery",
      sensoryOrgan: "Nose / Smell (Ghrana - घ्राण)",
      workingOrgan: "Excretory / Anus (Guda - गुद)",
      governingPlanets: ["Mercury", "Mars"],
      nativeLord: "Mars", // Overall ruler of Karan
      nativeHouse: ephemeris.planets["Mars"]?.house || 1,
      shastricGuidance:
        "Governed by Prithvi and Mars ('Karama Pradhana Vishva Rachi Rakha'). Dictates how effort is delivered under earthly circumstances.",
    },
    {
      limb: "Nakshatra",
      limbHindi: "नक्षत्र (वायु तत्व)",
      name: ephemeris.panchanga.nakshatra.sanskritName,
      element: "Vayu",
      elementHindi: "वायु तत्व (Relationships & Network)",
      dimension: "Relationships, Social Networks, Mental Tendencies",
      sensoryOrgan: "Skin / Touch (Sparshana - स्पर्शन)",
      workingOrgan: "Hands / Grasping (Pani - पाणि)",
      governingPlanets: [ephemeris.panchanga.nakshatra.lord],
      nativeLord: ephemeris.panchanga.nakshatra.lord,
      nativeHouse: ephemeris.planets[ephemeris.panchanga.nakshatra.lord]?.house || 1,
      shastricGuidance: `Governed by Vayu. Moon in ${ephemeris.panchanga.nakshatra.sanskritName} shapes karmic ties, human interaction patterns, and relational subconscious tendencies.`,
    },
    {
      limb: "Tithi",
      limbHindi: "तिथि (जल तत्व)",
      name: `${tithiMeta.name} (${paksha})`,
      element: "Jala",
      elementHindi: "जल तत्व (Emotions & Inner Mind)",
      dimension: "Subconscious Karmic Reservoirs, Emotional Well-being",
      sensoryOrgan: "Tongue / Taste (Rasana - रसना)",
      workingOrgan: "Genitals / Reproduction (Upastha - उपस्थ)",
      governingPlanets: ["Venus", "Moon"],
      nativeLord: paksha === "Shukla" ? "Moon" : "Sun",
      nativeHouse: moonBody?.house || 1,
      shastricGuidance: `Governed by Jala. ${tithiMeta.name} (${tithiMeta.categoryHindi}) stores accumulated emotional karma. Aligning with ${tithiMeta.presidingDeity} harmonizes mental turbulence.`,
    },
    {
      limb: "Yoga",
      limbHindi: "योग (आकाश तत्व)",
      name: ephemeris.panchanga.yoga.name,
      element: "Akasha",
      elementHindi: "आकाश तत्व (Divine Grace / Daiva Kripa)",
      dimension: "Spiritual Alignment, Divine Grace, Wisdom",
      sensoryOrgan: "Ears / Hearing (Shrotra - श्रोत्र)",
      workingOrgan: "Mouth / Speech (Vak - वाक्)",
      governingPlanets: ["Jupiter"],
      nativeLord: "Jupiter",
      nativeHouse: ephemeris.planets["Jupiter"]?.house || 1,
      shastricGuidance:
        "Governed by Akasha and Jupiter. Represents the umbilical conduit of divine grace (Daiva Kripa) connecting the soul with cosmic intelligence.",
    },
  ];

  // 5. Dagdha Rashis & Viparita Raja Yoga
  const dagdhaAnalysis = calculateDagdhaRashis(
    tithiNumber,
    isKrishnaAmavasya,
    lagnaSignIndex,
    ephemeris.planets
  );

  // 6. Yogi, Sahayogi & Avayogi Points
  const yogiAvayogi = calculateYogiAvayogi(sunLon, moonLon, ephemeris.planets);

  // 7. Karan-Mars Execution
  const karanExecution = evaluateKaranMarsExecution(
    ephemeris.panchanga.karana.name,
    ephemeris.panchanga.karana.index,
    ephemeris.planets
  );

  // 8. Panchak & Abhijit
  const panchakAbhijit = evaluatePanchakAbhijit(moonLon);

  // 9. Three-Tier Vishnu Armor
  const vishnuArmor = getThreeTierVishnuArmor();

  // Elemental balance
  const dominantElement: PanchangaElement = tithiMeta.element;
  const deficientElement: PanchangaElement = dominantElement === "Agni" ? "Jala" : "Agni";

  // Overall synthesis
  let overallSynthesis = `Natal Panchanga Blueprint Synthesized:\n`;
  overallSynthesis += `• Weekday Desire: House ${varaLordHouse} (${desireData.theme}) via ${varaLord}.\n`;
  overallSynthesis += `• Tithi Presiding Deity: ${tithiMeta.presidingDeity} (${tithiMeta.category} - ${tithiMeta.element}).\n`;
  if (dagdhaAnalysis.hasDagdhaSigns) {
    overallSynthesis += `• Dagdha Rashis: ${dagdhaAnalysis.burntSignNames.join(", ")}. `;
    if (dagdhaAnalysis.viparitaYogaActive) {
      overallSynthesis += `Active Viparita Raja Yoga formed in Dusthana houses!\n`;
    } else {
      overallSynthesis += `Heal initial delays through ${tithiMeta.presidingDeity} sadhana.\n`;
    }
  } else {
    overallSynthesis += `• Dagdha Rashis: None (Purnima/Amavasya equilibrium).\n`;
  }
  overallSynthesis += `• Yogi Planet: ${yogiAvayogi.yogiPlanet} (Auspicious Catalyst) | Avayogi: ${yogiAvayogi.avayogiPlanet} in House ${yogiAvayogi.avayogiHouse} (Refinement Field).\n`;
  if (panchakAbhijit.isPanchakBirth) {
    overallSynthesis += `• Panchak Active: 5x multiplication energetic potential.\n`;
  }

  return {
    elementalLimbs,
    dominantElement,
    deficientElement,
    weekdayDesire,
    tithiDeity,
    dagdhaAnalysis,
    yogiAvayogi,
    karanExecution,
    panchakAbhijit,
    vishnuArmor,
    overallSynthesis,
  };
}

/**
 * Formats a clean, readable text dossier for chat context injection or reporting.
 */
export function generateNatalPanchangaDeepReport(ephemeris: EphemerisResult): string {
  const analysis = evaluateNatalPanchangaDeep(ephemeris);

  let out = `### 🌌 CLASSICAL NATAL PANCHANGA DEEP BLUEPRINT (पञ्चाङ्ग तत्व एवं दग्ध विश्लेषण)\n\n`;

  // 1. Five Elemental Limbs
  out += `#### 1. Five Elemental Limbs (पञ्च तत्व)\n`;
  for (const limb of analysis.elementalLimbs) {
    out += `• **${limb.limb} (${limb.elementHindi}):** ${limb.name}\n`;
    out += `  - *Dimension:* ${limb.dimension} | *Sensory:* ${limb.sensoryOrgan} | *Working:* ${limb.workingOrgan}\n`;
    out += `  - *Lord Placement:* ${limb.nativeLord} in House ${limb.nativeHouse}\n`;
    out += `  - *Guidance:* ${limb.shastricGuidance}\n\n`;
  }

  // 2. Weekday Lifelong Desire
  out += `#### 2. Core Lifelong Desire (जन्म वार एवं अभीप्सित फल)\n`;
  out += `• **Birth Weekday:** ${analysis.weekdayDesire.weekday} (${analysis.weekdayDesire.weekdayHindi})\n`;
  out += `• **Weekday Lord:** ${analysis.weekdayDesire.weekdayLord} in House ${analysis.weekdayDesire.lordHouse} (${analysis.weekdayDesire.lordSign})${analysis.weekdayDesire.isLordRetrograde ? " [Retrograde]" : ""}\n`;
  out += `• **Core Desire Theme:** ${analysis.weekdayDesire.desireTheme}\n`;
  out += `• **Shastric Manifestation:** ${analysis.weekdayDesire.coreLifelongDesire}\n`;
  out += `• **Fulfillment Pathway:** ${analysis.weekdayDesire.fulfillmentPathway}\n\n`;

  // 3. Dagdha Rashis & Viparita Raja Yoga
  out += `#### 3. Dagdha Rashis (दग्ध राशि एवं विपरीत राजयोग)\n`;
  out += `• **Birth Tithi:** ${analysis.tithiDeity.tithiName} (${analysis.tithiDeity.paksha} Paksha) — ${analysis.tithiDeity.categoryHindi}\n`;
  out += `• **Presiding Deity:** ${analysis.tithiDeity.presidingDeity}\n`;
  out += `• **Healing Invocation:** ${analysis.tithiDeity.healingInvocation} | Mantra: ${analysis.tithiDeity.healingMantra}\n`;

  if (analysis.dagdhaAnalysis.hasDagdhaSigns) {
    out += `• **Burnt Zodiac Signs:** ${analysis.dagdhaAnalysis.burntSignNames.join(", ")}\n`;
    for (const d of analysis.dagdhaAnalysis.dagdhaSigns) {
      out += `  - **${d.signName} (House ${d.houseFromLagna}):** ${d.houseSignifications}\n`;
      if (d.isViparitaRajaYoga) {
        out += `    * 🌟 **Viparita Raja Yoga Active:** Consumes debts, disease, and hidden enemies!\n`;
      }
      if (d.occupyingPlanets.length > 0) {
        for (const occ of d.occupyingPlanets) {
          out += `    * Planet ${occ.name}${occ.isRetrograde ? " (Retrograde)" : ""}: ${occ.remediationStatus} — ${occ.impact}\n`;
        }
      }
      out += `    * Remedy: ${d.remedialAction}\n`;
    }
    if (analysis.dagdhaAnalysis.viparitaDescription) {
      out += `• **Viparita Synthesis:** ${analysis.dagdhaAnalysis.viparitaDescription}\n`;
    }
  } else {
    out += `• **Burnt Zodiac Signs:** None (Equilibrium at Full/New Moon).\n`;
  }
  out += `• **Healing Prescription:** ${analysis.dagdhaAnalysis.spiritualHealingPrescription}\n\n`;

  // 4. Yogi, Sahayogi & Avayogi
  out += `#### 4. Yogi, Sahayogi & Avayogi Points (भाग्य एवं साधना बिन्दु)\n`;
  out += `• **Yogi Point:** ${analysis.yogiAvayogi.yogiDegreeFormatted} (Longitude: ${analysis.yogiAvayogi.yogiPointLongitude.toFixed(2)}°)\n`;
  out += `• **Yogi Nakshatra & Planet:** ${analysis.yogiAvayogi.yogiNakshatra} — Ruler: **${analysis.yogiAvayogi.yogiPlanet}** (Auspicious Catalyst)\n`;
  out += `• **Sahayogi (Sign Lord):** **${analysis.yogiAvayogi.sahayogiPlanet}** (Loyal Supporter)\n`;
  out += `• **Avayogi Nakshatra (+6) & Planet:** ${analysis.yogiAvayogi.avayogiNakshatra} — Ruler: **${analysis.yogiAvayogi.avayogiPlanet}** in House ${analysis.yogiAvayogi.avayogiHouse}\n`;
  out += `• **Refinement Advice:** ${analysis.yogiAvayogi.consciousRefinementAdvice}\n\n`;

  // 5. Karan & Mars Work Execution
  out += `#### 5. Karan & Mars Work Execution Dynamics (कर्म सम्पादन एवं मंगल)\n`;
  out += `• **Birth Karan:** ${analysis.karanExecution.karanName} (${analysis.karanExecution.karanType}) — Ruler: ${analysis.karanExecution.karanLord} in House ${analysis.karanExecution.karanLordHouse}\n`;
  out += `• **Mars (Karan Karta):** House ${analysis.karanExecution.marsHouse} in ${analysis.karanExecution.marsSign} (${analysis.karanExecution.marsDignity})\n`;
  if (analysis.karanExecution.isFixedDeStigmatized && analysis.karanExecution.fixedArchetypeSummary) {
    out += `• **Fixed Karan De-stigmatization:** ${analysis.karanExecution.fixedArchetypeSummary}\n`;
  }
  out += `• **Execution Style:** ${analysis.karanExecution.workExecutionStyle}\n`;
  out += `• **Delivery Obstacle:** ${analysis.karanExecution.deliveryObstacle}\n`;
  out += `• **Optimal Environment:** ${analysis.karanExecution.optimalExecutionEnvironment}\n\n`;

  // 6. Panchak & Abhijit
  out += `#### 6. Panchak Multiplier & Abhijit Constellation\n`;
  out += `• **Moon Nakshatra:** ${analysis.panchakAbhijit.moonNakshatra} (Pada ${analysis.panchakAbhijit.moonPada})\n`;
  out += `• **Panchak Status:** ${analysis.panchakAbhijit.isPanchakBirth ? `Active (${analysis.panchakAbhijit.panchakCategory})` : "Inactive"}\n`;
  out += `• **Potency Multiplier:** ${analysis.panchakAbhijit.panchakMultiplier}\n`;
  out += `• **Abhijit Zone:** ${analysis.panchakAbhijit.isAbhijitZone ? "Active on Uttarashadha-Shravana cusp" : "Inactive"}\n`;
  out += `• **Shastric Note:** ${analysis.panchakAbhijit.abhijitSignificance}\n\n`;

  // 7. Three-Tier Vishnu Armor
  out += `#### 7. Three-Tier Vishnu Armor (त्रिविध विष्णु कवच)\n`;
  out += `• **Mantra Science:** ${analysis.vishnuArmor.mantraPhoneticsRule}\n`;
  out += `• **Tier 1 (Physical):** ${analysis.vishnuArmor.tier1Physical.mantraDevanagari} (*${analysis.vishnuArmor.tier1Physical.mantra}*) — ${analysis.vishnuArmor.tier1Physical.guidance}\n`;
  out += `• **Tier 2 (Mental/Emotional):** ${analysis.vishnuArmor.tier2Mental.mantraDevanagari} (*${analysis.vishnuArmor.tier2Mental.mantra}*) — ${analysis.vishnuArmor.tier2Mental.guidance}\n`;
  out += `• **Tier 3 (Spiritual):** ${analysis.vishnuArmor.tier3Spiritual.mantraDevanagari} (*${analysis.vishnuArmor.tier3Spiritual.mantra}*) — ${analysis.vishnuArmor.tier3Spiritual.guidance}\n`;

  return out;
}
