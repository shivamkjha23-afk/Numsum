import type { Config } from "tailwindcss";
const config: Config = { darkMode: ["class"], content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"], theme: { extend: { fontFamily: { sans: ["var(--font-inter)"], display: ["var(--font-space-grotesk)"] }, colors: { navy: "#06111f", electric: "#2f80ff" }, boxShadow: { glow: "0 0 60px rgba(47,128,255,.25)" } } }, plugins: [require("tailwindcss-animate")] };
export default config;
