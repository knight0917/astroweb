# Vedic Astrology AI Chatbot Pro ("Acharya Jyotish AI Pro") Development Tasks

## Phase 1: Astrological Context & Multi-Varga Intelligence (`src/engine/chatContext.ts`)
- [x] Integrate D9 Navamsha (Dharma/Spouse) and D10 Dashamsha (Career/Status) into the AI Astrological Dossier.
- [x] Inject Shadbala planetary strength rankings, Ashtakavarga house scores, and Jaimini Karakas (AK, AmK, DK) into the context.
- [x] Incorporate Jupiter and Saturn transit intersection (Double-Transit event timing principle).

## Phase 2: Consultation Categories & Domain Modes (`src/components/AstroChatbot.tsx`)
- [x] Add Consultation Topic Pills: `[💼 Career & Wealth]`, `[💍 Marriage & Compatibility]`, `[🪐 Sade Sati & Karmic Doshas]`, `[🧘 Health & Vitality]`, `[💎 Gemstone & Mantras]`, `[👶 Education & Children]`.
- [x] Expand the Quick Question Prompt Bank with 20+ authentic classical inquiries in English and Hindi.

## Phase 3: Interactive UI, Timing Gauges & Remedy Cards
- [x] Render visual Graha & House evidence badges inside chat responses.
- [x] Render timing indicator pills (Favorable Period / Preparation Period / Caution Period).
- [x] Add structured Remedy Cards with copyable daily mantra and charity checklists.

## Phase 4: Voice Speech Audio (TTS) & PDF Consultation Report
- [x] Implement Speech Synthesis audio reader (`🔊 Listen to Acharya`).
- [x] Add one-click PDF / Markdown Consultation Summary Export.

## Phase 5: Verification & Multi-Device Testing
- [x] Add automated test suites in `tests/engine.test.mjs`.
- [x] Run full build verification (`npx tsc --noEmit` and `npm test`).
- [x] Push to GitHub repository.

## Phase 6: Rashi Tulya Navamsha (RTN) Cross-Varga Dual Overlay & UI Cleansing
- [x] Remove leftover 'Deva Keralam & C.S. Patel' text from chart banner and right framework card in `src/components/ShodashavargaView.tsx`.
- [x] Compute D-1 Natal house occupants alongside D-9 Navamsha occupants in RTN mode.
- [x] Render both D-1 (Physical/Natal) and D-9 (Soul/Navamsha) planet badges in the RTN North and South Indian chart canvases with distinct color-coding (`[D1]` Sky/Indigo vs `[D9]` Amber/Gold).
- [x] Add interactive layer filter toggle: `[All (D1 + D9)]`, `[D9 Navamsha]`, `[D1 Natal]` with default to combined view.
- [x] Enrich cross-varga conjunctions in the right panel to report D1-D9 cross-varga overlays.
- [x] Verify with `npm test` (101/101 test suites passing).

## Phase 7: Home Page Traditional Kundli Chart Priority & Superpowers Strip Removal
- [x] Remove `QuickHighlightsBar` from `src/app/page.tsx`.
- [x] Ensure `viewMode` defaults cleanly to `kundli-north` (Traditional Kundli Chart).
- [x] Wire VEDIC SKY AI logo click in `src/components/HeaderNav.tsx` to return home to `kundli-north`.
- [x] Run full test verification (`npm test` 101/101 passing).

## Phase 8: Classical Marriage Destiny Gate & Fatal Veto Engine (विवाह निर्णय)
- [x] Implement Rajju Koota (Sira, Kantha, Kati, Uru, Pada) in `src/engine/matchmaking.ts` with *Prasna Marga* & Raman citations.
- [x] Implement Vedha Koota (mutually prohibited Nakshatra pairs) and Stree Deergha.
- [x] Implement Upapada Lagna (UL) 6/8 and 2/12 mutual compatibility evaluation per *BPHS*.
- [x] Build deterministic `MarriageDestinyVerdict` matrix to fail loud with a definitive "NO / NOT DESTINED" when fatal vetoes exist, overriding naive Guna scores.
- [x] Upgrade `src/components/MatchmakingView.tsx` with a top Decision Banner and a Classical Fatal Vetoes & Shastric Citations card.
- [x] Add unit test suite in `tests/engine.test.mjs` and verify full test pass (`npm test`).

## Phase 9: Chatbot Marriage Destiny Gate & Fatal Veto Enforcement (`chatContext.ts` & `chatPrompt.ts`)
- [x] Inject complete `destinyVerdict`, `rajju`, `vedha`, `streeDeergha`, and `upapadaMatch` into Section 24 of `src/engine/chatContext.ts`.
- [x] Implement Rule 0Q in `src/engine/chatPrompt.ts` commanding the Chatbot to enforce the Classical Marriage Destiny Gate (*Vivaha Nirnaya*), issue a definitive "NO / NOT DESTINED" on active fatal vetoes, and cite *Muhurta Chintamani*, *Prasna Marga*, *BPHS*, and *Dr. B.V. Raman*.
- [x] Add the "Will We Get Married? (Classical Destiny Gate)" prompt to `TOPIC_PROMPT_BANKS` in `src/components/AstroChatbot.tsx`.
- [x] Add unit test in `tests/engine.test.mjs` verifying chatbot context & prompt rule 0Q integration.
- [x] Verify full test suite pass (`npm test`).

## Phase 10: Classical BPHS Chapters 83–96 Codification (Pūrva Janma Shāpas & Arishta Janma Shāntis)
- [x] Implement `src/engine/bphsKarmicShanti.ts` codifying the 8 Pūrva Janma Shāpas (Sarpa, Pitri, Matri, Bhratri, Matula, Brahmana, Patni, Preta) per BPHS Ch. 83 with authentic Parashara remedies.
- [x] Implement BPHS Ch. 85–96 Arishta Janma diagnostics (Gandānta: Lagna, Nakshatra, Tithi; Abhukta Mūla; Jyeshthā Gandānta; Amāvāsyā; Krishna Chaturdashi 6 sextiles; Eclipse birth; Sankrānti; Bhadrā/Vishti; Trik Prasava) with classical Vedic pacification rituals.
- [x] Create UI deck `src/components/BphsKarmicShantiDeck.tsx` and integrate it into `BhavaBalaView.tsx` and `BphsCoreDeck.tsx`.
- [x] Inject Dossier 74 into `src/engine/chatContext.ts` and add Rule 0R into `src/engine/chatPrompt.ts` commanding the Chatbot to enforce BPHS Karmic Curses & Arishta Janma remedies.
## Phase 11: Layperson Comprehensive Kundli Life Report Page & PDF Export Suite
- [x] Implement `src/engine/laypersonReportEngine.ts` translating technical ephemeris math into plain-English, empathetic life insights.
- [x] Create `src/components/BirthDetailsModal.tsx` for clean birth data intake with geocoding.
- [x] Create dedicated Next.js route `src/app/report/page.tsx` and `src/components/ComprehensiveReportView.tsx`.
- [x] Add publication-grade `@media print` CSS rules in `src/app/globals.css`.
- [x] Integrate navigation trigger `[✨ Kundli Life Report]` in `src/components/HeaderNav.tsx`.
- [x] Fix timezone-aware civil birth date & time formatting to prevent client browser locale drift.
- [x] Add automated test suite in `tests/engine.test.mjs` (108/108 tests passing).

## Phase 12: Observable Real-World Personality & Nakshatra Psychology in Cosmic Essence
- [x] Implement `ASCENDANT_OBSERVABLE_TRAITS` for all 12 signs in `src/engine/laypersonReportEngine.ts` (physical demeanor, social presence, first impressions).
- [x] Implement `MOON_NAKSHATRA_EMOTIONAL_PROFILES` for all 27 Nakshatras in `src/engine/laypersonReportEngine.ts` (internal emotional engine, passions, relational triggers, stress response, and signature strengths e.g. Bharani intense loyalty/endurance vs Uttara Phalguni noble service/dignity).
- [x] Implement `SUN_CONSCIOUS_DRIVE_TRAITS` and expand Lagna Lord House Focus.
- [x] Synthesize deep multi-dimensional `cosmicEssence` and add structured `essenceBreakdown` in `LaypersonReport`.
- [x] Enhance UI in `src/components/ComprehensiveReportView.tsx` with dedicated micro-cards for Outer Demeanor, Emotional Engine, Conscious Will, and Life Arena.
- [x] Add automated test in `tests/engine.test.mjs` verifying observable trait generation for Bharani and Uttara Phalguni.
- [x] Run full test verification (`npm test` 109/109 passing and `npx tsc --noEmit` passing) and push to Git.

## Phase 13: Ashtakavarga Purushartha Disambiguation & Cardinal Power Zone UX
- [x] Extend `ashtakavarga.purusharthas` in `src/engine/laypersonReportEngine.ts` with classical elements (`Fire/Agni`, `Earth/Prithvi`, etc.) and a deep `dominantPillar` psychological analysis.
- [x] Add `dominantDirectionSummary` in `functionalDirections` explaining compound Cardinal Power Zones (e.g. East for Sun, Saturn, and Mars).
- [x] Update Chapter 04 in `src/components/ComprehensiveReportView.tsx` to display elements instead of confusing compass directions on the 4 Purushartha cards.
- [x] Add the "Dominant Life Pillar: Dharma (Purpose & Integrity)" card explaining the real-world impact of scoring 92 points (27%).
- [x] Add the Cardinal Power Zone explanatory banner above the Functional Directions grid.
- [x] Add automated test in `tests/engine.test.mjs` verifying Purushartha element mapping and dominant pillar logic.
- [x] Run full test suite (`npm test` 110/110 passing), verify types (`npx tsc --noEmit` passing), and commit & push to Git.

## Phase 14: 6-Module Full-Spectrum Expansion of the Kundli Life Report
- [x] Implement engine calculations in `src/engine/laypersonReportEngine.ts`:
  - `destinyTimeline`: Past turning points, active age trigger, future golden windows.
  - `karmicWeather`: Shani Sade Sati status/phase & end dates, Guru Gochara blessing, Rahu-Ketu nodal axis.
  - `sacredPartner`: D9 Navamsha 7th house & Darakaraka spouse profile, Upapada Lagna harmony remedy.
  - `wealthYogas`: Active Raja & Dhana Yogas, Indu Lagna wealth pivot.
  - `ishtaDevata`: Jaimini Karakamsa 12th house liberation archetype, primary mantra, Dharma Devata.
  - `pocketCard`: High-density executive cheat-sheet payload.
- [x] Implement UI chapters in `src/components/ComprehensiveReportView.tsx` with high-impact cards, badges, and print-ready styling.
- [x] Add unit test suite in `tests/engine.test.mjs` verifying all 6 modules.
- [x] Run full test suite (`npm test` 111/111 passing), verify types (`npx tsc --noEmit` passing), and commit & push to Git.

## Phase 15: Classical Gochara Vedha, Rahu Conjunctions Master & Cross-System Parity
- [x] Upgrade `src/engine/gochar.ts` with Gochara Vedha:
  - [x] Define `VEDHA_MAPPINGS` (Phaladeepika Ch. 26) for all 7 planets.
  - [x] Implement Father-Son immunity checks (Sun $\leftrightarrow$ Saturn, Moon $\leftrightarrow$ Mercury).
  - [x] Implement direct Vedha (auspicious transit blocked) and Vipareeta Vedha (inauspicious transit shielded).
  - [x] Extend `PlanetTransitInfo` with obstruction fields and net efficacy verdicts.
- [x] Build `src/engine/rahuConjunctionsMaster.ts`:
  - [x] Codify Rahu & Ketu conjunctions with Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn.
  - [x] Compute exact separation orbs (deep eclipse $\le 3.5^\circ$, potent $\le 7^\circ$, wide $\le 12^\circ$).
  - [x] Provide Acharya Vishnukripa psychological profiles, career superpowers, and authentic Shastric remedies.
- [x] Implement Cross-System Synchronization:
  - [x] Sync Gochara Vedha & Rahu Conjunctions into `src/engine/chatContext.ts` (Sections 75 & 76).
  - [x] Sync Phase 14 Life Report modules (Timeline, Sacred Partner, Indu Lagna, Ishta Devata, Pocket Card) into `src/engine/chatContext.ts` (Section 77).
  - [x] Surface Gochara Vedha badges and Rahu Conjunctions cards in `src/components/ComprehensiveReportView.tsx`.
- [x] Verification & Release:
  - [x] Add unit test suite in `tests/engine.test.mjs` verifying Vedha rules, immunity exceptions, and Rahu conjunction orbs.
  - [x] Run full test suite (`npm test`), verify types (`npx tsc --noEmit`), and commit & push to Git.

## Phase 16: Classical Progeny, Children & Saptamsha (D-7) Master Suite (संतान निर्णय)
- [x] Build `src/engine/progenyMaster.ts`:
  - [x] Implement gender-sensitive Beeja Sphuta (Male) & Kshetra Sphuta (Female) algorithms with Rashi/Navamsha oddity tests and malefic affliction orbs.
  - [x] Implement Saptamsha (D-7) division and classical *Manduka Gati* (Frog's leap) pregnancy progression for both Odd and Even D-7 Lagnas.
  - [x] Profile individual child pregnancies (ruling lord, gender tendencies, vitality, and parent-child *Sambandha*).
  - [x] Implement Shastric progeny impediments (Eunuch trines, barren trines, Dutta Putra adoption markers) and authentic Parashari remedies (*Santana Gopala*, *Harivamsa Purana*).
- [x] Implement Cross-System Synchronization:
  - [x] Inject Section 78 (*Progeny & Saptamsha Santana Nirnaya*) into `src/engine/chatContext.ts`.
  - [x] Codify Rule 0T (*Classical Progeny & Saptamsha Protocol*) into `src/engine/chatPrompt.ts`.
  - [x] Integrate `progenyBlueprint` into `src/engine/laypersonReportEngine.ts`.
  - [x] Render the Children & Lineage Blueprint card in `src/components/ComprehensiveReportView.tsx`.
- [x] Verification & Release:
  - [x] Add unit test suite in `tests/engine.test.mjs` verifying Beeja/Kshetra Sphuta, D-7 Manduka Gati progression, gender classification, and chatbot parity.
  - [x] Run full test suite (`npm test`), verify types (`npx tsc --noEmit`), and push to Git.

## Phase 17: Chatbot Full-Spectrum Intent Synchronization & Instant Interceptor Expansion
- [x] Upgrade `src/engine/chatContext.ts`:
  - [x] Extend `AstroConsultationIntent` with `"progeny_children"`.
  - [x] Enhance `detectConsultationIntent` with progeny, child, fertility, and Santana keywords.
  - [x] Implement `"progeny_children"` slice bundling Sections 78, 74, 20, 66, 17, 71.
  - [x] Enrich `"career"` slice with Section 75 (Vedha) and Section 76 (Rahu Conjunctions).
  - [x] Enrich `"marriage"` slice with Section 74 (Curses), Section 75 (Vedha), Section 76 (Rahu Conjunctions).
  - [x] Enrich `"remedies_health"` slice with Section 74 (Shantis), Section 75 (Vedha Shields), Section 76 (Rahu Remedies).
- [x] Expand `src/components/AstroChatbot.tsx`:
  - [x] Add Beeja / Kshetra Sphuta instant calculation to `tryInstantEngineAnswer` (0ms, 0 tokens).
  - [x] Add Gochara Vedha status instant calculation to `tryInstantEngineAnswer` (0ms, 0 tokens).
  - [x] Add Ishta Devata & Karakamsha instant calculation to `tryInstantEngineAnswer` (0ms, 0 tokens).
  - [x] Add quick prompts for Beeja/Kshetra and Gochara Vedha in category decks.
- [x] Verification & Release:
  - [x] Add unit test suite in `tests/engine.test.mjs` verifying intent detection and slice contents.
  - [x] Run full test suite (`npm test`), verify types (`npx tsc --noEmit`), and commit & push to Git.