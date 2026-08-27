# 📜 K.N. Rao: Karma and Rebirth in Hindu Astrology — Systems Blueprint
**Based on Ingestion of:**
- *Karma & Rebirth in Hindu Astrology* by **K.N. Rao** (Kotamraju Narayana Rao)
- Supporting classic treatises on *Purva Janma Karma*, *Dreshkona Loka Descent*, *Dwadashamsha Lineage Karma*, and *Shashtiamsha (D60) Karmic Vectors*.

---

## 1. Foundational Doctrine: The Quad-Karma Spectrum

According to K.N. Rao, human destiny is not fatalistic doom, but the mathematical unfolding of cosmic memory (*Samskaras*):

```
┌───────────────────────────────┬───────────────────────────────────────────────────────────┐
│ Karma Category                │ Astrological Engine & Locus                               │
├───────────────────────────────┼───────────────────────────────────────────────────────────┤
│ **1. Sanchita Karma**         │ The entire cosmic reservoir of accumulated past actions.  │
│                               │ Encoded in D60 (Shashtiamsha) & D12 (Ancestral Lineage).  │
├───────────────────────────────┼───────────────────────────────────────────────────────────┤
│ **2. Prarabdha Karma**        │ The ripe portion selected for this lifetime.              │
│                               │ Encoded in D1 Lagna, Janma Rashi, Moon Nakshatra & Dasha. │
├───────────────────────────────┼───────────────────────────────────────────────────────────┤
│ **3. Kriyamana Karma**        │ Current exercise of free will and conscious action.       │
│                               │ Encoded in 3rd House (Valour) & 10th House (Executive).   │
├───────────────────────────────┼───────────────────────────────────────────────────────────┤
│ **4. Agama Karma**            │ Future-oriented planning, vows, and mental ideation.      │
│                               │ Encoded in 9th House (Dharma) & 11th House (Aspirations). │
└───────────────────────────────┴───────────────────────────────────────────────────────────┘
```

---

## 2. Core Astrological Vectors of Past-Life Karma (*Purva Janma Samskaras*)

### A. The 5th House & 5th Lord (Purva Punya Sthana — पूर्व पुण्य)
- Represents past-life spiritual merits (*Sadhana*), sacred mantras, and intellectual credits.
- **Children as Past Karmic Debts (*Rinanubandhana*)**:
  - Harmonious 5th house: Devoted, supportive children who repay past affectionate debts.
  - Afflicted 5th house / 6th-8th lord associations: Past karmic creditors incarnating to collect dues through hardship or grief.

### B. The 9th House & 9th Lord (Bhagya & Past Guru Dharma — भाग्य एवं धर्म)
- The cosmic protection shield, inheritance of ancestral blessings, and living guru grace carried forward.
- Affliction to 9th house indicates past-life transgression of dharma or neglected spiritual duties.

### C. D3 Dreshkona & The Realm of Descent (*Loka of Origin*)
Classical Varahamihira and Parashara rule validated by K.N. Rao:
- Look at the stronger of the **Sun** and the **Moon** in the birth chart.
- Identify the lord of its **Dreshkona (D3 sign)**:
  - **Sun / Mars**: *Deva Loka* / Realm of Fire and Light (Divine/Warrior heritage).
  - **Moon / Venus**: *Pitri Loka* / Realm of the Ancestors and Nectar.
  - **Jupiter**: *Brahmaloka / Devaloka* / Highest Divine Sages realm.
  - **Mercury**: *Bhu Loka* / Human Realm / Intellectual sphere.
  - **Saturn / Rahu / Ketu**: *Yamaloka / Naraka* / Mortal realm of heavy penance.

### D. The 22nd Dreshkona (Kharesh — द्रेष्काण 22)
- The 8th house in D3: Marks the specific point of past-life vulnerability, physical termination, and health traps to navigate carefully in this life.

### E. The Rahu-Ketu Karmic Axis (The Karmic Highway)
- **Ketu (The Tail — Past Mastery & Debts)**:
  - Where the native was in past births; instinctive natural genius, spiritual renunciation, but also where unresolved past detachment/debts exist.
- **Rahu (The Head — Future Growth & Obsession)**:
  - The current incarnation's growth frontier, unfulfilled worldly desires (*Kama*), unconventional learning curve.

### F. Retrograde Planets (Vakri Grahas — वक्री ग्रह)
- Represent **unfinished business from past incarnations**.
- Deep soul vows, delayed timing, and internal karmic introspection.

---

## 3. Engineering Implementation Strategy for Vedic Sky Tracker

1. **`src/engine/karmaRebirth.ts` (NEW)**:
   - **Purva Punya & Bhagya Score (5th & 9th House Matrix)**.
   - **Loka of Origin Calculator (Dreshkona / D3 Ruler of Sun/Moon)**.
   - **22nd Dreshkona (Kharesh) & Past Karmic Trap Identifier**.
   - **Rahu-Ketu Karmic Highway Analyzer (Past Mastery vs. Present Evolution)**.
   - **Vakri (Retrograde) Unfinished Soul Contracts Matrix**.
   - **Rinanubandhana (Karmic Relationship Debts) Analyzer**.

2. **`src/components/KarmaRebirthDeck.tsx` (NEW)**:
   - Visual Cosmic Karmic Ledger.
   - Loka of Origin & Descent badge.
   - Past Mastery (Ketu) $\rightarrow$ Future Evolution (Rahu) Axis.
   - 22nd Dreshkona & Retrograde Karmic Contracts cards.

3. **`src/engine/chatContext.ts` (Dossier 2.6 Upgrade)**:
   - Ingest Section 16: **K.N. Rao Karma, Rebirth & Purva Punya Dossier**.

4. **`tests/engine.test.mjs` (Test #27)**:
   - Automated test suite for Karma & Rebirth engine.

---

*Authored by Antigravity Systems Architect — Grounded in K.N. Rao's Classic Treatises.*
