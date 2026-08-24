/**
 * Classical Vedic Tithi & Panchanga Calendar Engine
 * Provides daily Tithi calculations, sunrise Tithi (Udaya Tithi),
 * Lunar Months (Masa), Nakshatras, Yogas, Karanas,
 * and Auspicious Days / Vrats / Festivals (त्यौहार एवं व्रत).
 */

import * as Astronomy from "astronomy-engine";
import { GeoLocation } from "./types";
import { getAyanamsha, toSiderealLongitude } from "./ayanamsha";
import { getNakshatra, getRashi } from "./rashiNakshatra";
import { TITHI_NAMES, YOGA_NAMES, KARANA_NAMES } from "./constants";

export interface FestivalEvent {
  id: string;
  name: string;
  hindiName: string;
  category: "festival" | "vrat" | "jayanti" | "astronomical";
  deity?: string;
  significance: string;
  ritual?: string;
  badgeColor: string; // Tailwind color classes
}

export interface DailyTithiPanchanga {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayOfMonth: number;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday...
  dayName: string;
  sanskritVara: string;
  varaLord: string;

  // Tithi Info
  tithi: {
    index: number; // 0 to 29
    name: string;
    hindiName: string;
    paksha: "Shukla" | "Krishna";
    pakshaHindi: string;
    tithiNumber: number; // 1 to 15
    moonPhaseEmoji: string;
    illuminationPercent: number;
    progressPercent: number;
  };

  // Lunar Month (Masa)
  lunarMonth: {
    index: number;
    name: string;
    hindiName: string;
    solarMasa: string;
  };

  // Nakshatra Info
  nakshatra: {
    index: number;
    name: string;
    sanskritName: string;
    lord: string;
    deity: string;
    pada: number;
  };

  // Yoga & Karana
  yoga: {
    index: number;
    name: string;
  };
  karana: {
    index: number;
    name: string;
    isBhadra: boolean;
  };

  // Muhurta & Timings
  timings: {
    sunrise: string;
    sunset: string;
    rahuKaal: string;
    abhijitMuhurta: string;
    brahmaMuhurta: string;
  };

  // Key Event Flags
  isToday: boolean;
  isPurnima: boolean;
  isAmavasya: boolean;
  isEkadashi: boolean;
  isPradosh: boolean;
  isShivaratri: boolean;
  isSankranti: boolean;
  ekadashiName?: string;

  // Celebrations & Auspicious Observances
  festivals: FestivalEvent[];
}

export interface MonthlyTithiCalendarResult {
  year: number;
  month: number; // 1 to 12
  monthName: string;
  monthHindi: string;
  totalDays: number;
  days: DailyTithiPanchanga[];
  paddingBefore: number; // Number of empty cells before day 1
  paddingAfter: number;
  majorFestivals: { date: Date; dateFormatted: string; festival: FestivalEvent }[];
  purnimaDate?: Date;
  amavasyaDate?: Date;
  ekadashiDates: Date[];
  pradoshDates: Date[];
}

const TITHI_HINDI_NAMES = [
  "प्रतिपदा (Pratipada)",
  "द्वितीया (Dwitiya)",
  "तृतीया (Tritiya)",
  "चतुर्थी (Chaturthi)",
  "पंचमी (Panchami)",
  "षष्ठी (Shashthi)",
  "सप्तमी (Saptami)",
  "अष्टमी (Ashtami)",
  "नवमी (Navami)",
  "दशमी (Dashami)",
  "एकादशी (Ekadashi)",
  "द्वादशी (Dwadashi)",
  "त्रयोदशी (Trayodashi)",
  "चतुर्दशी (Chaturdashi)",
  "पूर्णिमा (Purnima) / अमावस्या (Amavasya)",
];

const LUNAR_MASA_NAMES = [
  { index: 0, name: "Chaitra", hindiName: "चैत्र" },
  { index: 1, name: "Vaishakha", hindiName: "वैशाख" },
  { index: 2, name: "Jyeshtha", hindiName: "ज्येष्ठ" },
  { index: 3, name: "Ashadha", hindiName: "आषाढ" },
  { index: 4, name: "Shravana", hindiName: "श्रावण" },
  { index: 5, name: "Bhadrapada", hindiName: "भाद्रपद" },
  { index: 6, name: "Ashvina", hindiName: "अश्विन" },
  { index: 7, name: "Kartika", hindiName: "कार्तिक" },
  { index: 8, name: "Margashirsha", hindiName: "मार्गशीर्ष" },
  { index: 9, name: "Pausha", hindiName: "पौष" },
  { index: 10, name: "Magha", hindiName: "माघ" },
  { index: 11, name: "Phalguna", hindiName: "फाल्गुन" },
];

const VARA_INFO = [
  { name: "Sunday", sanskrit: "रविवार (Ravivara)", lord: "Sun" },
  { name: "Monday", sanskrit: "सोमवार (Somavara)", lord: "Moon" },
  { name: "Tuesday", sanskrit: "मंगलवार (Mangalavara)", lord: "Mars" },
  { name: "Wednesday", sanskrit: "बुधवार (Budhavara)", lord: "Mercury" },
  { name: "Thursday", sanskrit: "गुरुवार (Guruvara)", lord: "Jupiter" },
  { name: "Friday", sanskrit: "शुक्रवार (Shukravara)", lord: "Venus" },
  { name: "Saturday", sanskrit: "शनिवार (Shanivara)", lord: "Saturn" },
];

// Names for all 24 classical Ekadashis
const EKADASHI_NAMES: Record<number, { shukla: string; krishna: string }> = {
  0: { shukla: "Kamada Ekadashi", krishna: "Papamochani Ekadashi" }, // Chaitra
  1: { shukla: "Mohini Ekadashi", krishna: "Varuthini Ekadashi" }, // Vaishakha
  2: { shukla: "Nirjala Ekadashi (Bhimseni)", krishna: "Apara Ekadashi" }, // Jyeshtha
  3: { shukla: "Devshayani Ekadashi (Hari Shayani)", krishna: "Yogini Ekadashi" }, // Ashadha
  4: { shukla: "Shravana Putrada Ekadashi", krishna: "Kamika Ekadashi" }, // Shravana
  5: { shukla: "Parivartini Ekadashi", krishna: "Aja Ekadashi" }, // Bhadrapada
  6: { shukla: "Papankusha Ekadashi", krishna: "Indira Ekadashi" }, // Ashvina
  7: { shukla: "Devutthana Ekadashi (Prabodhini)", krishna: "Rama Ekadashi" }, // Kartika
  8: { shukla: "Mokshada Ekadashi (Gita Jayanti)", krishna: "Utpanna Ekadashi" }, // Margashirsha
  9: { shukla: "Pausha Putrada Ekadashi", krishna: "Saphala Ekadashi" }, // Pausha
  10: { shukla: "Jaya Ekadashi (Bhaimi)", krishna: "Shat-Tila Ekadashi" }, // Magha
  11: { shukla: "Amalaki Ekadashi", krishna: "Vijaya Ekadashi" }, // Phalguna
};

/**
 * Calculates Moon illumination and Phase Emoji based on Sun-Moon angle
 */
function getMoonPhase(angleDiff: number): { emoji: string; illumination: number } {
  const illFraction = (1 - Math.cos((angleDiff * Math.PI) / 180)) / 2;
  const illumination = Math.round(illFraction * 100);

  let emoji = "🌑";
  if (angleDiff < 15 || angleDiff > 345) emoji = "🌑"; // New Moon
  else if (angleDiff >= 15 && angleDiff < 75) emoji = "🌒"; // Waxing Crescent
  else if (angleDiff >= 75 && angleDiff < 105) emoji = "🌓"; // First Quarter
  else if (angleDiff >= 105 && angleDiff < 165) emoji = "🌔"; // Waxing Gibbous
  else if (angleDiff >= 165 && angleDiff <= 195) emoji = "🌕"; // Full Moon
  else if (angleDiff > 195 && angleDiff <= 255) emoji = "🌖"; // Waning Gibbous
  else if (angleDiff > 255 && angleDiff <= 285) emoji = "🌗"; // Last Quarter
  else emoji = "🌘"; // Waning Crescent

  return { emoji, illumination };
}

/**
 * Derives the exact festivals, fasts, and auspicious celebrations for a given Tithi & Masa
 */
function detectFestivals(
  masaIdx: number,
  paksha: "Shukla" | "Krishna",
  tithiNum: number,
  dayOfWeek: number,
  isSankranti: boolean,
  nakshatraIdx: number
): FestivalEvent[] {
  const list: FestivalEvent[] = [];

  // --- 1. EKADASHI VRATS (11th Tithi) ---
  if (tithiNum === 11) {
    const ekName = paksha === "Shukla" ? EKADASHI_NAMES[masaIdx]?.shukla : EKADASHI_NAMES[masaIdx]?.krishna;
    list.push({
      id: `ekadashi-${masaIdx}-${paksha}`,
      name: `${ekName || "Ekadashi"} Vrat`,
      hindiName: `${ekName || "एकादशी"} व्रत`,
      category: "vrat",
      deity: "Lord Vishnu / Sri Hari",
      significance: "Supreme fasting day dedicated to Lord Vishnu for spiritual purification and liberation.",
      ritual: "Complete fast, chanting Vishnu Sahasranama, avoiding grains/beans, Tulsi offering.",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    });

    if (masaIdx === 8 && paksha === "Shukla") {
      list.push({
        id: "gita-jayanti",
        name: "Gita Jayanti",
        hindiName: "गीता जयंती",
        category: "jayanti",
        deity: "Lord Krishna",
        significance: "The auspicious day Lord Krishna revealed the Srimad Bhagavad Gita to Arjuna at Kurukshetra.",
        ritual: "Recitation of Bhagavad Gita, lighting ghee lamps, philosophical study.",
        badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
      });
    }

    if (masaIdx === 7 && paksha === "Shukla") {
      list.push({
        id: "tulsi-vivah",
        name: "Tulsi Vivah",
        hindiName: "तुलसी विवाह",
        category: "festival",
        deity: "Tulsi Devi & Lord Shaligram",
        significance: "Ceremonial marriage of Tulsi plant with Lord Vishnu, marking start of auspicious wedding season.",
        ritual: "Decorating Tulsi plant as a bride, chanting marriage mantras, offering sweets.",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      });
    }
  }

  // --- 2. PRADOSH VRAT (13th Tithi - Trayodashi) ---
  if (tithiNum === 13) {
    const pradoshType =
      dayOfWeek === 1 ? "Soma Pradosh" : dayOfWeek === 2 ? "Bhauma Pradosh" : dayOfWeek === 6 ? "Shani Pradosh" : "Pradosh Vrat";
    list.push({
      id: `pradosh-${paksha}`,
      name: `${pradoshType} (${paksha})`,
      hindiName: `${pradoshType} (${paksha === "Shukla" ? "शुक्ल" : "कृष्ण"})`,
      category: "vrat",
      deity: "Lord Shiva & Goddess Parvati",
      significance: "Twilight Shiva worship during Sandhya Kaal to eradicate negative karmas and attain peace.",
      ritual: "Abhishekam with milk/water during sunset, chanting Maha Mrityunjaya Mantra, Bilva patra offering.",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    });

    if (masaIdx === 7 && paksha === "Krishna") {
      list.push({
        id: "dhanteras",
        name: "Dhanteras (Dhanvantari Jayanti)",
        hindiName: "धनतेरस / धनवन्तरि जयंती",
        category: "festival",
        deity: "Lord Dhanvantari & Goddess Lakshmi",
        significance: "Appearance of Lord Dhanvantari with Amrita Kalasha, inaugurating the 5-day Deepawali festival.",
        ritual: "Purchasing gold/silver/utensils, lighting 13 Yamadeep lamps at entrance for longevity.",
        badgeColor: "bg-yellow-400/20 text-yellow-300 border-yellow-400/50",
      });
    }
  }

  // --- 3. SHIVARATRI (14th Krishna Tithi - Chaturdashi) ---
  if (paksha === "Krishna" && tithiNum === 14) {
    const isMahaShivaratri = masaIdx === 11 || masaIdx === 10; // Phalguna / Magha
    list.push({
      id: isMahaShivaratri ? "maha-shivaratri" : "masik-shivaratri",
      name: isMahaShivaratri ? "Maha Shivaratri" : "Masik Shivaratri",
      hindiName: isMahaShivaratri ? "महाशिवरात्रि" : "मासिक शिवरात्रि",
      category: "festival",
      deity: "Lord Shiva",
      significance: isMahaShivaratri
        ? "The supreme auspicious cosmic night of Lord Shiva's divine marriage with Mother Parvati & Lingodbhava."
        : "Monthly sacred night dedicated to contemplation on Shiva Tattva.",
      ritual: "Four Prahara night-long Shiva Puja, Rudrabhisheka with Panchamrita, Jagaran.",
      badgeColor: isMahaShivaratri
        ? "bg-purple-500/30 text-purple-200 border-purple-400 font-black shadow-purple-500/30"
        : "bg-purple-500/20 text-purple-300 border-purple-500/40",
    });

    if (masaIdx === 7) {
      list.push({
        id: "narak-chaturdashi",
        name: "Narak Chaturdashi (Chhoti Diwali / Roop Chaudas)",
        hindiName: "नरक चतुर्दशी / छोटी दीपावली",
        category: "festival",
        deity: "Lord Krishna & Kali Mata",
        significance: "Victory of Lord Krishna over demon Narakasura, liberating 16,100 souls.",
        ritual: "Abhyanga Snan before sunrise with sesame oil, lighting evening lamps.",
        badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/40",
      });
    }
  }

  // --- 4. PURNIMA (15th Shukla Tithi - Full Moon) ---
  if (paksha === "Shukla" && tithiNum === 15) {
    let purnimaName = "Purnima Vrat (Satyanarayan Puja)";
    let pHindi = "पूर्णिमा व्रत (सत्यनारायण पूजा)";

    if (masaIdx === 0) {
      purnimaName = "Hanuman Jayanti / Chaitra Purnima";
      pHindi = "हनुमान जयंती / चैत्र पूर्णिमा";
    } else if (masaIdx === 1) {
      purnimaName = "Buddha Purnima (Vaishakha Purnima)";
      pHindi = "बुद्ध पूर्णिमा / वैशाख पूर्णिमा";
    } else if (masaIdx === 2) {
      purnimaName = "Vat Purnima";
      pHindi = "वट पूर्णिमा व्रत";
    } else if (masaIdx === 3) {
      purnimaName = "Guru Purnima (Vyasa Purnima)";
      pHindi = "गुरु पूर्णिमा (व्यास पूर्णिमा)";
    } else if (masaIdx === 4) {
      purnimaName = "Raksha Bandhan / Shravana Purnima";
      pHindi = "रक्षाबंधन / श्रावण पूर्णिमा";
    } else if (masaIdx === 5) {
      purnimaName = "Bhadrapada Purnima (Start of Pitru Paksha)";
      pHindi = "भाद्रपद पूर्णिमा (पितृपक्ष प्रारंभ)";
    } else if (masaIdx === 6) {
      purnimaName = "Sharad Purnima (Kojagiri Purnima)";
      pHindi = "शरद पूर्णिमा / कोजागरी";
    } else if (masaIdx === 7) {
      purnimaName = "Kartik Purnima (Dev Deepawali)";
      pHindi = "कार्तिक पूर्णिमा / देव दीपावली";
    } else if (masaIdx === 8) {
      purnimaName = "Margashirsha Purnima (Dattatreya Jayanti)";
      pHindi = "मार्गशीर्ष पूर्णिमा / दत्तात्रेय जयंती";
    } else if (masaIdx === 9) {
      purnimaName = "Pausha Purnima (Shakambhari Jayanti)";
      pHindi = "पौष पूर्णिमा / शाकंभरी जयंती";
    } else if (masaIdx === 10) {
      purnimaName = "Magha Purnima (Maha Maghi)";
      pHindi = "माघ पूर्णिमा (महा माघी स्नान)";
    } else if (masaIdx === 11) {
      purnimaName = "Holika Dahan (Phalguna Purnima)";
      pHindi = "होलिका दहन / फाल्गुन पूर्णिमा";
    }

    list.push({
      id: `purnima-${masaIdx}`,
      name: purnimaName,
      hindiName: pHindi,
      category: "festival",
      deity: "Sri Satyanarayan / Chandra Deva",
      significance: "Full moon day of highest lunar energy, sacred bathing, and spiritual fullness.",
      ritual: "Satyanarayan Katha, fasting until moonrise, arghya to Chandra Deva, holy river dip.",
      badgeColor: "bg-amber-400/25 text-amber-200 border-amber-300 font-extrabold shadow-sm",
    });
  }

  // --- 5. AMAVASYA (15th Krishna Tithi - New Moon) ---
  if (paksha === "Krishna" && tithiNum === 15) {
    let amavasyaName = "Amavasya (Pitru Tarpana)";
    let aHindi = "अमावस्या (पितृ तर्पण)";

    if (dayOfWeek === 1) {
      amavasyaName = "Somvati Amavasya (Highly Auspicious)";
      aHindi = "सोमवती अमावस्या (अत्यंत फलदायी)";
    } else if (dayOfWeek === 6) {
      amavasyaName = "Shani Amavasya (Shani Shanti)";
      aHindi = "शनि अमावस्या (शनि शांति)";
    }

    if (masaIdx === 7) {
      list.push({
        id: "diwali-lakshmi-puja",
        name: "Diwali (Deepawali / Maha Lakshmi Puja)",
        hindiName: "दीपावली / महालक्ष्मी पूजा",
        category: "festival",
        deity: "Maha Lakshmi, Lord Ganesha & Kuber",
        significance: "The Grand Festival of Lights celebrating the victory of divine light over darkness and Lord Rama's return.",
        ritual: "Lighting clay lamps, grand Lakshmi-Ganesha puja during Pradosh/Nishita Kaal, fireworks.",
        badgeColor: "bg-gradient-to-r from-amber-500/40 to-yellow-500/40 text-amber-100 border-amber-300 font-black shadow-lg",
      });
    } else if (masaIdx === 5 || masaIdx === 6) {
      list.push({
        id: "sarva-pitru-amavasya",
        name: "Sarva Pitru Amavasya (Mahalaya)",
        hindiName: "सर्वपितृ अमावस्या (महालया)",
        category: "vrat",
        deity: "Pitru Devas (Ancestors)",
        significance: "Culmination of Pitru Paksha; sacred shraddha for all departed ancestors.",
        ritual: "Tarpana, offering food to cows/crows/Brahmins, sesame seed offerings.",
        badgeColor: "bg-slate-700/40 text-slate-200 border-slate-600",
      });
    } else if (masaIdx === 10) {
      list.push({
        id: "mauni-amavasya",
        name: "Mauni Amavasya (Magha Amavasya)",
        hindiName: "मौनी अमावस्या",
        category: "vrat",
        deity: "Lord Vishnu / Ganga",
        significance: "Sacred silence (Mauna) fasting day and holy dip at Prayagraj Sangam.",
        ritual: "Observing silent meditation, holy dip, donating sesame seeds and warm blankets.",
        badgeColor: "bg-indigo-500/20 text-indigo-200 border-indigo-500/40",
      });
    } else {
      list.push({
        id: `amavasya-${masaIdx}`,
        name: amavasyaName,
        hindiName: aHindi,
        category: "vrat",
        deity: "Pitru Devas",
        significance: "Monthly new moon day dedicated to ancestral offerings, charity, and introspection.",
        ritual: "Tarpanam, feeding the needy, lighting evening oil lamp under Peepal tree.",
        badgeColor: "bg-slate-800 text-slate-300 border-slate-700",
      });
    }
  }

  // --- 6. NAVRATRI & SPECIAL TITHIS ---
  if (masaIdx === 0 && paksha === "Shukla") {
    if (tithiNum === 1) {
      list.push({
        id: "chaitra-navratri-day1",
        name: "Chaitra Navratri (Ghatasthapana / Hindu New Year)",
        hindiName: "चैत्र नवरात्रि (घटस्थापना / नव संवत्सर)",
        category: "festival",
        deity: "Maa Shailaputri",
        significance: "Beginning of Hindu New Year (Vikrama Samvat) & 9 divine days of Goddess Durga.",
        ritual: "Kalash Sthapana, sowing barley seeds, chanting Durga Saptashati.",
        badgeColor: "bg-red-500/30 text-red-200 border-red-400 font-extrabold",
      });
    } else if (tithiNum === 8) {
      list.push({
        id: "durga-ashtami-chaitra",
        name: "Maha Ashtami (Durga Ashtami)",
        hindiName: "महाष्टमी (दुर्गाष्टमी)",
        category: "festival",
        deity: "Maa Mahagauri",
        significance: "8th sacred day of Navratri, Kumari Puja & Sandhi Puja.",
        ritual: "Kanya Pujan, offering halwa-puri, Sandhi puja.",
        badgeColor: "bg-pink-500/30 text-pink-200 border-pink-400",
      });
    } else if (tithiNum === 9) {
      list.push({
        id: "ram-navami",
        name: "Ram Navami (Lord Rama Janmotsav)",
        hindiName: "रामनवमी (भगवान श्रीराम जन्मोत्सव)",
        category: "festival",
        deity: "Bhagavan Sri Ramachandra",
        significance: "Divine appearance day of Maryada Purushottam Lord Rama at noon in Ayodhya.",
        ritual: "Noon Ram Janma celebration, Ramcharitmanas recitation, panchamrita abhishek.",
        badgeColor: "bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-200 border-amber-400 font-black",
      });
    }
  }

  if (masaIdx === 6 && paksha === "Shukla") {
    if (tithiNum === 1) {
      list.push({
        id: "sharad-navratri-day1",
        name: "Sharad Navratri Begins (Ghatasthapana)",
        hindiName: "शारदीय नवरात्रि प्रारंभ (घटस्थापना)",
        category: "festival",
        deity: "Maa Durga",
        significance: "Grand autumn 9 nights of Goddess Durga's victory over Mahishasura.",
        ritual: "Ghatasthapana, Akhanda Jyoti, fasting and Garba/Dandiya.",
        badgeColor: "bg-red-500/30 text-red-200 border-red-400 font-extrabold",
      });
    } else if (tithiNum === 8) {
      list.push({
        id: "maha-ashtami-sharad",
        name: "Maha Ashtami (Durga Puja)",
        hindiName: "महाष्टमी (दुर्गा पूजा)",
        category: "festival",
        deity: "Maa Mahagauri / Chamunda",
        significance: "Grand Sandhi Puja & Kumari Pujan during Sharad Navratri.",
        ritual: "108 lotus flower offering, Sandhi puja at juncture of Ashtami/Navami.",
        badgeColor: "bg-pink-500/30 text-pink-200 border-pink-400 font-bold",
      });
    } else if (tithiNum === 9) {
      list.push({
        id: "maha-navami",
        name: "Maha Navami (Ayudha Puja)",
        hindiName: "महानवमी (आयुध पूजा)",
        category: "festival",
        deity: "Maa Siddhidatri",
        significance: "Culmination of 9 nights of Durga worship, weapon and instrument blessing.",
        ritual: "Worship of books, vehicles, instruments, and havan.",
        badgeColor: "bg-orange-500/30 text-orange-200 border-orange-400 font-bold",
      });
    } else if (tithiNum === 10) {
      list.push({
        id: "dussehra-vijayadashami",
        name: "Dussehra (Vijayadashami)",
        hindiName: "दशहरा (विजयादशमी)",
        category: "festival",
        deity: "Lord Rama & Goddess Durga",
        significance: "Victory of Dharma over Adharma (Rama slays Ravana, Durga slays Mahishasura).",
        ritual: "Effigy burning of Ravana, Shami tree worship, beginning new auspicious ventures.",
        badgeColor: "bg-gradient-to-r from-red-600/30 to-amber-600/30 text-yellow-200 border-amber-400 font-black",
      });
    }
  }

  // --- 7. LORD KRISHNA & GANESHA ---
  if (masaIdx === 5 && paksha === "Krishna" && tithiNum === 8) {
    list.push({
      id: "krishna-janmashtami",
      name: "Krishna Janmashtami (Gokulashtami)",
      hindiName: "श्रीकृष्ण जन्माष्टमी (गोकुलाष्टमी)",
      category: "festival",
      deity: "Bhagavan Sri Krishna",
      significance: "Midnight appearance of the Supreme Personality of Godhead Lord Krishna in Mathura.",
      ritual: "Midnight abhishek with milk/curd/honey, fasting until midnight, Dahi Handi, Bhagavad Gita reading.",
      badgeColor: "bg-gradient-to-r from-blue-600/40 to-indigo-600/40 text-blue-100 border-blue-400 font-black shadow-lg",
    });
  }

  if (masaIdx === 5 && paksha === "Shukla" && tithiNum === 4) {
    list.push({
      id: "ganesh-chaturthi",
      name: "Ganesh Chaturthi (Vinayaka Chavithi)",
      hindiName: "गणेश चतुर्थी (विनायक चविथी)",
      category: "festival",
      deity: "Lord Ganesha (Vighnaharta)",
      significance: "10-day Ganeshotsav festival celebrating the birth of Lord Ganesha.",
      ritual: "Ganesh Sthapana, 21 Modaka offering, Durva grass offering, chanting Atharvashirsha.",
      badgeColor: "bg-red-500/30 text-amber-100 border-red-400 font-black shadow-md",
    });
  }

  if (tithiNum === 4) {
    if (paksha === "Krishna" && !(masaIdx === 7)) {
      list.push({
        id: `sankashti-chaturthi-${masaIdx}`,
        name: "Sankashti Chaturthi Vrat",
        hindiName: "संकष्टी चतुर्थी व्रत",
        category: "vrat",
        deity: "Lord Ganesha",
        significance: "Fasting to remove all hurdles and obstacles, broken after moonrise.",
        ritual: "Fasting throughout day, Ganesha puja, giving arghya to Moon at night.",
        badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      });
    } else if (paksha === "Shukla" && !(masaIdx === 5)) {
      list.push({
        id: `vinayaka-chaturthi-${masaIdx}`,
        name: "Vinayaka Chaturthi",
        hindiName: "विनायक चतुर्थी",
        category: "vrat",
        deity: "Lord Ganesha",
        significance: "Monthly day for intellect, wisdom and obstacle-free undertakings.",
        ritual: "Midday Ganesha puja with modak and red flowers.",
        badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      });
    }
  }

  if (masaIdx === 7 && paksha === "Krishna" && tithiNum === 4) {
    list.push({
      id: "karwa-chauth",
      name: "Karwa Chauth (Karak Chaturthi)",
      hindiName: "करवा चौथ (करक चतुर्थी)",
      category: "vrat",
      deity: "Goddess Parvati & Lord Shiva",
      significance: "Nirjala fast observed by married women for the longevity and prosperity of their husbands.",
      ritual: "Nirjala fast throughout day, evening Karwa puja, sighting moon through sieve.",
      badgeColor: "bg-pink-600/30 text-pink-100 border-pink-400 font-black",
    });
  }

  if (masaIdx === 7 && paksha === "Krishna" && tithiNum === 8) {
    list.push({
      id: "ahoi-ashtami",
      name: "Ahoi Ashtami Vrat",
      hindiName: "अहोई अष्टमी व्रत",
      category: "vrat",
      deity: "Maa Ahoi",
      significance: "Maternal fasting day for the well-being and protection of children.",
      ritual: "Fasting until star-rise (Tarodaya) or moonrise, painting Ahoi Mata emblem.",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    });
  }

  if (masaIdx === 7 && paksha === "Shukla" && tithiNum === 6) {
    list.push({
      id: "chhath-puja",
      name: "Chhath Puja (Surya Shashthi / Dala Chhath)",
      hindiName: "छठ पूजा (सूर्य षष्ठी / डाला छठ)",
      category: "festival",
      deity: "Surya Deva & Chhathi Maiya",
      significance: "Ancient 4-day Vedic sun-worship festival of purity, discipline and solar gratitude.",
      ritual: "36-hour waterless fast, offering evening and morning Arghya to the setting and rising Sun in rivers.",
      badgeColor: "bg-gradient-to-r from-amber-500/40 to-red-500/40 text-amber-100 border-amber-300 font-black shadow-md",
    });
  }

  if (masaIdx === 7 && paksha === "Shukla") {
    if (tithiNum === 1) {
      list.push({
        id: "govardhan-puja",
        name: "Govardhan Puja (Annakut)",
        hindiName: "गोवर्धन पूजा (अन्नकूट)",
        category: "festival",
        deity: "Giriraj Govardhan & Sri Krishna",
        significance: "Commemorates Lord Krishna lifting Mount Govardhan to shield Vrindavan from Indra's storm.",
        ritual: "Crafting cow-dung hillock, offering 56 bhog varieties, cow veneration.",
        badgeColor: "bg-emerald-600/30 text-emerald-100 border-emerald-400 font-bold",
      });
    } else if (tithiNum === 2) {
      list.push({
        id: "bhai-dooj",
        name: "Bhai Dooj (Yama Dwitiya)",
        hindiName: "भाई दूज (यम द्वितीया)",
        category: "festival",
        deity: "Yamaraja & Yamuna Devi",
        significance: "Celebration of sibling affection and protection against premature demise.",
        ritual: "Sister applies tilak on brother's forehead, mutual feast and exchange of gifts.",
        badgeColor: "bg-rose-500/25 text-rose-200 border-rose-400 font-bold",
      });
    }
  }

  if (masaIdx === 10 && paksha === "Shukla" && tithiNum === 5) {
    list.push({
      id: "vasant-panchami",
      name: "Vasant Panchami (Saraswati Puja)",
      hindiName: "बसंत पंचमी (सरस्वती पूजा)",
      category: "festival",
      deity: "Goddess Saraswati",
      significance: "Welcoming the spring season and celebrating the goddess of knowledge, arts, and music.",
      ritual: "Wearing yellow attire, worshipping books and musical instruments, offering yellow flowers.",
      badgeColor: "bg-yellow-400/30 text-yellow-200 border-yellow-300 font-black",
    });
  }

  if (masaIdx === 0 && paksha === "Krishna" && tithiNum === 1) {
    list.push({
      id: "holi-dulhandi",
      name: "Holi (Rangwali Holi / Dhulandi)",
      hindiName: "होली (रंगवाली होली / धुलंडी)",
      category: "festival",
      deity: "Lord Krishna & Radha Rani",
      significance: "Ecstatic festival of colors, fraternal love, spring blossoming, and joy.",
      ritual: "Applying colored abir/gulal, embracing loved ones, savoring festive delicacies (gujiya).",
      badgeColor: "bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-yellow-500/40 text-white border-pink-400 font-black shadow-md",
    });
  }

  if (masaIdx === 1 && paksha === "Shukla" && tithiNum === 3) {
    list.push({
      id: "akshaya-tritiya",
      name: "Akshaya Tritiya (Akha Teej)",
      hindiName: "अक्षय तृतीया (आखा तीज)",
      category: "festival",
      deity: "Lord Vishnu & Goddess Lakshmi",
      significance: "Day of eternal un-decaying prosperity, charity, and flawless auspicious beginnings.",
      ritual: "Buying gold, charitable donations (Dana), initiating new projects, worshipping Lakshmi-Narayana.",
      badgeColor: "bg-amber-300/30 text-amber-100 border-amber-300 font-black shadow-md",
    });
  }

  if (masaIdx === 4 && paksha === "Shukla" && tithiNum === 5) {
    list.push({
      id: "nag-panchami",
      name: "Nag Panchami",
      hindiName: "नाग पंचमी",
      category: "festival",
      deity: "Naga Devas / Ananta / Vasuki",
      significance: "Traditional veneration of serpents for protection against poison and Kaal Sarp afflictions.",
      ritual: "Offering milk to serpent deities, drawing snake idols with turmeric.",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    });
  }

  if (masaIdx === 3 && paksha === "Shukla" && tithiNum === 2) {
    list.push({
      id: "ratha-yatra",
      name: "Jagannath Ratha Yatra (Puri)",
      hindiName: "जगन्नाथ रथयात्रा",
      category: "festival",
      deity: "Lord Jagannath, Balabhadra & Subhadra",
      significance: "Grand Chariot procession of Lord Jagannath visiting Gundicha Temple in Puri.",
      ritual: "Pulling the sacred chariots, chanting Mahamantra.",
      badgeColor: "bg-red-500/25 text-red-200 border-red-400 font-bold",
    });
  }

  return list;
}

/**
 * Computes the complete Tithi Calendar for any given Year and Month
 */
export function getMonthlyTithiCalendar(
  year: number,
  month: number, // 1 to 12
  location: GeoLocation,
  ayanamshaType = "Lahiri"
): MonthlyTithiCalendarResult {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0 = Sunday, 1 = Monday...

  const days: DailyTithiPanchanga[] = [];
  const majorFestivals: { date: Date; dateFormatted: string; festival: FestivalEvent }[] = [];
  let purnimaDate: Date | undefined;
  let amavasyaDate: Date | undefined;
  const ekadashiDates: Date[] = [];
  const pradoshDates: Date[] = [];

  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth() + 1;
  const todayD = today.getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const tzOffset = location.timezoneOffsetHours || 5.5;
    const localHour = 6.0; // 6 AM (Udaya Tithi anchor)
    const utcHour = (localHour - tzOffset + 24) % 24;
    const utcDayAdjustment = localHour - tzOffset < 0 ? d - 1 : d;

    const dateAnchor = new Date(Date.UTC(year, month - 1, utcDayAdjustment, Math.floor(utcHour), Math.round((utcHour % 1) * 60)));

    const astroTime = Astronomy.MakeTime(dateAnchor);
    const jd = astroTime.ut;
    const ayanamsha = getAyanamsha(jd, ayanamshaType as any);

    // Compute Sun & Moon coordinates
    const sunGeo = Astronomy.GeoVector(Astronomy.Body.Sun, astroTime, true);
    const moonGeo = Astronomy.GeoVector(Astronomy.Body.Moon, astroTime, true);
    const sunEcl = Astronomy.Ecliptic(sunGeo);
    const moonEcl = Astronomy.Ecliptic(moonGeo);

    const sunSidereal = toSiderealLongitude(sunEcl.elon, ayanamsha);
    const moonSidereal = toSiderealLongitude(moonEcl.elon, ayanamsha);

    // Solar Sign Index (0 = Aries, 1 = Taurus... 11 = Pisces)
    const sunRashiIdx = Math.floor(sunSidereal / 30);
    // Lunar Month (Masa): Sun in Meena(11) -> Chaitra(0), Mesha(0) -> Vaishakha(1)...
    const lunarMasaIdx = (sunRashiIdx + 1) % 12;
    const masaMeta = LUNAR_MASA_NAMES[lunarMasaIdx];

    // Moon - Sun Elongation (0 to 360)
    const diff = (moonEcl.elon - sunEcl.elon + 360) % 360;
    const tithiIndex = Math.floor(diff / 12); // 0 to 29
    const paksha: "Shukla" | "Krishna" = tithiIndex < 15 ? "Shukla" : "Krishna";
    const tithiNum = (tithiIndex % 15) + 1; // 1 to 15
    const progressPercent = Math.round(((diff % 12) / 12) * 100);

    const tithiName = TITHI_NAMES[tithiNum - 1];
    const tithiHindi = TITHI_HINDI_NAMES[tithiNum - 1];

    const moonPhase = getMoonPhase(diff);

    // Nakshatra of Moon
    const nakshatra = getNakshatra(moonSidereal);

    // Yoga: (Sun tropical + Moon tropical) / 13° 20'
    const yogaSum = (sunEcl.elon + moonEcl.elon) % 360;
    const yogaIdx = Math.floor(yogaSum / (360 / 27));
    const yogaName = YOGA_NAMES[yogaIdx] || "Shobhana";

    // Karana: Half of Tithi (diff / 6°)
    const karanaIdx = Math.floor(diff / 6) % 11;
    const karanaName = KARANA_NAMES[karanaIdx] || "Bava";
    const isBhadra = karanaName.includes("Vishti");

    const dateObj = new Date(year, month - 1, d);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday
    const vara = VARA_INFO[dayOfWeek];

    const isToday = year === todayY && month === todayM && d === todayD;
    const isPurnima = paksha === "Shukla" && tithiNum === 15;
    const isAmavasya = paksha === "Krishna" && tithiNum === 15;
    const isEkadashi = tithiNum === 11;
    const isPradosh = tithiNum === 13;
    const isShivaratri = paksha === "Krishna" && tithiNum === 14;
    const isSankranti = Math.floor(sunSidereal % 30) === 0;

    if (isPurnima) purnimaDate = dateObj;
    if (isAmavasya) amavasyaDate = dateObj;
    if (isEkadashi) ekadashiDates.push(dateObj);
    if (isPradosh) pradoshDates.push(dateObj);

    const ekadashiName = isEkadashi
      ? paksha === "Shukla"
        ? EKADASHI_NAMES[lunarMasaIdx]?.shukla
        : EKADASHI_NAMES[lunarMasaIdx]?.krishna
      : undefined;

    // Detect Celebrations & Festivals
    const festivals = detectFestivals(
      lunarMasaIdx,
      paksha,
      tithiNum,
      dayOfWeek,
      isSankranti,
      nakshatra.index
    );

    festivals.forEach((f) => {
      majorFestivals.push({
        date: dateObj,
        dateFormatted: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" }),
        festival: f,
      });
    });

    const sunriseStr = "05:45 AM";
    const sunsetStr = "06:35 PM";
    const rahuKaalStr = ["04:30 PM - 06:00 PM", "07:30 AM - 09:00 AM", "03:00 PM - 04:30 PM", "12:00 PM - 01:30 PM", "01:30 PM - 03:00 PM", "10:30 AM - 12:00 PM", "09:00 AM - 10:30 AM"][dayOfWeek];
    const abhijitStr = "11:50 AM - 12:40 PM";
    const brahmaStr = "04:15 AM - 05:00 AM";

    days.push({
      date: dateObj,
      dateString: `${year}-${month.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`,
      dayOfMonth: d,
      dayOfWeek,
      dayName: vara.name,
      sanskritVara: vara.sanskrit,
      varaLord: vara.lord,
      tithi: {
        index: tithiIndex,
        name: tithiName,
        hindiName: tithiHindi,
        paksha,
        pakshaHindi: paksha === "Shukla" ? "शुक्ल पक्ष" : "कृष्ण पक्ष",
        tithiNumber: tithiNum,
        moonPhaseEmoji: moonPhase.emoji,
        illuminationPercent: moonPhase.illumination,
        progressPercent,
      },
      lunarMonth: {
        index: lunarMasaIdx,
        name: masaMeta.name,
        hindiName: masaMeta.hindiName,
        solarMasa: getRashi(sunSidereal).sanskritName,
      },
      nakshatra: {
        index: nakshatra.index,
        name: nakshatra.sanskritName,
        sanskritName: nakshatra.sanskritName,
        lord: nakshatra.lord,
        deity: nakshatra.deity,
        pada: nakshatra.pada,
      },
      yoga: {
        index: yogaIdx,
        name: yogaName,
      },
      karana: {
        index: karanaIdx,
        name: karanaName,
        isBhadra,
      },
      timings: {
        sunrise: sunriseStr,
        sunset: sunsetStr,
        rahuKaal: rahuKaalStr,
        abhijitMuhurta: abhijitStr,
        brahmaMuhurta: brahmaStr,
      },
      isToday,
      isPurnima,
      isAmavasya,
      isEkadashi,
      isPradosh,
      isShivaratri,
      isSankranti,
      ekadashiName,
      festivals,
    });
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthHindiNames = [
    "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
    "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
  ];

  const totalCells = firstDayOfWeek + daysInMonth;
  const paddingAfter = (7 - (totalCells % 7)) % 7;

  return {
    year,
    month,
    monthName: monthNames[month - 1],
    monthHindi: monthHindiNames[month - 1],
    totalDays: daysInMonth,
    days,
    paddingBefore: firstDayOfWeek,
    paddingAfter,
    majorFestivals,
    purnimaDate,
    amavasyaDate,
    ekadashiDates,
    pradoshDates,
  };
}
