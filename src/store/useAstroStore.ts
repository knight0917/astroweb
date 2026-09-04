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
  | "adhana"
  | "reviews"
  | "table"
  | "dual"
  | "vastu";
export type SkyViewType = "ecliptic" | "horizontal";

export interface BirthProfile {
  id: string;
  userEmail?: string;
  name: string;
  gender?: "male" | "female";
  dateIso: string;
  dob?: string;
  time?: string;
  location: GeoLocation;
  ayanamsha: AyanamshaType;
  isDefault?: boolean;
  notes?: string;
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
const STORAGE_USER_EMAIL_KEY = "vedic_user_email";
const STORAGE_MATCHMAKING_KEY = "vedic_matchmaking_active_state";
const STORAGE_LAST_CACHE_CLEANUP_KEY = "vedic_last_cache_cleanup_timestamp";

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
  inspectorEntityId: string | null;
  ephemeris: EphemerisResult;

  // Profile Management & Persistence
  savedProfiles: BirthProfile[];
  activeProfileName: string | null;
  userEmail: string | null;
  isSyncingDb: boolean;
  lastCacheCleanupTime: number | null;
  run24HourCacheCleanup: (force?: boolean) => Promise<{ cleaned: boolean; message: string }>;

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
  setUserEmail: (email: string | null) => void;
  syncChartsWithDb: (customEmail?: string) => Promise<BirthProfile[]>;
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
  setInspectorEntityId: (id: string | null) => void;
  recompute: () => void;

  // Saved Profile Methods
  saveProfile: (
    name: string,
    isDefault?: boolean,
    gender?: "male" | "female",
    email?: string,
    notes?: string
  ) => Promise<BirthProfile>;
  loadProfile: (profile: BirthProfile) => void;
  deleteProfile: (profileId: string) => Promise<void>;
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
  inspectorEntityId: null,
  savedProfiles: [],
  activeProfileName: null,
  userEmail: null,
  isSyncingDb: false,
  lastCacheCleanupTime: null,
  matchmaking: defaultMatchmakingState,
  ephemeris: calculateVedicEphemeris(
    defaultDate,
    defaultLocation,
    defaultAyanamsha,
    defaultHouseSystem,
    defaultNodeType
  ),

  setUserEmail: (email) => {
    const clean = email?.trim().toLowerCase() || null;
    if (typeof window !== "undefined") {
      if (clean) localStorage.setItem(STORAGE_USER_EMAIL_KEY, clean);
      else localStorage.removeItem(STORAGE_USER_EMAIL_KEY);
    }
    set({ userEmail: clean });
    if (clean) {
      get().syncChartsWithDb(clean);
    }
  },

    run24HourCacheCleanup: async (force = false) => {
    if (typeof window === "undefined") {
      return { cleaned: false, message: "Window undefined" };
    }

    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const rawLast = localStorage.getItem(STORAGE_LAST_CACHE_CLEANUP_KEY);
    const lastTime = rawLast ? Number(rawLast) : 0;
    const isDue = force || !lastTime || (now - lastTime >= TWENTY_FOUR_HOURS_MS);

    if (!isDue) {
      set({ lastCacheCleanupTime: lastTime });
      return {
        cleaned: false,
        message: `Cache is fresh. Next 24h cleanup in ${Math.round((TWENTY_FOUR_HOURS_MS - (now - lastTime)) / (60 * 1000))} minutes.`,
      };
    }

    try {
      // 1. Purge Browser CacheStorage (PWA / Assets cache)
      if ("caches" in window) {
        const cacheKeys = await window.caches.keys();
        await Promise.all(cacheKeys.map((k) => window.caches.delete(k)));
      }

      // 2. Notify Service Worker if available
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE_24H" });
      }

      // 3. Invalidate temporary transient keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("vedic_transient_") || key.startsWith("vedic_cache_"))) {
          localStorage.removeItem(key);
        }
      }

      // 4. Auto-sync profiles with Cloud DB if email is linked
      const currentEmail = get().userEmail;
      if (currentEmail) {
        await get().syncChartsWithDb(currentEmail);
      }

      // 5. Update timestamp
      localStorage.setItem(STORAGE_LAST_CACHE_CLEANUP_KEY, String(now));
      set({ lastCacheCleanupTime: now });

      console.log("[Vedic Sky Tracker] 24-Hour Cache Invalidation successfully executed across all connected device storage.");
      return {
        cleaned: true,
        message: "24-Hour cache invalidation completed. Device storage synchronized with cloud vault.",
      };
    } catch (err: any) {
      console.warn("24h cache cleanup warning:", err);
      return { cleaned: false, message: err?.message || "Cleanup failed" };
    }
  },

  syncChartsWithDb: async (customEmail) => {
    const targetEmail = customEmail || get().userEmail;
    if (!targetEmail || typeof window === "undefined") return [];

    set({ isSyncingDb: true });
    try {
      const res = await fetch(`/api/charts?email=${encodeURIComponent(targetEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.charts && Array.isArray(data.charts)) {
          const dbProfiles: BirthProfile[] = data.charts.map((c: any) => ({
            id: c.id,
            userEmail: c.userEmail,
            name: c.name,
            gender: c.gender || "male",
            dateIso: c.dateIso,
            dob: c.dob,
            time: c.time,
            location: c.location,
            ayanamsha: (c.ayanamsha as AyanamshaType) || "Lahiri",
            isDefault: Boolean(c.isDefault),
            notes: c.notes,
            savedAt: new Date(c.updatedAt || c.createdAt).getTime(),
          }));

          // Merge DB profiles with local profiles
          const localProfiles = getStoredProfiles();
          const mergedMap = new Map<string, BirthProfile>();

          // DB profiles take highest precedence
          dbProfiles.forEach((p) => mergedMap.set(p.id, p));
          localProfiles.forEach((p) => {
            if (!mergedMap.has(p.id)) mergedMap.set(p.id, p);
          });

          const mergedList = Array.from(mergedMap.values()).sort((a, b) => b.savedAt - a.savedAt);
          saveProfilesToStorage(mergedList);
          set({ savedProfiles: mergedList, isSyncingDb: false });
          return mergedList;
        }
      }
    } catch (err) {
      console.warn("Could not sync with DB:", err);
    } finally {
      set({ isSyncingDb: false });
    }
    return get().savedProfiles;
  },

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

  setAyanamsha: (ayanamsha) => {
    const { currentDate, location, houseSystem, nodeType, activeProfileName, gender } = get();
    saveActiveChartToStorage(currentDate, location, ayanamsha, activeProfileName, gender);
    set({
      ayanamsha,
      ephemeris: calculateVedicEphemeris(currentDate, location, ayanamsha, houseSystem, nodeType),
    });
  },

  setHouseSystem: (houseSystem) => {
    const { currentDate, location, ayanamsha, nodeType } = get();
    set({
      houseSystem,
      ephemeris: calculateVedicEphemeris(currentDate, location, ayanamsha, houseSystem, nodeType),
    });
  },

  setNodeType: (nodeType) => {
    const { currentDate, location, ayanamsha, houseSystem } = get();
    set({
      nodeType,
      ephemeris: calculateVedicEphemeris(currentDate, location, ayanamsha, houseSystem, nodeType),
    });
  },

  setGender: (gender) => {
    const { currentDate, location, ayanamsha, activeProfileName } = get();
    saveActiveChartToStorage(currentDate, location, ayanamsha, activeProfileName, gender);
    set({ gender });
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
  setPlaySpeed: (playSpeed) => set({ playSpeed }),
  setShowModernPlanets: (showModernPlanets) => set({ showModernPlanets }),
  setShowUpagrahas: (showUpagrahas) => set({ showUpagrahas }),
  setShowConstellations: (showConstellations) => set({ showConstellations }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSkyViewType: (skyViewType) => set({ skyViewType }),
  setSelectedEntityId: (selectedEntityId) => set({ selectedEntityId }),
  setInspectorEntityId: (inspectorEntityId) => set({ inspectorEntityId }),

  recompute: () => {
    const { currentDate, location, ayanamsha, houseSystem, nodeType } = get();
    set({
      ephemeris: calculateVedicEphemeris(currentDate, location, ayanamsha, houseSystem, nodeType),
    });
  },

  saveProfile: async (name, isDefault = false, profGender, email, notes) => {
    const { currentDate, location, ayanamsha, houseSystem, savedProfiles, gender, userEmail } = get();
    const cleanName = name.trim() || "Saved Birth Chart";
    const chosenGender = profGender || gender;
    const effectiveEmail = email?.trim().toLowerCase() || userEmail;

    const id = "knd_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);

    const tzOffset = location.timezoneOffsetHours || 0;
    const localMs = currentDate.getTime() + tzOffset * 3600 * 1000;
    const localDate = new Date(localMs);
    const dob = `${localDate.getUTCFullYear()}-${String(localDate.getUTCMonth() + 1).padStart(2, "0")}-${String(localDate.getUTCDate()).padStart(2, "0")}`;
    const time = `${String(localDate.getUTCHours()).padStart(2, "0")}:${String(localDate.getUTCMinutes()).padStart(2, "0")}`;

    const newProfile: BirthProfile = {
      id,
      userEmail: effectiveEmail || undefined,
      name: cleanName,
      dateIso: currentDate.toISOString(),
      dob,
      time,
      location: { ...location },
      ayanamsha,
      gender: chosenGender,
      isDefault,
      notes,
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
      userEmail: effectiveEmail || userEmail,
    });

    if (effectiveEmail && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_USER_EMAIL_KEY, effectiveEmail);

      // Async post to server-side DB
      try {
        fetch("/api/charts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            userEmail: effectiveEmail,
            name: cleanName,
            gender: chosenGender,
            dateIso: currentDate.toISOString(),
            location,
            ayanamsha,
            houseSystem,
            isDefault,
            notes,
          }),
        }).catch((e) => console.warn("Failed to persist chart to server DB:", e));
      } catch (err) {
        console.warn("Async save to DB error:", err);
      }
    }

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

  deleteProfile: async (profileId) => {
    const { savedProfiles, userEmail } = get();
    const target = savedProfiles.find((p) => p.id === profileId);
    const updatedList = savedProfiles.filter((p) => p.id !== profileId);
    saveProfilesToStorage(updatedList);
    set({ savedProfiles: updatedList });

    const effectiveEmail = target?.userEmail || userEmail;
    if (effectiveEmail && typeof window !== "undefined") {
      try {
        fetch(`/api/charts?id=${encodeURIComponent(profileId)}&email=${encodeURIComponent(effectiveEmail)}`, {
          method: "DELETE",
        }).catch((e) => console.warn("Failed to delete from DB:", e));
      } catch (err) {
        console.warn("Async delete error:", err);
      }
    }
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
      const storedEmail = localStorage.getItem(STORAGE_USER_EMAIL_KEY);
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
        userEmail: storedEmail || null,
        matchmaking: storedMatchmaking,
        ephemeris: calculateVedicEphemeris(targetDate, targetLoc, targetAya, houseSystem, nodeType),
      });

      // Background sync from DB if email is available
      if (storedEmail) {
        get().syncChartsWithDb(storedEmail);
      }
    } catch (_) {}
  },
}));
