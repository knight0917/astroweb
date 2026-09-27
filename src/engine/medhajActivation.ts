/**
 * Medhaj Astro Planetary & House Activation Engine (Sessions 68, 69, 70)
 * 
 * References:
 * - Session 68: Activation of Sun-Saturn Conjunction (Surya-Shani Yoga):
 *   Modality, Gunas, Perspectives ("I to I", "I to You", "I to All"), Purusharthas & Elements.
 *   Age 33 (32–33rd Year) Conjunction Activation & decisive fateful house event.
 *   Father-Son Divergence: ideological/physical detachment, father's career plateaus while son's takes off.
 *   Lower Degree Dominance: Planet with lower degree in sign sets dominant tone and direction.
 *   Good Fame (Saturn in Libra, Capricorn, Aquarius) vs Bad Fame/Scandal (Saturn in Aries, Leo).
 *   6th House Shatru Hanta Yoga with aspect modifiers (Jupiter neutralizes; Rahu adds intrigue; Ketu grants labor).
 * 
 * - Session 69: Activation of Jupiter and Ketu (12th from Jupiter/Ketu):
 *   Jnana guarded by Shiva, Karma Phala Tyaga, 6th house lifelong struggle.
 *   Age 25 (24–25th Year) Activation Rule: 12th House from Jupiter and 12th House from Ketu activate simultaneously.
 *   Dignity Audit: 12th Lord in Kendras/Trikonas relative to 12th -> constructive (foreign travel, safe investments, spiritual retreat).
 *   Afflicted 12th Lord -> heavy losses, hospital visits, debt, bandhan/confinement.
 *   Fixed Deposit Rule: 2nd Lord in 12th in Sthira (Fixed) Fire sign = wealth safely locked in long-term FD.
 *   Disputed Neighbor Rule: Mars in Gemini in 3rd without benefic aspects, influenced by Rahu/Saturn = litigious disputes.
 * 
 * - Session 70: Activation of Mars (Mangal), 8/12 Manglik Yoga & 5 Geometric Sambandhas:
 *   Core Mars: heat, blood, surgery, weapons, rapid execution, courage, pure logic without emotional filters.
 *   Scorpio Mars reproductive health / sperm count medical alert for males after marriage.
 *   Manglik Dosha vs Manglik Yoga: In 8 out of 12 conditions, Kuja acts as a beneficial Manglik Yoga, NOT a Dosha!
 *     - Fire signs (Aries, Leo, Sagittarius): Mars comfortable -> beneficial Yoga.
 *     - Earth signs (Taurus, Virgo, Capricorn): "Son of the Earth" (Bhumi Putra), exalted in Capricorn -> constructive Yoga.
 *     - Own signs (Aries, Scorpio) -> strengthens character, converts Dosha to Yoga.
 *     - Benefic aspects from Jupiter, Venus, or Moon cancel negative afflictions immediately.
 *   Mars Activation Timing: Mars activates at Ages 27–28; 10th House from Mars activates at Age 33 (32–33rd Year) sparking professional karma.
 *   5 Geometric Sambandhas: Kendra (1,4,7,10 - trigger/doubles effect), Trikona (1,5,9 - harmony), 2/12 (feeder/finance), 3/11 (growth), 6/8/12 (friction/debts/dissolution).
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";

// =========================================================================
// 1. SESSION 68: ACTIVATION OF SUN-SATURN CONJUNCTION
// =========================================================================

export interface SunSaturnConjunctionAnalysis {
  isConjoined: boolean;
  house: number;
  signIndex: number;
  signName: string;
  sunLongitude: number;
  saturnLongitude: number;
  degreeSeparation: number;
  sunDegreeInSign: number;
  saturnDegreeInSign: number;
  lowerDegreePlanet: "Sun" | "Saturn" | "Equal" | "None";
  dominantTone: string;
  saturnDignity: "Exalted (Libra)" | "Own Sign (Capricorn/Aquarius)" | "Friendly" | "Neutral" | "Enemy/Debilitated (Aries/Leo)" | "None";
  fameClassification: "Good Fame (Honor & High Authority)" | "Bad Fame (Public Disputes & Defame Risk)" | "Moderate / Mixed Fame" | "None";
  fameAnalysis: string;
  isAge33Active: boolean;
  age33ActivationEvent: string;
  fatherSonDivergence: string;
  rajYogaVerdict: string;
  isSixthHouseShatruHanta: boolean;
  shatruHantaDetails: {
    isFormed: boolean;
    incomingAspects: string[];
    aspectModification: string;
  };
}

export function evaluateSunSaturnConjunction(
  natalEphem: EphemerisResult,
  nativeAge: number
): SunSaturnConjunctionAnalysis {
  const sun = natalEphem.planets["Sun"];
  const saturn = natalEphem.planets["Saturn"];

  if (!sun || !saturn) {
    return {
      isConjoined: false,
      house: 0,
      signIndex: 0,
      signName: "None",
      sunLongitude: 0,
      saturnLongitude: 0,
      degreeSeparation: 0,
      sunDegreeInSign: 0,
      saturnDegreeInSign: 0,
      lowerDegreePlanet: "None",
      dominantTone: "No Sun-Saturn conjunction present in the natal chart.",
      saturnDignity: "None",
      fameClassification: "None",
      fameAnalysis: "N/A",
      isAge33Active: false,
      age33ActivationEvent: "N/A",
      fatherSonDivergence: "N/A",
      rajYogaVerdict: "N/A",
      isSixthHouseShatruHanta: false,
      shatruHantaDetails: { isFormed: false, incomingAspects: [], aspectModification: "N/A" },
    };
  }

  const sunSign = Math.floor(sun.siderealLongitude / 30);
  const saturnSign = Math.floor(saturn.siderealLongitude / 30);
  const degreeSeparation = Math.abs(sun.siderealLongitude - saturn.siderealLongitude);
  const isConjoined = sunSign === saturnSign || degreeSeparation <= 12.0;

  if (!isConjoined) {
    return {
      isConjoined: false,
      house: sun.house,
      signIndex: sunSign,
      signName: RASHI_NAMES[sunSign].englishName,
      sunLongitude: sun.siderealLongitude,
      saturnLongitude: saturn.siderealLongitude,
      degreeSeparation,
      sunDegreeInSign: sun.siderealLongitude % 30,
      saturnDegreeInSign: saturn.siderealLongitude % 30,
      lowerDegreePlanet: "None",
      dominantTone: "Sun and Saturn are placed in separate signs without close conjunction.",
      saturnDignity: "None",
      fameClassification: "None",
      fameAnalysis: "No mutual conjunction fame dynamic.",
      isAge33Active: false,
      age33ActivationEvent: "N/A",
      fatherSonDivergence: "Standard independent father-son life scripts.",
      rajYogaVerdict: "No Sun-Saturn mutual Raj Yoga conjunction.",
      isSixthHouseShatruHanta: false,
      shatruHantaDetails: { isFormed: false, incomingAspects: [], aspectModification: "N/A" },
    };
  }

  const sunDeg = sun.siderealLongitude % 30;
  const satDeg = saturn.siderealLongitude % 30;
  const lowerDegreePlanet = sunDeg < satDeg ? "Sun" : satDeg < sunDeg ? "Saturn" : "Equal";

  let dominantTone = "";
  if (lowerDegreePlanet === "Sun") {
    dominantTone =
      "Sun holds the lower degree (leads the conjunction): Life orientation is governed by sovereign willpower, creative authority, moral vision, and direct administrative initiative. Saturn follows, providing the structural endurance to manifest the Sun's decrees.";
  } else if (lowerDegreePlanet === "Saturn") {
    dominantTone =
      "Saturn holds the lower degree (leads the conjunction): Life orientation is governed by deep discipline, cautious deliberation, patience, and rigorous duty. The Sun follows, illuminating an enduring institution built through persistent labor.";
  } else {
    dominantTone =
      "Exact planetary degree conjunction: Sun and Saturn operate in tight parity, generating intense psychic friction between authoritative ego and cold duty.";
  }

  // Saturn Dignity & Fame Classification (Session 68)
  let saturnDignity: SunSaturnConjunctionAnalysis["saturnDignity"] = "Neutral";
  let fameClassification: SunSaturnConjunctionAnalysis["fameClassification"] = "Moderate / Mixed Fame";
  let fameAnalysis = "";

  if (saturnSign === 6) {
    // Libra
    saturnDignity = "Exalted (Libra)";
    fameClassification = "Good Fame (Honor & High Authority)";
    fameAnalysis =
      "Saturn is Exalted in Libra (Uchha Shani): The Sun's natural fame is refined and solemnized by Saturn's supreme justice. Grants honorable public standing, diplomatic authority, high executive prestige, and lasting legacy.";
  } else if (saturnSign === 9 || saturnSign === 10) {
    // Capricorn or Aquarius
    saturnDignity = "Own Sign (Capricorn/Aquarius)";
    fameClassification = "Good Fame (Honor & High Authority)";
    fameAnalysis =
      "Saturn in Swa-Rashi (Capricorn/Aquarius): Structural integrity and societal duty dominate. The native earns reputable fame through tireless discipline, institutional governance, and public service.";
  } else if (saturnSign === 0 || saturnSign === 4) {
    // Aries (Debilitated) or Leo (Great Enemy)
    saturnDignity = "Enemy/Debilitated (Aries/Leo)";
    fameClassification = "Bad Fame (Public Disputes & Defame Risk)";
    fameAnalysis =
      "Saturn in Debilitation (Aries) or Enemy Sign (Leo): Severe combustive animosity. The Sun's radiant visibility is distorted by an aggrieved Saturn, creating acute vulnerability to public disputes, scandals, defame, litigation, or rebellious conflicts with authority figures.";
  } else if ([1, 2, 5, 11].includes(saturnSign)) {
    saturnDignity = "Friendly";
    fameClassification = "Good Fame (Honor & High Authority)";
    fameAnalysis =
      "Saturn in friendly environment: Harmonious blend of solar prestige and saturnian persistence, fostering stable and dignified social recognition.";
  } else {
    saturnDignity = "Neutral";
    fameClassification = "Moderate / Mixed Fame";
    fameAnalysis =
      "Saturn in neutral dignity: Recognition is earned progressively after overcoming initial skepticism and procedural delays.";
  }

  // Age 33 Trigger & Father-Son Divergence
  const isAge33Active = nativeAge >= 32.0 && nativeAge <= 33.99;
  const houseOccupied = sun.house;

  const age33ActivationEvent = isAge33Active
    ? `🚨 CURRENTLY ACTIVE IN 33RD YEAR (Age 32–33): The Sun-Saturn conjunction in House ${houseOccupied} (${RASHI_NAMES[sunSign].englishName}) is actively detonating its primary karmic blueprint. Expect a decisive, fateful event in House ${houseOccupied} affairs (authority shift, structural realignment, or major sovereign responsibility).`
    : `Awaits activation in the 33rd year of life (ages 32–33). At Age 33, a fateful turning point will ignite in House ${houseOccupied} (${RASHI_NAMES[sunSign].englishName}).`;

  const fatherSonDivergence =
    "Father-Son Divergence Law (Medhaj Astro Rule): In the native's 33rd year, physical separation or profound ideological detachment from the father occurs. The father's career or fortunes often plateau/pause, while the son's fortune takes off dramatically, frequently within the same or closely related professional sphere.";

  const rajYogaVerdict =
    "Paradoxical Sovereign Raj Yoga: Despite the intense internal friction between father and son, authority and discipline, their co-presence in the same house forces extraordinary maturity and builds a powerful Raj Yoga that propels the native to substantial societal achievements.";

  // 6th House Shatru Hanta & Aspects
  const isSixthHouseShatruHanta = houseOccupied === 6;
  const incomingAspects: string[] = [];
  let aspectMod = "No major aspect modifiers on the conjunction.";

  if (isSixthHouseShatruHanta) {
    const jup = natalEphem.planets["Jupiter"];
    const rahu = natalEphem.planets["Rahu"];
    const ketu = natalEphem.planets["Ketu"];

    if (jup && [2, 10, 12].includes(jup.house)) {
      // 5th, 7th, 9th aspect on 6th house
      incomingAspects.push("Jupiter Drishti");
    }
    if (rahu && [10, 12, 2].includes(rahu.house)) {
      incomingAspects.push("Rahu Drishti/Influence");
    }
    if (ketu && [10, 12, 2].includes(ketu.house)) {
      incomingAspects.push("Ketu Drishti/Influence");
    }

    if (incomingAspects.includes("Jupiter Drishti")) {
      aspectMod =
        "Jupiter's aspect neutralizes hostility: Enemies and competitors surrender peacefully or become allies. Litigation is resolved through wise arbitration.";
    } else if (incomingAspects.includes("Rahu Drishti/Influence")) {
      aspectMod =
        "Rahu introduces illusion, espionage, and intrigue: Competitors use deceitful tactics, but the native outmaneuvers them through psychological counter-strategies.";
    } else if (incomingAspects.includes("Ketu Drishti/Influence")) {
      aspectMod =
        "Ketu grants hard-working ascetic detachment: Both father and son labor relentlessly without pride, crushing rivals through austere endurance and spiritual indifference.";
    } else {
      aspectMod =
        "Shatru Hanta Yoga Active: Two fierce natural malefics in the 6th house create an unstoppable fighter archetype. The native systematically overcomes debts, litigations, diseases, and professional competitors through relentless combativeness.";
    }
  }

  return {
    isConjoined: true,
    house: houseOccupied,
    signIndex: sunSign,
    signName: RASHI_NAMES[sunSign].englishName,
    sunLongitude: sun.siderealLongitude,
    saturnLongitude: saturn.siderealLongitude,
    degreeSeparation,
    sunDegreeInSign: sunDeg,
    saturnDegreeInSign: satDeg,
    lowerDegreePlanet,
    dominantTone,
    saturnDignity,
    fameClassification,
    fameAnalysis,
    isAge33Active,
    age33ActivationEvent,
    fatherSonDivergence,
    rajYogaVerdict,
    isSixthHouseShatruHanta,
    shatruHantaDetails: {
      isFormed: isSixthHouseShatruHanta,
      incomingAspects,
      aspectModification: aspectMod,
    },
  };
}

// =========================================================================
// 2. SESSION 69: ACTIVATION OF JUPITER & KETU (12TH FROM JUPITER/KETU AT AGE 25)
// =========================================================================

export interface JupiterKetuTwelfthActivation {
  nativeAge: number;
  isAge25Active: boolean;
  twelfthFromJupiter: {
    houseFromLagna: number;
    signIndex: number;
    signName: string;
    lord: string;
    lordPlacementHouse: number;
    lordDignity: string;
    isConstructive: boolean;
    manifestationTheme: string;
  };
  twelfthFromKetu: {
    houseFromLagna: number;
    signIndex: number;
    signName: string;
    lord: string;
    lordPlacementHouse: number;
    lordDignity: string;
    isConstructive: boolean;
    manifestationTheme: string;
  };
  fixedDepositRule: {
    isMatched: boolean;
    explanation: string;
  };
  disputedNeighborRule: {
    isMatched: boolean;
    explanation: string;
  };
  age25ExecutiveGuidance: string;
}

export function evaluateJupiterKetuTwelfthActivation(
  natalEphem: EphemerisResult,
  nativeAge: number
): JupiterKetuTwelfthActivation {
  const d1AscIdx = Math.floor(natalEphem.ascendant.siderealLongitude / 30);
  const jup = natalEphem.planets["Jupiter"];
  const ketu = natalEphem.planets["Ketu"];

  const jupHouse = jup ? jup.house : 1;
  const ketuHouse = ketu ? ketu.house : 1;

  // 12th house relative to planet: (house - 2 + 12) % 12 + 1
  const h12FromJup = ((jupHouse - 2 + 12) % 12) + 1;
  const h12FromKetu = ((ketuHouse - 2 + 12) % 12) + 1;

  const sign12FromJup = (d1AscIdx + h12FromJup - 1) % 12;
  const sign12FromKetu = (d1AscIdx + h12FromKetu - 1) % 12;

  const lord12Jup = RASHI_NAMES[sign12FromJup].lord;
  const lord12Ketu = RASHI_NAMES[sign12FromKetu].lord;

  const planetLordJup = natalEphem.planets[lord12Jup];
  const planetLordKetu = natalEphem.planets[lord12Ketu];

  const lordPlacementJup = planetLordJup ? planetLordJup.house : 1;
  const lordPlacementKetu = planetLordKetu ? planetLordKetu.house : 1;

  // Kendra/Trikona relative to the 12th-house from Jupiter
  const relativeDistanceJup = ((lordPlacementJup - h12FromJup + 12) % 12) + 1;
  const isConstructiveJup = [1, 4, 5, 7, 9, 10, 11].includes(relativeDistanceJup);

  const relativeDistanceKetu = ((lordPlacementKetu - h12FromKetu + 12) % 12) + 1;
  const isConstructiveKetu = [1, 4, 5, 7, 9, 10, 11].includes(relativeDistanceKetu);

  const isAge25Active = nativeAge >= 24.0 && nativeAge <= 25.99;

  // Manifestation themes
  const manifestationThemeJup = isConstructiveJup
    ? `Constructive Expansion: Lord ${lord12Jup} is placed ${relativeDistanceJup} houses from the 12th house (in good dignity). At Age 25, this brings fruitful international travel, profitable long-term foreign investments, higher philosophical learning, or sacred spiritual retreats.`
    : `Financial & Vitality Friction: Lord ${lord12Jup} is placed in a difficult angle (${relativeDistanceJup} houses from the 12th). At Age 25, native experiences capital erosion, sudden hospital expenses, heavy expenditures, or subconscious anxiety.`;

  const manifestationThemeKetu = isConstructiveKetu
    ? `Spiritual Surrender & Karmic Liberation: Lord ${lord12Ketu} supports constructive detachment. In the 25th year, native willingly dissolves outdated ego attachments, embraces spiritual sadhana, and breaks ancestral bindings.`
    : `Bandhan & Confinement Vulnerability: Lord ${lord12Ketu} indicates challenging detachment. In the 25th year, beware of legal confinement, isolation, bad associations, or wasted resources.`;

  // Fixed Deposit (FD) Rule: 2nd Lord in 12th in Sthira Fire Sign
  const sign2 = (d1AscIdx + 1) % 12;
  const lord2Name = RASHI_NAMES[sign2].lord;
  const planetLord2 = natalEphem.planets[lord2Name];
  const is2ndLordIn12th = planetLord2 ? planetLord2.house === 12 : false;
  const sign12th = (d1AscIdx + 11) % 12;
  const is12thFixed = [1, 4, 7, 10].includes(sign12th); // Taurus, Leo, Scorpio, Aquarius
  const is12thFire = [0, 4, 8].includes(sign12th); // Aries, Leo, Sagittarius
  const isFDRuleMatched = is2ndLordIn12th && (is12thFixed || is12thFire);

  const fdExplanation = isFDRuleMatched
    ? "Fixed Deposit (FD) Law Verified: 2nd House Lord of accumulated liquid wealth sits in the 12th house in a Fixed/Fire environment. Per Medhaj Astro, this protects money from reckless waste by locking capital away safely in long-term fixed deposits, real estate bonds, or sovereign gold."
    : "Standard liquid wealth disposition (2nd Lord does not occupy 12th in Fixed/Fire sign).";

  // Disputed Neighbor Rule: Mars in Gemini in 3rd without benefic aspects, influenced by Rahu/Saturn
  const mars = natalEphem.planets["Mars"];
  const isMarsIn3rd = mars ? mars.house === 3 : false;
  const isMarsInGemini = mars ? Math.floor(mars.siderealLongitude / 30) === 2 : false;
  const saturn = natalEphem.planets["Saturn"];
  const rahu = natalEphem.planets["Rahu"];
  const hasMaleficInfluence =
    (saturn && [1, 3, 9].includes(saturn.house)) || (rahu && [3, 7, 11].includes(rahu.house));
  const isDisputedNeighborMatched = isMarsIn3rd && isMarsInGemini && !!hasMaleficInfluence;

  const neighborExplanation = isDisputedNeighborMatched
    ? "Disputed Neighbor Law Matched: Mars occupies Gemini in the 3rd house with malefic aspect/conjunction. Per Medhaj Astro, this triggers litigious, deceitful, and aggressive disputes with neighbors or immediate siblings. Conscious diplomatic patience is required."
    : "Standard 3rd house sibling and neighborhood disposition.";

  const age25ExecutiveGuidance = isAge25Active
    ? `🔥 CURRENTLY ACTIVE IN 25TH YEAR (Age 24–25): The 12th House from Jupiter (House ${h12FromJup}) and 12th House from Ketu (House ${h12FromKetu}) are actively awakened! Audit all financial outflows, steer clear of speculative debt, and channel energy into spiritual retreat, foreign opportunities, or long-term investments.`
    : `Scheduled for activation in the 25th year of life (ages 24–25). When native turns 25, House ${h12FromJup} (12th from Jupiter) and House ${h12FromKetu} (12th from Ketu) awaken.`;

  return {
    nativeAge,
    isAge25Active,
    twelfthFromJupiter: {
      houseFromLagna: h12FromJup,
      signIndex: sign12FromJup,
      signName: RASHI_NAMES[sign12FromJup].englishName,
      lord: lord12Jup,
      lordPlacementHouse: lordPlacementJup,
      lordDignity: `Placed in House ${lordPlacementJup} (${relativeDistanceJup} from 12th)`,
      isConstructive: isConstructiveJup,
      manifestationTheme: manifestationThemeJup,
    },
    twelfthFromKetu: {
      houseFromLagna: h12FromKetu,
      signIndex: sign12FromKetu,
      signName: RASHI_NAMES[sign12FromKetu].englishName,
      lord: lord12Ketu,
      lordPlacementHouse: lordPlacementKetu,
      lordDignity: `Placed in House ${lordPlacementKetu} (${relativeDistanceKetu} from 12th)`,
      isConstructive: isConstructiveKetu,
      manifestationTheme: manifestationThemeKetu,
    },
    fixedDepositRule: {
      isMatched: isFDRuleMatched,
      explanation: fdExplanation,
    },
    disputedNeighborRule: {
      isMatched: isDisputedNeighborMatched,
      explanation: neighborExplanation,
    },
    age25ExecutiveGuidance,
  };
}

// =========================================================================
// 3. SESSION 70: MARS ACTIVATION, 8/12 MANGLIK YOGA & 5 GEOMETRIC SAMBANDHAS
// =========================================================================

export interface GeometricSambandhaPair {
  planet1: string;
  planet2: string;
  mutualAxis: string;
  category: "Kendra (Direct Trigger / Double Effect)" | "Trikona (Natural Support / Harmony)" | "2/12 (Feeder / Finance)" | "3/11 (Growth / Desire Fulfillment)" | "6/8/12 (Karmic Friction & Debt)";
  dynamicPhala: string;
}

export interface MarsActivationAndManglikYoga {
  nativeAge: number;
  isMarsAge28Active: boolean;
  marsAge28Theme: string;
  tenthFromMars: {
    houseFromLagna: number;
    signIndex: number;
    signName: string;
    lord: string;
    kalapurushaSignification: string;
    isAge33Active: boolean;
    careerKarmaSurge: string;
  };
  manglikYogaAnalysis: {
    isManglikPlacement: boolean;
    marsHouseFromLagna: number;
    marsSignIndex: number;
    marsSignName: string;
    element: "Fire" | "Earth" | "Air" | "Water";
    classification: "Manglik Yoga (Auspicious)" | "Kuja Dosha (Requires Remediation)" | "Non-Manglik";
    is8of12ConditionMet: boolean;
    yogaConditionReasons: string[];
    beneficAspectCancellation: {
      hasJupiterAspect: boolean;
      hasVenusAspect: boolean;
      hasMoonAspect: boolean;
      isCancelledByAspect: boolean;
      details: string;
    };
    scorpioReproductiveHealthAlert: {
      isScorpioMars: boolean;
      isAfflicted: boolean;
      medicalAdvice: string;
    };
  };
  geometricSambandhas: GeometricSambandhaPair[];
}

export function evaluateMarsActivationAndManglikYoga(
  natalEphem: EphemerisResult,
  nativeAge: number
): MarsActivationAndManglikYoga {
  const d1AscIdx = Math.floor(natalEphem.ascendant.siderealLongitude / 30);
  const mars = natalEphem.planets["Mars"];
  const marsHouse = mars ? mars.house : 1;
  const marsLon = mars ? mars.siderealLongitude : 0;
  const marsSign = Math.floor(marsLon / 30);
  const element = RASHI_NAMES[marsSign].element;

  // 1. Direct Mars Activation at Ages 27–28
  const isMarsAge28Active = nativeAge >= 27.0 && nativeAge <= 28.99;
  const marsAge28Theme = isMarsAge28Active
    ? "🔥 CURRENTLY ACTIVE AT AGE 27–28: Mars is directly awakened! Driving acute ambition, courage, physical stamina, decisive career moves, real-estate acquisitions, and heightened competitive instincts."
    : "Mars directly awakens at ages 27–28 (28th year), unlocking decisive courage and autonomous breakthroughs.";

  // 2. 10th House from Mars activates at Age 33 (32–33rd Year)
  const tenthHouseFromMars = ((marsHouse + 9 - 1) % 12) + 1;
  const tenthSignFromMars = (d1AscIdx + tenthHouseFromMars - 1) % 12;
  const tenthLord = RASHI_NAMES[tenthSignFromMars].lord;
  const isAge33Active = nativeAge >= 32.0 && nativeAge <= 33.99;

  const kalapurushaDescriptions: Record<number, string> = {
    1: "Aries archetype: Autonomous leadership, athletic drive, pioneering breakthroughs.",
    2: "Taurus archetype: Wealth accumulation, speech conviction, family assets.",
    3: "Gemini archetype: Media, contracting, business agility, courageous messaging.",
    4: "Cancer archetype: Landed property, construction, domestic roots, vehicles.",
    5: "Leo archetype: Strategic management, speculative intelligence, creative sovereignty.",
    6: "Virgo archetype: Competitive victory, debt liquidation, problem-solving mastery.",
    7: "Libra archetype: Public trade, commercial diplomacy, high-stakes partnerships.",
    8: "Scorpio archetype: Subterranean research, surgical precision, hidden crisis mastery.",
    9: "Sagittarius archetype: Institutional law, spiritual ethics, higher teaching.",
    10: "Capricorn archetype: Executive governance, industrial authority, peak status.",
    11: "Aquarius archetype: Large network monetisation, social influence, liquid cash flow.",
    12: "Pisces archetype: International trade, hospital/institutional contracts, spiritual retreat.",
  };

  const careerKarmaSurge = isAge33Active
    ? `🚨 CURRENTLY ACTIVE IN 33RD YEAR (Age 32–33): The 10th House from Mars (House ${tenthHouseFromMars} in ${RASHI_NAMES[tenthSignFromMars].englishName}, ruled by ${tenthLord}) is actively detonating professional karma! Expect a major career milestone, promotional authority, or professional restructuring.`
    : `Activates in the 33rd year (ages 32–33). At Age 33, House ${tenthHouseFromMars} from Lagna (10th from natal Mars) will ignite career breakthroughs and professional karma.`;

  // 3. Medhaj Astro 8/12 Manglik Yoga Rule
  const MANGLIK_HOUSES = [1, 2, 4, 7, 8, 12];
  const isManglikPlacement = MANGLIK_HOUSES.includes(marsHouse);

  const yogaReasons: string[] = [];
  let is8of12ConditionMet = false;

  // Condition 1: Fire Signs (Aries, Leo, Sagittarius) -> Mars comfortable -> Beneficial Yoga
  if ([0, 4, 8].includes(marsSign)) {
    yogaReasons.push(
      `Mars in Fire Sign (${RASHI_NAMES[marsSign].englishName}): Mars is naturally comfortable in the Fire element. Converts Kuja Dosha into an auspicious Manglik Yoga of courageous leadership and unyielding drive.`
    );
    is8of12ConditionMet = true;
  }

  // Condition 2: Earth Signs (Taurus, Virgo, Capricorn) -> "Son of Earth" (Bhumi Putra) -> Constructive Yoga
  if ([1, 5, 9].includes(marsSign)) {
    yogaReasons.push(
      `Mars in Earth Sign (${RASHI_NAMES[marsSign].englishName}): Mars is the mythological 'Son of the Earth' (Bhumi Putra). In Earth signs (especially Exalted Capricorn), heat is channeled into tangible assets, real estate, and grounded stamina.`
    );
    is8of12ConditionMet = true;
  }

  // Condition 3: Own Signs (Aries, Scorpio) -> Strengthens Character
  if ([0, 7].includes(marsSign)) {
    yogaReasons.push(
      `Mars in Swa-Rashi (${RASHI_NAMES[marsSign].englishName}): Mars in own dignity purifies anger into principled chivalry, transforming Dosha into a character-fortifying Yoga.`
    );
    is8of12ConditionMet = true;
  }

  // Benefic Aspects from Jupiter, Venus, or Moon
  const jup = natalEphem.planets["Jupiter"];
  const ven = natalEphem.planets["Venus"];
  const moon = natalEphem.planets["Moon"];

  let hasJupAspect = false;
  let hasVenAspect = false;
  let hasMoonAspect = false;

  if (jup) {
    const diff = ((marsHouse - jup.house + 12) % 12) + 1;
    if ([1, 5, 7, 9].includes(diff)) hasJupAspect = true;
  }
  if (ven) {
    const diff = ((marsHouse - ven.house + 12) % 12) + 1;
    if ([1, 7].includes(diff)) hasVenAspect = true;
  }
  if (moon) {
    const diff = ((marsHouse - moon.house + 12) % 12) + 1;
    if ([1, 7].includes(diff)) hasMoonAspect = true;
  }

  const isCancelledByAspect = hasJupAspect || hasVenAspect || hasMoonAspect;
  if (isCancelledByAspect) {
    const aspecters: string[] = [];
    if (hasJupAspect) aspecters.push("Guru (Jupiter)");
    if (hasVenAspect) aspecters.push("Shukra (Venus)");
    if (hasMoonAspect) aspecters.push("Chandra (Moon)");
    yogaReasons.push(
      `Benefic Aspect Cancellation: Mars receives direct auspicious aspect from ${aspecters.join(" & ")}, immediately extinguishing the destructive heat of Kuja Dosha.`
    );
    is8of12ConditionMet = true;
  }

  let classification: MarsActivationAndManglikYoga["manglikYogaAnalysis"]["classification"] = "Non-Manglik";
  if (isManglikPlacement) {
    classification = is8of12ConditionMet ? "Manglik Yoga (Auspicious)" : "Kuja Dosha (Requires Remediation)";
  }

  // Scorpio Mars Medical Alert
  const isScorpioMars = marsSign === 7;
  const saturn = natalEphem.planets["Saturn"];
  const rahu = natalEphem.planets["Rahu"];
  const isAfflictedScorpio =
    isScorpioMars &&
    ((saturn && [1, 4, 7, 8, 10].includes(((marsHouse - saturn.house + 12) % 12) + 1)) ||
      (rahu && [1, 5, 7, 9].includes(((marsHouse - rahu.house + 12) % 12) + 1)));

  const scorpioMedicalAdvice = isScorpioMars
    ? isAfflictedScorpio
      ? "⚠️ Medical Caution (Medhaj Astro Rule): Mars occupies Scorpio with malefic affliction. While giving formidable research depth and stamina, males are strongly advised to proactively undergo reproductive health and sperm count testing after marriage to treat potential inflammation or complications early."
      : "Mars in Scorpio gives intense physical stamina and deep transformation. Maintain standard hydration and cooling diet."
    : "Standard biological vitality disposition.";

  // 4. 5 Geometric Sambandhas
  const planetsToCompare = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const geometricSambandhas: GeometricSambandhaPair[] = [];

  for (let i = 0; i < planetsToCompare.length; i++) {
    for (let j = i + 1; j < planetsToCompare.length; j++) {
      const p1Name = planetsToCompare[i];
      const p2Name = planetsToCompare[j];
      const p1 = natalEphem.planets[p1Name];
      const p2 = natalEphem.planets[p2Name];

      if (!p1 || !p2) continue;

      const diff = ((p2.house - p1.house + 12) % 12) + 1;
      let axis = "";
      let cat: GeometricSambandhaPair["category"] = "Kendra (Direct Trigger / Double Effect)";
      let phala = "";

      if (diff === 1) {
        axis = "1-1 (Conjunction)";
        cat = "Kendra (Direct Trigger / Double Effect)";
        phala = "Direct Fusion: Intense blending of planetary energies, sparking immediate event triggers and doubling reciprocal impact.";
      } else if (diff === 4 || diff === 10) {
        axis = "1-4 / 4-10 (Kendra)";
        cat = "Kendra (Direct Trigger / Double Effect)";
        phala = "Kendra Dynamic: Mutual challenge and direct catalyst. Friction produces acute action, career events, and doubles manifest results.";
      } else if (diff === 7) {
        axis = "1-7 (Kendra Samasaptaka)";
        cat = "Kendra (Direct Trigger / Double Effect)";
        phala = "Samasaptaka: Direct confrontation and mutual mirroring. Sparks instant polar reactions and relational awareness.";
      } else if (diff === 5 || diff === 9) {
        axis = "1-5 / 5-9 (Trikona)";
        cat = "Trikona (Natural Support / Harmony)";
        phala = "Trikona Harmony: Absolute natural support, mutual dharmic resonance, and effortless amplification without struggle.";
      } else if (diff === 2 || diff === 12) {
        axis = "2-12 (Feeder Axis)";
        cat = "2/12 (Feeder / Finance)";
        phala = "Feeder Relationship: The planet placed behind pushes, feeds, resources, and finances the planet ahead.";
      } else if (diff === 3 || diff === 11) {
        axis = "3-11 (Growth Axis)";
        cat = "3/11 (Growth / Desire Fulfillment)";
        phala = "Upachaya Growth: Inspiration, courage, progressive gains, and gradual fulfillment of long-term ambitions.";
      } else if (diff === 6 || diff === 8) {
        axis = "6-8 (Shashtashtaka Friction)";
        cat = "6/8/12 (Karmic Friction & Debt)";
        phala = "Shashtashtaka: Karmic friction, debts, hidden past-life faults (Neecha Dosha), requiring conscious surrender and patience.";
      }

      if (axis) {
        geometricSambandhas.push({
          planet1: p1Name,
          planet2: p2Name,
          mutualAxis: axis,
          category: cat,
          dynamicPhala: phala,
        });
      }
    }
  }

  return {
    nativeAge,
    isMarsAge28Active,
    marsAge28Theme,
    tenthFromMars: {
      houseFromLagna: tenthHouseFromMars,
      signIndex: tenthSignFromMars,
      signName: RASHI_NAMES[tenthSignFromMars].englishName,
      lord: tenthLord,
      kalapurushaSignification: kalapurushaDescriptions[tenthHouseFromMars] || "Professional authority & structural duty.",
      isAge33Active,
      careerKarmaSurge,
    },
    manglikYogaAnalysis: {
      isManglikPlacement,
      marsHouseFromLagna: marsHouse,
      marsSignIndex: marsSign,
      marsSignName: RASHI_NAMES[marsSign].englishName,
      element,
      classification,
      is8of12ConditionMet,
      yogaConditionReasons: yogaReasons,
      beneficAspectCancellation: {
        hasJupiterAspect: hasJupAspect,
        hasVenusAspect: hasVenAspect,
        hasMoonAspect: hasMoonAspect,
        isCancelledByAspect,
        details: isCancelledByAspect ? "Cancelled by benefic aspect" : "No direct benefic cancellation aspect",
      },
      scorpioReproductiveHealthAlert: {
        isScorpioMars,
        isAfflicted: isAfflictedScorpio,
        medicalAdvice: scorpioMedicalAdvice,
      },
    },
    geometricSambandhas,
  };
}

// =========================================================================
// 4. MASTER REPORT SYNTHESIS
// =========================================================================

export interface MedhajActivationMasterReport {
  sunSaturn: SunSaturnConjunctionAnalysis;
  jupiterKetuTwelfth: JupiterKetuTwelfthActivation;
  marsActivation: MarsActivationAndManglikYoga;
  masterExecutiveSummary: string;
}

export function generateMedhajActivationMasterReport(
  natalEphem: EphemerisResult,
  birthDate: Date,
  evaluationDate: Date = new Date()
): MedhajActivationMasterReport {
  const nativeAge = Math.max(0, (evaluationDate.getTime() - birthDate.getTime()) / (365.25 * 24 * 3600 * 1000));
  const sunSaturn = evaluateSunSaturnConjunction(natalEphem, nativeAge);
  const jupiterKetuTwelfth = evaluateJupiterKetuTwelfthActivation(natalEphem, nativeAge);
  const marsActivation = evaluateMarsActivationAndManglikYoga(natalEphem, nativeAge);

  const lines: string[] = [
    "### ⚡ MEDHAJ ASTRO SESSIONS 68, 69 & 70 MASTER ACTIVATION REPORT",
    `- **Native Current Age:** **${nativeAge.toFixed(1)} Years Old**`,
    "",
    "#### 👑 1. Sun-Saturn Conjunction & Age 33 Sovereign Trigger (Session 68):",
    sunSaturn.isConjoined
      ? [
          `  - **Placement:** House ${sunSaturn.house} in ${sunSaturn.signName} (Separation: ${sunSaturn.degreeSeparation.toFixed(2)}°)`,
          `  - **Lower Degree Dominance:** **${sunSaturn.lowerDegreePlanet}** (${sunSaturn.dominantTone})`,
          `  - **Fame Status:** **${sunSaturn.fameClassification}** (${sunSaturn.fameAnalysis})`,
          `  - **33rd Year Activation:** ${sunSaturn.age33ActivationEvent}`,
          `  - **Father-Son Dynamic:** ${sunSaturn.fatherSonDivergence}`,
          sunSaturn.isSixthHouseShatruHanta ? `  - **6th House Shatru Hanta:** ${sunSaturn.shatruHantaDetails.aspectModification}` : "",
        ].filter(Boolean).join("\n")
      : "  - No Sun-Saturn conjunction in natal chart.",
    "",
    "#### 🕊️ 2. Age 25 Twelfth House from Jupiter & Ketu Gateway (Session 69):",
    `  - **12th from Jupiter:** House ${jupiterKetuTwelfth.twelfthFromJupiter.houseFromLagna} (${jupiterKetuTwelfth.twelfthFromJupiter.signName}) • ${jupiterKetuTwelfth.twelfthFromJupiter.manifestationTheme}`,
    `  - **12th from Ketu:** House ${jupiterKetuTwelfth.twelfthFromKetu.houseFromLagna} (${jupiterKetuTwelfth.twelfthFromKetu.signName}) • ${jupiterKetuTwelfth.twelfthFromKetu.manifestationTheme}`,
    `  - **25th Year Status:** ${jupiterKetuTwelfth.age25ExecutiveGuidance}`,
    jupiterKetuTwelfth.fixedDepositRule.isMatched ? `  - **Fixed Deposit Law:** 💰 ${jupiterKetuTwelfth.fixedDepositRule.explanation}` : "",
    jupiterKetuTwelfth.disputedNeighborRule.isMatched ? `  - **Neighbor Dispute Alert:** ⚠️ ${jupiterKetuTwelfth.disputedNeighborRule.explanation}` : "",
    "",
    "#### ⚔️ 3. Mars Activation, 8/12 Manglik Yoga & 10th House Karma Trigger (Session 70):",
    `  - **Mars Placement:** House ${marsActivation.manglikYogaAnalysis.marsHouseFromLagna} in ${marsActivation.manglikYogaAnalysis.marsSignName} (${marsActivation.manglikYogaAnalysis.element} Element)`,
    `  - **Manglik Verdict:** **${marsActivation.manglikYogaAnalysis.classification}** ${marsActivation.manglikYogaAnalysis.is8of12ConditionMet ? `(8/12 Auspicious Yoga Met: ${marsActivation.manglikYogaAnalysis.yogaConditionReasons.join("; ")})` : ""}`,
    `  - **Direct Mars Activation (Ages 27–28):** ${marsActivation.marsAge28Theme}`,
    `  - **10th from Mars (Age 33 Career Karma):** House ${marsActivation.tenthFromMars.houseFromLagna} (${marsActivation.tenthFromMars.signName} • *${marsActivation.tenthFromMars.kalapurushaSignification}*) ➔ ${marsActivation.tenthFromMars.careerKarmaSurge}`,
    marsActivation.manglikYogaAnalysis.scorpioReproductiveHealthAlert.isScorpioMars ? `  - **Scorpio Health Caution:** ${marsActivation.manglikYogaAnalysis.scorpioReproductiveHealthAlert.medicalAdvice}` : "",
  ];

  return {
    sunSaturn,
    jupiterKetuTwelfth,
    marsActivation,
    masterExecutiveSummary: lines.filter(Boolean).join("\n"),
  };
}
