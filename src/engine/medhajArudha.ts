/**
 * Medhaj Astro Arudha Lagna Masterclass Engine (Sessions 75 through 79)
 * 
 * References:
 * - Session 75: Arudha Lagna (Part 2) — Perception vs Reality (Maya of Image),
 *   Support (2nd from AL) & Opposition (7th from AL), Transits over House Arudhas (A1–A12).
 *   Example: Jupiter over A6 (dissolves enemies/debts), Saturn over A6 (clears long conflicts/marital litigation).
 *   Saturn on AL = genuine, modest, hardworking, mass-aligned perception.
 * 
 * - Session 76: Arudha Lagna (Part 3) — Finding Your Connecting Jyotirlinga:
 *   Cosmic Conception (12 Amavasyas Sun-Moon union).
 *   Formula: Trines (1, 5, 9) from AL ∩ Quadrants (1, 4, 7, 10) from Natal Moon.
 *   Common Sign reveals Presiding Jyotirlinga (Rameshwaram to Trimbakeshwar).
 *   Arudha 1st/7th Exception Rule (count 10 houses forward).
 *   Sunrise/sunset meditation pouring out burdens dissolves Ketu past-life karma.
 * 
 * - Session 77: Arudha Lagna (Part 4) — High/Low Tide Theory & Spiritual Connection:
 *   AL (1st) = High Tide (Peak external visibility/action)
 *   4th from AL = High Tide (Inner domestic anchoring)
 *   7th from AL = Low Tide (Moksha Dwar / doorway to liberation / exit from public illusion)
 *   10th from AL = Low Tide (Low emotional anxiety, natural professional duty)
 *   Jupiter/Venus on AL = perceived as affluent/refined regardless of personal balance.
 *   Retrograde Saturn on AL = world misinterprets delays as deceptive.
 * 
 * - Session 78: Arudha Lagna (Part 5) — Wealth, Material Assets & Worldly Maya:
 *   Material luxury is a matter of perception (Arudha).
 *   Venus + Moon in 4th from AL: Immense tangible properties, houses, agricultural land, luxury vehicles.
 *   Benefics (Jupiter/Mercury) on 4th from AL: High comfort.
 *   Father's real estate: 4th from A9 (Bhagya Pada).
 *   Greatest Raj Yoga: Jupiter + Venus in 7th from AL (supreme societal status, authority, early fruition).
 *   Karmic Nodes: Rahu = future cravings; Ketu = past satiety & demanded detachment.
 * 
 * - Session 79: Arudha Lagna (Part 6) — Grand Raj Yogas & Liberation (Moksha):
 *   Planetary Horas daily routine framework.
 *   Supreme Prosperity Maha Raj Yoga: Benefics (Jupiter, Venus, Mercury, waxing Moon) in Trines (1, 5, 9) from AL.
 *   Moksha Dwar (7th from AL) Planetary Dignity:
 *     - Exalted planet: Graceful, joyful, willing detachment (e.g. Exalted Saturn in Libra).
 *     - Debilitated planet: Harsh friction, loss, or forced separation until compelled surrender.
 *     - Own sign planet: Moderate resolution through negotiation and prayer.
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateArudhaPadas, ArudhaPada } from "./jaimini";

// =========================================================================
// 1. JYOTIRLINGA DEFINITIONS & MAPPING (SESSION 76)
// =========================================================================

export interface JyotirlingaProfile {
  signIndex: number;
  signName: string;
  sanskritSign: string;
  name: string;
  location: string;
  state: string;
  deityArchetype: string;
  dissolutionPower: string;
  sadhanaProtocol: string;
}

export const JYOTIRLINGA_MASTER_MAP: Record<number, JyotirlingaProfile> = {
  0: {
    signIndex: 0,
    signName: "Aries",
    sanskritSign: "Mesha",
    name: "Rameshwaram",
    location: "Rameswaram Island",
    state: "Tamil Nadu",
    deityArchetype: "Sri Rama's Victorious Consecration (Setubandha)",
    dissolutionPower: "Destroys deep-seated guilt, self-doubt, unworthiness, and ancestral war karmas. Bestows righteous leadership and unshakeable victory.",
    sadhanaProtocol: "Meditate facing East at sunrise. Mentally surrender performance anxiety and remorse for past aggressive actions to Lord Rameshwaram.",
  },
  1: {
    signIndex: 1,
    signName: "Taurus",
    sanskritSign: "Vrishabha",
    name: "Somnath",
    location: "Prabhas Patan, Saurashtra",
    state: "Gujarat",
    deityArchetype: "Lord of the Moon (Chandra's Rejuvenation)",
    dissolutionPower: "Heals chronic depression, psychic fragmentation, financial instability, and emotional grief. Restores mental radiance, beauty, and liquid wealth.",
    sadhanaProtocol: "Meditate at sunset or during Moonrise. Surrender feelings of scarcity, emotional betrayal, and financial dread to Lord Somnath.",
  },
  2: {
    signIndex: 2,
    signName: "Gemini",
    sanskritSign: "Mithuna",
    name: "Nageshwar",
    location: "Dwarka Region",
    state: "Gujarat",
    deityArchetype: "Lord of Serpents (Darukavana Destroyer of Poisons)",
    dissolutionPower: "Neutralizes psychological poisons, nervous tremors, deceitful speech, litigious contracts, and malefic Rahu-Ketu serpent curses (Sarpa Dosha).",
    sadhanaProtocol: "Meditate at sunrise or Mercury Hora. Pour out burdens of misunderstood communications, toxic relationships, and restlessness to Lord Nageshwar.",
  },
  3: {
    signIndex: 3,
    signName: "Cancer",
    sanskritSign: "Karka",
    name: "Omkareshwar",
    location: "Mandhata Island, Narmada River",
    state: "Madhya Pradesh",
    deityArchetype: "The Cosmic Pranava Om (Narmada Heart Sanctum)",
    dissolutionPower: "Stabilizes fluctuating emotions, soothes heart grief, dissolves maternal and ancestral lineage debts, and establishes supreme domestic calm.",
    sadhanaProtocol: "Chant 'Om Namah Shivaya' focusing on the heart lotus (Anahata) at dawn. Surrender family trauma and domestic turbulence to Lord Omkareshwar.",
  },
  4: {
    signIndex: 4,
    signName: "Leo",
    sanskritSign: "Simha",
    name: "Baidyanath",
    location: "Deoghar, Santhal Parganas",
    state: "Jharkhand",
    deityArchetype: "The Divine Physician (Amritamaya Vaidyanatha)",
    dissolutionPower: "Eradicates chronic debilitating ailments, burns ego toxicity, removes bureaucratic or father-son friction, and restores royal vitality and health.",
    sadhanaProtocol: "Perform Surya Namaskar followed by quiet contemplation at sunrise. Surrender pride, physical fatigue, and father-related grievances to Lord Baidyanath.",
  },
  5: {
    signIndex: 5,
    signName: "Virgo",
    sanskritSign: "Kanya",
    name: "Mallikarjuna",
    location: "Srisailam, Nallamala Hills",
    state: "Andhra Pradesh",
    deityArchetype: "Shiva-Shakti Unified Grace (Shri Shaila Sanctum)",
    dissolutionPower: "Annihilates persistent professional adversaries, crushes litigations, liquidates debt spirals, and resolves obsessive anxieties.",
    sadhanaProtocol: "Meditate at twilight (Sandhya). Surrender competitive jealousy, debt stress, and work perfectionism to Lord Mallikarjuna and Goddess Bhramaramba.",
  },
  6: {
    signIndex: 6,
    signName: "Libra",
    sanskritSign: "Tula",
    name: "Mahakaleshwar",
    location: "Ujjain, Shipra River",
    state: "Madhya Pradesh",
    deityArchetype: "Supreme Master of Time and Death (Dakshināmurti)",
    dissolutionPower: "Dissolves fear of death, existential dread, catastrophic sudden downfall, and moral compromise in trade/partnerships. Upholds absolute cosmic justice.",
    sadhanaProtocol: "Meditate during sunset or Brahma Muhurta. Surrender worldly vanity, legal battles, and temporal anxieties to the immortal Lord Mahakaleshwar.",
  },
  7: {
    signIndex: 7,
    signName: "Scorpio",
    sanskritSign: "Vrishchika",
    name: "Grishneshwar",
    location: "Verul, Near Ellora",
    state: "Maharashtra",
    deityArchetype: "Lord of Ineffable Compassion (Ghushmeshwara)",
    dissolutionPower: "Purifies subterranean past-life sins, heals reproductive trauma, neutralizes occult attacks, and facilitates miraculous forgiveness and rebirth.",
    sadhanaProtocol: "Meditate in quiet darkness before bed or at sunset. Release deep grudges, past wounds, and sexual shame to the unconditionally forgiving Lord Grishneshwar.",
  },
  8: {
    signIndex: 8,
    signName: "Sagittarius",
    sanskritSign: "Dhanu",
    name: "Kashi Vishwanath",
    location: "Varanasi, Sacred Ganga",
    state: "Uttar Pradesh",
    deityArchetype: "Lord of the Universe & Bestower of Moksha (Taraka Mantra)",
    dissolutionPower: "Shatters spiritual ignorance, dissolves ancestral curses, bestows authentic philosophical discernment, and guides the soul toward liberation.",
    sadhanaProtocol: "Meditate at sunrise facing East. Offer your worldly attachments, spiritual doubts, and search for truth into the holy Ganga of Lord Vishwanath.",
  },
  9: {
    signIndex: 9,
    signName: "Capricorn",
    sanskritSign: "Makara",
    name: "Bhimashankar",
    location: "Sahyadri Hills, Bhima River Source",
    state: "Maharashtra",
    deityArchetype: "Slayer of Demon Tripurasura (Infinite Labor Strength)",
    dissolutionPower: "Overcomes relentless professional toil, crushes systemic oppression, removes structural bottlenecks, and grants titanic endurance to carry worldly duties.",
    sadhanaProtocol: "Meditate on Saturday morning or at dusk. Surrender professional exhaustion, career delays, and heavy familial burdens to Lord Bhimashankar.",
  },
  10: {
    signIndex: 10,
    signName: "Aquarius",
    sanskritSign: "Kumbha",
    name: "Kedarnath",
    location: "Garhwal Himalayas, Mandakini River",
    state: "Uttarakhand",
    deityArchetype: "The Eternal Ascetic of the Snows (Maha-Tapasvi)",
    dissolutionPower: "Washes away stubborn Ketu karmic debts, provides ultimate detachment from social deceit, heals social isolation, and grants transcendent peace.",
    sadhanaProtocol: "Meditate early morning in coolness and silence. Surrender public disillusionment, social alienation, and worldly fatigue to Lord Kedarnath.",
  },
  11: {
    signIndex: 11,
    signName: "Pisces",
    sanskritSign: "Meena",
    name: "Trimbakeshwar",
    location: "Nashik, Brahmagiri Mountain",
    state: "Maharashtra",
    deityArchetype: "Trinity Embodiment (Brahma, Vishnu & Rudra) & Maha Mrityunjaya",
    dissolutionPower: "Bestows divine grace, dissolves generational family curses (Pitru Dosha), grants final liberation (Moksha), and shields against unnatural death.",
    sadhanaProtocol: "Chant the Maha Mrityunjaya Mantra at dawn. Surrender the final fear of dissolution and the illusion of separate selfhood to Lord Trimbakeshwar.",
  },
};

// =========================================================================
// 2. TYPES & INTERFACES FOR SESSIONS 75–79
// =========================================================================

export interface PerceptionVsRealityAnalysis {
  physicalLagnaSign: string;
  physicalLagnaIndex: number;
  arudhaLagnaSign: string;
  arudhaLagnaIndex: number;
  arudhaLagnaHouseFromD1: number;
  isMismatchPresent: boolean;
  contrastTheme: string;
  internalReality: string;
  societalPerception: string;
  saturnOnALStatus: {
    hasSaturnOnAL: boolean;
    isRetrograde: boolean;
    perceptionEffect: string;
  };
  beneficsOnALStatus: {
    hasJupiterOnAL: boolean;
    hasVenusOnAL: boolean;
    hasMercuryOnAL: boolean;
    perceptionEffect: string;
  };
}

export interface SupportAndOppositionAnalysis {
  alHouseFromLagna: number;
  alSignIndex: number;
  alSignName: string;
  support2ndFromAL: {
    houseFromLagna: number;
    signIndex: number;
    signName: string;
    lord: string;
    occupyingPlanets: string[];
    supportDomain: string;
    practicalGuidance: string;
  };
  opposition7thFromAL: {
    houseFromLagna: number;
    signIndex: number;
    signName: string;
    lord: string;
    occupyingPlanets: string[];
    oppositionDomain: string;
    adversaryWarning: string;
  };
}

export interface PresidingJyotirlingaResult {
  alTrinesSignIndices: number[];
  alTrinesSignNames: string[];
  moonKendrasSignIndices: number[];
  moonKendrasSignNames: string[];
  commonSignIndex: number;
  commonSignName: string;
  jyotirlinga: JyotirlingaProfile;
  ketuKarmaDissolutionGuidance: string;
}

export interface ArudhaTideTheoryResult {
  alSignName: string;
  highTideQuadrant1: {
    houseFromAL: number;
    houseFromLagna: number;
    signName: string;
    tideType: "High Tide (Peak External Visibility / Action)";
    psychologicalManifestation: string;
  };
  highTideQuadrant4: {
    houseFromAL: number;
    houseFromLagna: number;
    signName: string;
    tideType: "High Tide (Inner Domestic Anchoring & Emotional Refuge)";
    psychologicalManifestation: string;
  };
  lowTideQuadrant7: {
    houseFromAL: number;
    houseFromLagna: number;
    signName: string;
    tideType: "Low Tide (Doorway to Liberation / Moksha Dwar)";
    psychologicalManifestation: string;
  };
  lowTideQuadrant10: {
    houseFromAL: number;
    houseFromLagna: number;
    signName: string;
    tideType: "Low Tide (Professional Duty Without Ego Attachment)";
    psychologicalManifestation: string;
  };
}

export interface ArudhaWealthAndRajYogasResult {
  fourthFromAL: {
    houseFromLagna: number;
    signName: string;
    occupyingPlanets: string[];
    hasVenusMoonPair: boolean;
    hasBenefics: boolean;
    realEstateVerdict: string;
  };
  fourthFromA9FatherProperty: {
    a9SignName: string;
    fourthFromA9HouseFromLagna: number;
    fourthFromA9SignName: string;
    occupyingPlanets: string[];
    fatherPropertyVerdict: string;
  };
  seventhFromALRajYoga: {
    occupyingPlanets: string[];
    hasJupiterVenusPair: boolean;
    rajYogaStatus: string;
  };
  mahaRajYogaTrines: {
    alTrineHousesFromLagna: number[];
    beneficsInALTrines: string[];
    isMahaRajYogaFormed: boolean;
    mahaRajYogaPhala: string;
  };
  karmicNodesWisdom: {
    rahuOrientation: string;
    ketuOrientation: string;
  };
}

export interface MokshaDwarDignityResult {
  seventhFromALHouseFromLagna: number;
  seventhFromALSignName: string;
  occupyingPlanets: {
    planet: string;
    dignity: "Exalted" | "Debilitated" | "Own Sign" | "Neutral" | "Friendly" | "Enemy";
    detachmentPhala: string;
  }[];
  overallMokshaExitDemeanor: string;
}

export interface HouseArudhaTransitEvent {
  padaCode: string;
  padaName: string;
  houseSignName: string;
  transitingPlanets: string[];
  manifestationImpact: string;
}

export interface MedhajArudhaMasterReport {
  perceptionVsReality: PerceptionVsRealityAnalysis;
  supportAndOpposition: SupportAndOppositionAnalysis;
  presidingJyotirlinga: PresidingJyotirlingaResult;
  tideTheory: ArudhaTideTheoryResult;
  wealthAndRajYogas: ArudhaWealthAndRajYogasResult;
  mokshaDwar: MokshaDwarDignityResult;
  houseArudhaTransits: HouseArudhaTransitEvent[];
  masterExecutiveSummary: string;
}

// =========================================================================
// 3. CORE CALCULATION FUNCTIONS
// =========================================================================

/**
 * 1. Session 75: Evaluates Perception vs Reality (Maya of Image)
 */
export function evaluatePerceptionVsReality(
  natalEphem: EphemerisResult,
  padas: ArudhaPada[]
): PerceptionVsRealityAnalysis {
  const d1AscSign = Math.floor((natalEphem.ascendant?.siderealLongitude || 0) / 30);
  const alPada = padas.find((p) => p.code === "AL") || padas[0];
  const alSign = alPada ? alPada.padaSignIndex : d1AscSign;
  const alHouseFromD1 = alPada ? alPada.padaHouse : 1;

  const isMismatchPresent = d1AscSign !== alSign;

  const lagnaName = RASHI_NAMES[d1AscSign].englishName;
  const alName = RASHI_NAMES[alSign].englishName;

  let contrastTheme = "Harmonious Alignment: Society perceives you very similarly to who you are internally.";
  let internalReality = `You operate from the core temperament of ${lagnaName} (House 1).`;
  let societalPerception = `The outer world views your aura through the lens of ${alName} (Arudha Lagna).`;

  // Specific canonical examples from Session 75:
  if (d1AscSign === 6 && alSign === 8) {
    // Libra Lagna + Sagittarius AL
    contrastTheme = "The Guru-Philosopher Persona: Balanced diplomat inside, perceived as a revered academic guide/guru outside.";
    internalReality = "Diplomatic, balanced, aesthetically refined, seeking fair compromise (Libra).";
    societalPerception = "Perceived by society as a righteous mentor, intellectual teacher, or spiritual advisor (Sagittarius).";
  } else if (d1AscSign === 3 && alSign === 7) {
    // Cancer Lagna + Scorpio AL
    contrastTheme = "The Enigmatic Investigator: Sensitive caregiver inside, perceived as intensely secretive or suspicious outside.";
    internalReality = "Gentle, emotional, protective, and deeply nurturing (Cancer).";
    societalPerception = "Society misconstrues your privacy as secretive, guarded, deeply skeptical, or investigative (Scorpio).";
  } else if (alSign === 10) {
    // Aquarius AL
    contrastTheme = "The Unconventional Thinker: Perceived as eccentric, visionary, or solitary recluse.";
    societalPerception = "Society perceives you as an unconventional, non-conformist genius or independent recluse (Aquarius).";
  } else if (isMismatchPresent) {
    contrastTheme = `Divergent Reflection: Internal ${lagnaName} energy radiates outward into an external ${alName} societal projection.`;
  }

  // Saturn on AL
  const saturn = natalEphem.planets["Saturn"];
  let hasSaturnOnAL = false;
  let isSatRetro = false;
  let satPerceptionEffect = "Saturn does not directly occupy the Arudha Lagna.";

  if (saturn) {
    const satSign = Math.floor(saturn.siderealLongitude / 30);
    if (satSign === alSign) {
      hasSaturnOnAL = true;
      isSatRetro = saturn.isRetrograde || false;
      satPerceptionEffect = isSatRetro
        ? "Retrograde Saturn on AL: The world can misinterpret your calculated delays, rigorous pauses, or deliberate actions as deceptive or evasive, even when your intentions are purely ethical."
        : "Direct Saturn on AL (Medhaj Astro Rule): Highly auspicious social image! Society views you as deeply genuine, modest, extremely hardworking, and naturally empathetic to the common masses and underdogs.";
    }
  }

  // Benefics on AL (Jupiter, Venus, Mercury)
  const jup = natalEphem.planets["Jupiter"];
  const ven = natalEphem.planets["Venus"];
  const merc = natalEphem.planets["Mercury"];

  const hasJupAL = jup ? Math.floor(jup.siderealLongitude / 30) === alSign : false;
  const hasVenAL = ven ? Math.floor(ven.siderealLongitude / 30) === alSign : false;
  const hasMercAL = merc ? Math.floor(merc.siderealLongitude / 30) === alSign : false;

  let beneficsPerceptionEffect = "No classical benefics occupying Arudha Lagna directly.";
  if (hasJupAL || hasVenAL) {
    beneficsPerceptionEffect =
      "Jupiter/Venus on AL (Session 77 Rule): Society perceives you as immensely affluent, cultured, refined, and prosperous, regardless of your personal liquid bank balance. People naturally assume you hold high wealth and good fortune.";
  } else if (hasMercAL) {
    beneficsPerceptionEffect =
      "Mercury on AL: Society perceives you as exceptionally articulate, youthful, quick-witted, and commercially shrewd.";
  }

  return {
    physicalLagnaSign: lagnaName,
    physicalLagnaIndex: d1AscSign,
    arudhaLagnaSign: alName,
    arudhaLagnaIndex: alSign,
    arudhaLagnaHouseFromD1: alHouseFromD1,
    isMismatchPresent,
    contrastTheme,
    internalReality,
    societalPerception,
    saturnOnALStatus: {
      hasSaturnOnAL,
      isRetrograde: isSatRetro,
      perceptionEffect: satPerceptionEffect,
    },
    beneficsOnALStatus: {
      hasJupiterOnAL: hasJupAL,
      hasVenusOnAL: hasVenAL,
      hasMercuryOnAL: hasMercAL,
      perceptionEffect: beneficsPerceptionEffect,
    },
  };
}

/**
 * 2. Session 75: Evaluates Support (2nd from AL) & Opposition (7th from AL)
 */
export function evaluateSupportAndOpposition(
  natalEphem: EphemerisResult,
  padas: ArudhaPada[]
): SupportAndOppositionAnalysis {
  const d1AscSign = Math.floor((natalEphem.ascendant?.siderealLongitude || 0) / 30);
  const alPada = padas.find((p) => p.code === "AL") || padas[0];
  const alSign = alPada ? alPada.padaSignIndex : d1AscSign;
  const alHouse = alPada ? alPada.padaHouse : 1;

  // 2nd from AL (Support)
  const signSupport = (alSign + 1) % 12;
  const houseSupport = ((alHouse % 12) + 1); // 2nd house relative to AL
  const lordSupport = RASHI_NAMES[signSupport].lord;
  const occSupport: string[] = [];

  for (const [pName, pData] of Object.entries(natalEphem.planets)) {
    if (Math.floor(pData.siderealLongitude / 30) === signSupport) {
      occSupport.push(pName);
    }
  }

  // 7th from AL (Opposition)
  const signOpp = (alSign + 6) % 12;
  const houseOpp = (((alHouse + 5) % 12) + 1); // 7th house relative to AL
  const lordOpp = RASHI_NAMES[signOpp].lord;
  const occOpp: string[] = [];

  for (const [pName, pData] of Object.entries(natalEphem.planets)) {
    if (Math.floor(pData.siderealLongitude / 30) === signOpp) {
      occOpp.push(pName);
    }
  }

  const supportDomain = `House ${houseSupport} from Lagna (${RASHI_NAMES[signSupport].englishName}): Ruled by ${lordSupport}. ${
    occSupport.length > 0 ? `Occupied by ${occSupport.join(", ")}.` : "Unoccupied."
  }`;
  const practicalGuidanceSupport = `Per Medhaj Astro, this house ALWAYS supports you. Look to ${RASHI_NAMES[signSupport].englishName} affairs, resources, and the lord ${lordSupport} to receive dependable allies, tangible backing, and capital.`;

  const oppositionDomain = `House ${houseOpp} from Lagna (${RASHI_NAMES[signOpp].englishName}): Ruled by ${lordOpp}. ${
    occOpp.length > 0 ? `Occupied by ${occOpp.join(", ")}.` : "Unoccupied."
  }`;
  const adversaryWarning = `Per Medhaj Astro, the 7th from AL ALWAYS opposes you in worldly life. Expect resistance, competitive hurdles, and pushback from ${RASHI_NAMES[signOpp].englishName} domains. Consciously avoid bitter ego combat here.`;

  return {
    alHouseFromLagna: alHouse,
    alSignIndex: alSign,
    alSignName: RASHI_NAMES[alSign].englishName,
    support2ndFromAL: {
      houseFromLagna: houseSupport,
      signIndex: signSupport,
      signName: RASHI_NAMES[signSupport].englishName,
      lord: lordSupport,
      occupyingPlanets: occSupport,
      supportDomain,
      practicalGuidance: practicalGuidanceSupport,
    },
    opposition7thFromAL: {
      houseFromLagna: houseOpp,
      signIndex: signOpp,
      signName: RASHI_NAMES[signOpp].englishName,
      lord: lordOpp,
      occupyingPlanets: occOpp,
      oppositionDomain,
      adversaryWarning,
    },
  };
}

/**
 * 3. Session 76: Presiding Jyotirlinga Discovery Formula
 * Formula: Trines (1, 5, 9) from AL ∩ Quadrants (1, 4, 7, 10) from Natal Moon.
 * Always resolves to a unique common sign!
 */
export function calculatePresidingJyotirlinga(
  natalEphem: EphemerisResult,
  padas: ArudhaPada[]
): PresidingJyotirlingaResult {
  const d1AscSign = Math.floor((natalEphem.ascendant?.siderealLongitude || 0) / 30);
  const alPada = padas.find((p) => p.code === "AL") || padas[0];
  const alSign = alPada ? alPada.padaSignIndex : d1AscSign;

  const alTrines = [alSign, (alSign + 4) % 12, (alSign + 8) % 12];
  const alTrineNames = alTrines.map((s) => RASHI_NAMES[s].englishName);

  const moon = natalEphem.planets["Moon"];
  const moonSign = moon ? Math.floor(moon.siderealLongitude / 30) : d1AscSign;
  const moonKendras = [moonSign, (moonSign + 3) % 12, (moonSign + 6) % 12, (moonSign + 9) % 12];
  const moonKendraNames = moonKendras.map((s) => RASHI_NAMES[s].englishName);

  // Common sign: Set A ∩ Set B
  const common = alTrines.filter((s) => moonKendras.includes(s));
  const presidingSign = common.length > 0 ? common[0] : alSign;
  const jyotirlinga = JYOTIRLINGA_MASTER_MAP[presidingSign];

  const ketuGuidance = `Daily Healing Sadhana (Session 76): Meditate at sunrise or sunset focusing on Lord ${jyotirlinga.name} (${jyotirlinga.location}, ${jyotirlinga.state}). Mentally pour out your deepest emotional anxieties, grievances, and unfulfilled desires as you would to your loving cosmic parents. This dissolves past-life karmic knots stored in natal Ketu.`;

  return {
    alTrinesSignIndices: alTrines,
    alTrinesSignNames: alTrineNames,
    moonKendrasSignIndices: moonKendras,
    moonKendrasSignNames: moonKendraNames,
    commonSignIndex: presidingSign,
    commonSignName: RASHI_NAMES[presidingSign].englishName,
    jyotirlinga,
    ketuKarmaDissolutionGuidance: ketuGuidance,
  };
}

/**
 * 4. Session 77: The Tide Theory of Arudha Lagna
 */
export function evaluateArudhaTideTheory(
  natalEphem: EphemerisResult,
  padas: ArudhaPada[]
): ArudhaTideTheoryResult {
  const d1AscSign = Math.floor((natalEphem.ascendant?.siderealLongitude || 0) / 30);
  const alPada = padas.find((p) => p.code === "AL") || padas[0];
  const alSign = alPada ? alPada.padaSignIndex : d1AscSign;
  const alHouse = alPada ? alPada.padaHouse : 1;

  const h1Sign = alSign;
  const h1House = alHouse;

  const h4Sign = (alSign + 3) % 12;
  const h4House = ((alHouse + 2) % 12) + 1;

  const h7Sign = (alSign + 6) % 12;
  const h7House = ((alHouse + 5) % 12) + 1;

  const h10Sign = (alSign + 9) % 12;
  const h10House = ((alHouse + 8) % 12) + 1;

  return {
    alSignName: RASHI_NAMES[alSign].englishName,
    highTideQuadrant1: {
      houseFromAL: 1,
      houseFromLagna: h1House,
      signName: RASHI_NAMES[h1Sign].englishName,
      tideType: "High Tide (Peak External Visibility / Action)",
      psychologicalManifestation: "High Tide Zone: The point of maximum worldly engagement, social action, and conscious public projection. Society sees your decisions clearly here.",
    },
    highTideQuadrant4: {
      houseFromAL: 4,
      houseFromLagna: h4House,
      signName: RASHI_NAMES[h4Sign].englishName,
      tideType: "High Tide (Inner Domestic Anchoring & Emotional Refuge)",
      psychologicalManifestation: "High Tide Zone: Emotional depth, private real estate, family stability, and psychological sanctuary where your mind anchors itself.",
    },
    lowTideQuadrant7: {
      houseFromAL: 7,
      houseFromLagna: h7House,
      signName: RASHI_NAMES[h7Sign].englishName,
      tideType: "Low Tide (Doorway to Liberation / Moksha Dwar)",
      psychologicalManifestation: "Low Tide Zone: The point of emotional release and disillusionment from societal theater. Operates as the exit portal (Moksha Dwar) where ego surrenders.",
    },
    lowTideQuadrant10: {
      houseFromAL: 10,
      houseFromLagna: h10House,
      signName: RASHI_NAMES[h10Sign].englishName,
      tideType: "Low Tide (Professional Duty Without Ego Attachment)",
      psychologicalManifestation: "Low Tide Zone: Natural professional execution without obsessive emotional angst. Duty is performed dispassionately as a karmic obligation.",
    },
  };
}

/**
 * 5. Session 78: Real Estate, Wealth & Grand Raj Yogas from AL
 */
export function evaluateArudhaWealthAndRajYogas(
  natalEphem: EphemerisResult,
  padas: ArudhaPada[]
): ArudhaWealthAndRajYogasResult {
  const d1AscSign = Math.floor((natalEphem.ascendant?.siderealLongitude || 0) / 30);
  const alPada = padas.find((p) => p.code === "AL") || padas[0];
  const alSign = alPada ? alPada.padaSignIndex : d1AscSign;
  const alHouse = alPada ? alPada.padaHouse : 1;

  // 4th from AL (Properties & Vehicles)
  const h4Sign = (alSign + 3) % 12;
  const h4House = ((alHouse + 2) % 12) + 1;
  const occ4th: string[] = [];

  for (const [pName, pData] of Object.entries(natalEphem.planets)) {
    if (Math.floor(pData.siderealLongitude / 30) === h4Sign) {
      occ4th.push(pName);
    }
  }

  const hasVenusIn4th = occ4th.includes("Venus");
  const hasMoonIn4th = occ4th.includes("Moon");
  const hasVenusMoonPair = hasVenusIn4th && hasMoonIn4th;
  const hasBeneficsIn4th = occ4th.some((p) => ["Jupiter", "Venus", "Mercury", "Moon"].includes(p));

  let realEstateVerdict = "Standard property indicators from Arudha Lagna.";
  if (hasVenusMoonPair) {
    realEstateVerdict =
      "🌟 Supreme Property Yoga (Session 78 Rule): Venus and Moon occupy the 4th house from Arudha Lagna! The native is blessed with vast tangible properties, luxurious residential estates, agricultural land, and high-end motor vehicles.";
  } else if (hasVenusIn4th || hasMoonIn4th) {
    realEstateVerdict = `Strong Real Estate Blessing: ${
      hasVenusIn4th ? "Venus" : "Moon"
    } in 4th from AL grants comfortable real estate, aesthetic interiors, and convenient vehicular comforts.`;
  } else if (hasBeneficsIn4th) {
    realEstateVerdict =
      "Benefics in 4th from AL: Widespread perceived and real domestic comforts, honorable family residence, and peaceful living conditions.";
  }

  // 4th from A9 (Father's Real Estate)
  const a9Pada = padas.find((p) => p.code === "A9");
  const a9Sign = a9Pada ? a9Pada.padaSignIndex : (d1AscSign + 8) % 12;
  const h4FromA9Sign = (a9Sign + 3) % 12;
  const h4FromA9House = (((a9Pada ? a9Pada.padaHouse : 9) + 2) % 12) + 1;
  const occ4thFromA9: string[] = [];

  for (const [pName, pData] of Object.entries(natalEphem.planets)) {
    if (Math.floor(pData.siderealLongitude / 30) === h4FromA9Sign) {
      occ4thFromA9.push(pName);
    }
  }

  const fatherPropertyVerdict = `Father's Property Gateway: 4th from A9 sits in House ${h4FromA9House} (${RASHI_NAMES[h4FromA9Sign].englishName}). ${
    occ4thFromA9.length > 0 ? `Influenced by ${occ4thFromA9.join(", ")}.` : "No direct planetary occupants."
  } Represents ancestral family lands and paternal property inheritance.`;

  // 7th from AL: Jupiter + Venus (Greatest Raj Yoga)
  const h7Sign = (alSign + 6) % 12;
  const occ7th: string[] = [];
  for (const [pName, pData] of Object.entries(natalEphem.planets)) {
    if (Math.floor(pData.siderealLongitude / 30) === h7Sign) {
      occ7th.push(pName);
    }
  }

  const hasJupIn7th = occ7th.includes("Jupiter");
  const hasVenIn7th = occ7th.includes("Venus");
  const hasJupVenPair = hasJupIn7th && hasVenIn7th;

  let rajYoga7thStatus = "Standard 7th from AL disposition.";
  if (hasJupVenPair) {
    rajYoga7thStatus =
      "👑 Supreme Arudha Raj Yoga (Session 78 Crown Rule): Jupiter and Venus both sit in the 7th house from Arudha Lagna! Grants colossal societal veneration, early material fulfillment, high executive or advisory authority, and royal public honor.";
  } else if (hasJupIn7th || hasVenIn7th) {
    rajYoga7thStatus = `Auspicious 7th AL Status: ${
      hasJupIn7th ? "Jupiter" : "Venus"
    } in 7th from AL elevates societal prestige, ensures honorable opposition, and softens worldly confrontations.`;
  }

  // Session 79: Benefics in Trines (1, 5, 9) from AL -> Maha Raj Yoga
  const alTrineSigns = [alSign, (alSign + 4) % 12, (alSign + 8) % 12];
  const alTrineHouses = [
    alHouse,
    ((alHouse + 3) % 12) + 1,
    ((alHouse + 7) % 12) + 1,
  ];

  const beneficsInTrines: string[] = [];
  for (const [pName, pData] of Object.entries(natalEphem.planets)) {
    if (["Jupiter", "Venus", "Mercury"].includes(pName)) {
      const pSign = Math.floor(pData.siderealLongitude / 30);
      if (alTrineSigns.includes(pSign)) {
        beneficsInTrines.push(pName);
      }
    }
  }

  const isMahaRajYoga = beneficsInTrines.length >= 2;
  const mahaRajYogaPhala = isMahaRajYoga
    ? `✨ Maha Raj Yoga in AL Trines (Session 79 Rule): Benefics (${beneficsInTrines.join(
        ", "
      )}) occupy the trines (1st, 5th, 9th) from Arudha Lagna! Bestows continuous wealth, celebrated public reputation, unblemished honor, and a supremely fortunate lifestyle.`
    : beneficsInTrines.length === 1
    ? `Supportive Dharma-Karma Trine: ${beneficsInTrines[0]} in AL trines offers consistent protection and reputation shields.`
    : "Standard AL trine configuration.";

  return {
    fourthFromAL: {
      houseFromLagna: h4House,
      signName: RASHI_NAMES[h4Sign].englishName,
      occupyingPlanets: occ4th,
      hasVenusMoonPair,
      hasBenefics: hasBeneficsIn4th,
      realEstateVerdict,
    },
    fourthFromA9FatherProperty: {
      a9SignName: RASHI_NAMES[a9Sign].englishName,
      fourthFromA9HouseFromLagna: h4FromA9House,
      fourthFromA9SignName: RASHI_NAMES[h4FromA9Sign].englishName,
      occupyingPlanets: occ4thFromA9,
      fatherPropertyVerdict,
    },
    seventhFromALRajYoga: {
      occupyingPlanets: occ7th,
      hasJupiterVenusPair: hasJupVenPair,
      rajYogaStatus: rajYoga7thStatus,
    },
    mahaRajYogaTrines: {
      alTrineHousesFromLagna: alTrineHouses,
      beneficsInALTrines: beneficsInTrines,
      isMahaRajYogaFormed: isMahaRajYoga,
      mahaRajYogaPhala,
    },
    karmicNodesWisdom: {
      rahuOrientation:
        "Rahu represents unfulfilled, hungry future obsessions—what you have never tasted before. Pursued with relentless material thirst.",
      ketuOrientation:
        "Ketu represents past satiety and soul mastery. It bestows worldly gifts generously only to demand subsequent internal detachment.",
    },
  };
}

/**
 * 6. Session 79: Moksha Dwar (7th from AL) Planetary Dignity Evaluator
 */
export function evaluateMokshaDwarDignity(
  natalEphem: EphemerisResult,
  padas: ArudhaPada[]
): MokshaDwarDignityResult {
  const d1AscSign = Math.floor((natalEphem.ascendant?.siderealLongitude || 0) / 30);
  const alPada = padas.find((p) => p.code === "AL") || padas[0];
  const alSign = alPada ? alPada.padaSignIndex : d1AscSign;
  const alHouse = alPada ? alPada.padaHouse : 1;

  const h7Sign = (alSign + 6) % 12;
  const h7House = ((alHouse + 5) % 12) + 1;
  const occupying: MokshaDwarDignityResult["occupyingPlanets"] = [];

  for (const [pName, pData] of Object.entries(natalEphem.planets)) {
    const pSign = Math.floor(pData.siderealLongitude / 30);
    if (pSign === h7Sign) {
      let dig: MokshaDwarDignityResult["occupyingPlanets"][0]["dignity"] = "Neutral";
      let phala = "";

      // Exaltation check
      if (
        (pName === "Sun" && pSign === 0) ||
        (pName === "Moon" && pSign === 1) ||
        (pName === "Mars" && pSign === 9) ||
        (pName === "Mercury" && pSign === 5) ||
        (pName === "Jupiter" && pSign === 3) ||
        (pName === "Venus" && pSign === 11) ||
        (pName === "Saturn" && pSign === 6)
      ) {
        dig = "Exalted";
        phala = `Exalted ${pName} in Moksha Dwar: Worldly detachment and spiritual liberation occur gracefully, joyfully, and with profound dignity. The native willingly surrenders social illusion without bitter regret.`;
      } else if (
        (pName === "Sun" && pSign === 6) ||
        (pName === "Moon" && pSign === 7) ||
        (pName === "Mars" && pSign === 3) ||
        (pName === "Mercury" && pSign === 11) ||
        (pName === "Jupiter" && pSign === 9) ||
        (pName === "Venus" && pSign === 5) ||
        (pName === "Saturn" && pSign === 0)
      ) {
        dig = "Debilitated";
        phala = `Debilitated ${pName} in Moksha Dwar: Liberation occurs through painful friction, abrupt loss, or forced separation. The native clings stubbornly to societal illusions until circumstances compel ultimate surrender.`;
      } else if (
        (pName === "Sun" && pSign === 4) ||
        (pName === "Moon" && pSign === 3) ||
        (pName === "Mars" && [0, 7].includes(pSign)) ||
        (pName === "Mercury" && [2, 5].includes(pSign)) ||
        (pName === "Jupiter" && [8, 11].includes(pSign)) ||
        (pName === "Venus" && [1, 6].includes(pSign)) ||
        (pName === "Saturn" && [9, 10].includes(pSign))
      ) {
        dig = "Own Sign";
        phala = `Own-Sign ${pName} in Moksha Dwar: Disillusionment and release resolve moderately and peacefully through dialogue, patient arbitration, and sincere prayer.`;
      } else {
        dig = "Neutral";
        phala = `${pName} in Moksha Dwar: Spiritual detachment evolves progressively through normal life transitions and gradual maturity.`;
      }

      occupying.push({
        planet: pName,
        dignity: dig,
        detachmentPhala: phala,
      });
    }
  }

  let demeanor = "Unoccupied Moksha Dwar: Worldly exit points and spiritual detachment are governed by the sign ruler.";
  if (occupying.length > 0) {
    demeanor = occupying.map((o) => o.detachmentPhala).join(" ");
  }

  return {
    seventhFromALHouseFromLagna: h7House,
    seventhFromALSignName: RASHI_NAMES[h7Sign].englishName,
    occupyingPlanets: occupying,
    overallMokshaExitDemeanor: demeanor,
  };
}

/**
 * 7. Session 75: Evaluates Transits over House Arudhas (A1 through A12)
 */
export function evaluateHouseArudhaTransits(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult,
  padas: ArudhaPada[]
): HouseArudhaTransitEvent[] {
  const events: HouseArudhaTransitEvent[] = [];

  for (const pada of padas) {
    const pSign = pada.padaSignIndex;
    const transitingOnPada: string[] = [];

    for (const [tName, tData] of Object.entries(transitEphem.planets)) {
      const tSign = Math.floor(tData.siderealLongitude / 30);
      if (tSign === pSign) {
        transitingOnPada.push(tName);
      }
    }

    if (transitingOnPada.length > 0) {
      let impact = `Transiting ${transitingOnPada.join(", ")} over ${pada.code} (${pada.name}) activates external manifestations of ${pada.signification}.`;

      // Session 75 Specific Canons:
      if (pada.code === "A6") {
        if (transitingOnPada.includes("Jupiter")) {
          impact =
            "🌟 Jupiter Transit over A6 (Session 75 Rule): Exceptional victory! Jupiter dissolves enemies, clears chronic debts, and facilitates triumphant resolution in active litigations.";
        }
        if (transitingOnPada.includes("Saturn")) {
          impact =
            "🛡️ Saturn Transit over A6 (Session 75 Rule): Saturn decisively settles long-standing conflicts, extinguishes debts, and forces finality in stubborn disputes or marital legalities.";
        }
      } else if (pada.code === "AL") {
        if (transitingOnPada.includes("Jupiter")) {
          impact = "Jupiter Transit over AL: Heightened public prestige, societal benevolence, and widespread recognition.";
        }
        if (transitingOnPada.includes("Saturn")) {
          impact = "Saturn Transit over AL: Severe stress-test on social prestige; strips away ego masks and rewards authentic labor.";
        }
      }

      events.push({
        padaCode: pada.code,
        padaName: pada.name,
        houseSignName: RASHI_NAMES[pSign].englishName,
        transitingPlanets: transitingOnPada,
        manifestationImpact: impact,
      });
    }
  }

  return events;
}

// =========================================================================
// 8. MASTER REPORT SYNTHESIS
// =========================================================================

export function generateMedhajArudhaMasterReport(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult,
  birthDate: Date,
  evaluationDate: Date = new Date()
): MedhajArudhaMasterReport {
  const padas = calculateArudhaPadas(natalEphem);
  const perceptionVsReality = evaluatePerceptionVsReality(natalEphem, padas);
  const supportAndOpposition = evaluateSupportAndOpposition(natalEphem, padas);
  const presidingJyotirlinga = calculatePresidingJyotirlinga(natalEphem, padas);
  const tideTheory = evaluateArudhaTideTheory(natalEphem, padas);
  const wealthAndRajYogas = evaluateArudhaWealthAndRajYogas(natalEphem, padas);
  const mokshaDwar = evaluateMokshaDwarDignity(natalEphem, padas);
  const houseArudhaTransits = evaluateHouseArudhaTransits(natalEphem, transitEphem, padas);

  const j = presidingJyotirlinga.jyotirlinga;
  const p = perceptionVsReality;
  const s = supportAndOpposition;
  const w = wealthAndRajYogas;
  const m = mokshaDwar;

  const lines: string[] = [
    "### 🕉️ MEDHAJ ASTRO ARUDHA LAGNA & JYOTIRLINGA MASTER REPORT (SESSIONS 75–79)",
    `- **Physical Lagna ($D_1$):** **${p.physicalLagnaSign}** • **Arudha Lagna (AL):** **${p.arudhaLagnaSign} (House #${p.arudhaLagnaHouseFromD1})**`,
    `- **Perception vs. Reality:** ${p.contrastTheme}`,
    `  - *Inner Reality:* ${p.internalReality}`,
    `  - *Societal Perception:* ${p.societalPerception}`,
    p.saturnOnALStatus.hasSaturnOnAL ? `  - **Saturn on AL:** ${p.saturnOnALStatus.perceptionEffect}` : "",
    p.beneficsOnALStatus.hasJupiterOnAL || p.beneficsOnALStatus.hasVenusOnAL ? `  - **Benefics on AL:** ${p.beneficsOnALStatus.perceptionEffect}` : "",
    "",
    "#### 🔱 1. Your Presiding Jyotirlinga (Session 76 Cosmic Origin):",
    `- **Presiding Shrine:** **Lord ${j.name}** (${j.location}, ${j.state}) • Sign: **${j.signName} (${j.sanskritSign})**`,
    `- **Formula Derivation:** Trines from AL [${presidingJyotirlinga.alTrinesSignNames.join(", ")}] ∩ Kendras from Moon [${presidingJyotirlinga.moonKendrasSignNames.join(", ")}] ➔ **${presidingJyotirlinga.commonSignName}**`,
    `- **Deity Archetype:** ${j.deityArchetype}`,
    `- **Dissolution Vector:** ${j.dissolutionPower}`,
    `- **Ketu Karmic Sadhana:** ${presidingJyotirlinga.ketuKarmaDissolutionGuidance}`,
    "",
    "#### 🛡️ 2. Worldly Support & Opposition Matrix (Session 75):",
    `- **2nd from AL (Unconditional Support):** House ${s.support2ndFromAL.houseFromLagna} (${s.support2ndFromAL.signName} ruled by ${s.support2ndFromAL.lord}) ──► ${s.support2ndFromAL.practicalGuidance}`,
    `- **7th from AL (Worldly Opposition):** House ${s.opposition7thFromAL.houseFromLagna} (${s.opposition7thFromAL.signName} ruled by ${s.opposition7thFromAL.lord}) ──► ${s.opposition7thFromAL.adversaryWarning}`,
    "",
    "#### 🌊 3. The Tide Theory of Arudha Lagna (Session 77):",
    `- **AL (1st):** High Tide (${tideTheory.highTideQuadrant1.signName}) ──► ${tideTheory.highTideQuadrant1.psychologicalManifestation}`,
    `- **4th from AL:** High Tide (${tideTheory.highTideQuadrant4.signName}) ──► ${tideTheory.highTideQuadrant4.psychologicalManifestation}`,
    `- **7th from AL:** Low Tide (${tideTheory.lowTideQuadrant7.signName}) ──► ${tideTheory.lowTideQuadrant7.psychologicalManifestation}`,
    `- **10th from AL:** Low Tide (${tideTheory.lowTideQuadrant10.signName}) ──► ${tideTheory.lowTideQuadrant10.psychologicalManifestation}`,
    "",
    "#### 👑 4. Wealth, Real Estate & Grand Raj Yogas (Sessions 78 & 79):",
    `- **Properties & Vehicles (4th from AL):** ${w.fourthFromAL.realEstateVerdict}`,
    `- **Father's Land & Inheritance (4th from A9):** ${w.fourthFromA9FatherProperty.fatherPropertyVerdict}`,
    `- **Supreme Status Raj Yoga (7th from AL):** ${w.seventhFromALRajYoga.rajYogaStatus}`,
    `- **Maha Raj Yoga (Benefics in AL Trines):** ${w.mahaRajYogaTrines.mahaRajYogaPhala}`,
    "",
    "#### 🚪 5. Moksha Dwar (7th from AL Liberation Dignity - Session 79):",
    `- **Doorway House:** House ${m.seventhFromALHouseFromLagna} (${m.seventhFromALSignName})`,
    `- **Detachment Demeanor:** ${m.overallMokshaExitDemeanor}`,
    "",
    "#### 🪐 6. Active Transits over House Arudhas (A1–A12 - Session 75):",
    houseArudhaTransits.length > 0
      ? houseArudhaTransits.map((e) => `  - **${e.padaCode} (${e.padaName}) in ${e.houseSignName}:** ${e.manifestationImpact}`).join("\n")
      : "  - No major planetary transits over sensitive Arudha Padas currently.",
  ];

  return {
    perceptionVsReality,
    supportAndOpposition,
    presidingJyotirlinga,
    tideTheory,
    wealthAndRajYogas,
    mokshaDwar,
    houseArudhaTransits,
    masterExecutiveSummary: lines.filter(Boolean).join("\n"),
  };
}
