/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        forest: "#12372A",
        leaf: "#2E7D32",
        lime: "#DDF95B",
        cream: "#F5F6ED",
        ink: "#1D2824",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["DM Serif Display", "serif"],
      },
    },
  },
  plugins: [],
};
