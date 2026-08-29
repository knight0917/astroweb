/**
 * Doctrines of Suka Nadi (शुक नाडी सिद्धान्त) Calculation Engine
 * Dictated by Sage Maharshi Shukacharya & Translated/Annotated by Classical Masters
 *
 * Core Pillars:
 * 1. Nadi Karakatwa Synergy & Interlocking (Jeeva, Karma, Bhoga, Vidya, Shakti, Pitri, Matri, Maya, Mukti).
 * 2. Directional Trine Matrix (1-5-9 Dharma/Fire, 2-6-10 Artha/Earth, 3-7-11 Kama/Air, 4-8-12 Moksha/Water).
 * 3. Past Life Karma Diagnosis & Classical Suka Pariharas (पूर्वजन्म कर्म एवं प्रायश्चित्त).
 * 4. 12-Year (Jupiter) & 30-Year (Saturn) Nadi Age Progression Cycles.
 * 5. Special Suka Nadi Yogas (Karma Yogi, Jnana Yoga, Maya Karma, Mukti Karma).
 */

import { EphemerisResult, SukaNadiAnalysis, SukaNadiKarakaBlend, SukaDirectionalTrine, SukaPastLifeKarma, SukaAgeCycle } from "./types";
import { RASHI_NAMES } from "./constants";

// ==========================================
// 1. DIRECTIONAL TRINE MATRIX DEFINITIONS
// ==========================================

interface DirectionalGroupDef {
  direction: "East (Dharma / Fire)" | "South (Artha / Earth)" | "West (Kama / Air)" | "North (Moksha / Water)";
  sanskritName: string;
  signIndices: number[]; // 0-indexed
  lifeSignification: string;
}

const DIRECTIONAL_GROUPS: DirectionalGroupDef[] = [
  {
    direction: "East (Dharma / Fire)",
    sanskritName: "Dharma Trikona (धर्म त्रिकोण)",
    signIndices: [0, 4, 8], // Aries, Leo, Sagittarius
    lifeSignification: "Soul purpose, vital fire, sovereign authority, righteous duty, and divine inspiration.",
  },
  {
    direction: "South (Artha / Earth)",
    sanskritName: "Artha Trikona (अर्थ त्रिकोण)",
    signIndices: [1, 5, 9], // Taurus, Virgo, Capricorn
    lifeSignification: "Tangible wealth, professional execution, structural assets, resource management, and commercial endurance.",
  },
  {
    direction: "West (Kama / Air)",
    sanskritName: "Kama Trikona (काम त्रिकोण)",
    signIndices: [2, 6, 10], // Gemini, Libra, Aquarius
    lifeSignification: "Social networks, intellectual partnerships, trade contracts, artistic expression, and global communication.",
  },
  {
    direction: "North (Moksha / Water)",
    sanskritName: "Moksha Trikona (मोक्ष त्रिकोण)",
    signIndices: [3, 7, 11], // Cancer, Scorpio, Pisces
    lifeSignification: "Intuitive perception, emotional transcendence, occult mastery, healing sanctuary, and spiritual liberation.",
  },
];

// ==========================================
// 2. HELPER FUNCTIONS FOR KARAKATWA INTERLOCKING
// ==========================================

function analyzeKarakaBlend(
  karakaName: string,
  targetPlanetName: string,
  ephemeris: EphemerisResult
): SukaNadiKarakaBlend {
  const p = ephemeris.planets[targetPlanetName];
  if (!p) {
    return {
      karakaName,
      planet: targetPlanetName,
      signName: "Unknown",
      degrees: 0,
      conjoinedPlanets: [],
      trinePlanets: [],
      secondHousePlanets: [],
      twelfthHousePlanets: [],
      seventhHousePlanets: [],
      synthesis: "No planetary placement available.",
      primaryArchetype: "Dormant",
      careerAndDestinyImpact: "Neutral",
    };
  }

  const signIdx = Math.floor(p.siderealLongitude / 30);
  const signName = RASHI_NAMES[signIdx]?.englishName || "Unknown";
  const degrees = parseFloat((p.siderealLongitude % 30).toFixed(2));

  const conjoined: string[] = [];
  const trines: string[] = [];
  const secondH: string[] = [];
  const twelfthH: string[] = [];
  const seventhH: string[] = [];

  const trineSign1 = (signIdx + 4) % 12;
  const trineSign2 = (signIdx + 8) % 12;
  const secondSign = (signIdx + 1) % 12;
  const twelfthSign = (signIdx + 11) % 12;
  const seventhSign = (signIdx + 6) % 12;

  for (const [name, otherP] of Object.entries(ephemeris.planets)) {
    if (name === targetPlanetName || otherP.isUpagraha || otherP.isModernPlanet) continue;
    const otherSign = Math.floor(otherP.siderealLongitude / 30);

    if (otherSign === signIdx) conjoined.push(name);
    else if (otherSign === trineSign1 || otherSign === trineSign2) trines.push(name);
    else if (otherSign === secondSign) secondH.push(name);
    else if (otherSign === twelfthSign) twelfthH.push(name);
    else if (otherSign === seventhSign) seventhH.push(name);
  }

  // Synthesize Suka Nadi Sutras based on target planet and connected planets
  let archetype = "";
  let synthesis = "";
  let careerImpact = "";

  const allConnected = [...conjoined, ...trines, ...secondH];

  if (targetPlanetName === "Jupiter") {
    // Jeeva Karaka
    if (allConnected.includes("Saturn")) {
      archetype = "The Karma Yogi & Sovereign Administrator";
      synthesis = "Maharshi Suka states that Jupiter conjoined or trine Saturn forms the supreme Dharma-Karmadhipati Yoga. The native approaches daily duties with sacred detached devotion, ascending to high administrative and institutional authority.";
      careerImpact = "High governance, corporate presidency, judicial stewardship, and large-scale public institutions.";
    } else if (allConnected.includes("Sun")) {
      archetype = "The Royal Sage & Sovereign Advisor";
      synthesis = "Jupiter-Sun linkage infuses the soul with radiant integrity, commanding natural respect from state leaders, mentors, and the wider public.";
      careerImpact = "Government leadership, high-altitude advisory, policymaking, and executive consultancy.";
    } else if (allConnected.includes("Mercury")) {
      archetype = "The Polymath & Master Philosopher";
      synthesis = "Jupiter-Mercury synergy produces immense intellectual eloquence, pedagogical brilliance, and mastery over classical and modern texts.";
      careerImpact = "Academia, literature, legal advocacy, publishing, and international diplomacy.";
    } else if (allConnected.includes("Venus")) {
      archetype = "The Enlightened Harmonizer & Patron of Splendor";
      synthesis = "Jupiter-Venus mutual harmony unites Brahminical wisdom with artistic and material abundance, creating a life of dignified cultural prosperity.";
      careerImpact = "Financial leadership, luxury curation, higher counseling, and cultural foundations.";
    } else if (allConnected.includes("Mars")) {
      archetype = "The Valiant Commander of Truth";
      synthesis = "Jupiter-Mars blend endows sharp logical acuity, fearless executive initiative, and mechanical or technological mastery.";
      careerImpact = "Strategic operations, defense technology, real estate development, and surgery.";
    } else if (allConnected.includes("Ketu")) {
      archetype = "The Jnana Rishi & Mystic Seer";
      synthesis = "Jupiter-Ketu connection forms Jnana Yoga—bestowing deep spiritual detachment, mastery over occult sciences, and intuitive insight.";
      careerImpact = "Spiritual mentorship, consciousness research, astrology, and holistic philosophy.";
    } else if (allConnected.includes("Rahu")) {
      archetype = "The Unconventional Pioneer & Global Innovator";
      synthesis = "Jupiter-Rahu expands consciousness across foreign horizons, prompting breakthrough technological innovation and cross-cultural expansion.";
      careerImpact = "Global business, advanced digital technologies, overseas ventures, and modern media.";
    } else {
      archetype = "The Steadfast Seeker & Ethical Pillar";
      synthesis = `Jupiter situated in ${signName} establishes a noble, serene soul-blueprint dedicated to steady personal and spiritual expansion.`;
      careerImpact = "Balanced professional rise with multi-generational respect and family honor.";
    }
  } else if (targetPlanetName === "Saturn") {
    // Karma Karaka
    if (allConnected.includes("Mercury") && allConnected.includes("Venus")) {
      archetype = "The Master Commerce & Corporate Architect";
      synthesis = "Saturn linked with Mercury and Venus grants extraordinary skill in commercial enterprise, financial engineering, and large enterprise scaling.";
      careerImpact = "Corporate executive, investment banking, trade syndicates, and digital commerce.";
    } else if (allConnected.includes("Mars")) {
      archetype = "The Technical Engineer & Industrial Commander";
      synthesis = "Saturn-Mars connection fuels formidable endurance, mechanical precision, structural engineering capability, and sharp technical execution.";
      careerImpact = "Heavy industry, defense manufacturing, construction, and high-precision technical systems.";
    } else if (allConnected.includes("Sun")) {
      archetype = "The Self-Made Sovereign Leader";
      synthesis = "Saturn-Sun interlocking brings early professional friction with superiors, which alchemizes into formidable independence and sovereign leadership.";
      careerImpact = "Independent enterprise, public administration, state contracting, and foundational manufacturing.";
    } else if (allConnected.includes("Moon")) {
      archetype = "The Global Nomad & Fluid Commodity Pioneer";
      synthesis = "Saturn-Moon linkage creates fluctuating professional cycles with frequent travels, overseas connections, and public-facing endeavors.";
      careerImpact = "International logistics, maritime trade, hospitality, and FMCG supply chains.";
    } else if (allConnected.includes("Rahu")) {
      archetype = "The Maya Karma & Tech Disruptor";
      synthesis = "Saturn-Rahu connection signifies engagement with foreign technologies, cyber architecture, complex machinery, and rapid scaling.";
      careerImpact = "Software architecture, aerospace, artificial intelligence, and global networks.";
    } else if (allConnected.includes("Ketu")) {
      archetype = "The Mukti Karma & Precision Craftsman";
      synthesis = "Saturn-Ketu indicates precision mastery, analytical deconstruction, dispute resolution, and selfless specialized service.";
      careerImpact = "Forensics, specialized auditing, spiritual technology, and niche research.";
    } else {
      archetype = "The Methodical Foundation Builder";
      synthesis = `Saturn in ${signName} imparts enduring patience, meticulous labor, and lasting professional status built upon solid integrity.`;
      careerImpact = "Steady professional ascent with pinnacle leadership achieved in mature years.";
    }
  } else if (targetPlanetName === "Venus") {
    // Bhoga Karaka
    archetype = allConnected.includes("Jupiter") ? "Sovereign Prosperity & Sacred Partnership" : allConnected.includes("Mercury") ? "Aesthetic Intelligence & Commercial Grace" : "Refined Harmonizer & Asset Accumulator";
    synthesis = `Venus in ${signName} interlocks with ${allConnected.length ? allConnected.join(", ") : "serene dignity"}, blessing the native with graceful partnerships, asset growth, and aesthetic refinement.`;
    careerImpact = "Asset acquisition, creative arts, wealth multiplication, and joyous lifestyle.";
  } else {
    archetype = `${targetPlanetName} Nadi Expression`;
    synthesis = `${targetPlanetName} in ${signName} interlocks with ${allConnected.length ? allConnected.join(", ") : "its solitary ray"}.`;
    careerImpact = "Specialized planetary influence in Dasha cycles.";
  }

  return {
    karakaName,
    planet: targetPlanetName,
    signName,
    degrees,
    conjoinedPlanets: conjoined,
    trinePlanets: trines,
    secondHousePlanets: secondH,
    twelfthHousePlanets: twelfthH,
    seventhHousePlanets: seventhH,
    synthesis,
    primaryArchetype: archetype,
    careerAndDestinyImpact: careerImpact,
  };
}

// ==========================================
// 3. MASTER SUKA NADI EVALUATOR
// ==========================================

export function calculateSukaNadi(ephemeris: EphemerisResult): SukaNadiAnalysis {
  // 1. Core Karakatwa Blends
  const jeevaKaraka = analyzeKarakaBlend("Jeeva Karaka (Soul & Self)", "Jupiter", ephemeris);
  const karmaKaraka = analyzeKarakaBlend("Karma Karaka (Profession & Duty)", "Saturn", ephemeris);
  const bhogaKaraka = analyzeKarakaBlend("Bhoga Karaka (Wealth & Marriage)", "Venus", ephemeris);

  const otherKarakas: Record<string, SukaNadiKarakaBlend> = {
    Buddhi: analyzeKarakaBlend("Buddhi Karaka (Intellect & Trade)", "Mercury", ephemeris),
    Shakti: analyzeKarakaBlend("Shakti Karaka (Courage & Technical)", "Mars", ephemeris),
    Pitri: analyzeKarakaBlend("Pitri Karaka (Father & Sovereign)", "Sun", ephemeris),
    Matri: analyzeKarakaBlend("Matri Karaka (Mother & Mind)", "Moon", ephemeris),
    Rahu: analyzeKarakaBlend("Maya Karaka (Foreign & Disruption)", "Rahu", ephemeris),
    Ketu: analyzeKarakaBlend("Mukti Karaka (Moksha & Precision)", "Ketu", ephemeris),
  };

  // 2. Directional Trines (1-5-9, 2-6-10, 3-7-11, 4-8-12)
  const directionalTrines: SukaDirectionalTrine[] = DIRECTIONAL_GROUPS.map((grp) => {
    const planetsInGroup: string[] = [];
    for (const [name, p] of Object.entries(ephemeris.planets)) {
      if (p.isUpagraha || p.isModernPlanet) continue;
      const sIdx = Math.floor(p.siderealLongitude / 30);
      if (grp.signIndices.includes(sIdx)) {
        planetsInGroup.push(name);
      }
    }

    const dominant = planetsInGroup.includes("Jupiter")
      ? "Jupiter"
      : planetsInGroup.includes("Saturn")
      ? "Saturn"
      : planetsInGroup.includes("Sun")
      ? "Sun"
      : planetsInGroup[0] || "None";

    const strength = planetsInGroup.length * 25;

    return {
      direction: grp.direction,
      sanskritName: grp.sanskritName,
      signs: grp.signIndices.map((i) => RASHI_NAMES[i]?.englishName || ""),
      planetsPresent: planetsInGroup,
      dominantPlanet: dominant,
      strengthScore: strength,
      lifeSignification: grp.lifeSignification,
    };
  });

  // 3. Past Life Karma & Classical Suka Pariharas
  const pastLifeKarma: SukaPastLifeKarma[] = [];

  // Check Rahu-Ketu or Saturn-Sun configurations
  const saturnSign = Math.floor((ephemeris.planets.Saturn?.siderealLongitude || 0) / 30);
  const sunSign = Math.floor((ephemeris.planets.Sun?.siderealLongitude || 0) / 30);
  const rahuSign = Math.floor((ephemeris.planets.Rahu?.siderealLongitude || 0) / 30);
  const moonSign = Math.floor((ephemeris.planets.Moon?.siderealLongitude || 0) / 30);

  if (Math.abs(saturnSign - sunSign) === 0 || Math.abs(saturnSign - sunSign) === 6) {
    pastLifeKarma.push({
      karmaPattern: "Pitri Rina (Paternal Karmic Debt & Authority Friction)",
      sanskritTitle: "पितृ ऋण (Pitri Rina)",
      primaryPlanetaryCause: "Saturn aspecting or conjoining Sun across cardinal axes.",
      manifestationInPresentLife: "Initial friction with senior authority figures or father; necessity to forge an independent legacy through personal toil.",
      classicalSukaParihara: "Perform Surya Namaskar at sunrise, offer water with red sandalwood to the Sun, and feed cows with jaggery and wheat on Sundays.",
    });
  }

  if (Math.abs(rahuSign - moonSign) === 0 || Math.abs(rahuSign - moonSign) === 6) {
    pastLifeKarma.push({
      karmaPattern: "Sarpa / Matri Rina (Maternal Lineage & Emotional Restlessness)",
      sanskritTitle: "सर्प / मातृ ऋण (Sarpa & Matri Rina)",
      primaryPlanetaryCause: "Rahu-Moon conjunction or opposition axis.",
      manifestationInPresentLife: "Deep intuitive fluctuations, nocturnal restlessness, and intense karmic lessons through close relationships.",
      classicalSukaParihara: "Rudrabhisheka on Mondays, offering milk to Lord Shiva, and serving one's mother with devoted reverence.",
    });
  }

  if (pastLifeKarma.length === 0) {
    pastLifeKarma.push({
      karmaPattern: "Deva Punya (Sacred Merits & Dharmic Continuity)",
      sanskritTitle: "देव पुण्य (Deva Punya)",
      primaryPlanetaryCause: "Harmonious Jupiterian and Solar alignments across Dharma trines.",
      manifestationInPresentLife: "Innate ethical rectitude, natural protection during life crises, and steady spiritual guidance.",
      classicalSukaParihara: "Continue regular Gayatri Mantra japa, support scholars, and maintain daily gratitude to ancestral deities (Kula Devata).",
    });
  }

  // 4. 12-Year & 30-Year Age Progression Cycles
  const ageCycles: SukaAgeCycle[] = [
    {
      ageWindow: "Ages 0 to 12 (Round 1)",
      cycleType: "Jupiter 12-Year Round",
      activatedHouses: "1st & Dharma Trines",
      karmicMilestone: "Physical grounding, awakening of innate tendencies, and parental nurturing.",
      guidance: "Establishing strong ethical habits and foundational education.",
    },
    {
      ageWindow: "Ages 13 to 24 (Round 2)",
      cycleType: "Jupiter 12-Year Round",
      activatedHouses: "2nd & Artha Trines",
      karmicMilestone: "Intellectual blossoming, academic mastery, and early career trajectory.",
      guidance: "Focusing ambition on ethical knowledge and technical discipline.",
    },
    {
      ageWindow: "Ages 25 to 36 (Round 3)",
      cycleType: "Jupiter 12-Year Round",
      activatedHouses: "3rd & Kama Trines",
      karmicMilestone: "Marriage, major career breakthroughs, and initial wealth consolidation.",
      guidance: "Executing bold constructive enterprises while maintaining marital harmony.",
    },
    {
      ageWindow: "Ages 37 to 48 (Round 4)",
      cycleType: "Jupiter 12-Year Round",
      activatedHouses: "4th & Moksha Trines",
      karmicMilestone: "Peak executive authority, societal mentorship, and institutional leadership.",
      guidance: "Using institutional influence to empower others and create lasting legacy.",
    },
    {
      ageWindow: "Ages 0 to 30 (Round 1)",
      cycleType: "Saturn 30-Year Round",
      activatedHouses: "Karma Seed Axis",
      karmicMilestone: "Foundational struggle, testing of character, and discipline building.",
      guidance: "Patience and humility; planting seeds that bear fruit in the second round.",
    },
    {
      ageWindow: "Ages 31 to 60 (Round 2)",
      cycleType: "Saturn 30-Year Round",
      activatedHouses: "Karma Harvest Axis",
      karmicMilestone: "Fruition of lifelong labor, settlement of karmic debts, and pinnacle worldly status.",
      guidance: "Commanding leadership with ethical accountability and philanthropy.",
    },
  ];

  // 5. Special Suka Nadi Yogas
  const specialYogas: string[] = [];
  if (jeevaKaraka.primaryArchetype.includes("Karma Yogi")) specialYogas.push("🌟 **Karma Yogi Yoga (Guru-Shani Sambandha):** Detached high executive authority.");
  if (jeevaKaraka.primaryArchetype.includes("Jnana")) specialYogas.push("🕉️ **Jnana Yoga (Guru-Ketu Sambandha):** Supreme intuitive and spiritual discernment.");
  if (karmaKaraka.primaryArchetype.includes("Tech Disruptor")) specialYogas.push("⚡ **Maya Karma Yoga (Shani-Rahu Sambandha):** Master of complex foreign technologies and scaling.");
  if (specialYogas.length === 0) specialYogas.push("✨ **Dharmic Progression Yoga:** Balanced expansion through ethical execution.");

  const masterSukaSynthesis = `Sage Shukacharya's Suka Nadi reveals that the native's **Jeeva Karaka (Jupiter)** manifests as **"${jeevaKaraka.primaryArchetype}"**, expressing its highest potential through ${jeevaKaraka.signName}. **Karma Karaka (Saturn)** embodies **"${karmaKaraka.primaryArchetype}"**, guaranteeing that professional labor yields lasting prestige. Primary directional energy converges in **${directionalTrines.sort((a, b) => b.strengthScore - a.strengthScore)[0].direction}**. ${pastLifeKarma[0].karmaPattern} indicates a profound past-life trajectory harmonized through ${pastLifeKarma[0].classicalSukaParihara}.`;

  return {
    jeevaKaraka,
    karmaKaraka,
    bhogaKaraka,
    otherKarakas,
    directionalTrines,
    pastLifeKarma,
    ageCycles,
    specialYogas,
    masterSukaSynthesis,
  };
}
