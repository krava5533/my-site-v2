import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warmwhite: "#F7F5F0",
        stonebeige: "#D8D0C4",
        charcoal: "#242321",
        deepblack: "#111111",
        warmgray: "#8B867D",
        accent: {
          DEFAULT: "#A8845A", // warm brass/bronze luxury accent
          light: "#C7A87D",
          dark: "#7C5F3D",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      maxWidth: {
        "8xl": "1600px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        reveal: {
          "0%": { transform: "scaleX(1)" },
          "100%": { transform: "scaleX(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) forwards",
        reveal: "reveal 1s cubic-bezier(0.22,1,0.36,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
