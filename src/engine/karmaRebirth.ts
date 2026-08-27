/**
 * Classical Karma and Rebirth Engine (कर्म एवं पुनर्जन्म सिद्धान्त)
 * Reference:
 * - "Karma & Rebirth in Hindu Astrology" by K.N. Rao (Kotamraju Narayana Rao)
 * - Brihat Parashara Hora Shastra (D3 Dreshkona, D60 Shashtiamsha, Purva Punya)
 * - Brihat Jataka (Varahamihira on Loka of Descent & Next Life)
 */

import { EphemerisResult, RashiInfo } from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateShodashavargaChart } from "./shodashavarga";

export interface QuadKarmaReport {
  sanchita: {
    name: string;
    sanskritName: string;
    description: string;
    astrologicalLocus: string;
    status: string;
  };
  prarabdha: {
    name: string;
    sanskritName: string;
    description: string;
    astrologicalLocus: string;
    status: string;
  };
  kriyamana: {
    name: string;
    sanskritName: string;
    description: string;
    astrologicalLocus: string;
    scorePercent: number;
    status: string;
  };
  agama: {
    name: string;
    sanskritName: string;
    description: string;
    astrologicalLocus: string;
    scorePercent: number;
    status: string;
  };
}

export interface LokaOfDescent {
  strongerLuminary: "Sun" | "Moon";
  luminaryLongitude: number;
  d3SignIndex: number;
  d3SignName: string;
  d3Lord: string;
  lokaName: string;
  sanskritLoka: string;
  realmDescription: string;
  spiritualHeritage: string;
}

export interface KhareshReport {
  d3LagnaSignIndex: number;
  d3LagnaSignName: string;
  twentySecondDreshkonaSignIndex: number; // 8th from D3 Lagna
  twentySecondDreshkonaSignName: string;
  khareshLord: string;
  khareshHouseInD1: number;
  vulnerabilityTheme: string;
  remedialAdvice: string;
}

export interface PurvaPunyaReport {
  fifthHouseSign: string;
  fifthLord: string;
  fifthHouseOccupants: string[];
  ninthHouseSign: string;
  ninthLord: string;
  ninthHouseOccupants: string[];
  purvaPunyaScore: number; // 0-100%
  pastSadhanaMerits: string;
  rinanubandhanaChildrenDebts: string;
  guruDharmaArmor: string;
}

export interface RahuKetuAxisReport {
  ketuHouse: number;
  ketuSign: string;
  ketuPastMastery: string;
  ketuPastDebts: string;
  rahuHouse: number;
  rahuSign: string;
  rahuFutureFrontier: string;
  rahuKarmicGrowthTask: string;
}

export interface RetrogradeContract {
  planet: string;
  house: number;
  sign: string;
  unfinishedLesson: string;
  karmicResolution: string;
}

export interface KarmaRebirthReport {
  quadKarma: QuadKarmaReport;
  lokaOfDescent: LokaOfDescent;
  kharesh: KhareshReport;
  purvaPunya: PurvaPunyaReport;
  rahuKetuAxis: RahuKetuAxisReport;
  retrogradeContracts: RetrogradeContract[];
  masterKarmicSynthesis: string;
}

const RASHI_LORD_NAMES = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

const LOKA_MAP: Record<string, { loka: string; sanskrit: string; desc: string; heritage: string }> = {
  Sun: {
    loka: "Deva Loka (Realm of the Solar Immortals)",
    sanskrit: "देवलोक (सूर्य मण्डल)",
    desc: "Descent from the realm of light, divine administrators, and soul radiance.",
    heritage: "Innate spiritual nobility, natural leadership, and high ethical standard carried from past service.",
  },
  Mars: {
    loka: "Agni Loka (Realm of Radiant Warriors & Sages)",
    sanskrit: "अग्नि लोक / देवलोक",
    desc: "Descent from realms of fiery will, cosmic defenders, and intense spiritual penance (Tapasya).",
    heritage: "Courage, sharp executive instinct, and duty to protect righteousness and truth.",
  },
  Moon: {
    loka: "Pitri Loka (Realm of Compassionate Ancestors)",
    sanskrit: "पितृलोक / सोम मण्डल",
    desc: "Descent from the realm of nourishing ancestors, emotional nectar, and psychic memory.",
    heritage: "Deep intuition, unconditional devotion, compassionate healing ability, and familial bonding.",
  },
  Venus: {
    loka: "Gandharva / Pitri Loka (Realm of Sacred Aesthetics & Harmony)",
    sanskrit: "गन्धर्व लोक / पितृलोक",
    desc: "Descent from celestial abodes of harmonic resonance, divine arts, and devotional beauty.",
    heritage: "Refined aesthetic sensibilities, grace in relationships, and capacity for devotion.",
  },
  Jupiter: {
    loka: "Brahma Loka / Rishi Loka (Highest Divine Sages Realm)",
    sanskrit: "ब्रह्मलोक / ऋषि मण्डल",
    desc: "Descent from the highest realms of enlightened preceptors, Vedic masters, and supreme wisdom.",
    heritage: "Spiritual wisdom, reverence for sacred truth, teaching ability, and divine protection.",
  },
  Mercury: {
    loka: "Bhu Loka / Gandharva Loka (Realm of Intellectual Quests)",
    sanskrit: "भूलोक / बुध मण्डल",
    desc: "Descent from cultured earthly or celestial spheres of scholarship, trade, and learning.",
    heritage: "Sharp intellect, analytical curiosity, linguistic eloquence, and versatile communication.",
  },
  Saturn: {
    loka: "Yama Loka / Tapas Loka (Realm of Strict Penance & Duty)",
    sanskrit: "यमलोक / तपः लोक",
    desc: "Descent from realms of austere penance, endurance, karmic balancing, and deep service.",
    heritage: "Capacity for deep endurance, ascetic perseverance, detachment from vanity, and selfless duty.",
  },
  Rahu: {
    loka: "Naga Loka / Asura Loka (Realm of Unconventional Illusions)",
    sanskrit: "नागलोक / असुर मण्डल",
    desc: "Descent from mysterious occult realms of intense desires, illusions, and rapid material alchemy.",
    heritage: "Unconventional brilliance, mastery over cutting-edge worldly systems, and desire for liberation.",
  },
  Ketu: {
    loka: "Siddha Loka / Moksha Dwara (Realm of Ascetic Liberators)",
    sanskrit: "सिद्धलोक / मोक्ष द्वार",
    desc: "Descent from realms of dispassionate mystics, renunciants, and direct spiritual seekers.",
    heritage: "Instinctive detachment from materialism, deep occult intuition, and spontaneous meditation.",
  },
};

export function evaluateKarmaRebirth(ephem: EphemerisResult): KarmaRebirthReport {
  const planets = ephem.planets;
  const ascLon = ephem.ascendant.siderealLongitude;
  const ascSignIdx = Math.floor(ascLon / 30);

  const getSign = (pName: string): number => Math.floor((planets[pName]?.siderealLongitude || 0) / 30);
  const getHouse = (pName: string): number => planets[pName]?.house || 1;

  // 1. D3 Dreshkona Calculation
  // 0-10 deg -> 1st Dreshkona (same sign)
  // 10-20 deg -> 2nd Dreshkona (5th from sign)
  // 20-30 deg -> 3rd Dreshkona (9th from sign)
  const calcD3Sign = (lon: number): number => {
    const s = Math.floor(lon / 30);
    const degInSign = lon % 30;
    if (degInSign < 10) return s;
    if (degInSign < 20) return (s + 4) % 12;
    return (s + 8) % 12;
  };

  // 2. Loka of Origin (Soul Descent) via stronger luminary
  const sunLon = planets.Sun?.siderealLongitude || 0;
  const moonLon = planets.Moon?.siderealLongitude || 0;
  // Determine stronger luminary by house placement & dignity
  const sunHouse = getHouse("Sun");
  const moonHouse = getHouse("Moon");
  const isSunStronger = [1, 4, 5, 9, 10, 11].includes(sunHouse) && ![6, 8, 12].includes(sunHouse);
  const strongerLuminary: "Sun" | "Moon" = isSunStronger ? "Sun" : "Moon";
  const lumLon = strongerLuminary === "Sun" ? sunLon : moonLon;

  const d3SignIdx = calcD3Sign(lumLon);
  const d3SignName = RASHI_NAMES[d3SignIdx].englishName;
  const d3Lord = RASHI_LORD_NAMES[d3SignIdx];
  const lokaInfo = LOKA_MAP[d3Lord] || LOKA_MAP["Jupiter"];

  const lokaOfDescent: LokaOfDescent = {
    strongerLuminary,
    luminaryLongitude: lumLon,
    d3SignIndex: d3SignIdx,
    d3SignName,
    d3Lord,
    lokaName: lokaInfo.loka,
    sanskritLoka: lokaInfo.sanskrit,
    realmDescription: lokaInfo.desc,
    spiritualHeritage: lokaInfo.heritage,
  };

  // 3. 22nd Dreshkona (Kharesh)
  const d3LagnaSign = calcD3Sign(ascLon);
  const d3TwentySecondSign = (d3LagnaSign + 7) % 12; // 8th house in D3
  const khareshLord = RASHI_LORD_NAMES[d3TwentySecondSign];
  const khareshHouseInD1 = getHouse(khareshLord);

  const KHARESH_THEMES: Record<string, string> = {
    Sun: "Ego clashes, authorities, vitality fluctuations, fatherly karmic debts.",
    Moon: "Emotional turbulence, psychosomatic strain, water-related vulnerabilities, motherly debts.",
    Mars: "Sudden accidents, inflammatory fevers, sharp disputes, impulsive confrontations.",
    Mercury: "Nervous exhaustion, communication misunderstandings, commercial miscalculations.",
    Jupiter: "Over-expansion, dogma, liver/metabolic strain, issues regarding teachers/counsel.",
    Venus: "Relationship misunderstandings, indulgence traps, hormonal imbalances, vehicle mishaps.",
    Saturn: "Chronic delays, bone/joint stiffness, fear of scarcity, prolonged karmic penance.",
  };

  const kharesh: KhareshReport = {
    d3LagnaSignIndex: d3LagnaSign,
    d3LagnaSignName: RASHI_NAMES[d3LagnaSign].englishName,
    twentySecondDreshkonaSignIndex: d3TwentySecondSign,
    twentySecondDreshkonaSignName: RASHI_NAMES[d3TwentySecondSign].englishName,
    khareshLord,
    khareshHouseInD1,
    vulnerabilityTheme: KHARESH_THEMES[khareshLord] || "General karmic vulnerability requiring steady mindfulness.",
    remedialAdvice: `Strengthen spiritual boundaries through regular charity on ${khareshLord}'s weekday and recitation of the Maha Mrityunjaya Mantra.`,
  };

  // 4. Purva Punya (5th House) & Bhagya (9th House)
  const fifthSignIdx = (ascSignIdx + 4) % 12;
  const fifthLord = RASHI_LORD_NAMES[fifthSignIdx];
  const ninthSignIdx = (ascSignIdx + 8) % 12;
  const ninthLord = RASHI_LORD_NAMES[ninthSignIdx];

  const fifthOccupants: string[] = [];
  const ninthOccupants: string[] = [];
  Object.values(planets).forEach((p) => {
    if (p.isModernPlanet) return;
    if (p.house === 5) fifthOccupants.push(p.name);
    if (p.house === 9) ninthOccupants.push(p.name);
  });

  let punyaPoints = 50;
  if (fifthOccupants.some((p) => ["Jupiter", "Venus", "Mercury", "Moon"].includes(p))) punyaPoints += 20;
  if (ninthOccupants.some((p) => ["Jupiter", "Venus", "Sun"].includes(p))) punyaPoints += 20;
  if (fifthOccupants.some((p) => ["Rahu", "Saturn", "Mars"].includes(p))) punyaPoints -= 15;
  if (ninthOccupants.some((p) => ["Rahu", "Ketu"].includes(p))) punyaPoints -= 10;
  punyaPoints = Math.max(10, Math.min(95, punyaPoints));

  const purvaPunya: PurvaPunyaReport = {
    fifthHouseSign: RASHI_NAMES[fifthSignIdx].englishName,
    fifthLord,
    fifthHouseOccupants: fifthOccupants,
    ninthHouseSign: RASHI_NAMES[ninthSignIdx].englishName,
    ninthLord,
    ninthHouseOccupants: ninthOccupants,
    purvaPunyaScore: punyaPoints,
    pastSadhanaMerits: fifthOccupants.length > 0
      ? `5th house occupied by [${fifthOccupants.join(", ")}]: Direct manifestation of past life sacred mantras and creative intellect.`
      : `5th house ruled by ${fifthLord}: Steady karmic reservoir of Purva Punya unlocked through disciplined study and devotion.`,
    rinanubandhanaChildrenDebts: `Children and students act as sacred karmic links (Rinanubandhana) carrying forward past soul associations with ${fifthLord} stewardship.`,
    guruDharmaArmor: ninthOccupants.length > 0
      ? `9th house fortified by [${ninthOccupants.join(", ")}]: Strong divine armor and lineage blessings protecting during life crises.`
      : `9th house ruled by ${ninthLord}: Dharma protection flows through righteous conduct, pilgrimage, and respect for mentors.`,
  };

  // 5. Rahu-Ketu Axis
  const ketuHouse = getHouse("Ketu");
  const ketuSignIdx = getSign("Ketu");
  const rahuHouse = getHouse("Rahu");
  const rahuSignIdx = getSign("Rahu");

  const RAHU_KETU_THEMES: Record<number, { past: string; future: string }> = {
    1: { past: "Past mastery over public partnerships and social diplomacy (7th).", future: "Current life frontier: Forging fearless self-reliance, leadership, and personal identity (1st)." },
    2: { past: "Past mastery over deep occult research, transformations, and others' resources (8th).", future: "Current life frontier: Building tangible family wealth, ethical speech, and sustainable values (2nd)." },
    3: { past: "Past mastery over higher philosophy, temples, and long journeys (9th).", future: "Current life frontier: Developing courage, self-effort, hands-on enterprise, and communication (3rd)." },
    4: { past: "Past mastery over high career authority, public leadership, and status (10th).", future: "Current life frontier: Cultivating inner peace, domestic sanctuary, emotional grounding, and family roots (4th)." },
    5: { past: "Past mastery over large network gains, social circles, and collective profits (11th).", future: "Current life frontier: Unleashing personal creative genius, children, mantra siddhi, and intellectual devotion (5th)." },
    6: { past: "Past mastery over spiritual surrender, foreign retreats, and isolation (12th).", future: "Current life frontier: Mastering daily duty, service to society, overcoming obstacles, and health discipline (6th)." },
    7: { past: "Past mastery over raw self-assertion and isolated leadership (1st).", future: "Current life frontier: Learning sacred partnership, selfless diplomacy, and committed marital harmony (7th)." },
    8: { past: "Past mastery over accumulated assets, family lineage wealth, and routine speech (2nd).", future: "Current life frontier: Diving into deep spiritual alchemy, sudden transformations, and mystical wisdom (8th)." },
    9: { past: "Past mastery over local skills, practical trades, and short travels (3rd).", future: "Current life frontier: Embracing higher dharma, Guru devotion, global wisdom, and spiritual righteousness (9th)." },
    10: { past: "Past mastery over domestic sanctuary, home comfort, and emotional sheltering (4th).", future: "Current life frontier: Stepping onto the public stage to achieve career mastery and societal execution (10th)." },
    11: { past: "Past mastery over private individual creativity and speculative ventures (5th).", future: "Current life frontier: Expanding into massive social networks, community leadership, and grand aspirations (11th)." },
    12: { past: "Past mastery over daily conflict, disputes, and competitive labor (6th).", future: "Current life frontier: Cultivating spiritual surrender, transcendence, foreign connections, and Moksha (12th)." },
  };

  const axisTheme = RAHU_KETU_THEMES[rahuHouse] || { past: "Past karmic mastery", future: "Current evolutionary growth" };

  const rahuKetuAxis: RahuKetuAxisReport = {
    ketuHouse,
    ketuSign: RASHI_NAMES[ketuSignIdx].englishName,
    ketuPastMastery: axisTheme.past,
    ketuPastDebts: `Detachment required from over-relying on ${RASHI_NAMES[ketuSignIdx].englishName} (H${ketuHouse}) habits from previous incarnations.`,
    rahuHouse,
    rahuSign: RASHI_NAMES[rahuSignIdx].englishName,
    rahuFutureFrontier: axisTheme.future,
    rahuKarmicGrowthTask: `Embrace the unfamiliar growth frontier in ${RASHI_NAMES[rahuSignIdx].englishName} (H${rahuHouse}) with fearless consciousness.`,
  };

  // 6. Retrograde Soul Contracts
  const retrogradeContracts: RetrogradeContract[] = [];
  const VAKRI_LESSONS: Record<string, { lesson: string; resolution: string }> = {
    Mercury: { lesson: "Past life communication or trade contract left unfinished or misunderstood.", resolution: "Speak with absolute integrity, publish delayed knowledge, and refine analytical thought." },
    Venus: { lesson: "Past life romantic commitment, artistic sacrifice, or relationship promise needing closure.", resolution: "Offer unconditional love without demanding possessive validation; cultivate sacred devotion." },
    Mars: { lesson: "Past life warrior assertiveness or conflict that was prematurely interrupted.", resolution: "Channel passionate drive into disciplined construction and protection rather than reactive anger." },
    Jupiter: { lesson: "Past life spiritual wisdom, teaching vows, or philosophical duty requiring completion.", resolution: "Live as an ethical guide, uphold moral principles, and generously impart wisdom to seekers." },
    Saturn: { lesson: "Heavy past life societal duty, administrative responsibility, or debt of service.", resolution: "Endure delays with meditative calm, practice selfless seva, and complete all professional duties." },
  };

  Object.values(planets).forEach((p) => {
    if (p.isRetrograde && VAKRI_LESSONS[p.name]) {
      retrogradeContracts.push({
        planet: p.name,
        house: p.house,
        sign: p.rashi.englishName,
        unfinishedLesson: VAKRI_LESSONS[p.name].lesson,
        karmicResolution: VAKRI_LESSONS[p.name].resolution,
      });
    }
  });

  // 7. Quad-Karma Spectrum
  const quadKarma: QuadKarmaReport = {
    sanchita: {
      name: "Sanchita Karma (Total Cosmic Reservoir)",
      sanskritName: "सञ्चित कर्म",
      description: "The complete cosmic repository of accumulated deeds across all past incarnations.",
      astrologicalLocus: "Encoded in D60 (Shashtiamsha) & D12 (Ancestral Lineage)",
      status: "Dormant reservoir gradually dispensing ripe karma into current lifetime.",
    },
    prarabdha: {
      name: "Prarabdha Karma (Fructifying Life Allotment)",
      sanskritName: "प्रारब्ध कर्म",
      description: "The specific portion of past karma actively bearing fruit in this physical body.",
      astrologicalLocus: "Decoded via Janma Lagna (" + RASHI_NAMES[ascSignIdx].englishName + "), Moon Nakshatra & Dasha",
      status: "Actively unfolding — shaping circumstances, physical constitution, and destiny timing.",
    },
    kriyamana: {
      name: "Kriyamana Karma (Current Free Will Action)",
      sanskritName: "क्रियमाण कर्म",
      description: "Actions being actively performed right now through conscious free will.",
      astrologicalLocus: "Governed by 3rd House (Valour) & 10th House (Executive Action)",
      scorePercent: 78,
      status: "High potential to rewrite future trajectories through conscious ethical discipline.",
    },
    agama: {
      name: "Agama Karma (Future Karmic Blueprints)",
      sanskritName: "आगामी कर्म",
      description: "Future karmic seeds being planted through present intentions, vows, and mental ideations.",
      astrologicalLocus: "Governed by 9th House (Dharma) & 11th House (Aspirations)",
      scorePercent: 82,
      status: "Aligning mental intentions with higher cosmic Dharma ensures auspicious future rebirth or Moksha.",
    },
  };

  const masterKarmicSynthesis = `Soul descended from ${lokaInfo.loka} under ${d3Lord}'s ray. Past spiritual merits (Purva Punya: ${punyaPoints}%) support the evolutionary journey from Ketu in ${rahuKetuAxis.ketuSign} toward Rahu in ${rahuKetuAxis.rahuSign}.`;

  return {
    quadKarma,
    lokaOfDescent,
    kharesh,
    purvaPunya,
    rahuKetuAxis,
    retrogradeContracts,
    masterKarmicSynthesis,
  };
}
