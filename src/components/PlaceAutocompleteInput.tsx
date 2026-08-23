"use client";

import React, { useState, useEffect, useRef } from "react";
import { GeoLocation } from "@/engine/types";
import { LocationSuggestion, searchLocationSuggestions } from "@/engine/geocoding";

interface PlaceAutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  onSelectLocation: (loc: GeoLocation) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const PlaceAutocompleteInput: React.FC<PlaceAutocompleteInputProps> = ({
  value,
  onChange,
  onSelectLocation,
  placeholder = "Type city, town, or district name (e.g. Mau, Ballia, Delhi, London)...",
  className = "",
  autoFocus = false,
}) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchLocationSuggestions(value);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch (err) {
        console.error("Place search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (sug: LocationSuggestion) => {
    onChange(sug.cityName);
    onSelectLocation({
      cityName: sug.cityName,
      country: sug.country,
      latitude: sug.latitude,
      longitude: sug.longitude,
      elevation: sug.elevation,
      timezoneOffsetHours: sug.timezoneOffsetHours,
    });
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <span className="absolute left-3 text-slate-400 text-sm pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-medium placeholder:text-slate-500 ${className}`}
        />
        {isLoading ? (
          <div className="absolute right-3 w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        ) : value ? (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setSuggestions([]);
              setIsOpen(false);
            }}
            className="absolute right-2.5 text-slate-400 hover:text-slate-200 text-xs w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        ) : null}
      </div>

      {/* Floating Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-950/95 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[999999] backdrop-blur-xl max-h-64 overflow-y-auto custom-scrollbar divide-y divide-slate-800/60">
          <div className="px-3 py-1.5 bg-slate-900/90 text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
            <span>✨ Recommended Places</span>
            <span className="text-slate-400">{suggestions.length} found</span>
          </div>

          {suggestions.map((sug, index) => {
            const isSelected = selectedIndex === index;
            const tzSign = sug.timezoneOffsetHours >= 0 ? "+" : "";
            return (
              <div
                key={`${sug.cityName}-${sug.latitude}-${sug.longitude}-${index}`}
                onClick={() => handleSelect(sug)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`px-3 py-2.5 cursor-pointer flex items-center justify-between gap-2 transition-colors ${
                  isSelected ? "bg-amber-500/20 text-white" : "hover:bg-slate-900/80 text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base text-amber-400 flex-shrink-0">📍</span>
                  <div className="truncate">
                    <div className="font-bold text-xs text-slate-100 flex items-center gap-1.5 truncate">
                      <span>{sug.cityName}</span>
                      {sug.state && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-normal">
                          {sug.state}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({sug.country})
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                      <span>{Math.abs(sug.latitude).toFixed(2)}°{sug.latitude >= 0 ? "N" : "S"}, {Math.abs(sug.longitude).toFixed(2)}°{sug.longitude >= 0 ? "E" : "W"}</span>
                      {sug.elevation ? <span>• {sug.elevation}m</span> : null}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-amber-300 text-[10px] font-mono font-bold">
                    UTC{tzSign}{sug.timezoneOffsetHours}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};