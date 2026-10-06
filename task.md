# Phase 21: Navneet Chitkara 3-Point BTR Verification Engine & Chatbot Integration

## Status: Complete & Verified (All 118 Tests Passing)
- **Trigger Keywords**: `chitkara-btr`, `umbilical-severance`, `rahu-cord`, `d9-moon-pranapada`, `d60-venus-pranapada`, `d60-ketu-dispositor`, `jaimini-rashi-drishti`, `btr-rectification-scanner`
- **Single Source of Truth**: Tracking phases and milestones for Phase 21.

---

## Phases & Milestones

- [x] **Phase 21.1: Core Chitkara BTR Triad & Jaimini Aspect Engine (`src/engine/btrEngine.ts`)**
  - [x] Implement `getJaiminiRashiDrishtiSigns(rashiIdx: number): number[]` (Chara, Sthira, Dvisvabhava aspects).
  - [x] Define `ChitkaraBtrTriadResult` and `ChitkaraRectificationCandidate` TypeScript interfaces.
  - [x] Implement `evaluateChitkaraBtrTriad(natalEphemeris: EphemerisResult)` computing C1 (D-9 Moon-PP), C2 (D-60 Venus-PP), and C3 (D-60 Ketu Dispositor Jaimini Rashi Drishti on D-60 Lagna).
  - [x] Implement `scanChitkaraRectificationCandidate(natalEphemeris: EphemerisResult, scanWindowMinutes: number, stepSeconds: number)` to locate optimal convergence timestamps.
  - [x] Integrate Chitkara triad telemetry into `generateBtrMasterSummary()` Section 73 dossier.

- [x] **Phase 21.2: Chatbot Prompt & Context System Parity (`src/engine/chatPrompt.ts` & `src/engine/chatContext.ts`)**
  - [x] Enhance rule `0V` in `src/engine/chatPrompt.ts` to instruct Acharya Jyotish AI on Chitkara 3-point BTR logic, Rahu umbilical metaphysics, and rectification deltas.
  - [x] Ensure full data flow of Chitkara BTR telemetry into the system instruction generated for Gemini and OpenRouter.

- [x] **Phase 21.3: Chatbot UI & Instant Interceptor Integration (`src/components/AstroChatbot.tsx`)**
  - [x] Enhance fast regex interceptor for birth moment inquiries to render Chitkara 3-point scorecard and candidate rectified time.
  - [x] Add interactive Chitkara BTR chips for single-click verification.

- [x] **Phase 21.4: Automated Test Suite & Production Verification (`tests/engine.test.mjs`)**
  - [x] Add Subtest 118 testing C1, C2, C3 calculations and the timeline rectification scanner.
  - [x] Run `npm test` to verify all 118 tests pass.
  - [x] Run `npx tsc --noEmit` to verify zero TypeScript errors.
  - [x] Run `npm run build` to verify production Next.js build compilation.

---

# Phase 22: Lunar Astro Name Vibrational Energy, Astro-Phonetics & Parashara Planetary Maturation Ages (Deepanshu Giri)

## Status: Complete & Verified (All 119 Tests Passing & Production Build Clean)
- **Trigger Keywords**: `lunar-astro-name-energy`, `astro-phonetics`, `planetary-maturation-ages`, `retrograde-saturn-36`, `vak-siddhi`, `deepanshu-giri-rules`, `vriksha-parihara`
- **Single Source of Truth**: Tracking phases and milestones for Phase 22.

---

## Phases & Milestones

- [x] **Phase 22.1: Lunar Astro Name Vibrational Energy Engine (`src/engine/lunarAstroNameEnergy.ts`)**
  - [x] Implement morphological & phonetic root tokenizer (handling prefixes `Pri-`, `Al-`, `Rav-`, `Sach-`, suffixes `-inder`, `-preet`, and signature archetypes like `Aniket`, `Sonal`).
  - [x] Implement `analyzeNameVibrationalEnergy(name: string): NameVibrationalProfile` (horoscope-free planetary frequency, psychology, relationship vulnerability, and predicted chart placements).
  - [x] Implement `evaluateChartNameCongruence(name: string, ephemeris: EphemerisResult): ChartNameCompatibility` (chart-to-name resonance audit against Lagna, Moon, 7th lord, and Atmakaraka).

- [x] **Phase 22.2: Parashara Planetary Maturation Ages & Retrograde Dynamics (`src/engine/planetaryAgeActivation.ts`)**
  - [x] Implement BPHS Ch. 45 & Phaladeepika natural planetary age intervals (Jupiter 16/32, Sun 21-22, Moon 23-24, Venus 25-27, Mars 28-31, Mercury 32-35, Saturn 36-42, Rahu 42-47, Ketu 48-54).
  - [x] Implement Retrograde Inversion logic for Age 36 (Retrograde Saturn triggering career upheaval, life pivot, and purva-janma karmic restructuring).
  - [x] Connect with Vak Siddhi (astrological intuition) and Kadali (banana tree) Jupiterian botanical remedy.

- [x] **Phase 22.3: Chatbot Prompt & Context System Parity (`src/engine/chatPrompt.ts` & `src/engine/chatContext.ts`)**
  - [x] Add Rule `0W` in `src/engine/chatPrompt.ts` detailing Lunar Astro Name Vibration and Retrograde Saturn Age 36 protocols.
  - [x] Inject Section 79 (Lunar Astro Name Energy & Maturation Age Dossier) into `generateChatSystemContext()` in `src/engine/chatContext.ts`.
  - [x] Add regex interceptors in `src/components/AstroChatbot.tsx` for instantaneous name & age answers.

- [x] **Phase 22.4: Interactive UI Deck Integration (`src/components/NumerologyView.tsx`)**
  - [x] Add interactive Name Frequency Tester allowing users to test any name's energetic composition with lecture presets.
  - [x] Add Chronological Planetary Age Timeline with active age highlighter and Retrograde Saturn age 36 badge.

- [x] **Phase 22.5: Automated Test Suite & Production Verification (`tests/engine.test.mjs`)**
  - [x] Add Subtest 119 covering name phonetic tokenization, vibrational profiling, and Age 36 retrograde calculations.
  - [x] Run `npm test` to verify all 119 tests pass.
  - [x] Run `npx tsc --noEmit` to verify zero TypeScript errors.
  - [x] Run `npm run build` to verify production Next.js build compilation.

---

# Phase 23: Rashi Tulya Navamsha (RTN) Strictly 9 Classical Planets Isolation

## Status: Complete & Verified (All 120 Tests Passing & Production Build Clean)
- **Trigger Keywords**: `rtn-overlay`, `classical-9-planets`, `rtn-subplanet-exclusion`, `rashi-tulya-navamsha`
- **Single Source of Truth**: Tracking Phase 23.

---

## Phases & Milestones

- [x] **Phase 23.1: Engine & Component Strict 9-Planet Filtration (`src/engine/rashiTulyaNavamsha.ts` & `src/components/ShodashavargaView.tsx`)**
  - [x] In `src/engine/rashiTulyaNavamsha.ts`: Guarantee `evaluateRashiTulyaNavamsha` strictly processes only the 9 classical planets (`Sun`, `Moon`, `Mars`, `Mercury`, `Jupiter`, `Venus`, `Saturn`, `Rahu`, `Ketu`), excluding sub-planets, upagrahas, and modern outer planets.
  - [x] In `src/components/ShodashavargaView.tsx`: Filter `d1Chart.houseOccupants` in RTN mode to strictly the classical 9 planets (`!p.isUpagraha && CLASSICAL_9_PLANETS.has(p.name)`).
  - [x] Filter `rtnHouseOccupants` and `crossVargaConjunctions` to strictly classical 9 planets.
  - [x] Filter the RTN Manifestation Placements Table strictly to classical 9 planets.

- [x] **Phase 23.2: Automated Regression Verification (`tests/engine.test.mjs`)**
  - [x] Added Subtest 120 verifying RTN engine and D1 chart projection strictly contain 9 classical planets and zero upagrahas/modern planets.
  - [x] Ran `npm test` to verify 120/120 tests pass.
  - [x] Ran `npx tsc --noEmit` to verify 0 type errors.
  - [x] Ran `npm run build` to verify Next.js production build succeeds.

---

# Phase 24: Deepanshu Giri D1 Lagna Lord in D10 (Dashamsha) & Workplace Surroundings Audit & Enhancement

## Status: Complete & Verified (All 121 Tests Passing & Production Build Clean)
- **Trigger Keywords**: `lagnadhipati-d10`, `dashamsha-karma-field`, `d1-tenth-house-surroundings`, `deepanshu-giri-d10`, `neecha-d10-toil`, `modi-indira-knrao-benchmarks`
- **Single Source of Truth**: Tracking Phase 24.

---

## Phases & Milestones

- [x] **Phase 24.1: Core Engine Audit & Deepanshu Giri Full-Spectrum Enhancement (`src/engine/careerJobBusiness.ts`)**
  - [x] Implement `d1TenthHouseSurroundings` modeling physical surroundings & industry environment from D1 10th house/lord.
  - [x] Update all 12 sign archetypes with exact Deepanshu Giri nuances (Aries field/ego clashes, Taurus early wealth, Gemini multi-income, Cancer coastal/coworker caution, Leo VIP/anti-orders, Virgo CA/fixer, Libra marriage/female partnership, Scorpio secret/unpredicted domain fame, Sagittarius ethics/enforcement, Capricorn politicians/grassroots, Aquarius behind-closed-doors/office politics, Pisces night hours/detached daydreaming caveat).
  - [x] Enhance Debilitation (Neecha) in D10 with chronic dissatisfaction, delayed proportional credit, and physical fatigue/health drain dynamics.
  - [x] Add Historical Benchmark Detection (Narendra Modi, Indira Gandhi, K.N. Rao, Amit Shah).

- [x] **Phase 24.2: UI Deck Enhancement (`src/components/ShodashavargaView.tsx`)**
  - [x] Render D1 10th House Physical Surroundings vs D10 Operational Demeanor distinction card.
  - [x] Render Historical Benchmark badge when chart patterns match notable leaders.

- [x] **Phase 24.3: Chatbot Prompt & Context Parity (`src/engine/chatPrompt.ts` & `src/engine/chatContext.ts`)**
  - [x] Add Rule `0X` to `src/engine/chatPrompt.ts` instructing Acharya AI on Deepanshu Giri's D-1 Lagna Lord in D10 & workplace surroundings law.
  - [x] Update Section 31 in `src/engine/chatContext.ts` with enhanced D10 telemetry and physical workplace surroundings.

- [x] **Phase 24.4: Automated Test Suite & Production Verification (`tests/engine.test.mjs`)**
  - [x] Add Subtest 121 verifying D1 10th house surroundings, 12 sign archetypes, modalities, debilitation, and historical benchmark matching.
  - [x] Verify `npm test` passes (all 121 tests).
  - [x] Verify `npx tsc --noEmit` clean.
  - [x] Verify `npm run build` succeeds.

---

# Phase 25: Paka Lagna (Operating Self), Annual House Progression (Varsha Chakra), Rahu-Ketu Nuclear Bomb Effect, Trikona Resonance & 9th House Bhagyodaya

## Status: Complete & Verified (All 122 Tests Passing & Production Build Clean)
- **Trigger Keywords**: `paka-lagna`, `operating-self`, `annual-house-progression`, `varsha-chakra`, `nuclear-bomb-effect`, `rahu-ketu-squares`, `trikona-resonance`, `bhagyodaya-9th-house`, `graha-udaya-12year`, `kroora-shubha-delivery`, `planetary-returns`
- **Single Source of Truth**: Tracking Phase 25 implementation across core engine, UI deck, chatbot prompt/context, and test suite.

---

## Phases & Milestones

- [x] **Phase 25.1: Core Paka Lagna & Annual House Progression Engine (`src/engine/annualHouseProgression.ts`)**
  - [x] Implement `calculatePakaLagnaProfile(ephemeris)` mapping core identity (1st house/sign/lord) vs operating self (Lagnesha house & sign) with 12 Kalapurusha archetypes, sign dignities, and behavioral execution traits.
  - [x] Implement `calculateAnnualHouseProgression(ephemeris, birthDate, targetDateOrAge)` calculating active house via $N$-th life year formula $((Y - 1) \pmod{12}) + 1$, 12-year cycle count, and 3-factor hierarchy (Resident planets -> Sign & Lord -> Drishti).
  - [x] Implement `detectRahuKetuNuclearBombEffect(activeHouse, ephemeris)` flagging high-intensity transformational years when active house aligns with Rahu-Ketu axis or square aspects (4th/10th / Kendra from nodes).
  - [x] Implement `calculateTrikonaResonance(activeHouse, ephemeris)` calculating simultaneous trine activation (Dharma 1-5-9, Artha 2-6-10, Kama 3-7-11, Moksha 4-8-12) and Houses 5 & 9 auspicious protection.
  - [x] Implement `calculateBhagyodayaTiming(ephemeris)` evaluating 9th house 4-pillar audit (resident planets, sign, 9th lord placement & dignity, incoming Drishti) to determine primary fortune rise age.
  - [x] Implement `calculateGrahaUdayaTimeline(ephemeris, targetAge)` providing base natural activation ages + 12-year addition waves ($Base + 12 \times k$) for all 9 Grahas.
  - [x] Implement `calculatePlanetaryReturns(birthDate, ephemeris, targetDate)` calculating Solar, Lunar, Jupiter (12y), Saturn (30y), and Rahu-Ketu (18.5y) return milestones.
  - [x] Implement `generateAnnualActivationMasterSummary(ephemeris, birthDate, targetDate)` generating unified analysis payload.

- [x] **Phase 25.2: UI Deck Integration (`src/components/DashaView.tsx`)**
  - [x] Add dual-tab switcher: "Vimshottari Dasha (120 Years BPHS)" and "Annual House & Paka Lagna (वर्ष चक्र, पाक लग्न व भाग्योदय)".
  - [x] Build interactive Age/Year selector with real-time reactive calculations.
  - [x] Render Core Identity vs Paka Lagna Operating Self card with Kalapurusha archetypes.
  - [x] Render Current Annual House Activation card with 3-tier hierarchy & Kroora vs Shubha delivery badge.
  - [x] Render "Nuclear Bomb" Effect warning banner when active house is on Rahu-Ketu axis or square.
  - [x] Render Simultaneous Trikona Resonance card showing energized trines and karmic protection.
  - [x] Render 9th House Bhagyodaya & Graha Udaya (+12 Year Recurring Waves) matrix.
  - [x] Render Planetary Returns timeline card.

- [x] **Phase 25.3: Chatbot Prompt & Context System Parity (`src/engine/chatPrompt.ts` & `src/engine/chatContext.ts`)**
  - [x] Add Rule `0Y` to `src/engine/chatPrompt.ts` instructing Acharya Jyotish AI on Paka Lagna, Annual House Progression, Nuclear Bomb Rahu-Ketu squares, Trikona Resonance, and Bhagyodaya.
  - [x] Inject Section 80 into `generateChatSystemContext()` in `src/engine/chatContext.ts` providing full telemetry.
  - [x] Add Interceptor 17 in `src/components/AstroChatbot.tsx` for immediate queries regarding annual house, paka lagna, bhagyodaya, and nuclear bomb years.

- [x] **Phase 25.4: Automated Test Suite & Production Verification (`tests/engine.test.mjs`)**
  - [x] Add Subtest 122 validating Paka Lagna, Annual House calculation, Rahu-Ketu Nuclear Bomb detection, Trikona resonance, Bhagyodaya timing, and 12-year Graha Udaya addition rules.
  - [x] Verify `npm test` passes 122/122 test suites.
  - [x] Verify `npx tsc --noEmit` has 0 errors.
  - [x] Verify `npm run build` production compilation succeeds.

---

# Phase 26: Deepanshu Giri Navamsha Secrets (RTN Dusthana Afflictions, D1 Confirmation Law & D9 Sun Age Activation System)

## Status: Complete & Verified (All 123 Tests Passing & Production Build Clean)
- **Trigger Keywords**: `rashi-tulya-navamsha`, `rtn-dusthana-suffering`, `rtn-6th-8th-12th`, `d1-d9-confirmation`, `d9-sun-age-activation`, `navamsha-timing-system`, `lunar-astro-navamsha`
- **Single Source of Truth**: Tracking Phase 26 implementation across core engine, UI deck, chatbot prompt/context, and test suite.

---

## Phases & Milestones

- [x] **Phase 26.1: Core RTN Dusthana Affliction & D9 Age Activation Engine (`src/engine/rashiTulyaNavamsha.ts`)**
  - [x] Implement `RtnDusthanaAffliction` interface & `evaluateRtnDusthanaAfflictions(natalEphem)` computing all planets in RTN Houses 6, 8, 12 with solvability classification (6th: solvable via effort; 8th: chronic/unsolvable shocks; 12th: financial waste/losses).
  - [x] Implement planet-specific karakatwa suffering breakdowns for Venus, Jupiter, Mars, Mercury, Sun, Moon, Saturn, Rahu, Ketu.
  - [x] Implement `crossConfirmD1InD9(natalEphem, rtnAfflictions)` implementing Deepanshu Giri's D1-D9 Confirmation Law ("Whatever is seen in D1 must be confirmed in D9 to materialize").
  - [x] Implement `calculateNavamshaAgeActivation(natalEphem, targetAge)` providing strictly D9 Sun (Surya) house activation ages (H1: 27, H2: 25, H4: 26, H6: 23 & 35, H8: 22 & 34, H12: 12 & 36) with the Age 34 loan/health drain case dynamic.
  - [x] Implement `matchLunarAstroNavamshaCaseStudies(natalEphem)` detecting Cancer Lagna Venus-Rahu H8, Aquarius Lagna Sun-Venus H6, and Leo Lagna Saturn-Mercury H6.

- [x] **Phase 26.2: UI Deck Enhancement in `src/components/ShodashavargaView.tsx`**
  - [x] Add RTN Dusthana Suffering & Affliction Card in RTN mode displaying 6th/8th/12th house planets, affected karakas, and solvability badge.
  - [x] Add D1 Confirmation Status Pill indicating whether RTN afflictions are mirrored in D1.
  - [x] Add Navamsha Age Activation Timing System Card showing D9 Sun house placement and active/upcoming activation ages.
  - [x] Add Lunar Astro Navamsha Benchmark Case Match Card when lecture archetypes are detected.

- [x] **Phase 26.3: Chatbot Prompt & Context System Parity (`src/engine/chatPrompt.ts` & `src/engine/chatContext.ts`)**
  - [x] Add Rule `0Z` in `src/engine/chatPrompt.ts` instructing Acharya Jyotish AI on Deepanshu Giri's D1-D9 Confirmation Law, RTN Dusthana Suffering, and D9 Sun Activation Ages.
  - [x] Enhance Section 69 in `src/engine/chatContext.ts` with RTN Dusthana suffering breakdown and Navamsha age activation timeline with dynamic native age.
  - [x] Upgrade Interceptor 11 and add Interceptor 18 in `src/components/AstroChatbot.tsx` for immediate queries regarding RTN suffering, D1-D9 confirmation, and Navamsha age activation.

- [x] **Phase 26.4: Automated Test Suite & Production Verification (`tests/engine.test.mjs`)**
  - [x] Add Subtest 123 verifying RTN Dusthana calculation, karakatwa suffering, D1 confirmation logic, and Navamsha D9 Sun activation ages.
  - [x] Verify `npm test` passes all 123 tests.
  - [x] Verify `npx tsc --noEmit` has 0 errors.
  - [x] Verify `npm run build` production compilation succeeds.

---

# Phase 27: Medhaj Astro Sessions 52–60 (Planetary Transits, Somatic Sade Sati, Contact Overlays & Generational Telemetry)

## Status: Complete & Verified (All 124 Tests Passing & Production Build Clean)
- **Trigger Keywords**: `medhaj-gochara`, `sun-torchlight-script`, `moon-mental-transit`, `venus-morning-evening-star`, `mars-transit-desire-aspects`, `jupiter-hemispheres`, `guru-shani-20year-cycle`, `kharmas-logic`, `somatic-sade-sati`, `kantaka-shani-7th`, `saturn-transit-arudha-lagna`, `inverted-nodal-return-9year`, `nodal-helix`, `outer-planets-generational-transits`
- **Single Source of Truth**: Tracking Phase 27 implementation across core engine, UI deck, chatbot prompt/context, and test suite.

---

## Phases & Milestones

- [x] **Phase 27.1: Core Medhaj Astro Gochara Engine (`src/engine/medhajGochara.ts`)**
  - [x] Implement Session 52 (Sun): "Torchlight & Script" Rule (house occupied = environment; 2nd house = torchlight focus & Kalapurusha script) + 6th/7th/8th Chesthabala retrogression trigger + Rama/Dharma archetypes.
  - [x] Implement Session 53 (Moon): Pragmatic Krishna logic vs Rama moral law + 12-house mental state transit matrix (H1 to H12).
  - [x] Implement Session 54 (Venus): Morning vs Evening Star (ancestor daytime vs nocturnal support) + Sanjeevani Vidya / Parashurama + 4 Natal Contact Overlays (Moon, Mars, Mercury, Ketu).
  - [x] Implement Session 55 (Mars): 4th, 7th, 8th special transit desire aspects (occupied house = aggressive burst, aspected houses = acute urgency/desire) + 5 Contact Overlays (Sun, Mercury, Moon, Rahu, Ketu).
  - [x] Implement Session 56 (Jupiter): Inner (1–7) vs Outer (8–12) Hemispheres + Universal Expansion Rule + Guru-Shani 20-Year Great Cycle ("Abode of God") + Kharmas detection (Sun in Sagittarius/Pisces).
  - [x] Implement Sessions 57 & 58 (Saturn): 3 Somatic/Anatomical Sade Sati phases (12th: head/neck mental; 1st: heart/chest emotional; 2nd: feet/legs physical) + 7th Kantaka from Moon/Lagna + 3-cycle 90y foundation + 15y opposition trigger + Saturn over Arudha Lagna (AL).
  - [x] Implement Session 59 (Rahu-Ketu): 9-Year Inverted Nodal Returns (Ages 9, 27, 45; Age 27 life pivot) + 42–48 & 48–52 active spans + Karmic Helix (Ketu tail contraction vs Rahu head magnification) + Kala Sarpa commitment & Shiva remedy.
  - [x] Implement Session 60 (Outer Planets): Uranus (~7y, Aries resonance, sudden lightning breakthroughs/tech disruptions), Neptune (~14y, Pisces resonance, 4D reality, spiritual surrender vs deception on Moon), Pluto (~12–20+y, institutional resets) + hard natal aspects.
  - [x] Implement `generateMedhajGocharaMasterReport(natalEphem, transitEphem, birthDate, targetDate)`.

- [x] **Phase 27.2: UI Deck Integration (`src/components/DashaView.tsx` / `TransitGocharaDeck`)**
  - [x] Add Medhaj Astro Transit Masterclass interactive cards.
  - [x] Render Sun Torchlight, Moon Mental State, Venus Morning/Evening Star ancestral shield, Mars Desire Aspects, Jupiter Hemispheres, Somatic Sade Sati, Saturn over AL, Inverted Nodal Returns, and Generational Outer Planet telemetry.

- [x] **Phase 27.3: Chatbot Prompt & Context System Parity (`src/engine/chatPrompt.ts` & `src/engine/chatContext.ts`)**
  - [x] Add Rule `0AA` in `src/engine/chatPrompt.ts` covering Medhaj Astro Gochara protocols.
  - [x] Inject Section 81 into `src/engine/chatContext.ts` with live Medhaj Gochara master telemetry.
  - [x] Add Interceptor 20 in `src/components/AstroChatbot.tsx` for fast transit query resolution.

- [x] **Phase 27.4: Automated Test Suite & Production Verification (`tests/engine.test.mjs`)**
  - [x] Add Subtest 124 verifying all 9 sessions, edge cases, returns, overlays, aspects, and master report.
  - [x] Verify `npm test` passes all 124 tests.
  - [x] Verify `npx tsc --noEmit` has 0 errors.
  - [x] Verify `npm run build` production compilation succeeds.

---

# Phase 28: Medhaj Astro Sessions 68, 69 & 70 (Sun-Saturn Conjunction, 12th from Jupiter/Ketu Age 25, Mars 10th House Age 33, 8/12 Manglik Yoga & 5 Geometric Sambandhas)

## Status: Complete & Verified (All 125 Tests Passing & Production Build Clean)
- **Trigger Keywords**: `sun-saturn-conjunction`, `age-33-activation`, `father-son-divergence`, `lower-degree-dominance`, `good-fame-vs-defame`, `shatru-hanta-aspects`, `twelfth-from-jupiter-ketu`, `age-25-activation`, `fixed-deposit-rule`, `disputed-neighbor-rule`, `mars-activation-28`, `mars-tenth-house-33`, `manglik-yoga-8-12`, `scorpio-mars-health-caution`, `five-geometric-sambandhas`
- **Single Source of Truth**: Tracking Phase 28 implementation across core engine, UI deck, chatbot prompt/context, and test suite.

---

## Phases & Milestones

- [x] **Phase 28.1: Core Medhaj Astro Activation Engine (`src/engine/medhajActivation.ts`)**
  - [x] Implement Session 68 (Sun-Saturn Conjunction): Exact longitude separation, Lower Degree Dominance (sets direction/tone), Good Fame (Saturn in Libra, Capricorn, Aquarius) vs Bad Fame/Scandal (Saturn in Aries, Leo), Age 33 (32–33rd year) fateful house trigger, father-son plateau vs takeoff, and 6th House Shatru Hanta with aspect modifiers (Jupiter, Rahu, Ketu).
  - [x] Implement Session 69 (Jupiter & Ketu 12th House Activation at Age 25): Calculate 12th from natal Jupiter and 12th from natal Ketu, Age 25 (24–25th year) activation window, 12th lord dignity audit (Kendras/Trikonas relative to 12th = constructive foreign/investment vs dusthana = loss/hospital/confinement), Fixed Deposit Rule (2nd Lord in 12th in Sthira Fire sign), and Disputed Neighbor Rule (Mars in 3rd Gemini afflicted by Rahu/Saturn).
  - [x] Implement Session 70 (Mars Activation, 8/12 Manglik Yoga & 5 Geometric Sambandhas): Mars Age 27–28 activation, 10th House from Mars Age 33 (32–33rd year) professional karma activation, 8 out of 12 Manglik Yoga Rule (converting Kuja Dosha to beneficial Yoga in Fire signs, Earth signs/Bhumi Putra, own signs, and benefic aspects from Jupiter/Venus/Moon), Scorpio Mars reproductive medical alert, and 5 Geometric Sambandhas (Kendra 1/4/7/10, Trikona 1/5/9, 2/12, 3/11, 6/8/12).
  - [x] Implement `generateMedhajActivationMasterReport(natalEphem, birthDate, evaluationDate)`.

- [x] **Phase 28.2: UI Deck Integration (`src/components/DashaView.tsx`)**
  - [x] Render Medhaj Activation Masterclass interactive deck cards:
    * Sun-Saturn Conjunction & Age 33 Fateful Divergence Card.
    * Age 25 Twelfth from Jupiter & Ketu Gateway Card.
    * Mars Age 28 & Age 33 10th House Karma Trigger Card.
    * 8/12 Manglik Yoga vs Kuja Dosha Card.
    * 5 Geometric Sambandhas Inspector Card.

- [x] **Phase 28.3: Chatbot System Parity (`src/engine/chatPrompt.ts`, `src/engine/chatContext.ts`, `src/components/AstroChatbot.tsx`)**
  - [x] Add Rule `0AB` in `src/engine/chatPrompt.ts` covering Medhaj Astro Sessions 68, 69, 70 protocols.
  - [x] Inject Section 82 in `src/engine/chatContext.ts` with live Medhaj Activation master telemetry.
  - [x] Add Interceptor 21 in `src/components/AstroChatbot.tsx` for fast 0ms client-side calculation.

- [x] **Phase 28.4: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Add Subtest 125 verifying all 3 sessions, edge cases, returns, degree dominance, and master report.
  - [x] Verify `npm test` passes all 125 tests.
  - [x] Verify `npx tsc --noEmit` has 0 errors.
  - [x] Verify `npm run build` production compilation succeeds.

---

# Phase 29: Medhaj Astro Sessions 75–79 (Arudha Lagna, Presiding Jyotirlinga, Tide Theory, Support/Opposition & Moksha Dwar)

## Status: Complete & Verified (All 126 Tests Passing & Production Build Clean)
- **Trigger Keywords**: `arudha-lagna-masterclass`, `perception-vs-reality-maya`, `saturn-on-arudha-lagna`, `al-support-2nd-house`, `al-opposition-7th-house`, `house-arudha-transits`, `presiding-jyotirlinga-formula`, `jyotirlinga-ketu-dissolution`, `arudha-tide-theory`, `venus-moon-4th-property-al`, `jupiter-venus-7th-raj-yoga`, `al-trine-benefics-maha-raj-yoga`, `moksha-dwar-dignity`, `planetary-horas`
- **Single Source of Truth**: Tracking Phase 29 implementation across core calculation engine, UI interactive deck, chatbot system parity, and automated test suite.

---

## Phases & Milestones

- [x] **Phase 29.1: Core Medhaj Arudha & Jyotirlinga Engine (`src/engine/medhajArudha.ts`)**
  - [x] Implement Session 75 (Perception vs Reality & Support/Opposition):
    * Evaluate mismatch between physical Lagna ($D_1$) and Arudha Lagna ($AL$) archetypes (e.g. Libra Lagna + Sagittarius AL = perceived as guru; Cancer Lagna + Scorpio AL = perceived as secretive/suspicious; Aquarius AL = eccentric recluse).
    * Saturn on AL: Positive public image (genuine, modest, hardworking, aligned with the common masses).
    * 2nd House from AL: Unconditional worldly support, resources, financial backers, and allies.
    * 7th House from AL: Worldly opposition, hurdles, resistance, and direct challenges.
    * House Arudha Transits ($A_1$ to $A_{12}$): External manifestation through house Arudhas (e.g. Jupiter transiting house that hosts $A_6$ extinguishes debts/enemies; Saturn transiting house that hosts $A_6$ settles litigation/divorce).
  - [x] Implement Session 76 (Presiding Jyotirlinga Discovery Formula):
    * Trines from Arudha Lagna (AL: 1, 5, 9) $\cap$ Quadrants from Natal Moon (Chandra: 1, 4, 7, 10).
    * Mathematical Coprime Law: Steps of 4 (trines) and 3 (kendras) are coprime in modulo 12 ($\gcd(4, 3) = 1$). The intersection ALWAYS yields exactly ONE unique zodiac sign across all 144 sign combinations!
    * Identification of common sign revealing the soul's presiding Jyotirlinga (Rameshwaram to Trimbakeshwar).
    * Classical 1st/7th Arudha exception rule (count 10 houses forward).
    * Ketu past-life karmic dissolution via sunrise/sunset meditation sadhana.
  - [x] Implement Session 77 (The Tide Theory of Arudha Lagna):
    * AL = High Tide (Peak external visibility/action).
    * 4th from AL = High Tide (Inner domestic anchoring).
    * 7th from AL = Low Tide (Moksha Dwar / exit from public illusion).
    * 10th from AL = Low Tide (Low emotional anxiety, natural professional duty).
    * Planetary placements on AL (Jupiter/Venus = perceived as affluent; Retrograde Saturn = misconstrued as deceptive).
  - [x] Implement Session 78 (Real Estate, Wealth & Grand Raj Yogas from AL):
    * Venus & Moon in 4th from AL: Immense tangible properties, real estate, agricultural land, luxury vehicles.
    * Benefics (Jupiter/Mercury) in 4th from AL: High domestic comfort.
    * Father's property: 4th from $A_9$ (Bhagya Pada).
    * Supreme Status Raj Yoga: Jupiter & Venus in 7th from AL.
    * Karmic Nodes: Rahu (future unfulfilled obsessions) vs. Ketu (past satiety & demanded detachment).
  - [x] Implement Session 79 (Grand Raj Yogas & Moksha Dwar Dignity):
    * Supreme Prosperity Maha Raj Yoga: Benefics (Jupiter, Venus, Mercury, waxing Moon) in Trines (1, 5, 9) from AL.
    * 7th from AL Liberation (Moksha Dwar) Planetary Dignity:
      - Exalted planet: Graceful, joyful, willing detachment (e.g. Exalted Saturn in Libra).
      - Debilitated planet: Harsh friction, loss, or forced separation until compelled surrender.
      - Own sign planet: Moderate resolution through negotiation and prayer.
    * Planetary Horas daily routine framework.
  - [x] Implement `generateMedhajArudhaMasterReport(natalEphem, transitEphem, birthDate, evaluationDate)`.

- [x] **Phase 29.2: Interactive UI Deck Integration (`src/components/DashaView.tsx`)**
  - [x] Add Tab 5: `"🕉️ Arudha Lagna & Jyotirlinga (Sessions 75–79 आरूढ़ व ज्योतिर्लिंग)"`.
  - [x] Render interactive cards:
    * Presiding Jyotirlinga & Ketu Karmic Dissolution Card with mathematical intersection derivation.
    * Perception vs Reality & Saturn on AL Image Card.
    * Support (2nd from AL) vs Opposition (7th from AL) Diagnostic Card.
    * High Tide / Low Tide Psychological Quadrant Card.
    * Real Estate & 4th from AL Property Card + Jupiter/Venus in 7th Raj Yoga.
    * Moksha Dwar (7th from AL) Dignity & $A_1$–$A_{12}$ Transit Inspector.

- [x] **Phase 29.3: Chatbot System Parity (`src/engine/chatPrompt.ts`, `src/engine/chatContext.ts`, `src/components/AstroChatbot.tsx`)**
  - [x] Add Rule `0AC` to `src/engine/chatPrompt.ts` with Arudha Lagna, Jyotirlinga, and Tide protocols.
  - [x] Inject Section 83 (`medhajArudhaSummary`) into `src/engine/chatContext.ts` across `career`, `marriage`, and `all` intents.
  - [x] Add Interceptor 22 in `src/components/AstroChatbot.tsx` for fast 0ms resolution.

- [x] **Phase 29.4: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Add Subtest 126 in `tests/engine.test.mjs` verifying all algorithms and the 144-combination coprime invariant.
  - [x] Verify `npm test` passes all 126 tests (126/126 passed).
  - [x] Verify `npx tsc --noEmit` has 0 errors.
  - [x] Verify `npm run build` succeeds (Next.js 15 production build clean).

---

# Phase 30: Medhaj Astro Sessions 82, 84 & 85 (Baadhak Theory, Multi-Lagna Audit, Relative Baadhaka, Aquarius 11th Profile & Rahu-Ketu Nodal Transits)

## Status: Complete & Verified (All 127 Tests Passing & Production Build Clean)
- **Trigger Keywords**: `baadhak-theory-masterclass`, `movable-fixed-dual-baadhaka`, `relative-house-baadhaka`, `multi-lagna-baadhaka`, `aries-aquarius-11th-profile`, `baadhaka-viparita-transformation`, `nodal-baadhaka-transits`, `taurus-scorpio-axis-karma`, `fear-dissolution`, `nodal-return-18-5-years`, `nodal-square-cycles`
- **Single Source of Truth**: Tracking Phase 30 implementation across calculation engine, UI interactive deck, chatbot parity, and automated test suite.

---

## Phases & Milestones

- [x] **Phase 30.1: Core Medhaj Baadhak & Nodal Transit Engine (`src/engine/medhajBaadhak.ts`)**
  - [x] Implement Session 82 (Foundational Baadhaka & Relative House Baadhaka):
    * Modality mapping: Movable $\rightarrow$ 11th, Fixed $\rightarrow$ 9th, Dual $\rightarrow$ 7th.
    * Relative Baadhaka calculation for each of the 12 houses ($H_1$ to $H_{12}$) based on the house's occupant sign modality.
    * Viparita transformation potential for 11th (gains/networks), 9th (dharma/guru/fortune), and 7th (alliances/public).
  - [x] Implement Session 84 (Multi-Lagna Audit, Aquarius Profile & Viparita Transformation):
    * Compute Baadhaka for: Physical Lagna ($D_1$), Moon Lagna (Chandra), Sun Lagna (Surya), and Paka Lagna (Lagna Lord sign).
    * Aquarius 11th Baadhaka evaluation for Aries Lagna (Saturn + Rahu co-rulership, Air + Fixed modality).
    * Planetary modification profiles in Baadhaka Bhava: Jupiter, Saturn, Venus, Moon, Mercury, Rahu, Mars.
    * 1st House (vitality) and 5th House (creative intelligence/Purva Punya) release amplification scores.
    * Karma Phala acceptance vs superficial *totka* detection.
  - [x] Implement Session 85 (Rahu-Ketu Transit Dynamics, Axis Karma & F.E.A.R. Antidote):
    * Rahu (material appetite, forward amplification) vs. Ketu (past satiety, dissolution, surrender).
    * Taurus-Scorpio Kalapurusha 2nd/8th axis dynamics (Rahu wealth accumulation vs Ketu unearned asset purge).
    * F.E.A.R. ("False Evidence Appearing Real") metric & Ketu/Shiva detachment antidote.
    * Transits of Rahu and Ketu through natal Baadhaka Bhava and aspecting Baadhakesh.
    * 18.5-Year Nodal Return detector (Ages ~18-19, 37, 55-56) and Nodal Squares (~4.5 and 13.5 years).
  - [x] Implement `generateMedhajBaadhakMasterReport(natalEphem, transitEphem, birthDate, evaluationDate)`.

- [x] **Phase 30.2: Interactive UI Deck Integration (`src/components/DashaView.tsx`)**
  - [x] Add Tab 6: `"🛡️ Baadhak & Nodal Transits (Sessions 82, 84, 85 बाधक व राहु-केतु)"`.
  - [x] Render interactive cards:
    * Multi-Lagna Baadhaka Summary Card (Physical, Moon, Sun, Paka Lagna).
    * Relative House Baadhaka 12-House Interactive Matrix.
    * 11th House Baadhaka Deep Dive & Planetary Occupant Analysis.
    * Viparita Raja Yoga & 1st/5th House Release Metric Card.
    * Rahu-Ketu Nodal Transit & 18.5-Year Cycle Radar.
    * Taurus-Scorpio Axis & F.E.A.R. Transcendence Guidance Card.

- [x] **Phase 30.3: Chatbot System Parity (`src/engine/chatPrompt.ts`, `src/engine/chatContext.ts`, `src/components/AstroChatbot.tsx`)**
  - [x] Add Rule `0AD` to `src/engine/chatPrompt.ts` covering Baadhaka theory, multi-lagna audits, relative Baadhaka, and nodal transits.
  - [x] Inject Section 84 (`medhajBaadhakSummary`) into `src/engine/chatContext.ts` across `career`, `marriage`, and `all` intents.
  - [x] Add Interceptor 23 in `src/components/AstroChatbot.tsx` for fast 0ms interactive Baadhak resolution.

- [x] **Phase 30.4: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Add Subtest 127 in `tests/engine.test.mjs` verifying multi-lagna calculations, 12-house relative modalities, Aquarius profiles, and nodal return cycles.
  - [x] Verify `npm test` passes all 127 tests.
  - [x] Verify `npx tsc --noEmit` has 0 errors.
  - [x] Verify `npm run build` succeeds (Next.js 15 production build clean).

---

# Phase 31: Medhaj Astro Sessions 86 & 87 (Indu Lagna Wealth Masterclass, Dhana Yogas, 2-4-8 Support Rule, Age Activations & Transit Portals)

## Status: Complete & Verified
- **Trigger Keywords**: `indu-lagna-wealth-masterclass`, `kala-ray-math`, `trine-kendra-dhana-yogas`, `indu-lagna-11th-entrepreneur`, `sustained-support-2-4-8`, `indu-arudha-convergence`, `indu-planetary-activation-ages`, `transit-indu-portals`, `ardra-aggressive-wealth`
- **Single Source of Truth**: Tracking Phase 31 implementation across core calculation engine, UI interactive deck, chatbot parity, and automated test suite.

---

## Phases & Milestones

- [x] **Phase 31.1: Core Medhaj Indu Lagna Wealth Engine (`src/engine/medhajInduLagna.ts`)**
  - [x] Implement Session 86 (Kala Ray Math & Foundational Dignity):
    * Planetary Ray Values: Sun 30, Moon 16, Mars 6, Mercury 8, Jupiter 10, Venus 12, Saturn 1.
    * 9th Lord from Lagna Kala + 9th Lord from Moon Kala $\pmod{12}$, counting from Moon.
    * Kendra/Trikona placement ease vs Dusthana (6, 8, 12) hard labor / stress conditions.
    * Rule of Thumb for Sustained Support: Occupation of houses 2, 4, and 8.
  - [x] Implement Session 87 (Dhana Yogas, Age Activations & Lecture Case Studies):
    * Benefics in Trines (1, 5, 9) and Kendras (1, 4, 7, 10) from Indu Lagna (Dhana Yogas).
    * Indu Lagna in 11th House (especially Movable / Baadhaka) large-scale entrepreneurial wealth.
    * Coincidence with Arudha Lagna (AL): Public perception aligns with actual financial standing.
    * Planetary Maturation Ages on Indu Lagna: Jupiter (16, recurring +12), Sun (22), Moon (24), Venus (26), Mars (28), Mercury (32), Saturn (36+), Rahu (42), Ketu (48).
    * Aggressive / high-risk wealth triggers (Sun, Mars, Ardra Nakshatra).
    * Real-time transit portals: Benefics transiting over Indu Lagna and its Kendra/Trikona axes.
  - [x] Implement `generateMedhajInduLagnaMasterReport(natalEphem, transitEphem, birthDate, evaluationDate)`.

- [x] **Phase 31.2: Interactive UI Deck Integration (`src/components/DashaView.tsx`)**
  - [x] Add Tab 7: `"💰 Indu Lagna Wealth (Sessions 86, 87 इन्दु लग्न)"`.
  - [x] Render interactive cards:
    * Indu Lagna Ray Scorecard & Moon Counting Derivation Card.
    * Kendra / Trikona Dhana Yoga Matrix from Indu Lagna.
    * 2-4-8 Sustained Financial Support Indicator.
    * Chronological Planetary Activation Age Radar.
    * Indu Lagna + Arudha Lagna Convergence & 11th House Entrepreneurial Indicator.
    * Real-Time Transit Portal Watcher over Indu Lagna.

- [x] **Phase 31.3: Chatbot System Parity (`src/engine/chatPrompt.ts`, `src/engine/chatContext.ts`, `src/components/AstroChatbot.tsx`)**
  - [x] Add Rule `0AE` to `src/engine/chatPrompt.ts` covering Indu Lagna, Trine/Kendra Dhana Yogas, 2-4-8 rule, age activation milestones, and transit triggers.
  - [x] Inject Section 85 (`medhajInduLagnaSummary`) into `src/engine/chatContext.ts` across `career`, `wealth`, and `all` intents.
  - [x] Add Interceptor 24 in `src/components/AstroChatbot.tsx` for fast 0ms interactive Indu Lagna wealth resolution.

- [x] **Phase 31.4: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Add Subtest 128 in `tests/engine.test.mjs` verifying lecture benchmarks (Virgo Lagna + Capricorn Moon $\rightarrow$ Leo Indu Lagna), Trine/Kendra Dhana Yogas, 2-4-8 pattern, and activation ages.
  - [x] Verify `npm test` passes all 128 tests (128 pass, 0 fail).
  - [x] Verify `npx tsc --noEmit` has 0 errors.
  - [x] Verify `npm run build` succeeds (Next.js 15 production build clean).

---

# Phase 32: Medhaj Astro Sessions 71, 72 & 74 (House Karakas, Marana Karaka Sthana MKS, Rahu-Ketu Past Life Roots & Saturn's Cosmic Law)

## Status: Complete & Verified (All 129 Tests Passing, 0 TS Errors & Production Build Clean)
- **Trigger Keywords**: `house-karakas`, `marana-karaka-sthana`, `mks-suffocation`, `mks-remedies`, `automobile-metaphor`, `ketu-past-life-roots`, `rahu-destination-google-maps`, `saturn-cosmic-boundary-law`, `matsya-water-warning`
- **Single Source of Truth**: Tracking Phase 32 implementation across core calculation engine, UI interactive deck, chatbot parity, and automated test suite.

---

## Phases & Milestones

- [x] **Phase 32.1: Core Medhaj MKS & Past Life Roots Engine (`src/engine/medhajMksPastLife.ts`)**
  - [x] Implement Session 71 (House Karakas & Marana Karaka Sthana):
    * Primary natural significators (Karaka Sthana) for Houses 1 to 12.
    * Marana Karaka Sthana (MKS) placements: Saturn H1, Jupiter H3, Mercury H4/H7, Venus H6, Mars H7, Moon H8, Rahu H9, Sun H12.
    * Suffocation mechanisms, double-labor burden, and specific remedial prescriptions.
  - [x] Implement Session 72 & 74 (Automobile Metaphor & Ketu 12-Sign Past Life Roots):
    * The Automobile Metaphor: Rahu (Destination / Google Maps), Ketu (Past Root / Intention), Saturn (Cosmic Law / Road Rules), Dispositors (Steering Wheel).
    * Ketu 12-Sign Past-Life Decoding (Inverting axis): Aries through Pisces past-life archetypes, karmic excesses, and current Rahu evolutionary growth mandate.
    * Special Matsya Avatar early childhood water safety warning for Ketu in Pisces/water signs.
  - [x] Implement Session 74 (Saturn's Supreme Cosmic Boundary Law across 12 Signs):
    * Invariant boundary laws across all 12 signs (Aries: undisciplined action fails; Taurus: selfish hoarding backfires; Gemini: deceit collapses; Cancer: emotional manipulation exposed; etc.).
  - [x] Implement `generateMedhajMksPastLifeMasterReport(natalEphem, birthDate, evaluationDate)`.

- [x] **Phase 32.2: Interactive UI Deck Integration (`src/components/DashaView.tsx`)**
  - [x] Add Tab 8: `"💀 MKS & Past Life Roots (Sessions 71, 72, 74 मरण व पूर्वजन्म)"`.
  - [x] Render interactive cards:
    * Marana Karaka Sthana (MKS) Suffocation Radar & Specific Remedial Actions.
    * The Automobile Karmic Cockpit Card (Rahu Google Maps, Ketu Past Root, Saturn Law, Dispositor Steering Wheels).
    * Ketu 12-Sign Past-Life Archetype & Current Rahu Mandate Card.
    * Saturn's Supreme Cosmic Boundary Matrix.

- [x] **Phase 32.3: Chatbot System Parity (`src/engine/chatPrompt.ts`, `src/engine/chatContext.ts`, `src/components/AstroChatbot.tsx`)**
  - [x] Add Rule `0AF` to `src/engine/chatPrompt.ts` covering MKS positions/remedies, the Automobile Metaphor, Ketu 12-sign past life origins, and Saturn's cosmic laws.
  - [x] Inject Section 86 (`medhajMksPastLifeSummary`) into `src/engine/chatContext.ts` across `career`, `marriage`, `remedies_health`, and `all` intents.
  - [x] Add Interceptor 25 in `src/components/AstroChatbot.tsx` for fast 0ms interactive MKS and past life resolution.

- [x] **Phase 32.4: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Add Subtest 129 in `tests/engine.test.mjs` verifying all MKS positions, remedial measures, Ketu past-life signs, automobile metaphor dispositors, and Saturn boundary laws.
  - [x] Verify `npm test` passes all 129 tests.
  - [x] Verify `npx tsc --noEmit` has 0 errors.
  - [x] Verify `npm run build` succeeds (Next.js 15 production build clean).

---

# Phase 33: Medhaj Astro Sessions 83, 88 & 89 (Rahu-Ketu Transit, Rohini Shakata Bhedana, Great 20-Year Conjunction & Anna Tyaga Upavasa)

## Status: Complete & Verified (All 130 Tests Passing, 0 TS Errors & Production Build Clean)
- **Trigger Keywords**: `destiny-breakers`, `rahu-taurus-ketu-scorpio`, `rohini-shakata-bhedana`, `dasharatha-shani-stuti`, `great-conjunction-capricorn`, `prana-apana-vayu`, `mustard-oil-nasal-protocol`, `anna-tyaga-upavasa`, `moon-primacy-yogas`
- **Single Source of Truth**: Tracking Phase 33 implementation across calculation engine, UI interactive deck, chatbot parity, and automated test suite.

---

## Phases & Milestones

- [x] **Phase 33.1: Core Rahu-Ketu Transit & Rohini Bhedana Engine (`src/engine/medhajRahuKetuTransit.ts`)**
  - [x] Implement Session 83 (Nadi "Destiny Breakers" & Taurus/Scorpio Axis Shift):
    * Rahu 2nd house resource expansion, banking, agriculture & economic anxiety.
    * Ketu 8th house unearned wealth destruction, secrets & fear dissolution via confrontation.
    * F.E.A.R. metric ("False Evidence Appearing Real").
  - [x] Implement Session 88 (Cosmic Reset Timelines, 20-Year Great Conjunction & Ayurvedic Shield):
    * Civilizational reset timeline (Teaser Dec 2019–Mar 2020, Trailer Mid-2020, Main Picture Post-Nov 16, 2020).
    * Pluto in Capricorn & Great Conjunction of Jupiter (Prana Vayu) & Saturn (Apana Vayu) at 6° Capricorn (Uttara Ashadha).
    * Debilitated Jupiter health/pharmaceutical warnings vs natural bodily immunity (Jiva).
    * Ayurvedic 6-drop mustard oil nasal protocol (Mars hour 4–6 PM/sunset, Saturn oil, Venus 6 drops, Mars/Jupiter breath).
  - [x] Implement Session 89 (Rohini Shakata Bhedana & Sacred Anna Tyaga Remedy):
    * Rahu retrograde transit in Taurus Nakshatras (Mrigashira -> Rohini -> Krittika).
    * King Dasharatha legend & Rohini Shakata Bhedana (drought, famine, supply-chain risks, Dasharatha Shani Stuti).
    * Ultimate collective remedy: Anna Tyaga (sunset-to-sunrise fasting & voluntary meal reduction).
    * Primacy of the Moon (Chandra) in activating Raja & Dhana Yogas.
    * Ketu in Scorpio spiritual sanctuary.
  - [x] Implement `generateMedhajRahuKetuTransitMasterReport(natalEphem, transitEphem, birthDate, evaluationDate)`.

- [x] **Phase 33.2: Interactive UI Deck Integration (`src/components/DashaView.tsx`)**
  - [x] Add Tab 9: `"🌪️ Nodal Destiny & Rohini Bhedana (Sessions 83, 88, 89 राहु-केतु गोचर)"`.
  - [x] Render 5 interactive cards:
    * Nadi Destiny Breakers & Taurus-Scorpio Axis Radar.
    * 20-Year Great Conjunction & Civilizational Reset Timeline Card (6° Capricorn Uttara Ashadha).
    * Rohini Shakata Bhedana, King Dasharatha Legend & Supply-Chain Risk Card.
    * Ayurvedic 6-Drop Mustard Oil Nasal Shield Protocol Card.
    * Sacred Anna Tyaga (Sunset-to-Sunrise Fasting) & Moon Primacy Card.

- [x] **Phase 33.3: Chatbot System Parity (`src/engine/chatPrompt.ts`, `src/engine/chatContext.ts`, `src/components/AstroChatbot.tsx`)**
  - [x] Add Rule `0AG` to `src/engine/chatPrompt.ts` covering Nadi Destiny Breakers, Rohini Shakata Bhedana, Great Conjunction, Mustard oil nasal protocol, and Anna Tyaga fasting.
  - [x] Inject Section 87 (`medhajRahuKetuTransitSummary`) into `src/engine/chatContext.ts` across `career`, `marriage`, `remedies_health`, and `all` intents.
  - [x] Add Interceptor 26 in `src/components/AstroChatbot.tsx` for fast 0ms interactive nodal transit and remedy resolution.

- [x] **Phase 33.4: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Add Subtest 130 in `tests/engine.test.mjs` verifying all Session 83, 88 & 89 calculations, Rohini Bhedana detection, Great Conjunction at 6° Capricorn, and remedial protocols.
  - [x] Verify `npm test` passes all 130 tests.
  - [x] Verify `npx tsc --noEmit` has 0 errors.
  - [x] Verify `npm run build` succeeds (Next.js 15 production build clean).

---

# Phase 34: Global Shastric Anonymization & Neutralization (Comprehensive Removal of Teacher, YouTuber & Contemporary Person Names from Frontend & Chatbot)

## Status: Complete & Verified (All 130 Tests Passing & Production Build Clean)
- **Trigger Keywords**: `shastric-neutralization`, `person-name-removal`, `classical-anonymization`, `ui-debranding`, `classical-provenance`
- **Single Source of Truth**: Tracking Phase 34 implementation across all UI decks, chatbot engine prompt/context/interceptors, engine string payloads, and automated test suite.

---

## Phases & Milestones

- [x] **Phase 34.1: UI Components Debranding & Shastric Renaming**
  - [x] `src/components/DashaView.tsx`: Replace tab buttons & card headers (replaced "Medhaj Astro Gochara" with "Classical Gochara & Transit Portals", "Medhaj Astro Planetary Activations" with "Planetary Activations & Sambandha Matrix", "Medhaj Astro Arudha Lagna" with "Arudha Lagna & Jyotirlinga Synthesis", "Medhaj Astro Baadhak Theory" with "Baadhaka Shastra & Obstruction Dynamics", "Medhaj Astro Sessions 86 & 87 Indu Lagna" with "Indu Lagna Wealth & Dhana Shastra", "Medhaj Astro MKS" with "Marana Karaka Sthana & Karmic Origins", "Medhaj Astro Sessions 83, 88, 89 Nodal Destiny" with "Nodal Destiny & Rohini Bhedana").
  - [x] `src/components/ShodashavargaView.tsx`: Replace "Deepanshu Giri RTN Dusthana Suffering" with "RTN Dusthana Karmic Suffering Audit", "Lunar Astro Benchmark Case Match" with "Classical Divisional Benchmark Match", "D-1 10th House Physical Workplace Surroundings Card (Deepanshu Giri Rule)" with "D-1 10th House Physical Workplace Surroundings", and anonymize historical benchmark labels (replaced specific politician names with sovereign/governance archetypes).
  - [x] `src/components/NumerologyView.tsx`: Replace "Lunar Astro Name Vibrational Energy" with "Astro-Phonetic Name Vibrational Energy", "Lunar Astro Suite" with "Astro-Phonetic Vibrational Suite", replace teacher citations with "Classical Nadi & Astro-Phonetics", replace example name placeholders.
  - [x] `src/components/DoubleTransitDeck.tsx`, `EducationStreamDeck.tsx`, `KarmaRebirthDeck.tsx`, `KnRaoTechniquesDeck.tsx`, `MarriageTimingDeck.tsx`: Replace contemporary researcher names with "Classical Research & Shastric Dictum" or "BVB Research Tradition" / "Classical Master Dictum".
  - [x] `src/components/MuhurtaView.tsx` & `LappingMatrixView.tsx`: Replace personal names with "Classical Vedic Panchanga Shastra".

- [x] **Phase 34.2: Chatbot Prompt & Context System Parity (`src/engine/chatPrompt.ts` & `src/engine/chatContext.ts`)**
  - [x] `src/engine/chatPrompt.ts`: Clean up rules 0D, 0O, 0V, 0W, 0X, and Syllabus Units 52–89 to remove contemporary astrologer/YouTuber names and replace with authoritative classical names / Shastras (*Brihat Parashara Hora Shastra*, *Jaimini Upadesha Sutras*, *Classical Nadi Granthas*, *Svara Jyotish & Astro-Phonetics*, *Deva Keralam / Chandrakala Nadi*).
  - [x] `src/engine/chatContext.ts`: Clean up Section titles and references to ensure clean classical Shastric provenance.

- [x] **Phase 34.3: Chatbot UI Interceptors & Chips (`src/components/AstroChatbot.tsx`)**
  - [x] Replace all occurrences of "Navneet Chitkara", "Deepanshu Giri", "Medhaj Astro", "Lunar Astro", "Dr. Samir Tripathi" in Interceptors 11, 16, 18, 20, 21, 22, 23, 24, 25, 26, chips, and telemetry badges with shastric/classical terms.
  - [x] Retain regex triggers so user questions mentioning these terms continue to resolve seamlessly at 0ms without displaying personal names in the output.

- [x] **Phase 34.4: Engine Display Strings & Explanations**
  - [x] Audit user-facing display strings across engines, replacing person names with classical shastric references.

- [x] **Phase 34.5: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Audit `tests/engine.test.mjs` to ensure all 130 tests pass with the new normalized wording.
  - [x] Verify `npm test` passes all 130 tests.
  - [x] Verify `npx tsc --noEmit` has 0 errors.
  - [x] Verify `npm run build` succeeds (Next.js 15 production build clean).

---

# Phase 35: Agni Trines, Ganga Jal Drishti, Divine Lineage Triad & Dual Sign Degree Bifurcation (Syllabus Units 90, 91 & 92)

## Status: Complete & Verified (All 131 Tests Passing & Production Build Clean)
- **Trigger Keywords**: `agni-trine-transit`, `ganga-jal-drishti`, `divine-lineage-triad`, `kula-devata-4th`, `dharma-devata-9th`, `ishta-devata-12th`, `dual-sign-degree-split`, `water-sign-tears`, `zodiac-guna-matrix`
- **Single Source of Truth**: Tracking Phase 35 implementation across `src/engine/agniTransitLineage.ts`, `src/engine/chatPrompt.ts`, `src/engine/chatContext.ts`, `src/components/AstroChatbot.tsx`, `src/components/DashaView.tsx`, and `tests/engine.test.mjs`.

---

## Phases & Milestones

- [x] **Phase 35.1: Core Agni Transit & Divine Lineage Engine (`src/engine/agniTransitLineage.ts`)**
  - [x] Implement Session 90 (Fire Signs & Concurrence):
    * Concurrent Fire Sign Moolatrikona / Own Sign Transits: Mars in Aries, Sun in Leo, Jupiter in Sagittarius.
    * 3 Dimensions of Fire: Aries (Rajasic, "I to I", Commander/Warrior), Leo (Tamasic, "I to You", The King/Sacrifice), Sagittarius (Sattvic, "I to All", Rajpurohit/Guru).
    * Jupiter's Protective *Ganga Jal Drishti*: 5th aspect on Mars (Aries), 9th aspect on Sun (Leo) purifying aggression with dharma, truth, and natural justice (with retrograde ideological polarization telemetry).
    * Mars' 6-month transit in Aries/Pisces with retrogression + Uranus (Harshal) conjunction: sudden volatility, revolutionary breakthroughs.
  - [x] Implement Session 91 (Macro Architecture, Gunas & Water Sign Tears):
    * Zodiac Guna & Perspective Matrix: Signs 1–4 Rajasic ("I to I"), Signs 5–8 Tamasic ("I to You"), Signs 9–12 Sattvic ("I to All").
    * 4 Elements (Fire Dharma, Earth Artha, Air Kama, Water Moksha).
    * Water Sign Emotional Tears Psychology: Cancer (cries for oneself), Scorpio (suppresses tears until volcanic eruption), Pisces (wipes the tears of others / universal empathy).
    * Transit intersection: Fire trine decisive execution, Taurus-Scorpio axis resolution, and preparation for the 20-year Jupiter-Saturn Capricorn ground-reality cycle.
  - [x] Implement Session 92 (Sambandhas, Divine Lineage Triad & Dual Sign Bifurcation):
    * Geometric Sambandhas: Kendra (1/4/7/10 status quo challenge), Trikona (1/5/9 harmony), 3/11 (growth engine), 2/12 (feeder support), 6/8 (friction).
    * Divine Lineage of Houses (Deity Triad):
      - 4th House: Kula Devata (Ancestral / Family Presiding Deity).
      - 9th House: Dharma Devata (Guiding higher principles, righteous conduct, spiritual path).
      - 12th House: Ishta Devata (Personal Divine Ideal guiding soul liberation/Moksha).
    * Behavioral Temperament from Lagna & Lagna Lord:
      - Movable + Movable: Constantly evolving, agile real-time adaptation.
      - Movable + Fixed: Swift external adaptation, resolute unchanging core convictions.
      - Fixed + Fixed: Unyielding, immovable resolve and stubborn conviction.
    * Dual Signs (Dwiswabhava) Degree Bifurcation:
      - 0°–15°: Fixed (Sthira) characteristics.
      - 15°–30°: Movable (Chara) characteristics.
  - [x] Master synthesis report generator function: `generateAgniTransitLineageReport()`.

- [x] **Phase 35.2: Chatbot Prompt & Context System Parity (`src/engine/chatPrompt.ts` & `src/engine/chatContext.ts`)**
  - [x] `src/engine/chatPrompt.ts`: Add Rule `0AH` detailing Agni Trines, Ganga Jal Drishti, 4th/9th/12th Divine Lineage Triad, Water Sign Tears, and Dual Sign 15° split.
  - [x] `src/engine/chatContext.ts`: Add Section 88 dossier (`agniTransitLineageSummary`).

- [x] **Phase 35.3: Chatbot UI Interceptor 27 (`src/components/AstroChatbot.tsx`)**
  - [x] Add fast regex interceptor 27 to respond instantly to queries regarding "fire signs", "agni rashi", "ganga jal drishti", "kula devata", "dharma devata", "dual sign 15 degrees", "water sign tears", etc.
  - [x] Add interactive chips for Agni Trine, Kula Devata, Dharma Devata, and Dual Sign degree dynamics.

- [x] **Phase 35.4: UI Interactive Deck in DashaView (`src/components/DashaView.tsx`)**
  - [x] Add Tab 10: "🔥 Agni Transits, Divine Lineage & Temperament (Syllabus Units 90–92)".
  - [x] Render interactive cards for Fire Trine Moolatrikona, Ganga Jal Drishti, Water Sign Emotional Tears, Divine Lineage Triad, and Lagna Temperament & Dual Sign 15° Cusp.

- [x] **Phase 35.5: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Add Subtest 131 covering all Session 90, 91, 92 calculations and edge cases.
  - [x] Run `npm test` (all 131 tests passing).
  - [x] Run `npx tsc --noEmit` (0 errors).
  - [x] Run `npm run build` (clean Next.js production build).

---

# Phase 36: Bhagya Bindu (Pars Fortuna) Triggers & Secret Code of Relative Planetary Manifestations (Sessions 97 & 99)

## Status: Complete & Verified (All 132 Tests Passing & Production Build Clean)
- **Trigger Keywords**: `bhagya-bindu`, `pars-fortuna`, `fortune-point`, `secret-code-planets`, `highest-manifestation`, `lowest-manifestation`, `mercury-speech-dynamics`, `moolatrikona-to-exaltation`
- **Single Source of Truth**: Tracking Phase 36 implementation across `src/engine/bhagyaBinduSecretCode.ts`, `src/engine/chatPrompt.ts`, `src/engine/chatContext.ts`, `src/components/AstroChatbot.tsx`, `src/components/DashaView.tsx`, and `tests/engine.test.mjs`.

---

## Phases & Milestones

- [x] **Phase 36.1: Core Bhagya Bindu Triggers & Secret Code Engine (`src/engine/bhagyaBinduSecretCode.ts`)**
  - [x] Implement Session 97 (Bhagya Bindu / Pars Fortuna):
    * Precise 360° absolute longitude calculations for Day Birth (Lagna + Moon - Sun) and Night Birth (Lagna + Sun - Moon).
    * House, Rashi, Nakshatra, and Nakshatra Lord.
    * House placement karmic profiles: 4th House (fortunes peak at age 4 and repeat every 12 years: ages 16, 28, 40, 52), 11th House (exceptional cash flow and network elevation), and full 1st–12th house profiles.
    * Geometric relationships: Trines (1st, 5th, 9th - effortless luck), Quadrants (1st, 4th, 7th, 10th - active turning points), Upachayas (3rd & 11th - personal initiative).
    * Real-time transit activation: Evaluate transits of Venus, Mercury, Jupiter, Saturn, Rahu, Ketu over Bhagya Bindu and its geometric aspects.
  - [x] Implement Session 99 (Secret Code of Planets: Relative High vs. Low Manifestations):
    * Master geometric rule: Distance from Moolatrikona to Exaltation = Highest Manifestation; Moolatrikona to Debilitation = Lowest Manifestation (Blind Spot).
    * Planet derivations:
      - Sun (Leo): Highest in 9th from Sun (work ethic, disciplined routine, eliminating debt/enemies); Lowest in 3rd from Sun (subconscious fear, nocturnal anxiety).
      - Moon (Cancer): Highest in 11th from Moon (emotional security, social recognition); Lowest in 5th from Moon (emotional dissatisfaction, rumination over children/father perceptions).
      - Venus (Libra): Highest in 6th from Venus (selfless service, nursing, unconditional patience); Lowest in 12th from Venus (blurred relationship boundaries, sensory indulgence, reckless expenditure).
      - Jupiter (Sagittarius): Highest in 8th from Jupiter (external seekers, research, transformative mysteries); Lowest in 2nd from Jupiter (prophet never honored at home, immediate family undervalues wisdom).
      - Mercury (Virgo): Highest in 1st from Mercury (sharp analytical intellect, articulate expression); Lowest in 7th from Mercury (speech degradation, communication breakdowns with partners).
      - Mars (Aries) & Saturn (Aquarius) extensions: Mars Highest 10th / Lowest 4th; Saturn Highest 9th / Lowest 3rd.
    * Mercury Speech & Communication Dynamics:
      - Mercury position: How you converse.
      - 2nd from Mercury: What you continuously speak about and primary interlocutors.
      - 7th from Mercury: Where speech degrades and misunderstandings arise.
  - [x] Master synthesis report generator function: `generateBhagyaBinduSecretCodeReport(...)`.

- [x] **Phase 36.2: Chatbot Prompt & Context System Parity (`src/engine/chatPrompt.ts` & `src/engine/chatContext.ts`)**
  - [x] `src/engine/chatPrompt.ts`: Add Rule `0AI` detailing Bhagya Bindu transits, 12-year recurring cycles, and the Secret Code of Planets.
  - [x] `src/engine/chatContext.ts`: Add Section 89 dossier (`bhagyaBinduSecretCodeSummary`).

- [x] **Phase 36.3: Chatbot UI Interceptor 28 (`src/components/AstroChatbot.tsx`)**
  - [x] Add fast regex interceptor 28 responding instantaneously to queries on "bhagya bindu", "pars fortuna", "part of fortune", "secret code of planets", "highest manifestation", "lowest manifestation", "mercury speech".
  - [x] Add context chips for Bhagya Bindu, Secret Code, and Mercury Speech Dynamics.

- [x] **Phase 36.4: UI Interactive Deck in DashaView (`src/components/DashaView.tsx`)**
  - [x] Add Tab 11: "🌟 Bhagya Bindu & Secret Code of Planets (Syllabus Units 97 & 99)".
  - [x] Render interactive cards for Bhagya Bindu Point & Age Cycles, Active Transit Triggers, Secret Code Relative Manifestation Matrix, and Mercury Speech Dynamics.

- [x] **Phase 36.5: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Add Subtest 132 covering all Day/Night births, transits, Secret Code calculations, and Mercury speech dynamics.
  - [x] Run `npm test` (all 132 tests passing).
  - [x] Run `npx tsc --noEmit` (0 errors).
  - [x] Run `npm run build` (clean Next.js production build).

---

# Phase 37: Practical Lifestyle Remedies as a Way of Life & The 40-Day Rule (Session 41)

## Status: Complete & Verified (All 133 Tests Passing & Production Build Clean)
- **Trigger Keywords**: `lifestyle-remedies`, `way-of-life`, `40-day-rule`, `daily-conduct-astrology`, `digital-self-control`, `wire-detanglement`, `curd-prohibition-night`, `chandra-water-protocol`
- **Single Source of Truth**: Tracking Phase 37 implementation across `src/engine/lifestyleRemediesWayOfLife.ts`, `src/engine/chatPrompt.ts`, `src/engine/chatContext.ts`, `src/components/AstroChatbot.tsx`, `src/components/DashaView.tsx`, and `tests/engine.test.mjs`.

---

## Phases & Milestones

- [x] **Phase 37.1: Core Lifestyle Remedies & 40-Day Transformation Engine (`src/engine/lifestyleRemediesWayOfLife.ts`)**
  - [x] Implement Session 41 Core Philosophy:
    * Beyond rituals: Daily conduct as non-negotiable remedy reflex (brushing teeth / dressing up analogy).
    * The 40-Day Rule: Consistent practice for 40 consecutive days produces noticeable positive shifts and planetary favor starting on the 41st day.
  - [x] Implement Planet-by-Planet Practical Conduct Protocols:
    * Moon: Drink a glass of water before leaving house, offer water to thirsty travelers, zero water wastage while brushing/bathing.
    * Sun: Wake up at least 15 min before sunrise; late waking erodes solar vitality/willpower/prestige.
    * Jupiter: Daily sharing of sweets, respecting/serving elders/Gurus every day (not limited to Thursdays).
    * Saturn: Penance/discipline, digital self-control (constructive learning vs. base distractions), complete abstinence from alcohol/intoxicants, no outside shoes inside home, hair care, massaging elders' head/feet with oil.
    * Venus: Feed curd to cow/woman, do NOT consume curd at night, relationship fidelity, white donations on Fridays.
    * Mars: Brotherly love with siblings, never encroach on land/property/wealth, never view women with dishonorable intent (property litigations indicate Mars affliction).
    * Rahu: Bathroom & toilet immaculately clean/dry, untangle phone chargers/wires (no messy cords), bucket & mug rule (never leave mug submerged in water bucket), clean trapped hair from brushes/combs immediately.
    * Ketu: Inward stillness/surrender (Moksha), pause during day to chant Om / Om Namah Shivaya with single focus on Shiva.
    * Mercury: Feed green fodder/palak to cows, love/serve children, cultivate cheerful/jovial demeanor, meditate on Vishnu with Om Budhaya Namaha, bring joy/laughter to someone's day.
  - [x] Implement Chart-Specific Personalization:
    * Cross-reference natal ephemeris, active Mahadasha/Antardasha lords, debilitated/combust grahas, and Baadhakesh to assign high-priority focus badges.
  - [x] Master synthesis report generator function: `generateLifestyleRemediesReport(...)`.

- [x] **Phase 37.2: Chatbot Prompt & Context System Parity (`src/engine/chatPrompt.ts` & `src/engine/chatContext.ts`)**
  - [x] `src/engine/chatPrompt.ts`: Add Rule `0AJ` detailing the 40-Day Rule and practical conduct protocols.
  - [x] `src/engine/chatContext.ts`: Add Section 90 dossier (`lifestyleRemediesWayOfLifeSummary`).

- [x] **Phase 37.3: Chatbot UI Interceptor 29 (`src/components/AstroChatbot.tsx`)**
  - [x] Add fast regex interceptor 29 responding instantaneously to queries on "lifestyle remedies", "way of life", "40 day rule", "untangle wires", "curd at night", "daily habits".
  - [x] Add context chips for 40-Day Rule, Dasha Priority Habits, Rahu Detanglement, and Saturn Digital Self-Control.

- [x] **Phase 37.4: UI Interactive Deck in DashaView (`src/components/DashaView.tsx`)**
  - [x] Add Tab 12: "🌿 Lifestyle Remedies — Way of Life (जीवन शैली उपाय - 40-Day Matrix)".
  - [x] Render interactive cards for The 40-Day Rule, Native's Dasha-Targeted Priority Habits, Full 9-Graha Conduct Grid, and 40-Day Habit Tracker.

- [x] **Phase 37.5: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Add Subtest 133 covering all 9 graha lifestyle remedies, 40-day rule, personalized prioritization based on D1 chart afflictions, and report generation.
  - [x] Run `npm test` (all 133 tests passing).
  - [x] Run `npx tsc --noEmit` (0 errors).
  - [x] Run `npm run build` (clean Next.js production build).

---

# Phase 38: Classical Panchanga Deep Synthesis, Dagdha Rashis (Viparita Raja Yoga), Yogi/Avayogi Points & Mantra Science (Sessions 46, 47, 48, 49, 96, 98)

## Status: Complete & Verified (All 134 Tests Passing & Production Build Clean)
- **Trigger Keywords**: `natal-panchanga-deep`, `dagdha-rashi`, `burnt-signs`, `dagdha-viparita-raja-yoga`, `yogi-point`, `avayogi-nakshatra`, `karan-mars-execution`, `fixed-karans-destigmatized`, `three-tier-vishnu-armor`, `panchak-5x`, `abhijit-28th-nakshatra`, `tithi-presiding-deities`
- **Single Source of Truth**: Tracking Phase 38 across `src/engine/natalPanchangaDeep.ts`, `src/engine/chatPrompt.ts`, `src/engine/chatContext.ts`, `src/components/AstroChatbot.tsx`, `src/components/PositionsTable.tsx`, `src/components/DashaView.tsx`, and `tests/engine.test.mjs`.

---

## Phases & Milestones

- [x] **Phase 38.1: Core Natal Panchanga Deep Synthesis Engine (`src/engine/natalPanchangaDeep.ts`)**
  - [x] Implement Five Elemental Limbs (Kshiti, Jala, Pavaka, Gagana, Sameera) with sensory/working organs:
    * Vara (Agni): Desires, Vitality, Eyes & Feet. Evaluates the house of Weekday Ruler revealing core lifelong desires.
    * Karan (Prithvi): Karma, Execution, Nose & Anus. Governed by Mars (*Karama Pradhana*).
    * Nakshatra (Vayu): Relationships, Social Networks, Intellect. Panchak detection (5x multiplier) & Abhijit placement.
    * Tithi (Jala): Emotions, Subconscious Karma, Tongue & Genitals. 5 elemental classes (Nanda, Bhadra, Jaya, Rikta, Poorna), Purna/Kshaya/Vriddhi classification, and 15 Presiding Deities.
    * Yoga (Akasha): Divine Grace (*Daiva Kripa*), Ears & Speech. Governed by Jupiter.
  - [x] Implement Complete Dagdha Rashis (Burnt Signs) & Predictive Rules:
    * Exact lookup for Tithis 1–14 (and None for 15/30).
    * **Viparita Raja Yoga**: If Dagdha sign falls in 6th, 8th, or 12th house relative to Lagna (debts, litigations, diseases burnt away).
    * **Retrograde Remediation**: If a retrograde planet occupies a Dagdha sign (tenacious persistence turns into an asset).
    * **Kendra/Trikona Affliction**: Initial setbacks requiring Amavasya/Purnima sadhana and Tithi deity invocation.
    * Detailed planetary analysis of occupants in Dagdha signs.
  - [x] Implement Yogi, Sahayogi & Avayogi Mathematical Point Engine:
    * $\text{Yogi Point} = (\text{Surya Longitude} + \text{Chandra Longitude} + 93^\circ 20') \pmod{360^\circ}$.
    * Computes Yogi Nakshatra, Yogi Planet (prosperity catalyst), and Sahayogi (sign lord).
    * Computes Avayogi Nakshatra (+6 constellations from Yogi Nakshatra) and Avayogi Planet (karmic friction & refinement).
  - [x] Implement 11 Karans & Mars Work Execution Dynamics:
    * 7 Movable Karans (Bava-Sun, Balava-Moon, Kaulava-Mars, Taitila-Mercury, Gara-Jupiter, Vanija-Venus, Vishti-Saturn).
    * 4 Fixed Karans de-stigmatized: Shakuni (strategic survivor), Chatushpada & Naga (metaphysical endurance), Kimstughna (independent initiative).
    * Operational synthesis of Birth Karan ruler + Mars house placement in native's chart.
  - [x] Implement Mantra Science & Three-Tier Vishnu Armor:
    * Suffix classification: *Svaha* (sacrificial/fire), *Phat* (forceful/subjugating), *Namaha* (universal surrender for Kali Yuga).
    * Three-Tier Vishnu Armor mapping: Physical (*Om Narayanaya Namaha*), Mental (*Om Vishnave Namaha*), Spiritual (*Om Namo Bhagavate Vasudevaya*).
  - [x] Master synthesis report generator: `generateNatalPanchangaDeepReport(...)`.

- [x] **Phase 38.2: Chatbot Prompt & Context System Parity (`src/engine/chatPrompt.ts` & `src/engine/chatContext.ts`)**
  - [x] `src/engine/chatPrompt.ts`: Add Rule `0AK` detailing 5 Elemental Limbs, Weekday desire house, Dagdha Rashi Viparita Raja Yoga, Yogi/Avayogi points, and Three-Tier Vishnu Armor.
  - [x] `src/engine/chatContext.ts`: Add Section 91 dossier (`natalPanchangaDeepSummary`).

- [x] **Phase 38.3: Chatbot UI Interceptor 30 (`src/components/AstroChatbot.tsx`)**
  - [x] Add fast regex interceptor 30 responding instantaneously to queries on "dagdha rashi", "burnt signs", "yogi avayogi", "panchak", "karan execution", "vishnu armor".
  - [x] Add context chips for Dagdha Viparita Yoga, Yogi Point, Weekday Desire, and Vishnu Armor.

- [x] **Phase 38.4: UI Interactive Deck Upgrades (`PositionsTable.tsx` & `DashaView.tsx`)**
  - [x] Upgrade Tab 3 in `src/components/PositionsTable.tsx` to the rich **"Panchanga & Dagdha Suite (पञ्चाङ्ग एवं दग्ध राशि)"**.
  - [x] Add Tab 13 in `src/components/DashaView.tsx`: **"🌌 Panchanga Blueprint & Dagdha Yoga"** with interactive cards for 5 Elements, Dagdha Viparita Yoga, Yogi/Avayogi, Karan-Mars Execution, and Vishnu Armor.

- [x] **Phase 38.5: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Add Subtest 134 verifying Dagdha lookup for all 15 tithis, Viparita Raja Yoga in 6/8/12, Retrograde remediation, Yogi/Avayogi mathematics (+6 nakshatras), Weekday desire house, Panchak 5x detection, and Vishnu Armor.
  - [x] Run `npm test` (all 134 tests passing).
  - [x] Run `npx tsc --noEmit` (0 errors).
  - [x] Run `npm run build` (clean Next.js production build).

---

# Phase 39: Significance of Rashi Capricorn (Makara), Kurma Avatara Archetype, Saturn's 5-Fold Influence Matrix & Kali Yuga Redemption (Sessions 36, 37, 38)

## Status: Complete & Verified (All 135 Tests Passing & Production Build Clean)
- **Trigger Keywords**: `makara-rashi`, `capricorn-significance`, `kurma-avatara-archetype`, `samudra-manthan-duty`, `chirasthayi-yash`, `saturn-shadow-mechanics`, `chhaya-flanking-effect`, `saturn-4th-fruition`, `manda-5th-hurdle`, `multi-lagna-framework`, `artha-trikona-triad`, `purusha-stri-polarity`, `king-parikshit-kali-yuga`, `respiratory-shield-remedy`
- **Single Source of Truth**: Tracking Phase 39 across `src/engine/makaraKurmaSaturn.ts`, `src/engine/chatPrompt.ts`, `src/engine/chatContext.ts`, `src/components/AstroChatbot.tsx`, `src/components/DashaView.tsx`, and `tests/engine.test.mjs`.

---

## Phases & Milestones

- [x] **Phase 39.1: Core Makara Kurma Saturn Engine (`src/engine/makaraKurmaSaturn.ts`)**
  - [x] Implement Multi-Lagna Framework of Existence:
    * 7 reference centers: Physical Lagna (appearance), Lagnesha (daily operation), Moon Lagna (Purva Janma emotional karma), Guru Lagna (divine consciousness/wisdom), Surya Lagna (soul focus/vitality), Saturn (Karma Karaka/duty), Arudha Lagna (world perception/Maya).
  - [x] Implement Structural Evolution of Signs & Gunas:
    * 1–4 (Rajasic "I to I"), 5–8 (Tamasic "I to You"), 9–12 (Sattvic "I to All").
    * Artha Trikona Triad: 2nd House Taurus (Rajasic Earth - accumulation), 6th House Virgo (Tamasic Earth - practical service), 10th House Capricorn (Sattvic Earth - Nishkama Karma).
  - [x] Implement Kurma Avatara Archetype & Capricorn House Law:
    * Samudra Manthan myth: Vishnu as tortoise bearing grinding weight of Mount Mandara; bruised, crushed, forgotten when nectar/gems were distributed.
    * The Capricorn Law across all 12 houses: Perform heavy labor quietly without expectation of praise, yielding *Chirasthayi Yash* (enduring fame).
    * Planetary occupants in Capricorn (Rahu eccentric hair, Mercury trendy hair, Saturn disciplined hair, Mars exalted supreme execution, Jupiter debilitated practical grounding).
  - [x] Implement Saturn's 5-Fold Influence Matrix:
    * 1. Occupied House & *Heen Bhavna* (inferiority complex domain).
    * 2. Chhaya (Shadow) Flanking Effect: 1 house behind (12th from Saturn) and 1 house ahead (2nd from Saturn).
    * 3. 4th House Karmic Fruition: Concentrates and fortifies tangible results 4 houses forward.
    * 4. Special Aspects (Drishti): 3rd, 7th, 10th houses.
    * 5. 5th House Limping Trigger (Manda Effect): Developmental hurdles/tests 5 houses forward.
  - [x] Implement Saturn in 12 Signs & House Maturation / Aging:
    * 12 sign psychological profiles (Aries speed vs patience Raj Yoga, Taurus avoid greed, etc.).
    * House Aging: Early maturity in H1, elder speech in H2, sibling burden in H3, mother burden/aging in H4, serious children in H5, older spouse in H7, father stern/early aging in H9.
  - [x] Implement Purusha vs Stri Rashi Polarity:
    * Odd signs (1, 3, 5, 7, 9, 11 - Fire/Air - Initiative) vs Even signs (2, 4, 6, 8, 10, 12 - Earth/Water - Receptive).
  - [x] Implement King Parikshit Kali Yuga Redemption Directive & Practical Hygiene:
    * Degenerated values from Shrimad Bhagavata Mahapurana.
    * Singular Salvation: Nama Sankirtana (Ram, Om Namah Shivaya) + Nishkama Karma.
    * Master Respiratory Remedy anatomy: Mars outer nostrils, Jupiter Prana, Saturn Apana/mustard oil, Venus 6 drops Sanjeevani.
    * Footwear & hair hygiene rules.
  - [x] Implement `generateMakaraKurmaMasterReport(natalEphem, birthDate)`.

- [x] **Phase 39.2: Chatbot Prompt & Context System Parity (`src/engine/chatPrompt.ts` & `src/engine/chatContext.ts`)**
  - [x] `src/engine/chatPrompt.ts`: Add Rule `0AL` detailing the Kurma archetype, Saturn's 5-fold reach, the 7-fold Multi-Lagna framework, and King Parikshit's Kali Yuga redemption.
  - [x] `src/engine/chatContext.ts`: Add Section 92 dossier (`makaraKurmaSaturnSummary`).

- [x] **Phase 39.3: Chatbot UI Interceptor 31 (`src/components/AstroChatbot.tsx`)**
  - [x] Add fast regex interceptor 31 responding to "makara", "capricorn", "kurma avatara", "saturn shadow", "chhaya effect", "manda effect", "multi lagna", "artha trikona", "purusha stri", "heen bhavna".
  - [x] Add action chips for Kurma Archetype, Saturn 5-Fold Reach, Multi-Lagna Audit, and Kali Yuga Redemption.

- [x] **Phase 39.4: UI Interactive Deck in DashaView (`src/components/DashaView.tsx`)**
  - [x] Add Tab 14: **"🐢 Makara Rashi & Kurma Avatara (मकर राशि, कूर्म अवतार व शनि छाया)"** with interactive diagnostic cards.

- [x] **Phase 39.5: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Add Subtest 135 verifying all calculations, 7 Multi-Lagna centers, Saturn 5-fold reach, Capricorn house mapping, and Purusha/Stri balance.
  - [x] Run `npm test` (all 135 tests passing).
  - [x] Run `npx tsc --noEmit` (0 errors).
  - [x] Run `npm run build` (clean Next.js production build).

---

# Phase 40: Significance of Rashi Aquarius (Kumbha), Rahu-Saturn-Uranus Triad, Bhrigu Bindu & Karmic Protection (Sessions 39 & 40)

## Status: Complete & Verified (All 136 Tests Passing & Production Build Clean)
- **Trigger Keywords**: `kumbha-rashi`, `aquarius-significance`, `bhrigu-bindu`, `destiny-point`, `water-bearer-archetype`, `pitcher-selfless-giving`, `danta-teeth-indicator`, `11th-house-true-friends`, `varaha-avatara-karmic`, `jalandhara-rahu-diplomacy`, `rahu-non-exploitation`, `batuk-bhairava-shield`, `street-dog-silver-elephant`
- **Single Source of Truth**: Tracking Phase 40 across `src/engine/kumbhaAquariusRahu.ts`, `src/engine/chatPrompt.ts`, `src/engine/chatContext.ts`, `src/components/AstroChatbot.tsx`, `src/components/DashaView.tsx`, and `tests/engine.test.mjs`.

---

## Phases & Milestones

- [x] **Phase 40.1: Core Kumbha Aquarius Rahu Engine (`src/engine/kumbhaAquariusRahu.ts`)**
  - [x] Implement Bhrigu Bindu & Destiny Point Mathematical Axis:
    * Bhrigu Bindu: exact shorter-arc midpoint between Rahu and Moon longitudes.
    * Destiny Point: $180^\circ$ opposition to Bhrigu Bindu (Karmic trigger / Bhagya point).
    * Nakshatra, Pada, Lord, Rashi, and House mapping (from Lagna and Moon).
    * Conjunctions ($\le 3^\circ 20'$) and aspects to Bhrigu Bindu axis.
  - [x] Implement Water-Bearer (Kumbha / Pitcher) Archetype & 12 Houses:
    * Selfless pouring out of water to quench others' thirst without personal recognition.
    * 11th House past-life debt clearance before Pisces 12th house Moksha.
    * House-specific selfless service prescriptions (H1 to H12).
  - [x] Implement Teeth (*Danta*) Physical Indicator:
    * Dental characteristics mapped to the house where Aquarius resides (H1 self, H2 family/maternal uncle, H3 siblings/neighbors, H4 mother, H5 children/partner, H7 spouse, H9 father, etc.).
  - [x] Implement 11th House True Friend Rule & Name Initial Matrix:
    * Fixed Air fidelity: 11th house from Lagna & Moon indicates friends who never betray.
    * Trinal allies: 9th House (Dharma) and 5th House (Purva Punya).
    * Name initial letter-to-rashi alignment for friend verification.
  - [x] Implement Rahu House Non-Exploitation Universal Law:
    * Danger matrix across all 12 houses: never cheat, deceive, or exploit significations of Rahu's house (H1 dignity, H2 money/inheritance, H3 siblings, H4 property/mother, H5 children/students, H6 subordinates, H7 women/spouse, etc.).
    * Active service pathways to convert Rahu's karmic debt into divine protection.
  - [x] Implement Tri-Rulership Matrix & Mythological Archetypes:
    * Saturn (discipline & endurance), Rahu (ambition & diplomatic scope), Uranus (sudden life transformations).
    * Varaha Avatara Analogy: Earth rescue in beast form, foundational work without bitter vanity.
    * Rahu Jalandhara Legend: Diplomatic courage and eloquence in conveying delicate/controversial truths calmly without sparking outrage.
  - [x] Implement Batuk Bhairava Spiritual Shield, Practical Animal Remedies & Bodily Correspondences:
    * Batuk Bhairav Stotra / Bhairava Ashtakam protection against Rahu-Ketu shocks and afflicted Aquarius.
    * Practical animal remedies: street dogs & elephants (silver elephant for Rahu-Saturn-Ganesha harmony).
    * 9-Point bodily correspondence table (gestures H3, speech H2, clothes Venus, breath Jupiter, nose Mars, eye vitality Venus, eye structure Mars, eye beauty Moon, hair/nails Saturn).
  - [x] Implement `generateKumbhaAquariusMasterReport(natalEphem, birthDate)`.

- [x] **Phase 40.2: Chatbot Prompt & Context System Parity (`src/engine/chatPrompt.ts` & `src/engine/chatContext.ts`)**
  - [x] `src/engine/chatPrompt.ts`: Add Rule `0AM` detailing Kumbha Water-Bearer archetype, Teeth indicator, 11th house friends, Bhrigu Bindu axis, Rahu non-exploitation law, and Batuk Bhairava shield.
  - [x] `src/engine/chatContext.ts`: Add Section 93 dossier (`kumbhaAquariusRahuSummary`).

- [x] **Phase 40.3: Chatbot UI Interceptor 32 (`src/components/AstroChatbot.tsx`)**
  - [x] Add fast regex interceptor 32 responding to "kumbha", "aquarius", "bhrigu bindu", "destiny point", "teeth", "danta", "true friends", "varaha", "jalandhara", "batuk bhairav", "never exploit rahu".
  - [x] Add action chips for Bhrigu Bindu, Aquarius House Duty, Rahu Warning, and Bhairav Shield.

- [x] **Phase 40.4: UI Interactive Deck in DashaView (`src/components/DashaView.tsx`)**
  - [x] Add Tab 15: **"🏺 Kumbha Rashi, Bhrigu Bindu & Rahu-Saturn Triad (कुम्भ राशि, भृगु बिंदु व राहु कवच)"** with interactive diagnostic cards.

- [x] **Phase 40.5: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Add Subtest 136 verifying Bhrigu Bindu & Destiny Point, Aquarius house placement, Teeth mapping, Rahu non-exploitation matrix, and master report.
  - [x] Run `npm test` (all 136 tests passing).
  - [x] Run `npx tsc --noEmit` (0 errors).
  - [x] Run `npm run build` (clean Next.js production build).

---

# Phase 41: Pisces (Meena) Archetype, Kalapurusha Script Overlay, Elemental Immunity & Special Drishti Mechanics (Sessions 42, 43, 44, 45)

## Status: In Progress
- **Trigger Keywords**: `meena-rashi`, `pisces-significance`, `blind-faith-pisces`, `andha-vishwas`, `daiva-kripa`, `kalapurusha-script-overlay`, `elemental-immunity-hierarchy`, `pathogen-resistance`, `water-lord-fire-immunity`, `special-drishti-archetypes`, `saturn-gemini-capricorn-aspects`, `mars-cancer-scorpio-aspects`, `jupiter-leo-sagittarius-aspects`, `rahu-ketu-nodal-aspects`
- **Single Source of Truth**: Tracking Phase 41 across `src/engine/meenaKalapurushaDrishti.ts`, `src/engine/chatPrompt.ts`, `src/engine/chatContext.ts`, `src/components/AstroChatbot.tsx`, `src/components/DashaView.tsx`, and `tests/engine.test.mjs`.

---

## Phases & Milestones

- [x] **Phase 41.1: Core Pisces Kalapurusha Drishti Engine (`src/engine/meenaKalapurushaDrishti.ts`)**
  - [x] Implement Pisces (Meena) Archetype & 12 Houses:
    * Two fish swimming in opposite directions (Moksha vs rebirth).
    * Dual Sattvic Water: universal tears shed for all humanity (universal compassion).
    * Blind Faith (*Andha Vishwas*) & Divine Help (*Daiva Kripa*) house mandate: human calculation fails, only divine grace can rescue.
    * 12th House & Expenditure Mechanics: voluntary spiritual donation vs forced drainage, sleep quality, and bedroom sanctuary indicators (Jupiter/Sagittarius shrine presence vs Rahu/Venus nocturnal affliction).
    * Planetary behavior inside Pisces: Venus exalted (highest spiritual bliss, selfless love, divine marriage), Mercury debilitated (commercial logic drowns in ocean of faith; calculative blind spots), Saturn in Pisces (sustained silent service), Rahu in Pisces (fallen cunning).
  - [x] Implement Kalapurusha 12-House Energy Script Overlay:
    * Houses as fixed frames vs Signs as energy scripts.
    * Systematic evaluation mapping every house's sign to its natural Kalapurusha house position and generating the active behavioral script.
  - [x] Implement Elemental Immunity Hierarchy & Pathogen Resistance:
    * Fire (Agni Tattva): highest cellular heat, strongest disease resistance.
    * Earth (Prithvi Tattva): structural endurance, physical stability.
    * Air (Vayu Tattva): moderate; nervous & respiratory fluctuations.
    * Water (Jala Tattva): most vulnerable to contagious pathogens, fluid-borne illnesses, emotional contagion.
    * Water Ascendant Immunity Exception: if Water ascendant's lord sits in a Fire sign, immunity improves markedly.
  - [x] Implement Special Drishti Kalapurusha Archetype Resonance:
    * Saturn 3rd Aspect (Gemini/Effort - Arduous manual toil) & 10th Aspect (Capricorn/Duty - Nishkama Karma without ego).
    * Mars 4th Aspect (Cancer/Comfort - Forceful boundary intrusion) & 8th Aspect (Scorpio/Investigation - Surgical transformation).
    * Jupiter 5th Aspect (Leo/Creation - Loving parental nurture) & 9th Aspect (Sagittarius/Dharma - Expansion & divine fortune).
    * Rahu 5th/9th Aspect (Material magnification & obsession) & Ketu 5th/9th Aspect (Spiritual detachment & contraction).
    * Universal 7th Aspect across all grahas.
  - [x] Implement `generateMeenaKalapurushaDrishtiMasterReport(natalEphem, birthDate)`.

- [x] **Phase 41.2: Chatbot Prompt & Context System Parity (`src/engine/chatPrompt.ts` & `src/engine/chatContext.ts`)**
  - [x] `src/engine/chatPrompt.ts`: Add Rule `0AN` detailing Pisces Blind Faith mandate, Kalapurusha Script Overlay, Elemental Immunity Hierarchy, and Special Aspect archetypes.
  - [x] `src/engine/chatContext.ts`: Add Section 94 dossier (`meenaKalapurushaDrishtiSummary`).

- [x] **Phase 41.3: Chatbot UI Interceptor 33 (`src/components/AstroChatbot.tsx`)**
  - [x] Add fast regex interceptor 33 responding to "meena", "pisces", "blind faith", "andha vishwas", "daiva kripa", "kalapurusha overlay", "script overlay", "elemental immunity", "pathogen vulnerability", "saturn 3rd aspect", "mars 4th aspect", "special drishti".
  - [x] Add action chips for Pisces Blind Faith, Kalapurusha Script, Elemental Immunity, and Special Drishti Matrix.

- [x] **Phase 41.4: UI Interactive Deck in DashaView (`src/components/DashaView.tsx`)**
  - [x] Add Tab 16: **"🐟 Meena & Kalapurusha Script (मीन राशि, कालपुरुष लिपि व दृष्टि रहस्य)"** with interactive diagnostic cards.

- [x] **Phase 41.5: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Add Subtest 137 verifying Pisces house location, Kalapurusha 12-house script overlay, Elemental immunity hierarchy, and Special aspect resonance.
  - [x] Run `npm test` (all 137 tests passing).
  - [x] Run `npx tsc --noEmit` (0 errors).
  - [x] Run `npm run build` (clean Next.js production build).

---

# Phase 42: Planetary Exaltation & Debilitation Archetypes (Uchha & Neecha), Conscious Awareness vs. Blind Spot, Father-Son Inversion, and Transit Geometric Axes (Sessions 80 and 81)

## Overview & Trigger Keywords
- **Keywords:** `exaltation-debilitation-psychology`, `uchha-neecha-grahas`, `conscious-awareness-superpower`, `debilitation-blind-spot`, `lagnesha-protection-primacy`, `father-son-sun-saturn-inversion`, `transit-180-opposition-dominance`, `transit-3-11-upachaya-inspiration`, `transit-6-8-shadashtaka-friction`, `moon-venus-taurus-ethics`
- **Scope:**
  1. Archetypal Psychology of Dignities: Why planets exalt/debilitate where they do across all 7 classical planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn).
  2. Revolutionary Paradigm: Exaltation = High Conscious Awareness (*Chetana / Jagruti* from past life) vs. Debilitation = Blind Spot / Inexperience Area (humble conscious effort required, not doom).
  3. The Primacy of Lagnesha: The Ascendant Lord is the unbreakable chart protector, protecting the native and vitalizing its occupied house even if debilitated.
  4. Father-Son Inversion Axis: Sun exalts in Aries / debilitates in Libra; Saturn exalts in Libra / debilitates in Aries.
  5. Real-Time Transit Geometric Dynamics: 180° Direct Oppositions (dominance audit & leadership solutions), 3/11 Upachaya inspiration vectors, 6/8 Shadashtaka friction vectors, and Moon-Venus in Taurus relational ethics.

## Phases & Milestones

- [x] **Phase 42.1: Core Calculation Engine (`src/engine/uchhaNeechaAwareness.ts`)**
  - [x] Implement `PLANETARY_DIGNITY_PSYCHOLOGY` dictionary for 7 classical planets.
  - [x] Implement `evaluateNatalDignityAwareness(natalEphem)`:
    * Dignity classification (Exalted, Moolatrikona, Own, Friendly, Neutral, Enemy, Debilitated).
    * High Conscious Awareness superpower mappings for exalted grahas.
    * Blind Spot / Inexperience warning mappings & remedial mindfulness for debilitated grahas.
    * Lagnesha Primacy & Protection Shield Factor calculation.
    * Father-Son Sun/Saturn Inversion axis detection.
  - [x] Implement `evaluateTransitGeometricDynamics(natalEphem, transitEphem)`:
    * 180° Direct Opposition dominance evaluation (Dignity + Retrograde Chesta Bala) & leadership prescriptions.
    * 3/11 Upachaya inspiration & resource catalyst vectors.
    * 6/8 Shadashtaka moral friction & ideological tension vectors.
    * Moon-Venus in Taurus conjunction ethical audit.
  - [x] Implement `generateUchhaNeechaAwarenessMasterReport(natalEphem, transitEphem)`.

- [x] **Phase 42.2: Chatbot Prompt & Context System Parity (`src/engine/chatPrompt.ts` & `src/engine/chatContext.ts`)**
  - [x] `src/engine/chatPrompt.ts`: Add Rule `0AO` detailing Exaltation Awareness vs Debilitation Blind Spot, Lagnesha Protection, Father-Son Inversion, and Transit Geometric Axes.
  - [x] `src/engine/chatContext.ts`: Add Section 95 dossier (`uchhaNeechaAwarenessSummary`).

- [x] **Phase 42.3: Chatbot UI Fast Interceptor 34 (`src/components/AstroChatbot.tsx`)**
  - [x] Add 0ms client-side regex interceptor 34 matching exaltation/debilitation queries with 4 action chips.

- [x] **Phase 42.4: UI Interactive Deck Tab 17 in DashaView (`src/components/DashaView.tsx`)**
  - [x] Add Tab 17: **"⚖️ Uchha, Neecha & Transit Dynamics (उच्च-नीच चेतना, अंध-बिंदु व गोचर दृष्टि)"** with 4 interactive diagnostic cards.

- [x] **Phase 42.5: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Add Subtest 138 verifying all calculation formulas, dictionaries, transit vectors, and master dossier generator.
  - [x] Run `npm test` (all 138 tests passing).
  - [x] Run `npx tsc --noEmit` (0 errors).
  - [x] Run `npm run build` (clean Next.js production build).

---

# Phase 43: The Three Sages (Narada, Agastya, Durvasa), D-3 Drekkana Temperaments, Sacred Lineage Deities & 12-Sign Lord Blind Spots (Sessions 93, 94 & 95)

## Status: Complete & Verified (All 139 Tests Passing & Production Build Clean)
- **Keywords:** `three-sages-rishis`, `devarshi-narada`, `brahmarshi-agastya`, `maharshi-durvasa`, `drekkana-d3-temperaments`, `sacred-lineage-deities`, `kula-devata-elemental-propitiation`, `dharma-devata-9th`, `ishta-devata-12th`, `3rd-house-12yr-change-wave`, `paramochha-deep-exaltation-degrees`, `12-sign-lord-awareness-blind-spots`
- **Scope:**
  1. The Three Sages (Rishi) Modality Framework: Movable (Narada - mind/mobility), Fixed (Agastya - protection/grounded balance), Dual (Durvasa - discipline/intense penance/karmic burning).
  2. Parashari $10^\circ$ Drekkana Rishi Allocation Engine across all 9 planets + Lagna.
  3. Sacred Lineage of Houses (Deity Triad): 4th House Kula Devata (with Water/Fire/Earth/Air elemental propitiation), 9th House Dharma Devata, 12th House Ishta Devata.
  4. Life Axis of Entry and Exit: 3rd House 12-Year Change Wave ($Age = 3 + 12k$), 4th birth vs 8th transition release, and 3rd-to-9th Adhyatma-to-Dharma evolution.
  5. Deep Exaltation Degrees (*Paramochha Amsha*): Sun $10^\circ$ Aries, Moon $3^\circ$ Taurus, Jupiter $5^\circ$ Cancer, Mars $28^\circ$ Capricorn, Venus $27^\circ$ Pisces, Mercury $15^\circ$ Virgo, Saturn $20^\circ$ Libra.
  6. Sign-by-Sign Innate Awareness vs. Blind Spot Diagnostics: Analyzing the 12 signs through where their lord exalts (highest natural competence) and where it debilitates (inherent blind spot relative to the sign).

## Phases & Milestones

- [x] **Phase 43.1: Core Calculation Engine (`src/engine/rishiDrekkanaAwareness.ts`)**
  - [x] Implement `THREE_RISHIS_CONFIG` dictionary (Narada, Agastya, Durvasa).
  - [x] Implement `evaluateDrekkanaRishiAllocation(natalEphem)` for all 9 planets and Lagna.
  - [x] Implement `evaluateSacredLineageDeities(natalEphem)` with 4th-house elemental propitiation rules.
  - [x] Implement `evaluateLifeAxisAndEntryExit(natalEphem, currentDate)` with 3rd-house 12-year change cycles ($Age = 3 + 12k$).
  - [x] Implement `evaluateDeepDignityDegrees(natalEphem)` with Paramochha orb proximities.
  - [x] Implement `evaluateSignLordAwarenessBlindSpots(natalEphem)` covering all 12 signs (with focus on Lagna/Moon sign).
  - [x] Implement `generateRishiDrekkanaMasterReport(natalEphem, evaluationDate)`.

- [x] **Phase 43.2: Chatbot Prompt & Context System Parity (`src/engine/chatPrompt.ts` & `src/engine/chatContext.ts`)**
  - [x] `src/engine/chatPrompt.ts`: Add Rule `0AP` detailing Three Rishis D-3 Allocations, Sacred Lineage Deities, 3rd House 12-Year Change Cycles, and 12-Sign Lord Blind Spots.
  - [x] `src/engine/chatContext.ts`: Add Section 96 dossier (`rishiDrekkanaSummary`).

- [x] **Phase 43.3: Chatbot UI Fast Interceptor 35 (`src/components/AstroChatbot.tsx`)**
  - [x] Add 0ms client-side regex interceptor 35 matching Rishi Drekkana, Kula Devata, Paramochha, and 12-sign blind spot queries with 4 action chips.

- [x] **Phase 43.4: UI Interactive Deck Tab 18 in DashaView (`src/components/DashaView.tsx`)**
  - [x] Add Tab 18: **"🧘 Three Rishis & Sacred Lineage (त्रि-ऋषि द्रेष्काण, कुलदेवता व 12 राशि अंध-बिंदु)"** with 4 interactive diagnostic cards.

- [x] **Phase 43.5: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Add Subtest 139 verifying all formulas, Drekkana allocations, Kula Devata elemental rules, 12-year change cycles, Paramochha degrees, and sign-lord blind spots.
  - [x] Run `npm test` (all 139 tests passing).
  - [x] Run `npx tsc --noEmit` (0 errors).
  - [x] Run `npm run build` (clean Next.js production build).

---

# Phase 44: Proactive Astrological Chatbot Nerve Center, Bi-Directional Deep Linking & Multi-Engine Master Consultation Journeys

## Status: Complete & Verified (All 140 Tests Passing & Production Build Clean)
- **Keywords:** `proactive-chatbot-nerve-center`, `chat-to-ui-deep-linking`, `chart-aware-predictive-welcome`, `guided-master-consultation-journeys`, `inline-deeplink-badges`, `semantic-intent-expansion`
- **Scope:**
  1. Bi-Directional Chat-to-UI Tab Navigation: Decoupled custom event bus (`astro-switch-tab`) allowing chatbot responses to seamlessly switch and scroll to any of the 18 tabs in `DashaView.tsx`.
  2. Dynamic Chart-Aware Welcome & Predictive Alerts: Auto-inspects the native's chart upon opening chat, highlighting active 12-year change wave status, dominant Rishi archetype, Kula Devata propitiation, and Lagnesha superpower vs blind spot.
  3. Guided 1-Click Master Consultation Journeys (Fast-Path Interceptor 36): Synthesizes multiple engines for high-impact life domains:
     - 💼 Career & Wealth Master Audit (D10, Indu Lagna, 10th Lord Drekkana Sage, 2-4-8 Rule).
     - ⏳ Life Pivots & 12-Year Change Waves (3rd House Wave, Vimshottari Dasha, Nodal Returns).
     - 🪷 Sacred Lineage & Elemental Remedies (4th Kula Devata, 9th Dharma, 12th Ishta, 40-Day Rule).
     - ⚖️ Superpowers & Subconscious Blind Spots (Exaltation Awareness vs Debilitation Blind Spots, 12-Sign Lord Matrix).
     - 🛡️ Lagnesha Sovereign Shield (Lagna Lord Vitalization & Cancelled Doshas).
  4. Natural Language Semantic Keyword Expansion across Fast-Path Interceptors.
  5. Automated Verification in `tests/engine.test.mjs` (Subtest 140) and zero TypeScript errors.

## Phases & Milestones

- [x] **Phase 44.1: Bi-Directional Chat-to-UI Tab Switcher Engine (`src/components/DashaView.tsx`)**
  - [x] Add `id="dasha-deck-container"` and `astro-switch-tab` custom event listener in `DashaView.tsx` supporting all 18 tabs.

- [x] **Phase 44.2: Message Parser Deep Link Support & Chat Switcher Dispatcher (`src/components/AstroChatbot.tsx`)**
  - [x] Upgrade `parseMessageContent` to extract `deeplinks: { tabId: string; label: string }[]` from ````deeplinks ... ```` blocks.
  - [x] Add `switchDashboardTab(tabId)` dispatcher and render clickable deep-link buttons inside assistant messages.

- [x] **Phase 44.3: Dynamic Chart-Aware Welcome & Master Consultation Journey Quick Bar (`src/components/AstroChatbot.tsx`)**
  - [x] Implement `buildPersonalizedWelcomeMessage(natalEphem)` generating chart-specific highlights (12-year wave, dominant sage, Kula Devata, Lagna superpower).
  - [x] Add 1-tap "Master Journeys" quick-pill bar directly below category tabs.

- [x] **Phase 44.4: Master Consultation Journeys Interceptor 36 & Semantic Intent Expansion (`src/components/AstroChatbot.tsx`)**
  - [x] Add Interceptor 36 for Career & Wealth, Life Pivots, Sacred Lineage, Superpowers/Blind Spots, and Lagnesha Shield.
  - [x] Expand natural language synonyms in Interceptor 35, 34, 28, and 18 for everyday conversational queries.

- [x] **Phase 44.5: Automated Test Suite & Quality Gates (`tests/engine.test.mjs`)**
  - [x] Add Subtest 140 verifying `parseMessageContent` deeplink extraction, `buildPersonalizedWelcomeMessage`, and journey syntheses.
  - [x] Run `npm test` (all 140 tests passing).
  - [x] Run `npx tsc --noEmit` (0 errors).
  - [x] Run `npm run build` (clean Next.js production build).

---

# Phase 45: Root vs Fruit Divisional Projection Matrix & Navamsha Manifestation Timing Engine

## Status: Complete & Verified (All 141 Tests Passing & Production Build Clean)
- **Keywords:** `root-vs-fruit-matrix`, `divisional-projection-engine`, `navamsha-marriage-fruition`, `navamsha-career-fruition`, `saturn-dietary-nadi`, `sign-dasha-archetypes`, `zero-names-frontend-guarantee`
- **Scope:**
  1. Core Root-Fruit Projection Engine (`src/engine/rootFruitProjection.ts`):
     - D1 House Sign to D9 House Projection Matrix for all 12 houses (Seed vs Manifestation Fruit).
     - 7th House Marital Fruition Gate & Post-Marriage Turmoil Risk Assessment (D1 7th sign falling in D9 6th/8th/12th vs Lagna/Kendra).
     - 10th House Career Manifestation Gate (D1 10th sign falling in D9 4th = domestic sanctuary / remote architecture; Gemini career overhaul & transfer triggers).
     - Special Dietary & Fasting Nadi Rule (Saturn 2nd house in Rohini caloric restriction vs Bharani / other nakshatras).
     - Sign Dasha Functional Alignment (benefics, Yogakarakas, Marakas, and 6th/8th lords from running sign).
  2. Engine Cross-Linking:
     - Connect into `src/engine/rashiTulyaNavamsha.ts` and `src/engine/predictiveDecisionGates.ts`.
     - Expose to LLM system context in `src/engine/chatContext.ts` without personal names.
  3. Frontend UI Integration (`src/components/ShodashavargaView.tsx`):
     - Interactive Root vs Fruit Projection panel under RTN view displaying 12-house matrix, marriage fruition gate, career environment gate, and dietary markers.
     - Strict Zero-Name Policy: No personal/author names in UI or user-facing strings.
  4. Frontend UI Cleanups (`src/components/AstroChatbot.tsx` & `src/components/DashaView.tsx`):
     - Purge legacy author names from chatbot message generators and dashboard tab headings.
     - Add Fast-Path Interceptor 37 for instant answers to Root vs Fruit and Navamsha manifestation inquiries.
  5. Automated Verification in `tests/engine.test.mjs`:
     - Add Subtest 141 verifying mathematical projections, marriage gates, career gates, dietary logic, and zero personal names in UI outputs.
     - Ensure 100% test pass rate, 0 TypeScript errors, and clean Next.js build.

## Phases & Milestones

- [x] **Phase 45.1: Core Root-Fruit Projection & Navamsha Manifestation Engine (`src/engine/rootFruitProjection.ts`)**
  - [x] Implement `calculateD1D9RootFruitProjections(natalEphemeris: EphemerisResult): RootFruitProjectionResult`.
  - [x] Implement `evaluateMarriageFruition(natalEphemeris: EphemerisResult): MarriageFruitionResult`.
  - [x] Implement `evaluateCareerFruition(natalEphemeris: EphemerisResult): CareerFruitionResult`.
  - [x] Implement `evaluateSpecialDietaryNadiRule(natalEphemeris: EphemerisResult): DietaryNadiRuleResult`.
  - [x] Implement `evaluateSignDashaArchetypes(runningSignIndex: number, natalEphemeris: EphemerisResult): SignDashaArchetypeAnalysis`.

- [x] **Phase 45.2: Engine Cross-Linking & Chat Context (`src/engine/rashiTulyaNavamsha.ts` & `src/engine/chatContext.ts`)**
  - [x] Connect `rootFruitProjection` outputs into `evaluateRashiTulyaNavamsha()`.
  - [x] Add Section 80 (Root vs Fruit Matrix) to `chatContext.ts` with strict zero personal names.

- [x] **Phase 45.3: Frontend UI Integration & Zero-Name Compliance (`src/components/ShodashavargaView.tsx`)**
  - [x] Add dedicated Root vs Fruit interactive panel in RTN mode of `ShodashavargaView.tsx`.
  - [x] Render 12-house projection grid, marriage fruition gate, career environment architecture, and dietary/maturation markers.
  - [x] Enforce zero author/guru names across all UI labels.

- [x] **Phase 45.4: Frontend Cleanups & Fast-Path Interceptor 37 (`src/components/AstroChatbot.tsx` & `src/components/DashaView.tsx`)**
  - [x] Clean up legacy author references in `AstroChatbot.tsx` and `DashaView.tsx`.
  - [x] Add Fast-Path Interceptor 37 in `AstroChatbot.tsx` for Root vs Fruit / Navamsha Fruition queries.

- [x] **Phase 45.5: Automated Verification & Production Build (`tests/engine.test.mjs`)**
  - [x] Add Subtest 141 in `tests/engine.test.mjs`.
  - [x] Run `npm test` (all 141 tests passing).
  - [x] Run `npx tsc --noEmit` (0 errors).
  - [x] Run `npm run build` (clean Next.js production build).

---

# Phase 46: Unified Astrological Knowledge Base & Zero-Hallucination Vector RAG Architecture (Neon pgvector + Semantic Retrieval)

## Status: Complete & Verified (All 142 Tests Passing & Production Build Clean)
- **Keywords:** `astro-knowledge-rag`, `neon-pgvector`, `gemini-text-embeddings`, `grounded-retrieval-engine`, `zero-hallucination-gate`, `zero-names-frontend-guarantee`, `shastric-corpus-vectorization`
- **Scope:**
  1. Neon pgvector Infrastructure & Schema (`src/lib/vectorDb.ts`):
     - Initialize `pgvector` extension and table `astro_knowledge_chunks` with `vector(768)` embeddings, HNSW index, JSONB conditions, and source tags.
     - Provide fallback in-memory cosine similarity retrieval for offline / local-development reliability with zero database bloat.
  2. Universal Astrological Knowledge Corpus (`src/data/astroKnowledgeCorpus.ts`):
     - Exhaustive compilation of Shastric rules (BPHS, Jaimini, Phaladeepika, Saravali, Nadi classics), modern methodologies (Raman, KN Rao, CS Patel, Samir Tripathi, BTR), and advanced lecture techniques (Root vs Fruit, Name Vibrations, Maturation Ages, Medhaj series, D10 surroundings, Dietary Nadi rules).
     - Atomic chunking with structured metadata (house, planet, sign, varga, category, timing).
  3. Semantic Embedding & Ingestion Engine (`src/lib/embeddingService.ts`):
     - Batch embedding using Google Gemini embedding models (`gemini-embedding-001` / `gemini-embedding-2` with 768 dimensions).
     - Deterministic chunk hash idempotency to prevent redundant vector storage.
  4. Hybrid RAG Retrieval & Context Fusion (`src/lib/ragRetriever.ts` & `src/app/api/astro-chat/route.ts`):
     - Semantic query expansion combining user query with active horoscope facts.
     - Top-K cosine similarity retrieval with metadata pre-filtering.
     - Dynamic injection into chat prompt while stripping personal author names.
  5. Grounded Anti-Hallucination Guardrails (`src/engine/chatPrompt.ts`):
     - Implement Rule 0AQ (Grounded Verification Gate): strict mandate to cite retrieved Shastric principles and explicitly refuse to invent ungrounded predictions.
     - Enforce Strict Zero-Name Frontend Policy.
  6. Automated Verification Suite (`tests/engine.test.mjs`):
     - Subtest 142 testing corpus schema, vector similarity search, context fusion, and zero-name compliance.
     - Verify full test suite passing, 0 TypeScript errors, and clean Next.js build.

## Phases & Milestones

- [x] **Phase 46.1: Database Schema & Neon pgvector Infrastructure (`src/lib/vectorDb.ts`)**
  - [x] Implement `initVectorDb()` to execute idempotent table & index creation in Neon Postgres.
  - [x] Implement `upsertKnowledgeChunks(chunks)` and `searchSimilarRules(embedding, options)`.
  - [x] Implement client/in-memory fallback vector cosine similarity for zero-latency / offline resilience.

- [x] **Phase 46.2: Universal Astrological Knowledge Corpus (`src/data/astroKnowledgeCorpus.ts`)**
  - [x] Compile comprehensive knowledge nodes across Classical Shastras (BPHS, Jaimini, Phaladeepika, Saravali, Nadi texts).
  - [x] Compile modern techniques (Raman 300 yogas, KN Rao PAC-DARES, CS Patel RTN/Ashtakavarga, BTR triad).
  - [x] Compile lecture techniques (Root-Fruit matrix, 7th marriage gate, 10th career sanctuary, Saturn Rohini diet, Name vibrations, Age 36 retrograde, Medhaj series).
  - [x] Tag every node with structured conditions `{ houses, planets, signs, vargas, topics }`.

- [x] **Phase 46.3: Semantic Embedding Service (`src/lib/embeddingService.ts`)**
  - [x] Implement Gemini embedding models with 768-dimension normalization and error handling.
  - [x] Implement fast normalized cosine similarity calculation.
  - [x] Implement pre-calculated embeddings and seed script (`scripts/seedKnowledgeCorpus.ts`).

- [x] **Phase 46.4: RAG Retriever & Chat API Integration (`src/lib/ragRetriever.ts` & `src/app/api/astro-chat/route.ts`)**
  - [x] Implement `retrieveGroundedAstroKnowledge(query)` fusing query semantics with active chart factors.
  - [x] Integrate retrieved context into `astro-chat/route.ts` system prompt.
  - [x] Ensure strict adherence to Zero-Name Frontend rule via `sanitizeZeroNames()`.

- [x] **Phase 46.5: Anti-Hallucination Guardrails (`src/engine/chatPrompt.ts`)**
  - [x] Add Rule 0AQ (Grounded Shastric Verification Gate) to `buildChatSystemInstruction`.
  - [x] Enforce verification against retrieved rule nodes before making any predictive statement.

- [x] **Phase 46.6: Automated Regression Verification & Production Build (`tests/engine.test.mjs`)**
  - [x] Add Subtest 142 covering knowledge corpus validity, vector retrieval ranking, context fusion, and zero-name compliance.
  - [x] Run `npm test` to verify all 142 tests pass.
  - [x] Run `npx tsc --noEmit` to verify zero type errors.
  - [x] Run `npm run build` to verify production build.

---

# Phase 47: Cognitive AI Upgrade: Astrological HyDE, Neuro-Symbolic Arbitration & Two-Stage Chain of Classical Reasoning (CoCR)

## Status: Complete & Verified (All 143 Tests Passing & Production Build Clean)
- **Keywords:** `astrological-hyde`, `neuro-symbolic-arbitrator`, `composite-fulfillment-score`, `two-stage-cocr`, `consultation-state-graph`, `zero-hallucination-gate`, `zero-names-frontend-guarantee`
- **Scope:**
  1. Astrological HyDE (Hypothetical Chart-Query Entity Expansion) (`src/lib/ragRetriever.ts`):
     - Expand raw user queries with the native's active astrological placements (Lagna, relevant Bhavas, Lords, D9/D10 coordinates, active Dasha, SAV bindus) prior to vector search in Neon pgvector.
  2. Neuro-Symbolic Predictive Arbitration Engine (`src/engine/predictiveArbitrator.ts`):
     - Deterministic 6-Gate Arbitration Matrix: (1) D1 Seed, (2) D9 Fruit, (3) Dasha Window, (4) Double Transit Sanction, (5) Ashtakavarga Bindus, (6) Affliction/Bhanga Neutralization.
     - Compute unified Composite Fulfillment Score (0-100%) and Verdict Category to eliminate self-contradictory LLM statements.
  3. Two-Stage CoCR & Chat API Integration (`src/app/api/astro-chat/route.ts` & `src/engine/chatPrompt.ts`):
     - Inject pre-computed Arbitration Proof directly into the LLM system prompt.
     - Mandate that the assistant align its conversational narrative with the deterministic Composite Fulfillment Score.
  4. Multi-Turn Consultation State Graph (`src/engine/consultationState.ts`):
     - Track consultation domain, explored bhavas, diagnosed challenges, and already-prescribed remedies across conversational turns.
  5. Automated Verification Suite (`tests/engine.test.mjs`):
     - Add Subtest 143 covering HyDE expansion, 6-Gate arbitration, state graph transitions, and zero-name compliance.
     - Verify full test suite passing, 0 TypeScript errors, and clean Next.js build.

## Phases & Milestones

- [x] **Phase 47.1: Astrological HyDE Query Expansion (`src/lib/ragRetriever.ts`)**
  - [x] Implement `expandQueryWithChartEntities(query, natalEphemeris)` resolving relevant houses, lords, D9 positions, and dasha context.
  - [x] Fuse expanded entities into the vector embedding query sent to Neon pgvector.

- [x] **Phase 47.2: Neuro-Symbolic Predictive Arbitration Engine (`src/engine/predictiveArbitrator.ts`)**
  - [x] Implement `arbitratePredictiveQuery(domain, natalEphemeris, transitEphemeris, dashaResult)` calculating scores across all 6 Classical Gates.
  - [x] Generate deterministic `ArbitrationProof` with Composite Fulfillment Score (0-100%), Active Timing Window, and Primary Classical Driver.

- [x] **Phase 47.3: Two-Stage CoCR & Chat API Integration (`src/app/api/astro-chat/route.ts` & `src/engine/chatPrompt.ts`)**
  - [x] Incorporate `arbitratePredictiveQuery` into `POST /api/astro-chat`.
  - [x] Add Rule 0AR (Neuro-Symbolic Arbitration Alignment) to `buildChatSystemInstruction`.

- [x] **Phase 47.4: Multi-Turn Consultation State Graph (`src/engine/consultationState.ts`)**
  - [x] Implement `updateConsultationState(prevState, newMessages, currentReading)` tracking explored domains and prescribed remedies.
  - [x] Prevent repetitive advice loops across multi-turn chats.

- [x] **Phase 47.5: Automated Regression Verification & Production Build (`tests/engine.test.mjs`)**
  - [x] Add Subtest 143 verifying HyDE expansion, 6-Gate composite scoring, consultation state graph, and zero-name compliance.
  - [x] Run `npm test` to verify all 143 tests pass.
  - [x] Run `npx tsc --noEmit` to verify zero type errors.
  - [x] Run `npm run build` to verify production build.

---

# Phase 48: Human-in-the-Loop Active Learning & Chat Feedback Architecture (RLHF / HITL Correction Loop)

## Status: Complete & Verified (All 144 Tests Passing & Production Build Clean)
- **Keywords:** `human-in-the-loop`, `rlhf-feedback-loop`, `active-learning-corrections`, `neon-feedback-table`, `golden-precedent-rag`, `zero-names-frontend-guarantee`
- **Scope:**
  1. Neon Postgres Table (`chat_feedback_corrections`) & Data Access Layer (`src/lib/feedbackDb.ts`):
     - Store micro-feedback (`helpful`, `inaccurate`, `correction`), categories, user corrections, chart context, domain, and vector embedding.
     - Dual-tier local JSON fallback cache (`data/chat_feedback_db.json`) ensuring resilience.
  2. Next.js API Routes (`/api/chat-feedback`):
     - `POST /api/chat-feedback` validating payload, generating text embeddings for user corrections, and inserting into Neon Postgres.
     - `GET /api/chat-feedback` retrieving stats and recent feedback for auditing.
  3. Dynamic In-Session State Graph (`src/engine/consultationState.ts`):
     - Support `activeCorrections` in `ConsultationStateGraph` to immediately prevent repetition of disputed claims within the ongoing conversation.
     - Inject active user corrections as authoritative axioms for subsequent turns.
  4. Vector Precedent RAG Retriever Integration (`src/lib/ragRetriever.ts`):
     - Retrieve verified user corrections / golden precedents matching the query and inject them as `HISTORICAL SHASTRIC CORRECTION PRECEDENTS`.
  5. UI Micro-Feedback Actions & Shastric Correction Modal (`src/components/AstroChatbot.tsx`):
     - Render 👍 (Helpful) and 👎/✏️ (Suggest Correction) on all assistant message cards.
     - Interactive slide-down / modal with category selectors (`Wrong House/Lord`, `Contradictory Timing`, `Incorrect Remedy`, `Calculation Discrepancy`, `Other`), text area, and submit action.
  6. Automated Verification Suite (`tests/engine.test.mjs`):
     - Add Subtest 144 covering feedback validation, state graph correction integration, RAG precedent formatting, and zero-name compliance.
     - Run `npm test`, `npx tsc --noEmit`, and `npm run build`.

## Phases & Milestones

- [x] **Phase 48.1: Neon Postgres Database Layer (`src/lib/feedbackDb.ts`)**
  - [x] Implement `initFeedbackDb()` creating `chat_feedback_corrections` table and indexes.
  - [x] Implement `saveChatFeedback()` with Neon SQL query and local JSON fallback.
  - [x] Implement `getVerifiedPrecedentCorrections()` for vector retrieval.

- [x] **Phase 48.2: Next.js Feedback API Endpoint (`src/app/api/chat-feedback/route.ts`)**
  - [x] Implement `POST /api/chat-feedback` with validation, embedding generation, and error handling.
  - [x] Implement `GET /api/chat-feedback` for admin audit and statistics.

- [x] **Phase 48.3: Dynamic In-Session State Graph (`src/engine/consultationState.ts`)**
  - [x] Add `activeCorrections` to `ConsultationStateGraph`.
  - [x] Update `buildConsultationState` and `formatConsultationStateBlock` to inject active user corrections as hard axioms.

- [x] **Phase 48.4: Vector Precedent Integration in RAG Retriever (`src/lib/ragRetriever.ts`)**
  - [x] Query and fuse verified golden precedents into system prompt context.
  - [x] Add Rule 0AS to `src/engine/chatPrompt.ts` enforcing precedent adherence.

- [x] **Phase 48.5: Chatbot UI Micro-Feedback & Correction Modal (`src/components/AstroChatbot.tsx`)**
  - [x] Add feedback buttons (👍 / 👎 / ✏️) to assistant message cards.
  - [x] Build interactive correction form with category picker and text input.
  - [x] Link submitted corrections into active session state.

- [x] **Phase 48.6: Automated Regression Verification Suite & Production Build (`tests/engine.test.mjs`)**
  - [x] Add Subtest 144 verifying feedback storage, state graph correction injection, and zero-name compliance.
  - [x] Run `npm test` verifying 144/144 tests pass.
  - [x] Run `npx tsc --noEmit` verifying 0 type errors.
  - [x] Run `npm run build` verifying clean production build.