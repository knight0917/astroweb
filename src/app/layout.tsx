import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vedic Sky Tracker — Immersive Jyotish 3D Planetarium",
  description:
    "Explore historical, real-time, and future planetary positions, 27 Nakshatras, Lagna, Rahu/Ketu, Upagrahas, and 3D celestial dome.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
