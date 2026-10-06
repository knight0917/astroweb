/**
 * Classical Root vs Fruit Divisional Projection Matrix & Navamsha Manifestation Timing Engine
 * References:
 * - Deva Keralam (Chandra Kala Nadi)
 * - Brihat Parashara Hora Shastra (Navamsha Adhyaya)
 * - Classical Nadi Principles on Seed (D1) vs Fruit (D9)
 *
 * Core Shastric Principles:
 * 1. Root vs Fruit Law: D1 represents the tree/root (physical circumstances & seed potential),
 *    while D9 Navamsha represents the fruit (experiential manifestation & true reality).
 *    Where a D1 house sign lands in D9 determines the true real-world manifestation house.
 * 2. 7th House Marital Fruition Gate:
 *    - The sign of the D1 7th house is projected into D9.
 *    - If D1 7th house sign falls into D9 6th, 8th, or 12th house, post-marriage life manifests
 *      litigation, acute disputes, in-law hostility, or sudden crises.
 *    - If D1 7th house sign falls into D9 1st house (Lagna), the partner defines native's public
 *      standing, status, and becomes the central mirror of identity.
 *    - If falling in Kendra/Trikona, fruitful, stable partnership outcomes manifest.
 * 3. 10th House Career & Work Environment Gate:
 *    - Where the D1 10th sign falls in D9 reveals the true workplace fruition.
 *    - Falling in D9 4th house roots career fruition in domestic sanctuary, remote architecture,
 *      foundational backend systems, and intellectual property.
 *    - Gemini / dual signs in 10th axis trigger active career overhauls, transfers, and pivots.
 *    - Cancer in 10th axis shifts priority toward work-life peace and emotional balance.
 * 4. Saturn 2nd House Dietary & Speech Matrix:
 *    - Saturn in 2nd house in Rohini Nakshatra imposes severe ~50% intake reduction / food austerity.
 *    - Saturn in 2nd house in Bharani or other nakshatras yields disciplined frugality in youth,
 *      maturing into divisional wealth elevation in D9.
 * 5. Sign Dasha Functional Alignment:
 *    - Analyzes any running sign for functional benefics, Yogakarakas, Marakas, and 6th/8th lords.
 */

import { EphemerisResult, RashiInfo } from "./types";
import { RASHI_NAMES } from "./constants";

export interface HouseRootFruitProjection {
  d1House: number;
  d1SignIndex: number;
  d1Sign: RashiInfo;
  d9House: number;
  classification: "Kendra" | "Trikona" | "Dusthana" | "Upachaya" | "Maraka" | "Neutral";
  isDusthanaTrap: boolean;
  themeTitle: string;
  manifestationDescription: string;
}

export interface MarriageFruitionResult {
  d1SeventhSignIndex: number;
  d1SeventhSign: RashiInfo;
  d9HouseOfSeventhSign: number;
  isTurmoilTrap: boolean;
  turmoilType: "None (Auspicious / Protected)" | "6th House Litigation & Dispute Trap" | "8th House Chronic Friction & Secret Shocks Trap" | "12th House Expenditure & Distance Trap";
  verdictTitle: string;
  verdictDescription: string;
  partnerArchetype: string;
  d9SeventhHouseLord: string;
  d9VenusStatus: string;
  mitigationProtocol: string;
}

export interface CareerFruitionResult {
  d1TenthSignIndex: number;
  d1TenthSign: RashiInfo;
  d9HouseOfTenthSign: number;
  environmentArchetype: string;
  manifestationDescription: string;
  transferTriggerActive: boolean;
  transferTriggerNotes: string;
  workLifeBalanceShiftActive: boolean;
  d9TenthHouseOccupants: string[];
  strategicCareerGuidance: string;
}

export interface DietaryNadiRuleResult {
  hasSaturnInSecondHouse: boolean;
  saturnNakshatraName?: string;
  saturnPada?: number;
  isRohiniStrictAusterityActive: boolean;
  dietaryPatternSummary: string;
  guidanceProtocol: string;
}

export interface FunctionalSignProfile {
  signIndex: number;
  sign: RashiInfo;
  functionalBenefics: string[];
  functionalMalefics: string[];
  yogakaraka: string | null;
  marakas: string[];
  sixthLord: string;
  eighthLord: string;
  subPeriodGuidance: string;
}

export interface RootFruitProjectionResult {
  d1LagnaSign: RashiInfo;
  d9LagnaSign: RashiInfo;
  projections: HouseRootFruitProjection[];
  marriageFruition: MarriageFruitionResult;
  careerFruition: CareerFruitionResult;
  dietaryRule: DietaryNadiRuleResult;
  summaryVerdict: string;
}

const NAVAMSHA_SPAN = 360 / 108; // 3.3333333333°

export function getNavamshaSignIndex(longitude: number): number {
  const norm = ((longitude % 360) + 360) % 360;
  return Math.floor(norm / NAVAMSHA_SPAN) % 12;
}

const RASHI_LORD_KEYS: string[] = [
  "Mars",    // Aries
  "Venus",   // Taurus
  "Mercury", // Gemini
  "Moon",    // Cancer
  "Sun",     // Leo
  "Mercury", // Virgo
  "Venus",   // Libra
  "Mars",    // Scorpio
  "Jupiter", // Sagittarius
  "Saturn",  // Capricorn
  "Saturn",  // Aquarius
  "Jupiter", // Pisces
];

/**
 * Maps each D1 house to its corresponding manifestation house in D9
 */
export function calculateD1D9RootFruitProjections(natalEphemeris: EphemerisResult): RootFruitProjectionResult {
  const d1LagnaSignIdx = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const d9LagnaSignIdx = getNavamshaSignIndex(natalEphemeris.ascendant.siderealLongitude);

  const projections: HouseRootFruitProjection[] = [];

  for (let h = 1; h <= 12; h++) {
    const d1SignIdx = (d1LagnaSignIdx + (h - 1)) % 12;
    const d1Sign: RashiInfo = { ...RASHI_NAMES[d1SignIdx], degreesInSign: 0 };
    const d9House = ((d1SignIdx - d9LagnaSignIdx + 12) % 12) + 1;

    let classification: HouseRootFruitProjection["classification"] = "Neutral";
    if (d9House === 1 || d9House === 4 || d9House === 7 || d9House === 10) {
      classification = "Kendra";
    } else if (d9House === 5 || d9House === 9) {
      classification = "Trikona";
    } else if (d9House === 6 || d9House === 8 || d9House === 12) {
      classification = "Dusthana";
    } else if (d9House === 3 || d9House === 11) {
      classification = "Upachaya";
    } else if (d9House === 2) {
      classification = "Maraka";
    }

    const isDusthanaTrap = d9House === 6 || d9House === 8 || d9House === 12;

    const { themeTitle, manifestationDescription } = getHouseFruitManifestation(h, d9House, d1Sign.englishName);

    projections.push({
      d1House: h,
      d1SignIndex: d1SignIdx,
      d1Sign,
      d9House,
      classification,
      isDusthanaTrap,
      themeTitle,
      manifestationDescription,
    });
  }

  const marriageFruition = evaluateMarriageFruition(natalEphemeris, d1LagnaSignIdx, d9LagnaSignIdx);
  const careerFruition = evaluateCareerFruition(natalEphemeris, d1LagnaSignIdx, d9LagnaSignIdx);
  const dietaryRule = evaluateSpecialDietaryNadiRule(natalEphemeris);

  let summaryVerdict = `Root vs Fruit Matrix maps D-1 ${RASHI_NAMES[d1LagnaSignIdx].englishName} Lagna into D-9 ${RASHI_NAMES[d9LagnaSignIdx].englishName} Navamsha. `;
  if (!marriageFruition.isTurmoilTrap) {
    summaryVerdict += `7th house seed manifests safely in D-9 House ${marriageFruition.d9HouseOfSeventhSign} without post-marriage legal/dusthana traps. `;
  } else {
    summaryVerdict += `7th house seed falls into D-9 House ${marriageFruition.d9HouseOfSeventhSign}, requiring conscious marital mediation. `;
  }
  summaryVerdict += `Career seed (D-1 H10) manifests into D-9 House ${careerFruition.d9HouseOfTenthSign} (${careerFruition.environmentArchetype}).`;

  return {
    d1LagnaSign: { ...RASHI_NAMES[d1LagnaSignIdx], degreesInSign: natalEphemeris.ascendant.siderealLongitude % 30 },
    d9LagnaSign: { ...RASHI_NAMES[d9LagnaSignIdx], degreesInSign: 0 },
    projections,
    marriageFruition,
    careerFruition,
    dietaryRule,
    summaryVerdict,
  };
}

function getHouseFruitManifestation(d1House: number, d9House: number, signName: string): { themeTitle: string; manifestationDescription: string } {
  const d1Names = [
    "Ascendant (Self & Body)",
    "2nd House (Wealth & Speech)",
    "3rd House (Courage & Enterprise)",
    "4th House (Mind & Homeland)",
    "5th House (Intellect & Creativity)",
    "6th House (Debts & Obstacles)",
    "7th House (Spouse & Public Front)",
    "8th House (Longevity & Occult)",
    "9th House (Dharma & Fortune)",
    "10th House (Career & Status)",
    "11th House (Gains & Networks)",
    "12th House (Dissolution & Solitude)",
  ];

  const sourceName = d1Names[d1House - 1];

  switch (d9House) {
    case 1:
      return {
        themeTitle: `${sourceName} -> D-9 Lagna (Identity Anchor)`,
        manifestationDescription: `The affairs of House ${d1House} (${signName}) project directly into the soul center and public identity, becoming a foundational life driver.`,
      };
    case 2:
      return {
        themeTitle: `${sourceName} -> D-9 2nd House (Resource Materialization)`,
        manifestationDescription: `The affairs of House ${d1House} (${signName}) materialize through liquid wealth, family speech, and preserved values.`,
      };
    case 3:
      return {
        themeTitle: `${sourceName} -> D-9 3rd House (Hands-On Craft)`,
        manifestationDescription: `The affairs of House ${d1House} (${signName}) require tireless personal effort, communications, writing, and technical enterprise.`,
      };
    case 4:
      return {
        themeTitle: `${sourceName} -> D-9 4th House (Domestic Sanctuary)`,
        manifestationDescription: `The affairs of House ${d1House} (${signName}) bear fruit in the private sanctuary, home base, internal architectures, and peace of mind.`,
      };
    case 5:
      return {
        themeTitle: `${sourceName} -> D-9 5th House (Intellectual Progeny)`,
        manifestationDescription: `The affairs of House ${d1House} (${signName}) bear fruit through creative foresight, disciples, advisory intelligence, and Purva Punya.`,
      };
    case 6:
      return {
        themeTitle: `${sourceName} -> D-9 6th House (Service & Litigation Trap)`,
        manifestationDescription: `The affairs of House ${d1House} (${signName}) meet daily obstacles, service routines, or adversarial resistance requiring patient resolution.`,
      };
    case 7:
      return {
        themeTitle: `${sourceName} -> D-9 7th House (Relational Mirror)`,
        manifestationDescription: `The affairs of House ${d1House} (${signName}) manifest outward into public dealings, contracts, partnerships, and external visibility.`,
      };
    case 8:
      return {
        themeTitle: `${sourceName} -> D-9 8th House (Sudden Transformations & Research)`,
        manifestationDescription: `The affairs of House ${d1House} (${signName}) undergo sudden shifts, deep research cycles, occult discoveries, or unearned assets.`,
      };
    case 9:
      return {
        themeTitle: `${sourceName} -> D-9 9th House (Dharma & Higher Guidance)`,
        manifestationDescription: `The affairs of House ${d1House} (${signName}) culminate in spiritual wisdom, ethical mentorship, and broad dharmic protection.`,
      };
    case 10:
      return {
        themeTitle: `${sourceName} -> D-9 10th House (Executive Zenith)`,
        manifestationDescription: `The affairs of House ${d1House} (${signName}) manifest as high societal standing, administrative command, and public prominence.`,
      };
    case 11:
      return {
        themeTitle: `${sourceName} -> D-9 11th House (Fulfilled Desires & Gains)`,
        manifestationDescription: `The affairs of House ${d1House} (${signName}) bear sustained financial gains, influential community networks, and realized aspirations.`,
      };
    case 12:
      return {
        themeTitle: `${sourceName} -> D-9 12th House (Dissolution & Foreign Portals)`,
        manifestationDescription: `The affairs of House ${d1House} (${signName}) dissolve into foreign domains, charitable detachment, or private spiritual liberation.`,
      };
    default:
      return {
        themeTitle: `${sourceName} -> D-9 House ${d9House}`,
        manifestationDescription: `Projected manifestation into D-9 House ${d9House}.`,
      };
  }
}

/**
 * Evaluates the 7th House Marriage Fruition Gate & Post-Marriage Turmoil Risk
 */
export function evaluateMarriageFruition(
  natalEphemeris: EphemerisResult,
  d1LagnaSignIdx?: number,
  d9LagnaSignIdx?: number
): MarriageFruitionResult {
  const d1Lagna = d1LagnaSignIdx ?? Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const d9Lagna = d9LagnaSignIdx ?? getNavamshaSignIndex(natalEphemeris.ascendant.siderealLongitude);

  const d1SeventhSignIdx = (d1Lagna + 6) % 12;
  const d1SeventhSign: RashiInfo = { ...RASHI_NAMES[d1SeventhSignIdx], degreesInSign: 0 };
  const d9HouseOfSeventhSign = ((d1SeventhSignIdx - d9Lagna + 12) % 12) + 1;

  let isTurmoilTrap = false;
  let turmoilType: MarriageFruitionResult["turmoilType"] = "None (Auspicious / Protected)";
  let verdictTitle = "Marital Manifestation Protected";
  let verdictDescription = "";
  let mitigationProtocol = "Maintain transparency, mutual respect, and reciprocal intellectual validation.";

  if (d9HouseOfSeventhSign === 6) {
    isTurmoilTrap = true;
    turmoilType = "6th House Litigation & Dispute Trap";
    verdictTitle = "Post-Marriage Friction & Legal Dispute Sensitivity";
    verdictDescription =
      "The D-1 7th house sign falls directly into the 6th house of D-9 Navamsha. In classical Nadi analysis, this creates immediate vulnerability to disputes, litigation, maternal in-law friction, or health challenges post-wedding.";
    mitigationProtocol =
      "Avoid courtroom escalation during relational disagreements; practice non-retaliatory communication, settle disputes through neutral elderly arbitration, and perform regular propitiation of Goddess Mahalakshmi on Fridays.";
  } else if (d9HouseOfSeventhSign === 8) {
    isTurmoilTrap = true;
    turmoilType = "8th House Chronic Friction & Secret Shocks Trap";
    verdictTitle = "Post-Marriage Unsolvable Friction & Shock Sensitivity";
    verdictDescription =
      "The D-1 7th house sign falls into the 8th house of D-9 Navamsha. This marks sudden transformational shocks, non-acceptance or estrangement from family, or cultural dissonance in matrimony.";
    mitigationProtocol =
      "Embrace unconventional partnership models; maintain financial autonomy; engage in shared spiritual disciplines and avoid forcing integration with conservative family expectations.";
  } else if (d9HouseOfSeventhSign === 12) {
    isTurmoilTrap = true;
    turmoilType = "12th House Expenditure & Distance Trap";
    verdictTitle = "Matrimonial Expenditure & Distance Dynamics";
    verdictDescription =
      "The D-1 7th house sign falls into the 12th house of D-9 Navamsha. This indicates substantial matrimonial capital expenditures, foreign relocation, or emotional detachment requiring mindful closeness.";
    mitigationProtocol =
      "Maintain clear financial accounting; direct matrimonial wealth into shared travel, foreign retreats, and charitable causes.";
  } else if (d9HouseOfSeventhSign === 1) {
    verdictTitle = "Elevated Marital Identity & Partner Mirror";
    verdictDescription =
      "The D-1 7th house sign projects directly onto the D-9 Navamsha Lagna (1st House). Marriage and partnership elevate public standing, sharpen personal identity, and provide a formidable intellectual co-pilot.";
    mitigationProtocol =
      "Honor the partner's analytical counsel; foster mutual autonomy and avoid excessive perfectionism or critique.";
  } else {
    verdictTitle = `Supportive Marital Fruition (D-9 House ${d9HouseOfSeventhSign})`;
    verdictDescription = `The D-1 7th house sign projects favorably into House ${d9HouseOfSeventhSign} of D-9 Navamsha, ensuring stable relational manifestation without acute dusthana shocks.`;
  }

  // D-9 7th house lord
  const d9SeventhSignIdx = (d9Lagna + 6) % 12;
  const d9SeventhLord = RASHI_LORD_KEYS[d9SeventhSignIdx];

  // Inspect D9 Venus
  const venusLong = natalEphemeris.planets["Venus"]?.siderealLongitude ?? 0;
  const d9VenusSignIdx = getNavamshaSignIndex(venusLong);
  const d9VenusHouse = ((d9VenusSignIdx - d9Lagna + 12) % 12) + 1;
  const d9VenusSign = RASHI_NAMES[d9VenusSignIdx].englishName;

  let d9VenusStatus = `Venus in D-9 ${d9VenusSign} (House ${d9VenusHouse})`;
  if (d9VenusHouse === 6) {
    d9VenusStatus += " -> Daily adjustments and health/hormonal sensitivity requiring care.";
  } else if (d9VenusHouse === 8) {
    d9VenusStatus += " -> Transformational intimacy and occult bond.";
  } else if (d9VenusHouse === 12) {
    d9VenusStatus += " -> High bedroom luxury, foreign connection, or philanthropic inclination.";
  }

  // Partner archetype from D1 7th sign & planets
  let partnerArchetype = `${d1SeventhSign.englishName} Archetype`;
  if (d1SeventhSign.englishName === "Virgo") {
    partnerArchetype = "Sharp, analytical, detail-oriented, business-savvy, articulate, and values order.";
  } else if (d1SeventhSign.englishName === "Pisces") {
    partnerArchetype = "Empathetic, intuitive, spiritually philosophical, imaginative, and compassionate.";
  } else if (d1SeventhSign.englishName === "Aries" || d1SeventhSign.englishName === "Scorpio") {
    partnerArchetype = "Dynamic, passionate, self-driven, protective, and commanding.";
  } else if (d1SeventhSign.englishName === "Taurus" || d1SeventhSign.englishName === "Libra") {
    partnerArchetype = "Refined, aesthetics-loving, diplomatic, prosperous, and devoted to harmony.";
  } else if (d1SeventhSign.englishName === "Cancer") {
    partnerArchetype = "Nurturing, emotionally anchored, deeply protective of domestic sanctuary.";
  } else if (d1SeventhSign.englishName === "Leo") {
    partnerArchetype = "Dignified, ambitious, charismatic, leadership-oriented, and honorable.";
  } else if (d1SeventhSign.englishName === "Sagittarius") {
    partnerArchetype = "Visionary, advisory, principled, fond of higher knowledge and travel.";
  } else if (d1SeventhSign.englishName === "Capricorn" || d1SeventhSign.englishName === "Aquarius") {
    partnerArchetype = "Pragmatic, resilient, structured, long-term planner, and quietly dependable.";
  }

  return {
    d1SeventhSignIndex: d1SeventhSignIdx,
    d1SeventhSign,
    d9HouseOfSeventhSign,
    isTurmoilTrap,
    turmoilType,
    verdictTitle,
    verdictDescription,
    partnerArchetype,
    d9SeventhHouseLord: d9SeventhLord,
    d9VenusStatus,
    mitigationProtocol,
  };
}

/**
 * Evaluates the 10th House Career Manifestation Gate, Job Transfers, and Work Environment
 */
export function evaluateCareerFruition(
  natalEphemeris: EphemerisResult,
  d1LagnaSignIdx?: number,
  d9LagnaSignIdx?: number
): CareerFruitionResult {
  const d1Lagna = d1LagnaSignIdx ?? Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const d9Lagna = d9LagnaSignIdx ?? getNavamshaSignIndex(natalEphemeris.ascendant.siderealLongitude);

  const d1TenthSignIdx = (d1Lagna + 9) % 12;
  const d1TenthSign: RashiInfo = { ...RASHI_NAMES[d1TenthSignIdx], degreesInSign: 0 };
  const d9HouseOfTenthSign = ((d1TenthSignIdx - d9Lagna + 12) % 12) + 1;

  let environmentArchetype = "Dynamic Career Field";
  let manifestationDescription = "";

  switch (d9HouseOfTenthSign) {
    case 4:
      environmentArchetype = "Domestic Sanctuary / Remote Architecture / Infrastructure";
      manifestationDescription =
        "The D-1 10th house career seed projects directly into the 4th house of D-9 Navamsha. Greatest career fruits, productivity, and sustainable wealth emerge from a private workspace, home office, foundational platform architecture, software systems, and intellectual property.";
      break;
    case 1:
    case 10:
      environmentArchetype = "Executive Command & Public Prominence";
      manifestationDescription =
        "The career seed projects into D-9 Kendra (1st/10th), demanding high public visibility, administrative leadership, and independent enterprise command.";
      break;
    case 12:
      environmentArchetype = "Overseas Enterprise / Foreign Multinational / Isolated Hub";
      manifestationDescription =
        "Career fruits materialize across foreign geographies, multinational clients, remote cross-timezone structures, or institutional seclusion.";
      break;
    case 6:
      environmentArchetype = "Competitive Problem-Solving / Service & Advisory";
      manifestationDescription =
        "Career fruits develop through resolving complex organizational friction, legal/diagnostic troubleshooting, or client advisory.";
      break;
    case 8:
      environmentArchetype = "Deep R&D / Forensic Discovery / Crisis Architecture";
      manifestationDescription =
        "Career thrives on transforming volatile situations, unearthing hidden data/secrets, cryptography, and handling mission-critical transformations.";
      break;
    default:
      environmentArchetype = `Supportive Sector (D-9 House ${d9HouseOfTenthSign})`;
      manifestationDescription = `Career projects into D-9 House ${d9HouseOfTenthSign}, blending professional skill with associated house significations.`;
  }

  // Gemini & Dual Signs Career Overhaul & Transfer Triggers
  const isD1TenthDual = [2, 5, 8, 11].includes(d1TenthSignIdx);
  const d9TenthSignIdx = (d9Lagna + 9) % 12;
  const isD9TenthGemini = d9TenthSignIdx === 2; // Gemini index = 2
  const isD1GeminiInKendra = [0, 3, 6, 9].some((h) => ((d1Lagna + h) % 12) === 2);

  const transferTriggerActive = isD1TenthDual || isD9TenthGemini || isD1GeminiInKendra;
  let transferTriggerNotes = "Stable career trajectory without erratic organizational dislocations.";
  if (transferTriggerActive) {
    transferTriggerNotes =
      "Active Gemini/Dual-sign career connection: Dasha periods associated with Mercury, Gemini, or 3rd/9th/12th houses trigger professional pivots, role redesigns, and location transfers.";
  }

  // Cancer 10th influence work-life balance
  const workLifeBalanceShiftActive = d1TenthSignIdx === 3 || d9TenthSignIdx === 3;

  // D-9 10th house occupants
  const d9TenthOccupants: string[] = [];
  const classicalKeys = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  for (const name of classicalKeys) {
    const p = natalEphemeris.planets[name];
    if (!p) continue;
    const pD9Sign = getNavamshaSignIndex(p.siderealLongitude);
    const pD9House = ((pD9Sign - d9Lagna + 12) % 12) + 1;
    if (pD9House === 10) {
      d9TenthOccupants.push(name);
    }
  }

  let strategicCareerGuidance = "Align daily efforts with core technical depth.";
  if (d9TenthOccupants.includes("Ketu")) {
    strategicCareerGuidance =
      "Ketu occupies D-9 10th house: Flourishes under autonomous, non-hierarchical conditions. Thrives as an independent architect, specialist consultant, or technical builder rather than adhering to rigid bureaucratic ladders.";
  } else if (d9TenthOccupants.includes("Sun") || d9TenthOccupants.includes("Mars")) {
    strategicCareerGuidance = "Commanding presence required: Seek authoritative leadership or sovereign entrepreneurial roles.";
  } else if (d9TenthOccupants.includes("Jupiter") || d9TenthOccupants.includes("Mercury")) {
    strategicCareerGuidance = "High cognitive leverage: Monetize consulting, high-level code, writing, and strategic advisory.";
  }

  return {
    d1TenthSignIndex: d1TenthSignIdx,
    d1TenthSign,
    d9HouseOfTenthSign,
    environmentArchetype,
    manifestationDescription,
    transferTriggerActive,
    transferTriggerNotes,
    workLifeBalanceShiftActive,
    d9TenthHouseOccupants: d9TenthOccupants,
    strategicCareerGuidance,
  };
}

/**
 * Evaluates the Saturn 2nd House Dietary & Speech Matrix (Lecture 1.14 Nadi Rule)
 */
export function evaluateSpecialDietaryNadiRule(natalEphemeris: EphemerisResult): DietaryNadiRuleResult {
  const saturn = natalEphemeris.planets["Saturn"];
  if (!saturn) {
    return {
      hasSaturnInSecondHouse: false,
      isRohiniStrictAusterityActive: false,
      dietaryPatternSummary: "No Saturn 2nd house dietary restriction marker.",
      guidanceProtocol: "Maintain standard balanced Ayurvedic diet according to seasonal Doshas.",
    };
  }

  const d1Lagna = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const saturnSign = Math.floor(saturn.siderealLongitude / 30);
  const saturnHouse = ((saturnSign - d1Lagna + 12) % 12) + 1;

  if (saturnHouse !== 2) {
    return {
      hasSaturnInSecondHouse: false,
      isRohiniStrictAusterityActive: false,
      dietaryPatternSummary: `Saturn resides in House ${saturnHouse} (not 2nd house); standard dietary dynamics apply.`,
      guidanceProtocol: "Maintain standard wholesome diet aligned with natal planetary constitution.",
    };
  }

  const nakshatraName = saturn.nakshatra?.sanskritName || "Unknown";
  const pada = saturn.nakshatra?.pada || 1;
  const isRohini = nakshatraName.toLowerCase().includes("rohini");

  if (isRohini) {
    return {
      hasSaturnInSecondHouse: true,
      saturnNakshatraName: nakshatraName,
      saturnPada: pada,
      isRohiniStrictAusterityActive: true,
      dietaryPatternSummary:
        "CRITICAL NADI DIETARY AUSTERITY MARKER: Saturn resides in 2nd house in Rohini Nakshatra. Classical Nadi observation notes that native involuntarily or voluntarily reduces food consumption by ~50%, frequently skipping meals or subsisting on austere rations.",
      guidanceProtocol:
        "Ensure nutrient density rather than bulk volume; honor regular fasting windows deliberately so it acts as spiritual tapas rather than debilitating physical exhaustion.",
    };
  }

  let dietaryPatternSummary = `Saturn occupies House 2 in ${nakshatraName} (Pada ${pada}). `;
  if (nakshatraName.toLowerCase().includes("bharani")) {
    dietaryPatternSummary +=
      "Saturn in Bharani Nakshatra (Venusian sphere): Imposes disciplined eating habits, intermittent fasting affinity, and early-life financial conservatism that matures into sustained divisional wealth.";
  } else {
    dietaryPatternSummary +=
      "Saturn in 2nd house: Imposes deliberate speech, measured dietary habits, and values longevity-promoting simple meals.";
  }

  return {
    hasSaturnInSecondHouse: true,
    saturnNakshatraName: nakshatraName,
    saturnPada: pada,
    isRohiniStrictAusterityActive: false,
    dietaryPatternSummary,
    guidanceProtocol: "Adopt disciplined eating schedules, simple grounding grains, and conscious speech discipline.",
  };
}

/**
 * Evaluates functional benefic/malefic alignment for any running Sign Dasha
 */
export function evaluateSignDashaArchetypes(runningSignIndex: number): FunctionalSignProfile {
  const normSign = ((runningSignIndex % 12) + 12) % 12;
  const sign: RashiInfo = { ...RASHI_NAMES[normSign], degreesInSign: 0 };

  // Benefics/Malefics/Yogakarakas based on sign lordships
  let yogakaraka: string | null = null;
  const functionalBenefics: string[] = [];
  const functionalMalefics: string[] = [];
  const marakas: string[] = [];

  // Marakas: lords of 2nd and 7th from running sign
  const secondLord = RASHI_LORD_KEYS[(normSign + 1) % 12];
  const seventhLord = RASHI_LORD_KEYS[(normSign + 6) % 12];
  marakas.push(secondLord, seventhLord);

  // 6th and 8th lords
  const sixthLord = RASHI_LORD_KEYS[(normSign + 5) % 12];
  const eighthLord = RASHI_LORD_KEYS[(normSign + 7) % 12];

  // Yogakaraka rules (simultaneous Kendra and Trikona lord)
  if (normSign === 1) yogakaraka = "Saturn"; // Taurus: rules 9 & 10
  else if (normSign === 3) yogakaraka = "Mars"; // Cancer: rules 5 & 10
  else if (normSign === 4) yogakaraka = "Mars"; // Leo: rules 4 & 9
  else if (normSign === 6) yogakaraka = "Saturn"; // Libra: rules 4 & 5

  // Standard benefics & malefics
  const lagnaLord = RASHI_LORD_KEYS[normSign];
  functionalBenefics.push(lagnaLord);
  const fifthLord = RASHI_LORD_KEYS[(normSign + 4) % 12];
  const ninthLord = RASHI_LORD_KEYS[(normSign + 8) % 12];
  if (!functionalBenefics.includes(fifthLord)) functionalBenefics.push(fifthLord);
  if (!functionalBenefics.includes(ninthLord)) functionalBenefics.push(ninthLord);
  if (yogakaraka && !functionalBenefics.includes(yogakaraka)) functionalBenefics.push(yogakaraka);

  if (!functionalMalefics.includes(sixthLord)) functionalMalefics.push(sixthLord);
  if (!functionalMalefics.includes(eighthLord)) functionalMalefics.push(eighthLord);
  const eleventhLord = RASHI_LORD_KEYS[(normSign + 10) % 12];
  if (!functionalMalefics.includes(eleventhLord)) functionalMalefics.push(eleventhLord);

  const subPeriodGuidance = `Running ${sign.englishName} Sign Period: Sub-periods hosting natural benefics (Jupiter, Venus, Mercury) deliver smooth, prosperous outcomes. Sub-periods hosting afflicted malefics or ${sixthLord}/${eighthLord} lords trigger temporary hurdles requiring calculated caution.`;

  return {
    signIndex: normSign,
    sign,
    functionalBenefics: Array.from(new Set(functionalBenefics)),
    functionalMalefics: Array.from(new Set(functionalMalefics)),
    yogakaraka,
    marakas: Array.from(new Set(marakas)),
    sixthLord,
    eighthLord,
    subPeriodGuidance,
  };
}
