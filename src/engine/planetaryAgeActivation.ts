/**
 * Parashara Natural Planetary Maturation Ages & Retrograde Dynamics Engine
 * References:
 * - Brihat Parashara Hora Shastra (BPHS Ch. 45 Naisargika Dasha / Natural Ages)
 * - Phaladeepika (Ch. 20 - Planetary Maturity Ages)
 * - Deepanshu Giri (Lunar Astro: Planetary Ages, Retrograde Inversion at Age 36)
 */

import { EphemerisResult } from "./types";

export interface PlanetaryAgeMilestone {
  planet: string;
  startAge: number;
  endAge: number;
  peakAge: number;
  isActiveNow: boolean;
  isUpcoming: boolean;
  isPast: boolean;
  isRetrograde: boolean;
  classicalSignification: string;
  standardManifestation: string;
  retrogradeInversionManifestation: string;
  shastricRemedy: string;
}

export interface NativePlanetaryAgeReport {
  currentAge: number;
  activeMilestone: PlanetaryAgeMilestone;
  upcomingMilestone: PlanetaryAgeMilestone;
  isSaturnAge36Active: boolean;
  isRetrogradeSaturnActive: boolean;
  retrogradeAgeAlertDossier?: string;
  allMilestones: PlanetaryAgeMilestone[];
  vakSiddhiIntuitionSummary: string;
}

interface BasePlanetaryAgeRule {
  planet: string;
  startAge: number;
  endAge: number;
  peakAge: number;
  classicalSignification: string;
  standardManifestation: string;
  retrogradeInversionManifestation: string;
  shastricRemedy: string;
}

const PARASHARI_MATURATION_RULES: BasePlanetaryAgeRule[] = [
  {
    planet: "Jupiter",
    startAge: 16,
    endAge: 20,
    peakAge: 16,
    classicalSignification: "Dharma, Medha Shakti, Higher Learning & Spiritual Pivot (BPHS Ch. 45)",
    standardManifestation:
      "Awakening of ethical conscience, educational breakthrough, recognition from mentors, and initiation into life purpose.",
    retrogradeInversionManifestation:
      "Questioning of dogmatic orthodoxies, disputes with traditional teachers, self-taught mastery, and non-linear academic pursuits.",
    shastricRemedy:
      "Planting and personally watering a sacred Banana Tree (Kadali Vriksha) on Thursdays; Brihaspati Stotra recitation.",
  },
  {
    planet: "Sun",
    startAge: 21,
    endAge: 22,
    peakAge: 22,
    classicalSignification: "Atma Bala, Sovereign Individuation & Vocational Emergence",
    standardManifestation:
      "Clear crystallization of personal identity, separation from paternal dependency, vocational launch, and enhanced self-confidence.",
    retrogradeInversionManifestation:
      "Identity crisis, intense friction with father or authority figures, sudden pivots in life direction to establish autonomous pride.",
    shastricRemedy:
      "Daily Surya Arghya in copper vessel with red sandalwood; Gayatri Mantra recitation at Brahma Muhurta (4:30 AM).",
  },
  {
    planet: "Moon",
    startAge: 23,
    endAge: 24,
    peakAge: 24,
    classicalSignification: "Manas, Emotional Maturity & Relational Empathy",
    standardManifestation:
      "Deepening emotional intelligence, public popularity, domestic expansion, and strong bonding with maternal figures.",
    retrogradeInversionManifestation:
      "Intense emotional restlessness, hypersensitivity, changing homes, and re-evaluating subconscious attachment patterns.",
    shastricRemedy:
      "Serving cold milk/water to weary travelers; Shiva Abhishek on Mondays; honoring maternal figures.",
  },
  {
    planet: "Venus",
    startAge: 25,
    endAge: 27,
    peakAge: 25,
    classicalSignification: "Kama, Shukra Vivaha, Aesthetic Refinement & Financial Comfort",
    standardManifestation:
      "Entry into significant partnership/marriage, flourishing creative pursuits, acquisition of luxury assets, and diplomatic ease.",
    retrogradeInversionManifestation:
      "Unconventional relationship choices, re-emergence of past-life romantic connections, sudden disillusionment with superficial vanity.",
    shastricRemedy:
      "Worship of Goddess Mahalakshmi; Friday fasting; donating white silk garments, camphor, or curd.",
  },
  {
    planet: "Mars",
    startAge: 28,
    endAge: 31,
    peakAge: 28,
    classicalSignification: "Parakrama, Real Estate, Physical Stamina & Decisive Conquest",
    standardManifestation:
      "Major property acquisition, executive courage, triumph over competitors, athletic peak, and fearlessness in enterprise.",
    retrogradeInversionManifestation:
      "Internalized frustration, conflict with siblings/associates, surgical interventions, or high-risk career leaps defying authority.",
    shastricRemedy:
      "Chanting Hanuman Chalisa 7 times daily; voluntary blood donation; donating red lentils to manual laborers.",
  },
  {
    planet: "Mercury",
    startAge: 32,
    endAge: 35,
    peakAge: 32,
    classicalSignification: "Buddhi, Commercial Acumen & Intellectual Synthesis",
    standardManifestation:
      "Peak commercial expansion, lucrative business contracts, mastery of communication/media, and astute financial diversification.",
    retrogradeInversionManifestation:
      "Mental restlessness, unexpected contractual renegotiations, breaking established business partnerships, algorithmic redesign.",
    shastricRemedy:
      "Watering sacred Tulsi; feeding green grass to cows on Wednesdays; practicing mindful periods of silence (Mouna).",
  },
  {
    planet: "Saturn",
    startAge: 36,
    endAge: 42,
    peakAge: 36,
    classicalSignification: "Sthira Karma, Karmic Reckoning & Structural Reorganization",
    standardManifestation:
      "Gradual stabilization, elevation to institutional authority, reward for 35 years of perseverance, enduring structural consolidation.",
    retrogradeInversionManifestation:
      "DEEPANSHU GIRI RETROGRADE INVERSION: Sudden life upheaval, unexpected career overhauls, bold refusal to compromise with institutional tyranny, sudden relocations, and confrontation with past-life karmic debts that completely reset the native's destiny.",
    shastricRemedy:
      "Mahamrityunjaya Mantra; Saturday evening mustard oil deepam near Peepal tree; selfless charity and service to disabled/elderly.",
  },
  {
    planet: "Rahu",
    startAge: 42,
    endAge: 47,
    peakAge: 42,
    classicalSignification: "Maya Matrix, Foreign Expansion & Unconventional Breakthrough",
    standardManifestation:
      "Daring foreign ventures, cross-cultural influence, sudden elevation in social status, high technology adoption, and public fame.",
    retrogradeInversionManifestation:
      "Acute disillusionment with material mirages, sudden exposure of concealed vulnerabilities, radical spiritual awakening.",
    shastricRemedy:
      "Feeding stray dogs; donating black sesame or blankets; worshipping Lord Bhairava or Goddess Durga.",
  },
  {
    planet: "Ketu",
    startAge: 48,
    endAge: 54,
    peakAge: 48,
    classicalSignification: "Moksha, Inward Detachment & Spiritual Renunciation",
    standardManifestation:
      "Spiritual illumination, detachment from worldly competition, deep interest in occult/metaphysics, and mentoring the next generation.",
    retrogradeInversionManifestation:
      "Sudden severing of old ties, physical isolation, rapid clearing of ancestral debts, heightened intuitive downloads.",
    shastricRemedy:
      "Ganesha Atharvashirsha recitation; feeding seven grains (Satnaja) to birds; pilgrimage to sacred monastic shrines.",
  },
];

/**
 * Calculates the complete Parashari Natural Planetary Maturation Timeline
 */
export function calculatePlanetaryMaturationTimeline(
  ephemeris: EphemerisResult,
  birthDate: Date,
  targetDate: Date = new Date()
): NativePlanetaryAgeReport {
  // Exact age calculation
  const diffTime = targetDate.getTime() - birthDate.getTime();
  const currentAge = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.2425)));

  const milestones: PlanetaryAgeMilestone[] = PARASHARI_MATURATION_RULES.map((rule) => {
    const planetObj = ephemeris.planets[rule.planet];
    const isRetrograde = planetObj?.isRetrograde || false;
    const isActiveNow = currentAge >= rule.startAge && currentAge <= rule.endAge;
    const isUpcoming = currentAge < rule.startAge;
    const isPast = currentAge > rule.endAge;

    return {
      planet: rule.planet,
      startAge: rule.startAge,
      endAge: rule.endAge,
      peakAge: rule.peakAge,
      isActiveNow,
      isUpcoming,
      isPast,
      isRetrograde,
      classicalSignification: rule.classicalSignification,
      standardManifestation: rule.standardManifestation,
      retrogradeInversionManifestation: rule.retrogradeInversionManifestation,
      shastricRemedy: rule.shastricRemedy,
    };
  });

  // Find currently active milestone or fallback
  const activeMilestone =
    milestones.find((m) => m.isActiveNow) ||
    milestones[milestones.length - 1];

  // Find upcoming milestone
  const upcomingMilestone =
    milestones.find((m) => m.isUpcoming) ||
    activeMilestone;

  // Age 36 Saturn Retrograde Check
  const saturnMilestone = milestones.find((m) => m.planet === "Saturn");
  const isSaturnAge36Active = currentAge >= 36 && currentAge <= 42;
  const isRetrogradeSaturnActive = isSaturnAge36Active && (saturnMilestone?.isRetrograde || false);

  let retrogradeAgeAlertDossier: string | undefined = undefined;

  if (isRetrogradeSaturnActive) {
    retrogradeAgeAlertDossier =
      "🚨 CRITICAL LUNAR ASTRO MILESTONE ACTIVE: You are in the Saturn Maturation Window (Age 36–42) with RETROGRADE SATURN (वक्र शनि). Per Deepanshu Giri, retrograde Saturn at age 36 triggers the 'Great Karmic Inversion'—sudden disruption of rigid career paths, dismantling of false security, unconventional life decisions, and an unavoidable settlement of unfulfilled past-life obligations. Do not view unexpected pivots as failures; they are karmic course corrections freeing you from stale obligations.";
  } else if (isSaturnAge36Active) {
    retrogradeAgeAlertDossier =
      "⚖️ SATURN MATURATION MILESTONE (Age 36–42): Direct Saturn is now crystallizing your enduring life foundation. Hard work, discipline, and endurance invested over the past 35 years are coming to structural fruition.";
  }

  const vakSiddhiIntuitionSummary =
    "Deepanshu Giri emphasizes that astrological insight requires Vak Siddhi (speech intuition) awakened by the Gayatri Mantra. Practicing Gayatri Japa at Brahma Muhurta (4:30 AM) activates the solar Pingala Nadi and grants intuitive clarity.";

  return {
    currentAge,
    activeMilestone,
    upcomingMilestone,
    isSaturnAge36Active,
    isRetrogradeSaturnActive,
    retrogradeAgeAlertDossier,
    allMilestones: milestones,
    vakSiddhiIntuitionSummary,
  };
}
