/**
 * Classical Vedic Makara Rashi (Capricorn), Kurma Avatara Archetype &
 * Saturn's 5-Fold Influence Matrix Engine
 * (मकर राशि, कूर्म अवतार, शनि पञ्च-प्रभाव एवं कलियुग मुक्ति)
 *
 * Shastric Foundations:
 * - Session 36: Ethical Responsibility of Astrologers (Personal Life-Correction vs Casual Prediction),
 *   The Multi-Lagna Framework of Existence (Lagna, Lagnesha, Chandra, Guru, Surya, Shani, Arudha Lagna),
 *   Structural Evolution of the 12 Signs through Gunas (1-4 Rajasic "I to I", 5-8 Tamasic "I to You",
 *   9-12 Sattvic "I to All"), and the Artha Trikona Triad (Taurus Rajasic Earth, Virgo Tamasic Earth,
 *   Capricorn Sattvic Earth - Nishkama Karma).
 * - Session 37: The Kurma Avatara Archetype (Samudra Manthan - bearing Mount Mandara quietly at the ocean floor),
 *   Whichever house Capricorn occupies -> perform heavy labor quietly without expectation of praise, yielding
 *   Chirasthayi Yash (enduring fame). Saturn Origins (Surya & Chhaya - Heen Bhavna / Inferiority Complex),
 *   Saturn's 5-Fold Influence Matrix:
 *     1. Primary Occupied House (field of initial burden/inadequacy)
 *     2. Chhaya (Shadow) Flanking Effect (1 house behind & 1 house ahead)
 *     3. 4th House Karmic Fruition (concentrates and fortifies tangible results 4 houses forward)
 *     4. Special Aspects (Drishti: 3rd, 7th, 10th houses)
 *     5. 5th House Limping Trigger (Manda Effect: hurdles/tests 5 houses forward)
 *   Practical Hygiene & Grooming: Hair (Kesha) & Footwear (Shoes) rules. Capricorn across the 12 Ascendants.
 * - Session 38: Master Respiratory Immunity Remedy (Mars outer nostrils, Jupiter Prana, Saturn Apana/Mustard oil,
 *   Venus 6 drops Sanjeevani), Psychological Profiles under Saturnian influence, Saturn in 12 Signs & House
 *   Maturation/Aging (H1-H12 early gravity), King Parikshit's Dialogue on Kali Yuga & Singular Redemption
 *   (Nama Sankirtana + Nishkama Karma), Dignity Contrasts in Capricorn (Mars Exalted 28° vs Jupiter Debilitated 5°),
 *   and Male vs Female Zodiac Signs (Purusha Odd Fire/Air vs Stri Even Earth/Water).
 */

import { EphemerisResult, CelestialBodyPosition } from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateArudhaPadas } from "./jaimini";

// ==========================================
// 1. INTERFACES & TYPES
// ==========================================

export interface MultiLagnaCenter {
  name: string;
  hindiName: string;
  signIndex: number;
  signName: string;
  signLord: string;
  houseFromLagna: number;
  spiritualSignificance: string;
  operationalSphere: string;
}

export interface MultiLagnaProfile {
  centers: Record<string, MultiLagnaCenter>;
  synthesis: string;
}

export interface GunaStructuralProfile {
  rajasicQuadrat: {
    signs: string[];
    planetsPresent: string[];
    perspective: string; // "I to I"
    philosophicalTheme: string;
  };
  tamasicQuadrat: {
    signs: string[];
    planetsPresent: string[];
    perspective: string; // "I to You"
    philosophicalTheme: string;
  };
  sattvicQuadrat: {
    signs: string[];
    planetsPresent: string[];
    perspective: string; // "I to All"
    philosophicalTheme: string;
  };
  dominantGunaPerspective: string;
  arthaTrikona: {
    taurusH2: {
      signName: string;
      houseFromLagna: number;
      guna: string; // Rajasic Earth
      planetsPresent: string[];
      karmicPrinciple: string;
    };
    virgoH6: {
      signName: string;
      houseFromLagna: number;
      guna: string; // Tamasic Earth
      planetsPresent: string[];
      karmicPrinciple: string;
    };
    capricornH10: {
      signName: string;
      houseFromLagna: number;
      guna: string; // Sattvic Earth
      planetsPresent: string[];
      karmicPrinciple: string;
    };
    synthesis: string;
  };
}

export interface KurmaArchetypeProfile {
  capricornHouse: number; // 1 to 12
  capricornSignName: string;
  rulingLord: string;
  mythologicalArchetype: string;
  samudraManthanDuty: string;
  housePrescription: string;
  chirasthayiYashGuidance: string;
  planetsInCapricorn: Array<{
    planet: string;
    dignity: string;
    archetypeRole: string;
    hairOrWorkExpression: string;
  }>;
  groomingIndicators: {
    hairHygieneRule: string;
    footwearHygieneRule: string;
  };
}

export interface Saturn5FoldReach {
  occupiedHouse: number;
  occupiedSignIndex: number;
  occupiedSignName: string;
  heenBhavnaDomain: string; // Area of initial inadequacy / inferiority complex
  chhayaFlankingBehind: {
    house: number;
    signName: string;
    mechanism: string;
  };
  chhayaFlankingAhead: {
    house: number;
    signName: string;
    mechanism: string;
  };
  fourthHouseFruition: {
    house: number;
    signName: string;
    fruitionPrinciple: string;
  };
  specialDrishtis: Array<{
    aspectLabel: string; // 3rd, 7th, 10th
    targetHouse: number;
    targetSignName: string;
    karmicImpact: string;
  }>;
  manda5thHurdle: {
    house: number;
    signName: string;
    limperMechanism: string;
  };
  allInfluencedHouses: number[];
  fearAsTeacherSynthesis: string;
}

export interface SaturnMaturationProfile {
  saturnSign: string;
  saturnSignLord: string;
  signPsychologicalTheme: string;
  rajYogaPotential: string;
  houseAgingImpact: {
    occupiedHouse: number;
    maturationSphere: string;
    agingEntity: string;
    shastricPrescription: string;
  };
}

export interface PurushaStriPolarity {
  purushaCount: number; // Odd signs 1, 3, 5, 7, 9, 11
  purushaPlanets: string[];
  striCount: number; // Even signs 2, 4, 6, 8, 10, 12
  striPlanets: string[];
  dominantPolarity: "Purusha (Active / Extroverted / Initiative)" | "Stri (Receptive / Introverted / Preservation)" | "Balanced Equilibrium";
  energeticGuidance: string;
}

export interface KaliYugaRedemptionProfile {
  shrimadBhagavataContext: string;
  singularRedemptionPrinciple: string;
  dailyChantingShield: string;
  respiratoryRemedyAnatomy: {
    outerNostrilsRuler: string; // Mars (Mangal)
    pranaVayuInboundRuler: string; // Jupiter (Guru)
    apanaVayuOutboundRuler: string; // Saturn (Shani)
    substanceRuler: string; // Pure Mustard Oil (Saturn)
    sanjeevaniDosageRuler: string; // 6 Drops (Venus)
    protocol: string;
  };
  ethicalAstrologyGuardrail: string;
}

export interface MakaraKurmaMasterReport {
  multiLagna: MultiLagnaProfile;
  gunaStructural: GunaStructuralProfile;
  kurmaArchetype: KurmaArchetypeProfile;
  saturnReach: Saturn5FoldReach;
  saturnMaturation: SaturnMaturationProfile;
  purushaStri: PurushaStriPolarity;
  kaliYugaRedemption: KaliYugaRedemptionProfile;
  masterExecutiveSummary: string;
}

// ==========================================
// 2. REFERENCE TABLES & METADATA
// ==========================================

const SIGN_LORDS: string[] = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

function getSignName(index: number): string {
  const norm = ((index % 12) + 12) % 12;
  return RASHI_NAMES[norm]?.englishName || "Unknown";
}

export const CAPRICORN_HOUSE_DUTY_RULES: Record<number, {
  domain: string;
  selflessLaborGuidance: string;
  chirasthayiYashOutcome: string;
}> = {
  1: {
    domain: "Physical Self, Identity & Personal Demeanor",
    selflessLaborGuidance: "Cultivate relentless physical discipline, humility, and austere self-restraint. Bear family and community burdens quietly without self-aggrandizing complaints or seeking public sympathy.",
    chirasthayiYashOutcome: "Earns monumental reputation as an unshakeable pillar of society whom everyone trusts in a crisis."
  },
  2: {
    domain: "Family Wealth, Speech & Dietary Sustenance",
    selflessLaborGuidance: "Manage family finances with detached frugality; speak truth measuredly without abusive boasting. Provide for family members without demanding endless gratitude.",
    chirasthayiYashOutcome: "Builds enduring generational capital and respected ancestral credibility that outlasts market fluctuations."
  },
  3: {
    domain: "Enterprise, Communication, Siblings & Practical Skills",
    selflessLaborGuidance: "Toil untiringly with hands, technical skills, and commercial initiatives. Protect and mentor younger siblings without expecting reciprocal favors.",
    chirasthayiYashOutcome: "Mastery of craftsmanship and unassailable courage that blossoms into lasting professional acclaim."
  },
  4: {
    domain: "Home Sanctuary, Real Estate & Maternal Peace",
    selflessLaborGuidance: "Shoulder the maintenance of property, domestic harmony, and elderly maternal care silently. Never demand emotional applause for managing the household.",
    chirasthayiYashOutcome: "Achieves an unshakeable internal foundation, durable properties, and deep peace that worldly chaos cannot shake."
  },
  5: {
    domain: "Children, Intellect, Creativity & Disciples",
    selflessLaborGuidance: "Educate and raise children or students with patient, firm, non-transactional devotion. Avoid micromanaging or demanding early brilliance.",
    chirasthayiYashOutcome: "Produces deeply ethical, accomplished children and disciples whose achievements bring timeless honor to the family lineage."
  },
  6: {
    domain: "Daily Routines, Workplace Service, Debts & Health",
    selflessLaborGuidance: "Execute repetitive, unglamorous workplace chores and service tasks methodically. Solve difficult systemic problems without complaining about unfair workloads.",
    chirasthayiYashOutcome: "Becomes indispensable as a master problem solver; crushes adversaries through sheer ethical endurance."
  },
  7: {
    domain: "Spouse, Marriage, Public Treaties & Business Alliances",
    selflessLaborGuidance: "Serve your marital partner and commercial associates faithfully. Eliminate transactional scorekeeping and selfish demands for emotional coddling.",
    chirasthayiYashOutcome: "Forges an unbreakable union and ironclad business trust, creating long-term social prestige."
  },
  8: {
    domain: "Deep Research, Occult Sciences, In-laws & Unearned Assets",
    selflessLaborGuidance: "Dive into complex investigations, hidden secrets, and occult knowledge with complete silence. Manage family crises and inheritances with zero greed.",
    chirasthayiYashOutcome: "Unlocks profound esoteric wisdom, psychological fearlessness, and generational longevity."
  },
  9: {
    domain: "Father, Mentors, Lineage Dharma & Higher Truth",
    selflessLaborGuidance: "Serve your father, teachers, and lineage traditions selflessly. Refrain from arguing over philosophical righteousness or showing off theological knowledge.",
    chirasthayiYashOutcome: "Attains divine grace (*Daiva Kripa*) and true spiritual authority that guides generations."
  },
  10: {
    domain: "Career, Governance, Public Standing & Executive Duty",
    selflessLaborGuidance: "Execute professional tasks with monastic rigor and quiet dedication. Never brag about promotions, demand early applause, or cut ethical corners.",
    chirasthayiYashOutcome: "Ascends to sovereign executive stature and enduring historical legacy (*Chirasthayi Yash*)."
  },
  11: {
    domain: "Social Networks, Elder Siblings, Large Organizations & Cash Flow",
    selflessLaborGuidance: "Build networks and community institutions without greedy monetization. Support elder siblings and grassroots groups with consistent loyalty.",
    chirasthayiYashOutcome: "Accumulates compounding, sustainable wealth and an extensive loyal brotherhood."
  },
  12: {
    domain: "Solitude, Foreign Lands, Meditation & Expenditure",
    selflessLaborGuidance: "Engage in charitable donations and quiet spiritual meditation in complete secrecy. Fulfill foreign duties or institutional service without seeking validation.",
    chirasthayiYashOutcome: "Dissolves subconscious karmic debts, attaining effortless material sustenance and ultimate spiritual liberation (*Moksha*)."
  }
};

export const SATURN_SIGN_PSYCHOLOGY: Record<string, {
  psychology: string;
  rajYogaPotential: string;
}> = {
  Aries: {
    psychology: "Debilitated (Neecha). Internal struggle between Aries' reckless speed and Saturn's methodical slowness. Native oscillates between acting too fast or freezing.",
    rajYogaPotential: "When the native masters conscious patience and harnesses martial courage through disciplined strategy, this position transforms into an unbreakable, battle-tested Raj Yoga."
  },
  Taurus: {
    psychology: "Saturn in friendly Earth. Focus on material assets, land, and family reserves. Vulnerability lies in greed, anxiety over hoarding, or miserliness.",
    rajYogaPotential: "Detached, ethical management of resources without covetous hoarding unlocks massive, permanent financial stability and flourishing estates."
  },
  Gemini: {
    psychology: "Saturn in friendly Air. Conflict between Mercurial rapid-fire speech and Saturnian solemn silence. Native learns to speak concisely with immense practical gravitas.",
    rajYogaPotential: "Mastery of weighted, authoritative communication and technical problem-solving makes the native an exceptional legal, diplomatic, or technological strategist."
  },
  Cancer: {
    psychology: "Saturn in enemy Water sign. Intense emotional attachment to family roots, yet life circumstances repeatedly compel living away from home to mature emotionally.",
    rajYogaPotential: "Initial emotional separation burns away needy codependency, creating deep inner resilience, emotional wisdom, and a powerful mid-life Raj Yoga."
  },
  Leo: {
    psychology: "Saturn in enemy Fire sign. Confrontation between royal Solar ego and humble Saturnian servitude. Initial friction with bosses, fathers, or state institutions.",
    rajYogaPotential: "Once personal arrogance is dissolved into humble, servant-leader governance, the native earns permanent administrative authority and respected institutional rank."
  },
  Virgo: {
    psychology: "Saturn in friendly Earth. Supreme systems analyst, untiring auditor, and detailed problem solver. Naturally gravitated toward healthcare, debugging, and quality control.",
    rajYogaPotential: "Flawless attention to micro-details and selfless organizational hygiene establishes the native as an indispensable, high-value corporate or institutional fixer."
  },
  Libra: {
    psychology: "Exalted (Uchha). Peak maturity regarding balanced justice, contractual fairness, and social equity. Impartial adjudicator of human relationships.",
    rajYogaPotential: "Supreme judicial and commercial Raj Yoga; brings widespread public esteem, equitable wealth distribution, and unassailable ethical reputation."
  },
  Scorpio: {
    psychology: "Saturn in enemy Water sign. Psychological vigilance, deep occult instincts, and navigating generational crises. Early exposure to life's harsh underbelly.",
    rajYogaPotential: "Transmutes traumatic shocks into profound psychological immunity and unshakeable mastery over emergencies, investments, and subterranean sciences."
  },
  Sagittarius: {
    psychology: "Saturn in friendly Fire sign. Philosophical discipline, dharmic endurance, and teaching through personal austerity. Rejection of frivolous theological debates.",
    rajYogaPotential: "Becomes a revered elder, judge, or mentor whose guidance is rooted in battle-tested practical ethics rather than empty theoretical dogma."
  },
  Capricorn: {
    psychology: "Own sign (Swakshetra). Supreme Kurma Avatara endurance, executive stamina, and unyielding patience. Grounded realism with zero appetite for illusions.",
    rajYogaPotential: "Forms the mighty Sasa Mahapurusha Yoga; grants sovereign endurance, grassroots mass loyalty, and long-lasting historic achievements."
  },
  Aquarius: {
    psychology: "Moolatrikona. Visionary social engineering, grassroots humanitarian reform, and large-scale mass movements. Detached commitment to collective advancement.",
    rajYogaPotential: "Forms Sasa Mahapurusha Yoga of the highest Sattvic order; leads civilizational reforms, scientific breakthroughs, and large institutional transformations."
  },
  Pisces: {
    psychology: "Saturn in friendly Water sign. Spiritual surrender, solitary introspection, and profound compassion for the forgotten. Quiet release of worldly desires.",
    rajYogaPotential: "Dissolves ego boundaries without cynicism, unlocking sublime meditative realization, effortless spiritual detachment, and peaceful universal grace."
  }
};

export const SATURN_HOUSE_AGING_RULES: Record<number, {
  maturationSphere: string;
  agingEntity: string;
  shastricPrescription: string;
}> = {
  1: {
    maturationSphere: "Physical Vitality, Appearance & Personality",
    agingEntity: "The Native Themselves",
    shastricPrescription: "Native looks, acts, and carries themselves with solemn maturity from early childhood. Must balance natural gravity with lighthearted joy and daily movement."
  },
  2: {
    maturationSphere: "Speech, Diet & Family Lineage",
    agingEntity: "Vocal Tone & Elders",
    shastricPrescription: "Native speaks with the caution, gravitas, and elder vocabulary of a grandfather. Practice truthful, measured speech and avoid cold, harsh criticisms."
  },
  3: {
    maturationSphere: "Siblings, Enterprise & Early Initiatives",
    agingEntity: "Younger Siblings & Close Associates",
    shastricPrescription: "Early maturity in taking responsibility for siblings and ventures. Must guide associates patiently without imposing crushing expectations."
  },
  4: {
    maturationSphere: "Domestic Life, Mother & Internal Emotional Grounding",
    agingEntity: "The Mother (Mata)",
    shastricPrescription: "Mother shoulders heavy life burdens and ages prematurely. Native must serve the mother lovingly and create a peaceful domestic sanctuary."
  },
  5: {
    maturationSphere: "Children, Intellect & Romance",
    agingEntity: "Children (Santana)",
    shastricPrescription: "Children are serious, dutiful, and mature, though their conception or birth may experience delays. Nurture their playful side with patience."
  },
  6: {
    maturationSphere: "Enemies, Debts & Physical Health",
    agingEntity: "Maternal Uncles & Workplace Peers",
    shastricPrescription: "Approaches disputes, illnesses, and systemic work with veteran endurance. Overcomes competitors through patient wear-and-tear."
  },
  7: {
    maturationSphere: "Marriage, Spouse & Public Treaties",
    agingEntity: "The Spouse / Marital Partner",
    shastricPrescription: "Attracts an older, mature, duty-bound spouse with strong traditional values. Marital stability requires mutual patience and shared duty."
  },
  8: {
    maturationSphere: "Longevity, In-laws & Psychological Transformations",
    agingEntity: "In-Laws & Generational Lineage",
    shastricPrescription: "Chronic awareness of mortality and solemn longevity. In-laws are sober or burdened; native must manage joint assets with scrupulous honesty."
  },
  9: {
    maturationSphere: "Father, Mentors & Lineage Dharma",
    agingEntity: "The Father (Pita)",
    shastricPrescription: "Father is a strict, stern, and disciplined figure who ages early. Respect the father's moral code while maintaining personal spiritual autonomy."
  },
  10: {
    maturationSphere: "Career, Public Life & Professional Duties",
    agingEntity: "Mentors, Superiors & Professional Identity",
    shastricPrescription: "Early heavy career responsibilities with slow, grassroots ascent. Enduring public authority blossoms after age 36 through unyielding duty."
  },
  11: {
    maturationSphere: "Elder Siblings, Friendships & Ambitions",
    agingEntity: "Elder Siblings & Senior Friends",
    shastricPrescription: "Circle consists of older, experienced mentors. Gains arrive steadily and compound with time; avoid get-rich-quick schemes."
  },
  12: {
    maturationSphere: "Sleep, Solitude, Foreign Lands & Expenses",
    agingEntity: "Subconscious Self & Spiritual Recluses",
    shastricPrescription: "Native possesses solitary habits and the solemn demeanor of an old soul. Regular meditation and quiet charitable acts dissolve karmic debts."
  }
};

// ==========================================
// 3. CORE CALCULATION FUNCTIONS
// ==========================================

/**
 * 1. Evaluates the 7-Center Multi-Lagna Framework of Existence (Session 36)
 */
export function calculateMultiLagnaFramework(ephemeris: EphemerisResult): MultiLagnaProfile {
  const ascLon = ephemeris.ascendant?.siderealLongitude || 0;
  const d1AscSign = Math.floor(ascLon / 30);

  // 1. Lagna (Physical manifestation)
  const lagnaCenter: MultiLagnaCenter = {
    name: "Lagna (1st House)",
    hindiName: "लग्न (भौतिक शरीर व रूप)",
    signIndex: d1AscSign,
    signName: getSignName(d1AscSign),
    signLord: SIGN_LORDS[d1AscSign],
    houseFromLagna: 1,
    spiritualSignificance: "Physical body vessel, how one incarnates in physical reality, and outer worldly appearance.",
    operationalSphere: "Physical manifestation, vitality, and external presence."
  };

  // 2. Lagnesha (Operating demeanor)
  const lagneshaName = SIGN_LORDS[d1AscSign];
  const lagneshaPos = ephemeris.planets[lagneshaName];
  const lagneshaSign = lagneshaPos ? Math.floor(lagneshaPos.siderealLongitude / 30) : d1AscSign;
  const lagneshaHouse = ((lagneshaSign - d1AscSign + 12) % 12) + 1;
  const lagneshaCenter: MultiLagnaCenter = {
    name: "Lagnesha (Ascendant Lord)",
    hindiName: "लग्नेश (दैनिक आचरण व क्रियाशीलता)",
    signIndex: lagneshaSign,
    signName: getSignName(lagneshaSign),
    signLord: SIGN_LORDS[lagneshaSign],
    houseFromLagna: lagneshaHouse,
    spiritualSignificance: "Operating consciousness, behavioral demeanor, and how the native actively executes actions in daily life.",
    operationalSphere: "Action execution, cognitive strategy, and behavioral disposition."
  };

  // 3. Moon Lagna (Chandra)
  const moonPos = ephemeris.planets["Moon"];
  const moonSign = moonPos ? Math.floor(moonPos.siderealLongitude / 30) : 0;
  const moonHouse = ((moonSign - d1AscSign + 12) % 12) + 1;
  const moonCenter: MultiLagnaCenter = {
    name: "Moon Lagna (Chandra)",
    hindiName: "चन्द्र लग्न (मन व पूर्वजन्म संस्कार)",
    signIndex: moonSign,
    signName: getSignName(moonSign),
    signLord: SIGN_LORDS[moonSign],
    houseFromLagna: moonHouse,
    spiritualSignificance: "State of mind (Manas), emotional reservoir, and accumulated impressions of Purva Janma Karma (past life karma).",
    operationalSphere: "Emotional psychology, mental sanctuary, and intuitive reactions."
  };

  // 4. Guru Lagna (Jupiter)
  const jupPos = ephemeris.planets["Jupiter"];
  const jupSign = jupPos ? Math.floor(jupPos.siderealLongitude / 30) : 8;
  const jupHouse = ((jupSign - d1AscSign + 12) % 12) + 1;
  const jupCenter: MultiLagnaCenter = {
    name: "Guru Lagna (Jupiter)",
    hindiName: "गुरु लग्न (दैवीय प्रज्ञा व मार्गदर्शन)",
    signIndex: jupSign,
    signName: getSignName(jupSign),
    signLord: SIGN_LORDS[jupSign],
    houseFromLagna: jupHouse,
    spiritualSignificance: "Operating divine consciousness, higher wisdom, spiritual mentors, and how divine grace steers growth.",
    operationalSphere: "Moral compass, philosophical expansion, and higher guidance."
  };

  // 5. Surya Lagna (Sun)
  const sunPos = ephemeris.planets["Sun"];
  const sunSign = sunPos ? Math.floor(sunPos.siderealLongitude / 30) : 4;
  const sunHouse = ((sunSign - d1AscSign + 12) % 12) + 1;
  const sunCenter: MultiLagnaCenter = {
    name: "Surya Lagna (Sun)",
    hindiName: "सूर्य लग्न (आत्मबल व सामाजिक चेतना)",
    signIndex: sunSign,
    signName: getSignName(sunSign),
    signLord: SIGN_LORDS[sunSign],
    houseFromLagna: sunHouse,
    spiritualSignificance: "Soul alignment (Atman), conscious focus, executive vitality, and solar ambition in the material world.",
    operationalSphere: "Sovereign identity, willpower, authority, and life direction."
  };

  // 6. Saturn (Karma Karaka)
  const satPos = ephemeris.planets["Saturn"];
  const satSign = satPos ? Math.floor(satPos.siderealLongitude / 30) : 9;
  const satHouse = ((satSign - d1AscSign + 12) % 12) + 1;
  const satCenter: MultiLagnaCenter = {
    name: "Saturn (Karma Karaka)",
    hindiName: "शनि (कर्म कारक व कर्तव्य क्षेत्र)",
    signIndex: satSign,
    signName: getSignName(satSign),
    signLord: SIGN_LORDS[satSign],
    houseFromLagna: satHouse,
    spiritualSignificance: "Primary significator of career, worldly labor, unavoidable duty, and karmic endurance.",
    operationalSphere: "Professional discipline, heavy labor, systemic duty, and societal contributions."
  };

  // 7. Arudha Lagna (AL)
  const padas = calculateArudhaPadas(ephemeris);
  const alPada = padas.find(p => p.code === "AL") || padas[0];
  const alSign = alPada ? alPada.padaSignIndex : d1AscSign;
  const alHouse = alPada ? alPada.padaHouse : 1;
  const alCenter: MultiLagnaCenter = {
    name: "Arudha Lagna (AL)",
    hindiName: "आरूढ़ लग्न (संसारिक छवि व माया)",
    signIndex: alSign,
    signName: getSignName(alSign),
    signLord: SIGN_LORDS[alSign],
    houseFromLagna: alHouse,
    spiritualSignificance: "Worldly perception, societal status, image projection, and how the external world mirrors one's karma.",
    operationalSphere: "Public reputation, tangible prestige, and worldly impact."
  };

  const centers: Record<string, MultiLagnaCenter> = {
    lagna: lagnaCenter,
    lagnesha: lagneshaCenter,
    moonLagna: moonCenter,
    guruLagna: jupCenter,
    suryaLagna: sunCenter,
    saturnKarma: satCenter,
    arudhaLagna: alCenter
  };

  const synthesis = `The native operates through 7 distinct existential lenses: Physical vessel manifests in **${lagnaCenter.signName}**, while active execution is driven through **${lagneshaCenter.signName}** in House ${lagneshaCenter.houseFromLagna}. Emotional past-life karma is anchored in **${moonCenter.signName}** (House ${moonCenter.houseFromLagna}), guided by divine wisdom in **${jupCenter.signName}** (House ${jupCenter.houseFromLagna}) and solar conscious will in **${sunCenter.signName}** (House ${sunCenter.houseFromLagna}). Worldly duty and professional endurance center on **${satCenter.signName}** (House ${satCenter.houseFromLagna}), while society perceives and mirrors this reality through Arudha Lagna in **${alCenter.signName}** (House ${alCenter.houseFromLagna}).`;

  return { centers, synthesis };
}

/**
 * 2. Evaluates Guna Structural Progression & the Artha Trikona Triad (Session 36)
 */
export function evaluateGunaStructuralEvolution(ephemeris: EphemerisResult): GunaStructuralProfile {
  const ascLon = ephemeris.ascendant?.siderealLongitude || 0;
  const d1AscSign = Math.floor(ascLon / 30);

  // Group planets into 3 quadrats
  const classicalPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const rajasicPlanets: string[] = [];
  const tamasicPlanets: string[] = [];
  const sattvicPlanets: string[] = [];

  const taurusPlanets: string[] = [];
  const virgoPlanets: string[] = [];
  const capricornPlanets: string[] = [];

  const allPlanets = Object.values(ephemeris.planets);

  for (const p of allPlanets) {
    if (!classicalPlanets.includes(p.name)) continue;
    const sIdx = Math.floor(p.siderealLongitude / 30);
    if (sIdx >= 0 && sIdx <= 3) {
      rajasicPlanets.push(p.name);
    } else if (sIdx >= 4 && sIdx <= 7) {
      tamasicPlanets.push(p.name);
    } else {
      sattvicPlanets.push(p.name);
    }

    if (sIdx === 1) taurusPlanets.push(p.name); // Taurus
    if (sIdx === 5) virgoPlanets.push(p.name);  // Virgo
    if (sIdx === 9) capricornPlanets.push(p.name); // Capricorn
  }

  let dominantGunaPerspective = "Balanced Distribution";
  if (sattvicPlanets.length > rajasicPlanets.length && sattvicPlanets.length > tamasicPlanets.length) {
    dominantGunaPerspective = "Sattvic ('I to All' — Collective Duty, Dharma & Transcendent Surrender)";
  } else if (tamasicPlanets.length > rajasicPlanets.length && tamasicPlanets.length >= sattvicPlanets.length) {
    dominantGunaPerspective = "Tamasic ('I to You' — Interpersonal Dynamics, Service & Contractual Relations)";
  } else if (rajasicPlanets.length >= tamasicPlanets.length && rajasicPlanets.length >= sattvicPlanets.length) {
    dominantGunaPerspective = "Rajasic ('I to I' — Personal Identity, Self-Initiative & Individual Survival)";
  }

  const taurusHouse = ((1 - d1AscSign + 12) % 12) + 1;
  const virgoHouse = ((5 - d1AscSign + 12) % 12) + 1;
  const capricornHouse = ((9 - d1AscSign + 12) % 12) + 1;

  const arthaTrikona = {
    taurusH2: {
      signName: "Taurus (Vrishabha)",
      houseFromLagna: taurusHouse,
      guna: "Rajasic Earth (राजसिक पृथ्वी)",
      planetsPresent: taurusPlanets,
      karmicPrinciple: "Selfish material accumulation and asset preservation for personal security. Requires vigilance against hoarding, possessiveness, and financial anxiety."
    },
    virgoH6: {
      signName: "Virgo (Kanya)",
      houseFromLagna: virgoHouse,
      guna: "Tamasic Earth (तामसिक पृथ्वी)",
      planetsPresent: virgoPlanets,
      karmicPrinciple: "Practical service, healthcare, problem analysis, and debt elimination executed out of necessity and struggle. Involves overcoming friction and daily conflicts."
    },
    capricornH10: {
      signName: "Capricorn (Makara)",
      houseFromLagna: capricornHouse,
      guna: "Sattvic Earth (सात्विक पृथ्वी)",
      planetsPresent: capricornPlanets,
      karmicPrinciple: "Selfless, detached labor (Nishkama Karma) executed without demanding immediate applause or obsessive fruits. Gateway to enduring historical legacy."
    },
    synthesis: `The native's Artha Trikona aligns Taurus (Rajasic accumulation) in House ${taurusHouse}, Virgo (Tamasic analytical service) in House ${virgoHouse}, and Capricorn (Sattvic detached duty) in House ${capricornHouse}. Spiritual and worldly fruition occurs when personal accumulation (Taurus) and daily struggle (Virgo) are subordinated to selfless, detached action in Capricorn.`
  };

  return {
    rajasicQuadrat: {
      signs: ["Aries", "Taurus", "Gemini", "Cancer"],
      planetsPresent: rajasicPlanets,
      perspective: "I to I (Self-Centric)",
      philosophicalTheme: "Childlike emergence into material existence; individual survival, personal identity, and vital initiative."
    },
    tamasicQuadrat: {
      signs: ["Leo", "Virgo", "Libra", "Scorpio"],
      planetsPresent: tamasicPlanets,
      perspective: "I to You (Relational / Contractual)",
      philosophicalTheme: "Complex interpersonal dynamics, romance, service, contractual treaties, debts, and transformative crises."
    },
    sattvicQuadrat: {
      signs: ["Sagittarius", "Capricorn", "Aquarius", "Pisces"],
      planetsPresent: sattvicPlanets,
      perspective: "I to All (Universal / Collective)",
      philosophicalTheme: "Governed by Jupiter and Saturn; universal dharma, societal responsibility, selfless duty, and spiritual transcendence."
    },
    dominantGunaPerspective,
    arthaTrikona
  };
}

/**
 * 3. Evaluates the Kurma Avatara Archetype & Capricorn House Law (Session 37)
 */
export function evaluateMakaraKurmaArchetype(ephemeris: EphemerisResult): KurmaArchetypeProfile {
  const ascLon = ephemeris.ascendant?.siderealLongitude || 0;
  const d1AscSign = Math.floor(ascLon / 30);
  const capricornHouse = ((9 - d1AscSign + 12) % 12) + 1;

  const houseRule = CAPRICORN_HOUSE_DUTY_RULES[capricornHouse] || CAPRICORN_HOUSE_DUTY_RULES[10];

  // Detect planets in Capricorn (Sign index 9)
  const classicalPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const planetsInCapricorn: KurmaArchetypeProfile["planetsInCapricorn"] = [];

  const allPlanets = Object.values(ephemeris.planets);

  for (const p of allPlanets) {
    if (!classicalPlanets.includes(p.name)) continue;
    const sIdx = Math.floor(p.siderealLongitude / 30);
    if (sIdx === 9) {
      let dignity = "Neutral";
      let role = "Occupant";
      let trait = "Disciplined labor";

      if (p.name === "Mars") {
        dignity = "Exalted (Param Uchha 28°)";
        role = "Supreme Execution Commander";
        trait = "Channeling explosive energy into relentless, tireless physical labor without fatigue; the supreme practical worker.";
      } else if (p.name === "Jupiter") {
        dignity = "Debilitated (Param Neecha 5°)";
        role = "The Grounded Philosopher";
        trait = "Theoretical lecturing and comfortable sermons struggle; wisdom must be applied to physical, unglamorous ground realities to bear fruit.";
      } else if (p.name === "Saturn") {
        dignity = "Own Sign (Swakshetra / Sasa Yoga)";
        role = "The Master Tortoise (Kurma)";
        trait = "Meticulous, traditional grooming; disciplined demeanor; carrying monumental responsibilities with absolute silence.";
      } else if (p.name === "Mercury") {
        dignity = "Friendly Sign";
        role = "Strategic Administrator";
        trait = "Styles hair to appear youthful, trendy, and sharp; communicates with concise, practical intelligence.";
      } else if (p.name === "Rahu") {
        dignity = "Co-Ruler / Friendly";
        role = "The Unconventional Modernizer";
        trait = "Eccentric, unconventional, or boldly styled/colored hair; seeks massive scale and technical innovation through unconventional means.";
      } else if (p.name === "Sun") {
        dignity = "Enemy Sign (Surya-Shani tension)";
        role = "The Sober Leader";
        trait = "Ego is humbled by heavy administrative burdens; rises through methodical endurance rather than entitlement.";
      } else if (p.name === "Moon") {
        dignity = "Enemy Sign (Chandra-Shani)";
        role = "The Emotionally Stoic Mind";
        trait = "Suppresses emotional vulnerability; finds peace through disciplined routines and serving elders.";
      } else if (p.name === "Venus") {
        dignity = "Friendly Sign";
        role = "The Enduring Builder of Value";
        trait = "Elegant, structured aesthetics; loyal and practical in relationships; builds long-term tangible assets.";
      } else if (p.name === "Ketu") {
        dignity = "Detached Mystic";
        role = "The Silent Renunciate";
        trait = "Complete inward detachment from worldly rank; effortless ability to work without attachment to outcomes.";
      }

      planetsInCapricorn.push({
        planet: p.name,
        dignity,
        archetypeRole: role,
        hairOrWorkExpression: trait
      });
    }
  }

  const groomingIndicators = {
    hairHygieneRule: "Saturn rules head and bodily hair. Disheveled, unkempt, or neglected hair directly damages Capricorn and Saturnian energy. Maintain clean, combed, and well-groomed hair.",
    footwearHygieneRule: "Capricorn governs shoes, footwear, and the foundation upon which one walks. Leaving shoes strewn haphazardly at entryways invites financial disorder and weakens Saturn; store footwear neatly in enclosed racks."
  };

  return {
    capricornHouse,
    capricornSignName: "Capricorn (Makara)",
    rulingLord: "Saturn (Shani)",
    mythologicalArchetype: "Sri Kurma Avatara (The Cosmic Tortoise at the base of Mount Mandara during Samudra Manthan)",
    samudraManthanDuty: "During the cosmic churning, Mount Mandara began sinking into the ocean bed. Lord Vishnu assumed the Kurma Avatara, dove to the bottom, and bore the immense, grinding weight of the spinning mountain upon his shell. His back was crushed, bruised, and bloody, yet when gems and nectar emerged, the Gods and Demons took their shares and completely forgot the tortoise bearing the load.",
    housePrescription: `In your horoscope, Capricorn occupies House ${capricornHouse} (${houseRule.domain}). ${houseRule.selflessLaborGuidance}`,
    chirasthayiYashGuidance: houseRule.chirasthayiYashOutcome,
    planetsInCapricorn,
    groomingIndicators
  };
}

/**
 * 4. Evaluates Saturn's Comprehensive 5-Fold Reach & Shadow Mechanics (Session 37)
 */
export function evaluateSaturnComprehensiveReach(ephemeris: EphemerisResult): Saturn5FoldReach {
  const ascLon = ephemeris.ascendant?.siderealLongitude || 0;
  const d1AscSign = Math.floor(ascLon / 30);

  const satPos = ephemeris.planets["Saturn"];
  const satLon = satPos?.siderealLongitude || 270;
  const satSignIdx = Math.floor(satLon / 30);
  const occupiedHouse = ((satSignIdx - d1AscSign + 12) % 12) + 1;

  // 1. Heen Bhavna Domain
  const maturationRule = SATURN_HOUSE_AGING_RULES[occupiedHouse] || SATURN_HOUSE_AGING_RULES[1];
  const heenBhavnaDomain = `House ${occupiedHouse} (${maturationRule.maturationSphere}): In this house, Saturn initially generates a subtle inferiority complex (Heen Bhavna), feeling inadequate, burdened, or melancholic until mastered through discipline and humble persistence.`;

  // 2. Chhaya (Shadow) Flanking Effect: 1 house behind (12th from Saturn) & 1 house ahead (2nd from Saturn)
  const behindSignIdx = (satSignIdx + 11) % 12;
  const behindHouse = ((behindSignIdx - d1AscSign + 12) % 12) + 1;
  const chhayaFlankingBehind = {
    house: behindHouse,
    signName: getSignName(behindSignIdx),
    mechanism: "12th from Saturn (Past Shadow): Casts a heavy gravitational shadow of expenditure, subconscious hesitation, and past obligations."
  };

  const aheadSignIdx = (satSignIdx + 1) % 12;
  const aheadHouse = ((aheadSignIdx - d1AscSign + 12) % 12) + 1;
  const chhayaFlankingAhead = {
    house: aheadHouse,
    signName: getSignName(aheadSignIdx),
    mechanism: "2nd from Saturn (Future Projection): Projects a shadow of cautious preservation, sober speech, and disciplined resource allocation."
  };

  // 3. 4th House Karmic Fruition: 4 houses forward from Saturn
  const fourthSignIdx = (satSignIdx + 3) % 12;
  const fourthHouse = ((fourthSignIdx - d1AscSign + 12) % 12) + 1;
  const fourthHouseFruition = {
    house: fourthHouse,
    signName: getSignName(fourthSignIdx),
    fruitionPrinciple: "4th House from Saturn: Concentrates and fortifies tangible karmic results, grounding physical security and long-term asset fruition after initial tests."
  };

  // 4. Special Aspects (Drishti): 3rd, 7th, 10th
  const drishti3Sign = (satSignIdx + 2) % 12;
  const drishti3House = ((drishti3Sign - d1AscSign + 12) % 12) + 1;

  const drishti7Sign = (satSignIdx + 6) % 12;
  const drishti7House = ((drishti7Sign - d1AscSign + 12) % 12) + 1;

  const drishti10Sign = (satSignIdx + 9) % 12;
  const drishti10House = ((drishti10Sign - d1AscSign + 12) % 12) + 1;

  const specialDrishtis = [
    {
      aspectLabel: "3rd Aspect (Tritiya Drishti)",
      targetHouse: drishti3House,
      targetSignName: getSignName(drishti3Sign),
      karmicImpact: "Demands intense personal courage, relentless effort, and technical persistence; introduces friction in enterprise."
    },
    {
      aspectLabel: "7th Aspect (Saptama Drishti)",
      targetHouse: drishti7House,
      targetSignName: getSignName(drishti7Sign),
      karmicImpact: "Direct cosmic gaze enforcing mutual accountability, seriousness in partnerships, and transparent public conduct."
    },
    {
      aspectLabel: "10th Aspect (Dashama Drishti)",
      targetHouse: drishti10House,
      targetSignName: getSignName(drishti10Sign),
      karmicImpact: "Imposes heavy executive duty, high performance standards, and scrutiny in public reputation or workplace status."
    }
  ];

  // 5. 5th House Limping Trigger (Manda Effect): 5 houses forward
  const manda5Sign = (satSignIdx + 4) % 12;
  const manda5House = ((manda5Sign - d1AscSign + 12) % 12) + 1;
  const manda5thHurdle = {
    house: manda5House,
    signName: getSignName(manda5Sign),
    limperMechanism: "5th House from Saturn (Manda / Limping Trigger): Saturn acts as 'Manda' (the slow limper), introducing developmental hurdles, delays, or tests of faith in creative intelligence and speculative decisions."
  };

  // Collect all unique influenced houses
  const influencedSet = new Set<number>([
    occupiedHouse,
    behindHouse,
    aheadHouse,
    fourthHouse,
    drishti3House,
    drishti7House,
    drishti10House,
    manda5House
  ]);
  const allInfluencedHouses = Array.from(influencedSet).sort((a, b) => a - b);

  const fearAsTeacherSynthesis = `Saturn's 5-fold reach encompasses ${allInfluencedHouses.length} of the 12 houses (Houses ${allInfluencedHouses.join(", ")}). Being the furthest classical planet, Saturn possesses an unobstructed, panoramic view of all cosmic karma (Nyayadhikari). In each influenced house, Saturn uses fear and gravity not to punish, but as a supreme catalyst for maturity. Facing these fears through ethical duty converts fragility into unbreakable resilience.`;

  return {
    occupiedHouse,
    occupiedSignIndex: satSignIdx,
    occupiedSignName: getSignName(satSignIdx),
    heenBhavnaDomain,
    chhayaFlankingBehind,
    chhayaFlankingAhead,
    fourthHouseFruition,
    specialDrishtis,
    manda5thHurdle,
    allInfluencedHouses,
    fearAsTeacherSynthesis
  };
}

/**
 * 5. Evaluates Saturn Across the 12 Signs & House Maturation / Aging (Session 38)
 */
export function evaluateSaturnMaturationAndSign(ephemeris: EphemerisResult): SaturnMaturationProfile {
  const ascLon = ephemeris.ascendant?.siderealLongitude || 0;
  const d1AscSign = Math.floor(ascLon / 30);

  const satPos = ephemeris.planets["Saturn"];
  const satLon = satPos?.siderealLongitude || 270;
  const satSignIdx = Math.floor(satLon / 30);
  const satSignName = getSignName(satSignIdx);
  const occupiedHouse = ((satSignIdx - d1AscSign + 12) % 12) + 1;

  const signProfile = SATURN_SIGN_PSYCHOLOGY[satSignName] || SATURN_SIGN_PSYCHOLOGY["Capricorn"];
  const houseAging = SATURN_HOUSE_AGING_RULES[occupiedHouse] || SATURN_HOUSE_AGING_RULES[1];

  return {
    saturnSign: satSignName,
    saturnSignLord: SIGN_LORDS[satSignIdx],
    signPsychologicalTheme: signProfile.psychology,
    rajYogaPotential: signProfile.rajYogaPotential,
    houseAgingImpact: {
      occupiedHouse,
      maturationSphere: houseAging.maturationSphere,
      agingEntity: houseAging.agingEntity,
      shastricPrescription: houseAging.shastricPrescription
    }
  };
}

/**
 * 6. Evaluates Male vs Female Zodiac Signs (Purusha vs Stri Rashis) (Session 38)
 */
export function evaluatePurushaStriPolarity(ephemeris: EphemerisResult): PurushaStriPolarity {
  const classicalPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const purushaPlanets: string[] = [];
  const striPlanets: string[] = [];

  const allPlanets = Object.values(ephemeris.planets);

  for (const p of allPlanets) {
    if (!classicalPlanets.includes(p.name)) continue;
    const sIdx = Math.floor(p.siderealLongitude / 30);
    // Odd signs (0-indexed: 0, 2, 4, 6, 8, 10 are signs 1, 3, 5, 7, 9, 11) -> Purusha (Fire & Air)
    if (sIdx % 2 === 0) {
      purushaPlanets.push(p.name);
    } else {
      // Even signs (0-indexed: 1, 3, 5, 7, 9, 11 are signs 2, 4, 6, 8, 10, 12) -> Stri (Earth & Water)
      striPlanets.push(p.name);
    }
  }

  let dominantPolarity: PurushaStriPolarity["dominantPolarity"] = "Balanced Equilibrium";
  let energeticGuidance = "";

  if (purushaPlanets.length > striPlanets.length + 1) {
    dominantPolarity = "Purusha (Active / Extroverted / Initiative)";
    energeticGuidance = `Dominance of Odd signs (${purushaPlanets.length} planets in Fire & Air: ${purushaPlanets.join(", ")}). The native possesses an assertive, outward-projecting, dynamic temperament with high initiative. Must consciously cultivate receptive listening, emotional grounding, and patience.`;
  } else if (striPlanets.length > purushaPlanets.length + 1) {
    dominantPolarity = "Stri (Receptive / Introverted / Preservation)";
    energeticGuidance = `Dominance of Even signs (${striPlanets.length} planets in Earth & Water: ${striPlanets.join(", ")}). The native possesses deep emotional receptivity, preservative instinct, patience, and internal processing. Must guard against passive inertia and consciously take bold outward initiatives.`;
  } else {
    dominantPolarity = "Balanced Equilibrium";
    energeticGuidance = `Harmonious balance between Purusha initiative (${purushaPlanets.length} planets) and Stri receptivity (${striPlanets.length} planets). The native is equipped to initiate bold ventures when needed while preserving resources and emotional harmony through patient diplomacy.`;
  }

  return {
    purushaCount: purushaPlanets.length,
    purushaPlanets,
    striCount: striPlanets.length,
    striPlanets,
    dominantPolarity,
    energeticGuidance
  };
}

/**
 * 7. Evaluates King Parikshit's Kali Yuga Dialogue & Simple Redemption (Session 38)
 */
export function evaluateKaliYugaRedemption(): KaliYugaRedemptionProfile {
  return {
    shrimadBhagavataContext: "In the Shrimad Bhagavata Mahapurana, King Parikshit observed the dark symptoms of Kali Yuga: sacred cows treated like goats, brothels accumulating ostentatious wealth, true saints living in impoverished obscurity, false teachers masquerading as enlightened gurus, and demonic souls claiming divinity.",
    singularRedemptionPrinciple: "When Parikshit hesitated to let such a degraded age begin, the Rishis revealed Kali Yuga's redeeming grace: while Satya Yuga required millennia of grueling penance, Treta required complex Vedic sacrifices, and Dvapara required elaborate temple deity worship, in Kali Yuga, merely chanting the Holy Name of God with an earnest heart while performing one's daily duties selflessly burns away accumulated karmas instantly.",
    dailyChantingShield: "Chanting the Divine Name (Nama Sankirtana: 'Ram' or 'Om Namah Shivaya') combined with selfless Nishkama Karma acts as an impenetrable spiritual shield against Kali Yuga's psychological toxins.",
    respiratoryRemedyAnatomy: {
      outerNostrilsRuler: "Mars (Mangal) — Governs the physical nostrils, nasal passage architecture, and defense against pathogens.",
      pranaVayuInboundRuler: "Jupiter (Guru) — Governs inbound life prana (Prana Vayu), cellular wisdom, and oxygen absorption.",
      apanaVayuOutboundRuler: "Saturn (Shani) — Governs outbound cleansing breath (Apana Vayu), elimination of metabolic toxins, and mustard oil.",
      substanceRuler: "Pure Mustard Oil (Sarson ka Tel) — Sacred warming substance ruled by Saturn.",
      sanjeevaniDosageRuler: "Number 6 (Venus / Shukra) — The vibration of cellular rejuvenation and Sanjeevani Vidya.",
      protocol: "Administering 6 drops of warm pure mustard oil into each nostril daily creates an impenetrable biological shield across the respiratory tract, bolstering immunity against environmental and microbial illnesses."
    },
    ethicalAstrologyGuardrail: "Astrology is a sacred tool for personal life-correction and ethical calibration, never for casual predictions, ego-tripping, or fear-mongering (e.g. branding someone as irreparably damaged or Manglik). Reckless, prideful predictions bring severe karmic backlash onto an astrologer's own household, health, or lineage in later life."
  };
}

/**
 * 8. Master Synthesis Report Generator
 */
export function generateMakaraKurmaMasterReport(
  ephemeris: EphemerisResult,
  birthDate?: string
): MakaraKurmaMasterReport {
  const multiLagna = calculateMultiLagnaFramework(ephemeris);
  const gunaStructural = evaluateGunaStructuralEvolution(ephemeris);
  const kurmaArchetype = evaluateMakaraKurmaArchetype(ephemeris);
  const saturnReach = evaluateSaturnComprehensiveReach(ephemeris);
  const saturnMaturation = evaluateSaturnMaturationAndSign(ephemeris);
  const purushaStri = evaluatePurushaStriPolarity(ephemeris);
  const kaliYugaRedemption = evaluateKaliYugaRedemption();

  const masterExecutiveSummary = `Makara Rashi (Capricorn) is the cosmic sanctuary of the Kurma Avatara, seated in House ${kurmaArchetype.capricornHouse} of this chart. Just as Lord Vishnu bore the grinding weight of Mount Mandara during the Samudra Manthan without seeking gratitude, the native must execute quiet, selfless duty in House ${kurmaArchetype.capricornHouse} to unlock Chirasthayi Yash (enduring historical fame). Saturn casts a comprehensive 5-fold net over ${saturnReach.allInfluencedHouses.length} houses (${saturnReach.allInfluencedHouses.join(", ")}), transforming initial inadequacy (Heen Bhavna in House ${saturnReach.occupiedHouse}) into unshakeable maturity. The 7-Center Multi-Lagna audit reveals that physical identity in ${multiLagna.centers.lagna.signName} is supported by emotional past-life impressions in ${multiLagna.centers.moonLagna.signName} and worldly duty in ${multiLagna.centers.saturnKarma.signName}. In this Kali Yuga, sovereign protection is attained through the daily 6-drop mustard oil respiratory shield, neat footwear/hair hygiene, and combining honest daily labor with Nama Sankirtana ('Ram' / 'Om Namah Shivaya').`;

  return {
    multiLagna,
    gunaStructural,
    kurmaArchetype,
    saturnReach,
    saturnMaturation,
    purushaStri,
    kaliYugaRedemption,
    masterExecutiveSummary
  };
}
