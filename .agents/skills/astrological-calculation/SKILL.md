---
name: astrological-calculation
description: >-
  Compute classical Vedic (Jyotish) & astronomical ephemeris algorithms: planetary longitudes,
  Lahiri/Raman/KP Ayanamsha, Bhava Chalita, Shodashavarga (D-1 to D-60), Ashtakavarga, Shadbala, Dashas, Horas, and Upagrahas.
---

# Classical Vedic Astrological & Astronomical Calculation Engine

This skill defines the canonical mathematical and astronomical algorithms required for Vedic (Jyotish) computations according to Brihat Parashara Hora Shastra (BPHS), Surya Siddhanta, and modern Swiss Ephemeris sidereal frameworks.

---

## 1. Celestial Coordinate & Ephemeris Mechanics

### Julian Day (JD) Conversion
For a calendar date $(Y, M, D, \text{UT})$:
If $M \le 2$: $Y = Y - 1, M = M + 12$.
$$A = \lfloor Y / 100 \rfloor, \quad B = 2 - A + \lfloor A / 4 \rfloor$$
$$\text{JD} = \lfloor 365.25(Y + 4716) \rfloor + \lfloor 30.6001(M + 1) \rfloor + D + \frac{\text{UT}}{24} + B - 1524.5$$

### Julian Centuries ($T$) from J2000.0
$$T = \frac{\text{JD} - 2451545.0}{36525}$$

### Obliquity of the Ecliptic ($\epsilon$)
$$\epsilon_0 = 23^\circ 26' 21.448'' - 46.8150'' T - 0.00059'' T^2 + 0.001813'' T^3$$

---

## 2. Ayanamsha Formulas (Tropical to Sidereal Nirayana)

$$\lambda_{\text{sidereal}} = (\lambda_{\text{tropical}} - \text{Ayanamsha}) \pmod{360^\circ}$$

1. **Chitra Paksha / Lahiri Ayanamsha** (Indian National Standard):
   $$A_{\text{Lahiri}} = 23^\circ 51' 25.53'' + 50.290966'' \times T$$
2. **Krishnamurti Paddhati (KP) Ayanamsha**:
   $$A_{\text{KP}} = A_{\text{Lahiri}} - 0^\circ 05' 52''$$
3. **Dr. B.V. Raman Ayanamsha**:
   $$A_{\text{Raman}} = 21^\circ 01' 36'' + 50.27'' \times (Y - 397)$$

---

## 3. Shodashavarga (16 Divisional Charts) Mathematical Mappings

Given a planet's Nirayana sidereal longitude $\lambda \in [0^\circ, 360^\circ)$:
- Rashi index $R = \lfloor \lambda / 30^\circ \rfloor \in [0, 11]$ (0 = Aries, 11 = Pisces).
- Intra-sign degree $\theta = \lambda \pmod{30^\circ}$.

### Navamsha ($D-9$) Division ($3^\circ 20' = 3.3333^\circ$ per pada)
1. Pada index $P = \lfloor \theta / 3.333333^\circ \rfloor \in [0, 8]$.
2. Starting Rashi based on element triplicity:
   - Fire signs ($R \in \{0, 4, 8\}$): Start at Aries ($0$).
   - Earth signs ($R \in \{1, 5, 9\}$): Start at Capricorn ($9$).
   - Air signs ($R \in \{2, 6, 10\}$): Start at Libra ($6$).
   - Water signs ($R \in \{3, 7, 11\}$): Start at Cancer ($3$).
3. $D_9 = (R_{\text{start}} + P) \pmod{12}$.

### Dashamsha ($D-10$) Division ($3^\circ 00'$ per division)
1. Division index $k = \lfloor \theta / 3.0^\circ \rfloor \in [0, 9]$.
2. If $R$ is odd: $D_{10} = (R + k) \pmod{12}$.
3. If $R$ is even: $D_{10} = (R + 9 + k) \pmod{12}$.

### Shashtiamsha ($D-60$) Division ($0^\circ 30' = 0.5^\circ$ per division)
1. Division index $k = \lfloor \theta / 0.5^\circ \rfloor \in [0, 59]$.
2. Deity / nature allocation per BPHS table (Mridu, Krura, Ghora, etc.).

---

## 4. Bhava Chalita (House Cusps)

- **Ascendant / Lagna**: Calculate Local Sidereal Time ($LST$) and solve the ascending degree:
  $$\tan(\lambda_{\text{asc}}) = \frac{-\cos(LST)}{\sin(\epsilon)\tan(\phi) + \cos(\epsilon)\sin(LST)}$$
- **Sripati System**: Trisect the quadrant distance between Midheaven ($MC$) and Ascendant ($Asc$). Midpoints constitute Bhava Madhyas; boundaries constitute Bhava Sandhis.
- **Equal House**: Each bhava spans $[\lambda_{\text{asc}} + 30^\circ(h-1), \lambda_{\text{asc}} + 30^\circ h)$.

---

## 5. Panchanga Five Pillars

1. **Tithi** (Lunar Day):
   $$\text{Tithi} = \left\lfloor \frac{(\lambda_{\text{Moon}} - \lambda_{\text{Sun}}) \pmod{360^\circ}}{12^\circ} \right\rfloor + 1 \in [1, 30]$$
2. **Nakshatra** (Lunar Mansion):
   $$\text{Nakshatra} = \left\lfloor \frac{\lambda_{\text{Moon}}}{13^\circ 20'} \right\rfloor \in [0, 26]$$
3. **Yoga**:
   $$\text{Yoga} = \left\lfloor \frac{(\lambda_{\text{Sun}} + \lambda_{\text{Moon}}) \pmod{360^\circ}}{13^\circ 20'} \right\rfloor \in [0, 26]$$
4. **Karana** (Half-Tithi):
   $$\text{Karana} = \left\lfloor \frac{(\lambda_{\text{Moon}} - \lambda_{\text{Sun}}) \pmod{360^\circ}}{6^\circ} \right\rfloor + 1 \in [1, 60]$$
5. **Vara** (Weekday Ruler):
   Day ruler sequences by weekday: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn.

---

## 6. Real-Time Planetary Horas & Choghadiya

- **Diurnal Hora Duration**: $\Delta T_{\text{day}} = \frac{T_{\text{sunset}} - T_{\text{sunrise}}}{12}$
- **Nocturnal Hora Duration**: $\Delta T_{\text{night}} = \frac{T_{\text{sunrise\_next}} - T_{\text{sunset}}}{12}$
- **Hora Sequence**: Chaldean order descending by orbital speed ($Saturn \to Jupiter \to Mars \to Sun \to Venus \to Mercury \to Moon$).
- **Choghadiya Sequence**: 8 equal day and night octants with weekday specific lord matrices.

---

## 7. Classical Upagrahas Calculation

1. **Gulika & Mandi**: Determined by the specific diurnal/nocturnal octant ruled by Saturn.
2. **Dhuma**: $\lambda_{\text{Dhuma}} = (\lambda_{\text{Sun}} + 133^\circ 20') \pmod{360^\circ}$
3. **Vyatipata**: $\lambda_{\text{Vyatipata}} = (360^\circ - \lambda_{\text{Dhuma}}) \pmod{360^\circ}$
4. **Parivesha**: $\lambda_{\text{Parivesha}} = (\lambda_{\text{Vyatipata}} + 180^\circ) \pmod{360^\circ}$
5. **Indrachapa**: $\lambda_{\text{Indrachapa}} = (360^\circ - \lambda_{\text{Parivesha}}) \pmod{360^\circ}$
6. **Upaketu**: $\lambda_{\text{Upaketu}} = (\lambda_{\text{Indrachapa}} + 16^\circ 40') \pmod{360^\circ}$
