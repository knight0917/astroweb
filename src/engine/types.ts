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

export interface NadiAmshaInfo {
  index: number; // 1 to 150
  name: string;
  sanskritName: string;
  degreeStart: number;
  degreeEnd: number;
  degreeInSign: number;
  halfBhaga: "Purvabhaga" | "Uttarabhaga";
  halfBhagaSanskrit: string;
  rulingDeity: string;
  nature: "Auspicious (Shubha)" | "Neutral (Mishra)" | "Challenging (Kshudra)";
  archetype: string;
  classicalSutra: string;
  careerAndWealthPhala: string;
  karmicLesson: string;
}

export interface DevaKeralamPlanetNadi {
  planet: string;
  signName: string;
  degreeInSign: number;
  nadiAmsha: NadiAmshaInfo;
}

export interface NadiTransitTrigger {
  transitPlanet: string;
  natalPoint: string;
  status: "Active Direct Transit" | "Approaching" | "Dormant";
  karmicEffect: string;
  shantiRemedy: string;
}

export interface DevaKeralamAnalysis {
  lagnaNadi: NadiAmshaInfo;
  moonNadi: NadiAmshaInfo;
  sunNadi: NadiAmshaInfo;
  planetsNadi: Record<string, DevaKeralamPlanetNadi>;
  activeTransitTriggers: NadiTransitTrigger[];
  dhanaYogas: string[];
  rajaYogas: string[];
  kulaAndVamshaPhala: string;
  ayurdayaInsight: string;
  masterDevaKeralamSynthesis: string;
}

export interface SukaNadiKarakaBlend {
  karakaName: string; // e.g. "Jeeva Karaka (Jupiter)"
  planet: string;
  signName: string;
  degrees: number;
  conjoinedPlanets: string[];
  trinePlanets: string[]; // 1-5-9
  secondHousePlanets: string[]; // 2nd (feeder)
  twelfthHousePlanets: string[]; // 12th (obstacle/subconscious)
  seventhHousePlanets: string[]; // 7th (opposition/mirror)
  synthesis: string;
  primaryArchetype: string;
  careerAndDestinyImpact: string;
}

export interface SukaDirectionalTrine {
  direction: "East (Dharma / Fire)" | "South (Artha / Earth)" | "West (Kama / Air)" | "North (Moksha / Water)";
  sanskritName: string;
  signs: string[];
  planetsPresent: string[];
  dominantPlanet: string;
  strengthScore: number;
  lifeSignification: string;
}

export interface SukaPastLifeKarma {
  karmaPattern: string;
  sanskritTitle: string;
  primaryPlanetaryCause: string;
  manifestationInPresentLife: string;
  classicalSukaParihara: string;
}

export interface SukaAgeCycle {
  ageWindow: string;
  cycleType: "Jupiter 12-Year Round" | "Saturn 30-Year Round";
  activatedHouses: string;
  karmicMilestone: string;
  guidance: string;
}

export interface SukaNadiAnalysis {
  jeevaKaraka: SukaNadiKarakaBlend;
  karmaKaraka: SukaNadiKarakaBlend;
  bhogaKaraka: SukaNadiKarakaBlend;
  otherKarakas: Record<string, SukaNadiKarakaBlend>;
  directionalTrines: SukaDirectionalTrine[];
  pastLifeKarma: SukaPastLifeKarma[];
  ageCycles: SukaAgeCycle[];
  specialYogas: string[];
  masterSukaSynthesis: string;
}

export interface JaiminiKarakamshaBhava {
  bhavaNum: number; // 1 to 12
  signName: string;
  planetsPresent: string[];
  aspectingPlanets: string[]; // Rashi Drishti
  signification: string;
  sutraPhala: string;
}

export interface JaiminiIshtaDevata {
  twelfthSignFromKL: string;
  occupyingPlanets: string[];
  aspectingPlanets: string[];
  primaryIshtaPlanet: string;
  ishtaDevataName: string;
  dharmaDevataName: string;
  mantraRecommendation: string;
  spiritualPath: string;
}

export interface JaiminiCharaDashaPeriod {
  signName: string;
  durationYears: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  lord: string;
  keySignifications: string;
}

export interface JaiminiLongevityAnalysis {
  pair1Verdict: "Alpayu (Short)" | "Madhyayu (Medium)" | "Purnayu (Long)";
  pair2Verdict: "Alpayu (Short)" | "Madhyayu (Medium)" | "Purnayu (Long)";
  pair3Verdict: "Alpayu (Short)" | "Madhyayu (Medium)" | "Purnayu (Long)";
  compositeLongevity: "Alpayu (0-32 Years)" | "Madhyayu (33-66 Years)" | "Purnayu (67-100+ Years)";
  rudraGraha: string;
  brahmaGraha: string;
  maheshwaraGraha: string;
  longevitySummary: string;
}

export interface JaiminiUpapadaAnalysis {
  upapadaSign: string;
  secondFromUpapadaSign: string;
  beneficAspectsToUL: string[];
  maleficAspectsToUL: string[];
  maritalHarmonyScore: number; // 0-100
  spouseProfile: string;
  maritalLongevityVerdict: string;
  jaiminiRemedies: string;
}

export interface JaiminiSutrasCompleteAnalysis {
  atmakarakaPlanet: string;
  amatyakarakaPlanet: string;
  karakamshaSign: string;
  swamshaSign: string;
  karakamshaBhavas: JaiminiKarakamshaBhava[];
  ishtaDevata: JaiminiIshtaDevata;
  charaDasha: {
    activeMahadasha: JaiminiCharaDashaPeriod;
    activeAntardasha?: JaiminiCharaDashaPeriod;
    periods: JaiminiCharaDashaPeriod[];
    progressionDirection: "Direct (Savya)" | "Indirect (Apasavya)";
  };
  longevity: JaiminiLongevityAnalysis;
  upapada: JaiminiUpapadaAnalysis;
  jaiminiRajaYogas: string[];
  masterJaiminiSynthesis: string;
}

export interface GayatriAksharaInfo {
  index: number; // 1 to 24
  syllable: string; // e.g. "तत् (Tat)"
  padaNumber: 1 | 2 | 3;
  presidingDeity: string;
  presidingRishi: string;
  tattwa: string;
  associatedRashiIndex: number;
  associatedRashiName: string;
  planetsPresent: string[];
  spiritualSignification: string;
}

export interface GrahaGayatriMantra {
  planetName: string;
  sanskritMantra: string;
  englishTransliteration: string;
  afflictionScore: number; // 0-100
  afflictionReason: string;
  recommendedDailyMalas: number;
  presidingDevata: string;
  therapeuticEffect: string;
}

export interface KoshaDiagnostic {
  koshaName: "Annamaya" | "Pranamaya" | "Manomaya" | "Vijnanamaya" | "Anandamaya";
  sanskritTitle: string;
  governingPlanets: string[];
  vitalityScore: number; // 0-100%
  pranicStatus: "Fortified" | "Balanced" | "Depleted";
  harmonizationGuidance: string;
}

export interface GayatriAnushthanaPlan {
  recommendedAnushthana: "Laghu Gayatri Anushthana (24,000 Japa)" | "Maha Gayatri Anushthana (125,000 Japa)" | "Daily Nitya Gayatri Sandhya";
  targetJapaCount: number;
  dailyMalaCount: number;
  durationDays: number;
  optimalSandhyaTiming: string;
  suryaArghyaGuidance: string;
  savitaMeditationVisualization: string;
  recommendedKavacham: string;
}

export interface GayatriJyotishAnalysis {
  personalAkshara: GayatriAksharaInfo;
  savitaSolarResonanceScore: number; // 0-100%
  aksharaMatrix: GayatriAksharaInfo[];
  grahaGayatris: GrahaGayatriMantra[];
  koshaDiagnostics: KoshaDiagnostic[];
  anushthanaPlan: GayatriAnushthanaPlan;
  masterGayatriSynthesis: string;
}

export interface JatakaAlankaraBhava {
  bhavaNum: number; // 1 to 12
  sanskritTitle: string;
  signName: string;
  lordName: string;
  lordPlacementHouse: number;
  occupants: string[];
  aspectingPlanets: string[];
  alankaraScore: number; // 0-100%
  ornamentationGrade: "Uttama (Supreme)" | "Madhyama (Moderate)" | "Alpa (Modest)";
  classicalPhala: string;
  shlokaReference: string;
}

export interface JatakaAlankaraYoga {
  yogaName: string;
  sanskritName: string;
  category: "Raja Yoga" | "Dhana Yoga" | "Jnana Yoga" | "Arishta Yoga";
  isFormed: boolean;
  participatingPlanets: string[];
  description: string;
  classicalShlokaEffect: string;
}

export interface JatakaAlankaraDisease {
  diseaseCategory: "Netra Roga (Vision)" | "Hridaya Roga (Cardiac)" | "Udara Roga (Digestive)" | "Asthi/Sandhi (Bone/Joints)" | "Vata/Pitta/Kapha";
  vulnerabilityLevel: "Low" | "Moderate" | "Elevated";
  astrologicalCause: string;
  classicalRemedy: string;
}

export interface JatakaAlankaraMarital {
  saubhagyaScore: number; // 0-100%
  spouseCharacter: string;
  maritalProsperityVerdict: string;
  progenyProspects: string;
  ganeshKaviRemedy: string;
}

export interface JatakaAlankaraAnalysis {
  strongestBhava: JatakaAlankaraBhava;
  bhavaAlankaras: JatakaAlankaraBhava[];
  specialYogas: JatakaAlankaraYoga[];
  diseaseDiagnostics: JatakaAlankaraDisease[];
  maritalFortune: JatakaAlankaraMarital;
  masterAlankaraSynthesis: string;
}

export interface JatakNirnayBhavaJudgement {
  bhavaNum: number; // 1 to 12
  sanskritTitle: string;
  part: "Part 1 (Bhavas 1-6)" | "Part 2 (Bhavas 7-12)";
  signName: string;
  lordName: string;
  lordPlacementHouse: number;
  primaryKaraka: string;
  bhavaScore: number; // 0-100% (30% weight)
  lordScore: number; // 0-100% (40% weight)
  karakaScore: number; // 0-100% (30% weight)
  compositeRamanScore: number; // 0-100%
  potencyGrade: "Uttama (Supreme)" | "Madhyama (Moderate)" | "Heena (Depleted)";
  vriddhiNashaStatus: "Bhava Vriddhi (Flourishing)" | "Bhava Samanya (Balanced)" | "Bhava Nasha (Afflicted)";
  kartariStatus: "Shubha Kartari" | "Papa Kartari" | "Neutral";
  occupants: string[];
  aspectingPlanets: string[];
  lifePredictions: string;
  ramanRemedy: string;
}

export interface JatakNirnayKartari {
  targetType: "Bhava" | "Lord";
  targetIndex: number;
  targetName: string;
  kartariType: "Shubha Kartari" | "Papa Kartari";
  planets2nd: string[];
  planets12th: string[];
  effect: string;
}

export interface JatakNirnayVriddhiNasha {
  bhavaNum: number;
  sanskritTitle: string;
  status: "Bhava Vriddhi (Flourishing)" | "Bhava Nasha (Afflicted)";
  astrologicalBasis: string;
  realWorldImpact: string;
}

export interface JatakNirnayAnalysis {
  strongestBhava: JatakNirnayBhavaJudgement;
  weakestBhava: JatakNirnayBhavaJudgement;
  bhavaJudgements: JatakNirnayBhavaJudgement[];
  kartariYogas: JatakNirnayKartari[];
  vriddhiNashaSummaries: JatakNirnayVriddhiNasha[];
  masterNirnaySynthesis: string;
}





