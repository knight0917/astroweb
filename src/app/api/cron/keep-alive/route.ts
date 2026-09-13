import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const startTime = Date.now();

  // If a CRON_SECRET is configured in Vercel environment variables, enforce authentication
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let dbStatus = "disconnected";
  let recordsFound = 0;
  let latencyMs = 0;

  if (supabase) {
    try {
      // Execute a lightweight 1-row select query to keep the PostgreSQL instance active
      const { data, error } = await supabase
        .from("reviews")
        .select("id")
        .limit(1);

      latencyMs = Date.now() - startTime;

      if (!error) {
        dbStatus = "active_keep_alive_success";
        recordsFound = data?.length || 0;
      } else {
        dbStatus = `query_error: ${error.message}`;
      }
    } catch (err: any) {
      latencyMs = Date.now() - startTime;
      dbStatus = `exception: ${err?.message || err}`;
    }
  } else {
    dbStatus = "supabase_client_not_configured";
  }

  return NextResponse.json({
    status: "ok",
    job: "supabase_keep_alive",
    database: dbStatus,
    recordsFound,
    latencyMs,
    timestamp: new Date().toISOString(),
  });
}
