/**
 * Maharshi Patanjali Yoga Sutras & Astrological Chakra-Sadhana Engine
 * References:
 * - Patanjali Yoga Sutras (4 Padas: Samadhi, Sadhana, Vibhuti, Kaivalya)
 * - Yoga Sastra & Kundalini Graha-Chakra Matrix
 * - Stories of Indian Saints & Bhakti Sadhana
 */

import { EphemerisResult, PatanjaliYogaAnalysis, ChakraEnergeticBalance, AshtangaLimbPrescription, PatanjaliSutraItem } from "./types";

export function evaluatePatanjaliYoga(ephemeris: EphemerisResult): PatanjaliYogaAnalysis {
  const planets = ephemeris.planets;

  // Helper to evaluate planetary strength (0 to 100)
  const getGrahaScore = (pName: string): number => {
    const p = planets[pName];
    if (!p) return 50;
    let score = 70;
    if ([1, 4, 5, 7, 9, 10, 11].includes(p.house)) score += 20;
    if ([6, 8, 12].includes(p.house)) score -= 20;
    if (p.isRetrograde) score += 5;
    return Math.min(100, Math.max(20, score));
  };

  // 1. 7 CHAKRAS ENERGETIC MATRIX
  const CHAKRA_DEFS = [
    {
      num: 1,
      sanskrit: "Muladhara (मूलाधार)",
      english: "Root Chakra",
      element: "Earth (पृथ्वी)",
      grahas: ["Mars", "Ketu"],
      asana: "Tadasana (Mountain), Virabhadrasana (Warrior), Malasana (Squat)",
      pranayama: "Ujjayi Breathing (Victorious Breath) with Mula Bandha",
      bija: "LAM (लं)",
    },
    {
      num: 2,
      sanskrit: "Svadhisthana (स्वाधिष्ठान)",
      english: "Sacral Chakra",
      element: "Water (जल)",
      grahas: ["Venus", "Moon"],
      asana: "Baddha Konasana (Bound Angle), Bhujangasana (Cobra)",
      pranayama: "Chandra Bhedana (Left-Nostril Cooling Breath)",
      bija: "VAM (वं)",
    },
    {
      num: 3,
      sanskrit: "Manipura (मणिपूर)",
      english: "Solar Plexus Chakra",
      element: "Fire (अग्नि)",
      grahas: ["Sun", "Mars"],
      asana: "Navasana (Boat Pose), Dhanurasana (Bow Pose)",
      pranayama: "Kapalabhati (Skull-Shining) & Surya Bhedana",
      bija: "RAM (रं)",
    },
    {
      num: 4,
      sanskrit: "Anahata (अनाहत)",
      english: "Heart Chakra",
      element: "Air (वायु)",
      grahas: ["Mercury", "Venus"],
      asana: "Ustrasana (Camel Pose), Matsyasana (Fish Pose)",
      pranayama: "Nadi Shodhana (Alternate Nostril Breath)",
      bija: "YAM (यं)",
    },
    {
      num: 5,
      sanskrit: "Vishuddha (विशुद्ध)",
      english: "Throat Chakra",
      element: "Ether (आकाश)",
      grahas: ["Jupiter", "Saturn"],
      asana: "Sarvangasana (Shoulder Stand), Halasana (Plow Pose)",
      pranayama: "Bhramari (Humming Bee Breath) & Jalandhara Bandha",
      bija: "HAM (हं)",
    },
    {
      num: 6,
      sanskrit: "Ajna (आज्ञा)",
      english: "Third Eye Chakra",
      element: "Light (ज्योति)",
      grahas: ["Sun", "Moon"],
      asana: "Balasana (Child Pose), Sukhasana with Trataka",
      pranayama: "Shambhavi Mudra & Sheetali Breath",
      bija: "OM (ॐ)",
    },
    {
      num: 7,
      sanskrit: "Sahasrara (सहस्रार)",
      english: "Crown Lotus Chakra",
      element: "Pure Cosmic Consciousness (परम चैतन्य)",
      grahas: ["Jupiter", "Ketu"],
      asana: "Sirsasana (Headstand), Padmasana (Lotus Seat)",
      pranayama: "Kevala Kumbhaka (Spontaneous Breath Pause) & So-Hum",
      bija: "AUM / Maha Silence (मौनम्)",
    },
  ];

  let totalChakraScore = 0;
  const chakras: ChakraEnergeticBalance[] = CHAKRA_DEFS.map((def) => {
    const scores = def.grahas.map(getGrahaScore);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    totalChakraScore += avgScore;

    let status: "Aligned & Fortified (सन्तुलित)" | "Excess Energy / Overactive (प्रचण्ड)" | "Depleted / Blocked (अवरुद्ध)" = "Aligned & Fortified (सन्तुलित)";
    if (avgScore >= 80) {
      status = "Aligned & Fortified (सन्तुलित)";
    } else if (avgScore <= 50) {
      status = "Depleted / Blocked (अवरुद्ध)";
    } else {
      status = "Excess Energy / Overactive (प्रचण्ड)";
    }

    return {
      chakraNumber: def.num,
      sanskritName: def.sanskrit,
      englishName: def.english,
      element: def.element,
      rulingGrahas: def.grahas,
      balanceScore: avgScore,
      status,
      recommendedAsana: def.asana,
      recommendedPranayama: def.pranayama,
      bijaMantra: def.bija,
    };
  });

  const overallChakraHarmonyScore = Math.round(totalChakraScore / 7);

  // 2. 8 LIMBS OF ASHTANGA YOGA SADHANA
  const ashtangaLimbs: AshtangaLimbPrescription[] = [
    {
      limbNumber: 1,
      limbName: "Yama (Universal Moral Restraints)",
      sanskritTitle: "यम (अहिंसा, सत्य, अस्तेय, ब्रह्मचर्य, अपरिग्रह)",
      planetaryAlignment: "Saturn (Discipline) & Mars (Restraint)",
      dailyPracticeProtocol: "Practice Ahimsa (non-harming in thought and speech) and Aparigraha (non-possessiveness in relationships).",
      spiritualObjective: "Clears past-life karmic burdens and establishes ethical bedrock.",
    },
    {
      limbNumber: 2,
      limbName: "Niyama (Personal Spiritual Observances)",
      sanskritTitle: "नियम (शौच, सन्तोष, तपस्, स्वाध्याय, ईश्वरप्रणिधान)",
      planetaryAlignment: "Jupiter (Wisdom) & Sun (Tapas / Purity)",
      dailyPracticeProtocol: "Cultivate Santosha (deep contentment) and dedicate 15 minutes to Svadhyaya (study of sacred philosophy).",
      spiritualObjective: "Awakens the inner spiritual fire (Tapas) and divine alignment.",
    },
    {
      limbNumber: 3,
      limbName: "Asana (Steady & Joyful Posture)",
      sanskritTitle: "आसन (स्थिरसुखमासनम्)",
      planetaryAlignment: "Mars (Physical Vitality) & Saturn (Spinal Stability)",
      dailyPracticeProtocol: "Practice 20 minutes of steady, mindful asana ensuring spine alignment without strain.",
      spiritualObjective: "Prepares the physical vessel to channel heightened kundalini energy.",
    },
    {
      limbNumber: 4,
      limbName: "Pranayama (Vital Breath Expansion)",
      sanskritTitle: "प्राणायाम (प्राण-अपान समत्व)",
      planetaryAlignment: "Mercury (Nerve Channels / Nadis) & Moon (Prana Flow)",
      dailyPracticeProtocol: "10 minutes of Nadi Shodhana (alternate nostril) and 5 minutes of Bhramari before dawn.",
      spiritualObjective: "Purifies the 72,000 Nadis and balances Ida-Pingala currents.",
    },
    {
      limbNumber: 5,
      limbName: "Pratyahara (Sensory Inwardness)",
      sanskritTitle: "प्रत्याहार (इन्द्रिय निग्रह)",
      planetaryAlignment: "Ketu (Detachment) & Venus (Refining Desires)",
      dailyPracticeProtocol: "Practice digital detox and sensory withdrawal for 30 minutes before evening meditation.",
      spiritualObjective: "Reverses the outward flow of senses into the heart lotus.",
    },
    {
      limbNumber: 6,
      limbName: "Dharana (Unwavering Single-Pointed Focus)",
      sanskritTitle: "धारणा (देशबन्धश्चित्तस्य धारणा)",
      planetaryAlignment: "Sun (Atma Jyoti) & Mercury (Concentration)",
      dailyPracticeProtocol: "Fix awareness on your Ishta Devata or heart center for 12 uninterrupted breaths.",
      spiritualObjective: "Stops mental dissipation and builds laser spiritual focus.",
    },
    {
      limbNumber: 7,
      limbName: "Dhyana (Continuous Meditative Absorption)",
      sanskritTitle: "ध्यान (तत्र प्रत्ययैकतानता ध्यानम्)",
      planetaryAlignment: "Moon (Mind Serenity) & Jupiter (Spiritual Grace)",
      dailyPracticeProtocol: "Maintain an unbroken, effortless stream of awareness on the inner witness (Sakshi Bhava).",
      spiritualObjective: "Dissolves the illusion of separation between seeker and Divine.",
    },
    {
      limbNumber: 8,
      limbName: "Samadhi (Cosmic Oneness & Transcendence)",
      sanskritTitle: "समाधि (तदेवार्थमात्रनिर्भासं स्वरूपशून्यमिव समाधिः)",
      planetaryAlignment: "Jupiter (Higher Soul) & Ketu (Moksha Gate)",
      dailyPracticeProtocol: "Rest in the timeless stillness where the individual ego dissolves into universal consciousness.",
      spiritualObjective: "Attainment of Jivanmukti and complete exhaustion of karmic seeds.",
    },
  ];

  // 3. KEY PATANJALI SUTRAS
  const keySutras: PatanjaliSutraItem[] = [
    {
      padaNumber: 1,
      padaName: "Samadhi Pada",
      sutraRef: "YS 1.2",
      sanskritText: "योगश्चित्तवृत्तिनिरोधः (Yogaś citta-vṛtti-nirodhaḥ)",
      englishTranslation: "Yoga is the intentional cessation of the fluctuating patterns of consciousness.",
      astrologicalApplication: "Harmonizes Moon (emotions) and Mercury (thoughts) into crystalline stillness.",
    },
    {
      padaNumber: 1,
      padaName: "Samadhi Pada",
      sutraRef: "YS 1.33",
      sanskritText: "मैत्रीकरुणामुदितोपेक्षाणां सुखदुःखपुण्यापुण्यविषयाणां भावनातश्चित्तप्रसादनम्",
      englishTranslation: "Tranquility is attained by cultivating friendliness to the happy, compassion for the suffering, delight in the virtuous, and equanimity toward the difficult.",
      astrologicalApplication: "Neutralizes 6th house enmities and Rahu-induced social turbulence.",
    },
    {
      padaNumber: 2,
      padaName: "Sadhana Pada",
      sutraRef: "YS 2.28",
      sanskritText: "योगाङ्गानुष्ठानादशुद्धिक्षये ज्ञानदीप्तिरा विवेकख्यातेः",
      englishTranslation: "By dedicated practice of the 8 limbs of yoga, impurities are dissolved and the light of wisdom shines forth.",
      astrologicalApplication: "Burns away past-life karmic residues (Sanchita Karma) registered in D60.",
    },
    {
      padaNumber: 4,
      padaName: "Kaivalya Pada",
      sutraRef: "YS 4.34",
      sanskritText: "पुरुषार्थशून्यानां गुणानां प्रतिप्रसवः कैवल्यं स्वरूपप्रतिष्ठा वा चितिशक्तिरिति",
      englishTranslation: "Kaivalya liberation is attained when the Gunas dissolve back into origin, and Pure Awareness abides in its true sovereign nature.",
      astrologicalApplication: "Ultimate Moksha liberation signaled by 12th house and Ketu Karakamsha.",
    },
  ];

  // Mental state & readiness
  const moonHouse = planets.Moon?.house || 1;
  const mercHouse = planets.Mercury?.house || 1;
  const isMindCentred = [1, 4, 5, 9, 10].includes(moonHouse) && [1, 5, 9, 11].includes(mercHouse);
  const chittaVrittiState = isMindCentred ? "Ekagra (एकाग्र - Focused & Sattvic)" : "Vikshipta (विक्षिप्त - Multi-directional, requiring Pranayama grounding)";
  const kaivalyaLiberationReadiness = overallChakraHarmonyScore >= 75 ? "High Receptivity to Dhyana & Kundalini Awakening" : "Foundational Sadhana & Breathwork Required";

  const masterPatanjaliSynthesis = `Patanjali Yoga analysis records an overall Chakra Harmony Score of ${overallChakraHarmonyScore}%. Current Chitta Vritti orientation is ${chittaVrittiState}. Daily practice of Nadi Shodhana (Heart Chakra) and Mula Bandha (Root Chakra) will accelerate spiritual transcendence.`;

  return {
    chakras,
    ashtangaLimbs,
    keySutras,
    overallChakraHarmonyScore,
    chittaVrittiState,
    kaivalyaLiberationReadiness,
    masterPatanjaliSynthesis,
  };
}
