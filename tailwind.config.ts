import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        vedic: {
          dark: "#050711",
          card: "#0d1326",
          border: "#1d2640",
          gold: "#f59e0b",
          copper: "#d97706",
          saffron: "#ea580c",
          cyan: "#06b6d4",
          violet: "#8b5cf6",
        },
      },
    },
  },
  plugins: [],
};
export default config;
