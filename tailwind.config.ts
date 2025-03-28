import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
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
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#004a4a', // Green
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#d3e173', // Yellow (war zuvor Orange #EB552D)
          foreground: '#000000', // Textfarbe auf Gelb geändert zu schwarz für bessere Lesbarkeit
        },
        accent: {
          yellow: '#d3e173', // Yellow
          pink: '#f6b7d3', // Pink
          red: '#e74c3c',  // Rot
          blue: '#b1d6df', // Blue
          orange: '#EB552D', // Orange (verschoben von secondary zu accent)
          foreground: '#000000',
        },
        destructive: {
          DEFAULT: '#e74c3c', // Red
          foreground: '#ffffff'
        },
        muted: {
          DEFAULT: '#95a5a6', // Grey
          foreground: '#000000'
        },
        popover: {
          DEFAULT: '#ecf0f1', // Light Grey
          foreground: '#000000'
        },
        card: {
          DEFAULT: '#ffffff', // White
          foreground: '#000000'
        },
        sidebar: {
          DEFAULT: '#2c3e50', // Dark Grey
          foreground: '#ffffff',
          primary: '#3498db', // Blue
          'primary-foreground': '#ffffff',
          accent: '#9b59b6', // Purple
          'accent-foreground': '#ffffff',
          border: '#95a5a6', // Grey
          ring: '#ecf0f1', // Light Grey
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(10px)' }
        },
        'slide-in': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'slide-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(4px)' }
        },
        'image-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'fade-out': 'fade-out 0.6s ease-out',
        'slide-in': 'slide-in 0.6s ease-out',
        'slide-right': 'slide-right 0.3s ease-out forwards',
        'image-zoom': 'image-zoom 0.3s ease-out forwards'
      }
    }
  },
  plugins: [tailwindAnimate],
} satisfies Config;
