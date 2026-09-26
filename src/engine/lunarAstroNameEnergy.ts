/**
 * Lunar Astro Name Vibrational Energy & Astro-Phonetics Engine
 * References:
 * - Deepanshu Giri (Lunar Astro: "The Energy in your NAME - Predict using name")
 * - Svara Shastra & Varna Mandala (Akshara Matrika Jyotish)
 * - Classical Nadi Name Linkage & Naisargika Graha Karakatwas
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";

export interface NamePhoneticRule {
  id: string;
  pattern: RegExp;
  name: string;
  primaryPlanets: string[];
  secondaryPlanets: string[];
  archetype: string;
  psychologicalTraits: string;
  relationshipPattern: string;
  careerTendency: string;
  karmicChallenge: string;
  ancestralProtection: boolean;
  predictedChartPlacements: string[];
}

export interface NameVibrationalProfile {
  inputName: string;
  matchedRuleId?: string;
  primaryPlanets: string[];
  secondaryPlanets: string[];
  archetypeName: string;
  acousticSummary: string;
  psychologicalBlueprint: string;
  relationshipTendency: string;
  careerAndServiceVector: string;
  karmicChallenge: string;
  ancestralShieldStatus: boolean;
  predictedChartPlacements: string[];
  phoneticBreakdown: {
    vowelsSolar: number;
    semivowelsLunar: number;
    gutturalsMars: number;
    palatalsVenus: number;
    retroflexMercury: number;
    dentalsJupiter: number;
    labialsSaturn: number;
    aspiratesNodal: number;
  };
}

export interface ChartNameCompatibility {
  name: string;
  congruenceScore: number; // 0 to 100
  harmonyStatus: "Harmonious Resonance" | "Dynamic Tension" | "Spiritual Catalyst";
  resonanceWithLagnaLord: string;
  resonanceWithMoon: string;
  resonanceWith7thHouse: string;
  overallAudit: string;
  recommendedNameAdjustment?: string;
}

// ==========================================
// 1. SIGNATURE LUNAR ASTRO PHONETIC RULES
// ==========================================

export const SIGNATURE_NAME_RULES: NamePhoneticRule[] = [
  {
    id: "ANIKET_ARCHETYPE",
    pattern: /^aniket/i,
    name: "Aniket (The Unhoused Ascetic Sovereign)",
    primaryPlanets: ["Sun", "Mars"],
    secondaryPlanets: ["Ketu"],
    archetype: "The Unhoused Ascetic Warrior (अनिकेत - Lord Shiva Epithet)",
    psychologicalTraits:
      "Fierce inner independence, high self-esteem, deep allergy to micromanagement or subjugation. Highly dynamic, quick-acting, warrior spirit.",
    relationshipPattern:
      "Tends to carry restlessness in fixed domestic spaces; requires a partner who respects extreme personal autonomy and spiritual privacy.",
    careerTendency:
      "Thrives in self-directed enterprises, technology leadership, military/defense, surgical professions, or trailblazing ventures.",
    karmicChallenge:
      "Struggle to feel anchored in any one physical home; potential domestic friction if forced into rigid, traditional routines.",
    ancestralProtection: false,
    predictedChartPlacements: [
      "Prominent Sun and Mars conjunction, mutual aspect, or strong Parivartana.",
      "Aries, Scorpio, or Leo influencing Lagna or the 10th house.",
      "Ketu or Mars influencing the 4th house (unsettled domestic roots / living away from ancestral home).",
    ],
  },
  {
    id: "RAVI_ARCHETYPE",
    pattern: /^ravi/i,
    name: "Ravi (The Radiant Primordial Sun)",
    primaryPlanets: ["Sun"],
    secondaryPlanets: ["Mars"],
    archetype: "The Radiant Sovereign (रवि - Pure Solar Ignition)",
    psychologicalTraits:
      "Straightforward, concise, proud, honorable, and transparent. Dislikes manipulative politics; values clarity, duty, and direct speech.",
    relationshipPattern:
      "Warm and protective, yet ego boundaries can create distance unless mutual respect is unconditional.",
    careerTendency:
      "Executive governance, administrative authority, public-facing leadership, medicine, or state contracts.",
    karmicChallenge:
      "Combative pride or feeling burdened by having to be the sole pillar of strength for everyone around them.",
    ancestralProtection: true,
    predictedChartPlacements: [
      "Strong Sun positioned in Kendra (1st, 4th, 7th, 10th) or 9th/11th house.",
      "Sun in own sign (Leo) or exalted in Aries; Sun as Atmakaraka.",
      "Paternal lineage carries high public standing or heavy karmic duty.",
    ],
  },
  {
    id: "PRIYANKA_PREETI_ROOT",
    pattern: /^(priy|pree|preti|preet)/i,
    name: "Priyanka / Preeti (The Devoted Heart & Karmic Mirror)",
    primaryPlanets: ["Venus", "Ketu"],
    secondaryPlanets: ["Moon"],
    archetype: "The Karmic Mirror of Devotion (प्रिया / प्रीति - Affinity & Lineage Binding)",
    psychologicalTraits:
      "Deeply empathetic, loving, intuitive, emotionally generous, but prone to profound psychological sensitivity and unspoken emotional hurt.",
    relationshipPattern:
      "Statistically experiences notable relationship friction, self-sacrifice, or feeling misunderstood by partners; carries ancestral karmic balancing in partnership.",
    careerTendency:
      "Design, diplomacy, luxury arts, healthcare, counselling, psychology, teaching, or human resources.",
    karmicChallenge:
      "Over-giving in relationships; carrying emotional debts from past lineage dynamics; learning healthy boundaries.",
    ancestralProtection: false,
    predictedChartPlacements: [
      "Venus in conjunction with or aspected by Ketu, Saturn, or Rahu.",
      "7th house contains dual or sensitive influences (e.g. Venus in Cancer/Virgo or 6th/8th axis from Moon).",
      "Ancestral mother-lineage (*Matri Rina*) lessons around marriage and emotional autonomy.",
    ],
  },
  {
    id: "SONAL_ARCHETYPE",
    pattern: /^sonal/i,
    name: "Sonal (The Golden Vessel of Wisdom)",
    primaryPlanets: ["Jupiter"],
    secondaryPlanets: ["Sun", "Venus"],
    archetype: "The Golden Disciple (सोनल - Quiet Receptive Wisdom)",
    psychologicalTraits:
      "Quiet, dignified, sharp contemplative understanding, absorbs profound teachings without argumentative noise, naturally philosophical.",
    relationshipPattern:
      "Values intellectual and ethical alignment; seeks an honorable partner with high moral character and mutual respect.",
    careerTendency:
      "Education, financial strategy, legal advisory, academia, spiritual research, or corporate stewardship.",
    karmicChallenge:
      "Can internalize grief or hide personal vulnerabilities beneath a calm, composed exterior.",
    ancestralProtection: true,
    predictedChartPlacements: [
      "Jupiter aspecting Lagna, Moon, or placed in 1st/5th/9th Trikona houses.",
      "Strong Sagittarius or Pisces emphasis in D-1 or D-9 Navamsha.",
      "High natural capacity for Saraswati / Medha Shakti (rapid learning).",
    ],
  },
  {
    id: "ALOK_ARCHETYPE",
    pattern: /^alok/i,
    name: "Alok (The Tireless Servant of Light)",
    primaryPlanets: ["Saturn"],
    secondaryPlanets: ["Sun"],
    archetype: "The Pillar of Duty (आलोक - Saturnian Endurance & Service)",
    psychologicalTraits:
      "Grounded, humble, diligent, unpretentious, patient, with an immense capacity for sustained labor and loyalty.",
    relationshipPattern:
      "Slow to open up emotionally, highly steadfast once committed; supports partner through practical actions rather than flamboyant words.",
    careerTendency:
      "Back-office operations, heavy engineering, public sector, judicial service, logistics, civil administration, or grassroots organizing.",
    karmicChallenge:
      "Carrying heavy responsibilities early in life; danger of burnout or feeling underappreciated for silent contributions.",
    ancestralProtection: false,
    predictedChartPlacements: [
      "Saturn influencing Lagna, Lagna Lord, or the 10th house of Karma.",
      "Capricorn or Aquarius rising, or Saturn-Sun interaction requiring reconciliation of humility and authority.",
      "Path of steady elevation after age 36 (Saturn maturation).",
    ],
  },
  {
    id: "SACHIN_ARCHETYPE",
    pattern: /^sachin/i,
    name: "Sachin (The Radiant Artist & Relational Crucible)",
    primaryPlanets: ["Moon", "Venus"],
    secondaryPlanets: ["Mercury"],
    archetype: "The Charismatic Artisan (सचिन - Lord Indra / Moon-Venus Magnetism)",
    psychologicalTraits:
      "Immense aesthetic charm, magnetic public personality, highly artistic, sharp reflexes, emotionally expressive, intuitive.",
    relationshipPattern:
      "Statistically prone to complex marital dynamics, emotional expectations, sensitivity, or trials in partnership.",
    careerTendency:
      "Sports, entertainment, arts, luxury branding, public media, creative writing, or culinary mastery.",
    karmicChallenge:
      "Fluctuating emotional moods; balancing public adulation with private marital peace.",
    ancestralProtection: false,
    predictedChartPlacements: [
      "Moon and Venus in 6/8 disposition or conjoined in dual signs.",
      "Venus or 7th Lord placed in sensitive nakshatras (Ashlesha, Jyeshtha, or Moola).",
      "High public appeal combined with private relationship crucible.",
    ],
  },
  {
    id: "INDER_SUFFIX_SHIELD",
    pattern: /inder$/i,
    name: "-inder Suffix (The Indra Sovereign Shield)",
    primaryPlanets: ["Jupiter", "Sun"],
    secondaryPlanets: ["Mars"],
    archetype: "The Sovereign Lineage Guardian (-इन्द्र Divine Protector)",
    psychologicalTraits:
      "Natural sense of family duty, elder sibling psychology, moral authority, protective instincts over loved ones.",
    relationshipPattern:
      "Acts as a protective umbrella for partner and extended family; takes responsibility for generational stability.",
    careerTendency:
      "Management, public institutions, police/defense, community leadership, family business expansion.",
    karmicChallenge:
      "Burdened by extended family demands; tendency to neglect personal desires for family reputation.",
    ancestralProtection: true,
    predictedChartPlacements: [
      "Jupiter or Sun strongly placed in 1st, 9th, or 10th house.",
      "Pitru Punya (ancestral blessings) evident in the 9th house or D-9.",
      "Natural buffer against acute transit shocks through ancestral grace.",
    ],
  },
  {
    id: "PREET_SUFFIX_SHIELD",
    pattern: /preet$/i,
    name: "-preet Suffix (The Divine Love Armor)",
    primaryPlanets: ["Jupiter", "Moon"],
    secondaryPlanets: ["Venus"],
    archetype: "The Devotional Armor (-प्रीत Divine Love & Grace)",
    psychologicalTraits:
      "Heart-centered warmth, high emotional resilience, peaceful demeanor, spiritual devotion, instinctive generosity.",
    relationshipPattern:
      "Loyal, affectionate, seeks deep soul-companionship; radiates a calming presence in domestic life.",
    careerTendency:
      "Counseling, humanitarian service, creative arts, healthcare, education, or spiritual ministry.",
    karmicChallenge:
      "Susceptibility to being taken advantage of by selfish individuals due to an innocent, forgiving nature.",
    ancestralProtection: true,
    predictedChartPlacements: [
      "Benefic Moon aspected by Jupiter (Gaja Kesari) or in watery/dharmic signs.",
      "4th house of peace (Sukha Bhava) well fortified.",
      "Spiritual grace shielding against depression and toxic associations.",
    ],
  },
];

// ==========================================
// 2. UNIVERSAL PHONETIC VARNA DECOMPOSITION
// ==========================================

export function decomposeNameVarnaPhonetics(name: string) {
  const clean = name.toLowerCase().replace(/[^a-z]/g, "");

  const vowels = (clean.match(/[aeiou]/g) || []).length; // Sun
  const semivowels = (clean.match(/[yrlvw]/g) || []).length; // Moon
  const gutturals = (clean.match(/[kg]/g) || []).length; // Mars
  const retroflex = (clean.match(/[tdn]/g) || []).length; // Mercury
  const palatals = (clean.match(/[cjshz]/g) || []).length; // Venus
  const dentals = (clean.match(/[th|dh]/g) || []).length; // Jupiter
  const labials = (clean.match(/[pbmf]/g) || []).length; // Saturn
  const aspirates = (clean.match(/[hx]/g) || []).length; // Rahu/Ketu

  return {
    vowelsSolar: vowels,
    semivowelsLunar: semivowels,
    gutturalsMars: gutturals,
    palatalsVenus: palatals,
    retroflexMercury: retroflex,
    dentalsJupiter: dentals,
    labialsSaturn: labials,
    aspiratesNodal: aspirates,
  };
}

// ==========================================
// 3. HOROSCOPE-FREE NAME ANALYSIS FUNCTION
// ==========================================

export function analyzeNameVibrationalEnergy(name: string): NameVibrationalProfile {
  const cleanName = (name || "").trim();
  const breakdown = decomposeNameVarnaPhonetics(cleanName);

  // Check signature Lunar Astro rules first
  for (const rule of SIGNATURE_NAME_RULES) {
    if (rule.pattern.test(cleanName)) {
      return {
        inputName: cleanName,
        matchedRuleId: rule.id,
        primaryPlanets: rule.primaryPlanets,
        secondaryPlanets: rule.secondaryPlanets,
        archetypeName: rule.archetype,
        acousticSummary: `Name matches signature Lunar Astro archetype "${rule.name}", activating primary ${rule.primaryPlanets.join(" + ")} vibrational frequencies.`,
        psychologicalBlueprint: rule.psychologicalTraits,
        relationshipTendency: rule.relationshipPattern,
        careerAndServiceVector: rule.careerTendency,
        karmicChallenge: rule.karmicChallenge,
        ancestralShieldStatus: rule.ancestralProtection,
        predictedChartPlacements: rule.predictedChartPlacements,
        phoneticBreakdown: breakdown,
      };
    }
  }

  // Generalized Acoustic Varna Synthesis for ANY arbitrary name
  const scores: Record<string, number> = {
    Sun: breakdown.vowelsSolar * 1.5,
    Moon: breakdown.semivowelsLunar * 1.3,
    Mars: breakdown.gutturalsMars * 1.4,
    Mercury: breakdown.retroflexMercury * 1.1,
    Venus: breakdown.palatalsVenus * 1.3,
    Jupiter: breakdown.dentalsJupiter * 1.2,
    Saturn: breakdown.labialsSaturn * 1.4,
    Rahu: breakdown.aspiratesNodal * 1.2,
  };

  // Give boost to the initial letter (Calling seed / Prathama Akshara)
  const firstChar = cleanName.charAt(0).toLowerCase();
  if (/[aeiou]/.test(firstChar)) scores.Sun += 2.5;
  else if (/[yrlvw]/.test(firstChar)) scores.Moon += 2.0;
  else if (/[kg]/.test(firstChar)) scores.Mars += 2.0;
  else if (/[tdn]/.test(firstChar)) scores.Mercury += 2.0;
  else if (/[cjshz]/.test(firstChar)) scores.Venus += 2.0;
  else if (/[pbmf]/.test(firstChar)) scores.Saturn += 2.0;
  else if (/[hx]/.test(firstChar)) scores.Rahu += 2.0;

  // Sort planets by weight
  const sortedPlanets = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map((e) => e[0]);

  const p1 = sortedPlanets[0] || "Sun";
  const p2 = sortedPlanets[1] || "Mercury";

  const isProtected = /inder$|preet$|jeet$|jit$/i.test(cleanName);

  return {
    inputName: cleanName,
    matchedRuleId: "GENERAL_VARNA_MANDALA",
    primaryPlanets: [p1],
    secondaryPlanets: [p2],
    archetypeName: `The ${p1}-${p2} Acoustic Synthesizer`,
    acousticSummary: `Phonetic acoustic balance carries primary ${p1} frequency supported by ${p2} undertones.`,
    psychologicalBlueprint: `Governed primarily by ${p1} energy, giving signature temperament of ${getPlanetTemperament(p1)}. Balanced by ${p2} mental resonance.`,
    relationshipTendency: getRelationshipTendency(p1, p2),
    careerAndServiceVector: getCareerVector(p1, p2),
    karmicChallenge: getKarmicChallenge(p1, p2),
    ancestralShieldStatus: isProtected,
    predictedChartPlacements: [
      `Prominence of ${p1} in Kendra (1st, 4th, 7th, 10th) or Trikona (1st, 5th, 9th) houses.`,
      `Strong influence of ${p1} or ${p2} on Lagna Lord or Moon Nakshatra.`,
      `Native resonates with activities, colors, and professions ruled by ${p1}.`,
    ],
    phoneticBreakdown: breakdown,
  };
}

// ==========================================
// 4. CHART-NAME CONGRUENCE AUDIT
// ==========================================

export function evaluateChartNameCongruence(
  name: string,
  ephemeris: EphemerisResult
): ChartNameCompatibility {
  const profile = analyzeNameVibrationalEnergy(name);
  const ascSignIdx = Math.floor(ephemeris.ascendant.siderealLongitude / 30);
  const lagnaLord = RASHI_NAMES[ascSignIdx].lord;
  const moon = ephemeris.planets.Moon;
  const moonSignIdx = moon ? Math.floor(moon.siderealLongitude / 30) : 0;
  const moonLord = RASHI_NAMES[moonSignIdx].lord;

  const spouse7thSignIdx = (ascSignIdx + 6) % 12;
  const seventhLord = RASHI_NAMES[spouse7thSignIdx].lord;

  const namePlanet1 = profile.primaryPlanets[0] || "Sun";

  // Friendly relationships table
  const FRIENDLIES: Record<string, string[]> = {
    Sun: ["Moon", "Mars", "Jupiter"],
    Moon: ["Sun", "Mercury"],
    Mars: ["Sun", "Moon", "Jupiter"],
    Mercury: ["Sun", "Venus"],
    Jupiter: ["Sun", "Moon", "Mars"],
    Venus: ["Mercury", "Saturn"],
    Saturn: ["Mercury", "Venus"],
    Rahu: ["Venus", "Saturn", "Mercury"],
    Ketu: ["Mars", "Jupiter"],
  };

  const ENEMIES: Record<string, string[]> = {
    Sun: ["Venus", "Saturn"],
    Moon: [],
    Mars: ["Mercury"],
    Mercury: ["Moon"],
    Jupiter: ["Mercury", "Venus"],
    Venus: ["Sun", "Moon"],
    Saturn: ["Sun", "Moon", "Mars"],
    Rahu: ["Sun", "Moon", "Mars"],
    Ketu: ["Sun", "Moon"],
  };

  let score = 75; // baseline

  // 1. Check Lagna Lord alignment
  let lagnaResonance = "";
  if (namePlanet1 === lagnaLord) {
    score += 15;
    lagnaResonance = `Supreme Harmony: Name's primary planet (${namePlanet1}) is identical to your Lagna Lord (${lagnaLord}), magnifying personal sovereignty and vitality.`;
  } else if (FRIENDLIES[lagnaLord]?.includes(namePlanet1)) {
    score += 10;
    lagnaResonance = `Friendly Synergy: Name's primary planet (${namePlanet1}) is an intimate friend of your Lagna Lord (${lagnaLord}), creating a supportive social field.`;
  } else if (ENEMIES[lagnaLord]?.includes(namePlanet1)) {
    score -= 15;
    lagnaResonance = `Dynamic Tension: Name's primary planet (${namePlanet1}) is inimical to your Lagna Lord (${lagnaLord}), which can cause personal friction or divided loyalties.`;
  } else {
    lagnaResonance = `Neutral Alignment: Name's primary planet (${namePlanet1}) operates neutrally alongside Lagna Lord (${lagnaLord}).`;
  }

  // 2. Check Moon alignment
  let moonResonance = "";
  if (namePlanet1 === moonLord || FRIENDLIES[moonLord]?.includes(namePlanet1)) {
    score += 10;
    moonResonance = `Emotional Comfort: Sound vibration aligns smoothly with Moon dispositor (${moonLord}), giving mental peace and clarity.`;
  } else if (ENEMIES[moonLord]?.includes(namePlanet1)) {
    score -= 10;
    moonResonance = `Emotional Restlessness: Vibrational friction with Moon dispositor (${moonLord}) can trigger sporadic emotional turbulence.`;
  } else {
    moonResonance = `Steady emotional resonance with Moon sign (${RASHI_NAMES[moonSignIdx].englishName}).`;
  }

  // 3. Check 7th House alignment
  let seventhResonance = "";
  if (namePlanet1 === seventhLord || FRIENDLIES[seventhLord]?.includes(namePlanet1)) {
    score += 5;
    seventhResonance = `Marital Grace: Name supports the 7th Lord (${seventhLord}), fostering mutual respect in partnerships.`;
  } else {
    seventhResonance = `Independent Relationship Vector: Name emphasizes self-sufficiency; requires conscious attention to partner needs.`;
  }

  // Bound score
  score = Math.max(35, Math.min(98, score));

  let harmonyStatus: ChartNameCompatibility["harmonyStatus"] = "Harmonious Resonance";
  if (score < 60) harmonyStatus = "Dynamic Tension";
  else if (score < 80) harmonyStatus = "Spiritual Catalyst";

  const overallAudit = `The calling name "${name}" carries a ${profile.primaryPlanets.join(" + ")} vibration. Against your ${RASHI_NAMES[ascSignIdx].englishName} Lagna (ruled by ${lagnaLord}) and ${RASHI_NAMES[moonSignIdx].englishName} Moon, it holds a ${score}% Congruence Index (${harmonyStatus}).`;

  return {
    name,
    congruenceScore: score,
    harmonyStatus,
    resonanceWithLagnaLord: lagnaResonance,
    resonanceWithMoon: moonResonance,
    resonanceWith7thHouse: seventhResonance,
    overallAudit,
    recommendedNameAdjustment:
      score < 65
        ? `Consider prefixing or adopting an auspicious moniker resonating with your Lagna Lord (${lagnaLord}) or Moon sign sounds to soften energetic friction.`
        : undefined,
  };
}

// ==========================================
// 5. HELPER TEMPLATES
// ==========================================

function getPlanetTemperament(planet: string): string {
  switch (planet) {
    case "Sun":
      return "dignified leadership, transparency, pride, directness, and royal authority";
    case "Moon":
      return "empathy, fluid adaptability, artistic perception, and magnetic charm";
    case "Mars":
      return "bold courage, athletic drive, urgency, protectiveness, and quick combativeness";
    case "Mercury":
      return "analytical agility, witty communication, intellectual curiosity, and business adaptability";
    case "Jupiter":
      return "wisdom, quiet assimilation, moral benevolence, optimism, and higher learning";
    case "Venus":
      return "aesthetic sophistication, diplomatic grace, romantic idealism, and creative charm";
    case "Saturn":
      return "stoic endurance, disciplined duty, humility, patient persistence, and pragmatic realism";
    case "Rahu":
      return "unconventional brilliance, boundary-breaking innovation, and magnetic ambition";
    default:
      return "balanced and versatile expression";
  }
}

function getRelationshipTendency(p1: string, p2: string): string {
  if (p1 === "Venus" || p2 === "Venus") {
    return "High romantic ideals and deep investment in partnership harmony; demands aesthetic and emotional elegance from companions.";
  }
  if (p1 === "Mars" || p2 === "Mars") {
    return "Passionate and protective, but easily provoked by indecision or passive resistance; requires an active, forthright partner.";
  }
  if (p1 === "Saturn" || p2 === "Saturn") {
    return "Committed, dependable, and steadfast; shows affection through loyal service and enduring security rather than flowery words.";
  }
  if (p1 === "Moon" || p2 === "Moon") {
    return "Highly receptive to emotional undertones; needs gentle communication and emotional reassurance from their partner.";
  }
  return "Balanced relational approach prioritizing mutual respect, intellectual exchange, and shared goals.";
}

function getCareerVector(p1: string, p2: string): string {
  if (p1 === "Sun" || p2 === "Sun") return "Leadership, executive administration, public affairs, entrepreneurship, and authoritative strategy.";
  if (p1 === "Saturn" || p2 === "Saturn") return "Operations, infrastructure, law, heavy engineering, public service, and disciplined institution-building.";
  if (p1 === "Mercury" || p2 === "Mercury") return "Technology, analytics, media, commerce, negotiation, and high-frequency communication.";
  if (p1 === "Jupiter" || p2 === "Jupiter") return "Education, financial counseling, legal advisory, spiritual mentorship, and strategic policy.";
  if (p1 === "Venus" || p2 === "Venus") return "Design, luxury branding, diplomatic hospitality, cinema/media, and the arts.";
  if (p1 === "Mars" || p2 === "Mars") return "Surgery, defense, technical problem-solving, real estate, and high-stakes operations.";
  return "Adaptive professional versatility excelling wherever independent thinking is valued.";
}

function getKarmicChallenge(p1: string, p2: string): string {
  if (p1 === "Sun" || p2 === "Sun") return "Guarding against excessive pride, loneliness at the top, or impatience with slower collaborators.";
  if (p1 === "Saturn" || p2 === "Saturn") return "Overcoming heavy self-imposed burdens, tendency toward melancholy, and feeling unappreciated.";
  if (p1 === "Venus" || p2 === "Venus") return "Navigating relationship disillusionment when partners fail to match idealistic expectations.";
  if (p1 === "Mars" || p2 === "Mars") return "Taming impulsive temper, restlessness, or burning out from relentless overdrive.";
  return "Balancing inner personal vision with external societal expectations.";
}
