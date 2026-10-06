import { AstroKnowledgeChunk } from "../lib/vectorDb";

/**
 * Authoritative Canonical Astrological Knowledge Corpus
 * Multi-traditional corpus linking Classical Shastras (BPHS, Jaimini, Phaladeepika, Saravali, Nadi Classics),
 * Modern Methodologies (Raman, KN Rao, CS Patel, Samir Tripathi, BTR), and Advanced Predictive Lecture Series.
 * Strictly compliant with the Zero-Name Frontend Rule (no personal names in user-facing content).
 */
export const ASTRO_KNOWLEDGE_CORPUS: AstroKnowledgeChunk[] = [
  // ==========================================
  // SECTION 1: ROOT VS FRUIT & DIVISIONAL PROJECTIONS
  // ==========================================
  {
    id: "rf_001_root_vs_fruit_axiom",
    tradition: "Divisional",
    sourceRef: "Divisional Projection Doctrine (Lecture 1.14)",
    topic: "general",
    subTopic: "root_fruit_axiom",
    title: "Root (D1) vs Fruit (D9) Foundational Manifestation Axiom",
    chunkContent:
      "In classical predictive synthesis, the Rashi chart (D1) represents the root or tree—the physical karma, biological reality, and worldly circumstance. The Navamsha (D9) represents the fruit—the experiential fruition, spiritual essence, and ultimate manifestation. If an auspicious yoga or event is indicated in the D1 root but has no corresponding dignity or reception in D9, it fails to bear fruit. Conversely, if a challenging placement in D1 resolves into an exalted, Pushkara, or Kendra placement in D9, the native experiences eventual triumph and fruitful realization.",
    conditions: {
      vargas: ["D1", "D9"],
      keywords: ["root", "fruit", "manifestation", "tree", "d1", "d9", "navamsha"],
    },
  },
  {
    id: "rf_002_marriage_fruition_gate",
    tradition: "Divisional",
    sourceRef: "Divisional Projection Doctrine (Lecture 1.14)",
    topic: "marriage",
    subTopic: "7th_house_fruition_gate",
    title: "7th House Marital Fruition Gate & Navamsha Dusthana Displacement",
    chunkContent:
      "To evaluate marital longevity and discord, observe where the D1 7th house sign falls in the D9 Navamsha chart. If the D1 7th house sign projects into the 6th, 8th, or 12th houses of D9 (Dusthanas), the marriage encounters heavy friction, post-wedding litigation, emotional estrangement, or hospitalization. If the D1 7th sign falls into the D9 6th house, disputes and adversarial conflict dominate. If it falls into the D9 8th house, sudden secrets, trauma, or in-law turmoil emerge. If it falls into the D9 12th house, distance, foreign separation, or heavy expenditures manifest. Conversely, if the D1 7th sign projects into D9 Kendras (1st, 4th, 7th, 10th) or Trikonas (5th, 9th), the partnership maintains enduring resilience.",
    conditions: {
      houses: [7, 6, 8, 12, 1, 4, 10, 5, 9],
      vargas: ["D1", "D9"],
      keywords: ["marriage", "7th house", "fruition", "dusthana", "navamsha", "litigation", "discord", "spouse"],
    },
  },
  {
    id: "rf_003_career_fruition_gate",
    tradition: "Divisional",
    sourceRef: "Divisional Projection Doctrine (Lecture 1.14)",
    topic: "career",
    subTopic: "10th_house_fruition_gate",
    title: "10th House Career Manifestation Gate & Workplace Architecture",
    chunkContent:
      "When the sign occupying the D1 10th house falls into the 4th house of the D9 Navamsha, the professional manifestation shifts from aggressive corporate climbing to domestic sanctuary, work-from-home architecture, real estate, education, or prioritizing peace of mind over public status. When Gemini occupies the 10th house or runs its dasha, frequent career restructuring, dual income streams, digital communication, and professional pivoting are activated. If the 10th lord goes to the 6th house in D9, competitive service, dispute resolution, or healthcare careers prevail.",
    conditions: {
      houses: [10, 4, 6],
      signs: [3],
      vargas: ["D1", "D9"],
      keywords: ["career", "profession", "10th house", "4th house", "sanctuary", "remote", "gemini", "job", "fruition"],
    },
  },
  {
    id: "rf_004_saturn_dietary_nadi",
    tradition: "Nadi",
    sourceRef: "Nadi Dietary Canon (Lecture 1.14)",
    topic: "health",
    subTopic: "saturn_rohini_diet",
    title: "Saturn in 2nd House Rohini Nakshatra Dietary Fasting Rule",
    chunkContent:
      "The 2nd house governs food intake, oral speech, and family lineage. When Saturn sits in the 2nd house in Rohini Nakshatra (ruled by the Moon, the cosmic nourisher), the native experiences extreme dietary restrictions, consuming barely 50% of standard caloric intake, or is naturally inclined toward disciplined intermittent fasting. Eating heavy or tamasic meals triggers immediate sluggishness and digestive fatigue. In Bharani Nakshatra (ruled by Yama/Venus), Saturn in the 2nd house produces struggles with financial restraint or severe austerity in consumption.",
    conditions: {
      houses: [2],
      planets: ["Saturn", "Moon"],
      keywords: ["saturn", "2nd house", "rohini", "diet", "food", "fasting", "caloric", "nutrition", "health"],
    },
  },
  {
    id: "rf_005_sign_dasha_archetypes",
    tradition: "Divisional",
    sourceRef: "Sign Dasha Predictive Canon (Lecture 1.14)",
    topic: "general",
    subTopic: "sign_dasha_archetypes",
    title: "Archetypal Energy of Signs in Rashi Dasha Timing",
    chunkContent:
      "When timing events through Rashi Dashas (Narayana, Chara, or Lagnamsha): (1) Aries (Mesha) triggers pioneering action, physical initiation, and starting brand-new enterprises. (2) Taurus (Vrishabha) & Libra (Tula), ruled by Venus, trigger financial asset liquidation, trade, and marital karmas; if falling in 6th/8th houses, they bring unmanaged expenses or partnership strain. (3) Gemini (Mithuna) triggers communications, networking, media, and major career overhauls. (4) Cancer (Karka) triggers domestic relocation, emotional consolidation, and seeking inner peace over corporate ambition. Any sub-period of a sign containing natural benefics or Yogakarakas brings ease, while signs containing afflicted malefics (e.g., Mars-Saturn) bring disruptions.",
    conditions: {
      signs: [1, 2, 3, 4, 7],
      vargas: ["D1"],
      dashas: ["Chara", "Narayana", "Rashi"],
      keywords: ["sign dasha", "aries", "taurus", "gemini", "cancer", "libra", "benefic", "malefic", "timing"],
    },
  },

  // ==========================================
  // SECTION 2: LUNAR ASTRO NAME VIBRATIONS & MATURATION AGES
  // ==========================================
  {
    id: "name_001_vibrational_phonetics",
    tradition: "Nadi",
    sourceRef: "Svara Jyotish & Astro-Phonetics Canon",
    topic: "name_energy",
    subTopic: "morphological_phonetic_roots",
    title: "Name Vibrational Energy & Astro-Phonetic Planetary Frequencies",
    chunkContent:
      "According to Astro-Phonetics and Svara Jyotish, names carry distinct planetary frequencies independently of the birth chart. Prefix roots govern psychological orientation: 'Pri-' roots (Priya, Prince) carry Venus-Mercury aesthetic charm but relationship over-idealization; 'Al-' roots carry Rahu-Moon illusory expanse; 'Rav-' roots carry Solar-Martial authoritative assertiveness; 'Sach-' roots carry Jupiterian truth-seeking and moral burden. Suffixes modify behavior: '-inder' (Indra) infuses Martian royal combativeness; '-preet' infuses Venusian devotional attachment.",
    conditions: {
      keywords: ["name energy", "astro-phonetics", "name frequency", "priya", "alok", "sachin", "ravinder", "svara"],
    },
  },
  {
    id: "age_001_planetary_maturation_ages",
    tradition: "Parashari",
    sourceRef: "BPHS Ch. 45 & Phaladeepika",
    topic: "general",
    subTopic: "maturation_ages",
    title: "Parashara Natural Planetary Maturation Ages & Karmic Awakening",
    chunkContent:
      "Classical Parashari Jyotish assigns specific biological maturation ages to each graha: Jupiter matures at Age 16 & 32 (wisdom & dharma awakening); Sun at 21-22 (self-identity & career authority); Moon at 23-24 (emotional maturity & relational independence); Venus at 25-27 (romantic commitment & financial accumulation); Mars at 28-31 (courage, property acquisition, & physical peak); Mercury at 32-35 (business acumen & intellectual synthesis); Saturn at 36-42 (karmic reckoning, life restructuring, & enduring foundation); Rahu at 42-47 (foreign expansion or sudden material disruption); Ketu at 48-54 (spiritual liberation, detachment, & ascetic clarity).",
    conditions: {
      planets: ["Jupiter", "Sun", "Moon", "Venus", "Mars", "Mercury", "Saturn", "Rahu", "Ketu"],
      keywords: ["maturation age", "bphs", "saturn 36", "jupiter 16", "age activation", "karmic awakening"],
    },
  },
  {
    id: "age_002_retrograde_saturn_36",
    tradition: "Nadi",
    sourceRef: "Nadi Maturation Dynamics",
    topic: "career",
    subTopic: "retrograde_saturn_age_36",
    title: "Retrograde Saturn at Age 36 Life Pivot & Vak Siddhi Awakening",
    chunkContent:
      "When Saturn is retrograde in the natal chart, its maturation at Age 36 behaves as an inverted karmic catalyst. Rather than slow gradual stability, Age 36 forces an abrupt dismantling of superficial career structures, dissolution of outdated commitments, and a profound inward pivot toward authentic purva-janma vocation. If placed in trines to Jupiter or Mercury, it simultaneously activates Vak Siddhi (intuitive astrological truth-speaking). The classic botanical remedy to harmonize Saturn-Jupiter friction is tending the Kadali (banana tree) or offering yellow flowers on Thursdays.",
    conditions: {
      planets: ["Saturn", "Jupiter"],
      keywords: ["retrograde saturn", "age 36", "vak siddhi", "banana tree", "kadali", "life pivot", "career change"],
    },
  },

  // ==========================================
  // SECTION 3: RASHI TULYA NAVAMSHA (RTN)
  // ==========================================
  {
    id: "rtn_001_core_superimposition",
    tradition: "Divisional",
    sourceRef: "C.S. Patel Rashi Tulya Navamsha Canon",
    topic: "general",
    subTopic: "rtn_superimposition",
    title: "Rashi Tulya Navamsha (RTN) Cross-Varga Superimposition",
    chunkContent:
      "Rashi Tulya Navamsha (RTN) projects Navamsha planetary coordinates directly onto the Rashi (D1) house grid. If a planet occupies sign S in D9, examine the bhava that sign S represents in D1. When transit Saturn, Jupiter, or Rahu aspects or conjoins this RTN position, dormant navamsha karmas precipitate into physical reality. A planet exalted in D9 but placed in a Dusthana in RTN produces spiritual elevation through worldly challenges. Cross-varga conjunctions (D1 planet and RTN planet in the same sign) create tight karmic destiny bonds.",
    conditions: {
      vargas: ["D1", "D9"],
      keywords: ["rashi tulya navamsha", "rtn", "cs patel", "cross varga", "superimposition", "transits"],
    },
  },

  // ==========================================
  // SECTION 4: 3-POINT BIRTH TIME RECTIFICATION (BTR)
  // ==========================================
  {
    id: "btr_001_chitkara_triad",
    tradition: "Divisional",
    sourceRef: "Three-Point BTR Verification Canon",
    topic: "btr",
    subTopic: "three_point_triad",
    title: "Three-Point Birth Time Rectification (BTR) Triad & Umbilical Severance",
    chunkContent:
      "Birth Time Rectification operates on three synchronized mathematical gates anchored to the true astronomical birth moment (cutting of the umbilical cord governed by Rahu/Ketu): (1) C1 Gate: D-9 Moon must maintain a precise harmonic relationship with Pranapada Lagna (PP). (2) C2 Gate: D-60 Venus must align with Pranapada Lagna or its trines. (3) C3 Gate: The dispositor of Ketu in D-60 must aspect the D-60 Lagna via Jaimini Rashi Drishti. When all three gates converge simultaneously, the birth time is astronomically rectified down to the exact second.",
    conditions: {
      vargas: ["D9", "D60"],
      planets: ["Moon", "Venus", "Ketu", "Rahu"],
      keywords: ["btr", "rectification", "birth time", "pranapada", "umbilical cord", "jaimini rashi drishti", "d60"],
    },
  },

  // ==========================================
  // SECTION 5: CLASSICAL SHASTRA SUTRAS (BPHS, JAIMINI, PHALADEEPIKA)
  // ==========================================
  {
    id: "bphs_001_pancha_mahapurusha",
    tradition: "Parashari",
    sourceRef: "Brihat Parashara Hora Shastra Ch. 75",
    topic: "career",
    subTopic: "pancha_mahapurusha_yogas",
    title: "Pancha Mahapurusha Yogas & Planetary Sovereign Radiance",
    chunkContent:
      "When non-luminary planets occupy their own or exaltation sign in a Kendra (1st, 4th, 7th, 10th houses): (1) Mars forms Ruchaka Yoga (courage, leadership, military/technical mastery). (2) Mercury forms Bhadra Yoga (intellect, eloquence, commerce, longevity). (3) Jupiter forms Hamsa Yoga (righteousness, spiritual reverence, dharmic legacy). (4) Venus forms Malavya Yoga (refinement, artistic wealth, marital elegance). (5) Saturn forms Sasa Yoga (ruling over multitudes, endurance, deep administrative authority). These yogas must not be combust or hemmed between malefics to fully flower.",
    conditions: {
      houses: [1, 4, 7, 10],
      planets: ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"],
      keywords: ["pancha mahapurusha", "ruchaka", "bhadra", "hamsa", "malavya", "sasa", "bphs", "rajayoga"],
    },
  },
  {
    id: "jaimini_001_atmakaraka_karakamsha",
    tradition: "Jaimini",
    sourceRef: "Jaimini Upadesha Sutras Adhyaya 1 & 2",
    topic: "spirituality",
    subTopic: "atmakaraka_karakamsha",
    title: "Atmakaraka (AK) & Karakamsha Soul Blueprint",
    chunkContent:
      "The planet with the highest longitude in any sign (excluding Rahu/Ketu in the 7-karaka scheme) is the Atmakaraka (AK), the King of the horoscope representing the soul's primary karmic lesson. The sign occupied by the AK in the Navamsha is the Karakamsha. If benefic planets occupy the 12th from Karakamsha, Moksha (spiritual liberation) is assured. If Ketu occupies the 12th from Karakamsha, the soul achieves divine realization. If Saturn or Rahu aspects the Karakamsha, the native undergoes heavy worldly disillusionment before turning toward spiritual surrender.",
    conditions: {
      vargas: ["D9"],
      planets: ["Ketu", "Saturn", "Rahu"],
      keywords: ["atmakaraka", "karakamsha", "jaimini", "soul", "moksha", "12th house", "spiritual"],
    },
  },
  {
    id: "phala_001_viparita_rajayoga",
    tradition: "Parashari",
    sourceRef: "Phaladeepika Ch. 6",
    topic: "wealth",
    subTopic: "viparita_rajayoga",
    title: "Viparita Raja Yoga: Triumph Through Adversarial Collapse",
    chunkContent:
      "When Dusthana lords (6th, 8th, 12th) occupy only Dusthana houses (6th, 8th, 12th) without aspect or conjunction from benefic Kendra/Trikona lords: (1) Harsha Yoga (6th lord in 6th, 8th, or 12th) grants victory over enemies, health immunity, and fearlessness. (2) Sarala Yoga (8th lord in 6th, 8th, or 12th) confers unexpected wealth, longevity, and academic distinction. (3) Vimala Yoga (12th lord in 6th, 8th, or 12th) brings prudent expenditures, honorable conduct, and independent prosperity. Results manifest through the downfall or distress of rivals.",
    conditions: {
      houses: [6, 8, 12],
      keywords: ["viparita raja yoga", "harsha yoga", "sarala yoga", "vimala yoga", "dusthana", "phaladeepika", "wealth"],
    },
  },
  {
    id: "bhrigu_001_saturn_jupiter_conjunction",
    tradition: "Nadi",
    sourceRef: "Bhrigu Nandi Nadi Canon",
    topic: "career",
    subTopic: "saturn_jupiter_dharma_karma",
    title: "Dharma-Karma Conjunction: Saturn and Jupiter Planetary Interaction",
    chunkContent:
      "In Nadi astrology, Saturn is the Karma Karaka (worker, profession, service) and Jupiter is the Jiva Karaka (life force, divine grace, dharma). When Saturn and Jupiter are conjoined, in mutual trines (1-5-9), or in mutual aspect, the native attains the supreme Dharma-Karmadhipati yoga of life. Professional work aligns harmoniously with divine purpose, teaching, consulting, law, or institutional stewardship. The native may experience early delays, but from Age 32-36 onwards, their reputation and financial stability become unshakeable.",
    conditions: {
      planets: ["Saturn", "Jupiter"],
      keywords: ["saturn jupiter", "bhrigu nadi", "dharma karma", "jiva", "profession", "calling", "age 32", "age 36"],
    },
  },

  // ==========================================
  // SECTION 6: TIMING EVENTS VIA COMPOSITE & DOUBLE TRANSIT
  // ==========================================
  {
    id: "knrao_001_double_transit",
    tradition: "Modern",
    sourceRef: "Composite Predictive Timing Canon",
    topic: "general",
    subTopic: "double_transit_rule",
    title: "Double Transit Canon: Saturn and Jupiter Joint Validation for Manifestation",
    chunkContent:
      "No major life milestone—marriage, childbirth, career promotion, or property purchase—can materialize physically unless BOTH Saturn and Jupiter simultaneously sanction the relevant house or its lord by transit: (1) Saturn provides the karmic sanction (by conjunction or 3rd, 7th, 10th aspect). (2) Jupiter provides the divine blessing and fertile expansion (by conjunction or 5th, 7th, 9th aspect). When both grahas influence the 7th house/lord, marriage occurs; when both touch the 5th house/lord, progeny manifests; when both touch the 10th house/lord, career elevation crystallizes.",
    conditions: {
      planets: ["Saturn", "Jupiter"],
      keywords: ["double transit", "saturn jupiter transit", "composite timing", "marriage timing", "career timing", "event manifestation"],
    },
  },

  // ==========================================
  // SECTION 7: MEDHAJ & ADVANCED ESOTERIC SERIES
  // ==========================================
  {
    id: "medhaj_001_indu_lagna_wealth",
    tradition: "Divisional",
    sourceRef: "Indu Lagna Wealth Canon",
    topic: "wealth",
    subTopic: "indu_lagna_wealth_potency",
    title: "Indu Lagna Wealth Activation & Dhana Ray Calculation",
    chunkContent:
      "Indu Lagna is calculated by summing the planetary rays (Kala units) of the 9th lord from Lagna and the 9th lord from Moon, dividing by 12, and counting that remainder from the natal Moon sign. Benefics (Jupiter, Venus, Mercury) occupying or aspecting Indu Lagna without malefic affliction confer multi-millionaire status (Kotyadhipati). Even an exalted malefic in Indu Lagna gives massive sudden wealth at the cost of intense physical exertion.",
    conditions: {
      houses: [9, 2, 11],
      keywords: ["indu lagna", "wealth", "dhana yoga", "prosperity", "kotyadhipati", "rays", "financial"],
    },
  },
  {
    id: "medhaj_002_baadhaka_obstruction",
    tradition: "Parashari",
    sourceRef: "Baadhaka Sthana Canon",
    topic: "health",
    subTopic: "baadhaka_sickness_and_obstacles",
    title: "Baadhaka Sthana & Unexplained Karmic Impediments",
    chunkContent:
      "For Movable (Chara) ascendants (Aries, Cancer, Libra, Capricorn), the 11th house is Baadhaka (obstruction). For Fixed (Sthira) ascendants (Taurus, Leo, Scorpio, Aquarius), the 9th house is Baadhaka. For Dual (Dvisvabhava) ascendants (Gemini, Virgo, Sagittarius, Pisces), the 7th house is Baadhaka. The lord of the Baadhaka house or planets sitting in it trigger inexplicable delays, energetic stagnation, or misdiagnosed health issues during their dasha sub-periods. Remediation requires worshipping the presiding deity of the sign lord or performing Maha Mrityunjaya japa.",
    conditions: {
      houses: [11, 9, 7],
      keywords: ["baadhak", "baadhaka", "obstruction", "delays", "chara", "sthira", "dvisvabhava", "health obstacles"],
    },
  },
  {
    id: "medhaj_003_arudha_maya_vs_reality",
    tradition: "Jaimini",
    sourceRef: "Jaimini Arudha Pada Canon",
    topic: "general",
    subTopic: "arudha_lagna_maya",
    title: "Arudha Lagna (AL) vs Natal Lagna: Perception vs Reality",
    chunkContent:
      "Natal Lagna represents the true biological and psychological self; Arudha Lagna (AL) represents the Maya—how the world perceives the native's status, wealth, and persona. If AL has exalted benefics, society views the native as elite and successful, even if the native feels unfulfilled internally. Planetary transits across AL create visible shifts in public reputation. Planets in the 12th from AL indicate sources of expenditure and public detachment, while planets in the 11th from AL indicate public sources of financial gain.",
    conditions: {
      keywords: ["arudha lagna", "al", "maya", "perception", "public image", "reputation", "jaimini"],
    },
  },
  {
    id: "medhaj_004_mks_marana_karaka_sthana",
    tradition: "Parashari",
    sourceRef: "Marana Karaka Sthana Classical Canon",
    topic: "health",
    subTopic: "marana_karaka_sthana",
    title: "Marana Karaka Sthana (MKS): Planetary Death-like Torment Placements",
    chunkContent:
      "When a planet occupies its Marana Karaka Sthana (MKS), it feels like dying and cannot deliver its natural portfolio without tremendous struggle: Sun in 12th (loss of ego/identity); Moon in 8th (severe emotional depression, psychic vulnerability); Mars in 7th (warrior forced into partnership compromise, Kuja dosha); Mercury in 7th or 4th (intellect suppressed by domestic discord); Jupiter in 3rd (guru in the house of courage and combat); Venus in 6th (goddess of love in the battlefield of disease and litigation); Saturn in 1st (lord of delay and decay on the throne of vitality); Rahu in 9th (heretic undermining sacred dharma).",
    conditions: {
      houses: [1, 3, 4, 6, 7, 8, 9, 12],
      planets: ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu"],
      keywords: ["mks", "marana karaka sthana", "death like", "planet affliction", "torment", "weakness"],
    },
  },
  {
    id: "d10_001_lagna_lord_in_dashamsha",
    tradition: "Divisional",
    sourceRef: "Dashamsha Karma Field Canon",
    topic: "career",
    subTopic: "d1_lord_in_d10",
    title: "D1 Lagna Lord Placement in D10 (Dashamsha) & Career Trajectory",
    chunkContent:
      "The position of the D1 Lagna Lord in the D10 (Dashamsha) chart determines the native's actual workplace environment and public impact. If D1 Lagna Lord sits in the D10 Lagna, the native becomes an autonomous leader or entrepreneur. In the D10 4th house, work involves corporate headquarters, institutional infrastructure, or domestic peace. In the D10 6th house, career involves competitive problem-solving, corporate litigation, or daily client service. In the D10 10th house, professional eminence and high executive authority are assured. If debilitated in D10 without cancellation, the native experiences intense toil before attaining professional recognition.",
    conditions: {
      houses: [1, 4, 6, 10],
      vargas: ["D1", "D10"],
      keywords: ["dashamsha", "d10", "lagna lord", "career", "profession", "workplace", "leadership", "job"],
    },
  },
  {
    id: "rahu_001_kumbha_aquarius_expanse",
    tradition: "Nadi",
    sourceRef: "Aquarius Rahu Cosmic Expanse Canon",
    topic: "career",
    subTopic: "kumbha_aquarius_rahu",
    title: "Rahu in Kumbha (Aquarius): Technological Innovation & Unorthodox Mastery",
    chunkContent:
      "Aquarius is co-ruled by Saturn and Rahu. When Rahu occupies Aquarius, its restless energy channels into cutting-edge technology, artificial intelligence, mass networks, occult research, and global social reform. It breaks conventional family orthodoxies to pioneer unchartered territories. If aspected by Jupiter, this unorthodox drive becomes a blessing for humanity, elevating the native to visionary status.",
    conditions: {
      signs: [11],
      planets: ["Rahu"],
      keywords: ["rahu", "aquarius", "kumbha", "technology", "innovation", "networks", "unorthodox"],
    },
  },
  {
    id: "saturn_001_makara_kurma_discipline",
    tradition: "Nadi",
    sourceRef: "Capricorn Kurma Saturn Canon",
    topic: "career",
    subTopic: "makara_kurma_saturn",
    title: "Saturn in Makara (Capricorn): Kurma Avatar Resilience & Relentless Execution",
    chunkContent:
      "Capricorn represents the cosmic tortoise (Kurma Avatar) that supports the churning of the ocean of milk. When Saturn sits in its own sign of Capricorn, the native possesses immense endurance, emotional armor, and the ability to bear immense corporate or societal pressure without breaking. Results manifest slowly but build permanent empires that outlast flashy competitors.",
    conditions: {
      signs: [10],
      planets: ["Saturn"],
      keywords: ["saturn", "capricorn", "makara", "kurma", "tortoise", "endurance", "discipline", "empire"],
    },
  },
];
