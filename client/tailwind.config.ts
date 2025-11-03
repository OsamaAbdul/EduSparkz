import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"], // Enables .dark mode toggle
  content: [
    "./pages/**/*.{ts,tsx,jsx,js}",
    "./components/**/*.{ts,tsx,jsx,js}",
    "./app/**/*.{ts,tsx,jsx,js}",
    "./src/**/*.{ts,tsx,jsx,js}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        /* ---------------------------
         * Brand Color System
         * ---------------------------
         */

        // 🌞 Light Mode
        "brand-light": {
          bg: "#FFFFFF",           // Background (white)
          "bg-secondary": "#ACBDAA", // Accent background
          header: "#1E2D4C",       // Headings / titles
          text: "#858585",         // Regular text
          info: "#CECOBB",         // Secondary soft tone
        },

        // 🌙 Dark Mode
        "brand-dark": {
          bg: "#1E2D4C",           // Background
          "bg-secondary": "#ACBDAA", // Accent background
          header: "#ACBDAA",       // Headings / titles
          text: "#858585",         // Regular text
          info: "#CECOBB",         // Soft text tone
        },

        /* ---------------------------
         * Support for shadcn/ui tokens
         * (optional but recommended)
         * ---------------------------
         */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "#1E2D4C",
          foreground: "#ACBDAA",
        },
        secondary: {
          DEFAULT: "#ACBDAA",
          foreground: "#1E2D4C",
        },
        muted: {
          DEFAULT: "#858585",
          foreground: "#CECOBB",
        },
        accent: {
          DEFAULT: "#CECOBB",
          foreground: "#1E2D4C",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1E2D4C",
        },
      },

      /* ---------------------------
       * Other global configs
       * ---------------------------
       */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
