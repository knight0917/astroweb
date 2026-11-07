import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PurohitJI AI — Precision Jyotish & Panchanga",
    short_name: "PurohitJI AI",
    description: "Precision Vedic Astrology, 3D Celestial SkyDome, Kundli, Shadbala & Daily Tithi Calendar",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#0f172a",
    orientation: "any",
    categories: ["astrology", "education", "lifestyle", "utilities"],
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}