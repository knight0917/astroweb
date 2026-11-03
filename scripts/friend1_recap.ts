import { calculateVedicEphemeris } from "../src/engine/ephemeris";

const birthUtc = new Date(Date.UTC(1999, 8, 17, 12, 59, 45));
const loc = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };
const ephem = calculateVedicEphemeris(birthUtc, loc, "Lahiri", "WholeSign", "Mean");

console.log("=== KEY PLANETARY SIGNIFICATIONS FOR FRIEND 1 ===");
console.log("Lagna Lord (Jupiter): H2 Aries, retrograde. Rules H1 (Self) & H10 (Career).");
console.log("Moon (AK): H9 Scorpio 27° (Neecha, Gandanta). Rules H5 (Purva Punya, Intellect).");
console.log("Venus (AmK): H5 Cancer 25° (with Rahu 16°). Rules H3 (Effort, Skills) & H8 (Transformation, Foreign).");
console.log("Mercury: H7 Virgo 7° (Exalted). Rules H4 (Home, Education) & H7 (Partnership, Commerce).");
console.log("Saturn: H2 Aries 23° (Neecha, retrograde). Rules H11 (Gains) & H12 (Foreign lands).");
console.log("Mars: H9 Scorpio 15° (Own sign). Rules H2 (Wealth) & H9 (Higher wisdom, Destiny).");
console.log("Sun: H7 Virgo 0° (with Mercury). Rules H6 (Competition, Service).");
console.log("Rahu: H5 Cancer 16° (Desire, Ambition in Education/Speculation).");
console.log("Ketu: H11 Capricorn 16° (Detachment in social networks).");
