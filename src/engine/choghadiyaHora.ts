/**
 * Real-Time Vedic Choghadiya & 24 Planetary Horas Engine
 * Computes Day/Night 8-fold Choghadiya intervals, auspiciousness ratings,
 * live active period indicator with countdown, and 24 planetary horas.
 */

import * as Astronomy from "astronomy-engine";
import { GeoLocation } from "./types";

export type ChoghadiyaType =
  | "Amrit"
  | "Shubh"
  | "Labh"
  | "Char"
  | "Rog"
  | "Kaal"
  | "Udveg";

export interface ChoghadiyaSlot {
  index: number;
  name: ChoghadiyaType;
  hindiName: string;
  rulingPlanet: string;
  nature: "Best" | "Auspicious" | "Neutral" | "Inauspicious";
  badgeColor: string;
  startTime: Date;
  endTime: Date;
  startFormatted: string;
  endFormatted: string;
  isNight: boolean;
  isActiveNow: boolean;
  prescribedActivities: string;
}

export interface PlanetaryHoraSlot {
  index: number; // 1 to 24
  hourOfSolarDay: number;
  lord: string;
  hindiLord: string;
  symbol: string;
  startTime: Date;
  endTime: Date;
  startFormatted: string;
  endFormatted: string;
  nature: "Auspicious" | "Neutral" | "Challenging";
  favorableFor: string;
  isActiveNow: boolean;
}

export interface ChoghadiyaHoraResult {
  evaluationDate: Date;
  cityName: string;
  dayOfWeek: number; // 0 = Sunday
  dayOfWeekName: string;
  sunrise: Date;
  sunset: Date;
  nextSunrise: Date;
  sunriseFormatted: string;
  sunsetFormatted: string;
  dayChoghadiyas: ChoghadiyaSlot[];
  nightChoghadiyas: ChoghadiyaSlot[];
  activeChoghadiya: ChoghadiyaSlot;
  planetaryHoras: PlanetaryHoraSlot[];
  activeHora: PlanetaryHoraSlot;
}

const CHOGHADIYA_META: Record<
  ChoghadiyaType,
  {
    hindi: string;
    planet: string;
    nature: "Best" | "Auspicious" | "Neutral" | "Inauspicious";
    badgeColor: string;
    activities: string;
  }
> = {
  Amrit: {
    hindi: "अमृत",
    planet: "Moon (चन्द्र)",
    nature: "Best",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400 font-black",
    activities: "All auspicious undertakings, journey, trade, new projects, spiritual initiation.",
  },
  Shubh: {
    hindi: "शुभ",
    planet: "Jupiter (गुरु)",
    nature: "Auspicious",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400 font-extrabold",
    activities: "Marriage, education, religious ceremonies, rituals, meeting mentors.",
  },
  Labh: {
    hindi: "लाभ",
    planet: "Mercury (बुध)",
    nature: "Auspicious",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold",
    activities: "Commercial ventures, contracts, financial investments, technology, communications.",
  },
  Char: {
    hindi: "चर",
    planet: "Venus (शुक्र)",
    nature: "Neutral",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400 font-semibold",
    activities: "Travel, vehicle purchase, arts, luxury goods, dynamic moving endeavors.",
  },
  Rog: {
    hindi: "रोग",
    planet: "Mars (मंगल)",
    nature: "Inauspicious",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/50",
    activities: "Debates, surgery, physical workouts; strictly avoid signing contracts or starting celebrations.",
  },
  Kaal: {
    hindi: "काल",
    planet: "Saturn (शनि)",
    nature: "Inauspicious",
    badgeColor: "bg-purple-950/40 text-purple-300 border-purple-600/40",
    activities: "Machine maintenance, clearing debts; avoid initiating new auspicious work.",
  },
  Udveg: {
    hindi: "उद्वेग",
    planet: "Sun (सूर्य)",
    nature: "Inauspicious",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    activities: "Government or administrative duties; avoid personal celebration or peace rituals.",
  },
};

// Day sequence order by day of week [Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6]
const DAY_ORDER: ChoghadiyaType[][] = [
  ["Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg"], // Sun
  ["Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit"], // Mon
  ["Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog"], // Tue
  ["Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh"], // Wed
  ["Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh"], // Thu
  ["Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char"], // Fri
  ["Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal"], // Sat
];

// Night sequence order by day of week
const NIGHT_ORDER: ChoghadiyaType[][] = [
  ["Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh"], // Sun
  ["Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char"], // Mon
  ["Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal"], // Tue
  ["Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg"], // Wed
  ["Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit"], // Thu
  ["Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog"], // Fri
  ["Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh"], // Sat
];

// Chaldean Hora descending order
const CHALDEAN_HORA_PLANETS = [
  { id: "Saturn", name: "Saturn", hindi: "शनि", symbol: "♄", nature: "Challenging" as const, favorable: "Property, labor, machinery, discipline, endurance" },
  { id: "Jupiter", name: "Jupiter", hindi: "गुरु", symbol: "♃", nature: "Auspicious" as const, favorable: "Spiritual practice, education, wealth, wisdom, high counsel" },
  { id: "Mars", name: "Mars", hindi: "मंगल", symbol: "♂", nature: "Challenging" as const, favorable: "Courage, physical sports, litigation, competitive efforts" },
  { id: "Sun", name: "Sun", hindi: "सूर्य", symbol: "☉", nature: "Auspicious" as const, favorable: "Government, leadership, administrative meetings, health" },
  { id: "Venus", name: "Venus", hindi: "शुक्र", symbol: "♀", nature: "Auspicious" as const, favorable: "Arts, romance, luxury purchases, vehicle acquisition, fashion" },
  { id: "Mercury", name: "Mercury", hindi: "बुध", symbol: "☿", nature: "Auspicious" as const, favorable: "Trade, accounts, business contracts, writing, learning" },
  { id: "Moon", name: "Moon", hindi: "चन्द्र", symbol: "☽", nature: "Neutral" as const, favorable: "Public interaction, travel, creative ideas, domestic peace" },
];

const DAY_LORD_HORA_INDEX = [3, 6, 2, 5, 1, 4, 0]; // Sun=Sun(3), Mon=Moon(6), Tue=Mars(2), Wed=Merc(5), Thu=Jup(1), Fri=Ven(4), Sat=Sat(0)

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatTime(d: Date, tzOffset: number): string {
  const localMs = d.getTime() + tzOffset * 3600 * 1000;
  const localD = new Date(localMs);
  const h = localD.getUTCHours();
  const m = localD.getUTCMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${ampm}`;
}

/**
 * Calculates complete Choghadiya & 24 Planetary Horas for any location and date
 */
export function calculateChoghadiyaAndHoras(
  evaluationDate: Date,
  location: GeoLocation
): ChoghadiyaHoraResult {
  const tzOffset = location.timezoneOffsetHours || 5.5;
  const observer = new Astronomy.Observer(location.latitude, location.longitude, location.elevation || 0);

  // Compute local sunrise & sunset
  const astroTime = Astronomy.MakeTime(evaluationDate);
  const sunriseResult = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, astroTime, 1);
  const sunsetResult = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, astroTime, 1);

  let sunrise = sunriseResult ? sunriseResult.date : new Date(evaluationDate.getFullYear(), evaluationDate.getMonth(), evaluationDate.getDate(), 6, 0);
  let sunset = sunsetResult ? sunsetResult.date : new Date(evaluationDate.getFullYear(), evaluationDate.getMonth(), evaluationDate.getDate(), 18, 15);

  // Approximate next sunrise (sunset + ~12 hours)
  const nextSunriseTime = Astronomy.MakeTime(new Date(sunset.getTime() + 6 * 3600 * 1000));
  const nextSunriseResult = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, nextSunriseTime, 1);
  const nextSunrise = nextSunriseResult ? nextSunriseResult.date : new Date(sunset.getTime() + 11.8 * 3600 * 1000);

  // Day of week based on local sunrise
  const localSunriseD = new Date(sunrise.getTime() + tzOffset * 3600 * 1000);
  const dayOfWeek = localSunriseD.getUTCDay();

  const dayDurationMs = sunset.getTime() - sunrise.getTime();
  const nightDurationMs = nextSunrise.getTime() - sunset.getTime();

  const daySlotMs = dayDurationMs / 8;
  const nightSlotMs = nightDurationMs / 8;

  const nowMs = evaluationDate.getTime();

  // 1. Day Choghadiyas (8 slots)
  const dayChoghadiyas: ChoghadiyaSlot[] = [];
  const dayOrder = DAY_ORDER[dayOfWeek];

  for (let i = 0; i < 8; i++) {
    const slotStartMs = sunrise.getTime() + i * daySlotMs;
    const slotEndMs = slotStartMs + daySlotMs;
    const cName = dayOrder[i];
    const meta = CHOGHADIYA_META[cName];
    const isActive = nowMs >= slotStartMs && nowMs < slotEndMs;

    dayChoghadiyas.push({
      index: i + 1,
      name: cName,
      hindiName: meta.hindi,
      rulingPlanet: meta.planet,
      nature: meta.nature,
      badgeColor: meta.badgeColor,
      startTime: new Date(slotStartMs),
      endTime: new Date(slotEndMs),
      startFormatted: formatTime(new Date(slotStartMs), tzOffset),
      endFormatted: formatTime(new Date(slotEndMs), tzOffset),
      isNight: false,
      isActiveNow: isActive,
      prescribedActivities: meta.activities,
    });
  }

  // 2. Night Choghadiyas (8 slots)
  const nightChoghadiyas: ChoghadiyaSlot[] = [];
  const nightOrder = NIGHT_ORDER[dayOfWeek];

  for (let i = 0; i < 8; i++) {
    const slotStartMs = sunset.getTime() + i * nightSlotMs;
    const slotEndMs = slotStartMs + nightSlotMs;
    const cName = nightOrder[i];
    const meta = CHOGHADIYA_META[cName];
    const isActive = nowMs >= slotStartMs && nowMs < slotEndMs;

    nightChoghadiyas.push({
      index: i + 9,
      name: cName,
      hindiName: meta.hindi,
      rulingPlanet: meta.planet,
      nature: meta.nature,
      badgeColor: meta.badgeColor,
      startTime: new Date(slotStartMs),
      endTime: new Date(slotEndMs),
      startFormatted: formatTime(new Date(slotStartMs), tzOffset),
      endFormatted: formatTime(new Date(slotEndMs), tzOffset),
      isNight: true,
      isActiveNow: isActive,
      prescribedActivities: meta.activities,
    });
  }

  // Active Choghadiya fallback
  let activeChoghadiya = [...dayChoghadiyas, ...nightChoghadiyas].find((c) => c.isActiveNow);
  if (!activeChoghadiya) {
    activeChoghadiya = dayChoghadiyas[0];
  }

  // 3. 24 Planetary Horas (12 Day Horas + 12 Night Horas)
  const planetaryHoras: PlanetaryHoraSlot[] = [];
  const dayHoraMs = dayDurationMs / 12;
  const nightHoraMs = nightDurationMs / 12;

  let currentChaldeanIdx = DAY_LORD_HORA_INDEX[dayOfWeek];

  // 12 Day Horas
  for (let h = 0; h < 12; h++) {
    const hStartMs = sunrise.getTime() + h * dayHoraMs;
    const hEndMs = hStartMs + dayHoraMs;
    const pLord = CHALDEAN_HORA_PLANETS[currentChaldeanIdx % 7];
    const isActive = nowMs >= hStartMs && nowMs < hEndMs;

    planetaryHoras.push({
      index: h + 1,
      hourOfSolarDay: h + 1,
      lord: pLord.name,
      hindiLord: pLord.hindi,
      symbol: pLord.symbol,
      startTime: new Date(hStartMs),
      endTime: new Date(hEndMs),
      startFormatted: formatTime(new Date(hStartMs), tzOffset),
      endFormatted: formatTime(new Date(hEndMs), tzOffset),
      nature: pLord.nature,
      favorableFor: pLord.favorable,
      isActiveNow: isActive,
    });

    currentChaldeanIdx++;
  }

  // 12 Night Horas
  for (let h = 0; h < 12; h++) {
    const hStartMs = sunset.getTime() + h * nightHoraMs;
    const hEndMs = hStartMs + nightHoraMs;
    const pLord = CHALDEAN_HORA_PLANETS[currentChaldeanIdx % 7];
    const isActive = nowMs >= hStartMs && nowMs < hEndMs;

    planetaryHoras.push({
      index: h + 13,
      hourOfSolarDay: h + 13,
      lord: pLord.name,
      hindiLord: pLord.hindi,
      symbol: pLord.symbol,
      startTime: new Date(hStartMs),
      endTime: new Date(hEndMs),
      startFormatted: formatTime(new Date(hStartMs), tzOffset),
      endFormatted: formatTime(new Date(hEndMs), tzOffset),
      nature: pLord.nature,
      favorableFor: pLord.favorable,
      isActiveNow: isActive,
    });

    currentChaldeanIdx++;
  }

  let activeHora = planetaryHoras.find((h) => h.isActiveNow);
  if (!activeHora) {
    activeHora = planetaryHoras[0];
  }

  return {
    evaluationDate,
    cityName: location.cityName,
    dayOfWeek,
    dayOfWeekName: DAY_NAMES[dayOfWeek],
    sunrise,
    sunset,
    nextSunrise,
    sunriseFormatted: formatTime(sunrise, tzOffset),
    sunsetFormatted: formatTime(sunset, tzOffset),
    dayChoghadiyas,
    nightChoghadiyas,
    activeChoghadiya,
    planetaryHoras,
    activeHora,
  };
}