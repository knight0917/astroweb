/**
 * Classical Brihat Parashara Hora Shastra (BPHS) Karmic Curses & Arishta Janma Shanti Engine
 * Chapters:
 * - Ch. 83: Effects of Curses in the Previous Birth (Pūrva Janma Shāpas - 8 Karmic Curses causing Childlessness / Putra Dosha)
 * - Ch. 85-96: Inauspicious Birth Diagnostics & Authentic Vedic Shāntis
 *   - Ch. 86: Amāvāsyā Janma Shānti
 *   - Ch. 87: Krishna Chaturdashi Janma (6 Sextiles)
 *   - Ch. 88: Bhadrā (Vishti Karana), Vyatīpāta & Vaidhriti Shānti
 *   - Ch. 89: Dushta Nakshatra Shānti
 *   - Ch. 90: Sūrya Sankrānti Janma Shānti
 *   - Ch. 91: Grahana Janma Shānti (Eclipse Birth)
 *   - Ch. 92: Gandānta Shānti (Lagna, Nakshatra, Tithi)
 *   - Ch. 93: Abhukta Mūla Shānti
 *   - Ch. 94: Jyeshthā Gandānta Shānti (4 Quarters)
 *   - Ch. 95: Trik Prasava Shānti (Daughter after 3 Sons / Son after 3 Daughters)
 *   - Ch. 96: Vikrita Prasava Guidance
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES, NAKSHATRAS } from "./constants";

export interface ClassicalRemedyInfo {
  title: string;
  sanskritTitle: string;
  prescription: string;
  mantra: string;
  charityOrRitual: string;
  danaItems: string[];
}

export interface BphsKarmicCurse {
  id: string;
  name: string;
  sanskritName: string;
  curseSource: string;
  isActive: boolean;
  severity: "None" | "Mild" | "Moderate" | "Severe / Veto";
  specificYogaTriggered: string;
  astrologicalEvidence: string[];
  classicalRemedy: ClassicalRemedyInfo;
}

export interface BphsBirthShanti {
  id: string;
  name: string;
  sanskritName: string;
  bphsChapter: number;
  isAfflicted: boolean;
  severity: "None" | "Mild" | "Moderate" | "Critical";
  diagnosticDetails: string;
  kinshipAffected: string;
  classicalVedicShanti: {
    ritualName: string;
    kalashaWorship: string;
    mantraRecitation: string;
    danaAndBhojana: string;
  };
}

export interface BphsKarmicShantiReport {
  hasAnyCurse: boolean;
  activeCursesCount: number;
  highestCurseSeverity: "None" | "Mild" | "Moderate" | "Severe / Veto";
  curses: BphsKarmicCurse[];
  hasAnyBirthAffliction: boolean;
  activeBirthAfflictionsCount: number;
  birthShantis: BphsBirthShanti[];
  karmicDestinyVerdict: string;
  acharyaGuidanceSummary: string;
}

const SIGN_LORDS = [
  "Mars",    // 0: Aries
  "Venus",   // 1: Taurus
  "Mercury", // 2: Gemini
  "Moon",    // 3: Cancer
  "Sun",     // 4: Leo
  "Mercury", // 5: Virgo
  "Venus",   // 6: Libra
  "Mars",    // 7: Scorpio
  "Jupiter", // 8: Sagittarius
  "Saturn",  // 9: Capricorn
  "Saturn",  // 10: Aquarius
  "Jupiter", // 11: Pisces
];

// Helper: Normalize degree to 0-360
function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

// Helper: Get sign index (0-11)
function getSignIdx(deg: number): number {
  return Math.floor(norm360(deg) / 30);
}

// Helper: Check sign-based conjunction (same sign)
function isSameSign(deg1: number, deg2: number): boolean {
  return getSignIdx(deg1) === getSignIdx(deg2);
}

// Helper: Check sign-based aspect (Graha Drishti)
function hasPlanetaryAspect(aspectingPlanet: string, aspectingLong: number, targetLong: number): boolean {
  const fromSign = getSignIdx(aspectingLong);
  const toSign = getSignIdx(targetLong);
  const dist = ((toSign - fromSign + 12) % 12) + 1; // 1 to 12

  // All planets aspect 7th house
  if (dist === 7) return true;

  // Mars aspects 4th and 8th
  if (aspectingPlanet === "Mars" && (dist === 4 || dist === 8)) return true;

  // Jupiter aspects 5th and 9th
  if (aspectingPlanet === "Jupiter" && (dist === 5 || dist === 9)) return true;

  // Saturn aspects 3rd and 10th
  if (aspectingPlanet === "Saturn" && (dist === 3 || dist === 10)) return true;

  // Rahu/Ketu trinal aspects (5th and 9th)
  if ((aspectingPlanet === "Rahu" || aspectingPlanet === "Ketu") && (dist === 5 || dist === 9)) return true;

  return false;
}

// Helper: Check if a sign or planet receives malefic aspect
function receivesMaleficAspect(targetLong: number, planets: Record<string, { siderealLongitude: number }>): boolean {
  const malefics = ["Mars", "Saturn", "Rahu", "Ketu"];
  return malefics.some((m) => planets[m] && hasPlanetaryAspect(m, planets[m].siderealLongitude, targetLong));
}

// Helper: Get house number (1 to 12) from Lagna
function getHouseFromLagna(planetLong: number, ascLong: number): number {
  const pSign = getSignIdx(planetLong);
  const aSign = getSignIdx(ascLong);
  return ((pSign - aSign + 12) % 12) + 1;
}

// Helper: Get sign index of a specific Bhava from Lagna
function getBhavaSign(ascLong: number, houseNum: number): number {
  const aSign = getSignIdx(ascLong);
  return (aSign + houseNum - 1) % 12;
}

// Helper: Get house lord name
function getBhavaLord(ascLong: number, houseNum: number): string {
  const signIdx = getBhavaSign(ascLong, houseNum);
  return SIGN_LORDS[signIdx];
}

/**
 * Evaluates BPHS Chapter 83: The 8 Pūrva Janma Shāpas
 */
export function evaluateBphsKarmicCurses(natal: EphemerisResult): BphsKarmicCurse[] {
  const p = natal.planets;
  const ascLong = natal.ascendant.siderealLongitude;

  const sunLong = p.Sun.siderealLongitude;
  const moonLong = p.Moon.siderealLongitude;
  const marsLong = p.Mars.siderealLongitude;
  const mercLong = p.Mercury.siderealLongitude;
  const jupLong = p.Jupiter.siderealLongitude;
  const venLong = p.Venus.siderealLongitude;
  const satLong = p.Saturn.siderealLongitude;
  const rahuLong = p.Rahu.siderealLongitude;
  const ketuLong = p.Ketu.siderealLongitude;

  const h5Lord = getBhavaLord(ascLong, 5);
  const h5LordLong = p[h5Lord]?.siderealLongitude ?? 0;
  const h5SignIdx = getBhavaSign(ascLong, 5);
  const h5SignCenter = h5SignIdx * 30 + 15;

  const lagnaLord = getBhavaLord(ascLong, 1);
  const lagnaLordLong = p[lagnaLord]?.siderealLongitude ?? 0;

  const curses: BphsKarmicCurse[] = [];

  // ------------------------------------------------------------------------------------------------
  // 1. SARPA SHĀPA (सर्प शाप - Serpent's Curse, BPHS Ch. 83, Shlokas 9-16)
  // ------------------------------------------------------------------------------------------------
  let sarpaActive = false;
  let sarpaSeverity: "None" | "Mild" | "Moderate" | "Severe / Veto" = "None";
  const sarpaEvidence: string[] = [];
  let sarpaYoga = "";

  const rahuIn5 = getHouseFromLagna(rahuLong, ascLong) === 5;
  const marsAspects5 = hasPlanetaryAspect("Mars", marsLong, h5SignCenter);
  const h5LordWithRahu = isSameSign(h5LordLong, rahuLong);
  const moonIn5 = getHouseFromLagna(moonLong, ascLong) === 5;
  const satAspectsMoon = hasPlanetaryAspect("Saturn", satLong, moonLong);
  const jupWithRahu = isSameSign(jupLong, rahuLong);
  const lagnaLordWithMars = isSameSign(lagnaLordLong, marsLong);
  const h5IsMarsSign = h5SignIdx === 0 || h5SignIdx === 7;

  if (rahuIn5 && marsAspects5) {
    sarpaActive = true;
    sarpaSeverity = "Severe / Veto";
    sarpaYoga = "Rahu in 5th house aspected by Mars (Ch. 83, Shloka 9)";
    sarpaEvidence.push("Rahu resides in the 5th Bhava of progeny");
    sarpaEvidence.push("Mars casts acute malefic aspect on the 5th Bhava");
  } else if (h5LordWithRahu && moonIn5 && satAspectsMoon) {
    sarpaActive = true;
    sarpaSeverity = "Severe / Veto";
    sarpaYoga = "5th Lord conjunct Rahu, Moon in 5th aspected by Saturn (Ch. 83, Shloka 10)";
    sarpaEvidence.push(`5th Lord (${h5Lord}) is afflicted by Rahu`);
    sarpaEvidence.push("Moon in 5th Bhava is under Saturn's severe aspect");
  } else if (jupWithRahu && lagnaLordWithMars) {
    sarpaActive = true;
    sarpaSeverity = "Moderate";
    sarpaYoga = "Jupiter (Putrakaraka) conjunct Rahu with Lagnesha conjunct Mars (Ch. 83, Shloka 11)";
    sarpaEvidence.push("Jupiter forms Guru-Chandal yoga with Rahu");
    sarpaEvidence.push(`Lagnesha (${lagnaLord}) is hemmed or conjunct Mars`);
  } else if (h5IsMarsSign && (h5LordWithRahu || isSameSign(rahuLong, h5SignCenter))) {
    sarpaActive = true;
    sarpaSeverity = "Moderate";
    sarpaYoga = "5th house is Aries/Scorpio with Rahu influence (Ch. 83, Shloka 14)";
    sarpaEvidence.push("5th Bhava falls in Mars's sign with nodal affliction");
  } else if (rahuIn5) {
    sarpaActive = true;
    sarpaSeverity = "Mild";
    sarpaYoga = "Rahu in 5th Bhava causing subtle Sarpa Dosha";
    sarpaEvidence.push("Rahu in 5th house requires classical Naga pacification");
  }

  curses.push({
    id: "sarpa_shapa",
    name: "Sarpa Shāpa (Curse of the Serpents)",
    sanskritName: "सर्प शाप",
    curseSource: "Wrath of Nagas / Serpents caused by harming a serpent or destroying a snake nest in past incarnation.",
    isActive: sarpaActive,
    severity: sarpaSeverity,
    specificYogaTriggered: sarpaYoga || "No active Sarpa Shāpa detected",
    astrologicalEvidence: sarpaEvidence,
    classicalRemedy: {
      title: "Nāgabali & Sarpa Pratishthā Vidhāna (BPHS Ch. 83, Shlokas 17-21)",
      sanskritTitle: "नागबलि एवं सुवर्ण सर्प प्रतिष्ठा",
      prescription: "Craft a golden idol of Nāgarāja (King of Serpents) according to capacity, consecrate it with Vedic hymns, perform Prāna Pratishthā, and donate it along with land, cow, or sesame seeds to a pious scholar.",
      mantra: "ॐ नवकुलाय विद्महे विषदन्ताय धीमहि तन्नो सर्पः प्रचोदयात् ॥ (Om Navakulāya Vidmahe Vishadantāya Dhīmahi Tanno Sarpah Prachodayāt)",
      charityOrRitual: "Perform Nāgabali or Sarpa Pratishthā at Kukke Subramanya, Kalahasti, or Trimbakeshwar; plant a peepal tree; feed milk and offer worship on Nag Panchami.",
      danaItems: ["Golden Serpent Idol", "Cow (Godāna)", "Black Sesame Seeds", "Bronze Vessel filled with Ghee"],
    },
  });

  // ------------------------------------------------------------------------------------------------
  // 2. PITRI SHĀPA (पितृ शाप - Father's Curse, BPHS Ch. 83, Shlokas 22-31)
  // ------------------------------------------------------------------------------------------------
  let pitriActive = false;
  let pitriSeverity: "None" | "Mild" | "Moderate" | "Severe / Veto" = "None";
  const pitriEvidence: string[] = [];
  let pitriYoga = "";

  const sunIn5 = getHouseFromLagna(sunLong, ascLong) === 5;
  const sunSignIdx = getSignIdx(sunLong);
  const isSunDebilitated = sunSignIdx === 6; // Libra
  const sunWithSat = isSameSign(sunLong, satLong);
  const sunWithRahu = isSameSign(sunLong, rahuLong);
  const sunWithMars = isSameSign(sunLong, marsLong);
  const h9Lord = getBhavaLord(ascLong, 9);
  const h9LordLong = p[h9Lord]?.siderealLongitude ?? 0;
  const h5LordWithSun = isSameSign(h5LordLong, sunLong);
  const h5LordInTrik = [6, 8, 12].includes(getHouseFromLagna(h5LordLong, ascLong));

  if (sunIn5 && (isSunDebilitated || sunWithSat || sunWithRahu)) {
    pitriActive = true;
    pitriSeverity = "Severe / Veto";
    pitriYoga = "Sun in 5th house debilitated or afflicted by Saturn/Rahu (Ch. 83, Shlokas 22-23)";
    pitriEvidence.push("Sun (Pitrukaraka) occupies 5th Bhava under severe malefic conjunction/debilitation");
    pitriEvidence.push("Ancestral solar vitality is obstructed in progeny house");
  } else if (h5Lord === "Sun" && (sunWithSat || sunWithRahu || sunWithMars) && h5LordInTrik) {
    pitriActive = true;
    pitriSeverity = "Severe / Veto";
    pitriYoga = "Sun as 5th Lord afflicted in Dusthana (Ch. 83, Shloka 24)";
    pitriEvidence.push(`Sun as 5th Lord is hemmed in ${getHouseFromLagna(sunLong, ascLong)}th house`);
  } else if (h5LordWithSun && receivesMaleficAspect(h5LordLong, p)) {
    pitriActive = true;
    pitriSeverity = "Moderate";
    pitriYoga = "5th Lord conjunct Sun receiving malefic aspect (Ch. 83, Shloka 25)";
    pitriEvidence.push(`5th Lord (${h5Lord}) is combust/conjunct Sun and aspected by malefics`);
  } else if (sunIn5 && receivesMaleficAspect(sunLong, p)) {
    pitriActive = true;
    pitriSeverity = "Moderate";
    pitriYoga = "Sun in 5th Bhava aspected by Mars or Saturn (Ch. 83, Shloka 26)";
    pitriEvidence.push("Sun receives malefic rays in 5th Bhava");
  } else if (isSameSign(h9LordLong, rahuLong) && h5LordInTrik) {
    pitriActive = true;
    pitriSeverity = "Mild";
    pitriYoga = "9th Lord afflicted by Rahu with 5th Lord in Dusthana";
    pitriEvidence.push("Pitru Bhava lord afflicted by Rahu");
  }

  curses.push({
    id: "pitri_shapa",
    name: "Pitri Shāpa (Curse of the Father / Ancestors)",
    sanskritName: "पितृ शाप",
    curseSource: "Displeasure of father or unfulfilled ancestral rites (Pitru Dosha) from previous birth.",
    isActive: pitriActive,
    severity: pitriSeverity,
    specificYogaTriggered: pitriYoga || "No active Pitri Shāpa detected",
    astrologicalEvidence: pitriEvidence,
    classicalRemedy: {
      title: "Pinda Dāna, Gayā Srāddha & Sūrya Yajna (BPHS Ch. 83, Shlokas 32-35)",
      sanskritTitle: "पिण्डदान, गयाश्राद्ध एवं हरिवंश श्रवण",
      prescription: "Perform Pinda Dana and Shraddha at Gaya Kshetra; feed 101 Brahmins; sponsor recitation of Harivamsa Purana; perform daily Surya Arghya with Gayatri Japa.",
      mantra: "ॐ पितृभ्यः स्वधायिभ्यः स्वधा नमः। पिता स्वर्गः पिता धर्मः पितृहि परमं तपः ॥",
      charityOrRitual: "Perform Gayā Srāddha, donate a milch cow (Godāna), bronze utensil filled with clarified butter, and support an orphanage or elder care home.",
      danaItems: ["Milch Cow with Calf", "Copper Vessel with Wheat", "Gold Coin", "Sesame Seeds and Honey"],
    },
  });

  // ------------------------------------------------------------------------------------------------
  // 3. MATRI SHĀPA (मातृ शाप - Mother's Curse, BPHS Ch. 83, Shlokas 36-44)
  // ------------------------------------------------------------------------------------------------
  let matriActive = false;
  let matriSeverity: "None" | "Mild" | "Moderate" | "Severe / Veto" = "None";
  const matriEvidence: string[] = [];
  let matriYoga = "";

  const moonIn8 = getHouseFromLagna(moonLong, ascLong) === 8;
  const moonSignIdx = getSignIdx(moonLong);
  const isMoonDebilitated = moonSignIdx === 7; // Scorpio
  const moonWithSat = isSameSign(moonLong, satLong);
  const moonWithRahu = isSameSign(moonLong, rahuLong);
  const moonWithMars = isSameSign(moonLong, marsLong);
  const h4Lord = getBhavaLord(ascLong, 4);
  const h4LordLong = p[h4Lord]?.siderealLongitude ?? 0;
  const h4LordWithH5Lord = isSameSign(h4LordLong, h5LordLong);

  if (moonIn5 && (isMoonDebilitated || moonWithSat || moonWithRahu)) {
    matriActive = true;
    matriSeverity = "Severe / Veto";
    matriYoga = "Moon in 5th house debilitated or afflicted by Saturn/Rahu (Ch. 83, Shloka 36)";
    matriEvidence.push("Moon (Matrukaraka) in 5th Bhava severely afflicted");
  } else if (h5Lord === "Moon" && (isMoonDebilitated || moonIn8 || moonWithSat)) {
    matriActive = true;
    matriSeverity = "Severe / Veto";
    matriYoga = "Moon as 5th Lord debilitated or placed in 8th house (Ch. 83, Shloka 37)";
    matriEvidence.push("5th Lord Moon is severely afflicted in 8th Bhava or Scorpio");
  } else if (h4LordWithH5Lord && h5LordInTrik) {
    matriActive = true;
    matriSeverity = "Moderate";
    matriYoga = "4th Lord and 5th Lord conjunct in Dusthana (6, 8, 12) (Ch. 83, Shloka 38)";
    matriEvidence.push(`4th Lord (${h4Lord}) and 5th Lord (${h5Lord}) conjunct in ${getHouseFromLagna(h5LordLong, ascLong)}th Bhava`);
  } else if (moonIn5 && marsAspects5 && hasPlanetaryAspect("Saturn", satLong, h5SignCenter)) {
    matriActive = true;
    matriSeverity = "Moderate";
    matriYoga = "Moon in 5th receiving joint aspects of Mars and Saturn (Ch. 83, Shloka 39)";
    matriEvidence.push("Moon in 5th caught in dual Mars-Saturn crossfire");
  } else if (isSameSign(h4LordLong, satLong) && moonIn8) {
    matriActive = true;
    matriSeverity = "Mild";
    matriYoga = "4th Lord afflicted by Saturn with Moon in 8th Bhava";
    matriEvidence.push("Matru Bhava lord afflicted with weak Moon");
  }

  curses.push({
    id: "matri_shapa",
    name: "Matri Shāpa (Curse of the Mother)",
    sanskritName: "मातृ शाप",
    curseSource: "Distress or grief inflicted upon mother or maternal figures in a past life.",
    isActive: matriActive,
    severity: matriSeverity,
    specificYogaTriggered: matriYoga || "No active Matri Shāpa detected",
    astrologicalEvidence: matriEvidence,
    classicalRemedy: {
      title: "Setu Snāna & Kamadhenu Pratishthā (BPHS Ch. 83, Shlokas 45-48)",
      sanskritTitle: "सेतुस्नान, कामधेनु दान एवं गायत्री जप",
      prescription: "Undertake pilgrimage and sacred bath at Setu (Rameswaram); donate a silver cow (Kamadhenu) filled with milk or ghee; sponsor Kanya Bhojana and serve elder mothers.",
      mantra: "ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे ॥ मातृदेवो भव।",
      charityOrRitual: "Perform holy bath at Rameswaram; donate silver Kamadhenu idol with calf, distribute white sweets, milk, and clothes to elderly mothers.",
      danaItems: ["Silver Cow with Calf", "Silver Vessel with Milk", "White Silk Sarees", "Pearl Ornament"],
    },
  });

  // ------------------------------------------------------------------------------------------------
  // 4. BHRATRI SHĀPA (भ्रातृ शाप - Brother's Curse, BPHS Ch. 83, Shlokas 49-57)
  // ------------------------------------------------------------------------------------------------
  let bhratriActive = false;
  let bhratriSeverity: "None" | "Mild" | "Moderate" | "Severe / Veto" = "None";
  const bhratriEvidence: string[] = [];
  let bhratriYoga = "";

  const h3Lord = getBhavaLord(ascLong, 3);
  const h3LordLong = p[h3Lord]?.siderealLongitude ?? 0;
  const marsIn5 = getHouseFromLagna(marsLong, ascLong) === 5;
  const h3WithH5InTrik = isSameSign(h3LordLong, h5LordLong) && [6, 8, 12].includes(getHouseFromLagna(h5LordLong, ascLong));
  const marsAfflicted = isSameSign(marsLong, satLong) || isSameSign(marsLong, rahuLong);

  if (isSameSign(h3LordLong, h5LordLong) && marsIn5 && marsAfflicted) {
    bhratriActive = true;
    bhratriSeverity = "Severe / Veto";
    bhratriYoga = "3rd and 5th Lords conjunct, Mars in 5th with Saturn/Rahu (Ch. 83, Shloka 49)";
    bhratriEvidence.push("3rd Lord and 5th Lord conjunct with severely afflicted Mars in 5th");
  } else if (h5Lord === "Mars" && (isSameSign(marsLong, satLong) || isSameSign(marsLong, rahuLong)) && h5LordInTrik) {
    bhratriActive = true;
    bhratriSeverity = "Severe / Veto";
    bhratriYoga = "Mars as 5th Lord afflicted by Saturn/Rahu in Dusthana (Ch. 83, Shloka 50)";
    bhratriEvidence.push("Mars as 5th Lord is tormented by malefics in Dusthana");
  } else if (marsIn5 && hasPlanetaryAspect("Saturn", satLong, marsLong)) {
    bhratriActive = true;
    bhratriSeverity = "Moderate";
    bhratriYoga = "Mars in 5th Bhava aspected by Saturn (Ch. 83, Shloka 51)";
    bhratriEvidence.push("Mars occupies progeny house under direct Saturnian gaze");
  } else if (isSameSign(h3LordLong, rahuLong) && marsIn5) {
    bhratriActive = true;
    bhratriSeverity = "Moderate";
    bhratriYoga = "3rd Lord with Rahu and Mars in 5th Bhava (Ch. 83, Shloka 52)";
    bhratriEvidence.push("Co-born significators heavily afflicted in 5th house");
  }

  curses.push({
    id: "bhratri_shapa",
    name: "Bhratri Shāpa (Curse of the Brother / Co-borns)",
    sanskritName: "भ्रातृ शाप",
    curseSource: "Betrayal, property usurpation, or extreme hostility toward siblings in previous life.",
    isActive: bhratriActive,
    severity: bhratriSeverity,
    specificYogaTriggered: bhratriYoga || "No active Bhratri Shāpa detected",
    astrologicalEvidence: bhratriEvidence,
    classicalRemedy: {
      title: "Vishnu Sahasranāma & Harivamsa Purana (BPHS Ch. 83, Shlokas 58-61)",
      sanskritTitle: "हरिवंश श्रवण एवं भ्रातृ सेवा",
      prescription: "Listen to or sponsor the recitation of Harivamsa Purana; perform daily chanting of Vishnu Sahasranama; gift agricultural land or red coral to righteous persons.",
      mantra: "ॐ नमो भगवते वासुदेवाय ॥ ॐ क्लीं कृष्णाय गोविंदाय गोपीजनवल्लभाय स्वाहा ॥",
      charityOrRitual: "Recite Harivamsa Purana with siblings; donate red grains (masoor dal), jaggery, copper vessels, and establish peaceful harmony with co-borns.",
      danaItems: ["Red Coral Gemstone", "Copper Pot with Jaggery", "Red Cloth", "Land or Farm Produce"],
    },
  });

  // ------------------------------------------------------------------------------------------------
  // 5. MĀTULA SHĀPA (मातुल शाप - Maternal Uncle's Curse, BPHS Ch. 83, Shlokas 62-67)
  // ------------------------------------------------------------------------------------------------
  let matulaActive = false;
  let matulaSeverity: "None" | "Mild" | "Moderate" | "Severe / Veto" = "None";
  const matulaEvidence: string[] = [];
  let matulaYoga = "";

  const mercIn5 = getHouseFromLagna(mercLong, ascLong) === 5;
  const mercWithMars = isSameSign(mercLong, marsLong);
  const mercWithRahu = isSameSign(mercLong, rahuLong);
  const mercWithSat = isSameSign(mercLong, satLong);

  if (mercIn5 && isSameSign(mercLong, jupLong) && (mercWithMars || mercWithRahu)) {
    matulaActive = true;
    matulaSeverity = "Severe / Veto";
    matulaYoga = "Mercury & Jupiter in 5th afflicted by Mars/Rahu (Ch. 83, Shloka 62)";
    matulaEvidence.push("Mercury (Matula significator) and Jupiter afflicted in 5th house");
  } else if (h5Lord === "Mercury" && (mercWithMars || mercWithSat) && h5LordInTrik) {
    matulaActive = true;
    matulaSeverity = "Moderate";
    matulaYoga = "Mercury as 5th Lord conjunct Mars/Saturn in Dusthana (Ch. 83, Shloka 63)";
    matulaEvidence.push("Mercury as 5th Lord placed in 6th/8th/12th with malefic associates");
  } else if (mercIn5 && receivesMaleficAspect(mercLong, p)) {
    matulaActive = true;
    matulaSeverity = "Mild";
    matulaYoga = "Mercury in 5th receiving malefic aspect";
    matulaEvidence.push("Mercury in 5th under malefic affliction");
  }

  curses.push({
    id: "matula_shapa",
    name: "Mātula Shāpa (Curse of the Maternal Uncle)",
    sanskritName: "मातुल शाप",
    curseSource: "Cheating, insulting, or depriving maternal uncle or mother's family in past life.",
    isActive: matulaActive,
    severity: matulaSeverity,
    specificYogaTriggered: matulaYoga || "No active Mātula Shāpa detected",
    astrologicalEvidence: matulaEvidence,
    classicalRemedy: {
      title: "Vishnu Idol Consecration & Tulsi Aradhana (BPHS Ch. 83, Shlokas 68-71)",
      sanskritTitle: "विष्णु मूर्ति प्रतिष्ठा एवं तुलसी रोपण",
      prescription: "Install a deity of Lord Vishnu; plant basil (Tulsi) groves or develop clean water wells for travelers; donate green moong and emerald ornaments.",
      mantra: "ॐ बुं बुधाय नमः ॥ ॐ विष्णवे नमः ॥",
      charityOrRitual: "Plant and nurture a sacred Tulsi garden; donate green clothes, emerald or peridot, bronze utensils, and seek blessings from maternal uncle.",
      danaItems: ["Emerald Gemstone", "Bronze Thali with Moong Dal", "Green Silk Garments", "Tulsi Saplings"],
    },
  });

  // ------------------------------------------------------------------------------------------------
  // 6. BRĀHMANA SHĀPA (ब्राह्मण शाप - Preceptor / Brahmin's Curse, BPHS Ch. 83, Shlokas 72-81)
  // ------------------------------------------------------------------------------------------------
  let brahmanaActive = false;
  let brahmanaSeverity: "None" | "Mild" | "Moderate" | "Severe / Veto" = "None";
  const brahmanaEvidence: string[] = [];
  let brahmanaYoga = "";

  const jupIn5 = getHouseFromLagna(jupLong, ascLong) === 5;
  const jupSignIdx = getSignIdx(jupLong);
  const isJupInSatMarsSign = [0, 7, 9, 10].includes(jupSignIdx); // Aries, Scorpio, Cap, Aqua
  const sunAspectsJup = hasPlanetaryAspect("Sun", sunLong, jupLong);
  const satAspectsJup = hasPlanetaryAspect("Saturn", satLong, jupLong);
  const jupWithRahuIn5or9 = isSameSign(jupLong, rahuLong) && [5, 9].includes(getHouseFromLagna(jupLong, ascLong));

  if (jupIn5 && isJupInSatMarsSign && (sunAspectsJup || satAspectsJup)) {
    brahmanaActive = true;
    brahmanaSeverity = "Severe / Veto";
    brahmanaYoga = "Jupiter in 5th in sign of Mars/Saturn aspected by Sun/Saturn (Ch. 83, Shloka 72)";
    brahmanaEvidence.push("Jupiter in 5th placed in hostile sign under malefic aspect");
  } else if (jupWithRahuIn5or9 && satAspectsJup) {
    brahmanaActive = true;
    brahmanaSeverity = "Severe / Veto";
    brahmanaYoga = "Guru Chandal in 5th/9th aspected by Saturn (Ch. 83, Shloka 73)";
    brahmanaEvidence.push("Jupiter conjunct Rahu in Dharma/Putra trine aspected by Saturn");
  } else if (h5Lord === "Jupiter" && h5LordInTrik && isSameSign(jupLong, rahuLong)) {
    brahmanaActive = true;
    brahmanaSeverity = "Moderate";
    brahmanaYoga = "5th Lord Jupiter afflicted with Rahu in Dusthana (Ch. 83, Shloka 74)";
    brahmanaEvidence.push("Jupiter as 5th Lord severely afflicted");
  } else if (jupIn5 && (isSameSign(jupLong, rahuLong) || isSameSign(jupLong, ketuLong))) {
    brahmanaActive = true;
    brahmanaSeverity = "Moderate";
    brahmanaYoga = "Jupiter afflicted by lunar nodes in 5th house";
    brahmanaEvidence.push("Jupiter nodal affliction in progeny house");
  }

  curses.push({
    id: "brahmana_shapa",
    name: "Brāhmana Shāpa (Curse of the Guru / Preceptor)",
    sanskritName: "ब्राह्मण शाप",
    curseSource: "Disrespecting spiritual teachers, violating oaths to mentors, or harming pious scholars in previous birth.",
    isActive: brahmanaActive,
    severity: brahmanaSeverity,
    specificYogaTriggered: brahmanaYoga || "No active Brāhmana Shāpa detected",
    astrologicalEvidence: brahmanaEvidence,
    classicalRemedy: {
      title: "Chāndrāyana Vrata & Swarna Dāna (BPHS Ch. 83, Shlokas 82-86)",
      sanskritTitle: "चान्द्रायण व्रत, सुवर्ण दान एवं गुरु पूजा",
      prescription: "Observe the sacred Chandrayana Vrata; donate gold, yellow sapphire, or cows to Vedic preceptors; sponsor Vedic pathashalas and provide scholarships to deserving students.",
      mantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः ॥ ॐ बृं बृहस्पतये नमः ॥",
      charityOrRitual: "Feed learned Vedic scholars (Brahma Bhojana); donate gold coins, yellow garments, saffron, raw turmeric, and provide textbooks to poor students.",
      danaItems: ["Gold Coin / Ornament", "Yellow Sapphire Gemstone", "Yellow Silk Robes", "Vedic Scriptures & Textbooks"],
    },
  });

  // ------------------------------------------------------------------------------------------------
  // 7. PATNĪ SHĀPA (पत्नी शाप - Wife / Spouse's Curse, BPHS Ch. 83, Shlokas 87-94)
  // ------------------------------------------------------------------------------------------------
  let patniActive = false;
  let patniSeverity: "None" | "Mild" | "Moderate" | "Severe / Veto" = "None";
  const patniEvidence: string[] = [];
  let patniYoga = "";

  const h7Lord = getBhavaLord(ascLong, 7);
  const h7LordLong = p[h7Lord]?.siderealLongitude ?? 0;
  const venIn5 = getHouseFromLagna(venLong, ascLong) === 5;
  const h7LordIn5 = getHouseFromLagna(h7LordLong, ascLong) === 5;
  const satAspects7 = hasPlanetaryAspect("Saturn", satLong, h7LordLong);
  const venWithSatOrRahu = isSameSign(venLong, satLong) || isSameSign(venLong, rahuLong);

  if (h7LordIn5 && (satAspects7 || isSameSign(h7LordLong, rahuLong))) {
    patniActive = true;
    patniSeverity = "Severe / Veto";
    patniYoga = "7th Lord in 5th aspected by Saturn or conjunct Rahu (Ch. 83, Shloka 87)";
    patniEvidence.push("7th Lord (Kalatra) in 5th house afflicted by Saturn/Rahu");
  } else if (venIn5 && venWithSatOrRahu && receivesMaleficAspect(venLong, p)) {
    patniActive = true;
    patniSeverity = "Severe / Veto";
    patniYoga = "Venus in 5th afflicted by Saturn/Rahu and malefic aspect (Ch. 83, Shloka 88)";
    patniEvidence.push("Venus (Spouse Karaka) heavily damaged in 5th Bhava");
  } else if (isSameSign(h5LordLong, h7LordLong) && h5LordInTrik) {
    patniActive = true;
    patniSeverity = "Moderate";
    patniYoga = "5th Lord and 7th Lord conjunct in Dusthana (Ch. 83, Shloka 89)";
    patniEvidence.push("5th and 7th Lords conjunct in 6th/8th/12th house");
  } else if (venIn5 && receivesMaleficAspect(venLong, p)) {
    patniActive = true;
    patniSeverity = "Mild";
    patniYoga = "Venus in 5th receiving malefic aspect";
    patniEvidence.push("Venus under malefic influence in 5th Bhava");
  }

  curses.push({
    id: "patni_shapa",
    name: "Patnī Shāpa (Curse of the Spouse)",
    sanskritName: "पत्नी शाप",
    curseSource: "Abandoning, abusing, or causing untimely distress/death to lawful spouse in previous incarnation.",
    isActive: patniActive,
    severity: patniSeverity,
    specificYogaTriggered: patniYoga || "No active Patnī Shāpa detected",
    astrologicalEvidence: patniEvidence,
    classicalRemedy: {
      title: "Kanyā Dāna Assistance & Lakshmi-Narayana Hridayam (BPHS Ch. 83, Shlokas 95-98)",
      sanskritTitle: "कन्यादान सहायता एवं लक्ष्मी-नारायण पूजन",
      prescription: "Assist in funding marriage ceremonies for impoverished girls (Kanyadana); sponsor gold Mangalasutra; perform Lakshmi-Narayana Hridayam recitation and Godana.",
      mantra: "ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः ॥ ॐ नमो नारायणाय ॥",
      charityOrRitual: "Provide financial assistance for solemnizing wedding of poor bride; gift bridal clothing, silver ornaments, and donate a milch cow.",
      danaItems: ["Gold Mangalasutra / Ring", "Bridal Silk Sarees", "Silver Utensils", "Milch Cow with Calf"],
    },
  });

  // ------------------------------------------------------------------------------------------------
  // 8. PRETA SHĀPA (प्रेत शाप - Departed Spirit / Ghost Curse, BPHS Ch. 83, Shlokas 99-106)
  // ------------------------------------------------------------------------------------------------
  let pretaActive = false;
  let pretaSeverity: "None" | "Mild" | "Moderate" | "Severe / Veto" = "None";
  const pretaEvidence: string[] = [];
  let pretaYoga = "";

  const satIn5 = getHouseFromLagna(satLong, ascLong) === 5;
  const rahuIn1 = getHouseFromLagna(rahuLong, ascLong) === 1;
  const jupIn8 = getHouseFromLagna(jupLong, ascLong) === 8;

  if (satIn5 && sunIn5) {
    pretaActive = true;
    pretaSeverity = "Severe / Veto";
    pretaYoga = "Saturn and Sun together in 5th Bhava (Ch. 83, Shloka 99)";
    pretaEvidence.push("Saturn and Sun (mortal enemies) occupy 5th house creating Preta Dosha");
  } else if (rahuIn1 && satIn5 && jupIn8) {
    pretaActive = true;
    pretaSeverity = "Severe / Veto";
    pretaYoga = "Rahu in Lagna, Saturn in 5th, and Jupiter in 8th (Ch. 83, Shloka 100)";
    pretaEvidence.push("Fatal triad: Rahu in Lagna, Saturn in 5th, Jupiter in 8th");
  } else if (satIn5 && isSameSign(satLong, ketuLong)) {
    pretaActive = true;
    pretaSeverity = "Moderate";
    pretaYoga = "Saturn and Ketu conjunct in 5th Bhava (Ch. 83, Shloka 101)";
    pretaEvidence.push("Saturn-Ketu conjunction indicates unfulfilled funeral rites of ancestors");
  } else if (satIn5 && (isSameSign(satLong, rahuLong) || receivesMaleficAspect(satLong, p))) {
    pretaActive = true;
    pretaSeverity = "Moderate";
    pretaYoga = "Afflicted Saturn in 5th house";
    pretaEvidence.push("Saturn in 5th receiving malefic association");
  }

  curses.push({
    id: "preta_shapa",
    name: "Preta Shāpa (Curse of Departed Spirits / Unperformed Funeral Rites)",
    sanskritName: "प्रेत शाप",
    curseSource: "Neglecting the funeral ceremonies (Antyeshti) or annual Shraddha of family members who died unnatural deaths in past life.",
    isActive: pretaActive,
    severity: pretaSeverity,
    specificYogaTriggered: pretaYoga || "No active Preta Shāpa detected",
    astrologicalEvidence: pretaEvidence,
    classicalRemedy: {
      title: "Tripindi Srāddha & Rudrābhisheka (BPHS Ch. 83, Shlokas 107-111)",
      sanskritTitle: "त्रिपिण्डी श्राद्ध, नारायणबलि एवं रुद्राभिषेक",
      prescription: "Perform Tripindi Shraddha and Narayanabali at holy pilgrimage sites (Gaya, Kashi, or Trimbakeshwar); perform Rudrabhisheka with Mahamrityunjaya Japa.",
      mantra: "ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि तन्नो रुद्रः प्रचोदयात् ॥ ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।",
      charityOrRitual: "Perform Tripindi Shraddha at Trimbakeshwar or Gaya; donate black cow or black blankets to the needy; feed crows, fish, and cows daily.",
      danaItems: ["Black Cow / Black Sesame", "Warm Blankets for Needy", "Iron Utensils", "Mustard Oil & Iron Lamp"],
    },
  });

  return curses;
}

/**
 * Evaluates BPHS Chapters 85-96: Inauspicious Births & Vedic Shāntis
 */
export function evaluateBphsBirthShantis(natal: EphemerisResult): BphsBirthShanti[] {
  const p = natal.planets;
  const ascLong = norm360(natal.ascendant.siderealLongitude);
  const sunLong = norm360(p.Sun.siderealLongitude);
  const moonLong = norm360(p.Moon.siderealLongitude);
  const rahuLong = norm360(p.Rahu.siderealLongitude);
  const ketuLong = norm360(p.Ketu.siderealLongitude);

  const birthShantis: BphsBirthShanti[] = [];

  // ------------------------------------------------------------------------------------------------
  // 1. GANDĀNTA SHĀNTI (गण्डान्त जनन - BPHS Ch. 92)
  // Triple Gandanta: Nakshatra, Lagna, Tithi
  // ------------------------------------------------------------------------------------------------
  let isNakshatraGandanta = false;
  let isLagnaGandanta = false;
  let gandantaDetails: string[] = [];
  let gandantaSeverity: "None" | "Mild" | "Moderate" | "Critical" = "None";

  // Critical Nakshatra junctions (Water to Fire signs):
  // Revati (346°40' - 360°00') to Ashwini (000°00' - 013°20') -> Boundary: 356°40' to 003°20'
  // Ashlesha (106°40' - 120°00') to Magha (120°00' - 133°20') -> Boundary: 116°40' to 123°20'
  // Jyeshtha (226°40' - 240°00') to Mula (240°00' - 253°20') -> Boundary: 236°40' to 243°20'
  const inRevatiAshwini = moonLong >= 356.666 || moonLong <= 3.333;
  const inAshleshaMagha = moonLong >= 116.666 && moonLong <= 123.333;
  const inJyeshthaMula = moonLong >= 236.666 && moonLong <= 243.333;

  if (inRevatiAshwini || inAshleshaMagha || inJyeshthaMula) {
    isNakshatraGandanta = true;
    gandantaSeverity = "Critical";
    if (inRevatiAshwini) gandantaDetails.push("Moon at Revati-Ashwini junction (Meena-Mesha sandhi)");
    if (inAshleshaMagha) gandantaDetails.push("Moon at Ashlesha-Magha junction (Karka-Simha sandhi)");
    if (inJyeshthaMula) gandantaDetails.push("Moon at Jyeshtha-Mula junction (Vrischika-Dhanu sandhi)");
  }

  // Lagna Gandanta: First 1/2 degree of Fire signs (0-0.5°) or last 1/2 degree of Water signs (29.5-30°)
  const ascSign = Math.floor(ascLong / 30);
  const ascDegInSign = ascLong % 30;
  const isWaterSign = ascSign === 3 || ascSign === 7 || ascSign === 11;
  const isFireSign = ascSign === 0 || ascSign === 4 || ascSign === 8;

  if ((isWaterSign && ascDegInSign >= 29.5) || (isFireSign && ascDegInSign <= 0.5)) {
    isLagnaGandanta = true;
    if (gandantaSeverity === "None") gandantaSeverity = "Moderate";
    gandantaDetails.push(`Lagna Gandanta: Ascendant at critical 30-arcminute junction (${RASHI_NAMES[ascSign]} ${ascDegInSign.toFixed(2)}°)`);
  }

  birthShantis.push({
    id: "gandanta_shanti",
    name: "Gandānta Janma Shānti (Triple Junction Affliction)",
    sanskritName: "गण्डान्त जनन शान्ति",
    bphsChapter: 92,
    isAfflicted: isNakshatraGandanta || isLagnaGandanta,
    severity: gandantaSeverity,
    diagnosticDetails: gandantaDetails.length > 0 ? gandantaDetails.join("; ") : "No Gandānta affliction detected.",
    kinshipAffected: isNakshatraGandanta ? "Infant longevity, maternal health, and paternal fortune" : "Individual vitality and temperament",
    classicalVedicShanti: {
      ritualName: "Gandānta Mahā-Shānti Vidhāna (BPHS Ch. 92, Shlokas 8-20)",
      kalashaWorship: "Establish 27 sacred water kalashas filled with herbal waters (Sarvaushadhi) and earth from 7 holy places; install gold pratimas of Indra, Agni, and Varuna.",
      mantraRecitation: "10,000 recitations of Mahamrityunjaya Mantra and Nakshatra Gayatri; perform holy Abhishek for child and parents.",
      danaAndBhojana: "Father should not see the child's face until the Nakshatra repeats after 27 days; donate a bronze vessel filled with sesame seeds, gold, and feed 27 Brahmins.",
    },
  });

  // ------------------------------------------------------------------------------------------------
  // 2. ABHUKTA MŪLA SHĀNTI (अभुक्तमूल जनन - BPHS Ch. 93)
  // First 2 ghatikas of Mula (240°00' - 240°48') or last 2 ghatikas of Ashlesha (119°12' - 120°00')
  // ------------------------------------------------------------------------------------------------
  const isAbhuktaMula = (moonLong >= 240.0 && moonLong <= 240.8) || (moonLong >= 119.2 && moonLong <= 120.0);

  birthShantis.push({
    id: "abhukta_mula",
    name: "Abhukta Mūla Janma Shānti",
    sanskritName: "अभुक्तमूल जनन शान्ति",
    bphsChapter: 93,
    isAfflicted: isAbhuktaMula,
    severity: isAbhuktaMula ? "Critical" : "None",
    diagnosticDetails: isAbhuktaMula
      ? `Birth in the critical first 2 ghatikas of Mula or final 2 ghatikas of Ashlesha (Moon at ${moonLong.toFixed(2)}°)`
      : "Birth outside Abhukta Mūla boundary.",
    kinshipAffected: "Immediate paternal danger; father must not look upon infant until proper shanti is completed.",
    classicalVedicShanti: {
      ritualName: "Abhukta Mūla Dāna & Shānti (BPHS Ch. 93, Shlokas 5-11)",
      kalashaWorship: "Consecrate water from 108 sacred rivers and wells; worship Lord Shiva and Nirriti (ruling deity of Mula).",
      mantraRecitation: "125,000 Mahamrityunjaya Japa performed by learned scholars with Bilva leaf homa.",
      danaAndBhojana: "Donate a cow with calf, gold idol of Ganesha, and feed 28 Vedic scholars with ghee sweets.",
    },
  });

  // ------------------------------------------------------------------------------------------------
  // 3. JYESHTHĀ GANDĀNTA SHĀNTI (ज्येष्ठा गण्डान्त - BPHS Ch. 94)
  // Jyeshtha Nakshatra (226°40' - 240°00') in 4 quarters
  // ------------------------------------------------------------------------------------------------
  const inJyeshtha = moonLong >= 226.666 && moonLong < 240.0;
  let jyeshthaPada = 0;
  let jyeshthaKin = "";
  let jyeshthaDetails = "";

  if (inJyeshtha) {
    const jyeshthaDeg = moonLong - 226.666;
    jyeshthaPada = Math.floor(jyeshthaDeg / 3.333) + 1;
    if (jyeshthaPada === 1) {
      jyeshthaKin = "Elder Brother / Maternal Grandmother";
      jyeshthaDetails = "Jyeshtha Pada 1: Afflicts elder brother or maternal lineage.";
    } else if (jyeshthaPada === 2) {
      jyeshthaKin = "Younger Brother / Maternal Uncle";
      jyeshthaDetails = "Jyeshtha Pada 2: Afflicts younger brother or maternal uncle (Matula).";
    } else if (jyeshthaPada === 3) {
      jyeshthaKin = "Mother";
      jyeshthaDetails = "Jyeshtha Pada 3: Afflicts mother's health and vitality.";
    } else {
      jyeshthaKin = "Self / Native's Longevity";
      jyeshthaDetails = "Jyeshtha Pada 4 (Most Critical): Afflicts infant's own longevity and paternal wealth.";
    }
  }

  birthShantis.push({
    id: "jyeshtha_gandanta",
    name: "Jyeshthā Gandānta Shānti",
    sanskritName: "ज्येष्ठा गण्डान्त शान्ति",
    bphsChapter: 94,
    isAfflicted: inJyeshtha,
    severity: inJyeshtha ? (jyeshthaPada === 4 ? "Critical" : "Moderate") : "None",
    diagnosticDetails: inJyeshtha ? jyeshthaDetails : "Birth outside Jyeshtha Nakshatra.",
    kinshipAffected: inJyeshtha ? jyeshthaKin : "None",
    classicalVedicShanti: {
      ritualName: "Jyeshthā Mahā-Shānti (BPHS Ch. 94, Shlokas 7-15)",
      kalashaWorship: "Install a gold idol of Indra, perform Kalasha sthapana with 28 sacred herbs, and conduct ceremonial royal abhishek.",
      mantraRecitation: "Indra Sukta and Mahamrityunjaya Japa with continuous ghee oblations into sacrificial fire.",
      danaAndBhojana: "Donate an ox, bronze vessel filled with clarified butter, black umbrella, and feed Brahmins.",
    },
  });

  // ------------------------------------------------------------------------------------------------
  // 4. AMĀVĀSYĀ JANMA SHĀNTI (अमावास्या जनन - BPHS Ch. 86)
  // Moon-Sun elongation < 12° (Darsha / Amavasya)
  // ------------------------------------------------------------------------------------------------
  const elongation = norm360(moonLong - sunLong);
  const isAmavasya = elongation >= 348.0 || elongation <= 1.0;

  birthShantis.push({
    id: "amavasya_shanti",
    name: "Amāvāsyā Janma Shānti (New Moon Birth)",
    sanskritName: "अमावास्या जनन शान्ति",
    bphsChapter: 86,
    isAfflicted: isAmavasya,
    severity: isAmavasya ? "Moderate" : "None",
    diagnosticDetails: isAmavasya
      ? `Birth occurred on Amāvāsyā (Sun-Moon elongation: ${elongation.toFixed(2)}°), causing weak lunar lifeforce`
      : "Birth not on Amāvāsyā.",
    kinshipAffected: "Paternal vitality, domestic harmony, and financial stability of parents during early childhood.",
    classicalVedicShanti: {
      ritualName: "Darsha Shānti Vidhāna (BPHS Ch. 86, Shlokas 4-10)",
      kalashaWorship: "Consecrate two sacred kalashas: one with gold idol of Surya and the other with silver idol of Chandra.",
      mantraRecitation: "Surya Gayatri and Chandra Gayatri (10,000 recitations) with Samidhas of Arka and Palasha.",
      danaAndBhojana: "Donate silver Moon idol, cow, white silk garments, and feed sweet milk kheer to 21 Vedic scholars.",
    },
  });

  // ------------------------------------------------------------------------------------------------
  // 5. KRISHNA CHATURDASHĪ JANMA (कृष्ण चतुर्दशी जनन - BPHS Ch. 87)
  // 14th waning day: Elongation 336° to 348°, divided into 6 sextiles of 2 degrees each
  // ------------------------------------------------------------------------------------------------
  const isChaturdashi = elongation >= 336.0 && elongation < 348.0;
  let chaturdashiSextile = 0;
  let chaturdashiKin = "";
  let chaturdashiDetails = "";

  if (isChaturdashi) {
    const degInTithi = elongation - 336.0;
    chaturdashiSextile = Math.floor(degInTithi / 2.0) + 1; // 1 to 6
    const sextileNames = [
      "1st Sextile (336°-338°): Auspicious / minimal affliction",
      "2nd Sextile (338°-340°): Afflicts father's longevity and health",
      "3rd Sextile (340°-342°): Afflicts mother's wellbeing",
      "4th Sextile (342°-344°): Afflicts maternal uncle (Matula)",
      "5th Sextile (344°-346°): Afflicts siblings and familial lineage",
      "6th Sextile (346°-348°): Afflicts native's own wealth and physical health",
    ];
    chaturdashiDetails = `Krishna Chaturdashi ${sextileNames[chaturdashiSextile - 1]}`;
    const kinMap = ["Self (Mild)", "Father", "Mother", "Maternal Uncle", "Siblings / Lineage", "Self & Wealth"];
    chaturdashiKin = kinMap[chaturdashiSextile - 1];
  }

  birthShantis.push({
    id: "krishna_chaturdashi",
    name: "Krishna Chaturdashī Janma Shānti (6 Sextiles Diagnostic)",
    sanskritName: "कृष्ण चतुर्दशी जनन शान्ति",
    bphsChapter: 87,
    isAfflicted: isChaturdashi,
    severity: isChaturdashi ? (chaturdashiSextile === 1 ? "Mild" : "Moderate") : "None",
    diagnosticDetails: isChaturdashi ? chaturdashiDetails : "Birth not on Krishna Chaturdashi.",
    kinshipAffected: isChaturdashi ? chaturdashiKin : "None",
    classicalVedicShanti: {
      ritualName: "Chaturdashī Shānti Vidhāna (BPHS Ch. 87, Shlokas 5-12)",
      kalashaWorship: "Install gold idol of Lord Shiva (Rudra) on a consecrated water vessel with bilva leaves and sandalwood.",
      mantraRecitation: "Rudra Japa and Chamakam recitation with 1,008 lotus flower offerings.",
      danaAndBhojana: "Donate black ox or iron vessel filled with sesame oil, distribute food to poor, and feed 14 Brahmins.",
    },
  });

  // ------------------------------------------------------------------------------------------------
  // 6. GRAHANA JANMA SHĀNTI (सूर्य-चन्द्र ग्रहण जनन - BPHS Ch. 91)
  // Sun or Moon within 12 degrees of Rahu or Ketu
  // ------------------------------------------------------------------------------------------------
  const distSunRahu = Math.min(Math.abs(sunLong - rahuLong), 360 - Math.abs(sunLong - rahuLong));
  const distSunKetu = Math.min(Math.abs(sunLong - ketuLong), 360 - Math.abs(sunLong - ketuLong));
  const distMoonRahu = Math.min(Math.abs(moonLong - rahuLong), 360 - Math.abs(moonLong - rahuLong));
  const distMoonKetu = Math.min(Math.abs(moonLong - ketuLong), 360 - Math.abs(moonLong - ketuLong));

  const isEclipseBirth = distSunRahu <= 12.0 || distSunKetu <= 12.0 || distMoonRahu <= 12.0 || distMoonKetu <= 12.0;
  let eclipseType = "";
  if (isEclipseBirth) {
    if (distSunRahu <= 12.0 || distSunKetu <= 12.0) eclipseType = "Surya Grahana (Solar Eclipse shadow)";
    else eclipseType = "Chandra Grahana (Lunar Eclipse shadow)";
  }

  birthShantis.push({
    id: "grahana_birth",
    name: "Grahana Janma Shānti (Eclipse Birth)",
    sanskritName: "सूर्य-चन्द्र ग्रहण जनन शान्ति",
    bphsChapter: 91,
    isAfflicted: isEclipseBirth,
    severity: isEclipseBirth ? "Critical" : "None",
    diagnosticDetails: isEclipseBirth
      ? `Birth occurred during ${eclipseType} (Luminaries conjunct nodal axis within nodal orb)`
      : "Birth outside eclipse shadow.",
    kinshipAffected: "General health, psychological resilience, and vitality of parents and self.",
    classicalVedicShanti: {
      ritualName: "Grahana Shānti Vidhāna (BPHS Ch. 91, Shlokas 4-9)",
      kalashaWorship: "Install idols of Sun/Moon and Rahu/Ketu crafted in silver and lead; perform holy water immersion.",
      mantraRecitation: "Surya/Chandra Gayatri and Rahu/Ketu Stotras with Durva grass homa.",
      danaAndBhojana: "Donate silver serpent, black sesame seeds, iron skillet, and feed cows and needy persons.",
    },
  });

  // ------------------------------------------------------------------------------------------------
  // 7. SŪRYA SANKRĀNTI JANMA SHĀNTI (संक्रान्ति जनन - BPHS Ch. 90)
  // Sun within 0.5° of zodiac sign edge (ingress window)
  // ------------------------------------------------------------------------------------------------
  const sunDegInSign = sunLong % 30;
  const isSankranti = sunDegInSign <= 0.5 || sunDegInSign >= 29.5;

  birthShantis.push({
    id: "sankranti_birth",
    name: "Sūrya Sankrānti Janma Shānti (Solar Ingress Transition)",
    sanskritName: "संक्रान्ति जनन शान्ति",
    bphsChapter: 90,
    isAfflicted: isSankranti,
    severity: isSankranti ? "Moderate" : "None",
    diagnosticDetails: isSankranti
      ? `Birth occurred during Sūrya Sankrānti (Sun at transitional threshold ${sunDegInSign.toFixed(2)}° of sign)`
      : "Birth not on Sankrānti threshold.",
    kinshipAffected: "Native's physical stamina, eyesight, and digestive fire (Agni).",
    classicalVedicShanti: {
      ritualName: "Sankrānti Shānti Vidhāna (BPHS Ch. 90, Shlokas 5-8)",
      kalashaWorship: "Consecrate golden idol of Surya on copper vessel with red sandalwood and lotus flowers.",
      mantraRecitation: "Aditya Hridaya Stotra and Surya Ashtakam with 1,008 recitations of Gayatri Mantra.",
      danaAndBhojana: "Donate copper plate with wheat, jaggery, ruby or red clothes to a learned scholar.",
    },
  });

  // ------------------------------------------------------------------------------------------------
  // 8. BHADRĀ (VISHTI KARANA), VYATĪPĀTA & VAIDHRITI SHĀNTI (BPHS Ch. 88)
  // ------------------------------------------------------------------------------------------------
  // Vishti Karana check: Elongation between 54°-60°, 90°-96°, 126°-132°, 162°-168°, 198°-204°, 234°-240°, 270°-276°, 306°-312°
  const karanaIdx = Math.floor((elongation % 360) / 6);
  const isVishti = [7, 15, 23, 31, 39, 47, 55].includes(karanaIdx);

  // Mahapata yogas: Vyatipata (sum ~ 53.33° / 17 rashis), Vaidhriti (sum ~ 360° / 27 rashis)
  const sumSunMoon = norm360(sunLong + moonLong);
  const isVyatipata = sumSunMoon >= 50.0 && sumSunMoon <= 56.666;
  const isVaidhriti = sumSunMoon >= 356.0 || sumSunMoon <= 4.0;

  const isBhadraOrMahapata = isVishti || isVyatipata || isVaidhriti;
  let bhadraDetails = "";
  if (isVishti) bhadraDetails = "Birth occurred in Vishti Karana (Bhadrā)";
  if (isVyatipata) bhadraDetails = "Birth occurred during Vyatīpāta Yoga (Cosmic Turbulence)";
  if (isVaidhriti) bhadraDetails = "Birth occurred during Vaidhriti Yoga (Celestial Opposition)";

  birthShantis.push({
    id: "bhadra_vishti",
    name: "Bhadrā (Vishti) & Mahāpāta Shānti",
    sanskritName: "भद्रा एवं महापात शान्ति",
    bphsChapter: 88,
    isAfflicted: isBhadraOrMahapata,
    severity: isBhadraOrMahapata ? "Moderate" : "None",
    diagnosticDetails: isBhadraOrMahapata ? bhadraDetails : "Birth outside Bhadrā and Mahāpāta yogas.",
    kinshipAffected: "Mental tranquility, auspicious beginnings, and occupational hurdles.",
    classicalVedicShanti: {
      ritualName: "Bhadrā & Vyatīpāta Shānti (BPHS Ch. 88, Shlokas 6-11)",
      kalashaWorship: "Install idol of Lord Yama or Rudra, offer black sesame and bilva leaves into sacred fire.",
      mantraRecitation: "Mahamrityunjaya and Yama Sukta with 108 offering of ghee and guggulu.",
      danaAndBhojana: "Donate black blanket, iron bowl, and sesame sweets to needy elderly persons.",
    },
  });

  // ------------------------------------------------------------------------------------------------
  // 9. TRIK PRASAVA SHĀNTI (त्रिक प्रसव जनन - BPHS Ch. 95)
  // Informational / Diagnostic Guideline
  // ------------------------------------------------------------------------------------------------
  birthShantis.push({
    id: "trik_prasava",
    name: "Trik Prasava Shānti (Birth Sequence Diagnostic)",
    sanskritName: "त्रिक प्रसव जनन शान्ति",
    bphsChapter: 95,
    isAfflicted: false, // Requires external sibling sequence input
    severity: "None",
    diagnosticDetails: "Diagnostic rule applies when a child is born as the 4th consecutive offspring of opposite gender (e.g. daughter after 3 sons, or son after 3 daughters). Check family sibling record.",
    kinshipAffected: "Potential maternal or paternal physical distress without classical shanti.",
    classicalVedicShanti: {
      ritualName: "Trik Prasava Mahā-Shānti (BPHS Ch. 95, Shlokas 4-12)",
      kalashaWorship: "Worship gold idols of Brahma, Vishnu, and Shiva placed on three separate consecrated vessels.",
      mantraRecitation: "Gayatri Japa, Purusha Sukta, and Sri Sukta recitations with 108 lotus flowers.",
      danaAndBhojana: "Donate gold, land, or cows, and feed 21 Brahmins with sweet rice and dakshina.",
    },
  });

  return birthShantis;
}

/**
 * Master synthesis report combining BPHS Ch. 83 & Ch. 85-96
 */
export function synthesizeBphsKarmicShanti(natal: EphemerisResult): BphsKarmicShantiReport {
  const curses = evaluateBphsKarmicCurses(natal);
  const birthShantis = evaluateBphsBirthShantis(natal);

  const activeCurses = curses.filter((c) => c.isActive);
  const activeShantis = birthShantis.filter((s) => s.isAfflicted);

  const hasAnyCurse = activeCurses.length > 0;
  const hasAnyBirthAffliction = activeShantis.length > 0;

  // Derive highest curse severity
  let highestCurseSeverity: "None" | "Mild" | "Moderate" | "Severe / Veto" = "None";
  if (activeCurses.some((c) => c.severity === "Severe / Veto")) {
    highestCurseSeverity = "Severe / Veto";
  } else if (activeCurses.some((c) => c.severity === "Moderate")) {
    highestCurseSeverity = "Moderate";
  } else if (activeCurses.some((c) => c.severity === "Mild")) {
    highestCurseSeverity = "Mild";
  }

  // Generate Verdict
  let karmicDestinyVerdict = "Pavitra Janma (पवित्र जन्म — Unobstructed Karmic Flow): No major BPHS Pūrva Janma Shāpas or birth afflictions detected.";
  if (highestCurseSeverity === "Severe / Veto") {
    const curseNames = activeCurses.filter((c) => c.severity === "Severe / Veto").map((c) => c.name).join(", ");
    karmicDestinyVerdict = `Karmic Veto Active (${curseNames}): Classical BPHS Chapter 83 diagnoses significant past-life karmic hindrance to progeny/happiness requiring authentic Vedic penance (Shānti).`;
  } else if (highestCurseSeverity === "Moderate") {
    const curseNames = activeCurses.map((c) => c.name).join(", ");
    karmicDestinyVerdict = `Moderate Karmic Impendence (${curseNames}): Astrological indications suggest delayed or obstructed fruition in progeny affairs; alleviated via prescribed pariharas.`;
  } else if (hasAnyBirthAffliction) {
    const affNames = activeShantis.map((s) => s.name).join(", ");
    karmicDestinyVerdict = `Birth Moment Affliction Active (${affNames}): Specific timing threshold (BPHS Ch. 85-96) requires classical Vedic purification.`;
  }

  const acharyaGuidanceSummary = activeCurses.length === 0 && activeShantis.length === 0
    ? "Maharshi Parashara's classical criteria indicate spotless lineage blessings (Vamsha Vriddhi) with harmonious planetary dispositions in the 5th Bhava."
    : `Identified ${activeCurses.length} active karmic curse(s) and ${activeShantis.length} birth moment affliction(s). Follow the authenticated shastric remedial protocols outlined by Maharshi Parashara.`;

  return {
    hasAnyCurse,
    activeCursesCount: activeCurses.length,
    highestCurseSeverity,
    curses,
    hasAnyBirthAffliction,
    activeBirthAfflictionsCount: activeShantis.length,
    birthShantis,
    karmicDestinyVerdict,
    acharyaGuidanceSummary,
  };
}
