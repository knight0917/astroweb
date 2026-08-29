/**
 * D-60 Shashtiamsha, Bhrigu Chakra Paddhati (BCP) & 108 Surya Remedies Engine
 * References:
 * - Brihat Parashara Hora Shastra (BPHS Ch. 6 - Shashtiamsha Varga)
 * - Secrets of Shashtiamsha & BCP (Saptarishis Astrology)
 * - Surya Ashtottara Shatanamavali (108 Names of the Sun)
 */

import { EphemerisResult, ShashtiamshaAnalysis, ShashtiamshaDeityCategory, ShashtiamshaPlanetResult, BcpAnalysis, BcpAgeCycle, SuryaRemedialAnalysis, Surya108Name } from "./types";
import { RASHI_NAMES } from "./constants";

export const SHASHTIAMSHA_DEITIES: { num: number; name: string; sanskrit: string; category: ShashtiamshaDeityCategory; signification: string }[] = [
  { num: 1, name: "Ghora", sanskrit: "घोर", category: "Ghora (घोर / क्रूर - 20%)", signification: "Fierce, intense karmic trials requiring patience and forbearance" },
  { num: 2, name: "Rakshasa", sanskrit: "राक्षस", category: "Ghora (घोर / क्रूर - 20%)", signification: "Obstinacy, raw impulse, and overcoming dark adversarial forces" },
  { num: 3, name: "Deva", sanskrit: "देव", category: "Mridu (सौम्य / देव - 100%)", signification: "Pure divine light, virtue, auspicious beginnings, and spiritual grace" },
  { num: 4, name: "Kubera", sanskrit: "कुबेर", category: "Mridu (सौम्य / देव - 100%)", signification: "Lord of wealth, material abundance, stewardship, and prosperity" },
  { num: 5, name: "Yaksha", sanskrit: "यक्ष", category: "Mishra (मिश्र - 60%)", signification: "Guardians of earth's treasures, occult gifts, and worldly enterprise" },
  { num: 6, name: "Kinnara", sanskrit: "किन्नर", category: "Mridu (सौम्य / देव - 100%)", signification: "Celestial music, artistic beauty, pleasant speech, and charm" },
  { num: 7, name: "Bhrashta", sanskrit: "भ्रष्ट", category: "Ghora (घोर / क्रूर - 20%)", signification: "Karmic lapses in past deeds requiring conscious ethical discipline" },
  { num: 8, name: "Kulaghna", sanskrit: "कुलघ्न", category: "Ghora (घोर / क्रूर - 20%)", signification: "Family/lineage discord demanding healing of ancestral karma" },
  { num: 9, name: "Garala", sanskrit: "गरल", category: "Ghora (घोर / क्रूर - 20%)", signification: "Toxicity, betrayal risks, and purification through truth" },
  { num: 10, name: "Vahni", sanskrit: "वह्नि", category: "Mishra (मिश्र - 60%)", signification: "Sacred fire, digestive power, transformative energy, and zeal" },
  { num: 11, name: "Maya", sanskrit: "माया", category: "Mishra (मिश्र - 60%)", signification: "Creative illusion, strategic intellect, and navigating worldly complexity" },
  { num: 12, name: "Purishaka", sanskrit: "पुरीषक", category: "Ghora (घोर / क्रूर - 20%)", signification: "Material entanglements and need for mental/physical detoxification" },
  { num: 13, name: "Apampati", sanskrit: "अपांपति", category: "Mridu (सौम्य / देव - 100%)", signification: "Lord of pure waters (Varuna), emotional sanctity, and depth" },
  { num: 14, name: "Marutvan", sanskrit: "मरुत्वान्", category: "Mridu (सौम्य / देव - 100%)", signification: "Swift vitality, intellectual agility, and expansion" },
  { num: 15, name: "Kaala", sanskrit: "काल", category: "Ghora (घोर / क्रूर - 20%)", signification: "Karmic reckoning, strict deadlines, and enduring patience" },
  { num: 16, name: "Sarpa", sanskrit: "सर्प", category: "Ghora (घोर / क्रूर - 20%)", signification: "Serpentine wisdom, hidden mysteries, and sensory mastery" },
  { num: 17, name: "Amrita", sanskrit: "अमृत", category: "Mridu (सौम्य / देव - 100%)", signification: "Nectar of immortality, rejuvenative health, and divine nectar" },
  { num: 18, name: "Indu", sanskrit: "इन्दु", category: "Mridu (सौम्य / देव - 100%)", signification: "Luminous lunar nectar, mental tranquility, and public popularity" },
  { num: 19, name: "Mridu", sanskrit: "मृदु", category: "Mridu (सौम्य / देव - 100%)", signification: "Gentleness, compassion, cordial relationships, and empathy" },
  { num: 20, name: "Komala", sanskrit: "कोमल", category: "Mridu (सौम्य / देव - 100%)", signification: "Tender affection, domestic elegance, and gracious conduct" },
  { num: 21, name: "Heramba", sanskrit: "हेरम्ब", category: "Mridu (सौम्य / देव - 100%)", signification: "Lord Ganesha's presence, removal of obstacles, and intellect" },
  { num: 22, name: "Brahma", sanskrit: "ब्रह्मा", category: "Mridu (सौम्य / देव - 100%)", signification: "Cosmic creator, foundational scholarship, and inventive genius" },
  { num: 23, name: "Vishnu", sanskrit: "विष्णु", category: "Mridu (सौम्य / देव - 100%)", signification: "Universal preserver, sustained righteousness, and divine protection" },
  { num: 24, name: "Maheshwara", sanskrit: "महेश्वर", category: "Mridu (सौम्य / देव - 100%)", signification: "Lord Shiva, destruction of illusions, and spiritual mastery" },
  { num: 25, name: "Deva", sanskrit: "देव", category: "Mridu (सौम्य / देव - 100%)", signification: "Celestial benevolence, noble character, and luminous aura" },
  { num: 26, name: "Ardra", sanskrit: "आर्द्र", category: "Mishra (मिश्र - 60%)", signification: "Emotional storm yielding fertile clarity and breakthrough" },
  { num: 27, name: "Kalinasha", sanskrit: "कलिनाश", category: "Mridu (सौम्य / देव - 100%)", signification: "Destruction of strife and discord, victory of truth" },
  { num: 28, name: "Kshiteesha", sanskrit: "क्षितीश", category: "Mridu (सौम्य / देव - 100%)", signification: "Lord of the earth, leadership, landed wealth, and authority" },
  { num: 29, name: "Kamalakar", sanskrit: "कमलाकर", category: "Mridu (सौम्य / देव - 100%)", signification: "Lotus lake, Goddess Lakshmi's blessing, and graceful fortune" },
  { num: 30, name: "Gulika", sanskrit: "गुलिक", category: "Ghora (घोर / क्रूर - 20%)", signification: "Son of Saturn, heavy karmic debt, and delayed outcomes" },
  { num: 31, name: "Mrityu", sanskrit: "मृत्यु", category: "Ghora (घोर / क्रूर - 20%)", signification: "Transformational mortality, profound rebirth, and letting go" },
  { num: 32, name: "Kaala", sanskrit: "काल", category: "Ghora (घोर / क्रूर - 20%)", signification: "Strict time matrix, discipline, and karmic accountability" },
  { num: 33, name: "Davagni", sanskrit: "दावाग्नि", category: "Ghora (घोर / क्रूर - 20%)", signification: "Wildfire, trial by fire, and burning away of negative karmas" },
  { num: 34, name: "Ghora", sanskrit: "घोर", category: "Ghora (घोर / क्रूर - 20%)", signification: "Courage in the face of daunting adversity" },
  { num: 35, name: "Yama", sanskrit: "यम", category: "Ghora (घोर / क्रूर - 20%)", signification: "Lord of moral law (Dharma), restraint, and fair judgment" },
  { num: 36, name: "Kantaka", sanskrit: "कण्टक", category: "Ghora (घोर / क्रूर - 20%)", signification: "Pricking obstacles, sharp vigilance, and careful speech" },
  { num: 37, name: "Sudha", sanskrit: "सुधा", category: "Mridu (सौम्य / देव - 100%)", signification: "Sweet nectar, healing food, and heartfelt contentment" },
  { num: 38, name: "Amrita", sanskrit: "अमृत", category: "Mridu (सौम्य / देव - 100%)", signification: "Immortal spiritual radiance, vitality, and longevity" },
  { num: 39, name: "Poornachandra", sanskrit: "पूर्णचन्द्र", category: "Mridu (सौम्य / देव - 100%)", signification: "Full moon, abundant wealth, popularity, and emotional completeness" },
  { num: 40, name: "Vishagdha", sanskrit: "विषदिग्ध", category: "Ghora (घोर / क्रूर - 20%)", signification: "Guarding against toxic associations and hidden enmities" },
  { num: 41, name: "Kulanasha", sanskrit: "कुलनाश", category: "Ghora (घोर / क्रूर - 20%)", signification: "Ancestral healing needed to restore harmonious lineage flow" },
  { num: 42, name: "Vamshakshaya", sanskrit: "वंशक्षय", category: "Ghora (घोर / क्रूर - 20%)", signification: "Preservation of family legacy through righteous action" },
  { num: 43, name: "Utpata", sanskrit: "उत्पात", category: "Ghora (घोर / क्रूर - 20%)", signification: "Sudden unexpected events requiring composure and grounding" },
  { num: 44, name: "Kaala", sanskrit: "काल", category: "Ghora (घोर / क्रूर - 20%)", signification: "Endurance through cyclic tests of time" },
  { num: 45, name: "Saumya", sanskrit: "सौम्य", category: "Mridu (सौम्य / देव - 100%)", signification: "Mercury's scholarly charm, eloquence, and intellectual brilliance" },
  { num: 46, name: "Komala", sanskrit: "कोमल", category: "Mridu (सौम्य / देव - 100%)", signification: "Gracious hospitality, peaceful temperament, and artistic joy" },
  { num: 47, name: "Shitara", sanskrit: "शीतल", category: "Mridu (सौम्य / देव - 100%)", signification: "Cool serenity, soothing presence, and stress relief" },
  { num: 48, name: "Karaladamshtra", sanskrit: "करालदंष्ट्र", category: "Ghora (घोर / क्रूर - 20%)", signification: "Daunting appearance, protective ferocity against evil" },
  { num: 49, name: "Chandramukhi", sanskrit: "चन्द्रमुखी", category: "Mridu (सौम्य / देव - 100%)", signification: "Attractive countenance, poetic vision, and pleasant demeanor" },
  { num: 50, name: "Praveena", sanskrit: "प्रवीण", category: "Mridu (सौम्य / देव - 100%)", signification: "Mastery of sciences, expert professional execution, and skill" },
  { num: 51, name: "Kalpavriksha", sanskrit: "कल्पवृक्ष", category: "Mridu (सौम्य / देव - 100%)", signification: "Wish-fulfilling tree, generosity, and charitable legacy" },
  { num: 52, name: "Dandayudha", sanskrit: "दण्डायुध", category: "Mishra (मिश्र - 60%)", signification: "Sovereign rod of justice, administrative authority, and discipline" },
  { num: 53, name: "Nirmala", sanskrit: "निर्मल", category: "Mridu (सौम्य / देव - 100%)", signification: "Stainless purity, clean reputation, and ethical clarity" },
  { num: 54, name: "Saumya", sanskrit: "सौम्य", category: "Mridu (सौम्य / देव - 100%)", signification: "Harmonious balance, diplomatic tact, and refined intellect" },
  { num: 55, name: "Krura", sanskrit: "क्रूर", category: "Ghora (घोर / क्रूर - 20%)", signification: "Uncompromising firmness and courageous decisiveness" },
  { num: 56, name: "Atisheetala", sanskrit: "अतिशीतल", category: "Mridu (सौम्य / देव - 100%)", signification: "Profound spiritual calm, meditative bliss, and peace" },
  { num: 57, name: "Amrita", sanskrit: "अमृत", category: "Mridu (सौम्य / देव - 100%)", signification: "Endless reservoir of life force, healing, and divine grace" },
  { num: 58, name: "Payodhi", sanskrit: "पयोधि", category: "Mridu (सौम्य / देव - 100%)", signification: "Ocean of milk, vast abundance, generosity, and deep wisdom" },
  { num: 59, name: "Bhramana", sanskrit: "भ्रमण", category: "Mishra (मिश्र - 60%)", signification: "Global travel, dynamic exploration, and nomadic curiosity" },
  { num: 60, name: "Chandrarekha", sanskrit: "चन्द्ररेखा", category: "Mridu (सौम्य / देव - 100%)", signification: "Luminous crescent ray, visionary intuition, and high fortune" },
];

export function getShashtiamshaForLongitude(longitude: number): {
  d60SignIdx: number;
  d60SignName: string;
  d60Degree: string;
  shashtiamshaNum: number;
  deity: typeof SHASHTIAMSHA_DEITIES[0];
} {
  const normLon = ((longitude % 360) + 360) % 360;
  const signIdx = Math.floor(normLon / 30);
  const degInSign = normLon % 30;
  const part = Math.floor(degInSign / 0.5); // 0 to 59
  const isOddSign = signIdx % 2 === 0; // Aries is idx 0 (Odd Sign)

  const shashtiamshaNum = isOddSign ? part + 1 : 60 - part;
  const deity = SHASHTIAMSHA_DEITIES[shashtiamshaNum - 1] || SHASHTIAMSHA_DEITIES[0];

  const d60SignIdx = (signIdx + part) % 12;
  const d60SignName = RASHI_NAMES[d60SignIdx].englishName;
  const degInD60 = ((degInSign % 0.5) * 60).toFixed(1);

  return {
    d60SignIdx,
    d60SignName,
    d60Degree: degInD60,
    shashtiamshaNum,
    deity,
  };
}

export function evaluateShashtiamsha(ephemeris: EphemerisResult): ShashtiamshaAnalysis {
  const planets: Record<string, ShashtiamshaPlanetResult> = {};
  const ghoraDeityRemedialWarnings: string[] = [];
  let totalKarmicPoints = 0;

  const targetPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  targetPlanets.forEach((pName) => {
    const pData = ephemeris.planets[pName];
    if (!pData) return;

    const shInfo = getShashtiamshaForLongitude(pData.siderealLongitude);
    const score = shInfo.deity.category.includes("100%") ? 95 : shInfo.deity.category.includes("60%") ? 65 : 30;
    totalKarmicPoints += score;

    if (shInfo.deity.category.includes("20%")) {
      ghoraDeityRemedialWarnings.push(`${pName} in Shashtiamsha #${shInfo.shashtiamshaNum} (${shInfo.deity.name} - ${shInfo.deity.sanskrit}) -> Demands spiritual purification and selfless service in ${pName}'s domain.`);
    }

    planets[pName] = {
      planetName: pName,
      longitude: pData.siderealLongitude,
      d60SignName: shInfo.d60SignName,
      d60Degree: shInfo.d60Degree,
      shashtiamshaNumber: shInfo.shashtiamshaNum,
      deityName: `${shInfo.deity.name} (${shInfo.deity.sanskrit})`,
      deityCategory: shInfo.deity.category,
      sanchitaKarmaSignification: shInfo.deity.signification,
      karmicPotencyScore: score,
      lifeManifestation: `${pName} is energized by ${shInfo.deity.name} Shashtiamsha in D60 ${shInfo.d60SignName}, driving past-life karma through ${shInfo.deity.signification}.`,
    };
  });

  // Lagna Shashtiamsha
  const lagnaSh = getShashtiamshaForLongitude(ephemeris.ascendant.siderealLongitude);
  const lagnaScore = lagnaSh.deity.category.includes("100%") ? 95 : lagnaSh.deity.category.includes("60%") ? 65 : 30;
  totalKarmicPoints += lagnaScore;

  const lagnaResult: ShashtiamshaPlanetResult = {
    planetName: "Ascendant (Lagna)",
    longitude: ephemeris.ascendant.siderealLongitude,
    d60SignName: lagnaSh.d60SignName,
    d60Degree: lagnaSh.d60Degree,
    shashtiamshaNumber: lagnaSh.shashtiamshaNum,
    deityName: `${lagnaSh.deity.name} (${lagnaSh.deity.sanskrit})`,
    deityCategory: lagnaSh.deity.category,
    sanchitaKarmaSignification: lagnaSh.deity.signification,
    karmicPotencyScore: lagnaScore,
    lifeManifestation: `Lagna is anchored in ${lagnaSh.deity.name} Shashtiamsha, representing core soul destiny: ${lagnaSh.deity.signification}.`,
  };

  const sanchitaKarmaScore = Math.round(totalKarmicPoints / 10);
  const mriduCount = Object.values(planets).filter((p) => p.deityCategory.includes("100%")).length + (lagnaResult.deityCategory.includes("100%") ? 1 : 0);
  const dominantKarmicOrientation = mriduCount >= 6 ? "Subha Sanchita Karma (High Past-Life Dharmic Credit)" : "Balanced Karmic Matrix (Requires Active Spiritual Alignment)";

  const masterShashtiamshaSynthesis = `D-60 Shashtiamsha evaluation reveals a Sanchita Karma Index of ${sanchitaKarmaScore}%. Lagna embodies ${lagnaResult.deityName} (${lagnaResult.deityCategory}), with ${mriduCount}/10 points in Deva/Mridu Shashtiamshas conferring strong inherited merit.`;

  return {
    planets,
    lagnaResult,
    sanchitaKarmaScore,
    dominantKarmicOrientation,
    ghoraDeityRemedialWarnings,
    masterShashtiamshaSynthesis,
  };
}

// ----------------------------------------------------
// BHRIGU CHAKRA PADDHATI (BCP) 12-YEAR PROGRESSIVE WHEEL
// ----------------------------------------------------

export function evaluateBcpWheel(ephemeris: EphemerisResult, currentAge: number = 28): BcpAnalysis {
  const ascRashiIdx = Math.floor(ephemeris.ascendant.siderealLongitude / 30);
  const planets = ephemeris.planets;

  const getCycleForAge = (age: number): BcpAgeCycle => {
    const activeHouseNum = ((age - 1) % 12) + 1;
    const cycleNumber = Math.floor((age - 1) / 12) + 1;
    const houseSignIdx = (ascRashiIdx + activeHouseNum - 1) % 12;
    const houseSignName = RASHI_NAMES[houseSignIdx].englishName;
    const houseLord = RASHI_NAMES[houseSignIdx].lord;

    // Occupying planets
    const occupying = Object.values(planets)
      .filter((p) => p.house === activeHouseNum && !p.isModernPlanet)
      .map((p) => p.name);

    // Aspecting planets (Opposite 7th house)
    const oppHouse = ((activeHouseNum + 5) % 12) + 1;
    const aspecting = Object.values(planets)
      .filter((p) => p.house === oppHouse && !p.isModernPlanet)
      .map((p) => `${p.name} (from H${oppHouse})`);

    const HOUSE_THEMES: Record<number, { trigger: string; focus: string }> = {
      1: { trigger: "Self-reinvention, personal health, new life direction", focus: "Physical constitution & identity" },
      2: { trigger: "Wealth accumulation, family affairs, financial restructuring", focus: "Liquid wealth & speech" },
      3: { trigger: "Enterprise, courage, digital initiatives, short journeys", focus: "Self-effort & communication" },
      4: { trigger: "Home, vehicles, property acquisition, maternal matters", focus: "Domestic peace & fixed assets" },
      5: { trigger: "Intellectual breakthroughs, progeny, education, speculation", focus: "Purva Punya & creative output" },
      6: { trigger: "Overcoming competition, health routines, debt clearing", focus: "Victory & service" },
      7: { trigger: "Partnerships, marriage, major alliances, public contracts", focus: "Union & public interface" },
      8: { trigger: "Transformational shifts, sudden gains, occult, research", focus: "Longevity & hidden assets" },
      9: { trigger: "Higher wisdom, pilgrimages, fatherly grace, lucky expansion", focus: "Dharma & divine grace" },
      10: { trigger: "Career elevation, public honors, promotion, executive duty", focus: "Karma & societal authority" },
      11: { trigger: "Fulfillment of desires, massive gains, network expansion", focus: "Income & elder associations" },
      12: { trigger: "Foreign travel, spiritual retreat, investments, let-go", focus: "Moksha & foreign affairs" },
    };

    const theme = HOUSE_THEMES[activeHouseNum] || { trigger: "General progression", focus: "Life evolution" };
    let grade: "Supreme Event / Peak (प्रबल)" | "Transformational / Growth (मध्यम)" | "Challenging / Rectification (संघर्ष)" = "Transformational / Growth (मध्यम)";

    if ([1, 5, 9, 10, 11].includes(activeHouseNum)) {
      grade = "Supreme Event / Peak (प्रबल)";
    } else if ([6, 8, 12].includes(activeHouseNum)) {
      grade = "Challenging / Rectification (संघर्ष)";
    }

    return {
      age,
      cycleNumber,
      activeHouseNum,
      houseSignName,
      houseLord,
      occupyingPlanets: occupying,
      aspectingPlanets: aspecting,
      primaryKarmicTrigger: theme.trigger,
      lifeDomainFocus: theme.focus,
      activationGrade: grade,
    };
  };

  const currentActiveCycle = getCycleForAge(currentAge);
  const tenYearUpcomingCycles: BcpAgeCycle[] = [];
  for (let a = currentAge; a <= currentAge + 10; a++) {
    tenYearUpcomingCycles.push(getCycleForAge(a));
  }

  const keyMajorMilestoneAges = [
    { age: 16, eventTheme: "Bhrigu 4th House Activation (Education & Mother)" },
    { age: 24, eventTheme: "Bhrigu 12th House / 2nd Cycle Entry (Foreign & Major Turning Point)" },
    { age: 28, eventTheme: "Bhrigu 4th House / Saturn Maturity (Property & Stability)" },
    { age: 32, eventTheme: "Bhrigu 8th House / Jupiter Maturity (Transformational Wisdom & Wealth)" },
    { age: 36, eventTheme: "Bhrigu 12th House / 3rd Cycle Completion (Peak Spiritual Karma)" },
  ];

  const masterBcpSynthesis = `Bhrigu Chakra Paddhati (BCP) activates **House ${currentActiveCycle.activeHouseNum} (${currentActiveCycle.houseSignName})** for Age ${currentAge} (Cycle ${currentActiveCycle.cycleNumber}). Primary operational theme: ${currentActiveCycle.primaryKarmicTrigger}.`;

  return {
    currentRunningAge: currentAge,
    currentActiveCycle,
    tenYearUpcomingCycles,
    keyMajorMilestoneAges,
    masterBcpSynthesis,
  };
}

// ----------------------------------------------------
// 108 SURYA ASHTOTTARA SHATANAMAVALI & REMEDIES
// ----------------------------------------------------

export const SURYA_108_NAMES_SAMPLE: Surya108Name[] = [
  { number: 1, sanskritName: "ॐ सूर्याय नमः (Om Suryaya Namah)", englishTranslation: "Salutations to the Supreme Luminous Sovereign", spiritualSignification: "Activates inner soul vitality and clears lethargy" },
  { number: 2, sanskritName: "ॐ अर्यम्णे नमः (Om Aryamne Namah)", englishTranslation: "Salutations to the Lord of Lineage & Pitrus", spiritualSignification: "Bestows ancestral honor and noble standing" },
  { number: 3, sanskritName: "ॐ मित्राय नमः (Om Mitraya Namah)", englishTranslation: "Salutations to the Universal Friend", spiritualSignification: "Harmonizes alliances, contracts, and friendships" },
  { number: 4, sanskritName: "ॐ सवित्रे नमः (Om Savitre Namah)", englishTranslation: "Salutations to the Divine Procreator", spiritualSignification: "Awakens the Gayatri intellect and creative power" },
  { number: 5, sanskritName: "ॐ पूष्णे नमः (Om Pushne Namah)", englishTranslation: "Salutations to the Nourisher of the Universe", spiritualSignification: "Grants safe travel and holistic physical nourishment" },
  { number: 6, sanskritName: "ॐ भास्कराय नमः (Om Bhaskaraya Namah)", englishTranslation: "Salutations to the Maker of Radiant Light", spiritualSignification: "Dissolves darkness and bestows fame" },
  { number: 7, sanskritName: "ॐ मरीचये नमः (Om Marichaye Namah)", englishTranslation: "Salutations to the Master of Light Rays", spiritualSignification: "Heals ocular strength and enhances mental focus" },
  { number: 8, sanskritName: "ॐ आदित्याय नमः (Om Adityaya Namah)", englishTranslation: "Salutations to the Son of Aditi", spiritualSignification: "Sovereign executive command and administrative victory" },
  { number: 9, sanskritName: "ॐ मार्तण्डाय नमः (Om Martandaya Namah)", englishTranslation: "Salutations to the Radiant Cosmic Sun", spiritualSignification: "Shields against premature decay and weakness" },
  { number: 10, sanskritName: "ॐ प्रभाकराय नमः (Om Prabhakaraya Namah)", englishTranslation: "Salutations to the Creator of Illumination", spiritualSignification: "Expands societal reputation and professional honor" },
  { number: 11, sanskritName: "ॐ हिरण्यगर्भाय नमः (Om Hiranyagarbhaya Namah)", englishTranslation: "Salutations to the Golden Cosmic Embryo", spiritualSignification: "Source of all inventive intelligence and vitality" },
  { number: 12, sanskritName: "ॐ खगाय नमः (Om Khagaya Namah)", englishTranslation: "Salutations to the Mover across the Sky", spiritualSignification: "Bestows swift progress and freedom of movement" },
];

export function evaluateSuryaRemedies(ephemeris: EphemerisResult): SuryaRemedialAnalysis {
  const sunData = ephemeris.planets.Sun;
  const sunHouse = sunData?.house || 1;
  const sunD60 = getShashtiamshaForLongitude(sunData?.siderealLongitude || 0);

  const isSunFortified = [1, 5, 9, 10, 11].includes(sunHouse) && !sunD60.deity.category.includes("20%");
  const solarVitalityScore = isSunFortified ? 92 : 68;

  const targetedSolarRemedies = [
    "🌅 **Surya Arghya:** Offer pure water mixed with red kumkum and akshat from a copper lota facing East during Sunrise reciting 'Om Suryaya Namaha'.",
    "📿 **Aditya Hridaya Stotra:** Recite Chapter 105 of Valmiki Ramayana on Sundays for executive victory and clearing professional adversaries.",
    "☀️ **Surya Gayatri Anushthana:** 108 daily chants of 'Om Bhaskaraya Vidmahe Divakaraya Dheemahi Tanno Suryah Prachodayat'.",
    "🌿 **Parihara Donation:** Donate whole wheat, jaggery (gud), or copper vessels to spiritual aspirants on Sunday mornings.",
  ];

  const mantraAnushthanaRecommendation = `Sun resides in House ${sunHouse} in ${sunD60.deity.name} (${sunD60.deity.sanskrit}) Shashtiamsha. Dedicated Surya Arghya and 12 Solar Names will magnify leadership vitality.`;

  return {
    names: SURYA_108_NAMES_SAMPLE,
    solarVitalityScore,
    targetedSolarRemedies,
    mantraAnushthanaRecommendation,
  };
}
