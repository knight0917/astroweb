"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAstroStore } from "@/store/useAstroStore";
import ComprehensiveReportView from "@/components/ComprehensiveReportView";
import { GeoLocation } from "@/engine/types";

function ReportContent() {
  const searchParams = useSearchParams();
  const { setLocation, setDate, setGender, saveProfile } = useAstroStore();

  useEffect(() => {
    const name = searchParams.get("name");
    const dob = searchParams.get("dob");
    const time = searchParams.get("time");
    const city = searchParams.get("city");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const tz = searchParams.get("tz");
    const gender = searchParams.get("gender") as "male" | "female" | null;

    if (dob && time && city && lat && lon) {
      try {
        const [y, m, d] = dob.split("-").map(Number);
        const [h, min] = time.split(":").map(Number);
        const tzOffsetHours = tz ? parseFloat(tz) : 5.5;
        const tzOffsetMs = tzOffsetHours * 3600 * 1000;

        const localUtcMs = Date.UTC(y, m - 1, d, h, min, 0);
        const targetUtcDate = new Date(localUtcMs - tzOffsetMs);

        const newLoc: GeoLocation = {
          cityName: city,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          timezoneOffsetHours: tzOffsetHours,
        };

        const finalGender: "male" | "female" = gender === "female" ? "female" : "male";
        const finalName = name || "Seeker";

        setLocation(newLoc);
        setDate(targetUtcDate);
        setGender(finalGender);
        saveProfile(finalName, false, finalGender);
      } catch (err) {
        console.error("Failed to parse URL report query parameters:", err);
      }
    }
  }, [searchParams, setLocation, setDate, setGender, saveProfile]);

  return <ComprehensiveReportView />;
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl text-amber-400 animate-spin-slow">
            ☸
          </div>
          <p className="mt-4 font-bold text-sm text-slate-300">
            Generating Your Kundli Life Blueprint...
          </p>
        </div>
      }
    >
      <ReportContent />
    </Suspense>
  );
}
