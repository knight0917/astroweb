import fs from "fs";
import path from "path";
import { supabase } from "./supabase";

export interface StoredBirthChart {
  id: string;
  userEmail: string;
  name: string;
  gender: "male" | "female";
  dateIso: string;
  dob: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  location: {
    cityName: string;
    country: string;
    latitude: number;
    longitude: number;
    elevation?: number;
    timezoneOffsetHours: number;
  };
  ayanamsha: string;
  houseSystem: string;
  isDefault?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "charts_db.json");

function ensureDbFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([]), "utf-8");
    }
  } catch (err) {
    console.error("Failed to initialize charts DB file:", err);
  }
}

function readAllChartsLocal(): StoredBirthChart[] {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw) as StoredBirthChart[];
  } catch (err) {
    console.error("Error reading charts DB:", err);
    return [];
  }
}

function writeAllChartsLocal(charts: StoredBirthChart[]): void {
  ensureDbFile();
  try {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(charts, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error("Error writing charts DB:", err);
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Get all charts belonging to a specific email (case-insensitive)
 * Checks Supabase Cloud Postgres primary, falls back to local DB.
 */
export async function getChartsByEmail(email: string): Promise<StoredBirthChart[]> {
  const norm = normalizeEmail(email);
  if (!norm) return [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("birth_charts")
        .select("*")
        .eq("user_email", norm)
        .order("updated_at", { ascending: false });

      if (!error && data) {
        return data.map((row: any) => ({
          id: row.id,
          userEmail: row.user_email,
          name: row.name,
          gender: row.gender || "male",
          dateIso: row.date_iso,
          dob: row.dob,
          time: row.time,
          location: {
            cityName: row.city_name || "Unknown City",
            country: row.country || "India",
            latitude: row.latitude,
            longitude: row.longitude,
            elevation: row.elevation || 0,
            timezoneOffsetHours: row.timezone_offset_hours || 5.5,
          },
          ayanamsha: row.ayanamsha || "Lahiri",
          houseSystem: row.house_system || "WholeSign",
          isDefault: Boolean(row.is_default),
          notes: row.notes,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
      }
    } catch (err) {
      console.warn("Supabase query fallback to local DB:", err);
    }
  }

  // Fallback to local DB
  const all = readAllChartsLocal();
  return all
    .filter((c) => normalizeEmail(c.userEmail) === norm)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

/**
 * Save or update a birth chart in Supabase and local cache
 */
export async function saveChart(
  chart: Omit<StoredBirthChart, "createdAt" | "updatedAt"> & { id?: string }
): Promise<StoredBirthChart> {
  const nowIso = new Date().toISOString();
  const normEmail = normalizeEmail(chart.userEmail);

  if (!normEmail) {
    throw new Error("A valid email address is required to save a chart.");
  }

  const id = chart.id || `knd_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const record: StoredBirthChart = {
    ...chart,
    id,
    userEmail: normEmail,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  // 1. Save to Supabase Cloud Postgres
  if (supabase) {
    try {
      const { error } = await supabase.from("birth_charts").upsert({
        id: record.id,
        user_email: record.userEmail,
        name: record.name,
        gender: record.gender,
        date_iso: record.dateIso,
        dob: record.dob,
        time: record.time,
        city_name: record.location.cityName,
        country: record.location.country,
        latitude: record.location.latitude,
        longitude: record.location.longitude,
        elevation: record.location.elevation || 0,
        timezone_offset_hours: record.location.timezoneOffsetHours || 5.5,
        ayanamsha: record.ayanamsha || "Lahiri",
        house_system: record.houseSystem || "WholeSign",
        is_default: Boolean(record.isDefault),
        notes: record.notes,
        updated_at: nowIso,
      });
      if (error) {
        console.warn("Supabase upsert error, saved to local fallback:", error);
      }
    } catch (err) {
      console.warn("Supabase save exception:", err);
    }
  }

  // 2. Save to local fallback cache
  try {
    const all = readAllChartsLocal();
    const existingIdx = all.findIndex((c) => c.id === id);
    if (existingIdx !== -1) {
      all[existingIdx] = record;
    } else {
      all.push(record);
    }
    writeAllChartsLocal(all);
  } catch (_) {}

  return record;
}

/**
 * Delete a chart by ID and Email from Supabase and local cache
 */
export async function deleteChart(id: string, email: string): Promise<boolean> {
  const normEmail = normalizeEmail(email);
  let deletedFromCloud = false;

  if (supabase) {
    try {
      const { error } = await supabase
        .from("birth_charts")
        .delete()
        .eq("id", id)
        .eq("user_email", normEmail);
      if (!error) deletedFromCloud = true;
    } catch (err) {
      console.warn("Supabase delete exception:", err);
    }
  }

  // Local fallback cleanup
  const all = readAllChartsLocal();
  const filtered = all.filter((c) => !(c.id === id && normalizeEmail(c.userEmail) === normEmail));
  if (filtered.length !== all.length) {
    writeAllChartsLocal(filtered);
    return true;
  }

  return deletedFromCloud;
}
