/**
 * Classical 27 Nakshatras Activation Years Engine (नक्षत्र जागरण वर्ष सिद्धांत)
 * Shastric Methodology inspired by Dr. Samir Tripathi (Medhaj Astro) & Classical Nadi Granthas:
 * - Deva Keralam (Chandra Kala Nadi)
 * - Bhrigu Nandi Nadi & Bhrigu Saral Paddhati (BSP)
 * - Muhurta Chintamani & Classical Nakshatra Phala
 *
 * Principle: Each Nakshatra has specific milestone activation years in human life.
 * When the native reaches that age, the planetary lords and deities seated in that Nakshatra awaken,
 * triggering tangible turning points in career, relationships, wealth, health, and spiritual realization.
 */

import { EphemerisResult } from "./types";
import { calculateJaiminiKarakas } from "./jaimini";
import { RASHIS } from "./constants";

export interface NakshatraActivationMeta {
  index: number; // 0 to 26
  name: string;
  hindiName: string;
  sanskritName: string;
  rulingPlanet: string;
  rulingDeity: string;
  tatva: "Agni" | "Prithvi" | "Vayu" | "Jala" | "Akasha";
  symbol: string;
  activationAges: number[]; // e.g. [16, 24, 28]
  primaryThemes: string;
  materialManifestation: string;
  spiritualManifestation: string;
  remedyUpaya: string;
}

export interface VitalPointActivation {
  pointType: "Janma Nakshatra (Moon)" | "Lagna Nakshatra (Self)" | "Karma Nakshatra (10th Lord)" | "Atmakaraka Nakshatra (Soul)" | "Dhana Nakshatra (2nd/11th Lord)";
  nakshatraName: string;
  hindiName: string;
  pada: number;
  planetOccupant: string;
  activationAges: number[];
  isActiveNow: boolean;
  activationStatus: "Currently Active (सक्रिय)" | "Upcoming Milestone (आगामी)" | "Past Activated (अनुभूत)";
  closestActivationAge: number;
  yearsUntilActivation: number;
  phalaDescription: string;
  remedy: string;
}

export interface AgeMilestoneTrigger {
  age: number;
  activeNakshatras: Array<{
    name: string;
    hindiName: string;
    pointType: string;
    themes: string;
  }>;
  summaryPhala: string;
}

export interface NakshatraActivationResult {
  birthDate: Date;
  evaluationDate: Date;
  completedAge: number;
  runningYear: number; // e.g. 26 years 5 months -> running 27th year

  vitalPoints: VitalPointActivation[];
  currentlyActivePoints: VitalPointActivation[];
  upcomingActivations: VitalPointActivation[];

  lifetimeMilestones: AgeMilestoneTrigger[];
  executiveSynthesis: string;
  masterRemedyRecommendation: string;
}

// Complete 27 Nakshatras Classical Activation Years Master Table
export const NAKSHATRA_ACTIVATION_TABLE: NakshatraActivationMeta[] = [
  {
    index: 0,
    name: "Ashwini",
    hindiName: "अश्विनी",
    sanskritName: "अश्विनी",
    rulingPlanet: "Ketu",
    rulingDeity: "Ashwini Kumaras (Divine Physicians)",
    tatva: "Prithvi",
    symbol: "Horse's Head (अश्व मुख)",
    activationAges: [16, 24, 28],
    primaryThemes: "Swift action, healing, transportation, bold beginnings, surgical energy.",
    materialManifestation: "Sudden breakthroughs in career, acquiring vehicles, rapid advancement in technical/medical ventures.",
    spiritualManifestation: "Awakening of prana, spontaneous interest in Ayurvedic/energy healing, quick decision-making.",
    remedyUpaya: "Serve horses, donate medicines to the needy, and chant 'ॐ अश्विनीकुमाराभ्यां नमः'.",
  },
  {
    index: 1,
    name: "Bharani",
    hindiName: "भरणी",
    sanskritName: "भरणी",
    rulingPlanet: "Venus",
    rulingDeity: "Lord Yama (Dharmaraja)",
    tatva: "Agni",
    symbol: "Yoni (Divine Matrix / Womb)",
    activationAges: [24, 30, 36],
    primaryThemes: "Transformation, bearing heavy responsibilities, rebirth, restraint, karmic judgment.",
    materialManifestation: "Endurance through intense tests followed by major structural wealth, inheritance, or high societal duties.",
    spiritualManifestation: "Deep understanding of the cycle of birth and death, conquest of fear, spiritual discipline.",
    remedyUpaya: "Offer sweets to young girls, plant pomegranate trees, and chant Mahamrityunjaya Mantra.",
  },
  {
    index: 2,
    name: "Krittika",
    hindiName: "कृत्तिका",
    sanskritName: "कृत्तिका",
    rulingPlanet: "Sun",
    rulingDeity: "Agni Deva (Fire God)",
    tatva: "Prithvi",
    symbol: "Razor / Flame (अग्नि शिखा / छुरी)",
    activationAges: [30, 42],
    primaryThemes: "Purification, sharp leadership, cutting away illusions, administrative fire.",
    materialManifestation: "Executive authority, governmental favors, command in managerial/military/culinary sectors.",
    spiritualManifestation: "Burning away of past negative samskaras through ascetic focus (Tapasya).",
    remedyUpaya: "Perform Surya Arghya in a copper vessel and recite Aditya Hridaya Stotram daily.",
  },
  {
    index: 3,
    name: "Rohini",
    hindiName: "रोहिणी",
    sanskritName: "रोहिणी",
    rulingPlanet: "Moon",
    rulingDeity: "Lord Brahma (Creator)",
    tatva: "Prithvi",
    symbol: "Cart / Temple Chariot (रथ)",
    activationAges: [28, 36, 44],
    primaryThemes: "Fertility, material luxury, charm, agricultural and aesthetic prosperity.",
    materialManifestation: "Acquisition of real estate, luxurious conveyances, booming business, and immense creative popularity.",
    spiritualManifestation: "Devotion through divine love (Bhakti), connection with Mother Nature and beauty.",
    remedyUpaya: "Worship Goddess Mahalakshmi with white lotus flowers and offer milk to Lord Shiva on Mondays.",
  },
  {
    index: 4,
    name: "Mrigashira",
    hindiName: "मृगशिरा",
    sanskritName: "मृगशिरा",
    rulingPlanet: "Mars",
    rulingDeity: "Soma (Moon God / Divine Nectar)",
    tatva: "Prithvi",
    symbol: "Deer's Head (मृग शीर्ष)",
    activationAges: [28, 32, 40],
    primaryThemes: "Searching, travel, research, gentle exploration, intellectual curiosity.",
    materialManifestation: "Career relocation, publishing research, mastery of analytical/technical subjects, trading gains.",
    spiritualManifestation: "Seeking higher truth (Brahma-Jijnasa) and finding spiritual guidance after persistent seeking.",
    remedyUpaya: "Feed green fodder to cows and chant 'ॐ सोमाय नमः' or Sri Rudram.",
  },
  {
    index: 5,
    name: "Ardra",
    hindiName: "आर्द्रा",
    sanskritName: "आर्द्रा",
    rulingPlanet: "Rahu",
    rulingDeity: "Rudra (Lord of Storms & Transformation)",
    tatva: "Jala",
    symbol: "Teardrop / Diamond (अश्रु बिन्दु)",
    activationAges: [36, 40, 42],
    primaryThemes: "Storm before calm, emotional catharsis, technological breakthroughs, intellectual genius.",
    materialManifestation: "Massive turnaround after initial turbulence, international IT/data mastery, sudden fortune.",
    spiritualManifestation: "Total surrender to Shiva; tears of devotion cleansing accumulated grief and ego.",
    remedyUpaya: "Perform Rudrabhishekam with sugarcane juice and feed birds daily.",
  },
  {
    index: 6,
    name: "Punarvasu",
    hindiName: "पुनर्वसु",
    sanskritName: "पुनर्वसु",
    rulingPlanet: "Jupiter",
    rulingDeity: "Aditi (Cosmic Mother of Gods)",
    tatva: "Jala",
    symbol: "Bow & Quiver of Arrows (धनुष-बाण)",
    activationAges: [28, 48],
    primaryThemes: "Return of wealth (पुनः वसु), renewal, house acquisition, mentoring, forgiveness.",
    materialManifestation: "Recovery of lost property/prestige, establishing educational/advisory institutions, residential success.",
    spiritualManifestation: "Boundless optimism, spiritual shelter under Divine Mother, expansion of consciousness.",
    remedyUpaya: "Respect teachers/gurus, donate yellow fruits to scholars, and recite Vishnu Sahasranamam.",
  },
  {
    index: 7,
    name: "Pushya",
    hindiName: "पुष्य",
    sanskritName: "पुष्य",
    rulingPlanet: "Saturn",
    rulingDeity: "Brihaspati (Guru of the Gods)",
    tatva: "Jala",
    symbol: "Udder of Cow / Lotus Flower (धेनु का थन / कमल)",
    activationAges: [32, 40, 48],
    primaryThemes: "Supreme nourishment, institutional stability, Dharma, unshakeable prosperity.",
    materialManifestation: "Highest career authority, flourishing businesses, spiritual and financial patronage.",
    spiritualManifestation: "Attainment of inner stillness (Brahma-Jnana), selfless service and dharmic leadership.",
    remedyUpaya: "Perform Brihaspati Puja with turmeric on Thursdays and serve elderly saints.",
  },
  {
    index: 8,
    name: "Ashlesha",
    hindiName: "अश्लेषा",
    sanskritName: "अश्लेषा",
    rulingPlanet: "Mercury",
    rulingDeity: "Nagas (Serpent Deities)",
    tatva: "Jala",
    symbol: "Coiled Serpent (कुण्डलित सर्प)",
    activationAges: [32, 40, 52],
    primaryThemes: "Kundalini shakti, intuitive mastery, medicinal research, caution in toxic entanglements.",
    materialManifestation: "Mastery of pharmacology, psychology, covert strategy, high financial maneuvering.",
    spiritualManifestation: "Awakening of Serpent Power (Kundalini), mastery over senses and instinctive drives.",
    remedyUpaya: "Offer milk to Snake Deities on Nag Panchami and recite Sarpa Suktam / Maha Shiva Mantras.",
  },
  {
    index: 9,
    name: "Magha",
    hindiName: "मघा",
    sanskritName: "मघा",
    rulingPlanet: "Ketu",
    rulingDeity: "Pitris (Ancestral Forefathers)",
    tatva: "Agni",
    symbol: "Royal Throne (राज सिंहासन)",
    activationAges: [28, 36, 48],
    primaryThemes: "Ancestral legacy, royal authority, honoring lineage, social leadership.",
    materialManifestation: "Ascending to leadership positions, receiving family blessings/inheritance, prestigious honors.",
    spiritualManifestation: "Resolution of ancestral karmic debts (Pitri Rin) and deep connection with lineage guides.",
    remedyUpaya: "Perform Pitri Tarpan during Amavasya, feed black dogs, and support ancestral temples.",
  },
  {
    index: 10,
    name: "Purva Phalguni",
    hindiName: "पूर्वाफाल्गुनी",
    sanskritName: "पूर्वाफाल्गुनी",
    rulingPlanet: "Venus",
    rulingDeity: "Bhaga (God of Fortune & Prosperity)",
    tatva: "Jala",
    symbol: "Front Legs of Bed / Hammock (शय्या)",
    activationAges: [28, 38],
    primaryThemes: "Creative arts, marital bliss, sensory comfort, relaxation, wealth creation.",
    materialManifestation: "Success in entertainment, hospitality, luxury brands, flourishing marital harmony.",
    spiritualManifestation: "Appreciation of divine creation through Bhakti, finding God in beauty and devotion.",
    remedyUpaya: "Worship Goddess Lakshmi and donate fragrances, silken clothes or sweets to newlyweds.",
  },
  {
    index: 11,
    name: "Uttara Phalguni",
    hindiName: "उत्तराफाल्गुनी",
    sanskritName: "उत्तराफाल्गुनी",
    rulingPlanet: "Sun",
    rulingDeity: "Aryaman (God of Patronage & Alliances)",
    tatva: "Agni",
    symbol: "Back Legs of Bed (शय्या भाग)",
    activationAges: [30, 36, 45],
    primaryThemes: "Long-term contracts, social benevolence, enduring marriage, stable governance.",
    materialManifestation: "Lucrative government contracts, powerful business partnerships, community stature.",
    spiritualManifestation: "Dharmic fulfillment through selfless social duty (Loka-Sangraha).",
    remedyUpaya: "Sponsor community meals (Annadana) and chant Gayatri Mantra 108 times at sunrise.",
  },
  {
    index: 12,
    name: "Hasta",
    hindiName: "हस्त",
    sanskritName: "हस्त",
    rulingPlanet: "Moon",
    rulingDeity: "Savitri (Solar Creative Energy)",
    tatva: "Vayu",
    symbol: "Open Hand / Clenched Fist (हस्त)",
    activationAges: [32, 42],
    primaryThemes: "Dexterity, craftsmanship, commerce, healing touch, trading skill.",
    materialManifestation: "Mastery of hand-skills, computing, stock trading, surgery, business negotiations.",
    spiritualManifestation: "Harnessing the power of Mudras, Pranayama, and creative spiritual manifestation.",
    remedyUpaya: "Offer green grass to cows, donate stationeries to children, and practice Savita Dhyana.",
  },
  {
    index: 13,
    name: "Chitra",
    hindiName: "चित्रा",
    sanskritName: "चित्रा",
    rulingPlanet: "Mars",
    rulingDeity: "Twashtar / Vishwakarma (Celestial Architect)",
    tatva: "Agni",
    symbol: "Brilliant Jewel / Pearl (दीप्तिमान मणि)",
    activationAges: [32, 38, 44],
    primaryThemes: "Visual brilliance, architectural genius, charismatic presence, design mastery.",
    materialManifestation: "Breakthrough in architecture, fashion, interior design, sudden worldly recognition.",
    spiritualManifestation: "Perceiving the universe as a divine tapestry of forms (Maya as God's art).",
    remedyUpaya: "Worship Lord Vishwakarma and donate colorful clothes or artistic materials to temples.",
  },
  {
    index: 14,
    name: "Swati",
    hindiName: "स्वाति",
    sanskritName: "स्वाति",
    rulingPlanet: "Rahu",
    rulingDeity: "Vayu (Wind God)",
    tatva: "Vayu",
    symbol: "Young Shoot / Coral (वायु में लहराता अंकुर)",
    activationAges: [30, 38, 46],
    primaryThemes: "Independence, flexibility, international trade, financial freedom, agility.",
    materialManifestation: "Flourishing global commerce, aviation, independent enterprise, wealth expansion.",
    spiritualManifestation: "Cultivating detachment like the wind (Vayu-like freedom of the soul).",
    remedyUpaya: "Feed stray birds on Wednesdays/Saturdays and chant 'ॐ वायवे नमः' or Shiva Sahasranamam.",
  },
  {
    index: 15,
    name: "Vishakha",
    hindiName: "विशाखा",
    sanskritName: "विशाखा",
    rulingPlanet: "Jupiter",
    rulingDeity: "Indra & Agni (Supreme Power & Fire)",
    tatva: "Agni",
    symbol: "Triumphal Arch / Potter's Wheel (विजय तोरण)",
    activationAges: [34, 42, 50],
    primaryThemes: "Single-minded perseverance, triumph over obstacles, dual career prowess.",
    materialManifestation: "Reaching the pinnacle of achievements after relentless effort; victory in competitive arenas.",
    spiritualManifestation: "Directing intense ambition towards spiritual self-realization and discipline.",
    remedyUpaya: "Worship Lord Kartikeya or Lord Narasimha and light ghee lamps at holy shrines.",
  },
  {
    index: 16,
    name: "Anuradha",
    hindiName: "अनुराधा",
    sanskritName: "अनुराधा",
    rulingPlanet: "Saturn",
    rulingDeity: "Mitra (God of Friendship & Cosmic Order)",
    tatva: "Jala",
    symbol: "Lotus Flower / Staff (कमल / दण्ड)",
    activationAges: [32, 48],
    primaryThemes: "Devotion, international alliances, organizational harmony, resilience.",
    materialManifestation: "Success in foreign lands, building enduring networks, high organizational trust.",
    spiritualManifestation: "Pure unconditional devotion (Radha Bhakti) and flowering of the heart chakra.",
    remedyUpaya: "Serve pilgrims and saints, donate sesame oil to Lord Shani, and cultivate harmonious friendships.",
  },
  {
    index: 17,
    name: "Jyeshtha",
    hindiName: "ज्येष्ठा",
    sanskritName: "ज्येष्ठा",
    rulingPlanet: "Mercury",
    rulingDeity: "Indra (King of the Gods)",
    tatva: "Vayu",
    symbol: "Circular Amulet / Umbrella (छत्र / रक्षा कवच)",
    activationAges: [36, 44, 52],
    primaryThemes: "Seniority, administrative dominance, guardianship, protection of assets.",
    materialManifestation: "Reaching the highest administrative rank in family or enterprise; securing major patrimony.",
    spiritualManifestation: "Assuming spiritual guardianship; protecting weaker souls with wisdom.",
    remedyUpaya: "Recite Vishnu Sahasranamam and donate umbrella or protective gear to poor workers.",
  },
  {
    index: 18,
    name: "Mula",
    hindiName: "मूल",
    sanskritName: "मूल",
    rulingPlanet: "Ketu",
    rulingDeity: "Nirriti (Goddess of Dissolution & Root Truth)",
    tatva: "Agni",
    symbol: "Tied Bunch of Roots / Elephant Goad (मूल / अंकुश)",
    activationAges: [36, 42, 50],
    primaryThemes: "Uprooting superficial structures, deep research, uncompromising truth, non-attachment.",
    materialManifestation: "Profound research breakthrough, investigative triumph, complete renewal of life direction.",
    spiritualManifestation: "Cutting down the root of ignorance (Avidya); direct spiritual awakening.",
    remedyUpaya: "Worship Lord Ganesha, feed root vegetables to cattle, and chant 'ॐ केतवे नमः'.",
  },
  {
    index: 19,
    name: "Purva Ashadha",
    hindiName: "पूर्वाषाढ़ा",
    sanskritName: "पूर्वाषाढ़ा",
    rulingPlanet: "Venus",
    rulingDeity: "Apas (Cosmic Waters)",
    tatva: "Jala",
    symbol: "Winnowing Fan / Elephant Tusk (सूप / गजदन्त)",
    activationAges: [28, 38],
    primaryThemes: "Invincible victory, magnetic eloquence, purifying waters, creative flourish.",
    materialManifestation: "Public acclaim, victory in debates/litigation, prosperity in water/chemical/creative trades.",
    spiritualManifestation: "Purification of emotions through divine love, flowing with cosmic will.",
    remedyUpaya: "Conserve water, donate earthen pots filled with cool water in summer, and worship Lakshmi Narayana.",
  },
  {
    index: 20,
    name: "Uttara Ashadha",
    hindiName: "उत्तराषाढ़ा",
    sanskritName: "उत्तराषाढ़ा",
    rulingPlanet: "Sun",
    rulingDeity: "Vishwedevas (10 Universal Cosmic Gods)",
    tatva: "Prithvi",
    symbol: "Small Planks / Elephant Tusk (काष्ठ पट्ट)",
    activationAges: [31, 38, 45],
    primaryThemes: "Permanent victory, unshakeable integrity, global respect, statesmanship.",
    materialManifestation: "Enduring political or corporate leadership, building permanent monuments/institutions.",
    spiritualManifestation: "Embodying universal brotherhood (Vasudhaiva Kutumbakam) and unshakeable Dharma.",
    remedyUpaya: "Chant the 12 Names of Lord Surya at sunrise and feed wheat flour balls to fish.",
  },
  {
    index: 21,
    name: "Shravana",
    hindiName: "श्रवण",
    sanskritName: "श्रवण",
    rulingPlanet: "Moon",
    rulingDeity: "Lord Vishnu (Preserver of the Universe)",
    tatva: "Vayu",
    symbol: "Ear / Three Footprints of Vamana (कर्ण / वामन पद)",
    activationAges: [30, 39, 48],
    primaryThemes: "Attentive listening, oral knowledge transmission, media acclaim, divine wisdom.",
    materialManifestation: "Public speaking fame, academic honors, media broadcasting success, extensive travel.",
    spiritualManifestation: "Mastery of Shravana (listening to sacred truths) and deep spiritual discernment.",
    remedyUpaya: "Listen to and chant Vishnu Sahasranamam, respect parents, and support Vedic audio/education.",
  },
  {
    index: 22,
    name: "Dhanishta",
    hindiName: "धनिष्ठा",
    sanskritName: "धनिष्ठा",
    rulingPlanet: "Mars",
    rulingDeity: "Ashta Vasus (8 Elemental Gods of Wealth)",
    tatva: "Agni",
    symbol: "Musical Drum / Flute (मृदंग / डमरू)",
    activationAges: [36, 42],
    primaryThemes: "Abundant wealth (वसु धन), music/rhythm, real estate, social symphony.",
    materialManifestation: "Accumulation of liquid wealth and gold, prominent success in entertainment/property/politics.",
    spiritualManifestation: "Tuning the inner body to cosmic Nada Brahma (divine sound current).",
    remedyUpaya: "Donate musical instruments or sound systems to temples, and chant Sri Suktam.",
  },
  {
    index: 23,
    name: "Shatabhisha",
    hindiName: "शतभिषा",
    sanskritName: "शतभिषा",
    rulingPlanet: "Rahu",
    rulingDeity: "Lord Varuna (Cosmic Ocean & Stellar Healer)",
    tatva: "Akasha",
    symbol: "Empty Circle / 100 Physicians (शत चिकित्सक चक्र)",
    activationAges: [34, 42, 52],
    primaryThemes: "Miraculous healing, 100 solutions to impossible problems, cosmic secrets, astronomy.",
    materialManifestation: "High medical/astronomical breakthrough, solving complex technological enigmas, financial secrets.",
    spiritualManifestation: "Connecting with the infinite void of cosmic consciousness (Akasha Tattva).",
    remedyUpaya: "Serve hospital patients with free medicines and chant Mahamrityunjaya Mantra 108 times.",
  },
  {
    index: 24,
    name: "Purva Bhadrapada",
    hindiName: "पूर्वाभाद्रपद",
    sanskritName: "पूर्वाभाद्रपद",
    rulingPlanet: "Jupiter",
    rulingDeity: "Aja Ekapada (One-Footed Cosmic Serpent of Fire)",
    tatva: "Vayu",
    symbol: "Swords / Two-Faced Man (द्विमुख मनुष्य / खड्ग)",
    activationAges: [36, 44, 54],
    primaryThemes: "Fiery asceticism, radical transformation, philosophical depth, financial mastery.",
    materialManifestation: "Acquiring immense wealth through unorthodox investments, occult advisory, spiritual leadership.",
    spiritualManifestation: "Total detachment from material illusions; purification through inner fire.",
    remedyUpaya: "Perform havan with Ghee and Samidha woods, and chant 'ॐ एकपादाय नमः'.",
  },
  {
    index: 25,
    name: "Uttara Bhadrapada",
    hindiName: "उत्तराभाद्रपद",
    sanskritName: "उत्तराभाद्रपद",
    rulingPlanet: "Saturn",
    rulingDeity: "Ahirbudhnya (Serpent of the Deep Abyssal Ocean)",
    tatva: "Jala",
    symbol: "Twin in the Water / Back Legs of Funeral Cot (गंभीर जल)",
    activationAges: [36, 45, 54],
    primaryThemes: "Deep wisdom, benevolent stability, stillness, charitable power.",
    materialManifestation: "Long-term enduring prosperity, spiritual philanthropy, steady institutional authority.",
    spiritualManifestation: "Attaining Samadhi in deep meditation; unshakeable inner peace amidst outer turbulence.",
    remedyUpaya: "Feed fishes in natural water bodies and meditate in quiet seclusion on Saturdays.",
  },
  {
    index: 26,
    name: "Revati",
    hindiName: "रेवती",
    sanskritName: "रेवती",
    rulingPlanet: "Mercury",
    rulingDeity: "Pushan (Nourisher of Travelers & Herds)",
    tatva: "Jala",
    symbol: "Pair of Fish / Drum (मीन युगल / मृदंग)",
    activationAges: [27, 32, 42],
    primaryThemes: "Safe journeys, culmination of spiritual path, wealth in gems and animals, compassion.",
    materialManifestation: "Prosperous international trade, travel breakthroughs, immense wealth in artistic/commercial realms.",
    spiritualManifestation: "Moksha orientation, universal compassion for all living beings, return to the divine source.",
    remedyUpaya: "Feed cows and fishes, support animal shelters, and chant 'ॐ पूष्णे नमः'.",
  },
];

/**
 * Main Function: Calculate Native's 27 Nakshatras Activation Milestones
 */
export function evaluateNakshatraActivation(
  natalEphem: EphemerisResult,
  birthDate: Date,
  evaluationDate: Date = new Date()
): NakshatraActivationResult {
  // 1. Calculate Age
  const diffMs = evaluationDate.getTime() - birthDate.getTime();
  const completedAge = Math.floor(diffMs / (365.25 * 24 * 3600 * 1000));
  const runningYear = completedAge + 1;

  // 2. Identify Vital Points
  // A. Moon Nakshatra (Janma)
  const moonNak = natalEphem.planets.Moon?.nakshatra || { index: 0, pada: 1, name: "Ashwini" };
  // B. Lagna Nakshatra
  const lagnaNak = natalEphem.ascendant.nakshatra || { index: 0, pada: 1, name: "Ashwini" };
  // C. 10th Lord Nakshatra (Karma)
  const ascRashiIdx = natalEphem.ascendant.rashi.index;
  const tenthRashiIdx = (ascRashiIdx + 9) % 12;
  const tenthLordName = RASHIS[tenthRashiIdx].lord;
  const tenthLordPlanet = natalEphem.planets[tenthLordName];
  const karmaNak = tenthLordPlanet ? tenthLordPlanet.nakshatra : { index: 0, pada: 1, name: "Ashwini" };
  // D. Atmakaraka Nakshatra (Soul)
  const jaimini = calculateJaiminiKarakas(natalEphem);
  const akPlanetName = jaimini.atmakaraka.planetName;
  const akPlanet = natalEphem.planets[akPlanetName];
  const akNak = akPlanet ? akPlanet.nakshatra : { index: 0, pada: 1, name: "Ashwini" };
  // E. Dhana Nakshatra (2nd Lord)
  const secondRashiIdx = (ascRashiIdx + 1) % 12;
  const secondLordName = RASHIS[secondRashiIdx].lord;
  const secondLordPlanet = natalEphem.planets[secondLordName];
  const dhanaNak = secondLordPlanet ? secondLordPlanet.nakshatra : { index: 0, pada: 1, name: "Ashwini" };

  const vitalMetaPoints: Array<{
    pointType: VitalPointActivation["pointType"];
    nakIndex: number;
    pada: number;
    occupant: string;
  }> = [
    { pointType: "Janma Nakshatra (Moon)", nakIndex: moonNak.index, pada: moonNak.pada, occupant: "Moon (चन्द्र)" },
    { pointType: "Lagna Nakshatra (Self)", nakIndex: lagnaNak.index, pada: lagnaNak.pada, occupant: "Ascendant (लग्न)" },
    { pointType: "Karma Nakshatra (10th Lord)", nakIndex: karmaNak.index, pada: karmaNak.pada, occupant: `${tenthLordName} (10th Lord)` },
    { pointType: "Atmakaraka Nakshatra (Soul)", nakIndex: akNak.index, pada: akNak.pada, occupant: `${jaimini.atmakaraka} (AK)` },
    { pointType: "Dhana Nakshatra (2nd/11th Lord)", nakIndex: dhanaNak.index, pada: dhanaNak.pada, occupant: `${secondLordName} (2nd Lord)` },
  ];

  const vitalPoints: VitalPointActivation[] = vitalMetaPoints.map((vp) => {
    const meta = NAKSHATRA_ACTIVATION_TABLE[vp.nakIndex] || NAKSHATRA_ACTIVATION_TABLE[0];
    const isNow = meta.activationAges.includes(completedAge) || meta.activationAges.includes(runningYear);

    // Find closest upcoming activation age
    const upcomingAges = meta.activationAges.filter((a) => a >= completedAge);
    const closestAge = upcomingAges.length > 0 ? upcomingAges[0] : meta.activationAges[meta.activationAges.length - 1];
    const yearsUntil = Math.max(0, closestAge - completedAge);

    const status: VitalPointActivation["activationStatus"] = isNow
      ? "Currently Active (सक्रिय)"
      : upcomingAges.length > 0
      ? "Upcoming Milestone (आगामी)"
      : "Past Activated (अनुभूत)";

    return {
      pointType: vp.pointType,
      nakshatraName: meta.name,
      hindiName: meta.hindiName,
      pada: vp.pada,
      planetOccupant: vp.occupant,
      activationAges: meta.activationAges,
      isActiveNow: isNow,
      activationStatus: status,
      closestActivationAge: closestAge,
      yearsUntilActivation: yearsUntil,
      phalaDescription: `${meta.primaryThemes} ${meta.materialManifestation}`,
      remedy: meta.remedyUpaya,
    };
  });

  const currentlyActivePoints = vitalPoints.filter((vp) => vp.isActiveNow);
  const upcomingActivations = vitalPoints.filter((vp) => vp.activationStatus === "Upcoming Milestone (आगामी)");

  // 3. Build Lifetime Milestones Matrix (Ages 16 to 60)
  const milestoneMap = new Map<number, AgeMilestoneTrigger>();
  for (const vp of vitalPoints) {
    for (const age of vp.activationAges) {
      if (!milestoneMap.has(age)) {
        milestoneMap.set(age, {
          age,
          activeNakshatras: [],
          summaryPhala: "",
        });
      }
      milestoneMap.get(age)!.activeNakshatras.push({
        name: vp.nakshatraName,
        hindiName: vp.hindiName,
        pointType: vp.pointType,
        themes: vp.phalaDescription,
      });
    }
  }

  const lifetimeMilestones = Array.from(milestoneMap.values())
    .sort((a, b) => a.age - b.age)
    .map((m) => {
      const pointNames = m.activeNakshatras.map((n) => `${n.name} (${n.pointType})`).join(", ");
      m.summaryPhala = `Age ${m.age} activates ${pointNames}. Major milestone in worldly status, responsibility, and destiny realization.`;
      return m;
    });

  // 4. Executive Synthesis
  let execSynthesis = "";
  if (currentlyActivePoints.length > 0) {
    const activeNames = currentlyActivePoints.map((p) => `**${p.nakshatraName} (${p.pointType})**`).join(" & ");
    execSynthesis = `At your current age of **${completedAge} (running ${runningYear}th year)**, your ${activeNames} is in active **Cosmic Awakening (नक्षत्र जागरण)**! The dormant planetary frequencies of ${currentlyActivePoints.map((p) => p.planetOccupant).join(", ")} are currently energized, bringing major shifts in: ${currentlyActivePoints.map((p) => p.phalaDescription).join("; ")}.`;
  } else if (upcomingActivations.length > 0) {
    const nextAct = upcomingActivations.sort((a, b) => a.yearsUntilActivation - b.yearsUntilActivation)[0];
    execSynthesis = `At your current age of **${completedAge} (running ${runningYear}th year)**, you are approaching your next major **Nakshatra Awakening at Age ${nextAct.closestActivationAge}** when **${nextAct.nakshatraName} (${nextAct.pointType})** awakens in ~${nextAct.yearsUntilActivation} years, triggering: ${nextAct.phalaDescription}.`;
  } else {
    execSynthesis = `Your primary natal Nakshatras have successfully passed their primordial early activations. You are now integrating the mature, enduring fruits of these celestial energies into your lifelong dharmic purpose.`;
  }

  const masterRemedy = currentlyActivePoints.length > 0
    ? currentlyActivePoints[0].remedy
    : (upcomingActivations[0]?.remedy || "Chant the Gayatri Mantra 108 times daily and honor your Kuladevata.");

  return {
    birthDate,
    evaluationDate,
    completedAge,
    runningYear,
    vitalPoints,
    currentlyActivePoints,
    upcomingActivations,
    lifetimeMilestones,
    executiveSynthesis: execSynthesis,
    masterRemedyRecommendation: masterRemedy,
  };
}

/**
 * Helper to generate Markdown Section for AI Chatbot Dossier
 */
export function generateNakshatraActivationSummary(
  natalEphem: EphemerisResult,
  birthDate: Date,
  evaluationDate: Date = new Date()
): string {
  const res = evaluateNakshatraActivation(natalEphem, birthDate, evaluationDate);
  const activeLines = res.currentlyActivePoints.length > 0
    ? res.currentlyActivePoints.map((p) => `- 🌟 **CURRENTLY AWAKENED NAKSHATRA:** **${p.nakshatraName} (${p.hindiName})** (Pada ${p.pada} - ${p.pointType}) • Planetary Energy: **${p.planetOccupant}** • **Manifestation:** ${p.phalaDescription} -> **Remedy:** ${p.remedy}`)
    : ["- No singular Nakshatra is in primary awakening this exact month; native is integrating prior karmic activations."];

  const upcomingLines = res.upcomingActivations.slice(0, 3).map(
    (p) => `- ⏳ **Upcoming Awakening at Age ${p.closestActivationAge} (~${p.yearsUntilActivation} yrs):** **${p.nakshatraName} (${p.pointType})** -> ${p.phalaDescription}`
  );

  return [
    `### 🌟 NAKSHATRA ACTIVATION YEARS & COSMIC AWAKENING (DR. SAMIR TRIPATHI & NADI SHASTRA):`,
    `- **Native's Current Age:** **${res.completedAge} Completed Years (Running ${res.runningYear}th Year)**`,
    ...activeLines,
    `- **Upcoming Nakshatra Milestones:**`,
    ...upcomingLines,
    `- **Executive Nakshatra Synthesis:** ${res.executiveSynthesis}`,
    `- **Prescribed Nakshatra Awakening Remedy:** ${res.masterRemedyRecommendation}`,
  ].join("\n");
}
