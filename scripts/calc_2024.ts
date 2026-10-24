import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { calculateVimshottariDasha } from "../src/engine/dasha";
import { calculateJaiminiCharaDasha } from "../src/engine/jaimini";

const birthUtc = new Date(Date.UTC(1999, 8, 17, 12, 59, 45));
const location = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };
const ephem = calculateVedicEphemeris(birthUtc, location, "Lahiri", "WholeSign", "Mean");

const jul22_2024 = new Date("2024-07-22T10:00:00Z");
const vimJul = calculateVimshottariDasha(birthUtc, ephem.planets.Moon.siderealLongitude, jul22_2024);
console.log("Vimshottari (July 22, 2024):", vimJul.activeDasha?.mahadasha.name, "/", vimJul.activeDasha?.antardasha.name, "/", vimJul.activeDasha?.pratyantardasha?.name);

const sep17_2024 = new Date("2024-09-17T10:00:00Z");
const vimSep = calculateVimshottariDasha(birthUtc, ephem.planets.Moon.siderealLongitude, sep17_2024);
console.log("Vimshottari (Sept 17, 2024):", vimSep.activeDasha?.mahadasha.name, "/", vimSep.activeDasha?.antardasha.name, "/", vimSep.activeDasha?.pratyantardasha?.name);

const charaJul = calculateJaiminiCharaDasha(birthUtc, ephem.ascendant.siderealLongitude, jul22_2024);
console.log("Chara Dasha (July 22, 2024):", charaJul.activeDasha?.mahadasha.rashi.englishName, "/", charaJul.activeDasha?.antardasha.rashi.englishName);
