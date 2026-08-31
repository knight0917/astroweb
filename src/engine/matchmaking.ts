/**
 * Classical Ashtakoota 36-Guna Kundli Milan & Manglik Dosha Engine (अष्टकूट मिलान)
 * References:
 * - Muhurta Chintamani (मुहूर्त चिन्तामणि - विवाह प्रकरण)
 * - Jataka Parijata (जातक पारिजात)
 * - Kalaprakasika
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateAshtakavarga } from "./ashtakavarga";
import { calculateShodashavargaChart } from "./shodashavarga";

export interface KootaScore {
  name: string;
  sanskritName: string;
  maxScore: number;
  obtainedScore: number;
  boyAttribute: string;
  girlAttribute: string;
  isDosha: boolean;
  doshaName?: string;
  isCancelled?: boolean;
  cancellationReason?: string;
  description: string;
}

export interface ManglikAnalysis {
  isManglik: boolean;
  severity: "None" | "Mild" | "Moderate" | "High";
  doshaFromLagna: boolean;
  doshaFromMoon: boolean;
  doshaFromVenus: boolean;
  marsHouseFromLagna: number;
  marsHouseFromMoon: number;
  marsHouseFromVenus: number;
  isCancelled: boolean;
  cancellationReasons: string[];
}

export interface AshtakavargaCompatibility {
  boyLagnaSAVInGirlChart: number;
  girlLagnaSAVInBoyChart: number;
  boyMoonSAVInGirlChart: number;
  girlMoonSAVInBoyChart: number;
  boyMoonBAVInGirl: number;
  girlMoonBAVInBoy: number;
  boyVenusBAVInGirl: number;
  girlVenusBAVInBoy: number;
  boy7thHouseSAV: number;
  girl7thHouseSAV: number;
  ashtakavargaScore: number;
  verdict: "Highly Auspicious (उत्कृष्ट)" | "Auspicious (शुभ)" | "Average (साधारण)" | "Requires Attention (सावधानी)";
  description: string;
  principles: string[];
}

export interface D1D9CrossSynastry {
  // 1. D-9 Lagna Axis
  boyD9LagnaRashi: string;
  girlD9LagnaRashi: string;
  d9LagnaRelationship: "1-1 (Identical Harmony)" | "1-7 (Samasaptaka Soulmate)" | "5-9 (Navapanchama Spiritual)" | "3-11 (Triteeya-Ekadasha Friendly)" | "4-10 (Kendra Dynamic)" | "6-8 (Shashtashtaka Friction)" | "2-12 (Dvidwadasa Growth/Adjustment)";
  
  // 2. D-9 Lagna Lord in Partner's D-9 (Image 4 Step 2)
  boyD9LagnaLordInGirlD9House: number;
  girlD9LagnaLordInBoyD9House: number;
  isD9LagnaLordInTrik: boolean;
  d9LagnaLordCrossVerdict: string;

  // 3. D-1 to D-9 Moon & Lagna Resonance
  isMoonD1ToD9Resonance: boolean;
  moonResonanceDescription: string;

  // 4. D-9 4th House Domestic Joy Balance (Image 4 Step 4)
  d9FourthHouseHarmony: string;

  // 5. Birth Dasha Lord Linkage (Image 4 Step 1)
  isBirthDashaConnectedToBride: boolean;
  birthDashaLinkDescription: string;

  // 6. Overall D-1 / D-9 Cross Synastry Score & Verdict
  crossSynastryScorePercent: number;
  verdict: "Highly Compatible (उत्कृष्ट नवांश युगल)" | "Compatible (शुभ)" | "Average (साधारण)" | "Karmic Adjustments Required (सावधानी)";
  synthesis: string;
}

export interface CompatibilityResult {
  totalScore: number;
  maxScore: 36;
  percentage: number;
  verdict: "Exceptional (उत्कृष्ट)" | "Auspicious (शुभ / ग्राह्य)" | "Average (साधारण)" | "Inauspicious (अशुभ / वर्ज्य)";
  verdictDescription: string;
  kootas: {
    varna: KootaScore;
    vashya: KootaScore;
    tara: KootaScore;
    yoni: KootaScore;
    grahaMaitri: KootaScore;
    gana: KootaScore;
    bhakoot: KootaScore;
    nadi: KootaScore;
  };
  boyManglik: ManglikAnalysis;
  girlManglik: ManglikAnalysis;
  manglikCompatibility: {
    isCompatible: boolean;
    statusText: string;
    description: string;
  };
  ashtakavargaCompatibility: AshtakavargaCompatibility;
  d1d9Synastry: D1D9CrossSynastry;
}

// 1. VARNA DATA (Brahmin 4, Kshatriya 3, Vaishya 2, Shudra 1)
const RASHI_VARNA: Record<number, { varna: string; sanskrit: string; grade: number }> = {
  3: { varna: "Brahmin", sanskrit: "ब्राह्मण", grade: 4 }, // Cancer
  7: { varna: "Brahmin", sanskrit: "ब्राह्मण", grade: 4 }, // Scorpio
  11: { varna: "Brahmin", sanskrit: "ब्राह्मण", grade: 4 }, // Pisces
  0: { varna: "Kshatriya", sanskrit: "क्षत्रिय", grade: 3 }, // Aries
  4: { varna: "Kshatriya", sanskrit: "क्षत्रिय", grade: 3 }, // Leo
  8: { varna: "Kshatriya", sanskrit: "क्षत्रिय", grade: 3 }, // Sagittarius
  1: { varna: "Vaishya", sanskrit: "वैश्य", grade: 2 }, // Taurus
  5: { varna: "Vaishya", sanskrit: "वैश्य", grade: 2 }, // Virgo
  9: { varna: "Vaishya", sanskrit: "वैश्य", grade: 2 }, // Capricorn
  2: { varna: "Shudra", sanskrit: "शूद्र", grade: 1 }, // Gemini
  6: { varna: "Shudra", sanskrit: "शूद्र", grade: 1 }, // Libra
  10: { varna: "Shudra", sanskrit: "शूद्र", grade: 1 }, // Aquarius
};

// 2. VASHYA DATA
const RASHI_VASHYA: Record<number, string> = {
  0: "Chatushpada (Quadruped)",
  1: "Chatushpada (Quadruped)",
  2: "Manava (Human)",
  3: "Jalachara (Water)",
  4: "Vanachara (Lion)",
  5: "Manava (Human)",
  6: "Manava (Human)",
  7: "Keeta (Insect)",
  8: "Manava / Chatushpada",
  9: "Chatushpada / Jalachara",
  10: "Manava (Human)",
  11: "Jalachara (Water)",
};

// 3. YONI DATA (14 Animals for 27 Nakshatras)
const NAKSHATRA_YONI: Record<number, { animal: string; sanskrit: string }> = {
  0: { animal: "Horse", sanskrit: "अश्व" },
  1: { animal: "Elephant", sanskrit: "गज" },
  2: { animal: "Sheep / Goat", sanskrit: "मेष" },
  3: { animal: "Serpent", sanskrit: "सर्प" },
  4: { animal: "Serpent", sanskrit: "सर्प" },
  5: { animal: "Dog", sanskrit: "श्वान" },
  6: { animal: "Cat", sanskrit: "मार्जार" },
  7: { animal: "Sheep / Goat", sanskrit: "मेष" },
  8: { animal: "Cat", sanskrit: "मार्जार" },
  9: { animal: "Rat", sanskrit: "मूषक" },
  10: { animal: "Rat", sanskrit: "मूषक" },
  11: { animal: "Cow / Bull", sanskrit: "गो" },
  12: { animal: "Buffalo", sanskrit: "महिष" },
  13: { animal: "Tiger", sanskrit: "व्याघ्र" },
  14: { animal: "Buffalo", sanskrit: "महिष" },
  15: { animal: "Tiger", sanskrit: "व्याघ्र" },
  16: { animal: "Deer", sanskrit: "मृग" },
  17: { animal: "Deer", sanskrit: "मृग" },
  18: { animal: "Dog", sanskrit: "श्वान" },
  19: { animal: "Monkey", sanskrit: "वानर" },
  20: { animal: "Mongoose", sanskrit: "नकुल" },
  21: { animal: "Monkey", sanskrit: "वानर" },
  22: { animal: "Lion", sanskrit: "सिंह" },
  23: { animal: "Horse", sanskrit: "अश्व" },
  24: { animal: "Lion", sanskrit: "सिंह" },
  25: { animal: "Cow / Bull", sanskrit: "गो" },
  26: { animal: "Elephant", sanskrit: "गज" },
};

const SWORN_ENEMY_YONIS: [string, string][] = [
  ["Horse", "Buffalo"],
  ["Elephant", "Lion"],
  ["Sheep / Goat", "Monkey"],
  ["Serpent", "Mongoose"],
  ["Dog", "Deer"],
  ["Cat", "Rat"],
  ["Cow / Bull", "Tiger"],
];

// 4. GANA DATA (Deva, Manushya, Rakshasa)
const NAKSHATRA_GANA: Record<number, "Deva" | "Manushya" | "Rakshasa"> = {
  0: "Deva", 1: "Manushya", 2: "Rakshasa",
  3: "Manushya", 4: "Deva", 5: "Manushya",
  6: "Deva", 7: "Deva", 8: "Rakshasa",
  9: "Rakshasa", 10: "Manushya", 11: "Manushya",
  12: "Deva", 13: "Rakshasa", 14: "Deva",
  15: "Rakshasa", 16: "Deva", 17: "Rakshasa",
  18: "Rakshasa", 19: "Manushya", 20: "Manushya",
  21: "Deva", 22: "Rakshasa", 23: "Rakshasa",
  24: "Manushya", 25: "Manushya", 26: "Deva",
};

// 5. NADI DATA (Adi 1, Madhya 2, Antya 3)
const NAKSHATRA_NADI: Record<number, { name: "Adi (Vata)" | "Madhya (Pitta)" | "Antya (Kapha)"; sanskrit: string }> = {
  0: { name: "Adi (Vata)", sanskrit: "आदि" },
  1: { name: "Madhya (Pitta)", sanskrit: "मध्य" },
  2: { name: "Antya (Kapha)", sanskrit: "अन्त्य" },
  3: { name: "Antya (Kapha)", sanskrit: "अन्त्य" },
  4: { name: "Madhya (Pitta)", sanskrit: "मध्य" },
  5: { name: "Adi (Vata)", sanskrit: "आदि" },
  6: { name: "Adi (Vata)", sanskrit: "आदि" },
  7: { name: "Madhya (Pitta)", sanskrit: "मध्य" },
  8: { name: "Antya (Kapha)", sanskrit: "अन्त्य" },
  9: { name: "Antya (Kapha)", sanskrit: "अन्त्य" },
  10: { name: "Madhya (Pitta)", sanskrit: "मध्य" },
  11: { name: "Adi (Vata)", sanskrit: "आदि" },
  12: { name: "Adi (Vata)", sanskrit: "आदि" },
  13: { name: "Madhya (Pitta)", sanskrit: "मध्य" },
  14: { name: "Antya (Kapha)", sanskrit: "अन्त्य" },
  15: { name: "Antya (Kapha)", sanskrit: "अन्त्य" },
  16: { name: "Madhya (Pitta)", sanskrit: "मध्य" },
  17: { name: "Adi (Vata)", sanskrit: "आदि" },
  18: { name: "Adi (Vata)", sanskrit: "आदि" },
  19: { name: "Madhya (Pitta)", sanskrit: "मध्य" },
  20: { name: "Antya (Kapha)", sanskrit: "अन्त्य" },
  21: { name: "Antya (Kapha)", sanskrit: "अन्त्य" },
  22: { name: "Madhya (Pitta)", sanskrit: "मध्य" },
  23: { name: "Adi (Vata)", sanskrit: "आदि" },
  24: { name: "Adi (Vata)", sanskrit: "आदि" },
  25: { name: "Madhya (Pitta)", sanskrit: "मध्य" },
  26: { name: "Antya (Kapha)", sanskrit: "अन्त्य" },
};

const RASHI_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

const PLANETARY_FRIENDS: Record<string, { friends: string[]; enemies: string[] }> = {
  Sun: { friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"] },
  Moon: { friends: ["Sun", "Mercury"], enemies: [] },
  Mars: { friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"] },
  Mercury: { friends: ["Sun", "Venus"], enemies: ["Moon"] },
  Jupiter: { friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"] },
  Venus: { friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"] },
  Saturn: { friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"] },
};

export function calculateMatchmaking(
  boyEphem: EphemerisResult,
  girlEphem: EphemerisResult
): CompatibilityResult {
  const bMoon = boyEphem.planets.Moon;
  const gMoon = girlEphem.planets.Moon;

  const bRashiIdx = bMoon.rashi.index;
  const gRashiIdx = gMoon.rashi.index;

  const bNakIdx = bMoon.nakshatra.index;
  const gNakIdx = gMoon.nakshatra.index;

  const bLord = RASHI_LORDS[bRashiIdx];
  const gLord = RASHI_LORDS[gRashiIdx];

  // 1. VARNA KOOTA (1 Point)
  const bVarna = RASHI_VARNA[bRashiIdx];
  const gVarna = RASHI_VARNA[gRashiIdx];
  const varnaScore = bVarna.grade >= gVarna.grade ? 1 : 0;
  const varna: KootaScore = {
    name: "Varna",
    sanskritName: "वर्ण कूट",
    maxScore: 1,
    obtainedScore: varnaScore,
    boyAttribute: `${bVarna.varna} (${bVarna.sanskrit})`,
    girlAttribute: `${gVarna.varna} (${gVarna.sanskrit})`,
    isDosha: varnaScore === 0,
    description: varnaScore === 1
      ? "Harmonious ego alignment and spiritual compatibility."
      : "Varna disparity; boy should ideally be equal or higher in spiritual grade.",
  };

  // 2. VASHYA KOOTA (2 Points)
  const bVashya = RASHI_VASHYA[bRashiIdx];
  const gVashya = RASHI_VASHYA[gRashiIdx];
  let vashyaScore = 0;
  if (bRashiIdx === gRashiIdx || bVashya === gVashya) vashyaScore = 2;
  else if (
    (bVashya.includes("Manava") && gVashya.includes("Chatushpada")) ||
    (bVashya.includes("Chatushpada") && gVashya.includes("Jalachara"))
  ) {
    vashyaScore = 1;
  } else {
    vashyaScore = 0.5;
  }
  const vashya: KootaScore = {
    name: "Vashya",
    sanskritName: "वश्य कूट",
    maxScore: 2,
    obtainedScore: vashyaScore,
    boyAttribute: bVashya,
    girlAttribute: gVashya,
    isDosha: vashyaScore < 1,
    description: vashyaScore >= 1
      ? "Mutual attraction and balanced emotional control."
      : "Average domestic balance and mutual influence.",
  };

  // 3. TARA KOOTA (3 Points)
  const distGtoB = ((bNakIdx - gNakIdx + 27) % 27) + 1;
  const remGtoB = distGtoB % 9 || 9;
  const isAuspiciousTara1 = [2, 4, 6, 8, 9].includes(remGtoB);

  const distBtoG = ((gNakIdx - bNakIdx + 27) % 27) + 1;
  const remBtoG = distBtoG % 9 || 9;
  const isAuspiciousTara2 = [2, 4, 6, 8, 9].includes(remBtoG);

  let taraScore = 0;
  if (isAuspiciousTara1 && isAuspiciousTara2) taraScore = 3;
  else if (isAuspiciousTara1 || isAuspiciousTara2) taraScore = 1.5;
  else taraScore = 0;

  const tara: KootaScore = {
    name: "Tara",
    sanskritName: "तारा कूट",
    maxScore: 3,
    obtainedScore: taraScore,
    boyAttribute: `${bMoon.nakshatra.sanskritName} (Tara #${remGtoB})`,
    girlAttribute: `${gMoon.nakshatra.sanskritName} (Tara #${remBtoG})`,
    isDosha: taraScore === 0,
    doshaName: taraScore === 0 ? "Tara Dosha" : undefined,
    description: taraScore === 3
      ? "Excellent health, destiny and mutual longevity alignment."
      : taraScore === 1.5
      ? "Moderate destiny support and energetic resilience."
      : "Inauspicious Tara combination (Vipat/Pratyak/Vadha).",
  };

  // 4. YONI KOOTA (4 Points)
  const bYoni = NAKSHATRA_YONI[bNakIdx];
  const gYoni = NAKSHATRA_YONI[gNakIdx];

  const isSwornEnemies = SWORN_ENEMY_YONIS.some(
    ([y1, y2]) => (bYoni.animal === y1 && gYoni.animal === y2) || (bYoni.animal === y2 && gYoni.animal === y1)
  );

  let yoniScore = 2;
  if (bYoni.animal === gYoni.animal) yoniScore = 4;
  else if (isSwornEnemies) yoniScore = 0;
  else yoniScore = 2;

  const yoni: KootaScore = {
    name: "Yoni",
    sanskritName: "योनि कूट",
    maxScore: 4,
    obtainedScore: yoniScore,
    boyAttribute: `${bYoni.animal} (${bYoni.sanskrit})`,
    girlAttribute: `${gYoni.animal} (${gYoni.sanskrit})`,
    isDosha: yoniScore === 0,
    doshaName: isSwornEnemies ? "Vairi Yoni (Sworn Enemy)" : undefined,
    description: yoniScore === 4
      ? "Supreme physical, biological and biological harmony."
      : yoniScore >= 2
      ? "Good mutual physical and temperamental compatibility."
      : "Yoni Dosha: Classical biological and temperamental clash.",
  };

  // 5. GRAHA MAITRI KOOTA (5 Points)
  let grahaMaitriScore = 0;
  if (bLord === gLord) {
    grahaMaitriScore = 5;
  } else {
    const bRel = PLANETARY_FRIENDS[bLord];
    const gRel = PLANETARY_FRIENDS[gLord];
    const bLikesG = bRel ? (bRel.friends.includes(gLord) ? "friend" : bRel.enemies.includes(gLord) ? "enemy" : "neutral") : "neutral";
    const gLikesB = gRel ? (gRel.friends.includes(bLord) ? "friend" : gRel.enemies.includes(bLord) ? "enemy" : "neutral") : "neutral";

    if (bLikesG === "friend" && gLikesB === "friend") grahaMaitriScore = 5;
    else if ((bLikesG === "friend" && gLikesB === "neutral") || (bLikesG === "neutral" && gLikesB === "friend")) grahaMaitriScore = 4;
    else if (bLikesG === "neutral" && gLikesB === "neutral") grahaMaitriScore = 3;
    else if ((bLikesG === "friend" && gLikesB === "enemy") || (bLikesG === "enemy" && gLikesB === "friend")) grahaMaitriScore = 1;
    else if ((bLikesG === "neutral" && gLikesB === "enemy") || (bLikesG === "enemy" && gLikesB === "neutral")) grahaMaitriScore = 0.5;
    else grahaMaitriScore = 0;
  }

  const grahaMaitri: KootaScore = {
    name: "Graha Maitri",
    sanskritName: "ग्रह मैत्री कूट",
    maxScore: 5,
    obtainedScore: grahaMaitriScore,
    boyAttribute: `${bLord} (Rashi Lord)`,
    girlAttribute: `${gLord} (Rashi Lord)`,
    isDosha: grahaMaitriScore < 2,
    doshaName: grahaMaitriScore < 2 ? "Graha Vairita" : undefined,
    description: grahaMaitriScore >= 4
      ? "Deep intellectual friendship, mental harmony and understanding."
      : grahaMaitriScore >= 2
      ? "Satisfactory mental and psychological rapport."
      : "Psychological difference of viewpoints and temperamental friction.",
  };

  // 6. GANA KOOTA (6 Points)
  const bGana = NAKSHATRA_GANA[bNakIdx];
  const gGana = NAKSHATRA_GANA[gNakIdx];

  let ganaScore = 0;
  if (bGana === gGana) ganaScore = 6;
  else if ((bGana === "Deva" && gGana === "Manushya") || (bGana === "Manushya" && gGana === "Deva")) ganaScore = 5;
  else if (bGana === "Rakshasa" && gGana === "Deva") ganaScore = 1;
  else if (bGana === "Deva" && gGana === "Rakshasa") ganaScore = 0;
  else ganaScore = 0;

  const gana: KootaScore = {
    name: "Gana",
    sanskritName: "गण कूट",
    maxScore: 6,
    obtainedScore: ganaScore,
    boyAttribute: `${bGana} Gana`,
    girlAttribute: `${gGana} Gana`,
    isDosha: ganaScore === 0,
    doshaName: ganaScore === 0 ? "Gana Dosha" : undefined,
    description: ganaScore >= 5
      ? "Harmonious lifestyle, nature and domestic temperaments."
      : "Gana Dosha: Divergent domestic expectations and behavioral habits.",
  };

  // 7. BHAKOOT KOOTA (7 Points)
  const rashiDiff = ((gRashiIdx - bRashiIdx + 12) % 12) + 1;
  const isAuspiciousBhakoot = [1, 7, 3, 11, 4, 10].includes(rashiDiff);
  let bhakootScore = isAuspiciousBhakoot ? 7 : 0;
  let isBhakootCancelled = false;
  let bhakootCancelReason = "";

  if (!isAuspiciousBhakoot) {
    if (bLord === gLord) {
      isBhakootCancelled = true;
      bhakootCancelReason = `Both Moon signs ruled by same lord (${bLord}); Bhakoot Dosha nullified.`;
      bhakootScore = 7;
    }
  }

  const bhakoot: KootaScore = {
    name: "Bhakoot",
    sanskritName: "भकूट कूट",
    maxScore: 7,
    obtainedScore: bhakootScore,
    boyAttribute: `${RASHI_NAMES[bRashiIdx].englishName}`,
    girlAttribute: `${RASHI_NAMES[gRashiIdx].englishName}`,
    isDosha: bhakootScore === 0,
    doshaName: bhakootScore === 0 ? "Bhakoot Dosha" : undefined,
    isCancelled: isBhakootCancelled,
    cancellationReason: bhakootCancelReason,
    description: bhakootScore === 7
      ? isBhakootCancelled
        ? `Bhakoot Dosha cancelled: ${bhakootCancelReason}`
        : "Excellent family prosperity, mutual emotional joy and growth."
      : "Bhakoot Dosha (Shadashtaka/Dwirdwadasa): Potential financial or emotional strain.",
  };

  // 8. NADI KOOTA (8 Points)
  const bNadi = NAKSHATRA_NADI[bNakIdx];
  const gNadi = NAKSHATRA_NADI[gNakIdx];
  let nadiScore = bNadi.name !== gNadi.name ? 8 : 0;
  let isNadiCancelled = false;
  let nadiCancelReason = "";

  if (nadiScore === 0) {
    if (bRashiIdx === gRashiIdx && bNakIdx !== gNakIdx) {
      isNadiCancelled = true;
      nadiCancelReason = "Same Moon Rashi but different Nakshatras; Nadi Dosha cancelled.";
      nadiScore = 8;
    } else if (bLord === gLord) {
      isNadiCancelled = true;
      nadiCancelReason = `Both Moon Rashis ruled by ${bLord}; Nadi Dosha nullified.`;
      nadiScore = 8;
    }
  }

  const nadi: KootaScore = {
    name: "Nadi",
    sanskritName: "नाड़ी कूट",
    maxScore: 8,
    obtainedScore: nadiScore,
    boyAttribute: `${bNadi.name} (${bNadi.sanskrit})`,
    girlAttribute: `${gNadi.name} (${gNadi.sanskrit})`,
    isDosha: nadiScore === 0,
    doshaName: nadiScore === 0 ? "Nadi Dosha" : undefined,
    isCancelled: isNadiCancelled,
    cancellationReason: nadiCancelReason,
    description: nadiScore === 8
      ? isNadiCancelled
        ? `Nadi Dosha cancelled: ${nadiCancelReason}`
        : "Complete physiological, genetic and progeny harmony."
      : "Nadi Dosha: Same bio-energetic constitution (consult remedies).",
  };

  const totalScore = varnaScore + vashyaScore + taraScore + yoniScore + grahaMaitriScore + ganaScore + bhakootScore + nadiScore;
  const percentage = Math.round((totalScore / 36) * 100);

  let verdict: CompatibilityResult["verdict"] = "Average (साधारण)";
  let verdictDescription = "";

  if (totalScore >= 28) {
    verdict = "Exceptional (उत्कृष्ट)";
    verdictDescription = "Outstanding match! Highly auspicious for lifelong prosperity, spiritual harmony and happiness.";
  } else if (totalScore >= 18) {
    verdict = "Auspicious (शुभ / ग्राह्य)";
    verdictDescription = "Recommended match. Strong overall foundation with good mutual compatibility.";
  } else if (totalScore >= 14) {
    verdict = "Average (साधारण)";
    verdictDescription = "Moderate score. Relationship will thrive with mutual adjustment and recommended remedies.";
  } else {
    verdict = "Inauspicious (अशुभ / वर्ज्य)";
    verdictDescription = "Score falls below 18 gunas. In-depth astrological consultation and remedial pooja recommended.";
  }

  const boyManglik = evaluateManglikDosha(boyEphem);
  const girlManglik = evaluateManglikDosha(girlEphem);

  let isManglikCompatible = true;
  let manglikText = "Compatible";
  let manglikDesc = "";

  if (!boyManglik.isManglik && !girlManglik.isManglik) {
    isManglikCompatible = true;
    manglikText = "Both Non-Manglik";
    manglikDesc = "Neither chart has Kuja Dosha. Perfect balance.";
  } else if (boyManglik.isManglik && girlManglik.isManglik) {
    isManglikCompatible = true;
    manglikText = "Both Manglik (Mutual Cancellation)";
    manglikDesc = "Both partners have Kuja Dosha, resulting in classical mutual nullification (दोष साम्यता).";
  } else if ((boyManglik.isManglik && boyManglik.isCancelled) || (girlManglik.isManglik && girlManglik.isCancelled)) {
    isManglikCompatible = true;
    manglikText = "Manglik Dosha Cancelled";
    manglikDesc = "Kuja Dosha is present but nullified by classical planetary exemptions.";
  } else {
    isManglikCompatible = false;
    manglikText = "One Manglik, One Non-Manglik";
    manglikDesc = "One chart is Manglik while the other is not. Kumbh Vivah or Mars remedial Upayas advised.";
  }

  // 9. CLASSICAL ASHTAKAVARGA SYNASTRY (C.S. Patel & Parashara)
  const bAV = calculateAshtakavarga(boyEphem);
  const gAV = calculateAshtakavarga(girlEphem);

  const bLagnaSign = boyEphem.ascendant?.rashi.index || 0;
  const gLagnaSign = girlEphem.ascendant?.rashi.index || 0;
  const bVenusSign = boyEphem.planets.Venus?.rashi.index || 0;
  const gVenusSign = girlEphem.planets.Venus?.rashi.index || 0;

  const boyLagnaSAVInGirlChart = gAV.sarvaRashiBindus[bLagnaSign] || 0;
  const girlLagnaSAVInBoyChart = bAV.sarvaRashiBindus[gLagnaSign] || 0;
  const boyMoonSAVInGirlChart = gAV.sarvaRashiBindus[bRashiIdx] || 0;
  const girlMoonSAVInBoyChart = bAV.sarvaRashiBindus[gRashiIdx] || 0;

  const boyMoonBAVInGirl = gAV.bav?.Moon?.rashiBindus[bRashiIdx] || 0;
  const girlMoonBAVInBoy = bAV.bav?.Moon?.rashiBindus[gRashiIdx] || 0;
  const boyVenusBAVInGirl = gAV.bav?.Venus?.rashiBindus[bVenusSign] || 0;
  const girlVenusBAVInBoy = bAV.bav?.Venus?.rashiBindus[gVenusSign] || 0;

  const boy7thHouseSAV = bAV.sarvaHouseBindus[6] || 0;
  const girl7thHouseSAV = gAV.sarvaHouseBindus[6] || 0;

  const avPrinciples: string[] = [];
  let avPoints = 0;
  const maxAvPoints = 8;

  // Principle 1: Moon BAV reception (>= 4 bindus is favorable)
  if (boyMoonBAVInGirl >= 4 && girlMoonBAVInBoy >= 4) {
    avPoints += 2;
    avPrinciples.push("Both Moon signs have >= 4 Moon BAV bindus in partner's chart (High emotional receptivity & mutual affection).");
  } else if (boyMoonBAVInGirl >= 4 || girlMoonBAVInBoy >= 4) {
    avPoints += 1;
    avPrinciples.push("One partner's Moon sign receives >= 4 Moon BAV bindus (Moderate emotional reception).");
  } else {
    avPrinciples.push("Moon BAV bindus below 4 in partner's chart (Requires conscious emotional empathy).");
  }

  // Principle 2: Lagna SAV in partner's chart (>= 28 bindus is auspicious, >= 30 is royal fortune)
  if (boyLagnaSAVInGirlChart >= 28 && girlLagnaSAVInBoyChart >= 28) {
    avPoints += 2;
    avPrinciples.push(`Both Lagna signs receive high SAV bindus (Groom in Bride: ${boyLagnaSAVInGirlChart}, Bride in Groom: ${girlLagnaSAVInBoyChart}) -> Mutual life expansion and good fortune.`);
  } else if (boyLagnaSAVInGirlChart >= 28 || girlLagnaSAVInBoyChart >= 28) {
    avPoints += 1;
    avPrinciples.push(`One Lagna sign receives >= 28 SAV bindus in partner's chart (Groom: ${boyLagnaSAVInGirlChart}, Bride: ${girlLagnaSAVInBoyChart}).`);
  } else {
    avPrinciples.push(`Lagna SAV bindus moderate in partner's chart (Groom: ${boyLagnaSAVInGirlChart}, Bride: ${girlLagnaSAVInBoyChart}).`);
  }

  // Principle 3: Moon SAV in partner's chart (>= 28 bindus)
  if (boyMoonSAVInGirlChart >= 28 && girlMoonSAVInBoyChart >= 28) {
    avPoints += 2;
    avPrinciples.push(`Both Moon signs receive >= 28 SAV bindus (Groom: ${boyMoonSAVInGirlChart}, Bride: ${girlMoonSAVInBoyChart}) -> Enduring psychological peace and family harmony.`);
  } else {
    avPoints += 1;
    avPrinciples.push(`Moon SAV bindus (Groom: ${boyMoonSAVInGirlChart}, Bride: ${girlMoonSAVInBoyChart}) -> Stable domestic harmony.`);
  }

  // Principle 4: 7th House SAV Strength (>= 28 bindus)
  if (boy7thHouseSAV >= 28 && girl7thHouseSAV >= 28) {
    avPoints += 2;
    avPrinciples.push(`Both 7th houses have strong SAV bindus (Groom: ${boy7thHouseSAV}, Bride: ${girl7thHouseSAV}) -> Stable marital foundation and strong partnership endurance.`);
  } else {
    avPoints += 1;
    avPrinciples.push(`7th House SAV bindus (Groom: ${boy7thHouseSAV}, Bride: ${girl7thHouseSAV}) -> Standard marital foundation.`);
  }

  const ashtakavargaScore = Math.round((avPoints / maxAvPoints) * 100);
  let avVerdict: AshtakavargaCompatibility["verdict"] = "Auspicious (शुभ)";
  if (ashtakavargaScore >= 85) avVerdict = "Highly Auspicious (उत्कृष्ट)";
  else if (ashtakavargaScore >= 60) avVerdict = "Auspicious (शुभ)";
  else if (ashtakavargaScore >= 40) avVerdict = "Average (साधारण)";
  else avVerdict = "Requires Attention (सावधानी)";

  const ashtakavargaCompatibility: AshtakavargaCompatibility = {
    boyLagnaSAVInGirlChart,
    girlLagnaSAVInBoyChart,
    boyMoonSAVInGirlChart,
    girlMoonSAVInBoyChart,
    boyMoonBAVInGirl,
    girlMoonBAVInBoy,
    boyVenusBAVInGirl,
    girlVenusBAVInBoy,
    boy7thHouseSAV,
    girl7thHouseSAV,
    ashtakavargaScore,
    verdict: avVerdict,
    description: `Ashtakavarga compatibility is ${avVerdict} (${ashtakavargaScore}% harmony across SAV & BAV cross-placements).`,
    principles: avPrinciples,
  };

  // 5. D-1 and D-9 Multi-Varga Cross-Synastry (Handwritten Notes & Stri Jataka)
  const boyD1Chart = calculateShodashavargaChart(boyEphem, "D1");
  const boyD9Chart = calculateShodashavargaChart(boyEphem, "D9");
  const girlD1Chart = calculateShodashavargaChart(girlEphem, "D1");
  const girlD9Chart = calculateShodashavargaChart(girlEphem, "D9");

  const boyD9AscSign = boyD9Chart.ascendant.vargaSignIndex;
  const girlD9AscSign = girlD9Chart.ascendant.vargaSignIndex;
  const boyD9LagnaRashi = RASHI_NAMES[boyD9AscSign].englishName;
  const girlD9LagnaRashi = RASHI_NAMES[girlD9AscSign].englishName;

  const d9Diff = ((girlD9AscSign - boyD9AscSign + 12) % 12) + 1;
  let d9LagnaRelationship: D1D9CrossSynastry["d9LagnaRelationship"] = "1-1 (Identical Harmony)";
  let d9SynScore = 20;

  if (d9Diff === 1) {
    d9LagnaRelationship = "1-1 (Identical Harmony)";
    d9SynScore += 20;
  } else if (d9Diff === 7) {
    d9LagnaRelationship = "1-7 (Samasaptaka Soulmate)";
    d9SynScore += 25;
  } else if (d9Diff === 5 || d9Diff === 9) {
    d9LagnaRelationship = "5-9 (Navapanchama Spiritual)";
    d9SynScore += 25;
  } else if (d9Diff === 3 || d9Diff === 11) {
    d9LagnaRelationship = "3-11 (Triteeya-Ekadasha Friendly)";
    d9SynScore += 18;
  } else if (d9Diff === 4 || d9Diff === 10) {
    d9LagnaRelationship = "4-10 (Kendra Dynamic)";
    d9SynScore += 15;
  } else if (d9Diff === 6 || d9Diff === 8) {
    d9LagnaRelationship = "6-8 (Shashtashtaka Friction)";
    d9SynScore -= 10;
  } else {
    d9LagnaRelationship = "2-12 (Dvidwadasa Growth/Adjustment)";
    d9SynScore += 5;
  }

  // D-9 Lagna Lord placement in partner's D-9 chart (Stri Jataka & Navamsha Synastry)
  const boyD9LagnaLord = RASHI_NAMES[boyD9AscSign].lord;
  const girlD9LagnaLord = RASHI_NAMES[girlD9AscSign].lord;

  const pBoyLordInGirlD9 = girlD9Chart.entities.find((e) => e.name === boyD9LagnaLord);
  const pGirlLordInBoyD9 = boyD9Chart.entities.find((e) => e.name === girlD9LagnaLord);

  const boyD9LagnaLordInGirlD9House = pBoyLordInGirlD9?.house ?? 1;
  const girlD9LagnaLordInBoyD9House = pGirlLordInBoyD9?.house ?? 1;

  const isD9LagnaLordInTrik =
    [6, 8, 12].includes(boyD9LagnaLordInGirlD9House) ||
    [6, 8, 12].includes(girlD9LagnaLordInBoyD9House);

  let d9LagnaLordCrossVerdict = "";
  if (isD9LagnaLordInTrik) {
    d9SynScore -= 15;
    d9LagnaLordCrossVerdict = `Caution: D-9 Lagna Lord (${boyD9LagnaLord} / ${girlD9LagnaLord}) occupies Trik House (H${boyD9LagnaLordInGirlD9House} / H${girlD9LagnaLordInBoyD9House}) in partner's D-9 chart. Requires conscious patience and mutual space.`;
  } else {
    d9SynScore += 20;
    d9LagnaLordCrossVerdict = `Auspicious: D-9 Lagna Lords occupy Fortified Houses (Groom: H${boyD9LagnaLordInGirlD9House}, Bride: H${girlD9LagnaLordInBoyD9House}), fulfilling marital desires smoothly.`;
  }

  // D-1 Moon to D-9 Moon / Lagna
  const boyD1MoonSign = Math.floor((boyEphem.planets.Moon?.siderealLongitude || 0) / 30);
  const girlD1MoonSign = Math.floor((girlEphem.planets.Moon?.siderealLongitude || 0) / 30);
  const isMoonD1ToD9Resonance =
    boyD1MoonSign === girlD9AscSign ||
    girlD1MoonSign === boyD9AscSign ||
    [0, 4, 8].includes((girlD9AscSign - boyD1MoonSign + 12) % 12);

  if (isMoonD1ToD9Resonance) d9SynScore += 15;
  const moonResonanceDescription = isMoonD1ToD9Resonance
    ? "D-1 Janma Rashi forms trinal/kendra harmony with partner's D-9 Lagna/Moon -> High subconscious telepathy and emotional devotion."
    : "Standard emotional interface across D-1 and D-9 levels.";

  // D-9 4th House domestic joy (Stri Jataka)
  const boyD9H4Benefic = boyD9Chart.entities.some((e) => e.house === 4 && ["Jupiter", "Venus", "Mercury"].includes(e.name));
  const girlD9H4Benefic = girlD9Chart.entities.some((e) => e.house === 4 && ["Jupiter", "Venus", "Mercury"].includes(e.name));
  if (boyD9H4Benefic && girlD9H4Benefic) d9SynScore += 15;
  const d9FourthHouseHarmony = (boyD9H4Benefic || girlD9H4Benefic)
    ? "D-9 4th House holds benefic energies in matrimonial division, securing peaceful domestic sanctuary."
    : "D-9 4th House reflects disciplined, structured domestic partnership.";

  // Birth Dasha Lord Linkage (Vimshottari Dasha Synastry)
  const boyBirthDashaLord = boyEphem.planets.Moon?.nakshatra.lord || "Venus";
  const girl7thLord = RASHI_NAMES[(Math.floor(girlEphem.ascendant.siderealLongitude / 30) + 6) % 12].lord;
  const girlLagnaLord = RASHI_NAMES[Math.floor(girlEphem.ascendant.siderealLongitude / 30)].lord;

  const isBirthDashaConnectedToBride =
    boyBirthDashaLord === girl7thLord ||
    boyBirthDashaLord === girlLagnaLord ||
    boyBirthDashaLord === "Jupiter" ||
    boyBirthDashaLord === "Venus";

  if (isBirthDashaConnectedToBride) d9SynScore += 15;
  const birthDashaLinkDescription = isBirthDashaConnectedToBride
    ? `Groom's birth Dasha Lord (${boyBirthDashaLord}) is harmoniously linked with Bride's Lagna/7th Lord (${girlLagnaLord}/${girl7thLord}), confirming initial soul bond.`
    : `Groom's birth Dasha Lord operates independently; connection develops through mature partnership.`;

  const crossSynastryScorePercent = Math.max(30, Math.min(98, d9SynScore));
  let d1d9Verdict: D1D9CrossSynastry["verdict"] = "Compatible (शुभ)";
  if (crossSynastryScorePercent >= 80) d1d9Verdict = "Highly Compatible (उत्कृष्ट नवांश युगल)";
  else if (crossSynastryScorePercent >= 60) d1d9Verdict = "Compatible (शुभ)";
  else if (crossSynastryScorePercent >= 45) d1d9Verdict = "Average (साधारण)";
  else d1d9Verdict = "Karmic Adjustments Required (सावधानी)";

  const d1d9Synastry: D1D9CrossSynastry = {
    boyD9LagnaRashi,
    girlD9LagnaRashi,
    d9LagnaRelationship,
    boyD9LagnaLordInGirlD9House,
    girlD9LagnaLordInBoyD9House,
    isD9LagnaLordInTrik,
    d9LagnaLordCrossVerdict,
    isMoonD1ToD9Resonance,
    moonResonanceDescription,
    d9FourthHouseHarmony,
    isBirthDashaConnectedToBride,
    birthDashaLinkDescription,
    crossSynastryScorePercent,
    verdict: d1d9Verdict,
    synthesis: `D-1 & D-9 Cross-Synastry is ${d1d9Verdict} (${crossSynastryScorePercent}%). D-9 Lagna Axis: ${d9LagnaRelationship}. ${d9LagnaLordCrossVerdict}`,
  };

  return {
    totalScore,
    maxScore: 36,
    percentage,
    verdict,
    verdictDescription,
    kootas: {
      varna,
      vashya,
      tara,
      yoni,
      grahaMaitri,
      gana,
      bhakoot,
      nadi,
    },
    boyManglik,
    girlManglik,
    manglikCompatibility: {
      isCompatible: isManglikCompatible,
      statusText: manglikText,
      description: manglikDesc,
    },
    ashtakavargaCompatibility,
    d1d9Synastry,
  };
}

export function evaluateManglikDosha(ephem: EphemerisResult): ManglikAnalysis {
  const mars = ephem.planets.Mars;
  if (!mars) {
    return {
      isManglik: false,
      severity: "None",
      doshaFromLagna: false,
      doshaFromMoon: false,
      doshaFromVenus: false,
      marsHouseFromLagna: 1,
      marsHouseFromMoon: 1,
      marsHouseFromVenus: 1,
      isCancelled: false,
      cancellationReasons: [],
    };
  }

  const marsLon = mars.siderealLongitude;
  const marsSign = Math.floor(marsLon / 30);

  const ascLon = ephem.ascendant?.siderealLongitude || 0;
  const ascSign = Math.floor(ascLon / 30);

  const moonLon = ephem.planets.Moon?.siderealLongitude || 0;
  const moonSign = Math.floor(moonLon / 30);

  const venusLon = ephem.planets.Venus?.siderealLongitude || 0;
  const venusSign = Math.floor(venusLon / 30);

  const hLagna = ((marsSign - ascSign + 12) % 12) + 1;
  const hMoon = ((marsSign - moonSign + 12) % 12) + 1;
  const hVenus = ((marsSign - venusSign + 12) % 12) + 1;

  const MANGLIK_HOUSES = [1, 2, 4, 7, 8, 12];

  const doshaFromLagna = MANGLIK_HOUSES.includes(hLagna);
  const doshaFromMoon = MANGLIK_HOUSES.includes(hMoon);
  const doshaFromVenus = MANGLIK_HOUSES.includes(hVenus);

  const isManglik = doshaFromLagna || doshaFromMoon || doshaFromVenus;

  let severity: ManglikAnalysis["severity"] = "None";
  const count = (doshaFromLagna ? 1 : 0) + (doshaFromMoon ? 1 : 0) + (doshaFromVenus ? 1 : 0);
  if (count === 3) severity = "High";
  else if (count === 2) severity = "Moderate";
  else if (count === 1) severity = "Mild";

  const cancellationReasons: string[] = [];
  if (marsSign === 0 || marsSign === 7) {
    cancellationReasons.push("Mars in own sign (Aries / Scorpio)");
  }
  if (marsSign === 9) {
    cancellationReasons.push("Mars exalted in Capricorn (उच्च का मंगल)");
  }
  if (hLagna === 1 && (marsSign === 0 || marsSign === 4)) {
    cancellationReasons.push("Mars in 1st house in Aries/Leo (Brihat Jataka)");
  }
  if (hLagna === 7 && (marsSign === 3 || marsSign === 9)) {
    cancellationReasons.push("Mars in 7th in Cancer/Capricorn exemption");
  }
  if (hLagna === 8 && (marsSign === 8 || marsSign === 11)) {
    cancellationReasons.push("Mars in 8th in Sagittarius/Pisces (Jupiter sign)");
  }

  const isCancelled = cancellationReasons.length > 0;

  return {
    isManglik,
    severity,
    doshaFromLagna,
    doshaFromMoon,
    doshaFromVenus,
    marsHouseFromLagna: hLagna,
    marsHouseFromMoon: hMoon,
    marsHouseFromVenus: hVenus,
    isCancelled,
    cancellationReasons,
  };
}
