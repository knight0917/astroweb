/**
 * Typography and coordinate formatting utilities for the SkyDome "Graha-Mandalam" HUD.
 */

/** Compact DMS in the reel style: 23°25′10″ */
export function compactDMS(deg: number): string {
  const a = Math.abs(deg);
  const d = Math.floor(a);
  const mFloat = (a - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.floor((mFloat - m) * 60);
  return `${d}°${String(m).padStart(2, "0")}′${String(s).padStart(2, "0")}″`;
}

export const SD_FONT_SERIF = `"Tiro Devanagari Sanskrit", "Noto Serif Devanagari", "Nirmala UI", "Mangal", Georgia, serif`;
export const SD_FONT_MONO = `"JetBrains Mono", ui-monospace, "SFMono-Regular", Consolas, monospace`;
