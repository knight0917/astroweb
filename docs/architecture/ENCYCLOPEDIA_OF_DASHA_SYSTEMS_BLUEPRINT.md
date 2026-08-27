# ⏳ Encyclopedia of Vedic Astrology: Dasha Systems & Yogini Dasha — Systems Blueprint
**Based on Ingestion of:**
- *Encyclopedia of Vedic Astrology: Dasha Systems* by **Dr. Shanker Adawal**
- Classical Parashari Dasha treatises (BPHS Chapters 46–50 & Dasa Phala Darpan)

---

## 1. Executive Summary & Multi-Dasha Architecture

While **Vimshottari Dasha (120 Years)** is the general sovereign clock of Kali Yuga, Maharshi Parashara specified 42+ specialized Dasha systems to be applied under specific astrological conditions or for specific life sectors:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PARASHARI MULTI-DASHA ARSENAL                                   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Universal Standard: Vimshottari Dasha (120-Year Nakshatra Cycle)                    │
│ 2. Tantric & Event Catalyst: Yogini Dasha (36-Year 8-Yogini Cycle)                     │
│ 3. Conditional Mahadashas: Ashtottari (108y), Dwisaptati (72y), Chaturashiti (84y)     │
│ 4. Conditional Eligibility Engine: Tests natal chart against 8 classical prerequisites  │
│ 5. Multi-Dasha Triangulation: Synchronizes Vimshottari + Yogini + Active Conditional   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Yogini Dasha (36-Year Precise Tantric Cycle)

Yogini Dasha is the most widely practiced companion to Vimshottari Dasha, renowned for fast timing and health/spiritual fructification:

| Yogini | Lord | Duration | Nature & Fructification |
| :--- | :--- | :--- | :--- |
| **1. Mangala (मङ्गला)** | **Moon** | 1 Year | Auspicious beginnings, mental peace, domestic bliss, spiritual devotion. |
| **2. Pingala (पिङ्गला)** | **Sun** | 2 Years | Authority, heat, health vigilance, fatherly interactions, ambition. |
| **3. Dhanya (धान्या)** | **Jupiter**| 3 Years | Financial prosperity, grain/wealth multiplication, wisdom, education. |
| **4. Bhramari (भ्रामरी)** | **Mars** | 4 Years | Restless travels, dynamic courage, relocation, competition, vigor. |
| **5. Bhadrika (भद्रिका)** | **Mercury**| 5 Years | Intellectual triumphs, career success, communication, trade profits. |
| **6. Ulka (उल्का)** | **Saturn** | 6 Years | Heavy responsibility, endurance tests, delays, karmic restructuring. |
| **7. Siddha (सिद्धा)** | **Venus** | 7 Years | Supreme accomplishment, luxury, marriage, artistic honors, wealth. |
| **8. Sankata (सङ्कटा)** | **Rahu** | 8 Years | Sudden upheaval, karmic shifts, foreign travels, occult transformation. |

$$\text{Starting Yogini} = (\text{Janma Nakshatra Number} + 3) \pmod 8$$

---

## 3. The 8 Classical Conditional Dasha Applicability Filters

| Conditional Dasha | Total Years | Classical Activation Condition (BPHS) |
| :--- | :--- | :--- |
| **Ashtottari Dasha** | 108 Years | Rahu posited in a Kendra or Trikona from the Lagna Lord. |
| **Dwisaptati-Sama** | 72 Years | 7th Lord posited in the 7th House or in Lagna (1st House). |
| **Chaturashiti-Sama**| 84 Years | 10th Lord posited in the 10th House. |
| **Shastihayani** | 60 Years | Sun posited in Lagna (1st House). |
| **Shatabdika** | 100 Years | Vargottama Lagna (Same sign in D1 and D9). |
| **Shat-trimsat-sama**| 36 Years | Day birth with Moon in Sun Hora, or Night birth with Sun in Moon Hora. |
| **Dwadashottari** | 112 Years | Lagna falling in Venus\\'s Navamsha (Taurus or Libra D9). |
| **Shodashottari** | 116 Years | Krishna Paksha with Lagna in Sun Hora, or Shukla Paksha in Moon Hora. |

---

## 4. Engineering Implementation Strategy for Vedic Sky Tracker

1. **`src/engine/dashaSystems.ts` (NEW)**:
   - **Yogini Dasha Calculator (36-Year MD & AD)**: Computes active Yogini Mahadasha & Antardasha with exact start/end dates and classical interpretations.
   - **Conditional Dasha Applicability Engine**: Evaluates natal chart against all 8 Parashari conditions and reports eligible conditional systems.
   - **Ashtottari Dasha Calculator (108 Years)**: Computes Ashtottari MD/AD when eligible.
   - **Multi-Dasha Triangulation Scorecard**: Cross-validates Vimshottari + Yogini + Ashtottari/Conditional timelines for simultaneous event agreement.

2. **`src/components/DashaSystemsDeck.tsx` (NEW)**:
   - Interactive Multi-Dasha Explorer:
     - Active Yogini Dasha Card with current Yogini deity & planetary ruler.
     - Complete 36-Year Yogini Timeline table.
     - 8 Conditional Dasha Eligibility Checker with active green badges.
     - Multi-Dasha Triangulation Matrix.

3. **`src/components/BhavaBalaView.tsx` (UPGRADED)**:
   - Add **⏳ Multi-Dasha & Yogini (Classical)** navigation tab.

4. **`src/engine/chatContext.ts` (Dossier 3.1 Upgrade)**:
   - Ingest Section 21: **Classical Multi-Dasha, Yogini Dasha & Conditional Applicability Dossier**.

5. **`tests/engine.test.mjs` (Test #32)**:
   - Automated unit test suite verifying Yogini Dasha calculation, Ashtottari applicability, and multi-dasha synchronization.

---

*Authored by Antigravity Systems Architect — Grounded in Encyclopedia of Vedic Astrology: Dasha Systems.*
