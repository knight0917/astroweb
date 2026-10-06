import { sql } from "./neon";

export interface AstroKnowledgeChunk {
  id: string;
  tradition: "Parashari" | "Jaimini" | "Nadi" | "Divisional" | "Panchanga" | "Remedial" | "Synthesis" | "Modern";
  sourceRef: string;
  topic: "marriage" | "career" | "health" | "wealth" | "spirituality" | "longevity" | "btr" | "name_energy" | "general";
  subTopic?: string;
  title: string;
  chunkContent: string;
  conditions: {
    houses?: number[];
    planets?: string[];
    signs?: number[];
    vargas?: string[];
    dashas?: string[];
    keywords?: string[];
  };
  embedding?: number[];
}

export interface VectorSearchResult extends AstroKnowledgeChunk {
  similarity: number;
}

let isDbInitialized = false;

/**
 * Initializes the Neon pgvector extension, table, and HNSW index.
 * Idempotent: safe to run multiple times.
 */
export async function initVectorDb(): Promise<boolean> {
  if (isDbInitialized) return true;
  if (!sql) {
    console.warn("[VectorDB] No SQL client available. Operating in in-memory mode.");
    return false;
  }

  try {
    // 1. Enable pgvector extension
    await (sql as any).query(`CREATE EXTENSION IF NOT EXISTS vector;`);

    // 2. Create knowledge chunks table
    await (sql as any).query(`
      CREATE TABLE IF NOT EXISTS astro_knowledge_chunks (
        id TEXT PRIMARY KEY,
        tradition TEXT NOT NULL,
        source_ref TEXT NOT NULL,
        topic TEXT NOT NULL,
        sub_topic TEXT,
        title TEXT NOT NULL,
        chunk_content TEXT NOT NULL,
        conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
        embedding vector(768) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Create HNSW index for ultra-fast cosine similarity
    await (sql as any).query(`
      CREATE INDEX IF NOT EXISTS astro_knowledge_embedding_hnsw_idx 
      ON astro_knowledge_chunks 
      USING hnsw (embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64);
    `);

    // 4. Create topic index for fast pre-filtering
    await (sql as any).query(`
      CREATE INDEX IF NOT EXISTS idx_astro_knowledge_topic 
      ON astro_knowledge_chunks (topic);
    `);

    isDbInitialized = true;
    return true;
  } catch (err) {
    console.warn("[VectorDB] Initialization note:", err);
    return false;
  }
}

/**
 * Upserts knowledge chunks into Neon pgvector table with idempotency.
 */
export async function upsertKnowledgeChunks(chunks: AstroKnowledgeChunk[]): Promise<number> {
  if (!sql || chunks.length === 0) return 0;
  await initVectorDb();

  let upsertedCount = 0;
  for (const chunk of chunks) {
    if (!chunk.embedding || chunk.embedding.length !== 768) continue;
    try {
      const vectorStr = `[${chunk.embedding.join(",")}]`;
      const conditionsJson = JSON.stringify(chunk.conditions || {});

      await (sql as any).query(
        `INSERT INTO astro_knowledge_chunks (
          id, tradition, source_ref, topic, sub_topic, title, chunk_content, conditions, embedding, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::vector, NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          tradition = EXCLUDED.tradition,
          source_ref = EXCLUDED.source_ref,
          topic = EXCLUDED.topic,
          sub_topic = EXCLUDED.sub_topic,
          title = EXCLUDED.title,
          chunk_content = EXCLUDED.chunk_content,
          conditions = EXCLUDED.conditions,
          embedding = EXCLUDED.embedding,
          updated_at = NOW();`,
        [
          chunk.id,
          chunk.tradition,
          chunk.sourceRef,
          chunk.topic,
          chunk.subTopic || null,
          chunk.title,
          chunk.chunkContent,
          conditionsJson,
          vectorStr,
        ]
      );
      upsertedCount++;
    } catch (err) {
      console.error(`[VectorDB] Failed to upsert chunk ${chunk.id}:`, err);
    }
  }

  return upsertedCount;
}

/**
 * Queries Neon pgvector for similar astrological rules using cosine distance.
 */
export async function searchNeonSimilarRules(
  queryEmbedding: number[],
  options: {
    limit?: number;
    topic?: string;
    minSimilarity?: number;
  } = {}
): Promise<VectorSearchResult[]> {
  if (!sql || queryEmbedding.length !== 768) return [];
  const limit = options.limit || 5;
  const vectorStr = `[${queryEmbedding.join(",")}]`;

  try {
    let rows: any[] = [];
    if (options.topic && options.topic !== "general") {
      rows = await (sql as any).query(
        `SELECT 
          id, tradition, source_ref, topic, sub_topic, title, chunk_content, conditions,
          1 - (embedding <=> $1::vector) AS similarity
        FROM astro_knowledge_chunks
        WHERE topic = $2
        ORDER BY embedding <=> $1::vector
        LIMIT $3;`,
        [vectorStr, options.topic, limit]
      );
    } else {
      rows = await (sql as any).query(
        `SELECT 
          id, tradition, source_ref, topic, sub_topic, title, chunk_content, conditions,
          1 - (embedding <=> $1::vector) AS similarity
        FROM astro_knowledge_chunks
        ORDER BY embedding <=> $1::vector
        LIMIT $2;`,
        [vectorStr, limit]
      );
    }

    return rows.map((r: any) => ({
      id: r.id,
      tradition: r.tradition,
      sourceRef: r.source_ref,
      topic: r.topic,
      subTopic: r.sub_topic || undefined,
      title: r.title,
      chunkContent: r.chunk_content,
      conditions: typeof r.conditions === "string" ? JSON.parse(r.conditions) : r.conditions,
      similarity: Number(r.similarity) || 0,
    }));
  } catch (err) {
    console.warn("[VectorDB] Neon similarity query failed, defaulting to in-memory:", err);
    return [];
  }
}

/**
 * In-memory cosine similarity search over an array of chunks.
 * Guarantees zero latency and offline / local fallback resilience.
 */
export function searchInMemorySimilarRules(
  queryEmbedding: number[],
  corpus: AstroKnowledgeChunk[],
  options: {
    limit?: number;
    topic?: string;
    houses?: number[];
    planets?: string[];
  } = {}
): VectorSearchResult[] {
  const limit = options.limit || 5;
  const results: VectorSearchResult[] = [];

  for (const chunk of corpus) {
    // Topic filtering
    if (options.topic && options.topic !== "general" && chunk.topic !== options.topic && chunk.topic !== "general") {
      continue;
    }

    let score = 0;
    if (chunk.embedding && chunk.embedding.length === queryEmbedding.length) {
      let dot = 0;
      let normA = 0;
      let normB = 0;
      for (let i = 0; i < queryEmbedding.length; i++) {
        dot += queryEmbedding[i] * chunk.embedding[i];
        normA += queryEmbedding[i] * queryEmbedding[i];
        normB += chunk.embedding[i] * chunk.embedding[i];
      }
      const denom = Math.sqrt(normA) * Math.sqrt(normB);
      score = denom > 0 ? dot / denom : 0;
    }

    // Boost score if requested house or planet conditions match
    if (options.houses && chunk.conditions.houses) {
      const houseOverlap = options.houses.some((h) => chunk.conditions.houses?.includes(h));
      if (houseOverlap) score += 0.15;
    }
    if (options.planets && chunk.conditions.planets) {
      const planetOverlap = options.planets.some((p) =>
        chunk.conditions.planets?.some((cp) => cp.toLowerCase() === p.toLowerCase())
      );
      if (planetOverlap) score += 0.15;
    }

    results.push({
      ...chunk,
      similarity: score,
    });
  }

  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, limit);
}
