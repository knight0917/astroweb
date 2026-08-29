/**
 * Empirical Benchmark Horoscopes & Archetypal Karmic Resonance Engine
 * References:
 * - Kala Software Empirical Research Charts Database
 * - Notable Horoscopes (Dr. B.V. Raman)
 * - Classical Raja/Dhana/Sanyasa Planetary Blueprints
 */

import { EphemerisResult, BenchmarkAnalysis, BenchmarkHoroscopeItem, ArchetypeResonanceScore } from "./types";
import { RASHI_NAMES } from "./constants";

export const BENCHMARK_TITANS: BenchmarkHoroscopeItem[] = [
  {
    id: "vivekananda",
    name: "Swami Vivekananda",
    category: "Philosophers & Gurus",
    birthData: { date: "January 12, 1863", time: "06:33 AM", place: "Kolkata, India" },
    lagnaSign: "Sagittarius",
    moonSign: "Virgo",
    keyPlanetarySignature: "Jupiter in 11th, Moon in 10th, Sun-Mercury-Venus in Lagna/2nd",
    paramountYogas: ["Kemadruma Bhanga", "Chatussagara Yoga", "Pravrajya Sanyasa Yoga"],
    destinyMilestone: "Global spiritual luminary; ignited the 1893 Chicago Parliament of Religions and founded the Ramakrishna Mission.",
  },
  {
    id: "ramana",
    name: "Bhagavan Ramana Maharshi",
    category: "Philosophers & Gurus",
    birthData: { date: "December 30, 1879", time: "01:00 AM", place: "Tiruchuzhi, India" },
    lagnaSign: "Libra",
    moonSign: "Gemini",
    keyPlanetarySignature: "Moon in 9th house of Dharma, Exalted Mars in 4th",
    paramountYogas: ["Ruchaka Mahapurusha", "Akhanda Samadhi Yoga", "Moksha Parivartana"],
    destinyMilestone: "Attained spontaneous Self-Realization at age 16; beacon of Advaita Vedanta on Arunachala Mountain.",
  },
  {
    id: "einstein",
    name: "Albert Einstein",
    category: "Scientists & Inventors",
    birthData: { date: "March 14, 1879", time: "11:30 AM", place: "Ulm, Germany" },
    lagnaSign: "Gemini",
    moonSign: "Sagittarius",
    keyPlanetarySignature: "10th house cluster of Mercury, Venus & Saturn in Pisces",
    paramountYogas: ["Neechabhanga Raja Yoga", "Malavya Yoga", "Budhaditya Yoga"],
    destinyMilestone: "Formulated General & Special Relativity, revolutionizing modern physics and human understanding of spacetime.",
  },
  {
    id: "tesla",
    name: "Nikola Tesla",
    category: "Scientists & Inventors",
    birthData: { date: "July 10, 1856", time: "00:00 AM", place: "Smiljan, Croatia" },
    lagnaSign: "Taurus",
    moonSign: "Libra",
    keyPlanetarySignature: "Mars in 6th house, Mercury & Saturn in Gemini 2nd",
    paramountYogas: ["Harsha Viparita Raja Yoga", "Saraswati Yoga", "Karmic Intuition Yoga"],
    destinyMilestone: "Invented Alternating Current (AC), wireless transmission concepts, and founded electrical power systems.",
  },
  {
    id: "ambani",
    name: "Dhirubhai Ambani",
    category: "Business Tycoons",
    birthData: { date: "December 28, 1932", time: "06:37 AM", place: "Chorwad, India" },
    lagnaSign: "Sagittarius",
    moonSign: "Sagittarius",
    keyPlanetarySignature: "Sun-Mercury in Lagna, Jupiter in 9th/10th, Saturn in 2nd",
    paramountYogas: ["Amala Raja Yoga", "Maha Lakshmi Yoga", "Vasumati Dhana Yoga"],
    destinyMilestone: "Built Reliance Industries from scratch into a global conglomerate through audacious equity leadership.",
  },
  {
    id: "gates",
    name: "Bill Gates",
    category: "Business Tycoons",
    birthData: { date: "October 28, 1955", time: "21:15 PM", place: "Seattle, USA" },
    lagnaSign: "Gemini",
    moonSign: "Pisces",
    keyPlanetarySignature: "Exalted Mercury in 4th (Bhadra), Moon-Mars in 10th (Chandra-Mangala)",
    paramountYogas: ["Bhadra Mahapurusha", "Chandra-Mangala Yoga", "Gajakesari Yoga"],
    destinyMilestone: "Co-founded Microsoft, pioneered personal computing revolution, and established world's premier philanthropic trust.",
  },
  {
    id: "gandhi",
    name: "Mahatma Gandhi",
    category: "Politicians & Rulers",
    birthData: { date: "October 2, 1869", time: "07:11 AM", place: "Porbandar, India" },
    lagnaSign: "Libra",
    moonSign: "Leo",
    keyPlanetarySignature: "Mars-Venus-Mercury in Lagna, Jupiter in 7th, Moon in 11th",
    paramountYogas: ["Srikanta Yoga", "Gajakesari Yoga", "Satyagraha Ahimsa Yoga"],
    destinyMilestone: "Father of the Nation; led India's independence movement through non-violent resistance and moral courage.",
  },
  {
    id: "tagore",
    name: "Rabindranath Tagore",
    category: "Artists & Authors",
    birthData: { date: "May 7, 1861", time: "04:02 AM", place: "Kolkata, India" },
    lagnaSign: "Pisces",
    moonSign: "Pisces",
    keyPlanetarySignature: "Jupiter in 5th of creativity, Sun-Mercury in 2nd, Venus in 1st",
    paramountYogas: ["Saraswati Yoga", "Hamsa Mahapurusha", "Kavi Raja Yoga"],
    destinyMilestone: "Nobel Laureate in Literature (Gitanjali), composer of national anthems, and creator of Visva-Bharati.",
  },
];

export function evaluateBenchmarkResonance(ephemeris: EphemerisResult): BenchmarkAnalysis {
  const planets = ephemeris.planets;
  const ascLon = ephemeris.ascendant.siderealLongitude;
  const ascSignIdx = Math.floor(ascLon / 30);
  const ascSignName = RASHI_NAMES[ascSignIdx].englishName;

  const moonHouse = planets.Moon?.house || 1;
  const sunHouse = planets.Sun?.house || 1;
  const jupHouse = planets.Jupiter?.house || 1;
  const mercHouse = planets.Mercury?.house || 1;
  const marsHouse = planets.Mars?.house || 1;
  const satHouse = planets.Saturn?.house || 1;
  const venHouse = planets.Venus?.house || 1;

  // Compute Resonance for 5 Major Archetype Categories
  // 1. Philosophers & Gurus (Spiritual / Dharma)
  let philScore = 65;
  if ([1, 5, 9, 10, 11].includes(jupHouse)) philScore += 18;
  if ([9, 12, 4].includes(moonHouse)) philScore += 12;
  philScore = Math.min(98, philScore);

  // 2. Scientists & Inventors (Intellect / Analysis)
  let sciScore = 60;
  if ([1, 2, 4, 10, 11].includes(mercHouse)) sciScore += 18;
  if ([6, 10, 11].includes(satHouse) || [3, 6, 10].includes(marsHouse)) sciScore += 14;
  sciScore = Math.min(98, sciScore);

  // 3. Business Tycoons (Enterprise / Wealth)
  let tycScore = 62;
  if ([2, 10, 11, 9].includes(sunHouse) || [2, 10, 11].includes(mercHouse)) tycScore += 16;
  if ([1, 4, 7, 10, 11].includes(moonHouse) && [1, 4, 7, 10, 11].includes(marsHouse)) tycScore += 16;
  tycScore = Math.min(98, tycScore);

  // 4. Politicians & Rulers (Leadership / Authority)
  let polScore = 60;
  if ([1, 10, 9, 5].includes(sunHouse)) polScore += 18;
  if ([1, 4, 7, 10].includes(jupHouse) || [1, 4, 7, 10].includes(satHouse)) polScore += 14;
  polScore = Math.min(98, polScore);

  // 5. Artists & Authors (Creativity / Expression)
  let artScore = 62;
  if ([1, 2, 5, 9, 10].includes(venHouse)) artScore += 18;
  if ([1, 5, 9].includes(moonHouse) || [2, 5, 10].includes(mercHouse)) artScore += 14;
  artScore = Math.min(98, artScore);

  const archetypes: ArchetypeResonanceScore[] = [
    {
      category: "Philosophers & Gurus",
      resonancePercentage: philScore,
      closestTitanMatch: "Swami Vivekananda & Ramana Maharshi",
      sharedAstrologicalBlueprint: `Strong Jupiter (H${jupHouse}) & Dharma alignments channel profound contemplative wisdom and philosophical depth.`,
      karmicTakeaway: "Awakens innate spiritual discernment (Viveka) and the capacity to uplift collective consciousness.",
    },
    {
      category: "Scientists & Inventors",
      resonancePercentage: sciScore,
      closestTitanMatch: "Albert Einstein & Nikola Tesla",
      sharedAstrologicalBlueprint: `Fortified Mercury (H${mercHouse}) & analytical discipline mirror breakthrough problem-solving architectures.`,
      karmicTakeaway: "Unlocks structural innovation, mathematical clarity, and conceptual system creation.",
    },
    {
      category: "Business Tycoons",
      resonancePercentage: tycScore,
      closestTitanMatch: "Dhirubhai Ambani & Bill Gates",
      sharedAstrologicalBlueprint: `Dynamic 2nd/10th/11th house interplay generates strategic enterprise building and capital expansion.`,
      karmicTakeaway: "Empowers organizational scaling, commercial acumen, and institutional legacy building.",
    },
    {
      category: "Politicians & Rulers",
      resonancePercentage: polScore,
      closestTitanMatch: "Mahatma Gandhi & Abraham Lincoln",
      sharedAstrologicalBlueprint: `Solar authority (Sun in H${sunHouse}) and Kendra fortitude bestow public command and moral stamina.`,
      karmicTakeaway: "Grants leadership gravitas, crisis resilience, and public policy impact.",
    },
    {
      category: "Artists & Authors",
      resonancePercentage: artScore,
      closestTitanMatch: "Rabindranath Tagore & Leonardo da Vinci",
      sharedAstrologicalBlueprint: `Venusian aesthetics (Venus in H${venHouse}) combined with creative 5th-house resonance inspire lasting aesthetic works.`,
      karmicTakeaway: "Channels refined aesthetic taste, expressive eloquence, and cultural contributions.",
    },
  ];

  archetypes.sort((a, b) => b.resonancePercentage - a.resonancePercentage);
  const topArchetype = archetypes[0];

  // Pick top titan match matching top archetype
  const matchedTitan = BENCHMARK_TITANS.find((t) => t.category === topArchetype.category) || BENCHMARK_TITANS[0];

  const overallResonanceProfile = `Native demonstrates highest blueprint resonance (${topArchetype.resonancePercentage}%) with the **${topArchetype.category}** archetype, mirroring the architectural planetary signatures of **${matchedTitan.name}**.`;

  const masterBenchmarkSynthesis = `Empirical Benchmark Horoscope analysis reveals exceptional alignment with ${topArchetype.category} (${topArchetype.resonancePercentage}%). Key planetary alignments reflect the genius signatures of historical luminaries like ${matchedTitan.name}, confirming prominent capacity for high societal impact.`;

  return {
    archetypes,
    topArchetype,
    topTitanMatch: matchedTitan,
    overallResonanceProfile,
    masterBenchmarkSynthesis,
  };
}
