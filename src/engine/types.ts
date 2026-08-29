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
    tithi: {
      name: string;
      paksha: "Shukla" | "Krishna";
      index: number;
      progressPercent: number;
      endTime?: string;
      remainingFormatted?: string;
    };
    masa: { name: string; sanskritName: string; solarMasa: string };
    gregorianMonth: string;
    vara: { name: string; sanskritName: string; lord: string };
    nakshatra: NakshatraInfo & { endTime?: string; remainingFormatted?: string };
    yoga: { name: string; index: number; endTime?: string };
    karana: { name: string; index: number; endTime?: string };
  };
}

export interface KurmaChakraDirection {
  direction: "Central" | "East" | "South-East" | "South" | "South-West" | "West" | "North-West" | "North" | "North-East";
  sanskritDirection: string;
  rulingDeity: string;
  nakshatras: string[];
  planetsPresent: string[];
  beneficCount: number;
  maleficCount: number;
  afflictionScore: number; // 0 to 100%
  classicalRegions: string;
  bioFieldAffinity: string;
  status: "Fortified" | "Balanced" | "Afflicted" | "Severely Vulnerable";
}

export interface GrahaYuddhaEvent {
  planet1: string;
  planet2: string;
  separationDegrees: number;
  warfareType: "Bhedana" | "Ullekha" | "Anshumardana" | "Apasavya";
  warfareTypeSanskrit: string;
  description: string;
  victorPlanet: string;
  defeatedPlanet: string;
  victorReason: string;
  mundaneImpact: string;
  natalImpact: string;
}

export interface RatnaParikshaGem {
  planet: string;
  gemstoneName: string;
  sanskritName: string;
  mineralFamily: string;
  primaryColor: string;
  icon: string;
  weightRecommendationRatti: string;
  metal: string;
  wearingFinger: string;
  auspiciousDay: string;
  classicalVedicMantra: string;
  flawsToAvoid: string[];
  virtuesRequired: string[];
  suitability: "Highly Recommended" | "Benefic Secondary" | "Neutral / Prudent" | "Strictly Prohibited";
  justification: string;
}

export interface BrihatSamhitaAnalysis {
  kurmaChakra: {
    sectors: Record<string, KurmaChakraDirection>;
    mostAfflictedDirection: string;
    mostFortifiedDirection: string;
    cosmicSynthesis: string;
  };
  grahaYuddhas: GrahaYuddhaEvent[];
  hasActiveGrahaYuddha: boolean;
  ratnaPariksha: {
    primaryGem: RatnaParikshaGem;
    secondaryGem?: RatnaParikshaGem;
    cautionGems: RatnaParikshaGem[];
    allGems: RatnaParikshaGem[];
    masterGemGuidance: string;
  };
  environmentalMundane: {
    elementalDominance: "Agni (Fire)" | "Prithvi (Earth)" | "Vayu (Air)" | "Jala (Water)";
    vayuMandalaStatus: string;
    dakargalaGroundWaterIndex: number;
    dakargalaWaterVerdict: string;
    nimittaSignatures: string[];
  };
  masterBrihatSamhitaSynthesis: string;
}
