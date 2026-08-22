import { RASHIS, NAKSHATRAS } from "./constants";
import type { RashiInfo, NakshatraInfo, HouseSystem } from "./types";

export function getRashi(longitude: number): RashiInfo {
  const normLon = ((longitude % 360) + 360) % 360;
  const index = Math.floor(normLon / 30);
  const degreesInSign = normLon % 30;
  const rashi = RASHIS[index] || RASHIS[0];
  return { ...rashi, degreesInSign };
}

export function getNakshatra(longitude: number): NakshatraInfo {
  const normLon = ((longitude % 360) + 360) % 360;
  const nakStep = 360 / 27;
  const padaStep = nakStep / 4;
  const index = Math.floor(normLon / nakStep);
  const degreesInNakshatra = normLon % nakStep;
  const pada = Math.floor(degreesInNakshatra / padaStep) + 1;
  const padaDegrees = degreesInNakshatra % padaStep;
  const nakshatra = NAKSHATRAS[index] || NAKSHATRAS[0];
  return { ...nakshatra, pada, degreesInNakshatra, padaDegrees };
}

export function getHouse(
  longitude: number,
  ascendantLongitude: number,
  system: HouseSystem = "WholeSign"
): number {
  const normLon = ((longitude % 360) + 360) % 360;
  const normAsc = ((ascendantLongitude % 360) + 360) % 360;
  if (system === "WholeSign") {
    const planetRashi = Math.floor(normLon / 30);
    const ascRashi = Math.floor(normAsc / 30);
    return ((planetRashi - ascRashi + 12) % 12) + 1;
  } else {
    const diff = (normLon - normAsc + 360) % 360;
    return Math.floor(diff / 30) + 1;
  }
}

export function formatDMS(deg: number): string {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
  return `${degrees}° ${minutes.toString().padStart(2, "0")}' ${seconds.toString().padStart(2, "0")}"`;
}
