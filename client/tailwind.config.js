/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vibely: {
          dark: '#0a0b12',
          surface: '#121422',
          card: '#181a2e',
          border: 'rgba(255, 255, 255, 0.08)',
          purple: '#8b5cf6',
          violet: '#7c3aed',
          pink: '#ec4899',
          cyan: '#06b6d4',
          muted: '#94a3b8',
          subtle: '#64748b'
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite'
      }
    },
  },
  plugins: [],
}
