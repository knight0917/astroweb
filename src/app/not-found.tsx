import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#030712] text-slate-100 p-4">
      <h2 className="text-2xl font-bold text-amber-400 mb-2">404 - Celestial Coordinates Not Found</h2>
      <p className="text-sm text-slate-400 mb-4">The requested sky chart or page could not be located.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg"
      >
        Return to Bhu-Mandala Planetarium
      </Link>
    </div>
  );
}