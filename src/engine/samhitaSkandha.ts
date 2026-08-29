/**
 * Acharya Sadananda's Samhita Skandha (संहिता स्कन्ध) Engine
 * Primordial Treatise of Astrometeorology, Mundane Horoscopy & Commodity Pricing
 *
 * Core Classical Pillars:
 * 1. Planetary Cabinet of the Year (Raja, Mantri, Senadhipati, Sasyesha).
 * 2. Megha Garbhadhana & Varsha Yoga (Cloud Gestation & Astrometeorological Rainfall).
 * 3. 4 Seismic Wind Mandalas & Earthly Portents (Vayavya, Agneya, Varuna, Aindra).
 * 4. Argha Krama & Commodity Economic Trends (Gold, Silver, Oil, Grains, Copper, Tech).
 */

import {
  EphemerisResult,
  SamhitaSkandhaAnalysis,
  SamhitaCabinet,
  SamhitaVarshaAstrometeorology,
  SamhitaSeismicMandala,
  SamhitaCommodityTrend,
} from "./types";
import { RASHI_NAMES } from "./constants";

export function evaluateSamhitaSkandha(natalEphemeris: EphemerisResult): SamhitaSkandhaAnalysis {
  // 1. Planetary Cabinet
  const varaLord = natalEphemeris.panchanga.vara.lord || "Sun";
  const sunPlanet = natalEphemeris.planets.Sun;
  const sunSignIdx = sunPlanet ? Math.floor(sunPlanet.siderealLongitude / 30) : 0;

  const KING_PLANET = varaLord;
  const MINISTER_PLANET = ["Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Sun"][(sunSignIdx + 2) % 7];
  const COMMANDER_PLANET = "Mars";
  const SASYESHA_PLANET = ["Moon", "Venus", "Mercury", "Jupiter"][sunSignIdx % 4];

  const KING_EFFECTS: Record<string, string> = {
    Sun: "Raja Surya: Authoritative national governance, heightened administrative discipline, and strong public policy.",
    Moon: "Raja Chandra: Agricultural bounty, high public emotional welfare, oceanic trade expansion, and peaceful diplomacy.",
    Mars: "Raja Mangala: Aggressive geopolitical posturing, military modernization, infrastructure booms, and heightened wildfire vigilance.",
    Mercury: "Raja Budha: Explosive technological innovation, booming commerce, financial market growth, and intellectual treaties.",
    Jupiter: "Raja Guru: Golden age of legal integrity, spiritual resurgence, economic prosperity, and educational triumphs.",
    Venus: "Raja Shukra: Artistic Renaissance, luxury industry boom, abundant monsoon showers, and cultural diplomacy.",
    Saturn: "Raja Shani: Labor empowerment, industrial infrastructure expansion, structural austerity, and steady enduring reforms.",
  };

  const planetaryCabinet: SamhitaCabinet = {
    kingPlanet: KING_PLANET,
    kingEffect: KING_EFFECTS[KING_PLANET] || "Balanced governance and steady national progress.",
    ministerPlanet: MINISTER_PLANET,
    ministerEffect: `Mantri ${MINISTER_PLANET}: Directs economic policy, treasury allocations, and strategic state negotiations.`,
    commanderPlanet: COMMANDER_PLANET,
    commanderEffect: "Senadhipati Mars: Guards terrestrial defense, cybersecurity borders, and physical integrity.",
    sasyeshaPlanet: SASYESHA_PLANET,
    sasyeshaEffect: `Sasyesha ${SASYESHA_PLANET}: Blesses food grains, organic agriculture, and crop yields with vitality.`,
    governingYearRuler: `${KING_PLANET} (King) & ${MINISTER_PLANET} (Prime Minister)`,
  };

  // 2. Megha Garbhadhana & Varsha Yoga
  const moonPlanet = natalEphemeris.planets.Moon;
  const venPlanet = natalEphemeris.planets.Venus;
  const jupPlanet = natalEphemeris.planets.Jupiter;
  const mercPlanet = natalEphemeris.planets.Mercury;

  let rainScore = 55;
  const JALA_RASHIS = [3, 7, 11]; // Cancer, Scorpio, Pisces

  if (moonPlanet && JALA_RASHIS.includes(Math.floor(moonPlanet.siderealLongitude / 30))) rainScore += 16;
  if (venPlanet && JALA_RASHIS.includes(Math.floor(venPlanet.siderealLongitude / 30))) rainScore += 14;
  if (jupPlanet && JALA_RASHIS.includes(Math.floor(jupPlanet.siderealLongitude / 30))) rainScore += 12;
  if (mercPlanet && JALA_RASHIS.includes(Math.floor(mercPlanet.siderealLongitude / 30))) rainScore += 10;

  rainScore = Math.max(25, Math.min(95, rainScore));

  const precipitationGrade: SamhitaVarshaAstrometeorology["precipitationGrade"] =
    rainScore >= 80
      ? "Abundant Monsoon (अतिवृष्टि)"
      : rainScore >= 60
      ? "Normal Bountiful (सुवृष्टि)"
      : rainScore >= 40
      ? "Moderate Selective (मध्यम)"
      : "Deficit Drought Risk (अनावृष्टि)";

  const varshaAstrology: SamhitaVarshaAstrometeorology = {
    rainfallScore: rainScore,
    precipitationGrade,
    meghaGarbhaStatus: rainScore >= 60
      ? "Strong Cloud Gestation (शुभ मेघ गर्भ): Watery planets reinforce atmospheric moisture and convective precipitation."
      : "Dry Atmospheric Ingress: Heat currents dominate; requires water conservation.",
    rohiniIngressEffect: "Solar Rohini Ingress indicates balanced ground moisture and healthy germination of crops (Samhita Skandha).",
    ardraIngressEffect: "Solar Ardra Ingress triggers active thunderstorms, lightning, and refreshing monsoon deluges.",
    classicalShloka: "Samhita Skandha (Varsha Adhyaya) Shloka 18",
  };

  // 3. 4 Seismic Wind Mandalas & Earthly Portents
  const satPlanet = natalEphemeris.planets.Saturn;
  const rahuPlanet = natalEphemeris.planets.Rahu;
  const marsPlanet = natalEphemeris.planets.Mars;

  const vayavyaRisk = satPlanet?.isRetrograde || rahuPlanet ? "Elevated Risk" : "Low / Serene";
  const agneyaRisk = marsPlanet?.isRetrograde ? "Elevated Risk" : "Low / Serene";
  const varunaRisk = rainScore >= 75 ? "Elevated Risk" : "Low / Serene";
  const aindraRisk = "Low / Serene";

  const seismicMandalas: SamhitaSeismicMandala[] = [
    {
      mandalaName: "Vayavya Mandala (Wind)",
      sanskritTitle: "वायव्य मण्डल (Atmospheric & Wind Disturbance)",
      governingPlanets: ["Saturn", "Rahu"],
      riskLevel: vayavyaRisk,
      geographicVulnerability: "Northwestern terrains, coastal storm corridors, and elevated plateau regions.",
      phenomenonDescription: "High cyclonic wind velocity, atmospheric pressure swings, and wind-triggered seismic tremors.",
    },
    {
      mandalaName: "Agneya Mandala (Fire/Volcanic)",
      sanskritTitle: "आग्नेय मण्डल (Thermal & Volcanic Energy)",
      governingPlanets: ["Mars", "Sun"],
      riskLevel: agneyaRisk,
      geographicVulnerability: "Southeastern tectonic belts, volcanic arcs, and arid mineral valleys.",
      phenomenonDescription: "Thermal crustal expansion, geothermal pressure releases, and forest fire vulnerabilities.",
    },
    {
      mandalaName: "Varuna Mandala (Water/Hydrological)",
      sanskritTitle: "वरुण मण्डल (Oceanic & Hydrological Shifts)",
      governingPlanets: ["Moon", "Venus"],
      riskLevel: varunaRisk,
      geographicVulnerability: "Western coastlines, river basins, estuaries, and maritime islands.",
      phenomenonDescription: "High-tide tidal surges, localized flood warnings, and oceanic atmospheric depressions.",
    },
    {
      mandalaName: "Aindra Mandala (Tectonic)",
      sanskritTitle: "ऐन्द्र मण्डल (Deep Crustal & Tectonic Stability)",
      governingPlanets: ["Jupiter", "Mercury"],
      riskLevel: aindraRisk,
      geographicVulnerability: "Eastern mountain ranges and central continental shields.",
      phenomenonDescription: "Stable tectonic anchoring; low subterranean disturbance with fertile soil regeneration.",
    },
  ];

  // 4. Argha Krama & Commodity Economic Index
  const arghaCommodities: SamhitaCommodityTrend[] = [
    {
      commodityName: "Gold (स्वर्ण)",
      governingPlanet: "Sun & Jupiter",
      trend: (jupPlanet && [1, 4, 7, 10, 5, 9].includes(jupPlanet.house)) ? "Strongly Bullish (तेजी / Rises)" : "Mild Uptrend (स्थिर लाभ)",
      projectedPriceFactor: 1.18,
      classicalArghaReasoning: "Jupiter in auspicious Kendra/Trikona strengthens sovereign reserve demand and precious yellow metal valuations (Adhyaya 22).",
    },
    {
      commodityName: "Silver (रजत)",
      governingPlanet: "Moon & Venus",
      trend: (venPlanet && [1, 4, 7, 10, 5, 9].includes(venPlanet.house)) ? "Strongly Bullish (तेजी / Rises)" : "Mild Uptrend (स्थिर लाभ)",
      projectedPriceFactor: 1.14,
      classicalArghaReasoning: "Venus and Moon dignity fuels industrial and decorative silver consumption and liquid asset accumulation.",
    },
    {
      commodityName: "Crude Oil & Energy (खनिज तैल)",
      governingPlanet: "Saturn & Rahu",
      trend: (satPlanet?.isRetrograde || rahuPlanet) ? "Volatile (चंचल)" : "Mild Uptrend (स्थिर लाभ)",
      projectedPriceFactor: 1.10,
      classicalArghaReasoning: "Saturnian heavy subterranean energy indicates supply-chain restructuring and dynamic hydrocarbon pricing.",
    },
    {
      commodityName: "Agricultural Grains & Food (धान्य)",
      governingPlanet: "Moon & Mercury",
      trend: rainScore >= 60 ? "Mild Uptrend (स्थिर लाभ)" : "Strongly Bullish (तेजी / Rises)",
      projectedPriceFactor: 1.06,
      classicalArghaReasoning: "Sasyesha Lord and healthy cloud gestation ensure bountiful harvests, stabilizing consumer food grain markets.",
    },
    {
      commodityName: "Copper & Base Metals (ताम्र)",
      governingPlanet: "Mars",
      trend: marsPlanet && [1, 10].includes(marsPlanet.house) ? "Strongly Bullish (तेजी / Rises)" : "Mild Uptrend (स्थिर लाभ)",
      projectedPriceFactor: 1.12,
      classicalArghaReasoning: "Martian engineering vigor accelerates manufacturing, electrical infrastructure, and copper off-take.",
    },
    {
      commodityName: "Technology & Semiconductors (विद्या/यन्त्र)",
      governingPlanet: "Mercury & Rahu",
      trend: mercPlanet && [1, 4, 5, 10].includes(mercPlanet.house) ? "Strongly Bullish (तेजी / Rises)" : "Volatile (चंचल)",
      projectedPriceFactor: 1.22,
      classicalArghaReasoning: "Mercury in an intellectual angle triggers rapid adoption of microchips, AI hardware, and digital communication networks.",
    },
  ];

  // Master Synthesis
  const masterSamhitaSynthesis = `Acharya Sadananda's Samhita Skandha confirms **King of the Year: ${KING_PLANET}** and **Prime Minister: ${MINISTER_PLANET}**. **Varsha Index: ${rainScore}% (${precipitationGrade})** indicating ${rainScore >= 60 ? "bountiful agricultural yields" : "selective rainfall requiring strategic conservation"}. Commodity Markets exhibit **Bullish trends in Gold, Tech & Metals**, with ${seismicMandalas.find((m) => m.riskLevel !== "Low / Serene")?.mandalaName || "All 4 Seismic Mandalas in Serene Balance"}.`;

  return {
    planetaryCabinet,
    varshaAstrology,
    seismicMandalas,
    arghaCommodities,
    masterSamhitaSynthesis,
  };
}
