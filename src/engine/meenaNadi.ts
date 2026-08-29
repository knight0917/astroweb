/**
 * Meena Nadi (Jeeva & Sareera Stellar Theory) Engine
 * Classical stellar Nadi treatise by R. Gopalakrishna Row (Meena 1) & N.V. Raghavachari (Meena 2).
 * Every Graha and Bhava operates through a Jeeva (Soul / Life-force Star Lord)
 * and a Sareera (Body / Physical Vessel Sub-Lord / Dispositor).
 */

import { EphemerisResult, MeenaNadiAnalysis, MeenaNadiDomainPromise, MeenaNadiGrade, MeenaNadiPlanetResult } from "./types";
import { RASHI_NAMES, NAKSHATRA_NAMES } from "./constants";
import { getKpSubSubLord } from "./cuspalInterlinks";

function normalize360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function getPlanetDignity(planetName: string, rashiIndex: number): string {
  const EXALTATIONS: Record<string, number> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6, Rahu: 1, Ketu: 8 };
  const DEBILITATIONS: Record<string, number> = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0, Rahu: 7, Ketu: 2 };
  const OWN_SIGNS: Record<string, number[]> = {
    Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10], Rahu: [10], Ketu: [7]
  };

  if (EXALTATIONS[planetName] === rashiIndex) return "Exalted (उच्च)";
  if (DEBILITATIONS[planetName] === rashiIndex) return "Debilitated (नीच)";
  if (OWN_SIGNS[planetName]?.includes(rashiIndex)) return "Own Sign (स्वक्षेत्री)";
  return "Neutral / Friendly (सम/मित्र)";
}

export function evaluateMeenaNadi(ephemeris: EphemerisResult): MeenaNadiAnalysis {
  const planets: Record<string, MeenaNadiPlanetResult> = {};
  const moonLon = ephemeris.planets.Moon?.siderealLongitude || 0;
  const moonNakIdx = Math.floor(moonLon / (360 / 27));

  // Analyze all 9 Grahas
  const targetGrahas = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  
  targetGrahas.forEach((planetName) => {
    const planetData = ephemeris.planets[planetName];
    if (!planetData) return;

    const lon = normalize360(planetData.siderealLongitude);
    const signIdx = Math.floor(lon / 30);
    const signName = RASHI_NAMES[signIdx].englishName;
    const degInSign = (lon % 30).toFixed(2);
    const nakIdx = Math.floor(lon / (360 / 27));
    const nakshatraName = NAKSHATRA_NAMES[nakIdx]?.sanskritName || "Ashwini";
    const nakLord = NAKSHATRA_NAMES[nakIdx]?.lord || "Ketu";

    // Jeeva (Star Lord)
    const jeevaPlanet = nakLord;
    const jeevaData = ephemeris.planets[jeevaPlanet];
    const jeevaHouse = jeevaData?.house || 1;
    const jeevaSignIdx = jeevaData ? Math.floor(jeevaData.siderealLongitude / 30) : 0;
    const jeevaSign = RASHI_NAMES[jeevaSignIdx].englishName;
    const jeevaDignity = getPlanetDignity(jeevaPlanet, jeevaSignIdx);

    // Sareera (Sub-Lord of the Longitude)
    const subLordInfo = getKpSubSubLord(lon);
    const sareeraPlanet = subLordInfo.subLord;
    const sareeraData = ephemeris.planets[sareeraPlanet];
    const sareeraHouse = sareeraData?.house || 1;
    const sareeraSignIdx = sareeraData ? Math.floor(sareeraData.siderealLongitude / 30) : 0;
    const sareeraSign = RASHI_NAMES[sareeraSignIdx].englishName;
    const sareeraDignity = getPlanetDignity(sareeraPlanet, sareeraSignIdx);

    // Determine vitality grade
    const isJeevaStrong = [1, 4, 5, 7, 9, 10, 11, 2].includes(jeevaHouse) && jeevaDignity !== "Debilitated (नीच)";
    const isSareeraStrong = [1, 2, 4, 5, 7, 9, 10, 11].includes(sareeraHouse) && sareeraDignity !== "Debilitated (नीच)";

    let vitalityGrade: MeenaNadiGrade = "Madhyama (मध्यम - 60%)";
    let potencyScore = 60;

    if (isJeevaStrong && isSareeraStrong) {
      vitalityGrade = "Purna (पूर्ण - 100%)";
      potencyScore = 95;
    } else if (isJeevaStrong && !isSareeraStrong) {
      vitalityGrade = "Madhyama (मध्यम - 60%)";
      potencyScore = 65;
    } else if (!isJeevaStrong && isSareeraStrong) {
      vitalityGrade = "Kshaya (क्षीण - 20%)";
      potencyScore = 35;
    } else {
      vitalityGrade = "Nisphala (निष्फल - 0%)";
      potencyScore = 15;
    }

    const stellarRole = `${planetName} channels life-force via Jeeva (${jeevaPlanet}) in House ${jeevaHouse}, manifesting physically through Sareera (${sareeraPlanet}) in House ${sareeraHouse}.`;
    const fruitOutcome = vitalityGrade.includes("100%")
      ? "Supreme stellar alignment; promises of this planet manifest effortlessly and fully in physical reality."
      : vitalityGrade.includes("60%")
      ? "Strong inner impulse/vision, but requires deliberate perseverance to materialize through the physical vessel."
      : vitalityGrade.includes("20%")
      ? "Outward effort is high, but inner vitality and core stellar support are drained; delays expected."
      : "Stellar friction; results face obstruction or manifest through indirect alternative pathways.";

    planets[planetName] = {
      planetName,
      signName,
      degree: degInSign,
      nakshatraName,
      nakshatraLord: nakLord,
      jeevaPlanet,
      jeevaSign,
      jeevaHouse,
      jeevaDignity,
      sareeraPlanet,
      sareeraSign,
      sareeraHouse,
      sareeraDignity,
      vitalityGrade,
      potencyScore,
      stellarRole,
      fruitOutcome,
    };
  });

  // 6 Domain Promises
  const domainPromises: MeenaNadiDomainPromise[] = [
    {
      domain: "Marriage (Kalatra)",
      primaryKaraka: "Venus",
      jeevaLord: planets.Venus?.jeevaPlanet || "Jupiter",
      sareeraLord: planets.Venus?.sareeraPlanet || "Mercury",
      promiseGrade: planets.Venus?.vitalityGrade || "Madhyama (मध्यम - 60%)",
      nadiGuidance: `Kalatra Jeeva is ${planets.Venus?.jeevaPlanet} (House ${planets.Venus?.jeevaHouse}) with Sareera ${planets.Venus?.sareeraPlanet} (House ${planets.Venus?.sareeraHouse}). Partner brings harmony when mutual stellar dispositors are respected.`,
    },
    {
      domain: "Career (Rajya)",
      primaryKaraka: "Sun",
      jeevaLord: planets.Sun?.jeevaPlanet || "Mars",
      sareeraLord: planets.Sun?.sareeraPlanet || "Saturn",
      promiseGrade: planets.Sun?.vitalityGrade || "Purna (पूर्ण - 100%)",
      nadiGuidance: `Rajya Jeeva ${planets.Sun?.jeevaPlanet} indicates leadership drive, while Sareera ${planets.Sun?.sareeraPlanet} governs structural enterprise.`,
    },
    {
      domain: "Wealth (Dhana)",
      primaryKaraka: "Jupiter",
      jeevaLord: planets.Jupiter?.jeevaPlanet || "Moon",
      sareeraLord: planets.Jupiter?.sareeraPlanet || "Venus",
      promiseGrade: planets.Jupiter?.vitalityGrade || "Purna (पूर्ण - 100%)",
      nadiGuidance: `Dhana Jeeva ${planets.Jupiter?.jeevaPlanet} anchors long-term financial fortune and wisdom.`,
    },
    {
      domain: "Property/Vehicles (Vahana)",
      primaryKaraka: "Mars",
      jeevaLord: planets.Mars?.jeevaPlanet || "Saturn",
      sareeraLord: planets.Mars?.sareeraPlanet || "Venus",
      promiseGrade: planets.Mars?.vitalityGrade || "Madhyama (मध्यम - 60%)",
      nadiGuidance: `Vahana Jeeva ${planets.Mars?.jeevaPlanet} channels tangible asset acquisition and fixed property.`,
    },
    {
      domain: "Progeny (Putra)",
      primaryKaraka: "Jupiter",
      jeevaLord: planets.Jupiter?.jeevaPlanet || "Sun",
      sareeraLord: planets.Jupiter?.sareeraPlanet || "Mercury",
      promiseGrade: planets.Jupiter?.vitalityGrade || "Madhyama (मध्यम - 60%)",
      nadiGuidance: `Putra Jeeva ${planets.Jupiter?.jeevaPlanet} blesses intellectual legacy and noble lineage.`,
    },
    {
      domain: "Health (Deha)",
      primaryKaraka: "Moon",
      jeevaLord: planets.Moon?.jeevaPlanet || "Ketu",
      sareeraLord: planets.Moon?.sareeraPlanet || "Jupiter",
      promiseGrade: planets.Moon?.vitalityGrade || "Purna (पूर्ण - 100%)",
      nadiGuidance: `Deha Jeeva ${planets.Moon?.jeevaPlanet} regulates constitutional vitality and metabolic rhythm.`,
    },
  ];

  // Check Vipat (3rd), Pratyak (5th), Vadha (7th) Tara afflictions
  const vipatPratyakVadhaAfflictions: string[] = [];
  Object.values(planets).forEach((p) => {
    const pNakIdx = NAKSHATRA_NAMES.findIndex((n) => n.sanskritName === p.nakshatraName);
    if (pNakIdx >= 0) {
      const taraOffset = ((pNakIdx - moonNakIdx + 27) % 9) + 1;
      if (taraOffset === 3) {
        vipatPratyakVadhaAfflictions.push(`${p.planetName} resides in Vipat Tara (विपत् - 3rd Star) -> Indicates danger of sudden hurdles in its domain.`);
      } else if (taraOffset === 5) {
        vipatPratyakVadhaAfflictions.push(`${p.planetName} resides in Pratyak Tara (प्रत्यक् - 5th Star) -> Requires extra caution against obstacles/opposition.`);
      } else if (taraOffset === 7) {
        vipatPratyakVadhaAfflictions.push(`${p.planetName} resides in Vadha Tara (वध - 7th Star) -> Intense karmic clearing required before fruits manifest.`);
      }
    }
  });

  const purnaCount = Object.values(planets).filter((p) => p.vitalityGrade.includes("100%")).length;
  const masterMeenaSynthesis = `Meena Nadi Stellar Evaluation reveals ${purnaCount} Grahas in Purna (100%) Jeeva-Sareera alignment. Primary life themes are steered by Jeeva lords delivering fruit through physical Sareera vessels with high structural stability.`;

  return {
    planets,
    domainPromises,
    vipatPratyakVadhaAfflictions,
    masterMeenaSynthesis,
  };
}
