/**
 * Brihat Samhita (बृहत्संहिता) Calculation Engine
 * Authored by Acharya Varahamihira (6th Century CE)
 *
 * Monumental 106-Chapter Classical Encyclopedia covering:
 * 1. Kurma Chakra (कूर्म विभाग - Ch. 14): 9-Directional Cosmic Tortoise & Nakshatra spatial grid.
 * 2. Graha Yuddha (ग्रहयुद्ध - Ch. 17): 4 Planetary Warfare states (Bhedana, Ullekha, Anshumardana, Apasavya) & Victor determination.
 * 3. Ratna Pariksha (रत्नपरीक्षा - Ch. 80-83): Navaratna Gemstone examination, 4 Gunas, 4 Doshas, and astrological prescription.
 * 4. Dakargala (दकार्गल - Ch. 54): Subterranean hydrology, ground water exploration & elemental directional flow.
 * 5. Maha-Nimitta & Shakuna (निमित्त / शकुन - Ch. 86-96): Environmental portents, wind mandalas & omens.
 */

import { EphemerisResult, BrihatSamhitaAnalysis, KurmaChakraDirection, GrahaYuddhaEvent, RatnaParikshaGem } from "./types";

// ==========================================
// 1. KURMA CHAKRA (कूर्म विभाग) DEFINITIONS
// ==========================================

interface KurmaSectorDef {
  direction: "Central" | "East" | "South-East" | "South" | "South-West" | "West" | "North-West" | "North" | "North-East";
  sanskritDirection: string;
  rulingDeity: string;
  nakshatras: string[];
  classicalRegions: string;
  bioFieldAffinity: string;
}

const KURMA_SECTORS: KurmaSectorDef[] = [
  {
    direction: "Central",
    sanskritDirection: "Madhya Desha (मध्य देश)",
    rulingDeity: "Brahma (Supreme Creator)",
    nakshatras: ["Krittika", "Rohini", "Mrigashira"],
    classicalRegions: "Kurukshetra, Panchala, Mathura, Ayodhya, Central India",
    bioFieldAffinity: "Core vital organs, Navel (Nabhi), Solar Plexus, Central Equilibrium",
  },
  {
    direction: "East",
    sanskritDirection: "Purva Disha (पूर्व दिशा)",
    rulingDeity: "Indra (King of Devas)",
    nakshatras: ["Ardra", "Punarvasu", "Pushya"],
    classicalRegions: "Magadha, Vanga, Anga, Assam, Eastern Seaboard",
    bioFieldAffinity: "Face, Eyes, Royal Aura, Executive Leadership, Frontal Lobe",
  },
  {
    direction: "South-East",
    sanskritDirection: "Agneya Kona (आग्नेय कोण)",
    rulingDeity: "Agni (Cosmic Fire)",
    nakshatras: ["Ashlesha", "Magha", "Purva Phalguni"],
    classicalRegions: "Kosala, Kalinga, Andhra, Coastal Coromandel",
    bioFieldAffinity: "Right front limb, Metabolic Fire (Jatharagni), Passion, Ambition",
  },
  {
    direction: "South",
    sanskritDirection: "Dakshina Disha (दक्षिण दिशा)",
    rulingDeity: "Yama (Lord of Dharma & Justice)",
    nakshatras: ["Uttara Phalguni", "Hasta", "Chitra"],
    classicalRegions: "Dravida, Pandya, Chola, Kerala, Southern Ghats",
    bioFieldAffinity: "Right flank, Physical endurance, Structural bone marrow, Legal resilience",
  },
  {
    direction: "South-West",
    sanskritDirection: "Nairritya Kona (नैर्ऋत्य कोण)",
    rulingDeity: "Nirriti (Goddess of Dissolution)",
    nakshatras: ["Swati", "Vishakha", "Anuradha"],
    classicalRegions: "Pahlava, Konkan, Barbara, Saurashtra coast",
    bioFieldAffinity: "Right rear limb, Ancestral karmic grounding (Pitri Rina), Base Chakra",
  },
  {
    direction: "West",
    sanskritDirection: "Pashchima Disha (पश्चिम दिशा)",
    rulingDeity: "Varuna (Lord of Waters & Oceans)",
    nakshatras: ["Jyeshtha", "Mula", "Purva Ashadha"],
    classicalRegions: "Sindhu, Sauvira, Gujarat, Western Maritime trade",
    bioFieldAffinity: "Spinal base, Subconscious memory, Emotional fluid balance, Deep storage",
  },
  {
    direction: "North-West",
    sanskritDirection: "Vayavya Kona (वायव्य कोण)",
    rulingDeity: "Vayu (Cosmic Wind)",
    nakshatras: ["Uttara Ashadha", "Shravana", "Dhanishta"],
    classicalRegions: "Gandhara, Yavana, Panchanada (Punjab), Central Asia",
    bioFieldAffinity: "Left rear limb, Respiratory vigor, Speed, Global locomotion",
  },
  {
    direction: "North",
    sanskritDirection: "Uttara Disha (उत्तर दिशा)",
    rulingDeity: "Kubera (Lord of Wealth & Treasures)",
    nakshatras: ["Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada"],
    classicalRegions: "Himalayas, Kashmira, Gandhamadana, Uttarakuru",
    bioFieldAffinity: "Left flank, Wealth retention, Higher intellect, Mathematical acumen",
  },
  {
    direction: "North-East",
    sanskritDirection: "Ishanya Kona (ईशान कोण)",
    rulingDeity: "Ishana (Lord Shiva / Pure Consciousness)",
    nakshatras: ["Revati", "Ashwini", "Bharani"],
    classicalRegions: "Kailasha, Badari, Meru peaks, Sacred Sanctuaries",
    bioFieldAffinity: "Left front limb, Crown Chakra (Sahasrara), Spiritual intuition, Divine Grace",
  },
];

const NATURAL_BENEFICS = ["Jupiter", "Venus", "Mercury", "Moon"];
const NATURAL_MALEFICS = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"];

// ==========================================
// 2. RATNA PARIKSHA (रत्नपरीक्षा) GEM DEFINITIONS
// ==========================================

const NAVARATNAS: Record<string, {
  gemstoneName: string;
  sanskritName: string;
  mineralFamily: string;
  primaryColor: string;
  icon: string;
  weightRecommendationRatti: string;
  metal: string;
  wearingFinger: string;
  auspiciousDay: string;
  classicalVedicMantra: string;
  flawsToAvoid: string[];
  virtuesRequired: string[];
}> = {
  Sun: {
    gemstoneName: "Ruby",
    sanskritName: "Manikya (माणिक्य)",
    mineralFamily: "Corundum (Al2O3)",
    primaryColor: "Deep Pigeon-Blood Red",
    icon: "🔴",
    weightRecommendationRatti: "3.5 to 5.25 Ratti",
    metal: "22K Gold or Copper",
    wearingFinger: "Ring Finger (Anamika) of right hand",
    auspiciousDay: "Sunday during Shukla Paksha Sunrise",
    classicalVedicMantra: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः (Om Hraam Hreem Hroum Sah Suryaya Namah)",
    flawsToAvoid: ["Trasa (Internal feathers/fissures)", "Mala (Dull dirty spots)", "Kshara (Cloudy milky luster)", "Sharkara (Sandy quartz inclusions)"],
    virtuesRequired: ["Snigdha (Smooth silk luster)", "Swachha (Crystal clear transparency)", "Gaurava (Pleasant dense weight)", "Dipti (Radiant inner glow)"],
  },
  Moon: {
    gemstoneName: "Natural Pearl",
    sanskritName: "Mukta (मुक्ता)",
    mineralFamily: "Organic Biogenic Aragonite (CaCO3)",
    primaryColor: "Silvery Iridescent Moon-White",
    icon: "⚪",
    weightRecommendationRatti: "5.25 to 7.5 Ratti",
    metal: "Pure Silver (Chandi)",
    wearingFinger: "Little Finger (Kanishtha) or Ring Finger",
    auspiciousDay: "Monday evening / Shukla Paksha Sandhya",
    classicalVedicMantra: "ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः (Om Shraam Shreem Shroum Sah Chandraya Namah)",
    flawsToAvoid: ["Vikruti (Irregular pitted surface)", "Nisteja (Lack of orient/sheen)", "Raktarka (Reddish fiery defect)", "Sankara (Clay interior)"],
    virtuesRequired: ["Vritta (Spherical perfection)", "Kanti (Subtle pearl luster)", "Amala (Pristine cleanliness)", "Snigdha (Cool satiny touch)"],
  },
  Mars: {
    gemstoneName: "Red Coral",
    sanskritName: "Pravala / Moonga (प्रवाल)",
    mineralFamily: "Organic Calcite (Corallium Rubrum)",
    primaryColor: "Vibrant Ox-Blood Carnelian Red",
    icon: "🟠",
    weightRecommendationRatti: "6.5 to 9.25 Ratti",
    metal: "Gold or Copper",
    wearingFinger: "Ring Finger (Anamika)",
    auspiciousDay: "Tuesday morning during Sunrise",
    classicalVedicMantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः (Om Kraam Kreem Kroum Sah Bhaumaya Namah)",
    flawsToAvoid: ["Randra (Perforated pores/holes)", "Varna-Bheda (Uneven patchiness)", "Pinda-Bhanga (Deep internal cracks)", "Kshara (Chalky spots)"],
    virtuesRequired: ["Gaurava (Dense solid weight)", "Raktavarna (Uniform vermillion hue)", "Snigdha (Waxen smooth polish)", "Sujata (Natural unbroken tubular form)"],
  },
  Mercury: {
    gemstoneName: "Emerald",
    sanskritName: "Marakata / Panna (मरकत)",
    mineralFamily: "Beryl (Be3Al2(SiO3)6 with Cr/V)",
    primaryColor: "Lush Vivid Forest Green",
    icon: "🟢",
    weightRecommendationRatti: "3.25 to 5.5 Ratti",
    metal: "Gold or Bronze",
    wearingFinger: "Little Finger (Kanishtha)",
    auspiciousDay: "Wednesday morning during Sunrise",
    classicalVedicMantra: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः (Om Braam Breem Broum Sah Budhaya Namah)",
    flawsToAvoid: ["Trasa (Brittle dry fracture)", "Mala (Muddy murky veil)", "Chhipra (White quartz grain)", "Vishamata (Disproportionate zoning)"],
    virtuesRequired: ["Varna-Madhurya (Soothing green hue)", "Gaurava (Solid density)", "Prasanna (Bright uplifting clarity)", "Snigdha (Oil-velvet luster)"],
  },
  Jupiter: {
    gemstoneName: "Yellow Sapphire",
    sanskritName: "Pushparaga / Pukhraj (पुष्पराग)",
    mineralFamily: "Corundum (Al2O3 with Fe3+)",
    primaryColor: "Bright Canary Lemon-Gold",
    icon: "🟡",
    weightRecommendationRatti: "4.25 to 6.5 Ratti",
    metal: "22K Gold or Brass",
    wearingFinger: "Index Finger (Tarjani)",
    auspiciousDay: "Thursday morning during Brahma Muhurta / Sunrise",
    classicalVedicMantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः (Om Graam Greem Groum Sah Gurave Namah)",
    flawsToAvoid: ["Dugdha (Milky foggy veil)", "Trasa (Internal cleft lines)", "Asita (Dark shadow spots)", "Jada (Dull lifeless light)"],
    virtuesRequired: ["Guru-Gaurava (High specific gravity)", "Swachha (Pristine transparency)", "Kanchana-Prabha (Golden brilliance)", "Snigdha (Pleasant unctuous texture)"],
  },
  Venus: {
    gemstoneName: "Diamond / White Sapphire",
    sanskritName: "Vajra / Heera (वज्र)",
    mineralFamily: "Pure Crystallized Carbon (C)",
    primaryColor: "Prismatic D-E Colorless Fire",
    icon: "💎",
    weightRecommendationRatti: "0.5 to 1.5 Carats (Diamond) or 4-6 Ratti (White Sapphire)",
    metal: "Platinum, White Gold or Silver",
    wearingFinger: "Middle Finger (Madhyama) or Little Finger",
    auspiciousDay: "Friday morning Sunrise",
    classicalVedicMantra: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः (Om Draam Dreem Droum Sah Shukraya Namah)",
    flawsToAvoid: ["Mala (Dark carbon inclusion)", "Bindu (Black dot pinpoint)", "Rekha (Surface hairline scratches)", "Kakapada (Crow-foot star cracks)"],
    virtuesRequired: ["Vidyut-Prabha (Lightning-like dispersion)", "Kalyana (Hexagonal/Octahedral symmetry)", "Abhedya (Supreme scratch hardness 10)", "Tiraskar (Floating light buoyancy)"],
  },
  Saturn: {
    gemstoneName: "Blue Sapphire",
    sanskritName: "Neelam / Shani-Priya (नीलम)",
    mineralFamily: "Corundum (Al2O3 with Fe2+/Ti4+)",
    primaryColor: "Royal Peacock Cornflower Blue",
    icon: "🔵",
    weightRecommendationRatti: "4.5 to 6.25 Ratti",
    metal: "Panchadhatu, White Gold, or Sterling Silver",
    wearingFinger: "Middle Finger (Madhyama)",
    auspiciousDay: "Saturday evening twilight / Sunset",
    classicalVedicMantra: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः (Om Praam Preem Proum Sah Shanaishcharaya Namah)",
    flawsToAvoid: ["Rakta-Bindu (Blood-red internal speck)", "Dugdha (Milky haze dulling ray)", "Trasa (Internal feather cleavage)", "Chiraka (Cracked crystal border)"],
    virtuesRequired: ["Neela-Dipti (Deep luminous blue ray)", "Gaurava (Heavy dense feel)", "Nirmala (Free from smoky veil)", "Snigdha (Sleek mirror finish)"],
  },
  Rahu: {
    gemstoneName: "Hessonite Garnet",
    sanskritName: "Gomedha (गोमेद)",
    mineralFamily: "Grossularite Garnet (Ca3Al2(SiO4)3)",
    primaryColor: "Deep Cinnamon Honey-Amber",
    icon: "🟤",
    weightRecommendationRatti: "5.5 to 8.25 Ratti",
    metal: "Silver or Ashtadhatu",
    wearingFinger: "Middle Finger (Madhyama)",
    auspiciousDay: "Saturday during Rahu Hora / Saturday night",
    classicalVedicMantra: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः (Om Bhraam Bhreem Bhroum Sah Rahave Namah)",
    flawsToAvoid: ["Kshara (Chalky dullness)", "Patala (Muddy brown black patches)", "Bhanga (Internal fractures)", "Laghu (Lightweight hollow glass feel)"],
    virtuesRequired: ["Madhu-Varna (Pure honey clarity)", "Snigdha (Smooth oil luster)", "Samata (Uniform color saturation)", "Gaurava (Dense weight)"],
  },
  Ketu: {
    gemstoneName: "Cat's Eye Chrysoberyl",
    sanskritName: "Vaidurya / Lahsuniya (वैदूर्य)",
    mineralFamily: "Chrysoberyl (BeAl2O4 with Chatoyancy)",
    primaryColor: "Golden Honey-Green with Silvery Chatoyant Ray",
    icon: "👁️",
    weightRecommendationRatti: "4.25 to 6.5 Ratti",
    metal: "Gold or Sterling Silver",
    wearingFinger: "Little Finger (Kanishtha) or Ring Finger",
    auspiciousDay: "Tuesday or Thursday night",
    classicalVedicMantra: "ॐ स्रां स्रीं स्रौं सः केतवे नमः (Om Sraam Sreem Sroum Sah Ketave Namah)",
    flawsToAvoid: ["Kshata (Broken chatoyant ray)", "Nisteja (Dull ray that doesn't open/close with tilt)", "Rakta-Rekha (Red streak in ray)", "Jada (Opaque cloudy stone)"],
    virtuesRequired: ["Chhatrachhaya (Sharp central silk band)", "Dipti (High brilliance)", "Gaurava (Dense solid crystal)", "Sutradhari (Continuous laser-like optical band)"],
  },
};

// ==========================================
// 3. CORE COMPUTATION ALGORITHMS
// ==========================================

/**
 * Calculates the 9-Directional Kurma Chakra sectors and evaluates transit/natal planetary stress.
 */
export function calculateKurmaChakra(ephemeris: EphemerisResult): {
  sectors: Record<string, KurmaChakraDirection>;
  mostAfflictedDirection: string;
  mostFortifiedDirection: string;
  cosmicSynthesis: string;
} {
  const sectors: Record<string, KurmaChakraDirection> = {};

  // Build sector containers
  for (const def of KURMA_SECTORS) {
    sectors[def.direction] = {
      direction: def.direction,
      sanskritDirection: def.sanskritDirection,
      rulingDeity: def.rulingDeity,
      nakshatras: def.nakshatras,
      planetsPresent: [],
      beneficCount: 0,
      maleficCount: 0,
      afflictionScore: 0,
      classicalRegions: def.classicalRegions,
      bioFieldAffinity: def.bioFieldAffinity,
      status: "Balanced",
    };
  }

  // Map each planet to its Kurma Chakra sector based on its Nakshatra
  const allPlanets = Object.values(ephemeris.planets);
  for (const p of allPlanets) {
    if (p.isUpagraha || p.isModernPlanet) continue;
    const nakName = p.nakshatra.sanskritName;

    // Find which sector contains this nakshatra
    for (const def of KURMA_SECTORS) {
      if (def.nakshatras.some((n) => nakName.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(nakName.toLowerCase()))) {
        sectors[def.direction].planetsPresent.push(p.name);
        if (NATURAL_BENEFICS.includes(p.name)) {
          sectors[def.direction].beneficCount++;
        }
        if (NATURAL_MALEFICS.includes(p.name)) {
          sectors[def.direction].maleficCount++;
        }
        break;
      }
    }
  }

  // Calculate scores and statuses
  let highestAffliction = -1;
  let mostAfflicted = "Central";
  let lowestAffliction = 999;
  let mostFortified = "Central";

  for (const [dir, sec] of Object.entries(sectors)) {
    const net = sec.maleficCount * 30 - sec.beneficCount * 25;
    const score = Math.max(0, Math.min(100, 30 + net));
    sec.afflictionScore = score;

    if (score >= 70) {
      sec.status = "Severely Vulnerable";
    } else if (score >= 50) {
      sec.status = "Afflicted";
    } else if (score <= 20 && sec.beneficCount > 0) {
      sec.status = "Fortified";
    } else {
      sec.status = "Balanced";
    }

    if (score > highestAffliction) {
      highestAffliction = score;
      mostAfflicted = dir;
    }
    if (score < lowestAffliction) {
      lowestAffliction = score;
      mostFortified = dir;
    }
  }

  const cosmicSynthesis = `Kurma Chakra indicates maximum spatial fortification along ${sectors[mostFortified].sanskritDirection} (supported by ${sectors[mostFortified].planetsPresent.length ? sectors[mostFortified].planetsPresent.join(", ") : "serene balance"}), while ${sectors[mostAfflicted].sanskritDirection} experiences peak planetary friction (${sectors[mostAfflicted].status} with ${sectors[mostAfflicted].maleficCount} malefic rays).`;

  return {
    sectors,
    mostAfflictedDirection: mostAfflicted,
    mostFortifiedDirection: mostFortified,
    cosmicSynthesis,
  };
}

/**
 * Calculates Graha Yuddha (Planetary Warfare) between the 5 Taragrahas (Mars, Mercury, Jupiter, Venus, Saturn).
 * Conjunction within 1.0 degree constitutes planetary warfare (B.S. Ch. 17).
 */
export function calculateGrahaYuddhas(ephemeris: EphemerisResult): GrahaYuddhaEvent[] {
  const TARAGRAHAS = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const yuddhas: GrahaYuddhaEvent[] = [];

  const planets = Object.values(ephemeris.planets).filter((p) => TARAGRAHAS.includes(p.name));

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];

      let diff = Math.abs(p1.siderealLongitude - p2.siderealLongitude);
      if (diff > 180) diff = 360 - diff;

      // Graha Yuddha threshold: <= 1.0 degree (60 arcminutes)
      if (diff <= 1.0) {
        // Classify Warfare State (Brihat Samhita Ch. 17 Slokas 1-4)
        let warfareType: "Bhedana" | "Ullekha" | "Anshumardana" | "Apasavya" = "Anshumardana";
        let warfareTypeSanskrit = "अंशुमर्दन (Anshumardana - Ray Clashing)";
        let description = "";

        if (diff < 0.15) {
          warfareType = "Bhedana";
          warfareTypeSanskrit = "भेदन (Bhedana - Cleaving & Occultation)";
          description = "Direct disc penetration / severe planetary eclipse. Complete suppression of defeated planet's significations; high volatility.";
        } else if (diff < 0.35) {
          warfareType = "Ullekha";
          warfareTypeSanskrit = "उल्लेख (Ullekha - Grazing Combat)";
          description = "Planetary rims graze. Intense competitive friction, administrative upheaval, and sharp ideological polarization.";
        } else if (p1.isRetrograde || p2.isRetrograde || diff >= 0.70) {
          warfareType = "Apasavya";
          warfareTypeSanskrit = "अपसव्य (Apasavya - Retrograde / Asymmetrical Strike)";
          description = "Combatant undergoes retrograde counter-motion. Unpredictable karmic surprises, reversals in agreements, and covert friction.";
        } else {
          warfareType = "Anshumardana";
          warfareTypeSanskrit = "अंशुमर्दन (Anshumardana - Radiant Ray Collision)";
          description = "Light beams interlock. Fierce rivalry, dynamic debates, and fluctuating power dynamics.";
        }

        // Victor Determination (Jayi Graha)
        // According to Varahamihira:
        // 1. Higher northern declination / latitude
        // 2. Natural brilliance hierarchy: Venus > Jupiter > Mercury > Mars > Saturn
        // 3. Direct motion vs retrograde
        const brillianceHierarchy: Record<string, number> = {
          Venus: 5,
          Jupiter: 4,
          Mercury: 3,
          Mars: 2,
          Saturn: 1,
        };

        const score1 = (p1.latitude || 0) * 2 + (brillianceHierarchy[p1.name] || 0) + (p1.isRetrograde ? -1 : 1);
        const score2 = (p2.latitude || 0) * 2 + (brillianceHierarchy[p2.name] || 0) + (p2.isRetrograde ? -1 : 1);

        const victorPlanet = score1 >= score2 ? p1.name : p2.name;
        const defeatedPlanet = score1 >= score2 ? p2.name : p1.name;
        const victorReason = `${victorPlanet} triumphs through superior northern ray angle and natural luminary fortitude over ${defeatedPlanet}.`;

        const mundaneImpact = `Intense global focus on ${victorPlanet}'s domains over ${defeatedPlanet}'s portfolio. Market volatility in linked commodities.`;
        const natalImpact = `${victorPlanet}'s house lordship flourishes with heightened sharpness, whereas ${defeatedPlanet}'s houses face initial hurdles requiring conscious remedial mastery.`;

        yuddhas.push({
          planet1: p1.name,
          planet2: p2.name,
          separationDegrees: parseFloat(diff.toFixed(4)),
          warfareType,
          warfareTypeSanskrit,
          description,
          victorPlanet,
          defeatedPlanet,
          victorReason,
          mundaneImpact,
          natalImpact,
        });
      }
    }
  }

  return yuddhas;
}

/**
 * Evaluates Ratna Pariksha (Gemstone Examination & Prescription) based on Varahamihira's classical rules.
 */
export function evaluateRatnaPariksha(ephemeris: EphemerisResult): {
  primaryGem: RatnaParikshaGem;
  secondaryGem?: RatnaParikshaGem;
  cautionGems: RatnaParikshaGem[];
  allGems: RatnaParikshaGem[];
  masterGemGuidance: string;
} {
  const ascSign = ephemeris.ascendant.rashi.index; // 0 = Aries

  // Identify Functional Benefics & Yogakarakas based on Ascendant
  // Standard Parashari & Varahamihira functional rules
  const lagnaLordMap = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  const lagnaLord = lagnaLordMap[ascSign];

  const yogakarakaMap: Record<number, string> = {
    1: "Saturn", // Taurus Lagna -> Saturn is 9th & 10th lord
    3: "Mars",   // Cancer Lagna -> Mars is 5th & 10th lord
    4: "Mars",   // Leo Lagna -> Mars is 4th & 9th lord
    6: "Saturn", // Libra Lagna -> Saturn is 4th & 5th lord
    9: "Venus",  // Capricorn Lagna -> Venus is 5th & 10th lord
    10: "Venus", // Aquarius Lagna -> Venus is 4th & 9th lord
  };

  const yogakaraka = yogakarakaMap[ascSign];

  const allGems: RatnaParikshaGem[] = [];
  const cautionGems: RatnaParikshaGem[] = [];

  for (const [planetName, meta] of Object.entries(NAVARATNAS)) {
    let suitability: "Highly Recommended" | "Benefic Secondary" | "Neutral / Prudent" | "Strictly Prohibited" = "Neutral / Prudent";
    let justification = "";

    const isLagnaLord = planetName === lagnaLord;
    const isYogakaraka = planetName === yogakaraka;

    // Check if planet is in 6th, 8th, or 12th house in natal chart
    const planetObj = ephemeris.planets[planetName];
    const house = planetObj?.house || 1;
    const isDusthana = [6, 8, 12].includes(house);

    if (isLagnaLord) {
      suitability = "Highly Recommended";
      justification = `Supreme Life-Stone (Jeeva Ratna). Enhances vitality, immune fortitude, self-actualization, and sovereign authority of the Ascendant.`;
    } else if (isYogakaraka) {
      suitability = "Highly Recommended";
      justification = `Supreme Fortune-Stone (Bhagya Ratna). As Raja Yogakaraka, amplifies rapid professional ascension, dharma, and lasting prosperity.`;
    } else if (["Jupiter", "Venus", "Mercury"].includes(planetName) && !isDusthana) {
      suitability = "Benefic Secondary";
      justification = `Auspicious supporting gem to fortify intellectual faculties, auspicious relationships, and higher wisdom.`;
    } else if (["Rahu", "Ketu", "Saturn", "Mars"].includes(planetName) && isDusthana) {
      suitability = "Strictly Prohibited";
      justification = `Malefic planet situated in sensitive House ${house}. Wearing this gemstone will aggressively magnify structural friction, health strain, and hidden obstacles.`;
    } else {
      suitability = "Neutral / Prudent";
      justification = `Requires specific Mahadasha activation and tailored expert consultation prior to consecration.`;
    }

    const gem: RatnaParikshaGem = {
      planet: planetName,
      gemstoneName: meta.gemstoneName,
      sanskritName: meta.sanskritName,
      mineralFamily: meta.mineralFamily,
      primaryColor: meta.primaryColor,
      icon: meta.icon,
      weightRecommendationRatti: meta.weightRecommendationRatti,
      metal: meta.metal,
      wearingFinger: meta.wearingFinger,
      auspiciousDay: meta.auspiciousDay,
      classicalVedicMantra: meta.classicalVedicMantra,
      flawsToAvoid: meta.flawsToAvoid,
      virtuesRequired: meta.virtuesRequired,
      suitability,
      justification,
    };

    allGems.push(gem);
    if (suitability === "Strictly Prohibited") {
      cautionGems.push(gem);
    }
  }

  // Pick primary and secondary gems
  const primaryGem = allGems.find((g) => g.planet === lagnaLord) || allGems[0];
  const secondaryGem = allGems.find((g) => g.planet === yogakaraka) || allGems.find((g) => g.suitability === "Benefic Secondary");

  const masterGemGuidance = `Acharya Varahamihira's Ratna Pariksha strongly prescribes **${primaryGem.gemstoneName} (${primaryGem.sanskritName})** set in ${primaryGem.metal} on ${primaryGem.wearingFinger} as the primary talisman.${secondaryGem ? ` **${secondaryGem.gemstoneName} (${secondaryGem.sanskritName})** serves as the optimal fortune harmonizer.` : ""} Ensure complete avoidance of stones exhibiting the 4 classical Doshas (*Trasa*, *Mala*, *Kshara*, *Sharkara*).`;

  return {
    primaryGem,
    secondaryGem,
    cautionGems,
    allGems,
    masterGemGuidance,
  };
}

/**
 * Master evaluator for Acharya Varahamihira's Brihat Samhita suite.
 */
export function evaluateBrihatSamhita(ephemeris: EphemerisResult): BrihatSamhitaAnalysis {
  const kurma = calculateKurmaChakra(ephemeris);
  const yuddhas = calculateGrahaYuddhas(ephemeris);
  const gems = evaluateRatnaPariksha(ephemeris);

  // Environmental & Dakargala Hydrology Metrics
  const elementalScores = {
    "Agni (Fire)": 0,
    "Prithvi (Earth)": 0,
    "Vayu (Air)": 0,
    "Jala (Water)": 0,
  };

  for (const p of Object.values(ephemeris.planets)) {
    if (p.isUpagraha || p.isModernPlanet) continue;
    const elem = p.rashi.element;
    if (elem === "Fire") elementalScores["Agni (Fire)"] += 25;
    if (elem === "Earth") elementalScores["Prithvi (Earth)"] += 25;
    if (elem === "Air") elementalScores["Vayu (Air)"] += 25;
    if (elem === "Water") elementalScores["Jala (Water)"] += 25;
  }

  const elementalDominance = (Object.entries(elementalScores).sort((a, b) => b[1] - a[1])[0][0] as any) || "Agni (Fire)";

  const dakargalaGroundWaterIndex = Math.min(100, Math.round(elementalScores["Jala (Water)"] * 0.8 + 20));
  const dakargalaWaterVerdict = dakargalaGroundWaterIndex >= 60
    ? "Rich subterranean water veins detected in North and North-East quadrants at shallow depths (15–25 Purushas)."
    : "Moderate water table; deep borewell exploration recommended in Eastern or Northern directional corridors.";

  const nimittaSignatures = [
    `Vayu Mandala: Governed by ${kurma.mostFortifiedDirection} quadrant currents promoting steady atmospheric equilibrium.`,
    `Shakuna Vector: Auspicious orientation for journeys and architectural ground-breaking along ${kurma.mostFortifiedDirection}.`,
    `Planetary Combat Status: ${yuddhas.length > 0 ? `${yuddhas.length} active Graha Yuddha events detected.` : "No planetary warfare friction; peaceful celestial rays."}`,
  ];

  const masterBrihatSamhitaSynthesis = `Acharya Varahamihira's Brihat Samhita reveals a predominantly **${elementalDominance}** cosmic signature. Kurma Chakra concentrates optimal spatial fortification in **${kurma.sectors[kurma.mostFortifiedDirection].sanskritDirection}**, while ${kurma.sectors[kurma.mostAfflictedDirection].sanskritDirection} requires prudent remediation. ${yuddhas.length > 0 ? `Active Graha Yuddha between ${yuddhas.map((y) => `${y.planet1} vs ${y.planet2} (${y.warfareType})`).join(", ")} requires conscious management.` : "No active planetary wars perturb the celestial harmony."} Gemstone prescription centers on **${gems.primaryGem.gemstoneName}** for sovereign vitality.`;

  return {
    kurmaChakra: kurma,
    grahaYuddhas: yuddhas,
    hasActiveGrahaYuddha: yuddhas.length > 0,
    ratnaPariksha: gems,
    environmentalMundane: {
      elementalDominance,
      vayuMandalaStatus: `Balanced flow across ${kurma.mostFortifiedDirection}`,
      dakargalaGroundWaterIndex,
      dakargalaWaterVerdict,
      nimittaSignatures,
    },
    masterBrihatSamhitaSynthesis,
  };
}
