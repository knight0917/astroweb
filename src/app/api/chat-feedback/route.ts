import { NextRequest, NextResponse } from "next/server";
import { saveChatFeedback, getFeedbackStats, sanitizeFeedbackText, FeedbackType, CorrectionCategory } from "@/lib/feedbackDb";
import { generateEmbedding } from "@/lib/embeddingService";
import { checkRateLimit, extractClientIp } from "@/lib/rateLimiter";

const VALID_CATEGORIES: CorrectionCategory[] = ["bhavas", "timing", "upaya", "calculation", "other"];

export async function POST(req: NextRequest) {
  try {
    const clientIp = extractClientIp(req.headers);
    const rl = checkRateLimit(`chat-feedback:${clientIp}`, 15, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many feedback submissions. Please wait a moment." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const body = await req.json();
    const {
      userQuery,
      botResponse,
      feedbackType,
      userCorrection,
      correctionCategory,
      chartContext,
      domain,
    } = body;

    // 1. Boundary validation
    if (!userQuery || typeof userQuery !== "string" || !userQuery.trim() || userQuery.length > 4000) {
      return NextResponse.json(
        { error: "Valid user query context (<= 4000 chars) is required." },
        { status: 400 }
      );
    }

    if (!botResponse || typeof botResponse !== "string" || !botResponse.trim() || botResponse.length > 24000) {
      return NextResponse.json(
        { error: "Valid bot response context (<= 24000 chars) is required." },
        { status: 400 }
      );
    }

    const validTypes: FeedbackType[] = ["helpful", "inaccurate", "correction"];
    if (!feedbackType || !validTypes.includes(feedbackType)) {
      return NextResponse.json(
        { error: "feedbackType must be 'helpful', 'inaccurate', or 'correction'." },
        { status: 400 }
      );
    }

    const trimmedCorrection =
      typeof userCorrection === "string" ? userCorrection.trim().slice(0, 3000) : "";
    const safeCategory =
      typeof correctionCategory === "string" && VALID_CATEGORIES.includes(correctionCategory as CorrectionCategory)
        ? (correctionCategory as CorrectionCategory)
        : undefined;
    const safeDomain =
      typeof domain === "string" && /^[a-z0-9_-]{1,30}$/i.test(domain.trim())
        ? domain.trim().toLowerCase()
        : "general";

    let safeChartContext: Record<string, unknown> = {};
    if (chartContext && typeof chartContext === "object" && !Array.isArray(chartContext)) {
      const serialized = JSON.stringify(chartContext);
      if (serialized.length <= 8000) {
        safeChartContext = chartContext as Record<string, unknown>;
      }
    }

    let embedding: number[] | undefined;
    // Generate embedding for user correction if provided
    if (trimmedCorrection.length > 0) {
      try {
        const textToEmbed = `${safeDomain} query: ${userQuery.slice(0, 1000)}. Correction: ${trimmedCorrection}`;
        embedding = await generateEmbedding(textToEmbed);
      } catch (embErr) {
        console.warn("[FeedbackAPI] Embedding generation notice:", embErr);
      }
    }

    // Never accept client-supplied IDs on unauthenticated public submissions (prevents row overwrite)
    const saved = await saveChatFeedback({
      userQuery: sanitizeFeedbackText(userQuery.slice(0, 4000)),
      botResponse: sanitizeFeedbackText(botResponse.slice(0, 24000)),
      feedbackType,
      userCorrection: trimmedCorrection ? sanitizeFeedbackText(trimmedCorrection) : undefined,
      correctionCategory: safeCategory,
      chartContext: safeChartContext,
      domain: safeDomain,
      embedding,
      status: "unverified",
    });

    return NextResponse.json({
      success: true,
      feedbackId: saved.id,
      message: "Feedback and correction precedent recorded successfully.",
      status: saved.status,
    });
  } catch (err: unknown) {
    console.error("[FeedbackAPI] Error in POST /api/chat-feedback:", err);
    return NextResponse.json(
      { error: "Failed to record feedback." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = await getFeedbackStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (err: unknown) {
    console.error("[FeedbackAPI] Error in GET /api/chat-feedback:", err);
    return NextResponse.json(
      { error: "Failed to retrieve feedback statistics." },
      { status: 500 }
    );
  }
}
