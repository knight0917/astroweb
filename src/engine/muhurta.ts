/**
 * Classical Auspicious Muhurta Finder & Panchanga Shuddhi Engine (शुभ मुहूर्त एवं पञ्चाङ्ग शुद्धि)
 * References:
 * - Muhurta Chintamani (मुहूर्त चिन्तामणि)
 * - Kalaprakasika
 * - Brihat Samhita (बृहत् संहिता)
 */

import * as Astronomy from "astronomy-engine";
import { GeoLocation } from "./types";
import { calculateVedicEphemeris } from "./ephemeris";

export type EventCategory =
  | "grihaPravesh"
  | "vivaha"
  | "businessOpening"
  | "vehiclePurchase"
  | "propertyRegistration"
  | "generalAuspicious";

export interface MuhurtaTimeSlot {
  name: string;
  sanskritName: string;
  startTime: Date;
  endTime: Date;
  quality: "Shubha (Auspicious)" | "Amrit (Highly Auspicious)" | "Ashubha (Inauspicious)" | "Varjya (Prohibited)";
  type: "Abhijit" | "Brahma" | "AmritKaal" | "Godhuli" | "Vijaya" | "Nishita" | "RahuKaal" | "GulikaKaal" | "Yamaganda" | "Durmuhurta";
  description: string;
  suitableFor: string[];
}

export interface DayPanchangaShuddhi {
  date: Date;
  sunrise: Date;
  sunset: Date;
  dayDurationHours: number;
  nightDurationHours: number;
  tithiNumber: number;
  tithiName: string;
  isRiktaTithi: boolean;
  isAmavasya: boolean;
  nakshatraIndex: number;
  nakshatraName: string;
  yogaName: string;
  karanaName: string;
  isBhadra: boolean;
  shuddhiScore: number;
  doshasPresent: string[];
  auspiciousSlots: MuhurtaTimeSlot[];
  inauspiciousSlots: MuhurtaTimeSlot[];
}

export interface EventMuhurtaRecommendation {
  category: EventCategory;
  categoryName: string;
  sanskritName: string;
  isRecommended: boolean;
  suitabilityScore: number;
  favorableFactors: string[];
  unfavorableFactors: string[];
  bestTimeSlots: MuhurtaTimeSlot[];
}

export function calculateDayMuhurta(date: Date, location: GeoLocation): DayPanchangaShuddhi {
  const observer = new Astronomy.Observer(location.latitude, location.longitude, location.elevation || 0);
  const astroTime = Astronomy.MakeTime(date);

  const sunriseResult = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, astroTime, 1);
  const sunsetResult = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, astroTime, 1);

  const sunrise = sunriseResult ? sunriseResult.date : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0);
  let sunset = sunsetResult ? sunsetResult.date : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18, 15);

  if (sunset.getTime() < sunrise.getTime()) {
    sunset = new Date(sunrise.getTime() + 12 * 3600 * 1000);
  }

  const dayMs = Math.max(1000 * 3600 * 6, sunset.getTime() - sunrise.getTime());
  const muhurtaMs = dayMs / 15;
  const dayOfWeek = date.getDay();

  const ephem = calculateVedicEphemeris(date, location);
  const tithiNumber = ephem.panchanga.tithi.index;
  const nakshatraIndex = ephem.panchanga.nakshatra.index;
  const nakshatraName = ephem.panchanga.nakshatra.sanskritName;

  const isRiktaTithi = [4, 9, 14, 19, 24, 29].includes(tithiNumber);
  const isAmavasya = tithiNumber === 30;
  const isBhadra = ephem.panchanga.karana.name.toLowerCase().includes("vishti");

  // 1. Abhijit Muhurta (8th Muhurta of Daytime)
  const abhijitStart = new Date(sunrise.getTime() + 7 * muhurtaMs);
  const abhijitEnd = new Date(sunrise.getTime() + 8 * muhurtaMs);
  const isAbhijitWednesday = dayOfWeek === 3;

  const abhijitSlot: MuhurtaTimeSlot = {
    name: "Abhijit Muhurta",
    sanskritName: "अभिजित् मुहूर्त",
    startTime: abhijitStart,
    endTime: abhijitEnd,
    quality: isAbhijitWednesday ? "Ashubha (Inauspicious)" : "Amrit (Highly Auspicious)",
    type: "Abhijit",
    description: isAbhijitWednesday
      ? "Abhijit is contraindicated on Wednesdays due to planetary enmity."
      : "Premier victory Muhurta destroying minor blemishes and doshas.",
    suitableFor: ["All New Initiatives", "Travel", "Signing Contracts", "Purchase"],
  };

  // 2. Brahma Muhurta (2 Muhurtas / 96 mins before Sunrise)
  const brahmaStart = new Date(sunrise.getTime() - 96 * 60 * 1000);
  const brahmaEnd = new Date(sunrise.getTime() - 48 * 60 * 1000);
  const brahmaSlot: MuhurtaTimeSlot = {
    name: "Brahma Muhurta",
    sanskritName: "ब्राह्म मुहूर्त",
    startTime: brahmaStart,
    endTime: brahmaEnd,
    quality: "Amrit (Highly Auspicious)",
    type: "Brahma",
    description: "Supreme spiritual window for meditation, Pranayama, Mantra initiation and study.",
    suitableFor: ["Meditation", "Sadhana", "Mantra Japa", "Higher Learning"],
  };

  // 3. Godhuli Muhurta (24 mins before and after Sunset)
  const godhuliStart = new Date(sunset.getTime() - 24 * 60 * 1000);
  const godhuliEnd = new Date(sunset.getTime() + 24 * 60 * 1000);
  const godhuliSlot: MuhurtaTimeSlot = {
    name: "Godhuli Muhurta",
    sanskritName: "गोधूलि मुहूर्त",
    startTime: godhuliStart,
    endTime: godhuliEnd,
    quality: "Shubha (Auspicious)",
    type: "Godhuli",
    description: "Dusk twilight window neutralizing marital and travel impediments.",
    suitableFor: ["Weddings", "Blessings", "Religious Offerings"],
  };

  // 4. Vijaya Muhurta (11th Muhurta of Daytime)
  const vijayaStart = new Date(sunrise.getTime() + 10 * muhurtaMs);
  const vijayaEnd = new Date(sunrise.getTime() + 11 * muhurtaMs);
  const vijayaSlot: MuhurtaTimeSlot = {
    name: "Vijaya Muhurta",
    sanskritName: "विजय मुहूर्त",
    startTime: vijayaStart,
    endTime: vijayaEnd,
    quality: "Shubha (Auspicious)",
    type: "Vijaya",
    description: "Auspicious for legal victories, competitions and crucial meetings.",
    suitableFor: ["Court Matters", "Competitions", "Commercial Launches"],
  };

  // 5. Amrit Kaal
  const amritStart = new Date(sunrise.getTime() + 4 * muhurtaMs);
  const amritEnd = new Date(sunrise.getTime() + 5.5 * muhurtaMs);
  const amritSlot: MuhurtaTimeSlot = {
    name: "Amrit Kaal",
    sanskritName: "अमृत काल",
    startTime: amritStart,
    endTime: amritEnd,
    quality: "Amrit (Highly Auspicious)",
    type: "AmritKaal",
    description: "Nectarine planetary flow ideal for healthcare, agreements and financial growth.",
    suitableFor: ["Wealth Creation", "Medical Procedures", "Deal Closures"],
  };

  // Inauspicious Windows (Rahu Kaal, Gulika, Yamaganda)
  const eighthMs = dayMs / 8;
  const rahuIdxMap = [7, 1, 6, 4, 5, 3, 2];
  const gulikaIdxMap = [6, 5, 4, 3, 2, 1, 0];
  const yamaIdxMap = [4, 3, 2, 1, 0, 6, 5];

  const rahuStart = new Date(sunrise.getTime() + rahuIdxMap[dayOfWeek] * eighthMs);
  const rahuEnd = new Date(rahuStart.getTime() + eighthMs);
  const rahuSlot: MuhurtaTimeSlot = {
    name: "Rahu Kaal",
    sanskritName: "राहु काल",
    startTime: rahuStart,
    endTime: rahuEnd,
    quality: "Varjya (Prohibited)",
    type: "RahuKaal",
    description: "Inauspicious window governed by Rahu. Strictly avoid starting new ventures, travel or major purchases.",
    suitableFor: ["Rahu Pooja", "Bhairav Sadhana"],
  };

  const gulikaStart = new Date(sunrise.getTime() + gulikaIdxMap[dayOfWeek] * eighthMs);
  const gulikaEnd = new Date(gulikaStart.getTime() + eighthMs);
  const gulikaSlot: MuhurtaTimeSlot = {
    name: "Gulika Kaal",
    sanskritName: "गुलिक काल",
    startTime: gulikaStart,
    endTime: gulikaEnd,
    quality: "Ashubha (Inauspicious)",
    type: "GulikaKaal",
    description: "Window governed by Saturn's son Gulika/Mandi. Avoid auspicious ceremonies.",
    suitableFor: ["Routine maintenance only"],
  };

  const yamaStart = new Date(sunrise.getTime() + yamaIdxMap[dayOfWeek] * eighthMs);
  const yamaEnd = new Date(yamaStart.getTime() + eighthMs);
  const yamaSlot: MuhurtaTimeSlot = {
    name: "Yamaganda",
    sanskritName: "यमगण्ड काल",
    startTime: yamaStart,
    endTime: yamaEnd,
    quality: "Ashubha (Inauspicious)",
    type: "Yamaganda",
    description: "Window ruled by Yama. Journey started during Yamaganda may encounter obstacles.",
    suitableFor: ["Ancestor rituals / Tarpan"],
  };

  const doshasPresent: string[] = [];
  let shuddhiScore = 100;

  if (isRiktaTithi) {
    doshasPresent.push(`Rikta Tithi #${tithiNumber} (Chathurthi/Navami/Chaturdashi)`);
    shuddhiScore -= 20;
  }
  if (isAmavasya) {
    doshasPresent.push("Amavasya (New Moon - Sun-Moon Conjunction)");
    shuddhiScore -= 25;
  }
  if (isBhadra) {
    doshasPresent.push("Vishti Karana (Bhadra Dosha active)");
    shuddhiScore -= 25;
  }

  const auspiciousSlots = [brahmaSlot, abhijitSlot, amritSlot, vijayaSlot, godhuliSlot];
  const inauspiciousSlots = [rahuSlot, gulikaSlot, yamaSlot];

  return {
    date,
    sunrise,
    sunset,
    dayDurationHours: Math.round((dayMs / (1000 * 3600)) * 100) / 100,
    nightDurationHours: Math.round(((24 * 3600 * 1000 - dayMs) / (1000 * 3600)) * 100) / 100,
    tithiNumber,
    tithiName: ephem.panchanga.tithi.name,
    isRiktaTithi,
    isAmavasya,
    nakshatraIndex,
    nakshatraName,
    yogaName: ephem.panchanga.yoga.name,
    karanaName: ephem.panchanga.karana.name,
    isBhadra,
    shuddhiScore: Math.max(20, shuddhiScore),
    doshasPresent,
    auspiciousSlots,
    inauspiciousSlots,
  };
}

export function evaluateEventMuhurta(
  category: EventCategory,
  dayData: DayPanchangaShuddhi
): EventMuhurtaRecommendation {
  const favorableFactors: string[] = [];
  const unfavorableFactors: string[] = [];
  let suitabilityScore = dayData.shuddhiScore;

  const nak = dayData.nakshatraName;

  switch (category) {
    case "grihaPravesh": {
      const shubhaNaks = ["Rohini", "Mrigashira", "Uttara Phalguni", "Uttara Ashadha", "Uttara Bhadrapada", "Anuradha", "Revati", "Pushya"];
      if (shubhaNaks.includes(nak)) {
        favorableFactors.push(`Auspicious Nakshatra for Griha Pravesh (${nak})`);
        suitabilityScore += 15;
      } else {
        unfavorableFactors.push(`Nakshatra (${nak}) is ordinary for house warming`);
        suitabilityScore -= 10;
      }
      if (dayData.isRiktaTithi || dayData.isAmavasya) {
        unfavorableFactors.push("Rikta/Amavasya Tithi prohibited for Griha Pravesh");
        suitabilityScore -= 30;
      }
      return {
        category,
        categoryName: "Griha Pravesh (House Warming)",
        sanskritName: "गृह प्रवेश मुहूर्त",
        isRecommended: suitabilityScore >= 70,
        suitabilityScore: Math.min(100, Math.max(10, suitabilityScore)),
        favorableFactors,
        unfavorableFactors,
        bestTimeSlots: dayData.auspiciousSlots.filter((s) => s.type === "Abhijit" || s.type === "AmritKaal"),
      };
    }

    case "vivaha": {
      const shubhaNaks = ["Rohini", "Mrigashira", "Magha", "Uttara Phalguni", "Hasta", "Swati", "Anuradha", "Mula", "Uttara Ashadha", "Uttara Bhadrapada", "Revati"];
      if (shubhaNaks.includes(nak)) {
        favorableFactors.push(`Classical Vivaha Nakshatra (${nak})`);
        suitabilityScore += 15;
      } else {
        unfavorableFactors.push(`Nakshatra (${nak}) requires remedial alignment for marriage`);
        suitabilityScore -= 15;
      }
      if (dayData.isBhadra) {
        unfavorableFactors.push("Bhadra (Vishti Karana) present — marriage prohibited");
        suitabilityScore -= 35;
      }
      return {
        category,
        categoryName: "Vivaha (Marriage Ceremony)",
        sanskritName: "विवाह संस्कार मुहूर्त",
        isRecommended: suitabilityScore >= 70,
        suitabilityScore: Math.min(100, Math.max(10, suitabilityScore)),
        favorableFactors,
        unfavorableFactors,
        bestTimeSlots: dayData.auspiciousSlots.filter((s) => s.type === "Godhuli" || s.type === "Abhijit"),
      };
    }

    case "businessOpening": {
      const shubhaNaks = ["Pushya", "Ashwini", "Chitra", "Shravana", "Dhanishta", "Shatabhisha", "Hasta", "Revati"];
      if (shubhaNaks.includes(nak)) {
        favorableFactors.push(`Commercial prosperity Nakshatra (${nak})`);
        suitabilityScore += 20;
      }
      return {
        category,
        categoryName: "Business / Shop Opening",
        sanskritName: "व्यापार / प्रतिष्ठान आरम्भ",
        isRecommended: suitabilityScore >= 65,
        suitabilityScore: Math.min(100, Math.max(10, suitabilityScore)),
        favorableFactors,
        unfavorableFactors,
        bestTimeSlots: dayData.auspiciousSlots.filter((s) => s.type === "Abhijit" || s.type === "Vijaya"),
      };
    }

    case "vehiclePurchase": {
      const shubhaNaks = ["Ashwini", "Rohini", "Punarvasu", "Pushya", "Hasta", "Swati", "Shravana", "Dhanishta", "Shatabhisha", "Revati"];
      if (shubhaNaks.includes(nak)) {
        favorableFactors.push(`Auspicious dynamic vehicle Nakshatra (${nak})`);
        suitabilityScore += 20;
      }
      return {
        category,
        categoryName: "Vehicle Purchase",
        sanskritName: "वाहन क्रय मुहूर्त",
        isRecommended: suitabilityScore >= 65,
        suitabilityScore: Math.min(100, Math.max(10, suitabilityScore)),
        favorableFactors,
        unfavorableFactors,
        bestTimeSlots: dayData.auspiciousSlots.filter((s) => s.type === "AmritKaal" || s.type === "Abhijit"),
      };
    }

    case "propertyRegistration": {
      const shubhaNaks = ["Mrigashira", "Punarvasu", "Magha", "Vishakha", "Anuradha", "Mula", "Revati", "Uttara Phalguni"];
      if (shubhaNaks.includes(nak)) {
        favorableFactors.push(`Solid earth & property registration Nakshatra (${nak})`);
        suitabilityScore += 20;
      }
      return {
        category,
        categoryName: "Property / Land Registration",
        sanskritName: "भूमि / भवन क्रय-विक्रय",
        isRecommended: suitabilityScore >= 65,
        suitabilityScore: Math.min(100, Math.max(10, suitabilityScore)),
        favorableFactors,
        unfavorableFactors,
        bestTimeSlots: dayData.auspiciousSlots.filter((s) => s.type === "Vijaya" || s.type === "Abhijit"),
      };
    }

    default: {
      return {
        category: "generalAuspicious",
        categoryName: "General Auspicious Undertakings",
        sanskritName: "सर्वकार्य सिद्धि मुहूर्त",
        isRecommended: suitabilityScore >= 60,
        suitabilityScore: Math.min(100, Math.max(10, suitabilityScore)),
        favorableFactors: ["Standard Panchanga Shuddhi evaluated"],
        unfavorableFactors,
        bestTimeSlots: dayData.auspiciousSlots,
      };
    }
  }
}
