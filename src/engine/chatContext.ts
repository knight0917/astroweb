/**
 * Vedic AI Chat Context Builder
 * Assembles a structured classical astrological dossier of the native
 * to feed directly into the AI system prompt.
 */

import { EphemerisResult } from "./types";
import { calculateVimshottariDasha } from "./dasha";
import { calculateGochar } from "./gochar";
import { RASHI_NAMES } from "./constants";

export interface AstroDossier {
  birthDetails: string;
  lagnaDetails: string;
  moonDetails: string;
  sunDetails: string;
  planetaryPositions: string;
  activeDasha: string;
  sadeSatiStatus: string;
  panchanga: string;
}

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

  // 3. Planetary Placements List
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

  const dossier = `
### NATIVE'S VEDIC ASTROLOGICAL PROFILE:
- **Date & Time of Birth (UTC):** ${birthDate.toUTCString()}
- **Birth Location:** ${location.cityName}${location.country ? `, ${location.country}` : ""} (Lat: ${location.latitude.toFixed(2)}°, Lon: ${location.longitude.toFixed(2)}°)
- **Ayanamsha Model:** ${natalEphemeris.ayanamshaType} (${natalEphemeris.ayanamshaValue.toFixed(3)}°)

#### 🌟 ASCENDANT & KEY GRAHAS:
- **Ascendant (Lagna / लग्न):** ${ascRashi.englishName} (${ascRashi.sanskritName}) at ${(ascLon % 30).toFixed(2)}° • Lord: ${ascRashi.lord}
- **Moon Sign (Janma Rashi / चन्द्र राशि):** ${RASHI_NAMES[Math.floor(moonLon / 30)].englishName} (${RASHI_NAMES[Math.floor(moonLon / 30)].sanskritName}) • Lord: ${RASHI_NAMES[Math.floor(moonLon / 30)].lord}
- **Moon Nakshatra:** ${natalEphemeris.planets.Moon?.nakshatra.sanskritName} Pada ${natalEphemeris.planets.Moon?.nakshatra.pada} (Deity: ${natalEphemeris.planets.Moon?.nakshatra.deity}, Lord: ${natalEphemeris.planets.Moon?.nakshatra.lord})
- **Sun Sign (Surya Rashi):** ${RASHI_NAMES[Math.floor(natalEphemeris.planets.Sun?.siderealLongitude / 30)].englishName} (${RASHI_NAMES[Math.floor(natalEphemeris.planets.Sun?.siderealLongitude / 30)].sanskritName})

#### 🪐 NATAL PLANETARY POSITIONS (KUNDLI HOUSES):
${planetsSummary.join("\n")}

#### 👑 VIMSHOTTARI DASHA STATUS (CURRENT PERIOD):
${
  activeDasha
    ? `- **Active Mahadasha (MD):** ${activeDasha.mahadasha.name} (${activeDasha.mahadasha.hindiName}) [${activeDasha.mdStart.toLocaleDateString()} to ${activeDasha.mdEnd.toLocaleDateString()}]
- **Active Antardasha (AD):** ${activeDasha.antardasha.name} (${activeDasha.antardasha.hindiName}) [${activeDasha.adStart.toLocaleDateString()} to ${activeDasha.adEnd.toLocaleDateString()}]
- **Active Pratyantardasha (PD):** ${activeDasha.pratyantardasha.name} (${activeDasha.pratyantardasha.hindiName}) [${activeDasha.pdStart.toLocaleDateString()} to ${activeDasha.pdEnd.toLocaleDateString()}]
- **Current Period Progress:** ${activeDasha.percentageCompleteMD}% of MD and ${activeDasha.percentageCompleteAD}% of AD completed.`
    : "- Dasha details calculated from birth balance."
}

#### 🪐 SHANI SADE SATI & TRANSIT (GOCHAR) STATUS:
- **Sade Sati Status:** ${gochar.sadeSati.statusTitle} (${gochar.sadeSati.phaseName})
- **Saturn Transit Position:** House ${gochar.sadeSati.houseFromMoon} from Natal Moon in ${gochar.sadeSati.saturnTransitRashi}
- **Timing & End Date:** ${gochar.sadeSati.remainingDurationFormatted || "N/A"}
${gochar.sadeSati.currentPhaseEndFormatted ? `- Current Phase Ends: ${gochar.sadeSati.currentPhaseEndFormatted}` : ""}
${gochar.sadeSati.totalCompletionFormatted ? `- Total Sade Sati Ends: ${gochar.sadeSati.totalCompletionFormatted}` : ""}
${gochar.sadeSati.nextCycleStartFormatted ? `- Next Cycle Begins: ${gochar.sadeSati.nextCycleStartFormatted}` : ""}

#### 📅 PANCHANGA AT BIRTH:
- **Tithi:** ${natalEphemeris.panchanga.tithi.name} (${natalEphemeris.panchanga.tithi.paksha} Paksha)
- **Vara (Weekday):** ${natalEphemeris.panchanga.vara.name} (Ruler: ${natalEphemeris.panchanga.vara.lord})
- **Yoga:** ${natalEphemeris.panchanga.yoga.name}
- **Karana:** ${natalEphemeris.panchanga.karana.name}
`;

  return dossier.trim();
}