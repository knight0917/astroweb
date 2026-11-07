import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { sql } from "@/lib/neon";

export const dynamic = "force-dynamic";

function isAuthorizedBearer(authHeader: string | null, expectedSecret: string): boolean {
  if (!authHeader) return false;
  const expected = Buffer.from(`Bearer ${expectedSecret}`, "utf8");
  const actual = Buffer.from(authHeader, "utf8");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export async function GET(request: Request) {
  const startTime = Date.now();

  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET?.trim() || "";

  if (process.env.NODE_ENV === "production" && !cronSecret) {
    return NextResponse.json({ error: "Cron secret not configured" }, { status: 503 });
  }
  if (cronSecret && !isAuthorizedBearer(authHeader, cronSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let neonStatus = "not_configured";

  if (sql) {
    try {
      const rows = await sql`SELECT 1 AS ok;`;
      neonStatus = Array.isArray(rows) && rows.length > 0 ? "active" : "empty";
    } catch (err) {
      console.error("[keep-alive] Neon ping error:", err);
      neonStatus = "error";
    }
  }

  const latencyMs = Date.now() - startTime;

  return NextResponse.json({
    status: "ok",
    job: "database_keep_alive",
    neon: neonStatus,
    latencyMs,
    timestamp: new Date().toISOString(),
  });
}
