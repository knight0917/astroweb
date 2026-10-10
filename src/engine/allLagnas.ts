/**
 * Classical 15-Lagna Unified Ascendant Matrix Engine
 * 
 * References:
 * - Brihat Parashara Hora Shastra (BPHS Ch. 4 & 5 - Lagnas & Special Lagnas)
 * - Maharishi Jaimini Upadesha Sutras (Adhyaya 1, Padas & Karakamsha)
 * - Classical Panchanga & Kala Ray Shastras (Indu Lagna)
 * - Phaladeepika & Jataka Parijata (Paka Lagna, Chandra Lagna, Surya Lagna)
 */

import { EphemerisResult, RashiInfo, NakshatraInfo } from "./types";
import { getRashi, getNakshatra, getHouse, formatDMS } from "./rashiNakshatra";
import { evaluateBphsCore } from "./bphsCore";
import { calculateArudhaPadas, calculateJaiminiKarakas } from "./jaimini";
import { calculateMedhajInduLagna } from "./medhajInduLagna";
import { calculateVargaSign } from "./shodashavarga";

export type LagnaSystem =
  | "Parashari Core"
  | "Jaimini Sutras"
  | "BPHS Special"
  | "Wealth & Kala"
  | "Divisional D9";

export interface UnifiedLagnaInfo {
  id: string;
  code: string;
  name: string;
  sanskritName: string;
  system: LagnaSystem;
  siderealLongitude: number;
  formattedLongitude: string;
  rashi: RashiInfo;
  nakshatra: NakshatraInfo;
  house: number; // 1..12 from Janma Lagna
  symbol: string;
  color: string;
  signification: string;
  dossierDescription: string;
}

/**
 * Calculates all 15 Classical and Special Lagnas for the given birth horoscope.
 */
export function calculateAllLagnas(ephem: EphemerisResult): UnifiedLagnaInfo[] {
  const ascLon = ephem.ascendant.siderealLongitude;
  const ascSignIdx = Math.floor(ascLon / 30);
  const ascDegreeInSign = ascLon % 30;

  const sunLon = ephem.planets.Sun?.siderealLongitude || 0;
  const moonLon = ephem.planets.Moon?.siderealLongitude || 0;

  // 1. Core Parashari engines
  const bphsReport = evaluateBphsCore(ephem);
  const arudhaPadas = calculateArudhaPadas(ephem);
  const induReport = calculateMedhajInduLagna(ephem);
  const jaiminiKarakas = calculateJaiminiKarakas(ephem);
  const akPlanet = ephem.planets[jaiminiKarakas.atmakaraka.planetId];
  const akLon = akPlanet ? akPlanet.siderealLongitude : 0;

  // 2. Helper to construct a UnifiedLagnaInfo entry
  const buildLagna = (
    id: string,
    code: string,
    name: string,
    sanskritName: string,
    system: LagnaSystem,
    rawLon: number,
    symbol: string,
    color: string,
    signification: string,
    dossierDescription: string
  ): UnifiedLagnaInfo => {
    const normLon = ((rawLon % 360) + 360) % 360;
    const rashi = getRashi(normLon);
    const nakshatra = getNakshatra(normLon);
    const house = getHouse(normLon, ascLon);

    return {
      id,
      code,
      name,
      sanskritName,
      system,
      siderealLongitude: normLon,
      formattedLongitude: formatDMS(normLon),
      rashi,
      nakshatra,
      house,
      symbol,
      color,
      signification,
      dossierDescription,
    };
  };

  // 1. Janma Lagna (Ascendant)
  const janmaLagna = buildLagna(
    "Lagna_Janma",
    "ASC",
    "Janma Lagna (Ascendant)",
    "जन्म लग्न (उदय लग्न)",
    "Parashari Core",
    ascLon,
    "ASC",
    "#10b981",
    "Physical constitution, vitality, primary incarnation purpose, temperament, and worldly emergence.",
    "The primary eastern horizon rising degree at birth. Anchors the 1st house and serves as the fundamental frame of reference for all bhava calculations."
  );

  // 2. Chandra Lagna (Moon Ascendant)
  const chandraLagna = buildLagna(
    "Lagna_Chandra",
    "CHL",
    "Chandra Lagna (Moon)",
    "चन्द्र लग्न (मनस लग्न)",
    "Parashari Core",
    moonLon,
    "☽",
    "#38bdf8",
    "Psychological disposition, emotional mind (Manas), memory patterns, and subjective experiential reality.",
    "Moon's exact sidereal position treated as the 1st house. Reveals how the native internally perceives circumstances and processes life events."
  );

  // 3. Surya Lagna (Sun Ascendant)
  const suryaLagna = buildLagna(
    "Lagna_Surya",
    "SYL",
    "Surya Lagna (Sun)",
    "सूर्य लग्न (आत्म लग्न)",
    "Parashari Core",
    sunLon,
    "☉",
    "#f59e0b",
    "Soul's conscious purpose, external social authority, vitality, father archetype, and public sovereignty.",
    "Sun's exact sidereal position treated as the 1st house. Indicates constitutional vitality and direct expression of will, dignity, and career stature."
  );

  // 4. Paka Lagna (Seat of Lagna Lord)
  const lagneshaName = ephem.ascendant.rashi.lord;
  const lagneshaPlanet = ephem.planets[lagneshaName];
  const pakaLon = lagneshaPlanet ? lagneshaPlanet.siderealLongitude : ascLon;
  const pakaLagna = buildLagna(
    "Lagna_Paka",
    "PAKA",
    "Paka Lagna (Operating Intelligence)",
    "पाक लग्न (लग्नेश स्थिति)",
    "Parashari Core",
    pakaLon,
    "🧠",
    "#8b5cf6",
    "Active physical execution, conscious decision-making, where the native applies their intelligence and energy.",
    `Sign and degree where Lagna Lord (${lagneshaName}) resides. While Janma Lagna is potential, Paka Lagna is the active operational ground where real-world actions are carried out.`
  );

  // 5. Arudha Lagna (AL / Pada Lagna)
  const alPada = arudhaPadas.find((p) => p.code === "AL") || arudhaPadas[0];
  const alLon = alPada ? (alPada.padaSignIndex * 30 + ascDegreeInSign) % 360 : ascLon;
  const arudhaLagna = buildLagna(
    "Lagna_AL",
    "AL",
    "Arudha Lagna (AL)",
    "आरूढ़ लग्न (पद लग्न)",
    "Jaimini Sutras",
    alLon,
    "AL",
    "#06b6d4",
    "External image, societal perception, reputation, worldly manifestation, and perceived status.",
    "Calculated via Maharishi Jaimini's mirror-reflection formula (Sutras 1.1.30–31). Measures how society perceives the native's standing, independent of private reality."
  );

  // 6. Upapada Lagna (UL / Gauna Pada)
  const ulPada = arudhaPadas.find((p) => p.code === "UL") || arudhaPadas[11];
  const ulLon = ulPada ? (ulPada.padaSignIndex * 30 + ascDegreeInSign) % 360 : ascLon;
  const upapadaLagna = buildLagna(
    "Lagna_UL",
    "UL",
    "Upapada Lagna (UL)",
    "उपपद लग्न (गौण पद)",
    "Jaimini Sutras",
    ulLon,
    "UL",
    "#ec4899",
    "Marriage durability, spouse lineage and background, marital longevity, and mutual relationship sacrifice.",
    "The Arudha of the 12th house in Jaimini astrology. Primary indicator of marriage stability, spouse family background, and the spiritual cost of companionship."
  );

  // 7. Hora Lagna (HL)
  const hlLon = bphsReport.specialLagnas.horaLagna.longitude;
  const horaLagna = buildLagna(
    "Lagna_HL",
    "HL",
    "Hora Lagna (HL)",
    "होरा लग्न (धन चक्र)",
    "BPHS Special",
    hlLon,
    "HL",
    "#eab308",
    "Financial accumulation, liquid wealth, monetizable assets, and Dhana Yoga prosperity clock.",
    "Brihat Parashara Hora Shastra Chapter 5 special ascendant derived by advancing 30° per hour from sunrise. Crucial for assessing financial sovereignty and windfall gain."
  );

  // 8. Ghatika Lagna (GL)
  const glLon = bphsReport.specialLagnas.ghatikaLagna.longitude;
  const ghatikaLagna = buildLagna(
    "Lagna_GL",
    "GL",
    "Ghatika Lagna (GL)",
    "घटिका लग्न (सत्ता चक्र)",
    "BPHS Special",
    glLon,
    "GL",
    "#f97316",
    "Administrative authority, government honors, political influence, executive leadership, and Raja Yogas.",
    "BPHS Chapter 5 ascendant advancing 75° per hour (1 sign per Ghatika) from sunrise. Primary clock for executive command, promotions, and state recognition."
  );

  // 9. Shree Lagna (SL)
  const slLon = bphsReport.specialLagnas.shreeLagna.longitude;
  const shreeLagna = buildLagna(
    "Lagna_SL",
    "SL",
    "Shree Lagna (SL)",
    "श्री लग्न (लक्ष्मी कृपा)",
    "BPHS Special",
    slLon,
    "SL",
    "#14b8a6",
    "Blessings of Goddess Lakshmi, effortless abundance, marital prosperity, and unearned grace.",
    "BPHS Chapter 5 special ascendant linking Moon's Nakshatra span to the Ascendant. Key to inherited or effortless prosperity and divine protection from destitution."
  );

  // 10. Indu Lagna (IL)
  const ilLon = induReport.induLagnaLongitude;
  const induLagna = buildLagna(
    "Lagna_IL",
    "IL",
    "Indu Lagna (Moon-Ray Wealth)",
    "इन्दु लग्न (कला धन चक्र)",
    "Wealth & Kala",
    ilLon,
    "IL",
    "#a855f7",
    "Moon-Ray wealth matrix, multigenerational assets, and sudden capital inflows during activating dashas.",
    `Classical Moon-Ray (Kala) wealth point summing 9th lords from Lagna and Moon (Total Kalas: ${induReport.totalKalas}). Occupants and aspects define commercial empire potential.`
  );

  // 11. Bhava Lagna (BL)
  const blLon = bphsReport.specialLagnas.bhavaLagna.longitude;
  const bhavaLagna = buildLagna(
    "Lagna_BL",
    "BL",
    "Bhava Lagna (BL)",
    "भाव लग्न (शारीरिक सामर्थ्य)",
    "BPHS Special",
    blLon,
    "BL",
    "#ef4444",
    "Physical constitution stamina, somatic immunity, metabolic vitality, and longevity potential.",
    "BPHS Chapter 5 ascendant advancing 15° per hour from sunrise. Measures bodily resistance to acute illness and longevity reservoir."
  );

  // 12. Varnada Lagna (VL)
  const vlLon = bphsReport.specialLagnas.varnadaLagna.longitude;
  const varnadaLagna = buildLagna(
    "Lagna_VL",
    "VL",
    "Varnada Lagna (VL)",
    "वर्णद लग्न (कर्मक्षेत्र पद)",
    "BPHS Special",
    vlLon,
    "VL",
    "#6366f1",
    "Professional hierarchy, vocational duty (Varna karma), social status, and professional relationships.",
    "BPHS Chapter 5 ascendant evaluating how the native navigates workplace hierarchy, institutional governance, and career duties."
  );

  // 13. Karakamsha Lagna (KL)
  const klSignIdx = calculateVargaSign(akLon, "D9");
  const klLon = (klSignIdx * 30 + (akLon % 30)) % 360;
  const karakamshaLagna = buildLagna(
    "Lagna_KL",
    "KL",
    "Karakamsha Lagna (KL)",
    "कारकांश लग्न (आत्म उद्देश्य)",
    "Divisional D9",
    klLon,
    "KL",
    "#d946ef",
    "Navamsha sign of Atmakaraka; reveals the soul's supreme spiritual calling, career in D9, and Moksha gate.",
    `Navamsha (D9) sign of Atmakaraka ${jaiminiKarakas.atmakaraka.planetName}. The 12th house from Karakamsha determines Ishta Devata and the pathway to spiritual liberation.`
  );

  // 14. Swamsha Lagna (D9 Ascendant)
  const swamshaSignIdx = calculateVargaSign(ascLon, "D9");
  const swamshaLon = (swamshaSignIdx * 30 + ascDegreeInSign) % 360;
  const swamshaLagna = buildLagna(
    "Lagna_Swamsha",
    "SWAMSHA",
    "Swamsha Lagna (D9 Lagna)",
    "स्वांश लग्न (नवमांश उदय)",
    "Divisional D9",
    swamshaLon,
    "SW",
    "#0284c7",
    "Innate soul talents, spiritual core persona, internal wiring, and marital/dharma fruition.",
    "Navamsha (D9) rising sign. Represents the native's true spiritual persona, latent dharmic capabilities, and inner maturity after marriage/middle age."
  );

  // 15. Madhya Lagna (Midheaven / MC)
  const mcLon = ephem.midheaven.siderealLongitude;
  const madhyaLagna = buildLagna(
    "Lagna_MC",
    "MC",
    "Madhya Lagna (Midheaven / MC)",
    "मध्य लग्न (दशम भाव मध्य)",
    "Parashari Core",
    mcLon,
    "MC",
    "#f59e0b",
    "Zenith of public visibility, highest career achievement, executive reputation, and worldly karma.",
    "The exact 10th house cusp (Medium Coeli / MC) on the local meridian. Points to the pinnacle of public achievement, recognition, and societal impact."
  );

  return [
    janmaLagna,
    chandraLagna,
    suryaLagna,
    pakaLagna,
    arudhaLagna,
    upapadaLagna,
    horaLagna,
    ghatikaLagna,
    shreeLagna,
    induLagna,
    bhavaLagna,
    varnadaLagna,
    karakamshaLagna,
    swamshaLagna,
    madhyaLagna,
  ];
}

/**
 * Convenience helper to find a specific lagna by its unique id or code.
 */
export function getLagnaById(
  lagnas: UnifiedLagnaInfo[],
  idOrCode: string
): UnifiedLagnaInfo | undefined {
  return lagnas.find(
    (l) =>
      l.id.toLowerCase() === idOrCode.toLowerCase() ||
      l.code.toLowerCase() === idOrCode.toLowerCase()
  );
}
