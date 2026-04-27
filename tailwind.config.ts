import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#bcd9ff",
          300: "#8ec0ff",
          400: "#599cff",
          500: "#3279ff",
          600: "#1a5cf0",
          700: "#1448db",
          800: "#163db1",
          900: "#18398b",
        },
        ink: {
          900: "#0b1220",
          800: "#111a2c",
          700: "#1c2742",
          600: "#384662",
          500: "#5a6783",
          400: "#8290ad",
          300: "#b6becf",
          200: "#dde2ec",
          100: "#eef1f6",
          50: "#f7f9fc",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
        soft: "0 4px 24px -6px rgba(16,24,40,0.08)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
