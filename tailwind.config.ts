// tailwind.config.js
import { mochiui } from "@mochi-ui/theme";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */ module.exports = {
  content: [
    "./node_modules/@mochi-ui/theme/dist/components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [mochiui(), animate],
};
