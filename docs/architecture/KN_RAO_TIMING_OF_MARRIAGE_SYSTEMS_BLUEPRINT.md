# 💍 K.N. Rao: Astrology and Timing of Marriage — Systems Blueprint
**Based on Ingestion of:**
- *Astrology and Timing of Marriage* (2008) by **K.N. Rao** and Bharatiya Vidya Bhavan (BVB) Research Group
- *Predicting Marriage Through Jaimini Chara Dasha* & *Vimshottari Dasha in Marital Events* (K.N. Rao)

---

## 1. Executive Summary & Foundational Paradigm

In Vedic astrology, marriage (*Vivaha*) is the most momentous socio-karmic transition of human adulthood. Sri K.N. Rao revolutionized marital predictive astrology by replacing vague guesswork with a **3-Tier Composite Predictive Filter**:

```
                              ┌─────────────────────────────────────────────────────────┐
                              │            K.N. RAO 3-TIER MARITAL FILTER               │
                              └───────────────────────────┬─────────────────────────────┘
                                                          │
                 ┌────────────────────────────────────────┼────────────────────────────────────────┐
                 ▼                                        ▼                                        ▼
       TIER 1: NATAL PROMISE                    TIER 2: DUAL DASHA WINDOW                TIER 3: DOUBLE TRANSIT (DTP)
   D1 + D9 + Jaimini DK & UL                Vimshottari + Jaimini Chara Dasha           Saturn (Field) + Jupiter (Sanction)
 [Early / Normal / Delayed / Denied]      [7th Lord / Venus / D9-7th / DK / UL]       [Simultaneous aspects on 7th/1st/Lords]
```

---

## 2. Tier 1: Natal Promise & Age-Classification Matrix

K.N. Rao classifies marital timing into four distinct karmic bands:

| Marital Band | Typical Age Range | Astrological Signatures (D1 & D9) |
| :--- | :--- | :--- |
| **Early Marriage** | 18 – 24 Years | Benefics in 7th or aspecting 7th; Venus in fast movable sign in Kendra; 7th lord strong without Saturn/Rahu affliction; D9 Lagna strong. |
| **Normal / Timely** | 25 – 29 Years | Moderate mix of benefic/malefic influences; 7th lord in Kendra/Trikona; Dasha of 7th lord or Venus operating in late twenties. |
| **Delayed Marriage** | 30 – 38+ Years | Saturn or Rahu in/aspecting 7th house; 7th lord retrograde, combust, or in 6th/8th/12th; Sun-Saturn axis on 1-7; Venus afflicted by Mars/Saturn. |
| **Denial / Celibacy** | Unmarried / Ascetic | 7th lord severely afflicted in 6th/8th without benefic aspects; Venus combust with Saturn/Rahu in 8th/12th; D9 7th house heavily damaged; Upapada Lagna afflicted. |

---

## 3. Tier 2: The Dual Dasha Operating Window

According to K.N. Rao, an event is only confirmed when BOTH planetary (Vimshottari) and sign-based (Chara) timelines agree:

### A. Vimshottari Dasha Qualified Lords for Marriage:
1. **7th House Lord** (from Natal Lagna, Moon Lagna, or Sun Lagna).
2. **Planets posited in the 7th House** or **Aspecting the 7th House**.
3. **Lagna Lord (1st Lord)** or planets in the 1st House.
4. **Natural Karaka Venus** (and Jupiter for females).
5. **Navamsha (D9) Lagna Lord** or **Navamsha (D9) 7th Lord**.
6. **2nd Lord (Kutumbadhipati)** — family expansion and lineage building.
7. **Dispositor of the 7th Lord**.

### B. Jaimini Chara Dasha Qualified Rashis for Marriage:
1. Rashi containing the **Darakaraka (DK)**.
2. Rashi aspecting (via **Rashi Drishti**) the **Darakaraka (DK)**.
3. Rashi containing or aspecting **Upapada Lagna (UL)** or **Dara Pada (A7)**.
4. The **7th House from Lagna** or the **7th House from Atmakaraka (AK)**.

---

## 4. Tier 3: The Double Transit Trigger (Saturn + Jupiter Concurrence)

No marriage ceremony takes place without the simultaneous Gochar sanction:
- **Saturn Transit (Karmic Duty & Physical Field)**: Must aspect or occupy:
  - Natal 7th House, Natal 7th Lord, Natal Lagna, or Natal Lagna Lord.
- **Jupiter Transit (Divine Blessing & Social Sanction)**: Must aspect or occupy:
  - Natal 7th House, Natal 7th Lord, Natal Lagna, Natal Lagna Lord, or Natal Venus.
- **Monthly Catalyst (Mars / Moon / Sun)**: Touches the 1-7 axis in transit to fix the exact date of marriage.

---

## 5. Engineering Implementation Strategy for Vedic Sky Tracker

1. **`src/engine/marriageTiming.ts` (NEW)**:
   - **Marital Promise & Delay Analyzer**: Evaluates early, normal, delayed, or complex marital karma.
   - **Vimshottari Marital Dasha Qualifier**: Checks running Mahadasha/Antardasha/Pratyantardasha against the 7 classical Rao marital criteria.
   - **Jaimini Chara Marital Dasha Qualifier**: Checks active Chara Dasha rashi against DK, UL, A7, and 7th house aspects.
   - **Double Transit Marital Readiness**: Evaluates Saturn & Jupiter real-time Gochar intersection on the marital axis.
   - **Comprehensive Marital Synthesis Score (0-100%)**: Computes composite timing readiness.

2. **`src/components/MarriageTimingDeck.tsx` (NEW)**:
   - Interactive Marriage Timing Dashboard:
     - 3-Tier Filter Visual Cards (Promise, Dual Dasha Window, Double Transit Trigger).
     - Live Marriage Readiness Gauge (0-100%).
     - D1 vs D9 Navamsha & Upapada Lagna (UL) Marital Matrix.

3. **`src/components/BhavaBalaView.tsx` (UPGRADED)**:
   - Add **💍 Timing of Marriage (K.N. Rao)** navigation tab.

4. **`src/engine/chatContext.ts` (Dossier 2.8 Upgrade)**:
   - Ingest Section 18: **K.N. Rao Marriage Timing, Dual Dasha & Double Transit Dossier**.

5. **`tests/engine.test.mjs` (Test #29)**:
   - Automated unit test suite verifying Marital Timing calculation and event triggers.

---

*Authored by Antigravity Systems Architect — Grounded in K.N. Rao\\'s Landmark 2008 Treatise.*
