/**
 * Chappanna or Prasna Sastra Engine (छप्पन प्रश्न शास्त्र — 56 Questions Horary Oracle)
 * Reference:
 * - "Chappanna or Prasna Sastra" by Prof. B. Suryanarain Rao (1946)
 *
 * Core Classical Principles:
 * 1. 56 Exhaustive Horary Question Archetypes across 8 Life Spheres.
 * 2. Real-Time Prasna Lagna, Lagnesha, Karya Bhava & Karyesh Evaluation.
 * 3. Moon (Prasna Manas) Reflexive Disposition.
 * 4. Kala Pramana (Time of Fruition) & Success Probability Meter (0–100%).
 */

import {
  EphemerisResult,
  ChappannaPrasnaAnalysis,
  ChappannaPrasnaQuestion,
} from "./types";
import { RASHI_NAMES } from "./constants";

const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

interface RawPrasnaDef {
  id: number;
  category: ChappannaPrasnaQuestion["category"];
  sanskritName: string;
  questionTitle: string;
  karyaBhava: number;
  karakaPlanet: string;
}

const PRASNA_56_DEFS: RawPrasnaDef[] = [
  // 1. Health & Longevity (1 - 7)
  { id: 1, category: "Health & Longevity", sanskritName: "रोगमुक्ति प्रश्न", questionTitle: "Will the patient recover from illness?", karyaBhava: 1, karakaPlanet: "Sun" },
  { id: 2, category: "Health & Longevity", sanskritName: "व्याधि कारण प्रश्न", questionTitle: "What is the root cause and nature of the ailment?", karyaBhava: 6, karakaPlanet: "Mars" },
  { id: 3, category: "Health & Longevity", sanskritName: "चिकित्सक योग्यता प्रश्न", questionTitle: "Will the physician and medical treatment succeed?", karyaBhava: 10, karakaPlanet: "Jupiter" },
  { id: 4, category: "Health & Longevity", sanskritName: "रोग अवधि प्रश्न", questionTitle: "How long will the disease persist?", karyaBhava: 8, karakaPlanet: "Saturn" },
  { id: 5, category: "Health & Longevity", sanskritName: "औषध सिद्धि प्रश्न", questionTitle: "Will the prescribed medicine act effectively?", karyaBhava: 4, karakaPlanet: "Moon" },
  { id: 6, category: "Health & Longevity", sanskritName: "शल्यक्रिया प्रश्न", questionTitle: "Is surgery / operation advisable and safe?", karyaBhava: 8, karakaPlanet: "Mars" },
  { id: 7, category: "Health & Longevity", sanskritName: "आयुर्दाय प्रश्न", questionTitle: "Longevity and life crisis forecast", karyaBhava: 8, karakaPlanet: "Saturn" },

  // 2. Litigation & Disputes (8 - 14)
  { id: 8, category: "Litigation & Disputes", sanskritName: "वाद-विवाद विजय प्रश्न", questionTitle: "Will I win the lawsuit or legal dispute?", karyaBhava: 6, karakaPlanet: "Mars" },
  { id: 9, category: "Litigation & Disputes", sanskritName: "न्यायाधीश निर्णय प्रश्न", questionTitle: "Will the judge / court rule in my favour?", karyaBhava: 10, karakaPlanet: "Jupiter" },
  { id: 10, category: "Litigation & Disputes", sanskritName: "सन्धि / समझौता प्रश्न", questionTitle: "Is mutual settlement or out-of-court compromise possible?", karyaBhava: 7, karakaPlanet: "Mercury" },
  { id: 11, category: "Litigation & Disputes", sanskritName: "शत्रु सामर्थ्य प्रश्न", questionTitle: "How strong is the adversary / rival?", karyaBhava: 6, karakaPlanet: "Saturn" },
  { id: 12, category: "Litigation & Disputes", sanskritName: "कारागार / बन्धन प्रश्न", questionTitle: "Is there fear of imprisonment or false accusation?", karyaBhava: 12, karakaPlanet: "Rahu" },
  { id: 13, category: "Litigation & Disputes", sanskritName: "साक्षी सत्यता प्रश्न", questionTitle: "Will witnesses speak truth in the trial?", karyaBhava: 3, karakaPlanet: "Mercury" },
  { id: 14, category: "Litigation & Disputes", sanskritName: "विवाद समाप्ति काल प्रश्न", questionTitle: "When will this litigation finally conclude?", karyaBhava: 6, karakaPlanet: "Saturn" },

  // 3. Travel & Missing Persons (15 - 21)
  { id: 15, category: "Travel & Missing", sanskritName: "यात्रा मङ्गल प्रश्न", questionTitle: "Will the planned journey be safe and auspicious?", karyaBhava: 9, karakaPlanet: "Jupiter" },
  { id: 16, category: "Travel & Missing", sanskritName: "प्रवासी आगमन प्रश्न", questionTitle: "When will the traveler / foreign relative return?", karyaBhava: 4, karakaPlanet: "Moon" },
  { id: 17, category: "Travel & Missing", sanskritName: "गुमशुदा व्यक्ति प्रश्न", questionTitle: "Is the missing person alive and safe?", karyaBhava: 7, karakaPlanet: "Jupiter" },
  { id: 18, category: "Travel & Missing", sanskritName: "विदेश वास लाभ प्रश्न", questionTitle: "Will residing abroad bring wealth and success?", karyaBhava: 12, karakaPlanet: "Venus" },
  { id: 19, category: "Travel & Missing", sanskritName: "यात्रा विघ्न प्रश्न", questionTitle: "Will there be flight/train delays or travel obstacles?", karyaBhava: 3, karakaPlanet: "Rahu" },
  { id: 20, category: "Travel & Missing", sanskritName: "दिशा निर्णय प्रश्न", questionTitle: "Which geographical direction is most favorable to travel?", karyaBhava: 9, karakaPlanet: "Sun" },
  { id: 21, category: "Travel & Missing", sanskritName: "तीर्थयात्रा सिद्धि प्रश्न", questionTitle: "Will the pilgrimage / spiritual retreat fulfill its purpose?", karyaBhava: 9, karakaPlanet: "Jupiter" },

  // 4. Stolen & Lost Objects (22 - 28)
  { id: 22, category: "Stolen & Lost", sanskritName: "नष्ट वस्तु प्राप्ति प्रश्न", questionTitle: "Will the lost / stolen property be recovered?", karyaBhava: 2, karakaPlanet: "Jupiter" },
  { id: 23, category: "Stolen & Lost", sanskritName: "चोर पहचान प्रश्न", questionTitle: "Who is the thief (insider or outsider)?", karyaBhava: 7, karakaPlanet: "Mercury" },
  { id: 24, category: "Stolen & Lost", sanskritName: "स्थान निर्देश प्रश्न", questionTitle: "Where is the lost object located right now?", karyaBhava: 4, karakaPlanet: "Moon" },
  { id: 25, category: "Stolen & Lost", sanskritName: "प्राप्ति काल प्रश्न", questionTitle: "How many days/weeks until the item is found?", karyaBhava: 11, karakaPlanet: "Venus" },
  { id: 26, category: "Stolen & Lost", sanskritName: "धन हानि क्षतिपूर्ति प्रश्न", questionTitle: "Will insurance or financial recovery compensate loss?", karyaBhava: 11, karakaPlanet: "Mercury" },
  { id: 27, category: "Stolen & Lost", sanskritName: "गुप्त धन प्रश्न", questionTitle: "Is there hidden treasure or undisclosed asset?", karyaBhava: 8, karakaPlanet: "Saturn" },
  { id: 28, category: "Stolen & Lost", sanskritName: "दस्तावेज़ प्राप्ति प्रश्न", questionTitle: "Will missing documents / deeds be recovered?", karyaBhava: 3, karakaPlanet: "Mercury" },

  // 5. Trade & Financial Profit (29 - 35)
  { id: 29, category: "Trade & Finance", sanskritName: "व्यापार लाभ प्रश्न", questionTitle: "Will this business venture / contract yield good profits?", karyaBhava: 11, karakaPlanet: "Mercury" },
  { id: 30, category: "Trade & Finance", sanskritName: "साझेदारी प्रश्न", questionTitle: "Is this business partnership trustworthy and fruitful?", karyaBhava: 7, karakaPlanet: "Jupiter" },
  { id: 31, category: "Trade & Finance", sanskritName: "शेयर बाज़ार / सट्टा प्रश्न", questionTitle: "Will investment in stocks/speculation bring gains?", karyaBhava: 5, karakaPlanet: "Mercury" },
  { id: 32, category: "Trade & Finance", sanskritName: "उधार वसूली प्रश्न", questionTitle: "Will bad debts or loaned money be recovered?", karyaBhava: 11, karakaPlanet: "Jupiter" },
  { id: 33, category: "Trade & Finance", sanskritName: "ऋण प्राप्ति प्रश्न", questionTitle: "Will the bank loan / venture funding be sanctioned?", karyaBhava: 6, karakaPlanet: "Venus" },
  { id: 34, category: "Trade & Finance", sanskritName: "वस्तु भाव वृद्धि प्रश्न", questionTitle: "Will commodity / gold prices rise or fall?", karyaBhava: 2, karakaPlanet: "Sun" },
  { id: 35, category: "Trade & Finance", sanskritName: "दिवाला / आर्थिक संकट प्रश्न", questionTitle: "Can bankruptcy or major financial loss be averted?", karyaBhava: 12, karakaPlanet: "Jupiter" },

  // 6. Career & Honours (36 - 42)
  { id: 36, category: "Career & Honours", sanskritName: "नौकरी प्राप्ति प्रश्न", questionTitle: "Will I secure employment / clear the job interview?", karyaBhava: 10, karakaPlanet: "Sun" },
  { id: 37, category: "Career & Honours", sanskritName: "पदोन्नति प्रश्न", questionTitle: "Will I receive promotion and salary hike?", karyaBhava: 10, karakaPlanet: "Jupiter" },
  { id: 38, category: "Career & Honours", sanskritName: "राजसम्मान प्रश्न", questionTitle: "Will I gain government award or state recognition?", karyaBhava: 10, karakaPlanet: "Sun" },
  { id: 39, category: "Career & Honours", sanskritName: "स्थानान्तरण प्रश्न", questionTitle: "Will my job transfer be approved or cancelled?", karyaBhava: 3, karakaPlanet: "Moon" },
  { id: 40, category: "Career & Honours", sanskritName: "अधिकारी कृपा प्रश्न", questionTitle: "Will the superior / boss support my proposal?", karyaBhava: 9, karakaPlanet: "Jupiter" },
  { id: 41, category: "Career & Honours", sanskritName: "व्यवसाय परिवर्तन प्रश्न", questionTitle: "Is switching profession or company advisable?", karyaBhava: 10, karakaPlanet: "Mercury" },
  { id: 42, category: "Career & Honours", sanskritName: "राजनीतिक विजय प्रश्न", questionTitle: "Will I succeed in election or leadership contest?", karyaBhava: 10, karakaPlanet: "Sun" },

  // 7. Marriage & Children (43 - 49)
  { id: 43, category: "Marriage & Children", sanskritName: "विवाह सिद्धि प्रश्न", questionTitle: "Will the marriage proposal be finalized successfully?", karyaBhava: 7, karakaPlanet: "Venus" },
  { id: 44, category: "Marriage & Children", sanskritName: "जीवनसाथी स्वरूप प्रश्न", questionTitle: "What will be the nature and character of the spouse?", karyaBhava: 7, karakaPlanet: "Jupiter" },
  { id: 45, category: "Marriage & Children", sanskritName: "दाम्पत्य कलह प्रश्न", questionTitle: "Will husband-wife discord resolve peacefully?", karyaBhava: 7, karakaPlanet: "Moon" },
  { id: 46, category: "Marriage & Children", sanskritName: "सन्तान प्राप्ति प्रश्न", questionTitle: "Will we be blessed with progeny / childbirth?", karyaBhava: 5, karakaPlanet: "Jupiter" },
  { id: 47, category: "Marriage & Children", sanskritName: "गर्भावस्था सुरक्षा प्रश्न", questionTitle: "Will pregnancy proceed smoothly without complications?", karyaBhava: 5, karakaPlanet: "Moon" },
  { id: 48, category: "Marriage & Children", sanskritName: "सन्तान विद्या प्रश्न", questionTitle: "Will the child excel in competitive examinations?", karyaBhava: 5, karakaPlanet: "Mercury" },
  { id: 49, category: "Marriage & Children", sanskritName: "पुनर्विवाह प्रश्न", questionTitle: "Will remarriage or second alliance be auspicious?", karyaBhava: 9, karakaPlanet: "Venus" },

  // 8. Agriculture & Property (50 - 56)
  { id: 50, category: "Agriculture & Property", sanskritName: "वृष्टि एवं मेघ प्रश्न", questionTitle: "Will there be timely rains and good monsoon?", karyaBhava: 4, karakaPlanet: "Venus" },
  { id: 51, category: "Agriculture & Property", sanskritName: "सस्य उत्पत्ति प्रश्न", questionTitle: "Will the agricultural harvest be bountiful?", karyaBhava: 4, karakaPlanet: "Jupiter" },
  { id: 52, category: "Agriculture & Property", sanskritName: "भूमि क्रय प्रश्न", questionTitle: "Is purchasing this plot / land profitable?", karyaBhava: 4, karakaPlanet: "Mars" },
  { id: 53, category: "Agriculture & Property", sanskritName: "भवन निर्माण प्रश्न", questionTitle: "Will house construction complete without hindrance?", karyaBhava: 4, karakaPlanet: "Saturn" },
  { id: 54, category: "Agriculture & Property", sanskritName: "सम्पत्ति विक्रय प्रश्न", questionTitle: "Will real estate / property sell at high price?", karyaBhava: 11, karakaPlanet: "Mercury" },
  { id: 55, category: "Agriculture & Property", sanskritName: "वाहन क्रय प्रश्न", questionTitle: "Is buying a new vehicle / car auspicious?", karyaBhava: 4, karakaPlanet: "Venus" },
  { id: 56, category: "Agriculture & Property", sanskritName: "वास्तु दोष प्रश्न", questionTitle: "Does the residence contain Vastu affliction?", karyaBhava: 4, karakaPlanet: "Mars" },
];

export function evaluateChappannaPrasna(ephemeris: EphemerisResult, requestedId: number = 1): ChappannaPrasnaAnalysis {
  const ascSignIdx = Math.floor(ephemeris.ascendant.siderealLongitude / 30);
  const lagnaSign = RASHI_NAMES[ascSignIdx].englishName;
  const lagnaLord = SIGN_LORDS[ascSignIdx];

  const moonObj = ephemeris.planets.Moon;
  const moonSignIdx = moonObj ? Math.floor(moonObj.siderealLongitude / 30) : 0;
  const moonSign = RASHI_NAMES[moonSignIdx].englishName;
  const moonLord = SIGN_LORDS[moonSignIdx];

  const planets = ephemeris.planets;

  const allQuestions: ChappannaPrasnaQuestion[] = PRASNA_56_DEFS.map((def) => {
    // Determine Karyesh
    const karyaSignIdx = (ascSignIdx + def.karyaBhava - 1) % 12;
    const karyeshBhavaLord = SIGN_LORDS[karyaSignIdx];
    const karyeshPlanet = planets[karyeshBhavaLord] ? karyeshBhavaLord : def.karakaPlanet;
    const karyeshObj = planets[karyeshPlanet];
    const lagneshObj = planets[lagnaLord];

    let score = 50;

    // Evaluate Lagnesha dignity
    if (lagneshObj && [1, 4, 7, 10, 5, 9, 11].includes(lagneshObj.house)) score += 18;
    else score -= 10;

    // Evaluate Karyesh dignity
    if (karyeshObj && [1, 4, 7, 10, 5, 9, 11].includes(karyeshObj.house)) score += 18;
    else score -= 10;

    // Evaluate Moon (Prasna Manas)
    if (moonObj && [1, 4, 7, 10, 5, 9, 11].includes(moonObj.house)) score += 14;

    score = Math.max(20, Math.min(95, score));

    let outcomeStatus: ChappannaPrasnaQuestion["outcomeStatus"] = "Moderate / Delayed Success (विलम्बित फल)";
    let timingOfFruition = "Medium Term (1 to 3 Months)";

    if (score >= 75) {
      outcomeStatus = "Highly Favorable / Immediate Success (शीघ्र कार्य सिद्धि)";
      timingOfFruition = "Immediate (Within Days to 4 Weeks)";
    } else if (score < 50) {
      outcomeStatus = "Obstruction / Unfavorable (कार्य हानि)";
      timingOfFruition = "Delayed / Requires Remedies (Beyond 6 Months)";
    }

    const oracleVerdict =
      score >= 75
        ? `Prof. B. Suryanarain Rao Oracle: Auspicious disposition between Lagnesha (${lagnaLord}) and Karyesh (${karyeshPlanet}). Immediate success assured.`
        : score >= 50
        ? `Prof. B. Suryanarain Rao Oracle: Moderate alignment. Outcome manifests after deliberate effort and intermediate delays.`
        : `Prof. B. Suryanarain Rao Oracle: Karyesh ${karyeshPlanet} or Lagnesha face obstructive houses. Proceed with extreme caution and perform pariharas.`;

    const classicalGuidance =
      score >= 70
        ? `Favorable Horary window active. Proceed confidently with the matter.`
        : `Strengthen ${def.karakaPlanet} and Lagna lord ${lagnaLord} before undertaking decisive steps.`;

    return {
      id: def.id,
      category: def.category,
      sanskritName: def.sanskritName,
      questionTitle: def.questionTitle,
      karyaBhava: def.karyaBhava,
      karyeshPlanet,
      outcomeStatus,
      successProbability: score,
      timingOfFruition,
      oracleVerdict,
      classicalGuidance,
    };
  });

  const targetId = requestedId >= 1 && requestedId <= 56 ? requestedId : 1;
  const selectedQuestion = allQuestions.find((q) => q.id === targetId) || allQuestions[0];

  const favorableCount = allQuestions.filter((q) => q.outcomeStatus.includes("Highly Favorable")).length;

  const masterPrasnaSynthesis = `Chappanna Prasna Sastra Oracle (56 Questions by Prof. B. Suryanarain Rao): Prasna Lagna **${lagnaSign}** (Lord: ${lagnaLord}), Moon in **${moonSign}** (Lord: ${moonLord}). Selected Question #${selectedQuestion.id} "${selectedQuestion.questionTitle}" -> **${selectedQuestion.outcomeStatus.split(" (")[0]} (${selectedQuestion.successProbability}%)**, Timing: **${selectedQuestion.timingOfFruition}**. Active Favorable Query Archetypes: **${favorableCount} of 56**.`;

  return {
    totalQuestionsCount: 56,
    selectedQuestion,
    allQuestions,
    lagnaSign,
    lagnaLord,
    moonSign,
    moonLord,
    masterPrasnaSynthesis,
  };
}
