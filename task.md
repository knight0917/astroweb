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