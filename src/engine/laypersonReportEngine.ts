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
import { calculateGochar } from "./gochar";
import { calculateVedicEphemeris } from "./ephemeris";
import { detectVedicYogas } from "./yogas";
import { calculateVargaSign } from "./shodashavarga";
import { evaluateKarakamsha, evaluateUpapadaLagna } from "./jaiminiSutras";
import { detectRahuConjunctions, NodalConjunctionReport } from "./rahuConjunctionsMaster";
import { synthesizeBphsKarmicShanti, BphsKarmicShantiReport } from "./bphsKarmicShanti";
import { evaluateProgenyMaster, ProgenyMasterReport } from "./progenyMaster";

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
    essenceBreakdown: {
      outerPresence: {
        title: string;
        observableDemeanor: string;
        socialPresence: string;
        firstImpression: string;
      };
      emotionalEngine: {
        title: string;
        psychologyOverview: string;
        observableBehaviors: string;
        relationalStyle: string;
        triggersAndBoundaries: string;
        signatureSuperpower: string;
      };
      consciousMission: {
        title: string;
        consciousAmbition: string;
        leadershipStyle: string;
      };
      lifeFocus: {
        title: string;
        arenaTitle: string;
        lifeFocus: string;
      };
    };
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
      dharma: { score: number; percentage: number; element: string; elementSanskrit: string; houses: number[]; verdict: string };
      artha: { score: number; percentage: number; element: string; elementSanskrit: string; houses: number[]; verdict: string };
      kama: { score: number; percentage: number; element: string; elementSanskrit: string; houses: number[]; verdict: string };
      moksha: { score: number; percentage: number; element: string; elementSanskrit: string; houses: number[]; verdict: string };
      dominantPillar: {
        id: "dharma" | "artha" | "kama" | "moksha";
        title: string;
        score: number;
        percentage: number;
        element: string;
        elementSanskrit: string;
        houses: number[];
        coreMeaning: string;
        lifeApplication: string;
        pitfallToWatch: string;
      };
    };
    functionalDirections: {
      worship: { direction: string; planet: string; bindus: number; activity: string; guidance: string };
      work: { direction: string; planet: string; bindus: number; activity: string; guidance: string };
      authority: { direction: string; planet: string; bindus: number; activity: string; guidance: string };
      business: { direction: string; planet: string; bindus: number; activity: string; guidance: string };
      fitness: { direction: string; planet: string; bindus: number; activity: string; guidance: string };
      artsAndLove: { direction: string; planet: string; bindus: number; activity: string; guidance: string };
      peace: { direction: string; planet: string; bindus: number; activity: string; guidance: string };
      cardinalPowerZone?: {
        direction: string;
        activitiesCount: number;
        activities: string[];
        explanation: string;
      };
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

  destinyTimeline: {
    currentAge: number;
    activeCycleHeadline: string;
    pastMilestones: { age: number; title: string; theme: string; outcome: string }[];
    currentMilestone: { age: number; title: string; theme: string; focus: string; guidance: string };
    futureWindows: { age: number; title: string; theme: string; unlockOpportunity: string }[];
  };

  karmicWeather: {
    sadeSati: {
      hasSadeSati: boolean;
      hasDhaiya: boolean;
      statusTitle: string;
      phaseName: string;
      severity: "High" | "Moderate" | "Mild" | "None";
      description: string;
      remedies: string[];
      completionFormatted?: string;
    };
    jupiterTransit: {
      transitSign: string;
      houseFromMoon: number;
      houseFromLagna: number;
      isAuspicious: boolean;
      blessingTheme: string;
    };
    rahuKetuAxis: {
      rahuSign: string;
      ketuSign: string;
      rahuHouseFromMoon: number;
      ketuHouseFromMoon: number;
      karmicEvolutionTheme: string;
    };
    vedhaTelemetry: {
      obstructedCount: number;
      shieldedCount: number;
      transitsWithVedha: {
        planet: string;
        symbol: string;
        houseFromMoon: number;
        transitSign: string;
        netEfficacy: string;
        isObstructed: boolean;
        obstructingPlanets: string[];
        vedhaHouse?: number;
        isVipareetaVedha: boolean;
        shieldingPlanets: string[];
        vedhaExplanation?: string;
      }[];
    };
  };

  rahuConjunctions: NodalConjunctionReport;
  karmicCursesAndShanti: BphsKarmicShantiReport;
  progenyBlueprint: ProgenyMasterReport;

  sacredPartner: {
    spousePersona: string;
    physicalAndSocialVibe: string;
    temperamentAndValues: string;
    complementaryDynamic: string;
    karmicBondType: string;
    upapadaLagna: {
      sign: string;
      houseInD1: number;
      harmonyScore: number;
      longevityVerdict: string;
      sacredRemedy: string;
    };
  };

  wealthYogas: {
    induLagna: {
      sign: string;
      houseInD1: number;
      lord: string;
      verdict: string;
      strategy: string;
    };
    activeYogas: {
      name: string;
      sanskritName: string;
      category: string;
      participatingGrahas: string[];
      manifestation: string;
      activationTip: string;
    }[];
    financialMindsetVerdict: string;
  };

  ishtaDevata: {
    atmakarakaPlanet: string;
    karakamshaSign: string;
    twelfthSignFromKL: string;
    ishtaDevataName: string;
    spiritualPath: string;
    sacredMantra: string;
    dharmaDevata: string;
    soulLesson: string;
  };

  pocketCard: {
    fullName: string;
    cosmicSignature: string;
    akAndAmk: string;
    dominantPillar: string;
    powerDirection: string;
    karmicWeatherSummary: string;
    safeGemstone: string;
    dailyMantra: string;
    luckyDayAndHours: string;
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

export const ASCENDANT_OBSERVABLE_TRAITS: Record<
  string,
  { observableDemeanor: string; socialPresence: string; firstImpression: string }
> = {
  Aries: {
    observableDemeanor: "Dynamic, decisive, and brisk in movement. You carry an urgent physical vitality, walk with clear purpose, and naturally take the lead without waiting for permissions.",
    socialPresence: "Speaks candidly, cuts through diplomatic fluff, and prefers immediate action over endless discussions. You energize groups and inject momentum into stagnant situations.",
    firstImpression: "Confident, assertive, and bold; people immediately view you as someone who gets things moving and tackles challenges head-on.",
  },
  Taurus: {
    observableDemeanor: "Grounded, serene, and composed with steady, unhurried body language. You possess a soothing tone of voice, comfortable physical presence, and refusal to be rushed.",
    socialPresence: "Acts as a stabilizing anchor in any gathering. You value tangible comfort, high craftsmanship, and loyal companionship, offering calm common sense amid chaotic noise.",
    firstImpression: "Trustworthy, unshakeable, and reliable; people immediately perceive you as emotionally safe, dependable, and sensible.",
  },
  Gemini: {
    observableDemeanor: "Inquisitive, animated, and youthful with expressive hand gestures and alert eyes. Your posture is agile and your reflexes are fast and communicative.",
    socialPresence: "Bridges conversations effortlessly between different groups, shares fascinating insights, and keeps atmosphere light, witty, and intellectually engaging.",
    firstImpression: "Clever, curious, and approachable; people instantly recognize an adaptable, sparkling intellect eager to exchange ideas.",
  },
  Cancer: {
    observableDemeanor: "Gentle, receptive, and intuitive with a protective, reassuring demeanor. You have deeply expressive, soulful eyes and an instinct to create safety wherever you go.",
    socialPresence: "Observant and guarded when first meeting strangers, but deeply affectionate and hospitable once trust is established. You instinctively sense the emotional temperature of any room.",
    firstImpression: "Empatpathetic, warm, and deeply protective; people feel an instinctive sense of emotional shelter and genuine care around you.",
  },
  Leo: {
    observableDemeanor: "Upright, commanding, and naturally dignified with a radiant, magnetic smile and expressive vocal resonance. You hold your head high with instinctive nobility.",
    socialPresence: "Naturally commands the room without needing to be loud. Generous with praise and encouragement, you elevate the energy of others and inspire creative confidence.",
    firstImpression: "Charismatic, honorable, and warm-hearted; people see a natural leader and a generous, proud spirit.",
  },
  Virgo: {
    observableDemeanor: "Immaculately neat, observant, and composed with a sharp, discerning eye. You carry yourself with quiet poise, modest dignity, and purposeful attentiveness.",
    socialPresence: "Articulates thoughts with precision, notices operational flaws or needs before anyone else, and demonstrates care through tangible, practical help and efficiency.",
    firstImpression: "Polite, intelligent, and exceptionally competent; people instantly trust your capability and analytical honesty.",
  },
  Libra: {
    observableDemeanor: "Graceful, courteous, and aesthetically refined with an easy, welcoming charm. Your expressions are balanced and your movements are harmonious and gentle.",
    socialPresence: "A master diplomat and peace-maker. You naturally balance opposing viewpoints, diffuse social awkwardness, and ensure everyone feels heard and included.",
    firstImpression: "Charming, elegant, and likable; people find you delightful to converse with and aesthetically sophisticated.",
  },
  Scorpio: {
    observableDemeanor: "Intense, penetrating gaze, measured deliberate speech, and an aura of quiet self-mastery. You possess a powerful, magnetic stillness that commands silence.",
    socialPresence: "Keeps your cards close to your chest, observes social dynamics from the periphery, and connects deeply one-on-one while rejecting superficial small talk.",
    firstImpression: "Enigmatic, formidable, and profound; people immediately realize you see right through pretense and cannot be manipulated.",
  },
  Sagittarius: {
    observableDemeanor: "Open, expansive, and spirited with a ready laugh and hearty, athletic energy. You carry an unmistakable aura of freedom and philosophical curiosity.",
    socialPresence: "Brings infectious optimism, big-picture ideas, and unfiltered candor to every discussion. You inspire others to broaden their horizons and embrace truth.",
    firstImpression: "Inspiring, adventurous, and genuine; people view you as an authentic seeker of truth with a generous spirit.",
  },
  Capricorn: {
    observableDemeanor: "Disciplined, mature, and dignified with a calm, stoic presence. You carry yourself with the quiet authority of someone who knows the value of endurance.",
    socialPresence: "Speaks with weight and economy of words. Focused on practical realities and tangible results, you command organic respect without theatrical display.",
    firstImpression: "Formidable, capable, and responsible; people instinctively look to you as the adult in the room when serious decisions must be made.",
  },
  Aquarius: {
    observableDemeanor: "Independent, intellectually observant, and distinctively original with a calm, unbothered demeanor. You carry an aura of futuristic clarity and personal freedom.",
    socialPresence: "Treats everyone—regardless of social rank—with identical egalitarian respect. You are allergic to arbitrary authority, peer conformity, and petty drama.",
    firstImpression: "Visionary, authentic, and progressive; people perceive you as an original thinker who marches strictly to their own compass.",
  },
  Pisces: {
    observableDemeanor: "Soulful, compassionate, and fluid with dreamy, empathetic eyes and a soothing vocal cadence. You move with gentle sensitivity and artistic grace.",
    socialPresence: "Absorbs ambient emotions intuitively, listens without judgment, and offers a quiet spiritual sanctuary to those who are exhausted or hurting.",
    firstImpression: "Kind-hearted, mystical, and artistically gifted; people feel unjudged, emotionally understood, and spiritually grounded in your presence.",
  },
};

export const MOON_NAKSHATRA_EMOTIONAL_PROFILES: Record<
  string,
  {
    emotionalEngine: string;
    observableBehaviors: string;
    relationalStyle: string;
    triggersAndBoundaries: string;
    signatureSuperpower: string;
  }
> = {
  Ashwini: {
    emotionalEngine: "Ruled by Ketu and the celestial physicians (Ashvini Kumaras). Your emotional engine operates on rapid instinct, pioneering adrenaline, and a continuous need for fresh movement and bold action.",
    observableBehaviors: "Impatient with passive waiting, highly spontaneous, quick to forgive and forget, and possesses a natural instinct to rush in and solve crises immediately.",
    relationalStyle: "Direct, playful, and autonomous; you thrive with partners who respect your need for independent momentum and match your adventurous vitality.",
    triggersAndBoundaries: "Triggered by sluggish bureaucracy, indecisiveness, and being held back by over-cautious routines. Your sacred boundary is freedom of swift action.",
    signatureSuperpower: "Miraculous recovery speed and the pioneering spark to jumpstart momentum when everyone else is paralyzed.",
  },
  Bharani: {
    emotionalEngine: "Ruled by Venus and Lord Yama (God of Dharma and Universal Truth). Your emotional engine runs on profound passion, intense conviction, and an uncompromising all-or-nothing mindset. You experience feelings with volcanic depth and moral weight.",
    observableBehaviors: "Possesses monumental emotional endurance; you carry heavy psychological burdens, duties, and transformations in silence without playing the victim. You have zero tolerance for hypocrisy, half-hearted commitments, or sugary flattery.",
    relationalStyle: "Fiercely loyal, deeply protective, and demanding of absolute emotional transparency. When you love, you give 100% of your soul; but if trust is betrayed, you sever ties cleanly and permanently without remorse.",
    triggersAndBoundaries: "Triggered by deceit, manipulation, disrespect, and micro-management. Your sacred boundary is unconditional self-sovereignty and honor.",
    signatureSuperpower: "Unbreakable crisis resilience; the capacity to walk through intense emotional fire and emerge reborn with greater inner power.",
  },
  Krittika: {
    emotionalEngine: "Ruled by the Sun and Agni (The Cosmic Fire God). Your emotional engine is characterized by fierce integrity, sharp discernment, and a driving urge to burn away illusions and protect what is sacred.",
    observableBehaviors: "Direct truth-teller with a fiery temper that clears the air quickly. You act as a formidable shield for loved ones and hold yourself and others to an exacting code of honor.",
    relationalStyle: "Protective and deeply devoted provider; you show love through concrete defense, shielding your inner circle, and demanding mutual respect over superficial sweet talk.",
    triggersAndBoundaries: "Triggered by cowardice, injustice, and backhanded gossip. Your sacred boundary is uncompromised personal dignity.",
    signatureSuperpower: "Flaming moral clarity; the capacity to cut through confusion and establish righteous order instantly.",
  },
  Rohini: {
    emotionalEngine: "Ruled by the Moon and Lord Brahma. Your emotional world is deeply tuned to sensory beauty, domestic comfort, loyalty, and creative elegance. You crave harmony, artistic nourishment, and emotional security.",
    observableBehaviors: "Possesses a soothing, magnetic presence, melodious voice, and an expressive face. You have an instinct for luxury, fine food, and cultivating cozy, beautiful environments.",
    relationalStyle: "Deeply affectionate, loyal, and romantic; you blossom in steady, aesthetically pleasing relationships where emotional devotion is reciprocated generously.",
    triggersAndBoundaries: "Triggered by crude environments, harsh language, emotional instability, and sudden deprivation. Your sacred boundary is peaceful serenity.",
    signatureSuperpower: "Magnetic attraction; the creative gift to manifest abundance, romance, and flourishing beauty from simple beginnings.",
  },
  Mrigashira: {
    emotionalEngine: "Ruled by Mars and Soma (The Elixir of the Moon). Your mind is an eternal gentle seeker—driven by innocent curiosity, inquisitive intellect, and an ongoing quest for truth, beauty, and discovery.",
    observableBehaviors: "Always exploring, asking deep questions, researching diverse subjects, and possessing a gentle charm, though you can experience mental restlessness and over-analysis.",
    relationalStyle: "Companionable, intellectually vibrant, and playful; you require mental rapport and shared journeys of discovery to feel emotionally sustained.",
    triggersAndBoundaries: "Triggered by closed-minded dogmatism, cynicism, and mental boredom. Your sacred boundary is room to wander and investigate freely.",
    signatureSuperpower: "Intuitive investigative radar; the gift to track down hidden gems of knowledge, opportunities, and solutions.",
  },
  Ardra: {
    emotionalEngine: "Ruled by Rahu and Rudra (The Storm God). Your emotional nature moves through intense, cathartic weather—experiencing emotional storms that shatter outmoded illusions followed by profound intellectual breakthroughs.",
    observableBehaviors: "Deep thinker with a sharp, sarcastic wit and fascination with technology, science, and human psychology. You often feel misunderstood, but possess a deeply tender heart underneath your armor.",
    relationalStyle: "Guarded initially; you cherish partners who have the emotional maturity to weather your intense moods and appreciate your profound authenticity.",
    triggersAndBoundaries: "Triggered by being emotionally dismissed, fake sentimentality, and intellectual condescension. Your sacred boundary is raw psychological truth.",
    signatureSuperpower: "Transformative reinvention; the power to tear down obsolete structures and rebuild your life with extraordinary brilliance.",
  },
  Punarvasu: {
    emotionalEngine: "Ruled by Jupiter and Aditi (The Universal Mother of the Gods). Your emotional frequency is defined by optimism, second chances, maternal forgiveness, and boundless spiritual renewal.",
    observableBehaviors: "Naturally generous, patient, and philosophical. You bounce back from setbacks with a smiling heart and possess an instinctive talent for repairing broken situations.",
    relationalStyle: "Nurturing, welcoming, and unconditionally supportive; you treat friends like family and create a warm sanctuary of hospitality wherever you live.",
    triggersAndBoundaries: "Triggered by greed, mean-spirited cynicism, and toxic environments. Your sacred boundary is maintaining a clean, uplifting moral atmosphere.",
    signatureSuperpower: "The Golden Boomerang; the miraculous capacity to bounce back stronger and restore harmony no matter how severe the fall.",
  },
  Pushya: {
    emotionalEngine: "Ruled by Saturn and Brihaspati (Guru of the Gods). Governed by selfless care, parental duty, spiritual wisdom, and deep nourishment. You feel an innate obligation to protect and uplift others.",
    observableBehaviors: "The steady advisor everyone leans on in tough times; patient, disciplined, quietly generous, and respectful of classical traditions and ethics.",
    relationalStyle: "Deeply committed, protective, and unconditional; you express love through consistent nourishment, practical guidance, and unshakeable loyalty.",
    triggersAndBoundaries: "Triggered by betrayal of trust, frivolous waste, and lack of gratitude. Your sacred boundary is moral integrity and family honor.",
    signatureSuperpower: "Universal nourishment; the sacred capacity to feed, heal, and stabilize human lives over generations.",
  },
  Ashlesha: {
    emotionalEngine: "Ruled by Mercury and the Nagas (Mystical Serpents). Deeply psychological, protective, intuitive, and alert. You possess an uncanny sixth sense that penetrates unspoken motives and hidden dangers.",
    observableBehaviors: "Shrewd observer with sharp wit and a private disposition. You hold your emotional vulnerabilities tightly guarded and master human strategy instinctively.",
    relationalStyle: "Intensely protective and possessive of those you claim as your own; you demand total loyalty and take time to lower your fortress walls.",
    triggersAndBoundaries: "Triggered by deceit, breach of confidentiality, and unreliability. Your sacred boundary is personal privacy and sacred trust.",
    signatureSuperpower: "Hypnotic emotional intuition; the gift to perceive underground realities and neutralize threats before they materialize.",
  },
  Magha: {
    emotionalEngine: "Ruled by Ketu and the Pitris (Ancestral Guardian Spirits). Governed by deep ancestral pride, regal dignity, lineage honor, and an innate sense of royal duty.",
    observableBehaviors: "Commanding, honorable presence with generous hospitality. You honor lineage, respect elders, and hold an instinctive distaste for petty or cowardly behavior.",
    relationalStyle: "Chivalrous, magnanimous, and proud partner; you flourish when treated with deep respect and when your contributions are celebrated.",
    triggersAndBoundaries: "Triggered by humiliation, disrespect, and disregard for heritage. Your sacred boundary is personal honor and sovereign self-respect.",
    signatureSuperpower: "Regal moral authority; the capacity to carry monumental ancestral legacies and lead large organizations with dignity.",
  },
  "Purva Phalguni": {
    emotionalEngine: "Ruled by Venus and Bhaga (God of Divine Prosperity and Joy). Your emotional heart thrives on celebration, social warmth, creative relaxation, and joyful intimacy.",
    observableBehaviors: "Radiant charisma, warm social magnetism, love for music and fine arts, and a natural ability to melt tension and bring laughter to any room.",
    relationalStyle: "Passionate romantic and generous partner; you value physical affection, mutual appreciation, and joyful companionship above all else.",
    triggersAndBoundaries: "Triggered by coldness, harsh austerity, and joyless criticism. Your sacred boundary is freedom to experience warmth, romance, and joy.",
    signatureSuperpower: "Creative magnetism; the effortless gift of generating affection, prosperity, and celebratory harmony.",
  },
  "Uttara Phalguni": {
    emotionalEngine: "Ruled by the Sun and Aryaman (God of Enduring Friendship & Sacred Contracts). Your emotional foundation is built on noble dignity, dependability, service, and sacred duty.",
    observableBehaviors: "Expresses love through dependable acts of service; keeps promises scrupulously, maintains order, and acts as an unshakeable pillar of support for allies.",
    relationalStyle: "Steadfast, loyal, and devoted companion; you value sacred agreements, shared family responsibilities, and enduring stability over fleeting thrills.",
    triggersAndBoundaries: "Triggered by broken promises, disorder, and selfish ingratitude. Your sacred boundary is mutual respect, honor, and accountability.",
    signatureSuperpower: "The Noble Patron; the enduring ability to build long-lasting partnerships and protect communities through steadfast leadership.",
  },
  Hasta: {
    emotionalEngine: "Ruled by the Moon and Savitar (The Sun as Divine Awakener). Your emotional nature is dexterous, witty, detail-attuned, and passionately focused on craftsmanship and practical solutions.",
    observableBehaviors: "Clever problem-solver with talented hands, sharp timing, and light humor. You show your love by fixing broken things and organizing daily life seamlessly.",
    relationalStyle: "Helpful, attentive, and expressive partner; you feel most loved when your practical contributions and ingenuity are recognized.",
    triggersAndBoundaries: "Triggered by helplessness, chaotic disorganization, and emotional neglect. Your sacred boundary is freedom to solve problems effectively.",
    signatureSuperpower: "Magical dexterity; the practical resourcefulness to craft, heal, or resolve almost any operational dilemma.",
  },
  Chitra: {
    emotionalEngine: "Ruled by Mars and Vishwakarma (The Divine Celestial Architect). Your emotional engine is fueled by a desire for visual brilliance, design perfection, and leaving an unforgettable aesthetic stamp.",
    observableBehaviors: "Impeccable personal taste, creative ambition, captivating charm, and a sharp critical eye that spots disharmony or flaws instantly.",
    relationalStyle: "Flamboyant, passionate, and proud; you seek a companion who appreciates your creative brilliance and respects your unique individuality.",
    triggersAndBoundaries: "Triggered by dull mediocrity, aesthetic ugliness, and being overlooked. Your sacred boundary is creative autonomy and respect.",
    signatureSuperpower: "Architectural brilliance; the vision to transmute raw substance into breathtaking, enduring beauty.",
  },
  Swati: {
    emotionalEngine: "Ruled by Rahu and Vayu (The Wind God). Driven by a need for personal independence, flexible movement, diplomatic balance, and commercial freedom.",
    observableBehaviors: "Adaptable, persuasive conversationalist who balances business savvy with gentle charm. You bend with the wind rather than break, fiercely guarding your freedom.",
    relationalStyle: "Fair-minded, polite, and open; you require intellectual breathing space and mutual independence to keep relationships fresh and alive.",
    triggersAndBoundaries: "Triggered by possessiveness, claustrophobic micromanagement, and rigid dogmas. Your sacred boundary is personal freedom.",
    signatureSuperpower: "Diplomatic resilience; the commercial intuition that discovers abundant opportunities wherever the winds shift.",
  },
  Svati: {
    emotionalEngine: "Ruled by Rahu and Vayu (The Wind God). Driven by a need for personal independence, flexible movement, diplomatic balance, and commercial freedom.",
    observableBehaviors: "Adaptable, persuasive conversationalist who balances business savvy with gentle charm. You bend with the wind rather than break, fiercely guarding your freedom.",
    relationalStyle: "Fair-minded, polite, and open; you require intellectual breathing space and mutual independence to keep relationships fresh and alive.",
    triggersAndBoundaries: "Triggered by possessiveness, claustrophobic micromanagement, and rigid dogmas. Your sacred boundary is personal freedom.",
    signatureSuperpower: "Diplomatic resilience; the commercial intuition that discovers abundant opportunities wherever the winds shift.",
  },
  Vishakha: {
    emotionalEngine: "Ruled by Jupiter and Indra-Agni (Dual Gods of Triumph & Fire). Your emotional engine is fueled by relentless ambition, single-pointed goal focus, and hunger for victory.",
    observableBehaviors: "Tireless work ethic, fierce determination, and setting audacious targets. You celebrate milestones passionately and refuse to give up until you win.",
    relationalStyle: "Passionate, goal-aligned partner; you champion your partner's ambitions fiercely and expect equal drive, devotion, and growth in return.",
    triggersAndBoundaries: "Triggered by feeling stuck in dead-ends, unmotivated company, and petty jealousy. Your sacred boundary is forward progress.",
    signatureSuperpower: "Triumphant perseverance; the sheer willpower to conquer impossible mountains and stand at the summit.",
  },
  Anuradha: {
    emotionalEngine: "Ruled by Saturn and Mitra (God of Sacred Friendship & Alliances). Your emotional core is anchored in profound devotion, loyalty, bridging divides, and enduring love.",
    observableBehaviors: "Gentle diplomat and steadfast friend who can endure periods of loneliness early in life, emerging with extraordinary emotional maturity and wisdom.",
    relationalStyle: "Steadfast, affectionate, and spiritually devoted companion; you flourish in relationships offering emotional safety and mutual loyalty.",
    triggersAndBoundaries: "Triggered by betrayal of friendship, cruelty, and emotional desertion. Your sacred boundary is sacred loyalty.",
    signatureSuperpower: "Heart-centered alchemy; the ability to turn adversity into lifelong alliances and deep universal love.",
  },
  Jyeshtha: {
    emotionalEngine: "Ruled by Mercury and Lord Indra (King of the Gods). Governed by senior responsibility, protective leadership, intellectual mastery, and holding the family shield.",
    observableBehaviors: "Dignified, protective of younger or vulnerable people, commands authority naturally, and carries heavy managerial burdens with stubborn pride.",
    relationalStyle: "Authoritative yet deeply protective; offers profound material and emotional safety, requiring honor and acknowledgment in return.",
    triggersAndBoundaries: "Triggered by disrespect, public humiliation, and unfair undermining of your authority. Your sacred boundary is personal honor.",
    signatureSuperpower: "Executive courage; the fortitude to stand firm and protect an entire family or institution in the eye of a storm.",
  },
  Mula: {
    emotionalEngine: "Ruled by Ketu and Nirriti (Goddess of Dissolution). Driven by a compulsive need to reach the absolute root of everything, questioning all surface appearances.",
    observableBehaviors: "Direct, intense, philosophical, and unafraid of radical change. You strip away superficial pleasantries and operate with penetrating intuitive insight.",
    relationalStyle: "Deeply authentic, non-superficial, and transformative; you seek intense soul-level bonding and reject all shallow social masks.",
    triggersAndBoundaries: "Triggered by hypocrisy, superficial lies, and being pressured into conformist pretense. Your sacred boundary is uncompromising truth.",
    signatureSuperpower: "Radical truth-seeking; the courage to uproot toxic illusions and restart with crystal-clear spiritual reality.",
  },
  "Purva Ashadha": {
    emotionalEngine: "Ruled by Venus and Apas (The Cosmic Waters). Radiates an innate sense of invincibility, self-belief, philosophical grace, and emotional fluid power.",
    observableBehaviors: "Charismatic speaker, proud, generous, artistic, and endowed with infectious optimism that naturally rallies and inspires communities.",
    relationalStyle: "Charming, expressive, and proud companion; you flourish when emotionally respected and appreciated for your brilliance.",
    triggersAndBoundaries: "Triggered by humiliation, being silenced, and forced submission. Your sacred boundary is sovereign intellectual dignity.",
    signatureSuperpower: "Invincible confidence; the rhetorical and charismatic gift to sway minds and emerge victorious against all odds.",
  },
  "Uttara Ashadha": {
    emotionalEngine: "Ruled by the Sun and the Vishwadevas (Universal Virtues). Your emotional foundation is defined by calm integrity, humble patience, deep morality, and unshakeable commitment.",
    observableBehaviors: "Soft-spoken, dependable, deeply ethical, and persevering quietly without grandstanding. You build enduring success through pure character.",
    relationalStyle: "Extremely reliable, devoted, and faithful partner; you express love through steady lifelong consistency and moral strength.",
    triggersAndBoundaries: "Triggered by vulgarity, deception, and ethical corruption. Your sacred boundary is unbending moral honor.",
    signatureSuperpower: "Enduring victory (Aparajita); quiet, righteous perseverance that commands permanent respect across society.",
  },
  Shravana: {
    emotionalEngine: "Ruled by the Moon and Lord Vishnu (The Universal Preserver). Driven by listening, absorbing higher wisdom, oral knowledge, and preserving peace.",
    observableBehaviors: "Exceptional listener, highly observant, scholarly, and sensitive to subtle vocal tones and hidden subtext. You are the trusted keeper of wisdom.",
    relationalStyle: "Attentive, empathetic, communicative partner; connects most deeply through thoughtful, honest conversations and mutual intellectual respect.",
    triggersAndBoundaries: "Triggered by loud vulgarity, being interrupted, and close-minded arrogance. Your sacred boundary is respectful communication and mental peace.",
    signatureSuperpower: "Wisdom through listening; the ability to assimilate vast knowledge and offer guidance that transforms lives.",
  },
  Dhanishta: {
    emotionalEngine: "Ruled by Mars and the Ashta Vasus (The 8 Elemental Deities). Emotionally energized by rhythm, music, wealth creation, organizational leadership, and perfect timing.",
    observableBehaviors: "High energetic drive, rhythmic walk, love for music and arts, generous patron, ambitious, with a sudden fiery temper when crossed.",
    relationalStyle: "Generous, proud, and socially dynamic; you thrive with a partner who celebrates life with you and supports your leadership stature.",
    triggersAndBoundaries: "Triggered by pettiness, scarcity mindset, and disruptive chaos. Your sacred boundary is financial and personal autonomy.",
    signatureSuperpower: "Universal rhythm; the ability to manifest prosperity, orchestrate teams, and deliver peak results right on time.",
  },
  Shatabhisha: {
    emotionalEngine: "Ruled by Rahu and Lord Varuna (God of Cosmic Waters & Truth). Your emotional world is intensely introspective, visionary, private, and oriented toward healing and futurism.",
    observableBehaviors: "Deeply values solitude, quiet observer, fascinated by futuristic technology, medicine, or esoteric wisdom. You are fiercely independent.",
    relationalStyle: "Reserved and deeply loyal once trust is earned; you require ample personal space to recharge and reject intrusive smothering.",
    triggersAndBoundaries: "Triggered by privacy breaches, gossip, and boundary violations. Your sacred boundary is sacred solitude and personal space.",
    signatureSuperpower: "The Healer's Vision; the gift to diagnose complex, invisible ailments and devise groundbreaking unconventional remedies.",
  },
  "Purva Bhadrapada": {
    emotionalEngine: "Ruled by Jupiter and Aja Ekapada (The Cosmic Fire Serpent). Governed by profound spiritual intensity, philosophical passion, ascetic drive, and transformative fire.",
    observableBehaviors: "Intense gaze, dual nature capable of moving between worldly mastery and monk-like detachment, passionate orator, and uncompromising idealist.",
    relationalStyle: "Intense, loyal, and protective; you seek a companion with soul depth who understands your complex, profound inner world.",
    triggersAndBoundaries: "Triggered by shallow materialism, moral hypocrisy, and deceit. Your sacred boundary is philosophical authenticity.",
    signatureSuperpower: "Spiritual alchemy; the courage to endure profound internal purification and guide others through cosmic awakening.",
  },
  "Uttara Bhadrapada": {
    emotionalEngine: "Ruled by Saturn and Ahirbudhnya (The Serpent of the Deep Ocean). Your emotional nature is profoundly calm, stable, merciful, and anchored in ocean-deep wisdom.",
    observableBehaviors: "Unshakeable composure under crisis, gentle speech, compassionate listener, and possessing immense meditative stamina and patience.",
    relationalStyle: "Steadfast, forgiving, and emotionally generous; you provide an unconditional sanctuary of peace and safety for your loved ones.",
    triggersAndBoundaries: "Triggered by hysteria, cruelty, and relentless chaos. Your sacred boundary is emotional serenity.",
    signatureSuperpower: "Oceanic stability; the rare ability to remain completely calm, wise, and protective when everyone around is in panic.",
  },
  Revati: {
    emotionalEngine: "Ruled by Mercury and Pushan (The Divine Shepherd & Guide). Guided by boundless compassion, universal empathy, sweet speech, and nurturing protection of all creatures.",
    observableBehaviors: "Gentle, imaginative, lover of animals and nature, highly intuitive, optimistic traveler, and bringing a sweet, spiritual grace to every space.",
    relationalStyle: "Affectionate, romantic, and deeply selfless; you blossom in relationships filled with genuine kindness, mutual travel, and spiritual pursuit.",
    triggersAndBoundaries: "Triggered by cruelty, harsh judgment, and cold cynicism. Your sacred boundary is kindness, empathy, and emotional safety.",
    signatureSuperpower: "Divine guidance; the intuitive power to guide lost souls, heal heavy hearts, and safely shepherd endeavors across finish lines.",
  },
};

export const SUN_CONSCIOUS_DRIVE_TRAITS: Record<
  string,
  { consciousAmbition: string; leadershipStyle: string }
> = {
  Aries: {
    consciousAmbition: "Pioneering new paths, initiating bold enterprises, and proving your strength through fearless independent achievement.",
    leadershipStyle: "Leads by direct example from the front lines; decisive, fast-acting, and inspiring others through personal bravery.",
  },
  Taurus: {
    consciousAmbition: "Building enduring material security, accumulating tangible assets, and creating unshakeable quality and comfort.",
    leadershipStyle: "Leads through steady consistency, patience, and sound stewardship; provides a rock-solid foundation for teams.",
  },
  Gemini: {
    consciousAmbition: "Mastering information, networking diverse minds, and creating agile communication bridges across different worlds.",
    leadershipStyle: "Leads through intellectual persuasion, witty negotiation, flexibility, and facilitating collaborative teamwork.",
  },
  Cancer: {
    consciousAmbition: "Protecting community and family foundations, creating emotional and physical security, and building legacy institutions.",
    leadershipStyle: "Leads through empathetic stewardship, deep personal loyalty, and creating a supportive, family-like culture.",
  },
  Leo: {
    consciousAmbition: "Radiating creative authority, commanding noble respect, and leaving a magnificent, dignified mark on society.",
    leadershipStyle: "Leads with magnanimous warmth, personal charisma, inspiring vision, and holding oneself to the highest standards of honor.",
  },
  Virgo: {
    consciousAmbition: "Operational perfection, solving complex systemic flaws, and delivering impeccable, indispensable service.",
    leadershipStyle: "Leads through technical mastery, meticulous organization, ethical clarity, and practical problem solving.",
  },
  Libra: {
    consciousAmbition: "Creating social justice, elevating cultural and aesthetic elegance, and building harmonious, powerful alliances.",
    leadershipStyle: "Leads through diplomacy, fair consensus-building, aesthetic vision, and bridging hostile divides.",
  },
  Scorpio: {
    consciousAmbition: "Mastering hidden systems, executing strategic transformations, and commanding situations through profound willpower.",
    leadershipStyle: "Leads through intense focus, unwavering loyalty to trusted allies, and fearless crisis management.",
  },
  Sagittarius: {
    consciousAmbition: "Expanding global horizons, discovering philosophical truth, and guiding society through big-picture ethical wisdom.",
    leadershipStyle: "Leads through inspirational optimism, intellectual mentorship, visionary storytelling, and moral courage.",
  },
  Capricorn: {
    consciousAmbition: "Climbing societal hierarchies, constructing lasting institutional structures, and achieving pinnacle status through pure perseverance.",
    leadershipStyle: "Leads through proven competence, stoic accountability, strategic long-term planning, and operational discipline.",
  },
  Aquarius: {
    consciousAmbition: "Humanitarian reform, advancing progressive innovations, breaking outdated barriers, and uplifting collective consciousness.",
    leadershipStyle: "Leads through egalitarian vision, unconventional ingenuity, empowering individuality, and systemic problem-solving.",
  },
  Pisces: {
    consciousAmbition: "Transcending mundane limitations, artistic and spiritual devotion, and bringing healing compassion to the world.",
    leadershipStyle: "Leads through intuitive inspiration, servant leadership, emotional empathy, and profound spiritual perspective.",
  },
};

export const HOUSE_FOCUS_DESCRIPTIONS: Record<
  number,
  { arenaTitle: string; lifeFocus: string }
> = {
  1: {
    arenaTitle: "Self-Actualization & Personal Sovereignty",
    lifeFocus: "You invest your active willpower in forging your personal character, vitality, physical independence, and charting an autonomous life path.",
  },
  2: {
    arenaTitle: "Wealth Creation & Family Foundations",
    lifeFocus: "You dedicate your core drive to building financial assets, securing family heritage, refining articulate speech, and establishing enduring values.",
  },
  3: {
    arenaTitle: "Self-Made Courage & Skill Mastery",
    lifeFocus: "You channel your energy into self-reliance, developing sharp communicative and technical skills, personal enterprise, and overcoming obstacles with your own hands.",
  },
  4: {
    arenaTitle: "Inner Sanctuary & Domestic Roots",
    lifeFocus: "You focus your deepest energy on domestic happiness, property, vehicles, establishing emotional security, and cultivating an unshakeable inner home.",
  },
  5: {
    arenaTitle: "Creative Genius & Intellectual Brilliance",
    lifeFocus: "You pour your soul into creative expression, strategic intellect, mentorship, advisory wisdom, and nurturing progeny and intellectual brainchildren.",
  },
  6: {
    arenaTitle: "Strategic Service & Overcoming Hurdles",
    lifeFocus: "You harness your willpower to resolve conflicts, overcome competitive friction, master detailed technical workflows, and provide disciplined service.",
  },
  7: {
    arenaTitle: "Sacred Partnerships & Public Diplomacy",
    lifeFocus: "You navigate your destiny primarily through significant one-on-one alliances, marriage, commercial negotiations, and outward public engagement.",
  },
  8: {
    arenaTitle: "Deep Alchemy & Transformative Mastery",
    lifeFocus: "You evolve through profound psychological reinventions, managing shared resources or unearned assets, crisis navigation, and uncovering hidden truths.",
  },
  9: {
    arenaTitle: "Higher Wisdom & Dharmic Expansion",
    lifeFocus: "You expand your life through higher philosophy, long-distance journeys, ethical mentorship, spiritual pilgrimage, and living aligned with dharma.",
  },
  10: {
    arenaTitle: "Executive Authority & Societal Legacy",
    lifeFocus: "You pour your ambitions into public standing, professional mastery, administrative leadership, and leaving an enduring societal mark.",
  },
  11: {
    arenaTitle: "Vast Networks & Visionary Goals",
    lifeFocus: "You mobilize your willpower to achieve major aspirations, forge influential networks, maximize financial gains, and champion community causes.",
  },
  12: {
    arenaTitle: "Spiritual Liberation & Transcendent Horizons",
    lifeFocus: "You anchor your soul in spiritual solitude, international horizons, philanthropic charity, and cultivating peace beyond mundane worldly games.",
  },
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
  // CRITICAL: Format date and time strictly in the birthplace's local timezone (location.timezoneOffsetHours),
  // not the viewer's device / browser locale timezone.
  const tzOffsetHours = location.timezoneOffsetHours ?? 5.5;
  const tzOffsetMs = tzOffsetHours * 3600 * 1000;
  const localBirthDate = new Date(birthDate.getTime() + tzOffsetMs);

  const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekday = WEEKDAYS[localBirthDate.getUTCDay()];
  const month = MONTHS[localBirthDate.getUTCMonth()];
  const day = localBirthDate.getUTCDate();
  const year = localBirthDate.getUTCFullYear();
  const rawHours = localBirthDate.getUTCHours();
  const rawMinutes = String(localBirthDate.getUTCMinutes()).padStart(2, "0");
  const hour12 = rawHours % 12 || 12;
  const ampm = rawHours >= 12 ? "PM" : "AM";
  const formattedHour12 = String(hour12).padStart(2, "0");

  const dateFormatted = `${weekday}, ${month} ${day}, ${year}`;
  const timeFormatted = `${formattedHour12}:${rawMinutes} ${ampm}`;
  const placeFormatted = `${location.cityName}${location.country ? `, ${location.country}` : ""}`;

  const ascTraits = ASCENDANT_OBSERVABLE_TRAITS[ascRashi] || ASCENDANT_OBSERVABLE_TRAITS["Aquarius"];
  const moonNakTraits = MOON_NAKSHATRA_EMOTIONAL_PROFILES[moonNakshatra] || MOON_NAKSHATRA_EMOTIONAL_PROFILES["Bharani"];
  const sunTraits = SUN_CONSCIOUS_DRIVE_TRAITS[sunRashi] || SUN_CONSCIOUS_DRIVE_TRAITS["Taurus"];
  const houseFocus = HOUSE_FOCUS_DESCRIPTIONS[ascLordHouse] || HOUSE_FOCUS_DESCRIPTIONS[1];

  const cosmicEssence = `You are born with ${ascRashi} rising, giving you an observable presence characterized by ${ascTraits.observableDemeanor.toLowerCase()} In social environments, ${ascTraits.socialPresence.toLowerCase()}

At your emotional core, your Moon in ${moonRashi} in the sacred nakshatra of ${moonNakshatra} defines your inner psychological engine: ${moonNakTraits.emotionalEngine} In everyday life, you show this through ${moonNakTraits.observableBehaviors.toLowerCase()} When it comes to relationships, ${moonNakTraits.relationalStyle.toLowerCase()}

Your conscious life mission and outer vitality are powered by the ${sunRashi} Sun—driving you toward ${sunTraits.consciousAmbition.toLowerCase()} Meanwhile, your chart ruler ${ascLord} concentrates your active willpower in House ${ascLordHouse} (${houseFocus.arenaTitle}), meaning ${houseFocus.lifeFocus.toLowerCase()}`;

  const essenceBreakdown = {
    outerPresence: {
      title: `${ascRashi} Rising Persona`,
      observableDemeanor: ascTraits.observableDemeanor,
      socialPresence: ascTraits.socialPresence,
      firstImpression: ascTraits.firstImpression,
    },
    emotionalEngine: {
      title: `Moon in ${moonRashi} (${moonNakshatra})`,
      psychologyOverview: moonNakTraits.emotionalEngine,
      observableBehaviors: moonNakTraits.observableBehaviors,
      relationalStyle: moonNakTraits.relationalStyle,
      triggersAndBoundaries: moonNakTraits.triggersAndBoundaries,
      signatureSuperpower: moonNakTraits.signatureSuperpower,
    },
    consciousMission: {
      title: `${sunRashi} Sun Drive`,
      consciousAmbition: sunTraits.consciousAmbition,
      leadershipStyle: sunTraits.leadershipStyle,
    },
    lifeFocus: {
      title: `Chart Sovereign in House ${ascLordHouse}`,
      arenaTitle: houseFocus.arenaTitle,
      lifeFocus: houseFocus.lifeFocus,
    },
  };

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

  const pillarList = [
    {
      id: "dharma" as const,
      title: "Dharma (Purpose & Moral Authority)",
      score: east,
      percentage: Math.round((east / 337) * 100),
      element: "Fire",
      elementSanskrit: "Agni (अग्नि)",
      houses: [1, 5, 9],
      verdict: east >= 85 ? "High moral purpose and natural clarity of self-direction." : "Balanced ethical focus.",
      coreMeaning:
        `With ${east} points (${Math.round((east / 337) * 100)}% of your chart's energy), your soul is wired for purpose and truth above pure financial expediency. Governing your physical self (House 1), creative intellect and good karma (House 5), and higher wisdom and fortune (House 9), this pillar wires you to need meaning in everything you do. Hollow or ethically questionable tasks cause swift internal moral burnout.`,
      lifeApplication:
        "Lead through integrity, mentorship, and principled problem-solving. People naturally sense your internal moral compass and seek your counsel in times of confusion. Ensure career pursuits align with your core values.",
      pitfallToWatch:
        "Avoid becoming disillusioned or overly critical when colleagues or environments operate purely on transactional shortcuts; protect your energy without carrying the weight of reforming everything alone.",
    },
    {
      id: "artha" as const,
      title: "Artha (Wealth & Practical Mastery)",
      score: south,
      percentage: Math.round((south / 337) * 100),
      element: "Earth",
      elementSanskrit: "Prithvi (पृथ्वी)",
      houses: [2, 6, 10],
      verdict: south >= 85 ? "Strong material endurance and high productivity stamina." : "Steady financial consistency.",
      coreMeaning:
        `With ${south} points (${Math.round((south / 337) * 100)}% of your chart's energy), your life energy is anchored in tangible achievement, material security, and disciplined professional output. Governing earned income (House 2), daily problem-solving stamina (House 6), and career status (House 10), this pillar equips you with tremendous endurance to build lasting wealth and durable structures.`,
      lifeApplication:
        "Focus on long-term compound growth, high-standard execution, and systematizing operations. Your practical pragmatism is your greatest asset in competitive markets.",
      pitfallToWatch:
        "Do not reduce your personal happiness or identity solely to balance sheets or professional rankings; cultivate emotional and spiritual replenishment.",
    },
    {
      id: "kama" as const,
      title: "Kama (Ambition, Networks & Alliances)",
      score: west,
      percentage: Math.round((west / 337) * 100),
      element: "Air",
      elementSanskrit: "Vayu (वायु)",
      houses: [3, 7, 11],
      verdict: west >= 85 ? "Powerful social ambition, networking reach, and strong life desires." : "Balanced social interactions.",
      coreMeaning:
        `With ${west} points (${Math.round((west / 337) * 100)}% of your chart's energy), your dominant energy circulates through social connections, collective goals, and collaborative partnerships. Governing initiative and communication (House 3), relational alliances and marriage (House 7), and broad social networks and large gains (House 11), you thrive when exchanging ideas and forging alliances.`,
      lifeApplication:
        "Leverage community engagement, strategic deal-making, and collective platforms. Your ability to connect people and inspire shared enthusiasm drives your biggest breakthroughs.",
      pitfallToWatch:
        "Guard against spreading yourself thin across too many casual associations or pursuing desires that offer short-term excitement but lack long-term substance.",
    },
    {
      id: "moksha" as const,
      title: "Moksha (Peace, Intuition & Inner Liberation)",
      score: north,
      percentage: Math.round((north / 337) * 100),
      element: "Water",
      elementSanskrit: "Jala (जल)",
      houses: [4, 8, 12],
      verdict: north >= 85 ? "Deep intuitive faculties, spiritual thirst, and restorative inner calm." : "Peaceful reflective balance.",
      coreMeaning:
        `With ${north} points (${Math.round((north / 337) * 100)}% of your chart's energy), your life energy is centered in inner peace, psychological intuition, and spiritual freedom. Governing domestic happiness (House 4), psychological depth and transformation (House 8), and solitude, rest, and transcendence (House 12), you require restorative quietude to operate at your peak.`,
      lifeApplication:
        "Prioritize sacred spaces, emotional equilibrium, and contemplative retreats. Trust your intuitive hunches; your inner emotional radar often anticipates outcomes before logic catches up.",
      pitfallToWatch:
        "Avoid retreating into emotional withdrawal or avoidance when practical life requires decisive, assertively grounded action.",
    },
  ];

  const sortedPillars = [...pillarList].sort((a, b) => b.score - a.score);
  const dominantPillar = sortedPillars[0];

  const purusharthas = {
    dharma: {
      score: east,
      percentage: Math.round((east / 337) * 100),
      element: "Fire",
      elementSanskrit: "Agni (अग्नि)",
      houses: [1, 5, 9],
      verdict: east >= 85 ? "High moral purpose and natural clarity of self-direction." : "Balanced ethical focus.",
    },
    artha: {
      score: south,
      percentage: Math.round((south / 337) * 100),
      element: "Earth",
      elementSanskrit: "Prithvi (पृथ्वी)",
      houses: [2, 6, 10],
      verdict: south >= 85 ? "Strong material endurance and high productivity stamina." : "Steady financial consistency.",
    },
    kama: {
      score: west,
      percentage: Math.round((west / 337) * 100),
      element: "Air",
      elementSanskrit: "Vayu (वायु)",
      houses: [3, 7, 11],
      verdict: west >= 85 ? "Powerful social ambition, networking reach, and strong life desires." : "Balanced social interactions.",
    },
    moksha: {
      score: north,
      percentage: Math.round((north / 337) * 100),
      element: "Water",
      elementSanskrit: "Jala (जल)",
      houses: [4, 8, 12],
      verdict: north >= 85 ? "Deep intuitive faculties, spiritual thirst, and restorative inner calm." : "Peaceful reflective balance.",
    },
    dominantPillar: {
      id: dominantPillar.id,
      title: dominantPillar.title,
      score: dominantPillar.score,
      percentage: dominantPillar.percentage,
      element: dominantPillar.element,
      elementSanskrit: dominantPillar.elementSanskrit,
      houses: dominantPillar.houses,
      coreMeaning: dominantPillar.coreMeaning,
      lifeApplication: dominantPillar.lifeApplication,
      pitfallToWatch: dominantPillar.pitfallToWatch,
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

  const activitiesList = [
    { label: "Worship & Meditation", dir: jupDir.dir, planet: "Jupiter" },
    { label: "Work Desk & Routine", dir: satDir.dir, planet: "Saturn" },
    { label: "Authority & Leadership", dir: sunDir.dir, planet: "Sun" },
    { label: "Business & Contracts", dir: merDir.dir, planet: "Mercury" },
    { label: "Fitness & Active Energy", dir: marDir.dir, planet: "Mars" },
    { label: "Arts, Aesthetics & Harmony", dir: venDir.dir, planet: "Venus" },
    { label: "Rest & Mental Recharging", dir: mooDir.dir, planet: "Moon" },
  ];

  const dirCounts: Record<string, { count: number; activities: string[] }> = {};
  for (const act of activitiesList) {
    if (!dirCounts[act.dir]) {
      dirCounts[act.dir] = { count: 0, activities: [] };
    }
    dirCounts[act.dir].count++;
    dirCounts[act.dir].activities.push(`${act.label} (${act.planet})`);
  }

  let topDir = "East";
  let maxCount = 0;
  let topActs: string[] = [];
  for (const [d, info] of Object.entries(dirCounts)) {
    if (info.count > maxCount) {
      maxCount = info.count;
      topDir = d;
      topActs = info.activities;
    }
  }

  const cardinalPowerZone = maxCount >= 2 ? {
    direction: topDir,
    activitiesCount: maxCount,
    activities: topActs,
    explanation: `When multiple planetary recommendations converge on the ${topDir} (${maxCount} activities: ${topActs.join(", ")}), it reveals that ${topDir} is your chart's personal Cardinal Power Zone. Facing ${topDir} while working or making decisions creates a compound synergy, aligning executive leadership, disciplined routine, and energetic focus in a single power seat.`,
  } : undefined;

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
    cardinalPowerZone,
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

  // 12. Timeline of Destiny (Bhrigu & Nakshatra Activation Cycles)
  const now = new Date();
  const currentAge = Math.max(1, Math.floor((now.getTime() - birthDate.getTime()) / (365.25 * 24 * 3600 * 1000)));

  const MILESTONE_DEFINITIONS = [
    {
      age: 16,
      title: "Jupiter's Moral & Intellectual Foundation",
      theme: "Awakening of ethical conscience, scholarly focus, and initial spiritual or academic identity.",
      outcome: "Formed the mental architecture and moral standards that guide adulthood.",
      focus: "Scholastic integrity and discovering lifelong interests.",
      guidance: "Reflect on the mentors and core principles discovered during this period.",
      unlockOpportunity: "First major academic or intellectual breakthrough.",
    },
    {
      age: 21,
      title: "Surya's Sovereign Ignition (Self-Assertion)",
      theme: "Stepping into sovereign individuality, personal autonomy, and early adult career grit.",
      outcome: "Separated personal vision from family expectations to forge an independent path.",
      focus: "Cultivating self-respect, executive willpower, and professional direction.",
      guidance: "Do not seek external approval; anchor every decision in internal integrity.",
      unlockOpportunity: "First independent public or career milestone.",
    },
    {
      age: 24,
      title: "Chandra & Shukra Relational Awakening",
      theme: "Emotional maturation, love, aesthetic taste, and discovering true personal values.",
      outcome: "Learned what truly fulfills the heart beyond superficial social vanity.",
      focus: "Forming authentic relational bonds and establishing healthy emotional boundaries.",
      guidance: "Honor emotional authenticity and surround yourself with nurturing allies.",
      unlockOpportunity: "Significant relationship commitment, creative passion, or relocation.",
    },
    {
      age: 28,
      title: "Mangala's Executive & Real Estate Fire",
      theme: "Peak physical stamina, career aggression, home ownership, and decisive action.",
      outcome: "High vigor to conquer professional competitors and establish independent territory.",
      focus: "Executing bold projects without hesitation; channeling energy into durable assets.",
      guidance: "Balance intense drive with strategic patience; avoid impulsive friction.",
      unlockOpportunity: "Substantial property acquisition, corporate elevation, or business launch.",
    },
    {
      age: 32,
      title: "Budha & Guru Strategic Synthesis",
      theme: "Intellectual authority, commercial acumen, advisory influence, and compounding wealth.",
      outcome: "Transition from manual hustle into strategic advisory and scalable business systems.",
      focus: "Building leveraged commercial operations, family expansion, and public credibility.",
      guidance: "Let your intellect and wisdom do the heavy lifting; build scalable platforms.",
      unlockOpportunity: "Major commercial expansion, advisory prestige, and financial compounding.",
    },
    {
      age: 36,
      title: "Shani's Sovereign Maturity & Karmic Harvest",
      theme: "Enduring stability, institutional responsibility, leadership, and multi-generational security.",
      outcome: "Full karmic maturation of Saturn; shedding frivolous distractions for lasting empire.",
      focus: "Consolidating life work, assuming civic/executive accountability, and durable wealth.",
      guidance: "Discipline is your ultimate superpower; structures built now stand for decades.",
      unlockOpportunity: "Pivotal career summit, institutional authority, and lasting reputation.",
    },
    {
      age: 42,
      title: "Rahu's Worldly Summit & Uncharted Horizons",
      theme: "Audacious ambition, non-traditional breakthroughs, and wide societal influence.",
      outcome: "Breaking through conventional ceilings to master modern or global domains.",
      focus: "Pioneering new territory, global outreach, and claiming your rightful seat at the table.",
      guidance: "Remain spiritually anchored so worldly gains do not distract from soul purpose.",
      unlockOpportunity: "Apex societal recognition, foreign expansion, and unprecedented rewards.",
    },
    {
      age: 48,
      title: "Ketu's Deep Spiritual Liberation & Legacy Pivot",
      theme: "Inner peace, profound wisdom, philosophical mentorship, and philanthropic legacy.",
      outcome: "Synthesizing decades of worldly mastery into deep spiritual purpose and philanthropy.",
      focus: "Mentoring the next generation, spiritual contemplation, and establishing lasting dharmic impact.",
      guidance: "Recognize that your highest legacy is the wisdom and peace you leave behind.",
      unlockOpportunity: "Spiritual mastery, philanthropic foundations, and supreme inner contentment.",
    },
  ];

  const pastMilestones = MILESTONE_DEFINITIONS.filter((m) => m.age < currentAge).map((m) => ({
    age: m.age,
    title: m.title,
    theme: m.theme,
    outcome: m.outcome,
  }));

  const currentMilestoneDef =
    MILESTONE_DEFINITIONS.find((m) => Math.abs(m.age - currentAge) <= 3) ||
    MILESTONE_DEFINITIONS.filter((m) => m.age <= currentAge).pop() ||
    MILESTONE_DEFINITIONS[0];

  const currentMilestone = {
    age: currentMilestoneDef.age,
    title: currentMilestoneDef.title,
    theme: currentMilestoneDef.theme,
    focus: currentMilestoneDef.focus,
    guidance: currentMilestoneDef.guidance,
  };

  const futureWindows = MILESTONE_DEFINITIONS.filter((m) => m.age > currentAge).map((m) => ({
    age: m.age,
    title: m.title,
    theme: m.theme,
    unlockOpportunity: m.unlockOpportunity,
  }));

  const destinyTimeline = {
    currentAge,
    activeCycleHeadline: `Age ${currentAge}: Navigating ${currentMilestone.title}`,
    pastMilestones,
    currentMilestone,
    futureWindows,
  };

  // 13. Karmic Weather Station (Live Transits & Sade Sati)
  const transitEphem = calculateVedicEphemeris(now, location, "Lahiri", "WholeSign", "Mean");
  const gochar = calculateGochar(natalEphemeris, transitEphem);

  const jupGoch = gochar.transits.find((t) => t.id === "Jupiter");
  const rahuGoch = gochar.transits.find((t) => t.id === "Rahu");
  const ketuGoch = gochar.transits.find((t) => t.id === "Ketu");

  const karmicWeather = {
    sadeSati: {
      hasSadeSati: gochar.sadeSati.hasSadeSati,
      hasDhaiya: gochar.sadeSati.hasDhaiya,
      statusTitle: gochar.sadeSati.statusTitle,
      phaseName: gochar.sadeSati.phaseName,
      severity: gochar.sadeSati.severity,
      description: gochar.sadeSati.description,
      remedies: gochar.sadeSati.remedies,
      completionFormatted: gochar.sadeSati.totalCompletionFormatted || gochar.sadeSati.remainingDurationFormatted || "In Preparation",
    },
    jupiterTransit: {
      transitSign: jupGoch ? jupGoch.transitRashiName : "Taurus",
      houseFromMoon: jupGoch ? jupGoch.transitHouseFromMoon : 9,
      houseFromLagna: jupGoch ? jupGoch.transitHouseFromLagna : 4,
      isAuspicious: jupGoch ? jupGoch.isAuspicious : true,
      blessingTheme: jupGoch ? jupGoch.effectsSummary : "Expanding higher learning, spiritual wisdom, and righteous prosperity.",
    },
    rahuKetuAxis: {
      rahuSign: rahuGoch ? rahuGoch.transitRashiName : "Pisces",
      ketuSign: ketuGoch ? ketuGoch.transitRashiName : "Virgo",
      rahuHouseFromMoon: rahuGoch ? rahuGoch.transitHouseFromMoon : 12,
      ketuHouseFromMoon: ketuGoch ? ketuGoch.transitHouseFromMoon : 6,
      karmicEvolutionTheme: `Rahu in ${rahuGoch?.transitRashiName || "Pisces"} (House ${rahuGoch?.transitHouseFromMoon || 12} from Moon) prompts intuitive growth and foreign horizons, while Ketu in ${ketuGoch?.transitRashiName || "Virgo"} (House ${ketuGoch?.transitHouseFromMoon || 6}) brings natural detachment and mastery over daily obstacles.`,
    },
    vedhaTelemetry: {
      obstructedCount: gochar.obstructedCount,
      shieldedCount: gochar.shieldedCount,
      transitsWithVedha: gochar.transits.map((t) => ({
        planet: t.name,
        symbol: t.symbol,
        houseFromMoon: t.transitHouseFromMoon,
        transitSign: t.transitRashiName,
        netEfficacy: t.netEfficacy,
        isObstructed: t.isObstructed,
        obstructingPlanets: t.obstructingPlanets,
        vedhaHouse: t.vedhaHouse,
        isVipareetaVedha: t.isVipareetaVedha,
        shieldingPlanets: t.shieldingPlanets,
        vedhaExplanation: t.vedhaExplanation,
      })),
    },
  };

  const rahuConjunctions = detectRahuConjunctions(natalEphemeris);
  const karmicCursesAndShanti = synthesizeBphsKarmicShanti(natalEphemeris);

  // 14. Sacred Partner Blueprint
  const upapadaRes = evaluateUpapadaLagna(natalEphemeris);
  const d9AscSignIdx = calculateVargaSign(natalEphemeris.ascendant.siderealLongitude, "D9");
  const d9SeventhSignIdx = (d9AscSignIdx + 6) % 12;
  const d9SeventhSign = RASHI_NAMES[d9SeventhSignIdx]?.englishName || "Leo";
  const d9SeventhLord = RASHI_NAMES[d9SeventhSignIdx]?.lord || "Sun";

  const DK_PROFILES: Record<string, { persona: string; vibe: string; dynamic: string }> = {
    Sun: {
      persona: "A dignified leader with natural presence, aristocratic poise, and high self-respect.",
      vibe: "Warm, noble, radiant, and inspiring; demands and gives mutual honor.",
      dynamic: "Partnership thrives on mutual celebration of sovereignty; never belittle each other in public.",
    },
    Moon: {
      persona: "An empathetic nurturer with profound emotional intelligence and domestic warmth.",
      vibe: "Intuitive, gentle, deeply devoted, and sensitive to emotional atmospheres.",
      dynamic: "Partnership is a tranquil emotional sanctuary; thrives on gentle communication and tenderness.",
    },
    Mars: {
      persona: "A courageous, dynamic achiever with athletic energy and direct honesty.",
      vibe: "Passionate, protective, action-oriented, and decisive.",
      dynamic: "High energetic spark; requires shared active adventures and clear conflict resolution without holding grudges.",
    },
    Mercury: {
      persona: "A witty, intellectually agile communicator with youthful charm and curiosity.",
      vibe: "Playful, analytical, versatile, and an avid conversationalist.",
      dynamic: "Best friends first, lovers second; thrives on intellectual banter, books, and shared travel.",
    },
    Jupiter: {
      persona: "A wise, principled counselor with philosophical depth and high ethical character.",
      vibe: "Generous, spiritually grounded, optimistic, and supportive of your highest growth.",
      dynamic: "A sacred union of shared values; partners act as each other's trusted guru and anchor.",
    },
    Venus: {
      persona: "An artistically gifted, charming partner with refined taste and romantic grace.",
      vibe: "Aesthetic, affectionate, socially magnetic, and deeply appreciative of beauty.",
      dynamic: "Filled with romance, shared artistic projects, and deep sensory and emotional harmony.",
    },
    Saturn: {
      persona: "A mature, rock-solid pillar of discipline, endurance, and quiet dependability.",
      vibe: "Pragmatic, serious, patient, and intensely loyal through all life seasons.",
      dynamic: "Compounds in love and wealth over time; a marriage built on unbreakable loyalty and mutual respect.",
    },
  };

  const dkProfile = DK_PROFILES[dk.planetName] || DK_PROFILES.Jupiter;
  const ulSignIdx = RASHI_NAMES.findIndex((r) => r.englishName === upapadaRes.upapadaSign);
  const ulHouseInD1 = ulSignIdx !== -1 ? ((ulSignIdx - ascRashiIdx + 12) % 12) + 1 : 12;

  const sacredPartner = {
    spousePersona: `Governed by Darakaraka ${dk.planetName} and D-9 Navamsha 7th house in ${d9SeventhSign} (ruled by ${d9SeventhLord}): ${dkProfile.persona}`,
    physicalAndSocialVibe: dkProfile.vibe,
    temperamentAndValues: `Upapada Lagna in ${upapadaRes.upapadaSign} indicates a partner from a respected background with innate moral integrity. ${upapadaRes.spouseProfile}`,
    complementaryDynamic: dkProfile.dynamic,
    karmicBondType: upapadaRes.maritalHarmonyScore >= 70 ? "Dharmic Soul Union (Compounding mutual elevation)" : "Karmic Growth Catalyst (Fostering emotional maturity and patience)",
    upapadaLagna: {
      sign: upapadaRes.upapadaSign,
      houseInD1: ulHouseInD1,
      harmonyScore: upapadaRes.maritalHarmonyScore,
      longevityVerdict: upapadaRes.maritalLongevityVerdict,
      sacredRemedy: upapadaRes.jaiminiRemedies,
    },
  };

  // 15. Active Raja & Dhana Yogas
  const wealthCategories = ["Raja Yoga & Eminence", "Dhana & Prosperity", "Pancha Mahapurusha"];
  const ramanWealth = ramanYogas.yogas
    .filter((y) => !y.isCancelled && wealthCategories.includes(y.category))
    .map((y) => ({
      name: y.name,
      sanskritName: y.sanskritName,
      category: y.category,
      participatingGrahas: y.participatingGrahas,
      manifestation: y.practicalEffects || y.classicalDescription,
      activationTip: y.activationDashaLords && y.activationDashaLords.length > 0
        ? `Activates during periods of ${y.activationDashaLords.join(", ")}.`
        : "Enduring lifelong baseline of prosperity and social respect.",
    }));

  const rawYogas = detectVedicYogas(natalEphemeris);
  const rawWealth = rawYogas
    .filter((y) => ["Raja Yoga", "Dhana Yoga", "Mahapurusha Yoga", "Auspicious Yoga"].includes(y.category))
    .map((y) => ({
      name: y.name,
      sanskritName: y.sanskritName,
      category: y.category,
      participatingGrahas: y.participatingGrahas,
      manifestation: y.effects || y.description,
      activationTip: y.activationDasha || `Activates during periods of ${y.participatingGrahas.join(", ")}.`,
    }));

  const combinedWealth = [...ramanWealth, ...rawWealth.filter((ry) => !ramanWealth.some((rw) => rw.name === ry.name))];
  if (combinedWealth.length === 0) {
    combinedWealth.push({
      name: "Dhana Sthira Alignment",
      sanskritName: "धन स्थिर योग",
      category: "Dhana & Prosperity",
      participatingGrahas: [ascLord],
      manifestation: "A foundational alignment of self-reliance ensuring that steady disciplined labor reliably generates enduring assets.",
      activationTip: `Activated by cultivating the strengths of Lagna Lord ${ascLord}.`,
    });
  }

  const activeWealthYogas = combinedWealth.slice(0, 6);

  const wealthYogas = {
    induLagna: {
      sign: induLagna.induLagnaRashi.englishName,
      houseInD1: induLagna.induLagnaHouseFromD1,
      lord: induLagna.induLagnaRashi.lord,
      verdict: induLagna.wealthVerdict,
      strategy: `Your Indu Lagna (Special Wealth Pivot) rests in House ${induLagna.induLagnaHouseFromD1} (${induLagna.induLagnaRashi.englishName}). Channeling capital into the themes of House ${induLagna.induLagnaHouseFromD1} and partnering with Lord ${induLagna.induLagnaRashi.lord} energies unlocks your highest wealth multiplier.`,
    },
    activeYogas: activeWealthYogas,
    financialMindsetVerdict: activeWealthYogas.length >= 3
      ? "Endowed with prominent classical wealth yogas. Financial compounding occurs naturally through structured long-term investments and ethical competence."
      : "Steady wealth accumulation driven by focused disciplined effort and targeted commercial ventures.",
  };

  // 16. Soul's Guardian Deity (Ishta Devata & Spiritual Path)
  const karakamshaRes = evaluateKarakamsha(natalEphemeris);
  const ishta = karakamshaRes.ishtaDevata;

  const ishtaDevata = {
    atmakarakaPlanet: karakamshaRes.atmakarakaPlanet,
    karakamshaSign: karakamshaRes.karakamshaSign,
    twelfthSignFromKL: ishta.twelfthSignFromKL,
    ishtaDevataName: ishta.ishtaDevataName,
    spiritualPath: ishta.spiritualPath,
    sacredMantra: ishta.mantraRecommendation,
    dharmaDevata: ishta.dharmaDevataName,
    soulLesson: `As Atmakaraka ${karakamshaRes.atmakarakaPlanet} sits in ${karakamshaRes.karakamshaSign} in Navamsha, your soul's central lesson in this incarnation is mastering ${jaimini.atmakaraka.signification.toLowerCase()}. Aligning with ${ishta.ishtaDevataName} via ${ishta.spiritualPath} clears karmic blockages and accelerates your inner liberation.`,
  };

  // 17. 1-Page Executive Pocket Card Payload
  const pocketCard = {
    fullName: name,
    cosmicSignature: `${ascRashi} Ascendant • ${moonRashi} Moon (${moonNakshatra}) • ${sunRashi} Sun`,
    akAndAmk: `Soul King (AK): ${jaimini.atmakaraka.planetName} • Career Advisor (AmK): ${jaimini.amatyakaraka.planetName}`,
    dominantPillar: `${purusharthas.dominantPillar.title.split(" (")[0]} (${purusharthas.dominantPillar.score} pts • ${purusharthas.dominantPillar.percentage}%)`,
    powerDirection: `${functionalDirections.cardinalPowerZone ? `${functionalDirections.cardinalPowerZone.direction} Power Zone (${functionalDirections.cardinalPowerZone.activitiesCount} Activities)` : "East (Sun/Saturn)"}`,
    karmicWeatherSummary: gochar.sadeSati.hasSadeSati
      ? `${gochar.sadeSati.statusTitle}`
      : `Sade Sati Inactive • Jupiter in ${jupGoch?.transitRashiName || "Taurus"}`,
    safeGemstone: safeGemstones.length > 0 ? safeGemstones.join(", ") : "Pearl / Yellow Sapphire",
    dailyMantra: ishta.mantraRecommendation.split(" / ")[0] || "ॐ नमो भगवते वासुदेवाय",
    luckyDayAndHours: `${luckyDay} • Morning Sunrise (6:00 AM – 8:00 AM)`,
  };

  const progenyBlueprint = evaluateProgenyMaster(natalEphemeris, gender === "female" ? "female" : "male");

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
      essenceBreakdown,
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
    destinyTimeline,
    karmicWeather,
    rahuConjunctions,
    karmicCursesAndShanti,
    progenyBlueprint,
    sacredPartner,
    wealthYogas,
    ishtaDevata,
    pocketCard,
  };
}
