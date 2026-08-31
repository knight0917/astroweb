/**
 * Classical Multi-Varga Marriage Synthesis Engine (विवाह एवं दाम्पत्य विचार)
 * Synthesized from:
 * - Stri Jataka (स्त्री जातक - Varahamihira & BPHS Ch. 80)
 * - Jaimini Upadesha Sutras (Darakaraka DK & Upapada)
 * - K.N. Rao's Timing of Marriage & Matchmaking Research
 * - D-9 Navamsha, D-30 Trimsamsha & Complexion Matrices
 */

import { EphemerisResult } from "./types";
import { calculateShodashavargaChart, calculateVargaSign } from "./shodashavarga";
import { calculateJaiminiKarakas } from "./jaimini";
import { RASHI_NAMES } from "./constants";

export interface MarriageMasterSynthesisReport {
  // 1. Foreign Spouse & Inter-Caste/Cultural Indicators
  isDkWithSaturnOrNodes: boolean;
  isDkWithSun: boolean;
  isForeignSpouseIndicated: boolean;
  foreignSpouseReason: string;

  // 2. Separation & Divorce Risk Assessment
  d9SeventhLordAfflicted: boolean;
  is7th8thConnected: boolean;
  isD9SeventhLordRetroDual: boolean;
  beneficBalancingScore: number;
  divorceSeparationRiskLevel: "Low / Harmonious" | "Moderate / Resolvable via Remedies" | "High / Requires Pre-marital Alignment";
  divorceSeparationSynthesis: string;

  // 3. Spouse Longevity & Mangalya Sthana
  spouseLongevityNotes: string;
  isD9EighthLordAfflicted: boolean;
  isD9EighthLordInPaapKartari: boolean;

  // 4. Timing Classification (Early, Timely, Delayed, Denied)
  marriageTimingClassification: "Early Marriage" | "Timely Marriage (Auspicious Age)" | "Delayed Marriage" | "Ascetic / Spiritual Focus";
  timingSynthesisReason: string;

  // 5. Quality of Married Life & D-9 4th House Happiness
  qualityOfMarriageScore: number; // 0 to 100
  d9FourthHouseHappiness: string;
  d30TrimsamshaHarmony: string;

  // 6. Spouse Physical Appearance & Complexion Matrix
  spouseComplexion: string;
  spouseArchetypeDetails: string;

  // 7. Master Executive Synthesis
  executiveMarriageSummary: string;
}

// Classical Complexion mapping per notes
const GRAHA_COMPLEXIONS: Record<string, string> = {
  Sun: "Blood Red / Radiant Wheatish (Blood Red)",
  Moon: "Fair White / Luminous Pale Yellow",
  Mars: "Ruddy / Blood Red / Youthful Flush",
  Mercury: "Greenish / Olive / Vibrant Dusky",
  Jupiter: "Golden Yellow / Fair Radiant",
  Venus: "Variegated / Charming Glowing Fair",
  Saturn: "Dark / Wheatish-Black / Deep Tan",
  Rahu: "Smoky / Dark / Exotic",
  Ketu: "Ash-colored / Pale",
};

const RASHI_COMPLEXIONS: Record<string, string> = {
  Aries: "Blood Red complexion",
  Taurus: "White / Fair complexion",
  Gemini: "Grass Green / Olive hue",
  Cancer: "Pale Red / Fair with Pink flush",
  Leo: "Pale Red / Majestic Golden tone",
  Virgo: "Variegated / Multi-toned",
  Libra: "Deep / Dark / Elegant tone",
  Scorpio: "Reddish Brown / Dusky",
  Sagittarius: "Pale Brown / Golden Olive",
  Capricorn: "Variegated / Rugged tone",
  Aquarius: "Brown / Earthy tone",
  Pisces: "Brown / Violet / Soft Fair",
};

export function evaluateMarriageMasterSynthesis(ephem: EphemerisResult, gender: "male" | "female" = "male"): MarriageMasterSynthesisReport {
  const ascLon = ephem.ascendant.siderealLongitude;
  const ascSignIdx = Math.floor(ascLon / 30);

  const getHouse = (lon: number) => {
    const sIdx = Math.floor(lon / 30);
    return ((sIdx - ascSignIdx + 12) % 12) + 1;
  };

  const getPlanet = (name: string) => ephem.planets[name];

  const sun = getPlanet("Sun");
  const moon = getPlanet("Moon");
  const mars = getPlanet("Mars");
  const merc = getPlanet("Mercury");
  const jup = getPlanet("Jupiter");
  const ven = getPlanet("Venus");
  const sat = getPlanet("Saturn");
  const rahu = getPlanet("Rahu");
  const ketu = getPlanet("Ketu");

  // Jaimini Darakaraka (DK)
  const jaiminiKarakas = calculateJaiminiKarakas(ephem);
  const dk = jaiminiKarakas.darakaraka;
  const dkPlanetName = dk.planetName;
  const pDK = getPlanet(dkPlanetName);

  // Check DK association with Saturn, Rahu, Ketu, Sun
  const isDkWithSaturnOrNodes = Boolean(
    pDK && (
      (sat && Math.floor(pDK.siderealLongitude / 30) === Math.floor(sat.siderealLongitude / 30)) ||
      (rahu && Math.floor(pDK.siderealLongitude / 30) === Math.floor(rahu.siderealLongitude / 30)) ||
      (ketu && Math.floor(pDK.siderealLongitude / 30) === Math.floor(ketu.siderealLongitude / 30))
    )
  );

  const isDkWithSun = Boolean(pDK && sun && Math.floor(pDK.siderealLongitude / 30) === Math.floor(sun.siderealLongitude / 30));

  // D9 and D30 charts
  const d9Chart = calculateShodashavargaChart(ephem, "D9");
  const d30Chart = calculateShodashavargaChart(ephem, "D30");

  const d9AscSignIdx = d9Chart.ascendant.vargaSignIndex;
  const d9SeventhSignIdx = (d9AscSignIdx + 6) % 12;
  const d9SeventhLord = RASHI_NAMES[d9SeventhSignIdx].lord;
  const pD9SeventhLord = d9Chart.entities.find((e) => e.name === d9SeventhLord);

  // 9th and 12th houses in D1/D9 for foreign connection
  const h9Lord = RASHI_NAMES[(ascSignIdx + 8) % 12].lord;
  const h12Lord = RASHI_NAMES[(ascSignIdx + 11) % 12].lord;
  const h7Lord = RASHI_NAMES[(ascSignIdx + 6) % 12].lord;
  const pH7 = getPlanet(h7Lord);
  const pH9 = getPlanet(h9Lord);
  const pH12 = getPlanet(h12Lord);

  const is7thConnected9or12 = Boolean(
    (pH7 && pH9 && Math.floor(pH7.siderealLongitude / 30) === Math.floor(pH9.siderealLongitude / 30)) ||
    (pH7 && pH12 && Math.floor(pH7.siderealLongitude / 30) === Math.floor(pH12.siderealLongitude / 30)) ||
    (pH7 && [9, 12].includes(getHouse(pH7.siderealLongitude)))
  );

  const isForeignSpouseIndicated = isDkWithSaturnOrNodes || is7thConnected9or12;
  let foreignSpouseReason = "";
  if (isForeignSpouseIndicated) {
    foreignSpouseReason = `Strong cross-cultural / foreign marriage indicators: ${isDkWithSaturnOrNodes ? "Darakaraka (DK " + dkPlanetName + ") associated with Saturn/Rahu/Ketu; " : ""}${is7thConnected9or12 ? "7th Lord connected to 9th/12th houses of foreign residence." : ""}`;
  } else {
    foreignSpouseReason = "Traditional domestic matrimonial background favored.";
  }

  // 2. Separation & Divorce Risk Assessment
  const d9OccupantsH7 = d9Chart.entities.filter((e) => e.house === 7).map((e) => e.name);
  const malefics = ["Mars", "Saturn", "Rahu", "Ketu", "Sun"];
  const benefics = ["Jupiter", "Venus", "Mercury"];

  const d9SeventhLordAfflicted = Boolean(pD9SeventhLord && malefics.includes(pD9SeventhLord.name) && [6, 8, 12].includes(pD9SeventhLord.house));
  const is7th8thConnected = Boolean(
    pH7 && getHouse(pH7.siderealLongitude) === 8 ||
    (pD9SeventhLord && pD9SeventhLord.house === 8)
  );

  // Retrograde in dual sign check in D9
  const isDualSignD9 = [2, 5, 8, 11].includes(pD9SeventhLord?.vargaSignIndex ?? 0);
  const isD9SeventhLordRetroDual = isDualSignD9 && d9SeventhLordAfflicted;

  let beneficBalancingScore = 0;
  d9Chart.entities.forEach((e) => {
    if (benefics.includes(e.name) && [1, 4, 7, 9, 10].includes(e.house)) beneficBalancingScore += 25;
  });

  let divorceSeparationRiskLevel: "Low / Harmonious" | "Moderate / Resolvable via Remedies" | "High / Requires Pre-marital Alignment" = "Low / Harmonious";
  let divorceSeparationSynthesis = "";

  if (d9SeventhLordAfflicted && is7th8thConnected && beneficBalancingScore < 25) {
    divorceSeparationRiskLevel = "High / Requires Pre-marital Alignment";
    divorceSeparationSynthesis = "7th Lord in D-9 afflicted with 7th-8th axis link without sufficient benefic shielding. Requires Kundli Milan cross-matching and planetary pariharas.";
  } else if (d9SeventhLordAfflicted || is7th8thConnected || isDkWithSun) {
    divorceSeparationRiskLevel = "Moderate / Resolvable via Remedies";
    divorceSeparationSynthesis = "Mild karmic friction indicated in 7th/8th vector, but mitigated by benefic aspects in Navamsha.";
  } else {
    divorceSeparationRiskLevel = "Low / Harmonious";
    divorceSeparationSynthesis = "D-9 7th house and Karaka enjoy clean disposition with strong benefic protection, promising marital stability.";
  }

  // 3. Spouse Longevity (Mangalya Sthana)
  const d9EighthLord = RASHI_NAMES[(d9AscSignIdx + 7) % 12].lord;
  const pD9EighthLord = d9Chart.entities.find((e) => e.name === d9EighthLord);
  const isD9EighthLordAfflicted = Boolean(pD9EighthLord && malefics.includes(pD9EighthLord.name));

  // Paap Kartari on D9 8th house
  const d9OccupantsH7HasMalefic = d9Chart.entities.some((e) => e.house === 7 && malefics.includes(e.name));
  const d9OccupantsH9HasMalefic = d9Chart.entities.some((e) => e.house === 9 && malefics.includes(e.name));
  const isD9EighthLordInPaapKartari = d9OccupantsH7HasMalefic && d9OccupantsH9HasMalefic;

  const spouseLongevityNotes = isD9EighthLordInPaapKartari
    ? "8th house in D-9 hemmed in Paap Kartari Yoga. Requires partner's chart to possess strong 8th/Mangalya protection."
    : "8th house (Mangalya Sthana) in D-1 & D-9 shows healthy longevity disposition.";

  // 4. Timing Classification (Early, Timely, Delayed, Denied)
  // Early Marriage Rule from Notes: Planet in D1 Lagna AND same in D30 Lagna
  const allGrahas: string[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const d1LagnaOccupants = allGrahas.filter((p: string) => {
    const pl = getPlanet(p);
    return pl && getHouse(pl.siderealLongitude) === 1;
  });
  const d30LagnaOccupants = d30Chart.entities.filter((e) => e.house === 1).map((e) => e.name);
  const hasEarlyMarriageTrigger = d1LagnaOccupants.some((p: string) => d30LagnaOccupants.includes(p));

  // Benefic in 7th in D1 & D9
  const d1BeneficIn7th = allGrahas.some((p: string) => benefics.includes(p) && getPlanet(p) && getHouse(getPlanet(p)!.siderealLongitude) === 7);
  const d9BeneficIn7th = d9Chart.entities.some((e) => e.house === 7 && benefics.includes(e.name));

  // Denial check: 3 afflictions on 7th in D1 & D9 with no benefic
  const d1MaleficIn7thCount = allGrahas.filter((p: string) => malefics.includes(p) && getPlanet(p) && getHouse(getPlanet(p)!.siderealLongitude) === 7).length;
  const d9MaleficIn7thCount = d9Chart.entities.filter((e) => e.house === 7 && malefics.includes(e.name)).length;

  let marriageTimingClassification: "Early Marriage" | "Timely Marriage (Auspicious Age)" | "Delayed Marriage" | "Ascetic / Spiritual Focus" = "Timely Marriage (Auspicious Age)";
  let timingSynthesisReason = "";

  if (d1MaleficIn7thCount + d9MaleficIn7thCount >= 3 && !d1BeneficIn7th && !d9BeneficIn7th) {
    marriageTimingClassification = "Ascetic / Spiritual Focus";
    timingSynthesisReason = "Severe triple affliction on 7th house in D1 and D9 without benefic Drishti directs vitality toward spiritual or independent pursuit.";
  } else if (hasEarlyMarriageTrigger) {
    marriageTimingClassification = "Early Marriage";
    timingSynthesisReason = "Planetary resonance linking D-1 Lagna and D-30 Trimsamsha Lagna creates early matrimonial readiness.";
  } else if (d1BeneficIn7th || d9BeneficIn7th) {
    marriageTimingClassification = "Timely Marriage (Auspicious Age)";
    timingSynthesisReason = "Benefics in 7th house of D-1/D-9 ensure marriage timely fruition during active Dasha periods.";
  } else {
    marriageTimingClassification = "Delayed Marriage";
    timingSynthesisReason = "Saturn or structural delay factors ensure marriage stabilizes during mature ages (28-33+).";
  }

  // 5. D-9 4th House Happiness & D-30 Harmony
  const d9H4Occupants = d9Chart.entities.filter((e) => e.house === 4).map((e) => e.name);
  const d9H4Benefic = d9H4Occupants.some((p) => benefics.includes(p));
  const d9FourthHouseHappiness = d9H4Benefic
    ? `D-9 4th House blessed by ${d9H4Occupants.join(", ")}, promising domestic peace and joyful home environment.`
    : `D-9 4th House holds ${d9H4Occupants.length > 0 ? d9H4Occupants.join(", ") : "neutral lord governance"}, reflecting disciplined domestic routine.`;

  const d30LagnaSignName = d30Chart.ascendant.vargaRashi.englishName;
  const isD30MarsSaturn = ["Aries", "Scorpio", "Capricorn", "Aquarius"].includes(d30LagnaSignName);
  const d30TrimsamshaHarmony = isD30MarsSaturn
    ? `D-30 Trimsamsha Lagna in ${d30LagnaSignName} (Mars/Saturn sign). Requires conscious cultivation of mutual patience and clear communication.`
    : `D-30 Trimsamsha Lagna in ${d30LagnaSignName} (Benefic sign), indicating high moral purity and relational harmony.`;

  // 6. Spouse Complexion & Physical Appearance Matrix
  const d9SeventhSignName = RASHI_NAMES[d9SeventhSignIdx].englishName;
  const primarySpouseGraha = gender === "male" ? (ven?.name || "Venus") : (jup?.name || "Jupiter");
  const grahaColor = GRAHA_COMPLEXIONS[pD9SeventhLord?.name || primarySpouseGraha] || "Fair Radiant";
  const rashiColor = RASHI_COMPLEXIONS[d9SeventhSignName] || "Fair Radiant";

  const spouseComplexion = `${grahaColor} tone influenced by ${d9SeventhSignName} (${rashiColor})`;
  const spouseArchetypeDetails = `Spouse governed by D-9 7th House in ${d9SeventhSignName} (Lord: ${d9SeventhLord}). Reflects ${d9SeventhLord}-archetype attributes with ${grahaColor} disposition.`;

  // Quality score
  let qualityOfMarriageScore = 70;
  if (d1BeneficIn7th) qualityOfMarriageScore += 10;
  if (d9BeneficIn7th) qualityOfMarriageScore += 10;
  if (d9H4Benefic) qualityOfMarriageScore += 10;
  if (d9SeventhLordAfflicted) qualityOfMarriageScore -= 15;
  if (is7th8thConnected) qualityOfMarriageScore -= 10;
  qualityOfMarriageScore = Math.max(35, Math.min(98, qualityOfMarriageScore));

  const executiveMarriageSummary = `Comprehensive Marriage Synthesis: ${marriageTimingClassification} (${timingSynthesisReason}), Stability Score: ${qualityOfMarriageScore}/100 (${divorceSeparationRiskLevel}), Foreign Connection: ${isForeignSpouseIndicated ? "YES" : "NO"}, Spouse Complexion: ${spouseComplexion}.`;

  return {
    isDkWithSaturnOrNodes,
    isDkWithSun,
    isForeignSpouseIndicated,
    foreignSpouseReason,
    d9SeventhLordAfflicted,
    is7th8thConnected,
    isD9SeventhLordRetroDual,
    beneficBalancingScore,
    divorceSeparationRiskLevel,
    divorceSeparationSynthesis,
    spouseLongevityNotes,
    isD9EighthLordAfflicted,
    isD9EighthLordInPaapKartari,
    marriageTimingClassification,
    timingSynthesisReason,
    qualityOfMarriageScore,
    d9FourthHouseHappiness,
    d30TrimsamshaHarmony,
    spouseComplexion,
    spouseArchetypeDetails,
    executiveMarriageSummary,
  };
}
