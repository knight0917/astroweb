import { RashiInfo, NakshatraInfo, GeoLocation } from "./types";

export const RASHI_NAMES: Omit<RashiInfo, "degreesInSign">[] = [
  { index: 0, sanskritName: "Mesha", englishName: "Aries", symbol: "♈", lord: "Mars", element: "Fire" },
  { index: 1, sanskritName: "Vrishabha", englishName: "Taurus", symbol: "♉", lord: "Venus", element: "Earth" },
  { index: 2, sanskritName: "Mithuna", englishName: "Gemini", symbol: "♊", lord: "Mercury", element: "Air" },
  { index: 3, sanskritName: "Karka", englishName: "Cancer", symbol: "♋", lord: "Moon", element: "Water" },
  { index: 4, sanskritName: "Simha", englishName: "Leo", symbol: "♌", lord: "Sun", element: "Fire" },
  { index: 5, sanskritName: "Kanya", englishName: "Virgo", symbol: "♍", lord: "Mercury", element: "Earth" },
  { index: 6, sanskritName: "Tula", englishName: "Libra", symbol: "♎", lord: "Venus", element: "Air" },
  { index: 7, sanskritName: "Vrischika", englishName: "Scorpio", symbol: "♏", lord: "Mars", element: "Water" },
  { index: 8, sanskritName: "Dhanu", englishName: "Sagittarius", symbol: "♐", lord: "Jupiter", element: "Fire" },
  { index: 9, sanskritName: "Makara", englishName: "Capricorn", symbol: "♑", lord: "Saturn", element: "Earth" },
  { index: 10, sanskritName: "Kumbha", englishName: "Aquarius", symbol: "♒", lord: "Saturn", element: "Air" },
  { index: 11, sanskritName: "Meena", englishName: "Pisces", symbol: "♓", lord: "Jupiter", element: "Water" },
];

export const NAKSHATRA_NAMES: Omit<NakshatraInfo, "pada" | "degreesInNakshatra" | "padaDegrees">[] = [
  { index: 0, sanskritName: "Ashwini", lord: "Ketu", deity: "Ashvini Kumaras", animal: "Horse", animalSymbol: "🐴" },
  { index: 1, sanskritName: "Bharani", lord: "Venus", deity: "Yama", animal: "Elephant", animalSymbol: "🐘" },
  { index: 2, sanskritName: "Krittika", lord: "Sun", deity: "Agni", animal: "Sheep / Goat", animalSymbol: "🐏" },
  { index: 3, sanskritName: "Rohini", lord: "Moon", deity: "Brahma", animal: "Serpent", animalSymbol: "🐍" },
  { index: 4, sanskritName: "Mrigashira", lord: "Mercury", deity: "Soma", animal: "Serpent", animalSymbol: "🐍" },
  { index: 5, sanskritName: "Ardra", lord: "Rahu", deity: "Rudra", animal: "Dog", animalSymbol: "🐕" },
  { index: 6, sanskritName: "Punarvasu", lord: "Jupiter", deity: "Aditi", animal: "Cat", animalSymbol: "🐈" },
  { index: 7, sanskritName: "Pushya", lord: "Saturn", deity: "Brihaspati", animal: "Goat / Ram", animalSymbol: "🐐" },
  { index: 8, sanskritName: "Ashlesha", lord: "Mercury", deity: "Nagas", animal: "Cat", animalSymbol: "🐈" },
  { index: 9, sanskritName: "Magha", lord: "Ketu", deity: "Pitris", animal: "Rat", animalSymbol: "🐀" },
  { index: 10, sanskritName: "Purva Phalguni", lord: "Venus", deity: "Bhaga", animal: "Rat", animalSymbol: "🐀" },
  { index: 11, sanskritName: "Uttara Phalguni", lord: "Sun", deity: "Aryaman", animal: "Bull / Cow", animalSymbol: "🐂" },
  { index: 12, sanskritName: "Hasta", lord: "Moon", deity: "Savitr", animal: "Buffalo", animalSymbol: "🐃" },
  { index: 13, sanskritName: "Chitra", lord: "Mars", deity: "Vishwakarma", animal: "Tiger", animalSymbol: "🐅" },
  { index: 14, sanskritName: "Swati", lord: "Rahu", deity: "Vayu", animal: "Buffalo", animalSymbol: "🐃" },
  { index: 15, sanskritName: "Vishakha", lord: "Jupiter", deity: "Indra & Agni", animal: "Tiger", animalSymbol: "🐅" },
  { index: 16, sanskritName: "Anuradha", lord: "Saturn", deity: "Mitra", animal: "Deer", animalSymbol: "🦌" },
  { index: 17, sanskritName: "Jyeshtha", lord: "Mercury", deity: "Indra", animal: "Deer", animalSymbol: "🦌" },
  { index: 18, sanskritName: "Mula", lord: "Ketu", deity: "Nirriti", animal: "Dog", animalSymbol: "🐕" },
  { index: 19, sanskritName: "Purva Ashadha", lord: "Venus", deity: "Apas", animal: "Monkey", animalSymbol: "🐒" },
  { index: 20, sanskritName: "Uttara Ashadha", lord: "Sun", deity: "Vishvadevas", animal: "Mongoose", animalSymbol: "🦡" },
  { index: 21, sanskritName: "Shravana", lord: "Moon", deity: "Vishnu", animal: "Monkey", animalSymbol: "🐒" },
  { index: 22, sanskritName: "Dhanishta", lord: "Mars", deity: "Eight Vasus", animal: "Lion", animalSymbol: "🦁" },
  { index: 23, sanskritName: "Shatabhisha", lord: "Rahu", deity: "Varuna", animal: "Horse", animalSymbol: "🐴" },
  { index: 24, sanskritName: "Purva Bhadrapada", lord: "Jupiter", deity: "Aja Ekapada", animal: "Lion", animalSymbol: "🦁" },
  { index: 25, sanskritName: "Uttara Bhadrapada", lord: "Saturn", deity: "Ahirbudhnya", animal: "Cow", animalSymbol: "🐄" },
  { index: 26, sanskritName: "Revati", lord: "Mercury", deity: "Pushan", animal: "Elephant", animalSymbol: "🐘" },
];

export const GRAHA_METADATA: Record<string, { sanskritName: string; symbol: string; color: string; isModern?: boolean }> = {
  Sun: { sanskritName: "Surya", symbol: "☉", color: "#FFB300" },
  Moon: { sanskritName: "Chandra", symbol: "☽", color: "#E0E0E0" },
  Mars: { sanskritName: "Mangala", symbol: "♂", color: "#E53935" },
  Mercury: { sanskritName: "Budha", symbol: "☿", color: "#43A047" },
  Jupiter: { sanskritName: "Guru", symbol: "♃", color: "#FFD54F" },
  Venus: { sanskritName: "Shukra", symbol: "♀", color: "#F06292" },
  Saturn: { sanskritName: "Shani", symbol: "♄", color: "#5C6BC0" },
  Rahu: { sanskritName: "Rahu", symbol: "☊", color: "#78909C" },
  Ketu: { sanskritName: "Ketu", symbol: "☋", color: "#8D6E63" },
  Uranus: { sanskritName: "Harshala", symbol: "♅", color: "#00ACC1", isModern: true },
  Neptune: { sanskritName: "Varuna", symbol: "♆", color: "#1E88E5", isModern: true },
  Pluto: { sanskritName: "Yama", symbol: "♇", color: "#9C27B0", isModern: true },
};

export const TITHI_NAMES = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima / Amavasya"
];

export const YOGA_NAMES = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
  "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva",
  "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan",
  "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
  "Brahma", "Indra", "Vaidhriti"
];

export const KARANA_NAMES = [
  "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti (Bhadra)",
  "Shakuni", "Chatushpada", "Naga", "Kintughna"
];

export const POPULAR_CITIES: GeoLocation[] = [
  { cityName: "Allahabad (Prayagraj)", country: "India", latitude: 25.4358, longitude: 81.8463, elevation: 98, timezoneOffsetHours: 5.5 },
  { cityName: "Varanasi (Kashi)", country: "India", latitude: 25.3176, longitude: 82.9739, elevation: 80, timezoneOffsetHours: 5.5 },
  { cityName: "Ujjain (Mahakal)", country: "India", latitude: 23.1765, longitude: 75.7885, elevation: 494, timezoneOffsetHours: 5.5 },
  { cityName: "Ayodhya", country: "India", latitude: 26.7922, longitude: 82.1998, elevation: 102, timezoneOffsetHours: 5.5 },
  { cityName: "Mathura", country: "India", latitude: 27.4924, longitude: 77.6737, elevation: 174, timezoneOffsetHours: 5.5 },
  { cityName: "Haridwar", country: "India", latitude: 29.9457, longitude: 78.1642, elevation: 314, timezoneOffsetHours: 5.5 },
  { cityName: "Rishikesh", country: "India", latitude: 30.0869, longitude: 78.2676, elevation: 372, timezoneOffsetHours: 5.5 },
  { cityName: "Tirupati", country: "India", latitude: 13.6288, longitude: 79.4192, elevation: 161, timezoneOffsetHours: 5.5 },
  { cityName: "Puri (Jagannath)", country: "India", latitude: 19.8135, longitude: 85.8312, elevation: 10, timezoneOffsetHours: 5.5 },
  { cityName: "Rameswaram", country: "India", latitude: 9.2876, longitude: 79.3129, elevation: 10, timezoneOffsetHours: 5.5 },
  { cityName: "Dwarka", country: "India", latitude: 22.2394, longitude: 68.9678, elevation: 7, timezoneOffsetHours: 5.5 },
  { cityName: "New Delhi", country: "India", latitude: 28.6139, longitude: 77.2090, elevation: 216, timezoneOffsetHours: 5.5 },
  { cityName: "Mumbai", country: "India", latitude: 19.0760, longitude: 72.8777, elevation: 14, timezoneOffsetHours: 5.5 },
  { cityName: "Bengaluru", country: "India", latitude: 12.9716, longitude: 77.5946, elevation: 920, timezoneOffsetHours: 5.5 },
  { cityName: "Kolkata", country: "India", latitude: 22.5726, longitude: 88.3639, elevation: 9, timezoneOffsetHours: 5.5 },
  { cityName: "Chennai", country: "India", latitude: 13.0827, longitude: 80.2707, elevation: 6, timezoneOffsetHours: 5.5 },
  { cityName: "Hyderabad", country: "India", latitude: 17.3850, longitude: 78.4867, elevation: 542, timezoneOffsetHours: 5.5 },
  { cityName: "Pune", country: "India", latitude: 18.5204, longitude: 73.8567, elevation: 560, timezoneOffsetHours: 5.5 },
  { cityName: "Ahmedabad", country: "India", latitude: 23.0225, longitude: 72.5714, elevation: 53, timezoneOffsetHours: 5.5 },
  { cityName: "Jaipur", country: "India", latitude: 26.9124, longitude: 75.7873, elevation: 431, timezoneOffsetHours: 5.5 },
  { cityName: "Lucknow", country: "India", latitude: 26.8467, longitude: 80.9462, elevation: 123, timezoneOffsetHours: 5.5 },
  { cityName: "Patna", country: "India", latitude: 25.5941, longitude: 85.1376, elevation: 53, timezoneOffsetHours: 5.5 },
  { cityName: "Kathmandu", country: "Nepal", latitude: 27.7172, longitude: 85.3240, elevation: 1400, timezoneOffsetHours: 5.75 },
  { cityName: "London", country: "United Kingdom", latitude: 51.5074, longitude: -0.1278, elevation: 11, timezoneOffsetHours: 0.0 },
  { cityName: "New York", country: "United States", latitude: 40.7128, longitude: -74.0060, elevation: 10, timezoneOffsetHours: -5.0 },
  { cityName: "San Francisco", country: "United States", latitude: 37.7749, longitude: -122.4194, elevation: 16, timezoneOffsetHours: -8.0 },
  { cityName: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503, elevation: 44, timezoneOffsetHours: 9.0 },
  { cityName: "Dubai", country: "UAE", latitude: 25.2048, longitude: 55.2708, elevation: 5, timezoneOffsetHours: 4.0 },
  { cityName: "Singapore", country: "Singapore", latitude: 1.3521, longitude: 103.8198, elevation: 15, timezoneOffsetHours: 8.0 },
  { cityName: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093, elevation: 3, timezoneOffsetHours: 10.0 },
  { cityName: "Cairo", country: "Egypt", latitude: 30.0444, longitude: 31.2357, elevation: 23, timezoneOffsetHours: 2.0 },
  { cityName: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522, elevation: 35, timezoneOffsetHours: 1.0 },
];

export const RASHIS = RASHI_NAMES;
export const NAKSHATRAS = NAKSHATRA_NAMES;
export const PLANET_METADATA = GRAHA_METADATA;