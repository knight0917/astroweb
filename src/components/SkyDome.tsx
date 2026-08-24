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

// 3D Planet Marker with Planetary Aspect Rays (Graha Drishti) & Hover Degree Tooltip
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
  onSelect,
}: {
  id: string;
  name: string;
  sanskritName: string;
  symbol: string;
  color: string;
  longitude: number;
  degreesInSign: number;
  orbitRadius: number;
  rashi: { sanskritName: string; symbol: string; degreesInSign: number };
  nakshatra: { sanskritName: string; pada: number; lord?: string; deity?: string; animal?: string; animalSymbol?: string };
  isRetrograde?: boolean;
  speed?: number;
  house?: number;
  isUpagraha?: boolean;
  isLagna?: boolean;
  showAspectRays: boolean;
  isSelected: boolean;
  onSelect: () => void;
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

  // Calculate authentic Vedic Aspect Rays (Graha Drishti)
  const aspectRays = useMemo(() => {
    if (isUpagraha) return []; // Upagrahas do not cast independent Drishti

    const aspects = getVedicAspects(name);
    return aspects.map((asp) => {
      const targetLon = (longitude + asp.degOffset) % 360;
      const targetPos = eclipticToCartesian(targetLon, 0, 40);
      const points = new Float32Array([
        position[0],
        position[1],
        position[2],
        targetPos[0],
        targetPos[1],
        targetPos[2],
      ]);
      return {
        ...asp,
        targetLon,
        targetPos,
        points,
      };
    });
  }, [name, longitude, position, isUpagraha]);

  return (
    <group>
      {/* 3D Planetary Aspect Rays (Graha Drishti) with authentic planet color */}
      {showAspectRays &&
        aspectRays.map((asp, idx) => {
          const isHighlit = hovered || isSelected;
          return (
            <group key={idx}>
              {/* Colored Luminous Ray Beam */}
              <line>
                <bufferGeometry>
                  <bufferAttribute attach="attributes-position" args={[asp.points, 3]} />
                </bufferGeometry>
                <lineBasicMaterial
                  color={color}
                  transparent
                  opacity={isHighlit ? 0.95 : 0.35}
                />
              </line>

              {/* Target Impact Node on Zodiac Belt */}
              <mesh position={asp.targetPos}>
                <sphereGeometry args={[isHighlit ? 0.6 : 0.3, 16, 16]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={isHighlit ? 2.5 : 1.0}
                />
              </mesh>

              {/* Aspect Label on Hover */}
              {isHighlit && (
                <group position={asp.targetPos}>
                  <Html distanceFactor={36} center zIndexRange={[0, 10]}>
                    <div
                      style={{ borderColor: color }}
                      className="px-2 py-0.5 rounded-md bg-slate-950/90 border text-[9px] font-bold text-slate-100 shadow-xl whitespace-nowrap pointer-events-none select-none"
                    >
                      <span style={{ color: color }}>✦ {asp.label}</span>
                      <span className="text-slate-400 font-mono ml-1">
                        ({formatDMS(asp.targetLon)})
                      </span>
                    </div>
                  </Html>
                </group>
              )}
            </group>
          );
        })}

      {/* Planet Orb Group */}
      <group position={position}>
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
            emissiveIntensity={isSelected ? 2.0 : hovered ? 1.4 : 0.8}
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

        {/* Comprehensive Hover Degree Tooltip Card */}
        {hovered && (
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
                  <span className="text-slate-400">Rashi (Zodiac):</span>
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

                {/* Aspect Summary in Tooltip */}
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

// Main Inside-the-Dome Celestial Scene
function SkyScene({ fov, showAspectRays }: { fov: number; showAspectRays: boolean }) {
  const {
    ephemeris,
    location,
    showUpagrahas,
    showModernPlanets,
    selectedEntityId,
    setSelectedEntityId,
  } = useAstroStore();

  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetCamPos = useRef<THREE.Vector3 | null>(null);

  // Smooth camera orientation to turn and face selected planet
  useEffect(() => {
    if (!selectedEntityId || !ephemeris) return;

    let lon: number | null = null;
    if (selectedEntityId === "Ascendant") {
      lon = ephemeris.ascendant.siderealLongitude;
    } else if (selectedEntityId === "Midheaven") {
      lon = ephemeris.midheaven.siderealLongitude;
    } else if (ephemeris.planets[selectedEntityId]) {
      lon = ephemeris.planets[selectedEntityId].siderealLongitude;
    } else if (ephemeris.upagrahas[selectedEntityId]) {
      lon = ephemeris.upagrahas[selectedEntityId].siderealLongitude;
    }

    if (lon !== null) {
      const pos = eclipticToCartesian(lon, 0, 40);
      const dir = new THREE.Vector3(pos[0], 0, pos[2]).normalize();
      // Orbit camera outside the planet facing inward so planet is centered directly in view
      targetCamPos.current = new THREE.Vector3(dir.x * 55, 8, dir.z * 55);
    }
  }, [selectedEntityId, ephemeris]);

  // Handle FOV & Camera Turning interpolation
  useFrame(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      if (Math.abs(camera.fov - fov) > 0.05) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, fov, 0.15);
        camera.updateProjectionMatrix();
      }
    }

    if (targetCamPos.current) {
      camera.position.lerp(targetCamPos.current, 0.08);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.08);
        controlsRef.current.update();
      }
      if (camera.position.distanceTo(targetCamPos.current) < 0.2) {
        targetCamPos.current = null;
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

  // Distinct radial distances for planetary shells between Earth (r=5) and Nakshatras (r=37)
  const PLANET_RADII: Record<string, number> = {
    Sun: 24,
    Moon: 14,
    Mercury: 17,
    Venus: 20,
    Mars: 27,
    Jupiter: 30,
    Saturn: 33,
    Rahu: 22,
    Ketu: 22,
    Uranus: 34,
    Neptune: 35,
    Pluto: 36,
  };

  return (
    <>
      <ambientLight intensity={0.9} />
      <pointLight position={[0, 0, 0]} intensity={2.0} distance={120} />

      {/* Star Field Background */}
      <Stars radius={150} depth={60} count={4000} factor={4} saturation={0} fade speed={1} />

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
        onSelect={() => setSelectedEntityId("Ascendant")}
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
        onSelect={() => setSelectedEntityId("Midheaven")}
      />

      {/* 5. Navagrahas & Modern Planets placed between Zodiac & Nakshatra (Middle Belt) */}
      {planetList.map((p) => {
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
            onSelect={() => setSelectedEntityId(p.id)}
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
            onSelect={() => setSelectedEntityId(u.id)}
          />
        ))}

      {/* Free 360° Orbit Controls Around Earth */}
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        minDistance={8}
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
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 25, 45], fov: 65 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          depth: true,
          stencil: false,
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
          ⏳ Left: Time Controller • 🪐 Right: Planet Index (Click to Rotate 3D View) • 🌍 Center: Bhu-Mandala
        </div>
      </div>
    </div>
  );
}