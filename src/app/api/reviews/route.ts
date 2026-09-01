import { NextRequest, NextResponse } from "next/server";
import { getReviews, saveReview, hasRecentReviewByEmail, normalizeEmail } from "@/lib/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  try {
    const reviews = await getReviews();
    return NextResponse.json({
      success: true,
      reviews,
      count: reviews.length,
    });
  } catch (err: any) {
    console.error("Error in GET /api/reviews:", err);
    return NextResponse.json(
      { error: "Failed to retrieve reviews", details: err?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, description, rating } = body;

    // 1. Validate Name
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }
    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: "Name must be 100 characters or less." },
        { status: 400 }
      );
    }

    // 2. Validate Email
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    // 3. Validate Subject (Strictly Max 20 Characters)
    if (!subject || typeof subject !== "string" || !subject.trim()) {
      return NextResponse.json(
        { error: "Feedback subject is required." },
        { status: 400 }
      );
    }
    if (subject.trim().length > 20) {
      return NextResponse.json(
        { error: "Feedback subject cannot exceed 20 characters." },
        { status: 400 }
      );
    }

    // 4. Validate Description
    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json(
        { error: "Feedback description is required." },
        { status: 400 }
      );
    }
    if (description.trim().length < 3) {
      return NextResponse.json(
        { error: "Feedback description must be at least 3 characters." },
        { status: 400 }
      );
    }
    if (description.trim().length > 3000) {
      return NextResponse.json(
        { error: "Feedback description cannot exceed 3000 characters." },
        { status: 400 }
      );
    }

    // 5. Enforce 1 submission per email per 24 hours (1 day rate limit)
    const hasSubmittedToday = await hasRecentReviewByEmail(email, 24);
    if (hasSubmittedToday) {
      return NextResponse.json(
        {
          error: "You have already submitted feedback today with this email. Only 1 review per day is allowed.",
        },
        { status: 429 }
      );
    }

    // 6. Save to Database
    const savedReview = await saveReview({
      name: name.trim(),
      email: normalizeEmail(email),
      subject: subject.trim().slice(0, 20),
      description: description.trim(),
      rating: typeof rating === "number" ? Math.min(5, Math.max(1, rating)) : 5,
    });

    return NextResponse.json(
      {
        success: true,
        review: savedReview,
        message: "Thank you! Your feedback has been recorded successfully.",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error in POST /api/reviews:", err);
    return NextResponse.json(
      { error: "Failed to submit feedback", details: err?.message },
      { status: 500 }
    );
  }
}
