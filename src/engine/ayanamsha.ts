import type { AyanamshaType } from "./types";

/**
 * Computes the Ayanamsha in degrees for a given time.
 * @param daysSinceJ2000 - Number of days since J2000.0 epoch (AstroTime.ut)
 * @param type - Ayanamsha model (Lahiri, KP, Raman, Tropical)
 */
export function getAyanamsha(daysSinceJ2000: number, type: AyanamshaType = "Lahiri"): number {
  if (type === "Tropical") return 0;
  // If a full Julian Date (> 2000000) is passed, convert to days since J2000.0
  const days = daysSinceJ2000 > 1000000 ? daysSinceJ2000 - 2451545.0 : daysSinceJ2000;
  // Julian centuries from J2000.0 (JD 2451545.0)
  const T = days / 36525.0;
  const precession = 1.3969713 * T + 0.0003086 * (T * T);

  switch (type) {
    case "Lahiri":
      // Standard Indian Astronomical Ephemeris / Swiss Ephemeris Chitrapaksha Lahiri: 23° 51' 25.53" = 23.8570917°
      return 23.8570917 + precession;
    case "KP":
      // Krishnamurti Padhdhati: 23° 45' 56.55" = 23.7657083°
      return 23.7657083 + precession;
    case "Raman":
      // B.V. Raman: 22° 27' 37.7" = 22.4604722°
      return 22.4604722 + precession;
    default:
      return 23.8570917 + precession;
  }
}

export function toSiderealLongitude(tropicalLon: number, ayanamsha: number): number {
  const sidereal = (tropicalLon - ayanamsha) % 360;
  return sidereal < 0 ? sidereal + 360 : sidereal;
}