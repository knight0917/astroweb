/**
 * Classical Rashi Tulya Navamsha (RTN) & Navamsha Tulya Rashi (NTR) Engine
 * References:
 * - Deva Keralam (Chandra Kala Nadi - देव केरलम् / चन्द्र कला नाड़ी)
 * - Brihat Parashara Hora Shastra (BPHS - Adhyaya on Navamsha Phala)
 * - C.S. Patel: "Navamsha in Astrology" & "Nadi Astrology"
 * - Deepanshu Giri (Lunar Astro: "Navamsha Secrets: Rashi Tulya Navamsha & Navamsha Age Activation System")
 *   * Core Law: Confirmation of D1 in D9 (Seed/Fruit principle: events in D1 must be mirrored in D9 to materialize)
 *   * Technique 1: RTN Dusthana Afflictions (Planets in 6th, 8th, 12th of RTN; Solvable 6th vs Chronic 8th vs Loss 12th)
 *   * Technique 2: Navamsha Age Activation Timing System (Strictly formulated for D9; Sun house activation ages: H1: 27, H2: 25, H4: 26, H6: 23/35, H8: 22/34, H12: 12/36)
 */

import { EphemerisResult, RashiInfo } from "./types";
import { RASHI_NAMES } from "./constants";
import {
  calculateD1D9RootFruitProjections,
  RootFruitProjectionResult,
} from "./rootFruitProjection";

export interface PlanetRtnDetail {
  planetId: string;
  planetName: string;
  d1Longitude: number;
  d1Rashi: RashiInfo;
  d1HouseFromLagna: number;
  d9Rashi: RashiInfo;
  d9HouseFromD9Lagna: number;
  rtnHouseFromD1Lagna: number; // D9 sign projected onto D1 Lagna
  ntrHouseFromD9Lagna: number; // D1 sign projected onto D9 Lagna
  isVargottama: boolean;
  rtnHouseSignificance: string;
}

export interface RtnConjunction {
  houseNumber: number;
  rashi: RashiInfo;
  planets: string[];
  type: "RTN Conjunction (Hidden Soul Synergy)" | "RTN Opposition (Polarity Balance)";
  interpretation: string;
}

export interface KharaNavamshaInfo {
  moon64thNavamshaRashi: RashiInfo;
  moon64thRtnHouse: number;
  lagna64thNavamshaRashi: RashiInfo;
  lagna64thRtnHouse: number;
  isTransitSaturnOn64th: boolean;
  isTransitRahuOn64th: boolean;
  isTransitMarsOn64th: boolean;
  kharaWarningSummary: string;
}

export interface RtnTransitActivation {
  triggerType: "Career Zenith (10th/AmK RTN)" | "Marriage Milestone (7th/Venus RTN)" | "Soul Awakening (Lagna/AK RTN)" | "Wealth Inflow (2nd/11th RTN)";
  targetPlanet: string;
  rtnRashiName: string;
  rtnHouseNumber: number;
  transitingPlanet: string;
  isCurrentlyActive: boolean;
  eventForecast: string;
}

export interface RtnDusthanaAffliction {
  planet: string;
  rtnHouse: 6 | 8 | 12;
  rtnRashi: RashiInfo;
  natureOfSuffering: string;
  solvabilityStatus: "Solvable through effort (6th House)" | "Chronic / Unsolvable Shocks (8th House)" | "Permanent Financial Waste / Losses (12th House)";
  mitigationOrKarmicAction: string;
  isConfirmedInD1: boolean;
  d1ConfirmationNotes: string;
}

export interface NavamshaSunAgeActivation {
  d9House: number;
  d9Rashi: RashiInfo;
  activationAges: number[];
  isActiveNow: boolean;
  isUpcoming: boolean;
  closestAge: number;
  activationTheme: string;
  caseStudyLoanHealthWarning?: string;
  strictD9RuleNote: string;
}

export interface LunarAstroNavamshaCaseMatch {
  isMatched: boolean;
  matchedCaseTitle: string | null;
  d1AscendantSign: string;
  rtnKeyPlacements: string;
  manifestationDescription: string;
}

export interface RashiTulyaNavamshaResult {
  d1LagnaRashi: RashiInfo;
  d9LagnaRashi: RashiInfo;
  planets: Record<string, PlanetRtnDetail>;
  rtnConjunctions: RtnConjunction[];
  kharaNavamsha: KharaNavamshaInfo;
  activeTransitActivations: RtnTransitActivation[];
  dusthanaAfflictions: RtnDusthanaAffliction[];
  d9SunActivation: NavamshaSunAgeActivation;
  caseStudyMatch: LunarAstroNavamshaCaseMatch;
  rootFruitProjections: RootFruitProjectionResult;
  karmicSynthesis: string;
}

const NAVAMSHA_SPAN = 360 / 108; // 3.3333333333°

export function getD9RashiIndex(longitude: number): number {
  const norm = ((longitude % 360) + 360) % 360;
  return Math.floor(norm / NAVAMSHA_SPAN) % 12;
}

// ==========================================
// 1. RTN DUSTHANA SUFFERING ENGINE (DEEPANSHU GIRI)
// ==========================================

const DUSTHANA_PLANET_KARAKATWA: Record<string, {
  h6: { suffering: string; mitigation: string };
  h8: { suffering: string; mitigation: string };
  h12: { suffering: string; mitigation: string };
}> = {
  Venus: {
    h6: {
      suffering: "Spouse becomes adversarial or litigious; legal disputes in marriage; hormonal and reproductive system vulnerabilities.",
      mitigation: "Solvable through patient mediation, refraining from courtroom escalation, and honoring Goddess Mahalakshmi.",
    },
    h8: {
      suffering: "DEEPANSHU GIRI RULE: Chronic, unsolvable marital friction; spouse from a radically foreign/distinct culture or background; permanent estrangement and non-acceptance from natal family.",
      mitigation: "Accept the unconventional nature of the marriage; cultivate spiritual detachment from parental validation.",
    },
    h12: {
      suffering: "Major financial losses, waste of capital through spouse/partner, heavy expenditures on luxury escapism or matrimonial settlements.",
      mitigation: "Maintain separate asset accounting; channel funds into charitable donations of silk/camphor on Fridays.",
    },
  },
  Jupiter: {
    h6: {
      suffering: "Complications concerning children (Santana); progeny turning antagonistic or requiring heavy debt/medical intervention; ideological friction with teachers.",
      mitigation: "Solvable through consistent guidance, avoiding dogmatic expectations with children, and Brihaspati Stotra recitation.",
    },
    h8: {
      suffering: "Chronic lack of life fulfillment; sudden shocks in lineage or spiritual pursuits; existential disillusionment and hidden guru debts.",
      mitigation: "Engage in selfless spiritual teaching; chant Shiva Sahasranama; support orphans or educational ashrams.",
    },
    h12: {
      suffering: "Heavy expenditures on higher education or overseas settlements for children; financial depletion through speculative guru donations.",
      mitigation: "Direct wealth into genuine scriptural preservation and feeding students.",
    },
  },
  Mars: {
    h6: {
      suffering: "Misplaced or uncontrolled courage fighting unnecessary battles; bitter land and real-estate litigations; friction with associates.",
      mitigation: "Solvable through legal restraint, avoiding petty ego arguments, and chanting Hanuman Chalisa.",
    },
    h8: {
      suffering: "Sudden property shocks; chronic accidents or surgeries; severe distress and health afflictions to younger brothers.",
      mitigation: "Strict vehicular safety; regular voluntary blood donation; donating red lentils to manual laborers.",
    },
    h12: {
      suffering: "Financial losses in property development; wealth drain through impulsive aggression or penal fines overseas.",
      mitigation: "Avoid speculative real-estate flips; channel physical energy into rigorous martial discipline.",
    },
  },
  Mercury: {
    h6: {
      suffering: "Afflictions during childhood; nervous system sensitivities; speech defects; communication and educational hurdles in early years.",
      mitigation: "Solvable through speech therapy, pranayama, Tulsi watering, and green grass feeding to cows.",
    },
    h8: {
      suffering: "Chronic respiratory or cognitive anxiety; sudden breach of business contracts; deceptive financial fraud by commercial partners.",
      mitigation: "Document all agreements with strict legal audits; practice weekly periods of silence (Mouna).",
    },
    h12: {
      suffering: "Waste of money through ill-conceived commercial ventures, technical blunders, and speculative intellectual distractions.",
      mitigation: "Avoid high-frequency trading; invest solely in well-audited institutional instruments.",
    },
  },
  Sun: {
    h6: {
      suffering: "Litigation or tax penalties from government authorities; severe friction and ego clashes with bosses/superiors; father facing health/legal battles.",
      mitigation: "Solvable through bureaucratic compliance, avoiding insubordination, and daily Surya Arghya in copper vessel.",
    },
    h8: {
      suffering: "Loss of honor and reputation; sudden identity shocks; father suffering chronic illness; massive debt taken for bodily health treatments.",
      mitigation: "Gayatri Mantra Japa at Brahma Muhurta (4:30 AM); cultivate humility and shed sovereign arrogance.",
    },
    h12: {
      suffering: "Isolation from paternal support; loss of state recognition; financial drain through institutional penalties overseas.",
      mitigation: "Serve elderly fathers or veterans; offer red flowers to Surya Devata at dawn.",
    },
  },
  Moon: {
    h6: {
      suffering: "Emotional volatility; psychosomatic digestive and sleep disorders; maternal health struggles and disputes with maternal relatives.",
      mitigation: "Solvable through mindfulness, avoiding cold dairy at night, and serving mother figures.",
    },
    h8: {
      suffering: "Severe distress to mental peace; deep subconscious trauma; sudden shocks to maternal longevity; chronic depressive states.",
      mitigation: "Regular Shiva Abhishek on Mondays with raw milk and water; spiritual meditation near natural waters.",
    },
    h12: {
      suffering: "Waste of money on emotional escapism; foreign isolation; extreme psychological detachment and nocturnal restlessness.",
      mitigation: "Donate silver, camphor, or milk to orphanages; practice evening Trataka meditation.",
    },
  },
  Saturn: {
    h6: {
      suffering: "Long-lasting, chronic, or incurable diseases; protracted disputes with subordinates or service workers requiring enduring discipline.",
      mitigation: "Solvable through relentless lifestyle discipline, avoiding sedentary habits, and regular service to disabled individuals.",
    },
    h8: {
      suffering: "Constant career obstructions despite high longevity; delayed institutional rewards; agonizing structural hurdles in vocational ascension.",
      mitigation: "Mustard oil deepam near Peepal tree on Saturdays; Mahamrityunjaya Japa; cultivate endurance without bitterness.",
    },
    h12: {
      suffering: "Heavy financial losses through domestic workers, laborers, or fraudulent employees; persistent institutional delays.",
      mitigation: "Pay fair wages promptly; avoid under-the-table cash transactions with subordinates.",
    },
  },
  Rahu: {
    h6: {
      suffering: "Phobias, insidious workplace rivalries, unconventional legal battles, sudden allergic or toxic reactions.",
      mitigation: "Solvable through clean dietary boundaries, avoiding shady partnerships, and worshipping Goddess Durga.",
    },
    h8: {
      suffering: "Sudden bizarre life shocks; occult distress; when conjunct Venus, forces marriage to an outsider/foreigner causing lifelong family rift.",
      mitigation: "Strict ethical living; avoiding speculative traps; feeding black dogs or stray animals on Saturdays.",
    },
    h12: {
      suffering: "Wasteful expenditures on illusions, digital addictions, or foreign traps; insomnia and phantom debts.",
      mitigation: "Donate black sesame seeds or blankets; keep electronic screens away from sleeping areas.",
    },
  },
  Ketu: {
    h6: {
      suffering: "Mysterious ailments difficult for clinical doctors to diagnose; sudden severance of connections with workplace rivals.",
      mitigation: "Solvable through Ayurvedic detox, spiritual sadhana, and Ganesha Atharvashirsha recitation.",
    },
    h8: {
      suffering: "Sudden surgeries, occult wounds, psychological alienation, severe detachment from societal achievements.",
      mitigation: "Offer Durva grass to Lord Ganesha; feed seven grains (Satnaja) to birds on Tuesdays.",
    },
    h12: {
      suffering: "Compulsory spiritual renunciation; loss of worldly ambition; unexpected expenses on spiritual pilgrimages or isolation retreats.",
      mitigation: "Embrace voluntary meditation retreats; channel detachment into higher metaphysical research.",
    },
  },
};

/**
 * Cross-confirms RTN Dusthana afflictions with D1 placements
 * Law: Whatever is seen in D1 must be confirmed in D9 to materialize.
 */
export function crossConfirmD1InD9(
  pName: string,
  rtnHouse: 6 | 8 | 12,
  natalEphem: EphemerisResult
): { isConfirmed: boolean; notes: string } {
  const d1Planet = natalEphem.planets[pName];
  if (!d1Planet) return { isConfirmed: false, notes: "No D1 position found." };

  const d1House = d1Planet.house;
  const d1AscIdx = Math.floor(natalEphem.ascendant.siderealLongitude / 30);

  // Venus (Marriage Karaka): check D1 7th house, 7th lord, 6th/8th/12th lords, or UL
  if (pName === "Venus") {
    const seventhRIdx = (d1AscIdx + 6) % 12;
    const seventhLordName = RASHI_NAMES[seventhRIdx].lord;
    const seventhLord = natalEphem.planets[seventhLordName];
    const is7thLordInDusthana = seventhLord && [6, 8, 12].includes(seventhLord.house);
    const isVenusInDusthanaD1 = [6, 8, 12].includes(d1House);

    if (is7thLordInDusthana || isVenusInDusthanaD1) {
      return {
        isConfirmed: true,
        notes: `CONFIRMED IN D1: D-1 7th Lord (${seventhLordName}) or Venus is also placed in Dusthana (H${seventhLord?.house || d1House}), validating the D9 affliction. Per Deepanshu Giri, this ensures full physical materialization.`,
      };
    }
  }

  // Saturn (Career & Chronic Disease Karaka): check D1 10th lord or 6th/8th house
  if (pName === "Saturn") {
    const tenthRIdx = (d1AscIdx + 9) % 12;
    const tenthLordName = RASHI_NAMES[tenthRIdx].lord;
    const tenthLord = natalEphem.planets[tenthLordName];
    const is10thLordInDusthana = tenthLord && [6, 8, 12].includes(tenthLord.house);
    const isSaturnInDusthanaD1 = [6, 8, 12].includes(d1House);

    if (is10thLordInDusthana || isSaturnInDusthanaD1) {
      return {
        isConfirmed: true,
        notes: `CONFIRMED IN D1: D-1 10th Lord (${tenthLordName}) or Saturn is in Dusthana (H${tenthLord?.house || d1House}), affirming prolonged professional friction and health endurance tests.`,
      };
    }
  }

  // Jupiter (Progeny Karaka): check D1 5th lord or 5th house
  if (pName === "Jupiter") {
    const fifthRIdx = (d1AscIdx + 4) % 12;
    const fifthLordName = RASHI_NAMES[fifthRIdx].lord;
    const fifthLord = natalEphem.planets[fifthLordName];
    const is5thLordInDusthana = fifthLord && [6, 8, 12].includes(fifthLord.house);
    const isJupiterInDusthanaD1 = [6, 8, 12].includes(d1House);

    if (is5thLordInDusthana || isJupiterInDusthanaD1) {
      return {
        isConfirmed: true,
        notes: `CONFIRMED IN D1: D-1 5th Lord (${fifthLordName}) or Jupiter is in Dusthana (H${fifthLord?.house || d1House}), confirming complications with children or higher education.`,
      };
    }
  }

  // Mars (Sibling & Property): check D1 3rd/4th lord
  if (pName === "Mars") {
    const thirdRIdx = (d1AscIdx + 2) % 12;
    const thirdLordName = RASHI_NAMES[thirdRIdx].lord;
    const thirdLord = natalEphem.planets[thirdLordName];
    if (thirdLord && [6, 8, 12].includes(thirdLord.house)) {
      return {
        isConfirmed: true,
        notes: `CONFIRMED IN D1: D-1 3rd Lord (${thirdLordName}) in Dusthana H${thirdLord.house}, confirming sibling friction or unnecessary battles.`,
      };
    }
  }

  // Default: check if planet itself is in dusthana in D1
  if ([6, 8, 12].includes(d1House)) {
    return {
      isConfirmed: true,
      notes: `CONFIRMED IN D1: ${pName} occupies House ${d1House} in D1, creating direct cross-varga confirmation in D9. Full materialization indicated.`,
    };
  }

  return {
    isConfirmed: false,
    notes: `PARTIAL / SEED STATE: ${pName} occupies House ${d1House} in D-1 (not in a Dusthana). Without D-1 confirmation, the affliction remains an internal seed or psychological test rather than an irreversible physical catastrophe.`,
  };
}

export function evaluateRtnDusthanaAfflictions(
  natalEphem: EphemerisResult,
  d1LagnaRashiIdx: number,
  planets: Record<string, PlanetRtnDetail>
): RtnDusthanaAffliction[] {
  const afflictions: RtnDusthanaAffliction[] = [];

  for (const [pName, pDetail] of Object.entries(planets)) {
    const rtnH = pDetail.rtnHouseFromD1Lagna;
    if (rtnH === 6 || rtnH === 8 || rtnH === 12) {
      const pRules = DUSTHANA_PLANET_KARAKATWA[pName];
      const hKey = rtnH === 6 ? "h6" : rtnH === 8 ? "h8" : "h12";
      const sufferingData = pRules ? pRules[hKey] : {
        suffering: `General affliction to ${pName}'s natural significations.`,
        mitigation: "Perform planetary mantra and charity.",
      };

      const solvabilityStatus =
        rtnH === 6
          ? "Solvable through effort (6th House)"
          : rtnH === 8
          ? "Chronic / Unsolvable Shocks (8th House)"
          : "Permanent Financial Waste / Losses (12th House)";

      const d1Conf = crossConfirmD1InD9(pName, rtnH, natalEphem);

      afflictions.push({
        planet: pName,
        rtnHouse: rtnH,
        rtnRashi: pDetail.d9Rashi,
        natureOfSuffering: sufferingData.suffering,
        solvabilityStatus,
        mitigationOrKarmicAction: sufferingData.mitigation,
        isConfirmedInD1: d1Conf.isConfirmed,
        d1ConfirmationNotes: d1Conf.notes,
      });
    }
  }

  return afflictions;
}

// ==========================================
// 2. NAVAMSHA SUN AGE ACTIVATION TIMING SYSTEM
// ==========================================

export const NAVAMSHA_SUN_ACTIVATION_MAP: Record<number, {
  ages: number[];
  theme: string;
}> = {
  1: {
    ages: [27],
    theme: "Sun in D9 1st House activates at Age 27: Major breakthrough in personal authority, independent identity, and professional sovereignty.",
  },
  2: {
    ages: [25],
    theme: "Sun in D9 2nd House activates at Age 25: Significant family asset restructuring, financial stabilization, and vocal authority emergence.",
  },
  4: {
    ages: [26],
    theme: "Sun in D9 4th House activates at Age 26: Real-estate milestones, domestic authority consolidation, vehicular acquisition, and maternal focus.",
  },
  6: {
    ages: [23, 35],
    theme: "Sun in D9 6th House activates at Ages 23 & 35: Confronting professional competitors, resolving debts, legal/bureaucratic scrutiny, and clinical care.",
  },
  8: {
    ages: [22, 34],
    theme: "Sun in D9 8th House activates at Ages 22 & 34: LECTURE CASE STUDY: Severe financial drain, taking loans for medical treatments of bodily illness, sudden transformative shocks, and radical ego dissolution.",
  },
  12: {
    ages: [12, 36],
    theme: "Sun in D9 12th House activates at Ages 12 & 36: LECTURE RULE (Non-Linear): Does not follow standard 12-yr addition. Triggers foreign expenditure, deep isolation, hospitalization, or complete spiritual detachment.",
  },
};

export function calculateNavamshaAgeActivation(
  natalOrD9House: EphemerisResult | number,
  targetAge: number = 30
): NavamshaSunAgeActivation {
  let sunD9House = 1;
  let sunD9RashiIdx = 0;

  if (typeof natalOrD9House === "number") {
    sunD9House = Math.max(1, Math.min(12, Math.floor(natalOrD9House)));
    sunD9RashiIdx = (sunD9House - 1) % 12;
  } else {
    const sun = natalOrD9House.planets["Sun"];
    const ascLon = natalOrD9House.ascendant.siderealLongitude;
    const d9LagnaRashiIdx = getD9RashiIndex(ascLon);

    if (sun) {
      sunD9RashiIdx = getD9RashiIndex(sun.siderealLongitude);
      sunD9House = ((sunD9RashiIdx - d9LagnaRashiIdx + 12) % 12) + 1;
    }
  }

  const sunD9Rashi: RashiInfo = {
    ...RASHI_NAMES[sunD9RashiIdx],
    degreesInSign: 0,
  };

  const rule = NAVAMSHA_SUN_ACTIVATION_MAP[sunD9House] || {
    ages: [22, 34],
    theme: `Sun in D9 House ${sunD9House}: General solar activation window unlocking vocational confidence.`,
  };

  const activationAges = rule.ages;
  const isActiveNow = activationAges.includes(targetAge) || activationAges.includes(targetAge + 1);
  const isUpcoming = activationAges.some((a) => a > targetAge);

  // Find closest age
  let closestAge = activationAges[0] || 22;
  let minDiff = Infinity;
  for (const a of activationAges) {
    const diff = Math.abs(a - targetAge);
    if (diff < minDiff) {
      minDiff = diff;
      closestAge = a;
    }
  }

  let caseStudyLoanHealthWarning: string | undefined = undefined;
  if (sunD9House === 8) {
    caseStudyLoanHealthWarning =
      "🚨 LUNAR ASTRO CASE DEMONSTRATION (Age 34 Sun in 8th Navamsha): Sun occupies the 8th house of D9. Per Deepanshu Giri, age 34 triggers acute medical vulnerability and sudden financial drainage—often forcing the native to take substantial loans entirely spent on treating severe bodily health issues. Exercise preventative health care and insurance protection prior to age 34.";
  }

  const strictD9RuleNote =
    "STRICT DIVISIONAL BOUNDARY (Deepanshu Giri Law): This age activation system is formulated STRICTLY for the Navamsha (D9) and will not produce accurate results if applied directly to the D1 Rashi chart or D60 Shashtiamsha.";

  return {
    d9House: sunD9House,
    d9Rashi: sunD9Rashi,
    activationAges,
    isActiveNow,
    isUpcoming,
    closestAge,
    activationTheme: rule.theme,
    caseStudyLoanHealthWarning,
    strictD9RuleNote,
  };
}

// ==========================================
// 3. CASE STUDY BENCHMARK MATCHER
// ==========================================

export function matchLunarAstroNavamshaCaseStudies(
  natalEphem: EphemerisResult,
  planets: Record<string, PlanetRtnDetail>
): LunarAstroNavamshaCaseMatch {
  const d1AscIdx = Math.floor(natalEphem.ascendant.siderealLongitude / 30);
  const d1AscName = RASHI_NAMES[d1AscIdx].englishName;

  const venusRtn = planets["Venus"];
  const rahuRtn = planets["Rahu"];
  const sunRtn = planets["Sun"];
  const saturnRtn = planets["Saturn"];
  const mercuryRtn = planets["Mercury"];

  // Case 1: Cancer Lagna, Venus in 8th with Rahu in RTN
  if (
    d1AscName === "Cancer" &&
    venusRtn?.rtnHouseFromD1Lagna === 8 &&
    rahuRtn?.rtnHouseFromD1Lagna === 8
  ) {
    return {
      isMatched: true,
      matchedCaseTitle: "Case 1: Foreign Love Marriage & Family Rift (Cancer Lagna Venus-Rahu in 8th)",
      d1AscendantSign: "Cancer (Karka)",
      rtnKeyPlacements: "Venus + Rahu in RTN House 8 (Aquarius)",
      manifestationDescription:
        "Exact Lecture Case: Native had a love marriage with a woman of foreign/different cultural descent. The family never accepted the alliance, leading to permanent, unsolvable rift and tension throughout life.",
    };
  }

  // Case 2: Aquarius Lagna, Sun and Venus in RTN House 6
  if (
    d1AscName === "Aquarius" &&
    sunRtn?.rtnHouseFromD1Lagna === 6 &&
    venusRtn?.rtnHouseFromD1Lagna === 6
  ) {
    return {
      isMatched: true,
      matchedCaseTitle: "Case 2: Marital Litigation & Divorce (Aquarius Lagna Sun-Venus in 6th)",
      d1AscendantSign: "Aquarius (Kumbha)",
      rtnKeyPlacements: "Sun + Venus in RTN House 6 (Cancer)",
      manifestationDescription:
        "Exact Lecture Case: Venus in 6th created intense marital hostility, while Sun in 6th brought the involvement of courts, legal battles, and bitter divorce proceedings fought between husband and wife.",
    };
  }

  // Case 3: Leo Lagna, Saturn and Mercury in RTN House 6
  if (
    d1AscName === "Leo" &&
    saturnRtn?.rtnHouseFromD1Lagna === 6 &&
    mercuryRtn?.rtnHouseFromD1Lagna === 6
  ) {
    return {
      isMatched: true,
      matchedCaseTitle: "Case 3: Severe Childhood Chronic Illness (Leo Lagna Saturn-Mercury in 6th)",
      d1AscendantSign: "Leo (Simha)",
      rtnKeyPlacements: "Saturn + Mercury in RTN House 6 (Capricorn)",
      manifestationDescription:
        "Exact Lecture Case: Saturn represents chronic/long-term disease, while Mercury signifies childhood. The native contracted a severe, chronic disease during very early childhood that stunted physical development and persisted for life.",
    };
  }

  return {
    isMatched: false,
    matchedCaseTitle: null,
    d1AscendantSign: d1AscName,
    rtnKeyPlacements: "Standard planetary RTN distribution",
    manifestationDescription: "No exact lecture case study archetype matched; individual planetary RTN rules apply.",
  };
}

// ==========================================
// 4. MAIN EVALUATION ENGINE
// ==========================================

export function evaluateRashiTulyaNavamsha(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult,
  targetAge: number = 30
): RashiTulyaNavamshaResult {
  const ascLon = natalEphem.ascendant.siderealLongitude;
  const d1LagnaRashiIdx = Math.floor(ascLon / 30);
  const d1LagnaRashi: RashiInfo = {
    ...RASHI_NAMES[d1LagnaRashiIdx],
    degreesInSign: ascLon % 30,
  };

  const d9LagnaRashiIdx = getD9RashiIndex(ascLon);
  const d9LagnaRashi: RashiInfo = {
    ...RASHI_NAMES[d9LagnaRashiIdx],
    degreesInSign: 0,
  };

  const planets: Record<string, PlanetRtnDetail> = {};
  const rtnHouseToPlanets: Record<number, string[]> = {};
  for (let i = 1; i <= 12; i++) rtnHouseToPlanets[i] = [];

  const HOUSE_THEMES: Record<number, string> = {
    1: "Direct soul vitality, physical charisma, personal authority and self-sovereignty.",
    2: "Family asset retention, speech eloquence, liquid wealth accumulation and culinary refined taste.",
    3: "Courageous initiative, strategic digital media, sibling alliances and competitive prowess.",
    4: "Domestic happiness, inner psychological peace, ancestral property and vehicular comfort.",
    5: "High creative intellect, Purva Punya fruition, speculative foresight and mantra siddhi.",
    6: "Dominance over professional rivals, debt resolution, clinical acumen and disciplined work ethic.",
    7: "Public diplomacy, soulmate magnetism, commercial trade acumen and contractual prominence.",
    8: "Occult mastery, deep esoteric intuition, unearned legacy assets and regenerative power.",
    9: "Higher dharmic wisdom, Guru blessing, international pilgrimages and divine fortune.",
    10: "Societal career zenith, executive leadership, institutional authority and enduring fame.",
    11: "Fulfillment of grand life ambitions, massive wealth inflows, influential networks and awards.",
    12: "Spiritual liberation (Moksha), foreign ventures, dream clairvoyance and philanthropic investment.",
  };

  const CLASSICAL_9_PLANETS = new Set(["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]);

  for (const [pName, pData] of Object.entries(natalEphem.planets)) {
    if (!CLASSICAL_9_PLANETS.has(pName)) continue;
    if (!pData || pData.isUpagraha || pData.isModernPlanet) continue;
    const pLon = pData.siderealLongitude;
    const d1RIdx = Math.floor(pLon / 30);
    const d1House = ((d1RIdx - d1LagnaRashiIdx + 12) % 12) + 1;

    const d9RIdx = getD9RashiIndex(pLon);
    const d9House = ((d9RIdx - d9LagnaRashiIdx + 12) % 12) + 1;

    const rtnHouse = ((d9RIdx - d1LagnaRashiIdx + 12) % 12) + 1;
    const ntrHouse = ((d1RIdx - d9LagnaRashiIdx + 12) % 12) + 1;
    const isVargottama = d1RIdx === d9RIdx;

    const d1Rashi: RashiInfo = { ...RASHI_NAMES[d1RIdx], degreesInSign: pLon % 30 };
    const d9Rashi: RashiInfo = { ...RASHI_NAMES[d9RIdx], degreesInSign: 0 };

    planets[pName] = {
      planetId: pName,
      planetName: pName,
      d1Longitude: pLon,
      d1Rashi,
      d1HouseFromLagna: d1House,
      d9Rashi,
      d9HouseFromD9Lagna: d9House,
      rtnHouseFromD1Lagna: rtnHouse,
      ntrHouseFromD9Lagna: ntrHouse,
      isVargottama,
      rtnHouseSignificance: `In Rashi Tulya Navamsha, ${pName} activates House ${rtnHouse} (${d9Rashi.englishName}): ${HOUSE_THEMES[rtnHouse]}`,
    };

    rtnHouseToPlanets[rtnHouse].push(pName);
  }

  // Find RTN Conjunctions (multiple planets in same RTN house)
  const rtnConjunctions: RtnConjunction[] = [];
  for (let h = 1; h <= 12; h++) {
    const list = rtnHouseToPlanets[h];
    if (list.length >= 2) {
      const rIdx = (d1LagnaRashiIdx + h - 1) % 12;
      rtnConjunctions.push({
        houseNumber: h,
        rashi: { ...RASHI_NAMES[rIdx], degreesInSign: 0 },
        planets: list,
        type: "RTN Conjunction (Hidden Soul Synergy)",
        interpretation: `In Rashi Tulya Navamsha, planets ${list.join(" + ")} combine in House ${h} (${RASHI_NAMES[rIdx].englishName}), revealing deep karmic alignment and mutual amplification in ${HOUSE_THEMES[h]}`,
      });
    }
  }

  // 64th Navamsha (Khara Navamsha) computation
  const moonLon = natalEphem.planets.Moon?.siderealLongitude || 0;
  const d9MoonRIdx = getD9RashiIndex(moonLon);
  const moon64thRIdx = (d9MoonRIdx + 3) % 12; // 4th sign from D9 Moon
  const moon64thRtnHouse = ((moon64thRIdx - d1LagnaRashiIdx + 12) % 12) + 1;
  const moon64thNavamshaRashi: RashiInfo = { ...RASHI_NAMES[moon64thRIdx], degreesInSign: 0 };

  const lagna64thRIdx = (d9LagnaRashiIdx + 3) % 12; // 4th sign from D9 Lagna
  const lagna64thRtnHouse = ((lagna64thRIdx - d1LagnaRashiIdx + 12) % 12) + 1;
  const lagna64thNavamshaRashi: RashiInfo = { ...RASHI_NAMES[lagna64thRIdx], degreesInSign: 0 };

  // Check live transit afflictions on 64th Navamsha
  const tSat = transitEphem.planets.Saturn;
  const tRahu = transitEphem.planets.Rahu;
  const tMars = transitEphem.planets.Mars;

  const tSatRIdx = tSat ? Math.floor(tSat.siderealLongitude / 30) : -1;
  const tRahuRIdx = tRahu ? Math.floor(tRahu.siderealLongitude / 30) : -1;
  const tMarsRIdx = tMars ? Math.floor(tMars.siderealLongitude / 30) : -1;

  const isTransitSaturnOn64th = tSatRIdx === moon64thRIdx || tSatRIdx === lagna64thRIdx;
  const isTransitRahuOn64th = tRahuRIdx === moon64thRIdx || tRahuRIdx === lagna64thRIdx;
  const isTransitMarsOn64th = tMarsRIdx === moon64thRIdx || tMarsRIdx === lagna64thRIdx;

  let kharaWarningSummary = "✅ CLEAR: No malefic transits activating your 64th Navamsha (Khara) points.";
  if (isTransitSaturnOn64th) {
    kharaWarningSummary = `⚠️ CAUTION: Transit Saturn is activating the 64th Navamsha (${moon64thNavamshaRashi.englishName} in RTN House ${moon64thRtnHouse}). Demands conscious health care, patience, and avoiding hasty contractual decisions.`;
  } else if (isTransitRahuOn64th) {
    kharaWarningSummary = `⚠️ VIGILANCE: Transit Rahu is over the 64th Navamsha (${moon64thNavamshaRashi.englishName}). Beware of deceptive schemes or emotional restlessness; maintain steady spiritual sadhana.`;
  }

  const kharaNavamsha: KharaNavamshaInfo = {
    moon64thNavamshaRashi,
    moon64thRtnHouse,
    lagna64thNavamshaRashi,
    lagna64thRtnHouse,
    isTransitSaturnOn64th,
    isTransitRahuOn64th,
    isTransitMarsOn64th,
    kharaWarningSummary,
  };

  // Check RTN Transit Triggers (Jupiter & Saturn over key RTN positions)
  const activeTransitActivations: RtnTransitActivation[] = [];
  const tJup = transitEphem.planets.Jupiter;
  const tJupRIdx = tJup ? Math.floor(tJup.siderealLongitude / 30) : -1;

  // 10th Lord RTN (Career)
  const tenthRIdx = (d1LagnaRashiIdx + 9) % 12;
  const tenthLordName = RASHI_NAMES[tenthRIdx].lord;
  const tenthLordRtn = planets[tenthLordName];
  if (tenthLordRtn) {
    const isJupActive = tJupRIdx === getD9RashiIndex(tenthLordRtn.d1Longitude);
    activeTransitActivations.push({
      triggerType: "Career Zenith (10th/AmK RTN)",
      targetPlanet: `${tenthLordName} (10th Lord)`,
      rtnRashiName: tenthLordRtn.d9Rashi.englishName,
      rtnHouseNumber: tenthLordRtn.rtnHouseFromD1Lagna,
      transitingPlanet: "Jupiter",
      isCurrentlyActive: isJupActive,
      eventForecast: isJupActive
        ? `Transit Jupiter illuminates your 10th Lord's Navamsha (${tenthLordRtn.d9Rashi.englishName} in RTN House ${tenthLordRtn.rtnHouseFromD1Lagna}), unlocking peak career promotions and executive expansion.`
        : `When Transit Jupiter enters ${tenthLordRtn.d9Rashi.englishName} (House ${tenthLordRtn.rtnHouseFromD1Lagna}), major career breakthroughs materialize.`,
    });
  }

  // 7th Lord RTN (Marriage)
  const seventhRIdx = (d1LagnaRashiIdx + 6) % 12;
  const seventhLordName = RASHI_NAMES[seventhRIdx].lord;
  const seventhLordRtn = planets[seventhLordName];
  if (seventhLordRtn) {
    const isJupActive = tJupRIdx === getD9RashiIndex(seventhLordRtn.d1Longitude);
    activeTransitActivations.push({
      triggerType: "Marriage Milestone (7th/Venus RTN)",
      targetPlanet: `${seventhLordName} (7th Lord)`,
      rtnRashiName: seventhLordRtn.d9Rashi.englishName,
      rtnHouseNumber: seventhLordRtn.rtnHouseFromD1Lagna,
      transitingPlanet: "Jupiter",
      isCurrentlyActive: isJupActive,
      eventForecast: isJupActive
        ? `Transit Jupiter transits over your 7th Lord's Navamsha (${seventhLordRtn.d9Rashi.englishName} in RTN House ${seventhLordRtn.rtnHouseFromD1Lagna}), triggering auspicious marriage alliances and high harmony.`
        : `When Transit Jupiter transits ${seventhLordRtn.d9Rashi.englishName} (House ${seventhLordRtn.rtnHouseFromD1Lagna}), key partnership developments occur.`,
    });
  }

  // Deepanshu Giri: Dusthana Afflictions Evaluation
  const dusthanaAfflictions = evaluateRtnDusthanaAfflictions(natalEphem, d1LagnaRashiIdx, planets);

  // Deepanshu Giri: Navamsha Sun Age Activation
  const d9SunActivation = calculateNavamshaAgeActivation(natalEphem, targetAge);

  // Case Study Benchmark Matcher
  const caseStudyMatch = matchLunarAstroNavamshaCaseStudies(natalEphem, planets);

  // Root vs Fruit Divisional Projection Engine
  const rootFruitProjections = calculateD1D9RootFruitProjections(natalEphem);

  // Synthesis
  const karmicSynthesis = [
    `Rashi Tulya Navamsha projects your D-9 soul reality onto D-1 earthly houses.`,
    `Root-Fruit Projection: ${rootFruitProjections.summaryVerdict}`,
    `Key highlights: ${Object.values(planets).map((p) => `${p.planetName} -> RTN H${p.rtnHouseFromD1Lagna} (${p.d9Rashi.englishName})`).join(", ")}.`,
    dusthanaAfflictions.length > 0
      ? `Dusthana Afflictions active in RTN: ${dusthanaAfflictions.map((a) => `${a.planet} in H${a.rtnHouse} (${a.solvabilityStatus.split(" ")[0]})`).join(", ")}.`
      : "No acute Dusthana afflictions in RTN.",
  ].join(" ");

  return {
    d1LagnaRashi,
    d9LagnaRashi,
    planets,
    rtnConjunctions,
    kharaNavamsha,
    activeTransitActivations,
    dusthanaAfflictions,
    d9SunActivation,
    caseStudyMatch,
    rootFruitProjections,
    karmicSynthesis,
  };
}

export function generateRashiTulyaNavamshaSummary(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult,
  targetAge: number = 30
): string {
  const rtn = evaluateRashiTulyaNavamsha(natalEphem, transitEphem, targetAge);
  const rf = rtn.rootFruitProjections;

  const lines: string[] = [
    "### 🌸 RASHI TULYA NAVAMSHA (RTN), ROOT VS FRUIT MATRIX & D9 MANIFESTATION DOSSIER:",
    `- **D-1 Lagna (Physical Setup / Seed):** ${rtn.d1LagnaRashi.englishName} (${rtn.d1LagnaRashi.sanskritName})`,
    `- **D-9 Navamsha Lagna (Inner Soul Core / Fruit):** ${rtn.d9LagnaRashi.englishName} (${rtn.d9LagnaRashi.sanskritName})`,
    `- **Divisional Synthesis:** ${rf.summaryVerdict}`,
    "",
    "#### 🌳 1. ROOT VS FRUIT DIVISIONAL PROJECTION MATRIX (D-1 SEED TO D-9 MANIFESTATION):",
    ...rf.projections.map(
      (p) =>
        `- **D-1 House ${p.d1House} (${p.d1Sign.englishName}) ──► D-9 House ${p.d9House} [${p.classification}]:** ${p.manifestationDescription}`
    ),
    "",
    "#### 💍 2. 7TH HOUSE MARITAL FRUITION & POST-MARRIAGE STABILITY GATE:",
    `- **D-1 7th House Sign:** ${rf.marriageFruition.d1SeventhSign.englishName} ──► Falls into **D-9 House ${rf.marriageFruition.d9HouseOfSeventhSign}**`,
    `- **Status:** ${rf.marriageFruition.isTurmoilTrap ? `⚠️ **${rf.marriageFruition.turmoilType}**` : "✅ **Protected / Auspicious Manifestation**"}`,
    `- **Verdict:** ${rf.marriageFruition.verdictTitle} — ${rf.marriageFruition.verdictDescription}`,
    `- **Partner Archetype:** ${rf.marriageFruition.partnerArchetype}`,
    `- **D-9 Venus Status:** ${rf.marriageFruition.d9VenusStatus}`,
    `- **Guidance & Mitigation:** ${rf.marriageFruition.mitigationProtocol}`,
    "",
    "#### 💼 3. 10TH HOUSE CAREER FRUITION & ENVIRONMENT ARCHITECTURE:",
    `- **D-1 10th House Sign:** ${rf.careerFruition.d1TenthSign.englishName} ──► Falls into **D-9 House ${rf.careerFruition.d9HouseOfTenthSign}**`,
    `- **Optimal Work Environment:** 🏛️ **${rf.careerFruition.environmentArchetype}**`,
    `- **Manifestation Details:** ${rf.careerFruition.manifestationDescription}`,
    `- **Job Overhaul & Movement Triggers:** ${rf.careerFruition.transferTriggerNotes}`,
    `- **Strategic Guidance:** ${rf.careerFruition.strategicCareerGuidance}`,
    "",
    "#### 🍲 4. 2ND HOUSE DIETARY & FASTING MATRIX:",
    `- **Status:** ${rf.dietaryRule.dietaryPatternSummary}`,
    `- **Protocol:** ${rf.dietaryRule.guidanceProtocol}`,
    "",
    "#### ⚠️ 5. DEEPANSHU GIRI RTN DUSTHANA SUFFERING AUDIT (HOUSES 6, 8, 12):",
    "*(Seed/Fruit Confirmation Law: Whatever is seen in D-1 must be confirmed in D-9 to materialize. 6th = Solvable conflict; 8th = Chronic/unsolvable shock; 12th = Permanent loss/expense)*",
    ...(rtn.dusthanaAfflictions.length > 0
      ? rtn.dusthanaAfflictions.map(
          (a) =>
            `- **${a.planet} in RTN House ${a.rtnHouse} (${a.rtnRashi.englishName}) • ${a.solvabilityStatus}:**\n` +
            `  - *Suffering:* ${a.natureOfSuffering}\n` +
            `  - *D-1 Confirmation:* ${a.d1ConfirmationNotes}\n` +
            `  - *Remedial Action:* ${a.mitigationOrKarmicAction}`
        )
      : ["- ✅ No planets land in RTN Dusthana houses (6th, 8th, 12th). Karakatwas remain protected from acute friction."]),
    "",
    "#### ☀️ 6. NAVAMSHA AGE ACTIVATION TIMING SYSTEM (STRICTLY D-9 SUN):",
    `- **Sun Placement in D-9:** House ${rtn.d9SunActivation.d9House} (${rtn.d9SunActivation.d9Rashi.englishName})`,
    `- **Navamsha Activation Ages:** ${rtn.d9SunActivation.activationAges.map((a) => `Age ${a}`).join(" & ")}`,
    `- **Current Status (Target Age ${targetAge}):** ${rtn.d9SunActivation.isActiveNow ? "⚡ **ACTIVELY MANIFESTING NOW**" : `⏳ Upcoming / Closest Wave at Age ${rtn.d9SunActivation.closestAge}`}`,
    `- **Activation Theme:** ${rtn.d9SunActivation.activationTheme}`,
    ...(rtn.d9SunActivation.caseStudyLoanHealthWarning
      ? [`- **⚠️ Case Alert:** ${rtn.d9SunActivation.caseStudyLoanHealthWarning}`]
      : []),
    `- **Boundary Rule:** ${rtn.d9SunActivation.strictD9RuleNote}`,
    "",
    ...(rtn.caseStudyMatch.isMatched
      ? [
          "#### 🔬 7. HISTORICAL CASE STUDY BENCHMARK MATCH:",
          `- **Matched Benchmark:** 🎯 **${rtn.caseStudyMatch.matchedCaseTitle}**`,
          `- **Key Signatures:** ${rtn.caseStudyMatch.rtnKeyPlacements}`,
          `- **Case Manifestation:** ${rtn.caseStudyMatch.manifestationDescription}`,
          "",
        ]
      : []),
    "#### 🌟 8. PLANETARY RASHI TULYA NAVAMSHA (RTN) MAPPING:",
    ...Object.values(rtn.planets).map(
      (p) =>
        `- **${p.planetName}:** D1 House ${p.d1HouseFromLagna} (${p.d1Rashi.englishName}) ──► D9 Navamsha in **${p.d9Rashi.englishName}** ──► **RTN House ${p.rtnHouseFromD1Lagna}**${p.isVargottama ? " (👑 VARGOTTAMA)" : ""} | *${p.rtnHouseSignificance}*`
    ),
    "",
    "#### 🪢 9. RTN CONJUNCTIONS & HIDDEN SOUL BONDS:",
    ...(rtn.rtnConjunctions.length > 0
      ? rtn.rtnConjunctions.map((c) => `- **House ${c.houseNumber} (${c.rashi.englishName}):** ${c.planets.join(" + ")} ──► ${c.interpretation}`)
      : ["- No multi-planet conjunctions in RTN; individual planetary house influences operate independently."]),
    "",
    "#### ⚠️ 10. 64TH NAVAMSHA (KHARA NAVAMSHA) INTEGRITY CHECK:",
    `- **64th Navamsha from Moon:** **${rtn.kharaNavamsha.moon64thNavamshaRashi.englishName}** (RTN House ${rtn.kharaNavamsha.moon64thRtnHouse})`,
    `- **64th Navamsha from Lagna:** **${rtn.kharaNavamsha.lagna64thNavamshaRashi.englishName}** (RTN House ${rtn.kharaNavamsha.lagna64thRtnHouse})`,
    `- **Live Transit Status:** ${rtn.kharaNavamsha.kharaWarningSummary}`,
    "",
    "#### 🚀 11. RTN PREDICTIVE TRANSIT TRIGGERS (GOCHAR ACTIVATION):",
    ...rtn.activeTransitActivations.map(
      (t) =>
        `- **${t.triggerType}:** ${t.targetPlanet} in RTN ${t.rtnRashiName} (House ${t.rtnHouseNumber}) ──► ${t.isCurrentlyActive ? "⚡ **CURRENTLY ACTIVE IN TRANSIT**" : "⏳ Future Trigger"} | ${t.eventForecast}`
    ),
  ];

  return lines.join("\n");
}
