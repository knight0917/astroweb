/**
 * Comprehensive Layperson Astrology Translation Engine
 * Translates classical Parashari, Jaimini, Ashtakavarga, and Shadbala metrics
 * into empathetic, jargon-free, publication-grade life readings.
 */

import { EphemerisResult, GeoLocation } from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateJaiminiKarakas, calculateArudhaPadas } from "./jaimini";
import { calculateAshtakavarga } from "./ashtakavarga";
import { calculateShadbala } from "./shadbala";
import { calculateInduLagna, calculateBhagyaBindu } from "./samirTripathiSuite";
import { evaluateRamanYogas, RamanYoga } from "./ramanYogas";
import { calculateVimshottariDasha } from "./dasha";

export interface LaypersonReportInput {
  natalEphemeris: EphemerisResult;
  birthDate: Date;
  location: GeoLocation;
  name?: string;
  gender?: "male" | "female" | "other";
}

export interface HouseAnalysis {
  house: number;
  name: string;
  sign: string;
  sanskritSign: string;
  lord: string;
  lordInHouse: number;
  occupants: string[];
  interpretation: string;
  strengthVerdict: string;
}

export interface LaypersonReport {
  nativeProfile: {
    name: string;
    gender: "male" | "female" | "other";
    birthDateFormatted: string;
    birthTimeFormatted: string;
    placeFormatted: string;
    ascendantSign: string;
    moonSign: string;
    sunSign: string;
    birthNakshatra: string;
    cosmicEssence: string;
  };

  bigThree: {
    ascendant: {
      sign: string;
      sanskritSign: string;
      element: "Fire" | "Earth" | "Air" | "Water";
      title: string;
      description: string;
      lifeOrientation: string;
      vitalityAdvice: string;
      lordPlacement: string;
    };
    moon: {
      sign: string;
      sanskritSign: string;
      nakshatra: string;
      title: string;
      description: string;
      emotionalNeeds: string;
      mentalPeaceFormula: string;
    };
    sun: {
      sign: string;
      sanskritSign: string;
      title: string;
      description: string;
      outerDrive: string;
      coreAmbition: string;
    };
  };

  jaiminiArchetypes: {
    atmakaraka: { planet: string; title: string; soulPurpose: string; karmicLesson: string };
    amatyakaraka: { planet: string; title: string; careerPath: string; naturalTalents: string };
    bhratrikaraka: { planet: string; title: string; mentorsAndAllies: string };
    matrikaraka: { planet: string; title: string; emotionalAnchor: string };
    putrakaraka: { planet: string; title: string; creativeGenius: string };
    gnatikaraka: { planet: string; title: string; growthCrucible: string };
    darakaraka: { planet: string; title: string; partnerArchetype: string; relationshipAdvice: string };
    karakamshaSign: string;
    soulCalling: string;
  };

  ashtakavarga: {
    totalSav: number;
    houseScores: {
      house: number;
      title: string;
      points: number;
      rating: "Abundant" | "Balanced" | "Developing";
      meaning: string;
    }[];
    purusharthas: {
      dharma: { score: number; percentage: number; verdict: string };
      artha: { score: number; percentage: number; verdict: string };
      kama: { score: number; percentage: number; verdict: string };
      moksha: { score: number; percentage: number; verdict: string };
    };
    functionalDirections: {
      worship: { direction: string; planet: string; bindus: number; activity: string; guidance: string };
      work: { direction: string; planet: string; bindus: number; activity: string; guidance: string };
      authority: { direction: string; planet: string; bindus: number; activity: string; guidance: string };
      business: { direction: string; planet: string; bindus: number; activity: string; guidance: string };
      fitness: { direction: string; planet: string; bindus: number; activity: string; guidance: string };
      artsAndLove: { direction: string; planet: string; bindus: number; activity: string; guidance: string };
      peace: { direction: string; planet: string; bindus: number; activity: string; guidance: string };
    };
  };

  shadbala: {
    conceptExplanation: string;
    planets: {
      planet: string;
      percentage: number;
      rupas: number;
      status: string;
      horsepowerVerdict: string;
      manifestationPower: string;
    }[];
    topAllies: string[];
    carePlanets: string[];
  };

  arudhaPerception: {
    janmaLagnaSign: string;
    arudhaLagnaSign: string;
    arudhaHouseInD1: number;
    publicImage: string;
    innerTruth: string;
    alignmentAdvice: string;
  };

  twelveHouses: HouseAnalysis[];

  pillars: {
    career: {
      headline: string;
      optimalDomains: string[];
      workEnvironment: string;
      leadershipStyle: string;
      keyStrengths: string;
    };
    wealth: {
      headline: string;
      induLagnaVerdict: string;
      bhagyaBinduPlacement: string;
      savingsCapacity: string;
      incomeStreams: string;
      financialAdvice: string;
    };
    love: {
      headline: string;
      partnerTraits: string;
      compatibilityVibe: string;
      harmonyTips: string;
    };
    health: {
      headline: string;
      constitutionTendency: string;
      vitalityScore: string;
      wellnessRoutine: string;
      sensitiveAreas: string;
    };
  };

  specialYogas: {
    name: string;
    laymanTitle: string;
    category: string;
    potency: number;
    practicalMeaning: string;
    activationAdvice: string;
  }[];

  currentLifeSeason: {
    mahadashaLord: string;
    antardashaLord: string;
    startDate: string;
    endDate: string;
    themeHeadline: string;
    chapterDescription: string;
    whatToEmbrace: string;
    whatToAvoid: string;
    upcomingChapterPreview: string;
  };

  remediesAndPowerTools: {
    luckyDay: string;
    powerColors: string[];
    safeGemstones: string[];
    favorableDirections: string[];
    dailyMindfulPractice: string;
    charityAction: string;
    karmicBalancingAdvice: string;
  };
}

export const RASHI_LORD_MAP: Record<string, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

const RASHI_ELEMENTS: Record<number, "Fire" | "Earth" | "Air" | "Water"> = {
  0: "Fire", 1: "Earth", 2: "Air", 3: "Water",
  4: "Fire", 5: "Earth", 6: "Air", 7: "Water",
  8: "Fire", 9: "Earth", 10: "Air", 11: "Water",
};

const RASHI_TITLES: Record<string, string> = {
  Aries: "The Pioneering Trailblazer",
  Taurus: "The Steadfast Builder & Grounded Provider",
  Gemini: "The Versatile Communicator & Inquisitive Mind",
  Cancer: "The Intuitive Guardian & Empathic Nurturer",
  Leo: "The Magnetic Sovereign & Radiant Creator",
  Virgo: "The Analytical Master & Conscientious Healer",
  Libra: "The Diplomatic Harmonizer & Aesthetic Visionary",
  Scorpio: "The Deep Alchemist & Unwavering Strategist",
  Sagittarius: "The Philosophical Explorer & Truth Seeker",
  Capricorn: "The Pragmatic Architect & Resilient Achiever",
  Aquarius: "The Visionary Reformer & Humanitarian Catalyst",
  Pisces: "The Mystical Dreamer & Compassionate Sage",
};

const PLANET_SOUL_LESSONS: Record<string, { purpose: string; lesson: string }> = {
  Sun: {
    purpose: "Learning pure humility, true selfless leadership, and transcending ego identification.",
    lesson: "Recognizing that your true light shines brightest when empowering others without demanding praise.",
  },
  Moon: {
    purpose: "Mastering emotional serenity, nurturing without attachment, and deep psychological balance.",
    lesson: "Guarding your mental peace from external storms and honoring your instinctive sensitivities.",
  },
  Mars: {
    purpose: "Channeling intense passion, righteous courage, and discipline without rash aggression.",
    lesson: "Directing inner fire toward constructive protection and noble defense rather than defensive anger.",
  },
  Mercury: {
    purpose: "Mastering truthful communication, intellectual integrity, and using knowledge for service.",
    lesson: "Balancing analytical cleverness with heartfelt wisdom and avoiding nervous overthinking.",
  },
  Jupiter: {
    purpose: "Walking the path of higher wisdom, unconditional generosity, spiritual guidance, and truth.",
    lesson: "Teaching and advising without preachiness, maintaining openness to lifelong learning.",
  },
  Venus: {
    purpose: "Elevating human love into unconditional devotion, refining aesthetic beauty, and honoring sacred bonds.",
    lesson: "Finding inner fulfillment so romantic attachments become celebrations rather than dependencies.",
  },
  Saturn: {
    purpose: "Upholding supreme discipline, patience under delay, compassionate endurance, and selfless service.",
    lesson: "Embracing time as your greatest ally; knowing that genuine greatness is constructed brick by deliberate brick.",
  },
  Rahu: {
    purpose: "Venturing into uncharted frontiers, breaking outmoded taboos, and satisfying profound worldly curiosity.",
    lesson: "Anchoring worldly ambitions in spiritual ethics so rapid growth does not trigger disillusionment.",
  },
  Ketu: {
    purpose: "Cultivating profound spiritual detachment, honoring ancestral intuition, and inner enlightenment.",
    lesson: "Trusting your deep gut instincts and letting go of what has already fulfilled its karmic cycle.",
  },
};

const PLANET_CAREER_ARCHETYPES: Record<string, { path: string; talents: string }> = {
  Sun: {
    path: "Executive leadership, government/public administration, entrepreneurship, and authoritative stewardship.",
    talents: "Commanding presence, decisive strategic vision, and natural organizational authority.",
  },
  Moon: {
    path: "Public relations, hospitality, healthcare, creative arts, counseling, and community leadership.",
    talents: "High emotional intelligence, intuitive grasp of public needs, and calming empathetic rapport.",
  },
  Mars: {
    path: "Engineering, defense, emergency response, competitive sports, surgery, construction, and venture leadership.",
    talents: "Unflinching courage under crisis, tactical speed, stamina, and execution excellence.",
  },
  Mercury: {
    path: "Commerce, advisory consulting, software architecture, journalism, finance, and cross-disciplinary media.",
    talents: "Razor-sharp articulation, rapid data synthesis, persuasive negotiation, and commercial acumen.",
  },
  Jupiter: {
    path: "Education, legal counsel, mentorship, corporate strategy, philosophy, and financial wealth advisory.",
    talents: "Big-picture wisdom, ethical credibility, inspiring oratory, and sound prudential judgment.",
  },
  Venus: {
    path: "Design, luxury branding, creative direction, diplomacy, entertainment, and hospitality architecture.",
    talents: "Sophisticated aesthetic judgment, diplomatic negotiation, social charm, and creative storytelling.",
  },
  Saturn: {
    path: "Industrial operations, supply chain, governance, judiciary, civil engineering, and long-term asset management.",
    talents: "Unmatched perseverance, operational thoroughness, structural organization, and crisis endurance.",
  },
};

const PLANET_PARTNER_ARCHETYPES: Record<string, { traits: string; advice: string }> = {
  Sun: {
    traits: "Dignified, principled, ambitious, independent, and possessing an innate sense of nobility and self-respect.",
    advice: "Celebrate their achievements and respect their autonomy; mutual dignity is the cornerstone of harmony.",
  },
  Moon: {
    traits: "Warm, deeply caring, emotionally intuitive, family-oriented, and sensitive to unspoken emotional atmospheres.",
    advice: "Provide a secure, peaceful home atmosphere and listen patiently without invalidating feelings.",
  },
  Mars: {
    traits: "Dynamic, passionate, direct, physically active, courageous, and protective of their loved ones.",
    advice: "Encourage active shared pursuits and resolve conflicts directly and swiftly without passive-aggressive sulking.",
  },
  Mercury: {
    traits: "Witty, communicative, intellectually curious, adaptable, youthful, and enjoying continuous dialogue.",
    advice: "Keep intellectual banter and playful conversation alive; boredom is the only real hazard.",
  },
  Jupiter: {
    traits: "Wise, ethical, generous, optimistic, culturally broad-minded, and a natural mentor or guide.",
    advice: "Honor their higher ethical principles and support their spiritual or educational quests.",
  },
  Venus: {
    traits: "Charming, artistic, romantic, appreciative of luxury and beauty, and seeking gracious partnership.",
    advice: "Regularly express romantic appreciation, create pleasant environments, and nurture aesthetic shared moments.",
  },
  Saturn: {
    traits: "Mature, grounded, extremely loyal, disciplined, dependable, and taking commitments with deep solemnity.",
    advice: "Value their steady loyalty over flashy words; express appreciation for their daily practical reliability.",
  },
};

const HOUSE_NAMES: Record<number, string> = {
  1: "House of Self & Life Blueprint",
  2: "House of Wealth, Family & Speech",
  3: "House of Courage, Effort & Initiatives",
  4: "House of Home, Inner Peace & Mother",
  5: "House of Creative Genius, Intellect & Romance",
  6: "House of Daily Routine, Health & Resilience",
  7: "House of Marriage & Significant Partnerships",
  8: "House of Transformation, Secrets & Intuition",
  9: "House of Fortune, Higher Wisdom & Dharma",
  10: "House of Career, Social Stature & Legacy",
  11: "House of Aspiration, Cash Inflow & Network Circles",
  12: "House of Spiritual Growth, Solitude & Sanctuary",
};

/**
 * Main calculation entry point
 */
export function calculateLaypersonReport(input: LaypersonReportInput): LaypersonReport {
  const { natalEphemeris, birthDate, location, name = "Seeker", gender = "other" } = input;

  const ascLon = natalEphemeris.ascendant.siderealLongitude;
  const ascRashiIdx = Math.floor(ascLon / 30);
  const ascRashi = RASHI_NAMES[ascRashiIdx]?.englishName || "Aries";

  const moonObj = natalEphemeris.planets.Moon;
  const moonLon = moonObj ? moonObj.siderealLongitude : 0;
  const moonRashiIdx = Math.floor(moonLon / 30);
  const moonRashi = RASHI_NAMES[moonRashiIdx]?.englishName || "Aries";
  const moonNakshatra = moonObj?.nakshatra?.sanskritName || "Ashwini";

  const sunObj = natalEphemeris.planets.Sun;
  const sunLon = sunObj ? sunObj.siderealLongitude : 0;
  const sunRashiIdx = Math.floor(sunLon / 30);
  const sunRashi = RASHI_NAMES[sunRashiIdx]?.englishName || "Aries";

  // Ascendant Lord
  const ascLord = RASHI_LORD_MAP[ascRashi] || "Mars";
  const ascLordPlanet = natalEphemeris.planets[ascLord];
  const ascLordHouse = ascLordPlanet?.house || 1;

  // Subsystem Calculations
  const jaimini = calculateJaiminiKarakas(natalEphemeris);
  const arudhas = calculateArudhaPadas(natalEphemeris);
  const ashtakavarga = calculateAshtakavarga(natalEphemeris);
  const shadbala = calculateShadbala(natalEphemeris);
  const induLagna = calculateInduLagna(natalEphemeris);
  const bhagyaBindu = calculateBhagyaBindu(natalEphemeris);
  const ramanYogas = evaluateRamanYogas(natalEphemeris);
  const dashaResult = calculateVimshottariDasha(birthDate, moonLon, new Date());

  // 1. Native Profile Formatting
  const dateFormatted = birthDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeFormatted = birthDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const placeFormatted = `${location.cityName}${location.country ? `, ${location.country}` : ""}`;

  const cosmicEssence = `You are born under the celestial imprint of ${ascRashi} rising, anchoring your physical presence with ${RASHI_ELEMENTS[ascRashiIdx].toLowerCase()} vitality. Internally, your emotional pulse is calibrated to ${moonRashi} in the sacred nakshatra of ${moonNakshatra}, while your conscious vitality and outer mission are ignited by the ${sunRashi} Sun. Your life path is directed primarily toward the domains of House ${ascLordHouse}, where your chart ruler ${ascLord} concentrates your personal willpower.`;

  // 2. The Big Three Breakdown
  const ascElement = RASHI_ELEMENTS[ascRashiIdx];
  const bigThree = {
    ascendant: {
      sign: ascRashi,
      sanskritSign: natalEphemeris.ascendant.rashi.sanskritName,
      element: ascElement,
      title: RASHI_TITLES[ascRashi] || "The Ascendant Soul",
      description: `Your Ascendant (Rising Sign) is your life portal—it shapes your physical vitality, your instinctive reaction to new environments, and how you naturally project into the world. Rising as ${ascRashi}, you bring an innate ${ascElement.toLowerCase()} temperament to your surroundings.`,
      lifeOrientation: `Your primary chart sovereign is ${ascLord}, positioned in your ${HOUSE_NAMES[ascLordHouse]}. This reveals that your destiny continually draws you toward the development and mastery of this specific life arena.`,
      vitalityAdvice: `Maintain body rhythm aligned with the ${ascElement} element. Stay hydrated, prioritize regular physical movement, and ground yourself in steady natural environments.`,
      lordPlacement: `${ascLord} in House ${ascLordHouse}`,
    },
    moon: {
      sign: moonRashi,
      sanskritSign: moonObj?.rashi?.sanskritName || "",
      nakshatra: moonNakshatra,
      title: RASHI_TITLES[moonRashi] || "The Emotional Heart",
      description: `Your Moon sign represents your mind (Manas), emotional sanctuary, and subconscious comfort zones. In ${moonRashi} (${moonNakshatra}), your emotional processing is naturally deep, instinctive, and protective.`,
      emotionalNeeds: `You feel safest when your inner world is respected, when you have room to decompress without harsh judgment, and when your loved ones offer transparent loyalty.`,
      mentalPeaceFormula: `To restore emotional equilibrium, embrace water and stillness. Avoid making major reactive choices when feeling drained or hurried.`,
    },
    sun: {
      sign: sunRashi,
      sanskritSign: sunObj?.rashi?.sanskritName || "",
      title: RASHI_TITLES[sunRashi] || "The Outer Drive",
      description: `Your Sun sign illuminates your core soul essence, personal dignity, and outer leadership drive. Positioned in ${sunRashi}, your executive willpower thrives on purposeful creation and earned respect.`,
      outerDrive: `You naturally gravitate toward initiatives where your authority, creativity, and integrity can be demonstrated without unnecessary micromanagement.`,
      coreAmbition: `Building a lasting personal reputation grounded in genuine competence, moral clarity, and uplifting those around you.`,
    },
  };

  // 3. Jaimini 7 Soul Archetypes
  const ak = jaimini.atmakaraka;
  const amk = jaimini.amatyakaraka;
  const bk = jaimini.bhratrikaraka;
  const mk = jaimini.matrikaraka;
  const pk = jaimini.putrakaraka;
  const gk = jaimini.gnatikaraka;
  const dk = jaimini.darakaraka;

  const jaiminiArchetypes = {
    atmakaraka: {
      planet: ak.planetName,
      title: "The Soul's Sovereign (Atmakaraka)",
      soulPurpose: PLANET_SOUL_LESSONS[ak.planetId]?.purpose || "Discovering inner freedom and spiritual mastery.",
      karmicLesson: PLANET_SOUL_LESSONS[ak.planetId]?.lesson || "Embracing patience and compassionate action.",
    },
    amatyakaraka: {
      planet: amk.planetName,
      title: "The Career Pathfinder (Amatyakaraka)",
      careerPath: PLANET_CAREER_ARCHETYPES[amk.planetId]?.path || "Executive, consultative, and strategic leadership.",
      naturalTalents: PLANET_CAREER_ARCHETYPES[amk.planetId]?.talents || "Strategic planning and focused execution.",
    },
    bhratrikaraka: {
      planet: bk.planetName,
      title: "Gurus & Spiritual Allies (Bhratrikaraka)",
      mentorsAndAllies: `Governed by ${bk.planetName}. Your spiritual mentors, supportive guides, and trusted comrades are characterized by ${bk.planetName}'s virtues. Seeking advice from people embodying this archetype unlocks major doors.`,
    },
    matrikaraka: {
      planet: mk.planetName,
      title: "The Emotional Anchor & Home (Matrikaraka)",
      emotionalAnchor: `Reflected through ${mk.planetName}. Your inner peace and maternal blessings are nourished by creating harmonious living spaces and grounding your emotions in consistent, loving environments.`,
    },
    putrakaraka: {
      planet: pk.planetName,
      title: "Creative Genius & Progeny (Putrakaraka)",
      creativeGenius: `Governed by ${pk.planetName}. Your natural problem-solving brilliance and intellectual innovations thrive when you engage in open-ended learning, arts, or mentoring younger minds.`,
    },
    gnatikaraka: {
      planet: gk.planetName,
      title: "The Growth Crucible & Obstacles (Gnatikaraka)",
      growthCrucible: `Symbolized by ${gk.planetName}. The obstacles, competitors, and friction points in your life are tailored by this energy. Every challenge you conquer under this planet directly expands your resilience and wisdom.`,
    },
    darakaraka: {
      planet: dk.planetName,
      title: "The Romantic Partner Archetype (Darakaraka)",
      partnerArchetype: PLANET_PARTNER_ARCHETYPES[dk.planetId]?.traits || "Loving, supportive, loyal, and balanced.",
      relationshipAdvice: PLANET_PARTNER_ARCHETYPES[dk.planetId]?.advice || "Communicate with transparency and celebrate mutual growth.",
    },
    karakamshaSign: ak.rashi.englishName,
    soulCalling: `With your Atmakaraka radiating in ${ak.rashi.englishName}, your soul finds its highest fulfillment when balancing practical worldly achievements with conscious inner integrity.`,
  };

  // 4. Ashtakavarga Energy Matrix & Functional Directions
  const houseScores = ashtakavarga.sarvaHouseBindus.map((pts: number, idx: number) => {
    const hNum = idx + 1;
    let rating: "Abundant" | "Balanced" | "Developing" = "Balanced";
    let meaning = "Balanced flow of energy; yields steady results through regular engagement.";
    if (pts >= 30) {
      rating = "Abundant";
      meaning = "Supercharged cosmic reserve; this life area brings natural support, ease, and effortless dividends.";
    } else if (pts < 25) {
      rating = "Developing";
      meaning = "Conscious cultivation zone; requires deliberate discipline and patience to build enduring strength.";
    }
    return {
      house: hNum,
      title: HOUSE_NAMES[hNum] || `House ${hNum}`,
      points: pts,
      rating,
      meaning,
    };
  });

  const dirs = ashtakavarga.directionalAnalysis.overall.directions;
  const east = dirs.find((d) => d.direction === "East")?.bindus || 80;
  const south = dirs.find((d) => d.direction === "South")?.bindus || 80;
  const west = dirs.find((d) => d.direction === "West")?.bindus || 80;
  const north = dirs.find((d) => d.direction === "North")?.bindus || 80;

  const purusharthas = {
    dharma: {
      score: east,
      percentage: Math.round((east / 337) * 100),
      verdict: east >= 85 ? "High moral purpose and natural clarity of self-direction." : "Balanced ethical focus.",
    },
    artha: {
      score: south,
      percentage: Math.round((south / 337) * 100),
      verdict: south >= 85 ? "Strong material endurance and high productivity stamina." : "Steady financial consistency.",
    },
    kama: {
      score: west,
      percentage: Math.round((west / 337) * 100),
      verdict: west >= 85 ? "Powerful social ambition, networking reach, and strong life desires." : "Balanced social interactions.",
    },
    moksha: {
      score: north,
      percentage: Math.round((north / 337) * 100),
      verdict: north >= 85 ? "Deep intuitive faculties, spiritual thirst, and restorative inner calm." : "Peaceful reflective balance.",
    },
  };

  // Planet-specific functional directions based on BAV
  const pDirs = ashtakavarga.directionalAnalysis.planetDirections;
  const getPlanetBestDir = (pId: string, fallback: string) => {
    const pBav = pDirs[pId];
    if (!pBav) return { dir: fallback, bindus: 12 };
    return { dir: pBav.bestDirection, bindus: pBav.bestBindus };
  };

  const jupDir = getPlanetBestDir("Jupiter", "East");
  const satDir = getPlanetBestDir("Saturn", "West");
  const sunDir = getPlanetBestDir("Sun", "East");
  const merDir = getPlanetBestDir("Mercury", "North");
  const marDir = getPlanetBestDir("Mars", "South");
  const venDir = getPlanetBestDir("Venus", "North");
  const mooDir = getPlanetBestDir("Moon", "North");

  const functionalDirections = {
    worship: {
      direction: jupDir.dir,
      planet: "Jupiter (Guru)",
      bindus: jupDir.bindus,
      activity: "Spiritual Altar, Puja, Meditation & Sacred Study",
      guidance: `Face toward or place your prayer space in the ${jupDir.dir} of your home, where Jupiter radiates highest spiritual beneficence (${jupDir.bindus} bindus).`,
    },
    work: {
      direction: satDir.dir,
      planet: "Saturn (Shani)",
      bindus: satDir.bindus,
      activity: "Work Desk, Focused Routine & Career Projects",
      guidance: `Arrange your main office or study desk facing the ${satDir.dir}, where Saturn provides maximum discipline and endurance (${satDir.bindus} bindus).`,
    },
    authority: {
      direction: sunDir.dir,
      planet: "Sun (Surya)",
      bindus: sunDir.bindus,
      activity: "Executive Decisions, Public Visibility & Leadership",
      guidance: `Make critical career and financial decisions facing the ${sunDir.dir}, where the Sun grants peak clarity and sovereignty (${sunDir.bindus} bindus).`,
    },
    business: {
      direction: merDir.dir,
      planet: "Mercury (Budha)",
      bindus: merDir.bindus,
      activity: "Commercial Trading, Accounting, Sales & Writing",
      guidance: `Conduct contracts, bookkeeping, and communications facing the ${merDir.dir}, where Mercury maximizes intellectual agility (${merDir.bindus} bindus).`,
    },
    fitness: {
      direction: marDir.dir,
      planet: "Mars (Mangala)",
      bindus: marDir.bindus,
      activity: "Physical Workouts, Sports & Kitchen Energy",
      guidance: `Align your workout equipment and energy-intensive activities in the ${marDir.dir}, where Mars channels active vigor safely (${marDir.bindus} bindus).`,
    },
    artsAndLove: {
      direction: venDir.dir,
      planet: "Venus (Shukra)",
      bindus: venDir.bindus,
      activity: "Creative Arts, Aesthetic Wardrobe & Romance",
      guidance: `Place artwork, wardrobe, and intimate conversational seating in the ${venDir.dir}, where Venus optimizes grace and harmony (${venDir.bindus} bindus).`,
    },
    peace: {
      direction: mooDir.dir,
      planet: "Moon (Chandra)",
      bindus: mooDir.bindus,
      activity: "Mental Relaxation, Dining & Hydration Recharging",
      guidance: `Unwind, read, and take restorative breaks in the ${mooDir.dir}, where the Moon brings soothing mental tranquility (${mooDir.bindus} bindus).`,
    },
  };

  // 5. Shadbala Manifestation Horsepower
  const shadbalaConcept = "In Vedic astrology, a planet's sign and house show what it promises, but Shadbala measures its real-world manifestation horsepower—whether the planet has the physical fuel to deliver its promises in your daily life. A planet with over 100% strength acts like an effortless, high-performance engine. A planet under 100% has noble intentions but requires conscious habits and external support to cross the finish line.";

  const shadbalaPlanets = shadbala.rankedPlanets.map((p) => {
    const pct = Math.round(p.percentageEfficiency);
    let horsepowerVerdict = "Supercharged Engine (delivers easily with minimal friction)";
    if (pct >= 130) {
      horsepowerVerdict = "Maximum Horsepower: Effortless real-world manifestation and immense crisis resilience.";
    } else if (pct >= 100) {
      horsepowerVerdict = "Robust Engine: Delivers its life promises smoothly when its timing arrives.";
    } else if (pct >= 85) {
      horsepowerVerdict = "Moderate Engine: Steady delivery, but benefits from conscious routines and focus.";
    } else {
      horsepowerVerdict = "Developing Engine: Requires proactive support and patience to reach full fruition.";
    }

    return {
      planet: p.name,
      percentage: pct,
      rupas: p.totalRupas,
      status: p.statusText,
      horsepowerVerdict,
      manifestationPower: `${p.name} operates at ${pct}% of its required Parashari strength (${p.totalRupas} Rupas).`,
    };
  });

  const topAllies = shadbala.rankedPlanets.slice(0, 2).map((p) => p.name);
  const carePlanets = shadbala.rankedPlanets
    .filter((p) => p.percentageEfficiency < 100)
    .map((p) => p.name);

  // 6. Arudha Lagna vs Janma Lagna (Perception vs Reality)
  const alPada = arudhas.find((a) => a.code === "AL") || arudhas[0];
  const alSign = alPada ? alPada.padaSign.englishName : ascRashi;
  const alHouse = alPada ? alPada.padaHouse : 1;

  const arudhaPerception = {
    janmaLagnaSign: ascRashi,
    arudhaLagnaSign: alSign,
    arudhaHouseInD1: alHouse,
    publicImage: `To the outer world, society perceives you through the lens of ${alSign} (projecting into House ${alHouse} of your chart). People view you as having the qualities of ${alSign}—admiring your status, competence, and public demeanor through this archetype.`,
    innerTruth: `Behind closed doors, your authentic self is the core essence of ${ascRashi}. While society sees your ${alSign} facade, your true motivations, vulnerable needs, and instinctive values operate entirely under ${ascRashi}.`,
    alignmentAdvice: `Harmony arises when you do not mistake public expectations (${alSign}) for your soul's authentic private needs (${ascRashi}). Honor both without letting public image deplete your true inner vitality.`,
  };

  // 7. The 12 Houses of Life Deep-Dive
  const houseOccupants: Record<number, string[]> = {};
  for (let i = 1; i <= 12; i++) houseOccupants[i] = [];

  Object.entries(natalEphemeris.planets).forEach(([pName, pObj]) => {
    if (pObj && pObj.house >= 1 && pObj.house <= 12) {
      houseOccupants[pObj.house].push(pName);
    }
  });

  const twelveHouses: HouseAnalysis[] = [];
  for (let h = 1; h <= 12; h++) {
    const signIdx = (ascRashiIdx + (h - 1)) % 12;
    const signName = RASHI_NAMES[signIdx]?.englishName || "Aries";
    const sanskritSign = RASHI_NAMES[signIdx]?.sanskritName || "Mesha";
    const lord = RASHI_LORD_MAP[signName] || "Mars";
    const lordObj = natalEphemeris.planets[lord];
    const lordHouse = lordObj?.house || 1;
    const occupants = houseOccupants[h] || [];

    let strengthVerdict = "Balanced Foundation";
    if (occupants.length >= 2) strengthVerdict = "Dynamic Active Focus (Multiple Planetary Influences)";
    else if (occupants.length === 1) strengthVerdict = `Energized by ${occupants[0]}`;
    else strengthVerdict = `Governed smoothly by lord ${lord} in House ${lordHouse}`;

    const occStr = occupants.length > 0
      ? `Energized by resident planets: ${occupants.join(", ")}.`
      : `Governed by ruler ${lord}, who pours energy into House ${lordHouse}.`;

    const interpretation = `${HOUSE_NAMES[h]} is anchored in the sign of ${signName}. ${occStr} This creates a natural life theme where the affairs of this house unfold through deliberate cultivation and express your core ${signName} traits.`;

    twelveHouses.push({
      house: h,
      name: HOUSE_NAMES[h],
      sign: signName,
      sanskritSign,
      lord,
      lordInHouse: lordHouse,
      occupants,
      interpretation,
      strengthVerdict,
    });
  }

  // 8. The 4 Life Pillars Synthesis
  // Career (10th house & AmK)
  const h10 = twelveHouses[9];
  const careerDomains = [
    PLANET_CAREER_ARCHETYPES[amk.planetId]?.path || "Executive management, strategic innovation, and specialized consultancy.",
    `Industry initiatives resonating with your 10th sign (${h10.sign}) and ruled by ${h10.lord}.`,
    "Collaborative leadership where your analytical and empathetic strengths are valued.",
  ];

  // Wealth (2nd & 11th houses, Indu Lagna)
  const h2 = twelveHouses[1];
  const h11 = twelveHouses[10];
  const wealth = {
    headline: `Abundance flow anchored by House 2 (${h2.sign}) and House 11 (${h11.sign})`,
    induLagnaVerdict: induLagna
      ? `Your Indu Lagna (Special Wealth Pivot) rests in ${induLagna.induLagnaRashi.englishName} in House ${induLagna.induLagnaHouseFromD1}: ${induLagna.wealthVerdict}`
      : "Steady financial potential through consistent professional compounding.",
    bhagyaBinduPlacement: bhagyaBindu
      ? `Your Bhagya Bindu (Fortune Point) is activated in ${bhagyaBindu.rashi.englishName} (House ${bhagyaBindu.house}). Serendipitous breakthroughs arrive when engaging in higher learning, ethical ventures, and collaborative integrity.`
      : "Fortunate windfalls align through sustained persistence.",
    savingsCapacity: `High financial discipline is advised around ${h2.sign}'s tendencies. Building automated savings buffers ensures sustained peace of mind.`,
    incomeStreams: `Income inflows are stimulated through House 11 (${h11.sign}), thriving on multi-channel professional networks and modern value creation.`,
    financialAdvice: "Invest in tangible appreciating assets, avoid speculative gambling during low-energy cycles, and keep clear accounting.",
  };

  // Love & Marriage (7th house & DK)
  const h7 = twelveHouses[6];
  const love = {
    headline: `Committed partnerships shaped by House 7 in ${h7.sign} and Darakaraka ${dk.planetName}`,
    partnerTraits: PLANET_PARTNER_ARCHETYPES[dk.planetId]?.traits || "Loyal, supportive, and emotionally grounded.",
    compatibilityVibe: `You bond best with a companion who respects your freedom, matches your intellectual curiosity, and provides steady emotional reassurance without drama.`,
    harmonyTips: PLANET_PARTNER_ARCHETYPES[dk.planetId]?.advice || "Practice daily open dialogue and celebrate shared goals.",
  };

  // Health & Well-being
  let constitution = "Pitta-Vata (Fiery dynamism combined with quick mental velocity)";
  if (ascElement === "Water" || ascElement === "Earth") {
    constitution = "Kapha-Pitta (Enduring physical stamina with balanced metabolic fire)";
  } else if (ascElement === "Air") {
    constitution = "Vata-Predominant (Quick nervous reflexes requiring grounding rest and regular warm meals)";
  }

  const health = {
    headline: `Physical vitality governed by ${ascRashi} rising and Lagna Lord ${ascLord}`,
    constitutionTendency: constitution,
    vitalityScore: `${topAllies.includes(ascLord) ? "Robust & Highly Resilient" : "Steady with Need for Balance"}`,
    wellnessRoutine: "Prioritize consistent sleep schedules, mindful breathwork (Pranayama), daily hydration, and nature walks.",
    sensitiveAreas: `Guard your digestive metabolism and nervous system; avoid chronic stress and excessive screen fatigue during intense deadlines.`,
  };

  // 9. Special Cosmic Blessings (Yogas)
  const LAYMAN_YOGA_TITLES: Record<string, string> = {
    "Gajakesari Yoga": "The Wisdom & Respect Magnet",
    "Budhaditya Yoga": "The Brilliant Intellect & Articulate Speaker",
    "Chandra-Mangala Yoga": "The Enterprising Wealth Generator",
    "Ruchaka Yoga": "The Fearless Commander (Pancha Mahapurusha)",
    "Bhadra Yoga": "The Master Intellectual & Scholar (Pancha Mahapurusha)",
    "Hamsa Yoga": "The Benevolent Sage & Sovereign (Pancha Mahapurusha)",
    "Malavya Yoga": "The Gracious Artist & Aesthetic Magnet (Pancha Mahapurusha)",
    "Sasa Yoga": "The Enduring Strategist & Patient Ruler (Pancha Mahapurusha)",
    "Saraswati Yoga": "The Creative & Scholarly Blessing",
    "Amala Yoga": "The Untarnished Reputation Combination",
    "Parvata Yoga": "The Ever-Ascending Fortunate Foundation",
    "Kahala Yoga": "The Courageous Achiever",
    "Vipareeta Raja Yoga": "The Phoenix: Triumph Through Adversity",
    "Dhana Yoga": "The Steady Stream of Prosperity",
    "Raja Yoga": "The Natural Leadership & Authority Alignment",
  };

  const activeYogas = ramanYogas.yogas
    .filter((y: RamanYoga) => !y.isCancelled)
    .slice(0, 6)
    .map((y: RamanYoga) => ({
      name: y.name,
      laymanTitle: LAYMAN_YOGA_TITLES[y.name] || `${y.name} (Special Planetary Blessing)`,
      category: y.category,
      potency: Math.round(y.potencyPercent),
      practicalMeaning: y.practicalEffects || y.classicalDescription,
      activationAdvice: `Activated during the periods and transits of: ${y.participatingGrahas.join(", ")}. Nurture this combination through ethical action and focused competence.`,
    }));

  // Fallback if no specific high-profile yogas found
  if (activeYogas.length === 0) {
    activeYogas.push({
      name: "Dhana-Raja Blessing",
      laymanTitle: "The Steadfast Prosperity Combination",
      category: "Raja Yoga & Eminence",
      potency: 85,
      practicalMeaning: "Harmonious planetary angular relationships that grant earned success, trustworthy alliances, and compounding prosperity through honest enterprise.",
      activationAdvice: "Stay committed to lifelong mastery; compounding efforts yield extraordinary results.",
    });
  }

  // 10. Current Life Season (Dasha Timeline)
  const activeDasha = dashaResult.activeDasha;
  const mdLord = activeDasha?.mahadasha.name || "Jupiter";
  const adLord = activeDasha?.antardasha.name || "Saturn";
  const adEndMonthYear = activeDasha?.adEnd
    ? activeDasha.adEnd.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Upcoming Phase";

  const currentLifeSeason = {
    mahadashaLord: mdLord,
    antardashaLord: adLord,
    startDate: activeDasha?.adStart ? activeDasha.adStart.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recent Past",
    endDate: adEndMonthYear,
    themeHeadline: `Living under the Major Cycle of ${mdLord} with Sub-Focus on ${adLord}`,
    chapterDescription: `You are currently experiencing a significant life chapter ruled by ${mdLord}, fine-tuned by the sub-influence of ${adLord} running until ${adEndMonthYear}. This season places strong emphasis on maturing your responsibilities, building structural security, and refining your core personal priorities.`,
    whatToEmbrace: `Focus on disciplined step-by-step progress, deepening specialized skills, and solidifying your inner values. Long-term initiatives planted now yield rich fruits.`,
    whatToAvoid: `Avoid seeking impatient shortcuts or getting frustrated by deliberate pacing. Honor the maturation timeline of this period.`,
    upcomingChapterPreview: `Following this sub-period, your next seasonal transition will invite renewed momentum and expanding horizons through the subsequent planetary cycle.`,
  };

  // 11. Authentic Remedies & Auspicious Power Tools
  const DAY_MAPPINGS: Record<string, string> = {
    Sun: "Sunday", Moon: "Monday", Mars: "Tuesday", Mercury: "Wednesday",
    Jupiter: "Thursday", Venus: "Friday", Saturn: "Saturday",
  };

  const luckyDay = DAY_MAPPINGS[ascLord] || "Thursday";

  const COLOR_MAPPINGS: Record<string, string[]> = {
    Sun: ["Golden Amber", "Warm Saffron", "Rich Copper"],
    Moon: ["Silvery White", "Pearl Cream", "Seafoam Blue"],
    Mars: ["Deep Coral", "Crimson Red", "Warm Terra Cotta"],
    Mercury: ["Emerald Green", "Sage Mint", "Fresh Olive"],
    Jupiter: ["Vibrant Yellow", "Royal Gold", "Warm Honey"],
    Venus: ["Diamond White", "Rose Quartz Pink", "Pastel Lavender"],
    Saturn: ["Royal Navy", "Deep Charcoal", "Midnight Sapphire"],
  };

  const powerColors = COLOR_MAPPINGS[ascLord] || ["Royal Navy", "Gold", "Ivory"];

  const GEMSTONE_MAPPINGS: Record<string, string[]> = {
    Sun: ["Ruby (Manikya) or Red Garnet", "Sunstone"],
    Moon: ["Natural Pearl (Moti) or Moonstone"],
    Mars: ["Red Coral (Moonga) or Carnelian"],
    Mercury: ["Emerald (Panna) or Green Tourmaline"],
    Jupiter: ["Yellow Sapphire (Pukhraj) or Topaz / Citrine"],
    Venus: ["Diamond (Heera) or White Zircon / Opal"],
    Saturn: ["Blue Sapphire (Neelam) or Amethyst / Iolite"],
  };

  const safeGemstones = GEMSTONE_MAPPINGS[ascLord] || ["Yellow Sapphire", "Pearl", "Moonstone"];

  const remediesAndPowerTools = {
    luckyDay,
    powerColors,
    safeGemstones,
    favorableDirections: [jupDir.dir, sunDir.dir, "Northeast (Ishanya)"],
    dailyMindfulPractice: "Daily 5-minute silent contemplation, practicing gratitude upon waking, and regular recitation of the sacred Gayatri Mantra or Mahamrityunjaya Mantra for mental clarity and protection.",
    charityAction: `Perform acts of selfless kindness on ${luckyDay}s—such as offering clean food to students, feeding birds/animals, or supporting educational causes.`,
    karmicBalancingAdvice: `Harmonize your chart energies by honoring your parents and elders, speaking truth with gentleness, and maintaining clean, clutter-free personal spaces.`,
  };

  return {
    nativeProfile: {
      name,
      gender,
      birthDateFormatted: dateFormatted,
      birthTimeFormatted: timeFormatted,
      placeFormatted,
      ascendantSign: ascRashi,
      moonSign: moonRashi,
      sunSign: sunRashi,
      birthNakshatra: moonNakshatra,
      cosmicEssence,
    },
    bigThree,
    jaiminiArchetypes,
    ashtakavarga: {
      totalSav: ashtakavarga.totalSAV,
      houseScores,
      purusharthas,
      functionalDirections,
    },
    shadbala: {
      conceptExplanation: shadbalaConcept,
      planets: shadbalaPlanets,
      topAllies,
      carePlanets,
    },
    arudhaPerception,
    twelveHouses,
    pillars: {
      career: {
        headline: `Professional destiny anchored in House 10 (${h10.sign}) and Amatyakaraka ${amk.planetName}`,
        optimalDomains: careerDomains,
        workEnvironment: "Dynamic, respected settings where personal autonomy, intellectual integrity, and meritocracy guide decision-making.",
        leadershipStyle: "Inspirational, strategic, and calm under operational complexity.",
        keyStrengths: "Long-range vision, decisive judgment, and steady reliability.",
      },
      wealth,
      love,
      health,
    },
    specialYogas: activeYogas,
    currentLifeSeason,
    remediesAndPowerTools,
  };
}
