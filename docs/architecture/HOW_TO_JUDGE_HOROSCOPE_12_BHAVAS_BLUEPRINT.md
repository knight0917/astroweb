# 🏛️ How to Judge a Horoscope (Vols 1 & 2): 12 Bhavas Interpretation Architecture
**Based on Classical Ingestion:** *How to Judge a Horoscope — Volumes 1 & 2* (Dr. B.V. Raman & Gayatri Devi Vasudev, 794 Pages)

---

## 1. Executive Summary & Objective

Dr. B.V. Raman's two-volume magnum opus ***How to Judge a Horoscope*** is the definitive encyclopedic authority on Vedic chart analysis. Spanning 794 pages, it establishes:
1. **The Tripartite Rule of Judgement (त्रि-सूत्र)**: Every house must be evaluated simultaneously through (a) **The Bhava Cusp & Sign**, (b) **The House Lord (Bhavadhipati)**, and (c) **The Natural Karaka (Significator)**.
2. **Complete 144 House Lord Placements (12 Lords × 12 Houses)**: The precise predictive outcome when any house lord occupies any of the 12 houses.
3. **Rigorous Functional Benefic / Malefic Matrix for all 12 Lagnas**: Distinguishing temporal functional lordship from natural beneficence.
4. **The 3-Tier Maraka Hierarchy**: Systematic classification of primary, secondary, and tertiary health/longevity transition determinants.

---

## 2. The Tripartite Evaluation Model (Bhava • Lord • Karaka)

```
                              ┌──────────────────────────────────────────────┐
                              │          HOUSE JUDGEMENT TRI-SUTRA           │
                              └──────────────────────┬───────────────────────┘
                                                     │
               ┌─────────────────────────────────────┼─────────────────────────────────────┐
               ▼                                     ▼                                     ▼
  ┌───────────────────────────┐        ┌───────────────────────────┐        ┌───────────────────────────┐
  │   1. BHAVA (THE HOUSE)    │        │  2. BHAVADHIPATI (LORD)   │        │   3. KARAKA (SIGNIFICATOR)│
  │ - Cusp sign & element     │        │ - Placement (1 to 12)     │        │ - Sun: 1st (Vitality), 9th│
  │ - Resident occupants      │        │ - Dignity (Exalt/Debil)   │        │ - Moon: 4th (Mother)      │
  │ - Aspects received        │        │ - Shadbala & Panchada     │        │ - Mars: 3rd, 6th (Valour) │
  │ - SAV points (Ashtakavarga│        │ - Ishta / Kashta ratio    │        │ - Jupiter: 2nd, 5th, 9th  │
  └───────────────────────────┘        └───────────────────────────┘        │ - Venus: 7th (Marriage)   │
                                                                            │ - Saturn: 8th (Longevity) │
                                                                            └───────────────────────────┘
```

---

## 3. Comprehensive 12 Lagna Functional Rulership Matrix

| Lagna (Ascendant) | Supreme Yogakaraka | Functional Benefics | Functional Malefics | Marakas / Neutrals |
| :--- | :--- | :--- | :--- | :--- |
| **Aries (Mesha)** | — | **Jupiter (Best), Mars, Sun** | **Mercury (Worst), Saturn, Venus** | Venus (2 & 7), Moon (Neutral) |
| **Taurus (Vrishabha)** | **Saturn (9 & 10)** | **Mercury, Mars, Sun** | **Jupiter (8 & 11), Moon** | Mars (7 & 12), Venus (Neutral 1) |
| **Gemini (Mithuna)** | — | **Venus (5 & 12)** | **Mars (Worst 6 & 11), Jupiter** | Moon (2), Jupiter (Maraka 7) |
| **Cancer (Karka)** | **Mars (5 & 10)** | **Jupiter (9), Moon** | **Mercury, Venus, Saturn (7 & 8)** | Sun (2), Saturn (7) |
| **Leo (Simha)** | **Mars (4 & 9)** | **Jupiter (5), Sun** | **Saturn (6 & 7), Mercury, Venus** | Mercury (2), Saturn (7) |
| **Virgo (Kanya)** | — | **Venus (9), Mercury** | **Mars (Worst 3 & 8), Jupiter, Moon** | Venus (2), Jupiter (7) |
| **Libra (Tula)** | **Saturn (4 & 5)** | **Mercury (9)** | **Jupiter (Worst 3 & 6), Sun** | Mars (2 & 7 Maraka) |
| **Scorpio (Vrischika)** | — | **Jupiter (5), Sun (10), Moon (9)**| **Mercury (Worst 8 & 11), Venus** | Venus (7 & 12), Jupiter (2) |
| **Sagittarius (Dhanus)** | — | **Mars (5), Sun (9)** | **Venus (Worst 6 & 11), Saturn** | Saturn (2), Mercury (7) |
| **Capricorn (Makara)** | **Venus (5 & 10)** | **Mercury (9), Saturn** | **Mars (Worst 4 & 11), Jupiter** | Saturn (2), Moon (7) |
| **Aquarius (Kumbha)** | **Venus (4 & 9)** | **Sun, Mars** | **Jupiter (2 & 11), Moon (6)** | Jupiter (2), Sun (7) |
| **Pisces (Meena)** | — | **Moon (5), Mars (2 & 9)** | **Saturn (11 & 12), Sun (6), Venus** | Mars (2), Mercury (7) |

---

## 4. The 3-Tier Maraka (Crisis / Longevity Transition) Hierarchy

1. **Primary Marakas**:
   - Lords of the 2nd and 7th houses (2nd is 12th from 3rd house of life; 7th is 12th from 8th house of longevity).
   - Natural or functional malefics occupying the 2nd or 7th house.
2. **Secondary Marakas**:
   - Benefics closely associating with 2nd/7th lords.
   - Lords of the 3rd and 8th houses in mutual dusthana conjunction.
3. **Tertiary Determinants**:
   - Saturn in conjunction, association, or mutual aspect with primary Marakas.
   - The lord of the 6th or 8th house operating in a sub-period with low Ashtakavarga and low Shadbala.
   - *Rule of Exemption*: The Sun and the Moon do not acquire Maraka blemish solely by 8th lordship.

---

## 5. Architectural Directives for the AI Astrologer Engine

1. **Multi-Faceted Bhava Synthesis**: When the user asks about a specific life domain (e.g., *"How is my career?"* or *"When will I marry?"*), the AI must evaluate all 3 prongs:
   - **House**: Occupants and aspect on the 10th/7th cusp.
   - **Lord**: Placement, Ishta/Kashta, Pancha-da Maitri, and active Dasha window of the 10th/7th lord.
   - **Karaka**: Health of Sun/Jupiter (for career) or Venus (for marriage).
2. **Preventing Alarmism**: Always verify whether an apparent malefic transit or placement is mitigated by high Shadbala, strong Pancha-da dispositor friendship, or benefic aspect from Jupiter/Venus.

---

*Authored by Antigravity Systems Architect — Grounded in Dr. B.V. Raman's How to Judge a Horoscope (Vols 1 & 2).*
