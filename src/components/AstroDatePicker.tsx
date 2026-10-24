"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

export interface AstroDatePickerProps {
  value: string; // ISO date format "YYYY-MM-DD"
  onChange: (newDate: string) => void;
  timezoneLabel?: string; // e.g. "Rome (CEST/CET)"
  className?: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_HEADERS = [
  { short: "Mon", ita: "Lun", isWeekend: false },
  { short: "Tue", ita: "Mar", isWeekend: false },
  { short: "Wed", ita: "Mer", isWeekend: false },
  { short: "Thu", ita: "Gio", isWeekend: false },
  { short: "Fri", ita: "Ven", isWeekend: false },
  { short: "Sat", ita: "Sab", isWeekend: true },
  { short: "Sun", ita: "Dom", isWeekend: true },
];

export default function AstroDatePicker({
  value,
  onChange,
  timezoneLabel = "Rome (CEST/CET)",
  className = "",
}: AstroDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current selected value
  const parsedValue = useMemo(() => {
    const parts = value.split("-").map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return {
        year: parts[0],
        month: parts[1] - 1, // 0-indexed
        day: parts[2],
        dateObj: new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])),
      };
    }
    const now = new Date();
    return {
      year: now.getUTCFullYear(),
      month: now.getUTCMonth(),
      day: now.getUTCDate(),
      dateObj: now,
    };
  }, [value]);

  // Calendar browsing state (which month/year is being viewed in the grid)
  const [viewYear, setViewYear] = useState<number>(parsedValue.year);
  const [viewMonth, setViewMonth] = useState<number>(parsedValue.month);

  // When value prop changes, synchronize the viewed month/year
  useEffect(() => {
    setViewYear(parsedValue.year);
    setViewMonth(parsedValue.month);
  }, [parsedValue.year, parsedValue.month]);

  // Today in Rome / Local ISO
  const todayIso = useMemo(() => {
    const now = new Date();
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Rome",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);
  }, []);

  // Formatted date string for button display: "24 Oct 2026, Sat"
  const formattedDisplay = useMemo(() => {
    try {
      const d = parsedValue.dateObj;
      const day = d.getUTCDate();
      const monthShort = d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
      const year = d.getUTCFullYear();
      const weekday = d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
      return `${day} ${monthShort} ${year} (${weekday})`;
    } catch {
      return value;
    }
  }, [parsedValue, value]);

  // Close calendar popover on click outside or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Generate 42 calendar grid cells (Monday start)
  const calendarCells = useMemo(() => {
    const firstDay = new Date(Date.UTC(viewYear, viewMonth, 1));
    // Monday = 0, ..., Sunday = 6
    const startDayOfWeek = (firstDay.getUTCDay() + 6) % 7;
    const daysInMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();
    const daysInPrevMonth = new Date(Date.UTC(viewYear, viewMonth, 0)).getUTCDate();

    const cells: Array<{
      dayNumber: number;
      isoDate: string;
      isCurrentMonth: boolean;
      isSelected: boolean;
      isToday: boolean;
      isWeekend: boolean;
    }> = [];

    // Trailing days from previous month
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const d = new Date(Date.UTC(viewYear, viewMonth - 1, day));
      const iso = d.toISOString().split("T")[0];
      const dayOfWeek = (d.getUTCDay() + 6) % 7;
      cells.push({
        dayNumber: day,
        isoDate: iso,
        isCurrentMonth: false,
        isSelected: iso === value,
        isToday: iso === todayIso,
        isWeekend: dayOfWeek >= 5,
      });
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(Date.UTC(viewYear, viewMonth, day));
      const iso = d.toISOString().split("T")[0];
      const dayOfWeek = (d.getUTCDay() + 6) % 7;
      cells.push({
        dayNumber: day,
        isoDate: iso,
        isCurrentMonth: true,
        isSelected: iso === value,
        isToday: iso === todayIso,
        isWeekend: dayOfWeek >= 5,
      });
    }

    // Leading days for next month to complete 42 cells
    const remaining = 42 - cells.length;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(Date.UTC(viewYear, viewMonth + 1, day));
      const iso = d.toISOString().split("T")[0];
      const dayOfWeek = (d.getUTCDay() + 6) % 7;
      cells.push({
        dayNumber: day,
        isoDate: iso,
        isCurrentMonth: false,
        isSelected: iso === value,
        isToday: iso === todayIso,
        isWeekend: dayOfWeek >= 5,
      });
    }

    return cells;
  }, [viewYear, viewMonth, value, todayIso]);

  // Year choices for quick selection (1995 to 2035)
  const yearOptions = useMemo(() => {
    const list: number[] = [];
    for (let y = 1995; y <= 2035; y++) {
      list.push(y);
    }
    return list;
  }, []);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDate = (isoDate: string) => {
    onChange(isoDate);
    setIsOpen(false);
  };

  const handleJumpToToday = () => {
    onChange(todayIso);
    const parts = todayIso.split("-").map(Number);
    setViewYear(parts[0]);
    setViewMonth(parts[1] - 1);
    setIsOpen(false);
  };

  const handleJumpToYesterday = () => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 1);
    const iso = d.toISOString().split("T")[0];
    onChange(iso);
    const parts = iso.split("-").map(Number);
    setViewYear(parts[0]);
    setViewMonth(parts[1] - 1);
    setIsOpen(false);
  };

  const handleJumpToLastTradingDay = () => {
    const d = new Date();
    const day = d.getUTCDay(); // 0 is Sun, 6 is Sat
    if (day === 0) {
      // Sunday -> jump back to Friday (-2 days)
      d.setUTCDate(d.getUTCDate() - 2);
    } else if (day === 6) {
      // Saturday -> jump back to Friday (-1 day)
      d.setUTCDate(d.getUTCDate() - 1);
    }
    const iso = d.toISOString().split("T")[0];
    onChange(iso);
    const parts = iso.split("-").map(Number);
    setViewYear(parts[0]);
    setViewMonth(parts[1] - 1);
    setIsOpen(false);
  };

  const handleQuickOffset = (days: number) => {
    const d = new Date(parsedValue.dateObj);
    d.setUTCDate(d.getUTCDate() + days);
    const iso = d.toISOString().split("T")[0];
    onChange(iso);
    const parts = iso.split("-").map(Number);
    setViewYear(parts[0]);
    setViewMonth(parts[1] - 1);
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Calendar Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-700/80 hover:border-amber-400/60 text-slate-100 transition-all shadow-md group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        title="Click to open interactive visual calendar"
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
          <span className="text-sm">📅</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-mono font-bold text-amber-300 group-hover:text-amber-200 tracking-wide">
            {formattedDisplay}
          </span>
          <span className="text-[10px] font-mono text-slate-400 leading-none">
            {timezoneLabel}
          </span>
        </div>
        <span className="text-xs text-slate-400 group-hover:text-amber-400 transition-colors ml-1">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* Floating Calendar Popover Modal */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-80 sm:w-88 bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-4 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
          {/* Header: Month & Year Selector with Navigation */}
          <div className="flex items-center justify-between gap-1 pb-3 border-b border-slate-800">
            <button
              type="button"
              onClick={handlePrevMonth}
              title="Previous Month"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
            >
              ◀
            </button>

            <div className="flex items-center gap-1.5">
              {/* Month Dropdown */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-xs font-bold text-amber-300 rounded-lg px-2 py-1 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx}>
                    {name}
                  </option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-amber-300 rounded-lg px-2 py-1 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              title="Next Month"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
            >
              ▶
            </button>
          </div>

          {/* Weekday Labels (Monday Start) */}
          <div className="grid grid-cols-7 gap-1 pt-2 pb-1 text-center">
            {WEEKDAY_HEADERS.map((day) => (
              <div
                key={day.short}
                className={`text-[10px] font-bold uppercase tracking-wider py-1 ${
                  day.isWeekend ? "text-amber-400/70" : "text-slate-400"
                }`}
                title={day.isWeekend ? "Weekend (Markets Closed for Bullion/Forex)" : "Trading Day"}
              >
                {day.short}
              </div>
            ))}
          </div>

          {/* 42 Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((cell) => {
              const isSelected = cell.isSelected;
              const isToday = cell.isToday;
              const isCurrent = cell.isCurrentMonth;
              const isWeekend = cell.isWeekend;

              return (
                <button
                  key={cell.isoDate}
                  type="button"
                  onClick={() => handleSelectDate(cell.isoDate)}
                  className={`h-8 rounded-lg text-xs font-mono flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/40 ring-2 ring-amber-400 scale-105 z-10"
                      : isToday
                      ? "bg-slate-900 border border-cyan-400/80 text-cyan-300 font-bold hover:bg-slate-800"
                      : isCurrent
                      ? isWeekend
                        ? "text-slate-400 hover:bg-slate-900/90 hover:text-slate-200"
                        : "text-slate-200 hover:bg-slate-800/90 font-medium"
                      : "text-slate-600 hover:bg-slate-900/40 hover:text-slate-400"
                  }`}
                  title={`${cell.isoDate} ${isWeekend ? "(Weekend)" : "(Trading Day)"}`}
                >
                  <span>{cell.dayNumber}</span>
                  {/* Subtle marker dot for today */}
                  {isToday && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-cyan-400 absolute bottom-0.5"></span>
                  )}
                  {/* Subtle marker for active market */}
                  {!isWeekend && isCurrent && !isSelected && !isToday && (
                    <span className="w-0.5 h-0.5 rounded-full bg-slate-600 absolute bottom-0.5 opacity-40"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Preset Actions Bar */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-1.5 text-xs">
            <div className="flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={handleJumpToToday}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/30 transition text-[11px] cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleJumpToYesterday}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition text-[11px] cursor-pointer"
              >
                Yesterday
              </button>
              <button
                type="button"
                onClick={handleJumpToLastTradingDay}
                title="Jump to last active weekday (Friday)"
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition text-[11px] cursor-pointer"
              >
                Last Fri
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleQuickOffset(-7)}
                className="px-1.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition text-[10px] cursor-pointer"
                title="Back 7 days"
              >
                -7d
              </button>
              <button
                type="button"
                onClick={() => handleQuickOffset(-30)}
                className="px-1.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition text-[10px] cursor-pointer"
                title="Back 30 days"
              >
                -30d
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-[11px] font-medium cursor-pointer ml-1"
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
