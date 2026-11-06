import { neon } from "@neondatabase/serverless";

function tryLoadLocalEnvFile(): void {
  if (typeof window !== "undefined") return;
  try {
    const loadEnv = (process as NodeJS.Process & { loadEnvFile?: (path?: string) => void }).loadEnvFile;
    if (typeof loadEnv === "function") {
      loadEnv(".env.local");
    }
  } catch {
    // .env.local is optional in production / CI environments
  }
}

function resolveDatabaseUrl(): string {
  if (
    !process.env.DATABASE_URL &&
    !process.env.POSTGRES_URL &&
    !process.env.STORAGE_DATABASE_URL &&
    !process.env.PGHOST
  ) {
    tryLoadLocalEnvFile();
  }

  // 1. Check all standard and prefix-based connection strings
  const envCandidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.STORAGE_DATABASE_URL,
    process.env.STORAGE_POSTGRES_URL,
    process.env.STORAGE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.STORAGE_DATABASE_URL_UNPOOLED,
    process.env.STORAGE_POSTGRES_URL_NON_POOLING,
  ];

  for (const url of envCandidates) {
    if (url && typeof url === "string" && url.trim().length > 0) {
      return url.trim();
    }
  }

  // 2. Construct from individual PG parameters if present
  const host = process.env.PGHOST || process.env.POSTGRES_HOST || process.env.STORAGE_PGHOST;
  const user = process.env.PGUSER || process.env.POSTGRES_USER || process.env.STORAGE_PGUSER;
  const password = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || process.env.STORAGE_PGPASSWORD;
  const db = process.env.PGDATABASE || process.env.POSTGRES_DATABASE || process.env.STORAGE_PGDATABASE || "neondb";

  if (host && user && password) {
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/${encodeURIComponent(db)}?sslmode=require`;
  }

  return "";
}

const databaseUrl = resolveDatabaseUrl();

if (!databaseUrl && process.env.NODE_ENV !== "test") {
  console.warn("[Neon] No database connection URL found in environment variables; operating in local fallback mode.");
}

export const sql = databaseUrl ? neon(databaseUrl) : null;
