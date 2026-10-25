import * as THREE from "three";

/**
 * Procedural canvas textures for the SkyDome "Graha-Mandalam" look.
 * Generated lazily on the client, once per key, and cached for the session (no asset downloads).
 */

const textureCache = new Map<string, THREE.Texture>();

function cached(key: string, build: () => THREE.Texture): THREE.Texture {
  const hit = textureCache.get(key);
  if (hit) return hit;
  const tex = build();
  textureCache.set(key, tex);
  return tex;
}

function createCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  if (typeof document === "undefined") {
    throw new Error("Procedural textures can only be generated in a browser environment");
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable");
  return [canvas, ctx];
}

function toTexture(canvas: HTMLCanvasElement, srgb = true): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 2;
  tex.needsUpdate = true;
  return tex;
}

// ---------- Deterministic value noise (seamless along X for equirectangular maps) ----------

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeFbm(seed: number, gridX = 16, gridY = 8, octaves = 4) {
  const rand = mulberry32(seed);
  const layers: { gx: number; gy: number; v: Float32Array }[] = [];
  for (let o = 0; o < octaves; o++) {
    const gx = gridX << o;
    const gy = gridY << o;
    const v = new Float32Array(gx * (gy + 1));
    for (let i = 0; i < v.length; i++) v[i] = rand();
    layers.push({ gx, gy, v });
  }
  const smooth = (t: number) => t * t * (3 - 2 * t);
  /** u, v in [0,1]; returns ~[0,1]. */
  return (u: number, vv: number): number => {
    let sum = 0;
    let amp = 0.5;
    let norm = 0;
    for (const { gx, gy, v } of layers) {
      const x = u * gx;
      const y = vv * gy;
      const x0 = Math.floor(x);
      const y0 = Math.min(Math.floor(y), gy - 1);
      const fx = smooth(x - x0);
      const fy = smooth(y - y0);
      const xa = ((x0 % gx) + gx) % gx;
      const xb = (xa + 1) % gx;
      const a = v[y0 * gx + xa];
      const b = v[y0 * gx + xb];
      const c = v[(y0 + 1) * gx + xa];
      const d = v[(y0 + 1) * gx + xb];
      sum += amp * (a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy);
      norm += amp;
      amp *= 0.5;
    }
    return sum / norm;
  };
}

type RGB = [number, number, number];

function hex(h: string): RGB {
  const n = parseInt(h.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: RGB, b: RGB, t: number): RGB {
  const k = Math.max(0, Math.min(1, t));
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
}

function paintPixels(w: number, h: number, shade: (u: number, v: number) => RGB): HTMLCanvasElement {
  const [canvas, ctx] = createCanvas(w, h);
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const [r, g, b] = shade(x / w, y / h);
      const i = (y * w + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function drawCraters(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number, count: number, dark: string, rim: string) {
  const rand = mulberry32(seed);
  for (let i = 0; i < count; i++) {
    const x = rand() * w;
    const y = h * 0.12 + rand() * h * 0.76;
    const r = 1.5 + Math.pow(rand(), 3) * 10;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = dark;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - r * 0.15, y - r * 0.15, r, Math.PI * 0.9, Math.PI * 1.7);
    ctx.strokeStyle = rim;
    ctx.lineWidth = Math.max(0.6, r * 0.18);
    ctx.stroke();
  }
}

// ---------- Planet surface maps ----------

const W = 256;
const H = 128;

function bandedMap(seed: number, palette: string[], turbulence: number, bandFreq: number): HTMLCanvasElement {
  const fbm = makeFbm(seed, 8, 4, 4);
  const cols = palette.map(hex);
  return paintPixels(W, H, (u, v) => {
    const warp = (fbm(u, v) - 0.5) * turbulence;
    const band = (Math.sin((v + warp) * Math.PI * bandFreq) + 1) / 2;
    const idx = band * (cols.length - 1);
    const i0 = Math.floor(idx);
    const i1 = Math.min(cols.length - 1, i0 + 1);
    const base = mix(cols[i0], cols[i1], idx - i0);
    const grain = 0.9 + fbm(u * 3 % 1, v) * 0.2;
    return [base[0] * grain, base[1] * grain, base[2] * grain];
  });
}

function mottledMap(seed: number, lo: string, hi: string, contrast = 1.4): HTMLCanvasElement {
  const fbm = makeFbm(seed, 12, 6, 5);
  const a = hex(lo);
  const b = hex(hi);
  return paintPixels(W, H, (u, v) => mix(a, b, (fbm(u, v) - 0.5) * contrast + 0.5));
}

function buildPlanetCanvas(id: string): HTMLCanvasElement {
  switch (id) {
    case "Sun": {
      const fbm = makeFbm(7, 24, 12, 5);
      const canvas = paintPixels(W, H, (u, v) => {
        const n = fbm(u, v);
        return mix(hex("#d9761c"), hex("#ffd879"), n * 1.5 - 0.15);
      });
      const ctx = canvas.getContext("2d")!;
      const rand = mulberry32(99);
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(rand() * W, H * 0.35 + rand() * H * 0.3, 1.5 + rand() * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(60,25,5,0.85)";
        ctx.fill();
      }
      return canvas;
    }
    case "Moon": {
      const canvas = mottledMap(11, "#5f5d5a", "#c9c6c0", 1.8);
      drawCraters(canvas.getContext("2d")!, W, H, 12, 70, "rgba(60,58,55,0.35)", "rgba(230,228,222,0.25)");
      return canvas;
    }
    case "Mercury": {
      const canvas = mottledMap(21, "#4d443c", "#a89b8c", 1.6);
      drawCraters(canvas.getContext("2d")!, W, H, 22, 90, "rgba(40,34,30,0.4)", "rgba(210,200,185,0.2)");
      return canvas;
    }
    case "Venus":
      return bandedMap(31, ["#c9a46a", "#ecd9b0", "#f7ecd2", "#dcc08a"], 0.9, 5);
    case "Mars": {
      const fbm = makeFbm(41, 12, 6, 5);
      return paintPixels(W, H, (u, v) => {
        const n = fbm(u, v);
        const polar = Math.max(0, Math.abs(v - 0.5) * 2 - 0.86) * 7;
        const base = mix(hex("#5c2416"), hex("#d4673e"), n * 1.6 - 0.3);
        return mix(base, hex("#f2e8e0"), polar);
      });
    }
    case "Jupiter": {
      const canvas = bandedMap(51, ["#8a5a3c", "#d9b48a", "#f1e3c6", "#b98a5e", "#e8d2ae"], 0.35, 14);
      const ctx = canvas.getContext("2d")!;
      ctx.beginPath();
      ctx.ellipse(W * 0.62, H * 0.64, 13, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(176,82,52,0.85)";
      ctx.fill();
      return canvas;
    }
    case "Saturn":
      return bandedMap(61, ["#b5975f", "#e6d3a3", "#f3e6c4", "#cdb37c"], 0.25, 11);
    case "Uranus":
      return bandedMap(71, ["#8fd0d6", "#b5e4e8", "#9fd8dd"], 0.15, 6);
    case "Neptune":
      return bandedMap(81, ["#2e4fb3", "#4b74d6", "#3a5fc4", "#6d93e6"], 0.4, 7);
    case "Pluto":
      return mottledMap(91, "#6b5643", "#d9c3a5", 1.7);
    case "Rahu":
      return mottledMap(101, "#120c18", "#4a3260", 2.0);
    case "Ketu":
      return mottledMap(111, "#160c08", "#7a3b18", 2.0);
    case "Earth": {
      const land = makeFbm(121, 8, 4, 5);
      const cloud = makeFbm(122, 16, 8, 4);
      return paintPixels(W, H, (u, v) => {
        const polar = Math.abs(v - 0.5) * 2;
        const l = land(u, v);
        let c: RGB = l > 0.53 ? mix(hex("#3f6b2c"), hex("#a08a5a"), (l - 0.53) * 6) : mix(hex("#0b2a5c"), hex("#1f5c9e"), l * 1.6);
        if (polar > 0.86) c = mix(c, hex("#eef4f8"), (polar - 0.86) * 8);
        const cl = Math.max(0, cloud(u, v) - 0.55) * 2.6;
        return mix(c, hex("#ffffff"), cl);
      });
    }
    default:
      return mottledMap(131, "#3a3340", "#a99fb3", 1.4);
  }
}

export function getPlanetTexture(id: string): THREE.Texture {
  return cached(`planet:${id}`, () => toTexture(buildPlanetCanvas(id)));
}

// ---------- Glow / rays sprites ----------

export function getGlowTexture(): THREE.Texture {
  return cached("glow", () => {
    const size = 128;
    const [canvas, ctx] = createCanvas(size, size);
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.18, "rgba(255,255,255,0.55)");
    g.addColorStop(0.45, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return toTexture(canvas, false);
  });
}

export function getRaysTexture(): THREE.Texture {
  return cached("rays", () => {
    const size = 256;
    const [canvas, ctx] = createCanvas(size, size);
    const c = size / 2;
    const rand = mulberry32(5);
    ctx.translate(c, c);
    const rays = 18;
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * Math.PI * 2 + rand() * 0.12;
      const len = c * (0.62 + rand() * 0.38);
      const width = 0.05 + rand() * 0.05;
      const g = ctx.createLinearGradient(0, 0, Math.cos(a) * len, Math.sin(a) * len);
      g.addColorStop(0, "rgba(255,255,255,0.55)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a - width) * len, Math.sin(a - width) * len);
      ctx.lineTo(Math.cos(a + width) * len, Math.sin(a + width) * len);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
    }
    return toTexture(canvas, false);
  });
}

// ---------- Plum nebula sky ----------

export function getNebulaSkyTexture(): THREE.Texture {
  return cached("nebula", () => {
    const w = 1024;
    const h = 512;
    const fbm = makeFbm(201, 8, 4, 5);
    const base = hex("#14081a");
    const plum = hex("#3b1238");
    const wine = hex("#4a1430");
    const canvas = paintPixels(w, h, (u, v) => {
      const n = fbm(u, v);
      const band = Math.exp(-Math.pow((v - 0.5) / 0.22, 2));
      const c1 = mix(base, plum, Math.max(0, n - 0.35) * 1.6 * (0.45 + band * 0.55));
      return mix(c1, wine, Math.max(0, fbm((u + 0.37) % 1, v) - 0.6) * 1.8 * band);
    });
    const ctx = canvas.getContext("2d")!;
    const rand = mulberry32(202);
    for (let i = 0; i < 900; i++) {
      const a = 0.15 + rand() * 0.55;
      ctx.fillStyle = `rgba(255,248,240,${a.toFixed(2)})`;
      const s = rand() < 0.94 ? 0.8 : 1.6;
      ctx.fillRect(rand() * w, rand() * h, s, s);
    }
    return toTexture(canvas);
  });
}

// ---------- Text sprites (cheap GPU labels for dense numeric ticks) ----------

export function getTextTexture(text: string, color: string, fontPx = 40): { texture: THREE.Texture; aspect: number } {
  const key = `text:${text}:${color}:${fontPx}`;
  const font = `300 ${fontPx}px "JetBrains Mono", ui-monospace, monospace`;
  let aspect = 1;
  const texture = cached(key, () => {
    const [probe, pctx] = createCanvas(4, 4);
    void probe;
    pctx.font = font;
    const width = Math.ceil(pctx.measureText(text).width) + 8;
    const height = Math.ceil(fontPx * 1.3);
    const [canvas, ctx] = createCanvas(width, height);
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.fillText(text, 4, height / 2);
    return toTexture(canvas);
  });
  const img = texture.image as HTMLCanvasElement | undefined;
  if (img && img.height > 0) aspect = img.width / img.height;
  return { texture, aspect };
}
