/**
 * Dr. Samir Tripathi Vedic Astrology Master Suite (डॉ समीर त्रिपाठी ज्योतिष सिद्धान्त)
 * References & Codified Lectures:
 * - Sessions 50–60: House Activation, Age Triggers & Planetary Transit Awakenings
 * - Sessions 68–70: Conjunction Activations (Sun-Saturn, Guru-Ketu, Mars Upachaya)
 * - Sessions 73–79: Arudha Lagna (AL) Maya vs Satya Perception Engine
 * - Sessions 82, 84, 85: Baadhak Theory & Rahu-Ketu Transit Intersection
 * - Sessions 86–87: Indu Lagna (इन्दु लग्न) Classical Ray (Kala) Wealth Math
 * - Session 97: Bhagya Bindu (भाग्य बिन्दु / Fortunate Point of Prosperity)
 */

import { EphemerisResult, RashiInfo } from "./types";
import { RASHI_NAMES } from "./constants";

// 1. Classical Ray (Kala) values for Indu Lagna calculation (Session 86)
export const INDU_KALA_VALUES: Record<string, number> = {
  Sun: 30,
  Moon: 16,
  Mars: 6,
  Mercury: 8,
  Jupiter: 10,
  Venus: 12,
  Saturn: 1,
};

// 2. Natural Maturation & Awakening Ages of Planets (Sessions 50–60)
export const PLANETARY_MATURATION_AGES: Record<string, { dawnAge: number; peakAge: number; significance: string }> = {
  Jupiter: {
    dawnAge: 16,
    peakAge: 32,
    significance: "Spiritual wisdom dawn, higher counsel, wealth stability and academic expansion.",
  },
  Sun: {
    dawnAge: 21,
    peakAge: 22,
    significance: "Self-sovereignty, administrative authority, career independence and fatherly role.",
  },
  Moon: {
    dawnAge: 24,
    peakAge: 25,
    significance: "Emotional equilibrium, public popularity, domestic anchoring and maternal blessing.",
  },
  Venus: {
    dawnAge: 25,
    peakAge: 28,
    significance: "Marital fruition, creative elegance, luxury acquisitions and vehicle comfort.",
  },
  Mars: {
    dawnAge: 28,
    peakAge: 31,
    significance: "Executive prowess, real estate/property acquisition, leadership vigor and competitive victory.",
  },
  Mercury: {
    dawnAge: 32,
    peakAge: 35,
    significance: "Commercial mastery, analytical sharpness, media/communication triumph and trade expansion.",
  },
  Saturn: {
    dawnAge: 36,
    peakAge: 39,
    significance: "Karmic stabilization, enduring enterprise foundation, organizational authority and legacy.",
  },
  Rahu: {
    dawnAge: 42,
    peakAge: 45,
    significance: "Unconventional breakthroughs, international recognition, tech/mass-media ascension.",
  },
  Ketu: {
    dawnAge: 48,
    peakAge: 52,
    significance: "Spiritual mastery, detachment, occult depth, and resolution of ancestral debts.",
  },
};

export interface InduLagnaResult {
  induLagnaRashi: RashiInfo;
  induLagnaLongitude: number;
  induLagnaHouseFromD1: number;
  lagnaNinthLord: string;
  lagnaNinthKala: number;
  moonNinthLord: string;
  moonNinthKala: number;
  totalKalas: number;
  remainderKala: number;
  planetsInInduLagna: string[];
  beneficsInInduLagna: string[];
  maleficsInInduLagna: string[];
  wealthVerdict: string;
  wealthGrade: "Koti-Pati / Imperial Wealth (कोटिपति)" | "High Multi-Millionaire (महाधनी)" | "Substantial Affluence (सम्पन्न)" | "Moderate Prosperity (मध्यम)";
}

export interface HouseAgeActivation {
  houseNumber: number;
  houseName: string;
  sanskritName: string;
  activationAges: number[];
  isActiveCurrentAge: boolean;
  occupantPlanets: string[];
  houseLord: string;
  theme: string;
}

export interface BaadhakDynamicsResult {
  lagnaModality: "Movable (चर)" | "Fixed (स्थिर)" | "Dual (द्विस्वभाव)";
  baadhakHouseNumber: number;
  baadhakRashi: RashiInfo;
  baadhakeshPlanet: string;
  baadhakeshD1Placement: { house: number; rashi: string };
  isTransitRahuKetuAfflicting: boolean;
  activeObstacleDomain: string;
  prescribedRemedy: string;
}

export interface BhagyaBinduResult {
  longitude: number;
  rashi: RashiInfo;
  house: number;
  nakshatra: string;
  nakshatraLord: string;
  isDayBirth: boolean;
  significance: string;
}

/**
 * 1. Calculate Indu Lagna (इन्दु लग्न - Moon-Ray Wealth Ascendant) per Session 86-87
 */
export function calculateInduLagna(natalEphem: EphemerisResult): InduLagnaResult {
  const ascLon = natalEphem.ascendant.siderealLongitude;
  const moonLon = natalEphem.planets.Moon?.siderealLongitude || 0;

  const ascRashiIdx = Math.floor(ascLon / 30);
  const moonRashiIdx = Math.floor(moonLon / 30);

  // 9th House from Lagna
  const lagnaNinthRashiIdx = (ascRashiIdx + 8) % 12;
  const lagnaNinthLord = RASHI_NAMES[lagnaNinthRashiIdx].lord;
  const lagnaNinthKala = INDU_KALA_VALUES[lagnaNinthLord] || 0;

  // 9th House from Moon
  const moonNinthRashiIdx = (moonRashiIdx + 8) % 12;
  const moonNinthLord = RASHI_NAMES[moonNinthRashiIdx].lord;
  const moonNinthKala = INDU_KALA_VALUES[moonNinthLord] || 0;

  const totalKalas = lagnaNinthKala + moonNinthKala;
  let remainder = totalKalas % 12;
  if (remainder === 0) remainder = 12;

  // Count remainder signs from Natal Moon (1-indexed)
  const induLagnaRashiIdx = (moonRashiIdx + (remainder - 1)) % 12;
  const induLagnaLongitude = induLagnaRashiIdx * 30 + (moonLon % 30);
  const induLagnaRashi: RashiInfo = {
    ...RASHI_NAMES[induLagnaRashiIdx],
    degreesInSign: induLagnaLongitude % 30,
  };

  const induLagnaHouseFromD1 = ((induLagnaRashiIdx - ascRashiIdx + 12) % 12) + 1;

  // Find planets residing in Indu Lagna
  const planetsInInduLagna: string[] = [];
  const beneficsInInduLagna: string[] = [];
  const maleficsInInduLagna: string[] = [];

  const beneficsList = ["Jupiter", "Venus", "Mercury", "Moon"];
  const maleficsList = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"];

  for (const [pName, pData] of Object.entries(natalEphem.planets)) {
    if (!pData || pData.isUpagraha || pData.isModernPlanet) continue;
    const pRashiIdx = Math.floor(pData.siderealLongitude / 30);
    if (pRashiIdx === induLagnaRashiIdx) {
      planetsInInduLagna.push(pName);
      if (beneficsList.includes(pName)) {
        beneficsInInduLagna.push(pName);
      } else if (maleficsList.includes(pName)) {
        maleficsInInduLagna.push(pName);
      }
    }
  }

  // Verdict formulation per Dr. Samir Tripathi Session 87
  let wealthVerdict = "";
  let wealthGrade: InduLagnaResult["wealthGrade"] = "Substantial Affluence (सम्पन्न)";

  if (beneficsInInduLagna.length >= 2 || (beneficsInInduLagna.includes("Jupiter") && beneficsInInduLagna.includes("Venus"))) {
    wealthGrade = "Koti-Pati / Imperial Wealth (कोटिपति)";
    wealthVerdict = `Supreme Indu Dhana Yoga! Benefics (${beneficsInInduLagna.join(", ")}) in Indu Lagna (${induLagnaRashi.englishName}) grant multi-generational prosperity, effortless capital accumulation, and financial sovereignty during ruling sub-periods.`;
  } else if (beneficsInInduLagna.length >= 1) {
    wealthGrade = "High Multi-Millionaire (महाधनी)";
    wealthVerdict = `Fortified Indu Dhana Yoga with auspicious benefic ${beneficsInInduLagna[0]} residing in Indu Lagna (${induLagnaRashi.englishName}). Promotes steady commercial expansion, prime assets, and wealth amplification.`;
  } else if (maleficsInInduLagna.length > 0 && beneficsInInduLagna.length === 0) {
    wealthGrade = "Substantial Affluence (सम्पन्न)";
    wealthVerdict = `Indu Lagna occupied by dynamic planet (${maleficsInInduLagna.join(", ")}). Wealth is generated through bold entrepreneurial risk, competitive aggression, and self-made grit rather than passive inheritance.`;
  } else {
    wealthGrade = "Moderate Prosperity (मध्यम)";
    wealthVerdict = `Indu Lagna in ${induLagnaRashi.englishName} ruled by ${induLagnaRashi.lord}. Wealth manifests primarily through the dasha and transits of Lord ${induLagnaRashi.lord} and aspecting planets.`;
  }

  return {
    induLagnaRashi,
    induLagnaLongitude,
    induLagnaHouseFromD1,
    lagnaNinthLord,
    lagnaNinthKala,
    moonNinthLord,
    moonNinthKala,
    totalKalas,
    remainderKala: remainder,
    planetsInInduLagna,
    beneficsInInduLagna,
    maleficsInInduLagna,
    wealthVerdict,
    wealthGrade,
  };
}

/**
 * 2. Calculate 12-House Age Activation Cycle (Sessions 50–60)
 */
export function calculatePlanetaryAgeActivations(
  natalEphem: EphemerisResult,
  evaluationDate: Date = new Date()
): { currentAge: number; activeHouse: HouseAgeActivation; allHouses: HouseAgeActivation[]; planetaryAwakenings: any[] } {
  const birthDate = new Date(natalEphem.utcDate);
  const diffMs = evaluationDate.getTime() - birthDate.getTime();
  const currentAge = Math.floor(diffMs / (365.2425 * 86400000));

  const ascRashiIdx = Math.floor(natalEphem.ascendant.siderealLongitude / 30);

  const HOUSE_META = [
    { num: 1, name: "1st House (Lagna)", skt: "तनु भाव", baseAges: [1, 25, 49, 73], theme: "Self-reinvention, health overhaul, vitality and personal sovereignty." },
    { num: 2, name: "2nd House (Dhana)", skt: "धन भाव", baseAges: [2, 26, 50, 74], theme: "Family wealth restructuring, speech, liquid assets and dietary habits." },
    { num: 3, name: "3rd House (Sahasa)", skt: "सहज भाव", baseAges: [3, 27, 51, 75], theme: "Bold initiatives, digital enterprise, communication triumphs and sibling dynamics." },
    { num: 4, name: "4th House (Sukha)", skt: "सुख भाव", baseAges: [4, 28, 52, 76], theme: "Real estate acquisition, vehicle upgrades, mother's blessing and domestic sanctuary." },
    { num: 5, name: "5th House (Putra)", skt: "पुत्र भाव", baseAges: [5, 29, 53, 77], theme: "Creative breakthroughs, intellect manifestation, investment gains and progeny." },
    { num: 6, name: "6th House (Shatru)", skt: "रिपु भाव", baseAges: [6, 30, 54, 78], theme: "Defeating professional rivals, resolving debts, overcoming health challenges." },
    { num: 7, name: "7th House (Jaya)", skt: "जाया भाव", baseAges: [7, 31, 55, 79], theme: "Marriage milestone, business partnership fruition and public prominence." },
    { num: 8, name: "8th House (Randhra)", skt: "रन्ध्र भाव", baseAges: [8, 32, 56, 80], theme: "Occult depth, deep psychological transformation, unearned wealth and rebirth." },
    { num: 9, name: "9th House (Dharma)", skt: "धर्म भाव", baseAges: [9, 33, 57, 81], theme: "Bhagyodaya (fortune rise), pilgrimage, spiritual guru blessing and higher law." },
    { num: 10, name: "10th House (Karma)", skt: "कर्म भाव", baseAges: [10, 34, 58, 82], theme: "Career zenith, leadership appointment, societal authority and professional recognition." },
    { num: 11, name: "11th House (Labha)", skt: "लाभ भाव", baseAges: [11, 35, 59, 83], theme: "Major aspirational fruition, massive financial inflows and network expansion." },
    { num: 12, name: "12th House (Vyaya)", skt: "व्यय भाव", baseAges: [12, 36, 60, 84], theme: "Foreign settlements, spiritual retreat, detachment and subconscious liberation." },
  ];

  const allHouses: HouseAgeActivation[] = HOUSE_META.map((h) => {
    const rashiIdx = (ascRashiIdx + h.num - 1) % 12;
    const houseLord = RASHI_NAMES[rashiIdx].lord;

    const occupants: string[] = [];
    for (const [pName, pData] of Object.entries(natalEphem.planets)) {
      if (!pData || pData.isUpagraha || pData.isModernPlanet) continue;
      if (pData.house === h.num) {
        occupants.push(pName);
      }
    }

    // Is active if currentAge matches any base age or cycle
    const isActive = h.baseAges.includes(currentAge) || ((currentAge - h.num) % 12 === 0 && currentAge >= h.num);

    return {
      houseNumber: h.num,
      houseName: h.name,
      sanskritName: h.skt,
      activationAges: h.baseAges,
      isActiveCurrentAge: isActive,
      occupantPlanets: occupants,
      houseLord,
      theme: h.theme,
    };
  });

  const activeHouse = allHouses.find((h) => h.isActiveCurrentAge) || allHouses[0];

  // Planetary Maturation check
  const planetaryAwakenings = Object.entries(PLANETARY_MATURATION_AGES).map(([pName, meta]) => {
    const isAwakened = currentAge >= meta.dawnAge;
    const isPeak = currentAge >= meta.peakAge;
    return {
      planet: pName,
      dawnAge: meta.dawnAge,
      peakAge: meta.peakAge,
      status: isPeak ? "Fully Awakened & Mature (पूर्ण परिपक्व)" : isAwakened ? "Dawn of Activation (जागृत अवस्था)" : "Dormant Potential (सुप्त अवस्था)",
      significance: meta.significance,
    };
  });

  return {
    currentAge,
    activeHouse,
    allHouses,
    planetaryAwakenings,
  };
}

/**
 * 3. Baadhak Theory & Rahu-Ketu Transit Intersection (Sessions 82, 84, 85)
 */
export function evaluateBaadhakDynamics(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult
): BaadhakDynamicsResult {
  const ascLon = natalEphem.ascendant.siderealLongitude;
  const ascRashiIdx = Math.floor(ascLon / 30);
  const ascRashi = RASHI_NAMES[ascRashiIdx];

  // Movable (Aries 0, Cancer 3, Libra 6, Capricorn 9) -> 11th House
  // Fixed (Taurus 1, Leo 4, Scorpio 7, Aquarius 10) -> 9th House
  // Dual (Gemini 2, Virgo 5, Sagittarius 8, Pisces 11) -> 7th House
  let baadhakHouseNum = 11;
  let modality: BaadhakDynamicsResult["lagnaModality"] = "Movable (चर)";

  if ([1, 4, 7, 10].includes(ascRashiIdx)) {
    baadhakHouseNum = 9;
    modality = "Fixed (स्थिर)";
  } else if ([2, 5, 8, 11].includes(ascRashiIdx)) {
    baadhakHouseNum = 7;
    modality = "Dual (द्विस्वभाव)";
  }

  const baadhakRashiIdx = (ascRashiIdx + baadhakHouseNum - 1) % 12;
  const baadhakRashi: RashiInfo = {
    ...RASHI_NAMES[baadhakRashiIdx],
    degreesInSign: 0,
  };
  const baadhakeshPlanet = baadhakRashi.lord;

  // Find Baadhakesh placement in D1
  const bData = natalEphem.planets[baadhakeshPlanet];
  const baadhakeshPlacement = bData
    ? { house: bData.house, rashi: bData.rashi.englishName }
    : { house: 1, rashi: ascRashi.englishName };

  // Transit Rahu/Ketu intersection
  const tRahu = transitEphem.planets.Rahu;
  const tKetu = transitEphem.planets.Ketu;
  const tRahuRashiIdx = tRahu ? Math.floor(tRahu.siderealLongitude / 30) : -1;
  const tKetuRashiIdx = tKetu ? Math.floor(tKetu.siderealLongitude / 30) : -1;

  const isTransitRahuKetuAfflicting =
    tRahuRashiIdx === baadhakRashiIdx ||
    tKetuRashiIdx === baadhakRashiIdx ||
    (bData && (tRahuRashiIdx === Math.floor(bData.siderealLongitude / 30) || tKetuRashiIdx === Math.floor(bData.siderealLongitude / 30)));

  let activeObstacleDomain = "";
  if (baadhakHouseNum === 11) {
    activeObstacleDomain = "Friction in realizing major cash inflows, misunderstandings with large organizations or elder associates.";
  } else if (baadhakHouseNum === 9) {
    activeObstacleDomain = "Delays in fortune fruition, ethical dilemmas with mentors/superiors or visa/overseas roadblocks.";
  } else {
    activeObstacleDomain = "Subtle partnership friction, public diplomacy hurdles or contractual ambiguities.";
  }

  let prescribedRemedy = "";
  if (baadhakeshPlanet === "Sun") prescribedRemedy = "Daily morning Surya Arghya with copper vessel & Gayatri Mantra recital.";
  else if (baadhakeshPlanet === "Moon") prescribedRemedy = "Shivling Jalabhishek with pure water on Mondays & respecting motherly figures.";
  else if (baadhakeshPlanet === "Mars") prescribedRemedy = "Hanuman Chalisa recital on Tuesdays & donation of red lentils (Masoor Dal).";
  else if (baadhakeshPlanet === "Mercury") prescribedRemedy = "Feeding green fodder/grass to cows (Gau-Seva) on Wednesdays & Vishnu Sahasranama.";
  else if (baadhakeshPlanet === "Jupiter") prescribedRemedy = "Applying saffron/turmeric tilak on forehead & honoring preceptors/elders.";
  else if (baadhakeshPlanet === "Venus") prescribedRemedy = "Offering white fragrant flowers or sweets to Goddess Lakshmi on Fridays.";
  else if (baadhakeshPlanet === "Saturn") prescribedRemedy = "Lighting a mustard oil lamp under Peepal tree on Saturday evenings & serving laborers.";

  return {
    lagnaModality: modality,
    baadhakHouseNumber: baadhakHouseNum,
    baadhakRashi,
    baadhakeshPlanet,
    baadhakeshD1Placement: baadhakeshPlacement,
    isTransitRahuKetuAfflicting,
    activeObstacleDomain,
    prescribedRemedy,
  };
}

/**
 * 4. Calculate Bhagya Bindu (Fortuna / Point of Prosperity - Session 97)
 */
export function calculateBhagyaBindu(natalEphem: EphemerisResult): BhagyaBinduResult {
  const ascLon = natalEphem.ascendant.siderealLongitude;
  const sun = natalEphem.planets.Sun;
  const moon = natalEphem.planets.Moon;

  const sunLon = sun ? sun.siderealLongitude : 0;
  const moonLon = moon ? moon.siderealLongitude : 0;

  // Check Day vs Night birth (Sun in houses 7-12 is Day birth, Sun in 1-6 is Night birth)
  const isDayBirth = sun ? sun.house >= 7 && sun.house <= 12 : true;

  let bbLon = 0;
  if (isDayBirth) {
    bbLon = ((ascLon + moonLon - sunLon) % 360 + 360) % 360;
  } else {
    bbLon = ((ascLon + sunLon - moonLon) % 360 + 360) % 360;
  }

  const rashiIdx = Math.floor(bbLon / 30);
  const rashi: RashiInfo = {
    ...RASHI_NAMES[rashiIdx],
    degreesInSign: bbLon % 30,
  };
  const ascRashiIdx = Math.floor(ascLon / 30);
  const house = ((rashiIdx - ascRashiIdx + 12) % 12) + 1;

  // Nakshatra of Bhagya Bindu
  const nakIdx = Math.floor(bbLon / (360 / 27));
  const nakNames = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Svati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
  ];
  const nakLords = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
  const nakshatra = nakNames[nakIdx] || "Ashwini";
  const nakshatraLord = nakLords[nakIdx % 9];

  return {
    longitude: bbLon,
    rashi,
    house,
    nakshatra,
    nakshatraLord,
    isDayBirth,
    significance: `Bhagya Bindu anchors in House ${house} (${rashi.englishName} at ${(bbLon % 30).toFixed(2)}°). Whenever benefics (Jupiter/Venus) transit this degree, major unexpected prosperity and fortunate turning points occur.`,
  };
}

/**
 * 5. Master Summary String for Dossier Inclusion
 */
export function generateDrSamirTripathiSummary(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult,
  evaluationDate: Date = new Date()
): string {
  const indu = calculateInduLagna(natalEphem);
  const activations = calculatePlanetaryAgeActivations(natalEphem, evaluationDate);
  const baadhak = evaluateBaadhakDynamics(natalEphem, transitEphem);
  const bhagya = calculateBhagyaBindu(natalEphem);

  const lines: string[] = [
    "### 🌟 DR. SAMIR TRIPATHI VEDIC MASTER SUITE (INDU LAGNA, AGE TRIGGERS & BAADHAK DYNAMICS):",
    "",
    "#### 💰 1. INDU LAGNA (इन्दु लग्न) WEALTH FORMULA (SESSIONS 86-87):",
    `- **9th Lord from Lagna:** ${indu.lagnaNinthLord} (${indu.lagnaNinthKala} Kalas)`,
    `- **9th Lord from Moon:** ${indu.moonNinthLord} (${indu.moonNinthKala} Kalas)`,
    `- **Total Kalas:** ${indu.totalKalas} (Remainder: ${indu.remainderKala})`,
    `- **Indu Lagna Sign:** **${indu.induLagnaRashi.englishName}** (*${indu.induLagnaRashi.sanskritName}*) at ${(indu.induLagnaLongitude % 30).toFixed(2)}° (House ${indu.induLagnaHouseFromD1} from D1 Lagna)`,
    `- **Occupants in Indu Lagna:** ${indu.planetsInInduLagna.length > 0 ? indu.planetsInInduLagna.join(", ") : "None (Aspects apply)"}`,
    `- **Wealth Grade:** **${indu.wealthGrade}**`,
    `- **Predictive Rule:** ${indu.wealthVerdict}`,
    "",
    "#### ⏳ 2. BHRIGU HOUSE & PLANETARY AGE ACTIVATION MATRIX (SESSIONS 50-60):",
    `- **Current Native Age:** **${activations.currentAge} Years Old**`,
    `- **Currently Active House this Year:** **${activations.activeHouse.houseName} (${activations.activeHouse.sanskritName})** — Ruled by ${activations.activeHouse.houseLord}`,
    `- **Active House Occupants:** ${activations.activeHouse.occupantPlanets.length > 0 ? activations.activeHouse.occupantPlanets.join(", ") : "Vacant (Lord governs)"}`,
    `- **Active Year Theme:** ${activations.activeHouse.theme}`,
    `- **Planetary Maturation Horizon:**`,
    ...activations.planetaryAwakenings.map((p) => `  - **${p.planet}:** ${p.status} (Dawn: Age ${p.dawnAge}, Peak: Age ${p.peakAge})`),
    "",
    "#### 🛡️ 3. BAADHAK STHANA & TRANSIT IMPEDIMENT DYNAMICS (SESSIONS 82, 84, 85):",
    `- **Lagna Modality:** ${baadhak.lagnaModality}`,
    `- **Baadhak Sthana (Obstacle House):** House ${baadhak.baadhakHouseNumber} in **${baadhak.baadhakRashi.englishName}** (Ruled by **${baadhak.baadhakeshPlanet}**)`,
    `- **Baadhakesh Placement in Natal Chart:** House ${baadhak.baadhakeshD1Placement.house} in ${baadhak.baadhakeshD1Placement.rashi}`,
    `- **Nodal Transit Affliction (Rahu/Ketu over Baadhak):** ${baadhak.isTransitRahuKetuAfflicting ? "⚠️ ACTIVE (Rahu/Ketu triggering karmic friction)" : "✅ CLEAR (No acute nodal obstruction)"}`,
    `- **Manifestation Domain:** ${baadhak.activeObstacleDomain}`,
    `- **Prescribed Parihara (Remedy):** ${baadhak.prescribedRemedy}`,
    "",
    "#### 🎯 4. BHAGYA BINDU (FORTUNE POINT / PROSPERITY FOCUS - SESSION 97):",
    `- **Bhagya Bindu Position:** **${bhagya.rashi.englishName}** (${(bhagya.longitude % 30).toFixed(2)}°) in **House ${bhagya.house}** (${bhagya.isDayBirth ? "Day Birth Formula" : "Night Birth Formula"})`,
    `- **Nakshatra:** ${bhagya.nakshatra} (Lord: ${bhagya.nakshatraLord})`,
    `- **Significance:** ${bhagya.significance}`,
  ];

  return lines.join("\n");
}
