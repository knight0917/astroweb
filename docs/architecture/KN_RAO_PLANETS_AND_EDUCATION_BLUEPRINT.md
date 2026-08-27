# 🎓 K.N. Rao & Naval Singh: Planets and Education (Vol. 1) & PAC-DARES — Systems Blueprint
**Based on Ingestion of:**
- *Planets and Education (Vol. 1)* (202 Pages) by **Naval Singh** & **K.N. Rao**
- *PAC DARES in Hindu Astrology* (63 Pages) by **K.N. Rao**

---

## 1. Executive Summary & Educational Methodology

In classical Hindu predictive astrology, choosing the optimal educational stream (*Vidya*) is the paramount milestone shaping a native\\'s life. Sri K.N. Rao and Er. Naval Singh established the BVB educational counselling model through a **Tripartite Academic House Matrix (4th, 5th, 9th Houses)** cross-verified in **D1 Birth Chart**, **D9 Navamsha**, and **D24 Siddhamsa (Chaturvimshamsha)**:

```
                              ┌─────────────────────────────────────────────────────────┐
                              │            K.N. RAO EDUCATIONAL TRIAD MATRIX            │
                              └───────────────────────────┬─────────────────────────────┘
                                                          │
                 ┌────────────────────────────────────────┼────────────────────────────────────────┐
                 ▼                                        ▼                                        ▼
      4TH HOUSE (FOUNDATION)                    5TH HOUSE (CORE BUDDHI)                 9TH HOUSE (HIGHER VIDYA)
 [Home Atmosphere & Schooling]            [Inherent Intellect & Stream Choice]     [Postgraduate / Research / Guru]
```

---

## 2. Educational Stream Determination Matrix

K.N. Rao & Naval Singh classify academic streams based on planetary interactions with the 5th House, 5th Lord, and Karakas in D1, D9, and D24:

| Educational Stream | Core Planetary Signatures | Recommended Degrees / Careers |
| :--- | :--- | :--- |
| **Engineering & Technology** | **Mars** (Machinery) + **Saturn** (Structures) + **Mercury/Rahu** (Electronics/IT/AI) | B.Tech/M.Tech in CS, IT, AI, Mechanical, Civil, Electrical |
| **Medical & Life Sciences** | **Sun** (Prana) + **Mars** (Surgery) + **Jupiter/Moon** (Healing) + 6th/8th house link | MBBS, MD, Surgery, Biotechnology, Pharmacy, Dentistry |
| **Physical Sciences & Math** | **Mercury** (Computation) + **Sun** (Abstraction) + **Mars** (Logic) | Pure Mathematics, Physics, Chemistry, Data Science |
| **Commerce, Finance & Management**| **Mercury** (Accounts) + **Jupiter** (Finance/Banking) + 2nd/11th connection | MBA, CA, CFA, Economics, Financial Analysis, FinTech |
| **Law, Governance & Administration**| **Jupiter** (Dharma/Justice) + **Sun/Mars** (Executive Authority) + 9th/10th link | LLB/LLM, Corporate Law, Civil Services (IAS/IPS), Public Policy |
| **Humanities, Arts & Media** | **Venus** (Aesthetics) + **Moon/Mercury** (Literature/Writing) + **Jupiter** (Philosophy) | Literature, Journalism, Psychology, Fine Arts, Design |

---

## 3. D24 Siddhamsa (Chaturvimshamsha) Cross-Verification

Parashari D24 Siddhamsa (24th division / $1^\circ 15'$) evaluates:
1. **D24 Lagna & 5th House**: Native\\'s capacity to retain complex intellectual concepts and absorb higher learning.
2. **Academic Honors & Scholarships**: Fortified Jupiter/Mercury in D24 Kendras guarantees distinction and research breakthroughs.

---

## 4. Engineering Implementation Strategy for Vedic Sky Tracker

1. **`src/engine/educationStream.ts` (NEW)**:
   - **Tripartite Academic House Evaluator (H4, H5, H9)**: Computes foundational schooling (H4), creative intelligence (H5), and higher postgraduate potential (H9).
   - **Stream Aptitude Scoring Engine**: Calculates percentage aptitude scores across all 6 core educational streams (Engineering, Medicine, Science, Commerce, Law, Arts).
   - **D24 Siddhamsa Higher Learning Calculator**: Evaluates D24 Lagna, 5th house, and academic distinction potential.
   - **Composite Academic Guidance Synthesis**: Generates personalized stream recommendations with classical BVB citations.

2. **`src/components/EducationStreamDeck.tsx` (NEW)**:
   - Interactive Educational Counselling Dashboard:
     - 6 Stream Aptitude Progress Bars with primary recommendation badge.
     - Tripartite House Analysis (4th, 5th, 9th).
     - D24 Siddhamsa Academic Mastery & Distinction Inspector.

3. **`src/components/BhavaBalaView.tsx` (UPGRADED)**:
   - Add **🎓 Planets & Education (K.N. Rao)** navigation tab.

4. **`src/engine/chatContext.ts` (Dossier 3.0 Upgrade)**:
   - Ingest Section 20: **K.N. Rao & Naval Singh Planets & Education Dossier (Stream Aptitude & D24 Siddhamsa)**.

5. **`tests/engine.test.mjs` (Test #31)**:
   - Automated unit test suite verifying educational stream calculation, tripartite houses, and D24 integration.

---

*Authored by Antigravity Systems Architect — Grounded in K.N. Rao & Naval Singh\\'s BVB Educational Series.*
