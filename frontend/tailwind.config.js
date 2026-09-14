/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#211F1C",
        inksoft: "#5B5647",
        paper: "#F3EFE4",
        paperraised: "#FBF9F3",
        navy: { DEFAULT: "#1F3A5F", soft: "#2C4F7C" },
        gold: { DEFAULT: "#B8862F", soft: "#E3C88A" },
        moss: { DEFAULT: "#3B6E58", soft: "#DCE9E1" },
        rust: { DEFAULT: "#9C4A3C", soft: "#F0DEDA" },
        hairline: "#D9D2BF",
      },
      fontFamily: {
        display: ["Spectral", "serif"],
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
