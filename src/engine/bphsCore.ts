/**
 * Classical Brihat Parashara Hora Shastra (BPHS) Primordial Core Engine
 * Reference:
 * - "Brihat Parashara Hora Shastra" (Vols. 1 & 2) translated by R. Santhanam
 * - Chapters:
 *   - Ch. 2: Great Incarnations of the Lord (Vishnu Avataras)
 *   - Ch. 5: Special Lagnas (Hora Lagna, Ghatika Lagna, Shree Lagna, Bhava Lagna, Varnada Lagna)
 *   - Ch. 45: The 12 Sayanadi Planetary Avasthas & Sub-States
 *   - Ch. 66-70: Ashtakavarga Trikona & Ekadhipatya Shodhana with Pinda Sadhana
 *   - Ch. 74: Sudarshana Chakra Triple-Horizon Synthesizer
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES, NAKSHATRAS } from "./constants";
import { calculateShodashavargaChart, calculateVargaSign } from "./shodashavarga";
import { calculateAshtakavarga } from "./ashtakavarga";

export interface SpecialLagnaInfo {
  id: string;
  name: string;
  sanskritName: string;
  longitude: number;
  signIndex: number;
  signName: string;
  degreesInSign: number;
  houseFromLagna: number;
  significance: string;
}

export interface SudarshanaBhavaAnalysis {
  houseNum: number;
  theme: string;
  lagnaPerspectiveSign: string;
  moonPerspectiveSign: string;
  sunPerspectiveSign: string;
  overallFortificationPercent: number;
  tripartiteVerdict: string;
}

export interface SayanadiAvasthaInfo {
  planetId: string;
  planetName: string;
  avasthaIndex: number;
  avasthaName: string;
  sanskritName: string;
  icon: string;
  effectType: "Highly Auspicious" | "Auspicious" | "Mixed / Dynamic" | "Inauspicious / Heavy";
  classicalInterpretation: string;
}

export interface AshtakavargaPindaReport {
  planetName: string;
  originalBindus: number[];
  trikonaReducedBindus: number[];
  ekadhipatyaReducedBindus: number[];
  rashiPinda: number;
  grahaPinda: number;
  yogaPinda: number;
}

export interface VishnuAvataraInfo {
  planetName: string;
  avataraName: string;
  sanskritName: string;
  divineArchetype: string;
  embodiedVirtue: string;
  isNativeLeadingArchetype: boolean;
}

export interface BphsCoreReport {
  specialLagnas: {
    horaLagna: SpecialLagnaInfo;
    ghatikaLagna: SpecialLagnaInfo;
    shreeLagna: SpecialLagnaInfo;
    bhavaLagna: SpecialLagnaInfo;
    varnadaLagna: SpecialLagnaInfo;
  };
  sudarshanaChakra: {
    bhavas: SudarshanaBhavaAnalysis[];
    highestFortifiedHouse: number;
    highestFortifiedHouseTheme: string;
  };
  sayanadiAvasthas: SayanadiAvasthaInfo[];
  ashtakavargaPindas: AshtakavargaPindaReport[];
  sarvaYogaPinda: number;
  vishnuAvataras: VishnuAvataraInfo[];
  leadingAvatara: VishnuAvataraInfo;
  masterBphsSynthesis: string;
}

const SAYANADI_AVASTHAS = [
  { name: "Sayana", sanskrit: "शयन", icon: "🛏️", type: "Mixed / Dynamic" as const, desc: "Resting / Contemplative state. Focuses on domestic comfort, restful retreat, or periodic physical fatigue." },
  { name: "Upaveshana", sanskrit: "उपवेशन", icon: "🧘", type: "Auspicious" as const, desc: "Sitting comfortably. Bestows deep scholarly reflection, administrative stability, and honored counsel." },
  { name: "Netrapani", sanskrit: "नेत्रपाणि", icon: "👁️", type: "Inauspicious / Heavy" as const, desc: "Hand on eye / Restlessness. Indicates financial expenditure, optical vigilance, or overcoming obstacles." },
  { name: "Prakasha", sanskrit: "प्रकाश", icon: "✨", type: "Highly Auspicious" as const, desc: "Radiant & Illuminating. Generates widespread fame, magnetic public brilliance, and royal honor." },
  { name: "Gamana", sanskrit: "गमन", icon: "🚶", type: "Mixed / Dynamic" as const, desc: "Departing / Journeying. Bestows frequent long-distance travels, relocation, dynamic enterprise, and adventurous valor." },
  { name: "Agamana", sanskrit: "आगमन", icon: "🏠", type: "Highly Auspicious" as const, desc: "Arriving home. Blesses with family reunification, acquisition of precious wealth, vehicles, and inner peace." },
  { name: "Sabha", sanskrit: "सभा", icon: "🏛️", type: "Highly Auspicious" as const, desc: "Presiding in Royal Assembly. Bestows exceptional oratorical power, high judicial authority, and social leadership." },
  { name: "Agama", sanskrit: "आगम", icon: "💎", type: "Highly Auspicious" as const, desc: "Acquiring & Earning. Generates steady multiplication of treasures, landed estate, and lucrative professional contracts." },
  { name: "Bhojana", sanskrit: "भोजन", icon: "🍲", type: "Auspicious" as const, desc: "Feasting on Royal Food. Blesses with culinary delights, sweet eloquence, robust appetite, and luxurious nourishment." },
  { name: "Nrityalipsa", sanskrit: "नृत्यलिप्सा", icon: "💃", type: "Auspicious" as const, desc: "Desiring to Dance. Inspires artistic passion, love for drama, poetry, musical excellence, and celebratory joy." },
  { name: "Kautuka", sanskrit: "कौतुक", icon: "🎭", type: "Auspicious" as const, desc: "Eager & Curious. Bestows youthful enthusiasm, intellectual amusement, romantic happiness, and vibrant mirth." },
  { name: "Nidra", sanskrit: "निद्रा", icon: "😴", type: "Inauspicious / Heavy" as const, desc: "Deep Sleep / Inactivity. Indicates procrastination, missed opportunities, or need for spiritual waking from inertia." },
];

const VISHNU_AVATARA_MAPPING: Record<string, { name: string; sanskrit: string; archetype: string; virtue: string }> = {
  Sun: { name: "Sri Rama", sanskrit: "श्री राम", archetype: "The Dharmic King & Sun of Righteousness", virtue: "Unyielding Dharma, Moral Integrity & Solar Splendor" },
  Moon: { name: "Sri Krishna", sanskrit: "श्री कृष्ण", archetype: "The Purna Avatara of Divine Love & Mind", virtue: "Universal Compassion, Mystic Intellect & Aesthetic Grace" },
  Mars: { name: "Sri Narasimha", sanskrit: "श्री नृसिंह", archetype: "The Fearless Cosmic Protector", virtue: "Supreme Valor, Destruction of Tyranny & Divine Strength" },
  Mercury: { name: "Sri Buddha", sanskrit: "श्री बुद्ध", archetype: "The Enlightened Sage of Discrimination", virtue: "Buddhi, Non-Violence, Analytical Wisdom & Calm" },
  Jupiter: { name: "Sri Vamana", sanskrit: "श्री वामन", archetype: "The Divine Priest & Cosmic Expander", virtue: "Brahmanical Learning, Spiritual Humility & Dharma" },
  Venus: { name: "Sri Parashurama", sanskrit: "श्री परशुराम", archetype: "The Warrior Sage of Martial Austerity", virtue: "Aesthetic Prowess, Mastery of Weapons & Chastisement" },
  Saturn: { name: "Sri Kurma", sanskrit: "श्री कूर्म", archetype: "The Cosmic Tortoise of Endurance", virtue: "Infinite Patience, Pillar of Support & Karmic Discipline" },
  Rahu: { name: "Sri Varaha", sanskrit: "श्री वराह", archetype: "The Divine Boar Uplifter of the Earth", virtue: "Rescuing from Dark Depths, Occult Power & Unearthing Truth" },
  Ketu: { name: "Sri Matsya", sanskrit: "श्री मत्स्य", archetype: "The Primordial Fish Savior", virtue: "Cosmic Salvation, Spiritual Liberation & Secret Vedas" },
};

const RASHI_PINDA_MULTIPLIERS = [7, 10, 8, 4, 10, 5, 7, 8, 9, 5, 11, 12];
const GRAHA_PINDA_MULTIPLIERS: Record<string, number> = {
  Sun: 5, Moon: 5, Mars: 8, Mercury: 5, Jupiter: 10, Venus: 7, Saturn: 5,
};

export function evaluateBphsCore(natalEphem: EphemerisResult): BphsCoreReport {
  const planets = natalEphem.planets;
  const ascLon = natalEphem.ascendant.siderealLongitude;
  const ascSign = Math.floor(ascLon / 30);
  const sunLon = planets.Sun?.siderealLongitude || 0;
  const moonLon = planets.Moon?.siderealLongitude || 0;

  const birthDate = new Date(natalEphem.utcDate);
  const localHours = (birthDate.getUTCHours() + natalEphem.location.timezoneOffsetHours + 24) % 24;
  const hoursSinceSunrise = (localHours - 6 + 24) % 24;
  const birthGhatikas = Math.max(1, Math.min(60, Math.floor(hoursSinceSunrise * 2.5) + 1));
  const moonNakIdx = Math.floor(moonLon / (360 / 27));

  // -------------------------------------------------------------------------
  // 1. SPECIAL LAGNAS (BPHS Chapter 5)
  // -------------------------------------------------------------------------
  const hlLon = (sunLon + hoursSinceSunrise * 30) % 360;
  const hlSign = Math.floor(hlLon / 30);
  const hlDeg = Math.round((hlLon % 30) * 100) / 100;
  const hlHouse = ((hlSign - ascSign + 12) % 12) + 1;

  const glLon = (sunLon + hoursSinceSunrise * 75) % 360;
  const glSign = Math.floor(glLon / 30);
  const glDeg = Math.round((glLon % 30) * 100) / 100;
  const glHouse = ((glSign - ascSign + 12) % 12) + 1;

  const nakSpan = 360 / 27;
  const moonNakFraction = (moonLon % nakSpan) / nakSpan;
  const slLon = (ascLon + moonNakFraction * 360) % 360;
  const slSign = Math.floor(slLon / 30);
  const slDeg = Math.round((slLon % 30) * 100) / 100;
  const slHouse = ((slSign - ascSign + 12) % 12) + 1;

  const blLon = (sunLon + hoursSinceSunrise * 15) % 360;
  const blSign = Math.floor(blLon / 30);
  const blDeg = Math.round((blLon % 30) * 100) / 100;
  const blHouse = ((blSign - ascSign + 12) % 12) + 1;

  const vlSign = (ascSign + ((hlSign - ascSign + 12) % 12)) % 12;
  const vlLon = (vlSign * 30 + 15) % 360;
  const vlHouse = ((vlSign - ascSign + 12) % 12) + 1;

  const specialLagnas = {
    horaLagna: {
      id: "HL",
      name: "Hora Lagna (HL)",
      sanskritName: "होरा लग्न (धन एवं समृद्धि चक्र)",
      longitude: Math.round(hlLon * 100) / 100,
      signIndex: hlSign,
      signName: RASHI_NAMES[hlSign].englishName,
      degreesInSign: hlDeg,
      houseFromLagna: hlHouse,
      significance: "Primordial clock of financial accumulation, liquid wealth, assets, and Dhana Yogas.",
    },
    ghatikaLagna: {
      id: "GL",
      name: "Ghatika Lagna (GL)",
      sanskritName: "घटिका लग्न (सत्ता एवं राजयोग चक्र)",
      longitude: Math.round(glLon * 100) / 100,
      signIndex: glSign,
      signName: RASHI_NAMES[glSign].englishName,
      degreesInSign: glDeg,
      houseFromLagna: glHouse,
      significance: "Primordial clock of political authority, executive prestige, government honors, and Raja Yogas.",
    },
    shreeLagna: {
      id: "SL",
      name: "Shree Lagna (SL)",
      sanskritName: "श्री लग्न (लक्ष्मी कृपा एवं सौभाग्य)",
      longitude: Math.round(slLon * 100) / 100,
      signIndex: slSign,
      signName: RASHI_NAMES[slSign].englishName,
      degreesInSign: slDeg,
      houseFromLagna: slHouse,
      significance: "Direct seat of Goddess Lakshmi Kataksha; governs unearned wealth, marriage fortune, and lasting comfort.",
    },
    bhavaLagna: {
      id: "BL",
      name: "Bhava Lagna (BL)",
      sanskritName: "भाव लग्न (शारीरिक सामर्थ्य एवं आयुर्दाय)",
      longitude: Math.round(blLon * 100) / 100,
      signIndex: blSign,
      signName: RASHI_NAMES[blSign].englishName,
      degreesInSign: blDeg,
      houseFromLagna: blHouse,
      significance: "Physical vitality clock; measures constitutional stamina, somatic immunity, and body frame.",
    },
    varnadaLagna: {
      id: "VL",
      name: "Varnada Lagna (VL)",
      sanskritName: "वर्णद लग्न (कर्मक्षेत्र एवं सामाजिक स्थिति)",
      longitude: Math.round(vlLon * 100) / 100,
      signIndex: vlSign,
      signName: RASHI_NAMES[vlSign].englishName,
      degreesInSign: 15,
      houseFromLagna: vlHouse,
      significance: "Evaluates professional standing, administrative hierarchy, social duties, and career rank.",
    },
  };

  // -------------------------------------------------------------------------
  // 2. SUDARSHANA CHAKRA (BPHS Chapter 74)
  // -------------------------------------------------------------------------
  const moonSign = Math.floor(moonLon / 30);
  const sunSign = Math.floor(sunLon / 30);

  const BHAVA_THEMES = [
    "Personality & Physical Vitality",
    "Wealth, Family & Eloquent Speech",
    "Courage, Initiative & Siblings",
    "Home, Mother & Academic Foundation",
    "Intellect, Children & Purva Punya",
    "Health, Debt & Overcoming Enemies",
    "Spouse, Business & Public Partnerships",
    "Longevity, Occult & Sudden Changes",
    "Dharma, Higher Learning & Guru Grace",
    "Career, Executive Power & Public Status",
    "Gains, Ambition & Social Network",
    "Moksha, Foreign Lands & Expenditures",
  ];

  const sudarshanaBhavas: SudarshanaBhavaAnalysis[] = [];
  let maxScore = -1;
  let highestHouse = 1;
  let highestTheme = BHAVA_THEMES[0];

  for (let h = 1; h <= 12; h++) {
    const lagnaRashiIdx = (ascSign + h - 1) % 12;
    const moonRashiIdx = (moonSign + h - 1) % 12;
    const sunRashiIdx = (sunSign + h - 1) % 12;

    const lagnaSignName = RASHI_NAMES[lagnaRashiIdx].englishName;
    const moonSignName = RASHI_NAMES[moonRashiIdx].englishName;
    const sunSignName = RASHI_NAMES[sunRashiIdx].englishName;

    // Confluence score
    let score = 70;
    if (h === 1 || h === 5 || h === 9 || h === 10) score += 15;
    if (lagnaRashiIdx === moonRashiIdx || lagnaRashiIdx === sunRashiIdx) score += 10;
    score = Math.min(98, score);

    if (score > maxScore) {
      maxScore = score;
      highestHouse = h;
      highestTheme = BHAVA_THEMES[h - 1];
    }

    sudarshanaBhavas.push({
      houseNum: h,
      theme: BHAVA_THEMES[h - 1],
      lagnaPerspectiveSign: lagnaSignName,
      moonPerspectiveSign: moonSignName,
      sunPerspectiveSign: sunSignName,
      overallFortificationPercent: score,
      tripartiteVerdict: `Tripartite confluence: Physical (${lagnaSignName}), Emotional (${moonSignName}), Soul (${sunSignName}) converges with ${score}% fortification.`,
    });
  }

  // -------------------------------------------------------------------------
  // 3. 12 SAYANADI PLANETARY AVASTHAS (BPHS Chapter 45)
  // -------------------------------------------------------------------------
  const PLANET_ORDER_INDEX: Record<string, number> = {
    Sun: 1, Moon: 2, Mars: 3, Mercury: 4, Jupiter: 5, Venus: 6, Saturn: 7, Rahu: 8, Ketu: 9,
  };

  const sayanadiAvasthas: SayanadiAvasthaInfo[] = [];

  Object.entries(PLANET_ORDER_INDEX).forEach(([pName, pNum]) => {
    const pObj = (planets as any)[pName];
    if (!pObj) return;

    const pHouse = pObj.house || 1;
    const pLon = pObj.siderealLongitude || 0;
    const d9Sign = calculateVargaSign(pLon, "D9") + 1; // 1 to 12

    // Parashara Formula: (P * H * N + MoonNak + BirthGhatikas + LagnaSign) mod 12
    const avasthaRaw = (pNum * pHouse * d9Sign + (moonNakIdx + 1) + birthGhatikas + (ascSign + 1)) % 12;
    const avasthaMeta = SAYANADI_AVASTHAS[avasthaRaw];

    sayanadiAvasthas.push({
      planetId: pName,
      planetName: pName,
      avasthaIndex: avasthaRaw,
      avasthaName: avasthaMeta.name,
      sanskritName: avasthaMeta.sanskrit,
      icon: avasthaMeta.icon,
      effectType: avasthaMeta.type,
      classicalInterpretation: `${pName} is posited in ${avasthaMeta.name} Avastha (${avasthaMeta.sanskrit}): ${avasthaMeta.desc}`,
    });
  });

  // -------------------------------------------------------------------------
  // 4. ASHTAKAVARGA SHODHANA & PINDA SADHANA (BPHS Chapters 66–70)
  // -------------------------------------------------------------------------
  const ashtakavarga = calculateAshtakavarga(natalEphem);
  const ashtakavargaPindas: AshtakavargaPindaReport[] = [];
  let totalSarvaYogaPinda = 0;

  const classical7 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  classical7.forEach((pName) => {
    const origBav = ashtakavarga.bav[pName]?.rashiBindus || [4,4,4,4,4,4,4,4,4,4,4,4];
    
    // Trikona Shodhana: Fire (0,4,8), Earth (1,5,9), Air (2,6,10), Water (3,7,11)
    const trikonaReduced = [...origBav];
    for (let t = 0; t < 4; t++) {
      const i1 = t, i2 = t + 4, i3 = t + 8;
      const minVal = Math.min(trikonaReduced[i1], trikonaReduced[i2], trikonaReduced[i3]);
      trikonaReduced[i1] -= minVal;
      trikonaReduced[i2] -= minVal;
      trikonaReduced[i3] -= minVal;
    }

    // Ekadhipatya Shodhana: Dual-sign reductions
    const ekadhipatyaReduced = [...trikonaReduced];
    const pairs = [[0, 7], [1, 6], [2, 5], [8, 11], [9, 10]]; // Mars, Venus, Mercury, Jupiter, Saturn
    pairs.forEach(([s1, s2]) => {
      const minVal = Math.min(ekadhipatyaReduced[s1], ekadhipatyaReduced[s2]);
      if (ekadhipatyaReduced[s1] > 0 && ekadhipatyaReduced[s2] > 0) {
        ekadhipatyaReduced[s1] -= minVal;
        ekadhipatyaReduced[s2] -= minVal;
      }
    });

    // Rashi Pinda calculation
    let rashiPinda = 0;
    for (let i = 0; i < 12; i++) {
      rashiPinda += ekadhipatyaReduced[i] * RASHI_PINDA_MULTIPLIERS[i];
    }

    // Graha Pinda calculation
    let grahaPinda = 0;
    classical7.forEach((g) => {
      const gHouse = (planets as any)[g]?.house || 1;
      const gSign = (ascSign + gHouse - 1) % 12;
      grahaPinda += ekadhipatyaReduced[gSign] * (GRAHA_PINDA_MULTIPLIERS[g] || 5);
    });

    const yogaPinda = rashiPinda + grahaPinda;
    totalSarvaYogaPinda += yogaPinda;

    ashtakavargaPindas.push({
      planetName: pName,
      originalBindus: origBav,
      trikonaReducedBindus: trikonaReduced,
      ekadhipatyaReducedBindus: ekadhipatyaReduced,
      rashiPinda,
      grahaPinda,
      yogaPinda,
    });
  });

  // -------------------------------------------------------------------------
  // 5. VISHNU AVATARA ARCHETYPES (BPHS Chapter 2)
  // -------------------------------------------------------------------------
  let leadingPlanet = "Jupiter";
  let maxLon = -1;

  Object.entries(VISHNU_AVATARA_MAPPING).forEach(([pName]) => {
    const lon = (planets as any)[pName]?.siderealLongitude || 0;
    if (lon > maxLon) {
      maxLon = lon;
      leadingPlanet = pName;
    }
  });

  const vishnuAvataras: VishnuAvataraInfo[] = Object.entries(VISHNU_AVATARA_MAPPING).map(([pName, meta]) => ({
    planetName: pName,
    avataraName: meta.name,
    sanskritName: meta.sanskrit,
    divineArchetype: meta.archetype,
    embodiedVirtue: meta.virtue,
    isNativeLeadingArchetype: pName === leadingPlanet,
  }));

  const leadingAvatara = vishnuAvataras.find((v) => v.isNativeLeadingArchetype) || vishnuAvataras[0];

  const masterBphsSynthesis = `Primordial Parashari Synthesis: Hora Lagna (${specialLagnas.horaLagna.signName}, House #${specialLagnas.horaLagna.houseFromLagna}) and Ghatika Lagna (${specialLagnas.ghatikaLagna.signName}, House #${specialLagnas.ghatikaLagna.houseFromLagna}) anchor lifelong wealth and administrative power. Sudarshana Chakra fortifies House #${highestHouse} (${highestTheme}). Total Sarvashtakavarga Yoga Pinda reaches ${totalSarvaYogaPinda} units, aligned with ${leadingAvatara.avataraName} archetype.`;

  return {
    specialLagnas,
    sudarshanaChakra: {
      bhavas: sudarshanaBhavas,
      highestFortifiedHouse: highestHouse,
      highestFortifiedHouseTheme: highestTheme,
    },
    sayanadiAvasthas,
    ashtakavargaPindas,
    sarvaYogaPinda: totalSarvaYogaPinda,
    vishnuAvataras,
    leadingAvatara,
    masterBphsSynthesis,
  };
}
