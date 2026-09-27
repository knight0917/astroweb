/**
 * Medhaj Astro Baadhak Theory & Rahu-Ketu Nodal Transits Engine (Sessions 82, 84 & 85)
 * 
 * References:
 * - Session 82: Introduction to Baadhak Theory
 *   - The Core Mathematical Rule of Baadhaka (Obstruction):
 *     * Movable Signs (Chara: Aries, Cancer, Libra, Capricorn) -> 11th House is Baadhaka Bhava.
 *     * Fixed Signs (Sthira: Taurus, Leo, Scorpio, Aquarius) -> 9th House is Baadhaka Bhava.
 *     * Dual Signs (Dwiswabhava: Gemini, Virgo, Sagittarius, Pisces) -> 7th House is Baadhaka Bhava.
 *   - Significations & Manifestations:
 *     * 11th House: Elder siblings, network circles, large cash inflow, paternal uncle, desires of children.
 *       Overcoming obstacles flips 11th house into supreme gains and worldly fulfillment (Viparita Raja Yoga).
 *     * 9th House: Father, guru, dharma, higher philosophies, foreign travel, fortune.
 *       Overcoming dogmatism flips 9th house into divine fortune and wisdom.
 *     * 7th House: Spouse, partnerships, public relations, contracts.
 *       Overcoming projection and ego flips 7th house into diplomatic mastery and harmonious alliances.
 *   - Relative Baadhaka for all 12 Houses (H1 to H12):
 *     * Every house functions as an independent reference frame. Its Baadhaka is determined by the modality
 *       of the sign occupying that house (e.g. 4th house Movable -> 11th from 4th = 2nd house Baadhaka for home/mother;
 *       4th house Fixed -> 9th from 4th = 12th house Baadhaka; 7th house Dual -> 7th from 7th = 1st house Baadhaka).
 * 
 * - Session 84: Baadhak Theory Part 2 — Psychology, Karma & Resolution
 *   - Multi-Lagna Baadhaka Audit:
 *     * Physical Lagna (D1): Tangible bodily, worldly, and environmental obstructions.
 *     * Moon Lagna (Chandra): Emotional karma, subconscious desire friction, mental knots (Manas).
 *     * Sun Lagna (Surya): Soul mission (Atma), willpower, institutional/paternal tests, authority hurdles.
 *     * Paka Lagna (Sign of D1 Lagnesha): Operational execution, field where personal energy is deployed.
 *   - Deep Dive: Aries Lagna with Aquarius 11th House Baadhaka:
 *     * Aquarius is an Air sign with Fixed modality, co-ruled by Saturn (delay, discipline) and Rahu (illusion, shortcuts).
 *   - 7 Planetary Modification Profiles in Baadhaka Bhava:
 *     * Jupiter, Saturn, Venus, Moon, Mercury, Rahu, Mars (+ Sun & Ketu).
 *   - Energy Release Dynamics:
 *     * Resolving Baadhaka releases energy directly into the 1st House (vitality) and 5th House (creative intellect).
 *   - Totka vs. Karma Phala:
 *     * No superficial totka can bypass Karma Phala. Karma must be resolved consciously.
 *     * Aphorism: "You meet the same people while climbing down that you met while climbing up."
 * 
 * - Session 85: Rahu-Ketu Transit and Relation with Baadhak Theory
 *   - Rahu (head without body: future cravings, amplification) vs. Ketu (body without head: past satiety, detachment).
 *   - Taurus-Scorpio Axis Transit (Kalapurusha 2nd & 8th houses):
 *     * Rahu in Taurus: Obsession with accumulating material wealth, speech power, luxury food, liquid assets.
 *     * Ketu in Scorpio: Stripping away unearned/corrupt wealth, dissolving toxic crutches, purification through crisis.
 *   - F.E.A.R. = "False Evidence Appearing Real": Rahu's cognitive illusions vs. Ketu's detachment antidote.
 *   - Transit Trigger Timing:
 *     * Transit of Rahu or Ketu crossing natal Baadhaka Bhava or aspecting Baadhakesh.
 *     * 18.5-Year Nodal Return (Ages ~18-19, 37, 55-56, 74) & Reverse Nodal Return (~9.3 years).
 *     * Nodal Square Alignments (~4.6 and 13.9 years).
 *   - Parihara / Sadhana: Lord Shiva worship, Om Namah Shivaya japa, sunrise/sunset detachment meditation.
 */

import { EphemerisResult, CelestialBodyPosition, SpecialPoint } from "./types";
import { RASHI_NAMES } from "./constants";

/**
 * Robustly extracts the 0-11 zodiac sign index from any CelestialBodyPosition or SpecialPoint.
 */
export function getBodySignIndex(body?: CelestialBodyPosition | SpecialPoint | null): number {
  if (!body) return 0;
  if ("rashi" in body && body.rashi && typeof body.rashi.index === "number") {
    return body.rashi.index;
  }
  const lon = body.siderealLongitude || 0;
  return Math.floor(((lon % 360) + 360) % 360 / 30);
}

// =========================================================================
// 1. FUNDAMENTAL CONSTANTS & SHSTRIC MAPPINGS
// =========================================================================

export type Modality = "Movable (Chara)" | "Fixed (Sthira)" | "Dual (Dwiswabhava)";

export const ZODIAC_SIGNS: string[] = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const RASHI_SANSKRIT: string[] = [
  "Mesha", "Vrishabha", "Mithuna", "Karka",
  "Simha", "Kanya", "Tula", "Vrishchika",
  "Dhanu", "Makara", "Kumbha", "Meena"
];

export const SIGN_PRIMARY_LORDS: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
  4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars",
  8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter"
};

export const SIGN_CO_LORDS: Record<number, string | null> = {
  0: null, 1: null, 2: null, 3: null,
  4: null, 5: null, 6: null,
  7: "Ketu", // Scorpio co-lord
  8: null, 9: null,
  10: "Rahu", // Aquarius co-lord
  11: null
};

export const HOUSE_LIVING_SIGNIFICATIONS: Record<number, { name: string; realm: string; sanskrit: string }> = {
  1: { name: "Self, Physical Vitality & Mind", realm: "Personal health, temperament, bodily constitution, and public self", sanskrit: "Tanu Bhava" },
  2: { name: "Family, Speech, Wealth & Food", realm: "Family lineage, vocal expression, liquid savings, and eating habits", sanskrit: "Dhana Bhava" },
  3: { name: "Younger Siblings, Courage & Skill", realm: "Immediate peers, initiative, fine motor skills, and short journeys", sanskrit: "Sahaja Bhava" },
  4: { name: "Mother, Domestic Peace & Property", realm: "Maternal bonding, real estate, vehicles, and inner emotional sanctuary", sanskrit: "Sukha Bhava" },
  5: { name: "Children, Intelligence & Purva Punya", realm: "Creative intellect, past-life merits, speculative acumen, and disciples", sanskrit: "Putra Bhava" },
  6: { name: "Enemies, Debts, Litigation & Disease", realm: "Daily workplace friction, bodily ailments, debts, and competitive disputes", sanskrit: "Ari Bhava" },
  7: { name: "Spouse, Business Partner & Public Trade", realm: "Marital alliances, legal contracts, business partnerships, and open society", sanskrit: "Yuvati Bhava" },
  8: { name: "Longevity, In-Laws, Sudden Events & Occult", realm: "Subterranean karma, research, unearned wealth, and sudden transformations", sanskrit: "Randhra Bhava" },
  9: { name: "Father, Guru, Dharma & Long Journeys", realm: "Spiritual mentors, philosophical convictions, pilgrimages, and divine grace", sanskrit: "Bhagya Bhava" },
  10: { name: "Career, Authority, Father's Status & Karma", realm: "Executive duties, professional reputation, societal status, and karma in action", sanskrit: "Karma Bhava" },
  11: { name: "Elder Siblings, Large Gains & Network Circles", realm: "Aspirations, massive cash inflow, elder brothers/sisters, and social networks", sanskrit: "Labha Bhava" },
  12: { name: "Expenditures, Solitude, Foreign Stays & Moksha", realm: "Isolation, overseas settlement, subconscious release, and spiritual liberation", sanskrit: "Vyaya Bhava" }
};

// =========================================================================
// 2. HELPER FUNCTIONS
// =========================================================================

/**
 * Returns modality of a sign index (0-11).
 * Movable: 0, 3, 6, 9
 * Fixed: 1, 4, 7, 10
 * Dual: 2, 5, 8, 11
 */
export function getSignModality(signIndex: number): Modality {
  const norm = ((signIndex % 12) + 12) % 12;
  const rem = norm % 3;
  if (rem === 0) return "Movable (Chara)";
  if (rem === 1) return "Fixed (Sthira)";
  return "Dual (Dwiswabhava)";
}

/**
 * Returns Baadhaka house offset and house number from reference sign.
 * Movable -> 11th house (+10 signs)
 * Fixed -> 9th house (+8 signs)
 * Dual -> 7th house (+6 signs)
 */
export function getBaadhakaHouseRule(signIndex: number): {
  houseNumber: number; // 11, 9, or 7
  signOffset: number; // 10, 8, or 6
  modality: Modality;
} {
  const mod = getSignModality(signIndex);
  if (mod === "Movable (Chara)") {
    return { houseNumber: 11, signOffset: 10, modality: mod };
  } else if (mod === "Fixed (Sthira)") {
    return { houseNumber: 9, signOffset: 8, modality: mod };
  } else {
    return { houseNumber: 7, signOffset: 6, modality: mod };
  }
}

/**
 * Normalizes an angle into [0, 360).
 */
export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/**
 * Computes shortest angular distance between two degrees in [0, 180].
 */
export function getAngularDistance(deg1: number, deg2: number): number {
  const diff = Math.abs(normalizeAngle(deg1) - normalizeAngle(deg2));
  return diff > 180 ? 360 - diff : diff;
}

// =========================================================================
// 3. MULTI-LAGNA BAADHAKA AUDIT (SESSION 84)
// =========================================================================

export type MultiLagnaFrame = 
  | "Physical Lagna (D1)"
  | "Moon Lagna (Chandra)"
  | "Sun Lagna (Surya)"
  | "Paka Lagna (Lagnesha)";

export interface MultiLagnaBaadhakaEntry {
  frame: MultiLagnaFrame;
  referenceSignIndex: number;
  referenceSignName: string;
  referenceSanskrit: string;
  modality: Modality;
  baadhakaHouse: number; // 11, 9, or 7
  baadhakaSignIndex: number;
  baadhakaSignName: string;
  baadhakaSanskrit: string;
  primaryLord: string;
  coLord: string | null;
  baadhakeshPlacement: {
    houseFromLagna: number;
    houseFromFrame: number;
    signIndex: number;
    signName: string;
  };
  occupantsInBaadhaka: string[];
  karmicTheme: string;
  manifestationFriction: string;
  resolutionPathway: string;
}

export interface MultiLagnaAuditResult {
  physicalLagna: MultiLagnaBaadhakaEntry;
  moonLagna: MultiLagnaBaadhakaEntry;
  sunLagna: MultiLagnaBaadhakaEntry;
  pakaLagna: MultiLagnaBaadhakaEntry;
  allFrames: MultiLagnaBaadhakaEntry[];
  synthesis: string;
}

/**
 * Calculates Multi-Lagna Baadhaka Audit across Physical, Moon, Sun, and Paka Lagnas.
 */
export function calculateMultiLagnaBaadhaka(natalEphem: EphemerisResult): MultiLagnaAuditResult {
  const ascSignIdx = getBodySignIndex(natalEphem.ascendant);
  const moonSignIdx = getBodySignIndex(natalEphem.planets.Moon);
  const sunSignIdx = getBodySignIndex(natalEphem.planets.Sun);

  // Paka Lagna is sign occupied by D1 Lagna Lord
  const lagnaLord = SIGN_PRIMARY_LORDS[ascSignIdx];
  const lagnaLordPlanet = natalEphem.planets[lagnaLord];
  const pakaSignIdx = lagnaLordPlanet ? getBodySignIndex(lagnaLordPlanet) : ascSignIdx;

  // Helper to find planets in a given sign index
  const getOccupants = (signIdx: number): string[] => {
    const list: string[] = [];
    for (const [pName, pData] of Object.entries(natalEphem.planets)) {
      if (pData && getBodySignIndex(pData) === signIdx) {
        list.push(pName);
      }
    }
    return list;
  };

  const buildEntry = (frame: MultiLagnaFrame, refSignIdx: number): MultiLagnaBaadhakaEntry => {
    const rule = getBaadhakaHouseRule(refSignIdx);
    const baadhakaSignIdx = (refSignIdx + rule.signOffset) % 12;
    const primaryLord = SIGN_PRIMARY_LORDS[baadhakaSignIdx];
    const coLord = SIGN_CO_LORDS[baadhakaSignIdx];

    const lordData = natalEphem.planets[primaryLord];
    const lordSignIdx = lordData ? getBodySignIndex(lordData) : 0;
    const houseFromLagna = ((lordSignIdx - ascSignIdx + 12) % 12) + 1;
    const houseFromFrame = ((lordSignIdx - refSignIdx + 12) % 12) + 1;
    const occupants = getOccupants(baadhakaSignIdx);

    let karmicTheme = "";
    let manifestationFriction = "";
    let resolutionPathway = "";

    if (frame === "Physical Lagna (D1)") {
      karmicTheme = "Tangible bodily constitution, environmental challenges, and external physical roadblocks.";
      if (rule.houseNumber === 11) {
        manifestationFriction = "Obstructions through broad social networks, elder siblings, cash flow delays, and superficial friendships.";
        resolutionPathway = "Patience with community circles, selfless service, avoiding transactional friendships, and turning obstruction into massive worldly gains (Viparita transformation).";
      } else if (rule.houseNumber === 9) {
        manifestationFriction = "Friction with teachers/mentors, paternal disagreements, dogmatic philosophical rigidities, and hurdles in foreign travels.";
        resolutionPathway = "Humility before gurus, embracing spiritual diversity, respecting father figures, and honoring divine dharma.";
      } else {
        manifestationFriction = "Projection of insecurities onto spouse, legal contractual hurdles, interpersonal friction, and public misunderstandings.";
        resolutionPathway = "Conscious boundary maintenance, transparent communication with partners, and mutual autonomy.";
      }
    } else if (frame === "Moon Lagna (Chandra)") {
      karmicTheme = "Emotional karma (Manas), subconscious desire friction, psychic anxiety, and fluctuating mental peace.";
      manifestationFriction = `Subconscious fear and emotional knots centered on ${ZODIAC_SIGNS[baadhakaSignIdx]} themes and ${rule.houseNumber}th house from Moon.`;
      resolutionPathway = "Pranayama, emotional stillness, avoiding impulsive mood-driven decisions, and regular Shiva sadhana.";
    } else if (frame === "Sun Lagna (Surya)") {
      karmicTheme = "Soul purpose (Atma), willpower, institutional hurdles, government/authority friction, and paternal karma.";
      manifestationFriction = `Ego confrontations and obstacles in claiming public leadership or vocational autonomy in ${ZODIAC_SIGNS[baadhakaSignIdx]}.`;
      resolutionPathway = "Subordinating individual ego to higher divine duty (Maryada Purushottama Rama), ethical transparency, and disciplined service.";
    } else {
      karmicTheme = "Action execution (Paka Lagna), field of effort deployment, and friction in actualizing plans.";
      manifestationFriction = `Operational resistance where effort is deployed; tasks require double perseverance when interacting with ${ZODIAC_SIGNS[baadhakaSignIdx]} energy.`;
      resolutionPathway = "Methodical planning, avoiding hasty shortcuts, resilience against initial delays, and accepting Karma Phala.";
    }

    return {
      frame,
      referenceSignIndex: refSignIdx,
      referenceSignName: ZODIAC_SIGNS[refSignIdx],
      referenceSanskrit: RASHI_SANSKRIT[refSignIdx],
      modality: rule.modality,
      baadhakaHouse: rule.houseNumber,
      baadhakaSignIndex: baadhakaSignIdx,
      baadhakaSignName: ZODIAC_SIGNS[baadhakaSignIdx],
      baadhakaSanskrit: RASHI_SANSKRIT[baadhakaSignIdx],
      primaryLord,
      coLord,
      baadhakeshPlacement: {
        houseFromLagna,
        houseFromFrame,
        signIndex: lordSignIdx,
        signName: ZODIAC_SIGNS[lordSignIdx]
      },
      occupantsInBaadhaka: occupants,
      karmicTheme,
      manifestationFriction,
      resolutionPathway
    };
  };

  const physicalLagna = buildEntry("Physical Lagna (D1)", ascSignIdx);
  const moonLagna = buildEntry("Moon Lagna (Chandra)", moonSignIdx);
  const sunLagna = buildEntry("Sun Lagna (Surya)", sunSignIdx);
  const pakaLagna = buildEntry("Paka Lagna (Lagnesha)", pakaSignIdx);

  const allFrames = [physicalLagna, moonLagna, sunLagna, pakaLagna];

  // Check convergence (e.g. if Moon and D1 share same Baadhaka)
  const signs = allFrames.map(f => f.baadhakaSignIndex);
  const uniqueSigns = new Set(signs);
  let synthesis = "";
  if (uniqueSigns.size <= 2) {
    synthesis = `Intense Karmic Convergence: Multiple reference lagnas share common Baadhaka sign (${[...uniqueSigns].map(s => ZODIAC_SIGNS[s]).join(", ")}). This indicates a focused, non-negotiable life lesson in that specific realm.`;
  } else {
    synthesis = `Multi-Dimensional Spectrum: Baadhakas are distributed across distinct domains (${[...uniqueSigns].map(s => ZODIAC_SIGNS[s]).join(", ")}), allowing targeted resolution across physical, emotional, and execution fields.`;
  }

  return {
    physicalLagna,
    moonLagna,
    sunLagna,
    pakaLagna,
    allFrames,
    synthesis
  };
}

// =========================================================================
// 4. RELATIVE HOUSE BAADHAKA FOR ALL 12 HOUSES (SESSION 82)
// =========================================================================

export interface RelativeHouseBaadhakaEntry {
  houseNumber: number; // 1-12
  houseSignIndex: number;
  houseSignName: string;
  houseSanskrit: string;
  modality: Modality;
  relativeBaadhakaHouseNum: number; // 11, 9, or 7 from this house
  absoluteChartHouseNum: number; // 1-12 in natal chart
  relativeBaadhakaSignIndex: number;
  relativeBaadhakaSignName: string;
  relativeBaadhakaSanskrit: string;
  relativeBaadhakesh: string;
  livingSignification: string;
  livingRealm: string;
  obstructionVector: string;
  viparitaRemedy: string;
}

export interface RelativeHouseBaadhakaReport {
  ascendantSignIndex: number;
  ascendantSignName: string;
  houses: RelativeHouseBaadhakaEntry[];
  pivotalIntersections: string[];
}

/**
 * Calculates Relative Baadhaka for each of the 12 houses (H1 to H12).
 * Each house functions as an independent reference frame.
 */
export function calculateRelativeHouseBaadhakas(natalEphem: EphemerisResult): RelativeHouseBaadhakaReport {
  const ascSignIdx = getBodySignIndex(natalEphem.ascendant);
  const houses: RelativeHouseBaadhakaEntry[] = [];
  const pivotalIntersections: string[] = [];

  for (let h = 1; h <= 12; h++) {
    const houseSignIdx = (ascSignIdx + (h - 1)) % 12;
    const rule = getBaadhakaHouseRule(houseSignIdx);
    const absHouseNum = (((h - 1) + rule.signOffset) % 12) + 1;
    const baadhakaSignIdx = (houseSignIdx + rule.signOffset) % 12;
    const relBaadhakesh = SIGN_PRIMARY_LORDS[baadhakaSignIdx];
    const sig = HOUSE_LIVING_SIGNIFICATIONS[h];

    // Shastric manifestation details for each specific relative house
    let obstructionVector = "";
    let viparitaRemedy = "";

    if (h === 1) {
      obstructionVector = `Primary life obstruction through House ${absHouseNum} (${ZODIAC_SIGNS[baadhakaSignIdx]}), governed by ${relBaadhakesh}. Direct friction on personal health and life path.`;
      viparitaRemedy = "Conscious self-awareness, resolving boundary friction, and transforming obstruction into vitality.";
    } else if (h === 4) {
      // 4th house (Mother / Home / Domestic peace)
      if (rule.houseNumber === 11) {
        obstructionVector = `11th from 4th is House 2 (${ZODIAC_SIGNS[baadhakaSignIdx]}): Family speech, money disputes, or eating habits disrupt domestic peace, property tranquility, or mother's health.`;
        viparitaRemedy = "Maitri speech within the home, transparent family budgeting, and creating a calm sattvic kitchen.";
      } else if (rule.houseNumber === 9) {
        obstructionVector = `9th from 4th is House 12 (${ZODIAC_SIGNS[baadhakaSignIdx]}): Foreign relocations, excessive expenditures, or emotional isolation become the hurdle to rooted domestic happiness.`;
        viparitaRemedy = "Anchoring domestic spiritual rituals, avoiding unbudgeted luxury expenditures, and mindful home solitude.";
      } else {
        obstructionVector = `7th from 4th is House 10 (${ZODIAC_SIGNS[baadhakaSignIdx]}): Intense career stress, public obligations, or workplace politics pull attention away from domestic contentment.`;
        viparitaRemedy = "Rigorous boundaries between professional duty and family sanctity; honoring evening domestic downtime.";
      }
    } else if (h === 5) {
      // 5th house (Children / Intellect / Purva Punya)
      obstructionVector = `${rule.houseNumber}th from 5th is House ${absHouseNum} (${ZODIAC_SIGNS[baadhakaSignIdx]}): Creative blocks, friction with children, or speculative anxiety emerge through House ${absHouseNum}.`;
      viparitaRemedy = "Encouraging children's autonomy, humble learning, avoiding speculative greed, and chanting Saraswati/Gayatri mantra.";
    } else if (h === 7) {
      // 7th house (Spouse / Partnerships)
      if (rule.houseNumber === 7) {
        obstructionVector = `7th from 7th is House 1 (Lagna): The native themselves—their personal ego, projections, and habits—acts as the primary Baadhaka for the spouse!`;
        pivotalIntersections.push("Self as Partner's Baadhaka: 7th from 7th is Lagna, indicating native's own ego is spouse's obstruction.");
        viparitaRemedy = "Self-auditing, letting go of personal defensiveness, and giving the partner room for independent expression.";
      } else if (rule.houseNumber === 11) {
        obstructionVector = `11th from 7th is House 5 (${ZODIAC_SIGNS[baadhakaSignIdx]}): Children's demands, speculative risks, or creative divergences create strain between partners.`;
        viparitaRemedy = "Collaborative parenting, shared creative hobbies, and united financial governance.";
      } else {
        obstructionVector = `9th from 7th is House 3 (${ZODIAC_SIGNS[baadhakaSignIdx]}): In-laws, siblings, neighborly interference, or restless short trips create partnership friction.`;
        viparitaRemedy = "Firm external boundaries against intrusive relatives and calm, direct dialogue between partners.";
      }
    } else if (h === 9) {
      // 9th house (Father / Guru / Dharma)
      obstructionVector = `${rule.houseNumber}th from 9th is House ${absHouseNum} (${ZODIAC_SIGNS[baadhakaSignIdx]}): Dogmatic friction with gurus, philosophical clashes, or father's hurdles emerge via House ${absHouseNum}.`;
      viparitaRemedy = "Surrendering intellectual arrogance before spiritual guides and offering selfless service (Guru Seva).";
    } else if (h === 10) {
      // 10th house (Career / Status)
      obstructionVector = `${rule.houseNumber}th from 10th is House ${absHouseNum} (${ZODIAC_SIGNS[baadhakaSignIdx]}): Professional plateaus, executive delays, or organizational politics emerge through House ${absHouseNum}.`;
      viparitaRemedy = "Integrity in executive duty, patience during career delays, and rejecting corrupt corporate shortcuts.";
    } else {
      obstructionVector = `${rule.houseNumber}th from House ${h} falls in House ${absHouseNum} (${ZODIAC_SIGNS[baadhakaSignIdx]}), ruled by ${relBaadhakesh}, impacting ${sig.name.toLowerCase()}.`;
      viparitaRemedy = `Recognizing House ${absHouseNum} triggers as growth catalysts rather than fatal curses.`;
    }

    houses.push({
      houseNumber: h,
      houseSignIndex: houseSignIdx,
      houseSignName: ZODIAC_SIGNS[houseSignIdx],
      houseSanskrit: RASHI_SANSKRIT[houseSignIdx],
      modality: rule.modality,
      relativeBaadhakaHouseNum: rule.houseNumber,
      absoluteChartHouseNum: absHouseNum,
      relativeBaadhakaSignIndex: baadhakaSignIdx,
      relativeBaadhakaSignName: ZODIAC_SIGNS[baadhakaSignIdx],
      relativeBaadhakaSanskrit: RASHI_SANSKRIT[baadhakaSignIdx],
      relativeBaadhakesh: relBaadhakesh,
      livingSignification: sig.name,
      livingRealm: sig.realm,
      obstructionVector,
      viparitaRemedy
    });
  }

  return {
    ascendantSignIndex: ascSignIdx,
    ascendantSignName: ZODIAC_SIGNS[ascSignIdx],
    houses,
    pivotalIntersections
  };
}

// =========================================================================
// 5. ARIES-AQUARIUS 11TH DEEP DIVE & PLANETARY OCCUPANT PROFILES (SESSION 84)
// =========================================================================

export interface BaadhakaPlanetProfile {
  planet: string;
  isOccupant: boolean;
  isLord: boolean;
  archetypePattern: string;
  psychologicalFriction: string;
  karmaTrap: string;
  resolutionSadhana: string;
}

export interface AriesAquariusDeepDiveResult {
  isAriesAscendant: boolean;
  aquariusHouse: number; // 11
  coLords: { primary: "Saturn"; coLord: "Rahu" };
  airFixedDynamics: string;
  occupantProfiles: BaadhakaPlanetProfile[];
  primaryLesson: string;
}

export const PLANETARY_BAADHAKA_TEMPLATES: Record<string, {
  archetypePattern: string;
  psychologicalFriction: string;
  karmaTrap: string;
  resolutionSadhana: string;
}> = {
  Jupiter: {
    archetypePattern: "The Dogmatic Counselor / Spiritual Preacher",
    psychologicalFriction: "Spiritual arrogance, paternalistic over-advice, expecting veneration from network or elders.",
    karmaTrap: "Giving unsolicited advice, getting disappointed when peers do not honor your wisdom, or financially over-expanding.",
    resolutionSadhana: "Silent wisdom, seeking true mentors rather than preaching, ethical business dealings, and Brihaspati sadhana."
  },
  Saturn: {
    archetypePattern: "The Heavy Burden / Systemic Taskmaster",
    psychologicalFriction: "Chronic delays, feeling burdened by friends/institutions, structural roadblocks, feeling undervalued.",
    karmaTrap: "Cynicism, cold isolation, bitterness toward authority, or trying to rush through natural maturation cycles.",
    resolutionSadhana: "Humble service to the working class, non-entitled persistence, meticulous structural organization, and Shani mantra."
  },
  Venus: {
    archetypePattern: "The Superficial Glamor / Relational Seduction",
    psychologicalFriction: "Vanity, superficial validation, social gossip, luxury overspending to impress peers, female drama.",
    karmaTrap: "Confusing public admiration with genuine intimacy; wasting resources on external pretense and flattery.",
    resolutionSadhana: "Cultivating pure artistic expression, authentic relationships, valuing substance over image, and Lakshmi sadhana."
  },
  Moon: {
    archetypePattern: "The Vacillating Wave / Emotional Dependency",
    psychologicalFriction: "Erratic mood swings, emotional hypersensitivity, food/dietary compulsions, dependence on group approval.",
    karmaTrap: "Making impulsive financial or relational commitments on mood highs, followed by withdrawal during emotional lows.",
    resolutionSadhana: "Pranayama, drinking water from silver vessels, maintaining consistent daily routines, and Chandra meditation."
  },
  Mercury: {
    archetypePattern: "The Hyper-Analytic Skeptic / Transactional Dealmaker",
    psychologicalFriction: "Overthinking, calculation errors, communication misunderstandings, cynicism, deceitful business associates.",
    karmaTrap: "Intellectual arrogance, trying to outsmart everyone with clever contracts, or getting caught in bureaucratic red tape.",
    resolutionSadhana: "Vak Shuddhi (truthful and gentle speech), transparent bookkeeping, simplicity in contracts, and Budha sadhana."
  },
  Rahu: {
    archetypePattern: "The Insatiable Ambition / High-Tech Illusionist",
    psychologicalFriction: "Obsession with viral fame, foreign or unconventional shortcuts, impostor syndrome, high anxiety / F.E.A.R.",
    karmaTrap: "Falling for speculative get-rich-quick schemes, trusting fraudulent foreign networks, or manufacturing public illusions.",
    resolutionSadhana: "Strict adherence to legal/ethical codes, grounding in nature, dispelling illusions, and Lord Shiva sadhana."
  },
  Mars: {
    archetypePattern: "The Fiery Challenger / Competitive Pugilist",
    psychologicalFriction: "Impulsive disputes, fiery peer rivalry, aggressive debates in groups, impatience leading to litigation or burnout.",
    karmaTrap: "Burning bridges with allies through hasty anger, forcing outcomes through intimidation, or risky physical gambles.",
    resolutionSadhana: "Channeled physical discipline (athletics/yoga), taking 10 deep breaths before reacting, and Hanuman Chalisa."
  },
  Sun: {
    archetypePattern: "The Authoritarian King / Prideful Sovereign",
    psychologicalFriction: "Ego clashes with network leaders, inability to work under equals, paternal friction, feeling unrecognized.",
    karmaTrap: "Demanding sovereign attention in collective spaces; alienating potential benefactors through rigid pride.",
    resolutionSadhana: "Aditya Hridaya Stotram, bowing before spiritual authority, practicing selfless leadership without title."
  },
  Ketu: {
    archetypePattern: "The Dissolving Ascetic / Enigmatic Renouncer",
    psychologicalFriction: "Feeling chronic alienation from friends, sudden severed ties, apathy toward worldly gains, mysterious losses.",
    karmaTrap: "Nihilism, erratic abandonment of responsibilities, or resisting inevitable spiritual detachments.",
    resolutionSadhana: "Total non-attachment to outcomes, silent meditation at sunrise/sunset, and worship of Ganesha and Lord Shiva."
  }
};

/**
 * Evaluates Aquarius 11th Baadhaka for Aries Lagna and provides detailed profiles
 * for whichever planets occupy the native's natal Baadhaka Bhava.
 */
export function evaluateAriesAquariusBaadhaka(natalEphem: EphemerisResult): AriesAquariusDeepDiveResult {
  const ascSignIdx = getBodySignIndex(natalEphem.ascendant);
  const isAries = ascSignIdx === 0;

  // Determine the native's natal Baadhaka sign
  const rule = getBaadhakaHouseRule(ascSignIdx);
  const baadhakaSignIdx = (ascSignIdx + rule.signOffset) % 12;
  const baadhakaLord = SIGN_PRIMARY_LORDS[baadhakaSignIdx];

  // Identify occupants in the Baadhaka Bhava
  const occupantNames: string[] = [];
  for (const [pName, pData] of Object.entries(natalEphem.planets)) {
    if (pData && getBodySignIndex(pData) === baadhakaSignIdx) {
      occupantNames.push(pName);
    }
  }

  // Build profiles for all classical planets
  const occupantProfiles: BaadhakaPlanetProfile[] = Object.keys(PLANETARY_BAADHAKA_TEMPLATES).map((pName) => {
    const isOccupant = occupantNames.includes(pName);
    const isLord = baadhakaLord === pName || (baadhakaSignIdx === 10 && pName === "Rahu") || (baadhakaSignIdx === 7 && pName === "Ketu");
    const tpl = PLANETARY_BAADHAKA_TEMPLATES[pName];
    return {
      planet: pName,
      isOccupant,
      isLord,
      archetypePattern: tpl.archetypePattern,
      psychologicalFriction: tpl.psychologicalFriction,
      karmaTrap: tpl.karmaTrap,
      resolutionSadhana: tpl.resolutionSadhana
    };
  });

  const airFixedDynamics = isAries
    ? "Aquarius (Kumbha) as 11th House Baadhaka combines the Air element (ideas, networks, intellectual concepts) with Fixed modality (unyielding stubbornness, rigidity). Co-ruled by Saturn (duty, delay, limits) and Rahu (infinite hunger, technological eccentricity), it forces Aries to transcend impulsive egoism into structured, selfless humanitarian service."
    : `Native has ${ZODIAC_SIGNS[ascSignIdx]} Ascendant (${rule.modality}), placing the Baadhaka Bhava in House ${rule.houseNumber} (${ZODIAC_SIGNS[baadhakaSignIdx]}), ruled by ${baadhakaLord}.`;

  const primaryLesson = isAries
    ? "Aries natives must learn that the 11th house is not a battlefield to conquer through brute force. Saturn demands patience and humble service, while Rahu tests ethical boundaries. Once Aries accepts collective collaboration without dominating, Aquarius becomes their greatest source of wealth and influence."
    : `The native must consciously integrate the tests of House ${rule.houseNumber} (${ZODIAC_SIGNS[baadhakaSignIdx]}) rather than attempting quick superstitious bypasses.`;

  return {
    isAriesAscendant: isAries,
    aquariusHouse: 11,
    coLords: { primary: "Saturn", coLord: "Rahu" },
    airFixedDynamics,
    occupantProfiles,
    primaryLesson
  };
}

// =========================================================================
// 6. VIPARITA RAJA YOGA & 1ST/5TH HOUSE RELEASE DYNAMICS (SESSIONS 82 & 84)
// =========================================================================

export interface ViparitaTransformationTelemetry {
  baadhakaHouse: number;
  baadhakaSignName: string;
  baadhakesh: string;
  viparitaPotentialLevel: "Supreme" | "High" | "Moderate" | "Guarded";
  viparitaRationale: string;
  firstHouseAmplificationScore: number; // 0-100 (vitality, charisma, leadership)
  firstHouseReleaseManifestation: string;
  fifthHouseAmplificationScore: number; // 0-100 (purva punya, creative genius, buddhi)
  fifthHouseReleaseManifestation: string;
  totkaWarning: string;
  coreAphorism: string;
}

/**
 * Evaluates the transformation of Baadhaka into Viparita-style Raja Yoga
 * and computes 1st/5th house liberation telemetry.
 */
export function evaluateBaadhakaViparitaYoga(natalEphem: EphemerisResult): ViparitaTransformationTelemetry {
  const ascSignIdx = getBodySignIndex(natalEphem.ascendant);
  const rule = getBaadhakaHouseRule(ascSignIdx);
  const baadhakaSignIdx = (ascSignIdx + rule.signOffset) % 12;
  const baadhakesh = SIGN_PRIMARY_LORDS[baadhakaSignIdx];

  // Check Baadhakesh placement
  const lordData = natalEphem.planets[baadhakesh];
  const lordHouse = lordData ? ((getBodySignIndex(lordData) - ascSignIdx + 12) % 12) + 1 : 1;

  // Dusthana placement (6, 8, 12) of Baadhakesh creates classic Viparita Raja Yoga dynamics!
  const isDusthanaPlaced = [6, 8, 12].includes(lordHouse);
  const isKendraTrikonaPlaced = [1, 4, 5, 7, 9, 10, 11].includes(lordHouse);

  let viparitaPotentialLevel: "Supreme" | "High" | "Moderate" | "Guarded" = "Moderate";
  let viparitaRationale = "";

  if (isDusthanaPlaced) {
    viparitaPotentialLevel = "Supreme";
    viparitaRationale = `Baadhakesh ${baadhakesh} is seated in Dusthana House ${lordHouse}. In Medhaj Baadhak mechanics, when the obstruction lord is trapped in a house of struggle or dissolution, the obstructive energy turns inward on itself, liberating immense outward fortune (Viparita transformation).`;
  } else if (isKendraTrikonaPlaced) {
    viparitaPotentialLevel = "High";
    viparitaRationale = `Baadhakesh ${baadhakesh} is seated in auspicious House ${lordHouse}. Obstacles require active diplomatic or intellectual mastery, but once resolved through maturity, yield long-lasting status.`;
  } else {
    viparitaPotentialLevel = "Moderate";
    viparitaRationale = `Baadhakesh ${baadhakesh} is seated in House ${lordHouse}. Obstructions are gradual and tied to daily responsibilities.`;
  }

  // 1st and 5th house scoring
  let h1Score = 65;
  let h5Score = 65;

  if (isDusthanaPlaced) {
    h1Score += 20;
    h5Score += 25;
  }
  // Check benefic aspects or occupants in 1st/5th
  const occupantsIn1 = Object.values(natalEphem.planets).filter(p => p && p.house === 1);
  const occupantsIn5 = Object.values(natalEphem.planets).filter(p => p && p.house === 5);

  if (occupantsIn1.some(p => ["Jupiter", "Venus", "Mercury"].includes(p.name))) h1Score += 10;
  if (occupantsIn5.some(p => ["Jupiter", "Venus", "Moon"].includes(p.name))) h5Score += 10;

  h1Score = Math.min(98, Math.max(30, h1Score));
  h5Score = Math.min(98, Math.max(30, h5Score));

  const firstHouseReleaseManifestation = `When Baadhaka friction is acknowledged without resentment, energy flows directly into the 1st House (${ZODIAC_SIGNS[ascSignIdx]}): Radiates high physical stamina, commanding magnetic presence, clear self-identity, and robust immunity.`;
  const fifthHouseReleaseManifestation = `Energy released into the 5th House (${ZODIAC_SIGNS[(ascSignIdx + 4) % 12]}): Awakens Purva Punya, rapid intuitive discernment (Buddhi), sharp strategic thinking, creative breakthroughs, and joy through progeny.`;

  const totkaWarning = "Session 84 Invariant: No superficial 'totka', magic gem, or superstitious shortcut can cancel Karma Phala. Baadhaka is a karmic debt that dissolves ONLY through conscious acceptance, ethical self-correction, and righteous action.";
  const coreAphorism = "Remember the sacred law taught by Medhaj Astro: 'You meet the same people while climbing down that you met while climbing up.' Treat every person and obstacle with equanimity and humility.";

  return {
    baadhakaHouse: rule.houseNumber,
    baadhakaSignName: ZODIAC_SIGNS[baadhakaSignIdx],
    baadhakesh,
    viparitaPotentialLevel,
    viparitaRationale,
    firstHouseAmplificationScore: h1Score,
    firstHouseReleaseManifestation,
    fifthHouseAmplificationScore: h5Score,
    fifthHouseReleaseManifestation,
    totkaWarning,
    coreAphorism
  };
}

// =========================================================================
// 7. RAHU-KETU NODAL TRANSITS & AXIS KARMA (SESSION 85)
// =========================================================================

export interface NodalTransitAnalysisResult {
  evaluationDate: string;
  nativeAgeYears: number;
  natalRahuLongitude: number;
  natalRahuSign: string;
  natalKetuLongitude: number;
  natalKetuSign: string;
  transitRahuLongitude: number;
  transitRahuSign: string;
  transitKetuLongitude: number;
  transitKetuSign: string;
  isNodalReturnActive: boolean; // ~18.59 yr cycle
  isNodalReverseReturnActive: boolean; // ~9.3 yr cycle
  isNodalSquareActive: boolean; // ~4.65 or ~13.95 yr cycles
  nodalCyclePhase: string;
  isTransitRahuInBaadhaka: boolean;
  isTransitKetuInBaadhaka: boolean;
  taurusScorpioAxisActive: boolean;
  taurusScorpioInterpretation: string;
  fearMetricScore: number; // 0-100 (False Evidence Appearing Real)
  fearDiagnostics: string;
  shivaPariharaProtocol: string;
}

/**
 * Evaluates Rahu-Ketu nodal transits relative to natal Baadhaka,
 * the 18.5-year cycle, the Taurus-Scorpio axis, and F.E.A.R. dissolution.
 */
export function evaluateNodalBaadhakaTransits(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult,
  birthDate: Date,
  evaluationDate: Date
): NodalTransitAnalysisResult {
  const ascSignIdx = getBodySignIndex(natalEphem.ascendant);
  const rule = getBaadhakaHouseRule(ascSignIdx);
  const baadhakaSignIdx = (ascSignIdx + rule.signOffset) % 12;

  // Longitudes
  const nRahuLon = natalEphem.planets.Rahu ? natalEphem.planets.Rahu.siderealLongitude : 0;
  const nKetuLon = natalEphem.planets.Ketu ? natalEphem.planets.Ketu.siderealLongitude : (nRahuLon + 180) % 360;

  const tRahuLon = transitEphem.planets.Rahu ? transitEphem.planets.Rahu.siderealLongitude : 0;
  const tKetuLon = transitEphem.planets.Ketu ? transitEphem.planets.Ketu.siderealLongitude : (tRahuLon + 180) % 360;

  const tRahuSignIdx = Math.floor(tRahuLon / 30);
  const tKetuSignIdx = Math.floor(tKetuLon / 30);

  const nRahuSignIdx = Math.floor(nRahuLon / 30);
  const nKetuSignIdx = Math.floor(nKetuLon / 30);

  // Age calculation
  const diffMs = evaluationDate.getTime() - birthDate.getTime();
  const nativeAgeYears = Math.max(0, diffMs / (1000 * 60 * 60 * 24 * 365.25));

  // Angular distance between natal and transit Rahu
  const rahuDelta = getAngularDistance(tRahuLon, nRahuLon);
  const ketuDelta = getAngularDistance(tKetuLon, nKetuLon);

  // 18.59-year nodal return (orb ~15° or same sign)
  const isNodalReturnActive = rahuDelta <= 15 || (tRahuSignIdx === nRahuSignIdx);

  // Reverse return (~9.3-year: Rahu over natal Ketu)
  const rahuOverNatalKetuDelta = getAngularDistance(tRahuLon, nKetuLon);
  const isNodalReverseReturnActive = rahuOverNatalKetuDelta <= 15 || (tRahuSignIdx === nKetuSignIdx);

  // Nodal square (approx 90° or 270°, orb 10°)
  const isNodalSquareActive = Math.abs(rahuDelta - 90) <= 10;

  let nodalCyclePhase = "Stable Mid-Cycle";
  if (isNodalReturnActive) {
    nodalCyclePhase = "⚡ Major 18.5-Year Nodal Return (Cycle Completion & Destiny Reset)";
  } else if (isNodalReverseReturnActive) {
    nodalCyclePhase = "🔄 9.3-Year Inversion Return (Karmic Polarity Flip)";
  } else if (isNodalSquareActive) {
    nodalCyclePhase = "⚖️ Nodal Square Friction (Mid-Cycle Reality Check)";
  }

  // Baadhaka crossings
  const isTransitRahuInBaadhaka = tRahuSignIdx === baadhakaSignIdx;
  const isTransitKetuInBaadhaka = tKetuSignIdx === baadhakaSignIdx;

  // Taurus-Scorpio axis (Kalapurusha 2nd & 8th houses)
  const isTransitOnTaurusScorpio = (tRahuSignIdx === 1 && tKetuSignIdx === 7) || (tRahuSignIdx === 7 && tKetuSignIdx === 1);
  const isNatalOnTaurusScorpio = (nRahuSignIdx === 1 && nKetuSignIdx === 7) || (nRahuSignIdx === 7 && nKetuSignIdx === 1);
  const taurusScorpioAxisActive = isTransitOnTaurusScorpio || isNatalOnTaurusScorpio;

  let taurusScorpioInterpretation = "";
  if (taurusScorpioAxisActive) {
    taurusScorpioInterpretation = "Kalapurusha 2nd/8th Axis Dynamic: Rahu in Taurus demands scrutiny over material amassing, speech integrity, and dietary purity. Ketu in Scorpio vigorously strips away unearned or corrupt assets, purging toxic dependencies and forcing deep subterranean transformation.";
  } else {
    taurusScorpioInterpretation = `Active Nodal Axis spans ${ZODIAC_SIGNS[tRahuSignIdx]} (Rahu - future appetite) and ${ZODIAC_SIGNS[tKetuSignIdx]} (Ketu - past dissolution).`;
  }

  // F.E.A.R. Score (False Evidence Appearing Real)
  let fearMetricScore = 35;
  if (isTransitRahuInBaadhaka) fearMetricScore += 35;
  if (isTransitKetuInBaadhaka) fearMetricScore += 25;
  if (isNodalReturnActive) fearMetricScore += 20;
  if (isNodalSquareActive) fearMetricScore += 15;
  fearMetricScore = Math.min(95, Math.max(15, fearMetricScore));

  let fearDiagnostics = "";
  if (fearMetricScore >= 70) {
    fearDiagnostics = "CRITICAL F.E.A.R. ALERT: Rahu is amplifying catastrophic projections ('False Evidence Appearing Real'). Recognize that 80% of current anxieties are illusory mirages created by nodal transit over sensitive karmic points.";
  } else if (fearMetricScore >= 45) {
    fearDiagnostics = "MODERATE F.E.A.R. WAVE: Mild cognitive anxiety and restlessness regarding future milestones. Discern between grounded facts and projected mental dread.";
  } else {
    fearDiagnostics = "GROUNDED COGNITIVE CLARITY: Nodal transits are operating quietly; mind is well-anchored in realistic perception.";
  }

  const shivaPariharaProtocol = "Session 85 Antidote: Lord Shiva is the Mahakaal who effortlessly commands Rahu (serpent around His neck) and dissolves Ketu's karmic knots. Daily japa of 'Om Namah Shivaya', offering pure water or bilva leaves on Shivalinga at sunrise or sunset, and practicing silent detachment will completely disarm Rahu's F.E.A.R.";

  return {
    evaluationDate: evaluationDate.toISOString().slice(0, 10),
    nativeAgeYears: parseFloat(nativeAgeYears.toFixed(1)),
    natalRahuLongitude: parseFloat(nRahuLon.toFixed(2)),
    natalRahuSign: ZODIAC_SIGNS[nRahuSignIdx],
    natalKetuLongitude: parseFloat(nKetuLon.toFixed(2)),
    natalKetuSign: ZODIAC_SIGNS[nKetuSignIdx],
    transitRahuLongitude: parseFloat(tRahuLon.toFixed(2)),
    transitRahuSign: ZODIAC_SIGNS[tRahuSignIdx],
    transitKetuLongitude: parseFloat(tKetuLon.toFixed(2)),
    transitKetuSign: ZODIAC_SIGNS[tKetuSignIdx],
    isNodalReturnActive,
    isNodalReverseReturnActive,
    isNodalSquareActive,
    nodalCyclePhase,
    isTransitRahuInBaadhaka,
    isTransitKetuInBaadhaka,
    taurusScorpioAxisActive,
    taurusScorpioInterpretation,
    fearMetricScore,
    fearDiagnostics,
    shivaPariharaProtocol
  };
}

// =========================================================================
// 8. MASTER REPORT GENERATOR (SESSIONS 82, 84, 85 SYNTHESIS)
// =========================================================================

export interface MedhajBaadhakMasterReport {
  generatedAt: string;
  birthDate: string;
  evaluationDate: string;
  ascendant: {
    signIndex: number;
    signName: string;
    sanskritName: string;
    modality: Modality;
  };
  baadhakaPrimary: {
    houseNumber: number;
    signIndex: number;
    signName: string;
    sanskritName: string;
    lord: string;
    coLord: string | null;
  };
  multiLagnaAudit: MultiLagnaAuditResult;
  relativeHouseBaadhakas: RelativeHouseBaadhakaReport;
  ariesAquariusProfile: AriesAquariusDeepDiveResult;
  viparitaYoga: ViparitaTransformationTelemetry;
  nodalTransits: NodalTransitAnalysisResult;
  masterExecutiveSummary: string;
}

/**
 * Generates comprehensive Medhaj Astro Baadhak & Nodal Master Report (Sessions 82, 84, 85).
 */
export function generateMedhajBaadhakMasterReport(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult,
  birthDate: Date,
  evaluationDate: Date
): MedhajBaadhakMasterReport {
  const ascSignIdx = getBodySignIndex(natalEphem.ascendant);
  const rule = getBaadhakaHouseRule(ascSignIdx);
  const baadhakaSignIdx = (ascSignIdx + rule.signOffset) % 12;
  const lord = SIGN_PRIMARY_LORDS[baadhakaSignIdx];
  const coLord = SIGN_CO_LORDS[baadhakaSignIdx];

  const multiLagnaAudit = calculateMultiLagnaBaadhaka(natalEphem);
  const relativeHouseBaadhakas = calculateRelativeHouseBaadhakas(natalEphem);
  const ariesAquariusProfile = evaluateAriesAquariusBaadhaka(natalEphem);
  const viparitaYoga = evaluateBaadhakaViparitaYoga(natalEphem);
  const nodalTransits = evaluateNodalBaadhakaTransits(natalEphem, transitEphem, birthDate, evaluationDate);

  const masterExecutiveSummary = `
========================================================================================
MEDHAJ ASTRO BAADHAK THEORY & NODAL TRANSITS MASTER REPORT (SESSIONS 82, 84 & 85)
========================================================================================
1. Primary Lagna Baadhaka:
   - Ascendant: ${ZODIAC_SIGNS[ascSignIdx]} (${rule.modality})
   - Baadhaka Bhava: House ${rule.houseNumber} (${ZODIAC_SIGNS[baadhakaSignIdx]})
   - Baadhakesh: ${lord}${coLord ? ` (Co-Lord: ${coLord})` : ""}

2. Multi-Lagna Audit Synthesis:
   ${multiLagnaAudit.synthesis}

3. Viparita Raja Yoga Transformation:
   - Level: ${viparitaYoga.viparitaPotentialLevel}
   - Vitality (1st House) Release Score: ${viparitaYoga.firstHouseAmplificationScore}/100
   - Purva Punya (5th House) Release Score: ${viparitaYoga.fifthHouseAmplificationScore}/100
   - ${viparitaYoga.viparitaRationale}

4. Nodal Transit & F.E.A.R. Radar:
   - Native Age: ${nodalTransits.nativeAgeYears} Years
   - Cycle Status: ${nodalTransits.nodalCyclePhase}
   - F.E.A.R. Score: ${nodalTransits.fearMetricScore}/100 — ${nodalTransits.fearDiagnostics}
   - Nodal In Baadhaka: Rahu = ${nodalTransits.isTransitRahuInBaadhaka}, Ketu = ${nodalTransits.isTransitKetuInBaadhaka}

5. Universal Shastric Directive:
   - ${viparitaYoga.totkaWarning}
   - ${viparitaYoga.coreAphorism}
   - Sadhana: ${nodalTransits.shivaPariharaProtocol}
========================================================================================
`.trim();

  return {
    generatedAt: new Date().toISOString(),
    birthDate: birthDate.toISOString().slice(0, 10),
    evaluationDate: evaluationDate.toISOString().slice(0, 10),
    ascendant: {
      signIndex: ascSignIdx,
      signName: ZODIAC_SIGNS[ascSignIdx],
      sanskritName: RASHI_SANSKRIT[ascSignIdx],
      modality: rule.modality
    },
    baadhakaPrimary: {
      houseNumber: rule.houseNumber,
      signIndex: baadhakaSignIdx,
      signName: ZODIAC_SIGNS[baadhakaSignIdx],
      sanskritName: RASHI_SANSKRIT[baadhakaSignIdx],
      lord,
      coLord
    },
    multiLagnaAudit,
    relativeHouseBaadhakas,
    ariesAquariusProfile,
    viparitaYoga,
    nodalTransits,
    masterExecutiveSummary
  };
}
