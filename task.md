# Task: Full Mobile-First Responsive Architecture Overhaul

- [x] Phase 1: Global Viewport, Safe-Area & Mobile Shell <!-- id: 1 -->
  - [x] Add mobile viewport meta & safe-area in `layout.tsx` and `globals.css` <!-- id: 1.1 -->
  - [x] Create `src/components/MobileBottomNav.tsx` persistent mobile navigation dock <!-- id: 1.2 -->
  - [x] Refactor `HeaderNav.tsx` with mobile sticky header + Settings Drawer <!-- id: 1.3 -->

- [x] Phase 2: Core Charts & Time Travel Touch Ergonomics <!-- id: 2 -->
  - [x] Adapt `TimeTravelSlider.tsx` for compact touch scrubbing & datetime picker <!-- id: 2.1 -->
  - [x] Optimize `KundliChart.tsx` SVG fluid scaling & multi-planet touch badges <!-- id: 2.2 -->
  - [x] Optimize `ShodashavargaView.tsx` with snap-scroll 16-Varga pills & mobile tabs <!-- id: 2.3 -->

- [x] Phase 3: Strength Systems, Bar Charts & Tables <!-- id: 3 -->
  - [x] Add horizontal snap carousels and mobile bar scaling to `ShadbalaView.tsx` <!-- id: 3.1 -->
  - [x] Add horizontal snap carousels and mobile bar scaling to `BhavaBalaView.tsx` <!-- id: 3.2 -->
  - [x] Add sticky first columns and touch scroll to Ashtakavarga & Numerology <!-- id: 3.3 -->

- [x] Phase 4: Verification & Deployment <!-- id: 4 -->
  - [x] Run `npm test` (All 9 test suites passing) <!-- id: 4.1 -->
  - [x] Commit and push to GitHub repository for Vercel deployment <!-- id: 4.2 -->