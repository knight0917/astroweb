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