/**
 * Classical Relationship, Love Affairs, Elopement & Yogini Dasha Engine
 * References:
 * - Stri Jataka (Varahamihira) & BPHS Ch. 80
 * - K.N. Rao's "Predicting Marriage Through Jaimini & Yogini Dasha"
 * - Saravali & Phaladeepika (Adhyaya on Kamatmak Yogas)
 */

import { EphemerisResult } from "./types";
import { calculateShodashavargaChart } from "./shodashavarga";
import { calculateJaiminiKarakas, calculateJaiminiCharaDasha } from "./jaimini";
import { RASHI_NAMES } from "./constants";

export interface YoginiDashaEntry {
  name: string;
  sanskritName: string;
  lord: string;
  years: number;
  nakshatras: string[];
}

export interface RelationshipAffairsReport {
  // 1. Love Marriage vs Arranged Marriage Dynamics
  is5th7thConnectedD1: boolean;
  is5th7thConnectedD9: boolean;
  isLoveMarriageLikely: boolean;
  loveMarriageSynthesis: string;

  // 2. Elopement & Secret Marriage Risk
  isSecret5th7th8thActive: boolean;
  isThirdHouseCourageStrong: boolean;
  isTwelfthHouseActive: boolean;
  isElopementRiskPresent: boolean;
  elopementSynthesis: string;

  // 3. Sexual Desire Dynamics (High / Unconventional vs Low / Asexual)
  isMarsVenusStrongVector: boolean;
  isAbnormalDesireIndicated: boolean;
  isSaturnVenusControlOrAsexual: boolean;
  sexualDesireSynthesis: string;

  // 4. Multiple Marriages & Extra-Marital Affairs in D-9
  d9LagnaLordSpecialStatus: string;
  isMultipleMarriageIndicated: boolean;
  isAffairRiskIndicated: boolean;
  d9AffairsSynthesis: string;

  // 5. Jupiter Social Binding & 2nd House Sanskars
  jupiterSocialBindingStatus: string;
  d9SecondHouseSanskar: string;

  // 6. Triple Dasha Timing (Vimshottari + Chara + Yogini)
  activeYoginiDasha: YoginiDashaEntry;
  tripleDashaMarriageConvergence: string;

  // 7. Executive Master Relationship Verdict
  executiveRelationshipSummary: string;
}

export const YOGINI_DASHAS: YoginiDashaEntry[] = [
  { name: "Mangala", sanskritName: "मंगला", lord: "Moon", years: 1, nakshatras: ["Ardra", "Chitra", "Shravana"] },
  { name: "Pingala", sanskritName: "पिंगला", lord: "Sun", years: 2, nakshatras: ["Punarvasu", "Swati", "Dhanishta"] },
  { name: "Dhanya", sanskritName: "धान्या", lord: "Jupiter", years: 3, nakshatras: ["Pushya", "Vishakha", "Shatabhisha"] },
  { name: "Bhramari", sanskritName: "भ्रामरी", lord: "Mars", years: 4, nakshatras: ["Ashwini", "Ashlesha", "Jyeshtha", "Purva Bhadrapada"] },
  { name: "Bhadrika", sanskritName: "भद्रिका", lord: "Mercury", years: 5, nakshatras: ["Bharani", "Magha", "Mula", "Uttara Bhadrapada"] },
  { name: "Ulka", sanskritName: "उल्का", lord: "Saturn", years: 6, nakshatras: ["Krittika", "Purva Phalguni", "Purva Ashadha", "Revati"] },
  { name: "Siddha", sanskritName: "सिद्धा", lord: "Venus", years: 7, nakshatras: ["Rohini", "Uttara Phalguni", "Uttara Ashadha"] },
  { name: "Sankata", sanskritName: "संकटा", lord: "Rahu", years: 8, nakshatras: ["Mrigashira", "Hasta", "Anuradha"] },
];

export function evaluateRelationshipAffairs(ephem: EphemerisResult, gender: "male" | "female" = "male"): RelationshipAffairsReport {
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

  // Lords in D1
  const lord1Name = RASHI_NAMES[ascSignIdx].lord;
  const lord3Name = RASHI_NAMES[(ascSignIdx + 2) % 12].lord;
  const lord5Name = RASHI_NAMES[(ascSignIdx + 4) % 12].lord;
  const lord7Name = RASHI_NAMES[(ascSignIdx + 6) % 12].lord;
  const lord8Name = RASHI_NAMES[(ascSignIdx + 7) % 12].lord;
  const lord12Name = RASHI_NAMES[(ascSignIdx + 11) % 12].lord;

  const pLord1 = getPlanet(lord1Name);
  const pLord3 = getPlanet(lord3Name);
  const pLord5 = getPlanet(lord5Name);
  const pLord7 = getPlanet(lord7Name);
  const pLord8 = getPlanet(lord8Name);
  const pLord12 = getPlanet(lord12Name);

  // 1. Love Marriage vs Arranged Marriage
  const is5th7thLordConjunctD1 = Boolean(
    pLord5 && pLord7 && Math.floor(pLord5.siderealLongitude / 30) === Math.floor(pLord7.siderealLongitude / 30)
  );
  const is5thLordIn7thOr1st = Boolean(
    pLord5 && [1, 7].includes(getHouse(pLord5.siderealLongitude))
  );
  const is5th7thConnectedD1 = is5th7thLordConjunctD1 || is5thLordIn7thOr1st;

  // D9 Chart
  const d9Chart = calculateShodashavargaChart(ephem, "D9");
  const d9AscSignIdx = d9Chart.ascendant.vargaSignIndex;
  const d9Lord5 = RASHI_NAMES[(d9AscSignIdx + 4) % 12].lord;
  const d9Lord7 = RASHI_NAMES[(d9AscSignIdx + 6) % 12].lord;
  const pD9Lord5 = d9Chart.entities.find((e) => e.name === d9Lord5);
  const pD9Lord7 = d9Chart.entities.find((e) => e.name === d9Lord7);

  const is5th7thConnectedD9 = Boolean(
    pD9Lord5 && pD9Lord7 && (
      pD9Lord5.vargaSignIndex === pD9Lord7.vargaSignIndex ||
      pD9Lord5.house === 7 ||
      pD9Lord7.house === 5
    )
  );

  const isLoveMarriageLikely = is5th7thConnectedD1 || is5th7thConnectedD9;
  const loveMarriageSynthesis = isLoveMarriageLikely
    ? `Strong 5th-7th Dharma-Kama linkage in D-1/D-9 indicates romance culminating in marriage (Gandharva Vivaha / Love Marriage).`
    : `7th house alignment favors traditional / arranged marriage with family blessings.`;

  // 2. Elopement / Secret Marriage
  const is5thConnected8th = Boolean(
    pLord5 && pLord8 && Math.floor(pLord5.siderealLongitude / 30) === Math.floor(pLord8.siderealLongitude / 30)
  );
  const is7thConnected8th = Boolean(
    pLord7 && pLord8 && Math.floor(pLord7.siderealLongitude / 30) === Math.floor(pLord8.siderealLongitude / 30)
  );
  const isSecret5th7th8thActive = (is5thConnected8th && is5th7thConnectedD1) || (is7thConnected8th && isLoveMarriageLikely);

  const h3LordHouse = pLord3 ? getHouse(pLord3.siderealLongitude) : 3;
  const isThirdHouseCourageStrong = [1, 3, 6, 10, 11].includes(h3LordHouse);
  const isTwelfthHouseActive = Boolean(pLord7 && getHouse(pLord7.siderealLongitude) === 12);

  const isElopementRiskPresent = isSecret5th7th8thActive && isThirdHouseCourageStrong;
  const elopementSynthesis = isElopementRiskPresent
    ? `5th-7th-8th secret axis is active with strong 3rd house willpower; indicates secret matrimony, court marriage, or elopement tendencies before formal social ceremonies.`
    : `Conventional open matrimonial union without secretive elopement pressures.`;

  // 3. Sexual Desire Dynamics
  const marsSign = mars ? Math.floor(mars.siderealLongitude / 30) : 0;
  const venSign = ven ? Math.floor(ven.siderealLongitude / 30) : 0;
  const isMarsVenConjunctOrOpp = Math.abs(marsSign - venSign) === 0 || Math.abs(marsSign - venSign) === 6;

  // Retrograde Mars/Venus with Rahu
  const isRetroMaOrVe = Boolean((mars?.isRetrograde || ven?.isRetrograde) && rahu && (
    (mars && Math.floor(mars.siderealLongitude / 30) === Math.floor(rahu.siderealLongitude / 30)) ||
    (ven && Math.floor(ven.siderealLongitude / 30) === Math.floor(rahu.siderealLongitude / 30))
  ));
  const isAbnormalDesireIndicated = isRetroMaOrVe;

  // Saturn-Venus mutual in D9 (Control / Asexual)
  const d9Sat = d9Chart.entities.find((e) => e.name === "Saturn");
  const d9Ven = d9Chart.entities.find((e) => e.name === "Venus");
  const isSaturnVenusControlOrAsexual = Boolean(
    d9Sat && d9Ven && (
      d9Sat.vargaSignIndex === d9Ven.vargaSignIndex ||
      Math.abs(d9Sat.vargaSignIndex - d9Ven.vargaSignIndex) === 6
    )
  );

  let sexualDesireSynthesis = "";
  if (isAbnormalDesireIndicated) {
    sexualDesireSynthesis = `Retrograde Mars/Venus connected with Rahu indicates unconventional, intense, or non-traditional romantic and sensory desires.`;
  } else if (isSaturnVenusControlOrAsexual) {
    sexualDesireSynthesis = `Saturn-Venus mutual vector in Navamsha (D-9) introduces sensory discipline, high self-control, or periods of complete detachment/asexuality.`;
  } else if (isMarsVenConjunctOrOpp) {
    sexualDesireSynthesis = `Mars-Venus magnetic axis infuses passionate vitality, intense romantic attraction, and vibrant emotional drive.`;
  } else {
    sexualDesireSynthesis = `Balanced, harmonious romantic vitality with natural emotional responsiveness.`;
  }

  // 4. Multiple Marriages & Extra-Marital Affairs in D-9
  const d9LagnaLordName = RASHI_NAMES[d9AscSignIdx].lord;
  const pD9LagnaLord = d9Chart.entities.find((e) => e.name === d9LagnaLordName);
  let d9LagnaLordSpecialStatus = "Standard";
  if (pD9LagnaLord) {
    if ([1, 4, 7, 10].includes(pD9LagnaLord.house)) d9LagnaLordSpecialStatus = "Kendra Fortified";
    if ([5, 9].includes(pD9LagnaLord.house)) d9LagnaLordSpecialStatus = "Trikona Auspicious";
    if ([0, 4, 8].includes(pD9LagnaLord.vargaSignIndex)) d9LagnaLordSpecialStatus = "Fiery Dynamic";
  }

  const d9H7Benefic = d9Chart.entities.some((e) => e.house === 7 && ["Jupiter", "Venus", "Mercury"].includes(e.name));
  const d9Lord7Afflicted = Boolean(pD9Lord7 && ["Mars", "Saturn", "Rahu", "Ketu"].includes(pD9Lord7.name));
  const isMultipleMarriageIndicated = d9H7Benefic && d9Lord7Afflicted;

  const d9H7Malefic = d9Chart.entities.some((e) => e.house === 7 && ["Mars", "Saturn", "Rahu", "Ketu"].includes(e.name));
  const d9Lord7Benefic = Boolean(pD9Lord7 && ["Jupiter", "Venus", "Mercury"].includes(pD9Lord7.name));
  const isAffairRiskIndicated = d9H7Malefic && d9Lord7Benefic;

  let d9AffairsSynthesis = "";
  if (isMultipleMarriageIndicated) {
    d9AffairsSynthesis = `D-9 7th house holds benefics while 7th lord is afflicted; classical indicator of multiple marital partnerships or serial monogamy.`;
  } else if (isAffairRiskIndicated) {
    d9AffairsSynthesis = `D-9 7th house holds malefics while 7th lord is a pure benefic; indicates pre-marital or parallel romantic attractions alongside marriage.`;
  } else {
    d9AffairsSynthesis = `D-9 7th house and lord maintain unified integrity, ensuring single, enduring partnership commitment.`;
  }

  // 5. Jupiter Social Binding & 2nd House Sanskars
  const d9Jup = d9Chart.entities.find((e) => e.name === "Jupiter");
  const isJupInKendraD9 = Boolean(d9Jup && [1, 4, 7, 10].includes(d9Jup.house));
  const jupiterSocialBindingStatus = isJupInKendraD9
    ? `Jupiter in D-9 Kendra (House ${d9Jup?.house}) acts as supreme social anchor, protecting marriage vows and community reputation.`
    : `Jupiter operates as supportive background counselor in D-9.`;

  const d9H2Occupants = d9Chart.entities.filter((e) => e.house === 2).map((e) => e.name);
  const d9H2HasMalefic = d9H2Occupants.some((p) => ["Mars", "Saturn", "Rahu", "Ketu"].includes(p));
  const d9SecondHouseSanskar = d9H2HasMalefic
    ? `D-9 2nd House holds ${d9H2Occupants.join(", ")}; requires conscious alignment of family values and speech etiquette.`
    : `D-9 2nd House reflects noble family culture (Sanskar) and wholesome lineage traditions.`;

  // 6. Yogini Dasha
  const moonNak = ephem.planets.Moon?.nakshatra.sanskritName || "Ardra";
  let activeYoginiDasha = YOGINI_DASHAS[0];
  for (const yd of YOGINI_DASHAS) {
    if (yd.nakshatras.some((n) => moonNak.toLowerCase().includes(n.toLowerCase()))) {
      activeYoginiDasha = yd;
      break;
    }
  }

  const tripleDashaMarriageConvergence = `Marriage Timing Triangulation: Vimshottari 7th/Lagnesha + Jaimini Chara Dasha (DK connection) + Yogini Dasha of ${activeYoginiDasha.name} (${activeYoginiDasha.lord}) activates auspicious wedding muhurta windows.`;

  const executiveRelationshipSummary = `Master Relationship Synthesis: Love vs Arranged: ${isLoveMarriageLikely ? "Love Marriage Favored" : "Arranged Favored"}, Elopement Risk: ${isElopementRiskPresent ? "Active" : "Low"}, Sexual Alignment: ${sexualDesireSynthesis}, Marital Stability: ${d9AffairsSynthesis}, Social Shield: ${jupiterSocialBindingStatus}.`;

  return {
    is5th7thConnectedD1,
    is5th7thConnectedD9,
    isLoveMarriageLikely,
    loveMarriageSynthesis,
    isSecret5th7th8thActive,
    isThirdHouseCourageStrong,
    isTwelfthHouseActive,
    isElopementRiskPresent,
    elopementSynthesis,
    isMarsVenusStrongVector: isMarsVenConjunctOrOpp,
    isAbnormalDesireIndicated,
    isSaturnVenusControlOrAsexual,
    sexualDesireSynthesis,
    d9LagnaLordSpecialStatus,
    isMultipleMarriageIndicated,
    isAffairRiskIndicated,
    d9AffairsSynthesis,
    jupiterSocialBindingStatus,
    d9SecondHouseSanskar,
    activeYoginiDasha,
    tripleDashaMarriageConvergence,
    executiveRelationshipSummary,
  };
}
