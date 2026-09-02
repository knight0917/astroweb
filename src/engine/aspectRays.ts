import { RASHIS } from "./constants";

export interface AspectRay {
  fromHouse: number; // 1..12
  toHouse: number; // 1..12
  fromRashiIndex: number; // 0..11
  toRashiIndex: number; // 0..11
  type: "graha" | "rashi";
  aspectLabel: string; // e.g. "7th Drishti", "4th Special", "5th Trikona", "3rd Upachaya", "Rashi Drishti"
  color: string;
  sourceName: string;
  targetHouseName: string;
}

export function calculateGrahaDrishtis(
  planetId: string,
  planetName: string,
  fromHouse: number,
  fromRashiIndex: number,
  ascRashiIndex: number
): AspectRay[] {
  const rays: AspectRay[] = [];
  const pLower = planetId.toLowerCase();

  const addAspect = (offset: number, label: string, color: string) => {
    const toHouse = ((fromHouse - 1 + (offset - 1)) % 12) + 1;
    const toRashiIndex = (fromRashiIndex + (offset - 1)) % 12;
    rays.push({
      fromHouse,
      toHouse,
      fromRashiIndex,
      toRashiIndex,
      type: "graha",
      aspectLabel: label,
      color,
      sourceName: planetName,
      targetHouseName: `House ${toHouse} (${RASHIS[toRashiIndex].englishName})`,
    });
  };

  // Color selection by Graha
  let grahaColor = "#f59e0b"; // Default Amber
  if (pLower.includes("mars")) grahaColor = "#ef4444"; // Red
  else if (pLower.includes("jupiter")) grahaColor = "#eab308"; // Golden Yellow
  else if (pLower.includes("saturn")) grahaColor = "#3b82f6"; // Blue
  else if (pLower.includes("mercury")) grahaColor = "#10b981"; // Emerald
  else if (pLower.includes("venus")) grahaColor = "#ec4899"; // Pink
  else if (pLower.includes("sun")) grahaColor = "#f97316"; // Orange
  else if (pLower.includes("moon")) grahaColor = "#a855f7"; // Purple
  else if (pLower.includes("rahu")) grahaColor = "#6366f1"; // Indigo
  else if (pLower.includes("ketu")) grahaColor = "#8b5cf6"; // Violet

  // 1. All Grahas cast full 7th House Drishti (180° Direct)
  addAspect(7, "7th Direct Drishti (180°)", grahaColor);

  // 2. Classical Special Planetary Aspects (Vishesha Drishti)
  if (pLower.includes("mars")) {
    addAspect(4, "4th Special (Mars)", "#ef4444");
    addAspect(8, "8th Special (Mars)", "#ef4444");
  } else if (pLower.includes("jupiter")) {
    addAspect(5, "5th Trikona (Guru)", "#eab308");
    addAspect(9, "9th Trikona (Guru)", "#eab308");
  } else if (pLower.includes("saturn")) {
    addAspect(3, "3rd Special (Shani)", "#3b82f6");
    addAspect(10, "10th Special (Shani)", "#3b82f6");
  } else if (pLower.includes("rahu") || pLower.includes("ketu")) {
    addAspect(5, "5th Trikona (Nadi)", "#6366f1");
    addAspect(9, "9th Trikona (Nadi)", "#6366f1");
  }

  return rays;
}

export function calculateRashiDrishtis(
  sourceName: string,
  fromRashiIndex: number,
  ascRashiIndex: number
): AspectRay[] {
  const fromHouse = ((fromRashiIndex - ascRashiIndex + 12) % 12) + 1;
  const rays: AspectRay[] = [];
  const modality = fromRashiIndex % 3; // 0 = Chara (Moveable), 1 = Sthira (Fixed), 2 = Dwiswabhava (Dual)

  if (modality === 0) {
    // Chara (Moveable: Aries, Cancer, Libra, Capricorn) aspects Fixed except adjacent
    const fixedSigns = [1, 4, 7, 10];
    const adjacent = (fromRashiIndex + 1) % 12;
    fixedSigns.forEach((toRashi) => {
      if (toRashi !== adjacent) {
        const toHouse = ((toRashi - ascRashiIndex + 12) % 12) + 1;
        rays.push({
          fromHouse,
          toHouse,
          fromRashiIndex,
          toRashiIndex: toRashi,
          type: "rashi",
          aspectLabel: `Rashi Drishti (${RASHIS[fromRashiIndex].englishName} → ${RASHIS[toRashi].englishName})`,
          color: "#06b6d4", // Cyan
          sourceName,
          targetHouseName: `House ${toHouse} (${RASHIS[toRashi].englishName})`,
        });
      }
    });
  } else if (modality === 1) {
    // Sthira (Fixed: Taurus, Leo, Scorpio, Aquarius) aspects Moveable except adjacent
    const moveableSigns = [0, 3, 6, 9];
    const adjacent = (fromRashiIndex - 1 + 12) % 12;
    moveableSigns.forEach((toRashi) => {
      if (toRashi !== adjacent) {
        const toHouse = ((toRashi - ascRashiIndex + 12) % 12) + 1;
        rays.push({
          fromHouse,
          toHouse,
          fromRashiIndex,
          toRashiIndex: toRashi,
          type: "rashi",
          aspectLabel: `Rashi Drishti (${RASHIS[fromRashiIndex].englishName} → ${RASHIS[toRashi].englishName})`,
          color: "#06b6d4", // Cyan
          sourceName,
          targetHouseName: `House ${toHouse} (${RASHIS[toRashi].englishName})`,
        });
      }
    });
  } else {
    // Dwiswabhava (Dual: Gemini, Virgo, Sagittarius, Pisces) aspects all other 3 Dual signs
    const dualSigns = [2, 5, 8, 11];
    dualSigns.forEach((toRashi) => {
      if (toRashi !== fromRashiIndex) {
        const toHouse = ((toRashi - ascRashiIndex + 12) % 12) + 1;
        rays.push({
          fromHouse,
          toHouse,
          fromRashiIndex,
          toRashiIndex: toRashi,
          type: "rashi",
          aspectLabel: `Dual Rashi Drishti (${RASHIS[fromRashiIndex].englishName} → ${RASHIS[toRashi].englishName})`,
          color: "#06b6d4", // Cyan
          sourceName,
          targetHouseName: `House ${toHouse} (${RASHIS[toRashi].englishName})`,
        });
      }
    });
  }

  return rays;
}

// North Indian Chart House Center Coordinates (viewBox 0 0 400 400)
export const NORTH_HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 102.5 },
  2: { x: 102.5, y: 37.5 },
  3: { x: 37.5, y: 102.5 },
  4: { x: 102.5, y: 200 },
  5: { x: 37.5, y: 297.5 },
  6: { x: 102.5, y: 362.5 },
  7: { x: 200, y: 297.5 },
  8: { x: 297.5, y: 362.5 },
  9: { x: 362.5, y: 297.5 },
  10: { x: 297.5, y: 200 },
  11: { x: 362.5, y: 102.5 },
  12: { x: 297.5, y: 37.5 },
};

// North Indian Chart House Polygons for Background Auras
export const NORTH_HOUSE_POLYGONS: Record<number, string> = {
  1: "200,5 297.5,102.5 200,200 102.5,102.5",
  2: "5,5 200,5 102.5,102.5",
  3: "5,5 102.5,102.5 5,200",
  4: "5,200 102.5,102.5 200,200 102.5,297.5",
  5: "5,200 102.5,297.5 5,395",
  6: "5,395 102.5,297.5 200,395",
  7: "200,395 297.5,297.5 200,200 102.5,297.5",
  8: "200,395 297.5,297.5 395,395",
  9: "395,395 297.5,297.5 395,200",
  10: "395,200 297.5,297.5 200,200 297.5,102.5",
  11: "395,200 297.5,102.5 395,5",
  12: "200,5 395,5 297.5,102.5",
};

// South Indian Chart Rashi Cell Centers (viewBox 0 0 400 400)
export const SOUTH_RASHI_CENTERS: Record<number, { x: number; y: number }> = {
  11: { x: 50, y: 50 }, // Pisces (Col 1, Row 1)
  0: { x: 150, y: 50 }, // Aries (Col 2, Row 1)
  1: { x: 250, y: 50 }, // Taurus (Col 3, Row 1)
  2: { x: 350, y: 50 }, // Gemini (Col 4, Row 1)
  10: { x: 50, y: 150 }, // Aquarius (Col 1, Row 2)
  3: { x: 350, y: 150 }, // Cancer (Col 4, Row 2)
  9: { x: 50, y: 250 }, // Capricorn (Col 1, Row 3)
  4: { x: 350, y: 250 }, // Leo (Col 4, Row 3)
  8: { x: 50, y: 350 }, // Sagittarius (Col 1, Row 4)
  7: { x: 150, y: 350 }, // Scorpio (Col 2, Row 4)
  6: { x: 250, y: 350 }, // Libra (Col 3, Row 4)
  5: { x: 350, y: 350 }, // Virgo (Col 4, Row 4)
};
