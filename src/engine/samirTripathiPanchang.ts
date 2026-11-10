/**
 * Classical Vedic Daily Panchanga & Astro Guidance Engine (दैनिक पञ्चाङ्ग एवं ज्योतिषीय परामर्श)
 * Shastric Methodology inspired by Dr. Samir Tripathi (Medhaj Astro) & Classical Granthas:
 * - Muhurta Chintamani (मुहूर्त चिन्तामणि)
 * - Brihat Samhita (बृहत् संहिता)
 * - Kalaprakasika (कालप्रकाशिका)
 * - Narada Samhita (नारद संहिता)
 */

import * as Astronomy from "astronomy-engine";
import { GeoLocation, AyanamshaType, EphemerisResult } from "./types";
import { calculateVedicEphemeris } from "./ephemeris";
import { getRashi } from "./rashiNakshatra";
import { TITHI_NAMES, YOGA_NAMES, RASHIS, NAKSHATRA_NAMES } from "./constants";
import { calculateTithiEndTime, calculateNakshatraEndTime } from "./tithiCalendar";
import { DAGDHA_RASHIS_BY_TITHI } from "./natalPanchangaDeep";

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
  samvatsaraNumber: number; // 1 to 60
  samvatsaraName: string; // e.g. "Parabhava"
  samvatsaraHindi: string; // e.g. "पराभव संवत्सर"
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
  tithiLord: string; // Classical 8-planet Tithi Lord (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu)
  category: "Nanda" | "Bhadra" | "Jaya" | "Rikta" | "Purna";
  categoryHindi: string;
  deity: string;
  tatva: "Agni" | "Prithvi" | "Vayu" | "Jala" | "Akasha";
  tatvaHindi: string;
  panchangaPhala: string; // Classical Phaladeepika / Muhurta Chintamani limb fruit
  dagdhaRashis: string[]; // Burnt signs for this Tithi
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
  panchangaPhala: string;
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
  tatva: string;
  panchangaPhala: string;
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
  tatva: string;
  panchangaPhala: string;
  shunnedPortion: string; // Classical Tyajya Ghatis for malefic yogas
  yogiNakshatra: string;
  yogiPlanet: string;
  sahayogiPlanet: string;
  avayogiNakshatra: string;
  avayogiPlanet: string;
  description: string;
  favorableActs: string;
  prohibitedActs: string;
  endTime: Date;
  endTimeFormatted: string;
  remainingHoursFormatted: string;
}

export interface KaranaDetail {
  index: number;
  name: string;
  hindiName: string;
  type: "Chara (Movable)" | "Sthira (Fixed)";
  karanaLord: string;
  rulingDeity: string;
  tatva: string;
  panchangaPhala: string;
  isBhadra: boolean;
  bhadraVaas?: "Swarga Loka" | "Patala Loka" | "Bhu Loka (Mrityu Loka)";
  bhadraVaasHindi?: string;
  bhadraImpact?: string;
  endTime: Date;
  endTimeFormatted: string;
  remainingHoursFormatted: string;
}

export interface PlanetaryHoraSlot {
  horaNumber: number; // 1 to 24 from Sunrise
  isDayHora: boolean;
  lord: string;
  lordHindi: string;
  startFormatted: string;
  endFormatted: string;
  favorableActivities: string;
}

export interface ChoghadiyaSlot {
  name: "Amrit" | "Shubh" | "Labh" | "Char" | "Udveg" | "Kaal" | "Rog";
  hindiName: string;
  rulingPlanet: string;
  quality: "Ati-Shubha (Nectar)" | "Shubha (Auspicious)" | "Madhyama (Movable)" | "Ashubha (Avoid)";
  isDaySlot: boolean;
  startFormatted: string;
  endFormatted: string;
  recommendation: string;
}

export interface SiddhiYogaStatus {
  name: string;
  hindiName: string;
  type: "Auspicious" | "Caution";
  description: string;
}

export interface PanchakaStatus {
  isActive: boolean;
  name: string;
  hindiName: string;
  severity: "Shubha (Free)" | "Madhyama (Mild)" | "Caution (Panchaka Active)";
  guidance: string;
}

export interface VasaSanctionStatus {
  agnivasa: {
    residence: "Prithvi (Earth)" | "Akasha (Sky)" | "Patala (Netherworld)";
    hindiResidence: string;
    isHomaSanctioned: boolean;
    verdict: string;
  };
  shivavasa: {
    residence: string;
    hindiResidence: string;
    isRudrabhishekaSanctioned: boolean;
    verdict: string;
  };
}

export interface PersonalPanchangaAlignment {
  natalNakshatra: string;
  natalRashi: string;
  todayNakshatra: string;
  todayRashi: string;
  tarabala: {
    countFromJanma: number; // 1 to 27
    taraNumber: number; // 1 to 9
    paryaya: number; // 1, 2, or 3
    taraName: string;
    taraHindi: string;
    rulingPlanet: string;
    strength: "Ati-Shubha" | "Shubha" | "Madhyama" | "Ashubha";
    guidance: string;
  };
  chandrabala: {
    houseFromJanmaRashi: number; // 1 to 12
    strength: "Shubha (Auspicious)" | "Madhyama (Moderate)" | "Ashubha (Chandrashtama / Caution)";
    isChandrashtama: boolean;
    guidance: string;
  };
  horaHarmony: {
    activeHoraLord: string;
    natalHouseOfHoraLord: number;
    tithiLord: string;
    natalHouseOfTithiLord: number;
    verdict: string;
  };
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

  // Classical Planetary Hora, Choghadiya, Siddhi Yogas, Panchaka & Vasa Sanctions
  activeHora: PlanetaryHoraSlot;
  nextHora: PlanetaryHoraSlot;
  activeChoghadiya: ChoghadiyaSlot;
  nextChoghadiya: ChoghadiyaSlot;
  siddhiYogas: SiddhiYogaStatus[];
  panchakaStatus: PanchakaStatus;
  vasaSanctions: VasaSanctionStatus;

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

// Helper: Format time as "hh:mm AM/PM" in the target location's timezone
function formatTime12h(d: Date, tzOffsetHours: number = 5.5): string {
  const localD = new Date(d.getTime() + tzOffsetHours * 3600 * 1000);
  return localD.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
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

const SAMVATSARA_60_LIST: Array<{ name: string; hindi: string }> = [
  { name: "Prabhava", hindi: "प्रभव" },
  { name: "Vibhava", hindi: "विभव" },
  { name: "Shukla", hindi: "शुक्ल" },
  { name: "Pramodoota", hindi: "प्रमोदूत" },
  { name: "Prajotpatti", hindi: "प्रजोत्पत्ति" },
  { name: "Angirasa", hindi: "अंगिरस" },
  { name: "Shrimukha", hindi: "श्रीमुख" },
  { name: "Bhava", hindi: "भाव" },
  { name: "Yuva", hindi: "युवा" },
  { name: "Dhata", hindi: "धाता" },
  { name: "Ishvara", hindi: "ईश्वर" },
  { name: "Bahudhanya", hindi: "बहुधान्य" },
  { name: "Pramathi", hindi: "प्रमाथी" },
  { name: "Vikrama", hindi: "विक्रम" },
  { name: "Vrisha", hindi: "वृष" },
  { name: "Chitrabhanu", hindi: "चित्रभानु" },
  { name: "Subhanu", hindi: "सुभानु" },
  { name: "Tarana", hindi: "तारण" },
  { name: "Parthiva", hindi: "पार्थिव" },
  { name: "Vyaya", hindi: "व्यय" },
  { name: "Sarvajit", hindi: "सर्वजित्" },
  { name: "Sarvadharin", hindi: "सर्वधारी" },
  { name: "Virodhin", hindi: "विरोधी" },
  { name: "Vikriti", hindi: "विकृति" },
  { name: "Khara", hindi: "खर" },
  { name: "Nandana", hindi: "नन्दन" },
  { name: "Vijaya", hindi: "विजय" },
  { name: "Jaya", hindi: "जय" },
  { name: "Manmatha", hindi: "मन्मथ" },
  { name: "Durmukha", hindi: "दुर्मुख" },
  { name: "Hemalamba", hindi: "हेमलम्ब" },
  { name: "Vilamba", hindi: "विलम्ब" },
  { name: "Vikarin", hindi: "विकारी" },
  { name: "Sharvari", hindi: "शार्वरी" },
  { name: "Plava", hindi: "प्लव" },
  { name: "Shubhakrit", hindi: "शुभकृत्" },
  { name: "Shobhakrit", hindi: "शोभकृत्" },
  { name: "Krodhin", hindi: "क्रोधी" },
  { name: "Vishvavasu", hindi: "विश्वावसु" },
  { name: "Parabhava", hindi: "पराभव" },
  { name: "Plavanga", hindi: "प्लवंग" },
  { name: "Kilaka", hindi: "कीलक" },
  { name: "Saumya", hindi: "सौम्य" },
  { name: "Sadharana", hindi: "साधारण" },
  { name: "Virodhikrit", hindi: "विरोधिकृत्" },
  { name: "Paridhavin", hindi: "परिधावी" },
  { name: "Pramadicha", hindi: "प्रमादीच" },
  { name: "Ananda", hindi: "आनन्द" },
  { name: "Rakshasa", hindi: "राक्षस" },
  { name: "Nala (Anala)", hindi: "नल (अनल)" },
  { name: "Pingala", hindi: "पिंगल" },
  { name: "Kalayukti", hindi: "कालयुक्ति" },
  { name: "Siddharthi", hindi: "सिद्धार्थी" },
  { name: "Raudri", hindi: "रौद्री" },
  { name: "Durmati", hindi: "दुर्मति" },
  { name: "Dundubhi", hindi: "दुन्दुभि" },
  { name: "Rudhirodgarin", hindi: "रुधिरोद्गारी" },
  { name: "Raktaksha", hindi: "रक्ताक्ष" },
  { name: "Krodhana", hindi: "क्रोधन" },
  { name: "Akshaya", hindi: "अक्षय" },
];

// Classical Tithi Planetary Lords (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu cycle for 1..14; Purnima=Saturn, Amavasya=Rahu)
const TITHI_LORD_8_CYCLE = [
  "Sun (सूर्य)",
  "Moon (चन्द्र)",
  "Mars (मंगल)",
  "Mercury (बुध)",
  "Jupiter (बृहस्पति)",
  "Venus (शुक्र)",
  "Saturn (शनि)",
  "Rahu (राहु)",
];

// Classical Muhurta Chintamani shunned ghatis for the 9 malefic Nitya Yogas
const YOGA_SHUNNED_PORTIONS: Record<number, string> = {
  0: "First 3 Ghatis (72 mins) shunned", // Vishkambha
  5: "First 6 Ghatis (2h 24m) shunned", // Atiganda
  8: "First 5 Ghatis (2h 00m) shunned", // Shula
  9: "First 6 Ghatis (2h 24m) shunned", // Ganda
  12: "First 9 Ghatis (3h 36m) shunned", // Vyaghata
  14: "First 3 Ghatis (72 mins) shunned", // Vajra
  16: "Entire Yoga shunned for auspicious starts", // Vyatipata
  18: "First 30 Ghatis (first half) shunned", // Parigha
  26: "Entire Yoga shunned for auspicious starts", // Vaidhriti
};

// Decreasing orbital speed order for Planetary Horas (Surya Siddhanta)
const HORA_SPEED_ORDER: Array<{ lord: string; hindi: string; activities: string }> = [
  { lord: "Sun", hindi: "सूर्य होरा", activities: "Government dealings, executive decisions, authority, vitality & administrative leadership." },
  { lord: "Venus", hindi: "शुक्र होरा", activities: "Travel, luxury purchases, jewellery, arts, romance, vehicles & financial diplomacy." },
  { lord: "Mercury", hindi: "बुध होरा", activities: "Commercial trade, contracts, education, software, writing, accounting & negotiations." },
  { lord: "Moon", hindi: "चन्द्र होरा", activities: "Public relations, food/liquid trade, gardening, short journeys & domestic harmony." },
  { lord: "Saturn", hindi: "शनि होरा", activities: "Foundations, heavy machinery, mining, long-term discipline, agriculture & iron/oil work." },
  { lord: "Jupiter", hindi: "गुरु होरा", activities: "All auspicious beginnings, marriage, banking, wealth investment, higher study & temple rituals." },
  { lord: "Mars", hindi: "मंगल होरा", activities: "Engineering, real estate, competitive sports, litigation defense, surgery & bold action." },
];

const WEEKDAY_START_HORA_INDEX: Record<number, number> = {
  0: 0, // Sunday -> Sun
  1: 3, // Monday -> Moon
  2: 6, // Tuesday -> Mars
  3: 2, // Wednesday -> Mercury
  4: 5, // Thursday -> Jupiter
  5: 1, // Friday -> Venus
  6: 4, // Saturday -> Saturn
};

const CHOGHADIYA_CYCLE: Array<{
  name: ChoghadiyaSlot["name"];
  hindiName: string;
  rulingPlanet: string;
  quality: ChoghadiyaSlot["quality"];
  recommendation: string;
}> = [
  { name: "Udveg", hindiName: "उद्वेग चौघड़िया", rulingPlanet: "Sun (सूर्य)", quality: "Ashubha (Avoid)", recommendation: "Avoid new personal starts; suitable only for routine government or official tasks." },
  { name: "Char", hindiName: "चर चौघड़िया", rulingPlanet: "Venus (शुक्र)", quality: "Madhyama (Movable)", recommendation: "Favorable for travel, logistics, vehicle movement, and dynamic commercial dispatch." },
  { name: "Labh", hindiName: "लाभ चौघड़िया", rulingPlanet: "Mercury (बुध)", quality: "Shubha (Auspicious)", recommendation: "Highly favorable for starting businesses, financial investments, trade, and skill learning." },
  { name: "Amrit", hindiName: "अमृत चौघड़िया", rulingPlanet: "Moon (चन्द्र)", quality: "Ati-Shubha (Nectar)", recommendation: "Supreme nectarine window for all auspicious ceremonies, contracts, and major beginnings." },
  { name: "Kaal", hindiName: "काल चौघड़िया", rulingPlanet: "Saturn (शनि)", quality: "Ashubha (Avoid)", recommendation: "Inauspicious for new beginnings; avoid financial lending or launching ventures." },
  { name: "Shubh", hindiName: "शुभ चौघड़िया", rulingPlanet: "Jupiter (बृहस्पति)", quality: "Shubha (Auspicious)", recommendation: "Auspicious for sacred ceremonies, marriage talks, education, and spiritual sadhana." },
  { name: "Rog", hindiName: "रोग चौघड़िया", rulingPlanet: "Mars (मंगल)", quality: "Ashubha (Avoid)", recommendation: "Inauspicious for peaceful starts; suitable only for overcoming adversaries or medical procedures." },
];

// Daytime Choghadiya starting index into CHOGHADIYA_CYCLE by dayOfWeek (0=Sun..6=Sat)
const DAY_CHOGHADIYA_START: Record<number, number> = {
  0: 0, // Sun -> Udveg
  1: 3, // Mon -> Amrit
  2: 6, // Tue -> Rog
  3: 2, // Wed -> Labh
  4: 5, // Thu -> Shubh
  5: 1, // Fri -> Char
  6: 4, // Sat -> Kaal
};

// Nighttime Choghadiya sequence order
const NIGHT_CHOGHADIYA_SEQUENCE: number[] = [5, 3, 1, 6, 4, 2, 0]; // Shubh, Amrit, Char, Rog, Kaal, Labh, Udveg
const NIGHT_CHOGHADIYA_START: Record<number, number> = {
  0: 0, // Sun night starts with Shubh
  1: 2, // Mon night starts with Char
  2: 4, // Tue night starts with Kaal
  3: 5, // Wed night starts with Labh
  4: 6, // Thu night starts with Udveg
  5: 1, // Fri night starts with Amrit
  6: 3, // Sat night starts with Rog
};

// Classical Amrita Siddhi & Sarvartha Siddhi Vara-Nakshatra tables
const AMRITA_SIDDHI_NAK: Record<number, number> = {
  0: 12, // Sunday + Hasta
  1: 4,  // Monday + Mrigashira
  2: 0,  // Tuesday + Ashwini
  3: 16, // Wednesday + Anuradha
  4: 7,  // Thursday + Pushya
  5: 26, // Friday + Revati
  6: 3,  // Saturday + Rohini
};

const SARVARTHA_SIDDHI_NAKS: Record<number, number[]> = {
  0: [0, 7, 11, 12, 18, 20, 25], // Sun: Ashwini, Pushya, U.Phalguni, Hasta, Mula, U.Ashadha, U.Bhadrapada
  1: [3, 4, 7, 16, 21],          // Mon: Rohini, Mrigashira, Pushya, Anuradha, Shravana
  2: [0, 2, 8, 25],              // Tue: Ashwini, Krittika, Ashlesha, U.Bhadrapada
  3: [2, 3, 4, 12, 16],          // Wed: Krittika, Rohini, Mrigashira, Hasta, Anuradha
  4: [0, 6, 7, 16, 26],          // Thu: Ashwini, Punarvasu, Pushya, Anuradha, Revati
  5: [0, 6, 16, 21, 26],         // Fri: Ashwini, Punarvasu, Anuradha, Shravana, Revati
  6: [3, 14, 21],                // Sat: Rohini, Swati, Shravana
};

/**
 * Main Function: Calculate Complete Classical Daily Panchanga
 */
export function calculateSamirTripathiPanchang(
  date: Date,
  location: GeoLocation,
  ayanamshaType: AyanamshaType = "Lahiri"
): DailySamirTripathiPanchang {
  const tzOffset = location.timezoneOffsetHours ?? 5.5;
  const fmtTime = (d: Date) => formatTime12h(d, tzOffset);
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

  // 3. Tithi Calculation (with exact astronomical root-finding)
  let tithiDiff = ((moonTropLon - sunTropLon + 360) % 360);
  const tithiIdx = Math.floor(tithiDiff / 12) % 30;
  const tithiNum = (tithiIdx % 15) + 1;
  const paksha: "Shukla" | "Krishna" = tithiIdx < 15 ? "Shukla" : "Krishna";
  const pakshaHindi = paksha === "Shukla" ? "शुक्ल पक्ष" : "कृष्ण पक्ष";

  const tithiCatIdx = (tithiNum - 1) % 5;
  const tithiCat = TITHI_CATEGORIES[tithiCatIdx];

  // Exact Tithi End Time via binary root-finding
  const exactTithiEnd = calculateTithiEndTime(date, location, ayanamshaType, date);
  const degIntoTithi = tithiDiff % 12;
  const hoursToTithiEnd = exactTithiEnd.hoursRemaining;
  const tithiEndTime = exactTithiEnd.endTime;

  // Classical Tithi Planetary Lord (Table 3: Sun..Rahu cycle for 1..14, Purnima=Saturn, Amavasya=Rahu)
  const tithiLord =
    tithiIdx === 14
      ? "Saturn (शनि)"
      : tithiIdx === 29
      ? "Rahu (राहु)"
      : TITHI_LORD_8_CYCLE[(tithiNum - 1) % 8];

  // Classical Dagdha Rashis (Burnt Signs) for this Tithi
  const effectiveDagdhaIndices = tithiIdx === 14 || tithiIdx === 29 ? [] : DAGDHA_RASHIS_BY_TITHI[tithiNum] || [];
  const dagdhaRashis = effectiveDagdhaIndices.map((rIdx) => `${RASHIS[rIdx].englishName} (${RASHIS[rIdx].sanskritName})`);

  // Tithi Vriddhi / Kshaya Determination
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
  const tithiNameStr = tithiIdx === 14 ? "Purnima" : tithiIdx === 29 ? "Amavasya" : TITHI_NAMES[tithiIdx % 15] || "Pratipada";

  const tithiDetail: TithiDetail = {
    index: tithiIdx,
    tithiNumber: tithiNum,
    name: tithiNameStr,
    hindiName: tithiNameStr,
    sanskritName: tithiNameStr,
    paksha,
    pakshaHindi,
    tithiLord,
    category: tithiCat.category,
    categoryHindi: tithiCat.categoryHindi,
    deity: tithiCat.deity,
    tatva: tithiCat.tatva,
    tatvaHindi: tithiCat.tatvaHindi,
    panchangaPhala: "तिथेः श्रियमाप्नोति — Bestows wealth, Lakshmi grace & emotional harmony",
    dagdhaRashis,
    significance: tithiCat.significance,
    spanStatus,
    endTime: tithiEndTime,
    endTimeFormatted: exactTithiEnd.endTimeFormatted || fmtTime(tithiEndTime),
    remainingHoursFormatted: exactTithiEnd.remainingHoursFormatted || `${Math.floor(hoursToTithiEnd)}h ${Math.floor((hoursToTithiEnd % 1) * 60)}m left`,
    moonPhaseEmoji: moonEmoji,
    illuminationPercent: Math.round(illum.phase_fraction * 100),
  };

  // 4. Vedic Lunar Month, 60-Year Samvatsara, Samvat, Ayanam & Ritu
  const sunRashiIdx = sunRashi.index;
  const amantaMonthName = AMANTA_MONTH_LIST[sunRashiIdx] || "Chaitra (चैत्र)";
  const purnimantaMonthIdx = paksha === "Krishna" ? (sunRashiIdx + 1) % 12 : sunRashiIdx;
  const purnimantaMonthName = AMANTA_MONTH_LIST[purnimantaMonthIdx] || "Chaitra (चैत्र)";

  const civilYear = date.getFullYear();
  const isAfterChaitra = date.getMonth() >= 3;
  const vikramSamvat = isAfterChaitra ? civilYear + 57 : civilYear + 56;
  const shakaSamvat = isAfterChaitra ? civilYear - 78 : civilYear - 79;

  // 60-Year Jovian Samvatsara cycle: (Shaka + 11) % 60
  const samvatsaraIdx = ((shakaSamvat + 11) % 60 + 60) % 60;
  const samvatsaraMeta = SAMVATSARA_60_LIST[samvatsaraIdx] || SAMVATSARA_60_LIST[0];

  const isUttarayana = [9, 10, 11, 0, 1, 2].includes(sunRashiIdx);
  const ayanam = isUttarayana ? "Uttarayana (उत्तरायण)" : "Dakshinayana (दक्षिणायन)";

  const RITU_LIST: Array<{ ritu: LunarMonthDetail["ritu"]; hindi: string }> = [
    { ritu: "Vasanta (वसन्त)", hindi: "वसन्त ऋतु (Spring — नवीनीकरण एवं उल्लास)" },
    { ritu: "Vasanta (वसन्त)", hindi: "वसन्त ऋतु (Spring)" },
    { ritu: "Grishma (ग्रीष्म)", hindi: "ग्रीष्म ऋतु (Summer — तेज एवं ऊर्जा)" },
    { ritu: "Grishma (ग्रीष्म)", hindi: "ग्रीष्म ऋतु (Summer)" },
    { ritu: "Varsha (वर्षा)", hindi: "वर्षा ऋतु (Monsoon — नवजीवन व समृद्धि)" },
    { ritu: "Varsha (वर्षा)", hindi: "वर्षा ऋतु (Monsoon)" },
    { ritu: "Sharad (शरद्)", hindi: "शरद् ऋतु (Autumn — निर्मलता व स्वास्थ्य)" },
    { ritu: "Sharad (शरद्)", hindi: "शरद् ऋतु (Autumn)" },
    { ritu: "Hemanta (हेमन्त)", hindi: "हेमन्त ऋतु (Pre-Winter — पुष्टि व शक्ति)" },
    { ritu: "Hemanta (हेमन्त)", hindi: "हेमन्त ऋतु (Pre-Winter)" },
    { ritu: "Shishira (शिशिर)", hindi: "शिशिर ऋतु (Winter — साधना व तपस्या)" },
    { ritu: "Shishira (शिशिर)", hindi: "शिशिर ऋतु (Winter)" },
  ];
  const rituInfo = RITU_LIST[sunRashiIdx] || RITU_LIST[0];

  const lunarMonth: LunarMonthDetail = {
    amantaMonth: amantaMonthName,
    purnimantaMonth: purnimantaMonthName,
    vikramSamvat,
    shakaSamvat,
    samvatsaraNumber: samvatsaraIdx + 1,
    samvatsaraName: samvatsaraMeta.name,
    samvatsaraHindi: `${samvatsaraMeta.hindi} संवत्सर`,
    ayanam,
    ritu: rituInfo.ritu,
    rituHindi: rituInfo.hindi,
    isAdhikaMasa: false,
  };

  // 5. Vara (Weekday) Detail (evaluated in target city's local date)
  const localEvaluationDate = new Date(date.getTime() + tzOffset * 3600 * 1000);
  const dayOfWeek = localEvaluationDate.getUTCDay();
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
    panchangaPhala: "वारादायुष्यवर्धनम् — Enhances longevity, Prana & physical vitality",
    auspiciousColors: varaInfo.auspiciousColors,
    inauspiciousColors: varaInfo.inauspiciousColors,
    exitRemedy: varaInfo.exitRemedy,
    dayMantra: varaInfo.dayMantra,
    recommendedCharity: varaInfo.recommendedCharity,
    activitiesFavorable: varaInfo.activitiesFavorable,
  };

  // 6. Nakshatra Detail (with exact astronomical root-finding)
  const nak = ephem.planets.Moon?.nakshatra || { index: 0, name: "Ashwini", sanskritName: "Ashwini", lord: "Ketu", deity: "Ashwini Kumaras" };
  const nakNature = NAKSHATRA_NATURES[nak.index] || {
    nature: "Kshipra (Laghu)",
    natureHindi: "लघु",
    favorable: "General auspicious activities",
  };

  const exactNakEnd = calculateNakshatraEndTime(date, location, ayanamshaType, date);
  const nakSpan = 360 / 27;
  const degIntoNak = moonSidLon % nakSpan;
  const degRemInNak = nakSpan - degIntoNak;
  const hoursToNakEnd = (degRemInNak / 13.17) * 24;
  const nakEndTime = exactNakEnd.endTime;

  const padaSpan = nakSpan / 4;
  const pada = Math.floor(degIntoNak / padaSpan) + 1;

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
    tatva: "Vayu (Air — Праण प्रवाह)",
    panchangaPhala: "नक्षत्राद्धरते पापम् — Removes karmic obstacles & purifies intentions",
    nature: nakNature.nature,
    natureHindi: nakNature.natureHindi,
    favorableActivities: nakNature.favorable,
    endTime: nakEndTime,
    endTimeFormatted: exactNakEnd.endTimeFormatted || fmtTime(nakEndTime),
    remainingHoursFormatted: exactNakEnd.remainingHoursFormatted || `${Math.floor(hoursToNakEnd)}h ${Math.floor((hoursToNakEnd % 1) * 60)}m left`,
  };

  // 7. Yoga Detail + Yogi / Sahayogi / Avayogi Planet of the Day
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
  const yogaRemainingFormatted = `${Math.floor(hoursToYogaEnd)}h ${Math.floor((hoursToYogaEnd % 1) * 60)}m left`;

  // Yogi Point = (Sun Sidereal + Moon Sidereal + 93°20') % 360
  const yogiPointLon = (sunSidLon + moonSidLon + (93 + 20 / 60)) % 360;
  const yogiNakIdx = Math.floor(yogiPointLon / (360 / 27)) % 27;
  const yogiSignIdx = Math.floor(yogiPointLon / 30) % 12;
  const avayogiNakIdx = (yogiNakIdx + 6) % 27;
  const yogiNakMeta = NAKSHATRA_NAMES[yogiNakIdx] || NAKSHATRA_NAMES[0];
  const avayogiNakMeta = NAKSHATRA_NAMES[avayogiNakIdx] || NAKSHATRA_NAMES[6];
  const sahayogiPlanet = RASHIS[yogiSignIdx]?.lord || "Moon";

  const yogaDetail: YogaDetail = {
    index: yogaIdx,
    name: YOGA_NAMES[yogaIdx] || "Vishkambha",
    hindiName: YOGA_NAMES[yogaIdx] || "Vishkambha",
    sanskritName: YOGA_NAMES[yogaIdx] || "Vishkambha",
    nature: yogaMeta.nature,
    deity: yogaMeta.deity,
    tatva: "Akasha (Ether — आकाश तत्व)",
    panchangaPhala: "योगाद्रोगनिवारणम् — Grants immunity, healing & spiritual integration",
    shunnedPortion: YOGA_SHUNNED_PORTIONS[yogaIdx] || "None (Entire Yoga is pure)",
    yogiNakshatra: yogiNakMeta.sanskritName,
    yogiPlanet: yogiNakMeta.lord,
    sahayogiPlanet,
    avayogiNakshatra: avayogiNakMeta.sanskritName,
    avayogiPlanet: avayogiNakMeta.lord,
    description: yogaMeta.desc,
    favorableActs: yogaMeta.favorable,
    prohibitedActs: yogaMeta.prohibited,
    endTime: yogaEndTime,
    endTimeFormatted: fmtTime(yogaEndTime),
    remainingHoursFormatted: yogaRemainingFormatted,
  };

  // 8. Karana Detail
  const karanaIdx = Math.floor(tithiDiff / 6) % 60;
  let karanaName = "";
  let karanaLord = "Sun (सूर्य)";
  let karanaDeity = "Indra (इन्द्र)";
  let isBhadra = false;
  if (karanaIdx === 0) {
    karanaName = "Kintughna (किन्तुघ्न)";
    karanaLord = "Ketu (केतु)";
    karanaDeity = "Kubera / Maruta (कुबेर)";
  } else if (karanaIdx >= 57) {
    if (karanaIdx === 57) {
      karanaName = "Shakuni (शकुनि)";
      karanaLord = "Rahu (राहु)";
      karanaDeity = "Kali / Garuda (काली)";
    } else if (karanaIdx === 58) {
      karanaName = "Chatushpada (चतुष्पाद)";
      karanaLord = "Rahu (राहु)";
      karanaDeity = "Vrishabha / Rudra (वृषभ)";
    } else {
      karanaName = "Naga (नाग)";
      karanaLord = "Ketu (केतु)";
      karanaDeity = "Naga Devatas (नाग)";
    }
  } else {
    const cycleIdx = (karanaIdx - 1) % 7;
    const charaKaranas = [
      { name: "Bava (बव)", lord: "Sun (सूर्य)", deity: "Indra (इन्द्र)" },
      { name: "Balava (बालव)", lord: "Moon (चन्द्र)", deity: "Brahma (ब्रह्मा)" },
      { name: "Kaulava (कौलव)", lord: "Mars (मंगल)", deity: "Mitra (मित्र)" },
      { name: "Taitila (तैतिल)", lord: "Mercury (बुध)", deity: "Aryama (अर्यमा)" },
      { name: "Gara (गर)", lord: "Jupiter (बृहस्पति)", deity: "Bhumi / Prithvi (पृथ्वी)" },
      { name: "Vanija (वणिज)", lord: "Venus (शुक्र)", deity: "Goddess Lakshmi (लक्ष्मी)" },
      { name: "Vishti / Bhadra (विष्टि / भद्रा)", lord: "Saturn (शनि)", deity: "Yama (यम)" },
    ];
    karanaName = charaKaranas[cycleIdx].name;
    karanaLord = charaKaranas[cycleIdx].lord;
    karanaDeity = charaKaranas[cycleIdx].deity;
    isBhadra = cycleIdx === 6;
  }

  const degIntoKarana = tithiDiff % 6;
  const degRemInKarana = 6 - degIntoKarana;
  const hoursToKaranaEnd = (degRemInKarana / 12.19) * 24;
  const karanaEndTime = new Date(date.getTime() + hoursToKaranaEnd * 3600 * 1000);
  const karanaRemainingFormatted = `${Math.floor(hoursToKaranaEnd)}h ${Math.floor((hoursToKaranaEnd % 1) * 60)}m left`;

  // Bhadra Vaas calculation
  let bhadraVaas: KaranaDetail["bhadraVaas"];
  let bhadraVaasHindi: string | undefined;
  let bhadraImpact: string | undefined;

  if (isBhadra) {
    if ([0, 1, 2, 7].includes(moonRashi.index)) {
      bhadraVaas = "Swarga Loka";
      bhadraVaasHindi = "स्वर्ग लोक में वास";
      bhadraImpact = "भद्रा स्वर्ग लोक में स्थित है। यह पृथ्वीवासियों के लिए शुभ फलप्रद एवं कल्याणकारी है।";
    } else if ([5, 6, 8, 9].includes(moonRashi.index)) {
      bhadraVaas = "Patala Loka";
      bhadraVaasHindi = "पाताल लोक में वास";
      bhadraImpact = "भद्रा पाताल लोक में स्थित है। यह धन-सम्पदा व भूमिगत कार्यों के लिए शुभ मानी जाती है।";
    } else {
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
    karanaLord,
    rulingDeity: karanaDeity,
    tatva: "Prithvi (Earth — पृथ्वी तत्व)",
    panchangaPhala: "करणात्कार्यसिद्धिः स्यात् — Grants concrete execution & completion of undertakings",
    isBhadra,
    bhadraVaas,
    bhadraVaasHindi,
    bhadraImpact,
    endTime: karanaEndTime,
    endTimeFormatted: fmtTime(karanaEndTime),
    remainingHoursFormatted: karanaRemainingFormatted,
  };

  // 8B. Active Planetary Hora (24 Horas from Sunrise)
  const dayHoraMs = dayDurationMs / 12;
  const nightHoraMs = nightDurationMs / 12;
  const isDaytimeNow = date.getTime() >= sunrise.getTime() && date.getTime() < sunset.getTime();
  let currentHoraIdx0 = 0; // 0 to 23
  let horaStartMs = sunrise.getTime();
  let horaEndMs = sunrise.getTime() + dayHoraMs;

  if (isDaytimeNow) {
    const idxInDay = Math.min(11, Math.max(0, Math.floor((date.getTime() - sunrise.getTime()) / dayHoraMs)));
    currentHoraIdx0 = idxInDay;
    horaStartMs = sunrise.getTime() + idxInDay * dayHoraMs;
    horaEndMs = horaStartMs + dayHoraMs;
  } else if (date.getTime() >= sunset.getTime()) {
    const idxInNight = Math.min(11, Math.max(0, Math.floor((date.getTime() - sunset.getTime()) / nightHoraMs)));
    currentHoraIdx0 = 12 + idxInNight;
    horaStartMs = sunset.getTime() + idxInNight * nightHoraMs;
    horaEndMs = horaStartMs + nightHoraMs;
  } else {
    // Before sunrise: belongs to late night Hora of prior Vedic day
    const prevSunsetMs = sunrise.getTime() - nightDurationMs;
    const idxInNight = Math.min(11, Math.max(0, Math.floor((date.getTime() - prevSunsetMs) / nightHoraMs)));
    currentHoraIdx0 = 12 + idxInNight;
    horaStartMs = prevSunsetMs + idxInNight * nightHoraMs;
    horaEndMs = horaStartMs + nightHoraMs;
  }

  const startHoraSeqIdx = WEEKDAY_START_HORA_INDEX[dayOfWeek] ?? 0;
  const activeHoraMeta = HORA_SPEED_ORDER[(startHoraSeqIdx + currentHoraIdx0) % 7];
  const nextHoraMeta = HORA_SPEED_ORDER[(startHoraSeqIdx + currentHoraIdx0 + 1) % 7];
  const nextHoraEndMs = horaEndMs + (currentHoraIdx0 + 1 < 12 ? dayHoraMs : nightHoraMs);

  const activeHora: PlanetaryHoraSlot = {
    horaNumber: currentHoraIdx0 + 1,
    isDayHora: currentHoraIdx0 < 12,
    lord: activeHoraMeta.lord,
    lordHindi: activeHoraMeta.hindi,
    startFormatted: fmtTime(new Date(horaStartMs)),
    endFormatted: fmtTime(new Date(horaEndMs)),
    favorableActivities: activeHoraMeta.activities,
  };

  const nextHora: PlanetaryHoraSlot = {
    horaNumber: ((currentHoraIdx0 + 1) % 24) + 1,
    isDayHora: ((currentHoraIdx0 + 1) % 24) < 12,
    lord: nextHoraMeta.lord,
    lordHindi: nextHoraMeta.hindi,
    startFormatted: fmtTime(new Date(horaEndMs)),
    endFormatted: fmtTime(new Date(nextHoraEndMs)),
    favorableActivities: nextHoraMeta.activities,
  };

  // 8C. Active Choghadiya (8 Day + 8 Night octants)
  const dayChoghadiyaMs = dayDurationMs / 8;
  const nightChoghadiyaMs = nightDurationMs / 8;
  let activeChoghadiyaMeta = CHOGHADIYA_CYCLE[0];
  let nextChoghadiyaMeta = CHOGHADIYA_CYCLE[1];
  let chogStartMs = sunrise.getTime();
  let chogEndMs = sunrise.getTime() + dayChoghadiyaMs;
  let nextChogEndMs = chogEndMs + dayChoghadiyaMs;
  let isDayChoghadiya = true;

  if (isDaytimeNow) {
    const octIdx = Math.min(7, Math.max(0, Math.floor((date.getTime() - sunrise.getTime()) / dayChoghadiyaMs)));
    const startIdx = DAY_CHOGHADIYA_START[dayOfWeek] ?? 0;
    activeChoghadiyaMeta = CHOGHADIYA_CYCLE[(startIdx + octIdx) % 7];
    nextChoghadiyaMeta = CHOGHADIYA_CYCLE[(startIdx + octIdx + 1) % 7];
    chogStartMs = sunrise.getTime() + octIdx * dayChoghadiyaMs;
    chogEndMs = chogStartMs + dayChoghadiyaMs;
    nextChogEndMs = chogEndMs + (octIdx + 1 < 8 ? dayChoghadiyaMs : nightChoghadiyaMs);
    isDayChoghadiya = true;
  } else {
    const baseNightStart = date.getTime() >= sunset.getTime() ? sunset.getTime() : sunrise.getTime() - nightDurationMs;
    const octIdx = Math.min(7, Math.max(0, Math.floor((date.getTime() - baseNightStart) / nightChoghadiyaMs)));
    const startNightSeqPos = NIGHT_CHOGHADIYA_START[dayOfWeek] ?? 0;
    const curCycleIdx = NIGHT_CHOGHADIYA_SEQUENCE[(startNightSeqPos + octIdx) % 7];
    const nextCycleIdx = NIGHT_CHOGHADIYA_SEQUENCE[(startNightSeqPos + octIdx + 1) % 7];
    activeChoghadiyaMeta = CHOGHADIYA_CYCLE[curCycleIdx];
    nextChoghadiyaMeta = CHOGHADIYA_CYCLE[nextCycleIdx];
    chogStartMs = baseNightStart + octIdx * nightChoghadiyaMs;
    chogEndMs = chogStartMs + nightChoghadiyaMs;
    nextChogEndMs = chogEndMs + nightChoghadiyaMs;
    isDayChoghadiya = false;
  }

  const activeChoghadiya: ChoghadiyaSlot = {
    name: activeChoghadiyaMeta.name,
    hindiName: activeChoghadiyaMeta.hindiName,
    rulingPlanet: activeChoghadiyaMeta.rulingPlanet,
    quality: activeChoghadiyaMeta.quality,
    isDaySlot: isDayChoghadiya,
    startFormatted: fmtTime(new Date(chogStartMs)),
    endFormatted: fmtTime(new Date(chogEndMs)),
    recommendation: activeChoghadiyaMeta.recommendation,
  };

  const nextChoghadiya: ChoghadiyaSlot = {
    name: nextChoghadiyaMeta.name,
    hindiName: nextChoghadiyaMeta.hindiName,
    rulingPlanet: nextChoghadiyaMeta.rulingPlanet,
    quality: nextChoghadiyaMeta.quality,
    isDaySlot: isDayChoghadiya,
    startFormatted: fmtTime(new Date(chogEndMs)),
    endFormatted: fmtTime(new Date(nextChogEndMs)),
    recommendation: nextChoghadiyaMeta.recommendation,
  };

  // 8D. Vara-Nakshatra Special Siddhi Yogas (Amrita Siddhi, Sarvartha Siddhi, Pushya, Dwipushkara, Tripushkara, Ravi Yoga)
  const siddhiYogas: SiddhiYogaStatus[] = [];
  if (dayOfWeek === 4 && nak.index === 7) {
    siddhiYogas.push({
      name: "Guru Pushya Amrita Yoga",
      hindiName: "गुरु-पुष्य अमृत सिद्धि योग",
      type: "Auspicious",
      description: "Supreme classical Muhurta combination (Thursday + Pushya) for wealth, gold investment, mantra diksha, and enduring prosperity.",
    });
  } else if (dayOfWeek === 0 && nak.index === 7) {
    siddhiYogas.push({
      name: "Ravi Pushya Yoga",
      hindiName: "रवि-पुष्य योग",
      type: "Auspicious",
      description: "Highly auspicious Sunday + Pushya combination for administrative authority, medicine, trade, and spiritual initiation.",
    });
  }

  if (AMRITA_SIDDHI_NAK[dayOfWeek] === nak.index) {
    siddhiYogas.push({
      name: "Amrita Siddhi Yoga",
      hindiName: "अमृत सिद्धि योग",
      type: "Auspicious",
      description: "Nectarine weekday-constellation union granting unfailing fruition in new beginnings, contracts, and journeys.",
    });
  }

  if ((SARVARTHA_SIDDHI_NAKS[dayOfWeek] || []).includes(nak.index)) {
    siddhiYogas.push({
      name: "Sarvartha Siddhi Yoga",
      hindiName: "सर्वार्थ सिद्धि योग",
      type: "Auspicious",
      description: "All-accomplishing weekday-nakshatra alignment that neutralizes minor Muhurta blemishes and supports new ventures.",
    });
  }

  // Tripushkara & Dwipushkara Yoga check: Bhadra Tithi (2, 7, 12) + Sun/Tue/Sat (0, 2, 6)
  const isBhadraTithi = [2, 7, 12].includes(tithiNum);
  const isSolarMarsSatDay = [0, 2, 6].includes(dayOfWeek);
  const isTriPadaNak = [2, 6, 11, 15, 20, 24].includes(nak.index); // Krittika, Punarvasu, U.Phalguni, Vishakha, U.Ashadha, P.Bhadrapada
  const isDwiPadaNak = [4, 13, 22].includes(nak.index); // Mrigashira, Chitra, Dhanishta

  if (isBhadraTithi && isSolarMarsSatDay && isTriPadaNak) {
    siddhiYogas.push({
      name: "Tripushkara Yoga (3x Multiplier)",
      hindiName: "त्रिपुष्कर योग (तीन गुना फल)",
      type: "Auspicious",
      description: "Classical 3x multiplier combination: wealth investments, asset purchases, and auspicious deeds performed today repeat thrice (avoid borrowing or loss).",
    });
  } else if (isBhadraTithi && isSolarMarsSatDay && isDwiPadaNak) {
    siddhiYogas.push({
      name: "Dwipushkara Yoga (2x Multiplier)",
      hindiName: "द्विपुष्कर योग (दो गुना फल)",
      type: "Auspicious",
      description: "Classical 2x multiplier combination: auspicious acquisitions and financial gains initiated today repeat twice.",
    });
  }

  // Ravi Yoga check: Moon Nakshatra is 4th, 6th, 9th, 10th, 13th, or 20th from Sun Nakshatra
  const sunNakIdx = ephem.planets.Sun?.nakshatra.index ?? Math.floor(sunSidLon / (360 / 27));
  const nakDistFromSun = ((nak.index - sunNakIdx + 27) % 27) + 1;
  if ([4, 6, 9, 10, 13, 20].includes(nakDistFromSun)) {
    siddhiYogas.push({
      name: "Ravi Yoga",
      hindiName: "रवि योग (सूर्य-चन्द्र नक्षत्र सिद्धि)",
      type: "Auspicious",
      description: `Moon is in the ${nakDistFromSun}th constellation from Sun's Nakshatra, dissolving malefic stellar obstructions like snow before the Sun.`,
    });
  }

  if (siddhiYogas.length === 0) {
    siddhiYogas.push({
      name: "Samanya Anandadi Yoga",
      hindiName: "सामान्य आनन्दादि योग",
      type: "Auspicious",
      description: "Standard balanced weekday-constellation flow; rely on Abhijit Muhurta, Shubha Choghadiya, and favorable Planetary Hora.",
    });
  }

  // 8E. Panchaka Status (Moon in Aquarius or Pisces: Dhanishta Pada 3-4 through Revati)
  const isPanchakaActive = moonRashi.index === 10 || moonRashi.index === 11;
  let panchakaStatus: PanchakaStatus;
  if (!isPanchakaActive) {
    panchakaStatus = {
      isActive: false,
      name: "Panchaka-Rahita (Free from Panchaka)",
      hindiName: "पञ्चक-रहित (शुभ)",
      severity: "Shubha (Free)",
      guidance: "Moon is outside the 5 Dhanishta-Revati Panchaka constellations. All woodwork, roof-laying, south-facing travel, and domestic purchases are unrestricted.",
    };
  } else {
    const panchakaByDay: Record<number, { name: string; hindi: string; sev: PanchakaStatus["severity"]; guide: string }> = {
      0: { name: "Roga Panchaka", hindi: "रोग पञ्चक (रविवार)", sev: "Caution (Panchaka Active)", guide: "Sunday Panchaka: take care of physical vitality and avoid initiating high-risk medical or roof-construction tasks." },
      1: { name: "Raja Panchaka", hindi: "राज पञ्चक (सोमवार)", sev: "Madhyama (Mild)", guide: "Monday Panchaka: auspicious for government, administrative, and property work; observe standard Panchaka precautions for woodwork/South travel." },
      2: { name: "Agni Panchaka", hindi: "अग्नि पञ्चक (मंगलवार)", sev: "Caution (Panchaka Active)", guide: "Tuesday Panchaka: auspicious for court/machinery tasks, but strictly avoid fire hazards, electrical/furnace construction, and roof work." },
      3: { name: "Sadharana Panchaka", hindi: "दोषमुक्त साधारण पञ्चक (बुधवार)", sev: "Madhyama (Mild)", guide: "Wednesday Panchaka is mild and free from severe malefic sting; only avoid traditional 5-fold prohibited acts (wood storage, South travel, bed weaving)." },
      4: { name: "Guru Panchaka", hindi: "दोषमुक्त गुरु पञ्चक (गुरुवार)", sev: "Madhyama (Mild)", guide: "Thursday Panchaka is benign for general auspicious works; observe caution only for roof-casting and Southward journeys." },
      5: { name: "Chora Panchaka", hindi: "चोर पञ्चक (शुक्रवार)", sev: "Caution (Panchaka Active)", guide: "Friday Panchaka: guard financial valuables, avoid risky nocturnal travel, and postpone major commercial shipments." },
      6: { name: "Mrityu Panchaka", hindi: "मृत्यु पञ्चक (शनिवार)", sev: "Caution (Panchaka Active)", guide: "Saturday Panchaka carries 5-fold friction: strictly avoid hazardous operations, litigation starts, roof-casting, and South travel." },
    };
    const pm = panchakaByDay[dayOfWeek] || panchakaByDay[3];
    panchakaStatus = {
      isActive: true,
      name: pm.name,
      hindiName: pm.hindi,
      severity: pm.sev,
      guidance: pm.guide,
    };
  }

  // 8F. Classical Agnivasa (Homa Sanction) & Shivavasa (Rudrabhisheka Sanction)
  // Agnivasa: (Shukla/Krishna Tithi 1..15 + Vara 1..7 + 1) % 4 -> 0 or 3 = Prithvi (Shubha), 1 = Akasha, 2 = Patala
  const agniRem = (tithiNum + (dayOfWeek + 1) + 1) % 4;
  const agnivasa: VasaSanctionStatus["agnivasa"] =
    agniRem === 0 || agniRem === 3
      ? {
          residence: "Prithvi (Earth)",
          hindiResidence: "पृथ्वी लोक में अग्निवास (शुभ)",
          isHomaSanctioned: true,
          verdict: "Sanctioned (शुभ) — Agni resides on Prithvi Loka; Homa, Yajna, and Agnihotra rituals grant full auspicious fruition today.",
        }
      : agniRem === 1
      ? {
          residence: "Akasha (Sky)",
          hindiResidence: "आकाश लोक में अग्निवास (अशुभ)",
          isHomaSanctioned: false,
          verdict: "Contraindicated — Agni resides in Akasha Loka; postpone Kamya Homa/Yajna (Nitya/daily worship remains permitted).",
        }
      : {
          residence: "Patala (Netherworld)",
          hindiResidence: "पाताल लोक में अग्निवास (अशुभ)",
          isHomaSanctioned: false,
          verdict: "Contraindicated — Agni resides in Patala Loka; postpone Kamya fire sacrifices today.",
        };

  // Shivavasa: ((Tithi 1..30) * 2 + 5) % 7
  const tithi1to30 = tithiIdx + 1;
  const shivaRem = (tithi1to30 * 2 + 5) % 7;
  const shivaMap: Record<number, { res: string; hindi: string; ok: boolean; verdict: string }> = {
    1: { res: "Kailasha (Mount Kailash)", hindi: "कैलाश पर शिववास (परम शुभ)", ok: true, verdict: "Sanctioned (सुख-समृद्धिदायक) — Lord Shiva resides on Mount Kailash; Rudrabhisheka grants joy and prosperity." },
    2: { res: "Gauri-Sannidhana (With Maa Gauri)", hindi: "माँ गौरी के सन्निधि में (शुभ)", ok: true, verdict: "Sanctioned (मंगलकारी) — Lord Shiva is seated with Goddess Gauri; Rudrabhisheka bestows marital harmony and fortune." },
    3: { res: "Vrishabha-Arudha (Mounted on Nandi)", hindi: "वृषभ (नन्दी) पर सवार (अष्टसिद्धि)", ok: true, verdict: "Sanctioned (अभीष्ट सिद्धिदायक) — Lord Shiva is mounted on Nandi; Rudrabhisheka fulfills desired objectives." },
    4: { res: "Sabha (In Royal Assembly)", hindi: "सभा में शिववास (मध्यम/सावधानी)", ok: false, verdict: "Caution for Kamya Abhisheka — Shiva is in Sabha; Nitya Shiva Puja and Pradosha/Shravana worship remain always auspicious." },
    5: { res: "Bhojana (Taking Sustenance)", hindi: "भोजन में शिववास (वर्जित)", ok: false, verdict: "Postpone Kamya Rudrabhisheka (Nitya/Shivalinga archana in temples is exempt from Shivavasa)." },
    6: { res: "Krida (Divine Sport)", hindi: "क्रीड़ा में शिववास (वर्जित)", ok: false, verdict: "Postpone Kamya Rudrabhisheka today; perform mental mantra japa ('Om Namah Shivaya') instead." },
    0: { res: "Smashana (Cremation Ground)", hindi: "श्मशान में शिववास (काम्य अभिषेक वर्जित)", ok: false, verdict: "Postpone household Kamya Rudrabhisheka; महामृत्युञ्जय (Maha Mrityunjaya) Japa and temple darshan remain beneficial." },
  };
  const sm = shivaMap[shivaRem] || shivaMap[1];
  const vasaSanctions: VasaSanctionStatus = {
    agnivasa,
    shivavasa: {
      residence: sm.res,
      hindiResidence: sm.hindi,
      isRudrabhishekaSanctioned: sm.ok,
      verdict: sm.verdict,
    },
  };

  // 9. Disha Shool & Chandra Vaas
  const chandraVaasDirections: Record<number, string> = {
    0: "East (पूर्व)",
    4: "East (पूर्व)",
    8: "East (पूर्व)",
    1: "South (दक्षिण)",
    5: "South (दक्षिण)",
    9: "South (दक्षिण)",
    2: "West (पश्चिम)",
    6: "West (पश्चिम)",
    10: "West (पश्चिम)",
    3: "North (उत्तर)",
    7: "North (उत्तर)",
    11: "North (उत्तर)",
  };

  const dishaShool: DishaShoolDetail = {
    prohibitedDirection: varaInfo.prohibitedDirection,
    reason: `Classical Samhita principle: Travel towards ${varaInfo.prohibitedDirection} is contraindicated on ${varaInfo.hindiName}.`,
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
      startFormatted: fmtTime(abhijitStart),
      endFormatted: fmtTime(abhijitEnd),
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
      startFormatted: fmtTime(abhijitStart),
      endFormatted: fmtTime(abhijitEnd),
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
    startFormatted: fmtTime(brahmaStart),
    endFormatted: fmtTime(brahmaEnd),
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
    startFormatted: fmtTime(vijayaStart),
    endFormatted: fmtTime(vijayaEnd),
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
    startFormatted: fmtTime(godhuliStart),
    endFormatted: fmtTime(godhuliEnd),
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
    startFormatted: fmtTime(amritStart),
    endFormatted: fmtTime(amritEnd),
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
    startFormatted: fmtTime(nishitaStart),
    endFormatted: fmtTime(nishitaEnd),
    durationFormatted: `${Math.round(nightMuhurtaMs / 60000)} mins`,
    isActiveNow: now >= nishitaStart && now <= nishitaEnd,
    quality: "Sadhana (तांत्रिक व शिव साधना)",
    description: "Midnight hour for Lord Shiva, Mahakali, and advanced Mantra Sadhana.",
  });

  // --- Inauspicious Kaalas ---
  const rahuKaalOffsets: Record<number, number> = {
    0: 7,
    1: 1,
    2: 6,
    3: 4,
    4: 5,
    5: 3,
    6: 2,
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
    startFormatted: fmtTime(rahuStart),
    endFormatted: fmtTime(rahuEnd),
    durationFormatted: `${Math.round(dayOctantMs / 60000)} mins`,
    isActiveNow: now >= rahuStart && now <= rahuEnd,
    quality: "Ashubha (पूर्णतः त्याज्य)",
    description: "Malefic planetary division ruled by Rahu. Do not sign agreements, launch businesses or travel.",
    precautions: "Do not start new ventures or buy assets during this window.",
  });

  // B. Yamagandam
  const yamaOffsets: Record<number, number> = {
    0: 4,
    1: 3,
    2: 2,
    3: 1,
    4: 0,
    5: 6,
    6: 5,
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
    startFormatted: fmtTime(yamaStart),
    endFormatted: fmtTime(yamaEnd),
    durationFormatted: `${Math.round(dayOctantMs / 60000)} mins`,
    isActiveNow: now >= yamaStart && now <= yamaEnd,
    quality: "Ashubha (यम का प्रभाव)",
    description: "Inauspicious daytime segment causing loss, delay, and unproductive efforts.",
  });

  // C. Gulika Kaalam
  const gulikaOffsets: Record<number, number> = {
    0: 6,
    1: 5,
    2: 4,
    3: 3,
    4: 2,
    5: 1,
    6: 0,
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
    startFormatted: fmtTime(gulikaStart),
    endFormatted: fmtTime(gulikaEnd),
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
    startFormatted: fmtTime(durMuhurtam1),
    endFormatted: fmtTime(durMuhurtam1End),
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

  const summary = `आज ${varaDetail.hindiName} है। संवत्सर: ${lunarMonth.samvatsaraHindi} (विक्रम संवत् ${lunarMonth.vikramSamvat}, शक ${lunarMonth.shakaSamvat})। मास: ${lunarMonth.purnimantaMonth} (पूर्णिमांत) / ${lunarMonth.amantaMonth} (अमांत), ${lunarMonth.ayanam}, ${lunarMonth.ritu}। तिथि: ${tithiDetail.hindiName} (${tithiDetail.pakshaHindi}, ${tithiDetail.categoryHindi}), नक्षत्र: ${nakshatraDetail.hindiName} (पद ${nakshatraDetail.pada}), योग: ${yogaDetail.hindiName}, करण: ${karanaDetail.hindiName}। चन्द्रमा ${moonRashi.englishName} (${moonRashi.sanskritName}) राशि में स्थित हैं। आज का दिशाशूल: ${dishaShool.prohibitedDirection}। शुभ रंग: ${varaDetail.auspiciousColors.join(", ")}।`;

  return {
    evaluationDate: date,
    location,
    cityName: location.cityName || "Local Observatory",
    sunrise,
    sunset,
    nextSunrise,
    sunriseFormatted: fmtTime(sunrise),
    sunsetFormatted: fmtTime(sunset),
    dayDurationFormatted: `${dayHours}h ${dayMins}m`,
    nightDurationFormatted: `${nightHours}h ${nightMins}m`,
    lunarMonth,
    tithi: tithiDetail,
    vara: varaDetail,
    nakshatra: nakshatraDetail,
    yoga: yogaDetail,
    karana: karanaDetail,
    activeHora,
    nextHora,
    activeChoghadiya,
    nextChoghadiya,
    siddhiYogas,
    panchakaStatus,
    vasaSanctions,
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

const TARA_TABLE: Array<{
  num: number;
  name: string;
  hindi: string;
  lord: string;
  strength: PersonalPanchangaAlignment["tarabala"]["strength"];
  guidance: string;
}> = [
  { num: 1, name: "Janma", hindi: "जन्म तारा", lord: "Sun (सूर्य)", strength: "Madhyama", guidance: "1st Tara (Janma): Heightened self-awareness; avoid physical overexertion or hasty ego-driven risks (favorable for spiritual introspection)." },
  { num: 2, name: "Sampat", hindi: "सम्पत् तारा", lord: "Mercury (बुध)", strength: "Ati-Shubha", guidance: "2nd Tara (Sampat): Supreme auspiciousness for wealth generation, commercial agreements, asset purchases, and career expansion." },
  { num: 3, name: "Vipat", hindi: "विपत् तारा", lord: "Rahu (राहु)", strength: "Ashubha", guidance: "3rd Tara (Vipat): Caution against sudden obstacles or misunderstandings; postpone high-stakes speculative ventures and long journeys." },
  { num: 4, name: "Kshema", hindi: "क्षेम तारा", lord: "Jupiter (बृहस्पति)", strength: "Ati-Shubha", guidance: "4th Tara (Kshema): Grants safety, protection, domestic harmony, healing, and steady long-term foundations." },
  { num: 5, name: "Pratyak", hindi: "प्रत्यक् तारा", lord: "Ketu (केतु)", strength: "Ashubha", guidance: "5th Tara (Pratyak): Indicates temporary resistance or delays; focus on completing existing tasks rather than launching new ones." },
  { num: 6, name: "Sadhana", hindi: "साधन तारा", lord: "Moon (चन्द्र)", strength: "Ati-Shubha", guidance: "6th Tara (Sadhana): Crown of execution — strenuous efforts bear fruit, goals are realized, and difficult negotiations succeed." },
  { num: 7, name: "Naidhana (Vadha)", hindi: "नैधन (वध) तारा", lord: "Saturn (शनि)", strength: "Ashubha", guidance: "7th Tara (Naidhana): Strictly avoid initiating major new beginnings, surgeries, or risky travel; chant your Ishta mantra for protection." },
  { num: 8, name: "Mitra", hindi: "मित्र तारा", lord: "Venus (शुक्र)", strength: "Shubha", guidance: "8th Tara (Mitra): Cooperative alliances, friendly support, diplomatic success, and harmonious partnerships." },
  { num: 9, name: "Parama Mitra", hindi: "परम मित्र तारा", lord: "Mars (मंगल)", strength: "Ati-Shubha", guidance: "9th Tara (Parama Mitra): Supreme stellar blessing from high authorities, mentors, and allies for major undertakings." },
];

/**
 * Computes Personalized Tarabala, Chandrabala, and Hora/Tithi Natal Harmony for the Native
 */
export function calculatePersonalPanchangaAlignment(
  dailyPanchang: DailySamirTripathiPanchang,
  natalEphem: EphemerisResult
): PersonalPanchangaAlignment {
  const natalMoon = natalEphem.planets.Moon;
  const natalNakIdx = natalMoon?.nakshatra.index ?? 0;
  const natalNakName = natalMoon?.nakshatra.sanskritName || "Ashwini";
  const natalRashiIdx = natalMoon?.rashi.index ?? 0;
  const natalRashiName = `${natalMoon?.rashi.englishName || "Aries"} (${natalMoon?.rashi.sanskritName || "Mesha"})`;

  const todayNakIdx = dailyPanchang.nakshatra.index;
  const countFromJanma = ((todayNakIdx - natalNakIdx + 27) % 27) + 1;
  const taraNumber = ((countFromJanma - 1) % 9) + 1;
  const paryaya = Math.ceil(countFromJanma / 9);
  const taraMeta = TARA_TABLE[taraNumber - 1] || TARA_TABLE[0];

  const cbEntry = dailyPanchang.chandraBalaList[natalRashiIdx] || dailyPanchang.chandraBalaList[0];
  const isChandrashtama = cbEntry.houseFromMoon === 8;

  const horaLordClean = dailyPanchang.activeHora.lord.split(" ")[0];
  const tithiLordClean = dailyPanchang.tithi.tithiLord.split(" ")[0];
  const horaPlanetBody = natalEphem.planets[horaLordClean as keyof typeof natalEphem.planets];
  const tithiPlanetBody = natalEphem.planets[tithiLordClean as keyof typeof natalEphem.planets];
  const natalHouseOfHoraLord = horaPlanetBody?.house || 1;
  const natalHouseOfTithiLord = tithiPlanetBody?.house || 1;

  const isHoraHouseGood = [1, 2, 3, 4, 5, 7, 9, 10, 11].includes(natalHouseOfHoraLord);
  const isTithiHouseGood = [1, 2, 3, 4, 5, 7, 9, 10, 11].includes(natalHouseOfTithiLord);
  const verdict =
    isHoraHouseGood && isTithiHouseGood
      ? `Both the running Hora Lord (${horaLordClean} in natal H${natalHouseOfHoraLord}) and Today's Tithi Lord (${tithiLordClean} in natal H${natalHouseOfTithiLord}) occupy auspicious natal houses — strong personal synergy right now.`
      : isHoraHouseGood
      ? `Running Hora Lord (${horaLordClean} in natal H${natalHouseOfHoraLord}) is well-placed in your birth chart, supporting immediate actions during this hour.`
      : `Running Hora Lord (${horaLordClean}) sits in dusthana House ${natalHouseOfHoraLord} of your natal chart; prefer waiting for the next Hora (${dailyPanchang.nextHora.lord}) for major personal commitments.`;

  return {
    natalNakshatra: natalNakName,
    natalRashi: natalRashiName,
    todayNakshatra: dailyPanchang.nakshatra.sanskritName,
    todayRashi: `${dailyPanchang.chandraRashi} (${dailyPanchang.chandraRashiHindi})`,
    tarabala: {
      countFromJanma,
      taraNumber,
      paryaya,
      taraName: taraMeta.name,
      taraHindi: taraMeta.hindi,
      rulingPlanet: taraMeta.lord,
      strength: taraMeta.strength,
      guidance: taraMeta.guidance,
    },
    chandrabala: {
      houseFromJanmaRashi: cbEntry.houseFromMoon,
      strength: cbEntry.strength,
      isChandrashtama,
      guidance: cbEntry.guidance,
    },
    horaHarmony: {
      activeHoraLord: horaLordClean,
      natalHouseOfHoraLord,
      tithiLord: tithiLordClean,
      natalHouseOfTithiLord,
      verdict,
    },
  };
}

