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
    shortcuts: [
      {
        name: "Ask Acharya AI (Voice)",
        short_name: "Voice AI",
        description: "Open PurohitJI AI consultation directly with microphone ready",
        url: "/?openChat=1&voice=1",
        icons: [{ src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Ask Acharya AI (Chat)",
        short_name: "Astro Chat",
        description: "Open PurohitJI AI consultation chat",
        url: "/?openChat=1",
        icons: [{ src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Today's Panchang",
        short_name: "Panchang",
        description: "Get today's Panchanga, Hora, Choghadiya and Tarabala",
        url: "/?openChat=1&prompt=today%20panchang",
        icons: [{ src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
    ],
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