/**
 * Classical Rashi Tulya Navamsha (RTN) & Navamsha Tulya Rashi (NTR) Engine
 * References:
 * - Deva Keralam (Chandra Kala Nadi - देव केरलम् / चन्द्र कला नाड़ी)
 * - Brihat Parashara Hora Shastra (BPHS - Adhyaya on Navamsha Phala)
 * - C.S. Patel: "Navamsha in Astrology" & "Nadi Astrology"
 * - Maharshi Bhrigu & Jaimini Sutras (64th Navamsha & Kharas)
 */

import { EphemerisResult, RashiInfo } from "./types";
import { RASHI_NAMES } from "./constants";

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

export interface RashiTulyaNavamshaResult {
  d1LagnaRashi: RashiInfo;
  d9LagnaRashi: RashiInfo;
  planets: Record<string, PlanetRtnDetail>;
  rtnConjunctions: RtnConjunction[];
  kharaNavamsha: KharaNavamshaInfo;
  activeTransitActivations: RtnTransitActivation[];
  karmicSynthesis: string;
}

const NAVAMSHA_SPAN = 360 / 108; // 3.3333333333°

export function getD9RashiIndex(longitude: number): number {
  const norm = ((longitude % 360) + 360) % 360;
  return Math.floor(norm / NAVAMSHA_SPAN) % 12;
}

export function evaluateRashiTulyaNavamsha(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult
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

  for (const [pName, pData] of Object.entries(natalEphem.planets)) {
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

  // Synthesis
  const karmicSynthesis = [
    `Rashi Tulya Navamsha projects your D-9 soul reality onto D-1 earthly houses.`,
    `Key highlights: ${Object.values(planets).map((p) => `${p.planetName} -> RTN H${p.rtnHouseFromD1Lagna} (${p.d9Rashi.englishName})`).join(", ")}.`,
  ].join(" ");

  return {
    d1LagnaRashi,
    d9LagnaRashi,
    planets,
    rtnConjunctions,
    kharaNavamsha,
    activeTransitActivations,
    karmicSynthesis,
  };
}

export function generateRashiTulyaNavamshaSummary(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult
): string {
  const rtn = evaluateRashiTulyaNavamsha(natalEphem, transitEphem);

  const lines: string[] = [
    "### 🌸 RASHI TULYA NAVAMSHA (RTN) & CROSS-VARGA PROJECTION DOSSIER (DEVA KERALAM & C.S. PATEL):",
    `- **D-1 Lagna (Physical Setup):** ${rtn.d1LagnaRashi.englishName} (${rtn.d1LagnaRashi.sanskritName})`,
    `- **D-9 Navamsha Lagna (Inner Soul Core):** ${rtn.d9LagnaRashi.englishName} (${rtn.d9LagnaRashi.sanskritName})`,
    "",
    "#### 🌟 1. PLANETARY RASHI TULYA NAVAMSHA (RTN) MAPPING:",
    ...Object.values(rtn.planets).map(
      (p) =>
        `- **${p.planetName}:** D1 House ${p.d1HouseFromLagna} (${p.d1Rashi.englishName}) ──► D9 Navamsha in **${p.d9Rashi.englishName}** ──► **RTN House ${p.rtnHouseFromD1Lagna}**${p.isVargottama ? " (👑 VARGOTTAMA)" : ""} | *${p.rtnHouseSignificance}*`
    ),
    "",
    "#### 🪢 2. RTN CONJUNCTIONS & HIDDEN SOUL BONDS:",
    ...(rtn.rtnConjunctions.length > 0
      ? rtn.rtnConjunctions.map((c) => `- **House ${c.houseNumber} (${c.rashi.englishName}):** ${c.planets.join(" + ")} ──► ${c.interpretation}`)
      : ["- No multi-planet conjunctions in RTN; individual planetary house influences operate independently."]),
    "",
    "#### ⚠️ 3. 64TH NAVAMSHA (KHARA NAVAMSHA) INTEGRITY CHECK:",
    `- **64th Navamsha from Moon:** **${rtn.kharaNavamsha.moon64thNavamshaRashi.englishName}** (RTN House ${rtn.kharaNavamsha.moon64thRtnHouse})`,
    `- **64th Navamsha from Lagna:** **${rtn.kharaNavamsha.lagna64thNavamshaRashi.englishName}** (RTN House ${rtn.kharaNavamsha.lagna64thRtnHouse})`,
    `- **Live Transit Status:** ${rtn.kharaNavamsha.kharaWarningSummary}`,
    "",
    "#### 🚀 4. RTN PREDICTIVE TRANSIT TRIGGERS (GOCHAR ACTIVATION):",
    ...rtn.activeTransitActivations.map(
      (t) =>
        `- **${t.triggerType}:** ${t.targetPlanet} in RTN ${t.rtnRashiName} (House ${t.rtnHouseNumber}) ──► ${t.isCurrentlyActive ? "⚡ **CURRENTLY ACTIVE IN TRANSIT**" : "⏳ Future Trigger"} | ${t.eventForecast}`
    ),
  ];

  return lines.join("\n");
}
