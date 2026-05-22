/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f7f0e4', // Warm cream background from palette
        primary: '#2D3748',
        secondary: '#4A5568',
        accent: '#10b981',
        ai: {
          start: '#850f37',
          mid: '#e66983',
          light: '#f6c4c4',
          end: '#ead5df'
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(133, 15, 55, 0.05)',
      },
      backgroundImage: {
        'gradient-ai': 'linear-gradient(135deg, #850f37 0%, #e66983 50%, #f6c4c4 100%)',
      }
    },
  },
  plugins: [],
}
