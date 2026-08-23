import { GeoLocation } from "./types";
import { POPULAR_CITIES } from "./constants";

export interface LocationSuggestion extends GeoLocation {
  state?: string;
  displayName: string;
}

/**
 * Derives exact timezone offset in hours for any IANA timezone identifier (e.g. "Asia/Kolkata" -> 5.5)
 */
export function getTimezoneOffsetFromIana(ianaTimezone?: string, date: Date = new Date()): number {
  if (!ianaTimezone) return 5.5;
  try {
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone: ianaTimezone }));
    const diffHours = (tzDate.getTime() - utcDate.getTime()) / (3600 * 1000);
    return Math.round(diffHours * 4) / 4; // Round to 0.25 hr precision
  } catch {
    if (ianaTimezone.includes("Kolkata") || ianaTimezone.includes("India")) return 5.5;
    if (ianaTimezone.includes("Kathmandu")) return 5.75;
    return 0;
  }
}

/**
 * Extended offline local dataset for instant offline/zero-latency search
 */
export const EXTENDED_LOCAL_PLACES: LocationSuggestion[] = [
  ...POPULAR_CITIES.map((c) => ({
    ...c,
    displayName: `${c.cityName}${c.country ? `, ${c.country}` : ""}`,
  })),
  { cityName: "Mau", country: "India", state: "Uttar Pradesh", latitude: 25.9416, longitude: 83.5611, elevation: 78, timezoneOffsetHours: 5.5, displayName: "Mau, Uttar Pradesh, India" },
  { cityName: "Ballia", country: "India", state: "Uttar Pradesh", latitude: 25.7566, longitude: 84.1488, elevation: 69, timezoneOffsetHours: 5.5, displayName: "Ballia, Uttar Pradesh, India" },
  { cityName: "Gorakhpur", country: "India", state: "Uttar Pradesh", latitude: 26.7606, longitude: 83.3732, elevation: 84, timezoneOffsetHours: 5.5, displayName: "Gorakhpur, Uttar Pradesh, India" },
  { cityName: "Azamgarh", country: "India", state: "Uttar Pradesh", latitude: 26.0683, longitude: 83.1841, elevation: 77, timezoneOffsetHours: 5.5, displayName: "Azamgarh, Uttar Pradesh, India" },
  { cityName: "Ghazipur", country: "India", state: "Uttar Pradesh", latitude: 25.5869, longitude: 83.5786, elevation: 67, timezoneOffsetHours: 5.5, displayName: "Ghazipur, Uttar Pradesh, India" },
  { cityName: "Deoria", country: "India", state: "Uttar Pradesh", latitude: 26.5024, longitude: 83.7791, elevation: 68, timezoneOffsetHours: 5.5, displayName: "Deoria, Uttar Pradesh, India" },
  { cityName: "Jaunpur", country: "India", state: "Uttar Pradesh", latitude: 25.7464, longitude: 82.6837, elevation: 82, timezoneOffsetHours: 5.5, displayName: "Jaunpur, Uttar Pradesh, India" },
  { cityName: "Mirzapur", country: "India", state: "Uttar Pradesh", latitude: 25.1337, longitude: 82.5644, elevation: 80, timezoneOffsetHours: 5.5, displayName: "Mirzapur, Uttar Pradesh, India" },
  { cityName: "Gaya", country: "India", state: "Bihar", latitude: 24.7914, longitude: 85.0002, elevation: 111, timezoneOffsetHours: 5.5, displayName: "Gaya (Bodh Gaya), Bihar, India" },
  { cityName: "Buxar", country: "India", state: "Bihar", latitude: 25.5647, longitude: 83.9777, elevation: 65, timezoneOffsetHours: 5.5, displayName: "Buxar, Bihar, India" },
  { cityName: "Muzaffarpur", country: "India", state: "Bihar", latitude: 26.1209, longitude: 85.3647, elevation: 60, timezoneOffsetHours: 5.5, displayName: "Muzaffarpur, Bihar, India" },
  { cityName: "Darbhanga", country: "India", state: "Bihar", latitude: 26.1542, longitude: 85.8918, elevation: 52, timezoneOffsetHours: 5.5, displayName: "Darbhanga, Bihar, India" },
  { cityName: "Kanpur", country: "India", state: "Uttar Pradesh", latitude: 26.4499, longitude: 80.3319, elevation: 126, timezoneOffsetHours: 5.5, displayName: "Kanpur, Uttar Pradesh, India" },
  { cityName: "Agra", country: "India", state: "Uttar Pradesh", latitude: 27.1767, longitude: 78.0081, elevation: 171, timezoneOffsetHours: 5.5, displayName: "Agra, Uttar Pradesh, India" },
  { cityName: "Vrindavan", country: "India", state: "Uttar Pradesh", latitude: 27.5806, longitude: 77.7006, elevation: 170, timezoneOffsetHours: 5.5, displayName: "Vrindavan, Uttar Pradesh, India" },
  { cityName: "Indore", country: "India", state: "Madhya Pradesh", latitude: 22.7196, longitude: 75.8577, elevation: 553, timezoneOffsetHours: 5.5, displayName: "Indore, Madhya Pradesh, India" },
  { cityName: "Bhopal", country: "India", state: "Madhya Pradesh", latitude: 23.2599, longitude: 77.4126, elevation: 527, timezoneOffsetHours: 5.5, displayName: "Bhopal, Madhya Pradesh, India" },
  { cityName: "Nagpur", country: "India", state: "Maharashtra", latitude: 21.1458, longitude: 79.0882, elevation: 310, timezoneOffsetHours: 5.5, displayName: "Nagpur, Maharashtra, India" },
  { cityName: "Surat", country: "India", state: "Gujarat", latitude: 21.1702, longitude: 72.8311, elevation: 13, timezoneOffsetHours: 5.5, displayName: "Surat, Gujarat, India" },
  { cityName: "Vadodara", country: "India", state: "Gujarat", latitude: 22.3072, longitude: 73.1812, elevation: 39, timezoneOffsetHours: 5.5, displayName: "Vadodara, Gujarat, India" },
  { cityName: "Chandigarh", country: "India", state: "Chandigarh", latitude: 30.7333, longitude: 76.7794, elevation: 321, timezoneOffsetHours: 5.5, displayName: "Chandigarh, India" },
  { cityName: "Shimla", country: "India", state: "Himachal Pradesh", latitude: 31.1048, longitude: 77.1734, elevation: 2276, timezoneOffsetHours: 5.5, displayName: "Shimla, Himachal Pradesh, India" },
  { cityName: "Ranchi", country: "India", state: "Jharkhand", latitude: 23.3441, longitude: 85.3096, elevation: 651, timezoneOffsetHours: 5.5, displayName: "Ranchi, Jharkhand, India" },
  { cityName: "Bhubaneswar", country: "India", state: "Odisha", latitude: 20.2961, longitude: 85.8245, elevation: 45, timezoneOffsetHours: 5.5, displayName: "Bhubaneswar, Odisha, India" },
  { cityName: "Visakhapatnam", country: "India", state: "Andhra Pradesh", latitude: 17.6868, longitude: 83.2185, elevation: 45, timezoneOffsetHours: 5.5, displayName: "Visakhapatnam, Andhra Pradesh, India" },
  { cityName: "Madurai", country: "India", state: "Tamil Nadu", latitude: 9.9252, longitude: 78.1198, elevation: 101, timezoneOffsetHours: 5.5, displayName: "Madurai, Tamil Nadu, India" },
  { cityName: "Kanchipuram", country: "India", state: "Tamil Nadu", latitude: 12.8342, longitude: 79.7036, elevation: 83, timezoneOffsetHours: 5.5, displayName: "Kanchipuram, Tamil Nadu, India" },
  { cityName: "Thiruvananthapuram", country: "India", state: "Kerala", latitude: 8.5241, longitude: 76.9366, elevation: 10, timezoneOffsetHours: 5.5, displayName: "Thiruvananthapuram, Kerala, India" },
  { cityName: "Mysore", country: "India", state: "Karnataka", latitude: 12.2958, longitude: 76.6394, elevation: 763, timezoneOffsetHours: 5.5, displayName: "Mysore, Karnataka, India" },
  { cityName: "Udupi", country: "India", state: "Karnataka", latitude: 13.3409, longitude: 74.7421, elevation: 39, timezoneOffsetHours: 5.5, displayName: "Udupi, Karnataka, India" },
  { cityName: "Guwahati", country: "India", state: "Assam", latitude: 26.1445, longitude: 91.7362, elevation: 55, timezoneOffsetHours: 5.5, displayName: "Guwahati (Kamakhya), Assam, India" },
  { cityName: "Srinagar", country: "India", state: "Jammu & Kashmir", latitude: 34.0837, longitude: 74.7973, elevation: 1585, timezoneOffsetHours: 5.5, displayName: "Srinagar, Jammu & Kashmir, India" },
  { cityName: "Toronto", country: "Canada", latitude: 43.6532, longitude: -79.3832, elevation: 76, timezoneOffsetHours: -5.0, displayName: "Toronto, Canada" },
  { cityName: "Vancouver", country: "Canada", latitude: 49.2827, longitude: -123.1207, elevation: 15, timezoneOffsetHours: -8.0, displayName: "Vancouver, Canada" },
  { cityName: "Berlin", country: "Germany", latitude: 52.5200, longitude: 13.4050, elevation: 34, timezoneOffsetHours: 1.0, displayName: "Berlin, Germany" },
  { cityName: "Rome", country: "Italy", latitude: 41.9028, longitude: 12.4964, elevation: 21, timezoneOffsetHours: 1.0, displayName: "Rome, Italy" },
  { cityName: "Moscow", country: "Russia", latitude: 55.7558, longitude: 37.6173, elevation: 156, timezoneOffsetHours: 3.0, displayName: "Moscow, Russia" },
  { cityName: "Melbourne", country: "Australia", latitude: -37.8136, longitude: 144.9631, elevation: 31, timezoneOffsetHours: 10.0, displayName: "Melbourne, Australia" },
  { cityName: "Auckland", country: "New Zealand", latitude: -36.8485, longitude: 174.7633, elevation: 10, timezoneOffsetHours: 12.0, displayName: "Auckland, New Zealand" },
];

/**
 * Fast search combining instant local matches with live high-precision global geocoding API
 */
export async function searchLocationSuggestions(query: string): Promise<LocationSuggestion[]> {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ || cleanQ.length < 2) return [];

  // 1. Instant local filter
  const localMatches = EXTENDED_LOCAL_PLACES.filter((p) => {
    const qInCity = p.cityName.toLowerCase().includes(cleanQ);
    const qInCountry = p.country?.toLowerCase().includes(cleanQ);
    const qInState = p.state?.toLowerCase().includes(cleanQ);
    return qInCity || qInCountry || qInState;
  });

  // 2. Fetch live global geocoding (Open-Meteo free CORS API)
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.results && Array.isArray(data.results)) {
        const remoteMatches: LocationSuggestion[] = data.results.map((r: any) => {
          const tzOffset = getTimezoneOffsetFromIana(r.timezone);
          const stateStr = r.admin1 ? `, ${r.admin1}` : "";
          const countryStr = r.country ? `, ${r.country}` : "";
          return {
            cityName: r.name,
            country: r.country || "World",
            state: r.admin1,
            latitude: parseFloat(r.latitude.toFixed(4)),
            longitude: parseFloat(r.longitude.toFixed(4)),
            elevation: Math.round(r.elevation || 10),
            timezoneOffsetHours: tzOffset,
            displayName: `${r.name}${stateStr}${countryStr}`,
          };
        });

        // Merge and deduplicate by approx lat/lon
        const combined = [...localMatches];
        remoteMatches.forEach((rm) => {
          const exists = combined.some(
            (c) => Math.abs(c.latitude - rm.latitude) < 0.1 && Math.abs(c.longitude - rm.longitude) < 0.1
          );
          if (!exists) {
            combined.push(rm);
          }
        });

        return combined.slice(0, 10);
      }
    }
  } catch {
    // If offline/error, return local matches
  }

  return localMatches.slice(0, 10);
}