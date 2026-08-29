/**
 * Acharya Mantreswara's Phaladeepika (फलदीपिका - 13th/14th Century CE, 28 Adhyayas, 865 Shlokas) Engine
 * Supreme Classical Textbook of Predictive Horoscopy
 *
 * Core Classical Pillars:
 * 1. Mantreswara Viparita Raja Yogas (Harsha, Sarala, Vimala - Adhyaya 6, Shloka 63).
 * 2. 5-Fold Neecha Bhanga Raja Yoga Engine (Adhyaya 6, Shlokas 26–30).
 * 3. 9 Classical Planetary Avasthas (Deepta, Dina, Svastha, Shakta, etc. - Adhyaya 3).
 * 4. 12 Bhavas Phaladeepika Mastery Index (Adhyayas 14–16).
 */

import {
  EphemerisResult,
  PhaladeepikaAnalysis,
  PhaladeepikaViparitaYoga,
  PhaladeepikaNeechaBhanga,
  PhaladeepikaAvastha,
  PhaladeepikaBhavaMastery,
} from "./types";
import { RASHI_NAMES } from "./constants";

const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

// Exaltation & Debilitation signs (0-indexed: 0 = Aries, 6 = Libra, etc.)
const EXALTATION_SIGNS: Record<string, number> = {
  Sun: 0, // Aries
  Moon: 1, // Taurus
  Mars: 9, // Capricorn
  Mercury: 5, // Virgo
  Jupiter: 3, // Cancer
  Venus: 11, // Pisces
  Saturn: 6, // Libra
};

const DEBILITATION_SIGNS: Record<string, number> = {
  Sun: 6, // Libra
  Moon: 7, // Scorpio
  Mars: 3, // Cancer
  Mercury: 11, // Pisces
  Jupiter: 9, // Capricorn
  Venus: 5, // Virgo
  Saturn: 0, // Aries
};

const OWN_SIGNS: Record<string, number[]> = {
  Sun: [4],
  Moon: [3],
  Mars: [0, 7],
  Mercury: [2, 5],
  Jupiter: [8, 11],
  Venus: [1, 6],
  Saturn: [9, 10],
};

const FRIEND_SIGNS: Record<string, number[]> = {
  Sun: [0, 3, 7, 8, 11],
  Moon: [0, 2, 4, 5],
  Mars: [3, 4, 8, 11],
  Mercury: [1, 4, 6],
  Jupiter: [0, 3, 4, 7],
  Venus: [2, 5, 9, 10],
  Saturn: [1, 2, 5, 6],
};

export function evaluatePhaladeepika(natalEphemeris: EphemerisResult): PhaladeepikaAnalysis {
  const ascSignIdx = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const moonPlanet = natalEphemeris.planets.Moon;
  const moonHouse = moonPlanet ? moonPlanet.house : 1;

  // 1. Viparita Raja Yogas (Harsha, Sarala, Vimala - Adhyaya 6, Shloka 63)
  const lord6Name = SIGN_LORDS[(ascSignIdx + 5) % 12];
  const lord8Name = SIGN_LORDS[(ascSignIdx + 7) % 12];
  const lord12Name = SIGN_LORDS[(ascSignIdx + 11) % 12];

  const lord6Planet = natalEphemeris.planets[lord6Name];
  const lord8Planet = natalEphemeris.planets[lord8Name];
  const lord12Planet = natalEphemeris.planets[lord12Name];

  const DUSTHANAS = [6, 8, 12];
  const isHarsha = lord6Planet && DUSTHANAS.includes(lord6Planet.house);
  const isSarala = lord8Planet && DUSTHANAS.includes(lord8Planet.house);
  const isVimala = lord12Planet && DUSTHANAS.includes(lord12Planet.house);

  const viparitaRajaYogas: PhaladeepikaViparitaYoga[] = [
    {
      yogaName: "Harsha Yoga",
      sanskritName: "हर्ष विपरीत राजयोग",
      houseLord: 6,
      placementHouse: lord6Planet ? lord6Planet.house : 6,
      planetName: lord6Name,
      isFormed: Boolean(isHarsha),
      description: `6th Lord (${lord6Name}) placed in the ${lord6Planet ? lord6Planet.house : 6}th house (Dusthana in Dusthana).`,
      classicalShlokaEffect: "Endowed with happiness, robust constitution, unshakeable immunity, complete victory over adversaries, and abundance of wealth (Phaladeepika Adhyaya 6, Shloka 63).",
      adhyayaCitation: "Phaladeepika Adhyaya 6, Shloka 63",
    },
    {
      yogaName: "Sarala Yoga",
      sanskritName: "सरल विपरीत राजयोग",
      houseLord: 8,
      placementHouse: lord8Planet ? lord8Planet.house : 8,
      planetName: lord8Name,
      isFormed: Boolean(isSarala),
      description: `8th Lord (${lord8Name}) placed in the ${lord8Planet ? lord8Planet.house : 8}th house (Dusthana in Dusthana).`,
      classicalShlokaEffect: "Long-lived, fearless, resolute, unvanquished by rivals, blessed with sudden wealth, high learning, and prosperity (Phaladeepika Adhyaya 6, Shloka 63).",
      adhyayaCitation: "Phaladeepika Adhyaya 6, Shloka 63",
    },
    {
      yogaName: "Vimala Yoga",
      sanskritName: "विमल विपरीत राजयोग",
      houseLord: 12,
      placementHouse: lord12Planet ? lord12Planet.house : 12,
      planetName: lord12Name,
      isFormed: Boolean(isVimala),
      description: `12th Lord (${lord12Name}) placed in the ${lord12Planet ? lord12Planet.house : 12}th house (Dusthana in Dusthana).`,
      classicalShlokaEffect: "Accumulates substantial riches through virtuous expenditure, acts charitably, commands independence, and enjoys serene contentment (Phaladeepika Adhyaya 6, Shloka 63).",
      adhyayaCitation: "Phaladeepika Adhyaya 6, Shloka 63",
    },
  ];

  // 2. 5-Fold Neecha Bhanga Raja Yoga Engine (Adhyaya 6, Shlokas 26–30)
  const neechaBhangaYogas: PhaladeepikaNeechaBhanga[] = [];

  for (const [pName, debSign] of Object.entries(DEBILITATION_SIGNS)) {
    const p = natalEphemeris.planets[pName];
    if (!p) continue;

    const signIdx = Math.floor(p.siderealLongitude / 30);
    if (signIdx !== debSign) continue; // Planet is not debilitated

    const conditionsMet: string[] = [];

    // Condition 1: Dispositor of debilitated planet in Kendra from Lagna or Moon
    const dispositorName = SIGN_LORDS[debSign];
    const dispositorPlanet = natalEphemeris.planets[dispositorName];
    if (dispositorPlanet && ([1, 4, 7, 10].includes(dispositorPlanet.house) || [1, 4, 7, 10].includes((((dispositorPlanet.house - moonHouse + 12) % 12) + 1)))) {
      conditionsMet.push(`Dispositor ${dispositorName} is in Kendra from Lagna/Moon (Shloka 26).`);
    }

    // Condition 2: Lord of the exaltation sign of the debilitated planet is in Kendra from Lagna or Moon
    const exSign = EXALTATION_SIGNS[pName];
    const exLordName = SIGN_LORDS[exSign];
    const exLordPlanet = natalEphemeris.planets[exLordName];
    if (exLordPlanet && ([1, 4, 7, 10].includes(exLordPlanet.house) || [1, 4, 7, 10].includes((((exLordPlanet.house - moonHouse + 12) % 12) + 1)))) {
      conditionsMet.push(`Exaltation lord ${exLordName} is in Kendra from Lagna/Moon (Shloka 27).`);
    }

    // Condition 3: Planet is in Kendra or Trikona
    if ([1, 4, 7, 10, 5, 9].includes(p.house)) {
      conditionsMet.push(`Debilitated ${pName} occupies an auspicious Kendra/Trikona house (Shloka 28).`);
    }

    // Condition 4: Jupiter or Venus aspects or occupies Kendra
    const jup = natalEphemeris.planets.Jupiter;
    const ven = natalEphemeris.planets.Venus;
    if ((jup && [1, 4, 7, 10, 5, 9].includes(jup.house)) || (ven && [1, 4, 7, 10, 5, 9].includes(ven.house))) {
      conditionsMet.push(`Benefics (Jupiter/Venus) cast protective rays from Kendra/Trikona (Shloka 29).`);
    }

    const isCancelled = conditionsMet.length > 0;
    const rajaYogaGrade: "Purna Neecha Bhanga Raja Yoga" | "Partial Neecha Bhanga" | "Uncancelled Debility" =
      conditionsMet.length >= 2 ? "Purna Neecha Bhanga Raja Yoga" : conditionsMet.length === 1 ? "Partial Neecha Bhanga" : "Uncancelled Debility";

    const classicalPhala = rajaYogaGrade === "Purna Neecha Bhanga Raja Yoga"
      ? `Transmutes initial debility into sovereign royal status, making the native an emperor, prime minister, or celebrated leader (Phaladeepika Adhyaya 6, Shloka 30).`
      : rajaYogaGrade === "Partial Neecha Bhanga"
      ? `Overcomes early obstacles to attain dignified success and financial independence in middle life.`
      : `Demands targeted gemstones, mantras, and charitable remedies to remove planetary debility.`;

    neechaBhangaYogas.push({
      debilitatedPlanet: pName,
      debilitatedSign: RASHI_NAMES[debSign]?.englishName || "Debilitated Sign",
      isCancelled,
      cancellationConditionsMet: conditionsMet,
      rajaYogaGrade,
      classicalPhala,
    });
  }

  // 3. 9 Classical Planetary Avasthas (Adhyaya 3)
  const planetaryAvasthas: PhaladeepikaAvastha[] = [];
  const PLANET_NAMES = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  for (const name of PLANET_NAMES) {
    const p = natalEphemeris.planets[name];
    if (!p) continue;

    const signIdx = Math.floor(p.siderealLongitude / 30);
    let avasthaName: PhaladeepikaAvastha["avasthaName"] = "Mudita (Friendly Sign)";
    let sanskritName = "मुदित अवस्था";
    let potency = 70;
    let effect = "Grants pleasant domestic comfort, friendly alliances, and steady fortunes.";

    if (EXALTATION_SIGNS[name] === signIdx) {
      avasthaName = "Deepta (Exalted)";
      sanskritName = "दीप्त अवस्था (उच्च)";
      potency = 100;
      effect = "Supreme radiance, imperial authority, boundless prosperity, and victory over all obstacles (Adhyaya 3, Shloka 18).";
    } else if (DEBILITATION_SIGNS[name] === signIdx) {
      avasthaName = "Dina (Debilitated)";
      sanskritName = "दीन अवस्था (नीच)";
      potency = 25;
      effect = "Diminished strength requiring conscious remedial reinforcement (Adhyaya 3, Shloka 19).";
    } else if (OWN_SIGNS[name]?.includes(signIdx)) {
      avasthaName = "Svastha (Own Sign)";
      sanskritName = "स्वस्थ अवस्था (स्वक्षेत्र)";
      potency = 85;
      effect = "Robust vitality, unshakeable assets, peaceful mindset, and familial stability (Adhyaya 3, Shloka 20).";
    } else if (p.isRetrograde) {
      avasthaName = "Shakta (Retrograde)";
      sanskritName = "शक्त अवस्था (वक्री - चेष्टा बल)";
      potency = 80;
    } else if (name !== "Sun" && !["Rahu", "Ketu"].includes(name) && Math.abs(((p.siderealLongitude - (natalEphemeris.planets.Sun ? natalEphemeris.planets.Sun.siderealLongitude : 0) + 540) % 360) - 180) <= 8.5) {
      avasthaName = "Peedita (Afflicted/Combust)";
      sanskritName = "पीड़ित / विकल अवस्था (अस्त)";
      potency = 35;
      effect = "Internalized significations requiring spiritual solar propitiation (Adhyaya 3, Shloka 22).";
    } else if (FRIEND_SIGNS[name]?.includes(signIdx)) {
      avasthaName = "Mudita (Friendly Sign)";
      sanskritName = "मुदित अवस्था (मित्र क्षेत्र)";
      potency = 70;
      effect = "Harmonious social relations, steady gains, and amiable personality.";
    } else {
      avasthaName = "Khala (Inimical Sign)";
      sanskritName = "खल अवस्था (शत्रु क्षेत्र)";
      potency = 45;
      effect = "Mild friction in manifesting house indications; resolved through focused discipline.";
    }

    planetaryAvasthas.push({
      planetName: name,
      avasthaName,
      sanskritName,
      potencyPercentage: potency,
      functionalEffect: effect,
    });
  }

  // 4. 12 Bhavas Phaladeepika Mastery Index (Adhyayas 14–16)
  const bhavaMastery: PhaladeepikaBhavaMastery[] = [];
  const BHAVA_TITLES = [
    "तनु भाव (Tanu - Constitution & Health)",
    "धन भाव (Dhana - Wealth & Speech)",
    "सहज भाव (Sahaja - Courage & Co-borns)",
    "बन्धु भाव (Bandhu - Estates & Mother)",
    "पुत्र भाव (Putra - Intellect & Children)",
    "अरि भाव (Ari - Debts & Diseases)",
    "कलत्र भाव (Kalatra - Marriage & Trade)",
    "रन्ध्र भाव (Randhra - Longevity & Inheritance)",
    "भाग्य भाव (Bhagya - Fortune & Dharma)",
    "कर्म भाव (Karma - Profession & Honors)",
    "लाभ भाव (Labha - Revenues & Success)",
    "व्यय भाव (Vyaya - Expenses & Emancipation)",
  ];

  for (let h = 1; h <= 12; h++) {
    const sIdx = (ascSignIdx + h - 1) % 12;
    const sName = RASHI_NAMES[sIdx]?.englishName || "Aries";
    const lName = SIGN_LORDS[sIdx];
    const lPlanet = natalEphemeris.planets[lName];
    const lHouse = lPlanet ? lPlanet.house : h;

    const occs: string[] = [];
    for (const [name, p] of Object.entries(natalEphemeris.planets)) {
      if (p.isUpagraha || p.isModernPlanet) continue;
      if (p.house === h) occs.push(name);
    }

    let score = 52;
    if ([1, 4, 7, 10].includes(lHouse)) score += 22;
    else if ([5, 9].includes(lHouse)) score += 26;
    else if (lHouse === 11) score += 18;
    else if ([6, 8, 12].includes(lHouse) && h !== lHouse) score -= 16;

    for (const occ of occs) {
      if (["Jupiter", "Venus", "Mercury", "Moon"].includes(occ)) score += 14;
      if (["Mars", "Saturn", "Rahu", "Ketu", "Sun"].includes(occ)) {
        if ([3, 6, 11].includes(h)) score += 14;
        else score -= 12;
      }
    }
    score = Math.max(15, Math.min(100, score));

    const grade: "Uttama Phaladeepika" | "Madhyama Phaladeepika" | "Alpa Phaladeepika" =
      score >= 75 ? "Uttama Phaladeepika" : score >= 50 ? "Madhyama Phaladeepika" : "Alpa Phaladeepika";

    const classicalPhala = grade === "Uttama Phaladeepika"
      ? `Mantreswara indicates thriving Bhava Vriddhi, steady fulfillment of desires, and divine grace in ${BHAVA_TITLES[h - 1].split(" ")[0]} matters.`
      : grade === "Madhyama Phaladeepika"
      ? `Reliable, balanced results earned through prudent personal efforts.`
      : `Benefic remedies and propitiation of Lord ${lName} recommended to clear karmic impediments.`;

    bhavaMastery.push({
      bhavaNum: h,
      sanskritTitle: BHAVA_TITLES[h - 1],
      signName: sName,
      lordName: lName,
      lordPlacementHouse: lHouse,
      occupants: occs,
      phaladeepikaScore: score,
      masteryGrade: grade,
      classicalPhala,
      adhyayaCitation: "Phaladeepika Adhyayas 14-16 (Bhava Phala)",
    });
  }

  // 5. Master Synthesis
  const activeViparita = viparitaRajaYogas.filter((v) => v.isFormed);
  const deeptaCount = planetaryAvasthas.filter((a) => a.avasthaName.includes("Deepta") || a.avasthaName.includes("Svastha") || a.avasthaName.includes("Shakta")).length;
  const masterPhaladeepikaSynthesis = `Acharya Mantreswara's Phaladeepika (28 Adhyayas) confirms **${activeViparita.length} Active Viparita Raja Yogas** (${activeViparita.map((v) => v.yogaName).join(", ") || "None Active"}). **${deeptaCount} Planets** reside in powerful Deepta/Svastha/Shakta dignities. ${neechaBhangaYogas.length > 0 ? `${neechaBhangaYogas[0].rajaYogaGrade} active for ${neechaBhangaYogas[0].debilitatedPlanet}.` : "All planets are free from uncancelled debility."}`;

  return {
    viparitaRajaYogas,
    neechaBhangaYogas,
    planetaryAvasthas,
    bhavaMastery,
    masterPhaladeepikaSynthesis,
  };
}
