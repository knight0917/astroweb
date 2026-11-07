/**
 * Classical K.N. Rao & Naval Singh Planets & Education Engine (विद्या एवं ज्ञान विचार)
 * Reference:
 * - "Planets and Education (Vol. 1)" (202 Pages) by Er. Naval Singh & K.N. Rao
 * - "PAC-DARES in Hindu Astrology" (63 Pages) by K.N. Rao
 * - Tripartite Academic Houses (H4, H5, H9) & D24 Siddhamsa Chart
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateShodashavargaChart } from "./shodashavarga";

export interface AcademicHouseInfo {
  houseNum: number;
  name: string;
  sanskritName: string;
  role: string;
  signName: string;
  lord: string;
  lordHouseInD1: number;
  occupants: string[];
  synthesis: string;
}

export interface StreamAptitude {
  id: string;
  streamName: string;
  sanskritName: string;
  sanskritTitle?: string;
  icon: string;
  aptitudeScorePercent: number;
  keyKarakaPlanets: string[];
  recommendedDegrees: string[];
  practicalAndNonDegreePathways?: string[];
  careerPathways: string[];
  classicalReasoning: string;
}

export interface D24SiddhamsaReport {
  d24LagnaSign: string;
  d24FifthHouseSign: string;
  academicDistinctionScore: number; // 0 to 100
  researchPotential: "Exceptional / Doctoral Level" | "High / Professional Mastery" | "Standard / Practical Application";
  classicalInterpretation: string;
}

export interface VidhyaBhangaRiskReport {
  hasAcademicBreakRisk: boolean;
  severity: "HIGH" | "MODERATE" | "LOW";
  triggerFactors: string[];
  recoveryIndicators: string[];
  classicalSynthesis: string;
}

export interface EducationStreamReport {
  tripartiteHouses: {
    fourthHouse: AcademicHouseInfo;
    fifthHouse: AcademicHouseInfo;
    ninthHouse: AcademicHouseInfo;
  };
  streamAptitudes: StreamAptitude[];
  topRecommendedStream: StreamAptitude;
  d24Siddhamsa: D24SiddhamsaReport;
  vidhyaBhangaRisk: VidhyaBhangaRiskReport;
  masterAcademicGuidance: string;
}

const RASHI_LORD_NAMES = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

export function evaluateEducationStream(natalEphem: EphemerisResult): EducationStreamReport {
  const planets = natalEphem.planets;
  const ascLon = natalEphem.ascendant.siderealLongitude;
  const ascSign = Math.floor(ascLon / 30);

  const getSign = (pName: string): number => Math.floor(((planets as any)[pName]?.siderealLongitude || 0) / 30);
  const getHouse = (pName: string): number => (planets as any)[pName]?.house || 1;

  const getOccupants = (h: number): string[] => {
    const list: string[] = [];
    Object.values(planets).forEach((p) => {
      if (p.isModernPlanet) return;
      if (p.house === h) list.push(p.name);
    });
    return list;
  };

  // -------------------------------------------------------------------------
  // 1. TRIPARTITE ACADEMIC HOUSES (4th, 5th, 9th)
  // -------------------------------------------------------------------------
  const h4SignIdx = (ascSign + 3) % 12;
  const h4Lord = RASHI_LORD_NAMES[h4SignIdx];
  const h4Occupants = getOccupants(4);

  const h5SignIdx = (ascSign + 4) % 12;
  const h5Lord = RASHI_LORD_NAMES[h5SignIdx];
  const h5Occupants = getOccupants(5);

  const h9SignIdx = (ascSign + 8) % 12;
  const h9Lord = RASHI_LORD_NAMES[h9SignIdx];
  const h9Occupants = getOccupants(9);

  const h8SignIdx = (ascSign + 7) % 12;
  const h8Lord = RASHI_LORD_NAMES[h8SignIdx];

  const isDebilitated = (pName: string): boolean => {
    const s = getSign(pName);
    return (
      (pName === "Sun" && s === 6) ||
      (pName === "Moon" && s === 7) ||
      (pName === "Mars" && s === 3) ||
      (pName === "Mercury" && s === 11) ||
      (pName === "Jupiter" && s === 9) ||
      (pName === "Venus" && s === 5) ||
      (pName === "Saturn" && s === 0)
    );
  };

  const isExaltedOrOwn = (pName: string): boolean => {
    const s = getSign(pName);
    if (RASHI_LORD_NAMES[s] === pName) return true;
    return (
      (pName === "Sun" && s === 0) ||
      (pName === "Moon" && s === 1) ||
      (pName === "Mars" && s === 9) ||
      (pName === "Mercury" && s === 5) ||
      (pName === "Jupiter" && s === 3) ||
      (pName === "Venus" && s === 11) ||
      (pName === "Saturn" && s === 6)
    );
  };

  const isGandanta = (pName: string): boolean => {
    const lon = (planets as any)[pName]?.siderealLongitude || 0;
    const s = Math.floor(lon / 30);
    const deg = lon % 30;
    return ([3, 7, 11].includes(s) && deg >= 26.66) || ([0, 4, 8].includes(s) && deg <= 3.33);
  };

  const triggerFactors: string[] = [];
  const recoveryIndicators: string[] = [];

  if (h5Occupants.includes("Rahu") || h5Occupants.includes("Ketu")) {
    triggerFactors.push(`Nodal axis (${h5Occupants.filter((p) => p === "Rahu" || p === "Ketu").join("/")}) occupying 5th House of Buddhi`);
  }
  if (h5Occupants.includes(h8Lord)) {
    triggerFactors.push(`8th Lord (${h8Lord}) conjoined in 5th House (sudden exam break / stream change)`);
  }
  if (h5Occupants.includes("Saturn")) {
    triggerFactors.push(`Saturn occupying 5th House (delayed graduation / slow methodical maturation)`);
  }
  if (isDebilitated(h5Lord)) {
    triggerFactors.push(`5th Lord ${h5Lord} is Debilitated (Neecha) in ${RASHI_NAMES[getSign(h5Lord)].englishName}`);
  }
  if (isGandanta(h5Lord)) {
    triggerFactors.push(`5th Lord ${h5Lord} is at the Gandānta knot (emotional/mental pressure during board/entrance exams)`);
  }
  if ([6, 8, 12].includes(getHouse(h5Lord))) {
    triggerFactors.push(`5th Lord ${h5Lord} placed in Dusthana House ${getHouse(h5Lord)}`);
  }

  if ([1, 4, 5, 9, 10, 11].includes(getHouse(h5Lord))) {
    recoveryIndicators.push(`5th Lord ${h5Lord} placed in auspicious House ${getHouse(h5Lord)} (${RASHI_NAMES[getSign(h5Lord)].englishName})`);
  }
  if (isExaltedOrOwn(h4Lord)) {
    recoveryIndicators.push(`4th Lord ${h4Lord} fortified in Own/Exalted sign in House ${getHouse(h4Lord)}`);
  }
  if (isExaltedOrOwn(h9Lord)) {
    recoveryIndicators.push(`9th Lord ${h9Lord} fortified in Own/Exalted sign in House ${getHouse(h9Lord)} (strong higher-education recovery)`);
  }
  if (isExaltedOrOwn("Mercury")) {
    recoveryIndicators.push(`Vidya Karaka Mercury exalted/own-sign in House ${getHouse("Mercury")}`);
  }

  const hasAcademicBreakRisk = triggerFactors.length >= 2 || (isDebilitated(h5Lord) && h5Occupants.length > 0);
  const severity: "HIGH" | "MODERATE" | "LOW" =
    triggerFactors.length >= 3 ? "HIGH" : triggerFactors.length >= 1 ? "MODERATE" : "LOW";

  const fourthHouse: AcademicHouseInfo = {
    houseNum: 4,
    name: "4th House: Schooling & Foundational Environment",
    sanskritName: "प्राथमिक विद्या एवं गृह संस्कार (H4)",
    role: "Foundational learning, maternal guidance, discipline, and study concentration.",
    signName: RASHI_NAMES[h4SignIdx].englishName,
    lord: h4Lord,
    lordHouseInD1: getHouse(h4Lord),
    occupants: h4Occupants,
    synthesis: `4th house in ${RASHI_NAMES[h4SignIdx].englishName} ruled by ${h4Lord} (in H${getHouse(h4Lord)})${isExaltedOrOwn(h4Lord) ? " provides a resilient analytical foundation" : " shapes foundational schooling environment"}.`,
  };

  const fifthHouse: AcademicHouseInfo = {
    houseNum: 5,
    name: "5th House: Core Buddhi & Field of Specialization",
    sanskritName: "धी / प्रज्ञा एवं विद्या निर्णय (H5)",
    role: "Innate analytical intellect, creativity, memory power, and choice of university major.",
    signName: RASHI_NAMES[h5SignIdx].englishName,
    lord: h5Lord,
    lordHouseInD1: getHouse(h5Lord),
    occupants: h5Occupants,
    synthesis: hasAcademicBreakRisk
      ? `5th house in ${RASHI_NAMES[h5SignIdx].englishName} (${h5Occupants.length ? `occupied by ${h5Occupants.join(", ")}` : "unoccupied"}) with 5th lord ${h5Lord} in H${getHouse(h5Lord)} indicates unconventional intuition but carries a Vidhya Bhanga (academic interruption / exam setback / gap year) signature around age 18–19 before higher-education recovery.`
      : `5th house in ${RASHI_NAMES[h5SignIdx].englishName} ruled by ${h5Lord} in H${getHouse(h5Lord)} indicates sharp discernment, critical logic, and structured learning.`,
  };

  const ninthHouse: AcademicHouseInfo = {
    houseNum: 9,
    name: "9th House: Higher Postgraduate & Philosophical Vidya",
    sanskritName: "उच्च शिक्षा, शोध एवं गुरु कृपा (H9)",
    role: "Postgraduate education, doctoral thesis, foreign university studies, and moral wisdom.",
    signName: RASHI_NAMES[h9SignIdx].englishName,
    lord: h9Lord,
    lordHouseInD1: getHouse(h9Lord),
    occupants: h9Occupants,
    synthesis: `9th house in ${RASHI_NAMES[h9SignIdx].englishName} ruled by ${h9Lord} (in H${getHouse(h9Lord)})${h9Occupants.length ? ` with ${h9Occupants.join(", ")}` : ""} ${isExaltedOrOwn(h9Lord) || h9Occupants.includes(h9Lord) ? "strongly rescues higher university studies after any adolescent schooling turbulence" : "governs university specialization and higher learning"}.`,
  };

  // -------------------------------------------------------------------------
  // 2. 6 CORE EDUCATIONAL STREAM APTITUDE EVALUATORS
  // -------------------------------------------------------------------------
  const marsHouse = getHouse("Mars");
  const satHouse = getHouse("Saturn");
  const merHouse = getHouse("Mercury");
  const jupHouse = getHouse("Jupiter");
  const sunHouse = getHouse("Sun");
  const venHouse = getHouse("Venus");
  const moonHouse = getHouse("Moon");
  const rahuHouse = getHouse("Rahu");

  // Stream 1: Engineering & Technology (Mars, Saturn, Mercury, Rahu + H5/H10)
  let engScore = 60;
  if ([4, 5, 9, 10, 1].includes(marsHouse)) engScore += 15;
  if ([4, 5, 9, 10, 1].includes(satHouse)) engScore += 10;
  if ([4, 5, 9, 10, 1].includes(merHouse) || [4, 5, 9, 10, 1].includes(rahuHouse)) engScore += 10;
  if (h5Lord === "Mars" || h5Lord === "Saturn" || h5Lord === "Mercury") engScore += 10;

  // Stream 2: Medical & Life Sciences (Sun, Mars, Jupiter, Moon + H6/H8/H5)
  let medScore = 55;
  if ([4, 5, 6, 8, 9, 10].includes(sunHouse)) medScore += 15;
  if ([6, 8, 10].includes(marsHouse)) medScore += 10;
  if ([5, 9, 1].includes(jupHouse) || [4, 5, 9].includes(moonHouse)) medScore += 10;
  if (h5Lord === "Sun" || h5Lord === "Mars" || h5Lord === "Jupiter") medScore += 10;

  // Stream 3: Physical Sciences & Pure Math (Mercury, Sun, Mars + H5)
  let sciScore = 60;
  if ([1, 4, 5, 9, 10].includes(merHouse)) sciScore += 15;
  if ([1, 4, 5, 9].includes(sunHouse)) sciScore += 10;
  if ([1, 5, 9].includes(marsHouse)) sciScore += 10;
  if (h5Lord === "Mercury" || h5Lord === "Sun") sciScore += 10;

  // Stream 4: Commerce, Finance & Management (Mercury, Jupiter + H2/H11/H5)
  let comScore = 65;
  if ([1, 2, 5, 9, 10, 11].includes(merHouse)) comScore += 15;
  if ([1, 2, 5, 9, 11].includes(jupHouse)) comScore += 15;
  if (h5Lord === "Mercury" || h5Lord === "Jupiter" || h5Lord === "Venus") comScore += 10;

  // Stream 5: Law, Governance & Public Administration (Jupiter, Sun, Mars + H9/H10)
  let lawScore = 55;
  if ([1, 5, 9, 10].includes(jupHouse)) lawScore += 15;
  if ([1, 5, 9, 10].includes(sunHouse)) lawScore += 10;
  if ([1, 10].includes(marsHouse)) lawScore += 10;
  if (h5Lord === "Jupiter" || h5Lord === "Sun") lawScore += 10;

  // Stream 6: Humanities, Arts, Design & Media (Venus, Moon, Mercury + H3/H5)
  let artScore = 50;
  if ([1, 3, 5, 9, 10, 12].includes(venHouse)) artScore += 15;
  if ([1, 3, 5, 9].includes(moonHouse)) artScore += 10;
  if ([3, 5].includes(merHouse)) artScore += 10;
  if (h5Lord === "Venus" || h5Lord === "Moon") artScore += 10;

  // Normalize scores to max 98
  const cap = (s: number) => Math.min(96, Math.max(35, s));
  engScore = cap(engScore);
  medScore = cap(medScore);
  sciScore = cap(sciScore);
  comScore = cap(comScore);
  lawScore = cap(lawScore);
  artScore = cap(artScore);

  const streamAptitudes: StreamAptitude[] = [
    {
      id: "engineering",
      streamName: "Engineering, Computing & Advanced Technology",
      sanskritName: "यान्त्रिकी, संगणक एवं तकनीकी विद्या",
      icon: "💻",
      aptitudeScorePercent: engScore,
      keyKarakaPlanets: ["Mars (Logic/Machines)", "Saturn (Structures)", "Mercury/Rahu (IT/AI)"],
      recommendedDegrees: ["B.Tech / M.Tech in Computer Science / AI", "Data Engineering", "Mechanical / Electrical Engineering"],
      practicalAndNonDegreePathways: ["Self-Taught Software / Coding", "Electronics & Hardware Repair", "Automotive / Machinery Mechanics", "Construction & Technical Contracting"],
      careerPathways: ["Software Architect", "AI Engineer", "Robotics Specialist", "Technical Entrepreneur / Master Mechanic"],
      classicalReasoning: "Strong technical Mars-Saturn-Rahu connectivity with intellectual kendras favors technological mastery, hands-on machinery, and systems architecture (whether via formal degree or self-taught technical craft).",
    },
    {
      id: "commerce",
      streamName: "Commerce, Finance, Trading & Entrepreneurship",
      sanskritName: "वाणिज्य, वित्त, व्यापार एवं प्रबन्धन",
      icon: "📈",
      aptitudeScorePercent: comScore,
      keyKarakaPlanets: ["Mercury (Calculation)", "Jupiter (Finance/Treasury)", "Venus (Wealth)"],
      recommendedDegrees: ["MBA Finance", "Chartered Accountancy (CA / CFA)", "B.Com / M.Com", "FinTech / Economics"],
      practicalAndNonDegreePathways: ["Independent Financial / Market Trading", "Retail / Wholesale Merchant", "Self-Made Business & Deal-Making", "Supply Chain & Logistics Trade"],
      careerPathways: ["Financial / Market Trader", "Business Owner / Merchant", "Corporate Strategist", "Wealth Consultant"],
      classicalReasoning: "Auspicious Mercury-Jupiter linkage with 2nd, 5th, and 11th Dhana sthanas promotes commercial acumen, speculative market intuition, and independent trade (regardless of formal college credentials).",
    },
    {
      id: "science",
      streamName: "Physical Sciences, Analytics & Applied Calculation",
      sanskritName: "भौतिकी, रसायन एवं शुद्ध गणित",
      icon: "📐",
      aptitudeScorePercent: sciScore,
      keyKarakaPlanets: ["Mercury (Calculus)", "Sun (Core Abstraction)", "Mars (Precision Logic)"],
      recommendedDegrees: ["B.Sc / M.Sc Mathematics", "Physics / Astrophysics", "Data Science & Statistics"],
      practicalAndNonDegreePathways: ["Quantitative Market Analysis", "Precision Instrumentation & Lab Craft", "Independent Data / Algorithmic Systems"],
      careerPathways: ["Research Scientist", "Quantitative Analyst", "Data Strategist", "Technical Specialist"],
      classicalReasoning: "Mercury and Sun alignment in cognitive trikonas bestows penetrating conceptual abstraction and numerical precision.",
    },
    {
      id: "law",
      streamName: "Law, Governance, Community Leadership & Public Affairs",
      sanskritName: "विधि, न्यायशास्त्र एवं प्रशासनिक सेवा",
      icon: "⚖️",
      aptitudeScorePercent: lawScore,
      keyKarakaPlanets: ["Jupiter (Dharma/Jurisprudence)", "Sun (State Power)", "Mars (Executive Action)"],
      recommendedDegrees: ["BA-LLB / LLM", "Public Policy", "Civil Services (UPSC / State PSC)"],
      practicalAndNonDegreePathways: ["Grassroots Community Leadership", "Local Governance / Panchayat / Union Leadership", "Real Estate & Land Mediation", "Security & Enforcement Operations"],
      careerPathways: ["Legal / Policy Advisor", "Public Leader / Organizer", "Civil Servant", "Contract & Land Negotiator"],
      classicalReasoning: "Jupiter's dharmic aspect on authority sthanas supports ethical leadership, mediation, and organizational command.",
    },
    {
      id: "medicine",
      streamName: "Medical, Healing, Fitness & Life Sciences",
      sanskritName: "चिकित्सा, शल्यक्रिया एवं आयुर्वेद",
      icon: "🩺",
      aptitudeScorePercent: medScore,
      keyKarakaPlanets: ["Sun (Prana/Vitality)", "Mars (Surgical Precision)", "Jupiter/Moon (Healing Herbs)"],
      recommendedDegrees: ["MBBS / MD / MS", "Biotechnology", "Pharmacy / BDS / Ayurveda"],
      practicalAndNonDegreePathways: ["Traditional Herbal / Holistic Healing", "Physical Therapy, Fitness & Athletics Coaching", "Medical Supply / Pharmacy Trade", "Emergency Care & Nursing Support"],
      careerPathways: ["Physician / Healer", "Fitness & Wellness Coach", "Healthcare Entrepreneur", "Pharmacologist"],
      classicalReasoning: "Vital Sun-Mars-Jupiter interaction with healthcare trik sthanas enables healing diagnostics, physical vitality work, and caregiving.",
    },
    {
      id: "humanities",
      streamName: "Humanities, Creative Arts, Crafts & Media",
      sanskritName: "साहित्य, ललित कला, शिल्प एवं संचार",
      icon: "🎨",
      aptitudeScorePercent: artScore,
      keyKarakaPlanets: ["Venus (Aesthetics)", "Moon (Poetic Emotion)", "Mercury (Writing)"],
      recommendedDegrees: ["BA / MA Literature", "Mass Communication & Journalism", "Graphic Design / Fine Arts"],
      practicalAndNonDegreePathways: ["Digital Content Creation & Social Media", "Artisanal Craft, Fashion, Tailoring & Jewelry", "Culinary Arts & Hospitality", "Music, Performance & Storytelling"],
      careerPathways: ["Creative Creator / Artisan", "Media & Content Producer", "Design Entrepreneur", "Hospitality Specialist"],
      classicalReasoning: "Venus and Moon aesthetic alignment inspires creative eloquence, visual/manual craftsmanship, and public expression.",
    },
  ];

  // Sort by aptitude score descending
  streamAptitudes.sort((a, b) => b.aptitudeScorePercent - a.aptitudeScorePercent);
  const topRecommendedStream = streamAptitudes[0];

  // -------------------------------------------------------------------------
  // 3. D24 SIDDHAMSA (CHATURVIMSHAMSHA) HIGHER LEARNING & VIDHYA BHANGA AUDIT
  // -------------------------------------------------------------------------
  const d24Chart = calculateShodashavargaChart(natalEphem, "D24");
  const d24LagnaName = d24Chart.ascendant.vargaRashi.englishName;
  const d24H5SignIdx = (d24Chart.ascendant.vargaRashi.index + 4) % 12;
  const d24H5SignName = RASHI_NAMES[d24H5SignIdx].englishName;

  let distinctionScore = 76;
  if (isExaltedOrOwn("Mercury")) distinctionScore += 8;
  if (isExaltedOrOwn("Jupiter")) distinctionScore += 6;
  if (isExaltedOrOwn(h5Lord)) distinctionScore += 7;
  if (isExaltedOrOwn(h9Lord)) distinctionScore += 6;
  if (isDebilitated(h5Lord)) distinctionScore -= 12;
  if (isGandanta(h5Lord)) distinctionScore -= 6;
  if (h5Occupants.includes("Rahu") || h5Occupants.includes("Ketu")) distinctionScore -= 5;
  if (h5Occupants.includes(h8Lord)) distinctionScore -= 6;
  distinctionScore = Math.max(48, Math.min(96, distinctionScore));

  const researchPotential: D24SiddhamsaReport["researchPotential"] =
    distinctionScore >= 85
      ? "Exceptional / Doctoral Level"
      : distinctionScore >= 70
      ? "High / Professional Mastery"
      : "Standard / Practical Application";

  const vidhyaBhangaRisk: VidhyaBhangaRiskReport = {
    hasAcademicBreakRisk,
    severity,
    triggerFactors,
    recoveryIndicators,
    classicalSynthesis: hasAcademicBreakRisk
      ? `Classical Vidhya Bhanga & Non-Linear Learning Alert (K.N. Rao 'Planets and Education' & Phaladeepika Ch. 12): ${triggerFactors.join("; ")}. Depending on the native's age and background (Desha-Kaala-Paatra), this manifests in one of four ways: (1) If currently in school (Class 10/12), it creates exam pressure/distraction requiring disciplined focus; (2) If pursuing college, it causes an initial exam setback/drop year around age 18–19 before later completion (${recoveryIndicators.join("; ") || "11th/9th house restoration"}); (3) Leaving formal education after school (10th/12th) or before graduation to enter practical work/trade; or (4) If never formally schooled, channeling 5th-house Buddhi directly into street-smart intuition, speculative skill, or hands-on craft.`
      : `Unobstructed 4th/5th/9th intellectual axis supports steady absorption of knowledge—whether in formal school/university (${recoveryIndicators.join("; ") || "balanced planetary support"}) or in practical vocational/self-taught mastery.`,
  };

  const d24Siddhamsa: D24SiddhamsaReport = {
    d24LagnaSign: d24LagnaName,
    d24FifthHouseSign: d24H5SignName,
    academicDistinctionScore: distinctionScore,
    researchPotential,
    classicalInterpretation: hasAcademicBreakRisk
      ? `D24 Siddhamsa Lagna in ${d24LagnaName} with 5th house in ${d24H5SignName} (${distinctionScore}% index) shows strong practical/technical mastery (${researchPotential}), though D-1 5th-house afflictions indicate an initial adolescent exam hurdle (Vidhya Bhanga) before university graduation.`
      : `D24 Siddhamsa Lagna in ${d24LagnaName} with 5th house in ${d24H5SignName} (${distinctionScore}% index) confirms ${researchPotential} and steady intellectual absorption.`,
  };

  const masterAcademicGuidance = hasAcademicBreakRisk
    ? `BVB Educational Counselling Model: Primary academic orientation aligns with ${topRecommendedStream.streamName} (${topRecommendedStream.aptitudeScorePercent}% Aptitude). ⚠️ NON-LINEAR TIMELINE NOTE: ${vidhyaBhangaRisk.classicalSynthesis}`
    : `BVB Educational Counselling Model: Primary academic orientation aligns with ${topRecommendedStream.streamName} (${topRecommendedStream.aptitudeScorePercent}% Aptitude). Supported by 4th house foundation and D24 Siddhamsa in ${d24LagnaName}.`;

  return {
    tripartiteHouses: {
      fourthHouse,
      fifthHouse,
      ninthHouse,
    },
    streamAptitudes,
    topRecommendedStream,
    d24Siddhamsa,
    vidhyaBhangaRisk,
    masterAcademicGuidance,
  };
}
