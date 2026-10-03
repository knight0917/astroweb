import fs from "fs";
import path from "path";
import { sql } from "./neon";
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

export interface StoredReview {
  id: string;
  name: string;
  email: string;
  subject: string; // Max 20 chars
  description: string;
  rating?: number; // 1-5
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "charts_db.json");
const REVIEWS_DB_FILE = path.join(DATA_DIR, "reviews_db.json");

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
 * Checks Neon Postgres primary, falls back to Supabase, then local DB.
 */
export async function getChartsByEmail(email: string): Promise<StoredBirthChart[]> {
  const norm = normalizeEmail(email);
  if (!norm) return [];

  // 1. Neon Serverless Postgres
  if (sql) {
    try {
      const rows = await sql`
        SELECT * FROM birth_charts
        WHERE user_email = ${norm}
        ORDER BY updated_at DESC;
      `;

      if (rows && rows.length > 0) {
        return rows.map((row: any) => ({
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
            latitude: Number(row.latitude),
            longitude: Number(row.longitude),
            elevation: Number(row.elevation || 0),
            timezoneOffsetHours: Number(row.timezone_offset_hours || 5.5),
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
      console.warn("Neon query fallback:", err);
    }
  }

  // 2. Supabase Legacy Fallback
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("birth_charts")
        .select("*")
        .eq("user_email", norm)
        .order("updated_at", { ascending: false });

      if (!error && data && data.length > 0) {
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

  // 3. Fallback to local DB
  const all = readAllChartsLocal();
  return all
    .filter((c) => normalizeEmail(c.userEmail) === norm)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

/**
 * Check if a chart with the same birth data already exists under the specified email.
 */
export async function findExistingChartByEmailAndData(
  email: string,
  data: {
    id?: string;
    name?: string;
    dob?: string;
    time?: string;
    dateIso?: string;
    latitude?: number;
    longitude?: number;
  }
): Promise<StoredBirthChart | null> {
  const normEmail = normalizeEmail(email);
  if (!normEmail) return null;

  const existingCharts = await getChartsByEmail(normEmail);
  const targetName = (data.name || "").trim().toLowerCase();
  const targetDob = data.dob || (data.dateIso ? data.dateIso.split("T")[0] : "");
  const targetTime = data.time || (data.dateIso && data.dateIso.includes("T") ? data.dateIso.split("T")[1].substring(0, 5) : "");

  for (const c of existingCharts) {
    if (data.id && c.id === data.id) {
      continue;
    }

    const cName = (c.name || "").trim().toLowerCase();
    const cDob = c.dob || (c.dateIso ? c.dateIso.split("T")[0] : "");
    const cTime = c.time || (c.dateIso && c.dateIso.includes("T") ? c.dateIso.split("T")[1].substring(0, 5) : "");

    const isSameNameAndDob = targetName && cName && targetName === cName && targetDob && cDob && targetDob === cDob;

    const isSameTime = (!targetTime || !cTime) || targetTime === cTime;
    const isSameCoords =
      data.latitude !== undefined &&
      data.longitude !== undefined &&
      Math.abs(c.location.latitude - data.latitude) < 0.05 &&
      Math.abs(c.location.longitude - data.longitude) < 0.05;

    const isSameBirthMoment = targetDob && cDob && targetDob === cDob && isSameTime && isSameCoords;

    if (isSameNameAndDob || isSameBirthMoment) {
      return c;
    }
  }

  return null;
}

/**
 * Save or update a birth chart in Neon, Supabase, and local cache
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

  // 1. Save to Neon Serverless Postgres
  if (sql) {
    try {
      await sql`
        INSERT INTO birth_charts (
          id, user_email, name, gender, date_iso, dob, time,
          city_name, country, latitude, longitude, elevation,
          timezone_offset_hours, ayanamsha, house_system, is_default, notes, updated_at
        ) VALUES (
          ${record.id}, ${record.userEmail}, ${record.name}, ${record.gender}, ${record.dateIso}, ${record.dob}, ${record.time},
          ${record.location.cityName}, ${record.location.country}, ${record.location.latitude}, ${record.location.longitude}, ${record.location.elevation || 0},
          ${record.location.timezoneOffsetHours || 5.5}, ${record.ayanamsha || "Lahiri"}, ${record.houseSystem || "WholeSign"}, ${Boolean(record.isDefault)}, ${record.notes || null}, ${nowIso}
        )
        ON CONFLICT (id) DO UPDATE SET
          user_email = EXCLUDED.user_email,
          name = EXCLUDED.name,
          gender = EXCLUDED.gender,
          date_iso = EXCLUDED.date_iso,
          dob = EXCLUDED.dob,
          time = EXCLUDED.time,
          city_name = EXCLUDED.city_name,
          country = EXCLUDED.country,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          elevation = EXCLUDED.elevation,
          timezone_offset_hours = EXCLUDED.timezone_offset_hours,
          ayanamsha = EXCLUDED.ayanamsha,
          house_system = EXCLUDED.house_system,
          is_default = EXCLUDED.is_default,
          notes = EXCLUDED.notes,
          updated_at = EXCLUDED.updated_at;
      `;
    } catch (err) {
      console.warn("Neon save error, falling back:", err);
    }
  }

  // 2. Fallback to Supabase
  if (supabase) {
    try {
      await supabase.from("birth_charts").upsert({
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
    } catch (err) {
      console.warn("Supabase save exception:", err);
    }
  }

  // 3. Save to local fallback cache
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
 * Delete a chart by ID and Email
 */
export async function deleteChart(id: string, email: string): Promise<boolean> {
  const normEmail = normalizeEmail(email);
  let deletedFromCloud = false;

  // 1. Neon Serverless Postgres
  if (sql) {
    try {
      await sql`
        DELETE FROM birth_charts
        WHERE id = ${id} AND user_email = ${normEmail};
      `;
      deletedFromCloud = true;
    } catch (err) {
      console.warn("Neon delete exception:", err);
    }
  }

  // 2. Supabase
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

  // 3. Local fallback cleanup
  const all = readAllChartsLocal();
  const filtered = all.filter((c) => !(c.id === id && normalizeEmail(c.userEmail) === normEmail));
  if (filtered.length !== all.length) {
    writeAllChartsLocal(filtered);
    return true;
  }

  return deletedFromCloud;
}

/**
 * Read all reviews from local JSON file
 */
function readAllReviewsLocal(): StoredReview[] {
  ensureDbFile();
  try {
    if (!fs.existsSync(REVIEWS_DB_FILE)) {
      fs.writeFileSync(REVIEWS_DB_FILE, JSON.stringify([]), "utf-8");
    }
    const raw = fs.readFileSync(REVIEWS_DB_FILE, "utf-8");
    return JSON.parse(raw) as StoredReview[];
  } catch (err) {
    console.error("Error reading reviews DB:", err);
    return [];
  }
}

/**
 * Write all reviews to local JSON file
 */
function writeAllReviewsLocal(reviews: StoredReview[]): void {
  ensureDbFile();
  try {
    const tempFile = `${REVIEWS_DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(reviews, null, 2), "utf-8");
    fs.renameSync(tempFile, REVIEWS_DB_FILE);
  } catch (err) {
    console.error("Error writing reviews DB:", err);
  }
}

/**
 * Get all reviews (ordered newest first)
 */
export async function getReviews(): Promise<StoredReview[]> {
  // 1. Neon Postgres
  if (sql) {
    try {
      const rows = await sql`
        SELECT * FROM reviews
        ORDER BY created_at DESC;
      `;

      if (rows && rows.length > 0) {
        return rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          subject: row.subject,
          description: row.description,
          rating: Number(row.rating) || 5,
          createdAt: row.created_at,
        }));
      }
    } catch (err) {
      console.warn("Neon fetch reviews exception:", err);
    }
  }

  // 2. Supabase Fallback
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          subject: row.subject,
          description: row.description,
          rating: row.rating || 5,
          createdAt: row.created_at,
        }));
      }
    } catch (err) {
      console.warn("Supabase fetch reviews exception, using local DB:", err);
    }
  }

  const local = readAllReviewsLocal();
  return local.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Save a new review to Neon and local JSON fallback
 */
export async function saveReview(reviewData: {
  name: string;
  email: string;
  subject: string;
  description: string;
  rating?: number;
}): Promise<StoredReview> {
  const id = `rev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  const cleanSubject = reviewData.subject.trim().slice(0, 50);

  const newReview: StoredReview = {
    id,
    name: reviewData.name.trim(),
    email: normalizeEmail(reviewData.email),
    subject: cleanSubject,
    description: reviewData.description.trim(),
    rating: typeof reviewData.rating === "number" ? Math.min(5, Math.max(1, reviewData.rating)) : 5,
    createdAt,
  };

  // 1. Neon Postgres
  if (sql) {
    try {
      await sql`
        INSERT INTO reviews (id, name, email, subject, description, rating, created_at)
        VALUES (
          ${newReview.id},
          ${newReview.name},
          ${newReview.email},
          ${newReview.subject},
          ${newReview.description},
          ${newReview.rating},
          ${newReview.createdAt}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    } catch (err) {
      console.warn("Neon save review exception:", err);
    }
  }

  // 2. Supabase Fallback
  if (supabase) {
    try {
      await supabase.from("reviews").insert([
        {
          id: newReview.id,
          name: newReview.name,
          email: newReview.email,
          subject: newReview.subject,
          description: newReview.description,
          rating: newReview.rating,
          created_at: newReview.createdAt,
        },
      ]);
    } catch (err) {
      console.warn("Supabase save review exception, saving locally:", err);
    }
  }

  // 3. Local fallback
  try {
    const all = readAllReviewsLocal();
    all.unshift(newReview);
    writeAllReviewsLocal(all);
  } catch (err) {
    console.error("Local save review error:", err);
  }

  return newReview;
}

/**
 * Check if a review has already been submitted by this email in the last `hours`
 */
export async function hasRecentReviewByEmail(email: string, hours: number = 24): Promise<boolean> {
  const norm = normalizeEmail(email);
  if (!norm) return false;

  const thresholdMs = Date.now() - hours * 60 * 60 * 1000;
  const thresholdIso = new Date(thresholdMs).toISOString();

  // 1. Neon Postgres
  if (sql) {
    try {
      const rows = await sql`
        SELECT created_at FROM reviews
        WHERE email = ${norm} AND created_at >= ${thresholdIso}
        LIMIT 1;
      `;
      if (rows && rows.length > 0) {
        return true;
      }
    } catch (err) {
      console.warn("Neon check recent review exception:", err);
    }
  }

  // 2. Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("created_at")
        .eq("email", norm)
        .gte("created_at", thresholdIso)
        .limit(1);

      if (!error && data && data.length > 0) {
        return true;
      }
    } catch (err) {
      console.warn("Supabase check recent review exception:", err);
    }
  }

  // 3. Local fallback
  const local = readAllReviewsLocal();
  const recent = local.find(
    (r) => normalizeEmail(r.email) === norm && new Date(r.createdAt).getTime() >= thresholdMs
  );

  return Boolean(recent);
}
