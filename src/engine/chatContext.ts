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
import { RASHI_NAMES } from "./constants";

export function buildAstroDossier(
  natalEphemeris: EphemerisResult,
  transitEphemeris: EphemerisResult,
  evaluationDate: Date = new Date(),
  gender: "male" | "female" = "male"
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
    "#### 📅 15. PANCHANGA AT BIRTH:",
    "- **Tithi:** " + natalEphemeris.panchanga.tithi.name + " (" + natalEphemeris.panchanga.tithi.paksha + " Paksha)",
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
  ];

  return lines.filter(Boolean).join("\n");
}
