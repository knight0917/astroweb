/**
 * Classical Vedic Planetary Exaltation & Debilitation Archetypes (Uchha & Neecha Grahas),
 * Conscious Awareness vs. Blind Spot, Father-Son Inversion, and Transit Geometric Axes
 * (उच्च-नीच ग्रह चेतना, अंध-बिंदु, पिता-पुत्र विपरीतता व गोचर दृष्टि ज्यामिति)
 *
 * Shastric Foundations:
 * - Session 80: Exaltation and Debilitation States of Planets (Part 1)
 *   - Astrology as Lord Shiva's Science for self-correction and karmic calibration, not intellectual ego.
 *   - Quick Panchanga Tattva Memory Key: Vara (Desire / Fire), Tithi (Emotion & Past Karma / Water),
 *     Karan (Physical Execution / Earth), Yoga (Divine Grace / Space), Nakshatra (Relationships & Networks / Air).
 *   - Primacy of Lagnesha: The Ascendant Lord is the chart's ultimate protector; even if debilitated,
 *     it actively protects the native and energizes its occupied house.
 *   - The Archetypal Psychology & Logic of Dignities (Why Planets Exalt/Debilitate where they do):
 *     * Sun (Surya): MT Leo (Throne). Exalted in Aries (Dawn, raw vitality, uncompromised leadership).
 *       Debilitated in Libra (Dusk/sunset, marketplace, pleading/compromising/flattering).
 *     * Moon (Chandra): MT Cancer (Domestic comfort & midnight rest). Exalted in Taurus (Mind content
 *       with nourishing food, fine clothes, tangible financial security, peaceful domestic comfort).
 *       Debilitated in Scorpio (8th house upheavals, hidden anxieties, dark intensity, psychological crises).
 *     * Jupiter (Guru): MT Sagittarius (Higher knowledge). Exalted in Cancer (Ashram/classroom, sharing wisdom,
 *       deep emotional bond with seekers). Debilitated in Capricorn (Corporate grind, manual labor where wisdom
 *       feels constrained).
 *     * Mars (Mangal): MT Aries (Raw impulsive courage). Exalted in Capricorn (Soldier & tactical execution,
 *       martial fire disciplined by structure/patience into unstoppable accomplishment). Debilitated in Cancer
 *       (Soft domestic emotion, tears, maternal comfort; warrior cannot fight effectively while crying).
 *     * Venus (Shukra): MT Libra (Harmonious partnerships, aesthetic beauty). Exalted in Pisces (True romance
 *       and devotion peak when love transcends material bargaining into selfless surrender / blind faith in the boundless ocean).
 *       Debilitated in Virgo (Constant criticism, auditing, analytical dissection, transactional flaw-finding).
 *     * Mercury (Budha): MT & Exalted in Virgo (Analytical intelligence, accounting, classification, meticulous detail).
 *       Debilitated in Pisces (Boundless spiritual ocean renders transactional debates and calculative bookkeeping irrelevant).
 *     * Saturn (Shani): MT Aquarius (Humanitarian brotherhood, serving the masses). Exalted in Libra (Supreme judge
 *       of justice/Nyayadhikari, measured impartial justice and diplomacy on the scales). Debilitated in Aries
 *       (Explosive rash speed ruins Saturn's cold, slow, measured deliberation).
 *   - Father-Son Inversion Axis: Where father Sun exalts in Aries, son Saturn debilitates; where father Sun
 *     debilitates in Libra, son Saturn exalts.
 *   - Rahu and Ketu: No absolute exaltation/debilitation; they absorb sign and dispositor dynamics.
 * - Session 81: Exaltation and Debilitation States of Planets (Part 2)
 *   - Exaltation Does NOT Guarantee Raja Yoga or effortless worldly success.
 *   - True Meaning of Exaltation = High Conscious Awareness (Chetana / Jagruti): Native possesses acute perception,
 *     sharp recognition, and deep past-life familiarity (Purva Janma Karma) with that planet's domain.
 *   - True Meaning of Debilitation (Neecha) = Blind Spot / Inexperience / Unawareness: Not inherently malevolent
 *     or ruined; marks an area where the native is inexperienced, lacks natural intuition, and must exert conscious,
 *     humble effort to learn.
 *   - Real-Time Transit Case Study & Geometric Aspect Mechanics:
 *     * 180° Direct Oppositions (Sun in Cancer vs. Retrograde Saturn in Capricorn): Evaluation of relative strength
 *       in transit opposition (Saturn in Swarashi + Retrograde Chesta Bala overpowers Sun in emotional water sign ->
 *       labor/public overpowers leadership; leaders must drop ego and serve).
 *     * 3/11 Geometric Axis Dynamic (Upachaya / Inspiration): Planets in 3/11 relationship inspire and compel constructive action.
 *     * 6/8 Geometric Axis Dynamic (Shadashtaka / Friction): Planets in 6/8 relationship trigger moral friction and ideological tension.
 *     * Conjunction of Moon and Venus in Taurus: Sensual/material desires magnified; warning against deceit in relationships
 *       (triggers wealth loss), while honesty and generosity bring lasting wealth and happiness.
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";

// ==========================================
// 1. INTERFACES & TYPES
// ==========================================

export interface PlanetaryDignityPsychology {
  planet: string;
  moolatrikonaSign: string;
  moolatrikonaArchetype: string;
  exaltationSign: string;
  exaltationDegree: number;
  exaltationEnvironment: string;
  exaltationWhyRejoices: string;
  consciousAwarenessSuperpower: string;
  exaltationEgoPitfall: string;
  debilitationSign: string;
  debilitationDegree: number;
  debilitationEnvironment: string;
  debilitationWhyConstrained: string;
  blindSpotInexperience: string;
  remedialMindfulness: string;
}

export interface NatalDignityAwarenessItem {
  planet: string;
  signName: string;
  signIndex: number;
  houseNumber: number;
  dignity: "Exalted" | "Moolatrikona" | "Own Sign" | "Friendly" | "Neutral" | "Enemy" | "Debilitated";
  isExalted: boolean;
  isDebilitated: boolean;
  awarenessOrBlindSpotCategory: "High Conscious Awareness (Superpower)" | "Moolatrikona Core Mastery" | "Comfortable Domicile" | "Standard Functional State" | "Blind Spot / Inexperience Area";
  detailedInterpretation: string;
  actionableMindfulness: string;
}

export interface LagneshaShieldProfile {
  lagnaSign: string;
  lagnaLord: string;
  occupiedHouse: number;
  occupiedSign: string;
  dignity: string;
  isDebilitated: boolean;
  protectionShieldStatement: string;
  vitalizedHouseSignification: string;
  shastricCounsel: string;
}

export interface FatherSonInversionAxis {
  isSunInAries: boolean;
  isSaturnInAries: boolean;
  isSunInLibra: boolean;
  isSaturnInLibra: boolean;
  inversionActive: boolean;
  inversionType: "Father Exalted / Son Debilitated (Aries)" | "Son Exalted / Father Debilitated (Libra)" | "Mutual Polarity (Both Placed)" | "Inactive";
  karmicSignificance: string;
  reconciliationGuidance: string;
}

export interface TransitOppositionItem {
  axisName: string;
  planet1: string;
  planet1Sign: string;
  planet1House: number;
  planet1Dignity: string;
  planet1IsRetrograde: boolean;
  planet2: string;
  planet2Sign: string;
  planet2House: number;
  planet2Dignity: string;
  planet2IsRetrograde: boolean;
  dominantPlanet: string;
  dominanceRationale: string;
  realWorldManifestation: string;
  strategicLeadershipSolution: string;
}

export interface TransitGeometricAxisItem {
  pair: string;
  relationship: "3/11 Upachaya (Inspiration & Catalysis)" | "6/8 Shadashtaka (Friction & Tension)";
  sourcePlanet: string;
  sourceSign: string;
  targetPlanet: string;
  targetSign: string;
  houseDistance: number;
  catalyticEffect: string;
  guidance: string;
}

export interface MoonVenusTaurusEthicsProfile {
  isConjunctionInTaurus: boolean;
  isConjunctionAnywhere: boolean;
  conjunctionSign: string;
  sensoryDesireIntensity: "High (Taurus Magnification)" | "Moderate" | "Standard";
  karmicWarning: string;
  virtuousConductBlessing: string;
  practicalDirective: string;
}

export interface UchhaNeechaAwarenessMasterReport {
  natalAwareness: {
    planets: NatalDignityAwarenessItem[];
    exaltedCount: number;
    debilitatedCount: number;
    lagneshaShield: LagneshaShieldProfile;
    fatherSonInversion: FatherSonInversionAxis;
    masterAwarenessPhilosophy: string;
  };
  transitGeometricDynamics: {
    activeOppositions: TransitOppositionItem[];
    upachayaInspirations: TransitGeometricAxisItem[];
    shadashtakaFrictions: TransitGeometricAxisItem[];
    moonVenusEthics: MoonVenusTaurusEthicsProfile;
    transitPhilosophy: string;
    transitOppositions: TransitOppositionItem[];
    moonVenusTaurusConjunction: MoonVenusTaurusEthicsProfile;
    macroTransitSynthesis: string;
  };
  holisticDossierSummary: string;

  // Convenience aliases for direct consumption:
  natalDignityAwareness: NatalDignityAwarenessItem[];
  lagneshaShield: LagneshaShieldProfile;
  fatherSonInversion: FatherSonInversionAxis;
  panchangaTattvaReminder: string;
  masterDossierSummary: string;
}

// ==========================================
// 2. REFERENCE DICTIONARIES & LOGIC
// ==========================================

export const PLANETARY_DIGNITY_PSYCHOLOGY: Record<string, PlanetaryDignityPsychology> = {
  Sun: {
    planet: "Sun",
    moolatrikonaSign: "Leo",
    moolatrikonaArchetype: "The Throne, Royalty & Sovereign Independence",
    exaltationSign: "Aries",
    exaltationDegree: 10,
    exaltationEnvironment: "Dawn (First 2 hours after sunrise) — Raw vitality, decisive action, and uncompromised leadership.",
    exaltationWhyRejoices: "The Sun represents the King and the core life-spark. It rejoices in Aries because the warrior-pioneer archetype demands bold, independent command without sentimental dilution or bureaucratic compromise.",
    consciousAwarenessSuperpower: "High Conscious Awareness of Authority: Instant, acute recognition of power hierarchies, leadership imperatives, and governance dynamics. Carries past-life familiarity with executive command.",
    exaltationEgoPitfall: "Can breed authoritarian hubris, self-centered isolation, or tyranny if accompanied by shadowy or deceptive influences like Rahu.",
    debilitationSign: "Libra",
    debilitationDegree: 10,
    debilitationEnvironment: "Dusk (Sunset & fading light) — The 7th house marketplace of barter, compromise, and social diplomacy.",
    debilitationWhyConstrained: "The King feels powerless and suffocated when forced to plead, flatter, barter, or surrender sovereign authority to appease trading partners and appease crowds.",
    blindSpotInexperience: "Authority Blind Spot: Inexperienced in commanding natural authority; struggles between excessive self-abnegation and sudden reactive ego flare-ups in public dealings.",
    remedialMindfulness: "Practice humble, servant leadership. Recognize that true majesty does not require external validation, and diplomatic compromise is not weakness.",
  },
  Moon: {
    planet: "Moon",
    moolatrikonaSign: "Taurus",
    moolatrikonaArchetype: "Sensory Nourishment, Tangible Wealth & Contentment",
    exaltationSign: "Taurus",
    exaltationDegree: 3,
    exaltationEnvironment: "Abundant Garden & Prosperous Household — Wholesome food, fine apparel, material security, and loving kin.",
    exaltationWhyRejoices: "The Moon represents the emotional mind (Manas). The mind is naturally fickle and easily agitated; it settles into its highest peace when anchored by nourishing food, material security, physical comfort, and aesthetic stability.",
    consciousAwarenessSuperpower: "High Conscious Awareness of Resources & Taste: Innate past-life refinement in culinary appreciation, textile aesthetics, resource preservation, and emotional self-soothing.",
    exaltationEgoPitfall: "Risk of material hoarding, complacency, sensual over-indulgence, or becoming excessively self-absorbed in personal comfort.",
    debilitationSign: "Scorpio",
    debilitationDegree: 3,
    debilitationEnvironment: "The Dark Abyss & Transformative Cavern — The 8th house Kalapurusha realm of sudden shocks, secrets, and betrayal.",
    debilitationWhyConstrained: "The gentle, reflective mind drowns in constant turbulence, psychological paranoia, emotional volatility, and intense fear of loss.",
    blindSpotInexperience: "Emotional Trust Blind Spot: Difficulty sustaining inner psychological peace; tends to imagine betrayal, holding onto subterranean resentments and emotional turbulence.",
    remedialMindfulness: "Channel emotional intensity into research, psychology, and spiritual surrender (Maha Mrityunjaya / Shiva Sadhana). Avoid suspicion; cultivate conscious emotional forgiveness.",
  },
  Mars: {
    planet: "Mars",
    moolatrikonaSign: "Aries",
    moolatrikonaArchetype: "Raw Impulsive Courage & Martial Breakthrough",
    exaltationSign: "Capricorn",
    exaltationDegree: 28,
    exaltationEnvironment: "Strategic War Room & Structured Institutional Citadel — Heavy organization, iron discipline, and relentless perseverance.",
    exaltationWhyRejoices: "Mars is the energetic soldier. When raw martial fire is tempered by Capricorn's structured discipline, patience, and realistic constraints, erratic impulse transforms into unstoppable, focused execution.",
    consciousAwarenessSuperpower: "High Conscious Awareness of Strategy: Instinctive mastery of competitive strategy, physical endurance, crisis management, and long-term tactical planning.",
    exaltationEgoPitfall: "Can become a ruthless, hyper-pragmatic workaholic who crushes subordinates under excessive standards of mechanical performance.",
    debilitationSign: "Cancer",
    debilitationDegree: 28,
    debilitationEnvironment: "Soft Domestic Cradle & Maternal Chamber — Sentimental emotions, tears, and protective comfort.",
    debilitationWhyConstrained: "A warrior cannot fight effectively while weeping or prioritizing sentimental comfort over harsh real-world discipline. The martial blade rusts in excessive emotional water.",
    blindSpotInexperience: "Anger & Boundary Blind Spot: Lacks natural pacing for martial drive; oscillates between passive-aggressive emotional withdrawal and explosive, misdirected domestic outbursts.",
    remedialMindfulness: "Channel physical energy into structured fitness, home protection, and defending the vulnerable. Never fight battles while emotionally agitated.",
  },
  Mercury: {
    planet: "Mercury",
    moolatrikonaSign: "Virgo",
    moolatrikonaArchetype: "Analytical Auditing, Classification & Precise Logic",
    exaltationSign: "Virgo",
    exaltationDegree: 15,
    exaltationEnvironment: "The Accounting House & Research Laboratory — Systematic data, taxonomy, logic, and commercial discernment.",
    exaltationWhyRejoices: "Mercury represents analytical intellect (Buddhi). It thrives in Virgo where meticulous attention to detail, flawless bookkeeping, and critical discrimination are honored.",
    consciousAwarenessSuperpower: "High Conscious Awareness of Commerce & Data: Instant, photographic comprehension of financial equations, organizational logistics, linguistic nuances, and analytical systems.",
    exaltationEgoPitfall: "Over-analyzing to the point of mental paralysis; relentless cynicism, nitpicking, and dissecting emotional relationships under dry accounting ledgers.",
    debilitationSign: "Pisces",
    debilitationDegree: 15,
    debilitationEnvironment: "The Boundless Spiritual Ocean & Dream Realm — Intuition, poetry, cosmic surrender, and dissolvement of borders.",
    debilitationWhyConstrained: "In an ocean of infinite faith, double-entry bookkeeping, transactional debate, and mathematical calculation become utterly irrelevant and drown.",
    blindSpotInexperience: "Commercial & Contractual Blind Spot: Struggles with analytical bookkeeping, fine-print contracts, and structured scheduling; prone to calculative oversights through excessive dreaming.",
    remedialMindfulness: "Embrace intuitive synthesis, creative writing, and spiritual devotion, but implement double-check verification systems for legal, commercial, and financial papers.",
  },
  Jupiter: {
    planet: "Jupiter",
    moolatrikonaSign: "Sagittarius",
    moolatrikonaArchetype: "Righteous Dharma, Higher Philosophy & Preceptor Wisdom",
    exaltationSign: "Cancer",
    exaltationDegree: 5,
    exaltationEnvironment: "The Sacred Ashram & Caring Classroom — Loving parental mentorship, emotional receptivity, and universal nurture.",
    exaltationWhyRejoices: "Jupiter is the Guru and divine teacher. Wisdom blossoms fully not through cold pedantry, but when shared with heartfelt parental care in an environment of total emotional receptivity.",
    consciousAwarenessSuperpower: "High Conscious Awareness of Moral Guidance: Natural preceptor instincts; effortlessly understands how to nurture souls, offer life-changing counsel, and invoke celestial grace.",
    exaltationEgoPitfall: "Risk of moral self-righteousness, complacency in personal study, or assuming that theoretical goodwill alone will resolve mundane operational crises.",
    debilitationSign: "Capricorn",
    debilitationDegree: 5,
    debilitationEnvironment: "The Grinding Workplace & Muddy Construction Ground — Relentless manual drudgery, corporate bureaucracy, and harsh physical realism.",
    debilitationWhyConstrained: "The noble philosopher dislikes mundane physical grind and getting hands dirty with administrative drudgery. Abstract spiritual wisdom feels suffocated under rigid corporate quotas.",
    blindSpotInexperience: "Practical Execution Blind Spot: Inexperienced in converting lofty philosophical ideals into mundane, practical, step-by-step systems; struggles with realistic patience in corporate/material affairs.",
    remedialMindfulness: "Ground spiritual wisdom in humble daily labor. Embrace practical service (Karma Yoga); respect the sanctity of manual diligence without philosophical arrogance.",
  },
  Venus: {
    planet: "Venus",
    moolatrikonaSign: "Libra",
    moolatrikonaArchetype: "Social Harmony, Aesthetic Balance & Fair Partnership",
    exaltationSign: "Pisces",
    exaltationDegree: 27,
    exaltationEnvironment: "The Infinite Ocean of Devotion (Bhakti) — Selfless romantic surrender, universal compassion, and boundary-free love.",
    exaltationWhyRejoices: "Venus represents love and attraction. True love reaches its divine pinnacle when it transcends transactional contracts and worldly bargaining into unconditional, selfless surrender (Blind Faith) in Pisces.",
    consciousAwarenessSuperpower: "High Conscious Awareness of Relational Dynamics: Profound intuitive understanding of emotional empathy, selfless devotion, aesthetic beauty, and spiritual union.",
    exaltationEgoPitfall: "Tendency to fall in love out of naive pity, rescue complex, or ungrounded romantic martyrdom with unworthy individuals.",
    debilitationSign: "Virgo",
    debilitationDegree: 27,
    debilitationEnvironment: "The Critical Audit Room & Flaw-Finding Matrix — Constant dissection, practical fault-finding, and transactional auditing.",
    debilitationWhyConstrained: "Romance and creative intimacy wither when subjected to relentless criticism, transactional scrutiny, and score-keeping. Love cannot survive an audit.",
    blindSpotInexperience: "Relational Forgiveness Blind Spot: Tends to scrutinize partners for minute defects; evaluates emotional bonds through transactional utility, inhibiting unconditional love.",
    remedialMindfulness: "Consciously quiet the critical auditing voice in relationships. Replace fault-finding with heartfelt appreciation; practice unconditional acceptance of human imperfections.",
  },
  Saturn: {
    planet: "Saturn",
    moolatrikonaSign: "Aquarius",
    moolatrikonaArchetype: "Humanitarian Service, Mass Consciousness & Cosmic Duty",
    exaltationSign: "Libra",
    exaltationDegree: 20,
    exaltationEnvironment: "The Court of Impartial Justice (Nyayadhikari) — The balanced scales of equity, measured diplomacy, and societal fairness.",
    exaltationWhyRejoices: "Saturn is the cosmic judge and arbiter of karma. In Libra, he exercises measured, sober, and completely impartial justice, balancing the scales for the underprivileged without bias.",
    consciousAwarenessSuperpower: "High Conscious Awareness of Justice & Endurance: Innate mastery of fair labor, ethical discipline, diplomatic endurance, and long-term societal responsibility.",
    exaltationEgoPitfall: "Risk of cold, detached dogmatism, emotional austerity, or holding others to impossibly strict standards of ethical perfection.",
    debilitationSign: "Aries",
    debilitationDegree: 20,
    debilitationEnvironment: "The Explosive Battlefield & Rash Sprint — Impulsive, reckless speed, raw ego, and headstrong aggression.",
    debilitationWhyConstrained: "Saturn is cold, slow, and methodical (Manda). Forcing him to sprint, act impulsively, or rush without deliberation completely disrupts his measured equilibrium.",
    blindSpotInexperience: "Patience & Methodical Discipline Blind Spot: Tendency to rush out of anxiety or procrastinate through paralysis; struggles with steady, measured consistency when under sudden pressure.",
    remedialMindfulness: "Slow down all major life decisions. Cultivate deliberate, step-by-step perseverance; never allow rash impatience or anger to dictate career and karmic commitments.",
  },
};

// ==========================================
// 3. CORE CALCULATION FUNCTIONS
// ==========================================

/**
 * Evaluates the natal planetary dignities, awareness superpowers, debilitation blind spots,
 * Lagnesha protection shield, and the Father-Son Sun/Saturn inversion axis.
 */
export function evaluateNatalDignityAwareness(natalEphem: EphemerisResult): UchhaNeechaAwarenessMasterReport["natalAwareness"] {
  const ascDegree = natalEphem.ascendant?.siderealLongitude ?? 0;
  const ascSignIdx = Math.floor((((ascDegree % 360) + 360) % 360) / 30);
  const ascSignName = RASHI_NAMES[ascSignIdx]?.englishName ?? "Aries";
  const lagnaLord = RASHI_NAMES[ascSignIdx]?.lord ?? "Mars";

  const classicalPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const planetDignityItems: NatalDignityAwarenessItem[] = [];

  let exaltedCount = 0;
  let debilitatedCount = 0;

  for (const pName of classicalPlanets) {
    const p = natalEphem.planets[pName];
    if (!p) continue;

    const pSignIdx = Math.floor((((p.siderealLongitude % 360) + 360) % 360) / 30);
    const pSignName = RASHI_NAMES[pSignIdx]?.englishName ?? "Unknown";
    const houseNumber = ((pSignIdx - ascSignIdx + 12) % 12) + 1;
    const psychology = PLANETARY_DIGNITY_PSYCHOLOGY[pName];

    let dignity: NatalDignityAwarenessItem["dignity"] = "Neutral";
    let isExalted = false;
    let isDebilitated = false;
    let awarenessCategory: NatalDignityAwarenessItem["awarenessOrBlindSpotCategory"] = "Standard Functional State";
    let detailedInterpretation = "";
    let actionableMindfulness = "";

    if (pSignName === psychology.exaltationSign) {
      dignity = "Exalted";
      isExalted = true;
      exaltedCount++;
      awarenessCategory = "High Conscious Awareness (Superpower)";
      detailedInterpretation = `${pName} is Exalted (Uchha) in ${pSignName} in House ${houseNumber}. According to Vedic Shastra (Sessions 80 & 81), this does not automatically guarantee passive worldly wealth or easy luck; rather, it endows you with acute Conscious Awareness (Chetana / Jagruti) and past-life perceptual mastery in its domain: ${psychology.consciousAwarenessSuperpower}`;
      actionableMindfulness = `Beware of the exaltation pitfall: ${psychology.exaltationEgoPitfall}`;
    } else if (pSignName === psychology.debilitationSign) {
      dignity = "Debilitated";
      isDebilitated = true;
      debilitatedCount++;
      awarenessCategory = "Blind Spot / Inexperience Area";
      detailedInterpretation = `${pName} is Debilitated (Neecha) in ${pSignName} in House ${houseNumber}. Revolutionary Shastric Principle: A debilitated planet is NOT evil, ruined, or an inescapable curse! It simply marks a domain of inexperience where your soul lacks natural intuition: ${psychology.blindSpotInexperience}`;
      actionableMindfulness = `Prescribed Remedial Mindfulness: ${psychology.remedialMindfulness}`;
    } else if (pSignName === psychology.moolatrikonaSign) {
      dignity = "Moolatrikona";
      awarenessCategory = "Moolatrikona Core Mastery";
      detailedInterpretation = `${pName} is in its Moolatrikona sign (${pSignName}) in House ${houseNumber}. Operates with sovereign executive confidence and innate dharmic purpose: ${psychology.moolatrikonaArchetype}.`;
      actionableMindfulness = "Maintain dharmic integrity; channel this confident strength into constructive societal service.";
    } else if (pSignName === "Cancer" && pName === "Moon") {
      dignity = "Own Sign";
      awarenessCategory = "Comfortable Domicile";
      detailedInterpretation = "Moon occupies its own domicile Cancer, bestowing deep emotional contentment, maternal peace, and intuitive self-soothing.";
      actionableMindfulness = "Protect domestic serenity and avoid reactive emotional mood swings.";
    } else if (pSignName === "Aries" && pName === "Mars") {
      dignity = "Own Sign";
      awarenessCategory = "Comfortable Domicile";
      detailedInterpretation = "Mars occupies its own sign Aries, conferring energetic independence, courage, and pioneering initiative.";
      actionableMindfulness = "Channel raw drive constructively; avoid hasty or rash aggression.";
    } else if (pSignName === "Scorpio" && pName === "Mars") {
      dignity = "Own Sign";
      awarenessCategory = "Comfortable Domicile";
      detailedInterpretation = "Mars occupies its own sign Scorpio, conferring surgical depth, investigative endurance, and crisis mastery.";
      actionableMindfulness = "Cultivate emotional openness; guard against secret resentments.";
    } else if (pSignName === "Pisces" && pName === "Jupiter") {
      dignity = "Own Sign";
      awarenessCategory = "Comfortable Domicile";
      detailedInterpretation = "Jupiter occupies its own sign Pisces, bestowing boundless spiritual compassion, wisdom, and devotional faith.";
      actionableMindfulness = "Keep charitable instincts grounded in realistic discrimination.";
    } else if (pSignName === "Taurus" && pName === "Venus") {
      dignity = "Own Sign";
      awarenessCategory = "Comfortable Domicile";
      detailedInterpretation = "Venus occupies its own sign Taurus, providing sensory refinement, financial stability, and peaceful domestic aesthetics.";
      actionableMindfulness = "Maintain radical honesty in relationships to preserve family harmony.";
    } else if (pSignName === "Capricorn" && pName === "Saturn") {
      dignity = "Own Sign";
      awarenessCategory = "Comfortable Domicile";
      detailedInterpretation = "Saturn occupies its own sign Capricorn, bestowing relentless structural discipline, patience, and realistic executive endurance.";
      actionableMindfulness = "Guard against cold workaholism; respect personal and familial physical limits.";
    } else {
      dignity = "Neutral";
      awarenessCategory = "Standard Functional State";
      detailedInterpretation = `${pName} occupies ${pSignName} in House ${houseNumber}, operating through standard environmental adaptation and dispositor dynamics.`;
      actionableMindfulness = "Observe the strength and house placement of its dispositor to evaluate its real-world manifestation.";
    }

    planetDignityItems.push({
      planet: pName,
      signName: pSignName,
      signIndex: pSignIdx,
      houseNumber,
      dignity,
      isExalted,
      isDebilitated,
      awarenessOrBlindSpotCategory: awarenessCategory,
      detailedInterpretation,
      actionableMindfulness,
    });
  }

  // Lagnesha Shield Audit (Primacy of Lagna Lord)
  const lagnaLordItem = planetDignityItems.find(p => p.planet === lagnaLord);
  const occupiedH = lagnaLordItem?.houseNumber ?? 1;
  const occupiedSign = lagnaLordItem?.signName ?? ascSignName;
  const isLordDebilitated = lagnaLordItem?.isDebilitated ?? false;

  const houseSignificationsMap: Record<number, string> = {
    1: "Physical Vitality, Self-Identity & Bodily Longevity",
    2: "Family Wealth, Spoken Truth & Nutritional Sustenance",
    3: "Courage, Hands-on Enterprise, Writing & Collaborative Power",
    4: "Domestic Sanctuary, Emotional Peace, Mother & Real Estate",
    5: "Creative Genius, Intelligence, Mantras & Future Lineage",
    6: "Overcoming Enemies, Healing Disease, Workplace Service & Debt Resolution",
    7: "Partnerships, Marriage, Public Transactions & Societal Standing",
    8: "Occult Wisdom, Psychological Regeneration, Transformation & Longevity",
    9: "Higher Dharma, Auspicious Fortune, Preceptor Wisdom & Pilgrimage",
    10: "Professional Authority, Public Duty, Career Prominence & Historical Legacy",
    11: "Aspirational Inflows, Network Alliances, Elder Siblings & Great Gains",
    12: "Spiritual Surrender, Meditation, Foreign Lands & Moksha Sanctuary",
  };

  const vitalizedSignification = houseSignificationsMap[occupiedH] ?? "General Life Focus";

  const protectionShieldStatement = isLordDebilitated
    ? `SUPREME SHIELD ACTIVE: Your Lagna Lord (${lagnaLord}) is in Debilitation in House ${occupiedH} (${occupiedSign}). According to the core doctrine of Vedic Astrology (Session 80), the Lagna Lord is the ultimate, unbreakable sovereign anchor of the chart. Even in debilitation, Lagnesha NEVER harms the native! Instead, it pours protective focus, vital life-force, and persistent resilience directly into House ${occupiedH} (${vitalizedSignification}).`
    : `SOVEREIGN PROTECTION ACTIVE: Your Lagna Lord (${lagnaLord}) resides in House ${occupiedH} (${occupiedSign}) with ${lagnaLordItem?.dignity ?? "steady"} dignity. As the primary chart anchor, it continuously vitalizes ${vitalizedSignification}, ensuring physical resilience and life direction.`;

  const shastricCounsel = isLordDebilitated
    ? "Do not fall into the psychological trap of feeling 'cursed' by a debilitated Lagna Lord. Treat House " + occupiedH + " as your primary evolutionary learning arena—humble effort here unlocks profound character and resilient success."
    : "Consciously nurture the activities of House " + occupiedH + "; your soul vitality and worldly purpose flourish through this life department.";

  const lagneshaShield: LagneshaShieldProfile = {
    lagnaSign: ascSignName,
    lagnaLord,
    occupiedHouse: occupiedH,
    occupiedSign,
    dignity: lagnaLordItem?.dignity ?? "Neutral",
    isDebilitated: isLordDebilitated,
    protectionShieldStatement,
    vitalizedHouseSignification: vitalizedSignification,
    shastricCounsel,
  };

  // Father-Son Sun/Saturn Inversion Audit
  const sunSign = planetDignityItems.find(p => p.planet === "Sun")?.signName ?? "";
  const saturnSign = planetDignityItems.find(p => p.planet === "Saturn")?.signName ?? "";

  const isSunInAries = sunSign === "Aries";
  const isSaturnInAries = saturnSign === "Aries";
  const isSunInLibra = sunSign === "Libra";
  const isSaturnInLibra = saturnSign === "Libra";

  let inversionActive = false;
  let inversionType: FatherSonInversionAxis["inversionType"] = "Inactive";
  let karmicSignificance = "Standard planetary placements along the solar-saturnian continuum.";
  let reconciliationGuidance = "Maintain mutual respect between sovereign self-expression (Sun) and disciplined service to the masses (Saturn).";

  if (isSunInAries && isSaturnInAries) {
    inversionActive = true;
    inversionType = "Mutual Polarity (Both Placed)";
    karmicSignificance = "Extreme Sun-Saturn Conjunction in Aries: Father Sun is Exalted (Peak Light & Authority) while Son Saturn is Debilitated (Rash Speed Frustration). Represents acute karmic friction between executive ambition and institutional patience.";
    reconciliationGuidance = "The native must drop authoritarian pride and consciously adopt slow, deliberate patience; avoid rushing into rash conflicts with paternal or authority figures.";
  } else if (isSunInLibra && isSaturnInLibra) {
    inversionActive = true;
    inversionType = "Mutual Polarity (Both Placed)";
    karmicSignificance = "Extreme Sun-Saturn Conjunction in Libra: Son Saturn is Exalted (Supreme Justice & Impartiality) while Father Sun is Debilitated (Sunset / Loss of Sovereign Independence).";
    reconciliationGuidance = "The native achieves great heights through selfless service, law, and championing the underprivileged, while subduing personal ego and vanity.";
  } else if (isSunInAries || isSaturnInAries) {
    inversionActive = true;
    inversionType = "Father Exalted / Son Debilitated (Aries)";
    karmicSignificance = "Aries Polarization: The sign of the Dawn exalts the regal Father Sun (raw vitality, executive power) but debilitates the measured Son Saturn (rash speed ruins deliberation).";
    reconciliationGuidance = isSunInAries
      ? "Utilize your exalted solar leadership generously without becoming authoritarian or dismissive of the slower, working masses."
      : "Be patient with your career maturation; avoid rash shortcuts or fighting against established societal structures.";
  } else if (isSunInLibra || isSaturnInLibra) {
    inversionActive = true;
    inversionType = "Son Exalted / Father Debilitated (Libra)";
    karmicSignificance = "Libra Polarization: The sign of the Scales exalts the measured Son Saturn (justice, diplomacy, democratic service) but debilitates the sovereign Father Sun (uncomfortable with bartering and compromising).";
    reconciliationGuidance = isSaturnInLibra
      ? "Your strength lies in fair arbitration, legal ethics, and quiet diplomacy. Stand up for the disadvantaged."
      : "Learn the art of graceful diplomacy without feeling that cooperating with partners diminishes your personal dignity.";
  }

  const fatherSonInversion: FatherSonInversionAxis = {
    isSunInAries,
    isSaturnInAries,
    isSunInLibra,
    isSaturnInLibra,
    inversionActive,
    inversionType,
    karmicSignificance,
    reconciliationGuidance,
  };

  const masterAwarenessPhilosophy =
    "CONSCIOUS AWARENESS VS. BLIND SPOT (Sessions 80 & 81): In classical Parashari Jyotish, an exalted planet represents high conscious awareness (Chetana)—acute perception and past-life familiarity with that domain, but requires humility to prevent arrogance. Conversely, a debilitated planet is not a fatalistic dosha; it simply marks an inexperience area (blind spot) where conscious effort, patience, and learning are required. Furthermore, the Lagna Lord acts as the sovereign protector of the horoscope: even if debilitated, it never harms the native and pours vital focus into its occupied house.";

  return {
    planets: planetDignityItems,
    exaltedCount,
    debilitatedCount,
    lagneshaShield,
    fatherSonInversion,
    masterAwarenessPhilosophy,
  };
}

/**
 * Evaluates the Lagnesha Sovereign Shield (Primacy of Lagna Lord).
 */
export function evaluateLagneshaShield(natalEphem: EphemerisResult): LagneshaShieldProfile {
  return evaluateNatalDignityAwareness(natalEphem).lagneshaShield;
}

/**
 * Evaluates the Father-Son Sun/Saturn Inversion Axis.
 */
export function evaluateFatherSonInversionAxis(natalEphem: EphemerisResult): FatherSonInversionAxis {
  return evaluateNatalDignityAwareness(natalEphem).fatherSonInversion;
}

/**
 * Evaluates real-time transit geometric dynamics: 180° Direct Oppositions (dominance audit),
 * 3/11 Upachaya inspirations, 6/8 Shadashtaka friction axes, and Moon-Venus in Taurus relational ethics.
 */
export function evaluateTransitGeometricDynamics(
  arg1: EphemerisResult,
  arg2?: EphemerisResult
): UchhaNeechaAwarenessMasterReport["transitGeometricDynamics"] {
  const natalEphem = arg2 ? arg1 : arg1;
  const transitEphem = arg2 ? arg2 : arg1;
  const ascDegree = natalEphem.ascendant?.siderealLongitude ?? 0;
  const ascSignIdx = Math.floor((((ascDegree % 360) + 360) % 360) / 30);

  const majorTransitPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const transitPositions: Record<string, { signIdx: number; signName: string; house: number; isRetrograde: boolean }> = {};

  for (const pName of majorTransitPlanets) {
    const p = transitEphem.planets[pName];
    if (!p) continue;
    const sIdx = Math.floor((((p.siderealLongitude % 360) + 360) % 360) / 30);
    const sName = RASHI_NAMES[sIdx]?.englishName ?? "Unknown";
    const house = ((sIdx - ascSignIdx + 12) % 12) + 1;
    transitPositions[pName] = {
      signIdx: sIdx,
      signName: sName,
      house,
      isRetrograde: Boolean(p.isRetrograde),
    };
  }

  // 1. 180° Direct Oppositions
  const activeOppositions: TransitOppositionItem[] = [];
  const checkedPairs = new Set<string>();

  for (let i = 0; i < majorTransitPlanets.length; i++) {
    for (let j = i + 1; j < majorTransitPlanets.length; j++) {
      const p1Name = majorTransitPlanets[i];
      const p2Name = majorTransitPlanets[j];
      const pos1 = transitPositions[p1Name];
      const pos2 = transitPositions[p2Name];
      if (!pos1 || !pos2) continue;

      const signDiff = (pos2.signIdx - pos1.signIdx + 12) % 12;
      if (signDiff === 6) {
        // Direct 180° opposition across signs
        const pairKey = [p1Name, p2Name].sort().join("-");
        if (checkedPairs.has(pairKey)) continue;
        checkedPairs.add(pairKey);

        // Special Benchmark Case: Sun in Cancer opposing Saturn in Capricorn (Session 81)
        if (
          (p1Name === "Sun" && pos1.signName === "Cancer" && p2Name === "Saturn" && pos2.signName === "Capricorn") ||
          (p2Name === "Sun" && pos2.signName === "Cancer" && p1Name === "Saturn" && pos1.signName === "Capricorn")
        ) {
          const saturnPos = p1Name === "Saturn" ? pos1 : pos2;
          const sunPos = p1Name === "Sun" ? pos1 : pos2;

          activeOppositions.push({
            axisName: "Cancer - Capricorn Direct 180° Opposition (Sovereign vs. Working Masses)",
            planet1: "Sun",
            planet1Sign: "Cancer",
            planet1House: sunPos.house,
            planet1Dignity: "Enemy / Uncomfortable Emotional Waters",
            planet1IsRetrograde: sunPos.isRetrograde,
            planet2: "Saturn",
            planet2Sign: "Capricorn",
            planet2House: saturnPos.house,
            planet2Dignity: "Own Sign (Swarashi) & High Chesta Bala",
            planet2IsRetrograde: saturnPos.isRetrograde,
            dominantPlanet: "Saturn in Capricorn",
            dominanceRationale: "Saturn occupies his own cold, pragmatic domicile (Capricorn) and gains peak motional strength (Chesta Bala) through retrogression, while the Sun is weakened in emotional, nocturnal Cancer. The working masses, public opinion, and institutional reality will overpower executive command.",
            realWorldManifestation: "Leaders, CEOs, and heads of households face severe resistance and challenges from subordinates, employees, and public sentiment.",
            strategicLeadershipSolution: "Leaders must drop rigid arrogance, adopt genuine emotional compassion (Cancer), and actively serve public welfare; only then will Saturn's grinding opposition be softened.",
          });
        } else {
          // General 180° opposition scoring
          const getDignityWeight = (planet: string, sign: string) => {
            const psych = PLANETARY_DIGNITY_PSYCHOLOGY[planet];
            if (!psych) return 2;
            if (sign === psych.exaltationSign) return 5;
            if (sign === psych.moolatrikonaSign) return 4;
            if (sign === "Cancer" && planet === "Moon") return 4;
            if (sign === "Aries" && planet === "Mars") return 4;
            if (sign === "Scorpio" && planet === "Mars") return 4;
            if (sign === "Pisces" && planet === "Jupiter") return 4;
            if (sign === "Taurus" && planet === "Venus") return 4;
            if (sign === "Capricorn" && planet === "Saturn") return 4;
            if (sign === psych.debilitationSign) return 0;
            return 2;
          };

          const p1Weight = getDignityWeight(p1Name, pos1.signName) + (pos1.isRetrograde ? 2 : 0);
          const p2Weight = getDignityWeight(p2Name, pos2.signName) + (pos2.isRetrograde ? 2 : 0);

          const dominant = p1Weight >= p2Weight ? p1Name : p2Name;
          const domSign = p1Weight >= p2Weight ? pos1.signName : pos2.signName;

          activeOppositions.push({
            axisName: `${pos1.signName} - ${pos2.signName} Direct 180° Axis`,
            planet1: p1Name,
            planet1Sign: pos1.signName,
            planet1House: pos1.house,
            planet1Dignity: getDignityWeight(p1Name, pos1.signName) >= 4 ? "Strong" : "Standard",
            planet1IsRetrograde: pos1.isRetrograde,
            planet2: p2Name,
            planet2Sign: pos2.signName,
            planet2House: pos2.house,
            planet2Dignity: getDignityWeight(p2Name, pos2.signName) >= 4 ? "Strong" : "Standard",
            planet2IsRetrograde: pos2.isRetrograde,
            dominantPlanet: `${dominant} in ${domSign}`,
            dominanceRationale: `Evaluated through relative dignity and retrograde Chesta Bala weights (${p1Name}: ${p1Weight} pts vs. ${p2Name}: ${p2Weight} pts).`,
            realWorldManifestation: `Energetic polarization between House ${pos1.house} (${pos1.signName}) and House ${pos2.house} (${pos2.signName}).`,
            strategicLeadershipSolution: `Consciously integrate the qualities of both signs; avoid one-sided dogmatism to prevent relational and professional gridlock.`,
          });
        }
      }
    }
  }

  // 2. 3/11 Upachaya Inspirations & 6/8 Shadashtaka Frictions
  const upachayaInspirations: TransitGeometricAxisItem[] = [];
  const shadashtakaFrictions: TransitGeometricAxisItem[] = [];

  const keyTransitPairs = [
    { p1: "Venus", p2: "Sun" },
    { p1: "Jupiter", p2: "Sun" },
    { p1: "Mars", p2: "Saturn" },
    { p1: "Mercury", p2: "Jupiter" },
  ];

  for (const pair of keyTransitPairs) {
    const pos1 = transitPositions[pair.p1];
    const pos2 = transitPositions[pair.p2];
    if (!pos1 || !pos2) continue;

    const diff1To2 = ((pos2.signIdx - pos1.signIdx + 12) % 12) + 1;
    const diff2To1 = ((pos1.signIdx - pos2.signIdx + 12) % 12) + 1;

    // Check 3/11 relationship (either 3rd from 1st and 11th from 2nd, or vice versa)
    if ((diff1To2 === 3 && diff2To1 === 11) || (diff1To2 === 11 && diff2To1 === 3)) {
      const isVenusSunTaurusCancer =
        (pair.p1 === "Venus" && pos1.signName === "Taurus" && pair.p2 === "Sun" && pos2.signName === "Cancer") ||
        (pair.p2 === "Venus" && pos2.signName === "Taurus" && pair.p1 === "Sun" && pos1.signName === "Cancer");

      const catalyticEffect = isVenusSunTaurusCancer
        ? "Venus in Taurus (representing liquid wealth, family nourishment, and banking) sits 11th from Sun in Cancer, while Sun sits 3rd from Venus. This 3/11 dynamic acts as an Upachaya Catalyst: domestic resource needs and family financial realities motivate and inspire leadership to take proactive protective actions."
        : `Transiting ${pair.p1} (${pos1.signName}) and ${pair.p2} (${pos2.signName}) form an auspicious 3/11 Upachaya axis, generating mutually motivating catalysts between their life spheres.`;

      upachayaInspirations.push({
        pair: `${pair.p1} - ${pair.p2}`,
        relationship: "3/11 Upachaya (Inspiration & Catalysis)",
        sourcePlanet: pair.p1,
        sourceSign: pos1.signName,
        targetPlanet: pair.p2,
        targetSign: pos2.signName,
        houseDistance: diff1To2 === 3 ? 3 : 11,
        catalyticEffect,
        guidance: "Capitalize on this harmonic 3/11 current to initiate ambitious projects and mobilize collaborative resources.",
      });
    }

    // Check 6/8 Shadashtaka relationship
    if ((diff1To2 === 6 && diff2To1 === 8) || (diff1To2 === 8 && diff2To1 === 6)) {
      const isJupiterSunSagittariusCancer =
        (pair.p1 === "Jupiter" && pos1.signName === "Sagittarius" && pair.p2 === "Sun" && pos2.signName === "Cancer") ||
        (pair.p2 === "Jupiter" && pos2.signName === "Sagittarius" && pair.p1 === "Sun" && pos1.signName === "Cancer");

      const frictionDesc = isJupiterSunSagittariusCancer
        ? "Jupiter in Sagittarius falls 6th from the Sun in Cancer. This 6/8 Shadashtaka placement creates moral friction: traditional philosophical values, preceptors, and ethical standards push back against state policies and unilateral executive mandates."
        : `Transiting ${pair.p1} (${pos1.signName}) and ${pair.p2} (${pos2.signName}) form a 6/8 Shadashtaka angle, creating friction, ideological opposition, and procedural hurdles between their respective domains.`;

      shadashtakaFrictions.push({
        pair: `${pair.p1} - ${pair.p2}`,
        relationship: "6/8 Shadashtaka (Friction & Tension)",
        sourcePlanet: pair.p1,
        sourceSign: pos1.signName,
        targetPlanet: pair.p2,
        targetSign: pos2.signName,
        houseDistance: diff1To2 === 6 ? 6 : 8,
        catalyticEffect: frictionDesc,
        guidance: "Exercise patience and moral compromise; avoid forcing unilateral decisions when planets engage in 6/8 tension.",
      });
    }
  }

  // 3. Moon-Venus Conjunction in Taurus Audit (Session 81)
  const moonPos = transitPositions["Moon"];
  const venusPos = transitPositions["Venus"];
  const isConjunctionInTaurus = Boolean(moonPos && venusPos && moonPos.signName === "Taurus" && venusPos.signName === "Taurus");
  const isConjunctionAnywhere = Boolean(moonPos && venusPos && moonPos.signName === venusPos.signName);
  const conjunctionSign = isConjunctionInTaurus ? "Taurus" : (isConjunctionAnywhere && moonPos ? moonPos.signName : "None");

  const sensoryDesireIntensity: MoonVenusTaurusEthicsProfile["sensoryDesireIntensity"] = isConjunctionInTaurus
    ? "High (Taurus Magnification)"
    : isConjunctionAnywhere
    ? "Moderate"
    : "Standard";

  const karmicWarning = isConjunctionInTaurus
    ? "SHARPLY ACTIVE TAURUS TRANSIT WARNING (Session 81): When Moon and Venus unite in Taurus, sensual attraction, aesthetic cravings, and material desires are intensely magnified. Shastric Law: If individuals practice deception, infidelity, or transactional manipulation in love during this transit, severe loss of wealth, emotional ruin, and public disgrace follow."
    : "General Relational Ethic: Deception or hidden agendas in romance inevitably boomerang as financial loss and emotional trauma.";

  const virtuousConductBlessing = isConjunctionInTaurus
    ? "THE DEVOTIONAL REWARD: Conversely, approaching partnerships with genuine transparency, shared generosity, and selfless love aligns with the exalted virtue of Venus, unlocking lasting financial prosperity and profound emotional bliss."
    : "Honesty, clear communication, and mutual generosity attract enduring peace and material stability.";

  const practicalDirective = isConjunctionInTaurus
    ? "Commit to 100% transparency with romantic partners and financial stakeholders. Avoid speculative infatuations."
    : "Cultivate authentic emotional expression and honor relational commitments.";

  const moonVenusEthics: MoonVenusTaurusEthicsProfile = {
    isConjunctionInTaurus,
    isConjunctionAnywhere,
    conjunctionSign,
    sensoryDesireIntensity,
    karmicWarning,
    virtuousConductBlessing,
    practicalDirective,
  };

  const transitPhilosophy =
    "TRANSIT GEOMETRIC DYNAMICS (Session 81): Celestial bodies do not operate in isolated vacuums; their relative angular relationships dictate collective and personal events. 180° Direct Oppositions test power balance (with retrograde and domicile grahas dominating); 3/11 Upachaya relationships serve to inspire and motivate constructive resource mobilization; 6/8 Shadashtaka alignments generate ideological and procedural pushback; and Moon-Venus unions in material signs test the purity of personal character.";

  return {
    activeOppositions,
    upachayaInspirations,
    shadashtakaFrictions,
    moonVenusEthics,
    transitPhilosophy,
    // Convenience aliases:
    transitOppositions: activeOppositions,
    moonVenusTaurusConjunction: moonVenusEthics,
    macroTransitSynthesis: transitPhilosophy,
  };
}

/**
 * Master Report Generator for Planetary Dignity Psychology, Awareness Superpowers,
 * Blind Spot Remediation, Lagnesha Shield, and Real-Time Transit Geometric Dynamics.
 */
export function generateUchhaNeechaAwarenessMasterReport(
  natalEphem: EphemerisResult,
  transitEphem?: EphemerisResult
): UchhaNeechaAwarenessMasterReport {
  const activeTransitEphem = transitEphem ?? natalEphem;

  const natalAwareness = evaluateNatalDignityAwareness(natalEphem);
  const transitGeometricDynamics = evaluateTransitGeometricDynamics(natalEphem, activeTransitEphem);

  const exaltedPlanetsStr = natalAwareness.planets.filter(p => p.isExalted).map(p => `${p.planet} in ${p.signName} (H${p.houseNumber})`).join(", ") || "None";
  const debilitatedPlanetsStr = natalAwareness.planets.filter(p => p.isDebilitated).map(p => `${p.planet} in ${p.signName} (H${p.houseNumber})`).join(", ") || "None";

  const inversionSentence = natalAwareness.fatherSonInversion.inversionActive
    ? ` Under the Father-Son Sun/Saturn Inversion Axis, ${natalAwareness.fatherSonInversion.inversionType} is activated: ${natalAwareness.fatherSonInversion.karmicSignificance}`
    : ` Under the Father-Son Sun/Saturn Inversion Axis, solar executive vitality and Saturnian labor discipline maintain an equilibrium balance.`;

  const holisticDossierSummary = `PLANETARY DIGNITIES & AWARENESS DOSSIER (Sessions 80 & 81): Your chart displays ${natalAwareness.exaltedCount} Exalted Graha(s) [${exaltedPlanetsStr}] and ${natalAwareness.debilitatedCount} Debilitated Graha(s) [${debilitatedPlanetsStr}]. Under classical Parashari principles, Exaltation indicates High Conscious Awareness (Chetana) and past-life mastery in that domain, while Debilitation marks an inexperience area (Blind Spot) requiring humble, conscious learning rather than fatalistic fear. Furthermore, your Lagnesha (${natalAwareness.lagneshaShield.lagnaLord}) resides in House ${natalAwareness.lagneshaShield.occupiedHouse}, creating an unbreakable Lagnesha Sovereign Shield that vitalizes ${natalAwareness.lagneshaShield.vitalizedHouseSignification}.${inversionSentence} In Transit Geometric Dynamics, your chart currently experiences ${transitGeometricDynamics.activeOppositions.length} active 180° opposition(s), ${transitGeometricDynamics.upachayaInspirations.length} 3/11 Upachaya inspiration vector(s), and ${transitGeometricDynamics.shadashtakaFrictions.length} 6/8 friction axis(es), guiding how executive leadership, public accountability, and relational ethics harmonize in daily life.`;

  const panchangaTattvaReminder =
    "Lord Shiva's Science & Panchanga Tattva: Vara (Desires / Fire), Tithi (Emotional Mind & Past Karma / Water), Karan (Physical Execution / Earth), Yoga (Divine Grace / Space), Nakshatra (Relationships / Air).";

  return {
    natalAwareness,
    transitGeometricDynamics,
    holisticDossierSummary,
    // Convenience aliases:
    natalDignityAwareness: natalAwareness.planets,
    lagneshaShield: natalAwareness.lagneshaShield,
    fatherSonInversion: natalAwareness.fatherSonInversion,
    panchangaTattvaReminder,
    masterDossierSummary: holisticDossierSummary,
  };
}
