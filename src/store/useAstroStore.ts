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

export type ViewMode =
  | "3d"
  | "kundli-north"
  | "dasha"
  | "gochar"
  | "choghadiya"
  | "ashtakavarga"
  | "numerology"
  | "tithi-birthday"
  | "tithi-calendar"
  | "shodashavarga"
  | "shadbala"
  | "bhavabala"
  | "jaimini"
  | "matchmaking"
  | "muhurta"
  | "prashna"
  | "table"
  | "dual";
export type SkyViewType = "ecliptic" | "horizontal";

export interface BirthProfile {
  id: string;
  name: string;
  dateIso: string;
  location: GeoLocation;
  ayanamsha: AyanamshaType;
  isDefault?: boolean;
  savedAt: number;
}

const STORAGE_ACTIVE_KEY = "vedic_active_chart_data";
const STORAGE_PROFILES_KEY = "vedic_saved_birth_profiles";

function getStoredProfiles(): BirthProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_PROFILES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveProfilesToStorage(profiles: BirthProfile[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
  } catch (_) {}
}

function saveActiveChartToStorage(date: Date, location: GeoLocation, ayanamsha: AyanamshaType, profileName?: string | null) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_ACTIVE_KEY,
      JSON.stringify({
        dateIso: date.toISOString(),
        location,
        ayanamsha,
        profileName: profileName || null,
      })
    );
  } catch (_) {}
}

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

  // Profile Management & Persistence
  savedProfiles: BirthProfile[];
  activeProfileName: string | null;

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

  // Saved Profile Methods
  saveProfile: (name: string, isDefault?: boolean) => BirthProfile;
  loadProfile: (profile: BirthProfile) => void;
  deleteProfile: (profileId: string) => void;
  resetToLiveTransit: () => void;
  initFromStorage: () => void;
}

const defaultDate = new Date();
const defaultLocation = POPULAR_CITIES[0]; // Varanasi
const defaultAyanamsha: AyanamshaType = "Lahiri";
const defaultHouseSystem: HouseSystem = "WholeSign";
const defaultNodeType: NodeType = "Mean";

export const useAstroStore = create<AstroState>((set, get) => ({
  currentDate: defaultDate,
  isPlaying: false,
  playSpeed: 1, // 1 hour per tick
  location: defaultLocation,
  ayanamsha: defaultAyanamsha,
  houseSystem: defaultHouseSystem,
  nodeType: defaultNodeType,
  showModernPlanets: false,
  showUpagrahas: true,
  showConstellations: true,
  viewMode: "kundli-north",
  skyViewType: "ecliptic",
  selectedEntityId: null,
  savedProfiles: [],
  activeProfileName: null,
  ephemeris: calculateVedicEphemeris(
    defaultDate,
    defaultLocation,
    defaultAyanamsha,
    defaultHouseSystem,
    defaultNodeType
  ),

  setDate: (date) => {
    const { location, ayanamsha, houseSystem, nodeType, activeProfileName } = get();
    saveActiveChartToStorage(date, location, ayanamsha, activeProfileName);
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
    const { currentDate, ayanamsha, houseSystem, nodeType, activeProfileName } = get();
    saveActiveChartToStorage(currentDate, loc, ayanamsha, activeProfileName);
    set({
      location: loc,
      ephemeris: calculateVedicEphemeris(currentDate, loc, ayanamsha, houseSystem, nodeType),
    });
  },

  setAyanamsha: (type) => {
    const { currentDate, location, houseSystem, nodeType, activeProfileName } = get();
    saveActiveChartToStorage(currentDate, location, type, activeProfileName);
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

  // Saved Profile Methods
  saveProfile: (name, isDefault = true) => {
    const { currentDate, location, ayanamsha, savedProfiles } = get();
    const cleanName = name.trim() || "My Birth Chart";

    let updatedList = savedProfiles.map((p) => (isDefault ? { ...p, isDefault: false } : p));
    const newProfile: BirthProfile = {
      id: Date.now().toString(),
      name: cleanName,
      dateIso: currentDate.toISOString(),
      location,
      ayanamsha,
      isDefault,
      savedAt: Date.now(),
    };

    updatedList = [newProfile, ...updatedList];
    saveProfilesToStorage(updatedList);
    saveActiveChartToStorage(currentDate, location, ayanamsha, cleanName);

    set({
      savedProfiles: updatedList,
      activeProfileName: cleanName,
    });

    return newProfile;
  },

  loadProfile: (profile) => {
    const { houseSystem, nodeType } = get();
    const date = new Date(profile.dateIso);
    const loc = profile.location;
    const aya = profile.ayanamsha || "Lahiri";

    saveActiveChartToStorage(date, loc, aya, profile.name);

    set({
      currentDate: date,
      location: loc,
      ayanamsha: aya,
      activeProfileName: profile.name,
      ephemeris: calculateVedicEphemeris(date, loc, aya, houseSystem, nodeType),
    });
  },

  deleteProfile: (profileId) => {
    const { savedProfiles } = get();
    const updatedList = savedProfiles.filter((p) => p.id !== profileId);
    saveProfilesToStorage(updatedList);
    set({ savedProfiles: updatedList });
  },

  resetToLiveTransit: () => {
    const { location, ayanamsha, houseSystem, nodeType } = get();
    const liveNow = new Date();
    set({
      currentDate: liveNow,
      activeProfileName: "🔴 Live Transit (Now)",
      ephemeris: calculateVedicEphemeris(liveNow, location, ayanamsha, houseSystem, nodeType),
    });
  },

  initFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const profiles = getStoredProfiles();
      const rawActive = localStorage.getItem(STORAGE_ACTIVE_KEY);

      let targetDate: Date = defaultDate;
      let targetLoc: GeoLocation = defaultLocation;
      let targetAya: AyanamshaType = defaultAyanamsha;
      let targetProfileName: string | null = null;

      if (rawActive) {
        const parsed = JSON.parse(rawActive);
        if (parsed.dateIso) targetDate = new Date(parsed.dateIso);
        if (parsed.location) targetLoc = parsed.location;
        if (parsed.ayanamsha) targetAya = parsed.ayanamsha;
        if (parsed.profileName) targetProfileName = parsed.profileName;
      } else {
        const defaultProf = profiles.find((p) => p.isDefault) || profiles[0];
        if (defaultProf) {
          targetDate = new Date(defaultProf.dateIso);
          targetLoc = defaultProf.location;
          targetAya = defaultProf.ayanamsha || "Lahiri";
          targetProfileName = defaultProf.name;
        }
      }

      const { houseSystem, nodeType } = get();
      set({
        savedProfiles: profiles,
        currentDate: targetDate,
        location: targetLoc,
        ayanamsha: targetAya,
        activeProfileName: targetProfileName,
        ephemeris: calculateVedicEphemeris(targetDate, targetLoc, targetAya, houseSystem, nodeType),
      });
    } catch (_) {}
  },
}));
