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
import { evaluateSaravali } from "./saravali";
import { evaluatePhaladeepika } from "./phaladeepika";
import { evaluatePrasnaMarga } from "./prasnaMarga";
import { evaluateSamhitaSkandha } from "./samhitaSkandha";
import { evaluateSanketanidhi } from "./sanketanidhi";
import { evaluateSarvarthaChintamani } from "./sarvarthaChintamani";
import { evaluateStriJataka } from "./striJataka";
import { evaluateSatyaJataka } from "./satyaJataka";
import { evaluateSugamJyotish } from "./sugamJyotish";
import { evaluateUttaraKalamrita } from "./uttaraKalamrita";
import { evaluateVedicPredictions } from "./vedicPredictions";
import { evaluateJatakaChandrika } from "./jatakaChandrika";
import { evaluateChappannaPrasna } from "./chappannaPrasna";
import { evaluateBhriguSamhita } from "./bhriguSamhita";
import { evaluateBhavarthaRatnakara } from "./bhavarthaRatnakara";
import { evaluateJaiminiRangacharya } from "./jaiminiRangacharya";
import { evaluateCruxOfAstrology } from "./cruxOfVedicAstrology";
import { evaluateCuspalInterlinks } from "./cuspalInterlinks";
import { evaluateMeenaNadi } from "./meenaNadi";
import { evaluateJatakaTattvam } from "./jatakaTattvam";
import { evaluatePadmaChakra } from "./padmaChakra";
import { evaluateShashtiamsha, evaluateBcpWheel, evaluateSuryaRemedies } from "./shashtiamsha";
import { evaluatePatanjaliYoga } from "./patanjaliYoga";
import { evaluateKotaChakra, evaluateDashaLordTransit } from "./kotaChakra";
import { evaluateRaman300Combinations, evaluateLalKitabTeva, evaluateNarayanaKavacham } from "./raman300Combinations";
import { evaluateBenchmarkResonance } from "./benchmarkHoroscopes";
import { evaluatePrasnaTantra, evaluateMargabandhuStotram } from "./prasnaTantra";
import { evaluatePatelAshtakavarga } from "./patelAshtakavarga";
import { analyzeCareerJobBusiness } from "./careerJobBusiness";
import { calculateMatchmaking } from "./matchmaking";
import { calculateVedicEphemeris } from "./ephemeris";
import { calculatePredictiveDecisionGates } from "./predictiveDecisionGates";
import { calculateDayMuhurta } from "./muhurta";
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
  const tzOffset = location.timezoneOffsetHours || 0;
  const tzOffsetMs = tzOffset * 3600 * 1000;
  const localBirthDate = new Date(birthDate.getTime() + tzOffsetMs);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const localYear = localBirthDate.getUTCFullYear();
  const localMonth = monthNames[localBirthDate.getUTCMonth()];
  const localDay = localBirthDate.getUTCDate();
  const localHours = String(localBirthDate.getUTCHours()).padStart(2, "0");
  const localMinutes = String(localBirthDate.getUTCMinutes()).padStart(2, "0");
  const tzSign = tzOffset >= 0 ? "+" : "-";
  const tzAbsH = Math.floor(Math.abs(tzOffset));
  const tzAbsM = Math.round((Math.abs(tzOffset) - tzAbsH) * 60);
  const tzFormatted = `UTC${tzSign}${String(tzAbsH).padStart(2, "0")}:${String(tzAbsM).padStart(2, "0")}`;
  const localBirthStr = `${localMonth} ${localDay}, ${localYear} at ${localHours}:${localMinutes} (${tzFormatted} Local Standard Time)`;

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

  // 4. Shadbala Planetary Strengths (% Requirement Ratio Standard Hierarchy)
  let shadbalaSummary = "Shadbala calculated.";
  try {
    const shadbalaResult = calculateShadbala(natalEphemeris);
    shadbalaSummary = shadbalaResult.rankedPlanets
      .map(
        (p, idx) =>
          `#${idx + 1} ${p.name}: **${p.percentageEfficiency}% Strength** (${p.strengthRatio.toFixed(2)}x Quota • ${p.totalRupas.toFixed(2)} R / ${p.requiredRupas.toFixed(1)} R req) • [${p.isBalavan ? "Balavan / Strong (बलवान)" : "Deficient / Requires Upaya"}]`
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

  const pastDashaWindows: string[] = [];
  const nowMs = evaluationDate.getTime();
  for (const md of dasha.mahadashas) {
    for (const ad of md.antardashas) {
      if (ad.endDate.getTime() <= nowMs && ad.startDate.getTime() >= birthDate.getTime()) {
        pastDashaWindows.push(md.lord.name + "-" + ad.lord.name + " (" + ad.startDate.getFullYear() + "-" + ad.endDate.getFullYear() + ")");
      }
    }
  }
  const recentPastPeriods = pastDashaWindows.slice(-6).join(", ");

  const activeDashaSection = activeDasha
    ? [
        "- **Active Mahadasha (MD):** " + activeDasha.mahadasha.name + " (" + activeDasha.mahadasha.hindiName + ") [" + activeDasha.mdStart.toLocaleDateString() + " to " + activeDasha.mdEnd.toLocaleDateString() + "]",
        "- **Active Antardasha (AD):** " + activeDasha.antardasha.name + " (" + activeDasha.antardasha.hindiName + ") [" + activeDasha.adStart.toLocaleDateString() + " to " + activeDasha.adEnd.toLocaleDateString() + "]",
        "- **Active Pratyantardasha (PD):** " + activeDasha.pratyantardasha.name + " (" + activeDasha.pratyantardasha.hindiName + ") [" + activeDasha.pdStart.toLocaleDateString() + " to " + activeDasha.pdEnd.toLocaleDateString() + "]",
        "- **Recent Past Dasha Windows (For BTR & Past Event Verification):** " + (recentPastPeriods || "Early childhood"),
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

  // 30. Maharaja Kalyana Varma Saravali (800 CE, 45 Adhyayas) Suite
  let saravaliSummary = "";
  try {
    const sv = evaluateSaravali(natalEphemeris);
    const activeYogas = sv.royalYogas.filter((y) => y.isFormed);
    const yogasStr = activeYogas.length > 0
      ? activeYogas.map((y) => `- 👑 **${y.yogaName}:** ${y.description} -> *${y.classicalShlokaEffect}*`).join("\n")
      : "- Baseline planetary dispositions in Saravali royal combinations.";

    const conjStr = sv.conjunctions.length > 0
      ? sv.conjunctions.map((c) => `- 🪐 **${c.yogaTitle} (House ${c.house}, ${c.signName}):** ${c.planets.join(" + ")} -> ${c.saravaliPhala}`).join("\n")
      : "- No multi-planet conjunctions in natal chart.";

    const topBhavas = [...sv.bhavaPotency].sort((a, b) => b.saravaliScore - a.saravaliScore).slice(0, 4);
    const topBhavasStr = topBhavas.map((b) => `- **House ${b.bhavaNum} (${b.sanskritTitle.split(" ")[0]}):** ${b.saravaliScore}% (${b.royalGrade}) • Lord: ${b.lordName} in H${b.lordPlacementHouse} -> ${b.classicalPhala}`).join("\n");

    saravaliSummary = [
      "- **Active Saravali Sovereign & Dhana Yogas (महाराज एवं वसुमती योगाः):**",
      yogasStr,
      "- **Multi-Graha Conjunction Matrix (Adhyayas 15-21):**",
      conjStr,
      "- **Stri Jataka & Trimsamsha Disposition (Adhyaya 43):**",
      "  - Lagna Trimsamsha Lord: **" + sv.striJataka.trimsamshaLord + "** (" + sv.striJataka.trimsamshaSign + ")",
      "  - Moral Disposition: " + sv.striJataka.trimsamshaNature,
      "  - Visha Kanya Evaluation: " + (sv.striJataka.vishaKanyaDetected ? (sv.striJataka.vishaKanyaBhanga ? "Formed but Neutralized by Kendra Benefics (Visha Kanya Bhanga)" : "Active (Shiva Shanti Required)") : "None Formed"),
      "- **Top 12 Bhavas Saravali Royal Potency Hierarchy:**",
      topBhavasStr,
      "- **Master Saravali Synthesis:** " + sv.masterSaravaliSynthesis,
    ].join("\n");
  } catch (_) {}

  // 31. Acharya Mantreswara Phaladeepika (28 Adhyayas) Suite
  let phaladeepikaSummary = "";
  try {
    const pd = evaluatePhaladeepika(natalEphemeris);
    const activeViparita = pd.viparitaRajaYogas.filter((v) => v.isFormed);
    const viparitaStr = activeViparita.length > 0
      ? activeViparita.map((v) => `- ⚡ **${v.yogaName} (${v.sanskritName}):** ${v.description} -> *${v.classicalShlokaEffect}*`).join("\n")
      : "- Baseline planetary placements in 6th, 8th, 12th houses (no Viparita Raja Yoga).";

    const neechaStr = pd.neechaBhangaYogas.length > 0
      ? pd.neechaBhangaYogas.map((n) => `- 👑 **Neecha Bhanga (${n.debilitatedPlanet} in ${n.debilitatedSign}):** ${n.rajaYogaGrade} -> ${n.classicalPhala} (Conditions: ${n.cancellationConditionsMet.join("; ")})`).join("\n")
      : "- No debilitated planets in natal chart (all Grahas possess natural strength).";

    const avasthasStr = pd.planetaryAvasthas.map((a) => `${a.planetName}: ${a.avasthaName} (${a.potencyPercentage}%)`).join(", ");

    const topBhavas = [...pd.bhavaMastery].sort((a, b) => b.phaladeepikaScore - a.phaladeepikaScore).slice(0, 4);
    const topBhavasStr = topBhavas.map((b) => `- **House ${b.bhavaNum} (${b.sanskritTitle.split(" ")[0]}):** ${b.phaladeepikaScore}% (${b.masteryGrade}) • Lord: ${b.lordName} in H${b.lordPlacementHouse} -> ${b.classicalPhala}`).join("\n");

    phaladeepikaSummary = [
      "- **Mantreswara Viparita Raja Yogas (विपरीत राजयोग - Shloka 63):**",
      viparitaStr,
      "- **5-Fold Neecha Bhanga Raja Yoga Diagnostics (Shlokas 26-30):**",
      neechaStr,
      "- **9 Classical Planetary Avasthas (Adhyaya 3):** " + avasthasStr,
      "- **Top 12 Bhavas Phaladeepika Mastery Hierarchy:**",
      topBhavasStr,
      "- **Master Phaladeepika Synthesis:** " + pd.masterPhaladeepikaSynthesis,
    ].join("\n");
  } catch (_) {}

  // 32. Prasna Marga (32 Adhyayas) & Prasna Arudha Phala Horary Suite
  let prasnaMargaSummary = "";
  try {
    const pm = evaluatePrasnaMarga(natalEphemeris);
    const sutrasStr = pm.panchaSutras.map((s) => `- **${s.sutraName} (${s.sanskritName.split(" ")[0]}):** ${s.status} -> ${s.diagnosticVerdict}`).join("\n");
    const topVerdicts = pm.bhavaVerdicts.filter((v) => v.successProbability >= 70).slice(0, 4);
    const topVerdictsStr = topVerdicts.length > 0
      ? topVerdicts.map((v) => `- **${v.queryTopic.split(" (")[0]}:** ${v.verdict} (${v.successProbability}%) • Timeline: ${v.timingWindow}`).join("\n")
      : "- General steady effort required across standard queries.";

    prasnaMargaSummary = [
      "- **Tri-Lagna Horary Trinity (आरूढ़, उदय एवं छत्र लग्न):**",
      `  - Udaya Lagna: **${pm.triLagnas.udayaSign}** • Arudha Lagna: **${pm.triLagnas.arudhaSign}** • Chatra Lagna: **${pm.triLagnas.chatraSign}** (Veedhi: ${pm.triLagnas.veedhiRashi})`,
      `  - Alignment: ${pm.triLagnas.relationship}`,
      "- **Pancha Sutras Diagnostics (पञ्च सूत्र निर्णय - Adhyaya 8):**",
      sutrasStr,
      "- **Ashtamangala & Deva/Abhichara Diagnostics:**",
      `  - Ashtamangala Number: **${pm.ashtamangala.ashtamangalaNumber}** (Sanctity Score: ${pm.ashtamangala.auspiciousScore}%)`,
      `  - Deva Dosha (Ancestral Deity): ${pm.ashtamangala.devaDoshaDetected ? "Affliction Present -> " + pm.ashtamangala.devaDoshaDetails : "Clean (Daiva Kripa Active)"}`,
      `  - Abhichara / Shatru Dosha: ${pm.ashtamangala.abhicharaDetected ? "Warning -> " + pm.ashtamangala.abhicharaDetails : "Zero Malice / Aura Protected"}`,
      `  - Deepa Lakshana (Flame): ${pm.ashtamangala.deepaLakshana}`,
      `  - Prescribed Kerala Parihara: ${pm.ashtamangala.keralaParihara}`,
      "- **High-Probability Favorable Query Domains:**",
      topVerdictsStr,
      "- **Master Horary Verdict:** " + pm.masterPrasnaVerdict,
    ].join("\n");
  } catch (_) {}

  // 33. Acharya Sadananda Samhita Skandha (Mundane & Astrometeorology)
  let samhitaSummary = "";
  try {
    const ss = evaluateSamhitaSkandha(natalEphemeris);
    const commoditiesStr = ss.arghaCommodities.map((c) => `- **${c.commodityName}:** ${c.trend} -> ${c.classicalArghaReasoning}`).join("\n");
    const seismicStr = ss.seismicMandalas.map((m) => `- **${m.mandalaName}:** ${m.riskLevel} (${m.geographicVulnerability})`).join("\n");

    samhitaSummary = [
      "- **Planetary Cabinet of the Year (संवत्सराधिपति एवं मन्त्रीमण्डल):**",
      `  - King of the Year (Raja): **${ss.planetaryCabinet.kingPlanet}** -> ${ss.planetaryCabinet.kingEffect}`,
      `  - Prime Minister (Mantri): **${ss.planetaryCabinet.ministerPlanet}** -> ${ss.planetaryCabinet.ministerEffect}`,
      `  - Commander (Senadhipati): **${ss.planetaryCabinet.commanderPlanet}** • Lord of Agriculture (Sasyesha): **${ss.planetaryCabinet.sasyeshaPlanet}**`,
      "- **Astrometeorology & Varsha Monsoon Index (मेघ गर्भाधान एवं वर्षा):**",
      `  - Rainfall Score: **${ss.varshaAstrology.rainfallScore}%** (${ss.varshaAstrology.precipitationGrade})`,
      `  - Cloud Gestation (Megha Garbha): ${ss.varshaAstrology.meghaGarbhaStatus}`,
      `  - Solar Ingress Outlook: ${ss.varshaAstrology.rohiniIngressEffect} • ${ss.varshaAstrology.ardraIngressEffect}`,
      "- **4 Earthly Seismic & Wind Mandalas (भूकमक एवं उत्पात):**",
      seismicStr,
      "- **Argha Krama Commodity Market Trends (धातु एवं धान्य भाव):**",
      commoditiesStr,
      "- **Master Samhita Synthesis:** " + ss.masterSamhitaSynthesis,
    ].join("\n");
  } catch (_) {}

  // 34. Acharya Ramadayalu Sanketanidhi (9 Sanketas) Suite
  let sanketanidhiSummary = "";
  try {
    const sn = evaluateSanketanidhi(natalEphemeris);
    const topVridhiBhavas = sn.bhavaVitality.filter((b) => b.vridhiScore >= 70).slice(0, 4);
    const vridhiStr = topVridhiBhavas.map((b) => `- **${b.sanskritTitle.split(" (")[0]}:** ${b.status} (${b.vridhiScore}%) • Anatomical Zone: ${b.anatomicalZone.split(" (")[0]}`).join("\n");
    const activeShields = sn.arishtaBhangaShields.filter((s) => s.isActive);
    const shieldsStr = activeShields.length > 0
      ? activeShields.map((s) => `- **${s.shieldName} (${s.sanskritName.split(" ")[0]}):** ${s.protectiveEffect}`).join("\n")
      : "- General steady planetary resilience active.";

    sanketanidhiSummary = [
      "- **12 Bhavas Vridhi vs Nashana Potency (भाव वृद्धि एवं भाव नाशन - Sanketas 1-3):**",
      vridhiStr,
      "- **Ayurvedic Medical Tridosha Diagnostics (रोग निदान एवं त्रिदोष - Sanketa 8):**",
      `  - Constitution: **${sn.medicalDiagnostics.dominantDosha}** (Vata: ${sn.medicalDiagnostics.vataPercentage}%, Pitta: ${sn.medicalDiagnostics.pittaPercentage}%, Kapha: ${sn.medicalDiagnostics.kaphaPercentage}%)`,
      `  - Vulnerable Biological Systems: ${sn.medicalDiagnostics.vulnerableOrgans.join(", ")}`,
      `  - Prescribed Ayurvedic Lifestyle & Diet: ${sn.medicalDiagnostics.ayurvedicParihara}`,
      "- **Ayurdaya & Maraka Longevity Diagnostics (आयुर्दाय एवं मारक विचार - Sanketa 6):**",
      `  - Longevity Tier: **${sn.ayurdayaLongevity.longevityTier}** (Vitality Index: ${sn.ayurdayaLongevity.vitalityIndex}%)`,
      `  - Analysis: ${sn.ayurdayaLongevity.longevityAnalysis}`,
      "- **Arishta Bhanga Neutralization Shields (अरिष्ट भङ्ग कवच - Sanketa 9):**",
      shieldsStr,
      "- **Master Sanketanidhi Synthesis:** " + sn.masterSanketanidhiSynthesis,
    ].join("\n");
  } catch (_) {}

  // 35. Acharya Venkatesha Sharma Sarvartha Chintamani (13 Adhyayas)
  let chintamaniSummary = "";
  try {
    const sc = evaluateSarvarthaChintamani(natalEphemeris);
    const topBhavas = sc.bhavaPredictions.filter((b) => b.chintamaniScore >= 70).slice(0, 4);
    const bhavasStr = topBhavas.map((b) => `- **${b.sanskritTitle.split(" (")[0]}:** ${b.fulfillmentGrade} (${b.chintamaniScore}%) -> ${b.primaryPrediction}`).join("\n");
    const activeYogas = sc.specialYogas.filter((y) => y.isFormed);
    const yogasStr = activeYogas.length > 0
      ? activeYogas.map((y) => `- **${y.yogaName} (${y.sanskritName.split(" ")[0]}):** ${y.classicalEffect}`).join("\n")
      : "- General Kendra/Trikona standard potency.";
    const activeAges = sc.bhagyodayaAges.filter((a) => a.isActive).slice(0, 4);
    const agesStr = activeAges.map((a) => `- **Age ${a.ageYear} (${a.triggerPlanet.split(" ")[0]}):** ${a.fortuneManifestation}`).join("\n");

    chintamaniSummary = [
      "- **12 Bhavas Wish-Fulfilling Potency (द्वादश भाव सर्वार्थ निर्णय - Adhyayas 1-12):**",
      bhavasStr,
      "- **Special Classical Yogas of Sarvartha Chintamani (विशिष्ट राजयोग):**",
      yogasStr,
      "- **Bhagyodaya Fortune Rise Age Milestones (भाग्योदय वर्ष - Adhyaya 9):**",
      agesStr,
      "- **Master Sarvartha Chintamani Synthesis:** " + sc.masterChintamaniSynthesis,
    ].join("\n");
  } catch (_) {}

  // 36. Classical Stri Jataka (Female Horoscopy & Trimsamsha)
  let striJatakaSummary = "";
  try {
    const sj = evaluateStriJataka(natalEphemeris);
    striJatakaSummary = [
      `- **Lagna & Moon Disposition (युग्म/अयुग्म):** ${sj.disposition.ascendantSignType} | ${sj.disposition.moonSignType} -> ${sj.disposition.summary}`,
      "- **Trimsamsha D-30 Archetypes (त्रिंशांश विचार):**",
      `  - ${sj.trimsamshaAnalysis.moralDisposition}`,
      `  - ${sj.trimsamshaAnalysis.spiritualInclination}`,
      "- **Mangalya & Soubhagya Sthana (7th, 8th & 9th Bhavas):**",
      `  - Mangalya Score: **${sj.mangalyaSoubhagya.mangalyaScore}%** (${sj.mangalyaSoubhagya.maritalBlissGrade}) • Soubhagya Score: **${sj.mangalyaSoubhagya.soubhagyaScore}%**`,
      `  - Marital Outlook: ${sj.mangalyaSoubhagya.partnerLongevityOutlook}`,
      "- **Visha Kanya & Arishta Bhanga Shield:** " + sj.vishaKanya.cancellationFactor,
      "- **Master Stri Jataka Synthesis:** " + sj.masterStriJatakaSynthesis,
    ].join("\n");
  } catch (_) {}

  // 37. Maharshi Satyacharya Satya Jataka (Dhruva Nadi)
  let satyaJatakaSummary = "";
  try {
    const satya = evaluateSatyaJataka(natalEphemeris);
    const starLordsStr = satya.planetaryStarLords.slice(0, 4).map((s) => `- **${s.planetName} in ${s.nakshatraName} (${s.starLord}):** Manifests House(s) ${s.manifestedBhavas.join(", ")}`).join("\n");
    const subhaLords = satya.functionalDignities.filter((f) => f.dignityType.includes("Subha")).map((f) => `${f.planetName} (${f.role})`).join(", ");
    const favTaras = satya.janmaTaraMatrix.filter((t) => t.isFavorable).slice(0, 4).map((t) => `${t.planetName} in ${t.taraName.split(" (")[0]}`).join(", ");

    satyaJatakaSummary = [
      "- **Satyacharya's Starlord Principle (नक्षत्र स्वामी सिद्धान्त - Dispositor Deliverers):**",
      starLordsStr,
      "- **Functional Dignities of Satyacharya:**",
      `  - Auspicious Trikonadhipatis (1, 5, 9): **${subhaLords || "Balanced"}**`,
      "- **9 Janma Tara Matrix (नवतारा चक्र):**",
      `  - Key Auspicious Taras Active: **${favTaras}**`,
      "- **Master Satya Jataka Synthesis:** " + satya.masterSatyaJatakaSynthesis,
    ].join("\n");
  } catch (_) {}

  // 38. Sugam Jyotish (Practical Predictive Manual & Everyday Remedies)
  let sugamJyotishSummary = "";
  try {
    const sj = evaluateSugamJyotish(natalEphemeris);
    const topBhavas = sj.bhavaDiagnostics.filter((b) => b.practicalScore >= 70).slice(0, 4);
    const bhavasStr = topBhavas.map((b) => `- **${b.sanskritTitle.split(" (")[0]}:** ${b.practicalGrade} (${b.practicalScore}%) -> ${b.practicalOutcome}`).join("\n");
    const yuvaPlanets = sj.baladiAvasthas.filter((a) => a.avasthaName.includes("Yuva")).map((a) => `${a.planetName} (${a.avasthaName})`).join(", ");
    const lagnaKartari = sj.kartariAnalysis[0]?.effectSummary || "Open neutral flanking.";
    const remediesStr = sj.practicalRemedies.slice(0, 3).map((r) => `- **${r.grahaName}:** ${r.easyRemedy} • *Mantra:* ${r.mantra}`).join("\n");

    sugamJyotishSummary = [
      "- **12 Bhavas Practical Diagnostics (द्वादश भाव व्यावहारिक फल):**",
      bhavasStr,
      "- **Baladi Avastha Potency Capacity (ग्रह अवस्था):**",
      `  - Peak 100% Fruition Grahas (Yuva): **${yuvaPlanets || "All Active"}**`,
      "- **Kartari Flanking Status (कर्तरी विचार):**",
      `  - ${lagnaKartari}`,
      "- **Sugam Everyday Accessible Remedies (दैनिक सरल उपाय):**",
      remediesStr,
      "- **Master Sugam Jyotish Synthesis:** " + sj.masterSugamSynthesis,
    ].join("\n");
  } catch (_) {}

  // 39. Uttara Kalamrita (Mahakavi Kalidasa - VRY, Shukra-Shani Paradox & Karakatva)
  let uttaraKalamritaSummary = "";
  try {
    const uk = evaluateUttaraKalamrita(natalEphemeris);
    const activeVrys = uk.viparitaRajaYogas.filter((v) => v.isActive).map((v) => `- **${v.yogaName}:** ${v.potency} (${v.dusthanaLord} in H${v.placedHouse}) -> ${v.effects}`).join("\n");
    const retroGrahas = uk.vakraPotencies.filter((v) => v.isRetrograde).map((v) => `${v.planetName} (Uchcha-Sama)`).join(", ");
    const rahuDispositor = uk.nodeMechanics.find((n) => n.nodeName === "Rahu")?.fruitionPattern || "";

    uttaraKalamritaSummary = [
      "- **Viparita Raja Yogas (विपरीत राजयोग - Harsha, Sarala, Vimala):**",
      activeVrys || "  - No pure Dusthana Lord Viparita Raja Yogas active.",
      "- **Shukra-Shani Mutual Dasha Paradox (शनि-शुक्र परस्पर दशा नियम):**",
      `  - Paradox Classification: **${uk.shukraShaniParadox.paradoxType}**`,
      `  - Fruition Mechanism: ${uk.shukraShaniParadox.mutualDashaEffect}`,
      "- **Rahu & Ketu Shadow Dispositor & Yogakaraka Engine:**",
      `  - ${rahuDispositor}`,
      "- **Vakra Graha Exaltation-Equivalence Potency (वक्र ग्रह बल):**",
      `  - Retrograde Potent Grahas: **${retroGrahas || "None (All Direct)"}**`,
      "- **Master Uttara Kalamrita Synthesis:** " + uk.masterUttaraKalamritaSynthesis,
    ].join("\n");
  } catch (_) {}

  // 40. Vedic Astrology and Predictions (Multi-Tier Event Forecasting & Milestones)
  let vedicPredictionsSummary = "";
  try {
    const vp = evaluateVedicPredictions(natalEphemeris);
    const topMilestones = vp.milestonePredictions.slice(0, 3).map((m) => `- **${m.title} (${m.sanskritTitle}):** ${m.probabilityTier} (${m.probabilityScore}%) • *Horizon:* ${m.timeHorizon} -> ${m.predictiveVerdict}`).join("\n");
    const horizonsStr = `Immediate: ${vp.activeTimeHorizons.immediateCount} | Near-Term: ${vp.activeTimeHorizons.nearTermCount} | Long-Term: ${vp.activeTimeHorizons.longTermCount}`;

    vedicPredictionsSummary = [
      "- **6 Life Milestones Probability Forecaster (त्रिसूत्रीय फल सम्भावना):**",
      topMilestones,
      "- **Predictive Potency & Timing Horizons:**",
      `  - Overall Potency: **${vp.overallPredictivePotency}%** | Event Horizons: **${horizonsStr}**`,
      "- **Master Vedic Predictions Synthesis:** " + vp.masterPredictionsSynthesis,
    ].join("\n");
  } catch (_) {}

  // 41. Jataka Chandrika (Laghu Parashari - Prof. B. Suryanarain Rao)
  let jatakaChandrikaSummary = "";
  try {
    const jc = evaluateJatakaChandrika(natalEphemeris);
    const rolesStr = jc.grahaRoles.map((r) => `- **${r.grahaName}:** ${r.functionalNature} (H${r.housesOwned.join(",")}) -> ${r.classicalReasoning}`).join("\n");
    const ryStr = jc.sambandhas.filter((s) => s.isRajaYoga).map((s) => `- **${s.planetA}-${s.planetB} (${s.sambandhaType.split(" (")[0]}):** ${s.fruitionDescription}`).join("\n");

    jatakaChandrikaSummary = [
      `- **Ascendant Functional Disposition (${jc.ascendantSign} Lagna):**`,
      `  - Premier Yogakaraka: **${jc.yogakarakas.join(", ") || "None"}** | Benefics: **${jc.benefics.join(", ") || "None"}**`,
      `  - Trishadaya Malefics: **${jc.malefics.join(", ")}** | Marakas: **${jc.marakas.join(", ")}**`,
      `  - Kendradhipati Dosha: **${jc.kendradhipatiDoshaGrahas.join(", ") || "None"}**`,
      "- **Planetary Roles & Classical Reasoning:**",
      rolesStr,
      "- **4-Fold Sambandha Raja Yogas:**",
      ryStr || "  - No classical Kendra-Trikona Sambandha Raja Yogas active.",
      "- **Master Jataka Chandrika Synthesis:** " + jc.masterChandrikaSynthesis,
    ].join("\n");
  } catch (_) {}

  // 42. Chappanna Prasna Sastra (56 Questions Horary Oracle - Prof. B. Suryanarain Rao)
  let chappannaPrasnaSummary = "";
  try {
    const cp = evaluateChappannaPrasna(natalEphemeris, 1);
    const sampleQueries = [1, 8, 15, 22, 29, 36, 43, 50].map((id) => {
      const q = cp.allQuestions.find((item) => item.id === id);
      return q ? `- **[Q${q.id} - ${q.category}] ${q.questionTitle}:** ${q.outcomeStatus} (${q.successProbability}%) • *Timing:* ${q.timingOfFruition}` : "";
    }).filter(Boolean).join("\n");

    chappannaPrasnaSummary = [
      `- **Prasna Lagna & Moon Disposition:** Lagna **${cp.lagnaSign}** (${cp.lagnaLord}), Moon in **${cp.moonSign}** (${cp.moonLord})`,
      "- **Sample Representative Horary Judgements (from 56 Archetypes):**",
      sampleQueries,
      "- **Master Chappanna Prasna Synthesis:** " + cp.masterPrasnaSynthesis,
    ].join("\n");
  } catch (_) {}

  // 43. Maharshi Bhrigu Samhita (Karmic Debts, Past Life Sins & Pariharas)
  let bhriguSamhitaSummary = "";
  try {
    const bs = evaluateBhriguSamhita(natalEphemeris);
    const debtsStr = bs.karmicDebts.map(
      (d) => `  - **${d.debtName}:** Status: **${d.severity}** (Afflicting: ${d.afflictingPlanets.join(", ") || "None"})\n    - *Karmic Root:* ${d.karmicReason}\n    - *Manifestation:* ${d.symptomsInCurrentLife}\n    - *Bhrigu Parihara:* ${d.bhriguSamhitaRemedy}`
    ).join("\n");

    bhriguSamhitaSummary = [
      `- **Dominant Past-Life Karmic Theme:** ${bs.dominantPastLifeTheme}`,
      "- **6 Past-Life Karmic Debts (Purva Janma Rinas) & Specific Scriptural Remedies:**",
      debtsStr,
      "- **Master Bhrigu Samhita Synthesis:** " + bs.masterSamhitaSynthesis,
    ].join("\n");
  } catch (_) {}

  // 44. Sri Ramanujacharya Bhavartha Ratnakara (Dr. B.V. Raman)
  let bhavarthaRatnakaraSummary = "";
  try {
    const br = evaluateBhavarthaRatnakara(natalEphemeris);
    const activeYogasStr = [...br.activeYogas, ...br.dhanaYogas, ...br.dashaExceptions]
      .map((y) => `  - **${y.yogaName}** (Adhyaya ${y.adhyayaNumber}, ${y.fruitionStrength}): ${y.classicalSlokaSummary} -> ${y.drBvRamanCommentary}`)
      .join("\n");

    bhavarthaRatnakaraSummary = [
      `- **Ascendant Disposition (${br.ascendantSign} Lagna):** Premier Yogakaraka: **${br.premierRatnakaraYogakaraka}**`,
      "- **Active Bhavartha Ratnakara Yogas & Dasha Exceptions:**",
      activeYogasStr || "  - Standard Parashari principles apply.",
      "- **Master Ratnakara Synthesis:** " + br.masterRatnakaraSynthesis,
    ].join("\n");
  } catch (_) {}

  // 47. Jaimini Master Suite (Iranganti Rangacharya & Arudha Exceptions)
  let jaiminiRangacharyaSummary = "";
  try {
    const jr = evaluateJaiminiRangacharya(natalEphemeris);
    const padasStr = jr.varnadaPadas.slice(0, 6).map((p) => `  - **${p.name}:** Sign: ${p.signName} (${p.vitalityImpact})`).join("\n");
    const arudhaExcStr = jr.arudhaPadasWithExceptions.filter((a) => a.isExceptionApplied).map((a) => `  - **${a.code} (${a.houseName}):** Sign: ${a.signName} -> *${a.exceptionRuleNote}*`).join("\n");

    jaiminiRangacharyaSummary = [
      `- **Varnada Lagna (VL):** ${jr.varnadaLagnaSign} (Determining societal status, endurance & bodily vitality)`,
      `- **Brahma, Rudra & Maheshwara:** ${jr.brahmaRudra.longevityAssessment}`,
      "- **Key Varnada Padas (V1 to V6):**",
      padasStr,
      "- **Arudha Pada Exception Adjustments (BPHS & Jaimini Canon):**",
      arudhaExcStr || "  - Standard 12 Arudha projections apply.",
      "- **Active Arudha Raja & Dhana Yogas:** " + (jr.arudhaRajaYogas.join(" | ") || "None active in standard alignment."),
      "- **Master Jaimini Synthesis:** " + jr.masterRangacharyaSynthesis,
    ].join("\n");
  } catch (_) {}

  // 48. Crux of Vedic Astrology (Pt. Sanjay Rath) & Parashari Conditional Dashas
  let cruxOfAstrologySummary = "";
  try {
    const ca = evaluateCruxOfAstrology(natalEphemeris);
    const condDashaStr = ca.conditionalDashas.map((cd) => `  - **${cd.dashaName}:** ${cd.isEligible ? "✅ ACTIVE" : "❌ INACTIVE"} (${cd.eligibilityReason})`).join("\n");

    cruxOfAstrologySummary = [
      `- **Active Narayana Dasha Sign:** ${ca.activeNarayanaSign} (Direct Rashi Dasha of BPHS & Pt. Sanjay Rath)`,
      "- **Parashari Conditional Nakshatra Dashas Eligibility:**",
      condDashaStr,
      "- **Tithi Pravesha Annual Chart Principles:** " + ca.tithiPraveshaOverview,
      "- **Master Crux Synthesis:** " + ca.masterCruxSynthesis,
    ].join("\n");
  } catch (_) {}

  // 49. Kalamsa & Cuspal Interlinks Theory (KCIL — S.P. Khullar)
  let cuspalInterlinksSummary = "";
  try {
    const kcil = evaluateCuspalInterlinks(natalEphemeris);
    const cuspsStr = kcil.cuspalData.slice(0, 6).map((c) => `  - **Cusp ${c.cuspNum} (${c.signName}):** RL: ${c.signLord} | NL: ${c.starLord} | SL: ${c.subLord} | SSL: **${c.subSubLord}** (PS: ${c.positionalStatus ? "Yes" : "No"}) -> *Links: [${c.linkedHouses.join(", ")}]*`).join("\n");
    const promisesStr = kcil.domainPromises.map((dp) => `  - **${dp.domain}:** ${dp.promiseVerdict} (${dp.kcilAnalysis})`).join("\n");

    cuspalInterlinksSummary = [
      `- **Lagna SSL (Kalamsa):** ${kcil.btrDiagnostic.lagnaSsl} (BTR Status: ${kcil.btrDiagnostic.isBtrAligned ? "Aligned" : "Fine-tune"})`,
      "- **Core Cuspal Hierarchy (C1 to C6):**",
      cuspsStr,
      "- **KCIL Life Domain Promises:**",
      promisesStr,
      "- **Master KCIL Synthesis:** " + kcil.masterKcilSynthesis,
    ].join("\n");
  } catch (_) {}

  // 51. Meena Nadi (Jeeva & Sareera Stellar Theory)
  let meenaNadiSummary = "";
  try {
    const mn = evaluateMeenaNadi(natalEphemeris);
    const planetsStr = Object.values(mn.planets).slice(0, 7).map((p) => `  - **${p.planetName}:** Jeeva: ${p.jeevaPlanet} (H${p.jeevaHouse}) | Sareera: ${p.sareeraPlanet} (H${p.sareeraHouse}) -> **${p.vitalityGrade}** (${p.fruitOutcome})`).join("\n");
    const domainsStr = mn.domainPromises.map((d) => `  - **${d.domain}:** ${d.promiseGrade} (${d.nadiGuidance})`).join("\n");
    meenaNadiSummary = [
      "- **Planetary Jeeva-Sareera Status:**",
      planetsStr,
      "- **6 Life Domain Promises:**",
      domainsStr,
      "- **Master Meena Synthesis:** " + mn.masterMeenaSynthesis,
    ].join("\n");
  } catch (_) {}

  // 52. Mahadeva's Jataka Tattvam (5 Sutra Vivekas)
  let jatakaTattvamSummary = "";
  try {
    const jt = evaluateJatakaTattvam(natalEphemeris);
    const activeSutrasStr = jt.activeSutras.filter((s) => s.isActivated).slice(0, 5).map((s) => `  - **${s.id} (${s.viveka}):** *"${s.sanskritSutra}"* -> ${s.englishTranslation}`).join("\n");
    const bhavaScoresStr = jt.bhavaScores.slice(0, 6).map((b) => `H${b.bhavaNumber} (${b.bhavaName}): ${b.compositeHealth}%`).join(", ");
    jatakaTattvamSummary = [
      "- **Bhava Composite Health Index:** " + bhavaScoresStr,
      "- **Activated Classical Sutras:**",
      activeSutrasStr,
      "- **Prakirna Raja/Dhana Yogas:** " + (jt.prakirnaRajaYogas.join(" | ") || "Standard"),
      "- **Master Jataka Tattvam Synthesis:** " + jt.masterJatakaTattvamSynthesis,
    ].join("\n");
  } catch (_) {}

  // 53. D-12 Padma Chakra & Dwadasamsa Nadi
  let padmaChakraSummary = "";
  try {
    const pc = evaluatePadmaChakra(natalEphemeris);
    const petalsStr = pc.petals.slice(0, 6).map((p) => `  - **Petal ${p.petalNumber} (${p.solarAditya}):** ${p.ancestralKarmicType} (${p.lifeBlessing})`).join("\n");
    padmaChakraSummary = [
      `- **Ancestral Grace Index:** **${pc.ancestralBlessingScore}%**`,
      `- **Ascendant Lotus Anchor:** ${pc.lagnaPetalAditya}`,
      `- **Paternal Lineage (Sun D12):** ${pc.sunFatherLineagePetal} | **Maternal Lineage (Moon D12):** ${pc.moonMotherLineagePetal}`,
      "- **Key Petals & Lineage Blessings:**",
      petalsStr,
      "- **Master Padma Chakra Synthesis:** " + pc.masterPadmaChakraSynthesis,
    ].join("\n");
  } catch (_) {}

  // 54. D-60 Shashtiamsha 60 Deities & Bhrigu Chakra Paddhati (BCP)
  let shashtiamshaBcpSummary = "";
  try {
    const d60 = evaluateShashtiamsha(natalEphemeris);
    const nativeAge = Math.max(1, evaluationDate.getFullYear() - birthDate.getFullYear());
    const bcp = evaluateBcpWheel(natalEphemeris, nativeAge);
    const planetsD60Str = Object.values(d60.planets).slice(0, 7).map((p) => `  - **${p.planetName}:** D60 ${p.d60SignName} (${p.d60Degree}°) • #${p.shashtiamshaNumber} **${p.deityName}** [${p.deityCategory}] -> ${p.sanchitaKarmaSignification}`).join("\n");
    const ghoraWarnings = d60.ghoraDeityRemedialWarnings.length > 0 ? d60.ghoraDeityRemedialWarnings.map((w) => `  - ⚠️ ${w}`).join("\n") : "  - No severe Ghora Shashtiamsha afflictions.";

    shashtiamshaBcpSummary = [
      `- **D-60 Sanchita Karma Score:** **${d60.sanchitaKarmaScore}%** (${d60.dominantKarmicOrientation})`,
      `- **Ascendant (Lagna) D-60 Anchor:** #${d60.lagnaResult.shashtiamshaNumber} **${d60.lagnaResult.deityName}** [${d60.lagnaResult.deityCategory}] -> *${d60.lagnaResult.sanchitaKarmaSignification}*`,
      "- **Key Planets Shashtiamsha Deities & Past-Life Root:**",
      planetsD60Str,
      "- **Ghora Deity Remedial Directives:**",
      ghoraWarnings,
      `- **Bhrigu Chakra Paddhati (BCP) Age ${nativeAge} Activation:** **House ${bcp.currentActiveCycle.activeHouseNum} (${bcp.currentActiveCycle.houseSignName})** [${bcp.currentActiveCycle.activationGrade}] -> *${bcp.currentActiveCycle.primaryKarmicTrigger}*`,
      "- **Master D60 & BCP Synthesis:** " + d60.masterShashtiamshaSynthesis + " " + bcp.masterBcpSynthesis,
    ].join("\n");
  } catch (_) {}

  // 55. Maharshi Patanjali Yoga Sutras & Astrological Chakra Sadhana
  let patanjaliYogaSummary = "";
  try {
    const py = evaluatePatanjaliYoga(natalEphemeris);
    const chakrasStr = py.chakras.map((c) => `  - **${c.chakraNumber}. ${c.sanskritName} (${c.englishName}):** ${c.balanceScore}% (${c.status.split(" ")[0]}) | Grahas: ${c.rulingGrahas.join(", ")} | Asana: ${c.recommendedAsana} | Pranayama: ${c.recommendedPranayama} | Bija: ${c.bijaMantra}`).join("\n");
    const limbsStr = py.ashtangaLimbs.slice(0, 4).map((l) => `  - **Limb ${l.limbNumber} (${l.limbName.split(" ")[0]}):** ${l.planetaryAlignment} -> ${l.dailyPracticeProtocol}`).join("\n");

    patanjaliYogaSummary = [
      `- **Overall Chakra Harmony Index:** **${py.overallChakraHarmonyScore}%**`,
      `- **Chitta Vritti Mental Orientation:** **${py.chittaVrittiState}**`,
      `- **Kaivalya Spiritual Readiness:** ${py.kaivalyaLiberationReadiness}`,
      "- **7 Chakra-Graha Energetic Matrix:**",
      chakrasStr,
      "- **Core Ashtanga Sadhana Directives:**",
      limbsStr,
      "- **Master Patanjali Synthesis:** " + py.masterPatanjaliSynthesis,
    ].join("\n");
  } catch (_) {}

  // 56. Classical Kota Chakra & Dasha-Lord Transit Defense
  let kotaChakraSummary = "";
  try {
    const kc = evaluateKotaChakra(natalEphemeris);
    const dlt = evaluateDashaLordTransit(natalEphemeris);
    const occupiedSegments = kc.segments.filter((s) => s.occupyingPlanets.length > 0).map((s) => `  - **${s.zone.split(" ")[0]} (${s.nakshatraName} #${s.nakshatraNumber28}):** ${s.occupyingPlanets.join(", ")} [${s.segmentVulnerabilityGrade}]`).join("\n");
    const mdTransitsStr = dlt.transitsFromMahaDasha.map((t) => `${t.planetName} in H${t.houseFromDasha}`).join(" | ");

    kotaChakraSummary = [
      `- **Fort Defense Integrity:** **${kc.fortDefenseScore}%** (${kc.isKotaBhangaActive ? "⚠️ Active Kota Bhanga / Siege Alert" : "🛡️ Impregnable Fortification"})`,
      `- **Kota Swami (Lord of Fort):** ${kc.kotaSwamiPlanet} in ${kc.kotaSwamiZone.split(" ")[0]}`,
      `- **Kota Pala (Guardian of Gates):** ${kc.kotaPalaPlanet} in ${kc.kotaPalaZone.split(" ")[0]}`,
      "- **Planetary Deployment Across 4 Concentric Zones:**",
      occupiedSegments || "  - No major planetary clustering.",
      "- **Dasha-Lord Transit Alignment:** " + mdTransitsStr,
      "- **Master Kota Synthesis:** " + kc.masterKotaSynthesis + " " + dlt.masterDashaTransitSynthesis,
    ].join("\n");
  } catch (_) {}

  // 57. Dr. B.V. Raman 300 Important Combinations, Lal Kitab & Narayana Kavacham
  let raman300Summary = "";
  try {
    const r300 = evaluateRaman300Combinations(natalEphemeris);
    const lk = evaluateLalKitabTeva(natalEphemeris);
    const nk = evaluateNarayanaKavacham(natalEphemeris);
    const yogasStr = r300.activeYogas.slice(0, 5).map((y) => `  - **Yoga #${y.combinationNumber} (${y.yogaName} - ${y.sanskritTitle}):** [${y.category}] -> ${y.lifeFruition}`).join("\n");
    const lkRemediesStr = lk.targetedLalKitabRemedies.slice(0, 2).join(" | ");

    raman300Summary = [
      `- **Active Classical Combinations Count:** **${r300.totalActiveCount} Yogas** (Premier: **${r300.premierYoga.yogaName}**)`,
      `- **Raja Yoga Index:** **${r300.rajaYogaScore}%** | **Dhana Yoga Index:** **${r300.dhanaYogaScore}%**`,
      `- **Lal Kitab Chart Archetype:** **${lk.tevaType}** (${lk.tevaSignification})`,
      "- **Key Activated Classical Combinations:**",
      yogasStr,
      "- **Lal Kitab Targeted Pariharas:** " + lkRemediesStr,
      `- **Sri Narayana Kavacham Supreme Shield:** ${nk.supremeProtectorForm}`,
      "- **Master Raman & Lal Kitab Synthesis:** " + r300.masterRamanSynthesis + " " + lk.masterLalKitabSynthesis,
    ].join("\n");
  } catch (_) {}

  // 58. Empirical Benchmark Horoscopes & Archetypal Karmic Resonance
  let benchmarkSummary = "";
  try {
    const bm = evaluateBenchmarkResonance(natalEphemeris);
    const archetypesStr = bm.archetypes.map((a) => `  - **${a.category}:** **${a.resonancePercentage}% Affinity** (Closest Titans: ${a.closestTitanMatch}) -> ${a.karmicTakeaway}`).join("\n");

    benchmarkSummary = [
      `- **Primary Dominant Archetype:** **${bm.topArchetype.category}** (**${bm.topArchetype.resonancePercentage}% Resonance**)`,
      `- **Closest Historical Titan Match:** **${bm.topTitanMatch.name}** (${bm.topTitanMatch.destinyMilestone})`,
      "- **Archetypal Affinity Across 5 Life Spheres:**",
      archetypesStr,
      "- **Master Benchmark Synthesis:** " + bm.masterBenchmarkSynthesis,
    ].join("\n");
  } catch (_) {}

  // 59. Sri Neelakanta Prasna Tantra 16 Tajik Yogas, 12 Sahams & Margabandhu Shield
  let prasnaTantraSummary = "";
  try {
    const pt = evaluatePrasnaTantra(natalEphemeris);
    const mb = evaluateMargabandhuStotram(natalEphemeris);
    const sahamsStr = pt.sahams.slice(0, 6).map((s) => `  - **${s.sahamName.split(" ")[0]} Saham (${s.sanskritTitle}):** ${s.signName} ${s.degreesInSign}° (H${s.houseNumber}) -> ${s.significance}`).join("\n");
    const activeYogasStr = pt.activeYogas.map((y) => `  - **${y.yogaName} (${y.sanskritTitle}):** [${y.aspectType}] -> ${y.horaryFruitionVerdict}`).join("\n");

    prasnaTantraSummary = [
      `- **Query Success Potency:** **${pt.querySuccessScore}%** (${pt.primaryIthasalaStatus})`,
      "- **Active Classical Tajik Yogas:**",
      activeYogasStr || "  - Operating via secondary aspects.",
      "- **Key 6 Classical Tajik Sahams (Sensitive Points):**",
      sahamsStr,
      `- **Sri Margabandhu Journey Shield:** Active (${mb.shieldActivationScore}% Strength) -> Protective Kavacham for all travels and transitions.`,
      "- **Master Prasna Verdict:** " + pt.masterPrasnaVerdict + " " + mb.masterMargabandhuSynthesis,
    ].join("\n");
  } catch (_) {}

  // 60. C.S. Patel & Aiyar Ashtakavarga Shodhana, Shodhya Pinda & 8 Kakshyas
  let patelAshtakavargaSummary = "";
  try {
    const pa = evaluatePatelAshtakavarga(natalEphemeris);
    const pindasStr = pa.shodhyaPindas.map((p) => `  - **${p.planetName}:** **${p.shodhyaPinda} Shodhya Pinda** (Rashi: ${p.rashiPinda}, Graha: ${p.grahaPinda}) -> ~${p.longevityAyurContributionYears} Ayur Units`).join("\n");
    const activeKakshya = pa.kakshyas.find((k) => k.currentTransitingPlanets.length > 0) || pa.kakshyas[0];

    patelAshtakavargaSummary = [
      `- **Total Sarvashtaka Shodhya Pinda:** **${pa.sarvashtakaShodhyaPindaTotal} Points**`,
      `- **Active Transit Kakshya:** Kakshya #${activeKakshya.kakshyaNumber} (${activeKakshya.governingLord} — ${activeKakshya.degreeSpan})`,
      "- **7 Planetary Shodhya Pindas (Post Trikona & Ekadhipatya Shodhana):**",
      pindasStr,
      "- **Master Patel Synthesis:** " + pa.masterPatelSynthesis,
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
        "- **Classical Ashtakavarga Synastry (C.S. Patel & Parashara):**",
        "  - Overall Ashtakavarga Compatibility: **" + matchRes.ashtakavargaCompatibility.verdict + " (" + matchRes.ashtakavargaCompatibility.ashtakavargaScore + "% Harmony)**",
        "  - Groom Lagna in Bride SAV: **" + matchRes.ashtakavargaCompatibility.boyLagnaSAVInGirlChart + " Bindus** • Bride Lagna in Groom SAV: **" + matchRes.ashtakavargaCompatibility.girlLagnaSAVInBoyChart + " Bindus**",
        "  - Groom Moon BAV in Bride: **" + matchRes.ashtakavargaCompatibility.boyMoonBAVInGirl + "/8** • Bride Moon BAV in Groom: **" + matchRes.ashtakavargaCompatibility.girlMoonBAVInBoy + "/8**",
        "  - 7th House SAV Strength: Groom **" + matchRes.ashtakavargaCompatibility.boy7thHouseSAV + " Bindus** • Bride **" + matchRes.ashtakavargaCompatibility.girl7thHouseSAV + " Bindus**",
        "  - Key Principles: " + matchRes.ashtakavargaCompatibility.principles.join(" | "),
        "- **Cross-Kundli Synastry:**",
        "  - Lagna-to-Lagna Axis: **" + lagnaAxisName + "**",
        "  - Moon-to-Moon Axis: **" + moonAxisName + "**",
        "- **Classical Shastric Verdict:** " + matchRes.verdictDescription,
      ].join("\n");
    } catch (_) {}
  }

  // Real-Time Live Panchanga & Muhurta for Active Consultation Location (e.g. Rome)
  let livePanchangaSummary = "";
  try {
    const transitLoc = transitEphemeris.location || location;
    const transitTzOffset = transitLoc.timezoneOffsetHours ?? 0;
    const transitTzSign = transitTzOffset >= 0 ? "+" : "-";
    const transitTzAbsH = Math.floor(Math.abs(transitTzOffset));
    const transitTzAbsM = Math.round((Math.abs(transitTzOffset) - transitTzAbsH) * 60);
    const transitTzFormatted = `UTC${transitTzSign}${String(transitTzAbsH).padStart(2, "0")}:${String(transitTzAbsM).padStart(2, "0")}`;

    const muhurta = calculateDayMuhurta(evaluationDate, transitLoc);
    const abhijit = muhurta.auspiciousSlots.find((s) => s.type === "Abhijit");
    const rahu = muhurta.inauspiciousSlots.find((s) => s.type === "RahuKaal");
    const gulika = muhurta.inauspiciousSlots.find((s) => s.type === "GulikaKaal");
    const yamaganda = muhurta.inauspiciousSlots.find((s) => s.type === "Yamaganda");

    const formatTime = (d: Date) => {
      const localD = new Date(d.getTime() + transitTzOffset * 3600 * 1000);
      const hh = String(localD.getUTCHours()).padStart(2, "0");
      const mm = String(localD.getUTCMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    };

    const transitMoon = transitEphemeris.planets.Moon;
    const transitSun = transitEphemeris.planets.Sun;

    livePanchangaSummary = [
      "- 📍 **Active Consultation / Current Transit Location:** **" + transitLoc.cityName + (transitLoc.country ? ", " + transitLoc.country : "") + "** (Lat: " + transitLoc.latitude.toFixed(2) + "°, Lon: " + transitLoc.longitude.toFixed(2) + "°, Timezone: " + transitTzFormatted + ")",
      "- 📅 **Current Real-Time Date & Time (Local City Time):** " + evaluationDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) + " at " + formatTime(evaluationDate) + " (" + transitTzFormatted + ")",
      "- 🌖 **Today's Live Tithi:** **" + transitEphemeris.panchanga.tithi.name + " (" + transitEphemeris.panchanga.tithi.paksha + " Paksha)**" + (transitEphemeris.panchanga.tithi.endTime ? " • Ends at: " + transitEphemeris.panchanga.tithi.endTime + (transitEphemeris.panchanga.tithi.remainingFormatted ? " (" + transitEphemeris.panchanga.tithi.remainingFormatted + " remaining)" : "") : ""),
      "- ⭐ **Today's Live Nakshatra:** **" + transitEphemeris.panchanga.nakshatra.sanskritName + " (Pada " + transitEphemeris.panchanga.nakshatra.pada + ")** • Lord: **" + transitEphemeris.panchanga.nakshatra.lord + "** • Deity: " + transitEphemeris.panchanga.nakshatra.deity + (transitEphemeris.panchanga.nakshatra.endTime ? " • Ends at: " + transitEphemeris.panchanga.nakshatra.endTime : ""),
      "- 🌅 **Today's Live Vara (Day):** **" + transitEphemeris.panchanga.vara.name + "** (Day Lord: **" + transitEphemeris.panchanga.vara.lord + "**)",
      "- 🧘 **Today's Live Yoga:** **" + transitEphemeris.panchanga.yoga.name + "** | **Karana:** **" + transitEphemeris.panchanga.karana.name + "**",
      "- 🌞 **Sunrise & Sunset at " + transitLoc.cityName + ":** Sunrise: **" + formatTime(muhurta.sunrise) + "** | Sunset: **" + formatTime(muhurta.sunset) + "**",
      "- 👑 **Abhijit Muhurta (Most Auspicious Window Today):** " + (abhijit ? "**" + formatTime(abhijit.startTime) + " – " + formatTime(abhijit.endTime) + "**" : "N/A"),
      "- ⚠️ **Rahu Kalam (Inauspicious Window to Avoid Today):** " + (rahu ? "**" + formatTime(rahu.startTime) + " – " + formatTime(rahu.endTime) + "**" : "N/A"),
      "- ⏱️ **Yamaganda:** " + (yamaganda ? formatTime(yamaganda.startTime) + " – " + formatTime(yamaganda.endTime) : "N/A") + " | **Gulika Kalam:** " + (gulika ? formatTime(gulika.startTime) + " – " + formatTime(gulika.endTime) : "N/A"),
      "- 🌙 **Current Live Moon Transit (Chandra Gochar):** In **" + (transitMoon?.rashi.englishName || "") + "** (" + (((transitMoon?.siderealLongitude || 0) % 30).toFixed(2)) + "°) | Nakshatra: **" + (transitMoon?.nakshatra.sanskritName || "") + "**",
      "- ☀️ **Current Live Sun Transit (Surya Gochar):** In **" + (transitSun?.rashi.englishName || "") + "** (" + (((transitSun?.siderealLongitude || 0) % 30).toFixed(2)) + "°)",
    ].join("\n");
  } catch (_) {}

  const decisionGates = calculatePredictiveDecisionGates(natalEphemeris);

  // 61. Job vs Business & D-10 Dasamsa Career Phala (15 Classical Rules)
  let careerDossierSummary = "";
  try {
    const careerAnalysis = analyzeCareerJobBusiness(natalEphemeris);
    careerDossierSummary = [
      `- **Primary Career Recommendation:** **${careerAnalysis.primaryRecommendation}**`,
      `- **Chart Hemisphere Distribution:** ${careerAnalysis.leftCount} Left (Houses 10-3) vs ${careerAnalysis.rightCount} Right (Houses 4-9) • Dominance: **${careerAnalysis.hemisphereDominance}**`,
      `  - *Hemisphere Synthesis:* ${careerAnalysis.hemisphereSynthesis}`,
      `- **6th House (Service/Job) vs 7th House (Trade/Business):** **${careerAnalysis.verdict6vs7}**`,
      `  - 6th House Lord: ${careerAnalysis.house6Strength} | 7th House Lord: ${careerAnalysis.house7Strength}`,
      `- **D-10 Dasamsa In-Depth Diagnostics:**`,
      `  - D-10 Lagna: **${careerAnalysis.d10LagnaSign}** (Lord: **${careerAnalysis.d10LagnaLord}** - governs career mindset & purpose)`,
      `  - D-1 10th Lord in D-10: **${careerAnalysis.d110thLordInD10}** placed in **House ${careerAnalysis.d110thLordD10House} of D-10** (${careerAnalysis.d110thLordD10Dignity})`,
      `  - D-10 Lagna Benefic Aspects: ${careerAnalysis.d10AspectOnLagna.length > 0 ? careerAnalysis.d10AspectOnLagna.join(", ") : "Neutral foundation"}`,
      `  - D-10 10th House Occupants: ${careerAnalysis.d10TenthHouseOccupants.length > 0 ? careerAnalysis.d10TenthHouseOccupants.join(", ") : "None (D-10 10th lord active)"}`,
      `- **Sun & Royal Authority Formations:**`,
      `  - Sun in Upachaya (3, 6, 10, 11) with Jupiter Aspect: ${careerAnalysis.sunUpachayaWithJupiterAspect ? "YES (Eminence, public recognition & royal favor)" : "Standard"}`,
      `  - Sun in Angles (Kendras 1, 4, 7, 10): ${careerAnalysis.sunInKendras ? "YES (High status, administrative authority, visionary leadership)" : "Non-kendra"}`,
      `- **Key Professional Combinations:**`,
      `  - 10th Lord in 3rd House: ${careerAnalysis.lord10In3rd ? "YES (Favorable for entrepreneurship, media, self-initiative & business)" : "No"}`,
      `  - 3rd Lord conjunct 10th Lord: ${careerAnalysis.lord3WithLord10 ? "YES (Commission-based business, agency, creative enterprise)" : "No"}`,
      `  - 10th Lord in 6th House: ${careerAnalysis.lord10In6th ? "YES (Service industry, competitive corporate roles, legal/medical/consulting)" : "No"}`,
      `  - 10th Lord in 12th House: ${careerAnalysis.lord10In12th ? "YES (MNC, foreign trade, overseas employment, remote tech)" : "No"}`,
      `  - 10th Lord in 2nd House: ${careerAnalysis.lord10In2nd ? "YES (Dynamic wealth generation through active professional trade)" : "No"}`,
      `  - 1st Lord in 6th House: ${careerAnalysis.lord1In6th ? "YES (Overcomes competition; can do job + business hybrid side-hustle)" : "No"}`,
      `- **Saturn & Moon Capacity:** ${careerAnalysis.saturnDignityAndPlacement} | ${careerAnalysis.moonStrengthNote}`,
      `- **Promotion & Acceleration Timing:** ${careerAnalysis.promotionsAndTimingNote}`,
      `- **Executive Verdict:** ${careerAnalysis.executiveSummary}`,
    ].join("\n");
  } catch (_) {}

  const lines = [
    "### NATIVE'S COMPREHENSIVE VEDIC ASTROLOGICAL DOSSIER (B.V. RAMAN & PARASHARI STANDARD):",
    "- **Current Real-Time Consultation Date:** " + evaluationDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) + " (Year: " + evaluationDate.getFullYear() + ")",
    "- **Active Consultation / Current Transit Location:** " + (transitEphemeris.location?.cityName || location.cityName) + ((transitEphemeris.location?.country || location.country) ? ", " + (transitEphemeris.location?.country || location.country) : "") + " (Lat: " + (transitEphemeris.location?.latitude || location.latitude).toFixed(2) + "°, Lon: " + (transitEphemeris.location?.longitude || location.longitude).toFixed(2) + "°)",
    "- **Date & Time of Birth (Local Civil Time / जन्म समय):** " + localBirthStr,
    "- **Astronomical Calculation Epoch (UTC):** " + birthDate.toUTCString(),
    "- **Birth Location:** " + location.cityName + (location.country ? ", " + location.country : "") + " (Lat: " + location.latitude.toFixed(2) + "°, Lon: " + location.longitude.toFixed(2) + "°)",
    "- **Ayanamsha Model:** " + natalEphemeris.ayanamshaType + " (" + natalEphemeris.ayanamshaValue.toFixed(3) + "°)",
    "",
    "#### 🎯 0. EXECUTIVE PRE-COMPUTED PREDICTIVE DECISION GATES (VERIFIED MATHEMATICAL TRUTHS):",
    "- 💼 **CAREER & WEALTH GATE:**",
    "  - 10th House: " + decisionGates.careerGate.tenthHouseSign + " | 10th Lord: " + decisionGates.careerGate.tenthLord + " in House " + decisionGates.careerGate.tenthLordHouse + " (" + decisionGates.careerGate.tenthLordDignity + ") | Occupants: " + (decisionGates.careerGate.tenthHouseOccupants.join(", ") || "None"),
    "  - Amatyakaraka (AmK): " + decisionGates.careerGate.amatyakaraka.planet + " in " + decisionGates.careerGate.amatyakaraka.rashi + " (House " + decisionGates.careerGate.amatyakaraka.house + ", " + decisionGates.careerGate.amatyakaraka.dignity + ")",
    "  - D10 Dashamsha 10th Lord: " + decisionGates.careerGate.d10TenthLord + " in " + decisionGates.careerGate.d10TenthLordRashi,
    "  - Double Transit Active on 10th/10th Lord: " + (decisionGates.careerGate.isDoubleTransitOn10th || decisionGates.careerGate.isDoubleTransitOn10thLord ? "YES (Active Catalyst)" : "NO (Standard)"),
    "  - Rajya Prapti / Dhana Potential: " + (decisionGates.careerGate.hasRajyaPraptiYoga ? "Strong Rajya Prapti Yoga Present" : "Standard Growth") + " | Active Dhana Houses: " + decisionGates.careerGate.activeDhanaHouses.join(", "),
    "  - Bhagyodaya Fortune Rise Ages: " + decisionGates.careerGate.primaryBhagyodayaAges.join(", ") + " Years",
    "  - **Career Verdict & Timing Window:** " + decisionGates.careerGate.careerVerdict + " -> **" + decisionGates.careerGate.timingWindow + "**",
    "",
    "- 💍 **MARRIAGE & RELATIONSHIP GATE:**",
    "  - 7th House: " + decisionGates.marriageGate.seventhHouseSign + " | 7th Lord: " + decisionGates.marriageGate.seventhLord + " in House " + decisionGates.marriageGate.seventhLordHouse + " (" + decisionGates.marriageGate.seventhLordDignity + ") | Occupants: " + (decisionGates.marriageGate.seventhHouseOccupants.join(", ") || "None"),
    "  - D9 Navamsha Lagna: " + decisionGates.marriageGate.d9LagnaSign + " (Occupants: " + (decisionGates.marriageGate.d9LagnaOccupants.join(", ") || "None") + ") | D9 7th Lord: " + decisionGates.marriageGate.d9SeventhLord + " in " + decisionGates.marriageGate.d9SeventhLordRashi,
    "  - Chara Darakaraka (DK): " + decisionGates.marriageGate.darakaraka.planet + " in " + decisionGates.marriageGate.darakaraka.rashi + " (House " + decisionGates.marriageGate.darakaraka.house + ") | Upapada Lagna (UL): " + decisionGates.marriageGate.upapadaLagnaRashi,
    "  - Double Transit Active on 7th/7th Lord: " + (decisionGates.marriageGate.isDoubleTransitOn7th || decisionGates.marriageGate.isDoubleTransitOn7thLord ? "YES (Marriage Gate Active)" : "NO (Maturity Focus)"),
    "  - Manglik Status: " + (decisionGates.marriageGate.isManglik ? (decisionGates.marriageGate.isManglikCancelled ? "Manglik Cancelled (" + decisionGates.marriageGate.manglikBhangaReason + ")" : "Active Manglik") : "Non-Manglik"),
    "  - Saturn/Ketu/Mars in D9 Lagna Fact: " + (decisionGates.marriageGate.delayIndicatorSaturnD9Lagna ? "Saturn in D9 Lagna -> Vilamba Vivaha (Delay to Age 28-32+), NOT Denial" : decisionGates.marriageGate.delayIndicatorKetuD9Lagna ? "Ketu in D9 Lagna -> Spiritual Connection" : "Normal Disposition"),
    "  - **Marriage Promise & Timing Window:** **" + decisionGates.marriageGate.marriagePromiseStatus + "** -> **" + decisionGates.marriageGate.timingWindow + "**",
    "  - Spouse Archetype: " + decisionGates.marriageGate.spouseProfile.temperament + " • Direction: " + decisionGates.marriageGate.spouseProfile.direction,
    "",
    "- 🩺 **HEALTH & VITALITY GATE:**",
    "  - Lagna Lord: " + decisionGates.healthGate.lagnaLord + " in House " + decisionGates.healthGate.lagnaLordHouse + " (" + decisionGates.healthGate.lagnaLordDignity + ") | Vitality: **" + decisionGates.healthGate.vitalityStatus + "**",
    "  - Viparita Raja Yogas: Harsha (" + (decisionGates.healthGate.hasHarshaYoga ? "YES" : "NO") + "), Sarala (" + (decisionGates.healthGate.hasSaralaYoga ? "YES" : "NO") + "), Vimala (" + (decisionGates.healthGate.hasVimalaYoga ? "YES" : "NO") + ")",
    "  - Dominant Tridosha Constitution: " + decisionGates.healthGate.primaryTridoshaDominance,
    "  - Prescribed Lifestyle Remedy: " + decisionGates.healthGate.vitalityPrescription,
    "",
    "- 🎓 **EDUCATION & CAREER STREAMS GATE:**",
    "  - 5th House Lord: " + decisionGates.educationGate.fifthLord + " in House " + decisionGates.educationGate.fifthLordHouse + " (" + decisionGates.educationGate.fifthLordDignity + ") | D24 5th Lord: " + decisionGates.educationGate.d24FifthLord,
    "  - Mercury Dignity: " + decisionGates.educationGate.mercuryDignity + " | Jupiter Dignity: " + decisionGates.educationGate.jupiterDignity,
    "  - Recommended Fields: **" + decisionGates.educationGate.recommendedStreams.join(", ") + "** | Exam Potential: **" + decisionGates.educationGate.competitiveExamPotential + "**",
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
    "#### 📅 15. REAL-TIME TODAY'S LIVE PANCHANGA & MUHURTA (FOR ACTIVE CURRENT LOCATION):",
    livePanchangaSummary,
    "",
    "#### 👶 15B. NATAL PANCHANGA AT BIRTH (HISTORICAL BIRTH RECORD):",
    `- **Birth Tithi:** ${natalEphemeris.panchanga.tithi.name} (${natalEphemeris.panchanga.tithi.paksha} Paksha)${natalEphemeris.panchanga.tithi.endTime ? ` (Ends at: ${natalEphemeris.panchanga.tithi.endTime}${natalEphemeris.panchanga.tithi.remainingFormatted ? `, ${natalEphemeris.panchanga.tithi.remainingFormatted}` : ""})` : ""}`,
    `- **Birth Nakshatra:** ${natalEphemeris.panchanga.nakshatra.sanskritName} Pada ${natalEphemeris.panchanga.nakshatra.pada} (Lord: ${natalEphemeris.panchanga.nakshatra.lord})${natalEphemeris.panchanga.nakshatra.endTime ? ` (Ends at: ${natalEphemeris.panchanga.nakshatra.endTime})` : ""}`,
    "- **Birth Vara (Weekday):** " + natalEphemeris.panchanga.vara.name + " (Ruler: " + natalEphemeris.panchanga.vara.lord + ")",
    "- **Birth Yoga:** " + natalEphemeris.panchanga.yoga.name,
    "- **Birth Karana:** " + natalEphemeris.panchanga.karana.name,
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
    "",
    "#### 📜 32. MAHARAJA KALYANA VARMA SARAVALI (45 ADHYAYAS) DOSSIER:",
    saravaliSummary,
    "",
    "#### 📖 33. ACHARYA MANTRESWARA PHALADEEPIKA (28 ADHYAYAS) DOSSIER:",
    phaladeepikaSummary,
    "",
    "#### 🔮 34. PRASNA MARGA (32 ADHYAYAS) & PRASNA ARUDHA PHALA DOSSIER:",
    prasnaMargaSummary,
    "",
    "#### 🌧️ 35. ACHARYA SADANANDA SAMHITA SKANDHA (MUNDANE & ASTROMETEOROLOGY) DOSSIER:",
    samhitaSummary,
    "",
    "#### 📜 36. ACHARYA RAMADAYALU SANKETANIDHI (9 SANKETAS) DOSSIER:",
    sanketanidhiSummary,
    "",
    "#### 💎 37. ACHARYA VENKATESHA SHARMA SARVARTHA CHINTAMANI (13 ADHYAYAS) DOSSIER:",
    chintamaniSummary,
    "",
    "#### 🌺 38. STRI JATAKA (FEMALE HOROSCOPY & TRIMSAMSHA) DOSSIER:",
    striJatakaSummary,
    "",
    "#### ⭐ 39. MAHARSHI SATYACHARYA SATYA JATAKA (DHRUVA NADI) DOSSIER:",
    satyaJatakaSummary,
    "",
    "#### 🌿 40. SUGAM JYOTISH (PRACTICAL PREDICTIVE MANUAL & EVERYDAY REMEDIES) DOSSIER:",
    sugamJyotishSummary,
    "",
    "#### 📜 41. MAHAKAVI KALIDASA UTTARA KALAMRITA (VRY, SHUKRA-SHANI PARADOX & KARAKATVA) DOSSIER:",
    uttaraKalamritaSummary,
    "",
    "#### 🎯 42. VEDIC ASTROLOGY AND PREDICTIONS (MULTI-TIER EVENT FORECASTING & MILESTONES) DOSSIER:",
    vedicPredictionsSummary,
    "",
    "#### 🌙 43. JATAKA CHANDRIKA (LAGHU PARASHARI - PROF. B. SURYANARAIN RAO) DOSSIER:",
    jatakaChandrikaSummary,
    "",
    "#### 🔮 44. CHAPPANNA PRASNA SASTRA (56 QUESTIONS HORARY ORACLE - PROF. B. SURYANARAIN RAO) DOSSIER:",
    chappannaPrasnaSummary,
    "",
    "#### 📜 45. MAHARSHI BHRIGU SAMHITA (KARMIC DEBTS, PAST LIFE SINS & PARIHARAS) DOSSIER:",
    bhriguSamhitaSummary,
    "",
    "#### 📖 46. BHAVARTHA RATNAKARA (SRI RAMANUJACHARYA / DR. B.V. RAMAN) DOSSIER:",
    bhavarthaRatnakaraSummary,
    "",
    "#### 🌿 47. JAIMINI MASTER SUITE (VARNADA LAGNA, SHOOLA DASHA, BRAHMA/RUDRA & ARUDHA EXCEPTIONS) DOSSIER:",
    jaiminiRangacharyaSummary,
    "",
    "#### 🌐 48. CRUX OF VEDIC ASTROLOGY (PT. SANJAY RATH) & PARASHARI CONDITIONAL DASHAS DOSSIER:",
    cruxOfAstrologySummary,
    "",
    "#### 📐 49. KALAMSA & CUSPAL INTERLINKS THEORY (KCIL — S.P. KHULLAR) DOSSIER:",
    cuspalInterlinksSummary,
    "",
    "#### 🌿 51. MEENA NADI (JEEVA & SAREERA STELLAR THEORY) DOSSIER:",
    meenaNadiSummary,
    "",
    "#### 📜 52. MAHADEVA'S JATAKA TATTVAM (5 SUTRA VIVEKAS & 12 BHAVAS) DOSSIER:",
    jatakaTattvamSummary,
    "",
    "#### 🪷 53. D-12 PADMA CHAKRA (DWADASAMSA ANCESTRAL NADI & 12 ADITYAS) DOSSIER:",
    padmaChakraSummary,
    "",
    "#### 💎 54. D-60 SHASHTIAMSHA (60 DEITIES & SANCHITA KARMA) & BCP AGE WHEEL DOSSIER:",
    shashtiamshaBcpSummary,
    "",
    "#### 🧘 55. MAHARSHI PATANJALI YOGA SUTRAS & CHAKRA SADHANA DOSSIER:",
    patanjaliYogaSummary,
    "",
    "#### 🏰 56. CLASSICAL KOTA CHAKRA & DASHA-LORD TRANSIT DEFENSE DOSSIER:",
    kotaChakraSummary,
    "",
    "#### 🌟 57. DR. B.V. RAMAN 300 IMPORTANT COMBINATIONS & LAL KITAB TEVA DOSSIER:",
    raman300Summary,
    "",
    "#### 🏛️ 58. EMPIRICAL BENCHMARK HOROSCOPES & ARCHETYPAL RESONANCE DOSSIER:",
    benchmarkSummary,
    "",
    "#### 🔮 59. SRI NEELAKANTA PRASNA TANTRA 16 TAJIK YOGAS & 12 SAHAMS DOSSIER:",
    prasnaTantraSummary,
    "",
    "#### 📐 60. C.S. PATEL ASHTAKAVARGA SHODHANA & 8 KAKSHYAS DOSSIER:",
    patelAshtakavargaSummary,
    "",
    "#### 💼 61. JOB VS BUSINESS, CAREER ORIENTATION & D-10 DASAMSA PHALA DOSSIER (15 CLASSICAL RULES):",
    careerDossierSummary,
  ];

  if (matchmakingSummary) {
    lines.push("");
    lines.push("#### 💍 50. KUNDLI MILAN & 36-GUNA COMPATIBILITY DOSSIER (ACTIVE PARTNERSHIP):");
    lines.push(matchmakingSummary);
  }

  return lines.filter(Boolean).join("\n");
}
