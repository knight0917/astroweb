# 🌌 Vedic Sky Tracker & Planetary Ephemeris Engine

An interactive, high-precision **Vedic Astrology (Jyotish) & 3D Celestial Planetarium** application built with **Next.js 15, React Three Fiber (Three.js), Tailwind CSS, and TypeScript**.

---

## ✨ Key Features

### 🪐 1. 3D Geocentric Celestial Dome (Bhu-Mandala)
- **Central 3D Earth Globe**: Realistic textured Earth globe with an active observer pin for your chosen city/coordinates.
- **3-Tier Cylindrical Celestial Mechanics**:
  - **Upper Belt**: 12 Rashi (Zodiac) sectors with color-coded boundaries and degree ranges.
  - **Middle Belt**: Golden Ecliptic track featuring the 9 Classical Grahas (Navagrahas), Lagna (Ascendant), Madhya Lagna (MC), and Upagrahas (Sub-planets).
  - **Lower Belt**: 27 Nakshatra sectors featuring classical **Sacred Yoni Animals** (🐴 Horse, 🐘 Elephant, 🐍 Serpent, 🦁 Lion, 🐅 Tiger, 🐂 Bull, etc.) and ruling planetary lords.
- **Graha Drishti (Planetary Aspect Rays)**: Dynamic colored laser aspect rays (Mars $4, 7, 8$, Jupiter $5, 7, 9$, Saturn $3, 7, 10$, Rahu/Ketu $5, 7, 9$, and Universal 7th opposite aspect).
- **Interactive 3D Auto-Turn**: Clicking any planet in the right-hand Planet Index smoothly rotates the 3D celestial sphere to center that planet in direct view.

### 🧭 2. Left & Right Vertical Sidebars
- **Left Time Travel Deck**: Real-time clock, Local/UTC switcher, granular date/time numeric editors, continuous time playback at varying speeds (`1h/s` to `1y/s`), and quick jump steps (`-100y` to `+100y`).
- **Right Celestial Index**: Color-synchronized planetary badges, exact sign degrees, Nakshatra Pada, and 3D focus triggers.

### ☸ 3. Ashtakavarga & Bhinnaashtakavarga (BAV / SAV)
- **Classical Parashari 337-Bindu Matrix**:
  - Surya (Sun) BAV: 48 Bindus
  - Chandra (Moon) BAV: 49 Bindus
  - Mangala (Mars) BAV: 39 Bindus
  - Budha (Mercury) BAV: 54 Bindus
  - Guru (Jupiter) BAV: 56 Bindus
  - Shukra (Venus) BAV: 52 Bindus
  - Shani (Saturn) BAV: 39 Bindus
  - Total Sarvashtakavarga (SAV): **337 Bindus**
- **Interactive North Indian Kundli Visualizer**: Real-time bindu numbers rendered inside all 12 houses.
- **Master SAV Table & Individual 8-Contributor Breakdown**: Exact 1/0 benefic points from Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, and Lagna across all 12 signs.

### 🔢 4. Vedic Sankhya Shastra & Chaldean Numerology
- **Four Core Numbers**:
  - **Mulank (Driver / Psychic Number)**: Day of birth (1–9).
  - **Bhagyank (Destiny / Conductor Number)**: Full date sum (1–9).
  - **Namank (Chaldean & Pythagorean)**: Full name vibration, Soul Urge (vowels), and Personality (consonants) with compatibility alerts.
  - **Kua & Personal Year**: Directional harmonic transit numbers.
- **3x3 Loshu Grid (लोशू चक्र)**:
  - 8 Planes of Fortune (Mental, Emotional, Practical, Thought, Willpower, Action, Golden Raj Yoga 4-5-6, Silver Raj Yoga 2-5-8).
  - Missing numbers detection with Vedic remedies (Rudraksha, Gemstones, Mantras, Colors).
- **Planetary Friendship & Compatibility Matrix**: Rulership, lucky colors, days, and stones.

### 📊 5. Comprehensive Ephemeris & Kundli
- **North Indian Kundli Chart**: Diamond chart with retrograde markers, combustion tags, and house rulers.
- **Full Ephemeris Table**: DMS coordinates, Nakshatra Padas, speeds, houses, and Upagraha positions.
- **Ayanamsha Support**: Lahiri (Chitrapaksha), KP (Krishnamurti), B.V. Raman, and Tropical (Sayana).

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **3D Engine**: [Three.js](https://threejs.org/) & [@react-three/fiber](https://r3f.docs.pmnd.rs/) & [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Glassmorphism
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Language**: TypeScript

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Unit Tests
```bash
npm test
```
Verifies Ayanamsha algorithms, Parashari Ashtakavarga 337-bindu constants, and Sankhya Shastra calculations.