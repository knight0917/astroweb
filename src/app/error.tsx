"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#030712] text-slate-100 p-4">
      <h2 className="text-2xl font-bold text-red-400 mb-2">Celestial Tracker Encountered an Issue</h2>
      <p className="text-xs text-slate-400 max-w-md text-center mb-4">{error.message || "An unexpected error occurred."}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg cursor-pointer"
      >
        Reload Celestial Engine
      </button>
    </div>
  );
}