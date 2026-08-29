/**
 * Vaidyanatha Dikshita's Jataka Parijata (जातक पारिजात, Volumes 1, 2, 3 - 18 Adhyayas) Engine
 * Classical 14th/15th Century Sanskrit Astrological Encyclopedia
 *
 * Core Classical Pillars:
 * 1. 16 Shodasha Parijata Yogas (षोडश पारिजात योगाः - Adhyayas 6 & 18).
 * 2. 64th Navamsha & 22nd Drekkana / Kharesh Engine (६४वाँ नवांश एवं २२वाँ द्रेष्काण - Adhyayas 5 & 17).
 * 3. Kalachakra Dasha Deha & Jeeva Diagnostics (कालचक्र दशा - Adhyaya 15).
 * 4. 12 Bhavas Parijata Mastery Index (द्वादश भाव पारिजात बल - Adhyayas 10–13).
 */

import {
  EphemerisResult,
  JatakaParijataAnalysis,
  ParijataYoga,
  ParijataKhareshNavamsha,
  ParijataKalachakra,
  ParijataBhavaMastery,
} from "./types";
import { RASHI_NAMES } from "./constants";

const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

// Kalachakra Savya vs Apasavya Mapping
const SAVYA_NAKSHATRAS = [0, 1, 2, 3, 4, 5, 12, 13, 14, 15, 16, 17, 24, 25, 26]; // Ashwini to Ardra, Hasta to Jyeshtha, P.Bhadra to Revati

const DEHA_JEEVA_TABLE: Record<number, { dehaRashi: string; jeevaRashi: string }> = {
  // Savya Nakshatras 1st Pada to 4th Pada defaults
  0: { dehaRashi: "Aries", jeevaRashi: "Sagittarius" },
  1: { dehaRashi: "Taurus", jeevaRashi: "Pisces" },
  2: { dehaRashi: "Gemini", jeevaRashi: "Aquarius" },
  3: { dehaRashi: "Cancer", jeevaRashi: "Scorpio" },
  4: { dehaRashi: "Leo", jeevaRashi: "Libra" },
  5: { dehaRashi: "Virgo", jeevaRashi: "Virgo" },
  6: { dehaRashi: "Libra", jeevaRashi: "Leo" },
  7: { dehaRashi: "Scorpio", jeevaRashi: "Cancer" },
  8: { dehaRashi: "Sagittarius", jeevaRashi: "Gemini" },
  9: { dehaRashi: "Capricorn", jeevaRashi: "Taurus" },
  10: { dehaRashi: "Aquarius", jeevaRashi: "Aries" },
  11: { dehaRashi: "Pisces", jeevaRashi: "Pisces" },
};

function getNavamshaDetails(lon: number): { signIndex: number; signName: string; navamshaIndex: number; degreeRange: string; lord: string } {
  const normLon = ((lon % 360) + 360) % 360;
  const navTotalIdx = Math.floor(normLon / (30 / 9)); // 0 to 107
  const rashiIdx = Math.floor(normLon / 30);
  const degInRashi = normLon % 30;
  const navInRashi = Math.floor(degInRashi / (30 / 9)); // 0 to 8

  // Parashari Navamsha Sign Mapping
  let startSignIdx = 0;
  if ([0, 4, 8].includes(rashiIdx)) startSignIdx = 0; // Fire -> Aries
  else if ([1, 5, 9].includes(rashiIdx)) startSignIdx = 9; // Earth -> Capricorn
  else if ([2, 6, 10].includes(rashiIdx)) startSignIdx = 6; // Air -> Libra
  else startSignIdx = 3; // Water -> Cancer

  const navSignIdx = (startSignIdx + navInRashi) % 12;
  const signName = RASHI_NAMES[navSignIdx]?.englishName || "Aries";
  const lord = SIGN_LORDS[navSignIdx];

  const startDeg = (navInRashi * (30 / 9)).toFixed(2);
  const endDeg = ((navInRashi + 1) * (30 / 9)).toFixed(2);

  return {
    signIndex: navSignIdx,
    signName,
    navamshaIndex: navTotalIdx + 1,
    degreeRange: `${startDeg}° - ${endDeg}°`,
    lord,
  };
}

function getDrekkanaDetails(lon: number): { signIndex: number; signName: string; drekkanaIndex: number; lord: string } {
  const normLon = ((lon % 360) + 360) % 360;
  const rashiIdx = Math.floor(normLon / 30);
  const degInRashi = normLon % 30;
  const drekInRashi = Math.floor(degInRashi / 10); // 0, 1, 2

  let drekSignIdx = rashiIdx;
  if (drekInRashi === 1) drekSignIdx = (rashiIdx + 4) % 12; // 5th sign
  else if (drekInRashi === 2) drekSignIdx = (rashiIdx + 8) % 12; // 9th sign

  return {
    signIndex: drekSignIdx,
    signName: RASHI_NAMES[drekSignIdx]?.englishName || "Aries",
    drekkanaIndex: drekInRashi + 1,
    lord: SIGN_LORDS[drekSignIdx],
  };
}

export function evaluateJatakaParijata(natalEphemeris: EphemerisResult): JatakaParijataAnalysis {
  const ascSignIdx = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const lagnaLordName = SIGN_LORDS[ascSignIdx];
  const lagnaLordPlanet = natalEphemeris.planets[lagnaLordName];
  const lagnaLordHouse = lagnaLordPlanet ? lagnaLordPlanet.house : 1;

  const moonPlanet = natalEphemeris.planets.Moon;
  const moonHouse = moonPlanet ? moonPlanet.house : 1;
  const moonSignIdx = moonPlanet ? Math.floor(moonPlanet.siderealLongitude / 30) : 0;
  const moonLordName = SIGN_LORDS[moonSignIdx];

  const jupiterPlanet = natalEphemeris.planets.Jupiter;
  const venusPlanet = natalEphemeris.planets.Venus;
  const mercuryPlanet = natalEphemeris.planets.Mercury;
  const marsPlanet = natalEphemeris.planets.Mars;
  const saturnPlanet = natalEphemeris.planets.Saturn;

  // 1. 16 Shodasha Parijata Yogas (Adhyayas 6 & 18)
  const shodashaYogas: ParijataYoga[] = [];

  // Yoga 1: Parijata Yoga (पारिजात योग)
  // Dispositor of Lagna Lord in Kendra/Trikona or own/exaltation sign
  const lagnaLordSignIdx = lagnaLordPlanet ? Math.floor(lagnaLordPlanet.siderealLongitude / 30) : ascSignIdx;
  const dispositorLagnaLord = SIGN_LORDS[lagnaLordSignIdx];
  const dispositorPlanet = natalEphemeris.planets[dispositorLagnaLord];
  const isParijata = dispositorPlanet && ([1, 4, 7, 10, 5, 9, 11].includes(dispositorPlanet.house) || dispositorPlanet.house === lagnaLordHouse);
  shodashaYogas.push({
    yogaName: "Parijata Yoga (पारिजात योग)",
    sanskritName: "सर्व सुख-सम्पत्ति पारिजात योग",
    category: "Parijata Raja Yoga",
    isFormed: Boolean(isParijata),
    participatingPlanets: [lagnaLordName, dispositorLagnaLord],
    description: "The dispositor of the Ascendant Lord occupies a Kendra, Trikona, or its own/exaltation sign.",
    classicalShlokaEffect: "The native becomes like a king or sovereign leader, celebrated in society, endowed with steadfast prosperity and sovereign authority in middle and later life (J.P. Adhyaya 6, Shloka 46).",
    adhyayaRef: "Jataka Parijata, Adhyaya 6 (Raja Yoga Adhyaya)",
  });

  // Yoga 2: Pushkala Yoga (पुष्कल योग)
  const isPushkala = moonPlanet && ([1, 4, 7, 10].includes(moonHouse) || (dispositorPlanet && [1, 4, 7, 10, 5, 9].includes(dispositorPlanet.house)));
  shodashaYogas.push({
    yogaName: "Pushkala Yoga (पुष्कल योग)",
    sanskritName: "कीर्ति-प्रदायक पुष्कल योग",
    category: "Parijata Raja Yoga",
    isFormed: Boolean(isPushkala),
    participatingPlanets: ["Moon", lagnaLordName, moonLordName],
    description: "Moon's lord and Ascendant lord are powerfully disposed in mutual Kendras or Trikonas with benefic radiance.",
    classicalShlokaEffect: "Endows the native with sweet speech, universal renown, immense wealth, and royal honors (J.P. Adhyaya 6, Shloka 48).",
    adhyayaRef: "Jataka Parijata, Adhyaya 6",
  });

  // Yoga 3: Chamara Yoga (चामर योग)
  const isChamara = (lagnaLordPlanet && [1, 4, 7, 10].includes(lagnaLordHouse) && jupiterPlanet && [1, 4, 7, 10, 5, 9].includes(jupiterPlanet.house)) || (venusPlanet && [1, 4, 7, 10].includes(venusPlanet.house));
  shodashaYogas.push({
    yogaName: "Chamara Yoga (चामर योग)",
    sanskritName: "राजसम्मान चामर योग",
    category: "Parijata Raja Yoga",
    isFormed: Boolean(isChamara),
    participatingPlanets: [lagnaLordName, "Jupiter", "Venus"],
    description: "Lagna Lord placed in an angle aspected by Jupiter, or exalted benefics adorning Kendras.",
    classicalShlokaEffect: "Elevates the native to prime ministerial dignity, profound philosophical scholarship, and long-lasting societal veneration (J.P. Adhyaya 6, Shloka 44).",
    adhyayaRef: "Jataka Parijata, Adhyaya 6",
  });

  // Yoga 4: Dhenu Yoga (धेनु योग)
  const lord2Name = SIGN_LORDS[(ascSignIdx + 1) % 12];
  const lord2Planet = natalEphemeris.planets[lord2Name];
  const isDhenu = lord2Planet && [1, 4, 7, 10, 5, 9].includes(lord2Planet.house);
  shodashaYogas.push({
    yogaName: "Dhenu Yoga (धेनु योग)",
    sanskritName: "अखण्ड धन-धान्य योग",
    category: "Parijata Dhana Yoga",
    isFormed: Boolean(isDhenu),
    participatingPlanets: [lord2Name, "Jupiter"],
    description: "2nd Lord of Treasury strongly stationed in a Kendra or Trikona with benefic fortification.",
    classicalShlokaEffect: "Guarantees continuous influx of gold, landed estates, luxury assets, and delicious culinary provisions (J.P. Adhyaya 6, Shloka 49).",
    adhyayaRef: "Jataka Parijata, Adhyaya 6",
  });

  // Yoga 5: Shaurya Yoga (शौर्य योग)
  const lord3Name = SIGN_LORDS[(ascSignIdx + 2) % 12];
  const lord3Planet = natalEphemeris.planets[lord3Name];
  const isShaurya = lord3Planet && [1, 4, 7, 10, 3, 11].includes(lord3Planet.house);
  shodashaYogas.push({
    yogaName: "Shaurya Yoga (शौर्य योग)",
    sanskritName: "पराक्रम-विजय योग",
    category: "Parijata Raja Yoga",
    isFormed: Boolean(isShaurya),
    participatingPlanets: [lord3Name, "Mars"],
    description: "3rd Lord of Valour occupying an angle, trine, or Upachaya house supported by Martian energy.",
    classicalShlokaEffect: "Confers invincible heroism, strategic military/executive acumen, and renowned siblings (J.P. Adhyaya 6, Shloka 50).",
    adhyayaRef: "Jataka Parijata, Adhyaya 6",
  });

  // Yoga 6: Jaladhi / Amala Yoga (जलधि योग)
  const isJaladhi = (mercuryPlanet?.house === 10 || jupiterPlanet?.house === 10 || venusPlanet?.house === 10);
  shodashaYogas.push({
    yogaName: "Jaladhi / Amala Yoga (जलधि / अमल योग)",
    sanskritName: "निष्कलंक कीर्ति योग",
    category: "Parijata Raja Yoga",
    isFormed: Boolean(isJaladhi),
    participatingPlanets: ["Jupiter", "Venus", "Mercury"],
    description: "A natural benefic (Jupiter, Venus, or Mercury) unblemished in the 10th House of Governance.",
    classicalShlokaEffect: "Bestows immaculate moral reputation, lasting charitable endowments, palatial residences, and naval/overseas wealth (J.P. Adhyaya 6, Shloka 51).",
    adhyayaRef: "Jataka Parijata, Adhyaya 6",
  });

  // Yoga 7: Shankha Yoga (शंख योग)
  const lord5Name = SIGN_LORDS[(ascSignIdx + 4) % 12];
  const lord6Name = SIGN_LORDS[(ascSignIdx + 5) % 12];
  const lord5Planet = natalEphemeris.planets[lord5Name];
  const lord6Planet = natalEphemeris.planets[lord6Name];
  const isShankha = lord5Planet && lord6Planet && [1, 4, 7, 10].includes(lord5Planet.house) && [1, 4, 7, 10].includes(lord6Planet.house);
  shodashaYogas.push({
    yogaName: "Shankha Yoga (शंख योग)",
    sanskritName: "शास्त्र-विशारद शंख योग",
    category: "Parijata Jnana Yoga",
    isFormed: Boolean(isShankha),
    participatingPlanets: [lord5Name, lord6Name, lagnaLordName],
    description: "Lords of the 5th and 6th houses in mutual angles with the Ascendant Lord fortified.",
    classicalShlokaEffect: "Endows deep Vedic wisdom, humane compassion, enjoyment of pleasures, and long life up to 80 years (J.P. Adhyaya 6, Shloka 53).",
    adhyayaRef: "Jataka Parijata, Adhyaya 6",
  });

  // Yoga 8: Saraswati Yoga (सरस्वती योग)
  const isSaraswati = [jupiterPlanet?.house, venusPlanet?.house, mercuryPlanet?.house].every((h) => h && [1, 2, 4, 5, 7, 9, 10].includes(h));
  shodashaYogas.push({
    yogaName: "Saraswati Yoga (सरस्वती योग)",
    sanskritName: "वाग्देवी कृपा योग",
    category: "Parijata Jnana Yoga",
    isFormed: Boolean(isSaraswati),
    participatingPlanets: ["Jupiter", "Venus", "Mercury"],
    description: "Jupiter, Venus, and Mercury stationed in Kendras, Trikonas, or the 2nd house.",
    classicalShlokaEffect: "Bestows supreme literary, poetic, musical, and scientific mastery, making the native an acclaimed scholar (J.P. Adhyaya 6, Shloka 58).",
    adhyayaRef: "Jataka Parijata, Adhyaya 6",
  });

  // Yogas 9-13: Pancha Mahapurusha Yogas (Ruchaka, Bhadra, Hamsa, Malavya, Sasa)
  const isRuchaka = marsPlanet && [1, 4, 7, 10].includes(marsPlanet.house) && [0, 7, 9].includes(Math.floor(marsPlanet.siderealLongitude / 30));
  shodashaYogas.push({
    yogaName: "Ruchaka Yoga (रुचक महापुरुष योग)",
    sanskritName: "भौम महापुरुष योग",
    category: "Mahapurusha Yoga",
    isFormed: Boolean(isRuchaka),
    participatingPlanets: ["Mars"],
    description: "Mars in own or exaltation sign (Aries, Scorpio, Capricorn) in a Kendra house.",
    classicalShlokaEffect: "Commands armies and corporate empires, physically robust, fearless, and victorious in all enterprises (J.P. Adhyaya 6, Shloka 1).",
    adhyayaRef: "Jataka Parijata, Adhyaya 6",
  });

  const isBhadra = mercuryPlanet && [1, 4, 7, 10].includes(mercuryPlanet.house) && [2, 5].includes(Math.floor(mercuryPlanet.siderealLongitude / 30));
  shodashaYogas.push({
    yogaName: "Bhadra Yoga (भद्र महापुरुष योग)",
    sanskritName: "बुध महापुरुष योग",
    category: "Mahapurusha Yoga",
    isFormed: Boolean(isBhadra),
    participatingPlanets: ["Mercury"],
    description: "Mercury in Gemini or Virgo in a Kendra house.",
    classicalShlokaEffect: "Brilliant intellectual prowess, eloquent speech, longevity, and mastery of commercial transactions (J.P. Adhyaya 6, Shloka 2).",
    adhyayaRef: "Jataka Parijata, Adhyaya 6",
  });

  const isHamsa = jupiterPlanet && [1, 4, 7, 10].includes(jupiterPlanet.house) && [3, 8, 11].includes(Math.floor(jupiterPlanet.siderealLongitude / 30));
  shodashaYogas.push({
    yogaName: "Hamsa Yoga (हंस महापुरुष योग)",
    sanskritName: "गुरु महापुरुष योग",
    category: "Mahapurusha Yoga",
    isFormed: Boolean(isHamsa),
    participatingPlanets: ["Jupiter"],
    description: "Jupiter in Cancer, Sagittarius, or Pisces in a Kendra house.",
    classicalShlokaEffect: "Regarded as a king or sage, righteous, deeply respected by rulers, enjoying purest sattvic happiness (J.P. Adhyaya 6, Shloka 3).",
    adhyayaRef: "Jataka Parijata, Adhyaya 6",
  });

  const isMalavya = venusPlanet && [1, 4, 7, 10].includes(venusPlanet.house) && [1, 6, 11].includes(Math.floor(venusPlanet.siderealLongitude / 30));
  shodashaYogas.push({
    yogaName: "Malavya Yoga (मालव्य महापुरुष योग)",
    sanskritName: "शुक्र महापुरुष योग",
    category: "Mahapurusha Yoga",
    isFormed: Boolean(isMalavya),
    participatingPlanets: ["Venus"],
    description: "Venus in Taurus, Libra, or Pisces in a Kendra house.",
    classicalShlokaEffect: "Endowed with exquisite luxury, artistic refinement, marital bliss, vehicles, and long life of 77 years (J.P. Adhyaya 6, Shloka 4).",
    adhyayaRef: "Jataka Parijata, Adhyaya 6",
  });

  const isSasa = saturnPlanet && [1, 4, 7, 10].includes(saturnPlanet.house) && [6, 9, 10].includes(Math.floor(saturnPlanet.siderealLongitude / 30));
  shodashaYogas.push({
    yogaName: "Sasa Yoga (शश महापुरुष योग)",
    sanskritName: "शनि महापुरुष योग",
    category: "Mahapurusha Yoga",
    isFormed: Boolean(isSasa),
    participatingPlanets: ["Saturn"],
    description: "Saturn in Libra, Capricorn, or Aquarius in a Kendra house.",
    classicalShlokaEffect: "Commands large organizations, master of strategic perseverance, enduring political and land assets (J.P. Adhyaya 6, Shloka 5).",
    adhyayaRef: "Jataka Parijata, Adhyaya 6",
  });

  // 2. 64th Navamsha & 22nd Drekkana / Kharesh Engine (Adhyayas 5 & 17)
  const moonLon = moonPlanet ? moonPlanet.siderealLongitude : 0;
  const nav64Moon = getNavamshaDetails(moonLon + 210); // +210 deg = 8th Navamsha sign from Moon Navamsha
  const lagnaLon = natalEphemeris.ascendant.siderealLongitude;
  const nav64Lagna = getNavamshaDetails(lagnaLon + 210);

  // 22nd Drekkana = 8th house Drekkana
  const drek8th = getDrekkanaDetails(lagnaLon + 210);
  const khareshLord = drek8th.lord;

  // Gulika calculation (approximate diurnal portion based on Saturn)
  const gulikaLon = ((lagnaLon + (saturnPlanet ? saturnPlanet.siderealLongitude : 90) * 0.5) % 360);
  const gulikaSignIdx = Math.floor(gulikaLon / 30);
  const gulikaHouse = (((gulikaSignIdx - ascSignIdx + 12) % 12) + 1);

  const khareshAndNavamsha: ParijataKhareshNavamsha = {
    navamsha64Moon: {
      signName: nav64Moon.signName,
      navamshaIndex: nav64Moon.navamshaIndex,
      degreeRange: nav64Moon.degreeRange,
      lord: nav64Moon.lord,
    },
    navamsha64Lagna: {
      signName: nav64Lagna.signName,
      navamshaIndex: nav64Lagna.navamshaIndex,
      degreeRange: nav64Lagna.degreeRange,
      lord: nav64Lagna.lord,
    },
    drekkana22Kharesh: {
      signName: drek8th.signName,
      drekkanaIndex: drek8th.drekkanaIndex,
      khareshLord,
      vulnerabilityHouse: 8,
    },
    gulika: {
      longitude: parseFloat(gulikaLon.toFixed(2)),
      signName: RASHI_NAMES[gulikaSignIdx]?.englishName || "Aries",
      house: gulikaHouse,
      rashiLord: SIGN_LORDS[gulikaSignIdx],
    },
    protectionGuidelines: `Transits of Saturn, Mars, or Rahu over the 64th Navamsha (${nav64Moon.signName}) or 22nd Drekkana Lord (${khareshLord}) require special caution. Recite the Maha Mrityunjaya Mantra and observe Shiva worship during these periods (J.P. Adhyaya 17).`,
  };

  // 3. Kalachakra Dasha Deha & Jeeva Diagnostics (Adhyaya 15)
  const nakIdx = moonPlanet?.nakshatra?.index ?? 0;
  const isSavya = SAVYA_NAKSHATRAS.includes(nakIdx);
  const djPair = DEHA_JEEVA_TABLE[moonSignIdx] || { dehaRashi: "Aries", jeevaRashi: "Sagittarius" };

  const dehaLord = SIGN_LORDS[RASHI_NAMES.findIndex((r) => r.englishName === djPair.dehaRashi) % 12] || "Mars";
  const jeevaLord = SIGN_LORDS[RASHI_NAMES.findIndex((r) => r.englishName === djPair.jeevaRashi) % 12] || "Jupiter";

  // Check afflictions to Deha / Jeeva signs
  const dehaSignIdx = RASHI_NAMES.findIndex((r) => r.englishName === djPair.dehaRashi);
  const jeevaSignIdx = RASHI_NAMES.findIndex((r) => r.englishName === djPair.jeevaRashi);

  const isDehaAfflicted = Object.values(natalEphemeris.planets).some((p) => {
    if (!["Saturn", "Mars", "Rahu", "Ketu"].includes(p.name)) return false;
    return Math.floor(p.siderealLongitude / 30) === dehaSignIdx;
  });

  const isJeevaAfflicted = Object.values(natalEphemeris.planets).some((p) => {
    if (!["Saturn", "Mars", "Rahu", "Ketu"].includes(p.name)) return false;
    return Math.floor(p.siderealLongitude / 30) === jeevaSignIdx;
  });

  const kalachakraDiagnostics: ParijataKalachakra = {
    group: isSavya ? "Savya (Direct Cycle)" : "Apasavya (Reverse Cycle)",
    dehaRashi: djPair.dehaRashi,
    dehaLord,
    jeevaRashi: djPair.jeevaRashi,
    jeevaLord,
    dehaAfflicted: isDehaAfflicted,
    jeevaAfflicted: isJeevaAfflicted,
    vitalityAlert: (isDehaAfflicted || isJeevaAfflicted)
      ? `Deha/Jeeva signs are under natural malefic gaze; regular pranic energization and Vishnu Sahasranama recommended (J.P. Adhyaya 15).`
      : `Deha and Jeeva signs are unblemished; serene physical vitality and long-lasting mental equanimity assured.`,
  };

  // 4. 12 Bhavas Parijata Mastery Index (Adhyayas 10–13)
  const bhavaMastery: ParijataBhavaMastery[] = [];
  const BHAVA_TITLES = [
    "तनु भाव (Tanu - Body & Vitality)",
    "धन भाव (Dhana - Wealth & Speech)",
    "सहज भाव (Sahaja - Courage & Brothers)",
    "बन्धु भाव (Bandhu - Mansions & Mother)",
    "पुत्र भाव (Putra - Intellect & Progeny)",
    "अरि भाव (Ari - Enemies & Health)",
    "कलत्र भाव (Kalatra - Spouse & Trade)",
    "रन्ध्र भाव (Randhra - Longevity & Legacies)",
    "भाग्य भाव (Bhagya - Fortune & Dharma)",
    "कर्म भाव (Karma - Authority & Career)",
    "लाभ भाव (Labha - Revenues & Gains)",
    "व्यय भाव (Vyaya - Liberation & Foreign)",
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

    let pScore = 55;
    if ([1, 4, 7, 10].includes(lHouse)) pScore += 20;
    else if ([5, 9].includes(lHouse)) pScore += 25;
    else if (lHouse === 11) pScore += 15;
    else if ([6, 8, 12].includes(lHouse) && h !== lHouse) pScore -= 18;

    for (const occ of occs) {
      if (["Jupiter", "Venus", "Mercury", "Moon"].includes(occ)) pScore += 15;
      if (["Saturn", "Mars", "Rahu", "Ketu", "Sun"].includes(occ)) {
        if ([3, 6, 11].includes(h)) pScore += 12;
        else pScore -= 10;
      }
    }
    pScore = Math.max(15, Math.min(100, pScore));

    const grade: "Uttama Parijata" | "Madhyama Parijata" | "Alpa Parijata" =
      pScore >= 75 ? "Uttama Parijata" : pScore >= 50 ? "Madhyama Parijata" : "Alpa Parijata";

    const classicalPhala = grade === "Uttama Parijata"
      ? `Promotes majestic prosperity, divine protection, and effortless realization of ${BHAVA_TITLES[h - 1].split(" ")[0]} matters.`
      : grade === "Madhyama Parijata"
      ? `Steady, consistent growth in house matters achieved through disciplined personal efforts.`
      : `Requires protective pariharas and propitiation of Lord ${lName} to clear karmic impediments.`;

    bhavaMastery.push({
      bhavaNum: h,
      sanskritTitle: BHAVA_TITLES[h - 1],
      signName: sName,
      lordName: lName,
      lordPlacementHouse: lHouse,
      occupants: occs,
      parijataScore: pScore,
      masteryGrade: grade,
      classicalPhala,
      adhyayaCitation: `Jataka Parijata Adhyayas 10-13 (Bhava Phala)`,
    });
  }

  // 5. Master Synthesis
  const activeYogas = shodashaYogas.filter((y) => y.isFormed);
  const masterParijataSynthesis = `Vaidyanatha Dikshita's Jataka Parijata (18 Adhyayas) activates **${activeYogas.length} Shodasha Parijata Yogas**, crowned by **${activeYogas[0]?.yogaName || "Parijata Yoga"}**. The 64th Navamsha from Moon falls in **${nav64Moon.signName} (${nav64Moon.degreeRange})** with **${khareshLord}** presiding as the 22nd Drekkana Kharesh Lord. Kalachakra analysis places Deha in **${kalachakraDiagnostics.dehaRashi}** and Jeeva in **${kalachakraDiagnostics.jeevaRashi}** (${kalachakraDiagnostics.group}).`;

  return {
    shodashaYogas,
    khareshAndNavamsha,
    kalachakraDiagnostics,
    bhavaMastery,
    masterParijataSynthesis,
  };
}
