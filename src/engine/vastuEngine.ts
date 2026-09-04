import {
  VastuDirection,
  VastuElement,
  VastuPada,
  VastuRoomType,
  VastuRoomPlacement,
  AyadiShadvargaResult,
  AshtakavargaVastuStrength,
  VastuSynthesisReport,
  JaiminiArudhaVastuInfo,
  JaiminiVastuReport,
  EphemerisResult,
} from "./types";
import { NAKSHATRAS, RASHIS, RASHI_NAMES } from "./constants";
import { calculateArudhaPadas } from "./jaimini";


// ============================================================================
// 1. 81-PADA PARAMASHAYIKA VASTU PURUSHA MANDALA (45 DEITIES MAPPING)
// ============================================================================

/**
 * 81-Pada Grid definition ($9 \times 9$ matrix).
 * Row 0 = North, Row 8 = South
 * Col 0 = West, Col 8 = East
 * Corner (0,8) = North-East (Ishanya), Corner (8,8) = South-East (Agneya)
 * Corner (8,0) = South-West (Nairritya), Corner (0,0) = North-West (Vayavya)
 */

export interface RawPadaData {
  id: string;
  nameSan: string;
  nameEng: string;
  category: "Brahma" | "InnerCardinal" | "Upadevata" | "OuterPerimeter";
  direction: VastuDirection;
  element: VastuElement;
  isAuspiciousDoor?: boolean;
  doorEffect?: string;
}

export const VASTU_81_GRID_MAP: Record<string, RawPadaData> = {
  // --- ROW 0 (NORTH PERIMETER: Col 0 to 8) ---
  "0,0": { id: "N1_Vayu", nameSan: "वायु (रोग/नाग)", nameEng: "Vayu / Roga", category: "OuterPerimeter", direction: "Northwest (Vayavya)", element: "Air (Vayu)", isAuspiciousDoor: false, doorEffect: "Erratic changes, restlessness" },
  "0,1": { id: "N2_Mukhya", nameSan: "मुख्य", nameEng: "Mukhya", category: "OuterPerimeter", direction: "North (Uttara)", element: "Water (Jala)", isAuspiciousDoor: true, doorEffect: "✨ High wealth, rapid business expansion, financial success" },
  "0,2": { id: "N3_Bhallata", nameSan: "भल्लाट", nameEng: "Bhallata", category: "OuterPerimeter", direction: "North (Uttara)", element: "Water (Jala)", isAuspiciousDoor: true, doorEffect: "✨ Immense prosperity, inheritance, abundant property" },
  "0,3": { id: "N4_Soma", nameSan: "सोम (कुबेर)", nameEng: "Soma / Kuber", category: "OuterPerimeter", direction: "North (Uttara)", element: "Water (Jala)", isAuspiciousDoor: true, doorEffect: "✨ Treasury of Kubera, divine blessings, scholarly wisdom" },
  "0,4": { id: "N5_Bhujanga", nameSan: "भुजंग (सर्प)", nameEng: "Bhujanga", category: "OuterPerimeter", direction: "North (Uttara)", element: "Water (Jala)", isAuspiciousDoor: false, doorEffect: "Secret enmities, unexpected friction" },
  "0,5": { id: "N6_Aditi", nameSan: "अदिति", nameEng: "Aditi", category: "OuterPerimeter", direction: "North (Uttara)", element: "Water (Jala)", isAuspiciousDoor: false, doorEffect: "Fear of debt, restlessness in women" },
  "0,6": { id: "N7_Diti", nameSan: "दिति", nameEng: "Diti", category: "OuterPerimeter", direction: "Northeast (Ishanya)", element: "Water (Jala)", isAuspiciousDoor: false, doorEffect: "Excess expenditure, intellectual anxiety" },
  "0,7": { id: "N8_Apas", nameSan: "आप (जल)", nameEng: "Apas", category: "OuterPerimeter", direction: "Northeast (Ishanya)", element: "Water (Jala)", isAuspiciousDoor: false, doorEffect: "Health sensitivity, emotional fluctuations" },
  "0,8": { id: "E1_Shikhi", nameSan: "शिखी (ईश/रुद्र)", nameEng: "Shikhi (Ishana Corner)", category: "OuterPerimeter", direction: "Northeast (Ishanya)", element: "Water (Jala)", isAuspiciousDoor: false, doorEffect: "Accident risk, fire hazards" },

  // --- ROW 1 ---
  "1,0": { id: "W8_Roga", nameSan: "पापयक्ष्मा / रोग", nameEng: "Papayakshma", category: "OuterPerimeter", direction: "Northwest (Vayavya)", element: "Air (Vayu)", isAuspiciousDoor: false, doorEffect: "Wasting diseases, legal expenses" },
  "1,1": { id: "Rudra_1", nameSan: "रुद्र", nameEng: "Rudra", category: "Upadevata", direction: "Northwest (Vayavya)", element: "Air (Vayu)" },
  "1,2": { id: "Rudra_2", nameSan: "रुद्र", nameEng: "Rudra", category: "Upadevata", direction: "Northwest (Vayavya)", element: "Air (Vayu)" },
  "1,3": { id: "Bhudhara_1", nameSan: "पृथ्वीधर (भूधर)", nameEng: "Prithvidhara", category: "InnerCardinal", direction: "North (Uttara)", element: "Water (Jala)" },
  "1,4": { id: "Bhudhara_2", nameSan: "पृथ्वीधर (भूधर)", nameEng: "Prithvidhara", category: "InnerCardinal", direction: "North (Uttara)", element: "Water (Jala)" },
  "1,5": { id: "Bhudhara_3", nameSan: "पृथ्वीधर (भूधर)", nameEng: "Prithvidhara", category: "InnerCardinal", direction: "North (Uttara)", element: "Water (Jala)" },
  "1,6": { id: "Apavatsa_1", nameSan: "आपवत्स", nameEng: "Apavatsa", category: "Upadevata", direction: "Northeast (Ishanya)", element: "Water (Jala)" },
  "1,7": { id: "Apavatsa_2", nameSan: "आपवत्स", nameEng: "Apavatsa", category: "Upadevata", direction: "Northeast (Ishanya)", element: "Water (Jala)" },
  "1,8": { id: "E2_Parjanya", nameSan: "पर्जन्य", nameEng: "Parjanya", category: "OuterPerimeter", direction: "Northeast (Ishanya)", element: "Water (Jala)", isAuspiciousDoor: false, doorEffect: "Excess female progeny, high expenditure" },

  // --- ROW 2 ---
  "2,0": { id: "W7_Sosha", nameSan: "शोष", nameEng: "Sosha", category: "OuterPerimeter", direction: "Northwest (Vayavya)", element: "Air (Vayu)", isAuspiciousDoor: false, doorEffect: "General weakness, loss of stamina" },
  "2,1": { id: "Rajayakshma_1", nameSan: "राजयक्ष्मा", nameEng: "Rajayakshma", category: "Upadevata", direction: "Northwest (Vayavya)", element: "Air (Vayu)" },
  "2,2": { id: "Rajayakshma_2", nameSan: "राजयक्ष्मा", nameEng: "Rajayakshma", category: "Upadevata", direction: "Northwest (Vayavya)", element: "Air (Vayu)" },
  "2,3": { id: "Bhudhara_4", nameSan: "पृथ्वीधर", nameEng: "Prithvidhara", category: "InnerCardinal", direction: "North (Uttara)", element: "Water (Jala)" },
  "2,4": { id: "Bhudhara_5", nameSan: "पृथ्वीधर", nameEng: "Prithvidhara", category: "InnerCardinal", direction: "North (Uttara)", element: "Water (Jala)" },
  "2,5": { id: "Bhudhara_6", nameSan: "पृथ्वीधर", nameEng: "Prithvidhara", category: "InnerCardinal", direction: "North (Uttara)", element: "Water (Jala)" },
  "2,6": { id: "Apavatsa_3", nameSan: "आपवत्स", nameEng: "Apavatsa", category: "Upadevata", direction: "Northeast (Ishanya)", element: "Water (Jala)" },
  "2,7": { id: "Apavatsa_4", nameSan: "आपवत्स", nameEng: "Apavatsa", category: "Upadevata", direction: "Northeast (Ishanya)", element: "Water (Jala)" },
  "2,8": { id: "E3_Jayanta", nameSan: "जयन्त", nameEng: "Jayanta", category: "OuterPerimeter", direction: "East (Purva)", element: "Light (Agni-Vayu)", isAuspiciousDoor: true, doorEffect: "✨ Victory, high executive stature, massive wealth generation" },

  // --- ROW 3 (BRAHMASTHANA STARTS: Col 3 to 5) ---
  "3,0": { id: "W6_Asura", nameSan: "असुर", nameEng: "Asura", category: "OuterPerimeter", direction: "West (Paschima)", element: "Air (Vayu)", isAuspiciousDoor: false, doorEffect: "Government penalties, constant official pressure" },
  "3,1": { id: "Mitra_1", nameSan: "मित्र", nameEng: "Mitra", category: "InnerCardinal", direction: "West (Paschima)", element: "Air-Water (Vayu-Jala)" },
  "3,2": { id: "Mitra_2", nameSan: "मित्र", nameEng: "Mitra", category: "InnerCardinal", direction: "West (Paschima)", element: "Air-Water (Vayu-Jala)" },
  "3,3": { id: "Brahma_1", nameSan: "ब्रह्मा (ब्रह्मस्थान)", nameEng: "Brahmasthana 1", category: "Brahma", direction: "Brahmasthana (Center)", element: "Space (Akasha)" },
  "3,4": { id: "Brahma_2", nameSan: "ब्रह्मा (ब्रह्मस्थान)", nameEng: "Brahmasthana 2", category: "Brahma", direction: "Brahmasthana (Center)", element: "Space (Akasha)" },
  "3,5": { id: "Brahma_3", nameSan: "ब्रह्मा (ब्रह्मस्थान)", nameEng: "Brahmasthana 3", category: "Brahma", direction: "Brahmasthana (Center)", element: "Space (Akasha)" },
  "3,6": { id: "Aryama_1", nameSan: "अर्यमा", nameEng: "Aryama", category: "InnerCardinal", direction: "East (Purva)", element: "Light (Agni-Vayu)" },
  "3,7": { id: "Aryama_2", nameSan: "अर्यमा", nameEng: "Aryama", category: "InnerCardinal", direction: "East (Purva)", element: "Light (Agni-Vayu)" },
  "3,8": { id: "E4_Indra", nameSan: "इन्द्र (महेन्द्र)", nameEng: "Mahendra / Indra", category: "OuterPerimeter", direction: "East (Purva)", element: "Light (Agni-Vayu)", isAuspiciousDoor: true, doorEffect: "✨ Royal status, powerful networking, authority from government" },

  // --- ROW 4 ---
  "4,0": { id: "W5_Varuna", nameSan: "वरुण", nameEng: "Varuna", category: "OuterPerimeter", direction: "West (Paschima)", element: "Air-Water", isAuspiciousDoor: false, doorEffect: "Fluctuating fortune, mood swings" },
  "4,1": { id: "Mitra_3", nameSan: "मित्र", nameEng: "Mitra", category: "InnerCardinal", direction: "West (Paschima)", element: "Air-Water" },
  "4,2": { id: "Mitra_4", nameSan: "मित्र", nameEng: "Mitra", category: "InnerCardinal", direction: "West (Paschima)", element: "Air-Water" },
  "4,3": { id: "Brahma_4", nameSan: "ब्रह्मा (हृदय)", nameEng: "Brahmasthana Center", category: "Brahma", direction: "Brahmasthana (Center)", element: "Space (Akasha)" },
  "4,4": { id: "Brahma_5", nameSan: "ब्रह्मा (नाभि/हृदय)", nameEng: "Brahmasthana Core", category: "Brahma", direction: "Brahmasthana (Center)", element: "Space (Akasha)" },
  "4,5": { id: "Brahma_6", nameSan: "ब्रह्मा (हृदय)", nameEng: "Brahmasthana Center", category: "Brahma", direction: "Brahmasthana (Center)", element: "Space (Akasha)" },
  "4,6": { id: "Aryama_3", nameSan: "अर्यमा", nameEng: "Aryama", category: "InnerCardinal", direction: "East (Purva)", element: "Light (Agni-Vayu)" },
  "4,7": { id: "Aryama_4", nameSan: "अर्यमा", nameEng: "Aryama", category: "InnerCardinal", direction: "East (Purva)", element: "Light (Agni-Vayu)" },
  "4,8": { id: "E5_Surya", nameSan: "सूर्य", nameEng: "Surya", category: "OuterPerimeter", direction: "East (Purva)", element: "Light (Agni-Vayu)", isAuspiciousDoor: false, doorEffect: "Short-tempered nature, internal conflicts" },

  // --- ROW 5 ---
  "5,0": { id: "W4_Pushpadanta", nameSan: "पुष्पदन्त", nameEng: "Pushpadanta", category: "OuterPerimeter", direction: "West (Paschima)", element: "Air-Water", isAuspiciousDoor: true, doorEffect: "✨ Massive wealth accumulation, intellectual fame, prosperity" },
  "5,1": { id: "Mitra_5", nameSan: "मित्र", nameEng: "Mitra", category: "InnerCardinal", direction: "West (Paschima)", element: "Air-Water" },
  "5,2": { id: "Mitra_6", nameSan: "मित्र", nameEng: "Mitra", category: "InnerCardinal", direction: "West (Paschima)", element: "Air-Water" },
  "5,3": { id: "Brahma_7", nameSan: "ब्रह्मा (ब्रह्मस्थान)", nameEng: "Brahmasthana 7", category: "Brahma", direction: "Brahmasthana (Center)", element: "Space (Akasha)" },
  "5,4": { id: "Brahma_8", nameSan: "ब्रह्मा (ब्रह्मस्थान)", nameEng: "Brahmasthana 8", category: "Brahma", direction: "Brahmasthana (Center)", element: "Space (Akasha)" },
  "5,5": { id: "Brahma_9", nameSan: "ब्रह्मा (ब्रह्मस्थान)", nameEng: "Brahmasthana 9", category: "Brahma", direction: "Brahmasthana (Center)", element: "Space (Akasha)" },
  "5,6": { id: "Aryama_5", nameSan: "अर्यमा", nameEng: "Aryama", category: "InnerCardinal", direction: "East (Purva)", element: "Light (Agni-Vayu)" },
  "5,7": { id: "Aryama_6", nameSan: "अर्यमा", nameEng: "Aryama", category: "InnerCardinal", direction: "East (Purva)", element: "Light (Agni-Vayu)" },
  "5,8": { id: "E6_Satya", nameSan: "सत्य", nameEng: "Satya", category: "OuterPerimeter", direction: "East (Purva)", element: "Light (Agni-Vayu)", isAuspiciousDoor: false, doorEffect: "Deceit from partners, broken promises" },

  // --- ROW 6 ---
  "6,0": { id: "W3_Sugriva", nameSan: "सुग्रीव", nameEng: "Sugriva", category: "OuterPerimeter", direction: "West (Paschima)", element: "Air-Water", isAuspiciousDoor: true, doorEffect: "✨ Steady commercial profits, sharp commercial mind, stable gains" },
  "6,1": { id: "Jaya_1", nameSan: "जय (इन्द्रराज)", nameEng: "Jaya", category: "Upadevata", direction: "Southwest (Nairritya)", element: "Earth (Prithvi)" },
  "6,2": { id: "Jaya_2", nameSan: "जय (इन्द्रराज)", nameEng: "Jaya", category: "Upadevata", direction: "Southwest (Nairritya)", element: "Earth (Prithvi)" },
  "6,3": { id: "Vivasvan_1", nameSan: "विवस्वान", nameEng: "Vivasvan", category: "InnerCardinal", direction: "South (Dakshina)", element: "Earth-Fire" },
  "6,4": { id: "Vivasvan_2", nameSan: "विवस्वान", nameEng: "Vivasvan", category: "InnerCardinal", direction: "South (Dakshina)", element: "Earth-Fire" },
  "6,5": { id: "Vivasvan_3", nameSan: "विवस्वान", nameEng: "Vivasvan", category: "InnerCardinal", direction: "South (Dakshina)", element: "Earth-Fire" },
  "6,6": { id: "Savita_1", nameSan: "सविता", nameEng: "Savita", category: "Upadevata", direction: "Southeast (Agneya)", element: "Fire (Agni)" },
  "6,7": { id: "Savita_2", nameSan: "सविता", nameEng: "Savita", category: "Upadevata", direction: "Southeast (Agneya)", element: "Fire (Agni)" },
  "6,8": { id: "E7_Bhrisha", nameSan: "भृश", nameEng: "Bhrisha", category: "OuterPerimeter", direction: "Southeast (Agneya)", element: "Fire (Agni)", isAuspiciousDoor: false, doorEffect: "Excess anger, domestic friction" },

  // --- ROW 7 ---
  "7,0": { id: "W2_Dauvarika", nameSan: "दौवारिक", nameEng: "Dauvarika", category: "OuterPerimeter", direction: "Southwest (Nairritya)", element: "Earth (Prithvi)", isAuspiciousDoor: false, doorEffect: "Instability, recurring enmity" },
  "7,1": { id: "Indraraja_1", nameSan: "इन्द्रराज", nameEng: "Indraraja", category: "Upadevata", direction: "Southwest (Nairritya)", element: "Earth (Prithvi)" },
  "7,2": { id: "Indraraja_2", nameSan: "इन्द्रराज", nameEng: "Indraraja", category: "Upadevata", direction: "Southwest (Nairritya)", element: "Earth (Prithvi)" },
  "7,3": { id: "Vivasvan_4", nameSan: "विवस्वान", nameEng: "Vivasvan", category: "InnerCardinal", direction: "South (Dakshina)", element: "Earth-Fire" },
  "7,4": { id: "Vivasvan_5", nameSan: "विवस्वान", nameEng: "Vivasvan", category: "InnerCardinal", direction: "South (Dakshina)", element: "Earth-Fire" },
  "7,5": { id: "Vivasvan_6", nameSan: "विवस्वान", nameEng: "Vivasvan", category: "InnerCardinal", direction: "South (Dakshina)", element: "Earth-Fire" },
  "7,6": { id: "Savitra_1", nameSan: "सावित्र", nameEng: "Savitra", category: "Upadevata", direction: "Southeast (Agneya)", element: "Fire (Agni)" },
  "7,7": { id: "Savitra_2", nameSan: "सावित्र", nameEng: "Savitra", category: "Upadevata", direction: "Southeast (Agneya)", element: "Fire (Agni)" },
  "7,8": { id: "E8_Antariksha", nameSan: "अन्तरिक्ष", nameEng: "Antariksha", category: "OuterPerimeter", direction: "Southeast (Agneya)", element: "Fire (Agni)", isAuspiciousDoor: false, doorEffect: "Theft vulnerability, financial leakage" },

  // --- ROW 8 (SOUTH PERIMETER: Col 0 to 8) ---
  "8,0": { id: "W1_Pitru", nameSan: "पितृ (नैर्ऋत्य)", nameEng: "Pitru (Nairritya Corner)", category: "OuterPerimeter", direction: "Southwest (Nairritya)", element: "Earth (Prithvi)", isAuspiciousDoor: false, doorEffect: "Severe patriarchal decay, financial loss" },
  "8,1": { id: "S8_Mriga", nameSan: "मृग", nameEng: "Mriga", category: "OuterPerimeter", direction: "Southwest (Nairritya)", element: "Earth (Prithvi)", isAuspiciousDoor: false, doorEffect: "Loss of offspring strength, family grief" },
  "8,2": { id: "S7_Bhrigaraja", nameSan: "भृङ्गराज", nameEng: "Bhrigaraja", category: "OuterPerimeter", direction: "South (Dakshina)", element: "Earth-Fire", isAuspiciousDoor: false, doorEffect: "Frequent impoverishment, loss of vitality" },
  "8,3": { id: "S6_Gandharva", nameSan: "गन्धर्व", nameEng: "Gandharva", category: "OuterPerimeter", direction: "South (Dakshina)", element: "Earth-Fire", isAuspiciousDoor: false, doorEffect: "Loss of reputation, social dishonor" },
  "8,4": { id: "S5_Yama", nameSan: "यम", nameEng: "Yama", category: "OuterPerimeter", direction: "South (Dakshina)", element: "Earth-Fire", isAuspiciousDoor: false, doorEffect: "Legal oppression, chronic litigation" },
  "8,5": { id: "S4_Grihakshata", nameSan: "गृहक्षत", nameEng: "Grihakshata", category: "OuterPerimeter", direction: "South (Dakshina)", element: "Earth-Fire", isAuspiciousDoor: true, doorEffect: "✨ Flourishing lineage, peaceful prosperity, filial joy" },
  "8,6": { id: "S3_Vitatha", nameSan: "वितथ", nameEng: "Vitatha", category: "OuterPerimeter", direction: "South (Dakshina)", element: "Earth-Fire", isAuspiciousDoor: true, doorEffect: "✨ High material wealth, courage, overcoming competitors" },
  "8,7": { id: "S2_Pusha", nameSan: "पूषा", nameEng: "Pusha", category: "OuterPerimeter", direction: "Southeast (Agneya)", element: "Fire (Agni)", isAuspiciousDoor: false, doorEffect: "Servitude to others, subjection" },
  "8,8": { id: "S1_Agni", nameSan: "अग्नि (अनल)", nameEng: "Agni (Agneya Corner)", category: "OuterPerimeter", direction: "Southeast (Agneya)", element: "Fire (Agni)", isAuspiciousDoor: false, doorEffect: "Fire hazards, acute female health affliction" },
};

export function getVastuPada(row: number, col: number): VastuPada {
  const clampedRow = Math.max(0, Math.min(8, Math.round(row)));
  const clampedCol = Math.max(0, Math.min(8, Math.round(col)));
  const key = `${clampedRow},${clampedCol}`;
  const raw = VASTU_81_GRID_MAP[key] || VASTU_81_GRID_MAP["4,4"];

  return {
    id: raw.id,
    row: clampedRow,
    col: clampedCol,
    deitySanskrit: raw.nameSan,
    deityEnglish: raw.nameEng,
    category: raw.category,
    direction: raw.direction,
    element: raw.element,
    isAuspiciousDoorPada: raw.isAuspiciousDoor || false,
    doorSignificance: raw.doorEffect,
  };
}

export function getDirectionFromCoords(row: number, col: number): VastuDirection {
  if (row >= 3 && row <= 5 && col >= 3 && col <= 5) return "Brahmasthana (Center)";
  if (row <= 2 && col >= 6) return "Northeast (Ishanya)";
  if (row >= 3 && row <= 5 && col >= 6) return "East (Purva)";
  if (row >= 6 && col >= 6) return "Southeast (Agneya)";
  if (row >= 6 && col >= 3 && col <= 5) return "South (Dakshina)";
  if (row >= 6 && col <= 2) return "Southwest (Nairritya)";
  if (row >= 3 && row <= 5 && col <= 2) return "West (Paschima)";
  if (row <= 2 && col <= 2) return "Northwest (Vayavya)";
  return "North (Uttara)";
}

// ============================================================================
// 2. ROOM COMPATIBILITY RULES
// ============================================================================

export interface RoomScoreRule {
  idealDirections: VastuDirection[];
  acceptableDirections: VastuDirection[];
  defectiveDirections: VastuDirection[];
  idealFeedback: string;
  acceptableFeedback: string;
  defectiveFeedback: string;
  pariharaRemedy: string;
}

export const ROOM_COMPATIBILITY_RULES: Record<VastuRoomType, RoomScoreRule> = {
  pooja_room: {
    idealDirections: ["Northeast (Ishanya)", "East (Purva)", "North (Uttara)"],
    acceptableDirections: ["Brahmasthana (Center)", "West (Paschima)"],
    defectiveDirections: ["Southwest (Nairritya)", "Southeast (Agneya)", "South (Dakshina)", "Northwest (Vayavya)"],
    idealFeedback: "✨ Supreme placement! Direct alignment with Ishana and divine cosmic prana.",
    acceptableFeedback: "Neutral placement. Ensure idols face East and altar remains sacred and pure.",
    defectiveFeedback: "⚠️ Vastu Dosa: Pooja altar placed in a heavy or fiery zone disturbs mental tranquility.",
    pariharaRemedy: "Install a 3D Siddha Meru Sri Yantra in North-East and use copper/silver altar vessels.",
  },
  kitchen: {
    idealDirections: ["Southeast (Agneya)", "Northwest (Vayavya)"],
    acceptableDirections: ["East (Purva)", "South (Dakshina)"],
    defectiveDirections: ["Northeast (Ishanya)", "Southwest (Nairritya)", "North (Uttara)", "Brahmasthana (Center)"],
    idealFeedback: "✨ Excellent Agni-sthana! Cook faces East, generating physical vitality and abundance.",
    acceptableFeedback: "Workable secondary location. Keep stove in SE corner of the room.",
    defectiveFeedback: "⚠️ Severe Agni-Jala Clash: Cooking fire in Water/Space zone causes health and cash dissipation.",
    pariharaRemedy: "Place a pure copper strip under the stove and use pastel green marble base to soothe fire-water clash.",
  },
  master_bedroom: {
    idealDirections: ["Southwest (Nairritya)", "South (Dakshina)"],
    acceptableDirections: ["West (Paschima)", "Northwest (Vayavya)"],
    defectiveDirections: ["Northeast (Ishanya)", "Southeast (Agneya)", "North (Uttara)", "Brahmasthana (Center)"],
    idealFeedback: "✨ Supreme Earth Stability! Anchors authority, marital bond, and leadership in the house.",
    acceptableFeedback: "Acceptable room. Sleep with head towards South or East for rejuvenation.",
    defectiveFeedback: "⚠️ Dosa: Master bed in North-East or South-East creates mental restlessness and fiery arguments.",
    pariharaRemedy: "Anchor room with heavy wooden furniture, earthy ochre wall shades, and lead wire skirting.",
  },
  living_room: {
    idealDirections: ["East (Purva)", "North (Uttara)", "Northeast (Ishanya)"],
    acceptableDirections: ["Northwest (Vayavya)", "West (Paschima)", "Brahmasthana (Center)"],
    defectiveDirections: ["Southwest (Nairritya)", "South (Dakshina)"],
    idealFeedback: "✨ Vibrant welcoming prana! Fosters joyous social interactions and prestigious guests.",
    acceptableFeedback: "Good functional space. Ensure heavy sofa sits against South/West walls.",
    defectiveFeedback: "⚠️ Social isolation risk. South-West open living creates energetic draining.",
    pariharaRemedy: "Hang a warm Surya Mandala artwork on the East wall and maintain bright ambient lighting.",
  },
  dining_room: {
    idealDirections: ["West (Paschima)", "East (Purva)"],
    acceptableDirections: ["North (Uttara)", "Northwest (Vayavya)", "Southeast (Agneya)"],
    defectiveDirections: ["Southwest (Nairritya)", "Northeast (Ishanya)"],
    idealFeedback: "✨ Fosters optimal digestion, joyful family meals, and steady nutrient absorption.",
    acceptableFeedback: "Satisfactory location. Face East or North while eating.",
    defectiveFeedback: "⚠️ Digestive friction and hurried eating patterns.",
    pariharaRemedy: "Keep dining table rectangular or square (avoid circular/oval) and decorate with fruit artwork.",
  },
  study_room: {
    idealDirections: ["Northeast (Ishanya)", "East (Purva)", "North (Uttara)"],
    acceptableDirections: ["West (Paschima)", "Northwest (Vayavya)"],
    defectiveDirections: ["Southwest (Nairritya)", "Southeast (Agneya)", "South (Dakshina)"],
    idealFeedback: "✨ Supreme intellect portal! Deep memory retention, sharp focus, and academic excellence.",
    acceptableFeedback: "Decent study quadrant. Keep study desk facing East or North.",
    defectiveFeedback: "⚠️ Distraction and burnout risk due to fiery or heavy gravitational drag.",
    pariharaRemedy: "Place a Saraswati Yantra or crystal globe on study desk and use mint green accents.",
  },
  kids_bedroom: {
    idealDirections: ["Northwest (Vayavya)", "West (Paschima)", "East (Purva)"],
    acceptableDirections: ["North (Uttara)", "Northeast (Ishanya)"],
    defectiveDirections: ["Southwest (Nairritya)", "Southeast (Agneya)"],
    idealFeedback: "✨ Dynamic youth vitality! Inspires creative growth and energetic play.",
    acceptableFeedback: "Harmonious youth room. Keep bed headboard towards East.",
    defectiveFeedback: "⚠️ Lethargy in SW or aggressive behavior in SE.",
    pariharaRemedy: "Use soft ivory/pastel blue colors and keep study table strictly facing East.",
  },
  guest_room: {
    idealDirections: ["Northwest (Vayavya)"],
    acceptableDirections: ["West (Paschima)", "North (Uttara)", "East (Purva)"],
    defectiveDirections: ["Southwest (Nairritya)", "Northeast (Ishanya)"],
    idealFeedback: "✨ Ideal Vayu quadrant! Guests feel warm, honored, and depart gracefully on time.",
    acceptableFeedback: "Comfortable guest space.",
    defectiveFeedback: "⚠️ SW guest room causes guests to overstay and dominate household authority.",
    pariharaRemedy: "Decorate with light silver/white curtains and keep room clutter-free.",
  },
  toilet: {
    idealDirections: ["West (Paschima)", "South (Dakshina)"],
    acceptableDirections: ["Northwest (Vayavya)", "Southeast (Agneya)"],
    defectiveDirections: ["Northeast (Ishanya)", "Brahmasthana (Center)", "Southwest (Nairritya)", "North (Uttara)"],
    idealFeedback: "✨ Proper waste elimination zone without polluting sacred portals.",
    acceptableFeedback: "Keep commode facing North-South axis and door closed at all times.",
    defectiveFeedback: "⚠️ Severe Vāstu Dosa: Toilet in North-East, Center, or North poisons prana and wealth.",
    pariharaRemedy: "Install a brass/zinc energy barrier strip around toilet door and keep a bowl of sea salt inside.",
  },
  water_tank_overhead: {
    idealDirections: ["Southwest (Nairritya)", "West (Paschima)", "South (Dakshina)"],
    acceptableDirections: ["Northwest (Vayavya)"],
    defectiveDirections: ["Northeast (Ishanya)", "Brahmasthana (Center)", "Southeast (Agneya)", "North (Uttara)"],
    idealFeedback: "✨ Excellent heavy load on highest structural point, anchoring stability.",
    acceptableFeedback: "Acceptable overhead tank position.",
    defectiveFeedback: "⚠️ Heavy weight on delicate North-East or Center crushes wealth and health.",
    pariharaRemedy: "Paint tank blue or black; never place overhead load directly on Brahmasthana core.",
  },
  water_tank_underground: {
    idealDirections: ["Northeast (Ishanya)", "North (Uttara)", "East (Purva)"],
    acceptableDirections: ["Northwest (Vayavya)"],
    defectiveDirections: ["Southwest (Nairritya)", "Southeast (Agneya)", "South (Dakshina)", "Brahmasthana (Center)"],
    idealFeedback: "✨ Inflow of divine water prana, generating continuous wealth and good health.",
    acceptableFeedback: "Acceptable water borewell/reservoir.",
    defectiveFeedback: "⚠️ Underground pit in South-West causes severe financial erosion and accident risk.",
    pariharaRemedy: "Fill or seal SW underground pits; relocate borewell to Ishanya or North.",
  },
  septic_tank: {
    idealDirections: ["Northwest (Vayavya)", "West (Paschima)"],
    acceptableDirections: ["South (Dakshina)"],
    defectiveDirections: ["Northeast (Ishanya)", "Southwest (Nairritya)", "Brahmasthana (Center)", "Southeast (Agneya)"],
    idealFeedback: "✨ Correct disposal zone without contaminating positive magnetic inflow.",
    acceptableFeedback: "Acceptable septic location.",
    defectiveFeedback: "⚠️ Septic tank in North-East or Center creates severe chronic illness and debt.",
    pariharaRemedy: "Encase tank with brass boundary strip and plant neutralizer hedge around perimeter.",
  },
  main_door: {
    idealDirections: ["Northeast (Ishanya)", "East (Purva)", "North (Uttara)"],
    acceptableDirections: ["West (Paschima)", "South (Dakshina)"],
    defectiveDirections: ["Southwest (Nairritya)", "Southeast (Agneya)"],
    idealFeedback: "✨ Auspicious entrance! Channelling positive solar and magnetic currents.",
    acceptableFeedback: "Ensure entrance Pada is Vitatha (S3), Grihakshata (S4), Sugriva (W3) or Pushpadanta (W4).",
    defectiveFeedback: "⚠️ Inauspicious door pada induces recurring expenditure and friction.",
    pariharaRemedy: "Affix a consecrated Vastu Dosh Nivaran Yantra and copper/silver swastika above the lintel.",
  },
  staircase: {
    idealDirections: ["Southwest (Nairritya)", "South (Dakshina)", "West (Paschima)"],
    acceptableDirections: ["Northwest (Vayavya)", "Southeast (Agneya)"],
    defectiveDirections: ["Northeast (Ishanya)", "Brahmasthana (Center)", "North (Uttara)"],
    idealFeedback: "✨ Clockwise rising stairs in heavy zone provide strong grounding.",
    acceptableFeedback: "Ensure stairs turn clockwise (Pradakshina).",
    defectiveFeedback: "⚠️ Heavy staircase in North-East or Center crushes health and wealth.",
    pariharaRemedy: "Ensure under-stair area is kept pristine and never used for pooja or toilet.",
  },
  open_balcony: {
    idealDirections: ["North (Uttara)", "East (Purva)", "Northeast (Ishanya)"],
    acceptableDirections: ["Northwest (Vayavya)"],
    defectiveDirections: ["Southwest (Nairritya)", "South (Dakshina)"],
    idealFeedback: "✨ Excellent open light portal receiving healthy morning photons.",
    acceptableFeedback: "Pleasant open terrace space.",
    defectiveFeedback: "⚠️ Open SW balcony creates energy dissipation.",
    pariharaRemedy: "Place heavy earthen potted plants (Ficus/Palm) on South and West balconies.",
  },
};

export function evaluateRoomPlacement(
  roomType: VastuRoomType,
  row: number,
  col: number,
  customLabel?: string
): VastuRoomPlacement {
  const pada = getVastuPada(row, col);
  const dir = pada.direction;
  const rule = ROOM_COMPATIBILITY_RULES[roomType];

  let score = 50;
  let grade: "Ideal (सर्वोत्तम)" | "Acceptable (मध्यम)" | "Defective (दोष)" = "Acceptable (मध्यम)";
  let feedback = rule.acceptableFeedback;

  if (rule.idealDirections.includes(dir)) {
    score = 100;
    grade = "Ideal (सर्वोत्तम)";
    feedback = rule.idealFeedback;
  } else if (rule.defectiveDirections.includes(dir)) {
    score = 15;
    grade = "Defective (दोष)";
    feedback = rule.defectiveFeedback;
  }

  // Special door check on outer perimeter
  if (roomType === "main_door" && pada.isAuspiciousDoorPada) {
    score = 100;
    grade = "Ideal (सर्वोत्तम)";
    feedback = `✨ Auspicious Door Pada: ${pada.deitySanskrit} (${pada.id}) — ${pada.doorSignificance || "Generates tremendous wealth & fame."}`;
  }

  return {
    roomType,
    customLabel: customLabel || roomType.replace(/_/g, " ").toUpperCase(),
    row,
    col,
    direction: dir,
    padaName: `${pada.deitySanskrit} (${pada.deityEnglish})`,
    complianceScore: score,
    grade,
    feedback,
    pariharaRemedy: grade === "Defective (दोष)" ? rule.pariharaRemedy : undefined,
  };
}

// ============================================================================
// 3. ĀYĀDI-ṢAḌVARGA MATHEMATICAL ENGINE (SAMARĀṄGAṆA-SŪTRADHĀRA & MĀNASĀRA)
// ============================================================================

export const AYA_NAMES = [
  "Dhvaja (ध्वज - Peak Prosperity / Kingly Rise)",
  "Dhūma (धूम - Grief / Smoke)",
  "Siṃha (सिंह - Regal Victory & Valour)",
  "Śvāna (श्वान - Enmity / Instability)",
  "Vṛṣabha (वृषभ - Wealth & Cattle Abundance)",
  "Khara (खर - Obstacles / Hard Labor)",
  "Gaja (गज - Elephant Strength & Royalty)",
  "Vāyasa (वायस - Expenditure / Restlessness)",
];

export const YONI_NAMES = [
  "Dhwaja (ध्वज - East)",
  "Dhuma (धूम - Southeast)",
  "Simha (सिंह - South)",
  "Shvana (श्वान - Southwest)",
  "Vrisha (वृष - West)",
  "Khara (खर - Northwest)",
  "Gaja (गज - North)",
  "Vayasa (वायस - Northeast)",
];

export const VARA_NAMES = ["Sun (Sunday)", "Moon (Monday)", "Mars (Tuesday)", "Mercury (Wednesday)", "Jupiter (Thursday)", "Venus (Friday)", "Saturn (Saturday)"];

export function calculateAyadiShadvarga(
  lengthFeet: number,
  breadthFeet: number,
  nativeJanmaNakshatraName?: string
): AyadiShadvargaResult {
  const L = Math.max(1, lengthFeet);
  const B = Math.max(1, breadthFeet);
  const P = 2 * (L + B);
  const Area = L * B;

  // Conversion: 1 Hasta ≈ 1.5 Feet (18 inches)
  const lHasta = Math.round((L / 1.5) * 10) / 10;
  const bHasta = Math.round((B / 1.5) * 10) / 10;
  const pHasta = Math.round((P / 1.5) * 10) / 10;

  // 1. Āya = (Perimeter * 8) % 12
  const ayaRaw = Math.round(P * 8) % 12;
  const ayaNum = ayaRaw === 0 ? 12 : ayaRaw;
  const ayaIndex = (ayaNum - 1) % 8;
  const ayaName = AYA_NAMES[ayaIndex];
  const isAyaAuspicious = [1, 3, 5, 7].includes(ayaNum % 8 === 0 ? 8 : ayaNum % 8);
  const ayaGrade: "Auspicious (उत्तम)" | "Moderate (मध्यम)" | "Inauspicious (अशुभ)" = isAyaAuspicious ? "Auspicious (उत्तम)" : (ayaNum % 2 === 0 ? "Inauspicious (अशुभ)" : "Moderate (मध्यम)");

  // 2. Vyaya = (Perimeter * 9) % 10
  const vyayaRaw = Math.round(P * 9) % 10;
  const vyayaNum = vyayaRaw === 0 ? 10 : vyayaRaw;
  const isAyaGreaterThanVyaya = ayaNum > vyayaNum;

  // 3. Yoni = (Breadth * 3) % 8
  const yoniRaw = Math.round(B * 3) % 8;
  const yoniNum = yoniRaw === 0 ? 8 : yoniRaw;
  const yoniName = YONI_NAMES[yoniNum - 1];
  const isOddYoni = yoniNum % 2 !== 0;
  const yoniGrade: "Auspicious (उत्तम)" | "Inauspicious (अशुभ)" = isOddYoni ? "Auspicious (उत्तम)" : "Inauspicious (अशुभ)";

  // 4. Vāstu Nakshatra = (Perimeter * 8) % 27
  const nakRaw = Math.round(P * 8) % 27;
  const nakNum = nakRaw === 0 ? 27 : nakRaw;
  const vastuNakName = NAKSHATRAS[nakNum - 1]?.sanskritName || "Ashwini";

  // 5. Āyus (Longevity) = (Perimeter * 27) % 100
  const ayusRaw = Math.round(P * 27) % 100;
  const ayusYears = ayusRaw === 0 ? 100 : ayusRaw;

  // 6. Vāra & Tithi
  const varaIndex = Math.round(P * 9) % 7;
  const varaName = VARA_NAMES[varaIndex];
  const tithiNum = (Math.round(P * 9) % 30) || 30;
  const tithiName = `Tithi ${tithiNum}`;

  // 7. Janma Tara Compatibility Matching
  let taraType: "Sampat (Wealth)" | "Kshema (Safety)" | "Sadhaka (Success)" | "Mitra (Friend)" | "Parama Mitra (Supreme Friend)" | "Janma (Body/Self)" | "Vipat (Danger)" | "Pratyak (Obstacle)" | "Vadha (Destruction)" = "Sampat (Wealth)";
  let isFavorable = true;
  let taraVerdict = "Harmonious energetic alignment.";

  const nativeNak = nativeJanmaNakshatraName || "Ashwini";
  const nativeIdx = NAKSHATRAS.findIndex((n) => n.sanskritName.toLowerCase().includes(nativeNak.toLowerCase()) || nativeNak.toLowerCase().includes(n.sanskritName.toLowerCase()));
  const vastuIdx = nakNum - 1;

  if (nativeIdx !== -1) {
    const diff = (vastuIdx - nativeIdx + 27) % 27;
    const taraNumber = (diff % 9) + 1;

    switch (taraNumber) {
      case 1:
        taraType = "Janma (Body/Self)";
        isFavorable = true;
        taraVerdict = "Janma Tara: Deep physical and mental connection with the space.";
        break;
      case 2:
        taraType = "Sampat (Wealth)";
        isFavorable = true;
        taraVerdict = "✨ Sampat Tara: Generates immense financial expansion and continuous prosperity!";
        break;
      case 3:
        taraType = "Vipat (Danger)";
        isFavorable = false;
        taraVerdict = "⚠️ Vipat Tara: May trigger unexpected hurdles or stress for the native.";
        break;
      case 4:
        taraType = "Kshema (Safety)";
        isFavorable = true;
        taraVerdict = "✨ Kshema Tara: Provides profound security, health, and family well-being!";
        break;
      case 5:
        taraType = "Pratyak (Obstacle)";
        isFavorable = false;
        taraVerdict = "⚠️ Pratyak Tara: Delays in project completion and occasional friction.";
        break;
      case 6:
        taraType = "Sadhaka (Success)";
        isFavorable = true;
        taraVerdict = "✨ Sadhaka Tara: Supercharges accomplishment, spiritual focus, and career goals!";
        break;
      case 7:
        taraType = "Vadha (Destruction)";
        isFavorable = false;
        taraVerdict = "⚠️ Vadha Tara: Energy drainage; requires Vastu Yantra and copper grounding.";
        break;
      case 8:
        taraType = "Mitra (Friend)";
        isFavorable = true;
        taraVerdict = "✨ Mitra Tara: Harmonious social relationships, ease, and domestic joy!";
        break;
      case 9:
        taraType = "Parama Mitra (Supreme Friend)";
        isFavorable = true;
        taraVerdict = "✨ Parama Mitra Tara: Supreme fortune, divine grace, and effortless expansion!";
        break;
    }
  }

  let overallAyadiVerdict = "✅ Āyādi Shadvarga is highly harmonious!";
  if (!isAyaGreaterThanVyaya) {
    overallAyadiVerdict = "⚠️ Caution: Vyaya (Expenditure) exceeds Āya (Income). Slightly alter dimension by +1 or -1 foot.";
  } else if (!isFavorable) {
    overallAyadiVerdict = `⚠️ Caution: Vastu Nakshatra (${vastuNakName}) falls in ${taraType} for your birth star (${nativeNak}). Consider adjusting dimensions.`;
  }

  return {
    lengthFeet: L,
    breadthFeet: B,
    perimeterFeet: P,
    areaSqFeet: Area,
    lengthHasta: lHasta,
    breadthHasta: bHasta,
    perimeterHasta: pHasta,
    ayaNumber: ayaNum,
    ayaName,
    ayaGrade,
    vyayaNumber: vyayaNum,
    isAyaGreaterThanVyaya,
    yoniNumber: yoniNum,
    yoniName,
    yoniDirection: yoniName.split(" - ")[1] || "East",
    yoniGrade,
    vastuNakshatraNumber: nakNum,
    vastuNakshatraName: vastuNakName,
    ayusLongevityYears: ayusYears,
    varaName,
    tithiName,
    janmaTaraCompatibility: {
      nativeJanmaNakshatra: nativeNak,
      taraType,
      isFavorable,
      verdict: taraVerdict,
    },
    overallAyadiVerdict,
  };
}

// ============================================================================
// 4. ASHTAKAVARGA DIRECTIONAL POWER ANALYZER (SAV DIK-BALA)
// ============================================================================

export function calculateAshtakavargaVastuStrength(
  sarvashtakavargaPoints: number[] = [28, 30, 32, 29, 31, 33, 27, 34, 30, 29, 32, 28]
): AshtakavargaVastuStrength {
  const sav = sarvashtakavargaPoints.length === 12
    ? sarvashtakavargaPoints
    : [28, 30, 32, 29, 31, 33, 27, 34, 30, 29, 32, 28];

  const eastSAV = (sav[0] || 28) + (sav[4] || 31) + (sav[8] || 30);
  const southSAV = (sav[1] || 30) + (sav[5] || 33) + (sav[9] || 29);
  const westSAV = (sav[2] || 32) + (sav[6] || 27) + (sav[10] || 32);
  const northSAV = (sav[3] || 29) + (sav[7] || 34) + (sav[11] || 28);

  const scores = [
    { dir: "East (Purva)" as VastuDirection, score: eastSAV, theme: "Leadership, Government Authority, Vitality & Social Influence" },
    { dir: "South (Dakshina)" as VastuDirection, score: southSAV, theme: "Material Wealth, Real Estate, Physical Stamina & Courage" },
    { dir: "West (Paschima)" as VastuDirection, score: westSAV, theme: "Commercial Gains, Large Network Profit, Strategic Partnerships" },
    { dir: "North (Uttara)" as VastuDirection, score: northSAV, theme: "Liquid Cash, High Learning, Kuber Treasures & Intellectual Fortune" },
  ];

  scores.sort((a, b) => b.score - a.score);
  const peak = scores[0];
  const lowest = scores[scores.length - 1];

  return {
    eastSAV,
    southSAV,
    westSAV,
    northSAV,
    peakDirection: peak.dir,
    peakDirectionTheme: `✨ Peak SAV Direction (${peak.score} Bindus): ${peak.theme}. Optimal for main entrance, active office, or study.`,
    vulnerableDirection: lowest.dir,
    vulnerableDirectionWarning: `⚠️ Energetically Sensitive Direction (${lowest.score} Bindus). Protect this sector from cuts, heavy garbage, or clutter.`,
  };
}

// ============================================================================
// 5. MARMA SUTRA & PIERCING DETECTOR
// ============================================================================

export function detectMarmaPiercing(placements: VastuRoomPlacement[]): string[] {
  const alerts: string[] = [];

  for (const p of placements) {
    if (p.row >= 3 && p.row <= 5 && p.col >= 3 && p.col <= 5) {
      if (["toilet", "kitchen", "staircase", "water_tank_overhead", "septic_tank"].includes(p.roomType)) {
        alerts.push(`🚨 CRITICAL BRAHMASTHANA PIERCING: '${p.customLabel}' placed inside the sacred core (${p.padaName}). Relocate immediately to preserve household Prana.`);
      }
    }

    if ((p.row === p.col || p.row + p.col === 8) && ["toilet", "septic_tank"].includes(p.roomType)) {
      alerts.push(`⚠️ MARMA SUTRA INTERSECTION: '${p.customLabel}' intersects a vital diagonal energy axis (Karna Sutra). Use brass/copper grounding strips.`);
    }

    if (p.row <= 1 && p.col >= 7 && ["toilet", "kitchen", "septic_tank", "staircase"].includes(p.roomType)) {
      alerts.push(`🚨 ISHANYA (NE) WATER CORRUPTION: '${p.customLabel}' placed in the North-East portal causes severe dissipation of wealth and mental clarity.`);
    }
  }

  return alerts;
}

// ============================================================================
// 6. JAIMINI ARUDHA VASTU ALIGNMENT (AL, UL, A7, A10 DIRECTIONAL MATRIX)
// ============================================================================

export function getRashiCompassDirection(signIndex: number): VastuDirection {
  // Fire Triad (0: Aries, 4: Leo, 8: Sagittarius) -> East (Purva)
  if ([0, 4, 8].includes(signIndex)) return "East (Purva)";
  // Earth Triad (1: Taurus, 5: Virgo, 9: Capricorn) -> South (Dakshina)
  if ([1, 5, 9].includes(signIndex)) return "South (Dakshina)";
  // Air Triad (2: Gemini, 6: Libra, 10: Aquarius) -> West (Paschima)
  if ([2, 6, 10].includes(signIndex)) return "West (Paschima)";
  // Water Triad (3: Cancer, 7: Scorpio, 11: Pisces) -> North (Uttara)
  return "North (Uttara)";
}

export function calculateJaiminiArudhaVastu(ephem: EphemerisResult): JaiminiVastuReport {
  const padas = calculateArudhaPadas(ephem);
  const alPada = padas[0]; // AL (Pada 1)
  const ulPada = padas[11]; // UL (Pada 12)
  const a7Pada = padas[6]; // A7 (Pada 7)
  const a10Pada = padas[9]; // A10 (Pada 10)

  // 11th and 12th from AL (Gain & Loss directions)
  const gainSignIdx = (alPada.padaSignIndex + 10) % 12;
  const gainSign = RASHI_NAMES[gainSignIdx];
  const gainDir = getRashiCompassDirection(gainSignIdx);

  const lossSignIdx = (alPada.padaSignIndex + 11) % 12;
  const lossSign = RASHI_NAMES[lossSignIdx];
  const lossDir = getRashiCompassDirection(lossSignIdx);

  // 2nd from UL (Sustenance of Marriage)
  const sustenanceSignIdx = (ulPada.padaSignIndex + 1) % 12;
  const sustenanceSign = RASHI_NAMES[sustenanceSignIdx];
  const sustenanceDir = getRashiCompassDirection(sustenanceSignIdx);

  const arudhaLagna: JaiminiArudhaVastuInfo = {
    code: "AL",
    name: "Arudha Lagna (Public Facade & Wealth Portal)",
    sanskritName: "आरूढ़ लग्न",
    houseNumberInD1: alPada.padaHouse,
    signName: alPada.padaSign.englishName,
    signLord: alPada.lordName,
    direction: getRashiCompassDirection(alPada.padaSignIndex),
    purpose: "Governs public reputation, social stature, main residence facade, and perceived wealth.",
    spatialRecommendation: `Align main entrance, living room, public reception, or primary house nameplate with **${getRashiCompassDirection(alPada.padaSignIndex)}** to project high stature and invite noble visitors.`,
    gainZone11th: {
      signName: gainSign.englishName,
      direction: gainDir,
      description: `11th from AL (${gainSign.englishName}) in **${gainDir}**: Primary financial inflow and wealth accumulation zone. Keep bright, clean, and energize with cash locker/investments.`,
    },
    lossZone12th: {
      signName: lossSign.englishName,
      direction: lossDir,
      description: `12th from AL (${lossSign.englishName}) in **${lossDir}**: Expenditure and dissipation zone. Keep clutter-free, avoid heavy open safes or gambling items.`,
    },
  };

  const upapadaLagna: JaiminiArudhaVastuInfo = {
    code: "UL",
    name: "Upapada Lagna (Marital Sanctum & Spouse Vitality)",
    sanskritName: "उपपद लग्न (गौण पद)",
    houseNumberInD1: ulPada.padaHouse,
    signName: ulPada.padaSign.englishName,
    signLord: ulPada.lordName,
    direction: getRashiCompassDirection(ulPada.padaSignIndex),
    purpose: "Governs marital harmony, bedroom sanctity, spouse's longevity, and domestic peace.",
    spatialRecommendation: `Locate Master Bedroom or marital bed in or facing **${getRashiCompassDirection(ulPada.padaSignIndex)}**. Ensure **NO toilets, dustbins, or sharp objects** in this zone to prevent domestic disputes.`,
    gainZone11th: {
      signName: sustenanceSign.englishName,
      direction: sustenanceDir,
      description: `2nd from UL (${sustenanceSign.englishName}) in **${sustenanceDir}**: Governs sustenance of marital bond, nutrition, and peaceful coexistence.`,
    },
  };

  const daraPada: JaiminiArudhaVastuInfo = {
    code: "A7",
    name: "Dara Pada (Commercial Partnerships & Alliances)",
    sanskritName: "दारा पद",
    houseNumberInD1: a7Pada.padaHouse,
    signName: a7Pada.padaSign.englishName,
    signLord: a7Pada.lordName,
    direction: getRashiCompassDirection(a7Pada.padaSignIndex),
    purpose: "Governs business co-founders, trade clients, and contractual agreements.",
    spatialRecommendation: `Place meeting rooms, client sofas, or contract signing desks in **${getRashiCompassDirection(a7Pada.padaSignIndex)}**.`,
  };

  const rajyaPada: JaiminiArudhaVastuInfo = {
    code: "A10",
    name: "Rajya Pada (Career Command & Authority)",
    sanskritName: "राज्य पद",
    houseNumberInD1: a10Pada.padaHouse,
    signName: a10Pada.padaSign.englishName,
    signLord: a10Pada.lordName,
    direction: getRashiCompassDirection(a10Pada.padaSignIndex),
    purpose: "Governs professional reputation, executive leadership, promotions, and career authority.",
    spatialRecommendation: `Face **${getRashiCompassDirection(a10Pada.padaSignIndex)}** while seated at your work desk or place corporate awards, certificates, and seals here.`,
  };

  const masterJaiminiVastuGuidance = `Native's Arudha Lagna (AL) in **${arudhaLagna.signName} (H${arudhaLagna.houseNumberInD1})** projects social power through **${arudhaLagna.direction}**, with supreme financial gain zone in **${gainDir} (11th from AL)**. Upapada Lagna (UL) in **${upapadaLagna.signName} (H${upapadaLagna.houseNumberInD1})** anchors marital longevity in **${upapadaLagna.direction}**.`;

  return {
    arudhaLagna,
    upapadaLagna,
    daraPada,
    rajyaPada,
    masterJaiminiVastuGuidance,
  };
}

// ============================================================================
// 7. MASTER VASTU SYNTHESIS & REPORT GENERATION
// ============================================================================

export function calculateVastuSynthesis(
  placements: VastuRoomPlacement[],
  lengthFeet: number = 40,
  breadthFeet: number = 30,
  nativeJanmaNakshatra?: string,
  sarvashtakavargaPoints?: number[],
  ephemeris?: EphemerisResult
): VastuSynthesisReport {
  const evaluatedPlacements = placements.map((p) =>
    evaluateRoomPlacement(p.roomType, p.row, p.col, p.customLabel)
  );

  let totalScore = 0;
  if (evaluatedPlacements.length > 0) {
    const sum = evaluatedPlacements.reduce((acc, curr) => acc + curr.complianceScore, 0);
    totalScore = Math.round(sum / evaluatedPlacements.length);
  } else {
    totalScore = 80;
  }

  let grade: "Vaastu Siddha (परम शुभ)" | "Balanced (शुभ)" | "Needs Remediation (सुधार योग्य)" | "High Vastu Dosa (दोषयुक्त)" = "Balanced (शुभ)";
  if (totalScore >= 85) grade = "Vaastu Siddha (परम शुभ)";
  else if (totalScore >= 70) grade = "Balanced (शुभ)";
  else if (totalScore >= 50) grade = "Needs Remediation (सुधार योग्य)";
  else grade = "High Vastu Dosa (दोषयुक्त)";

  let waterScore = 80;
  let fireScore = 80;
  let earthScore = 80;
  let airScore = 80;
  let spaceScore = 80;

  for (const p of evaluatedPlacements) {
    if (p.direction === "Northeast (Ishanya)" || p.direction === "North (Uttara)") {
      if (p.grade === "Defective (दोष)") waterScore -= 25;
    }
    if (p.direction === "Southeast (Agneya)" || p.direction === "South (Dakshina)") {
      if (p.grade === "Defective (दोष)") fireScore -= 25;
    }
    if (p.direction === "Southwest (Nairritya)") {
      if (p.grade === "Defective (दोष)") earthScore -= 30;
    }
    if (p.direction === "Northwest (Vayavya)" || p.direction === "West (Paschima)") {
      if (p.grade === "Defective (दोष)") airScore -= 25;
    }
    if (p.direction === "Brahmasthana (Center)") {
      if (p.grade === "Defective (दोष)") spaceScore -= 40;
    }
  }

  const effectiveNakshatra = nativeJanmaNakshatra || ephemeris?.planets?.Moon?.nakshatra?.sanskritName || "Ashwini";
  const marmaPiercingAlerts = detectMarmaPiercing(evaluatedPlacements);
  const ayadiAnalysis = calculateAyadiShadvarga(lengthFeet, breadthFeet, effectiveNakshatra);
  const ashtakavargaDirectionalPower = calculateAshtakavargaVastuStrength(sarvashtakavargaPoints);
  const jaiminiVastu = ephemeris ? calculateJaiminiArudhaVastu(ephemeris) : undefined;

  const topNonDestructiveRemedies: string[] = [
    "🌿 North-East (Īśānya) Healing: Keep clean, install a water fountain or brass bowl with holy water, and install a 3D Siddha Meru Sri Yantra.",
    "🔥 South-East (Āgneya) Energy Balancing: Place a pure copper strip under kitchen cooktops and illuminate with a warm 0-watt red/orange night lamp.",
    "🛡️ South-West (Nairṛtya) Stability Anchor: Use heavy solid wood furnishings, earthy ochre wall shades, and bury a lead wire or plate along the SW skirting.",
    "💨 North-West (Vāyavya) Movement Balance: Hang a 6-pipe silver metallic wind chime to stimulate beneficial social networking and travel opportunities.",
    "🪙 North (Uttara) Kuber Activation: Place a consecrated Kuber Yantra facing South and paint walls in soothing mint green or pistachio tones.",
  ];

  let masterVastuGuidance = `This space operates at **${totalScore}% Vastu Compliance (${grade})**. 
The native's personal **Dhana-Disha (Peak Ashtakavarga Wealth Direction)** is **${ashtakavargaDirectionalPower.peakDirection}** with ${ashtakavargaDirectionalPower.eastSAV}–${ashtakavargaDirectionalPower.northSAV} bindu strength.
Āyādi Shadvarga confirms **Āya (${ayadiAnalysis.ayaNumber}) ${ayadiAnalysis.isAyaGreaterThanVyaya ? ">" : "<"} Vyaya (${ayadiAnalysis.vyayaNumber})**, with building Nakshatra **${ayadiAnalysis.vastuNakshatraName}** forming **${ayadiAnalysis.janmaTaraCompatibility.taraType}** with native's Janma Nakshatra.`;

  if (jaiminiVastu) {
    masterVastuGuidance += ` Jaimini Arudha Lagna (AL) in **${jaiminiVastu.arudhaLagna.signName}** activates public prestige in **${jaiminiVastu.arudhaLagna.direction}**, while Upapada Lagna (UL) in **${jaiminiVastu.upapadaLagna.signName}** stabilizes marital longevity in **${jaiminiVastu.upapadaLagna.direction}**.`;
  }

  return {
    overallScore: totalScore,
    grade,
    placements: evaluatedPlacements,
    elementalBalance: {
      waterScore: Math.max(10, Math.min(100, waterScore)),
      fireScore: Math.max(10, Math.min(100, fireScore)),
      earthScore: Math.max(10, Math.min(100, earthScore)),
      airScore: Math.max(10, Math.min(100, airScore)),
      spaceScore: Math.max(10, Math.min(100, spaceScore)),
    },
    marmaPiercingAlerts,
    ashtakavargaDirectionalPower,
    ayadiAnalysis,
    jaiminiVastu,
    topNonDestructiveRemedies,
    masterVastuGuidance,
  };
}

