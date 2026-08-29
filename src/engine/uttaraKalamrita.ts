/**
 * Classical Mahakavi Kalidasa's Uttara Kalamrita Engine (उत्तर कालामृतम्)
 * Reference:
 * - "Uttara Kalamrita" by Mahakavi Kalidasa
 *
 * Core Classical Pillars:
 * 1. Quintessential Viparita Raja Yoga (Harsha, Sarala, Vimala per Khanda 4, Sloka 22).
 * 2. Shukra-Shani Dasha Mutual Paradox (Khanda 4, Slokas 28-29).
 * 3. Rahu & Ketu Yogakaraka & Shadow Dispositor Mechanics (Khanda 4, Slokas 25-26).
 * 4. Vakra Graha (Retrograde Exaltation Equivalence) Potency.
 * 5. Exhaustive Planetary & Bhava Karakatva Repository.
 */

import {
  EphemerisResult,
  UttaraKalamritaAnalysis,
  UttaraViparitaYoga,
  UttaraShukraShaniParadox,
  UttaraNodeMechanics,
  UttaraVakraPotency,
} from "./types";

const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

const KALIDASA_KARAKATVAS: Record<string, string[]> = {
  Sun: ["Atma (Soul Authority)", "Father & Paternal Lineage", "Royal Patronage & State Power", "Gold & Copper", "Vital Prana & Vision", "Valour & Renown"],
  Moon: ["Manas (Subconscious Mind)", "Mother & Maternal Grace", "Pearls & Silver", "Water Bodies & Maritime Wealth", "Empathy & Public Popularity", "Mental Serenity"],
  Mars: ["Bhratri (Siblings & Comrades)", "Real Estate, Lands & Immovable Assets", "Courage & Tactical Precision", "Surgery, Fire & Defense", "Metals & Mineral Ores", "Executive Will"],
  Mercury: ["Buddhi (Analytical Intellect)", "Mathematics & Data Science", "Speech, Literature & Commerce", "Diplomatic Arbiter", "Green Emerald & Trading Markets", "Humor & Wit"],
  Jupiter: ["Guru (Spiritual Wisdom & Preceptor)", "Progeny & Family Lineage", "Jurisprudence & Constitutional Law", "Divine Grace & High Morals", "Wealth (Artha) & Gold", "Spiritual Enlightenment"],
  Venus: ["Kalatra (Spouse & Conjugal Affection)", "Haute Couture, Cinema & Aesthetic Arts", "Vehicles, Mansions & Luxuries", "Diamond & Silver", "Sperm/Ovum Reproductive Purity", "Diplomatic Charm"],
  Saturn: ["Ayush (Longevity & Endurance)", "Working Class & Labor Force", "Iron, Steel, Heavy Machinery & Petroleum", "Patience Under Adversity", "Detachment & Renunciation", "Judicial Rectitude"],
  Rahu: ["Foreign Immersion & Transnational Trade", "Unconventional Innovation & Technology", "Gomedha (Hessonite) & Occult Mysticism", "Sudden Breakthroughs & Media Fame", "Paternal Grandfather", "Ambitious Expansion"],
  Ketu: ["Moksha (Liberation & Ultimate Awakening)", "Cat's Eye (Vaidurya) & Subtle Perception", "Spiritual Mastery & Yogic Insight", "Maternal Grandfather", "Occult Healing & Asceticism", "Karmic Detachment"],
};

export function evaluateUttaraKalamrita(natalEphemeris: EphemerisResult): UttaraKalamritaAnalysis {
  const ascSignIdx = Math.floor(natalEphemeris.ascendant.siderealLongitude / 30);
  const planets = natalEphemeris.planets;

  // Helper: Find Lord of house N
  const getHouseLord = (hNum: number): string => {
    const sIdx = (ascSignIdx + hNum - 1) % 12;
    return SIGN_LORDS[sIdx];
  };

  const lord6 = getHouseLord(6);
  const lord8 = getHouseLord(8);
  const lord12 = getHouseLord(12);

  const p6 = planets[lord6];
  const p8 = planets[lord8];
  const p12 = planets[lord12];

  const h6Placed = p6 ? p6.house : 6;
  const h8Placed = p8 ? p8.house : 8;
  const h12Placed = p12 ? p12.house : 12;

  const dusthanas = [6, 8, 12];

  // 1. Quintessential Viparita Raja Yoga (Khanda 4, Sloka 22)
  const isHarsha = dusthanas.includes(h6Placed);
  const isSarala = dusthanas.includes(h8Placed);
  const isVimala = dusthanas.includes(h12Placed);

  const viparitaRajaYogas: UttaraViparitaYoga[] = [
    {
      yogaName: "Harsha Yoga (हर्ष योग)",
      isActive: isHarsha,
      dusthanaLord: `6th Lord (${lord6})`,
      participatingPlanet: lord6,
      placedHouse: h6Placed,
      potency: isHarsha ? ([8, 12].includes(h6Placed) ? "Pure Classical VRY (अति प्रबल)" : "Moderate VRY (मध्यम)") : "Inactive",
      kalidasaDictum: "Khanda 4 Sloka 22: When 6th lord is in 6th, 8th, or 12th, native is blessed with invincible health, triumph over rivals, and great happiness.",
      effects: isHarsha
        ? `Harsha Yoga active: ${lord6} placed in House ${h6Placed}. Bestows disease immunity, financial resilience, and supremacy over opposition.`
        : "6th lord is placed outside Dusthanas.",
    },
    {
      yogaName: "Sarala Yoga (सरल योग)",
      isActive: isSarala,
      dusthanaLord: `8th Lord (${lord8})`,
      participatingPlanet: lord8,
      placedHouse: h8Placed,
      potency: isSarala ? ([6, 12].includes(h8Placed) ? "Pure Classical VRY (अति प्रबल)" : "Moderate VRY (मध्यम)") : "Inactive",
      kalidasaDictum: "Khanda 4 Sloka 22: When 8th lord is in 6th, 8th, or 12th, native is fearless, long-lived, scholarly, and gains sudden windfall prosperity.",
      effects: isSarala
        ? `Sarala Yoga active: ${lord8} placed in House ${h8Placed}. Bestows profound courage, longevity, and unexpected breakthroughs through sudden transformations.`
        : "8th lord is placed outside Dusthanas.",
    },
    {
      yogaName: "Vimala Yoga (विमल योग)",
      isActive: isVimala,
      dusthanaLord: `12th Lord (${lord12})`,
      participatingPlanet: lord12,
      placedHouse: h12Placed,
      potency: isVimala ? ([6, 8].includes(h12Placed) ? "Pure Classical VRY (अति प्रबल)" : "Moderate VRY (मध्यम)") : "Inactive",
      kalidasaDictum: "Khanda 4 Sloka 22: When 12th lord is in 6th, 8th, or 12th, native spends on noble causes, preserves righteous wealth, and enjoys serene contentment.",
      effects: isVimala
        ? `Vimala Yoga active: ${lord12} placed in House ${h12Placed}. Eliminates wasteful loss, attracts noble foreign opportunities, and confers peaceful independence.`
        : "12th lord is placed outside Dusthanas.",
    },
  ];

  // 2. Shukra-Shani Dasha Mutual Paradox (Khanda 4, Slokas 28-29)
  const venObj = planets.Venus;
  const satObj = planets.Saturn;

  const venHouse = venObj ? venObj.house : 1;
  const satHouse = satObj ? satObj.house : 1;

  const isVenStrong = [1, 4, 7, 10, 5, 9].includes(venHouse);
  const isSatStrong = [1, 4, 7, 10, 5, 9].includes(satHouse);
  const isVenDusthana = dusthanas.includes(venHouse);
  const isSatDusthana = dusthanas.includes(satHouse);

  let paradoxType: UttaraShukraShaniParadox["paradoxType"] = "Balanced Interplay (संतुलित फल)";
  let mutualDashaEffect = "Venus and Saturn interact with standard planetary dignity, balancing aesthetic joy with structural duty.";
  const kalidasaRule = "Khanda 4 Slokas 28-29: When Venus and Saturn are both strong, their mutual Dasha-Bhukti brings detachment or unexpected trials; when both are weak/dusthana-bound, they paradoxically deliver extraordinary wealth and worldly fortune!";

  if (isVenStrong && isSatStrong) {
    paradoxType = "Ascetic Detachment / Hidden Friction (अपेक्षित फल विपरीतता)";
    mutualDashaEffect = "Both Venus and Saturn are well-placed in Kendras/Trikonas. Per Kalidasa's Paradox, their mutual Dasha-Bhukti induces unexpected career pivot, austerity, or emotional detachment rather than pure material luxury.";
  } else if (isVenDusthana && isSatDusthana) {
    paradoxType = "Sudden Mundane Wealth / Unexpected Rise (अप्रत्याशित धन लाभ)";
    mutualDashaEffect = "Both Venus and Saturn are posited in Dusthana houses. Per Kalidasa's Paradox, their mutual Dasha-Bhukti triggers sudden windfall gains, hidden asset acquisition, and remarkable mundane breakthroughs!";
  }

  const shukraShaniParadox: UttaraShukraShaniParadox = {
    venusDignity: `Venus in House ${venHouse}`,
    saturnDignity: `Saturn in House ${satHouse}`,
    paradoxType,
    mutualDashaEffect,
    kalidasaRule,
  };

  // 3. Rahu & Ketu Yogakaraka Mechanics (Khanda 4, Slokas 25-26)
  const nodeMechanics: UttaraNodeMechanics[] = [];
  const nodes = ["Rahu", "Ketu"] as const;

  for (const nName of nodes) {
    const nObj = planets[nName];
    if (!nObj) continue;

    const nHouse = nObj.house;
    const nSignIdx = Math.floor(nObj.siderealLongitude / 30);
    const dispositor = SIGN_LORDS[nSignIdx];

    const isKendra = [1, 4, 7, 10].includes(nHouse);
    const isTrikona = [5, 9].includes(nHouse);

    // Conjoined planets
    const conjoined = Object.entries(planets)
      .filter(([name, p]) => name !== nName && p.house === nHouse && !p.isModernPlanet && !p.isUpagraha)
      .map(([name]) => name);

    let isYogakaraka = false;
    let fruitionPattern = `${nName} acts as shadow multiplier for dispositor ${dispositor}, delivering House ${nHouse} affairs.`;

    if ((isKendra && [5, 9].includes(planets[dispositor]?.house || 0)) ||
        (isTrikona && [1, 4, 7, 10].includes(planets[dispositor]?.house || 0))) {
      isYogakaraka = true;
      fruitionPattern = `Mahakavi Kalidasa Sloka 25: ${nName} is in ${isKendra ? "Kendra" : "Trikona"} connected with ${dispositor} (${isKendra ? "Trikona" : "Kendra"} Lord), transforming into an exalted Yogakaraka producing immense authority and prosperity!`;
    }

    nodeMechanics.push({
      nodeName: nName,
      house: nHouse,
      dispositor,
      isYogakaraka,
      conjoinedPlanets: conjoined,
      aspectedBy: [],
      fruitionPattern,
    });
  }

  // 4. Vakra Graha (Retrograde Exaltation Equivalence)
  const vakraPotencies: UttaraVakraPotency[] = [];
  const checkedVakra = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  for (const pName of checkedVakra) {
    const pObj = planets[pName];
    if (!pObj) continue;

    const isRetro = pObj.isRetrograde;
    vakraPotencies.push({
      planetName: pName,
      isRetrograde: isRetro,
      uchchaEquivalence: isRetro,
      potencyScore: isRetro ? 100 : 70,
      effectDescription: isRetro
        ? `Vakra Potency Active: Per Mahakavi Kalidasa, ${pName} in retrogression acts with the full strength of an exalted (Uchcha) Graha, casting intense backward house influence.`
        : `${pName} is in direct motion with standard forward progression.`,
    });
  }

  // 5. Karakatva Highlights
  const karakatvaHighlights = Object.entries(KALIDASA_KARAKATVAS).map(([graha, significations]) => ({
    graha,
    significations,
  }));

  // Master Synthesis
  const activeVrys = viparitaRajaYogas.filter((v) => v.isActive).map((v) => v.yogaName.split(" (")[0]).join(", ") || "None Active";
  const retroPlanets = vakraPotencies.filter((v) => v.isRetrograde).map((v) => v.planetName).join(", ") || "None";

  const masterUttaraKalamritaSynthesis = `Mahakavi Kalidasa Uttara Kalamrita Synthesis: Viparita Raja Yoga active: **${activeVrys}**. Shukra-Shani Mutual Dasha manifests **${paradoxType.split(" (")[0]}**. Retrograde Uchcha-Equivalence active for Graha(s): **${retroPlanets}**. Rahu is posited in House ${planets.Rahu?.house || 1} under ${SIGN_LORDS[Math.floor((planets.Rahu?.siderealLongitude || 0) / 30)]} dispositorship.`;

  return {
    viparitaRajaYogas,
    shukraShaniParadox,
    nodeMechanics,
    vakraPotencies,
    karakatvaHighlights,
    masterUttaraKalamritaSynthesis,
  };
}
