import { create } from "zustand";
import {
  AyanamshaType,
  EphemerisResult,
  GeoLocation,
  HouseSystem,
  NodeType,
} from "../engine/types";
import { POPULAR_CITIES } from "../engine/constants";
import { calculateVedicEphemeris } from "../engine/ephemeris";

export type ViewMode = "3d" | "kundli-north" | "ashtakavarga" | "numerology" | "table" | "dual";
export type SkyViewType = "ecliptic" | "horizontal";

interface AstroState {
  currentDate: Date;
  isPlaying: boolean;
  playSpeed: number; // multiplier
  location: GeoLocation;
  ayanamsha: AyanamshaType;
  houseSystem: HouseSystem;
  nodeType: NodeType;
  showModernPlanets: boolean;
  showUpagrahas: boolean;
  showConstellations: boolean;
  viewMode: ViewMode;
  skyViewType: SkyViewType;
  selectedEntityId: string | null;
  ephemeris: EphemerisResult;

  // Actions
  setDate: (date: Date) => void;
  stepTime: (amount: number, unit: "minute" | "hour" | "day" | "month" | "year" | "century") => void;
  setLocation: (loc: GeoLocation) => void;
  setAyanamsha: (type: AyanamshaType) => void;
  setHouseSystem: (sys: HouseSystem) => void;
  setNodeType: (node: NodeType) => void;
  togglePlay: () => void;
  setPlaySpeed: (speed: number) => void;
  setShowModernPlanets: (show: boolean) => void;
  setShowUpagrahas: (show: boolean) => void;
  setShowConstellations: (show: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  setSkyViewType: (type: SkyViewType) => void;
  setSelectedEntityId: (id: string | null) => void;
  recompute: () => void;
}

const initialDate = new Date();
const initialLocation = POPULAR_CITIES[0]; // Varanasi
const initialAyanamsha: AyanamshaType = "Lahiri";
const initialHouseSystem: HouseSystem = "WholeSign";
const initialNodeType: NodeType = "Mean";

export const useAstroStore = create<AstroState>((set, get) => ({
  currentDate: initialDate,
  isPlaying: false,
  playSpeed: 1, // 1 hour per tick
  location: initialLocation,
  ayanamsha: initialAyanamsha,
  houseSystem: initialHouseSystem,
  nodeType: initialNodeType,
  showModernPlanets: false,
  showUpagrahas: true,
  showConstellations: true,
  viewMode: "3d",
  skyViewType: "ecliptic",
  selectedEntityId: "Sun",
  ephemeris: calculateVedicEphemeris(
    initialDate,
    initialLocation,
    initialAyanamsha,
    initialHouseSystem,
    initialNodeType
  ),

  setDate: (date) => {
    const { location, ayanamsha, houseSystem, nodeType } = get();
    set({
      currentDate: date,
      ephemeris: calculateVedicEphemeris(date, location, ayanamsha, houseSystem, nodeType),
    });
  },

  stepTime: (amount, unit) => {
    const { currentDate, setDate } = get();
    const d = new Date(currentDate);

    switch (unit) {
      case "minute":
        d.setMinutes(d.getMinutes() + amount);
        break;
      case "hour":
        d.setHours(d.getHours() + amount);
        break;
      case "day":
        d.setDate(d.getDate() + amount);
        break;
      case "month":
        d.setMonth(d.getMonth() + amount);
        break;
      case "year":
        d.setFullYear(d.getFullYear() + amount);
        break;
      case "century":
        d.setFullYear(d.getFullYear() + amount * 100);
        break;
    }
    setDate(d);
  },

  setLocation: (loc) => {
    const { currentDate, ayanamsha, houseSystem, nodeType } = get();
    set({
      location: loc,
      ephemeris: calculateVedicEphemeris(currentDate, loc, ayanamsha, houseSystem, nodeType),
    });
  },

  setAyanamsha: (type) => {
    const { currentDate, location, houseSystem, nodeType } = get();
    set({
      ayanamsha: type,
      ephemeris: calculateVedicEphemeris(currentDate, location, type, houseSystem, nodeType),
    });
  },

  setHouseSystem: (sys) => {
    const { currentDate, location, ayanamsha, nodeType } = get();
    set({
      houseSystem: sys,
      ephemeris: calculateVedicEphemeris(currentDate, location, ayanamsha, sys, nodeType),
    });
  },

  setNodeType: (node) => {
    const { currentDate, location, ayanamsha, houseSystem } = get();
    set({
      nodeType: node,
      ephemeris: calculateVedicEphemeris(currentDate, location, ayanamsha, houseSystem, node),
    });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaySpeed: (speed) => set({ playSpeed: speed }),
  setShowModernPlanets: (show) => set({ showModernPlanets: show }),
  setShowUpagrahas: (show) => set({ showUpagrahas: show }),
  setShowConstellations: (show) => set({ showConstellations: show }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSkyViewType: (type) => set({ skyViewType: type }),
  setSelectedEntityId: (id) => set({ selectedEntityId: id }),

  recompute: () => {
    const { currentDate, location, ayanamsha, houseSystem, nodeType } = get();
    set({
      ephemeris: calculateVedicEphemeris(currentDate, location, ayanamsha, houseSystem, nodeType),
    });
  },
}));
