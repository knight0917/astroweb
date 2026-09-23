"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useAstroStore } from "../store/useAstroStore";
import { eclipticToCartesian, horizontalToCartesian } from "../engine/skyCoordinates";
import { RASHIS, NAKSHATRAS } from "../engine/constants";
import { formatDMS } from "../engine/rashiNakshatra";
import VerticalTimeTravel from "./VerticalTimeTravel";
import PlanetIndexDeck from "./PlanetIndexDeck";
import {
  evaluateNeechaVakriPlanets,
  evaluateCombustionNuances,
  NeechaVakriPlanetInfo,
  CombustionNuanceInfo,
} from "../engine/omniAspectEngine";
import { evaluateJatakaChandrika } from "../engine/jatakaChandrika";
import { calculateVimshottariDasha } from "../engine/dasha";
import { JatakaChandrikaGrahaRole } from "../engine/types";

// Rashi Sector Vibrant Theme Colors
const RASHI_COLORS = [
  "#ef4444", // 0 Mesha (Aries) - Fire Red
  "#d97706", // 1 Vrishabha (Taurus) - Earthy Amber
  "#10b981", // 2 Mithuna (Gemini) - Bright Emerald
  "#38bdf8", // 3 Karka (Cancer) - Moon Silver/Cyan
  "#f59e0b", // 4 Simha (Leo) - Solar Gold
  "#059669", // 5 Kanya (Virgo) - Forest Green
  "#f43f5e", // 6 Tula (Libra) - Rose Pink
  "#991b1b", // 7 Vrischika (Scorpio) - Deep Crimson
  "#ea580c", // 8 Dhanu (Sagittarius) - Sacred Saffron
  "#64748b", // 9 Makara (Capricorn) - Slate Earth
  "#06b6d4", // 10 Kumbha (Aquarius) - Electric Cyan
  "#6366f1", // 11 Meena (Pisces) - Deep Mystic Indigo
];

// Calculate Vedic Graha Drishti (Planetary Aspect Offsets in Degrees & House Offsets)
function getVedicAspects(planetName: string): { houseOffset: number; degOffset: number; label: string }[] {
  switch (planetName) {
    case "Mars":
      return [
        { houseOffset: 4, degOffset: 90, label: "4th Aspect (Chaturtha Drishti)" },
        { houseOffset: 7, degOffset: 180, label: "7th Full Aspect (Saptama Drishti)" },
        { houseOffset: 8, degOffset: 210, label: "8th Aspect (Ashtama Drishti)" },
      ];
    case "Jupiter":
      return [
        { houseOffset: 5, degOffset: 120, label: "5th Trine Aspect (Panchama Drishti)" },
        { houseOffset: 7, degOffset: 180, label: "7th Full Aspect (Saptama Drishti)" },
        { houseOffset: 9, degOffset: 240, label: "9th Trine Aspect (Navama Drishti)" },
      ];
    case "Saturn":
      return [
        { houseOffset: 3, degOffset: 60, label: "3rd Aspect (Tritiya Drishti)" },
        { houseOffset: 7, degOffset: 180, label: "7th Full Aspect (Saptama Drishti)" },
        { houseOffset: 10, degOffset: 270, label: "10th Aspect (Dashama Drishti)" },
      ];
    case "Rahu":
    case "Ketu":
      return [
        { houseOffset: 5, degOffset: 120, label: "5th Trine Aspect (Panchama Drishti)" },
        { houseOffset: 7, degOffset: 180, label: "7th Full Aspect (Saptama Drishti)" },
        { houseOffset: 9, degOffset: 240, label: "9th Trine Aspect (Navama Drishti)" },
      ];
    default:
      return [
        { houseOffset: 7, degOffset: 180, label: "7th Full Aspect (Saptama Drishti)" },
      ];
  }
}

// Realistic 3D Central Earth Globe with Continents, Atmospheric Glow & Location Pin
function CentralEarth({
  observerLat,
  observerLon,
  cityName,
}: {
  observerLat: number;
  observerLon: number;
  cityName: string;
}) {
  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Slow diurnal rotation
  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.03;
    }
  });

  const earthRadius = 5.0;

  // Compute 3D position of observer pin on Earth's surface
  const pinPos = useMemo(() => {
    const latRad = (observerLat * Math.PI) / 180;
    const lonRad = (observerLon * Math.PI) / 180;
    const r = earthRadius + 0.1;
    const x = r * Math.cos(latRad) * Math.sin(lonRad);
    const y = r * Math.sin(latRad);
    const z = r * Math.cos(latRad) * Math.cos(lonRad);
    return [x, y, z] as [number, number, number];
  }, [observerLat, observerLon]);

  return (
    <group ref={earthRef} rotation={[0.41, 0, 0]}>
      {/* Ocean Core Sphere */}
      <mesh>
        <sphereGeometry args={[earthRadius, 48, 48]} />
        <meshStandardMaterial
          color="#0f3460"
          roughness={0.4}
          metalness={0.2}
          emissive="#081c3b"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Atmospheric Glowing Rim */}
      <mesh>
        <sphereGeometry args={[earthRadius + 0.35, 32, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Cloud & Continent Shell */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[earthRadius + 0.05, 32, 32]} />
        <meshStandardMaterial
          color="#22c55e"
          wireframe={false}
          transparent
          opacity={0.35}
          roughness={0.8}
        />
      </mesh>

      {/* Equator & Meridian Reference Rings on Earth */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[earthRadius + 0.02, earthRadius + 0.08, 64]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Observer Location Pin */}
      <group position={pinPos}>
        <mesh position={[0, 0.4, 0]}>
          <coneGeometry args={[0.2, 0.8, 16]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.8} />
        </mesh>
        <Html distanceFactor={24} position={[0, 1.4, 0]} center zIndexRange={[0, 10]}>
          <div className="bg-slate-950/90 border border-amber-500/80 px-2 py-0.5 rounded text-[10px] font-bold text-amber-300 shadow-xl whitespace-nowrap select-none pointer-events-none">
            📍 {cityName}
          </div>
        </Html>
      </group>

      {/* Earth Center Title */}
      <Html distanceFactor={35} position={[0, -earthRadius - 1.2, 0]} center zIndexRange={[0, 10]}>
        <div className="text-center select-none pointer-events-none">
          <span className="text-xs font-extrabold text-cyan-300 tracking-wider block drop-shadow-md">
            🌍 BHU-MANDALA (EARTH)
          </span>
          <span className="text-[9px] text-slate-400 font-mono">Geocentric Center</span>
        </div>
      </Html>
    </group>
  );
}

// 3D Upper Arc Ribbon for Each Rashi (Zodiac Sector)
function RashiArcSector({
  index,
  name,
  sanskritName,
  symbol,
  color,
  startLon,
  endLon,
  radius,
  yOffset,
}: {
  index: number;
  name: string;
  sanskritName: string;
  symbol: string;
  color: string;
  startLon: number;
  endLon: number;
  radius: number;
  yOffset: number;
}) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const step = 1;
    for (let deg = startLon; deg <= endLon; deg += step) {
      const pos = eclipticToCartesian(deg, 0, radius);
      pts.push([pos[0], pos[1] + yOffset, pos[2]]);
    }
    return pts;
  }, [startLon, endLon, radius, yOffset]);

  const midLon = (startLon + endLon) / 2;
  const midPos = useMemo(() => {
    const p = eclipticToCartesian(midLon, 0, radius + 1.5);
    return [p[0], p[1] + yOffset, p[2]] as [number, number, number];
  }, [midLon, radius, yOffset]);

  const lineArray = useMemo(() => {
    const arr = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      arr[i * 3] = points[i][0];
      arr[i * 3 + 1] = points[i][1];
      arr[i * 3 + 2] = points[i][2];
    }
    return arr;
  }, [points]);

  return (
    <group>
      {/* 3D Arc Ribbon */}
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lineArray, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={color} linewidth={3} transparent opacity={0.9} />
      </line>

      {/* Sector Boundary Divider Marker */}
      {points[0] && (
        <mesh position={points[0]}>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
        </mesh>
      )}

      {/* Floating Rashi Header Badge */}
      <group position={midPos}>
        <Html distanceFactor={40} center zIndexRange={[0, 10]}>
          <div
            style={{ borderColor: color }}
            className="px-2 py-0.5 rounded-md bg-slate-950/85 border shadow-xl text-center select-none pointer-events-none whitespace-nowrap backdrop-blur-sm"
          >
            <div style={{ color: color }} className="font-extrabold text-xs">
              {symbol} {sanskritName}
            </div>
            <div className="text-[8px] text-slate-300 font-mono tracking-wider uppercase">
              {name} ({index * 30}° - {(index + 1) * 30}°)
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}

// 12 Rashi Zodiac Belt (Upper Ring: Y = +4.5, Radius = 40)
function UpperZodiacBelt3D() {
  const radius = 40;
  const yOffset = 4.5;

  return (
    <group>
      {RASHIS.map((r, i) => (
        <RashiArcSector
          key={r.index}
          index={r.index}
          name={r.englishName}
          sanskritName={r.sanskritName}
          symbol={r.symbol}
          color={RASHI_COLORS[i % RASHI_COLORS.length]}
          startLon={i * 30}
          endLon={(i + 1) * 30}
          radius={radius}
          yOffset={yOffset}
        />
      ))}
    </group>
  );
}

// 27 Nakshatra Belt (Lower Ring: Y = -4.5, Radius = 40)
function LowerNakshatraBelt3D() {
  const radius = 40;
  const yOffset = -4.5;
  const nakStep = 360 / 27;

  return (
    <group>
      {/* Main Nakshatra Base Ring */}
      <mesh position={[0, yOffset, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.12, 16, 128]} />
        <meshBasicMaterial color="#9333ea" transparent opacity={0.6} />
      </mesh>

      {/* 27 Nakshatra Sectors & Labels */}
      {NAKSHATRAS.map((nak, i) => {
        const midLon = (i + 0.5) * nakStep;
        const pos = eclipticToCartesian(midLon, 0, radius);
        const startPos = eclipticToCartesian(i * nakStep, 0, radius - 1.2);
        const endPos = eclipticToCartesian(i * nakStep, 0, radius + 1.2);

        const tickLine = new Float32Array([
          startPos[0],
          startPos[1] + yOffset,
          startPos[2],
          endPos[0],
          endPos[1] + yOffset,
          endPos[2],
        ]);

        return (
          <group key={nak.index}>
            {/* Nakshatra Divider Tick */}
            <line>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[tickLine, 3]} />
              </bufferGeometry>
              <lineBasicMaterial color="#c084fc" transparent opacity={0.8} />
            </line>

            {/* Nakshatra Label with Sacred Yoni Animal */}
            <group position={[pos[0], pos[1] + yOffset, pos[2]]}>
              <Html distanceFactor={44} center zIndexRange={[0, 10]}>
                <div className="select-none text-center pointer-events-none px-2 py-1 rounded-lg bg-purple-950/85 border border-purple-700/70 shadow-2xl text-[9px] text-purple-200 whitespace-nowrap backdrop-blur-sm transition-transform hover:scale-110">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs">{nak.animalSymbol}</span>
                    <span className="font-bold text-[9.5px] text-purple-200">{nak.sanskritName}</span>
                  </div>
                  <div className="text-[7.5px] text-amber-300 font-mono flex items-center justify-center gap-1 mt-0.5">
                    <span>{nak.animal}</span>
                    <span className="text-purple-400">•</span>
                    <span className="text-purple-300">{nak.lord}</span>
                  </div>
                </div>
              </Html>
            </group>
          </group>
        );
      })}
    </group>
  );
}

const VEDIC_HOUSES_DATA = [
  {
    house: 1,
    name: "1st House",
    sanskritName: "तनु भाव (Tanu)",
    significance: "Self • Body • Vitality",
    karaka: "Sun",
    type: "Kendra & Trikona (Lagna)",
    color: "#f59e0b",
  },
  {
    house: 2,
    name: "2nd House",
    sanskritName: "धन भाव (Dhana)",
    significance: "Wealth • Family • Speech",
    karaka: "Jupiter",
    type: "Maraka / Dhana",
    color: "#10b981",
  },
  {
    house: 3,
    name: "3rd House",
    sanskritName: "सहज भाव (Sahaja)",
    significance: "Siblings • Courage • Effort",
    karaka: "Mars",
    type: "Upachaya / Bhratri",
    color: "#06b6d4",
  },
  {
    house: 4,
    name: "4th House",
    sanskritName: "सुख भाव (Sukha)",
    significance: "Mother • Home • Vehicles",
    karaka: "Moon",
    type: "Kendra (Sukha)",
    color: "#3b82f6",
  },
  {
    house: 5,
    name: "5th House",
    sanskritName: "पुत्र भाव (Putra)",
    significance: "Intellect • Children • Purvapunya",
    karaka: "Jupiter",
    type: "Trikona (Lakshmi Sthana)",
    color: "#8b5cf6",
  },
  {
    house: 6,
    name: "6th House",
    sanskritName: "शत्रु भाव (Shatru)",
    significance: "Debts • Disease • Service",
    karaka: "Mars / Saturn",
    type: "Dusthana & Upachaya",
    color: "#ef4444",
  },
  {
    house: 7,
    name: "7th House",
    sanskritName: "जाया भाव (Jaya)",
    significance: "Spouse • Partnership • Public",
    karaka: "Venus",
    type: "Kendra & Maraka (Descendant)",
    color: "#ec4899",
  },
  {
    house: 8,
    name: "8th House",
    sanskritName: "आयु भाव (Ayur)",
    significance: "Longevity • Transformation • Occult",
    karaka: "Saturn",
    type: "Dusthana (Randhra)",
    color: "#6366f1",
  },
  {
    house: 9,
    name: "9th House",
    sanskritName: "धर्म भाव (Dharma)",
    significance: "Fortune • Guru • Higher Wisdom",
    karaka: "Jupiter",
    type: "Trikona (Supreme Bhagya)",
    color: "#f59e0b",
  },
  {
    house: 10,
    name: "10th House",
    sanskritName: "कर्म भाव (Karma)",
    significance: "Career • Authority • Fame",
    karaka: "Sun / Mercury",
    type: "Kendra (Midheaven / MC)",
    color: "#10b981",
  },
  {
    house: 11,
    name: "11th House",
    sanskritName: "लाभ भाव (Labha)",
    significance: "Gains • Aspirations • Network",
    karaka: "Jupiter",
    type: "Upachaya (Supreme Labha)",
    color: "#06b6d4",
  },
  {
    house: 12,
    name: "12th House",
    sanskritName: "व्यय भाव (Vyaya)",
    significance: "Expenditure • Foreign Lands • Moksha",
    karaka: "Saturn / Ketu",
    type: "Dusthana (Moksha Sthana)",
    color: "#a855f7",
  },
];

// 12 Vedic Houses (Bhava Chakra) Belt (Lower Ring Tier 2: Y = -9.0, Radius = 40)
// 1st House starts at Ascendant (Lagna) and all 12 houses rotate dynamically with Asc. point
function LowerVedicHousesBelt3D({
  ascendantLongitude,
  cusps,
}: {
  ascendantLongitude: number;
  cusps?: number[];
}) {
  const radius = 40;
  const yOffset = -9.0;

  return (
    <group>
      {/* Main Vedic Houses Base Ring */}
      <mesh position={[0, yOffset, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.12, 16, 128]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
      </mesh>

      {/* 12 House Sectors rotating dynamically with Ascendant */}
      {VEDIC_HOUSES_DATA.map((hData, i) => {
        const startLon =
          cusps && cusps[i] !== undefined
            ? cusps[i]
            : (ascendantLongitude + i * 30) % 360;
        const endLon =
          cusps && cusps[(i + 1) % 12] !== undefined
            ? cusps[(i + 1) % 12]
            : (startLon + 30) % 360;

        let span = (endLon - startLon + 360) % 360;
        if (span === 0) span = 30;
        const midLon = (startLon + span / 2) % 360;

        const pos = eclipticToCartesian(midLon, 0, radius);
        const startPos = eclipticToCartesian(startLon, 0, radius - 1.2);
        const endPos = eclipticToCartesian(startLon, 0, radius + 1.2);

        const tickLine = new Float32Array([
          startPos[0],
          startPos[1] + yOffset,
          startPos[2],
          endPos[0],
          endPos[1] + yOffset,
          endPos[2],
        ]);

        return (
          <group key={hData.house}>
            {/* Cusp Divider Line */}
            <line>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[tickLine, 3]} />
              </bufferGeometry>
              <lineBasicMaterial color={hData.color} transparent opacity={0.85} />
            </line>

            {/* 12 House Dynamic Label Badge */}
            <group position={[pos[0], pos[1] + yOffset, pos[2]]}>
              <Html distanceFactor={44} center zIndexRange={[0, 10]}>
                <div
                  style={{ borderColor: `${hData.color}90` }}
                  className="select-none text-center pointer-events-none px-2 py-1 rounded-xl bg-slate-950/90 border shadow-2xl backdrop-blur-md transition-transform hover:scale-110 whitespace-nowrap min-w-[90px]"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span
                      style={{ color: hData.color }}
                      className="font-extrabold text-[10.5px] font-mono"
                    >
                      H{hData.house}
                    </span>
                    <span className="font-bold text-[9.5px] text-slate-100">
                      {hData.sanskritName.split(" ")[0]}
                    </span>
                  </div>
                  <div className="text-[7.5px] text-slate-300 font-mono mt-0.5">
                    {hData.significance}
                  </div>
                  <div className="text-[7px] text-amber-400 font-mono flex items-center justify-center gap-1 mt-0.5">
                    <span>{startLon.toFixed(1)}° - {endLon.toFixed(1)}°</span>
                  </div>
                </div>
              </Html>
            </group>
          </group>
        );
      })}
    </group>
  );
}

export interface Planet3DNode {
  id: string;
  name: string;
  sanskritName: string;
  symbol: string;
  color: string;
  longitude: number;
  signIndex: number;
  house: number;
  position: [number, number, number];
  isRetrograde?: boolean;
  speed?: number;
  isUpagraha?: boolean;
  isLagna?: boolean;
}

export interface DirectAspectTarget {
  id: string;
  name: string;
  symbol: string;
  color: string;
  position: [number, number, number];
  signName: string;
  house: number;
}

export interface AspectRayData {
  label: string;
  houseOffset: number;
  degOffset: number;
  targetSignIndex: number;
  targetSignName: string;
  targetHouse: number;
  targetLon: number;
  outerPos: [number, number, number];
  outerPoints: Float32Array;
  directTargets: DirectAspectTarget[];
}

// Cosmic Energy Aura & Orbital Accretion Vortex with Retrograde Reverse Spin
function PlanetaryAccretionVortex({
  color,
  radius,
  isRetrograde,
  isCombust,
  sunPos,
  isSelected,
  planetPos,
}: {
  color: string;
  radius: number;
  isRetrograde?: boolean;
  isCombust?: boolean;
  sunPos?: [number, number, number];
  isSelected: boolean;
  planetPos: [number, number, number];
}) {
  const vortexRef = useRef<THREE.Group>(null);
  const particleGroupRef = useRef<THREE.Group>(null);
  const coronaRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // Reverse particle rotation for Retrograde (Vakri) grahas
    const rotSpeed = isRetrograde ? -1.8 : 1.8;
    if (vortexRef.current) {
      vortexRef.current.rotation.z += delta * rotSpeed;
    }
    if (particleGroupRef.current) {
      particleGroupRef.current.rotation.z += delta * rotSpeed * 1.4;
    }
    if (coronaRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.12;
      coronaRef.current.scale.setScalar(pulse);
    }
  });

  // 8 orbital energy spark nodes around the accretion disc
  const particles = useMemo(() => {
    const pts: [number, number, number][] = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius * 2.2 + (i % 2 === 0 ? 0.3 : -0.2);
      pts.push([Math.cos(angle) * r, Math.sin(angle) * r, Math.sin(angle * 2) * 0.2]);
    }
    return pts;
  }, [radius]);

  // Solar filament line if combust
  const solarFilament = useMemo(() => {
    if (!isCombust || !sunPos) return null;
    return new Float32Array([
      0, 0, 0,
      sunPos[0] - planetPos[0],
      sunPos[1] - planetPos[1],
      sunPos[2] - planetPos[2],
    ]);
  }, [isCombust, sunPos, planetPos]);

  return (
    <group>
      {/* Combust Solar Filament connecting directly to Sun's Core */}
      {solarFilament && (
        <line>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[solarFilament, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#f59e0b" transparent opacity={0.75} linewidth={2} />
        </line>
      )}

      {/* Pulsing Energy Corona Sphere */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[radius * 1.4, 24, 24]} />
        <meshBasicMaterial color={color} transparent opacity={isSelected ? 0.28 : 0.16} />
      </mesh>

      {/* Tilted Accretion Vortex Group */}
      <group ref={vortexRef} rotation={[Math.PI / 2.8, Math.PI / 6, 0]}>
        {/* Core Luminous Inner Ring */}
        <mesh>
          <ringGeometry args={[radius * 1.35, radius * 1.75, 48]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isSelected ? 3.2 : 1.8}
            side={THREE.DoubleSide}
            transparent
            opacity={isSelected ? 0.85 : 0.55}
          />
        </mesh>

        {/* Outer Cosmic Dust Disc */}
        <mesh>
          <ringGeometry args={[radius * 1.85, radius * 2.55, 48]} />
          <meshBasicMaterial
            color={color}
            side={THREE.DoubleSide}
            transparent
            opacity={isSelected ? 0.45 : 0.25}
          />
        </mesh>
      </group>

      {/* Swirling Particle Vortex (Reverse flow for Retrograde) */}
      <group ref={particleGroupRef} rotation={[Math.PI / 2.8, Math.PI / 6, 0]}>
        {particles.map((pt, i) => (
          <mesh key={i} position={pt}>
            <sphereGeometry args={[isSelected ? 0.12 : 0.08, 8, 8]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={color}
              emissiveIntensity={3.0}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Floating Holographic Astrological Behavior HUD (3D Neon Glass Card)
function AstrologicalBehaviorHUD({
  name,
  sanskritName,
  symbol,
  color,
  longitude,
  degreesInSign,
  rashi,
  nakshatra,
  isRetrograde,
  speed,
  house,
  isLagna,
  isUpagraha,
  neechaVakriInfo,
  combustionInfo,
  lordshipInfo,
  dashaInfo,
  aspectRays,
  onFlyTo,
  onAskAi,
  onResetView,
  onClose,
}: {
  name: string;
  sanskritName: string;
  symbol: string;
  color: string;
  longitude: number;
  degreesInSign: number;
  rashi: { sanskritName: string; symbol: string; englishName: string; index: number };
  nakshatra: { sanskritName: string; pada: number; lord?: string; deity?: string; animal?: string; animalSymbol?: string };
  isRetrograde?: boolean;
  speed?: number;
  house?: number;
  isLagna?: boolean;
  isUpagraha?: boolean;
  neechaVakriInfo?: NeechaVakriPlanetInfo;
  combustionInfo?: CombustionNuanceInfo;
  lordshipInfo?: JatakaChandrikaGrahaRole;
  dashaInfo: {
    isMahadashaLord: boolean;
    isAntardashaLord: boolean;
    isPratyantardashaLord: boolean;
    activeRoleText: string;
  };
  aspectRays: AspectRayData[];
  onFlyTo: (targetPlanetId: string) => void;
  onAskAi: () => void;
  onResetView: () => void;
  onClose: () => void;
}) {
  // Determine Dignity Badge & Rationale
  let dignityBadge = {
    title: "Neutral Dignity",
    badgeClass: "bg-slate-800/80 text-slate-300 border-slate-600",
    desc: "Standard planetary operational dignity.",
  };

  if (neechaVakriInfo?.isNeechaVakri) {
    dignityBadge = {
      title: "🌟 Neecha-Vakri (Uttara Kalamrita 2.6)",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/80 shadow-[0_0_12px_rgba(245,158,11,0.4)]",
      desc: "Functions with spring-loaded Exalted power (Ucchavat Phala). Severe initial delay yields monumental late-life fruition.",
    };
  } else if (neechaVakriInfo?.isUcchaVakri) {
    dignityBadge = {
      title: "⚡ Uccha-Vakri (Exalted Retrograde)",
      badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/80",
      desc: "Exalted dignity operating with high retrograde intensity and internal re-evaluation.",
    };
  } else if (neechaVakriInfo?.isExalted) {
    dignityBadge = {
      title: "👑 Exalted (Uccha)",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.4)]",
      desc: "Maximum dignity and pure positive flow in its domain.",
    };
  } else if (neechaVakriInfo?.isDebilitated) {
    dignityBadge = {
      title: "⚠️ Debilitated (Neecha)",
      badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/80",
      desc: "Direct debilitation; planet operates in friction without retrograde inversion resistance.",
    };
  } else if (["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].includes(name)) {
    const OWN_SIGNS: Record<string, number[]> = {
      Sun: [4],
      Moon: [3],
      Mars: [0, 7],
      Mercury: [2, 5],
      Jupiter: [8, 11],
      Venus: [1, 6],
      Saturn: [9, 10],
    };
    if (OWN_SIGNS[name]?.includes(rashi.index)) {
      dignityBadge = {
        title: "🏰 Swakshetra (Own Sign)",
        badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/80",
        desc: "High autonomous strength and stability in self-ruled sign.",
      };
    }
  }

  // Motion Badge
  const motionBadge = isRetrograde
    ? {
        title: "🔄 Retrograde (Vakri) • Peak Chestabala (60/60)",
        badgeClass: "bg-rose-950/80 text-rose-300 border-rose-500/70",
        desc: speed !== undefined ? `Reverse speed: ${speed.toFixed(3)}°/day • Reverse Accretion Flow` : "Retrograde motion",
      }
    : {
        title: "➡️ Direct Motion",
        badgeClass: "bg-slate-900 text-slate-300 border-slate-700",
        desc: speed !== undefined ? `Forward speed: +${speed.toFixed(3)}°/day` : "Direct motion",
      };

  // Combustion Badge
  const combustionBadge = combustionInfo?.isCombust
    ? {
        title: `🔥 Combust (${combustionInfo.combustionTier.split(" ")[0]})`,
        badgeClass: "bg-orange-500/20 text-orange-300 border-orange-500/80",
        desc: `${combustionInfo.separationDeg.toFixed(1)}° from Sun • Shield Score: ${combustionInfo.immunityScore}%${combustionInfo.hasExaltationShield ? " • Exaltation Shield Active" : ""}`,
      }
    : {
        title: "✨ Free Solar Ray (Uncombust)",
        badgeClass: "bg-cyan-500/10 text-cyan-300 border-cyan-500/50",
        desc: "Clear illumination without solar obscuration.",
      };

  // Lordship Badge
  const lordshipBadge = lordshipInfo
    ? {
        role: lordshipInfo.functionalNature,
        houses: lordshipInfo.housesOwned.length > 0 ? `Lord of Houses ${lordshipInfo.housesOwned.join(" & ")}` : `House ${house}`,
        badgeClass: lordshipInfo.functionalNature.includes("Yogakaraka")
          ? "bg-amber-500/20 text-amber-300 border-amber-500/80"
          : lordshipInfo.functionalNature.includes("Benefic")
          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/80"
          : lordshipInfo.functionalNature.includes("Malefic")
          ? "bg-red-500/20 text-red-300 border-red-500/80"
          : "bg-slate-800 text-slate-300 border-slate-700",
        reason: lordshipInfo.classicalReasoning,
      }
    : isLagna
    ? {
        role: name === "Lagna" ? "👑 Ascendant (Supreme Kendra & Trikona Foundation)" : "🌟 Midheaven (Karma Zenith MC)",
        houses: name === "Lagna" ? "House 1 (Tanu Bhava)" : "House 10 (Karma Bhava)",
        badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/80",
        reason: "Core orientational cardinal axis of the horoscope.",
      }
    : null;

  return (
    <Html distanceFactor={22} position={[2.6, 0.2, 0]} zIndexRange={[60, 100]}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-80 sm:w-96 max-h-[75vh] overflow-y-auto custom-scrollbar p-3.5 sm:p-4 rounded-2xl bg-slate-950/95 border border-cyan-500/60 shadow-[0_0_35px_rgba(6,182,212,0.4)] backdrop-blur-2xl text-left select-none pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-2.5 mb-2.5">
          <div className="flex items-center gap-2">
            <span
              style={{ backgroundColor: `${color}25`, borderColor: color, color }}
              className="w-8 h-8 rounded-xl border flex items-center justify-center text-base font-extrabold shadow-md"
            >
              {symbol}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-slate-100">{name}</h3>
                <span className="text-xs text-amber-300 font-medium">({sanskritName})</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                {rashi.symbol} {rashi.sanskritName} • {formatDMS(degreesInSign)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {house !== undefined && (
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold font-mono">
                H{house}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              title="Close HUD"
              className="w-6 h-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer pointer-events-auto"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Position & Nakshatra Meta */}
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] space-y-1 mb-2.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Nakshatra:</span>
            <span className="font-bold text-purple-300">
              {nakshatra.sanskritName} (Pada {nakshatra.pada}) {nakshatra.animalSymbol ? `• ${nakshatra.animalSymbol} ${nakshatra.animal}` : ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Sidereal Lon:</span>
            <span className="font-mono font-bold text-amber-300">{formatDMS(longitude)}</span>
          </div>
          {nakshatra.lord && (
            <div className="flex justify-between">
              <span className="text-slate-400">Nakshatra Lord:</span>
              <span className="font-semibold text-slate-200">{nakshatra.lord}</span>
            </div>
          )}
        </div>

        {/* Astrological Behavior Multi-Card Matrix */}
        <div className="space-y-2 text-[11px]">
          {/* 1. Dignity */}
          {!isUpagraha && !isLagna && (
            <div className={`p-2 rounded-xl border ${dignityBadge.badgeClass}`}>
              <div className="font-extrabold text-[11px] mb-0.5">{dignityBadge.title}</div>
              <div className="text-[10px] opacity-90 leading-tight">{dignityBadge.desc}</div>
            </div>
          )}

          {/* 2. Motion & Chestabala */}
          {!isUpagraha && !isLagna && (
            <div className={`p-2 rounded-xl border ${motionBadge.badgeClass}`}>
              <div className="font-extrabold text-[11px] mb-0.5">{motionBadge.title}</div>
              <div className="text-[10px] opacity-90 leading-tight">{motionBadge.desc}</div>
            </div>
          )}

          {/* 3. Combustion & Solar Shields */}
          {!isUpagraha && !isLagna && name !== "Sun" && combustionBadge && (
            <div className={`p-2 rounded-xl border ${combustionBadge.badgeClass}`}>
              <div className="font-extrabold text-[11px] mb-0.5">{combustionBadge.title}</div>
              <div className="text-[10px] opacity-90 leading-tight">{combustionBadge.desc}</div>
            </div>
          )}

          {/* 4. House Lordship & Role */}
          {lordshipBadge && (
            <div className={`p-2 rounded-xl border ${lordshipBadge.badgeClass}`}>
              <div className="flex items-center justify-between font-extrabold text-[11px] mb-0.5">
                <span>{lordshipBadge.role}</span>
                <span className="text-[10px] opacity-80">{lordshipBadge.houses}</span>
              </div>
              <div className="text-[10px] opacity-90 leading-tight">{lordshipBadge.reason}</div>
            </div>
          )}

          {/* 5. Active Dasha Role */}
          {!isUpagraha && !isLagna && (
            <div className="p-2 rounded-xl border border-indigo-500/60 bg-indigo-950/30 text-indigo-200">
              <div className="flex items-center justify-between font-extrabold text-[11px] mb-0.5">
                <span>Vimshottari Dasha Telemetry</span>
                <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-mono">Live Clock</span>
              </div>
              <div className="text-[10.5px] font-semibold text-amber-300">{dashaInfo.activeRoleText}</div>
            </div>
          )}
        </div>

        {/* 6. Aspects Cast (Graha Drishti) & Direct Target Flight Buttons */}
        {aspectRays.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400">
                Graha Drishti (Aspects Cast)
              </span>
              <span className="text-[9px] text-slate-400 font-mono">
                {aspectRays.length} Vectors
              </span>
            </div>
            <div className="space-y-1.5">
              {aspectRays.map((asp, idx) => {
                return (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span style={{ color }} className="flex items-center gap-1">
                        <span>✦</span>
                        <span>{asp.label}</span>
                      </span>
                      <span className="text-[10px] text-amber-300 font-mono">
                        H{asp.targetHouse} ({asp.targetSignName})
                      </span>
                    </div>

                    {asp.directTargets.length > 0 ? (
                      <div className="mt-1.5 space-y-1">
                        <div className="text-[9.5px] text-cyan-300 font-medium">
                          Directly Illuminating ({asp.directTargets.length} Grahas):
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {asp.directTargets.map((t) => (
                            <button
                              key={t.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onFlyTo(t.id);
                              }}
                              title={`Fly camera directly to ${t.name}`}
                              className="px-2 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-200 font-bold text-[10px] flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer pointer-events-auto"
                            >
                              <span>{t.symbol}</span>
                              <span>{t.name}</span>
                              <span className="text-amber-300 font-bold ml-0.5">🚀 Fly</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 text-[9.5px] text-slate-400 italic">
                        No planets in target house • Ray anchors to Zodiac cusp ({formatDMS(asp.targetLon)})
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Interactive Actions Bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAskAi();
            }}
            className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer pointer-events-auto"
          >
            <span>💬</span>
            <span>Ask AI Chatbot</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onResetView();
            }}
            className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs shadow-md flex items-center gap-1 transition-all active:scale-95 cursor-pointer pointer-events-auto"
            title="Return camera to Geocentric Bhu-Mandala view"
          >
            <span>⤓</span>
            <span>Reset View</span>
          </button>
        </div>
      </div>
    </Html>
  );
}

// 3D Planet Marker with Direct Planet-to-Planet Aspect Rays, Accretion Vortex & Holographic HUD
function PlanetMesh({
  id,
  name,
  sanskritName,
  symbol,
  color,
  longitude,
  degreesInSign,
  orbitRadius,
  rashi,
  nakshatra,
  isRetrograde,
  speed,
  house,
  isUpagraha,
  isLagna,
  showAspectRays,
  isSelected,
  planetPositionsMap,
  neechaVakriInfo,
  combustionInfo,
  lordshipInfo,
  dashaInfo,
  sunPos,
  onSelect,
  onFlyTo,
  onResetView,
}: {
  id: string;
  name: string;
  sanskritName: string;
  symbol: string;
  color: string;
  longitude: number;
  degreesInSign: number;
  orbitRadius: number;
  rashi: { sanskritName: string; symbol: string; englishName: string; index: number };
  nakshatra: { sanskritName: string; pada: number; lord?: string; deity?: string; animal?: string; animalSymbol?: string };
  isRetrograde?: boolean;
  speed?: number;
  house?: number;
  isUpagraha?: boolean;
  isLagna?: boolean;
  showAspectRays: boolean;
  isSelected: boolean;
  planetPositionsMap: Record<string, Planet3DNode>;
  neechaVakriInfo?: NeechaVakriPlanetInfo;
  combustionInfo?: CombustionNuanceInfo;
  lordshipInfo?: JatakaChandrikaGrahaRole;
  dashaInfo: {
    isMahadashaLord: boolean;
    isAntardashaLord: boolean;
    isPratyantardashaLord: boolean;
    activeRoleText: string;
  };
  sunPos?: [number, number, number];
  onSelect: () => void;
  onFlyTo: (targetPlanetId: string) => void;
  onResetView: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Position between Central Earth (r=5) and Outer Ring (r=37-42)
  const position = useMemo(() => {
    return eclipticToCartesian(longitude, 0, orbitRadius);
  }, [longitude, orbitRadius]);

  const radius = isLagna ? 1.0 : isUpagraha ? 0.55 : 0.85;

  useFrame((state) => {
    if (meshRef.current && (hovered || isSelected)) {
      meshRef.current.scale.setScalar(1.5 + Math.sin(state.clock.elapsedTime * 5) * 0.2);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1.0);
    }
  });

  // Calculate direct planet-to-planet Graha Drishti rays and outer cusp alignment
  const aspectRays: AspectRayData[] = useMemo(() => {
    if (isUpagraha) return []; // Upagrahas do not cast independent Drishti

    const aspects = getVedicAspects(name);
    return aspects.map((asp) => {
      const targetSignIndex = (rashi.index + asp.houseOffset - 1) % 12;
      const targetHouse = house !== undefined ? ((house - 1 + asp.houseOffset - 1) % 12) + 1 : ((targetSignIndex + 1));
      const targetSignName = RASHIS[targetSignIndex]?.sanskritName || "";
      const targetLon = (longitude + asp.degOffset) % 360;
      const outerPos = eclipticToCartesian(targetLon, 0, 40);
      const outerPoints = new Float32Array([
        position[0],
        position[1],
        position[2],
        outerPos[0],
        outerPos[1],
        outerPos[2],
      ]);

      // Detect direct target planets occupying the aspected sign or house
      const directTargets: DirectAspectTarget[] = [];
      if (planetPositionsMap) {
        Object.values(planetPositionsMap).forEach((t) => {
          if (!t.isUpagraha && t.id !== id && (t.signIndex === targetSignIndex || t.house === targetHouse)) {
            directTargets.push({
              id: t.id,
              name: t.name,
              symbol: t.symbol,
              color: t.color,
              position: t.position,
              signName: targetSignName,
              house: targetHouse,
            });
          }
        });
      }

      return {
        label: asp.label,
        houseOffset: asp.houseOffset,
        degOffset: asp.degOffset,
        targetSignIndex,
        targetSignName,
        targetHouse,
        targetLon,
        outerPos,
        outerPoints,
        directTargets,
      };
    });
  }, [name, longitude, position, isUpagraha, rashi.index, house, id, planetPositionsMap]);

  // Gate aspect ray rendering strictly to hover or selected state
  const shouldRenderAspects = showAspectRays && (hovered || isSelected);

  const handleAskAi = () => {
    let prompt = "";
    if (isLagna) {
      prompt = `Analyzing my ${name} in ${rashi.sanskritName} (${rashi.englishName}) at ${formatDMS(degreesInSign)} in ${nakshatra.sanskritName} Pada ${nakshatra.pada}, what is its core soul foundation, ascendant disposition, and major life destiny trajectory?`;
    } else {
      prompt = `Analyzing my ${name} (${sanskritName}) in House ${house} (${rashi.sanskritName} ${formatDMS(degreesInSign)}): its dignity (${neechaVakriInfo?.isNeechaVakri ? "Neecha-Vakri with Uttara Kalamrita 2.6 Exalted Inversion" : neechaVakriInfo?.isExalted ? "Exalted" : neechaVakriInfo?.isDebilitated ? "Debilitated" : "Neutral"}), ${isRetrograde ? "Retrograde (Vakri) with Peak Chestabala" : "Direct motion"}, combustion status (${combustionInfo?.isCombust ? combustionInfo.combustionTier : "Uncombust"}), house lordship as ${lordshipInfo?.functionalNature || "Lord"}, and current dasha influence (${dashaInfo.activeRoleText}), what is its deep astrological behavior and real-world fruition?`;
    }
    window.dispatchEvent(new CustomEvent("open-astro-chat", { detail: { prompt } }));
  };

  return (
    <group>
      {/* 1. Direct Planet-to-Planet & Zodiac Aspect Beams (Visible ONLY on Hover or Select) */}
      {shouldRenderAspects &&
        aspectRays.map((asp, idx) => {
          return (
            <group key={idx}>
              {/* Direct Inter-Planetary Laser Beams to Targets */}
              {asp.directTargets.map((target) => {
                const directBeamPoints = new Float32Array([
                  position[0],
                  position[1],
                  position[2],
                  target.position[0],
                  target.position[1],
                  target.position[2],
                ]);
                return (
                  <group key={target.id}>
                    {/* Laser Beam connecting source planet to target planet */}
                    <line>
                      <bufferGeometry>
                        <bufferAttribute attach="attributes-position" args={[directBeamPoints, 3]} />
                      </bufferGeometry>
                      <lineBasicMaterial color={color} transparent opacity={0.95} linewidth={3} />
                    </line>

                    {/* Impact Spark Sphere on Target Planet */}
                    <mesh position={target.position}>
                      <sphereGeometry args={[0.55, 16, 16]} />
                      <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={3.2}
                      />
                    </mesh>

                    {/* Impact Label Badge on Target Planet */}
                    <group position={target.position}>
                      <Html distanceFactor={34} center zIndexRange={[10, 30]}>
                        <div
                          style={{ borderColor: color }}
                          className="px-2 py-0.5 rounded-md bg-slate-950/95 border text-[9px] font-bold text-slate-100 shadow-xl whitespace-nowrap pointer-events-none select-none"
                        >
                          <span style={{ color }}>✦ Received {asp.label} from {name}</span>
                        </div>
                      </Html>
                    </group>
                  </group>
                );
              })}

              {/* Outer Zodiac Belt Cusp Alignment Beam */}
              <line>
                <bufferGeometry>
                  <bufferAttribute attach="attributes-position" args={[asp.outerPoints, 3]} />
                </bufferGeometry>
                <lineBasicMaterial
                  color={color}
                  transparent
                  opacity={asp.directTargets.length > 0 ? 0.35 : 0.85}
                  linewidth={1}
                />
              </line>

              {/* Target Impact Node on Zodiac Belt Cusp */}
              <mesh position={asp.outerPos}>
                <sphereGeometry args={[asp.directTargets.length > 0 ? 0.3 : 0.55, 16, 16]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={2.2}
                />
              </mesh>

              {/* Outer Cusp Aspect Label */}
              <group position={asp.outerPos}>
                <Html distanceFactor={36} center zIndexRange={[0, 10]}>
                  <div
                    style={{ borderColor: color }}
                    className="px-2 py-0.5 rounded-md bg-slate-950/90 border text-[9px] font-bold text-slate-100 shadow-xl whitespace-nowrap pointer-events-none select-none"
                  >
                    <span style={{ color }}>✦ {asp.label}</span>
                    <span className="text-slate-400 font-mono ml-1">
                      ({formatDMS(asp.targetLon)})
                    </span>
                  </div>
                </Html>
              </group>
            </group>
          );
        })}

      {/* 2. Planet Orb & Surrounding Accretion Vortex */}
      <group position={position}>
        {/* Cosmic Accretion Vortex (Rendered on Hover or Select) */}
        {(hovered || isSelected) && (
          <PlanetaryAccretionVortex
            color={color}
            radius={radius}
            isRetrograde={isRetrograde}
            isCombust={combustionInfo?.isCombust}
            sunPos={sunPos}
            isSelected={isSelected}
            planetPos={position}
          />
        )}

        {/* Planet Sphere */}
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isSelected ? 2.2 : hovered ? 1.5 : 0.8}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Selection Glow Ring */}
        {isSelected && (
          <mesh>
            <ringGeometry args={[radius * 1.6, radius * 2.1, 32]} />
            <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.9} />
          </mesh>
        )}

        {/* Primary Planet Label */}
        <Html distanceFactor={30} center position={[0, radius + 1.1, 0]} zIndexRange={[0, 15]}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`cursor-pointer select-none transition-all px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap shadow-xl flex items-center gap-1.5 ${
              isSelected
                ? "bg-amber-500 text-slate-950 ring-2 ring-white scale-110"
                : hovered
                ? "bg-slate-800 text-amber-300 ring-2 ring-amber-400 scale-110 z-50"
                : isLagna
                ? "bg-emerald-950/90 text-emerald-300 border border-emerald-500/60"
                : isUpagraha
                ? "bg-purple-950/80 text-purple-200 border border-purple-700/60"
                : "bg-slate-950/90 text-slate-100 border border-slate-700/80 backdrop-blur-md"
            }`}
          >
            <span className="text-sm">{symbol}</span>
            <span className="font-bold">{name}</span>
            <span className="text-[10px] text-amber-300 font-mono">
              {formatDMS(degreesInSign)}
            </span>
            {isRetrograde && (
              <span className="px-1 bg-red-950 text-red-300 text-[10px] rounded font-bold">
                R
              </span>
            )}
          </div>
        </Html>

        {/* 3. Floating Holographic Astrological Behavior HUD when selected */}
        {isSelected && (
          <AstrologicalBehaviorHUD
            name={name}
            sanskritName={sanskritName}
            symbol={symbol}
            color={color}
            longitude={longitude}
            degreesInSign={degreesInSign}
            rashi={rashi}
            nakshatra={nakshatra}
            isRetrograde={isRetrograde}
            speed={speed}
            house={house}
            isLagna={isLagna}
            isUpagraha={isUpagraha}
            neechaVakriInfo={neechaVakriInfo}
            combustionInfo={combustionInfo}
            lordshipInfo={lordshipInfo}
            dashaInfo={dashaInfo}
            aspectRays={aspectRays}
            onFlyTo={onFlyTo}
            onAskAi={handleAskAi}
            onResetView={onResetView}
            onClose={onResetView}
          />
        )}

        {/* 4. Compact Hover Tooltip when hovered (and not selected) */}
        {hovered && !isSelected && (
          <Html distanceFactor={28} center position={[0, -radius - 1.8, 0]} zIndexRange={[0, 20]}>
            <div className="glass-panel p-2.5 rounded-xl border border-amber-500/80 bg-slate-950/95 shadow-2xl text-xs text-left min-w-[220px] pointer-events-none select-none z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
                <span className="font-extrabold text-amber-400 flex items-center gap-1">
                  <span>{symbol}</span>
                  <span>{name} ({sanskritName})</span>
                </span>
                {house !== undefined && (
                  <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] font-bold font-mono">
                    H{house}
                  </span>
                )}
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Rashi:</span>
                  <span className="font-bold text-slate-200">
                    {rashi.symbol} {rashi.sanskritName} ({formatDMS(degreesInSign)})
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Nakshatra:</span>
                  <span className="font-bold text-purple-300">
                    {nakshatra.sanskritName} (P{nakshatra.pada}) {nakshatra.animalSymbol ? `${nakshatra.animalSymbol} ${nakshatra.animal}` : ""}
                  </span>
                </div>

                {speed !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Motion:</span>
                    <span className={`font-mono font-bold ${isRetrograde ? "text-red-400" : "text-emerald-400"}`}>
                      {isRetrograde ? "Retrograde (R)" : "Direct (D)"} ({speed >= 0 ? "+" : ""}{speed.toFixed(3)}°/d)
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[10px] pt-1 border-t border-slate-800 text-slate-400 font-mono">
                  <span>Sidereal Lon:</span>
                  <span className="text-amber-200 font-bold">{formatDMS(longitude)}</span>
                </div>

                {aspectRays.length > 0 && (
                  <div className="text-[10px] pt-1 border-t border-slate-800 text-slate-300">
                    <span className="text-amber-400 font-semibold">Aspects: </span>
                    {aspectRays.map((a) => `${a.houseOffset}th`).join(", ")} House
                  </div>
                )}
              </div>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

// Main Inside-the-Dome Celestial Scene with Cinematic Smooth Fly-In Camera
function SkyScene({ fov, showAspectRays }: { fov: number; showAspectRays: boolean }) {
  const {
    ephemeris,
    location,
    showUpagrahas,
    showModernPlanets,
    selectedEntityId,
    setSelectedEntityId,
    currentDate,
  } = useAstroStore();

  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetCamPos = useRef<THREE.Vector3 | null>(null);
  const targetLookAt = useRef<THREE.Vector3 | null>(null);

  // Precompute 3D coordinates for all active bodies in the dome
  const planetPositionsMap = useMemo(() => {
    if (!ephemeris) return {};
    const map: Record<string, Planet3DNode> = {};

    // Ascendant & Midheaven
    map["Ascendant"] = {
      id: "Ascendant",
      name: "Lagna",
      sanskritName: "Lagna (Rising)",
      symbol: "ASC",
      color: "#10b981",
      longitude: ephemeris.ascendant.siderealLongitude,
      signIndex: ephemeris.ascendant.rashi.index,
      house: 1,
      position: eclipticToCartesian(ephemeris.ascendant.siderealLongitude, 0, 40),
      isLagna: true,
    };

    map["Midheaven"] = {
      id: "Midheaven",
      name: "MC",
      sanskritName: "Madhya Lagna",
      symbol: "MC",
      color: "#f59e0b",
      longitude: ephemeris.midheaven.siderealLongitude,
      signIndex: ephemeris.midheaven.rashi.index,
      house: 10,
      position: eclipticToCartesian(ephemeris.midheaven.siderealLongitude, 0, 40),
      isLagna: true,
    };

    // Navagrahas & Modern Planets
    Object.values(ephemeris.planets).forEach((p) => {
      map[p.id] = {
        id: p.id,
        name: p.name,
        sanskritName: p.sanskritName,
        symbol: p.symbol,
        color: p.color,
        longitude: p.siderealLongitude,
        signIndex: p.rashi.index,
        house: p.house,
        position: eclipticToCartesian(p.siderealLongitude, 0, 40),
        isRetrograde: p.isRetrograde,
        speed: p.speed,
      };
    });

    // Upagrahas
    if (showUpagrahas) {
      Object.values(ephemeris.upagrahas).forEach((u) => {
        map[u.id] = {
          id: u.id,
          name: u.name,
          sanskritName: u.sanskritName,
          symbol: "✦",
          color: "#c084fc",
          longitude: u.siderealLongitude,
          signIndex: u.rashi.index,
          house: u.house,
          position: eclipticToCartesian(u.siderealLongitude, 0, 40),
          isUpagraha: true,
        };
      });
    }

    return map;
  }, [ephemeris, showUpagrahas]);

  const sunPos = planetPositionsMap["Sun"]?.position;

  // Classical Astrological Intelligence Syntheses
  const neechaVakriList = useMemo(() => {
    if (!ephemeris) return [];
    return evaluateNeechaVakriPlanets(ephemeris);
  }, [ephemeris]);

  const combustionList = useMemo(() => {
    if (!ephemeris) return [];
    return evaluateCombustionNuances(ephemeris);
  }, [ephemeris]);

  const jatakaChandrikaAnalysis = useMemo(() => {
    if (!ephemeris) return null;
    return evaluateJatakaChandrika(ephemeris);
  }, [ephemeris]);

  const dashaResult = useMemo(() => {
    if (!ephemeris?.planets?.Moon) return null;
    return calculateVimshottariDasha(
      currentDate,
      ephemeris.planets.Moon.siderealLongitude,
      new Date()
    );
  }, [ephemeris, currentDate]);

  const getDashaInfoForPlanet = (planetName: string) => {
    if (!dashaResult?.activeDasha) {
      return {
        isMahadashaLord: false,
        isAntardashaLord: false,
        isPratyantardashaLord: false,
        activeRoleText: "⏳ Dasha Period Inactive",
      };
    }
    const mdLord = dashaResult.activeDasha.mahadasha.name;
    const adLord = dashaResult.activeDasha.antardasha.name;
    const pdLord = dashaResult.activeDasha.pratyantardasha.name;

    const isMD = mdLord === planetName;
    const isAD = adLord === planetName;
    const isPD = pdLord === planetName;

    let activeRoleText = "⏳ Dasha Period Inactive";
    if (isMD && isAD) {
      activeRoleText = `👑 Active Mahadasha & Antardasha Ruler`;
    } else if (isMD) {
      activeRoleText = `👑 Active Mahadasha Lord (through ${dashaResult.activeDasha.mdEnd.toLocaleDateString()})`;
    } else if (isAD) {
      activeRoleText = `⚡ Active Antardasha (Bhukti) Lord (through ${dashaResult.activeDasha.adEnd.toLocaleDateString()})`;
    } else if (isPD) {
      activeRoleText = `✨ Active Pratyantardasha Lord`;
    }

    return {
      isMahadashaLord: isMD,
      isAntardashaLord: isAD,
      isPratyantardashaLord: isPD,
      activeRoleText,
    };
  };

  // Cinematic Fly-In Camera Glide into Close Orbit (~6.8 units) around selected planet
  useEffect(() => {
    if (!ephemeris) return;

    if (!selectedEntityId) {
      // Smoothly glide camera back up to geocentric Bhu-Mandala overview
      targetCamPos.current = new THREE.Vector3(0, 25, 45);
      targetLookAt.current = new THREE.Vector3(0, 0, 0);
      return;
    }

    const node = planetPositionsMap[selectedEntityId];
    if (node) {
      const pos = node.position;
      const dir = new THREE.Vector3(pos[0], 0, pos[2]).normalize();
      // Orbit camera at close inspection distance (~6.8 units) facing directly at the planet
      targetCamPos.current = new THREE.Vector3(pos[0] + dir.x * 6.5, 2.2, pos[2] + dir.z * 6.5);
      targetLookAt.current = new THREE.Vector3(pos[0], 0, pos[2]);
    }
  }, [selectedEntityId, ephemeris, planetPositionsMap]);

  // Smooth interpolation loop for camera position & controls target
  useFrame(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      if (Math.abs(camera.fov - fov) > 0.05) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, fov, 0.15);
        camera.updateProjectionMatrix();
      }
    }

    if (targetCamPos.current) {
      camera.position.lerp(targetCamPos.current, 0.07);
      if (camera.position.distanceTo(targetCamPos.current) < 0.08) {
        targetCamPos.current = null;
      }
    }

    if (targetLookAt.current && controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, 0.07);
      controlsRef.current.update();
      if (controlsRef.current.target.distanceTo(targetLookAt.current) < 0.08) {
        targetLookAt.current = null;
      }
    }
  });

  const planetList = useMemo(() => {
    if (!ephemeris) return [];
    return Object.values(ephemeris.planets).filter((p) => {
      if (p.isModernPlanet && !showModernPlanets) return false;
      return true;
    });
  }, [ephemeris, showModernPlanets]);

  const upagrahaList = useMemo(() => {
    if (!ephemeris || !showUpagrahas) return [];
    return Object.values(ephemeris.upagrahas);
  }, [ephemeris, showUpagrahas]);

  if (!ephemeris) return null;

  return (
    <>
      <ambientLight intensity={0.9} />
      <pointLight position={[0, 0, 0]} intensity={2.0} distance={120} />

      {/* Star Field Background (Optimized for mobile GPUs) */}
      <Stars radius={150} depth={60} count={1200} factor={3} saturation={0} fade speed={0.5} />

      {/* 1. Central Earth Globe with Location Marker */}
      <CentralEarth
        observerLat={location.latitude}
        observerLon={location.longitude}
        cityName={location.cityName}
      />

      {/* 2. Upper Ring: 12 Rashi Zodiac Belt (Y = +4.5, Radius = 40) */}
      <UpperZodiacBelt3D />

      {/* Middle Planetary Ecliptic Reference Ring (Y = 0, Radius = 40) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[40, 0.08, 16, 128]} />
        <meshBasicMaterial color="#eab308" transparent opacity={0.35} />
      </mesh>

      {/* 3. Lower Ring 1: 27 Nakshatras with Pada ticks (Y = -4.5, Radius = 40) */}
      <LowerNakshatraBelt3D />

      {/* 4. Lower Ring 2: 12 Vedic Houses (Bhava Chakra) rotating with Ascendant (Y = -9.0, Radius = 40) */}
      <LowerVedicHousesBelt3D
        ascendantLongitude={ephemeris.ascendant.siderealLongitude}
        cusps={ephemeris.houses?.cusps}
      />

      {/* 5. Ascendant (Lagna) East Rising Vector Marker (Middle Belt) */}
      <PlanetMesh
        id="Ascendant"
        name="Lagna"
        sanskritName="Lagna (Rising)"
        symbol="ASC"
        color="#10b981"
        longitude={ephemeris.ascendant.siderealLongitude}
        degreesInSign={ephemeris.ascendant.rashi.degreesInSign}
        orbitRadius={40}
        rashi={ephemeris.ascendant.rashi}
        nakshatra={ephemeris.ascendant.nakshatra}
        house={1}
        isLagna={true}
        showAspectRays={showAspectRays}
        isSelected={selectedEntityId === "Ascendant"}
        planetPositionsMap={planetPositionsMap}
        dashaInfo={getDashaInfoForPlanet("Ascendant")}
        sunPos={sunPos}
        onSelect={() => setSelectedEntityId("Ascendant")}
        onFlyTo={(tId) => setSelectedEntityId(tId)}
        onResetView={() => setSelectedEntityId(null)}
      />

      {/* Midheaven (MC) Marker (Middle Belt) */}
      <PlanetMesh
        id="Midheaven"
        name="MC"
        sanskritName="Madhya Lagna"
        symbol="MC"
        color="#f59e0b"
        longitude={ephemeris.midheaven.siderealLongitude}
        degreesInSign={ephemeris.midheaven.rashi.degreesInSign}
        orbitRadius={40}
        rashi={ephemeris.midheaven.rashi}
        nakshatra={ephemeris.midheaven.nakshatra}
        house={10}
        isLagna={true}
        showAspectRays={showAspectRays}
        isSelected={selectedEntityId === "Midheaven"}
        planetPositionsMap={planetPositionsMap}
        dashaInfo={getDashaInfoForPlanet("Midheaven")}
        sunPos={sunPos}
        onSelect={() => setSelectedEntityId("Midheaven")}
        onFlyTo={(tId) => setSelectedEntityId(tId)}
        onResetView={() => setSelectedEntityId(null)}
      />

      {/* 5. Navagrahas & Modern Planets placed between Zodiac & Nakshatra (Middle Belt) */}
      {planetList.map((p) => {
        const nvInfo = neechaVakriList.find((n) => n.name === p.name);
        const combInfo = combustionList.find((c) => c.name === p.name);
        const lordInfo = jatakaChandrikaAnalysis?.grahaRoles.find((r) => r.grahaName === p.name);
        const dInfo = getDashaInfoForPlanet(p.name);

        return (
          <PlanetMesh
            key={p.id}
            id={p.id}
            name={p.name}
            sanskritName={p.sanskritName}
            symbol={p.symbol}
            color={p.color}
            longitude={p.siderealLongitude}
            degreesInSign={p.rashi.degreesInSign}
            orbitRadius={40}
            rashi={p.rashi}
            nakshatra={p.nakshatra}
            isRetrograde={p.isRetrograde}
            speed={p.speed}
            house={p.house}
            showAspectRays={showAspectRays}
            isSelected={selectedEntityId === p.id}
            planetPositionsMap={planetPositionsMap}
            neechaVakriInfo={nvInfo}
            combustionInfo={combInfo}
            lordshipInfo={lordInfo}
            dashaInfo={dInfo}
            sunPos={sunPos}
            onSelect={() => setSelectedEntityId(p.id)}
            onFlyTo={(tId) => setSelectedEntityId(tId)}
            onResetView={() => setSelectedEntityId(null)}
          />
        );
      })}

      {/* 6. Upagrahas (Sub-planets) in Middle Belt */}
      {showUpagrahas &&
        upagrahaList.map((u) => (
          <PlanetMesh
            key={u.id}
            id={u.id}
            name={u.name}
            sanskritName={u.sanskritName}
            symbol="✦"
            color="#c084fc"
            longitude={u.siderealLongitude}
            degreesInSign={u.rashi.degreesInSign}
            orbitRadius={40}
            rashi={u.rashi}
            nakshatra={u.nakshatra}
            house={u.house}
            isUpagraha={true}
            showAspectRays={false}
            isSelected={selectedEntityId === u.id}
            planetPositionsMap={planetPositionsMap}
            dashaInfo={getDashaInfoForPlanet(u.name)}
            sunPos={sunPos}
            onSelect={() => setSelectedEntityId(u.id)}
            onFlyTo={(tId) => setSelectedEntityId(tId)}
            onResetView={() => setSelectedEntityId(null)}
          />
        ))}

      {/* Free 360° Orbit Controls Around Earth */}
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        minDistance={3}
        maxDistance={100}
        rotateSpeed={0.5}
        enablePan={true}
        dampingFactor={0.08}
      />
    </>
  );
}

export default function SkyDome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fov, setFov] = useState(65);
  const [showAspectRays, setShowAspectRays] = useState(true);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      setIsFullscreen((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "+" || e.key === "=") {
        setFov((prev) => Math.max(5, prev - 10));
      } else if (e.key === "-" || e.key === "_") {
        setFov((prev) => Math.min(95, prev + 10));
      } else if (e.key === "0") {
        setFov(65);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.closest(".side-dock") ||
        target.closest(".deck-scrollable") ||
        target.closest(".glass-panel") ||
        target.closest("button") ||
        target.closest("select") ||
        target.closest("input") ||
        target.closest(".custom-scrollbar"))
    ) {
      return;
    }

    e.preventDefault();
    const zoomDelta = e.deltaY * 0.05;
    setFov((prev) => Math.min(95, Math.max(5, prev + zoomDelta)));
  };

  const { isPlaying, setSelectedEntityId } = useAstroStore();
  const zoomFactor = (65 / fov).toFixed(1);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className={`relative bg-slate-950 overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-[100] w-screen h-screen rounded-none"
          : "w-full h-full min-h-[520px] rounded-2xl border border-slate-800 shadow-2xl"
      }`}
    >
      {/* 3D WebGL Canvas (Optimized on-demand rendering for mobile batteries & GPUs) */}
      <Canvas
        camera={{ position: [0, 25, 45], fov: 65 }}
        dpr={[1, 1.25]}
        frameloop={isPlaying ? "always" : "demand"}
        performance={{ min: 0.5 }}
        onPointerMissed={() => setSelectedEntityId(null)}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          depth: true,
          stencil: false,
          precision: "mediump",
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <SkyScene fov={fov} showAspectRays={showAspectRays} />
      </Canvas>

      {/* Top Header Overlay Bar (Unified Responsive Container) */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Geocentric Bhu-Mandala Indicator */}
        <div className="pointer-events-auto glass-panel px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 sm:gap-2 text-xs shadow-md bg-slate-950/90">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse flex-shrink-0"></span>
          <span className="font-extrabold text-slate-100 text-[11px] sm:text-xs">Bhu-Mandala</span>
          <span className="text-slate-400 text-[10px] hidden md:inline">| Earth Center • Graha Drishti</span>
        </div>

        {/* Right: Aspect Toggle, Zoom & Fullscreen */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* Toggle Aspect Rays */}
          <button
            onClick={() => setShowAspectRays(!showAspectRays)}
            className={`glass-panel px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer bg-slate-950/90 ${
              showAspectRays
                ? "bg-amber-500/20 border-amber-500 text-amber-300"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Toggle Vedic Planetary Aspect Rays (Graha Drishti)"
          >
            <span>✨</span>
            <span className="hidden sm:inline">{showAspectRays ? "Aspect Rays: ON" : "Aspect Rays: OFF"}</span>
            <span className="sm:hidden">{showAspectRays ? "Rays: ON" : "Rays: OFF"}</span>
          </button>

          {/* Telescope Zoom Controls */}
          <div className="glass-panel p-1 rounded-xl flex items-center gap-1 text-xs shadow-lg bg-slate-950/90">
            <span className="text-[10px] text-amber-400 font-bold px-1 font-mono">
              🔭 {zoomFactor}x
            </span>

            <button
              onClick={() => setFov((prev) => Math.max(5, prev - 12))}
              title="Zoom In"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-sm flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
            >
              +
            </button>

            <button
              onClick={() => setFov((prev) => Math.min(95, prev + 12))}
              title="Zoom Out"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-extrabold text-sm flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
            >
              -
            </button>

            <button
              onClick={() => setFov(65)}
              title="Reset Zoom to 1x"
              className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[9px] sm:text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              1x
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            className="glass-panel px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold text-slate-200 hover:text-amber-400 hover:border-amber-500/50 flex items-center gap-1 transition-all shadow-lg active:scale-95 cursor-pointer bg-slate-950/90"
          >
            <span className="text-xs">{isFullscreen ? "⤓" : "⛶"}</span>
            <span className="hidden sm:inline">{isFullscreen ? "Exit" : "Full"}</span>
          </button>
        </div>
      </div>

      {/* Left Vertical Dock: Date & Time Travel Controller */}
      <div className="absolute left-3 top-14 bottom-12 z-40 flex items-start pointer-events-none">
        <VerticalTimeTravel />
      </div>

      {/* Right Vertical Dock: Planet Index & 3D Focus Controller */}
      <div className="absolute right-3 top-14 bottom-12 z-40 flex items-start pointer-events-none">
        <PlanetIndexDeck />
      </div>

      {/* Bottom Hint Banner */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden md:block">
        <div className="text-[10.5px] text-slate-400 glass-panel px-3 py-1 rounded-full shadow-lg border border-slate-800/80 backdrop-blur-md">
          Left: Time Controller • Right: Planet Index (Click to Rotate 3D View) • Center: Bhu-Mandala
        </div>
      </div>
    </div>
  );
}