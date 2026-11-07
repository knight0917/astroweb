import type { Metadata, Viewport } from "next";
import "./globals.css";
import PwaRegister from "../components/PwaRegister";

export const metadata: Metadata = {
  metadataBase: new URL("https://astroweb-swart.vercel.app"),
  title: "PurohitJI AI — Precision Jyotish, 16 Vargas & Classical Engines",
  description:
    "Production-grade Vedic Astrology Platform featuring 3D Celestial SkyDome, 16 Parashari Vargas (D1–D60 with D-10 Career Secret), Vāstu Studio 81, Kundli Milan 36 Gunas, Vimshottari 120Y Dasha, and AI Jyotish Consultation.",
  keywords: [
    "Vedic Astrology",
    "Jyotish",
    "Kundli",
    "Shodashavarga",
    "D10 Dashamsha Career",
    "Vāstu Śāstra",
    "Kundli Milan",
    "Vimshottari Dasha",
    "Shadbala",
    "Panchanga",
    "Tajik Prashna",
    "Ashtakavarga",
    "PurohitJI AI",
  ],
  authors: [{ name: "PurohitJI AI Engineering Team" }],
  openGraph: {
    title: "PurohitJI AI — Precision Jyotish, 16 Vargas & Classical Engines",
    description:
      "Explore 21 classical Vedic astrology engines, real-time 3D SkyDome, D-10 Dasamsa Career Secrets, Vāstu Studio 81, and AI Consultation.",
    url: "https://astroweb-swart.vercel.app",
    siteName: "PurohitJI AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icons/icon.svg",
        width: 512,
        height: 512,
        alt: "PurohitJI AI Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PurohitJI AI — Precision Jyotish & Classical Engines",
    description:
      "Explore 21 classical Vedic astrology engines, real-time 3D SkyDome, D-10 Dasamsa Career Secrets, and Vāstu Studio 81.",
    images: ["/icons/icon.svg"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PurohitJI AI",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen selection:bg-amber-500 selection:text-slate-950">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
