/**
 * Lifestyle Remedies as a Way of Life & The 40-Day Rule Engine
 * 
 * Based on classical shastric conduct (Aachara Jyotish) and Session 41:
 * "Making Remedies in Astrology A Way of Life"
 * 
 * Core Philosophy:
 * - Moving Beyond Mere Rituals: Conduct-based remedies integrated as non-negotiable daily reflexes (brushing teeth / dressing up).
 * - The 40-Day Rule: Consistent discipline for 40 consecutive days triggers noticeable positive shifts on the 41st day.
 * - Complete 9-Graha practical conduct protocols (water before leaving home, waking before dawn, sharing sweets, digital self-control,
 *   curd curfew at night, sibling integrity, wire detanglement, bathroom hygiene, hair care, and joyful laughter).
 * - Chart-Specific Personalization: Prioritizes daily habits based on active Dasha, combust/debilitated grahas, and Dusthana placements.
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";

// ==========================================
// 1. DATA TYPES & INTERFACES
// ==========================================

export type RemedyPriorityLevel = "CRITICAL PRIORITY (Active Dasha / Afflicted)" | "HIGH PRIORITY (Dusthana / Karmic Friction)" | "FOUNDATIONAL DAILY HABIT (Universal Protocol)";

export interface GrahaLifestyleProtocol {
  planet: string;
  sanskritName: string;
  significations: string;
  coreDailyHabits: string[];
  strictProhibitions: string[];
  shastricMechanism: string;
  fortyDayExpectedShift: string;
  diagnosticAfflictionSigns: string[];
  priorityLevel: RemedyPriorityLevel;
  personalizationReason: string;
}

export interface FortyDayHabitTrackerItem {
  dayNumber: number;
  habitsChecked: string[];
  milestoneNote?: string;
}

export interface PersonalizedLifestyleRemediesDossier {
  corePhilosophy: {
    title: string;
    description: string;
    the40DayRule: string;
    habitAnalogy: string;
  };
  personalizedPriorityHabits: GrahaLifestyleProtocol[];
  allGrahaProtocols: Record<string, GrahaLifestyleProtocol>;
  masterDossierSummary: string;
}

// ==========================================
// 2. KNOWLEDGE BASE: 9-GRAHA LIFESTYLE PROTOCOLS
// ==========================================

const BASE_GRAHA_PROTOCOLS: Record<string, Omit<GrahaLifestyleProtocol, "priorityLevel" | "personalizationReason">> = {
  Moon: {
    planet: "Moon",
    sanskritName: "Chandra",
    significations: "Mind, emotional memory, hydration, maternal grace, psychological peace.",
    coreDailyHabits: [
      "Always drink a full glass of fresh water immediately before stepping out of the house.",
      "Offer fresh drinking water to travelers, delivery persons, guests, and thirsty animals throughout the day.",
      "Consciously conserve water: turn off the tap while brushing teeth; minimize water wastage during bathing.",
    ],
    strictProhibitions: [
      "Strict zero water wastage: Never allow leaking taps or running faucets to go unrepaired in the household.",
      "Never disrespect or emotionally isolate one's mother or maternal figures.",
    ],
    shastricMechanism: "Water is the physical conductor of lunar consciousness (Chitta). Conserving and sharing water directly calms emotional fluctuations and stabilizes fluctuating brain chemistry.",
    fortyDayExpectedShift: "Noticeable reduction in restlessness, chronic overthinking, and insomnia; deeper emotional equilibrium and soothing relationship interactions starting on the 41st day.",
    diagnosticAfflictionSigns: [
      "Restless insomnia, frequent mood swings, phobias of drowning or abandonment.",
      "Wasting water casually, recurring disputes with mother, digestive/fluid retention issues.",
    ],
  },
  Sun: {
    planet: "Sun",
    sanskritName: "Surya",
    significations: "Soul purpose (Atman), vitality, leadership, government favor, societal prestige.",
    coreDailyHabits: [
      "Wake up at least 15 minutes before sunrise every morning without exception.",
      "Step outside to offer salutations to the morning sun (Surya Namaskar / Arghya) within 1 hour of dawn.",
      "Keep promises and maintain punctual reliability in all professional and personal commitments.",
    ],
    strictProhibitions: [
      "Never sleep past sunrise: Waking up late continuously depletes solar vitality, willpower, and societal reputation.",
      "Never disrespect the father, state authority, or lineage patriarchs.",
    ],
    shastricMechanism: "The Sun represents the cosmic clock and life-force (Prana). Aligning the biological circadian rhythm with the pre-dawn Brahma Muhurta directly recharges the Solar Plexus chakra.",
    fortyDayExpectedShift: "Surge in physical stamina, clear decision-making capacity, heightened respect from peers and superiors, and unshakeable inner confidence.",
    diagnosticAfflictionSigns: [
      "Chronic lethargy, lack of willpower, frequent clashes with superiors/father, delayed recognition for hard work.",
    ],
  },
  Jupiter: {
    planet: "Jupiter",
    sanskritName: "Guru",
    significations: "Divine wisdom, expansion, dharma, teachers, spiritual grace, children, wealth.",
    coreDailyHabits: [
      "Share sweets, sweet fruits, or sweet food with someone daily (Jupiter thrives on sweetness and nourishment).",
      "Serve, respect, and feed wise elders, scholars, priests, and teachers (Gurus) on any day of the week (not limited to Thursdays).",
      "Dedicate at least 15 minutes daily to sacred reading, philosophical study, or mentoring a younger seeker.",
    ],
    strictProhibitions: [
      "Never ridicule, demean, or insult any spiritual teacher, scripture, or moral elder.",
      "Avoid stinginess in sharing knowledge or food with genuine seekers.",
    ],
    shastricMechanism: "Jupiter is the celestial preceptor (Brihaspati). Sharing sweetness and honoring wisdom creators harmonizes the ether element (Akasha Tattva), inviting serendipitous cosmic blessings.",
    fortyDayExpectedShift: "Expansion of financial opportunities, clarity in life direction, harmonious relations with mentors, and inner moral tranquility.",
    diagnosticAfflictionSigns: [
      "Cynicism towards spiritual truth, strained relations with teachers, financial stagnation, liver or weight issues.",
    ],
  },
  Saturn: {
    planet: "Saturn",
    sanskritName: "Shani",
    significations: "Cosmic justice, discipline, penance (Tapa), reality boundaries, endurance, service.",
    coreDailyHabits: [
      "Digital Self-Control: When presented with distracting, toxic, or base content online, consciously exercise will to choose constructive learning (science, tech, astrology, philosophy).",
      "Home Hygiene: Never bring outside street shoes/footwear deep inside the home sanctuary; remove them at the entrance.",
      "Care of Elders & Hair: Maintain natural hair health; personally massage the head and feet of household elders with pure mustard or sesame oil.",
      "Treat manual laborers, service staff, cleaners, and blue-collar workers with utmost dignity and prompt payment.",
    ],
    strictProhibitions: [
      "Stay completely away from alcohol and recreational intoxicants (Vyasan) — alcohol instantly invites acute Saturnian wrath.",
      "Avoid procrastination, broken agreements, and messy accumulation of obsolete junk in domestic storage.",
    ],
    shastricMechanism: "Saturn demands authentic penance (Tapa), strict discipline, and service to the vulnerable. Restraining digital vices and removing street dust from the home preserves domestic energetic purity.",
    fortyDayExpectedShift: "Deep inner resilience against anxiety, breakthrough in long-stalled career projects, relief from chronic fatigue, and unshakeable professional stability.",
    diagnosticAfflictionSigns: [
      "Analysis paralysis, chronic delays in career, joint or hair issues, indulgence in escapist digital or substance habits.",
    ],
  },
  Venus: {
    planet: "Venus",
    sanskritName: "Shukra",
    significations: "Refinement, marital bliss, beauty, vehicles, artistic creativity, relationship harmony.",
    coreDailyHabits: [
      "Feed fresh curd/yogurt to a woman or a cow.",
      "Donate white items (rice, milk, sugar, white clothing) on Fridays or whenever feasible.",
      "Maintain absolute integrity, transparency, and loyalty in romantic and personal relationships.",
      "Wear clean, well-ironed, and fragrant clothing; maintain aesthetic domestic tidiness.",
    ],
    strictProhibitions: [
      "STRICT CURFEW: Never consume curd/yogurt at night (Do NOT consume curd at night — damages Venusian vitality, creates Ama toxins, and weakens marital harmony).",
      "Never mistreat, disrespect, or exploit women in any personal or professional sphere.",
    ],
    shastricMechanism: "Venus governs the Sanjeevani Vidya (cellular restoration and refined devotion). Feeding curd during daylight honors the nurturing goddess archetype, while avoiding it at night prevents phlegmatic metabolic stagnation.",
    fortyDayExpectedShift: "Restoration of romantic and domestic harmony, enhanced personal charm, elimination of financial leakages, and aesthetic clarity.",
    diagnosticAfflictionSigns: [
      "Marital discord, frequent financial losses through reckless indulgence, skin/reproductive disorders, untidy personal presentation.",
    ],
  },
  Mars: {
    planet: "Mars",
    sanskritName: "Mangala",
    significations: "Courage, physical vitality, land, real estate, brotherly alliances, tactical defense.",
    coreDailyHabits: [
      "Cultivate warm brotherly love, open communication, and supportive relations with siblings and teammates.",
      "Channel martial fire through rigorous daily physical training, strength workouts, or martial arts.",
      "Act as a protective shield for those who cannot defend themselves.",
    ],
    strictProhibitions: [
      "Never cast an envious eye or illegally encroach on anyone's land, property, or hard-earned wealth.",
      "Never view any woman with predatory, dishonorable, or exploitative intent.",
      "Avoid angry verbal outbursts or vengeful retaliation during disputes.",
    ],
    shastricMechanism: "Mars governs blood, muscle, and property. Encroaching on another's territory or squabbling with brothers mutates martial courage into destructive litigation and physical accidents.",
    fortyDayExpectedShift: "Rapid resolution of property or contractual disputes, surge in athletic vitality, triumph over competitors, and peace among siblings.",
    diagnosticAfflictionSigns: [
      "Litigations over property, bitter quarrels with brothers, high blood pressure, sudden rash outbursts, impulsive injuries.",
    ],
  },
  Rahu: {
    planet: "Rahu",
    sanskritName: "Rahu",
    significations: "Worldly ambition, modern technology, illusion, sudden transformation, foreign realms.",
    coreDailyHabits: [
      "Keep the bathroom, toilet, and drainage areas immaculately clean, completely dry, and shining.",
      "Untangle Wires: Never keep tangled phone chargers, electrical cords, or messy cables in corners of the home; keep all wiring neatly wound and organized.",
      "Bucket & Mug Rule: Never leave a mug submerged inside a filled water bucket in the bathroom; always invert the bucket or keep the mug placed neatly outside.",
      "Hairbrush Rule: Clean trapped loose hair from hairbrushes and combs immediately after grooming (neutralizes joint Shani-Rahu afflictions).",
    ],
    strictProhibitions: [
      "Never accumulate broken electronic gadgets, obsolete cables, or cracked glassware in the home.",
      "Never engage in deceit, counterfeit dealings, or online get-rich-quick scams.",
    ],
    shastricMechanism: "Rahu operates through tangled illusions, damp dark spaces, and electrical chaos. Tidying cables and drying bathrooms instantly removes Rahu's magnetic confusion and mental smoke.",
    fortyDayExpectedShift: "Immediate lifting of brain fog, cessation of irrational night terrors, sudden breakthrough in technology/foreign ventures, and clear mental focus.",
    diagnosticAfflictionSigns: [
      "Severe anxiety, obsessive screen scrolling, living in cluttered rooms with tangled cords, sudden unexplained financial drains.",
    ],
  },
  Ketu: {
    planet: "Ketu",
    sanskritName: "Ketu",
    significations: "Spiritual liberation (Moksha), detachment, past-life intuition, healing, silence.",
    coreDailyHabits: [
      "Practice intentional stillness: Pause at any point during the day, close your eyes for 3 to 5 minutes, and enter silence.",
      "Chant 'Om' or 'Om Namah Shivaya', focusing single-mindedly on Lord Shiva as the supreme dissolver of karmic knots.",
      "Feed stray dogs (especially black-and-white or multicolored dogs) with bread or milk.",
    ],
    strictProhibitions: [
      "Never hoard resentments or obsessively cling to relationships or material outcomes that universe is dissolving.",
      "Avoid cruel treatment of stray animals or monastics.",
    ],
    shastricMechanism: "Ketu is the headless mystic representing severance of material illusion. Dedicated moments of silence and Shiva contemplation release subconscious guilt and past-life karmic burdens.",
    fortyDayExpectedShift: "Profound inner peace, awakening of sharp intuitive foresight, detachment from toxic drama, and effortless meditation depth.",
    diagnosticAfflictionSigns: [
      "Senseless paranoia, deep feelings of emptiness, unexplained skin allergies, sudden detachment leading to depression.",
    ],
  },
  Mercury: {
    planet: "Mercury",
    sanskritName: "Budha",
    significations: "Intellect, commerce, verbal wit, nervous system, youth, mathematics, joyful play.",
    coreDailyHabits: [
      "Feed green fodder, fresh spinach (Palak), or chapatis to cows.",
      "Love, feed, and serve young children; encourage their play and learning.",
      "Cultivate a lighthearted, cheerful, and jovial demeanor, consciously resisting bouts of sullenness or intellectual cynicism.",
      "Meditate on Lord Vishnu around sunrise and sunset with the mantra 'Om Budhaya Namaha'.",
      "The Ultimate Mercury Remedy: Bring genuine joy, laughter, and uplifting happiness into someone's day.",
    ],
    strictProhibitions: [
      "Never use biting sarcasm, cruel mockery, or intellectual deceit to belittle others.",
      "Avoid gambling, forgery, or deceptive commercial accounting.",
    ],
    shastricMechanism: "Mercury is the eternal youth (Kumara). Joy, genuine laughter, and generosity towards children and holy cows directly balance the neurochemistry and sharpen commercial intellect.",
    fortyDayExpectedShift: "Clear commercial breakthroughs, magnetic speech eloquence, relief from nervous anxiety, and spontaneous joyful optimism.",
    diagnosticAfflictionSigns: [
      "Nervous stutter or harsh speech, cynicism, business misunderstandings, insomnia from anxious mental chatter.",
    ],
  },
};

// ==========================================
// 3. PERSONALIZATION ENGINE
// ==========================================

export function evaluateLifestyleRemediesWayOfLife(
  natalEphem: EphemerisResult,
  currentDashaLord?: string
): PersonalizedLifestyleRemediesDossier {
  const allProtocols: Record<string, GrahaLifestyleProtocol> = {};
  const personalizedPriority: GrahaLifestyleProtocol[] = [];

  const sunData = natalEphem.planets.Sun;
  const sunLon = sunData ? sunData.siderealLongitude : 0;

  // Debilitation signs for classical planets
  const DEBILITATION_RASHIS: Record<string, number> = {
    Sun: 6,    // Libra
    Moon: 7,   // Scorpio
    Mars: 3,   // Cancer
    Mercury: 11,// Pisces
    Jupiter: 9, // Capricorn
    Venus: 5,  // Virgo
    Saturn: 0, // Aries
    Rahu: 8,   // Sagittarius (or Scorpio)
    Ketu: 2,   // Gemini (or Taurus)
  };

  const planetNames = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  for (const pName of planetNames) {
    const base = BASE_GRAHA_PROTOCOLS[pName];
    if (!base) continue;

    const pData = natalEphem.planets[pName];
    let priority: RemedyPriorityLevel = "FOUNDATIONAL DAILY HABIT (Universal Protocol)";
    const reasons: string[] = [];

    if (pData) {
      const house = pData.house;
      const rashiIdx = Math.floor(pData.siderealLongitude / 30);

      // Check Active Dasha
      if (currentDashaLord && currentDashaLord.toLowerCase().includes(pName.toLowerCase())) {
        priority = "CRITICAL PRIORITY (Active Dasha / Afflicted)";
        reasons.push(`Active Mahadasha / Antardasha Ruler (${pName})`);
      }

      // Check Debilitation
      if (DEBILITATION_RASHIS[pName] !== undefined && rashiIdx === DEBILITATION_RASHIS[pName]) {
        priority = "CRITICAL PRIORITY (Active Dasha / Afflicted)";
        reasons.push(`Debilitated (Neecha) in ${RASHI_NAMES[rashiIdx].englishName}`);
      }

      // Check Combustion (within 8 degrees of Sun, excluding Sun/Rahu/Ketu)
      if (pName !== "Sun" && pName !== "Rahu" && pName !== "Ketu") {
        const diff = Math.abs(pData.siderealLongitude - sunLon);
        const normDiff = Math.min(diff, 360 - diff);
        if (normDiff <= 8.5) {
          priority = "CRITICAL PRIORITY (Active Dasha / Afflicted)";
          reasons.push(`Combust (Asta) within ${normDiff.toFixed(1)}° of Sun`);
        }
      }

      // Check Dusthana Placements (Houses 6, 8, 12)
      if (house === 6 || house === 8 || house === 12) {
        if (priority !== "CRITICAL PRIORITY (Active Dasha / Afflicted)") {
          priority = "HIGH PRIORITY (Dusthana / Karmic Friction)";
        }
        reasons.push(`Placed in Dusthana House ${house}`);
      }
    }

    const reasonStr = reasons.length > 0
      ? `Chart-Specific Activation: ${reasons.join(", ")}`
      : "Foundational Universal Lifestyle Discipline";

    const fullProtocol: GrahaLifestyleProtocol = {
      ...base,
      priorityLevel: priority,
      personalizationReason: reasonStr,
    };

    allProtocols[pName] = fullProtocol;

    if (priority.startsWith("CRITICAL") || priority.startsWith("HIGH")) {
      personalizedPriority.push(fullProtocol);
    }
  }

  // If no planets are critical/high, pick the Lagna Lord and Moon Lord
  if (personalizedPriority.length === 0) {
    const ascLord = RASHI_NAMES[Math.floor(natalEphem.ascendant.siderealLongitude / 30)].lord;
    const moonLord = natalEphem.planets.Moon ? RASHI_NAMES[Math.floor(natalEphem.planets.Moon.siderealLongitude / 30)].lord : "Sun";

    if (allProtocols[ascLord]) {
      allProtocols[ascLord].priorityLevel = "CRITICAL PRIORITY (Active Dasha / Afflicted)";
      allProtocols[ascLord].personalizationReason = "Ascendant Lord (Lagna Lord) Vitality Anchor";
      personalizedPriority.push(allProtocols[ascLord]);
    }
    if (allProtocols[moonLord] && !personalizedPriority.includes(allProtocols[moonLord])) {
      allProtocols[moonLord].priorityLevel = "HIGH PRIORITY (Dusthana / Karmic Friction)";
      allProtocols[moonLord].personalizationReason = "Moon Sign Dispositor (Mental Anchor)";
      personalizedPriority.push(allProtocols[moonLord]);
    }
  }

  // Master Dossier Summary
  const lines: string[] = [];
  lines.push("### 🌿 ASTROLOGICAL REMEDIES AS A WAY OF LIFE & THE 40-DAY RULE (SESSION 41)");
  lines.push("");
  lines.push(`**1. The Shastric Philosophy:**`);
  lines.push(`- Moving Beyond Mere Rituals: Astrological remedies are daily non-negotiable conduct reflexes (*Way of Life*), as essential as brushing teeth or getting dressed before stepping out.`);
  lines.push(`- **The 40-Day Rule:** Consistent discipline for 40 consecutive days produces noticeable positive shifts and tangible planetary favor starting on the **41st day**.`);
  lines.push("");
  lines.push(`**2. Native's Chart-Specific Priority Lifestyle Remedies:**`);
  for (const p of personalizedPriority) {
    lines.push(`- **${p.planet} (${p.sanskritName}) — [${p.priorityLevel}]**:`);
    lines.push(`  * *Trigger:* ${p.personalizationReason}`);
    lines.push(`  * *Core Daily Habit:* ${p.coreDailyHabits[0]}`);
    if (p.coreDailyHabits[1]) lines.push(`  * *Secondary Habit:* ${p.coreDailyHabits[1]}`);
    lines.push(`  * *Strict Prohibition:* ${p.strictProhibitions[0]}`);
    lines.push(`  * *40-Day Transformation:* ${p.fortyDayExpectedShift}`);
  }
  lines.push("");
  lines.push(`**3. Universal 9-Graha Conduct Protocols (Key Highlights):**`);
  lines.push(`- **Moon:** Drink water before leaving house; zero water wastage while brushing/bathing.`);
  lines.push(`- **Sun:** Wake up at least 15 min before sunrise (late waking erodes solar prestige).`);
  lines.push(`- **Jupiter:** Daily sharing of sweets; serve elders/Gurus every day (not just Thursdays).`);
  lines.push(`- **Saturn:** Digital self-control (constructive learning vs base distractions); complete alcohol abstinence; no street shoes inside home; massage elders' head/feet with oil.`);
  lines.push(`- **Venus:** Feed curd to cow/woman; NEVER consume curd at night; relationship fidelity.`);
  lines.push(`- **Mars:** Brotherly love with siblings; never encroach on land/property/wealth (litigations indicate Mars affliction).`);
  lines.push(`- **Rahu:** Bathroom & toilet dry/spotless; UNTANGLE WIRES (no messy cables); bucket & mug rule (never leave mug submerged in water bucket); clean hairbrushes immediately.`);
  lines.push(`- **Ketu:** Dedicated stillness/silence; chant Om / Om Namah Shivaya focusing on Shiva.`);
  lines.push(`- **Mercury:** Feed spinach/fodder to cows; serve children; cheerful demeanor; bring genuine laughter to someone's day.`);

  const masterSummary = lines.join("\n");

  return {
    corePhilosophy: {
      title: "Remedies as a Way of Life (Aachara Jyotish)",
      description: "While pujas, homas, and donations have their place, the most transformative astrological remedies are simple, practical habits integrated directly into daily conduct.",
      the40DayRule: "If these lifestyle habits are practiced with discipline consistently for 40 consecutive days, noticeable positive shifts and planetary favor will become visible starting from the 41st day.",
      habitAnalogy: "Remedies must become as non-negotiable as brushing your teeth, eating breakfast, or getting dressed before stepping outside.",
    },
    personalizedPriorityHabits: personalizedPriority,
    allGrahaProtocols: allProtocols,
    masterDossierSummary: masterSummary,
  };
}

export function generateLifestyleRemediesReport(
  natalEphem: EphemerisResult,
  currentDashaLord?: string
): PersonalizedLifestyleRemediesDossier {
  return evaluateLifestyleRemediesWayOfLife(natalEphem, currentDashaLord);
}
