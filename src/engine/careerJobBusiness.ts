import { EphemerisResult } from "./types";
import { calculateShodashavargaChart, calculateVargaSign } from "./shodashavarga";
import { calculateJaiminiKarakas } from "./jaimini";
import { calculateAshtakavarga } from "./ashtakavarga";
import { RASHI_NAMES } from "./constants";

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
