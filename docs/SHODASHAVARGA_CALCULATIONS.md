# Classical Parashari Shodashavarga (षोडशवर्ग) Mathematical Reference & Calculation Formulas
**Source Text Reference:** *Brihat Parashara Hora Shastra (BPHS), Chapter 6: Shodashavargaadhyaya (षोडशवर्गाध्याय)*

This document provides the complete, mathematically rigorous formulas for computing all **16 Classical Divisional Charts (Shodashavargas)** from longitude $\lambda \in [0^\circ, 360^\circ)$ under any Sidereal Ayanamsha (e.g. Lahiri / Chitrapaksha).

---

## 1. Mathematical Notation & Definitions

- Let $\lambda$ be the sidereal longitude of a celestial body (Ascendant, Graha, or Upagraha) in degrees: $\lambda \in [0, 360)$.
- **Natal Rashi Index ($S$):**
  $$S = \lfloor \lambda / 30 \rfloor \in \{0, 1, \dots, 11\}$$
  Where $0 = \text{Aries (Mesha)}, 1 = \text{Taurus (Vrishabha)}, \dots, 11 = \text{Pisces (Meena)}$.
- **Degrees in Sign ($D$):**
  $$D = \lambda \pmod{30} \in [0, 30)$$
- **Sign Modality / Mobility ($M_S$):**
  - Movable / Chara (चर): $S \in \{0, 3, 6, 9\}$ (Mesha, Karka, Tula, Makara)
  - Fixed / Sthira (स्थिर): $S \in \{1, 4, 7, 10\}$ (Vrishabha, Simha, Vrishchika, Kumbha)
  - Dual / Dwiswabhava (द्विस्वभाव): $S \in \{2, 5, 8, 11\}$ (Mithuna, Kanya, Dhanu, Meena)
- **Sign Polarity ($P_S$):**
  - Odd / Vishama (विषम): $S \in \{0, 2, 4, 6, 8, 10\}$ (1st, 3rd, 5th, 7th, 9th, 11th signs: Mesha, Mithuna, Simha, Tula, Dhanu, Kumbha)
  - Even / Sama (सम): $S \in \{1, 3, 5, 7, 9, 11\}$ (2nd, 4th, 6th, 8th, 10th, 12th signs: Vrishabha, Karka, Kanya, Vrishchika, Makara, Meena)
- **Sign Element ($E_S$):**
  - Fire (अग्नि): $S \in \{0, 4, 8\}$ (Mesha, Simha, Dhanu)
  - Earth (पृथ्वी): $S \in \{1, 5, 9\}$ (Vrishabha, Kanya, Makara)
  - Air (वायु): $S \in \{2, 6, 10\}$ (Mithuna, Tula, Kumbha)
  - Water (जल): $S \in \{3, 7, 11\}$ (Karka, Vrishchika, Meena)

---

## 2. The 16 Divisional Charts (Shodashavarga Formulas)

### 1. D1 — Rashi Chakra (राशि चक्र)
- **Significance:** Physical body, general vitality, baseline existence.
- **Span per division:** $30^\circ 00'$
- **Formula:**
  $$\text{D1}(S, D) = S$$

---

### 2. D2 — Hora Chakra (होरा चक्र)
- **Significance:** Wealth, treasury, assets, financial prosperity, speech.
- **Span per division:** $15^\circ 00'$
- **Part Index ($k$):** $k = \lfloor D / 15 \rfloor \in \{0, 1\}$
- **Formula (BPHS Classical Parashari):**
  - If $S$ is **Odd**:
    - $k = 0$ ($0^\circ-15^\circ$) $\to \text{Sun's Hora (Leo / Simha, index 4)}$
    - $k = 1$ ($15^\circ-30^\circ$) $\to \text{Moon's Hora (Cancer / Karka, index 3)}$
  - If $S$ is **Even**:
    - $k = 0$ ($0^\circ-15^\circ$) $\to \text{Moon's Hora (Cancer / Karka, index 3)}$
    - $k = 1$ ($15^\circ-30^\circ$) $\to \text{Sun's Hora (Leo / Simha, index 4)}$

---

### 3. D3 — Drekkana Chakra (द्रेष्काण चक्र)
- **Significance:** Siblings, courage, initiative, third house matters, vitality.
- **Span per division:** $10^\circ 00'$
- **Part Index ($k$):** $k = \lfloor D / 10 \rfloor \in \{0, 1, 2\}$
- **Formula:**
  $$\text{D3}(S, D) = (S + k \times 4) \pmod{12}$$
  - $k = 0$ ($0^\circ-10^\circ$) $\to$ 1st house from sign (Same sign $S$).
  - $k = 1$ ($10^\circ-20^\circ$) $\to$ 5th house from sign ($(S + 4) \pmod{12}$).
  - $k = 2$ ($20^\circ-30^\circ$) $\to$ 9th house from sign ($(S + 8) \pmod{12}$).

---

### 4. D4 — Chaturthamsha / Turyamsha (चतुर्थांश चक्र)
- **Significance:** Fortunes, fixed assets, landed property, real estate, residence.
- **Span per division:** $7^\circ 30'$ ($7.5^\circ$)
- **Part Index ($k$):** $k = \lfloor D / 7.5 \rfloor \in \{0, 1, 2, 3\}$
- **Formula:**
  $$\text{D4}(S, D) = (S + k \times 3) \pmod{12}$$
  - $k = 0 \to$ 1st (same sign $S$)
  - $k = 1 \to$ 4th from sign ($(S + 3) \pmod{12}$)
  - $k = 2 \to$ 7th from sign ($(S + 6) \pmod{12}$)
  - $k = 3 \to$ 10th from sign ($(S + 9) \pmod{12}$)

---

### 5. D7 — Saptamsha Chakra (सप्तांश चक्र)
- **Significance:** Children, progeny, grandchildren, creative fertility.
- **Span per division:** $4^\circ 17' 8.57''$ ($30^\circ / 7 \approx 4.285714^\circ$)
- **Part Index ($k$):** $k = \lfloor D / (30/7) \rfloor \in \{0, 1, \dots, 6\}$
- **Formula:**
  - If $S$ is **Odd**:
    $$\text{D7}(S, D) = (S + k) \pmod{12}$$
  - If $S$ is **Even**:
    $$\text{D7}(S, D) = (S + 6 + k) \pmod{12} \quad \text{(Starts from 7th sign)}$$

---

### 6. D9 — Navamsha Chakra (नवांश चक्र)
- **Significance:** Dharma, marriage, spouse, soul evolution, true planetary strength.
- **Span per division:** $3^\circ 20'$ ($3.333333^\circ$)
- **Part Index ($k$):** $k = \lfloor D / (30/9) \rfloor \in \{0, 1, \dots, 8\}$
- **Formula (Triplicity / Element Based):**
  - If $S$ is **Fiery** ($S \in \{0, 4, 8\}$) $\to \text{Starts from Aries (0)}$:
    $$\text{D9}(S, D) = (0 + k) \pmod{12}$$
  - If $S$ is **Earthy** ($S \in \{1, 5, 9\}$) $\to \text{Starts from Capricorn (9)}$:
    $$\text{D9}(S, D) = (9 + k) \pmod{12}$$
  - If $S$ is **Airy** ($S \in \{2, 6, 10\}$) $\to \text{Starts from Libra (6)}$:
    $$\text{D9}(S, D) = (6 + k) \pmod{12}$$
  - If $S$ is **Watery** ($S \in \{3, 7, 11\}$) $\to \text{Starts from Cancer (3)}$:
    $$\text{D9}(S, D) = (3 + k) \pmod{12}$$

---

### 7. D10 — Dashamsha Chakra (दशांश चक्र)
- **Significance:** Career, profession, fame, status in society, executive power.
- **Span per division:** $3^\circ 00'$
- **Part Index ($k$):** $k = \lfloor D / 3 \rfloor \in \{0, 1, \dots, 9\}$
- **Formula:**
  - If $S$ is **Odd**:
    $$\text{D10}(S, D) = (S + k) \pmod{12}$$
  - If $S$ is **Even**:
    $$\text{D10}(S, D) = (S + 8 + k) \pmod{12} \quad \text{(Starts from 9th sign)}$$

---

### 8. D12 — Dwadashamsha Chakra (द्वादशांश चक्र)
- **Significance:** Parents, ancestry, lineage, inherited karma.
- **Span per division:** $2^\circ 30'$ ($2.5^\circ$)
- **Part Index ($k$):** $k = \lfloor D / 2.5 \rfloor \in \{0, 1, \dots, 11\}$
- **Formula:**
  $$\text{D12}(S, D) = (S + k) \pmod{12}$$

---

### 9. D16 — Shodashamsha / Kalangsha (षोडशांश चक्र)
- **Significance:** Vehicles, conveyances, general happiness, mental peace, luxuries.
- **Span per division:** $1^\circ 52' 30''$ ($1.875^\circ$)
- **Part Index ($k$):** $k = \lfloor D / 1.875 \rfloor \in \{0, 1, \dots, 15\}$
- **Formula:**
  - If $S$ is **Movable (Chara)** $\to \text{Starts from Aries (0)}$:
    $$\text{D16}(S, D) = (0 + k) \pmod{12}$$
  - If $S$ is **Fixed (Sthira)** $\to \text{Starts from Leo (4)}$:
    $$\text{D16}(S, D) = (4 + k) \pmod{12}$$
  - If $S$ is **Dual (Dwiswabhava)** $\to \text{Starts from Sagittarius (8)}$:
    $$\text{D16}(S, D) = (8 + k) \pmod{12}$$

---

### 10. D20 — Vimshamsha Chakra (विंशांश चक्र)
- **Significance:** Spiritual progress, religious inclinations, mantras, meditation, Bhakti.
- **Span per division:** $1^\circ 30'$ ($1.5^\circ$)
- **Part Index ($k$):** $k = \lfloor D / 1.5 \rfloor \in \{0, 1, \dots, 19\}$
- **Formula:**
  - If $S$ is **Movable (Chara)** $\to \text{Starts from Aries (0)}$:
    $$\text{D20}(S, D) = (0 + k) \pmod{12}$$
  - If $S$ is **Fixed (Sthira)** $\to \text{Starts from Sagittarius (8)}$:
    $$\text{D20}(S, D) = (8 + k) \pmod{12}$$
  - If $S$ is **Dual (Dwiswabhava)** $\to \text{Starts from Leo (4)}$:
    $$\text{D20}(S, D) = (4 + k) \pmod{12}$$

---

### 11. D24 — Chaturvimshamsha / Siddhamsa (चतुर्विंशांश चक्र)
- **Significance:** Higher learning, academic knowledge, intellect, skills.
- **Span per division:** $1^\circ 15'$ ($1.25^\circ$)
- **Part Index ($k$):** $k = \lfloor D / 1.25 \rfloor \in \{0, 1, \dots, 23\}$
- **Formula:**
  - If $S$ is **Odd**:
    $$\text{D24}(S, D) = (4 + k) \pmod{12} \quad \text{(Starts from Leo / Simha)}$$
  - If $S$ is **Even**:
    $$\text{D24}(S, D) = (3 + k) \pmod{12} \quad \text{(Starts from Cancer / Karka)}$$

---

### 12. D27 — Saptavimshamsha / Bhamsa / Nakshatramsha (सप्तविंशांश चक्र)
- **Significance:** Physical stamina, general strength, vulnerabilities, inherent potential.
- **Span per division:** $1^\circ 06' 40''$ ($30^\circ / 27 \approx 1.111111^\circ$)
- **Part Index ($k$):** $k = \lfloor D / (30/27) \rfloor \in \{0, 1, \dots, 26\}$
- **Formula:**
  - If $S$ is **Fiery** ($S \in \{0, 4, 8\}$) $\to \text{Starts from Aries (0)}$:
    $$\text{D27}(S, D) = (0 + k) \pmod{12}$$
  - If $S$ is **Earthy** ($S \in \{1, 5, 9\}$) $\to \text{Starts from Cancer (3)}$:
    $$\text{D27}(S, D) = (3 + k) \pmod{12}$$
  - If $S$ is **Airy** ($S \in \{2, 6, 10\}$) $\to \text{Starts from Libra (6)}$:
    $$\text{D27}(S, D) = (6 + k) \pmod{12}$$
  - If $S$ is **Watery** ($S \in \{3, 7, 11\}$) $\to \text{Starts from Capricorn (9)}$:
    $$\text{D27}(S, D) = (9 + k) \pmod{12}$$

---

### 13. D30 — Trimshamsha Chakra (त्रिंशांश चक्र)
- **Significance:** Arishta, misfortunes, diseases, character flaws, hidden adversities.
- **Structure:** Unequal 5 planetary segments per sign based on BPHS rules.
- **Formula:**
  - If $S$ is **Odd**:
    - $D \in [0^\circ, 5^\circ) \to \text{Mars (Aries, sign 0)}$
    - $D \in [5^\circ, 10^\circ) \to \text{Saturn (Aquarius, sign 10)}$
    - $D \in [10^\circ, 18^\circ) \to \text{Jupiter (Sagittarius, sign 8)}$
    - $D \in [18^\circ, 25^\circ) \to \text{Mercury (Gemini, sign 2)}$
    - $D \in [25^\circ, 30^\circ) \to \text{Venus (Libra, sign 6)}$
  - If $S$ is **Even**:
    - $D \in [0^\circ, 5^\circ) \to \text{Venus (Taurus, sign 1)}$
    - $D \in [5^\circ, 12^\circ) \to \text{Mercury (Virgo, sign 5)}$
    - $D \in [12^\circ, 20^\circ) \to \text{Jupiter (Pisces, sign 11)}$
    - $D \in [20^\circ, 25^\circ) \to \text{Saturn (Capricorn, sign 9)}$
    - $D \in [25^\circ, 30^\circ) \to \text{Mars (Scorpio, sign 7)}$

---

### 14. D40 — Khavedamsha / Swavedamsha (खवेदांश चक्र)
- **Significance:** General auspicious & inauspicious karmic effects, matrilineal legacy.
- **Span per division:** $0^\circ 45'$ ($0.75^\circ$)
- **Part Index ($k$):** $k = \lfloor D / 0.75 \rfloor \in \{0, 1, \dots, 39\}$
- **Formula:**
  - If $S$ is **Odd**:
    $$\text{D40}(S, D) = (0 + k) \pmod{12} \quad \text{(Starts from Aries / Mesha)}$$
  - If $S$ is **Even**:
    $$\text{D40}(S, D) = (6 + k) \pmod{12} \quad \text{(Starts from Libra / Tula)}$$

---

### 15. D45 — Akshavedamsha (अक्षवेदांश चक्र)
- **Significance:** Character integrity, general wellbeing, moral compass.
- **Span per division:** $0^\circ 40'$ ($0.666667^\circ$)
- **Part Index ($k$):** $k = \lfloor D / (30/45) \rfloor \in \{0, 1, \dots, 44\}$
- **Formula:**
  - If $S$ is **Movable (Chara)** $\to \text{Starts from Aries (0)}$:
    $$\text{D45}(S, D) = (0 + k) \pmod{12}$$
  - If $S$ is **Fixed (Sthira)** $\to \text{Starts from Leo (4)}$:
    $$\text{D45}(S, D) = (4 + k) \pmod{12}$$
  - If $S$ is **Dual (Dwiswabhava)** $\to \text{Starts from Sagittarius (8)}$:
    $$\text{D45}(S, D) = (8 + k) \pmod{12}$$

---

### 16. D60 — Shashtiamsha Chakra (षष्ठ्यंश चक्र)
- **Significance:** Past life karma, deep subconscious tendencies, highest precision chart (highest Varga weightage in Vimsopaka Bala: 4 points out of 20!).
- **Span per division:** $0^\circ 30'$ ($0.5^\circ$)
- **Part Index ($k$):** $k = \lfloor D / 0.5 \rfloor \in \{0, 1, \dots, 59\}$
- **Formula:**
  $$\text{D60}(S, D) = (S + k) \pmod{12}$$

---

## 3. Shodashavarga Varga Groups & Weights (Vimsopaka Bala / विंशोपक बल)

| Varga Group | Charts Included | Total Points | Key Purpose |
| :--- | :--- | :--- | :--- |
| **Shadvarga (6 Vargas)** | D1, D2, D3, D9, D12, D30 | 20 Points | Primary Prashna & Basic Chart Strength |
| **Saptavarga (7 Vargas)** | D1, D2, D3, D7, D9, D12, D30 | 20 Points | Standard Natal Horoscope Assessment |
| **Dashavarga (10 Vargas)** | D1, D2, D3, D7, D9, D10, D12, D16, D30, D60 | 20 Points | Advanced Career & Destiny Analysis |
| **Shodashavarga (16 Vargas)** | All 16 Vargas (D1 to D60) | 20 Points | Master Supreme Parashari Complete Karma Audit |

---