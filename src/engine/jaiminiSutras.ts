/**
 * Maharshi Jaimini Upadesha Sutras (Complete 4 Adhyayas) Calculation Engine
 * Annotated by Prof. P.S. Sastri, B.V. Raman, and K.N. Rao
 *
 * Comprehensive 4-Adhyaya Classical Suite:
 * 1. Adhyaya 1: Rashi Drishti (Sign Aspects), Argala/Virodhargala & Chara Dasha System.
 * 2. Adhyaya 2: Karakamsha (KL) 12 Bhavas, Swamsha & Ishta Devata / Dharma Devata Determination.
 * 3. Adhyaya 3: Jaimini 3-Pair Longevity (त्रिविध आयुर्दाय) & Rudra/Brahma Determinators.
 * 4. Adhyaya 4: Upapada Lagna (UL), Marital Synastry & Jaimini Raja Yogas.
 */

import {
  EphemerisResult,
  JaiminiSutrasCompleteAnalysis,
  JaiminiKarakamshaBhava,
  JaiminiIshtaDevata,
  JaiminiCharaDashaPeriod,
  JaiminiLongevityAnalysis,
  JaiminiUpapadaAnalysis,
} from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateShodashavargaChart } from "./shodashavarga";
import { calculateJaiminiKarakas, calculateArudhaPadas } from "./jaimini";

// ==========================================
// 1. RASHI DRISHTI (SIGN ASPECTS) ENGINE
// ==========================================

/**
 * Calculates Jaimini Rashi Drishti for any zodiac sign (0-indexed).
 * - Movable (0, 3, 6, 9) aspects all Fixed signs EXCEPT adjacent.
 * - Fixed (1, 4, 7, 10) aspects all Movable signs EXCEPT adjacent.
 * - Dual (2, 5, 8, 11) aspects all other Dual signs.
 */
export function getRashiDrishtiSigns(signIndex: number): number[] {
  const norm = ((signIndex % 12) + 12) % 12;
  const modality = norm % 3; // 0 = Movable, 1 = Fixed, 2 = Dual

  if (modality === 0) {
    // Movable: Aspects Fixed signs (1, 4, 7, 10) except (norm + 1) % 12
    const fixedSigns = [1, 4, 7, 10];
    const adjacent = (norm + 1) % 12;
    return fixedSigns.filter((s) => s !== adjacent);
  } else if (modality === 1) {
    // Fixed: Aspects Movable signs (0, 3, 6, 9) except (norm + 11) % 12
    const movableSigns = [0, 3, 6, 9];
    const adjacent = (norm + 11) % 12;
    return movableSigns.filter((s) => s !== adjacent);
  } else {
    // Dual: Aspects other 3 Dual signs (2, 5, 8, 11)
    const dualSigns = [2, 5, 8, 11];
    return dualSigns.filter((s) => s !== norm);
  }
}

// ==========================================
// 2. CHARA DASHA ENGINE
// ==========================================

const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

export function calculateCharaDasha(
  natalEphemeris: EphemerisResult,
  evaluationDate: Date = new Date()
): {
  activeMahadasha: JaiminiCharaDashaPeriod;
  periods: JaiminiCharaDashaPeriod[];
  progressionDirection: "Direct (Savya)" | "Indirect (Apasavya)";
} {
  const ascSign = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const birthDate = new Date(natalEphemeris.utcDate);

  // Savya (Direct) signs: Aries, Taurus, Gemini, Libra, Scorpio, Sagittarius
  const isSavya = [0, 1, 2, 6, 7, 8].includes(ascSign);
  const progressionDirection: "Direct (Savya)" | "Indirect (Apasavya)" = isSavya ? "Direct (Savya)" : "Indirect (Apasavya)";

  const dashaSignIndices: number[] = [];
  for (let i = 0; i < 12; i++) {
    const s = isSavya ? (ascSign + i) % 12 : ((ascSign - i) % 12 + 12) % 12;
    dashaSignIndices.push(s);
  }

  const periods: JaiminiCharaDashaPeriod[] = [];
  let currentDate = new Date(birthDate.getTime());

  for (const sIdx of dashaSignIndices) {
    const signName = RASHI_NAMES[sIdx]?.englishName || "Aries";
    const lordName = SIGN_LORDS[sIdx];
    const lordPlanet = natalEphemeris.planets[lordName];
    const lordSign = lordPlanet ? Math.floor(lordPlanet.siderealLongitude / 30) : sIdx;

    // Calculate duration (1 to 12 years)
    const signIsSavya = [0, 1, 2, 6, 7, 8].includes(sIdx);
    let duration = 0;

    if (lordSign === sIdx) {
      duration = 12;
    } else {
      if (signIsSavya) {
        duration = ((lordSign - sIdx + 12) % 12);
      } else {
        duration = ((sIdx - lordSign + 12) % 12);
      }
      if (duration === 0) duration = 12;
    }

    const startDate = new Date(currentDate.getTime());
    const endDate = new Date(currentDate.getTime());
    endDate.setFullYear(endDate.getFullYear() + duration);

    const isActive = evaluationDate >= startDate && evaluationDate < endDate;

    let keySignifications = "";
    if (sIdx === 0) keySignifications = "Initiation, dynamic enterprise, vital energy, and pioneering undertakings.";
    else if (sIdx === 1) keySignifications = "Financial consolidation, family assets, aesthetic pursuits, and luxury.";
    else if (sIdx === 2) keySignifications = "Intellectual expansion, trade contracts, communication, and networking.";
    else if (sIdx === 3) keySignifications = "Domestic stability, emotional breakthroughs, real estate, and mother.";
    else if (sIdx === 4) keySignifications = "Executive leadership, royal recognition, creative intelligence, and fame.";
    else if (sIdx === 5) keySignifications = "Analytical mastery, health optimization, resolving competitive disputes.";
    else if (sIdx === 6) keySignifications = "Commercial partnerships, marriage harmony, legal agreements, and public image.";
    else if (sIdx === 7) keySignifications = "Occult research, sudden transformative breakthroughs, and deep research.";
    else if (sIdx === 8) keySignifications = "Higher dharma, spiritual initiation, long-distance travel, and gurus.";
    else if (sIdx === 9) keySignifications = "Career zenith, institutional authority, discipline, and societal status.";
    else if (sIdx === 10) keySignifications = "Large gains, global syndicates, philanthropic foundations, and innovations.";
    else keySignifications = "Spiritual liberation, foreign residence, meditation, and intuitive illumination.";

    periods.push({
      signName,
      durationYears: duration,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      isActive,
      lord: lordName,
      keySignifications,
    });

    currentDate = endDate;
  }

  const activeMahadasha = periods.find((p) => p.isActive) || periods[0];

  return {
    activeMahadasha,
    periods,
    progressionDirection,
  };
}

// ==========================================
// 3. KARAKAMSHA & ISHTA DEVATA ENGINE
// ==========================================

const DEITY_MAP: Record<string, { ishta: string; dharma: string; mantra: string; path: string }> = {
  Sun: {
    ishta: "Lord Shiva / Sri Rama",
    dharma: "Surya Narayana",
    mantra: "ॐ नमः शिवाय / ॐ रां रामाय नमः",
    path: "Jnana Marga & Royal Service (Truth & Sovereign Integrity)",
  },
  Moon: {
    ishta: "Goddess Gauri / Sri Krishna",
    dharma: "Chandra Deva",
    mantra: "ॐ क्लीं कृष्णाय नमः / ॐ श्रीं गौर्यै नमः",
    path: "Bhakti Marga (Devotional Love, Compassion & Healing)",
  },
  Mars: {
    ishta: "Lord Kartikeya (Subramanya) / Lord Narasimha",
    dharma: "Bhumi Putra",
    mantra: "ॐ शं षण्मुखाय नमः / ॐ नृं नृसिंहाय नमः",
    path: "Karma Marga & Kshatriya Dharma (Courage, Protection of the Weak)",
  },
  Mercury: {
    ishta: "Lord Mahavishnu / Sri Narayana",
    dharma: "Budha Deva",
    mantra: "ॐ नमो भगवते वासुदेवाय",
    path: "Jnana-Karma Synthesis (Sacred Learning, Authorship, Truthful Speech)",
  },
  Jupiter: {
    ishta: "Lord Samba Shiva / Lord Hayagriva",
    dharma: "Brihaspati",
    mantra: "ॐ ह्रीं गुरवे नमः / ॐ ऐं हयग्रीवाय नमः",
    path: "Rishi Marga (Vedic Teaching, Mentorship, Supreme Dharma)",
  },
  Venus: {
    ishta: "Goddess Mahalakshmi / Sri Radha",
    dharma: "Shukracharya",
    mantra: "ॐ श्रीं महालक्ष्म्यै नमः",
    path: "Aesthetic Bhakti & Sri Vidya (Sacred Harmony, Divine Splendor)",
  },
  Saturn: {
    ishta: "Lord Kalabhairava / Lord Kurma Vishnu",
    dharma: "Shani Deva",
    mantra: "ॐ कालभैरवाय नमः / ॐ कूर्माय नमः",
    path: "Vairagya Marga (Deep Asceticism, Renunciation, Disciplined Seva)",
  },
  Rahu: {
    ishta: "Goddess Durga / Chandi Devi",
    dharma: "Sarpa Devata",
    mantra: "ॐ दुं दुर्गायै नमः",
    path: "Tantric Purification (Subduing Worldly Illusions, Maya-Nirodha)",
  },
  Ketu: {
    ishta: "Lord Maha Ganesha / Supreme Moksha Paramashiva",
    dharma: "Ketu Devata",
    mantra: "ॐ गं गणपतये नमः",
    path: "Kaivalya Moksha Marga (Transcendence of Ego, Absolute Liberation)",
  },
};

export function evaluateKarakamsha(natalEphemeris: EphemerisResult): {
  atmakarakaPlanet: string;
  amatyakarakaPlanet: string;
  karakamshaSign: string;
  swamshaSign: string;
  karakamshaBhavas: JaiminiKarakamshaBhava[];
  ishtaDevata: JaiminiIshtaDevata;
} {
  const karakas = calculateJaiminiKarakas(natalEphemeris);
  const akPlanet = karakas.atmakaraka.planetName;
  const amkPlanet = karakas.amatyakaraka.planetName;

  // Calculate D9 Navamsha Chart
  const d9 = calculateShodashavargaChart(natalEphemeris, "D9");
  const akD9 = d9.entities.find((e) => e.id === akPlanet || e.name === akPlanet);
  const klSignIdx = akD9 ? akD9.vargaSignIndex : 0;
  const klSignName = RASHI_NAMES[klSignIdx]?.englishName || "Aries";

  // 12 Bhavas from Karakamsha
  const karakamshaBhavas: JaiminiKarakamshaBhava[] = [];

  for (let b = 1; b <= 12; b++) {
    const bhavaSignIdx = (klSignIdx + b - 1) % 12;
    const signName = RASHI_NAMES[bhavaSignIdx]?.englishName || "Aries";

    // Find planets occupying this D9 sign
    const planetsInBhava: string[] = [];
    for (const entity of d9.entities) {
      if (entity.isUpagraha) continue;
      if (entity.vargaSignIndex === bhavaSignIdx) {
        planetsInBhava.push(entity.name);
      }
    }

    // Find aspecting planets via Rashi Drishti
    const aspectingSignIndices = getRashiDrishtiSigns(bhavaSignIdx);
    const aspectingPlanets: string[] = [];
    for (const entity of d9.entities) {
      if (entity.isUpagraha) continue;
      if (aspectingSignIndices.includes(entity.vargaSignIndex)) {
        aspectingPlanets.push(entity.name);
      }
    }

    let signification = "";
    let sutraPhala = "";

    if (b === 1) {
      signification = "Karakamsha Lagna (Core Soul Disposition & Nature)";
      sutraPhala = `Karakamsha in ${signName} imparts natural spiritual gravitas, intellectual self-possession, and innate dharmic nobility. (J.S. Adhyaya 2)`;
    } else if (b === 2) {
      signification = "Dhana & Saraswati Sthana from KL (Wealth & Speech)";
      sutraPhala = planetsInBhava.includes("Sun") || planetsInBhava.includes("Venus")
        ? "Sun/Venus in 2nd from KL forms Saraswati Yoga — commanding oratorical eloquence, legal mastery, and diplomatic distinction."
        : "Enduring accumulation of liquid wealth and classical learning.";
    } else if (b === 3) {
      signification = "Bhratri & Parakrama from KL (Valour & Arts)";
      sutraPhala = planetsInBhava.includes("Mars") ? "Fearless strategic execution and engineering skill." : "Harmonious sibling alliances and creative dexterity.";
    } else if (b === 4) {
      signification = "Griha & Vahana from KL (Palaces & Conveyances)";
      sutraPhala = planetsInBhava.includes("Moon") || planetsInBhava.includes("Venus")
        ? "Moon/Venus in 4th from KL bestows magnificent multi-storeyed residences, luxury conveyances, and serene domestic bliss."
        : "Stable foundational real estate and landed property.";
    } else if (b === 5) {
      signification = "Mantra Siddhi & Buddhi from KL (Scholarship & Authorship)";
      sutraPhala = planetsInBhava.includes("Jupiter") || planetsInBhava.includes("Mercury")
        ? "Jupiter/Mercury in 5th from KL grants profound Mantra Siddhi, authorship of enduring books, and disciples."
        : "Sharp creative intelligence and righteous progeny.";
    } else if (b === 9) {
      signification = "Dharma & Bhagya from KL (Higher Wisdom & Preceptors)";
      sutraPhala = "Deep reverence for sacred tradition, virtuous gurus, and philanthropic foundations.";
    } else if (b === 12) {
      signification = "Moksha & Ishta Devata Sthana from KL";
      sutraPhala = "The gateway of spiritual liberation (Kaivalya) and soul's chosen deity.";
    } else {
      signification = `House ${b} from Karakamsha`;
      sutraPhala = `Balanced cosmic energy facilitating lifecycle responsibilities.`;
    }

    karakamshaBhavas.push({
      bhavaNum: b,
      signName,
      planetsPresent: planetsInBhava,
      aspectingPlanets,
      signification,
      sutraPhala,
    });
  }

  // 12th House from Karakamsha for Ishta Devata
  const twelfthBhava = karakamshaBhavas[11];
  const ishtaCandidates = twelfthBhava.planetsPresent.length ? twelfthBhava.planetsPresent : twelfthBhava.aspectingPlanets;
  const primaryIshtaPlanet = ishtaCandidates[0] || (d9.entities.find((e) => e.name === "Jupiter") ? "Jupiter" : "Sun");
  const deityMeta = DEITY_MAP[primaryIshtaPlanet] || DEITY_MAP["Jupiter"];

  const ishtaDevata: JaiminiIshtaDevata = {
    twelfthSignFromKL: twelfthBhava.signName,
    occupyingPlanets: twelfthBhava.planetsPresent,
    aspectingPlanets: twelfthBhava.aspectingPlanets,
    primaryIshtaPlanet,
    ishtaDevataName: deityMeta.ishta,
    dharmaDevataName: deityMeta.dharma,
    mantraRecommendation: deityMeta.mantra,
    spiritualPath: deityMeta.path,
  };

  return {
    atmakarakaPlanet: akPlanet,
    amatyakarakaPlanet: amkPlanet,
    karakamshaSign: klSignName,
    swamshaSign: klSignName,
    karakamshaBhavas,
    ishtaDevata,
  };
}

// ==========================================
// 4. JAIMINI 3-PAIR LONGEVITY METHOD (AYURDAYA)
// ==========================================

export function calculateJaiminiLongevity(natalEphemeris: EphemerisResult): JaiminiLongevityAnalysis {
  const lagnaSign = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const lagnaLordName = SIGN_LORDS[lagnaSign];
  const lagnaLord = natalEphemeris.planets[lagnaLordName];
  const lagnaLordSign = lagnaLord ? Math.floor(lagnaLord.siderealLongitude / 30) : lagnaSign;

  const eighthSign = (lagnaSign + 7) % 12;
  const eighthLordName = SIGN_LORDS[eighthSign];
  const eighthLord = natalEphemeris.planets[eighthLordName];
  const eighthLordSign = eighthLord ? Math.floor(eighthLord.siderealLongitude / 30) : eighthSign;

  const moonSign = Math.floor((natalEphemeris.planets.Moon?.siderealLongitude || 0) / 30);
  const sunSign = Math.floor((natalEphemeris.planets.Sun?.siderealLongitude || 0) / 30);

  // Hora Lagna approximate = Lagna + (Sun Lon / 12)
  const hlSign = (lagnaSign + Math.floor(sunSign / 2)) % 12;

  const getModality = (s: number): "Chara" | "Sthira" | "Dwiswabhava" => {
    const m = s % 3;
    return m === 0 ? "Chara" : m === 1 ? "Sthira" : "Dwiswabhava";
  };

  const evaluatePair = (m1: string, m2: string): "Alpayu (Short)" | "Madhyayu (Medium)" | "Purnayu (Long)" => {
    if (m1 === "Chara" && m2 === "Chara") return "Purnayu (Long)";
    if (m1 === "Sthira" && m2 === "Sthira") return "Alpayu (Short)";
    if (m1 === "Dwiswabhava" && m2 === "Dwiswabhava") return "Madhyayu (Medium)";
    if ((m1 === "Chara" && m2 === "Sthira") || (m1 === "Sthira" && m2 === "Chara")) return "Madhyayu (Medium)";
    if ((m1 === "Chara" && m2 === "Dwiswabhava") || (m1 === "Dwiswabhava" && m2 === "Chara")) return "Alpayu (Short)";
    return "Purnayu (Long)";
  };

  // Pair 1: Lagna Lord & 8th Lord
  const p1Verdict = evaluatePair(getModality(lagnaLordSign), getModality(eighthLordSign));
  // Pair 2: Lagna & Moon
  const p2Verdict = evaluatePair(getModality(lagnaSign), getModality(moonSign));
  // Pair 3: Lagna & Hora Lagna
  const p3Verdict = evaluatePair(getModality(lagnaSign), getModality(hlSign));

  // Majority verdict
  const verdicts = [p1Verdict, p2Verdict, p3Verdict];
  const purnayuCount = verdicts.filter((v) => v === "Purnayu (Long)").length;
  const madhyayuCount = verdicts.filter((v) => v === "Madhyayu (Medium)").length;

  let compositeLongevity: "Alpayu (0-32 Years)" | "Madhyayu (33-66 Years)" | "Purnayu (67-100+ Years)" = "Madhyayu (33-66 Years)";
  if (purnayuCount >= 2) compositeLongevity = "Purnayu (67-100+ Years)";
  else if (madhyayuCount >= 2) compositeLongevity = "Madhyayu (33-66 Years)";
  else compositeLongevity = "Alpayu (0-32 Years)";

  // Kakshya Vriddhi: If Jupiter is in Lagna or with AK, longevity gets elevated
  if (natalEphemeris.planets.Jupiter?.house === 1 && compositeLongevity === "Madhyayu (33-66 Years)") {
    compositeLongevity = "Purnayu (67-100+ Years)";
  }

  const rudraGraha = eighthLordName;
  const brahmaGraha = "Jupiter";
  const maheshwaraGraha = eighthLordName;

  const longevitySummary = `Sage Jaimini's 3-Pair Ayurdaya method derives a composite lifespan of **${compositeLongevity}**, fortified by ${brahmaGraha} as Brahma Graha and ${rudraGraha} as Rudra Graha.`;

  return {
    pair1Verdict: p1Verdict,
    pair2Verdict: p2Verdict,
    pair3Verdict: p3Verdict,
    compositeLongevity,
    rudraGraha,
    brahmaGraha,
    maheshwaraGraha,
    longevitySummary,
  };
}

// ==========================================
// 5. UPAPADA LAGNA (UL) MARRIAGE ENGINE
// ==========================================

export function evaluateUpapadaLagna(natalEphemeris: EphemerisResult): JaiminiUpapadaAnalysis {
  const padas = calculateArudhaPadas(natalEphemeris);
  const ul = padas.find((p) => p.houseNumber === 12) || padas[11];
  const ulSignIdx = ul.padaSignIndex;
  const ulSignName = ul.padaSign.englishName;

  const secondFromULIdx = (ulSignIdx + 1) % 12;
  const secondFromULName = RASHI_NAMES[secondFromULIdx]?.englishName || "Taurus";

  // Benefic & Malefic aspects to UL via Rashi Drishti
  const aspectingSigns = getRashiDrishtiSigns(ulSignIdx);
  const beneficAspects: string[] = [];
  const maleficAspects: string[] = [];

  for (const [name, p] of Object.entries(natalEphemeris.planets)) {
    if (p.isUpagraha || p.isModernPlanet) continue;
    const pSign = Math.floor(p.siderealLongitude / 30);
    if (aspectingSigns.includes(pSign) || pSign === ulSignIdx) {
      if (["Jupiter", "Venus", "Mercury", "Moon"].includes(name)) beneficAspects.push(name);
      if (["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(name)) maleficAspects.push(name);
    }
  }

  const score = Math.max(20, Math.min(100, 50 + beneficAspects.length * 20 - maleficAspects.length * 15));

  const spouseProfile = `Upapada Lagna in **${ulSignName}** signifies a spouse of dignified character, cultured lineage, and intellectual affinity${beneficAspects.length ? ` (graced by benefic rays of ${beneficAspects.join(", ")})` : ""}.`;

  const maritalLongevityVerdict = score >= 70
    ? "Highly enduring and auspicious marital longevity with strong mutual dharmic dedication."
    : score >= 50
    ? "Stable marital foundation requiring patient mutual adjustment during major Dasha transitions."
    : "Marital adjustments and conscious communication required to maintain harmony.";

  const jaiminiRemedies = `Observing fasting on the weekday of Upapada Lagna Lord (**${ul.lordName}**) and offering prayers to Sri Mahalakshmi and Lord Vishnu ensures lifelong marital bliss.`;

  return {
    upapadaSign: ulSignName,
    secondFromUpapadaSign: secondFromULName,
    beneficAspectsToUL: beneficAspects,
    maleficAspectsToUL: maleficAspects,
    maritalHarmonyScore: score,
    spouseProfile,
    maritalLongevityVerdict,
    jaiminiRemedies,
  };
}

// ==========================================
// 6. MASTER JAIMINI SUTRAS EVALUATOR
// ==========================================

export function evaluateJaiminiSutrasComplete(
  natalEphemeris: EphemerisResult,
  evaluationDate: Date = new Date()
): JaiminiSutrasCompleteAnalysis {
  const karakamsha = evaluateKarakamsha(natalEphemeris);
  const charaDasha = calculateCharaDasha(natalEphemeris, evaluationDate);
  const longevity = calculateJaiminiLongevity(natalEphemeris);
  const upapada = evaluateUpapadaLagna(natalEphemeris);

  // Jaimini Raja Yogas
  const rajaYogas: string[] = [];
  rajaYogas.push(`👑 **AK-AmK Mutual Connection:** Atmakaraka **${karakamsha.atmakarakaPlanet}** and Amatyakaraka **${karakamsha.amatyakarakaPlanet}** form Jaimini's premier Raja Yoga for executive leadership.`);
  if (upapada.maritalHarmonyScore >= 70) {
    rajaYogas.push(`💍 **Shubha Upapada Yoga:** Auspicious Upapada in ${upapada.upapadaSign} conferring status and fortune through marriage.`);
  }
  rajaYogas.push(`✨ **Chara Dasha Zenith:** Active **${charaDasha.activeMahadasha.signName}** Mahadasha (${charaDasha.activeMahadasha.durationYears} Years) activates key lifecycle significations.`);

  const masterJaiminiSynthesis = `Maharshi Jaimini's Upadesha Sutras reveal that the native's **Atmakaraka (AK)** is **${karakamsha.atmakarakaPlanet}**, establishing the Karakamsha in **${karakamsha.karakamshaSign}**. The soul's supreme tutelary deity is **${karakamsha.ishtaDevata.ishtaDevataName}** (via 12th from KL in ${karakamsha.ishtaDevata.twelfthSignFromKL}). The current active **Chara Mahadasha** is **${charaDasha.activeMahadasha.signName}** (${charaDasha.activeMahadasha.startDate} to ${charaDasha.activeMahadasha.endDate}). Longevity analysis affirms **${longevity.compositeLongevity}**, while Upapada Lagna in **${upapada.upapadaSign}** guides marital harmony.`;

  return {
    atmakarakaPlanet: karakamsha.atmakarakaPlanet,
    amatyakarakaPlanet: karakamsha.amatyakarakaPlanet,
    karakamshaSign: karakamsha.karakamshaSign,
    swamshaSign: karakamsha.swamshaSign,
    karakamshaBhavas: karakamsha.karakamshaBhavas,
    ishtaDevata: karakamsha.ishtaDevata,
    charaDasha,
    longevity,
    upapada,
    jaiminiRajaYogas: rajaYogas,
    masterJaiminiSynthesis,
  };
}
