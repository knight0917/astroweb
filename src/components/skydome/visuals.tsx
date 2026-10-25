"use client";

/**
 * SkyDome "Graha-Mandalam" visual layer: atmosphere, zodiac/nakshatra/house rings,
 * textured planet bodies and geocentric orbit trails.
 * Pure presentation — all astrological data is supplied by the caller.
 */

import React, { useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { eclipticToCartesian } from "../../engine/skyCoordinates";
import { RASHIS, NAKSHATRAS } from "../../engine/constants";
import { getGlowTexture, getNebulaSkyTexture, getPlanetTexture, getRaysTexture, getTextTexture } from "./textures";
import { SD_FONT_MONO, SD_FONT_SERIF } from "./devanagari";

export const SD_COLORS = Object.freeze({
  background: "#140818",
  fog: "#170a1b",
  ring: "#cbb5b4",
  ringDim: "#8f7a86",
  rashiText: "#d8c3c9",
  houseLine: "#6f8fb5",
  lagnaLine: "#7fd3e6",
  houseNumber: "#7dd3fc",
  starCore: "#fff7ee",
  trailDefault: "#efe6d8",
  gold: "#e3b75f",
});

export const ZODIAC_RADIUS = 40;

function circlePoints(radius: number, segments: number, y = 0): Float32Array {
  const arr = new Float32Array((segments + 1) * 3);
  for (let i = 0; i <= segments; i++) {
    const p = eclipticToCartesian((i / segments) * 360, 0, radius);
    arr[i * 3] = p[0];
    arr[i * 3 + 1] = p[1] + y;
    arr[i * 3 + 2] = p[2];
  }
  return arr;
}

// ---------------------------------------------------------------------------
// Atmosphere
// ---------------------------------------------------------------------------

export function SceneAtmosphere() {
  const nebula = useMemo(() => getNebulaSkyTexture(), []);

  const starGeometry = useMemo(() => {
    const count = 260;
    const pos = new Float32Array(count * 3);
    let seed = 17;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < count; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = 220 + rand() * 80;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  return (
    <>
      <color attach="background" args={[SD_COLORS.background]} />
      <fog attach="fog" args={[SD_COLORS.fog, 120, 340]} />

      {/* Plum nebula sky sphere */}
      <mesh renderOrder={-10}>
        <sphereGeometry args={[400, 48, 24]} />
        <meshBasicMaterial map={nebula} side={THREE.BackSide} fog={false} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* Sparse bright stars */}
      <points geometry={starGeometry}>
        <pointsMaterial color="#fff6ec" size={1.8} sizeAttenuation={false} transparent opacity={0.75} fog={false} depthWrite={false} />
      </points>
    </>
  );
}

// ---------------------------------------------------------------------------
// Zodiac degree ring (thin double line, 1°/5°/30° ticks, degree numerals, Devanagari rashi names)
// ---------------------------------------------------------------------------

function DegreeSprite({ text, position }: { text: string; position: [number, number, number] }) {
  const { texture, aspect } = useMemo(() => getTextTexture(text, SD_COLORS.ringDim, 40), [text]);
  const h = 0.85;
  return (
    <sprite position={position} scale={[h * aspect, h, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} opacity={0.85} />
    </sprite>
  );
}

export function ZodiacDegreeRing() {
  const R = ZODIAC_RADIUS;
  const inner = useMemo(() => circlePoints(R, 360), [R]);
  const outer = useMemo(() => circlePoints(R + 1.2, 360), [R]);

  const ticks = useMemo(() => {
    const segs: number[] = [];
    for (let d = 0; d < 360; d++) {
      const isSign = d % 30 === 0;
      const isFive = d % 5 === 0;
      const r0 = isSign ? R - 1.0 : R;
      const r1 = isSign ? R + 2.2 : isFive ? R + 0.7 : R + 0.35;
      const a = eclipticToCartesian(d, 0, r0);
      const b = eclipticToCartesian(d, 0, r1);
      segs.push(a[0], a[1], a[2], b[0], b[1], b[2]);
    }
    return new Float32Array(segs);
  }, [R]);

  const degreeLabels = useMemo(() => {
    const out: { key: string; text: string; pos: [number, number, number] }[] = [];
    for (let s = 0; s < 12; s++) {
      for (let k = 0; k < 6; k++) {
        out.push({ key: `${s}-${k}`, text: `${k * 5}°`, pos: eclipticToCartesian(s * 30 + k * 5, 0, R + 2.2) });
      }
    }
    return out;
  }, [R]);

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[inner, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={SD_COLORS.ring} transparent opacity={0.42} />
      </line>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[outer, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={SD_COLORS.ring} transparent opacity={0.22} />
      </line>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ticks, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={SD_COLORS.ring} transparent opacity={0.4} />
      </lineSegments>

      {degreeLabels.map((l) => (
        <DegreeSprite key={l.key} text={l.text} position={l.pos} />
      ))}

      {RASHIS.map((r, i) => {
        const pos = eclipticToCartesian(i * 30 + 15, 0, R + 4.2);
        return (
          <group key={r.index} position={pos}>
            <Html center distanceFactor={42} zIndexRange={[0, 10]}>
              <div className="group relative select-none whitespace-nowrap text-center">
                <span
                  style={{ fontFamily: SD_FONT_SERIF, color: SD_COLORS.rashiText }}
                  className="text-[14px] font-bold tracking-wider opacity-90 transition-opacity group-hover:opacity-100 cursor-default flex items-center justify-center gap-1.5"
                >
                  <span className="text-[15px] text-amber-400">{r.symbol}</span>
                  <span>{r.englishName}</span>
                </span>
                <div
                  style={{ fontFamily: SD_FONT_MONO }}
                  className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 rounded-md border border-[#4a2a44] bg-[#1a0c1d]/95 px-2 py-1 text-[9px] text-[#cdb9c4] opacity-0 shadow-xl transition-opacity group-hover:opacity-100"
                >
                  {r.symbol} {r.englishName} ({r.sanskritName}) · {i * 30}°–{(i + 1) * 30}°
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Nakshatra star ring (dotted ring + glowing yogatara points, labels visible all the time)
// ---------------------------------------------------------------------------

export function NakshatraStarRing() {
  const R = ZODIAC_RADIUS - 2.4;
  const glow = useMemo(() => getGlowTexture(), []);
  const [hovered, setHovered] = useState<number | null>(null);
  const step = 360 / 27;

  const dots = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(circlePoints(R, 240), 3));
    return g;
  }, [R]);

  const ticks = useMemo(() => {
    const segs: number[] = [];
    for (let i = 0; i < 27; i++) {
      const a = eclipticToCartesian(i * step, 0, R - 0.5);
      const b = eclipticToCartesian(i * step, 0, R + 0.5);
      segs.push(a[0], a[1], a[2], b[0], b[1], b[2]);
    }
    return new Float32Array(segs);
  }, [R, step]);

  return (
    <group>
      <points geometry={dots}>
        <pointsMaterial color={SD_COLORS.ringDim} size={1.6} sizeAttenuation={false} transparent opacity={0.55} depthWrite={false} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ticks, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={SD_COLORS.ringDim} transparent opacity={0.45} />
      </lineSegments>

      {NAKSHATRAS.map((nak, i) => {
        const pos = eclipticToCartesian((i + 0.5) * step, 0, R + 0.9);
        const isHover = hovered === i;
        return (
          <group key={nak.index} position={pos}>
            <sprite
              scale={isHover ? [2.8, 2.8, 1] : [1.9, 1.9, 1]}
              onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                setHovered(i);
              }}
              onPointerOut={() => setHovered((h) => (h === i ? null : h))}
            >
              <spriteMaterial map={glow} color={isHover ? "#f59e0b" : SD_COLORS.starCore} transparent opacity={isHover ? 1 : 0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
            </sprite>

            {/* Always-Visible Nakshatra Label in English */}
            <Html center distanceFactor={40} position={[0, -1.2, 0]} zIndexRange={[0, 20]}>
              <div
                className="select-none whitespace-nowrap text-center transition-all cursor-pointer pointer-events-auto group"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
              >
                <div
                  style={{
                    fontFamily: SD_FONT_MONO,
                    textShadow: "0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.9)",
                  }}
                  className={`text-[8.5px] font-semibold tracking-tight transition-all ${
                    isHover
                      ? "text-amber-300 scale-110 font-bold"
                      : "text-amber-100/80 hover:text-amber-300"
                  }`}
                >
                  {nak.sanskritName}
                </div>

                {/* Rich Detail Tooltip on Hover */}
                {isHover && (
                  <div
                    style={{ fontFamily: SD_FONT_MONO }}
                    className="pointer-events-none absolute left-1/2 bottom-full mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[#4a2a44] bg-[#1a0c1d]/95 px-2.5 py-1.5 text-center shadow-2xl z-40 backdrop-blur-md"
                  >
                    <div style={{ fontFamily: SD_FONT_SERIF }} className="text-[12px] text-[#f1e4dc] font-bold">
                      {nak.sanskritName} (#{nak.index})
                    </div>
                    <div className="mt-0.5 text-[8.5px] text-[#d9b46a]">
                      {nak.animalSymbol} {nak.animal} · Lord: {nak.lord} · Deity: {nak.deity}
                    </div>
                    <div className="text-[7.5px] text-slate-400 font-mono mt-0.5">
                      {(i * step).toFixed(1)}° – {((i + 1) * step).toFixed(1)}°
                    </div>
                  </div>
                )}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// House cusp lines + cyan house numerals (details on hover)
// ---------------------------------------------------------------------------

export interface HouseVisualData {
  house: number;
  sanskritName: string;
  significance: string;
  type: string;
  startLon: number;
  endLon: number;
}

export function HouseCuspLines({ houses }: { houses: HouseVisualData[] }) {
  const R = ZODIAC_RADIUS;

  const { normal, lagna } = useMemo(() => {
    const n: number[] = [];
    let l = new Float32Array(6);
    houses.forEach((h, i) => {
      const a = eclipticToCartesian(h.startLon, 0, 3.4);
      const b = eclipticToCartesian(h.startLon, 0, R + 3.2);
      if (i === 0) l = new Float32Array([a[0], a[1], a[2], b[0], b[1], b[2]]);
      else n.push(a[0], a[1], a[2], b[0], b[1], b[2]);
    });
    return { normal: new Float32Array(n), lagna: l };
  }, [houses, R]);

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[normal, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={SD_COLORS.houseLine} transparent opacity={0.34} />
      </lineSegments>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lagna, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={SD_COLORS.lagnaLine} transparent opacity={0.65} />
      </lineSegments>

      {houses.map((h) => {
        const pos = eclipticToCartesian(h.startLon + 3, 0, R + 3.6);
        return (
          <group key={h.house} position={pos}>
            <Html center distanceFactor={42} zIndexRange={[0, 10]}>
              <div className="group relative select-none whitespace-nowrap text-center">
                <span
                  style={{ fontFamily: SD_FONT_MONO, color: SD_COLORS.houseNumber }}
                  className="cursor-default text-[13px] font-light opacity-85 group-hover:opacity-100"
                >
                  {h.house}
                </span>
                <div
                  style={{ fontFamily: SD_FONT_MONO }}
                  className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 rounded-md border border-[#2b4a5c] bg-[#0f1220]/95 px-2 py-1 text-left text-[9px] text-slate-300 opacity-0 shadow-xl transition-opacity group-hover:opacity-100"
                >
                  <div style={{ fontFamily: SD_FONT_SERIF }} className="text-[12px] text-cyan-200">
                    H{h.house} · {h.sanskritName}
                  </div>
                  <div>{h.significance}</div>
                  <div className="text-[#d9b46a]">
                    {h.type} · {h.startLon.toFixed(1)}°–{h.endLon.toFixed(1)}°
                  </div>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Textured planet body
// ---------------------------------------------------------------------------

export interface PlanetBodyProps {
  bodyId: string;
  radius: number;
  color: string;
  /** 0 = idle, 1 = hovered, 2 = selected */
  highlight: 0 | 1 | 2;
  meshRef: React.RefObject<THREE.Mesh | null>;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut: () => void;
}

export function PlanetBody({ bodyId, radius, color, highlight, meshRef, onClick, onPointerOver, onPointerOut }: PlanetBodyProps) {
  const map = useMemo(() => getPlanetTexture(bodyId), [bodyId]);
  const glow = useMemo(() => getGlowTexture(), []);
  const rays = useMemo(() => getRaysTexture(), []);
  const raysRef = useRef<THREE.Sprite>(null);
  const spinRef = useRef<THREE.Group>(null);
  const isSun = bodyId === "Sun";

  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += delta * 0.08;
    if (raysRef.current) {
      const mat = raysRef.current.material as THREE.SpriteMaterial;
      mat.rotation += delta * 0.03;
    }
  });

  const emissiveBoost = highlight === 2 ? 0.55 : highlight === 1 ? 0.3 : 0.06;

  return (
    <group>
      <group ref={spinRef}>
        <mesh ref={meshRef} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
          <sphereGeometry args={[radius, 40, 28]} />
          {isSun ? (
            <meshBasicMaterial map={map} color="#ffe6b0" toneMapped={false} />
          ) : (
            <meshStandardMaterial map={map} roughness={0.95} metalness={0} emissive={color} emissiveIntensity={emissiveBoost} />
          )}
        </mesh>
      </group>

      {isSun && (
        <>
          <sprite scale={[radius * 7.5, radius * 7.5, 1]}>
            <spriteMaterial map={glow} color="#ffb24a" transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
          <sprite ref={raysRef} scale={[radius * 6, radius * 6, 1]}>
            <spriteMaterial map={rays} color="#ffd27a" transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        </>
      )}

      {bodyId === "Saturn" && (
        <group rotation={[-Math.PI / 2 + 0.42, 0.18, 0]}>
          <mesh>
            <ringGeometry args={[radius * 1.35, radius * 1.85, 64]} />
            <meshBasicMaterial color="#dcc79c" side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>
          <mesh>
            <ringGeometry args={[radius * 1.92, radius * 2.35, 64]} />
            <meshBasicMaterial color="#b9a173" side={THREE.DoubleSide} transparent opacity={0.4} />
          </mesh>
        </group>
      )}

      {(bodyId === "Rahu" || bodyId === "Ketu") && (
        <sprite scale={[radius * 4, radius * 4, 1]}>
          <spriteMaterial map={glow} color={bodyId === "Rahu" ? "#8b5cf6" : "#f97316"} transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      )}

      {highlight > 0 && !isSun && (
        <sprite scale={[radius * 4.2, radius * 4.2, 1]}>
          <spriteMaterial map={glow} color={SD_COLORS.gold} transparent opacity={highlight === 2 ? 0.45 : 0.25} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Geocentric orbit trail (fading line + direction arrowheads)
// ---------------------------------------------------------------------------

const UP = new THREE.Vector3(0, 1, 0);

export function OrbitTrail({ points, color }: { points: [number, number, number][]; color: string }) {
  const { vertexColors, arrows } = useMemo(() => {
    const bg = new THREE.Color(SD_COLORS.background);
    const fg = new THREE.Color(color);
    const n = points.length;
    const vc: [number, number, number][] = new Array(n);
    for (let i = 0; i < n; i++) {
      const t = Math.pow(i / Math.max(1, n - 1), 1.6);
      const c = bg.clone().lerp(fg, 0.08 + 0.92 * t);
      vc[i] = [c.r, c.g, c.b];
    }

    const arr: { pos: [number, number, number]; quat: THREE.Quaternion; opacity: number }[] = [];
    if (n > 8) {
      for (const f of [0.3, 0.55, 0.8]) {
        const i = Math.floor(f * (n - 2));
        const a = new THREE.Vector3(...points[i]);
        const b = new THREE.Vector3(...points[i + 1]);
        const dir = b.sub(a);
        if (dir.lengthSq() < 1e-8) continue;
        dir.normalize();
        arr.push({ pos: points[i], quat: new THREE.Quaternion().setFromUnitVectors(UP, dir), opacity: 0.25 + 0.65 * f });
      }
    }
    return { vertexColors: vc, arrows: arr };
  }, [points, color]);

  if (points.length < 2) return null;

  return (
    <group>
      <Line points={points} vertexColors={vertexColors} lineWidth={1.35} transparent opacity={0.95} depthWrite={false} />
      {arrows.map((a, idx) => (
        <mesh key={idx} position={a.pos} quaternion={a.quat}>
          <coneGeometry args={[0.22, 0.6, 3]} />
          <meshBasicMaterial color={color} transparent opacity={a.opacity} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
