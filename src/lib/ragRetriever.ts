import { ASTRO_KNOWLEDGE_CORPUS } from "../data/astroKnowledgeCorpus";
import { generateEmbedding } from "./embeddingService";
import { searchNeonSimilarRules, searchInMemorySimilarRules, VectorSearchResult } from "./vectorDb";

/**
 * Strips personal author or contemporary instructor names adhering strictly
 * to the Zero-Name Frontend Rule.
 */
export function sanitizeZeroNames(text: string): string {
  return text
    .replace(/\bDeepanshu\s+Giri\b/gi, "Vedic Traditional Master")
    .replace(/\bNavneet\s+Chitkara\b/gi, "Vedic BTR Master")
    .replace(/\bK\.?\s*N\.?\s*Rao\b/gi, "Senior Traditional Master")
    .replace(/\bB\.?\s*V\.?\s*Raman\b/gi, "Classical Modern Master")
    .replace(/\bC\.?\s*S\.?\s*Patel\b/gi, "Ashtakavarga Master")
    .replace(/\bDr\.?\s*Samir\s+Tripathi\b/gi, "Panchanga Research Master");
}

export type AstroQueryDomain =
  | "marriage"
  | "career"
  | "health"
  | "wealth"
  | "spirituality"
  | "btr"
  | "name_energy"
  | "general";

export interface AstrologicalEntityContext {
  domain: AstroQueryDomain;
  targetHouses: number[];
  targetPlanets: string[];
  expandedQuery: string;
}

/**
 * Detects the astrological domain and maps classical significators (Bhavas and Grahas).
 */
export function detectAstroQueryDomain(query: string): {
  domain: AstroQueryDomain;
  targetHouses: number[];
  targetPlanets: string[];
} {
  const q = query.toLowerCase();

  if (/\b(marri\w*|spouse\w*|husband\w*|wife\w*|wedding\w*|partner\w*|love\w*|divorce\w*|cheat\w*|matchmaking|guna\w*|seventh|7th)\b/i.test(q)) {
    return {
      domain: "marriage",
      targetHouses: [7, 2, 8, 12, 1],
      targetPlanets: ["Venus", "Jupiter", "Mars"],
    };
  }

  if (/\b(career\w*|job\w*|promot\w*|profession\w*|business\w*|work\w*|boss\w*|interview\w*|income stream|office\w*|tenth|10th|d10)\b/i.test(q)) {
    return {
      domain: "career",
      targetHouses: [10, 6, 1, 2, 11],
      targetPlanets: ["Sun", "Saturn", "Mercury", "Mars"],
    };
  }

  if (/\b(wealth\w*|money|financ\w*|rich\w*|debt\w*|loan\w*|asset\w*|saving\w*|invest\w*|property|indu lagna|dhana|second|2nd|eleventh|11th)\b/i.test(q)) {
    return {
      domain: "wealth",
      targetHouses: [2, 11, 9, 5],
      targetPlanets: ["Jupiter", "Venus", "Mercury"],
    };
  }

  if (/\b(health\w*|diet\w*|disease\w*|food\w*|fasting|surgery|illness\w*|pain\w*|body|hospital\w*|rohini|calorie\w*|first|1st|sixth|6th|eighth|8th)\b/i.test(q)) {
    return {
      domain: "health",
      targetHouses: [1, 6, 8, 12, 2],
      targetPlanets: ["Sun", "Moon", "Saturn", "Mars"],
    };
  }

  if (/\b(spirit\w*|moksha|guru\w*|puja\w*|deity|mantra\w*|meditat\w*|temple\w*|ishta|karakamsha|atmakaraka|ninth|9th|twelfth|12th)\b/i.test(q)) {
    return {
      domain: "spirituality",
      targetHouses: [9, 12, 5, 8],
      targetPlanets: ["Jupiter", "Ketu", "Sun"],
    };
  }

  if (/\b(btr|rectif\w*|birth time|exact minute|breath|cord|pranapada|chitkara|umbilical)\b/i.test(q)) {
    return {
      domain: "btr",
      targetHouses: [1],
      targetPlanets: ["Moon", "Venus", "Ketu", "Rahu"],
    };
  }

  if (/\b(name\w*|pronoun\w*|vibrat\w*|phonetic\w*|calling name|spelling\w*|svara)\b/i.test(q)) {
    return {
      domain: "name_energy",
      targetHouses: [1, 2],
      targetPlanets: ["Mercury", "Jupiter", "Venus", "Sun"],
    };
  }

  return {
    domain: "general",
    targetHouses: [1, 5, 9, 10],
    targetPlanets: ["Jupiter", "Sun", "Saturn"],
  };
}

/**
 * Astrological HyDE (Hypothetical Chart-Query Entity Expansion)
 * Expands user query with exact active horoscope placements (Lagna, relevant houses, dasha, and vargas)
 * to anchor vector search into the native's specific planetary combinations.
 */
export function expandQueryWithChartEntities(
  query: string,
  chartDossierOrContext?: string | Record<string, any>
): AstrologicalEntityContext {
  const { domain, targetHouses, targetPlanets } = detectAstroQueryDomain(query);

  let chartHighlights: string[] = [];

  if (typeof chartDossierOrContext === "string" && chartDossierOrContext.length > 0) {
    const text = chartDossierOrContext;

    // 1. Extract Lagna Sign
    const lagnaMatch = text.match(/Ascendant\s*\([^)]*\)\s*:\s*([A-Za-z]+)/i) || text.match(/Lagna\s*:\s*([A-Za-z]+)/i);
    if (lagnaMatch) {
      chartHighlights.push(`Natal Lagna: ${lagnaMatch[1]}`);
    }

    // 2. Extract Active Vimshottari Dasha
    const dashaMatch = text.match(/Active\s*Vimshottari\s*Dasha\s*:\s*([A-Za-z0-9\s–-]+)/i) || text.match(/Current\s*Dasha\s*:\s*([A-Za-z0-9\s–-]+)/i);
    if (dashaMatch) {
      chartHighlights.push(`Active Dasha: ${dashaMatch[1].trim()}`);
    }

    // 3. Extract Target House Sign & Lord
    if (domain === "marriage") {
      const h7Match = text.match(/House\s*7\s*\(([^)]+)\)\s*:\s*Occupants:\s*([^|;\n]+)/i);
      if (h7Match) chartHighlights.push(`7th House: ${h7Match[1]} (Occupants: ${h7Match[2].trim()})`);
    } else if (domain === "career") {
      const h10Match = text.match(/House\s*10\s*\(([^)]+)\)\s*:\s*Occupants:\s*([^|;\n]+)/i);
      if (h10Match) chartHighlights.push(`10th House: ${h10Match[1]} (Occupants: ${h10Match[2].trim()})`);
    } else if (domain === "health") {
      const h6Match = text.match(/House\s*6\s*\(([^)]+)\)\s*:\s*Occupants:\s*([^|;\n]+)/i);
      if (h6Match) chartHighlights.push(`6th House: ${h6Match[1]} (Occupants: ${h6Match[2].trim()})`);
    }
  }

  const contextStr = chartHighlights.length > 0 ? ` Chart Context: ${chartHighlights.join(" | ")}.` : "";
  const expandedQuery = `${query}.${contextStr} Domain: ${domain}. Target Houses: [${targetHouses.join(", ")}]. Target Grahas: [${targetPlanets.join(", ")}].`;

  return {
    domain,
    targetHouses,
    targetPlanets,
    expandedQuery,
  };
}

export interface GroundedRetrievalResponse {
  query: string;
  expandedQuery: string;
  domain: AstroQueryDomain;
  results: VectorSearchResult[];
  groundingText: string;
}

/**
 * Retrieves the most relevant canonical astrological rules from Neon pgvector
 * using Astrological HyDE query expansion with in-memory fallback.
 */
export async function retrieveGroundedAstroKnowledge(
  query: string,
  options: {
    limit?: number;
    userApiKey?: string;
    chartDossier?: string;
    topic?: string;
  } = {}
): Promise<GroundedRetrievalResponse> {
  const limit = options.limit || 4;

  // 1. Apply Astrological HyDE entity expansion
  const { domain, targetHouses, targetPlanets, expandedQuery } = expandQueryWithChartEntities(
    query,
    options.chartDossier
  );

  const searchTopic = options.topic || domain;

  let queryEmbedding: number[] = [];
  try {
    queryEmbedding = await generateEmbedding(expandedQuery, options.userApiKey);
  } catch (err) {
    console.warn("[RAG] Failed to generate embedding for expanded query:", err);
  }

  let results: VectorSearchResult[] = [];

  // 2. Try Neon pgvector first if embedding is valid
  if (queryEmbedding.length === 768) {
    try {
      results = await searchNeonSimilarRules(queryEmbedding, {
        limit,
        topic: searchTopic,
      });
    } catch (err) {
      console.warn("[RAG] Neon search failed, falling back to in-memory:", err);
    }
  }

  // 3. Fallback to in-memory corpus with house/planet condition boosting
  if (results.length === 0) {
    results = searchInMemorySimilarRules(queryEmbedding, ASTRO_KNOWLEDGE_CORPUS, {
      limit,
      topic: searchTopic,
      houses: targetHouses,
      planets: targetPlanets,
    });
  }

  // 4. Format into a structured grounding context for LLM instruction
  if (results.length === 0) {
    return {
      query,
      expandedQuery,
      domain,
      results: [],
      groundingText: "",
    };
  }

  const lines: string[] = [
    `### SHASTRIC & PREDICTIVE GROUNDING CITATIONS (VERIFIED KNOWLEDGE BASE - DOMAIN: ${domain.toUpperCase()})`,
    "The following canonical astrological principles have been retrieved specifically for this query and active horoscope placements. You MUST ground your analysis in these verified rules:",
  ];

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const cleanTitle = sanitizeZeroNames(r.title);
    const cleanSource = sanitizeZeroNames(r.sourceRef);
    const cleanContent = sanitizeZeroNames(r.chunkContent);
    lines.push(
      `${i + 1}. **${cleanTitle}** [Tradition: ${r.tradition} | Source: ${cleanSource} | Relevance: ${(r.similarity * 100).toFixed(0)}%]`,
      `   *Principle:* ${cleanContent}`
    );
  }

  // 5. Query verified active learning precedent corrections if available
  if (queryEmbedding.length === 768) {
    try {
      const { getVerifiedPrecedentCorrections } = await import("./feedbackDb");
      const precedents = await getVerifiedPrecedentCorrections(queryEmbedding, domain, 2);
      if (precedents && precedents.length > 0) {
        lines.push(
          "",
          "### HISTORICAL SHASTRIC CORRECTION PRECEDENTS (VERIFIED ACTIVE LEARNING):",
          "The following verified corrections were logged from expert/native consultations. Strictly adhere to these corrections and do not repeat disputed claims:"
        );
        for (let p = 0; p < precedents.length; p++) {
          const prec = precedents[p];
          lines.push(
            `* [Precedent #${p + 1}] Category: ${prec.correctionCategory || "general"} (Relevance: ${(prec.similarity * 100).toFixed(0)}%)`,
            `  - Disputed Context: "${sanitizeZeroNames(prec.userQuery)}"`,
            `  - Authoritative Correction: "${sanitizeZeroNames(prec.userCorrection || "")}"`
          );
        }
      }
    } catch (precErr) {
      // Non-fatal precedent retrieval
    }
  }

  lines.push(
    "Grounding Instruction: Cite the above principles when synthesizing your answer. If an inquiry asks about a factor not supported by the chart or these rules, state clearly what classical shastras prescribe without inventing ungrounded claims."
  );

  return {
    query,
    expandedQuery,
    domain,
    results,
    groundingText: lines.join("\n"),
  };
}
