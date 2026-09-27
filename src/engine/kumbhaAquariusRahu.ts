/**
 * Classical Vedic Aquarius (Kumbha Rashi), Rahu-Saturn-Uranus Triad,
 * Bhrigu Bindu & Karmic Protection Engine
 * (कुम्भ राशि, भृगु बिंदु, राहु-शनि-हर्षल त्रिमूर्ति व बटुक भैरव कवच)
 *
 * Shastric Foundations:
 * - Session 39: Astrology as an Embodied Daily Lifestyle (Self-Correction over Prediction),
 *   9-Point Planetary Correspondences in the Human Body (Hands H3, Speech H2, Clothes Venus,
 *   Prana Breath Jupiter, Nose Cartilage Mars, Eye Vitality Venus, Eye Frame Mars, Eye Gaze Moon,
 *   Hair/Nails Saturn), Fundamental Nature of Kumbha (11th Kalapurusha Labha, Fixed Sthira,
 *   Sattvic Air "I to All" Humanitarian Brotherhood, Tri-Rulership: Saturn, Rahu, Uranus),
 *   Symbolism of the Water-Bearer (Earthen Pitcher pouring constantly to quench others' thirst without
 *   demanding personal credit), The Secret Physical Indicator: Teeth (Danta) across the 12 houses,
 *   The 11th House True Friend Rule (Fixed Air non-betrayal allies from Lagna & Moon) and Name Initial Alignment.
 * - Session 40: Deep Karmic Weight of Aquarius (Pre-Moksha debt clearance before Pisces 12th house, paired
 *   with Scorpio 8th house), Rahu in Favorite/Moolatrikona Sign (visionary ambition without easy credit),
 *   Varaha Avatara Analogy (Earth rescue in beast form, foundational work without bitter vanity),
 *   Rahu the Bold Communicator (The Jalandhara Legend - diplomatic eloquence and composure with Shiva),
 *   Sudden Transformations via Uranus (Harshal), Practical Animal Remedies (Street dogs & Elephants / Silver
 *   Elephant for Rahu-Saturn-Ganesha growth), The Bhrigu Bindu & Destiny Point Mathematical Axis (shorter-arc
 *   midpoint between Rahu & Moon + 180° opposition trigger), Spiritual Remedy: Lord Shiva & Batuk Bhairava
 *   (Bhairava Ashtakam / Batuk Bhairav Stotra as supreme shield for Rahu-Ketu shocks), and The Universal Karmic
 *   Warning: Never Exploit the Domain of Rahu (H1-H12 non-exploitation law and selfless service pathways).
 */

import { EphemerisResult, CelestialBodyPosition } from "./types";
import { RASHI_NAMES, NAKSHATRAS } from "./constants";

// ==========================================
// 1. INTERFACES & TYPES
// ==========================================

export interface BhriguBinduPoint {
  degree: number; // 0 to 360 absolute
  degreeInSign: number; // 0 to 30
  signIndex: number; // 0 to 11
  signName: string;
  signLord: string;
  nakshatraIndex: number;
  nakshatraName: string;
  nakshatraLord: string;
  pada: number;
  houseFromLagna: number; // 1 to 12
  houseFromMoon: number; // 1 to 12
  formattedPosition: string; // e.g., "14° 23' Kumbha (Aquarius)"
  astrologicalSignificance: string;
}

export interface BhriguBinduAxisProfile {
  bhriguBindu: BhriguBinduPoint;
  destinyPoint: BhriguBinduPoint; // 180° opposition
  moonLongitude: number;
  rahuLongitude: number;
  shorterArcSpanDegrees: number;
  conjunctPlanets: {
    planet: string;
    targetPoint: "Bhrigu Bindu" | "Destiny Point";
    orbDegrees: number;
    karmicMeaning: string;
  }[];
  aspectingPlanets: {
    planet: string;
    aspectType: string;
    targetPoint: "Bhrigu Bindu" | "Destiny Point";
    karmicMeaning: string;
  }[];
  transitingActivationGuidance: string;
}

export interface KumbhaHouseArchetype {
  houseNumber: number;
  signIndex: number; // 10 for Aquarius
  signName: string;
  archetypeTitle: string;
  waterBearerDuty: string;
  selflessGivingMandate: string;
  karmicTrap: string;
  enduringBlessing: string;
  teethPhysicalIndicator: {
    relativeOrDomain: string;
    dentalSignature: string;
    clinicalObservation: string;
  };
}

export interface RahuNonExploitationRule {
  houseNumber: number;
  houseSignification: string;
  dangerZoneExploitation: string;
  karmicBacklash: string;
  selflessServicePathway: string;
  isActiveRahuHouse: boolean;
  isActiveAquariusHouse: boolean;
}

export interface TrueFriendAllianceProfile {
  eleventhFromLagna: {
    signIndex: number;
    signName: string;
    element: string;
    modality: string;
    friendlySounds: string[];
    allianceType: string;
  };
  eleventhFromMoon: {
    signIndex: number;
    signName: string;
    element: string;
    modality: string;
    friendlySounds: string[];
    allianceType: string;
  };
  trinalAllies: {
    fifthSign: { index: number; name: string };
    ninthSign: { index: number; name: string };
    spiritualRole: string;
  };
  analyzedFriend?: {
    name: string;
    detectedSignIndex: number;
    detectedSignName: string;
    relationshipStatus: "Supreme 11th House Loyalist" | "9th House Dharmic Ally" | "5th House Karmic Protector" | "Functional Kendra Partner" | "Karmic Debtor (Dusthana)" | "Neutral";
    detailedGuidance: string;
  };
}

export interface BodilyCorrespondenceItem {
  bodyPart: string;
  governingFactor: string; // e.g., "3rd House", "Venus", "Jupiter"
  shastricSignification: string;
  dailyLifestyleRemedy: string;
}

export interface KumbhaAquariusMasterReport {
  bhriguBinduAxis: BhriguBinduAxisProfile;
  kumbhaWaterBearer: KumbhaHouseArchetype;
  teethIndicator: {
    aquariusHouse: number;
    targetRelative: string;
    dentalObservation: string;
  };
  rahuNonExploitation: {
    rahuHouse: number;
    aquariusHouse: number;
    activeRahuRule: RahuNonExploitationRule;
    activeAquariusRule: RahuNonExploitationRule;
    universalWarning: string;
  };
  triadRulership: {
    saturnRole: string;
    rahuRole: string;
    uranusRole: string;
    varahaAvataraSynthesis: string;
    jalandharaDiplomacySynthesis: string;
  };
  friendshipAlliances: TrueFriendAllianceProfile;
  spiritualShieldAndRemedies: {
    batukBhairavShield: {
      mantraOrStotra: string;
      spiritualFunction: string;
      dailyProtocol: string;
    };
    animalRemedies: {
      streetDogs: string;
      elephantsAndSilver: string;
    };
    bodilyCorrespondences: BodilyCorrespondenceItem[];
  };
  holisticDossierSummary: string;
}

// ==========================================
// 2. CONSTANTS & REFERENCE DICTIONARIES
// ==========================================

const SIGN_SOUND_MAPPING: Record<number, string[]> = {
  0: ["A", "Chu", "Che", "Cho", "La", "Li", "Lu", "Le", "Lo"], // Aries
  1: ["I", "U", "E", "O", "Va", "Vi", "Vu", "Ve", "Vo"], // Taurus
  2: ["Ka", "Ki", "Ku", "Gha", "Chha", "Ke", "Ko", "Ha"], // Gemini
  3: ["Hi", "Hu", "He", "Ho", "Da", "Di", "Du", "De", "Do"], // Cancer
  4: ["Ma", "Mi", "Mu", "Me", "Mo", "Ta", "Ti", "Tu", "Te"], // Leo
  5: ["To", "Pa", "Pi", "Pu", "Sha", "Na", "Tha", "Pe", "Po"], // Virgo
  6: ["Ra", "Ri", "Ru", "Re", "Ro", "Ta", "Tii", "Tu", "Te"], // Libra
  7: ["To", "Na", "Ni", "Nu", "Ne", "No", "Ya", "Yi", "Yu"], // Scorpio
  8: ["Ye", "Yo", "Bha", "Bhi", "Bhu", "Dha", "Pha", "Dhad", "Bhe"], // Sagittarius
  9: ["Bho", "Ja", "Ji", "Khi", "Khu", "Khe", "Kho", "Ga", "Gi"], // Capricorn
  10: ["Gu", "Ge", "Go", "Sa", "Si", "Su", "Se", "So", "Da"], // Aquarius
  11: ["Di", "Du", "Tha", "Jha", "Jna", "De", "Do", "Cha", "Chi"], // Pisces
};

export const KUMBHA_HOUSE_ARCHETYPES: Record<number, Omit<KumbhaHouseArchetype, "houseNumber" | "signIndex" | "signName">> = {
  1: {
    archetypeTitle: "The Humanitarian Self (Universal Vessel)",
    waterBearerDuty: "Embody universal compassion and unconditional welfare through your personal physical path.",
    selflessGivingMandate: "Pour out your energy, vision, and leadership to uplift collective communities without inflating personal vanity or demanding ego-praise.",
    karmicTrap: "Falling into self-pity or feeling unappreciated by the masses you tirelessly serve.",
    enduringBlessing: "Awakens enduring historical respect and universal goodwill across large social circles.",
    teethPhysicalIndicator: {
      relativeOrDomain: "Native's Own Teeth (1st House)",
      dentalSignature: "Noticeable crowding, unique spacing, or prominent dental architecture in native's mouth.",
      clinicalObservation: "Front incisors or jaw alignment exhibit distinctive asymmetry or require specialized orthodontic care.",
    },
  },
  2: {
    archetypeTitle: "The Custodian of Collective Wealth",
    waterBearerDuty: "View wealth and family lineage as an earthen pitcher to nourish hungry and needy souls.",
    selflessGivingMandate: "Use financial resources and spoken words to comfort others without expecting transactionality or interest in return.",
    karmicTrap: "Hoarding wealth out of fear of scarcity or speaking bitterly about ungrateful relatives.",
    enduringBlessing: "Akshaya Patra effect: continuous financial inflows that replenish whatever is generously distributed.",
    teethPhysicalIndicator: {
      relativeOrDomain: "Family Members & Maternal Uncle (2nd House)",
      dentalSignature: "Distinct dental crowding, extra tooth, or unique dental history among close family members.",
      clinicalObservation: "Family lineage shows recurrent dental irregularities, early fillings, or unique dental bridges.",
    },
  },
  3: {
    archetypeTitle: "The Selfless Communicator & Mentor to Siblings",
    waterBearerDuty: "Pour out communicative courage, writing, and hands-on skills for community empowerment.",
    selflessGivingMandate: "Support younger siblings, neighbors, and peers tirelessly without demanding subservience or gratitude.",
    karmicTrap: "Becoming resentful when siblings you helped achieve success fail to acknowledge your sacrifices.",
    enduringBlessing: "Gives unmatched communicative influence and fearlessness in public speech.",
    teethPhysicalIndicator: {
      relativeOrDomain: "Younger Siblings & Immediate Neighbors (3rd House)",
      dentalSignature: "Younger siblings display prominent teeth, slight gap, or dental misalignment.",
      clinicalObservation: "Close sibling underwent significant dental procedures or possesses a distinct, memorable smile.",
    },
  },
  4: {
    archetypeTitle: "The Sanctuary of Unconditional Domestic Nurture",
    waterBearerDuty: "Transform the home and heart into a peaceful shelter where everyone finds nourishment.",
    selflessGivingMandate: "Care for the mother, domestic environment, and ancestral property selflessly without emotional accounting.",
    karmicTrap: "Feeling emotionally unreciprocated by domestic kin or carrying resentment toward maternal burdens.",
    enduringBlessing: "Deep inner tranquility, spiritual stability, and divine maternal grace (Devi Kripa).",
    teethPhysicalIndicator: {
      relativeOrDomain: "Mother (Matru Bhava - 4th House)",
      dentalSignature: "Mother has distinctive dental alignment, prominent teeth, or history of dental extractions.",
      clinicalObservation: "Mother's dental architecture displays irregular placement or specialized dental care in youth.",
    },
  },
  5: {
    archetypeTitle: "The Fountain of Purva Punya & Wisdom",
    waterBearerDuty: "Channel creative intelligence, ancient mantra vidya, and mentoring to ignite the next generation.",
    selflessGivingMandate: "Nurture children, students, and creative projects unconditionally without demanding personal adoration.",
    karmicTrap: "Expecting children or students to become extensions of your personal glory or fulfill your unachieved dreams.",
    enduringBlessing: "Bestows divine creative genius, occult intuition (Vak Siddhi), and brilliant spiritual progeny.",
    teethPhysicalIndicator: {
      relativeOrDomain: "Children & First Romantic Partner (5th House)",
      dentalSignature: "Children or primary partner show distinct dental spacing, crowding, or orthodontic history.",
      clinicalObservation: "First child or partner possesses an unconventional smile with distinct dental curvature.",
    },
  },
  6: {
    archetypeTitle: "The Tireless Healer of the Vulnerable",
    waterBearerDuty: "Serve the sick, indebted, marginalized, and lower strata of society with pure dedication.",
    selflessGivingMandate: "Resolve conflicts, solve complex workplace issues, and serve subordinates without expecting medals.",
    karmicTrap: "Bitterness from dealing with adversarial colleagues or feeling trapped in thankless routine labor.",
    enduringBlessing: "Shatru Nasha (effortless triumph over enemies) and supreme diagnostic or problem-solving capability.",
    teethPhysicalIndicator: {
      relativeOrDomain: "Subordinates, Employees & Maternal Aunts (6th House)",
      dentalSignature: "Subordinates, household help, or maternal kin exhibit marked dental irregularities or missing teeth.",
      clinicalObservation: "Key subordinates or maternal relatives often have noticeable dental issues or gaps.",
    },
  },
  7: {
    archetypeTitle: "The Non-Transactional Partner",
    waterBearerDuty: "Approach marriage and public business partnerships with complete selflessness and trust.",
    selflessGivingMandate: "Support the spouse's growth, dignity, and career unconditionally without keeping score or demanding praise.",
    karmicTrap: "Demanding constant validation from the spouse or treating marital union as a transactional contract.",
    enduringBlessing: "Dissolves severe marital doshas and cements an unbreakable, spiritual lifelong bond.",
    teethPhysicalIndicator: {
      relativeOrDomain: "Spouse & Business Partners (7th House)",
      dentalSignature: "Spouse has distinctive teeth—prominent incisors, slight crowding, or attractive dental irregularity.",
      clinicalObservation: "Spouse's dental alignment is one of their most identifiable facial features.",
    },
  },
  8: {
    archetypeTitle: "The Alchemist of Cosmic Suffering",
    waterBearerDuty: "Plunge into life's darkest crises, traumas, and hidden mysteries to heal collective wounds.",
    selflessGivingMandate: "Assist others through emergencies, bereavement, and transformations without claiming credit or leveraging secrets.",
    karmicTrap: "Succumbing to paranoia, cynical detachment, or misusing confidential knowledge.",
    enduringBlessing: "Immunity from catastrophic accidents and deep mastery over occult, esoteric, and psychological sciences.",
    teethPhysicalIndicator: {
      relativeOrDomain: "In-Laws & Occult Guides (8th House)",
      dentalSignature: "In-laws display significant dental history, brittle enamel, or prominent dental surgery.",
      clinicalObservation: "Key in-laws or research mentors show distinct dental markers or dental loss.",
    },
  },
  9: {
    archetypeTitle: "The Fountain of Dharma & Universal Philosophy",
    waterBearerDuty: "Distribute spiritual truth, higher guidance, and moral light freely to all seekers.",
    selflessGivingMandate: "Serve the father, preceptors, and spiritual institutions without building an authoritarian personality cult.",
    karmicTrap: "Intellectual arrogance, criticizing other faiths, or arguing dogmatically with spiritual elders.",
    enduringBlessing: "Unshakeable Daiva Kripa (Divine Grace) and automatic opening of global fortune portals.",
    teethPhysicalIndicator: {
      relativeOrDomain: "Father & Spiritual Preceptors (9th House)",
      dentalSignature: "Father has prominent dental structure, strong jaw, or noticeable dental alignment.",
      clinicalObservation: "Father's smile features prominent or crowded teeth requiring notable dental attention.",
    },
  },
  10: {
    archetypeTitle: "The Silent Architect of Collective Institutions",
    waterBearerDuty: "Erect societal infrastructure, systems, and foundational works that serve humanity for decades.",
    selflessGivingMandate: "Perform heavy organizational duties quietly without lobbying for awards, limelight, or public accolades.",
    karmicTrap: "Growing cynical when less competent colleagues receive glamorous credit and faster promotions.",
    enduringBlessing: "Chirasthayi Yash: an enduring, unshakeable legacy and historical respect that outlives the native.",
    teethPhysicalIndicator: {
      relativeOrDomain: "Paternal Elders & Career Mentors (10th House)",
      dentalSignature: "Key career bosses or paternal figures have distinct dental structure or strict smiles.",
      clinicalObservation: "Influential mentors exhibit memorable dental signatures or early dental restorations.",
    },
  },
  11: {
    archetypeTitle: "The Sovereign Water-Bearer (Natural Home of Kumbha)",
    waterBearerDuty: "Mobilize immense networks, syndicates, and financial inflows for collective humanitarian advancement.",
    selflessGivingMandate: "Distribute gains, wealth, and visionary opportunities to friends and social causes generously.",
    karmicTrap: "Exploiting network connections for greedy personal profiteering or keeping friends for utilitarian gain.",
    enduringBlessing: "Exponential financial windfalls, powerful allies, and fulfillment of all virtuous aspirations.",
    teethPhysicalIndicator: {
      relativeOrDomain: "Elder Siblings & Lifelong Close Friends (11th House)",
      dentalSignature: "Elder siblings or primary loyalist friends show noticeable dental crowding or prominent teeth.",
      clinicalObservation: "Elder sibling or closest friend possesses distinct dental architecture or braces in youth.",
    },
  },
  12: {
    archetypeTitle: "The Renunciate of Ego (Gateway to Moksha)",
    waterBearerDuty: "Surrender personal attachments, isolated pride, and egoic identity into the ocean of the Divine.",
    selflessGivingMandate: "Give anonymous charity, assist foreign refugees or hospitals, and embrace spiritual solitude with joy.",
    karmicTrap: "Escapism, depression over isolation, or lamenting over financial expenditure in foreign lands.",
    enduringBlessing: "Absolute karmic liberation (Moksha) and total dissolution of ancestral suffering.",
    teethPhysicalIndicator: {
      relativeOrDomain: "Paternal Grandparents & Subconscious Sleep (12th House)",
      dentalSignature: "Subconscious dental grinding (bruxism) during sleep, or paternal grandparents with dental loss.",
      clinicalObservation: "Tendency to clench jaws under spiritual stress or sleep with dental tension.",
    },
  },
};

export const RAHU_NON_EXPLOITATION_RULES: Record<number, Omit<RahuNonExploitationRule, "houseNumber" | "isActiveRahuHouse" | "isActiveAquariusHouse">> = {
  1: {
    houseSignification: "Self-Identity, Personal Dignity, Physical Body",
    dangerZoneExploitation: "Never attack another person's personal dignity, strip away their self-respect, or commit identity theft.",
    karmicBacklash: "Triggers severe identity crises, loss of personal reputation, hallucinations, and chronic nervous breakdown.",
    selflessServicePathway: "Defend the weak, empower timid individuals to find their voice, and practice profound humility.",
  },
  2: {
    houseSignification: "Family Wealth, Food, Speech, Liquid Assets",
    dangerZoneExploitation: "Never steal ancestral inheritance, embezzle family funds, take someone else's food, or speak deceitful curses.",
    karmicBacklash: "Complete evaporation of savings, sudden bankruptcy, painful throat/jaw ailments, and speech disrepute.",
    selflessServicePathway: "Feed hungry strangers (Annadana), speak transparent truth, and sponsor underprivileged family members.",
  },
  3: {
    houseSignification: "Younger Siblings, Neighbors, Courage, Hands-on Enterprise",
    dangerZoneExploitation: "Never swindle siblings, usurp neighborly boundaries, forge contracts, or plagiarize another's writing.",
    karmicBacklash: "Loss of vital courage, chronic arm/shoulder ailments, debilitating litigation with siblings, and failed ventures.",
    selflessServicePathway: "Assist siblings financially, publish independent writers, and volunteer hands-on physical labor for local communities.",
  },
  4: {
    houseSignification: "Mother, Land, Real Estate, Domestic Peace, Vehicles",
    dangerZoneExploitation: "Never swindle someone out of ancestral land or home, abuse mother, or sell defective properties/vehicles.",
    karmicBacklash: "Catastrophic loss of domestic peace, home foreclosures, structural property collapse, and deep emotional depression.",
    selflessServicePathway: "Serve the mother unconditionally, build shelters for the homeless, and maintain peaceful domestic sanctum.",
  },
  5: {
    houseSignification: "Children, Students, Speculative Advice, Sacred Mantras",
    dangerZoneExploitation: "Never exploit children, betray students, charge exorbitant sums for spiritual mantras, or give dishonest speculative tips.",
    karmicBacklash: "Severe curses on lineage, heartbreak through progeny, loss of intellectual lucidity, and stock market wipeouts.",
    selflessServicePathway: "Teach underprivileged children for free, sponsor education of orphans, and chant sacred mantras selflessly.",
  },
  6: {
    houseSignification: "Subordinates, Employees, Debtors, Domestic Animals",
    dangerZoneExploitation: "Never exploit household servants or laborers, withhold wages, mistreat sick animals, or frame innocent colleagues.",
    karmicBacklash: "Incurable chronic auto-immune ailments, ruinous prolonged court battles, and sudden mutinies by subordinates.",
    selflessServicePathway: "Pay workers above fair market rates, feed stray dogs/animals, and provide free medical aid to the indigent.",
  },
  7: {
    houseSignification: "Spouse, Women, Public Dealings, Business Partners",
    dangerZoneExploitation: "Never cheat on a spouse, disrespect or harass a woman, or betray trust in a business partnership.",
    karmicBacklash: "Utter dismantling of life's foundation, humiliating public scandal, painful marital ruin, and financial lawsuits.",
    selflessServicePathway: "Honor the spouse with supreme respect, champion women's safety, and practice absolute transparency in business.",
  },
  8: {
    houseSignification: "Occult Knowledge, Confidential Secrets, Unearned Wealth",
    dangerZoneExploitation: "Never use occult or astrological knowledge to manipulate, extort hush money, or misappropriate wills/insurance.",
    karmicBacklash: "Sudden horrific accidents, dark public exposés, mysterious untreatable diseases, and psychological torment.",
    selflessServicePathway: "Use esoteric knowledge solely to alleviate human agony, support grieving families, and safeguard confidences.",
  },
  9: {
    houseSignification: "Father, Guru, Temples, Higher Dharma, Foreign Pilgrims",
    dangerZoneExploitation: "Never swindle temple trusts, disrespect the father or guru, or commercialize religion through dogmatic fear.",
    karmicBacklash: "Complete evaporation of good fortune (Bhagya), sudden downfall from high status, and abandonment in crises.",
    selflessServicePathway: "Serve the father and spiritual teachers, renovate dilapidated ancient temples, and facilitate pilgrims' travels.",
  },
  10: {
    houseSignification: "Career Authority, Public Office, Government Trust",
    dangerZoneExploitation: "Never abuse administrative power, demand corrupt bribes, or step ruthlessly over colleagues for promotion.",
    karmicBacklash: "Sudden humiliating fall from power, imprisonment, public disgrace, and destruction of professional standing.",
    selflessServicePathway: "Use professional authority strictly to safeguard the marginalized and execute duty with spotless integrity.",
  },
  11: {
    houseSignification: "Elder Siblings, Social Networks, Community Funds, Gains",
    dangerZoneExploitation: "Never defraud social charities, cheat elder siblings, or exploit community groups for selfish financial plunder.",
    karmicBacklash: "Total cessation of income channels, betrayal by trusted friends, social ostracization, and bitter isolation.",
    selflessServicePathway: "Donate a portion of gains to community welfare, support elder siblings, and connect people to noble causes.",
  },
  12: {
    houseSignification: "Foreigners, Charitable Institutions, Prisons, Isolation",
    dangerZoneExploitation: "Never cheat foreigners in foreign trade, exploit hospital patients, or misuse international charity funds.",
    karmicBacklash: "Sudden incarceration, forced exile, entrapment in hostile foreign lands, and chronic hospital confinement.",
    selflessServicePathway: "Practice anonymous charitable donations, visit and support hospital patients or inmates, and embrace meditation.",
  },
};

export const BODILY_CORRESPONDENCE_LIST: BodilyCorrespondenceItem[] = [
  {
    bodyPart: "Hand Gestures & Manual Initiatives",
    governingFactor: "3rd House (Bhratri / Parakrama Bhava)",
    shastricSignification: "Reflects the native's subconscious courage, enterprise, and brotherly fidelity through hand movement.",
    dailyLifestyleRemedy: "Use hands to perform physical service (Karma Yoga) and avoid aggressive or dismissive pointing.",
  },
  {
    bodyPart: "Speech, Voice Tone & Facial Expressions",
    governingFactor: "2nd House (Vak / Dhana Bhava)",
    shastricSignification: "The acoustic vibration carrying family lineage merits and financial karma through spoken words.",
    dailyLifestyleRemedy: "Cultivate sweet, calm, non-sarcastic speech; eliminate abusive vocabulary to fortify Jupiter & Mercury.",
  },
  {
    bodyPart: "Clothes, Outer Dressing & Aesthetic Presentation",
    governingFactor: "Venus (Shukra)",
    shastricSignification: "Embodies magnetic aura (Ojas), artistic refinement, and respect for the Divine Feminine.",
    dailyLifestyleRemedy: "Wear clean, ironed, well-fitted clothes; avoid torn or discolored clothing even inside the home.",
  },
  {
    bodyPart: "Inhaled Breath (Prana Vayu)",
    governingFactor: "Jupiter (Guru / Devaguru)",
    shastricSignification: "The cosmic life-force carrying divine wisdom, optimism, and biological vitality into the heart.",
    dailyLifestyleRemedy: "Practice deep, conscious diaphragmatic breathing (Pranayama) at sunrise facing East.",
  },
  {
    bodyPart: "Nose Outer Shape, Cartilage & Bridge",
    governingFactor: "Mars (Mangal / Kartikeya)",
    shastricSignification: "Represents martial executive drive, structural boundary defense, and physical stamina.",
    dailyLifestyleRemedy: "Maintain nasal hygiene; massage nasal bridge with sesame or mustard oil during seasons of transition.",
  },
  {
    bodyPart: "Light & Vital Spark in the Eyes",
    governingFactor: "Venus (Shukra)",
    shastricSignification: "Reflects cellular vitality (Sanjeevani energy), joy, and genuine aesthetic appreciation.",
    dailyLifestyleRemedy: "Wash eyes with cool clean water daily; practice Trataka or gaze upon natural greenery and open water.",
  },
  {
    bodyPart: "Physical Bone Frame & Socket of the Eye",
    governingFactor: "Mars (Mangal)",
    shastricSignification: "The warrior fortress protecting the delicate sensory jewel of vision.",
    dailyLifestyleRemedy: "Protect eyes from excessive strain, sharp glare, and prolonged uncalibrated screen exposure.",
  },
  {
    bodyPart: "Beauty, Softness & Depth of the Gaze",
    governingFactor: "Moon (Chandra)",
    shastricSignification: "The mirror of the soul reflecting emotional tranquility, empathy, and past-life maternal blessings.",
    dailyLifestyleRemedy: "Avoid angry or deceitful glares; cultivate a compassionate, soothing gaze toward all living beings.",
  },
  {
    bodyPart: "Hair & Nails",
    governingFactor: "Saturn (Shani / Sauraye)",
    shastricSignification: "Reflects karmic discipline, patience, and humility. Disheveled hair invites erratic Saturnian delays.",
    dailyLifestyleRemedy: "Keep hair neatly combed and groomed; clip nails regularly on Tuesdays/Saturdays avoidance codes.",
  },
];

// ==========================================
// 3. CORE CALCULATION FUNCTIONS
// ==========================================

/**
 * Calculates the exact mathematical midpoint between two longitudes along the SHORTER ARC (<= 180°).
 */
export function calculateShorterArcMidpoint(lon1: number, lon2: number): { midpoint: number; arcSpan: number } {
  const norm1 = ((lon1 % 360) + 360) % 360;
  const norm2 = ((lon2 % 360) + 360) % 360;

  const diff = ((norm2 - norm1 + 360) % 360);
  if (diff <= 180) {
    const midpoint = (norm1 + diff / 2) % 360;
    return { midpoint, arcSpan: diff };
  } else {
    const reverseDiff = 360 - diff;
    const midpoint = (norm1 - reverseDiff / 2 + 360) % 360;
    return { midpoint, arcSpan: reverseDiff };
  }
}

/**
 * Helper to build a detailed BhriguBinduPoint object from an absolute degree.
 */
function buildBhriguPoint(
  degree: number,
  ascDegree: number,
  moonDegree: number,
  isDestinyPoint: boolean
): BhriguBinduPoint {
  const normDeg = ((degree % 360) + 360) % 360;
  const signIdx = Math.floor(normDeg / 30);
  const degInSign = normDeg % 30;
  const signInfo = RASHI_NAMES[signIdx];

  const nakSpan = 360 / 27;
  const nakIdx = Math.floor(normDeg / nakSpan);
  const nakInfo = NAKSHATRAS[nakIdx];
  const degInNak = normDeg % nakSpan;
  const padaSpan = nakSpan / 4;
  const pada = Math.min(4, Math.floor(degInNak / padaSpan) + 1);

  const ascSignIdx = Math.floor((((ascDegree % 360) + 360) % 360) / 30);
  const moonSignIdx = Math.floor((((moonDegree % 360) + 360) % 360) / 30);

  const houseFromLagna = ((signIdx - ascSignIdx + 12) % 12) + 1;
  const houseFromMoon = ((signIdx - moonSignIdx + 12) % 12) + 1;

  const degFloor = Math.floor(degInSign);
  const minFloor = Math.floor((degInSign - degFloor) * 60);
  const formattedPosition = `${degFloor}° ${minFloor.toString().padStart(2, "0")}' ${signInfo?.sanskritName ?? "Rashi"} (${signInfo?.englishName ?? "Sign"})`;

  const astrologicalSignificance = isDestinyPoint
    ? `The Destiny Point (Bhagya Trigger) sits directly opposite the Bhrigu Bindu in House ${houseFromLagna} (${signInfo?.englishName}). Major life milestones, unexpected karmic breakthroughs, and career windfalls manifest whenever transiting Jupiter, Saturn, Rahu, or Mars cross or aspect this degree.`
    : `The Bhrigu Bindu sits at ${formattedPosition} in House ${houseFromLagna} (${signInfo?.englishName}) in ${nakInfo?.sanskritName ?? "Nakshatra"} Pada ${pada} (Lord: ${nakInfo?.lord ?? "Graha"}). This is the sensitive karmic convergence point between Moon's emotional memory and Rahu's evolutionary hunger.`;

  return {
    degree: normDeg,
    degreeInSign: degInSign,
    signIndex: signIdx,
    signName: signInfo?.englishName ?? "Unknown",
    signLord: signInfo?.lord ?? "Unknown",
    nakshatraIndex: nakIdx,
    nakshatraName: nakInfo?.sanskritName ?? "Unknown",
    nakshatraLord: nakInfo?.lord ?? "Unknown",
    pada,
    houseFromLagna,
    houseFromMoon,
    formattedPosition,
    astrologicalSignificance,
  };
}

/**
 * Calculates the Bhrigu Bindu & Destiny Point axis, conjunctions, and aspects.
 */
export function calculateBhriguBindu(natalEphemeris: EphemerisResult): BhriguBinduAxisProfile {
  const moonPos = natalEphemeris.planets["Moon"];
  const rahuPos = natalEphemeris.planets["Rahu"];

  const moonLong = moonPos?.siderealLongitude ?? 0;
  const rahuLong = rahuPos?.siderealLongitude ?? 0;
  const ascLong = natalEphemeris.ascendant?.siderealLongitude ?? 0;

  const { midpoint: bbDegree, arcSpan } = calculateShorterArcMidpoint(moonLong, rahuLong);
  const dpDegree = (bbDegree + 180) % 360;

  const bhriguBindu = buildBhriguPoint(bbDegree, ascLong, moonLong, false);
  const destinyPoint = buildBhriguPoint(dpDegree, ascLong, moonLong, true);

  const conjunctPlanets: BhriguBinduAxisProfile["conjunctPlanets"] = [];
  const aspectingPlanets: BhriguBinduAxisProfile["aspectingPlanets"] = [];

  const classicalPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  for (const pName of classicalPlanets) {
    const p = natalEphemeris.planets[pName];
    if (!p) continue;
    const pLong = p.siderealLongitude;

    // Check conjunction to Bhrigu Bindu (orb <= 3° 20' - 1 Navamsha)
    const distBB = Math.abs(calculateShorterArcMidpoint(pLong, bbDegree).arcSpan);
    if (distBB <= 3.333333) {
      conjunctPlanets.push({
        planet: pName,
        targetPoint: "Bhrigu Bindu",
        orbDegrees: Math.round(distBB * 100) / 100,
        karmicMeaning: `${pName} is tightly conjunct the Bhrigu Bindu within ${distBB.toFixed(2)}°. ${pName} acts as the primary karmic catalyst through which past-life destiny and life purpose are unlocked.`,
      });
    }

    // Check conjunction to Destiny Point (orb <= 3° 20')
    const distDP = Math.abs(calculateShorterArcMidpoint(pLong, dpDegree).arcSpan);
    if (distDP <= 3.333333) {
      conjunctPlanets.push({
        planet: pName,
        targetPoint: "Destiny Point",
        orbDegrees: Math.round(distDP * 100) / 100,
        karmicMeaning: `${pName} is tightly conjunct the Destiny Point within ${distDP.toFixed(2)}°. The natural significations of ${pName} will precipitate major turning points and sudden karmic fruitions.`,
      });
    }

    // Check classical aspects to the signs of Bhrigu Bindu and Destiny Point
    const pSignIdx = Math.floor((((pLong % 360) + 360) % 360) / 30);
    const bbSignIdx = bhriguBindu.signIndex;
    const dpSignIdx = destinyPoint.signIndex;

    const houseDiffBB = ((bbSignIdx - pSignIdx + 12) % 12) + 1;
    const houseDiffDP = ((dpSignIdx - pSignIdx + 12) % 12) + 1;

    // Check 7th house aspect (all grahas)
    if (houseDiffBB === 7) {
      aspectingPlanets.push({
        planet: pName,
        aspectType: "7th Aspect (Full Drishti)",
        targetPoint: "Bhrigu Bindu",
        karmicMeaning: `${pName} casts direct 7th aspect onto Bhrigu Bindu, continuously activating its sensitive degree.`,
      });
    }
    if (houseDiffDP === 7) {
      aspectingPlanets.push({
        planet: pName,
        aspectType: "7th Aspect (Full Drishti)",
        targetPoint: "Destiny Point",
        karmicMeaning: `${pName} casts direct 7th aspect onto the Destiny Point, energizing sudden karmic triggers.`,
      });
    }

    // Special aspects: Mars (4, 8)
    if (pName === "Mars") {
      if (houseDiffBB === 4 || houseDiffBB === 8) {
        aspectingPlanets.push({
          planet: "Mars",
          aspectType: `${houseDiffBB}th Special Aspect`,
          targetPoint: "Bhrigu Bindu",
          karmicMeaning: `Mars casts special ${houseDiffBB}th aspect onto Bhrigu Bindu, injecting sudden kinetic urgency into destiny events.`,
        });
      }
      if (houseDiffDP === 4 || houseDiffDP === 8) {
        aspectingPlanets.push({
          planet: "Mars",
          aspectType: `${houseDiffDP}th Special Aspect`,
          targetPoint: "Destiny Point",
          karmicMeaning: `Mars casts special ${houseDiffDP}th aspect onto Destiny Point, accelerating karmic triggers through decisive courage.`,
        });
      }
    }

    // Special aspects: Jupiter (5, 9)
    if (pName === "Jupiter") {
      if (houseDiffBB === 5 || houseDiffBB === 9) {
        aspectingPlanets.push({
          planet: "Jupiter",
          aspectType: `${houseDiffBB}th Divine Aspect`,
          targetPoint: "Bhrigu Bindu",
          karmicMeaning: `Jupiter sanctifies Bhrigu Bindu with its sacred ${houseDiffBB}th trinal aspect, ensuring divine protection and wisdom during karmic tests.`,
        });
      }
      if (houseDiffDP === 5 || houseDiffDP === 9) {
        aspectingPlanets.push({
          planet: "Jupiter",
          aspectType: `${houseDiffDP}th Divine Aspect`,
          targetPoint: "Destiny Point",
          karmicMeaning: `Jupiter sanctifies the Destiny Point with its ${houseDiffDP}th aspect, turning karmic triggers into spiritual breakthroughs and prosperity.`,
        });
      }
    }

    // Special aspects: Saturn (3, 10)
    if (pName === "Saturn") {
      if (houseDiffBB === 3 || houseDiffBB === 10) {
        aspectingPlanets.push({
          planet: "Saturn",
          aspectType: `${houseDiffBB}th Gripping Aspect`,
          targetPoint: "Bhrigu Bindu",
          karmicMeaning: `Saturn inspects Bhrigu Bindu via ${houseDiffBB}th drishti, demanding strict ethical discipline and patience before destiny unfolds.`,
        });
      }
      if (houseDiffDP === 3 || houseDiffDP === 10) {
        aspectingPlanets.push({
          planet: "Saturn",
          aspectType: `${houseDiffDP}th Gripping Aspect`,
          targetPoint: "Destiny Point",
          karmicMeaning: `Saturn inspects Destiny Point via ${houseDiffDP}th drishti, anchoring long-lasting stability and perseverance in karmic results.`,
        });
      }
    }
  }

  const transitingActivationGuidance =
    "Watch the transits of Saturn, Jupiter, Rahu, and Ketu. When a major slow-moving planet crosses either Bhrigu Bindu or its opposite Destiny Point, momentous life transitions, destined career leaps, or significant relationship unions/cleansings inevitably occur. When transiting Jupiter touches this axis, divine fortune awakens; when Saturn touches it, heavy karmic accounts are settled.";

  return {
    bhriguBindu,
    destinyPoint,
    moonLongitude: moonLong,
    rahuLongitude: rahuLong,
    shorterArcSpanDegrees: Math.round(arcSpan * 100) / 100,
    conjunctPlanets,
    aspectingPlanets,
    transitingActivationGuidance,
  };
}

/**
 * Evaluates the Water-Bearer (Kumbha / Pitcher) archetype and Teeth physical indicator for the chart.
 */
export function evaluateKumbhaWaterBearerArchetype(natalEphemeris: EphemerisResult): KumbhaHouseArchetype {
  const ascDegree = natalEphemeris.ascendant?.siderealLongitude ?? 0;
  const ascSignIdx = Math.floor((((ascDegree % 360) + 360) % 360) / 30);
  const kumbhaSignIdx = 10; // Aquarius is sign 10

  const houseNumber = ((kumbhaSignIdx - ascSignIdx + 12) % 12) + 1;
  const template = KUMBHA_HOUSE_ARCHETYPES[houseNumber] ?? KUMBHA_HOUSE_ARCHETYPES[1];

  return {
    houseNumber,
    signIndex: kumbhaSignIdx,
    signName: "Aquarius",
    archetypeTitle: template.archetypeTitle,
    waterBearerDuty: template.waterBearerDuty,
    selflessGivingMandate: template.selflessGivingMandate,
    karmicTrap: template.karmicTrap,
    enduringBlessing: template.enduringBlessing,
    teethPhysicalIndicator: template.teethPhysicalIndicator,
  };
}

/**
 * Audits Rahu's occupied house and Aquarius house against the Universal Non-Exploitation Law.
 */
export function evaluateRahuHouseNonExploitation(natalEphemeris: EphemerisResult): {
  rahuHouse: number;
  aquariusHouse: number;
  activeRahuRule: RahuNonExploitationRule;
  activeAquariusRule: RahuNonExploitationRule;
  universalWarning: string;
} {
  const ascDegree = natalEphemeris.ascendant?.siderealLongitude ?? 0;
  const ascSignIdx = Math.floor((((ascDegree % 360) + 360) % 360) / 30);

  const rahuPos = natalEphemeris.planets["Rahu"];
  const rahuLong = rahuPos?.siderealLongitude ?? 0;
  const rahuSignIdx = Math.floor((((rahuLong % 360) + 360) % 360) / 30);

  const rahuHouse = ((rahuSignIdx - ascSignIdx + 12) % 12) + 1;
  const aquariusHouse = ((10 - ascSignIdx + 12) % 12) + 1;

  const rahuTemplate = RAHU_NON_EXPLOITATION_RULES[rahuHouse] ?? RAHU_NON_EXPLOITATION_RULES[1];
  const aquariusTemplate = RAHU_NON_EXPLOITATION_RULES[aquariusHouse] ?? RAHU_NON_EXPLOITATION_RULES[1];

  const activeRahuRule: RahuNonExploitationRule = {
    houseNumber: rahuHouse,
    houseSignification: rahuTemplate.houseSignification,
    dangerZoneExploitation: rahuTemplate.dangerZoneExploitation,
    karmicBacklash: rahuTemplate.karmicBacklash,
    selflessServicePathway: rahuTemplate.selflessServicePathway,
    isActiveRahuHouse: true,
    isActiveAquariusHouse: rahuHouse === aquariusHouse,
  };

  const activeAquariusRule: RahuNonExploitationRule = {
    houseNumber: aquariusHouse,
    houseSignification: aquariusTemplate.houseSignification,
    dangerZoneExploitation: aquariusTemplate.dangerZoneExploitation,
    karmicBacklash: aquariusTemplate.karmicBacklash,
    selflessServicePathway: aquariusTemplate.selflessServicePathway,
    isActiveRahuHouse: rahuHouse === aquariusHouse,
    isActiveAquariusHouse: true,
  };

  const universalWarning =
    "UNIVERSAL RAHU KARMIC LAW: Never cheat, deceive, exploit, or cause deliberate harm to the people or assets represented by the house where Rahu sits, or where Aquarius falls. Exploitation of that specific life domain triggers Rahu's severe retribution, dismantling the native's own foundation, wealth, and mental equilibrium. Conversely, offering selfless service and humble protection to that house transforms shadowy debt into enduring divine grace.";

  return {
    rahuHouse,
    aquariusHouse,
    activeRahuRule,
    activeAquariusRule,
    universalWarning,
  };
}

/**
 * Evaluates the 11th House True Friend Rule and matches optional friend name against favorable signs.
 */
export function evaluateFriendshipZodiacAlignment(
  natalEphemeris: EphemerisResult,
  friendName?: string
): TrueFriendAllianceProfile {
  const ascDegree = natalEphemeris.ascendant?.siderealLongitude ?? 0;
  const ascSignIdx = Math.floor((((ascDegree % 360) + 360) % 360) / 30);

  const moonPos = natalEphemeris.planets["Moon"];
  const moonLong = moonPos?.siderealLongitude ?? 0;
  const moonSignIdx = Math.floor((((moonLong % 360) + 360) % 360) / 30);

  // 11th from Lagna
  const eleventhLagnaIdx = (ascSignIdx + 10) % 12; // 0-indexed: +10 is 11th sign
  const eleventhLagnaInfo = RASHI_NAMES[eleventhLagnaIdx];

  // 11th from Moon
  const eleventhMoonIdx = (moonSignIdx + 10) % 12;
  const eleventhMoonInfo = RASHI_NAMES[eleventhMoonIdx];

  // 5th and 9th trines from Lagna
  const fifthSignIdx = (ascSignIdx + 4) % 12;
  const ninthSignIdx = (ascSignIdx + 8) % 12;

  const profile: TrueFriendAllianceProfile = {
    eleventhFromLagna: {
      signIndex: eleventhLagnaIdx,
      signName: eleventhLagnaInfo?.englishName ?? "Unknown",
      element: eleventhLagnaInfo?.element ?? "Air",
      modality: [0, 3, 6, 9].includes(eleventhLagnaIdx) ? "Movable" : [1, 4, 7, 10].includes(eleventhLagnaIdx) ? "Fixed" : "Dual",
      friendlySounds: SIGN_SOUND_MAPPING[eleventhLagnaIdx] ?? [],
      allianceType: "11th From Lagna (Fixed Fidelity Ally - Lifelong Non-Betrayal)",
    },
    eleventhFromMoon: {
      signIndex: eleventhMoonIdx,
      signName: eleventhMoonInfo?.englishName ?? "Unknown",
      element: eleventhMoonInfo?.element ?? "Air",
      modality: [0, 3, 6, 9].includes(eleventhMoonIdx) ? "Movable" : [1, 4, 7, 10].includes(eleventhMoonIdx) ? "Fixed" : "Dual",
      friendlySounds: SIGN_SOUND_MAPPING[eleventhMoonIdx] ?? [],
      allianceType: "11th From Moon (Emotional Guardian & Unshakeable Supporter)",
    },
    trinalAllies: {
      fifthSign: { index: fifthSignIdx, name: RASHI_NAMES[fifthSignIdx]?.englishName ?? "Unknown" },
      ninthSign: { index: ninthSignIdx, name: RASHI_NAMES[ninthSignIdx]?.englishName ?? "Unknown" },
      spiritualRole: "The 9th House represents Dharmic guides and fortune catalysts; the 5th House represents past-life karmic allies (Purva Punya). Friends born with these rising signs or name initials provide intuitive harmony.",
    },
  };

  if (friendName && friendName.trim().length > 0) {
    const cleanName = friendName.trim();
    let detectedSignIdx = -1;

    // Check two-letter prefixes first, then one-letter
    for (let rIdx = 0; rIdx < 12; rIdx++) {
      const sounds = SIGN_SOUND_MAPPING[rIdx] ?? [];
      for (const sound of sounds) {
        if (cleanName.toLowerCase().startsWith(sound.toLowerCase())) {
          detectedSignIdx = rIdx;
          break;
        }
      }
      if (detectedSignIdx !== -1) break;
    }

    // Default if not matched
    if (detectedSignIdx === -1) {
      detectedSignIdx = cleanName.toLowerCase().charCodeAt(0) % 12;
    }

    const detectedSignName = RASHI_NAMES[detectedSignIdx]?.englishName ?? "Unknown";
    const houseFromLagna = ((detectedSignIdx - ascSignIdx + 12) % 12) + 1;

    let relationshipStatus: NonNullable<TrueFriendAllianceProfile["analyzedFriend"]>["relationshipStatus"] = "Neutral";
    let detailedGuidance = "";

    if (detectedSignIdx === eleventhLagnaIdx || detectedSignIdx === eleventhMoonIdx) {
      relationshipStatus = "Supreme 11th House Loyalist";
      detailedGuidance = `${cleanName} resonates with ${detectedSignName} (House 11 axis). Under the classical 11th House Friend Rule, this person carries an enduring Fixed-Air fidelity and will steadfastly stand by you without betrayal during major crises.`;
    } else if (detectedSignIdx === ninthSignIdx) {
      relationshipStatus = "9th House Dharmic Ally";
      detailedGuidance = `${cleanName} aligns with ${detectedSignName} (9th House of Dharma). This person serves as a moral anchor, wise counselor, and catalyst for auspicious fortune.`;
    } else if (detectedSignIdx === fifthSignIdx) {
      relationshipStatus = "5th House Karmic Protector";
      detailedGuidance = `${cleanName} matches ${detectedSignName} (5th House of Purva Punya). There is natural creative affinity, joy, and mutual affection stemming from past-life merits.`;
    } else if ([1, 4, 7, 10].includes(houseFromLagna)) {
      relationshipStatus = "Functional Kendra Partner";
      detailedGuidance = `${cleanName} sits in a foundational Kendra house (House ${houseFromLagna}). Excellent for professional collaboration, shared execution, and structured projects.`;
    } else if ([6, 8, 12].includes(houseFromLagna)) {
      relationshipStatus = "Karmic Debtor (Dusthana)";
      detailedGuidance = `${cleanName} activates House ${houseFromLagna} (${detectedSignName}). This relationship involves past-life accounts. Give selflessly without expecting reciprocal favors to clear karmic debts peacefully.`;
    } else {
      relationshipStatus = "Neutral";
      detailedGuidance = `${cleanName} falls in House ${houseFromLagna} (${detectedSignName}). A pleasant, supportive connection that prospers through mutual respect and clear boundaries.`;
    }

    profile.analyzedFriend = {
      name: cleanName,
      detectedSignIndex: detectedSignIdx,
      detectedSignName,
      relationshipStatus,
      detailedGuidance,
    };
  }

  return profile;
}

/**
 * Synthesizes the Triad Rulership (Saturn, Rahu, Uranus) and Mythological Archetypes.
 */
export function evaluateAquariusTriadRulership(natalEphemeris: EphemerisResult): {
  saturnRole: string;
  rahuRole: string;
  uranusRole: string;
  varahaAvataraSynthesis: string;
  jalandharaDiplomacySynthesis: string;
} {
  const saturnRole =
    "Saturn (Traditional Ruler): Governs the bedrock foundation, grassroots service, patience, structural discipline, and perseverance of Aquarius. He ensures the native works behind the scenes without demanding premature applause.";

  const rahuRole =
    "Rahu (Co-Ruler & Moolatrikona Favorite): Bestows non-linear visionary ambition, out-of-the-box thinking, international scale, and diplomatic courage. Rahu in Aquarius strives for vast collective breakthroughs while learning the hard lesson that easy personal glory is deliberately withheld.";

  const uranusRole =
    "Uranus / Harshal (Modern Resonator): Introduces lightning-quick breakthroughs, sudden shifts, and unpredictable revolutions to whichever house Aquarius occupies, smashing outdated orthodoxy to inaugurate humanitarian innovation.";

  const varahaAvataraSynthesis =
    "VARAHA AVATARA ARCHETYPE: When the earth sank into the abyssal cosmic waters, Lord Vishnu manifested not as an ornate, glamorous king, but as the mighty boar Varaha. Emerging from Brahma's nostril, he dove into the dark ocean and hoisted the earth upon his tusks to save creation. Despite this colossal cosmic feat, he wore the humble form of a beast, and personal worldly vanity was non-existent. Whichever house Aquarius occupies requires you to embody the Varaha archetype: perform the deepest, heaviest foundational rescue work quietly, and remain unshakeable even when superficial credit is withheld.";

  const jalandharaDiplomacySynthesis =
    "RAHU'S DIPLOMATIC ELOQUENCE (The Jalandhara Legend): When the demon king Jalandhara impudently sent an ultimatum demanding Goddess Parvati, no celestial messenger dared face Lord Shiva with such an outrage. Rahu volunteered, delivering the shocking provocation with such exquisite diplomatic composure, poetic grace, and calm poise that Lord Shiva, instead of incinerating him in wrath, laughed in genuine amusement. Aquarius grants this supreme gift: the communicative courage and diplomatic tact to articulate the most delicate, controversial, or dangerous truths calmly without provoking hostility.";

  return {
    saturnRole,
    rahuRole,
    uranusRole,
    varahaAvataraSynthesis,
    jalandharaDiplomacySynthesis,
  };
}

/**
 * Master Report Generator for Aquarius, Rahu, Bhrigu Bindu & Karmic Protection.
 */
export function generateKumbhaAquariusMasterReport(
  natalEphemeris: EphemerisResult,
  friendName?: string
): KumbhaAquariusMasterReport {
  const bhriguBinduAxis = calculateBhriguBindu(natalEphemeris);
  const kumbhaWaterBearer = evaluateKumbhaWaterBearerArchetype(natalEphemeris);
  const rahuNonExploitation = evaluateRahuHouseNonExploitation(natalEphemeris);
  const triadRulership = evaluateAquariusTriadRulership(natalEphemeris);
  const friendshipAlliances = evaluateFriendshipZodiacAlignment(natalEphemeris, friendName);

  const teethIndicator = {
    aquariusHouse: kumbhaWaterBearer.houseNumber,
    targetRelative: kumbhaWaterBearer.teethPhysicalIndicator.relativeOrDomain,
    dentalObservation: `${kumbhaWaterBearer.teethPhysicalIndicator.dentalSignature} (${kumbhaWaterBearer.teethPhysicalIndicator.clinicalObservation})`,
  };

  const spiritualShieldAndRemedies = {
    batukBhairavShield: {
      mantraOrStotra: "Batuk Bhairav Stotra / Sri Bhairava Ashtakam ('Yam Yam Yam Yaksha Roopam...')",
      spiritualFunction: "Pacifies sudden malefic shocks, neutralizing volatile Rahu-Ketu upheavals and shadow turbulence across the Aquarius axis.",
      dailyProtocol: "Chant or listen to the Bhairava Ashtakam daily during twilight/evening. Only Lord Shiva (Tripurari) can tame the immortal Rahu-Ketu axis.",
    },
    animalRemedies: {
      streetDogs: "Feed and care for street dogs (stray animals) weekly. This appeases both Saturn and Ketu, grounding volatile energy and safeguarding the household.",
      elephantsAndSilver: "Feed and honor elephants (Hathi) whenever possible. Keeping a solid silver elephant in the North or East of the home/workplace harmonizes Rahu, Saturn, and Lord Ganesha, converting the 11th house into an engine of sustainable prosperity.",
    },
    bodilyCorrespondences: BODILY_CORRESPONDENCE_LIST,
  };

  const holisticDossierSummary = `Aquarius (Kumbha Rashi) occupies House ${kumbhaWaterBearer.houseNumber} in your chart, activating the sacred archetype of the Water-Bearer: "${kumbhaWaterBearer.archetypeTitle}". In this house, your mandate is selfless service—pouring out your gifts without demanding recognition to clear past-life karmic debts before spiritual liberation (Moksha). Your Bhrigu Bindu sits at ${bhriguBinduAxis.bhriguBindu.formattedPosition} (House ${bhriguBinduAxis.bhriguBindu.houseFromLagna}), while the opposing Destiny Point sits at ${bhriguBinduAxis.destinyPoint.formattedPosition} (House ${bhriguBinduAxis.destinyPoint.houseFromLagna}). Transits over this axis trigger pivotal life turning points. In your physical anatomy, Aquarius reflects through the teeth of ${teethIndicator.targetRelative}. Furthermore, Rahu sits in House ${rahuNonExploitation.rahuHouse}: you must strictly avoid exploiting or deceiving this house's significations (${rahuNonExploitation.activeRahuRule.houseSignification}), turning instead toward selfless service to guarantee enduring divine protection under the spiritual shield of Batuk Bhairava.`;

  return {
    bhriguBinduAxis,
    kumbhaWaterBearer,
    teethIndicator,
    rahuNonExploitation,
    triadRulership,
    friendshipAlliances,
    spiritualShieldAndRemedies,
    holisticDossierSummary,
  };
}
