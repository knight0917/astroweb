import { NextRequest, NextResponse } from "next/server";
import { getChartsByEmail, saveChart, deleteChart, normalizeEmail, findExistingChartByEmailAndData } from "@/lib/db";
import { verifyEmailToken } from "@/lib/emailToken";
import { checkRateLimit, extractClientIp } from "@/lib/rateLimiter";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Resolves and verifies the caller's identity from the request.
 * Accepts token strictly via x-chart-token header (avoids URL query token leakage).
 * When isReadOnly=true (e.g. GET passwordless chart restore), allows fallback to claimed email.
 * When isReadOnly=false (e.g. POST/DELETE modifications), strictly requires valid HMAC token.
 * Returns the verified normalized email, or null if unauthorized.
 */
function resolveVerifiedEmail(req: NextRequest, claimedEmail: string, isReadOnly = false): string | null {
  const normClaimed = normalizeEmail(claimedEmail);
  if (!normClaimed || normClaimed.length > 254) return null;

  const token = req.headers.get("x-chart-token")?.trim();

  if (!token) {
    return isReadOnly ? normClaimed : null;
  }

  const verifiedEmail = verifyEmailToken(token);
  if (!verifiedEmail) {
    return isReadOnly ? normClaimed : null;
  }

  // Ensure the token email matches the claimed email in the request
  if (verifiedEmail !== normClaimed) return null;
  return verifiedEmail;
}

export async function GET(req: NextRequest) {
  try {
    const clientIp = extractClientIp(req.headers);
    const rl = checkRateLimit(`charts-get:${clientIp}`, 30, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email || !normalizeEmail(email)) {
      return NextResponse.json(
        { error: "Email query parameter is required." },
        { status: 400 }
      );
    }

    // Verify caller identity via HMAC-signed token (with graceful passwordless read-only fallback)
    const verifiedEmail = resolveVerifiedEmail(req, email, true);
    if (!verifiedEmail) {
      return NextResponse.json(
        { error: "Unauthorized. A valid identity token is required to access charts." },
        { status: 401 }
      );
    }

    const charts = await getChartsByEmail(verifiedEmail);
    return NextResponse.json(
      { success: true, charts, count: charts.length },
      {
        headers: {
          "Cache-Control": "private, no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err: unknown) {
    console.error("Error in GET /api/charts:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = extractClientIp(req.headers);
    const rl = checkRateLimit(`charts-write:${clientIp}`, 20, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many chart save requests. Please wait a moment." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const body = await req.json();
    const { userEmail, name, gender, dateIso, location, ayanamsha, houseSystem, isDefault, notes, id } = body;

    if (!userEmail || typeof userEmail !== "string" || !normalizeEmail(userEmail)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    // Verify caller identity via HMAC-signed token
    const verifiedEmail = resolveVerifiedEmail(req, userEmail);
    if (!verifiedEmail) {
      return NextResponse.json(
        { error: "Unauthorized. A valid identity token is required to save charts." },
        { status: 401 }
      );
    }

    if (!name || typeof name !== "string" || !name.trim() || name.trim().length > 120) {
      return NextResponse.json(
        { error: "A valid chart name (1–120 characters) is required." },
        { status: 400 }
      );
    }

    if (!dateIso || typeof dateIso !== "string" || isNaN(new Date(dateIso).getTime())) {
      return NextResponse.json(
        { error: "A valid dateIso is required." },
        { status: 400 }
      );
    }

    if (
      !location ||
      typeof location.latitude !== "number" ||
      typeof location.longitude !== "number" ||
      !Number.isFinite(location.latitude) ||
      !Number.isFinite(location.longitude) ||
      Math.abs(location.latitude) > 90 ||
      Math.abs(location.longitude) > 180
    ) {
      return NextResponse.json(
        { error: "A valid location with finite latitude [-90, 90] and longitude [-180, 180] is required." },
        { status: 400 }
      );
    }

    const birthDate = new Date(dateIso);
    const rawTz = Number(location.timezoneOffsetHours);
    const tzOffset = Number.isFinite(rawTz) && Math.abs(rawTz) <= 14 ? rawTz : 0;
    const localMs = birthDate.getTime() + tzOffset * 3600 * 1000;
    const localDate = new Date(localMs);

    const year = localDate.getUTCFullYear();
    const month = String(localDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(localDate.getUTCDate()).padStart(2, "0");
    const hours = String(localDate.getUTCHours()).padStart(2, "0");
    const minutes = String(localDate.getUTCMinutes()).padStart(2, "0");
    const seconds = String(localDate.getUTCSeconds()).padStart(2, "0");

    const dob = `${year}-${month}-${day}`;
    const time = seconds !== "00" ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;

    // 1. Check if identical chart already exists on this email (Prevent duplicate data, instruct to sync)
    if (!body.forceOverwrite) {
      const existing = await findExistingChartByEmailAndData(verifiedEmail, {
        id: typeof id === "string" ? id.slice(0, 64) : undefined,
        name: name.trim(),
        dob,
        time,
        dateIso,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      if (existing) {
        return NextResponse.json(
          {
            success: false,
            alreadyExists: true,
            existingChart: existing,
            error: "This chart data is already available on this email. Please sync to restore it.",
            message: `Birth chart for '${existing.name}' is already available on ${verifiedEmail}. Please sync to restore it on this device.`,
          },
          { status: 409 }
        );
      }
    }

    const safeNotes = typeof notes === "string" ? notes.trim().slice(0, 2000) : undefined;
    const safeElevation = Number.isFinite(Number(location.elevation)) ? Number(location.elevation) : 0;

    const savedRecord = await saveChart({
      id: typeof id === "string" && id.trim() ? id.trim().slice(0, 64) : "",
      userEmail: verifiedEmail,
      name: name.trim(),
      gender: gender === "female" ? "female" : "male",
      dateIso,
      dob,
      time,
      location: {
        cityName: String(location.cityName || "Unknown City").slice(0, 120),
        country: String(location.country || "India").slice(0, 120),
        latitude: location.latitude,
        longitude: location.longitude,
        elevation: safeElevation,
        timezoneOffsetHours: tzOffset,
      },
      ayanamsha: typeof ayanamsha === "string" ? ayanamsha.slice(0, 32) : "Lahiri",
      houseSystem: typeof houseSystem === "string" ? houseSystem.slice(0, 32) : "WholeSign",
      isDefault: Boolean(isDefault),
      notes: safeNotes,
    });

    return NextResponse.json({
      success: true,
      chart: savedRecord,
      message: `Birth chart for '${savedRecord.name}' successfully saved!`,
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error && err.message.includes("ownership") ? err.message : undefined;
    if (errMsg) {
      return NextResponse.json({ error: errMsg }, { status: 403 });
    }
    console.error("Error in POST /api/charts:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const clientIp = extractClientIp(req.headers);
    const rl = checkRateLimit(`charts-delete:${clientIp}`, 20, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many delete requests. Please wait a moment." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!id || id.length > 64 || !email || !normalizeEmail(email)) {
      return NextResponse.json(
        { error: "Both 'id' and 'email' parameters are required to delete a chart." },
        { status: 400 }
      );
    }

    // Verify caller identity via HMAC-signed token
    const verifiedEmail = resolveVerifiedEmail(req, email);
    if (!verifiedEmail) {
      return NextResponse.json(
        { error: "Unauthorized. A valid identity token is required to delete charts." },
        { status: 401 }
      );
    }

    const success = await deleteChart(id, verifiedEmail);
    if (!success) {
      return NextResponse.json(
        { error: "Chart not found or unauthorized." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Chart deleted successfully." });
  } catch (err: unknown) {
    console.error("Error in DELETE /api/charts:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
