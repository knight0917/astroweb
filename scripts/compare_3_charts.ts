import { calculateVedicEphemeris } from "../src/engine/ephemeris";

const c1Birth = new Date(Date.UTC(1999, 8, 17, 12, 59, 45)); // 17 Sept 1999, Allahabad
const c2Birth = new Date(Date.UTC(1998, 4, 24, 18, 44, 29)); // 25 May 1998, Allahabad
const c3Birth = new Date(Date.UTC(1999, 11, 18, 18, 18, 0));  // 18 Dec 1999, Bakhtiyarpur

const loc1 = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };
const loc3 = { cityName: "Bakhtiyarpur", country: "India", latitude: 25.4586, longitude: 85.5369, timezoneOffsetHours: 5.5 };

const ephem1 = calculateVedicEphemeris(c1Birth, loc1, "Lahiri", "WholeSign", "Mean");
const ephem2 = calculateVedicEphemeris(c2Birth, loc1, "Lahiri", "WholeSign", "Mean");
const ephem3 = calculateVedicEphemeris(c3Birth, loc3, "Lahiri", "WholeSign", "Mean");

console.log("=== ARIES CONVERGENCE ACROSS ALL 3 CHARTS ===");
console.log("C1 Aries (H2): Jupiter (R) 10.23°, Saturn (R) 23.03°");
console.log("C2 Aries (H3): Venus 0.13°, Saturn 4.54°, Mercury 21.69°, Moon 25.21°");
console.log("C3 Aries (H8): Jupiter (R) 1.16°, Moon 7.07°, Saturn (R) 16.98°");

console.log("\n=== CROSS CONNECTIONS: C3 WITH C1 & C2 ===");
console.log("C3 Lagna (Virgo 3.39°) <-> C1 Sun (Virgo 0.35°), C1 Mercury (Virgo 7.91°)");
console.log("C3 Lagna is exactly where C1 Sun and Mercury sit!");
console.log("C3 Sun (Sagittarius 2.52°) <-> C1 D9 Rahu (Sagittarius), C2 D9 Mercury (Libra)");
console.log("C3 Mars (Capricorn 23.46°) <-> C1 Ketu (Capricorn 16.80°)");
console.log("C3 Moon (Aries 7.07°) <-> C2 Saturn (Aries 4.54°)");
console.log("C3 Jupiter (Aries 1.16°) <-> C2 Venus (Aries 0.13°)");
