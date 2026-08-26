import * as Astronomy from "astronomy-engine";
import type {
  AyanamshaType,
  CelestialBodyPosition,
  EphemerisResult,
  GeoLocation,
  HouseSystem,
  NodeType,
  SpecialPoint,
} from "./types";
import { getAyanamsha, toSiderealLongitude } from "./ayanamsha";
import { getRashi, getNakshatra, getHouse } from "./rashiNakshatra";
import { calculateAscendantAndAngles } from "./ascendant";
import { PLANET_METADATA, TITHI_NAMES, YOGA_NAMES, KARANA_NAMES } from "./constants";
import { calculateUpagrahas } from "./upagrahas";

const ASTRONOMY_BODIES: Record<string, Astronomy.Body> = {
  Sun: Astronomy.Body.Sun,
  Moon: Astronomy.Body.Moon,
  Mercury: Astronomy.Body.Mercury,
  Venus: Astronomy.Body.Venus,
  Mars: Astronomy.Body.Mars,
  Jupiter: Astronomy.Body.Jupiter,
  Saturn: Astronomy.Body.Saturn,
  Uranus: Astronomy.Body.Uranus,
  Neptune: Astronomy.Body.Neptune,
  Pluto: Astronomy.Body.Pluto,
};

function getMeanLunarNodeTropical(daysSinceJ2000: number): number {
  const days = daysSinceJ2000 > 1000000 ? daysSinceJ2000 - 2451545.0 : daysSinceJ2000;
  const T = days / 36525.0;
  let node = 125.044555 - 1934.1361849 * T + 0.0020762 * T * T + (T * T * T) / 467410.0;
  return ((node % 360) + 360) % 360;
}

function getTrueLunarNodeTropical(daysSinceJ2000: number): number {
  const days = daysSinceJ2000 > 1000000 ? daysSinceJ2000 - 2451545.0 : daysSinceJ2000;
  const T = days / 36525.0;
  const meanNode = getMeanLunarNodeTropical(days);
  const M_sun = ((357.52772 + 35999.05034 * T) % 360) * (Math.PI / 180);
  const M_moon = ((134.96298 + 477198.867398 * T) % 360) * (Math.PI / 180);
  const D_elong = ((297.85036 + 445267.111480 * T) % 360) * (Math.PI / 180);
  const F_arg = ((93.27191 + 483202.017538 * T) % 360) * (Math.PI / 180);

  const correction =
    -1.4979 * Math.sin(2 * (D_elong - F_arg)) -
    0.206 * Math.sin(2 * D_elong) -
    0.1699 * Math.sin(M_sun) +
    0.049 * Math.sin(2 * (D_elong - M_moon));

  return ((meanNode + correction % 360) + 360) % 360;
}

export function calculateVedicEphemeris(
  date: Date,
  location: GeoLocation,
  ayanamshaType: AyanamshaType = "Lahiri",
  houseSystem: HouseSystem = "WholeSign",
  nodeType: NodeType = "Mean"
): EphemerisResult {
  const astroTime = Astronomy.MakeTime(date);
  const jd = astroTime.ut;
  const ayanamsha = getAyanamsha(jd, ayanamshaType);

  const observer = new Astronomy.Observer(
    location.latitude,
    location.longitude,
    location.elevation || 0
  );

  const angles = calculateAscendantAndAngles(astroTime, location.latitude, location.longitude, ayanamsha);
  const ascLon = angles.ascendant.siderealLongitude;
  const planets: Record<string, CelestialBodyPosition> = {};
  const nextHourTime = Astronomy.MakeTime(new Date(date.getTime() + 3600 * 1000));

  for (const [name, body] of Object.entries(ASTRONOMY_BODIES)) {
    const geoVec = Astronomy.GeoVector(body, astroTime, true);
    const ecliptic = Astronomy.Ecliptic(geoVec);
    const tropicalLon = ecliptic.elon;
    const siderealLon = toSiderealLongitude(tropicalLon, ayanamsha);

    const nextGeoVec = Astronomy.GeoVector(body, nextHourTime, true);
    const nextEcliptic = Astronomy.Ecliptic(nextGeoVec);
    let speedDegPerDay = ((nextEcliptic.elon - tropicalLon + 540) % 360 - 180) * 24;
    const isRetrograde = speedDegPerDay < 0;

    const eq = Astronomy.Equator(body, astroTime, observer, true, true);
    const hor = Astronomy.Horizon(astroTime, observer, eq.ra, eq.dec, "normal");

    const meta = PLANET_METADATA[name] || {
      sanskritName: name,
      symbol: "✦",
      color: "#FFFFFF",
      isModern: false,
    };

    planets[name] = {
      id: name,
      name,
      sanskritName: meta.sanskritName,
      symbol: meta.symbol,
      color: meta.color,
      tropicalLongitude: tropicalLon,
      siderealLongitude: siderealLon,
      speed: speedDegPerDay,
      isRetrograde,
      latitude: ecliptic.elat,
      distanceAU: Math.sqrt(geoVec.x * geoVec.x + geoVec.y * geoVec.y + geoVec.z * geoVec.z),
      altitude: hor.altitude,
      azimuth: hor.azimuth,
      rashi: getRashi(siderealLon),
      nakshatra: getNakshatra(siderealLon),
      house: getHouse(siderealLon, ascLon, houseSystem),
      isModernPlanet: meta.isModern,
    };
  }

  const rahuTropical = nodeType === "True" ? getTrueLunarNodeTropical(jd) : getMeanLunarNodeTropical(jd);
  const rahuSidereal = toSiderealLongitude(rahuTropical, ayanamsha);
  const ketuSidereal = (rahuSidereal + 180) % 360;

  planets["Rahu"] = {
    id: "Rahu",
    name: "Rahu",
    sanskritName: "Rahu (North Node)",
    symbol: "☊",
    color: "#78909C",
    tropicalLongitude: rahuTropical,
    siderealLongitude: rahuSidereal,
    speed: -0.05295,
    isRetrograde: true,
    latitude: 0,
    distanceAU: 0.00257,
    altitude: 0,
    azimuth: 0,
    rashi: getRashi(rahuSidereal),
    nakshatra: getNakshatra(rahuSidereal),
    house: getHouse(rahuSidereal, ascLon, houseSystem),
  };

  planets["Ketu"] = {
    id: "Ketu",
    name: "Ketu",
    sanskritName: "Ketu (South Node)",
    symbol: "☋",
    color: "#8D6E63",
    tropicalLongitude: (rahuTropical + 180) % 360,
    siderealLongitude: ketuSidereal,
    speed: -0.05295,
    isRetrograde: true,
    latitude: 0,
    distanceAU: 0.00257,
    altitude: 0,
    azimuth: 0,
    rashi: getRashi(ketuSidereal),
    nakshatra: getNakshatra(ketuSidereal),
    house: getHouse(ketuSidereal, ascLon, houseSystem),
  };

  const sunSidereal = planets["Sun"].siderealLongitude;
  const upagrahas = calculateUpagrahas(date, location, jd, sunSidereal, ascLon, ayanamsha);

  const cusps: number[] = [];
  for (let h = 0; h < 12; h++) {
    if (houseSystem === "WholeSign") {
      const ascSignStart = Math.floor(ascLon / 30) * 30;
      cusps.push((ascSignStart + h * 30) % 360);
    } else {
      cusps.push((ascLon + h * 30) % 360);
    }
  }

  const sunLon = planets["Sun"].siderealLongitude;
  const moonLon = planets["Moon"].siderealLongitude;
  const moonSunDiff = ((moonLon - sunLon + 360) % 360);
  const tithiIndex = Math.floor(moonSunDiff / 12);
  const paksha = tithiIndex < 15 ? "Shukla" : "Krishna";
  const tithiProgress = (moonSunDiff % 12) / 12 * 100;
  const tithiName = TITHI_NAMES[tithiIndex % 15] || "Pratipada";

  const dayIndex = date.getUTCDay();
  const VARA_DATA = [
    { name: "Ravivara", sanskritName: "Ravivara", lord: "Sun" },
    { name: "Somavara", sanskritName: "Somavara", lord: "Moon" },
    { name: "Mangalavara", sanskritName: "Mangalavara", lord: "Mars" },
    { name: "Budhavara", sanskritName: "Budhavara", lord: "Mercury" },
    { name: "Guruvara", sanskritName: "Guruvara", lord: "Jupiter" },
    { name: "Shukravara", sanskritName: "Shukravara", lord: "Venus" },
    { name: "Shanivara", sanskritName: "Shanivara", lord: "Saturn" },
  ];
  const vara = VARA_DATA[dayIndex];

  const yogaSum = (sunLon + moonLon) % 360;
  const yogaIndex = Math.floor(yogaSum / (360 / 27));
  const yogaName = YOGA_NAMES[yogaIndex] || YOGA_NAMES[0];

  const karanaRaw = Math.floor(moonSunDiff / 6);
  let karanaName = "";
  if (karanaRaw === 0) karanaName = "Kintughna";
  else if (karanaRaw >= 57) {
    const fixedKaranas = ["Shakuni", "Chatushpada", "Naga", "Kintughna"];
    karanaName = fixedKaranas[karanaRaw - 57] || "Vishti";
  } else {
    karanaName = KARANA_NAMES[(karanaRaw - 1) % 7];
  }

  // 12 Vedic Lunar Months (Masa)
  const VEDIC_MASAS = [
    { name: "Chaitra", sanskritName: "चैत्र मास", solarMasa: "Meena-Mesha Sankranti" },
    { name: "Vaishakha", sanskritName: "वैशाख मास", solarMasa: "Mesha Sankranti" },
    { name: "Jyeshtha", sanskritName: "ज्येष्ठ मास", solarMasa: "Vrishabha Sankranti" },
    { name: "Ashadha", sanskritName: "आषाढ़ मास", solarMasa: "Mithuna Sankranti" },
    { name: "Shravana", sanskritName: "श्रावण मास", solarMasa: "Karka Sankranti" },
    { name: "Bhadrapada", sanskritName: "भाद्रपद मास", solarMasa: "Simha Sankranti" },
    { name: "Ashwina", sanskritName: "आश्विन मास", solarMasa: "Kanya Sankranti" },
    { name: "Kartika", sanskritName: "कार्तिक मास", solarMasa: "Tula Sankranti" },
    { name: "Margashirsha", sanskritName: "मार्गशीर्ष मास", solarMasa: "Vrishchika Sankranti" },
    { name: "Pausha", sanskritName: "पौष मास", solarMasa: "Dhanu Sankranti" },
    { name: "Magha", sanskritName: "माघ मास", solarMasa: "Makara Sankranti" },
    { name: "Phalguna", sanskritName: "फाल्गुन मास", solarMasa: "Kumbha Sankranti" },
  ];

  // Classical Amanta Lunar Month: Determined by the Sun's sidereal sign at the preceding Amavasya (New Moon)
  const sunAtAmavasya = (sunLon - (moonSunDiff / 12.368) + 360) % 360;
  const amavasyaSunSign = Math.floor(sunAtAmavasya / 30);
  const masaIndex = (amavasyaSunSign + 1) % 12;
  const masa = VEDIC_MASAS[masaIndex];
  const gregorianMonth = date.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

  return {
    utcDate: date.toISOString(),
    localDate: new Date(date.getTime() + location.timezoneOffsetHours * 3600 * 1000).toISOString(),
    julianDay: jd,
    ayanamshaValue: ayanamsha,
    ayanamshaType,
    location,
    ascendant: angles.ascendant,
    midheaven: angles.midheaven,
    descendant: angles.descendant,
    imumCoeli: angles.imumCoeli,
    planets,
    upagrahas,
    houses: {
      system: houseSystem,
      cusps,
    },
    panchanga: {
      tithi: { name: tithiName, paksha, index: tithiIndex + 1, progressPercent: tithiProgress },
      masa,
      gregorianMonth,
      vara,
      nakshatra: planets["Moon"].nakshatra,
      yoga: { name: yogaName, index: yogaIndex + 1 },
      karana: { name: karanaName, index: karanaRaw + 1 },
    },
  };
}
