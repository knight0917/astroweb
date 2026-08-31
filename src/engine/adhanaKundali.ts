/**
 * Classical Adhana Kundali (Garbhadhana / Nisheka Lagna / Epoch Conception Chart Engine)
 * References:
 * - Brihat Parashara Hora Shastra (BPHS) - Garbhadhana Adhyaya
 * - Brihat Jataka (Acharya Varahamihira) - Chapter 4: Nishekadhyaya
 * - Saravali (Maharaja Kalyana Varma) - Chapter 8: Nisheka Janma Yoga
 * - Phaladeepika (Acharya Mantreswara) - Chapter on Nisheka
 * - Jataka Parijata (Vaidyanatha Dikshita)
 */

import { EphemerisResult, GeoLocation, RashiInfo } from "./types";
import { RASHI_NAMES } from "./constants";
import { calculateVedicEphemeris } from "./ephemeris";

function getPlanetaryDignity(
  planetName: string,
  signIdx: number,
  sunLon: number,
  planetLon: number
): { dignity: GestationalMonthEvaluation["dignity"]; isCombust: boolean } {
  const exaltation: Record<string, number> = {
    Sun: 0,
    Moon: 1,
    Mars: 9,
    Mercury: 5,
    Jupiter: 3,
    Venus: 11,
    Saturn: 6,
  };

  const debilitation: Record<string, number> = {
    Sun: 6,
    Moon: 7,
    Mars: 3,
    Mercury: 11,
    Jupiter: 9,
    Venus: 5,
    Saturn: 0,
  };

  const ownSigns: Record<string, number[]> = {
    Sun: [4],
    Moon: [3],
    Mars: [0, 7],
    Mercury: [2, 5],
    Jupiter: [8, 11],
    Venus: [1, 6],
    Saturn: [9, 10],
  };

  let dignity: GestationalMonthEvaluation["dignity"] = "Neutral (सम)";
  if (exaltation[planetName] === signIdx) {
    dignity = "Exalted (उच्च)";
  } else if (debilitation[planetName] === signIdx) {
    dignity = "Debilitated (नीच)";
  } else if (ownSigns[planetName]?.includes(signIdx)) {
    dignity = "Own Sign (स्वक्षेत्री)";
  } else if ([0, 4, 8].includes(signIdx)) {
    dignity = "Friendly (मित्र)";
  }

  let isCombust = false;
  if (planetName !== "Sun" && planetName !== "Rahu" && planetName !== "Ketu") {
    const diff = Math.abs((planetLon - sunLon + 360) % 360);
    const minDiff = Math.min(diff, 360 - diff);
    if (minDiff <= 8.5) {
      isCombust = true;
    }
  }

  return { dignity, isCombust };
}

export interface GestationalMonthEvaluation {
  monthNumber: number;
  monthName: string;
  rulingPlanet: string;
  sanskritStage: string;
  stageTranslation: string;
  organDevelopment: string;
  startDateIso: string;
  endDateIso: string;
  planetRashi: string;
  planetHouseFromAdhana: number;
  dignity: "Exalted (उच्च)" | "Moolatrikona (मूलत्रिकोण)" | "Own Sign (स्वक्षेत्री)" | "Friendly (मित्र)" | "Neutral (सम)" | "Enemy (शत्रु)" | "Debilitated (नीच)";
  isCombust: boolean;
  vitalityScore: number;
  status: "Flourishing (उत्कृष्ट)" | "Healthy (शुभ)" | "Moderate (मध्यम)" | "Sensitive / Needs Care (सावधानी)";
  classicalDiagnostic: string;
}

export interface GarbhaRakshaAnalysis {
  protectionScore: number; // 0 to 100
  verdict: "Supreme Divine Shield (उत्कृष्ट गर्भ रक्षा)" | "Auspicious Protection (शुभ रक्षा)" | "Moderate Vitality (साधारण)" | "Vulnerable / Remedial Care Needed (सावधानी)";
  beneficsInKendrasTrikonas: string[];
  maleficsInDusthanas: string[];
  garbhaKavachamFactors: string[];
  description: string;
}

export interface AdhanaKundliResult {
  // Epoch Conception Timeline
  birthDate: Date;
  estimatedConceptionDate: Date;
  gestationDurationDays: number;
  gestationDurationWeeks: number;
  location: GeoLocation;

  // Adhana Ephemeris
  adhanaEphemeris: EphemerisResult;
  adhanaLagnaSign: string;
  adhanaLagnaLord: string;
  adhanaLagnaDegreeStr: string;
  adhanaMoonSign: string;
  adhanaMoonNakshatra: string;
  adhanaMoonDegreeStr: string;

  // 10 Gestational Months Organogenesis
  gestationalMonths: GestationalMonthEvaluation[];

  // Protective Shield & Foetal Health
  garbhaRaksha: GarbhaRakshaAnalysis;

  // Adhana to Janma BTR Cross-Verification
  btrHarmonicRelationship: string;
  btrConfidenceScore: number;
  btrSummary: string;

  // Executive Synthesis
  executiveSummary: string;
}

/**
 * Calculates the exact reverse-gestation epoch and complete Adhana Kundali
 */
export function calculateAdhanaKundali(
  natalEphemeris: EphemerisResult,
  birthDate: Date,
  location: GeoLocation
): AdhanaKundliResult {
  const moon = natalEphemeris.planets.Moon;
  const sun = natalEphemeris.planets.Sun;
  const asc = natalEphemeris.ascendant;

  const moonLon = moon?.siderealLongitude || 0;
  const sunLon = sun?.siderealLongitude || 0;
  const ascLon = asc?.siderealLongitude || 0;

  // 1. Classical Gestation Duration Calculation (Varahamihira Brihat Jataka Ch. 4)
  // Base gestation period = 273 days (10 sidereal lunar revolutions)
  const elongation = (moonLon - sunLon + 360) % 360;
  const isShuklaPaksha = elongation < 180;
  const moonFromAsc = (moonLon - ascLon + 360) % 360;

  // Fine-tuning offset based on Moon-Ascendant distance (scaled ±14 days)
  const offsetDays = ((moonFromAsc - 180) / 180) * 12;
  const rawGestationDays = 273 + (isShuklaPaksha ? offsetDays : -offsetDays);
  const gestationDurationDays = Math.max(252, Math.min(298, Math.round(rawGestationDays)));
  const gestationDurationWeeks = parseFloat((gestationDurationDays / 7).toFixed(1));

  // 2. Conception Date Timestamp
  const conceptionMs = birthDate.getTime() - gestationDurationDays * 24 * 3600 * 1000;
  const estimatedConceptionDate = new Date(conceptionMs);

  // 3. Compute High-Precision Adhana Ephemeris
  const adhanaEphemeris = calculateVedicEphemeris(
    estimatedConceptionDate,
    location,
    natalEphemeris.ayanamshaType
  );

  const adhanaAscSignIdx = Math.floor(adhanaEphemeris.ascendant.siderealLongitude / 30);
  const adhanaLagnaSign = RASHI_NAMES[adhanaAscSignIdx].englishName;
  const adhanaLagnaLord = RASHI_NAMES[adhanaAscSignIdx].lord;
  const adhanaLagnaDegreeStr = `${adhanaLagnaSign} ${(adhanaEphemeris.ascendant.siderealLongitude % 30).toFixed(2)}°`;

  const adhanaMoon = adhanaEphemeris.planets.Moon;
  const adhanaMoonSign = adhanaMoon?.rashi.englishName || "Aries";
  const adhanaMoonNakshatra = `${adhanaMoon?.nakshatra.sanskritName || ""} (Pada ${adhanaMoon?.nakshatra.pada || 1})`;
  const adhanaMoonDegreeStr = `${adhanaMoonSign} ${((adhanaMoon?.siderealLongitude || 0) % 30).toFixed(2)}°`;

  // 4. 10-Month Foetal Gestation Evaluator (Brihat Jataka & BPHS)
  const MASA_PATI_CONFIG: {
    monthNumber: number;
    monthName: string;
    rulingPlanetFunc: (adhanaLagnaLord: string) => string;
    sanskritStage: string;
    stageTranslation: string;
    organDevelopment: string;
  }[] = [
    {
      monthNumber: 1,
      monthName: "1st Month (Days 1–27)",
      rulingPlanetFunc: () => "Venus",
      sanskritStage: "Kalala (कलल)",
      stageTranslation: "Zygote Implantation & Coagulation",
      organDevelopment: "Fusion of ovum and semen; formation of blastocyst and gestational sac.",
    },
    {
      monthNumber: 2,
      monthName: "2nd Month (Days 28–55)",
      rulingPlanetFunc: () => "Mars",
      sanskritStage: "Ghana (घन)",
      stageTranslation: "Embryonic Solidification",
      organDevelopment: "Embryo solidifies into dense cellular mass; neural tube and primary germ layers emerge.",
    },
    {
      monthNumber: 3,
      monthName: "3rd Month (Days 56–82)",
      rulingPlanetFunc: () => "Jupiter",
      sanskritStage: "Ankura (अंकुर)",
      stageTranslation: "Organogenesis & Limb Sprouting",
      organDevelopment: "Sprouting of arm/leg buds, digits, facial sensory foundations, and vital organs.",
    },
    {
      monthNumber: 4,
      monthName: "4th Month (Days 83–109)",
      rulingPlanetFunc: () => "Sun",
      sanskritStage: "Asthi (अस्थि)",
      stageTranslation: "Skeletal Framework & Heart Vitality",
      organDevelopment: "Ossification of spinal column, skull, ribs, bone marrow, and functional heartbeat.",
    },
    {
      monthNumber: 5,
      monthName: "5th Month (Days 110–136)",
      rulingPlanetFunc: () => "Moon",
      sanskritStage: "Tvak & Rakta (त्वक् एवं रक्त)",
      stageTranslation: "Skin Formation & Blood Circulation",
      organDevelopment: "Dermal layers, blood vessels, amniotic fluid assimilation, and maternal emotional link.",
    },
    {
      monthNumber: 6,
      monthName: "6th Month (Days 137–164)",
      rulingPlanetFunc: () => "Saturn",
      sanskritStage: "Roma & Snayu (रोम एवं स्नायु)",
      stageTranslation: "Nervous Connective Tissue & Hair",
      organDevelopment: "Lanugo hair, fingernails, peripheral nerves, tendons, and ligament network.",
    },
    {
      monthNumber: 7,
      monthName: "7th Month (Days 165–191)",
      rulingPlanetFunc: () => "Mercury",
      sanskritStage: "Chetana (चेतना)",
      stageTranslation: "Awakening of Consciousness & Senses",
      organDevelopment: "Cerebral cortex development, neural synapse firing, auditory awareness inside womb.",
    },
    {
      monthNumber: 8,
      monthName: "8th Month (Days 192–218)",
      rulingPlanetFunc: (lagnaLord) => lagnaLord,
      sanskritStage: "Rasa-Pushti (रस पुष्टि)",
      stageTranslation: "Nutrient Absorption & Vitality",
      organDevelopment: "Full nutrient absorption through umbilical cord; subcutaneous fat and immunity storage.",
    },
    {
      monthNumber: 9,
      monthName: "9th Month (Days 219–246)",
      rulingPlanetFunc: () => "Moon",
      sanskritStage: "Udvijata (उद्विजता)",
      stageTranslation: "Maturation & Birth Orientation",
      organDevelopment: "Pulmonary lung surfactant maturation; baby rotates head-down in pelvic orientation.",
    },
    {
      monthNumber: 10,
      monthName: "10th Month (Days 247–Delivery)",
      rulingPlanetFunc: () => "Sun",
      sanskritStage: "Prasava (प्रसव)",
      stageTranslation: "Delivery & Earthly Emergence",
      organDevelopment: "Endocrine trigger of labor; soul descent and physical emergence into the atmosphere.",
    },
  ];

  const monthDurationMs = (gestationDurationDays * 24 * 3600 * 1000) / 10;
  const gestationalMonths: GestationalMonthEvaluation[] = [];

  for (const cfg of MASA_PATI_CONFIG) {
    const startMs = conceptionMs + (cfg.monthNumber - 1) * monthDurationMs;
    const endMs = conceptionMs + cfg.monthNumber * monthDurationMs;
    const startDate = new Date(startMs);
    const endDate = new Date(endMs);

    const rulingPlanetName = cfg.rulingPlanetFunc(adhanaLagnaLord);
    const planetPos = adhanaEphemeris.planets[rulingPlanetName as keyof typeof adhanaEphemeris.planets];

    const planetSignIdx = planetPos ? Math.floor(planetPos.siderealLongitude / 30) : 0;
    const planetRashi = RASHI_NAMES[planetSignIdx].englishName;
    const planetHouse = ((planetSignIdx - adhanaAscSignIdx + 12) % 12) + 1;

    const sunLon = adhanaEphemeris.planets.Sun?.siderealLongitude || 0;
    const planetLon = planetPos?.siderealLongitude || 0;
    const { dignity, isCombust } = getPlanetaryDignity(rulingPlanetName, planetSignIdx, sunLon, planetLon);

    let vitalityScore = 70;
    if (dignity === "Exalted (उच्च)") vitalityScore = 95;
    else if (dignity === "Own Sign (स्वक्षेत्री)") vitalityScore = 90;
    else if (dignity === "Friendly (मित्र)") vitalityScore = 80;
    else if (dignity === "Debilitated (नीच)") vitalityScore = 45;

    if (isCombust) vitalityScore -= 15;

    // House placement modifiers
    if ([1, 4, 7, 10, 5, 9, 11].includes(planetHouse)) vitalityScore += 10;
    if ([6, 8, 12].includes(planetHouse)) vitalityScore -= 15;

    vitalityScore = Math.max(35, Math.min(98, vitalityScore));

    let status: GestationalMonthEvaluation["status"] = "Healthy (शुभ)";
    if (vitalityScore >= 85) status = "Flourishing (उत्कृष्ट)";
    else if (vitalityScore >= 65) status = "Healthy (शुभ)";
    else if (vitalityScore >= 50) status = "Moderate (मध्यम)";
    else status = "Sensitive / Needs Care (सावधानी)";

    const diagnostic =
      vitalityScore >= 80
        ? `Ruling Lord ${rulingPlanetName} is strongly situated in ${planetRashi} (House ${planetHouse}), providing robust cellular strength and pristine development for ${cfg.sanskritStage}.`
        : vitalityScore >= 60
        ? `Ruling Lord ${rulingPlanetName} in ${planetRashi} (House ${planetHouse}) offers stable, balanced foetal progress for ${cfg.sanskritStage}.`
        : `Ruling Lord ${rulingPlanetName} in House ${planetHouse} reflects sensitive growth during ${cfg.sanskritStage}; maternal peaceful sanctuary and nutritional discipline were vital.`;

    gestationalMonths.push({
      monthNumber: cfg.monthNumber,
      monthName: cfg.monthName,
      rulingPlanet: rulingPlanetName,
      sanskritStage: cfg.sanskritStage,
      stageTranslation: cfg.stageTranslation,
      organDevelopment: cfg.organDevelopment,
      startDateIso: startDate.toISOString().slice(0, 10),
      endDateIso: endDate.toISOString().slice(0, 10),
      planetRashi,
      planetHouseFromAdhana: planetHouse,
      dignity,
      isCombust,
      vitalityScore,
      status,
      classicalDiagnostic: diagnostic,
    });
  }

  // 5. Garbha Raksha (Foetal Protection Shield)
  const beneficsInKendrasTrikonas: string[] = [];
  const maleficsInDusthanas: string[] = [];
  const garbhaKavachamFactors: string[] = [];
  let protectionScore = 50;

  const benefics = ["Jupiter", "Venus", "Mercury", "Moon"];
  const malefics = ["Saturn", "Mars", "Rahu", "Ketu", "Sun"];

  for (const b of benefics) {
    const pos = adhanaEphemeris.planets[b as keyof typeof adhanaEphemeris.planets];
    if (pos) {
      const sIdx = Math.floor(pos.siderealLongitude / 30);
      const h = ((sIdx - adhanaAscSignIdx + 12) % 12) + 1;
      if ([1, 4, 7, 10, 5, 9].includes(h)) {
        beneficsInKendrasTrikonas.push(`${b} in H${h}`);
        protectionScore += 10;
        garbhaKavachamFactors.push(`Benefic ${b} fortified in House ${h} shields the foetus from structural harm.`);
      }
    }
  }

  for (const m of malefics) {
    const pos = adhanaEphemeris.planets[m as keyof typeof adhanaEphemeris.planets];
    if (pos) {
      const sIdx = Math.floor(pos.siderealLongitude / 30);
      const h = ((sIdx - adhanaAscSignIdx + 12) % 12) + 1;
      if ([8, 12].includes(h)) {
        maleficsInDusthanas.push(`${m} in H${h}`);
        protectionScore -= 8;
      }
    }
  }

  // Lagna Lord strength
  const lagnaLordPos = adhanaEphemeris.planets[adhanaLagnaLord as keyof typeof adhanaEphemeris.planets];
  if (lagnaLordPos) {
    const sIdx = Math.floor(lagnaLordPos.siderealLongitude / 30);
    const h = ((sIdx - adhanaAscSignIdx + 12) % 12) + 1;
    if ([1, 4, 5, 9, 10, 11].includes(h)) {
      protectionScore += 12;
      garbhaKavachamFactors.push(`Adhana Lagna Lord (${adhanaLagnaLord}) strongly anchored in House ${h} ensures maternal resilience.`);
    }
  }

  protectionScore = Math.max(35, Math.min(98, protectionScore));
  let protectionVerdict: GarbhaRakshaAnalysis["verdict"] = "Auspicious Protection (शुभ रक्षा)";
  if (protectionScore >= 80) protectionVerdict = "Supreme Divine Shield (उत्कृष्ट गर्भ रक्षा)";
  else if (protectionScore >= 65) protectionVerdict = "Auspicious Protection (शुभ रक्षा)";
  else if (protectionScore >= 50) protectionVerdict = "Moderate Vitality (साधारण)";
  else protectionVerdict = "Vulnerable / Remedial Care Needed (सावधानी)";

  const garbhaRaksha: GarbhaRakshaAnalysis = {
    protectionScore,
    verdict: protectionVerdict,
    beneficsInKendrasTrikonas,
    maleficsInDusthanas,
    garbhaKavachamFactors,
    description: `Garbha Raksha is ${protectionVerdict} (${protectionScore}% vitality). ${beneficsInKendrasTrikonas.length} benefics in angular/trinal sectors secure foetal wellness.`,
  };

  // 6. Adhana to Janma BTR Cross-Verification (Brihat Jataka Ch. 4)
  const janmaAscSignIdx = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const adhanaMoonSignIdx = Math.floor((adhanaEphemeris.planets.Moon?.siderealLongitude || 0) / 30);
  const btrDiff = ((janmaAscSignIdx - adhanaMoonSignIdx + 12) % 12) + 1;

  let btrHarmonicRelationship = "1-1 Harmonious Resonance";
  let btrConfidenceScore = 85;

  if (btrDiff === 1) {
    btrHarmonicRelationship = "Identical Degree Axis (1-1 Prathama)";
    btrConfidenceScore = 95;
  } else if (btrDiff === 7) {
    btrHarmonicRelationship = "Polar Saptama Axis (1-7 Samasaptaka)";
    btrConfidenceScore = 92;
  } else if (btrDiff === 5 || btrDiff === 9) {
    btrHarmonicRelationship = "Trinal Trikona Alignment (1-5-9 Navapanchama)";
    btrConfidenceScore = 90;
  } else if (btrDiff === 4 || btrDiff === 10) {
    btrHarmonicRelationship = "Kendra Angular Axis (1-4-10)";
    btrConfidenceScore = 82;
  } else {
    btrHarmonicRelationship = "Parashari Secondary Harmonic Offset";
    btrConfidenceScore = 75;
  }

  const btrSummary = `Adhana Moon in ${adhanaMoonSign} mathematically aligns with Janma Lagna in ${natalEphemeris.ascendant.rashi.englishName} via ${btrHarmonicRelationship} (${btrConfidenceScore}% BTR Verification Confidence).`;

  const executiveSummary = `Epoch Conception (Adhana) occurred on approx ${estimatedConceptionDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} with Adhana Lagna in ${adhanaLagnaSign} and Adhana Moon in ${adhanaMoonSign} (${gestationDurationDays} days gestation). Foetal Protection Index is ${protectionVerdict} (${protectionScore}%).`;

  return {
    birthDate,
    estimatedConceptionDate,
    gestationDurationDays,
    gestationDurationWeeks,
    location,
    adhanaEphemeris,
    adhanaLagnaSign,
    adhanaLagnaLord,
    adhanaLagnaDegreeStr,
    adhanaMoonSign,
    adhanaMoonNakshatra,
    adhanaMoonDegreeStr,
    gestationalMonths,
    garbhaRaksha,
    btrHarmonicRelationship,
    btrConfidenceScore,
    btrSummary,
    executiveSummary,
  };
}
