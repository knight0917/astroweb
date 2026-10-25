import * as Astronomy from "astronomy-engine";
import { toSiderealLongitude } from "./ayanamsha";

/**
 * Geocentric orbital trail sampling for the SkyDome "Graha-Mandalam" view.
 *
 * Planets are placed at a scene radius derived from their true geocentric distance, so
 * that Mercury/Venus trace epicyclic loops around the Sun and outer planets show
 * retrograde loops — exactly as the geocentric sky actually behaves.
 *
 * Pure functions only; no rendering concerns live here.
 */

export interface TrailSample {
  /** Epoch milliseconds (UTC). */
  t: number;
  /** Sidereal ecliptic longitude in degrees [0, 360). */
  lon: number;
  /** Ecliptic latitude in degrees. */
  lat: number;
  /** Geocentric distance in astronomical units. */
  distAU: number;
}

export interface TrailConfig {
  body: Astronomy.Body;
  /** Length of the visible trail behind the current position, in days. */
  windowDays: number;
  /** Number of samples used to draw the trail window. */
  samples: number;
}

const DAY_MS = 86_400_000;

const TRAIL_CONFIGS: Readonly<Record<string, TrailConfig>> = Object.freeze({
  Sun: { body: Astronomy.Body.Sun, windowDays: 365.25, samples: 240 },
  Moon: { body: Astronomy.Body.Moon, windowDays: 27.32, samples: 120 },
  Mercury: { body: Astronomy.Body.Mercury, windowDays: 440, samples: 260 },
  Venus: { body: Astronomy.Body.Venus, windowDays: 584, samples: 260 },
  Mars: { body: Astronomy.Body.Mars, windowDays: 780, samples: 260 },
  Jupiter: { body: Astronomy.Body.Jupiter, windowDays: 1460, samples: 240 },
  Saturn: { body: Astronomy.Body.Saturn, windowDays: 2190, samples: 240 },
  Uranus: { body: Astronomy.Body.Uranus, windowDays: 3650, samples: 160 },
  Neptune: { body: Astronomy.Body.Neptune, windowDays: 3650, samples: 140 },
  Pluto: { body: Astronomy.Body.Pluto, windowDays: 3650, samples: 140 },
});

/** Returns the trail configuration for a body id, or `undefined` if the body has no physical trail (e.g. Rahu/Ketu). */
export function getTrailConfig(bodyId: string): TrailConfig | undefined {
  return Object.prototype.hasOwnProperty.call(TRAIL_CONFIGS, bodyId) ? TRAIL_CONFIGS[bodyId] : undefined;
}

export function getTrailWindowMs(bodyId: string): number {
  const cfg = getTrailConfig(bodyId);
  if (!cfg) throw new RangeError(`No geocentric trail configured for body "${bodyId}"`);
  return cfg.windowDays * DAY_MS;
}

// Scene-radius mapping constants (Earth globe radius in the scene is 2.6).
export const SCENE_EARTH_RADIUS = 2.6;
const RADIUS_BASE = 4.6;
const RADIUS_SCALE = 9;
const RADIUS_POWER = 0.45;
const SATURN_CAP_AU = 11;
const OUTER_SPAN_AU = 39;
const OUTER_EXTRA_RADIUS = 5.5;

/**
 * Maps a geocentric distance (AU) to a scene radius.
 * Power-scaled for d ≤ 11 AU (Moon ≈ 5.2 … Saturn ≈ 31), then compressed linearly so that
 * Uranus/Neptune/Pluto remain inside the zodiac ring (≤ 36.6).
 */
export function geocentricDistanceToSceneRadius(distAU: number): number {
  if (!Number.isFinite(distAU) || distAU <= 0) {
    throw new RangeError(`distAU must be a finite positive number, received ${distAU}`);
  }
  const capped = Math.min(distAU, SATURN_CAP_AU);
  const inner = RADIUS_BASE + RADIUS_SCALE * Math.pow(capped, RADIUS_POWER);
  if (distAU <= SATURN_CAP_AU) return inner;
  const outerFraction = Math.min(1, (distAU - SATURN_CAP_AU) / OUTER_SPAN_AU);
  return inner + outerFraction * OUTER_EXTRA_RADIUS;
}

function sampleAt(cfg: TrailConfig, t: number, ayanamshaDeg: number): TrailSample {
  const time = Astronomy.MakeTime(new Date(t));
  const vec = Astronomy.GeoVector(cfg.body, time, true);
  const ecl = Astronomy.Ecliptic(vec);
  return {
    t,
    lon: toSiderealLongitude(ecl.elon, ayanamshaDeg),
    lat: ecl.elat,
    distAU: Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z),
  };
}

/**
 * Samples a body's geocentric path over its trail window ending at `endMs` (inclusive), oldest first.
 * The ayanamsha is held constant across the window (drift ≈ 0.014°/yr — visually negligible).
 */
export function sampleGeocentricTrail(bodyId: string, endMs: number, ayanamshaDeg: number): TrailSample[] {
  const cfg = getTrailConfig(bodyId);
  if (!cfg) throw new RangeError(`No geocentric trail configured for body "${bodyId}"`);
  if (!Number.isFinite(endMs)) throw new RangeError(`endMs must be finite, received ${endMs}`);
  if (!Number.isFinite(ayanamshaDeg)) throw new RangeError(`ayanamshaDeg must be finite, received ${ayanamshaDeg}`);

  const windowMs = cfg.windowDays * DAY_MS;
  const step = windowMs / (cfg.samples - 1);
  const out: TrailSample[] = new Array(cfg.samples);
  for (let i = 0; i < cfg.samples; i++) {
    out[i] = sampleAt(cfg, endMs - windowMs + i * step, ayanamshaDeg);
  }
  return out;
}

/**
 * Advances an existing trail buffer to a new head sample, mutating and returning `buffer`.
 * - Small forward steps append (respecting minimum sample spacing) and trim the tail.
 * - Small backward steps pop samples newer than the head.
 * - Large jumps, empty buffers or depleted buffers trigger a full reseed.
 */
export function advanceTrail(
  bodyId: string,
  buffer: TrailSample[] | undefined,
  head: TrailSample,
  ayanamshaDeg: number
): TrailSample[] {
  const cfg = getTrailConfig(bodyId);
  if (!cfg) throw new RangeError(`No geocentric trail configured for body "${bodyId}"`);

  const windowMs = cfg.windowDays * DAY_MS;
  const spacing = windowMs / (cfg.samples - 1);
  const jumpLimit = windowMs / 30;

  if (!buffer || buffer.length < 2) return sampleGeocentricTrail(bodyId, head.t, ayanamshaDeg);

  const last = buffer[buffer.length - 1];
  const delta = head.t - last.t;

  if (Math.abs(delta) > jumpLimit) return sampleGeocentricTrail(bodyId, head.t, ayanamshaDeg);

  if (delta >= spacing) {
    buffer.push(head);
    const cutoff = head.t - windowMs;
    let drop = 0;
    while (drop < buffer.length - 2 && buffer[drop].t < cutoff) drop++;
    if (drop > 0) buffer.splice(0, drop);
  } else if (delta > 0) {
    // Keep the head sample pinned to the latest current time until the next spacing interval
    buffer[buffer.length - 1] = head;
  } else if (delta < 0) {
    while (buffer.length > 0 && buffer[buffer.length - 1].t > head.t) buffer.pop();
    if (buffer.length < cfg.samples / 4) return sampleGeocentricTrail(bodyId, head.t, ayanamshaDeg);
  }
  return buffer;
}
