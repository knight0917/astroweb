/**
 * Rahu & Ketu Conjunctions Master Engine
 * Based on Acharya Vishnukripa's Video Masterclass ("Rahu Conjunctions & Results")
 * and Classical Sanskrit Principles (Phaladeepika, BPHS, Jataka Parijata).
 *
 * Evaluates the 7 primary planetary conjunctions with Rahu and Ketu,
 * computing exact angular separation, potency tier, psychological impact,
 * life event milestones, signature superpowers, and authentic Shastric remedies.
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";

export type ConjunctionPotencyTier =
  | "Deep Eclipse / Exact Fusion (<= 3.5°)"
  | "Potent Conjunction (3.5° - 7.0°)"
  | "Wide Field Influence (7.0° - 12.0°)"
  | "Same Sign (Non-Orb Conjunction)";

export interface RahuConjunctionProfile {
  id: string;
  node: "Rahu" | "Ketu";
  conjoinedPlanet: string;
  yogaName: string;
  sanskritName: string;
  signIndex: number;
  signName: string;
  house: number;
  exactOrbDegrees: number;
  potencyTier: ConjunctionPotencyTier;
  potencyScore: number; // 0 to 100
  psychologicalImpact: string;
  lifeEventsAndTriggers: string;
  signatureSuperpower: string;
  vulnerabilityToWatch: string;
  shastricRemedies: string[];
}

export interface NodalConjunctionReport {
  hasRahuConjunctions: boolean;
  hasKetuConjunctions: boolean;
  totalConjunctionsCount: number;
  highestPotencyConjunction: RahuConjunctionProfile | null;
  conjunctions: RahuConjunctionProfile[];
  karmicEvolutionSummary: string;
}

interface ConjunctionArchetype {
  yogaName: string;
  sanskritName: string;
  deepPsychology: string;
  widePsychology: string;
  lifeTriggers: string;
  superpower: string;
  vulnerability: string;
  remedies: string[];
}

const RAHU_ARCHETYPES: Record<string, ConjunctionArchetype> = {
  Sun: {
    yogaName: "Surya Grahan / Pitru Dosha",
    sanskritName: "सूर्य-राहु ग्रहण योग (पितृ दोष)",
    deepPsychology:
      "Deep struggle between an insatiable hunger for sovereign public recognition and inner imposter anxiety. The native experiences complex identity crises and tension with authority figures.",
    widePsychology:
      "Fierce drive to break traditional corporate or governmental glass ceilings. An unconventional leader who creates a modern sovereign persona outside conventional orthodox paths.",
    lifeTriggers:
      "Sudden, dramatic elevations in corporate or public status, frequently accompanied by sharp reputational scrutiny. Paternal career complexities or early divergence from father's worldview. Sensitive to eyesight, spine, and cardiovascular balance.",
    superpower:
      "Magnetic, trailblazing executive charisma capable of transforming stagnant institutions and capturing high-stakes visibility.",
    vulnerability:
      "Ego burnout, hypersensitivity to public criticism, and conflict with senior regulatory gatekeepers.",
    remedies: [
      "Offer daily Surya Arghya (water offering) in a clean copper vessel at sunrise with red sandalwood and whole rice grains.",
      "Recite the sacred Aditya Hridaya Stotra on Sundays.",
      "Practice selfless service towards father, paternal elders, and senior mentors.",
      "Donate whole wheat, copper utensils, or jaggery on Sunday afternoons.",
    ],
  },
  Moon: {
    yogaName: "Chandra Grahan / Maya Yoga",
    sanskritName: "चन्द्र-राहु ग्रहण योग (माया योग)",
    deepPsychology:
      "Hyper-reactive emotional nervous system acting like a psychic antenna. Prone to vivid dreams, subconscious phobias, tidal emotional waves, and heightened sensitivity to external atmospheres.",
    widePsychology:
      "Visionary creative imagination, uncanny psychological intuition, and talent for cinema, storytelling, photography, and capturing collective human emotions.",
    lifeTriggers:
      "Emotional misunderstandings with maternal figures; maternal health sensitivities. Periodic mental exhaustion requiring secluded decompression. Extraordinary talent in visual arts, media, and marketing.",
    superpower:
      "Psychic emotional empathy—the ability to instinctively decode what crowds and individuals desire long before they speak.",
    vulnerability:
      "Anxiety spirals, psychosomatic insomnia, and difficulty distinguishing authentic intuition from fear-based projection.",
    remedies: [
      "Perform milk and water Abhishek on a sacred Shiva Linga on Monday mornings while chanting 'ॐ नमः शिवाय'.",
      "Wear a pure, unblemished silver ring or band on the right little finger to ground the lunar nervous system.",
      "Avoid sleeping in dark, cluttered rooms; keep fresh air and natural sunlight in your living space.",
      "Practice Trataka (gentle flame gazing) or breathwork (Nadi Shodhana Pranayama) to quiet subconscious turbulence.",
    ],
  },
  Mars: {
    yogaName: "Angarak Yoga (High-Voltage Kinetic Engine)",
    sanskritName: "अंगारक योग (मंगल-राहु)",
    deepPsychology:
      "High-voltage inner urgency, volcanic kinetic drive, and explosive impatience with bureaucratic hesitation. Courage borders on fearlessness.",
    widePsychology:
      "Unyielding athletic stamina, technological dynamism, and a fiercely competitive spirit that thrives under adversarial conditions.",
    lifeTriggers:
      "High susceptibility to cuts, burns, athletic injuries, or vehicular haste. Immense breakthrough capacity in surgery, engineering, real estate acquisition, high-frequency trading, and emergency crisis management.",
    superpower:
      "Unflinching decisiveness during high-pressure crises where ordinary competitors freeze.",
    vulnerability:
      "Short temper, rash physical reactivity, and burnout from running at redline velocity.",
    remedies: [
      "Recite the Hanuman Chalisa daily in the evening with sincere devotion.",
      "Channel excess kinetic adrenaline into disciplined physical training, martial arts, or sports.",
      "Donate blood voluntarily twice yearly to appease the fiery Mangala-Rahu current.",
      "Donate red lentils (masoor dal) or copper coins to laborers and service workers on Tuesdays.",
    ],
  },
  Mercury: {
    yogaName: "Kautilya / Maya-Buddhi Yoga",
    sanskritName: "कौटिल्य योग / माया-बुद्धि योग (बुध-राहु)",
    deepPsychology:
      "Lightning-fast cognitive processing, lateral non-linear thinking, and an obsessive appetite for decoding codes, hidden patterns, and strategic systems.",
    widePsychology:
      "Mastery of modern software, programming algorithms, commercial negotiations, marketing psychology, and multilateral diplomacy.",
    lifeTriggers:
      "Intellectual restlessness, nervous mental exhaustion, or susceptibility to digital fraud/scams if unguarded. Extraordinary success in tech architecture, data analytics, foreign trade, and persuasive writing.",
    superpower:
      "Strategic intellectual wizardry—inventing novel, out-of-the-box algorithmic shortcuts and winning high-stakes negotiations.",
    vulnerability:
      "Mental restlessness, deceptive shortcuts, and nervous digestive sensitivity.",
    remedies: [
      "Chant or listen to the sacred Vishnu Sahasranama on Wednesday mornings.",
      "Water a sacred Tulsi (holy basil) plant daily with reverence.",
      "Feed green fodder or green vegetables to cows on Wednesdays.",
      "Practice weekly periods of Mouna (conscious digital and speech silence) to calm cognitive hyperactivity.",
    ],
  },
  Jupiter: {
    yogaName: "Guru-Chandal Yoga (The Iconoclastic Reformer)",
    sanskritName: "गुरु-चांडाल योग (गुरु-राहु)",
    deepPsychology:
      "Profound skepticism toward dogmatic, rigid orthodoxy. The soul questions traditional authority to discover universal, boundaryless spiritual and ethical truths.",
    widePsychology:
      "Visionary philosophical reformer, international educator, and promoter of progressive social and spiritual evolution.",
    lifeTriggers:
      "Initial ideological friction with orthodox teachers, elders, or religious institutions in early adulthood. Later in life, becomes an influential mentor, philosopher, or visionary counsel.",
    superpower:
      "The capacity to dismantle corrupt dogma and construct modern, inclusive philosophical systems that liberate seekers.",
    vulnerability:
      "Cynicism toward traditional wisdom, arrogance toward spiritual guides, or susceptibility to false teachers.",
    remedies: [
      "Maintain deep respect for genuine, humble spiritual teachers and paternal elders.",
      "Chant the sacred Guru Mantra: 'ॐ बृं बृहस्पतये नमः' 108 times on Thursdays.",
      "Donate raw turmeric, saffron, yellow grams (chana dal), or yellow books to scholars and students.",
      "Support educational institutions, orphanages, or spiritual libraries.",
    ],
  },
  Venus: {
    yogaName: "Shukra-Rahu Luxury & Glamour Alignment",
    sanskritName: "शुक्र-राहु योग (माया-सुख योग)",
    deepPsychology:
      "Insatiable aesthetic appetite for luxury, sensory refinement, artistic beauty, romance, and magnetic social glamour.",
    widePsychology:
      "Exceptional artistic taste, magnetic public charm, and pioneering success in fashion, luxury brands, media, cinema, and modern design.",
    lifeTriggers:
      "Unconventional, inter-cultural, or inter-religious romantic partnerships. High vulnerability to romantic disillusionment if projection outpaces reality. Prone to hormonal and reproductive balance fluctuations.",
    superpower:
      "Aesthetic magnetism—an innate ability to design intoxicating visual and emotional experiences that captivate the public.",
    vulnerability:
      "Compulsive luxury expenditure, romantic scandals, and relationship dissatisfaction driven by unrealistic expectations.",
    remedies: [
      "Worship Goddess Durga or Mahalakshmi on Fridays with fragrant white flowers and incense.",
      "Observe fasting or light satvic dining on Fridays (Shukra Vrata).",
      "Maintain transparent ethical boundaries and mutual loyalty in romantic commitments.",
      "Donate white silk garments, camphor, silver, or curd to young girls or women's sanctuaries.",
    ],
  },
  Saturn: {
    yogaName: "Shani-Rahu Shrapit Yoga (Ancient Karmic Lock)",
    sanskritName: "शापित योग (शनि-राहु - प्राचीन कर्म-ग्रंथि)",
    deepPsychology:
      "Deep, stoic endurance paired with a quiet, persistent feeling of carrying heavy ancestral burdens or unexplained karmic debts.",
    widePsychology:
      "Superhuman perseverance under sustained pressure. A patient, methodical builder capable of grinding through extreme adversity to achieve monumental long-term results.",
    lifeTriggers:
      "Heavy delays and trials before age 36; career stability achieved through sheer competence and grit. Exceptional mastery over heavy industry, civil infrastructure, petroleum, mining, deep technology, and real estate.",
    superpower:
      "Unbreakable resilience—the ability to outlast every crisis, market crash, and competitor through relentless patience.",
    vulnerability:
      "Chronic melancholy, neuromuscular tension, joint stiffness, and isolation.",
    remedies: [
      "Recite the Mahamrityunjaya Mantra ('ॐ त्र्यम्बकं यजामहे...') 108 times daily for profound karmic purification.",
      "Light a mustard oil lamp under a sacred Peepal tree on Saturday evenings after sunset.",
      "Perform selfless charity by serving and feeding laborers, the disabled, and the elderly.",
      "Avoid consuming stale or heavily processed food; maintain daily physical stretching.",
    ],
  },
};

const KETU_ARCHETYPES: Record<string, ConjunctionArchetype> = {
  Sun: {
    yogaName: "Ketu-Surya Atma-Moksha Alignment",
    sanskritName: "केतु-सूर्य योग (आत्म-मोक्ष)",
    deepPsychology: "Inner detachment from superficial fame and outer vanity; deep quest for the true, transcendent Self.",
    widePsychology: "Unorthodox leadership driven by self-effacing service rather than ego inflation.",
    lifeTriggers: "Father may be spiritual, introverted, or emotionally distant; native excels behind the scenes.",
    superpower: "Ego-less sovereignty and clear spiritual perception.",
    vulnerability: "Low self-confidence in youth; feeling invisible in competitive corporate politics.",
    remedies: [
      "Chant the Gayatri Mantra 108 times at sunrise.",
      "Offer water to the rising Sun daily.",
      "Donate brown blankets or sesame seeds to elders.",
    ],
  },
  Moon: {
    yogaName: "Ketu-Chandra Vairagya Alignment",
    sanskritName: "केतु-चन्द्र योग (वैराग्य योग)",
    deepPsychology: "Natural psychological detachment, contemplative introspective mind, and deep psychic sensitivity.",
    widePsychology: "Exceptional mastery in meditation, astrology, occult research, and transpersonal psychology.",
    lifeTriggers: "Feelings of maternal alienation in childhood; vivid spiritual intuitions; digestive or emotional sensitivity.",
    superpower: "Instant detachment from worldly drama and deep meditative absorption.",
    vulnerability: "Apathy, melancholic withdrawal, and cold emotional barriers.",
    remedies: [
      "Worship Lord Ganesha daily with the mantra 'ॐ गं गणपतये नमः'.",
      "Offer milk to a Shiva Linga on Mondays.",
      "Maintain a daily mindfulness journaling habit.",
    ],
  },
  Mars: {
    yogaName: "Ketu-Mangala Pishacha / Agni-Moksha Alignment",
    sanskritName: "केतु-मंगल योग (अग्नि-मोक्ष योग)",
    deepPsychology: "Subtle, laser-focused internal fire; unpredictable bursts of sharp physical or intellectual intensity.",
    widePsychology: "Genius in surgical precision, technical troubleshooting, acupuncture, cyber-defense, and martial discipline.",
    lifeTriggers: "Accident proneness involving sharp instruments, fire, or chemicals; sudden explosive disagreements if suppressed.",
    superpower: "Pinpoint accuracy in dissecting problems and neutralizing technical vulnerabilities.",
    vulnerability: "Passive-aggressive resentment and suppressed internal irritation.",
    remedies: [
      "Chant the Kartikeya (Subrahmanya) or Hanuman Mantra daily.",
      "Practice pranayama and avoid rash haste with sharp tools.",
      "Donate red clothing or sweets to monks or hermits.",
    ],
  },
  Mercury: {
    yogaName: "Ketu-Budha Micro-Precision Alignment",
    sanskritName: "केतु-बुध योग (गणेश बुद्धि योग)",
    deepPsychology: "Intuitive, photographic intellect that grasps micro-details instantly without linear explanation.",
    widePsychology: "Genius in cryptanalysis, mathematics, esoteric languages, astrology, and forensic auditing.",
    lifeTriggers: "Speech peculiarities in childhood; sudden flashes of intuitive answers during examinations.",
    superpower: "Instant holistic pattern recognition across complex data matrices.",
    vulnerability: "Nervous anxiety, speech stammer under stress, and cynical dismissal of simple truths.",
    remedies: [
      "Chant the Sankata Nashana Ganesha Stotra on Wednesdays.",
      "Feed stray dogs or birds with grain.",
      "Practice clear, measured speech with breathing pauses.",
    ],
  },
  Jupiter: {
    yogaName: "Ketu-Guru Moksha Karaka Alignment",
    sanskritName: "केतु-गुरु योग (मोक्ष कारक योग)",
    deepPsychology: "The quintessential alignment of ancient spiritual wisdom, non-dual philosophy, and true monastic detachment.",
    widePsychology: "Natural spiritual teacher, sage, astrologer, and guide who radiates calm philosophical clarity.",
    lifeTriggers: "Early disillusionment with materialistic dogmas; lifelong pursuit of liberation (Moksha) and sacred scriptures.",
    superpower: "Unshakable spiritual grounding and deep mastery of higher metaphysics.",
    vulnerability: "Impatience with worldly practicalities and financial responsibilities.",
    remedies: [
      "Study the Bhagavad Gita or Upanishads regularly.",
      "Honor genuine saints and spiritual preceptors.",
      "Donate yellow flowers and books to spiritual aspirants.",
    ],
  },
  Venus: {
    yogaName: "Ketu-Shukra Spiritualized Love Alignment",
    sanskritName: "केतु-शुक्र योग (अनासक्त प्रेम योग)",
    deepPsychology: "Detachment from superficial physical lust; yearning for a soul-deep, transcendent spiritual connection in love.",
    widePsychology: "Profound talent in sacred art, classical devotional music, and subtle aesthetic creations.",
    lifeTriggers: "Disappointments in shallow romantic encounters until encountering a true spiritual companion.",
    superpower: "Unconditional, non-possessive love and devotion.",
    vulnerability: "Romantic disillusionment and feeling fundamentally misunderstood by casual partners.",
    remedies: [
      "Worship Goddess Mahalakshmi with white lotus flowers.",
      "Practice unconditional generosity without expecting reciprocal praise.",
      "Maintain clear emotional hygiene and transparent marital dialogue.",
    ],
  },
  Saturn: {
    yogaName: "Ketu-Shani Ascetic Discipline Alignment",
    sanskritName: "केतु-शनि योग (वैराग्य तपस्या योग)",
    deepPsychology: "Austere, monk-like discipline; comfortable with solitude, minimal possessions, and grueling labor.",
    widePsychology: "Incredible mastery in deep scientific research, historical archives, archaeological restoration, and ascetic contemplation.",
    lifeTriggers: "Feeling like an outsider in conventional social circles; profound breakthrough in the second half of life.",
    superpower: "Total fearlessness in the face of poverty, solitude, and worldly loss.",
    vulnerability: "Severe social isolation, pessimism, and emotional numbness.",
    remedies: [
      "Serve food to stray black dogs on Saturdays.",
      "Chant the Shiva Mahamrityunjaya Mantra regularly.",
      "Engage in silent selfless service (Karmayoga) in your local community.",
    ],
  },
};

/**
 * Detects and evaluates all Rahu and Ketu conjunctions in a natal chart.
 */
export function detectRahuConjunctions(natalEphemeris: EphemerisResult): NodalConjunctionReport {
  const conjunctions: RahuConjunctionProfile[] = [];
  const planets = natalEphemeris.planets;

  const rahu = planets.Rahu;
  const ketu = planets.Ketu;

  const targetPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  if (rahu) {
    const rahuSign = Math.floor(rahu.siderealLongitude / 30);
    const rahuHouse = rahu.house || 1;

    for (const pName of targetPlanets) {
      const p = planets[pName];
      if (!p) continue;

      const pSign = Math.floor(p.siderealLongitude / 30);
      const isSameSign = pSign === rahuSign;

      let lonDiff = Math.abs(rahu.siderealLongitude - p.siderealLongitude);
      if (lonDiff > 180) lonDiff = 360 - lonDiff;

      // Evaluate conjunction if in same sign or within 12 degrees
      if (isSameSign || lonDiff <= 12.0) {
        let potencyTier: ConjunctionPotencyTier = "Same Sign (Non-Orb Conjunction)";
        let potencyScore = 50;

        if (lonDiff <= 3.5) {
          potencyTier = "Deep Eclipse / Exact Fusion (<= 3.5°)";
          potencyScore = 95;
        } else if (lonDiff <= 7.0) {
          potencyTier = "Potent Conjunction (3.5° - 7.0°)";
          potencyScore = 80;
        } else if (lonDiff <= 12.0) {
          potencyTier = "Wide Field Influence (7.0° - 12.0°)";
          potencyScore = 65;
        }

        const arch = RAHU_ARCHETYPES[pName];
        if (arch) {
          conjunctions.push({
            id: `rahu_${pName.toLowerCase()}`,
            node: "Rahu",
            conjoinedPlanet: pName,
            yogaName: arch.yogaName,
            sanskritName: arch.sanskritName,
            signIndex: rahuSign,
            signName: RASHI_NAMES[rahuSign]?.englishName || "Aries",
            house: rahuHouse,
            exactOrbDegrees: Math.round(lonDiff * 100) / 100,
            potencyTier,
            potencyScore,
            psychologicalImpact: lonDiff <= 3.5 ? arch.deepPsychology : arch.widePsychology,
            lifeEventsAndTriggers: arch.lifeTriggers,
            signatureSuperpower: arch.superpower,
            vulnerabilityToWatch: arch.vulnerability,
            shastricRemedies: arch.remedies,
          });
        }
      }
    }
  }

  if (ketu) {
    const ketuSign = Math.floor(ketu.siderealLongitude / 30);
    const ketuHouse = ketu.house || 1;

    for (const pName of targetPlanets) {
      const p = planets[pName];
      if (!p) continue;

      const pSign = Math.floor(p.siderealLongitude / 30);
      const isSameSign = pSign === ketuSign;

      let lonDiff = Math.abs(ketu.siderealLongitude - p.siderealLongitude);
      if (lonDiff > 180) lonDiff = 360 - lonDiff;

      if (isSameSign || lonDiff <= 12.0) {
        let potencyTier: ConjunctionPotencyTier = "Same Sign (Non-Orb Conjunction)";
        let potencyScore = 45;

        if (lonDiff <= 3.5) {
          potencyTier = "Deep Eclipse / Exact Fusion (<= 3.5°)";
          potencyScore = 90;
        } else if (lonDiff <= 7.0) {
          potencyTier = "Potent Conjunction (3.5° - 7.0°)";
          potencyScore = 75;
        } else if (lonDiff <= 12.0) {
          potencyTier = "Wide Field Influence (7.0° - 12.0°)";
          potencyScore = 60;
        }

        const arch = KETU_ARCHETYPES[pName];
        if (arch) {
          conjunctions.push({
            id: `ketu_${pName.toLowerCase()}`,
            node: "Ketu",
            conjoinedPlanet: pName,
            yogaName: arch.yogaName,
            sanskritName: arch.sanskritName,
            signIndex: ketuSign,
            signName: RASHI_NAMES[ketuSign]?.englishName || "Aries",
            house: ketuHouse,
            exactOrbDegrees: Math.round(lonDiff * 100) / 100,
            potencyTier,
            potencyScore,
            psychologicalImpact: lonDiff <= 3.5 ? arch.deepPsychology : arch.widePsychology,
            lifeEventsAndTriggers: arch.lifeTriggers,
            signatureSuperpower: arch.superpower,
            vulnerabilityToWatch: arch.vulnerability,
            shastricRemedies: arch.remedies,
          });
        }
      }
    }
  }

  // Sort by highest potency
  conjunctions.sort((a, b) => b.potencyScore - a.potencyScore);

  const highestPotency = conjunctions.length > 0 ? conjunctions[0] : null;
  const rahuCount = conjunctions.filter((c) => c.node === "Rahu").length;
  const ketuCount = conjunctions.filter((c) => c.node === "Ketu").length;

  let karmicSummary = "No tight planetary conjunctions with the Lunar Nodes (Rahu/Ketu). The nodal axis functions primarily through its house polarities.";
  if (highestPotency) {
    karmicSummary = `The primary karmic axis is concentrated by ${highestPotency.node} conjoining ${highestPotency.conjoinedPlanet} (${highestPotency.yogaName}) in House ${highestPotency.house} (${highestPotency.signName}) at an orb of ${highestPotency.exactOrbDegrees}°. This acts as your life's intense growth crucible and signature superpower arena.`;
  }

  return {
    hasRahuConjunctions: rahuCount > 0,
    hasKetuConjunctions: ketuCount > 0,
    totalConjunctionsCount: conjunctions.length,
    highestPotencyConjunction: highestPotency,
    conjunctions,
    karmicEvolutionSummary: karmicSummary,
  };
}
