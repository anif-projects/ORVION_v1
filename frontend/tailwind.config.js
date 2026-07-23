/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          400: '#fb923c',
          500: '#f97316',
          600: '#b45309', // Orvion Copper Bronze
          700: '#9a4900', // Deep Orvion Copper
          800: '#7c2d12',
        },
        secondary: {
          400: '#fbbf24',
          500: '#f59e0b', // Orvion Golden Amber
          600: '#d97706',
        },
        accent: {
          success: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
        },
        light: {
          bg: '#fcfbf9',
          card: '#ffffff',
          border: '#e2e8f0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(154, 73, 0, 0.12)',
        glow: '0 0 20px rgba(180, 83, 9, 0.35)',
      },
      backdropBlur: {
        glass: '16px',
      },
    },
  },
  plugins: [],
};
