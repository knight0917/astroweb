/**
 * Medhaj Astro Marana Karaka Sthana (MKS), Rahu-Ketu Past Life Roots & Saturn Cosmic Law Engine
 * 
 * References:
 * - Session 71: House Karakas and Marana Karaka Sthana (MKS)
 *   - Primary Natural Significators (Karaka Sthana):
 *     * 1st: Sun (Surya)
 *     * 2nd: Jupiter (Guru)
 *     * 3rd: Mars (Mangal)
 *     * 4th: Moon (Chandra) & Venus (Shukra)
 *     * 5th: Jupiter (Guru)
 *     * 6th: Saturn (Shani)
 *     * 7th: Venus (Shukra) & Moon (Chandra)
 *     * 8th: Saturn (Shani)
 *     * 9th: Jupiter (Guru)
 *     * 10th: Sun (Surya)
 *     * 11th: Jupiter (Guru) / Mars (Mangal)
 *     * 12th: Saturn (Shani)
 *   - Concept of MKS (मरण कारक स्थान): "Death-like" suffocation of the planet's portfolio due to
 *     past-life karmic mistakes (Purva Janma Dosha). The native must work twice as hard to sustain matters.
 *   - Specific MKS Placements:
 *     * Saturn in 1st: Burdened, cold, isolated, misunderstood.
 *     * Jupiter in 3rd: Petty courage, squabbling, dislikes restless changes.
 *     * Mercury in 4th: Domestic mental/nervous tension, misunderstandings.
 *     * Mercury in 7th: Childlike banter ruins serious marital/business contracts.
 *     * Venus in 6th: Conflict, criticism, disease kills unconditional love.
 *     * Mars in 7th: Warfare/dominance in place of compromise.
 *     * Moon in 8th: Darkness, sudden fear, drowning mind (Scorpio archetype).
 *     * Rahu in 9th: Rebellion against lineage, alien philosophy, defying father.
 *     * Sun in 12th: Daylight in darkness, nocturnal work, father separation/lack of recognition.
 *   - MKS Targeted Remedies (Pariharas): Specific behavioral and selfless sadhanas.
 * 
 * - Session 72: Rahu-Ketu and Past Life (Part 1)
 *   - Foundational Pillars: Lagna (Identity), Lagnesha (Daily Operation), Jupiter (Grace),
 *     Moon (Mind), Sun (Soul), Venus (Relationships).
 *   - The Automobile Metaphor:
 *     * Rahu = The Destination / Google Maps / Desires / Attention.
 *     * Saturn = The Law / Road Rules / Discipline / Concentration.
 *     * Ketu = The Past Life Root / Intention (Sankalpa).
 *     * Dispositors = The Steering Wheel (how to steer the karmic polarity).
 *   - Ketu Signs: Aries (Warrior), Taurus (Material Accumulator), Gemini (Chatterbox/Trader), Cancer (Domestic Power).
 * 
 * - Session 74: Rahu-Ketu and Past Life (Part 2)
 *   - Ketu Signs: Leo (Monarchical Pride), Virgo (Service/Medical), Libra (Diplomacy/Pleasing),
 *     Scorpio (Occult/Pitru Dosha), Sagittarius (Temple Ritualist), Capricorn (Status Climber),
 *     Aquarius (Mass Collective/Rebel), Pisces (Monastic State + Matsya Childhood Water Warning).
 *   - The Supreme Cosmic Role of Saturn (The Ultimate Law across 12 signs).
 */

import { EphemerisResult, CelestialBodyPosition, SpecialPoint } from "./types";
import { ZODIAC_SIGNS, RASHI_SANSKRIT, SIGN_LORDS, getBodySignIndex } from "./medhajInduLagna";

// =========================================================================
// 1. HOUSE NATURAL KARAKAS & MKS DEFINITIONS (SESSION 71)
// =========================================================================

export interface HouseKarakaDefinition {
  houseNumber: number;
  primaryKarakas: string[];
  significations: string;
}

export const HOUSE_NATURAL_KARAKAS: Record<number, HouseKarakaDefinition> = {
  1: { houseNumber: 1, primaryKarakas: ["Sun"], significations: "Self-emergence, physical vitality, soul dignity, and personal authority." },
  2: { houseNumber: 2, primaryKarakas: ["Jupiter"], significations: "Accumulated wealth, speech, lineage values, food, and family treasury." },
  3: { houseNumber: 3, primaryKarakas: ["Mars"], significations: "Courage, physical valor, hands-on enterprise, younger siblings, and short journeys." },
  4: { houseNumber: 4, primaryKarakas: ["Moon", "Venus"], significations: "Emotional sanctuary, domestic peace, maternal bonding, landed real estate, and conveyances." },
  5: { houseNumber: 5, primaryKarakas: ["Jupiter"], significations: "Purva Punya, creative intellect, children, mantra siddhi, and higher discernment." },
  6: { houseNumber: 6, primaryKarakas: ["Saturn"], significations: "Overcoming adversaries, debt management, daily service labor, and acute disease resilience." },
  7: { houseNumber: 7, primaryKarakas: ["Venus", "Moon"], significations: "Sacred marital companionship, contractual partnerships, public trade, and harmony." },
  8: { houseNumber: 8, primaryKarakas: ["Saturn"], significations: "Longevity, sudden upheavals, subterranean transformations, chronic karmas, and emergency liquidity." },
  9: { houseNumber: 9, primaryKarakas: ["Jupiter"], significations: "Dharma, Guru guidance, fatherly grace, higher philosophy, and cosmic fortune." },
  10: { houseNumber: 10, primaryKarakas: ["Sun"], significations: "Executive authority, career peak, societal status, leadership, and public karma." },
  11: { houseNumber: 11, primaryKarakas: ["Jupiter", "Mars"], significations: "Large-scale financial gains, elder siblings, network communities, and fulfilled ambitions." },
  12: { houseNumber: 12, primaryKarakas: ["Saturn"], significations: "Spiritual liberation (Moksha), sleep, foreign residence, confinement, and selfless expenditure." }
};

export interface MksDefinition {
  planet: string;
  mksHouse: number;
  suffocationMechanism: string;
  karmicRootCause: string;
  effortMultiplier: string;
  prescribedParihara: string;
}

export const MKS_DEFINITIONS: Record<string, MksDefinition[]> = {
  Saturn: [
    {
      planet: "Saturn",
      mksHouse: 1,
      suffocationMechanism: "1st house represents radiant self-expression, physical birth, and bodily emergence. Saturn's cold, heavy, restrictive energy feels suffocated in the house of self, burdening the native with chronic isolation, excessive premature responsibility, and feeling misunderstood.",
      karmicRootCause: "Past-life misuse of personal vitality, evasion of humble duty, or imposing rigid coldness onto others.",
      effortMultiplier: "Native must expend double effort to build personal self-worth, physical stamina, and public recognition.",
      prescribedParihara: "Maintain strict personal modesty, practice uncomplaining discipline, and perform selfless seva for manual laborers and underprivileged communities."
    }
  ],
  Jupiter: [
    {
      planet: "Jupiter",
      mksHouse: 3,
      suffocationMechanism: "3rd house is the domain of restless small courage, routine transactional changes, and petty squabbles. Jupiter is Brihaspati—the vast, steady Guru of cosmic wisdom and grand morality. Constant petty bickering and restless changes suffocate Jupiter's philosophical dignity.",
      karmicRootCause: "Past-life squandering of sacred wisdom on trivial gossip, petty arguments, or intellectual arrogance.",
      effortMultiplier: "Native must expend double effort to establish respected counsel, sibling harmony, and ethical consistency.",
      prescribedParihara: "Respect learned mentors, spiritual elders, and gurus; preserve ethical moral codes; avoid participating in petty neighborhood or sibling squabbles."
    }
  ],
  Mercury: [
    {
      planet: "Mercury",
      mksHouse: 4,
      suffocationMechanism: "4th house is the emotional sanctuary of maternal warmth and inner heart peace. Mercury's restless analytical intellect, calculation, and conversational chatter disrupt tranquility, causing mental and nervous tension and domestic misunderstandings.",
      karmicRootCause: "Past-life emotional calculation, intellectual manipulation within the household, or disturbance of maternal peace.",
      effortMultiplier: "Native must work twice as hard to achieve domestic peace, calm the nervous system, and prevent mental anxiety at home.",
      prescribedParihara: "Maintain lighthearted humor, avoid petty gossip within the family, weigh words carefully before speaking at home, and practice pranayama."
    },
    {
      planet: "Mercury",
      mksHouse: 7,
      suffocationMechanism: "7th house is the sacred contract of serious marital companionship and long-term business alliances. Mercury's childlike, uncommitted, and playful banter trivializes serious partnerships, breeding contractual mistrust and partner detachment.",
      karmicRootCause: "Past-life trivialization of solemn relationship vows, flirtatious non-commitment, or casual deception in partnerships.",
      effortMultiplier: "Native must work twice as hard to sustain marital stability, prove loyalty, and maintain serious contractual integrity.",
      prescribedParihara: "Commit fully to marital agreements, refrain from childish banter in serious negotiations, practice truthful transparency, and listen attentively."
    }
  ],
  Venus: [
    {
      planet: "Venus",
      mksHouse: 6,
      suffocationMechanism: "6th house represents conflict, litigation, disease, and hyper-critical analysis (debilitation archetype of Virgo). Venus embodies unconditional romance, love, and artistic beauty; bringing continuous analysis and fault-finding into love destroys affection.",
      karmicRootCause: "Past-life fault-finding in relationships, severe criticism of partners, or treating love as a transactional debt.",
      effortMultiplier: "Native must expend double effort to sustain romantic harmony, avoid relationship litigation, and prevent reproductive/urinary ailments.",
      prescribedParihara: "Wear clean and pleasant white/pastel attire, care for women and cows, cultivate unconditional forgiveness, and abandon hyper-critical complaints against partners."
    }
  ],
  Mars: [
    {
      planet: "Mars",
      mksHouse: 7,
      suffocationMechanism: "7th house demands gentle harmony, mutual compromise, and diplomatic equality. Mars is pure raw aggression, weapons, and battlefield dominance; treating marriage like a combat zone ruins companionship and triggers fierce marital friction.",
      karmicRootCause: "Past-life violent domineering over partners, aggressive coercion in relationships, or enforcing martial law at home.",
      effortMultiplier: "Native must expend double effort to sustain marital peace and prevent destructive power struggles.",
      prescribedParihara: "Direct physical fire and drive into constructive athletic workouts or protective service; never project anger or martial dominance onto the spouse."
    }
  ],
  Moon: [
    {
      planet: "Moon",
      mksHouse: 8,
      suffocationMechanism: "Moon is the conscious, tranquil mind (Manas) and emotional security. 8th house is subterranean darkness, chronic upheavals, hidden trauma, and sudden terror (debilitation archetype of Scorpio); emotional peace drowns in anxiety unless anchored by spiritual discipline.",
      karmicRootCause: "Past-life emotional betrayal, subterranean paranoia, or abandoning maternal responsibilities in times of crisis.",
      effortMultiplier: "Native must expend double effort to stabilize the psychological mind, conquer irrational fears, and maintain inner calm.",
      prescribedParihara: "Devotedly serve one's mother, respect and support women, maintain daily meditation, and study esoteric philosophy (Para Vidya) or chant Mahamrityunjaya."
    }
  ],
  Rahu: [
    {
      planet: "Rahu",
      mksHouse: 9,
      suffocationMechanism: "9th house is traditional dharma, righteous lineage, father, and Guru. Rahu is the revolutionary outlaw bringing rebellion, defiance against one's own lineage, and attraction toward alien philosophical systems, creating deep discord with mentors.",
      karmicRootCause: "Past-life rebellion against sacred traditions, disrespecting the Guru or father, or profaning religious sacraments.",
      effortMultiplier: "Native must expend double effort to reconcile personal ethics with ancestral roots and earn legitimate spiritual guidance.",
      prescribedParihara: "Help people unconditionally without judgment, stay completely clear of get-rich-quick religious illusions or scams, and revere the father."
    }
  ],
  Sun: [
    {
      planet: "Sun",
      mksHouse: 12,
      suffocationMechanism: "Sun is daylight, radiant vitality, personal authority, and visible sovereignty. 12th house is sleep, confinement, hospitalisation, foreign isolation, and darkness; vitality sinks, leading to nocturnal work habits and a struggle for public recognition.",
      karmicRootCause: "Past-life arrogance of authority, abusing royal power, or negligence toward paternal lineage and sacred light.",
      effortMultiplier: "Native must expend double effort to receive visible credit, overcome nocturnal fatigue, and maintain vitality.",
      prescribedParihara: "Provide selfless assistance to complete strangers in hospitals or charitable asylums, perform morning Surya Arghya, and honor paternal lineage."
    }
  ]
};

export interface MksDetectedPlanet {
  planet: string;
  house: number;
  signName: string;
  sanskritSign: string;
  suffocationMechanism: string;
  karmicRootCause: string;
  effortMultiplier: string;
  prescribedParihara: string;
}

export interface MaranaKarakaSthanaResult {
  hasMksPlanets: boolean;
  totalMksCount: number;
  mksPlanets: MksDetectedPlanet[];
  mksSeverityScore: number; // 0 to 100
  executiveMksVerdict: string;
}

/**
 * Audits a natal chart for Marana Karaka Sthana (MKS) placements per Session 71.
 */
export function calculateMaranaKarakaSthana(natalEphem: EphemerisResult): MaranaKarakaSthanaResult {
  const mksPlanets: MksDetectedPlanet[] = [];

  for (const [pName, pData] of Object.entries(natalEphem.planets)) {
    if (!pData || pData.isUpagraha || pData.isModernPlanet) continue;
    const defs = MKS_DEFINITIONS[pName];
    if (!defs) continue;

    for (const def of defs) {
      if (pData.house === def.mksHouse) {
        const signIdx = getBodySignIndex(pData);
        mksPlanets.push({
          planet: pName,
          house: pData.house,
          signName: ZODIAC_SIGNS[signIdx],
          sanskritSign: RASHI_SANSKRIT[signIdx],
          suffocationMechanism: def.suffocationMechanism,
          karmicRootCause: def.karmicRootCause,
          effortMultiplier: def.effortMultiplier,
          prescribedParihara: def.prescribedParihara,
        });
      }
    }
  }

  const hasMksPlanets = mksPlanets.length > 0;
  const mksSeverityScore = Math.min(100, mksPlanets.length * 25);

  let executiveMksVerdict = "";
  if (!hasMksPlanets) {
    executiveMksVerdict = "Zero Marana Karaka Sthana (MKS) Afflictions Detected. All planetary portfolios operate with natural vitality and free agency without past-life suffocation.";
  } else if (mksPlanets.length === 1) {
    const p = mksPlanets[0];
    executiveMksVerdict = `Single MKS Planet Detected: ${p.planet} in House #${p.house} (${p.signName}). Its natural portfolio feels suffocated due to past-life karmic lessons. The native must expend double conscious labor to sustain this domain.`;
  } else {
    const names = mksPlanets.map(p => `${p.planet} (H#${p.house})`).join(", ");
    executiveMksVerdict = `Multiple MKS Planets Detected (${names}). Severe past-life karmic checkpoints active (Suffocation Score: ${mksSeverityScore}/100). Prescribed specific behavioral sadhanas must be adopted to unlock planetary vitality.`;
  }

  return {
    hasMksPlanets,
    totalMksCount: mksPlanets.length,
    mksPlanets,
    mksSeverityScore,
    executiveMksVerdict,
  };
}

// =========================================================================
// 2. THE AUTOMOBILE METAPHOR & DISPOSITORS (SESSION 72)
// =========================================================================

export interface AutomobileCockpitResult {
  rahuDestination: {
    planet: string;
    role: string;
    house: number;
    signName: string;
    metaphor: string;
    focus: string;
  };
  ketuPastRoot: {
    planet: string;
    role: string;
    house: number;
    signName: string;
    metaphor: string;
    focus: string;
  };
  saturnCosmicLaw: {
    planet: string;
    role: string;
    house: number;
    signName: string;
    metaphor: string;
    focus: string;
  };
  steeringWheels: {
    rahuDispositor: string;
    rahuDispositorHouse: number;
    rahuDispositorSign: string;
    ketuDispositor: string;
    ketuDispositorHouse: number;
    ketuDispositorSign: string;
    steeringDynamics: string;
  };
  cockpitSynthesis: string;
}

/**
 * Calculates the Automobile Metaphor telemetry for Rahu, Ketu, Saturn, and their dispositors per Session 72.
 */
export function calculateAutomobileCockpit(natalEphem: EphemerisResult): AutomobileCockpitResult {
  const rahuData = natalEphem.planets.Rahu;
  const ketuData = natalEphem.planets.Ketu;
  const saturnData = natalEphem.planets.Saturn;

  const rahuSignIdx = getBodySignIndex(rahuData);
  const ketuSignIdx = getBodySignIndex(ketuData);
  const saturnSignIdx = getBodySignIndex(saturnData);

  const rahuDispositorName = SIGN_LORDS[rahuSignIdx];
  const ketuDispositorName = SIGN_LORDS[ketuSignIdx];

  const rahuDispData = natalEphem.planets[rahuDispositorName];
  const ketuDispData = natalEphem.planets[ketuDispositorName];

  const rahuDispHouse = rahuDispData ? rahuDispData.house : 1;
  const rahuDispSignIdx = getBodySignIndex(rahuDispData);

  const ketuDispHouse = ketuDispData ? ketuDispData.house : 1;
  const ketuDispSignIdx = getBodySignIndex(ketuDispData);

  const rahuDestination = {
    planet: "Rahu",
    role: "The Destination / Google Maps / Current Life Ambition",
    house: rahuData ? rahuData.house : 1,
    signName: ZODIAC_SIGNS[rahuSignIdx],
    metaphor: "Google Maps / Desires / Attention: Where consciousness is pulled for evolutionary frontier growth.",
    focus: `Future karma focuses aggressively on House #${rahuData ? rahuData.house : 1} (${ZODIAC_SIGNS[rahuSignIdx]}).`,
  };

  const ketuPastRoot = {
    planet: "Ketu",
    role: "The Past Life Root / Intention (Sankalpa) / Dissolution",
    house: ketuData ? ketuData.house : 7,
    signName: ZODIAC_SIGNS[ketuSignIdx],
    metaphor: "Past Life Root: Accumulated mastery, innate subconscious habits, and ultimate detachment (Moksha).",
    focus: `Past karma originates from House #${ketuData ? ketuData.house : 7} (${ZODIAC_SIGNS[ketuSignIdx]}).`,
  };

  const saturnCosmicLaw = {
    planet: "Saturn",
    role: "The Law / Road Rules / Discipline / Reality Boundary",
    house: saturnData ? saturnData.house : 10,
    signName: ZODIAC_SIGNS[saturnSignIdx],
    metaphor: "Road Rules & Police: The strict reality of time, structural boundaries, and non-negotiable cosmic law.",
    focus: `Uncompromising cosmic boundaries enforce discipline in House #${saturnData ? saturnData.house : 10} (${ZODIAC_SIGNS[saturnSignIdx]}).`,
  };

  const steeringDynamics = `Your karmic vehicle is steered through ${rahuDispositorName} (Rahu's Dispositor in H#${rahuDispHouse} ${ZODIAC_SIGNS[rahuDispSignIdx]}) and ${ketuDispositorName} (Ketu's Dispositor in H#${ketuDispHouse} ${ZODIAC_SIGNS[ketuDispSignIdx]}). These two planets act as the steering wheels determining how effectively you navigate the tension between past comfort and future ambition.`;

  const cockpitSynthesis = `Automobile Karmic System: You are driving toward ${ZODIAC_SIGNS[rahuSignIdx]} (H#${rahuDestination.house} Destination) while carrying the subconscious engine roots of ${ZODIAC_SIGNS[ketuSignIdx]} (H#${ketuPastRoot.house} Root). Saturn in ${ZODIAC_SIGNS[saturnSignIdx]} (H#${saturnCosmicLaw.house}) sets the speed limits and moral boundaries you cannot breach without karmic penalties. Steering is executed through ${rahuDispositorName} and ${ketuDispositorName}.`;

  return {
    rahuDestination,
    ketuPastRoot,
    saturnCosmicLaw,
    steeringWheels: {
      rahuDispositor: rahuDispositorName,
      rahuDispositorHouse: rahuDispHouse,
      rahuDispositorSign: ZODIAC_SIGNS[rahuDispSignIdx],
      ketuDispositor: ketuDispositorName,
      ketuDispositorHouse: ketuDispHouse,
      ketuDispositorSign: ZODIAC_SIGNS[ketuDispSignIdx],
      steeringDynamics,
    },
    cockpitSynthesis,
  };
}

// =========================================================================
// 3. KETU 12-SIGN PAST LIFE DECODING (SESSIONS 72 & 74)
// =========================================================================

export interface KetuPastLifeSignProfile {
  signName: string;
  sanskritSign: string;
  pastLifeArchetype: string;
  pastLifeKarmicBaggage: string;
  currentLifeRahuSign: string;
  currentLifeRahuMandate: string;
  evolutionaryAdvice: string;
  hasSpecialMatsyaWaterWarning: boolean;
  specialWarning: string | null;
}

export const KETU_PAST_LIFE_DICTIONARY: Record<number, KetuPastLifeSignProfile> = {
  0: {
    signName: "Aries",
    sanskritSign: "Mesha",
    pastLifeArchetype: "Warrior, Soldier, Police Officer, or Battlefield Commander",
    pastLifeKarmicBaggage: "In previous births, you were an impulsive, action-oriented fighter who acted alone, took unilateral risks, and may have sacrificed your life in battle. You carry subconscious habits of impatience and combativeness.",
    currentLifeRahuSign: "Libra (Tula)",
    currentLifeRahuMandate: "Master diplomatic compromise, collaborative equality, committed partnerships, and peaceful dispute resolution.",
    evolutionaryAdvice: "Cease fighting every battle alone. Step down from combat posture and invest deeply in sacred partnerships and collaborative harmony.",
    hasSpecialMatsyaWaterWarning: false,
    specialWarning: null,
  },
  1: {
    signName: "Taurus",
    sanskritSign: "Vrishabha",
    pastLifeArchetype: "Self-Centered Material Accumulator, Merchant, or Feudal Landowner",
    pastLifeKarmicBaggage: "In past births, you were deeply attached to material wealth, gold, luxury goods, and family possessions, hoarding assets for self-preservation and comfort.",
    currentLifeRahuSign: "Scorpio (Vrishchika)",
    currentLifeRahuMandate: "Encounter the mysteries of spiritual transformation, shared vulnerability, occult depth, and shedding obsessive materialism.",
    evolutionaryAdvice: "Let go of the illusion that bank balance equals security. Dive into psychological truth, occult transformation, and selfless trust.",
    hasSpecialMatsyaWaterWarning: false,
    specialWarning: null,
  },
  2: {
    signName: "Gemini",
    sanskritSign: "Mithuna",
    pastLifeArchetype: "Intellectual Chatterbox, Commercial Broker, Writer, Comedian, or Trader",
    pastLifeKarmicBaggage: "Past life was spent indulging in intellectual wordplay, clever jokes, and commercial haggling without anchoring in higher truth. You frequently misused speech or trivialized sacred matters.",
    currentLifeRahuSign: "Sagittarius (Dhanu)",
    currentLifeRahuMandate: "Search for higher philosophical truth, cosmic dharma, ethical mentors, and profound spiritual meaning.",
    evolutionaryAdvice: "Elevate your communication from witty commercial banter into meaningful, ethical philosophy and spiritual instruction.",
    hasSpecialMatsyaWaterWarning: false,
    specialWarning: null,
  },
  3: {
    signName: "Cancer",
    sanskritSign: "Karka",
    pastLifeArchetype: "Domestic Matriarch or Family Power Ruler",
    pastLifeKarmicBaggage: "Deeply entrenched in the family home and emotional authority, sometimes abusing that control through guilt-tripping and emotional manipulation of dependents.",
    currentLifeRahuSign: "Capricorn (Makara)",
    currentLifeRahuMandate: "Step out into public career duty, build structural societal achievements, and take hard-headed corporate responsibility.",
    evolutionaryAdvice: "Leave the domestic cocoon. Cultivate resilience, earn public respect through diligent labor, and replace emotional clinginess with professional maturity.",
    hasSpecialMatsyaWaterWarning: false,
    specialWarning: null,
  },
  4: {
    signName: "Leo",
    sanskritSign: "Simha",
    pastLifeArchetype: "Royal Monarch, High Executive, or Aristocratic Leader",
    pastLifeKarmicBaggage: "Held royal authority or executive dominance in Sun's domain, carrying monarchical arrogance, entitlement, and the expectation of personal adulation.",
    currentLifeRahuSign: "Aquarius (Kumbha)",
    currentLifeRahuMandate: "Dismantle aristocratic pride; serve community networks, humanitarian causes, and collective welfare as an equal peer.",
    evolutionaryAdvice: "Relinquish the personal crown. Channel leadership into mass collective causes and empower others without demanding center-stage attention.",
    hasSpecialMatsyaWaterWarning: false,
    specialWarning: null,
  },
  5: {
    signName: "Virgo",
    sanskritSign: "Kanya",
    pastLifeArchetype: "Service Sector Worker: Hospital Admin, Auditor, Nurse, or Medical Laborer",
    pastLifeKarmicBaggage: "Spent lifetimes in meticulous routine labor, auditing, and clinical service, leaving a legacy of hyper-critical anxiety, compulsive perfectionism, and endless fault-finding.",
    currentLifeRahuSign: "Pisces (Meena)",
    currentLifeRahuMandate: "Develop mystical intuition, surrender the ego to divine flow, and let go of obsessive analytical fault-finding.",
    evolutionaryAdvice: "Stop endlessly auditing everyone's flaws. Trust the cosmic universe, cultivate quiet spiritual contemplation, and surrender to divine grace.",
    hasSpecialMatsyaWaterWarning: false,
    specialWarning: null,
  },
  6: {
    signName: "Libra",
    sanskritSign: "Tula",
    pastLifeArchetype: "Worldly Diplomat, Courtier, Artist, or Compulsive People-Pleaser",
    pastLifeKarmicBaggage: "Focused extensively on pleasing partners, compromising core integrity to maintain social harmony, and over-relying on superficial marital aesthetic validation.",
    currentLifeRahuSign: "Aries (Mesha)",
    currentLifeRahuMandate: "Stand firmly on your own feet, take bold independent initiatives, and cultivate personal courage and self-sovereignty.",
    evolutionaryAdvice: "Stop waiting for partner approval. Take sovereign responsibility for your life and pioneer your own path fearlessly.",
    hasSpecialMatsyaWaterWarning: false,
    specialWarning: null,
  },
  7: {
    signName: "Scorpio",
    sanskritSign: "Vrishchika",
    pastLifeArchetype: "Deep Occult Practitioner, Tantric Yogi, Astrologer, or Isolated Ascetic",
    pastLifeKarmicBaggage: "Mastered esoteric arts, tantra, or lived as a secretive hermit. If Ketu is afflicted, there may be ancestral curses (Pitru/Kula Doshas) requiring resolution.",
    currentLifeRahuSign: "Taurus (Vrishabha)",
    currentLifeRahuMandate: "Step out into stable society, manage clean practical family wealth, speak sweetly, and honor women with reverence.",
    evolutionaryAdvice: "Disarm subterranean paranoia. Direct mystical intuition toward building stable family values, legitimate resources, and tangible peace.",
    hasSpecialMatsyaWaterWarning: false,
    specialWarning: null,
  },
  8: {
    signName: "Sagittarius",
    sanskritSign: "Dhanu",
    pastLifeArchetype: "Natural Sage, Temple Priest, or Traditional Religious Scholar",
    pastLifeKarmicBaggage: "Performed extensive formal rituals, temple duties, and scriptural chants in past births, making the native deeply cynical of superficial rituals in this lifetime.",
    currentLifeRahuSign: "Gemini (Mithuna)",
    currentLifeRahuMandate: "Translate sacred truths into everyday common language, publish practical writings, and communicate relatable wisdom.",
    evolutionaryAdvice: "Do not remain isolated on an ivory tower of scriptural pride. Use modern communication tools to express helpful wisdom clearly to all people.",
    hasSpecialMatsyaWaterWarning: false,
    specialWarning: null,
  },
  9: {
    signName: "Capricorn",
    sanskritSign: "Makara",
    pastLifeArchetype: "Status Climber, Bureaucratic Official, or Hardened Material Administrator",
    pastLifeKarmicBaggage: "Centered entirely on hierarchical status, corporate climbing, and rigid material ambition, suppressing emotional warmth for rank.",
    currentLifeRahuSign: "Cancer (Karka)",
    currentLifeRahuMandate: "Cultivate emotional vulnerability, nourish the home and mother, and develop genuine heartfelt compassion.",
    evolutionaryAdvice: "Melt the cold armor of ambition. Prioritize family bonding, emotional presence, and maternal care above social status.",
    hasSpecialMatsyaWaterWarning: false,
    specialWarning: null,
  },
  10: {
    signName: "Aquarius",
    sanskritSign: "Kumbha",
    pastLifeArchetype: "Mass Network Organizer, Societal Rebel, or Collective Ideologue",
    pastLifeKarmicBaggage: "Past life connected to large networks, revolutionary groups, or social rebellions, dissolving individual creative identity in anonymous causes.",
    currentLifeRahuSign: "Leo (Simha)",
    currentLifeRahuMandate: "Discover personal creative identity, step into the spotlight, and radiate individual confidence and heart-centered leadership.",
    evolutionaryAdvice: "Stop hiding behind collective committees. Claim your personal spotlight, express unique creative artistry, and lead with royal warmth.",
    hasSpecialMatsyaWaterWarning: false,
    specialWarning: null,
  },
  11: {
    signName: "Pisces",
    sanskritSign: "Meena",
    pastLifeArchetype: "Monastic Hermit, Solitary Meditator, or Wandering Mystic",
    pastLifeKarmicBaggage: "Natural monastic and spiritual state brought from past lives. Tendency toward escapism and ignoring practical worldly obligations.",
    currentLifeRahuSign: "Virgo (Kanya)",
    currentLifeRahuMandate: "Master grounded methodical execution, analytical accounting, health hygiene, and compassionate daily service.",
    evolutionaryAdvice: "Anchor high spiritual ideals into practical service and disciplined daily habits. Avoid fuzzy escapism.",
    hasSpecialMatsyaWaterWarning: true,
    specialWarning: "⚠️ SACRED MATSYA AVATAR WATER WARNING: Per Medhaj Astro Session 74, Ketu represents the Matsya (fish) incarnation of Lord Vishnu. Individuals with Ketu in Pisces or water signs must exercise extreme caution near deep water, rivers, lakes, or swimming pools during early childhood.",
  },
};

export interface KetuPastLifeTelemetryResult {
  ketuSignIndex: number;
  ketuSignName: string;
  ketuSanskritSign: string;
  ketuHouse: number;
  profile: KetuPastLifeSignProfile;
  synthesis: string;
}

/**
 * Decodes past-life roots via Ketu's sign placement per Sessions 72 & 74.
 */
export function calculateKetuPastLifeTelemetry(natalEphem: EphemerisResult): KetuPastLifeTelemetryResult {
  const ketuData = natalEphem.planets.Ketu;
  const ketuSignIdx = getBodySignIndex(ketuData);
  const profile = KETU_PAST_LIFE_DICTIONARY[ketuSignIdx] || KETU_PAST_LIFE_DICTIONARY[0];
  const ketuHouse = ketuData ? ketuData.house : 1;

  const synthesis = `Past Life Root: In your previous incarnation, with Ketu in ${profile.signName} (${profile.sanskritSign}) in House #${ketuHouse}, you operated as a ${profile.pastLifeArchetype}. You carried ingrained habits of ${profile.pastLifeKarmicBaggage} In this lifetime, your evolutionary Rahu frontier commands: ${profile.currentLifeRahuMandate} ${profile.specialWarning ? `\n\n${profile.specialWarning}` : ""}`;

  return {
    ketuSignIndex: ketuSignIdx,
    ketuSignName: profile.signName,
    ketuSanskritSign: profile.sanskritSign,
    ketuHouse,
    profile,
    synthesis,
  };
}

// =========================================================================
// 4. SATURN SUPREME COSMIC BOUNDARY LAW ACROSS 12 SIGNS (SESSION 74)
// =========================================================================

export interface SaturnBoundaryRule {
  signName: string;
  sanskritSign: string;
  nonNegotiableLaw: string;
  violationConsequence: string;
  masteryKey: string;
}

export const SATURN_COSMIC_BOUNDARIES: Record<number, SaturnBoundaryRule> = {
  0: {
    signName: "Aries",
    sanskritSign: "Mesha",
    nonNegotiableLaw: "Action without discipline and patience causes immediate failure.",
    violationConsequence: "Impulsive aggression or recklessness triggers severe setbacks and career stumbling blocks.",
    masteryKey: "Channel passion into structured, patient physical discipline.",
  },
  1: {
    signName: "Taurus",
    sanskritSign: "Vrishabha",
    nonNegotiableLaw: "Selfish hoarding and sensory indulgence backfires materially.",
    violationConsequence: "Greed, miserliness, or excessive luxury spending leads to sudden financial contraction.",
    masteryKey: "Practice clean financial stewardship, moderation, and ethical wealth circulation.",
  },
  2: {
    signName: "Gemini",
    sanskritSign: "Mithuna",
    nonNegotiableLaw: "Clever deceit, shallow banter, or verbal double-talk collapses.",
    violationConsequence: "Using intellectual trickery or dishonest communication leads to public disrepute and loss of contracts.",
    masteryKey: "Speak with rigorous integrity, precision, and honesty.",
  },
  3: {
    signName: "Cancer",
    sanskritSign: "Karka",
    nonNegotiableLaw: "Emotional manipulation and guilt-tripping will be brutally exposed.",
    violationConsequence: "Using emotional vulnerability to control others results in painful alienation from loved ones.",
    masteryKey: "Develop genuine emotional resilience and offer unconditional, unmanipulative love.",
  },
  4: {
    signName: "Leo",
    sanskritSign: "Simha",
    nonNegotiableLaw: "Arrogant self-aggrandizement and egoic vanity will be crushed by time.",
    violationConsequence: "Demanding personal adulation or abusing authority triggers sudden public humiliation.",
    masteryKey: "Exercise humble, benevolent servant leadership without expecting worship.",
  },
  5: {
    signName: "Virgo",
    sanskritSign: "Kanya",
    nonNegotiableLaw: "Hyper-critical fault-finding paralyzes execution and damages health.",
    violationConsequence: "Obsessive criticism of others causes chronic psychosomatic fatigue and digestive stress.",
    masteryKey: "Cultivate constructive, compassionate service without destructive nitpicking.",
  },
  6: {
    signName: "Libra",
    sanskritSign: "Tula",
    nonNegotiableLaw: "Purely transactional, calculated relationships will disintegrate.",
    violationConsequence: "Treating human bonds as cynical balance-sheet trades brings loneliness and marital divorce.",
    masteryKey: "Anchor relationships in sacred justice, unwavering loyalty, and mutual honor.",
  },
  7: {
    signName: "Scorpio",
    sanskritSign: "Vrishchika",
    nonNegotiableLaw: "Vengeful secrets, hidden grudges, and paranoia will poison the bearer.",
    violationConsequence: "Plotting retribution or dwelling on old injuries causes psychological torment and inner crisis.",
    masteryKey: "Forgive completely, practice spiritual alchemy, and release subterranean control.",
  },
  8: {
    signName: "Sagittarius",
    sanskritSign: "Dhanu",
    nonNegotiableLaw: "Dogmatic hypocrisy, religious bigotry, and false piety will be disgraced.",
    violationConsequence: "Preaching morals that you do not practice invites public exposure and moral downfall.",
    masteryKey: "Walk your talk with total humility; revere living truth over empty dogma.",
  },
  9: {
    signName: "Capricorn",
    sanskritSign: "Makara",
    nonNegotiableLaw: "Cold tyranny, unfeeling ambition, and relentless climbing will be broken.",
    violationConsequence: "Treading on others to ascend the corporate or societal ladder brings an isolated, bitter fall.",
    masteryKey: "Build sustainable institutional structures anchored in duty, fairness, and human care.",
  },
  10: {
    signName: "Aquarius",
    sanskritSign: "Kumbha",
    nonNegotiableLaw: "Anarchic rebellion and cold intellectual detachment leads to total isolation.",
    violationConsequence: "Rebelling for the sake of rebellion without offering constructive solutions leads to exile.",
    masteryKey: "Work patiently within collective frameworks to build practical humanitarian reforms.",
  },
  11: {
    signName: "Pisces",
    sanskritSign: "Meena",
    nonNegotiableLaw: "Escapist delusions, substance neglect, and avoiding reality lead to bankruptcy.",
    violationConsequence: "Fleeing worldly duties through daydreaming or escapism causes practical material ruin.",
    masteryKey: "Anchor cosmic spirituality into disciplined daily devotion and sober reality.",
  },
};

export interface SaturnCosmicBoundaryResult {
  saturnSignIndex: number;
  saturnSignName: string;
  saturnSanskritSign: string;
  saturnHouse: number;
  rule: SaturnBoundaryRule;
  executiveBoundaryVerdict: string;
}

/**
 * Calculates Saturn's supreme cosmic boundary law for the native's chart per Session 74.
 */
export function calculateSaturnCosmicBoundaries(natalEphem: EphemerisResult): SaturnCosmicBoundaryResult {
  const saturnData = natalEphem.planets.Saturn;
  const satSignIdx = getBodySignIndex(saturnData);
  const satHouse = saturnData ? saturnData.house : 10;
  const rule = SATURN_COSMIC_BOUNDARIES[satSignIdx] || SATURN_COSMIC_BOUNDARIES[9];

  const executiveBoundaryVerdict = `Saturn in ${rule.signName} (${rule.sanskritSign}) in House #${satHouse}: Cosmic Law: "${rule.nonNegotiableLaw}" Warning: ${rule.violationConsequence} Mastery: ${rule.masteryKey}`;

  return {
    saturnSignIndex: satSignIdx,
    saturnSignName: rule.signName,
    saturnSanskritSign: rule.sanskritSign,
    saturnHouse: satHouse,
    rule,
    executiveBoundaryVerdict,
  };
}

// =========================================================================
// 5. MASTER REPORT GENERATION (SESSIONS 71, 72 & 74)
// =========================================================================

export interface MedhajMksPastLifeMasterReport {
  generatedAt: string;
  birthDate: string;
  evaluationDate: string;
  mks: MaranaKarakaSthanaResult;
  automobileCockpit: AutomobileCockpitResult;
  ketuPastLife: KetuPastLifeTelemetryResult;
  saturnBoundary: SaturnCosmicBoundaryResult;
  masterExecutiveSummary: string;
}

/**
 * Generates the complete Medhaj Astro Master Report for Sessions 71, 72 & 74.
 */
export function generateMedhajMksPastLifeMasterReport(
  natalEphem: EphemerisResult,
  birthDate: Date,
  evaluationDate: Date
): MedhajMksPastLifeMasterReport {
  const mks = calculateMaranaKarakaSthana(natalEphem);
  const automobileCockpit = calculateAutomobileCockpit(natalEphem);
  const ketuPastLife = calculateKetuPastLifeTelemetry(natalEphem);
  const saturnBoundary = calculateSaturnCosmicBoundaries(natalEphem);

  const masterExecutiveSummary = `
========================================================================================
MEDHAJ ASTRO MKS, PAST LIFE ROOTS & SATURN COSMIC LAW REPORT (SESSIONS 71, 72 & 74)
========================================================================================
1. Marana Karaka Sthana (MKS) Suffocation Audit:
   - MKS Active: ${mks.hasMksPlanets ? "YES" : "NO"} (Total: ${mks.totalMksCount}, Severity: ${mks.mksSeverityScore}/100)
   - Status: ${mks.executiveMksVerdict}
   ${mks.mksPlanets.length > 0 ? mks.mksPlanets.map(p => `   * ${p.planet} in House #${p.house} (${p.signName}):\n     - Mechanism: ${p.suffocationMechanism}\n     - Remedy: ${p.prescribedParihara}`).join("\n") : "   * All planets free from MKS suffocation."}

2. The Automobile Metaphor Cockpit:
   - Rahu (Destination / Google Maps): ${automobileCockpit.rahuDestination.signName} (H#${automobileCockpit.rahuDestination.house})
   - Ketu (Past Root / Intention): ${automobileCockpit.ketuPastRoot.signName} (H#${automobileCockpit.ketuPastRoot.house})
   - Saturn (Cosmic Law / Road Rules): ${automobileCockpit.saturnCosmicLaw.signName} (H#${automobileCockpit.saturnCosmicLaw.house})
   - Steering Wheels: Rahu Disp (${automobileCockpit.steeringWheels.rahuDispositor} in H#${automobileCockpit.steeringWheels.rahuDispositorHouse}) & Ketu Disp (${automobileCockpit.steeringWheels.ketuDispositor} in H#${automobileCockpit.steeringWheels.ketuDispositorHouse})
   - Dynamics: ${automobileCockpit.steeringWheels.steeringDynamics}

3. Ketu 12-Sign Past Life Origins & Rahu Destiny Mandate:
   - Past Life Identity: ${ketuPastLife.profile.pastLifeArchetype} (Ketu in ${ketuPastLife.ketuSignName})
   - Karmic Baggage: ${ketuPastLife.profile.pastLifeKarmicBaggage}
   - Current Life Mandate: Rahu in ${ketuPastLife.profile.currentLifeRahuSign} ──► ${ketuPastLife.profile.currentLifeRahuMandate}
   - Evolutionary Counsel: ${ketuPastLife.profile.evolutionaryAdvice}
   ${ketuPastLife.profile.hasSpecialMatsyaWaterWarning ? `\n   ${ketuPastLife.profile.specialWarning}` : ""}

4. Saturn's Supreme Cosmic Boundary Law:
   - Placement: Saturn in ${saturnBoundary.saturnSignName} (${saturnBoundary.saturnSanskritSign}) in House #${saturnBoundary.saturnHouse}
   - Non-Negotiable Law: "${saturnBoundary.rule.nonNegotiableLaw}"
   - Violation Consequence: ${saturnBoundary.rule.violationConsequence}
   - Key to Mastery: ${saturnBoundary.rule.masteryKey}
========================================================================================
`.trim();

  return {
    generatedAt: new Date().toISOString(),
    birthDate: birthDate.toISOString().slice(0, 10),
    evaluationDate: evaluationDate.toISOString().slice(0, 10),
    mks,
    automobileCockpit,
    ketuPastLife,
    saturnBoundary,
    masterExecutiveSummary,
  };
}
