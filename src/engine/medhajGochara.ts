/**
 * Medhaj Astro Gochara & House Activation Engine (Sessions 52 to 60)
 * 
 * References:
 * - Session 52: Transit of the Sun (Surya) - "Torchlight & Script" Rule, 6th/7th/8th Chesthabala Retrogression,
 *   Sankranti & Solar Return, Rama/Dharma Archetype.
 * - Session 53: Transit of the Moon (Chandra) - Pragmatic Krishna Logic vs Rama Moral Law, 12-House Mental State Transit Matrix.
 * - Session 54: Transit of Venus (Shukra) - Morning vs Evening Star Ancestral Support, Sanjeevani Vidya,
 *   4 Natal Contact Overlays (Moon, Mars, Mercury, Ketu).
 * - Session 55: Transit of Mars (Mangal) - 4th/7th/8th Special Transit Desire Aspects, 5 Contact Overlays (Sun, Mercury, Moon, Rahu, Ketu).
 * - Session 56: Transit of Jupiter (Guru) - Inner (1–7) vs Outer (8–12) Hemispheres, Expansion Rule,
 *   Guru-Shani 20-Year Great Cycle ("Abode of God"), Kharmas Logic (Sagittarius/Pisces).
 * - Session 57: Transit of Saturn (Shani) Pt 1 - Cosmic Auditor, 3 Somatic/Anatomical Phases of Sade Sati
 *   (12th: Head/Neck, 1st: Heart/Chest, 2nd: Feet/Legs), Kantaka Shani (7th from Moon or Lagna).
 * - Session 58: Transit of Saturn (Shani) Pt 2 - 3-Cycle 90-Year Human Foundation (0–30, 30–60, 60–90),
 *   15-Year Opposition Trigger, Saturn Transit over Arudha Lagna (AL).
 * - Session 59: Transit of Rahu & Ketu - 9-Year Inverted Nodal Return (Ages 9, 27, 45; Age 27 Pivot),
 *   Karmic Helix (Tail Contraction vs Head Magnification), Kala Sarpa Shiva Remedy.
 * - Session 60: Transits of Outer Planets (Uranus, Neptune, Pluto) - Generational Telemetry,
 *   Uranus (~7y lightning breakthroughs), Neptune (~14y 4D reality), Pluto (demolition of obsolete structures).
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateArudhaPadas } from "./jaimini";
import { detectRahuKetuNuclearBombEffect, NuclearBombAlert } from "./annualHouseProgression";

// ==========================================
// 1. SESSION 52: TRANSIT OF THE SUN (SURYA)
// ==========================================

export interface SunTorchlightTransit {
  occupiedHouseFromLagna: number;
  occupiedSignIndex: number;
  occupiedSignName: string;
  torchlightHouseFromLagna: number;
  torchlightSignIndex: number;
  torchlightSignName: string;
  kalapurushaScript: string;
  environmentalTheme: string;
  torchlightOutcomeDirective: string;
  retrogressionChestabalaTrigger: {
    retrogradesTriggered: string[];
    explanation: string;
  };
  ramicDharmaArchetype: string;
  isSankrantiActive: boolean;
}

const KALAPURUSHA_HOUSE_SCRIPTS: Record<number, string> = {
  1: "Initiative, autonomous action, leadership, and bold sovereignty (Aries archetype)",
  2: "Asset consolidation, liquidity, family preservation, speech, and accounts (Taurus archetype)",
  3: "Multi-channel communications, agile marketing, courage, and contracts (Gemini archetype)",
  4: "Domestic sanctuary, maternal roots, real estate, and emotional grounding (Cancer archetype)",
  5: "Sovereign creativity, speculative intellect, mantras, and dignified mentorship (Leo archetype)",
  6: "Analytical problem-solving, debt elimination, litigation, and service routines (Virgo archetype)",
  7: "Diplomatic contracts, relational balance, consensus, and trade negotiations (Libra archetype)",
  8: "Subterranean crisis remediation, secret transformations, and psychological depth (Scorpio archetype)",
  9: "Righteous ethics, higher philosophical education, gurus, and spiritual law (Sagittarius archetype)",
  10: "Institutional tenacity, executive governance, public reputation, and structural duty (Capricorn archetype)",
  11: "Large network syndicates, non-linear gains, community scaling, and visionary alliances (Aquarius archetype)",
  12: "Spiritual surrender, expenditure auditing, foreign settlement, and detached contemplation (Pisces archetype)",
};

export function calculateSunTorchlightTransit(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult
): SunTorchlightTransit {
  const d1AscIdx = Math.floor(natalEphem.ascendant.siderealLongitude / 30);
  const transitSun = transitEphem.planets["Sun"];
  const sunLon = transitSun ? transitSun.siderealLongitude : 0;
  const sunSignIdx = Math.floor(sunLon / 30);
  const occupiedH = ((sunSignIdx - d1AscIdx + 12) % 12) + 1;

  // Immediate 2nd house ahead receives torchlight
  const torchlightH = (occupiedH % 12) + 1;
  const torchlightSignIdx = (sunSignIdx + 1) % 12;
  const torchlightSignName = RASHI_NAMES[torchlightSignIdx].englishName;
  const kalapurushaScript = KALAPURUSHA_HOUSE_SCRIPTS[torchlightSignIdx + 1] || "General evolutionary script";

  // Check planets in 6th, 7th, 8th from transiting Sun
  const retrogradesTriggered: string[] = [];
  const physicalPlanets = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  for (const pName of physicalPlanets) {
    const tp = transitEphem.planets[pName];
    if (!tp) continue;
    const pSignIdx = Math.floor(tp.siderealLongitude / 30);
    const houseFromSun = ((pSignIdx - sunSignIdx + 12) % 12) + 1;
    if (houseFromSun === 6 || houseFromSun === 7 || houseFromSun === 8) {
      retrogradesTriggered.push(`${pName} (H${houseFromSun} from Sun: Peak Chesthabala / Retrogression zone)`);
    }
  }

  const degInSign = sunLon % 30;
  const isSankrantiActive = degInSign <= 1.0 || degInSign >= 29.0;

  return {
    occupiedHouseFromLagna: occupiedH,
    occupiedSignIndex: sunSignIdx,
    occupiedSignName: RASHI_NAMES[sunSignIdx].englishName,
    torchlightHouseFromLagna: torchlightH,
    torchlightSignIndex: torchlightSignIdx,
    torchlightSignName,
    kalapurushaScript,
    environmentalTheme: `The Sun transits House ${occupiedH} (${RASHI_NAMES[sunSignIdx].englishName}), illuminating this area as your active theater of operations, vitality, and creative duty.`,
    torchlightOutcomeDirective: `TORCHLIGHT RULE (Medhaj Astro): The Sun shines its radiant beam into House ${torchlightH} (${torchlightSignName}), directing physical outcomes and behavioral priorities into this sphere via ${kalapurushaScript}.`,
    retrogressionChestabalaTrigger: {
      retrogradesTriggered,
      explanation: "Planets reaching the 6th, 7th, or 8th house from transiting Sun acquire maximum Chestha Bala (motional strength), triggering retrogression (Vakri gati).",
    },
    ramicDharmaArchetype: "Surya embodies King Rama—absolute moral correctness (Maryada Purushottama), sovereign dignity, and selfless 5th-house sacrifice.",
    isSankrantiActive,
  };
}

// ==========================================
// 2. SESSION 53: TRANSIT OF THE MOON (CHANDRA)
// ==========================================

export interface MoonMentalTransit {
  transitHouseFromLagna: number;
  transitHouseFromMoon: number;
  transitSignIndex: number;
  transitSignName: string;
  transitNakshatra: string;
  archetype: string;
  mentalStateTheme: string;
  dailyFocusDomain: string;
  isPeakDayKuladeepak: boolean;
  karmicAnxietyAlert: boolean;
  transitAdvice: string;
}

const MOON_HOUSE_MENTAL_MATRIX: Record<number, { theme: string; focus: string; advice: string }> = {
  1: {
    theme: "Fresh Initiation & Self-Focus",
    focus: "Physical vitality, personal appearance, sovereign decision making.",
    advice: "Optimal window to launch projects, initiate negotiations, and prioritize individual well-being.",
  },
  2: {
    theme: "Family Wealth, Speech & Nourishment",
    focus: "Banking accounts, family welfare, speech cadence, culinary nourishment.",
    advice: "Audit liquid expenditures, engage in diplomatic conversations, and avoid harsh speech.",
  },
  3: {
    theme: "Agile Media, Short Journeys & Enterprise",
    focus: "Social media engagement, short trips, technical crafts, siblings, courage.",
    advice: "Channel mental energy into commercial outreach, content creation, and collaborative communication.",
  },
  4: {
    theme: "Domestic Sanctuary vs Emotional Unrest",
    focus: "Home atmosphere, vehicle maintenance, maternal relations, emotional stability.",
    advice: "Guard against sudden domestic irritability; maintaining conscious stillness unlocks inner strength.",
  },
  5: {
    theme: "Creative Joy, Romance, Mantras & Progeny",
    focus: "Artistic expression, speculative insights, children, japa, leisure.",
    advice: "Superb alignment for mantra recitation, joyful creative planning, and honoring children.",
  },
  6: {
    theme: "Daily Conflicts, Debts & Problem Remediation",
    focus: "Workplace disputes, enemy friction, health auditing, debt payments.",
    advice: "Maintain disciplined routines; solve pending operational issues without emotional reactivity.",
  },
  7: {
    theme: "Partner-Centric Mindset & Public Reflection",
    focus: "Spouse, contractual partners, public-facing negotiations (directly aspects Lagna).",
    advice: "Prioritize reciprocal collaboration and active listening in one-on-one relationships.",
  },
  8: {
    theme: "Scorpio Debility Archetype: Past Karmic Anxiety & Occult Depth",
    focus: "Past-life karmic ripples, mental gloom, sudden in-law or tax matters, subterranean psychology.",
    advice: "⚠️ Exercise deliberate mental control. Avoid catastrophic thinking; practice breathwork and introspection.",
  },
  9: {
    theme: "Philosophical Dharma, Mentors & Higher Travel",
    focus: "Spiritual learning, fatherly connection, higher philosophy, temple visits.",
    advice: "Excellent for philosophical study, consulting mentors, and engaging in long-range moral planning.",
  },
  10: {
    theme: "Peak of the Day (Kuladeepak Status)",
    focus: "Executive responsibility, professional leadership, civic contribution, social prestige.",
    advice: "🌟 Prime window to take charge, present executive proposals, and assume public responsibility.",
  },
  11: {
    theme: "Expansion of Gains & Social Aspirations",
    focus: "Cash inflows, strategic network circles, fulfilled emotional desires, elder siblings.",
    advice: "Monetize professional alliances and celebrate milestone accomplishments with peers.",
  },
  12: {
    theme: "Subconscious Introspection, Expenditures & Solitude",
    focus: "Subconscious fears, existential inquiry, heavy expenditures, past regrets, retreat.",
    advice: "Embrace solitude and rest; avoid major material commitments and audit unneeded expenses.",
  },
};

export function calculateMoonMentalTransit(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult
): MoonMentalTransit {
  const d1AscIdx = Math.floor(natalEphem.ascendant.siderealLongitude / 30);
  const natalMoon = natalEphem.planets["Moon"];
  const natalMoonIdx = natalMoon ? Math.floor(natalMoon.siderealLongitude / 30) : 0;

  const transitMoon = transitEphem.planets["Moon"];
  const moonLon = transitMoon ? transitMoon.siderealLongitude : 0;
  const transitSignIdx = Math.floor(moonLon / 30);
  const houseFromLagna = ((transitSignIdx - d1AscIdx + 12) % 12) + 1;
  const houseFromMoon = ((transitSignIdx - natalMoonIdx + 12) % 12) + 1;

  const matrix = MOON_HOUSE_MENTAL_MATRIX[houseFromLagna] || MOON_HOUSE_MENTAL_MATRIX[1];
  const isPeakDayKuladeepak = houseFromLagna === 10;
  const karmicAnxietyAlert = houseFromLagna === 8 || houseFromMoon === 8;

  return {
    transitHouseFromLagna: houseFromLagna,
    transitHouseFromMoon: houseFromMoon,
    transitSignIndex: transitSignIdx,
    transitSignName: RASHI_NAMES[transitSignIdx].englishName,
    transitNakshatra: transitMoon?.nakshatra?.sanskritName || "Rohini",
    archetype: "Pragmatic Logic (Krishna): While the Sun is Rama (moral law), Chandra is Krishna—pragmatic, situational, and intuitive.",
    mentalStateTheme: matrix.theme,
    dailyFocusDomain: matrix.focus,
    isPeakDayKuladeepak,
    karmicAnxietyAlert,
    transitAdvice: matrix.advice,
  };
}

// ==========================================
// 3. SESSION 54: TRANSIT OF VENUS (SHUKRA)
// ==========================================

export interface VenusContactOverlay {
  natalPlanet: string;
  transitEffect: string;
  karmicManifestation: string;
}

export interface VenusGocharaInfo {
  transitHouseFromLagna: number;
  transitHouseFromMoon: number;
  transitSignName: string;
  starPhase: "Morning Star (Pratah Tara)" | "Evening Star (Sandhya Tara)";
  ancestralOversight: string;
  sanjeevaniVidyaTheme: string;
  houseTransitScript: string;
  activeOverlays: VenusContactOverlay[];
}

export function calculateVenusGocharaAndOverlays(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult
): VenusGocharaInfo {
  const d1AscIdx = Math.floor(natalEphem.ascendant.siderealLongitude / 30);
  const natalMoon = natalEphem.planets["Moon"];
  const natalMoonIdx = natalMoon ? Math.floor(natalMoon.siderealLongitude / 30) : 0;

  const tVenus = transitEphem.planets["Venus"];
  const tSun = transitEphem.planets["Sun"];

  const vLon = tVenus ? tVenus.siderealLongitude : 0;
  const sLon = tSun ? tSun.siderealLongitude : 0;
  const vSignIdx = Math.floor(vLon / 30);

  const houseFromLagna = ((vSignIdx - d1AscIdx + 12) % 12) + 1;
  const houseFromMoon = ((vSignIdx - natalMoonIdx + 12) % 12) + 1;

  // Morning Star vs Evening Star
  // If Venus longitude is west of Sun (180 to 360 degrees behind Sun in 360 circle), it rises before Sun -> Morning Star
  const diff = (vLon - sLon + 360) % 360;
  const isMorningStar = diff >= 180 && diff < 360;
  const starPhase = isMorningStar ? "Morning Star (Pratah Tara)" : "Evening Star (Sandhya Tara)";
  const ancestralOversight = isMorningStar
    ? "Rises before the Sun: Ancestral energies (Pitri Shakti) actively oversee and shield your daytime actions and career endeavors."
    : "Sets after the Sun: Ancestral energies oversee and guard your nocturnal, domestic, and private relational activities.";

  // House-by-house script
  const houseScripts: Record<number, string> = {
    1: "Grooming, magnetic charisma, personal rejuvenation, and elevated aesthetic aura.",
    2: "Sweet, persuasive speech; domestic harmony; expenditures on family comforts and culinary luxuries.",
    4: "Domestic rejuvenation, aesthetic home beautification, harmonious family bonding.",
    6: "⚠️ Debility Archetype (Virgo): Potential fall into depressive indulgence, relationship conflict, or reproductive friction.",
    8: "Secret passions, deep sensual magnetism, and sudden occult revelations (with 5th/Sun links, unlocks profound astrological intuition).",
    12: "✨ Exaltation Archetype (Pisces): Sublime bed comforts, spiritual bliss, elevated pleasures, and artistic transcendence.",
  };
  const houseTransitScript = houseScripts[houseFromLagna] || `Venus activates House ${houseFromLagna}: Fosters refined social connections, diplomatic grace, and creative harmony.`;

  // Contact overlays over natal planets (same sign or within 8°)
  const activeOverlays: VenusContactOverlay[] = [];
  for (const [pName, nData] of Object.entries(natalEphem.planets)) {
    if (!nData || ["Uranus", "Neptune", "Pluto"].includes(pName)) continue;
    const nSign = Math.floor(nData.siderealLongitude / 30);
    if (nSign === vSignIdx) {
      if (pName === "Moon") {
        activeOverlays.push({
          natalPlanet: "Moon",
          transitEffect: "Indulgence in luxury, culinary delights, heightened romanticism.",
          karmicManifestation: "Deep emotional warmth, desire for pampering and beautiful environments.",
        });
      } else if (pName === "Mars") {
        activeOverlays.push({
          natalPlanet: "Mars",
          transitEffect: "Surging physical passion, magnetic attraction, and romantic assertiveness.",
          karmicManifestation: "Ignites intense creative or sexual vitality; channel into active artistry or fitness.",
        });
      } else if (pName === "Mercury") {
        activeOverlays.push({
          natalPlanet: "Mercury",
          transitEffect: "Playful romantic conversations, heightened verbal charm, aesthetic intellect.",
          karmicManifestation: "Effortless wit, commercial diplomacy, and successful romantic communication.",
        });
      } else if (pName === "Ketu") {
        activeOverlays.push({
          natalPlanet: "Ketu",
          transitEffect: "Sudden detachment from relationships, ascetic distaste for superficial pleasures.",
          karmicManifestation: "Desire for solitude, spiritualizing love, and walking away from theatrical romance.",
        });
      }
    }
  }

  return {
    transitHouseFromLagna: houseFromLagna,
    transitHouseFromMoon: houseFromMoon,
    transitSignName: RASHI_NAMES[vSignIdx].englishName,
    starPhase,
    ancestralOversight,
    sanjeevaniVidyaTheme: "Venus embodies Sri Parashurama and the Sanjeevani Vidya—the sacred knowledge of cellular rejuvenation and vital fluid revival.",
    houseTransitScript,
    activeOverlays,
  };
}

// ==========================================
// 4. SESSION 55: TRANSIT OF MARS (MANGAL)
// ==========================================

export interface MarsContactOverlay {
  natalPlanet: string;
  transitEffect: string;
  karmicManifestation: string;
}

export interface MarsGocharaInfo {
  transitHouseFromLagna: number;
  transitSignName: string;
  occupiedHouseBurst: string;
  specialDesireAspects: {
    aspect: 4 | 7 | 8;
    targetHouse: number;
    targetSignName: string;
    desireTheme: string;
  }[];
  houseTransitBehavior: string;
  activeOverlays: MarsContactOverlay[];
}

export function calculateMarsTransitAspectsAndOverlays(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult
): MarsGocharaInfo {
  const d1AscIdx = Math.floor(natalEphem.ascendant.siderealLongitude / 30);
  const tMars = transitEphem.planets["Mars"];
  const mLon = tMars ? tMars.siderealLongitude : 0;
  const mSignIdx = Math.floor(mLon / 30);
  const occupiedH = ((mSignIdx - d1AscIdx + 12) % 12) + 1;

  // Special Mars Aspects: 4th, 7th, 8th
  const aspectOffsets = [
    { aspect: 4 as const, offset: 3, theme: "Acute domestic/property urgency, territorial defense, inner drive" },
    { aspect: 7 as const, offset: 6, theme: "Direct confrontational dynamism, relational assertiveness, contractual friction" },
    { aspect: 8 as const, offset: 7, theme: "Sudden transformative urgency, subterranean crisis control, raw survival focus" },
  ];

  const specialDesireAspects = aspectOffsets.map((a) => {
    const targetH = ((occupiedH + a.offset - 1) % 12) + 1;
    const targetSignIdx = (mSignIdx + a.offset) % 12;
    return {
      aspect: a.aspect,
      targetHouse: targetH,
      targetSignName: RASHI_NAMES[targetSignIdx].englishName,
      desireTheme: `Mars casts its ${a.aspect}th Drishti onto House ${targetH} (${RASHI_NAMES[targetSignIdx].englishName}): Injects acute desire, urgency, and forceful acceleration into this sphere.`,
    };
  });

  const houseBehaviors: Record<number, string> = {
    1: "Restlessness, high martial speed, short temper, impulsive physical stamina.",
    2: "Sharp, aggressive, or unfiltered speech; assertive financial claims.",
    4: "Domestic arguments, real estate urgency, territorial friction within home walls.",
    12: "Disrupted sleep, intense nocturnal restlessness, channel energy into physical training.",
  };
  const houseTransitBehavior = houseBehaviors[occupiedH] || `Mars in House ${occupiedH}: Aggressive burst of raw martial energy and mechanical logic.`;

  // Contact overlays
  const activeOverlays: MarsContactOverlay[] = [];
  for (const [pName, nData] of Object.entries(natalEphem.planets)) {
    if (!nData || ["Uranus", "Neptune", "Pluto"].includes(pName)) continue;
    const nSign = Math.floor(nData.siderealLongitude / 30);
    if (nSign === mSignIdx) {
      if (pName === "Sun") {
        activeOverlays.push({
          natalPlanet: "Sun",
          transitEffect: "Surge in leadership authority, executive ambition, and competitive drive.",
          karmicManifestation: "High vitality and bold command; avoid ego clashes with superiors.",
        });
      } else if (pName === "Mercury") {
        activeOverlays.push({
          natalPlanet: "Mercury",
          transitEffect: "Argumentative intellect, mental impatience (Mercury debates while Mars charges).",
          karmicManifestation: "Fast mental processing; guard against hasty contractual disputes.",
        });
      } else if (pName === "Moon") {
        activeOverlays.push({
          natalPlanet: "Moon",
          transitEffect: "Craving piquant/spicy food, volatile emotional anger, physical restlessness.",
          karmicManifestation: "Cardiovascular heat; cool down through hydration, swimming, and serene company.",
        });
      } else if (pName === "Rahu") {
        activeOverlays.push({
          natalPlanet: "Rahu",
          transitEffect: "Out-of-control, explosive physical ambition and high-risk boldness.",
          karmicManifestation: "Tremendous technological drive; beware of mechanical or reckless hazards.",
        });
      } else if (pName === "Ketu") {
        activeOverlays.push({
          natalPlanet: "Ketu",
          transitEffect: "Frustrated martial energy, sudden cuts, accidental vulnerability, surgical detachment.",
          karmicManifestation: "Take extra care with sharp tools, machinery, and physical exertion.",
        });
      }
    }
  }

  return {
    transitHouseFromLagna: occupiedH,
    transitSignName: RASHI_NAMES[mSignIdx].englishName,
    occupiedHouseBurst: `Bhumi Putra Mars delivers an aggressive burst of raw physical action into House ${occupiedH}.`,
    specialDesireAspects,
    houseTransitBehavior,
    activeOverlays,
  };
}

// ==========================================
// 5. SESSION 56: TRANSIT OF JUPITER (GURU)
// ==========================================

export interface JupiterGocharaInfo {
  transitHouseFromLagna: number;
  transitSignName: string;
  hemisphere: "Inner Hemisphere (Houses 1–7)" | "Outer Hemisphere (Houses 8–12)";
  hemisphereDirective: string;
  universalExpansionVerdict: string;
  isKharmasActive: boolean;
  kharmasGuidance: string;
  guruShani20YearCycle: {
    isConjunctionActive: boolean;
    conjunctionSignName: string;
    eraKarmicTheme: string;
  };
}

export function calculateJupiterHemispheresAndGreatCycle(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult
): JupiterGocharaInfo {
  const d1AscIdx = Math.floor(natalEphem.ascendant.siderealLongitude / 30);
  const tJup = transitEphem.planets["Jupiter"];
  const tSat = transitEphem.planets["Saturn"];
  const tSun = transitEphem.planets["Sun"];

  const jLon = tJup ? tJup.siderealLongitude : 0;
  const jSignIdx = Math.floor(jLon / 30);
  const occupiedH = ((jSignIdx - d1AscIdx + 12) % 12) + 1;

  const isInner = occupiedH >= 1 && occupiedH <= 7;
  const hemisphere = isInner
    ? "Inner Hemisphere (Houses 1–7)"
    : "Outer Hemisphere (Houses 8–12)";

  const hemisphereDirective = isInner
    ? "INNER HEMISPHERE (Medhaj Astro Rule): Guru transiting houses 1–7 compels inward reflection, moral realignment, spiritual self-study, and cultivating inner wisdom."
    : "OUTER HEMISPHERE (Medhaj Astro Rule): Guru transiting houses 8–12 compels active engagement with the external world, civic institutions, societal duty, and public karma.";

  // Kharmas: When Sun transits Sagittarius (8) or Pisces (11)
  const sLon = tSun ? tSun.siderealLongitude : 0;
  const sSignIdx = Math.floor(sLon / 30);
  const isKharmasActive = sSignIdx === 8 || sSignIdx === 11;
  const kharmasGuidance = isKharmasActive
    ? "⚠️ KHARMAS ACTIVE: Sun occupies Jupiter's sign (Sagittarius/Pisces). Material celebrations and commercial pomp should be minimized in favor of spiritual study, charity, and meditation."
    : "Kharmas dormant: Solar energy flows along standard mundane pathways.";

  // Guru-Shani 20-Year Great Cycle ("Abode of God")
  const sSatLon = tSat ? tSat.siderealLongitude : 0;
  const satSignIdx = Math.floor(sSatLon / 30);
  const isConjunctionActive = jSignIdx === satSignIdx;

  return {
    transitHouseFromLagna: occupiedH,
    transitSignName: RASHI_NAMES[jSignIdx].englishName,
    hemisphere,
    hemisphereDirective,
    universalExpansionVerdict: "Guru expands whatever it touches: Multiplies grace and divine protection for pure deeds, while enlarging exposure and accountability for negative karma.",
    isKharmasActive,
    kharmasGuidance,
    guruShani20YearCycle: {
      isConjunctionActive,
      conjunctionSignName: RASHI_NAMES[jSignIdx].englishName,
      eraKarmicTheme: isConjunctionActive
        ? `⭐ 20-YEAR GREAT CYCLE ('ABODE OF GOD'): Jupiter and Saturn meet in ${RASHI_NAMES[jSignIdx].englishName}, anchoring a new 20-year era of generational karma, economic restructuring, and moral accountability.`
        : "Jupiter and Saturn operate across separate signs, sustaining their respective 20-year developmental milestones.",
    },
  };
}

// ==========================================
// 6. SESSIONS 57 & 58: TRANSIT OF SATURN (SHANI)
// ==========================================

export interface SaturnGocharaInfo {
  sadeSatiSomaticPhase: {
    isSadeSatiActive: boolean;
    phaseNumber: 1 | 2 | 3 | null;
    somaticZone: string;
    somaticManifestation: string;
  };
  kantakaShani: {
    isKantakaFromMoon: boolean;
    isKantakaFromLagna: boolean;
    relationshipTestWarning: string;
  };
  dhaiyya: {
    isDhaiyyaActive: boolean;
    houseType: "4th Kantaka" | "8th Ashtama" | "None";
  };
  transitOverArudhaLagna: {
    isSaturnOnAL: boolean;
    alSignName: string;
    prestigeResetWarning: string;
  };
  fifteenYearOppositionTrigger: {
    isOppositionTriggerActive: boolean;
    seedDescription: string;
  };
  humanFoundation90YearCycle: {
    currentCycle: string;
    completedAge: number;
    lifeStageAdvice: string;
  };
}

export function calculateSaturnSomaticSadeSatiAndAL(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult,
  birthDate: Date,
  targetDate: Date = new Date()
): SaturnGocharaInfo {
  const d1AscIdx = Math.floor(natalEphem.ascendant.siderealLongitude / 30);
  const natalMoon = natalEphem.planets["Moon"];
  const natalMoonIdx = natalMoon ? Math.floor(natalMoon.siderealLongitude / 30) : 0;

  const tSat = transitEphem.planets["Saturn"];
  const satLon = tSat ? tSat.siderealLongitude : 0;
  const satSignIdx = Math.floor(satLon / 30);

  const houseFromMoon = ((satSignIdx - natalMoonIdx + 12) % 12) + 1;
  const houseFromLagna = ((satSignIdx - d1AscIdx + 12) % 12) + 1;

  // Sade Sati 3 Somatic Phases
  let isSadeSatiActive = false;
  let phaseNumber: 1 | 2 | 3 | null = null;
  let somaticZone = "None";
  let somaticManifestation = "Operating outside acute Sade Sati somatic pressures.";

  if (houseFromMoon === 12) {
    isSadeSatiActive = true;
    phaseNumber = 1;
    somaticZone = "Head & Neck (Mental Restructuring)";
    somaticManifestation = "Somatic focus on cranial tension, sleep recalibration, mental restructuring, and stripping frivolous illusions above the neck.";
  } else if (houseFromMoon === 1) {
    isSadeSatiActive = true;
    phaseNumber = 2;
    somaticZone = "Heart & Chest (Deep Emotional Cleansing)";
    somaticManifestation = "Somatic focus on cardiac and emotional center; heavy accountability, deep emotional purification, and testing personal fortitude.";
  } else if (houseFromMoon === 2) {
    isSadeSatiActive = true;
    phaseNumber = 3;
    somaticZone = "Feet & Legs (Material & Relocation Reckoning)";
    somaticManifestation = "Somatic focus on feet, legs, physical movement, career relocation, asset re-balancing, and materialization of karmic consequences.";
  }

  // Kantaka Shani: 7th house from Moon OR Lagna
  const isKantakaFromMoon = houseFromMoon === 7;
  const isKantakaFromLagna = houseFromLagna === 7;
  const relationshipTestWarning = isKantakaFromMoon || isKantakaFromLagna
    ? `⚠️ KANTAKA SHANI ACTIVE (7th from ${isKantakaFromLagna ? "Lagna" : "Moon"}): Saturn slows down relationship momentum, tests partnership stability, and demands unyielding maturity.`
    : "Clear of 7th-house Kantaka relationship obstacles.";

  // Dhaiyya: 4th or 8th from Moon
  const isDhaiyyaActive = houseFromMoon === 4 || houseFromMoon === 8;
  const houseType = houseFromMoon === 4 ? "4th Kantaka" : houseFromMoon === 8 ? "8th Ashtama" : "None";

  // Transit over Arudha Lagna (AL)
  const padas = calculateArudhaPadas(natalEphem);
  const alPada = padas.find((p) => p.code === "AL");
  const alSignIdx = alPada ? alPada.padaSignIndex : d1AscIdx;
  const alSignName = RASHI_NAMES[alSignIdx].englishName;
  const isSaturnOnAL = satSignIdx === alSignIdx;
  const prestigeResetWarning = isSaturnOnAL
    ? `🚨 SATURN TRANSIT OVER ARUDHA LAGNA (${alSignName}): External social prestige and superficial facade drop. Saturn strips ego-illusions and forces you to confront ground operational reality.`
    : "Social reputation operates without direct Saturnian stripping.";

  // 15-Year Opposition Trigger & 90-Year Human Foundation
  const natalSaturn = natalEphem.planets["Saturn"];
  const natalSaturnLon = natalSaturn ? natalSaturn.siderealLongitude : 0;
  const natalSaturnSignIdx = Math.floor(natalSaturnLon / 30);
  const isOppositeNatal = ((satSignIdx - natalSaturnSignIdx + 12) % 12) === 6;

  const diffMs = targetDate.getTime() - birthDate.getTime();
  const completedAge = Math.max(0, Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000)));

  const isOppositionTriggerActive = isOppositeNatal || Math.abs(completedAge - 15) <= 1 || Math.abs(completedAge - 45) <= 1;
  const seedDescription = isOppositionTriggerActive
    ? "15-YEAR OPPOSITION TRIGGER: Saturn opposes its natal position (180°), laying foundational seeds and pivotal life shifts that will formally crystallize at age 30."
    : "Saturn operates along standard orbital harmonics.";

  let currentCycle = "Cycle 1 (Ages 0–30): Foundation Below";
  let lifeStageAdvice = "Settling past-life karmic remnants and building the foundational bedrock. Real life begins at first Saturn Return (Ages 28–30).";
  if (completedAge >= 30 && completedAge < 60) {
    currentCycle = "Cycle 2 (Ages 30–60): Sovereign Karma";
    lifeStageAdvice = "Active construction of your primary lifetime accomplishments, executive governance, and real-world duty.";
  } else if (completedAge >= 60) {
    currentCycle = "Cycle 3 (Ages 60–90): Detachment & Completion";
    lifeStageAdvice = "Shedding worldly obligations, spiritual mentorship, detachment, and peaceful karmic closure.";
  }

  return {
    sadeSatiSomaticPhase: {
      isSadeSatiActive,
      phaseNumber,
      somaticZone,
      somaticManifestation,
    },
    kantakaShani: {
      isKantakaFromMoon,
      isKantakaFromLagna,
      relationshipTestWarning,
    },
    dhaiyya: {
      isDhaiyyaActive,
      houseType,
    },
    transitOverArudhaLagna: {
      isSaturnOnAL,
      alSignName,
      prestigeResetWarning,
    },
    fifteenYearOppositionTrigger: {
      isOppositionTriggerActive,
      seedDescription,
    },
    humanFoundation90YearCycle: {
      currentCycle,
      completedAge,
      lifeStageAdvice,
    },
  };
}

// ==========================================
// 7. SESSION 59: TRANSIT OF RAHU & KETU
// ==========================================

export interface NodalGocharaInfo {
  karmicHelix: {
    ketuTailContraction: string;
    rahuHeadMagnification: string;
  };
  invertedNodalReturn: {
    isInvertedReturnActive: boolean;
    completedAge: number;
    triggerAges: number[];
    is27thYearPivot: boolean;
    pivotDescription: string;
  };
  regularNodalReturn: {
    isNodalReturnActive: boolean;
    returnAges: number[];
  };
  activeAgeSpan: {
    isRahuSpanActive: boolean;
    isKetuSpanActive: boolean;
    spanAdvice: string;
  };
  nuclearBombStatus: NuclearBombAlert;
  kalaSarpaShivaRemedy: string;
}

export function calculateNodalHelixAndInvertedReturns(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult,
  birthDate: Date,
  targetDate: Date = new Date()
): NodalGocharaInfo {
  const d1AscIdx = Math.floor(natalEphem.ascendant.siderealLongitude / 30);
  const diffMs = targetDate.getTime() - birthDate.getTime();
  const completedAge = Math.max(0, Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000)));
  const currentLifeYear = completedAge + 1;

  // Active annual house for Nuclear Bomb check
  const activeHouse = ((currentLifeYear - 1) % 12) + 1;
  const nuclearBombStatus = detectRahuKetuNuclearBombEffect(activeHouse, natalEphem);

  // Inverted Nodal Return (every 9 years: 9, 27, 45, 63, 81)
  const invertedAges = [9, 27, 45, 63, 81];
  const isInvertedReturnActive = invertedAges.some((a) => Math.abs(completedAge - a) <= 1 || completedAge === a);
  const is27thYearPivot = completedAge === 26 || completedAge === 27;
  const pivotDescription = is27thYearPivot
    ? "🌀 27th YEAR INVERTED NODAL PIVOT: Transiting Rahu touches natal Ketu and Ketu touches natal Rahu. Non-negotiable karmic course-correction, career or relationship turning point."
    : isInvertedReturnActive
    ? `Inverted Nodal Return active (9-year harmonic). Accounts are audited to pivot destiny.`
    : "Steady forward progression outside inverted nodal inflection points.";

  // Regular Nodal Return (every ~18.5 years: 18, 36, 54, 72)
  const regularAges = [18, 36, 54, 72];
  const isNodalReturnActive = regularAges.some((a) => Math.abs(completedAge - a) <= 1);

  // Active age spans: Rahu (42 to 48), Ketu (48 to 52)
  const isRahuSpanActive = completedAge >= 42 && completedAge < 48;
  const isKetuSpanActive = completedAge >= 48 && completedAge <= 52;
  let spanAdvice = "Operating outside primary nodal maturation spans.";
  if (isRahuSpanActive) {
    spanAdvice = "🔥 RAHU AGE SPAN ACTIVE (Ages 42–48): Intense material expansion, foreign connections, technological scaling, and breaking convention.";
  } else if (isKetuSpanActive) {
    spanAdvice = "🚩 KETU AGE SPAN ACTIVE (Ages 48–52): Spiritual detachment, deep introspection, shedding material attachments, and discovering ultimate liberation.";
  }

  return {
    karmicHelix: {
      ketuTailContraction: "Ketu represents Past Karma (The Tail): Contracts, reduces to zero, and demands detachment. If you stubbornly cling to Ketu's domain, it forces sudden loss.",
      rahuHeadMagnification: "Rahu represents Future Karma (The Head): Amplifies, magnifies, and stimulates insatiable desire and worldly fascination (Maya).",
    },
    invertedNodalReturn: {
      isInvertedReturnActive,
      completedAge,
      triggerAges: invertedAges,
      is27thYearPivot,
      pivotDescription,
    },
    regularNodalReturn: {
      isNodalReturnActive,
      returnAges: regularAges,
    },
    activeAgeSpan: {
      isRahuSpanActive,
      isKetuSpanActive,
      spanAdvice,
    },
    nuclearBombStatus,
    kalaSarpaShivaRemedy: "Kala Sarpa is not an evil curse, but a profound past-life karmic commitment. The supreme balancing remedy is total surrender to Lord Shiva through 'Om Namah Shivaya'.",
  };
}

// ==========================================
// 8. SESSION 60: TRANSITS OF OUTER PLANETS (URANUS, NEPTUNE, PLUTO)
// ==========================================

export interface OuterPlanetsGocharaInfo {
  uranusHarshal: {
    transitSignName: string;
    transitHouseFromLagna: number;
    dwellSpanYears: number;
    generationalTheme: string;
    lightningDisruptionAdvice: string;
  };
  neptuneVaruna: {
    transitSignName: string;
    transitHouseFromLagna: number;
    dwellSpanYears: number;
    generationalTheme: string;
    spiritualTruthVsIllusion: string;
  };
  plutoYama: {
    transitSignName: string;
    transitHouseFromLagna: number;
    dwellSpanYears: string;
    generationalTheme: string;
    institutionalDemolitionFocus: string;
  };
  majorNatalAspects: string[];
}

export function calculateOuterPlanetsGenerationalTransit(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult
): OuterPlanetsGocharaInfo {
  const d1AscIdx = Math.floor(natalEphem.ascendant.siderealLongitude / 30);

  const tUranus = transitEphem.planets["Uranus"];
  const tNeptune = transitEphem.planets["Neptune"];
  const tPluto = transitEphem.planets["Pluto"];

  const uLon = tUranus ? tUranus.siderealLongitude : 35; // default Taurus
  const nLon = tNeptune ? tNeptune.siderealLongitude : 350; // default Pisces
  const pLon = tPluto ? tPluto.siderealLongitude : 295; // default Capricorn/Aquarius

  const uSignIdx = Math.floor(uLon / 30);
  const nSignIdx = Math.floor(nLon / 30);
  const pSignIdx = Math.floor(pLon / 30);

  const uHouse = ((uSignIdx - d1AscIdx + 12) % 12) + 1;
  const nHouse = ((nSignIdx - d1AscIdx + 12) % 12) + 1;
  const pHouse = ((pSignIdx - d1AscIdx + 12) % 12) + 1;

  // Check hard aspects to natal Moon, Sun, Lagna
  const majorNatalAspects: string[] = [];
  const natalMoon = natalEphem.planets["Moon"];
  if (natalMoon) {
    const nMoonSign = Math.floor(natalMoon.siderealLongitude / 30);
    if (nSignIdx === nMoonSign || ((nSignIdx - nMoonSign + 12) % 12) === 6) {
      majorNatalAspects.push("Neptune contacting Natal Moon: Conscious mind faces 4D spiritual truth vs deep illusions; practice grounding.");
    }
    if (uSignIdx === nMoonSign || ((uSignIdx - nMoonSign + 12) % 12) === 6) {
      majorNatalAspects.push("Uranus contacting Natal Moon: Sudden psychological awakenings, nervous excitability, and lightning breakthroughs.");
    }
  }

  return {
    uranusHarshal: {
      transitSignName: RASHI_NAMES[uSignIdx].englishName,
      transitHouseFromLagna: uHouse,
      dwellSpanYears: 7,
      generationalTheme: "Uranus (Harshala): Aries archetype, stays ~7 years per sign. Governs sudden breakthroughs, technological disruptions, and lightning changes.",
      lightningDisruptionAdvice: `Transiting House ${uHouse} (${RASHI_NAMES[uSignIdx].englishName}): Radical innovations, sudden liberation, and breaking archaic protocols in this sector.`,
    },
    neptuneVaruna: {
      transitSignName: RASHI_NAMES[nSignIdx].englishName,
      transitHouseFromLagna: nHouse,
      dwellSpanYears: 14,
      generationalTheme: "Neptune (Varuna): Pisces archetype, stays ~14 years per sign. Represents 4D reality, mysticism, and ultimate cosmic truth.",
      spiritualTruthVsIllusion: `Transiting House ${nHouse} (${RASHI_NAMES[nSignIdx].englishName}): Demands spiritual surrender and creative imagination; beware of deceptive escapism or financial fog.`,
    },
    plutoYama: {
      transitSignName: RASHI_NAMES[pSignIdx].englishName,
      transitHouseFromLagna: pHouse,
      dwellSpanYears: "12 to 20+ years",
      generationalTheme: "Pluto (Yama): Cosmic demolition and total rebirth. Wipes out corrupt and obsolete power structures so they can be rebuilt from zero.",
      institutionalDemolitionFocus: `Transiting House ${pHouse} (${RASHI_NAMES[pSignIdx].englishName}): Profound systemic metamorphosis, stripping away unviable commitments, and rebuilding indestructible foundations.`,
    },
    majorNatalAspects,
  };
}

// ==========================================
// 9. MASTER SYNTHESIS & REPORT GENERATOR
// ==========================================

export interface MedhajGocharaMasterReport {
  sun: SunTorchlightTransit;
  moon: MoonMentalTransit;
  venus: VenusGocharaInfo;
  mars: MarsGocharaInfo;
  jupiter: JupiterGocharaInfo;
  saturn: SaturnGocharaInfo;
  nodes: NodalGocharaInfo;
  outerPlanets: OuterPlanetsGocharaInfo;
  masterExecutiveSummary: string;
}

export function generateMedhajGocharaMasterReport(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult,
  birthDate: Date,
  targetDate: Date = new Date()
): MedhajGocharaMasterReport {
  const sun = calculateSunTorchlightTransit(natalEphem, transitEphem);
  const moon = calculateMoonMentalTransit(natalEphem, transitEphem);
  const venus = calculateVenusGocharaAndOverlays(natalEphem, transitEphem);
  const mars = calculateMarsTransitAspectsAndOverlays(natalEphem, transitEphem);
  const jupiter = calculateJupiterHemispheresAndGreatCycle(natalEphem, transitEphem);
  const saturn = calculateSaturnSomaticSadeSatiAndAL(natalEphem, transitEphem, birthDate, targetDate);
  const nodes = calculateNodalHelixAndInvertedReturns(natalEphem, transitEphem, birthDate, targetDate);
  const outerPlanets = calculateOuterPlanetsGenerationalTransit(natalEphem, transitEphem);

  const lines: string[] = [
    "### 🪐 MASTER GOCHARA & HOUSE ACTIVATION REPORT (MEDHAJ ASTRO SESSIONS 52–60)",
    `- **☀️ Surya Torchlight:** Transiting House ${sun.occupiedHouseFromLagna} (${sun.occupiedSignName}) ➔ Shines Torchlight into House ${sun.torchlightHouseFromLagna} (${sun.torchlightSignName} • *${sun.kalapurushaScript}*)`,
    `- **🌙 Chandra Daily Mind:** House ${moon.transitHouseFromLagna} from Lagna / House ${moon.transitHouseFromMoon} from Moon • *${moon.mentalStateTheme}* (${moon.dailyFocusDomain})`,
    `- **🌸 Shukra Ancestral Shield:** ${venus.starPhase} • ${venus.ancestralOversight}`,
    venus.activeOverlays.length > 0 ? `  - *Contact Overlays:* ${venus.activeOverlays.map((o) => `Venus over Natal ${o.natalPlanet} (${o.transitEffect})`).join(" • ")}` : "  - *Contact Overlays:* No direct major planet overlays.",
    `- **🔥 Mangala Desire Aspects:** Occupies House ${mars.transitHouseFromLagna} • Aspected Desire Sectors: ${mars.specialDesireAspects.map((a) => `H${a.targetHouse} (${a.aspect}th)`).join(", ")}`,
    mars.activeOverlays.length > 0 ? `  - *Contact Overlays:* ${mars.activeOverlays.map((o) => `Mars over Natal ${o.natalPlanet} (${o.transitEffect})`).join(" • ")}` : "  - *Contact Overlays:* No direct major planet overlays.",
    `- **⭐ Guru Expansion & Era:** ${jupiter.hemisphere} • ${jupiter.hemisphereDirective}${jupiter.isKharmasActive ? " • ⚠️ *KHARMAS ACTIVE*" : ""}`,
    `- **⚖️ Shani Cosmic Auditor:** ${saturn.sadeSatiSomaticPhase.isSadeSatiActive ? `⚠️ Sade Sati Active (Phase ${saturn.sadeSatiSomaticPhase.phaseNumber} • ${saturn.sadeSatiSomaticPhase.somaticZone})` : "Outside Sade Sati"} • ${saturn.kantakaShani.relationshipTestWarning}`,
    saturn.transitOverArudhaLagna.isSaturnOnAL ? `  - 🚨 *ARUDHA LAGNA ALERT:* ${saturn.transitOverArudhaLagna.prestigeResetWarning}` : `  - *Arudha Lagna:* Secure (${saturn.transitOverArudhaLagna.alSignName})`,
    `- **🌀 Rahu-Ketu Karmic Helix:** ${nodes.invertedNodalReturn.pivotDescription} • ${nodes.nuclearBombStatus.warningTitle}`,
    `- **🌌 Generational Outer Planets:** Uranus in H${outerPlanets.uranusHarshal.transitHouseFromLagna} • Neptune in H${outerPlanets.neptuneVaruna.transitHouseFromLagna} • Pluto in H${outerPlanets.plutoYama.transitHouseFromLagna}`,
  ];

  return {
    sun,
    moon,
    venus,
    mars,
    jupiter,
    saturn,
    nodes,
    outerPlanets,
    masterExecutiveSummary: lines.join("\n"),
  };
}
