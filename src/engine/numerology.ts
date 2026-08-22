/**
 * Classical Vedic (Sankhya Shastra), Chaldean & Pythagorean Numerology Engine
 * Includes: Mulank (Driver), Bhagyank (Conductor/Life Path), Namank (Name Number),
 * 3x3 Loshu Grid with 8 Planes of Fortune, and Compatibility Profiles.
 */

export interface NumberDetail {
  number: number;
  planet: string;
  sanskritPlanet: string;
  symbol: string;
  color: string;
  element: string;
  deity: string;
  gemstone: string;
  luckyDays: string[];
  luckyColors: string[];
  friendlyNumbers: number[];
  enemyNumbers: number[];
  neutralNumbers: number[];
  traits: string[];
  strengths: string[];
  challenges: string[];
  career: string[];
}

export const NUMBER_PROFILES: Record<number, NumberDetail> = {
  1: {
    number: 1,
    planet: "Sun",
    sanskritPlanet: "Surya",
    symbol: "☉",
    color: "#FFB300",
    element: "Fire (Agni)",
    deity: "Lord Shiva / Surya Deva",
    gemstone: "Ruby (Manikya)",
    luckyDays: ["Sunday", "Monday"],
    luckyColors: ["Gold", "Orange", "Yellow", "Copper"],
    friendlyNumbers: [1, 2, 3, 5, 9],
    enemyNumbers: [6, 8],
    neutralNumbers: [4, 7],
    traits: ["Leadership", "Ambition", "Pioneer", "Independence", "Authoritative"],
    strengths: ["Strong willpower", "Natural executive", "High vitality", "Visionary"],
    challenges: ["Egoism", "Impatience", "Domineering tendency", "Authoritarian"],
    career: ["Administration", "Government Services", "Entrepreneurship", "Politics", "Surgeon"],
  },
  2: {
    number: 2,
    planet: "Moon",
    sanskritPlanet: "Chandra",
    symbol: "☽",
    color: "#E0E0E0",
    element: "Water (Jala)",
    deity: "Lord Shiva / Goddess Parvati",
    gemstone: "Pearl (Moti) / Moonstone",
    luckyDays: ["Monday", "Sunday"],
    luckyColors: ["White", "Cream", "Silver", "Light Green"],
    friendlyNumbers: [1, 3, 5],
    enemyNumbers: [4, 8, 9],
    neutralNumbers: [2, 6, 7],
    traits: ["Intuitive", "Diplomatic", "Empathetic", "Imaginative", "Peaceful"],
    strengths: ["High emotional intelligence", "Peacemaker", "Creative arts", "Gentle"],
    challenges: ["Mood swings", "Hypersensitivity", "Indecisiveness", "Over-dependence"],
    career: ["Counseling", "Psychology", "Poetry & Fine Arts", "Hospitality", "Healthcare", "Marine"],
  },
  3: {
    number: 3,
    planet: "Jupiter",
    sanskritPlanet: "Guru / Brihaspati",
    symbol: "♃",
    color: "#FFD54F",
    element: "Ether / Space (Akasha)",
    deity: "Lord Brahma / Brihaspati",
    gemstone: "Yellow Sapphire (Pukhraj)",
    luckyDays: ["Thursday", "Tuesday"],
    luckyColors: ["Yellow", "Saffron", "Golden Yellow"],
    friendlyNumbers: [1, 2, 3, 5, 9],
    enemyNumbers: [6],
    neutralNumbers: [4, 7, 8],
    traits: ["Wisdom", "Optimism", "Counselor", "Philosopher", "Expansive"],
    strengths: ["Knowledgeable", "Mentorship", "Oratorical skills", "Generous"],
    challenges: ["Scattering energy", "Over-optimism", "Preachy demeanor", "Extravagance"],
    career: ["Education & Teaching", "Law & Judiciary", "Finance & Banking", "Spiritual Counseling", "Publishing"],
  },
  4: {
    number: 4,
    planet: "Rahu",
    sanskritPlanet: "Rahu (North Node)",
    symbol: "☊",
    color: "#78909C",
    element: "Air (Vayu)",
    deity: "Goddess Durga / Bhairava",
    gemstone: "Hessonite Garnet (Gomed)",
    luckyDays: ["Sunday", "Saturday"],
    luckyColors: ["Electric Blue", "Grey", "Smoke", "Khaki"],
    friendlyNumbers: [1, 5, 6, 7],
    enemyNumbers: [2, 8, 9],
    neutralNumbers: [3, 4],
    traits: ["Revolutionary", "Analytical", "Practical", "Unconventional", "Organized"],
    strengths: ["Structural thinking", "Master of sudden gains", "Out-of-box solutions", "Tech-savvy"],
    challenges: ["Stubbornness", "Sudden mood shifts", "Rebelliousness", "Secretive"],
    career: ["Information Technology", "Aviation", "Engineering", "Data Science", "Research", "Media"],
  },
  5: {
    number: 5,
    planet: "Mercury",
    sanskritPlanet: "Budha",
    symbol: "☿",
    color: "#43A047",
    element: "Earth (Prithvi)",
    deity: "Lord Vishnu / Lord Ganesha",
    gemstone: "Emerald (Panna)",
    luckyDays: ["Wednesday", "Friday"],
    luckyColors: ["Emerald Green", "Light Green", "Turquoise"],
    friendlyNumbers: [1, 2, 3, 5, 6],
    enemyNumbers: [], // Mercury is friend to all in Sankhya Shastra
    neutralNumbers: [4, 7, 8, 9],
    traits: ["Adaptable", "Communicator", "Commercial Acumen", "Quick-witted", "Versatile"],
    strengths: ["Exceptional business mind", "Networking genius", "Multitasking", "Charismatic"],
    challenges: ["Restlessness", "Fickle-mindedness", "Over-indulgence", "Impulsive decisions"],
    career: ["Commerce & Trading", "Marketing & PR", "Journalism", "Stock Broking", "E-commerce", "Travel"],
  },
  6: {
    number: 6,
    planet: "Venus",
    sanskritPlanet: "Shukra",
    symbol: "♀",
    color: "#F06292",
    element: "Water (Jala)",
    deity: "Goddess Lakshmi / Shukracharya",
    gemstone: "Diamond (Heera) / White Zircon",
    luckyDays: ["Friday", "Wednesday"],
    luckyColors: ["White", "Pink", "Pastel Shades", "Sky Blue"],
    friendlyNumbers: [4, 5, 6, 7, 8],
    enemyNumbers: [1, 2, 3],
    neutralNumbers: [9],
    traits: ["Luxury", "Aesthetics", "Harmony", "Charisma", "Romantic", "Caregiver"],
    strengths: ["Refined taste", "Artistic excellence", "Magnetic charm", "Nurturing nature"],
    challenges: ["Excessive luxury cravings", "Vanity", "Self-indulgence", "Difficulty saying no"],
    career: ["Fashion & Design", "Cinema & Entertainment", "Luxury Retail", "Interior Architecture", "Cosmetics"],
  },
  7: {
    number: 7,
    planet: "Ketu",
    sanskritPlanet: "Ketu (South Node)",
    symbol: "☋",
    color: "#8D6E63",
    element: "Water (Jala) / Fire",
    deity: "Lord Ganesha / Lord Matsya",
    gemstone: "Cat's Eye (Vaidurya / Lahsuniya)",
    luckyDays: ["Monday", "Wednesday", "Thursday"],
    luckyColors: ["White", "Light Green", "Smoky Blue", "Pastels"],
    friendlyNumbers: [1, 4, 5, 6],
    enemyNumbers: [2, 9],
    neutralNumbers: [3, 7, 8],
    traits: ["Mystic", "Researcher", "Intuitive", "Philosophical", "Solitary Seeker"],
    strengths: ["Deep analytical mind", "Spiritual wisdom", "Clairvoyant perception", "Truth seeker"],
    challenges: ["Aloofness", "Overthinking", "Restlessness", "Detached from mundane reality"],
    career: ["Scientific Research", "Occult & Astrology", "Philosophy", "Psychiatry", "Forensics", "Theology"],
  },
  8: {
    number: 8,
    planet: "Saturn",
    sanskritPlanet: "Shani",
    symbol: "♄",
    color: "#5C6BC0",
    element: "Air / Earth",
    deity: "Lord Saturn / Lord Hanuman",
    gemstone: "Blue Sapphire (Neelam) / Amethyst",
    luckyDays: ["Saturday", "Friday"],
    luckyColors: ["Dark Blue", "Black", "Dark Violet", "Indigo"],
    friendlyNumbers: [3, 4, 5, 6, 7],
    enemyNumbers: [1, 2, 9],
    neutralNumbers: [8],
    traits: ["Discipline", "Perseverance", "Justice", "Karmic Endurance", "Realist"],
    strengths: ["Unshakable resilience", "Deep organizational mastery", "Fairness", "Long-term wealth builder"],
    challenges: ["Pessimism", "Rigidity", "Slow beginnings", "Heavy burdens"],
    career: ["Mining & Heavy Industry", "Real Estate", "Judiciary & Law", "Civil Construction", "Labor Unions", "Oil & Minerals"],
  },
  9: {
    number: 9,
    planet: "Mars",
    sanskritPlanet: "Mangala",
    symbol: "♂",
    color: "#E53935",
    element: "Fire (Agni)",
    deity: "Lord Kartikeya / Lord Hanuman",
    gemstone: "Red Coral (Moonga)",
    luckyDays: ["Tuesday", "Thursday", "Sunday"],
    luckyColors: ["Crimson Red", "Scarlet", "Rose", "Coral Pink"],
    friendlyNumbers: [1, 2, 3, 5],
    enemyNumbers: [4, 8],
    neutralNumbers: [6, 7, 9],
    traits: ["Courage", "Humanitarian", "Warrior Spirit", "Dynamic Energy", "Protector"],
    strengths: ["Fearless courage", "High energy", "Philanthropic heart", "Commanding presence"],
    challenges: ["Quick temper", "Aggression", "Impulsiveness", "Accident-prone"],
    career: ["Military & Defense", "Sports & Athletics", "Surgery & Medicine", "Fire Services", "Engineering", "Activism"],
  },
};

// Chaldean Letter Values
const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

// Pythagorean Letter Values
const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

// Reduce any number to single digit (1-9), preserving master numbers (11, 22, 33) optionally
export function reduceToSingleDigit(num: number, preserveMaster = false): number {
  if (preserveMaster && (num === 11 || num === 22 || num === 33)) return num;
  while (num > 9) {
    num = num
      .toString()
      .split("")
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    if (preserveMaster && (num === 11 || num === 22 || num === 33)) return num;
  }
  return num;
}

// Calculate Mulank (Driver / Psychic Number from Day of Month)
export function calculateMulank(day: number): { singleDigit: number; rawSum: number } {
  const single = reduceToSingleDigit(day);
  return { singleDigit: single, rawSum: day };
}

// Calculate Bhagyank (Destiny / Life Path Number from full date)
export function calculateBhagyank(day: number, month: number, year: number): { singleDigit: number; totalSum: number } {
  const sum = day + month + year;
  const single = reduceToSingleDigit(sum);
  return { singleDigit: single, totalSum: sum };
}

// Calculate Namank (Name Number) using Chaldean and Pythagorean
export function calculateNamank(fullName: string) {
  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, "");
  const VOWELS = new Set(["A", "E", "I", "O", "U"]);

  let chaldeanTotal = 0;
  let pythagoreanTotal = 0;
  let soulUrgeTotal = 0; // Vowels (Heart Desire)
  let personalityTotal = 0; // Consonants

  const letterBreakdown: { letter: string; chaldean: number; pythagorean: number; isVowel: boolean }[] = [];

  for (const char of cleanName) {
    const cVal = CHALDEAN_MAP[char] || 0;
    const pVal = PYTHAGOREAN_MAP[char] || 0;
    const isVowel = VOWELS.has(char);

    chaldeanTotal += cVal;
    pythagoreanTotal += pVal;
    if (isVowel) soulUrgeTotal += pVal;
    else personalityTotal += pVal;

    letterBreakdown.push({ letter: char, chaldean: cVal, pythagorean: pVal, isVowel });
  }

  return {
    fullName,
    cleanName,
    chaldean: {
      rawTotal: chaldeanTotal,
      number: reduceToSingleDigit(chaldeanTotal),
    },
    pythagorean: {
      rawTotal: pythagoreanTotal,
      number: reduceToSingleDigit(pythagoreanTotal),
    },
    soulUrge: {
      rawTotal: soulUrgeTotal,
      number: reduceToSingleDigit(soulUrgeTotal),
    },
    personality: {
      rawTotal: personalityTotal,
      number: reduceToSingleDigit(personalityTotal),
    },
    letterBreakdown,
  };
}

// Calculate Kua Number (Feng Shui & Directional Energy)
export function calculateKuaNumber(year: number, gender: "male" | "female" = "male"): number {
  const yearSum = reduceToSingleDigit(year);
  if (gender === "male") {
    let val = 10 - yearSum;
    if (val === 5) return 2; // For male, 5 maps to 2
    return reduceToSingleDigit(val);
  } else {
    let val = 5 + yearSum;
    if (val === 5) return 8; // For female, 5 maps to 8
    return reduceToSingleDigit(val);
  }
}

// Calculate Personal Year Number for the given target year
export function calculatePersonalYear(day: number, month: number, currentYear: number): number {
  return reduceToSingleDigit(day + month + currentYear);
}

export interface LoshuPlane {
  name: string;
  sanskritName: string;
  type: "mental" | "emotional" | "practical" | "thought" | "willpower" | "action" | "golden_raj_yoga" | "silver_raj_yoga";
  numbers: [number, number, number];
  percentage: number;
  description: string;
  status: "complete" | "partial" | "empty";
}

export interface LoshuGridResult {
  grid: Record<number, number>; // count of each digit 1..9
  presentNumbers: number[];
  missingNumbers: number[];
  planes: LoshuPlane[];
  remedies: { number: number; missing: boolean; remedy: string; element: string }[];
}

// Classical 3x3 Loshu Grid Layout:
// [4, 9, 2]
// [3, 5, 7]
// [8, 1, 6]
export function calculateLoshuGrid(
  day: number,
  month: number,
  year: number,
  mulank: number,
  bhagyank: number
): LoshuGridResult {
  const grid: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  // Ingest all digits from DOB string (e.g. 22 08 2026 -> 2,2,0,8,2,0,2,6)
  const dobDigits = `${day}${month}${year}${mulank}${bhagyank}`.split("");
  for (const d of dobDigits) {
    const n = parseInt(d, 10);
    if (n >= 1 && n <= 9) {
      grid[n] = (grid[n] || 0) + 1;
    }
  }

  const presentNumbers = Object.keys(grid)
    .map(Number)
    .filter((n) => grid[n] > 0);

  const missingNumbers = Object.keys(grid)
    .map(Number)
    .filter((n) => grid[n] === 0);

  // Analyze 8 Planes
  const planeDefs: {
    name: string;
    sanskritName: string;
    type: LoshuPlane["type"];
    numbers: [number, number, number];
    desc: string;
  }[] = [
    { name: "Mental Plane (Head)", sanskritName: "Mansik Stara", type: "mental", numbers: [4, 9, 2], desc: "Sharp memory, intellect, analytical genius, intellectual clarity" },
    { name: "Emotional Plane (Heart)", sanskritName: "Bhavana Stara", type: "emotional", numbers: [3, 5, 7], desc: "Intuition, empathy, spiritual depth, artistic heart" },
    { name: "Practical Plane (Hands)", sanskritName: "Vyavaharik Stara", type: "practical", numbers: [8, 1, 6], desc: "Physical action, financial stability, craftsmanship, materialization" },
    { name: "Thought Plane (Vision)", sanskritName: "Vichara Stara", type: "thought", numbers: [4, 3, 8], desc: "Strategic planning, deep research, visionary foresight" },
    { name: "Willpower Plane (Persistence)", sanskritName: "Sankalpa Stara", type: "willpower", numbers: [9, 5, 1], desc: "Unwavering determination, focus, resilience, tenacity" },
    { name: "Action Plane (Execution)", sanskritName: "Karma Stara", type: "action", numbers: [2, 7, 6], desc: "Swift execution, converting ideas into physical reality" },
    { name: "Golden Raj Yoga (Diagonal)", sanskritName: "Suvarna Raj Yoga", type: "golden_raj_yoga", numbers: [4, 5, 6], desc: "Supreme prosperity, royal success, effortless wealth and fame" },
    { name: "Silver Raj Yoga (Diagonal)", sanskritName: "Rajat Raj Yoga", type: "silver_raj_yoga", numbers: [2, 5, 8], desc: "Real estate prosperity, steady wealth accumulation, luck" },
  ];

  const planes: LoshuPlane[] = planeDefs.map((def) => {
    const presentCount = def.numbers.filter((n) => grid[n] > 0).length;
    const percentage = Math.round((presentCount / 3) * 100);
    const status: LoshuPlane["status"] = presentCount === 3 ? "complete" : presentCount > 0 ? "partial" : "empty";
    return {
      name: def.name,
      sanskritName: def.sanskritName,
      type: def.type,
      numbers: def.numbers,
      percentage,
      description: def.desc,
      status,
    };
  });

  // Remedies for Missing Numbers
  const remedyMap: Record<number, { remedy: string; element: string }> = {
    1: { remedy: "Worship Surya Deva, offer water in a copper vessel, wear Red/Copper colors", element: "Water / Sun" },
    2: { remedy: "Wear silver ornaments, respect mother, drink water in silver glass, carry white handkerchief", element: "Earth / Moon" },
    3: { remedy: "Wear yellow/saffron, plant tulsi or banana tree, chant Guru Gayatri mantra, respect teachers", element: "Wood / Jupiter" },
    4: { remedy: "Wear wooden/tulsi bead mala, avoid clutter in North-East, keep green plants in house", element: "Wood / Rahu" },
    5: { remedy: "Feed green grass to cows on Wednesday, chant Budha mantra, keep a small earthen pot", element: "Earth / Mercury" },
    6: { remedy: "Wear golden watch or white clothes on Friday, chant Shukra mantra, respect spouse/women", element: "Metal / Venus" },
    7: { remedy: "Wear silver watch or metallic bracelet, feed street dogs, engage in spiritual meditation", element: "Metal / Ketu" },
    8: { remedy: "Help laborers, feed crows on Saturday, light mustard oil lamp under Peepal tree", element: "Earth / Saturn" },
    9: { remedy: "Wear red coral or red bracelet, chant Hanuman Chalisa, avoid unnecessary anger", element: "Fire / Mars" },
  };

  const remedies = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({
    number: n,
    missing: grid[n] === 0,
    remedy: remedyMap[n].remedy,
    element: remedyMap[n].element,
  }));

  return {
    grid,
    presentNumbers,
    missingNumbers,
    planes,
    remedies,
  };
}

export interface FullNumerologyReport {
  date: Date;
  day: number;
  month: number;
  year: number;
  mulank: { singleDigit: number; rawSum: number; profile: NumberDetail };
  bhagyank: { singleDigit: number; totalSum: number; profile: NumberDetail };
  personalYear: number;
  kuaNumberMale: number;
  kuaNumberFemale: number;
  loshu: LoshuGridResult;
}

export function generateNumerologyReport(date: Date, timezoneOffsetHours = 0): FullNumerologyReport {
  // Convert UTC timestamp to observer's local date
  const localDate = new Date(date.getTime() + timezoneOffsetHours * 3600 * 1000);
  const day = localDate.getUTCDate();
  const month = localDate.getUTCMonth() + 1;
  const year = localDate.getUTCFullYear();

  const mulankData = calculateMulank(day);
  const bhagyankData = calculateBhagyank(day, month, year);
  const personalYear = calculatePersonalYear(day, month, new Date().getFullYear());
  const kuaMale = calculateKuaNumber(year, "male");
  const kuaFemale = calculateKuaNumber(year, "female");

  const loshu = calculateLoshuGrid(day, month, year, mulankData.singleDigit, bhagyankData.singleDigit);

  return {
    date,
    day,
    month,
    year,
    mulank: {
      ...mulankData,
      profile: NUMBER_PROFILES[mulankData.singleDigit],
    },
    bhagyank: {
      ...bhagyankData,
      profile: NUMBER_PROFILES[bhagyankData.singleDigit],
    },
    personalYear,
    kuaNumberMale: kuaMale,
    kuaNumberFemale: kuaFemale,
    loshu,
  };
}