import { RASHIS, NAKSHATRAS } from "./constants";
import type { RashiInfo, NakshatraInfo, HouseSystem } from "./types";

export function getRashi(longitude: number): RashiInfo {
  const normLon = ((longitude % 360) + 360) % 360;
  const index = Math.min(11, Math.floor(normLon / 30));
  const degreesInSign = normLon % 30;
  const rashi = RASHIS[index] || RASHIS[0];
  return { ...rashi, degreesInSign };
}

export function getNakshatra(longitude: number): NakshatraInfo {
  const normLon = ((longitude % 360) + 360) % 360;
  const nakStep = 360 / 27;
  const padaStep = nakStep / 4;
  const index = Math.min(26, Math.floor(normLon / nakStep));
  const degreesInNakshatra = Math.max(0, normLon - index * nakStep);
  const pada = Math.min(4, Math.floor((degreesInNakshatra * 4) / nakStep) + 1);
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
    const planetRashi = Math.min(11, Math.floor(normLon / 30));
    const ascRashi = Math.min(11, Math.floor(normAsc / 30));
    return ((planetRashi - ascRashi + 12) % 12) + 1;
  } else {
    const diff = (normLon - normAsc + 360) % 360;
    return Math.min(12, Math.floor(diff / 30) + 1);
  }
}

export function formatDMS(deg: number): string {
  const signPrefix = deg < 0 ? "-" : "";
  const totalSeconds = Math.round(Math.abs(deg) * 3600);
  const degrees = Math.floor(totalSeconds / 3600);
  const remSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remSeconds / 60);
  const seconds = remSeconds % 60;
  return `${signPrefix}${degrees}° ${minutes.toString().padStart(2, "0")}' ${seconds.toString().padStart(2, "0")}"`;
}
