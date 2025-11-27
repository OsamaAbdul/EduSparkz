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
        // Space Theme Palette
        space: {
          dark: "#0B0E17",
          light: "#1A0E2E",
          card: "rgba(255, 255, 255, 0.06)",
        },
        electric: {
          cyan: "#00F5FF",
          magenta: "#FF2E63",
          lime: "#39FF14",
        },

        // Shadcn/UI mappings
        border: "rgba(255, 255, 255, 0.1)",
        input: "rgba(255, 255, 255, 0.1)",
        ring: "#00F5FF",
        background: "#0B0E17",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#00F5FF",
          foreground: "#0B0E17",
        },
        secondary: {
          DEFAULT: "#FF2E63",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FF2E63",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "rgba(255, 255, 255, 0.1)",
          foreground: "#A1A1AA",
        },
        accent: {
          DEFAULT: "rgba(255, 255, 255, 0.1)",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#1A0E2E",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.06)",
          foreground: "#FFFFFF",
        },
      },
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
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 245, 255, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 245, 255, 0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 8s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "space-gradient": "linear-gradient(to bottom right, #0B0E17, #1A0E2E)",
        "glow-border": "linear-gradient(90deg, #00F5FF, #FF2E63)",
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
