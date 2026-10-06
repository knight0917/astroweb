import { ASTRO_KNOWLEDGE_CORPUS } from "../src/data/astroKnowledgeCorpus";
import { generateEmbedding } from "../src/lib/embeddingService";
import { initVectorDb, upsertKnowledgeChunks } from "../src/lib/vectorDb";

async function main() {
  console.log(`[SeedCorpus] Starting seeding of ${ASTRO_KNOWLEDGE_CORPUS.length} knowledge chunks...`);

  const dbReady = await initVectorDb();
  console.log(`[SeedCorpus] Vector DB initialized: ${dbReady}`);

  const chunksWithEmbeddings = [];

  for (let i = 0; i < ASTRO_KNOWLEDGE_CORPUS.length; i++) {
    const chunk = ASTRO_KNOWLEDGE_CORPUS[i];
    const textToEmbed = `${chunk.title}. ${chunk.chunkContent} Keywords: ${(chunk.conditions.keywords || []).join(" ")}`;
    console.log(`[SeedCorpus] Embedding (${i + 1}/${ASTRO_KNOWLEDGE_CORPUS.length}): "${chunk.title}"`);
    
    const embedding = await generateEmbedding(textToEmbed);
    chunksWithEmbeddings.push({
      ...chunk,
      embedding,
    });
  }

  const upserted = await upsertKnowledgeChunks(chunksWithEmbeddings);
  console.log(`[SeedCorpus] Successfully embedded and upserted ${upserted} chunks into Neon pgvector!`);
}

main().catch(console.error);
