/**
 * Classical Vedic Name Decoding & Svara Jyotish Engine
 * References:
 * - Brihat Parashara Hora Shastra (BPHS Ch. 3 & Deha Rupa Adhyaya)
 * - Svara Shastra & Varna Mandala (Akshara Matrika)
 * - Avakahada Chakra (108 Nakshatra Pada Syllables)
 * - Saravali & Jatakalankara
 * - Bhrigu Nandi Nadi (Spouse & Lineage Name Prediction)
 */

import { EphemerisResult } from "./types";
import { RASHI_NAMES } from "./constants";

export interface NakshatraPadaSyllable {
  nakshatraIndex: number;
  nakshatraName: string;
  pada: number;
  sanskritSyllable: string;
  englishSyllable: string;
  exampleNames: string[];
}

export interface PlanetaryVarnaGroup {
  planet: string;
  sanskritVarga: string;
  varnaType: string;
  letters: string[];
  description: string;
}

export interface VedicNameAnalysisResult {
  // 1. Sacred Soul / Sankalpa Name (Chandra Nakshatra Matrix)
  janmaNakshatraName: string;
  janmaNakshatraPada: number;
  janmaSyllableSanskrit: string;
  janmaSyllableEnglish: string;
  janmaExampleNames: string[];
  janmaRashiName: string;

  // 2. Solar Identity & Father's Choice (Surya Nakshatra Matrix)
  suryaNakshatraName: string;
  suryaNakshatraPada: number;
  suryaSyllableEnglish: string;
  suryaVowelResonance: string;

  // 3. Worldly Calling Name Matrix (Svara Jyotish & Lagna Dominance)
  dominantLagnaPlanets: {
    planet: string;
    role: "Lagna Occupant" | "Direct Lagna Aspect" | "Lagna Lord Conjunction" | "Highest Strength Sovereign";
    varnaGroup: PlanetaryVarnaGroup;
    suggestedLetters: string[];
  }[];
  predictedCallingLetters: string[];
  primaryCallingLetterSummary: string;

  // 4. Arudha Lagna (AL) Public Name Vibration
  arudhaLagnaSign: string;
  arudhaLagnaLetters: string[];

  // 5. Spouse Name Prediction (Bhrigu Nandi Nadi Axis)
  spouseKarakaPlanet: string;
  spouse7thHouseSign: string;
  spouse7thLord: string;
  predictedSpouseLetters: string[];
  spouseNamingReasoning: string;

  // Comprehensive Synthesis
  executiveNameSummary: string;
}

// 108 Sacred Nakshatra Pada Syllables (Avakahada Chakra)
export const AVAKAHADA_CHAKRA_SYLLABLES: Record<number, Record<number, { sanskrit: string; english: string; examples: string[] }>> = {
  0: { // Ashwini
    1: { sanskrit: "चू", english: "Chu", examples: ["Chunilal", "Chulbul"] },
    2: { sanskrit: "चे", english: "Che", examples: ["Chetan", "Chetna"] },
    3: { sanskrit: "चो", english: "Cho", examples: ["Chola", "Chandan"] },
    4: { sanskrit: "ला", english: "La", examples: ["Laxman", "Lalit", "Lavanya"] },
  },
  1: { // Bharani
    1: { sanskrit: "ली", english: "Lee / Li", examples: ["Leela", "Lina", "Lipi"] },
    2: { sanskrit: "लू", english: "Loo / Lu", examples: ["Lokesh", "Lubna"] },
    3: { sanskrit: "ले", english: "Le", examples: ["Lekha", "Leena"] },
    4: { sanskrit: "लो", english: "Lo", examples: ["Lokendra", "Lohit"] },
  },
  2: { // Krittika
    1: { sanskrit: "अ", english: "A", examples: ["Amit", "Aman", "Abhishek", "Aditya"] },
    2: { sanskrit: "ई", english: "Ee / I", examples: ["Ishan", "Isha", "Indra"] },
    3: { sanskrit: "उ", english: "U / Oo", examples: ["Utkarsh", "Umang", "Udit", "Ujwal", "Urvashi"] },
    4: { sanskrit: "ए", english: "E / Ae", examples: ["Ekta", "Ehsaan", "Eshan"] },
  },
  3: { // Rohini
    1: { sanskrit: "ओ / रो", english: "O / Ro / R", examples: ["Rohan", "Rohit", "Om", "Omkar", "Roshni"] },
    2: { sanskrit: "वा", english: "Va", examples: ["Varun", "Vandana", "Vasudev"] },
    3: { sanskrit: "वी", english: "Vee / Vi", examples: ["Vivek", "Vinay", "Vikas", "Vidya"] },
    4: { sanskrit: "वू", english: "Vu / Vu", examples: ["Vrindavan", "Vansh"] },
  },
  4: { // Mrigashira
    1: { sanskrit: "वे", english: "Ve", examples: ["Ved", "Vedant", "Venu"] },
    2: { sanskrit: "वो", english: "Vo", examples: ["Vomesh", "Vraj"] },
    3: { sanskrit: "का", english: "Ka", examples: ["Karan", "Kartik", "Kavita", "Kamal"] },
    4: { sanskrit: "की", english: "Kee / Ki", examples: ["Kiran", "Kishore", "Kirti"] },
  },
  5: { // Ardra
    1: { sanskrit: "कु", english: "Ku", examples: ["Kunal", "Kuldip", "Kusum"] },
    2: { sanskrit: "घ", english: "Gha", examples: ["Ghanashyam", "Ghanshyam"] },
    3: { sanskrit: "ङ", english: "Nga", examples: ["Gyan", "Gnanesh"] },
    4: { sanskrit: "छ", english: "Chha", examples: ["Chhavi", "Chhatrasal"] },
  },
  6: { // Punarvasu
    1: { sanskrit: "के", english: "Ke", examples: ["Keshav", "Kedar", "Ketan"] },
    2: { sanskrit: "को", english: "Ko", examples: ["Komal", "Koushal", "Koti"] },
    3: { sanskrit: "हा", english: "Ha", examples: ["Harish", "Harsh", "Hardik"] },
    4: { sanskrit: "ही", english: "Hee / Hi", examples: ["Hitesh", "Himanshu", "Hina"] },
  },
  7: { // Pushya
    1: { sanskrit: "हु", english: "Hu", examples: ["Hukam", "Huma"] },
    2: { sanskrit: "हे", english: "He", examples: ["Hemant", "Hemraj", "Hetvi"] },
    3: { sanskrit: "हो", english: "Ho", examples: ["Hoshang", "Homi"] },
    4: { sanskrit: "डा", english: "Da / D", examples: ["Danvir", "Daksha"] },
  },
  8: { // Ashlesha
    1: { sanskrit: "डी", english: "Dee / Di", examples: ["Dipak", "Divya", "Dinesh"] },
    2: { sanskrit: "डू", english: "Doo / Du", examples: ["Dushyant", "Durgesh"] },
    3: { sanskrit: "डे", english: "De", examples: ["Dev", "Devendra", "Devraj"] },
    4: { sanskrit: "डो", english: "Do", examples: ["Dolraj", "Doulat"] },
  },
  9: { // Magha
    1: { sanskrit: "मा", english: "Ma", examples: ["Manish", "Madhav", "Manav", "Mayank"] },
    2: { sanskrit: "मी", english: "Mee / Mi", examples: ["Milind", "Mihir", "Meera"] },
    3: { sanskrit: "मू", english: "Moo / Mu", examples: ["Mukesh", "Mukul", "Murari"] },
    4: { sanskrit: "मे", english: "Me", examples: ["Mehul", "Medha", "Menka"] },
  },
  10: { // Purva Phalguni
    1: { sanskrit: "मो", english: "Mo", examples: ["Mohit", "Mohan", "Monika"] },
    2: { sanskrit: "टा", english: "Ta / T", examples: ["Tarun", "Tanmay"] },
    3: { sanskrit: "टी", english: "Tee / Ti", examples: ["Tina", "Tikam"] },
    4: { sanskrit: "टू", english: "Too / Tu", examples: ["Tushar", "Tulsi"] },
  },
  11: { // Uttara Phalguni
    1: { sanskrit: "टे", english: "Te", examples: ["Tej", "Tejas", "Tejaswi"] },
    2: { sanskrit: "टो", english: "To", examples: ["Tota", "Toyesh"] },
    3: { sanskrit: "पा", english: "Pa", examples: ["Pankaj", "Parth", "Paras", "Pawan"] },
    4: { sanskrit: "पी", english: "Pee / Pi", examples: ["Piyush", "Pinakin", "Pooja"] },
  },
  12: { // Hasta
    1: { sanskrit: "पू", english: "Pu", examples: ["Puneet", "Punit", "Purushottam"] },
    2: { sanskrit: "ष / श", english: "Sha", examples: ["Sharad", "Shashank", "Shyam"] },
    3: { sanskrit: "ण / न", english: "Na", examples: ["Nand", "Navin", "Naren"] },
    4: { sanskrit: "ठ / ड", english: "Tha / Da", examples: ["Thakur", "Daman"] },
  },
  13: { // Chitra
    1: { sanskrit: "पे", english: "Pe", examples: ["Pema", "Peshal"] },
    2: { sanskrit: "पो", english: "Po", examples: ["Pooja", "Poonam"] },
    3: { sanskrit: "रा", english: "Ra", examples: ["Rahul", "Rakesh", "Raj", "Raghav"] },
    4: { sanskrit: "री", english: "Ree / Ri", examples: ["Rishi", "Ritesh", "Riya"] },
  },
  14: { // Swati
    1: { sanskrit: "रू", english: "Ru", examples: ["Rupesh", "Rudra", "Ruma"] },
    2: { sanskrit: "रे", english: "Re", examples: ["Rekha", "Renuka", "Revati"] },
    3: { sanskrit: "रो", english: "Ro", examples: ["Rohan", "Ronit", "Roshni"] },
    4: { sanskrit: "ता", english: "Taa / Ta", examples: ["Tanvi", "Tarun", "Tanya"] },
  },
  15: { // Vishakha
    1: { sanskrit: "ती", english: "Tee / Ti", examples: ["Tirth", "Tilak", "Titiksha"] },
    2: { sanskrit: "तू", english: "Too / Tu", examples: ["Tushar", "Tulsidas"] },
    3: { sanskrit: "ते", english: "Te", examples: ["Tejas", "Tej"] },
    4: { sanskrit: "तो", english: "To", examples: ["Toran", "Tosh"] },
  },
  16: { // Anuradha
    1: { sanskrit: "ना", english: "Na", examples: ["Naveen", "Naresh", "Namit"] },
    2: { sanskrit: "नी", english: "Nee / Ni", examples: ["Nikhil", "Nitin", "Neeraj"] },
    3: { sanskrit: "नू", english: "Noo / Nu", examples: ["Nupur", "Nutun"] },
    4: { sanskrit: "ने", english: "Ne", examples: ["Neha", "Netrapal"] },
  },
  17: { // Jyeshtha
    1: { sanskrit: "नो", english: "No", examples: ["Nohar", "Nomesh"] },
    2: { sanskrit: "या", english: "Ya", examples: ["Yash", "Yashwant", "Yatindra"] },
    3: { sanskrit: "यी", english: "Yee / Yi", examples: ["Yogesh", "Yatin"] },
    4: { sanskrit: "यू", english: "Yu", examples: ["Yuvraj", "Yug", "Yukti", "Yugank"] },
  },
  18: { // Moola
    1: { sanskrit: "ये", english: "Ye", examples: ["Yenam", "Yedhu"] },
    2: { sanskrit: "यो", english: "Yo", examples: ["Yogesh", "Yogendra", "Yogita"] },
    3: { sanskrit: "भा", english: "Bha", examples: ["Bharat", "Bhaskar", "Bhavna"] },
    4: { sanskrit: "भी", english: "Bhee / Bhi", examples: ["Bhim", "Bhishma", "Bhirgu"] },
  },
  19: { // Purva Ashadha
    1: { sanskrit: "भू", english: "Bhu", examples: ["Bhupendra", "Bhuvnesh", "Bhumika"] },
    2: { sanskrit: "धा", english: "Dha", examples: ["Dhanraj", "Dharmendra", "Dhaval"] },
    3: { sanskrit: "फा", english: "Pha / Fa", examples: ["Phanindra", "Farhan"] },
    4: { sanskrit: "ढा", english: "Dha", examples: ["Dhairya", "Dhananjay"] },
  },
  20: { // Uttara Ashadha
    1: { sanskrit: "भे", english: "Bhe", examples: ["Bheru", "Bhesham"] },
    2: { sanskrit: "भो", english: "Bho", examples: ["Bhoop", "Bholanath"] },
    3: { sanskrit: "जा", english: "Ja", examples: ["Jay", "Janak", "Jagdish"] },
    4: { sanskrit: "जी", english: "Jee / Ji", examples: ["Jitendra", "Jignesh", "Jeevan"] },
  },
  21: { // Shravana
    1: { sanskrit: "खी / जू", english: "Khee / Ju", examples: ["Jugesh", "Juhi"] },
    2: { sanskrit: "खे / जे", english: "Khe / Je", examples: ["Jeevan", "Khemraj"] },
    3: { sanskrit: "खो / जो", english: "Kho / Jo", examples: ["Jogesh", "Jotiram"] },
    4: { sanskrit: "गा", english: "Ga", examples: ["Gaurav", "Ganesh", "Gajendra"] },
  },
  22: { // Dhanishta
    1: { sanskrit: "गा", english: "Ga", examples: ["Gautam", "Garima"] },
    2: { sanskrit: "गी", english: "Gee / Gi", examples: ["Girish", "Gita", "Geet"] },
    3: { sanskrit: "गु", english: "Gu", examples: ["Gulshan", "Gunjal", "Gunwant"] },
    4: { sanskrit: "गे", english: "Ge", examples: ["Geetam", "Genda"] },
  },
  23: { // Shatabhisha
    1: { sanskrit: "गो", english: "Go", examples: ["Gopal", "Govind", "Gokul"] },
    2: { sanskrit: "सा", english: "Sa", examples: ["Sameer", "Sachin", "Sanjay", "Saurabh"] },
    3: { sanskrit: "सी", english: "See / Si", examples: ["Siddharth", "Sita", "Simran"] },
    4: { sanskrit: "सू", english: "Su", examples: ["Sunil", "Suresh", "Sumit", "Sudhir"] },
  },
  24: { // Purva Bhadrapada
    1: { sanskrit: "से", english: "Se", examples: ["Setu", "Semal"] },
    2: { sanskrit: "सो", english: "So", examples: ["Sohan", "Somnath", "Sonu"] },
    3: { sanskrit: "दा", english: "Da", examples: ["Damodar", "Darshan", "Dayanand"] },
    4: { sanskrit: "दी", english: "Dee / Di", examples: ["Deepak", "Dilip", "Divyesh"] },
  },
  25: { // Uttara Bhadrapada
    1: { sanskrit: "दू", english: "Doo / Du", examples: ["Durgesh", "Dushyant"] },
    2: { sanskrit: "थ", english: "Tha", examples: ["Thakur", "Thanesh"] },
    3: { sanskrit: "झ", english: "Jha", examples: ["Jhabbar", "Jhamak"] },
    4: { sanskrit: "ञ / दा", english: "Da / Na", examples: ["Danish", "Dattatreya"] },
  },
  26: { // Revati
    1: { sanskrit: "दे", english: "De", examples: ["Devendra", "Devraj", "Devesh"] },
    2: { sanskrit: "दो", english: "Do", examples: ["Dolraj", "Doulat"] },
    3: { sanskrit: "चा", english: "Cha", examples: ["Chandan", "Chandra", "Charu"] },
    4: { sanskrit: "ची", english: "Chee / Chi", examples: ["Chiranjeev", "Chirag"] },
  },
};

// Svara Jyotish Planetary Phonetic Varna Mandala
export const PLANETARY_VARNA_MANDALA: Record<string, PlanetaryVarnaGroup> = {
  Sun: {
    planet: "Sun",
    sanskritVarga: "Svara Varga (स्वर वर्ग - Vowels)",
    varnaType: "All Vowels & Solar Ignition",
    letters: ["A", "Aa", "I", "U", "E", "O"],
    description: "Sun rules all primordial vowels. Gives regal, commanding, universally recognizable names starting with 'A'.",
  },
  Moon: {
    planet: "Moon",
    sanskritVarga: "Antastha Varga (अन्तस्थ वर्ग - Semivowels)",
    varnaType: "Liquid & Rhythmic Semivowels",
    letters: ["Y", "R", "L", "V"],
    description: "Moon rules fluid, expressive, melodious sounds ('Ya, Ra, La, Va'). Highly magnetic when Moon is exalted or strong.",
  },
  Mars: {
    planet: "Mars",
    sanskritVarga: "Kavarga (क वर्ग - Gutturals)",
    varnaType: "Sharp, Dynamic Consonants",
    letters: ["K", "Kh", "G", "Gh", "C"],
    description: "Mars rules fiery, athletic, punchy consonants ('K, G, Ch'). Gives crisp, impactful names.",
  },
  Venus: {
    planet: "Venus",
    sanskritVarga: "Chavarga (च वर्ग - Palatals)",
    varnaType: "Graceful, Aesthetic & Sibilant Sounds",
    letters: ["Ch", "J", "Jh", "S", "Sh"],
    description: "Venus rules charming, artistic, sophisticated sounds ('Ch, J, S, Sh'). Inspires poetic and elegant names.",
  },
  Mercury: {
    planet: "Mercury",
    sanskritVarga: "Tavarga Retroflex (ट वर्ग)",
    varnaType: "Intellectual & Youthful Sounds",
    letters: ["T", "D", "N"],
    description: "Mercury rules clever, adaptable, modern phonetic sounds ('T, D, N').",
  },
  Jupiter: {
    planet: "Jupiter",
    sanskritVarga: "Tavarga Dental (त वर्ग - Dentals)",
    varnaType: "Noble, Sacred & Auspicious Sounds",
    letters: ["T", "Th", "D", "Dh", "N", "G"],
    description: "Jupiter rules sacred, wise, traditional and dignified sounds ('D, N, T, G'). Inspires divine or philosophical names.",
  },
  Saturn: {
    planet: "Saturn",
    sanskritVarga: "Pavarga (प वर्ग - Labials)",
    varnaType: "Grounded & Heavy Consonants",
    letters: ["P", "Ph", "B", "Bh", "M", "F"],
    description: "Saturn rules solid, disciplined, traditional and endurance-oriented sounds ('P, B, M').",
  },
  Rahu: {
    planet: "Rahu",
    sanskritVarga: "Ushma Varga (ऊष्म वर्ग - Sibilants & Aspirates)",
    varnaType: "Unconventional, Sibilant Sounds",
    letters: ["Sh", "S", "H"],
    description: "Rahu rules modern, unconventional, magnetic sounds ('Sh, S, H').",
  },
  Ketu: {
    planet: "Ketu",
    sanskritVarga: "Moksha Varga (मोक्ष वर्ग - Mystical Sounds)",
    varnaType: "Spiritual, Minimalist Sounds",
    letters: ["K", "H", "Sh"],
    description: "Ketu rules ascetic, spiritual, rare and introspective sounds.",
  },
};

/**
 * Evaluates the complete 5-Pillar Vedic Name Analysis Matrix
 */
export function evaluateVedicNameMatrix(
  natalEphem: EphemerisResult,
  gender: "male" | "female" = "male"
): VedicNameAnalysisResult {
  const moon = natalEphem.planets.Moon;
  const sun = natalEphem.planets.Sun;
  const asc = natalEphem.ascendant;

  // 1. Chandra Nakshatra Syllable (Janma / Sankalpa Nama)
  const moonNakIdx = moon?.nakshatra.index || 0;
  const moonPada = moon?.nakshatra.pada || 1;
  const janmaRashiName = moon?.rashi.englishName || "Aries";

  const janmaRecord = AVAKAHADA_CHAKRA_SYLLABLES[moonNakIdx]?.[moonPada] || {
    sanskrit: "अ",
    english: "A",
    examples: ["Amit", "Aman"],
  };

  const janmaNakshatraName = moon?.nakshatra.sanskritName || "Ashwini";
  const janmaNakshatraPada = moonPada;
  const janmaSyllableSanskrit = janmaRecord.sanskrit;
  const janmaSyllableEnglish = janmaRecord.english;
  const janmaExampleNames = janmaRecord.examples;

  // 2. Surya Nakshatra Matrix
  const sunNakIdx = sun?.nakshatra.index || 0;
  const sunPada = sun?.nakshatra.pada || 1;
  const suryaRecord = AVAKAHADA_CHAKRA_SYLLABLES[sunNakIdx]?.[sunPada] || {
    sanskrit: "अ",
    english: "A",
    examples: [],
  };
  const suryaNakshatraName = sun?.nakshatra.sanskritName || "Rohini";
  const suryaNakshatraPada = sunPada;
  const suryaSyllableEnglish = suryaRecord.english;
  const suryaVowelResonance = "Sun rules all primary Vowels (A, Aa, I, U, E, O) — the primordial seed of social identity.";

  // 3. Lagna & Lagna Lord Dominance (Svara Jyotish / Varna Mandala)
  const ascSignIdx = Math.floor(asc.siderealLongitude / 30);
  const lagnaLord = RASHI_NAMES[ascSignIdx].lord;

  const dominantPlanets: VedicNameAnalysisResult["dominantLagnaPlanets"] = [];

  // Check 1: Planets in 1st house (Occupants)
  Object.entries(natalEphem.planets).forEach(([name, p]) => {
    if (!p || p.isUpagraha || p.isModernPlanet) return;
    if (p.house === 1) {
      dominantPlanets.push({
        planet: name,
        role: "Lagna Occupant",
        varnaGroup: PLANETARY_VARNA_MANDALA[name] || PLANETARY_VARNA_MANDALA.Sun,
        suggestedLetters: (PLANETARY_VARNA_MANDALA[name] || PLANETARY_VARNA_MANDALA.Sun).letters,
      });
    }
  });

  // Check 2: Direct 7th aspect onto Lagna
  Object.entries(natalEphem.planets).forEach(([name, p]) => {
    if (!p || p.isUpagraha || p.isModernPlanet) return;
    if (p.house === 7) {
      dominantPlanets.push({
        planet: name,
        role: "Direct Lagna Aspect",
        varnaGroup: PLANETARY_VARNA_MANDALA[name] || PLANETARY_VARNA_MANDALA.Sun,
        suggestedLetters: (PLANETARY_VARNA_MANDALA[name] || PLANETARY_VARNA_MANDALA.Sun).letters,
      });
    }
  });

  // Check 3: Lagna Lord conjunction
  const lagnaLordPlanet = natalEphem.planets[lagnaLord];
  if (lagnaLordPlanet) {
    Object.entries(natalEphem.planets).forEach(([name, p]) => {
      if (!p || p.isUpagraha || p.isModernPlanet || name === lagnaLord) return;
      if (p.house === lagnaLordPlanet.house && !dominantPlanets.some((d) => d.planet === name)) {
        dominantPlanets.push({
          planet: name,
          role: "Lagna Lord Conjunction",
          varnaGroup: PLANETARY_VARNA_MANDALA[name] || PLANETARY_VARNA_MANDALA.Sun,
          suggestedLetters: (PLANETARY_VARNA_MANDALA[name] || PLANETARY_VARNA_MANDALA.Sun).letters,
        });
      }
    });
  }

  // Check 4: Exalted or Highest Dignity Planet (e.g. Exalted Moon in Taurus, Exalted Sun, etc.)
  Object.entries(natalEphem.planets).forEach(([name, p]) => {
    if (!p || p.isUpagraha || p.isModernPlanet) return;
    const sIdx = Math.floor(p.siderealLongitude / 30);
    const isExalted =
      (name === "Sun" && sIdx === 0) ||
      (name === "Moon" && sIdx === 1) ||
      (name === "Mars" && sIdx === 9) ||
      (name === "Mercury" && sIdx === 5) ||
      (name === "Jupiter" && sIdx === 3) ||
      (name === "Venus" && sIdx === 11) ||
      (name === "Saturn" && sIdx === 6);

    if (isExalted && !dominantPlanets.some((d) => d.planet === name)) {
      dominantPlanets.push({
        planet: name,
        role: "Highest Strength Sovereign",
        varnaGroup: PLANETARY_VARNA_MANDALA[name] || PLANETARY_VARNA_MANDALA.Sun,
        suggestedLetters: (PLANETARY_VARNA_MANDALA[name] || PLANETARY_VARNA_MANDALA.Sun).letters,
      });
    }
  });

  // Collect predicted calling letters
  const callingLettersSet = new Set<string>();
  // Include Sun's primary vowel "A"
  callingLettersSet.add("A");

  dominantPlanets.forEach((d) => {
    d.suggestedLetters.forEach((l) => callingLettersSet.add(l));
  });

  // Also add Sun's Nakshatra letter if distinct
  if (suryaSyllableEnglish) callingLettersSet.add(suryaSyllableEnglish.split(" ")[0]);

  const predictedCallingLetters = Array.from(callingLettersSet).slice(0, 8);

  const topInfluencer = dominantPlanets[0] || {
    planet: "Sun",
    role: "Highest Strength Sovereign",
    varnaGroup: PLANETARY_VARNA_MANDALA.Sun,
    suggestedLetters: ["A", "Aa", "I", "U"],
  };

  const primaryCallingLetterSummary = `Lagna & Identity axis is strongly imprinted by ${topInfluencer.planet} (${topInfluencer.role}), generating primary calling name letters: ${topInfluencer.suggestedLetters.join(", ")}.`;

  // 4. Arudha Lagna (AL)
  // Simplified AL calculation: Lagna Lord displacement from Lagna
  const lagnaLordHouse = lagnaLordPlanet?.house || 1;
  const alHouse = ((lagnaLordHouse - 1) * 2 % 12) + 1;
  const alSignIdx = (ascSignIdx + alHouse - 1) % 12;
  const arudhaLagnaSign = RASHI_NAMES[alSignIdx].englishName;
  const alLord = RASHI_NAMES[alSignIdx].lord;
  const arudhaLagnaLetters = (PLANETARY_VARNA_MANDALA[alLord] || PLANETARY_VARNA_MANDALA.Mercury).letters;

  // 5. Bhrigu Nandi Nadi Spouse Name Prediction (7th Lord / Venus / Jupiter)
  const spouse7thHouseSignIdx = (ascSignIdx + 6) % 12;
  const spouse7thHouseSign = RASHI_NAMES[spouse7thHouseSignIdx].englishName;
  const spouse7thLord = RASHI_NAMES[spouse7thHouseSignIdx].lord;
  const spouseKarakaPlanet = gender === "female" ? "Jupiter" : "Venus";

  const spousePlanet = natalEphem.planets[spouseKarakaPlanet] || natalEphem.planets[spouse7thLord];
  const spousePlanetNakIdx = spousePlanet?.nakshatra.index || 0;
  const spousePlanetPada = spousePlanet?.nakshatra.pada || 1;
  const spouseNakRecord = AVAKAHADA_CHAKRA_SYLLABLES[spousePlanetNakIdx]?.[spousePlanetPada];

  const spouseVarnaLetters = (PLANETARY_VARNA_MANDALA[spouse7thLord] || PLANETARY_VARNA_MANDALA.Venus).letters;
  const predictedSpouseLetters = Array.from(
    new Set([
      spouseNakRecord?.english.split(" ")[0] || "A",
      ...spouseVarnaLetters.slice(0, 3),
      "A",
      "S",
      "P",
      "R",
    ])
  ).slice(0, 6);

  const spouseNamingReasoning = `Bhrigu Nadi maps 7th Lord (${spouse7thLord}) and Vivaha Karaka (${spouseKarakaPlanet} in ${spousePlanet?.rashi.englishName || "Aries"}) to initial phonetic letters: ${predictedSpouseLetters.join(", ")}.`;

  const executiveNameSummary = `Sacred Soul Name (*Janma Nakshatra*): "${janmaSyllableEnglish}" (${janmaNakshatraName} Pada ${janmaNakshatraPada}). Worldly Calling Name (*Vyavaharika*): Strongly governed by ${topInfluencer.planet} (${topInfluencer.suggestedLetters.join(", ")}). Predicted Spouse Initial Letters: ${predictedSpouseLetters.join(", ")}.`;

  return {
    janmaNakshatraName,
    janmaNakshatraPada,
    janmaSyllableSanskrit,
    janmaSyllableEnglish,
    janmaExampleNames,
    janmaRashiName,
    suryaNakshatraName,
    suryaNakshatraPada,
    suryaSyllableEnglish,
    suryaVowelResonance,
    dominantLagnaPlanets: dominantPlanets,
    predictedCallingLetters,
    primaryCallingLetterSummary,
    arudhaLagnaSign,
    arudhaLagnaLetters,
    spouseKarakaPlanet,
    spouse7thHouseSign,
    spouse7thLord,
    predictedSpouseLetters,
    spouseNamingReasoning,
    executiveNameSummary,
  };
}
