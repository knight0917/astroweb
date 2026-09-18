/**
 * Classical Progeny, Children & Saptamsha (D-7) Master Suite (संतान निर्णय)
 * Codified per Brihat Parashara Hora Shastra (BPHS) Ch. 12 & 83, Phaladeepika Ch. 12,
 * Jataka Parijata, Maharishi Jaimini Upadesha Sutras, and Sri Jagannath Center (SJC)
 * research monograph "Children and Vedic Astrology" (Sarajit Poddar / Pt. Sanjay Rath).
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateShodashavargaChart, VargaChartResult, VargaEntityPosition } from "./shodashavarga";
import { synthesizeBphsKarmicShanti } from "./bphsKarmicShanti";

export interface SphutaAnalysis {
  sphutaType: "Beeja (Male Virility)" | "Kshetra (Female Fertility)";
  longitude: number;
  signIndex: number;
  signName: string;
  signSanskrit: string;
  degreeInSign: number;
  degreeFormatted: string;
  isSignOdd: boolean;
  navamshaSignIndex: number;
  navamshaSignName: string;
  isNavamshaOdd: boolean;
  fecundityStatus: "Supreme Fecundity (उत्कृष्ट बीज/क्षेत्र)" | "Moderate / Delay (मध्यम)" | "Challenged / Pacification Needed (अवरोध/शान्ति साध्य)";
  fecundityScore: number; // 0-100
  isAfflictedByMalefics: boolean;
  afflictingMalefics: string[]; // Rahu, Ketu, Saturn, Mars within 6 deg
  beneficAspects: string[]; // Jupiter, Venus
  classicalVerdict: string;
}

export interface ChildPregnancyProfile {
  pregnancyOrder: number;
  title: string;
  d7HouseNumber: number;
  d7SignIndex: number;
  d7SignName: string;
  d7Lord: string;
  d7LordPlacementHouse: number;
  d7LordDignity: string;
  occupantsInHouse: string[];
  genderTendency: "Masculine / Putra (पुत्र)" | "Feminine / Kanya (कन्या)" | "Mixed / Twin Tendency (द्विस्वभाव)";
  genderConfidenceScore: number;
  genderReasoning: string;
  vitalityAndHealth: "Robust Vitality (उत्तम स्वास्थ्य)" | "Moderate / Care Required (मध्यम)" | "Delicate / Medical Care Advised (संवेदनशील)";
  parentChildSambandha: {
    relationshipDynamic: "Paraspara Yogakaraka (Harmonious & Elevating)" | "Friendly & Supportive (मित्रवत)" | "Karmic Growth / Mutual Tension (षडाष्टक/परिश्रम)" | "Distant / Foreign Residence (विदेश वास)";
    description: string;
  };
}

export interface ProgenyImpedimentsReport {
  hasEunuchTrineAffliction: boolean;
  eunuchTrinePlanets: string[];
  hasBarrenTrineAffliction: boolean;
  hasDuttaPutraIndicator: boolean;
  duttaPutraExplanation?: string;
  hasNaisargikaAffliction: boolean;
  jupiterDignityInD1: string;
  jupiterDignityInD7: string;
  karmicCursesImpactingChildren: string[];
  overallProgenyVerdict: "Highly Favorable / Blessed Lineage" | "Favorable with Minor Delays" | "Requires Vedic Shanti & Medical Alignment" | "Karmically Guarded / Adoption Potential";
}

export interface ShastricProgenyRemedies {
  primaryMantra: {
    name: string;
    sanskritMantra: string;
    englishPhonetics: string;
    prescription: string;
  };
  vedicRituals: string[];
  recommendedCharities: string[];
  lifestyleAndAyurvedicAdvice: string;
}

export interface ProgenyMasterReport {
  nativeGender: "male" | "female";
  primarySphuta: SphutaAnalysis;
  secondarySphuta: SphutaAnalysis;
  saptamshaLagna: {
    signIndex: number;
    signName: string;
    isOddSign: boolean;
    lord: string;
    lordPlacementHouse: number;
    mandukaGatiMode: "Zodiacal Skipping Alternate Houses (Odd Lagna)" | "Reverse Zodiacal from 9th House (Even Lagna)";
  };
  pregnancies: ChildPregnancyProfile[];
  impediments: ProgenyImpedimentsReport;
  remedies: ShastricProgenyRemedies;
  executiveSynthesis: string;
}

const SIGN_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

function formatDegrees(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}° ${m}'`;
}

function getNavamshaSignIndex(lon: number): { signIndex: number; isOdd: boolean } {
  const norm = ((lon % 360) + 360) % 360;
  const natalSign = Math.floor(norm / 30);
  const degInSign = norm % 30;
  const element = natalSign % 4; // 0=Fire, 1=Earth, 2=Air, 3=Water
  const part = Math.floor(degInSign / (30 / 9));

  let start = 0;
  if (element === 0) start = 0; // Aries
  else if (element === 1) start = 9; // Capricorn
  else if (element === 2) start = 6; // Libra
  else if (element === 3) start = 3; // Cancer

  const navSign = (start + part) % 12;
  return { signIndex: navSign, isOdd: navSign % 2 === 0 };
}

function calculateBeejaSphuta(ephem: EphemerisResult): SphutaAnalysis {
  const sunLon = ephem.planets.Sun?.siderealLongitude || 0;
  const venLon = ephem.planets.Venus?.siderealLongitude || 0;
  const jupLon = ephem.planets.Jupiter?.siderealLongitude || 0;

  const beejaLon = ((sunLon + venLon + jupLon) % 360 + 360) % 360;
  const signIdx = Math.floor(beejaLon / 30);
  const degInSign = beejaLon % 30;
  const isSignOdd = signIdx % 2 === 0; // 0(Aries)=Odd, 1(Taurus)=Even

  const nav = getNavamshaSignIndex(beejaLon);

  // Check malefic conjunctions within 6 degrees
  const afflictingMalefics: string[] = [];
  const malefics = ["Saturn", "Mars", "Rahu", "Ketu"];
  malefics.forEach((mName) => {
    const mObj = ephem.planets[mName];
    if (mObj) {
      let diff = Math.abs(mObj.siderealLongitude - beejaLon) % 360;
      if (diff > 180) diff = 360 - diff;
      if (diff <= 6.0) afflictingMalefics.push(`${mName} (${diff.toFixed(1)}° orb)`);
    }
  });

  const beneficAspects: string[] = [];
  const benefics = ["Jupiter", "Venus"];
  benefics.forEach((bName) => {
    const bObj = ephem.planets[bName];
    if (bObj) {
      let diff = Math.abs(bObj.siderealLongitude - beejaLon) % 360;
      if (diff > 180) diff = 360 - diff;
      if (diff <= 6.0 || Math.abs(diff - 120) <= 6.0 || Math.abs(diff - 180) <= 6.0) {
        beneficAspects.push(`${bName} (${diff.toFixed(1)}°)`);
      }
    }
  });

  let status: SphutaAnalysis["fecundityStatus"] = "Moderate / Delay (मध्यम)";
  let score = 70;
  let verdict = "";

  if (isSignOdd && nav.isOdd) {
    status = "Supreme Fecundity (उत्कृष्ट बीज/क्षेत्र)";
    score = 95;
    verdict = `Beeja Sphuta occupies an Odd Sign (${RASHI_NAMES[signIdx].englishName}) and Odd Navamsha (${RASHI_NAMES[nav.signIndex].englishName}). Classical confirmation of robust male lineage virility per BPHS Ch. 12.`;
  } else if (!isSignOdd && !nav.isOdd) {
    status = "Challenged / Pacification Needed (अवरोध/शान्ति साध्य)";
    score = 45;
    verdict = `Beeja Sphuta occupies an Even Sign (${RASHI_NAMES[signIdx].englishName}) and Even Navamsha (${RASHI_NAMES[nav.signIndex].englishName}). Classical indication of biological latency or lineage impediments; pacified through Santana Gopala Sadhana.`;
  } else {
    status = "Moderate / Delay (मध्यम)";
    score = 70;
    verdict = `Beeja Sphuta exhibits mixed polarity (one Odd, one Even). Progeny is delayed or realized with minor gestational timing adjustments.`;
  }

  if (afflictingMalefics.length > 0) {
    score = Math.max(30, score - 15);
    verdict += ` Afflicted by ${afflictingMalefics.join(", ")}, signaling need for purificatory pariharas.`;
  }
  if (beneficAspects.length > 0) {
    score = Math.min(100, score + 10);
    verdict += ` Protected by benefic aspect from ${beneficAspects.join(", ")}.`;
  }

  return {
    sphutaType: "Beeja (Male Virility)",
    longitude: beejaLon,
    signIndex: signIdx,
    signName: RASHI_NAMES[signIdx].englishName,
    signSanskrit: RASHI_NAMES[signIdx].sanskritName,
    degreeInSign: degInSign,
    degreeFormatted: formatDegrees(degInSign),
    isSignOdd,
    navamshaSignIndex: nav.signIndex,
    navamshaSignName: RASHI_NAMES[nav.signIndex].englishName,
    isNavamshaOdd: nav.isOdd,
    fecundityStatus: status,
    fecundityScore: score,
    isAfflictedByMalefics: afflictingMalefics.length > 0,
    afflictingMalefics,
    beneficAspects,
    classicalVerdict: verdict,
  };
}

function calculateKshetraSphuta(ephem: EphemerisResult): SphutaAnalysis {
  const moonLon = ephem.planets.Moon?.siderealLongitude || 0;
  const marsLon = ephem.planets.Mars?.siderealLongitude || 0;
  const jupLon = ephem.planets.Jupiter?.siderealLongitude || 0;

  const kshetraLon = ((moonLon + marsLon + jupLon) % 360 + 360) % 360;
  const signIdx = Math.floor(kshetraLon / 30);
  const degInSign = kshetraLon % 30;
  const isSignOdd = signIdx % 2 === 0; // 0=Aries (Odd), 1=Taurus (Even)
  const isSignEven = !isSignOdd;

  const nav = getNavamshaSignIndex(kshetraLon);
  const isNavamshaEven = !nav.isOdd;

  const afflictingMalefics: string[] = [];
  const malefics = ["Saturn", "Mars", "Rahu", "Ketu"];
  malefics.forEach((mName) => {
    const mObj = ephem.planets[mName];
    if (mObj) {
      let diff = Math.abs(mObj.siderealLongitude - kshetraLon) % 360;
      if (diff > 180) diff = 360 - diff;
      if (diff <= 6.0) afflictingMalefics.push(`${mName} (${diff.toFixed(1)}° orb)`);
    }
  });

  const beneficAspects: string[] = [];
  const benefics = ["Jupiter", "Venus"];
  benefics.forEach((bName) => {
    const bObj = ephem.planets[bName];
    if (bObj) {
      let diff = Math.abs(bObj.siderealLongitude - kshetraLon) % 360;
      if (diff > 180) diff = 360 - diff;
      if (diff <= 6.0 || Math.abs(diff - 120) <= 6.0 || Math.abs(diff - 180) <= 6.0) {
        beneficAspects.push(`${bName} (${diff.toFixed(1)}°)`);
      }
    }
  });

  let status: SphutaAnalysis["fecundityStatus"] = "Moderate / Delay (मध्यम)";
  let score = 70;
  let verdict = "";

  if (isSignEven && isNavamshaEven) {
    status = "Supreme Fecundity (उत्कृष्ट बीज/क्षेत्र)";
    score = 95;
    verdict = `Kshetra Sphuta occupies an Even Sign (${RASHI_NAMES[signIdx].englishName}) and Even Navamsha (${RASHI_NAMES[nav.signIndex].englishName}). Classical confirmation of a fertile, receptive womb and flourishing motherhood karma per BPHS Ch. 12.`;
  } else if (!isSignEven && !isNavamshaEven) {
    status = "Challenged / Pacification Needed (अवरोध/शान्ति साध्य)";
    score = 45;
    verdict = `Kshetra Sphuta occupies an Odd Sign (${RASHI_NAMES[signIdx].englishName}) and Odd Navamsha (${RASHI_NAMES[nav.signIndex].englishName}). Signals hormonal, ovulatory, or karmic heat; pacified through Kamadhenu Puja and Setu Snana.`;
  } else {
    status = "Moderate / Delay (मध्यम)";
    score = 70;
    verdict = `Kshetra Sphuta exhibits mixed polarity (one Even, one Odd). Conception requires harmonious timing and nutritional balance.`;
  }

  if (afflictingMalefics.length > 0) {
    score = Math.max(30, score - 15);
    verdict += ` Afflicted by ${afflictingMalefics.join(", ")}, suggesting gestational caution.`;
  }
  if (beneficAspects.length > 0) {
    score = Math.min(100, score + 10);
    verdict += ` Benefic protection rendered by ${beneficAspects.join(", ")}.`;
  }

  return {
    sphutaType: "Kshetra (Female Fertility)",
    longitude: kshetraLon,
    signIndex: signIdx,
    signName: RASHI_NAMES[signIdx].englishName,
    signSanskrit: RASHI_NAMES[signIdx].sanskritName,
    degreeInSign: degInSign,
    degreeFormatted: formatDegrees(degInSign),
    isSignOdd,
    navamshaSignIndex: nav.signIndex,
    navamshaSignName: RASHI_NAMES[nav.signIndex].englishName,
    isNavamshaOdd: nav.isOdd,
    fecundityStatus: status,
    fecundityScore: score,
    isAfflictedByMalefics: afflictingMalefics.length > 0,
    afflictingMalefics,
    beneficAspects,
    classicalVerdict: verdict,
  };
}

export function evaluateProgenyMaster(
  natalEphemeris: EphemerisResult,
  gender: "male" | "female" = "male"
): ProgenyMasterReport {
  // 1. Calculate Primary & Secondary Sphutas
  const beeja = calculateBeejaSphuta(natalEphemeris);
  const kshetra = calculateKshetraSphuta(natalEphemeris);

  const primarySphuta = gender === "female" ? kshetra : beeja;
  const secondarySphuta = gender === "female" ? beeja : kshetra;

  // 2. Saptamsha (D-7) Varga Calculation
  const d7Chart: VargaChartResult = calculateShodashavargaChart(natalEphemeris, "D7", false, false);
  const d7LagnaSign = d7Chart.ascendant.vargaSignIndex;
  const isOddLagna = d7LagnaSign % 2 === 0; // Aries=0 (Odd), Taurus=1 (Even)
  const d7LagnaLord = SIGN_LORDS[d7LagnaSign];

  // Find D7 Lagna Lord placement house
  const d7LordEntity = d7Chart.entities.find((e) => e.name === d7LagnaLord || e.id === d7LagnaLord);
  const d7LagnaLordHouse = d7LordEntity ? d7LordEntity.house : 1;

  // 3. Manduka Gati Pregnancy Order Progression
  // Odd Lagna: 5th, 7th, 9th, 11th
  // Even Lagna: 9th, 7th, 5th, 3rd (reverse zodiacal starting from 9th)
  const pregnancyHouses = isOddLagna ? [5, 7, 9, 11] : [9, 7, 5, 3];
  const orderTitles = ["1st Child / Pregnancy", "2nd Child / Pregnancy", "3rd Child / Pregnancy", "4th Child / Pregnancy"];

  const pregnancies: ChildPregnancyProfile[] = pregnancyHouses.map((houseNum, idx) => {
    // Determine sign of that house in D7:
    // House 1 is d7LagnaSign. House H is (d7LagnaSign + (H - 1)) % 12
    const houseSignIndex = (d7LagnaSign + (houseNum - 1)) % 12;
    const houseSignName = RASHI_NAMES[houseSignIndex].englishName;
    const lord = SIGN_LORDS[houseSignIndex];

    const occupants = (d7Chart.houseOccupants[houseNum] || []).map((o) => o.name);
    const lordEntity = d7Chart.entities.find((e) => e.name === lord || e.id === lord);
    const lordPlacementHouse = lordEntity ? lordEntity.house : 1;
    const lordDignity = lordEntity?.dignity || "Neutral";

    // Gender Tendency Evaluation
    // Male planets: Sun, Mars, Jupiter, Rahu
    // Female planets: Moon, Venus, Ketu
    // Neutral: Mercury (tends male), Saturn (tends female)
    let malePoints = 0;
    let femalePoints = 0;

    const MALE_GRAHAS = ["Sun", "Mars", "Jupiter", "Rahu"];
    const FEMALE_GRAHAS = ["Moon", "Venus", "Ketu"];

    if (MALE_GRAHAS.includes(lord)) malePoints += 2;
    else if (FEMALE_GRAHAS.includes(lord)) femalePoints += 2;
    else if (lord === "Mercury") malePoints += 1;
    else if (lord === "Saturn") femalePoints += 1;

    // Sign polarity in D7:
    // Odd signs except Aquarius (10) & Gemini (2) are Male
    // Even signs except Cancer (3) & Pisces (11) are Female
    const isSignOdd = houseSignIndex % 2 === 0;
    if (isSignOdd && houseSignIndex !== 10 && houseSignIndex !== 2) malePoints += 1.5;
    else if (!isSignOdd && houseSignIndex !== 3 && houseSignIndex !== 11) femalePoints += 1.5;
    else if (houseSignIndex === 10 || houseSignIndex === 2) femalePoints += 1; // exception
    else if (houseSignIndex === 3 || houseSignIndex === 11) malePoints += 1; // exception

    // Occupants influence
    occupants.forEach((pName) => {
      if (MALE_GRAHAS.includes(pName)) malePoints += 1.5;
      else if (FEMALE_GRAHAS.includes(pName)) femalePoints += 1.5;
    });

    let genderTendency: ChildPregnancyProfile["genderTendency"] = "Masculine / Putra (पुत्र)";
    let confidence = 75;
    let reasoning = "";

    if (Math.abs(malePoints - femalePoints) < 0.5) {
      genderTendency = "Mixed / Twin Tendency (द्विस्वभाव)";
      confidence = 65;
      reasoning = `Balanced male (${malePoints}) and female (${femalePoints}) indicators on D-7 House ${houseNum} (${houseSignName}). Indicates sensitive dual temperament or twin potential.`;
    } else if (malePoints > femalePoints) {
      genderTendency = "Masculine / Putra (पुत्र)";
      confidence = Math.min(92, Math.round(55 + (malePoints - femalePoints) * 15));
      reasoning = `Ruler ${lord} and D-7 House ${houseNum} (${houseSignName}) align with solar/masculine vectors (${malePoints} vs ${femalePoints}).`;
    } else {
      genderTendency = "Feminine / Kanya (कन्या)";
      confidence = Math.min(92, Math.round(55 + (femalePoints - malePoints) * 15));
      reasoning = `Ruler ${lord} and D-7 House ${houseNum} (${houseSignName}) align with lunar/feminine vectors (${femalePoints} vs ${malePoints}).`;
    }

    // Vitality
    let vitality: ChildPregnancyProfile["vitalityAndHealth"] = "Robust Vitality (उत्तम स्वास्थ्य)";
    if (lordDignity === "Debilitated" || (occupants.includes("Rahu") && occupants.includes("Mars"))) {
      vitality = "Delicate / Medical Care Advised (संवेदनशील)";
    } else if (lordPlacementHouse === 6 || lordPlacementHouse === 8 || lordDignity === "Enemy") {
      vitality = "Moderate / Care Required (मध्यम)";
    }

    // Parent-Child Sambandha:
    // Placement of Child Lord from Saptamsha Lagna
    let dynamic: ChildPregnancyProfile["parentChildSambandha"]["relationshipDynamic"] = "Friendly & Supportive (मित्रवत)";
    let dynamicDesc = "";

    if ([1, 4, 7, 10, 5, 9].includes(lordPlacementHouse)) {
      dynamic = "Paraspara Yogakaraka (Harmonious & Elevating)";
      dynamicDesc = `Lord placed in House ${lordPlacementHouse} forming auspicious Kendra/Trikona alliance. Child brings great honor, shared values, and filial devotion.`;
    } else if ([3, 11].includes(lordPlacementHouse)) {
      dynamic = "Friendly & Supportive (मित्रवत)";
      dynamicDesc = `Lord placed in Upachaya House ${lordPlacementHouse}. Encourages progressive mutual growth and practical comradeship.`;
    } else if ([6, 8].includes(lordPlacementHouse)) {
      dynamic = "Karmic Growth / Mutual Tension (षडाष्टक/परिश्रम)";
      dynamicDesc = `Lord placed in House ${lordPlacementHouse} (Shadashtaka tension). Relationship requires conscious patience and non-judgmental guidance.`;
    } else {
      dynamic = "Distant / Foreign Residence (विदेश वास)";
      dynamicDesc = `Lord placed in 12th House from D-7 Lagna. Child is destined for cross-cultural horizons, distant education, or foreign residence.`;
    }

    return {
      pregnancyOrder: idx + 1,
      title: orderTitles[idx],
      d7HouseNumber: houseNum,
      d7SignIndex: houseSignIndex,
      d7SignName: houseSignName,
      d7Lord: lord,
      d7LordPlacementHouse: lordPlacementHouse,
      d7LordDignity: lordDignity,
      occupantsInHouse: occupants,
      genderTendency,
      genderConfidenceScore: confidence,
      genderReasoning: reasoning,
      vitalityAndHealth: vitality,
      parentChildSambandha: {
        relationshipDynamic: dynamic,
        description: dynamicDesc,
      },
    };
  });

  // 4. Progeny Impediments & Veto Shields
  // Eunuch planets (Mercury, Saturn) in trines (1, 5, 9) to D-7 Lagna
  const trineHouses = [1, 5, 9];
  const trineOccupants: string[] = [];
  trineHouses.forEach((h) => {
    (d7Chart.houseOccupants[h] || []).forEach((e) => trineOccupants.push(e.name));
  });

  const eunuchTrinePlanets = trineOccupants.filter((p) => p === "Mercury" || p === "Saturn");
  const hasEunuchTrines = eunuchTrinePlanets.length > 0;

  // Barren trine: Mercury, Saturn, or Venus alone in trines without Jupiter aspect
  const hasBarrenTrines =
    (trineOccupants.includes("Mercury") && trineOccupants.includes("Saturn") && !trineOccupants.includes("Jupiter")) ||
    (trineOccupants.includes("Venus") && trineOccupants.length === 1 && d7LagnaSign === 5); // Virgo D7

  // Dutta Putra: Mars & Saturn influence on trines
  const hasDuttaPutra = trineOccupants.includes("Mars") && trineOccupants.includes("Saturn");
  const duttaPutraExplanation = hasDuttaPutra
    ? "Mars and Saturn simultaneously influence the D-7 trines. Per classical Maharishi Jaimini dictum ('Kuja-Shanibhyam Datta-Putrah'), indicates blessed adoption, surrogate blessings, or raising step-children alongside biological progeny."
    : undefined;

  // Jupiter dignities
  const d1Jup = natalEphemeris.planets.Jupiter?.isRetrograde ? "Retrograde" : "Direct";
  const d7JupEntity = d7Chart.entities.find((e) => e.name === "Jupiter");
  const jupDignityD7 = d7JupEntity?.dignity || "Neutral";

  // Check active BPHS curses
  const bphsReport = synthesizeBphsKarmicShanti(natalEphemeris);
  const karmicCurses = bphsReport.curses.filter((c) => c.isActive).map((c) => c.name);

  let overallVerdict: ProgenyImpedimentsReport["overallProgenyVerdict"] = "Highly Favorable / Blessed Lineage";
  if (karmicCurses.length > 0 || (hasBarrenTrines && primarySphuta.fecundityScore < 50)) {
    overallVerdict = "Requires Vedic Shanti & Medical Alignment";
  } else if (hasDuttaPutra) {
    overallVerdict = "Karmically Guarded / Adoption Potential";
  } else if (hasEunuchTrines || primarySphuta.fecundityScore < 60) {
    overallVerdict = "Favorable with Minor Delays";
  }

  const impediments: ProgenyImpedimentsReport = {
    hasEunuchTrineAffliction: hasEunuchTrines,
    eunuchTrinePlanets,
    hasBarrenTrineAffliction: hasBarrenTrines,
    hasDuttaPutraIndicator: hasDuttaPutra,
    duttaPutraExplanation,
    hasNaisargikaAffliction: jupDignityD7 === "Debilitated",
    jupiterDignityInD1: d1Jup,
    jupiterDignityInD7: jupDignityD7,
    karmicCursesImpactingChildren: karmicCurses,
    overallProgenyVerdict: overallVerdict,
  };

  // 5. Authentic Shastric Remedies
  const remedies: ShastricProgenyRemedies = {
    primaryMantra: {
      name: "Santana Gopala Mahamantra (संतान गोपाल मन्त्र)",
      sanskritMantra: "ॐ देवकीसुत गोविन्द वासुदेव जगत्पते। देहि मे तनयं कृष्ण त्वामहं शरणं गतः॥",
      englishPhonetics: "Om Devakisuta Govinda Vasudeva Jagatpate, Dehi Me Tanayam Krishna Tvamaham Sharanam Gatah.",
      prescription: "Chant 108 times daily facing East after morning bath. Visualise Sri Krishna as an infant child seated on a banyan leaf.",
    },
    vedicRituals: [
      "Purusha Sukta Homam on Shukla Paksha Thursdays or Ekadashi tithis.",
      "Sponsoring Harivamsa Purana recitation or listening to Sri Krishna Janma Leela.",
      "Kamadhenu / Gau Seva: Feeding cows fresh spinach, jaggery, and green grass on Wednesdays and Thursdays.",
      karmicCurses.includes("Sarpa Shāpa (Serpent Curse)")
        ? "Sarpa Samskara / Nagabali ritual at Kukke Subramanya or Trimbakeshwar to pacify nodal Rahu."
        : "Navagraha Shanti dedicated to Brihaspati (Jupiter) and 5th house lord.",
    ],
    recommendedCharities: [
      "Donation of educational textbooks, stationery, and milk to underprivileged school children.",
      "Gifting yellow garments, ripe bananas, and chana dal at Vishnu/Krishna temples on Thursdays.",
    ],
    lifestyleAndAyurvedicAdvice:
      "Nourish the biological dhatus with pure A2 cow ghee, saffron milk, soaked almonds, and ashwagandha. Maintain mental tranquility and avoid arguments during ovulation and conception windows.",
  };

  // 6. Executive Synthesis
  const mandukaMode = isOddLagna
    ? "Zodiacal Skipping Alternate Houses (Odd Lagna)"
    : "Reverse Zodiacal from 9th House (Even Lagna)";

  const executiveSynthesis =
    `Classical Progeny Matrix (${gender.toUpperCase()}): ${primarySphuta.sphutaType} scores ${primarySphuta.fecundityScore}% [${primarySphuta.fecundityStatus}]. ` +
    `Saptamsha (D-7) Lagna in ${RASHI_NAMES[d7LagnaSign].englishName} activates Manduka Gati (${mandukaMode}). ` +
    `Overall Lineage Verdict: ${overallVerdict}. First pregnancy anchored in House ${pregnancies[0].d7HouseNumber} ruled by ${pregnancies[0].d7Lord} shows ${pregnancies[0].genderTendency} with ${pregnancies[0].vitalityAndHealth}.`;

  return {
    nativeGender: gender,
    primarySphuta,
    secondarySphuta,
    saptamshaLagna: {
      signIndex: d7LagnaSign,
      signName: RASHI_NAMES[d7LagnaSign].englishName,
      isOddSign: isOddLagna,
      lord: d7LagnaLord,
      lordPlacementHouse: d7LagnaLordHouse,
      mandukaGatiMode: mandukaMode,
    },
    pregnancies,
    impediments,
    remedies,
    executiveSynthesis,
  };
}
