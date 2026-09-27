/**
 * Bhagya Bindu (Pars Fortuna / Part of Fortune) & Secret Code of Planets Engine
 * 
 * Based on classical shastric principles and syllabus units:
 * - Session 97: Bhagya Bindu (Pars Fortuna) in Your Chart
 *   - Day birth: Lagna + Moon - Sun
 *   - Night birth: Lagna + Sun - Moon
 *   - Sensitive degree concentrating accumulated Purva Punya merits
 *   - House placements & recurring age cycles (e.g. 4th house peak at age 4 and 12-year recurring cycles: 16, 28, 40, 52; 11th house cash flow)
 *   - Transit triggers over Bhagya Bindu, Trines (1, 5, 9), Quadrants (1, 4, 7, 10), and Upachayas (3, 11)
 * 
 * - Session 99: Secret Code of Planets (Relative High vs. Low Manifestations)
 *   - Geometric distance: Moolatrikona to Exaltation = Highest Manifestation (from physical house)
 *   - Geometric distance: Moolatrikona to Debilitation = Lowest Manifestation / Blind Spot (from physical house)
 *   - Sun (9th High / 3rd Low), Moon (11th High / 5th Low), Venus (6th High / 12th Low),
 *     Jupiter (8th High / 2nd Low), Mercury (1st High / 7th Low), Mars (10th High / 4th Low),
 *     Saturn (9th High / 3rd Low)
 *   - Mercury Speech Dynamics:
 *     - Mercury itself: How you converse
 *     - 2nd from Mercury: What you continuously speak about & primary dialogue partners
 *     - 7th from Mercury: Where speech degrades / communication breakdown zones
 */

import { EphemerisResult, RashiInfo } from "./types";
import { RASHI_NAMES, NAKSHATRA_NAMES } from "./constants";

// ==========================================
// 1. DATA TYPES & INTERFACES
// ==========================================

export interface TransitTriggerDetail {
  planet: string;
  transitRashi: string;
  transitHouseFromLagna: number;
  geometricRelation: "Conjunction (1st)" | "Trine (5th/9th)" | "Quadrant (4th/7th/10th)" | "Upachaya (3rd/11th)" | "Neutral";
  exactOrbDegrees?: number;
  isExactConjunction: boolean;
  activationEffect: string;
  auspiciousScore: number; // 0 - 100
}

export interface BhagyaBinduComprehensive {
  longitude: number;
  rashi: RashiInfo;
  degreesInSign: number;
  house: number;
  nakshatra: string;
  nakshatraLord: string;
  pada: number;
  isDayBirth: boolean;
  sunHouse: number;
  formulaDescription: string;
  housePlacementProfile: {
    title: string;
    description: string;
    recurringPeakAges?: number[];
    cashFlowMultiplier?: string;
  };
  geometricPoints: {
    trines: { houses: number[]; rashis: string[]; description: string };
    quadrants: { houses: number[]; rashis: string[]; description: string };
    upachayas: { houses: number[]; rashis: string[]; description: string };
  };
  activeTransitTriggers: TransitTriggerDetail[];
  masterSummary: string;
}

export interface SecretCodeManifestation {
  planet: string;
  physicalHouse: number;
  physicalRashi: string;
  moolatrikonaRashi: string;
  exaltationRashi: string;
  debilitationRashi: string;
  highestDistance: number;
  highestHouse: number;
  highestRashi: string;
  highestDomain: string;
  highestEffect: string;
  lowestDistance: number;
  lowestHouse: number;
  lowestRashi: string;
  lowestDomain: string;
  lowestPitfall: string;
  remedy: string;
}

export interface MercurySpeechDynamics {
  mercuryHouse: number;
  mercuryRashi: string;
  speechManner: string;
  secondHouseFromMercury: number;
  secondRashiFromMercury: string;
  continuousConversationFocus: string;
  frequentInterlocutors: string;
  seventhHouseFromMercury: number;
  seventhRashiFromMercury: string;
  communicationFrictionZone: string;
  speechPreservationRemedy: string;
}

export interface BhagyaBinduSecretCodeDossier {
  bhagyaBindu: BhagyaBinduComprehensive;
  secretCodeManifestations: SecretCodeManifestation[];
  mercurySpeech: MercurySpeechDynamics;
  synthesisSummary: string;
}

// ==========================================
// 2. BHAGYA BINDU ENGINE (SESSION 97)
// ==========================================

const HOUSE_FORTUNE_PROFILES: Record<number, { title: string; description: string; recurringPeakAges?: number[]; cashFlowMultiplier?: string }> = {
  1: {
    title: "1st House (Tanu Bhava) — Self-Sustaining Charisma & Natural Magnetism",
    description: "Bhagya Bindu in the Ascendant bestows an innate golden aura. The native's personal presence, character integrity, and direct physical vitality act as prime wealth generators. Recognition arrives through independent initiative.",
    cashFlowMultiplier: "High self-driven earning capacity."
  },
  2: {
    title: "2nd House (Dhana Bhava) — Speech-Derived Wealth & Lineage Assets",
    description: "Fortunes accumulate through vocal eloquence, consultative intelligence, family traditions, and banking reserves. Auspicious transits activate sustained liquidity and ancestral inheritance blessings.",
    cashFlowMultiplier: "Exponential growth in liquid assets and family trust."
  },
  3: {
    title: "3rd House (Sahaja Bhava) — Self-Made Enterprise & Media Breakthroughs",
    description: "Fortune favors courageous personal enterprise, writing, media production, digital communications, and athletic/manual craftsmanship. Blessings multiply whenever the native steps outside routine security.",
    cashFlowMultiplier: "Variable windfalls driven by innovative commercial ventures."
  },
  4: {
    title: "4th House (Sukha Bhava) — 12-Year Cycle Real Estate & Domestic Bliss",
    description: "Fortunes peak during the 4th year of life and systematically reactivate every 12 years (Ages 16, 28, 40, 52, 64, 76). Bestows immense real estate acquisition, maternal blessings, luxury vehicle ownership, and deep emotional contentment.",
    recurringPeakAges: [4, 16, 28, 40, 52, 64, 76],
    cashFlowMultiplier: "Multi-generational asset consolidation and property windfalls."
  },
  5: {
    title: "5th House (Purva Punya Bhava) — Mantric Grace & Creative Speculation",
    description: "A direct conduit to past-life merits (Purva Punya). Grants divine creative genius, scholarly intellect, windfall returns through strategic investments, and joyous blessings through progeny.",
    cashFlowMultiplier: "Sudden quantum leaps through intellectual and speculative acumen."
  },
  6: {
    title: "6th House (Shatru Bhava) — Triumphant Problem-Solving & Service Victory",
    description: "Paradoxical fortune: luck manifests by vanquishing obstacles, eliminating diseases, resolving litigations, and excelling in competitive environments or healing arts. Thrives under pressure.",
    cashFlowMultiplier: "Steady, recession-proof revenue from essential advisory and healing services."
  },
  7: {
    title: "7th House (Jaya Bhava) — Post-Marital Prosperity & Global Alliances",
    description: "Significant life prosperity activates immediately after marriage or entering major business alliances. High public visibility, lucrative foreign contracts, and win-win diplomatic trade negotiations.",
    cashFlowMultiplier: "Doubled financial capacity via synergistic partnerships."
  },
  8: {
    title: "8th House (Randhra Bhava) — Occult Mastery & Transformative Windfalls",
    description: "Concentrates wealth through hidden channels, research royalties, insurance windfalls, transformative investments, and esoteric/taxation sciences. Fortunes bloom unexpectedly during sudden life pivots.",
    cashFlowMultiplier: "Large lump-sum releases and legacy inheritance windfalls."
  },
  9: {
    title: "9th House (Bhagya Bhava) — Supreme Dharmic Grace & International Luck",
    description: "The supreme home of fortune. Endows the native with fatherly benevolence, high ethical standing, fortunate long-distance travel, spiritual mentors (Gurus), and effortless cosmic synchronicity.",
    cashFlowMultiplier: "Continuous dharmic abundance and international prosperity."
  },
  10: {
    title: "10th House (Karma Bhava) — Executive Stature & Public Governance",
    description: "Fortunes culminate in prestigious career appointments, corporate governance, governmental favor, and prominent public renown. The career trajectory experiences rapid promotions during transit activations.",
    cashFlowMultiplier: "Elite institutional remuneration and executive leadership rewards."
  },
  11: {
    title: "11th House (Labha Bhava) — Unlimited Cash Flow & Network Expansion",
    description: "Unlocks exceptional cash flow, social elevation, large network gains, and sudden large profits whenever 11th-house planets or transits activate. The native's social circle becomes a perpetual source of opportunities.",
    cashFlowMultiplier: "Exceptional cash flow multiplier with continuous multiple revenue streams."
  },
  12: {
    title: "12th House (Moksha Bhava) — Foreign Settlements & Transcendental Grace",
    description: "Fortunes blossom away from the birth country in distant lands, multinational organizations, and humanitarian institutions. Bestows spiritual liberation (Moksha), quiet solitude, and charitable prosperity.",
    cashFlowMultiplier: "Foreign currency earnings and spiritual abundance."
  },
};

const PLANET_TRANSIT_EFFECTS: Record<string, string> = {
  Venus: "Transiting Venus over Bhagya Bindu awakens material comforts, acquisition of vehicles, luxurious domestic additions, financial windfalls, and profound harmony in romantic/marital relationships.",
  Mercury: "Transiting Mercury activates commercial breakthroughs, lucrative trading agreements, agile intellectual problem-solving, and decisive communication successes.",
  Jupiter: "Transiting Jupiter bestows supreme divine blessings, auspicious expansion of family/progeny, philosophical wisdom elevation, and unexpected royal/governmental honors.",
  Saturn: "Transiting Saturn establishes enduring structural career consolidation, formal executive promotions, respected societal authority, and long-term tangible wealth.",
  Rahu: "Transiting Rahu triggers rapid, unconventional, and unexpected karmic advancement, unlocking sudden windfall gains through foreign or innovative modern technologies.",
  Ketu: "Transiting Ketu confers profound spiritual elevation, freedom from unnecessary material burdens, inner awakening, and sharp intuitive breakthroughs.",
  Sun: "Transiting Sun bestows authoritative recognition, leadership promotions, radiant vitality, and vital breakthroughs in governmental matters.",
  Moon: "Transiting Moon brings tranquil emotional clarity, celebratory social gatherings, maternal joy, and domestic happiness.",
  Mars: "Transiting Mars fuels courageous enterprise, swift real estate acquisitions, decisive physical vitality, and total victory over commercial competitors.",
};

/**
 * Calculates Bhagya Bindu (Pars Fortuna) and evaluates its predictive triggers.
 */
export function calculateDetailedBhagyaBindu(
  natalEphem: EphemerisResult,
  transitEphem?: EphemerisResult
): BhagyaBinduComprehensive {
  const ascLon = natalEphem.ascendant.siderealLongitude;
  const sun = natalEphem.planets.Sun;
  const moon = natalEphem.planets.Moon;

  const sunLon = sun ? sun.siderealLongitude : 0;
  const moonLon = moon ? moon.siderealLongitude : 0;
  const sunHouse = sun ? sun.house : 1;

  // Day Birth vs Night Birth
  // Day Birth: Sun in houses 7 to 12 (above horizon)
  // Night Birth: Sun in houses 1 to 6 (below horizon)
  const isDayBirth = sunHouse >= 7 && sunHouse <= 12;

  let bbLon = 0;
  let formulaDesc = "";
  if (isDayBirth) {
    bbLon = ((ascLon + moonLon - sunLon) % 360 + 360) % 360;
    formulaDesc = "Day Birth Formula: Lagna + Moon - Sun (Sun in House " + sunHouse + ")";
  } else {
    bbLon = ((ascLon + sunLon - moonLon) % 360 + 360) % 360;
    formulaDesc = "Night Birth Formula: Lagna + Sun - Moon (Sun in House " + sunHouse + ")";
  }

  const rashiIdx = Math.floor(bbLon / 30);
  const degreesInSign = bbLon % 30;
  const rashi: RashiInfo = {
    ...RASHI_NAMES[rashiIdx],
    degreesInSign,
  };

  const ascRashiIdx = Math.floor(ascLon / 30);
  const house = ((rashiIdx - ascRashiIdx + 12) % 12) + 1;

  // Nakshatra calculation (360 / 27 = 13.333 degrees each)
  const nakIdx = Math.floor(bbLon / (360 / 27));
  const nakshatraMeta = NAKSHATRA_NAMES[nakIdx] || NAKSHATRA_NAMES[0];
  const nakshatra = nakshatraMeta.sanskritName;
  const nakshatraLord = nakshatraMeta.lord;
  const pada = Math.floor((bbLon % (360 / 27)) / (360 / 108)) + 1;

  const profile = HOUSE_FORTUNE_PROFILES[house] || HOUSE_FORTUNE_PROFILES[1];

  // Geometric Points from Bhagya Bindu House
  const getHouseFromOffset = (offset: number) => ((house - 1 + offset) % 12) + 1;
  const getRashiFromOffset = (offset: number) => RASHI_NAMES[(rashiIdx + offset) % 12].englishName;

  const trineHouses = [house, getHouseFromOffset(4), getHouseFromOffset(8)];
  const trineRashis = [rashi.englishName, getRashiFromOffset(4), getRashiFromOffset(8)];

  const quadrantHouses = [house, getHouseFromOffset(3), getHouseFromOffset(6), getHouseFromOffset(9)];
  const quadrantRashis = [rashi.englishName, getRashiFromOffset(3), getRashiFromOffset(6), getRashiFromOffset(9)];

  const upachayaHouses = [getHouseFromOffset(2), getHouseFromOffset(10)];
  const upachayaRashis = [getRashiFromOffset(2), getRashiFromOffset(10)];

  // Transit Evaluation if transit ephemeris provided
  const activeTriggers: TransitTriggerDetail[] = [];
  if (transitEphem && transitEphem.planets) {
    const planetsToCheck = ["Venus", "Mercury", "Jupiter", "Saturn", "Rahu", "Ketu", "Sun", "Mars", "Moon"];
    for (const pName of planetsToCheck) {
      const tp = transitEphem.planets[pName];
      if (!tp) continue;

      const tpLon = tp.siderealLongitude;
      const tpRashiIdx = Math.floor(tpLon / 30);
      const tpHouseFromLagna = tp.house;

      const diffFromBBRashi = (tpRashiIdx - rashiIdx + 12) % 12; // 0 = same sign, 4 = 5th, 8 = 9th, etc.

      let relation: TransitTriggerDetail["geometricRelation"] = "Neutral";
      let score = 50;

      if (diffFromBBRashi === 0) {
        relation = "Conjunction (1st)";
        score = 95;
      } else if (diffFromBBRashi === 4 || diffFromBBRashi === 8) {
        relation = "Trine (5th/9th)";
        score = 88;
      } else if (diffFromBBRashi === 3 || diffFromBBRashi === 6 || diffFromBBRashi === 9) {
        relation = "Quadrant (4th/7th/10th)";
        score = 82;
      } else if (diffFromBBRashi === 2 || diffFromBBRashi === 10) {
        relation = "Upachaya (3rd/11th)";
        score = 75;
      }

      if (relation !== "Neutral") {
        const orb = Math.abs(tpLon - bbLon);
        const orbNorm = Math.min(orb, 360 - orb);
        const isExact = relation === "Conjunction (1st)" && orbNorm <= 5.0;

        const baseEffect = PLANET_TRANSIT_EFFECTS[pName] || "Activates positive momentum.";
        let formattedEffect = baseEffect;
        if (relation === "Trine (5th/9th)") {
          formattedEffect += " Flowing via effortless Trine harmony (5th/9th axis).";
        } else if (relation === "Quadrant (4th/7th/10th)") {
          formattedEffect += " Generating dynamic turning points and decisive event triggers (Kendra axis).";
        } else if (relation === "Upachaya (3rd/11th)") {
          formattedEffect += " Rewarding persistent self-initiative and ambitious outreach.";
        }

        activeTriggers.push({
          planet: pName,
          transitRashi: RASHI_NAMES[tpRashiIdx].englishName,
          transitHouseFromLagna: tpHouseFromLagna,
          geometricRelation: relation,
          exactOrbDegrees: parseFloat(orbNorm.toFixed(2)),
          isExactConjunction: isExact,
          activationEffect: formattedEffect,
          auspiciousScore: isExact ? 100 : score,
        });
      }
    }
  }

  // Summary String
  let masterSummary = `Bhagya Bindu anchors at ${degreesInSign.toFixed(2)}° ${rashi.englishName} (House ${house}, ${nakshatra} Pada ${pada}, Lord: ${nakshatraLord}). ${formulaDesc}. ${profile.description}`;
  if (profile.recurringPeakAges && profile.recurringPeakAges.length > 0) {
    masterSummary += ` Special 12-Year Cycle: Fortunes peak at age 4 and repeat at ages ${profile.recurringPeakAges.slice(1).join(", ")}.`;
  }
  if (activeTriggers.length > 0) {
    const topTriggers = activeTriggers.slice(0, 3).map((t) => `${t.planet} in ${t.geometricRelation}`).join(", ");
    masterSummary += ` Active transit catalysts: ${topTriggers}.`;
  }

  return {
    longitude: bbLon,
    rashi,
    degreesInSign: parseFloat(degreesInSign.toFixed(2)),
    house,
    nakshatra,
    nakshatraLord,
    pada,
    isDayBirth,
    sunHouse,
    formulaDescription: formulaDesc,
    housePlacementProfile: profile,
    geometricPoints: {
      trines: {
        houses: trineHouses,
        rashis: trineRashis,
        description: "Effortless karmic grace, spontaneous good fortune, and dharmic support.",
      },
      quadrants: {
        houses: quadrantHouses,
        rashis: quadrantRashis,
        description: "Active life milestones, decisive shifts, and high-impact turning points.",
      },
      upachayas: {
        houses: upachayaHouses,
        rashis: upachayaRashis,
        description: "Sustained self-driven progress, competitive courage, and compounding wealth.",
      },
    },
    activeTransitTriggers: activeTriggers,
    masterSummary,
  };
}

// ==========================================
// 3. SECRET CODE OF PLANETS (SESSION 99)
// ==========================================

interface PlanetDignityRules {
  moolatrikonaRashiIdx: number;
  moolatrikonaName: string;
  exaltationRashiIdx: number;
  exaltationName: string;
  debilitationRashiIdx: number;
  debilitationName: string;
  highestDistance: number; // Moolatrikona to Exaltation
  lowestDistance: number;  // Moolatrikona to Debilitation
  highestDomain: string;
  highestEffect: string;
  lowestDomain: string;
  lowestPitfall: string;
  remedy: string;
}

const PLANET_SECRET_CODE_RULES: Record<string, PlanetDignityRules> = {
  Sun: {
    moolatrikonaRashiIdx: 4, // Leo
    moolatrikonaName: "Leo",
    exaltationRashiIdx: 0,   // Aries (9th from Leo)
    exaltationName: "Aries",
    debilitationRashiIdx: 6, // Libra (3rd from Leo)
    debilitationName: "Libra",
    highestDistance: 9,
    lowestDistance: 3,
    highestDomain: "9th House from Sun — Sovereign Dharma, Relentless Discipline & Overcoming Adversity",
    highestEffect: "Unlocks elevated moral authority, unbending work ethic, and total destruction of enemies, debts, and chronic obstacles.",
    lowestDomain: "3rd House from Sun — Subconscious Fears, Nocturnal Hesitations & Ego Fragility",
    lowestPitfall: "Native suffers blind spots in self-initiative, sudden bouts of nocturnal worry, or fragile pride in sibling/peer relations.",
    remedy: "Practice Aditya Hridaya Stotram at sunrise, treat siblings with genuine humility, and maintain strict physical morning discipline.",
  },
  Moon: {
    moolatrikonaRashiIdx: 3, // Cancer
    moolatrikonaName: "Cancer",
    exaltationRashiIdx: 1,   // Taurus (11th from Cancer)
    exaltationName: "Taurus",
    debilitationRashiIdx: 7, // Scorpio (5th from Cancer)
    debilitationName: "Scorpio",
    highestDistance: 11,
    lowestDistance: 5,
    highestDomain: "11th House from Moon — Emotional Security, Peak Social Awareness & Joyful Networks",
    highestEffect: "The native's mind finds profound emotional stability, public celebration, expansive social networks, and effortless fulfillment of aspirations.",
    lowestDomain: "5th House from Moon — Emotional Dissatisfaction, Excessive Rumination & Child/Father Friction",
    lowestPitfall: "Vulnerability to deep psychological overthinking, emotional grievance regarding children or creative output, and misjudging mentors.",
    remedy: "Engage in grounded breathwork (Chandra Pranayama), drink water from silver vessels, and consciously release past emotional grievances.",
  },
  Venus: {
    moolatrikonaRashiIdx: 6, // Libra
    moolatrikonaName: "Libra",
    exaltationRashiIdx: 11,  // Pisces (6th from Libra)
    exaltationName: "Pisces",
    debilitationRashiIdx: 5, // Virgo (12th from Libra)
    debilitationName: "Virgo",
    highestDistance: 6,
    lowestDistance: 12,
    highestDomain: "6th House from Venus — Selfless Healing, Unconditional Patience & Divine Service",
    highestEffect: "Venus reaches its sublime peak in sacrificial devotion, healing the distressed, nursing the vulnerable, and resolving disputes with gracious poise.",
    lowestDomain: "12th House from Venus — Blurred Relationship Boundaries, Financial Leakages & Sensory Indulgence",
    lowestPitfall: "Prone to complete boundary erosion in romantic partnerships, secret financial leakages, and sensory escapism.",
    remedy: "Maintain strict financial budgeting, establish clear emotional boundaries in relationships, and offer white flowers on Fridays.",
  },
  Jupiter: {
    moolatrikonaRashiIdx: 8, // Sagittarius
    moolatrikonaName: "Sagittarius",
    exaltationRashiIdx: 3,   // Cancer (8th from Sagittarius)
    exaltationName: "Cancer",
    debilitationRashiIdx: 9, // Capricorn (2nd from Sagittarius)
    debilitationName: "Capricorn",
    highestDistance: 8,
    lowestDistance: 2,
    highestDomain: "8th House from Jupiter — Esoteric Research, Occult Mysteries & Transforming Seekers",
    highestEffect: "Jupiter's illumination shines supreme when guiding sincere external seekers, decoding hidden sciences, and unlocking transformative mysteries.",
    lowestDomain: "2nd House from Jupiter — Undervalued by Immediate Family ('A Prophet is Never Honored in His Own Country')",
    lowestPitfall: "The native's wisdom is habitually disregarded or taken for granted by immediate family members and domestic household relatives ('A prophet is never honored in his own country').",
    remedy: "Avoid forcing spiritual advice upon household relatives unasked; direct teachings to external genuine seekers, and respect family elders.",
  },
  Mercury: {
    moolatrikonaRashiIdx: 5, // Virgo
    moolatrikonaName: "Virgo",
    exaltationRashiIdx: 5,   // Virgo (1st / Same Sign)
    exaltationName: "Virgo",
    debilitationRashiIdx: 11,// Pisces (7th from Virgo)
    debilitationName: "Pisces",
    highestDistance: 1,
    lowestDistance: 7,
    highestDomain: "1st House from Mercury (Self) — Analytical Mastery, Razor-Sharp Intellect & Articulate Eloquence",
    highestEffect: "Where Mercury sits is where cognitive genius operates with pinpoint clarity, commercial brilliance, and swift data processing.",
    lowestDomain: "7th House from Mercury — Communication Breakdown, Degraded Speech & Marital Misunderstandings",
    lowestPitfall: "Speech degrades in intimate 1-on-1 dialogues; communications with spouses or business partners turn sarcastic, clumsy, or misinterpreted.",
    remedy: "Double-check written agreements, listen twice as much as you speak during partner negotiations, and avoid intellectual cynicism.",
  },
  Mars: {
    moolatrikonaRashiIdx: 0, // Aries
    moolatrikonaName: "Aries",
    exaltationRashiIdx: 9,   // Capricorn (10th from Aries)
    exaltationName: "Capricorn",
    debilitationRashiIdx: 3, // Cancer (4th from Aries)
    debilitationName: "Cancer",
    highestDistance: 10,
    lowestDistance: 4,
    highestDomain: "10th House from Mars — Executive Authority, Decisive Leadership & Triumphant Execution",
    highestEffect: "Mars demonstrates supreme executive stamina, corporate command, and courageous tactical execution in high-stakes professional roles.",
    lowestDomain: "4th House from Mars — Domestic Impatience, Friction in Home Sanctuary & Temper Outbursts",
    lowestPitfall: "Impatience spills into the private domestic sanctuary, causing tension with maternal figures or emotional agitation at home.",
    remedy: "Channel excess physical energy through rigorous daily physical training; keep the domestic environment quiet, cool, and orderly.",
  },
  Saturn: {
    moolatrikonaRashiIdx: 10, // Aquarius
    moolatrikonaName: "Aquarius",
    exaltationRashiIdx: 6,    // Libra (9th from Aquarius)
    exaltationName: "Libra",
    debilitationRashiIdx: 0,  // Aries (3rd from Aquarius)
    debilitationName: "Aries",
    highestDistance: 9,
    lowestDistance: 3,
    highestDomain: "9th House from Saturn — Dharmic Endurance, Structural Justice & Generational Legacy",
    highestEffect: "Bestows unshakeable adherence to truth, generational legacy building, structured institutional justice, and deep reverence for timeless tradition.",
    lowestDomain: "3rd House from Saturn — Hesitation in Initiative, Chronic Self-Doubt & Stagnant Momentum",
    lowestPitfall: "Excessive deliberation and fear of failure lead to analysis paralysis, procrastinating bold personal initiatives.",
    remedy: "Commit to small, non-negotiable daily actions; avoid overthinking short-term initiatives, and assist underprivileged elderly workers.",
  },
};

/**
 * Computes Secret Code of Planets (Relative High vs. Low Manifestations).
 */
export function evaluateSecretCodeOfPlanets(natalEphem: EphemerisResult): SecretCodeManifestation[] {
  const ascLon = natalEphem.ascendant.siderealLongitude;
  const ascRashiIdx = Math.floor(ascLon / 30);
  const results: SecretCodeManifestation[] = [];

  const planetsToProcess = ["Sun", "Moon", "Venus", "Jupiter", "Mercury", "Mars", "Saturn"];

  for (const pName of planetsToProcess) {
    const pData = natalEphem.planets[pName];
    const rules = PLANET_SECRET_CODE_RULES[pName];
    if (!pData || !rules) continue;

    const physicalHouse = pData.house;
    const physicalRashiIdx = Math.floor(pData.siderealLongitude / 30);
    const physicalRashi = RASHI_NAMES[physicalRashiIdx].englishName;

    // Highest Manifestation House: Physical House + Highest Distance - 1
    const highestHouse = ((physicalHouse - 1 + rules.highestDistance - 1) % 12) + 1;
    const highestRashiIdx = (ascRashiIdx + highestHouse - 1) % 12;
    const highestRashi = RASHI_NAMES[highestRashiIdx].englishName;

    // Lowest Manifestation House: Physical House + Lowest Distance - 1
    const lowestHouse = ((physicalHouse - 1 + rules.lowestDistance - 1) % 12) + 1;
    const lowestRashiIdx = (ascRashiIdx + lowestHouse - 1) % 12;
    const lowestRashi = RASHI_NAMES[lowestRashiIdx].englishName;

    results.push({
      planet: pName,
      physicalHouse,
      physicalRashi,
      moolatrikonaRashi: rules.moolatrikonaName,
      exaltationRashi: rules.exaltationName,
      debilitationRashi: rules.debilitationName,
      highestDistance: rules.highestDistance,
      highestHouse,
      highestRashi,
      highestDomain: rules.highestDomain,
      highestEffect: rules.highestEffect,
      lowestDistance: rules.lowestDistance,
      lowestHouse,
      lowestRashi,
      lowestDomain: rules.lowestDomain,
      lowestPitfall: rules.lowestPitfall,
      remedy: rules.remedy,
    });
  }

  return results;
}

// ==========================================
// 4. MERCURY SPEECH & COMMUNICATION DYNAMICS (SESSION 99)
// ==========================================

const HOUSE_CONVERSATION_TOPICS: Record<number, { topic: string; interlocutors: string }> = {
  1: {
    topic: "Personal identity, health, bodily appearance, self-development, and individual ambitions.",
    interlocutors: "Mentors focusing on self-cultivation, physical trainers, and intimate confidants.",
  },
  2: {
    topic: "Financial investments, banking assets, family heritage, ancestral values, and culinary tastes.",
    interlocutors: "Family elders, bankers, financial planners, and lineage associates.",
  },
  3: {
    topic: "Digital media, marketing, short-distance travel, cutting-edge software, manual skills, and sibling affairs.",
    interlocutors: "Siblings, creative colleagues, media partners, and local collaborators.",
  },
  4: {
    topic: "Real estate properties, vehicles, home decoration, mother's wellbeing, and inner emotional tranquility.",
    interlocutors: "Mother, real estate advisors, interior architects, and homeland elders.",
  },
  5: {
    topic: "Children's education, creative arts, stock investments, romantic ideals, and spiritual mantras.",
    interlocutors: "Children, romantic partners, speculative traders, and creative visionaries.",
  },
  6: {
    topic: "Daily work routines, health optimization, resolving disputes, debt elimination, and pet care.",
    interlocutors: "Physicians, legal counselors, colleagues, and service professionals.",
  },
  7: {
    topic: "Marital dynamics, business partnerships, contractual agreements, and international commerce.",
    interlocutors: "Spouse, principal business partners, commercial clients, and diplomatic negotiators.",
  },
  8: {
    topic: "Occult mysteries, tax strategies, research methodologies, psychological depth, and sudden transformations.",
    interlocutors: "Esoteric researchers, tax attorneys, insurance agents, and spiritual detectives.",
  },
  9: {
    topic: "Higher philosophy, spiritual dharma, pilgrimages, international universities, and guru guidance.",
    interlocutors: "Spiritual gurus, university professors, foreign travelers, and father figures.",
  },
  10: {
    topic: "Corporate career status, executive leadership, government policies, and public reputation.",
    interlocutors: "Supervisors, corporate executives, bureaucratic officials, and industry leaders.",
  },
  11: {
    topic: "Major financial profits, social group initiatives, future aspirations, and large-scale networking.",
    interlocutors: "Influential social circle, corporate network members, elder siblings, and club peers.",
  },
  12: {
    topic: "Foreign relocations, spiritual retreat, subconscious dreams, charitable giving, and transcendental meditation.",
    interlocutors: "Monastics, foreign nationals, ashram guides, and charity organizers.",
  },
};

const MERCURY_SPEECH_STYLES: Record<number, string> = {
  1: "Articulate, expressive, and highly personalized. Native commands conversations effortlessly with quick wit and self-assured clarity.",
  2: "Melodious, measured, and persuasive. Speech is heavily laced with financial prudence, traditional wisdom, and family dignity.",
  3: "Rapid, technical, and inquisitive. Native speaks swiftly, loves data exchange, and communicates animatedly across media channels.",
  4: "Nurturing, empathetic, and gentle. Speech reflects emotional warmth, domestic care, and psychological security.",
  5: "Dazzling, intellectual, and creative. Native speaks with dramatic flair, poetic nuance, and authoritative educational command.",
  6: "Analytical, precise, and critical. Speech focuses on problem-solving, diagnosing inefficiencies, and logical debate.",
  7: "Diplomatic, courtly, and collaborative. Speaks with great politeness, seeking harmony and consensus in all exchanges.",
  8: "Secretive, intense, and penetrating. Speaks in guarded sentences, probing deeply into hidden motives and occult depths.",
  9: "Preachy, inspirational, and philosophical. Native communicates like a spiritual teacher, quoting scripture and ethical principles.",
  10: "Authoritative, dignified, and executive. Speech is formal, structured, and commands respect in corporate or civic arenas.",
  11: "Visionary, progressive, and egalitarian. Communicates ideas of collective empowerment, future trends, and social networking.",
  12: "Soft, reflective, and poetic. Native speaks sparingly, valuing silence, esoteric reflection, and contemplative subtlety.",
};

/**
 * Evaluates Mercury Speech & Dialogue Dynamics per Session 99.
 */
export function evaluateMercurySpeechDynamics(natalEphem: EphemerisResult): MercurySpeechDynamics {
  const ascLon = natalEphem.ascendant.siderealLongitude;
  const ascRashiIdx = Math.floor(ascLon / 30);
  const merc = natalEphem.planets.Mercury;

  const mercuryHouse = merc ? merc.house : 1;
  const mercuryRashiIdx = merc ? Math.floor(merc.siderealLongitude / 30) : ascRashiIdx;
  const mercuryRashi = RASHI_NAMES[mercuryRashiIdx].englishName;

  // 1st House: How you speak
  const speechManner = MERCURY_SPEECH_STYLES[mercuryHouse] || MERCURY_SPEECH_STYLES[1];

  // 2nd House from Mercury: What you continuously speak about & interlocutors
  const secondHouseFromMercury = ((mercuryHouse - 1 + 1) % 12) + 1;
  const secondRashiIdx = (ascRashiIdx + secondHouseFromMercury - 1) % 12;
  const secondRashiFromMercury = RASHI_NAMES[secondRashiIdx].englishName;
  const topicData = HOUSE_CONVERSATION_TOPICS[secondHouseFromMercury] || HOUSE_CONVERSATION_TOPICS[1];

  // 7th House from Mercury: Where speech degrades / communication breakdown zones
  const seventhHouseFromMercury = ((mercuryHouse - 1 + 6) % 12) + 1;
  const seventhRashiIdx = (ascRashiIdx + seventhHouseFromMercury - 1) % 12;
  const seventhRashiFromMercury = RASHI_NAMES[seventhRashiIdx].englishName;

  const frictionZone = `In House ${seventhHouseFromMercury} (${seventhRashiFromMercury}), communications easily become clumsy, misconstrued, or overly cynical. Relations with entities governed by House ${seventhHouseFromMercury} require written clarity and mindful restraint.`;
  const preservationRemedy = "Pause for 3 seconds before responding in contentious dialogues; put sensitive agreements in writing, and chant the Budha Gayatri Mantra.";

  return {
    mercuryHouse,
    mercuryRashi,
    speechManner,
    secondHouseFromMercury,
    secondRashiFromMercury,
    continuousConversationFocus: topicData.topic,
    frequentInterlocutors: topicData.interlocutors,
    seventhHouseFromMercury,
    seventhRashiFromMercury,
    communicationFrictionZone: frictionZone,
    speechPreservationRemedy: preservationRemedy,
  };
}

// ==========================================
// 5. MASTER REPORT & SYNTHESIS GENERATOR
// ==========================================

export function generateBhagyaBinduSecretCodeReport(
  natalEphem: EphemerisResult,
  transitEphem?: EphemerisResult
): BhagyaBinduSecretCodeDossier {
  const bhagyaBindu = calculateDetailedBhagyaBindu(natalEphem, transitEphem);
  const secretCodeManifestations = evaluateSecretCodeOfPlanets(natalEphem);
  const mercurySpeech = evaluateMercurySpeechDynamics(natalEphem);

  const lines: string[] = [];
  lines.push("### 🌟 BHAGYA BINDU (PARS FORTUNA) & SECRET CODE OF PLANETS DOSSIER");
  lines.push("");
  lines.push(`**1. Bhagya Bindu Coordinates & Lifecycle Triggers (Session 97):**`);
  lines.push(`- **Position:** ${bhagyaBindu.degreesInSign.toFixed(2)}° ${bhagyaBindu.rashi.englishName} in **House ${bhagyaBindu.house}** (${bhagyaBindu.formulaDescription})`);
  lines.push(`- **Nakshatra:** ${bhagyaBindu.nakshatra} (Pada ${bhagyaBindu.pada}, Lord: ${bhagyaBindu.nakshatraLord})`);
  lines.push(`- **Karmic House Profile:** ${bhagyaBindu.housePlacementProfile.title}`);
  lines.push(`  *${bhagyaBindu.housePlacementProfile.description}*`);
  if (bhagyaBindu.housePlacementProfile.recurringPeakAges) {
    lines.push(`  *Special 12-Year Cycle Peak Ages:* **${bhagyaBindu.housePlacementProfile.recurringPeakAges.join(", ")}**`);
  }
  lines.push(`- **Geometric Points from Fortune Point:**`);
  lines.push(`  * Trines (1/5/9 - Effortless Grace): Houses ${bhagyaBindu.geometricPoints.trines.houses.join(", ")} (${bhagyaBindu.geometricPoints.trines.rashis.join(", ")})`);
  lines.push(`  * Quadrants (1/4/7/10 - Turning Points): Houses ${bhagyaBindu.geometricPoints.quadrants.houses.join(", ")} (${bhagyaBindu.geometricPoints.quadrants.rashis.join(", ")})`);
  lines.push(`  * Upachayas (3/11 - Personal Growth): Houses ${bhagyaBindu.geometricPoints.upachayas.houses.join(", ")} (${bhagyaBindu.geometricPoints.upachayas.rashis.join(", ")})`);

  if (bhagyaBindu.activeTransitTriggers.length > 0) {
    lines.push(`- **Active Transit Activations:**`);
    for (const t of bhagyaBindu.activeTransitTriggers) {
      lines.push(`  * **${t.planet}** transiting in ${t.geometricRelation} (House ${t.transitHouseFromLagna}, ${t.transitRashi}): ${t.activationEffect}`);
    }
  }

  lines.push("");
  lines.push(`**2. Secret Code of Planets (Relative High vs. Low Manifestations - Session 99):**`);
  for (const m of secretCodeManifestations) {
    lines.push(`- **${m.planet} (House ${m.physicalHouse} in ${m.physicalRashi}):**`);
    lines.push(`  * Highest Manifestation: **House ${m.highestHouse} (${m.highestRashi})** [${m.highestDistance}th from ${m.planet}] — *${m.highestEffect}*`);
    lines.push(`  * Lowest Manifestation (Blind Spot): **House ${m.lowestHouse} (${m.lowestRashi})** [${m.lowestDistance}th from ${m.planet}] — *${m.lowestPitfall}*`);
    lines.push(`  * Shastric Remedy: ${m.remedy}`);
  }

  lines.push("");
  lines.push(`**3. Mercury Speech & Dialogue Dynamics (Session 99):**`);
  lines.push(`- **Speech Manner (Mercury in House ${mercurySpeech.mercuryHouse} in ${mercurySpeech.mercuryRashi}):** ${mercurySpeech.speechManner}`);
  lines.push(`- **Continuous Conversational Focus (2nd from Mercury - House ${mercurySpeech.secondHouseFromMercury}):** ${mercurySpeech.continuousConversationFocus}`);
  lines.push(`- **Primary Interlocutors:** ${mercurySpeech.frequentInterlocutors}`);
  lines.push(`- **Speech Degradation Zone (7th from Mercury - House ${mercurySpeech.seventhHouseFromMercury}):** ${mercurySpeech.communicationFrictionZone}`);
  lines.push(`- **Speech Preservation Remedy:** ${mercurySpeech.speechPreservationRemedy}`);

  const synthesisSummary = lines.join("\n");

  return {
    bhagyaBindu,
    secretCodeManifestations,
    mercurySpeech,
    synthesisSummary,
  };
}
