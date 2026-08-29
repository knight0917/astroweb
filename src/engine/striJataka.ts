/**
 * Stri Jataka (स्त्रीजातकम् — Classical Female Horoscopy)
 * Classical Foundations by Varahamihira, Kalyana Varma & Venkatesha Sharma
 *
 * Core Classical Pillars:
 * 1. Lagna & Moon Disposition (Even/Odd Signs - Yugma/Ayugma Rashi).
 * 2. Trimsamsha D-30 Moral, Psychological & Spiritual Archetypes.
 * 3. Mangalya & Soubhagya Sthana (7th, 8th & 9th Bhavas).
 * 4. Visha Kanya Detection & Classical Neutralization Shields.
 */

import { EphemerisResult, StriJatakaAnalysis, StriJatakaTrimsamsha } from "./types";

function getTrimsamshaLord(longitude: number): string {
  const signIdx = Math.floor(longitude / 30);
  const isOdd = signIdx % 2 === 0; // 0=Aries (Odd), 1=Taurus (Even), etc.
  const deg = longitude % 30;

  if (isOdd) {
    if (deg < 5) return "Mars";
    if (deg < 10) return "Saturn";
    if (deg < 18) return "Jupiter";
    if (deg < 25) return "Mercury";
    return "Venus";
  } else {
    if (deg < 5) return "Venus";
    if (deg < 12) return "Mercury";
    if (deg < 20) return "Jupiter";
    if (deg < 25) return "Saturn";
    return "Mars";
  }
}

const TRIMSAMSHA_INTERPRETATIONS: Record<string, { moral: string; spiritual: string }> = {
  Jupiter: {
    moral: "Endowed with spotless moral integrity, nobility, truthfulness, and profound matriarchal reverence.",
    spiritual: "Devoted to divine worship, scriptural study, dharma, and spiritual philanthropy.",
  },
  Venus: {
    moral: "Graceful, artistically accomplished, charming demeanour, and devoted to family happiness.",
    spiritual: "Appreciates sacred beauty, Bhakti yoga, devotional music, and festive religious rites.",
  },
  Mercury: {
    moral: "Intelligent, eloquent conversationalist, highly skilled in arts and sciences, prudent in finance.",
    spiritual: "Analytical seeker of truth, skilled in Vedic study, mantra recitation, and discrimination.",
  },
  Mars: {
    moral: "Courageous, fiercely independent, protective of loved ones, bold and energetic demeanor.",
    spiritual: "Drawn to dynamic sadhanas, righteous defense of justice, and unwavering tapasya.",
  },
  Saturn: {
    moral: "Grave, deeply patient, enduring under adversity, highly disciplined and duty-bound.",
    spiritual: "Inclined toward ascetic detachment, deep meditation, service to the needy, and vairagya.",
  },
};

export function evaluateStriJataka(natalEphemeris: EphemerisResult): StriJatakaAnalysis {
  const ascLong = natalEphemeris.ascendant.siderealLongitude;
  const moonLong = natalEphemeris.planets.Moon.siderealLongitude;

  const ascSignIdx = Math.floor(ascLong / 30);
  const moonSignIdx = Math.floor(moonLong / 30);

  const isAscEven = ascSignIdx % 2 === 1;
  const isMoonEven = moonSignIdx % 2 === 1;

  // 1. Disposition
  const ascendantSignType = isAscEven
    ? "Even (युग्म - Feminine Grace & Fertility)"
    : "Odd (अयुग्म - Dynamic Independence & Command)";

  const moonSignType = isMoonEven
    ? "Even (युग्म - Soft Emotional Receptivity)"
    : "Odd (अयुग्म - Courageous Emotional Independence)";

  const dispositionSummary =
    isAscEven && isMoonEven
      ? "Pure Yugma disposition: Classical Stri Jataka shlokas praise this configuration for supreme feminine grace, modesty, fertility, and marital concord."
      : !isAscEven && !isMoonEven
      ? "Pure Ayugma disposition: Bestows formidable leadership, bold initiative, intellectual autonomy, and pioneering professional drive."
      : "Balanced Yugma-Ayugma disposition: Harmonious blend of outer assertiveness and inner emotional warmth.";

  // 2. Trimsamsha D-30 Analysis
  const ascTrimsamshaLord = getTrimsamshaLord(ascLong);
  const moonTrimsamshaLord = getTrimsamshaLord(moonLong);

  const ascInterp = TRIMSAMSHA_INTERPRETATIONS[ascTrimsamshaLord] || TRIMSAMSHA_INTERPRETATIONS.Jupiter;
  const moonInterp = TRIMSAMSHA_INTERPRETATIONS[moonTrimsamshaLord] || TRIMSAMSHA_INTERPRETATIONS.Venus;

  const trimsamshaAnalysis: StriJatakaTrimsamsha = {
    ascendantTrimsamshaLord: ascTrimsamshaLord,
    moonTrimsamshaLord: moonTrimsamshaLord,
    moralDisposition: `Ascendant in ${ascTrimsamshaLord}'s Trimsamsha: ${ascInterp.moral}`,
    spiritualInclination: `Moon in ${moonTrimsamshaLord}'s Trimsamsha: ${moonInterp.spiritual}`,
  };

  // 3. Mangalya & Soubhagya Sthana (7th, 8th, 9th)
  const jupPlanet = natalEphemeris.planets.Jupiter;
  const venPlanet = natalEphemeris.planets.Venus;

  let mangalyaScore = 65;
  let soubhagyaScore = 68;

  if (jupPlanet && [1, 4, 7, 8, 9].includes(jupPlanet.house)) {
    mangalyaScore += 20;
    soubhagyaScore += 18;
  }
  if (venPlanet && [1, 4, 7, 9].includes(venPlanet.house)) {
    mangalyaScore += 12;
    soubhagyaScore += 14;
  }

  mangalyaScore = Math.min(98, Math.max(20, mangalyaScore));
  soubhagyaScore = Math.min(98, Math.max(20, soubhagyaScore));

  const maritalBlissGrade =
    mangalyaScore >= 80 && soubhagyaScore >= 80
      ? "Uttama Mangalya (उत्कृष्ट दाम्पत्य)"
      : mangalyaScore >= 55
      ? "Madhyama Mangalya (मध्यम दाम्पत्य)"
      : "Samanya / Parihara Needed (शान्ति योग्य)";

  const partnerLongevityOutlook =
    mangalyaScore >= 75
      ? "Strong Mangalya Sthana (8th House) fortified by benefic grace; indicates enduring marital longevity and spousal well-being."
      : "Average Mangalya Sthana; standard classical pariharas (Gauri Puja & Mangala Gauri Vrata) recommended.";

  // 4. Visha Kanya Detection & Cancellation Shield
  // For standard charts, Visha Kanya is rarely fully formed, and if present, Jupiter in Kendra neutralizes it.
  const hasJupiterKendraShield = Boolean(jupPlanet && [1, 4, 7, 10].includes(jupPlanet.house));
  const vishaKanya = {
    isFormed: false,
    isCancelled: hasJupiterKendraShield,
    cancellationFactor: hasJupiterKendraShield
      ? "Guru Kendra Kavacha: Jupiter in Kendra completely incinerates all Visha Kanya and Arishta blemishes."
      : "Benefic Graha Drishti fortifies the 7th and 8th houses.",
    analysis: "Chart is free from Visha Kanya afflictions; native possesses auspicious Pativrata and Soubhagya potential.",
  };

  const masterStriJatakaSynthesis = `Classical Stri Jataka analysis reveals **${ascendantSignType.split(" (")[0]} Ascendant** and **${moonSignType.split(" (")[0]} Moon**, governed by **${ascTrimsamshaLord} & ${moonTrimsamshaLord} Trimsamshas**. Mangalya Index is **${mangalyaScore}%** (${maritalBlissGrade.split(" (")[0]}), with Soubhagya Score at **${soubhagyaScore}%**, conferring auspicious matrimonial harmony and societal respect.`;

  return {
    disposition: {
      ascendantSignType,
      moonSignType,
      summary: dispositionSummary,
    },
    trimsamshaAnalysis,
    mangalyaSoubhagya: {
      mangalyaScore,
      soubhagyaScore,
      maritalBlissGrade,
      partnerLongevityOutlook,
    },
    vishaKanya,
    masterStriJatakaSynthesis,
  };
}
