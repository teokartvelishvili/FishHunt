/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          500: "#10b981",
          600: "#059669",
        },
        amber: {
          500: "#f59e0b",
          600: "#d97706",
        },
        orange: {
          600: "#ea580c",
        },
        rose: {
          500: "#f43f5e",
          600: "#e11d48",
        },
        red: {
          600: "#dc2626",
        },
        slate: {
          500: "#64748b",
          600: "#475569",
        },
        green: {
          600: "#16a34a",
        },
      },
    },
  },
  plugins: [],
};
