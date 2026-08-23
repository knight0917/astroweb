# Task: Classical Parashari Shodashavarga (16 Divisional Charts)

- [x] Phase 1: Calculations Reference & Engine <!-- id: 1 -->
  - [x] Create calculation documentation `docs/SHODASHAVARGA_CALCULATIONS.md` <!-- id: 1.1 -->
  - [x] Implement `src/engine/shodashavarga.ts` with all 16 Parashari Vargas (D1 to D60) <!-- id: 1.2 -->
  - [x] Add unit tests in `tests/engine.test.mjs` <!-- id: 1.3 -->

- [x] Phase 2: Visualizer UI & Kundli Button <!-- id: 2 -->
  - [x] Build `src/components/ShodashavargaView.tsx` with 16-Varga pills, North/South rendering, and Vargottama detection <!-- id: 2.1 -->
  - [x] Add "✨ Shodashavarga (16 Charts)" button to `KundliChart.tsx` <!-- id: 2.2 -->
  - [x] Integrate ViewMode in `useAstroStore.ts`, `HeaderNav.tsx`, and `app/page.tsx` <!-- id: 2.3 -->

- [x] Phase 3: Verification & Deployment <!-- id: 3 -->
  - [x] Run `npm test` (All 7 test suites passing) <!-- id: 3.1 -->
  - [x] Commit and push to GitHub repository for Vercel deployment <!-- id: 3.2 -->