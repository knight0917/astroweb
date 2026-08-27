/**
 * Professional Vedic AI Chat Context Synthesizer ("Acharya Jyotish AI Pro")
 * Calibrated with B.V. Raman's 300 Important Combinations, BPHS, and Classical Parashari Jyotish.
 * Assembles a comprehensive, multi-layered classical astrological dossier of the native
 * combining D1 Rashi, D9 Navamsha, D10 Dashamsha, Shadbala, Jaimini Karakas,
 * Ashtakavarga, Raman 300 Yogas with Potency & Bhanga, Vimshottari Dasha, and Gochar transits.
 */

import { EphemerisResult } from "./types";
import { calculateVimshottariDasha } from "./dasha";
import { calculateGochar } from "./gochar";
import { calculateShodashavargaChart } from "./shodashavarga";
import { calculateShadbala } from "./shadbala";
import { calculateAshtakavarga } from "./ashtakavarga";
import { calculateJaiminiKarakas } from "./jaimini";
import { evaluateRamanYogas } from "./ramanYogas";
import { mapYogaActivationTimeline } from "./yogaActivation";
import { RASHI_NAMES } from "./constants";

export function buildAstroDossier(
  natalEphemeris: EphemerisResult,
  transitEphemeris: EphemerisResult,
  evaluationDate: Date = new Date()
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

  // 5. Jaimini Chara Karakas (AK, AmK, DK, etc.)
  let jaiminiSummary = "";
  try {
    const jaimini = calculateJaiminiKarakas(natalEphemeris);
    jaiminiSummary = `
- **Atmakaraka (AK - Soul & Destiny):** ${jaimini.atmakaraka.planetName} in ${jaimini.atmakaraka.rashi.englishName} (${jaimini.atmakaraka.formattedDegrees})
- **Amatyakaraka (AmK - Career & Livelihood):** ${jaimini.amatyakaraka.planetName} in ${jaimini.amatyakaraka.rashi.englishName} (${jaimini.amatyakaraka.formattedDegrees})
- **Darakaraka (DK - Spouse & Partnerships):** ${jaimini.darakaraka.planetName} in ${jaimini.darakaraka.rashi.englishName} (${jaimini.darakaraka.formattedDegrees})
- **Bhratrikaraka (BK - Siblings & Guru):** ${jaimini.bhratrikaraka.planetName}
- **Matrikaraka (MK - Mother & Property):** ${jaimini.matrikaraka.planetName}
- **Putrakaraka (PK - Children & Intelligence):** ${jaimini.putrakaraka.planetName}
- **Gnatikaraka (GK - Obstacles & Competitions):** ${jaimini.gnatikaraka.planetName}`;
  } catch (_) {}

  // 6. Ashtakavarga Sarvashtakavarga (SAV) Points
  let ashtakavargaSummary = "";
  try {
    const av = calculateAshtakavarga(natalEphemeris);
    ashtakavargaSummary = `SAV Points in Houses -> 1st (Tanu): ${av.sarvaHouseBindus[0]}, 2nd (Dhana): ${av.sarvaHouseBindus[1]}, 4th (Sukha): ${av.sarvaHouseBindus[3]}, 7th (Kalatra): ${av.sarvaHouseBindus[6]}, 9th (Bhagya): ${av.sarvaHouseBindus[8]}, 10th (Karma): ${av.sarvaHouseBindus[9]}, 11th (Labha): ${av.sarvaHouseBindus[10]}`;
  } catch (_) {}

  // 7. Natal Planetary Positions (D1)
  const planetsSummary: string[] = [];
  Object.values(natalEphemeris.planets).forEach((p) => {
    if (p.isModernPlanet) return;
    const rashiIdx = Math.floor(p.siderealLongitude / 30);
    const rashi = RASHI_NAMES[rashiIdx];
    const deg = (p.siderealLongitude % 30).toFixed(1);
    const isRetro = p.isRetrograde ? " [Retrograde / वक्री]" : "";
    planetsSummary.push(
      `- ${p.name} (${p.symbol}): House ${p.house} in ${rashi.englishName} (${rashi.sanskritName}) at ${deg}° in ${p.nakshatra.sanskritName} Pada ${p.nakshatra.pada}${isRetro}`
    );
  });

  // 8. B.V. Raman 300 Yogas with Potency & Bhanga Analysis
  const ramanAnalysis = evaluateRamanYogas(natalEphemeris);
  const yogaActivation = mapYogaActivationTimeline(ramanAnalysis.yogas, dasha);

  const activeYogasFormatted = yogaActivation.currentlyActive.length > 0
    ? yogaActivation.currentlyActive
        .map((r) => `- **${r.yoga.name} (${r.yoga.sanskritName})** [Potency: ${r.yoga.potencyPercent}%] -> ${r.timingDescription} | Effects: ${r.yoga.practicalEffects}`)
        .join("\n")
    : "- No high-potency event yogas active in this specific sub-period. Results unfold via general Dasha lordship significations.";

  const lifelongYogasFormatted = yogaActivation.lifelongYogas.length > 0
    ? yogaActivation.lifelongYogas
        .map((r) => `- **${r.yoga.name} (${r.yoga.sanskritName})** -> ${r.yoga.classicalDescription} | Lifelong Trait: ${r.yoga.practicalEffects}`)
        .join("\n")
    : "- Standard constitutional distribution.";

  const upcomingYogasFormatted = yogaActivation.upcomingYogas.slice(0, 4).length > 0
    ? yogaActivation.upcomingYogas.slice(0, 4)
        .map((r) => `- **${r.yoga.name}** [Potency: ${r.yoga.potencyPercent}%] -> ${r.timingDescription}`)
        .join("\n")
    : "- All major yogas have completed primary cycles or remain dormant.";

  const cancelledYogasFormatted = yogaActivation.cancelledYogas.length > 0
    ? yogaActivation.cancelledYogas
        .map((r) => `- **${r.yoga.name}**: ${r.timingDescription}`)
        .join("\n")
    : "- No cancelled or corrupt combinations detected.";

  // Functional Roles formatted
  const functionalRolesFormatted = Object.entries(ramanAnalysis.functionalRoles)
    .map(([graha, role]) => `- **${graha}:** ${role}`)
    .join("\n");

  const dossier = `
### NATIVE'S COMPREHENSIVE VEDIC ASTROLOGICAL DOSSIER (B.V. RAMAN & PARASHARI STANDARD):
- **Current Real-Time Consultation Date:** ${evaluationDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} (Year: ${evaluationDate.getFullYear()})
- **Date & Time of Birth (UTC):** ${birthDate.toUTCString()}
- **Birth Location:** ${location.cityName}${location.country ? `, ${location.country}` : ""} (Lat: ${location.latitude.toFixed(2)}°, Lon: ${location.longitude.toFixed(2)}°)
- **Ayanamsha Model:** ${natalEphemeris.ayanamshaType} (${natalEphemeris.ayanamshaValue.toFixed(3)}°)

#### 🌟 1. CORE LAGNA & FUNCTIONAL ROLES:
- **Ascendant (Lagna / लग्न):** ${ascRashi.englishName} (${ascRashi.sanskritName}) at ${(ascLon % 30).toFixed(2)}° • Ruling Lord: ${ascRashi.lord}
- **Moon Sign (Janma Rashi / चन्द्र राशि):** ${RASHI_NAMES[Math.floor(moonLon / 30)].englishName} (${RASHI_NAMES[Math.floor(moonLon / 30)].sanskritName}) • Lord: ${RASHI_NAMES[Math.floor(moonLon / 30)].lord}
- **Moon Nakshatra:** ${natalEphemeris.planets.Moon?.nakshatra.sanskritName} Pada ${natalEphemeris.planets.Moon?.nakshatra.pada} (Deity: ${natalEphemeris.planets.Moon?.nakshatra.deity}, Lord: ${natalEphemeris.planets.Moon?.nakshatra.lord})
- **Sun Sign (Surya Rashi):** ${RASHI_NAMES[Math.floor(natalEphemeris.planets.Sun?.siderealLongitude / 30)].englishName} (${RASHI_NAMES[Math.floor(natalEphemeris.planets.Sun?.siderealLongitude / 30)].sanskritName})
- **Functional Lordship Matrix for this Lagna:**
${functionalRolesFormatted}

#### 🪐 2. NATAL PLANETARY POSITIONS (D1 KUNDLI HOUSES):
${planetsSummary.join("\n")}

#### 📜 3. B.V. RAMAN 300 YOGAS & ACTIVATION TIMELINE:
- **Currently Active Yogas in Running Dasha (${activeDasha ? activeDasha.mahadasha.name + "/" + activeDasha.antardasha.name : "N/A"}):**
${activeYogasFormatted}

- **Lifelong Constitutional & Archetypal Yogas:**
${lifelongYogasFormatted}

- **Upcoming Yogas (Scheduled in Next Dasha Periods):**
${upcomingYogasFormatted}

- **Cancelled Yogas / Neutralized Doshas (Bhanga Status):**
${cancelledYogasFormatted}

#### 👑 4. CURRENT VIMSHOTTARI DASHA TIMELINE:
${
  activeDasha
    ? `- **Active Mahadasha (MD):** ${activeDasha.mahadasha.name} (${activeDasha.mahadasha.hindiName}) [${activeDasha.mdStart.toLocaleDateString()} to ${activeDasha.mdEnd.toLocaleDateString()}]
- **Active Antardasha (AD):** ${activeDasha.antardasha.name} (${activeDasha.antardasha.hindiName}) [${activeDasha.adStart.toLocaleDateString()} to ${activeDasha.adEnd.toLocaleDateString()}]
- **Active Pratyantardasha (PD):** ${activeDasha.pratyantardasha.name} (${activeDasha.pratyantardasha.hindiName}) [${activeDasha.pdStart.toLocaleDateString()} to ${activeDasha.pdEnd.toLocaleDateString()}]
- **Dasha Progress:** ${activeDasha.percentageCompleteMD}% of MD and ${activeDasha.percentageCompleteAD}% of AD completed.
- **Dominant Operational Theme:** ${yogaActivation.dominantLifeTheme}`
    : "- Dasha calculated."
}

#### 💎 5. DIVISIONAL CHARTS (VARGAS):
- **D9 Navamsha (Dharma, Marriage & Potential):** Lagna in ${d9Chart.ascendant.vargaRashi.englishName} • Placements: ${d9Summary.join(", ")}
- **D10 Dashamsha (Career, Profession & Power):** Lagna in ${d10Chart.ascendant.vargaRashi.englishName} • Placements: ${d10Summary.join(", ")}

#### ⚖️ 6. JAIMINI CHARA KARAKAS (SOUL & PURPOSE):
${jaiminiSummary}

#### ⚡ 7. SHADBALA (PLANETARY STRENGTHS & CAPACITY):
${shadbalaSummary}

#### 📊 8. ASHTAKAVARGA STRENGTH (BENEFIC POINTS):
${ashtakavargaSummary}

#### 🪐 9. SHANI SADE SATI & GOCHAR TRANSITS:
- **Sade Sati Status:** ${gochar.sadeSati.statusTitle} (${gochar.sadeSati.phaseName})
- **Saturn Transit Position:** House ${gochar.sadeSati.houseFromMoon} from Natal Moon in ${gochar.sadeSati.saturnTransitRashi}
- **Remaining Duration:** ${gochar.sadeSati.remainingDurationFormatted || "N/A"}
${gochar.sadeSati.currentPhaseEndFormatted ? `- Current Phase Ends: ${gochar.sadeSati.currentPhaseEndFormatted}` : ""}
${gochar.sadeSati.totalCompletionFormatted ? `- Total Sade Sati Ends: ${gochar.sadeSati.totalCompletionFormatted}` : ""}
${gochar.sadeSati.nextCycleStartFormatted ? `- Next Cycle Begins: ${gochar.sadeSati.nextCycleStartFormatted}` : ""}

#### 📅 10. PANCHANGA AT BIRTH:
- **Tithi:** ${natalEphemeris.panchanga.tithi.name} (${natalEphemeris.panchanga.tithi.paksha} Paksha)
- **Vara (Weekday):** ${natalEphemeris.panchanga.vara.name} (Ruler: ${natalEphemeris.panchanga.vara.lord})
- **Yoga:** ${natalEphemeris.panchanga.yoga.name}
- **Karana:** ${natalEphemeris.panchanga.karana.name}
`;

  return dossier.trim();
}
