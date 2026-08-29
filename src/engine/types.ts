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

export interface ParijataYoga {
  yogaName: string;
  sanskritName: string;
  category: "Parijata Raja Yoga" | "Mahapurusha Yoga" | "Parijata Dhana Yoga" | "Parijata Jnana Yoga";
  isFormed: boolean;
  participatingPlanets: string[];
  description: string;
  classicalShlokaEffect: string;
  adhyayaRef: string;
}

export interface ParijataKhareshNavamsha {
  navamsha64Moon: { signName: string; navamshaIndex: number; degreeRange: string; lord: string };
  navamsha64Lagna: { signName: string; navamshaIndex: number; degreeRange: string; lord: string };
  drekkana22Kharesh: { signName: string; drekkanaIndex: number; khareshLord: string; vulnerabilityHouse: number };
  gulika: { longitude: number; signName: string; house: number; rashiLord: string };
  protectionGuidelines: string;
}

export interface ParijataKalachakra {
  group: "Savya (Direct Cycle)" | "Apasavya (Reverse Cycle)";
  dehaRashi: string;
  dehaLord: string;
  jeevaRashi: string;
  jeevaLord: string;
  dehaAfflicted: boolean;
  jeevaAfflicted: boolean;
  vitalityAlert: string;
}

export interface ParijataBhavaMastery {
  bhavaNum: number; // 1 to 12
  sanskritTitle: string;
  signName: string;
  lordName: string;
  lordPlacementHouse: number;
  occupants: string[];
  parijataScore: number; // 0-100%
  masteryGrade: "Uttama Parijata" | "Madhyama Parijata" | "Alpa Parijata";
  classicalPhala: string;
  adhyayaCitation: string;
}

export interface JatakaParijataAnalysis {
  shodashaYogas: ParijataYoga[];
  khareshAndNavamsha: ParijataKhareshNavamsha;
  kalachakraDiagnostics: ParijataKalachakra;
  bhavaMastery: ParijataBhavaMastery[];
  masterParijataSynthesis: string;
}

export interface SaravaliYoga {
  yogaName: string;
  sanskritName: string;
  category: "Maharaja Yoga" | "Vasumati / Dhana Yoga" | "Adhi Yoga" | "Chandra Yoga";
  isFormed: boolean;
  participatingPlanets: string[];
  description: string;
  classicalShlokaEffect: string;
  adhyayaRef: string;
}

export interface SaravaliConjunction {
  conjunctionType: "2-Planet (Dwi-Graha)" | "3-Planet (Tri-Graha)" | "4-Planet (Chatur-Graha)";
  planets: string[];
  house: number;
  signName: string;
  yogaTitle: string;
  saravaliPhala: string;
  adhyayaCitation: string;
}

export interface SaravaliStriJataka {
  trimsamshaLord: string;
  trimsamshaSign: string;
  trimsamshaNature: string;
  vishaKanyaDetected: boolean;
  vishaKanyaBhanga: boolean;
  maritalAndMoralDisposition: string;
}

export interface SaravaliBhavaPotency {
  bhavaNum: number; // 1 to 12
  sanskritTitle: string;
  signName: string;
  lordName: string;
  lordPlacementHouse: number;
  occupants: string[];
  saravaliScore: number; // 0-100%
  royalGrade: "Maharaja Grade (Uttama)" | "Samanta Grade (Madhyama)" | "Alpa Grade (Heena)";
  classicalPhala: string;
  adhyayaCitation: string;
}

export interface SaravaliAnalysis {
  royalYogas: SaravaliYoga[];
  conjunctions: SaravaliConjunction[];
  striJataka: SaravaliStriJataka;
  bhavaPotency: SaravaliBhavaPotency[];
  masterSaravaliSynthesis: string;
}

export interface PhaladeepikaViparitaYoga {
  yogaName: "Harsha Yoga" | "Sarala Yoga" | "Vimala Yoga";
  sanskritName: string;
  houseLord: number; // 6, 8, 12
  placementHouse: number; // 6, 8, 12
  planetName: string;
  isFormed: boolean;
  description: string;
  classicalShlokaEffect: string;
  adhyayaCitation: string;
}

export interface PhaladeepikaNeechaBhanga {
  debilitatedPlanet: string;
  debilitatedSign: string;
  isCancelled: boolean;
  cancellationConditionsMet: string[];
  rajaYogaGrade: "Purna Neecha Bhanga Raja Yoga" | "Partial Neecha Bhanga" | "Uncancelled Debility";
  classicalPhala: string;
}

export interface PhaladeepikaAvastha {
  planetName: string;
  avasthaName: "Deepta (Exalted)" | "Dina (Debilitated)" | "Svastha (Own Sign)" | "Mudita (Friendly Sign)" | "Shanta (Benefic Vargas)" | "Shakta (Retrograde)" | "Peedita (Afflicted/Combust)" | "Khala (Inimical Sign)";
  sanskritName: string;
  potencyPercentage: number;
  functionalEffect: string;
}

export interface PhaladeepikaBhavaMastery {
  bhavaNum: number; // 1 to 12
  sanskritTitle: string;
  signName: string;
  lordName: string;
  lordPlacementHouse: number;
  occupants: string[];
  phaladeepikaScore: number; // 0-100%
  masteryGrade: "Uttama Phaladeepika" | "Madhyama Phaladeepika" | "Alpa Phaladeepika";
  classicalPhala: string;
  adhyayaCitation: string;
}

export interface PhaladeepikaAnalysis {
  viparitaRajaYogas: PhaladeepikaViparitaYoga[];
  neechaBhangaYogas: PhaladeepikaNeechaBhanga[];
  planetaryAvasthas: PhaladeepikaAvastha[];
  bhavaMastery: PhaladeepikaBhavaMastery[];
  masterPhaladeepikaSynthesis: string;
}

export interface PrasnaTriLagna {
  udayaSign: string;
  udayaSignIdx: number;
  arudhaSign: string;
  arudhaSignIdx: number;
  chatraSign: string;
  chatraSignIdx: number;
  veedhiRashi: string;
  relationship: string;
}

export interface PrasnaPanchaSutra {
  sutraName: "Jeeva Sutra" | "Roga Sutra" | "Mrityu Sutra" | "Utpanna Sutra" | "Nashana Sutra";
  sanskritName: string;
  status: "Active (Formed)" | "Inactive";
  isFavorable: boolean;
  diagnosticVerdict: string;
  classicalShloka: string;
}

export interface PrasnaAshtamangala {
  ashtamangalaNumber: number; // 1 to 8 / 1 to 108
  auspiciousScore: number; // 0 to 100%
  devaDoshaDetected: boolean;
  devaDoshaDetails: string;
  abhicharaDetected: boolean;
  abhicharaDetails: string;
  deepaLakshana: string; // Flame diagnostic
  keralaParihara: string;
}

export interface PrasnaBhavaVerdict {
  bhavaNum: number; // 1 to 12
  queryTopic: string;
  sanskritTitle: string;
  arudhaLordName: string;
  arudhaLordHouse: number;
  successProbability: number; // 0-100%
  verdict: "Immediate Fulfillment (शीघ्र फल)" | "Delayed Success with Effort (विलम्ब फल)" | "Adverse / High Obstacles (कष्ट फल)";
  timingWindow: string;
  classicalShlokaPhala: string;
}

export interface PrasnaMargaAnalysis {
  triLagnas: PrasnaTriLagna;
  panchaSutras: PrasnaPanchaSutra[];
  ashtamangala: PrasnaAshtamangala;
  bhavaVerdicts: PrasnaBhavaVerdict[];
  masterPrasnaVerdict: string;
}

export interface SamhitaCabinet {
  kingPlanet: string; // Raja
  kingEffect: string;
  ministerPlanet: string; // Mantri
  ministerEffect: string;
  commanderPlanet: string; // Senadhipati
  commanderEffect: string;
  sasyeshaPlanet: string; // Agriculture lord
  sasyeshaEffect: string;
  governingYearRuler: string;
}

export interface SamhitaVarshaAstrometeorology {
  rainfallScore: number; // 0-100%
  precipitationGrade: "Abundant Monsoon (अतिवृष्टि)" | "Normal Bountiful (सुवृष्टि)" | "Moderate Selective (मध्यम)" | "Deficit Drought Risk (अनावृष्टि)";
  meghaGarbhaStatus: string;
  rohiniIngressEffect: string;
  ardraIngressEffect: string;
  classicalShloka: string;
}

export interface SamhitaSeismicMandala {
  mandalaName: "Vayavya Mandala (Wind)" | "Agneya Mandala (Fire/Volcanic)" | "Varuna Mandala (Water/Hydrological)" | "Aindra Mandala (Tectonic)";
  sanskritTitle: string;
  governingPlanets: string[];
  riskLevel: "High Alert" | "Elevated Risk" | "Low / Serene";
  geographicVulnerability: string;
  phenomenonDescription: string;
}

export interface SamhitaCommodityTrend {
  commodityName: string; // Gold, Silver, Crude Oil, Grains, Copper, Tech
  governingPlanet: string;
  trend: "Strongly Bullish (तेजी / Rises)" | "Mild Uptrend (स्थिर लाभ)" | "Bearish (मंदी / Drops)" | "Volatile (चंचल)";
  projectedPriceFactor: number;
  classicalArghaReasoning: string;
}

export interface SamhitaSkandhaAnalysis {
  planetaryCabinet: SamhitaCabinet;
  varshaAstrology: SamhitaVarshaAstrometeorology;
  seismicMandalas: SamhitaSeismicMandala[];
  arghaCommodities: SamhitaCommodityTrend[];
  masterSamhitaSynthesis: string;
}

export interface SanketanidhiBhavaVitality {
  bhavaNum: number; // 1 to 12
  sanskritTitle: string;
  signName: string;
  lordName: string;
  vridhiScore: number; // 0 to 100%
  nashanaScore: number; // 0 to 100%
  status: "Brimming Vridhi (पूर्ण वृद्धि)" | "Balanced Growth (सम वृद्धि)" | "Vulnerable / Nashana (भाव क्षय)";
  anatomicalZone: string;
  classicalSanketaShloka: string;
}

export interface SanketanidhiMedicalTridosha {
  vataPercentage: number;
  pittaPercentage: number;
  kaphaPercentage: number;
  dominantDosha: "Vata (वात)" | "Pitta (पित्त)" | "Kapha (कफ)" | "Vata-Pitta (वात-पित्त)" | "Pitta-Kapha (पित्त-कफ)" | "Tridoshic Balanced (समदोष)";
  vulnerableOrgans: string[];
  ayurvedicParihara: string;
}

export interface SanketanidhiAyurdaya {
  longevityTier: "Purnayu (Long Life: 67-100+ Years)" | "Madhyayu (Middle Life: 33-66 Years)" | "Alpayu (Short Life: 0-32 Years)";
  vitalityIndex: number; // 0-100%
  marakaLords: string[];
  longevityAnalysis: string;
}

export interface SanketanidhiArishtaShield {
  shieldName: string;
  sanskritName: string;
  isActive: boolean;
  potencyScore: number; // 0-100%
  protectiveEffect: string;
  sanketaCitation: string;
}

export interface SanketanidhiAnalysis {
  bhavaVitality: SanketanidhiBhavaVitality[];
  medicalDiagnostics: SanketanidhiMedicalTridosha;
  ayurdayaLongevity: SanketanidhiAyurdaya;
  arishtaBhangaShields: SanketanidhiArishtaShield[];
  masterSanketanidhiSynthesis: string;
}











