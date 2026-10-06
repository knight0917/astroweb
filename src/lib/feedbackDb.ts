import fs from "fs";
import path from "path";
import { sql } from "./neon";

export type FeedbackType = "helpful" | "inaccurate" | "correction";
export type CorrectionCategory = "bhavas" | "timing" | "upaya" | "calculation" | "other";
export type FeedbackStatus = "unverified" | "verified_classical" | "rejected";

export interface ChatFeedbackRecord {
  id: string;
  userQuery: string;
  botResponse: string;
  feedbackType: FeedbackType;
  userCorrection?: string;
  correctionCategory?: CorrectionCategory;
  chartContext?: Record<string, any>;
  domain: string;
  status: FeedbackStatus;
  embedding?: number[];
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const FEEDBACK_DB_FILE = path.join(DATA_DIR, "chat_feedback_db.json");

function ensureFeedbackFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FEEDBACK_DB_FILE)) {
      fs.writeFileSync(FEEDBACK_DB_FILE, JSON.stringify([]), "utf-8");
    }
  } catch (err) {
    console.error("[FeedbackDB] Failed to ensure local feedback file:", err);
  }
}

function readAllFeedbackLocal(): ChatFeedbackRecord[] {
  ensureFeedbackFile();
  try {
    const raw = fs.readFileSync(FEEDBACK_DB_FILE, "utf-8");
    return JSON.parse(raw) as ChatFeedbackRecord[];
  } catch (err) {
    console.error("[FeedbackDB] Error reading local feedback DB:", err);
    return [];
  }
}

function writeAllFeedbackLocal(records: ChatFeedbackRecord[]): void {
  ensureFeedbackFile();
  try {
    const tempFile = `${FEEDBACK_DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(records, null, 2), "utf-8");
    fs.renameSync(tempFile, FEEDBACK_DB_FILE);
  } catch (err) {
    console.error("[FeedbackDB] Error writing local feedback DB:", err);
  }
}

/**
 * Sanitizes text to remove modern/living guru references, enforcing Zero-Name compliance.
 */
export function sanitizeFeedbackText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\bDeepanshu\s+Giri\b/gi, "Vedic Systems Master")
    .replace(/\bNavneet\s+Chitkara\b/gi, "Classical BTR Master")
    .replace(/\bLunar\s+Astro\b/gi, "Classical Research Academy")
    .replace(/\bK\.?\s*N\.?\s*Rao\b/gi, "Classical Dasha Master")
    .replace(/\bC\.?\s*S\.?\s*Patel\b/gi, "Ashtakavarga Master")
    .replace(/\bDr\.?\s*Samir\s+Tripathi\b/gi, "Panchanga Research Master");
}

let isFeedbackDbInitialized = false;

/**
 * Initializes the Neon PostgreSQL table and indexes for chat feedback.
 * Idempotent.
 */
export async function initFeedbackDb(): Promise<boolean> {
  if (isFeedbackDbInitialized) return true;
  if (!sql) {
    console.warn("[FeedbackDB] No SQL client available. Operating in local JSON mode.");
    return false;
  }

  try {
    // 1. Ensure pgvector extension
    await (sql as any).query(`CREATE EXTENSION IF NOT EXISTS vector;`);

    // 2. Create feedback table
    await (sql as any).query(`
      CREATE TABLE IF NOT EXISTS chat_feedback_corrections (
        id TEXT PRIMARY KEY,
        user_query TEXT NOT NULL,
        bot_response TEXT NOT NULL,
        feedback_type VARCHAR(20) NOT NULL,
        user_correction TEXT,
        correction_category VARCHAR(50),
        chart_context JSONB NOT NULL DEFAULT '{}'::jsonb,
        domain VARCHAR(30) NOT NULL DEFAULT 'general',
        status VARCHAR(30) NOT NULL DEFAULT 'unverified',
        embedding vector(768),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Create index for fast status and domain filtering
    await (sql as any).query(`
      CREATE INDEX IF NOT EXISTS idx_chat_feedback_domain_status 
      ON chat_feedback_corrections (domain, status);
    `);

    isFeedbackDbInitialized = true;
    return true;
  } catch (err) {
    console.warn("[FeedbackDB] DB initialization error (using local fallback):", err);
    return false;
  }
}

/**
 * Saves a user feedback or correction record to Neon Postgres and local JSON fallback.
 */
export async function saveChatFeedback(
  feedback: Omit<ChatFeedbackRecord, "id" | "createdAt" | "status"> & {
    id?: string;
    status?: FeedbackStatus;
  }
): Promise<ChatFeedbackRecord> {
  const id = feedback.id || `fb_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const nowIso = new Date().toISOString();
  const status: FeedbackStatus = feedback.status || "unverified";

  const sanitizedRecord: ChatFeedbackRecord = {
    id,
    userQuery: sanitizeFeedbackText(feedback.userQuery),
    botResponse: sanitizeFeedbackText(feedback.botResponse),
    feedbackType: feedback.feedbackType,
    userCorrection: feedback.userCorrection ? sanitizeFeedbackText(feedback.userCorrection) : undefined,
    correctionCategory: feedback.correctionCategory,
    chartContext: feedback.chartContext || {},
    domain: feedback.domain || "general",
    status,
    embedding: feedback.embedding,
    createdAt: nowIso,
  };

  // 1. Neon DB persistence
  if (sql) {
    try {
      await initFeedbackDb();
      const chartContextJson = JSON.stringify(sanitizedRecord.chartContext || {});
      const vectorStr = sanitizedRecord.embedding && sanitizedRecord.embedding.length === 768
        ? `[${sanitizedRecord.embedding.join(",")}]`
        : null;

      await (sql as any).query(
        `INSERT INTO chat_feedback_corrections (
          id, user_query, bot_response, feedback_type, user_correction,
          correction_category, chart_context, domain, status, embedding, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10::vector, NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          user_correction = EXCLUDED.user_correction,
          correction_category = EXCLUDED.correction_category,
          status = EXCLUDED.status,
          embedding = EXCLUDED.embedding;`,
        [
          sanitizedRecord.id,
          sanitizedRecord.userQuery,
          sanitizedRecord.botResponse,
          sanitizedRecord.feedbackType,
          sanitizedRecord.userCorrection || null,
          sanitizedRecord.correctionCategory || null,
          chartContextJson,
          sanitizedRecord.domain,
          sanitizedRecord.status,
          vectorStr,
        ]
      );
    } catch (err) {
      console.warn("[FeedbackDB] Neon save error, saved locally:", err);
    }
  }

  // 2. Local JSON cache persistence
  try {
    const all = readAllFeedbackLocal();
    const existingIdx = all.findIndex((f) => f.id === id);
    if (existingIdx !== -1) {
      all[existingIdx] = sanitizedRecord;
    } else {
      all.push(sanitizedRecord);
    }
    writeAllFeedbackLocal(all);
  } catch (err) {
    console.error("[FeedbackDB] Local write exception:", err);
  }

  return sanitizedRecord;
}

/**
 * Calculates cosine similarity between two 768-dim normalized vectors.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Retrieves verified classical precedent corrections matching the query embedding.
 */
export async function getVerifiedPrecedentCorrections(
  queryEmbedding: number[],
  domain?: string,
  limit: number = 3
): Promise<Array<ChatFeedbackRecord & { similarity: number }>> {
  if (!queryEmbedding || queryEmbedding.length !== 768) return [];

  // Try Neon pgvector first
  if (sql) {
    try {
      await initFeedbackDb();
      const vectorStr = `[${queryEmbedding.join(",")}]`;
      let querySql = `
        SELECT 
          id, user_query, bot_response, feedback_type, user_correction,
          correction_category, chart_context, domain, status, created_at,
          1 - (embedding <=> $1::vector) as similarity
        FROM chat_feedback_corrections
        WHERE status = 'verified_classical'
          AND embedding IS NOT NULL
      `;
      const params: any[] = [vectorStr];

      if (domain && domain !== "general") {
        querySql += ` AND domain = $2`;
        params.push(domain);
      }

      querySql += ` ORDER BY similarity DESC LIMIT ${Math.max(1, limit)};`;

      const rows = await (sql as any).query(querySql, params);
      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
          id: r.id,
          userQuery: r.user_query,
          botResponse: r.bot_response,
          feedbackType: r.feedback_type,
          userCorrection: r.user_correction,
          correctionCategory: r.correction_category,
          chartContext: r.chart_context,
          domain: r.domain,
          status: r.status,
          createdAt: r.created_at,
          similarity: Number(r.similarity),
        }));
      }
    } catch (err) {
      console.warn("[FeedbackDB] Neon precedent retrieval fallback to local:", err);
    }
  }

  // Fallback to local memory / JSON
  const all = readAllFeedbackLocal();
  const eligible = all.filter(
    (f) =>
      f.status === "verified_classical" &&
      f.embedding &&
      f.embedding.length === 768 &&
      (!domain || domain === "general" || f.domain === domain)
  );

  const scored = eligible.map((f) => ({
    ...f,
    similarity: cosineSimilarity(queryEmbedding, f.embedding!),
  }));

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, limit);
}

/**
 * Aggregates feedback statistics for analytics and health monitoring.
 */
export async function getFeedbackStats(): Promise<{
  total: number;
  helpful: number;
  inaccurate: number;
  corrections: number;
  categories: Record<string, number>;
}> {
  const all = readAllFeedbackLocal();
  let helpful = 0;
  let inaccurate = 0;
  let corrections = 0;
  const categories: Record<string, number> = {};

  for (const item of all) {
    if (item.feedbackType === "helpful") helpful++;
    if (item.feedbackType === "inaccurate") inaccurate++;
    if (item.feedbackType === "correction" || item.userCorrection) corrections++;

    if (item.correctionCategory) {
      categories[item.correctionCategory] = (categories[item.correctionCategory] || 0) + 1;
    }
  }

  return {
    total: all.length,
    helpful,
    inaccurate,
    corrections,
    categories,
  };
}
