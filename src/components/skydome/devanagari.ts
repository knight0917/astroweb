/**
 * Devanagari display names for the SkyDome "Graha-Mandalam" labels.
 * Display-only lookups; unknown keys fall back to the caller-supplied name.
 */

export const GRAHA_DEVANAGARI: Readonly<Record<string, string>> = Object.freeze({
  Sun: "सूर्यः",
  Moon: "चन्द्रः",
  Mars: "मङ्गलः",
  Mercury: "बुधः",
  Jupiter: "गुरुः",
  Venus: "शुक्रः",
  Saturn: "शनिः",
  Rahu: "राहुः",
  Ketu: "केतुः",
  Uranus: "अरुणः",
  Neptune: "वरुणः",
  Pluto: "यमः",
  Ascendant: "लग्नम्",
  Midheaven: "मध्यलग्नम्",
});

/** Full English rashi names, index 0 = Aries. */
export const RASHI_ENGLISH: readonly string[] = Object.freeze([
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]);

/** Short rashi forms in English used in compact planet meta lines. */
export const RASHI_ENGLISH_SHORT: readonly string[] = Object.freeze([
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]);

/** Full rashi names, index 0 = Mesha. */
export const RASHI_DEVANAGARI: readonly string[] = Object.freeze([
  "मेषः", "वृषभः", "मिथुनम्", "कर्कटः", "सिंहः", "कन्या",
  "तुला", "वृश्चिकः", "धनुः", "मकरः", "कुम्भः", "मीनः",
]);

/** Short rashi forms used in compact planet meta lines. */
export const RASHI_DEVANAGARI_SHORT: readonly string[] = Object.freeze([
  "मेष", "वृष", "मिथु", "कर्क", "सिंह", "कन्या",
  "तुला", "वृश्चि", "धनु", "मकर", "कुम्भ", "मीन",
]);

/** Nakshatra names, index 0 = Ashwini (27-nakshatra scheme). */
export const NAKSHATRA_DEVANAGARI: readonly string[] = Object.freeze([
  "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा",
  "मघा", "पूर्वफल्गुनी", "उत्तरफल्गुनी", "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा",
  "मूल", "पूर्वाषाढा", "उत्तराषाढा", "श्रवण", "धनिष्ठा", "शतभिषक्", "पूर्वभाद्रपदा", "उत्तरभाद्रपदा", "रेवती",
]);

export function grahaDevanagari(id: string, fallback: string): string {
  return GRAHA_DEVANAGARI[id] ?? fallback;
}

export function rashiShort(index: number): string {
  return RASHI_ENGLISH_SHORT[((index % 12) + 12) % 12];
}

export function nakshatraDevanagari(index: number | undefined, fallback: string): string {
  if (index === undefined || !Number.isInteger(index) || index < 0 || index > 26) return fallback;
  return NAKSHATRA_DEVANAGARI[index];
}

/** Compact DMS in the reel style: 23°25′10″ */
export function compactDMS(deg: number): string {
  const a = Math.abs(deg);
  const d = Math.floor(a);
  const mFloat = (a - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.floor((mFloat - m) * 60);
  return `${d}°${String(m).padStart(2, "0")}′${String(s).padStart(2, "0")}″`;
}

export const SD_FONT_SERIF = `"Tiro Devanagari Sanskrit", "Noto Serif Devanagari", "Nirmala UI", "Mangal", Georgia, serif`;
export const SD_FONT_MONO = `"JetBrains Mono", ui-monospace, "SFMono-Regular", Consolas, monospace`;
