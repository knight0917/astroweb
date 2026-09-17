"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAstroStore } from "../store/useAstroStore";
import { GeoLocation } from "../engine/types";
import { POPULAR_CITIES } from "../engine/constants";
import { PlaceAutocompleteInput } from "./PlaceAutocompleteInput";

interface BirthDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectToReport?: boolean;
}

export default function BirthDetailsModal({
  isOpen,
  onClose,
  redirectToReport = true,
}: BirthDetailsModalProps) {
  const router = useRouter();
  const {
    location: storeLocation,
    currentDate,
    gender: storeGender,
    activeProfileName,
    setLocation,
    setDate,
    setGender,
    saveProfile,
  } = useAstroStore();

  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState(activeProfileName || "");
  const [gender, setLocalGender] = useState<"male" | "female" | "other">(storeGender || "male");

  // Date and Time strings in local representation
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("12:00");

  // Location
  const [selectedLoc, setSelectedLoc] = useState<GeoLocation>(storeLocation);
  const [citySearch, setCitySearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize form fields from store when opened
  useEffect(() => {
    if (isOpen) {
      setName(activeProfileName === "Live Now" ? "" : (activeProfileName || ""));
      setLocalGender(storeGender || "male");
      setSelectedLoc(storeLocation);
      setCitySearch("");
      setErrorMessage("");

      // Format current store date in local terms
      const tzOffsetMs = (storeLocation.timezoneOffsetHours || 5.5) * 3600 * 1000;
      const localMs = currentDate.getTime() + tzOffsetMs;
      const d = new Date(localMs);

      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");
      const h = String(d.getUTCHours()).padStart(2, "0");
      const min = String(d.getUTCMinutes()).padStart(2, "0");

      setDateStr(`${y}-${m}-${day}`);
      setTimeStr(`${h}:${min}`);
    }
  }, [isOpen, activeProfileName, storeGender, storeLocation, currentDate]);

  if (!mounted || !isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!dateStr) {
      setErrorMessage("Please select your date of birth.");
      return;
    }
    if (!timeStr) {
      setErrorMessage("Please enter your time of birth (approximate if unknown).");
      return;
    }
    if (!selectedLoc || !selectedLoc.cityName) {
      setErrorMessage("Please select your place of birth.");
      return;
    }

    try {
      setIsSubmitting(true);
      const [y, m, d] = dateStr.split("-").map(Number);
      const [h, min] = timeStr.split(":").map(Number);

      const tzOffsetHours = selectedLoc.timezoneOffsetHours ?? 5.5;
      const tzOffsetMs = tzOffsetHours * 3600 * 1000;

      // Local Civil milliseconds treated as UTC, then subtract tz offset to get real UTC
      const localUtcMs = Date.UTC(y, m - 1, d, h, min, 0);
      const targetUtcDate = new Date(localUtcMs - tzOffsetMs);

      const finalName = name.trim() || "Seeker";

      const finalGender: "male" | "female" = gender === "female" ? "female" : "male";

      // Update global Astro store
      setLocation(selectedLoc);
      setDate(targetUtcDate);
      setGender(finalGender);
      saveProfile(finalName, false, finalGender);

      onClose();

      if (redirectToReport) {
        router.push("/report");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to calculate birth chart.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 glass-panel bg-slate-950/95 border border-slate-700/80 w-full max-w-lg rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 my-auto overflow-y-auto max-h-[92vh] custom-scrollbar text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-xl text-slate-950 shadow-lg shadow-amber-500/20 flex-shrink-0">
              ✨
            </div>
            <div>
              <h2 className="font-black text-base sm:text-lg bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Create Your Kundli Life Report
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Zero astrology jargon. 100% personalized life analysis.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-medium animate-in fade-in">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              Full Name (or Preferred Name)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav Sharma / Maya Patel"
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            />
          </div>

          {/* 2. Gender Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["male", "female", "other"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setLocalGender(g)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer capitalize flex items-center justify-center gap-1.5 ${
                    gender === g
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                      : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span>{g === "male" ? "👨 Male" : g === "female" ? "👩 Female" : "🧑 Other"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Date & Time of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                Date of Birth
              </label>
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                required
                className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Time of Birth</span>
                <span className="text-[10px] text-amber-400 font-normal">Accurate time = precise Lagna</span>
              </label>
              <input
                type="time"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                required
                className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          {/* 4. Birth City / Place Search */}
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span>Place of Birth</span>
              <span className="text-[10px] text-slate-400 font-normal">Search any city, town, or village</span>
            </label>
            <PlaceAutocompleteInput
              value={citySearch}
              onChange={setCitySearch}
              onSelectLocation={(loc) => {
                setSelectedLoc(loc);
                setCitySearch("");
              }}
              placeholder="Start typing place (e.g. New Delhi, Varanasi, London, San Jose)..."
            />

            {/* Selected Location Pill */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="text-amber-400">📍</span>
                <span className="font-bold text-slate-200 truncate">
                  {selectedLoc.cityName}{selectedLoc.country ? `, ${selectedLoc.country}` : ""}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono flex-shrink-0">
                {selectedLoc.latitude.toFixed(2)}°N, {selectedLoc.longitude.toFixed(2)}°E (UTC+{selectedLoc.timezoneOffsetHours})
              </span>
            </div>

            {/* Quick Popular City Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_CITIES.slice(0, 8).map((c) => (
                <button
                  key={c.cityName}
                  type="button"
                  onClick={() => setSelectedLoc(c)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                    selectedLoc.cityName === c.cityName
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                  }`}
                >
                  {c.cityName}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <span>{isSubmitting ? "Calculating Blueprint..." : "Generate My Life Report ✨"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
