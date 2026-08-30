import fs from "fs";
import path from "path";

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

function readAllCharts(): StoredBirthChart[] {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw) as StoredBirthChart[];
  } catch (err) {
    console.error("Error reading charts DB:", err);
    return [];
  }
}

function writeAllCharts(charts: StoredBirthChart[]): void {
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
 */
export function getChartsByEmail(email: string): StoredBirthChart[] {
  const norm = normalizeEmail(email);
  if (!norm) return [];
  const all = readAllCharts();
  return all
    .filter((c) => normalizeEmail(c.userEmail) === norm)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

/**
 * Save or update a birth chart for a user
 */
export function saveChart(chart: Omit<StoredBirthChart, "createdAt" | "updatedAt"> & { id?: string }): StoredBirthChart {
  const all = readAllCharts();
  const nowIso = new Date().toISOString();
  const normEmail = normalizeEmail(chart.userEmail);

  if (!normEmail) {
    throw new Error("A valid email address is required to save a chart.");
  }

  const existingIdx = chart.id ? all.findIndex((c) => c.id === chart.id) : -1;

  if (existingIdx !== -1) {
    // Update existing chart
    const updatedRecord: StoredBirthChart = {
      ...all[existingIdx],
      ...chart,
      userEmail: normEmail,
      updatedAt: nowIso,
    };
    all[existingIdx] = updatedRecord;
    writeAllCharts(all);
    return updatedRecord;
  } else {
    // Create new chart
    const id = chart.id || `knd_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const newRecord: StoredBirthChart = {
      ...chart,
      id,
      userEmail: normEmail,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    all.push(newRecord);
    writeAllCharts(all);
    return newRecord;
  }
}

/**
 * Delete a chart by ID and Email (security boundary)
 */
export function deleteChart(id: string, email: string): boolean {
  const normEmail = normalizeEmail(email);
  const all = readAllCharts();
  const initialLength = all.length;
  const filtered = all.filter((c) => !(c.id === id && normalizeEmail(c.userEmail) === normEmail));

  if (filtered.length !== initialLength) {
    writeAllCharts(filtered);
    return true;
  }
  return false;
}
