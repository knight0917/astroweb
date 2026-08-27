/**
 * Classical Ishta Phala, Kashta Phala & Residential Strength Engine (इष्ट-कष्ट एवं निवासी बल)
 * Reference: Bhava and Graha Balas (Dr. B.V. Raman, 1996, Ch. 2, 9, 10) & Sripathi Paddhati
 */

import { EphemerisResult } from "./types";
import { calculateShadbala, ShadbalaPlanetId } from "./shadbala";

export interface PlanetIshtaKashta {
  name: string;
  sanskritName: string;
  ucchaBala: number; // 0 to 60 Virupas
  chestaBala: number; // 0 to 60 Virupas
  ishtaPhala: number; // 0 to 60 Shashtiamsas
  kashtaPhala: number; // 0 to 60 Shashtiamsas
  netBeneficRatio: number; // 0.0 to 1.0 (Ishta / (Ishta + Kashta))
  residentialPercent: number; // 0% to 100%
  houseOccupied: number;
  qualityBadge: "Supreme Auspicious" | "Favorable" | "Mixed / Neutral" | "Testing / Requires Remedy";
  badgeColor: string;
  practicalGuidance: string;
}

export interface IshtaKashtaReport {
  planets: Record<string, PlanetIshtaKashta>;
  highestIshtaPlanet: PlanetIshtaKashta;
  highestKashtaPlanet: PlanetIshtaKashta;
  averageIshta: number;
  averageKashta: number;
}

const DEBILITATION_DEGREES: Record<string, number> = {
  Sun: 190, // 10° Libra
  Moon: 213, // 3° Scorpio
  Mars: 118, // 28° Cancer
  Mercury: 345, // 15° Pisces
  Jupiter: 275, // 5° Capricorn
  Venus: 177, // 27° Virgo
  Saturn: 20, // 20° Aries
};

const SANSKRIT_NAMES: Record<string, string> = {
  Sun: "सूर्य", Moon: "चन्द्र", Mars: "मंगल", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि",
};

export function calculateIshtaKashta(ephemeris: EphemerisResult): IshtaKashtaReport {
  const physicalPlanets: ShadbalaPlanetId[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const planets = ephemeris.planets;
  const cusps = ephemeris.houses?.cusps || [];

  let rawUccha: Record<string, number> = {};
  let rawChesta: Record<string, number> = {};
  let rawIshta: Record<string, number> = {};
  let rawKashta: Record<string, number> = {};

  try {
    const sb = calculateShadbala(ephemeris);
    Object.values(sb.planets).forEach((p) => {
      rawUccha[p.name] = p.sthanaBala.uchchaBala;
      rawChesta[p.name] = p.cheshtaBala;
      rawIshta[p.name] = p.ishtaPhala;
      rawKashta[p.name] = p.kashtaPhala;
    });
  } catch (_) {}

  const reports: Record<string, PlanetIshtaKashta> = {};

  physicalPlanets.forEach((pName) => {
    const p = (planets as any)[pName];
    const lon = p?.siderealLongitude || 0;
    const house = p?.house || 1;

    // 1. Uccha Bala (0 to 60 Virupas)
    let uccha = rawUccha[pName];
    if (uccha === undefined) {
      const debLon = DEBILITATION_DEGREES[pName] || 0;
      let dist = Math.abs(lon - debLon);
      if (dist > 180) dist = 360 - dist;
      uccha = dist / 3.0;
    }
    uccha = Math.max(0, Math.min(60, uccha));

    // 2. Chesta Bala (0 to 60 Virupas)
    let chesta = rawChesta[pName];
    if (chesta === undefined) {
      if (pName === "Sun") {
        chesta = 30.0;
      } else if (pName === "Moon") {
        const sunLon = planets.Sun?.siderealLongitude || 0;
        let diff = (lon - sunLon + 360) % 360;
        if (diff > 180) diff = 360 - diff;
        chesta = (diff / 180.0) * 60.0;
      } else {
        chesta = p?.isRetrograde ? 55.0 : 25.0;
      }
    }
    chesta = Math.max(0, Math.min(60, chesta));

    // 3. Ishta & Kashta
    let ishta = rawIshta[pName];
    let kashta = rawKashta[pName];
    if (ishta === undefined || kashta === undefined) {
      ishta = Math.sqrt(uccha * chesta);
      kashta = Math.sqrt((60.0 - uccha) * (60.0 - chesta));
    }
    const total = ishta + kashta;
    const netBeneficRatio = total > 0 ? ishta / total : 0.5;

    // 4. Residential Strength % (Proximity to Bhava Madhya)
    let residentialPercent = 85;
    if (cusps.length === 12 && house >= 1 && house <= 12) {
      const idx = house - 1;
      const start = cusps[idx];
      const end = cusps[(idx + 1) % 12];
      const span = (end - start + 360) % 360;

      const span1 = span / 2.0;
      const pPos = (lon - start + 360) % 360;

      if (pPos <= span1) {
        residentialPercent = span1 > 0 ? (pPos / span1) * 100 : 50;
      } else {
        const pRem = (end - lon + 360) % 360;
        residentialPercent = span1 > 0 ? (pRem / span1) * 100 : 50;
      }
    }
    residentialPercent = Math.max(10, Math.min(100, Math.round(residentialPercent)));

    // Quality Badge
    let qualityBadge: "Supreme Auspicious" | "Favorable" | "Mixed / Neutral" | "Testing / Requires Remedy" = "Mixed / Neutral";
    let badgeColor = "text-amber-400 bg-amber-950/40 border-amber-500/40";
    let guidance = "Produces balanced, steady manifestations in its Dasha period.";

    if (ishta >= 35 && ishta > kashta * 1.5) {
      qualityBadge = "Supreme Auspicious";
      badgeColor = "text-emerald-400 bg-emerald-950/40 border-emerald-500/40";
      guidance = "Delivers effortless, virtuous expansion, status gains, and prosperity during its Dasha.";
    } else if (ishta > kashta) {
      qualityBadge = "Favorable";
      badgeColor = "text-teal-400 bg-teal-950/40 border-teal-500/40";
      guidance = "Produces positive and constructive opportunities with mild effort.";
    } else if (kashta >= 35 && kashta > ishta * 1.5) {
      qualityBadge = "Testing / Requires Remedy";
      badgeColor = "text-rose-400 bg-rose-950/40 border-rose-500/40";
      guidance = "Introduces valuable life lessons and delays; benefits greatly from classical stotras and japa.";
    }

    reports[pName] = {
      name: pName,
      sanskritName: SANSKRIT_NAMES[pName] || pName,
      ucchaBala: parseFloat(uccha.toFixed(2)),
      chestaBala: parseFloat(chesta.toFixed(2)),
      ishtaPhala: parseFloat(ishta.toFixed(2)),
      kashtaPhala: parseFloat(kashta.toFixed(2)),
      netBeneficRatio: parseFloat(netBeneficRatio.toFixed(2)),
      residentialPercent,
      houseOccupied: house,
      qualityBadge,
      badgeColor,
      practicalGuidance: guidance,
    };
  });

  const sortedByIshta = Object.values(reports).sort((a, b) => b.ishtaPhala - a.ishtaPhala);
  const sortedByKashta = Object.values(reports).sort((a, b) => b.kashtaPhala - a.kashtaPhala);

  const avgIshta = Object.values(reports).reduce((acc, p) => acc + p.ishtaPhala, 0) / physicalPlanets.length;
  const avgKashta = Object.values(reports).reduce((acc, p) => acc + p.kashtaPhala, 0) / physicalPlanets.length;

  return {
    planets: reports,
    highestIshtaPlanet: sortedByIshta[0],
    highestKashtaPlanet: sortedByKashta[0],
    averageIshta: parseFloat(avgIshta.toFixed(2)),
    averageKashta: parseFloat(avgKashta.toFixed(2)),
  };
}
