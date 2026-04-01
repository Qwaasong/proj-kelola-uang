/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#408A71',
        secondary: '#091413',
        inputbg: '#F3F3F3',
        bgMain: '#F5F7F6',
        barChart: '#639E88',
        lineBlue: '#8093F1',
        lineRed: '#FF8A8A'
      },
      fontFamily: {
        sans: ['Figtree', 'sans-serif'],
      }
    },
  },
  plugins: [],
}


