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
import { resolveInitialLiveLocation, detectLiveBrowserLocation } from "../engine/geocoding";

export type ViewMode =
  | "3d"
  | "kundli-north"
  | "pre-market"
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

export interface ReferenceLagnaInfo {
  id: string;
  name: string;
  sanskritName?: string;
  house: number;
  code?: string;
  color?: string;
}

const STORAGE_ACTIVE_KEY = "vedic_active_chart_data";
const STORAGE_PROFILES_KEY = "vedic_saved_birth_profiles";
export const STORAGE_USER_EMAIL_KEY = "vedic_user_email";
export const STORAGE_USER_EMAIL_LINKED_AT_KEY = "vedic_user_email_linked_at";
export const STORAGE_USER_EMAIL_EMPTY_SINCE_KEY = "vedic_user_email_empty_since";
export const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;
const STORAGE_MATCHMAKING_KEY = "vedic_matchmaking_active_state";
const STORAGE_LAST_CACHE_CLEANUP_KEY = "vedic_last_cache_cleanup_timestamp";

/**
 * Pure evaluation function for 15-day empty vault auto-pruning.
 * If an email vault has 0 saved charts for >= 15 days, it must be pruned.
 */
export function evaluate15DayEmptyVaultRetention(
  emptySinceMs: number | null,
  chartsCount: number,
  nowMs: number = Date.now()
): { isPruned: boolean; daysRemaining: number } {
  if (chartsCount > 0 || !emptySinceMs) {
    return { isPruned: false, daysRemaining: 15 };
  }
  const elapsed = nowMs - emptySinceMs;
  if (elapsed >= FIFTEEN_DAYS_MS) {
    return { isPruned: true, daysRemaining: 0 };
  }
  const daysRemaining = Math.max(0, Math.ceil((FIFTEEN_DAYS_MS - elapsed) / (24 * 60 * 60 * 1000)));
  return { isPruned: false, daysRemaining };
}

/**
 * Asynchronously acquires or retrieves a cached HMAC-signed identity token
 * for client-server chart API operations.
 */
export async function getOrFetchEmailToken(email: string): Promise<string | null> {
  if (!email || typeof window === "undefined") return null;
  const cleanEmail = email.trim().toLowerCase();
  const tokenKey = `vedic_chart_token_${cleanEmail}`;
  const cached = localStorage.getItem(tokenKey);
  if (cached) return cached;

  try {
    const res = await fetch("/api/auth/email-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        localStorage.setItem(tokenKey, data.token);
        return data.token;
      }
    }
  } catch (err) {
    console.warn("Could not acquire email token:", err);
  }
  return null;
}

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
  isLive: boolean;
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
  check15DayEmptyVaultPruning: () => { pruned: boolean; message: string };

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
  syncChartsWithDb: (customEmail?: string, autoLoad?: boolean) => Promise<BirthProfile[]>;
  setMatchmakingBoy: (data: Partial<MatchmakingProfileData>) => void;
  setMatchmakingGirl: (data: Partial<MatchmakingProfileData>) => void;
  setMatchmakingState: (state: MatchmakingStoreState) => void;
  togglePlay: () => void;
  setPlaySpeed: (speed: number) => void;
  setShowModernPlanets: (show: boolean) => void;
  setShowUpagrahas: (show: boolean) => void;
  setShowConstellations: (show: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  activeVargaId: string;
  setActiveVargaId: (vargaId: string) => void;
  setSkyViewType: (type: SkyViewType) => void;
  setSelectedEntityId: (id: string | null) => void;
  setInspectorEntityId: (id: string | null) => void;
  chartRotationHouse: number;
  chartReferenceLagna: ReferenceLagnaInfo | null;
  setChartRotationHouse: (house: number) => void;
  setChartReferenceLagna: (lagna: ReferenceLagnaInfo | null) => void;
  resetChartRotation: () => void;
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
  setIsLive: (isLive: boolean) => void;
  tickLive: () => void;
  resetToLiveTransit: (customLocation?: GeoLocation) => void;
  initFromStorage: () => void;
}

const defaultDate = new Date();
const defaultLocation = POPULAR_CITIES[0]; // Varanasi
const defaultAyanamsha: AyanamshaType = "Lahiri";
const defaultHouseSystem: HouseSystem = "WholeSign";
const defaultNodeType: NodeType = "Mean";

let globalLiveInterval: any = null;

function syncGlobalLiveInterval(get: () => AstroState, set: (partial: any) => void) {
  if (typeof window === "undefined") return;
  const state = get();
  if (state.isLive && !state.isPlaying) {
    if (!globalLiveInterval) {
      globalLiveInterval = setInterval(() => {
        const current = get();
        if (!current.isLive || current.isPlaying) {
          if (globalLiveInterval) {
            clearInterval(globalLiveInterval);
            globalLiveInterval = null;
          }
          return;
        }
        const liveNow = new Date();
        set({
          currentDate: liveNow,
          ephemeris: calculateVedicEphemeris(
            liveNow,
            current.location,
            current.ayanamsha,
            current.houseSystem,
            current.nodeType
          ),
        });
      }, 1000);
    }
  } else {
    if (globalLiveInterval) {
      clearInterval(globalLiveInterval);
      globalLiveInterval = null;
    }
  }
}

export const useAstroStore = create<AstroState>((set, get) => ({
  currentDate: defaultDate,
  isLive: false,
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
  activeVargaId: "D9",
  setActiveVargaId: (vargaId: string) => set({ activeVargaId: vargaId }),
  skyViewType: "ecliptic",
  selectedEntityId: null,
  inspectorEntityId: null,
  chartRotationHouse: 1,
  chartReferenceLagna: null,
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
      if (clean) {
        localStorage.setItem(STORAGE_USER_EMAIL_KEY, clean);
        if (!localStorage.getItem(STORAGE_USER_EMAIL_LINKED_AT_KEY)) {
          localStorage.setItem(STORAGE_USER_EMAIL_LINKED_AT_KEY, String(Date.now()));
        }
      } else {
        const oldEmail = localStorage.getItem(STORAGE_USER_EMAIL_KEY);
        localStorage.removeItem(STORAGE_USER_EMAIL_KEY);
        localStorage.removeItem(STORAGE_USER_EMAIL_LINKED_AT_KEY);
        localStorage.removeItem(STORAGE_USER_EMAIL_EMPTY_SINCE_KEY);
        if (oldEmail) {
          localStorage.removeItem(`vedic_chart_token_${oldEmail.toLowerCase().trim()}`);
        }
      }
    }
    set({ userEmail: clean });
    if (clean) {
      get().syncChartsWithDb(clean, true);
    }
  },

  check15DayEmptyVaultPruning: () => {
    if (typeof window === "undefined") return { pruned: false, message: "" };
    const currentEmail = get().userEmail;
    if (!currentEmail) return { pruned: false, message: "No email linked" };

    const chartsCount = get().savedProfiles.length;
    if (chartsCount > 0) {
      localStorage.removeItem(STORAGE_USER_EMAIL_EMPTY_SINCE_KEY);
      return { pruned: false, message: "Vault active with charts" };
    }

    const rawEmpty = localStorage.getItem(STORAGE_USER_EMAIL_EMPTY_SINCE_KEY);
    const emptySince = rawEmpty ? Number(rawEmpty) : Date.now();
    if (!rawEmpty) {
      localStorage.setItem(STORAGE_USER_EMAIL_EMPTY_SINCE_KEY, String(emptySince));
    }

    const { isPruned, daysRemaining } = evaluate15DayEmptyVaultRetention(emptySince, chartsCount);
    if (isPruned) {
      localStorage.removeItem(STORAGE_USER_EMAIL_KEY);
      localStorage.removeItem(STORAGE_USER_EMAIL_LINKED_AT_KEY);
      localStorage.removeItem(STORAGE_USER_EMAIL_EMPTY_SINCE_KEY);
      localStorage.removeItem(`vedic_chart_token_${currentEmail.toLowerCase().trim()}`);
      set({ userEmail: null });
      console.log(`[Vault 15-Day Retention] Pruned empty email '${currentEmail}' after 15 days of zero saved charts.`);
      return {
        pruned: true,
        message: `Empty vault email '${currentEmail}' was automatically deleted after 15 days of zero saved charts.`,
      };
    }

    return {
      pruned: false,
      message: `Vault has 0 saved charts. Empty email connections are automatically deleted after 15 days (${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining).`,
    };
  },

  run24HourCacheCleanup: async (force = false) => {
    if (typeof window === "undefined") {
      return { cleaned: false, message: "Window undefined" };
    }

    // 15-Day Empty Vault Auto-Pruning Check
    const pruneResult = get().check15DayEmptyVaultPruning();
    if (pruneResult.pruned) {
      console.log("[run24HourCacheCleanup]", pruneResult.message);
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
        await get().syncChartsWithDb(currentEmail, false);
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

  syncChartsWithDb: async (customEmail?: string, autoLoad: boolean = true) => {
    const targetEmail = customEmail || get().userEmail;
    if (!targetEmail || typeof window === "undefined") return [];

    set({ isSyncingDb: true });
    try {
      // Acquire HMAC-signed identity token for stateless authorization
      const token = await getOrFetchEmailToken(targetEmail);
      const headers: Record<string, string> = {};
      if (token) headers["x-chart-token"] = token;

      const res = await fetch(`/api/charts?email=${encodeURIComponent(targetEmail)}&_t=${Date.now()}`, {
        headers,
        cache: "no-store",
      });
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

          // 15-Day Retention Tracking: Reset if charts present; record empty timestamp if 0
          if (mergedList.length > 0) {
            localStorage.removeItem(STORAGE_USER_EMAIL_EMPTY_SINCE_KEY);
          } else {
            const rawEmpty = localStorage.getItem(STORAGE_USER_EMAIL_EMPTY_SINCE_KEY);
            if (!rawEmpty) {
              localStorage.setItem(STORAGE_USER_EMAIL_EMPTY_SINCE_KEY, String(Date.now()));
            }
          }

          // Auto-load profile into active view if autoLoad is requested and profiles exist
          if (autoLoad && dbProfiles.length > 0) {
            const profileToLoad = dbProfiles.find((p) => p.isDefault) || dbProfiles[0];
            if (profileToLoad) {
              get().loadProfile(profileToLoad);
            }
          } else if (autoLoad && mergedList.length > 0) {
            const profileToLoad = mergedList.find((p) => p.isDefault) || mergedList[0];
            if (profileToLoad) {
              get().loadProfile(profileToLoad);
            }
          }

          return mergedList;
        }
      } else {
        if (res.status === 401 && token) {
          localStorage.removeItem(`vedic_chart_token_${targetEmail.toLowerCase().trim()}`);
        }
        console.warn(`[syncChartsWithDb] Server returned status ${res.status}`);
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
      isLive: false,
      currentDate: date,
      ephemeris: calculateVedicEphemeris(date, location, ayanamsha, houseSystem, nodeType),
    });
    syncGlobalLiveInterval(get, set);
  },

  setIsLive: (isLive: boolean) => {
    if (isLive) {
      const liveNow = new Date();
      const { location, ayanamsha, houseSystem, nodeType } = get();
      set({
        isLive: true,
        isPlaying: false,
        currentDate: liveNow,
        activeProfileName: "🔴 Live Transit (Now)",
        ephemeris: calculateVedicEphemeris(liveNow, location, ayanamsha, houseSystem, nodeType),
      });
    } else {
      set({ isLive: false });
    }
    syncGlobalLiveInterval(get, set);
  },

  tickLive: () => {
    const { isLive, isPlaying, location, ayanamsha, houseSystem, nodeType } = get();
    if (!isLive || isPlaying) return;
    const liveNow = new Date();
    set({
      currentDate: liveNow,
      ephemeris: calculateVedicEphemeris(liveNow, location, ayanamsha, houseSystem, nodeType),
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

  togglePlay: () => {
    const nextPlaying = !get().isPlaying;
    set({
      isPlaying: nextPlaying,
      isLive: nextPlaying ? false : get().isLive,
    });
    syncGlobalLiveInterval(get, set);
  },
  setPlaySpeed: (playSpeed) => set({ playSpeed }),
  setShowModernPlanets: (showModernPlanets) => set({ showModernPlanets }),
  setShowUpagrahas: (showUpagrahas) => set({ showUpagrahas }),
  setShowConstellations: (showConstellations) => set({ showConstellations }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSkyViewType: (skyViewType) => set({ skyViewType }),
  setSelectedEntityId: (selectedEntityId) => set({ selectedEntityId }),
  setInspectorEntityId: (inspectorEntityId) => set({ inspectorEntityId }),
  setChartRotationHouse: (chartRotationHouse) => {
    const currentRef = get().chartReferenceLagna;
    if (currentRef && currentRef.house !== chartRotationHouse) {
      set({ chartRotationHouse, chartReferenceLagna: null });
    } else {
      set({ chartRotationHouse });
    }
  },
  setChartReferenceLagna: (lagna) => {
    if (!lagna) {
      set({ chartRotationHouse: 1, chartReferenceLagna: null });
    } else {
      set({
        chartRotationHouse: lagna.house || 1,
        chartReferenceLagna: lagna,
      });
    }
  },
  resetChartRotation: () => set({ chartRotationHouse: 1, chartReferenceLagna: null }),

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
      localStorage.removeItem(STORAGE_USER_EMAIL_EMPTY_SINCE_KEY);

      // Async post to server-side DB with HMAC auth token
      getOrFetchEmailToken(effectiveEmail).then((token) => {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["x-chart-token"] = token;

        fetch("/api/charts", {
          method: "POST",
          headers,
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
      });
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
      isLive: false,
      currentDate: date,
      location: loc,
      ayanamsha: aya,
      activeProfileName: profile.name,
      gender: profGender,
      chartRotationHouse: 1,
      chartReferenceLagna: null,
      ephemeris: calculateVedicEphemeris(date, loc, aya, houseSystem, nodeType),
    });
    syncGlobalLiveInterval(get, set);
  },

  deleteProfile: async (profileId) => {
    const { savedProfiles, userEmail } = get();
    const target = savedProfiles.find((p) => p.id === profileId);
    const updatedList = savedProfiles.filter((p) => p.id !== profileId);
    saveProfilesToStorage(updatedList);
    set({ savedProfiles: updatedList });

    const effectiveEmail = target?.userEmail || userEmail;
    if (effectiveEmail && typeof window !== "undefined") {
      getOrFetchEmailToken(effectiveEmail).then((token) => {
        const headers: Record<string, string> = {};
        if (token) headers["x-chart-token"] = token;

        fetch(`/api/charts?id=${encodeURIComponent(profileId)}&email=${encodeURIComponent(effectiveEmail)}`, {
          method: "DELETE",
          headers,
        }).catch((e) => console.warn("Failed to delete from DB:", e));
      });
    }
  },

  resetToLiveTransit: (customLocation?: GeoLocation) => {
    const { location, ayanamsha, houseSystem, nodeType } = get();
    const liveNow = new Date();
    const targetLoc = customLocation || location;
    set({
      isLive: true,
      isPlaying: false,
      currentDate: liveNow,
      location: targetLoc,
      activeProfileName: "🔴 Live Transit (Now)",
      chartRotationHouse: 1,
      chartReferenceLagna: null,
      ephemeris: calculateVedicEphemeris(liveNow, targetLoc, ayanamsha, houseSystem, nodeType),
    });
    syncGlobalLiveInterval(get, set);
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
        } else {
          // First-time visitor: Real-time current live date & localized observer location
          targetDate = new Date();
          targetLoc = resolveInitialLiveLocation();
          targetProfileName = "🔴 Live Transit (Now)";
        }
      }

      const isTargetLive = targetProfileName === "🔴 Live Transit (Now)";
      const { houseSystem, nodeType } = get();
      set({
        savedProfiles: profiles,
        isLive: isTargetLive,
        currentDate: targetDate,
        location: targetLoc,
        ayanamsha: targetAya,
        activeProfileName: targetProfileName,
        gender: targetGender,
        userEmail: storedEmail || null,
        matchmaking: storedMatchmaking,
        ephemeris: calculateVedicEphemeris(targetDate, targetLoc, targetAya, houseSystem, nodeType),
      });
      syncGlobalLiveInterval(get, set);

      // For first-time users, asynchronously refine to high-precision device GPS if permitted
      if (!rawActive && profiles.length === 0) {
        detectLiveBrowserLocation()
          .then((geo) => {
            if (geo) {
              const current = get();
              if (current.activeProfileName === "🔴 Live Transit (Now)" || !current.activeProfileName) {
                const liveNow = new Date();
                set({
                  currentDate: liveNow,
                  location: geo,
                  activeProfileName: "🔴 Live Transit (Now)",
                  ephemeris: calculateVedicEphemeris(
                    liveNow,
                    geo,
                    current.ayanamsha,
                    current.houseSystem,
                    current.nodeType
                  ),
                });
              }
            }
          })
          .catch(() => {});
      }

      // Background sync from DB if email is available
      if (storedEmail) {
        get().syncChartsWithDb(storedEmail);
        get().check15DayEmptyVaultPruning();
      }
    } catch (_) {}
  },

}));
