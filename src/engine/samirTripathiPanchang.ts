/**
 * Classical Vedic Daily Panchanga & Astro Guidance Engine (दैनिक पञ्चाङ्ग एवं ज्योतिषीय परामर्श)
 * Shastric Methodology inspired by Dr. Samir Tripathi (Medhaj Astro) & Classical Granthas:
 * - Muhurta Chintamani (मुहूर्त चिन्तामणि)
 * - Brihat Samhita (बृहत् संहिता)
 * - Kalaprakasika (कालप्रकाशिका)
 * - Narada Samhita (नारद संहिता)
 */

import * as Astronomy from "astronomy-engine";
import { GeoLocation, AyanamshaType } from "./types";
import { calculateVedicEphemeris } from "./ephemeris";
import { getRashi } from "./rashiNakshatra";
import { TITHI_NAMES, YOGA_NAMES, RASHIS } from "./constants";

export interface TithiSpanStatus {
  isKshaya: boolean;
  isVriddhi: boolean;
  statusText: string;
  shastricGuidance: string;
}

export interface LunarMonthDetail {
  amantaMonth: string; // e.g. "Bhadrapada (भाद्रपद)"
  purnimantaMonth: string; // e.g. "Ashwina (आश्विन)"
  vikramSamvat: number; // e.g. 2083
  shakaSamvat: number; // e.g. 1948
  ayanam: "Uttarayana (उत्तरायण)" | "Dakshinayana (दक्षिणायन)";
  ritu: "Vasanta (वसन्त)" | "Grishma (ग्रीष्म)" | "Varsha (वर्षा)" | "Sharad (शरद्)" | "Hemanta (हेमन्त)" | "Shishira (शिशिर)";
  rituHindi: string;
  isAdhikaMasa: boolean;
}

export interface TithiDetail {
  index: number; // 0 to 29
  tithiNumber: number; // 1 to 15
  name: string;
  hindiName: string;
  sanskritName: string;
  paksha: "Shukla" | "Krishna";
  pakshaHindi: string;
  category: "Nanda" | "Bhadra" | "Jaya" | "Rikta" | "Purna";
  categoryHindi: string;
  deity: string;
  tatva: "Agni" | "Prithvi" | "Vayu" | "Jala" | "Akasha";
  tatvaHindi: string;
  significance: string;
  spanStatus: TithiSpanStatus;
  endTime: Date;
  endTimeFormatted: string;
  remainingHoursFormatted: string;
  moonPhaseEmoji: string;
  illuminationPercent: number;
}

export interface VaraDetail {
  dayOfWeek: number; // 0 = Sunday
  dayName: string;
  hindiName: string;
  sanskritName: string;
  rulingPlanet: string;
  planetHindi: string;
  deity: string;
  tatva: string;
  auspiciousColors: string[];
  inauspiciousColors: string[];
  exitRemedy: string; // What to eat/do before leaving home (घर से निकलने से पूर्व उपाय)
  dayMantra: string; // Vedic/Puranic Beej Mantra
  recommendedCharity: string; // Daan
  activitiesFavorable: string[];
}

export interface NakshatraDetail {
  index: number; // 0 to 26
  name: string;
  hindiName: string;
  sanskritName: string;
  lord: string;
  deity: string;
  pada: number;
  gana: "Deva" | "Manushya" | "Rakshasa";
  yoni: string;
  nadi: "Adi" | "Madhya" | "Antya";
  nature: "Kshipra (Laghu)" | "Dhruva (Sthira)" | "Chara (Chala)" | "Mridu (Maitra)" | "Ugra (Kroora)" | "Mishra (Sadharana)" | "Tikshna (Daruna)";
  natureHindi: string;
  favorableActivities: string;
  endTime: Date;
  endTimeFormatted: string;
  remainingHoursFormatted: string;
}

export interface YogaDetail {
  index: number; // 0 to 26
  name: string;
  hindiName: string;
  sanskritName: string;
  nature: "Shubha (Auspicious)" | "Ashubha (Inauspicious)" | "Ati-Shubha (Highly Auspicious)";
  deity: string;
  description: string;
  favorableActs: string;
  prohibitedActs: string;
  endTime: Date;
  endTimeFormatted: string;
}

export interface KaranaDetail {
  index: number;
  name: string;
  hindiName: string;
  type: "Chara (Movable)" | "Sthira (Fixed)";
  rulingDeity: string;
  isBhadra: boolean;
  bhadraVaas?: "Swarga Loka" | "Patala Loka" | "Bhu Loka (Mrityu Loka)";
  bhadraVaasHindi?: string;
  bhadraImpact?: string;
  endTime: Date;
  endTimeFormatted: string;
}

export interface DishaShoolDetail {
  prohibitedDirection: "East (पूर्व)" | "West (पश्चिम)" | "North (उत्तर)" | "South (दक्षिण)";
  reason: string;
  parihara: string; // Step-by-step remedy if travel is unavoidable
  chandraVaas: string; // Moon residence direction (यात्रा में चन्द्र सम्मुख/दाहिना शुभ)
  chandraRashi: string;
}

export interface MuhurtaSlot {
  name: string;
  hindiName: string;
  sanskritName: string;
  type: "Auspicious" | "Inauspicious" | "Neutral";
  startTime: Date;
  endTime: Date;
  startFormatted: string;
  endFormatted: string;
  durationFormatted: string;
  isActiveNow: boolean;
  quality: string;
  description: string;
  precautions?: string;
}

export interface ChandraBalaRashi {
  rashiIndex: number;
  rashiName: string;
  hindiName: string;
  symbol: string;
  houseFromMoon: number;
  strength: "Shubha (Auspicious)" | "Madhyama (Moderate)" | "Ashubha (Chandrashtama / Caution)";
  badgeColor: string;
  guidance: string;
}

export interface DailySamirTripathiPanchang {
  evaluationDate: Date;
  location: GeoLocation;
  cityName: string;
  sunrise: Date;
  sunset: Date;
  nextSunrise: Date;
  sunriseFormatted: string;
  sunsetFormatted: string;
  dayDurationFormatted: string;
  nightDurationFormatted: string;

  // Vedic Calendar Context
  lunarMonth: LunarMonthDetail;

  // 5 Core Limbs
  tithi: TithiDetail;
  vara: VaraDetail;
  nakshatra: NakshatraDetail;
  yoga: YogaDetail;
  karana: KaranaDetail;

  // Astrological Tips & Guidance
  dishaShool: DishaShoolDetail;
  auspiciousColors: string[];
  inauspiciousColors: string[];
  dayMantra: string;
  recommendedCharity: string;
  exitRemedy: string;

  // Auspicious & Inauspicious Muhurtas
  auspiciousMuhurtas: MuhurtaSlot[];
  inauspiciousMuhurtas: MuhurtaSlot[];
  activeMuhurtaNow: MuhurtaSlot | null;

  // Chandra Bala for all 12 Rashis
  chandraRashi: string;
  chandraRashiHindi: string;
  chandraBalaList: ChandraBalaRashi[];

  // Shuddhi Score
  shuddhiScore: number;
  panchangaSummary: string;
}

// Helper: Format time as "hh:mm AM/PM"
function formatTime12h(d: Date): string {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

// Tithi Categories & Tatvas
const TITHI_CATEGORIES: Array<{
  category: "Nanda" | "Bhadra" | "Jaya" | "Rikta" | "Purna";
  categoryHindi: string;
  deity: string;
  tatva: "Agni" | "Prithvi" | "Vayu" | "Jala" | "Akasha";
  tatvaHindi: string;
  significance: string;
}> = [
  { category: "Nanda", categoryHindi: "नन्दा (आनन्ददायिनी)", deity: "Agni (अग्नि)", tatva: "Agni", tatvaHindi: "अग्नि तत्व", significance: "Good for festive works, art, clothes, pleasure." },
  { category: "Bhadra", categoryHindi: "भद्रा (कल्याणकारिणी)", deity: "Brahma (ब्रह्मा)", tatva: "Prithvi", tatvaHindi: "पृथ्वी तत्व", significance: "Good for permanent works, buildings, vehicles, friendships." },
  { category: "Jaya", categoryHindi: "जया (विजयदायिनी)", deity: "Kartikeya (कार्तिकेय)", tatva: "Vayu", tatvaHindi: "वायु तत्व", significance: "Good for winning battles, litigation, sports, competition, courage." },
  { category: "Rikta", categoryHindi: "रिक्ता (हानिकारिणी)", deity: "Kali / Shiva (काली)", tatva: "Jala", tatvaHindi: "जल तत्व", significance: "Inauspicious for new beginnings; good for destroying obstacles, warfare, surgery." },
  { category: "Purna", categoryHindi: "पूर्णा (पूर्ण फलदायिनी)", deity: "Vishnu / Chandra (विष्णु)", tatva: "Akasha", tatvaHindi: "आकाश तत्व", significance: "Excellent for all auspicious beginnings, marriage, religious ceremonies." },
];

// Weekday Meta (Vara)
const VARA_DATA: Array<{
  dayName: string;
  hindiName: string;
  sanskritName: string;
  rulingPlanet: string;
  planetHindi: string;
  deity: string;
  tatva: string;
  auspiciousColors: string[];
  inauspiciousColors: string[];
  exitRemedy: string;
  dayMantra: string;
  recommendedCharity: string;
  prohibitedDirection: "East (पूर्व)" | "West (पश्चिम)" | "North (उत्तर)" | "South (दक्षिण)";
  activitiesFavorable: string[];
}> = [
  {
    dayName: "Sunday",
    hindiName: "रविवार (भानुवार)",
    sanskritName: "रविवासरः",
    rulingPlanet: "Sun (सूर्य)",
    planetHindi: "भगवान सूर्यदेव",
    deity: "Lord Surya & Gayatri Devi",
    tatva: "Agni (Fire)",
    auspiciousColors: ["Saffron (केसरिया)", "Ruby Red (लाल)", "Golden Yellow (सुनहरा)", "Bright Orange (नारंगी)"],
    inauspiciousColors: ["Dark Blue (गहरा नीला)", "Black (काला)"],
    exitRemedy: "घर से निकलने से पूर्व थोड़ा सा मीठा पान खाएं, या गुड़ खाकर थोड़ा जल पिएं, अथवा शीशा देखकर निकलें।",
    dayMantra: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः || ॐ घृणिः सूर्याय नमः ||",
    recommendedCharity: "तांबे का बर्तन, गुड़, गेहूं, लाल पुष्प अथवा माणिक्य का दान।",
    prohibitedDirection: "West (पश्चिम)",
    activitiesFavorable: ["Government contracts", "Meeting leaders/superiors", "Taking medicine/health treatments", "Coronation/admin deeds"],
  },
  {
    dayName: "Monday",
    hindiName: "सोमवार (इन्दुवार)",
    sanskritName: "सोमवासरः",
    rulingPlanet: "Moon (चन्द्र)",
    planetHindi: "भगवान चन्द्रदेव एवं देवाधिदेव महादेव",
    deity: "Lord Shiva & Chandra Deva",
    tatva: "Jala (Water)",
    auspiciousColors: ["Pearl White (दूधिया सफेद)", "Silver (चांदी जैसा)", "Cream (मलाई रंग)", "Sky Blue (हल्का आसमानी)"],
    inauspiciousColors: ["Dark Red (गहरा लाल)", "Jet Black (गहरा काला)"],
    exitRemedy: "घर से निकलने से पूर्व दर्पण (शीशा) में अपना मुख देखें, या दो घूंट कच्चा दूध अथवा दही का सेवन करके निकलें।",
    dayMantra: "ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः || ॐ नमः शिवाय ||",
    recommendedCharity: "चावल, सफेद वस्त्र, दूध, चीनी, चांदी अथवा शंख का दान।",
    prohibitedDirection: "East (पूर्व)",
    activitiesFavorable: ["Water/liquids trade", "Agriculture", "Public relations", "Maternal blessings", "Art & poetry"],
  },
  {
    dayName: "Tuesday",
    hindiName: "मंगलवार (भौमवार)",
    sanskritName: "भौमवासरः",
    rulingPlanet: "Mars (मंगल)",
    planetHindi: "मंगल देव एवं श्री हनुमान जी",
    deity: "Lord Hanuman, Kartikeya & Mangal Deva",
    tatva: "Agni (Fire)",
    auspiciousColors: ["Crimson Red (सिन्दूरी लाल)", "Scarlet (गहरा लाल)", "Bright Coral (मूंगा रंग)", "Orange (नारंगी)"],
    inauspiciousColors: ["Emerald Green (हरा)", "Sea Green (समुद्री हरा)"],
    exitRemedy: "घर से निकलने से पूर्व थोड़ा सा गुड़ (Jaggery) खाएं अथवा साबुत धनिया मुंह में रखकर निकलें, और 'ॐ हनुमते नमः' का 3 बार स्मरण करें।",
    dayMantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः || ॐ हं हनुमते रुद्रात्मकाय हुं फट् ||",
    recommendedCharity: "गुड़, मसूर की दाल, लाल चंदन, तांबा अथवा लाल वस्त्र का दान।",
    prohibitedDirection: "North (उत्तर)",
    activitiesFavorable: ["Land purchases", "Real estate", "Surgery", "Sports/courage", "Legal defense", "Police/military works"],
  },
  {
    dayName: "Wednesday",
    hindiName: "बुधवार (सौम्यवार)",
    sanskritName: "सौम्यवासरः",
    rulingPlanet: "Mercury (बुध)",
    planetHindi: "बुध देव एवं भगवान श्री गणेश",
    deity: "Lord Ganesha & Lord Vishnu",
    tatva: "Prithvi (Earth)",
    auspiciousColors: ["Emerald Green (पन्ना हरा)", "Parrot Green (तोतिया हरा)", "Mint Green (हल्का हरा)", "Pistachio (पिस्ता रंग)"],
    inauspiciousColors: ["Dark Red (गहरा लाल)"],
    exitRemedy: "घर से निकलने से पूर्व हरी सौंफ, हरा धनिया या तिल खाकर निकलें और भगवान श्री गणेश को दूर्वा अर्पित करके नमन करें।",
    dayMantra: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः || ॐ गं गणपतये नमः ||",
    recommendedCharity: "हरी मूंग दाल, हरी सब्जियां, कांस्य बर्तन अथवा हरे वस्त्र का दान (विशेषकर किन्नरों को)।",
    prohibitedDirection: "North (उत्तर)",
    activitiesFavorable: ["Trading/stock market", "Writing/publishing", "Signing contracts", "Education", "IT/computing", "Accounts"],
  },
  {
    dayName: "Thursday",
    hindiName: "बृहस्पतिवार (गुरुवार)",
    sanskritName: "गुरुवासरः",
    rulingPlanet: "Jupiter (बृहस्पति)",
    planetHindi: "देवगुरु बृहस्पति एवं भगवान श्री हरि विष्णु",
    deity: "Lord Vishnu, Dakshinamurthy & Brihaspati",
    tatva: "Akasha (Ether)",
    auspiciousColors: ["Bright Yellow (हल्दी पीला)", "Saffron (केसरिया)", "Gold (स्वर्णिम)", "Mustard Yellow (सरसों पीला)"],
    inauspiciousColors: ["Black (काला)", "Dark Charcoal (गहरा स्लेटी)"],
    exitRemedy: "घर से निकलने से पूर्व पीले रंग की सरसों खाएं, या केसर/हल्दी का तिलक लगाएं, अथवा थोड़ी चने की दाल / गुड़ खाकर निकलें।",
    dayMantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः || ॐ नमो भगवते वासुदेवाय ||",
    recommendedCharity: "चने की दाल, हल्दी, पीला वस्त्र, धार्मिक पुस्तकें, पीला फल (केला) अथवा स्वर्ण का दान।",
    prohibitedDirection: "South (दक्षिण)",
    activitiesFavorable: ["Spiritual initiation", "Higher learning", "Consulting advisors/gurus", "Gold investment", "Marriage rituals"],
  },
  {
    dayName: "Friday",
    hindiName: "शुक्रवार (भृगुवार)",
    sanskritName: "भृगुवासरः",
    rulingPlanet: "Venus (शुक्र)",
    planetHindi: "दैत्यगुरु शुक्राचार्य एवं मां महालक्ष्मी",
    deity: "Goddess Mahalakshmi & Shukra Deva",
    tatva: "Jala (Water)",
    auspiciousColors: ["Shimmering White (चमकदार सफेद)", "Pastel Pink (गुलाबी)", "Cream (मलाई रंग)", "Silver (चांदी)"],
    inauspiciousColors: ["Mustard Yellow (पीला)", "Rust (भूरा)"],
    exitRemedy: "घर से निकलने से पूर्व मीठा दही (Curd with sugar) खाएं अथवा मिश्री मुंह में रखकर 'ॐ श्रीं महालक्ष्म्यै नमः' का ध्यान करें।",
    dayMantra: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः || ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः ||",
    recommendedCharity: "सफेद रेशमी वस्त्र, मिश्री, चावल, खीर, इत्र अथवा घी का दान किसी कन्या या सुहागिन स्त्री को।",
    prohibitedDirection: "West (पश्चिम)",
    activitiesFavorable: ["Luxury purchases", "Jewellery/fashion", "Buying vehicle", "Music/arts/cinema", "Romance & matchmaking"],
  },
  {
    dayName: "Saturday",
    hindiName: "शनिवार (मन्दवार)",
    sanskritName: "शनिवासरः",
    rulingPlanet: "Saturn (शनि)",
    planetHindi: "सूर्यपुत्र कर्मफलदाता शनिदेव एवं भैरव देव",
    deity: "Lord Shani, Lord Bhairava & Lord Hanuman",
    tatva: "Vayu (Air)",
    auspiciousColors: ["Navy Blue (गहरा नीला)", "Charcoal (स्लेटी)", "Royal Blue (शाही नीला)", "Black (काला)"],
    inauspiciousColors: ["Bright Red (चटक लाल)", "Bright Saffron (चटक केसरिया)"],
    exitRemedy: "घर से निकलने से पूर्व थोड़ा सा अदरक (Ginger) खाएं अथवा सरसों के तेल का स्पर्श करके निकलें, और 'ॐ शं शनैश्चराय नमः' का 3 बार जप करें।",
    dayMantra: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः || ॐ नीलांजनसमाभासं रविपुत्रं यमाग्रजम् ||",
    recommendedCharity: "काले तिल, उड़द की दाल, सरसों का तेल, लोहा, काला छाता, कंबल अथवा जूते का दान।",
    prohibitedDirection: "East (पूर्व)",
    activitiesFavorable: ["Factory setup", "Heavy machinery", "Mining/oil/coal", "Hiring staff/labor", "Renunciation & discipline"],
  },
];

// Nakshatra Qualities
const NAKSHATRA_NATURES: Record<number, { nature: NakshatraDetail["nature"]; natureHindi: string; favorable: string }> = {
  0: { nature: "Kshipra (Laghu)", natureHindi: "क्षिप्र (लघु)", favorable: "Medicines, travel, jewellery, education, vehicle start." }, // Ashwini
  1: { nature: "Ugra (Kroora)", natureHindi: "उग्र (क्रूर)", favorable: "Demolition, warfare, fire, surgery, weapon testing." }, // Bharani
  2: { nature: "Mishra (Sadharana)", natureHindi: "मिश्र (साधारण)", favorable: "Fire sacrifices, metals, welding, courage." }, // Krittika
  3: { nature: "Dhruva (Sthira)", natureHindi: "ध्रुव (स्थिर)", favorable: "Griha Pravesh, coronation, tree planting, long-term foundation." }, // Rohini
  4: { nature: "Mridu (Maitra)", natureHindi: "मृदु (मैत्र)", favorable: "Singing, arts, clothes, romance, auspicious ceremonies." }, // Mrigashira
  5: { nature: "Tikshna (Daruna)", natureHindi: "तीक्ष्ण (दारुण)", favorable: "Overcoming enemies, occult sadhana, exorcism, separation." }, // Ardra
  6: { nature: "Chara (Chala)", natureHindi: "चर (चल)", favorable: "Journey, vehicle buying, agriculture, pilgrimage, fasting." }, // Punarvasu
  7: { nature: "Kshipra (Laghu)", natureHindi: "क्षिप्र (लघु)", favorable: "Supreme all-auspicious Nakshatra (except marriage). Trade, buying." }, // Pushya
  8: { nature: "Tikshna (Daruna)", natureHindi: "तीक्ष्ण (दारुण)", favorable: "Destruction, poisons, secrets, overcoming adversaries." }, // Ashlesha
  9: { nature: "Ugra (Kroora)", natureHindi: "उग्र (क्रूर)", favorable: "War, severe undertakings, ancestral rites, research." }, // Magha
  10: { nature: "Ugra (Kroora)", natureHindi: "उग्र (क्रूर)", favorable: "Passion, creative fire, aggressive negotiations." }, // Purva Phalguni
  11: { nature: "Dhruva (Sthira)", natureHindi: "ध्रुव (स्थिर)", favorable: "Marriage, coronation, building houses, public works." }, // Uttara Phalguni
  12: { nature: "Kshipra (Laghu)", natureHindi: "क्षिप्र (लघु)", favorable: "Business, trade, craftsmanship, medical treatments." }, // Hasta
  13: { nature: "Mridu (Maitra)", natureHindi: "मृदु (मैत्र)", favorable: "Architecture, design, weaving, painting, jewellery." }, // Chitra
  14: { nature: "Chara (Chala)", natureHindi: "चर (चल)", favorable: "Travel, buying vehicles, education, trade, music." }, // Swati
  15: { nature: "Mishra (Sadharana)", natureHindi: "मिश्र (साधारण)", favorable: "Ceremonies, contracts, agriculture, festive trade." }, // Vishakha
  16: { nature: "Mridu (Maitra)", natureHindi: "मृदु (मैत्र)", favorable: "Friendship, travel, arts, meeting mentors, marriage." }, // Anuradha
  17: { nature: "Tikshna (Daruna)", natureHindi: "तीक्ष्ण (दारुण)", favorable: "Administrative power, warfare, court disputes." }, // Jyeshtha
  18: { nature: "Tikshna (Daruna)", natureHindi: "तीक्ष्ण (दारुण)", favorable: "Root healing, digging wells, laying foundations." }, // Mula
  19: { nature: "Ugra (Kroora)", natureHindi: "उग्र (क्रूर)", favorable: "Water works, navigation, bravery, debt recovery." }, // Purva Ashadha
  20: { nature: "Dhruva (Sthira)", natureHindi: "ध्रुव (स्थिर)", favorable: "Laying foundation, swearing-in, temple building, marriage." }, // Uttara Ashadha
  21: { nature: "Chara (Chala)", natureHindi: "चर (चल)", favorable: "Study, listening to Shastras, traveling, investments." }, // Shravana
  22: { nature: "Chara (Chala)", natureHindi: "चर (चल)", favorable: "Music, medicine, ceremonies, property, travel." }, // Dhanishta
  23: { nature: "Chara (Chala)", natureHindi: "चर (चल)", favorable: "Healing, medical treatments, ocean voyage, horse/vehicle trade." }, // Shatabhisha
  24: { nature: "Ugra (Kroora)", natureHindi: "उग्र (क्रूर)", favorable: "Occult, severe discipline, renunciation, surgery." }, // Purva Bhadrapada
  25: { nature: "Dhruva (Sthira)", natureHindi: "ध्रुव (स्थिर)", favorable: "Coronation, marriage, long-term foundation, sacrifice." }, // Uttara Bhadrapada
  26: { nature: "Mridu (Maitra)", natureHindi: "मृदु (मैत्र)", favorable: "Travel, trade, marriage, clothing, jewellery, fine arts." }, // Revati
};

// Yoga Actionable Matrix
const YOGA_META_MAP: Record<number, { nature: YogaDetail["nature"]; deity: string; desc: string; favorable: string; prohibited: string }> = {
  0: { nature: "Ashubha (Inauspicious)", deity: "Yama", desc: "Vishkambha — obstacles and friction in early hours.", favorable: "Overcoming enemies, destruction of bad habits.", prohibited: "New auspicious beginnings, travels, marriage ceremonies." },
  1: { nature: "Ati-Shubha (Highly Auspicious)", deity: "Surya", desc: "Priti — mutual love, harmony and friendly alliances.", favorable: "Friendships, reconciliations, artistic creations, romantic partnerships.", prohibited: "Harsh legal disputes, surgical confrontations." },
  2: { nature: "Ati-Shubha (Highly Auspicious)", deity: "Vishnu", desc: "Ayushman — longevity, health and vital energy.", favorable: "Medical treatments, health regimens, starting educational degrees, buying clothes.", prohibited: "Destructive acts, litigation." },
  3: { nature: "Ati-Shubha (Highly Auspicious)", deity: "Savitri", desc: "Saubhagya — good fortune, marital bliss and prosperity.", favorable: "Marriage, business partnerships, investment in jewellery/property.", prohibited: "Gambling, aggressive confrontation." },
  4: { nature: "Shubha (Auspicious)", deity: "Chandra", desc: "Shobhana — elegance, radiance and artistic success.", favorable: "Decoration, purchasing cars, beauty treatments, festivals.", prohibited: "Entering conflict, hazardous travel." },
  5: { nature: "Ashubha (Inauspicious)", deity: "Rahu", desc: "Atiganda — severe obstacles, avoid journey and new ventures.", favorable: "Tantric Sadhana, research into hidden secrets.", prohibited: "All major auspicious works, starting construction, buying assets." },
  6: { nature: "Ati-Shubha (Highly Auspicious)", deity: "Indra", desc: "Sukarma — auspicious actions, charity and virtue.", favorable: "Religious rituals, charity, joining new employment, trade contracts.", prohibited: "Deceitful or unethical practices." },
  7: { nature: "Ashubha (Inauspicious)", deity: "Varuna", desc: "Dhriti — patience, steadiness and fortitude.", favorable: "Laying foundation stones, patience-heavy technical work.", prohibited: "Impatient speculative trading." },
  8: { nature: "Ashubha (Inauspicious)", deity: "Yama", desc: "Shula — pain and discord, sharp instruments and litigation.", favorable: "Surgical operations, iron work, weapon storage.", prohibited: "Marriage, long travels, signing agreements." },
  9: { nature: "Ashubha (Inauspicious)", deity: "Prajapati", desc: "Ganda — distress and impediments; needs caution.", favorable: "Penance, spiritual fasting, consulting mystics.", prohibited: "Financial loans, auspicious beginnings." },
  10: { nature: "Ati-Shubha (Highly Auspicious)", deity: "Mitra", desc: "Vriddhi — growth, expansion, financial gains and glory.", favorable: "Investments, inaugurations, signing commercial leases, agricultural sowing.", prohibited: "Borrowing debts (debts will expand)." },
  11: { nature: "Shubha (Auspicious)", deity: "Varuna", desc: "Dhruva — constancy, fixed assets and permanence.", favorable: "Griha Pravesh, swearing-in ceremonies, long-term fixed deposits.", prohibited: "Temporary or fast-moving speculative trading." },
  12: { nature: "Ashubha (Inauspicious)", deity: "Yama", desc: "Vyaghata — fierce, sudden blows; avoid major contracts.", favorable: "Martial arts, hunting, defensive strategy.", prohibited: "Gentle partnerships, travelling at night, buying vehicles." },
  13: { nature: "Ati-Shubha (Highly Auspicious)", deity: "Bhaga", desc: "Harshana — immense joy, celebrations and triumph.", favorable: "Celebrating achievements, music concerts, festivals, parties.", prohibited: "Mourning, solitary pessimistic thoughts." },
  14: { nature: "Ashubha (Inauspicious)", deity: "Rudra", desc: "Vajra — weapon-like hard impact; avoid gentle deeds.", favorable: "Metal forging, surgical operations, breaking stones.", prohibited: "Delicate artistic works, lending money." },
  15: { nature: "Ati-Shubha (Highly Auspicious)", deity: "Vishnu", desc: "Siddhi — accomplishment, mastery and wish fulfillment.", favorable: "All sacred beginnings, signing contracts, spiritual mantras, buying property.", prohibited: "None (supreme blessing day)." },
  16: { nature: "Ashubha (Inauspicious)", deity: "Yama", desc: "Vyatipata — calamitous celestial turbulence; avoid major events.", favorable: "Pitri Tarpan, chanting Gayatri, quiet introspection.", prohibited: "All 16 Samskaras, starting businesses, inaugurations." },
  17: { nature: "Shubha (Auspicious)", deity: "Shiva", desc: "Variyana — comfort, luxury, respect and high position.", favorable: "Meeting royalty/superiors, luxury purchases, music, fine dining.", prohibited: "Hard physical labor, harsh words." },
  18: { nature: "Ashubha (Inauspicious)", deity: "Agni", desc: "Parigha — blockade and obstructions; travel prohibited.", favorable: "Enclosing boundaries, building fences, defensive fortification.", prohibited: "Traveling abroad, initiating diplomacy." },
  19: { nature: "Ati-Shubha (Highly Auspicious)", deity: "Ganesha", desc: "Shiva — auspiciousness, purity and spiritual grace.", favorable: "Shiva Puja, buying land, learning sciences, marriage.", prohibited: "Impure acts, greed." },
  20: { nature: "Ati-Shubha (Highly Auspicious)", deity: "Brahma", desc: "Siddha — complete perfection, spiritual powers and victory.", favorable: "Spiritual mastery, passing exams, winning arguments, healing.", prohibited: "Unethical actions." },
  21: { nature: "Shubha (Auspicious)", deity: "Sadhya", desc: "Sadhya — achievable goals, discipline and learning.", favorable: "Setting goals, athletic training, academic study, legal mediation.", prohibited: "Procrastination." },
  22: { nature: "Ati-Shubha (Highly Auspicious)", deity: "Shubha", desc: "Shubha — pure fortune, beauty and sacred rituals.", favorable: "Yajnas, pilgrimages, investing in gold, buying elegant clothes.", prohibited: "Harsh or deceptive deeds." },
  23: { nature: "Shubha (Auspicious)", deity: "Lakshmi", desc: "Shukla — bright, pure, virtuous deeds and ceremonies.", favorable: "Charity, temple worship, artistic performances, banking.", prohibited: "Dark/covert dealings." },
  24: { nature: "Ati-Shubha (Highly Auspicious)", deity: "Brahma", desc: "Brahma — supreme wisdom, Vedic knowledge and peace.", favorable: "Vedic recitation, guru blessings, philosophical study, peace treaties.", prohibited: "Sensory over-indulgence, discord." },
  25: { nature: "Ati-Shubha (Highly Auspicious)", deity: "Indra", desc: "Indra — leadership, administrative authority and power.", favorable: "Assuming high office, signing global pacts, governance.", prohibited: "Submissive weakness, betrayal of trust." },
  26: { nature: "Ashubha (Inauspicious)", deity: "Diti", desc: "Vaidhriti — malefic cosmic vortex; strictly avoid auspicious starts.", favorable: "Maha Mrityunjaya Japa, charity to leprosy/blind homes.", prohibited: "All worldly auspicious beginnings and journey." },
};

// Vedic Month Names corresponding to Sun's Sidereal Transit
const VEDIC_MONTH_NAMES = [
  "Mesha (वैशाख / Vaishakha)",
  "Vrishabha (ज्येष्ठ / Jyeshtha)",
  "Mithuna (आषाढ़ / Ashadha)",
  "Karka (श्रावण / Shravana)",
  "Simha (भाद्रपद / Bhadrapada)",
  "Kanya (आश्विन / Ashwina)",
  "Tula (कार्तिक / Kartika)",
  "Vrishchika (मार्गशीर्ष / Margashirsha)",
  "Dhanu (पौष / Pausha)",
  "Makara (माघ / Magha)",
  "Kumbha (फाल्गुन / Phalguna)",
  "Meena (चैत्र / Chaitra)",
];

const AMANTA_MONTH_LIST = [
  "Vaishakha (वैशाख)",
  "Jyeshtha (ज्येष्ठ)",
  "Ashadha (आषाढ़)",
  "Shravana (श्रावण)",
  "Bhadrapada (भाद्रपद)",
  "Ashwina (आश्विन)",
  "Kartika (कार्तिक)",
  "Margashirsha (मार्गशीर्ष)",
  "Pausha (पौष)",
  "Magha (माघ)",
  "Phalguna (फाल्गुन)",
  "Chaitra (चैत्र)",
];

/**
 * Main Function: Calculate Complete Dr. Samir Tripathi Daily Panchanga
 */
export function calculateSamirTripathiPanchang(
  date: Date,
  location: GeoLocation,
  ayanamshaType: AyanamshaType = "Lahiri"
): DailySamirTripathiPanchang {
  const ephem = calculateVedicEphemeris(date, location, ayanamshaType);
  const observer = new Astronomy.Observer(location.latitude, location.longitude, location.elevation || 0);
  const astroTime = Astronomy.MakeTime(date);

  // 1. Sunrise & Sunset
  const sunriseResult = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, astroTime, 1);
  const sunsetResult = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, astroTime, 1);

  const sunrise = sunriseResult ? sunriseResult.date : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0);
  let sunset = sunsetResult ? sunsetResult.date : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18, 15);
  if (sunset.getTime() < sunrise.getTime()) {
    sunset = new Date(sunrise.getTime() + 12 * 3600 * 1000);
  }

  // Next sunrise
  const nextSunriseTime = Astronomy.MakeTime(new Date(sunrise.getTime() + 20 * 3600 * 1000));
  const nextSunriseRes = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, nextSunriseTime, 1);
  const nextSunrise = nextSunriseRes ? nextSunriseRes.date : new Date(sunrise.getTime() + 24 * 3600 * 1000);

  const dayDurationMs = Math.max(1000 * 3600 * 6, sunset.getTime() - sunrise.getTime());
  const nightDurationMs = Math.max(1000 * 3600 * 6, nextSunrise.getTime() - sunset.getTime());
  const muhurtaMs = dayDurationMs / 15;

  const dayHours = Math.floor(dayDurationMs / (1000 * 3600));
  const dayMins = Math.floor((dayDurationMs % (1000 * 3600)) / (1000 * 60));
  const nightHours = Math.floor(nightDurationMs / (1000 * 3600));
  const nightMins = Math.floor((nightDurationMs % (1000 * 3600)) / (1000 * 60));

  // 2. Solar & Lunar Coordinates
  const sunTropLon = ephem.planets.Sun?.tropicalLongitude || 0;
  const moonTropLon = ephem.planets.Moon?.tropicalLongitude || 0;
  const sunSidLon = ephem.planets.Sun?.siderealLongitude || 0;
  const moonSidLon = ephem.planets.Moon?.siderealLongitude || 0;
  const sunRashi = ephem.planets.Sun?.rashi || getRashi(sunSidLon);
  const moonRashi = ephem.planets.Moon?.rashi || getRashi(moonSidLon);

  // 3. Tithi Calculation
  let tithiDiff = ((moonTropLon - sunTropLon + 360) % 360);
  const tithiIdx = Math.floor(tithiDiff / 12) % 30;
  const tithiNum = (tithiIdx % 15) + 1;
  const paksha: "Shukla" | "Krishna" = tithiIdx < 15 ? "Shukla" : "Krishna";
  const pakshaHindi = paksha === "Shukla" ? "शुक्ल पक्ष" : "कृष्ण पक्ष";

  const tithiCatIdx = (tithiNum - 1) % 5;
  const tithiCat = TITHI_CATEGORIES[tithiCatIdx];

  // Tithi End Time approximation
  const degIntoTithi = tithiDiff % 12;
  const degRemainingInTithi = 12 - degIntoTithi;
  const hoursToTithiEnd = (degRemainingInTithi / 12.19) * 24;
  const tithiEndTime = new Date(date.getTime() + hoursToTithiEnd * 3600 * 1000);

  // Tithi Vriddhi / Kshaya Determination (Dr. Samir Tripathi Shastra)
  // Tithi Kshaya: Tithi ends before next sunrise without touching the next sunrise.
  // Tithi Vriddhi: Tithi spans across two sunrises (duration > 24 hours).
  const isKshaya = hoursToTithiEnd < 20 && (tithiEndTime.getTime() < nextSunrise.getTime()) && (degIntoTithi > 6);
  const isVriddhi = hoursToTithiEnd > 24.5;

  const spanStatus: TithiSpanStatus = {
    isKshaya,
    isVriddhi,
    statusText: isKshaya
      ? "⚠️ क्षय तिथि (Tithi Kshaya — Fast-moving lunar phase)"
      : isVriddhi
      ? "✨ वृद्धि तिथि (Tithi Vriddhi — Extended auspicious phase)"
      : "✅ सामान्य तिथि (Normal Standard Tithi)",
    shastricGuidance: isKshaya
      ? "आज तिथि का क्षय है। अत्यधिक संवेदनशील व बड़े वित्तीय अनुबंधों में सावधानी बरतें।"
      : isVriddhi
      ? "आज तिथि की वृद्धि है। यह आध्यात्मिक साधना, दान व दीर्घकालीन कार्यों के लिए अत्यंत शुभ है।"
      : "तिथि सामान्य रूप से गतिमान है।",
  };

  const illum = Astronomy.Illumination(Astronomy.Body.Moon, astroTime);
  const moonEmoji = tithiIdx === 14 ? "🌕" : tithiIdx === 29 ? "🌑" : tithiIdx < 14 ? "🌓" : "🌘";
  const tithiNameStr = TITHI_NAMES[tithiIdx % 15] || "Pratipada";

  const tithiDetail: TithiDetail = {
    index: tithiIdx,
    tithiNumber: tithiNum,
    name: tithiNameStr,
    hindiName: tithiNameStr,
    sanskritName: tithiNameStr,
    paksha,
    pakshaHindi,
    category: tithiCat.category,
    categoryHindi: tithiCat.categoryHindi,
    deity: tithiCat.deity,
    tatva: tithiCat.tatva,
    tatvaHindi: tithiCat.tatvaHindi,
    significance: tithiCat.significance,
    spanStatus,
    endTime: tithiEndTime,
    endTimeFormatted: formatTime12h(tithiEndTime),
    remainingHoursFormatted: `${Math.floor(hoursToTithiEnd)}h ${Math.floor((hoursToTithiEnd % 1) * 60)}m remaining`,
    moonPhaseEmoji: moonEmoji,
    illuminationPercent: Math.round(illum.phase_fraction * 100),
  };

  // 4. Vedic Lunar Month, Samvat, Ayanam & Ritu
  const sunRashiIdx = sunRashi.index;
  const amantaMonthName = AMANTA_MONTH_LIST[sunRashiIdx] || "Chaitra (चैत्र)";
  // In Krishna Paksha, Purnimanta month is 1 month ahead of Amanta
  const purnimantaMonthIdx = paksha === "Krishna" ? (sunRashiIdx + 1) % 12 : sunRashiIdx;
  const purnimantaMonthName = AMANTA_MONTH_LIST[purnimantaMonthIdx] || "Chaitra (चैत्र)";

  // Vikram Samvat & Shaka Samvat
  const civilYear = date.getFullYear();
  const isAfterChaitra = date.getMonth() >= 3;
  const vikramSamvat = isAfterChaitra ? civilYear + 57 : civilYear + 56;
  const shakaSamvat = isAfterChaitra ? civilYear - 78 : civilYear - 79;

  // Ayanam: Uttarayana when Sun in Makara to Mithuna (9 to 2)
  const isUttarayana = [9, 10, 11, 0, 1, 2].includes(sunRashiIdx);
  const ayanam = isUttarayana ? "Uttarayana (उत्तरायण)" : "Dakshinayana (दक्षिणायन)";

  // 6 Ritus
  const RITU_LIST: Array<{ ritu: LunarMonthDetail["ritu"]; hindi: string }> = [
    { ritu: "Vasanta (वसन्त)", hindi: "वसन्त ऋतु (Spring — नवीनीकरण एवं उल्लास)" }, // Chaitra / Vaishakha (Pisces/Aries)
    { ritu: "Vasanta (वसन्त)", hindi: "वसन्त ऋतु (Spring)" },
    { ritu: "Grishma (ग्रीष्म)", hindi: "ग्रीष्म ऋतु (Summer — तेज एवं ऊर्जा)" }, // Taurus/Gemini
    { ritu: "Grishma (ग्रीष्म)", hindi: "ग्रीष्म ऋतु (Summer)" },
    { ritu: "Varsha (वर्षा)", hindi: "वर्षा ऋतु (Monsoon — नवजीवन व समृद्धि)" }, // Cancer/Leo
    { ritu: "Varsha (वर्षा)", hindi: "वर्षा ऋतु (Monsoon)" },
    { ritu: "Sharad (शरद्)", hindi: "शरद् ऋतु (Autumn — निर्मलता व स्वास्थ्य)" }, // Virgo/Libra
    { ritu: "Sharad (शरद्)", hindi: "शरद् ऋतु (Autumn)" },
    { ritu: "Hemanta (हेमन्त)", hindi: "हेमन्त ऋतु (Pre-Winter — पुष्टि व शक्ति)" }, // Scorpio/Sagittarius
    { ritu: "Hemanta (हेमन्त)", hindi: "हेमन्त ऋतु (Pre-Winter)" },
    { ritu: "Shishira (शिशिर)", hindi: "शिशिर ऋतु (Winter — साधना व तपस्या)" }, // Capricorn/Aquarius
    { ritu: "Shishira (शिशिर)", hindi: "शिशिर ऋतु (Winter)" },
  ];
  const rituInfo = RITU_LIST[sunRashiIdx] || RITU_LIST[0];

  const lunarMonth: LunarMonthDetail = {
    amantaMonth: amantaMonthName,
    purnimantaMonth: purnimantaMonthName,
    vikramSamvat,
    shakaSamvat,
    ayanam,
    ritu: rituInfo.ritu,
    rituHindi: rituInfo.hindi,
    isAdhikaMasa: false,
  };

  // 5. Vara (Weekday) Detail
  const dayOfWeek = date.getDay();
  const varaInfo = VARA_DATA[dayOfWeek];

  const varaDetail: VaraDetail = {
    dayOfWeek,
    dayName: varaInfo.dayName,
    hindiName: varaInfo.hindiName,
    sanskritName: varaInfo.sanskritName,
    rulingPlanet: varaInfo.rulingPlanet,
    planetHindi: varaInfo.planetHindi,
    deity: varaInfo.deity,
    tatva: varaInfo.tatva,
    auspiciousColors: varaInfo.auspiciousColors,
    inauspiciousColors: varaInfo.inauspiciousColors,
    exitRemedy: varaInfo.exitRemedy,
    dayMantra: varaInfo.dayMantra,
    recommendedCharity: varaInfo.recommendedCharity,
    activitiesFavorable: varaInfo.activitiesFavorable,
  };

  // 6. Nakshatra Detail
  const nak = ephem.planets.Moon?.nakshatra || { index: 0, name: "Ashwini", sanskritName: "Ashwini", lord: "Ketu", deity: "Ashwini Kumaras" };
  const nakNature = NAKSHATRA_NATURES[nak.index] || {
    nature: "Kshipra (Laghu)",
    natureHindi: "लघु",
    favorable: "General auspicious activities",
  };

  const nakSpan = 360 / 27; // 13.3333 deg
  const degIntoNak = moonSidLon % nakSpan;
  const degRemInNak = nakSpan - degIntoNak;
  const hoursToNakEnd = (degRemInNak / 13.17) * 24;
  const nakEndTime = new Date(date.getTime() + hoursToNakEnd * 3600 * 1000);

  // Pada (1 to 4)
  const padaSpan = nakSpan / 4; // 3.3333 deg
  const pada = Math.floor(degIntoNak / padaSpan) + 1;

  // Gana, Yoni, Nadi
  const DEVA_NAKSHATRAS = [0, 4, 6, 7, 12, 14, 16, 21, 26];
  const MANUSHYA_NAKSHATRAS = [1, 3, 5, 10, 11, 19, 20, 24, 25];
  const gana: "Deva" | "Manushya" | "Rakshasa" = DEVA_NAKSHATRAS.includes(nak.index)
    ? "Deva"
    : MANUSHYA_NAKSHATRAS.includes(nak.index)
    ? "Manushya"
    : "Rakshasa";

  const YONI_NAMES = [
    "Ashwa (Horse)", "Gaja (Elephant)", "Mesha (Sheep)", "Sarpa (Serpent)", "Sarpa (Serpent)", "Shwana (Dog)",
    "Marjara (Cat)", "Mesha (Sheep)", "Marjara (Cat)", "Mushaka (Rat)", "Mushaka (Rat)", "Gau (Cow)",
    "Mahisha (Buffalo)", "Vyaghra (Tiger)", "Mahisha (Buffalo)", "Vyaghra (Tiger)", "Mriga (Deer)", "Mriga (Deer)",
    "Shwana (Dog)", "Vanara (Monkey)", "Nakula (Mongoose)", "Vanara (Monkey)", "Simha (Lion)", "Ashwa (Horse)",
    "Simha (Lion)", "Gau (Cow)", "Gaja (Elephant)",
  ];

  const NADI_TYPES: Array<"Adi" | "Madhya" | "Antya"> = ["Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya"];

  const nakshatraDetail: NakshatraDetail = {
    index: nak.index,
    name: nak.sanskritName || "Ashwini",
    hindiName: nak.sanskritName || "Ashwini",
    sanskritName: nak.sanskritName || "Ashwini",
    lord: nak.lord,
    deity: nak.deity,
    pada,
    gana,
    yoni: YONI_NAMES[nak.index] || "Unknown",
    nadi: NADI_TYPES[nak.index] || "Madhya",
    nature: nakNature.nature,
    natureHindi: nakNature.natureHindi,
    favorableActivities: nakNature.favorable,
    endTime: nakEndTime,
    endTimeFormatted: formatTime12h(nakEndTime),
    remainingHoursFormatted: `${Math.floor(hoursToNakEnd)}h ${Math.floor((hoursToNakEnd % 1) * 60)}m remaining`,
  };

  // 7. Yoga Detail with Actionable Guide
  let yogaSum = (sunSidLon + moonSidLon) % 360;
  const yogaIdx = Math.floor(yogaSum / (360 / 27)) % 27;
  const yogaMeta = YOGA_META_MAP[yogaIdx] || {
    nature: "Shubha (Auspicious)",
    deity: "Vishnu",
    desc: "Auspicious flow.",
    favorable: "General auspicious deeds.",
    prohibited: "Adverse actions.",
  };

  const degIntoYoga = yogaSum % (360 / 27);
  const degRemInYoga = 360 / 27 - degIntoYoga;
  const hoursToYogaEnd = (degRemInYoga / (13.17 + 0.98)) * 24;
  const yogaEndTime = new Date(date.getTime() + hoursToYogaEnd * 3600 * 1000);

  const yogaDetail: YogaDetail = {
    index: yogaIdx,
    name: YOGA_NAMES[yogaIdx] || "Vishkambha",
    hindiName: YOGA_NAMES[yogaIdx] || "Vishkambha",
    sanskritName: YOGA_NAMES[yogaIdx] || "Vishkambha",
    nature: yogaMeta.nature,
    deity: yogaMeta.deity,
    description: yogaMeta.desc,
    favorableActs: yogaMeta.favorable,
    prohibitedActs: yogaMeta.prohibited,
    endTime: yogaEndTime,
    endTimeFormatted: formatTime12h(yogaEndTime),
  };

  // 8. Karana Detail
  const karanaIdx = Math.floor(tithiDiff / 6) % 60;
  let karanaName = "";
  let isBhadra = false;
  if (karanaIdx === 0) karanaName = "Kintughna (किन्तुघ्न)";
  else if (karanaIdx >= 57) {
    if (karanaIdx === 57) karanaName = "Shakuni (शकुनि)";
    else if (karanaIdx === 58) karanaName = "Chatushpada (चतुष्पाद)";
    else karanaName = "Naga (नाग)";
  } else {
    const cycleIdx = (karanaIdx - 1) % 7;
    const charaKaranas = ["Bava (बव)", "Balava (बालव)", "Kaulava (कौलव)", "Taitila (तैतिल)", "Gara (गर)", "Vanija (वणिज)", "Vishti / Bhadra (विष्टि / भद्रा)"];
    karanaName = charaKaranas[cycleIdx];
    isBhadra = cycleIdx === 6;
  }

  const degIntoKarana = tithiDiff % 6;
  const degRemInKarana = 6 - degIntoKarana;
  const hoursToKaranaEnd = (degRemInKarana / 12.19) * 24;
  const karanaEndTime = new Date(date.getTime() + hoursToKaranaEnd * 3600 * 1000);

  // Bhadra Vaas calculation (Dr. Samir Tripathi Shastra)
  let bhadraVaas: KaranaDetail["bhadraVaas"];
  let bhadraVaasHindi: string | undefined;
  let bhadraImpact: string | undefined;

  if (isBhadra) {
    // Moon in Aries, Taurus, Gemini, Scorpio -> Swarga Loka
    if ([0, 1, 2, 7].includes(moonRashi.index)) {
      bhadraVaas = "Swarga Loka";
      bhadraVaasHindi = "स्वर्ग लोक में वास";
      bhadraImpact = "भद्रा स्वर्ग लोक में स्थित है। यह पृथ्वीवासियों के लिए शुभ फलप्रद एवं कल्याणकारी है।";
    }
    // Moon in Virgo, Libra, Sagittarius, Capricorn -> Patala Loka
    else if ([5, 6, 8, 9].includes(moonRashi.index)) {
      bhadraVaas = "Patala Loka";
      bhadraVaasHindi = "पाताल लोक में वास";
      bhadraImpact = "भद्रा पाताल लोक में स्थित है। यह धन-सम्पदा व भूमिगत कार्यों के लिए शुभ मानी जाती है।";
    }
    // Moon in Cancer, Leo, Aquarius, Pisces -> Bhu Loka (Mrityu Loka)
    else {
      bhadraVaas = "Bhu Loka (Mrityu Loka)";
      bhadraVaasHindi = "भूलोक (मृत्युलोक) में वास";
      bhadraImpact = "भद्रा मृत्युलोक (पृथ्वी) पर उपस्थित है। सभी शुभ मांगलिक कार्य, यात्रा व नए अनुबंध इस समय पूर्णतः वर्जित हैं।";
    }
  }

  const karanaDetail: KaranaDetail = {
    index: karanaIdx,
    name: karanaName,
    hindiName: karanaName,
    type: karanaIdx === 0 || karanaIdx >= 57 ? "Sthira (Fixed)" : "Chara (Movable)",
    rulingDeity: isBhadra ? "Yama (यम)" : "Indra / Vishnu",
    isBhadra,
    bhadraVaas,
    bhadraVaasHindi,
    bhadraImpact,
    endTime: karanaEndTime,
    endTimeFormatted: formatTime12h(karanaEndTime),
  };

  // 9. Disha Shool & Chandra Vaas
  const chandraVaasDirections: Record<number, string> = {
    0: "East (पूर्व)", // Aries
    4: "East (पूर्व)", // Leo
    8: "East (पूर्व)", // Sag
    1: "South (दक्षिण)", // Taurus
    5: "South (दक्षिण)", // Virgo
    9: "South (दक्षिण)", // Cap
    2: "West (पश्चिम)", // Gemini
    6: "West (पश्चिम)", // Libra
    10: "West (पश्चिम)", // Aquarius
    3: "North (उत्तर)", // Cancer
    7: "North (उत्तर)", // Scorpio
    11: "North (उत्तर)", // Pisces
  };

  const dishaShool: DishaShoolDetail = {
    prohibitedDirection: varaInfo.prohibitedDirection,
    reason: `Classical Nadi & Samhita principle: Travel towards ${varaInfo.prohibitedDirection} is strictly contraindicated on ${varaInfo.hindiName}.`,
    parihara: varaInfo.exitRemedy,
    chandraVaas: chandraVaasDirections[moonRashi.index] || "East (पूर्व)",
    chandraRashi: `${moonRashi.englishName} (${moonRashi.sanskritName})`,
  };

  // 10. Auspicious & Inauspicious Muhurtas Timeline
  const now = date;
  const auspiciousMuhurtas: MuhurtaSlot[] = [];
  const inauspiciousMuhurtas: MuhurtaSlot[] = [];

  // A. Abhijit Muhurta (8th daytime Muhurta)
  const abhijitStart = new Date(sunrise.getTime() + 7 * muhurtaMs);
  const abhijitEnd = new Date(sunrise.getTime() + 8 * muhurtaMs);
  const isAbhijitWednesday = dayOfWeek === 3;

  if (!isAbhijitWednesday) {
    auspiciousMuhurtas.push({
      name: "Abhijit Muhurta",
      hindiName: "अभिजित् मुहूर्त",
      sanskritName: "अभिजित् मुहूर्त",
      type: "Auspicious",
      startTime: abhijitStart,
      endTime: abhijitEnd,
      startFormatted: formatTime12h(abhijitStart),
      endFormatted: formatTime12h(abhijitEnd),
      durationFormatted: `${Math.round(muhurtaMs / 60000)} mins`,
      isActiveNow: now >= abhijitStart && now <= abhijitEnd,
      quality: "Amrit (सर्वकार्य सिद्धिदायक)",
      description: "Midday victory window destroying all minor astrological doshas. Excellent for all new beginnings.",
    });
  } else {
    inauspiciousMuhurtas.push({
      name: "Abhijit Contraindication",
      hindiName: "अभिजित् निषेध (बुधवार)",
      sanskritName: "अभिजित् निषेध",
      type: "Inauspicious",
      startTime: abhijitStart,
      endTime: abhijitEnd,
      startFormatted: formatTime12h(abhijitStart),
      endFormatted: formatTime12h(abhijitEnd),
      durationFormatted: `${Math.round(muhurtaMs / 60000)} mins`,
      isActiveNow: now >= abhijitStart && now <= abhijitEnd,
      quality: "Varjya (निषेध)",
      description: "Abhijit is prohibited on Wednesdays due to mutual planetary conflict.",
    });
  }

  // B. Brahma Muhurta (96 mins before Sunrise)
  const brahmaStart = new Date(sunrise.getTime() - 96 * 60 * 1000);
  const brahmaEnd = new Date(sunrise.getTime() - 48 * 60 * 1000);
  auspiciousMuhurtas.push({
    name: "Brahma Muhurta",
    hindiName: "ब्राह्म मुहूर्त",
    sanskritName: "ब्राह्म मुहूर्त",
    type: "Auspicious",
    startTime: brahmaStart,
    endTime: brahmaEnd,
    startFormatted: formatTime12h(brahmaStart),
    endFormatted: formatTime12h(brahmaEnd),
    durationFormatted: "48 mins",
    isActiveNow: now >= brahmaStart && now <= brahmaEnd,
    quality: "Divya (दिव्य साधना काल)",
    description: "Supreme spiritual awakening window for Pranayama, Gayatri Japa, meditation and study.",
  });

  // C. Vijaya Muhurta (Afternoon 11th Muhurta)
  const vijayaStart = new Date(sunrise.getTime() + 10 * muhurtaMs);
  const vijayaEnd = new Date(sunrise.getTime() + 11 * muhurtaMs);
  auspiciousMuhurtas.push({
    name: "Vijaya Muhurta",
    hindiName: "विजय मुहूर्त",
    sanskritName: "विजय मुहूर्त",
    type: "Auspicious",
    startTime: vijayaStart,
    endTime: vijayaEnd,
    startFormatted: formatTime12h(vijayaStart),
    endFormatted: formatTime12h(vijayaEnd),
    durationFormatted: `${Math.round(muhurtaMs / 60000)} mins`,
    isActiveNow: now >= vijayaStart && now <= vijayaEnd,
    quality: "Vijaya (विजय सिद्धि)",
    description: "Auspicious window for contentious matters, launching ventures, legal matters and exams.",
  });

  // D. Godhuli Muhurta (12 mins before & after Sunset)
  const godhuliStart = new Date(sunset.getTime() - 12 * 60 * 1000);
  const godhuliEnd = new Date(sunset.getTime() + 12 * 60 * 1000);
  auspiciousMuhurtas.push({
    name: "Godhuli Muhurta",
    hindiName: "गोधूलि मुहूर्त",
    sanskritName: "गोधूलि मुहूर्त",
    type: "Auspicious",
    startTime: godhuliStart,
    endTime: godhuliEnd,
    startFormatted: formatTime12h(godhuliStart),
    endFormatted: formatTime12h(godhuliEnd),
    durationFormatted: "24 mins",
    isActiveNow: now >= godhuliStart && now <= godhuliEnd,
    quality: "Shubha (शुभ काल)",
    description: "Evening twilight window sanctified by Gau-Dhuli. Favorable for prayers, lighting lamps, peace.",
  });

  // E. Amrit Kaal (Calculated from Nakshatra)
  const amritOffsetHrs = (nak.index * 1.5) % 18;
  const amritStart = new Date(sunrise.getTime() + amritOffsetHrs * 3600 * 1000);
  const amritEnd = new Date(amritStart.getTime() + 90 * 60 * 1000);
  auspiciousMuhurtas.push({
    name: "Amrit Kaal",
    hindiName: "अमृत काल",
    sanskritName: "अमृत काल",
    type: "Auspicious",
    startTime: amritStart,
    endTime: amritEnd,
    startFormatted: formatTime12h(amritStart),
    endFormatted: formatTime12h(amritEnd),
    durationFormatted: "90 mins",
    isActiveNow: now >= amritStart && now <= amritEnd,
    quality: "Amrit (अमृत फल)",
    description: "Nectarine planetary segment free from stellar poisons. High success rate in undertakings.",
  });

  // F. Nishita Kaal (Midnight Muhurta)
  const nightMuhurtaMs = nightDurationMs / 15;
  const nishitaStart = new Date(sunset.getTime() + 7 * nightMuhurtaMs);
  const nishitaEnd = new Date(sunset.getTime() + 8 * nightMuhurtaMs);
  auspiciousMuhurtas.push({
    name: "Nishita Kaal",
    hindiName: "निशीथ काल (महानिशीथ)",
    sanskritName: "निशीथ काल",
    type: "Auspicious",
    startTime: nishitaStart,
    endTime: nishitaEnd,
    startFormatted: formatTime12h(nishitaStart),
    endFormatted: formatTime12h(nishitaEnd),
    durationFormatted: `${Math.round(nightMuhurtaMs / 60000)} mins`,
    isActiveNow: now >= nishitaStart && now <= nishitaEnd,
    quality: "Sadhana (तांत्रिक व शिव साधना)",
    description: "Midnight hour for Lord Shiva, Mahakali, and advanced Mantra Sadhana.",
  });

  // --- Inauspicious Kaalas ---
  // A. Rahu Kaalam (1/8th day segment per weekday)
  const rahuKaalOffsets: Record<number, number> = {
    0: 7, // Sun: 8th segment
    1: 1, // Mon: 2nd segment
    2: 6, // Tue: 7th segment
    3: 4, // Wed: 5th segment
    4: 5, // Thu: 6th segment
    5: 3, // Fri: 4th segment
    6: 2, // Sat: 3rd segment
  };
  const dayOctantMs = dayDurationMs / 8;
  const rahuOffset = rahuKaalOffsets[dayOfWeek];
  const rahuStart = new Date(sunrise.getTime() + rahuOffset * dayOctantMs);
  const rahuEnd = new Date(rahuStart.getTime() + dayOctantMs);

  inauspiciousMuhurtas.push({
    name: "Rahu Kaalam",
    hindiName: "राहु काल (अशुभ)",
    sanskritName: "राहु काल",
    type: "Inauspicious",
    startTime: rahuStart,
    endTime: rahuEnd,
    startFormatted: formatTime12h(rahuStart),
    endFormatted: formatTime12h(rahuEnd),
    durationFormatted: `${Math.round(dayOctantMs / 60000)} mins`,
    isActiveNow: now >= rahuStart && now <= rahuEnd,
    quality: "Ashubha (पूर्णतः त्याज्य)",
    description: "Malefic planetary division ruled by Rahu. Do not sign agreements, launch businesses or travel.",
    precautions: "Do not start new ventures or buy assets during this window.",
  });

  // B. Yamagandam
  const yamaOffsets: Record<number, number> = {
    0: 4, // Sun
    1: 3, // Mon
    2: 2, // Tue
    3: 1, // Wed
    4: 0, // Thu
    5: 6, // Fri
    6: 5, // Sat
  };
  const yamaOffset = yamaOffsets[dayOfWeek];
  const yamaStart = new Date(sunrise.getTime() + yamaOffset * dayOctantMs);
  const yamaEnd = new Date(yamaStart.getTime() + dayOctantMs);

  inauspiciousMuhurtas.push({
    name: "Yamagandam",
    hindiName: "यमगण्ड काल",
    sanskritName: "यमगण्डम्",
    type: "Inauspicious",
    startTime: yamaStart,
    endTime: yamaEnd,
    startFormatted: formatTime12h(yamaStart),
    endFormatted: formatTime12h(yamaEnd),
    durationFormatted: `${Math.round(dayOctantMs / 60000)} mins`,
    isActiveNow: now >= yamaStart && now <= yamaEnd,
    quality: "Ashubha (यम का प्रभाव)",
    description: "Inauspicious daytime segment causing loss, delay, and unproductive efforts.",
  });

  // C. Gulika Kaalam
  const gulikaOffsets: Record<number, number> = {
    0: 6, // Sun
    1: 5, // Mon
    2: 4, // Tue
    3: 3, // Wed
    4: 2, // Thu
    5: 1, // Fri
    6: 0, // Sat
  };
  const gulikaOffset = gulikaOffsets[dayOfWeek];
  const gulikaStart = new Date(sunrise.getTime() + gulikaOffset * dayOctantMs);
  const gulikaEnd = new Date(gulikaStart.getTime() + dayOctantMs);

  inauspiciousMuhurtas.push({
    name: "Gulika Kaal",
    hindiName: "गुलिक काल",
    sanskritName: "गुलिक काल",
    type: "Inauspicious",
    startTime: gulikaStart,
    endTime: gulikaEnd,
    startFormatted: formatTime12h(gulikaStart),
    endFormatted: formatTime12h(gulikaEnd),
    durationFormatted: `${Math.round(dayOctantMs / 60000)} mins`,
    isActiveNow: now >= gulikaStart && now <= gulikaEnd,
    quality: "Ashubha (मन्दपुत्र)",
    description: "Saturn's sub-planet Gulika period. Action initiated here repeats painfully.",
  });

  // D. Dur Muhurtam
  const durMuhurtam1 = new Date(sunrise.getTime() + ((dayOfWeek * 2) % 13) * muhurtaMs);
  const durMuhurtam1End = new Date(durMuhurtam1.getTime() + muhurtaMs);
  inauspiciousMuhurtas.push({
    name: "Dur Muhurtam",
    hindiName: "दुर्मुहूर्त",
    sanskritName: "दुर्मुहूर्त",
    type: "Inauspicious",
    startTime: durMuhurtam1,
    endTime: durMuhurtam1End,
    startFormatted: formatTime12h(durMuhurtam1),
    endFormatted: formatTime12h(durMuhurtam1End),
    durationFormatted: `${Math.round(muhurtaMs / 60000)} mins`,
    isActiveNow: now >= durMuhurtam1 && now <= durMuhurtam1End,
    quality: "Varjya (त्याज्य)",
    description: "Flawed daytime muhurta with unfavorable stellar aspects.",
  });

  // Find active muhurta right now
  const allMuhurtas = [...auspiciousMuhurtas, ...inauspiciousMuhurtas];
  const activeMuhurtaNow = allMuhurtas.find((m) => m.isActiveNow) || null;

  // 11. Chandra Bala for all 12 Rashis (Moon Transit Strength)
  const chandraBalaList: ChandraBalaRashi[] = RASHIS.map((r, rIdx) => {
    const houseFromRashi = ((moonRashi.index - rIdx + 12) % 12) + 1;
    let strength: ChandraBalaRashi["strength"];
    let badgeColor: string;
    let guidance: string;

    if ([1, 3, 6, 7, 10, 11].includes(houseFromRashi)) {
      strength = "Shubha (Auspicious)";
      badgeColor = "bg-emerald-950 text-emerald-300 border-emerald-500 font-bold";
      guidance = "Excellent Chandra Bala. High mental clarity, enthusiasm, and support for major initiatives.";
    } else if ([2, 5, 9].includes(houseFromRashi)) {
      strength = "Madhyama (Moderate)";
      badgeColor = "bg-amber-950 text-amber-300 border-amber-500 font-semibold";
      guidance = "Moderate Chandra Bala. Routine affairs succeed; exercise ordinary discretion in new steps.";
    } else {
      strength = "Ashubha (Chandrashtama / Caution)";
      badgeColor = "bg-rose-950 text-rose-300 border-rose-500 font-bold";
      guidance =
        houseFromRashi === 8
          ? "⚠️ Chandrashtama! Mind may feel restless. Avoid risky financial decisions, disputes and long night drives."
          : houseFromRashi === 4
          ? "4th Moon (Kantaka). Mind may worry about domestic comforts. Stay calm and chant day mantra."
          : "12th Moon (Vyaya). Guard against unplanned expenditures and fatigue.";
    }

    return {
      rashiIndex: rIdx,
      rashiName: r.englishName,
      hindiName: r.sanskritName,
      symbol: r.symbol,
      houseFromMoon: houseFromRashi,
      strength,
      badgeColor,
      guidance,
    };
  });

  // 12. Panchanga Shuddhi Score (0 to 100)
  let shuddhi = 100;
  if (tithiDetail.category === "Rikta") shuddhi -= 20;
  if (tithiDetail.index === 29) shuddhi -= 25; // Amavasya
  if (yogaDetail.nature.includes("Ashubha")) shuddhi -= 20;
  if (isBhadra && bhadraVaas === "Bhu Loka (Mrityu Loka)") shuddhi -= 25;
  if (nakshatraDetail.nature.includes("Tikshna") || nakshatraDetail.nature.includes("Ugra")) shuddhi -= 15;
  if (isKshaya) shuddhi -= 10;
  shuddhi = Math.max(20, Math.min(100, shuddhi));

  const summary = `आज ${varaDetail.hindiName} है। मास: ${lunarMonth.purnimantaMonth} (पूर्णिमांत) / ${lunarMonth.amantaMonth} (अमांत), ${lunarMonth.ayanam}, ${lunarMonth.ritu}। संवत्: विक्रम ${lunarMonth.vikramSamvat}। तिथि: ${tithiDetail.hindiName} (${tithiDetail.pakshaHindi}, ${tithiDetail.categoryHindi}), नक्षत्र: ${nakshatraDetail.hindiName} (पद ${nakshatraDetail.pada}), योग: ${yogaDetail.hindiName}, करण: ${karanaDetail.hindiName}। चन्द्रमा ${moonRashi.englishName} (${moonRashi.sanskritName}) राशि में स्थित हैं। आज का दिशाशूल: ${dishaShool.prohibitedDirection}। शुभ रंग: ${varaDetail.auspiciousColors.join(", ")}।`;

  return {
    evaluationDate: date,
    location,
    cityName: location.cityName || "Local Observatory",
    sunrise,
    sunset,
    nextSunrise,
    sunriseFormatted: formatTime12h(sunrise),
    sunsetFormatted: formatTime12h(sunset),
    dayDurationFormatted: `${dayHours}h ${dayMins}m`,
    nightDurationFormatted: `${nightHours}h ${nightMins}m`,
    lunarMonth,
    tithi: tithiDetail,
    vara: varaDetail,
    nakshatra: nakshatraDetail,
    yoga: yogaDetail,
    karana: karanaDetail,
    dishaShool,
    auspiciousColors: varaDetail.auspiciousColors,
    inauspiciousColors: varaDetail.inauspiciousColors,
    dayMantra: varaDetail.dayMantra,
    recommendedCharity: varaDetail.recommendedCharity,
    exitRemedy: varaDetail.exitRemedy,
    auspiciousMuhurtas,
    inauspiciousMuhurtas,
    activeMuhurtaNow,
    chandraRashi: moonRashi.englishName,
    chandraRashiHindi: moonRashi.sanskritName,
    chandraBalaList,
    shuddhiScore: shuddhi,
    panchangaSummary: summary,
  };
}
