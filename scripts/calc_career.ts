import { calculateVedicEphemeris } from "../src/engine/ephemeris";
import { analyzeCareerJobBusiness } from "../src/engine/careerJobBusiness";

const birthUtc = new Date(Date.UTC(1999, 8, 17, 12, 59, 45));
const location = { cityName: "Allahabad", country: "India", latitude: 25.4358, longitude: 81.8463, timezoneOffsetHours: 5.5 };
const ephem = calculateVedicEphemeris(birthUtc, location, "Lahiri", "WholeSign", "Mean");

const career = analyzeCareerJobBusiness(ephem);
console.log(JSON.stringify(career, null, 2));
