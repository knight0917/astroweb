import { NextRequest, NextResponse } from "next/server";
import { saveChatFeedback, getFeedbackStats, sanitizeFeedbackText, FeedbackType, CorrectionCategory } from "@/lib/feedbackDb";
import { generateEmbedding } from "@/lib/embeddingService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      userQuery,
      botResponse,
      feedbackType,
      userCorrection,
      correctionCategory,
      chartContext,
      domain,
    } = body;

    // 1. Validation
    if (!userQuery || typeof userQuery !== "string" || !userQuery.trim()) {
      return NextResponse.json(
        { error: "User query context is required." },
        { status: 400 }
      );
    }

    if (!botResponse || typeof botResponse !== "string" || !botResponse.trim()) {
      return NextResponse.json(
        { error: "Bot response context is required." },
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

    let embedding: number[] | undefined;
    // Generate embedding for user correction if provided
    if (userCorrection && typeof userCorrection === "string" && userCorrection.trim().length > 0) {
      try {
        const textToEmbed = `${domain || "general"} query: ${userQuery}. Correction: ${userCorrection}`;
        embedding = await generateEmbedding(textToEmbed);
      } catch (embErr) {
        console.warn("[FeedbackAPI] Embedding generation notice:", embErr);
      }
    }

    const saved = await saveChatFeedback({
      id: id || undefined,
      userQuery: sanitizeFeedbackText(userQuery),
      botResponse: sanitizeFeedbackText(botResponse),
      feedbackType,
      userCorrection: userCorrection ? sanitizeFeedbackText(userCorrection) : undefined,
      correctionCategory: correctionCategory as CorrectionCategory | undefined,
      chartContext: chartContext || {},
      domain: domain || "general",
      embedding,
      status: "unverified",
    });

    return NextResponse.json({
      success: true,
      feedbackId: saved.id,
      message: "Feedback and correction precedent recorded successfully.",
      status: saved.status,
    });
  } catch (err: any) {
    console.error("[FeedbackAPI] Error in POST /api/chat-feedback:", err);
    return NextResponse.json(
      { error: "Failed to record feedback.", details: err?.message },
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
  } catch (err: any) {
    console.error("[FeedbackAPI] Error in GET /api/chat-feedback:", err);
    return NextResponse.json(
      { error: "Failed to retrieve feedback statistics.", details: err?.message },
      { status: 500 }
    );
  }
}
