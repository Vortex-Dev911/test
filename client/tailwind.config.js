/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          input: '#334155',
          text: '#f8fafc',
          muted: '#94a3b8',
          border: '#334155',
        },
        primary: {
          DEFAULT: '#818cf8',
          hover: '#6366f1',
        },
        secondary: {
          DEFAULT: '#a78bfa',
          hover: '#8b5cf6',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
