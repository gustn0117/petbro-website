import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "1.4" }],
      "3xl": ["1.875rem", { lineHeight: "1.3" }],
      "4xl": ["2.25rem", { lineHeight: "1.2" }],
      "5xl": ["3rem", { lineHeight: "1.1" }],
      "6xl": ["3.75rem", { lineHeight: "1.05" }],
      "7xl": ["4.5rem", { lineHeight: "1" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "0.95" }],
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1a1a1a",
          900: "#0d0d0d",
          800: "#1a1a1a",
          700: "#2a2a2a",
          600: "#3a3a3a",
        },
        brand: {
          DEFAULT: "#0f6e6e",
          50: "#e8f4f4",
          100: "#c5e2e2",
          200: "#9fcece",
          300: "#79baba",
          400: "#5ca6a6",
          500: "#3f9292",
          600: "#2c7e7e",
          700: "#1f6a6a",
          800: "#0f5656",
          900: "#073d3d",
        },
        accent: {
          DEFAULT: "#c8102e",
          warm: "#e85d3a",
        },
        cream: "#f5f1ea",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          '"Helvetica Neue"',
          '"Apple SD Gothic Neo"',
          '"Segoe UI"',
          '"Noto Sans KR"',
          "sans-serif",
        ],
        display: [
          "Montserrat",
          "Pretendard",
          "-apple-system",
          "system-ui",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      animation: {
        "fade-up": "fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fadeIn 1.2s ease-out both",
        "slow-zoom": "slowZoom 12s ease-out both",
        "marquee": "marquee 30s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slowZoom: {
          "0%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
