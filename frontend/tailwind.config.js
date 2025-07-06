/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom dark mode palette
        'text-primary': '#F8EECB',
        'accent-red': '#D23D2D',
        'accent-gold': '#F5C065',
        'accent-green': '#31603D',
        'accent-brown': '#6E433D',
        // Dark backgrounds
        'dark-bg': '#1a1a1a',
        'dark-card': '#2a2a2a',
        'dark-border': '#3a3a3a',
        'dark-hover': '#3f3f3f',
      }
    },
  },
  plugins: [],
} 