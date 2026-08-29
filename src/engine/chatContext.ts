/**
 * Professional Vedic AI Chat Context Synthesizer ("Acharya Jyotish AI Pro")
 * Calibrated with B.V. Raman's 300 Important Combinations, Astrology for Beginners,
 * Bhava and Graha Balas (1996), How to Judge a Horoscope (Vols 1 & 2),
 * A Textbook of Scientific Hindu Astrology, Bhrigu Nandi Nadi, Bhrigu Saral Paddhati,
 * and Classical Parashari Jyotish.
 */

import { EphemerisResult } from "./types";
import { calculateVimshottariDasha } from "./dasha";
import { calculateGochar } from "./gochar";
import { calculateShodashavargaChart } from "./shodashavarga";
import { calculateShadbala } from "./shadbala";
import { calculateAshtakavarga } from "./ashtakavarga";
import { calculateJaiminiKarakas, calculateArudhaPadas, analyzeKarakamsha, calculateArgala } from "./jaimini";
import { evaluateRamanYogas } from "./ramanYogas";
import { mapYogaActivationTimeline } from "./yogaActivation";
import { evaluatePanchadaMaitri } from "./panchadaMaitri";
import { calculateIshtaKashta } from "./ishtaKashta";
import { evaluate12BhavasJudgement } from "./bhavaJudgement";
import { calculateBadhakaAvasthas } from "./badhakaAvasthas";
import { evaluateBhriguNadi } from "./bhriguNadi";
import { evaluateKarmaRebirth } from "./karmaRebirth";
import { calculateDoubleTransit } from "./doubleTransit";
import { evaluateMarriageTiming } from "./marriageTiming";
import { evaluateKnRaoTechniques } from "./knRaoTechniques";
import { evaluateEducationStream } from "./educationStream";
import { evaluateMultiDashaSystems } from "./dashaSystems";
import { evaluateBphsCore } from "./bphsCore";
import { evaluateBrihatJataka } from "./brihatJataka";
import { evaluateBrihatSamhita } from "./brihatSamhita";
import { evaluateDevaKeralam } from "./devaKeralam";
import { calculateSukaNadi } from "./sukaNadi";
import { evaluateJaiminiSutrasComplete } from "./jaiminiSutras";
import { evaluateGayatriJyotish } from "./gayatriJyotish";
import { evaluateJatakaAlankara } from "./jatakaAlankara";
import { evaluateJatakNirnay } from "./jatakNirnay";
import { evaluateJatakaParijata } from "./jatakaParijata";
import { calculateMatchmaking } from "./matchmaking";
import { calculateVedicEphemeris } from "./ephemeris";
import { GeoLocation } from "./types";
import { RASHI_NAMES } from "./constants";

export interface MatchmakingContextData {
  boy: { name: string; dateIso: string; location: GeoLocation };
  girl: { name: string; dateIso: string; location: GeoLocation };
}

export function buildAstroDossier(
  natalEphemeris: EphemerisResult,
  transitEphemeris: EphemerisResult,
  evaluationDate: Date = new Date(),
  gender: "male" | "female" = "male",
  matchmaking?: MatchmakingContextData
): string {
  const birthDate = new Date(natalEphemeris.utcDate);
  const location = natalEphemeris.location;
  const moonLon = natalEphemeris.planets.Moon?.siderealLongitude || 0;
  const ascLon = natalEphemeris.ascendant.siderealLongitude;
  const ascRashiIdx = Math.floor(ascLon / 30);
  const ascRashi = RASHI_NAMES[ascRashiIdx];

  // 1. Dasha Calculation
  const dasha = calculateVimshottariDasha(birthDate, moonLon, evaluationDate);
  const activeDasha = dasha.activeDasha;
  const activeDashaLords = activeDasha
    ? [activeDasha.mahadasha.name, activeDasha.antardasha.name, activeDasha.pratyantardasha.name]
    : [];

  // 2. Gochar & Sade Sati
  const gochar = calculateGochar(natalEphemeris, transitEphemeris);

  // 3. D9 Navamsha & D10 Dashamsha Varga Charts
  const d9Chart = calculateShodashavargaChart(natalEphemeris, "D9");
  const d10Chart = calculateShodashavargaChart(natalEphemeris, "D10");

  const d9Summary: string[] = [];
  d9Chart.entities.forEach((e) => {
    if (["Uranus", "Neptune", "Pluto"].includes(e.id)) return;
    d9Summary.push(e.name + ": " + e.vargaRashi.englishName + " (H" + e.house + ")");
  });

  const d10Summary: string[] = [];
  d10Chart.entities.forEach((e) => {
    if (["Uranus", "Neptune", "Pluto"].includes(e.id)) return;
    d10Summary.push(e.name + ": " + e.vargaRashi.englishName + " (H" + e.house + ")");
  });

  // 4. Shadbala Planetary Strengths
  let shadbalaSummary = "Shadbala calculated.";
  try {
    const shadbalaResult = calculateShadbala(natalEphemeris);
    const sorted = Object.values(shadbalaResult.planets).sort((a, b) => b.totalRupas - a.totalRupas);
    shadbalaSummary = sorted
      .map(
        (p) =>
          "- " + p.name + ": " + p.totalRupas.toFixed(2) + " Rupas (" + p.percentageEfficiency.toFixed(0) + "% req) • " + (p.isBalavan ? "Strong (बलवान)" : "Moderate / Weak")
      )
      .join("\n");
  } catch (_) {}

  // 5. Pancha-da Maitri (5-Fold Compound Relationship with Sign Dispositor)
  let panchadaSummary = "";
  try {
    const pm = evaluatePanchadaMaitri(natalEphemeris);
    panchadaSummary = Object.values(pm.planets)
      .map((p) => "- " + p.planet + " in House " + p.occupiedHouse + " -> Dispositor (" + p.dispositor + "): **" + p.compoundRelation + " (" + p.sanskritName + ")** [Score: " + p.scorePercent + "%]")
      .join("\n");
  } catch (_) {}

  // 6. Ishta Phala & Kashta Phala & Residential % (Dr. B.V. Raman 1996)
  let ishtaKashtaSummary = "";
  try {
    const ik = calculateIshtaKashta(natalEphemeris);
    ishtaKashtaSummary = Object.values(ik.planets)
      .map(
        (p) =>
          "- " + p.name + ": **Ishta " + p.ishtaPhala + "** vs **Kashta " + p.kashtaPhala + "** • Residential: " + p.residentialPercent + "% • [" + p.qualityBadge + "]"
      )
      .join("\n");
  } catch (_) {}

  // 7. Jaimini Chara Karakas, Arudhas, Karakamsha & Argala
  let jaiminiSummary = "";
  try {
    const jaimini = calculateJaiminiKarakas(natalEphemeris);
    const padas = calculateArudhaPadas(natalEphemeris);
    const kl = analyzeKarakamsha(natalEphemeris);
    const alPada = padas[0]; // AL
    const ulPada = padas[11]; // UL
    const a7Pada = padas[6]; // A7
    const a10Pada = padas[9]; // A10

    const lagnaArgala = calculateArgala(natalEphemeris, ascRashiIdx, "Lagna");
    const alArgala = calculateArgala(natalEphemeris, alPada.padaSignIndex, "Arudha Lagna");

    jaiminiSummary = [
      "- **Atmakaraka (AK - Soul & Destiny):** " + jaimini.atmakaraka.planetName + " in " + jaimini.atmakaraka.rashi.englishName + " (" + jaimini.atmakaraka.formattedDegrees + ")",
      "- **Amatyakaraka (AmK - Career & Livelihood):** " + jaimini.amatyakaraka.planetName + " in " + jaimini.amatyakaraka.rashi.englishName + " (" + jaimini.amatyakaraka.formattedDegrees + ")",
      "- **Darakaraka (DK - Spouse & Partnerships):** " + jaimini.darakaraka.planetName + " in " + jaimini.darakaraka.rashi.englishName + " (" + jaimini.darakaraka.formattedDegrees + ")",
      "- **Bhratrikaraka (BK - Siblings & Guru):** " + jaimini.bhratrikaraka.planetName + " | **Matrikaraka (MK - Mother/Land):** " + jaimini.matrikaraka.planetName,
      "- **Putrakaraka (PK - Intellect/Children):** " + jaimini.putrakaraka.planetName + " | **Gnatikaraka (GK - Competitors):** " + jaimini.gnatikaraka.planetName,
      "- **Arudha Lagna (AL - Public Image & Reputation):** " + alPada.padaSign.englishName + " (House " + alPada.padaHouse + " in D1)",
      "- **Upapada Lagna (UL - Marriage & In-laws):** " + ulPada.padaSign.englishName + " (House " + ulPada.padaHouse + " in D1)",
      "- **Dara Pada (A7 - Partnerships):** " + a7Pada.padaSign.englishName + " | **Rajya Pada (A10 - Authority):** " + a10Pada.padaSign.englishName,
      "- **Karakamsha (KL in D9):** " + kl.karakamshaRashi.englishName + " • **Ishta Devata:** " + kl.ishtaDevata.deity + " (via " + kl.ishtaDevata.graha + ")",
      "- **Moksha Indicator (12th from KL):** " + kl.twelfthFromKarakamsha.spiritualSignification,
      "- **Argala on Lagna:** " + lagnaArgala.unobstructedShubhaCount + " Shubha / " + lagnaArgala.unobstructedPapaCount + " Papa (" + lagnaArgala.overallVerdict + ")",
      "- **Argala on Arudha Lagna (AL):** " + alArgala.unobstructedShubhaCount + " Shubha / " + alArgala.unobstructedPapaCount + " Papa",
    ].join("\n");
  } catch (_) {}

  // 8. Ashtakavarga SAV Points
  let ashtakavargaSummary = "";
  try {
    const av = calculateAshtakavarga(natalEphemeris);
    ashtakavargaSummary = "SAV Points in Houses -> 1st (Tanu): " + av.sarvaHouseBindus[0] + ", 2nd (Dhana): " + av.sarvaHouseBindus[1] + ", 4th (Sukha): " + av.sarvaHouseBindus[3] + ", 7th (Kalatra): " + av.sarvaHouseBindus[6] + ", 9th (Bhagya): " + av.sarvaHouseBindus[8] + ", 10th (Karma): " + av.sarvaHouseBindus[9] + ", 11th (Labha): " + av.sarvaHouseBindus[10];
  } catch (_) {}

  // 9. Natal Planetary Positions (D1)
  const planetsSummary: string[] = [];
  Object.values(natalEphemeris.planets).forEach((p) => {
    if (p.isModernPlanet) return;
    const rashiIdx = Math.floor(p.siderealLongitude / 30);
    const rashi = RASHI_NAMES[rashiIdx];
    const deg = (p.siderealLongitude % 30).toFixed(1);
    const isRetro = p.isRetrograde ? " [Retrograde / वक्री]" : "";
    planetsSummary.push(
      "- " + p.name + " (" + p.symbol + "): House " + p.house + " in " + rashi.englishName + " (" + rashi.sanskritName + ") at " + deg + "° in " + p.nakshatra.sanskritName + " Pada " + p.nakshatra.pada + isRetro
    );
  });

  // 10. B.V. Raman 300 Yogas with Potency & Bhanga Analysis
  const ramanAnalysis = evaluateRamanYogas(natalEphemeris);
  const yogaActivation = mapYogaActivationTimeline(ramanAnalysis.yogas, dasha);

  const activeYogasFormatted = yogaActivation.currentlyActive.length > 0
    ? yogaActivation.currentlyActive
        .map((r) => "- **" + r.yoga.name + " (" + r.yoga.sanskritName + ")** [Potency: " + r.yoga.potencyPercent + "%] -> " + r.timingDescription + " | Effects: " + r.yoga.practicalEffects)
        .join("\n")
    : "- No high-potency event yogas active in this specific sub-period. Results unfold via general Dasha lordship significations.";

  const lifelongYogasFormatted = yogaActivation.lifelongYogas.length > 0
    ? yogaActivation.lifelongYogas
        .map((r) => "- **" + r.yoga.name + " (" + r.yoga.sanskritName + ")** -> " + r.yoga.classicalDescription + " | Lifelong Trait: " + r.yoga.practicalEffects)
        .join("\n")
    : "- Standard constitutional distribution.";

  const upcomingYogasFormatted = yogaActivation.upcomingYogas.slice(0, 4).length > 0
    ? yogaActivation.upcomingYogas.slice(0, 4)
        .map((r) => "- **" + r.yoga.name + "** [Potency: " + r.yoga.potencyPercent + "%] -> " + r.timingDescription)
        .join("\n")
    : "- All major yogas have completed primary cycles or remain dormant.";

  const cancelledYogasFormatted = yogaActivation.cancelledYogas.length > 0
    ? yogaActivation.cancelledYogas
        .map((r) => "- **" + r.yoga.name + "**: " + r.timingDescription)
        .join("\n")
    : "- No cancelled or corrupt combinations detected.";

  const functionalRolesFormatted = Object.entries(ramanAnalysis.functionalRoles)
    .map(([graha, role]) => "- **" + graha + ":** " + role)
    .join("\n");

  const activeDashaSection = activeDasha
    ? [
        "- **Active Mahadasha (MD):** " + activeDasha.mahadasha.name + " (" + activeDasha.mahadasha.hindiName + ") [" + activeDasha.mdStart.toLocaleDateString() + " to " + activeDasha.mdEnd.toLocaleDateString() + "]",
        "- **Active Antardasha (AD):** " + activeDasha.antardasha.name + " (" + activeDasha.antardasha.hindiName + ") [" + activeDasha.adStart.toLocaleDateString() + " to " + activeDasha.adEnd.toLocaleDateString() + "]",
        "- **Active Pratyantardasha (PD):** " + activeDasha.pratyantardasha.name + " (" + activeDasha.pratyantardasha.hindiName + ") [" + activeDasha.pdStart.toLocaleDateString() + " to " + activeDasha.pdEnd.toLocaleDateString() + "]",
        "- **Dasha Progress:** " + activeDasha.percentageCompleteMD + "% of MD and " + activeDasha.percentageCompleteAD + "% of AD completed.",
        "- **Dominant Operational Theme:** " + yogaActivation.dominantLifeTheme,
      ].join("\n")
    : "- Dasha calculated.";

  // 11. 12 Bhavas Tripartite Judgement (How to Judge a Horoscope)
  let bhavaJudgementSummary = "";
  try {
    const bj = evaluate12BhavasJudgement(natalEphemeris);
    const top3 = Object.values(bj.bhavas).sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 3);
    const bottom2 = Object.values(bj.bhavas).sort((a, b) => a.compositeScore - b.compositeScore).slice(0, 2);

    const top3Str = top3.map((b) => "- **House " + b.houseNumber + " (" + b.sanskritName + "):** " + b.compositeScore + "% • [" + b.qualityBadge + "] -> " + b.domain).join("\n");
    const bottom2Str = bottom2.map((b) => "- **House " + b.houseNumber + " (" + b.sanskritName + "):** " + b.compositeScore + "% • [" + b.qualityBadge + "] -> " + b.domain + " (Advice: " + b.remedialAdvice + ")").join("\n");

    bhavaJudgementSummary = [
      "- **Overall Chart Average House Index:** " + bj.averageScore + "%",
      "- **Top Flourishing Houses (Supreme Support):**",
      top3Str,
      "- **Challenged / Sensitive Houses (Require Remedial Focus):**",
      bottom2Str,
    ].join("\n");
  } catch (_) {}

  // 12. Badhaka Sthana & Planetary Avasthas (Scientific Hindu Astrology)
  let badhakaAvasthasSummary = "";
  try {
    const ba = calculateBadhakaAvasthas(natalEphemeris, activeDashaLords);
    const avasthaList = Object.values(ba.avasthas)
      .map((a) => "- **" + a.planet + ":** " + a.baladiAvastha + " (Vitality: " + a.baladiPotencyPercent + "%) & " + a.jagradadiAvastha + " (Alertness: " + a.jagradadiPotencyPercent + "%) -> Effective Potency: **" + a.effectivePotencyPercent + "%**" + (a.isBadhakesh ? " ⚠️ [BADHAKESH]" : ""))
      .join("\n");

    badhakaAvasthasSummary = [
      "- **Lagna Modality:** " + ba.badhaka.modality + " Ascendant (" + ba.badhaka.ascendantSignName + ")",
      "- **Badhaka Sthana (Obstruction House):** **House " + ba.badhaka.badhakaHouseNumber + "** in " + ba.badhaka.badhakaSignName + " (Ruled by: **" + ba.badhaka.badhakadhipati + "**)",
      "- **Badhakesh House Location:** Situated in House " + ba.badhaka.badhakeshHouse,
      "- **Active Dasha Status of Badhakesh:** " + (ba.badhaka.isBadhakeshActiveInDasha ? "⚠️ YES (Currently Running - navigate with strategic patience)" : "Dormant / Inactive in current running periods"),
      "- **Guidance:** " + ba.badhaka.remedialAdvice,
      "- **Planetary Avasthas Breakdown (Baladi & Jagradadi):**",
      avasthaList,
    ].join("\n");
  } catch (_) {}

  // 13. Bhrigu Nandi Nadi (BNN) & Bhrigu Saral Paddhati (BSP Age Triggers)
  let bhriguSummary = "";
  try {
    const bnn = evaluateBhriguNadi(natalEphemeris, evaluationDate);
    const quadSummary = Object.entries(bnn.directionalClusters)
      .map(([k, c]) => "- **" + c.direction + " [" + c.signs.join("/") + "]:** " + (c.planets.length ? c.planets.join(" + ") : "Empty"))
      .join("\n");

    const bspTriggers = bnn.currentYearBsp.specificBspTriggers.length > 0
      ? bnn.currentYearBsp.specificBspTriggers
          .map((t) => "- 🎯 **" + t.ruleName + " (" + t.activatedPlanet + " -> House " + t.activatedHouse + "):** " + t.karmicOutcome)
          .join("\n")
      : "- Standard 12-year wheel progression through House " + bnn.currentYearBsp.cycleHouseNumber + " (" + bnn.currentYearBsp.cycleHouseTheme + ").";

    bhriguSummary = [
      "- **Current Native Running Age:** **Year " + bnn.runningAge + "**",
      "- **12-Year Wheel Active House:** **House " + bnn.currentYearBsp.cycleHouseNumber + "** (" + bnn.currentYearBsp.cycleHouseTheme + ")",
      "- **Active Bhrigu Saral Paddhati (BSP) Karmic Triggers for Age " + bnn.runningAge + ":**",
      bspTriggers,
      "- **BNN 4-Directional Quadrant Alignments (1-5-9 Trine Conjunctions):**",
      quadSummary,
      "- **Jiva Nadi Path (Jupiter):** " + bnn.jivaProfile.synthesisVerdict,
      "- **Karma Nadi Path (Saturn Vocation):** " + bnn.karmaProfile.synthesisVerdict,
    ].join("\n");
  } catch (_) {}

  // 14. K.N. Rao Karma & Rebirth Intelligence
  let karmaSummary = "";
  try {
    const kr = evaluateKarmaRebirth(natalEphemeris);
    const vakriStr = kr.retrogradeContracts.length > 0
      ? kr.retrogradeContracts.map((c) => "- **" + c.planet + " (Retrograde in " + c.sign + "):** " + c.unfinishedLesson + " (Remedy: " + c.karmicResolution + ")").join("\n")
      : "- No retrograde physical planets; forward karmic momentum.";

    karmaSummary = [
      "- **Loka of Origin (Soul Descent):** **" + kr.lokaOfDescent.lokaName + "** (" + kr.lokaOfDescent.sanskritLoka + ") via " + kr.lokaOfDescent.strongerLuminary + " in " + kr.lokaOfDescent.d3Lord + "'s D3 ray.",
      "- **Soul Heritage:** " + kr.lokaOfDescent.spiritualHeritage,
      "- **22nd Dreshkona (Kharesh / Past Vulnerability):** " + kr.kharesh.twentySecondDreshkonaSignName + " (Ruled by: **" + kr.kharesh.khareshLord + "** in House " + kr.kharesh.khareshHouseInD1 + ") -> " + kr.kharesh.vulnerabilityTheme,
      "- **Purva Punya Capacity (5th/9th Merit Index):** **" + kr.purvaPunya.purvaPunyaScore + "%** (" + kr.purvaPunya.pastSadhanaMerits + ")",
      "- **Rinanubandhana (Past Karmic Debts):** " + kr.purvaPunya.rinanubandhanaChildrenDebts,
      "- **Rahu-Ketu Karmic Axis:** Ketu in " + kr.rahuKetuAxis.ketuSign + " (H" + kr.rahuKetuAxis.ketuHouse + " - Past Mastery) -> Rahu in " + kr.rahuKetuAxis.rahuSign + " (H" + kr.rahuKetuAxis.rahuHouse + " - Future Frontier: " + kr.rahuKetuAxis.rahuFutureFrontier + ")",
      "- **Retrograde Unfinished Soul Contracts:**",
      vakriStr,
    ].join("\n");
  } catch (_) {}

  // 15. K.N. Rao Double Transit (DTP) & PAC-DARES
  let dtpSummary = "";
  try {
    const dtp = calculateDoubleTransit(natalEphemeris, transitEphemeris);
    const milestonesStr = Object.values(dtp.milestones)
      .map((m) => "- " + m.icon + " **" + m.name + ":** [" + (m.isDtpFulfilled ? "⚡ DTP ACTIVE - " + m.readinessScorePercent + "%" : "Dormant / " + m.readinessScorePercent + "%") + "] -> " + m.classicalVerdict)
      .join("\n");

    const pacDaresStr = dtp.pacDares
      .map((v) => "- **" + v.category + " (" + v.scorePercent + "%):** " + v.verdict)
      .join("\n");

    dtpSummary = [
      "- **Double Transit Overview:** " + dtp.masterTimingSummary,
      "- **Saturn Transit Position:** " + dtp.transitAspects.transitSaturnSignName + " (House #" + dtp.transitAspects.transitSaturnHouseFromLagna + " from Lagna)",
      "- **Jupiter Transit Position:** " + dtp.transitAspects.transitJupiterSignName + " (House #" + dtp.transitAspects.transitJupiterHouseFromLagna + " from Lagna)",
      "- **4 Major Life Milestone Readiness Status:**",
      milestonesStr,
      "- **PAC-DARES Diagnostic Summary:**",
      pacDaresStr,
    ].join("\n");
  } catch (_) {}

  // 16. K.N. Rao Timing of Marriage Suite
  let marriageSummary = "";
  try {
    const mt = evaluateMarriageTiming(natalEphemeris, transitEphemeris, evaluationDate);
    marriageSummary = [
      "- **Composite Marital Readiness:** **" + mt.compositeReadinessPercent + "%** (" + mt.masterTimingVerdict + ")",
      "- **Tier 1 (Natal Marital Band):** " + mt.promise.maritalBand + " (" + mt.promise.sanskritBand + ") • 7th House: " + mt.promise.seventhHouseSign + " (Lord: " + mt.promise.seventhLord + " in H" + mt.promise.seventhLordHouseInD1 + ") • " + mt.promise.venusStatus,
      "- **Navamsha (D9) & Upapada (UL):** D9 Lagna in " + mt.promise.d9LagnaSign + " (D9 7th Lord: " + mt.promise.d9SeventhLord + ") • Upapada Lagna (UL) in " + mt.promise.upapadaSign,
      "- **Tier 2 (Dual Dasha Convergence):** " + (mt.dualDasha.isDualConvergenceActive ? "🌟 YES (Vimshottari " + mt.dualDasha.activeVimshottariMD + "/" + mt.dualDasha.activeVimshottariAD + " + Chara " + mt.dualDasha.activeCharaMD + "/" + mt.dualDasha.activeCharaAD + ")" : "Single/Dormant Dasha Window") + " -> " + mt.dualDasha.timingWindowVerdict,
      "- **Tier 3 (Double Transit Trigger):** " + (mt.doubleTransit.isDoubleTransitFulfilled ? "⚡ FULFILLED (Saturn & Jupiter simultaneously sanction marital axis)" : "Pending dual transit aspect on 1-7 axis"),
      "- **Remedial Guidance:** " + mt.remedialGuidance,
    ].join("\n");
  } catch (_) {}

  // 17. K.N. Rao Advanced Predictive Techniques
  let techniquesSummary = "";
  try {
    const tech = evaluateKnRaoTechniques(natalEphemeris);
    techniquesSummary = [
      "- **Saturn-Venus Paradox Vector:** " + tech.saturnVenusParadox.mutualRelationshipD1 + " (" + tech.saturnVenusParadox.saturnDignity + " / " + tech.saturnVenusParadox.venusDignity + ") -> " + tech.saturnVenusParadox.dashaPeriodEffect,
      "- **Beeja Sphuta (Male Virility Point):** " + tech.beejaSphuta.signName + " (" + tech.beejaSphuta.degreeInSign + ") • Navamsha: " + tech.beejaSphuta.navamshaSignName + " • [" + tech.beejaSphuta.fertilityRating + "] -> " + tech.beejaSphuta.classicalInterpretation,
      "- **Kshetra Sphuta (Female Fecundity Point):** " + tech.kshetraSphuta.signName + " (" + tech.kshetraSphuta.degreeInSign + ") • Navamsha: " + tech.kshetraSphuta.navamshaSignName + " • [" + tech.kshetraSphuta.fertilityRating + "] -> " + tech.kshetraSphuta.classicalInterpretation,
      "- **D7 Progeny & D10 Career Synchronization:** D7 Lagna in " + tech.crossVarga.d7SaptamshaLagna + " • D10 Lagna in " + tech.crossVarga.d10DashamshaLagna + " (" + tech.crossVarga.d10Synthesis + ")",
      "- **Master Predictive Verdict:** " + tech.masterPredictiveSynthesis,
    ].join("\n");
  } catch (_) {}

  // 18. K.N. Rao & Naval Singh Planets & Education
  let educationSummary = "";
  try {
    const edu = evaluateEducationStream(natalEphemeris);
    const topStreams = edu.streamAptitudes.slice(0, 3)
      .map((s) => "- " + s.icon + " **" + s.streamName + ":** " + s.aptitudeScorePercent + "% Aptitude • Recommended: " + s.recommendedDegrees.slice(0, 2).join(", "))
      .join("\n");

    educationSummary = [
      "- **Primary Recommended Stream:** **" + edu.topRecommendedStream.streamName + "** (" + edu.topRecommendedStream.aptitudeScorePercent + "% Match)",
      "- **Top Academic Orientations:**",
      topStreams,
      "- **Tripartite Academic Houses:** 4th House (Schooling): " + edu.tripartiteHouses.fourthHouse.signName + " (Lord: " + edu.tripartiteHouses.fourthHouse.lord + ") • 5th House (Buddhi): " + edu.tripartiteHouses.fifthHouse.signName + " (Lord: " + edu.tripartiteHouses.fifthHouse.lord + ") • 9th House (Higher Vidya): " + edu.tripartiteHouses.ninthHouse.signName + " (Lord: " + edu.tripartiteHouses.ninthHouse.lord + ")",
      "- **D24 Siddhamsa (Higher Learning & Distinction):** Lagna in " + edu.d24Siddhamsa.d24LagnaSign + " • Distinction Score: " + edu.d24Siddhamsa.academicDistinctionScore + "% (" + edu.d24Siddhamsa.researchPotential + ")",
      "- **Master Educational Guidance:** " + edu.masterAcademicGuidance,
    ].join("\n");
  } catch (_) {}

  // 19. Parashari Multi-Dasha & Yogini Dasha
  let multiDashaSummary = "";
  try {
    const multiDasha = evaluateMultiDashaSystems(natalEphemeris, evaluationDate);
    const eligibleCond = multiDasha.conditionalEligibilities
      .filter((c) => c.isEligible)
      .map((c) => c.name)
      .join(", ") || "Standard Vimshottari & Yogini active";

    multiDashaSummary = [
      "- **Active Yogini Dasha (36-Year Cycle):** **" + multiDasha.activeYogini.mahadasha.name + " (" + multiDasha.activeYogini.mahadasha.lord + ")** / **" + multiDasha.activeYogini.antardasha.name + " (" + multiDasha.activeYogini.antardasha.lord + ")**",
      "- **Yogini Influence:** " + multiDasha.activeYogini.interpretation,
      "- **Conditional Dasha Eligibility:** " + multiDasha.activeConditionalCount + " Active Systems (" + eligibleCond + ")",
      "- **Multi-Dasha Triangulation:** " + multiDasha.multiDashaTriangulation.triangulationVerdict + " (Concurrence: " + multiDasha.multiDashaTriangulation.concurrenceScorePercent + "%)",
    ].join("\n");
  } catch (_) {}

  // 20. Primordial Parashari BPHS Core (Vols 1 & 2)
  let bphsSummary = "";
  try {
    const bphs = evaluateBphsCore(natalEphemeris);
    const avasthaStr = bphs.sayanadiAvasthas.slice(0, 5)
      .map((a) => a.planetName + ": " + a.avasthaName + " (" + a.sanskritName + " " + a.icon + ")")
      .join(" • ");

    bphsSummary = [
      "- **Special Lagnas (BPHS Ch. 5):** Hora Lagna (HL - Wealth): " + bphs.specialLagnas.horaLagna.signName + " (H#" + bphs.specialLagnas.horaLagna.houseFromLagna + ") • Ghatika Lagna (GL - Power): " + bphs.specialLagnas.ghatikaLagna.signName + " (H#" + bphs.specialLagnas.ghatikaLagna.houseFromLagna + ") • Shree Lagna (SL - Fortune): " + bphs.specialLagnas.shreeLagna.signName + " (H#" + bphs.specialLagnas.shreeLagna.houseFromLagna + ")",
      "- **Sudarshana Chakra (BPHS Ch. 74):** Highest Triple Confluence on House #" + bphs.sudarshanaChakra.highestFortifiedHouse + " (" + bphs.sudarshanaChakra.highestFortifiedHouseTheme + ")",
      "- **12 Sayanadi Planetary Avasthas (BPHS Ch. 45):** " + avasthaStr,
      "- **Ashtakavarga Shodhana & Pinda Sadhana (BPHS Ch. 66-70):** Total Sarvashtakavarga Yoga Pinda = " + bphs.sarvaYogaPinda + " Units",
      "- **Vishnu Avatara Archetype (BPHS Ch. 2):** **" + bphs.leadingAvatara.avataraName + "** (" + bphs.leadingAvatara.planetName + " - " + bphs.leadingAvatara.divineArchetype + ")",
      "- **Master BPHS Synthesis:** " + bphs.masterBphsSynthesis,
    ].join("\n");
  } catch (_) {}

  // 21. Acharya Varahamihira Brihat Jataka
  let bjSummary = "";
  try {
    const bj = evaluateBrihatJataka(natalEphemeris);
    bjSummary = [
      "- **Karma Jeeva Vocational Sutra (B.J. Ch. 10):** Primary Artha Dispositor: **" + bj.karmaJeeva.navamshaDispositor + "** (D9 Ruler of H10 Lord " + bj.karmaJeeva.tenthLordFromLagna + " in " + bj.karmaJeeva.tenthLordNavamshaSign + ")",
      "- **Classical Wealth Title:** " + bj.karmaJeeva.sanskritTradeTitle,
      "- **Recommended Modern Sectors:** " + bj.karmaJeeva.recommendedIndustries.slice(0, 3).join(", ") + " • High-Yield Roles: " + bj.karmaJeeva.modernCareerAlignments.slice(0, 2).join(", "),
      "- **36 Drekkanas (Decanate Archetypes):** Lagna: " + bj.drekkanas.lagnaDrekkana.archetype + " (" + bj.drekkanas.lagnaDrekkana.icon + ") • Moon: " + bj.drekkanas.moonDrekkana.archetype + " (" + bj.drekkanas.moonDrekkana.icon + ") • Sun: " + bj.drekkanas.sunDrekkana.archetype + " (" + bj.drekkanas.sunDrekkana.icon + ")",
      "- **32 Nabhasa Yogas (B.J. Ch. 12):** **" + bj.nabhasaYoga.activeYogaName + "** (" + bj.nabhasaYoga.sanskritName + " - " + bj.nabhasaYoga.yogaCategory + ") • " + bj.nabhasaYoga.lifelongPhala,
      "- **Master Varahamihira Synthesis:** " + bj.masterVarahamihiraSynthesis,
    ].join("\n");
  } catch (_) {}

  // 22. Acharya Varahamihira Brihat Samhita Suite (Kurma Chakra, Graha Yuddha, Ratna Pariksha)
  let bsSummary = "";
  try {
    const bs = evaluateBrihatSamhita(natalEphemeris);
    const yuddhaStr = bs.grahaYuddhas.length > 0
      ? bs.grahaYuddhas.map((y) => `- ⚔️ **${y.planet1} vs ${y.planet2} (${y.warfareTypeSanskrit}):** Separation ${y.separationDegrees}° • Victor: **${y.victorPlanet}** (${y.victorReason}) -> ${y.natalImpact}`).join("\n")
      : "- No active planetary warfare (Graha Yuddha) in natal chart; peaceful celestial rays.";

    const cautionGemsStr = bs.ratnaPariksha.cautionGems.length > 0
      ? bs.ratnaPariksha.cautionGems.map((g) => `${g.gemstoneName} (${g.planet})`).join(", ")
      : "None";

    bsSummary = [
      "- **Kurma Chakra (B.S. Ch. 14 - 9-Directional Spatial Grid):** Highest Fortification in **" + bs.kurmaChakra.sectors[bs.kurmaChakra.mostFortifiedDirection].sanskritDirection + "** (" + bs.kurmaChakra.sectors[bs.kurmaChakra.mostFortifiedDirection].rulingDeity + ") • Most Afflicted Sector: **" + bs.kurmaChakra.sectors[bs.kurmaChakra.mostAfflictedDirection].sanskritDirection + "** (" + bs.kurmaChakra.sectors[bs.kurmaChakra.mostAfflictedDirection].status + ")",
      "- **Kurma Cosmic Synthesis:** " + bs.kurmaChakra.cosmicSynthesis,
      "- **Graha Yuddha (B.S. Ch. 17 - Planetary Warfare Status):**",
      yuddhaStr,
      "- **Ratna Pariksha (B.S. Ch. 80-83 - 9 Gems Prescription):**",
      "- **Primary Life Gem (Jeeva Ratna):** **" + bs.ratnaPariksha.primaryGem.gemstoneName + " (" + bs.ratnaPariksha.primaryGem.sanskritName + ")** • Metal: " + bs.ratnaPariksha.primaryGem.metal + " • Finger: " + bs.ratnaPariksha.primaryGem.wearingFinger + " • Mantra: " + bs.ratnaPariksha.primaryGem.classicalVedicMantra,
      bs.ratnaPariksha.secondaryGem ? "- **Secondary Fortune Gem (Bhagya Ratna):** **" + bs.ratnaPariksha.secondaryGem.gemstoneName + " (" + bs.ratnaPariksha.secondaryGem.sanskritName + ")** • " + bs.ratnaPariksha.secondaryGem.justification : "",
      "- **Strictly Prohibited Gemstones (Harmful Dusthana Rays):** " + cautionGemsStr,
      "- **Dakargala & Environmental Hydrology (B.S. Ch. 54):** " + bs.environmentalMundane.dakargalaWaterVerdict + " (Subterranean Water Index: " + bs.environmentalMundane.dakargalaGroundWaterIndex + "%)",
      "- **Master Brihat Samhita Synthesis:** " + bs.masterBrihatSamhitaSynthesis,
    ].filter(Boolean).join("\n");
  } catch (_) {}

  // 23. Deva Keralam (Chandra Kala Nadi) 150 Nadi Amshas Suite
  let dkSummary = "";
  try {
    const dk = evaluateDevaKeralam(natalEphemeris, transitEphemeris);
    const triggersStr = dk.activeTransitTriggers.length > 0
      ? dk.activeTransitTriggers.map((t) => `- 🪐 **${t.transitPlanet} Transit over ${t.natalPoint}:** ${t.status} • ${t.karmicEffect} -> **Shanti:** ${t.shantiRemedy}`).join("\n")
      : "- No critical adverse Nadi degree transit crossings active at present.";

    dkSummary = [
      "- **Ascendant (Lagna) Nadi Amsha:** **" + dk.lagnaNadi.name + " (" + dk.lagnaNadi.sanskritName + " — #" + dk.lagnaNadi.index + ")** in " + dk.lagnaNadi.halfBhagaSanskrit + " (" + dk.lagnaNadi.nature + ")",
      "- **Lagna Nadi Deity & Archetype:** Deity: " + dk.lagnaNadi.rulingDeity + " • Archetype: **" + dk.lagnaNadi.archetype + "**",
      "- **Classical Deva Keralam Sutra:** *" + dk.lagnaNadi.classicalSutra + "*",
      "- **Career & Wealth Phala:** " + dk.lagnaNadi.careerAndWealthPhala,
      "- **Karmic Lesson:** " + dk.lagnaNadi.karmicLesson,
      "- **Moon (Chandra) Nadi Amsha:** **" + dk.moonNadi.name + " (" + dk.moonNadi.sanskritName + " — #" + dk.moonNadi.index + ")** in " + dk.moonNadi.halfBhagaSanskrit,
      "- **Sun (Surya) Nadi Amsha:** **" + dk.sunNadi.name + " (" + dk.sunNadi.sanskritName + " — #" + dk.sunNadi.index + ")** in " + dk.sunNadi.halfBhagaSanskrit,
      "- **Deva Keralam Dhana & Raja Yogas:** " + [...dk.dhanaYogas, ...dk.rajaYogas].slice(0, 3).join(" • "),
      "- **Active Nadi Transit Triggers (Gochar over Nadi Points):**",
      triggersStr,
      "- **Master Deva Keralam Synthesis:** " + dk.masterDevaKeralamSynthesis,
    ].join("\n");
  } catch (_) {}

  // 24. Doctrines of Suka Nadi (Maharshi Shukacharya) Suite
  let sukaSummary = "";
  try {
    const suka = calculateSukaNadi(natalEphemeris);
    const topTrine = suka.directionalTrines.sort((a, b) => b.strengthScore - a.strengthScore)[0];
    const pastLifeStr = suka.pastLifeKarma.length > 0
      ? suka.pastLifeKarma.map((k) => `- ☸️ **${k.sanskritTitle} (${k.karmaPattern}):** ${k.manifestationInPresentLife} -> **Suka Parihara:** ${k.classicalSukaParihara}`).join("\n")
      : "- High Deva Punya; auspicious karmic continuity.";

    sukaSummary = [
      "- **Jeeva Karaka (Jupiter — Soul & Life Path):** Situated in " + suka.jeevaKaraka.signName + " (" + suka.jeevaKaraka.degrees + "°) • Archetype: **" + suka.jeevaKaraka.primaryArchetype + "** • Trine Connections: " + (suka.jeevaKaraka.trinePlanets.join(", ") || "None") + " • 2nd Feeder: " + (suka.jeevaKaraka.secondHousePlanets.join(", ") || "None"),
      "- **Jeeva Nadi Synthesis:** " + suka.jeevaKaraka.synthesis,
      "- **Karma Karaka (Saturn — Professional Destiny):** Situated in " + suka.karmaKaraka.signName + " (" + suka.karmaKaraka.degrees + "°) • Archetype: **" + suka.karmaKaraka.primaryArchetype + "** • Connections: " + ([...suka.karmaKaraka.conjoinedPlanets, ...suka.karmaKaraka.trinePlanets, ...suka.karmaKaraka.secondHousePlanets].join(", ") || "Independent") + " • Career Impact: " + suka.karmaKaraka.careerAndDestinyImpact,
      "- **Bhoga Karaka (Venus — Prosperity & Harmony):** " + suka.bhogaKaraka.signName + " • " + suka.bhogaKaraka.primaryArchetype,
      "- **Dominant Directional Trine (1-5-9 Matrix):** **" + topTrine.sanskritName + "** (" + topTrine.direction + ") with " + topTrine.planetsPresent.join(", ") + " • " + topTrine.lifeSignification,
      "- **Past Life Karma Diagnosis & Classical Suka Pariharas:**",
      pastLifeStr,
      "- **Special Suka Nadi Yogas:** " + suka.specialYogas.join(" • "),
      "- **Master Suka Nadi Synthesis:** " + suka.masterSukaSynthesis,
    ].join("\n");
  } catch (_) {}

  // 25. Maharshi Jaimini Upadesha Sutras (Complete 4 Adhyayas) Suite
  let jsSummary = "";
  try {
    const js = evaluateJaiminiSutrasComplete(natalEphemeris);
    const topKLBhavas = js.karakamshaBhavas.filter((b) => [1, 2, 4, 5, 9, 12].includes(b.bhavaNum));
    const klBhavasStr = topKLBhavas.map((b) => `- **House ${b.bhavaNum} from KL (${b.signName}):** Occupants: ${b.planetsPresent.join(", ") || "None"} | Aspects: ${b.aspectingPlanets.join(", ") || "None"} -> ${b.sutraPhala}`).join("\n");

    jsSummary = [
      "- **Atmakaraka (AK):** **" + js.atmakarakaPlanet + "** | **Amatyakaraka (AmK):** **" + js.amatyakarakaPlanet + "**",
      "- **Karakamsha Sign (Navamsha D9 AK):** **" + js.karakamshaSign + "** | **Swamsha:** **" + js.swamshaSign + "**",
      "- **Ishta Devata & Dharma Devata (12th from KL in " + js.ishtaDevata.twelfthSignFromKL + "):**",
      "  - Supreme Tutelary Deity: **" + js.ishtaDevata.ishtaDevataName + "** (Primary Graha: " + js.ishtaDevata.primaryIshtaPlanet + ")",
      "  - Dharma Devata: **" + js.ishtaDevata.dharmaDevataName + "**",
      "  - Sacred Bija/Mantra: `" + js.ishtaDevata.mantraRecommendation + "`",
      "  - Spiritual Path: " + js.ishtaDevata.spiritualPath,
      "- **Key Karakamsha Bhavas (Sage Jaimini Sutras):**",
      klBhavasStr,
      "- **Jaimini Chara Dasha System (" + js.charaDasha.progressionDirection + "):**",
      "  - Active Chara Mahadasha: **" + js.charaDasha.activeMahadasha.signName + "** (" + js.charaDasha.activeMahadasha.durationYears + " Years, " + js.charaDasha.activeMahadasha.startDate + " to " + js.charaDasha.activeMahadasha.endDate + ") — Lord: " + js.charaDasha.activeMahadasha.lord,
      "  - Dasha Significations: " + js.charaDasha.activeMahadasha.keySignifications,
      "- **Jaimini 3-Pair Longevity (Ayurdaya):** **" + js.longevity.compositeLongevity + "** (Rudra: " + js.longevity.rudraGraha + ", Brahma: " + js.longevity.brahmaGraha + ")",
      "- **Upapada Lagna (UL - 12th Arudha in " + js.upapada.upapadaSign + "):** Harmony Score: " + js.upapada.maritalHarmonyScore + "/100 • " + js.upapada.spouseProfile + " • " + js.upapada.maritalLongevityVerdict,
      "- **Jaimini Raja Yogas:** " + js.jaiminiRajaYogas.join(" • "),
      "- **Master Jaimini Synthesis:** " + js.masterJaiminiSynthesis,
    ].join("\n");
  } catch (_) {}

  // 26. Gayatri Jyotish (Savita Solar Resonance & 24 Aksharas) Suite
  let gayatriSummary = "";
  try {
    const gj = evaluateGayatriJyotish(natalEphemeris);
    const koshasStr = gj.koshaDiagnostics.map((k) => `- **${k.sanskritTitle}:** ${k.vitalityScore}% (${k.pranicStatus}) • Guidance: ${k.harmonizationGuidance}`).join("\n");
    const afflictedGayatris = gj.grahaGayatris.filter((g) => g.afflictionScore >= 35);
    const gayatrisStr = afflictedGayatris.length > 0
      ? afflictedGayatris.map((g) => `- 🕉️ **${g.planetName} Gayatri (${g.presidingDevata} — Affliction: ${g.afflictionScore}%):** \`${g.sanskritMantra}\` (${g.recommendedDailyMalas} Malas/day) -> ${g.therapeuticEffect}`).join("\n")
      : "- All 9 Grahas in serene cosmic harmony; standard Rigvedic Gayatri recitation sufficient.";

    gayatriSummary = [
      "- **Personal Gayatri Akshara (Janma Nakshatra Pada):** **" + gj.personalAkshara.syllable + "** (Pada " + gj.personalAkshara.padaNumber + ") • Presiding Deity: **" + gj.personalAkshara.presidingDeity + "** • Rishi: **" + gj.personalAkshara.presidingRishi + "** • Tattwa: " + gj.personalAkshara.tattwa,
      "- **Savita Solar Resonance Score:** **" + gj.savitaSolarResonanceScore + "%** (Solar Core Prana)",
      "- **5 Kosha Spiritual Vitality Diagnostics (पञ्चकोश विश्लेषण):**",
      koshasStr,
      "- **Targeted Graha Gayatri Remedial Mantras:**",
      gayatrisStr,
      "- **Personalized Gayatri Anushthana Prescription:**",
      "  - Recommended Form: **" + gj.anushthanaPlan.recommendedAnushthana + "** (" + gj.anushthanaPlan.targetJapaCount + " Total Japa, " + gj.anushthanaPlan.dailyMalaCount + " Malas/day for " + gj.anushthanaPlan.durationDays + " days)",
      "  - Optimal Timing: " + gj.anushthanaPlan.optimalSandhyaTiming,
      "  - Surya Arghya Ritual: " + gj.anushthanaPlan.suryaArghyaGuidance,
      "  - Savita Dhyana Visualization: " + gj.anushthanaPlan.savitaMeditationVisualization,
      "  - Protective Shield: " + gj.anushthanaPlan.recommendedKavacham,
      "- **Master Gayatri Synthesis:** " + gj.masterGayatriSynthesis,
    ].join("\n");
  } catch (_) {}

  // 27. Acharya Ganesh Kavi Jataka Alankara (1613 CE) Suite
  let alankaraSummary = "";
  try {
    const ja = evaluateJatakaAlankara(natalEphemeris);
    const topHouses = [...ja.bhavaAlankaras].sort((a, b) => b.alankaraScore - a.alankaraScore).slice(0, 4);
    const topHousesStr = topHouses.map((b) => `- **House ${b.bhavaNum} (${b.sanskritTitle.split(" ")[0]}):** ${b.alankaraScore}% (${b.ornamentationGrade}) • Lord: ${b.lordName} in H${b.lordPlacementHouse} • Occupants: ${b.occupants.join(", ") || "None"} -> ${b.classicalPhala}`).join("\n");
    const activeYogas = ja.specialYogas.filter((y) => y.isFormed);
    const yogasStr = activeYogas.length > 0
      ? activeYogas.map((y) => `- 👑 **${y.yogaName}:** ${y.description} -> *${y.classicalShlokaEffect}*`).join("\n")
      : "- Steady baseline planetary ornamentation.";
    const diseaseStr = ja.diseaseDiagnostics.map((d) => `- **${d.diseaseCategory}:** ${d.vulnerabilityLevel} -> Remedy: ${d.classicalRemedy}`).join("\n");

    alankaraSummary = [
      "- **Supreme Ornamented House (उत्तम भाव अलंकार):** House " + ja.strongestBhava.bhavaNum + " (" + ja.strongestBhava.sanskritTitle + ") with " + ja.strongestBhava.alankaraScore + "% (" + ja.strongestBhava.ornamentationGrade + ")",
      "- **Leading House Ornamentation Hierarchy (Ganesh Kavi Shlokas):**",
      topHousesStr,
      "- **Detected Jataka Alankara Special Yogas:**",
      yogasStr,
      "- **Arishta & Disease Diagnostics (रोग एवं अरिष्ट निर्णय):**",
      diseaseStr,
      "- **Stri Jataka & Marital Fortune (दाम्पत्य सौख्य):** Saubhagya Score: " + ja.maritalFortune.saubhagyaScore + "% • Spouse: " + ja.maritalFortune.spouseCharacter + " • " + ja.maritalFortune.maritalProsperityVerdict + " • Remedy: " + ja.maritalFortune.ganeshKaviRemedy,
      "- **Master Jataka Alankara Synthesis:** " + ja.masterAlankaraSynthesis,
    ].join("\n");
  } catch (_) {}

  // 28. Dr. B.V. Raman Jatak Nirnay (Parts 1 & 2 - How to Judge a Horoscope) Suite
  let nirnaySummary = "";
  try {
    const jn = evaluateJatakNirnay(natalEphemeris);
    const topBhavas = [...jn.bhavaJudgements].sort((a, b) => b.compositeRamanScore - a.compositeRamanScore).slice(0, 4);
    const topBhavasStr = topBhavas.map((b) => `- **House ${b.bhavaNum} (${b.sanskritTitle.split(" ")[0]}):** ${b.compositeRamanScore}% (${b.potencyGrade}) • Tripartite: Bhava ${b.bhavaScore}%, Lord ${b.lordScore}% (H${b.lordPlacementHouse}), Karaka ${b.primaryKaraka} ${b.karakaScore}% • Status: ${b.vriddhiNashaStatus} -> ${b.lifePredictions}`).join("\n");
    const vriddhiList = jn.vriddhiNashaSummaries.filter((v) => v.status === "Bhava Vriddhi (Flourishing)");
    const nashaList = jn.vriddhiNashaSummaries.filter((v) => v.status === "Bhava Nasha (Afflicted)");
    const vriddhiStr = vriddhiList.length > 0
      ? vriddhiList.map((v) => `H${v.bhavaNum} (${v.sanskritTitle.split(" ")[0]})`).join(", ")
      : "None";
    const nashaStr = nashaList.length > 0
      ? nashaList.map((n) => `H${n.bhavaNum} (${n.sanskritTitle.split(" ")[0]} -> ${n.astrologicalBasis})`).join("; ")
      : "None (All Bhavas well-fortified)";

    nirnaySummary = [
      "- **Supreme Raman House (अग्रणी भाव निर्णय):** House " + jn.strongestBhava.bhavaNum + " (" + jn.strongestBhava.sanskritTitle + ") with " + jn.strongestBhava.compositeRamanScore + "% (" + jn.strongestBhava.potencyGrade + ")",
      "- **Lowest Scoring House:** House " + jn.weakestBhava.bhavaNum + " (" + jn.weakestBhava.sanskritTitle + ") with " + jn.weakestBhava.compositeRamanScore + "% (" + jn.weakestBhava.potencyGrade + ")",
      "- **Top Tripartite Judged Bhavas (भाव, भावेश, भावकारक):**",
      topBhavasStr,
      "- **Bhava Vriddhi (Flourishing Houses):** " + vriddhiStr,
      "- **Bhava Nasha (Afflicted Houses Requiring Shanti):** " + nashaStr,
      "- **Dr. B.V. Raman Remedial Prescription:** " + jn.weakestBhava.ramanRemedy,
      "- **Master Jatak Nirnay Synthesis:** " + jn.masterNirnaySynthesis,
    ].join("\n");
  } catch (_) {}

  // 29. Vaidyanatha Dikshita Jataka Parijata (Volumes 1-3, 18 Adhyayas) Suite
  let parijataSummary = "";
  try {
    const jp = evaluateJatakaParijata(natalEphemeris);
    const activeYogas = jp.shodashaYogas.filter((y) => y.isFormed);
    const yogasStr = activeYogas.length > 0
      ? activeYogas.map((y) => `- 👑 **${y.yogaName}:** ${y.description} -> *${y.classicalShlokaEffect}*`).join("\n")
      : "- Baseline planetary configuration in the 16 Shodasha Yogas.";
    const topMastery = [...jp.bhavaMastery].sort((a, b) => b.parijataScore - a.parijataScore).slice(0, 4);
    const topMasteryStr = topMastery.map((b) => `- **House ${b.bhavaNum} (${b.sanskritTitle.split(" ")[0]}):** ${b.parijataScore}% (${b.masteryGrade}) • Lord: ${b.lordName} in H${b.lordPlacementHouse} -> ${b.classicalPhala}`).join("\n");

    parijataSummary = [
      "- **Formed Shodasha Parijata Yogas (षोडश पारिजात योगाः):**",
      yogasStr,
      "- **64th Navamsha & 22nd Drekkana (Kharesh Engine):**",
      "  - 64th Navamsha from Moon: **" + jp.khareshAndNavamsha.navamsha64Moon.signName + "** (Lord: " + jp.khareshAndNavamsha.navamsha64Moon.lord + ", Range: " + jp.khareshAndNavamsha.navamsha64Moon.degreeRange + ")",
      "  - 64th Navamsha from Lagna: **" + jp.khareshAndNavamsha.navamsha64Lagna.signName + "** (Lord: " + jp.khareshAndNavamsha.navamsha64Lagna.lord + ")",
      "  - 22nd Drekkana Kharesh Lord: **" + jp.khareshAndNavamsha.drekkana22Kharesh.khareshLord + "** (Governs House 8 vulnerability)",
      "  - Gulika Position: House " + jp.khareshAndNavamsha.gulika.house + " in " + jp.khareshAndNavamsha.gulika.signName + " (" + jp.khareshAndNavamsha.gulika.longitude + "°)",
      "  - Protection: " + jp.khareshAndNavamsha.protectionGuidelines,
      "- **Kalachakra Dasha Deha & Jeeva Diagnostic (" + jp.kalachakraDiagnostics.group + "):**",
      "  - Deha (Body) Sign: **" + jp.kalachakraDiagnostics.dehaRashi + "** (Lord: " + jp.kalachakraDiagnostics.dehaLord + ")",
      "  - Jeeva (Life Force) Sign: **" + jp.kalachakraDiagnostics.jeevaRashi + "** (Lord: " + jp.kalachakraDiagnostics.jeevaLord + ")",
      "  - Diagnostic Status: " + jp.kalachakraDiagnostics.vitalityAlert,
      "- **Leading 12 Bhavas Parijata Mastery Hierarchy:**",
      topMasteryStr,
      "- **Master Jataka Parijata Synthesis:** " + jp.masterParijataSynthesis,
    ].join("\n");
  } catch (_) {}

  // 24. Kundli Milan & Ashtakoota 36-Guna Compatibility (Active Pair)
  let matchmakingSummary = "";
  if (matchmaking && matchmaking.boy && matchmaking.girl) {
    try {
      const parseLocal = (iso: string, tz: number = 5.5) => {
        const [dPart, tPart] = iso.split("T");
        if (!dPart || !tPart) return new Date(iso);
        const [y, m, d] = dPart.split("-").map(Number);
        const [h, min] = tPart.split(":").map(Number);
        const utcMs = Date.UTC(y, m - 1, d, h || 0, min || 0, 0) - tz * 3600 * 1000;
        return new Date(utcMs);
      };

      const boyUtc = parseLocal(matchmaking.boy.dateIso, matchmaking.boy.location?.timezoneOffsetHours || 5.5);
      const girlUtc = parseLocal(matchmaking.girl.dateIso, matchmaking.girl.location?.timezoneOffsetHours || 5.5);

      const boyEphem = calculateVedicEphemeris(boyUtc, matchmaking.boy.location, natalEphemeris.ayanamshaType);
      const girlEphem = calculateVedicEphemeris(girlUtc, matchmaking.girl.location, natalEphemeris.ayanamshaType);

      const matchRes = calculateMatchmaking(boyEphem, girlEphem);

      const boyD1 = calculateShodashavargaChart(boyEphem, "D1");
      const boyD9 = calculateShodashavargaChart(boyEphem, "D9");
      const girlD1 = calculateShodashavargaChart(girlEphem, "D1");
      const girlD9 = calculateShodashavargaChart(girlEphem, "D9");

      // Lagna to Lagna relationship
      const boyLagnaSign = Math.floor(boyEphem.ascendant.siderealLongitude / 30);
      const girlLagnaSign = Math.floor(girlEphem.ascendant.siderealLongitude / 30);
      const lagnaDiff = ((girlLagnaSign - boyLagnaSign + 12) % 12) + 1;
      const lagnaAxisName =
        lagnaDiff === 1 ? "Sama-Lagna (1-1 Identical / Highly Attuned)" :
        lagnaDiff === 7 ? "Saptama-Kendra (1-7 Complementary Polarity)" :
        lagnaDiff === 5 || lagnaDiff === 9 ? "Trikona (1-5-9 Harmonious Trine)" :
        lagnaDiff === 4 || lagnaDiff === 10 ? "Kendra (1-4-10 Dynamic Action Axis)" :
        lagnaDiff === 3 || lagnaDiff === 11 ? "Upachaya (3-11 Mutual Growth Axis)" :
        lagnaDiff === 6 || lagnaDiff === 8 ? "Shadashtaka (6-8 Karmic / Transformation Tension)" :
        "Dwirdwadashe (2-12 Financial/Resource Adjustment)";

      // Moon to Moon relationship
      const boyMoonSign = Math.floor((boyEphem.planets.Moon?.siderealLongitude || 0) / 30);
      const girlMoonSign = Math.floor((girlEphem.planets.Moon?.siderealLongitude || 0) / 30);
      const moonDiff = ((girlMoonSign - boyMoonSign + 12) % 12) + 1;
      const moonAxisName =
        moonDiff === 1 ? "Sama-Rashi (1-1 Emotional Mirroring)" :
        moonDiff === 7 ? "Saptama-Rashi (1-7 Emotional Attraction)" :
        moonDiff === 5 || moonDiff === 9 ? "Trikona (5-9 Mutual Emotional Resonance)" :
        moonDiff === 3 || moonDiff === 11 ? "Mitra (3-11 Friendly Growth)" :
        moonDiff === 6 || moonDiff === 8 ? "Shadashtaka (6-8 Bhakoot Tension / Adjustments)" :
        "Dwirdwadashe (2-12 Psychological Difference)";

      matchmakingSummary = [
        "- **Dual Profile Identity in Matchmaking Suite:**",
        "  - ♂ **Groom (वर):** " + matchmaking.boy.name + " • Born: " + matchmaking.boy.dateIso + " at " + matchmaking.boy.location.cityName + " (TZ: +" + (matchmaking.boy.location.timezoneOffsetHours || 5.5) + "h)",
        "    - **D1 Lagna:** " + boyD1.ascendant.vargaRashi.englishName + " (" + boyD1.ascendant.vargaRashi.sanskritName + ") at " + (boyEphem.ascendant.siderealLongitude % 30).toFixed(2) + "° (" + boyEphem.ascendant.nakshatra.sanskritName + " Pada " + (boyEphem.ascendant.nakshatra.pada || 1) + ")",
        "    - **Moon:** " + (boyEphem.planets.Moon?.rashi.englishName || "N/A") + " at " + ((boyEphem.planets.Moon?.siderealLongitude || 0) % 30).toFixed(2) + "° (" + (boyEphem.planets.Moon?.nakshatra.sanskritName || "") + " Pada " + (boyEphem.planets.Moon?.nakshatra.pada || 1) + ")",
        "    - **D9 Navamsha Lagna:** " + boyD9.ascendant.vargaRashi.englishName + " (" + boyD9.ascendant.vargaRashi.sanskritName + ")",
        "  - ♀ **Bride (कन्या):** " + matchmaking.girl.name + " • Born: " + matchmaking.girl.dateIso + " at " + matchmaking.girl.location.cityName + " (TZ: +" + (matchmaking.girl.location.timezoneOffsetHours || 5.5) + "h)",
        "    - **D1 Lagna:** " + girlD1.ascendant.vargaRashi.englishName + " (" + girlD1.ascendant.vargaRashi.sanskritName + ") at " + (girlEphem.ascendant.siderealLongitude % 30).toFixed(2) + "° (" + girlEphem.ascendant.nakshatra.sanskritName + " Pada " + (girlEphem.ascendant.nakshatra.pada || 1) + ")",
        "    - **Moon:** " + (girlEphem.planets.Moon?.rashi.englishName || "N/A") + " at " + ((girlEphem.planets.Moon?.siderealLongitude || 0) % 30).toFixed(2) + "° (" + (girlEphem.planets.Moon?.nakshatra.sanskritName || "") + " Pada " + (girlEphem.planets.Moon?.nakshatra.pada || 1) + ")",
        "    - **D9 Navamsha Lagna:** " + girlD9.ascendant.vargaRashi.englishName + " (" + girlD9.ascendant.vargaRashi.sanskritName + ")",
        "- **Ashtakoota 36-Guna Scoring:** **" + matchRes.totalScore + " / 36 Gunas (" + matchRes.verdict + ")**",
        "  - 1. Varna Koota (1 pt): **" + matchRes.kootas.varna.obtainedScore + "/1** (" + matchRes.kootas.varna.description + ")",
        "  - 2. Vashya Koota (2 pts): **" + matchRes.kootas.vashya.obtainedScore + "/2** (" + matchRes.kootas.vashya.description + ")",
        "  - 3. Tara Koota (3 pts): **" + matchRes.kootas.tara.obtainedScore + "/3** (" + matchRes.kootas.tara.description + ")",
        "  - 4. Yoni Koota (4 pts): **" + matchRes.kootas.yoni.obtainedScore + "/4** (" + matchRes.kootas.yoni.description + ")",
        "  - 5. Graha Maitri (5 pts): **" + matchRes.kootas.grahaMaitri.obtainedScore + "/5** (" + matchRes.kootas.grahaMaitri.description + ")",
        "  - 6. Gana Koota (6 pts): **" + matchRes.kootas.gana.obtainedScore + "/6** (" + matchRes.kootas.gana.description + ")",
        "  - 7. Bhakoot Koota (7 pts): **" + matchRes.kootas.bhakoot.obtainedScore + "/7** (" + matchRes.kootas.bhakoot.description + ")",
        "  - 8. Nadi Koota (8 pts): **" + matchRes.kootas.nadi.obtainedScore + "/8** (" + matchRes.kootas.nadi.description + ")",
        "- **Manglik Dosha & Bhanga Status:**",
        "  - Groom Manglik: " + (matchRes.boyManglik.isManglik ? "Manglik (Mars in H" + matchRes.boyManglik.marsHouseFromLagna + ")" : "Non-Manglik") + " • Bride Manglik: " + (matchRes.girlManglik.isManglik ? "Manglik (Mars in H" + matchRes.girlManglik.marsHouseFromLagna + ")" : "Non-Manglik"),
        "  - Manglik Harmony Verdict: **" + (matchRes.manglikCompatibility.isCompatible ? "Compatible (सम्मत)" : "Caution") + "** -> " + matchRes.manglikCompatibility.description,
        "- **Cross-Kundli Synastry:**",
        "  - Lagna-to-Lagna Axis: **" + lagnaAxisName + "**",
        "  - Moon-to-Moon Axis: **" + moonAxisName + "**",
        "- **Classical Shastric Verdict:** " + matchRes.verdictDescription,
      ].join("\n");
    } catch (_) {}
  }

  const lines = [
    "### NATIVE'S COMPREHENSIVE VEDIC ASTROLOGICAL DOSSIER (B.V. RAMAN & PARASHARI STANDARD):",
    "- **Current Real-Time Consultation Date:** " + evaluationDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) + " (Year: " + evaluationDate.getFullYear() + ")",
    "- **Date & Time of Birth (UTC):** " + birthDate.toUTCString(),
    "- **Birth Location:** " + location.cityName + (location.country ? ", " + location.country : "") + " (Lat: " + location.latitude.toFixed(2) + "°, Lon: " + location.longitude.toFixed(2) + "°)",
    "- **Ayanamsha Model:** " + natalEphemeris.ayanamshaType + " (" + natalEphemeris.ayanamshaValue.toFixed(3) + "°)",
    "",
    "#### 🌟 1. CORE LAGNA & FUNCTIONAL ROLES:",
    "- **Native Gender (लिंग):** " + (gender === "female" ? "Female (स्त्री) ♀" : "Male (पुरुष) ♂"),
    "- **Gender Interpretive Directive:** " + (gender === "female" ? "Apply classical Stree Jataka principles (BPHS Ch. 80 / Varahamihira Ch. 22). When interpreting marriage, relationships, and spouse, treat Jupiter (Guru), 7th Lord, and 8th House (Mangalya Sthana / marital longevity) as primary indicators for husband. For progeny and motherhood, evaluate Kshetra Sphuta and 5th/9th houses." : "When interpreting marriage, relationships, and spouse, treat Venus (Shukra), 7th Lord, and Upapada Lagna (UL) as primary indicators for wife. For progeny and virility, evaluate Beeja Sphuta and 5th/9th houses."),
    "- **Ascendant (Lagna / लग्न):** " + ascRashi.englishName + " (" + ascRashi.sanskritName + ") at " + (ascLon % 30).toFixed(2) + "° • Ruling Lord: " + ascRashi.lord,
    "- **Moon Sign (Janma Rashi / चन्द्र राशि):** " + RASHI_NAMES[Math.floor(moonLon / 30)].englishName + " (" + RASHI_NAMES[Math.floor(moonLon / 30)].sanskritName + ") • Lord: " + RASHI_NAMES[Math.floor(moonLon / 30)].lord,
    "- **Moon Nakshatra:** " + (natalEphemeris.planets.Moon?.nakshatra.sanskritName || "") + " Pada " + (natalEphemeris.planets.Moon?.nakshatra.pada || 1) + " (Deity: " + (natalEphemeris.planets.Moon?.nakshatra.deity || "") + ", Lord: " + (natalEphemeris.planets.Moon?.nakshatra.lord || "") + ")",
    "- **Sun Sign (Surya Rashi):** " + RASHI_NAMES[Math.floor((natalEphemeris.planets.Sun?.siderealLongitude || 0) / 30)].englishName + " (" + RASHI_NAMES[Math.floor((natalEphemeris.planets.Sun?.siderealLongitude || 0) / 30)].sanskritName + ")",
    "- **Functional Lordship Matrix for this Lagna:**",
    functionalRolesFormatted,
    "",
    "#### 🪐 2. NATAL PLANETARY POSITIONS (D1 KUNDLI HOUSES):",
    planetsSummary.join("\n"),
    "",
    "#### 🤝 3. PANCHA-DA MAITRI (5-FOLD RELATIONSHIP WITH SIGN DISPOSITOR):",
    panchadaSummary,
    "",
    "#### ⚖️ 4. ISHTA PHALA, KASHTA PHALA & RESIDENTIAL STRENGTH (0-60 SCALE):",
    ishtaKashtaSummary,
    "",
    "#### 📜 5. B.V. RAMAN 300 YOGAS & ACTIVATION TIMELINE:",
    "- **Currently Active Yogas in Running Dasha (" + (activeDasha ? activeDasha.mahadasha.name + "/" + activeDasha.antardasha.name : "N/A") + "):**",
    activeYogasFormatted,
    "",
    "- **Lifelong Constitutional & Archetypal Yogas:**",
    lifelongYogasFormatted,
    "",
    "- **Upcoming Yogas (Scheduled in Next Dasha Periods):**",
    upcomingYogasFormatted,
    "",
    "- **Cancelled Yogas / Neutralized Doshas (Bhanga Status):**",
    cancelledYogasFormatted,
    "",
    "#### 👑 6. CURRENT VIMSHOTTARI DASHA TIMELINE:",
    activeDashaSection,
    "",
    "#### 🏛️ 7. 12 BHAVAS TRIPARTITE JUDGEMENT (RAMAN HOW TO JUDGE A HOROSCOPE):",
    bhavaJudgementSummary,
    "",
    "#### 🛡️ 8. BADHAKA STHANA & PLANETARY AVASTHAS (SCIENTIFIC HINDU ASTROLOGY):",
    badhakaAvasthasSummary,
    "",
    "#### 📜 9. BHRIGU NANDI NADI (BNN) & BHRIGU SARAL PADDHATI (BSP AGE TRIGGERS):",
    bhriguSummary,
    "",
    "#### 💎 10. DIVISIONAL CHARTS (VARGAS):",
    "- **D9 Navamsha (Dharma, Marriage & Potential):** Lagna in " + d9Chart.ascendant.vargaRashi.englishName + " • Placements: " + d9Summary.join(", "),
    "- **D10 Dashamsha (Career, Profession & Power):** Lagna in " + d10Chart.ascendant.vargaRashi.englishName + " • Placements: " + d10Summary.join(", "),
    "",
    "#### ⚖️ 11. JAIMINI CHARA KARAKAS (SOUL & PURPOSE):",
    jaiminiSummary,
    "",
    "#### ⚡ 12. SHADBALA (PLANETARY STRENGTHS & CAPACITY):",
    shadbalaSummary,
    "",
    "#### 📊 13. ASHTAKAVARGA STRENGTH (BENEFIC POINTS):",
    ashtakavargaSummary,
    "",
    "#### 🪐 14. SHANI SADE SATI & GOCHAR TRANSITS:",
    "- **Sade Sati Status:** " + gochar.sadeSati.statusTitle + " (" + gochar.sadeSati.phaseName + ")",
    "- **Saturn Transit Position:** House " + gochar.sadeSati.houseFromMoon + " from Natal Moon in " + gochar.sadeSati.saturnTransitRashi,
    "- **Remaining Duration:** " + (gochar.sadeSati.remainingDurationFormatted || "N/A"),
    gochar.sadeSati.currentPhaseEndFormatted ? "- Current Phase Ends: " + gochar.sadeSati.currentPhaseEndFormatted : "",
    gochar.sadeSati.totalCompletionFormatted ? "- Total Sade Sati Ends: " + gochar.sadeSati.totalCompletionFormatted : "",
    gochar.sadeSati.nextCycleStartFormatted ? "- Next Cycle Begins: " + gochar.sadeSati.nextCycleStartFormatted : "",
    "",
    "#### 📅 15. PANCHANGA AT BIRTH & TRANSIT MOMENT:",
    `- **Tithi:** ${natalEphemeris.panchanga.tithi.name} (${natalEphemeris.panchanga.tithi.paksha} Paksha)${natalEphemeris.panchanga.tithi.endTime ? ` (Ends at: ${natalEphemeris.panchanga.tithi.endTime}${natalEphemeris.panchanga.tithi.remainingFormatted ? `, ${natalEphemeris.panchanga.tithi.remainingFormatted}` : ""})` : ""}`,
    `- **Nakshatra:** ${natalEphemeris.panchanga.nakshatra.sanskritName} Pada ${natalEphemeris.panchanga.nakshatra.pada} (Lord: ${natalEphemeris.panchanga.nakshatra.lord})${natalEphemeris.panchanga.nakshatra.endTime ? ` (Ends at: ${natalEphemeris.panchanga.nakshatra.endTime})` : ""}`,
    "- **Vara (Weekday):** " + natalEphemeris.panchanga.vara.name + " (Ruler: " + natalEphemeris.panchanga.vara.lord + ")",
    "- **Yoga:** " + natalEphemeris.panchanga.yoga.name,
    "- **Karana:** " + natalEphemeris.panchanga.karana.name,
    "",
    "#### ☸️ 16. K.N. RAO KARMA, REBIRTH & PURVA PUNYA DOSSIER:",
    karmaSummary,
    "",
    "#### ⚡ 17. K.N. RAO DOUBLE TRANSIT (DTP) & PAC-DARES REAL-TIME TIMING:",
    dtpSummary,
    "",
    "#### 💍 18. K.N. RAO TIMING OF MARRIAGE (3-TIER PREDICTIVE FILTER):",
    marriageSummary,
    "",
    "#### 🌟 19. K.N. RAO ADVANCED PREDICTIVE TECHNIQUES (SATURN-VENUS & SPHUTAS):",
    techniquesSummary,
    "",
    "#### 🎓 20. K.N. RAO & NAVAL SINGH PLANETS & EDUCATION DOSSIER:",
    educationSummary,
    "",
    "#### ⏳ 21. CLASSICAL MULTI-DASHA & YOGINI DASHA DOSSIER:",
    multiDashaSummary,
    "",
    "#### 📜 22. PRIMORDIAL PARASHARI BPHS CORE DOSSIER:",
    bphsSummary,
    "",
    "#### 👑 23. ACHARYA VARAHAMIHIRA BRIHAT JATAKA DOSSIER:",
    bjSummary,
    "",
    "#### 🐢 24. ACHARYA VARAHAMIHIRA BRIHAT SAMHITA DOSSIER (KURMA CHAKRA & GEMS):",
    bsSummary,
    "",
    "#### 📜 25. DEVA KERALAM (CHANDRA KALA NADI) 150 NADI AMSHAS DOSSIER:",
    dkSummary,
    "",
    "#### 🦜 26. DOCTRINES OF SUKA NADI (MAHARSHI SHUKACHARYA) DOSSIER:",
    sukaSummary,
    "",
    "#### 📜 27. MAHARSHI JAIMINI UPADESHA SUTRAS (COMPLETE 4 ADHYAYAS) DOSSIER:",
    jsSummary,
    "",
    "#### ☀️ 28. GAYATRI JYOTISH (SAVITA SOLAR RESONANCE & 24 AKSHARAS) DOSSIER:",
    gayatriSummary,
    "",
    "#### 🏛️ 29. ACHARYA GANESH KAVI JATAKA ALANKARA (1613 CE) DOSSIER:",
    alankaraSummary,
    "",
    "#### 📖 30. DR. B.V. RAMAN JATAK NIRNAY (HOW TO JUDGE A HOROSCOPE 1 & 2) DOSSIER:",
    nirnaySummary,
    "",
    "#### 🌺 31. VAIDYANATHA DIKSHITA JATAKA PARIJATA (VOLS 1-3, 18 ADHYAYAS) DOSSIER:",
    parijataSummary,
  ];

  if (matchmakingSummary) {
    lines.push("");
    lines.push("#### 💍 32. KUNDLI MILAN & 36-GUNA COMPATIBILITY DOSSIER (ACTIVE PARTNERSHIP):");
    lines.push(matchmakingSummary);
  }

  return lines.filter(Boolean).join("\n");
}
