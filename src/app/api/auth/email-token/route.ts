import { NextRequest, NextResponse } from "next/server";
import { signEmailToken } from "@/lib/emailToken";
import { normalizeEmail } from "@/lib/db";
import { checkRateLimit, extractClientIp } from "@/lib/rateLimiter";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/auth/email-token
 * Issues a signed HMAC token for a given email address.
 * The token is stored client-side (localStorage) and passed as
 * x-chart-token header on chart API calls.
 *
 * Body: { email: string }
 * Response: { token: string, email: string, expiresInDays: number }
 */
export async function POST(req: NextRequest) {
  try {
    const clientIp = extractClientIp(req.headers);
    const rateLimit = checkRateLimit(`email-token:${clientIp}`, 10, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many token requests. Please wait before retrying." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSec) },
        }
      );
    }

    const body = await req.json();
    const { email } = body;

    if (
      !email ||
      typeof email !== "string" ||
      email.trim().length > 254 ||
      !EMAIL_REGEX.test(email.trim())
    ) {
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
  } catch (err: unknown) {
    console.error("[auth/email-token] Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
