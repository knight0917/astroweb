import * as Astronomy from "astronomy-engine";
import { getRashi, getNakshatra } from "./rashiNakshatra";
import { toSiderealLongitude } from "./ayanamsha";
import type { SpecialPoint } from "./types";

/**
 * Computes Greenwich Mean Sidereal Time (GMST) in degrees using Astronomy.SiderealTime
 */
export function getGMSTDegrees(astroTime: Astronomy.AstroTime): number {
  const gmstHours = Astronomy.SiderealTime(astroTime);
  return ((gmstHours * 15) % 360 + 360) % 360;
}

/**
 * Computes Mean Obliquity of the Ecliptic in degrees
 */
export function getEclipticObliquityDegrees(astroTime: Astronomy.AstroTime): number {
  const T = astroTime.ut / 36525.0;
  return 23.4392911 - 0.013004167 * T - 0.000000164 * T * T + 0.0000005036 * T * T * T;
}

/**
 * Computes the Tropical Ascendant (Lagna) and Midheaven (MC) in degrees [0, 360)
 */
export function calculateTropicalAngles(
  astroTime: Astronomy.AstroTime,
  latitudeDeg: number,
  longitudeDeg: number
): { ascendant: number; midheaven: number; descendant: number; imumCoeli: number } {
  const gmstDeg = getGMSTDegrees(astroTime);
  // Local Sidereal Time (RAMC) in degrees
  const lstDeg = ((gmstDeg + longitudeDeg) % 360 + 360) % 360;
  const lstRad = (lstDeg * Math.PI) / 180;

  const latRad = (latitudeDeg * Math.PI) / 180;
  const epsDeg = getEclipticObliquityDegrees(astroTime);
  const epsRad = (epsDeg * Math.PI) / 180;

  // Midheaven (MC / Dashama Bhava)
  const mcY = Math.sin(lstRad);
  const mcX = Math.cos(lstRad) * Math.cos(epsRad);
  let mcTropical = (Math.atan2(mcY, mcX) * 180) / Math.PI;
  mcTropical = ((mcTropical % 360) + 360) % 360;

  // Ascendant (Lagna) calculation:
  // tan(λ) = cos(θ) / (-sin(θ)*cos(ε) - tan(φ)*sin(ε))
  const ascY = Math.cos(lstRad);
  const ascX = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  let ascTropical = (Math.atan2(ascY, ascX) * 180) / Math.PI;
  ascTropical = ((ascTropical % 360) + 360) % 360;

  const dscTropical = (ascTropical + 180) % 360;
  const icTropical = (mcTropical + 180) % 360;

  return {
    ascendant: ascTropical,
    midheaven: mcTropical,
    descendant: dscTropical,
    imumCoeli: icTropical,
  };
}

/**
 * Derives Sidereal Special Points for Ascendant, Midheaven, Descendant, IC
 */
export function calculateAscendantAndAngles(
  astroTime: Astronomy.AstroTime,
  latitudeDeg: number,
  longitudeDeg: number,
  ayanamsha: number
): {
  ascendant: SpecialPoint;
  midheaven: SpecialPoint;
  descendant: SpecialPoint;
  imumCoeli: SpecialPoint;
} {
  const tropical = calculateTropicalAngles(astroTime, latitudeDeg, longitudeDeg);

  const ascSidereal = toSiderealLongitude(tropical.ascendant, ayanamsha);
  const mcSidereal = toSiderealLongitude(tropical.midheaven, ayanamsha);
  const dscSidereal = toSiderealLongitude(tropical.descendant, ayanamsha);
  const icSidereal = toSiderealLongitude(tropical.imumCoeli, ayanamsha);

  return {
    ascendant: {
      id: "Ascendant",
      name: "Ascendant",
      sanskritName: "Lagna",
      siderealLongitude: ascSidereal,
      rashi: getRashi(ascSidereal),
      nakshatra: getNakshatra(ascSidereal),
      house: 1,
      description: "The Rising Sign at the Eastern horizon at the moment of observation",
      category: "Lagna",
    },
    midheaven: {
      id: "Midheaven",
      name: "Midheaven",
      sanskritName: "Madhya Lagna / Dashama",
      siderealLongitude: mcSidereal,
      rashi: getRashi(mcSidereal),
      nakshatra: getNakshatra(mcSidereal),
      house: 10,
      description: "The highest point on the ecliptic (Zenith meridian intersection)",
      category: "Lagna",
    },
    descendant: {
      id: "Descendant",
      name: "Descendant",
      sanskritName: "Asta Lagna",
      siderealLongitude: dscSidereal,
      rashi: getRashi(dscSidereal),
      nakshatra: getNakshatra(dscSidereal),
      house: 7,
      description: "The Setting Sign on the Western horizon",
      category: "Lagna",
    },
    imumCoeli: {
      id: "ImumCoeli",
      name: "Imum Coeli (Nadir)",
      sanskritName: "Patala Lagna",
      siderealLongitude: icSidereal,
      rashi: getRashi(icSidereal),
      nakshatra: getNakshatra(icSidereal),
      house: 4,
      description: "The lowest point directly beneath the Earth",
      category: "Lagna",
    },
  };
}