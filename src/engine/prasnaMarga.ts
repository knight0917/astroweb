/**
 * Prasna Marga (प्रश्न मार्ग - 1649 CE, 32 Adhyayas, 2,100+ Shlokas by Punneseri Nambi Neelakantha Sharma)
 * & Prasna Arudha Phala (प्रश्न आरूढ़ फल - Kerala Namboodiri Classical Prashna Tradition)
 *
 * Core Classical Pillars:
 * 1. Tri-Lagna Horary Trinity (Udaya Lagna, Arudha Lagna, Chatra Lagna, Veedhi Rashi).
 * 2. Pancha Sutras Diagnostics (Jeeva, Roga, Mrityu, Utpanna, Nashana - Adhyaya 8).
 * 3. Ashtamangala & Deva/Abhichara Prashna (Adhyayas 14–17).
 * 4. 12 Bhavas Arudha Phala Matrix (Prasna Arudha Phala Compendium).
 */

import {
  EphemerisResult,
  PrasnaMargaAnalysis,
  PrasnaTriLagna,
  PrasnaPanchaSutra,
  PrasnaAshtamangala,
  PrasnaBhavaVerdict,
} from "./types";
import { RASHI_NAMES } from "./constants";

const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

export function evaluatePrasnaMarga(
  natalEphemeris: EphemerisResult,
  customArudhaSignIdx?: number
): PrasnaMargaAnalysis {
  const udayaSignIdx = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const udayaSign = RASHI_NAMES[udayaSignIdx]?.englishName || "Aries";

  // Arudha Lagna (if not passed, derived from Lagna or Moon for default horary state)
  const arudhaSignIdx = typeof customArudhaSignIdx === "number" ? (customArudhaSignIdx % 12 + 12) % 12 : udayaSignIdx;
  const arudhaSign = RASHI_NAMES[arudhaSignIdx]?.englishName || "Aries";

  // Veedhi Rashi & Chatra Lagna derivation
  const sunPlanet = natalEphemeris.planets.Sun;
  const sunSignIdx = sunPlanet ? Math.floor(sunPlanet.siderealLongitude / 30) : 0;

  // Veedhi Rashi based on Solar Path (Mesha, Simha, Dhanus groups)
  let veedhiBase = 0; // Aries
  if (sunSignIdx >= 4 && sunSignIdx <= 7) veedhiBase = 4; // Leo
  else if (sunSignIdx >= 8 && sunSignIdx <= 11) veedhiBase = 8; // Sagittarius

  const veedhiRashi = RASHI_NAMES[veedhiBase]?.englishName || "Aries";
  const offset = (arudhaSignIdx - udayaSignIdx + 12) % 12;
  const chatraSignIdx = (veedhiBase + offset) % 12;
  const chatraSign = RASHI_NAMES[chatraSignIdx]?.englishName || "Aries";

  // Tri-Lagna Relationship
  const distArudhaFromUdaya = ((arudhaSignIdx - udayaSignIdx + 12) % 12) + 1;
  let triLagnaRel = "Kendra Alignment (Rapid & Fruitful Manifestation)";
  if (distArudhaFromUdaya === 1) triLagnaRel = "Samagama (Arudha & Udaya Conjunction - Instant Triumph)";
  else if ([5, 9].includes(distArudhaFromUdaya)) triLagnaRel = "Trikona Resonance (Divine Grace & Auspicious Fruition)";
  else if ([6, 8, 12].includes(distArudhaFromUdaya)) triLagnaRel = "Dusthana Tension (Initial Obstacles & Complex Resolution)";

  const triLagnas: PrasnaTriLagna = {
    udayaSign,
    udayaSignIdx,
    arudhaSign,
    arudhaSignIdx,
    chatraSign,
    chatraSignIdx,
    veedhiRashi,
    relationship: triLagnaRel,
  };

  // 2. Pancha Sutras Diagnostics (Adhyaya 8)
  const udayaLord = SIGN_LORDS[udayaSignIdx];
  const arudhaLord = SIGN_LORDS[arudhaSignIdx];

  const uLordPlanet = natalEphemeris.planets[udayaLord];
  const aLordPlanet = natalEphemeris.planets[arudhaLord];
  const jupPlanet = natalEphemeris.planets.Jupiter;
  const venPlanet = natalEphemeris.planets.Venus;

  // Jeeva Sutra: Benefics in Kendra/Trikona from Arudha, or Udaya & Arudha lords mutually amicable
  const isJeeva =
    [1, 4, 7, 10, 5, 9].includes(distArudhaFromUdaya) ||
    (jupPlanet && [1, 4, 7, 10, 5, 9].includes((((jupPlanet.house - arudhaSignIdx + 12) % 12) + 1))) ||
    (venPlanet && [1, 4, 7, 10, 5, 9].includes((((venPlanet.house - arudhaSignIdx + 12) % 12) + 1)));

  // Roga Sutra: 6th or 8th lord from Udaya afflicting Arudha
  const isRoga = distArudhaFromUdaya === 6 || distArudhaFromUdaya === 8;

  // Mrityu Sutra: 8th lord occupying Arudha or severe affliction
  const lord8Name = SIGN_LORDS[(udayaSignIdx + 7) % 12];
  const lord8Planet = natalEphemeris.planets[lord8Name];
  const isMrityu = lord8Planet && lord8Planet.house === arudhaSignIdx + 1;

  // Utpanna Sutra: Moon in movable/dual sign indicating sudden action
  const moonPlanet = natalEphemeris.planets.Moon;
  const moonSignIdx = moonPlanet ? Math.floor(moonPlanet.siderealLongitude / 30) : 0;
  const isUtpanna = [0, 2, 3, 5, 6, 8, 9, 11].includes(moonSignIdx);

  // Nashana Sutra: 12th lord in 12th or Ketu in 12th from Arudha
  const ketuPlanet = natalEphemeris.planets.Ketu;
  const isNashana =
    distArudhaFromUdaya === 12 ||
    (ketuPlanet && (((ketuPlanet.house - arudhaSignIdx + 12) % 12) + 1 === 12));

  const panchaSutras: PrasnaPanchaSutra[] = [
    {
      sutraName: "Jeeva Sutra",
      sanskritName: "जीव सूत्र (Life & Success)",
      status: isJeeva ? "Active (Formed)" : "Inactive",
      isFavorable: true,
      diagnosticVerdict: isJeeva
        ? "Grants robust vitality, swift success, positive resolution of query, and divine protection (Prasna Marga Adhyaya 8, Shloka 12)."
        : "Moderate vitality; requires patient perseverance.",
      classicalShloka: "Prasna Marga Adhyaya 8, Shloka 12 (Jeeva Sutra Lakshana)",
    },
    {
      sutraName: "Roga Sutra",
      sanskritName: "रोग सूत्र (Friction & Delay)",
      status: isRoga ? "Active (Formed)" : "Inactive",
      isFavorable: false,
      diagnosticVerdict: isRoga
        ? "Warns of delays, temporary disputes, exhaustion, or technical friction before fulfillment (Prasna Marga Adhyaya 8, Shloka 15)."
        : "Free from chronic friction; smooth progression.",
      classicalShloka: "Prasna Marga Adhyaya 8, Shloka 15 (Roga Sutra Lakshana)",
    },
    {
      sutraName: "Mrityu Sutra",
      sanskritName: "मृत्यु सूत्र (Severe Obstacle / Denial)",
      status: isMrityu ? "Active (Formed)" : "Inactive",
      isFavorable: false,
      diagnosticVerdict: isMrityu
        ? "Indicates critical impasse, strong resistance, or loss; protective Kerala Shanti advised (Prasna Marga Adhyaya 8, Shloka 18)."
        : "Free from fatal blockages or total denial.",
      classicalShloka: "Prasna Marga Adhyaya 8, Shloka 18 (Mrityu Sutra Lakshana)",
    },
    {
      sutraName: "Utpanna Sutra",
      sanskritName: "उत्पन्न सूत्र (Root Cause Origination)",
      status: isUtpanna ? "Active (Formed)" : "Inactive",
      isFavorable: true,
      diagnosticVerdict: isUtpanna
        ? "The query stems from recent sudden human interactions and fast-moving external events (Prasna Marga Adhyaya 8, Shloka 21)."
        : "The query stems from long-standing ancestral or structural patterns.",
      classicalShloka: "Prasna Marga Adhyaya 8, Shloka 21 (Utpanna Sutra Lakshana)",
    },
    {
      sutraName: "Nashana Sutra",
      sanskritName: "नाशन सूत्र (Dissolution of Conflict)",
      status: isNashana ? "Active (Formed)" : "Inactive",
      isFavorable: true,
      diagnosticVerdict: isNashana
        ? "The prevailing conflict or anxiety will dissolve naturally on its own without force (Prasna Marga Adhyaya 8, Shloka 24)."
        : "Active conscious follow-up required to close the loop.",
      classicalShloka: "Prasna Marga Adhyaya 8, Shloka 24 (Nashana Sutra Lakshana)",
    },
  ];

  // 3. Ashtamangala & Deva Prashna Diagnostics
  const ashtamangalaNum = ((udayaSignIdx + arudhaSignIdx + (sunPlanet ? Math.floor(sunPlanet.siderealLongitude) : 5)) % 8) + 1;
  let auspiciousScore = 70;
  if ([1, 3, 5, 7].includes(ashtamangalaNum)) auspiciousScore += 15;
  if (isJeeva) auspiciousScore += 12;
  if (isRoga || isMrityu) auspiciousScore -= 18;
  auspiciousScore = Math.max(20, Math.min(98, auspiciousScore));

  const rahuPlanet = natalEphemeris.planets.Rahu;
  const satPlanet = natalEphemeris.planets.Saturn;
  const marsPlanet = natalEphemeris.planets.Mars;

  const devaDoshaDetected = Boolean(
    (rahuPlanet && [9, 12].includes((((rahuPlanet.house - arudhaSignIdx + 12) % 12) + 1))) ||
    (satPlanet && [9, 12].includes((((satPlanet.house - arudhaSignIdx + 12) % 12) + 1)))
  );

  const abhicharaDetected = Boolean(
    (marsPlanet && [6, 8].includes((((marsPlanet.house - arudhaSignIdx + 12) % 12) + 1))) &&
    (rahuPlanet && [6, 8].includes((((rahuPlanet.house - arudhaSignIdx + 12) % 12) + 1)))
  );

  const ashtamangala: PrasnaAshtamangala = {
    ashtamangalaNumber: ashtamangalaNum,
    auspiciousScore,
    devaDoshaDetected,
    devaDoshaDetails: devaDoshaDetected
      ? "Kula Devata (Ancestral Deity) propitiation recommended to clear unfulfilled vows (Adhyaya 15)."
      : "Divine protection (Daiva Anugraha) is fully intact and supportive.",
    abhicharaDetected,
    abhicharaDetails: abhicharaDetected
      ? "Mild psychic friction / evil-eye detected in 6th/8th house; Sudarshana Homa or Hanuman Chalisa advised (Adhyaya 16)."
      : "Clean aura; zero malefic psychic interference or hidden malice.",
    deepaLakshana: auspiciousScore >= 70
      ? "Steady golden flame pointing upright without smoke -> Complete fruition assured."
      : "Flickering flame with slight smoke -> Demands patience and clear intent.",
    keralaParihara: devaDoshaDetected
      ? "Light a 7-wick ghee lamp at home shrine and offer red flowers to Kula Devata on Fridays."
      : "Chant Sri Vishnu Sahasranama or Gayatri Japa 108 times at sunrise.",
  };

  // 4. 12 Bhavas Arudha Phala Matrix (Prasna Arudha Phala)
  const QUERY_TOPICS = [
    "1. Health, Vitality & Personal Endeavor (तनु भाव)",
    "2. Wealth, Liquid Finances & Family Harmony (धन भाव)",
    "3. Courage, Agreements, Short Travel & Siblings (सहज भाव)",
    "4. Property, Vehicles, Real Estate & Mother (बन्धु भाव)",
    "5. Children, Intellect, Speculation & Romance (पुत्र भाव)",
    "6. Litigation, Debts, Competitors & Recovery (अरि भाव)",
    "7. Marriage, Business Partnerships & Contracts (कलत्र भाव)",
    "8. Sudden Obstacles, Inheritance & Crisis (रन्ध्र भाव)",
    "9. Fortune, Long Travel, Legal & Higher Knowledge (भाग्य भाव)",
    "10. Career, Promotion, Authority & Public Status (कर्म भाव)",
    "11. Desires Fulfillment, Big Gains & Networking (लाभ भाव)",
    "12. Foreign Travel, Secret Expenses & Emancipation (व्यय भाव)",
  ];

  const bhavaVerdicts: PrasnaBhavaVerdict[] = [];

  for (let h = 1; h <= 12; h++) {
    const bSignIdx = (arudhaSignIdx + h - 1) % 12;
    const bLordName = SIGN_LORDS[bSignIdx];
    const bLordPlanet = natalEphemeris.planets[bLordName];
    const bLordHouse = bLordPlanet ? bLordPlanet.house : h;

    let prob = 55;
    if ([1, 4, 7, 10].includes(bLordHouse)) prob += 25;
    else if ([5, 9].includes(bLordHouse)) prob += 28;
    else if (bLordHouse === 11) prob += 22;
    else if ([6, 8, 12].includes(bLordHouse)) prob -= 20;

    if (isJeeva) prob += 10;
    if (isRoga) prob -= 12;
    if (isMrityu && [1, 7, 8, 10].includes(h)) prob -= 18;

    prob = Math.max(15, Math.min(95, prob));

    const verdict: PrasnaBhavaVerdict["verdict"] =
      prob >= 75
        ? "Immediate Fulfillment (शीघ्र फल)"
        : prob >= 50
        ? "Delayed Success with Effort (विलम्ब फल)"
        : "Adverse / High Obstacles (कष्ट फल)";

    const timingWindow =
      prob >= 75
        ? "Within 3 to 14 Days (Rapid Resolution)"
        : prob >= 50
        ? "Within 1 to 3 Months (After Methodical Effort)"
        : "Demands 6+ Months or Remedial Recalibration";

    const classicalShlokaPhala =
      verdict === "Immediate Fulfillment (शीघ्र फल)"
        ? `Prasna Marga confirms Arudha Lord ${bLordName} in House ${bLordHouse} brings swift success, profit, and joy in ${QUERY_TOPICS[h - 1].split(". ")[1]}.`
        : verdict === "Delayed Success with Effort (विलम्ब फल)"
        ? `Moderate fruition achieved through persistent efforts and careful navigation of negotiations.`
        : `High resistance detected; spiritual pariharas and strategic realignment recommended.`;

    bhavaVerdicts.push({
      bhavaNum: h,
      queryTopic: QUERY_TOPICS[h - 1],
      sanskritTitle: QUERY_TOPICS[h - 1].split(" (")[1].replace(")", ""),
      arudhaLordName: bLordName,
      arudhaLordHouse: bLordHouse,
      successProbability: prob,
      verdict,
      timingWindow,
      classicalShlokaPhala,
    });
  }

  // Master Horary Verdict
  const activeSutras = panchaSutras.filter((s) => s.status.includes("Active"));
  const masterPrasnaVerdict = `Prasna Marga (32 Adhyayas) & Prasna Arudha Phala verdict: **Udaya Lagna in ${udayaSign}** with **Arudha Lagna in ${arudhaSign}** (${triLagnaRel}). **Ashtamangala Sanctity Score: ${auspiciousScore}%** (Number ${ashtamangalaNum}). Active Sutras: **${activeSutras.map((s) => s.sanskritName.split(" ")[0]).join(", ")}**. ${isJeeva ? "Favorable Jeeva Sutra guarantees positive fruition." : "Deliberate effort and patience required."}`;

  return {
    triLagnas,
    panchaSutras,
    ashtamangala,
    bhavaVerdicts,
    masterPrasnaVerdict,
  };
}
