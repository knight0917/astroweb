import * as Astronomy from "astronomy-engine";
import type { GeoLocation, SpecialPoint } from "./types";
import { getRashi, getNakshatra, getHouse } from "./rashiNakshatra";
import { calculateTropicalAngles } from "./ascendant";
import { toSiderealLongitude } from "./ayanamsha";

export function calculateUpagrahas(
  date: Date,
  location: GeoLocation,
  julianDay: number,
  sunSiderealLon: number,
  ascendantSiderealLon: number,
  ayanamsha: number
): Record<string, SpecialPoint> {
  const upagrahas: Record<string, SpecialPoint> = {};

  const dhumaLon = (sunSiderealLon + 133 + 20 / 60) % 360;
  const vyatipataLon = (360 - dhumaLon + 360) % 360;
  const pariveshaLon = (vyatipataLon + 180) % 360;
  const indrachapaLon = (360 - pariveshaLon + 360) % 360;
  const upaketuLon = (indrachapaLon + 16 + 40 / 60) % 360;

  const solarDefs = [
    { id: "Dhuma", name: "Dhuma", sanskritName: "Dhuma (धूम)", lon: dhumaLon, desc: "Solar Upagraha of smoke and transformation (Sun + 133°20')" },
    { id: "Vyatipata", name: "Vyatipata", sanskritName: "Vyatipata (व्यतीपात)", lon: vyatipataLon, desc: "Solar Upagraha of fierce energy (360° - Dhuma)" },
    { id: "Parivesha", name: "Parivesha", sanskritName: "Parivesha (परिवेश)", lon: pariveshaLon, desc: "Solar Upagraha of halo / encirclement (Vyatipata + 180°)" },
    { id: "Indrachapa", name: "Indrachapa", sanskritName: "Indrachapa / Kodanda (इन्द्रचाप)", lon: indrachapaLon, desc: "Rainbow / Bow Upagraha of focus (360° - Parivesha)" },
    { id: "Upaketu", name: "Upaketu", sanskritName: "Upaketu / Sikhi (उपकेतु)", lon: upaketuLon, desc: "Sub-cometary node of spiritual dissolution (Indrachapa + 16°40')" },
  ];

  for (const def of solarDefs) {
    upagrahas[def.id] = {
      id: def.id,
      name: def.name,
      sanskritName: def.sanskritName,
      siderealLongitude: def.lon,
      rashi: getRashi(def.lon),
      nakshatra: getNakshatra(def.lon),
      house: getHouse(def.lon, ascendantSiderealLon),
      description: def.desc,
      category: "SolarUpagraha",
    };
  }

  const observer = new Astronomy.Observer(location.latitude, location.longitude, location.elevation || 0);
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  let sunriseTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, startOfDay, 1);
  let sunsetTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, startOfDay, 1);

  let sunriseMs = sunriseTime ? sunriseTime.date.getTime() : startOfDay.getTime() + 6 * 3600 * 1000;
  let sunsetMs = sunsetTime ? sunsetTime.date.getTime() : startOfDay.getTime() + 18 * 3600 * 1000;

  const currentMs = date.getTime();
  const isDaytime = currentMs >= sunriseMs && currentMs < sunsetMs;
  let segmentStartMs = isDaytime ? sunriseMs : sunsetMs;
  let segmentDurationMs = isDaytime ? (sunsetMs - sunriseMs) / 8 : (24 * 3600 * 1000 - (sunsetMs - sunriseMs)) / 8;

  const weekday = date.getUTCDay();
  const PLANET_ORDER = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  function getSegmentIndex(targetPlanet: string, isDay: boolean, dayOfWeek: number): number {
    let order: string[];
    if (isDay) {
      order = Array.from({ length: 7 }, (_, i) => PLANET_ORDER[(dayOfWeek + i) % 7]);
    } else {
      order = Array.from({ length: 7 }, (_, i) => PLANET_ORDER[(dayOfWeek + 4 + i) % 7]);
    }
    const idx = order.indexOf(targetPlanet);
    return idx >= 0 ? idx : 0;
  }

  function getUpagrahaLongitude(targetPlanet: string, isDay: boolean, dayOfWeek: number): number {
    const segIdx = getSegmentIndex(targetPlanet, isDay, dayOfWeek);
    const targetMs = segmentStartMs + segIdx * segmentDurationMs;
    const targetAstroTime = Astronomy.MakeTime(new Date(targetMs));
    const targetAngles = calculateTropicalAngles(targetAstroTime, location.latitude, location.longitude);
    return toSiderealLongitude(targetAngles.ascendant, ayanamsha);
  }

  const gulikaLon = getUpagrahaLongitude("Saturn", isDaytime, weekday);
  const mandiLon = gulikaLon;
  const kalaLon = getUpagrahaLongitude("Sun", isDaytime, weekday);
  const mrityuLon = getUpagrahaLongitude("Mars", isDaytime, weekday);
  const ardhaPraharaLon = getUpagrahaLongitude("Mercury", isDaytime, weekday);
  const yamaghantakaLon = getUpagrahaLongitude("Jupiter", isDaytime, weekday);

  const diurnalDefs = [
    { id: "Gulika", name: "Gulika", sanskritName: "Gulika (गुलिक)", lon: gulikaLon, desc: "Son of Saturn; highly influential Upagraha of destiny and debts" },
    { id: "Mandi", name: "Mandi", sanskritName: "Mandi (मांदि)", lon: mandiLon, desc: "Crucial shadow point associated with Saturn's deepest karmic tests" },
    { id: "Kala", name: "Kala", sanskritName: "Kala (काल)", lon: kalaLon, desc: "Sub-planet ruled by the Sun representing vitality and temporal power" },
    { id: "Mrityu", name: "Mrityu", sanskritName: "Mrityu (मृत्यु)", lon: mrityuLon, desc: "Sub-planet ruled by Mars representing obstacles, courage, and vitality" },
    { id: "ArdhaPrahara", name: "Ardha-Prahara", sanskritName: "Ardha-Prahara (अर्धप्रहर)", lon: ardhaPraharaLon, desc: "Sub-planet ruled by Mercury representing intelligence and intellect" },
    { id: "Yamaghantaka", name: "Yamaghantaka", sanskritName: "Yamaghantaka (यमघण्टक)", lon: yamaghantakaLon, desc: "Sub-planet ruled by Jupiter, conferring auspicious grace and protection" },
  ];

  for (const def of diurnalDefs) {
    upagrahas[def.id] = {
      id: def.id,
      name: def.name,
      sanskritName: def.sanskritName,
      siderealLongitude: def.lon,
      rashi: getRashi(def.lon),
      nakshatra: getNakshatra(def.lon),
      house: getHouse(def.lon, ascendantSiderealLon),
      description: def.desc,
      category: "DiurnalUpagraha",
    };
  }

  return upagrahas;
}
