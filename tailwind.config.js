/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'main': '#00CEFF',
        'light': '#FDFDFD',
        'contrast': '#F2F2F2',
      }
    },
  },
  plugins: [],
}