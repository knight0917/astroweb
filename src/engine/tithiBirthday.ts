/**
 * Vedic Tithi Birthday & Tithi Pravesha (तिथि जन्मदिन / तिथि प्रवेश) Engine
 * High-performance, precise lunar month & tithi recurrence calculator.
 */

import { calculateVedicEphemeris } from "./ephemeris";
import { GeoLocation, AyanamshaType } from "./types";
import { TITHI_NAMES } from "./constants";

export interface NextTithiOccurrence {
  year: number;
  gregorianDate: Date;
  tithiStart: Date;
  tithiEnd: Date;
  exactMoment: Date;
  formattedDate: string;
  dayOfWeek: string;
  daysRemaining: number;
  hoursRemaining: number;
  masaName: string;
  paksha: "Shukla" | "Krishna";
  tithiName: string;
}

export interface TithiBirthdayResult {
  birthDetails: {
    birthDate: Date;
    formattedBirthDate: string;
    masaName: string;
    masaHindi: string;
    paksha: "Shukla" | "Krishna";
    tithiName: string;
    tithiHindi: string;
    tithiIndex: number;
    tithiLord: string;
    tithiDeity: string;
    moonSunAngleAtBirth: number;
  };
  nextBirthday: NextTithiOccurrence;
  upcomingBirthdays: NextTithiOccurrence[];
  vedicRituals: {
    deityWorship: string;
    recommendedMantra: string;
    charityDana: string;
    lifestyleRules: string[];
  };
}

const TITHI_DEITIES: Record<number, { deity: string; lord: string; hindiName: string }> = {
  0: { deity: "Agni Deva", lord: "Sun", hindiName: "प्रतिपदा (Pratipada)" },
  1: { deity: "Brahma Deva", lord: "Moon", hindiName: "द्वितीया (Dwitiya)" },
  2: { deity: "Gauri / Shiva", lord: "Mars", hindiName: "तृतीया (Tritiya)" },
  3: { deity: "Lord Ganesha", lord: "Mercury", hindiName: "चतुर्थी (Chaturthi)" },
  4: { deity: "Naga Devas", lord: "Jupiter", hindiName: "पंचमी (Panchami)" },
  5: { deity: "Kartikeya / Skanda", lord: "Venus", hindiName: "षष्ठी (Shashthi)" },
  6: { deity: "Surya Deva", lord: "Saturn", hindiName: "सप्तमी (Saptami)" },
  7: { deity: "Goddess Durga / Rudra", lord: "Rahu", hindiName: "अष्टमी (Ashtami)" },
  8: { deity: "Goddess Durga", lord: "Sun", hindiName: "नवमी (Navami)" },
  9: { deity: "Yamaraja / Dharmaraja", lord: "Moon", hindiName: "दशमी (Dashami)" },
  10: { deity: "Lord Vishnu / Hari", lord: "Mars", hindiName: "एकादशी (Ekadashi)" },
  11: { deity: "Lord Vishnu", lord: "Mercury", hindiName: "द्वादशी (Dwadashi)" },
  12: { deity: "Kamadeva / Shiva", lord: "Jupiter", hindiName: "त्रयोदशी (Trayodashi)" },
  13: { deity: "Lord Shiva (Rudra)", lord: "Venus", hindiName: "चतुर्दशी (Chaturdashi)" },
  14: { deity: "Chandra Deva / Satyanarayan", lord: "Saturn", hindiName: "पूर्णिमा (Purnima)" },
  15: { deity: "Agni Deva", lord: "Sun", hindiName: "प्रतिपदा (Pratipada)" },
  16: { deity: "Brahma Deva", lord: "Moon", hindiName: "द्वितीया (Dwitiya)" },
  17: { deity: "Gauri / Shiva", lord: "Mars", hindiName: "तृतीया (Tritiya)" },
  18: { deity: "Lord Ganesha", lord: "Mercury", hindiName: "चतुर्थी (Chaturthi)" },
  19: { deity: "Naga Devas", lord: "Jupiter", hindiName: "पंचमी (Panchami)" },
  20: { deity: "Kartikeya", lord: "Venus", hindiName: "षष्ठी (Shashthi)" },
  21: { deity: "Surya Deva", lord: "Saturn", hindiName: "सप्तमी (Saptami)" },
  22: { deity: "Goddess Durga / Kala Bhairava", lord: "Rahu", hindiName: "अष्टमी (Ashtami)" },
  23: { deity: "Goddess Durga", lord: "Sun", hindiName: "नवमी (Navami)" },
  24: { deity: "Yamaraja", lord: "Moon", hindiName: "दशमी (Dashami)" },
  25: { deity: "Lord Vishnu", lord: "Mars", hindiName: "एकादशी (Ekadashi)" },
  26: { deity: "Lord Vishnu", lord: "Mercury", hindiName: "द्वादशी (Dwadashi)" },
  27: { deity: "Lord Shiva", lord: "Jupiter", hindiName: "त्रयोदशी (Trayodashi)" },
  28: { deity: "Lord Shiva (Mahashivaratri Tithi)", lord: "Venus", hindiName: "चतुर्दशी (Chaturdashi)" },
  29: { deity: "Pitris (Ancestors)", lord: "Rahu / Saturn", hindiName: "अमावस्या (Amavasya)" },
};

const DEFAULT_LOCATION: GeoLocation = {
  cityName: "Allahabad (Prayagraj)",
  country: "India",
  latitude: 25.4358,
  longitude: 81.8463,
  elevation: 98,
  timezoneOffsetHours: 5.5,
};

export function getTithiForDate(
  date: Date,
  location: GeoLocation = DEFAULT_LOCATION,
  ayanamsha: AyanamshaType = "Lahiri"
) {
  const ephem = calculateVedicEphemeris(date, location, ayanamsha, "WholeSign", "Mean");
  const sunLon = ephem.planets["Sun"].siderealLongitude;
  const moonLon = ephem.planets["Moon"].siderealLongitude;
  const moonSunDiff = (moonLon - sunLon + 360) % 360;
  const tithiIndex = Math.floor(moonSunDiff / 12);
  const sunSign = Math.floor(sunLon / 30);

  return {
    moonSunDiff,
    tithiIndex,
    sunSign,
    masa: ephem.panchanga.masa,
    paksha: ephem.panchanga.tithi.paksha,
    tithiName: ephem.panchanga.tithi.name,
    ephem,
  };
}

function findExactAngleTimestamp(
  startDate: Date,
  endDate: Date,
  targetAngle: number,
  location: GeoLocation,
  ayanamsha: AyanamshaType
): Date {
  let low = startDate.getTime();
  let high = endDate.getTime();

  for (let iter = 0; iter < 12; iter++) {
    const mid = (low + high) / 2;
    const info = getTithiForDate(new Date(mid), location, ayanamsha);
    let diff = (info.moonSunDiff - targetAngle + 360) % 360;
    if (diff > 180) diff -= 360;

    if (Math.abs(diff) < 0.01) {
      return new Date(mid);
    }
    if (diff < 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return new Date((low + high) / 2);
}

export function calculateTithiBirthday(
  birthDate: Date,
  location: GeoLocation = DEFAULT_LOCATION,
  ayanamsha: AyanamshaType = "Lahiri",
  refDate: Date = new Date()
): TithiBirthdayResult {
  const birthInfo = getTithiForDate(birthDate, location, ayanamsha);
  const birthTithiIdx = birthInfo.tithiIndex;
  const birthSunSign = birthInfo.sunSign;
  const birthAngle = birthInfo.moonSunDiff;

  const tithiMeta = TITHI_DEITIES[birthTithiIdx] || TITHI_DEITIES[0];

  const upcoming: NextTithiOccurrence[] = [];
  const refYear = refDate.getFullYear();

  // Scan targeted windows across the next 6 years
  for (let targetYear = refYear; targetYear <= refYear + 6 && upcoming.length < 5; targetYear++) {
    // Sun enters birth sign approx around the same month each year
    // Approximate date when Sun enters birthSunSign
    const approxMonth = (birthSunSign + 3) % 12; // Mesha(0) ~ April(3), Vrishabha(1) ~ May(4)...
    const windowStart = new Date(Date.UTC(targetYear, approxMonth, 10, 0, 0, 0));

    // Scan 35 days around the solar ingress window
    for (let dayOffset = -5; dayOffset <= 35; dayOffset++) {
      const scanDate = new Date(windowStart.getTime() + dayOffset * 24 * 3600 * 1000);
      const dayInfo = getTithiForDate(scanDate, location, ayanamsha);

      if (dayInfo.sunSign === birthSunSign && dayInfo.tithiIndex === birthTithiIdx) {
        const ONE_DAY_MS = 24 * 3600 * 1000;
        const scanStart = new Date(scanDate.getTime() - ONE_DAY_MS);
        const scanEnd = new Date(scanDate.getTime() + ONE_DAY_MS);

        const targetStartAngle = birthTithiIdx * 12;
        const targetEndAngle = ((birthTithiIdx + 1) * 12) % 360;

        const tithiStart = findExactAngleTimestamp(scanStart, scanDate, targetStartAngle, location, ayanamsha);
        const tithiEnd = findExactAngleTimestamp(scanDate, scanEnd, targetEndAngle, location, ayanamsha);
        const exactMoment = findExactAngleTimestamp(tithiStart, tithiEnd, birthAngle, location, ayanamsha);

        if (tithiEnd.getTime() > refDate.getTime()) {
          const msRemaining = Math.max(0, exactMoment.getTime() - refDate.getTime());
          const daysRemaining = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
          const hoursRemaining = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

          const tzDate = new Date(exactMoment.getTime() + location.timezoneOffsetHours * 3600 * 1000);
          const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

          // Avoid duplicate entries for same year
          if (!upcoming.some((u) => u.year === tzDate.getUTCFullYear())) {
            upcoming.push({
              year: tzDate.getUTCFullYear(),
              gregorianDate: exactMoment,
              tithiStart,
              tithiEnd,
              exactMoment,
              formattedDate: tzDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              }),
              dayOfWeek: dayNames[tzDate.getUTCDay()],
              daysRemaining,
              hoursRemaining,
              masaName: dayInfo.masa.name,
              paksha: dayInfo.paksha,
              tithiName: dayInfo.tithiName,
            });
          }
          break; // Found for this year, move to next year
        }
      }
    }
  }

  const nextBirthday = upcoming[0] || {
    year: refDate.getFullYear() + 1,
    gregorianDate: new Date(),
    tithiStart: new Date(),
    tithiEnd: new Date(),
    exactMoment: new Date(),
    formattedDate: "Upcoming...",
    dayOfWeek: "Sunday",
    daysRemaining: 0,
    hoursRemaining: 0,
    masaName: birthInfo.masa.name,
    paksha: birthInfo.paksha,
    tithiName: birthInfo.tithiName,
  };

  return {
    birthDetails: {
      birthDate,
      formattedBirthDate: new Date(birthDate.getTime() + location.timezoneOffsetHours * 3600 * 1000).toLocaleDateString(
        "en-US",
        { weekday: "short", year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }
      ),
      masaName: birthInfo.masa.name,
      masaHindi: birthInfo.masa.sanskritName,
      paksha: birthInfo.paksha,
      tithiName: birthInfo.tithiName,
      tithiHindi: tithiMeta.hindiName,
      tithiIndex: birthTithiIdx + 1,
      tithiLord: tithiMeta.lord,
      tithiDeity: tithiMeta.deity,
      moonSunAngleAtBirth: parseFloat(birthAngle.toFixed(2)),
    },
    nextBirthday,
    upcomingBirthdays: upcoming,
    vedicRituals: {
      deityWorship: `Worship of ${tithiMeta.deity} (Presiding Deity of ${birthInfo.tithiName}) and your Ishta Devata.`,
      recommendedMantra: `Maha Mrityunjaya Mantra & Gayatri Mantra (108 recitations for Ayushya and Tejas).`,
      charityDana: `Annadana (food distribution), Deepa Daan (lighting ${refDate.getFullYear() - birthDate.getFullYear() + 1} ghee lamps), and Go Seva (cow service).`,
      lifestyleRules: [
        "Take an auspicious herbal oil bath (Abhyanga Snana) before sunrise.",
        "Perform Ayushya Homam or offer prayers to Sage Markandeya for longevity.",
        "Seek blessings from parents, elders, and Guru.",
        "Wear clean/new traditional clothes and avoid harsh words, conflicts, or tamasic food.",
      ],
    },
  };
}