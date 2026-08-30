import { NextRequest, NextResponse } from "next/server";
import { getChartsByEmail, saveChart, deleteChart, normalizeEmail } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email || !normalizeEmail(email)) {
      return NextResponse.json(
        { error: "Email query parameter is required." },
        { status: 400 }
      );
    }

    const charts = getChartsByEmail(email);
    return NextResponse.json({ success: true, charts, count: charts.length });
  } catch (err: any) {
    console.error("Error in GET /api/charts:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userEmail, name, gender, dateIso, location, ayanamsha, houseSystem, isDefault, notes, id } = body;

    if (!userEmail || !normalizeEmail(userEmail)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (!dateIso || isNaN(new Date(dateIso).getTime())) {
      return NextResponse.json(
        { error: "A valid dateIso is required." },
        { status: 400 }
      );
    }

    if (!location || typeof location.latitude !== "number" || typeof location.longitude !== "number") {
      return NextResponse.json(
        { error: "A valid location with latitude and longitude is required." },
        { status: 400 }
      );
    }

    const birthDate = new Date(dateIso);
    const tzOffset = location.timezoneOffsetHours || 0;
    const localMs = birthDate.getTime() + tzOffset * 3600 * 1000;
    const localDate = new Date(localMs);

    const year = localDate.getUTCFullYear();
    const month = String(localDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(localDate.getUTCDate()).padStart(2, "0");
    const hours = String(localDate.getUTCHours()).padStart(2, "0");
    const minutes = String(localDate.getUTCMinutes()).padStart(2, "0");

    const dob = `${year}-${month}-${day}`;
    const time = `${hours}:${minutes}`;

    const savedRecord = saveChart({
      id,
      userEmail: normalizeEmail(userEmail),
      name: name.trim(),
      gender: gender === "female" ? "female" : "male",
      dateIso,
      dob,
      time,
      location: {
        cityName: location.cityName || "Unknown City",
        country: location.country || "India",
        latitude: location.latitude,
        longitude: location.longitude,
        elevation: location.elevation || 0,
        timezoneOffsetHours: tzOffset,
      },
      ayanamsha: ayanamsha || "Lahiri",
      houseSystem: houseSystem || "WholeSign",
      isDefault: Boolean(isDefault),
      notes: notes?.trim(),
    });

    return NextResponse.json({
      success: true,
      chart: savedRecord,
      message: `Birth chart for '${savedRecord.name}' successfully saved!`,
    });
  } catch (err: any) {
    console.error("Error in POST /api/charts:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!id || !email || !normalizeEmail(email)) {
      return NextResponse.json(
        { error: "Both 'id' and 'email' parameters are required to delete a chart." },
        { status: 400 }
      );
    }

    const success = deleteChart(id, email);
    if (!success) {
      return NextResponse.json(
        { error: "Chart not found or unauthorized." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Chart deleted successfully." });
  } catch (err: any) {
    console.error("Error in DELETE /api/charts:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err?.message },
      { status: 500 }
    );
  }
}
