import { NextRequest, NextResponse } from "next/server";
import { signEmailToken } from "@/lib/emailToken";
import { normalizeEmail } from "@/lib/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/auth/email-token
 * Issues a signed HMAC token for a given email address.
 * The token is stored client-side (localStorage) and passed as
 * x-chart-token header or ?token= query param on chart API calls.
 *
 * Body: { email: string }
 * Response: { token: string, email: string, expiresInDays: number }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const normEmail = normalizeEmail(email);
    const token = signEmailToken(normEmail, 30); // 30-day token

    return NextResponse.json({
      token,
      email: normEmail,
      expiresInDays: 30,
    });
  } catch (err: any) {
    console.error("[auth/email-token] Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: err?.message },
      { status: 500 }
    );
  }
}
