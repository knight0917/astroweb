/**
 * Classical Vedic Pisces (Meena Rashi) Archetype, Kalapurusha 12-House Script Overlay,
 * Elemental Immunity Hierarchy & Special Planetary Drishti Engine
 * (मीन राशि, कालपुरुष ऊर्जा-लिपि, तत्त्वीय रोग-प्रतिरोधक क्षमता व ग्रह-दृष्टि रहस्य)
 *
 * Shastric Foundations:
 * - Session 42: Significance of Rashi Pisces (Meena) — 12th Sign of Kalapurusha, Dual Sattvic Water
 *   (Universal Tears / Compassion vs Cancer personal tears & Scorpio suppressed tears), The Hallmark Trait:
 *   Blind Faith (Andha Vishwas) & Divine Help (Daiva Kripa) across the 12 houses (human calculation fails,
 *   only divine grace rescues), 12th House & Expenditure Mechanics (voluntary spiritual donation vs forced
 *   drainage, Jupiter/Sagittarius sleep sanctuary vs Rahu/Venus nocturnal affliction), Planetary Behavior
 *   inside Pisces (Venus Exalted highest spiritual bliss & divine marriage, Mercury Debilitated calculation drowning,
 *   Saturn sustained silent service, Rahu fallen material trickery).
 * - Session 43: Revision of Rashi & Bhava (Part 1) — Houses as Fixed Frames (1 to 12 universal life departments)
 *   vs Signs as Energy Scripts. The Kalapurusha Script Overlay Rule: the sign on any house imports the natural
 *   characteristics of that sign's Kalapurusha house position (e.g. Aries in H4 -> Kalapurusha H1 action/friction
 *   in domestic life; Taurus in H4 -> Kalapurusha H2 wealth/security in home; Gemini in H10 -> Kalapurusha H3
 *   communication/media career; Leo in H7 -> Kalapurusha H5 royal executive spouse; Taurus in H12 -> Kalapurusha H2
 *   material sleep luxury).
 * - Session 44: Revision of Rashi & Bhava (Part 2) — Three Essential Gunas (1-4 Rajasic "I to I", 5-8 Tamasic
 *   "I to You", 9-12 Sattvic "I to All"), Purusha vs Stri (Odd Masculine Fire/Air vs Even Feminine Earth/Water),
 *   Dual Sign Degree Split (0°-15° Fixed/Masculine vs 15°-30° Movable/Feminine), Elemental Immunity Hierarchy
 *   & Pathogen Vulnerability (Fire highest heat/resistance -> Earth structural stability -> Air nervous/respiratory ->
 *   Water contagious pathogen vulnerability), and the Water Ascendant Immunity Exception (Water Lagna with Lagna
 *   Lord in Fire sign receives Agni Fortification).
 * - Session 45: Aspects of Planets (Drishti) & Kalapurusha Archetype Resonance — Physical work in occupied house
 *   vs Drishti projecting desires, gaze, and intentions. Universal 7th Aspect across all planets, and Special
 *   Aspects with Kalapurusha Sign Meanings:
 *     * Saturn 3rd Aspect (Gemini/H3 - Arduous Effort & Manual Toil) & 10th Aspect (Capricorn/H10 - Nishkama Duty)
 *     * Mars 4th Aspect (Cancer/H4 - Forceful Boundary Intrusion) & 8th Aspect (Scorpio/H8 - Surgical Transformation)
 *     * Jupiter 5th Aspect (Leo/H5 - Creative Parental Nurture) & 9th Aspect (Sagittarius/H9 - Divine Fortune Expansion)
 *     * Rahu 5th/9th Aspect (Material Magnification & Obsession) & Ketu 5th/9th Aspect (Spiritual Detachment & Contraction).
 */

import { EphemerisResult, CelestialBodyPosition } from "./types";
import { RASHI_NAMES } from "./constants";

// ==========================================
// 1. INTERFACES & TYPES
// ==========================================

export interface PiscesHouseMandate {
  houseNumber: number;
  signIndex: number; // 11 for Pisces
  signName: string;
  archetypeTitle: string;
  blindFaithSphere: string;
  daivaKripaMechanism: string;
  calculationTrap: string;
  enduringSpiritualBlessing: string;
}

export interface TwelfthHouseExpenditureProfile {
  twelfthHouseSignIndex: number;
  twelfthHouseSignName: number | string;
  twelfthLord: string;
  occupants: string[];
  aspectingGrahas: string[];
  expenditureMode: "Voluntary Auspicious Donation" | "Balanced Mixed Outflow" | "Forced Unconscious Drainage";
  sleepSanctuaryStatus: "Sacred Spiritual Sanctuary" | "Restful Peaceful Chamber" | "Nocturnal Turbulence & Sensory Excess";
  sanctuaryRecommendations: string[];
  expenditureGuidance: string;
}

export interface PlanetaryPiscesBehavior {
  planet: string;
  dignity: string;
  psychologicalExpression: string;
  shastricGuidance: string;
}

export interface KalapurushaHouseOverlayItem {
  houseNumber: number;
  houseSignification: string;
  occupyingSignIndex: number;
  occupyingSignName: string;
  kalapurushaHouseNumber: number; // Sign index + 1
  kalapurushaArchetype: string;
  energyScriptSynthesis: string;
  behavioralManifestation: string;
  actionableGuidance: string;
}

export interface ElementalImmunityProfile {
  agniPercentage: number;
  prithviPercentage: number;
  vayuPercentage: number;
  jalaPercentage: number;
  dominantElement: "Fire (Agni)" | "Earth (Prithvi)" | "Air (Vayu)" | "Water (Jala)";
  secondaryElement: "Fire (Agni)" | "Earth (Prithvi)" | "Air (Vayu)" | "Water (Jala)";
  cellularResistanceScore: number; // 0 to 100
  immunityClassification: "Superior Cellular Heat & Pathogen Shield" | "Robust Structural Stability" | "Moderate Nervous & Respiratory Sensitivity" | "Vulnerable Fluid-Borne & Contagious Susceptibility";
  pathogenVulnerabilitySummary: string;
  waterAscendantFireLordException: {
    isApplicable: boolean;
    waterAscendantSign?: string;
    lagnaLord?: string;
    lordFireSign?: string;
    agniFortificationBonus: string;
  };
  lifestyleImmunityPrescriptions: string[];
}

export interface SpecialDrishtiAspectVector {
  aspectingPlanet: string;
  occupiedHouse: number;
  occupiedSignName: string;
  aspectType: "3rd Aspect (Gemini Toil)" | "4th Aspect (Cancer Boundary)" | "5th Aspect (Leo Nurture)" | "7th Aspect (Direct Reflection)" | "8th Aspect (Scorpio Surgery)" | "9th Aspect (Sagittarius Fortune)" | "10th Aspect (Capricorn Duty)" | "Rahu 5th/9th (Magnification)" | "Ketu 5th/9th (Detachment)";
  targetHouse: number;
  targetSignName: string;
  targetHouseSignification: string;
  kalapurushaArchetypeResonance: string;
  karmicPsychology: string;
  practicalActionDirective: string;
}

export interface MeenaKalapurushaDrishtiMasterReport {
  piscesArchetype: {
    piscesHouse: PiscesHouseMandate;
    twelfthHouseExpenditure: TwelfthHouseExpenditureProfile;
    planetaryOccupantsInPisces: PlanetaryPiscesBehavior[];
    universalCompassionTearsSynthesis: string;
  };
  kalapurushaScriptOverlay: {
    ascendantSignName: string;
    houseOverlays: KalapurushaHouseOverlayItem[];
    masterScriptPhilosophy: string;
  };
  elementalImmunity: ElementalImmunityProfile;
  specialDrishtiMatrix: {
    aspectVectors: SpecialDrishtiAspectVector[];
    masterAspectPhilosophy: string;
  };
  holisticDossierSummary: string;
}

// ==========================================
// 2. REFERENCE DICTIONARIES & TEMPLATES
// ==========================================

export const PISCES_HOUSE_TEMPLATES: Record<number, Omit<PiscesHouseMandate, "houseNumber" | "signIndex" | "signName">> = {
  1: {
    archetypeTitle: "The Intuitive Surrendered Self (Lagna in Meena)",
    blindFaithSphere: "Personal identity, bodily survival, and life path are completely surrendered to cosmic orchestration.",
    daivaKripaMechanism: "Human calculations, cunning plots, and hyper-planning fail; when you surrender personal ego, sudden divine synchronicities guide you.",
    calculationTrap: "Attempting to operate like a shrewd calculating merchant regarding personal branding or physical goals.",
    enduringSpiritualBlessing: "Radiates profound spiritual charisma, oceanic empathy, and effortless protection from fatal accidents.",
  },
  2: {
    archetypeTitle: "The Faithful Sustainer (Dhana Bhava in Meena)",
    blindFaithSphere: "Liquid wealth, family maintenance, and spoken acoustic vibrations operate under blind trust in Providence.",
    daivaKripaMechanism: "Financial provisions arrive through unexplainable channels whenever genuine needs arise, operating like an Akshaya Patra.",
    calculationTrap: "Hoarding wealth out of scarcity terror or calculating commercial returns before helping family members.",
    enduringSpiritualBlessing: "Sweet, spiritually healing speech (Vak Siddhi) and financial sustenance that never runs dry during emergencies.",
  },
  3: {
    archetypeTitle: "The Inspired Intuitive Communicator (Sahaja Bhava in Meena)",
    blindFaithSphere: "Personal enterprise, hands-on writing, mentorship, and younger siblings require intuitive faith rather than transactional leverage.",
    daivaKripaMechanism: "Creative writing, public dialogue, and bold initiatives succeed when channelled from the subconscious ocean rather than rigid formulas.",
    calculationTrap: "Demanding strict transactional accounting or legalistic contracts from younger siblings or close collaborative partners.",
    enduringSpiritualBlessing: "Poetic communicative eloquence, spiritual authorship, and courage anchored in divine trust.",
  },
  4: {
    archetypeTitle: "The Sanctuary of the Divine Mother (Matru Bhava in Meena)",
    blindFaithSphere: "Domestic peace, relationship with mother, home property, and emotional heart sanctuary operate under unconditional faith.",
    daivaKripaMechanism: "The home becomes an ashram of peace when sacred deities, clean water, and prayer are established; human real estate battles dissolve.",
    calculationTrap: "Treating the domestic sanctuary or mother as a commercial asset or complaining about ungrateful domestic kin.",
    enduringSpiritualBlessing: "Deep inner emotional tranquility, sacred maternal blessings (Devi Kripa), and a restful peaceful home.",
  },
  5: {
    archetypeTitle: "The Ocean of Purva Punya & Devotion (Putra Bhava in Meena)",
    blindFaithSphere: "Children, creative intelligence, spiritual mantras, and past-life merits flourish through pure devotional surrender (Bhakti).",
    daivaKripaMechanism: "Children thrive when prayed for rather than micromanaged; sacred mantras unlock intuitive genius beyond intellectual study.",
    calculationTrap: "Imposing strict calculative academic pressure on children or evaluating spiritual practices by commercial gains.",
    enduringSpiritualBlessing: "Brilliant, spiritually inclined progeny, spontaneous astrological intuition, and divine creative flow.",
  },
  6: {
    archetypeTitle: "The Healer through Forgiveness (Shatru Bhava in Meena)",
    blindFaithSphere: "Debts, physical ailments, litigation, and workplace conflicts are neutralized through surrender and forgiveness.",
    daivaKripaMechanism: "Enemies and adversarial lawsuits dissolve when met with non-retaliation, spiritual charity, and supreme faith in cosmic justice.",
    calculationTrap: "Plotting vengeful legal strategies or getting bogged down in bitter, endless workplace rivalries.",
    enduringSpiritualBlessing: "Shatru Shamana (spontaneous pacification of adversaries), miraculous recoveries from illness, and natural healing abilities.",
  },
  7: {
    archetypeTitle: "The Transcendent Sacred Union (Jaya Bhava in Meena)",
    blindFaithSphere: "Marriage, spouse selection, and public business partnerships demand complete absence of commercial transactionality.",
    daivaKripaMechanism: "The spouse enters life through destined divine alignment (often unexpected); marital harmony endures through unconditional forgiveness.",
    calculationTrap: "Drafting calculative marital balance sheets, keeping emotional score, or seeking commercial leverage in relationships.",
    enduringSpiritualBlessing: "Dissolves severe relationship doshas, creating an unbreakable, spiritual lifelong bond with a compassionate partner.",
  },
  8: {
    archetypeTitle: "The Alchemist of Cosmic Surrender (Mrityu Bhava in Meena)",
    blindFaithSphere: "Occult mysteries, sudden life transformations, inheritance, and psychological crises yield to complete surrender.",
    daivaKripaMechanism: "When personal control is completely shattered in deep crises, a divine hand mysteriously lifts you from the abyss.",
    calculationTrap: "Attempting to manipulate occult energies for selfish financial control or panicking over sudden external changes.",
    enduringSpiritualBlessing: "Total immunity from dark psychic attacks, profound mastery over esoteric wisdom, and fearlessness in the face of mortality.",
  },
  9: {
    archetypeTitle: "The Pilgrim of Universal Dharma (Bhagya Bhava in Meena)",
    blindFaithSphere: "Higher philosophy, spiritual teachers (Gurus), father, and pilgrimage require pure devotional faith beyond dogmatic debate.",
    daivaKripaMechanism: "Fortune opens automatically when you honor holy teachers without intellectual skepticism; long-distance journeys bring spiritual rebirth.",
    calculationTrap: "Engaging in pedantic theological arguments or doubting the wisdom of righteous elders out of petty intellectual pride.",
    enduringSpiritualBlessing: "Unshakeable Divine Grace (Daiva Kripa), global spiritual honors, and spontaneous alignment with authentic masters.",
  },
  10: {
    archetypeTitle: "The Servant of the Universal Collective (Karma Bhava in Meena)",
    blindFaithSphere: "Career, public reputation, professional authority, and status operate best when treated as an offering to the Divine.",
    daivaKripaMechanism: "Professional promotions and historical legacy arrive when you work selflessly for collective welfare without political lobbying.",
    calculationTrap: "Playing cynical corporate politics, scheming for titles, or growing bitter when opportunistic colleagues advance temporarily.",
    enduringSpiritualBlessing: "Enduring, honorable public reputation, deep societal respect, and institutional authority that outlives the native.",
  },
  11: {
    archetypeTitle: "The Fountain of Uncalculated Gains (Labha Bhava in Meena)",
    blindFaithSphere: "Social networks, elder siblings, community funds, and large aspirations flourish under generous, uncalculating distribution.",
    daivaKripaMechanism: "Financial windfalls and powerful alliances manifest when you share gains generously with spiritual and humanitarian causes.",
    calculationTrap: "Maintaining friends solely for utilitarian gain or calculating personal profit before participating in community uplift.",
    enduringSpiritualBlessing: "Continuous inflow of benevolent opportunities, saintly and loyal friendships, and fulfillment of virtuous ambitions.",
  },
  12: {
    archetypeTitle: "The Sovereign of Moksha & Voluntary Surrender (Vyaya Bhava in Meena)",
    blindFaithSphere: "Sleep, subconscious dreams, foreign travels, charitable expenditures, and ultimate spiritual liberation (Moksha).",
    daivaKripaMechanism: "Natural home of Pisces (12th in 12th). Voluntary charitable expenditure completely prevents forced hospital or legal losses.",
    calculationTrap: "Stinginess with spiritual donations or hoarding money, which forces sudden involuntary hospital or tax drains.",
    enduringSpiritualBlessing: "Peaceful, celestial sleep, profound visionary dreams, effortless spiritual meditation, and absolute liberation from rebirth.",
  },
};

export const KALAPURUSHA_SIGN_ARCHETYPES: Record<number, { naturalHouse: number; theme: string; coreDrive: string }> = {
  0: { naturalHouse: 1, theme: "Self-Initiative, Raw Action, Impulse & Physical Drive", coreDrive: "Dynamic movement, martial assertion, and pioneering breakthrough" },
  1: { naturalHouse: 2, theme: "Liquid Wealth, Tangible Assets, Food & Preservation", coreDrive: "Financial security, family sustenance, and material comfort" },
  2: { naturalHouse: 3, theme: "Communication, Writing, Trade, Networking & Courage", coreDrive: "Dialogue, agile multitasking, commerce, and media outreach" },
  3: { naturalHouse: 4, theme: "Emotional Comfort, Domestic Sanctuary, Heart & Mother", coreDrive: "Nurturing domestic peace, home property, and maternal protection" },
  4: { naturalHouse: 5, theme: "Royal Authority, Creative Expression, Intelligence & Pride", coreDrive: "Executive leadership, drama, speculative intellect, and dignified honor" },
  5: { naturalHouse: 6, theme: "Analytical Auditing, Problem Solving, Service & Healing", coreDrive: "Systematic organization, conflict resolution, and detailed labor" },
  6: { naturalHouse: 7, theme: "Diplomatic Harmony, Public Dealings, Trade & Contracts", coreDrive: "Social equilibrium, transactionality, partnership balance, and grace" },
  7: { naturalHouse: 8, theme: "Surgical Depth, Secrets, Crisis Transformation & Research", coreDrive: "Unearthing vulnerabilities, occult mastery, and radical regeneration" },
  8: { naturalHouse: 9, theme: "Higher Dharma, Universal Law, Wisdom & Spiritual Pilgrimage", coreDrive: "Ethical expansion, preceptor guidance, and righteous optimism" },
  9: { naturalHouse: 10, theme: "Organizational Labor, Institutional Duty & Perseverance", coreDrive: "Heavy responsibility, grassroots duty, and enduring structure" },
  10: { naturalHouse: 11, theme: "Collective Gains, Humanitarian Syndicates & Global Reform", coreDrive: "Visionary networking, non-linear wealth distribution, and friendship" },
  11: { naturalHouse: 12, theme: "Subconscious Surrender, Spiritual Isolation & Dissolution", coreDrive: "Voluntary charity, peaceful sleep, transcendence, and Moksha" },
};

// ==========================================
// 3. CORE CALCULATION FUNCTIONS
// ==========================================

/**
 * Evaluates the Pisces (Meena) archetype, Blind Faith mandate, 12th house sleep & expenditure mechanics,
 * and planetary behavior in Pisces.
 */
export function evaluateMeenaPiscesArchetype(natalEphem: EphemerisResult): MeenaKalapurushaDrishtiMasterReport["piscesArchetype"] {
  const ascDegree = natalEphem.ascendant?.siderealLongitude ?? 0;
  const ascSignIdx = Math.floor((((ascDegree % 360) + 360) % 360) / 30);
  const meenaSignIdx = 11; // Pisces is sign 11

  const piscesHouseNumber = ((meenaSignIdx - ascSignIdx + 12) % 12) + 1;
  const template = PISCES_HOUSE_TEMPLATES[piscesHouseNumber] ?? PISCES_HOUSE_TEMPLATES[12];

  const piscesHouse: PiscesHouseMandate = {
    houseNumber: piscesHouseNumber,
    signIndex: meenaSignIdx,
    signName: "Pisces",
    archetypeTitle: template.archetypeTitle,
    blindFaithSphere: template.blindFaithSphere,
    daivaKripaMechanism: template.daivaKripaMechanism,
    calculationTrap: template.calculationTrap,
    enduringSpiritualBlessing: template.enduringSpiritualBlessing,
  };

  // 12th House & Expenditure Mechanics
  const twelfthSignIdx = (ascSignIdx + 11) % 12;
  const twelfthSignName = RASHI_NAMES[twelfthSignIdx]?.englishName ?? "Unknown";
  const twelfthLord = RASHI_NAMES[twelfthSignIdx]?.lord ?? "Unknown";

  const occupants: string[] = [];
  const aspectingGrahas: string[] = [];
  const classicalPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  for (const pName of classicalPlanets) {
    const p = natalEphem.planets[pName];
    if (!p) continue;
    const pSignIdx = Math.floor((((p.siderealLongitude % 360) + 360) % 360) / 30);

    if (pSignIdx === twelfthSignIdx) {
      occupants.push(pName);
    }

    const houseDiff = ((twelfthSignIdx - pSignIdx + 12) % 12) + 1;
    if (houseDiff === 7) {
      aspectingGrahas.push(`${pName} (7th Aspect)`);
    } else if (pName === "Mars" && (houseDiff === 4 || houseDiff === 8)) {
      aspectingGrahas.push(`Mars (${houseDiff}th Aspect)`);
    } else if (pName === "Jupiter" && (houseDiff === 5 || houseDiff === 9)) {
      aspectingGrahas.push(`Jupiter (${houseDiff}th Aspect)`);
    } else if (pName === "Saturn" && (houseDiff === 3 || houseDiff === 10)) {
      aspectingGrahas.push(`Saturn (${houseDiff}th Aspect)`);
    } else if ((pName === "Rahu" || pName === "Ketu") && (houseDiff === 5 || houseDiff === 9)) {
      aspectingGrahas.push(`${pName} (${houseDiff}th Aspect)`);
    }
  }

  // Determine sleep sanctuary & expenditure mode
  const hasJupiterConnection = occupants.includes("Jupiter") || aspectingGrahas.some(g => g.includes("Jupiter")) || twelfthLord === "Jupiter";
  const hasRahuAffliction = occupants.includes("Rahu") || aspectingGrahas.some(g => g.includes("Rahu"));
  const hasVenusAffliction = occupants.includes("Venus") || aspectingGrahas.some(g => g.includes("Venus"));
  const hasSaturnPresence = occupants.includes("Saturn") || aspectingGrahas.some(g => g.includes("Saturn"));

  let sleepSanctuaryStatus: TwelfthHouseExpenditureProfile["sleepSanctuaryStatus"] = "Restful Peaceful Chamber";
  let expenditureMode: TwelfthHouseExpenditureProfile["expenditureMode"] = "Balanced Mixed Outflow";
  const sanctuaryRecommendations: string[] = [];

  if (hasJupiterConnection && !hasRahuAffliction) {
    sleepSanctuaryStatus = "Sacred Spiritual Sanctuary";
    expenditureMode = "Voluntary Auspicious Donation";
    sanctuaryRecommendations.push("Maintain a small sacred shrine, deity portrait, or quiet meditation corner in or near the bedroom.");
    sanctuaryRecommendations.push("Keep voluntary charitable commitments active to convert expenditure karma into divine merit.");
  } else if (hasRahuAffliction || (hasVenusAffliction && !hasJupiterConnection)) {
    sleepSanctuaryStatus = "Nocturnal Turbulence & Sensory Excess";
    expenditureMode = "Forced Unconscious Drainage";
    sanctuaryRecommendations.push("Strictly eliminate all screens, smartphones, and media entertainment at least 45 minutes before sleep.");
    sanctuaryRecommendations.push("Keep footwear, clutter, and metallic electronics completely out of the sleeping area.");
    sanctuaryRecommendations.push("Allocate a fixed monthly percentage toward selfless anonymous charity to prevent forced legal or medical drainage.");
  } else if (hasSaturnPresence) {
    sleepSanctuaryStatus = "Restful Peaceful Chamber";
    expenditureMode = "Voluntary Auspicious Donation";
    sanctuaryRecommendations.push("Maintain simple, minimalist, non-luxurious bedding to ground nervous exhaustion.");
    sanctuaryRecommendations.push("Perform quiet meditation before sleep; support elderly or impoverished individuals.");
  } else {
    sanctuaryRecommendations.push("Ensure well-ventilated, quiet room atmosphere with soft, calming natural scents.");
  }

  const expenditureGuidance =
    expenditureMode === "Voluntary Auspicious Donation"
      ? "Your 12th house energy is channeled constructively into voluntary, noble expenditures—temple support, education sponsorships, and spiritual retreats. Money spent willingly on righteous causes shields you from sudden financial drains."
      : expenditureMode === "Forced Unconscious Drainage"
      ? "Warning: Afflictions to the 12th house create unconscious financial leaks through impulse spending, sensory distractions, or unexpected penalties. Practice the Shastric law: give voluntarily to noble causes each month, or the cosmos will drain resources forcibly."
      : "Maintain mindful budgeting and periodic spiritual donations to keep 12th-house expenditures balanced and protective.";

  const twelfthHouseExpenditure: TwelfthHouseExpenditureProfile = {
    twelfthHouseSignIndex: twelfthSignIdx,
    twelfthHouseSignName: twelfthSignName,
    twelfthLord,
    occupants,
    aspectingGrahas,
    expenditureMode,
    sleepSanctuaryStatus,
    sanctuaryRecommendations,
    expenditureGuidance,
  };

  // Planetary occupants in Pisces
  const planetaryOccupantsInPisces: PlanetaryPiscesBehavior[] = [];
  for (const pName of classicalPlanets) {
    const p = natalEphem.planets[pName];
    if (!p) continue;
    const pSignIdx = Math.floor((((p.siderealLongitude % 360) + 360) % 360) / 30);
    if (pSignIdx === meenaSignIdx) {
      if (pName === "Venus") {
        planetaryOccupantsInPisces.push({
          planet: "Venus",
          dignity: "Exalted (Uchha - Highest Spiritual Ecstasy)",
          psychologicalExpression: "Transfers romantic love into divine, selfless adoration (Prema). Unconditional emotional generosity.",
          shastricGuidance: "Marriage and partnerships often manifest through miraculous divine synchronicity. Avoid falling for individuals solely out of pity.",
        });
      } else if (pName === "Mercury") {
        planetaryOccupantsInPisces.push({
          planet: "Mercury",
          dignity: "Debilitated (Neecha - Calculative Ocean Drowning)",
          psychologicalExpression: "Petty merchant logic, legalistic debate, and transactional calculation drown in the vast ocean of faith.",
          shastricGuidance: "Beware of calculative blind spots, misplacing contracts, and overthinking intuitive truths. Rely on ethical intuition over cunning bargains.",
        });
      } else if (pName === "Saturn") {
        planetaryOccupantsInPisces.push({
          planet: "Saturn",
          dignity: "Spiritual Servant (Silent Labor)",
          psychologicalExpression: "Performs heavy, unglamorous service in solitude or institutional back-rooms without demanding applause.",
          shastricGuidance: "Patience and humility are your greatest spiritual weapons. Silent devotion brings enduring inner liberation.",
        });
      } else if (pName === "Rahu") {
        planetaryOccupantsInPisces.push({
          planet: "Rahu",
          dignity: "Fallen Cunning (Material Illusion Drowning)",
          psychologicalExpression: "Materialistic trickery and worldly ambitions feel disoriented in a sign governed by absolute surrender.",
          shastricGuidance: "Abandon manipulative schemes. True success arrives only when ambition is surrendered to spiritual principles.",
        });
      } else if (pName === "Jupiter") {
        planetaryOccupantsInPisces.push({
          planet: "Jupiter",
          dignity: "Own Sign (Swakshetra - Supreme Divine Wisdom)",
          psychologicalExpression: "Profound philosophical depth, oceanic empathy, and natural spiritual guardianship.",
          shastricGuidance: "Act as a beacon of universal compassion; your faith carries miraculous protective power for your entire family.",
        });
      } else {
        planetaryOccupantsInPisces.push({
          planet: pName,
          dignity: "Guest in Ocean of Faith",
          psychologicalExpression: `${pName}'s natural significations operate through deep intuition, dreams, and emotional surrender.`,
          shastricGuidance: `Surrender ${pName}'s egoic attachments into higher service to unlock divine protection.`,
        });
      }
    }
  }

  const universalCompassionTearsSynthesis =
    "WATER SIGN TEARS HIERARCHY (Session 42 & 44): In Vedic Shastra, the three water signs reflect emotional tears at three spiritual octaves: Cancer sheds tears for oneself and immediate family; Scorpio sheds hidden, volcanic tears of repressed passion and betrayal; Pisces sheds universal tears for the suffering of all humanity. Wherever Pisces resides in your chart is an area where you feel oceanic empathy, boundless forgiveness, and a sacred duty to wipe the tears of others without demanding personal reward.";

  return {
    piscesHouse,
    twelfthHouseExpenditure,
    planetaryOccupantsInPisces,
    universalCompassionTearsSynthesis,
  };
}

/**
 * Evaluates the Kalapurusha 12-House Energy Script Overlay (Session 43).
 * Maps every house of the chart to the natural Kalapurusha archetype imported by the occupying sign.
 */
export function evaluateKalapurushaScriptOverlay(natalEphem: EphemerisResult): MeenaKalapurushaDrishtiMasterReport["kalapurushaScriptOverlay"] {
  const ascDegree = natalEphem.ascendant?.siderealLongitude ?? 0;
  const ascSignIdx = Math.floor((((ascDegree % 360) + 360) % 360) / 30);
  const ascSignName = RASHI_NAMES[ascSignIdx]?.englishName ?? "Unknown";

  const houseSignifications: Record<number, string> = {
    1: "Physical Body, Vitality, Self-Identity & Worldly Outlook",
    2: "Wealth Accumulation, Family Lineage, Spoken Words & Assets",
    3: "Younger Siblings, Courage, Hands-on Enterprise & Communication",
    4: "Mother, Home Sanctuary, Vehicles, Domestic Peace & Property",
    5: "Intellect, Creative Expression, Children, Romance & Mantras",
    6: "Daily Workplace Labor, Overcoming Enemies, Debt & Health",
    7: "Spouse, Marriage Union, Business Partners & Public Dealings",
    8: "Occult Knowledge, Sudden Transformation, In-Laws & Longevity",
    9: "Higher Dharma, Father, Spiritual Preceptor & Auspicious Fortune",
    10: "Career Standing, Professional Authority, Public Fame & Duty",
    11: "Social Networks, Elder Siblings, Financial Inflows & Ambitions",
    12: "Sleep Sanctuary, Foreign Lands, Spiritual Solitude & Moksha",
  };

  const houseOverlays: KalapurushaHouseOverlayItem[] = [];

  for (let h = 1; h <= 12; h++) {
    // 0-indexed sign on house h
    const signIdx = (ascSignIdx + (h - 1)) % 12;
    const signName = RASHI_NAMES[signIdx]?.englishName ?? "Unknown";
    const kalapurushaData = KALAPURUSHA_SIGN_ARCHETYPES[signIdx] ?? KALAPURUSHA_SIGN_ARCHETYPES[0];
    const kHouse = kalapurushaData.naturalHouse;

    let energyScriptSynthesis = "";
    let behavioralManifestation = "";
    let actionableGuidance = "";

    // Specific lecture examples highlighted in Session 43:
    if (h === 4 && signIdx === 0) {
      // Aries in 4th (Capricorn Ascendant)
      energyScriptSynthesis = "Aries is Kalapurusha's 1st House (Raw Action, Impulse, Mars Drive) operating inside your 4th House (Home/Mother).";
      behavioralManifestation = "The home environment is dominated by constant movement, fast-paced action, dynamic initiatives, and occasional impulsive domestic friction.";
      actionableGuidance = "Consciously cultivate patience at home; channel physical energy into home improvement and exercise rather than verbal arguments with family.";
    } else if (h === 4 && signIdx === 1) {
      // Taurus in 4th (Aquarius Ascendant)
      energyScriptSynthesis = "Taurus is Kalapurusha's 2nd House (Liquid Wealth, Food, Preservation) operating inside your 4th House (Home/Mother).";
      behavioralManifestation = "The home and mother are viewed as primary stores of financial security, tangible luxury, and nutritional abundance. Domestic peace depends on material stability.";
      actionableGuidance = "Invest in comfortable domestic surroundings and stable property; treat maternal wisdom as an anchor of financial prudence.";
    } else if (h === 10 && signIdx === 2) {
      // Gemini in 10th (Virgo Ascendant)
      energyScriptSynthesis = "Gemini is Kalapurusha's 3rd House (Communication, Dialogue, Media, Networking) operating inside your 10th House (Career).";
      behavioralManifestation = "Professional standing flourishes through writing, commerce, journalism, technological dialogue, and agile multitasking rather than rigid hierarchical bureaucracy.";
      actionableGuidance = "Focus career growth on media, networking, versatile contracts, and continuous intellectual adaptability.";
    } else if (h === 7 && signIdx === 4) {
      // Leo in 7th (Aquarius Ascendant)
      energyScriptSynthesis = "Leo is Kalapurusha's 5th House (Royalty, Creative Pride, Kingship) operating inside your 7th House (Spouse/Partnership).";
      behavioralManifestation = "The spouse possesses natural regal dignity, commanding presence, and expects respect and deference. Marital union operates like an executive royal realm.";
      actionableGuidance = "Never publicly contradict or wound the pride of the spouse; praise their leadership to unlock deep loyalty and generous partnership.";
    } else if (h === 12 && signIdx === 1) {
      // Taurus in 12th (Gemini Ascendant)
      energyScriptSynthesis = "Taurus is Kalapurusha's 2nd House (Assets, Food, Sensory Wealth) operating inside your 12th House (Sleep/Retreat).";
      behavioralManifestation = "Sleep, solitude, and foreign expenses are intimately connected to material indulgence, luxurious bedding, fine dining, and sensory pampering.";
      actionableGuidance = "Maintain moderate sleep habits and avoid lavish nocturnal expenditures; invest in comfortable, ergonomic rest without hedonistic excess.";
    } else {
      // Universal synthesis
      energyScriptSynthesis = `${signName} brings Kalapurusha's ${kHouse}th House energy (${kalapurushaData.theme}) into your ${h}th House (${houseSignifications[h]}).`;
      behavioralManifestation = `You experience ${houseSignifications[h].toLowerCase()} primarily through ${kalapurushaData.coreDrive.toLowerCase()}.`;
      actionableGuidance = `Harmonize House ${h} by integrating ${signName}'s natural Kalapurusha ${kHouse}th house virtues: ${kalapurushaData.theme}.`;
    }

    houseOverlays.push({
      houseNumber: h,
      houseSignification: houseSignifications[h],
      occupyingSignIndex: signIdx,
      occupyingSignName: signName,
      kalapurushaHouseNumber: kHouse,
      kalapurushaArchetype: kalapurushaData.theme,
      energyScriptSynthesis,
      behavioralManifestation,
      actionableGuidance,
    });
  }

  const masterScriptPhilosophy =
    "THE KALAPURUSHA SCRIPT OVERLAY LAW (Session 43): The 12 houses are fixed architectural rooms identical in all humans: House 1 is always the body, House 4 is home, House 7 is spouse, House 10 is career. However, the zodiac sign sitting on each house is the 'actor' reading the cosmic script. Whichever sign sits on a house imports the natural qualities of that sign's Kalapurusha position. Understanding this overlay reveals why people with the same house lords experience wildly different life dynamics based on the sign's cosmic script.";

  return {
    ascendantSignName: ascSignName,
    houseOverlays,
    masterScriptPhilosophy,
  };
}

/**
 * Evaluates the Elemental Immunity Hierarchy & Pathogen Vulnerability (Session 44).
 * Calculates cellular heat resistance across Fire, Earth, Air, and Water, and applies the
 * Water Ascendant Lord in Fire Sign Exception.
 */
export function evaluateElementalImmunityHierarchy(natalEphem: EphemerisResult): ElementalImmunityProfile {
  const ascDegree = natalEphem.ascendant?.siderealLongitude ?? 0;
  const ascSignIdx = Math.floor((((ascDegree % 360) + 360) % 360) / 30);
  const ascSignInfo = RASHI_NAMES[ascSignIdx];
  const lagnaLordName = ascSignInfo?.lord ?? "Mars";

  const lordPlanet = natalEphem.planets[lagnaLordName];
  const lordSignIdx = lordPlanet ? Math.floor((((lordPlanet.siderealLongitude % 360) + 360) % 360) / 30) : 0;
  const lordSignInfo = RASHI_NAMES[lordSignIdx];

  const sunSignIdx = Math.floor((((natalEphem.planets["Sun"]?.siderealLongitude ?? 0) % 360) + 360) % 360 / 30);
  const moonSignIdx = Math.floor((((natalEphem.planets["Moon"]?.siderealLongitude ?? 0) % 360) + 360) % 360 / 30);
  const sixthSignIdx = (ascSignIdx + 5) % 12;

  const elementsCount: Record<"Fire" | "Earth" | "Air" | "Water", number> = {
    Fire: 0,
    Earth: 0,
    Air: 0,
    Water: 0,
  };

  // Weighted evaluation:
  // Ascendant: 30%
  // Ascendant Lord: 25%
  // Sun (Vitality): 20%
  // Moon (Bodily fluids): 15%
  // 6th House (Disease locus): 10%
  const getElem = (sIdx: number): "Fire" | "Earth" | "Air" | "Water" => {
    return (RASHI_NAMES[sIdx]?.element as "Fire" | "Earth" | "Air" | "Water") ?? "Fire";
  };

  elementsCount[getElem(ascSignIdx)] += 30;
  elementsCount[getElem(lordSignIdx)] += 25;
  elementsCount[getElem(sunSignIdx)] += 20;
  elementsCount[getElem(moonSignIdx)] += 15;
  elementsCount[getElem(sixthSignIdx)] += 10;

  const agniPct = elementsCount.Fire;
  const prithviPct = elementsCount.Earth;
  const vayuPct = elementsCount.Air;
  const jalaPct = elementsCount.Water;

  const sortedElements = (Object.entries(elementsCount) as ["Fire" | "Earth" | "Air" | "Water", number][])
    .sort((a, b) => b[1] - a[1]);

  const elemLabelMap: Record<"Fire" | "Earth" | "Air" | "Water", "Fire (Agni)" | "Earth (Prithvi)" | "Air (Vayu)" | "Water (Jala)"> = {
    Fire: "Fire (Agni)",
    Earth: "Earth (Prithvi)",
    Air: "Air (Vayu)",
    Water: "Water (Jala)",
  };

  const dominantElement = elemLabelMap[sortedElements[0][0]];
  const secondaryElement = elemLabelMap[sortedElements[1][0]];

  // Base cellular resistance score: Fire provides 1.0x, Earth 0.8x, Air 0.6x, Water 0.4x
  let baseScore = (agniPct * 1.0) + (prithviPct * 0.8) + (vayuPct * 0.6) + (jalaPct * 0.4);

  // Water Ascendant Lord in Fire Sign Exception (Session 44)
  const isWaterAscendant = [3, 7, 11].includes(ascSignIdx); // Cancer, Scorpio, Pisces
  const isLordInFireSign = [0, 4, 8].includes(lordSignIdx); // Aries, Leo, Sagittarius

  let waterAscendantFireLordException: ElementalImmunityProfile["waterAscendantFireLordException"] = {
    isApplicable: false,
    agniFortificationBonus: "Not applicable.",
  };

  if (isWaterAscendant && isLordInFireSign) {
    waterAscendantFireLordException = {
      isApplicable: true,
      waterAscendantSign: ascSignInfo?.englishName,
      lagnaLord: lagnaLordName,
      lordFireSign: lordSignInfo?.englishName,
      agniFortificationBonus: `AGNI FORTIFICATION ACTIVATED: Although your physical constitution is rooted in a Water sign (${ascSignInfo?.englishName}), your Lagna Lord (${lagnaLordName}) resides in an Agni Fire sign (${lordSignInfo?.englishName}). This injects supreme cellular heat into your system, purifying fluid sluggishness and elevating your disease resistance significantly!`,
    };
    baseScore = Math.min(95, baseScore + 20); // Significant 20-point immunity boost
  }

  const cellularResistanceScore = Math.min(100, Math.max(30, Math.round(baseScore)));

  let immunityClassification: ElementalImmunityProfile["immunityClassification"] = "Moderate Nervous & Respiratory Sensitivity";
  let pathogenVulnerabilitySummary = "";

  if (cellularResistanceScore >= 80) {
    immunityClassification = "Superior Cellular Heat & Pathogen Shield";
    pathogenVulnerabilitySummary = "High internal metabolic fire (Jatharagni) naturally incinerates environmental pathogens. Robust recovery from viral or bacterial infections.";
  } else if (cellularResistanceScore >= 65) {
    immunityClassification = "Robust Structural Stability";
    pathogenVulnerabilitySummary = "Solid physical stamina, dense bone/tissue architecture, and steady endurance. Slow to fall sick, though recoveries require patient nourishment.";
  } else if (cellularResistanceScore >= 50) {
    immunityClassification = "Moderate Nervous & Respiratory Sensitivity";
    pathogenVulnerabilitySummary = "Susceptible to nervous exhaustion, respiratory dry spells, environmental allergies, and fluctuating vital energy under mental stress.";
  } else {
    immunityClassification = "Vulnerable Fluid-Borne & Contagious Susceptibility";
    pathogenVulnerabilitySummary = "High sensitivity to waterborne contaminants, fluid retention, lymphatic sluggishness, and emotional contagion. Requires active digestive fire support.";
  }

  const lifestyleImmunityPrescriptions: string[] = [];
  if (dominantElement.includes("Fire")) {
    lifestyleImmunityPrescriptions.push("Avoid excessive inflammatory, spicy, or fried foods that overheat the liver and blood (Pitta pacification).");
    lifestyleImmunityPrescriptions.push("Stay hydrated with cooling infused water (mint, vetiver, fennel) during hot midday hours.");
  } else if (dominantElement.includes("Earth")) {
    lifestyleImmunityPrescriptions.push("Engage in vigorous daily aerobic exercise to prevent metabolic sluggishness, cholesterol buildup, and lymphatic stagnation.");
    lifestyleImmunityPrescriptions.push("Favor warm, light, freshly prepared meals with pungent spices like black pepper and dry ginger.");
  } else if (dominantElement.includes("Air")) {
    lifestyleImmunityPrescriptions.push("Establish strict daily sleep and meal timings to anchor erratic Vata nervous fluctuations.");
    lifestyleImmunityPrescriptions.push("Practice Abhyanga (warm sesame oil self-massage) weekly and gentle diaphragmatic Pranayama.");
  } else {
    lifestyleImmunityPrescriptions.push("Consume warm herbal teas (ginger, tulsi, cinnamon) daily to fortify internal metabolic fire (Agni).");
    lifestyleImmunityPrescriptions.push("Avoid damp, cold environments, excessive raw salads, and iced beverages; protect chest and throat from cold drafts.");
  }

  return {
    agniPercentage: agniPct,
    prithviPercentage: prithviPct,
    vayuPercentage: vayuPct,
    jalaPercentage: jalaPct,
    dominantElement,
    secondaryElement,
    cellularResistanceScore,
    immunityClassification,
    pathogenVulnerabilitySummary,
    waterAscendantFireLordException,
    lifestyleImmunityPrescriptions,
  };
}

/**
 * Evaluates the Special Drishti (Aspects) and their Kalapurusha Sign-Resonance Meanings (Session 45).
 */
export function evaluateSpecialDrishtiKalapurushaResonance(natalEphem: EphemerisResult): SpecialDrishtiAspectVector[] {
  const ascDegree = natalEphem.ascendant?.siderealLongitude ?? 0;
  const ascSignIdx = Math.floor((((ascDegree % 360) + 360) % 360) / 30);

  const houseSignifications: Record<number, string> = {
    1: "Body, Vitality & Identity",
    2: "Wealth, Family & Speech",
    3: "Courage, Siblings & Effort",
    4: "Home, Mother & Domestic Peace",
    5: "Children, Intellect & Mantras",
    6: "Health, Debts & Subordinates",
    7: "Spouse, Marriage & Public Trade",
    8: "Longevity, Occult & Secrets",
    9: "Dharma, Fortune & Preceptors",
    10: "Career, Authority & Status",
    11: "Gains, Networks & Elder Siblings",
    12: "Sleep, Expenditures & Moksha",
  };

  const aspectVectors: SpecialDrishtiAspectVector[] = [];
  const classicalPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  for (const pName of classicalPlanets) {
    const p = natalEphem.planets[pName];
    if (!p) continue;
    const pSignIdx = Math.floor((((p.siderealLongitude % 360) + 360) % 360) / 30);
    const occupiedHouse = ((pSignIdx - ascSignIdx + 12) % 12) + 1;
    const occupiedSignName = RASHI_NAMES[pSignIdx]?.englishName ?? "Unknown";

    // Helper to push aspect vector
    const pushAspect = (
      aspectType: SpecialDrishtiAspectVector["aspectType"],
      targetH: number,
      kalapurushaArchetypeResonance: string,
      karmicPsychology: string,
      practicalActionDirective: string
    ) => {
      const normTargetH = ((targetH - 1) % 12) + 1;
      const targetSignIdx = (ascSignIdx + (normTargetH - 1)) % 12;
      const targetSignName = RASHI_NAMES[targetSignIdx]?.englishName ?? "Unknown";

      aspectVectors.push({
        aspectingPlanet: pName,
        occupiedHouse,
        occupiedSignName,
        aspectType,
        targetHouse: normTargetH,
        targetSignName,
        targetHouseSignification: houseSignifications[normTargetH],
        kalapurushaArchetypeResonance,
        karmicPsychology,
        practicalActionDirective,
      });
    };

    // Universal 7th Aspect for all classical grahas + nodes
    pushAspect(
      "7th Aspect (Direct Reflection)",
      occupiedHouse + 6,
      "Universal 7th Aspect: Direct energetic confrontation and reflection. The planet projects its total internal gaze onto the opposite life realm.",
      `${pName} draws energy from and injects its core nature directly into House ${((occupiedHouse + 5) % 12) + 1}.`,
      "Maintain conscious balance between occupied and opposite houses to prevent polarization."
    );

    // Special Aspects: Saturn (3rd and 10th)
    if (pName === "Saturn") {
      // 3rd Aspect (Gemini / H3 Effort)
      pushAspect(
        "3rd Aspect (Gemini Toil)",
        occupiedHouse + 2,
        "Corresponds to Gemini (Kalapurusha 3rd House of Manual Toil & Arduous Effort).",
        `Where Saturn casts his 3rd aspect (House ${((occupiedHouse + 1) % 12) + 1}), fruit does not manifest easily. It demands relentless physical labor, testing patience through repetitive toil.`,
        "Never expect shortcuts or early praise in this house. Embrace disciplined, step-by-step physical effort."
      );
      // 10th Aspect (Capricorn / H10 Duty)
      pushAspect(
        "10th Aspect (Capricorn Duty)",
        occupiedHouse + 9,
        "Corresponds to Capricorn (Kalapurusha 10th House of Selfless Duty & Nishkama Karma).",
        `Where Saturn casts his 10th aspect (House ${((occupiedHouse + 8) % 12) + 1}), the native must assume total personal accountability without ego or entitlement.`,
        "Perform heavy responsibilities selflessly in this domain. Enduring historical respect (Chirasthayi Yash) will result."
      );
    }

    // Special Aspects: Mars (4th and 8th)
    if (pName === "Mars") {
      // 4th Aspect (Cancer / H4 Comfort Intrusion)
      pushAspect(
        "4th Aspect (Cancer Boundary)",
        occupiedHouse + 3,
        "Corresponds to Cancer (Kalapurusha 4th House of Emotional Boundaries & Comfort Zones).",
        `Mars projects martial aggression into the emotional boundary of House ${((occupiedHouse + 2) % 12) + 1}. Impulsive reactions risk disrupting tranquility.`,
        "Exercise conscious emotional restraint in this house. Guard against sudden aggressive impulses."
      );
      // 8th Aspect (Scorpio / H8 Surgical Transformation)
      pushAspect(
        "8th Aspect (Scorpio Surgery)",
        occupiedHouse + 7,
        "Corresponds to Scorpio (Kalapurusha 8th House of Surgical Investigation & Deep Transformation).",
        `Mars casts an intense, surgical, investigative gaze onto House ${((occupiedHouse + 6) % 12) + 1}. It unearths hidden secrets, confronts vulnerabilities, and forces profound transformation.`,
        "Face uncomfortable truths bravely in this domain. Undergo deep psychological healing rather than repressing fear."
      );
    }

    // Special Aspects: Jupiter (5th and 9th)
    if (pName === "Jupiter") {
      // 5th Aspect (Leo / H5 Creative Parental Nurture)
      pushAspect(
        "5th Aspect (Leo Nurture)",
        occupiedHouse + 4,
        "Corresponds to Leo (Kalapurusha 5th House of Creative Affection & Parental Care).",
        `Jupiter looks upon House ${((occupiedHouse + 3) % 12) + 1} with loving, protective parental affection, nurturing its significations like beloved children.`,
        "Channel unconditional warmth, teaching, and creative mentorship into this life department."
      );
      // 9th Aspect (Sagittarius / H9 Fortune Expansion)
      pushAspect(
        "9th Aspect (Sagittarius Fortune)",
        occupiedHouse + 8,
        "Corresponds to Sagittarius (Kalapurusha 9th House of Divine Fortune & Higher Dharma).",
        `Jupiter sanctifies House ${((occupiedHouse + 7) % 12) + 1} with protective Divine Grace (Dharma Devata), expanding virtuous fortune and higher moral wisdom.`,
        "Align this house with righteous conduct, spiritual study, and charity to activate miraculous luck."
      );
    }

    // Special Aspects: Rahu & Ketu (5th and 9th)
    if (pName === "Rahu") {
      pushAspect(
        "Rahu 5th/9th (Magnification)",
        occupiedHouse + 4,
        "Rahu's Trinal Aspect: Magnifies, obsesses, and multiplies worldly entanglements and unconventional ambition.",
        `Rahu creates intense insatiable hunger and out-of-the-box expansion in House ${((occupiedHouse + 3) % 12) + 1}.`,
        "Guard against reckless obsession or deceptive schemes in this house; maintain strict ethical boundaries."
      );
      pushAspect(
        "Rahu 5th/9th (Magnification)",
        occupiedHouse + 8,
        "Rahu's Trinal Aspect: Magnifies, obsesses, and multiplies worldly entanglements and unconventional ambition.",
        `Rahu projects visionary hunger and foreign/unorthodox connections into House ${((occupiedHouse + 7) % 12) + 1}.`,
        "Utilize innovation and modern technology ethically while avoiding illusory shortcuts."
      );
    }

    if (pName === "Ketu") {
      pushAspect(
        "Ketu 5th/9th (Detachment)",
        occupiedHouse + 4,
        "Ketu's Trinal Aspect: Contracts, detaches, and minimizes material attachment, prompting spiritual re-evaluation.",
        `Ketu induces subtle disinterest, disillusionment, or spiritual liberation regarding House ${((occupiedHouse + 3) % 12) + 1}.`,
        "Do not cling rigidly to material outcomes here; embrace spiritual detachment and selfless service."
      );
      pushAspect(
        "Ketu 5th/9th (Detachment)",
        occupiedHouse + 8,
        "Ketu's Trinal Aspect: Contracts, detaches, and minimizes material attachment, prompting spiritual re-evaluation.",
        `Ketu pierces worldly illusions in House ${((occupiedHouse + 7) % 12) + 1}, directing your soul toward introspective wisdom.`,
        "Treat challenges in this house as divine catalysts designed to burn off purva-janma karmic bondage."
      );
    }
  }

  return aspectVectors;
}

/**
 * Master Report Generator for Pisces Archetype, Kalapurusha Script Overlay,
 * Elemental Immunity & Special Drishti Mechanics.
 */
export function generateMeenaKalapurushaDrishtiMasterReport(natalEphem: EphemerisResult): MeenaKalapurushaDrishtiMasterReport {
  const piscesArchetype = evaluateMeenaPiscesArchetype(natalEphem);
  const kalapurushaScriptOverlay = evaluateKalapurushaScriptOverlay(natalEphem);
  const elementalImmunity = evaluateElementalImmunityHierarchy(natalEphem);
  const aspectVectors = evaluateSpecialDrishtiKalapurushaResonance(natalEphem);

  const masterAspectPhilosophy =
    "PLANETARY DRISHTI AS KALAPURUSHA INTENTION (Session 45): While planets work physically in the house they occupy, their aspects (Drishti) project desires, gaze, and intentions onto other houses. Each special aspect carries the specific imprint of a Kalapurusha sign: Saturn's 3rd aspect brings Gemini manual toil and his 10th brings Capricorn selfless duty; Mars's 4th brings Cancer comfort boundary invasion and his 8th brings Scorpio surgical crisis; Jupiter's 5th brings Leo parental love and his 9th brings Sagittarius divine fortune; Rahu magnifies material hunger, while Ketu enforces spiritual detachment.";

  const holisticDossierSummary = `Pisces (Meena Rashi) occupies House ${piscesArchetype.piscesHouse.houseNumber} in your chart: "${piscesArchetype.piscesHouse.archetypeTitle}". In this house, human calculation fails and you must operate with Blind Faith (Andha Vishwas), for only Divine Grace (Daiva Kripa) can rescue and elevate you. Your 12th house expenditure reflects ${piscesArchetype.twelfthHouseExpenditure.expenditureMode} (${piscesArchetype.twelfthHouseExpenditure.sleepSanctuaryStatus}). Under the Kalapurusha Script Overlay, each of your 12 houses imports the natural archetypal script of its occupying sign over the fixed cosmic template. Your Elemental Immunity reveals ${elementalImmunity.dominantElement} dominance with a Cellular Resistance Score of ${elementalImmunity.cellularResistanceScore}/100 (${elementalImmunity.immunityClassification})${elementalImmunity.waterAscendantFireLordException.isApplicable ? ` [${elementalImmunity.waterAscendantFireLordException.agniFortificationBonus}]` : ""}. Finally, your active planetary aspects operate through ${aspectVectors.length} specialized Kalapurusha intention vectors, shaping how Saturn demands Gemini toil/Capricorn duty, Mars triggers Cancer boundary/Scorpio surgery, and Jupiter sanctifies with Leo affection/Sagittarius fortune.`;

  return {
    piscesArchetype,
    kalapurushaScriptOverlay,
    elementalImmunity,
    specialDrishtiMatrix: {
      aspectVectors,
      masterAspectPhilosophy,
    },
    holisticDossierSummary,
  };
}
