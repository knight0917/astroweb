/**
 * Vimshottari Dasha Engine (120-Year Parashari Predictive Cycle — Complete 6-Level Hierarchy)
 * Computes all 6 classical levels ("Until Last"):
 *   1. Mahadasha (MD — Major Period, Years)
 *   2. Antardasha / Bhukti (AD — Sub-Period, Months/Days)
 *   3. Pratyantardasha (PD — Sub-Sub-Period, Weeks/Days) [BPHS Ch. 61]
 *   4. Sookshma / Sukshmantar Dasha (SD — 4th Level, Days/Hours) [BPHS Ch. 62]
 *   5. Prana Dasha (PrD — 5th Level, Hours/Minutes) [BPHS Ch. 63]
 *   6. Deha Dasha (DD — 6th & Final Level, Minutes/Seconds) [Sanjay Rath, Vimsottari & Udu Dasas Sec. 1.1.1f & 5.4.4]
 *
 * Classical Book References:
 *   - Maharshi Parashara, Brihat Parashara Hora Shastra (BPHS), Chapters 46, 61, 62 & 63
 *   - Dr. Shanker Adawal, Encyclopedia of Vedic Astrology: Dasha Systems, pp. 242–243, 322–348
 *   - Pt. Sanjay Rath, Vimsottari and Udu Dasas, Sec. 1.1.1(e)-(f) p. 12, Sec. 5.4.4 p. 60, Sec. 6.3 p. 107
 */

export interface DashaLord {
  id: string;
  name: string;
  hindiName: string;
  symbol: string;
  years: number;
  color: string;
}

export const DASHA_LORDS: DashaLord[] = [
  { id: "Ketu", name: "Ketu", hindiName: "केतु", symbol: "☋", years: 7, color: "text-purple-400 bg-purple-950/40 border-purple-500/40" },
  { id: "Venus", name: "Venus", hindiName: "शुक्र", symbol: "♀", years: 20, color: "text-pink-300 bg-pink-950/40 border-pink-500/40" },
  { id: "Sun", name: "Sun", hindiName: "सूर्य", symbol: "☉", years: 6, color: "text-amber-400 bg-amber-950/40 border-amber-500/40" },
  { id: "Moon", name: "Moon", hindiName: "चन्द्र", symbol: "☽", years: 10, color: "text-cyan-300 bg-cyan-950/40 border-cyan-500/40" },
  { id: "Mars", name: "Mars", hindiName: "मंगल", symbol: "♂", years: 7, color: "text-red-400 bg-red-950/40 border-red-500/40" },
  { id: "Rahu", name: "Rahu", hindiName: "राहु", symbol: "☊", years: 18, color: "text-indigo-400 bg-indigo-950/40 border-indigo-500/40" },
  { id: "Jupiter", name: "Jupiter", hindiName: "गुरु", symbol: "♃", years: 16, color: "text-yellow-300 bg-yellow-950/40 border-yellow-500/40" },
  { id: "Saturn", name: "Saturn", hindiName: "शनि", symbol: "♄", years: 19, color: "text-blue-400 bg-blue-950/40 border-blue-500/40" },
  { id: "Mercury", name: "Mercury", hindiName: "बुध", symbol: "☿", years: 17, color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/40" },
];

const LORD_INDEX_BY_ID: Record<string, number> = {
  Ketu: 0,
  Venus: 1,
  Sun: 2,
  Moon: 3,
  Mars: 4,
  Rahu: 5,
  Jupiter: 6,
  Saturn: 7,
  Mercury: 8,
};

/**
 * Level 6 (Final Level): Deha Dasha (देह दशा)
 * Formula: Duration(DD) = (Duration(PrD) * Years(DD_Lord)) / 120
 * Timescale: ~59.2 seconds (Sun^6) to ~22.55 hours (Venus^6)
 */
export interface DehadashaNode {
  lord: DashaLord;
  startDate: Date;
  endDate: Date;
  durationMinutes: number;
  durationSeconds: number;
  durationFormatted: string;
}

/**
 * Level 5: Prana Dasha (प्राण दशा — BPHS Ch. 63)
 * Formula: Duration(PrD) = (Duration(SD) * Years(PrD_Lord)) / 120
 * Timescale: ~19.72 minutes (Sun^5) to ~5.64 days (Venus^5)
 */
export interface PranadashaNode {
  lord: DashaLord;
  startDate: Date;
  endDate: Date;
  durationHours: number;
  durationMinutes: number;
  durationFormatted: string;
  dehadashas?: DehadashaNode[];
}

/**
 * Level 4: Sookshma / Sukshmantar Dasha (सूक्ष्म दशा — BPHS Ch. 62)
 * Formula: Duration(SD) = (Duration(PD) * Years(SD_Lord)) / 120
 * Timescale: ~6.57 hours (Sun^4) to ~33.82 days (Venus^4)
 */
export interface SookshmadashaNode {
  lord: DashaLord;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  durationHours: number;
  durationFormatted: string;
  pranadashas?: PranadashaNode[];
}

/**
 * Level 3: Pratyantardasha (प्रत्यन्तर्दशा — BPHS Ch. 61)
 * Formula: Duration(PD) = (Duration(AD) * Years(PD_Lord)) / 120
 */
export interface PratyantardashaNode {
  lord: DashaLord;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  sookshmadashas?: SookshmadashaNode[];
}

export interface AntardashaNode {
  lord: DashaLord;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  pratyantardashas: PratyantardashaNode[];
}

export interface MahadashaNode {
  lord: DashaLord;
  startDate: Date;
  endDate: Date;
  durationYears: number;
  antardashas: AntardashaNode[];
}

export interface ActiveDashaPeriod {
  mahadasha: DashaLord;
  antardasha: DashaLord;
  pratyantardasha: DashaLord;
  sookshmadasha: DashaLord;
  pranadasha: DashaLord;
  dehadasha: DashaLord;
  mdStart: Date;
  mdEnd: Date;
  adStart: Date;
  adEnd: Date;
  pdStart: Date;
  pdEnd: Date;
  sdStart: Date;
  sdEnd: Date;
  prdStart: Date;
  prdEnd: Date;
  ddStart: Date;
  ddEnd: Date;
  percentageCompleteMD: number;
  percentageCompleteAD: number;
  percentageCompletePD: number;
  percentageCompleteSD: number;
  percentageCompletePrD: number;
  percentageCompleteDD: number;
  activeSookshmadashas: SookshmadashaNode[];
  activePranadashas: PranadashaNode[];
  activeDehadashas: DehadashaNode[];
  bphsPdEffect: string;
  bphsSdEffect: string;
  bphsPrdEffect: string;
  bphsDdEffect: string;
}

export interface VimshottariDashaResult {
  birthDate: Date;
  moonLongitude: number;
  startingNakshatraIndex: number;
  startingNakshatraName: string;
  startingLord: DashaLord;
  balanceYears: number;
  balanceFormatted: string;
  mahadashas: MahadashaNode[];
  activeDasha: ActiveDashaPeriod | null;
}

const NAKSHATRA_NAMES = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Svati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const DAYS_IN_YEAR = 365.2425;

/**
 * Formats sub-period millisecond span into human-readable d/h/m/s string
 */
export function formatSubPeriodDuration(durationMs: number): string {
  const totalSeconds = Math.max(1, Math.round(durationMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  if (minutes > 0) {
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  }
  return `${seconds}s`;
}

/**
 * Classical BPHS Chapter 61 (Pratyantardasha in Antardasha),
 * Chapter 62 (Sukshmantar/Sookshma Dasha in Pratyantardasha),
 * Chapter 63 (Prana Dasha in Sookshma Dasha), and
 * Pt. Sanjay Rath's Udu Dasas (Deha Dasha 6th-level physical trigger)
 */
const BPHS_CH61_PD_EFFECTS: Record<string, string> = {
  "Sun-Sun": "Arguments, financial caution, headache or heat; mitigated if Sun is in Trikona or auspicious Varga (BPHS Ch. 61.2).",
  "Sun-Moon": "Mental agitation or domestic friction; requires calm emotional equilibrium (BPHS Ch. 61.3).",
  "Sun-Mars": "High pitta energy, confrontation with authority or fire/weapon caution (BPHS Ch. 61.4).",
  "Sun-Rahu": "Phlegmatic sensitivity, sudden administrative challenges, mental restlessness (BPHS Ch. 61.5).",
  "Sun-Jupiter": "Victory in undertakings, increase in wealth, gold, garments, and authoritative favor (BPHS Ch. 61.6).",
  "Sun-Saturn": "Heavy workload, fatigue, expense on dependents or property maintenance (BPHS Ch. 61.7).",
  "Sun-Mercury": "Cordial relations with kinsmen, intellectual clarity, pious deeds, respect from authority (BPHS Ch. 61.8).",
  "Sun-Ketu": "Vigilance regarding rivals, sudden expenditures, and vitality preservation (BPHS Ch. 61.9).",
  "Sun-Venus": "Moderate financial gains, aesthetic comforts, and balanced social diplomacy (BPHS Ch. 61.10).",
  "Moon-Moon": "Acquisition of land, wealth, recognition from authority, and domestic sweetness (BPHS Ch. 61.11).",
  "Moon-Mars": "Discretion, public respect, wealth growth, though vigilance against competitors is advised (BPHS Ch. 61.12).",
  "Moon-Rahu": "Gains through authority when unafflicted; guard against stress if Rahu is afflicted (BPHS Ch. 61.13).",
  "Moon-Jupiter": "Increase in dignity, glory, higher knowledge from preceptors, and prosperity (BPHS Ch. 61.14).",
  "Moon-Saturn": "Bilious sensitivity, temporary delays in recognition requiring patience (BPHS Ch. 61.15).",
  "Moon-Mercury": "Success in education, conveyances, family joy, and steady progress (BPHS Ch. 61.16).",
  "Moon-Ketu": "Spiritual detachment, need for harmony with scholars/elders and health care (BPHS Ch. 61.17).",
  "Moon-Venus": "Gain of wealth, domestic harmony, sweet preparations, and artistic fulfillment (BPHS Ch. 61.18).",
  "Moon-Sun": "Gain of happiness, grains, garments, and victory across ventures (BPHS Ch. 61.19).",
  "Mars-Mars": "High competitive drive; guard against blood/pitta heat and rash disputes (BPHS Ch. 61.20).",
  "Mars-Rahu": "Sudden administrative shifts and dietary/digestive vigilance required (BPHS Ch. 61.21).",
  "Mars-Jupiter": "Need for measured patience in plans and family matters before expansion (BPHS Ch. 61.22).",
  "Mars-Saturn": "Workplace friction and heavy duties requiring disciplined endurance (BPHS Ch. 61.23).",
  "Mars-Mercury": "Guard against nervous haste and contractual disputes (BPHS Ch. 61.24).",
  "Mars-Ketu": "Physical fatigue and need for caution with sharp instruments or fire (BPHS Ch. 61.25).",
  "Mars-Venus": "Digestive care and restraint in luxury expenses (BPHS Ch. 61.26).",
  "Mars-Sun": "Increase in landed property, wealth, visits of friends, and all-round satisfaction (BPHS Ch. 61.27).",
  "Mars-Moon": "Gains from southern direction, emotional warmth, and success in ventures (BPHS Ch. 61.28).",
  "Rahu-Rahu": "Restless ambition and physical sensitivity requiring grounded discipline (BPHS Ch. 61.29).",
  "Rahu-Jupiter": "Reverence everywhere, acquisition of conveyances, and expansion of wealth (BPHS Ch. 61.30).",
  "Rahu-Saturn": "Vata/rheumatic care and heavy institutional responsibilities (BPHS Ch. 61.31).",
  "Rahu-Mercury": "Gain in commercial ventures and fortune through spouse/partnerships (BPHS Ch. 61.32).",
  "Rahu-Ketu": "Sudden obstacles and mental restlessness requiring spiritual grounding (BPHS Ch. 61.33).",
  "Rahu-Venus": "Need for harmony in marriage/family and careful travel planning (BPHS Ch. 61.34).",
  "Rahu-Sun": "Vigilance against fevers, rivalries, and authoritative friction (BPHS Ch. 61.35).",
  "Rahu-Moon": "Emotional fluctuations and paternal care (BPHS Ch. 61.36).",
  "Rahu-Mars": "Blood/pitta vigilance and avoidance of impulsive conflicts (BPHS Ch. 61.37).",
  "Jupiter-Jupiter": "Acquisition of gold, expansion of wealth, wisdom, and dharmic grace (BPHS Ch. 61.38).",
  "Jupiter-Saturn": "Increase in lands, conveyances, agricultural/structural assets (BPHS Ch. 61.39).",
  "Jupiter-Mercury": "Success in education, acquisition of gems/clothes, and scholarly friendships (BPHS Ch. 61.40).",
  "Jupiter-Ketu": "Caution near water and protection of valuables; strong spiritual insight (BPHS Ch. 61.41).",
  "Jupiter-Venus": "Multiple branches of learning, gold, ornaments, and family well-being (BPHS Ch. 61.42).",
  "Jupiter-Sun": "Gains from government/authority, parents, and widespread respect (BPHS Ch. 61.43).",
  "Jupiter-Moon": "Freedom from distress, gain of wealth, conveyances, and venture success (BPHS Ch. 61.44).",
  "Jupiter-Mars": "Digestive/pitta care and avoidance of heated arguments (BPHS Ch. 61.45).",
  "Jupiter-Rahu": "Care in managing subordinates and avoiding speculative risks (BPHS Ch. 61.46).",
  "Saturn-Saturn": "Physical endurance tests and careful management of staff/subordinates (BPHS Ch. 61.47).",
  "Saturn-Mercury": "Need for clear accounting and steady intellectual focus (BPHS Ch. 61.48).",
  "Saturn-Ketu": "Fatigue and withdrawal; best channeled into meditation and structural review (BPHS Ch. 61.49).",
  "Saturn-Venus": "Fulfillment of ambitions, family well-being, and tangible financial gains (BPHS Ch. 61.50).",
  "Saturn-Sun": "Conferment of administrative responsibility mixed with family/heat stress (BPHS Ch. 61.51).",
  "Saturn-Moon": "Inauguration of major projects, intellectual growth, but watch extravagant spending (BPHS Ch. 61.52).",
  "Saturn-Mars": "Vata-pitta balance required; avoid rash confrontations (BPHS Ch. 61.53).",
  "Saturn-Rahu": "Foreign travel or relocation triggers; safeguard assets and health (BPHS Ch. 61.54).",
  "Saturn-Jupiter": "Requires careful financial stewardship and domestic patience (BPHS Ch. 61.55).",
  "Mercury-Mercury": "Gain of intelligence, academic mastery, wealth, and fine apparel (BPHS Ch. 61.56).",
  "Mercury-Ketu": "Digestive and ophthalmic care; sharp intuitive breakthroughs (BPHS Ch. 61.57).",
  "Mercury-Venus": "Gains from northern direction, governmental authority, and artistic success (BPHS Ch. 61.58).",
  "Mercury-Sun": "Vitality and cardiac care needed alongside administrative duties (BPHS Ch. 61.59).",
  "Mercury-Moon": "Marriage/relationship harmony, gain of property, and all-round enjoyment (BPHS Ch. 61.60).",
  "Mercury-Mars": "Religious/dharmic drive and wealth increase; caution with fire/sharp tools (BPHS Ch. 61.61).",
  "Mercury-Rahu": "Diplomatic care needed in domestic and governmental communications (BPHS Ch. 61.62).",
  "Mercury-Jupiter": "Conferment of high authority, reverence from leaders, education, and wisdom (BPHS Ch. 61.63).",
  "Mercury-Saturn": "Vata-pitta health care and conservative financial management (BPHS Ch. 61.64).",
  "Ketu-Ketu": "Sudden shifts or foreign journeys; requires spiritual steadiness (BPHS Ch. 61.65).",
  "Ketu-Venus": "Eye/headache care and prudence in cross-cultural dealings (BPHS Ch. 61.66).",
  "Ketu-Sun": "Avoidance of heated debates and protection of vitality (BPHS Ch. 61.67).",
  "Ketu-Moon": "Digestive/water care and clear communication to prevent misunderstandings (BPHS Ch. 61.68).",
  "Ketu-Mars": "Caution with fire, tools, and subordinate management (BPHS Ch. 61.69).",
  "Ketu-Rahu": "Avoidance of speculative risks and maintaining workplace harmony (BPHS Ch. 61.70).",
  "Ketu-Jupiter": "Conservation of wealth and patience in domestic affairs (BPHS Ch. 61.71).",
  "Ketu-Saturn": "Modest gains through perseverance; prioritize physical rest (BPHS Ch. 61.72).",
  "Ketu-Mercury": "Need for calm concentration in studies and commercial contracts (BPHS Ch. 61.73).",
  "Venus-Venus": "Gains of fine garments, conveyances, gems, and harmonious companionship (BPHS Ch. 61.74).",
  "Venus-Sun": "Headache/heat care and measured diplomacy with authority (BPHS Ch. 61.75).",
  "Venus-Moon": "Family blessings, gain of garments/honors, and acquisition of authority (BPHS Ch. 61.76).",
  "Venus-Mars": "Blood/pitta care and patience in passionate undertakings (BPHS Ch. 61.77).",
  "Venus-Rahu": "Domestic diplomacy and careful handling of official matters (BPHS Ch. 61.78).",
  "Venus-Jupiter": "Acquisition of high status, wealth, garments, gems, and conveyances (BPHS Ch. 61.79).",
  "Venus-Saturn": "Gains of practical assets, iron/land/grains, with steady physical effort (BPHS Ch. 61.80).",
  "Venus-Mercury": "Gains of wealth, knowledge, governmental authority, and shared profits (BPHS Ch. 61.81).",
  "Venus-Ketu": "Occasional sudden gains alongside travel or relocation adjustments (BPHS Ch. 61.82).",
};

const BPHS_CH62_SD_EFFECTS: Record<string, string> = {
  "Sun-Sun": "Travel away from home or positional shift; maintain vitality (BPHS Ch. 62.2).",
  "Sun-Moon": "Devotion to deities, pious deeds, and warm support from friends (BPHS Ch. 62.3).",
  "Sun-Mars": "Guard against impulsive conflict and pitta heat (BPHS Ch. 62.4).",
  "Sun-Rahu": "Religious inclination mixed with need for caution against toxin/fire (BPHS Ch. 62.5).",
  "Sun-Jupiter": "Recognition by government, commendation by officials, and leadership grace (BPHS Ch. 62.6).",
  "Sun-Saturn": "Relocation pressure and heavy duties; uphold ethical conduct (BPHS Ch. 62.7).",
  "Sun-Mercury": "Gains of fine apparel, pleasant companionship, and sudden success in ventures (BPHS Ch. 62.8).",
  "Sun-Ketu": "Glory through spouse and team, with comfort from assistants (BPHS Ch. 62.9).",
  "Sun-Venus": "Happiness from children, friends, and spouse; acquisition of property (BPHS Ch. 62.10).",
  "Moon-Moon": "Gain of ornaments, land, reverence, and recognition from authority (BPHS Ch. 62.11).",
  "Moon-Jupiter": "Opulence, glory, family celebration, and gain of property (BPHS Ch. 62.14).",
  "Moon-Mercury": "Reverence from authority, gain of wealth and conveyances from afar (BPHS Ch. 62.16).",
  "Moon-Venus": "Auspicious celebrations, land, garments, ornaments, and reputation (BPHS Ch. 62.18).",
  "Mars-Jupiter": "Devotion to deities, Mantra Siddhi, public respect, and enjoyment (BPHS Ch. 62.22).",
  "Mars-Saturn": "Relief from constraints, happiness from wealth, garments, and support (BPHS Ch. 62.23).",
  "Mars-Mercury": "High honors and respect, though respiratory care is advised (BPHS Ch. 62.24).",
  "Mars-Venus": "Pleasant companionship, gain of wealth and nourishment (BPHS Ch. 62.26).",
  "Mars-Moon": "Piousness, gain of wealth, and devotion to deities (BPHS Ch. 62.28).",
  "Rahu-Venus": "Relief from obstacles and gain of position and wealth (BPHS Ch. 62.34).",
  "Rahu-Sun": "Foreign settlement or travel, even temperament, and comfort of conveyances (BPHS Ch. 62.35).",
  "Rahu-Moon": "Gain of gems, money, education, devotion to prayer and good conduct (BPHS Ch. 62.36).",
  "Jupiter-Jupiter": "Banishment of sorrows, wealth growth, sacred rituals, and royal conveyances (BPHS Ch. 62.38).",
  "Jupiter-Mercury": "Success in education, sharp intellect, popularity, wealth, and domestic comfort (BPHS Ch. 62.40).",
  "Jupiter-Ketu": "Knowledge, glory, study of Shastras, Shiva worship, and devotion to Guru (BPHS Ch. 62.41).",
  "Jupiter-Venus": "Recovery of health, enjoyments, wealth growth, and family happiness (BPHS Ch. 62.42).",
  "Jupiter-Moon": "High honors, family celebrations, and public prestige (BPHS Ch. 62.44).",
  "Saturn-Mercury": "Profits in business, progress in education, increase in wealth and lands (BPHS Ch. 62.48).",
  "Saturn-Venus": "Opulence, glory, technical mastery, good health, and fulfillment of ambitions (BPHS Ch. 62.50).",
  "Saturn-Moon": "Development of intelligence, inauguration of a major project, family joy (BPHS Ch. 62.52).",
  "Saturn-Jupiter": "Acquisition of gold/wealth, public reverence, and high honors (BPHS Ch. 62.55).",
  "Mercury-Mercury": "Dawn of fortune, reverence from authority, wealth, property, and harmony (BPHS Ch. 62.56).",
  "Mercury-Venus": "Gain of conveyances, wealth, good repute, and aesthetic enjoyments (BPHS Ch. 62.58).",
  "Mercury-Moon": "Good fortune, stability of mind, property gains, and visits of friends/Guru (BPHS Ch. 62.60).",
  "Mercury-Jupiter": "Construction/home expansion, charity, opulence, and state favor (BPHS Ch. 62.63).",
  "Mercury-Saturn": "Profits in business, educational progress, wealth growth, and commitments (BPHS Ch. 62.64).",
  "Ketu-Venus": "Freedom from ailments, gain of wealth, devotion to elders, and family union (BPHS Ch. 62.66).",
  "Ketu-Moon": "Promotion in service, victory in competition, and public reputation (BPHS Ch. 62.68).",
  "Ketu-Mercury": "Dynamic social connections, overcoming rivals, and property growth (BPHS Ch. 62.73).",
  "Venus-Venus": "Overcoming competitors, enjoyments, and charitable/temple works (BPHS Ch. 62.74).",
  "Venus-Moon": "Sound health, increase in wealth, business success, and intellectual growth (BPHS Ch. 62.76).",
  "Venus-Jupiter": "Success in ventures, agricultural/commercial profits, and wealth expansion (BPHS Ch. 62.79).",
  "Venus-Mercury": "Increase in wealth with kinsmen's support, business profits, and family bliss (BPHS Ch. 62.81).",
};

const BPHS_CH63_PRD_EFFECTS: Record<string, string> = {
  "Sun-Moon": "Enjoyments, fine nourishment, development of intelligence, and generous support (BPHS Ch. 63.3).",
  "Sun-Jupiter": "Success across educational spheres, gain of wealth, and scholarly/official favor (BPHS Ch. 63.6).",
  "Sun-Mercury": "Attainment of high administrative dignity, royal honors, and fine hospitality (BPHS Ch. 63.8).",
  "Sun-Venus": "Recognition from authority, wealth growth, and family happiness (BPHS Ch. 63.10).",
  "Moon-Moon": "Happiness from family, gain of wealth and garments, and Yoga Siddhi (BPHS Ch. 63.11).",
  "Moon-Jupiter": "Religious-mindedness, forgiveness, good fortune, and reunion with loved ones (BPHS Ch. 63.14).",
  "Moon-Mercury": "High honors, executive authority, and equanimity among people (BPHS Ch. 63.16).",
  "Moon-Venus": "Supportive friendships, foreign/distant wealth gains, and comforts (BPHS Ch. 63.18).",
  "Mars-Jupiter": "Devotion to deities, gain of wealth, and competence in Mantra/spiritual practice (BPHS Ch. 63.22).",
  "Mars-Mercury": "Gains of splendid garments, ornaments, and auspicious partnerships (BPHS Ch. 63.24).",
  "Mars-Venus": "Gain of wealth, public reverence, and enjoyment of comforts (BPHS Ch. 63.26).",
  "Rahu-Jupiter": "Physical vitality, fearlessness, and acquisition of conveyances (BPHS Ch. 63.30).",
  "Rahu-Mercury": "Devotion to the preceptor, wealth through wisdom, and refined culture (BPHS Ch. 63.32).",
  "Rahu-Venus": "Success in ventures, conveyances, Shiva worship, and home building (BPHS Ch. 63.34).",
  "Rahu-Moon": "Development of mental powers, intelligence, popularity, and guidance from elders (BPHS Ch. 63.36).",
  "Jupiter-Jupiter": "Happiness, wealth expansion, Havan/sacred rites, Shiva worship, and conveyances (BPHS Ch. 63.38).",
  "Jupiter-Mercury": "Progress in education, sharp intellect, family happiness, popularity, and wealth (BPHS Ch. 63.40).",
  "Jupiter-Ketu": "Opulence, glory, mastery of Shastras, Shiva worship, and devotion to Guru (BPHS Ch. 63.41).",
  "Jupiter-Venus": "Freedom from ailments, enjoyments, wealth increase, and domestic joy (BPHS Ch. 63.42).",
  "Saturn-Mercury": "Gain of wealth and grains, business profits, and devotion to deities (BPHS Ch. 63.48).",
  "Saturn-Venus": "Enjoyments through wealth, family blessings, and auspicious ceremonies (BPHS Ch. 63.50).",
  "Saturn-Moon": "Sound health, relief, thriving strength, and spiritual devotion (BPHS Ch. 63.52).",
  "Saturn-Jupiter": "Executive command, gain of land, association with sages, and official respect (BPHS Ch. 63.55).",
  "Mercury-Mercury": "Increase in enjoyments, wealth, dharmic mindfulness, and equanimity (BPHS Ch. 63.56).",
  "Mercury-Venus": "Leadership, increase in wealth, reputation, Shiva devotion, and family joy (BPHS Ch. 63.58).",
  "Mercury-Moon": "Domestic happiness, family blessings, gain of wealth, and all-round comfort (BPHS Ch. 63.60).",
  "Mercury-Jupiter": "Sublime progress in education, wealth growth, and business profits (BPHS Ch. 63.63).",
  "Ketu-Venus": "Gain of land and conveyance, happiness, and overcoming obstacles (BPHS Ch. 63.66).",
  "Ketu-Moon": "Devotion to deities, distant journeys, and gain of wealth and happiness (BPHS Ch. 63.68).",
  "Ketu-Mercury": "Availability of comforts, fine food, and pleasant domestic environment (BPHS Ch. 63.73).",
  "Venus-Venus": "Learning, devotion to deities, satisfaction, wealth growth, and family joy (BPHS Ch. 63.74).",
  "Venus-Moon": "Devotion to deities, competence, relief through Mantras, and rising fortune (BPHS Ch. 63.76).",
  "Venus-Jupiter": "Longevity, sound health, happiness from wealth/family, and conveyances (BPHS Ch. 63.79).",
  "Venus-Mercury": "Satisfaction, reverence from authority, gains of land/wealth, and enthusiasm (BPHS Ch. 63.81).",
};

const DEHA_SOMATIC_ARCHETYPES: Record<string, string> = {
  Sun: "Surya Deha trigger: activates core vitality, spine/heart warmth, executive decisiveness, and immediate authority visibility.",
  Moon: "Chandra Deha trigger: activates autonomic/fluid balance, emotional receptivity, nourishment, and immediate public rapport.",
  Mars: "Mangala Deha trigger: activates muscular/kinetic energy, rapid action, thermal drive, and immediate technical execution.",
  Mercury: "Budha Deha trigger: activates neural/speech reflexes, analytical precision, message exchange, and swift commercial decisions.",
  Jupiter: "Guru Deha trigger: activates dhi-shakti (protective wisdom), calm discernment, ethical grace, and timely guidance.",
  Venus: "Shukra Deha trigger: activates sensory harmony, diplomatic ease, somatic relaxation, and aesthetic/relational grace.",
  Saturn: "Shani Deha trigger: activates structural discipline, skeletal/nerve steadiness, patience, and methodical endurance.",
  Rahu: "Rahu Deha trigger: activates sudden intuitive alerts, unconventional problem-solving, and rapid environmental shifts.",
  Ketu: "Ketu Deha trigger: activates razor-sharp instinct, inward detachment, micro-rectification, and spiritual centering.",
};

/**
 * Returns the classical BPHS Ch. 61/62/63 or Udu Dasas (Level 6 Deha) interpretation
 * for any parent-lord / sub-lord combination.
 */
export function getBphsSubPeriodEffect(
  level: "PD" | "SD" | "PrD" | "DD",
  parentLordName: string,
  subLordName: string
): string {
  const key = `${parentLordName}-${subLordName}`;
  if (level === "PD") {
    return (
      BPHS_CH61_PD_EFFECTS[key] ||
      `Pratyantardasha of ${subLordName} in ${parentLordName} Antardasha: activates ${subLordName} karakatwas modified by its natal house and varga dignity (BPHS Ch. 61).`
    );
  }
  if (level === "SD") {
    return (
      BPHS_CH62_SD_EFFECTS[key] ||
      BPHS_CH61_PD_EFFECTS[key] ||
      `Sookshma Dasha of ${subLordName} within ${parentLordName} Pratyantardasha: channels ${subLordName} daily/hourly micro-events per BPHS Ch. 62.`
    );
  }
  if (level === "PrD") {
    return (
      BPHS_CH63_PRD_EFFECTS[key] ||
      BPHS_CH62_SD_EFFECTS[key] ||
      `Prana Dasha of ${subLordName} within ${parentLordName} Sookshma Dasha: modulates breath/pranic rhythm and immediate mental focus per BPHS Ch. 63.`
    );
  }
  const somatic = DEHA_SOMATIC_ARCHETYPES[subLordName] || `Activates ${subLordName} physical manifestation.`;
  return `${somatic} Operating inside ${parentLordName} Prana Dasha (Vimsottari & Udu Dasas Sec. 5.4.4).`;
}

/**
 * Computes the 9 Level-4 Sookshma Dashas (सूक्ष्म दशा — BPHS Ch. 62) inside a given Pratyantardasha.
 * Formula: SD_duration = (PD_duration * SD_Lord_Years) / 120
 * Starting Lord: Pratyantardasha Lord, following the 9-planet Vimshottari sequence.
 */
export function calculateSookshmadashas(pd: PratyantardashaNode): SookshmadashaNode[] {
  const pdLordIdx = LORD_INDEX_BY_ID[pd.lord.id] ?? 0;
  const pdStartMs = pd.startDate.getTime();
  const pdEndMs = pd.endDate.getTime();
  const pdTotalMs = Math.max(0, pdEndMs - pdStartMs);

  const sookshmadashas: SookshmadashaNode[] = [];
  let sdStartMs = pdStartMs;

  for (let l = 0; l < 9; l++) {
    const sdLordIdx = (pdLordIdx + l) % 9;
    const sdLord = DASHA_LORDS[sdLordIdx];
    const sdDurationMs = (pdTotalMs * sdLord.years) / 120;
    const sdEndMs = l === 8 ? pdEndMs : sdStartMs + sdDurationMs;
    const actualSpanMs = Math.max(0, sdEndMs - sdStartMs);

    sookshmadashas.push({
      lord: sdLord,
      startDate: new Date(sdStartMs),
      endDate: new Date(sdEndMs),
      durationDays: Math.round((actualSpanMs / 86400000) * 100) / 100,
      durationHours: Math.round((actualSpanMs / 3600000) * 10) / 10,
      durationFormatted: formatSubPeriodDuration(actualSpanMs),
    });

    sdStartMs = sdEndMs;
  }

  return sookshmadashas;
}

/**
 * Computes the 9 Level-5 Prana Dashas (प्राण दशा — BPHS Ch. 63) inside a given Sookshma Dasha.
 * Formula: PrD_duration = (SD_duration * PrD_Lord_Years) / 120
 * Starting Lord: Sookshma Dasha Lord, following the 9-planet Vimshottari sequence.
 */
export function calculatePranadashas(sd: SookshmadashaNode): PranadashaNode[] {
  const sdLordIdx = LORD_INDEX_BY_ID[sd.lord.id] ?? 0;
  const sdStartMs = sd.startDate.getTime();
  const sdEndMs = sd.endDate.getTime();
  const sdTotalMs = Math.max(0, sdEndMs - sdStartMs);

  const pranadashas: PranadashaNode[] = [];
  let prdStartMs = sdStartMs;

  for (let m = 0; m < 9; m++) {
    const prdLordIdx = (sdLordIdx + m) % 9;
    const prdLord = DASHA_LORDS[prdLordIdx];
    const prdDurationMs = (sdTotalMs * prdLord.years) / 120;
    const prdEndMs = m === 8 ? sdEndMs : prdStartMs + prdDurationMs;
    const actualSpanMs = Math.max(0, prdEndMs - prdStartMs);

    pranadashas.push({
      lord: prdLord,
      startDate: new Date(prdStartMs),
      endDate: new Date(prdEndMs),
      durationHours: Math.round((actualSpanMs / 3600000) * 100) / 100,
      durationMinutes: Math.round((actualSpanMs / 60000) * 10) / 10,
      durationFormatted: formatSubPeriodDuration(actualSpanMs),
    });

    prdStartMs = prdEndMs;
  }

  return pranadashas;
}

/**
 * Computes the 9 Level-6 Deha Dashas (देह दशा — Final 6th Level, Udu Dasas Sec. 1.1.1f & 5.4.4)
 * inside a given Prana Dasha.
 * Formula: DD_duration = (PrD_duration * DD_Lord_Years) / 120
 * Starting Lord: Prana Dasha Lord, following the 9-planet Vimshottari sequence.
 */
export function calculateDehadashas(prd: PranadashaNode): DehadashaNode[] {
  const prdLordIdx = LORD_INDEX_BY_ID[prd.lord.id] ?? 0;
  const prdStartMs = prd.startDate.getTime();
  const prdEndMs = prd.endDate.getTime();
  const prdTotalMs = Math.max(0, prdEndMs - prdStartMs);

  const dehadashas: DehadashaNode[] = [];
  let ddStartMs = prdStartMs;

  for (let n = 0; n < 9; n++) {
    const ddLordIdx = (prdLordIdx + n) % 9;
    const ddLord = DASHA_LORDS[ddLordIdx];
    const ddDurationMs = (prdTotalMs * ddLord.years) / 120;
    const ddEndMs = n === 8 ? prdEndMs : ddStartMs + ddDurationMs;
    const actualSpanMs = Math.max(0, ddEndMs - ddStartMs);

    dehadashas.push({
      lord: ddLord,
      startDate: new Date(ddStartMs),
      endDate: new Date(ddEndMs),
      durationMinutes: Math.round((actualSpanMs / 60000) * 100) / 100,
      durationSeconds: Math.round((actualSpanMs / 1000) * 10) / 10,
      durationFormatted: formatSubPeriodDuration(actualSpanMs),
    });

    ddStartMs = ddEndMs;
  }

  return dehadashas;
}

/**
 * Computes complete Vimshottari Dasha tree (120 years) from Moon's sidereal longitude,
 * resolving all 6 classical levels (MD -> AD -> PD -> Sookshma -> Prana -> Deha) for the evaluation timestamp.
 */
export function calculateVimshottariDasha(
  birthDate: Date,
  moonLongitude: number,
  evaluationDate: Date = new Date()
): VimshottariDashaResult {
  const normMoon = ((moonLongitude % 360) + 360) % 360;
  const nakshatraSpan = 360 / 27; // 13.3333333333°
  const nakshatraIdx = Math.floor(normMoon / nakshatraSpan);
  const nakshatraName = NAKSHATRA_NAMES[nakshatraIdx] || "Ashwini";

  // Starting Dasha Lord is mapped by nakshatra % 9
  const startingLordIdx = nakshatraIdx % 9;
  const startingLord = DASHA_LORDS[startingLordIdx];

  // Fraction of nakshatra traversed
  const progInNak = (normMoon % nakshatraSpan) / nakshatraSpan;
  // Balance fraction remaining in the first Mahadasha
  const balanceFraction = 1.0 - progInNak;
  const balanceYears = balanceFraction * startingLord.years;

  const balY = Math.floor(balanceYears);
  const balM = Math.floor((balanceYears - balY) * 12);
  const balD = Math.floor(((balanceYears - balY) * 12 - balM) * 30.4375);
  const balanceFormatted = `${balY}y ${balM}m ${balD}d (${startingLord.name})`;

  const mahadashas: MahadashaNode[] = [];
  let currentStartMs = birthDate.getTime();

  // Generate 9 Mahadashas (120 full years from birth)
  for (let i = 0; i < 9; i++) {
    const lordIdx = (startingLordIdx + i) % 9;
    const mdLord = DASHA_LORDS[lordIdx];
    // First Mahadasha only lasts the balance remaining
    const effectiveYears = i === 0 ? balanceYears : mdLord.years;
    const durationDays = effectiveYears * DAYS_IN_YEAR;
    const durationMs = durationDays * 86400000;
    const mdEndMs = currentStartMs + durationMs;

    const mdStartDate = new Date(currentStartMs);
    const mdEndDate = new Date(mdEndMs);

    // Generate 9 Antardashas (Bhuktis) inside this Mahadasha
    const antardashas: AntardashaNode[] = [];
    let adStartMs = currentStartMs;

    // In classical Vedic astrology, full Antardasha starts with the MD lord
    for (let j = 0; j < 9; j++) {
      const adLordIdx = (lordIdx + j) % 9;
      const adLord = DASHA_LORDS[adLordIdx];

      // Standard full AD duration = (MD_years * AD_years) / 120 years
      const standardAdYears = (mdLord.years * adLord.years) / 120;
      let adDurationDays = standardAdYears * DAYS_IN_YEAR;

      // Scale first Mahadasha proportionally to remaining balance
      if (i === 0) {
        adDurationDays = adDurationDays * balanceFraction;
      }

      const adDurationMs = adDurationDays * 86400000;
      const adEndMs = j === 8 ? mdEndMs : adStartMs + adDurationMs;
      const adStartDate = new Date(adStartMs);
      const adEndDate = new Date(adEndMs);

      // Generate 9 Pratyantardashas inside this Antardasha
      const pratyantardashas: PratyantardashaNode[] = [];
      let pdStartMs = adStartMs;

      for (let k = 0; k < 9; k++) {
        const pdLordIdx = (adLordIdx + k) % 9;
        const pdLord = DASHA_LORDS[pdLordIdx];

        // PD duration = (AD_duration * PD_years) / 120
        const pdDurationDays = (adDurationDays * pdLord.years) / 120;
        const pdDurationMs = pdDurationDays * 86400000;
        const pdEndMs = k === 8 ? adEndMs : pdStartMs + pdDurationMs;

        pratyantardashas.push({
          lord: pdLord,
          startDate: new Date(pdStartMs),
          endDate: new Date(pdEndMs),
          durationDays: Math.round(pdDurationDays * 10) / 10,
        });

        pdStartMs = pdEndMs;
      }

      antardashas.push({
        lord: adLord,
        startDate: adStartDate,
        endDate: adEndDate,
        durationDays: Math.round(adDurationDays * 10) / 10,
        pratyantardashas,
      });

      adStartMs = adEndMs;
    }

    mahadashas.push({
      lord: mdLord,
      startDate: mdStartDate,
      endDate: mdEndDate,
      durationYears: Math.round(effectiveYears * 100) / 100,
      antardashas,
    });

    currentStartMs = mdEndMs;
  }

  // Find currently active Dasha (all 6 levels: MD -> AD -> PD -> SD -> PrD -> DD) at evaluation date
  const evalMs = evaluationDate.getTime();
  let activeDasha: ActiveDashaPeriod | null = null;

  for (const md of mahadashas) {
    if (evalMs >= md.startDate.getTime() && evalMs <= md.endDate.getTime()) {
      const mdTotal = Math.max(1, md.endDate.getTime() - md.startDate.getTime());
      const mdElapsed = evalMs - md.startDate.getTime();
      const pctMD = Math.min(100, Math.max(0, Math.round((mdElapsed / mdTotal) * 100)));

      for (const ad of md.antardashas) {
        if (evalMs >= ad.startDate.getTime() && evalMs <= ad.endDate.getTime()) {
          const adTotal = Math.max(1, ad.endDate.getTime() - ad.startDate.getTime());
          const adElapsed = evalMs - ad.startDate.getTime();
          const pctAD = Math.min(100, Math.max(0, Math.round((adElapsed / adTotal) * 100)));

          for (const pd of ad.pratyantardashas) {
            if (evalMs >= pd.startDate.getTime() && evalMs <= pd.endDate.getTime()) {
              const pdTotal = Math.max(1, pd.endDate.getTime() - pd.startDate.getTime());
              const pdElapsed = evalMs - pd.startDate.getTime();
              const pctPD = Math.min(100, Math.max(0, Math.round((pdElapsed / pdTotal) * 100)));

              // Level 4: Sookshma Dashas (9 sub-periods inside active PD)
              const activeSookshmadashas = calculateSookshmadashas(pd);
              const sd =
                activeSookshmadashas.find(
                  (s) => evalMs >= s.startDate.getTime() && evalMs <= s.endDate.getTime()
                ) || activeSookshmadashas[activeSookshmadashas.length - 1];
              const sdTotal = Math.max(1, sd.endDate.getTime() - sd.startDate.getTime());
              const sdElapsed = evalMs - sd.startDate.getTime();
              const pctSD = Math.min(100, Math.max(0, Math.round((sdElapsed / sdTotal) * 100)));

              // Level 5: Prana Dashas (9 sub-periods inside active SD)
              const activePranadashas = calculatePranadashas(sd);
              const prd =
                activePranadashas.find(
                  (p) => evalMs >= p.startDate.getTime() && evalMs <= p.endDate.getTime()
                ) || activePranadashas[activePranadashas.length - 1];
              const prdTotal = Math.max(1, prd.endDate.getTime() - prd.startDate.getTime());
              const prdElapsed = evalMs - prd.startDate.getTime();
              const pctPrD = Math.min(100, Math.max(0, Math.round((prdElapsed / prdTotal) * 100)));

              // Level 6 (Final): Deha Dashas (9 sub-periods inside active PrD)
              const activeDehadashas = calculateDehadashas(prd);
              const dd =
                activeDehadashas.find(
                  (d) => evalMs >= d.startDate.getTime() && evalMs <= d.endDate.getTime()
                ) || activeDehadashas[activeDehadashas.length - 1];
              const ddTotal = Math.max(1, dd.endDate.getTime() - dd.startDate.getTime());
              const ddElapsed = evalMs - dd.startDate.getTime();
              const pctDD = Math.min(100, Math.max(0, Math.round((ddElapsed / ddTotal) * 100)));

              activeDasha = {
                mahadasha: md.lord,
                antardasha: ad.lord,
                pratyantardasha: pd.lord,
                sookshmadasha: sd.lord,
                pranadasha: prd.lord,
                dehadasha: dd.lord,
                mdStart: md.startDate,
                mdEnd: md.endDate,
                adStart: ad.startDate,
                adEnd: ad.endDate,
                pdStart: pd.startDate,
                pdEnd: pd.endDate,
                sdStart: sd.startDate,
                sdEnd: sd.endDate,
                prdStart: prd.startDate,
                prdEnd: prd.endDate,
                ddStart: dd.startDate,
                ddEnd: dd.endDate,
                percentageCompleteMD: pctMD,
                percentageCompleteAD: pctAD,
                percentageCompletePD: pctPD,
                percentageCompleteSD: pctSD,
                percentageCompletePrD: pctPrD,
                percentageCompleteDD: pctDD,
                activeSookshmadashas,
                activePranadashas,
                activeDehadashas,
                bphsPdEffect: getBphsSubPeriodEffect("PD", ad.lord.name, pd.lord.name),
                bphsSdEffect: getBphsSubPeriodEffect("SD", pd.lord.name, sd.lord.name),
                bphsPrdEffect: getBphsSubPeriodEffect("PrD", sd.lord.name, prd.lord.name),
                bphsDdEffect: getBphsSubPeriodEffect("DD", prd.lord.name, dd.lord.name),
              };
              break;
            }
          }
          break;
        }
      }
      break;
    }
  }

  return {
    birthDate,
    moonLongitude: normMoon,
    startingNakshatraIndex: nakshatraIdx,
    startingNakshatraName: nakshatraName,
    startingLord,
    balanceYears,
    balanceFormatted,
    mahadashas,
    activeDasha,
  };
}

function formatIsoDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatIsoDateTime(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ") + " UTC";
}

function formatIsoDateTimeSec(d: Date): string {
  return d.toISOString().slice(0, 19).replace("T", " ") + " UTC";
}

export interface DashaTargetTriggerWindows {
  activeChainSummary: string;
  isTargetActiveIn6Levels: boolean;
  activeTargetLevels: string[];
  upcomingPratyantardashaWindow: {
    lord: string;
    parentAdLord: string;
    startDate: string;
    endDate: string;
    durationDays: number;
  } | null;
  upcomingSookshmadashaWindow: {
    lord: string;
    parentPdLord: string;
    startDateTime: string;
    endDateTime: string;
    durationFormatted: string;
  } | null;
  upcomingPranadashaWindow: {
    lord: string;
    parentSdLord: string;
    startDateTime: string;
    endDateTime: string;
    durationFormatted: string;
  } | null;
  upcomingDehadashaWindow: {
    lord: string;
    parentPrdLord: string;
    startDateTimeSec: string;
    endDateTimeSec: string;
    durationFormatted: string;
  } | null;
  formattedSummary: string;
}

/**
 * Scans the 6-level Vimshottari Dasha tree (MD -> AD -> PD -> Sookshma -> Prana -> Deha)
 * to locate the current or next upcoming activation windows for any target planet(s)
 * (e.g., Target House Lord and Natural Karaka for a predictive query).
 */
export function findDashaTriggerWindowsForPlanets(
  birthDate: Date,
  moonLongitude: number,
  targetLords: string[],
  evaluationDate: Date = new Date()
): DashaTargetTriggerWindows {
  const dashaResult = calculateVimshottariDasha(birthDate, moonLongitude, evaluationDate);
  const evalMs = evaluationDate.getTime();
  const normalizedTargets = new Set(
    targetLords.filter(Boolean).map((t) => t.trim().toLowerCase())
  );

  const isTarget = (name: string) => normalizedTargets.has(name.trim().toLowerCase());

  const active = dashaResult.activeDasha;
  if (!active) {
    return {
      activeChainSummary: "Unresolved",
      isTargetActiveIn6Levels: false,
      activeTargetLevels: [],
      upcomingPratyantardashaWindow: null,
      upcomingSookshmadashaWindow: null,
      upcomingPranadashaWindow: null,
      upcomingDehadashaWindow: null,
      formattedSummary: "6-Level Dasha timing unavailable.",
    };
  }

  const activeChainSummary = `MD: ${active.mahadasha.name} -> AD: ${active.antardasha.name} -> PD: ${active.pratyantardasha.name} -> Sookshma: ${active.sookshmadasha.name} -> Prana: ${active.pranadasha.name} -> Deha: ${active.dehadasha.name}`;

  const activeTargetLevels: string[] = [];
  if (isTarget(active.mahadasha.name)) activeTargetLevels.push(`L1 Mahadasha (${active.mahadasha.name})`);
  if (isTarget(active.antardasha.name)) activeTargetLevels.push(`L2 Antardasha (${active.antardasha.name})`);
  if (isTarget(active.pratyantardasha.name)) activeTargetLevels.push(`L3 Pratyantardasha (${active.pratyantardasha.name})`);
  if (isTarget(active.sookshmadasha.name)) activeTargetLevels.push(`L4 Sookshma Dasha (${active.sookshmadasha.name})`);
  if (isTarget(active.pranadasha.name)) activeTargetLevels.push(`L5 Prana Dasha (${active.pranadasha.name})`);
  if (isTarget(active.dehadasha.name)) activeTargetLevels.push(`L6 Deha Dasha (${active.dehadasha.name})`);

  // Flatten all upcoming Pratyantardashas (from current time onward across active/next ADs)
  const candidatePds: Array<{ pd: PratyantardashaNode; adLordName: string }> = [];
  for (const md of dashaResult.mahadashas) {
    if (md.endDate.getTime() < evalMs) continue;
    for (const ad of md.antardashas) {
      if (ad.endDate.getTime() < evalMs) continue;
      for (const pd of ad.pratyantardashas) {
        if (pd.endDate.getTime() >= evalMs) {
          candidatePds.push({ pd, adLordName: ad.lord.name });
        }
      }
      if (candidatePds.length >= 27) break;
    }
    if (candidatePds.length >= 27) break;
  }

  // 1. Find current or next Pratyantardasha (Level 3) matching targetLords
  const matchedPdEntry = candidatePds.find((entry) => isTarget(entry.pd.lord.name)) || null;
  const upcomingPratyantardashaWindow = matchedPdEntry
    ? {
        lord: matchedPdEntry.pd.lord.name,
        parentAdLord: matchedPdEntry.adLordName,
        startDate: formatIsoDate(matchedPdEntry.pd.startDate),
        endDate: formatIsoDate(matchedPdEntry.pd.endDate),
        durationDays: matchedPdEntry.pd.durationDays,
      }
    : null;

  // 2. Find current or next Sookshma Dasha (Level 4) matching targetLords (scan current PD + next 2 PDs)
  let upcomingSookshmadashaWindow: DashaTargetTriggerWindows["upcomingSookshmadashaWindow"] = null;
  const candidateSds: Array<{ sd: SookshmadashaNode; pdLordName: string }> = [];
  for (const entry of candidatePds.slice(0, 3)) {
    const sds = calculateSookshmadashas(entry.pd);
    for (const sd of sds) {
      if (sd.endDate.getTime() >= evalMs) {
        candidateSds.push({ sd, pdLordName: entry.pd.lord.name });
        if (!upcomingSookshmadashaWindow && isTarget(sd.lord.name)) {
          upcomingSookshmadashaWindow = {
            lord: sd.lord.name,
            parentPdLord: entry.pd.lord.name,
            startDateTime: formatIsoDateTime(sd.startDate),
            endDateTime: formatIsoDateTime(sd.endDate),
            durationFormatted: sd.durationFormatted,
          };
        }
      }
    }
  }

  // 3. Find current or next Prana Dasha (Level 5) matching targetLords (scan current SD + next 2 SDs)
  let upcomingPranadashaWindow: DashaTargetTriggerWindows["upcomingPranadashaWindow"] = null;
  const candidatePrds: Array<{ prd: PranadashaNode; sdLordName: string }> = [];
  for (const entry of candidateSds.slice(0, 3)) {
    const prds = calculatePranadashas(entry.sd);
    for (const prd of prds) {
      if (prd.endDate.getTime() >= evalMs) {
        candidatePrds.push({ prd, sdLordName: entry.sd.lord.name });
        if (!upcomingPranadashaWindow && isTarget(prd.lord.name)) {
          upcomingPranadashaWindow = {
            lord: prd.lord.name,
            parentSdLord: entry.sd.lord.name,
            startDateTime: formatIsoDateTime(prd.startDate),
            endDateTime: formatIsoDateTime(prd.endDate),
            durationFormatted: prd.durationFormatted,
          };
        }
      }
    }
  }

  // 4. Find current or next Deha Dasha (Level 6 — Final) matching targetLords (scan current PrD + next 2 PrDs)
  let upcomingDehadashaWindow: DashaTargetTriggerWindows["upcomingDehadashaWindow"] = null;
  for (const entry of candidatePrds.slice(0, 3)) {
    const dds = calculateDehadashas(entry.prd);
    for (const dd of dds) {
      if (dd.endDate.getTime() >= evalMs && isTarget(dd.lord.name)) {
        upcomingDehadashaWindow = {
          lord: dd.lord.name,
          parentPrdLord: entry.prd.lord.name,
          startDateTimeSec: formatIsoDateTimeSec(dd.startDate),
          endDateTimeSec: formatIsoDateTimeSec(dd.endDate),
          durationFormatted: dd.durationFormatted,
        };
        break;
      }
    }
    if (upcomingDehadashaWindow) break;
  }

  const parts: string[] = [`Active 6-Level Chain: ${activeChainSummary}`];
  if (upcomingPratyantardashaWindow) {
    parts.push(
      `L3 Pratyantardasha Trigger (${upcomingPratyantardashaWindow.lord} in ${upcomingPratyantardashaWindow.parentAdLord} AD): ${upcomingPratyantardashaWindow.startDate} to ${upcomingPratyantardashaWindow.endDate} (${upcomingPratyantardashaWindow.durationDays}d)`
    );
  }
  if (upcomingSookshmadashaWindow) {
    parts.push(
      `L4 Sookshma Dasha Trigger (${upcomingSookshmadashaWindow.lord} in ${upcomingSookshmadashaWindow.parentPdLord} PD): ${upcomingSookshmadashaWindow.startDateTime} to ${upcomingSookshmadashaWindow.endDateTime} (${upcomingSookshmadashaWindow.durationFormatted})`
    );
  }
  if (upcomingPranadashaWindow) {
    parts.push(
      `L5 Prana Dasha Trigger (${upcomingPranadashaWindow.lord} in ${upcomingPranadashaWindow.parentSdLord} SD): ${upcomingPranadashaWindow.startDateTime} to ${upcomingPranadashaWindow.endDateTime} (${upcomingPranadashaWindow.durationFormatted})`
    );
  }
  if (upcomingDehadashaWindow) {
    parts.push(
      `L6 Deha Dasha Trigger (${upcomingDehadashaWindow.lord} in ${upcomingDehadashaWindow.parentPrdLord} PrD): ${upcomingDehadashaWindow.startDateTimeSec} to ${upcomingDehadashaWindow.endDateTimeSec} (${upcomingDehadashaWindow.durationFormatted})`
    );
  }

  return {
    activeChainSummary,
    isTargetActiveIn6Levels: activeTargetLevels.length > 0,
    activeTargetLevels,
    upcomingPratyantardashaWindow,
    upcomingSookshmadashaWindow,
    upcomingPranadashaWindow,
    upcomingDehadashaWindow,
    formattedSummary: parts.join(" | "),
  };
}

/**
 * Formats the complete 9-sub-period schedules for Level 3 (Pratyantardasha),
 * Level 4 (Sookshma Dasha), Level 5 (Prana Dasha), and Level 6 (Deha Dasha — Final)
 * so the AI Chatbot and Dossier have exact timestamps down to the minute/second.
 */
export function formatChatbotSixLevelSchedule(dashaResult: VimshottariDashaResult): string {
  const active = dashaResult.activeDasha;
  if (!active) return "No active 6-level Dasha period resolved.";

  // Locate active AD to list all 9 Pratyantardashas
  let activeAdNode: AntardashaNode | null = null;
  for (const md of dashaResult.mahadashas) {
    if (md.lord.id === active.mahadasha.id && md.startDate.getTime() === active.mdStart.getTime()) {
      for (const ad of md.antardashas) {
        if (ad.lord.id === active.antardasha.id && ad.startDate.getTime() === active.adStart.getTime()) {
          activeAdNode = ad;
          break;
        }
      }
      break;
    }
  }

  const pdLines = activeAdNode
    ? activeAdNode.pratyantardashas
        .map((pd, idx) => {
          const isCurrent =
            pd.lord.id === active.pratyantardasha.id &&
            pd.startDate.getTime() === active.pdStart.getTime();
          return `  ${idx + 1}. ${pd.lord.name} PD: ${formatIsoDate(pd.startDate)} → ${formatIsoDate(pd.endDate)} (${pd.durationDays}d)${isCurrent ? ` ◄ [ACTIVE NOW — ${active.percentageCompletePD}% elapsed]` : ""}`;
        })
        .join("\n")
    : "  (Pratyantardasha list unavailable)";

  const sdLines = active.activeSookshmadashas
    .map((sd, idx) => {
      const isCurrent =
        sd.lord.id === active.sookshmadasha.id &&
        sd.startDate.getTime() === active.sdStart.getTime();
      return `  ${idx + 1}. ${sd.lord.name} Sookshma: ${formatIsoDateTime(sd.startDate)} → ${formatIsoDateTime(sd.endDate)} (${sd.durationFormatted})${isCurrent ? ` ◄ [ACTIVE NOW — ${active.percentageCompleteSD}% elapsed]` : ""}`;
    })
    .join("\n");

  const prdLines = active.activePranadashas
    .map((prd, idx) => {
      const isCurrent =
        prd.lord.id === active.pranadasha.id &&
        prd.startDate.getTime() === active.prdStart.getTime();
      return `  ${idx + 1}. ${prd.lord.name} Prana: ${formatIsoDateTime(prd.startDate)} → ${formatIsoDateTime(prd.endDate)} (${prd.durationFormatted})${isCurrent ? ` ◄ [ACTIVE NOW — ${active.percentageCompletePrD}% elapsed]` : ""}`;
    })
    .join("\n");

  const ddLines = active.activeDehadashas
    .map((dd, idx) => {
      const isCurrent =
        dd.lord.id === active.dehadasha.id &&
        dd.startDate.getTime() === active.ddStart.getTime();
      return `  ${idx + 1}. ${dd.lord.name} Deha: ${formatIsoDateTimeSec(dd.startDate)} → ${formatIsoDateTimeSec(dd.endDate)} (${dd.durationFormatted})${isCurrent ? ` ◄ [ACTIVE NOW — ${active.percentageCompleteDD}% elapsed]` : ""}`;
    })
    .join("\n");

  return [
    `[LEVEL 3 — ALL 9 PRATYANTARDASHAS IN ACTIVE ${active.mahadasha.name.toUpperCase()}–${active.antardasha.name.toUpperCase()} ANTARDASHA (${formatIsoDate(active.adStart)} → ${formatIsoDate(active.adEnd)})]`,
    pdLines,
    `[LEVEL 4 — ALL 9 SOOKSHMA DASHAS IN ACTIVE ${active.pratyantardasha.name.toUpperCase()} PRATYANTARDASHA (${formatIsoDateTime(active.pdStart)} → ${formatIsoDateTime(active.pdEnd)})]`,
    sdLines,
    `[LEVEL 5 — ALL 9 PRANA DASHAS IN ACTIVE ${active.sookshmadasha.name.toUpperCase()} SOOKSHMA DASHA (${formatIsoDateTime(active.sdStart)} → ${formatIsoDateTime(active.sdEnd)})]`,
    prdLines,
    `[LEVEL 6 (FINAL) — ALL 9 DEHA DASHAS IN ACTIVE ${active.pranadasha.name.toUpperCase()} PRANA DASHA (${formatIsoDateTimeSec(active.prdStart)} → ${formatIsoDateTimeSec(active.prdEnd)})]`,
    ddLines,
  ].join("\n");
}

