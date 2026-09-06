import { EphemerisResult } from "./types";
import { calculateShodashavargaChart, calculateVargaSign } from "./shodashavarga";
import { calculateJaiminiKarakas } from "./jaimini";
import { calculateAshtakavarga } from "./ashtakavarga";
import { RASHI_NAMES } from "./constants";

export interface D1LagnaLordInD10Analysis {
  d1LagnaLord: string;
  d10SignIndex: number;
  d10SignName: string;
  d10House: number;
  modality: "Chara (Movable)" | "Sthira (Fixed)" | "Dvisvabhava (Dual)";
  modalityCareerBehavior: string;
  signArchetypeTitle: string;
  signArchetypeDescription: string;
  dignityInD10: "Exalted" | "Moolatrikona / Own Sign" | "Debilitated" | "Kendra" | "Trikona" | "Dusthana" | "Neutral";
  isDebilitatedInD10: boolean;
  debilitationSynthesis?: string;
  saturnConnection: {
    hasSaturnConnection: boolean;
    connectionType: "In Saturn Sign (Capricorn/Aquarius)" | "Conjunct Saturn" | "Parivartana with Saturn" | "Aspect from Saturn" | "None";
    leadershipVerdict: string;
  };
  conjunctionsInD10: string[];
  keyVocationalSignature: string;
}

export interface CareerJobBusinessAnalysis {
  // 1. Hemisphere Balance (Left vs Right) — Handwritten Rule 15 & BPHS
  leftCount: number; // Houses 10, 11, 12, 1, 2, 3 (Eastern/Individual/Job)
  rightCount: number; // Houses 4, 5, 6, 7, 8, 9 (Western/Relational/Business)
  hemisphereDominance: "Left (Service & Self-Execution)" | "Right (Trade, Public & Business)" | "Balanced";
  hemisphereSynthesis: string;

  // 2. 6th House (Job) vs 7th House (Business) — Handwritten Rule 15 & Phaladeepika
  house6Lord: string;
  house6LordHouse: number;
  house7Lord: string;
  house7LordHouse: number;
  house6Strength: string;
  house7Strength: string;
  verdict6vs7: "Job / Corporate Service Favored" | "Independent Business / Trade Favored" | "Hybrid / Dual Track";

  // 3. D-10 Dasamsa In-Depth Analysis — Handwritten Rules 1 to 10
  d10LagnaSign: string;
  d10LagnaLord: string;
  d10LagnaLordDignity: string;
  d10AspectOnLagna: string[];
  d110thLordInD10: string;
  d110thLordD10House: number;
  d110thLordD10Dignity: string;
  d10TenthHouseOccupants: string[];
  sunUpachayaWithJupiterAspect: boolean;
  sunInKendras: boolean;

  // 3b. D-1 Lagna Lord in D-10 Dasamsa (Classical Parashara & Shodashavarga Tradition)
  d1LagnaLordInD10: D1LagnaLordInD10Analysis;

  // 4. Key Career Combinations — Handwritten Rules 8 to 14
  lord10House: number;
  lord10In3rd: boolean;
  lord3WithLord10: boolean;
  lord10In6th: boolean;
  lord10In12th: boolean;
  lord10In2nd: boolean;
  lord1In6th: boolean;
  saturnDignityAndPlacement: string;
  moonStrengthNote: string;

  // 5. Jaimini Amatyakaraka (AmK) — Jaimini Upadesha Sutras & Dr. Iranganti Rangacharya
  amatyakarakaPlanet: string;
  amatyakarakaRashi: string;
  amatyakarakaHouse: number;
  amatyakarakaDignity: string;
  amatyakarakaVocation: string;

  // 6. Ashtakavarga SAV Comparison — C.S. Patel Standard
  savHouse6: number;
  savHouse7: number;
  savHouse10: number;
  savHouse11: number;
  ashtakavargaCareerVerdict: string;

  // 7. Bhrigu Nandi Nadi (BNN) Saturn Karma Vector — R.G. Rao
  bnnSaturnKarmaVector: string;
  bnnCareerArchetype: string;

  // 8. B.V. Raman & K.N. Rao Tripartite Vocation Stream
  recommendedVocationStreams: string[];

  // 9. Final Master Career Direction
  primaryRecommendation: "Corporate Job / Executive Service" | "Independent Business / Entrepreneurship" | "Hybrid (Job First, Enterprise Later)";
  executiveSummary: string;
  promotionsAndTimingNote: string;
}

export function analyzeCareerJobBusiness(ephem: EphemerisResult): CareerJobBusinessAnalysis {
  const ascLon = ephem.ascendant.siderealLongitude;
  const ascSignIdx = Math.floor(ascLon / 30);

  // Helper to get house of a planet (1-12)
  const getHouse = (lon: number) => {
    const signIdx = Math.floor(lon / 30);
    return ((signIdx - ascSignIdx + 12) % 12) + 1;
  };

  const getPlanet = (name: string) => ephem.planets[name];

  // Main 7 physical Grahas + Rahu/Ketu
  const mainPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  let leftCount = 0;
  let rightCount = 0;

  const leftHouses = [10, 11, 12, 1, 2, 3];
  const rightHouses = [4, 5, 6, 7, 8, 9];

  mainPlanets.forEach((pName) => {
    const pl = getPlanet(pName);
    if (!pl) return;
    const h = getHouse(pl.siderealLongitude);
    if (leftHouses.includes(h)) leftCount++;
    else if (rightHouses.includes(h)) rightCount++;
  });

  let hemisphereDominance: "Left (Service & Self-Execution)" | "Right (Trade, Public & Business)" | "Balanced" = "Balanced";
  let hemisphereSynthesis = "";

  if (leftCount > rightCount + 1) {
    hemisphereDominance = "Left (Service & Self-Execution)";
    hemisphereSynthesis = `Left Hemisphere dominates (${leftCount} planets vs ${rightCount} on Right). Indicates focused individual execution, structured organizational roles, and career where working under clear mandates or executive governance gives maximum stability. If doing business, you will likely work on client/govt contracts.`;
  } else if (rightCount > leftCount + 1) {
    hemisphereDominance = "Right (Trade, Public & Business)";
    hemisphereSynthesis = `Right Hemisphere dominates (${rightCount} planets vs ${leftCount} on Left). Indicates public facing commerce, partnership dexterity, independent decision making, and natural orientation toward trade and business. Even in a job, you will demand high autonomous authority.`;
  } else {
    hemisphereDominance = "Balanced";
    hemisphereSynthesis = `Balanced Hemisphere distribution (${leftCount} Left vs ${rightCount} Right). Gives versatility to excel in corporate employment while simultaneously building independent consulting or enterprise ventures.`;
  }

  // 6th vs 7th house lords
  const getHouseSignIdx = (h: number) => (ascSignIdx + h - 1) % 12;
  const h6SignIdx = getHouseSignIdx(6);
  const h7SignIdx = getHouseSignIdx(7);
  const h10SignIdx = getHouseSignIdx(10);
  const h3SignIdx = getHouseSignIdx(3);
  const h1SignIdx = getHouseSignIdx(1);

  const lord6Name = RASHI_NAMES[h6SignIdx].lord;
  const lord7Name = RASHI_NAMES[h7SignIdx].lord;
  const lord10Name = RASHI_NAMES[h10SignIdx].lord;
  const lord3Name = RASHI_NAMES[h3SignIdx].lord;
  const lord1Name = RASHI_NAMES[h1SignIdx].lord;

  const pLord6 = getPlanet(lord6Name);
  const pLord7 = getPlanet(lord7Name);
  const pLord10 = getPlanet(lord10Name);
  const pLord3 = getPlanet(lord3Name);
  const pLord1 = getPlanet(lord1Name);
  const sun = getPlanet("Sun");
  const jup = getPlanet("Jupiter");
  const sat = getPlanet("Saturn");
  const moon = getPlanet("Moon");
  const merc = getPlanet("Mercury");
  const mars = getPlanet("Mars");
  const ven = getPlanet("Venus");
  const rahu = getPlanet("Rahu");

  const hLord6 = pLord6 ? getHouse(pLord6.siderealLongitude) : 6;
  const hLord7 = pLord7 ? getHouse(pLord7.siderealLongitude) : 7;
  const hLord10 = pLord10 ? getHouse(pLord10.siderealLongitude) : 10;
  const hLord3 = pLord3 ? getHouse(pLord3.siderealLongitude) : 3;
  const hLord1 = pLord1 ? getHouse(pLord1.siderealLongitude) : 1;

  // D-10 Dasamsa Chart calculations
  const d10Chart = calculateShodashavargaChart(ephem, "D10");
  const d10LagnaSign = d10Chart.ascendant.vargaRashi.englishName;
  const d10LagnaLord = RASHI_NAMES[d10Chart.ascendant.vargaSignIndex].lord;

  // D1 10th lord in D10
  let d110thLordD10House = 1;
  let d110thLordD10Dignity = "Neutral";
  const d110thLordInD10 = lord10Name;

  if (pLord10) {
    const d10SignIdx = calculateVargaSign(pLord10.siderealLongitude, "D10");
    d110thLordD10House = ((d10SignIdx - d10Chart.ascendant.vargaSignIndex + 12) % 12) + 1;
    const signObj = RASHI_NAMES[d10SignIdx];
    if (signObj.lord === lord10Name) d110thLordD10Dignity = "Swakshetra (Own Sign in D10)";
    else if (signObj.englishName === "Aries" && lord10Name === "Sun") d110thLordD10Dignity = "Exalted in D10";
    else if (signObj.englishName === "Taurus" && lord10Name === "Moon") d110thLordD10Dignity = "Exalted in D10";
    else if (signObj.englishName === "Capricorn" && lord10Name === "Mars") d110thLordD10Dignity = "Exalted in D10";
    else if (signObj.englishName === "Virgo" && lord10Name === "Mercury") d110thLordD10Dignity = "Exalted in D10";
    else if (signObj.englishName === "Cancer" && lord10Name === "Jupiter") d110thLordD10Dignity = "Exalted in D10";
    else if (signObj.englishName === "Pisces" && lord10Name === "Venus") d110thLordD10Dignity = "Exalted in D10";
    else if (signObj.englishName === "Libra" && lord10Name === "Saturn") d110thLordD10Dignity = "Exalted in D10";
    else if ([1, 4, 7, 10].includes(d110thLordD10House)) d110thLordD10Dignity = "Kendra in D10";
    else if ([5, 9].includes(d110thLordD10House)) d110thLordD10Dignity = "Trikona in D10";
    else if ([6, 8, 12].includes(d110thLordD10House)) d110thLordD10Dignity = "Dusthana in D10";
  }

  // Benefic aspects on D10 Lagna
  const d10Aspects: string[] = [];
  d10Chart.entities.forEach((e) => {
    if (["Jupiter", "Venus", "Mercury"].includes(e.name)) {
      if (e.house === 7 || (e.name === "Jupiter" && [5, 9].includes((13 - e.house) % 12))) {
        d10Aspects.push(`${e.name} (H${e.house} in D10)`);
      }
    }
  });

  // D10 10th house occupants
  const d10TenthOccupants = d10Chart.entities.filter((e) => e.house === 10).map((e) => e.name);

  // 3b. D-1 Lagna Lord in D-10 Dasamsa Analysis (Classical Parashara & Shodashavarga Tradition)
  const d1LagnaSignIdx = ascSignIdx;
  const d1LagnaLord = RASHI_NAMES[d1LagnaSignIdx].lord;
  const pD1LagnaLord = getPlanet(d1LagnaLord);

  let d1LagnaLordInD10SignIdx = 0;
  let d1LagnaLordInD10SignName = "Aries";
  let d1LagnaLordD10House = 1;
  let d1LagnaLordD10Dignity: "Exalted" | "Moolatrikona / Own Sign" | "Debilitated" | "Kendra" | "Trikona" | "Dusthana" | "Neutral" = "Neutral";
  let isDebilitatedInD10 = false;
  let debilitationSynthesis: string | undefined = undefined;

  if (pD1LagnaLord) {
    d1LagnaLordInD10SignIdx = calculateVargaSign(pD1LagnaLord.siderealLongitude, "D10");
    d1LagnaLordInD10SignName = RASHI_NAMES[d1LagnaLordInD10SignIdx].englishName;
    d1LagnaLordD10House = ((d1LagnaLordInD10SignIdx - d10Chart.ascendant.vargaSignIndex + 12) % 12) + 1;

    // Check exaltation / own sign / debilitation
    const signObj = RASHI_NAMES[d1LagnaLordInD10SignIdx];
    if (
      (d1LagnaLord === "Sun" && signObj.englishName === "Aries") ||
      (d1LagnaLord === "Moon" && signObj.englishName === "Taurus") ||
      (d1LagnaLord === "Mars" && signObj.englishName === "Capricorn") ||
      (d1LagnaLord === "Mercury" && signObj.englishName === "Virgo") ||
      (d1LagnaLord === "Jupiter" && signObj.englishName === "Cancer") ||
      (d1LagnaLord === "Venus" && signObj.englishName === "Pisces") ||
      (d1LagnaLord === "Saturn" && signObj.englishName === "Libra")
    ) {
      d1LagnaLordD10Dignity = "Exalted";
    } else if (
      (d1LagnaLord === "Sun" && signObj.englishName === "Libra") ||
      (d1LagnaLord === "Moon" && signObj.englishName === "Scorpio") ||
      (d1LagnaLord === "Mars" && signObj.englishName === "Cancer") ||
      (d1LagnaLord === "Mercury" && signObj.englishName === "Pisces") ||
      (d1LagnaLord === "Jupiter" && signObj.englishName === "Capricorn") ||
      (d1LagnaLord === "Venus" && signObj.englishName === "Virgo") ||
      (d1LagnaLord === "Saturn" && signObj.englishName === "Aries")
    ) {
      d1LagnaLordD10Dignity = "Debilitated";
      isDebilitatedInD10 = true;
    } else if (signObj.lord === d1LagnaLord) {
      d1LagnaLordD10Dignity = "Moolatrikona / Own Sign";
    } else if ([1, 4, 7, 10].includes(d1LagnaLordD10House)) {
      d1LagnaLordD10Dignity = "Kendra";
    } else if ([5, 9].includes(d1LagnaLordD10House)) {
      d1LagnaLordD10Dignity = "Trikona";
    } else if ([6, 8, 12].includes(d1LagnaLordD10House)) {
      d1LagnaLordD10Dignity = "Dusthana";
    }
  }

  if (isDebilitatedInD10) {
    debilitationSynthesis = `D-1 Lagna Lord ${d1LagnaLord} is Debilitated (Neecha) in D-10 ${d1LagnaLordInD10SignName}: Indicates intense initial toil, delayed societal recognition, and periods of professional dissatisfaction ('I contribute far more than the rewards I receive'). Direct vulnerability where workplace pressure impacts vitality and health; demands deliberate pacing. However, if Venus or Jupiter, it simultaneously sharpens analytical, accounting (CA), or advisory competence despite the struggle.`;
  }

  // Modality of D-1 Lagna Lord in D-10
  let modality: "Chara (Movable)" | "Sthira (Fixed)" | "Dvisvabhava (Dual)" = "Chara (Movable)";
  let modalityCareerBehavior = "";
  if ([0, 3, 6, 9].includes(d1LagnaLordInD10SignIdx)) {
    modality = "Chara (Movable)";
    modalityCareerBehavior = "Movable (Chara) Karma: Highly dynamic, mobile, and evolving professional life. Prone to geographic movements, travel, changing environments, or launching new initiatives; struggles in static, monotonous desk routines.";
  } else if ([1, 4, 7, 10].includes(d1LagnaLordInD10SignIdx)) {
    modality = "Sthira (Fixed)";
    modalityCareerBehavior = "Fixed (Sthira) Karma: Seeks deep roots, institutional stability, and long-term organizational tenure. Reluctant to jump roles frequently; thrives in established hierarchies, government or corporate anchors with enduring permanence.";
  } else {
    modality = "Dvisvabhava (Dual)";
    modalityCareerBehavior = "Dual (Dvisvabhava) Karma: Inherent duality in professional expression. Thrives with multiple simultaneous projects, dual streams (consulting alongside job, or employment transitioning into independent business), multitasking, and versatile intellectual adaptability.";
  }

  // 12 Sign Archetypes (Classical Dasamsa Shastra)
  const SIGN_ARCHETYPES: Record<number, { title: string; desc: string }> = {
    0: { // Aries
      title: "Pioneering Execution & Martial Leadership",
      desc: "Entering the field of Karma as an assertive pioneer. Driven to initiate, lead from the front, and execute independent decisions. Thrives in technical execution, engineering, defense, emergency response, law, sports/fitness, or construction. Resents bureaucratic micromanagement and demands autonomous responsibility.",
    },
    1: { // Taurus
      title: "Value Creation, Banking & Asset Management",
      desc: "Entering Karma focused on tangible value, monetization, and stability. Natural affinity for banking, wealth management, finance, food/hospitality, luxury goods, and asset building. Driven by practical returns; early impulse to monetize skills and build enduring material security.",
    },
    2: { // Gemini
      title: "Information, Media & Multi-Stream Commerce",
      desc: "Entering Karma through intellectual communication, marketing, IT systems, media, writing, and networking. Highly skilled in translating complex information into actionable commerce. Flourishes with multiple parallel revenue streams and diverse intellectual projects.",
    },
    3: { // Cancer
      title: "Public Welfare, Caregiving & Emotional Intuition",
      desc: "Entering Karma with deep emotional resonance with the masses. Thrives in public relations, human resources, healthcare/nursing, hospitality, food/liquids, real estate, and coastal/water commerce. High emotional investment in work and colleagues; requires shielding against office politics or emotional exploitation.",
    },
    4: { // Leo
      title: "Executive Authority, Governance & Visible Status",
      desc: "Entering Karma with royal bearing, commanding presence, and executive stature. Oriented toward civil administration, government leadership, policy formulation, and high corporate governance. Demands visible recognition and autonomy; excels when holding supreme decision-making authority.",
    },
    5: { // Virgo
      title: "Critical Problem-Solving, Audit & Trouble-Shooting",
      desc: "Entering Karma as a precision trouble-shooter and analytical auditor. Natural aptitude for Chartered Accountancy, financial analysis, software debugging, medical/healthcare diagnostics, and process optimization. Possesses keen commercial discernment ('Baniya buddhi') to fix flaws that others overlook.",
    },
    6: { // Libra
      title: "Marketplace Diplomacy, Partnerships & Client Commerce",
      desc: "Entering Karma through relational intelligence, B2B negotiation, contracts, legal arbitration, and commercial design. Professional breakthroughs frequently accelerate post-marriage or through key female partners/allies. Master of diplomacy, consensus building, and marketplace exchange.",
    },
    7: { // Scorpio
      title: "Deep Investigation, Occult & Crisis Transformation",
      desc: "Entering Karma through transformative depth, secret strategies, and crisis management. Thrives in confidential operations, investigative research, taxation, forensic audit, occult/astrology, mining, and high-stakes engineering. Keeps professional strategies protected; undergoes profound career metamorphosis.",
    },
    8: { // Sagittarius
      title: "Institutional Advisory, Mentorship & Strategic Vision",
      desc: "Entering Karma as a knowledge carrier, ethical guide, and high-level counselor. Natural advisor to executives, CEOs, and state institutions. Oriented toward jurisprudence, economics, higher academia, philosophical systems, and expansive strategic policy.",
    },
    9: { // Capricorn
      title: "High Responsibility, Organizational Infrastructure & Labor Governance",
      desc: "Entering Karma through rigorous perseverance, institutional building from the ground up, and heavy administrative duty. Essential signature for mass governance, labor relations, public administration, and large corporate machinery. Demands humility and relentless stamina.",
    },
    10: { // Aquarius
      title: "Systemic Networks, Technology & Unconventional Enterprise",
      desc: "Entering Karma through complex networked systems, scientific innovation, disruptive technology, and mass connectivity. Often maintains a discreet or unconventional professional identity. Thrives in futuristic research, large platforms, and unconventional solutions.",
    },
    11: { // Pisces
      title: "Intuitive Mastery, Subconscious Creation & Global Reach",
      desc: "Entering Karma through elevated intuition, creative arts, music, foreign commerce, healthcare, and metaphysical healing. Excels in solitary deep work, night productivity, and higher abstract logic (especially if Mercury). Requires grounding to avoid unrealistic ideals.",
    },
  };

  // Saturn Connection in D-10 (The Mass Politician / Public Authority / Labor Governance Rule)
  const satEntity = d10Chart.entities.find((e) => e.name === "Saturn");
  const satD10House = satEntity ? satEntity.house : 0;
  const satD10SignIdx = satEntity ? satEntity.vargaSignIndex : -1;

  let hasSaturnConnection = false;
  let saturnConnectionType: "In Saturn Sign (Capricorn/Aquarius)" | "Conjunct Saturn" | "Parivartana with Saturn" | "Aspect from Saturn" | "None" = "None";

  if (satEntity && pD1LagnaLord) {
    const d1LagnaLordOwnSigns = (d1LagnaLord === "Sun") ? [4] :
      (d1LagnaLord === "Moon") ? [3] :
      (d1LagnaLord === "Mars") ? [0, 7] :
      (d1LagnaLord === "Mercury") ? [2, 5] :
      (d1LagnaLord === "Jupiter") ? [8, 11] :
      (d1LagnaLord === "Venus") ? [1, 6] :
      (d1LagnaLord === "Saturn") ? [9, 10] : [];

    const isLagnaLordInSatSign = [9, 10].includes(d1LagnaLordInD10SignIdx);
    const isSatInLagnaLordSign = d1LagnaLordOwnSigns.includes(satD10SignIdx);

    if (isLagnaLordInSatSign && isSatInLagnaLordSign && d1LagnaLord !== "Saturn") {
      hasSaturnConnection = true;
      saturnConnectionType = "Parivartana with Saturn";
    } else if (d1LagnaLordInD10SignIdx === satD10SignIdx && d1LagnaLord !== "Saturn") {
      hasSaturnConnection = true;
      saturnConnectionType = "Conjunct Saturn";
    } else if (isLagnaLordInSatSign) {
      hasSaturnConnection = true;
      saturnConnectionType = "In Saturn Sign (Capricorn/Aquarius)";
    } else {
      const distFromSat = ((d1LagnaLordD10House - satD10House + 12) % 12) + 1;
      if ([3, 7, 10].includes(distFromSat)) {
        hasSaturnConnection = true;
        saturnConnectionType = "Aspect from Saturn";
      }
    }
  }

  let saturnLeadershipVerdict = "Operates without direct Saturnian mass-pressure; career trajectory driven by independent merit, technical specialization, or commercial dexterity rather than mass-political mobilization.";
  if (hasSaturnConnection) {
    saturnLeadershipVerdict = `Saturnian Mass Governance & Resilience (${saturnConnectionType}): Possesses the classical signature identified for mass leaders, statesmen, public administration, and managing large workforces (as observed in prominent political charts). Grants the necessary endurance, humility, and tolerance to handle public pressure and societal responsibilities.`;
  }

  // Conjunctions in D-10 with D-1 Lagna Lord
  const d10Conjunctions: string[] = [];
  d10Chart.entities.forEach((e) => {
    if (e.vargaSignIndex === d1LagnaLordInD10SignIdx && e.name !== d1LagnaLord && e.name !== "Ascendant") {
      d10Conjunctions.push(e.name);
    }
  });

  const d1LagnaLordInD10: D1LagnaLordInD10Analysis = {
    d1LagnaLord,
    d10SignIndex: d1LagnaLordInD10SignIdx,
    d10SignName: d1LagnaLordInD10SignName,
    d10House: d1LagnaLordD10House,
    modality,
    modalityCareerBehavior,
    signArchetypeTitle: SIGN_ARCHETYPES[d1LagnaLordInD10SignIdx]?.title || "Professional Archetype",
    signArchetypeDescription: SIGN_ARCHETYPES[d1LagnaLordInD10SignIdx]?.desc || "",
    dignityInD10: d1LagnaLordD10Dignity,
    isDebilitatedInD10,
    debilitationSynthesis,
    saturnConnection: {
      hasSaturnConnection,
      connectionType: saturnConnectionType,
      leadershipVerdict: saturnLeadershipVerdict,
    },
    conjunctionsInD10: d10Conjunctions,
    keyVocationalSignature: `${d1LagnaLord} in ${d1LagnaLordInD10SignName} (H${d1LagnaLordD10House} in D-10) • ${modality} • ${SIGN_ARCHETYPES[d1LagnaLordInD10SignIdx]?.title || ""}`,
  };

  // Sun upachaya check
  const sunHouse = sun ? getHouse(sun.siderealLongitude) : 1;
  const jupHouse = jup ? getHouse(jup.siderealLongitude) : 1;
  const isUpachayaSun = [3, 6, 10, 11].includes(sunHouse);
  const jupAspectsSun = [1, 5, 7, 9].includes(((sunHouse - jupHouse + 12) % 12) + 1);
  const sunUpachayaWithJupiterAspect = isUpachayaSun && jupAspectsSun;

  // Sun in Kendras
  const sunInKendras = [1, 4, 7, 10].includes(sunHouse);

  // Combinations
  const lord10In3rd = hLord10 === 3;
  const lord3WithLord10 = pLord3 && pLord10 && Math.floor(pLord3.siderealLongitude / 30) === Math.floor(pLord10.siderealLongitude / 30);
  const lord10In6th = hLord10 === 6;
  const lord10In12th = hLord10 === 12;
  const lord10In2nd = hLord10 === 2;
  const lord1In6th = hLord1 === 6;

  // Jaimini Amatyakaraka (AmK)
  const jaiminiKarakas = calculateJaiminiKarakas(ephem);
  const amk = jaiminiKarakas.amatyakaraka;
  const amatyakarakaPlanet = amk.planetName;
  const amatyakarakaRashi = amk.rashi.englishName;
  const amatyakarakaHouse = amk.house;
  const amatyakarakaDignity = `AmK in House ${amk.house} (${amk.rashi.englishName})`;

  let amatyakarakaVocation = "Strategic Executive Leadership";
  if (amatyakarakaPlanet === "Sun") amatyakarakaVocation = "Government, Administrative Command, Civil Services, High Corporate Governance";
  else if (amatyakarakaPlanet === "Moon") amatyakarakaVocation = "Public Relations, Human Resources, Hospitality, Psychology, Creative Media";
  else if (amatyakarakaPlanet === "Mars") amatyakarakaVocation = "Engineering, Defense, Technology, Real Estate, Surgical, Police/Contracting";
  else if (amatyakarakaPlanet === "Mercury") amatyakarakaVocation = "Trading, Analytics, Software Development, Financial Markets, Accounting, Business Agency";
  else if (amatyakarakaPlanet === "Jupiter") amatyakarakaVocation = "Banking, Corporate Advisory, Legal, Judicial, Education, Wealth Management, Consulting";
  else if (amatyakarakaPlanet === "Venus") amatyakarakaVocation = "Design, Luxury Goods, Entertainment, Creative Arts, Marketing, Architecture, Commerce";
  else if (amatyakarakaPlanet === "Saturn") amatyakarakaVocation = "Heavy Industry, Operations Management, Law, Mining, Construction, Large-Scale Infrastructure";

  // Ashtakavarga SAV Comparison (C.S. Patel standard)
  const ashtaka = calculateAshtakavarga(ephem);
  const savHouse6 = ashtaka.sarvaHouseBindus[5];
  const savHouse7 = ashtaka.sarvaHouseBindus[6];
  const savHouse10 = ashtaka.sarvaHouseBindus[9];
  const savHouse11 = ashtaka.sarvaHouseBindus[10];

  let ashtakavargaCareerVerdict = `6th House (Job) holds ${savHouse6} Bindus vs 7th House (Business) holding ${savHouse7} Bindus. `;
  if (savHouse6 > savHouse7 + 2) {
    ashtakavargaCareerVerdict += `Higher Bindus in 6th house indicate that Corporate Employment / Service provides smoother financial growth and superior risk protection over speculative trade.`;
  } else if (savHouse7 > savHouse6 + 2) {
    ashtakavargaCareerVerdict += `Higher Bindus in 7th house indicate that Independent Business / Commercial Partnerships generate superior cash flow and public market returns.`;
  } else {
    ashtakavargaCareerVerdict += `Balanced Bindus across 6th and 7th houses confirm strong capacity to navigate both executive employment and independent business ventures.`;
  }

  // Bhrigu Nandi Nadi (BNN - R.G. Rao) Saturn Karma Vector
  const satSignIdx = sat ? Math.floor(sat.siderealLongitude / 30) : 0;
  const bnnContacts: string[] = [];

  const checkBnnContact = (planetObj: any, name: string) => {
    if (!planetObj || name === "Saturn") return;
    const pSignIdx = Math.floor(planetObj.siderealLongitude / 30);
    const dist = ((pSignIdx - satSignIdx + 12) % 12) + 1;
    if (dist === 1) bnnContacts.push(`Saturn conjunct ${name} (Direct Karma Blend)`);
    else if (dist === 5 || dist === 9) bnnContacts.push(`Saturn trine ${name} (1-5-9 Dharmic Harmony)`);
    else if (dist === 7) bnnContacts.push(`Saturn opposite ${name} (Mutual Aspect)`);
  };

  checkBnnContact(sun, "Sun");
  checkBnnContact(moon, "Moon");
  checkBnnContact(mars, "Mars");
  checkBnnContact(merc, "Mercury");
  checkBnnContact(jup, "Jupiter");
  checkBnnContact(ven, "Venus");
  checkBnnContact(rahu, "Rahu");

  const bnnSaturnKarmaVector = bnnContacts.length > 0 ? bnnContacts.join(" • ") : "Saturn operates as independent solitary Karma anchor";

  let bnnCareerArchetype = "Professional Specialist & Executor";
  if (bnnContacts.some((c) => c.includes("Sun"))) bnnCareerArchetype = "State Leadership, Executive Management, Public Sector Authority";
  else if (bnnContacts.some((c) => c.includes("Mercury"))) bnnCareerArchetype = "Commercial Enterprise, Software/Tech Architecture, Trading & Advisory";
  else if (bnnContacts.some((c) => c.includes("Jupiter"))) bnnCareerArchetype = "Higher Advisory, Legal/Financial Counselor, Institutional Guide";
  else if (bnnContacts.some((c) => c.includes("Mars"))) bnnCareerArchetype = "Technical Engineering, Operations Management, Defense & Construction";
  else if (bnnContacts.some((c) => c.includes("Venus"))) bnnCareerArchetype = "Financial Engineering, Commerce, Luxury Design & Creative Industries";
  else if (bnnContacts.some((c) => c.includes("Rahu"))) bnnCareerArchetype = "Disruptive Tech, Foreign MNCs, Innovation & High-Tech Startups";

  // Saturn dignity & placement
  const satHouse = sat ? getHouse(sat.siderealLongitude) : 1;
  const saturnDignityAndPlacement = `Saturn in House ${satHouse} (${[1, 4, 7, 10].includes(satHouse) ? "Kendra anchor" : [3, 6, 11].includes(satHouse) ? "Strong Upachaya placement" : "Supportive"}) provides capacity to command subordinates, build resilient infrastructure, and maintain organizational endurance.`;

  // Moon note
  const moonHouse = moon ? getHouse(moon.siderealLongitude) : 1;
  const moonStrengthNote = `Moon in House ${moonHouse} governs mental enthusiasm and public resonance for work.`;

  // Vocation streams
  const recommendedVocationStreams: string[] = [];
  if (amatyakarakaPlanet === "Sun" || sunInKendras) recommendedVocationStreams.push("Government / Civil Services / Executive Management");
  if (amatyakarakaPlanet === "Mercury" || lord10In3rd || lord3WithLord10) recommendedVocationStreams.push("IT / Software / Analytics / Trading & Business");
  if (amatyakarakaPlanet === "Jupiter" || lord10In2nd) recommendedVocationStreams.push("Finance / Banking / Corporate Law / Consulting");
  if (amatyakarakaPlanet === "Mars" || saturnDignityAndPlacement.includes("Kendra")) recommendedVocationStreams.push("Engineering / Tech Infrastructure / Real Estate / Operations");
  if (recommendedVocationStreams.length === 0) recommendedVocationStreams.push("Corporate Management & Professional Consulting");

  // 6th vs 7th house verdict
  let verdict6vs7: "Job / Corporate Service Favored" | "Independent Business / Trade Favored" | "Hybrid / Dual Track" = "Hybrid / Dual Track";
  if ([1, 4, 7, 10, 11].includes(hLord6) && ![1, 4, 7, 10, 11].includes(hLord7)) {
    verdict6vs7 = "Job / Corporate Service Favored";
  } else if ([1, 4, 7, 10, 11].includes(hLord7) && ![1, 4, 7, 10, 11].includes(hLord6)) {
    verdict6vs7 = "Independent Business / Trade Favored";
  } else if (rightCount > leftCount + 1 || lord10In3rd || lord3WithLord10) {
    verdict6vs7 = "Independent Business / Trade Favored";
  } else if (leftCount > rightCount + 1) {
    verdict6vs7 = "Job / Corporate Service Favored";
  }

  // Primary recommendation
  let primaryRecommendation: "Corporate Job / Executive Service" | "Independent Business / Entrepreneurship" | "Hybrid (Job First, Enterprise Later)" = "Hybrid (Job First, Enterprise Later)";
  if (verdict6vs7 === "Job / Corporate Service Favored" && !lord10In3rd && !lord3WithLord10 && savHouse6 >= savHouse7) {
    primaryRecommendation = "Corporate Job / Executive Service";
  } else if (verdict6vs7 === "Independent Business / Trade Favored" && (lord10In3rd || lord3WithLord10 || rightCount > leftCount || savHouse7 > savHouse6)) {
    primaryRecommendation = "Independent Business / Entrepreneurship";
  } else {
    primaryRecommendation = "Hybrid (Job First, Enterprise Later)";
  }

  const executiveSummary = `Multi-Book Synthesis (Handwritten Notes + BPHS + Raman + Jaimini + K.N. Rao + C.S. Patel SAV): 6th House Lord in H${hLord6} (${savHouse6} SAV) vs 7th House Lord in H${hLord7} (${savHouse7} SAV), Jaimini AmK is ${amatyakarakaPlanet} in H${amatyakarakaHouse}, 10th Lord in D-10 is in H${d110thLordD10House} (${d110thLordD10Dignity}), and Hemisphere balance is ${leftCount} Left vs ${rightCount} Right. Master Recommendation: ${primaryRecommendation}.`;

  const promotionsAndTimingNote = `Promotions and career leaps trigger during the Vimshottari Mahadasha/Antardasha of 10th Lord (${lord10Name}), Lagna Lord (${lord1Name}), Amatyakaraka (${amatyakarakaPlanet}), planets occupying D-10 10th House (${d10TenthOccupants.length > 0 ? d10TenthOccupants.join(", ") : "10th lord"}), and Sun/Jupiter auspicious transits.`;

  return {
    leftCount,
    rightCount,
    hemisphereDominance,
    hemisphereSynthesis,
    house6Lord: lord6Name,
    house6LordHouse: hLord6,
    house7Lord: lord7Name,
    house7LordHouse: hLord7,
    house6Strength: `6th Lord ${lord6Name} in House ${hLord6}`,
    house7Strength: `7th Lord ${lord7Name} in House ${hLord7}`,
    verdict6vs7,
    d10LagnaSign,
    d10LagnaLord,
    d10LagnaLordDignity: "Calculated",
    d10AspectOnLagna: d10Aspects,
    d110thLordInD10,
    d110thLordD10House,
    d110thLordD10Dignity,
    d10TenthHouseOccupants: d10TenthOccupants,
    d1LagnaLordInD10,
    sunUpachayaWithJupiterAspect,
    sunInKendras,
    lord10House: hLord10,
    lord10In3rd,
    lord3WithLord10: Boolean(lord3WithLord10),
    lord10In6th,
    lord10In12th,
    lord10In2nd,
    lord1In6th,
    saturnDignityAndPlacement,
    moonStrengthNote,
    amatyakarakaPlanet,
    amatyakarakaRashi,
    amatyakarakaHouse,
    amatyakarakaDignity,
    amatyakarakaVocation,
    savHouse6,
    savHouse7,
    savHouse10,
    savHouse11,
    ashtakavargaCareerVerdict,
    bnnSaturnKarmaVector,
    bnnCareerArchetype,
    recommendedVocationStreams,
    primaryRecommendation,
    executiveSummary,
    promotionsAndTimingNote,
  };
}
