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
        inputbg: '#F3F3F3'
      },
      fontFamily: {
        sans: ['Figtree', 'sans-serif'],
      }
    },
  },
  plugins: [],
}


