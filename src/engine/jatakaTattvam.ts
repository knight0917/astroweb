/**
 * Mahadeva's Jataka Tattvam (5 Sutra Vivekas) Engine
 * Classical Sanskrit Aphorisms Treatise translated by Kadalangudi Natesa Sastri.
 * Evaluates Samjna, Sutika, Prakirna (Raja/Dhana Yogas), Stri Jataka, and 12 Bhavas Sutras.
 */

import { EphemerisResult, JatakaTattvamAnalysis, JatakaTattvamBhavaScore, JatakaTattvamSutra } from "./types";
import { RASHI_NAMES } from "./constants";

export function evaluateJatakaTattvam(ephemeris: EphemerisResult): JatakaTattvamAnalysis {
  const activeSutras: JatakaTattvamSutra[] = [];
  const ascLon = ephemeris.ascendant.siderealLongitude;
  const ascRashiIdx = Math.floor(ascLon / 30);
  const planets = ephemeris.planets;

  // Helper to find which house a planet is in (1-12)
  const getHouse = (pName: string): number => planets[pName]?.house || 1;
  const getSignIdx = (pName: string): number => {
    const p = planets[pName];
    return p ? Math.floor(p.siderealLongitude / 30) : 0;
  };

  // Helper: Lord of a house (1-12)
  const getHouseLord = (houseNum: number): string => {
    const targetSignIdx = (ascRashiIdx + houseNum - 1) % 12;
    return RASHI_NAMES[targetSignIdx].lord;
  };

  const l1Lord = getHouseLord(1);
  const l2Lord = getHouseLord(2);
  const l4Lord = getHouseLord(4);
  const l5Lord = getHouseLord(5);
  const l6Lord = getHouseLord(6);
  const l7Lord = getHouseLord(7);
  const l8Lord = getHouseLord(8);
  const l9Lord = getHouseLord(9);
  const l10Lord = getHouseLord(10);
  const l11Lord = getHouseLord(11);
  const l12Lord = getHouseLord(12);

  // 1. Samjna & Sutika Viveka (Infant Vitality & Auspicious Lagna)
  const isL1Strong = [1, 4, 5, 7, 9, 10, 11].includes(getHouse(l1Lord));
  activeSutras.push({
    id: "JT-SAMJNA-1",
    viveka: "Samjna (संज्ञा)",
    sanskritSutra: "लग्नेशे केन्द्रत्रिकोणगे बलिनि देहसौख्यम्",
    englishTranslation: "When the Lagna lord is posited in a Kendra or Trikona with vitality, physical well-being and bodily constitution are assured.",
    isActivated: isL1Strong,
    potencyScore: isL1Strong ? 90 : 45,
    lifeSignification: "Foundational vitality and bodily stamina.",
  });

  const jupInKendra = [1, 4, 7, 10].includes(getHouse("Jupiter"));
  activeSutras.push({
    id: "JT-SUTIKA-1",
    viveka: "Sutika (सूतिका)",
    sanskritSutra: "केन्द्रे देवगुरौ स्थिते सकलारिष्टभङ्गः",
    englishTranslation: "When Jupiter is stationed in an angular house (Kendra), thousands of natal afflictions (Arishtas) are dissolved like mist before the sun.",
    isActivated: jupInKendra,
    potencyScore: jupInKendra ? 95 : 30,
    lifeSignification: "Universal protective shield against early hazards.",
  });

  // 2. Prakirna Viveka (Raja & Dhana Yogas)
  const dharmaKarmaYoga = (getHouse(l9Lord) === 10 && getHouse(l10Lord) === 9) || (getHouse(l9Lord) === getHouse(l10Lord) && [1, 4, 5, 7, 9, 10, 11].includes(getHouse(l9Lord)));
  activeSutras.push({
    id: "JT-PRAKIRNA-1",
    viveka: "Prakirna (प्रकीर्ण)",
    sanskritSutra: "धर्मकर्माधिपयोः सम्बन्धे राजयोगः",
    englishTranslation: "Mutual connection or conjunction between 9th Lord (Dharma) and 10th Lord (Karma) forms supreme Raja Yoga conferring royal authority and ethical enterprise.",
    isActivated: dharmaKarmaYoga,
    potencyScore: dharmaKarmaYoga ? 95 : 40,
    lifeSignification: "High societal standing, executive power, and dharmic career fame.",
  });

  const vasumatiYoga = [3, 6, 10, 11].includes(getHouse("Jupiter")) && [3, 6, 10, 11].includes(getHouse("Venus")) && [3, 6, 10, 11].includes(getHouse("Mercury"));
  activeSutras.push({
    id: "JT-PRAKIRNA-2",
    viveka: "Prakirna (प्रकीर्ण)",
    sanskritSutra: "उपचयेषु शुभग्रहेषु वसुमती योगः",
    englishTranslation: "All natural benefics (Jupiter, Venus, Mercury) posited in Upachaya houses (3, 6, 10, 11) constitute Vasumati Yoga, granting inexhaustible wealth.",
    isActivated: vasumatiYoga,
    potencyScore: vasumatiYoga ? 92 : 50,
    lifeSignification: "Independent self-generated prosperity and freedom from financial dependency.",
  });

  // 3. Stri Jataka Viveka
  const moonVenusHarmonious = Math.abs(getSignIdx("Moon") - getSignIdx("Venus")) % 2 === 0;
  activeSutras.push({
    id: "JT-STRI-1",
    viveka: "Stri (स्त्री)",
    sanskritSutra: "चन्द्रशुक्रयोः सौम्यदृष्टौ सौभाग्यान्वितत्वम्",
    englishTranslation: "Harmonious balance of Moon and Venus with benefic aspects creates enduring marital bliss (Soubhagya) and domestic elegance.",
    isActivated: moonVenusHarmonious,
    potencyScore: moonVenusHarmonious ? 88 : 60,
    lifeSignification: "Domestic grace, fidelity, and marital longevity.",
  });

  // 4. Complete 12 Bhavas Sutras
  const bhavaScores: JatakaTattvamBhavaScore[] = [];

  const BHAVA_DEFS = [
    { num: 1, name: "Tanu (तनू - Stature & Health)", lord: l1Lord, sutra: "लग्ने सौम्ययुते रूपवान्", tr: "Benefics influencing Lagna grant charming appearance and magnetism." },
    { num: 2, name: "Dhana (धन - Wealth & Speech)", lord: l2Lord, sutra: "द्वितीये गुरौ वाक्पतिसमः", tr: "Jupiter or strong 2nd lord in Dhana bhava grants profound eloquence and wealth." },
    { num: 3, name: "Bhratri (भ्रातृ - Courage & Siblings)", lord: getHouseLord(3), sutra: "तृतीये कुजे विक्रमवान्", tr: "Mars or 3rd lord well posited bestows indomitable courage and leadership." },
    { num: 4, name: "Sukha (सुख - Home & Mother)", lord: l4Lord, sutra: "चतुर्थे शुभे सर्वसुखसिद्धिः", tr: "4th house fortified by benefics brings domestic peace, vehicles, and landed property." },
    { num: 5, name: "Putra (पुत्र - Intellect & Children)", lord: l5Lord, sutra: "पञ्चमे धीमत्त्वं पूर्वपुण्यवृद्धिः", tr: "Fortified 5th house unlocks sharp counsel, creative genius, and Purva Punya." },
    { num: 6, name: "Shatru (शत्रु - Victory & Health)", lord: l6Lord, sutra: "षष्ठे पापैः शत्रुदमनम्", tr: "Malefics in 6th house crush opposition, litigations, and debts." },
    { num: 7, name: "Kalatra (कलत्र - Marriage & Union)", lord: l7Lord, sutra: "सप्तमे शुभे सुशीला भार्या", tr: "Benefic influence on 7th bhava guarantees a virtuous, affectionate life partner." },
    { num: 8, name: "Ayur (आयुः - Longevity & Mysticism)", lord: l8Lord, sutra: "अष्टमेशे दीर्घायुः रहस्यज्ञः", tr: "Well-placed 8th lord bestows full longevity and mastery of deep occult truths." },
    { num: 9, name: "Bhagya (भाग्य - Fortune & Dharma)", lord: l9Lord, sutra: "नवमे धर्मवृद्धिः सर्वभाग्यम्", tr: "Fortified 9th house brings divine grace, pilgrimages, and fatherly benevolence." },
    { num: 10, name: "Karma (कर्म - Profession & Fame)", lord: l10Lord, sutra: "दशमे रवौ वा गुरौ कीर्तिमान्", tr: "Sun, Jupiter, or 10th lord in 10th confers executive command and public honor." },
    { num: 11, name: "Labha (लाभ - Gains & Desires)", lord: l11Lord, sutra: "एकादशे शुभैः विपुलधनलाभः", tr: "Benefics in 11th house grant effortless fulfillment of aspirations and continuous revenues." },
    { num: 12, name: "Vyaya (व्यय - Foreign & Moksha)", lord: l12Lord, sutra: "द्वादशे शुभे मोक्षमार्गप्रवेशः", tr: "Benefics in 12th direct expenditure toward philanthropic and spiritual liberation." },
  ];

  BHAVA_DEFS.forEach((b) => {
    const lordHouse = getHouse(b.lord);
    const isLordWellPlaced = [1, 2, 4, 5, 7, 9, 10, 11].includes(lordHouse);
    const score = isLordWellPlaced ? 85 : 55;

    activeSutras.push({
      id: `JT-BHAVA-${b.num}`,
      viveka: "Bhava (भाव)",
      bhavaNumber: b.num,
      sanskritSutra: b.sutra,
      englishTranslation: b.tr,
      isActivated: isLordWellPlaced,
      potencyScore: score,
      lifeSignification: `Manifestation of ${b.name} through classical Mahadeva principles.`,
    });

    bhavaScores.push({
      bhavaNumber: b.num,
      bhavaName: b.name,
      bhavaLord: b.lord,
      activeSutrasCount: 1,
      compositeHealth: score,
      verdict: score >= 80 ? "Flourishing (उत्कृष्ट)" : "Moderate (मध्यम)",
    });
  });

  const prakirnaRajaYogas: string[] = [];
  if (dharmaKarmaYoga) prakirnaRajaYogas.push("Dharma-Karmadhipati Yoga (9th & 10th Lords aligned) -> Royal status and executive triumph.");
  if (vasumatiYoga) prakirnaRajaYogas.push("Vasumati Yoga (Benefics in Upachayas) -> Inexhaustible self-made prosperity.");
  if (jupInKendra) prakirnaRajaYogas.push("Hamsa/Amala Kendra Jupiter -> Supreme protective cloak over all life endeavors.");

  const striJatakaInsights: string[] = [
    moonVenusHarmonious ? "Moon-Venus harmonious resonance establishes mutual empathy and emotional contentment in marriage." : "Moon-Venus dynamic warrants active communication to balance emotional expectations.",
  ];

  const masterJatakaTattvamSynthesis = `Mahadeva's Jataka Tattvam analysis identifies ${activeSutras.filter((s) => s.isActivated).length} fully activated classical Sutras. Foundational strength centers on House ${bhavaScores.reduce((prev, curr) => (curr.compositeHealth > prev.compositeHealth ? curr : prev)).bhavaNumber} (${bhavaScores.reduce((prev, curr) => (curr.compositeHealth > prev.compositeHealth ? curr : prev)).bhavaName}).`;

  return {
    activeSutras,
    bhavaScores,
    prakirnaRajaYogas,
    striJatakaInsights,
    masterJatakaTattvamSynthesis,
  };
}
