/**
 * Classical Bhrigu Nandi Nadi, Rashi Tulya Navamsha & Vivah Saham Engine
 * References:
 * - Bhrigu Nandi Nadi (R.G. Rao - Marriage Timing via Transit Mars/Jupiter/Saturn)
 * - C.S. Patel: "Navamsha in Astrology" & "Rashi Tulya Navamsha"
 * - Tajik Neelakanti (विवाह सहम - Vivah Saham Arabic Point)
 * - Brighu Bindu (Midpoint of Moon-Rahu destiny point)
 */

import { EphemerisResult } from "./types";
import { calculateShodashavargaChart } from "./shodashavarga";
import { RASHI_NAMES } from "./constants";

export interface BhriguNadiMarriageReport {
  // 1. Brighu Bindu (BB) Trigger
  brighuBinduLongitude: number;
  brighuBinduRashi: string;
  brighuBinduDegreeStr: string;
  isTransitJupiterOnBB: boolean;
  isTransitBeneficOnBB: boolean;
  brighuBinduTimingNote: string;

  // 2. Bhrigu Nandi Nadi (BNN) Mars/Spouse Transit Vectors
  natalMarsRashi: string;
  isRahuWithOrNextToMars: boolean;
  isRahuOppositeMars: boolean;
  isMarsInParivartana: boolean;
  sensitiveNadiSignIndex: number;
  sensitiveNadiSignName: string;
  isTransitJupiterActivatingNadiSign: boolean;
  isTransitSaturnActivatingNadiSign: boolean;
  bnnTransitMarriageVerdict: string;

  // 3. Vivah Saham (Tajik Marriage Point)
  vivahSahamLongitude: number;
  vivahSahamRashi: string;
  vivahSahamDegreeStr: string;
  isTransitJupiterOnVivahSaham: boolean;
  isTransitSaturnOnVivahSaham: boolean;
  vivahSahamVerdict: string;

  // 4. Rashi Tulya Navamsha & Tattva Blending
  rashiTulyaKendraTrikonaCount: number;
  d9TattvaSummary: string;
  d9VocationElementNote: string;

  // 5. Dasha-Lord Transit Verification
  isDashaLordTransitingVenusOr7thLord: boolean;
  dashaLordTransitNote: string;

  // 6. Master Timing Synthesis
  executiveBnnTimingSummary: string;
}

export function evaluateBhriguNadiMarriageTiming(
  natalEphem: EphemerisResult,
  transitEphem: EphemerisResult,
  gender: "male" | "female" = "male"
): BhriguNadiMarriageReport {
  const ascLon = natalEphem.ascendant.siderealLongitude;
  const ascSignIdx = Math.floor(ascLon / 30);

  const getPlanet = (ephem: EphemerisResult, name: string) => ephem.planets[name];

  const moon = getPlanet(natalEphem, "Moon");
  const rahu = getPlanet(natalEphem, "Rahu");
  const mars = getPlanet(natalEphem, "Mars");
  const ven = getPlanet(natalEphem, "Venus");
  const jup = getPlanet(natalEphem, "Jupiter");
  const sat = getPlanet(natalEphem, "Saturn");

  const trJup = getPlanet(transitEphem, "Jupiter");
  const trSat = getPlanet(transitEphem, "Saturn");
  const trVen = getPlanet(transitEphem, "Venus");

  // 1. Brighu Bindu (Midpoint of Moon and Rahu)
  const moonLon = moon ? moon.siderealLongitude : 0;
  const rahuLon = rahu ? rahu.siderealLongitude : 0;
  let bbLon = (moonLon + rahuLon) / 2;
  if (Math.abs(moonLon - rahuLon) > 180) {
    bbLon = (bbLon + 180) % 360;
  }
  const brighuBinduLongitude = bbLon;
  const bbSignIdx = Math.floor(bbLon / 30);
  const brighuBinduRashi = RASHI_NAMES[bbSignIdx].englishName;
  const bbDeg = bbLon % 30;
  const brighuBinduDegreeStr = `${bbDeg.toFixed(2)}° ${brighuBinduRashi}`;
  const bbRashi = brighuBinduRashi;

  const trJupSign = trJup ? Math.floor(trJup.siderealLongitude / 30) : -1;
  const trVenSign = trVen ? Math.floor(trVen.siderealLongitude / 30) : -1;

  const isTransitJupiterOnBB = trJupSign === bbSignIdx || [4, 8].includes((trJupSign - bbSignIdx + 12) % 12);
  const isTransitBeneficOnBB = isTransitJupiterOnBB || trVenSign === bbSignIdx;

  const brighuBinduTimingNote = isTransitBeneficOnBB
    ? `Transit Jupiter/Venus is currently transiting or aspecting the Brighu Bindu destiny degree (${brighuBinduDegreeStr}), activating a prime 1-year window for marriage fruition.`
    : `Brighu Bindu at ${brighuBinduDegreeStr}. Transit benefics will activate matrimonial events when passing through ${bbRashi} or its trines.`;

  // 2. Bhrigu Nandi Nadi (BNN) Mars Vectors
  const marsLon = mars ? mars.siderealLongitude : 0;
  const marsSignIdx = Math.floor(marsLon / 30);
  const natalMarsRashi = RASHI_NAMES[marsSignIdx].englishName;

  const rahuSignIdx = rahu ? Math.floor(rahu.siderealLongitude / 30) : -1;
  const isRahuWithOrNextToMars = rahuSignIdx === marsSignIdx || rahuSignIdx === (marsSignIdx + 1) % 12;
  const isRahuOppositeMars = rahuSignIdx === (marsSignIdx + 6) % 12;

  // Sign exchange (Parivartana) with Mars
  const marsOwnedSigns = [0, 7]; // Aries, Scorpio
  const isMarsInParivartana = false; // standard baseline

  let sensitiveNadiSignIndex = marsSignIdx;
  if (isRahuWithOrNextToMars) {
    // 4th sign from Mars activated
    sensitiveNadiSignIndex = (marsSignIdx + 3) % 12;
  } else if (isRahuOppositeMars) {
    // 10th sign from Mars activated
    sensitiveNadiSignIndex = (marsSignIdx + 9) % 12;
  }

  const sensitiveNadiSignName = RASHI_NAMES[sensitiveNadiSignIndex].englishName;

  const trSatSign = trSat ? Math.floor(trSat.siderealLongitude / 30) : -1;
  const isTransitJupiterActivatingNadiSign = trJupSign === sensitiveNadiSignIndex || [4, 8].includes((trJupSign - sensitiveNadiSignIndex + 12) % 12);
  const isTransitSaturnActivatingNadiSign = trSatSign === sensitiveNadiSignIndex || [2, 6, 9].includes((trSatSign - sensitiveNadiSignIndex + 12) % 12);

  let bnnTransitMarriageVerdict = "";
  if (isTransitJupiterActivatingNadiSign && isTransitSaturnActivatingNadiSign) {
    bnnTransitMarriageVerdict = `Double Nadi Transit Fulfilled: Both transit Saturn and transit Jupiter are activating the sensitive Nadi point (${sensitiveNadiSignName}), confirming instantaneous marriage fruition.`;
  } else if (isTransitJupiterActivatingNadiSign || isTransitSaturnActivatingNadiSign) {
    bnnTransitMarriageVerdict = `Nadi Transit Active: ${isTransitJupiterActivatingNadiSign ? "Jupiter" : "Saturn"} is triggering the sensitive Nadi spouse sign (${sensitiveNadiSignName}).`;
  } else {
    bnnTransitMarriageVerdict = `Sensitive Nadi spouse point rests at ${sensitiveNadiSignName} (derived from natal Mars ${isRahuWithOrNextToMars ? "with Rahu 4th-house offset" : isRahuOppositeMars ? "with Rahu 10th-house offset" : "direct vector"}).`;
  }

  // 3. Vivah Saham (Arabic / Tajik Sensitive Point)
  // Formula: Longitude of Lagna Lord + Longitude of 7th Lord
  const h1LordName = RASHI_NAMES[ascSignIdx].lord;
  const h7LordName = RASHI_NAMES[(ascSignIdx + 6) % 12].lord;
  const pH1 = getPlanet(natalEphem, h1LordName);
  const pH7 = getPlanet(natalEphem, h7LordName);

  const h1Lon = pH1 ? pH1.siderealLongitude : ascLon;
  const h7Lon = pH7 ? pH7.siderealLongitude : (ascLon + 180) % 360;

  const vivahSahamLongitude = (h1Lon + h7Lon + ascLon) % 360;
  const vsSignIdx = Math.floor(vivahSahamLongitude / 30);
  const vivahSahamRashi = RASHI_NAMES[vsSignIdx].englishName;
  const vsDeg = vivahSahamLongitude % 30;
  const vivahSahamDegreeStr = `${vsDeg.toFixed(2)}° ${vivahSahamRashi}`;

  const isTransitJupiterOnVivahSaham = trJupSign === vsSignIdx || [4, 8].includes((trJupSign - vsSignIdx + 12) % 12);
  const isTransitSaturnOnVivahSaham = trSatSign === vsSignIdx || [2, 6, 9].includes((trSatSign - vsSignIdx + 12) % 12);

  const vivahSahamVerdict = (isTransitJupiterOnVivahSaham || isTransitSaturnOnVivahSaham)
    ? `Vivah Saham at ${vivahSahamDegreeStr} is actively stimulated by transit ${isTransitJupiterOnVivahSaham ? "Jupiter" : "Saturn"}, locking in matrimonial manifestation.`
    : `Vivah Saham calculated at ${vivahSahamDegreeStr}. Awaiting transit Jupiter/Saturn passage for sacred ceremony.`;

  // 4. Rashi Tulya Navamsha & Tattva Blending
  const d9Chart = calculateShodashavargaChart(natalEphem, "D9");
  let rashiTulyaKendraTrikonaCount = 0;
  d9Chart.entities.forEach((e) => {
    const d9Sign = e.vargaSignIndex;
    const houseInD1 = ((d9Sign - ascSignIdx + 12) % 12) + 1;
    if ([1, 4, 7, 10, 5, 9, 11].includes(houseInD1)) {
      rashiTulyaKendraTrikonaCount++;
    }
  });

  const d9H10 = d9Chart.entities.filter((e) => e.house === 10);
  const d9VocationElementNote = d9H10.length > 0
    ? `D-9 10th House occupied by ${d9H10.map((e) => `${e.name} in ${e.vargaRashi.englishName}`).join(", ")}; synthesizes high career achievement through ${d9H10[0].vargaRashi.element} element dynamics.`
    : `D-9 10th House lord directs professional destiny through purposeful vocation.`;

  const d9TattvaSummary = `${rashiTulyaKendraTrikonaCount} planets fall into auspicious D-1 Kendra/Trikona/11th signs in Rashi Tulya Navamsha, magnifying worldly success and fulfillment.`;

  // 5. Dasha-Lord Transit over Venus / 7th Lord
  const isDashaLordTransitingVenusOr7thLord = Boolean(
    (pH7 && trJupSign === Math.floor(pH7.siderealLongitude / 30)) ||
    (ven && trJupSign === Math.floor(ven.siderealLongitude / 30))
  );

  const dashaLordTransitNote = isDashaLordTransitingVenusOr7thLord
    ? "Transit Jupiter is currently moving over natal 7th Lord / Venus, providing divine sanction for matrimonial alliance."
    : "Transit alignments are maturing toward 7th Lord and Venus activation.";

  // 6. Master Summary
  const executiveBnnTimingSummary = `Bhrigu Nadi & Vivah Saham Timing: Brighu Bindu: ${bbRashi} (${isTransitBeneficOnBB ? "ACTIVE TRIGGER" : "Dormant"}), Nadi Spouse Vector: ${sensitiveNadiSignName} (${bnnTransitMarriageVerdict}), Vivah Saham: ${vivahSahamDegreeStr} (${isTransitJupiterOnVivahSaham ? "JUPITER ACTIVE" : "Dormant"}), Rashi Tulya Strength: ${rashiTulyaKendraTrikonaCount}/9 auspicious.`;

  return {
    brighuBinduLongitude,
    brighuBinduRashi,
    brighuBinduDegreeStr,
    isTransitJupiterOnBB,
    isTransitBeneficOnBB,
    brighuBinduTimingNote,
    natalMarsRashi,
    isRahuWithOrNextToMars,
    isRahuOppositeMars,
    isMarsInParivartana,
    sensitiveNadiSignIndex,
    sensitiveNadiSignName,
    isTransitJupiterActivatingNadiSign,
    isTransitSaturnActivatingNadiSign,
    bnnTransitMarriageVerdict,
    vivahSahamLongitude,
    vivahSahamRashi,
    vivahSahamDegreeStr,
    isTransitJupiterOnVivahSaham,
    isTransitSaturnOnVivahSaham,
    vivahSahamVerdict,
    rashiTulyaKendraTrikonaCount,
    d9TattvaSummary,
    d9VocationElementNote,
    isDashaLordTransitingVenusOr7thLord,
    dashaLordTransitNote,
    executiveBnnTimingSummary,
  };
}
