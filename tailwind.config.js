/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aicte: {
          navy: '#0B2545',
          dark: '#13315C',
          blue: '#134074',
          accent: '#EE6C4D',
          gold: '#F39C12',
          light: '#EEF4F8',
          card: '#FFFFFF',
          border: '#D0DBE5'
        }
      }
    },
  },
  plugins: [],
}
