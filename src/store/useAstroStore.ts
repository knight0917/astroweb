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
  gender?: "male" | "female";
  isDefault?: boolean;
  savedAt: number;
}

export interface MatchmakingProfileData {
  name: string;
  dateIso: string;
  location: GeoLocation;
}

export interface MatchmakingStoreState {
  boy: MatchmakingProfileData;
  girl: MatchmakingProfileData;
}

const STORAGE_ACTIVE_KEY = "vedic_active_chart_data";
const STORAGE_PROFILES_KEY = "vedic_saved_birth_profiles";
const STORAGE_MATCHMAKING_KEY = "vedic_matchmaking_active_state";

const defaultMatchmakingState: MatchmakingStoreState = {
  boy: {
    name: "Groom (वर ♂)",
    dateIso: "1998-09-05T21:29",
    location: {
      cityName: "Bhuj",
      country: "India",
      latitude: 23.254,
      longitude: 69.6693,
      elevation: 106,
      timezoneOffsetHours: 5.5,
    },
  },
  girl: {
    name: "Bride (कन्या ♀)",
    dateIso: "2000-07-04T19:07",
    location: {
      cityName: "Vasai (Mumbai)",
      country: "India",
      latitude: 19.3919,
      longitude: 72.8397,
      elevation: 11,
      timezoneOffsetHours: 5.5,
    },
  },
};

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

function saveMatchmakingToStorage(state: MatchmakingStoreState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_MATCHMAKING_KEY, JSON.stringify(state));
  } catch (_) {}
}

function getStoredMatchmaking(): MatchmakingStoreState {
  if (typeof window === "undefined") return defaultMatchmakingState;
  try {
    const raw = localStorage.getItem(STORAGE_MATCHMAKING_KEY);
    return raw ? { ...defaultMatchmakingState, ...JSON.parse(raw) } : defaultMatchmakingState;
  } catch (_) {
    return defaultMatchmakingState;
  }
}

function saveActiveChartToStorage(
  date: Date,
  location: GeoLocation,
  ayanamsha: AyanamshaType,
  profileName?: string | null,
  gender: "male" | "female" = "male"
) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_ACTIVE_KEY,
      JSON.stringify({
        dateIso: date.toISOString(),
        location,
        ayanamsha,
        profileName: profileName || null,
        gender,
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
  gender: "male" | "female";
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

  // Matchmaking State (Groom & Bride)
  matchmaking: MatchmakingStoreState;

  // Actions
  setDate: (date: Date) => void;
  stepTime: (amount: number, unit: "minute" | "hour" | "day" | "month" | "year" | "century") => void;
  setLocation: (loc: GeoLocation) => void;
  setAyanamsha: (type: AyanamshaType) => void;
  setHouseSystem: (sys: HouseSystem) => void;
  setNodeType: (node: NodeType) => void;
  setGender: (gender: "male" | "female") => void;
  setMatchmakingBoy: (data: Partial<MatchmakingProfileData>) => void;
  setMatchmakingGirl: (data: Partial<MatchmakingProfileData>) => void;
  setMatchmakingState: (state: MatchmakingStoreState) => void;
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
  saveProfile: (name: string, isDefault?: boolean, gender?: "male" | "female") => BirthProfile;
  loadProfile: (profile: BirthProfile) => void;
  deleteProfile: (profileId: string) => void;
  resetToLiveTransit: (customLocation?: GeoLocation) => void;
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
  gender: "male",
  showModernPlanets: false,
  showUpagrahas: true,
  showConstellations: true,
  viewMode: "kundli-north",
  skyViewType: "ecliptic",
  selectedEntityId: null,
  savedProfiles: [],
  activeProfileName: null,
  matchmaking: defaultMatchmakingState,
  ephemeris: calculateVedicEphemeris(
    defaultDate,
    defaultLocation,
    defaultAyanamsha,
    defaultHouseSystem,
    defaultNodeType
  ),

  setDate: (date) => {
    const { location, ayanamsha, houseSystem, nodeType, activeProfileName, gender } = get();
    saveActiveChartToStorage(date, location, ayanamsha, activeProfileName, gender);
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
    const { currentDate, ayanamsha, houseSystem, nodeType, activeProfileName, gender } = get();
    saveActiveChartToStorage(currentDate, loc, ayanamsha, activeProfileName, gender);
    set({
      location: loc,
      ephemeris: calculateVedicEphemeris(currentDate, loc, ayanamsha, houseSystem, nodeType),
    });
  },

  setAyanamsha: (type) => {
    const { currentDate, location, houseSystem, nodeType, activeProfileName, gender } = get();
    saveActiveChartToStorage(currentDate, location, type, activeProfileName, gender);
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

  setGender: (g) => {
    const { currentDate, location, ayanamsha, activeProfileName } = get();
    saveActiveChartToStorage(currentDate, location, ayanamsha, activeProfileName, g);
    set({ gender: g });
  },

  setMatchmakingBoy: (data) => {
    const { matchmaking } = get();
    const updated: MatchmakingStoreState = {
      ...matchmaking,
      boy: { ...matchmaking.boy, ...data },
    };
    saveMatchmakingToStorage(updated);
    set({ matchmaking: updated });
  },

  setMatchmakingGirl: (data) => {
    const { matchmaking } = get();
    const updated: MatchmakingStoreState = {
      ...matchmaking,
      girl: { ...matchmaking.girl, ...data },
    };
    saveMatchmakingToStorage(updated);
    set({ matchmaking: updated });
  },

  setMatchmakingState: (state) => {
    saveMatchmakingToStorage(state);
    set({ matchmaking: state });
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

  saveProfile: (name, isDefault = false, profGender) => {
    const { currentDate, location, ayanamsha, savedProfiles, gender } = get();
    const cleanName = name.trim() || "Saved Birth Chart";
    const chosenGender = profGender || gender;

    const newProfile: BirthProfile = {
      id: "profile_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      name: cleanName,
      dateIso: currentDate.toISOString(),
      location: { ...location },
      ayanamsha,
      gender: chosenGender,
      isDefault,
      savedAt: Date.now(),
    };

    let updatedList = isDefault
      ? savedProfiles.map((p) => ({ ...p, isDefault: false }))
      : [...savedProfiles];

    updatedList = [newProfile, ...updatedList];
    saveProfilesToStorage(updatedList);
    saveActiveChartToStorage(currentDate, location, ayanamsha, cleanName, chosenGender);

    set({
      savedProfiles: updatedList,
      activeProfileName: cleanName,
      gender: chosenGender,
    });

    return newProfile;
  },

  loadProfile: (profile) => {
    const { houseSystem, nodeType } = get();
    const date = new Date(profile.dateIso);
    const loc = profile.location;
    const aya = profile.ayanamsha || "Lahiri";
    const profGender = profile.gender || "male";

    saveActiveChartToStorage(date, loc, aya, profile.name, profGender);

    set({
      currentDate: date,
      location: loc,
      ayanamsha: aya,
      activeProfileName: profile.name,
      gender: profGender,
      ephemeris: calculateVedicEphemeris(date, loc, aya, houseSystem, nodeType),
    });
  },

  deleteProfile: (profileId) => {
    const { savedProfiles } = get();
    const updatedList = savedProfiles.filter((p) => p.id !== profileId);
    saveProfilesToStorage(updatedList);
    set({ savedProfiles: updatedList });
  },

  resetToLiveTransit: (customLocation?: GeoLocation) => {
    const { location, ayanamsha, houseSystem, nodeType } = get();
    const liveNow = new Date();
    const targetLoc = customLocation || location;
    set({
      currentDate: liveNow,
      location: targetLoc,
      activeProfileName: "🔴 Live Transit (Now)",
      ephemeris: calculateVedicEphemeris(liveNow, targetLoc, ayanamsha, houseSystem, nodeType),
    });
  },

  initFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const profiles = getStoredProfiles();
      const storedMatchmaking = getStoredMatchmaking();
      const rawActive = localStorage.getItem(STORAGE_ACTIVE_KEY);

      let targetDate: Date = defaultDate;
      let targetLoc: GeoLocation = defaultLocation;
      let targetAya: AyanamshaType = defaultAyanamsha;
      let targetProfileName: string | null = null;
      let targetGender: "male" | "female" = "male";

      if (rawActive) {
        const parsed = JSON.parse(rawActive);
        if (parsed.dateIso) targetDate = new Date(parsed.dateIso);
        if (parsed.location) targetLoc = parsed.location;
        if (parsed.ayanamsha) targetAya = parsed.ayanamsha;
        if (parsed.profileName) targetProfileName = parsed.profileName;
        if (parsed.gender) targetGender = parsed.gender;
      } else {
        const defaultProf = profiles.find((p) => p.isDefault) || profiles[0];
        if (defaultProf) {
          targetDate = new Date(defaultProf.dateIso);
          targetLoc = defaultProf.location;
          targetAya = defaultProf.ayanamsha || "Lahiri";
          targetProfileName = defaultProf.name;
          if (defaultProf.gender) targetGender = defaultProf.gender;
        }
      }

      const { houseSystem, nodeType } = get();
      set({
        savedProfiles: profiles,
        currentDate: targetDate,
        location: targetLoc,
        ayanamsha: targetAya,
        activeProfileName: targetProfileName,
        gender: targetGender,
        matchmaking: storedMatchmaking,
        ephemeris: calculateVedicEphemeris(targetDate, targetLoc, targetAya, houseSystem, nodeType),
      });
    } catch (_) {}
  },
}));
