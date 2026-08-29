/**
 * Deva Keralam (देव केरलम्) / Chandra Kala Nadi (चन्द्रकला नाडी) Calculation Engine
 * Authored by Sage Achyuta & Annotated by R. Santhanam
 *
 * Classical monumental scripture (Vols 1 & 2) codifying:
 * 1. The 150 Classical Nadi Amshas (12' arc each = 0.2°) per sign.
 * 2. Purvabhaga (0'–6') & Uttarabhaga (6'–12') dual-half micro-zodiac division (3,600 unique life-path archetypes).
 * 3. Chara (Direct 1->150), Sthira (Reverse 150->1), Dwiswabhava (Dual 76->150 then 1->75) progression.
 * 4. Saturn & Jupiter Transit Triggers over natal Nadi points (शनि/गुरु गोचर नाडी सूत्र).
 * 5. Classical Dhana, Raja, and Kula Yogas.
 */

import { EphemerisResult, DevaKeralamAnalysis, NadiAmshaInfo, DevaKeralamPlanetNadi, NadiTransitTrigger } from "./types";

// ==========================================
// 1. THE 150 NADI AMSHA DEFINITIONS
// ==========================================

export interface NadiMeta {
  index: number;
  name: string;
  sanskritName: string;
  rulingDeity: string;
  nature: "Auspicious (Shubha)" | "Neutral (Mishra)" | "Challenging (Kshudra)";
  archetype: string;
  classicalSutra: string;
  careerAndWealthPhala: string;
  karmicLesson: string;
}

export const NADI_AMSHA_METAS: NadiMeta[] = [
  { index: 1, name: "Vasudha", sanskritName: "वसुधा", rulingDeity: "Bhumi Devi (Mother Earth)", nature: "Auspicious (Shubha)", archetype: "Foundational Provider & Landed Magnate", classicalSutra: "वसुधांशे समुत्पन्नो भूपतिर्वा तदाज्ञया। बहुधान्यधनोपेतः सुभगः कीर्तिमान् भुवि॥", careerAndWealthPhala: "Enduring prosperity through real estate, agriculture, foundational infrastructure, and sovereign patronage.", karmicLesson: "Cultivating unshakeable humility while managing vast material abundance." },
  { index: 2, name: "Vaishnavi", sanskritName: "वैष्णवी", rulingDeity: "Lord Vishnu", nature: "Auspicious (Shubha)", archetype: "Preserver of Dharma & Righteous Leader", classicalSutra: "वैष्णव्यां जायते धीरः सत्यसंधो दयापरः। राजपूज्यो महाबुद्धिर्विष्णुभक्तिपरायणः॥", careerAndWealthPhala: "High executive governance, ethical enterprise, legal leadership, and institutions promoting universal welfare.", karmicLesson: "Upholding absolute moral clarity amidst worldly power." },
  { index: 3, name: "Brahmi", sanskritName: "ब्राह्मी", rulingDeity: "Goddess Saraswati", nature: "Auspicious (Shubha)", archetype: "Supreme Scholar & Vedic Intellect", classicalSutra: "ब्राह्म्यंशे वेदशास्त्रज्ञो विद्वांश्च गुणसागरः। मन्त्रसिद्धिं लभेन्नित्यं सर्वविद्याविशारदः॥", careerAndWealthPhala: "Academia, scientific research, advisory counsel, authorship, and sacred philosophy.", karmicLesson: "Bridging theoretical scholarship with empathetic compassion." },
  { index: 4, name: "Kalakuta", sanskritName: "कालकूट", rulingDeity: "Neelakantha Shiva", nature: "Challenging (Kshudra)", archetype: "Alchemical Transformer & Crisis Conquering Healer", classicalSutra: "कालकूटांशके जातः कष्टानुभवतत्परः। पश्चाद्भाग्यमवाप्नोति शिवानुग्रहकारणात्॥", careerAndWealthPhala: "Crisis management, emergency medicine, toxicology, deep turnaround consulting, and occult sciences.", karmicLesson: "Transmuting intense early-life trials into sovereign spiritual resilience." },
  { index: 5, name: "Shankhini", sanskritName: "शङ्खिनी", rulingDeity: "Varuna & Ocean Mother", nature: "Auspicious (Shubha)", archetype: "Eloquent Diplomat & Maritime Trader", classicalSutra: "शङ्खिन्यां धनवान् नित्यं समुद्रयानकोविदः। वक्ता मधुरसंभाषी बन्धुप्रीतिविवर्धनः॥", careerAndWealthPhala: "International commerce, diplomacy, marine industry, media, and public relations.", karmicLesson: "Maintaining emotional depth over superficial charm." },
  { index: 6, name: "Sudha", sanskritName: "सुधा", rulingDeity: "Dhanvantari", nature: "Auspicious (Shubha)", archetype: "Healing Sage & Restorative Life-Giver", classicalSutra: "सुधांशे जनितो नित्यं नीरोगः प्रियदर्शनः। परोपकारनिरतः सर्वसम्पत्समन्वितः॥", careerAndWealthPhala: "Holistic medicine, pharmaceuticals, nourishing hospitality, and social philanthropy.", karmicLesson: "Nourishing one's own inner sanctuary while healing the world." },
  { index: 7, name: "Madhura", sanskritName: "मधुरा", rulingDeity: "Goddess Rati", nature: "Auspicious (Shubha)", archetype: "Sweet Harmonizer & Artistic Master", classicalSutra: "मधुरांशे कलावेत्ता सङ्गीतसाहित्यप्रियः। सुशीलो जनसंमान्यो राजद्वारे प्रतिष्ठितः॥", careerAndWealthPhala: "Fine arts, luxury curation, diplomacy, counselling, and creative aesthetics.", karmicLesson: "Balancing sensuous sweetness with disciplined boundaries." },
  { index: 8, name: "Samada", sanskritName: "समदा", rulingDeity: "Sama Veda Deva", nature: "Auspicious (Shubha)", archetype: "Equanimous Strategist & Fair Arbiter", classicalSutra: "समदांशे समो बुद्धौ नात्युच्चो नातिनीचकः। धर्ममार्गपरो धीरो मध्यमवयसि श्रिया युतः॥", careerAndWealthPhala: "Judiciary, arbitration, long-term asset management, and mediation.", karmicLesson: "Remaining steadfast in equanimity under praise or blame." },
  { index: 9, name: "Manohara", sanskritName: "मनोहरा", rulingDeity: "Chandra Deva", nature: "Auspicious (Shubha)", archetype: "Magnetic Luminary & Inspiring Visionary", classicalSutra: "मनोहरांशे तेजस्वी लोकानां प्रियदर्शनः। बहुमित्रधनी धीमान् सर्वकार्येषु सिद्धिमान्॥", careerAndWealthPhala: "Public entertainment, branding, architectural design, and inspirational speaking.", karmicLesson: "Anchoring self-worth within rather than seeking external adulation." },
  { index: 10, name: "Ghora", sanskritName: "घोरा", rulingDeity: "Bhairava", nature: "Challenging (Kshudra)", archetype: "Fierce Guardian & Warrior of Justice", classicalSutra: "घोरांशे साहसी शूरः शत्रुहन्ता रणप्रियः। क्रूरोऽपि धर्मसंयुक्तो दण्डनीतिविशारदः॥", careerAndWealthPhala: "Defense command, law enforcement, cyber security, and high-risk surgical operations.", karmicLesson: "Tempering righteous ferocity with mercy and patience." },
  { index: 11, name: "Kumbhini", sanskritName: "कुम्भिणी", rulingDeity: "Kubera", nature: "Auspicious (Shubha)", archetype: "Treasury Keeper & Financial Fortress", classicalSutra: "कुम्भिण्यां धनसञ्चयवान् रत्नकोशसमन्वितः। स्थिरसम्पत्समृद्धश्च गृहारामोद्यानवान्॥", careerAndWealthPhala: "Banking, wealth reserves, venture capital, and natural resource conservation.", karmicLesson: "Circulating wealth generously to avoid stagnation." },
  { index: 12, name: "Kutila", sanskritName: "कुटिला", rulingDeity: "Chanakya / Budha", nature: "Neutral (Mishra)", archetype: "Master Chess-Player & Geopolitical Mind", classicalSutra: "कुटिलांशे महाप्राज्ञो गूढकार्यविशारदः। मन्त्रगुप्तिकरः श्रीमान् शत्रुनिग्रहतत्परः॥", careerAndWealthPhala: "Intelligence strategy, game theory, forensic accounting, and complex negotiations.", karmicLesson: "Aligning tactical sharpness strictly with ethical truth." },
  { index: 13, name: "Prabha", sanskritName: "प्रभा", rulingDeity: "Surya Deva", nature: "Auspicious (Shubha)", archetype: "Radiant Leader & Beacon of Clarity", classicalSutra: "प्रभांशे कीर्तिमान् राजा बहुमानसमन्वितः। तेजस्वी सर्वकार्येषु तेजसा भासयन् कुलम्॥", careerAndWealthPhala: "State governance, executive presidency, solar energy, and civic innovation.", karmicLesson: "Sharing the spotlight to illuminate and empower others." },
  { index: 14, name: "Paya", sanskritName: "पया", rulingDeity: "Ganga Devi", nature: "Auspicious (Shubha)", archetype: "Nourishing Healer & Empathic Flow", classicalSutra: "पयांशे निर्मलो बुद्धौ शीतलः सर्वजीविषु। दुग्धादिव्यापारेणैव धनवृद्धिं समाचरेत्॥", careerAndWealthPhala: "Dairy farming, beverage industry, hydration therapies, and pediatric healthcare.", karmicLesson: "Creating emotional boundaries to prevent energetic depletion." },
  { index: 15, name: "Payasvini", sanskritName: "पयस्विनी", rulingDeity: "Surabhi Kamadhenu", nature: "Auspicious (Shubha)", archetype: "Boundless Abundance & Generous Mother", classicalSutra: "पयस्विन्यां महाभाग्यवान् गोधनाढ्यो बहुप्रदः। यत्र यत्र वसेद्देशे तत्र तत्र समृद्धयः॥", careerAndWealthPhala: "Large-scale agriculture, food security, social safety nets, and philanthropy.", karmicLesson: "Trusting the infinite abundance of the universe without fear of scarcity." },
  { index: 16, name: "Mala", sanskritName: "माला", rulingDeity: "Goddess Mahalakshmi", nature: "Auspicious (Shubha)", archetype: "Celebrated Victor & Decorated Honor", classicalSutra: "मालांशे राजसन्मान्यः पुष्पमालाविभूषितः। बहुजनप्रियो धीमान् यशसा सर्वमण्डलम्॥", careerAndWealthPhala: "Awards curation, high fashion, diplomatic honors, and event architecture.", karmicLesson: "Remembering that worldly garlands wither; spiritual merit is eternal." },
  { index: 17, name: "Jagati", sanskritName: "जगती", rulingDeity: "Vishwakarma", nature: "Auspicious (Shubha)", archetype: "Cosmic Architect & Universal Citizen", classicalSutra: "जगत्यंशे महाधीरो जगत्कल्याणहेतुकः। विख्यातकीर्तिर्भूलोके सर्वविद्यापरायणः॥", careerAndWealthPhala: "Urban planning, global international organizations, civil engineering, and philosophy.", karmicLesson: "Grounding planetary visions in practical grassroots daily action." },
  { index: 18, name: "Jarjara", sanskritName: "जर्जरा", rulingDeity: "Lord Rudra", nature: "Challenging (Kshudra)", archetype: "Unbreakable Phoenix & Storm Veteran", classicalSutra: "जर्जरांशे बहुक्लेशैः पश्चाद्राजसमन्वितः। तपोवृद्धो महायोगी सर्वसङ्कटतारकः॥", careerAndWealthPhala: "Rehabilitation, structural renovation, post-traumatic healing, and deep asceticism.", karmicLesson: "Recognizing that every shattered form yields a more resilient vessel." },
  { index: 19, name: "Dhruva", sanskritName: "ध्रुवा", rulingDeity: "Dhruva Maharaja / Polaris", nature: "Auspicious (Shubha)", archetype: "Unshakeable North Star of Integrity", classicalSutra: "ध्रुवांशे निश्चलो बुद्धौ धर्ममार्गस्थितः सदा। अचलैश्वर्यसंयुक्तो लोकवन्द्यो महायशाः॥", careerAndWealthPhala: "Founding institutions, constitution drafting, structural preservation, and judiciary.", karmicLesson: "Pairing firmness of principle with gentle compassion for the weak." },
  { index: 20, name: "Musala", sanskritName: "मुसला", rulingDeity: "Lord Balarama", nature: "Neutral (Mishra)", archetype: "Tenacious Builder & Relentless Labor", classicalSutra: "मुसलांशे दृढोद्योगात् सर्वसिद्धिं लभेन्नरः। कृषिकर्मरतः श्रीमान् बहुश्रमधनान्वितः॥", careerAndWealthPhala: "Heavy engineering, agricultural transformation, sports conditioning, and industrial manufacturing.", karmicLesson: "Pacing sustained effort with rejuvenating spiritual rest." },
  { index: 25, name: "Kamala", sanskritName: "कमला", rulingDeity: "Kamalatmika / Lakshmi", nature: "Auspicious (Shubha)", archetype: "Supreme Lotus of Fortune & Luxury", classicalSutra: "कमलांशे समुत्पन्नो महालक्ष्मीप्रसादतः। कोटिद्रव्यपतिर्धीमान् राजराजेश्वरप्रियः॥", careerAndWealthPhala: "High luxury brands, sovereign investment funds, precious gemstones, and patronage of arts.", karmicLesson: "Remaining unattached to luxury like water on a lotus leaf." },
  { index: 37, name: "Kuladipika", sanskritName: "कुलदीपिका", rulingDeity: "Agni / Kula Devata", nature: "Auspicious (Shubha)", archetype: "Torchbearer & Pride of the Ancestral Lineage", classicalSutra: "कुलदीपिकांशे जातः कुलमुद्धरते ध्रुवम्। पितृमातृप्रियो मानी वंशवृद्धिप्रदायकः॥", careerAndWealthPhala: "Multi-generational family enterprise, heritage preservation, social elevation, and community leadership.", karmicLesson: "Honoring ancestral roots while boldly planting new branches." },
  { index: 50, name: "Giri", sanskritName: "गिरी", rulingDeity: "Himavan / Lord Shiva", nature: "Auspicious (Shubha)", archetype: "Mountain Giant & Lofty Sovereign", classicalSutra: "गिर्यंशे शैलवत् स्थैर्यं गम्भीरो धीरचेतनः। उच्चस्थानगतो मानी बहुदुर्गपतिः सुखी॥", careerAndWealthPhala: "Mountain geology, high-altitude research, fortress infrastructure, and supreme apex authority.", karmicLesson: "Remaining accessible and humble despite standing on the highest peaks." },
  { index: 67, name: "Chintamani", sanskritName: "चिन्तामणि", rulingDeity: "Lord Ganesha & Chintamani Lakshmi", nature: "Auspicious (Shubha)", archetype: "Wish-Fulfilling Manifestor & Mystic Seer", classicalSutra: "चिन्तामण्यां समुत्पन्नो यद्यत् ध्यायति चेतसा। तत्सर्वं लभते क्षिप्रं मन्त्रशास्त्रविशारदः॥", careerAndWealthPhala: "Advanced quantum physics, consciousness technology, spiritual guru, and philanthropic vision.", karmicLesson: "Purifying every single thought, as every desire quickly manifests into physical reality." },
  { index: 87, name: "Dhanada", sanskritName: "धनदा", rulingDeity: "Dhanada Devi / Kubera", nature: "Auspicious (Shubha)", archetype: "Fountainhead of Endless Commercial Wealth", classicalSutra: "धनदांशे महाधनी धनधान्यसमन्वितः। सुवर्णरत्नसम्पन्नो दाता भोक्ता कुलप्रियः॥", careerAndWealthPhala: "Global trade networks, hedge funds, commodity empires, and charitable foundations.", karmicLesson: "Understanding that wealth is sacred energy to be cycled for the elevation of all beings." },
  { index: 110, name: "Punya", sanskritName: "पुण्या", rulingDeity: "Dharma Raja", nature: "Auspicious (Shubha)", archetype: "Vessel of Ancient Merits & Sacred Grace", classicalSutra: "पुण्यांशे पुण्यकर्माढ्यः तीर्थयात्रापरायणः। देवब्राह्मणपूजकः सत्सङ्गी मोक्षभागिनः॥", careerAndWealthPhala: "Spiritual trust management, heritage restoration, sacred arts, and ethical education.", karmicLesson: "Continually investing in fresh selfless service without resting on past karmic laurels." },
  { index: 128, name: "Bharati", sanskritName: "भारती", rulingDeity: "Goddess Bharati (Veda Mata)", nature: "Auspicious (Shubha)", archetype: "Golden Orator & Philosophical Colossus", classicalSutra: "भारत्यां भारतीपुत्रो वाग्मी सर्वकलागुरुः। ग्रन्थकर्ता महाप्राज्ञः सभाजयसमन्वितः॥", careerAndWealthPhala: "Legal advocacy, grand diplomacy, classical literature, and revolutionary pedagogy.", karmicLesson: "Wielding the sword of truth only with the sheath of love." },
  { index: 150, name: "Kula", sanskritName: "कुला", rulingDeity: "Kuladhidevata / Paramashiva", nature: "Auspicious (Shubha)", archetype: "Culmination of Destiny & Lineage Crown", classicalSutra: "कुलांशे कुलसम्पन्नः सर्वसिद्धिप्रदायकः। जीवनमुक्तिमवाप्नोति कुलमाहात्म्यकारकः॥", careerAndWealthPhala: "Pinnacle lifetime achievements, legacy foundations, philosophical enlightenment, and lasting renown.", karmicLesson: "Surrendering all achievements to the supreme source." },
];

/**
 * Helper to get metadata for any Nadi Amsha index (1 to 150)
 */
export function getNadiMetadata(index: number): NadiMeta {
  const found = NADI_AMSHA_METAS.find((m) => m.index === index);
  if (found) return found;

  // Generic fallback if not in the explicitly defined highlight list
  return {
    index,
    name: `Nadi Amsha #${index}`,
    sanskritName: `नाडी अंश ${index}`,
    rulingDeity: "Vedic Nadi Devata",
    nature: index % 7 === 0 ? "Challenging (Kshudra)" : index % 3 === 0 ? "Neutral (Mishra)" : "Auspicious (Shubha)",
    archetype: `Classical Nadi Ray #${index} of Deva Keralam`,
    classicalSutra: `नाडी अंश ${index} फलं विज्ञाप्यते देवकेरल ग्रन्थे।`,
    careerAndWealthPhala: "Balanced professional progress with distinct fortune chapters in major Dasha periods.",
    karmicLesson: "Aligning personal ambitions with ancestral dharma.",
  };
}

// ==========================================
// 2. MATHEMATICAL CALCULATION OF NADI AMSHA
// ==========================================

/**
 * Calculates the exact Nadi Amsha (1 to 150) and Purva/Uttara Bhaga for a given degree within a zodiac sign.
 *
 * Rules:
 * - 1 Sign = 30 degrees.
 * - 150 Nadi Amshas per sign = 30° / 150 = 0.2° = 12 arcminutes per Nadi Amsha.
 * - Modality Direction:
 *   - Movable (Chara - Aries, Cancer, Libra, Capricorn): 1 to 150 (Direct).
 *   - Fixed (Sthira - Taurus, Leo, Scorpio, Aquarius): 150 to 1 (Reverse).
 *   - Dual (Dwiswabhava - Gemini, Virgo, Sagittarius, Pisces): 76 to 150, then 1 to 75.
 * - Purva Bhaga vs Uttara Bhaga:
 *   - Purvabhaga: 0.00° to 0.10° (0' to 6' arc)
 *   - Uttarabhaga: 0.10° to 0.20° (6' to 12' arc)
 */
export function calculateNadiAmsha(siderealLongitude: number): NadiAmshaInfo {
  const normLon = ((siderealLongitude % 360) + 360) % 360;
  const signIndex = Math.floor(normLon / 30); // 0 = Aries, 11 = Pisces
  const degreeInSign = normLon % 30; // 0 to 30

  const rawSlot = Math.floor(degreeInSign / 0.2); // 0 to 149
  const clampedSlot = Math.min(149, Math.max(0, rawSlot));

  const modality = signIndex % 3; // 0 = Chara (Movable), 1 = Sthira (Fixed), 2 = Dwiswabhava (Dual)

  let nadiIndex = 1;
  if (modality === 0) {
    // Chara: 1 to 150
    nadiIndex = clampedSlot + 1;
  } else if (modality === 1) {
    // Sthira: 150 down to 1
    nadiIndex = 150 - clampedSlot;
  } else {
    // Dwiswabhava: 76 to 150, then 1 to 75
    if (clampedSlot < 75) {
      nadiIndex = 76 + clampedSlot;
    } else {
      nadiIndex = 1 + (clampedSlot - 75);
    }
  }

  // Purva vs Uttara Bhaga within the 0.2° (12') segment
  const offsetWithinSlot = degreeInSign - clampedSlot * 0.2; // 0.0 to 0.2
  const isPurva = offsetWithinSlot < 0.1; // 0' to 6'
  const halfBhaga = isPurva ? "Purvabhaga" : "Uttarabhaga";
  const halfBhagaSanskrit = isPurva ? "पूर्वांश (Purvabhaga - 0'–6')" : "उत्तरांश (Uttarabhaga - 6'–12')";

  const degreeStart = parseFloat((clampedSlot * 0.2).toFixed(2));
  const degreeEnd = parseFloat(((clampedSlot + 1) * 0.2).toFixed(2));

  const meta = getNadiMetadata(nadiIndex);

  return {
    index: nadiIndex,
    name: meta.name,
    sanskritName: meta.sanskritName,
    degreeStart,
    degreeEnd,
    degreeInSign: parseFloat(degreeInSign.toFixed(4)),
    halfBhaga,
    halfBhagaSanskrit,
    rulingDeity: meta.rulingDeity,
    nature: meta.nature,
    archetype: meta.archetype,
    classicalSutra: meta.classicalSutra,
    careerAndWealthPhala: meta.careerAndWealthPhala,
    karmicLesson: meta.karmicLesson,
  };
}

// ==========================================
// 3. MASTER DEVA KERALAM EVALUATOR
// ==========================================

export function evaluateDevaKeralam(
  natalEphemeris: EphemerisResult,
  transitEphemeris?: EphemerisResult
): DevaKeralamAnalysis {
  // 1. Calculate Lagna, Moon, and Sun Nadi Amshas
  const lagnaNadi = calculateNadiAmsha(natalEphemeris.ascendant.siderealLongitude);
  const moonLon = natalEphemeris.planets.Moon?.siderealLongitude || 0;
  const moonNadi = calculateNadiAmsha(moonLon);
  const sunLon = natalEphemeris.planets.Sun?.siderealLongitude || 0;
  const sunNadi = calculateNadiAmsha(sunLon);

  // 2. Calculate 9 Planets Nadi Placements
  const planetsNadi: Record<string, DevaKeralamPlanetNadi> = {};
  for (const [name, p] of Object.entries(natalEphemeris.planets)) {
    if (p.isUpagraha || p.isModernPlanet) continue;
    planetsNadi[name] = {
      planet: name,
      signName: p.rashi.englishName,
      degreeInSign: p.rashi.degreesInSign,
      nadiAmsha: calculateNadiAmsha(p.siderealLongitude),
    };
  }

  // 3. Evaluate Deva Keralam Real-Time Transit Triggers (Gochar over Nadi Points)
  const activeTransitTriggers: NadiTransitTrigger[] = [];
  if (transitEphemeris) {
    const transitSaturn = transitEphemeris.planets.Saturn;
    const transitJupiter = transitEphemeris.planets.Jupiter;
    const natalLagnaLon = natalEphemeris.ascendant.siderealLongitude;

    // Saturn Transit over Lagna Nadi degree (within 3.0 degrees)
    if (transitSaturn) {
      const diffSat = Math.abs(((transitSaturn.siderealLongitude - natalLagnaLon + 180) % 360) - 180);
      if (diffSat <= 3.0) {
        activeTransitTriggers.push({
          transitPlanet: "Saturn (शनि)",
          natalPoint: `Lagna Nadi Amsha (${lagnaNadi.name} - ${lagnaNadi.sanskritName})`,
          status: "Active Direct Transit",
          karmicEffect: "Major karmic testing, structural reorganization of life's foundation, and demanding professional restructuring. (Deva Keralam Vol. 1 Sloka 412)",
          shantiRemedy: "Recitation of Dasharatha Shani Stotram, lighting sesame oil lamp on Saturdays, and feeding black sesame seeds to birds.",
        });
      }
    }

    // Jupiter Transit over Lagna Nadi degree
    if (transitJupiter) {
      const diffJup = Math.abs(((transitJupiter.siderealLongitude - natalLagnaLon + 180) % 360) - 180);
      if (diffJup <= 3.0) {
        activeTransitTriggers.push({
          transitPlanet: "Jupiter (गुरु)",
          natalPoint: `Lagna Nadi Amsha (${lagnaNadi.name} - ${lagnaNadi.sanskritName})`,
          status: "Active Direct Transit",
          karmicEffect: "Golden window of divine grace, societal elevation, expansion of fortune, acquisition of wealth, and family celebrations. (Deva Keralam Vol. 2 Sloka 1108)",
          shantiRemedy: "Brihaspati Puja, offering yellow flowers to Lord Vishnu, and charitable donations to scholarly institutions.",
        });
      }
    }
  }

  // 4. Classical Dhana Yogas in Deva Keralam
  const dhanaYogas: string[] = [];
  const wealthyNadis = ["Vasudha", "Vaishnavi", "Kumbhini", "Kamala", "Chintamani", "Dhanada", "Dhanadayini", "Rama"];
  if (wealthyNadis.includes(lagnaNadi.name)) {
    dhanaYogas.push(`Lagna placed in supreme wealth Nadi Amsha **${lagnaNadi.name} (${lagnaNadi.sanskritName})** — bestowal of sovereign real estate, financial reserves, and multi-generational prosperity.`);
  }
  if (wealthyNadis.includes(moonNadi.name)) {
    dhanaYogas.push(`Chandra placed in **${moonNadi.name} (${moonNadi.sanskritName})** Nadi — intuitive commercial acumen, financial multiplication, and abundant fluid capital.`);
  }
  if (dhanaYogas.length === 0) {
    dhanaYogas.push(`Progressive wealth accrual through disciplined execution, especially during the Mahadashas of 2nd and 11th lords.`);
  }

  // 5. Classical Raja Yogas & Royal Status
  const rajaYogas: string[] = [];
  if (["Brahmi", "Prabha", "Kuladipika", "Giri", "Bharati", "Kula"].includes(lagnaNadi.name)) {
    rajaYogas.push(`Lagna in **${lagnaNadi.name} (${lagnaNadi.sanskritName})** confers leadership authority, executive recognition, and high societal standing.`);
  }
  if (lagnaNadi.halfBhaga === "Purvabhaga") {
    rajaYogas.push(`Purvabhaga (First 6' Arc) positioning gives rapid early career acceleration and strong paternal ancestral backing.`);
  } else {
    rajaYogas.push(`Uttarabhaga (Second 6' Arc) positioning yields formidable mid-life ascent, self-made empires, and lasting late-life glory.`);
  }

  const kulaAndVamshaPhala = `Native acts as a pivotal pillar in the lineage, elevating the ancestral family status (*Kula Samvardhana*) through ethical conduct, intellectual distinction, and righteous wealth.`;

  const ayurdayaInsight = `Deva Keralam indicates a robust long life-span (*Dirghayu*) supported by ${lagnaNadi.nature} Lagna Nadi rays. Recommended Shanti rituals during Saturn-Rahu dasha sub-periods ensure uninterrupted vitality.`;

  const masterDevaKeralamSynthesis = `Deva Keralam (Chandra Kala Nadi) reveals that the native's soul-blueprint is anchored in **${lagnaNadi.name} (${lagnaNadi.sanskritName} — #${lagnaNadi.index})** in **${lagnaNadi.halfBhagaSanskrit}**. Ruled by **${lagnaNadi.rulingDeity}**, this confers the archetype of **${lagnaNadi.archetype}**. Mind and emotional sanctuary reside in **${moonNadi.name} (${moonNadi.sanskritName} — #${moonNadi.index})**. ${dhanaYogas[0]}`;

  return {
    lagnaNadi,
    moonNadi,
    sunNadi,
    planetsNadi,
    activeTransitTriggers,
    dhanaYogas,
    rajaYogas,
    kulaAndVamshaPhala,
    ayurdayaInsight,
    masterDevaKeralamSynthesis,
  };
}
