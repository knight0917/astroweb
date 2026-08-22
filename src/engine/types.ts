export type AyanamshaType = "Lahiri" | "KP" | "Raman" | "Tropical";

export type HouseSystem = "WholeSign" | "Equal";

export type NodeType = "Mean" | "True";

export interface GeoLocation {
  latitude: number;
  longitude: number;
  elevation?: number;
  cityName: string;
  country?: string;
  timezoneOffsetHours: number; // e.g. +5.5 for IST
}

export interface RashiInfo {
  index: number; // 0 = Mesha, 11 = Meena
  sanskritName: string;
  englishName: string;
  symbol: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  lord: string;
  degreesInSign: number; // 0 to 30
}

export interface NakshatraInfo {
  index: number; // 0 = Ashwini, 26 = Revati
  sanskritName: string;
  lord: string;
  deity: string;
  animal: string; // Vedic Yoni Animal (e.g. Horse, Elephant, Lion)
  animalSymbol: string; // Emoji/icon representation (e.g. 🐴, 🐘, 🦁)
  yoni?: string;
  pada: number; // 1, 2, 3, 4
  degreesInNakshatra: number; // 0 to 13.333333
  padaDegrees: number; // 0 to 3.333333
}

export interface CelestialBodyPosition {
  id: string;
  name: string;
  sanskritName: string;
  symbol: string;
  color: string;
  tropicalLongitude: number;
  siderealLongitude: number;
  speed: number;
  isRetrograde: boolean;
  latitude: number;
  distanceAU: number;
  altitude: number; // in degrees (-90 to +90)
  azimuth: number; // in degrees (0 to 360)
  rashi: RashiInfo;
  nakshatra: NakshatraInfo;
  house: number; // 1 to 12
  isUpagraha?: boolean;
  isModernPlanet?: boolean;
}

export interface SpecialPoint {
  id: string;
  name: string;
  sanskritName: string;
  siderealLongitude: number;
  rashi: RashiInfo;
  nakshatra: NakshatraInfo;
  house: number;
  description: string;
  category: "Lagna" | "Node" | "SolarUpagraha" | "DiurnalUpagraha";
}

export interface EphemerisResult {
  utcDate: string;
  localDate: string;
  julianDay: number;
  ayanamshaValue: number;
  ayanamshaType: AyanamshaType;
  location: GeoLocation;
  ascendant: SpecialPoint;
  midheaven: SpecialPoint;
  descendant: SpecialPoint;
  imumCoeli: SpecialPoint;
  planets: Record<string, CelestialBodyPosition>;
  upagrahas: Record<string, SpecialPoint>;
  houses: {
    system: HouseSystem;
    cusps: number[]; // 12 sidereal cusp start longitudes
  };
  panchanga: {
    tithi: { name: string; paksha: "Shukla" | "Krishna"; index: number; progressPercent: number };
    vara: { name: string; sanskritName: string; lord: string };
    nakshatra: NakshatraInfo;
    yoga: { name: string; index: number };
    karana: { name: string; index: number };
  };
}
