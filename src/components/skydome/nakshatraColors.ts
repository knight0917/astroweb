/**
 * 27 Nakshatras Sacred Color Frequency Mapping (Shastric & Lunar Astro)
 * Each Nakshatra spans exactly 13°20' (13.3333°) on the sidereal ecliptic.
 * Example: Revati (index 26) = #A5D6A7
 */

export interface NakshatraColorEntry {
  index: number;
  name: string;
  sanskritName: string;
  nameDevanagari: string;
  lord: string;
  deity: string;
  color: string;
  startDeg: number;
  endDeg: number;
}

export const NAKSHATRA_COLORS: NakshatraColorEntry[] = [
  { index: 0, name: "Ashwini", sanskritName: "Aśvinī", nameDevanagari: "अश्विनी", lord: "Ketu", deity: "Ashvini Kumaras", color: "#D32F2F", startDeg: 0, endDeg: 13.3333 },
  { index: 1, name: "Bharani", sanskritName: "Bharaṇī", nameDevanagari: "भरणी", lord: "Venus", deity: "Yama", color: "#880E4F", startDeg: 13.3333, endDeg: 26.6667 },
  { index: 2, name: "Krittika", sanskritName: "Kṛttikā", nameDevanagari: "कृत्तिका", lord: "Sun", deity: "Agni", color: "#FFB300", startDeg: 26.6667, endDeg: 40 },
  { index: 3, name: "Rohini", sanskritName: "Rohiṇī", nameDevanagari: "रोहिणी", lord: "Moon", deity: "Brahma", color: "#F48FB1", startDeg: 40, endDeg: 53.3333 },
  { index: 4, name: "Mrigashira", sanskritName: "Mṛgaśīrṣā", nameDevanagari: "मृगशिरा", lord: "Mars", deity: "Soma", color: "#81C784", startDeg: 53.3333, endDeg: 66.6667 },
  { index: 5, name: "Ardra", sanskritName: "Ārdrā", nameDevanagari: "आर्द्रा", lord: "Rahu", deity: "Rudra", color: "#00E676", startDeg: 66.6667, endDeg: 80 },
  { index: 6, name: "Punarvasu", sanskritName: "Punarvasu", nameDevanagari: "पुनर्वसु", lord: "Jupiter", deity: "Aditi", color: "#FFD54F", startDeg: 80, endDeg: 93.3333 },
  { index: 7, name: "Pushya", sanskritName: "Puṣya", nameDevanagari: "पुष्य", lord: "Saturn", deity: "Brihaspati", color: "#FFCA28", startDeg: 93.3333, endDeg: 106.6667 },
  { index: 8, name: "Ashlesha", sanskritName: "Āśleṣā", nameDevanagari: "आश्लेषा", lord: "Mercury", deity: "Sarpas (Nagas)", color: "#2E7D32", startDeg: 106.6667, endDeg: 120 },
  { index: 9, name: "Magha", sanskritName: "Maghā", nameDevanagari: "मघा", lord: "Ketu", deity: "Pitris", color: "#FFFDD0", startDeg: 120, endDeg: 133.3333 },
  { index: 10, name: "Purva Phalguni", sanskritName: "Pūrva Phālgunī", nameDevanagari: "पूर्वा फाल्गुनी", lord: "Venus", deity: "Bhaga", color: "#FF8A65", startDeg: 133.3333, endDeg: 146.6667 },
  { index: 11, name: "Uttara Phalguni", sanskritName: "Uttara Phālgunī", nameDevanagari: "उत्तरा फाल्गुनी", lord: "Sun", deity: "Aryaman", color: "#1E88E5", startDeg: 146.6667, endDeg: 160 },
  { index: 12, name: "Hasta", sanskritName: "Hasta", nameDevanagari: "हस्त", lord: "Moon", deity: "Savitr", color: "#43A047", startDeg: 160, endDeg: 173.3333 },
  { index: 13, name: "Chitra", sanskritName: "Citrā", nameDevanagari: "चित्रा", lord: "Mars", deity: "Vishwakarma", color: "#BA68C8", startDeg: 173.3333, endDeg: 186.6667 },
  { index: 14, name: "Swati", sanskritName: "Svātī", nameDevanagari: "स्वाती", lord: "Rahu", deity: "Vayu", color: "#FF7043", startDeg: 186.6667, endDeg: 200 },
  { index: 15, name: "Vishakha", sanskritName: "Viśākhā", nameDevanagari: "विशाखा", lord: "Jupiter", deity: "Indra & Agni", color: "#FF9800", startDeg: 200, endDeg: 213.3333 },
  { index: 16, name: "Anuradha", sanskritName: "Anurādhā", nameDevanagari: "अनुराधा", lord: "Saturn", deity: "Mitra", color: "#C2185B", startDeg: 213.3333, endDeg: 226.6667 },
  { index: 17, name: "Jyeshtha", sanskritName: "Jyeṣṭhā", nameDevanagari: "ज्येष्ठा", lord: "Mercury", deity: "Indra", color: "#80CBC4", startDeg: 226.6667, endDeg: 240 },
  { index: 18, name: "Mula", sanskritName: "Mūla", nameDevanagari: "मूल", lord: "Ketu", deity: "Nirriti", color: "#8D6E63", startDeg: 240, endDeg: 253.3333 },
  { index: 19, name: "Purva Ashadha", sanskritName: "Pūrvāṣāḍhā", nameDevanagari: "पूर्वाषाढ़ा", lord: "Venus", deity: "Apas", color: "#FF6F00", startDeg: 253.3333, endDeg: 266.6667 },
  { index: 20, name: "Uttara Ashadha", sanskritName: "Uttarāṣāḍhā", nameDevanagari: "उत्तराषाढ़ा", lord: "Sun", deity: "Vishvadevas", color: "#E65100", startDeg: 266.6667, endDeg: 280 },
  { index: 21, name: "Shravana", sanskritName: "Śravaṇa", nameDevanagari: "श्रवण", lord: "Moon", deity: "Vishnu", color: "#4FC3F7", startDeg: 280, endDeg: 293.3333 },
  { index: 22, name: "Dhanishta", sanskritName: "Dhaniṣṭhā", nameDevanagari: "धनिष्ठा", lord: "Mars", deity: "Eight Vasus", color: "#B0BEC5", startDeg: 293.3333, endDeg: 306.6667 },
  { index: 23, name: "Shatabhisha", sanskritName: "Śatabhiṣaj", nameDevanagari: "शतभिषा", lord: "Rahu", deity: "Varuna", color: "#26A69A", startDeg: 306.6667, endDeg: 320 },
  { index: 24, name: "Purva Bhadrapada", sanskritName: "Pūrva Bhādrapadā", nameDevanagari: "पूर्वा भाद्रपदा", lord: "Jupiter", deity: "Aja Ekapada", color: "#FFB74D", startDeg: 320, endDeg: 333.3333 },
  { index: 25, name: "Uttara Bhadrapada", sanskritName: "Uttara Bhādrapadā", nameDevanagari: "उत्तरा भाद्रपदा", lord: "Saturn", deity: "Ahirbudhnya", color: "#7E57C2", startDeg: 333.3333, endDeg: 346.6667 },
  { index: 26, name: "Revati", sanskritName: "Revatī", nameDevanagari: "रेवती", lord: "Mercury", deity: "Pushan", color: "#A5D6A7", startDeg: 346.6667, endDeg: 360 },
];

export function getNakshatraColor(indexOrName: number | string): string {
  if (typeof indexOrName === "number") {
    const entry = NAKSHATRA_COLORS[indexOrName % 27];
    return entry ? entry.color : "#ffd700";
  }
  const clean = indexOrName.trim().toLowerCase();
  const entry = NAKSHATRA_COLORS.find(
    (n) => n.name.toLowerCase() === clean || n.sanskritName.toLowerCase() === clean
  );
  return entry ? entry.color : "#ffd700";
}
