# 📜 Comprehensive Classical Astrology Corpus Audit: Unimplemented & Half-Implemented Chapters

> **Repository:** `d:\newWayToAstro` (`knight0917/astroweb`)  
> **Source Database:** `D:\ASTROLOGY-BOOKS-DATABASE-master`  
> **Scope:** Full chapter-by-chapter audit of 20+ foundational Sanskrit astrological classics, identifying codified components, partially codified systems, uncodified chapters, and the precise architectural or shastric reasons for their status.

---

## 📊 Executive Summary & Corpus Status

| Category | Count | Percentage | Primary Nature |
|---|---|---|---|
| **Fully Implemented & Codified** | ~255 Chapters / Modules | **42.5%** | Planetary math, Ashtakavarga, Shadbala, core Bhavas, Shodashavarga, primary Yogas, Vimshottari Dasha, Matchmaking Kootas. |
| **Half / Partially Implemented** | ~170 Chapters / Modules | **28.3%** | Bhavas with only general interpretations, partial Yoga subsets (e.g. 165/300 Raman Yogas), simplified Dasha models, Nadi Amshas lacking granular shloka commentaries. |
| **Unimplemented / Omitted** | ~175 Chapters / Modules | **29.2%** | Bodily signs (Samudrika), historical labor-room omens, conditional Dashas, complex Ayurdaya reductions, Karmic Curses (Shāpas), and Vedic Shantis. |

---

## 🏷️ Taxonomy of Non-Implementation & Partial Implementation Reasons

Every unimplemented or half-implemented chapter falls under one or more deterministic engineering classifications:

*   **`[REASON-A: Non-Horoscopic / Divinatory / Samudrika]`**: Subjects reliant on physical bodily inspection (moles, palm lines, gait, facial marks), messenger gestures, animal behavior, or physical dice/cowrie tosses rather than planetary ephemeris coordinates.
*   **`[REASON-B: Archaic Socio-Historical Context]`**: Obsolete medieval/ancient circumstances (e.g., swaddling cloth color at birth, birthing chamber earthen lamp direction, elephant army clashes, royal harem intrigue).
*   **`[REASON-C: Missing Boundary Input Data]`**: Calculations requiring missing parameters not present in standard birth charts (e.g., exact conception time *Nisheka*, unknown birth time reconstruction *Nashta Jataka*, horary client psychic breath *Swara*).
*   **`[REASON-D: Extreme Algorithmic Complexity / Non-Linear Mathematics]`**: Intricate historical algorithms requiring multi-layered reductions (e.g., Kalachakra Dasha jumping movements *Manduka/Markati Gati*, Pindayu/Amshayu complex deductions *Chakrapata Harana*).
*   **`[REASON-E: Specialized Vedic Remedial Rituals]`**: Elaborate Vedic sacrifices, specific fire oblations (*Homa*), gold/cow donations, and pilgrimage rites (*Sraddha*) that require custom astrological prescription engines rather than standard chart display.
*   **`[REASON-F: Engineering Backlog / Prioritization]`**: Core classical chapters scheduled for future development phases following primary user-facing engine rollouts.

---

## 1. 🏛️ Brihat Parashara Hora Shastra (BPHS) — Maharshi Parashara (97 Chapters)

The magnum opus of Vedic astrology. The platform currently codifies major foundational frameworks (Chapters 2, 5, 6, 7, 27, 28, 29, 30, 31, 32, 34, 45, 46, 66–70, 74, 80). Below is the comprehensive audit of the remaining chapters:

| Chapter # | Chapter Title (Sanskrit / English) | Implementation Status | Implemented Components | Unimplemented / Missing Components | Reason Code & Architectural Rationale |
|---|---|---|---|---|---|
| **Ch. 9** | **Balarishta (बालारिष्ट - Evils at Birth)** | 🔴 **Unimplemented** | None | 32 classical combinations of infant mortality before age 8 (Moon in 6/8/12 afflicted by malefics, Lagna lord defeated, etc.). | `[REASON-F, REASON-B]` Requires delicate modern medical ethical handling; must not issue fatalistic childhood death alerts without strict medical disclaimers. |
| **Ch. 10** | **Balarishta Bhanga (बालारिष्ट भङ्ग - Antidotes for Evils)** | 🔴 **Unimplemented** | None | Powerful neutralizing shields (Jupiter in Lagna, strong full Moon in kendras, Venus aspecting Lagna) that negate infant affliction. | `[REASON-F]` Belongs directly with Ch. 9 as an antidote engine. |
| **Ch. 25** | **Aprakasha Grahas (अप्रकाश ग्रह - Non-Luminous Upagrahas)** | 🟡 **Half Implemented** | Mathematical longitudes of Gulika, Mandi, Dhuma, Vyatipata, Paridhi, Indrachapa, Upaketu computed in [`src/engine/upagrahas.ts`](file:///d:/newWayToAstro/src/engine/upagrahas.ts). | Specific bhava-placement predictions for each of the 11 Upagrahas across all 12 houses; Gulika's death-inflicting degree triggers. | `[REASON-F]` Math is complete; interpretation matrix for all 11 Upagrahas x 12 Bhavas (132 text nodes) pending insertion into dossier. |
| **Ch. 43** | **Ayurdaya (आयुर्दाय - Longevity Computation)** | 🔴 **Unimplemented** | General longevity tier classifications in Jaimini engine. | Parashari mathematical longevity derivations: Pindayu, Amshayu, Nisargayu with all Haranas (reductions for debilitation, enemy sign, combust, and visible hemisphere). | `[REASON-D]` Highly controversial math in classical scholarship with divergent school interpretations; complex non-linear reduction chains. |
| **Ch. 44** | **Maraka Grahas (मारक ग्रह - Death-Inflicting Planets)** | 🟡 **Half Implemented** | Identification of 2nd and 7th lords as primary Marakas in [`src/engine/chatContext.ts`](file:///d:/newWayToAstro/src/engine/chatContext.ts). | Strict hierarchical elimination tree (Lords of 2/7 $\rightarrow$ Occupants $\rightarrow$ Associates $\rightarrow$ 12th/8th lords $\rightarrow$ Saturn's overriding role). | `[REASON-F]` Needs dedicated deterministic death-inflicting timing matrix for Mahadasha/Antardasha selection. |
| **Ch. 48–50** | **Conditional Nakshatra & Rashi Dashas** | 🔴 **Unimplemented** | Only standard Vimshottari & basic Jaimini Chara Dasha implemented. | Shodashottari (116 yrs), Dvadashottari (112 yrs), Ashtottari (108 yrs), Panchottari (105 yrs), Shat-trimshatsama (36 yrs), Shatabdika (100 yrs), Chaturashiti-sama (84 yrs), Dwisaptati-sama (72 yrs), Shashti-hayani (60 yrs). | `[REASON-D, REASON-F]` Conditional triggers (e.g. birth in Krishna Paksha daytime with Lagna in Sun's Hora) require chart-conditional routing. |
| **Ch. 49, 64** | **Kala Chakra Dasha (कालचक्र दशा - KCD)** | 🟡 **Half Implemented** | Deha and Jeeva signs flagged in [`src/engine/jatakaParijata.ts`](file:///d:/newWayToAstro/src/engine/jatakaParijata.ts). | Complete timeline generation: Savya (direct) and Apasavya (indirect) cycles, jumps (*Manduka Gati* - frog leap, *Markati Gati* - monkey leap, *Simhavalokana* - lion's backward glance). | `[REASON-D]` Highly intricate non-zodiacal dasha sequence requiring specialized algorithmic state machine. |
| **Ch. 71** | **Ashtakavarga Longevity (अष्टकवर्ग आयुर्दाय)** | 🔴 **Unimplemented** | Ashtakavarga Shodhana (Trikona & Ekadhipatya) and Pindas codified in [`src/engine/bphsCore.ts`](file:///d:/newWayToAstro/src/engine/bphsCore.ts). | Multiplication of Yoga Pinda by 7, division by 27 and 324 to derive exact years, months, and days of lifespan, plus reductions. | `[REASON-D]` Classical discrepancies between Parashara and Varahamihira formulas; deferred to avoid fatalistic output. |
| **Ch. 73** | **Rashmi Phala (रश्मि फल - Planetary Rays)** | 🔴 **Unimplemented** | Planetary aspect rays codified in [`src/engine/aspectRays.ts`](file:///d:/newWayToAstro/src/engine/aspectRays.ts). | Exact calculation of net auspicious (*Uchcha*) vs inauspicious (*Neecha*) rays for each planet and sovereign destiny metrics based on ray counts (>35 rays = King). | `[REASON-F]` High astrological value; pending mathematical formula codification into `bphsCore.ts`. |
| **Ch. 75** | **Panchamahapurusha Characteristics** | 🟡 **Half Implemented** | Detection of Ruchaka, Bhadra, Hamsa, Malavya, Sasa in [`src/engine/yogas.ts`](file:///d:/newWayToAstro/src/engine/yogas.ts). | Granular morphological, psychological, vocal, and historical leadership traits described in BPHS verses. | `[REASON-F]` Textual descriptions can be injected into the UI modal cards. |
| **Ch. 76–77** | **Pancha Bhutas & Gunas (पञ्चभूत एवं त्रिगुण फल)** | 🔴 **Unimplemented** | Elementary planetary mapping. | Detailed psychological and physical diagnosis of dominance of Earth, Water, Fire, Air, Ether, and Sattva/Rajas/Tamas from planetary disposition. | `[REASON-F]` Ideal for Ayurvedic/psychological wellness profiling. |
| **Ch. 78** | **Nashta Jataka (नष्ट जातक - Lost Horoscopy)** | 🔴 **Unimplemented** | None | Algorithmic reconstruction of an unknown birth chart using Prashna hour, query direction, or physical hand characteristics. | `[REASON-C]` Outside boundary of natal chart calculation; requires interactive horary input. |
| **Ch. 79** | **Pravrajya Yogas (प्रव्रज्या योग - Asceticism & Renunciation)** | 🟡 **Half Implemented** | General multi-planet conjunctions in 10th house. | Parashara's 4+ planet clusters, Lord of D-10 aspects, Moon in Saturn's Drekkana determining monastic orders (*Sannyasa*). | `[REASON-F]` Ready to be codified into `yogas.ts`. |
| **Ch. 81** | **Stri Anga Lakshana (स्त्र्यङ्ग लक्षण - Female Body Signs)** | 🔴 **Unimplemented** | None | Samudrika Shastra: omens and indications of feet, soles, nails, shins, thighs, breasts, neck, lips, eyes, and hair. | `[REASON-A]` Non-computational physiognomy; impossible to calculate from natal birth data alone. |
| **Ch. 82** | **Mashaka-Tilaka Lakshana (मशक-तिलक लक्षण - Moles & Marks)** | 🔴 **Unimplemented** | None | Auspicious vs afflicted indications of moles, birthmarks, and whorls on the right vs left side for men and women. | `[REASON-A]` Non-computational physiognomic divination. |
| **Ch. 83** | **Pūrva Janma Shāpa (पूर्वजन्म शाप - Karmic Curses)** | 🔴 **Unimplemented** | None | **8 Karmic Curses causing childlessness (*Putra Dosha*):**<br>1. *Sarpa Shāpa* (Snake curse - Rahu in 5th)<br>2. *Pitri Shāpa* (Father's curse - Sun afflicted in 5th/9th)<br>3. *Matri Shāpa* (Mother's curse - Moon afflicted in 5th/4th)<br>4. *Bhratri Shāpa* (Brother's curse - Mars afflicted in 5th/3rd)<br>5. *Matula Shāpa* (Uncle's curse - Mercury/Mars/Ketu)<br>6. *Brahmana Shāpa* (Guru/Preceptor's curse - Jupiter afflicted)<br>7. *Patni Shāpa* (Spouse's curse - Venus in 5th)<br>8. *Preta Shāpa* (Ghost/ancestor curse - Sun/Saturn/Rahu in 5th). | `[REASON-E, REASON-F]` High priority for future roadmap; deterministic 5th-house veto rules and authentic classical remedies (*Nagabali, Gaya Shraddha, Rudrabhisheka*). |
| **Ch. 84** | **Graha Shānti Vidhāna (ग्रहशान्ति विधान - Planetary Pacification)** | 🟡 **Half Implemented** | Standard mantras and basic remedies exist in [`src/engine/chatContext.ts`](file:///d:/newWayToAstro/src/engine/chatContext.ts). | Parashara's explicit homa rituals, fire wood (*Samidhas*: Ark, Khadira, Apamarga, Ashvattha, etc.), specific cloth colors, metals, and dana procedures. | `[REASON-E]` Ritual manual details rather than mathematical planetary algorithms. |
| **Ch. 85** | **Dushta Janma (दुष्ट जन्म - Inauspicious Births Overview)** | 🔴 **Unimplemented** | None | General conditions of births occurring under malefic portents (*Utpāta*). | `[REASON-F]` Introductory chapter to Ch. 86–96. |
| **Ch. 86** | **Amāvāsyā Janma Shānti (अमावास्या जनन)** | 🔴 **Unimplemented** | Tithi identification exists in Panchang engine. | Affliction to father, mother, and prosperity due to birth on New Moon (Sun-Moon exact conjunction); classical *Kalasha Sthapana* shanti ritual. | `[REASON-E, REASON-F]` Requires automated diagnostic flag in birth chart analysis. |
| **Ch. 87** | **Krishna Chaturdashi Janma (कृष्ण चतुर्दशी जनन)** | 🔴 **Unimplemented** | Tithi identification exists in Panchang engine. | Division of 14th waning Tithi into 6 specific sextiles affecting father, mother, maternal uncle, siblings, self, and wealth; specific shanti. | `[REASON-E, REASON-F]` High astrological utility; exact mathematical sextile calculation is straightforward. |
| **Ch. 88** | **Bhadrā & Dushta Yoga Shānti (भद्रा, व्यतीपात, वैधृति)** | 🔴 **Unimplemented** | Vishti Karana, Vyatipata, Vaidhriti identified in Panchang engine. | Explicit natal afflictions and remedial pacification rituals for births during Vishti (Bhadra) and inauspicious Mahapata yogas. | `[REASON-E, REASON-F]` Can be integrated directly into Panchang engine. |
| **Ch. 89** | **Dushta Nakshatra Janma (यमधण्टादि नक्षत्र)** | 🔴 **Unimplemented** | Basic Nakshatra identification exists. | Birth in inauspicious planetary hours/nakshatras (*Yamaghanta, Kulaghna, Dagdha Nakshatras*). | `[REASON-F]` Pending rule matrix codification. |
| **Ch. 90** | **Sankrānti Janma Shānti (संक्रान्ति जनन)** | 🔴 **Unimplemented** | Solar ingress calculations exist in ephemeris. | Birth precisely during the solar transit from one zodiac sign to another (16 ghatikas before and after ingress). | `[REASON-E, REASON-F]` Readily computable from solar longitude velocity. |
| **Ch. 91** | **Grahana Janma Shānti (सूर्य-चन्द्र ग्रहण)** | 🔴 **Unimplemented** | None | Birth during a solar or lunar eclipse (Rahu/Ketu within nodal orb of Sun/Moon). | `[REASON-E, REASON-F]` High karmic impact; computable via nodal distance. |
| **Ch. 92** | **Gandānta Shānti (गण्डान्त जनन)** | 🔴 **Unimplemented** | Nakshatra and Lagna degrees computed in ephemeris. | **Triple Gandanta Diagnostic:**<br>1. *Lagna Gandanta* (junction of water & fire signs: Pisces-Aries, Cancer-Leo, Scorpio-Sagittarius)<br>2. *Nakshatra Gandanta* (junction of Revati-Ashwini, Ashlesha-Magha, Jyeshtha-Mula)<br>3. *Tithi Gandanta* (Purna to Nanda tithis). Classical 27-day isolation and Abhishek ritual. | `[REASON-E, REASON-F]` Extremely important classical dosha; high priority for engine codification. |
| **Ch. 93** | **Abhukta Mūla Shānti (अभुक्तमूल जनन)** | 🔴 **Unimplemented** | Nakshatra degrees computed in ephemeris. | Birth in the final 2 ghatikas (48 mins) of Ashlesha or first 2 ghatikas of Mula; 8-year paternal non-sighting rule and Vedic shanti. | `[REASON-E, REASON-F]` Critical classical dosha easily calculated from lunar longitude. |
| **Ch. 94** | **Jyeshthā Gandānta Shānti (ज्येष्ठा गण्डान्त)** | 🔴 **Unimplemented** | Nakshatra degrees computed in ephemeris. | Specific 4 quarters (padas) of Jyeshtha causing harm to elder brother, maternal uncle, mother, or self. | `[REASON-E, REASON-F]` Direct pada lookup from Moon longitude. |
| **Ch. 95** | **Trik Prasava Shānti (त्रिक प्रसव जनन)** | 🔴 **Unimplemented** | None | Birth of a daughter after three consecutive sons, or a son after three consecutive daughters, causing energetic stress to parents. | `[REASON-C, REASON-E]` Requires knowledge of previous siblings' gender sequence (missing from standard natal chart inputs). |
| **Ch. 96** | **Vikrita Prasava Shānti (विकृत प्रसव जनन)** | 🔴 **Unimplemented** | None | Anomalous deliveries, breech births, abnormal physical conditions at birth, births during earthquakes/comets. | `[REASON-A, REASON-B]` Non-horoscopic obstetrical anomaly. |
| **Ch. 97** | **Upasamhāra (उपसंहार - Conclusion)** | 🔴 **N/A** | Benediction | Phalasruti and spiritual benefits of Hora Shastra. | `[REASON-N/A]` Narrative conclusion; no algorithmic content. |

---

## 2. 🌞 Brihat Jataka — Acharya Varahamihira (28 Adhyayas)

Varahamihira's concise intellectual masterpiece. Implemented in [`src/engine/brihatJataka.ts`](file:///d:/newWayToAstro/src/engine/brihatJataka.ts) (Chapters 1, 2, 8, 11, 12, 13, 19). Unimplemented or partially implemented chapters:

| Adhyaya # | Chapter Title | Status | Implemented | Unimplemented / Missing | Reason & Architectural Rationale |
|---|---|---|---|---|---|
| **Ch. 4** | **Nisheka (निषेकाध्याय - Consummation & Conception)** | 🟡 **Half Implemented** | Basic prenatal epoch in [`src/engine/adhanaKundali.ts`](file:///d:/newWayToAstro/src/engine/adhanaKundali.ts). | Determination of sex at conception, birth of twins/triplets, physical deformities during gestation, father absent at delivery (*Proshita Pitri*). | `[REASON-C]` Conception time is almost never recorded by modern users; relies on hypothetical reverse-calculation from birth chart. |
| **Ch. 5** | **Janma Vidhi (सूतिकाध्याय - Birthing Conditions)** | 🔴 **Unimplemented** | None | Environmental conditions during delivery: room orientation, lighting conditions, delivery in boats/travel, midwife characteristics, umbilical cord wrapping (*Veshtana Yoga*). | `[REASON-B]` Historical ancient obstetrics; clinically irrelevant in modern hospital deliveries. |
| **Ch. 6** | **Balarishta (बालारिष्ट - Infant Mortality)** | 🔴 **Unimplemented** | None | Varahamihira’s specific rules of infant death occurring at birth, 1 month, 1 year, 4 years, and 8 years. | `[REASON-F]` Medical safety and sensitivity considerations. |
| **Ch. 7** | **Ayurdaya (आयुर्दाय - Longevity Calculation)** | 🔴 **Unimplemented** | None | Classical mathematical longevity methods of Maya, Yavanacharya, Jeevasharma, and Satyacharya; planetary term deductions. | `[REASON-D]` Highly intricate reduction formulas with multiple conflicting commentators (Bhattotpala vs modern scholars). |
| **Ch. 9** | **Pravrajya (प्रव्रज्या - Monastic Orders)** | 🟡 **Half Implemented** | General spiritual combinations. | Strict assignment of 7 monastic ascetic sects based on the strongest planet in the 10th house or 4-planet cluster: Sun = Tapasvi/Forest recluse, Moon = Kapalika, Mars = Shakya (Buddhist), Mercury = Jeevaka/Ajivika, Jupiter = Bhikshu (Vedantic sannyasin), Venus = Charaka, Saturn = Nirgrantha (Jain). | `[REASON-F]` Fascinating classical archetypes; can be easily codified into spiritual dossier. |
| **Ch. 14–15** | **Dvi-Graha to Sapta-Graha Yogas (2 to 7 Planet Conjunctions)** | 🟡 **Half Implemented** | Core Raja/Dhana conjunctions codified. | Full mathematical permutations of all 28 two-planet, 56 three-planet, 70 four-planet, 56 five-planet, 28 six-planet, and 1 seven-planet conjunctions. | `[REASON-F]` Large lookup matrix; currently relying on modular synthesis rather than hard-coded classical verses. |
| **Ch. 21** | **Chandra-Amsha Phala (चन्द्रांश फल - Moon in Navamshas)** | 🔴 **Unimplemented** | General Navamsha sign placements. | The Moon placed in each of the 9 Navamshas of each of the 12 signs (108 distinct shlokas detailing psychological disposition). | `[REASON-F]` Granular text matrix ready for future expansion. |
| **Ch. 24** | **Stri Jataka (स्त्रीजातक - Female Horoscopy)** | 🟡 **Half Implemented** | Trimsamsha moral/spiritual profiling in [`src/engine/striJataka.ts`](file:///d:/newWayToAstro/src/engine/striJataka.ts). | Specific widowhood indicators, character of husband derived from 7th house Navamsha lord, and breast/physiognomic indications. | `[REASON-A, REASON-B]` Blends bodily physiognomy with chart analysis. |
| **Ch. 25** | **Niryana (निर्याणाध्याय - Demise & Transmigration)** | 🔴 **Unimplemented** | 8th house general indicators. | Mode of death (fire, water, hanging, poison, weapons, wild animals), location of death (own house, temple, roadside, foreign land), post-mortem realm (*Deva Loka, Pitri Loka, Naraka, Tiryak*) based on 12th house and Sun/Moon. | `[REASON-F]` High classical philosophical interest; requires respectful, non-morbid UX presentation. |
| **Ch. 26** | **Nashta Jataka (नष्ट जातक - Lost Horoscopy)** | 🔴 **Unimplemented** | None | Derivation of Lagna, month, and year of birth from the querent's touch or prashna time. | `[REASON-C]` Requires missing prashna boundary inputs. |
| **Ch. 27** | **Drekkana Swarupa (द्रेष्काण स्वरूप - Decanate Personifications)** | 🟡 **Half Implemented** | 22nd Drekkana (Kharesh) calculated in [`src/engine/jatakaParijata.ts`](file:///d:/newWayToAstro/src/engine/jatakaParijata.ts). | Visual, iconographic descriptions of all 36 Drekkanas (e.g., armed warrior with axe, swan-faced woman carrying lotus, serpent bound by iron chains). | `[REASON-F]` Outstanding candidate for rich visual depictions. |

---

## 3. 🐢 Brihat Samhita — Acharya Varahamihira (106 Adhyayas)

The premier encyclopedia of mundane astrology, geo-astronomy, and divination. Implemented in [`src/engine/brihatSamhita.ts`](file:///d:/newWayToAstro/src/engine/brihatSamhita.ts) (Kurma Chakra Ch. 14, Graha Yuddha Ch. 17, Ratna Pariksha Ch. 80–83, Garbhadhana of Clouds Ch. 21–24). The remaining ~95 chapters are audited below:

| Chapter Group | Topic / Scope | Status | Reason & Architectural Rationale |
|---|---|---|---|
| **Ch. 1–13, 15–16, 18–20** | **Planetary Ingresses & Celestial Portents** (Rahu Chara, Ketu Chara comets, Parivesha halos, Ulkas meteors, Sunspots). | 🔴 **Unimplemented** | `[REASON-F]` Mundane macro-astrology (global politics, wars, droughts); outside natal individual horoscope scope. |
| **Ch. 25–45** | **Agro-Meteorology & Rainfall** (Vata Chakra winds, Varshana rain-gauge Drona measurement, Cloud thunder, Crop yields). | 🔴 **Unimplemented** | `[REASON-F]` Agricultural weather forecasting; planned for future Agri-Jyotish module. |
| **Ch. 46–52** | **Terrestrial Omens (Utpāta - उत्पात)** (Earthquakes, Rainbows, Mock suns, Twilight glows, Idol movements). | 🔴 **Unimplemented** | `[REASON-A, REASON-B]` Terrestrial omenology and seismic divination. |
| **Ch. 53** | **Vastu Shastra (Architecture & Construction)** | 🟡 **Half Implemented** | Basic directional energies codified in [`src/engine/vastuEngine.ts`](file:///d:/newWayToAstro/src/engine/vastuEngine.ts); classical palace layout and timber selection uncodified. |
| **Ch. 54** | **Dakargala (दकार्गल - Underground Water Springs)** | 🔴 **Unimplemented** | `[REASON-A]` Subterranean hydrology based on surface vegetation (e.g. termite mounds next to Jamun trees indicate potable water at 15 cubits depth). |
| **Ch. 55–60** | **Vrikshayurveda & Temple Consecration** (Plant medicine, Temple layout *Prasada Lakshana*, Idol proportions *Pratima Lakshana*). | 🔴 **Unimplemented** | `[REASON-B]` Sacred architecture, sculpture, and ancient botany. |
| **Ch. 61–73** | **Animal Physiognomy (Pashu Lakshana)** (Cows, Elephants, Horses, Dogs, Roosters, Crows, Birds). | 🔴 **Unimplemented** | `[REASON-A]` Non-astrological animal physiognomy and behavior divination. |
| **Ch. 74–79** | **Erotics & Perfumery (Gandhayukti, Stri Prasamsā)** | 🔴 **Unimplemented** | `[REASON-B]` Ancient pharmacology, cosmetic perfumery recipes, and relationship poetry. |
| **Ch. 84–106** | **Samudrika Shastra, Royal Insignia & Omens** (Swords, Canes, Umbrellas, Shakuna birds, Tooth-sticks, Festivities). | 🔴 **Unimplemented** | `[REASON-A]` Ancient courtly omenology and tactile divination. |

---

## 4. 📜 Saravali — Maharaja Kalyana Varma (45 Adhyayas)

The definitive royal reference manual. Implemented in [`src/engine/saravali.ts`](file:///d:/newWayToAstro/src/engine/saravali.ts) (Vasumati, Adhi, Chandra Yogas, Conjunctions, 12 Bhavas). Unimplemented or half-implemented chapters:

| Chapter # | Chapter Title | Status | Implemented | Unimplemented / Missing | Reason & Architectural Rationale |
|---|---|---|---|---|---|
| **Ch. 9–10** | **Adhana & Janma Vidhi (Conception & Labor)** | 🔴 **Unimplemented** | None | Biological conception traits, delivery chamber omens, umbilical cord wrapping around limbs. | `[REASON-B, REASON-C]` Historical obstetrical context. |
| **Ch. 11** | **Arishta & Arishta Bhanga (Infant Evils & Exemptions)** | 🔴 **Unimplemented** | None | Exact conditions of infant mortality up to age 12, paired with Kalyana Varma's celebrated exemptions. | `[REASON-F]` Medical sensitivity; ready for future dosha engine. |
| **Ch. 21–30** | **Graha Rashi Phala (Planets in 12 Signs)** | 🟡 **Half Implemented** | General planetary signs active in chart readings. | All 108 specific Sanskrit verses and nuanced predictions of Saravali for Sun through Saturn in Aries through Pisces. | `[REASON-F]` High-value textual enrichment backlog. |
| **Ch. 39–41** | **Ayurdaya (Longevity Reductions)** | 🔴 **Unimplemented** | None | Pindayu, Amshayu, Nisargayu with Kalyana Varma's specific Chakrapata Harana and Kakshya adjustments. | `[REASON-D]` Complex mathematical reduction chains. |
| **Ch. 42** | **Ashtakavarga Transits & Bindu Effects** | 🟡 **Half Implemented** | Base Ashtakavarga and Pindas codified. | Granular effects of transit Sun, Moon, Mars, etc., transiting signs with 0, 1, 2, ... 8 bindus, and Kakshya lords. | `[REASON-F]` Can be bridged directly into [`src/engine/gochar.ts`](file:///d:/newWayToAstro/src/engine/gochar.ts). |
| **Ch. 44** | **Stri Jataka (Female Horoscopy)** | 🟡 **Half Implemented** | Trimsamsha moral dispositions codified in [`src/engine/striJataka.ts`](file:///d:/newWayToAstro/src/engine/striJataka.ts). | Detailed spousal characteristics derived from 7th house and Navamsha combinations. | `[REASON-F]` Can be enriched in marriage engines. |
| **Ch. 45** | **Niryana (Death & Post-Mortem Destiny)** | 🔴 **Unimplemented** | None | Fatal vulnerabilities, circumstances of demise, and post-death spiritual planes. | `[REASON-F]` Philosophical / death timing. |

---

## 5. 📖 Phaladeepika — Acharya Mantreswara (28 Adhyayas)

The most practical predictive classic. Implemented in [`src/engine/phaladeepika.ts`](file:///d:/newWayToAstro/src/engine/phaladeepika.ts) (Viparita Raja Yogas, Neecha Bhanga, 9 Avasthas, 12 Bhavas). Unimplemented or half-implemented chapters:

| Chapter # | Chapter Title | Status | Implemented | Unimplemented / Missing | Reason & Architectural Rationale |
|---|---|---|---|---|---|
| **Ch. 10** | **Kalatra Bhava (Spouse & Multiple Marriages)** | 🟡 **Half Implemented** | 7th house general readings. | Specific combinations for *Bahu-Vivaha* (multiple marriages), separation, and timing of spouse loss. | `[REASON-F]` High-value addition to marriage synthesis engine. |
| **Ch. 11** | **Putra Bhava (Children & Adoption)** | 🟡 **Half Implemented** | 5th house general readings. | Explicit combinations for *Dattaka Putra* (adopted child), barrenness, and gender sequence of children. | `[REASON-F]` Ready for codification into children analysis engine. |
| **Ch. 12** | **Rogas & Shatru (Diseases & Enemies)** | 🟡 **Half Implemented** | 6th house overview. | Mantreswara's specific anatomical disease mapping (e.g. Saturn+Mars in 6th = surgeries; Rahu+Moon = mental distress/hysteria). | `[REASON-F]` Excellent candidate for dedicated medical astrology deck. |
| **Ch. 13** | **Mriti Bhava (Causes of Death)** | 🔴 **Unimplemented** | 8th house overview. | Explicit physical causes of death (fire, weapons, drowning, poisoning, quadruped animals). | `[REASON-F]` Sensitivity / fatalistic filtering. |
| **Ch. 18–22** | **Vimshottari Dasha-Antardasha Nuances** | 🟡 **Half Implemented** | Base timeline dates active in [`src/engine/dasha.ts`](file:///d:/newWayToAstro/src/engine/dasha.ts). | Specific results of all 81 sub-period combinations (e.g. Venus Mahadasha / Sun Antardasha bringing eye trouble and governmental displeasure). | `[REASON-F]` Textual expansion backlog. |
| **Ch. 23** | **Kalachakra Dasha (कालचक्र दशा)** | 🔴 **Unimplemented** | None | Mantreswara's complete 12-rashi KCD wheel, jumping dashas (*Manduka, Markati, Simhavalokana*), Deha/Jeeva affliction rules. | `[REASON-D]` Highly intricate algorithmic non-linear dasha sequence. |
| **Ch. 24** | **Ashtakavarga Kakshya Transits** | 🔴 **Unimplemented** | Base Ashtakavarga bindus computed. | Division of each sign into 8 Kakshyas (3°45' each) governed by Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, Lagna; transit timing triggers. | `[REASON-D, REASON-F]` High predictive precision; planned for transit engine upgrade. |
| **Ch. 25** | **Gulika & Mandi Principles** | 🟡 **Half Implemented** | Longitudes computed in [`src/engine/upagrahas.ts`](file:///d:/newWayToAstro/src/engine/upagrahas.ts). | Mantreswara's specialized fatal triggers: death during transit of Saturn over the degree of Gulika or its trines. | `[REASON-F]` Ready for integration into death/transit diagnostics. |
| **Ch. 26** | **Gochara & Vedha (Transits & Obstacles)** | 🟡 **Half Implemented** | Transits computed in [`src/engine/gochar.ts`](file:///d:/newWayToAstro/src/engine/gochar.ts). | Complete classical *Vedha* (counter-obstacle points) preventing transit fruits (e.g. Sun in 3rd blocked by planet in 9th). | `[REASON-F]` Standard mathematical rule matrix ready for codification. |

---

## 6. 🌺 Jataka Parijata — Vaidyanatha Dikshita (18 Adhyayas / 3 Vols)

The monumental encyclopedic classic. Implemented in [`src/engine/jatakaParijata.ts`](file:///d:/newWayToAstro/src/engine/jatakaParijata.ts) (16 Shodasha Parijata Yogas, 64th Navamsha, 22nd Drekkana, 12 Bhavas). Unimplemented chapters:

| Chapter # | Chapter Title | Status | Implemented | Unimplemented / Missing | Reason & Architectural Rationale |
|---|---|---|---|---|---|
| **Ch. 4** | **Adhana (Impregnation / Conception)** | 🔴 **Unimplemented** | None | Prenatal astrological charts and gestation tracking. | `[REASON-C]` Missing prenatal time data. |
| **Ch. 5** | **Balarishta & Arishta Bhanga** | 🔴 **Unimplemented** | None | 16 lethal child infant combinations and Vaidyanatha's unique cancellation shields. | `[REASON-F]` Medical sensitivity. |
| **Ch. 6** | **Ayurdaya (Longevity Deductions)** | 🔴 **Unimplemented** | None | Mathematical reductions (*Harana*) for planets in combustion, depression, and enemy signs. | `[REASON-D]` Complex historical math. |
| **Ch. 14** | **Stri Jataka (Female Horoscopy)** | 🟡 **Half Implemented** | Trimsamsha moral/spiritual profiling active. | Marital concord and longevity of spouse derived from Upapada and Navamsha 7th lord. | `[REASON-F]` Partially redundant with BPHS Ch. 80. |
| **Ch. 15, 17** | **Kalachakra Dasha Complete Math** | 🟡 **Half Implemented** | Deha/Jeeva signs flagged. | Dynamic timeline generation with Savya/Apasavya direction and jumps. | `[REASON-D]` Algorithmic complexity. |
| **Ch. 18** | **Niryana & Sannyasa (Demise & Renunciation)** | 🔴 **Unimplemented** | None | Spiritual liberation (*Moksha*) indicators from 12th house and Ketu; circumstances of death. | `[REASON-F]` Philosophical / death timing. |

---

## 7. 📜 Jaimini Upadesha Sutras — Maharshi Jaimini (4 Adhyayas / 16 Padas)

The cryptic aphorisms of the Jaimini system. Implemented in [`src/engine/jaimini.ts`](file:///d:/newWayToAstro/src/engine/jaimini.ts) & [`src/engine/jaiminiSutras.ts`](file:///d:/newWayToAstro/src/engine/jaiminiSutras.ts) (7 Chara Karakas, Karakamsha, Arudha Padas, Argala, Chara Dasha). Unimplemented components:

| Adhyaya / Pada | Subject / Sutras | Status | Implemented | Unimplemented / Missing | Reason & Architectural Rationale |
|---|---|---|---|---|---|
| **Adhyaya 2 (Padas 1–4)** | **Longevity, Kakshya Tiers & Rudra/Brahma** | 🔴 **Unimplemented** | Baseline Chara Karakas. | Derivation of *Rudra, Brahma, and Maheshwara* planets; *Kakshya Vriddhi* (tier advancement) and *Kakshya Hrasa* (tier degradation) of lifespan; *Sthira Dasha* and *Brahma Dasha*. | `[REASON-D]` Deeply esoteric mathematical rules with divergent interpretations between Dr. B.V. Raman, Sanjay Rath, and Iranganti Rangacharya. |
| **Adhyaya 3 (Padas 1–4)** | **Specialized Jaimini Dashas** | 🔴 **Unimplemented** | Chara Dasha active. | *Shoola Dasha* (lethal death-timing dasha based on Trishoola signs), *Manduka Dasha, Navamsha Dasha, Padanadhamsa Dasha, Varnada Dasha*. | `[REASON-D, REASON-F]` High predictive value for medical crises; algorithmic sequencing pending. |
| **Adhyaya 4 (Padas 1–4)** | **Spiritual Ascension & Kaivalya Yogas** | 🟡 **Half Implemented** | Ishta Devata / Dharma Peetha active in [`src/engine/jaiminiSutras.ts`](file:///d:/newWayToAstro/src/engine/jaiminiSutras.ts). | Advanced Kaivalya Yogas, Nirvaana Yogas, past-life spiritual progress, and higher spiritual initiation timing. | `[REASON-F]` Ready for integration into spiritual consultation mode. |

---

## 8. 🔮 Prasna Marga — Punneseri Nambi Neelakantha Sharma (32 Adhyayas)

The definitive horary encyclopedia of Kerala astrology. Partially implemented in [`src/engine/matchmaking.ts`](file:///d:/newWayToAstro/src/engine/matchmaking.ts) (Ashtakoota fatal vetoes: Rajju, Vedha, Stree Deergha) and [`src/engine/prashna.ts`](file:///d:/newWayToAstro/src/engine/prashna.ts). **Over 80% of Prasna Marga remains uncodified** due to its horary, divinatory nature:

| Chapter Group | Topic / Scope | Status | Reason & Architectural Rationale |
|---|---|---|---|
| **Ch. 1–7** | **Prasna Methodology, Cowrie Shells & Omens** (Ashtamangala Deva Prasna, messenger gestures, breath *Swara*, burning lamps, articles held). | 🔴 **Unimplemented** | `[REASON-A]` Non-computational divinatory rituals; impossible to calculate purely from birth datetime. |
| **Ch. 8–10** | **Mathematical Sphutas (Trisphuta, Chatusphuta, Panchasphuta, Prana, Deha, Mrityu Sphutas)** | 🟡 **Half Implemented** | Mathematical formulas defined. | Dynamic alerts assessing critical sickness, longevity, or fatal recovery windows based on these sensitive degrees. | `[REASON-F]` Can be codified into medical/horary engine. |
| **Ch. 11–15** | **Rogadhyaya (Disease Diagnosis & Spiritual Afflictions)** (Devata kopa, Bhuta badha, Sarpa badha, Preta dosha, Black magic *Abhichara* diagnosis). | 🔴 **Unimplemented** | `[REASON-A, REASON-E]` Supernatural etiology and esoteric temple remedy prescriptions (*Sarpabali, Tila Homa*). |
| **Ch. 16–22** | **Santana & Vivaha Prasna (Childbirth & Marriage Inquiries)** | 🟡 **Half Implemented** | Ashtakoota marriage vetoes codified. | Santana Thithi, Santana Nakshatra, and immediate child viability horary formulas uncodified. | `[REASON-F]` Ready for integration into horary deck. |
| **Ch. 23–32** | **Specialized Horary Chapters** (Theft/lost articles *Nashta Prasna*, Well-digging *Koopa Prasna*, Warfare/litigation *Yuddha Prasna*, Weather *Varsha Prasna*, House spirits *Vastu Prasna*). | 🔴 **Unimplemented** | `[REASON-C, REASON-F]` Requires interactive horary question context. |

---

## 9. 📜 Deva Keralam (Chandra Kala Nadi) — Acharya Achyuta (150 Nadi Amshas)

Codified in [`src/engine/devaKeralam.ts`](file:///d:/newWayToAstro/src/engine/devaKeralam.ts) with 150 Nadi Amshas (12-minute arc slices) and Purva/Uttara Bhaga divisions.
*   **Status:** 🟡 **Half Implemented**
*   **What is Implemented:** Mathematical derivation of all 150 Nadi Amshas for Lagna and Moon, Purva/Uttara Bhaga splits, and shloka citations for ~40 prominent Nadi Amshas (*Vasudha, Vaishnavi, Brahmi, Kalakoota, Shankhini, Mudgara, Champaka*).
*   **What is Missing:**
    1.  Full shloka text and life milestone timelines for the remaining ~110 Nadi Amshas (currently using generic interpolations).
    2.  *Rasi Sanghatta* & dynamic Nadi transits: intersecting transit Saturn and Jupiter over the exact degrees of the Nadi Amsha of the 9th and 10th lords.
*   **Reason Code:** `[REASON-F]` Extensive text translation and data entry backlog across the two massive volumes (over 1,200 pages).

---

## 10. 🦜 Doctrines of Suka Nadi — Maharshi Shukacharya

Codified in [`src/engine/sukaNadi.ts`](file:///d:/newWayToAstro/src/engine/sukaNadi.ts) with degree-sensitive sutras, karmic ledgers, and activation ages (16, 24, 32, 40, 48, 56).
*   **Status:** 🟡 **Half Implemented**
*   **What is Implemented:** Core degree-sensitive sutras for major planetary clusters, past-life karma ledger, and key activation cycles.
*   **What is Missing:** Hundreds of specialized thumb-rule aphorisms scattered throughout the treatise for unusual, isolated planetary degree alignments (e.g. Venus at 28° Taurus conjunct Rahu in Navamsha).
*   **Reason Code:** `[REASON-F]` Incremental heuristic expansion.

---

## 11. 🏛️ Sarvartha Chintamani — Venkatesha Sharma (17 Adhyayas)

Implemented in [`src/engine/sarvarthaChintamani.ts`](file:///d:/newWayToAstro/src/engine/sarvarthaChintamani.ts) with 12 Bhavas, Bhavadhipatis, and Raja Yogas.
*   **Status:** 🟡 **Half Implemented**
*   **What is Implemented:** General 12-house operational scores and primary Raja/Dhana yogas.
*   **What is Missing:**
    *   **4th House:** Specific mathematical formulas for vehicle loss (*Vahana Nasha*) and agricultural land acquisition.
    *   **5th House:** *Mantra Siddhi* combinations (mastery over sacred chants) and authorship intelligence yogas.
    *   **6th House:** Exact legal dispute victory formulas (*Shatru Jayaprapti*) and specific surgical/organ ailments.
    *   **7th House:** Detailed spousal physical and moral nature derived from the 7th lord's Navamsha disposition.
*   **Reason Code:** `[REASON-F]` Scheduled for systematic bhava-by-bhava enrichment.

---

## 12. ✍️ Uttara Kalamrita — Kalidasa (8 Kandas)

Implemented in [`src/engine/uttaraKalamrita.ts`](file:///d:/newWayToAstro/src/engine/uttaraKalamrita.ts) with planetary and bhava karakatwas, retrograde strengths (*Vakri* planet acting as exalted/debilitated).
*   **Status:** 🟡 **Half Implemented**
*   **What is Implemented:** Exhaustive Karakatwas (significations) of the 9 planets and 12 Bhavas; retrograde planet rules.
*   **What is Missing:**
    *   **Kanda 4 (Rahu & Ketu Results):** Kalidasa's celebrated rules on Rahu and Ketu Dasha results (whether they act as nodes, dispositors, or aspecting planets).
    *   **Kanda 5 (Raja Yogas):** Unique Raja Yoga combinations involving the exchange of 9th and 10th lords without taint from 8th or 11th houses.
    *   **Kanda 8 (Ayurdaya & Shanti):** Kalidasa's unique Ayurdaya modifications and Mriti yoga remedies.
*   **Reason Code:** `[REASON-F]` High-value addition to existing `uttaraKalamrita.ts`.

---

## 13. 💎 300 Important Combinations — Dr. B.V. Raman

Implemented in [`src/engine/raman300Combinations.ts`](file:///d:/newWayToAstro/src/engine/raman300Combinations.ts) and [`src/engine/ramanYogas.ts`](file:///d:/newWayToAstro/src/engine/ramanYogas.ts).
*   **Status:** 🟡 **Half Implemented**
*   **What is Implemented:** ~165 primary classical combinations (Gajakesari, Sunapha, Anapha, Dhurdhura, Kemadruma, Panchamahapurusha, Adhi, Amala, Parvata, Kahala, Chamara, Dhenu, Shaurya, Jaladhi, Shankha, etc.).
*   **What is Missing:** ~135 rare or subtle combinations (e.g. *Kalanidhi, Srinatha, Matsya, Kurma, Kusuma, Gandharva, Go, Vidyut, Chhatra, Sarada, Damara* Yogas).
*   **Reason Code:** `[REASON-F]` Ongoing systematic codification backlog; straightforward to complete all 300.

---

## 14. 🧭 Bhrigu Nandi Nadi & Bhrigu Sutras — Maharshi Bhrigu

Implemented in [`src/engine/bhriguNadi.ts`](file:///d:/newWayToAstro/src/engine/bhriguNadi.ts) (1-5-9 Trinal conjunctions, Karaka progressions, BSP 1–40 rules).
*   **Status:** 🟡 **Half Implemented**
*   **What is Implemented:** Trinal planetary connections, Karaka progressions (Jupiter as Jiva, Saturn as Karma, Venus as Maya/Wife, Rahu as Foreign/Maya), and Bhrigu Sarvato Principles (BSP 1–40).
*   **What is Missing:** *Bhrigu Sutras* — the classic text giving direct aphoristic results for all 9 planets in all 12 houses (108 classical chapters/sections).
*   **Reason Code:** `[REASON-F]` Planned as a dedicated "Bhrigu Sutras House-by-House Reader" deck.

---

## 15. 📖 Jatak Nirnay (Parts 1 & 2) — Dr. B.V. Raman

Implemented in [`src/engine/jatakNirnay.ts`](file:///d:/newWayToAstro/src/engine/jatakNirnay.ts) with the tripartite formula (Bhava 30%, Bhavadhipati 40%, Bhava Karaka 30%), Bhava Vriddhi/Nasha, and Kartari yogas.
*   **Status:** 🟡 **Half Implemented**
*   **What is Implemented:** Composite Raman house strength scoring, hemming evaluations, and broad 12-house judgements.
*   **What is Missing:** Granular sub-themes across Part 1 (Houses 1–6) and Part 2 (Houses 7–12), such as specific professional vocations from 10th house sub-influences, foreign relocation in 9th/12th, and protracted civil litigation in 6th.
*   **Reason Code:** `[REASON-F]` Textual expansion backlog.

---

## 16. 🏛️ Jataka Alankara — Acharya Ganesh Kavi (1613 CE)

Implemented in [`src/engine/jatakaAlankara.ts`](file:///d:/newWayToAstro/src/engine/jatakaAlankara.ts) with 12-Bhava ornamentation scores, Raja/Dhana/Jnana yogas, and Stri Jataka.
*   **Status:** 🟡 **Half Implemented**
*   **What is Implemented:** Bhava ornamentation scores (0–100%), classical aphorisms, and primary yogas.
*   **What is Missing:** Specific Marichis (sections) detailing medical pathologies (*Netra, Hridaya, Udara Rogas*) and death-timing shlokas.
*   **Reason Code:** `[REASON-F]` Medical diagnosis backlog.

---

## 17. 📜 Sanketanidhi — Ramadayalu (9 Sanketas)

Implemented in [`src/engine/sanketanidhi.ts`](file:///d:/newWayToAstro/src/engine/sanketanidhi.ts) with unique bhava rules and composite yogas.
*   **Status:** 🟡 **Half Implemented**
*   **What is Implemented:** Key bhava principles and composite yogas.
*   **What is Missing:** Sanketas 3, 4, and 5 covering specialized physical deformities, disease timing, and family lineage curses.
*   **Reason Code:** `[REASON-F]` Niche classical text; secondary development priority.

---

## 18. 🎯 Satya Jataka — Sage Satyacharya

Implemented in [`src/engine/satyaJataka.ts`](file:///d:/newWayToAstro/src/engine/satyaJataka.ts) with Star Lord dispositions and Dhruva Nadi principles.
*   **Status:** 🟡 **Half Implemented**
*   **What is Implemented:** Nakshatra dispositor chains and primary Satyacharya principles.
*   **What is Missing:** Satyacharya's strict mathematical Ayurdaya formula and subtle Navamsha evaluation methods.
*   **Reason Code:** `[REASON-D, REASON-F]` Mathematical longevity complexity.

---

## 19. 🔮 Bhavartha Ratnakara — Sri Ramanujacharya

Implemented in [`src/engine/bhavarthaRatnakara.ts`](file:///d:/newWayToAstro/src/engine/bhavarthaRatnakara.ts) with Lagna-specific rules for all 12 Ascendants.
*   **Status:** 🟡 **Half Implemented**
*   **What is Implemented:** Foundational Lagna-specific functional benefic/malefic rules for Aries through Pisces.
*   **What is Missing:** Concluding chapters covering exceptional Dasha outcomes and atypical Dhana Yogas (wealth combinations without standard 2nd/11th lord involvement).
*   **Reason Code:** `[REASON-F]` Ready for integration into wealth engine.

---

## 20. ☀️ Gayatri Jyotish — Pt. Shriram Sharma Acharya

Implemented in [`src/engine/gayatriJyotish.ts`](file:///d:/newWayToAstro/src/engine/gayatriJyotish.ts) (24 Aksharas mapped to Rashis, 9 Graha Gayatri Mantras, 5 Kosha Diagnostics, Anushthana Planner).
*   **Status:** ✅ **100% Fully Implemented**
*   **What is Implemented:** Complete mathematical and spiritual mapping of the 24 syllables of the Gayatri Mantra to zodiac signs, cosmic tattwas, and planetary afflictions, along with personalized daily Japa and Anushthana schedules.
*   **Unimplemented Components:** None.

---

## 🚀 High-Value Codification Roadmap (Next Steps)

Based on computational viability, shastric authenticity, and user impact, the following unimplemented chapters are recommended for immediate engineering codification:

1.  **BPHS Chapter 83 (`src/engine/bphsKarmicCurses.ts`):**
    *   *Pūrva Janma Shāpas* (8 Curses: Sarpa, Pitri, Matri, Bhratri, Matula, Brahmana, Patni, Preta) causing delay or denial of children.
    *   Deterministic 5th-house veto matrix + authentic classical remedial rituals (*Nāgabali, Gayā-Srāddha, Rudrābhisheka*).
2.  **BPHS Chapters 86–95 (`src/engine/bphsArishtaJanma.ts`):**
    *   Automated diagnostics for **Gandānta** (Lagna, Nakshatra, Tithi), **Amāvāsyā**, **Krishna Chaturdashi sextiles**, **Solar/Lunar Eclipse births**, and **Trik Prasava**.
    *   Authentic Vedic pacification rituals (*Shānti Karmas*).
3.  **BPHS Chapters 9 & 10 + Brihat Jataka Chapter 6 (`src/engine/balarishtaEngine.ts`):**
    *   Infant health vulnerability diagnostic (*Balarishta*) paired with protective cancellation shields (*Balarishta Bhanga*), with respectful modern medical guidance.
4.  **Complete 300 Important Combinations (`src/engine/raman300Combinations.ts`):**
    *   Codify the remaining 135 Raman Yogas to reach 300/300 full coverage.
5.  **BPHS Chapter 73 (`src/engine/rashmiPhala.ts`):**
    *   Planetary ray calculation (*Uchcha* vs *Neecha Rashmi*) and royal destiny ray thresholds.
