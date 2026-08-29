/**
 * Gayatri Jyotish (गायत्री ज्योतिष) Calculation Engine
 * The Esoteric Astro-Spiritual Science of the Rigvedic Gayatri Mantra,
 * 24 Aksharas (Syllables), 9 Graha Gayatris, 5 Koshas & Savita Solar Resonance.
 */

import {
  EphemerisResult,
  GayatriJyotishAnalysis,
  GayatriAksharaInfo,
  GrahaGayatriMantra,
  KoshaDiagnostic,
  GayatriAnushthanaPlan,
} from "./types";
import { RASHI_NAMES } from "./constants";

// ==========================================
// 1. 24 AKSHARAS OF THE GAYATRI MANTRA MATRIX
// ==========================================

const GAYATRI_AKSHARA_DEFS: Array<{
  syllable: string;
  pada: 1 | 2 | 3;
  deity: string;
  rishi: string;
  tattwa: string;
  rashiIdx: number;
  signification: string;
}> = [
  { syllable: "तत् (Tat)", pada: 1, deity: "Lord Agni (Divine Fire)", rishi: "Vishwamitra", tattwa: "Tejas (Fire)", rashiIdx: 0, signification: "Awakens divine soul-illumination, purges ancestral karmic residues, and imparts sovereign courage." },
  { syllable: "स (Sa)", pada: 1, deity: "Prajapati (Lord of Creation)", rishi: "Vasishta", tattwa: "Prithvi (Earth)", rashiIdx: 1, signification: "Preserves life vitality, harmonizes family lineages, and grounds physical endurance." },
  { syllable: "वि (Vi)", pada: 1, deity: "Soma (Lunar Nectar)", rishi: "Garga", tattwa: "Vayu (Air)", rashiIdx: 2, signification: "Enhances intellectual acuity, eloquent speech, and swift analytical comprehension." },
  { syllable: "तुर् (Tur)", pada: 1, deity: "Ishana (Supreme Protector)", rishi: "Bharadwaja", tattwa: "Jala (Water)", rashiIdx: 3, signification: "Purifies emotional tides, protects home foundations, and awakens maternal grace." },
  { syllable: "व (Va)", pada: 1, deity: "Savita (Solar Creative Radiance)", rishi: "Gautama", tattwa: "Tejas (Fire)", rashiIdx: 4, signification: "Bestows divine royal authority, inner spiritual power, and unwavering integrity." },
  { syllable: "रे (Re)", pada: 1, deity: "Aditya (Eternal Light)", rishi: "Jamadagni", tattwa: "Prithvi (Earth)", rashiIdx: 5, signification: "Fosters medical healing dexterity, practical wisdom, and selfless service." },
  { syllable: "ण्यं (Nyam)", pada: 1, deity: "Brihaspati (Guru of Devas)", rishi: "Kashyapa", tattwa: "Vayu (Air)", rashiIdx: 6, signification: "Inculcates flawless judicial equity, harmonious partnerships, and ethical trade." },
  { syllable: "भ (Bha)", pada: 1, deity: "Mitra (Divine Companion)", rishi: "Atri", tattwa: "Jala (Water)", rashiIdx: 7, signification: "Transmutes unconscious desires, grants occult research depth, and awakens inner resilience." },
  { syllable: "र्गो (Rgo)", pada: 2, deity: "Varuna (Cosmic Moral Order)", rishi: "Shaunaka", tattwa: "Tejas (Fire)", rashiIdx: 8, signification: "Ignites higher philosophic faith, devotion to gurus, and righteousness (Rita)." },
  { syllable: "दे (De)", pada: 2, deity: "Aryaman (Nobility & Duty)", rishi: "Sanatkumara", tattwa: "Prithvi (Earth)", rashiIdx: 9, signification: "Confers steadfast persistence, professional authority, and tireless karmic duty." },
  { syllable: "व (Va)", pada: 2, deity: "Bhagada (Lord of Opulence)", rishi: "Bhrigu", tattwa: "Vayu (Air)", rashiIdx: 10, signification: "Promotes universal brotherhood, visionary innovation, and boundless altruism." },
  { syllable: "स्य (Sya)", pada: 2, deity: "Pushan (Nourisher of Souls)", rishi: "Agastya", tattwa: "Jala (Water)", rashiIdx: 11, signification: "Awakens cosmic empathy, peaceful spiritual sanctuary, and ultimate liberation." },
  { syllable: "धी (Dhi)", pada: 2, deity: "Tvashta (Celestial Artisan)", rishi: "Pulastya", tattwa: "Tejas (Fire)", rashiIdx: 0, signification: "Refines intellect (Medha Shakti), creative architecture, and mental stamina." },
  { syllable: "म (Ma)", pada: 2, deity: "Vishnu (Cosmic Sustainer)", rishi: "Pulaha", tattwa: "Prithvi (Earth)", rashiIdx: 1, signification: "Sustains righteous wealth, grants domestic tranquility, and blesses prosperity." },
  { syllable: "हि (Hi)", pada: 2, deity: "Shiva (Lord of Yoga)", rishi: "Kratu", tattwa: "Vayu (Air)", rashiIdx: 2, signification: "Dissolves mental turbulence, centers meditative stillness, and dispels dualities." },
  { syllable: "धि (Dhi)", pada: 2, deity: "Savitri (Life-Giving Energy)", rishi: "Marichi", tattwa: "Jala (Water)", rashiIdx: 3, signification: "Nurtures the spiritual heart, awakens gentle compassion, and relieves emotional fatigue." },
  { syllable: "यो (Yo)", pada: 3, deity: "Saraswati (Goddess of Learning)", rishi: "Angiras", tattwa: "Tejas (Fire)", rashiIdx: 4, signification: "Confers mastery over speech, sacred literature, music, and philosophical insight." },
  { syllable: "यो (Yo)", pada: 3, deity: "Lakshmi (Goddess of Auspiciousness)", rishi: "Daksha", tattwa: "Prithvi (Earth)", rashiIdx: 5, signification: "Bestows divine grace (Sri), refined conduct, pure intention, and material fortune." },
  { syllable: "नः (Nah)", pada: 3, deity: "Yama (Lord of Dharma & Time)", rishi: "Narada", tattwa: "Vayu (Air)", rashiIdx: 6, signification: "Instills moral discipline, adherence to cosmic law, and fearlessness of mortality." },
  { syllable: "प्र (Pra)", pada: 3, deity: "Rudra (Destroyer of Darkness)", rishi: "Parashara", tattwa: "Jala (Water)", rashiIdx: 7, signification: "Neutralizes malefic planetary rays, dissolves spiritual blockages, and fortifies courage." },
  { syllable: "चो (Cho)", pada: 3, deity: "Varuna (Purifier of Waters)", rishi: "Jaimini", tattwa: "Tejas (Fire)", rashiIdx: 8, signification: "Bestows pure cosmic awareness, high spiritual discernment, and ethical clarity." },
  { syllable: "द (Da)", pada: 3, deity: "Indra (King of Devas)", rishi: "Shuka", tattwa: "Prithvi (Earth)", rashiIdx: 9, signification: "Grants mastery over the senses (Indriya Jayam), executive eminence, and sovereignty." },
  { syllable: "यात् (Yat)", pada: 3, deity: "Vishvedevas (All Divine Beings)", rishi: "Vyasa", tattwa: "Vayu (Air)", rashiIdx: 10, signification: "Integrates universal virtues, brings social harmony, and promotes selfless service." },
  { syllable: "ॐ (Om / Vyahriti)", pada: 3, deity: "Parabrahman (Supreme Divine Consciousness)", rishi: "Brahma", tattwa: "Akasha (Ether)", rashiIdx: 11, signification: "Gateway to Kaivalya Moksha, inner realization of the Supreme Self, and divine oneness." },
];

// ==========================================
// 2. 9 GRAHA GAYATRI MANTRAS
// ==========================================

const GRAHA_GAYATRI_TEMPLATES: Record<
  string,
  {
    sanskrit: string;
    transliteration: string;
    devata: string;
    effect: string;
  }
> = {
  Sun: {
    sanskrit: "ॐ आदित्याय विद्महे प्रभाकराय धीमहि तन्नः सूर्यः प्रचोदयात्॥",
    transliteration: "Om Adityaya Vidmahe Prabhakaraya Dhimahi Tannah Suryah Prachodayat",
    devata: "Surya Narayana (Savita)",
    effect: "Fortifies self-confidence, eliminates heart/eye ailments, and elevates executive leadership status.",
  },
  Moon: {
    sanskrit: "ॐ क्षीरपुत्राय विद्महे अमृततत्त्वाय धीमहि तन्नो चन्द्रः प्रचोदयात्॥",
    transliteration: "Om Kshiraputraya Vidmahe Amritatattwaya Dhimahi Tanno Chandrah Prachodayat",
    devata: "Chandra Deva (Soma)",
    effect: "Calms emotional restlessness, overcomes depression, and purifies psychic perception.",
  },
  Mars: {
    sanskrit: "ॐ अङ्गारकाय विद्महे शक्तिहस्ताय धीमहि तन्नो भौमः प्रचोदयात्॥",
    transliteration: "Om Angarakaya Vidmahe Shaktihastaya Dhimahi Tanno Bhaumah Prachodayat",
    devata: "Mangala Deva / Lord Kartikeya",
    effect: "Neutralizes Manglik Dosha, curbs irrational anger, protects against accidents, and builds physical stamina.",
  },
  Mercury: {
    sanskrit: "ॐ सौम्यरूपाय विद्महे वाणेशाय धीमहि तन्नो सौम्यः प्रचोदयात्॥",
    transliteration: "Om Saumyarupaya Vidmahe Vaneshaya Dhimahi Tanno Saumyah Prachodayat",
    devata: "Budha Deva / Lord Mahavishnu",
    effect: "Sharpens intellect, cures nervous distress, enhances commercial acumen, and blesses academic success.",
  },
  Jupiter: {
    sanskrit: "ॐ गुरुदेवाय विद्महे परब्रह्मणे धीमहि तन्नो गुरुः प्रचोदयात्॥",
    transliteration: "Om Gurudevaya Vidmahe Parabrahmane Dhimahi Tanno Guruh Prachodayat",
    devata: "Brihaspati / Lord Samba Shiva",
    effect: "Awakens divine wisdom, blesses righteous progeny, resolves financial crises, and attracts divine mentors.",
  },
  Venus: {
    sanskrit: "ॐ भृगुपुत्राय विद्महे दिव्यदेहाय धीमहि तन्नः शुक्रः प्रचोदयात्॥",
    transliteration: "Om Bhriguputraya Vidmahe Divyadehaya Dhimahi Tannah Shukrah Prachodayat",
    devata: "Shukracharya / Goddess Mahalakshmi",
    effect: "Resolves marital conflicts, enhances artistic talent, grants refined luxury, and attracts financial wealth.",
  },
  Saturn: {
    sanskrit: "ॐ काकध्वजाय विद्महे खड्गहस्ताय धीमहि तन्नो मन्दः प्रचोदयात्॥",
    transliteration: "Om Kakadhwajaya Vidmahe Khadgahastaya Dhimahi Tanno Mandah Prachodayat",
    devata: "Shani Deva / Lord Kalabhairava",
    effect: "Mitigates Shani Sade Sati and Kantaka Shani afflictions, dispels chronic delays, and builds rock-solid discipline.",
  },
  Rahu: {
    sanskrit: "ॐ नीलवर्णाय विद्महे सैंहिकेयाय धीमहि तन्नो राहुः प्रचोदयात्॥",
    transliteration: "Om Nilavarnaya Vidmahe Sainhikeyaya Dhimahi Tanno Rahuh Prachodayat",
    devata: "Rahu Deva / Goddess Chandi Durga",
    effect: "Subdues fear of the unknown, protects from deceptive enemies, cures sleep paralysis, and transforms foreign chaos into triumph.",
  },
  Ketu: {
    sanskrit: "ॐ चित्रवर्णाय विद्महे केतुपुत्राय धीमहि तन्नः केतुः प्रचोदयात्॥",
    transliteration: "Om Chitravarnaya Vidmahe Ketuputraya Dhimahi Tannah Ketuh Prachodayat",
    devata: "Ketu Deva / Lord Maha Ganesha",
    effect: "Awakens spiritual intuition, removes mysterious ailments, protects from psychic toxicity, and accelerates Kaivalya Moksha.",
  },
};

// ==========================================
// 3. MASTER GAYATRI JYOTISH EVALUATOR
// ==========================================

export function evaluateGayatriJyotish(natalEphemeris: EphemerisResult): GayatriJyotishAnalysis {
  // 1. Build 24 Akshara Matrix & Map Resident Planets
  const aksharaMatrix: GayatriAksharaInfo[] = GAYATRI_AKSHARA_DEFS.map((def, idx) => {
    const rashiName = RASHI_NAMES[def.rashiIdx]?.englishName || "Aries";
    const planetsInRashi: string[] = [];

    for (const [name, p] of Object.entries(natalEphemeris.planets)) {
      if (p.isUpagraha || p.isModernPlanet) continue;
      const pRashiIdx = Math.floor(p.siderealLongitude / 30);
      if (pRashiIdx === def.rashiIdx) {
        planetsInRashi.push(name);
      }
    }

    return {
      index: idx + 1,
      syllable: def.syllable,
      padaNumber: def.pada,
      presidingDeity: def.deity,
      presidingRishi: def.rishi,
      tattwa: def.tattwa,
      associatedRashiIndex: def.rashiIdx,
      associatedRashiName: rashiName,
      planetsPresent: planetsInRashi,
      spiritualSignification: def.signification,
    };
  });

  // 2. Derive Personal Gayatri Akshara from Moon Nakshatra & Pada
  const moonNakIdx = natalEphemeris.planets.Moon?.nakshatra?.index ?? 0;
  const moonPada = natalEphemeris.planets.Moon?.nakshatra?.pada ?? 1;
  const personalAksharaIdx = ((moonNakIdx * 4 + moonPada - 1) % 24);
  const personalAkshara = aksharaMatrix[personalAksharaIdx] || aksharaMatrix[0];

  // 3. Calculate 9 Graha Gayatri Mantras with Affliction Scores
  const sunLon = natalEphemeris.planets.Sun?.siderealLongitude ?? 0;
  const isCombustPlanet = (pName: string, pLon: number) => {
    if (pName === "Sun" || pName === "Rahu" || pName === "Ketu") return false;
    let diff = Math.abs(pLon - sunLon) % 360;
    if (diff > 180) diff = 360 - diff;
    return diff <= 10;
  };

  let totalAffliction = 0;
  const grahaGayatris: GrahaGayatriMantra[] = Object.entries(GRAHA_GAYATRI_TEMPLATES).map(
    ([planetName, meta]) => {
      const p = natalEphemeris.planets[planetName];
      let affliction = 15; // base baseline
      let reason = "Moderate baseline planetary vibration.";

      if (p) {
        if (isCombustPlanet(planetName, p.siderealLongitude)) {
          affliction += 35;
          reason = "Combust with Sun — requires solar ray transmutation.";
        }
        if (p.house === 6 || p.house === 8 || p.house === 12) {
          affliction += 25;
          reason = `Placed in Trik House ${p.house} — requires protective pranic energization.`;
        }
        if (p.isRetrograde && ["Mars", "Saturn", "Rahu", "Ketu"].includes(planetName)) {
          affliction += 20;
          reason = "Retrograde natural malefic — heightened karmic intensity.";
        }
      }

      affliction = Math.min(100, Math.max(10, affliction));
      totalAffliction += affliction;

      const dailyMalas = affliction >= 60 ? 3 : affliction >= 40 ? 2 : 1;

      return {
        planetName,
        sanskritMantra: meta.sanskrit,
        englishTransliteration: meta.transliteration,
        afflictionScore: affliction,
        afflictionReason: reason,
        recommendedDailyMalas: dailyMalas,
        presidingDevata: meta.devata,
        therapeuticEffect: meta.effect,
      };
    }
  );

  // 4. Calculate 5 Kosha Spiritual Vitality Diagnostics
  const getPlanetStrength = (name: string): number => {
    const p = natalEphemeris.planets[name];
    if (!p) return 50;
    let s = 60;
    if (p.house === 1 || p.house === 4 || p.house === 7 || p.house === 10 || p.house === 5 || p.house === 9) s += 25;
    if (p.house === 6 || p.house === 8 || p.house === 12) s -= 20;
    if (isCombustPlanet(name, p.siderealLongitude)) s -= 15;
    return Math.max(20, Math.min(100, s));
  };

  const annamayaScore = Math.round((getPlanetStrength("Mars") + getPlanetStrength("Saturn")) / 2);
  const pranamayaScore = Math.round((getPlanetStrength("Sun") + getPlanetStrength("Moon")) / 2);
  const manomayaScore = Math.round((getPlanetStrength("Moon") + getPlanetStrength("Mercury")) / 2);
  const vijnanamayaScore = Math.round((getPlanetStrength("Jupiter") + getPlanetStrength("Mercury")) / 2);
  const anandamayaScore = Math.round((getPlanetStrength("Venus") + getPlanetStrength("Ketu")) / 2);

  const formatPranicStatus = (score: number): "Fortified" | "Balanced" | "Depleted" => {
    return score >= 75 ? "Fortified" : score >= 50 ? "Balanced" : "Depleted";
  };

  const koshaDiagnostics: KoshaDiagnostic[] = [
    {
      koshaName: "Annamaya",
      sanskritTitle: "अन्नमय कोश (Physical Vitality & Structural Resilience)",
      governingPlanets: ["Mars", "Saturn"],
      vitalityScore: annamayaScore,
      pranicStatus: formatPranicStatus(annamayaScore),
      harmonizationGuidance: "Consume sattvic seasonal foods, practice surya namaskar, and observe partial fasting on the weekday of your most afflicted planet.",
    },
    {
      koshaName: "Pranamaya",
      sanskritTitle: "प्राणमय कोश (Vital Life-Force & Solar Breath)",
      governingPlanets: ["Sun", "Moon"],
      vitalityScore: pranamayaScore,
      pranicStatus: formatPranicStatus(pranamayaScore),
      harmonizationGuidance: "Practice Anuloma Viloma Pranayama during Brahma Muhurta while mentally vibrating the 24 syllables of Gayatri.",
    },
    {
      koshaName: "Manomaya",
      sanskritTitle: "मनोमय कोश (Mental Tranquility & Emotional Equanimity)",
      governingPlanets: ["Moon", "Mercury"],
      vitalityScore: manomayaScore,
      pranicStatus: formatPranicStatus(manomayaScore),
      harmonizationGuidance: "Chant the Rigvedic Gayatri Mantra 108 times at dusk (Sandhya) to neutralize erratic mental chatter and anxiety.",
    },
    {
      koshaName: "Vijnanamaya",
      sanskritTitle: "विज्ञानमय कोश (Higher Discernment & Vedic Wisdom)",
      governingPlanets: ["Jupiter", "Mercury"],
      vitalityScore: vijnanamayaScore,
      pranicStatus: formatPranicStatus(vijnanamayaScore),
      harmonizationGuidance: "Contemplate sacred philosophical literature and meditate upon Guru Gayatri before engaging in strategic decision-making.",
    },
    {
      koshaName: "Anandamaya",
      sanskritTitle: "आनन्दमय कोश (Causal Bliss & Transcendent Peace)",
      governingPlanets: ["Venus", "Ketu"],
      vitalityScore: anandamayaScore,
      pranicStatus: formatPranicStatus(anandamayaScore),
      harmonizationGuidance: "Cultivate selfless seva (altruistic service), surrender ego attachment to Lord Savita, and practice silent japa (Manasika Japa).",
    },
  ];

  // 5. Savita Solar Resonance & Anushthana Plan
  const sunP = natalEphemeris.planets.Sun;
  let sunResonance = 70;
  if (sunP) {
    if (sunP.house === 1 || sunP.house === 10 || sunP.house === 9 || sunP.house === 5) sunResonance += 20;
    if (sunP.house === 6 || sunP.house === 8 || sunP.house === 12) sunResonance -= 15;
  }
  const savitaSolarResonanceScore = Math.max(30, Math.min(100, sunResonance));

  let recommendedAnushthana: "Laghu Gayatri Anushthana (24,000 Japa)" | "Maha Gayatri Anushthana (125,000 Japa)" | "Daily Nitya Gayatri Sandhya" = "Daily Nitya Gayatri Sandhya";
  let targetJapaCount = 108;
  let dailyMalaCount = 3;
  let durationDays = 40;

  if (totalAffliction >= 350) {
    recommendedAnushthana = "Maha Gayatri Anushthana (125,000 Japa)";
    targetJapaCount = 125000;
    dailyMalaCount = 31;
    durationDays = 40;
  } else if (totalAffliction >= 220) {
    recommendedAnushthana = "Laghu Gayatri Anushthana (24,000 Japa)";
    targetJapaCount = 24000;
    dailyMalaCount = 24;
    durationDays = 9;
  } else {
    recommendedAnushthana = "Daily Nitya Gayatri Sandhya";
    targetJapaCount = 4320;
    dailyMalaCount = 3;
    durationDays = 40;
  }

  const anushthanaPlan: GayatriAnushthanaPlan = {
    recommendedAnushthana,
    targetJapaCount,
    dailyMalaCount,
    durationDays,
    optimalSandhyaTiming: "Pratah Sandhya (45 minutes before sunrise) and Sayam Sandhya (sunset horizon).",
    suryaArghyaGuidance: "Offer fresh water from a clean copper vessel (Tamra Patra) facing East towards the rising Sun while reciting the Gayatri Mantra 3 times with reverence.",
    savitaMeditationVisualization: "Visualize the golden radiance of the rising Sun entering your Agnya Chakra (forehead center), flooding the entire nervous system with liquid divine intelligence (Dhimahi) and dissolving all karmic impurities.",
    recommendedKavacham: "Recite the consecrated Gayatri Kavacham (from the Padma Purana) before commencing Japa for impenetrable auric protection.",
  };

  const masterGayatriSynthesis = `The native's personal Gayatri Akshara is **${personalAkshara.syllable}**, presided over by **${personalAkshara.presidingDeity}** and Sage **${personalAkshara.presidingRishi}**. With a Savita Solar Resonance of **${savitaSolarResonanceScore}%**, the recommended spiritual prescription is **${recommendedAnushthana}** (${dailyMalaCount} Malas/day). The 5-Kosha diagnostic reveals fortified **${koshaDiagnostics.find((k) => k.pranicStatus === "Fortified")?.koshaName || "Pranamaya"} Kosha** vitality, with targeted Gayatri mantras mitigating planetary deficits.`;

  return {
    personalAkshara,
    savitaSolarResonanceScore,
    aksharaMatrix,
    grahaGayatris,
    koshaDiagnostics,
    anushthanaPlan,
    masterGayatriSynthesis,
  };
}
