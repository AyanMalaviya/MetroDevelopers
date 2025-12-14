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
        brand: {
          red: '#b3261e',
          grey: '#2b2b2b',
          dark: '#050509',
        }
      }
    },
  },
  plugins: [],
}
